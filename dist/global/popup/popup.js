this["ej"] = this["ej"] || {}; this["ej"]["popupModule"] =
webpackJsonpej__name_Module([3],{

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

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(55)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_popups_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(ej2_popups_1);
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

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, event_handler_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(event_handler_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getObject(instance, curKey, defaultValue, type) {
        if (!instance.properties.hasOwnProperty(curKey)) {
            instance.properties[curKey] = util_1.createInstance(type, [instance, curKey, defaultValue]);
        }
        return instance.properties[curKey];
    }
    function getObjectArray(instance, curKey, defaultValue, type, isSetter) {
        var result = [];
        var len = defaultValue.length;
        for (var i = 0; i < len; i++) {
            if (isSetter) {
                var inst = util_1.createInstance(type, [instance, curKey, {}, true]);
                inst.setProperties(defaultValue[i], true);
                result.push(inst);
            }
            else {
                result.push(util_1.createInstance(type, [instance, curKey, defaultValue[i], true]));
            }
        }
        return result;
    }
    function propertyGetter(defaultValue, curKey) {
        return function () {
            if (!this.properties.hasOwnProperty(curKey)) {
                this.properties[curKey] = defaultValue;
            }
            return this.properties[curKey];
        };
    }
    function propertySetter(defaultValue, curKey) {
        return function (newValue) {
            if (this.properties[curKey] !== newValue) {
                var oldVal = this.properties.hasOwnProperty(curKey) ? this.properties[curKey] : defaultValue;
                this.saveChanges(curKey, newValue, oldVal);
                this.properties[curKey] = newValue;
            }
        };
    }
    function complexGetter(defaultValue, curKey, type) {
        return function () {
            return getObject(this, curKey, defaultValue, type);
        };
    }
    function complexSetter(defaultValue, curKey, type) {
        return function (newValue) {
            getObject(this, curKey, defaultValue, type).setProperties(newValue);
        };
    }
    function complexArrayGetter(defaultValue, curKey, type) {
        return function () {
            if (!this.properties.hasOwnProperty(curKey)) {
                var defCollection = getObjectArray(this, curKey, defaultValue, type);
                this.properties[curKey] = defCollection;
            }
            return this.properties[curKey];
        };
    }
    function complexArraySetter(defaultValue, curKey, type) {
        return function (newValue) {
            var oldValueCollection = getObjectArray(this, curKey, defaultValue, type);
            var newValCollection = getObjectArray(this, curKey, newValue, type, true);
            this.saveChanges(curKey, newValCollection, oldValueCollection);
            this.properties[curKey] = newValCollection;
        };
    }
    function Property(defaultValue) {
        return function (target, key) {
            var propertyDescriptor = {
                set: propertySetter(defaultValue, key),
                get: propertyGetter(defaultValue, key),
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(target, key, propertyDescriptor);
            addPropertyCollection(target, key, 'prop', defaultValue);
        };
    }
    exports.Property = Property;
    function Complex(defaultValue, type) {
        return function (target, key) {
            var propertyDescriptor = {
                set: complexSetter(defaultValue, key, type),
                get: complexGetter(defaultValue, key, type),
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(target, key, propertyDescriptor);
            addPropertyCollection(target, key, 'complexProp', defaultValue, type);
        };
    }
    exports.Complex = Complex;
    function Collection(defaultValue, type) {
        return function (target, key) {
            var propertyDescriptor = {
                set: complexArraySetter(defaultValue, key, type),
                get: complexArrayGetter(defaultValue, key, type),
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(target, key, propertyDescriptor);
            addPropertyCollection(target, key, 'colProp', defaultValue, type);
        };
    }
    exports.Collection = Collection;
    function Event() {
        return function (target, key) {
            var eventDescriptor = {
                set: function (newValue) {
                    var oldValue = this.properties[key];
                    if (oldValue !== newValue) {
                        var finalContext = getParentContext(this, key);
                        if (util_1.isUndefined(oldValue) === false) {
                            finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                        }
                        finalContext.context.addEventListener(finalContext.prefix, newValue);
                        this.properties[key] = newValue;
                    }
                },
                get: propertyGetter(undefined, key),
                enumerable: true,
                configurable: true
            };
            Object.defineProperty(target, key, eventDescriptor);
            addPropertyCollection(target, key, 'event');
        };
    }
    exports.Event = Event;
    function NotifyPropertyChanges(classConstructor) {
    }
    exports.NotifyPropertyChanges = NotifyPropertyChanges;
    function addPropertyCollection(target, key, propertyType, defaultValue, type) {
        if (util_1.isUndefined(target.propList)) {
            target.propList = {
                props: [],
                complexProps: [],
                colProps: [],
                events: [],
                propNames: [],
                complexPropNames: [],
                colPropNames: [],
                eventNames: []
            };
        }
        target.propList[propertyType + 's'].push({
            propertyName: key,
            defaultValue: defaultValue,
            type: type
        });
        target.propList[propertyType + 'Names'].push(key);
    }
    function getBuilderProperties(component) {
        if (util_1.isUndefined(component.prototype.builderObject)) {
            component.prototype.builderObject = {
                properties: {}, propCollections: [], add: function () {
                    this.isPropertyArray = true;
                    this.propCollections.push(util_1.extend({}, this.properties, {}));
                }
            };
            var rex = /complex/;
            for (var _i = 0, _a = Object.keys(component.prototype.propList); _i < _a.length; _i++) {
                var key = _a[_i];
                var _loop_1 = function (prop) {
                    if (rex.test(key)) {
                        component.prototype.builderObject[prop.propertyName] = function (value) {
                            var childType = {};
                            util_1.merge(childType, getBuilderProperties(prop.type));
                            value(childType);
                            var tempValue;
                            if (!childType.isPropertyArray) {
                                tempValue = util_1.extend({}, childType.properties, {});
                            }
                            else {
                                tempValue = childType.propCollections;
                            }
                            this.properties[prop.propertyName] = tempValue;
                            childType.properties = {};
                            childType.propCollections = [];
                            childType.isPropertyArray = false;
                            return this;
                        };
                    }
                    else {
                        component.prototype.builderObject[prop.propertyName] = function (value) {
                            this.properties[prop.propertyName] = value;
                            return this;
                        };
                    }
                };
                for (var _b = 0, _c = component.prototype.propList[key]; _b < _c.length; _b++) {
                    var prop = _c[_b];
                    _loop_1(prop);
                }
            }
        }
        return component.prototype.builderObject;
    }
    function CreateBuilder(component) {
        var builderFunction = function (element) {
            this.element = element;
            return this;
        };
        var instanceFunction = function (element) {
            if (!builderFunction.prototype.hasOwnProperty('create')) {
                builderFunction.prototype = getBuilderProperties(component);
                builderFunction.prototype.create = function () {
                    var temp = util_1.extend({}, {}, this.properties);
                    this.properties = {};
                    return new component(temp, this.element);
                };
            }
            return new builderFunction(element);
        };
        return instanceFunction;
    }
    exports.CreateBuilder = CreateBuilder;
    function getParentContext(context, prefix) {
        if (context.hasOwnProperty('parentObj') === false) {
            return { context: context, prefix: prefix };
        }
        else {
            var curText = util_1.getValue('propName', context);
            if (curText) {
                prefix = curText + '-' + prefix;
            }
            return getParentContext(util_1.getValue('parentObj', context), prefix);
        }
    }
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = calculatePosition;
var elementRect;
var element;
var parentDocument;
function calculatePosition(currentElement, positionX, positionY) {
    if (!currentElement) {
        return { left: 0, top: 0 };
    }
    if (!positionX) {
        positionX = 'left';
    }
    if (!positionY) {
        positionY = 'top';
    }
    parentDocument = currentElement.ownerDocument;
    element = currentElement;
    var pos = { left: 0, top: 0 };
    return updatePosition(positionX.toLowerCase(), positionY.toLowerCase(), pos);
}
function setPosx(value, pos) {
    pos.left = value;
}
function setPosy(value, pos) {
    pos.top = value;
}
function updatePosition(posX, posY, pos) {
    elementRect = element.getBoundingClientRect();
    switch (posY + posX) {
        case 'topcenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementTop(), pos);
            break;
        case 'topright':
            setPosx(getElementRight(), pos);
            setPosy(getElementTop(), pos);
            break;
        case 'centercenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'centerright':
            setPosx(getElementRight(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'centerleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'bottomcenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementBottom(), pos);
            break;
        case 'bottomright':
            setPosx(getElementRight(), pos);
            setPosy(getElementBottom(), pos);
            break;
        case 'bottomleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementBottom(), pos);
            break;
        default:
        case 'topleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementTop(), pos);
            break;
    }
    return pos;
}
function getBodyScrollTop() {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
function getBodyScrollLeft() {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
function getElementBottom() {
    return elementRect.bottom + getBodyScrollTop();
}
function getElementVCenter() {
    return getElementTop() + (elementRect.height / 2);
}
function getElementTop() {
    return elementRect.top + getBodyScrollTop();
}
function getElementLeft() {
    return elementRect.left + getBodyScrollLeft();
}
function getElementRight() {
    return elementRect.right + getBodyScrollLeft();
}
function getElementHCenter() {
    return getElementLeft() + (elementRect.width / 2);
}


/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, browser_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(browser_1);
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

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(26)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, notify_property_change_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(notify_property_change_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var REGX_MOBILE = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
    var REGX_IE = /msie|trident/i;
    var REGX_IE11 = /Trident\/7\./;
    var REGX_IOS = /(ipad|iphone|ipod touch)/i;
    var REGX_IOS7 = /(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i;
    var REGX_ANDROID = /android/i;
    var REGX_WINDOWS = /trident|windows phone|edge/i;
    var REGX_VERSION = /(version)[ \/]([\w.]+)/i;
    var REGX_BROWSER = {
        OPERA: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i,
        EDGE: /(edge)(?:.*version|)[ \/]([\w.]+)/i,
        CHROME: /(chrome)[ \/]([\w.]+)/i,
        PANTHOMEJS: /(phantomjs)[ \/]([\w.]+)/i,
        SAFARI: /(safari)[ \/]([\w.]+)/i,
        WEBKIT: /(webkit)[ \/]([\w.]+)/i,
        MSIE: /(msie|trident) ([\w.]+)/i,
        MOZILLA: /(mozilla)(?:.*? rv:([\w.]+)|)/i
    };
    window.browserDetails = window.browserDetails || {};
    var Browser = (function () {
        function Browser() {
        }
        Browser.extractBrowserDetail = function () {
            var browserInfo = { culture: {} };
            var keys = Object.keys(REGX_BROWSER);
            var clientInfo = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                clientInfo = Browser.userAgent.match(REGX_BROWSER[key]);
                if (clientInfo) {
                    browserInfo.name = (clientInfo[1].toLowerCase() === 'opr' ? 'opera' : clientInfo[1].toLowerCase());
                    browserInfo.version = clientInfo[2];
                    browserInfo.culture.name = browserInfo.culture.language = navigator.language;
                    if (!!Browser.userAgent.match(REGX_IE11)) {
                        browserInfo.name = 'msie';
                        break;
                    }
                    if (browserInfo.name === 'safari') {
                        browserInfo.version = Browser.userAgent.match(REGX_VERSION)[2];
                    }
                    break;
                }
            }
            return browserInfo;
        };
        Browser.getEvent = function (event) {
            var events = {
                start: {
                    isPointer: 'pointerdown', isTouch: 'touchstart', isDevice: 'mousedown'
                },
                move: {
                    isPointer: 'pointermove', isTouch: 'touchmove', isDevice: 'mousemove'
                },
                end: {
                    isPointer: 'pointerup', isTouch: 'touchend', isDevice: 'mouseup'
                }
            };
            return (Browser.isPointer ? events[event].isPointer :
                (Browser.isTouch ? events[event].isTouch + (!Browser.isDevice ? ' ' + events[event].isDevice : '')
                    : events[event].isDevice));
        };
        Browser.getTouchStartEvent = function () {
            return Browser.getEvent('start');
        };
        Browser.getTouchEndEvent = function () {
            return Browser.getEvent('end');
        };
        Browser.getTouchMoveEvent = function () {
            return Browser.getEvent('move');
        };
        Browser.getValue = function (key, regX) {
            var browserDetails = window.browserDetails;
            if ('undefined' === typeof browserDetails[key]) {
                return browserDetails[key] = regX.test(Browser.userAgent);
            }
            return browserDetails[key];
        };
        Object.defineProperty(Browser, "userAgent", {
            get: function () {
                return Browser.uA;
            },
            set: function (uA) {
                Browser.uA = uA;
                window.browserDetails = {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "info", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.info)) {
                    return window.browserDetails.info = Browser.extractBrowserDetail();
                }
                return window.browserDetails.info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isIE", {
            get: function () {
                return Browser.getValue('isIE', REGX_IE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isTouch", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.isTouch)) {
                    return window.browserDetails.isTouch = ('ontouchstart' in window);
                }
                return window.browserDetails.isTouch;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isPointer", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.isPointer)) {
                    return window.browserDetails.isPointer = ('pointerEnabled' in window.navigator);
                }
                return window.browserDetails.isPointer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isMSPointer", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.isMSPointer)) {
                    return window.browserDetails.isMSPointer = ('msPointerEnabled' in window.navigator);
                }
                return window.browserDetails.isMSPointer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isDevice", {
            get: function () {
                return Browser.getValue('isDevice', REGX_MOBILE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isIos", {
            get: function () {
                return Browser.getValue('isIos', REGX_IOS);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isIos7", {
            get: function () {
                return Browser.getValue('isIos7', REGX_IOS7);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isAndroid", {
            get: function () {
                return Browser.getValue('isAndroid', REGX_ANDROID);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isWebView", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.isWebView)) {
                    window.browserDetails.isWebView = !(util_1.isUndefined(window.cordova) && util_1.isUndefined(window.PhoneGap)
                        && util_1.isUndefined(window.phonegap) && window.forge !== 'object');
                    return window.browserDetails.isWebView;
                }
                return window.browserDetails.isWebView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "isWindows", {
            get: function () {
                return Browser.getValue('isWindows', REGX_WINDOWS);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "touchStartEvent", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.touchStartEvent)) {
                    return window.browserDetails.touchStartEvent = Browser.getTouchStartEvent();
                }
                return window.browserDetails.touchStartEvent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "touchMoveEvent", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.touchMoveEvent)) {
                    return window.browserDetails.touchMoveEvent = Browser.getTouchMoveEvent();
                }
                return window.browserDetails.touchMoveEvent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Browser, "touchEndEvent", {
            get: function () {
                if (util_1.isUndefined(window.browserDetails.touchEndEvent)) {
                    return window.browserDetails.touchEndEvent = Browser.getTouchEndEvent();
                }
                return window.browserDetails.touchEndEvent;
            },
            enumerable: true,
            configurable: true
        });
        return Browser;
    }());
    Browser.uA = navigator.userAgent;
    exports.Browser = Browser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button__ = __webpack_require__(41);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "buttonBuilder", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["b"]; });



/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return buttonBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__);
var __extends = (this && this.__extends) || (function () {
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



var cssClassName = {
    RTL: 'e-rtl',
    BUTTON: 'e-btn',
    PRIMARY: 'e-primary'
};
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(options, element) {
        return _super.call(this, options, element) || this;
    }
    Button.prototype.preRender = function () {
    };
    Button.prototype.render = function () {
        this.initialize();
    };
    Button.prototype.initialize = function () {
        if (this.cssClass) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], this.cssClass.split(' '));
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
        var ariaAttr = {
            'role': 'button',
            'aria-describedby': this.element.textContent
        };
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["attributes"])(this.element, ariaAttr);
        if (this.disabled) {
            this.controlStatus(this.disabled);
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["ripple"])(this.element, '.' + cssClassName.BUTTON);
        this.wireEvents();
    };
    Button.prototype.controlStatus = function (disabled) {
        this.element.disabled = disabled;
    };
    Button.prototype.setIconCss = function () {
        if (this.iconCss) {
            var span = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('span', { className: 'e-btn-icon ' + this.iconCss });
            var node = this.element.childNodes[0];
            if (node && this.iconPosition === 'left') {
                this.element.insertBefore(span, node);
                span.classList.add('e-icon-left');
            }
            else {
                this.element.appendChild(span);
                if (this.iconPosition === 'right') {
                    span.classList.add('e-icon-right');
                }
            }
        }
    };
    Button.prototype.wireEvents = function () {
        if (this.isToggle) {
            __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["EventHandler"].add(this.element, 'click', this.btnClickHandler, this);
        }
    };
    Button.prototype.unWireEvents = function () {
        if (this.isToggle) {
            __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["EventHandler"].remove(this.element, 'click', this.btnClickHandler);
        }
    };
    Button.prototype.btnClickHandler = function () {
        if (this.element.classList.contains('e-active')) {
            this.element.classList.remove('e-active');
        }
        else {
            this.element.classList.add('e-active');
        }
    };
    Button.prototype.destroy = function () {
        var span;
        var element = this.element;
        _super.prototype.destroy.call(this);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], [cssClassName.PRIMARY, cssClassName.RTL, 'e-success',
            'e-info', 'e-danger', 'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active']);
        ['role', 'aria-describedby', 'e-ripple', 'disabled'].forEach(function (value) {
            element.removeAttribute(value);
        });
        if (this.content) {
            element.innerHTML = element.innerHTML.replace(this.content, '');
        }
        span = element.querySelector('span.e-btn-icon');
        if (span) {
            span.remove();
        }
        this.unWireEvents();
    };
    Button.prototype.getModuleName = function () {
        return 'btn';
    };
    Button.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    Button.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                    this.controlStatus(this.disabled);
                    break;
                case 'iconCss':
                    var span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        span.className = 'e-btn-icon ' + this.iconCss;
                        if (this.element.textContent) {
                            if (this.iconPosition === 'left') {
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
                    span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        span.remove();
                    }
                    this.setIconCss();
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], oldProp.cssClass.split(' '));
                    }
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], newProp.cssClass.split(' '));
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
                    this.element.innerHTML = newProp.content;
                    this.setIconCss();
                    break;
                case 'isToggle':
                    if (newProp.isToggle) {
                        __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["EventHandler"].add(this.element, 'click', this.btnClickHandler, this);
                    }
                    else {
                        __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["EventHandler"].remove(this.element, 'click', this.btnClickHandler);
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], ['e-active']);
                    }
                    break;
            }
        }
    };
    return Button;
}(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Component"]));
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('left')
], Button.prototype, "iconPosition", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Button.prototype, "iconCss", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Button.prototype, "disabled", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Button.prototype, "isPrimary", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Button.prototype, "cssClass", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Button.prototype, "content", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Button.prototype, "isToggle", void 0);
Button = __decorate([
    __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["NotifyPropertyChanges"]
], Button);

