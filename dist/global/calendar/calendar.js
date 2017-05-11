this["ej"] = this["ej"] || {}; this["ej"]["calendarModule"] =
webpackJsonpej__name_Module([8],{

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

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(96)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, calendar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(calendar_1);
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

/***/ 137:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(1), __webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, ej2_base_2, ej2_base_3, dom_1, util_1, ej2_base_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ROOT = 'e-calendar';
    var HEADER = 'e-header';
    var RTL = 'e-rtl';
    var CONTENT = 'e-content';
    var YEAR = 'e-year';
    var MONTH = 'e-month';
    var DECADE = 'e-decade';
    var ICON = 'e-icons';
    var PREVICON = 'e-prev';
    var NEXTICON = 'e-next';
    var RIPPLESTYLE = 'e-ripple-style';
    var PREVSPAN = 'e-icon-prev';
    var NEXTSPAN = 'e-icon-next ';
    var ICONCONTAINER = 'e-icon-container';
    var DISABLED = 'e-disabled';
    var OVERLAY = 'e-overlay';
    var WEEKEND = 'e-weekend';
    var WEEKNUMBER = 'e-week-number';
    var OTHERMONTH = 'e-other-month';
    var SELECTED = 'e-selected';
    var FOCUSEDDATE = 'e-focused-date';
    var OTHERMONTHROW = 'e-month-hide';
    var TITLE = 'e-title';
    var LINK = 'e-link';
    var WEEKHEADER = 'e-week-header';
    var dayMilliSeconds = 86400000;
    var Calendar = (function (_super) {
        __extends(Calendar, _super);
        function Calendar(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.animateOptions = {};
            _this.keyConfigs = {
                controlLeft: 'ctrl+37',
                controlRight: 'ctrl+39',
                controlUp: 'ctrl+38',
                controlDown: 'ctrl+40',
                moveDown: 'downarrow',
                moveUp: 'uparrow',
                moveLeft: 'leftarrow',
                moveRight: 'rightarrow',
                select: 'enter',
                home: 'home',
                end: 'end',
                pageUp: 'pageup',
                pageDown: 'pagedown',
                shiftPageUp: 'shift+pageup',
                shiftPageDown: 'shift+pagedown',
                controlHome: 'ctrl+home',
                controlEnd: 'ctrl+end'
            };
            return _this;
        }
        Calendar.prototype.render = function () {
            this.globalize = new ej2_base_1.Internationalization(this.locale);
            if (this.getModuleName() === 'calendar') {
                this.element.classList.add(ROOT);
                if (this.enableRtl) {
                    this.element.classList.add(RTL);
                }
                dom_1.attributes(this.element, {
                    'role': 'calendar'
                });
            }
            else {
                this.baseElement = dom_1.createElement('div');
                this.baseElement.classList.add(ROOT);
                if (this.enableRtl) {
                    this.baseElement.classList.add(RTL);
                }
                dom_1.attributes(this.baseElement, {
                    'role': 'calendar'
                });
            }
            this.aniObj = new ej2_base_4.Animation(this.animateOptions);
            this.processDate();
            this.header();
            this.content();
            this.wireEvents();
        };
        Calendar.prototype.processDate = function () {
            this.validateDate();
            this.minMaxUpdate();
        };
        Calendar.prototype.validateDate = function () {
            this.currentDate = this.currentDate ? this.currentDate : this.resetTime(new Date());
            if (!util_1.isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
                this.setProperties({ value: this.resetTime(this.value) }, true);
                this.currentDate = this.resetTime(new Date(this.value));
            }
            if (isNaN(+this.value)) {
                this.setProperties({ value: null }, true);
            }
            if (!(this.min <= this.max)) {
                this.setProperties({ min: this.min }, true);
                this.setProperties({ max: new Date(2099, 11, 31) }, true);
            }
        };
        Calendar.prototype.minMaxUpdate = function () {
            this.min = util_1.isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
            this.max = util_1.isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
            if (!util_1.isNullOrUndefined(this.value) && this.value <= this.min && this.min <= this.max) {
                this.setProperties({ value: this.resetTime(this.min) }, true);
                this.changedArgs = { value: this.value };
            }
            else {
                if (!util_1.isNullOrUndefined(this.value) && this.value >= this.max && this.min <= this.max) {
                    this.setProperties({ value: this.resetTime(this.max) }, true);
                    this.changedArgs = { value: this.value };
                }
            }
            if (this.min <= this.max && this.value && this.value <= this.max && this.value >= this.min) {
                this.currentDate = new Date(this.value);
            }
            else {
                if (this.min <= this.max && !this.value && this.currentDate > this.max) {
                    this.currentDate = new Date(this.max);
                }
                else {
                    if (this.currentDate < this.min) {
                        this.currentDate = new Date(this.min);
                    }
                }
            }
        };
        Calendar.prototype.header = function () {
            var ariaPrevAttrs = {
                'aria-disabled': 'false',
                'aria-label': 'Previous month',
                'role': 'button'
            };
            var ariaNextAttrs = {
                'aria-disabled': 'false',
                'aria-label': 'Next month',
                'role': 'button'
            };
            var ariaTitleAttrs = {
                'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title', 'role': 'button'
            };
            this.headerEle = dom_1.createElement('div', { className: HEADER });
            var iconContainer = dom_1.createElement('div', { className: ICONCONTAINER });
            this.prevIcon = dom_1.createElement('a', { className: '' + PREVICON });
            this.prevIcon.classList.add(RIPPLESTYLE);
            dom_1.attributes(this.prevIcon, ariaPrevAttrs);
            this.nextIcon = dom_1.createElement('a', { className: '' + NEXTICON });
            this.nextIcon.classList.add(RIPPLESTYLE);
            dom_1.attributes(this.nextIcon, ariaNextAttrs);
            this.hdrTitleEle = dom_1.createElement('a', { className: '' + LINK + ' ' + TITLE, attrs: {} });
            dom_1.attributes(this.hdrTitleEle, ariaTitleAttrs);
            this.headerEle.appendChild(this.hdrTitleEle);
            this.prevIcon.appendChild(dom_1.createElement('span', { className: '' + PREVSPAN + ' ' + ICON }));
            this.nextIcon.appendChild(dom_1.createElement('span', { className: '' + NEXTSPAN + ' ' + ICON }));
            iconContainer.appendChild(this.prevIcon);
            iconContainer.appendChild(this.nextIcon);
            this.headerEle.appendChild(iconContainer);
            if (this.getModuleName() === 'calendar') {
                this.element.appendChild(this.headerEle);
            }
            else {
                this.baseElement.appendChild(this.headerEle);
            }
        };
        Calendar.prototype.content = function () {
            this.effect = {
                name: 'SlideDown',
                delay: 0,
                duration: 0,
                timingFunction: 'easeIn'
            };
            this.previousDate = this.value;
            this.contentEle = dom_1.createElement('div', { className: CONTENT });
            this.table = dom_1.createElement('table', { attrs: { tabIndex: '0', 'role': 'grid', 'aria-activedescendant': '' } });
            if (this.getModuleName() === 'calendar') {
                this.element.appendChild(this.contentEle);
            }
            else {
                this.baseElement.appendChild(this.contentEle);
            }
            this.contentEle.appendChild(this.table);
            this.contentHdr();
            this.contentBody();
        };
        Calendar.prototype.getCultureValues = function () {
            var culShortNames = [];
            var cldrObj;
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrObj = (util_1.getValue('days.stand-alone.abbreviated', ej2_base_3.getDefaultDateObject()));
            }
            else {
                cldrObj = (this.getCultureObjects(ej2_base_3.cldrData, '' + this.locale));
            }
            for (var _i = 0, _a = Object.keys(cldrObj); _i < _a.length; _i++) {
                var obj = _a[_i];
                culShortNames.push(util_1.getValue(obj, cldrObj));
            }
            return culShortNames;
        };
        Calendar.prototype.contentHdr = function () {
            if (this.getModuleName() === 'calendar') {
                if (this.element.querySelectorAll('.e-content .e-week-header')[0]) {
                    dom_1.remove(this.element.querySelectorAll('.e-content .e-week-header')[0]);
                }
            }
            else {
                if (this.baseElement.querySelectorAll('.e-content .e-week-header')[0]) {
                    dom_1.remove(this.baseElement.querySelectorAll('.e-content .e-week-header')[0]);
                }
            }
            var daysCount = 6;
            var html = '';
            var shortNames;
            if (this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
                this.setProperties({ firstDayOfWeek: 0 }, true);
            }
            this.theadEle = dom_1.createElement('thead', { className: WEEKHEADER });
            if (this.weekNumber) {
                html += '<th class="e-week-number"></th>';
            }
            shortNames = this.shiftArray(((this.getCultureValues().length > 0 && this.getCultureValues())), this.firstDayOfWeek);
            for (var days = 0; days <= daysCount; days++) {
                html += '<th  class="">' + shortNames[days] + '</th>';
            }
            html = '<tr>' + html + '</tr>';
            this.theadEle.innerHTML = html;
            this.table.appendChild(this.theadEle);
        };
        Calendar.prototype.contentBody = function () {
            if (this.getModuleName() === 'calendar') {
                if (this.element.querySelectorAll('.e-content tbody')[0]) {
                    dom_1.remove(this.element.querySelectorAll('.e-content tbody')[0]);
                }
            }
            else {
                if (this.baseElement.querySelectorAll('.e-content tbody')[0]) {
                    dom_1.remove(this.baseElement.querySelectorAll('.e-content tbody')[0]);
                }
            }
            switch (this.start) {
                case 'year':
                    this.renderYears();
                    break;
                case 'decade':
                    this.renderDecades();
                    break;
                default:
                    this.renderMonths();
            }
        };
        Calendar.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.hdrTitleEle, 'click', this.navTitle, this);
            this.keyboardModule = new ej2_base_2.KeyboardEvents(this.element, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.keyConfigs
            });
        };
        Calendar.prototype.keyActionHandle = function (e) {
            var view = this.getViewNumber(this.currentView());
            this.effect = {
                name: 'SlideDown',
                delay: 0,
                duration: 0,
                timingFunction: 'easeIn'
            };
            var focusedDate = this.tbodyEle.querySelector('tr td.e-focused-date');
            var selectedDate = this.tbodyEle.querySelector('tr td.e-selected');
            var depthValue = this.getViewNumber(this.depth);
            var levelRestrict = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
            switch (e.action) {
                case 'moveLeft':
                    this.KeyboardNavigate(-1, view);
                    e.preventDefault();
                    break;
                case 'moveRight':
                    this.KeyboardNavigate(1, view);
                    e.preventDefault();
                    break;
                case 'moveUp':
                    if (view === 0) {
                        this.KeyboardNavigate(-7, view);
                    }
                    else {
                        this.KeyboardNavigate(-4, view);
                    }
                    e.preventDefault();
                    break;
                case 'moveDown':
                    if (view === 0) {
                        this.KeyboardNavigate(7, view);
                    }
                    else {
                        this.KeyboardNavigate(4, view);
                    }
                    e.preventDefault();
                    break;
                case 'select':
                    if (!util_1.isNullOrUndefined(focusedDate) || !util_1.isNullOrUndefined(selectedDate)) {
                        if (levelRestrict) {
                            var d = new Date(parseInt('' + (focusedDate || selectedDate).id, 0));
                            this.selectDate(e, this.resetTime(d), (focusedDate || selectedDate));
                        }
                        else {
                            this.contentClick(null, --view, (focusedDate || selectedDate));
                        }
                    }
                    break;
                case 'controlUp':
                    this.title();
                    e.preventDefault();
                    break;
                case 'controlDown':
                    if (!util_1.isNullOrUndefined(focusedDate) || !util_1.isNullOrUndefined(selectedDate) && !levelRestrict) {
                        this.contentClick(null, --view, (focusedDate || selectedDate));
                    }
                    e.preventDefault();
                    break;
                case 'home':
                    this.currentDate = this.firstDay(this.currentDate);
                    dom_1.remove(this.tbodyEle);
                    this.renderMonths();
                    e.preventDefault();
                    break;
                case 'end':
                    this.currentDate = this.lastDay(this.currentDate);
                    dom_1.remove(this.tbodyEle);
                    this.renderMonths();
                    e.preventDefault();
                    break;
                case 'pageUp':
                    this.addMonths(this.currentDate, -1);
                    this.navigateTo('month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.addMonths(this.currentDate, 1);
                    this.navigateTo('month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'shiftPageUp':
                    this.addYears(this.currentDate, -1);
                    this.navigateTo('month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'shiftPageDown':
                    this.addYears(this.currentDate, 1);
                    this.navigateTo('month', this.currentDate);
                    e.preventDefault();
                    break;
                case 'controlHome':
                    this.navigateTo('month', new Date(this.currentDate.getFullYear(), 0, 1));
                    e.preventDefault();
                    break;
                case 'controlEnd':
                    this.navigateTo('month', new Date(this.currentDate.getFullYear(), 11, 31));
                    e.preventDefault();
                    break;
            }
        };
        Calendar.prototype.KeyboardNavigate = function (num, currentView) {
            var date = new Date(this.currentDate);
            switch (currentView) {
                case 2:
                    this.addYears(this.currentDate, num);
                    if (this.isMinMaxRange(this.currentDate)) {
                        dom_1.remove(this.tbodyEle);
                        this.renderDecades();
                    }
                    else {
                        this.currentDate = date;
                    }
                    break;
                case 1:
                    this.addMonths(this.currentDate, num);
                    if (this.isMinMaxRange(this.currentDate)) {
                        dom_1.remove(this.tbodyEle);
                        this.renderYears();
                    }
                    else {
                        this.currentDate = date;
                    }
                    break;
                case 0:
                    this.addDay(this.currentDate, num);
                    if (this.isMinMaxRange(this.currentDate)) {
                        dom_1.remove(this.tbodyEle);
                        this.renderMonths();
                    }
                    else {
                        this.currentDate = date;
                    }
                    break;
            }
        };
        Calendar.prototype.preRender = function () {
            var _this = this;
            this.changeHandler = function (e) {
                _this.triggerChange();
            };
            this.navigateHandler = function (e) {
                _this.triggerNavigate();
            };
        };
        ;
        Calendar.prototype.renderMonths = function () {
            var tdEles = [];
            var cellsCount = 42;
            var localDate = this.resetTime(new Date(this.currentDate));
            var numCells = this.weekNumber ? 8 : 7;
            var currentMonth = localDate.getMonth();
            this.titleUpdate(this.currentDate, 'days');
            var d = localDate;
            localDate = new Date(d.getFullYear(), d.getMonth(), 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            while (localDate.getDay() !== this.firstDayOfWeek) {
                this.setTime(localDate, -1 * dayMilliSeconds);
            }
            for (var day = 0; day < cellsCount; ++day) {
                var weekEle = dom_1.createElement('td');
                var weekAnchor = dom_1.createElement('span');
                if (day % 7 === 0 && this.weekNumber) {
                    weekAnchor.textContent = '' + this.getWeek(localDate);
                    weekEle.appendChild(weekAnchor);
                    dom_1.addClass([weekEle], '' + WEEKNUMBER);
                    tdEles.push(weekEle);
                }
                var date = this.globalize.parseDate(this.globalize.formatDate(localDate, { skeleton: 'full' }), { skeleton: 'full' });
                var tdEle = this.dayCell(localDate);
                var title = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'full' });
                var dayLink = dom_1.createElement('span');
                dayLink.textContent = localDate.getDate().toString();
                var disabled = (this.min > localDate) || (this.max < localDate);
                if (disabled) {
                    dom_1.addClass([tdEle], DISABLED);
                    dom_1.addClass([tdEle], OVERLAY);
                }
                else {
                    dayLink.setAttribute('title', '' + title);
                }
                dom_1.attributes(tdEle, { 'aria-label': '' + title });
                if (currentMonth !== localDate.getMonth()) {
                    dom_1.addClass([tdEle], OTHERMONTH);
                }
                if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                    dom_1.addClass([tdEle], WEEKEND);
                }
                this.renderDaycellArg = {
                    date: localDate,
                    isDisabled: false,
                    element: dayLink,
                    isOutOfRange: disabled
                };
                var args = this.renderDaycellArg;
                this.renderDayCellEvent(args);
                if (this.renderDaycellArg.isDisabled && !tdEle.classList.contains(SELECTED)) {
                    dom_1.addClass([tdEle], DISABLED);
                    dom_1.addClass([tdEle], OVERLAY);
                }
                var otherMnthBool = tdEle.classList.contains(OTHERMONTH);
                var disabledCls = tdEle.classList.contains(DISABLED);
                if (!disabledCls) {
                    ej2_base_1.EventHandler.add(tdEle, 'click', this.clickHandler, this);
                }
                if (args.isDisabled && +this.value === +args.date) {
                    this.setProperties({ value: null }, true);
                }
                if (!otherMnthBool && !disabledCls && this.getDateVal(localDate)) {
                    dom_1.addClass([tdEle], SELECTED);
                }
                else {
                    if (this.currentDate.getDate() === localDate.getDate() && !otherMnthBool && !disabledCls) {
                        dom_1.addClass([tdEle], FOCUSEDDATE);
                    }
                    else {
                        if (this.currentDate >= this.max && parseInt(tdEle.id, 0) === +this.max && !otherMnthBool && !disabledCls) {
                            dom_1.addClass([tdEle], FOCUSEDDATE);
                        }
                        if (this.currentDate <= this.min && parseInt(tdEle.id, 0) === +this.min && !otherMnthBool && !disabledCls) {
                            dom_1.addClass([tdEle], FOCUSEDDATE);
                        }
                    }
                }
                if (this.resetTime(date).valueOf() === this.resetTime(new Date()).valueOf()) {
                    dom_1.addClass([tdEle], 'e-today');
                }
                tdEle.appendChild(this.renderDaycellArg.element);
                tdEles.push(tdEle);
                this.addDay(localDate, 1);
            }
            dom_1.setStyleAttribute(this.theadEle, { 'display': '' });
            this.renderTemplate(tdEles, numCells, MONTH);
        };
        Calendar.prototype.renderYears = function () {
            var numCells = 4;
            var days;
            var tdEles = [];
            dom_1.setStyleAttribute(this.theadEle, { 'display': 'none' });
            var valueUtil = util_1.isNullOrUndefined(this.value);
            var curDate = new Date(this.currentDate);
            var mon = curDate.getMonth();
            var yr = curDate.getFullYear();
            var localDate = curDate;
            var curYrs = localDate.getFullYear();
            var minYr = new Date(this.min).getFullYear();
            var minMonth = new Date(this.min).getMonth();
            var maxYr = new Date(this.max).getFullYear();
            var maxMonth = new Date(this.max).getMonth();
            localDate.setMonth(0);
            this.titleUpdate(this.currentDate, 'months');
            var disabled = (this.min > localDate) || (this.max < localDate);
            localDate.setDate(1);
            for (var month = 0; month < 12; ++month) {
                var tdEle = this.dayCell(localDate);
                var dayLink = dom_1.createElement('span');
                var localMonth = (this.value && (this.value).getMonth() === localDate.getMonth());
                var select = (this.value && (this.value).getFullYear() === yr && localMonth);
                dayLink.textContent = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'MMM' });
                if ((this.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                    dom_1.addClass([tdEle], DISABLED);
                }
                else if (!valueUtil && select) {
                    dom_1.addClass([tdEle], SELECTED);
                    this.ariaAttr(tdEle);
                }
                else {
                    if (localDate.getMonth() === mon && this.currentDate.getMonth() === mon) {
                        dom_1.addClass([tdEle], FOCUSEDDATE);
                    }
                }
                localDate.setMonth(localDate.getMonth() + 1);
                if (!tdEle.classList.contains(DISABLED)) {
                    ej2_base_1.EventHandler.add(tdEle, 'click', this.clickHandler, this);
                }
                tdEle.appendChild(dayLink);
                tdEles.push(tdEle);
            }
            this.renderTemplate(tdEles, numCells, YEAR);
        };
        Calendar.prototype.renderDecades = function () {
            var numCells = 4;
            var yearCell = 12;
            var tdEles = [];
            dom_1.setStyleAttribute(this.theadEle, { 'display': 'none' });
            var localDate = new Date(this.currentDate);
            localDate.setMonth(0);
            localDate.setDate(1);
            var localYr = localDate.getFullYear();
            this.hdrTitleEle.textContent = (localYr - localYr % 10) + ' - ' + (localYr - localYr % 10 + (10 - 1));
            var start = new Date(localYr - (localYr % 10) - 1, 0, 1);
            var startYear = start.getFullYear();
            for (var rowIterator = 0; rowIterator < yearCell; ++rowIterator) {
                var year = startYear + rowIterator;
                localDate.setFullYear(year);
                var tdEle = this.dayCell(localDate);
                dom_1.attributes(tdEle, { 'role': 'gridcell' });
                var dayLink = dom_1.createElement('span');
                dayLink.textContent = year.toString();
                if (year < new Date(this.min).getFullYear() || year > new Date(this.max).getFullYear()) {
                    dom_1.addClass([tdEle], DISABLED);
                }
                else if (!util_1.isNullOrUndefined(this.value) && localDate.getFullYear() === (this.value).getFullYear()) {
                    dom_1.addClass([tdEle], SELECTED);
                    this.ariaAttr(tdEle);
                }
                else {
                    if (localDate.getFullYear() === this.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                        dom_1.addClass([tdEle], FOCUSEDDATE);
                    }
                }
                if (!tdEle.classList.contains(DISABLED)) {
                    ej2_base_1.EventHandler.add(tdEle, 'click', this.clickHandler, this);
                }
                tdEle.appendChild(dayLink);
                tdEles.push(tdEle);
                dom_1.setStyleAttribute(this.theadEle, { attrs: { 'display': 'block' } });
            }
            this.renderTemplate(tdEles, numCells, 'e-decade');
        };
        Calendar.prototype.dayCell = function (localDate) {
            var date = this.globalize.parseDate(this.globalize.formatDate(localDate, { skeleton: 'full' }), { skeleton: 'full' });
            var value = this.resetTime(date).valueOf();
            return dom_1.createElement('td', { attrs: { 'id': '' + util_1.getUniqueID('' + value), 'aria-selected': 'false', 'role': 'grid-cell' } });
        };
        Calendar.prototype.firstDay = function (date) {
            return new Date(date.getFullYear(), date.getMonth());
        };
        Calendar.prototype.lastDay = function (date) {
            var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var timeOffset = Math.abs(lastDate.getTimezoneOffset() - this.firstDay(date).getTimezoneOffset());
            if (timeOffset) {
                lastDate.setHours(this.firstDay(date).getHours() + (timeOffset / 60));
            }
            return lastDate;
        };
        ;
        Calendar.prototype.renderTemplate = function (elements, numCells, classNm) {
            var view = this.getViewNumber(this.currentView());
            var trEle;
            this.tbodyEle = dom_1.createElement('tbody', { attrs: { 'role': 'rowgroup' } });
            this.table.appendChild(this.tbodyEle);
            dom_1.removeClass([this.contentEle], [MONTH, DECADE, YEAR]);
            dom_1.addClass([this.contentEle], classNm);
            var weekNumCell = 41;
            var numberCell = 35;
            var otherMonthCell = 6;
            var row = numCells;
            var rowIterator = 0;
            for (var dayCell = 0; dayCell < elements.length / numCells; ++dayCell) {
                trEle = dom_1.createElement('tr', { attrs: { 'role': 'row' } });
                for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                    if (elements[rowIterator].children[0]) {
                        dom_1.addClass([elements[rowIterator].children[0]], [LINK, RIPPLESTYLE]);
                    }
                    trEle.appendChild(elements[rowIterator]);
                    if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                        dom_1.addClass([trEle], OTHERMONTHROW);
                    }
                    if (this.weekNumber) {
                        if (rowIterator === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                            dom_1.addClass([trEle], OTHERMONTHROW);
                        }
                    }
                    else {
                        if (rowIterator === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                            dom_1.addClass([trEle], OTHERMONTHROW);
                        }
                    }
                }
                row = row + numCells;
                rowIterator = rowIterator + 0;
                var ani = {};
                this.tbodyEle.appendChild(trEle);
                if (elements[dayCell].children[0]) {
                    dom_1.addClass([elements[dayCell].children[0]], [LINK, RIPPLESTYLE]);
                }
            }
            this.aniObj.animate(this.table.querySelector('tbody'), this.effect);
            this.iconHandler();
            this.changedArgs = { value: this.value };
            if (view !== this.getViewNumber(this.currentView()) || (view === 0 && view !== this.getViewNumber(this.currentView()))) {
                this.navigateHandler();
            }
            this.changeHandler();
            dom_1.addClass([this.headerEle], 'e-' + this.currentView());
        };
        Calendar.prototype.clickHandler = function (e) {
            var eve = e.currentTarget;
            e.preventDefault();
            var view = this.getViewNumber(this.currentView());
            if (eve.classList.contains(OTHERMONTH)) {
                this.value = this.getIdValue(e, null);
                this.contentClick(e, 0, null);
            }
            else if (view === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.contentClick(e, 1, null);
            }
            else if (2 === view) {
                this.contentClick(e, 1, null);
            }
            else if (!eve.classList.contains(OTHERMONTH) && view === 0) {
                this.selectDate(e, this.getIdValue(e, null), null);
            }
            else {
                this.contentClick(e, 0, eve);
            }
        };
        Calendar.prototype.contentClick = function (e, view, ele) {
            var currentView = this.getViewNumber(this.currentView());
            var d = this.getIdValue(e, ele);
            switch (view) {
                case 0:
                    if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                        dom_1.remove(this.tbodyEle);
                        this.renderMonths();
                    }
                    else {
                        this.currentDate.setMonth(d.getMonth());
                        if (d.getMonth() > 0 && this.currentDate.getMonth() !== d.getMonth()) {
                            this.currentDate.setDate(0);
                        }
                        this.currentDate.setFullYear(d.getFullYear());
                        this.effect = {
                            name: 'ZoomIn',
                            delay: 0,
                            duration: 400, timingFunction: 'easeOut'
                        };
                        dom_1.remove(this.tbodyEle);
                        this.renderMonths();
                    }
                    break;
                case 1:
                    if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                        this.selectDate(e, d, null);
                    }
                    else {
                        this.currentDate.setFullYear(d.getFullYear());
                        this.effect = {
                            name: 'ZoomIn',
                            delay: 0,
                            duration: 400, timingFunction: 'easeOut'
                        };
                        dom_1.remove(this.tbodyEle);
                        this.renderYears();
                    }
            }
        };
        Calendar.prototype.switchView = function (view) {
            switch (view) {
                case 0:
                    dom_1.remove(this.tbodyEle);
                    this.renderMonths();
                    break;
                case 1:
                    dom_1.remove(this.tbodyEle);
                    this.renderYears();
                    break;
                case 2:
                    dom_1.remove(this.tbodyEle);
                    this.renderDecades();
            }
        };
        Calendar.prototype.getModuleName = function () {
            return 'calendar';
        };
        Calendar.prototype.getPersistData = function () {
            var keyEntity = ['value'];
            return this.addOnPersist(keyEntity);
        };
        Calendar.prototype.onPropertyChanged = function (newProp, oldProp) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'value':
                        if (isNaN(+this.value)) {
                            this.setProperties({ value: oldProp.value }, true);
                        }
                        this.validateDate();
                        this.minMaxUpdate();
                        this.setvalue();
                        break;
                    case 'enableRtl':
                        if (newProp.enableRtl) {
                            if (this.getModuleName() === 'calendar') {
                                this.element.classList.add('e-rtl');
                            }
                            else {
                                this.baseElement.classList.add('e-rtl');
                            }
                        }
                        else {
                            if (this.getModuleName() === 'calendar') {
                                this.element.classList.remove('e-rtl');
                            }
                            else {
                                this.baseElement.classList.remove('e-rtl');
                            }
                        }
                        break;
                    case 'weekNumber':
                    case 'firstDayOfWeek':
                        this.contentHdr();
                        this.contentBody();
                        break;
                    case 'min':
                    case 'max':
                        this.setProperties({ start: this.currentView() }, true);
                        dom_1.remove(this.tbodyEle);
                        this.effect = {
                            name: 'SlideDown',
                            delay: 0,
                            duration: 200, timingFunction: 'easeIn'
                        };
                        this.minMaxUpdate();
                        this.contentBody();
                        break;
                    case 'locale':
                        this.globalize = new ej2_base_1.Internationalization(this.locale);
                        this.contentHdr();
                        this.contentBody();
                        break;
                }
            }
        };
        Calendar.prototype.setvalue = function () {
            this.tbodyEle.remove();
            this.setProperties({ start: this.currentView() }, true);
            this.effect = {
                name: 'SlideDown',
                delay: 0,
                duration: 200, timingFunction: 'easeIn'
            };
            this.contentBody();
        };
        Calendar.prototype.titleUpdate = function (date, view) {
            var globalize = new ej2_base_1.Internationalization(this.locale);
            switch (view) {
                case 'days':
                    this.hdrTitleEle.textContent = globalize.formatDate(date, { type: 'date', skeleton: 'yMMMM' });
                    break;
                case 'months':
                    this.hdrTitleEle.textContent = globalize.formatDate(date, { type: 'date', skeleton: 'y' });
            }
        };
        Calendar.prototype.ariaAttr = function (tdEle) {
            tdEle.setAttribute('aria-selected', 'true');
            dom_1.attributes(this.table, {
                'aria-activedescendant': '' + tdEle.getAttribute('id')
            });
        };
        Calendar.prototype.iconHandler = function () {
            new Date(this.currentDate).setDate(1);
            switch (this.currentView()) {
                case 'month':
                    this.prevIconHandler(this.compareMonth(new Date(this.currentDate), this.min) < 1);
                    this.nextIconHandler(this.compareMonth(new Date(this.currentDate), this.max) > -1);
                    break;
                case 'year':
                    this.prevIconHandler(this.compareYear(new Date(this.currentDate), this.min) < 1);
                    this.nextIconHandler(this.compareYear(new Date(this.currentDate), this.max) > -1);
                    break;
                case 'decade':
                    this.prevIconHandler(this.compareDecade(new Date(this.currentDate), this.min) < 1);
                    this.nextIconHandler(this.compareDecade(new Date(this.currentDate), this.max) > -1);
            }
        };
        Calendar.prototype.destroy = function () {
            if (this.getModuleName() === 'calendar') {
                this.element.classList.remove(ROOT);
            }
            else {
                this.baseElement.classList.remove(ROOT);
            }
            ej2_base_1.EventHandler.remove(this.hdrTitleEle, 'click', this.navTitle);
            this.prevIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            _super.prototype.destroy.call(this);
        };
        Calendar.prototype.title = function () {
            var currentView = this.getViewNumber(this.currentView());
            this.effect = {
                name: 'ZoomOut',
                delay: 0,
                duration: 350, timingFunction: 'easeOut'
            };
            this.switchView(++currentView);
        };
        Calendar.prototype.getViewNumber = function (stringVal) {
            if (stringVal === 'month') {
                return 0;
            }
            else if (stringVal === 'year') {
                return 1;
            }
            else {
                return 2;
            }
        };
        Calendar.prototype.navTitle = function () {
            this.title();
        };
        Calendar.prototype.previous = function () {
            this.effect = {
                name: 'SlideUp',
                delay: 0,
                duration: 370, timingFunction: 'easeIn'
            };
            var currentView = this.getViewNumber(this.currentView());
            switch (this.currentView()) {
                case 'month':
                    this.addMonths(this.currentDate, -1);
                    this.switchView(currentView);
                    break;
                case 'year':
                    this.addYears(this.currentDate, -1);
                    this.switchView(currentView);
                    break;
                case 'decade':
                    this.addYears(this.currentDate, -10);
                    this.switchView(currentView);
                    break;
            }
        };
        Calendar.prototype.navPrev = function () {
            this.previous();
            this.triggerNavigate();
        };
        Calendar.prototype.next = function () {
            this.effect = {
                name: 'SlideDown',
                delay: 0,
                duration: 370, timingFunction: 'easeOut'
            };
            var currentView = this.getViewNumber(this.currentView());
            switch (this.currentView()) {
                case 'month':
                    this.addMonths(this.currentDate, 1);
                    this.switchView(currentView);
                    break;
                case 'year':
                    this.addYears(this.currentDate, 1);
                    this.switchView(currentView);
                    break;
                case 'decade':
                    this.addYears(this.currentDate, 10);
                    this.switchView(currentView);
                    break;
            }
        };
        Calendar.prototype.navNext = function () {
            this.next();
            this.triggerNavigate();
        };
        Calendar.prototype.navigateTo = function (view, date) {
            this.minMaxUpdate();
            if (+date >= +this.min && +date <= +this.max) {
                this.currentDate = date;
            }
            if (+date <= +this.min) {
                this.currentDate = new Date(this.min);
            }
            if (+date >= +this.max) {
                this.currentDate = new Date(this.max);
            }
            this.switchView(this.getViewNumber(view));
        };
        Calendar.prototype.currentView = function () {
            if (this.contentEle.classList.contains(YEAR)) {
                return 'year';
            }
            else if (this.contentEle.classList.contains(DECADE)) {
                return 'decade';
            }
            else {
                return 'month';
            }
        };
        Calendar.prototype.getDateVal = function (date) {
            return (!util_1.isNullOrUndefined(this.value) && date.getDate() === (this.value).getDate()
                && date.getMonth() === (this.value).getMonth() && date.getFullYear() === (this.value).getFullYear());
        };
        Calendar.prototype.getCultureObjects = function (ld, c) {
            return util_1.getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.format.abbreviated', ld);
        };
        ;
        Calendar.prototype.getWeek = function (d) {
            var currentDate = new Date(d).valueOf();
            var date = new Date(d.getFullYear(), 0, 1).valueOf();
            var a = (currentDate - date);
            return Math.ceil((((a) / dayMilliSeconds) + new Date(date).getDay() + 1) / 7);
        };
        Calendar.prototype.setTime = function (date, time) {
            var tzOffsetBefore = date.getTimezoneOffset();
            var d = new Date(date.getTime() + time);
            var tzOffsetDiff = d.getTimezoneOffset() - tzOffsetBefore;
            date.setTime(d.getTime() + tzOffsetDiff * dayMilliSeconds);
        };
        Calendar.prototype.addMonths = function (date, i) {
            var day = date.getDate();
            date.setDate(1);
            date.setMonth(date.getMonth() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        };
        Calendar.prototype.addYears = function (date, i) {
            var day = date.getDate();
            date.setDate(1);
            date.setFullYear(date.getFullYear() + i);
            date.setDate(Math.min(day, this.getMaxDays(date)));
        };
        Calendar.prototype.getIdValue = function (e, ele) {
            var eve;
            if (e) {
                eve = e.currentTarget;
            }
            else {
                eve = ele;
            }
            var dateString = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), { skeleton: 'full' });
            return this.resetTime(this.globalize.parseDate(dateString, { skeleton: 'full', type: 'date' }));
        };
        Calendar.prototype.selectDate = function (e, date, element) {
            var ele = element || e.currentTarget;
            this.setProperties({ value: new Date(date) }, true);
            this.currentDate = new Date(date);
            if (!util_1.isNullOrUndefined(this.tbodyEle.querySelector('.' + SELECTED))) {
                dom_1.removeClass([this.tbodyEle.querySelector('.' + SELECTED)], SELECTED);
            }
            if (!util_1.isNullOrUndefined(this.tbodyEle.querySelector('.' + FOCUSEDDATE))) {
                dom_1.removeClass([this.tbodyEle.querySelector('.' + FOCUSEDDATE)], FOCUSEDDATE);
            }
            dom_1.addClass([ele], SELECTED);
            this.ariaAttr(ele);
            this.setProperties({ value: new Date(date) }, true);
            this.changedArgs = { value: this.value };
            this.changeHandler();
        };
        Calendar.prototype.prevIconHandler = function (disabled) {
            if (disabled) {
                ej2_base_1.EventHandler.remove(this.prevIcon, 'click', this.navPrev);
                dom_1.addClass([this.prevIcon], '' + DISABLED);
                dom_1.addClass([this.prevIcon], '' + OVERLAY);
                this.prevIcon.setAttribute('aria-disabled', 'true');
            }
            else {
                ej2_base_1.EventHandler.remove(this.prevIcon, 'click', this.navPrev);
                ej2_base_1.EventHandler.add(this.prevIcon, 'click', this.navPrev, this);
                dom_1.removeClass([this.prevIcon], '' + DISABLED);
                dom_1.removeClass([this.prevIcon], '' + OVERLAY);
                this.prevIcon.setAttribute('aria-disabled', 'false');
            }
        };
        Calendar.prototype.renderDayCellEvent = function (args) {
            util_1.extend(this.renderDaycellArg, { name: 'renderDayCell' });
            this.trigger('renderDayCell', args);
        };
        Calendar.prototype.navigatedEvent = function () {
            util_1.extend(this.navigatedArgs, { name: 'navigated' });
            this.trigger('navigated', this.navigatedArgs);
        };
        Calendar.prototype.triggerNavigate = function () {
            this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
            this.navigatedEvent();
        };
        Calendar.prototype.changeEvent = function () {
            this.trigger('change', this.changedArgs);
        };
        Calendar.prototype.triggerChange = function () {
            util_1.extend(this.changedArgs, { name: 'change' });
            if (+this.value !== Number.NaN && +this.value !== +this.previousDate) {
                this.changeEvent();
            }
            this.previousDate = this.value;
        };
        Calendar.prototype.nextIconHandler = function (disabled) {
            if (disabled) {
                ej2_base_1.EventHandler.remove(this.nextIcon, 'click', this.navNext);
                dom_1.addClass([this.nextIcon], DISABLED);
                dom_1.addClass([this.nextIcon], OVERLAY);
                this.nextIcon.setAttribute('aria-disabled', 'true');
            }
            else {
                ej2_base_1.EventHandler.remove(this.nextIcon, 'click', this.navNext);
                ej2_base_1.EventHandler.add(this.nextIcon, 'click', this.navNext, this);
                dom_1.removeClass([this.nextIcon], DISABLED);
                dom_1.removeClass([this.nextIcon], OVERLAY);
                this.nextIcon.setAttribute('aria-disabled', 'false');
            }
        };
        Calendar.prototype.compare = function (startDate, endDate, modifier) {
            var start = endDate.getFullYear();
            var end;
            var result;
            end = start;
            result = 0;
            if (modifier) {
                start = start - start % modifier;
                end = start - start % modifier + modifier - 1;
            }
            if (startDate.getFullYear() > end) {
                result = 1;
            }
            else if (startDate.getFullYear() < start) {
                result = -1;
            }
            return result;
        };
        Calendar.prototype.isMinMaxRange = function (date) {
            return +date >= +this.min && +date <= +this.max;
        };
        Calendar.prototype.compareYear = function (start, end) {
            return this.compare(start, end, 0);
        };
        Calendar.prototype.compareDecade = function (start, end) {
            return this.compare(start, end, 10);
        };
        Calendar.prototype.shiftArray = function (array, i) {
            return array.slice(i).concat(array.slice(0, i));
        };
        Calendar.prototype.resetTime = function (date) {
            date.setHours(0, 0, 0, 0);
            return date;
        };
        Calendar.prototype.addDay = function (date, i) {
            date.setDate(date.getDate() + i);
        };
        Calendar.prototype.getMaxDays = function (d) {
            var date;
            var month;
            var tmpDate = new Date(d);
            date = 28;
            month = tmpDate.getMonth();
            while (tmpDate.getMonth() === month) {
                ++date;
                tmpDate.setDate(date);
            }
            return date - 1;
        };
        Calendar.prototype.compareMonth = function (start, end) {
            var result;
            if (start.getFullYear() > end.getFullYear()) {
                result = 1;
            }
            else if (start.getFullYear() < end.getFullYear()) {
                result = -1;
            }
            else {
                result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() > end.getMonth() ? 1 : -1;
            }
            return result;
        };
        return Calendar;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_1.Property(null)
    ], Calendar.prototype, "value", void 0);
    __decorate([
        ej2_base_1.Property(new Date(1900, 0, 1))
    ], Calendar.prototype, "min", void 0);
    __decorate([
        ej2_base_1.Property(new Date(2099, 11, 31))
    ], Calendar.prototype, "max", void 0);
    __decorate([
        ej2_base_1.Property(0)
    ], Calendar.prototype, "firstDayOfWeek", void 0);
    __decorate([
        ej2_base_1.Property('month')
    ], Calendar.prototype, "start", void 0);
    __decorate([
        ej2_base_1.Property('month')
    ], Calendar.prototype, "depth", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], Calendar.prototype, "weekNumber", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Calendar.prototype, "created", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Calendar.prototype, "destroyed", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Calendar.prototype, "change", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Calendar.prototype, "navigated", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Calendar.prototype, "renderDayCell", void 0);
    Calendar = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], Calendar);
    exports.Calendar = Calendar;
    exports.calendarBuilder = ej2_base_1.CreateBuilder(Calendar);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(137)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, calendar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(calendar_1);
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


/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(138)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, calendar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(calendar_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

},[106]);