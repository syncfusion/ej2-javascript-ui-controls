this["ej"] = this["ej"] || {}; this["ej"]["numerictextboxModule"] =
webpackJsonpej__name_Module([7],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(util_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 10:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(183)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, numerictextbox_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(numerictextbox_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, event_handler_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createElement(tagName, properties) {
        var element = document.createElement(tagName);
        if (typeof (properties) === 'undefined') {
            return element;
        }
        element.innerHTML = (properties.innerHTML ? properties.innerHTML : '');
        if (properties.className !== undefined) {
            element.className = properties.className;
        }
        if (properties.id !== undefined) {
            element.id = properties.id;
        }
        if (properties.styles !== undefined) {
            element.setAttribute('style', properties.styles);
        }
        if (properties.attrs !== undefined) {
            attributes(element, properties.attrs);
        }
        return element;
    }
    exports.createElement = createElement;
    function addClass(elements, classes) {
        var classList = getClassList(classes);
        for (var _i = 0, _a = elements; _i < _a.length; _i++) {
            var ele = _a[_i];
            for (var _b = 0, classList_1 = classList; _b < classList_1.length; _b++) {
                var className = classList_1[_b];
                if (!ele.classList.contains(className)) {
                    ele.classList.add(className);
                }
            }
        }
        return elements;
    }
    exports.addClass = addClass;
    function removeClass(elements, classes) {
        var classList = getClassList(classes);
        for (var _i = 0, _a = elements; _i < _a.length; _i++) {
            var ele = _a[_i];
            if (ele.className !== '') {
                for (var _b = 0, classList_2 = classList; _b < classList_2.length; _b++) {
                    var className = classList_2[_b];
                    ele.classList.remove(className);
                }
            }
        }
        return elements;
    }
    exports.removeClass = removeClass;
    function getClassList(classes) {
        var classList = [];
        if (typeof classes === 'string') {
            classList.push(classes);
        }
        else {
            classList = classes;
        }
        return classList;
    }
    function isVisible(element) {
        var ele = element;
        return (ele.style.visibility === '' && ele.offsetWidth > 0);
    }
    exports.isVisible = isVisible;
    function prepend(fromElements, toElement) {
        var docFrag = document.createDocumentFragment();
        for (var _i = 0, _a = fromElements; _i < _a.length; _i++) {
            var ele = _a[_i];
            docFrag.appendChild(ele);
        }
        toElement.insertBefore(docFrag, toElement.firstElementChild);
        return fromElements;
    }
    exports.prepend = prepend;
    function append(fromElements, toElement) {
        var docFrag = document.createDocumentFragment();
        for (var _i = 0, _a = fromElements; _i < _a.length; _i++) {
            var ele = _a[_i];
            docFrag.appendChild(ele);
        }
        toElement.appendChild(docFrag);
        return fromElements;
    }
    exports.append = append;
    function detach(element) {
        var parentNode = element.parentNode;
        return parentNode.removeChild(element);
    }
    exports.detach = detach;
    function remove(element) {
        var parentNode = element.parentNode;
        event_handler_1.EventHandler.clearEvents(element);
        parentNode.removeChild(element);
    }
    exports.remove = remove;
    function attributes(element, attributes) {
        var keys = Object.keys(attributes);
        var ele = element;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    }
    exports.attributes = attributes;
    function select(selector, context) {
        if (context === void 0) { context = document; }
        return context.querySelector(selector);
    }
    exports.select = select;
    function selectAll(selector, context) {
        if (context === void 0) { context = document; }
        var nodeList = context.querySelectorAll(selector);
        return nodeList;
    }
    exports.selectAll = selectAll;
    function closest(element, selector) {
        var el = element;
        if (typeof el.closest === 'function') {
            return el.closest(selector);
        }
        while (el && el.nodeType === 1) {
            if (matches(el, selector)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    }
    exports.closest = closest;
    function siblings(element) {
        var siblings = [];
        var childNodes = Array.prototype.slice.call(element.parentNode.childNodes);
        for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
            var curNode = childNodes_1[_i];
            if (curNode.nodeType === Node.ELEMENT_NODE && element !== curNode) {
                siblings.push(curNode);
            }
        }
        return siblings;
    }
    exports.siblings = siblings;
    function getAttributeOrDefault(element, property, value) {
        var attrVal = element.getAttribute(property);
        if (util_1.isNullOrUndefined(attrVal)) {
            element.setAttribute(property, value.toString());
            attrVal = value;
        }
        return attrVal;
    }
    exports.getAttributeOrDefault = getAttributeOrDefault;
    function setStyleAttribute(element, attrs) {
        if (attrs !== undefined) {
            Object.keys(attrs).forEach(function (key) {
                element.style[key] = attrs[key];
            });
        }
    }
    exports.setStyleAttribute = setStyleAttribute;
    function classList(element, addClasses, removeClasses) {
        addClass([element], addClasses);
        removeClass([element], removeClasses);
    }
    exports.classList = classList;
    function matches(element, selector) {
        var matches = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
        if (matches) {
            return matches.call(element, selector);
        }
        else {
            return [].indexOf.call(document.querySelectorAll(selector), element) !== -1;
        }
    }
    exports.matches = matches;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CLASSNAMES = {
        RTL: 'e-rtl',
        DISABLE: 'e-disabled',
        INPUT: 'e-input',
        INPUTGROUP: 'e-input-group',
        FLOATINPUT: 'e-float-input',
        FLOATLINE: 'e-float-line',
        FLOATTEXT: 'e-float-text',
        INPUTCUSTOMTAG: 'e-input-custom-tag',
        FLOATCUSTOMTAG: 'e-float-custom-tag'
    };
    var Input;
    (function (Input) {
        function createInput(args) {
            var inputObject = {
                container: null,
                buttons: []
            };
            if (util_1.isNullOrUndefined(args.isFloat) || !args.isFloat) {
                inputObject.container = createInputContainer(args, CLASSNAMES.INPUTGROUP, CLASSNAMES.INPUTCUSTOMTAG, 'span');
                args.element.addEventListener('focus', function () {
                    var parent = (this.parentNode);
                    if (parent.classList.contains('e-input-group')) {
                        parent.classList.add('e-input-focus');
                    }
                });
                args.element.addEventListener('blur', function () {
                    var parent = (this.parentNode);
                    if (parent.classList.contains('e-input-group')) {
                        parent.classList.remove('e-input-focus');
                    }
                });
                args.element.parentNode.insertBefore(inputObject.container, args.element);
                dom_1.addClass([args.element], CLASSNAMES.INPUT);
                inputObject.container.appendChild(args.element);
            }
            else {
                var inputElement = void 0;
                var floatLinelement = void 0;
                var floatLabelElement = void 0;
                args.element.addEventListener('focus', function () {
                    var parent = (this.parentNode);
                    parent.getElementsByClassName('e-float-text')[0].classList.add('e-label-top');
                });
                args.element.addEventListener('blur', function () {
                    var parent = (this.parentNode);
                    if (parent.getElementsByTagName('input')[0].value === '') {
                        parent.getElementsByClassName('e-float-text')[0].classList.remove('e-label-top');
                    }
                });
                inputObject.container = createInputContainer(args, CLASSNAMES.FLOATINPUT, CLASSNAMES.FLOATCUSTOMTAG, 'div');
                args.element.parentNode.insertBefore(inputObject.container, args.element);
                dom_1.attributes(args.element, { 'required': 'true' });
                floatLinelement = dom_1.createElement('span', { className: CLASSNAMES.FLOATLINE });
                floatLabelElement = dom_1.createElement('label', { className: CLASSNAMES.FLOATTEXT });
                if (!util_1.isNullOrUndefined(args.element.id) && args.element.id !== '') {
                    var labelId = void 0;
                    labelId = 'label_' + args.element.id;
                    floatLabelElement.id = labelId.replace(/ /g, '_');
                    dom_1.attributes(args.element, { 'aria-labelledby': floatLabelElement.id });
                }
                if (!util_1.isNullOrUndefined(args.element.placeholder) && args.element.placeholder !== '') {
                    floatLabelElement.innerHTML = args.element.placeholder;
                    args.element.removeAttribute('placeholder');
                }
                if (!util_1.isNullOrUndefined(args.properties) && !util_1.isNullOrUndefined(args.properties.placeholder) &&
                    args.properties.placeholder !== '') {
                    floatLabelElement.innerHTML = args.properties.placeholder;
                }
                inputObject.container.appendChild(args.element);
                inputObject.container.appendChild(floatLinelement);
                inputObject.container.appendChild(floatLabelElement);
            }
            if (!util_1.isNullOrUndefined(args.buttons)) {
                for (var i = 0; i < args.buttons.length; i++) {
                    inputObject.buttons.push(appendSpan(args.buttons[i], inputObject.container));
                }
            }
            if (!util_1.isNullOrUndefined(args.properties)) {
                for (var _i = 0, _a = Object.keys(args.properties); _i < _a.length; _i++) {
                    var prop = _a[_i];
                    switch (prop) {
                        case 'cssClass':
                            setCssClass(args.properties.cssClass, [inputObject.container]);
                            break;
                        case 'enabled':
                            setEnabled(args.properties.enabled, args.element);
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
        Input.createInput = createInput;
        function createInputContainer(args, className, tagClass, tag) {
            var container;
            if (!util_1.isNullOrUndefined(args.customTag)) {
                container = dom_1.createElement(args.customTag, { className: className });
                container.classList.add(tagClass);
            }
            else {
                container = dom_1.createElement(tag, { className: className });
            }
            return container;
        }
        function setCssClass(cssClass, elements, oldClass) {
            if (!util_1.isNullOrUndefined(oldClass) && oldClass !== '') {
                dom_1.removeClass(elements, oldClass);
            }
            if (!util_1.isNullOrUndefined(cssClass) && cssClass !== '') {
                dom_1.addClass(elements, cssClass);
            }
        }
        Input.setCssClass = setCssClass;
        function setPlaceholder(placeholder, element) {
            var parentElement;
            parentElement = element.parentNode;
            if (parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
                if (!util_1.isNullOrUndefined(placeholder) && placeholder !== '') {
                    parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = placeholder;
                }
            }
            else {
                if (!util_1.isNullOrUndefined(placeholder) && placeholder !== '') {
                    dom_1.attributes(element, { 'placeholder': placeholder, 'aria-placeholder': placeholder });
                }
                else {
                    element.removeAttribute('placeholder');
                    element.removeAttribute('aria-placeholder');
                }
            }
        }
        Input.setPlaceholder = setPlaceholder;
        function setReadonly(isReadonly, element) {
            if (isReadonly) {
                dom_1.attributes(element, { readonly: '' });
            }
            else {
                element.removeAttribute('readonly');
            }
        }
        Input.setReadonly = setReadonly;
        function setEnableRtl(isRtl, elements) {
            if (isRtl) {
                dom_1.addClass(elements, CLASSNAMES.RTL);
            }
            else {
                dom_1.removeClass(elements, CLASSNAMES.RTL);
            }
        }
        Input.setEnableRtl = setEnableRtl;
        function setEnabled(isEnable, element) {
            var disabledAttrs = { 'disabled': 'disabled', 'aria-disabled': 'true' };
            if (isEnable) {
                element.classList.remove(CLASSNAMES.DISABLE);
                removeAttributes(disabledAttrs, element);
            }
            else {
                element.classList.add(CLASSNAMES.DISABLE);
                addAttributes(disabledAttrs, element);
            }
        }
        Input.setEnabled = setEnabled;
        function removeAttributes(attrs, element) {
            for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
                var key = _a[_i];
                var parentElement = void 0;
                parentElement = element.parentNode;
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
        function addAttributes(attrs, element) {
            for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
                var key = _a[_i];
                var parentElement = void 0;
                parentElement = element.parentNode;
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
        function appendSpan(iconClass, container) {
            var button = dom_1.createElement('span', { className: iconClass });
            container.appendChild(button);
            if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
                container.classList.add(CLASSNAMES.INPUTGROUP);
            }
            button.addEventListener('mousedown', function () {
                this.classList.add('e-input-btn-ripple');
            });
            button.addEventListener('mouseup', function () {
                var ele = this;
                setTimeout(function () { ele.classList.remove('e-input-btn-ripple'); }, 500);
            });
            return button;
        }
        Input.appendSpan = appendSpan;
    })(Input = exports.Input || (exports.Input = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(184)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, numerictextbox_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(numerictextbox_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(182)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, ej2_base_2, dom_1, util_1, ej2_base_3, input_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ROOT = 'e-numeric';
    var SPINICON = 'e-input-group-icon';
    var SPINUP = 'e-spin-up';
    var SPINDOWN = 'e-spin-down';
    var ERROR = 'e-error';
    var INCREMENT = 'increment';
    var DECREMENT = 'decrement';
    var INTREGEXP = new RegExp('/^(-)?(\d*)$/');
    var DECIMALSEPARATOR = '.';
    var NumericTextBox = (function (_super) {
        __extends(NumericTextBox, _super);
        function NumericTextBox(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.decimalSeparator = '.';
            _this.intRegExp = new RegExp('/^(-)?(\d*)$/');
            _this.isCalled = false;
            return _this;
        }
        NumericTextBox.prototype.preRender = function () {
            var ejInstance = util_1.getValue('ej2_instances', this.element);
            this.cloneElement = this.element.cloneNode(true);
            this.angularTagName = null;
            if (this.element.tagName === 'EJ-NUMERICTEXTBOX') {
                this.angularTagName = this.element.tagName;
                var input = dom_1.createElement('input');
                var index = 0;
                for (index; index < this.element.attributes.length; index++) {
                    input.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    input.innerHTML = this.element.innerHTML;
                }
                this.element.parentNode.appendChild(input);
                this.element.parentNode.removeChild(this.element);
                this.element = input;
                util_1.setValue('ej2_instances', ejInstance, this.element);
            }
            dom_1.attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
            var localeText = { incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: '' };
            this.l10n = new ej2_base_1.L10n('numerictextbox', localeText, this.locale);
            this.isValidState = true;
            this.inputStyle = null;
            this.inputName = null;
            this.cultureInfo = {};
            this.initCultureInfo();
            this.initCultureFunc();
            this.checkAttributes();
            this.prevValue = this.value;
            this.validateMinMax();
            this.validateStep();
            if (this.placeholder === null) {
                this.updatePlaceholder();
            }
        };
        NumericTextBox.prototype.render = function () {
            if (this.element.tagName.toLowerCase() === 'input') {
                this.createWrapper();
                if (this.showSpinButton) {
                    this.spinBtnCreation();
                }
                this.setDimension();
                this.changeValue(this.value);
                this.wireEvents();
                if (this.value !== null && !isNaN(this.value)) {
                    if (this.decimals) {
                        this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                    }
                }
            }
        };
        NumericTextBox.prototype.checkAttributes = function () {
            var attributes = ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name'];
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var prop = attributes_1[_i];
                if (!util_1.isNullOrUndefined(this.element.getAttribute(prop))) {
                    switch (prop) {
                        case 'disabled':
                            var enabled = this.element.getAttribute(prop) === 'disabled' ||
                                this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, true);
                            break;
                        case 'readonly':
                            var readonly = this.element.getAttribute(prop) === 'readonly'
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, true);
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
                                this.setProperties(util_1.setValue(prop, value, {}), true);
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
            this.instance = new ej2_base_3.Internationalization(this.locale);
        };
        NumericTextBox.prototype.initCultureInfo = function () {
            this.cultureInfo.format = this.format;
            if (util_1.getValue('currency', this) !== null) {
                util_1.setValue('currency', this.currency, this.cultureInfo);
            }
        };
        NumericTextBox.prototype.createWrapper = function () {
            var inputObj = input_1.Input.createInput({
                element: this.element,
                customTag: this.angularTagName,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: this.cssClass,
                    enableRtl: this.enableRtl,
                    enabled: this.enabled
                }
            });
            this.container = inputObj.container;
            dom_1.addClass([this.container], ROOT);
            if (this.readonly) {
                dom_1.attributes(this.element, { 'aria-readonly': 'true' });
            }
            this.hiddenInput = (dom_1.createElement('input', { attrs: { type: 'hidden' } }));
            this.inputName = this.inputName !== null ? this.inputName : this.element.id;
            this.element.removeAttribute('name');
            if (!util_1.isUndefined(this.inputName)) {
                dom_1.attributes(this.hiddenInput, { 'name': this.inputName });
            }
            this.container.insertBefore(this.hiddenInput, this.element);
            if (this.inputStyle !== null) {
                dom_1.attributes(this.container, { 'style': this.inputStyle });
            }
        };
        NumericTextBox.prototype.spinBtnCreation = function () {
            this.spinDown = input_1.Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container);
            dom_1.attributes(this.spinDown, { 'title': this.l10n.getConstant('decrementTitle'),
                'aria-label': this.l10n.getConstant('decrementTitle') });
            this.spinUp = input_1.Input.appendSpan(SPINICON + ' ' + SPINUP, this.container);
            dom_1.attributes(this.spinUp, { 'title': this.l10n.getConstant('incrementTitle'),
                'aria-label': this.l10n.getConstant('incrementTitle') });
            this.wireSpinBtnEvents();
        };
        NumericTextBox.prototype.setDimension = function () {
            this.setWidth(this.width);
            this.setHeight(this.height);
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
            dom_1.attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
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
        NumericTextBox.prototype.action = function (operation) {
            var value = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
            this.changeValue(this.performAction(value, this.step, operation));
            this.raiseChangeEvent();
        };
        NumericTextBox.prototype.checkErrorClass = function () {
            if (this.isValidState) {
                dom_1.removeClass([this.container], ERROR);
            }
            else {
                dom_1.addClass([this.container], ERROR);
            }
            dom_1.attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
        };
        NumericTextBox.prototype.setWidth = function (width) {
            var newWidth = width != null ? width : this.container.offsetWidth;
            dom_1.setStyleAttribute(this.container, { 'width': newWidth });
        };
        NumericTextBox.prototype.setHeight = function (height) {
            var newHeight = height != null ? height : this.container.offsetHeight;
            dom_1.setStyleAttribute(this.container, { 'height': newHeight });
        };
        NumericTextBox.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.element, 'focus', this.focusIn, this);
            ej2_base_1.EventHandler.add(this.element, 'blur', this.focusOut, this);
            ej2_base_1.EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
            ej2_base_1.EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
            ej2_base_1.EventHandler.add(this.element, 'change', this.changeHandler, this);
            ej2_base_1.EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        };
        NumericTextBox.prototype.wireSpinBtnEvents = function () {
            ej2_base_1.EventHandler.add(this.spinUp, ej2_base_1.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
            ej2_base_1.EventHandler.add(this.spinDown, ej2_base_1.Browser.touchStartEvent, this.mouseDownOnSpinner, this);
            ej2_base_1.EventHandler.add(this.spinUp, ej2_base_1.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
            ej2_base_1.EventHandler.add(this.spinDown, ej2_base_1.Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        };
        NumericTextBox.prototype.unwireEvents = function () {
            ej2_base_1.EventHandler.remove(this.element, 'focus', this.focusIn);
            ej2_base_1.EventHandler.remove(this.element, 'blur', this.focusOut);
            ej2_base_1.EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
            ej2_base_1.EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
            ej2_base_1.EventHandler.remove(this.element, 'change', this.changeHandler);
            ej2_base_1.EventHandler.remove(this.element, 'paste', this.pasteHandler);
        };
        NumericTextBox.prototype.unwireSpinBtnEvents = function () {
            ej2_base_1.EventHandler.remove(this.spinUp, ej2_base_1.Browser.touchStartEvent, this.mouseDownOnSpinner);
            ej2_base_1.EventHandler.remove(this.spinDown, ej2_base_1.Browser.touchStartEvent, this.mouseDownOnSpinner);
            ej2_base_1.EventHandler.remove(this.spinUp, ej2_base_1.Browser.touchEndEvent, this.mouseUpOnSpinner);
            ej2_base_1.EventHandler.remove(this.spinDown, ej2_base_1.Browser.touchEndEvent, this.mouseUpOnSpinner);
        };
        NumericTextBox.prototype.changeHandler = function (event) {
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
        };
        NumericTextBox.prototype.raiseChangeEvent = function (event) {
            if (this.prevValue !== this.value) {
                var eventArgs = {};
                this.changeEventArgs = { value: this.value, previousValue: this.prevValue };
                if (event) {
                    this.changeEventArgs.event = event;
                }
                util_1.merge(eventArgs, this.changeEventArgs);
                this.prevValue = this.value;
                this.trigger('change', eventArgs);
            }
        };
        NumericTextBox.prototype.pasteHandler = function () {
            var _this = this;
            var beforeUpdate = this.element.value;
            setTimeout(function () {
                if (!_this.numericRegex().test(_this.element.value)) {
                    _this.element.value = beforeUpdate;
                }
            });
        };
        NumericTextBox.prototype.keyDownHandler = function (event) {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.action(INCREMENT);
                    break;
                case 40:
                    event.preventDefault();
                    this.action(DECREMENT);
                    break;
                default: break;
            }
        };
        ;
        NumericTextBox.prototype.performAction = function (value, step, operation) {
            if (value === null || isNaN(value)) {
                value = 0;
            }
            var updatedValue = operation === INCREMENT ? value + step : value - step;
            updatedValue = this.correctRounding(value, step, updatedValue);
            return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
        };
        ;
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
        ;
        NumericTextBox.prototype.roundValue = function (result, precision) {
            precision = precision || 0;
            var divide = Math.pow(10, precision);
            return result *= divide, result = Math.round(result) / divide;
        };
        ;
        NumericTextBox.prototype.updateValue = function (value, event) {
            if (value !== null && !isNaN(value)) {
                if (this.decimals) {
                    value = this.roundNumber(value, this.decimals);
                }
            }
            this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
            this.raiseChangeEvent(event);
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
        ;
        NumericTextBox.prototype.modifyText = function () {
            if (this.value || this.value === 0) {
                var value = this.formatNumber();
                this.element.value = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
                dom_1.attributes(this.element, { 'aria-valuenow': value });
                this.hiddenInput.value = value;
            }
            else {
                this.element.value = '';
                this.element.removeAttribute('aria-valuenow');
                this.hiddenInput.value = null;
            }
        };
        ;
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
        ;
        NumericTextBox.prototype.trimValue = function (value) {
            if (value > this.max) {
                return this.max;
            }
            if (value < this.min) {
                return this.min;
            }
            return value;
        };
        ;
        NumericTextBox.prototype.roundNumber = function (value, precision) {
            var result = value;
            var decimals = precision || 0;
            var result1 = result.toString().split('e');
            result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
            var result2 = result.toString().split('e');
            result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
            return Number(result.toFixed(decimals));
        };
        ;
        NumericTextBox.prototype.cancelEvent = function (event) {
            event.preventDefault();
            return false;
        };
        NumericTextBox.prototype.keyPressHandler = function (event) {
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
        ;
        NumericTextBox.prototype.numericRegex = function () {
            var numericObject = ej2_base_3.getNumericObject(this.locale);
            var decimalSeparator = util_1.getValue('decimal', numericObject);
            var fractionRule = '*';
            if (decimalSeparator === DECIMALSEPARATOR) {
                decimalSeparator = '\\' + decimalSeparator;
            }
            if (this.decimals === 0) {
                return INTREGEXP;
            }
            if (this.decimals && this.validateDecimalOnType) {
                fractionRule = '{0,' + this.decimals + '}';
            }
            return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
                ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
        };
        ;
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
                this.action(INCREMENT);
            }
            else if (delta < 0) {
                this.action(DECREMENT);
            }
            this.cancelEvent(event);
        };
        NumericTextBox.prototype.focusIn = function (event) {
            if (!this.enabled || this.readonly) {
                return;
            }
            this.isFocused = true;
            dom_1.removeClass([this.container], ERROR);
            this.prevValue = this.value;
            if ((this.value || this.value === 0)) {
                var formatValue = this.formatNumber();
                this.element.value = formatValue;
                this.element.setSelectionRange(formatValue.length, formatValue.length);
            }
            if (!ej2_base_1.Browser.isDevice) {
                ej2_base_1.EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
            }
        };
        ;
        NumericTextBox.prototype.focusOut = function (event) {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            var parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!ej2_base_1.Browser.isDevice) {
                ej2_base_1.EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        };
        ;
        NumericTextBox.prototype.mouseDownOnSpinner = function (event) {
            var _this = this;
            if (!this.getElementData(event)) {
                return;
            }
            var result = this.getElementData(event);
            var target = event.currentTarget;
            var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
            ej2_base_1.EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
            this.timeOut = setInterval(function () { _this.isCalled = true; _this.action(action); }, 150);
            ej2_base_1.EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
        };
        NumericTextBox.prototype.mouseUpOnSpinner = function (event) {
            if (!ej2_base_1.Browser.isDevice) {
                event.preventDefault();
            }
            if (!this.getElementData(event)) {
                return;
            }
            var target = event.currentTarget;
            var action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
            ej2_base_1.EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
            if (!this.isCalled) {
                this.action(action);
            }
            this.isCalled = false;
            ej2_base_1.EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        };
        NumericTextBox.prototype.getElementData = function (event) {
            if ((event.which && event.which === 3) || (event.button && event.button === 2)
                || !this.enabled || this.readonly) {
                return false;
            }
            clearInterval(this.timeOut);
            return true;
        };
        NumericTextBox.prototype.mouseUpClick = function (event) {
            event.stopPropagation();
            clearInterval(this.timeOut);
            this.isCalled = false;
            ej2_base_1.EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
            ej2_base_1.EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
        };
        NumericTextBox.prototype.increment = function (step) {
            if (step === void 0) { step = this.step; }
            this.changeValue(this.performAction(this.value, step, INCREMENT));
        };
        NumericTextBox.prototype.decrement = function (step) {
            if (step === void 0) { step = this.step; }
            this.changeValue(this.performAction(this.value, step, DECREMENT));
        };
        NumericTextBox.prototype.destroy = function () {
            this.unwireEvents();
            dom_1.detach(this.hiddenInput);
            if (this.showSpinButton) {
                this.unwireSpinBtnEvents();
                dom_1.detach(this.spinUp);
                dom_1.detach(this.spinDown);
            }
            this.container.parentElement.appendChild(this.cloneElement);
            dom_1.detach(this.container);
            _super.prototype.destroy.call(this);
        };
        NumericTextBox.prototype.getText = function () {
            return this.element.value;
        };
        NumericTextBox.prototype.getPersistData = function () {
            var keyEntity = ['value'];
            return this.addOnPersist(keyEntity);
        };
        NumericTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
            var elementVal;
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'width':
                        dom_1.setStyleAttribute(this.container, { 'width': newProp.width });
                        break;
                    case 'height':
                        dom_1.setStyleAttribute(this.container, { 'height': newProp.height });
                        break;
                    case 'cssClass':
                        input_1.Input.setCssClass(newProp.cssClass, [this.container], oldProp.cssClass);
                        break;
                    case 'enabled':
                        input_1.Input.setEnabled(newProp.enabled, this.element);
                        break;
                    case 'enableRtl':
                        input_1.Input.setEnableRtl(newProp.enableRtl, [this.container]);
                        break;
                    case 'readonly':
                        input_1.Input.setReadonly(newProp.readonly, this.element);
                        if (this.readonly) {
                            dom_1.attributes(this.element, { 'aria-readonly': 'true' });
                        }
                        else {
                            this.element.removeAttribute('aria-readonly');
                        }
                        break;
                    case 'placeholder':
                        input_1.Input.setPlaceholder(newProp.placeholder, this.element);
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
                            dom_1.detach(this.spinUp);
                            dom_1.detach(this.spinDown);
                        }
                        break;
                    case 'value':
                        this.updateValue(newProp.value);
                        break;
                    case 'min':
                    case 'max':
                        util_1.setValue(prop, util_1.getValue(prop, newProp), this);
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
                        this.updatePlaceholder();
                        input_1.Input.setPlaceholder(this.placeholder, this.element);
                        this.updateValue(this.value);
                        break;
                    case 'currency':
                        util_1.setValue(prop, util_1.getValue(prop, newProp), this.cultureInfo);
                        this.updateValue(this.value);
                        break;
                    case 'format':
                        util_1.setValue(prop, util_1.getValue(prop, newProp), this);
                        this.initCultureInfo();
                        this.updateValue(this.value);
                        break;
                    case 'decimals':
                        this.decimals = newProp.decimals;
                        this.updateValue(this.value);
                }
            }
        };
        NumericTextBox.prototype.getModuleName = function () {
            return 'numerictextbox';
        };
        return NumericTextBox;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_1.Property('')
    ], NumericTextBox.prototype, "cssClass", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "value", void 0);
    __decorate([
        ej2_base_1.Property(-(Number.MAX_VALUE))
    ], NumericTextBox.prototype, "min", void 0);
    __decorate([
        ej2_base_1.Property(Number.MAX_VALUE)
    ], NumericTextBox.prototype, "max", void 0);
    __decorate([
        ej2_base_1.Property(1)
    ], NumericTextBox.prototype, "step", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "width", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "height", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "placeholder", void 0);
    __decorate([
        ej2_base_1.Property(true)
    ], NumericTextBox.prototype, "showSpinButton", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], NumericTextBox.prototype, "readonly", void 0);
    __decorate([
        ej2_base_1.Property(true)
    ], NumericTextBox.prototype, "enabled", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], NumericTextBox.prototype, "enableRtl", void 0);
    __decorate([
        ej2_base_1.Property('n2')
    ], NumericTextBox.prototype, "format", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "decimals", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], NumericTextBox.prototype, "currency", void 0);
    __decorate([
        ej2_base_1.Property(true)
    ], NumericTextBox.prototype, "strictMode", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], NumericTextBox.prototype, "validateDecimalOnType", void 0);
    __decorate([
        ej2_base_1.Event()
    ], NumericTextBox.prototype, "created", void 0);
    __decorate([
        ej2_base_1.Event()
    ], NumericTextBox.prototype, "destroyed", void 0);
    __decorate([
        ej2_base_1.Event()
    ], NumericTextBox.prototype, "change", void 0);
    NumericTextBox = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], NumericTextBox);
    exports.NumericTextBox = NumericTextBox;
    exports.numerictextboxHelper = ej2_base_1.CreateBuilder(NumericTextBox);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(100)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, numerictextbox_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(numerictextbox_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(dom_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var instances = 'ej2_instances';
    var uid = 0;
    function createInstance(classFunction, params) {
        var arrayParam = params;
        arrayParam.unshift(undefined);
        return new (Function.prototype.bind.apply(classFunction, arrayParam));
    }
    exports.createInstance = createInstance;
    function setImmediate(handler) {
        var unbind;
        var num = new Uint16Array(5);
        var intCrypto = window.msCrypto || window.crypto;
        intCrypto.getRandomValues(num);
        var secret = 'ej2' + combineArray(num);
        var messageHandler = function (event) {
            if (event.source === window && typeof event.data === 'string' && event.data.length <= 32 && event.data === secret) {
                handler();
                unbind();
            }
        };
        window.addEventListener('message', messageHandler, false);
        window.postMessage(secret, '*');
        return unbind = function () {
            window.removeEventListener('message', messageHandler);
        };
    }
    exports.setImmediate = setImmediate;
    function getValue(nameSpace, obj) {
        var value = obj;
        var splits = nameSpace.split('.');
        for (var i = 0; i < splits.length && !isUndefined(value); i++) {
            value = value[splits[i]];
        }
        return value;
    }
    exports.getValue = getValue;
    function setValue(nameSpace, value, obj) {
        var keys = nameSpace.split('.');
        var start = obj || {};
        var fromObj = start;
        var i;
        var length = keys.length;
        var key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            if (i + 1 === length) {
                fromObj[key] = value === undefined ? {} : value;
            }
            else if (isNullOrUndefined(fromObj[key])) {
                fromObj[key] = {};
            }
            fromObj = fromObj[key];
        }
        return start;
    }
    exports.setValue = setValue;
    function deleteObject(obj, key) {
        delete obj[key];
    }
    exports.deleteObject = deleteObject;
    function isObject(obj) {
        var objCon = {};
        return (!isNullOrUndefined(obj) && obj.constructor === objCon.constructor);
    }
    exports.isObject = isObject;
    function getEnumValue(enumObject, enumValue) {
        return enumObject[enumValue];
    }
    exports.getEnumValue = getEnumValue;
    function merge(source, destination) {
        if (!isNullOrUndefined(destination)) {
            var temrObj = source;
            var tempProp = destination;
            var keys = Object.keys(destination);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                temrObj[key] = tempProp[key];
            }
        }
    }
    exports.merge = merge;
    function extend(copied, first, second, deep) {
        var result = copied || {};
        var length = arguments.length;
        if (deep) {
            length = length - 1;
        }
        var _loop_1 = function (i) {
            if (!arguments_1[i]) {
                return "continue";
            }
            var obj1 = arguments_1[i];
            Object.keys(obj1).forEach(function (key) {
                var src = result[key];
                var copy = obj1[key];
                var clone;
                if (deep && isObject(copy)) {
                    clone = isObject(src) ? src : {};
                    result[key] = extend({}, clone, copy, true);
                }
                else {
                    result[key] = copy;
                }
            });
        };
        var arguments_1 = arguments;
        for (var i = 1; i < length; i++) {
            _loop_1(i);
        }
        return result;
    }
    exports.extend = extend;
    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isUndefined(value) {
        return ('undefined' === typeof value);
    }
    exports.isUndefined = isUndefined;
    function getUniqueID(definedName) {
        return definedName + '_' + uid++;
    }
    exports.getUniqueID = getUniqueID;
    function debounce(eventFunction, delay) {
        var _this = this;
        var out;
        return function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            var args = arg[0];
            var later = function () {
                out = null;
                return eventFunction.call(_this, args);
            };
            clearTimeout(out);
            out = setTimeout(later, delay);
        };
    }
    exports.debounce = debounce;
    function queryParams(data) {
        var array = [];
        var keys = Object.keys(data);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            array.push(encodeURIComponent(key) + '=' + encodeURIComponent('' + data[key]));
        }
        return array.join('&');
    }
    exports.queryParams = queryParams;
    function isObjectArray(value) {
        var parser = Object.prototype.toString;
        if (parser.call(value) === '[object Array]') {
            if (parser.call(value[0]) === '[object Object]') {
                return true;
            }
        }
        return false;
    }
    exports.isObjectArray = isObjectArray;
    function compareElementParent(child, parent) {
        var node = child;
        if (node === parent) {
            return true;
        }
        else if (node === document || !node) {
            return false;
        }
        else {
            return compareElementParent(node.parentNode, parent);
        }
    }
    exports.compareElementParent = compareElementParent;
    function throwError(message) {
        try {
            throw new Error(message);
        }
        catch (e) {
            throw e.message + '\n' + e.stack;
        }
    }
    exports.throwError = throwError;
    function print(element, printWindow) {
        var div = document.createElement('div');
        var links = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('link, style'));
        var reference = '';
        if (isNullOrUndefined(printWindow)) {
            printWindow = window.open('', 'print', 'height=452,width=1024,tabbar=no');
        }
        div.appendChild(element.cloneNode(true));
        for (var i = 0, len = links.length; i < len; i++) {
            reference += links[i].outerHTML;
        }
        printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
            '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        var interval = setInterval(function () {
            if (printWindow.ready) {
                printWindow.print();
                printWindow.close();
                clearInterval(interval);
            }
        }, 500);
        return printWindow;
    }
    exports.print = print;
    function formatUnit(value) {
        var result = value + '';
        if (result === 'auto' || result.indexOf('%') !== -1 || result.indexOf('px') !== -1) {
            return result;
        }
        return result + 'px';
    }
    exports.formatUnit = formatUnit;
    function getInstance(element, component) {
        var elem = (typeof (element) === 'string') ? document.querySelector(element) : element;
        if (elem[instances]) {
            for (var _i = 0, _a = elem[instances]; _i < _a.length; _i++) {
                var inst = _a[_i];
                if (inst instanceof component) {
                    return inst;
                }
            }
        }
        return null;
    }
    exports.getInstance = getInstance;
    function addInstance(element, instance) {
        var elem = (typeof (element) === 'string') ? document.querySelector(element) : element;
        if (elem[instances]) {
            elem[instances].push(instance);
        }
        else {
            elem[instances] = [instance];
        }
    }
    exports.addInstance = addInstance;
    function combineArray(num) {
        var ret = '';
        for (var i = 0; i < 5; i++) {
            ret += (i ? ',' : '') + num[i];
        }
        return ret;
    }
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate))

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventHandler = (function () {
        function EventHandler() {
        }
        EventHandler.addOrGetEventData = function (element) {
            if ('__eventList' in element) {
                return element.__eventList.events;
            }
            else {
                element.__eventList = {};
                return element.__eventList.events = [];
            }
        };
        EventHandler.add = function (element, eventName, listener, bindTo, intDebounce) {
            var eventData = EventHandler.addOrGetEventData(element);
            var debounceListener;
            if (intDebounce) {
                debounceListener = util_1.debounce(listener, intDebounce);
            }
            else {
                debounceListener = listener;
            }
            if (bindTo) {
                debounceListener = debounceListener.bind(bindTo);
            }
            var event = eventName.split(' ');
            for (var i = 0; i < event.length; i++) {
                eventData.push({
                    name: event[i],
                    listener: listener,
                    debounce: debounceListener
                });
                element.addEventListener(event[i], debounceListener);
            }
        };
        EventHandler.remove = function (element, eventName, listener) {
            var eventData = EventHandler.addOrGetEventData(element);
            var event = eventName.split(' ');
            var _loop_1 = function (j) {
                var index = -1;
                var debounceListener;
                if (eventData && eventData.length !== 0) {
                    eventData.some(function (x, i) {
                        return x.name === event[j] && x.listener.toString() === listener.toString() ?
                            (index = i, debounceListener = x.debounce, true) : false;
                    });
                }
                if (index !== -1) {
                    eventData.splice(index, 1);
                }
                element.removeEventListener(event[j], debounceListener);
            };
            for (var j = 0; j < event.length; j++) {
                _loop_1(j);
            }
        };
        EventHandler.clearEvents = function (element) {
            var eventData;
            var copyData;
            eventData = EventHandler.addOrGetEventData(element);
            copyData = util_1.extend([], copyData, eventData);
            for (var i = 0; i < copyData.length; i++) {
                element.removeEventListener(copyData[i].name, copyData[i].debounce);
                eventData.shift();
            }
        };
        EventHandler.trigger = function (element, eventName, eventProp) {
            var eventData = EventHandler.addOrGetEventData(element);
            var fn = null;
            for (var _i = 0, eventData_1 = eventData; _i < eventData_1.length; _i++) {
                var event_1 = eventData_1[_i];
                if (event_1.name === eventName) {
                    event_1.debounce.call(this, eventProp);
                }
            }
        };
        return EventHandler;
    }());
    exports.EventHandler = EventHandler;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(7)))

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(8);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ })

},[194]);