window.sf = window.sf || {};
var sfcolorpicker = (function (exports) {
'use strict';

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
var Input$1;
(function (Input$$1) {
    var floatType;
    /**
     * Create a wrapper to input element with multiple span elements and set the basic properties to input based components.
     * ```
     * E.g : Input.createInput({ element: element, floatLabelType : "Auto", properties: { placeholder: 'Search' } });
     * ```
     * @param args
     */
    function createInput(args, internalCreateElement) {
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var inputObject = { container: null, buttons: [], clearButton: null };
        floatType = args.floatLabelType;
        if (sf.base.isNullOrUndefined(args.floatLabelType) || args.floatLabelType === 'Never') {
            inputObject.container = createInputContainer(args, CLASSNAMES.INPUTGROUP, CLASSNAMES.INPUTCUSTOMTAG, 'span', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
            sf.base.addClass([args.element], CLASSNAMES.INPUT);
            inputObject.container.appendChild(args.element);
        }
        else {
            createFloatingInput(args, inputObject, makeElement);
        }
        bindInitialEvent(args);
        if (!sf.base.isNullOrUndefined(args.properties) && !sf.base.isNullOrUndefined(args.properties.showClearButton) &&
            args.properties.showClearButton && args.element.tagName !== 'TEXTAREA') {
            setClearButton(args.properties.showClearButton, args.element, inputObject, true, makeElement);
            inputObject.clearButton.setAttribute('role', 'button');
            if (inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT)) {
                sf.base.addClass([inputObject.container], CLASSNAMES.INPUTGROUP);
            }
        }
        if (!sf.base.isNullOrUndefined(args.buttons) && args.element.tagName !== 'TEXTAREA') {
            for (var i = 0; i < args.buttons.length; i++) {
                inputObject.buttons.push(appendSpan(args.buttons[i], inputObject.container, makeElement));
            }
        }
        if (!sf.base.isNullOrUndefined(args.element) && args.element.tagName === 'TEXTAREA') {
            sf.base.addClass([inputObject.container], CLASSNAMES.TEXTAREA);
        }
        inputObject = setPropertyValue(args, inputObject);
        return inputObject;
    }
    Input$$1.createInput = createInput;
    function bindInitialEvent(args) {
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
    }
    Input$$1.bindInitialEvent = bindInitialEvent;
    function checkInputValue(floatLabelType, inputElement) {
        var inputValue = inputElement.value;
        if (inputValue !== '' && !sf.base.isNullOrUndefined(inputValue)) {
            inputElement.parentElement.classList.add('e-valid-input');
        }
        else if (floatLabelType !== 'Always' && inputElement.parentElement) {
            inputElement.parentElement.classList.remove('e-valid-input');
        }
    }
    function _focusFn() {
        var label = getParentNode(this).getElementsByClassName('e-float-text')[0];
        if (!sf.base.isNullOrUndefined(label)) {
            sf.base.addClass([label], CLASSNAMES.LABELTOP);
            if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                sf.base.removeClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
    }
    function _blurFn() {
        var parent = getParentNode(this);
        if ((parent.getElementsByTagName('textarea')[0]) ? parent.getElementsByTagName('textarea')[0].value === '' :
            parent.getElementsByTagName('input')[0].value === '') {
            var label = parent.getElementsByClassName('e-float-text')[0];
            if (!sf.base.isNullOrUndefined(label)) {
                if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                    sf.base.removeClass([label], CLASSNAMES.LABELTOP);
                }
                sf.base.addClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
    }
    function wireFloatingEvents(element) {
        element.addEventListener('focus', _focusFn);
        element.addEventListener('blur', _blurFn);
    }
    Input$$1.wireFloatingEvents = wireFloatingEvents;
    function unwireFloatingEvents(element) {
        element.removeEventListener('focus', _focusFn);
        element.removeEventListener('blur', _blurFn);
    }
    function createFloatingInput(args, inputObject, internalCreateElement) {
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var floatLinelement;
        var floatLabelElement;
        if (args.floatLabelType === 'Auto') {
            wireFloatingEvents(args.element);
        }
        if (sf.base.isNullOrUndefined(inputObject.container)) {
            inputObject.container = createInputContainer(args, CLASSNAMES.FLOATINPUT, CLASSNAMES.FLOATCUSTOMTAG, 'div', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
        }
        else {
            if (!sf.base.isNullOrUndefined(args.customTag)) {
                inputObject.container.classList.add(CLASSNAMES.FLOATCUSTOMTAG);
            }
            inputObject.container.classList.add(CLASSNAMES.FLOATINPUT);
        }
        floatLinelement = makeElement('span', { className: CLASSNAMES.FLOATLINE });
        floatLabelElement = makeElement('label', { className: CLASSNAMES.FLOATTEXT });
        if (!sf.base.isNullOrUndefined(args.element.id) && args.element.id !== '') {
            floatLabelElement.id = 'label_' + args.element.id.replace(/ /g, '_');
            sf.base.attributes(args.element, { 'aria-labelledby': floatLabelElement.id });
        }
        if (!sf.base.isNullOrUndefined(args.element.placeholder) && args.element.placeholder !== '') {
            floatLabelElement.innerText = encodePlaceHolder(args.element.placeholder);
            args.element.removeAttribute('placeholder');
        }
        if (!sf.base.isNullOrUndefined(args.properties) && !sf.base.isNullOrUndefined(args.properties.placeholder) &&
            args.properties.placeholder !== '') {
            floatLabelElement.innerText = encodePlaceHolder(args.properties.placeholder);
        }
        if (!floatLabelElement.innerText) {
            inputObject.container.classList.add(CLASSNAMES.NOFLOATLABEL);
        }
        if (inputObject.container.classList.contains('e-float-icon-left')) {
            var inputWrap = inputObject.container.querySelector('.e-input-in-wrap');
            inputWrap.appendChild(args.element);
            inputWrap.appendChild(floatLinelement);
            inputWrap.appendChild(floatLabelElement);
        }
        else {
            inputObject.container.appendChild(args.element);
            inputObject.container.appendChild(floatLinelement);
            inputObject.container.appendChild(floatLabelElement);
        }
        updateLabelState(args.element.value, floatLabelElement);
        if (args.floatLabelType === 'Always') {
            if (floatLabelElement.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                sf.base.removeClass([floatLabelElement], CLASSNAMES.LABELBOTTOM);
            }
            sf.base.addClass([floatLabelElement], CLASSNAMES.LABELTOP);
        }
        if (args.floatLabelType === 'Auto') {
            args.element.addEventListener('input', function (event) {
                updateLabelState(args.element.value, floatLabelElement);
            });
            args.element.addEventListener('blur', function (event) {
                updateLabelState(args.element.value, floatLabelElement);
            });
        }
        if (!sf.base.isNullOrUndefined(args.element.getAttribute('id'))) {
            floatLabelElement.setAttribute('for', args.element.getAttribute('id'));
        }
    }
    function checkFloatLabelType(type, container) {
        if (type === 'Always' && container.classList.contains('e-outline')) {
            container.classList.add('e-valid-input');
        }
    }
    function setPropertyValue(args, inputObject) {
        if (!sf.base.isNullOrUndefined(args.properties)) {
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
            sf.base.removeClass([button], CLASSNAMES.CLEARICONHIDE);
        }
        else {
            sf.base.addClass([button], CLASSNAMES.CLEARICONHIDE);
        }
    }
    function updateLabelState(value, label) {
        if (value) {
            sf.base.addClass([label], CLASSNAMES.LABELTOP);
            if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                sf.base.removeClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
        else {
            if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                sf.base.removeClass([label], CLASSNAMES.LABELTOP);
            }
            sf.base.addClass([label], CLASSNAMES.LABELBOTTOM);
        }
    }
    function getParentNode(element) {
        var parentNode = sf.base.isNullOrUndefined(element.parentNode) ? element
            : element.parentNode;
        if (parentNode && parentNode.classList.contains('e-input-in-wrap')) {
            parentNode = parentNode.parentNode;
        }
        return parentNode;
    }
    /**
     * To create clear button.
     */
    function createClearButton(element, inputObject, initial, internalCreateElement) {
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var button = makeElement('span', { className: CLASSNAMES.CLEARICON });
        var container = inputObject.container;
        if (!sf.base.isNullOrUndefined(initial)) {
            container.appendChild(button);
        }
        else {
            var baseElement = inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT) ?
                inputObject.container.querySelector('.' + CLASSNAMES.FLOATTEXT) : element;
            baseElement.insertAdjacentElement('afterend', button);
        }
        if (!sf.base.isNullOrUndefined(container) &&
            container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            sf.base.addClass([container], CLASSNAMES.INPUTGROUP);
        }
        sf.base.addClass([button], CLASSNAMES.CLEARICONHIDE);
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
                sf.base.addClass([button], CLASSNAMES.CLEARICONHIDE);
            }
        });
        element.addEventListener('input', function (event) {
            updateIconState(element.value, button);
        });
        element.addEventListener('focus', function (event) {
            updateIconState(element.value, button);
        });
        element.addEventListener('blur', function (event) {
            setTimeout(function () { sf.base.addClass([button], CLASSNAMES.CLEARICONHIDE); }, 200);
        });
    }
    Input$$1.wireClearBtnEvents = wireClearBtnEvents;
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
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var container;
        if (!sf.base.isNullOrUndefined(args.customTag)) {
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
        if (!sf.base.isNullOrUndefined(placeholder) && placeholder !== '') {
            var spanEle = document.createElement('span');
            spanEle.innerHTML = '<input  placeholder="' + placeholder + '"/>';
            var hiddenInput = (spanEle.children[0]);
            result = hiddenInput.placeholder;
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
        if ((!sf.base.isNullOrUndefined(floatLabelType)) && floatLabelType === 'Auto') {
            validateLabel(element, floatLabelType);
        }
        if (!sf.base.isNullOrUndefined(clearButton) && clearButton) {
            var parentElement = getParentNode(element);
            if (!sf.base.isNullOrUndefined(parentElement)) {
                var button = parentElement.getElementsByClassName(CLASSNAMES.CLEARICON)[0];
                if (element.value && parentElement.classList.contains('e-input-focus')) {
                    sf.base.removeClass([button], CLASSNAMES.CLEARICONHIDE);
                }
                else {
                    sf.base.addClass([button], CLASSNAMES.CLEARICONHIDE);
                }
            }
        }
        checkInputValue(floatLabelType, element);
    }
    Input$$1.setValue = setValue$$1;
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
        if (!sf.base.isNullOrUndefined(oldClass) && oldClass !== '') {
            sf.base.removeClass(elements, oldClass.split(' '));
        }
        if (!sf.base.isNullOrUndefined(cssClass) && cssClass !== '') {
            sf.base.addClass(elements, cssClass.split(' '));
        }
    }
    Input$$1.setCssClass = setCssClass;
    /**
     * Set the width to the wrapper of input element.
     * ```
     * E.g : Input.setWidth('200px', container);
     * ```
     * @param width - Width value which is need to add.
     * @param container - The element on which the width is need to add.
     */
    function setWidth(width, container) {
        if (typeof width === 'number') {
            container.style.width = sf.base.formatUnit(width);
        }
        else if (typeof width === 'string') {
            container.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
        }
    }
    Input$$1.setWidth = setWidth;
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
            if (!sf.base.isNullOrUndefined(placeholder) && placeholder !== '') {
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
            if (!sf.base.isNullOrUndefined(placeholder) && placeholder !== '') {
                sf.base.attributes(element, { 'placeholder': placeholder, 'aria-placeholder': placeholder });
            }
            else {
                element.removeAttribute('placeholder');
                element.removeAttribute('aria-placeholder');
            }
        }
    }
    Input$$1.setPlaceholder = setPlaceholder;
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
            sf.base.attributes(element, { readonly: '' });
        }
        else {
            element.removeAttribute('readonly');
        }
        if (!sf.base.isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }
    Input$$1.setReadonly = setReadonly;
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
            sf.base.addClass(elements, CLASSNAMES.RTL);
        }
        else {
            sf.base.removeClass(elements, CLASSNAMES.RTL);
        }
    }
    Input$$1.setEnableRtl = setEnableRtl;
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
        var considerWrapper = sf.base.isNullOrUndefined(inputContainer) ? false : true;
        if (isEnable) {
            element.classList.remove(CLASSNAMES.DISABLE);
            removeAttributes(disabledAttrs, element);
            if (considerWrapper) {
                sf.base.removeClass([inputContainer], CLASSNAMES.DISABLE);
            }
        }
        else {
            element.classList.add(CLASSNAMES.DISABLE);
            addAttributes(disabledAttrs, element);
            if (considerWrapper) {
                sf.base.addClass([inputContainer], CLASSNAMES.DISABLE);
            }
        }
        if (!sf.base.isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }
    Input$$1.setEnabled = setEnabled;
    function setClearButton(isClear, element, inputObject, initial, internalCreateElement) {
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        if (isClear) {
            inputObject.clearButton = createClearButton(element, inputObject, initial, makeElement);
        }
        else {
            inputObject.clearButton.remove();
            inputObject.clearButton = null;
        }
    }
    Input$$1.setClearButton = setClearButton;
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
    Input$$1.removeAttributes = removeAttributes;
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
    Input$$1.addAttributes = addAttributes;
    function removeFloating(input) {
        var container = input.container;
        if (!sf.base.isNullOrUndefined(container) && container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            var inputEle = container.querySelector('textarea') ? container.querySelector('textarea') :
                container.querySelector('input');
            var placeholder = container.querySelector('.' + CLASSNAMES.FLOATTEXT).textContent;
            var clearButton = container.querySelector('.e-clear-icon') !== null;
            sf.base.detach(container.querySelector('.' + CLASSNAMES.FLOATLINE));
            sf.base.detach(container.querySelector('.' + CLASSNAMES.FLOATTEXT));
            sf.base.classList(container, [CLASSNAMES.INPUTGROUP], [CLASSNAMES.FLOATINPUT]);
            unwireFloatingEvents(inputEle);
            sf.base.attributes(inputEle, { 'placeholder': placeholder });
            inputEle.classList.add(CLASSNAMES.INPUT);
            if (!clearButton && inputEle.tagName === 'INPUT') {
                inputEle.removeAttribute('required');
            }
        }
    }
    Input$$1.removeFloating = removeFloating;
    function addFloating(input, type, placeholder, internalCreateElement) {
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var container = sf.base.closest(input, '.' + CLASSNAMES.INPUTGROUP);
        floatType = type;
        if (type !== 'Never') {
            var customTag = container.tagName;
            customTag = customTag !== 'DIV' && customTag !== 'SPAN' ? customTag : null;
            var args = { element: input, floatLabelType: type, customTag: customTag, properties: { placeholder: placeholder } };
            var iconEle = container.querySelector('.e-clear-icon');
            var inputObj = { container: container };
            input.classList.remove(CLASSNAMES.INPUT);
            createFloatingInput(args, inputObj, makeElement);
            var isPrependIcon = container.classList.contains('e-float-icon-left');
            if (sf.base.isNullOrUndefined(iconEle)) {
                if (isPrependIcon) {
                    var inputWrap = container.querySelector('.e-input-in-wrap');
                    iconEle = inputWrap.querySelector('.e-input-group-icon');
                }
                else {
                    iconEle = container.querySelector('.e-input-group-icon');
                }
            }
            if (sf.base.isNullOrUndefined(iconEle)) {
                if (isPrependIcon) {
                    iconEle = container.querySelector('.e-input-group-icon');
                }
                if (sf.base.isNullOrUndefined(iconEle)) {
                    container.classList.remove(CLASSNAMES.INPUTGROUP);
                }
            }
            else {
                var floatLine = container.querySelector('.' + CLASSNAMES.FLOATLINE);
                var floatText = container.querySelector('.' + CLASSNAMES.FLOATTEXT);
                var wrapper = isPrependIcon ? container.querySelector('.e-input-in-wrap') : container;
                wrapper.insertBefore(input, iconEle);
                wrapper.insertBefore(floatLine, iconEle);
                wrapper.insertBefore(floatText, iconEle);
            }
        }
        checkFloatLabelType(type, input.parentElement);
    }
    Input$$1.addFloating = addFloating;
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
    Input$$1.setRipple = setRipple;
    function _internalRipple(isRipple, container, button) {
        var argsButton = [];
        argsButton.push(button);
        var buttons = sf.base.isNullOrUndefined(button) ?
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
    function createIconEle(iconClass, makeElement) {
        var button = makeElement('span', { className: iconClass });
        button.classList.add('e-input-group-icon');
        return button;
    }
    /**
     * Creates a new span element with the given icons added and append it in container element.
     * ```
     * E.g : Input.addIcon('append', 'e-icon-spin', inputObj.container, inputElement);
     * ```
     * @param position - Specify the icon placement on the input.Possible values are append and prepend.
     * @param iconClass - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param container - The container on which created span element is going to append.
     * @param inputElement - The inputElement on which created span element is going to prepend.
     */
    // tslint:disable
    function addIcon(position, icons, container, input, internalCreate) {
        // tslint:enable
        var result = typeof (icons) === 'string' ? icons.split(',')
            : icons;
        if (position.toLowerCase() === 'append') {
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var icon = result_1[_i];
                appendSpan(icon, container, internalCreate);
            }
        }
        else {
            for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
                var icon = result_2[_a];
                prependSpan(icon, container, input, internalCreate);
            }
        }
    }
    Input$$1.addIcon = addIcon;
    /**
     * Creates a new span element with the given icons added and prepend it in input element.
     * ```
     * E.g : Input.prependSpan('e-icon-spin', inputObj.container, inputElement);
     * ```
     * @param iconClass - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param container - The container on which created span element is going to append.
     * @param inputElement - The inputElement on which created span element is going to prepend.
     */
    // tslint:disable
    function prependSpan(iconClass, container, inputElement, internalCreateElement) {
        // tslint:enable
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var button = createIconEle(iconClass, makeElement);
        container.classList.add('e-float-icon-left');
        var innerWrapper = container.querySelector('.e-input-in-wrap');
        if (sf.base.isNullOrUndefined(innerWrapper)) {
            innerWrapper = makeElement('span', { className: 'e-input-in-wrap' });
            inputElement.parentNode.insertBefore(innerWrapper, inputElement);
            var result = container.querySelectorAll(inputElement.tagName + ' ~ *');
            innerWrapper.appendChild(inputElement);
            for (var i = 0; i < result.length; i++) {
                innerWrapper.appendChild(result[i]);
            }
        }
        innerWrapper.parentNode.insertBefore(button, innerWrapper);
        if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
            container.classList.add(CLASSNAMES.INPUTGROUP);
        }
        _internalRipple(true, container, button);
        return button;
    }
    Input$$1.prependSpan = prependSpan;
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
        var makeElement = !sf.base.isNullOrUndefined(internalCreateElement) ? internalCreateElement : sf.base.createElement;
        var button = createIconEle(iconClass, makeElement);
        if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
            container.classList.add(CLASSNAMES.INPUTGROUP);
        }
        var wrap = (container.classList.contains('e-float-icon-left')) ? container.querySelector('.e-input-in-wrap') :
            container;
        wrap.appendChild(button);
        _internalRipple(true, container, button);
        return button;
    }
    Input$$1.appendSpan = appendSpan;
})(Input$1 || (Input$1 = {}));