var buttonBuilder = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["CreateBuilder"])(Button);


/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button__ = __webpack_require__(40);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__button__["b"]; });



/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Popup; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_browser__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_browser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_browser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_position__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_base_notify_property_change__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_base_notify_property_change___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_base_notify_property_change__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__syncfusion_ej2_base_event_handler__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__syncfusion_ej2_base_event_handler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__syncfusion_ej2_base_event_handler__);
var __extends = (this && this.__extends) || (function () {
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







var CLASSNAMES = {
    ROOT: 'e-popup',
    RTL: 'e-rtl'
};
var Popup = (function (_super) {
    __extends(Popup, _super);
    function Popup(element, options) {
        return _super.call(this, options, element) || this;
    }
    Popup.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, { 'width': __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["formatUnit"])(newProp.width) });
                    break;
                case 'height':
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, { 'height': __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["formatUnit"])(newProp.height) });
                    break;
                case 'zIndex':
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, { 'zIndex': newProp.zIndex });
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'position':
                case 'relateTo':
                    this.setPosition();
                    this.checkCollision();
                    break;
                case 'offsetX':
                    var x = newProp.offsetX - oldProp.offsetX;
                    this.element.style.left = (parseInt(this.element.style.left, 10) + (x)).toString() + 'px';
                    break;
                case 'offsetY':
                    var y = newProp.offsetY - oldProp.offsetY;
                    this.element.style.top = (parseInt(this.element.style.top, 10) + (y)).toString() + 'px';
                    break;
                case 'content':
                    this.setContent();
                    break;
            }
        }
    };
    Popup.prototype.getModuleName = function () {
        return 'popup';
    };
    Popup.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    Popup.prototype.destroy = function () {
        this.element.classList.remove(CLASSNAMES.ROOT, CLASSNAMES.RTL);
        if (__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_browser__["Browser"].isDevice) {
            __WEBPACK_IMPORTED_MODULE_6__syncfusion_ej2_base_event_handler__["EventHandler"].remove(window, 'orientationchange', this.orientationOnChange);
        }
        _super.prototype.destroy.call(this);
    };
    Popup.prototype.render = function () {
        this.element.classList.add(CLASSNAMES.ROOT);
        var styles = {};
        if (this.zIndex !== 1000) {
            styles.zIndex = this.zIndex;
        }
        if (this.width !== 'auto') {
            styles.width = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["formatUnit"])(this.width);
        }
        if (this.height !== 'auto') {
            styles.height = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["formatUnit"])(this.height);
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, styles);
        this.setEnableRtl();
        this.setContent();
        if (__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_browser__["Browser"].isDevice) {
            __WEBPACK_IMPORTED_MODULE_6__syncfusion_ej2_base_event_handler__["EventHandler"].add(window, 'orientationchange', this.orientationOnChange, this);
        }
    };
    Popup.prototype.preRender = function () {
    };
    Popup.prototype.setEnableRtl = function () {
        this.setPosition();
        this.enableRtl ? this.element.classList.add(CLASSNAMES.RTL) : this.element.classList.remove(CLASSNAMES.RTL);
    };
    Popup.prototype.setContent = function () {
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.content)) {
            this.element.innerHTML = '';
            if (typeof (this.content) === 'string') {
                this.element.textContent = this.content;
            }
            else {
                this.element.appendChild(this.content);
            }
        }
    };
    Popup.prototype.orientationOnChange = function () {
        this.setPosition();
        this.trigger('orientationChange');
    };
    Popup.prototype.setPosition = function () {
        var pos;
        var relateToElement = ((typeof this.relateTo) === 'string') ?
            document.querySelector(this.relateTo) : this.relateTo;
        if (typeof this.position.X === 'number' && typeof this.position.Y === 'number') {
            pos = { left: this.position.X, top: this.position.Y };
        }
        else if (relateToElement) {
            var display = this.element.style.display;
            this.element.style.display = 'block';
            pos = this.getAnchorPosition(relateToElement, this.element, this.position, this.offsetX, this.offsetY);
            this.element.style.display = display;
        }
        else {
            pos = { left: 0, top: 0 };
        }
        this.element.style.left = pos.left + 'px';
        this.element.style.top = pos.top + 'px';
    };
    Popup.prototype.getAnchorPosition = function (anchorEle, ele, position, offsetX, offsetY) {
        var eleRect = ele.getBoundingClientRect();
        var anchorRect = anchorEle.getBoundingClientRect();
        var anchor = anchorEle;
        var anchorPos = { left: 0, top: 0 };
        if (ele.offsetParent && ele.offsetParent.tagName === 'BODY' && anchorEle.tagName === 'BODY') {
            anchorPos = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_position__["a" /* calculatePosition */])(anchorEle);
        }
        else {
            while (ele.offsetParent && anchor && ele.offsetParent !== anchor) {
                anchorPos.left += anchor.offsetLeft;
                anchorPos.top += anchor.offsetTop;
                anchor = anchor.offsetParent;
            }
        }
        switch (position.X) {
            default:
            case 'left':
                break;
            case 'center':
                anchorPos.left += (anchorRect.width / 2 - eleRect.width / 2);
                break;
            case 'right':
                anchorPos.left += (anchorRect.width - eleRect.width);
                break;
        }
        switch (position.Y) {
            default:
            case 'top':
                break;
            case 'center':
                anchorPos.top += (anchorRect.height / 2 - eleRect.height / 2);
                break;
            case 'bottom':
                anchorPos.top += (anchorRect.height - eleRect.height);
                break;
        }
        anchorPos.left += offsetX;
        anchorPos.top += offsetY;
        return anchorPos;
    };
    Popup.prototype.checkCollision = function (flip) {
        if (this.relateTo && typeof flip === 'function') {
            flip(this.element, this.relateTo, this.offsetX, this.offsetY, this.position.X, this.position.Y);
        }
    };
    Popup.prototype.show = function (collisionOrAnimationOptions, collision) {
        var _this = this;
        if ((typeof collisionOrAnimationOptions === 'function' && !collision) || typeof collision === 'function') {
            var options = typeof collision === 'function' ? collision : collisionOrAnimationOptions;
            this.checkCollision(options);
        }
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["isNullOrUndefined"])(collisionOrAnimationOptions) && typeof collisionOrAnimationOptions === 'object') {
            collisionOrAnimationOptions.begin = function () {
                if (!_this.isDestroyed) {
                    _this.element.style.display = 'block';
                }
            };
            collisionOrAnimationOptions.end = function () {
                if (!_this.isDestroyed) {
                    _this.trigger('open');
                }
            };
            new __WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Animation"](collisionOrAnimationOptions).animate(this.element);
        }
        else {
            this.element.style.display = 'block';
            this.trigger('open');
        }
    };
    Popup.prototype.hide = function (animationOptions) {
        var _this = this;
        if (animationOptions && typeof animationOptions === 'object') {
            animationOptions.end = function () {
                if (!_this.isDestroyed) {
                    _this.element.style.display = 'none';
                    _this.trigger('close');
                }
            };
            new __WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Animation"](animationOptions).animate(this.element);
        }
        else {
            this.element.style.display = 'none';
            this.trigger('close');
        }
    };
    Popup.prototype.getScrollableParent = function (element) {
        var parentElements = [];
        while (element.parentElement.tagName !== 'HTML') {
            if (element.parentElement.style.overflow !== 'visible') {
                parentElements.push(element.parentElement);
            }
            element = element.parentElement;
        }
        parentElements.push(window);
        return parentElements;
    };
    return Popup;
}(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Component"]));
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])('auto')
], Popup.prototype, "height", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])('auto')
], Popup.prototype, "width", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(null)
], Popup.prototype, "content", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(document.body)
], Popup.prototype, "relateTo", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])({ X: 'left', Y: 'top' })
], Popup.prototype, "position", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(0)
], Popup.prototype, "offsetX", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(0)
], Popup.prototype, "offsetY", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(1000)
], Popup.prototype, "zIndex", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Property"])(false)
], Popup.prototype, "enableRtl", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Event"])()
], Popup.prototype, "open", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Event"])()
], Popup.prototype, "close", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__syncfusion_ej2_base__["Event"])()
], Popup.prototype, "orientationChange", void 0);
Popup = __decorate([
    __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_base_notify_property_change__["NotifyPropertyChanges"]
], Popup);



