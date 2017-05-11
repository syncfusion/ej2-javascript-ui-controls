this["ej"] = this["ej"] || {}; this["ej"]["toolbarModule"] =
webpackJsonpej__name_Module([2],{

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

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(189)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, toolbar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(toolbar_1);
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

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(131)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, component_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(component_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(39), __webpack_require__(38), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, parser_base_1, intl_base_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var abbreviateRegexGlobal = /\/MMMMM|MMMM|MMM|a|LLL|EEEEE|EEEE|E|K|ccc|G+|z+/gi;
    var standalone = 'stand-alone';
    var weekdayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    exports.basicPatterns = ['short', 'medium', 'long', 'full'];
    var timeSetter = {
        m: 'getMinutes',
        h: 'getHours',
        H: 'getHours',
        s: 'getSeconds',
        d: 'getDate',
    };
    var datePartMatcher = {
        'M': 'month',
        'd': 'day',
        'E': 'weekday',
        'c': 'weekday',
        'y': 'year',
        'm': 'minute',
        'h': 'hour',
        'H': 'hour',
        's': 'second',
        'L': 'month',
        'a': 'designator',
        'z': 'timeZone',
        'Z': 'timeZone',
        'G': 'era'
    };
    var timeSeparator = 'timeSeparator';
    var DateFormat = (function () {
        function DateFormat() {
        }
        DateFormat.dateFormat = function (culture, option, cldr) {
            var _this = this;
            var dependable = intl_base_1.IntlBase.getDependables(cldr, culture);
            var formatOptions = {};
            var resPattern = option.format || intl_base_1.IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type);
            formatOptions.dateSeperator = intl_base_1.IntlBase.getDateSeparator(dependable.dateObject);
            if (util_1.isUndefined(resPattern)) {
                util_1.throwError('Format options or type given must be invalid');
            }
            else {
                formatOptions.pattern = resPattern;
                formatOptions.numMapper = parser_base_1.ParserBase.getNumberMapper(dependable.parserObject, parser_base_1.ParserBase.getNumberingSystem(cldr));
                var patternMatch = resPattern.match(abbreviateRegexGlobal) || [];
                for (var _i = 0, patternMatch_1 = patternMatch; _i < patternMatch_1.length; _i++) {
                    var str = patternMatch_1[_i];
                    var len = str.length;
                    var char = str[0];
                    if (char === 'K') {
                        char = 'h';
                    }
                    var charKey = datePartMatcher[char];
                    switch (char) {
                        case 'E':
                        case 'c':
                            formatOptions.weekday = dependable.dateObject[intl_base_1.IntlBase.days][standalone][intl_base_1.IntlBase.monthIndex[len]];
                            break;
                        case 'M':
                        case 'L':
                            formatOptions.month = dependable.dateObject[intl_base_1.IntlBase.month][standalone][intl_base_1.IntlBase.monthIndex[len]];
                            break;
                        case 'a':
                            formatOptions.designator = util_1.getValue('dayPeriods.format.wide', dependable.dateObject);
                            break;
                        case 'G':
                            var eText = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                            formatOptions.era = util_1.getValue('eras.' + eText, dependable.dateObject);
                            break;
                        case 'z':
                            formatOptions.timeZone = util_1.getValue('dates.timeZoneNames', dependable.parserObject);
                            break;
                    }
                }
            }
            return function (value) {
                if (isNaN(value.getDate())) {
                    return null;
                }
                return _this.intDateFormatter(value, formatOptions);
            };
        };
        DateFormat.intDateFormatter = function (value, options) {
            var pattern = options.pattern;
            var ret = '';
            var matches = pattern.match(intl_base_1.IntlBase.dateParseRegex);
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                var length_1 = match.length;
                var char = match[0];
                if (char === 'K') {
                    char = 'h';
                }
                var curval = void 0;
                var isNumber = void 0;
                var processNumber = void 0;
                var curstr = '';
                switch (char) {
                    case 'M':
                    case 'L':
                        curval = value.getMonth() + 1;
                        if (length_1 > 2) {
                            ret += options.month[curval];
                        }
                        else {
                            isNumber = true;
                        }
                        break;
                    case 'E':
                    case 'c':
                        ret += options.weekday[weekdayKey[value.getDay()]];
                        break;
                    case 'H':
                    case 'h':
                    case 'm':
                    case 's':
                    case 'd':
                        isNumber = true;
                        curval = value[timeSetter[char]]();
                        if (char === 'h') {
                            curval = curval % 12 || 12;
                        }
                        break;
                    case 'y':
                        processNumber = true;
                        curstr += value.getFullYear();
                        if (length_1 === 2) {
                            curstr = curstr.substr(curstr.length - 2);
                        }
                        break;
                    case 'a':
                        var desig = value.getHours() < 12 ? 'am' : 'pm';
                        ret += options.designator[desig];
                        break;
                    case 'G':
                        var dec = value.getFullYear() < 0 ? 0 : 1;
                        ret += options.era[dec];
                        break;
                    case '\'':
                        ret += (match === '\'\'') ? '\'' : match.replace(/\'/g, '');
                        break;
                    case 'z':
                        var timezone = value.getTimezoneOffset();
                        var pattern_1 = (length_1 < 4) ? '+H;-H' : options.timeZone.hourFormat;
                        pattern_1 = pattern_1.replace(/:/g, options.numMapper.timeSeparator);
                        if (timezone === 0) {
                            ret += options.timeZone.gmtZeroFormat;
                        }
                        else {
                            processNumber = true;
                            curstr = this.getTimeZoneValue(timezone, pattern_1);
                        }
                        curstr = options.timeZone.gmtFormat.replace(/\{0\}/, curstr);
                        break;
                    case ':':
                        ret += options.numMapper.numberSymbols[timeSeparator];
                        break;
                    case '/':
                        ret += options.dateSeperator;
                        break;
                    default:
                        ret += match;
                }
                if (isNumber) {
                    processNumber = true;
                    curstr = this.checkTwodigitNumber(curval, length_1);
                }
                if (processNumber) {
                    ret += parser_base_1.ParserBase.convertValueParts(curstr, intl_base_1.IntlBase.latnParseRegex, options.numMapper.mapper);
                }
            }
            return ret;
        };
        DateFormat.checkTwodigitNumber = function (val, len) {
            var ret = val + '';
            if (len === 2 && ret.length !== 2) {
                return '0' + ret;
            }
            return ret;
        };
        DateFormat.getTimeZoneValue = function (tVal, pattern) {
            var _this = this;
            var splt = pattern.split(';');
            var curPattern = splt[tVal > 0 ? 1 : 0];
            var no = Math.abs(tVal);
            return curPattern = curPattern.replace(/HH?|mm/g, function (str) {
                var len = str.length;
                var ishour = str.indexOf('H') !== -1;
                return _this.checkTwodigitNumber(Math.floor(ishour ? (no / 60) : (no % 60)), len);
            });
        };
        return DateFormat;
    }());
    exports.DateFormat = DateFormat;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(38), __webpack_require__(39), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, intl_base_1, parser_base_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var number = 'numbers';
    var defNoSystem = 'defaultNumberingSystem';
    var noSystem = 'numberingSystem';
    var standalone = 'stand-alone';
    var curWeekDay = 'curWeekDay';
    var latnRegex = /^[0-9]*$/;
    var abbreviateRegex = /\/MMMMM|MMMM|MMM|a|LLL|EEEEE|EEEE|E|ccc/;
    var timeSetter = {
        minute: 'setMinutes',
        hour: 'setHours',
        second: 'setSeconds',
        day: 'setDate',
        month: 'setMonth'
    };
    var month = 'months';
    var datePartMatcher = {
        'M': 'month',
        'd': 'day',
        'E': 'weekday',
        'c': 'weekday',
        'y': 'year',
        'm': 'minute',
        'h': 'hour',
        'H': 'hour',
        's': 'second',
        'L': 'month',
        'a': 'designator',
        'z': 'timeZone',
        'Z': 'timeZone',
        'G': 'era'
    };
    var DateParser = (function () {
        function DateParser() {
        }
        DateParser.dateParser = function (culture, option, cldr) {
            var _this = this;
            var dependable = intl_base_1.IntlBase.getDependables(cldr, culture);
            var numOptions = parser_base_1.ParserBase.getCurrentNumericOptions(dependable.parserObject, parser_base_1.ParserBase.getNumberingSystem(cldr));
            var parseOptions = {};
            var resPattern = option.format || intl_base_1.IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type);
            var regexString = '';
            var hourOnly;
            if (util_1.isUndefined(resPattern)) {
                util_1.throwError('Format options or type given must be invalid');
            }
            else {
                parseOptions = { pattern: resPattern, evalposition: {} };
                var patternMatch = resPattern.match(intl_base_1.IntlBase.dateParseRegex) || [];
                var length_1 = patternMatch.length;
                var nRegx = numOptions.numericRegex;
                for (var i = 0; i < length_1; i++) {
                    var str = patternMatch[i];
                    var len = str.length;
                    var char = (str[0] === 'K') ? 'h' : str[0];
                    var isNumber = void 0;
                    var canUpdate = void 0;
                    var charKey = datePartMatcher[char];
                    var optional = (len === 2) ? '' : '?';
                    switch (char) {
                        case 'E':
                        case 'c':
                            var weekObject = parser_base_1.ParserBase.reverseObject(dependable.dateObject[intl_base_1.IntlBase.days][standalone][intl_base_1.IntlBase.monthIndex[len]]);
                            regexString += '(' + Object.keys(weekObject).join('|') + ')';
                            break;
                        case 'M':
                        case 'L':
                        case 'd':
                        case 'm':
                        case 's':
                        case 'h':
                        case 'H':
                            canUpdate = true;
                            if ((char === 'M' || char === 'L') && len > 2) {
                                parseOptions[charKey] = parser_base_1.ParserBase.reverseObject(dependable.dateObject[month][standalone][intl_base_1.IntlBase.monthIndex[len]]);
                                regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + ')';
                            }
                            else {
                                isNumber = true;
                                regexString += '(' + nRegx + nRegx + optional + ')';
                            }
                            if (char === 'h') {
                                parseOptions.hour12 = true;
                            }
                            break;
                        case 'y':
                            canUpdate = isNumber = true;
                            if (len === 2) {
                                regexString += '(' + nRegx + nRegx + ')';
                            }
                            else {
                                regexString += '(' + nRegx + '+)';
                            }
                            break;
                        case 'a':
                            canUpdate = true;
                            parseOptions[charKey] = parser_base_1.ParserBase.reverseObject(util_1.getValue('dayPeriods.format.wide', dependable.dateObject));
                            regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + ')';
                            break;
                        case 'G':
                            canUpdate = true;
                            var eText = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                            parseOptions[charKey] = parser_base_1.ParserBase.reverseObject(util_1.getValue('eras.' + eText, dependable.dateObject));
                            regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + '?)';
                            break;
                        case 'z':
                            var tval = new Date().getTimezoneOffset();
                            canUpdate = (tval !== 0);
                            parseOptions[charKey] = util_1.getValue('dates.timeZoneNames', dependable.parserObject);
                            var tzone = parseOptions[charKey];
                            hourOnly = (len < 4);
                            var hpattern = hourOnly ? '+H;-H' : tzone.hourFormat;
                            regexString += '(' + this.parseTimeZoneRegx(hpattern, tzone, nRegx) + ')?';
                            break;
                        case '\'':
                            var iString = str.replace(/\'/g, '');
                            regexString += '(' + iString + ')?';
                            break;
                        default:
                            regexString += '(.)?';
                            break;
                    }
                    if (canUpdate) {
                        parseOptions.evalposition[charKey] = { isNumber: isNumber, pos: i + 1, hourOnly: hourOnly };
                    }
                    if (i === length_1 - 1 && !util_1.isNullOrUndefined(regexString)) {
                        parseOptions.parserRegex = new RegExp('^' + regexString + '$');
                    }
                }
            }
            return function (value) {
                var parsedDateParts = _this.internalDateParse(value, parseOptions, numOptions);
                if (util_1.isNullOrUndefined(parsedDateParts) || !Object.keys(parsedDateParts).length) {
                    return null;
                }
                return _this.getDateObject(parsedDateParts);
            };
        };
        DateParser.getDateObject = function (options, value) {
            var res = value || new Date();
            var tKeys = ['hour', 'minute', 'second', 'month', 'day'];
            var y = options.year;
            var desig = options.designator;
            var tzone = options.timeZone;
            if (!util_1.isUndefined(y)) {
                var len = (y + '').length;
                if (len === 2) {
                    var century = Math.floor(res.getFullYear() / 100) * 100;
                    y += century;
                }
                res.setFullYear(y);
            }
            for (var _i = 0, tKeys_1 = tKeys; _i < tKeys_1.length; _i++) {
                var key = tKeys_1[_i];
                var tValue = options[key];
                if (!util_1.isUndefined(tValue)) {
                    if (key === 'month') {
                        tValue -= 1;
                        if (tValue < 0 || tValue > 11) {
                            return new Date('invalid');
                        }
                        var pDate = res.getDate();
                        res.setDate(1);
                        res[timeSetter[key]](tValue);
                        var lDate = new Date(res.getFullYear(), tValue + 1, 0).getDate();
                        res.setDate(pDate < lDate ? pDate : lDate);
                    }
                    else {
                        if (key === 'day' && (tValue < 1 || tValue > 31)) {
                            return new Date('invalid');
                        }
                        res[timeSetter[key]](tValue);
                    }
                }
            }
            if (!util_1.isUndefined(desig)) {
                var hour = res.getHours();
                if (desig === 'pm') {
                    res.setHours(hour + (hour === 12 ? 0 : 12));
                }
                else if (hour === 12) {
                    res.setHours(0);
                }
            }
            if (!util_1.isUndefined(tzone)) {
                var tzValue = tzone - res.getTimezoneOffset();
                if (tzValue !== 0) {
                    res.setMinutes(res.getMinutes() + tzValue);
                }
            }
            return res;
        };
        DateParser.internalDateParse = function (value, parseOptions, num) {
            var matches = value.match(parseOptions.parserRegex);
            var retOptions = { 'hour': 0, 'minute': 0, 'second': 0 };
            var nRegx = num.numericRegex;
            if (util_1.isNullOrUndefined(matches)) {
                return null;
            }
            else {
                var props = Object.keys(parseOptions.evalposition);
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var prop = props_1[_i];
                    var curObject = parseOptions.evalposition[prop];
                    var matchString = matches[curObject.pos];
                    if (curObject.isNumber) {
                        retOptions[prop] = this.internalNumberParser(matchString, num);
                    }
                    else {
                        if (prop === 'timeZone' && !util_1.isUndefined(matchString)) {
                            var pos = curObject.pos;
                            var val = void 0;
                            var tmatch = matches[pos + 1];
                            var flag = !util_1.isUndefined(tmatch);
                            if (curObject.hourOnly) {
                                val = this.getZoneValue(flag, tmatch, matches[pos + 4], num) * 60;
                            }
                            else {
                                val = this.getZoneValue(flag, tmatch, matches[pos + 7], num) * 60;
                                val += this.getZoneValue(flag, matches[pos + 4], matches[pos + 10], num);
                            }
                            if (!util_1.isNullOrUndefined(val)) {
                                retOptions[prop] = val;
                            }
                        }
                        else {
                            retOptions[prop] = parseOptions[prop][matchString];
                        }
                    }
                }
                if (parseOptions.hour12) {
                    retOptions.hour12 = true;
                }
            }
            return retOptions;
        };
        DateParser.internalNumberParser = function (value, option) {
            value = parser_base_1.ParserBase.convertValueParts(value, option.numberParseRegex, option.numericPair);
            if (latnRegex.test(value)) {
                return +value;
            }
            return null;
        };
        DateParser.parseTimeZoneRegx = function (hourFormat, tZone, nRegex) {
            var pattern = tZone.gmtFormat;
            var ret;
            var result;
            var cRegex = '(' + nRegex + ')' + '(' + nRegex + ')';
            var splitStr;
            ret = hourFormat.replace('+', '\\+');
            if (hourFormat.indexOf('HH') !== -1) {
                ret = ret.replace(/HH|mm/g, '(' + cRegex + ')');
            }
            else {
                ret = ret.replace(/H|m/g, '(' + cRegex + '?)');
            }
            splitStr = (ret.split(';').map(function (str) {
                return pattern.replace('{0}', str);
            }));
            ret = splitStr.join('|') + '|' + tZone.gmtZeroFormat;
            return ret;
        };
        DateParser.getZoneValue = function (flag, val1, val2, num) {
            var value = this.internalNumberParser(flag ? val1 : val2, num);
            if (flag) {
                return -value;
            }
            return value;
        };
        return DateParser;
    }());
    exports.DateParser = DateParser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(39), __webpack_require__(38)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, parser_base_1, intl_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formatRegex = /(^[ncpa]{1})([0-1]?[0-9]|20)?$/i;
    var parseRegex = /^([^0-9]*)(([0-9,]*[0-9]+)(\.[0-9]+)?)([Ee][+-]?[0-9]+)?([^0-9]*)$/;
    var groupRegex = /,/g;
    var latnDecimalRegex = /^[0-9]*(\.[0-9]+)?$/;
    var keys = ['minusSign', 'infinity'];
    var NumberParser = (function () {
        function NumberParser() {
        }
        NumberParser.numberParser = function (culture, option, cldr) {
            var _this = this;
            var dependable = intl_base_1.IntlBase.getDependables(cldr, culture, true);
            var parseOptions = { custom: true };
            var numOptions;
            if ((intl_base_1.IntlBase.formatRegex.test(option.format)) || !(option.format)) {
                util_1.extend(parseOptions, intl_base_1.IntlBase.getProperNumericSkeleton(option.format || 'N'));
                parseOptions.custom = false;
            }
            else {
                util_1.extend(parseOptions, intl_base_1.IntlBase.customFormat(option.format, null, null));
            }
            numOptions = parser_base_1.ParserBase.getCurrentNumericOptions(dependable.parserObject, parser_base_1.ParserBase.getNumberingSystem(cldr), true);
            parseOptions.symbolRegex = parser_base_1.ParserBase.getSymbolRegex(Object.keys(numOptions.symbolMatch));
            parseOptions.infinity = numOptions.symbolNumberSystem[keys[1]];
            var symbolpattern = intl_base_1.IntlBase.getSymbolPattern(parseOptions.type, numOptions.numberSystem, dependable.numericObject, parseOptions.isAccount);
            if (symbolpattern) {
                symbolpattern = symbolpattern.replace(/\u00A4/g, intl_base_1.IntlBase.defaultCurrency);
                var split = symbolpattern.split(';');
                parseOptions.nData = intl_base_1.IntlBase.getFormatData(split[1] || '-' + split[0], true, '');
                parseOptions.pData = intl_base_1.IntlBase.getFormatData(split[0], true, '');
            }
            return function (value) {
                return _this.getParsedNumber(value, parseOptions, numOptions);
            };
        };
        NumberParser.getParsedNumber = function (value, options, numOptions) {
            var isNegative;
            var isPercent;
            var tempValue;
            var lead;
            var end;
            var ret;
            if (value.indexOf(options.infinity) !== -1) {
                return Infinity;
            }
            else {
                value = parser_base_1.ParserBase.convertValueParts(value, options.symbolRegex, numOptions.symbolMatch);
                value = parser_base_1.ParserBase.convertValueParts(value, numOptions.numberParseRegex, numOptions.numericPair);
                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }
                var matches = value.match(parseRegex);
                if (util_1.isNullOrUndefined(matches)) {
                    return NaN;
                }
                lead = matches[1];
                tempValue = matches[2];
                var exponent = matches[5];
                end = matches[6];
                isNegative = options.custom ? ((lead === options.nData.nlead) && (end === options.nData.nend)) :
                    ((lead.indexOf(options.nData.nlead) !== -1) && (end.indexOf(options.nData.nend) !== -1));
                isPercent = isNegative ?
                    options.nData.isPercent :
                    options.pData.isPercent;
                tempValue = tempValue.replace(groupRegex, '');
                if (exponent) {
                    tempValue += exponent;
                }
                ret = +tempValue;
                if (options.type === 'percent' || isPercent) {
                    ret = ret / 100;
                }
                if (options.custom || options.fractionDigits) {
                    ret = parseFloat(ret.toFixed(options.custom ?
                        (isNegative ? options.nData.maximumFractionDigits : options.pData.maximumFractionDigits) : options.fractionDigits));
                }
                if (isNegative) {
                    ret *= -1;
                }
                return ret;
            }
        };
        return NumberParser;
    }());
    exports.NumberParser = NumberParser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 131:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(132), __webpack_require__(57), __webpack_require__(58), __webpack_require__(75), __webpack_require__(26), __webpack_require__(76)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, module_loader_1, base_1, observer_1, child_property_1, notify_property_change_1, internationalization_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(options, selector) {
            var _this = _super.call(this, options, selector) || this;
            _this.needsID = false;
            if (util_1.isNullOrUndefined(_this.enableRtl)) {
                _this.setProperties({ 'enableRtl': internationalization_1.rightToLeft }, true);
            }
            if (util_1.isNullOrUndefined(_this.locale)) {
                _this.setProperties({ 'locale': internationalization_1.defaultCulture }, true);
            }
            _this.moduleLoader = new module_loader_1.ModuleLoader(_this);
            _this.localObserver = new observer_1.Observer(_this);
            _this.detectFunction = new Function('args', 'var prop = Object.keys(args); if(prop.length){this[prop[0]] = args[prop[0]];}');
            internationalization_1.onIntlChange.on('notifyExternalChange', _this.detectFunction, _this);
            if (_this.enablePersistence) {
                window.addEventListener('unload', _this.setPersistData.bind(_this));
            }
            if (!util_1.isUndefined(selector)) {
                _this.appendTo();
            }
            return _this;
        }
        Component.prototype.requiredModules = function () {
            return [];
        };
        ;
        Component.prototype.destroy = function () {
            this.trigger('destroyed', { cancel: false });
            _super.prototype.destroy.call(this);
            internationalization_1.onIntlChange.off('notifyExternalChange', this.detectFunction);
            this.moduleLoader.clean();
            this.localObserver.destroy();
            if (this.enablePersistence) {
                this.setPersistData();
            }
        };
        Component.prototype.refresh = function () {
            this.clearChanges();
            this.preRender();
            this.injectModules();
            this.render();
        };
        Component.prototype.appendTo = function (selector) {
            if (!util_1.isNullOrUndefined(selector) && typeof (selector) === 'string') {
                this.element = document.querySelector(selector);
            }
            else if (!util_1.isNullOrUndefined(selector)) {
                this.element = selector;
            }
            if (!util_1.isNullOrUndefined(this.element)) {
                if (this.needsID && !this.element.id) {
                    this.element.id = util_1.getUniqueID(this.getModuleName());
                }
                this.isProtectedOnChange = false;
                var inst = util_1.getValue('ej2_instances', this.element);
                if (!inst || inst.indexOf(this) === -1) {
                    _super.prototype.addInstance.call(this);
                }
                this.preRender();
                if (this.enablePersistence) {
                    this.mergePersistData();
                }
                this.injectModules();
                this.render();
                this.trigger('created');
            }
        };
        Component.prototype.dataBind = function () {
            this.injectModules();
            _super.prototype.dataBind.call(this);
        };
        ;
        Component.prototype.on = function (event, handler, context) {
            if (typeof event === 'string') {
                this.localObserver.on(event, handler, context);
            }
            else {
                for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
                    var arg = event_1[_i];
                    this.localObserver.on(arg.event, arg.handler, arg.context);
                }
            }
        };
        Component.prototype.off = function (event, handler) {
            if (typeof event === 'string') {
                this.localObserver.off(event, handler);
            }
            else {
                for (var _i = 0, event_2 = event; _i < event_2.length; _i++) {
                    var arg = event_2[_i];
                    this.localObserver.off(arg.event, arg.handler);
                }
            }
        };
        Component.prototype.notify = function (property, argument) {
            this.localObserver.notify(property, argument);
        };
        Component.prototype.getInjectedModules = function () {
            return this.injectedModules;
        };
        ;
        Component.Inject = function () {
            var moduleList = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                moduleList[_i] = arguments[_i];
            }
            if (!this.prototype.injectedModules) {
                this.prototype.injectedModules = [];
            }
            for (var i = 0; i < moduleList.length; i++) {
                if (this.prototype.injectedModules.indexOf(moduleList[i]) === -1) {
                    this.prototype.injectedModules.push(moduleList[i]);
                }
            }
        };
        Component.prototype.injectModules = function () {
            if (this.injectedModules && this.injectedModules.length) {
                this.moduleLoader.inject(this.requiredModules(), this.injectedModules);
            }
        };
        Component.prototype.mergePersistData = function () {
            var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(util_1.isNullOrUndefined(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        };
        Component.prototype.setPersistData = function () {
            window.localStorage.setItem(this.getModuleName() + this.element.id, this.getPersistData());
        };
        Component.prototype.addOnPersist = function (options) {
            var _this = this;
            var persistObj = {};
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var key = options_1[_i];
                var objValue = void 0;
                objValue = util_1.getValue(key, this);
                if (!util_1.isUndefined(objValue)) {
                    util_1.setValue(key, this.getActualProperties(objValue), persistObj);
                }
            }
            return JSON.stringify(persistObj, function (key, value) {
                return _this.getActualProperties(value);
            });
        };
        Component.prototype.getActualProperties = function (obj) {
            if (obj instanceof child_property_1.ChildProperty) {
                return util_1.getValue('properties', obj);
            }
            else {
                return obj;
            }
        };
        Component.prototype.ignoreOnPersist = function (options) {
            return JSON.stringify(this.iterateJsonProperties(this.properties, options));
        };
        Component.prototype.iterateJsonProperties = function (obj, ignoreList) {
            var newObj = {};
            var _loop_1 = function (key) {
                if (ignoreList.indexOf(key) === -1) {
                    var value = obj[key];
                    if (typeof value === 'object' && !(value instanceof Array)) {
                        var newList = ignoreList.filter(function (str) {
                            return new RegExp(key + '.').test(str);
                        }).map(function (str) {
                            return str.replace(key + '.', '');
                        });
                        newObj[key] = this_1.iterateJsonProperties(this_1.getActualProperties(value), newList);
                    }
                    else {
                        newObj[key] = value;
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_1(key);
            }
            return newObj;
        };
        return Component;
    }(base_1.Base));
    __decorate([
        notify_property_change_1.Property(false)
    ], Component.prototype, "enablePersistence", void 0);
    __decorate([
        notify_property_change_1.Property()
    ], Component.prototype, "enableRtl", void 0);
    __decorate([
        notify_property_change_1.Property()
    ], Component.prototype, "locale", void 0);
    Component = __decorate([
        notify_property_change_1.NotifyPropertyChanges
    ], Component);
    exports.Component = Component;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MODULE_SUFFIX = 'Module';
    var ModuleLoader = (function () {
        function ModuleLoader(parent) {
            this.loadedModules = [];
            this.parent = parent;
        }
        ;
        ModuleLoader.prototype.inject = function (requiredModules, moduleList) {
            var reqLength = requiredModules.length;
            if (reqLength === 0) {
                this.clean();
                return;
            }
            if (this.loadedModules.length) {
                this.clearUnusedModule(requiredModules);
            }
            for (var i = 0; i < reqLength; i++) {
                var modl = requiredModules[i];
                for (var _i = 0, moduleList_1 = moduleList; _i < moduleList_1.length; _i++) {
                    var module = moduleList_1[_i];
                    var modName = modl.member;
                    if (module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
                        var moduleObject = util_1.createInstance(module, modl.args);
                        var memberName = this.getMemberName(modName);
                        if (modl.isProperty) {
                            util_1.setValue(memberName, module, this.parent);
                        }
                        else {
                            util_1.setValue(memberName, moduleObject, this.parent);
                        }
                        var loadedModule = modl;
                        loadedModule.member = memberName;
                        this.loadedModules.push(loadedModule);
                    }
                }
            }
        };
        ModuleLoader.prototype.clean = function () {
            for (var _i = 0, _a = this.loadedModules; _i < _a.length; _i++) {
                var modules = _a[_i];
                if (!modules.isProperty) {
                    util_1.getValue(modules.member, this.parent).destroy();
                }
            }
            this.loadedModules = [];
        };
        ModuleLoader.prototype.clearUnusedModule = function (moduleList) {
            var _this = this;
            var usedModules = moduleList.map(function (arg) { return _this.getMemberName(arg.member); });
            var removableModule = this.loadedModules.filter(function (module) {
                return usedModules.indexOf(module.member) === -1;
            });
            for (var _i = 0, removableModule_1 = removableModule; _i < removableModule_1.length; _i++) {
                var mod = removableModule_1[_i];
                if (!mod.isProperty) {
                    util_1.getValue(mod.member, this.parent).destroy();
                }
                this.loadedModules.splice(this.loadedModules.indexOf(mod), 1);
                util_1.deleteObject(this.parent, mod.member);
            }
        };
        ModuleLoader.prototype.getMemberName = function (name) {
            return name[0].toLowerCase() + name.substring(1) + MODULE_SUFFIX;
        };
        ModuleLoader.prototype.isModuleLoaded = function (modName) {
            for (var _i = 0, _a = this.loadedModules; _i < _a.length; _i++) {
                var mod = _a[_i];
                if (mod.member === this.getMemberName(modName)) {
                    return true;
                }
            }
            return false;
        };
        return ModuleLoader;
    }());
    exports.ModuleLoader = ModuleLoader;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 133:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(26), __webpack_require__(31), __webpack_require__(57), __webpack_require__(75), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, notify_property_change_1, browser_1, base_1, child_property_1, event_handler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SwipeSettings = (function (_super) {
        __extends(SwipeSettings, _super);
        function SwipeSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SwipeSettings;
    }(child_property_1.ChildProperty));
    __decorate([
        notify_property_change_1.Property(50)
    ], SwipeSettings.prototype, "swipeThresholdDistance", void 0);
    exports.SwipeSettings = SwipeSettings;
    var swipeRegex = /(Up|Down)/;
    var Touch = (function (_super) {
        __extends(Touch, _super);
        function Touch(element, options) {
            var _this = _super.call(this, options, element) || this;
            _this.startEvent = function (evt) {
                var point = (evt.changedTouches ? evt.changedTouches[0] : evt);
                _this.isTouchMoved = false;
                _this.movedDirection = '';
                _this.startPoint = _this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
                _this.startEventData = point;
                _this.hScrollLocked = _this.vScrollLocked = false;
                _this.tStampStart = Date.now();
                _this.timeOutTapHold = setTimeout(function () { _this.tapholdEvent(evt); }, _this.tapholdThreshold);
                event_handler_1.EventHandler.add(_this.element, browser_1.Browser.touchMoveEvent, _this.moveEvent, _this);
                event_handler_1.EventHandler.add(_this.element, browser_1.Browser.touchEndEvent, _this.endEvent, _this);
            };
            _this.moveEvent = function (evt) {
                var point = evt.changedTouches ? evt.changedTouches[0] : evt;
                _this.movedPoint = point;
                _this.isTouchMoved = !(point.clientX === _this.startPoint.clientX && point.clientY === _this.startPoint.clientY);
                var eScrollArgs = {};
                if (_this.isTouchMoved) {
                    clearTimeout(_this.timeOutTapHold);
                    _this.calcScrollPoints(evt);
                    var scrollArg = {
                        startEvents: _this.startEventData,
                        originalEvent: evt, startX: _this.startPoint.clientX,
                        startY: _this.startPoint.clientY, distanceX: _this.distanceX,
                        distanceY: _this.distanceY, scrollDirection: _this.scrollDirection,
                        velocity: _this.getVelocity(point)
                    };
                    eScrollArgs = util_1.extend(eScrollArgs, {}, scrollArg);
                    _this.trigger('scroll', eScrollArgs);
                    _this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
                }
            };
            _this.endEvent = function (evt) {
                clearTimeout(_this.timeOutTapHold);
                var point = evt;
                if (evt.changedTouches) {
                    point = evt.changedTouches[0];
                }
                _this.isTouchMoved = !(point.clientX === _this.startPoint.clientX && point.clientY === _this.startPoint.clientY);
                _this.endPoint = point;
                var dblTapTriggred = false;
                var eDblTapArgs;
                var eTapArgs;
                var eSwipeArgs;
                var tDistance = _this.swipeSettings.swipeThresholdDistance;
                _this.calcPoints(evt);
                var swipeArgs = {
                    originalEvent: evt,
                    startEvents: _this.startEventData,
                    startX: _this.startPoint.clientX,
                    startY: _this.startPoint.clientY,
                    distanceX: _this.distanceX, distanceY: _this.distanceY, swipeDirection: _this.movedDirection,
                    velocity: _this.getVelocity(point)
                };
                if (!_this.isTouchMoved) {
                    eDblTapArgs = util_1.extend(eDblTapArgs, _this.defaultArgs, {});
                    if (!util_1.isNullOrUndefined(_this.lastTapTime) && (new Date().getTime() - _this.lastTapTime) < _this.doubleTapThreshold) {
                        clearTimeout(_this.timeOutTap);
                        dblTapTriggred = true;
                        _this.trigger('doubleTap', eDblTapArgs);
                    }
                    if (!dblTapTriggred) {
                        eTapArgs = util_1.extend(eTapArgs, _this.defaultArgs, {});
                        _this.timeOutTap = setTimeout(function () {
                            _this.trigger('tap', eTapArgs);
                        }, (typeof _this.doubleTap !== 'function' ? 0 : _this.doubleTapThreshold));
                    }
                }
                else {
                    eSwipeArgs = util_1.extend(eSwipeArgs, _this.defaultArgs, swipeArgs);
                    var canTrigger = false;
                    var ele = _this.element;
                    var scrollBool = _this.isScrollable(ele);
                    var moved = swipeRegex.test(_this.movedDirection);
                    if ((tDistance < _this.distanceX && !moved) || (tDistance < _this.distanceY && moved)) {
                        if (!scrollBool) {
                            canTrigger = true;
                        }
                        else {
                            canTrigger = _this.checkSwipe(ele, moved);
                        }
                    }
                    if (canTrigger) {
                        _this.trigger('swipe', eSwipeArgs);
                    }
                }
                _this.lastTapTime = new Date().getTime();
                event_handler_1.EventHandler.remove(_this.element, browser_1.Browser.touchMoveEvent, _this.moveEvent);
                event_handler_1.EventHandler.remove(_this.element, browser_1.Browser.touchEndEvent, _this.endEvent);
            };
            _this.bind();
            return _this;
        }
        Touch.prototype.onPropertyChanged = function (newProp, oldProp) {
        };
        Touch.prototype.bind = function () {
            this.wireEvents();
            if (browser_1.Browser.isIE) {
                this.element.classList.add('e-block-touch');
            }
        };
        Touch.prototype.destroy = function () {
            this.unwireEvents();
            _super.prototype.destroy.call(this);
        };
        Touch.prototype.wireEvents = function () {
            event_handler_1.EventHandler.add(this.element, browser_1.Browser.touchStartEvent, this.startEvent, this);
        };
        Touch.prototype.unwireEvents = function () {
            event_handler_1.EventHandler.remove(this.element, browser_1.Browser.touchStartEvent, this.startEvent);
        };
        Touch.prototype.getModuleName = function () {
            return 'touch';
        };
        Touch.prototype.isScrollable = function (element) {
            var eleStyle = getComputedStyle(element);
            var style = eleStyle.overflow + eleStyle.overflowX + eleStyle.overflowY;
            if ((/(auto|scroll)/).test(style)) {
                return true;
            }
            return false;
        };
        Touch.prototype.tapholdEvent = function (evt) {
            var eTapArgs;
            event_handler_1.EventHandler.remove(this.element, browser_1.Browser.touchMoveEvent, this.moveEvent);
            event_handler_1.EventHandler.remove(this.element, browser_1.Browser.touchEndEvent, this.endEvent);
            eTapArgs = { originalEvent: evt };
            this.trigger('taphold', eTapArgs);
        };
        Touch.prototype.calcPoints = function (evt) {
            var point = evt.changedTouches ? evt.changedTouches[0] : evt;
            this.defaultArgs = { originalEvent: evt };
            this.distanceX = Math.abs((Math.abs(point.clientX) - Math.abs(this.startPoint.clientX)));
            this.distanceY = Math.abs((Math.abs(point.clientY) - Math.abs(this.startPoint.clientY)));
            if (this.distanceX > this.distanceY) {
                this.movedDirection = (point.clientX > this.startPoint.clientX) ? 'Right' : 'Left';
            }
            else {
                this.movedDirection = (point.clientY < this.startPoint.clientY) ? 'Up' : 'Down';
            }
        };
        Touch.prototype.calcScrollPoints = function (evt) {
            var point = evt.changedTouches ? evt.changedTouches[0] : evt;
            this.defaultArgs = { originalEvent: evt };
            this.distanceX = Math.abs((Math.abs(point.clientX) - Math.abs(this.lastMovedPoint.clientX)));
            this.distanceY = Math.abs((Math.abs(point.clientY) - Math.abs(this.lastMovedPoint.clientY)));
            if ((this.distanceX > this.distanceY || this.hScrollLocked === true) && this.vScrollLocked === false) {
                this.scrollDirection = (point.clientX > this.lastMovedPoint.clientX) ? 'Right' : 'Left';
                this.hScrollLocked = true;
            }
            else {
                this.scrollDirection = (point.clientY < this.lastMovedPoint.clientY) ? 'Up' : 'Down';
                this.vScrollLocked = true;
            }
        };
        Touch.prototype.getVelocity = function (pnt) {
            var newX = pnt.clientX;
            var newY = pnt.clientY;
            var newT = Date.now();
            var xDist = newX - this.startPoint.clientX;
            var yDist = newY - this.startPoint.clientX;
            var interval = newT - this.tStampStart;
            return Math.sqrt(xDist * xDist + yDist * yDist) / interval;
        };
        Touch.prototype.checkSwipe = function (ele, flag) {
            var keys = ['scroll', 'offset'];
            var temp = flag ? ['Height', 'Top'] : ['Width', 'Left'];
            if ((ele[keys[0] + temp[0]] <= ele[keys[1] + temp[0]])) {
                return true;
            }
            return (ele[keys[0] + temp[1]] === 0) ||
                (ele[keys[1] + temp[0]] + ele[keys[0] + temp[1]] >= ele[keys[0] + temp[0]]);
        };
        return Touch;
    }(base_1.Base));
    __decorate([
        notify_property_change_1.Event()
    ], Touch.prototype, "tap", void 0);
    __decorate([
        notify_property_change_1.Event()
    ], Touch.prototype, "doubleTap", void 0);
    __decorate([
        notify_property_change_1.Event()
    ], Touch.prototype, "taphold", void 0);
    __decorate([
        notify_property_change_1.Event()
    ], Touch.prototype, "swipe", void 0);
    __decorate([
        notify_property_change_1.Event()
    ], Touch.prototype, "scroll", void 0);
    __decorate([
        notify_property_change_1.Property(500)
    ], Touch.prototype, "doubleTapThreshold", void 0);
    __decorate([
        notify_property_change_1.Property(750)
    ], Touch.prototype, "tapholdThreshold", void 0);
    __decorate([
        notify_property_change_1.Complex({}, SwipeSettings)
    ], Touch.prototype, "swipeSettings", void 0);
    Touch = __decorate([
        notify_property_change_1.NotifyPropertyChanges
    ], Touch);
    exports.Touch = Touch;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(133)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, touch_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(touch_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 188:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(112), __webpack_require__(134), __webpack_require__(22), __webpack_require__(30), __webpack_require__(2), __webpack_require__(0), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, component_1, touch_1, event_handler_1, notify_property_change_1, dom_1, util_1, browser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CLASSNAMES = {
        ROOT: 'e-hscroll',
        RTL: 'e-rtl',
        HSCROLLBAR: 'e-hscroll-bar',
        HSCROLLCON: 'e-hscroll-content',
        NAVARROW: 'e-nav-arrow',
        NAVRIGHTARROW: 'e-nav-right-arrow',
        NAVLEFTARROW: 'e-nav-left-arrow',
        HSCROLLNAV: 'e-hor-nav'
    };
    var HScroll = (function (_super) {
        __extends(HScroll, _super);
        function HScroll(options, element) {
            return _super.call(this, options, element) || this;
        }
        HScroll.prototype.preRender = function () {
            this.initialize();
            if (this.element.id === '') {
                this.element.id = util_1.getUniqueID('hscroll');
                this.uniqueId = true;
            }
            this.element.style.display = 'block';
            if (this.enableRtl) {
                this.element.classList.add(CLASSNAMES.RTL);
            }
        };
        HScroll.prototype.render = function () {
            this.createNavigationIcon(this.element, CLASSNAMES.NAVRIGHTARROW + ' ' + CLASSNAMES.NAVARROW);
        };
        HScroll.prototype.initialize = function () {
            var scrollEle = dom_1.createElement('div', { className: CLASSNAMES.HSCROLLCON });
            var scrollDiv = dom_1.createElement('div', { className: CLASSNAMES.HSCROLLBAR });
            var ele = this.element;
            var innerEle = [].slice.call(ele.children);
            for (var _i = 0, innerEle_1 = innerEle; _i < innerEle_1.length; _i++) {
                var ele_1 = innerEle_1[_i];
                scrollEle.appendChild(ele_1);
            }
            scrollDiv.appendChild(scrollEle);
            ele.appendChild(scrollDiv);
            scrollDiv.style.overflowX = 'hidden';
            this.scrollEle = scrollDiv;
            this.scrollItems = scrollEle;
        };
        HScroll.prototype.getPersistData = function () {
            var keyEntity = ['scrollStep'];
            return this.addOnPersist(keyEntity);
        };
        HScroll.prototype.getModuleName = function () {
            return 'hScroll';
        };
        HScroll.prototype.destroy = function () {
            var ele = this.element;
            ele.style.display = '';
            ele.classList.remove(CLASSNAMES.ROOT);
            var nav = ele.querySelector('#' + ele.id + '_nav.e-' + ele.id + '_nav');
            event_handler_1.EventHandler.remove(nav, 'click', this.clickEventHandler);
            for (var _i = 0, _a = [].slice.call(this.scrollItems.children); _i < _a.length; _i++) {
                var elem = _a[_i];
                ele.appendChild(elem);
            }
            if (this.uniqueId) {
                this.element.removeAttribute('id');
            }
            this.scrollEle.remove();
            nav.parentElement.removeChild(nav);
            event_handler_1.EventHandler.remove(this.scrollEle, 'scroll', this.scrollEventHandler);
            this.touchModule.destroy();
            this.touchModule = null;
            _super.prototype.destroy.call(this);
        };
        HScroll.prototype.createNavigationIcon = function (element, classList) {
            var id = element.id.concat('_nav');
            var className = 'e-' + element.id.concat('_nav ' + CLASSNAMES.HSCROLLNAV);
            var nav = dom_1.createElement('div', { id: id, className: className });
            var navItem = dom_1.createElement('div', { className: classList + ' e-icons' });
            nav.appendChild(navItem);
            nav.setAttribute('tabindex', '0');
            element.insertBefore(nav, element.firstChild);
            event_handler_1.EventHandler.add(this.scrollEle, 'scroll', this.scrollEventHandler, this);
            var tchObj = new touch_1.Touch(nav, { taphold: this.tabHoldHandler.bind(this) });
            nav.addEventListener('mouseup', this.repeatScroll.bind(this));
            nav.addEventListener('touchend', this.repeatScroll.bind(this));
            nav.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            event_handler_1.EventHandler.add(nav, 'click', this.clickEventHandler, this);
            this.touchModule = new touch_1.Touch(element, { scroll: this.touchScrollHandler.bind(this) });
        };
        HScroll.prototype.repeatScroll = function (e) {
            clearInterval(this.timeout);
        };
        HScroll.prototype.tabHoldHandler = function (e) {
            var _this = this;
            var trgt = e.originalEvent.target;
            trgt = trgt.classList.contains(CLASSNAMES.HSCROLLNAV) ? trgt.firstElementChild : trgt;
            var timeoutFun = function () {
                var element = _this.scrollEle;
                var scrollDis = 10;
                _this.contentScrolling(scrollDis, trgt);
            };
            this.timeout = setInterval(function () {
                timeoutFun();
            }, 50);
        };
        HScroll.prototype.contentScrolling = function (scrollDis, trgt) {
            var element = this.scrollEle;
            var classList = trgt.classList;
            if (classList.contains(CLASSNAMES.HSCROLLNAV)) {
                classList = this.element.querySelector('.' + CLASSNAMES.NAVARROW).classList;
            }
            if (this.element.classList.contains(CLASSNAMES.RTL) && browser_1.Browser.info.name === 'mozilla') {
                scrollDis = -scrollDis;
            }
            if (!this.element.classList.contains(CLASSNAMES.RTL) || browser_1.Browser.info.name === 'mozilla') {
                if (classList.contains(CLASSNAMES.NAVRIGHTARROW)) {
                    element.scrollLeft = element.scrollLeft + scrollDis;
                }
                else {
                    element.scrollLeft = element.scrollLeft - scrollDis;
                }
            }
            else {
                if (classList.contains(CLASSNAMES.NAVLEFTARROW)) {
                    element.scrollLeft = element.scrollLeft + scrollDis;
                }
                else {
                    element.scrollLeft = element.scrollLeft - scrollDis;
                }
            }
        };
        HScroll.prototype.clickEventHandler = function (e) {
            this.contentScrolling(this.scrollStep, e.target);
        };
        HScroll.prototype.touchScrollHandler = function (e) {
            var ele = this.scrollEle;
            var distance;
            distance = e.distanceX;
            if (e.scrollDirection === 'Left') {
                ele.scrollLeft = ele.scrollLeft + distance;
            }
            else {
                ele.scrollLeft = ele.scrollLeft - distance;
            }
        };
        HScroll.prototype.scrollEventHandler = function (e) {
            var target = e.target;
            var width = target.offsetWidth;
            var navElement = this.element.firstChild;
            var scrollVal = (this.element.clientWidth + this.element.scrollLeft - navElement.offsetWidth);
            if (navElement.firstChild) {
                var navClassList = navElement.firstChild.classList;
                var scrollLeft = target.scrollLeft;
                if (scrollLeft <= 0) {
                    scrollLeft = -scrollLeft;
                }
                if (scrollLeft === 0) {
                    if (!this.element.classList.contains(CLASSNAMES.RTL) || browser_1.Browser.info.name === 'mozilla') {
                        navClassList.add(CLASSNAMES.NAVRIGHTARROW);
                        navClassList.remove(CLASSNAMES.NAVLEFTARROW);
                    }
                    else {
                        navClassList.add(CLASSNAMES.NAVLEFTARROW);
                        navClassList.remove(CLASSNAMES.NAVRIGHTARROW);
                    }
                }
                else if (Math.ceil(width + scrollLeft) >= target.scrollWidth) {
                    if (!this.element.classList.contains(CLASSNAMES.RTL) || browser_1.Browser.info.name === 'mozilla') {
                        navClassList.add(CLASSNAMES.NAVLEFTARROW);
                        navClassList.remove(CLASSNAMES.NAVRIGHTARROW);
                    }
                    else {
                        navClassList.add(CLASSNAMES.NAVRIGHTARROW);
                        navClassList.remove(CLASSNAMES.NAVLEFTARROW);
                    }
                }
                else {
                    return;
                }
                return;
            }
            else {
                return;
            }
        };
        HScroll.prototype.onPropertyChanged = function (newProp, oldProp) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'scrollStep':
                        break;
                    case 'enableRtl':
                        newProp.enableRtl ? this.element.classList.add(CLASSNAMES.RTL) : this.element.classList.remove(CLASSNAMES.RTL);
                        break;
                }
            }
        };
        return HScroll;
    }(component_1.Component));
    __decorate([
        notify_property_change_1.Property(40)
    ], HScroll.prototype, "scrollStep", void 0);
    HScroll = __decorate([
        notify_property_change_1.NotifyPropertyChanges
    ], HScroll);
    exports.HScroll = HScroll;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(190)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, toolbar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(toolbar_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 190:
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(1), __webpack_require__(71), __webpack_require__(55), __webpack_require__(32), __webpack_require__(188)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, dom_1, dom_2, util_1, ej2_base_2, ej2_base_3, position_1, ej2_popups_1, ej2_buttons_1, h_scroll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CLASSNAMES = {
        ITEMS: 'e-toolbar-items',
        ITEM: 'e-toolbar-item',
        RTL: 'e-rtl',
        SEPARATOR: 'e-separator',
        POPUPICON: 'e-popup-up-icon',
        POPUPDOWN: 'e-popup-down-icon',
        POPUP: 'e-toolbar-popup',
        POPUPCLASS: 'e-toolbar-pop',
        TEMPLATE: 'e-template',
        DISABLE: 'e-overlay',
        POPUPTEXT: 'e-toolbar-text',
        TBARTEXT: 'e-popup-text',
        TBAROVERFLOW: 'e-overflow-show',
        POPOVERFLOW: 'e-overflow-hide',
        TBARBTNTEXT: 'e-tbar-btn-text',
        TBARBTN: 'e-tbar-btn',
        TBARNAV: 'e-hor-nav',
        TBARNAVACT: 'e-nav-active',
        POPUPNAV: 'e-hor-nav'
    };
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Item;
    }(ej2_base_2.ChildProperty));
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "id", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "text", void 0);
    __decorate([
        ej2_base_1.Property('auto')
    ], Item.prototype, "width", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "cssClass", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "prefixIcon", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "suffixIcon", void 0);
    __decorate([
        ej2_base_1.Property('None')
    ], Item.prototype, "overflow", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "template", void 0);
    __decorate([
        ej2_base_1.Property('Button')
    ], Item.prototype, "type", void 0);
    __decorate([
        ej2_base_1.Property('Both')
    ], Item.prototype, "showTextOn", void 0);
    __decorate([
        ej2_base_1.Property(null)
    ], Item.prototype, "htmlAttributes", void 0);
    __decorate([
        ej2_base_1.Property('')
    ], Item.prototype, "tooltipText", void 0);
    exports.Item = Item;
    var Toolbar = (function (_super) {
        __extends(Toolbar, _super);
        function Toolbar(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.keyConfigs = {
                moveLeft: 'leftarrow',
                moveRight: 'rightarrow',
                moveUp: 'uparrow',
                moveDown: 'downarrow',
                popupOpen: 'enter',
                popupClose: 'escape',
                tab: 'tab'
            };
            return _this;
        }
        Toolbar.prototype.destroy = function () {
            var ele = this.element;
            _super.prototype.destroy.call(this);
            this.unwireEvents();
            if (ele.children.length > 0) {
                ele.removeChild(ele.children[0]);
            }
            ele.removeAttribute('style');
        };
        Toolbar.prototype.preRender = function () {
            this.trigger('beforeCreate');
            if (this.enableRtl) {
                this.element.classList.add('e-rtl');
            }
        };
        Toolbar.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.element, 'click', this.clickEventHandler, this);
            window.onresize = this.resize.bind(this);
            this.keyModule = new ej2_base_3.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs
            });
            this.element.setAttribute('tabIndex', '0');
        };
        Toolbar.prototype.unwireEvents = function () {
            ej2_base_1.EventHandler.remove(this.element, 'click', this.clickEventHandler);
            if (this.scrollModule) {
                this.scrollModule.destroy();
                this.scrollModule = null;
            }
            this.keyModule.destroy();
            if (this.popupObj) {
                ej2_base_1.EventHandler.remove(document, 'scroll', this.docEvent);
                ej2_base_1.EventHandler.remove(document, 'click', this.docEvent);
            }
        };
        Toolbar.prototype.keyActionHandler = function (e) {
            e.preventDefault();
            var clst;
            var trgt = e.target;
            var rootEle = this.element;
            var popupObj = this.popupObj;
            if (trgt.classList.contains(CLASSNAMES.TBARNAV) && popupObj && dom_1.isVisible(popupObj.element)) {
                clst = popupObj.element.querySelector('.' + CLASSNAMES.ITEM);
            }
            else if (rootEle === trgt || trgt.classList.contains(CLASSNAMES.TBARNAV)) {
                clst = rootEle.querySelector('.' + CLASSNAMES.ITEM);
            }
            else {
                clst = dom_1.closest(trgt, '.' + CLASSNAMES.ITEM);
            }
            if (clst) {
                switch (e.action) {
                    case 'moveRight':
                        if (rootEle === trgt || trgt.classList.contains(CLASSNAMES.TBARNAV)) {
                            clst.firstChild.focus();
                        }
                        else {
                            this.nextEleFocus(clst);
                        }
                        break;
                    case 'moveLeft':
                        if (popupObj && trgt.classList.contains(CLASSNAMES.TBARNAV)) {
                            clst = clst.parentElement.lastElementChild;
                        }
                        if (trgt.classList.contains(CLASSNAMES.TBARNAV) && !clst.classList.contains(CLASSNAMES.SEPARATOR)) {
                            clst.firstChild.focus();
                        }
                        else {
                            this.prevEleFocus(clst);
                        }
                        break;
                    case 'moveUp':
                        if (popupObj && dom_1.closest(trgt, '.e-popup')) {
                            if (popupObj.element.firstElementChild === clst) {
                                rootEle.querySelector('.' + CLASSNAMES.TBARNAV).focus();
                            }
                            else {
                                this.prevEleFocus(clst);
                            }
                        }
                        else {
                            return;
                        }
                        break;
                    case 'moveDown':
                        if (popupObj && dom_1.closest(trgt, '.e-popup')) {
                            this.nextEleFocus(clst);
                        }
                        else if (popupObj && dom_1.isVisible(popupObj.element)) {
                            clst.firstChild.focus();
                        }
                        else {
                            return;
                        }
                        break;
                    case 'tab':
                        var ele = clst.firstChild;
                        if (rootEle === trgt || trgt.classList.contains(CLASSNAMES.TBARNAV)) {
                            if (this.activeEle) {
                                this.activeEle.focus();
                            }
                            else {
                                this.activeEleRemove(ele);
                                ele.focus();
                            }
                        }
                        break;
                    case 'popupClose':
                        if (popupObj && dom_1.isVisible(popupObj.element)) {
                            popupObj.hide({ name: 'SlideUp', duration: 100 });
                        }
                        break;
                    case 'popupOpen':
                        if (!trgt.classList.contains(CLASSNAMES.TBARNAV)) {
                            return;
                        }
                        if (popupObj && !dom_1.isVisible(popupObj.element)) {
                            popupObj.element.style.top = rootEle.offsetHeight + 'px';
                            popupObj.show({ name: 'SlideDown', duration: 100 });
                        }
                        else {
                            popupObj.hide({ name: 'SlideUp', duration: 100 });
                        }
                        break;
                }
            }
        };
        Toolbar.prototype.prevEleFocus = function (closest) {
            var prevSib = closest.previousElementSibling;
            if (prevSib) {
                if (prevSib.classList.contains(CLASSNAMES.SEPARATOR)) {
                    if (prevSib.previousSibling) {
                        prevSib = prevSib.previousSibling;
                        if (prevSib.classList.contains(CLASSNAMES.SEPARATOR)) {
                            this.prevEleFocus(prevSib);
                        }
                    }
                    else {
                        return;
                    }
                }
                if (!util_1.isNullOrUndefined(prevSib.firstChild)) {
                    prevSib.firstChild.focus();
                }
            }
            else {
                return;
            }
        };
        Toolbar.prototype.nextEleFocus = function (closest) {
            var nextSib = closest.nextElementSibling;
            if (nextSib) {
                if (nextSib.classList.contains(CLASSNAMES.SEPARATOR)) {
                    if (nextSib.nextSibling) {
                        nextSib = nextSib.nextSibling;
                        if (nextSib.classList.contains(CLASSNAMES.SEPARATOR)) {
                            this.nextEleFocus(nextSib);
                        }
                    }
                    else if (this.popupObj) {
                        this.element.querySelector('.' + CLASSNAMES.TBARNAV).focus();
                    }
                    else {
                        return;
                    }
                }
                if (!util_1.isNullOrUndefined(nextSib.firstChild)) {
                    nextSib.firstChild.focus();
                }
            }
            else if (this.popupObj) {
                this.element.querySelector('.' + CLASSNAMES.TBARNAV).focus();
            }
            else {
                return;
            }
        };
        Toolbar.prototype.clickEventHandler = function (e) {
            var trgt = e.target;
            var clsList = trgt.classList;
            var ele = this.element;
            var popObj = this.popupObj;
            var popupNav = dom_1.closest(trgt, ('.' + CLASSNAMES.TBARNAV));
            if (!popupNav) {
                popupNav = trgt;
            }
            if (!ele.children[0].classList.contains('e-hscroll') && (clsList.contains(CLASSNAMES.TBARNAV))) {
                clsList = trgt.querySelector('.e-icons').classList;
            }
            if (clsList.contains(CLASSNAMES.POPUPICON) || clsList.contains(CLASSNAMES.POPUPDOWN)) {
                if (dom_1.isVisible(popObj.element)) {
                    popupNav.classList.remove(CLASSNAMES.TBARNAVACT);
                    popObj.hide({ name: 'SlideUp', duration: 100 });
                }
                else {
                    if (ele.classList.contains(CLASSNAMES.RTL)) {
                        popObj.enableRtl = true;
                        popObj.position = { X: 'left', Y: 'top' };
                    }
                    if (popObj.offsetX === 0 && !ele.classList.contains(CLASSNAMES.RTL)) {
                        popObj.enableRtl = false;
                        popObj.position = { X: 'right', Y: 'top' };
                    }
                    popObj.dataBind();
                    popObj.element.style.top = this.element.offsetHeight + 'px';
                    popupNav.classList.add(CLASSNAMES.TBARNAVACT);
                    popObj.show({ name: 'SlideDown', duration: 100 });
                }
            }
            this.trigger('clicked', e);
        };
        ;
        Toolbar.prototype.render = function () {
            this.initialize();
            this.renderControl();
            this.wireEvents();
        };
        Toolbar.prototype.initialize = function () {
            var width = util_1.formatUnit(this.width);
            var height = util_1.formatUnit(this.height);
            dom_1.setStyleAttribute(this.element, { 'width': width, 'height': height });
            var ariaAttr = {
                'role': 'toolbar', 'aria-disabled': 'false', 'aria-haspopup': 'false', 'aria-orientation': 'horizontal',
            };
            dom_1.attributes(this.element, ariaAttr);
        };
        Toolbar.prototype.renderControl = function () {
            this.trgtEle = (this.element.children.length > 0) ? this.element.querySelector('div') : null;
            this.renderItems();
            this.renderOverflowMode();
        };
        Toolbar.prototype.initHScroll = function (element, innerItems) {
            if (!this.scrollModule && this.checkOverflow(element, innerItems[0])) {
                this.scrollModule = new h_scroll_1.HScroll({ scrollStep: 50, enableRtl: this.enableRtl }, innerItems[0]);
                this.element.style.overflow = 'hidden';
            }
        };
        Toolbar.prototype.checkOverflow = function (element, innerItem) {
            if (util_1.isNullOrUndefined(element) || util_1.isNullOrUndefined(innerItem)) {
                return false;
            }
            var eleWidth = element.offsetWidth;
            var itemWidth = innerItem.offsetWidth;
            var popNav = element.querySelector('.' + CLASSNAMES.TBARNAV);
            if (itemWidth > eleWidth - (popNav ? popNav.offsetWidth : 0)) {
                return true;
            }
            else {
                return false;
            }
        };
        Toolbar.prototype.renderOverflowMode = function () {
            var ele = this.element;
            if (ele && ele.children.length > 0) {
                this.offsetWid = ele.offsetWidth;
                switch (this.overflowMode.toString()) {
                    case 'Scrollable':
                        if (this.scrollModule) {
                            this.scrollModule.destroy();
                            this.scrollModule = null;
                        }
                        this.initHScroll(ele, ele.getElementsByClassName(CLASSNAMES.ITEMS));
                        break;
                    case 'Popup':
                        this.element.classList.add('e-toolpop');
                        if (this.checkOverflow(ele, ele.querySelector('.' + CLASSNAMES.ITEMS))) {
                            this.createOverflowIcon(ele, [].slice.call(ele.querySelectorAll('.' + CLASSNAMES.ITEMS + ' .' + CLASSNAMES.ITEM)));
                            this.element.querySelector('.' + CLASSNAMES.TBARNAV).setAttribute('tabIndex', '0');
                        }
                        else if (util_1.isNullOrUndefined(this.popupObj)) {
                            this.element.classList.remove('e-toolpop');
                        }
                        break;
                }
            }
        };
        Toolbar.prototype.checkPriority = function (ele, inEle, eleWidth, pre) {
            var len = inEle.length;
            var eleWid = eleWidth;
            var sepCheck = 0;
            var itemCount = 0;
            var itemPopCount = 0;
            for (var i = len - 1; i >= 0; i--) {
                var mrgn = parseFloat((window.getComputedStyle(inEle[i])).marginRight);
                if ((inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn * 2) > eleWidth) {
                    if (inEle[i].classList.contains(CLASSNAMES.SEPARATOR)) {
                        if (sepCheck > 0 && itemCount === itemPopCount) {
                            var sepEle = inEle[i + itemCount + (sepCheck - 1)];
                            if (sepEle.classList.contains(CLASSNAMES.SEPARATOR)) {
                                sepEle.style.display = 'none';
                            }
                        }
                        sepCheck++;
                        itemCount = 0;
                        itemPopCount = 0;
                    }
                    else {
                        itemCount++;
                    }
                    if (inEle[i].classList.contains(CLASSNAMES.TBAROVERFLOW) && pre) {
                        eleWidth -= (inEle[i].offsetWidth + (mrgn * 2));
                    }
                    else if (!inEle[i].classList.contains(CLASSNAMES.SEPARATOR)) {
                        inEle[i].classList.add(CLASSNAMES.POPUP);
                        inEle[i].style.display = 'none';
                        itemPopCount++;
                    }
                    else {
                        eleWidth -= (inEle[i].offsetWidth);
                    }
                }
                if (inEle[i].classList.contains(CLASSNAMES.POPOVERFLOW)) {
                    var elem = ele.querySelector('.' + CLASSNAMES.ITEMS + ' .' + CLASSNAMES.POPUP);
                    if (elem && elem.classList.contains(CLASSNAMES.POPOVERFLOW)) {
                        elem.style.display = '';
                        elem.classList.remove(CLASSNAMES.POPUP);
                        inEle[i].classList.add(CLASSNAMES.POPUP);
                        inEle[i].style.display = 'none';
                    }
                }
            }
            if (pre) {
                var popedEle = this.element.querySelectorAll('.' + CLASSNAMES.ITEM + ':not(.' + CLASSNAMES.POPUP + ')');
                var inEl = [].slice.call(popedEle);
                this.checkPriority(ele, inEl, eleWid, false);
            }
        };
        Toolbar.prototype.createOverflowIcon = function (ele, innerEle) {
            var innerNav = ele.querySelector('.' + CLASSNAMES.TBARNAV);
            if (!innerNav) {
                this.createPopupIcon(ele);
            }
            innerNav = ele.querySelector('.' + CLASSNAMES.TBARNAV);
            var eleWidth = (ele.offsetWidth - (innerNav.offsetWidth));
            if (this.enableRtl) {
                this.element.classList.remove('e-rtl');
            }
            this.checkPriority(ele, innerEle, eleWidth, true);
            if (this.enableRtl) {
                this.element.classList.add('e-rtl');
            }
            this.createPopup();
        };
        Toolbar.prototype.createPopupIcon = function (element) {
            var id = element.id.concat('_nav');
            var className = 'e-' + element.id.concat('_nav ' + CLASSNAMES.POPUPNAV);
            var nav = dom_2.createElement('div', { id: id, className: className });
            var navItem = dom_2.createElement('div', { className: CLASSNAMES.POPUPDOWN + ' e-icons' });
            nav.appendChild(navItem);
            nav.setAttribute('tabindex', '0');
            element.insertBefore(nav, element.firstChild);
        };
        Toolbar.prototype.createPopup = function () {
            var _this = this;
            var element = this.element;
            var eleHeight;
            var eleItem;
            eleItem = element.querySelector('.' + CLASSNAMES.ITEM + ':not(.' + CLASSNAMES.SEPARATOR + ' ):not(.' + CLASSNAMES.POPUP + ' )');
            eleHeight = element.style.height === 'auto' ? null : eleItem.offsetHeight;
            var ele;
            var nodes;
            var popupPri = [];
            if (element.querySelector('#' + element.id + '_popup.' + CLASSNAMES.POPUPCLASS)) {
                ele = element.querySelector('#' + element.id + '_popup.' + CLASSNAMES.POPUPCLASS);
            }
            else {
                ele = dom_2.createElement('div', { id: element.id + '_popup', className: CLASSNAMES.POPUPCLASS });
            }
            var poppedEle = element.querySelector('.' + CLASSNAMES.ITEMS).querySelectorAll('.' + CLASSNAMES.POPUP);
            var popupEle = [].slice.call(poppedEle);
            nodes = ele.querySelectorAll('.' + CLASSNAMES.TBAROVERFLOW);
            var nodeIndex = 0;
            var nodePri = 0;
            popupEle.forEach(function (el, index) {
                nodes = ele.querySelectorAll('.' + CLASSNAMES.TBAROVERFLOW);
                if (el.classList.contains(CLASSNAMES.TBAROVERFLOW) && nodes.length > 0) {
                    if (_this.tbResize && nodes.length > index) {
                        ele.insertBefore(el, nodes[index]);
                        ++nodePri;
                    }
                    else {
                        ele.insertBefore(el, ele.children[nodes.length]);
                        ++nodePri;
                    }
                }
                else if (el.classList.contains(CLASSNAMES.TBAROVERFLOW)) {
                    ele.insertBefore(el, ele.firstChild);
                    ++nodePri;
                }
                else if (el.classList.contains(CLASSNAMES.POPOVERFLOW)) {
                    popupPri.push(el);
                }
                else if (_this.tbResize) {
                    ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                    ++nodeIndex;
                }
                else {
                    ele.appendChild(el);
                }
                el.style.display = '';
                el.style.height = eleHeight + 'px';
            });
            popupPri.forEach(function (el) {
                ele.appendChild(el);
            });
            var tbarEle = element.querySelector('.' + CLASSNAMES.ITEMS).querySelectorAll('.' + CLASSNAMES.ITEM);
            for (var i = tbarEle.length - 1; i >= 0; i--) {
                var tbarElement = tbarEle[i];
                if (tbarElement.classList.contains(CLASSNAMES.SEPARATOR)) {
                    tbarElement.style.display = 'none';
                }
                else {
                    break;
                }
            }
            if (!this.popupObj) {
                element.appendChild(ele);
                this.element.style.overflow = '';
                var popup = new ej2_popups_1.Popup(ele, {
                    relateTo: element,
                    offsetY: (element.offsetHeight),
                    enableRtl: this.enableRtl,
                    open: this.popupOpen.bind(this),
                    close: this.popupClose,
                    position: this.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
                });
                ej2_base_1.EventHandler.add(document, 'scroll', this.docEvent.bind(this));
                ej2_base_1.EventHandler.add(document, 'click ', this.docEvent.bind(this));
                popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
                popup.hide();
                this.popupObj = popup;
                this.element.setAttribute('aria-haspopup', 'true');
            }
            else {
                var popupEle_1 = this.popupObj.element;
                popupEle_1.style.maxHeight = '';
                popupEle_1.style.display = 'block';
                popupEle_1.style.maxHeight = popupEle_1.offsetHeight + 'px';
                popupEle_1.style.display = 'none';
            }
        };
        Toolbar.prototype.docEvent = function (e) {
            var popEle = dom_1.closest(e.target, '.e-popup');
            if (this.popupObj && dom_1.isVisible(this.popupObj.element) && !popEle) {
                this.popupObj.hide({ name: 'SlideUp', duration: 100 });
            }
        };
        Toolbar.prototype.popupOpen = function (e) {
            var popObj = this.popupObj;
            var popupEle = this.popupObj.element;
            var toolEle = this.element;
            var popupNav = toolEle.querySelector('.' + CLASSNAMES.TBARNAV);
            popObj.element.style.height = 'auto';
            popObj.element.style.maxHeight = '';
            popObj.element.style.maxHeight = popObj.element.clientHeight + 'px';
            var popupElePos = popupEle.offsetTop + popupEle.offsetHeight + position_1.calculatePosition(toolEle).top;
            if (!util_1.isNullOrUndefined(popupNav)) {
                var popIcon = popupNav.firstElementChild.classList;
                popupNav.classList.add(CLASSNAMES.TBARNAVACT);
                popIcon.remove(CLASSNAMES.POPUPDOWN);
                popIcon.add(CLASSNAMES.POPUPICON);
            }
            if ((window.innerHeight + window.scrollY) < popupElePos) {
                var overflowHeight = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - window.scrollY) + 5));
                popObj.height = overflowHeight + 'px';
                popObj.element.style.maxHeight = overflowHeight + 'px';
            }
        };
        Toolbar.prototype.popupClose = function (e) {
            var element = this.element.parentElement;
            var popupNav = element.querySelector('.' + CLASSNAMES.TBARNAV);
            if (popupNav) {
                var popIcon = popupNav.firstElementChild.classList;
                popupNav.classList.remove(CLASSNAMES.TBARNAVACT);
                popIcon.remove(CLASSNAMES.POPUPICON);
                popIcon.add(CLASSNAMES.POPUPDOWN);
            }
        };
        Toolbar.prototype.renderItems = function () {
            var ele = this.element;
            var itemEleDom;
            var innerItem;
            var popupNav = ele.querySelector('.' + CLASSNAMES.TBARNAV);
            var items = this.items;
            if (ele && ele.children.length > 0) {
                var navEle = ele.querySelectorAll('.' + CLASSNAMES.TBARNAV);
                itemEleDom = navEle.length > 0 ? ele.children[1] : ele.children[0];
            }
            if (this.trgtEle != null) {
                this.trgtEle.classList.add(CLASSNAMES.ITEMS);
                var innerEle = [].slice.call(this.trgtEle.children);
                innerEle.forEach(function (ele) {
                    if (ele.tagName === 'DIV') {
                        ele.classList.add(CLASSNAMES.ITEM);
                    }
                });
            }
            else if (ele && items.length > 0) {
                if (!itemEleDom) {
                    itemEleDom = dom_2.createElement('div', { className: CLASSNAMES.ITEMS });
                }
                for (var i = 0; i < items.length; i++) {
                    innerItem = this.renderSubComponent(items[i]);
                    this.tbarEle.push(innerItem);
                    itemEleDom.appendChild(innerItem);
                }
                ele.appendChild(itemEleDom);
            }
        };
        Toolbar.prototype.setAttr = function (attr, element) {
            var key = Object.keys(attr)[0];
            switch (key) {
                case 'class':
                    element.classList.add(attr[key]);
                    break;
                case 'style':
                    var value = JSON.parse('\{"' + attr[key].replace(':', '\":\"') + '\"}');
                    dom_1.setStyleAttribute(element, value);
                    break;
                default:
                    element.setAttribute(key, attr[key]);
                    break;
            }
        };
        Toolbar.prototype.popupRefresh = function (popupEle, destroy) {
            var ele = this.element;
            var popNav = ele.querySelector('.' + CLASSNAMES.TBARNAV);
            var innerEle = ele.querySelector('.' + CLASSNAMES.ITEMS);
            var eleSplice = this.tbarEle;
            var priEleCnt;
            var index;
            if (util_1.isNullOrUndefined(popNav)) {
                return;
            }
            innerEle.removeAttribute('style');
            popupEle.style.display = 'block';
            var width = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
            var _loop_1 = function (el) {
                el.style.position = 'absolute';
                var elWidth = el.offsetWidth;
                var btnText = el.querySelector('.' + CLASSNAMES.TBARBTNTEXT);
                if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLASSNAMES.TBARTEXT)) {
                    var btn = el.children[0];
                    if (!util_1.isNullOrUndefined(btnText) && el.classList.contains(CLASSNAMES.TBARTEXT)) {
                        btnText.style.display = 'none';
                    }
                    else if (!util_1.isNullOrUndefined(btnText) && el.classList.contains(CLASSNAMES.POPUPTEXT)) {
                        btnText.style.display = 'block';
                    }
                    btn.style.minWidth = '0%';
                    elWidth = el.offsetWidth;
                    btn.style.minWidth = '';
                    if (!util_1.isNullOrUndefined(btnText)) {
                        btnText.style.display = '';
                    }
                }
                el.style.position = '';
                if (elWidth < width || destroy) {
                    if (!el.classList.contains(CLASSNAMES.POPOVERFLOW)) {
                        el.classList.remove(CLASSNAMES.POPUP);
                    }
                    index = this_1.tbarEle.indexOf(el);
                    var sepBeforePri_1 = 0;
                    eleSplice.slice(0, index).forEach(function (el) {
                        if (el.classList.contains(CLASSNAMES.TBAROVERFLOW) || el.classList.contains(CLASSNAMES.SEPARATOR)) {
                            if (el.classList.contains(CLASSNAMES.SEPARATOR)) {
                                el.style.display = '';
                                width -= el.offsetWidth;
                            }
                            sepBeforePri_1++;
                        }
                    });
                    if (el.classList.contains(CLASSNAMES.TBAROVERFLOW)) {
                        var popEle = this_1.popupObj.element;
                        var query = '.' + CLASSNAMES.ITEM + ':not(.' + CLASSNAMES.SEPARATOR + '):not(.' + CLASSNAMES.TBAROVERFLOW + ')';
                        priEleCnt = popEle.querySelectorAll('.' + CLASSNAMES.POPUP + ':not(.' + CLASSNAMES.TBAROVERFLOW + ')').length;
                        if (innerEle.querySelectorAll(query).length === 0) {
                            var eleSep = innerEle.children[index - (index - sepBeforePri_1) - 1];
                            if (!util_1.isNullOrUndefined(eleSep) && eleSep.classList.contains(CLASSNAMES.SEPARATOR) && !dom_1.isVisible(eleSep)) {
                                var sepDisplay = 'none';
                                eleSep.style.display = 'inherit';
                                var eleSepWidth = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                                var prevSep = eleSep.previousElementSibling;
                                if ((elWidth + eleSepWidth) < width || destroy) {
                                    innerEle.insertBefore(el, innerEle.children[index - (index - sepBeforePri_1)]);
                                    if (!util_1.isNullOrUndefined(prevSep)) {
                                        prevSep.style.display = '';
                                    }
                                }
                                else {
                                    prevSep.style.display = sepDisplay;
                                }
                                eleSep.style.display = '';
                            }
                            else {
                                innerEle.insertBefore(el, innerEle.children[index - (index - sepBeforePri_1)]);
                            }
                        }
                        else {
                            innerEle.insertBefore(el, innerEle.children[index - priEleCnt]);
                        }
                        width -= el.offsetWidth;
                    }
                    else if (index === 0) {
                        innerEle.insertBefore(el, innerEle.firstChild);
                        width -= el.offsetWidth;
                    }
                    else {
                        priEleCnt = this_1.popupObj.element.querySelectorAll(CLASSNAMES.TBAROVERFLOW).length;
                        innerEle.insertBefore(el, innerEle.children[index - priEleCnt]);
                        width -= el.offsetWidth;
                    }
                    el.style.height = '';
                }
                else {
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = [].slice.call(popupEle.children); _i < _a.length; _i++) {
                var el = _a[_i];
                var state_1 = _loop_1(el);
                if (state_1 === "break")
                    break;
            }
            popupEle.style.display = 'none';
            if (popupEle.children.length === 0) {
                popNav.remove();
                this.popupObj.destroy();
                this.popupObj.element.remove();
                this.popupObj = null;
                this.element.setAttribute('aria-haspopup', 'false');
                this.element.classList.remove('e-toolpop');
            }
        };
        Toolbar.prototype.enableItems = function (items, isEnable) {
            var elements = items;
            var len = elements.length;
            if (util_1.isNullOrUndefined(isEnable)) {
                isEnable = true;
            }
            if (len && len > 1) {
                isEnable ? dom_1.removeClass(elements, CLASSNAMES.DISABLE) : dom_1.addClass(elements, CLASSNAMES.DISABLE);
            }
            else {
                var ele = void 0;
                ele = (len && len === 1) ? elements[0] : items;
                isEnable ? ele.classList.remove(CLASSNAMES.DISABLE) : ele.classList.add(CLASSNAMES.DISABLE);
            }
        };
        Toolbar.prototype.addItems = function (items, index) {
            var innerItems;
            var itemsDiv = this.element.querySelector('.' + CLASSNAMES.ITEMS);
            var innerEle;
            if (util_1.isNullOrUndefined(index)) {
                index = 0;
            }
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                innerItems = this.element.querySelectorAll('.' + CLASSNAMES.ITEM);
                innerEle = this.renderSubComponent(item);
                if (this.tbarEle.length > index && innerItems.length > 0) {
                    innerItems[0].parentNode.insertBefore(innerEle, innerItems[index]);
                    this.items.splice(index, 0, item);
                    this.tbarEle.splice(index, 0, innerEle);
                    index++;
                    this.offsetWid = itemsDiv.offsetWidth;
                }
            }
            itemsDiv.style.width = '';
            this.renderOverflowMode();
        };
        Toolbar.prototype.removeItems = function (args) {
            var index;
            var innerItems = [].slice.call(this.element.querySelectorAll('.' + CLASSNAMES.ITEM));
            if (typeof (args) === 'number') {
                index = parseInt(args.toString(), 10);
                this.removeItemByIndex(index, innerItems);
            }
            else {
                for (var _i = 0, _a = [].slice.call(args); _i < _a.length; _i++) {
                    var ele = _a[_i];
                    index = this.tbarEle.indexOf(ele);
                    this.removeItemByIndex(index, innerItems);
                }
            }
            this.resize();
        };
        Toolbar.prototype.removeItemByIndex = function (index, innerItems) {
            if (this.tbarEle[index] && innerItems[index]) {
                var eleIdx = innerItems.indexOf(this.tbarEle[index]);
                innerItems[eleIdx].remove();
                this.items.splice(index, 1);
                this.tbarEle.splice(index, 1);
            }
        };
        Toolbar.prototype.templateRender = function (templateProp, innerEle, item) {
            var itemType = item.type.toString();
            if (typeof (templateProp) === 'string') {
                innerEle.innerHTML = templateProp;
                var ele = innerEle.childNodes[0];
                if (!ele.tagName) {
                    var templateEle = document.querySelector(templateProp);
                    innerEle.innerHTML = '';
                    innerEle.appendChild(templateEle);
                }
                innerEle.classList.add(CLASSNAMES.TEMPLATE);
                this.tbarEle.push(innerEle);
            }
            else if (itemType === 'Input' || itemType === '2') {
                var templateProperty = templateProp;
                var ele = dom_2.createElement('input');
                item.id ? (ele.id = item.id) : (ele.id = util_1.getUniqueID('tbr-ipt'));
                templateProperty.appendTo(ele);
                innerEle.appendChild(ele);
                innerEle.classList.add(CLASSNAMES.TEMPLATE);
                this.tbarEle.push(innerEle);
            }
        };
        Toolbar.prototype.renderSubComponent = function (item) {
            var innerEle;
            var dom;
            innerEle = dom_2.createElement('div', { className: CLASSNAMES.ITEM });
            if (!this.tbarEle) {
                this.tbarEle = [];
            }
            if (item.cssClass) {
                innerEle.className = innerEle.className + ' ' + item.cssClass;
            }
            if (item.htmlAttributes) {
                this.setAttr(item.htmlAttributes, innerEle);
            }
            if (item.tooltipText) {
                innerEle.setAttribute('title', item.tooltipText);
            }
            if (item.template) {
                this.templateRender(item.template, innerEle, item);
            }
            else {
                switch (item.type.toString()) {
                    case 'Button':
                        var textStr = item.text;
                        dom = dom_2.createElement('button', { className: 'e-tbar-btn' });
                        item.id ? (dom.id = item.id) : dom.id = util_1.getUniqueID('e-tbr-btn');
                        var btnTxt = dom_2.createElement('div', { className: 'e-tbar-btn-text' });
                        if (item.text) {
                            btnTxt.innerHTML = item.text;
                            dom.appendChild(btnTxt);
                        }
                        else {
                            innerEle.classList.add('e-tbtn-align');
                        }
                        var btnObj = new ej2_buttons_1.Button({}, dom);
                        if (item.prefixIcon && item.suffixIcon) {
                            btnObj.iconCss = item.prefixIcon + ' e-icons';
                            btnObj.iconPosition = 'left';
                        }
                        else if (item.prefixIcon) {
                            btnObj.iconCss = item.prefixIcon + ' e-icons';
                            btnObj.iconPosition = 'left';
                        }
                        else if (item.suffixIcon) {
                            btnObj.iconCss = item.suffixIcon + ' e-icons';
                            btnObj.iconPosition = 'right';
                        }
                        btnObj.dataBind();
                        if (item.width) {
                            dom_1.setStyleAttribute(dom, { 'width': util_1.formatUnit(item.width) });
                        }
                        dom.setAttribute('tabindex', '-1');
                        innerEle.appendChild(dom);
                        innerEle.addEventListener('click', this.itemClick.bind(this));
                        break;
                    case 'Separator':
                        innerEle.classList.add(CLASSNAMES.SEPARATOR);
                        break;
                }
            }
            if (item.showTextOn) {
                var sTxt = item.showTextOn.toString();
                if (sTxt === 'Toolbar' || sTxt === '2') {
                    innerEle.classList.add(CLASSNAMES.POPUPTEXT);
                    innerEle.classList.add('e-tbtn-align');
                }
                else if (sTxt === 'Overflow' || sTxt === '1') {
                    innerEle.classList.add(CLASSNAMES.TBARTEXT);
                }
            }
            if (item.overflow) {
                var overflow = item.overflow.toString();
                if (overflow === 'Show' || overflow === '1') {
                    innerEle.classList.add(CLASSNAMES.TBAROVERFLOW);
                }
                else if (overflow === 'Hide' || overflow === '2') {
                    if (!innerEle.classList.contains(CLASSNAMES.SEPARATOR)) {
                        innerEle.classList.add(CLASSNAMES.POPOVERFLOW);
                    }
                }
            }
            return innerEle;
        };
        Toolbar.prototype.itemClick = function (e) {
            var target = e.currentTarget;
            var ele = target.firstChild;
            this.activeEleRemove(ele);
            this.activeEle.focus();
        };
        Toolbar.prototype.activeEleRemove = function (curEle) {
            if (util_1.isNullOrUndefined(this.activeEle)) {
                this.activeEle = curEle;
            }
            else {
                this.activeEle.setAttribute('tabindex', '-1');
                this.activeEle = curEle;
            }
            curEle.removeAttribute('tabindex');
        };
        Toolbar.prototype.getPersistData = function () {
            return this.addOnPersist([]);
        };
        Toolbar.prototype.getModuleName = function () {
            return 'toolbar';
        };
        Toolbar.prototype.resize = function () {
            var ele = this.element;
            this.tbResize = true;
            if (this.popupObj && dom_1.isVisible(this.popupObj.element)) {
                this.popupObj.hide();
            }
            var checkOverflow = this.checkOverflow(ele, ele.getElementsByClassName(CLASSNAMES.ITEMS)[0]);
            if (this.offsetWid > ele.offsetWidth || this.scrollModule || checkOverflow) {
                this.renderOverflowMode();
            }
            if (this.popupObj) {
                this.popupRefresh(this.popupObj.element, false);
            }
            this.offsetWid = ele.offsetWidth;
            this.tbResize = false;
        };
        Toolbar.prototype.onPropertyChanged = function (newProp, oldProp) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'items':
                        if (this.scrollModule) {
                            this.scrollModule.destroy();
                            this.scrollModule = null;
                        }
                        this.renderItems();
                        this.renderOverflowMode();
                        break;
                    case 'width':
                        var wid = this.element.offsetWidth;
                        dom_1.setStyleAttribute(this.element, { 'width': util_1.formatUnit(newProp.width) });
                        this.renderOverflowMode();
                        if (this.popupObj && wid < this.element.offsetWidth) {
                            this.popupRefresh(this.popupObj.element, false);
                        }
                        break;
                    case 'height':
                        dom_1.setStyleAttribute(this.element, { 'height': util_1.formatUnit(newProp.height) });
                        break;
                    case 'overflowMode':
                        if (this.scrollModule) {
                            this.scrollModule.element.classList.remove(CLASSNAMES.RTL);
                            this.scrollModule.destroy();
                            this.scrollModule = null;
                        }
                        if (this.popupObj) {
                            var popNav = this.element.querySelector('.' + CLASSNAMES.TBARNAV);
                            this.popupRefresh(this.popupObj.element, true);
                            popNav.remove();
                        }
                        this.renderOverflowMode();
                        if (this.enableRtl) {
                            this.element.classList.add(CLASSNAMES.RTL);
                        }
                        break;
                    case 'enableRtl':
                        if (newProp.enableRtl) {
                            this.element.classList.add(CLASSNAMES.RTL);
                            if (!util_1.isNullOrUndefined(this.scrollModule)) {
                                this.scrollModule.element.classList.add(CLASSNAMES.RTL);
                            }
                            if (!util_1.isNullOrUndefined(this.popupObj)) {
                                this.popupObj.element.classList.add(CLASSNAMES.RTL);
                            }
                        }
                        else {
                            this.element.classList.remove(CLASSNAMES.RTL);
                            if (!util_1.isNullOrUndefined(this.scrollModule)) {
                                this.scrollModule.element.classList.remove(CLASSNAMES.RTL);
                            }
                            if (!util_1.isNullOrUndefined(this.popupObj)) {
                                this.popupObj.element.classList.remove(CLASSNAMES.RTL);
                            }
                        }
                        break;
                }
            }
        };
        return Toolbar;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_3.Collection([], Item)
    ], Toolbar.prototype, "items", void 0);
    __decorate([
        ej2_base_1.Property('auto')
    ], Toolbar.prototype, "width", void 0);
    __decorate([
        ej2_base_1.Property('auto')
    ], Toolbar.prototype, "height", void 0);
    __decorate([
        ej2_base_1.Property('Scrollable')
    ], Toolbar.prototype, "overflowMode", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], Toolbar.prototype, "enableRtl", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Toolbar.prototype, "clicked", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Toolbar.prototype, "created", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Toolbar.prototype, "destroyed", void 0);
    __decorate([
        ej2_base_1.Event()
    ], Toolbar.prototype, "beforeCreate", void 0);
    Toolbar = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], Toolbar);
    exports.Toolbar = Toolbar;
    exports.toolbarBuilder = ej2_base_2.CreateBuilder(Toolbar);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(102)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, toolbar_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(toolbar_1);
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

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(39), __webpack_require__(74)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, parser_base_1, number_formatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntlBase;
    (function (IntlBase) {
        IntlBase.negativeDataRegex = /^(('[^']+'|''|[^*#@0,.E])*)(\*.)?((([#,]*[0,]*0+)(\.0*[0-9]*#*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
        IntlBase.customRegex = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
        IntlBase.latnParseRegex = /0|1|2|3|4|5|6|7|8|9/g;
        var fractionRegex = /[0-9]/g;
        IntlBase.defaultCurrency = '$';
        var mapper = ['infinity', 'nan', 'group', 'decimal'];
        IntlBase.formatRegex = /(^[ncpa]{1})([0-1]?[0-9]|20)?$/i;
        var typeMapper = {
            '$': 'isCurrency',
            '%': 'isPercent',
            '-': 'isNegative',
            0: 'nlead',
            1: 'nend'
        };
        IntlBase.dateParseRegex = /([a-z])\1*|'([^']|'')+'|''|./gi;
        IntlBase.basicPatterns = ['short', 'medium', 'long', 'full'];
        IntlBase.defaultObject = {
            'dates': {
                'calendars': {
                    'gregorian': {
                        'months': {
                            'stand-alone': {
                                'abbreviated': {
                                    '1': 'Jan',
                                    '2': 'Feb',
                                    '3': 'Mar',
                                    '4': 'Apr',
                                    '5': 'May',
                                    '6': 'Jun',
                                    '7': 'Jul',
                                    '8': 'Aug',
                                    '9': 'Sep',
                                    '10': 'Oct',
                                    '11': 'Nov',
                                    '12': 'Dec'
                                },
                                'narrow': {
                                    '1': 'J',
                                    '2': 'F',
                                    '3': 'M',
                                    '4': 'A',
                                    '5': 'M',
                                    '6': 'J',
                                    '7': 'J',
                                    '8': 'A',
                                    '9': 'S',
                                    '10': 'O',
                                    '11': 'N',
                                    '12': 'D'
                                },
                                'wide': {
                                    '1': 'January',
                                    '2': 'February',
                                    '3': 'March',
                                    '4': 'April',
                                    '5': 'May',
                                    '6': 'June',
                                    '7': 'July',
                                    '8': 'August',
                                    '9': 'September',
                                    '10': 'October',
                                    '11': 'November',
                                    '12': 'December'
                                }
                            }
                        },
                        "days": {
                            "stand-alone": {
                                "abbreviated": {
                                    "sun": "Sun",
                                    "mon": "Mon",
                                    "tue": "Tue",
                                    "wed": "Wed",
                                    "thu": "Thu",
                                    "fri": "Fri",
                                    "sat": "Sat"
                                },
                                "narrow": {
                                    "sun": "S",
                                    "mon": "M",
                                    "tue": "T",
                                    "wed": "W",
                                    "thu": "T",
                                    "fri": "F",
                                    "sat": "S"
                                },
                                "short": {
                                    "sun": "Su",
                                    "mon": "Mo",
                                    "tue": "Tu",
                                    "wed": "We",
                                    "thu": "Th",
                                    "fri": "Fr",
                                    "sat": "Sa"
                                },
                                "wide": {
                                    "sun": "Sunday",
                                    "mon": "Monday",
                                    "tue": "Tuesday",
                                    "wed": "Wednesday",
                                    "thu": "Thursday",
                                    "fri": "Friday",
                                    "sat": "Saturday"
                                }
                            }
                        },
                        "dayPeriods": {
                            "format": {
                                "wide": {
                                    "am": "AM",
                                    "pm": "PM"
                                }
                            }
                        },
                        'eras': {
                            'eraNames': {
                                '0': 'Before Christ',
                                '0-alt-variant': 'Before Common Era',
                                '1': 'Anno Domini',
                                "1-alt-variant": "Common Era"
                            },
                            'eraAbbr': {
                                '0': 'BC',
                                '0-alt-variant': 'BCE',
                                '1': 'AD',
                                '1-alt-variant': 'CE'
                            },
                            'eraNarrow': {
                                '0': 'B',
                                '0-alt-variant': 'BCE',
                                '1': 'A',
                                '1-alt-variant': 'CE'
                            }
                        },
                        'dateFormats': {
                            'full': 'EEEE, MMMM d, y',
                            'long': 'MMMM d, y',
                            'medium': 'MMM d, y',
                            'short': 'M/d/yy'
                        },
                        'timeFormats': {
                            'full': 'h:mm:ss a zzzz',
                            'long': 'h:mm:ss a z',
                            'medium': 'h:mm:ss a',
                            'short': 'h:mm a'
                        },
                        'dateTimeFormats': {
                            'full': "{1} 'at' {0}",
                            'long': "{1} 'at' {0}",
                            'medium': '{1}, {0}',
                            'short': '{1}, {0}',
                            'availableFormats': {
                                'd': 'd',
                                'E': 'ccc',
                                'Ed': 'd E',
                                'Ehm': 'E h:mm a',
                                'EHm': 'E HH:mm',
                                'Ehms': 'E h:mm:ss a',
                                'EHms': 'E HH:mm:ss',
                                'Gy': 'y G',
                                'GyMMM': 'MMM y G',
                                'GyMMMd': 'MMM d, y G',
                                'GyMMMEd': 'E, MMM d, y G',
                                'h': 'h a',
                                'H': 'HH',
                                'hm': 'h:mm a',
                                'Hm': 'HH:mm',
                                'hms': 'h:mm:ss a',
                                'Hms': 'HH:mm:ss',
                                'hmsv': 'h:mm:ss a v',
                                'Hmsv': 'HH:mm:ss v',
                                'hmv': 'h:mm a v',
                                'Hmv': 'HH:mm v',
                                'M': 'L',
                                'Md': 'M/d',
                                'MEd': 'E, M/d',
                                'MMM': 'LLL',
                                'MMMd': 'MMM d',
                                'MMMEd': 'E, MMM d',
                                'MMMMd': 'MMMM d',
                                'ms': 'mm:ss',
                                'y': 'y',
                                'yM': 'M/y',
                                'yMd': 'M/d/y',
                                'yMEd': 'E, M/d/y',
                                'yMMM': 'MMM y',
                                'yMMMd': 'MMM d, y',
                                'yMMMEd': 'E, MMM d, y',
                                'yMMMM': 'MMMM y',
                            },
                        }
                    }
                },
                'timeZoneNames': {
                    "hourFormat": "+HH:mm;-HH:mm",
                    "gmtFormat": "GMT{0}",
                    "gmtZeroFormat": "GMT",
                }
            },
            'numbers': {
                'currencies': {
                    'USD': {
                        'displayName': 'US Dollar',
                        'symbol': '$',
                        'symbol-alt-narrow': '$'
                    },
                    'EUR': {
                        'displayName': 'Euro',
                        'symbol': '€',
                        'symbol-alt-narrow': '€'
                    },
                    'GBP': {
                        'displayName': 'British Pound',
                        'symbol-alt-narrow': '£'
                    },
                },
                'defaultNumberingSystem': 'latn',
                'minimumGroupingDigits': '1',
                'symbols-numberSystem-latn': {
                    'decimal': '.',
                    'group': ',',
                    'list': ';',
                    'percentSign': '%',
                    'plusSign': '+',
                    'minusSign': '-',
                    'exponential': 'E',
                    'superscriptingExponent': '×',
                    'perMille': '‰',
                    'infinity': '∞',
                    'nan': 'NaN',
                    'timeSeparator': ':'
                },
                'decimalFormats-numberSystem-latn': {
                    'standard': '#,##0.###',
                },
                'percentFormats-numberSystem-latn': {
                    'standard': '#,##0%'
                },
                'currencyFormats-numberSystem-latn': {
                    'standard': '¤#,##0.00',
                    'accounting': '¤#,##0.00;(¤#,##0.00)'
                }
            }
        };
        IntlBase.monthIndex = {
            3: 'abbreviated',
            4: 'wide',
            5: 'narrow',
            1: 'abbreviated'
        };
        IntlBase.month = 'months';
        IntlBase.days = 'days';
        IntlBase.patternMatcher = {
            C: 'currency',
            P: 'percent',
            N: 'decimal',
            A: 'currency'
        };
        function getResultantPattern(skeleton, dateObject, type) {
            var resPattern;
            var iType = type || 'date';
            if (IntlBase.basicPatterns.indexOf(skeleton) !== -1) {
                resPattern = util_1.getValue(iType + 'Formats.' + skeleton, dateObject);
                if (iType === 'dateTime') {
                    var dPattern = util_1.getValue('dateFormats.' + skeleton, dateObject);
                    var tPattern = util_1.getValue('timeFormats.' + skeleton, dateObject);
                    resPattern = resPattern.replace('{1}', dPattern).replace('{0}', tPattern);
                }
            }
            else {
                resPattern = util_1.getValue('dateTimeFormats.availableFormats.' + skeleton, dateObject);
            }
            return resPattern;
        }
        IntlBase.getResultantPattern = getResultantPattern;
        function getDependables(cldr, culture, isNumber) {
            var ret = {};
            ret.parserObject = parser_base_1.ParserBase.getMainObject(cldr, culture) || IntlBase.defaultObject;
            if (isNumber) {
                ret.numericObject = util_1.getValue('numbers', ret.parserObject);
            }
            else {
                ret.dateObject = util_1.getValue('dates.calendars.gregorian', ret.parserObject);
            }
            return ret;
        }
        IntlBase.getDependables = getDependables;
        function getSymbolPattern(type, numSystem, obj, isAccount) {
            return util_1.getValue(type + 'Formats-numberSystem-' +
                numSystem + (isAccount ? '.accounting' : '.standard'), obj) || (isAccount ? util_1.getValue(type + 'Formats-numberSystem-' +
                numSystem + '.standard', obj) : '');
        }
        IntlBase.getSymbolPattern = getSymbolPattern;
        function getProperNumericSkeleton(skeleton) {
            var matches = skeleton.match(IntlBase.formatRegex);
            var ret = {};
            var pattern = matches[1].toUpperCase();
            ret.isAccount = (pattern === 'A');
            ret.type = IntlBase.patternMatcher[pattern];
            if (skeleton.length > 1) {
                ret.fractionDigits = parseInt(matches[2], 10);
            }
            return ret;
        }
        IntlBase.getProperNumericSkeleton = getProperNumericSkeleton;
        function getFormatData(pattern, needFraction, cSymbol, fractionOnly) {
            var nData = fractionOnly ? {} : { nlead: '', nend: '' };
            var match = pattern.match(IntlBase.customRegex);
            if (match) {
                if (!fractionOnly) {
                    nData.nlead = changeCurrencySymbol(match[1], cSymbol);
                    nData.nend = changeCurrencySymbol(match[10], cSymbol);
                    nData.groupPattern = match[4];
                }
                var fraction = match[7];
                if (fraction && needFraction) {
                    var fmatch = fraction.match(fractionRegex);
                    if (!util_1.isNullOrUndefined(fmatch)) {
                        nData.minimumFraction = fmatch.length;
                    }
                    else {
                        nData.minimumFraction = 0;
                    }
                    nData.maximumFraction = fraction.length - 1;
                }
            }
            return nData;
        }
        IntlBase.getFormatData = getFormatData;
        function changeCurrencySymbol(val, sym) {
            if (val) {
                return val.replace(IntlBase.defaultCurrency, sym);
            }
            return '';
        }
        function getCurrencySymbol(numericObject, currencyCode) {
            return util_1.getValue('currencies.' + currencyCode + '.symbol', numericObject) || '$';
        }
        IntlBase.getCurrencySymbol = getCurrencySymbol;
        function customFormat(format, dOptions, obj) {
            var options = {};
            var formatSplit = format.split(';');
            var data = ['pData', 'nData', 'zeroData'];
            for (var i = 0; i < formatSplit.length; i++) {
                options[data[i]] = customNumberFormat(formatSplit[i], dOptions, obj);
            }
            if (util_1.isNullOrUndefined(options.nData)) {
                options.nData = util_1.extend({}, options.pData);
                options.nData.nlead = util_1.isNullOrUndefined(dOptions) ? '-' + options.nData.nlead : dOptions.minusSymbol + options.nData.nlead;
            }
            return options;
        }
        IntlBase.customFormat = customFormat;
        function customNumberFormat(format, dOptions, numObject) {
            var cOptions = { type: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
            var pattern = format.match(IntlBase.customRegex);
            if (util_1.isNullOrUndefined(pattern) || pattern[5] === '') {
                util_1.throwError('Given Format is not valid or Cldr data not loaded');
            }
            cOptions.nlead = pattern[1];
            cOptions.nend = pattern[10];
            var integerPart = pattern[6];
            cOptions.useGrouping = integerPart.indexOf(',') !== -1;
            integerPart = integerPart.replace(/,/g, '');
            var fractionPart = pattern[7];
            if (integerPart.indexOf('0') !== -1) {
                cOptions.minimumIntegerDigits = integerPart.length - integerPart.indexOf('0');
            }
            if (!util_1.isNullOrUndefined(fractionPart)) {
                cOptions.minimumFractionDigits = fractionPart.lastIndexOf('0');
                cOptions.maximumFractionDigits = fractionPart.lastIndexOf('#');
                if (cOptions.minimumFractionDigits === -1) {
                    cOptions.minimumFractionDigits = 0;
                }
                if (cOptions.maximumFractionDigits === -1 || cOptions.maximumFractionDigits < cOptions.minimumFractionDigits) {
                    cOptions.maximumFractionDigits = cOptions.minimumFractionDigits;
                }
            }
            if (!util_1.isNullOrUndefined(dOptions)) {
                util_1.extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '$', dOptions.currencySymbol));
                if (!cOptions.isCurrency) {
                    util_1.extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', dOptions.percentSymbol));
                }
            }
            else {
                util_1.extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', '%'));
            }
            if (!util_1.isNullOrUndefined(numObject)) {
                var symbolPattern = getSymbolPattern(cOptions.type, dOptions.numberMapper.numberSystem, numObject, false);
                if (cOptions.useGrouping) {
                    cOptions.groupSeparator = dOptions.numberMapper.numberSymbols[mapper[2]];
                    cOptions.groupData = number_formatter_1.NumberFormat.getGroupingDetails(symbolPattern.split(';')[0]);
                }
                cOptions.nlead = cOptions.nlead.replace(/\'/g, '');
                cOptions.nend = cOptions.nend.replace(/\'/g, '');
            }
            return cOptions;
        }
        function isCurrencyPercent(parts, actual, symbol) {
            var options = { nlead: parts[0], nend: parts[1] };
            for (var i = 0; i < 2; i++) {
                var part = parts[i];
                var loc = part.indexOf(actual);
                if ((loc !== -1) && ((loc < part.indexOf('\'')) || (loc > part.lastIndexOf('\'')))) {
                    options[typeMapper[i]] = part.substr(0, loc) + symbol + part.substr(loc + 1);
                    options[typeMapper[actual]] = true;
                    options.type = options.isCurrency ? 'currency' : 'percent';
                    break;
                }
            }
            return options;
        }
        IntlBase.isCurrencyPercent = isCurrencyPercent;
        function getDateSeparator(dateObj) {
            var value = (util_1.getValue('dateFormats.short', dateObj) || '').match(/[d‏M‏]([^d‏M])[d‏M‏]/i);
            return value ? value[1] : '/';
        }
        IntlBase.getDateSeparator = getDateSeparator;
    })(IntlBase = exports.IntlBase || (exports.IntlBase = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultNumberingSystem = {
        'latn': {
            '_digits': '0123456789',
            '_type': 'numeric'
        }
    };
    var latnRegex = /^[0-9]*$/;
    var defaultNumberSymbols = {
        'decimal': '.',
        'group': ',',
        'percentSign': '%',
        'plusSign': '+',
        'minusSign': '-',
        'infinity': '∞',
        'nan': 'NaN',
        'exponential': 'E'
    };
    var latnNumberSystem = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var ParserBase = (function () {
        function ParserBase() {
        }
        ParserBase.getMainObject = function (obj, cName) {
            return util_1.getValue('main.' + cName, obj);
        };
        ParserBase.getNumberingSystem = function (obj) {
            return util_1.getValue('supplemental.numberingSystems', obj) || this.numberingSystems;
        };
        ParserBase.reverseObject = function (prop, keys) {
            var propKeys = keys || Object.keys(prop);
            var res = {};
            for (var _i = 0, propKeys_1 = propKeys; _i < propKeys_1.length; _i++) {
                var key = propKeys_1[_i];
                res[prop[key]] = key;
            }
            return res;
        };
        ParserBase.getSymbolRegex = function (props) {
            var regexStr = props.map(function (str) {
                return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
            }).join('|');
            return new RegExp(regexStr, 'g');
        };
        ParserBase.getSymbolMatch = function (prop) {
            var matchKeys = Object.keys(defaultNumberSymbols);
            var ret = {};
            for (var _i = 0, matchKeys_1 = matchKeys; _i < matchKeys_1.length; _i++) {
                var key = matchKeys_1[_i];
                ret[prop[key]] = defaultNumberSymbols[key];
            }
            return ret;
        };
        ParserBase.constructRegex = function (val) {
            var len = val.length;
            var ret = '';
            for (var i = 0; i < len; i++) {
                if (i !== len - 1) {
                    ret += val[i] + '|';
                }
                else {
                    ret += val[i];
                }
            }
            return ret;
        };
        ParserBase.convertValueParts = function (value, regex, obj) {
            return value.replace(regex, function (str) {
                return obj[str];
            });
        };
        ParserBase.getDefaultNumberingSystem = function (obj) {
            var ret = {};
            ret.obj = util_1.getValue('numbers', obj);
            ret.nSystem = util_1.getValue('defaultNumberingSystem', ret.obj);
            return ret;
        };
        ParserBase.getCurrentNumericOptions = function (curObj, numberSystem, needSymbols) {
            var ret = {};
            var cur = this.getDefaultNumberingSystem(curObj);
            if (!util_1.isUndefined(cur.nSystem)) {
                var digits = util_1.getValue(cur.nSystem + '._digits', numberSystem);
                if (!util_1.isUndefined(digits)) {
                    ret.numericPair = this.reverseObject(digits, latnNumberSystem);
                    ret.numberParseRegex = new RegExp(this.constructRegex(digits), 'g');
                    ret.numericRegex = '[' + digits[0] + '-' + digits[9] + ']';
                    if (needSymbols) {
                        ret.numericRegex = digits[0] + '-' + digits[9];
                        ret.symbolNumberSystem = util_1.getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
                        ret.symbolMatch = this.getSymbolMatch(ret.symbolNumberSystem);
                        ret.numberSystem = cur.nSystem;
                    }
                }
            }
            return ret;
        };
        ParserBase.getNumberMapper = function (curObj, numberSystem, isNumber) {
            var ret = { mapper: {} };
            var cur = this.getDefaultNumberingSystem(curObj);
            if (!util_1.isUndefined(cur.nSystem)) {
                ret.numberSystem = cur.nSystem;
                ret.numberSymbols = util_1.getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
                ret.timeSeparator = util_1.getValue('timeSeparator', ret.numberSymbols);
                var digits = util_1.getValue(cur.nSystem + '._digits', numberSystem);
                if (!util_1.isUndefined(digits)) {
                    for (var _i = 0, latnNumberSystem_1 = latnNumberSystem; _i < latnNumberSystem_1.length; _i++) {
                        var i = latnNumberSystem_1[_i];
                        ret.mapper[i] = digits[i];
                    }
                }
            }
            return ret;
        };
        return ParserBase;
    }());
    ParserBase.nPair = 'numericPair';
    ParserBase.nRegex = 'numericRegex';
    ParserBase.numberingSystems = defaultNumberingSystem;
    exports.ParserBase = ParserBase;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


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

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(11), __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, observer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Base = (function () {
        function Base(options, element) {
            this.isProtectedOnChange = true;
            this.properties = {};
            this.changedProperties = {};
            this.oldProperties = {};
            this.finalUpdate = function () { };
            this.childChangedProperties = {};
            this.modelObserver = new observer_1.Observer(this);
            if (!util_1.isUndefined(element)) {
                if ('string' === typeof (element)) {
                    this.element = document.querySelector(element);
                }
                else {
                    this.element = element;
                }
                if (!util_1.isNullOrUndefined(this.element)) {
                    this.isProtectedOnChange = false;
                    this.addInstance();
                }
            }
            if (!util_1.isUndefined(options)) {
                this.setProperties(options, true);
            }
            this.isDestroyed = false;
        }
        Base.prototype.setProperties = function (prop, muteOnChange) {
            var prevDetection = this.isProtectedOnChange;
            this.isProtectedOnChange = !!muteOnChange;
            util_1.merge(this, prop);
            if (muteOnChange !== true) {
                util_1.merge(this.changedProperties, prop);
                this.dataBind();
            }
            this.finalUpdate();
            this.changedProperties = {};
            this.oldProperties = {};
            this.isProtectedOnChange = prevDetection;
        };
        ;
        Base.callChildDataBind = function (obj, parent) {
            var keys = Object.keys(obj);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (parent[key] instanceof Array) {
                    for (var _a = 0, _b = parent[key]; _a < _b.length; _a++) {
                        var obj_1 = _b[_a];
                        if (obj_1.dataBind !== undefined) {
                            obj_1.dataBind();
                        }
                    }
                }
                else {
                    parent[key].dataBind();
                }
            }
        };
        Base.prototype.clearChanges = function () {
            this.finalUpdate();
            this.changedProperties = {};
            this.oldProperties = {};
            this.childChangedProperties = {};
        };
        Base.prototype.dataBind = function () {
            Base.callChildDataBind(this.childChangedProperties, this);
            if (Object.getOwnPropertyNames(this.changedProperties).length) {
                var prevDetection = this.isProtectedOnChange;
                var newChanges = this.changedProperties;
                var oldChanges = this.oldProperties;
                this.clearChanges();
                this.isProtectedOnChange = true;
                this.onPropertyChanged(newChanges, oldChanges);
                this.isProtectedOnChange = prevDetection;
            }
        };
        ;
        Base.prototype.saveChanges = function (key, newValue, oldValue) {
            if (this.isProtectedOnChange) {
                return;
            }
            this.oldProperties[key] = oldValue;
            this.changedProperties[key] = newValue;
            this.finalUpdate();
            this.finalUpdate = util_1.setImmediate(this.dataBind.bind(this));
        };
        ;
        Base.prototype.addEventListener = function (eventName, handler) {
            this.modelObserver.on(eventName, handler);
        };
        Base.prototype.removeEventListener = function (eventName, handler) {
            this.modelObserver.off(eventName, handler);
        };
        Base.prototype.trigger = function (eventName, eventProp) {
            if (this.isDestroyed !== true) {
                var prevDetection = this.isProtectedOnChange;
                this.isProtectedOnChange = false;
                this.modelObserver.notify(eventName, eventProp);
                this.isProtectedOnChange = prevDetection;
            }
        };
        Base.prototype.addInstance = function () {
            var moduleClass = 'e-' + this.getModuleName().toLowerCase();
            dom_1.addClass([this.element], ['e-control', moduleClass]);
            if (!util_1.isNullOrUndefined(this.element.ej2_instances)) {
                this.element.ej2_instances.push(this);
            }
            else {
                util_1.setValue('ej2_instances', [this], this.element);
            }
        };
        Base.prototype.destroy = function () {
            var _this = this;
            this.element.ej2_instances =
                this.element.ej2_instances.filter(function (i) { return i !== _this; });
            dom_1.removeClass([this.element], ['e-' + this.getModuleName()]);
            if (this.element.ej2_instances.length === 0) {
                dom_1.removeClass([this.element], ['e-control']);
            }
            this.clearChanges();
            this.modelObserver.destroy();
            this.isDestroyed = true;
        };
        return Base;
    }());
    exports.Base = Base;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Observer = (function () {
        function Observer(context) {
            this.boundedEvents = {};
            if (util_1.isNullOrUndefined(context)) {
                return;
            }
            this.context = context;
        }
        ;
        Observer.prototype.on = function (property, handler, context) {
            if (util_1.isNullOrUndefined(handler)) {
                return;
            }
            var cntxt = context || this.context;
            if (this.notExist(property)) {
                this.boundedEvents[property] = [{ handler: handler, context: cntxt }];
                return;
            }
            if (!this.isHandlerPresent(this.boundedEvents[property], handler)) {
                this.boundedEvents[property].push({ handler: handler, context: cntxt });
            }
        };
        Observer.prototype.off = function (property, handler) {
            if (this.notExist(property)) {
                return;
            }
            var curObject = util_1.getValue(property, this.boundedEvents);
            if (handler) {
                for (var i = 0; i < curObject.length; i++) {
                    if (handler === curObject[i].handler) {
                        curObject.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                delete this.boundedEvents[property];
            }
        };
        Observer.prototype.notify = function (property, argument) {
            if (this.notExist(property)) {
                return;
            }
            if (argument) {
                argument.name = property;
            }
            var curObject = util_1.getValue(property, this.boundedEvents).slice(0);
            for (var _i = 0, curObject_1 = curObject; _i < curObject_1.length; _i++) {
                var cur = curObject_1[_i];
                cur.handler.call(cur.context, argument);
            }
        };
        Observer.prototype.destroy = function () {
            this.boundedEvents = this.context = undefined;
        };
        Observer.prototype.notExist = function (prop) {
            return this.boundedEvents.hasOwnProperty(prop) === false;
        };
        Observer.prototype.isHandlerPresent = function (boundedEvents, handler) {
            for (var _i = 0, boundedEvents_1 = boundedEvents; _i < boundedEvents_1.length; _i++) {
                var cur = boundedEvents_1[_i];
                if (cur.handler === handler) {
                    return true;
                }
            }
            return false;
        };
        return Observer;
    }());
    exports.Observer = Observer;
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

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.calculatePosition = calculatePosition;
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(76), __webpack_require__(38), __webpack_require__(39)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, internationalization_1, intl_base_1, parser_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var errorText = {
        'ms': 'minimumSignificantDigits',
        'ls': 'maximumSignificantDigits',
        'mf': 'minimumFractionDigits',
        'lf': 'maximumFractionDigits',
    };
    var integerError = 'minimumIntegerDigits';
    var percentSign = 'percentSign';
    var minusSign = 'minusSign';
    var spaceRegex = /\s/;
    var mapper = ['infinity', 'nan', 'group', 'decimal'];
    var infinity = 'infinity';
    var nan = 'nan';
    var NumberFormat = (function () {
        function NumberFormat() {
        }
        NumberFormat.numberFormatter = function (culture, option, cldr) {
            var _this = this;
            var fOptions = util_1.extend({}, option);
            var cOptions = {};
            var dOptions = {};
            var symbolPattern;
            var dependable = intl_base_1.IntlBase.getDependables(cldr, culture, true);
            dOptions.numberMapper = parser_base_1.ParserBase.getNumberMapper(dependable.parserObject, parser_base_1.ParserBase.getNumberingSystem(cldr), true);
            dOptions.currencySymbol = intl_base_1.IntlBase.getCurrencySymbol(dependable.numericObject, fOptions.currency || internationalization_1.defaultCurrencyCode);
            dOptions.percentSymbol = dOptions.numberMapper.numberSymbols[percentSign];
            dOptions.minusSymbol = dOptions.numberMapper.numberSymbols[minusSign];
            var symbols = dOptions.numberMapper.numberSymbols;
            if ((option.format) && !(intl_base_1.IntlBase.formatRegex.test(option.format))) {
                cOptions = intl_base_1.IntlBase.customFormat(option.format, dOptions, dependable.numericObject);
            }
            else {
                util_1.extend(fOptions, intl_base_1.IntlBase.getProperNumericSkeleton(option.format || 'N'));
                fOptions.isCurrency = fOptions.type === 'currency';
                fOptions.isPercent = fOptions.type === 'percent';
                symbolPattern = intl_base_1.IntlBase.getSymbolPattern(fOptions.type, dOptions.numberMapper.numberSystem, dependable.numericObject, fOptions.isAccount);
                fOptions.groupOne = this.checkValueRange(fOptions.maximumSignificantDigits, fOptions.minimumSignificantDigits, true);
                this.checkValueRange(fOptions.maximumFractionDigits, fOptions.minimumFractionDigits, false, true);
                if (!util_1.isUndefined(fOptions.fractionDigits)) {
                    fOptions.minimumFractionDigits = fOptions.maximumFractionDigits = fOptions.fractionDigits;
                }
                if (util_1.isUndefined(fOptions.useGrouping)) {
                    fOptions.useGrouping = true;
                }
                if (fOptions.isCurrency) {
                    symbolPattern = symbolPattern.replace(/\u00A4/g, intl_base_1.IntlBase.defaultCurrency);
                }
                var split = symbolPattern.split(';');
                cOptions.nData = intl_base_1.IntlBase.getFormatData(split[1] || '-' + split[0], true, dOptions.currencySymbol);
                cOptions.pData = intl_base_1.IntlBase.getFormatData(split[0], false, dOptions.currencySymbol);
                if (fOptions.useGrouping) {
                    fOptions.groupSeparator = symbols[mapper[2]];
                    fOptions.groupData = this.getGroupingDetails(split[0]);
                }
                var minFrac = util_1.isUndefined(fOptions.minimumFractionDigits);
                if (minFrac) {
                    fOptions.minimumFractionDigits = cOptions.nData.minimumFraction;
                }
                if (util_1.isUndefined(fOptions.maximumFractionDigits)) {
                    var mval = cOptions.nData.maximumFraction;
                    fOptions.maximumFractionDigits = util_1.isUndefined(mval) && fOptions.isPercent ? 0 : mval;
                }
                var mfrac = fOptions.minimumFractionDigits;
                var lfrac = fOptions.maximumFractionDigits;
                if (!util_1.isUndefined(mfrac) && !util_1.isUndefined(lfrac)) {
                    if (mfrac > lfrac) {
                        fOptions.maximumFractionDigits = mfrac;
                    }
                }
            }
            util_1.extend(cOptions.nData, fOptions);
            util_1.extend(cOptions.pData, fOptions);
            return function (value) {
                if (isNaN(value)) {
                    return symbols[mapper[1]];
                }
                else if (!isFinite(value)) {
                    return symbols[mapper[0]];
                }
                return _this.intNumberFormatter(value, cOptions, dOptions);
            };
        };
        NumberFormat.getGroupingDetails = function (pattern) {
            var ret = {};
            var match = pattern.match(intl_base_1.IntlBase.negativeDataRegex);
            if (match && match[4]) {
                var pattern_1 = match[4];
                var p = pattern_1.lastIndexOf(',');
                if (p !== -1) {
                    var temp = pattern_1.split('.')[0];
                    ret.primary = (temp.length - p) - 1;
                    var s = pattern_1.lastIndexOf(',', p - 1);
                    if (s !== -1) {
                        ret.secondary = p - 1 - s;
                    }
                }
            }
            return ret;
        };
        NumberFormat.checkValueRange = function (val1, val2, checkbothExist, isFraction) {
            var decide = isFraction ? 'f' : 's';
            var dint = 0;
            var str1 = errorText['l' + decide];
            var str2 = errorText['m' + decide];
            if (!util_1.isUndefined(val1)) {
                this.checkRange(val1, str1, isFraction);
                dint++;
            }
            if (!util_1.isUndefined(val2)) {
                this.checkRange(val2, str2, isFraction);
                dint++;
            }
            if (dint === 2) {
                if (val1 < val2) {
                    util_1.throwError(str2 + 'specified must be less than the' + str1);
                }
                else {
                    return true;
                }
            }
            else if (checkbothExist && dint === 1) {
                util_1.throwError('Both' + str2 + 'and' + str2 + 'must be present');
            }
            return false;
        };
        NumberFormat.checkRange = function (val, text, isFraction) {
            var range = isFraction ? [0, 20] : [1, 21];
            if (val < range[0] || val > range[1]) {
                util_1.throwError(text + 'value must be within the range' + range[0] + 'to' + range[1]);
            }
        };
        NumberFormat.intNumberFormatter = function (value, fOptions, dOptions) {
            var curData;
            if (value < 0) {
                value = value * -1;
                curData = fOptions.nData;
            }
            else if (value === 0) {
                curData = fOptions.zeroData || fOptions.pData;
            }
            else {
                curData = fOptions.pData;
            }
            var fValue = '';
            if (curData.isPercent) {
                value = value * 100;
            }
            if (curData.groupOne) {
                fValue = this.processSignificantDigits(value, curData.minimumSignificantDigits, curData.maximumSignificantDigits);
            }
            else {
                fValue = this.processFraction(value, curData.minimumFractionDigits, curData.maximumFractionDigits);
                if (curData.minimumIntegerDigits) {
                    fValue = this.processMinimumIntegers(fValue, curData.minimumIntegerDigits);
                }
            }
            fValue = fValue.replace('.', dOptions.numberMapper.numberSymbols[mapper[3]]);
            if (curData.useGrouping) {
                fValue = this.groupNumbers(fValue, curData.groupData.primary, curData.groupSeparator || ',', dOptions.numberMapper.numberSymbols[mapper[3]] || '.', curData.groupData.secondary);
            }
            fValue = parser_base_1.ParserBase.convertValueParts(fValue, intl_base_1.IntlBase.latnParseRegex, dOptions.numberMapper.mapper);
            return curData.nlead + fValue + curData.nend;
        };
        NumberFormat.processSignificantDigits = function (value, min, max) {
            var temp = value + '';
            var tn;
            var length = temp.length;
            if (length < min) {
                return value.toPrecision(min);
            }
            else {
                temp = value.toPrecision(max);
                tn = +temp;
                return tn + '';
            }
        };
        NumberFormat.groupNumbers = function (val, level1, sep, decimalSymbol, level2) {
            var flag = !util_1.isNullOrUndefined(level2) && level2 !== 0;
            var split = val.split(decimalSymbol);
            var prefix = split[0];
            var length = prefix.length;
            var str = '';
            while (length > level1) {
                str = prefix.slice(length - level1, length) + (str.length ?
                    (sep + str) : '');
                length -= level1;
                if (flag) {
                    level1 = level2;
                    flag = false;
                }
            }
            split[0] = prefix.slice(0, length) + (str.length ? sep : '') + str;
            return split.join(decimalSymbol);
        };
        NumberFormat.processFraction = function (value, min, max) {
            var temp = (value + '').split('.')[1];
            var length = temp ? temp.length : 0;
            if (min && length < min) {
                var ret = '';
                if (length === 0) {
                    ret = value.toFixed(min);
                }
                else {
                    ret += value;
                    for (var j = 0; j < min - length; j++) {
                        ret += '0';
                    }
                    return ret;
                }
                return value.toFixed(min);
            }
            else if (!util_1.isNullOrUndefined(max) && (length > max || max === 0)) {
                return value.toFixed(max);
            }
            return value + '';
        };
        NumberFormat.processMinimumIntegers = function (value, min) {
            var temp = value.split('.');
            var lead = temp[0];
            var len = lead.length;
            if (len < min) {
                for (var i = 0; i < min - len; i++) {
                    lead = '0' + lead;
                }
                temp[0] = lead;
            }
            return temp.join('.');
        };
        return NumberFormat;
    }());
    exports.NumberFormat = NumberFormat;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(57)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChildProperty = (function () {
        function ChildProperty(parent, propName, defaultValue, isArray) {
            this.properties = {};
            this.changedProperties = {};
            this.childChangedProperties = {};
            this.oldProperties = {};
            this.finalUpdate = function () { };
            this.callChildDataBind = util_1.getValue('callChildDataBind', base_1.Base);
            this.parentObj = parent;
            this.controlParent = this.parentObj.controlParent || this.parentObj;
            this.propName = propName;
            this.setProperties(defaultValue, true);
            this.isParentArray = isArray;
        }
        ChildProperty.prototype.updateChange = function (val, propName) {
            if (val === true) {
                this.parentObj.childChangedProperties[propName] = val;
            }
            else {
                delete this.parentObj.childChangedProperties[propName];
            }
            if (this.parentObj.updateChange) {
                this.parentObj.updateChange(val, this.parentObj.propName);
            }
        };
        ChildProperty.prototype.updateTimeOut = function () {
            if (this.parentObj.updateTimeOut) {
                this.parentObj.finalUpdate();
                this.parentObj.updateTimeOut();
            }
            else {
                this.parentObj.finalUpdate = util_1.setImmediate(this.parentObj.dataBind.bind(this.parentObj));
            }
        };
        ChildProperty.prototype.clearChanges = function () {
            this.finalUpdate();
            this.updateChange(false, this.propName);
            this.oldProperties = {};
            this.changedProperties = {};
        };
        ChildProperty.prototype.setProperties = function (prop, muteOnChange) {
            if (muteOnChange === true) {
                util_1.merge(this, prop);
                this.updateChange(false, this.propName);
                this.clearChanges();
            }
            else {
                util_1.merge(this, prop);
            }
        };
        ChildProperty.prototype.dataBind = function () {
            this.callChildDataBind(this.childChangedProperties, this);
            if (this.isParentArray) {
                var curIndex = this.parentObj[this.propName].indexOf(this);
                if (Object.keys(this.changedProperties).length) {
                    util_1.setValue(this.propName + '.' + curIndex, this.changedProperties, this.parentObj.changedProperties);
                    util_1.setValue(this.propName + '.' + curIndex, this.oldProperties, this.parentObj.oldProperties);
                }
            }
            else {
                this.parentObj.changedProperties[this.propName] = this.changedProperties;
                this.parentObj.oldProperties[this.propName] = this.oldProperties;
            }
            this.clearChanges();
        };
        ChildProperty.prototype.saveChanges = function (key, newValue, oldValue) {
            if (this.controlParent.isProtectedOnChange) {
                return;
            }
            this.oldProperties[key] = oldValue;
            this.changedProperties[key] = newValue;
            this.updateChange(true, this.propName);
            this.finalUpdate();
            this.updateTimeOut();
        };
        return ChildProperty;
    }());
    exports.ChildProperty = ChildProperty;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(128), __webpack_require__(74), __webpack_require__(129), __webpack_require__(130), __webpack_require__(38), __webpack_require__(3), __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, date_formatter_1, number_formatter_1, date_parser_1, number_parser_1, intl_base_1, util_1, observer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onIntlChange = new observer_1.Observer();
    exports.rightToLeft = false;
    exports.cldrData = {};
    exports.defaultCulture = 'en-US';
    exports.defaultCurrencyCode = 'USD';
    var mapper = ['numericObject', 'dateObject'];
    var Internationalization = (function () {
        function Internationalization(cultureName) {
            if (cultureName) {
                this.culture = cultureName;
            }
        }
        Internationalization.prototype.getDateFormat = function (options) {
            return date_formatter_1.DateFormat.dateFormat(this.getCulture(), options || { type: 'date', skeleton: 'short' }, exports.cldrData);
        };
        Internationalization.prototype.getNumberFormat = function (options) {
            if (options && !options.currency) {
                options.currency = exports.defaultCurrencyCode;
            }
            return number_formatter_1.NumberFormat.numberFormatter(this.getCulture(), options || {}, exports.cldrData);
        };
        Internationalization.prototype.getDateParser = function (options) {
            return date_parser_1.DateParser.dateParser(this.getCulture(), options || { skeleton: 'short', type: 'date' }, exports.cldrData);
        };
        Internationalization.prototype.getNumberParser = function (options) {
            return number_parser_1.NumberParser.numberParser(this.getCulture(), options || { format: 'N' }, exports.cldrData);
        };
        Internationalization.prototype.formatNumber = function (value, option) {
            return this.getNumberFormat(option)(value);
        };
        Internationalization.prototype.formatDate = function (value, option) {
            return this.getDateFormat(option)(value);
        };
        Internationalization.prototype.parseDate = function (value, option) {
            return this.getDateParser(option)(value);
        };
        Internationalization.prototype.parseNumber = function (value, option) {
            return this.getNumberParser(option)(value);
        };
        Internationalization.prototype.getCulture = function () {
            return this.culture || exports.defaultCulture;
        };
        return Internationalization;
    }());
    exports.Internationalization = Internationalization;
    function setCulture(cultureName) {
        exports.defaultCulture = cultureName;
        exports.onIntlChange.notify('notifyExternalChange', { 'locale': exports.defaultCulture });
    }
    exports.setCulture = setCulture;
    function setCurrencyCode(currencyCode) {
        exports.defaultCurrencyCode = currencyCode;
    }
    exports.setCurrencyCode = setCurrencyCode;
    function loadCldr() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
            var obj = data_1[_a];
            util_1.extend(exports.cldrData, obj, {}, true);
        }
    }
    exports.loadCldr = loadCldr;
    function enableRtl(status) {
        if (status === void 0) { status = true; }
        exports.rightToLeft = status;
        exports.onIntlChange.notify('notifyExternalChange', { enableRtl: exports.rightToLeft });
    }
    exports.enableRtl = enableRtl;
    function getNumericObject(locale, type) {
        var numObject = intl_base_1.IntlBase.getDependables(exports.cldrData, locale, true)[mapper[0]];
        var dateObject = intl_base_1.IntlBase.getDependables(exports.cldrData, locale)[mapper[1]];
        var numSystem = util_1.getValue('defaultNumberingSystem', numObject);
        var symbPattern = util_1.getValue('symbols-numberSystem-' + numSystem, numObject);
        var pattern = intl_base_1.IntlBase.getSymbolPattern(type || 'decimal', numSystem, numObject, false);
        return util_1.extend(symbPattern, intl_base_1.IntlBase.getFormatData(pattern, true, '', true), { 'dateSeparator': intl_base_1.IntlBase.getDateSeparator(dateObject) });
    }
    exports.getNumericObject = getNumericObject;
    function getDefaultDateObject() {
        return intl_base_1.IntlBase.getDependables(exports.cldrData, '', false)[mapper[1]];
    }
    exports.getDefaultDateObject = getDefaultDateObject;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


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

},[197]);