/**
 * Input box Component
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
var HIDDENELEMENT = 'e-numeric-hidden';
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
var NumericTextBox = /** @class */ (function (_super) {
    __extends$1(NumericTextBox, _super);
    function NumericTextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isVue = false;
        _this.preventChange = false;
        _this.numericOptions = options;
        return _this;
    }
    NumericTextBox.prototype.preRender = function () {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        var ejInstance = sf.base.getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        sf.base.removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = sf.base.closest(this.element, 'form');
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
            sf.base.setValue('ej2_instances', ejInstance, this.element);
        }
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            sf.base.attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
            var localeText = {
                incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder
            };
            this.l10n = new sf.base.L10n('numerictextbox', localeText, this.locale);
            if (this.l10n.getConstant('placeholder') !== '') {
                this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
            }
        }
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.prevValue = this.value;
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            this.updateHTMLAttrToElement();
            this.checkAttributes(false);
            if (this.formEle) {
                this.inputEleValue = this.value;
            }
        }
        this.validateMinMax();
        this.validateStep();
        if (this.placeholder === null && !(sf.base.isBlazor() && this.isServerRendered)) {
            this.updatePlaceholder();
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    NumericTextBox.prototype.render = function () {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (!(sf.base.isBlazor() && this.isServerRendered)) {
                this.createWrapper();
                if (this.showSpinButton) {
                    this.spinBtnCreation();
                }
                this.setElementWidth(this.width);
                if (!this.container.classList.contains('e-input-group')) {
                    this.container.classList.add('e-input-group');
                }
                this.changeValue(this.value === null || isNaN(this.value) ?
                    null : this.strictMode ? this.trimValue(this.value) : this.value);
            }
            else {
                this.container = this.element.parentElement;
                this.inputWrapper = { container: this.container };
                this.hiddenInput = this.container.querySelector('input[type="hidden"]');
                if (this.showClearButton) {
                    this.inputWrapper.clearButton = this.container.querySelector('.e-clear-icon');
                    sf.inputs.Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
                }
                if (this.showSpinButton) {
                    this.spinDown = this.container.querySelector('.' + SPINDOWN);
                    this.spinUp = this.container.querySelector('.' + SPINUP);
                    this.wireSpinBtnEvents();
                }
                sf.inputs.Input.bindInitialEvent({
                    element: this.element, buttons: null, customTag: null, floatLabelType: this.floatLabelType, properties: this.properties
                });
            }
            this.wireEvents();
            if (!(sf.base.isBlazor() && this.isServerRendered)) {
                if (this.value !== null && !isNaN(this.value)) {
                    if (this.decimals) {
                        this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                    }
                }
                if (this.element.getAttribute('value') || this.value) {
                    this.element.setAttribute('value', this.element.value);
                    this.hiddenInput.setAttribute('value', this.hiddenInput.value);
                }
            }
            this.elementPrevValue = this.element.value;
            this.renderComplete();
        }
    };
    NumericTextBox.prototype.checkAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var prop = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['value'] === undefined)) || isDynamic) {
                            var setNumber = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            this.setProperties(sf.base.setValue(prop, setNumber, {}), !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                            var minValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (minValue !== null && !isNaN(minValue)) {
                                this.setProperties(sf.base.setValue(prop, minValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                            var maxValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (maxValue !== null && !isNaN(maxValue)) {
                                this.setProperties(sf.base.setValue(prop, maxValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'step':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                            var stepValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (stepValue !== null && !isNaN(stepValue)) {
                                this.setProperties(sf.base.setValue(prop, stepValue, {}), !isDynamic);
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
                            this.setProperties(sf.base.setValue(prop, value, {}), true);
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
        this.instance = new sf.base.Internationalization(this.locale);
    };
    NumericTextBox.prototype.initCultureInfo = function () {
        this.cultureInfo.format = this.format;
        if (sf.base.getValue('currency', this) !== null) {
            sf.base.setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    };
    /* Wrapper creation */
    NumericTextBox.prototype.createWrapper = function () {
        var updatedCssClassValue = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = this.getNumericValidClassList(this.cssClass);
        }
        var inputObj = sf.inputs.Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: updatedCssClassValue,
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
            sf.base.attributes(this.element, { 'aria-readonly': 'true' });
        }
        this.hiddenInput = (this.createElement('input', { attrs: { type: 'text',
                'validateHidden': 'true', 'class': HIDDENELEMENT } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        sf.base.attributes(this.hiddenInput, { 'name': this.inputName });
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        this.updateDataAttribute(false);
        if (this.inputStyle !== null) {
            sf.base.attributes(this.container, { 'style': this.inputStyle });
        }
    };
    NumericTextBox.prototype.updateDataAttribute = function (isDynamic) {
        var attr = {};
        if (!isDynamic) {
            for (var a = 0; a < this.element.attributes.length; a++) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        else {
            attr = this.htmlAttributes;
        }
        for (var _i = 0, _a = Object.keys(attr); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.indexOf('data') === 0) {
                this.hiddenInput.setAttribute(key, attr[key]);
            }
        }
    };
    NumericTextBox.prototype.updateHTMLAttrToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    };
    NumericTextBox.prototype.updateCssClass = function (newClass, oldClass) {
        sf.inputs.Input.setCssClass(this.getNumericValidClassList(newClass), [this.container], this.getNumericValidClassList(oldClass));
    };
    NumericTextBox.prototype.getNumericValidClassList = function (numericClassName) {
        var result = numericClassName;
        if (!sf.base.isNullOrUndefined(numericClassName) && numericClassName !== '') {
            result = (numericClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    };
    NumericTextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var pro = _a[_i];
                if (wrapperAttributes.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        var updatedClassValue = this.getNumericValidClassList(this.htmlAttributes[pro]);
                        if (updatedClassValue !== '') {
                            sf.base.addClass([this.container], updatedClassValue.split(' '));
                        }
                    }
                    else if (pro === 'style') {
                        var numericStyle = this.container.getAttribute(pro);
                        numericStyle = !sf.base.isNullOrUndefined(numericStyle) ? (numericStyle + this.htmlAttributes[pro]) :
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
    NumericTextBox.prototype.setElementWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.container.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.container.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    /* Spinner creation */
    NumericTextBox.prototype.spinBtnCreation = function () {
        this.spinDown = sf.inputs.Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container, this.createElement);
        sf.base.attributes(this.spinDown, {
            'title': this.l10n.getConstant('decrementTitle'),
            'aria-label': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = sf.inputs.Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        sf.base.attributes(this.spinUp, {
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
        sf.base.attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
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
            sf.base.removeClass([this.container], ERROR);
        }
        else {
            sf.base.addClass([this.container], ERROR);
        }
        sf.base.attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    };
    NumericTextBox.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
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
        this.hiddenInput.value = '';
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            var element = this.element.nextElementSibling;
            var keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
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
        if (!sf.base.isNullOrUndefined(this.spinDown)) {
            sf.base.attributes(this.spinDown, {
                'title': this.l10n.getConstant('decrementTitle'),
                'aria-label': this.l10n.getConstant('decrementTitle')
            });
        }
        if (!sf.base.isNullOrUndefined(this.spinUp)) {
            sf.base.attributes(this.spinUp, {
                'title': this.l10n.getConstant('incrementTitle'),
                'aria-label': this.l10n.getConstant('incrementTitle')
            });
        }
    };
    NumericTextBox.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'focus', this.focusHandler, this);
        sf.base.EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        sf.base.EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        sf.base.EventHandler.add(this.element, 'input', this.inputHandler, this);
        sf.base.EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
        sf.base.EventHandler.add(this.element, 'change', this.changeHandler, this);
        sf.base.EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
            if (this.formEle) {
                sf.base.EventHandler.add(this.formEle, 'reset', this.resetFormHandler, this);
            }
        }
    };
    NumericTextBox.prototype.wireSpinBtnEvents = function () {
        /* bind spin button events */
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        sf.base.EventHandler.add(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        sf.base.EventHandler.add(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    };
    NumericTextBox.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'focus', this.focusHandler);
        sf.base.EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        sf.base.EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        sf.base.EventHandler.remove(this.element, 'input', this.inputHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        sf.base.EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
        sf.base.EventHandler.remove(this.element, 'change', this.changeHandler);
        sf.base.EventHandler.remove(this.element, 'paste', this.pasteHandler);
        if (this.formEle) {
            sf.base.EventHandler.remove(this.formEle, 'reset', this.resetFormHandler);
        }
    };
    NumericTextBox.prototype.unwireSpinBtnEvents = function () {
        /* unbind spin button events */
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchStartEvent, this.mouseDownOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchEndEvent, this.mouseUpOnSpinner);
        sf.base.EventHandler.remove(this.spinUp, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
        sf.base.EventHandler.remove(this.spinDown, sf.base.Browser.touchMoveEvent, this.touchMoveOnSpinner);
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
            sf.base.merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.elementPrevValue = this.element.value;
            this.preventChange = false;
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
                var numericObject = sf.base.getNumericObject(_this.locale);
                var decimalSeparator = sf.base.getValue('decimal', numericObject);
                ignoreKeyCode = decimalSeparator.charCodeAt(0);
                if (_this.element.value[prevPos] === ' ' && _this.element.selectionStart > 0 && !iOS) {
                    if (sf.base.isNullOrUndefined(_this.prevVal)) {
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
                        if (sf.base.isNullOrUndefined(_this.prevVal)) {
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
        if (!iOS && sf.base.Browser.isDevice) {
            this.preventHandler();
        }
        var parseValue = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        var formElement = sf.base.closest(this.element, 'form');
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
        if ((fireFox || iOS) && sf.base.Browser.isDevice) {
            this.preventHandler();
        }
        if (this.isVue) {
            var current = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            var previous = this.instance.getNumberParser({ format: 'n' })(this.elementPrevValue);
            var eventArgs = {
                event: event,
                value: (current === null || isNaN(current) ? null : current),
                previousValue: (previous === null || isNaN(previous) ? null : previous)
            };
            this.preventChange = true;
            this.elementPrevValue = this.element.value;
            this.trigger('input', eventArgs);
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
        if ((!this.isVue) || (this.isVue && !this.preventChange)) {
            this.raiseChangeEvent(event);
        }
    };
    NumericTextBox.prototype.updateCurrency = function (prop, propVal) {
        sf.base.setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    };
    NumericTextBox.prototype.changeValue = function (value) {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        }
        else {
            var numberOfDecimals = void 0;
            numberOfDecimals = this.getNumberOfDecimals(value);
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
            sf.base.attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = this.value.toString();
            if (this.value !== null && this.serverDecimalSeparator) {
                this.hiddenInput.value = this.hiddenInput.value.replace('.', this.serverDecimalSeparator);
            }
        }
        else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    };
    
    NumericTextBox.prototype.setElementValue = function (val, element) {
        sf.inputs.Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    };
    NumericTextBox.prototype.validateState = function () {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    };
    NumericTextBox.prototype.getNumberOfDecimals = function (value) {
        var numberOfDecimals;
        var EXPREGEXP = new RegExp('[eE][\-+]?([0-9]+)');
        var valueString = value.toString();
        if (EXPREGEXP.test(valueString)) {
            var result = EXPREGEXP.exec(valueString);
            if (!sf.base.isNullOrUndefined(result)) {
                valueString = value.toFixed(Math.min(parseInt(result[1], 10), 20));
            }
        }
        var decimalPart = valueString.split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return numberOfDecimals;
    };
    NumericTextBox.prototype.formatNumber = function () {
        var numberOfDecimals;
        numberOfDecimals = this.getNumberOfDecimals(this.value);
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
        if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === '11.0' && event.keyCode === 13) {
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
        var numericObject = sf.base.getNumericObject(this.locale);
        var decimalSeparator = sf.base.getValue('decimal', numericObject);
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
        sf.base.removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            var formatValue_1 = this.formatNumber();
            this.setElementValue(formatValue_1);
            if (!this.isPrevFocused) {
                if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue_1.length);
                }
                else {
                    var delay = (sf.base.Browser.isDevice && sf.base.Browser.isIos) ? 600 : 0;
                    setTimeout(function () {
                        _this.element.setSelectionRange(0, formatValue_1.length);
                    }, delay);
                }
            }
        }
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
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
            if (sf.base.Browser.isDevice) {
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
            if (!sf.base.Browser.isDevice) {
                sf.base.EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        var formElement = sf.base.closest(this.element, 'form');
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
        sf.base.EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(function () { _this.isCalled = true; _this.action(action, event); }, 150);
        sf.base.EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
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
            if (!sf.base.Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!sf.base.Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        var target = event.currentTarget;
        var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        sf.base.EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        sf.base.EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        var formElement = sf.base.closest(this.element, 'form');
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
        sf.inputs.Input.removeFloating(this.inputWrapper);
        var hiddenInput = this.hiddenInput;
        this.hiddenInput.remove();
        sf.inputs.Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    };
    NumericTextBox.prototype.mouseUpClick = function (event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        sf.base.EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        sf.base.EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
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
        this.unwireEvents();
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            sf.base.detach(this.hiddenInput);
            if (this.showSpinButton) {
                this.unwireSpinBtnEvents();
                sf.base.detach(this.spinUp);
                sf.base.detach(this.spinDown);
            }
            var attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
                'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
                'spellcheck', 'aria-autocomplete', 'tabindex', 'aria-valuemin',
                'aria-valuemax', 'aria-live', 'aria-valuenow', 'aria-invalid'];
            for (var i = 0; i < attrArray.length; i++) {
                this.element.removeAttribute(attrArray[i]);
            }
            this.element.classList.remove('e-input');
            this.container.insertAdjacentElement('afterend', this.element);
            sf.base.detach(this.container);
            _super.prototype.destroy.call(this);
        }
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
            sf.base.addClass([this.container], [NUMERIC_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    NumericTextBox.prototype.focusOut = function () {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            sf.base.removeClass([this.container], [NUMERIC_FOCUS]);
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
                    this.setElementWidth(newProp.width);
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enabled':
                    sf.inputs.Input.setEnabled(newProp.enabled, this.element);
                    break;
                case 'enableRtl':
                    sf.inputs.Input.setEnableRtl(newProp.enableRtl, [this.container]);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(newProp.readonly, this.element);
                    if (this.readonly) {
                        sf.base.attributes(this.element, { 'aria-readonly': 'true' });
                    }
                    else {
                        this.element.removeAttribute('aria-readonly');
                    }
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.updateDataAttribute(true);
                    this.checkAttributes(true);
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.element);
                    break;
                case 'step':
                    this.step = newProp.step;
                    this.validateStep();
                    break;
                case 'showSpinButton':
                    this.updateSpinButton(newProp);
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    this.floatLabelTypeUpdate();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    if (this.isVue && this.preventChange) {
                        this.preventChange = false;
                    }
                    break;
                case 'min':
                case 'max':
                    sf.base.setValue(prop, sf.base.getValue(prop, newProp), this);
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
                    sf.inputs.Input.setPlaceholder(this.placeholder, this.element);
                    this.updateValue(this.value);
                    break;
                case 'currency':
                    var propVal = sf.base.getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    var propValue = sf.base.getValue(prop, newProp);
                    this.setProperties({ currency: propValue }, true);
                    this.updateCurrency('currency', propValue);
                    break;
                case 'format':
                    sf.base.setValue(prop, sf.base.getValue(prop, newProp), this);
                    this.initCultureInfo();
                    this.updateValue(this.value);
                    break;
                case 'decimals':
                    this.decimals = newProp.decimals;
                    this.updateValue(this.value);
            }
        }
    };
    NumericTextBox.prototype.updateClearButton = function (newProp) {
        if (sf.base.isBlazor()) {
            if (this.showClearButton) {
                this.inputWrapper.clearButton = this.container.querySelector('.e-clear-icon');
                sf.inputs.Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
        }
        else {
            sf.inputs.Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
            this.bindClearEvent();
        }
    };
    NumericTextBox.prototype.updateSpinButton = function (newProp) {
        if (sf.base.isBlazor()) {
            if (this.showSpinButton) {
                this.spinDown = this.container.querySelector('.' + SPINDOWN);
                this.spinUp = this.container.querySelector('.' + SPINUP);
                this.wireSpinBtnEvents();
            }
        }
        else {
            if (newProp.showSpinButton) {
                this.spinBtnCreation();
            }
            else {
                sf.base.detach(this.spinUp);
                sf.base.detach(this.spinDown);
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
    __decorate$1([
        sf.base.Property('')
    ], NumericTextBox.prototype, "cssClass", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "value", void 0);
    __decorate$1([
        sf.base.Property(-(Number.MAX_VALUE))
    ], NumericTextBox.prototype, "min", void 0);
    __decorate$1([
        sf.base.Property(Number.MAX_VALUE)
    ], NumericTextBox.prototype, "max", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], NumericTextBox.prototype, "step", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "width", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "placeholder", void 0);
    __decorate$1([
        sf.base.Property({})
    ], NumericTextBox.prototype, "htmlAttributes", void 0);
    __decorate$1([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "showSpinButton", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "readonly", void 0);
    __decorate$1([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "enabled", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "showClearButton", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "enablePersistence", void 0);
    __decorate$1([
        sf.base.Property('n2')
    ], NumericTextBox.prototype, "format", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "decimals", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "currency", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], NumericTextBox.prototype, "currencyCode", void 0);
    __decorate$1([
        sf.base.Property(true)
    ], NumericTextBox.prototype, "strictMode", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], NumericTextBox.prototype, "validateDecimalOnType", void 0);
    __decorate$1([
        sf.base.Property('Never')
    ], NumericTextBox.prototype, "floatLabelType", void 0);
    __decorate$1([
        sf.base.Event()
    ], NumericTextBox.prototype, "created", void 0);
    __decorate$1([
        sf.base.Event()
    ], NumericTextBox.prototype, "destroyed", void 0);
    __decorate$1([
        sf.base.Event()
    ], NumericTextBox.prototype, "change", void 0);
    __decorate$1([
        sf.base.Event()
    ], NumericTextBox.prototype, "focus", void 0);
    __decorate$1([
        sf.base.Event()
    ], NumericTextBox.prototype, "blur", void 0);
    NumericTextBox = __decorate$1([
        sf.base.NotifyPropertyChanges
    ], NumericTextBox);
    return NumericTextBox;
}(sf.base.Component));

/**
 * NumericTextBox modules
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
var TicksData = /** @class */ (function (_super) {
    __extends$2(TicksData, _super);
    function TicksData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('None')
    ], TicksData.prototype, "placement", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], TicksData.prototype, "largeStep", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], TicksData.prototype, "smallStep", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], TicksData.prototype, "showSmallTicks", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TicksData.prototype, "format", void 0);
    return TicksData;
}(sf.base.ChildProperty));
/**
 * It illustrates the color track data in slider.
 * {% codeBlock src='slider/colorrange/index.md' %}{% endcodeBlock %}
 */
var ColorRangeData = /** @class */ (function (_super) {
    __extends$2(ColorRangeData, _super);
    function ColorRangeData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "color", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "start", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "end", void 0);
    return ColorRangeData;
}(sf.base.ChildProperty));
/**
 * It illustrates the limit data in slider.
 * {% codeBlock src='slider/limits/index.md' %}{% endcodeBlock %}
 */
var LimitData = /** @class */ (function (_super) {
    __extends$2(LimitData, _super);
    function LimitData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], LimitData.prototype, "enabled", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LimitData.prototype, "minStart", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LimitData.prototype, "minEnd", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LimitData.prototype, "maxStart", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LimitData.prototype, "maxEnd", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], LimitData.prototype, "startHandleFixed", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], LimitData.prototype, "endHandleFixed", void 0);
    return LimitData;
}(sf.base.ChildProperty));
/**
 * It illustrates the tooltip data in slider.
 */
var TooltipData = /** @class */ (function (_super) {
    __extends$2(TooltipData, _super);
    function TooltipData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('')
    ], TooltipData.prototype, "cssClass", void 0);
    __decorate$2([
        sf.base.Property('Before')
    ], TooltipData.prototype, "placement", void 0);
    __decorate$2([
        sf.base.Property('Focus')
    ], TooltipData.prototype, "showOn", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], TooltipData.prototype, "isVisible", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TooltipData.prototype, "format", void 0);
    return TooltipData;
}(sf.base.ChildProperty));
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
    sliderHorizantalColor: 'e-slider-horizantal-color',
    sliderVerticalColor: 'e-slider-vertical-color',
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
var Slider = /** @class */ (function (_super) {
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
        _this.initialTooltip = true;
        return _this;
    }
    Slider.prototype.preRender = function () {
        var localeText = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
        this.l10n = new sf.base.L10n('slider', localeText, this.locale);
        this.isElementFocused = false;
        this.tickElementCollection = [];
        this.tooltipFormatInfo = {};
        this.ticksFormatInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.formChecker();
    };
    Slider.prototype.formChecker = function () {
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            this.isForm = true;
            // this condition needs to be checked, if the slider is going to be refreshed by `refresh()`
            // then we need to revert the slider `value` back to `formResetValue` to preserve the initial value
            if (!sf.base.isNullOrUndefined(this.formResetValue)) {
                this.setProperties({ 'value': this.formResetValue }, true);
            }
            this.formResetValue = this.value;
            if (this.type === 'Range' &&
                (sf.base.isNullOrUndefined(this.formResetValue) || typeof (this.formResetValue) !== 'object')) {
                this.formResetValue = [parseFloat(sf.base.formatUnit(this.min)), parseFloat(sf.base.formatUnit(this.max))];
            }
            else if (sf.base.isNullOrUndefined(this.formResetValue)) {
                this.formResetValue = parseFloat(sf.base.formatUnit(this.min));
            }
            this.formElement = formElement;
        }
        else {
            this.isForm = false;
        }
    };
    Slider.prototype.initCultureFunc = function () {
        this.internationalization = new sf.base.Internationalization(this.locale);
    };
    Slider.prototype.initCultureInfo = function () {
        this.tooltipFormatInfo.format = (!sf.base.isNullOrUndefined(this.tooltip.format)) ? this.tooltip.format : null;
        this.ticksFormatInfo.format = (!sf.base.isNullOrUndefined(this.ticks.format)) ? this.ticks.format : null;
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
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.initialize();
        }
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
    };
    Slider.prototype.initialize = function () {
        sf.base.addClass([this.element], classNames.root);
        this.setCSSClass();
    };
    Slider.prototype.setElementWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.sliderContainer.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.sliderContainer.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    Slider.prototype.setCSSClass = function (oldCSSClass) {
        if (oldCSSClass) {
            sf.base.removeClass([this.element], oldCSSClass.split(' '));
        }
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' '));
        }
    };
    Slider.prototype.setEnabled = function () {
        if (!this.enabled) {
            sf.base.addClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.add(classNames.sliderDisabled);
            }
            this.unwireEvents();
        }
        else {
            sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
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
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.sliderContainer = this.element.parentElement;
            this.sliderTrack = this.element.querySelector('.e-slider-track');
            this.hiddenInput = this.element.parentElement.querySelector('.e-slider-input');
        }
        else {
            this.sliderContainer = this.createElement('div', { className: classNames.sliderContainer + ' ' + classNames.controlWrapper });
            this.element.parentNode.insertBefore(this.sliderContainer, this.element);
            this.sliderContainer.appendChild(this.element);
            this.sliderTrack = this.createElement('div', { className: classNames.sliderTrack });
            this.element.appendChild(this.sliderTrack);
        }
        this.setElementWidth(this.width);
        this.element.tabIndex = -1;
        this.getThemeInitialization();
        this.setHandler();
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.setOrientClass();
            this.hiddenInput = (this.createElement('input', {
                attrs: {
                    type: 'hidden', value: (sf.base.isNullOrUndefined(this.value) ? this.min.toString() : this.value.toString()),
                    name: this.element.getAttribute('name') || this.element.getAttribute('id') ||
                        '_' + (Math.random() * 1000).toFixed(0) + 'slider', class: classNames.sliderHiddenInput
                }
            }));
            this.hiddenInput.tabIndex = -1;
            this.sliderContainer.appendChild(this.hiddenInput);
        }
        if (this.showButtons) {
            this.setButtons();
        }
        this.setEnableRTL();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        else {
            this.value = sf.base.isNullOrUndefined(this.value) ? parseFloat(sf.base.formatUnit(this.min.toString())) : this.value;
        }
        this.previousVal = this.type !== 'Range' ? this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value.toString()))) :
            [this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value[0].toString()))),
                this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value[1].toString())))];
        this.previousChanged = this.previousVal;
        if (!sf.base.isNullOrUndefined(this.element.hasAttribute('name'))) {
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
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            if (!this.enabled) {
                sf.base.addClass([this.sliderContainer], [classNames.sliderDisabled]);
            }
            else {
                sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
            }
            if (this.readonly) {
                sf.base.addClass([this.sliderContainer], [classNames.readonly]);
            }
            else {
                sf.base.removeClass([this.sliderContainer], [classNames.readonly]);
            }
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
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.limitBarFirst = this.element.querySelectorAll('.e-limits')[0];
            if (this.type === 'Range') {
                this.limitBarSecond = this.element.querySelectorAll('.e-limit-second')[0];
            }
        }
        else {
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
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            min = this.customValues[0];
            max = this.customValues[this.customValues.length - 1];
        }
        if (this.type !== 'Range') {
            sf.base.attributes(element, {
                'aria-valuemin': min.toString(), 'aria-valuemax': max.toString()
            });
        }
        else {
            var range = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[min.toString(), (this.customValues[this.value[1]]).toString()],
                    [(this.customValues[this.value[0]]).toString(), max.toString()]] :
                [[min.toString(), this.value[1].toString()], [this.value[0].toString(), max.toString()]];
            range.forEach(function (range, index) {
                var element = index === 0 ? _this.firstHandle : _this.secondHandle;
                if (element) {
                    sf.base.attributes(element, {
                        'aria-valuemin': range[0], 'aria-valuemax': range[1]
                    });
                }
            });
        }
    };
    Slider.prototype.createSecondHandle = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.secondHandle = this.element.querySelector('.e-handle-second');
        }
        else {
            this.secondHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0'
                }
            });
            this.secondHandle.classList.add(classNames.sliderSecondHandle);
            this.element.appendChild(this.secondHandle);
        }
    };
    Slider.prototype.createFirstHandle = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.firstHandle = this.element.querySelector('.e-handle-first');
        }
        else {
            this.firstHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0'
                }
            });
            this.firstHandle.classList.add(classNames.sliderFirstHandle);
            this.element.appendChild(this.firstHandle);
        }
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
            sf.base.EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
            sf.base.EventHandler.add(this.firstHandle, 'transitionend', this.transitionEnd, this);
            sf.base.EventHandler.add(this.firstHandle, 'mouseenter touchenter', this.handleOver, this);
            sf.base.EventHandler.add(this.firstHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            sf.base.EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
            sf.base.EventHandler.remove(this.firstHandle, 'transitionend', this.transitionEnd);
            sf.base.EventHandler.remove(this.firstHandle, 'mouseenter touchenter', this.handleOver);
            sf.base.EventHandler.remove(this.firstHandle, 'mouseleave touchend', this.handleLeave);
        }
    };
    Slider.prototype.wireSecondHandleEvt = function (destroy) {
        if (!destroy) {
            sf.base.EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
            sf.base.EventHandler.add(this.secondHandle, 'transitionend', this.transitionEnd, this);
            sf.base.EventHandler.add(this.secondHandle, 'mouseenter touchenter', this.handleOver, this);
            sf.base.EventHandler.add(this.secondHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            sf.base.EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
            sf.base.EventHandler.remove(this.secondHandle, 'transitionend', this.transitionEnd);
            sf.base.EventHandler.remove(this.secondHandle, 'mouseenter touchenter', this.handleOver);
            sf.base.EventHandler.remove(this.secondHandle, 'mouseleave touchend', this.handleLeave);
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
        this.focusSliderElement();
        this.sliderBarClick(e);
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
        }
        else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
        }
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
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
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.enableRtl && this.orientation !== 'Vertical' ? sf.base.addClass([this.sliderContainer], classNames.rtl) :
                sf.base.removeClass([this.sliderContainer], classNames.rtl);
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
                    sf.base.setStyleAttribute(this.firstHandle, { 'right': '', 'left': 'auto' });
                    if (this.type === 'Range') {
                        sf.base.setStyleAttribute(this.secondHandle, { 'top': '', 'left': 'auto' });
                    }
                }
            }
        }
        this.setBarColor();
    };
    Slider.prototype.tooltipValue = function () {
        var _this = this;
        var text;
        var args = {
            value: this.value,
            text: ''
        };
        if (this.initialTooltip) {
            this.initialTooltip = false;
            if (sf.base.isBlazor() && this.isServerRendered) {
                args.text = this.formatContent(this.tooltipFormatInfo, false);
            }
            else {
                this.setTooltipContent();
                args.text = text = this.tooltipObj.content;
            }
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
        }
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
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            handle1 = this.customValues[this.handleVal1];
            handle2 = this.customValues[this.handleVal2];
        }
        if (!ariaContent) {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle2, formatInfo)
                        .formatString + ' - ' + this.formatString(handle1, formatInfo).formatString) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle1, formatInfo)
                        .formatString + ' - ' + this.formatString(handle2, formatInfo).formatString) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(handle1)) {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ?
                        this.formatString(handle1, formatInfo).formatString : handle1.toString();
                }
            }
            return content;
        }
        else {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle2, formatInfo).elementVal + ' - ' +
                            this.formatString(handle1, formatInfo).elementVal) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle1, formatInfo).elementVal + ' - ' +
                            this.formatString(handle2, formatInfo).elementVal) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(handle1)) {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
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
            sf.base.addClass([this.tooltipElement], this.tooltip.cssClass.split(' ').filter(function (css) { return css; }));
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
    Slider.prototype.materialTooltipEventCallBack = function (event) {
        this.sliderBarClick(event);
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    };
    Slider.prototype.wireMaterialTooltipEvent = function (destroy) {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                sf.base.EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack, this);
            }
            else {
                sf.base.EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack);
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
            if (this.materialHandle) {
                this.materialHandle.style.transform = 'scale(1)';
            }
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
                if (tooltipClass !== undefined) {
                    args.element.classList.remove(this.previousTooltipClass);
                    args.element.classList.add(tooltipClass);
                    this.previousTooltipClass = tooltipClass;
                }
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
        this.tooltipObj = new sf.popups.Tooltip({
            showTipPointer: this.isBootstrap || this.isMaterial || this.isBootstrap4,
            cssClass: classNames.sliderTooltip,
            height: this.isMaterial ? 30 : 'auto',
            animation: { open: { effect: 'None' }, close: { effect: 'FadeOut', duration: 500 } },
            opensOn: 'Custom',
            beforeOpen: this.tooltipBeforeOpen.bind(this),
            beforeCollision: this.checkTooltipPosition.bind(this),
            beforeClose: this.tooltipBeforeClose.bind(this),
            enableHtmlSanitizer: this.enableHtmlSanitizer
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
            if (!sf.base.isNullOrUndefined(handle)) {
                handle.style.transition = 'none';
            }
        });
        if (this.isMaterialTooltip) {
            this.sliderContainer.classList.add(classNames.materialSlider);
            if (!sf.base.isBlazor()) {
                this.tooltipValue();
            }
            this.tooltipObj.animation.close.effect = 'None';
            this.tooltipObj.open(this.firstHandle);
        }
    };
    Slider.prototype.tooltipBeforeClose = function () {
        this.tooltipElement = undefined;
        this.tooltipCollidedPosition = undefined;
    };
    Slider.prototype.setButtons = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.firstBtn = this.element.parentElement.querySelector('.e-slider-button.e-first-button');
            this.secondBtn = this.element.parentElement.querySelector('.e-slider-button.e-second-button');
        }
        else {
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
    };
    Slider.prototype.buttonTitle = function () {
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        var decrementTitle = this.l10n.getConstant('decrementTitle');
        var incrementTitle = this.l10n.getConstant('incrementTitle');
        sf.base.attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        sf.base.attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
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
        this.changeEvent('changed', e);
        this.closeTooltip();
        clearInterval(this.repeatInterval);
        this.getHandle().focus();
    };
    Slider.prototype.customTickCounter = function (bigNum) {
        var tickCount = 4;
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
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
        var liElementPosition = 0;
        var orien = this.orientation === 'Vertical' ? 'v' : 'h';
        this.noOfDecimals = this.numberOfDecimals(this.step);
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.ul = this.element.querySelector('ul');
        }
        else {
            this.ul = this.createElement('ul', {
                className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
                attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
            });
        }
        this.ul.style.zIndex = '-1';
        if (sf.base.Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        var smallStep = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            this.ticks.largeStep > 0 ? (smallStep = this.ticks.largeStep) :
                (smallStep = (parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min))));
        }
        else if (smallStep <= 0) {
            smallStep = parseFloat(sf.base.formatUnit(this.step));
        }
        var min = this.fractionalToInteger(this.min);
        var max = this.fractionalToInteger(this.max);
        var steps = this.fractionalToInteger(smallStep);
        var bigNum = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        var customStep = this.customTickCounter(bigNum);
        var count = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            (bigNum * customStep) + bigNum : Math.abs((max - min) / steps);
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.element.appendChild(this.ul);
        }
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
        for (var i = 0, y = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            this.customValues.length - 1 : 0, k = 0; i <= count; i++) {
            li = (this.createElement('li', {
                attrs: {
                    class: classNames.tick, role: 'presentation', tabIndex: '-1',
                    'aria-hidden': 'true'
                }
            }));
            if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
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
                if (sf.base.isBlazor() && this.isServerRendered && sf.base.isNullOrUndefined(this.customValues)) {
                    this.updateTicksValues(start, this.ul.children[liElementPosition]);
                    liElementPosition++;
                }
            }
            else if (sf.base.isNullOrUndefined(this.customValues)) {
                this.formatTicksValue(li, start);
                if (sf.base.isBlazor() && this.isServerRendered && sf.base.isNullOrUndefined(this.customValues)) {
                    this.updateTicksValues(start, this.ul.children[liElementPosition]);
                    liElementPosition++;
                }
            }
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                this.ul.appendChild(li);
            }
            this.tickElementCollection.push(li);
            var decimalPoints = void 0;
            if (sf.base.isNullOrUndefined(this.customValues)) {
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
    Slider.prototype.updateTicksValues = function (start, liElement) {
        if (liElement.childElementCount > 0) {
            for (var i = 0; i < liElement.childElementCount; i++) {
                this.blazortTicksValue(liElement, start, liElement.children[i]);
            }
        }
        else {
            this.blazortTicksValue(liElement, start, null);
        }
    };
    Slider.prototype.blazortTicksValue = function (li, start, span) {
        var _this = this;
        var tickText = this.formatNumber(start);
        var text = !sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        var eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, function (observedArgs) {
            li.setAttribute('title', observedArgs.text.toString());
            if (span) {
                if (_this.enableHtmlSanitizer) {
                    span.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                }
                else {
                    span.innerHTML = observedArgs.text.toString();
                }
            }
        });
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
        if (sf.base.isNullOrUndefined(this.customValues)) {
            this.formatTicksValue(li, start, span, tickWidth);
        }
        else {
            if (this.enableHtmlSanitizer) {
                span.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(start.toString());
            }
            else {
                span.innerHTML = start.toString();
            }
        }
    };
    Slider.prototype.formatTicksValue = function (li, start, spanElement, tickWidth) {
        var _this = this;
        var tickText = this.formatNumber(start);
        var text = !sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        var eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, function (observedArgs) {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                if (_this.enableHtmlSanitizer) {
                    spanElement.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                }
                else {
                    spanElement.innerHTML = observedArgs.text.toString();
                }
            }
            if (!sf.base.isNullOrUndefined(_this.renderingTicks) && sf.base.isBlazor()) {
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
        this.firstChild = this.element.querySelector('ul').children[0];
        var first = this.firstChild.getBoundingClientRect();
        var firstChild;
        var otherChild;
        var smallStep = this.ticks.smallStep;
        var count = Math.abs((parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min)))) / smallStep;
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
                if (!sf.base.isBlazor() || !this.isServerRendered) {
                    this.firstChild.children[i].style.top = -(firstChild.height / 2) + 'px';
                }
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
            otherChild = other[i].getBoundingClientRect();
            if (this.orientation === 'Vertical') {
                if (!sf.base.isBlazor() || !this.isServerRendered) {
                    sf.base.setStyleAttribute(other[i], { top: (tickWidth - otherChild.height) / 2 + 'px' });
                }
            }
            else {
                sf.base.setStyleAttribute(other[i], { left: (tickWidth - otherChild.width) / 2 + 'px' });
            }
        }
        if (this.enableRtl && this.lastChild.children.length && count !== 0) {
            this.lastChild.children[0].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            if (this.ticks.placement === 'Both') {
                if (!sf.base.isBlazor()) {
                    this.lastChild.children[1].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
                }
            }
        }
        if (count === 0) {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    if (!sf.base.isBlazor()) {
                        this.firstChild.style.left = this.firstHandle.style.left;
                    }
                }
                else {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    this.firstChild.style.right = this.firstHandle.style.right;
                    if (!sf.base.isBlazor()) {
                        this.firstChild.children[0].style.left =
                            (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                        if (this.ticks.placement === 'Both') {
                            this.firstChild.children[1].style.left =
                                (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                        }
                    }
                }
            }
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                if (this.orientation === 'Vertical') {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                }
            }
        }
        if (sf.base.isBlazor() && this.isServerRendered) {
            var args = void 0;
            if (this.firstChild != null) {
                if (this.orientation === 'Horizontal') {
                    args = { firstTickPostion: this.firstChild.children[0].style.left };
                }
                else {
                    args = { firstTickPostion: -(firstChild.height / 2) + 'px' };
                }
            }
            if (other[0] != null) {
                if (this.orientation === 'Horizontal') {
                    args = { otherTicksPosition: other[0].style.left };
                }
                else {
                    args = { otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px' };
                }
            }
            if (this.firstChild != null && other[0] != null) {
                if (this.orientation === 'Horizontal') {
                    args = {
                        firstTickPostion: this.firstChild.children[0].style.left,
                        otherTicksPosition: other[0].style.left
                    };
                }
                else {
                    args = {
                        firstTickPostion: -(firstChild.height / 2) + 'px',
                        otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px'
                    };
                }
            }
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('SliderTicksData', args);
            // tslint:enable
        }
    };
    Slider.prototype.setAriaAttrValue = function (element) {
        var ariaValueText;
        var isTickFormatted = ((!sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format))) ? true : false;
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
            sf.base.attributes(element, { 'aria-valuenow': valuenow, 'aria-valuetext': text });
        }
        else {
            (!this.enableRtl) ? ((element === this.firstHandle) ?
                sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }) :
                sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] })) :
                ((element === this.firstHandle) ?
                    sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] }) :
                    sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }));
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
            sf.base.EventHandler.add(this.firstBtn, 'mouseup touchend', this.buttonUp, this);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            sf.base.EventHandler.add(this.secondBtn, 'mouseup touchend', this.buttonUp, this);
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
            sf.base.EventHandler.remove(this.firstBtn, 'mouseup touchend', this.buttonUp);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            sf.base.EventHandler.remove(this.secondBtn, 'mouseup touchend', this.buttonUp);
        }
    };
    Slider.prototype.setRangeBar = function () {
        if (this.orientation === 'Horizontal') {
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
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
        if (sf.base.isNullOrUndefined(minValue)) {
            minValue = this.min;
            if (sf.base.isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (sf.base.isNullOrUndefined(maxValue)) {
            maxValue = this.max;
            if (sf.base.isNullOrUndefined(currentValue) && limitBar) {
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
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            this.min = 0;
            this.max = this.customValues.length - 1;
            this.setBarColor();
        }
        this.setAriaAttributes(this.firstHandle);
        this.handleVal1 = sf.base.isNullOrUndefined(this.value) ? this.checkHandleValue(parseFloat(this.min.toString())) :
            this.checkHandleValue(parseFloat(this.value.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.preHandlePos1 = this.handlePos1;
        sf.base.isNullOrUndefined(this.activeHandle) ? (this.type === 'Range' ? this.activeHandle = 2 : this.activeHandle = 1) :
            this.activeHandle = this.activeHandle;
        if (this.type === 'Default' || this.type === 'MinRange') {
            if (this.limits.enabled) {
                var values = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = values[0];
                this.handlePos1 = values[1];
                this.preHandlePos1 = this.handlePos1;
            }
            this.setHandlePosition(null);
            this.handleStart();
            this.value = this.handleVal1;
            this.setAriaAttrValue(this.firstHandle);
            this.changeEvent('changed', null);
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
            this.value = [parseFloat(sf.base.formatUnit(this.min)), parseFloat(sf.base.formatUnit(this.max))];
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
            this.tooltipElement.style.zIndex = sf.popups.getZindexPartial(this.element) + '';
        }
    };
    Slider.prototype.setHandlePosition = function (event) {
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
            if (sf.base.isBlazor() && _this.isServerRendered) {
                handle.style.removeProperty('visibility');
            }
        });
        this.changeEvent('change', event);
    };
    Slider.prototype.getHandle = function () {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    };
    Slider.prototype.setRangeValue = function () {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition(null);
        this.activeHandle = 2;
        this.setHandlePosition(null);
        this.activeHandle = 1;
    };
    Slider.prototype.changeEvent = function (eventName, e) {
        var previous = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value) {
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        }
        else {
            var value = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if (previous.length === this.value.length
                && this.value[0] !== previous[0] || this.value[1] !== previous[1]) {
                this.initialTooltip = false;
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    };
    Slider.prototype.changeEventArgs = function (eventName, e) {
        var eventArgs;
        if (this.tooltip.isVisible && this.tooltipObj && this.initialTooltip) {
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                this.tooltipValue();
            }
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: this.tooltipObj.content, isInteracted: sf.base.isNullOrUndefined(e) ? false : true
            };
        }
        else {
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: sf.base.isNullOrUndefined(this.ticksFormatInfo.format) ? this.value.toString() :
                    (this.type !== 'Range' ? this.formatString(this.value, this.ticksFormatInfo).formatString :
                        (this.formatString(this.value[0], this.ticksFormatInfo).formatString + ' - ' +
                            this.formatString(this.value[1], this.ticksFormatInfo).formatString)),
                isInteracted: sf.base.isNullOrUndefined(e) ? false : true
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
            (value - (parseFloat(sf.base.formatUnit(this.min))))) / ((parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min))));
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (value / 100);
        }
        else {
            pos = this.element.getBoundingClientRect().height * (value / 100);
        }
        if (((parseFloat(sf.base.formatUnit(this.max))) === (parseFloat(sf.base.formatUnit(this.min))))) {
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
            return (parseFloat(sf.base.formatUnit(this.max)));
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
                sf.base.setStyleAttribute(this.rangeBar, { 'width': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.enableRtl ? this.secondHandle.style.right =
                    this.handlePos2 + "px" : this.secondHandle.style.left = this.handlePos2 + "px";
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            this.firstHandle.style.bottom = this.handlePos1 + "px";
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = this.handlePos1 + "px";
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.secondHandle.style.bottom = this.handlePos2 + "px";
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None' && this.ul) {
            if (!sf.base.isBlazor()) {
                this.removeElement(this.ul);
                this.ul = undefined;
            }
            this.renderScale();
            if (sf.base.isBlazor()) {
                this.tickValuePosition();
            }
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
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.refreshTooltip(this.tooltipTarget);
        }
        this.setBarColor();
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
            this.setHandlePosition(null);
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
        var percentStep = (parseFloat(sf.base.formatUnit(this.step))) / ((parseFloat(sf.base.formatUnit(this.max)) - parseFloat(sf.base.formatUnit(this.min))) / 100);
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
        var diff = parseFloat(sf.base.formatUnit(this.max)) - parseFloat(sf.base.formatUnit(this.min));
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
        if (evt.type === 'mousedown' || evt.type === 'mouseup' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else if (evt.type === 'touchend' || evt.type === 'touchstart') {
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
        this.setHandlePosition(evt);
        this.changeEvent('changed', evt);
        if (this.type !== 'Default') {
            this.setRangeBar();
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
        this.rangeBarDragged = true;
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
        this.setHandlePosition(event);
        this.activeHandle = 2;
        this.setHandlePosition(event);
        this.tooltipToggle(this.rangeBar);
        this.setRangeBar();
    };
    Slider.prototype.sliderBarUp = function (event) {
        this.changeEvent('changed', event);
        this.handleFocusOut();
        this.firstHandle.classList.remove(classNames.sliderActiveHandle);
        if (this.type === 'Range') {
            this.initialTooltip = false;
            this.secondHandle.classList.remove(classNames.sliderActiveHandle);
        }
        this.closeTooltip();
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
            if (this.isMaterialTooltip) {
                this.tooltipElement.classList.remove(classNames.materialTooltipActive);
            }
        }
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
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
        this.setHandlePosition(evt);
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
        if (!this.rangeBarDragged) {
            this.focusSliderElement();
            this.sliderBarClick(event);
        }
        this.changeEvent('changed', event);
        this.closeTooltip();
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
        this.rangeBarDragged = false;
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
        if (this.tooltip.isVisible && this.tooltipObj && this.initialTooltip) {
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
            sf.base.EventHandler.add(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            sf.base.EventHandler.add(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            sf.base.EventHandler.add(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            sf.base.EventHandler.add(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            sf.base.EventHandler.add(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            sf.base.EventHandler.add(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            sf.base.EventHandler.add(this.firstBtn, 'focusout', this.sliderFocusOut, this);
            sf.base.EventHandler.add(this.secondBtn, 'focusout', this.sliderFocusOut, this);
        }
        else {
            sf.base.EventHandler.remove(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut);
            sf.base.EventHandler.remove(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut);
            sf.base.EventHandler.remove(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            sf.base.EventHandler.remove(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            sf.base.EventHandler.remove(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            sf.base.EventHandler.remove(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            sf.base.EventHandler.remove(this.firstBtn, 'focusout', this.sliderFocusOut);
            sf.base.EventHandler.remove(this.secondBtn, 'focusout', this.sliderFocusOut);
        }
    };
    Slider.prototype.rangeBarMousedown = function (event) {
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
            sf.base.EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            sf.base.EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
    };
    Slider.prototype.elementClick = function (event) {
        event.preventDefault();
        this.focusSliderElement();
        this.sliderBarClick(event);
    };
    Slider.prototype.wireEvents = function () {
        this.onresize = this.reposition.bind(this);
        window.addEventListener('resize', this.onresize);
        if (this.enabled && !this.readonly) {
            sf.base.EventHandler.add(this.element, 'click', this.elementClick, this);
            if (this.type === 'Range' && this.drag) {
                sf.base.EventHandler.add(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown, this);
            }
            sf.base.EventHandler.add(this.sliderContainer, 'keydown', this.keyDown, this);
            sf.base.EventHandler.add(this.sliderContainer, 'keyup', this.keyUp, this);
            sf.base.EventHandler.add(this.element, 'focusout', this.sliderFocusOut, this);
            sf.base.EventHandler.add(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover, this);
            this.wireFirstHandleEvt(false);
            if (this.type === 'Range') {
                this.wireSecondHandleEvt(false);
            }
            if (this.showButtons) {
                this.wireButtonEvt(false);
            }
            this.wireMaterialTooltipEvent(false);
            if (this.isForm) {
                sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
        }
    };
    Slider.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.elementClick);
        if (this.type === 'Range' && this.drag) {
            sf.base.EventHandler.remove(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown);
        }
        sf.base.EventHandler.remove(this.sliderContainer, 'keydown', this.keyDown);
        sf.base.EventHandler.remove(this.sliderContainer, 'keyup', this.keyUp);
        sf.base.EventHandler.remove(this.element, 'focusout', this.sliderFocusOut);
        sf.base.EventHandler.remove(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover);
        this.wireFirstHandleEvt(true);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(true);
        }
        if (this.showButtons) {
            this.wireButtonEvt(true);
        }
        this.wireMaterialTooltipEvent(true);
        sf.base.EventHandler.remove(this.element, 'reset', this.formResetHandler);
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
        this.changeEvent('changed', event);
    };
    Slider.prototype.hover = function (event) {
        if (!sf.base.isNullOrUndefined(event)) {
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
    Slider.prototype.changeSliderType = function (type, args) {
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
        if (this.tooltip.isVisible && !sf.base.isNullOrUndefined(this.tooltipObj)) {
            this.tooltipObj.destroy();
            this.tooltipElement = undefined;
            this.tooltipCollidedPosition = undefined;
        }
        if (this.limits.enabled) {
            if (type === 'MinRange' || type === 'Default') {
                if (!sf.base.isNullOrUndefined(this.limitBarFirst)) {
                    this.removeElement(this.limitBarFirst);
                    this.limitBarFirst = undefined;
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(this.limitBarSecond)) {
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
        this.setBarColor();
        if ((!sf.base.isBlazor() && !this.isServerRendered) || args !== 'tooltip') {
            this.updateConfig();
        }
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
            sf.base.attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            sf.base.attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    };
    Slider.prototype.changeOrientation = function () {
        this.changeSliderType(this.type, 'null');
    };
    Slider.prototype.updateConfig = function () {
        this.setEnableRTL();
        this.setValue();
        if (this.tooltip.isVisible) {
            if (!sf.base.isBlazor()) {
                this.refreshTooltip(this.tooltipTarget);
            }
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
            if (sf.base.isNullOrUndefined(this.limitBarFirst) && this.type !== 'Range') {
                this.createLimitBar();
            }
            if (sf.base.isNullOrUndefined(this.limitBarFirst) && sf.base.isNullOrUndefined(this.limitBarSecond) && this.type === 'Range') {
                this.createLimitBar();
            }
            this.setLimitBar();
            this.setValue();
        }
        else {
            if (!sf.base.isNullOrUndefined(this.limitBarFirst)) {
                sf.base.detach(this.limitBarFirst);
            }
            if (!sf.base.isNullOrUndefined(this.limitBarSecond)) {
                sf.base.detach(this.limitBarSecond);
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
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    Slider.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.unwireEvents();
        window.removeEventListener('resize', this.onresize);
        sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        this.firstHandle.removeAttribute('aria-orientation');
        if (this.type === 'Range') {
            this.secondHandle.removeAttribute('aria-orientation');
        }
        if (!sf.base.isBlazor() && !this.isServerRendered) {
            this.sliderContainer.parentNode.insertBefore(this.element, this.sliderContainer);
            sf.base.detach(this.sliderContainer);
        }
        if (this.tooltip.isVisible) {
            this.tooltipObj.destroy();
        }
        if (!sf.base.isBlazor() && !this.isServerRendered) {
            this.element.innerHTML = '';
        }
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
                        var value = sf.base.isNullOrUndefined(newProp.value) ?
                            (this.type === 'Range' ? [this.min, this.max] : this.min) : newProp.value;
                        this.setProperties({ 'value': value }, true);
                        if (!sf.base.isNullOrUndefined(oldProp.value) && oldProp.value.toString() !== value.toString()) {
                            this.setValue();
                            if (!sf.base.isBlazor() || !this.isServerRendered) {
                                this.refreshTooltip(this.tooltipTarget);
                            }
                            if (this.type === 'Range') {
                                if (sf.base.isNullOrUndefined(newProp.value) || oldProp.value[1] === value[1]) {
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
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.setMinMaxValue();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'tooltip':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    if (!sf.base.isNullOrUndefined(newProp.tooltip) && !sf.base.isNullOrUndefined(oldProp.tooltip)) {
                        this.setTooltip(prop);
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'type':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    if (!sf.base.isNullOrUndefined(oldProp) && Object.keys(oldProp).length
                        && !sf.base.isNullOrUndefined(oldProp.type)) {
                        this.changeSliderType(oldProp.type, prop);
                        this.setZindex();
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'enableRtl':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                        this.isServerRendered = false;
                    }
                    if (oldProp.enableRtl !== newProp.enableRtl && this.orientation !== 'Vertical') {
                        this.rtl = oldProp.enableRtl;
                        this.changeRtl();
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'limits':
                    this.limitsPropertyChange();
                    break;
                case 'orientation':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.changeOrientation();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'ticks':
                    if (!sf.base.isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
                        if (!sf.base.isBlazor() || !this.isServerRendered) {
                            sf.base.detach(this.ul);
                        }
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
                        if (!sf.base.isBlazor() || !this.isServerRendered) {
                            if (this.firstBtn && this.secondBtn) {
                                this.sliderContainer.removeChild(this.firstBtn);
                                this.sliderContainer.removeChild(this.secondBtn);
                                this.sliderContainer.classList.remove(classNames.sliderButtonClass);
                                this.firstBtn = undefined;
                                this.secondBtn = undefined;
                                this.reposition();
                            }
                        }
                    }
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'enabled':
                    this.setEnabled();
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'readonly':
                    this.setReadOnly();
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'customValues':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.setValue();
                    this.reposition();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'colorRange':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.reposition();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'width':
                    this.setElementWidth(newProp.width);
                    this.setMinMaxValue();
                    if (this.limits) {
                        this.limitsPropertyChange();
                    }
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
        if (!sf.base.isBlazor()) {
            this.refreshTooltip(this.tooltipTarget);
        }
        if (!sf.base.isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
            if (this.ul) {
                sf.base.detach(this.ul);
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
        if (!sf.base.isNullOrUndefined(this.ticks) && this.ticks.placement !== 'None') {
            this.ul.style.zIndex = (this.zIndex + -7) + '';
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!this.isMaterial && !sf.base.isNullOrUndefined(this.ticks) && this.ticks.placement === 'Both') {
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
        if (this.type === 'Range') {
            this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
        }
    };
    Slider.prototype.setTooltip = function (args) {
        this.changeSliderType(this.type, args);
    };
    Slider.prototype.setBarColor = function () {
        var trackPosition;
        var trackClassName;
        var child = this.sliderTrack.lastElementChild;
        while (child) {
            this.sliderTrack.removeChild(child);
            child = this.sliderTrack.lastElementChild;
        }
        for (var i = 0; i < this.colorRange.length; i++) {
            if (!sf.base.isNullOrUndefined(this.colorRange[i].start) && !sf.base.isNullOrUndefined(this.colorRange[i].end)) {
                if (this.colorRange[i].end > this.colorRange[i].start) {
                    if (this.colorRange[i].start < this.min) {
                        this.colorRange[i].start = this.min;
                    }
                    if (this.colorRange[i].end > this.max) {
                        this.colorRange[i].end = this.max;
                    }
                    var startingPosition = this.checkHandlePosition(this.colorRange[i].start);
                    var endPosition = this.checkHandlePosition(this.colorRange[i].end);
                    var trackContainer = this.createElement('div');
                    trackContainer.style.backgroundColor = this.colorRange[i].color;
                    trackContainer.style.border = '1px solid ' + this.colorRange[i].color;
                    if (this.orientation === 'Horizontal') {
                        trackClassName = classNames.sliderHorizantalColor;
                        if (this.enableRtl) {
                            if (sf.base.isNullOrUndefined(this.customValues)) {
                                trackPosition = this.checkHandlePosition(this.max) - this.checkHandlePosition(this.colorRange[i].end);
                            }
                            else {
                                trackPosition = this.checkHandlePosition(this.customValues.length - this.colorRange[i].end - 1);
                            }
                        }
                        else {
                            trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        }
                        trackContainer.style.width = endPosition - startingPosition + 'px';
                        trackContainer.style.left = trackPosition + 'px';
                    }
                    else {
                        trackClassName = classNames.sliderVerticalColor;
                        trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        trackContainer.style.height = endPosition - startingPosition + 'px';
                        trackContainer.style.bottom = trackPosition + 'px';
                    }
                    trackContainer.classList.add(trackClassName);
                    this.sliderTrack.appendChild(trackContainer);
                }
            }
        }
    };
    /**
     * Gets the component name
     * @private
     */
    Slider.prototype.getModuleName = function () {
        return 'slider';
    };
    __decorate$2([
        sf.base.Property(null)
    ], Slider.prototype, "value", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Slider.prototype, "customValues", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Slider.prototype, "step", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Slider.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Slider.prototype, "min", void 0);
    __decorate$2([
        sf.base.Property(100)
    ], Slider.prototype, "max", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Slider.prototype, "readonly", void 0);
    __decorate$2([
        sf.base.Property('Default')
    ], Slider.prototype, "type", void 0);
    __decorate$2([
        sf.base.Collection([{}], ColorRangeData)
    ], Slider.prototype, "colorRange", void 0);
    __decorate$2([
        sf.base.Complex({}, TicksData)
    ], Slider.prototype, "ticks", void 0);
    __decorate$2([
        sf.base.Complex({}, LimitData)
    ], Slider.prototype, "limits", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Slider.prototype, "enabled", void 0);
    __decorate$2([
        sf.base.Complex({}, TooltipData)
    ], Slider.prototype, "tooltip", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Slider.prototype, "showButtons", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Slider.prototype, "enableAnimation", void 0);
    __decorate$2([
        sf.base.Property('Horizontal')
    ], Slider.prototype, "orientation", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Slider.prototype, "cssClass", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Slider.prototype, "enableHtmlSanitizer", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "created", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "change", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "changed", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "renderingTicks", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "renderedTicks", void 0);
    __decorate$2([
        sf.base.Event()
    ], Slider.prototype, "tooltipChange", void 0);
    Slider = __decorate$2([
        sf.base.NotifyPropertyChanges
    ], Slider);
    return Slider;
}(sf.base.Component));

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
var APPLY = 'e-apply';
var CANCEL = 'e-cancel';
var CURRENT = 'e-current';
var CONTAINER = 'e-container';
var CTRLBTN = 'e-ctrl-btn';
var CTRLSWITCH = 'e-switch-ctrl-btn';
var DISABLED = 'e-disabled';
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
var RTL = 'e-rtl';
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
var ColorPicker = /** @class */ (function (_super) {
    __extends(ColorPicker, _super);
    function ColorPicker(options, element) {
        return _super.call(this, options, element) || this;
    }
    ColorPicker.prototype.preRender = function () {
        var ele = this.element;
        this.formElement = sf.base.closest(this.element, 'form');
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        var localeText = { Apply: 'Apply', Cancel: 'Cancel', ModeSwitcher: 'Switch Mode' };
        this.l10n = new sf.base.L10n('colorpicker', localeText, this.locale);
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
            sf.base.addClass([this.container.parentElement], HIDEOPACITY);
        }
        this.renderComplete();
    };
    ColorPicker.prototype.initWrapper = function () {
        var wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        sf.base.attributes(this.element, { 'tabindex': '-1', 'spellcheck': 'false' });
        this.container = this.createElement('div', { className: CONTAINER });
        this.getWrapper().appendChild(this.container);
        var value = this.value ? this.roundValue(this.value).toLowerCase() : '#008000ff';
        if (this.noColor && this.mode === 'Palette' && this.value === '') {
            value = '';
        }
        var slicedValue = value.slice(0, 7);
        if (sf.base.isNullOrUndefined(this.initialInputValue)) {
            this.initialInputValue = slicedValue;
        }
        this.element.value = slicedValue;
        if (this.enableOpacity) {
            this.setProperties({ 'value': value }, true);
        }
        else {
            this.setProperties({ 'value': slicedValue }, true);
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            sf.base.addClass([wrapper], this.cssClass.split(' '));
        }
        this.tileRipple = sf.base.rippleEffect(this.container, { selector: '.' + TILE });
        this.ctrlBtnRipple = sf.base.rippleEffect(this.container, { selector: '.e-btn' });
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
        if (sf.base.Browser.isDevice) {
            this.refreshPopupPos();
        }
    };
    ColorPicker.prototype.createSplitBtn = function () {
        var _this = this;
        var splitButton = this.createElement('button', { className: 'e-split-colorpicker' });
        this.getWrapper().appendChild(splitButton);
        this.splitBtn = new sf.splitbuttons.SplitButton({
            iconCss: 'e-selected-color',
            target: this.container,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            open: this.onOpen.bind(this),
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
        sf.base.select('.e-selected-color', splitButton).appendChild(preview);
        preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(this.value));
        var popupEle = this.getPopupEle();
        sf.base.addClass([popupEle], 'e-colorpicker-popup');
        if (this.cssClass) {
            sf.base.addClass([popupEle], this.cssClass.split(' '));
        }
        if (sf.base.Browser.isDevice) {
            var popupInst = this.getPopupInst();
            popupInst.relateTo = document.body;
            popupInst.position = { X: 'center', Y: 'center' };
            popupInst.targetType = 'container';
            popupInst.collision = { X: 'fit', Y: 'fit' };
            popupInst.offsetY = 4;
            popupEle.style.zIndex = sf.popups.getZindexPartial(this.splitBtn.element).toString();
        }
        this.bindCallBackEvent();
    };
    ColorPicker.prototype.onOpen = function (args) {
        this.trigger('open', { element: this.container });
    };
    ColorPicker.prototype.getPopupInst = function () {
        return sf.base.getInstance(this.getPopupEle(), sf.popups.Popup);
    };
    ColorPicker.prototype.bindCallBackEvent = function () {
        var _this = this;
        this.splitBtn.beforeOpen = function (args) {
            var callBackPromise = new sf.splitbuttons.Deferred();
            _this.trigger('beforeOpen', args, function (observeOpenArgs) {
                if (!observeOpenArgs.cancel) {
                    var popupEle = _this.getPopupEle();
                    popupEle.style.top = sf.base.formatUnit(0 + pageYOffset);
                    popupEle.style.left = sf.base.formatUnit(0 + pageXOffset);
                    popupEle.style.display = 'block';
                    _this.createWidget();
                    popupEle.style.display = '';
                    if (sf.base.Browser.isDevice) {
                        _this.modal = _this.createElement('div');
                        _this.modal.className = 'e-' + _this.getModuleName() + ' e-modal';
                        _this.modal.style.display = 'none';
                        document.body.insertBefore(_this.modal, popupEle);
                        document.body.className += ' e-colorpicker-overflow';
                        _this.modal.style.display = 'block';
                        _this.modal.style.zIndex = (Number(popupEle.style.zIndex) - 1).toString();
                    }
                }
                args.cancel = observeOpenArgs.cancel;
                callBackPromise.resolve(observeOpenArgs);
            });
            return callBackPromise;
        };
        this.splitBtn.beforeClose = function (args) {
            var callBackPromise = new sf.splitbuttons.Deferred();
            if (!sf.base.isNullOrUndefined(args.event)) {
                var beforeCloseArgs = { element: _this.container, event: args.event, cancel: false };
                _this.trigger('beforeClose', beforeCloseArgs, function (observedCloseArgs) {
                    if (sf.base.Browser.isDevice && args.event.target === _this.modal) {
                        observedCloseArgs.cancel = true;
                    }
                    if (!observedCloseArgs.cancel) {
                        _this.onPopupClose();
                    }
                    args.cancel = observedCloseArgs.cancel;
                    callBackPromise.resolve(observedCloseArgs);
                });
            }
            else {
                callBackPromise.resolve(args);
            }
            return callBackPromise;
        };
    };
    ColorPicker.prototype.onPopupClose = function () {
        this.unWireEvents();
        this.destroyOtherComp();
        this.container.style.width = '';
        sf.base.select('.' + SPLITPREVIEW, this.splitBtn.element).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
        this.container.innerHTML = '';
        sf.base.removeClass([this.container], [PICKERCONTENT, PALETTECONTENT]);
        if (sf.base.Browser.isDevice && this.modal) {
            sf.base.removeClass([document.body], 'e-colorpicker-overflow');
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    };
    ColorPicker.prototype.createPalette = function () {
        sf.base.classList(this.container, [PALETTECONTENT], [PICKERCONTENT]);
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
            if (sf.base.selectAll('.e-row', paletteGroup).length > 10) {
                sf.base.addClass([paletteGroup], 'e-palette-group');
            }
        }
        else {
            this.appendPalette(presets.default, 'default');
        }
        if (this.mode === 'Palette' && !this.modeSwitcher && this.noColor) {
            this.setNoColor();
        }
        var width = parseInt(getComputedStyle(this.container).borderBottomWidth, 10);
        this.container.style.width = sf.base.formatUnit(this.container.children[0].offsetWidth + width + width);
        this.rgb = this.hexToRgb(this.roundValue(this.value));
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
    };
    ColorPicker.prototype.firstPaletteFocus = function () {
        if (!sf.base.select('.' + SELECT, this.container.children[0])) {
            sf.base.selectAll('.' + PALETTES, this.container)[0].focus();
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
            sf.base.closest(noColorEle, '.' + PALETTES).focus();
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
        sf.base.classList(this.container, [PICKERCONTENT], [PALETTECONTENT]);
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
        return sf.base.select('.' + HSVCONTAINER, this.container);
    };
    ColorPicker.prototype.setHandlerPosition = function () {
        var dragHandler = this.getDragHandler();
        var hsvArea = sf.base.select('.' + HSVAREA, this.container);
        if (this.enableRtl) {
            dragHandler.style.left = sf.base.formatUnit(hsvArea.offsetWidth * Math.abs(100 - this.hsv[1]) / 100);
        }
        else {
            dragHandler.style.left = sf.base.formatUnit(hsvArea.offsetWidth * this.hsv[1] / 100);
        }
        dragHandler.style.top = sf.base.formatUnit(hsvArea.offsetHeight * (100 - this.hsv[2]) / 100);
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
        sf.base.select('.e-slider-track', this.opacitySlider.element).style.background =
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
        if (this.enableOpacity && !this.getWrapper().classList.contains(HIDEVALUE)) {
            var opacityTextBoxInst = sf.base.getInstance(sf.base.select('.' + OPACITY, this.container), NumericTextBox);
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
                Input$1.createInput({
                    element: hexInput,
                    floatLabelType: 'Always',
                    properties: {
                        placeholder: 'HEX',
                        enableRtl: this.enableRtl,
                        enabled: !this.disabled,
                        readonly: this.isPicker() ? false : true
                    }
                }, this.createElement);
                Input$1.setValue(this.value.slice(0, 7), hexInput);
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
        sf.base.select('.' + CTRLSWITCH, this.container).insertBefore(modeSwitcher, sf.base.select('.' + CTRLBTN, this.container));
    };
    ColorPicker.prototype.createDragTooltip = function () {
        var _this = this;
        var tooltip = new sf.popups.Tooltip({
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
        this.tooltipEle.style.zIndex = sf.popups.getZindexPartial(this.tooltipEle).toString();
        sf.base.select('.e-tip-content', this.tooltipEle).appendChild(this.createElement('div', { className: 'e-tip-transparent' }));
    };
    ColorPicker.prototype.getTooltipInst = function () {
        return sf.base.getInstance(this.container, sf.popups.Tooltip);
    };
    ColorPicker.prototype.setTooltipOffset = function (value) {
        this.getTooltipInst().offsetY = value;
    };
    ColorPicker.prototype.toggleDisabled = function (enable) {
        enable ? this.getWrapper().classList.add(DISABLED) : this.getWrapper().classList.remove(DISABLED);
        if (this.showButtons) {
            ([].slice.call(sf.base.selectAll('.e-btn', this.container))).forEach(function (ele) {
                enable ? sf.base.attributes(ele, { 'disabled': '' }) : ele.removeAttribute('disabled');
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
                Input$1.setValue(value.substr(0, 7), sf.base.select('.' + HEX, this.container));
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
        sf.base.select('.e-tip-transparent', this.tooltipEle).style.backgroundColor = value;
        sf.base.select('.' + PREVIEW + ' .' + CURRENT, this.container).style.backgroundColor = value;
        sf.base.select('.' + PREVIEW + ' .' + PREVIOUS, this.container).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
    };
    ColorPicker.prototype.getDragHandler = function () {
        return sf.base.select('.' + HANDLER, this.container);
    };
    ColorPicker.prototype.removeTileSelection = function () {
        var selectedEle = [].slice.call(sf.base.selectAll('.' + SELECT, this.container.children[0]));
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
            sf.base.EventHandler.add(dragHandler, 'keydown', this.pickerKeyDown, this);
            sf.base.EventHandler.add(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown, this);
            if (this.modeSwitcher || this.showButtons) {
                this.addCtrlSwitchEvent();
            }
            sf.base.EventHandler.add(sf.base.select('.' + PREVIOUS, this.container), 'click', this.previewHandler, this);
        }
        else {
            sf.base.EventHandler.add(this.container, 'click', this.paletteClickHandler, this);
            sf.base.EventHandler.add(this.container, 'keydown', this.paletteKeyDown, this);
        }
    };
    ColorPicker.prototype.formResetHandler = function () {
        this.value = this.initialInputValue;
        sf.base.attributes(this.element, { 'value': this.initialInputValue });
    };
    ColorPicker.prototype.addCtrlSwitchEvent = function () {
        var ctrlSwitchBtn = sf.base.select('.' + CTRLSWITCH, this.container);
        if (ctrlSwitchBtn) {
            sf.base.EventHandler.add(ctrlSwitchBtn, 'click', this.btnClickHandler, this);
        }
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
            value: this.enableOpacity ? value : hex
        });
        if (this.enableOpacity) {
            this.setProperties({ 'value': value }, true);
        }
        else {
            this.setProperties({ 'value': hex }, true);
        }
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
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.handlerMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.handlerEnd, this);
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
                sf.base.select('.' + HSVAREA, this.container).style.cursor = 'pointer';
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
        var ele = sf.base.select('.' + HSVAREA, this.container);
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
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.handlerMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.handlerEnd);
        var dragHandler = this.getDragHandler();
        sf.base.select('.' + HSVAREA, this.container).style.cursor = '';
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
        if (sf.base.closest(target, '.' + MODESWITCH)) {
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
        sf.base.detach(sf.base.select('.e-slider-preview', this.container));
        if (!this.getWrapper().classList.contains(HIDEVALUE)) {
            sf.base.remove(sf.base.select('.' + INPUTWRAPPER, this.container));
        }
        sf.base.detach(this.getHsvContainer());
        this.createPalette();
        this.firstPaletteFocus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
        this.trigger('onModeSwitch', { element: this.container, mode: 'Palette' });
    };
    ColorPicker.prototype.refreshPopupPos = function () {
        if (!this.inline) {
            var popupEle = this.getPopupEle();
            popupEle.style.left = sf.base.formatUnit(0 + pageXOffset);
            popupEle.style.top = sf.base.formatUnit(0 + pageYOffset);
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
            inst = sf.base.getInstance(sf.base.select('.' + clsName[i], this.container), NumericTextBox);
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
        sf.base.select('.' + PREVIEW + ' .' + CURRENT, this.container).style.backgroundColor = this.convertToRgbString(this.rgb);
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
            if (sf.base.closest(target, '.' + MODESWITCH)) {
                this.switchToPicker();
            }
            else {
                if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                    this.ctrlBtnClick(target, e);
                }
                else {
                    if (this.getWrapper().classList.contains(SHOWVALUE) && sf.base.closest(target, '.' + FORMATSWITCH)) {
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
        ([].slice.call(sf.base.selectAll('.' + PALETTES, this.container))).forEach(function (ele) {
            sf.base.detach(ele);
        });
        if (wrapper.classList.contains(SHOWVALUE)) {
            sf.base.detach(sf.base.select('.' + INPUTWRAPPER, this.container));
        }
        this.container.style.width = '';
        var grpEle = sf.base.select('.e-custom-palette', this.container);
        if (this.presetColors) {
            sf.base.remove(grpEle);
        }
        this.createPicker();
        this.getDragHandler().focus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
        this.trigger('onModeSwitch', { element: this.container, mode: 'Picker' });
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
        var tiles = [].slice.call(sf.base.selectAll('.' + TILE, target));
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
        var label = sf.base.select('.e-float-text', target.parentElement).textContent;
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
        if (this.element.nextElementSibling) {
            sf.base.detach(this.element.nextElementSibling);
        }
        if (wrapper) {
            wrapper.parentElement.insertBefore(this.element, wrapper);
            sf.base.detach(wrapper);
        }
        this.container = null;
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
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
            sf.base.EventHandler.remove(dragHandler, 'keydown', this.pickerKeyDown);
            sf.base.EventHandler.remove(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown);
            if (this.modeSwitcher || this.showButtons) {
                sf.base.EventHandler.remove(sf.base.select('.' + CTRLSWITCH, this.container), 'click', this.btnClickHandler);
            }
            sf.base.EventHandler.remove(sf.base.select('.' + PREVIOUS, this.container), 'click', this.previewHandler);
        }
        else {
            sf.base.EventHandler.remove(this.container, 'click', this.paletteClickHandler);
            sf.base.EventHandler.remove(this.container, 'keydown', this.paletteKeyDown);
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
        if (!sf.base.isNullOrUndefined(opacity)) {
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
        if (!sf.base.isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    };
    ColorPicker.prototype.rgbToHex = function (rgb) {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!sf.base.isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    };
    ColorPicker.prototype.hex = function (x) {
        return ('0' + x.toString(16)).slice(-2);
    };
    ColorPicker.prototype.changeModeSwitcherProp = function (prop) {
        var ctrlSwitchWrapper = sf.base.select('.' + CTRLSWITCH, this.container);
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
                    sf.base.detach(sf.base.select('.' + MODESWITCH, ctrlSwitchWrapper));
                }
                else {
                    sf.base.remove(ctrlSwitchWrapper);
                }
            }
        }
    };
    ColorPicker.prototype.changeShowBtnProps = function (prop) {
        var ctrlBtnWrapper = sf.base.select('.' + CTRLSWITCH, this.container);
        if (prop) {
            if (ctrlBtnWrapper) {
                sf.base.remove(ctrlBtnWrapper);
            }
            this.createCtrlBtn();
            if (this.isPicker() && !this.disabled) {
                this.addCtrlSwitchEvent();
            }
        }
        else {
            if (this.modeSwitcher) {
                sf.base.detach(sf.base.select('.' + CTRLBTN, ctrlBtnWrapper));
            }
            else {
                sf.base.remove(ctrlBtnWrapper);
            }
        }
    };
    ColorPicker.prototype.changeValueProp = function (newProp) {
        if (this.isPicker()) {
            this.rgb = this.hexToRgb(newProp);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            this.setHandlerPosition();
            sf.base.detach(sf.base.closest(this.hueSlider.element, '.e-slider-preview'));
            this.createSlider();
            this.setHsvContainerBg();
            this.updateInput(newProp);
            if (this.rgb.length === 4) {
                this.updateOpacityInput(this.rgb[3] * 100);
            }
        }
        else {
            this.removeTileSelection();
            var ele = sf.base.select('span[aria-label="' + this.roundValue(newProp) + '"]', this.container);
            if (ele) {
                this.addTileSelection(ele);
            }
        }
    };
    ColorPicker.prototype.setInputEleProps = function (prop) {
        sf.base.remove(sf.base.select('.' + INPUTWRAPPER, this.container));
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
            sf.base.removeClass([wrapper, popupWrapper], oldProp.split(' '));
        }
        if (newProp) {
            sf.base.addClass([wrapper, popupWrapper], newProp.split(' '));
        }
    };
    ColorPicker.prototype.changeRtlProps = function (newProp) {
        if (newProp) {
            sf.base.addClass([this.getWrapper()], 'e-rtl');
        }
        else {
            sf.base.removeClass([this.getWrapper()], 'e-rtl');
        }
    };
    ColorPicker.prototype.changePaletteProps = function () {
        sf.base.detach(this.container.children[0]);
        this.container.style.width = '';
        this.createPalette();
    };
    ColorPicker.prototype.changeOpacityProps = function (newProp) {
        var wrapper = this.getWrapper();
        if (newProp) {
            sf.base.removeClass([this.container.parentElement], HIDEOPACITY);
            this.createOpacitySlider(sf.base.select('.e-colorpicker-slider', this.container).appendChild(this.createElement('div', { className: 'e-opacity-slider' })));
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                this.appendOpacityValue(sf.base.select('.e-input-container', this.container));
            }
        }
        else {
            sf.base.addClass([this.container.parentElement], HIDEOPACITY);
            this.opacitySlider.destroy();
            sf.base.remove(this.opacitySlider.element);
            this.opacitySlider = null;
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                sf.base.remove(sf.base.select('.' + OPACITY, this.container).parentElement);
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
        if (!sf.base.isNullOrUndefined(newProp.value)) {
            var value = this.roundValue(newProp.value);
            if (value.length === 9) {
                this.element.value = this.roundValue(value).slice(0, 7);
                var preview = this.splitBtn && sf.base.select('.' + SPLITPREVIEW, this.splitBtn.element);
                if (preview) {
                    preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(newProp.value));
                }
            }
            else {
                this.value = oldProp.value;
            }
        }
        if (!this.inline && sf.base.isNullOrUndefined(newProp.inline)) {
            var otherCompModel = ['disabled', 'enableRtl'];
            this.splitBtn.setProperties(sf.splitbuttons.getModel(newProp, otherCompModel));
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
                        sf.base.detach(this_1.element.nextElementSibling);
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
                            var inputWrap = sf.base.select('.' + INPUTWRAPPER, _this.container);
                            if (inputWrap) {
                                sf.base.remove(sf.base.select('.' + INPUTWRAPPER, _this.container));
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
    __decorate([
        sf.base.Property('#008000ff')
    ], ColorPicker.prototype, "value", void 0);
    __decorate([
        sf.base.Property('')
    ], ColorPicker.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], ColorPicker.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property('Picker')
    ], ColorPicker.prototype, "mode", void 0);
    __decorate([
        sf.base.Property(true)
    ], ColorPicker.prototype, "modeSwitcher", void 0);
    __decorate([
        sf.base.Property(null)
    ], ColorPicker.prototype, "presetColors", void 0);
    __decorate([
        sf.base.Property(true)
    ], ColorPicker.prototype, "showButtons", void 0);
    __decorate([
        sf.base.Property(10)
    ], ColorPicker.prototype, "columns", void 0);
    __decorate([
        sf.base.Property(false)
    ], ColorPicker.prototype, "inline", void 0);
    __decorate([
        sf.base.Property(false)
    ], ColorPicker.prototype, "noColor", void 0);
    __decorate([
        sf.base.Property(false)
    ], ColorPicker.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(true)
    ], ColorPicker.prototype, "enableOpacity", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "beforeTileRender", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "beforeClose", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "beforeModeSwitch", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "onModeSwitch", void 0);
    __decorate([
        sf.base.Event()
    ], ColorPicker.prototype, "created", void 0);
    ColorPicker = __decorate([
        sf.base.NotifyPropertyChanges
    ], ColorPicker);
    return ColorPicker;
}(sf.base.Component));

/**
 * ColorPicker modules
 */

exports.ColorPicker = ColorPicker;

return exports;

});

    sf.inputs = sf.base.extend({}, sf.inputs, sfcolorpicker({}));