/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__popup__ = __webpack_require__(70);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Popup", function() { return __WEBPACK_IMPORTED_MODULE_0__popup__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__(67);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "calculatePosition", function() { return __WEBPACK_IMPORTED_MODULE_1__common__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "flip", function() { return __WEBPACK_IMPORTED_MODULE_1__common__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialog__ = __webpack_require__(69);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ButtonProps", function() { return __WEBPACK_IMPORTED_MODULE_2__dialog__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Dialog", function() { return __WEBPACK_IMPORTED_MODULE_2__dialog__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "dialogBuilder", function() { return __WEBPACK_IMPORTED_MODULE_2__dialog__["c"]; });





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

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = flip;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__position__ = __webpack_require__(27);

var parentDocument;
function flip(element, target, offsetX, offsetY, positionX, positionY) {
    if (!target || !element || !positionX || !positionY) {
        return;
    }
    var edge = { eTL: null,
        eTR: null,
        eBL: null,
        eBR: null };
    var elementRect = { elementData: null, targetData: null };
    var eStatus = {
        pTL: null,
        pTR: null,
        pBL: null,
        pBR: null
    };
    var flipAlter = { flipAlter: '' };
    var posStatus = { eflipStatusX: false, eflipStatusY: false };
    var pos = {
        posX: positionX, posY: positionY, offsetX: offsetX, offsetY: offsetY, position: { left: 0, top: 0 }
    };
    parentDocument = target.ownerDocument;
    updateElementData(element, target, edge, pos, elementRect);
    setPosition(eStatus, pos, elementRect);
    validateElementPos(eStatus);
    if (flipValidation(edge, eStatus, flipAlter, posStatus)) {
        applyFlip(target, edge, eStatus, flipAlter, posStatus, pos, elementRect);
    }
    setPopup(element, pos);
}
function updateElementData(element, target, edge, pos, elementRect) {
    elementRect.elementData = { width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height };
    elementRect.targetData = { width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height };
    pos.position = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, pos.posX, pos.posY);
    edge.eTL = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, 'left', 'top');
    edge.eTR = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, 'right', 'top');
    edge.eBR = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, 'left', 'bottom');
    edge.eBL = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, 'right', 'bottom');
}
function setPopup(element, pos) {
    var left = 0;
    var top = 0;
    if (element.offsetParent != null
        && (getComputedStyle(element.offsetParent).position === 'absolute' ||
            getComputedStyle(element.offsetParent).position === 'relative')) {
        var data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(element.offsetParent, 'left', 'top');
        left = data.left;
        top = data.top;
    }
    element.style.top = (pos.position.top + pos.offsetY - (top)) + 'px';
    element.style.left = (pos.position.left + pos.offsetX - (left)) + 'px';
}
function setPosition(eStatus, pos, elementRect) {
    eStatus.pTL = { top: pos.position.top + pos.offsetY, left: pos.position.left + pos.offsetX, affectedBy: '' };
    eStatus.pTR = { top: eStatus.pTL.top, left: eStatus.pTL.left + elementRect.elementData.width, affectedBy: '' };
    eStatus.pBL = { top: eStatus.pTL.top + elementRect.elementData.height,
        left: eStatus.pTL.left, affectedBy: '' };
    eStatus.pBR = { top: eStatus.pTL.top + elementRect.elementData.height,
        left: eStatus.pTL.left + elementRect.elementData.width, affectedBy: '' };
}
function applyFlip(target, edge, eStatus, alter, posStatus, pos, elementRect) {
    var position2 = pos.position;
    var locX1 = pos.offsetX;
    var locY1 = pos.offsetY;
    if (posStatus.eflipStatusX) {
        pos.offsetX = pos.offsetX + elementRect.elementData.width;
        if (alter.flipAlter === 'left') {
            pos.offsetX = -1 * pos.offsetX;
        }
        pos.posX = (pos.posX === 'left') ? 'right' : 'left';
    }
    else {
        pos.offsetY = pos.offsetY + elementRect.elementData.height;
        if (alter.flipAlter === 'top') {
            pos.offsetY = -1 * pos.offsetY;
        }
        pos.posY = (pos.posY === 'top') ? 'bottom' : 'top';
    }
    pos.position = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__position__["a" /* calculatePosition */])(target, pos.posX, pos.posY);
    setPosition(eStatus, pos, elementRect);
    validateElementPos(eStatus);
    if (flipValidation(edge, eStatus, alter, posStatus)) {
        pos.position = position2;
        pos.offsetX = locX1;
        pos.offsetY = locY1;
    }
}
function setElementPosition(edge, eStatus, posStatus) {
    if (eStatus.pTL.top < edge.eTL.top
        && eStatus.pTR.top < edge.eTR.top) {
        posStatus.eflipStatusY = true;
        posStatus.eflipStatusX = false;
    }
    else if (eStatus.pBL.top > edge.eBL.top
        && eStatus.pBR.top > edge.eBR.top) {
        posStatus.eflipStatusY = true;
        posStatus.eflipStatusX = false;
    }
    else if (eStatus.pTL.left < edge.eTL.left
        && eStatus.pBL.left < edge.eBL.left) {
        posStatus.eflipStatusY = false;
        posStatus.eflipStatusX = true;
    }
    else if (eStatus.pTR.left > edge.eTR.left
        && eStatus.pBR.left > edge.eBR.left) {
        posStatus.eflipStatusY = false;
        posStatus.eflipStatusX = true;
    }
}
function flipValidation(edge, eStatus, alter, posStatus) {
    alter.flipAlter = '';
    setElementPosition(edge, eStatus, posStatus);
    if (eStatus.pTL.affectedBy === 'top'
        && eStatus.pTR.affectedBy === 'top'
        && eStatus.pBL.affectedBy === ''
        && eStatus.pBR.affectedBy === ''
        && posStatus.eflipStatusY) {
        alter.flipAlter = 'bottom';
    }
    else if (eStatus.pBL.affectedBy === 'bottom'
        && eStatus.pBR.affectedBy === 'bottom'
        && eStatus.pTL.affectedBy === ''
        && eStatus.pTR.affectedBy === ''
        && posStatus.eflipStatusY) {
        alter.flipAlter = 'top';
    }
    else if (eStatus.pTL.affectedBy === 'left'
        && eStatus.pBL.affectedBy === 'left'
        && eStatus.pTR.affectedBy === ''
        && eStatus.pBR.affectedBy === ''
        && posStatus.eflipStatusX) {
        alter.flipAlter = 'right';
    }
    else if (eStatus.pTR.affectedBy === 'right'
        && eStatus.pBR.affectedBy === 'right'
        && eStatus.pBL.affectedBy === ''
        && eStatus.pTL.affectedBy === ''
        && posStatus.eflipStatusX) {
        alter.flipAlter = 'left';
    }
    else {
        alter.flipAlter = '';
    }
    return alter.flipAlter.length > 0;
}
function validateAffectedEdges(positionTemp) {
    if ((positionTemp.top - getBodyScrollTop()) < 0) {
        (positionTemp.affectedBy = 'top');
    }
    else if ((positionTemp.left - getBodyScrollLeft()) < 0) {
        (positionTemp.affectedBy = 'left');
    }
    else if (positionTemp.top > (getBodyScrollTop() + getViewPortHeight())) {
        (positionTemp.affectedBy = 'bottom');
    }
    else if (positionTemp.left > (getBodyScrollLeft() + getViewPortWidth())) {
        (positionTemp.affectedBy = 'right');
    }
}
function validateElementPos(eStatus) {
    validateAffectedEdges(eStatus.pTL);
    validateAffectedEdges(eStatus.pTR);
    validateAffectedEdges(eStatus.pBL);
    validateAffectedEdges(eStatus.pBR);
}
function getBodyScrollTop() {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
function getBodyScrollLeft() {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
function getViewPortHeight() {
    return window.innerHeight;
}
function getViewPortWidth() {
    return window.innerWidth;
}


/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__position__ = __webpack_require__(27);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__position__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__collision__ = __webpack_require__(66);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__collision__["a"]; });




