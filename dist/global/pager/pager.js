this["ej"] = this["ej"] || {}; this["ej"]["pagerModule"] =
webpackJsonpej__name_Module([6],{

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

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(65), __webpack_require__(64), __webpack_require__(53), __webpack_require__(54)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, pager_1, external_message_1, numeric_container_1, pager_message_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(pager_1);
    __export(external_message_1);
    __export(numeric_container_1);
    __export(pager_message_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(99)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, pager_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(pager_1);
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

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, ej2_base_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumericContainer = (function () {
        function NumericContainer(pagerModule) {
            this.pagerModule = pagerModule;
        }
        NumericContainer.prototype.render = function () {
            this.pagerElement = this.pagerModule.element;
            this.renderNumericContainer();
            this.refreshNumericLinks();
            this.wireEvents();
        };
        NumericContainer.prototype.refresh = function () {
            var pagerObj = this.pagerModule;
            pagerObj.totalPages = (pagerObj.totalRecordsCount % pagerObj.pageSize === 0) ? (pagerObj.totalRecordsCount / pagerObj.pageSize) :
                (parseInt((pagerObj.totalRecordsCount / pagerObj.pageSize).toString(), 10) + 1);
            if (this.links.length) {
                this.updateLinksHtml();
            }
            this.updateStyles();
        };
        NumericContainer.prototype.refreshNumericLinks = function () {
            var link;
            var pagerObj = this.pagerModule;
            var div = pagerObj.element.querySelector('.e-numericcontainer');
            var frag = document.createDocumentFragment();
            div.innerHTML = '';
            for (var i = 1; i <= pagerObj.pageCount; i++) {
                link = dom_1.createElement('a', { className: 'e-link e-numericitem e-spacing e-pager-default', attrs: { role: 'link' } });
                if (pagerObj.currentPage === i) {
                    dom_1.classList(link, ['e-currentitem', 'e-active'], ['e-pager-default']);
                }
                frag.appendChild(link);
            }
            div.appendChild(frag);
            this.links = [].slice.call(div.childNodes);
        };
        NumericContainer.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.pagerElement, 'click', this.clickHandler, this);
        };
        NumericContainer.prototype.unwireEvents = function () {
            ej2_base_1.EventHandler.remove(this.pagerElement, 'click', this.clickHandler);
        };
        NumericContainer.prototype.destroy = function () {
            this.unwireEvents();
        };
        NumericContainer.prototype.renderNumericContainer = function () {
            this.element = dom_1.createElement('div', { className: 'e-pagercontainer' });
            this.renderFirstNPrev(this.element);
            this.renderPrevPagerSet(this.element);
            this.element.appendChild(dom_1.createElement('div', { className: 'e-numericcontainer' }));
            this.renderNextPagerSet(this.element);
            this.renderNextNLast(this.element);
            this.pagerModule.element.appendChild(this.element);
        };
        NumericContainer.prototype.renderFirstNPrev = function (pagerContainer) {
            this.first = dom_1.createElement('div', {
                className: 'e-first e-icons e-icon-first',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('firstPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('firstPageTooltip')
                }
            });
            this.prev = dom_1.createElement('div', {
                className: 'e-prev e-icons e-icon-prev',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPageTooltip')
                }
            });
            dom_1.append([this.first, this.prev], pagerContainer);
        };
        NumericContainer.prototype.renderPrevPagerSet = function (pagerContainer) {
            this.PP = dom_1.createElement('a', {
                className: 'e-link e-pp e-spacing', innerHTML: '...',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('previousPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('previousPagerTooltip')
                }
            });
            pagerContainer.appendChild(this.PP);
        };
        NumericContainer.prototype.renderNextPagerSet = function (pagerContainer) {
            this.NP = dom_1.createElement('a', {
                className: 'e-link e-np e-spacing',
                innerHTML: '...', attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPagerTooltip'), role: 'link',
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPagerTooltip')
                }
            });
            pagerContainer.appendChild(this.NP);
        };
        NumericContainer.prototype.renderNextNLast = function (pagerContainer) {
            this.next = dom_1.createElement('div', {
                className: 'e-next e-icons e-icon-next',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('nextPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('nextPageTooltip')
                }
            });
            this.last = dom_1.createElement('div', {
                className: 'e-last e-icons e-icon-last',
                attrs: {
                    title: this.pagerModule.getLocalizedLabel('lastPageTooltip'),
                    'aria-label': this.pagerModule.getLocalizedLabel('lastPageTooltip')
                }
            });
            dom_1.append([this.next, this.last], pagerContainer);
        };
        NumericContainer.prototype.clickHandler = function (e) {
            var pagerObj = this.pagerModule;
            var target = e.target;
            pagerObj.previousPageNo = pagerObj.currentPage;
            if (!target.classList.contains('e-disable') && !util_1.isNullOrUndefined(target.getAttribute('index'))) {
                pagerObj.currentPage = parseInt(target.getAttribute('index'), 10);
                pagerObj.dataBind();
            }
            return false;
        };
        NumericContainer.prototype.updateLinksHtml = function () {
            var pagerObj = this.pagerModule;
            var currentPageSet;
            var pageNo;
            pagerObj.currentPage = pagerObj.totalPages === 1 ? 1 : pagerObj.currentPage;
            if (pagerObj.currentPage > pagerObj.totalPages && pagerObj.totalPages) {
                pagerObj.currentPage = pagerObj.totalPages;
            }
            currentPageSet = parseInt((pagerObj.currentPage / pagerObj.pageCount).toString(), 10);
            if (pagerObj.currentPage % pagerObj.pageCount === 0 && currentPageSet > 0) {
                currentPageSet = currentPageSet - 1;
            }
            for (var i = 0; i < pagerObj.pageCount; i++) {
                pageNo = (currentPageSet * pagerObj.pageCount) + 1 + i;
                if (pageNo <= pagerObj.totalPages) {
                    this.links[i].style.display = '';
                    this.links[i].setAttribute('index', pageNo.toString());
                    this.links[i].innerHTML = !pagerObj.customText ? pageNo.toString() : pagerObj.customText + pageNo;
                    if (pagerObj.currentPage !== pageNo) {
                        this.links[i].classList.add('e-pager-default');
                    }
                    else {
                        this.links[i].classList.remove('e-pager-default');
                    }
                }
                else {
                    this.links[i].style.display = 'none';
                }
                dom_1.classList(this.links[i], [], ['e-currentitem', 'e-active']);
            }
            this.first.setAttribute('index', '1');
            this.last.setAttribute('index', pagerObj.totalPages.toString());
            this.prev.setAttribute('index', (pagerObj.currentPage - 1).toString());
            this.next.setAttribute('index', (pagerObj.currentPage + 1).toString());
            this.pagerElement.querySelector('.e-mfirst').setAttribute('index', '1');
            this.pagerElement.querySelector('.e-mlast').setAttribute('index', pagerObj.totalPages.toString());
            this.pagerElement.querySelector('.e-mprev').setAttribute('index', (pagerObj.currentPage - 1).toString());
            this.pagerElement.querySelector('.e-mnext').setAttribute('index', (pagerObj.currentPage + 1).toString());
            this.PP.setAttribute('index', (parseInt(this.links[0].getAttribute('index'), 10) - pagerObj.pageCount).toString());
            this.NP.setAttribute('index', (parseInt(this.links[this.links.length - 1].getAttribute('index'), 10) + 1).toString());
        };
        NumericContainer.prototype.updateStyles = function () {
            this.updateFirstNPrevStyles();
            this.updatePrevPagerSetStyles();
            this.updateNextPagerSetStyles();
            this.updateNextNLastStyles();
            if (this.links.length) {
                dom_1.classList(this.links[(this.pagerModule.currentPage - 1) % this.pagerModule.pageCount], ['e-currentitem', 'e-active'], []);
            }
        };
        NumericContainer.prototype.updateFirstNPrevStyles = function () {
            var firstPage = ['e-firstpage', 'e-pager-default'];
            var firstPageDisabled = ['e-firstpagedisabled', 'e-disable'];
            var prevPage = ['e-prevpage', 'e-pager-default'];
            var prevPageDisabled = ['e-prevpagedisabled', 'e-disable'];
            if (this.pagerModule.currentPage > 1) {
                dom_1.classList(this.prev, prevPage, prevPageDisabled);
                dom_1.classList(this.first, firstPage, firstPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mfirst'), firstPage, firstPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mprev'), prevPage, prevPageDisabled);
            }
            else {
                dom_1.classList(this.prev, prevPageDisabled, prevPage);
                dom_1.classList(this.first, firstPageDisabled, firstPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mprev'), prevPageDisabled, prevPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mfirst'), firstPageDisabled, firstPage);
            }
        };
        NumericContainer.prototype.updatePrevPagerSetStyles = function () {
            if (this.pagerModule.currentPage > this.pagerModule.pageCount) {
                dom_1.classList(this.PP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
            }
            else {
                dom_1.classList(this.PP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
            }
        };
        NumericContainer.prototype.updateNextPagerSetStyles = function () {
            var pagerObj = this.pagerModule;
            var firstPage = this.links[0].innerHTML.replace(pagerObj.customText, '');
            if (!firstPage.length || !this.links.length || (parseInt(firstPage, 10) + pagerObj.pageCount > pagerObj.totalPages)) {
                dom_1.classList(this.NP, ['e-nextprevitemdisabled', 'e-disable'], ['e-numericitem', 'e-pager-default']);
            }
            else {
                dom_1.classList(this.NP, ['e-numericitem', 'e-pager-default'], ['e-nextprevitemdisabled', 'e-disable']);
            }
        };
        NumericContainer.prototype.updateNextNLastStyles = function () {
            var lastPage = ['e-lastpage', 'e-pager-default'];
            var lastPageDisabled = ['e-lastpagedisabled', 'e-disable'];
            var nextPage = ['e-nextpage', 'e-pager-default'];
            var nextPageDisabled = ['e-nextpagedisabled', 'e-disable'];
            var pagerObj = this.pagerModule;
            if (pagerObj.currentPage === pagerObj.totalPages || pagerObj.totalRecordsCount === 0) {
                dom_1.classList(this.last, lastPageDisabled, lastPage);
                dom_1.classList(this.next, nextPageDisabled, nextPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mlast'), lastPageDisabled, lastPage);
                dom_1.classList(this.pagerElement.querySelector('.e-mnext'), nextPageDisabled, nextPage);
            }
            else {
                dom_1.classList(this.last, lastPage, lastPageDisabled);
                dom_1.classList(this.next, nextPage, nextPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mlast'), lastPage, lastPageDisabled);
                dom_1.classList(this.pagerElement.querySelector('.e-mnext'), nextPage, nextPageDisabled);
            }
        };
        return NumericContainer;
    }());
    exports.NumericContainer = NumericContainer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PagerMessage = (function () {
        function PagerMessage(pagerModule) {
            this.pagerModule = pagerModule;
        }
        PagerMessage.prototype.render = function () {
            var div = dom_1.createElement('div', { className: 'e-parentmsgbar', attrs: { 'aria-label': 'Pager Information' } });
            this.pageNoMsgElem = dom_1.createElement('span', { className: 'e-pagenomsg', styles: 'textalign:right' });
            this.pageCountMsgElem = dom_1.createElement('span', { className: 'e-pagecountmsg', styles: 'textalign:right' });
            dom_1.append([this.pageNoMsgElem, this.pageCountMsgElem], div);
            this.pagerModule.element.appendChild(div);
            this.refresh();
        };
        PagerMessage.prototype.refresh = function () {
            var pagerObj = this.pagerModule;
            this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                    pagerObj.currentPage, pagerObj.totalPages || 0]) + ' ';
            this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('totalItemsInfo'), [pagerObj.totalRecordsCount || 0]);
            this.pageNoMsgElem.parentElement.setAttribute('aria-label', this.pageNoMsgElem.textContent + this.pageCountMsgElem.textContent);
        };
        PagerMessage.prototype.hideMessage = function () {
            if (this.pageNoMsgElem) {
                this.pageNoMsgElem.style.display = 'none';
            }
            if (this.pageCountMsgElem) {
                this.pageCountMsgElem.style.display = 'none';
            }
        };
        PagerMessage.prototype.showMessage = function () {
            if (!this.pageNoMsgElem) {
                this.render();
            }
            this.pageNoMsgElem.style.display = '';
            this.pageCountMsgElem.style.display = '';
        };
        PagerMessage.prototype.destroy = function () {
        };
        PagerMessage.prototype.format = function (str, args) {
            var regx;
            for (var i = 0; i < args.length; i++) {
                regx = new RegExp('\\{' + (i) + '\\}', 'gm');
                str = str.replace(regx, args[i].toString());
            }
            return str;
        };
        return PagerMessage;
    }());
    exports.PagerMessage = PagerMessage;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


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

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExternalMessage = (function () {
        function ExternalMessage(pagerModule) {
            this.pagerModule = pagerModule;
        }
        ExternalMessage.prototype.getModuleName = function () {
            return 'externalMessage';
        };
        ExternalMessage.prototype.render = function () {
            this.element = dom_1.createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': 'Pager external message' } });
            this.pagerModule.element.appendChild(this.element);
            this.refresh();
        };
        ExternalMessage.prototype.refresh = function () {
            if (this.pagerModule.externalMessage && this.pagerModule.externalMessage.toString().length) {
                this.showMessage();
                this.element.innerHTML = this.pagerModule.externalMessage;
            }
            else {
                this.hideMessage();
            }
        };
        ExternalMessage.prototype.hideMessage = function () {
            this.element.style.display = 'none';
        };
        ExternalMessage.prototype.showMessage = function () {
            this.element.style.display = '';
        };
        ExternalMessage.prototype.destroy = function () {
            dom_1.remove(this.element);
        };
        return ExternalMessage;
    }());
    exports.ExternalMessage = ExternalMessage;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 65:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(53), __webpack_require__(54)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, dom_1, util_1, ej2_base_2, numeric_container_1, pager_message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pager = (function (_super) {
        __extends(Pager, _super);
        function Pager(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.defaultConstants = {
                currentPageInfo: '{0} of {1} pages',
                totalItemsInfo: '({0} items)',
                firstPageTooltip: 'Go to first page',
                lastPageTooltip: 'Go to last page',
                nextPageTooltip: 'Go to next page',
                previousPageTooltip: 'Go to previous page',
                nextPagerTooltip: 'Go to next pager',
                previousPagerTooltip: 'Go to previous pager'
            };
            _this.containerModule = new numeric_container_1.NumericContainer(_this);
            _this.pagerMessageModule = new pager_message_1.PagerMessage(_this);
            return _this;
        }
        Pager.prototype.requiredModules = function () {
            var modules = [];
            if (this.enableExternalMessage) {
                modules.push({
                    member: 'externalMessage',
                    args: [this]
                });
            }
            return modules;
        };
        Pager.prototype.preRender = function () {
        };
        Pager.prototype.render = function () {
            this.initLocalization();
            this.updateRTL();
            this.totalRecordsCount = this.totalRecordsCount || 0;
            this.renderFirstPrevDivForDevice();
            this.containerModule.render();
            if (this.enablePagerMessage) {
                this.pagerMessageModule.render();
            }
            this.renderNextLastDivForDevice();
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.render();
            }
            this.refresh();
            this.trigger('created', { 'currentPage': this.currentPage, 'totalRecordsCount': this.totalRecordsCount });
        };
        Pager.prototype.getPersistData = function () {
            var keyEntity = ['enableExternalMessage', 'enablePagerMessage', 'currentPage',
                'pageSize', 'pageCount', 'totalRecordsCount', 'externalMessage', 'customText', 'click', 'created'];
            return this.addOnPersist(keyEntity);
        };
        Pager.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.containerModule.destroy();
            this.pagerMessageModule.destroy();
            this.element.innerHTML = '';
        };
        Pager.prototype.getModuleName = function () {
            return 'pager';
        };
        Pager.prototype.onPropertyChanged = function (newProp, oldProp) {
            if (this.isDestroyed) {
                return;
            }
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'pageCount':
                        this.containerModule.refreshNumericLinks();
                        this.containerModule.refresh();
                        break;
                    case 'currentPage':
                        if (this.checkGoToPage(newProp.currentPage, oldProp.currentPage)) {
                            this.currentPageChanged();
                        }
                        break;
                    case 'pageSize':
                    case 'totalRecordsCount':
                    case 'customText':
                        this.refresh();
                        break;
                    case 'locale':
                        this.initLocalization();
                        this.refresh();
                        break;
                    case 'enableExternalMessage':
                        if (this.enableExternalMessage) {
                            this.externalMessageModule.render();
                        }
                        break;
                    case 'externalMessage':
                        if (this.externalMessageModule) {
                            this.externalMessageModule.refresh();
                        }
                        break;
                    case 'enableRtl':
                        this.updateRTL();
                        break;
                    case 'enablePagerMessage':
                        if (this.enablePagerMessage) {
                            this.pagerMessageModule.showMessage();
                        }
                        else {
                            this.pagerMessageModule.hideMessage();
                        }
                        break;
                }
            }
        };
        Pager.prototype.getLocalizedLabel = function (key) {
            return this.localeObj.getConstant(key);
        };
        Pager.prototype.goToPage = function (pageNo) {
            if (this.checkGoToPage(pageNo)) {
                this.currentPage = pageNo;
                this.dataBind();
            }
        };
        Pager.prototype.checkGoToPage = function (newPageNo, oldPageNo) {
            if (newPageNo !== this.currentPage) {
                this.previousPageNo = this.currentPage;
            }
            if (!util_1.isNullOrUndefined(oldPageNo)) {
                this.previousPageNo = oldPageNo;
            }
            if (this.previousPageNo !== newPageNo && (newPageNo >= 1 && newPageNo <= this.totalPages)) {
                return true;
            }
            return false;
        };
        Pager.prototype.currentPageChanged = function () {
            if (this.enableQueryString) {
                this.updateQueryString(this.currentPage);
            }
            this.trigger('click', { 'currentPage': this.currentPage });
            this.refresh();
        };
        Pager.prototype.refresh = function () {
            this.updateRTL();
            this.containerModule.refresh();
            if (this.enablePagerMessage) {
                this.pagerMessageModule.refresh();
            }
            if (this.enableExternalMessage && this.externalMessageModule) {
                this.externalMessageModule.refresh();
            }
        };
        Pager.prototype.updateRTL = function () {
            if (this.enableRtl) {
                this.element.classList.add('e-rtl');
            }
            else {
                this.element.classList.remove('e-rtl');
            }
        };
        Pager.prototype.initLocalization = function () {
            this.localeObj = new ej2_base_1.L10n(this.getModuleName(), this.defaultConstants, this.locale);
        };
        Pager.prototype.updateQueryString = function (value) {
            var updatedUrl = this.getUpdatedURL(window.location.href, 'page', value.toString());
            window.history.pushState({ path: updatedUrl }, '', updatedUrl);
        };
        Pager.prototype.getUpdatedURL = function (uri, key, value) {
            var regx = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
            if (uri.match(regx)) {
                return uri.replace(regx, '$1' + key + '=' + value + '$2');
            }
            else {
                var hash = '';
                if (uri.indexOf('#') !== -1) {
                    hash = uri.replace(/.*#/, '#');
                    uri = uri.replace(/#.*/, '');
                }
                return uri + (uri.indexOf('?') !== -1 ? '&' : '?') + key + '=' + value + hash;
            }
        };
        Pager.prototype.renderFirstPrevDivForDevice = function () {
            this.element.appendChild(dom_1.createElement('div', {
                className: 'e-mfirst e-icons e-icon-first',
                attrs: { title: this.getLocalizedLabel('firstPageTooltip'), 'aria-label': this.getLocalizedLabel('firstPageTooltip') }
            }));
            this.element.appendChild(dom_1.createElement('div', {
                className: 'e-mprev e-icons e-icon-prev',
                attrs: { title: this.getLocalizedLabel('previousPageTooltip'), 'aria-label': this.getLocalizedLabel('previousPageTooltip') }
            }));
        };
        Pager.prototype.renderNextLastDivForDevice = function () {
            this.element.appendChild(dom_1.createElement('div', {
                className: 'e-mnext e-icons e-icon-next',
                attrs: { title: this.getLocalizedLabel('nextPageTooltip'), 'aria-label': this.getLocalizedLabel('nextPageTooltip') }
            }));
            this.element.appendChild(dom_1.createElement('div', {
                className: 'e-mlast e-icons e-icon-last',
                attrs: { title: this.getLocalizedLabel('lastPageTooltip'), 'aria-label': this.getLocalizedLabel('lastPageTooltip') }
            }));
        };
        return Pager;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_2.Property(false)
    ], Pager.prototype, "enableQueryString", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Pager.prototype, "enableExternalMessage", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Pager.prototype, "enablePagerMessage", void 0);
    __decorate([
        ej2_base_2.Property(12)
    ], Pager.prototype, "pageSize", void 0);
    __decorate([
        ej2_base_2.Property(10)
    ], Pager.prototype, "pageCount", void 0);
    __decorate([
        ej2_base_2.Property(1)
    ], Pager.prototype, "currentPage", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Pager.prototype, "totalRecordsCount", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Pager.prototype, "externalMessage", void 0);
    __decorate([
        ej2_base_2.Property('')
    ], Pager.prototype, "customText", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Pager.prototype, "click", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Pager.prototype, "created", void 0);
    Pager = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], Pager);
    exports.Pager = Pager;
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


/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, pager_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(pager_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

},[195]);