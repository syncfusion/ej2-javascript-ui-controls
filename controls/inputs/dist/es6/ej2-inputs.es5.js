import { Ajax, Animation, Base, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getInstance, getNumericObject, getUniqueID, getValue, isBlazor, isNullOrUndefined, merge, onIntlChange, remove, removeClass, resetBlazorTemplate, rippleEffect, select, selectAll, setStyleAttribute, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Popup, Tooltip, createSpinner, getZindexPartial, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { SplitButton, getModel } from '@syncfusion/ej2-splitbuttons';

var CLASSNAMES = {
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
    var floatType;
    /**
     * Create a wrapper to input element with multiple span elements and set the basic properties to input based components.
     * ```
     * E.g : Input.createInput({ element: element, floatLabelType : "Auto", properties: { placeholder: 'Search' } });
     * ```
     * @param args
     */
    function createInput(args, internalCreateElement) {
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var inputObject = { container: null, buttons: [], clearButton: null };
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
            var parent = getParentNode(this);
            if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
                || parent.classList.contains('e-filled')) {
                parent.classList.add('e-input-focus');
            }
        });
        args.element.addEventListener('blur', function () {
            var parent = getParentNode(this);
            if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
                || parent.classList.contains('e-filled')) {
                parent.classList.remove('e-input-focus');
            }
        });
        args.element.addEventListener('input', function () {
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
            for (var i = 0; i < args.buttons.length; i++) {
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
        var inputValue = inputElement.value;
        if (inputValue !== '' && !isNullOrUndefined(inputValue)) {
            inputElement.parentElement.classList.add('e-valid-input');
        }
        else if (floatLabelType !== 'Always') {
            inputElement.parentElement.classList.remove('e-valid-input');
        }
    }
    function _focusFn() {
        var label = getParentNode(this).getElementsByClassName('e-float-text')[0];
        addClass([label], CLASSNAMES.LABELTOP);
        if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
            removeClass([label], CLASSNAMES.LABELBOTTOM);
        }
    }
    function _blurFn() {
        var parent = getParentNode(this);
        if ((parent.getElementsByTagName('textarea')[0]) ? parent.getElementsByTagName('textarea')[0].value === '' :
            parent.getElementsByTagName('input')[0].value === '') {
            var label = parent.getElementsByClassName('e-float-text')[0];
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
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var floatLinelement;
        var floatLabelElement;
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
            args.element.addEventListener('input', function (event) {
                updateLabelState(args.element.value, floatLabelElement);
            });
            args.element.addEventListener('blur', function (event) {
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
            for (var _i = 0, _a = Object.keys(args.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
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
        var parentNode = element.parentNode;
        return parentNode;
    }
    /**
     * To create clear button.
     */
    function createClearButton(element, inputObject, initial, internalCreateElement) {
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var button = makeElement('span', { className: CLASSNAMES.CLEARICON });
        var container = inputObject.container;
        if (!isNullOrUndefined(initial)) {
            container.appendChild(button);
        }
        else {
            var baseElement = inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT) ?
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
        button.addEventListener('click', function (event) {
            if (!(element.classList.contains(CLASSNAMES.DISABLE) || element.readOnly)) {
                event.preventDefault();
                if (element !== document.activeElement) {
                    element.focus();
                }
                element.value = '';
                addClass([button], CLASSNAMES.CLEARICONHIDE);
            }
        });
        element.addEventListener('input', function (event) {
            updateIconState(element.value, button);
        });
        element.addEventListener('focus', function (event) {
            updateIconState(element.value, button);
        });
        element.addEventListener('blur', function (event) {
            setTimeout(function () { addClass([button], CLASSNAMES.CLEARICONHIDE); }, 200);
        });
    }
    function validateLabel(element, floatLabelType) {
        var parent = getParentNode(element);
        if (parent.classList.contains(CLASSNAMES.FLOATINPUT) && floatLabelType === 'Auto') {
            var label = getParentNode(element).getElementsByClassName('e-float-text')[0];
            updateLabelState(element.value, label);
        }
    }
    /**
     * To create input box contianer.
     */
    function createInputContainer(args, className, tagClass, tag, internalCreateElement) {
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var container;
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
        var result = '';
        if (!isNullOrUndefined(placeholder) && placeholder !== '') {
            var spanEle = document.createElement('span');
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
            var parentElement = getParentNode(element);
            if (!isNullOrUndefined(parentElement)) {
                var button = parentElement.getElementsByClassName(CLASSNAMES.CLEARICON)[0];
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
        var parentElement;
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
        var disabledAttrs = { 'disabled': 'disabled', 'aria-disabled': 'true' };
        var considerWrapper = isNullOrUndefined(inputContainer) ? false : true;
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
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
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
        for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
            var key = _a[_i];
            var parentElement = void 0;
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
        for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
            var key = _a[_i];
            var parentElement = void 0;
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
        var container = input.container;
        if (!isNullOrUndefined(container) && container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            var inputEle = container.querySelector('textarea') ? container.querySelector('textarea') :
                container.querySelector('input');
            var placeholder = container.querySelector('.' + CLASSNAMES.FLOATTEXT).textContent;
            var clearButton = container.querySelector('.e-clear-icon') !== null;
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
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var container = closest(input, '.' + CLASSNAMES.INPUTGROUP);
        floatType = type;
        if (type !== 'Never') {
            var customTag = container.tagName;
            customTag = customTag !== 'DIV' && customTag !== 'SPAN' ? customTag : null;
            var args = { element: input, floatLabelType: type, customTag: customTag, properties: { placeholder: placeholder } };
            var iconEle = container.querySelector('.e-clear-icon');
            var inputObj = { container: container };
            input.classList.remove(CLASSNAMES.INPUT);
            createFloatingInput(args, inputObj, makeElement);
            if (isNullOrUndefined(iconEle)) {
                iconEle = container.querySelector('.e-input-group-icon');
            }
            if (isNullOrUndefined(iconEle)) {
                container.classList.remove(CLASSNAMES.INPUTGROUP);
            }
            else {
                var floatLine = container.querySelector('.' + CLASSNAMES.FLOATLINE);
                var floatText = container.querySelector('.' + CLASSNAMES.FLOATTEXT);
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
        for (var i = 0; i < inputObj.length; i++) {
            _internalRipple(isRipple, inputObj[i].container);
        }
    }
    Input.setRipple = setRipple;
    function _internalRipple(isRipple, container, button) {
        var argsButton = [];
        argsButton.push(button);
        var buttons = isNullOrUndefined(button) ?
            container.querySelectorAll('.e-input-group-icon') : argsButton;
        if (isRipple && buttons.length > 0) {
            for (var index = 0; index < buttons.length; index++) {
                buttons[index].addEventListener('mousedown', _onMouseDownRipple, false);
                buttons[index].addEventListener('mouseup', _onMouseUpRipple, false);
            }
        }
        else if (buttons.length > 0) {
            for (var index = 0; index < buttons.length; index++) {
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
        var ele = this;
        var parentEle = this.parentElement;
        while (!parentEle.classList.contains('e-input-group')) {
            parentEle = parentEle.parentElement;
        }
        _onMouseRipple(parentEle, ele);
    }
    function _onMouseUpRipple() {
        var ele = this;
        setTimeout(function () { ele.classList.remove('e-input-btn-ripple'); }, 500);
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
        var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        var button = makeElement('span', { className: iconClass });
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

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-control-wrapper e-numeric';
var SPINICON = 'e-input-group-icon';
var SPINUP = 'e-spin-up';
var SPINDOWN = 'e-spin-down';
var ERROR = 'e-error';
var INCREMENT = 'increment';
var DECREMENT = 'decrement';
var INTREGEXP = new RegExp('^(-)?(\\d*)$');
var DECIMALSEPARATOR = '.';
var COMPONENT = 'e-numerictextbox';
var CONTROL = 'e-control';
var NUMERIC_FOCUS = 'e-input-focus';
var wrapperAttributes = ['title', 'style', 'class'];
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
var NumericTextBox = /** @__PURE__ @class */ (function (_super) {
    __extends(NumericTextBox, _super);
    function NumericTextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.numericOptions = options;
        return _this;
    }
    NumericTextBox.prototype.preRender = function () {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        var ejInstance = getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = closest(this.element, 'form');
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            var input = this.createElement('input');
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                var attributeName = this.element.attributes[index].nodeName;
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
        var localeText = { incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder };
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
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    NumericTextBox.prototype.render = function () {
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
    };
    NumericTextBox.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
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
                            var setNumber = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            this.setProperties(setValue(prop, setNumber, {}), !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                            var minValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (minValue !== null && !isNaN(minValue)) {
                                this.setProperties(setValue(prop, minValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                            var maxValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (maxValue !== null && !isNaN(maxValue)) {
                                this.setProperties(setValue(prop, maxValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'step':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                            var stepValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
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
                        var value = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                            this.setProperties(setValue(prop, value, {}), true);
                        }
                        break;
                }
            }
        }
    };
    NumericTextBox.prototype.updatePlaceholder = function () {
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
    };
    NumericTextBox.prototype.initCultureFunc = function () {
        this.instance = new Internationalization(this.locale);
    };
    NumericTextBox.prototype.initCultureInfo = function () {
        this.cultureInfo.format = this.format;
        if (getValue('currency', this) !== null) {
            setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    };
    /* Wrapper creation */
    NumericTextBox.prototype.createWrapper = function () {
        var inputObj = Input.createInput({
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
    };
    NumericTextBox.prototype.updateHTMLAttrToElement = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    };
    NumericTextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        addClass([this.container], this.htmlAttributes[pro].split(' '));
                    }
                    else if (pro === 'style') {
                        var numericStyle = this.container.getAttribute(pro);
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
    };
    /* Spinner creation */
    NumericTextBox.prototype.spinBtnCreation = function () {
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
    };
    NumericTextBox.prototype.validateMinMax = function () {
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
    };
    NumericTextBox.prototype.formattedValue = function (decimals, value) {
        return this.instance.getNumberFormat({
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals, useGrouping: false
        })(value);
    };
    NumericTextBox.prototype.validateStep = function () {
        if (this.decimals !== null) {
            this.setProperties({ step: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.step)) }, true);
        }
    };
    NumericTextBox.prototype.action = function (operation, event) {
        this.isInteract = true;
        var value = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
        this.changeValue(this.performAction(value, this.step, operation));
        this.raiseChangeEvent(event);
    };
    NumericTextBox.prototype.checkErrorClass = function () {
        if (this.isValidState) {
            removeClass([this.container], ERROR);
        }
        else {
            addClass([this.container], ERROR);
        }
        attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    };
    NumericTextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    };
    NumericTextBox.prototype.resetHandler = function (e) {
        e.preventDefault();
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide'))) {
            this.clear(e);
        }
        this.isInteract = true;
        this.raiseChangeEvent(e);
    };
    NumericTextBox.prototype.clear = function (event) {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
    };
    NumericTextBox.prototype.resetFormHandler = function () {
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.updateValue(null);
        }
        else {
            this.updateValue(this.inputEleValue);
        }
    };
    NumericTextBox.prototype.setSpinButton = function () {
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
    };
    NumericTextBox.prototype.wireEvents = function () {
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
    };
    NumericTextBox.prototype.wireSpinBtnEvents = function () {
        /* bind spin button events */
        EventHandler.add(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    };
    NumericTextBox.prototype.unwireEvents = function () {
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
    };
    NumericTextBox.prototype.unwireSpinBtnEvents = function () {
        /* unbind spin button events */
        EventHandler.remove(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner);
    };
    NumericTextBox.prototype.changeHandler = function (event) {
        event.stopPropagation();
        if (!this.element.value.length) {
            this.setProperties({ value: null }, true);
        }
        var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    };
    NumericTextBox.prototype.raiseChangeEvent = function (event) {
        if (this.prevValue !== this.value) {
            var eventArgs = {};
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
    };
    NumericTextBox.prototype.pasteHandler = function () {
        var _this = this;
        if (!this.enabled || this.readonly) {
            return;
        }
        var beforeUpdate = this.element.value;
        setTimeout(function () {
            if (!_this.numericRegex().test(_this.element.value)) {
                _this.setElementValue(beforeUpdate);
            }
        });
    };
    NumericTextBox.prototype.preventHandler = function () {
        var _this = this;
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(function () {
            if (_this.element.selectionStart > 0) {
                var currentPos = _this.element.selectionStart;
                var prevPos = _this.element.selectionStart - 1;
                var start = 0;
                var ignoreKeyCode = void 0;
                var valArray = _this.element.value.split('');
                var numericObject = getNumericObject(_this.locale);
                var decimalSeparator = getValue('decimal', numericObject);
                ignoreKeyCode = decimalSeparator.charCodeAt(0);
                if (_this.element.value[prevPos] === ' ' && _this.element.selectionStart > 0 && !iOS) {
                    if (isNullOrUndefined(_this.prevVal)) {
                        _this.element.value = _this.element.value.trim();
                    }
                    else if (prevPos !== 0) {
                        _this.element.value = _this.prevVal;
                    }
                    else if (prevPos === 0) {
                        _this.element.value = _this.element.value.trim();
                    }
                    _this.element.setSelectionRange(prevPos, prevPos);
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) &&
                    _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 1]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 1]) &&
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 1].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.value = _this.element.value.substring(0, prevPos) +
                            _this.element.value.substring(currentPos, _this.element.value.length);
                        _this.element.setSelectionRange(prevPos, prevPos);
                        if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1])) && _this.element.selectionStart > 0
                            && _this.element.value.length) {
                            _this.preventHandler();
                        }
                    }
                }
                else if (isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 2])) && _this.element.selectionStart > 1 &&
                    _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(_this.element.value[_this.element.selectionStart - 2]) !==
                        valArray.lastIndexOf(_this.element.value[_this.element.selectionStart - 2]) &&
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) === ignoreKeyCode) ||
                        _this.element.value[_this.element.selectionStart - 2].charCodeAt(0) !== ignoreKeyCode) {
                        _this.element.setSelectionRange(prevPos, prevPos);
                        _this.nextEle = _this.element.value[_this.element.selectionStart];
                        _this.cursorPosChanged = true;
                        _this.preventHandler();
                    }
                }
                if (_this.cursorPosChanged === true && _this.element.value[_this.element.selectionStart] === _this.nextEle &&
                    isNaN(parseFloat(_this.element.value[_this.element.selectionStart - 1]))) {
                    _this.element.setSelectionRange(_this.element.selectionStart + 1, _this.element.selectionStart + 1);
                    _this.cursorPosChanged = false;
                    _this.nextEle = null;
                }
                if (_this.element.value.trim() === '') {
                    _this.element.setSelectionRange(start, start);
                }
                if (_this.element.selectionStart > 0) {
                    if ((_this.element.value[_this.element.selectionStart - 1].charCodeAt(0) === 45) && _this.element.selectionStart > 1) {
                        if (isNullOrUndefined(_this.prevVal)) {
                            _this.element.value = _this.element.value;
                        }
                        else {
                            _this.element.value = _this.prevVal;
                        }
                        _this.element.setSelectionRange(_this.element.selectionStart, _this.element.selectionStart);
                    }
                }
                _this.prevVal = _this.element.value;
            }
        });
    };
    NumericTextBox.prototype.keyUpHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && Browser.isDevice) {
            this.preventHandler();
        }
        var parseValue = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        var formElement = closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    
    NumericTextBox.prototype.inputHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        var fireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && Browser.isDevice) {
            this.preventHandler();
        }
    };
    
    NumericTextBox.prototype.keyDownHandler = function (event) {
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
    };
    
    NumericTextBox.prototype.performAction = function (value, step, operation) {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        var updatedValue = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    };
    
    NumericTextBox.prototype.correctRounding = function (value, step, result) {
        var floatExp = new RegExp('[,.](.*)');
        var valueText = value.toString();
        var stepText = step.toString();
        var floatValue = floatExp.test(value.toString());
        var floatStep = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            var valueCount = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            var stepCount = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            var max = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    };
    
    NumericTextBox.prototype.roundValue = function (result, precision) {
        precision = precision || 0;
        var divide = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    };
    
    NumericTextBox.prototype.updateValue = function (value, event) {
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
    };
    NumericTextBox.prototype.updateCurrency = function (prop, propVal) {
        setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    };
    NumericTextBox.prototype.changeValue = function (value) {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        }
        else {
            var numberOfDecimals = void 0;
            var decimalPart = value.toString().split('.')[1];
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
    };
    
    NumericTextBox.prototype.modifyText = function () {
        if (this.value || this.value === 0) {
            var value = this.formatNumber();
            var elementValue = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = this.value.toString();
        }
        else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    };
    
    NumericTextBox.prototype.setElementValue = function (val, element) {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    };
    NumericTextBox.prototype.validateState = function () {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    };
    NumericTextBox.prototype.formatNumber = function () {
        var numberOfDecimals;
        var currentValue = this.value;
        var decimalPart = currentValue.toString().split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    };
    
    NumericTextBox.prototype.trimValue = function (value) {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    };
    
    NumericTextBox.prototype.roundNumber = function (value, precision) {
        var result = value;
        var decimals = precision || 0;
        var result1 = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        var result2 = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    };
    
    NumericTextBox.prototype.cancelEvent = function (event) {
        event.preventDefault();
        return false;
    };
    NumericTextBox.prototype.keyPressHandler = function (event) {
        if (!this.enabled || this.readonly) {
            return true;
        }
        if (!Browser.isDevice && Browser.info.version === '11.0' && event.keyCode === 13) {
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
        }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) {
            return true;
        }
        var currentChar = String.fromCharCode(event.which);
        var text = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        else {
            return true;
        }
    };
    
    NumericTextBox.prototype.numericRegex = function () {
        var numericObject = getNumericObject(this.locale);
        var decimalSeparator = getValue('decimal', numericObject);
        var fractionRule = '*';
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
    };
    
    NumericTextBox.prototype.mouseWheel = function (event) {
        event.preventDefault();
        var delta;
        var rawEvent = event;
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
    };
    NumericTextBox.prototype.focusHandler = function (event) {
        var _this = this;
        this.focusEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('focus', this.focusEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        this.isFocused = true;
        removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            var formatValue_1 = this.formatNumber();
            this.setElementValue(formatValue_1);
            if (!this.isPrevFocused) {
                if (!Browser.isDevice && Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue_1.length);
                }
                else {
                    var delay = (Browser.isDevice && Browser.isIos) ? 600 : 0;
                    setTimeout(function () {
                        _this.element.setSelectionRange(0, formatValue_1.length);
                    }, delay);
                }
            }
        }
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
        }
    };
    
    NumericTextBox.prototype.focusOutHandler = function (event) {
        var _this = this;
        this.blurEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('blur', this.blurEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isPrevFocused) {
            event.preventDefault();
            if (Browser.isDevice) {
                var value_1 = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                var ele_1 = this.element;
                setTimeout(function () {
                    _this.setElementValue(value_1, ele_1);
                }, 200);
            }
        }
        else {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!Browser.isDevice) {
                EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        var formElement = closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var focusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    };
    
    NumericTextBox.prototype.mouseDownOnSpinner = function (event) {
        var _this = this;
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var result = this.getElementData(event);
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(function () { _this.isCalled = true; _this.action(action, event); }, 150);
        EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    };
    NumericTextBox.prototype.touchMoveOnSpinner = function (event) {
        var target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    };
    NumericTextBox.prototype.mouseUpOnSpinner = function (event) {
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
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        var formElement = closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    NumericTextBox.prototype.getElementData = function (event) {
        if ((event.which && event.which === 3) || (event.button && event.button === 2)
            || !this.enabled || this.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    };
    NumericTextBox.prototype.floatLabelTypeUpdate = function () {
        Input.removeFloating(this.inputWrapper);
        var hiddenInput = this.hiddenInput;
        this.hiddenInput.remove();
        Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    };
    NumericTextBox.prototype.mouseUpClick = function (event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
    };
    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    NumericTextBox.prototype.increment = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    NumericTextBox.prototype.decrement = function (step) {
        if (step === void 0) { step = this.step; }
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    NumericTextBox.prototype.destroy = function () {
        var _this = this;
        this.unwireEvents();
        detach(this.hiddenInput);
        if (this.showSpinButton) {
            this.unwireSpinBtnEvents();
            detach(this.spinUp);
            detach(this.spinDown);
        }
        var attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete', 'tabindex', 'aria-valuemin',
            'aria-valuemax', 'aria-live', 'aria-valuenow', 'aria-invalid'];
        attrArray.forEach(function (value) {
            _this.element.removeAttribute(value);
        });
        this.element.classList.remove('e-input');
        this.container.insertAdjacentElement('afterend', this.element);
        detach(this.container);
        _super.prototype.destroy.call(this);
    };
    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    NumericTextBox.prototype.getText = function () {
        return this.element.value;
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    NumericTextBox.prototype.focusIn = function () {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.container], [NUMERIC_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    NumericTextBox.prototype.focusOut = function () {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.container], [NUMERIC_FOCUS]);
        }
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    NumericTextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    NumericTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                    var propVal = getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    var propValue = getValue(prop, newProp);
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
    };
    /**
     * Gets the component name
     * @private
     */
    NumericTextBox.prototype.getModuleName = function () {
        return 'numerictextbox';
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
    return NumericTextBox;
}(Component));

/**
 * NumericTextBox modules
 */

/**
 * MaskedTextBox base module
 */
var ERROR$1 = 'e-error';
var INPUTGROUP = 'e-input-group';
var FLOATINPUT = 'e-float-input';
var UTILMASK = 'e-utility-mask';
var TOPLABEL = 'e-label-top';
var BOTTOMLABEL = 'e-label-bottom';
/**
 * @hidden
 * Built-in masking elements collection.
 */
var regularExpressions = {
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
        var splitMask = this.mask.split(']');
        for (var i = 0; i < splitMask.length; i++) {
            if (splitMask[i][splitMask[i].length - 1] === '\\') {
                splitMask[i] = splitMask[i] + ']';
                var splitInnerMask = splitMask[i].split('[');
                for (var j = 0; j < splitInnerMask.length; j++) {
                    if (splitInnerMask[j][splitInnerMask[j].length - 1] === '\\') {
                        splitInnerMask[j] = splitInnerMask[j] + '[';
                    }
                    pushIntoRegExpCollec.call(this, splitInnerMask[j]);
                }
            }
            else {
                var splitInnerMask = splitMask[i].split('[');
                if (splitInnerMask.length > 1) {
                    var chkSpace = false;
                    for (var j = 0; j < splitInnerMask.length; j++) {
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
            for (var i = 0; i < this.promptMask.length; i++) {
                if (!isNullOrUndefined(this.customCharacters[this.promptMask[i]])) {
                    this.promptMask = this.promptMask.replace(new RegExp(this.promptMask[i], 'g'), this.promptChar);
                }
            }
        }
        var escapeNumber = 0;
        if (this.hiddenMask.match(new RegExp(/\\/))) {
            for (var i = 0; i < this.hiddenMask.length; i++) {
                var j = 0;
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
    var value = this.element.value;
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
    var value = '';
    var k = 0;
    var checkMask = false;
    var maskValue = (!isNullOrUndefined(maskValues)) ? maskValues : (!isNullOrUndefined(element) &&
        !isNullOrUndefined(this)) ? element.value : maskValues;
    if (maskValue !== this.promptMask) {
        for (var i = 0; i < this.customRegExpCollec.length; i++) {
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
    for (var k = 0; k < value.length; k++) {
        this.hiddenMask += value[k];
        if (value[k] !== '\\') {
            this.customRegExpCollec.push(value[k]);
        }
    }
}
function maskInputFocusHandler(event) {
    var _this = this;
    var eventArgs = {
        selectionStart: 0,
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: this.inputObj.container,
        selectionEnd: (this.promptMask.length > 0) ? this.promptMask.length : this.element.value.length,
    };
    this.trigger('focus', eventArgs, function (eventArgs) {
        if (_this.mask) {
            _this.isFocus = true;
            if (_this.element.value === '') {
                setElementValue.call(_this, _this.promptMask);
            }
            else {
                setElementValue.call(_this, _this.element.value);
            }
            if (!Browser.isDevice && Browser.info.version === '11.0') {
                _this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
            }
            else {
                var delay = (Browser.isDevice && Browser.isIos) ? 450 : 0;
                setTimeout(function () {
                    _this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
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
            var labelElement = this.element.parentNode.querySelector('.e-float-text');
            if (this.floatLabelType === 'Auto' && !isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL)) {
                removeClass([labelElement], TOPLABEL);
            }
        }
    }
}
function maskInputPasteHandler(event) {
    var _this = this;
    if (this.mask && !this.readonly) {
        var sIndex_1 = this.element.selectionStart;
        var eIndex_1 = this.element.selectionEnd;
        var oldValue_1 = this.element.value;
        setElementValue.call(this, '');
        this._callPasteHandler = true;
        setTimeout(function () {
            var value = _this.element.value.replace(/ /g, '');
            if (_this.redoCollec.length > 0 && _this.redoCollec[0].value === _this.element.value) {
                value = strippedValue.call(_this, _this.element);
            }
            setElementValue.call(_this, oldValue_1);
            _this.element.selectionStart = sIndex_1;
            _this.element.selectionEnd = eIndex_1;
            var i = 0;
            _this.maskKeyPress = true;
            do {
                validateValue.call(_this, value[i], false, null);
                ++i;
            } while (i < value.length);
            _this.maskKeyPress = false;
            _this._callPasteHandler = false;
            if (_this.element.value === oldValue_1) {
                var i_1 = 0;
                _this.maskKeyPress = true;
                do {
                    validateValue.call(_this, value[i_1], false, null);
                    ++i_1;
                } while (i_1 < value.length);
                _this.maskKeyPress = false;
            }
            else {
                triggerMaskChangeEvent.call(_this, event, oldValue_1);
            }
        }, 1);
    }
}
function maskInputCutHandler(event) {
    var _this = this;
    if (this.mask && !this.readonly) {
        var preValue_1 = this.element.value;
        var sIndex_2 = this.element.selectionStart;
        var eIndex = this.element.selectionEnd;
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd });
        var value_1 = this.element.value.substring(0, sIndex_2) + this.promptMask.substring(sIndex_2, eIndex) +
            this.element.value.substring(eIndex);
        setTimeout(function () {
            setElementValue.call(_this, value_1);
            _this.element.selectionStart = _this.element.selectionEnd = sIndex_2;
            if (_this.element.value !== preValue_1) {
                triggerMaskChangeEvent.call(_this, event, null);
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
    var eventArgs = { ctrlKey: false, keyCode: 229 };
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
            var startIndex = this.element.selectionStart;
            var addedValues = this.element.value.length - this.promptMask.length;
            var value = this.element.value.substring(startIndex - addedValues, startIndex);
            this.maskKeyPress = false;
            var i = 0;
            do {
                validateValue.call(this, value[i], event.ctrlKey, event);
                ++i;
            } while (i < value.length);
            if (this.element.value !== this.preEleVal) {
                triggerMaskChangeEvent.call(this, event, null);
            }
        }
        var val = strippedValue.call(this, this.element);
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
        var startValue = this.element.value;
        if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
            var collec = void 0;
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
    var collec;
    var sIndex = this.element.selectionStart;
    var eIndex = this.element.selectionEnd;
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
    var isRemove = false;
    var oldEventVal;
    var isDeleted = false;
    if (this.element.value.length < this.promptMask.length) {
        isRemove = true;
        oldEventVal = this.element.value;
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
        mobileRemoveFunction.call(this);
    }
    if (this.element.value.length >= this.promptMask.length && event.type === 'input') {
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
    }
    var initStartIndex = this.element.selectionStart;
    var initEndIndex = this.element.selectionEnd;
    var startIndex = this.element.selectionStart;
    var endIndex = this.element.selectionEnd;
    var maskValue = this.hiddenMask.replace(/[>|\\<]/g, '');
    var curMask = maskValue[startIndex - 1];
    var parentElement = this.element.parentNode;
    if (isRemove || event.keyCode === 8 || event.keyCode === 46) {
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: endIndex });
        var multipleDel = false;
        var preValue = this.element.value;
        if (startIndex > 0 || ((event.keyCode === 8 || event.keyCode === 46) && startIndex < this.element.value.length
            && ((this.element.selectionEnd - startIndex) !== this.element.value.length))) {
            var index = startIndex;
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
            for (var k = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? k > index : k < index; (event.keyCode === 8 || isRemove || multipleDel) ? k-- : k++) {
                for (var i = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? i > 0 : i < this.element.value.length; (event.keyCode === 8 || isRemove || multipleDel) ? i-- : i++) {
                    var sIndex = void 0;
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
                    var oldValue = this.element.value[sIndex];
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
                        var value = this.element.value;
                        var prompt_1 = this.promptChar;
                        var elementValue = value.substring(0, sIndex) + prompt_1 + value.substring(startIndex, value.length);
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
        var oldValue = this.element.value;
        if ((!event.ctrlKey) || (event.ctrlKey && event.code !== 'KeyA' && event.code !== 'KeyY'
            && event.code !== 'KeyZ' && event.code !== 'KeyX' && event.code !== 'KeyC' && event.code !== 'KeyV')) {
            this.maskKeyPress = true;
            var key = event.key;
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
    var prevOnChange = this.isProtectedOnChange;
    if (!isNullOrUndefined(this.changeEventArgs) && !this.isInitial) {
        var eventArgs = {};
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
        var collec = void 0;
        if (!this.maskKeyPress && event.keyCode === 229) {
            var oldEventVal = void 0;
            if (this.element.value.length === 1) {
                this.element.value = this.element.value + this.promptMask;
                this.element.setSelectionRange(1, 1);
            }
            if (this.element.value.length > this.promptMask.length) {
                var startIndex = this.element.selectionStart;
                var addedValues = this.element.value.length - this.promptMask.length;
                var val_1 = this.element.value.substring(startIndex - addedValues, startIndex);
                if (this.undoCollec.length > 0) {
                    collec = this.undoCollec[this.undoCollec.length - 1];
                    var startIndex_1 = this.element.selectionStart;
                    oldEventVal = collec.value;
                    var oldVal = collec.value.substring(startIndex_1 - addedValues, startIndex_1);
                    collec = this.redoCollec[0];
                    val_1 = val_1.trim();
                    var isSpace = Browser.isAndroid && val_1 === '';
                    if (!isSpace && oldVal !== val_1 && collec.value.substring(startIndex_1 - addedValues, startIndex_1) !== val_1) {
                        validateValue.call(this, val_1, event.ctrlKey, event);
                    }
                    else if (isSpace) {
                        preventUnsupportedValues.call(this, event, startIndex_1 - 1, this.element.selectionEnd - 1, val_1, event.ctrlKey, false);
                    }
                }
                else {
                    oldEventVal = this.promptMask;
                    validateValue.call(this, val_1, event.ctrlKey, event);
                }
                this.maskKeyPress = false;
                triggerMaskChangeEvent.call(this, event, oldEventVal);
            }
        }
        else {
            removeMaskError.call(this);
        }
        var val = strippedValue.call(this, this.element);
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
        var temp_1 = this.element;
        setTimeout(function () {
            temp_1.setSelectionRange(0, 0);
        }, 0);
    }
}
function mobileSwipeCheck(key) {
    if (key.length > 1 && ((this.promptMask.length + key.length) < this.element.value.length)) {
        var elementValue = this.redoCollec[0].value.substring(0, this.redoCollec[0].startIndex) + key +
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
    var startIndex = this.element.selectionStart;
    var initStartIndex = startIndex;
    var endIndex = this.element.selectionEnd;
    var curMask;
    var allowText = false;
    var value = this.element.value;
    var eventOldVal;
    var prevSupport = false;
    var isEqualVal = false;
    for (var k = 0; k < key.length; k++) {
        var keyValue = key[k];
        startIndex = this.element.selectionStart;
        endIndex = this.element.selectionEnd;
        if (!this.maskKeyPress && initStartIndex === startIndex) {
            startIndex = startIndex + k;
        }
        if ((!this.maskKeyPress || startIndex < this.promptMask.length)) {
            for (var i = startIndex; i < this.promptMask.length; i++) {
                var maskValue = this.escapeMaskValue;
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
                var customValStr = this.customCharacters[curMask];
                var customValArr = customValStr.split(',');
                for (var i = 0; i < customValArr.length; i++) {
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
                        var sIndex = this.element.selectionStart;
                        var eIndex = this.element.selectionEnd;
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
        var value = this.element.value;
        var elementValue = value.substring(0, startIndex) + keyValue + value.substring(startIndex + 1, value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
    }
}
function preventUnsupportedValues(event, sIdx, idx, key, ctrl, chkSupport) {
    if (!this.maskKeyPress) {
        var eventOldVal = void 0;
        var value = this.element.value;
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
    var _this = this;
    var parentElement = this.element.parentNode;
    var timer = 200;
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
    setTimeout(function () {
        if (!_this.maskKeyPress) {
            removeMaskError.call(_this);
        }
    }, timer);
}
function removeMaskError() {
    var parentElement = this.element.parentNode;
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
    var promptMask;
    var i;
    var curVal = value;
    var caseCount = 0;
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
            var val = this.element.value;
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
            for (var i = 0; i < val.length; i++) {
                validateValue.call(this, val[i], false, null);
            }
        }
        var newVal = strippedValue.call(this, this.element);
        this.prevValue = newVal;
        this.value = newVal;
        triggerMaskChangeEvent.call(this, null, null);
        this.maskKeyPress = false;
        var labelElement = this.element.parentNode.querySelector('.e-float-text');
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
    var value = strippedValue.call(this, (element ? element : this.element), val);
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
    var inputEle = getMaskInput(args);
    applyMask.call(inputEle);
    var val = strippedValue.call(this, this.element);
    this.prevValue = val;
    this.value = val;
    if (args.mask) {
        unwireEvents.call(inputEle);
        wireEvents.call(inputEle);
    }
}
function getMaskInput(args) {
    addClass([args.element], UTILMASK);
    var inputEle = {
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
    var inputEle;
    if (!isNullOrUndefined(args) && args.element.classList.contains(UTILMASK)) {
        inputEle = getMaskInput(args);
    }
    return inputEle;
}
/**
 * @hidden
 * Arguments to perform undo and redo functionalities.
 */
var MaskUndo = /** @__PURE__ @class */ (function () {
    function MaskUndo() {
    }
    return MaskUndo;
}());

/**
 * MaskedTextbox base modules
 */

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT$1 = 'e-widget e-control-wrapper e-mask';
var INPUT = 'e-input';
var COMPONENT$1 = 'e-maskedtextbox';
var CONTROL$1 = 'e-control';
var MASKINPUT_FOCUS = 'e-input-focus';
var wrapperAttr = ['title', 'style', 'class'];
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
var MaskedTextBox = /** @__PURE__ @class */ (function (_super) {
    __extends$1(MaskedTextBox, _super);
    function MaskedTextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initInputValue = '';
        _this.maskOptions = options;
        return _this;
    }
    /**
     * Gets the component name
     * @private
     */
    MaskedTextBox.prototype.getModuleName = function () {
        return 'maskedtextbox';
    };
    /**
     * Initializes the event handler
     * @private
     */
    MaskedTextBox.prototype.preRender = function () {
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
        var ejInstance = getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL$1, COMPONENT$1, 'e-lib']);
        this.angularTagName = null;
        this.formElement = closest(this.element, 'form');
        if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
            this.angularTagName = this.element.tagName;
            var input = this.createElement('input');
            for (var i = 0; i < this.element.attributes.length; i++) {
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
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    MaskedTextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initializes the component rendering.
     * @private
     */
    MaskedTextBox.prototype.render = function () {
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
    };
    MaskedTextBox.prototype.updateHTMLAttrToElement = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) < 0) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    MaskedTextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.inputObj.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        var maskStyle = this.inputObj.container.getAttribute(key);
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
    };
    MaskedTextBox.prototype.resetMaskedTextBox = function () {
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
        var val = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (!this.isInitial) {
            unwireEvents.call(this);
        }
        wireEvents.call(this);
    };
    MaskedTextBox.prototype.setMaskPlaceholder = function (setVal, dynamicPlaceholder) {
        if (dynamicPlaceholder || this.placeholder) {
            Input.setPlaceholder(this.placeholder, this.element);
            if (this.element.value === this.promptMask && setVal && this.floatLabelType !== 'Always') {
                setElementValue.call(this, '');
            }
            if (this.floatLabelType === 'Never') {
                maskInputBlurHandler.call(this);
            }
        }
    };
    MaskedTextBox.prototype.setWidth = function (width) {
        if (!isNullOrUndefined(width)) {
            this.element.style.width = formatUnit(width);
            this.inputObj.container.style.width = formatUnit(width);
        }
    };
    MaskedTextBox.prototype.checkHtmlAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes)
            : ['placeholder', 'disabled', 'value', 'readonly'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var key = attributes_1[_i];
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
                            var enabled = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
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
                            var readonly = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                                || this.element.getAttribute(key) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                }
            }
        }
    };
    MaskedTextBox.prototype.createWrapper = function () {
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
    };
    /**
     * Calls internally if any of the property value is changed.
     * @hidden
     */
    MaskedTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                    var strippedValue_1 = this.value;
                    this.mask = newProp.mask;
                    this.updateValue(strippedValue_1);
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
                    var value = this.element.value.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    if (this.promptMask === this.element.value) {
                        value = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    }
                    this.promptMask = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    this.undoCollec = this.redoCollec = [];
                    setElementValue.call(this, value);
                    break;
            }
        }
    };
    MaskedTextBox.prototype.updateValue = function (strippedVal) {
        this.resetMaskedTextBox();
        setMaskValue.call(this, strippedVal);
    };
    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     * @return {string}
     */
    MaskedTextBox.prototype.getMaskedValue = function () {
        return unstrippedValue.call(this, this.element);
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    MaskedTextBox.prototype.focusIn = function () {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    MaskedTextBox.prototype.focusOut = function () {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    MaskedTextBox.prototype.destroy = function () {
        var _this = this;
        unwireEvents.call(this);
        var attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete',
            'aria-live', 'aria-valuenow', 'aria-invalid'];
        attrArray.forEach(function (value) {
            _this.element.removeAttribute(value);
        });
        this.element.classList.remove('e-input');
        this.inputObj.container.insertAdjacentElement('afterend', this.element);
        detach(this.inputObj.container);
        _super.prototype.destroy.call(this);
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
    return MaskedTextBox;
}(Component));

/**
 * MaskedTextbox modules
 */

/**
 * MaskedTextbox modules
 */

/**
 * Input box Component
 */

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the ticks data of the Slider.
 */
var TicksData = /** @__PURE__ @class */ (function (_super) {
    __extends$2(TicksData, _super);
    function TicksData() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TicksData;
}(ChildProperty));
/**
 * It illustrates the limit data in slider.
 */
var LimitData = /** @__PURE__ @class */ (function (_super) {
    __extends$2(LimitData, _super);
    function LimitData() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return LimitData;
}(ChildProperty));
/**
 * It illustrates the tooltip data in slider.
 */
var TooltipData = /** @__PURE__ @class */ (function (_super) {
    __extends$2(TooltipData, _super);
    function TooltipData() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TooltipData;
}(ChildProperty));
var bootstrapTooltipOffset = 6;
var bootstrap4TooltipOffset = 3;
var classNames = {
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
var Slider = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Slider, _super);
    function Slider(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.horDir = 'left';
        _this.verDir = 'bottom';
        _this.transition = {
            handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
                'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
            rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)'
        };
        _this.transitionOnMaterialTooltip = {
            handle: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, top 1ms ease-out',
            rangeBar: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, width 1ms ease-out, height 1ms ease-out'
        };
        _this.scaleTransform = 'transform .4s cubic-bezier(.25, .8, .25, 1)';
        _this.customAriaText = null;
        _this.drag = true;
        return _this;
    }
    Slider.prototype.preRender = function () {
        var localeText = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
        this.l10n = new L10n('slider', localeText, this.locale);
        this.isElementFocused = false;
        this.tickElementCollection = [];
        this.tooltipFormatInfo = {};
        this.ticksFormatInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.formChecker();
    };
    Slider.prototype.formChecker = function () {
        var formElement = closest(this.element, 'form');
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
    };
    Slider.prototype.initCultureFunc = function () {
        this.internationalization = new Internationalization(this.locale);
    };
    Slider.prototype.initCultureInfo = function () {
        this.tooltipFormatInfo.format = (!isNullOrUndefined(this.tooltip.format)) ? this.tooltip.format : null;
        this.ticksFormatInfo.format = (!isNullOrUndefined(this.ticks.format)) ? this.ticks.format : null;
    };
    Slider.prototype.formatString = function (value, formatInfo) {
        var formatValue = null;
        var formatString = null;
        if ((value || value === 0)) {
            formatValue = this.formatNumber(value);
            var numberOfDecimals = this.numberOfDecimals(value);
            formatString = this.internationalization.getNumberFormat(formatInfo)(this.makeRoundNumber(value, numberOfDecimals));
        }
        return { elementVal: formatValue, formatString: formatString };
    };
    
    Slider.prototype.formatNumber = function (value) {
        var numberOfDecimals = this.numberOfDecimals(value);
        return this.internationalization.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(value);
    };
    
    Slider.prototype.numberOfDecimals = function (value) {
        var decimalPart = value.toString().split('.')[1];
        var numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        return numberOfDecimals;
    };
    Slider.prototype.makeRoundNumber = function (value, precision) {
        var decimals = precision || 0;
        return Number(value.toFixed(decimals));
    };
    
    Slider.prototype.fractionalToInteger = function (value) {
        value = (this.numberOfDecimals(value) === 0) ? Number(value).toFixed(this.noOfDecimals) : value;
        var tens = 1;
        for (var i = 0; i < this.noOfDecimals; i++) {
            tens *= 10;
        }
        value = Number((value * tens).toFixed(0));
        return value;
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Slider.prototype.render = function () {
        this.initialize();
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
    };
    Slider.prototype.initialize = function () {
        addClass([this.element], classNames.root);
        this.setCSSClass();
    };
    Slider.prototype.setCSSClass = function (oldCSSClass) {
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    };
    Slider.prototype.setEnabled = function () {
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
    };
    Slider.prototype.getTheme = function (container) {
        var theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    };
    /**
     * Initialize the rendering
     * @private
     */
    Slider.prototype.initRender = function () {
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
    };
    Slider.prototype.getThemeInitialization = function () {
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material'
            || this.getTheme(this.sliderContainer) === 'material-dark';
        this.isBootstrap = this.getTheme(this.sliderContainer) === 'bootstrap'
            || this.getTheme(this.sliderContainer) === 'bootstrap-dark';
        this.isBootstrap4 = this.getTheme(this.sliderContainer) === 'bootstrap4';
        this.isMaterialTooltip = this.isMaterial && this.type !== 'Range' && this.tooltip.isVisible;
    };
    Slider.prototype.createRangeBar = function () {
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
    };
    Slider.prototype.createLimitBar = function () {
        var firstElementClassName = this.type !== 'Range' ? classNames.limitBarDefault :
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
    };
    Slider.prototype.setOrientClass = function () {
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
    };
    Slider.prototype.setAriaAttributes = function (element) {
        var _this = this;
        var min = this.min;
        var max = this.max;
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
            var range = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[min.toString(), (this.customValues[this.value[1]]).toString()],
                    [(this.customValues[this.value[0]]).toString(), max.toString()]] :
                [[min.toString(), this.value[1].toString()], [this.value[0].toString(), max.toString()]];
            range.forEach(function (range, index) {
                var element = index === 0 ? _this.firstHandle : _this.secondHandle;
                if (element) {
                    attributes(element, {
                        'aria-valuemin': range[0], 'aria-valuemax': range[1]
                    });
                }
            });
        }
    };
    Slider.prototype.createSecondHandle = function () {
        this.secondHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', 'aria-labelledby': this.element.id + '_title', tabIndex: '0'
            }
        });
        this.secondHandle.classList.add(classNames.sliderSecondHandle);
        this.element.appendChild(this.secondHandle);
    };
    Slider.prototype.createFirstHandle = function () {
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
    };
    Slider.prototype.wireFirstHandleEvt = function (destroy) {
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
    };
    Slider.prototype.wireSecondHandleEvt = function (destroy) {
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
    };
    Slider.prototype.handleStart = function () {
        if (this.type !== 'Range') {
            this.firstHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
            if (this.isMaterialTooltip) {
                this.materialHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
                if (this.tooltipElement) {
                    this.tooltipElement.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderTooltipStart);
                }
            }
        }
    };
    Slider.prototype.transitionEnd = function (e) {
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
    };
    Slider.prototype.handleFocusOut = function () {
        if (this.firstHandle.classList.contains(classNames.sliderHandleFocused)) {
            this.firstHandle.classList.remove(classNames.sliderHandleFocused);
        }
        if (this.type === 'Range') {
            if (this.secondHandle.classList.contains(classNames.sliderHandleFocused)) {
                this.secondHandle.classList.remove(classNames.sliderHandleFocused);
            }
        }
    };
    Slider.prototype.handleFocus = function (e) {
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
        }
        else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
        }
    };
    Slider.prototype.handleOver = function (e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover') {
            this.tooltipToggle(e.currentTarget);
        }
    };
    Slider.prototype.handleLeave = function (e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover' &&
            !e.currentTarget.classList.contains(classNames.sliderHandleFocused) &&
            !e.currentTarget.classList.contains(classNames.sliderTabHandle)) {
            this.closeTooltip();
        }
    };
    Slider.prototype.setHandler = function () {
        if (this.min > this.max) {
            this.min = this.max;
        }
        this.createFirstHandle();
        if (this.type === 'Range') {
            this.createSecondHandle();
        }
    };
    Slider.prototype.setEnableRTL = function () {
        this.enableRtl && this.orientation !== 'Vertical' ? addClass([this.sliderContainer], classNames.rtl) :
            removeClass([this.sliderContainer], classNames.rtl);
        var preDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (this.enableRtl) {
            this.horDir = 'right';
            this.verDir = 'bottom';
        }
        else {
            this.horDir = 'left';
            this.verDir = 'bottom';
        }
        var currDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (preDir !== currDir) {
            if (this.orientation === 'Horizontal') {
                setStyleAttribute(this.firstHandle, { 'right': '', 'left': 'auto' });
                if (this.type === 'Range') {
                    setStyleAttribute(this.secondHandle, { 'top': '', 'left': 'auto' });
                }
            }
        }
    };
    Slider.prototype.tooltipValue = function () {
        var _this = this;
        var text;
        var args = {
            value: this.value,
            text: ''
        };
        this.setTooltipContent();
        args.text = text = this.tooltipObj.content;
        this.trigger('tooltipChange', args, function (observedArgs) {
            _this.addTooltipClass(observedArgs.text);
            if (text !== observedArgs.text) {
                _this.customAriaText = observedArgs.text;
                _this.tooltipObj.content = observedArgs.text;
                _this.setAriaAttrValue(_this.firstHandle);
                if (_this.type === 'Range') {
                    _this.setAriaAttrValue(_this.secondHandle);
                }
            }
        });
    };
    Slider.prototype.setTooltipContent = function () {
        var content;
        content = this.formatContent(this.tooltipFormatInfo, false);
        this.tooltipObj.content = content;
    };
    Slider.prototype.formatContent = function (formatInfo, ariaContent) {
        var content = '';
        var handle1 = this.handleVal1;
        var handle2 = this.handleVal2;
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
    };
    Slider.prototype.addTooltipClass = function (content) {
        if (this.isMaterialTooltip) {
            var count = content.toString().length;
            if (!this.tooltipElement) {
                var cssClass = count > 4 ? classNames.sliderMaterialRange : classNames.sliderMaterialDefault;
                this.tooltipObj.cssClass = classNames.sliderTooltip + ' ' + cssClass;
            }
            else {
                var cssClass = count > 4 ?
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
    };
    Slider.prototype.tooltipPlacement = function () {
        return this.orientation === 'Horizontal' ? (this.tooltip.placement === 'Before' ? 'TopCenter' : 'BottomCenter') :
            (this.tooltip.placement === 'Before' ? 'LeftCenter' : 'RightCenter');
    };
    Slider.prototype.tooltipBeforeOpen = function (args) {
        this.tooltipElement = args.element;
        if (this.tooltip.cssClass) {
            addClass([this.tooltipElement], this.tooltip.cssClass.split(' ').filter(function (css) { return css; }));
        }
        args.target.removeAttribute('aria-describedby');
        if (this.isMaterialTooltip) {
            this.tooltipElement.firstElementChild.classList.add(classNames.materialTooltipHide);
            this.handleStart();
            this.setTooltipTransform();
        }
    };
    Slider.prototype.tooltipCollision = function (position) {
        if (this.isBootstrap || this.isBootstrap4 || (this.isMaterial && !this.isMaterialTooltip)) {
            var tooltipOffsetValue = this.isBootstrap4 ? bootstrap4TooltipOffset : bootstrapTooltipOffset;
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
    };
    Slider.prototype.wireMaterialTooltipEvent = function (destroy) {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.sliderDown, this);
            }
            else {
                EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.sliderDown);
            }
        }
    };
    Slider.prototype.tooltipPositionCalculation = function (position) {
        var cssClass;
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
    };
    Slider.prototype.getTooltipTransformProperties = function (className) {
        var transformProperties;
        if (this.tooltipElement) {
            var position = this.orientation === 'Horizontal' ?
                ((this.tooltipElement.clientHeight + 14) - (this.tooltipElement.clientHeight / 2)) :
                ((this.tooltipElement.clientWidth + 14) - (this.tooltipElement.clientWidth / 2));
            transformProperties = this.orientation === 'Horizontal' ?
                (className === classNames.horizontalTooltipBefore ? { rotate: 'rotate(45deg)', translate: "translateY(" + position + "px)" } :
                    { rotate: 'rotate(225deg)', translate: "translateY(" + -(position) + "px)" }) :
                (className === classNames.verticalTooltipBefore ? { rotate: 'rotate(-45deg)', translate: "translateX(" + position + "px)" } :
                    { rotate: 'rotate(-225deg)', translate: "translateX(" + (-position) + "px)" });
        }
        return transformProperties;
    };
    Slider.prototype.openMaterialTooltip = function () {
        var _this = this;
        if (this.isMaterialTooltip) {
            this.refreshTooltip(this.firstHandle);
            var tooltipContentElement = this.tooltipElement.firstElementChild;
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
                setTimeout(function () { _this.tooltipElement.style.transition = _this.transition.handle; }, 2500);
            }
            else {
                setTimeout(function () { _this.tooltipElement.style.transition = 'none'; }, 2500);
            }
        }
    };
    Slider.prototype.closeMaterialTooltip = function () {
        var _this = this;
        if (this.isMaterialTooltip) {
            var tooltipContentElement = this.tooltipElement.firstElementChild;
            this.tooltipElement.style.transition = this.scaleTransform;
            tooltipContentElement.classList.remove(classNames.materialTooltipShow);
            tooltipContentElement.classList.add(classNames.materialTooltipHide);
            this.firstHandle.style.cursor = '-webkit-grab';
            this.firstHandle.style.cursor = 'grab';
            this.materialHandle.style.transform = 'scale(1)';
            this.tooltipElement.classList.remove(classNames.materialTooltipOpen);
            this.setTooltipTransform();
            this.tooltipTarget = undefined;
            setTimeout(function () { _this.tooltipElement.style.transition = 'none'; }, 2500);
        }
    };
    Slider.prototype.checkTooltipPosition = function (args) {
        if (this.tooltipCollidedPosition === undefined ||
            this.tooltipCollidedPosition !== args.collidedPosition) {
            if (this.isMaterialTooltip) {
                var tooltipClass = this.tooltipPositionCalculation(args.collidedPosition);
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
    };
    Slider.prototype.setTooltipTransform = function () {
        var transformProperties = this.getTooltipTransformProperties(this.previousTooltipClass);
        if (this.tooltipElement.firstElementChild.innerText.length > 4) {
            this.tooltipElement.style.transform = transformProperties.translate + " scale(0.01)";
        }
        else {
            this.tooltipElement.style.transform = transformProperties.translate + " " + transformProperties.rotate + " scale(0.01)";
        }
    };
    Slider.prototype.renderTooltip = function () {
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
    };
    Slider.prototype.initializeTooltipProps = function () {
        var tooltipShowOn = this.isMaterialTooltip ? 'Always' : (this.tooltip.showOn === 'Auto' ? 'Hover' : this.tooltip.showOn);
        this.setProperties({ tooltip: { showOn: tooltipShowOn } }, true);
        this.tooltipObj.position = this.tooltipPlacement();
        this.tooltipCollision(this.tooltipObj.position);
        [this.firstHandle, this.rangeBar, this.secondHandle].forEach(function (handle) {
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
    };
    Slider.prototype.tooltipBeforeClose = function () {
        this.tooltipElement = undefined;
        this.tooltipCollidedPosition = undefined;
    };
    Slider.prototype.setButtons = function () {
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
    };
    Slider.prototype.buttonTitle = function () {
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        var decrementTitle = this.l10n.getConstant('decrementTitle');
        var incrementTitle = this.l10n.getConstant('incrementTitle');
        attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
    };
    Slider.prototype.buttonFocusOut = function () {
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
        }
    };
    Slider.prototype.repeatButton = function (args) {
        var hVal = this.handleValueUpdate();
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        var value;
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
    };
    Slider.prototype.repeatHandlerMouse = function (args) {
        args.preventDefault();
        if (args.type === ('mousedown') || args.type === ('touchstart')) {
            this.buttonClick(args);
            this.repeatInterval = setInterval(this.repeatButton.bind(this), 180, args);
        }
    };
    Slider.prototype.materialChange = function () {
        if (!this.getHandle().classList.contains('e-large-thumb-size')) {
            this.getHandle().classList.add('e-large-thumb-size');
        }
    };
    Slider.prototype.repeatHandlerUp = function (e) {
        this.changeEvent('changed');
        this.closeTooltip();
        clearInterval(this.repeatInterval);
        this.getHandle().focus();
    };
    Slider.prototype.customTickCounter = function (bigNum) {
        var tickCount = 4;
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
    };
    // tslint:disable-next-line:max-func-body-length
    Slider.prototype.renderScale = function () {
        var orien = this.orientation === 'Vertical' ? 'v' : 'h';
        this.noOfDecimals = this.numberOfDecimals(this.step);
        this.ul = this.createElement('ul', {
            className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        this.ul.style.zIndex = '-1';
        if (Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        var smallStep = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            this.ticks.largeStep > 0 ? (smallStep = this.ticks.largeStep) :
                (smallStep = (parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min))));
        }
        else if (smallStep <= 0) {
            smallStep = parseFloat(formatUnit(this.step));
        }
        var min = this.fractionalToInteger(this.min);
        var max = this.fractionalToInteger(this.max);
        var steps = this.fractionalToInteger(smallStep);
        var bigNum = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        var customStep = this.customTickCounter(bigNum);
        var count = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            (bigNum * customStep) + bigNum : Math.abs((max - min) / steps);
        this.element.appendChild(this.ul);
        var li;
        var start = parseFloat(this.min.toString());
        if (orien === 'v') {
            start = parseFloat(this.max.toString());
        }
        var left = 0;
        var islargeTick;
        var tickWidth = 100 / count;
        if (tickWidth === Infinity) {
            tickWidth = 5;
        }
        for (var i = 0, y = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
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
                    var largestep = this.fractionalToInteger(this.ticks.largeStep);
                    var startValue = this.fractionalToInteger(start);
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
            var repeat = islargeTick ? (this.ticks.placement === 'Both' ? 2 : 1) : 0;
            if (islargeTick) {
                for (var j = 0; j < repeat; j++) {
                    this.createTick(li, start, tickWidth);
                }
            }
            else if (isNullOrUndefined(this.customValues)) {
                this.formatTicksValue(li, start);
            }
            this.ul.appendChild(li);
            this.tickElementCollection.push(li);
            var decimalPoints = void 0;
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
    };
    Slider.prototype.ticksAlignment = function (orien, tickWidth, triggerEvent) {
        if (triggerEvent === void 0) { triggerEvent = true; }
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
        var eventArgs = { ticksWrapper: this.ul, tickElements: this.tickElementCollection };
        if (triggerEvent) {
            this.trigger('renderedTicks', eventArgs);
        }
        this.scaleAlignment();
    };
    Slider.prototype.createTick = function (li, start, tickWidth) {
        var span = this.createElement('span', {
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
    };
    Slider.prototype.formatTicksValue = function (li, start, spanElement, tickWidth) {
        var _this = this;
        var tickText = this.formatNumber(start);
        var text = !isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        var eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, function (observedArgs) {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                spanElement.innerHTML = observedArgs.text.toString();
            }
            if (isBlazor()) {
                var orien = _this.orientation === 'Horizontal' ? 'h' : 'v';
                _this.ticksAlignment(orien, tickWidth, false);
            }
        });
    };
    Slider.prototype.scaleAlignment = function () {
        this.tickValuePosition();
        var orien = this.orientation === 'Vertical' ? 'v' : 'h';
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
    };
    Slider.prototype.tickValuePosition = function () {
        var first = this.firstChild.getBoundingClientRect();
        var firstChild;
        var smallStep = this.ticks.smallStep;
        var count = Math.abs((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min)))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = this.firstChild.children[0].getBoundingClientRect();
        }
        var tickElements = [this.sliderContainer.querySelectorAll('.' + classNames.tick + '.' +
                classNames.large + ' .' + classNames.tickValue)];
        var other;
        if (this.ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        }
        else {
            other = [].slice.call(tickElements[0], 1);
        }
        var tickWidth = this.orientation === 'Vertical' ?
            (first.height * 2) : (first.width * 2);
        for (var i = 0; i < this.firstChild.children.length; i++) {
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
        for (var i = 0; i < other.length; i++) {
            var otherChild = other[i].getBoundingClientRect();
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
    };
    Slider.prototype.setAriaAttrValue = function (element) {
        var ariaValueText;
        var isTickFormatted = ((!isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format))) ? true : false;
        var text = !isTickFormatted ?
            this.formatContent(this.ticksFormatInfo, false) : this.formatContent(this.tooltipFormatInfo, false);
        var valuenow = isTickFormatted ? this.formatContent(this.ticksFormatInfo, true) :
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
    };
    Slider.prototype.handleValueUpdate = function () {
        var hVal;
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
    };
    Slider.prototype.getLimitCorrectedValues = function (value) {
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
    };
    Slider.prototype.focusSliderElement = function () {
        if (!this.isElementFocused) {
            this.element.focus();
            this.isElementFocused = true;
        }
    };
    Slider.prototype.buttonClick = function (args) {
        this.focusSliderElement();
        var value;
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        var hVal = this.handleValueUpdate();
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
    };
    Slider.prototype.tooltipToggle = function (target) {
        if (this.isMaterialTooltip) {
            !this.tooltipElement.classList.contains(classNames.materialTooltipOpen) ?
                this.openMaterialTooltip() : this.refreshTooltip(this.firstHandle);
        }
        else {
            !this.tooltipElement ? this.openTooltip(target) : this.refreshTooltip(target);
        }
    };
    Slider.prototype.buttonUp = function (args) {
        if (args.currentTarget.classList.contains(classNames.firstButton)) {
            EventHandler.remove(this.firstBtn, 'mouseup touchend', this.buttonUp);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            EventHandler.remove(this.secondBtn, 'mouseup touchend', this.buttonUp);
        }
    };
    Slider.prototype.setRangeBar = function () {
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
    };
    Slider.prototype.checkValidValueAndPos = function (value) {
        value = this.checkHandleValue(value);
        value = this.checkHandlePosition(value);
        return value;
    };
    Slider.prototype.setLimitBarPositions = function (fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion) {
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
    };
    Slider.prototype.setLimitBar = function () {
        if (this.type === 'Default' || this.type === 'MinRange') {
            var fromPosition = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromPosition = this.checkValidValueAndPos(fromPosition);
            var toPosition = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            toPosition = this.checkValidValueAndPos(toPosition);
            this.setLimitBarPositions(fromPosition, toPosition);
        }
        else if (this.type === 'Range') {
            var fromMinPostion = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMinPostion = this.checkValidValueAndPos(fromMinPostion);
            var fromMaxpostion = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMaxpostion = this.checkValidValueAndPos(fromMaxpostion);
            var toMinPostion = (this.getLimitValueAndPosition(this.limits.maxStart, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMinPostion = this.checkValidValueAndPos(toMinPostion);
            var toMaxpostion = (this.getLimitValueAndPosition(this.limits.maxEnd, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMaxpostion = this.checkValidValueAndPos(toMaxpostion);
            this.setLimitBarPositions(fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion);
        }
    };
    Slider.prototype.getLimitValueAndPosition = function (currentValue, minValue, maxValue, limitBar) {
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
    };
    Slider.prototype.setValue = function () {
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
                var values = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
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
    };
    Slider.prototype.rangeValueUpdate = function () {
        if (this.value === null || typeof (this.value) !== 'object') {
            this.value = [parseFloat(formatUnit(this.min)), parseFloat(formatUnit(this.max))];
        }
    };
    Slider.prototype.validateRangeValue = function () {
        this.rangeValueUpdate();
        this.setRangeValue();
    };
    Slider.prototype.modifyZindex = function () {
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
    };
    Slider.prototype.setHandlePosition = function () {
        var _this = this;
        var handle;
        var pos = (this.activeHandle === 1) ? this.handlePos1 : this.handlePos2;
        if (this.isMaterialTooltip) {
            handle = [this.firstHandle, this.materialHandle];
        }
        else {
            handle = [this.getHandle()];
        }
        this.handleStart();
        handle.forEach(function (handle) {
            if (_this.orientation === 'Horizontal') {
                _this.enableRtl ? (handle.style.right =
                    pos + "px") : (handle.style.left = pos + "px");
            }
            else {
                handle.style.bottom = pos + "px";
            }
        });
        this.changeEvent('change');
    };
    Slider.prototype.getHandle = function () {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    };
    Slider.prototype.setRangeValue = function () {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition();
        this.activeHandle = 2;
        this.setHandlePosition();
        this.activeHandle = 1;
    };
    Slider.prototype.changeEvent = function (eventName) {
        var previous = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        }
        else {
            var value = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if (previous.length === this.value.length
                && this.value[0] !== previous[0] || this.value[1] !== previous[1]) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    };
    Slider.prototype.changeEventArgs = function (eventName) {
        var eventArgs;
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
    };
    Slider.prototype.setPreviousVal = function (eventName, value) {
        if (eventName === 'change') {
            this.previousVal = value;
        }
        else {
            this.previousChanged = value;
        }
    };
    Slider.prototype.updateRangeValue = function () {
        var values = this.value.toString().split(',').map(Number);
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
            var values_1 = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
            this.handleVal1 = values_1[0];
            this.handlePos1 = values_1[1];
            this.preHandlePos1 = this.handlePos1;
            this.activeHandle = 2;
            values_1 = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
            this.handleVal2 = values_1[0];
            this.handlePos2 = values_1[1];
            this.preHandlePos2 = this.handlePos2;
        }
    };
    Slider.prototype.checkHandlePosition = function (value) {
        var pos;
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
    };
    Slider.prototype.checkHandleValue = function (value) {
        if (this.min > this.max) {
            this.min = this.max;
        }
        if (this.min === this.max) {
            return (parseFloat(formatUnit(this.max)));
        }
        var handle = this.tempStartEnd();
        if (value < handle.start) {
            value = handle.start;
        }
        else if (value > handle.end) {
            value = handle.end;
        }
        return value;
    };
    /**
     * It is used to reposition slider.
     * @returns void
     */
    Slider.prototype.reposition = function () {
        var _this = this;
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
                this.handlePos1 + "px" : this.firstHandle.style.left = this.handlePos1 + "px";
            if (this.isMaterialTooltip) {
                this.enableRtl ? this.materialHandle.style.right =
                    this.handlePos1 + "px" : this.materialHandle.style.left = this.handlePos1 + "px";
            }
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.enableRtl ? this.secondHandle.style.right =
                    this.handlePos2 + "px" : this.secondHandle.style.left = this.handlePos2 + "px";
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            this.firstHandle.style.bottom = this.handlePos1 + "px";
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = this.handlePos1 + "px";
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.secondHandle.style.bottom = this.handlePos2 + "px";
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
            setTimeout(function () {
                _this.firstHandle.style.transition = _this.scaleTransform;
                if (_this.type === 'Range') {
                    _this.secondHandle.style.transition = _this.scaleTransform;
                }
            });
        }
        this.refreshTooltip(this.tooltipTarget);
    };
    Slider.prototype.changeHandleValue = function (value) {
        var position = null;
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
    };
    Slider.prototype.tempStartEnd = function () {
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
    };
    Slider.prototype.xyToPosition = function (position) {
        var pos;
        if (this.min === this.max) {
            return 100;
        }
        if (this.orientation === 'Horizontal') {
            var left = position.x - this.element.getBoundingClientRect().left;
            var num = this.element.offsetWidth / 100;
            this.val = (left / num);
        }
        else {
            var top_1 = position.y - this.element.getBoundingClientRect().top;
            var num = this.element.offsetHeight / 100;
            this.val = 100 - (top_1 / num);
        }
        var val = this.stepValueCalculation(this.val);
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
    };
    Slider.prototype.stepValueCalculation = function (value) {
        if (this.step === 0) {
            this.step = 1;
        }
        var percentStep = (parseFloat(formatUnit(this.step))) / ((parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min))) / 100);
        var remain = value % Math.abs(percentStep);
        if (remain !== 0) {
            if ((percentStep / 2) > remain) {
                value -= remain;
            }
            else {
                value += Math.abs(percentStep) - remain;
            }
        }
        return value;
    };
    Slider.prototype.add = function (a, b, addition) {
        var precision;
        var x = Math.pow(10, precision || 3);
        var val;
        if (addition) {
            val = (Math.round(a * x) + Math.round(b * x)) / x;
        }
        else {
            val = (Math.round(a * x) - Math.round(b * x)) / x;
        }
        return val;
    };
    Slider.prototype.positionToValue = function (pos) {
        var val;
        var diff = parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min));
        if (this.orientation === 'Horizontal') {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        }
        else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        var total = this.add(val, parseFloat(this.min.toString()), true);
        return (total);
    };
    Slider.prototype.sliderBarClick = function (evt) {
        evt.preventDefault();
        var pos;
        if (evt.type === 'mousedown' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else if (evt.type === 'touchstart') {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        var handlepos = this.xyToPosition(pos);
        var handleVal = this.positionToValue(handlepos);
        if (this.type === 'Range' && (this.handlePos2 - handlepos) < (handlepos - this.handlePos1)) {
            this.activeHandle = 2;
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                if (this.limits.enabled) {
                    var value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
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
                    var value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
        var focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
        if (focusedElement && this.getHandle() !== focusedElement) {
            focusedElement.classList.remove(classNames.sliderTabHandle);
        }
        var handle = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
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
        var transition = this.isMaterial && this.tooltip.isVisible ?
            this.transitionOnMaterialTooltip : this.transition;
        this.getHandle().style.transition = transition.handle;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = transition.rangeBar;
        }
        this.setHandlePosition();
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    };
    Slider.prototype.sliderDown = function (event) {
        var _a, _b;
        event.preventDefault();
        this.focusSliderElement();
        if (this.type === 'Range' && this.drag && event.target === this.rangeBar) {
            var xPostion = void 0;
            var yPostion = void 0;
            if (event.type === 'mousedown') {
                _a = [event.clientX, event.clientY], xPostion = _a[0], yPostion = _a[1];
            }
            else if (event.type === 'touchstart') {
                _b = [event.changedTouches[0].clientX, event.changedTouches[0].clientY], xPostion = _b[0], yPostion = _b[1];
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
            var focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
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
    };
    Slider.prototype.handleValueAdjust = function (handleValue, assignValue, handleNumber) {
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
    };
    Slider.prototype.dragRangeBarMove = function (event) {
        var _a, _b;
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        var pos;
        this.rangeBar.style.transition = 'none';
        this.firstHandle.style.transition = 'none';
        this.secondHandle.style.transition = 'none';
        var xPostion;
        var yPostion;
        if (event.type === 'mousemove') {
            _a = [event.clientX, event.clientY], xPostion = _a[0], yPostion = _a[1];
        }
        else {
            _b = [event.changedTouches[0].clientX, event.changedTouches[0].clientY], xPostion = _b[0], yPostion = _b[1];
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
                var value = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
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
    };
    Slider.prototype.sliderBarUp = function () {
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
    };
    Slider.prototype.sliderBarMove = function (evt) {
        if (evt.type !== 'touchmove') {
            evt.preventDefault();
        }
        var pos;
        if (evt.type === 'mousemove') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        var handlepos = this.xyToPosition(pos);
        var handleVal = this.positionToValue(handlepos);
        handlepos = Math.round(handlepos);
        if (this.type !== 'Range' && this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    var valueAndPostion = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
                            var value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
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
                            var value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
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
    };
    Slider.prototype.dragRangeBarUp = function (event) {
        this.changeEvent('changed');
        this.closeTooltip();
        EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
    };
    Slider.prototype.checkRepeatedValue = function (currentValue) {
        if (this.type === 'Range') {
            var previousVal = this.enableRtl && this.orientation !== 'Vertical' ? (this.activeHandle === 1 ?
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
    };
    Slider.prototype.refreshTooltip = function (target) {
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            if (target) {
                this.tooltipObj.refresh(target);
                this.tooltipTarget = target;
            }
        }
    };
    Slider.prototype.openTooltip = function (target) {
        if (this.tooltip.isVisible && this.tooltipObj && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.open(target);
            this.tooltipTarget = target;
        }
    };
    Slider.prototype.closeTooltip = function () {
        if (this.tooltip.isVisible && this.tooltipObj && this.tooltip.showOn !== 'Always' && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.close();
            this.tooltipTarget = undefined;
        }
    };
    Slider.prototype.keyDown = function (event) {
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
    };
    Slider.prototype.wireButtonEvt = function (destroy) {
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
    };
    Slider.prototype.wireEvents = function () {
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
    };
    Slider.prototype.unwireEvents = function () {
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
    };
    Slider.prototype.formResetHandler = function () {
        this.setProperties({ 'value': this.formResetValue }, true);
        this.setValue();
    };
    Slider.prototype.keyUp = function (event) {
        if (event.keyCode === 9 && event.target.classList.contains(classNames.sliderHandle)) {
            this.focusSliderElement();
            if (!event.target.classList.contains(classNames.sliderTabHandle)) {
                if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                    this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
                }
                event.target.classList.add(classNames.sliderTabHandle);
                var parentElement = event.target.parentElement;
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
    };
    Slider.prototype.hover = function (event) {
        if (!isNullOrUndefined(event)) {
            if (event.type === 'mouseover' || event.type === 'touchmove' || event.type === 'mousemove' ||
                event.type === 'pointermove' || event.type === 'touchstart') {
                this.sliderContainer.classList.add(classNames.sliderHover);
            }
            else {
                this.sliderContainer.classList.remove(classNames.sliderHover);
            }
        }
    };
    Slider.prototype.sliderFocusOut = function (event) {
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
    };
    Slider.prototype.removeElement = function (element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };
    Slider.prototype.changeSliderType = function (type) {
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
    };
    Slider.prototype.changeRtl = function () {
        if (!this.enableRtl && this.type === 'Range') {
            this.value = [this.handleVal2, this.handleVal1];
        }
        this.updateConfig();
        if (this.tooltip.isVisible) {
            this.tooltipObj.refresh(this.firstHandle);
        }
        if (this.showButtons) {
            var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
            attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    };
    Slider.prototype.changeOrientation = function () {
        this.changeSliderType(this.type);
    };
    Slider.prototype.updateConfig = function () {
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
    };
    Slider.prototype.limitsPropertyChange = function () {
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
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Slider.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Prepares the slider for safe removal from the DOM.
     * Detaches all event handlers, attributes, and classes to avoid memory leaks.
     * @method destroy
     * @return {void}
     */
    Slider.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
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
    };
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    // tslint:disable-next-line
    Slider.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'value':
                    if (newProp && oldProp) {
                        var value = isNullOrUndefined(newProp.value) ?
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
                        Array.prototype.forEach.call(this.sliderContainer.classList, function (className) {
                            if (className.match(/e-scale-/)) {
                                _this.sliderContainer.classList.remove(className);
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
    };
    Slider.prototype.setReadOnly = function () {
        if (this.readonly) {
            this.unwireEvents();
            this.sliderContainer.classList.add(classNames.readonly);
        }
        else {
            this.wireEvents();
            this.sliderContainer.classList.remove(classNames.readonly);
        }
    };
    Slider.prototype.setMinMaxValue = function () {
        var _this = this;
        this.setValue();
        this.refreshTooltip(this.tooltipTarget);
        if (!isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
            if (this.ul) {
                detach(this.ul);
                Array.prototype.forEach.call(this.sliderContainer.classList, function (className) {
                    if (className.match(/e-scale-/)) {
                        _this.sliderContainer.classList.remove(className);
                    }
                });
            }
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
            this.setZindex();
        }
    };
    Slider.prototype.setZindex = function () {
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
    };
    Slider.prototype.setTooltip = function () {
        this.changeSliderType(this.type);
    };
    /**
     * Gets the component name
     * @private
     */
    Slider.prototype.getModuleName = function () {
        return 'slider';
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
    return Slider;
}(Component));

/**
 * Slider modules
 */

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * global declarations
 */
// tslint:disable-next-line:no-any
var regex = {
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
var FormValidator = /** @__PURE__ @class */ (function (_super) {
    __extends$3(FormValidator, _super);
    // Initializes the FormValidator 
    function FormValidator(element, options) {
        var _this = _super.call(this, options, element) || this;
        _this.validated = [];
        _this.errorRules = [];
        _this.allowSubmit = false;
        _this.required = 'required';
        _this.infoElement = null;
        _this.inputElement = null;
        _this.selectQuery = 'input:not([type=reset]):not([type=button]), select, textarea';
        // tslint:disable-next-line:no-any
        _this.localyMessage = {};
        /**
         * Specifies the default messages for validation rules.
         * @default { List of validation message }
         */
        _this.defaultMessages = {
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
        if (typeof _this.rules === 'undefined') {
            _this.rules = {};
        }
        _this.l10n = new L10n('formValidator', _this.defaultMessages, _this.locale);
        if (_this.locale) {
            _this.localeFunc();
        }
        onIntlChange.on('notifyExternalChange', _this.afterLocalization, _this);
        element = typeof element === 'string' ? select(element, document) : element;
        // Set novalidate to prevent default HTML5 form validation
        if (_this.element != null) {
            _this.element.setAttribute('novalidate', '');
            _this.inputElements = selectAll(_this.selectQuery, _this.element);
            _this.createHTML5Rules();
            _this.wireEvents();
        }
        else {
            return undefined;
        }
        return _this;
    }
    FormValidator_1 = FormValidator;
    // tslint:enable
    /**
     * Add validation rules to the corresponding input element based on `name` attribute.
     * @param {string} name `name` of form field.
     * @param {Object} rules Validation rules for the corresponding element.
     * @return {void}
     */
    FormValidator.prototype.addRules = function (name, rules) {
        if (name) {
            if (this.rules.hasOwnProperty(name)) {
                extend(this.rules[name], rules, {});
            }
            else {
                this.rules[name] = rules;
            }
        }
    };
    /**
     * Remove validation to the corresponding field based on name attribute.
     * When no parameter is passed, remove all the validations in the form.
     * @param {string} name Input name attribute value.
     * @param {string[]} rules List of validation rules need to be remove from the corresponding element.
     * @return {void}
     */
    FormValidator.prototype.removeRules = function (name, rules) {
        if (!name && !rules) {
            this.rules = {};
        }
        else if (this.rules[name] && !rules) {
            delete this.rules[name];
        }
        else if (!isNullOrUndefined(this.rules[name] && rules)) {
            for (var i = 0; i < rules.length; i++) {
                delete this.rules[name][rules[i]];
            }
        }
        else {
            return;
        }
    };
    /**
     * Validate the current form values using defined rules.
     * Returns `true` when the form is valid otherwise `false`
     * @param {string} selected - Optional parameter to validate specified element.
     * @return {boolean}
     */
    FormValidator.prototype.validate = function (selected) {
        var rules = Object.keys(this.rules);
        if (selected && rules.length) {
            this.validateRules(selected);
            //filter the selected element it don't have any valid input element
            return rules.indexOf(selected) !== -1 && this.errorRules.filter(function (data) {
                return data.name === selected;
            }).length === 0;
        }
        else {
            this.errorRules = [];
            for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                var name_1 = rules_1[_i];
                this.validateRules(name_1);
            }
            return this.errorRules.length === 0;
        }
    };
    /**
     * Reset the value of all the fields in form.
     * @return {void}
     */
    FormValidator.prototype.reset = function () {
        this.element.reset();
        this.clearForm();
    };
    /**
     * Get input element by name.
     * @param {string} name - Input element name attribute value.
     * @return {HTMLInputElement}
     */
    FormValidator.prototype.getInputElement = function (name) {
        this.inputElement = (select('[name="' + name + '"]', this.element));
        return this.inputElement;
    };
    /**
     * Destroy the form validator object and error elements.
     * @return {void}
     */
    FormValidator.prototype.destroy = function () {
        this.reset();
        this.unwireEvents();
        this.rules = {};
        var elements = selectAll('.' + this.errorClass + ', .' + this.validClass, this.element);
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            element.remove();
        }
        _super.prototype.destroy.call(this);
        onIntlChange.off('notifyExternalChange', this.afterLocalization);
    };
    /**
     * @private
     */
    FormValidator.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'locale':
                    this.localeFunc();
                    break;
            }
        }
    };
    
    /**
     * @private
     */
    FormValidator.prototype.localeFunc = function () {
        for (var _i = 0, _a = Object.keys(this.defaultMessages); _i < _a.length; _i++) {
            var key = _a[_i];
            this.l10n.setLocale(this.locale);
            var value = this.l10n.getConstant(key);
            this.localyMessage[key] = value;
        }
    };
    /**
     * @private
     */
    FormValidator.prototype.getModuleName = function () {
        return 'formValidator';
    };
    /**
     * @private
     */
    // tslint:disable-next-line:no-any
    FormValidator.prototype.afterLocalization = function (args) {
        this.locale = args.locale;
        this.localeFunc();
    };
    FormValidator.prototype.clearForm = function () {
        this.errorRules = [];
        this.validated = [];
        var elements = selectAll(this.selectQuery, this.element);
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            var input = element;
            input.removeAttribute('aria-invalid');
            input.classList.remove(this.errorClass);
            if (input.name.length > 0) {
                this.getInputElement(input.name);
                this.getErrorElement(input.name);
                this.hideMessage(input.name);
            }
            input.classList.remove(this.validClass);
        }
    };
    FormValidator.prototype.createHTML5Rules = function () {
        var defRules = ['required', 'validateHidden', 'regex', 'rangeLength', 'maxLength', 'minLength', 'dateIso', 'digits',
            'pattern', 'data-val-required', 'type', 'data-validation', 'min', 'max', 'range', 'equalTo', 'data-val-minlength-min',
            'data-val-equalto-other', 'data-val-maxlength-max', 'data-val-range-min', 'data-val-regex-pattern', 'data-val-length-max',
            'data-val-creditcard', 'data-val-phone'];
        var acceptedTypes = ['hidden', 'email', 'url', 'date', 'number', 'tel'];
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
            // Default attribute rules 
            var allRule = {};
            for (var _b = 0, defRules_1 = defRules; _b < defRules_1.length; _b++) {
                var rule = defRules_1[_b];
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
                            var id = input.getAttribute(rule);
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
    };
    FormValidator.prototype.annotationRule = function (input, ruleCon, ruleName, value) {
        var annotationRule = ruleName.split('-');
        var rulesList = ['required', 'creditcard', 'phone', 'maxlength', 'minlength', 'range', 'regex', 'equalto'];
        var ruleFirstName = annotationRule[annotationRule.length - 1];
        var ruleSecondName = annotationRule[annotationRule.length - 2];
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
                    var minvalue = input.getAttribute('data-val-range-min');
                    var maxvalue = input.getAttribute('data-val-range-max');
                    this.defRule(input, ruleCon, 'range', [minvalue, maxvalue]);
                    break;
                case 'equalto':
                    var id = input.getAttribute(ruleName).split('.');
                    this.defRule(input, ruleCon, 'equalTo', id[id.length - 1]);
                    break;
                case 'regex':
                    this.defRule(input, ruleCon, 'regex', value);
                    break;
            }
        }
    };
    FormValidator.prototype.defRule = function (input, ruleCon, ruleName, value) {
        var message = input.getAttribute('data-' + ruleName + '-message');
        var annotationMessage = input.getAttribute('data-val-' + ruleName);
        var customMessage;
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
    };
    // Wire events to the form elements
    FormValidator.prototype.wireEvents = function () {
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
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
    };
    // UnWire events to the form elements
    FormValidator.prototype.unwireEvents = function () {
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
            EventHandler.clearEvents(input);
        }
        EventHandler.remove(this.element, 'submit', this.submitHandler);
        EventHandler.remove(this.element, 'reset', this.resetHandler);
    };
    // Handle input element focusout event
    FormValidator.prototype.focusOutHandler = function (e) {
        this.trigger('focusout', e);
        //FormValidator.triggerCallback(this.focusout, e);
        var element = e.target;
        if (this.rules[element.name]) {
            if (this.rules[element.name][this.required] || element.value.length > 0) {
                this.validate(element.name);
            }
            else if (this.validated.indexOf(element.name) === -1) {
                this.validated.push(element.name);
            }
        }
    };
    // Handle input element keyup event
    FormValidator.prototype.keyUpHandler = function (e) {
        this.trigger('keyup', e);
        var element = e.target;
        // List of keys need to prevent while validation
        var excludeKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
        if (e.which === 9 && (!this.rules[element.name] || (this.rules[element.name] && !this.rules[element.name][this.required]))) {
            return;
        }
        if (this.validated.indexOf(element.name) !== -1 && this.rules[element.name] && excludeKeys.indexOf(e.which) === -1) {
            this.validate(element.name);
        }
    };
    // Handle input click event
    FormValidator.prototype.clickHandler = function (e) {
        this.trigger('click', e);
        var element = e.target;
        // If element type is not submit allow validation
        if (element.type !== 'submit') {
            this.validate(element.name);
        }
        else if (element.getAttribute('formnovalidate') !== null) {
            // Prevent form validation, if submit button has formnovalidate attribute
            this.allowSubmit = true;
        }
    };
    // Handle input change event
    FormValidator.prototype.changeHandler = function (e) {
        this.trigger('change', e);
        var element = e.target;
        this.validate(element.name);
    };
    // Handle form submit event
    FormValidator.prototype.submitHandler = function (e) {
        this.trigger('submit', e);
        //FormValidator.triggerCallback(this.submit, e);
        // Prevent form submit if validation failed
        if (!this.allowSubmit && !this.validate()) {
            e.preventDefault();
        }
        else {
            this.allowSubmit = false;
        }
    };
    // Handle form reset
    FormValidator.prototype.resetHandler = function () {
        this.clearForm();
    };
    // Validate each rule based on input element name
    FormValidator.prototype.validateRules = function (name) {
        if (!this.rules[name]) {
            return;
        }
        var rules = Object.keys(this.rules[name]);
        var hiddenType = false;
        var validateHiddenType = false;
        var vhPos = rules.indexOf('validateHidden');
        var hPos = rules.indexOf('hidden');
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
            for (var _i = 0, rules_2 = rules; _i < rules_2.length; _i++) {
                var rule = rules_2[_i];
                var errorMessage = this.getErrorMessage(this.rules[name][rule], rule);
                var errorRule = { name: name, message: errorMessage };
                var eventArgs = {
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
    };
    // Update the optional validation status
    FormValidator.prototype.optionalValidationStatus = function (name, refer) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            refer.status = '';
            this.hideMessage(name);
        }
    };
    // Check the input element whether it's value satisfy the validation rule or not
    FormValidator.prototype.isValid = function (name, rule) {
        var params = this.rules[name][rule];
        var param = (params instanceof Array && typeof params[1] === 'string') ? params[0] : params;
        var currentRule = this.rules[name][rule];
        var args = { value: this.inputElement.value, param: param, element: this.inputElement, formElement: this.element };
        this.trigger('validationBegin', args);
        if (currentRule && typeof currentRule[0] === 'function') {
            var fn = currentRule[0];
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
    };
    // Return default error message or custom error message 
    FormValidator.prototype.getErrorMessage = function (ruleValue, rule) {
        var message = this.inputElement.getAttribute('data-' + rule + '-message') ?
            this.inputElement.getAttribute('data-' + rule + '-message') :
            (ruleValue instanceof Array && typeof ruleValue[1] === 'string') ? ruleValue[1] :
                (Object.keys(this.localyMessage).length !== 0) ? this.localyMessage[rule] : this.defaultMessages[rule];
        var formats = message.match(/{(\d)}/g);
        if (!isNullOrUndefined(formats)) {
            for (var i = 0; i < formats.length; i++) {
                var value = ruleValue instanceof Array ? ruleValue[i] : ruleValue;
                message = message.replace(formats[i], value);
            }
        }
        return message;
    };
    // Create error element based on name and error message
    FormValidator.prototype.createErrorElement = function (name, message, input) {
        var errorElement = createElement(this.errorElement, {
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
            var containerId = input.getAttribute('data-msg-containerid');
            var divElement = this.element.querySelector('#' + containerId);
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
    };
    // Get error element by name
    FormValidator.prototype.getErrorElement = function (name) {
        this.infoElement = select(this.errorElement + '.' + this.errorClass, this.inputElement.parentElement);
        if (!this.infoElement) {
            this.infoElement = select(this.errorElement + '.' + this.errorClass + '[for="' + name + '"]', this.element);
        }
        return this.infoElement;
    };
    // Remove existing rule from errorRules object
    FormValidator.prototype.removeErrorRules = function (name) {
        for (var i = 0; i < this.errorRules.length; i++) {
            var rule = this.errorRules[i];
            if (rule.name === name) {
                this.errorRules.splice(i, 1);
            }
        }
    };
    // Show error message to the input element
    FormValidator.prototype.showMessage = function (errorRule) {
        this.infoElement.style.display = 'block';
        this.infoElement.innerHTML = errorRule.message;
        this.checkRequired(errorRule.name);
    };
    // Hide error message based on input name
    FormValidator.prototype.hideMessage = function (name) {
        if (this.infoElement) {
            this.infoElement.style.display = 'none';
            this.removeErrorRules(name);
            this.inputElement.classList.add(this.validClass);
            this.inputElement.classList.remove(this.errorClass);
            this.inputElement.setAttribute('aria-invalid', 'false');
        }
    };
    // Check whether the input element have required rule and its value is not empty
    FormValidator.prototype.checkRequired = function (name) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            this.hideMessage(name);
        }
    };
    // Return boolean result if the input have chekcable or submit types
    FormValidator.isCheckable = function (input) {
        var inputType = input.getAttribute('type');
        return inputType && (inputType === 'checkbox' || inputType === 'radio' || inputType === 'submit');
    };
    var FormValidator_1;
    // List of function to validate the rules
    FormValidator.checkValidator = {
        required: function (option) {
            return option.value.length > 0;
        },
        email: function (option) {
            return regex.EMAIL.test(option.value);
        },
        url: function (option) {
            return regex.URL.test(option.value);
        },
        dateIso: function (option) {
            return regex.DATE_ISO.test(option.value);
        },
        tel: function (option) {
            return regex.PHONE.test(option.value);
        },
        creditcard: function (option) {
            return regex.CREDITCARD.test(option.value);
        },
        number: function (option) {
            return !isNaN(Number(option.value)) && option.value.indexOf(' ') === -1;
        },
        digits: function (option) {
            return regex.DIGITS.test(option.value);
        },
        maxLength: function (option) {
            return option.value.length <= option.param;
        },
        minLength: function (option) {
            return option.value.length >= option.param;
        },
        rangeLength: function (option) {
            var param = option.param;
            return option.value.length >= param[0] && option.value.length <= param[1];
        },
        range: function (option) {
            var param = option.param;
            return !isNaN(Number(option.value)) && Number(option.value) >= param[0] && Number(option.value) <= param[1];
        },
        date: function (option) {
            return !isNaN(new Date(option.value).getTime());
        },
        max: function (option) {
            if (!isNaN(Number(option.value))) {
                // Maximum rule validation for number
                return +option.value <= option.param;
            }
            // Maximum rule validation for date
            return new Date(option.value).getTime() <= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
        },
        min: function (option) {
            if (!isNaN(Number(option.value))) {
                // Minimum rule validation for number
                return +option.value >= option.param;
            }
            else if ((option.value).indexOf(',') !== -1) {
                var uNum = (option.value).replace(/,/g, '');
                return parseFloat(uNum) >= option.param;
            }
            else {
                // Minimum rule validation for date
                return new Date(option.value).getTime() >= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
            }
        },
        regex: function (option) {
            return new RegExp(option.param).test(option.value);
        },
        equalTo: function (option) {
            var compareTo = option.formElement.querySelector('#' + option.param);
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
    return FormValidator;
}(Base));

/**
 * Input box Component
 */

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CONTROL_WRAPPER = 'e-upload';
var INPUT_WRAPPER = 'e-file-select';
var DROP_AREA = 'e-file-drop';
var DROP_WRAPPER = 'e-file-select-wrap';
var LIST_PARENT = 'e-upload-files';
var FILE = 'e-upload-file-list';
var STATUS = 'e-file-status';
var ACTION_BUTTONS = 'e-upload-actions';
var UPLOAD_BUTTONS = 'e-file-upload-btn e-css e-btn e-flat e-primary';
var CLEAR_BUTTONS = 'e-file-clear-btn e-css e-btn e-flat';
var FILE_NAME = 'e-file-name';
var FILE_TYPE = 'e-file-type';
var FILE_SIZE = 'e-file-size';
var REMOVE_ICON = 'e-file-remove-btn';
var DELETE_ICON = 'e-file-delete-btn';
var ABORT_ICON = 'e-file-abort-btn';
var RETRY_ICON = 'e-file-reload-btn';
var DRAG_HOVER = 'e-upload-drag-hover';
var PROGRESS_WRAPPER = 'e-upload-progress-wrap';
var PROGRESSBAR = 'e-upload-progress-bar';
var PROGRESSBAR_TEXT = 'e-progress-bar-text';
var UPLOAD_INPROGRESS = 'e-upload-progress';
var UPLOAD_SUCCESS = 'e-upload-success';
var UPLOAD_FAILED = 'e-upload-fails';
var TEXT_CONTAINER = 'e-file-container';
var VALIDATION_FAILS = 'e-validation-fails';
var RTL = 'e-rtl';
var DISABLED = 'e-disabled';
var RTL_CONTAINER = 'e-rtl-container';
var ICON_FOCUSED = 'e-clear-icon-focus';
var PROGRESS_INNER_WRAPPER = 'e-progress-inner-wrap';
var PAUSE_UPLOAD = 'e-file-pause-btn';
var RESUME_UPLOAD = 'e-file-play-btn';
var RESTRICT_RETRY = 'e-restrict-retry';
var wrapperAttr$1 = ['title', 'style', 'class'];
var FilesProp = /** @__PURE__ @class */ (function (_super) {
    __extends$4(FilesProp, _super);
    function FilesProp() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FilesProp;
}(ChildProperty));
var ButtonsProps = /** @__PURE__ @class */ (function (_super) {
    __extends$4(ButtonsProps, _super);
    function ButtonsProps() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ButtonsProps;
}(ChildProperty));
var AsyncSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$4(AsyncSettings, _super);
    function AsyncSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return AsyncSettings;
}(ChildProperty));
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
var Uploader = /** @__PURE__ @class */ (function (_super) {
    __extends$4(Uploader, _super);
    /**
     * Triggers when change the Uploader value.
     */
    function Uploader(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initialAttr = { accept: null, multiple: false, disabled: false };
        _this.fileList = [];
        _this.filesData = [];
        _this.uploadedFilesData = [];
        _this.base64String = [];
        _this.isForm = false;
        _this.allTypes = false;
        _this.pausedData = [];
        _this.uploadMetaData = [];
        _this.tabIndex = '0';
        _this.btnTabIndex = '0';
        _this.disableKeyboardNavigation = false;
        _this.count = -1;
        _this.actionCompleteCount = 0;
        _this.flag = true;
        _this.selectedFiles = [];
        _this.uploaderOptions = options;
        return _this;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    Uploader.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
    };
    Uploader.prototype.setLocalizedTexts = function () {
        if (isNullOrUndefined(this.template)) {
            if (typeof (this.buttons.browse) === 'string') {
                this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                    this.localizedTexts('Browse') : this.buttons.browse;
                this.browseButton.setAttribute('title', this.browseButton.innerText);
                this.uploadWrapper.querySelector('.' + DROP_AREA).innerHTML = this.localizedTexts('dropFilesHint');
            }
            this.updateFileList();
        }
    };
    Uploader.prototype.getKeyValue = function (val) {
        var keyValue;
        for (var _i = 0, _a = Object.keys(this.preLocaleObj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (this.preLocaleObj[key] === val) {
                keyValue = key;
            }
        }
        return keyValue;
    };
    Uploader.prototype.updateFileList = function () {
        var element;
        /* istanbul ignore next */
        if (this.fileList.length > 0 && !isNullOrUndefined(this.uploadWrapper.querySelector('.' + LIST_PARENT))) {
            for (var i = 0; i < this.fileList.length; i++) {
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
    };
    Uploader.prototype.reRenderFileList = function () {
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
    };
    Uploader.prototype.preRender = function () {
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
        var parentEle = closest(this.element, 'form');
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
        var ejInstance = getValue('ej2_instances', this.element);
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-UPLOADER') {
            var inputElement = this.createElement('input', { attrs: { type: 'file' } });
            var index = 0;
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
    };
    Uploader.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Return the module name of the component.
     */
    Uploader.prototype.getModuleName = function () {
        return 'uploader';
    };
    Uploader.prototype.updateDirectoryAttributes = function () {
        if (this.directoryUpload) {
            this.element.setAttribute('directory', 'true');
            this.element.setAttribute('webkitdirectory', 'true');
        }
        else {
            this.element.removeAttribute('directory');
            this.element.removeAttribute('webkitdirectory');
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Uploader.prototype.render = function () {
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
    };
    Uploader.prototype.renderBrowseButton = function () {
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
    };
    Uploader.prototype.renderActionButtons = function () {
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
    };
    Uploader.prototype.wireActionButtonEvents = function () {
        EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    };
    Uploader.prototype.unwireActionButtonEvents = function () {
        EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    };
    Uploader.prototype.removeActionButtons = function () {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            detach(this.actionButtons);
            this.actionButtons = null;
        }
    };
    Uploader.prototype.renderButtonTemplates = function () {
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
            var uploadText = void 0;
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
            var clearText = void 0;
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
    };
    Uploader.prototype.initializeUpload = function () {
        this.element.setAttribute('tabindex', '-1');
        var inputWrapper = this.createElement('span', { className: INPUT_WRAPPER });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = this.createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(this.browseButton);
        this.dropAreaWrapper.appendChild(inputWrapper);
        var fileDropArea = this.createElement('span', { className: DROP_AREA });
        fileDropArea.innerHTML = this.localizedTexts('dropFilesHint');
        this.dropAreaWrapper.appendChild(fileDropArea);
        this.uploadWrapper = this.createElement('div', { className: CONTROL_WRAPPER });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
        this.setDropArea();
    };
    Uploader.prototype.renderPreLoadFiles = function () {
        if (this.files.length) {
            if (isNullOrUndefined(this.files[0].size)) {
                return;
            }
            var files = [].slice.call(this.files);
            var filesData = [];
            if (!this.multiple) {
                this.clearData();
                files = [files[0]];
            }
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var data = files_1[_i];
                var fileData = {
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
    };
    Uploader.prototype.checkActionButtonStatus = function () {
        if (this.actionButtons) {
            var length_1 = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
                this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length_1 > 0 && length_1 === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
            else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    };
    Uploader.prototype.setDropArea = function () {
        var dropTextArea = this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof (this.dropArea) !== 'string') ? this.dropArea :
                document.querySelector(this.dropArea);
            var element = this.element;
            var enableDropText = false;
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
    };
    Uploader.prototype.updateHTMLAttrToElement = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttr$1.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    };
    Uploader.prototype.updateHTMLAttrToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttr$1.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        addClass([this.uploadWrapper], this.htmlAttributes[pro].split(' '));
                    }
                    else if (pro === 'style') {
                        var uploadStyle = this.uploadWrapper.getAttribute(pro);
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
    };
    Uploader.prototype.setMultipleSelection = function () {
        if (this.multiple && !this.element.hasAttribute('multiple')) {
            var newAttr = document.createAttribute('multiple');
            newAttr.value = 'multiple';
            this.element.setAttributeNode(newAttr);
        }
        else if (!this.multiple) {
            this.element.removeAttribute('multiple');
        }
    };
    Uploader.prototype.checkAutoUpload = function (fileData) {
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
    };
    Uploader.prototype.sequenceUpload = function (fileData) {
        if (this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1') {
            ++this.count;
            var isFileListCreated = this.showFileList ? false : true;
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
    };
    Uploader.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            addClass([this.uploadWrapper], this.cssClass.split(this.cssClass.indexOf(',') > -1 ? ',' : ' '));
        }
        if (oldCSSClass) {
            removeClass([this.uploadWrapper], oldCSSClass.split(' '));
        }
    };
    Uploader.prototype.wireEvents = function () {
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
    };
    Uploader.prototype.unWireEvents = function () {
        EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
        EventHandler.remove(document, 'click', this.removeFocus);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        this.keyboardModule.destroy();
    };
    Uploader.prototype.resetForm = function () {
        this.clearAll();
    };
    Uploader.prototype.keyActionHandler = function (e) {
        var targetElement = e.target;
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
                    var metaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                }
                else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                }
                else if (targetElement.classList.contains(RETRY_ICON)) {
                    var metaData = this.getCurrentMetaData(null, e);
                    if (!isNullOrUndefined(metaData)) {
                        metaData.file.statusCode = '1';
                        metaData.file.status = this.localizedTexts('readyToUploadMessage');
                        this.chunkUpload(metaData.file);
                    }
                    else {
                        var target = e.target.parentElement;
                        var fileData = this.filesData[this.fileList.indexOf(target)];
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
    };
    Uploader.prototype.getCurrentMetaData = function (fileInfo, e) {
        var fileData;
        var targetMetaData;
        if (isNullOrUndefined(fileInfo)) {
            var target = e.target.parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        }
        else {
            fileData = fileInfo;
        }
        for (var i = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
            }
        }
        return targetMetaData;
    };
    Uploader.prototype.removeFocus = function () {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            document.activeElement.blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    };
    Uploader.prototype.browseButtonClick = function () {
        this.element.click();
    };
    Uploader.prototype.uploadButtonClick = function () {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        }
        else {
            this.upload(this.filesData);
        }
    };
    Uploader.prototype.clearButtonClick = function () {
        this.clearAll();
        /* istanbul ignore next */
        if (this.sequentialUpload) {
            this.count = -1;
        }
        this.actionCompleteCount = 0;
    };
    Uploader.prototype.bindDropEvents = function () {
        if (this.dropZoneElement) {
            EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    };
    Uploader.prototype.unBindDropEvents = function () {
        if (this.dropZoneElement) {
            EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    };
    Uploader.prototype.onDragLeave = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    };
    Uploader.prototype.dragHover = function (e) {
        if (!this.enabled) {
            return;
        }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        e.preventDefault();
        e.stopPropagation();
    };
    /* istanbul ignore next */
    Uploader.prototype.dropElement = function (e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    };
    /* istanbul ignore next */
    Uploader.prototype.onPasteFile = function (event) {
        var item = event.clipboardData.items;
        if (item.length !== 1) {
            return;
        }
        var pasteFile = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    };
    Uploader.prototype.removeFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var selectedElement = args.target.parentElement;
        var index = this.fileList.indexOf(selectedElement);
        var liElement = this.fileList[index];
        var fileData = this.filesData[index];
        if (isNullOrUndefined(fileData)) {
            return;
        }
        if (args.target.classList.contains(ABORT_ICON)) {
            fileData.statusCode = '5';
            if (!isNullOrUndefined(liElement)) {
                var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
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
    };
    Uploader.prototype.removeFilesData = function (file, customTemplate) {
        var index;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        var selectedElement = this.getLiElement(file);
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
    };
    Uploader.prototype.removeUploadedFile = function (file, eventArgs, removeDirectly, custom) {
        var _this = this;
        var selectedFiles = file;
        var ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        var formData = new FormData();
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            if (!removeDirectly) {
                _this.trigger('removing', eventArgs, function (eventArgs) {
                    if (eventArgs.cancel) {
                        e.cancel = true;
                    }
                    else {
                        _this.removingEventCallback(eventArgs, formData, selectedFiles, file);
                    }
                });
            }
            else {
                _this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            }
        };
        ajax.onLoad = function (e) { _this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    };
    Uploader.prototype.removingEventCallback = function (eventArgs, formData, selectedFiles, file) {
        /* istanbul ignore next */
        var name = this.element.getAttribute('name');
        var liElement = this.getLiElement(file);
        if (!isNullOrUndefined(liElement) && (!isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
            !isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
            var spinnerTarget = void 0;
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
    };
    /* istanbul ignore next */
    Uploader.prototype.updateFormData = function (formData, customData) {
        if (customData.length > 0 && customData[0]) {
            var _loop_1 = function (i) {
                var data = customData[i];
                // tslint:disable-next-line
                var value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            };
            for (var i = 0; i < customData.length; i++) {
                _loop_1(i);
            }
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.updateCustomheader = function (request, currentRequest) {
        if (currentRequest.length > 0 && currentRequest[0]) {
            var _loop_2 = function (i) {
                var data = currentRequest[i];
                // tslint:disable-next-line
                var value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            };
            for (var i = 0; i < currentRequest.length; i++) {
                _loop_2(i);
            }
        }
    };
    Uploader.prototype.removeCompleted = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
        };
        this.trigger('success', args);
        this.removeFilesData(files, customTemplate);
        var index = this.uploadedFilesData.indexOf(files);
        this.uploadedFilesData.splice(index, 1);
        this.trigger('change', { files: this.uploadedFilesData });
    };
    Uploader.prototype.removeFailed = function (e, files, customTemplate) {
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var args = {
            e: e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            var index = this.filesData.indexOf(files);
            var rootElement = this.fileList[index];
            if (rootElement) {
                var statusElement = rootElement.querySelector('.' + STATUS);
                rootElement.classList.remove(UPLOAD_SUCCESS);
                statusElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                statusElement.classList.add(UPLOAD_FAILED);
            }
            this.checkActionButtonStatus();
        }
        this.trigger('failure', args);
        var liElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            var spinnerTarget = liElement.querySelector('.' + DELETE_ICON);
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.getFilesFromFolder = function (event) {
        this.filesEntries = [];
        var items;
        items = this.multiple ? event.dataTransfer.items : [event.dataTransfer.items[0]];
        var validDirectoryUpload = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) {
            return;
        }
        var _loop_3 = function (i) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isFile) {
                var files_2 = [];
                // tslint:disable-next-line
                (item).file(function (fileObj) {
                    var path = item.fullPath;
                    files_2.push({ 'path': path, 'file': fileObj });
                });
                this_1.renderSelectedFiles(event, files_2, true);
            }
            else if (item.isDirectory) {
                this_1.traverseFileTree(item, event);
            }
        };
        var this_1 = this;
        for (var i = 0; i < items.length; i++) {
            _loop_3(i);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.checkDirectoryUpload = function (items) {
        for (var i = 0; i < items.length; i++) {
            // tslint:disable-next-line
            var item = items[i].webkitGetAsEntry();
            if (item.isDirectory) {
                return true;
            }
        }
        return false;
    };
    // tslint:disable
    /* istanbul ignore next */
    Uploader.prototype.traverseFileTree = function (item, event) {
        var _this = this;
        if (typeof (item) === 'boolean') {
            var files_3 = [];
            var _loop_4 = function (i) {
                this_2.filesEntries[i].file(function (fileObj) {
                    var path = _this.filesEntries[i].fullPath;
                    files_3.push({ 'path': path, 'file': fileObj });
                });
            };
            var this_2 = this;
            for (var i = 0; i < this.filesEntries.length; i++) {
                _loop_4(i);
            }
            this.renderSelectedFiles(event, files_3, true);
        }
        else if (item.isFile) {
            this.filesEntries.push(item);
        }
        else if (item.isDirectory) {
            // tslint:disable-next-line
            var directoryReader = item.createReader();
            // tslint:disable-next-line
            directoryReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    _this.traverseFileTree(entries[i]);
                    // tslint:disable-next-line
                }
                
                _this.traverseFileTree(true);
                _this.filesEntries = [];
            });
        }
    };
    // tslint:enable
    Uploader.prototype.onSelectFiles = function (args) {
        if (!this.enabled) {
            return;
        }
        var targetFiles;
        /* istanbul ignore next */
        if (args.type === 'drop') {
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            }
            else {
                var files = this.sortFilesList = args.dataTransfer.files;
                this.element.files = files;
                targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                this.renderSelectedFiles(args, targetFiles);
            }
        }
        else {
            targetFiles = [].slice.call(args.target.files);
            this.renderSelectedFiles(args, targetFiles);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.getBase64 = function (file) {
        return new Promise(function (resolve, reject) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function () { return resolve(fileReader.result); };
            fileReader.onerror = function (error) { return reject(error); };
        });
    };
    /* istanbul ignore next */
    Uploader.prototype.renderSelectedFiles = function (args, 
    // tslint:disable-next-line
    targetFiles, directory, paste) {
        return __awaiter(this, void 0, void 0, function () {
            var eventArgs, fileData, i, file, data, fileName, fileDetails;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventArgs = {
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
                            return [2 /*return*/];
                        }
                        this.flag = true;
                        fileData = [];
                        if (!this.multiple) {
                            this.clearData(true);
                            targetFiles = [targetFiles[0]];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < targetFiles.length)) return [3 /*break*/, 5];
                        file = directory ? targetFiles[i].file : targetFiles[i];
                        if (!isBlazor()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getBase64(file)];
                    case 2:
                        data = _a.sent();
                        this.base64String.push(data);
                        _a.label = 3;
                    case 3:
                        fileName = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
                            getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
                            this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
                        fileDetails = {
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
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        eventArgs.filesData = fileData;
                        if (this.allowedExtensions.indexOf('*') > -1) {
                            this.allTypes = true;
                        }
                        if (!this.allTypes) {
                            fileData = this.checkExtension(fileData);
                        }
                        this.trigger('selected', eventArgs, function (eventArgs) {
                            if (!eventArgs.cancel) {
                                /* istanbul ignore next */
                                if (isBlazor()) {
                                    _this.currentRequestHeader = eventArgs.currentRequest;
                                    _this.customFormDatas = eventArgs.customFormData;
                                }
                                _this.selectedFiles = fileData;
                                _this.btnTabIndex = _this.disableKeyboardNavigation ? '-1' : '0';
                                if (_this.showFileList) {
                                    if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                                        var dataFiles = _this.allTypes ? eventArgs.modifiedFilesData :
                                            _this.checkExtension(eventArgs.modifiedFilesData);
                                        _this.updateSortedFileList(dataFiles);
                                        _this.filesData = dataFiles;
                                        if (!_this.isForm || _this.allowUpload()) {
                                            _this.checkAutoUpload(dataFiles);
                                        }
                                    }
                                    else {
                                        _this.createFileList(fileData);
                                        _this.filesData = _this.filesData.concat(fileData);
                                        if (!_this.isForm || _this.allowUpload()) {
                                            _this.checkAutoUpload(fileData);
                                        }
                                    }
                                    if (!isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                                        _this.progressInterval = eventArgs.progressInterval;
                                    }
                                }
                                else {
                                    _this.filesData = _this.filesData.concat(fileData);
                                    if (_this.autoUpload) {
                                        _this.upload(_this.filesData, true);
                                    }
                                }
                                _this.raiseActionComplete();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Uploader.prototype.allowUpload = function () {
        var allowFormUpload = false;
        if (this.isForm && (!isNullOrUndefined(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '')) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    };
    Uploader.prototype.clearData = function (singleUpload) {
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
    };
    Uploader.prototype.updateSortedFileList = function (filesData) {
        var previousListClone = this.createElement('div', { id: 'clonewrapper' });
        var added = -1;
        var removedList;
        if (this.listParent) {
            for (var i = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                var liElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = this.listParent.querySelectorAll('li');
            for (var _i = 0, removedList_1 = removedList; _i < removedList_1.length; _i++) {
                var item = removedList_1[_i];
                detach(item);
            }
            this.removeActionButtons();
            var oldList = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (var index = 0; index < filesData.length; index++) {
                for (var j = 0; j < this.filesData.length; j++) {
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
    };
    Uploader.prototype.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    Uploader.prototype.checkExtension = function (files) {
        var dropFiles = files;
        if (!this.isBlank(this.allowedExtensions)) {
            var allowedExtensions = [];
            var extensions = this.allowedExtensions.split(',');
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (var i = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    };
    Uploader.prototype.validatedFileSize = function (fileSize) {
        var minSizeError = '';
        var maxSizeError = '';
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
        var errorMessage = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    };
    Uploader.prototype.isPreLoadFile = function (fileData) {
        var isPreload = false;
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i].type === fileData.type) {
                isPreload = true;
            }
        }
        return isPreload;
    };
    Uploader.prototype.createCustomfileList = function (fileData) {
        this.createParentUL();
        resetBlazorTemplate(this.element.id + 'Template', 'Template');
        for (var _i = 0, fileData_1 = fileData; _i < fileData_1.length; _i++) {
            var listItem = fileData_1[_i];
            var liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
            this.uploadTemplateFn = this.templateComplier(this.template);
            var fromElements = [].slice.call(this.uploadTemplateFn(listItem, null, null, this.element.id + 'Template', this.isStringTemplate));
            var index = fileData.indexOf(listItem);
            append(fromElements, liElement);
            var eventArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            var eventsArgs = {
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
    };
    Uploader.prototype.createParentUL = function () {
        if (isNullOrUndefined(this.listParent)) {
            this.listParent = this.createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    };
    Uploader.prototype.createFileList = function (fileData) {
        this.createParentUL();
        if (this.template !== '' && !isNullOrUndefined(this.template)) {
            this.createCustomfileList(fileData);
        }
        else {
            for (var _i = 0, fileData_2 = fileData; _i < fileData_2.length; _i++) {
                var listItem = fileData_2[_i];
                var liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
                var textContainer = this.createElement('span', { className: TEXT_CONTAINER });
                var textElement = this.createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                textElement.innerHTML = this.getFileNameOnly(listItem.name);
                var fileExtension = this.createElement('span', { className: FILE_TYPE });
                fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                if (!this.enableRtl) {
                    textContainer.appendChild(textElement);
                    textContainer.appendChild(fileExtension);
                }
                else {
                    var rtlContainer = this.createElement('span', { className: RTL_CONTAINER });
                    rtlContainer.appendChild(fileExtension);
                    rtlContainer.appendChild(textElement);
                    textContainer.appendChild(rtlContainer);
                }
                var fileSize = this.createElement('span', { className: FILE_SIZE });
                fileSize.innerHTML = this.bytesToSize(listItem.size);
                textContainer.appendChild(fileSize);
                var statusElement = this.createElement('span', { className: STATUS });
                textContainer.appendChild(statusElement);
                statusElement.innerHTML = listItem.status;
                liElement.appendChild(textContainer);
                var iconElement = this.createElement('span', { className: ' e-icons', attrs: { 'tabindex': this.btnTabIndex } });
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
                var index = fileData.indexOf(listItem);
                var eventArgs = {
                    element: liElement,
                    fileInfo: listItem,
                    index: index,
                    isPreload: this.isPreLoadFile(listItem)
                };
                var eventsArgs = {
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
    };
    Uploader.prototype.getSlicedName = function (nameElement) {
        var text;
        text = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    };
    Uploader.prototype.truncateName = function (name) {
        var nameElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
            /* istanbul ignore next */
        }
        else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    };
    Uploader.prototype.getFileType = function (name) {
        var extension;
        var index = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    };
    Uploader.prototype.getFileNameOnly = function (name) {
        var type = this.getFileType(name);
        var names = name.split('.' + type);
        return type = names[0];
    };
    Uploader.prototype.setInitialAttributes = function () {
        if (this.initialAttr.accept) {
            this.element.setAttribute('accept', this.initialAttr.accept);
        }
        if (this.initialAttr.disabled) {
            this.element.setAttribute('disabled', 'disabled');
        }
        if (this.initialAttr.multiple) {
            var newAttr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    };
    Uploader.prototype.filterfileList = function (files) {
        var filterFiles = [];
        var li;
        for (var i = 0; i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    };
    Uploader.prototype.updateStatus = function (files, status, statusCode, updateLiStatus) {
        if (updateLiStatus === void 0) { updateLiStatus = true; }
        if (!(status === '' || isNullOrUndefined(status)) && !(statusCode === '' || isNullOrUndefined(statusCode))) {
            files.status = status;
            files.statusCode = statusCode;
        }
        if (updateLiStatus) {
            var li = this.getLiElement(files);
            if (!isNullOrUndefined(li)) {
                if (!isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || isNullOrUndefined(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    };
    Uploader.prototype.getLiElement = function (files) {
        var index;
        for (var i = 0; i < this.filesData.length; i++) {
            if (this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    };
    Uploader.prototype.createProgressBar = function (liElement) {
        var progressbarWrapper = this.createElement('span', { className: PROGRESS_WRAPPER });
        var progressBar = this.createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        var progressbarInnerWrapper = this.createElement('span', { className: PROGRESS_INNER_WRAPPER });
        progressBar.setAttribute('style', 'width: 0%');
        var progressbarText = this.createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    };
    /* istanbul ignore next */
    Uploader.prototype.updateProgressbar = function (e, li) {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                var value = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            }
            else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    };
    Uploader.prototype.changeProgressValue = function (li, progressValue) {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue);
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    };
    Uploader.prototype.uploadInProgress = function (e, files, customUI, request) {
        var li = this.getLiElement(files);
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
            var iconEle = li.querySelector('.' + REMOVE_ICON);
            if (!isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        }
        else {
            this.cancelUploadingFile(files, e, request);
        }
        var args = { e: e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3') };
        this.trigger('progress', args);
    };
    /* istanbul ignore next */
    Uploader.prototype.cancelUploadingFile = function (files, e, request, li) {
        var _this = this;
        if (files.statusCode === '5') {
            var eventArgs = {
                event: e,
                fileData: files,
                cancel: false
            };
            this.trigger('canceling', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    files.statusCode = '3';
                    if (!isNullOrUndefined(li)) {
                        var spinnerTarget = li.querySelector('.' + ABORT_ICON);
                        if (!isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(li.querySelector('.e-spinner-pane'));
                        }
                    }
                }
                else {
                    request.emitError = false;
                    request.httpRequest.abort();
                    var formData = new FormData();
                    if (files.statusCode === '5') {
                        var name_1 = _this.element.getAttribute('name');
                        formData.append(name_1, files.name);
                        formData.append('cancel-uploading', files.name);
                        var ajax = new Ajax(_this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = function (e) { _this.removecanceledFile(e, files); return {}; };
                        ajax.send(formData);
                    }
                }
            });
        }
    };
    Uploader.prototype.removecanceledFile = function (e, file) {
        var liElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) {
            return;
        }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        var spinnerTarget = liElement.querySelector('.' + REMOVE_ICON);
        if (!isNullOrUndefined(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var args = { event: e, response: requestResponse, operation: 'cancel', file: file };
        this.trigger('success', args);
    };
    Uploader.prototype.renderFailureState = function (e, file, liElement) {
        var _this = this;
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
        if (isNullOrUndefined(deleteIcon)) {
            return;
        }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        liElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        /* istanbul ignore next */
        retryElement.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement, false); }, false);
    };
    Uploader.prototype.reloadcanceledFile = function (e, file, liElement, custom) {
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
    };
    /* istanbul ignore next */
    Uploader.prototype.uploadComplete = function (e, file, customUI) {
        var status = e.target;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            var li = this.getLiElement(file);
            if (isNullOrUndefined(li) && (!customUI || isNullOrUndefined(customUI))) {
                return;
            }
            if (!isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                var iconEle = li.querySelector('.' + ABORT_ICON);
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
    };
    Uploader.prototype.getResponse = function (e) {
        // tslint:disable-next-line
        var target = e.currentTarget;
        var response = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    };
    Uploader.prototype.raiseSuccessEvent = function (e, file) {
        var _this = this;
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var statusMessage = this.localizedTexts('uploadSuccessMessage');
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        this.trigger('success', args, function (args) {
            // tslint:disable-next-line
            _this.updateStatus(file, args.statusText, '2');
            _this.uploadedFilesData.push(file);
            _this.trigger('change', { file: _this.uploadedFilesData });
            _this.checkActionButtonStatus();
            if (_this.fileList.length > 0) {
                if ((!(_this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                    _this.uploadSequential();
                    _this.checkActionComplete(true);
                }
                else {
                    /* istanbul ignore next */
                    (_this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
                }
            }
        });
    };
    Uploader.prototype.uploadFailed = function (e, file) {
        var _this = this;
        var li = this.getLiElement(file);
        var response = e && e.currentTarget ? this.getResponse(e) : null;
        var statusMessage = this.localizedTexts('uploadFailedMessage');
        var args = {
            e: e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!isNullOrUndefined(li)) {
            this.renderFailureState(e, file, li);
        }
        this.trigger('failure', args, function (args) {
            // tslint:disable-next-line
            _this.updateStatus(file, args.statusText, '0');
            _this.checkActionButtonStatus();
            _this.uploadSequential();
            _this.checkActionComplete(true);
        });
    };
    Uploader.prototype.uploadSequential = function () {
        if (this.sequentialUpload) {
            if (this.autoUpload) {
                /* istanbul ignore next */
                this.checkAutoUpload(this.filesData);
            }
            else {
                this.uploadButtonClick();
            }
        }
    };
    Uploader.prototype.checkActionComplete = function (increment) {
        increment ? ++this.actionCompleteCount : --this.actionCompleteCount;
        this.raiseActionComplete();
    };
    Uploader.prototype.raiseActionComplete = function () {
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
            var eventArgs = {
                fileData: []
            };
            eventArgs.fileData = this.getSelectedFileStatus(this.selectedFiles);
            this.trigger('actionComplete', eventArgs);
        }
    };
    Uploader.prototype.getSelectedFileStatus = function (selectedFiles) {
        var matchFiles = [];
        var matchFilesIndex = 0;
        for (var selectFileIndex = 0; selectFileIndex < selectedFiles.length; selectFileIndex++) {
            var selectedFileData = selectedFiles[selectFileIndex];
            for (var fileDataIndex = 0; fileDataIndex < this.filesData.length; fileDataIndex++) {
                if (this.filesData[fileDataIndex].name === selectedFileData.name) {
                    matchFiles[matchFilesIndex] = this.filesData[fileDataIndex];
                    ++matchFilesIndex;
                }
            }
        }
        return matchFiles;
    };
    Uploader.prototype.updateProgressBarClasses = function (li, className) {
        var progressBar = li.querySelector('.' + PROGRESSBAR);
        if (!isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    };
    Uploader.prototype.removeProgressbar = function (li, callType) {
        var _this = this;
        if (!isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(function () { _this.animateProgressBar(li, callType); }, 750);
        }
    };
    /* istanbul ignore next */
    Uploader.prototype.animateProgressBar = function (li, callType) {
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
    };
    Uploader.prototype.setExtensions = function (extensions) {
        if (extensions !== '' && !isNullOrUndefined(extensions)) {
            this.element.setAttribute('accept', extensions);
        }
        else {
            this.element.removeAttribute('accept');
        }
    };
    Uploader.prototype.templateComplier = function (uploadTemplate) {
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
    };
    Uploader.prototype.setRTL = function () {
        this.enableRtl ? addClass([this.uploadWrapper], RTL) : removeClass([this.uploadWrapper], RTL);
    };
    Uploader.prototype.localizedTexts = function (localeText) {
        this.l10n.setLocale(this.locale);
        return this.l10n.getConstant(localeText);
    };
    Uploader.prototype.setControlStatus = function () {
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
    };
    Uploader.prototype.checkHTMLAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['accept', 'multiple', 'disabled'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
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
                            var isMutiple = this.element.getAttribute(prop) === 'multiple' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ multiple: isMutiple }, !isDynamic);
                            this.initialAttr.multiple = true;
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['enabled'] === undefined)) || isDynamic) {
                            var isDisabled = this.element.getAttribute(prop) === 'disabled' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: isDisabled }, !isDynamic);
                            this.initialAttr.disabled = true;
                        }
                }
            }
        }
    };
    Uploader.prototype.chunkUpload = function (file, custom, fileIndex) {
        var start = 0;
        var end = Math.min(this.asyncSettings.chunkSize, file.size);
        var index = 0;
        var blob = file.rawFile.slice(start, end);
        var metaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom, fileIndex);
    };
    Uploader.prototype.sendRequest = function (file, metaData, custom, fileIndex) {
        var _this = this;
        var formData = new FormData();
        var cloneFile;
        var blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        var totalChunk = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        var ajax = new Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.emitError = false;
        ajax.onLoad = function (e) { _this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = function (e) {
            _this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        var eventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = function (e) {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;
            /* istanbul ignore next */
            if (isBlazor()) {
                cloneFile = new File([file.rawFile], file.name);
                eventArgs.fileData.rawFile = fileIndex ? _this.base64String[fileIndex] : null;
                if (_this.currentRequestHeader) {
                    _this.updateCustomheader(ajax.httpRequest, _this.currentRequestHeader);
                }
                if (_this.customFormDatas) {
                    _this.updateFormData(formData, _this.customFormDatas);
                }
            }
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                _this.trigger('uploading', eventArgs, function (eventArgs) {
                    if (isBlazor()) {
                        eventArgs.fileData.rawFile = cloneFile;
                    }
                    _this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
            else {
                _this.trigger('chunkUploading', eventArgs, function (eventArgs) {
                    if (isBlazor()) {
                        eventArgs.fileData.rawFile = cloneFile;
                    }
                    _this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
        };
        /* istanbul ignore next */
        ajax.onError = function (e) { _this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    };
    Uploader.prototype.uploadingEventCallback = function (formData, eventArgs, e, file) {
        if (eventArgs.cancel) {
            this.eventCancelByArgs(e, eventArgs, file);
        }
        else {
            this.updateFormData(formData, eventArgs.customFormData);
        }
    };
    Uploader.prototype.eventCancelByArgs = function (e, eventArgs, file) {
        var _this = this;
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') {
            return;
        }
        var liElement = this.getLiElement(eventArgs.fileData);
        liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
        liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        liElement.insertBefore(this.pauseButton, liElement.querySelector('.' + REMOVE_ICON));
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        /* istanbul ignore next */
        this.pauseButton.addEventListener('click', function (e) { _this.reloadcanceledFile(e, file, liElement); }, false);
        this.checkActionButtonStatus();
    };
    Uploader.prototype.checkChunkUpload = function () {
        return (this.asyncSettings.chunkSize <= 0 || isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    };
    Uploader.prototype.chunkUploadComplete = function (e, metaData, custom) {
        var _this = this;
        var response = e.target;
        var liElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
            var totalChunk = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            var eventArgs = {
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
                var eventArgs_1 = { event: e, fileData: metaData.file, cancel: false };
                this.trigger('canceling', eventArgs_1, function (eventArgs) {
                    /* istanbul ignore next */
                    if (eventArgs.cancel) {
                        metaData.file.statusCode = '3';
                        var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(liElement.querySelector('.e-spinner-pane'));
                        }
                        _this.sendNextRequest(metaData);
                    }
                    else {
                        metaData.request.emitError = false;
                        response.abort();
                        var formData = new FormData();
                        var name_2 = _this.element.getAttribute('name');
                        formData.append(name_2, metaData.file.name);
                        formData.append('cancel-uploading', metaData.file.name);
                        formData.append('cancelUploading', metaData.file.name);
                        var ajax = new Ajax(_this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = function (e) { _this.removeChunkFile(e, metaData, custom); return {}; };
                        ajax.send(formData);
                    }
                });
            }
            else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    var index = this.pausedData.indexOf(metaData);
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
    };
    Uploader.prototype.sendNextRequest = function (metaData) {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.removeChunkFile = function (e, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) && !custom)) {
            var liElement = this.getLiElement(metaData.file);
            var deleteIcon = liElement.querySelector('.' + ABORT_ICON);
            var spinnerTarget = deleteIcon;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            var pauseIcon = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(deleteIcon)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    };
    Uploader.prototype.pauseUpload = function (metaData, e, custom) {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    };
    Uploader.prototype.abortUpload = function (metaData, custom, eventArgs) {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        var liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            var targetElement = liElement.querySelector('.' + PAUSE_UPLOAD);
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (var i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        this.trigger('pausing', eventArgs);
    };
    Uploader.prototype.resumeUpload = function (metaData, e, custom) {
        var liElement = this.getLiElement(metaData.file);
        var targetElement;
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
        var eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.trigger('resuming', eventArgs);
        for (var i = 0; i < this.pausedData.length; i++) {
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
    };
    Uploader.prototype.updateMetaData = function (metaData) {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        }
        else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    };
    Uploader.prototype.removeChunkProgressBar = function (metaData) {
        var liElement = this.getLiElement(metaData.file);
        if (!isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            var cancelButton = liElement.querySelector('.' + ABORT_ICON);
            if (!isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    };
    Uploader.prototype.chunkUploadFailed = function (e, metaData, custom) {
        var _this = this;
        var chunkCount = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        var liElement;
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        var requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        var eventArgs = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        this.trigger('chunkFailure', eventArgs, function (eventArgs) {
            // To prevent triggering of failure event
            // tslint:disable-next-line
            if (!eventArgs.cancel) {
                if (metaData.retryCount < _this.asyncSettings.retryCount) {
                    setTimeout(function () { _this.retryRequest(liElement, metaData, custom); }, _this.asyncSettings.retryAfterDelay);
                }
                else {
                    if (!isNullOrUndefined(liElement)) {
                        var pauseButton = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                            liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                        if (!isNullOrUndefined(pauseButton)) {
                            pauseButton.classList.add(RETRY_ICON);
                            pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                        }
                        _this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                        _this.removeProgressbar(liElement, 'failure');
                        liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                        var iconElement = liElement.querySelector('.' + ABORT_ICON) ?
                            liElement.querySelector('.' + ABORT_ICON) : liElement.querySelector('.' + REMOVE_ICON);
                        iconElement.classList.remove(ABORT_ICON);
                        if (!isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                            detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        if (metaData.start > 0) {
                            iconElement.classList.add(DELETE_ICON);
                            iconElement.setAttribute('title', _this.localizedTexts('delete'));
                        }
                        else {
                            iconElement.classList.add(REMOVE_ICON);
                            iconElement.setAttribute('title', _this.localizedTexts('remove'));
                        }
                    }
                    metaData.retryCount = 0;
                    var file_1 = metaData.file;
                    var failureMessage = _this.localizedTexts('uploadFailedMessage');
                    var args = {
                        e: e, response: requestResponse,
                        operation: 'upload',
                        file: _this.updateStatus(file_1, failureMessage, '0', false),
                        statusText: failureMessage
                    };
                    _this.trigger('failure', args, function (args) {
                        // tslint:disable-next-line
                        _this.updateStatus(file_1, args.statusText, '0');
                        _this.uploadSequential();
                        _this.checkActionComplete(true);
                    });
                }
            }
        });
    };
    Uploader.prototype.retryRequest = function (liElement, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    };
    Uploader.prototype.checkPausePlayAction = function (e) {
        var targetElement = e.target;
        var selectedElement = e.target.parentElement;
        var index = this.fileList.indexOf(selectedElement);
        var fileData = this.filesData[index];
        var metaData = this.getCurrentMetaData(fileData);
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
    };
    Uploader.prototype.retryUpload = function (metaData, fromcanceledStage) {
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
    };
    Uploader.prototype.chunkUploadInProgress = function (e, metaData, custom) {
        var _this = this;
        if (metaData.file.statusCode === '4') {
            return;
        }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        var liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(liElement)) {
            return;
        }
        var retryElement = liElement.querySelector('.' + RETRY_ICON);
        if (!isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                var statusElement = liElement.querySelector('.' + STATUS);
                if (isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                var clearIcon = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                    liElement.querySelector('.' + DELETE_ICON);
                if (!isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && isNullOrUndefined(this.template) && metaData.file.statusCode !== '4') {
                var loadedSize = (metaData.chunkIndex * this.asyncSettings.chunkSize);
                var value = Math.min((((loadedSize + e.loaded) / metaData.file.size) * 100), 100);
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
            this.pauseButton.addEventListener('click', function (e) { _this.checkPausePlayAction(e); }, false);
        }
    };
    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    Uploader.prototype.bytesToSize = function (bytes) {
        var i = -1;
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
    };
    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */
    /* istanbul ignore next */
    Uploader.prototype.sortFileList = function (filesData) {
        filesData = filesData ? filesData : this.sortFilesList;
        var files = filesData;
        var fileNames = [];
        for (var i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        var sortedFileNames = fileNames.sort();
        var sortedFilesData = [];
        for (var _i = 0, sortedFileNames_1 = sortedFileNames; _i < sortedFileNames_1.length; _i++) {
            var name_3 = sortedFileNames_1[_i];
            for (var i = 0; i < files.length; i++) {
                if (name_3 === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    Uploader.prototype.destroy = function () {
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
        var attributes$$1 = ['aria-label', 'directory', 'webkitdirectory', 'tabindex'];
        for (var _i = 0, attributes_2 = attributes$$1; _i < attributes_2.length; _i++) {
            var key = attributes_2[_i];
            this.element.removeAttribute(key);
        }
        this.uploadWrapper.parentElement.appendChild(this.element);
        detach(this.uploadWrapper);
        this.uploadWrapper = null;
        _super.prototype.destroy.call(this);
    };
    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument.
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    Uploader.prototype.upload = function (files, custom) {
        files = files ? files : this.filesData;
        var uploadFiles = this.validateFileType(files);
        this.uploadFiles(uploadFiles, custom);
    };
    Uploader.prototype.validateFileType = function (files) {
        var uploadFiles = [];
        if (files instanceof Array) {
            uploadFiles = files;
        }
        else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    };
    Uploader.prototype.uploadFiles = function (files, custom) {
        var _this = this;
        var selectedFiles = [];
        var cloneFiles = [];
        if (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl)) {
            return;
        }
        if (!custom || isNullOrUndefined(custom)) {
            if (!this.multiple) {
                var file = [];
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
        var chunkEnabled = this.checkChunkUpload();
        var _loop_5 = function (i) {
            var ajax = new Ajax(this_3.asyncSettings.saveUrl, 'POST', true, null);
            ajax.emitError = false;
            var getFileData = void 0;
            /* istanbul ignore next */
            if (isBlazor()) {
                getFileData = selectedFiles.slice(0);
                cloneFiles.push(new File([getFileData[i].rawFile], getFileData[i].name));
            }
            var eventArgs = {
                fileData: (isBlazor()) ? getFileData[i] : selectedFiles[i],
                customFormData: [],
                cancel: false
            };
            var formData = new FormData();
            ajax.beforeSend = function (e) {
                eventArgs.currentRequest = ajax.httpRequest;
                /* istanbul ignore next */
                if (isBlazor()) {
                    eventArgs.fileData.rawFile = _this.base64String[i];
                    if (_this.currentRequestHeader) {
                        _this.updateCustomheader(ajax.httpRequest, _this.currentRequestHeader);
                    }
                    if (_this.customFormDatas) {
                        _this.updateFormData(formData, _this.customFormDatas);
                    }
                }
                _this.trigger('uploading', eventArgs, function (eventArgs) {
                    /* istanbul ignore next */
                    if (isBlazor()) {
                        selectedFiles[i].rawFile = eventArgs.fileData.rawFile = cloneFiles[i];
                    }
                    if (eventArgs.cancel) {
                        _this.eventCancelByArgs(e, eventArgs, selectedFiles[i]);
                    }
                    _this.updateFormData(formData, eventArgs.customFormData);
                });
            };
            if (selectedFiles[i].statusCode === '1') {
                var name_4 = this_3.element.getAttribute('name');
                formData.append(name_4, selectedFiles[i].rawFile, selectedFiles[i].name);
                if (chunkEnabled && selectedFiles[i].size > this_3.asyncSettings.chunkSize) {
                    this_3.chunkUpload(selectedFiles[i], custom, i);
                }
                else {
                    ajax.onLoad = function (e) {
                        if (eventArgs.cancel && isBlazor()) {
                            return {};
                        }
                        else {
                            _this.uploadComplete(e, selectedFiles[i], custom);
                            return {};
                        }
                    };
                    ajax.onUploadProgress = function (e) {
                        if (eventArgs.cancel && isBlazor()) {
                            return {};
                        }
                        else {
                            _this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                            return {};
                        }
                    };
                    /* istanbul ignore next */
                    ajax.onError = function (e) { _this.uploadFailed(e, selectedFiles[i]); return {}; };
                    ajax.send(formData);
                }
            }
        };
        var this_3 = this;
        for (var i = 0; i < selectedFiles.length; i++) {
            _loop_5(i);
        }
    };
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
    Uploader.prototype.remove = function (fileData, customTemplate, removeDirectly, postRawFile, args) {
        var _this = this;
        if (isNullOrUndefined(postRawFile)) {
            postRawFile = true;
        }
        var eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile
        };
        var index;
        if (this.isForm && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '')) {
            eventArgs.filesData = this.getFilesData();
            this.trigger('removing', eventArgs, function (eventArgs) {
                if (!eventArgs.cancel) {
                    _this.clearAll();
                }
            });
        }
        else {
            var removeFiles = [];
            fileData = !isNullOrUndefined(fileData) ? fileData : this.filesData;
            if (fileData instanceof Array) {
                removeFiles = fileData;
            }
            else {
                removeFiles.push(fileData);
            }
            eventArgs.filesData = removeFiles;
            var removeUrl = this.asyncSettings.removeUrl;
            var validUrl = (removeUrl === '' || isNullOrUndefined(removeUrl)) ? false : true;
            var _loop_6 = function (files) {
                index = this_4.filesData.indexOf(files);
                if ((files.statusCode === '2' || files.statusCode === '4') && validUrl) {
                    this_4.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                }
                else {
                    if (!removeDirectly) {
                        this_4.trigger('removing', eventArgs, function (eventArgs) {
                            if (!eventArgs.cancel) {
                                _this.removeFilesData(files, customTemplate);
                            }
                        });
                    }
                    else {
                        this_4.removeFilesData(files, customTemplate);
                    }
                }
                if (this_4.sequentialUpload) {
                    /* istanbul ignore next */
                    if (index <= this_4.actionCompleteCount) {
                        this_4.checkActionComplete(false);
                    }
                }
                else {
                    this_4.checkActionComplete(false);
                }
            };
            var this_4 = this;
            for (var _i = 0, removeFiles_1 = removeFiles; _i < removeFiles_1.length; _i++) {
                var files = removeFiles_1[_i];
                _loop_6(files);
            }
        }
    };
    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    Uploader.prototype.clearAll = function () {
        var _this = this;
        if (isNullOrUndefined(this.listParent)) {
            if (this.browserName !== 'msie') {
                this.element.value = '';
            }
            this.filesData = [];
            return;
        }
        var eventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        this.trigger('clearing', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel) {
                _this.clearData();
                _this.actionCompleteCount = 0;
                _this.count = -1;
            }
        });
    };
    /**
     * Get the data of files which are shown in file list.
     * @returns FileInfo[]
     */
    Uploader.prototype.getFilesData = function () {
        if (!isBlazor()) {
            return this.filesData;
        }
        else {
            for (var i = 0; i < this.filesData.length; i++) {
                this.filesData[i].rawFile = this.base64String[i];
            }
            return this.filesData;
        }
    };
    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.pause = function (fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.validateFileType(fileData);
        this.pauseUploading(fileDataFiles, custom);
    };
    Uploader.prototype.pauseUploading = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    Uploader.prototype.getFiles = function (fileData) {
        var files = [];
        if (!isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        }
        else {
            files = fileData;
        }
        return files;
    };
    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    Uploader.prototype.resume = function (fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.validateFileType(fileData);
        this.resumeFiles(fileDataFiles, custom);
    };
    Uploader.prototype.resumeFiles = function (fileData, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    };
    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    Uploader.prototype.retry = function (fileData, fromcanceledStage, custom) {
        fileData = fileData ? fileData : this.filesData;
        var fileDataFiles = this.validateFileType(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    };
    Uploader.prototype.retryFailedFiles = function (fileData, fromcanceledStage, custom) {
        var files = this.getFiles(fileData);
        for (var i = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                }
                else {
                    var liElement = void 0;
                    if (!custom) {
                        liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    };
    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    Uploader.prototype.cancel = function (fileData) {
        fileData = fileData ? fileData : this.filesData;
        var cancelingFiles = this.validateFileType(fileData);
        this.cancelUpload(cancelingFiles);
    };
    Uploader.prototype.cancelUpload = function (fileData) {
        var files = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    var metaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
        else {
            for (var i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    };
    Uploader.prototype.showHideUploadSpinner = function (files) {
        var liElement = this.getLiElement(files);
        if (!isNullOrUndefined(liElement) && isNullOrUndefined(this.template)) {
            var spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
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
    return Uploader;
}(Component));

/**
 * Uploader modules
 */

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var APPLY = 'e-apply';
var CANCEL = 'e-cancel';
var CURRENT = 'e-current';
var CONTAINER = 'e-container';
var CTRLBTN = 'e-ctrl-btn';
var CTRLSWITCH = 'e-switch-ctrl-btn';
var DISABLED$1 = 'e-disabled';
var FORMATSWITCH = 'e-value-switch-btn';
var HANDLER = 'e-handler';
var HEX = 'e-hex';
var HIDEHEX = 'e-hide-hex-value';
var HIDEOPACITY = 'e-hide-opacity';
var HIDERGBA = 'e-hide-switchable-value';
var HIDEVALUE = 'e-hide-value';
var HIDEVALUESWITCH = 'e-hide-valueswitcher';
var HSVAREA = 'e-hsv-color';
var HSVCONTAINER = 'e-hsv-container';
var INPUTWRAPPER = 'e-selected-value';
var MODESWITCH = 'e-mode-switch-btn';
var NOCOLOR = 'e-nocolor-item';
var OPACITY = 'e-opacity-value';
var PALETTES = 'e-palette';
var PALETTECONTENT = 'e-color-palette';
var PICKERCONTENT = 'e-color-picker';
var PREVIEW = 'e-preview-container';
var PREVIOUS = 'e-previous';
var RTL$1 = 'e-rtl';
var SHOWVALUE = 'e-show-value';
var SELECT = 'e-selected';
var SPLITPREVIEW = 'e-split-preview';
var TILE = 'e-tile';
var presets = {
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
var ColorPicker = /** @__PURE__ @class */ (function (_super) {
    __extends$5(ColorPicker, _super);
    function ColorPicker(options, element) {
        return _super.call(this, options, element) || this;
    }
    ColorPicker.prototype.preRender = function () {
        var ele = this.element;
        this.formElement = closest(this.element, 'form');
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        var localeText = { Apply: 'Apply', Cancel: 'Cancel', ModeSwitcher: 'Switch Mode' };
        this.l10n = new L10n('colorpicker', localeText, this.locale);
        if (ele.getAttribute('ejs-for') && !ele.getAttribute('name')) {
            ele.setAttribute('name', ele.id);
        }
    };
    /**
     * To Initialize the component rendering
     * @private
     */
    ColorPicker.prototype.render = function () {
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
    };
    ColorPicker.prototype.initWrapper = function () {
        var wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        attributes(this.element, { 'tabindex': '-1', 'spellcheck': 'false' });
        this.container = this.createElement('div', { className: CONTAINER });
        this.getWrapper().appendChild(this.container);
        var value = this.value ? this.roundValue(this.value).toLowerCase() : '#008000ff';
        var slicedValue = value.slice(0, 7);
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
    };
    ColorPicker.prototype.getWrapper = function () {
        return this.element.parentElement;
    };
    ColorPicker.prototype.createWidget = function () {
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
    };
    ColorPicker.prototype.createSplitBtn = function () {
        var _this = this;
        var splitButton = this.createElement('button', { className: 'e-split-colorpicker' });
        this.getWrapper().appendChild(splitButton);
        this.splitBtn = new SplitButton({
            iconCss: 'e-selected-color',
            target: this.container,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            open: this.onOpen.bind(this),
            beforeOpen: this.beforeOpenFn.bind(this),
            beforeClose: this.beforePopupClose.bind(this),
            click: function (args) {
                _this.trigger('change', {
                    currentValue: { hex: _this.value.slice(0, 7), rgba: _this.convertToRgbString(_this.hexToRgb(_this.value)) },
                    previousValue: { hex: null, rgba: null }, value: _this.value
                });
            }
        });
        this.splitBtn.createElement = this.createElement;
        this.splitBtn.appendTo(splitButton);
        var preview = this.createElement('span', { className: SPLITPREVIEW });
        select('.e-selected-color', splitButton).appendChild(preview);
        preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(this.value));
        var popupEle = this.getPopupEle();
        addClass([popupEle], 'e-colorpicker-popup');
        if (this.cssClass) {
            addClass([popupEle], this.cssClass.split(' '));
        }
        if (Browser.isDevice) {
            var popupInst = this.getPopupInst();
            popupInst.relateTo = document.body;
            popupInst.position = { X: 'center', Y: 'center' };
            popupInst.targetType = 'container';
            popupInst.collision = { X: 'fit', Y: 'fit' };
            popupInst.offsetY = 4;
            popupEle.style.zIndex = getZindexPartial(this.splitBtn.element).toString();
        }
    };
    ColorPicker.prototype.onOpen = function (args) {
        this.trigger('open', { element: this.container });
    };
    ColorPicker.prototype.getPopupInst = function () {
        return getInstance(this.getPopupEle(), Popup);
    };
    ColorPicker.prototype.beforeOpenFn = function (args) {
        var _this = this;
        var beforeOpenArgs = { element: this.container, event: args.event, cancel: false };
        this.trigger('beforeOpen', beforeOpenArgs, function (observeOpenArgs) {
            args.cancel = observeOpenArgs.cancel;
            if (!observeOpenArgs.cancel) {
                var popupEle = _this.getPopupEle();
                popupEle.style.top = formatUnit(0 + pageYOffset);
                popupEle.style.left = formatUnit(0 + pageXOffset);
                popupEle.style.display = 'block';
                _this.createWidget();
                popupEle.style.display = '';
                if (Browser.isDevice) {
                    _this.modal = _this.createElement('div');
                    _this.modal.className = 'e-' + _this.getModuleName() + ' e-modal';
                    _this.modal.style.display = 'none';
                    document.body.insertBefore(_this.modal, popupEle);
                    document.body.className += ' e-colorpicker-overflow';
                    _this.modal.style.display = 'block';
                    _this.modal.style.zIndex = (Number(popupEle.style.zIndex) - 1).toString();
                }
            }
        });
    };
    ColorPicker.prototype.beforePopupClose = function (args) {
        var _this = this;
        if (!isNullOrUndefined(args.event)) {
            var beforeCloseArgs = { element: this.container, event: args.event, cancel: false };
            this.trigger('beforeClose', beforeCloseArgs, function (observedCloseArgs) {
                if (Browser.isDevice && args.event.target === _this.modal) {
                    observedCloseArgs.cancel = true;
                }
                args.cancel = observedCloseArgs.cancel;
                if (!observedCloseArgs.cancel) {
                    _this.onPopupClose();
                }
            });
        }
    };
    ColorPicker.prototype.onPopupClose = function () {
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
    };
    ColorPicker.prototype.createPalette = function () {
        classList(this.container, [PALETTECONTENT], [PICKERCONTENT]);
        if (this.presetColors) {
            var paletteGroup = this.createElement('div', { className: 'e-custom-palette' });
            this.appendElement(paletteGroup);
            var keys = Object.keys(this.presetColors);
            if (keys.length === 1) {
                this.appendPalette(this.presetColors[keys[0]], keys[0], paletteGroup);
            }
            else {
                for (var i = 0, len = keys.length; i < len; i++) {
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
        var width = parseInt(getComputedStyle(this.container).borderBottomWidth, 10);
        this.container.style.width = formatUnit(this.container.children[0].offsetWidth + width + width);
        this.rgb = this.hexToRgb(this.roundValue(this.value));
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
    };
    ColorPicker.prototype.firstPaletteFocus = function () {
        if (!select('.' + SELECT, this.container.children[0])) {
            selectAll('.' + PALETTES, this.container)[0].focus();
        }
    };
    ColorPicker.prototype.appendPalette = function (colors, key, refEle) {
        var palette = this.createElement('div', { className: PALETTES, attrs: { 'tabindex': '0' } });
        if (refEle) {
            refEle.appendChild(palette);
        }
        else {
            this.appendElement(palette);
        }
        var row;
        var tile;
        var roundedColor;
        for (var i = 0, len = colors.length; i < len; i++) {
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
    };
    ColorPicker.prototype.setNoColor = function () {
        var noColorEle = this.container.querySelector('.e-row').children[0];
        noColorEle.classList.add(NOCOLOR);
        if (!this.value) {
            noColorEle.classList.add(SELECT);
            closest(noColorEle, '.' + PALETTES).focus();
        }
        ['aria-selected', 'aria-label'].forEach(function (attr) { noColorEle.removeAttribute(attr); });
        noColorEle.style.backgroundColor = '';
    };
    ColorPicker.prototype.appendElement = function (ele, insertPos) {
        if (insertPos === void 0) { insertPos = 0; }
        var refEle = this.container.children[insertPos];
        refEle ? this.container.insertBefore(ele, refEle) : this.container.appendChild(ele);
    };
    ColorPicker.prototype.addTileSelection = function (ele) {
        ele.classList.add(SELECT);
        ele.setAttribute('aria-selected', 'true');
    };
    ColorPicker.prototype.createPicker = function () {
        classList(this.container, [PICKERCONTENT], [PALETTECONTENT]);
        var hsvContainer = this.createElement('div', { className: HSVCONTAINER });
        this.appendElement(hsvContainer);
        hsvContainer.appendChild(this.createElement('div', { className: HSVAREA }));
        var dragHandler = this.createElement('span', { className: HANDLER, attrs: { 'tabindex': '0' } });
        hsvContainer.appendChild(dragHandler);
        this.rgb = this.hexToRgb(this.value);
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
        this.setHsvContainerBg();
        this.setHandlerPosition();
        this.createSlider();
        this.createDragTooltip();
    };
    ColorPicker.prototype.setHsvContainerBg = function (h) {
        if (h === void 0) { h = this.hsv[0]; }
        this.getHsvContainer().style.backgroundColor = this.convertToRgbString(this.hsvToRgb(h, 100, 100, 1));
    };
    ColorPicker.prototype.getHsvContainer = function () {
        return select('.' + HSVCONTAINER, this.container);
    };
    ColorPicker.prototype.setHandlerPosition = function () {
        var dragHandler = this.getDragHandler();
        var hsvArea = select('.' + HSVAREA, this.container);
        if (this.enableRtl) {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * Math.abs(100 - this.hsv[1]) / 100);
        }
        else {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * this.hsv[1] / 100);
        }
        dragHandler.style.top = formatUnit(hsvArea.offsetHeight * (100 - this.hsv[2]) / 100);
    };
    ColorPicker.prototype.createSlider = function () {
        var sliderPreviewWrapper = this.createElement('div', { className: 'e-slider-preview' });
        this.appendElement(sliderPreviewWrapper, 1);
        this.createPreview(sliderPreviewWrapper);
        var sliderWrapper = this.createElement('div', { className: 'e-colorpicker-slider' });
        sliderPreviewWrapper.insertBefore(sliderWrapper, sliderPreviewWrapper.children[0]);
        var slider = this.createElement('div', { className: 'e-hue-slider' });
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
    };
    ColorPicker.prototype.createOpacitySlider = function (slider) {
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
        var opacityBgTrack = this.createElement('div', { className: 'e-opacity-empty-track' });
        slider.appendChild(opacityBgTrack);
        this.updateOpacitySliderBg();
    };
    ColorPicker.prototype.updateOpacitySliderBg = function () {
        var direction = this.enableRtl ? 'to left' : 'to right';
        select('.e-slider-track', this.opacitySlider.element).style.background =
            'linear-gradient(' + direction + ', rgba(' + this.rgb.slice(0, 3) + ', 0) 0%, ' +
                this.convertToRgbString(this.rgb.slice(0, 3)) + ' 100%)';
    };
    ColorPicker.prototype.hueChange = function (args) {
        this.hsv[0] = args.value;
        this.setHsvContainerBg();
        this.convertToOtherFormat();
    };
    ColorPicker.prototype.opacityChange = function (args) {
        var value = args.value;
        var pValue = this.rgbToHex(this.rgb);
        this.hsv[3] = value / 100;
        this.rgb[3] = value / 100;
        var cValue = this.rgbToHex(this.rgb);
        this.updateOpacityInput(value);
        var rgb = this.convertToRgbString(this.rgb);
        this.updatePreview(rgb);
        this.triggerEvent(cValue, pValue, rgb);
    };
    ColorPicker.prototype.updateOpacityInput = function (value) {
        if (!this.getWrapper().classList.contains(HIDEVALUE)) {
            var opacityTextBoxInst = getInstance(select('.' + OPACITY, this.container), NumericTextBox);
            opacityTextBoxInst.value = value;
            opacityTextBoxInst.dataBind();
        }
    };
    ColorPicker.prototype.createPreview = function (parentEle) {
        var previewContainer = this.createElement('div', { className: PREVIEW });
        parentEle.appendChild(previewContainer);
        var preview = this.createElement('span', { className: 'e-preview ' + CURRENT });
        previewContainer.appendChild(preview);
        var colorValue = this.convertToRgbString(this.rgb);
        preview.style.backgroundColor = colorValue;
        preview = this.createElement('span', { className: 'e-preview ' + PREVIOUS });
        previewContainer.appendChild(preview);
        preview.style.backgroundColor = colorValue;
    };
    ColorPicker.prototype.isPicker = function () {
        return !this.container.classList.contains(PALETTECONTENT);
    };
    ColorPicker.prototype.getPopupEle = function () {
        return this.container.parentElement;
    };
    ColorPicker.prototype.createNumericInput = function (element, value, label, max) {
        var _this = this;
        var numericInput = new NumericTextBox({
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
            change: function (args) {
                if (args.event) {
                    _this.inputHandler(args.event);
                }
            }
        });
        numericInput.createElement = this.createElement;
        numericInput.appendTo(element);
    };
    ColorPicker.prototype.createInput = function () {
        var isPicker = this.isPicker();
        var wrapper = this.getWrapper();
        if ((isPicker && !wrapper.classList.contains(HIDEVALUE)) || (!isPicker && wrapper.classList.contains(SHOWVALUE))) {
            var inputWrap = this.createElement('div', { className: INPUTWRAPPER });
            isPicker ? this.appendElement(inputWrap, 2) : this.appendElement(inputWrap, 1);
            var container = this.createElement('div', { className: 'e-input-container' });
            inputWrap.appendChild(container);
            if (!wrapper.classList.contains(HIDEVALUESWITCH)) {
                this.appendValueSwitchBtn(inputWrap);
            }
            if (!wrapper.classList.contains(HIDEHEX)) {
                var hexInput = this.createElement('input', {
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
                var label = void 0;
                var value = void 0;
                if (this.isRgb) {
                    label = 'RGB';
                    value = this.rgb;
                }
                else {
                    label = 'HSV';
                    value = this.hsv;
                }
                var clsName = ['rh', 'gs', 'bv'];
                for (var i = 0; i < 3; i++) {
                    this.createNumericInput(container.appendChild(this.createElement('input', { className: 'e-' + clsName[i] + '-value' })), value[i], label[i], 255);
                }
                if (this.enableOpacity) {
                    this.appendOpacityValue(container);
                }
            }
        }
    };
    ColorPicker.prototype.appendOpacityValue = function (container) {
        this.createNumericInput(container.appendChild(this.createElement('input', { className: OPACITY })), this.rgb[3] * 100, 'A', 100);
    };
    ColorPicker.prototype.appendValueSwitchBtn = function (targetEle) {
        var valueSwitchBtn = this.createElement('button', {
            className: 'e-icons e-css e-btn e-flat e-icon-btn ' + FORMATSWITCH
        });
        targetEle.appendChild(valueSwitchBtn);
        if (this.isPicker() && !this.getWrapper().classList.contains(HIDERGBA)) {
            valueSwitchBtn.addEventListener('click', this.formatSwitchHandler.bind(this));
        }
    };
    ColorPicker.prototype.createCtrlBtn = function () {
        if (this.modeSwitcher || this.showButtons) {
            this.l10n.setLocale(this.locale);
            var btnWrapper = this.createElement('div', { className: CTRLSWITCH });
            this.container.appendChild(btnWrapper);
            if (this.showButtons) {
                var controlBtnWrapper = this.createElement('div', { className: CTRLBTN });
                btnWrapper.appendChild(controlBtnWrapper);
                var apply = this.l10n.getConstant('Apply');
                controlBtnWrapper.appendChild(this.createElement('button', {
                    innerHTML: apply,
                    className: 'e-btn e-css e-flat e-primary e-small ' + APPLY,
                    attrs: { 'title': apply }
                }));
                var cancel = this.l10n.getConstant('Cancel');
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
    };
    ColorPicker.prototype.appendModeSwitchBtn = function () {
        var modeSwitcher = this.createElement('button', {
            className: 'e-icons e-btn e-flat e-icon-btn ' + MODESWITCH, attrs: { title: this.l10n.getConstant('ModeSwitcher') }
        });
        select('.' + CTRLSWITCH, this.container).insertBefore(modeSwitcher, select('.' + CTRLBTN, this.container));
    };
    ColorPicker.prototype.createDragTooltip = function () {
        var _this = this;
        var tooltip = new Tooltip({
            opensOn: 'Custom',
            showTipPointer: false,
            cssClass: 'e-color-picker-tooltip',
            beforeOpen: function (args) {
                _this.tooltipEle = args.element;
            },
            animation: { open: { effect: 'None' }, close: { effect: 'None' } }
        });
        tooltip.createElement = this.createElement;
        tooltip.appendTo(this.container);
        tooltip.open(this.container);
        this.tooltipEle.style.zIndex = getZindexPartial(this.tooltipEle).toString();
        select('.e-tip-content', this.tooltipEle).appendChild(this.createElement('div', { className: 'e-tip-transparent' }));
    };
    ColorPicker.prototype.getTooltipInst = function () {
        return getInstance(this.container, Tooltip);
    };
    ColorPicker.prototype.setTooltipOffset = function (value) {
        this.getTooltipInst().offsetY = value;
    };
    ColorPicker.prototype.toggleDisabled = function (enable) {
        enable ? this.getWrapper().classList.add(DISABLED$1) : this.getWrapper().classList.remove(DISABLED$1);
        if (this.showButtons) {
            ([].slice.call(selectAll('.e-btn', this.container))).forEach(function (ele) {
                enable ? attributes(ele, { 'disabled': '' }) : ele.removeAttribute('disabled');
            });
        }
    };
    ColorPicker.prototype.convertToRgbString = function (rgb) {
        return rgb.length ? rgb.length === 4 ? 'rgba(' + rgb.join() + ')' : 'rgb(' + rgb.join() + ')' : '';
    };
    ColorPicker.prototype.convertToHsvString = function (hsv) {
        return hsv.length === 4 ? 'hsva(' + hsv.join() + ')' : 'hsv(' + hsv.join() + ')';
    };
    ColorPicker.prototype.updateHsv = function () {
        this.hsv[1] = this.hsv[1] > 100 ? 100 : this.hsv[1];
        this.hsv[2] = this.hsv[2] > 100 ? 100 : this.hsv[2];
        this.setHandlerPosition();
    };
    ColorPicker.prototype.convertToOtherFormat = function (isKey) {
        if (isKey === void 0) { isKey = false; }
        var pValue = this.rgbToHex(this.rgb);
        this.rgb = this.hsvToRgb.apply(this, this.hsv);
        var cValue = this.rgbToHex(this.rgb);
        var rgba = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.updateInput(cValue);
        this.triggerEvent(cValue, pValue, rgba, isKey);
    };
    ColorPicker.prototype.updateInput = function (value) {
        var wrapper = this.getWrapper();
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
    };
    ColorPicker.prototype.updatePreview = function (value) {
        if (this.enableOpacity) {
            this.updateOpacitySliderBg();
        }
        select('.e-tip-transparent', this.tooltipEle).style.backgroundColor = value;
        select('.' + PREVIEW + ' .' + CURRENT, this.container).style.backgroundColor = value;
        select('.' + PREVIEW + ' .' + PREVIOUS, this.container).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
    };
    ColorPicker.prototype.getDragHandler = function () {
        return select('.' + HANDLER, this.container);
    };
    ColorPicker.prototype.removeTileSelection = function () {
        var selectedEle = [].slice.call(selectAll('.' + SELECT, this.container.children[0]));
        selectedEle.forEach(function (ele) {
            ele.classList.remove(SELECT);
            ele.setAttribute('aria-selected', 'false');
        });
    };
    ColorPicker.prototype.convertRgbToNumberArray = function (value) {
        return (value.slice(value.indexOf('(') + 1, value.indexOf(')'))).split(',').map(function (n, i) {
            return (i !== 3) ? parseInt(n, 10) : parseFloat(n);
        });
    };
    /**
     * To get color value in specified type.
     * @param value - Specify the color value.
     * @param type - Specify the type to which the specified color needs to be converted.
     * @method getValue
     * @return {string}
     */
    ColorPicker.prototype.getValue = function (value, type) {
        if (!value) {
            value = this.value;
        }
        type = !type ? 'hex' : type.toLowerCase();
        if (value[0] === 'r') {
            var cValue = this.convertRgbToNumberArray(value);
            if (type === 'hex' || type === 'hexa') {
                var hex = this.rgbToHex(cValue);
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
                var cValue = this.hsvToRgb.apply(this, this.convertRgbToNumberArray(value));
                if (type === 'rgba') {
                    return this.convertToRgbString(cValue);
                }
                else {
                    if (type === 'hex' || type === 'hexa') {
                        var hex = this.rgbToHex(cValue);
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
                var rgb = this.hexToRgb(value);
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
    };
    /**
     * To show/hide ColorPicker popup based on current state of the SplitButton.
     * @method toggle
     * @return {void}
     */
    ColorPicker.prototype.toggle = function () {
        this.container.parentElement.classList.contains('e-popup-close') ? this.splitBtn.toggle() : this.closePopup(null);
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    ColorPicker.prototype.getModuleName = function () {
        return 'colorpicker';
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    ColorPicker.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    ColorPicker.prototype.wireEvents = function () {
        if (this.isPicker()) {
            var dragHandler = this.getDragHandler();
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
    };
    ColorPicker.prototype.formResetHandler = function () {
        this.value = this.initialInputValue;
        attributes(this.element, { 'value': this.initialInputValue });
    };
    ColorPicker.prototype.addCtrlSwitchEvent = function () {
        EventHandler.add(select('.' + CTRLSWITCH, this.container), 'click', this.btnClickHandler, this);
    };
    ColorPicker.prototype.pickerKeyDown = function (e) {
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
                var cValue = this.rgbToHex(this.rgb);
                this.enterKeyHandler(cValue, e);
        }
    };
    ColorPicker.prototype.enterKeyHandler = function (value, e) {
        this.triggerChangeEvent(value);
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    };
    ColorPicker.prototype.closePopup = function (e) {
        var _this = this;
        var beforeCloseArgs = { element: this.container, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, function (observedcloseArgs) {
            if (!observedcloseArgs.cancel) {
                _this.splitBtn.toggle();
                _this.onPopupClose();
            }
        });
    };
    ColorPicker.prototype.triggerChangeEvent = function (value) {
        var hex = value.slice(0, 7);
        this.trigger('change', {
            currentValue: { hex: hex, rgba: this.convertToRgbString(this.rgb) },
            previousValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) },
            value: value
        });
        this.setProperties({ 'value': value }, true);
        this.element.value = hex ? hex : '#000000';
    };
    ColorPicker.prototype.handlerDragPosition = function (prob, value, e) {
        e.preventDefault();
        this.hsv[prob] += value * (e.ctrlKey ? 1 : 3);
        if (this.hsv[prob] < 0) {
            this.hsv[prob] = 0;
        }
        this.updateHsv();
        this.convertToOtherFormat(true);
    };
    ColorPicker.prototype.handlerDown = function (e) {
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
    };
    ColorPicker.prototype.handlerMove = function (e) {
        if (e.type !== 'touchmove') {
            e.preventDefault();
        }
        var x;
        var y;
        if (e.type === 'mousemove') {
            x = Math.abs(e.pageX - pageXOffset);
            y = Math.abs(e.pageY - pageYOffset);
        }
        else {
            x = Math.abs(e.changedTouches[0].pageX - pageXOffset);
            y = Math.abs(e.changedTouches[0].pageY - pageYOffset);
        }
        this.setHsv(x, y);
        var dragHandler = this.getDragHandler();
        var left = parseInt(dragHandler.style.left, 10);
        var top = parseInt(dragHandler.style.top, 10);
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
    };
    ColorPicker.prototype.setHsv = function (clientX, clientY) {
        var ele = select('.' + HSVAREA, this.container);
        var position = ele.getBoundingClientRect();
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
    };
    ColorPicker.prototype.handlerEnd = function (e) {
        if (e.type !== 'touchend') {
            e.preventDefault();
        }
        EventHandler.remove(document, 'mousemove touchmove', this.handlerMove);
        EventHandler.remove(document, 'mouseup touchend', this.handlerEnd);
        var dragHandler = this.getDragHandler();
        select('.' + HSVAREA, this.container).style.cursor = '';
        if (this.tooltipEle.style.transform) {
            this.tooltipEle.style.transform = '';
            dragHandler.classList.remove('e-hide-handler');
        }
        if (!this.inline && !this.showButtons) {
            this.closePopup(e);
        }
    };
    ColorPicker.prototype.btnClickHandler = function (e) {
        var target = e.target;
        if (closest(target, '.' + MODESWITCH)) {
            e.stopPropagation();
            this.switchToPalette();
        }
        else {
            if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                this.ctrlBtnClick(target, e);
            }
        }
    };
    ColorPicker.prototype.switchToPalette = function () {
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
    };
    ColorPicker.prototype.refreshPopupPos = function () {
        if (!this.inline) {
            var popupEle = this.getPopupEle();
            popupEle.style.left = formatUnit(0 + pageXOffset);
            popupEle.style.top = formatUnit(0 + pageYOffset);
            this.getPopupInst().refreshPosition(this.splitBtn.element.parentElement);
        }
    };
    ColorPicker.prototype.formatSwitchHandler = function (e) {
        var target = e.target.parentElement;
        if (this.isRgb) {
            this.updateValue(this.hsv, true, 3, [360, 100, 100]);
            this.isRgb = false;
        }
        else {
            this.updateValue(this.rgb, true, 2);
            this.isRgb = true;
        }
    };
    ColorPicker.prototype.updateValue = function (value, format, idx, max) {
        var clsName = ['e-rh-value', 'e-gs-value', 'e-bv-value'];
        var inst;
        for (var i = 0, len = clsName.length; i < len; i++) {
            inst = getInstance(select('.' + clsName[i], this.container), NumericTextBox);
            inst.value = Math.round(value[i]);
            if (format) {
                inst.placeholder = clsName[i].substr(idx, 1).toUpperCase();
                inst.max = max ? max[i] : 255;
            }
            inst.dataBind();
        }
    };
    ColorPicker.prototype.previewHandler = function (e) {
        var target = e.target;
        var pValue = this.rgbToHex(this.rgb);
        this.rgb = this.convertRgbToNumberArray(target.style.backgroundColor);
        if (!this.rgb[3]) {
            this.rgb[3] = 1;
        }
        var cValue = this.rgbToHex(this.rgb);
        var hsv = this.rgbToHsv.apply(this, this.rgb);
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
    };
    ColorPicker.prototype.paletteClickHandler = function (e) {
        e.preventDefault();
        var target = e.target;
        if (target.classList.contains(TILE)) {
            this.removeTileSelection();
            this.addTileSelection(target);
            if (target.classList.contains(NOCOLOR)) {
                this.noColorTile();
            }
            else {
                var cValue = target.getAttribute('aria-label');
                var pValue = this.rgbToHex(this.rgb);
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
    };
    ColorPicker.prototype.noColorTile = function (isKey) {
        if (isKey === void 0) { isKey = false; }
        var pValue = this.rgbToHex(this.rgb);
        this.rgb = [];
        this.hsv = [];
        this.triggerEvent('', pValue, '', isKey);
    };
    ColorPicker.prototype.switchToPicker = function () {
        var wrapper = this.getWrapper();
        this.trigger('beforeModeSwitch', { element: this.container, mode: 'Picker' });
        this.unWireEvents();
        ([].slice.call(selectAll('.' + PALETTES, this.container))).forEach(function (ele) {
            detach(ele);
        });
        if (wrapper.classList.contains(SHOWVALUE)) {
            detach(select('.' + INPUTWRAPPER, this.container));
        }
        this.container.style.width = '';
        var grpEle = select('.e-custom-palette', this.container);
        if (this.presetColors) {
            remove(grpEle);
        }
        this.createPicker();
        this.getDragHandler().focus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
    };
    ColorPicker.prototype.ctrlBtnClick = function (ele, e) {
        if (ele.classList.contains(APPLY)) {
            var cValue = this.rgbToHex(this.rgb);
            this.triggerChangeEvent(cValue);
        }
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    };
    ColorPicker.prototype.paletteKeyDown = function (e) {
        var target = e.target;
        if (!target.classList.contains(PALETTES)) {
            return;
        }
        var selectedEle;
        var idx;
        var tiles = [].slice.call(selectAll('.' + TILE, target));
        var prevSelectedEle = (tiles.filter(function (tile) { return tile.classList.contains('e-selected'); })).pop();
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
                    var cValue = prevSelectedEle.getAttribute('aria-label');
                    this.enterKeyHandler(cValue ? cValue : '', e);
                }
        }
    };
    ColorPicker.prototype.keySelectionChanges = function (newEle) {
        this.removeTileSelection();
        this.addTileSelection(newEle);
        if (newEle.classList.contains(NOCOLOR)) {
            this.noColorTile(true);
        }
        else {
            var cValue = newEle.getAttribute('aria-label');
            var pValue = this.rgbToHex(this.rgb);
            this.rgb = this.hexToRgb(cValue);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            if (this.getWrapper().classList.contains(SHOWVALUE)) {
                this.updateInput(cValue);
            }
            this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb), true);
        }
    };
    ColorPicker.prototype.tilePosition = function (items, element, cIdx) {
        items = Array.prototype.slice.call(items);
        var n = items.length;
        var emptyCount = this.columns - items[n - 1].parentElement.childElementCount;
        var idx = items.indexOf(element);
        idx += cIdx;
        idx < 0 ? idx += n + emptyCount : idx %= n + emptyCount;
        return idx;
    };
    ColorPicker.prototype.inputHandler = function (e) {
        var target = e.target;
        if (!target.value.length) {
            return;
        }
        var hsv;
        var pValue;
        var label = select('.e-float-text', target.parentElement).textContent;
        switch (label) {
            case 'HEX':
                var value = '';
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
    };
    ColorPicker.prototype.inputValueChange = function (hsv, pValue, value) {
        if (hsv[0] !== this.hsv[0]) {
            this.hueSlider.setProperties({ 'value': hsv[0] }, true);
            this.hueSlider.refresh();
            this.setHsvContainerBg(hsv[0]);
        }
        this.hsv = hsv;
        var cValue = this.rgbToHex(this.rgb);
        this.setHandlerPosition();
        this.updateInput(value ? value : cValue);
        var rgba = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.triggerEvent(cValue, pValue, rgba);
    };
    ColorPicker.prototype.triggerEvent = function (cValue, pValue, rgba, isKey) {
        if (isKey === void 0) { isKey = false; }
        var hex = cValue.slice(0, 7);
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
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    ColorPicker.prototype.destroy = function () {
        var _this = this;
        var wrapper = this.getWrapper();
        _super.prototype.destroy.call(this);
        ['tabindex', 'spellcheck'].forEach(function (attr) { _this.element.removeAttribute(attr); });
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
    };
    ColorPicker.prototype.destroyOtherComp = function () {
        if (this.isPicker()) {
            this.hueSlider.destroy();
            if (this.enableOpacity) {
                this.opacitySlider.destroy();
                this.opacitySlider = null;
            }
            this.hueSlider = null;
            var tooltipInst = this.getTooltipInst();
            tooltipInst.close();
            tooltipInst.destroy();
            this.tooltipEle = null;
        }
    };
    ColorPicker.prototype.isPopupOpen = function () {
        return this.getPopupEle().classList.contains('e-popup-open');
    };
    ColorPicker.prototype.unWireEvents = function () {
        if (this.isPicker()) {
            var wrapper = this.getWrapper();
            var dragHandler = this.getDragHandler();
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
    };
    ColorPicker.prototype.roundValue = function (value) {
        if (!value) {
            return '';
        }
        if (value[0] !== '#') {
            value = '#' + value;
        }
        var len = value.length;
        if (len === 4) {
            value += 'f';
            len = 5;
        }
        if (len === 5) {
            var tempValue = '';
            for (var i = 1, len_1 = value.length; i < len_1; i++) {
                tempValue += (value.charAt(i) + value.charAt(i));
            }
            value = '#' + tempValue;
            len = 9;
        }
        if (len === 7) {
            value += 'ff';
        }
        return value;
    };
    ColorPicker.prototype.hexToRgb = function (hex) {
        if (!hex) {
            return [];
        }
        hex = hex.trim();
        if (hex.length !== 9) {
            hex = this.roundValue(hex);
        }
        var opacity = Number((parseInt(hex.slice(-2), 16) / 255).toFixed(2));
        hex = hex.slice(1, 7);
        var bigInt = parseInt(hex, 16);
        var h = [];
        h.push((bigInt >> 16) & 255);
        h.push((bigInt >> 8) & 255);
        h.push(bigInt & 255);
        h.push(opacity);
        return h;
    };
    ColorPicker.prototype.rgbToHsv = function (r, g, b, opacity) {
        if (this.rgb && !this.rgb.length) {
            return [];
        }
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h;
        var s;
        var v = max;
        var d = max - min;
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
        var hsv = [Math.round(h * 360), Math.round(s * 1000) / 10, Math.round(v * 1000) / 10];
        if (!isNullOrUndefined(opacity)) {
            hsv.push(opacity);
        }
        return hsv;
    };
    ColorPicker.prototype.hsvToRgb = function (h, s, v, opacity) {
        var r;
        var g;
        var b;
        var i;
        var f;
        var p;
        var q;
        var t;
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
        var rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        if (!isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    };
    ColorPicker.prototype.rgbToHex = function (rgb) {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    };
    ColorPicker.prototype.hex = function (x) {
        return ('0' + x.toString(16)).slice(-2);
    };
    ColorPicker.prototype.changeModeSwitcherProp = function (prop) {
        var ctrlSwitchWrapper = select('.' + CTRLSWITCH, this.container);
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
    };
    ColorPicker.prototype.changeShowBtnProps = function (prop) {
        var ctrlBtnWrapper = select('.' + CTRLSWITCH, this.container);
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
    };
    ColorPicker.prototype.changeValueProp = function (newProp) {
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
            var ele = select('span[aria-label="' + this.roundValue(newProp) + '"]', this.container);
            if (ele) {
                this.addTileSelection(ele);
            }
        }
    };
    ColorPicker.prototype.setInputEleProps = function (prop) {
        remove(select('.' + INPUTWRAPPER, this.container));
        this.createInput();
    };
    ColorPicker.prototype.changeDisabledProp = function (newProp) {
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
    };
    ColorPicker.prototype.changeCssClassProps = function (newProp, oldProp) {
        var wrapper = this.getWrapper();
        var popupWrapper = this.getPopupEle();
        if (oldProp) {
            removeClass([wrapper, popupWrapper], oldProp.split(' '));
        }
        if (newProp) {
            addClass([wrapper, popupWrapper], newProp.split(' '));
        }
    };
    ColorPicker.prototype.changeRtlProps = function (newProp) {
        if (newProp) {
            addClass([this.getWrapper()], 'e-rtl');
        }
        else {
            removeClass([this.getWrapper()], 'e-rtl');
        }
    };
    ColorPicker.prototype.changePaletteProps = function () {
        detach(this.container.children[0]);
        this.container.style.width = '';
        this.createPalette();
    };
    ColorPicker.prototype.changeOpacityProps = function (newProp) {
        var wrapper = this.getWrapper();
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
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {ColorPickerModel} newProp
     * @param  {ColorPickerModel} oldProp
     * @returns void
     * @private
     */
    ColorPicker.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        if (!isNullOrUndefined(newProp.value)) {
            var value = this.roundValue(newProp.value);
            if (value.length === 9) {
                this.element.value = this.roundValue(value).slice(0, 7);
                var preview = this.splitBtn && select('.' + SPLITPREVIEW, this.splitBtn.element);
                if (preview) {
                    preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(newProp.value));
                }
            }
            else {
                this.value = oldProp.value;
            }
        }
        if (!this.inline && isNullOrUndefined(newProp.inline)) {
            var otherCompModel = ['disabled', 'enableRtl'];
            this.splitBtn.setProperties(getModel(newProp, otherCompModel));
            if (!this.isPopupOpen()) {
                this.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                this.changeRtlProps(newProp.enableRtl);
                return;
            }
        }
        var _loop_1 = function (prop) {
            switch (prop) {
                case 'inline':
                    if (newProp.inline) {
                        this_1.getWrapper().appendChild(this_1.container);
                        this_1.splitBtn.destroy();
                        detach(this_1.element.nextElementSibling);
                        if (!this_1.container.children.length) {
                            this_1.createWidget();
                        }
                    }
                    else {
                        this_1.destroyOtherComp();
                        this_1.unWireEvents();
                        this_1.container.innerHTML = '';
                        this_1.createSplitBtn();
                    }
                    break;
                case 'cssClass':
                    this_1.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                    var props = newProp.cssClass.split(' ').concat(oldProp.cssClass.split(' '));
                    props = props.reduce(function (a, b) { if (a.indexOf(b) < 0) {
                        a.push(b);
                    } return a; }, []);
                    var count_1 = 0;
                    props.forEach(function (cls) {
                        if (count_1 === 0 &&
                            (cls === HIDEVALUE || cls === HIDEVALUESWITCH || cls === SHOWVALUE || cls === HIDEHEX || cls === HIDERGBA)) {
                            var inputWrap = select('.' + INPUTWRAPPER, _this.container);
                            if (inputWrap) {
                                remove(select('.' + INPUTWRAPPER, _this.container));
                            }
                            _this.createInput();
                            count_1++;
                        }
                    });
                    break;
                case 'enableRtl':
                    if (this_1.isPicker()) {
                        this_1.hueSlider.enableRtl = newProp.enableRtl;
                        if (this_1.enableOpacity) {
                            this_1.opacitySlider.enableRtl = newProp.enableRtl;
                        }
                        this_1.setInputEleProps(newProp.enableRtl);
                    }
                    this_1.changeRtlProps(newProp.enableRtl);
                    break;
                case 'disabled':
                    this_1.changeDisabledProp(newProp.disabled);
                    break;
                case 'value':
                    if (this_1.value !== oldProp.value) {
                        this_1.changeValueProp(newProp.value);
                    }
                    break;
                case 'showButtons':
                    this_1.changeShowBtnProps(newProp.showButtons);
                    break;
                case 'mode':
                    if (newProp.mode === 'Picker') {
                        this_1.switchToPicker();
                    }
                    else {
                        this_1.switchToPalette();
                    }
                    break;
                case 'modeSwitcher':
                    this_1.changeModeSwitcherProp(newProp.modeSwitcher);
                    break;
                case 'columns':
                case 'presetColors':
                    if (!this_1.isPicker()) {
                        this_1.changePaletteProps();
                    }
                    break;
                case 'noColor':
                    if (newProp.noColor) {
                        if (this_1.mode === 'Palette' && !this_1.modeSwitcher) {
                            this_1.setNoColor();
                        }
                    }
                    else {
                        this_1.changePaletteProps();
                    }
                    break;
                case 'enableOpacity':
                    this_1.changeOpacityProps(newProp.enableOpacity);
                    break;
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_1(prop);
        }
    };
    /**
     * Sets the focus to Colorpicker
     * its native method
     * @public
     */
    ColorPicker.prototype.focusIn = function () {
        this.element.parentElement.focus();
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
    return ColorPicker;
}(Component));

/**
 * ColorPicker modules
 */

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HIDE_CLEAR = 'e-clear-icon-hide';
var TEXTBOX_FOCUS = 'e-input-focus';
var containerAttr = ['title', 'style', 'class'];
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
var TextBox = /** @__PURE__ @class */ (function (_super) {
    __extends$6(TextBox, _super);
    function TextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousValue = null;
        _this.isAngular = false;
        _this.isHiddenInput = false;
        _this.isForm = false;
        _this.inputPreviousValue = null;
        _this.isVue = false;
        _this.textboxOptions = options;
        return _this;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    TextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'floatLabelType':
                    Input.removeFloating(this.textboxWrapper);
                    Input.addFloating(this.respectiveElement, this.floatLabelType, this.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
                    break;
                case 'value':
                    var prevOnChange = this.isProtectedOnChange;
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
                    var attributes$$1 = this.element.attributes;
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
    };
    /**
     * Gets the component name
     * @private
     */
    TextBox.prototype.getModuleName = function () {
        return 'textbox';
    };
    TextBox.prototype.isBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    TextBox.prototype.preRender = function () {
        this.cloneElement = this.element.cloneNode(true);
        this.formElement = closest(this.element, 'form');
        if (!isNullOrUndefined(this.formElement)) {
            this.isForm = true;
        }
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTBOX') {
            var ejInstance = getValue('ej2_instances', this.element);
            var inputElement = this.multiline ?
                this.createElement('textarea') :
                this.createElement('input');
            var index = 0;
            for (index; index < this.element.attributes.length; index++) {
                var attributeName = this.element.attributes[index].nodeName;
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
        var localeText = { placeholder: this.placeholder };
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
            var attribute = ['required', 'minlength', 'maxlength'];
            for (var i = 0; i < attribute.length; i++) {
                if (this.element.hasAttribute(attribute[i])) {
                    var attr = this.element.getAttribute(attribute[i]);
                    this.textarea.setAttribute(attribute[i], attr);
                    this.element.removeAttribute(attribute[i]);
                }
            }
        }
    };
    TextBox.prototype.checkAttributes = function (isDynamic) {
        var attrs = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['placeholder', 'disabled', 'value', 'readonly', 'type'];
        for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
            var key = attrs_1[_i];
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                                this.element.getAttribute(key) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
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
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    TextBox.prototype.render = function () {
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
    };
    TextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (containerAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.textboxWrapper.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        var setStyle = this.textboxWrapper.container.getAttribute(key);
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
    };
    TextBox.prototype.updateHTMLAttrToElement = function () {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (containerAttr.indexOf(key) < 0) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    TextBox.prototype.setInitialValue = function () {
        if (!this.isAngular) {
            this.respectiveElement.setAttribute('value', this.initialValue);
        }
    };
    TextBox.prototype.wireEvents = function () {
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
    };
    TextBox.prototype.resetValue = function (value) {
        var prevOnChange = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = value;
        this.isProtectedOnChange = prevOnChange;
    };
    TextBox.prototype.resetForm = function () {
        if (this.isAngular) {
            this.resetValue('');
        }
        else {
            this.resetValue(this.initialValue);
        }
        var label = this.textboxWrapper.container.querySelector('.e-float-text');
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
    };
    TextBox.prototype.focusHandler = function (args) {
        var eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('focus', eventArgs);
    };
    TextBox.prototype.focusOutHandler = function (args) {
        if (!(this.previousValue === null && this.value === null && this.respectiveElement.value === '') &&
            (this.previousValue !== this.respectiveElement.value)) {
            this.raiseChangeEvent(args, true);
        }
        var eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    };
    TextBox.prototype.inputHandler = function (args) {
        // tslint:disable-next-line
        var textboxObj = this;
        var eventArgs = {
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
    };
    TextBox.prototype.changeHandler = function (args) {
        this.setProperties({ value: this.respectiveElement.value }, true);
        this.raiseChangeEvent(args, true);
        args.stopPropagation();
    };
    TextBox.prototype.raiseChangeEvent = function (event, interaction) {
        var eventArgs = {
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
    };
    TextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton && this.respectiveElement.tagName !== 'TEXTAREA') {
            EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
        }
    };
    TextBox.prototype.resetInputHandler = function (event) {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            var previousValue = this.value;
            Input.setValue('', this.respectiveElement, this.floatLabelType, this.showClearButton);
            if (this.isHiddenInput) {
                this.element.value = this.respectiveElement.value;
            }
            this.setProperties({ value: this.respectiveElement.value }, true);
            var eventArgs = {
                event: event,
                value: this.respectiveElement.value,
                previousValue: this.inputPreviousValue,
                container: this.textboxWrapper.container
            };
            this.trigger('input', eventArgs);
            this.inputPreviousValue = this.respectiveElement.value;
            this.raiseChangeEvent(event, true);
        }
    };
    TextBox.prototype.unWireEvents = function () {
        EventHandler.remove(this.respectiveElement, 'focus', this.focusHandler);
        EventHandler.remove(this.respectiveElement, 'blur', this.focusOutHandler);
        EventHandler.remove(this.respectiveElement, 'input', this.inputHandler);
        EventHandler.remove(this.respectiveElement, 'change', this.changeHandler);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextBox element from the DOM.
     * @method destroy
     * @return {void}
     */
    TextBox.prototype.destroy = function () {
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
        _super.prototype.destroy.call(this);
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    TextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Adding the multiple attributes as key-value pair to the TextBox element.
     * @param { { [key: string]: string } } attributes - Specifies the attributes to be add to TextBox element.
     * @return {void}
     */
    TextBox.prototype.addAttributes = function (attributes$$1) {
        for (var _i = 0, _a = Object.keys(attributes$$1); _i < _a.length; _i++) {
            var key = _a[_i];
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
    };
    /**
     * Removing the multiple attributes as key-value pair to the TextBox element.
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextBox element.
     * @return {void}
     */
    TextBox.prototype.removeAttributes = function (attributes$$1) {
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var key = attributes_1[_i];
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
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    TextBox.prototype.focusIn = function () {
        if (document.activeElement !== this.respectiveElement && this.enabled) {
            this.respectiveElement.focus();
            addClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    TextBox.prototype.focusOut = function () {
        if (document.activeElement === this.respectiveElement && this.enabled) {
            this.respectiveElement.blur();
            removeClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
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
    return TextBox;
}(Component));

/**
 * Uploader modules
 */

/**
 * NumericTextBox all modules
 */

export { NumericTextBox, regularExpressions, createMask, applyMask, wireEvents, unwireEvents, bindClearEvent, unstrippedValue, strippedValue, maskInputFocusHandler, maskInputBlurHandler, maskInputDropHandler, mobileRemoveFunction, setMaskValue, setElementValue, maskInput, getVal, getMaskedVal, MaskUndo, MaskedTextBox, Input, TicksData, LimitData, TooltipData, Slider, regex, ErrorOption, FormValidator, FilesProp, ButtonsProps, AsyncSettings, Uploader, ColorPicker, TextBox };
//# sourceMappingURL=ej2-inputs.es5.js.map