/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ButtonProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Dialog; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return dialogBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__popup_popup__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_buttons__ = __webpack_require__(32);
var __extends = (this && this.__extends) || (function () {
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








var ButtonProps = (function (_super) {
    __extends(ButtonProps, _super);
    function ButtonProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ButtonProps;
}(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["ChildProperty"]));

__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])()
], ButtonProps.prototype, "buttonModel", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])()
], ButtonProps.prototype, "click", void 0);
var ROOT = 'e-dialog';
var RTL = 'e-rtl';
var DLG_HEADER_CONTENT = 'e-dlg-header-content';
var DLG_HEADER = 'e-dlg-header';
var DLG_FOOTER_CONTENT = 'e-footer-content';
var MODAL_DLG = 'e-dlg-modal';
var DLG_CONTENT = 'e-dlg-content';
var DLG_CLOSE_ICON = 'e-icon-dlg-close';
var DLG_OVERLAY = 'e-dlg-overlay';
var SCROLL_DISABLED = 'e-scroll-disabled';
var DLG_PRIMARY_BUTTON = 'e-primary';
var ICON = 'e-icons';
var POPUP_ROOT = 'e-popup';
var DEVICE = 'e-device';
var FULLSCREEN = 'e-dlg-fullscreen';
var DLG_CLOSE_ICON_BTN = 'e-dlg-closeicon-btn';
var Dialog = (function (_super) {
    __extends(Dialog, _super);
    function Dialog(options, element) {
        return _super.call(this, options, element) || this;
    }
    Dialog.prototype.render = function () {
        this.initialize();
        this.initRender();
        this.wireEvents();
    };
    Dialog.prototype.preRender = function () {
        var _this = this;
        this.closeIconClickEventHandler = function () {
            _this.hide();
        };
        this.dlgOverlayClickEventHandler = function (event) {
            _this.trigger('overlayClick', event);
        };
    };
    ;
    Dialog.prototype.keyDown = function (event) {
        var _this = this;
        if (event.keyCode === 9) {
            event.preventDefault();
            var focusIndex = void 0;
            if (event.shiftKey) {
                focusIndex = (this.focusIndex === 0 || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.focusIndex)) ?
                    this.focusElements.length - 1 : this.focusIndex - 1;
            }
            else {
                focusIndex = (this.focusElements.length - 1 === this.focusIndex || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.focusIndex)) ?
                    0 : this.focusIndex + 1;
            }
            var element_1 = this.focusElements[focusIndex];
            element_1.focus();
            if (element_1 instanceof HTMLInputElement) {
                element_1.select();
            }
        }
        var element = document.activeElement;
        var isTagName = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        var isContentEdit = false;
        if (!isTagName) {
            isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
        }
        if (event.keyCode === 27 && this.closeOnEscape) {
            this.hide();
        }
        if ((event.keyCode === 13 && element.tagName.toLowerCase() === 'button' &&
            element.classList.contains(DLG_PRIMARY_BUTTON) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.primaryButtonEle)) ||
            (event.keyCode === 13 && !event.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
                isTagName && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.primaryButtonEle)) ||
            (event.keyCode === 13 && event.ctrlKey && (element.tagName.toLowerCase() === 'textarea' ||
                isContentEdit)) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.primaryButtonEle)) {
            var buttonIndex_1;
            var firstPrimary = this.buttons.some(function (data, index) {
                buttonIndex_1 = index;
                var buttonModel = data.buttonModel;
                return !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex_1].click) === 'function') {
                setTimeout(function () {
                    _this.buttons[buttonIndex_1].click.call(_this);
                });
            }
        }
    };
    Dialog.prototype.initialize = function () {
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                document.querySelector(this.target) : this.target;
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], ROOT);
        if (__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Browser"].isDevice) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], DEVICE);
        }
        this.setCSSClass();
        this.element.style.maxHeight = (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.target)) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
    };
    Dialog.prototype.initRender = function () {
        var _this = this;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["attributes"])(this.element, { role: 'dialog' });
        if (this.header !== '') {
            this.setHeader();
        }
        if (this.showCloseIcon) {
            this.renderCloseIcon();
        }
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.content) && this.content !== '') {
            this.setContent();
        }
        else if (this.element.hasChildNodes()) {
            this.contentEle = this.element;
        }
        if (this.footerTemplate !== '') {
            this.setFooterTemplate();
        }
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.buttons[0].buttonModel) && this.footerTemplate === '') {
            this.setButton();
        }
        if (this.allowDragging && (!this.isModal) && (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent))) {
            this.setAllowDragging();
        }
        if (this.isModal) {
            this.setIsModal();
        }
        this.popupObj = new __WEBPACK_IMPORTED_MODULE_4__popup_popup__["a" /* Popup */](this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.target,
            position: {
                X: this.position.X,
                Y: this.position.Y
            },
            open: function () {
                _this.focusContent();
                _this.trigger('open');
            },
            close: function () {
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(_this.focusElements) && _this.focusElements.length > 0) {
                    _this.unBindEvent((__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(_this.focusIndex) ? _this.element : _this.focusElements[_this.focusIndex]));
                }
                else {
                    _this.unBindEvent(_this.element);
                }
                _this.trigger('close');
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(_this.storeActiveElement)) {
                    _this.storeActiveElement.focus();
                }
            }
        });
        this.setEnableRTL();
        this.element.style.display = 'block';
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.content) && this.content !== '') {
            this.setContentHeight();
        }
        this.element.style.display = 'none';
        if (this.showOnInit) {
            this.show();
        }
    };
    Dialog.prototype.setAllowDragging = function () {
        var _this = this;
        var handleContent = '.' + DLG_HEADER_CONTENT;
        this.dragObj = new __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Draggable"](this.element, {
            clone: false,
            handle: handleContent,
            dragStart: function (event) {
                _this.trigger('dragStart', event);
            },
            dragStop: function (event) {
                _this.trigger('dragStop', event);
            },
            drag: function (event) {
                _this.trigger('drag', event);
            }
        });
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    };
    Dialog.prototype.setButton = function () {
        this.buttonContent = [];
        var primaryBtnFlag = true;
        for (var i = 0; i < this.buttons.length; i++) {
            var btn = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('button');
            this.buttonContent.push(btn.outerHTML);
        }
        this.setFooterTemplate();
        for (var i = 0; i < this.buttons.length; i++) {
            this.btnObj = new __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_buttons__["Button"](this.buttons[i].buttonModel);
            if (typeof (this.buttons[i].click) === 'function') {
                __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].add(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click, this);
            }
            this.btnObj.appendTo(this.ftrTemplateContent.children[i]);
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
        }
    };
    Dialog.prototype.setContent = function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["attributes"])(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        this.contentEle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        typeof (this.content) === 'string' ? this.contentEle.innerHTML = this.content : this.contentEle.appendChild(this.content);
        !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent) ? this.element.insertBefore(this.contentEle, this.element.children[1]) :
            this.element.insertBefore(this.contentEle, this.element.children[0]);
    };
    Dialog.prototype.setContentHeight = function () {
        this.contentHeight = this.element.offsetHeight -
            ((__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.ftrTemplateContent) ? 0 : this.ftrTemplateContent.offsetHeight) +
                (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent) ? 0 : this.headerContent.offsetHeight));
        this.contentEle.style.height = this.contentHeight + 'px';
    };
    Dialog.prototype.setEnableRTL = function () {
        this.enableRtl ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], RTL) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], RTL);
    };
    Dialog.prototype.setHeader = function () {
        this.headerEle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('div', { id: this.element.id + '_title', className: DLG_HEADER, innerHTML: this.header });
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["attributes"])(this.element, { 'aria-labelledby': this.element.id + '_title' });
        this.createHeaderContent();
        this.headerContent.appendChild(this.headerEle);
        this.element.insertBefore(this.headerContent, this.element.children[0]);
    };
    Dialog.prototype.setFooterTemplate = function () {
        this.ftrTemplateContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('div', {
            className: DLG_FOOTER_CONTENT,
            innerHTML: (this.footerTemplate !== '' ? this.footerTemplate : this.buttonContent.join(''))
        });
        this.element.appendChild(this.ftrTemplateContent);
    };
    Dialog.prototype.createHeaderContent = function () {
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent)) {
            this.headerContent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('div', { className: DLG_HEADER_CONTENT });
        }
    };
    Dialog.prototype.renderCloseIcon = function () {
        this.closeIcon = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('button', { className: DLG_CLOSE_ICON_BTN });
        this.closeIconBtnObj = new __WEBPACK_IMPORTED_MODULE_5__syncfusion_ej2_buttons__["Button"]({ cssClass: 'e-small e-flat', iconCss: DLG_CLOSE_ICON + ' ' + ICON });
        this.closeIconTitle();
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["prepend"])([this.closeIcon], this.headerContent);
        }
        else {
            this.createHeaderContent();
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["prepend"])([this.closeIcon], this.headerContent);
            this.element.insertBefore(this.headerContent, this.element.children[0]);
        }
        this.closeIconBtnObj.appendTo(this.closeIcon);
    };
    Dialog.prototype.closeIconTitle = function () {
        if (this.locale !== '') {
            var l10n = new __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["L10n"]('Dialog', { locale: 'Close' });
            l10n.setLocale(this.locale);
            var closeIconTitle = l10n.getConstant('Close');
            this.closeIcon.setAttribute('title', closeIconTitle);
        }
        else {
            this.closeIcon.setAttribute('title', 'Close');
        }
    };
    Dialog.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], oldCSSClass.split(' '));
        }
    };
    Dialog.prototype.setIsModal = function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], MODAL_DLG);
        this.dlgOverlay = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["createElement"])('div', { className: DLG_OVERLAY });
        this.dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.targetEle)) {
            this.targetEle.appendChild(this.dlgOverlay);
            this.dlgOverlay.style.position = 'relative';
        }
        else {
            this.element.parentNode.appendChild(this.dlgOverlay);
        }
    };
    Dialog.prototype.focusContentEle = function (container) {
        var _this = this;
        var value = 'input,select,textarea,button,a,[contenteditable="true"]';
        var items = container.querySelectorAll(value);
        var item;
        this.focusElements = [];
        this.focusIndex = 0;
        for (var u = 0; u < items.length; u++) {
            item = items[u];
            if ((item.clientHeight > 0 || (item.tagName.toLowerCase() === 'a' && item.hasAttribute('href'))) && item.tabIndex > -1 &&
                !item.disabled && !this.disableElement(item, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                this.focusElements.push(item);
            }
        }
        if (0 < this.focusElements.length) {
            var autofocusEle = [].slice.call(this.focusElements);
            var isAutoFocus_1 = autofocusEle.some(function (value, index) {
                if (value.hasAttribute('autofocus')) {
                    _this.focusIndex = index;
                    isAutoFocus_1 = true;
                }
                else {
                    isAutoFocus_1 = false;
                }
                return isAutoFocus_1;
            });
            if (!isAutoFocus_1) {
                var index = this.showCloseIcon && this.focusElements.length > 1 ? 1 : 0;
                var contentEle = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.contentEle) &&
                    this.contentEle.querySelector(this.focusElements[index].nodeName);
                if (contentEle) {
                    this.focusIndex = this.focusElements.indexOf(contentEle);
                }
                else if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.primaryButtonEle)) {
                    var ele = this.element.querySelector('.' + DLG_PRIMARY_BUTTON);
                    this.focusIndex = this.focusElements.indexOf(ele);
                }
            }
            var element = this.focusElements[this.focusIndex];
            element.focus();
            this.bindEvent(element);
            if (element instanceof HTMLInputElement) {
                element.select();
            }
        }
    };
    Dialog.prototype.disableElement = function (element, t) {
        var elementMatch = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    return element;
                }
            }
        }
        return null;
    };
    Dialog.prototype.focusContent = function () {
        this.focusContentEle(this.element);
        if (this.focusElements.length === 0) {
            this.element.focus();
            this.bindEvent(this.element);
        }
    };
    Dialog.prototype.bindEvent = function (element) {
        __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].add(element, 'keydown', this.keyDown, this);
        __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].add(element, 'blur', this.focusOut, this);
    };
    Dialog.prototype.unBindEvent = function (element) {
        __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].remove(element, 'keydown', this.keyDown);
        __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].remove(element, 'blur', this.focusOut);
    };
    Dialog.prototype.focusOut = function (e) {
        var _this = this;
        var element = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.focusIndex) ? this.element : this.focusElements[this.focusIndex];
        setTimeout(function () {
            var tags = ['input', 'select', 'textarea', 'button', 'a'];
            var activeEle = document.activeElement;
            var isValid = (tags.indexOf(activeEle.tagName.toLowerCase()) > -1) ||
                (activeEle.hasAttribute('contenteditable') && activeEle.getAttribute('contenteditable') === 'true');
            if (_this.dialogOpen && _this.element.contains(activeEle)) {
                _this.focusIndex = isValid ? _this.focusElements.indexOf(activeEle) : null;
                _this.unBindEvent(element);
                _this.bindEvent((__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(_this.focusIndex) ? _this.element : activeEle));
            }
        });
    };
    Dialog.prototype.getModuleName = function () {
        return 'dialog';
    };
    Dialog.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'content':
                    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.content) && this.content !== '') {
                        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                            this.contentEle.innerHTML = '';
                            typeof (this.content) === 'string' ?
                                this.contentEle.innerHTML = this.content : this.contentEle.appendChild(this.content);
                            this.element.style.maxHeight = (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.target)) ?
                                (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
                            this.contentEle.style.height = 'auto';
                            this.setContentHeight();
                        }
                        else {
                            this.setContent();
                            this.setContentHeight();
                        }
                    }
                    else {
                        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.contentEle)) {
                            this.element.removeChild(this.contentEle);
                        }
                    }
                    break;
                case 'header':
                    if (this.header === '') {
                        this.headerEle.remove();
                    }
                    else {
                        this.element.getElementsByClassName(DLG_HEADER).length > 0 ?
                            this.element.getElementsByClassName(DLG_HEADER)[0].innerHTML = this.header
                            : this.setHeader();
                    }
                    break;
                case 'footerTemplate':
                    this.element.getElementsByClassName(DLG_FOOTER_CONTENT).length > 0 ?
                        this.ftrTemplateContent.innerHTML = this.footerTemplate : this.setFooterTemplate();
                    break;
                case 'showCloseIcon':
                    if (this.element.getElementsByClassName(DLG_CLOSE_ICON).length > 0) {
                        if (!this.showCloseIcon && this.header === '') {
                            this.headerContent.remove();
                        }
                        else if (!this.showCloseIcon) {
                            this.closeIcon.remove();
                        }
                    }
                    else {
                        this.renderCloseIcon();
                        this.wireEvents();
                    }
                    break;
                case 'locale':
                    if (this.showCloseIcon) {
                        this.closeIconTitle();
                    }
                    break;
                case 'showOnInit':
                    this.showOnInit ? this.show() : this.hide();
                    break;
                case 'isModal':
                    if (this.isModal) {
                        this.setIsModal();
                        this.wireEvents();
                    }
                    else {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], MODAL_DLG);
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([document.body], SCROLL_DISABLED);
                        this.dlgOverlay.remove();
                    }
                    break;
                case 'height':
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, { 'height': __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["formatUnit"])(newProp.height) });
                    this.setContentHeight();
                    break;
                case 'width':
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["setStyleAttribute"])(this.element, { 'width': __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["formatUnit"])(newProp.width) });
                    break;
                case 'zIndex':
                    this.popupObj.zIndex = this.zIndex;
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'animationSettings':
                    this.show();
                    break;
                case 'buttons':
                    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.buttons[0].buttonModel) && this.footerTemplate === '') {
                        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.ftrTemplateContent)) {
                            this.ftrTemplateContent.innerHTML = '';
                        }
                        this.setButton();
                    }
                    break;
                case 'allowDragging':
                    if (this.allowDragging && (!this.isModal) && (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent))) {
                        this.setAllowDragging();
                    }
                    else {
                        this.dragObj.destroy();
                    }
                    break;
                case 'position':
                    this.popupObj.position = this.position;
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
            }
        }
    };
    Dialog.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    Dialog.prototype.destroy = function () {
        if (this.element.classList.contains(ROOT)) {
            this.unWireEvents();
            _super.prototype.destroy.call(this);
            var classArray = [
                ROOT, RTL, MODAL_DLG
            ];
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element, this.element], classArray);
            if (this.popupObj.element.classList.contains(POPUP_ROOT)) {
                this.popupObj.destroy();
            }
            if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.btnObj)) {
                this.btnObj.destroy();
            }
            if (this.isModal) {
                this.dlgOverlay.remove();
            }
            this.element.innerHTML = '';
        }
    };
    Dialog.prototype.wireEvents = function () {
        if (this.showCloseIcon) {
            __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].add(this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal) {
            __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    };
    Dialog.prototype.unWireEvents = function () {
        if (this.showCloseIcon) {
            __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.buttons[0].buttonModel)) {
            for (var i = 0; i < this.buttons.length; i++) {
                if (typeof (this.buttons[i].click) === 'function') {
                    __WEBPACK_IMPORTED_MODULE_3__syncfusion_ej2_base_event_handler__["EventHandler"].remove(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click);
                }
            }
        }
    };
    Dialog.prototype.show = function (isFullScreen) {
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(isFullScreen)) {
            this.fullScreen(isFullScreen);
        }
        this.storeActiveElement = document.activeElement;
        this.element.tabIndex = -1;
        this.trigger('beforeOpen');
        if (this.isModal && (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.dlgOverlay))) {
            this.dlgOverlay.style.display = 'block';
            if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.targetEle)) {
                this.dlgOverlay.style.position = 'absolute';
                this.dlgOverlay.style.height = this.targetEle.scrollHeight + 'px';
                this.element.style.position = 'absolute';
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.targetEle], SCROLL_DISABLED);
            }
            else {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([document.body], SCROLL_DISABLED);
            }
        }
        var openAnimation = {
            name: this.animationSettings.effect + 'In',
            duration: this.animationSettings.duration,
            delay: this.animationSettings.delay
        };
        this.animationSettings.effect === 'None' ? this.popupObj.show() : this.popupObj.show(openAnimation);
        this.dialogOpen = true;
    };
    Dialog.prototype.hide = function () {
        this.trigger('beforeClose');
        if (this.isModal) {
            this.dlgOverlay.style.display = 'none';
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.targetEle) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.targetEle], SCROLL_DISABLED) :
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([document.body], SCROLL_DISABLED);
        }
        var closeAnimation = {
            name: this.animationSettings.effect + 'Out',
            duration: this.animationSettings.duration,
            delay: this.animationSettings.delay
        };
        this.animationSettings.effect === 'None' ? this.popupObj.hide() : this.popupObj.hide(closeAnimation);
        this.dialogOpen = false;
    };
    Dialog.prototype.fullScreen = function (args) {
        var top = this.element.offsetTop;
        var left = this.element.offsetLeft;
        if (args) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([this.element], FULLSCREEN);
            this.element.style.maxHeight = (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = 'block';
            this.setContentHeight();
            this.element.style.display = 'none';
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["addClass"])([document.body], SCROLL_DISABLED);
            if (this.allowDragging && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.dragObj)) {
                this.dragObj.destroy();
            }
        }
        else {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([this.element], FULLSCREEN);
            this.contentEle.style.height = this.contentHeight + 'px';
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_dom__["removeClass"])([document.body], SCROLL_DISABLED);
            if (this.allowDragging && (!this.isModal) && (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__syncfusion_ej2_base_util__["isNullOrUndefined"])(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    };
    return Dialog;
}(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Component"]));
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Dialog.prototype, "content", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Dialog.prototype, "showCloseIcon", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Dialog.prototype, "isModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Dialog.prototype, "header", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Dialog.prototype, "showOnInit", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('auto')
], Dialog.prototype, "height", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('100%')
], Dialog.prototype, "width", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Dialog.prototype, "cssClass", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(1000)
], Dialog.prototype, "zIndex", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(null)
], Dialog.prototype, "target", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Dialog.prototype, "footerTemplate", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(false)
], Dialog.prototype, "allowDragging", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Collection"])([{}], ButtonProps)
], Dialog.prototype, "buttons", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])(true)
], Dialog.prototype, "closeOnEscape", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])({ effect: 'Fade', duration: 400, delay: 0 })
], Dialog.prototype, "animationSettings", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])({ X: 'center', Y: 'center' })
], Dialog.prototype, "position", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Property"])('')
], Dialog.prototype, "locale", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "created", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "open", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "beforeOpen", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "close", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "beforeClose", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "dragStart", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "dragStop", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "drag", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Event"])()
], Dialog.prototype, "overlayClick", void 0);
Dialog = __decorate([
    __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["NotifyPropertyChanges"]
], Dialog);

var dialogBuilder = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["CreateBuilder"])(Dialog);


/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dialog__ = __webpack_require__(68);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__dialog__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__dialog__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__dialog__["c"]; });



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

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__popup__ = __webpack_require__(44);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__popup__["a"]; });



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

},[196]);