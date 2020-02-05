let instances = 'ej2_instances';
let uid = 0;
let isBlazorPlatform = false;
/**
 * Function to check whether the platform is blazor or not.
 * @return {boolean} result
 * @private
 */
function disableBlazorMode() {
    isBlazorPlatform = false;
}
/**
 * Create Instance from constructor function with desired parameters.
 * @param {Function} classFunction - Class function to which need to create instance
 * @param {any[]} params - Parameters need to passed while creating instance
 * @return {any}
 * @private
 */
function createInstance(classFunction, params) {
    let arrayParam = params;
    arrayParam.unshift(undefined);
    return new (Function.prototype.bind.apply(classFunction, arrayParam));
}
/**
 * To run a callback function immediately after the browser has completed other operations.
 * @param {Function} handler - callback function to be triggered.
 * @return {Function}
 * @private
 */
function setImmediate(handler) {
    let unbind;
    let num = new Uint16Array(5);
    let intCrypto = window.msCrypto || window.crypto;
    intCrypto.getRandomValues(num);
    let secret = 'ej2' + combineArray(num);
    let messageHandler = (event) => {
        if (event.source === window && typeof event.data === 'string' && event.data.length <= 32 && event.data === secret) {
            handler();
            unbind();
        }
    };
    window.addEventListener('message', messageHandler, false);
    window.postMessage(secret, '*');
    return unbind = () => {
        window.removeEventListener('message', messageHandler);
        handler = messageHandler = secret = undefined;
    };
}
/**
 * To get nameSpace value from the desired object.
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} obj - Object to get the inner object value.
 * @return {any}
 * @private
 */
function getValue(nameSpace, obj) {
    /* tslint:disable no-any */
    let value = obj;
    let splits = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    for (let i = 0; i < splits.length && !isUndefined(value); i++) {
        value = value[splits[i]];
    }
    return value;
}
/**
 * To set value for the nameSpace in desired object.
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} value - Value that you need to set.
 * @param {any} obj - Object to get the inner object value.
 * @return {void}
 * @private
 */
function setValue(nameSpace, value, obj) {
    let keys = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    let start = obj || {};
    let fromObj = start;
    let i;
    let length = keys.length;
    let key;
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
/**
 * Delete an item from Object
 * @param {any} obj - Object in which we need to delete an item.
 * @param {string} params - String value to the get the inner object
 * @return {void}
 * @private
 */
function deleteObject(obj, key) {
    delete obj[key];
}
/**
 * Check weather the given argument is only object.
 * @param {any} obj - Object which is need to check.
 * @return {boolean}
 * @private
 */
function isObject(obj) {
    let objCon = {};
    return (!isNullOrUndefined(obj) && obj.constructor === objCon.constructor);
}
/**
 * To get enum value by giving the string.
 * @param {any} enumObject - Enum object.
 * @param {string} enumValue - Enum value to be searched
 * @return {any}
 * @private
 */
function getEnumValue(enumObject, enumValue) {
    return enumObject[enumValue];
}
/**
 * Merge the source object into destination object.
 * @param {any} source - source object which is going to merge with destination object
 * @param {any} destination - object need to be merged
 * @return {void}
 * @private
 */
function merge(source, destination) {
    if (!isNullOrUndefined(destination)) {
        let temrObj = source;
        let tempProp = destination;
        let keys = Object.keys(destination);
        let deepmerge = 'deepMerge';
        for (let key of keys) {
            if (!isNullOrUndefined(temrObj[deepmerge]) && (temrObj[deepmerge].indexOf(key) !== -1) &&
                (isObject(tempProp[key]) || Array.isArray(tempProp[key]))) {
                extend(temrObj[key], temrObj[key], tempProp[key], true);
            }
            else {
                temrObj[key] = tempProp[key];
            }
        }
    }
}
/**
 * Extend the two object with newer one.
 * @param {any} copied - Resultant object after merged
 * @param {Object} first - First object need to merge
 * @param {Object} second - Second object need to merge
 * @return {Object}
 * @private
 */
function extend(copied, first, second, deep) {
    let result = copied && typeof copied === 'object' ? copied : {};
    let length = arguments.length;
    if (deep) {
        length = length - 1;
    }
    for (let i = 1; i < length; i++) {
        if (!arguments[i]) {
            continue;
        }
        let obj1 = arguments[i];
        Object.keys(obj1).forEach((key) => {
            let src = result[key];
            let copy = obj1[key];
            let clone;
            let isArrayChanged = Array.isArray(copy) && Array.isArray(src) && (copy.length !== src.length);
            let blazorEventExtend = isBlazor() ? (!(src instanceof Event) && !isArrayChanged) : true;
            if (deep && blazorEventExtend && (isObject(copy) || Array.isArray(copy))) {
                if (isObject(copy)) {
                    clone = src ? src : {};
                    if (Array.isArray(clone) && clone.hasOwnProperty('isComplexArray')) {
                        extend(clone, {}, copy, deep);
                    }
                    else {
                        result[key] = extend(clone, {}, copy, deep);
                    }
                }
                else {
                    clone = src ? src : [];
                    result[key] = extend([], clone, copy, deep);
                }
            }
            else {
                result[key] = copy;
            }
        });
    }
    return result;
}
/**
 * To check whether the object is null or undefined.
 * @param {Object} value - To check the object is null or undefined
 * @return {boolean}
 * @private
 */
function isNullOrUndefined(value) {
    return value === undefined || value === null;
}
/**
 * To check whether the object is undefined.
 * @param {Object} value - To check the object is undefined
 * @return {boolean}
 * @private
 */
function isUndefined(value) {
    return ('undefined' === typeof value);
}
/**
 * To return the generated unique name
 * @param {string} definedName - To concatenate the unique id to provided name
 * @return {string}
 * @private
 */
function getUniqueID(definedName) {
    return definedName + '_' + uid++;
}
/**
 * It limits the rate at which a function can fire. The function will fire only once every provided second instead of as quickly.
 * @param {Function} eventFunction - Specifies the function to run when the event occurs
 * @param {number} delay - A number that specifies the milliseconds for function delay call option
 * @return {Function}
 * @private
 */
function debounce(eventFunction, delay) {
    let out;
    // tslint:disable-next-line
    return function () {
        let args = arguments;
        let later = () => {
            out = null;
            return eventFunction.apply(this, args);
        };
        clearTimeout(out);
        out = setTimeout(later, delay);
    };
}
// Added since lint ignored after added '//tslint:disable-next-line' 
/* tslint:disable:no-any */
/**
 * To convert the object to string for query url
 * @param  {Object} data
 * @returns string
 * @private
 */
function queryParams(data) {
    let array = [];
    let keys = Object.keys(data);
    for (let key of keys) {
        array.push(encodeURIComponent(key) + '=' + encodeURIComponent('' + data[key]));
    }
    return array.join('&');
}
/**
 * To check whether the given array contains object.
 * @param {T[]} value- Specifies the T type array to be checked.
 * @private
 */
function isObjectArray(value) {
    let parser = Object.prototype.toString;
    if (parser.call(value) === '[object Array]') {
        if (parser.call(value[0]) === '[object Object]') {
            return true;
        }
    }
    return false;
}
/**
 * To check whether the  child element is descendant to parent element or parent and child are same element.
 * @param{Element} - Specifies the child element to compare with parent.
 * @param{Element} - Specifies the parent element.
 * @return boolean
 * @private
 */
function compareElementParent(child, parent) {
    let node = child;
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
/**
 * To throw custom error message.
 * @param{string} - Specifies the error message to be thrown.
 * @private
 */
function throwError(message) {
    try {
        throw new Error(message);
    }
    catch (e) {
        throw e.message + '\n' + e.stack;
    }
}
/**
 * This function is used to print given element
 * @param{Element} element - Specifies the print content element.
 * @param{Window} printWindow - Specifies the print window.
 * @private
 */
function print(element, printWindow) {
    let div = document.createElement('div');
    let links = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('base, link, style'));
    let reference = '';
    if (isNullOrUndefined(printWindow)) {
        printWindow = window.open('', 'print', 'height=452,width=1024,tabbar=no');
    }
    div.appendChild(element.cloneNode(true));
    for (let i = 0, len = links.length; i < len; i++) {
        reference += links[i].outerHTML;
    }
    printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
        '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    // tslint:disable-next-line
    let interval = setInterval(() => {
        if (printWindow.ready) {
            printWindow.print();
            printWindow.close();
            clearInterval(interval);
        }
    }, 500);
    return printWindow;
}
/**
 * Function to normalize the units applied to the element.
 * @param  {number|string} value
 * @return {string} result
 * @private
 */
function formatUnit(value) {
    let result = value + '';
    if (result === 'auto' || result.indexOf('%') !== -1 || result.indexOf('px') !== -1) {
        return result;
    }
    return result + 'px';
}
/**
 * Function to check whether the platform is blazor or not.
 * @return {boolean} result
 * @private
 */
function enableBlazorMode() {
    isBlazorPlatform = true;
}
/**
 * Function to check whether the platform is blazor or not.
 * @return {boolean} result
 * @private
 */
function isBlazor() {
    return isBlazorPlatform;
}
/**
 * Function to convert xPath to DOM element in blazor platform
 * @return {HTMLElement} result
 * @param {HTMLElement | object} element
 * @private
 */
function getElement(element) {
    let xPath = 'xPath';
    if (!(element instanceof Node) && isBlazor() && !isNullOrUndefined(element[xPath])) {
        return document.evaluate(element[xPath], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    return element;
}
/**
 * Function to fetch the Instances of a HTML element for the given component.
 * @param {string | HTMLElement} element
 * @param {any} component
 * @return {Object} inst
 * @private
 */
// tslint:disable-next-line
function getInstance(element, component) {
    // tslint:disable-next-line:no-any
    let elem = (typeof (element) === 'string') ? document.querySelector(element) : element;
    if (elem[instances]) {
        for (let inst of elem[instances]) {
            if (inst instanceof component) {
                return inst;
            }
        }
    }
    return null;
}
/**
 * Function to add instances for the given element.
 * @param {string | HTMLElement} element
 * @param {Object} instance
 * @return {void}
 * @private
 */
function addInstance(element, instance) {
    // tslint:disable-next-line:no-any
    let elem = (typeof (element) === 'string') ? document.querySelector(element) : element;
    if (elem[instances]) {
        elem[instances].push(instance);
    }
    else {
        elem[instances] = [instance];
    }
}
/**
 * Function to generate the unique id.
 * @return {any}
 * @private
 */
// tslint:disable-next-line:no-any
function uniqueID() {
    // tslint:disable-next-line:no-any
    if ((typeof window) === 'undefined') {
        return;
    }
    // tslint:disable-next-line:no-any
    let num = new Uint16Array(5);
    let intCrypto = window.msCrypto || window.crypto;
    return intCrypto.getRandomValues(num);
}
function combineArray(num) {
    let ret = '';
    for (let i = 0; i < 5; i++) {
        ret += (i ? ',' : '') + num[i];
    }
    return ret;
}

/**
 * Parser
 */
const defaultNumberingSystem = {
    'latn': {
        '_digits': '0123456789',
        '_type': 'numeric'
    }
};
const defaultNumberSymbols = {
    'decimal': '.',
    'group': ',',
    'percentSign': '%',
    'plusSign': '+',
    'minusSign': '-',
    'infinity': '∞',
    'nan': 'NaN',
    'exponential': 'E'
};
const latnNumberSystem = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/**
 * Interface for parser base
 * @private
 */
class ParserBase {
    /**
     * Returns the cldr object for the culture specifies
     * @param {Object} obj - Specifies the object from which culture object to be acquired.
     * @param {string} cName - Specifies the culture name.
     * @returns {Object}
     */
    static getMainObject(obj, cName) {
        return getValue('main.' + cName, obj);
    }
    /**
     * Returns the numbering system object from given cldr data.
     * @param {Object} obj - Specifies the object from which number system is acquired.
     * @returns {Object}
     */
    static getNumberingSystem(obj) {
        return getValue('supplemental.numberingSystems', obj) || this.numberingSystems;
    }
    /**
     * Returns the reverse of given object keys or keys specified.
     * @param {Object} prop - Specifies the object to be reversed.
     * @param {number[]} keys - Optional parameter specifies the custom keyList for reversal.
     * @returns {Object}
     */
    static reverseObject(prop, keys) {
        let propKeys = keys || Object.keys(prop);
        let res = {};
        for (let key of propKeys) {
            /* tslint:disable no-any */
            if (!res.hasOwnProperty(prop[key])) {
                res[prop[key]] = key;
            }
        }
        return res;
    }
    /**
     * Returns the symbol regex by skipping the escape sequence.
     * @param {string[]} props - Specifies the array values to be skipped.
     * @returns {RegExp}
     */
    static getSymbolRegex(props) {
        let regexStr = props.map((str) => {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        }).join('|');
        return new RegExp(regexStr, 'g');
    }
    static getSymbolMatch(prop) {
        let matchKeys = Object.keys(defaultNumberSymbols);
        let ret = {};
        for (let key of matchKeys) {
            ret[prop[key]] = defaultNumberSymbols[key];
        }
        return ret;
    }
    /**
     * Returns regex string for provided value
     * @param {string} val
     * @returns {string}
     */
    static constructRegex(val) {
        let len = val.length;
        let ret = '';
        for (let i = 0; i < len; i++) {
            if (i !== len - 1) {
                ret += val[i] + '|';
            }
            else {
                ret += val[i];
            }
        }
        return ret;
    }
    /**
     * Returns the replaced value of matching regex and obj mapper.
     * @param {string} value - Specifies the  values to be replaced.
     * @param {RegExp} regex - Specifies the  regex to search.
     * @param {Object} obj - Specifies the  object matcher to be replace value parts.
     * @returns {string}
     */
    static convertValueParts(value, regex, obj) {
        return value.replace(regex, (str) => {
            return obj[str];
        });
    }
    /**
     * Returns default numbering system object for formatting from cldr data
     * @param {Object} obj
     * @returns {NumericObject}
     */
    static getDefaultNumberingSystem(obj) {
        let ret = {};
        ret.obj = getValue('numbers', obj);
        ret.nSystem = getValue('defaultNumberingSystem', ret.obj);
        return ret;
    }
    /**
     * Returns the replaced value of matching regex and obj mapper.
     */
    static getCurrentNumericOptions(curObj, numberSystem, needSymbols) {
        let ret = {};
        let cur = this.getDefaultNumberingSystem(curObj);
        if (!isUndefined(cur.nSystem)) {
            let digits = getValue(cur.nSystem + '._digits', numberSystem);
            if (!isUndefined(digits)) {
                ret.numericPair = this.reverseObject(digits, latnNumberSystem);
                ret.numberParseRegex = new RegExp(this.constructRegex(digits), 'g');
                ret.numericRegex = '[' + digits[0] + '-' + digits[9] + ']';
                if (needSymbols) {
                    ret.numericRegex = digits[0] + '-' + digits[9];
                    ret.symbolNumberSystem = getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
                    ret.symbolMatch = this.getSymbolMatch(ret.symbolNumberSystem);
                    ret.numberSystem = cur.nSystem;
                }
            }
        }
        return ret;
    }
    /**
     * Returns number mapper object for the provided cldr data
     * @param {Object} curObj
     * @param {Object} numberSystem
     * @param {boolean} isNumber
     * @returns {NumberMapper}
     */
    static getNumberMapper(curObj, numberSystem, isNumber) {
        let ret = { mapper: {} };
        let cur = this.getDefaultNumberingSystem(curObj);
        if (!isUndefined(cur.nSystem)) {
            ret.numberSystem = cur.nSystem;
            ret.numberSymbols = getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
            ret.timeSeparator = getValue('timeSeparator', ret.numberSymbols);
            let digits = getValue(cur.nSystem + '._digits', numberSystem);
            if (!isUndefined(digits)) {
                for (let i of latnNumberSystem) {
                    ret.mapper[i] = digits[i];
                }
            }
        }
        return ret;
    }
}
ParserBase.nPair = 'numericPair';
ParserBase.nRegex = 'numericRegex';
ParserBase.numberingSystems = defaultNumberingSystem;

/***
 * Hijri parser
 */
var HijriParser;
(function (HijriParser) {
    /* tslint:disable */
    const dateCorrection = [28607, 28636, 28665, 28695, 28724, 28754, 28783, 28813, 28843, 28872, 28901, 28931, 28960, 28990, 29019, 29049, 29078, 29108, 29137, 29167,
        29196, 29226, 29255, 29285, 29315, 29345, 29375, 29404, 29434, 29463, 29492, 29522, 29551, 29580, 29610, 29640, 29669, 29699, 29729, 29759,
        29788, 29818, 29847, 29876, 29906, 29935, 29964, 29994, 30023, 30053, 30082, 30112, 30141, 30171, 30200, 30230, 30259, 30289, 30318, 30348,
        30378, 30408, 30437, 30467, 30496, 30526, 30555, 30585, 30614, 30644, 30673, 30703, 30732, 30762, 30791, 30821, 30850, 30880, 30909, 30939,
        30968, 30998, 31027, 31057, 31086, 31116, 31145, 31175, 31204, 31234, 31263, 31293, 31322, 31352, 31381, 31411, 31441, 31471, 31500, 31530,
        31559, 31589, 31618, 31648, 31676, 31706, 31736, 31766, 31795, 31825, 31854, 31884, 31913, 31943, 31972, 32002, 32031, 32061, 32090, 32120,
        32150, 32180, 32209, 32239, 32268, 32298, 32327, 32357, 32386, 32416, 32445, 32475, 32504, 32534, 32563, 32593, 32622, 32652, 32681, 32711,
        32740, 32770, 32799, 32829, 32858, 32888, 32917, 32947, 32976, 33006, 33035, 33065, 33094, 33124, 33153, 33183, 33213, 33243, 33272, 33302,
        33331, 33361, 33390, 33420, 33450, 33479, 33509, 33539, 33568, 33598, 33627, 33657, 33686, 33716, 33745, 33775, 33804, 33834, 33863, 33893,
        33922, 33952, 33981, 34011, 34040, 34069, 34099, 34128, 34158, 34187, 34217, 34247, 34277, 34306, 34336, 34365, 34395, 34424, 34454, 34483,
        34512, 34542, 34571, 34601, 34631, 34660, 34690, 34719, 34749, 34778, 34808, 34837, 34867, 34896, 34926, 34955, 34985, 35015, 35044, 35074,
        35103, 35133, 35162, 35192, 35222, 35251, 35280, 35310, 35340, 35370, 35399, 35429, 35458, 35488, 35517, 35547, 35576, 35605, 35635, 35665,
        35694, 35723, 35753, 35782, 35811, 35841, 35871, 35901, 35930, 35960, 35989, 36019, 36048, 36078, 36107, 36136, 36166, 36195, 36225, 36254,
        36284, 36314, 36343, 36373, 36403, 36433, 36462, 36492, 36521, 36551, 36580, 36610, 36639, 36669, 36698, 36728, 36757, 36786, 36816, 36845,
        36875, 36904, 36934, 36963, 36993, 37022, 37052, 37081, 37111, 37141, 37170, 37200, 37229, 37259, 37288, 37318, 37347, 37377, 37406, 37436,
        37465, 37495, 37524, 37554, 37584, 37613, 37643, 37672, 37701, 37731, 37760, 37790, 37819, 37849, 37878, 37908, 37938, 37967, 37997, 38027,
        38056, 38085, 38115, 38144, 38174, 38203, 38233, 38262, 38292, 38322, 38351, 38381, 38410, 38440, 38469, 38499, 38528, 38558, 38587, 38617,
        38646, 38676, 38705, 38735, 38764, 38794, 38823, 38853, 38882, 38912, 38941, 38971, 39001, 39030, 39059, 39089, 39118, 39148, 39178, 39208,
        39237, 39267, 39297, 39326, 39355, 39385, 39414, 39444, 39473, 39503, 39532, 39562, 39592, 39621, 39650, 39680, 39709, 39739, 39768, 39798,
        39827, 39857, 39886, 39916, 39946, 39975, 40005, 40035, 40064, 40094, 40123, 40153, 40182, 40212, 40241, 40271, 40300, 40330, 40359, 40389,
        40418, 40448, 40477, 40507, 40536, 40566, 40595, 40625, 40655, 40685, 40714, 40744, 40773, 40803, 40832, 40862, 40892, 40921, 40951, 40980,
        41009, 41039, 41068, 41098, 41127, 41157, 41186, 41216, 41245, 41275, 41304, 41334, 41364, 41393, 41422, 41452, 41481, 41511, 41540, 41570,
        41599, 41629, 41658, 41688, 41718, 41748, 41777, 41807, 41836, 41865, 41894, 41924, 41953, 41983, 42012, 42042, 42072, 42102, 42131, 42161,
        42190, 42220, 42249, 42279, 42308, 42337, 42367, 42397, 42426, 42456, 42485, 42515, 42545, 42574, 42604, 42633, 42662, 42692, 42721, 42751,
        42780, 42810, 42839, 42869, 42899, 42929, 42958, 42988, 43017, 43046, 43076, 43105, 43135, 43164, 43194, 43223, 43253, 43283, 43312, 43342,
        43371, 43401, 43430, 43460, 43489, 43519, 43548, 43578, 43607, 43637, 43666, 43696, 43726, 43755, 43785, 43814, 43844, 43873, 43903, 43932,
        43962, 43991, 44021, 44050, 44080, 44109, 44139, 44169, 44198, 44228, 44258, 44287, 44317, 44346, 44375, 44405, 44434, 44464, 44493, 44523,
        44553, 44582, 44612, 44641, 44671, 44700, 44730, 44759, 44788, 44818, 44847, 44877, 44906, 44936, 44966, 44996, 45025, 45055, 45084, 45114,
        45143, 45172, 45202, 45231, 45261, 45290, 45320, 45350, 45380, 45409, 45439, 45468, 45498, 45527, 45556, 45586, 45615, 45644, 45674, 45704,
        45733, 45763, 45793, 45823, 45852, 45882, 45911, 45940, 45970, 45999, 46028, 46058, 46088, 46117, 46147, 46177, 46206, 46236, 46265, 46295,
        46324, 46354, 46383, 46413, 46442, 46472, 46501, 46531, 46560, 46590, 46620, 46649, 46679, 46708, 46738, 46767, 46797, 46826, 46856, 46885,
        46915, 46944, 46974, 47003, 47033, 47063, 47092, 47122, 47151, 47181, 47210, 47240, 47269, 47298, 47328, 47357, 47387, 47417, 47446, 47476,
        47506, 47535, 47565, 47594, 47624, 47653, 47682, 47712, 47741, 47771, 47800, 47830, 47860, 47890, 47919, 47949, 47978, 48008, 48037, 48066,
        48096, 48125, 48155, 48184, 48214, 48244, 48273, 48303, 48333, 48362, 48392, 48421, 48450, 48480, 48509, 48538, 48568, 48598, 48627, 48657,
        48687, 48717, 48746, 48776, 48805, 48834, 48864, 48893, 48922, 48952, 48982, 49011, 49041, 49071, 49100, 49130, 49160, 49189, 49218, 49248,
        49277, 49306, 49336, 49365, 49395, 49425, 49455, 49484, 49514, 49543, 49573, 49602, 49632, 49661, 49690, 49720, 49749, 49779, 49809, 49838,
        49868, 49898, 49927, 49957, 49986, 50016, 50045, 50075, 50104, 50133, 50163, 50192, 50222, 50252, 50281, 50311, 50340, 50370, 50400, 50429,
        50459, 50488, 50518, 50547, 50576, 50606, 50635, 50665, 50694, 50724, 50754, 50784, 50813, 50843, 50872, 50902, 50931, 50960, 50990, 51019,
        51049, 51078, 51108, 51138, 51167, 51197, 51227, 51256, 51286, 51315, 51345, 51374, 51403, 51433, 51462, 51492, 51522, 51552, 51582, 51611,
        51641, 51670, 51699, 51729, 51758, 51787, 51816, 51846, 51876, 51906, 51936, 51965, 51995, 52025, 52054, 52083, 52113, 52142, 52171, 52200,
        52230, 52260, 52290, 52319, 52349, 52379, 52408, 52438, 52467, 52497, 52526, 52555, 52585, 52614, 52644, 52673, 52703, 52733, 52762, 52792,
        52822, 52851, 52881, 52910, 52939, 52969, 52998, 53028, 53057, 53087, 53116, 53146, 53176, 53205, 53235, 53264, 53294, 53324, 53353, 53383,
        53412, 53441, 53471, 53500, 53530, 53559, 53589, 53619, 53648, 53678, 53708, 53737, 53767, 53796, 53825, 53855, 53884, 53913, 53943, 53973,
        54003, 54032, 54062, 54092, 54121, 54151, 54180, 54209, 54239, 54268, 54297, 54327, 54357, 54387, 54416, 54446, 54476, 54505, 54535, 54564,
        54593, 54623, 54652, 54681, 54711, 54741, 54770, 54800, 54830, 54859, 54889, 54919, 54948, 54977, 55007, 55036, 55066, 55095, 55125, 55154,
        55184, 55213, 55243, 55273, 55302, 55332, 55361, 55391, 55420, 55450, 55479, 55508, 55538, 55567, 55597, 55627, 55657, 55686, 55716, 55745,
        55775, 55804, 55834, 55863, 55892, 55922, 55951, 55981, 56011, 56040, 56070, 56100, 56129, 56159, 56188, 56218, 56247, 56276, 56306, 56335,
        56365, 56394, 56424, 56454, 56483, 56513, 56543, 56572, 56601, 56631, 56660, 56690, 56719, 56749, 56778, 56808, 56837, 56867, 56897, 56926,
        56956, 56985, 57015, 57044, 57074, 57103, 57133, 57162, 57192, 57221, 57251, 57280, 57310, 57340, 57369, 57399, 57429, 57458, 57487, 57517,
        57546, 57576, 57605, 57634, 57664, 57694, 57723, 57753, 57783, 57813, 57842, 57871, 57901, 57930, 57959, 57989, 58018, 58048, 58077, 58107,
        58137, 58167, 58196, 58226, 58255, 58285, 58314, 58343, 58373, 58402, 58432, 58461, 58491, 58521, 58551, 58580, 58610, 58639, 58669, 58698,
        58727, 58757, 58786, 58816, 58845, 58875, 58905, 58934, 58964, 58994, 59023, 59053, 59082, 59111, 59141, 59170, 59200, 59229, 59259, 59288,
        59318, 59348, 59377, 59407, 59436, 59466, 59495, 59525, 59554, 59584, 59613, 59643, 59672, 59702, 59731, 59761, 59791, 59820, 59850, 59879,
        59909, 59939, 59968, 59997, 60027, 60056, 60086, 60115, 60145, 60174, 60204, 60234, 60264, 60293, 60323, 60352, 60381, 60411, 60440, 60469,
        60499, 60528, 60558, 60588, 60618, 60648, 60677, 60707, 60736, 60765, 60795, 60824, 60853, 60883, 60912, 60942, 60972, 61002, 61031, 61061,
        61090, 61120, 61149, 61179, 61208, 61237, 61267, 61296, 61326, 61356, 61385, 61415, 61445, 61474, 61504, 61533, 61563, 61592, 61621, 61651,
        61680, 61710, 61739, 61769, 61799, 61828, 61858, 61888, 61917, 61947, 61976, 62006, 62035, 62064, 62094, 62123, 62153, 62182, 62212, 62242,
        62271, 62301, 62331, 62360, 62390, 62419, 62448, 62478, 62507, 62537, 62566, 62596, 62625, 62655, 62685, 62715, 62744, 62774, 62803, 62832,
        62862, 62891, 62921, 62950, 62980, 63009, 63039, 63069, 63099, 63128, 63157, 63187, 63216, 63246, 63275, 63305, 63334, 63363, 63393, 63423,
        63453, 63482, 63512, 63541, 63571, 63600, 63630, 63659, 63689, 63718, 63747, 63777, 63807, 63836, 63866, 63895, 63925, 63955, 63984, 64014,
        64043, 64073, 64102, 64131, 64161, 64190, 64220, 64249, 64279, 64309, 64339, 64368, 64398, 64427, 64457, 64486, 64515, 64545, 64574, 64603,
        64633, 64663, 64692, 64722, 64752, 64782, 64811, 64841, 64870, 64899, 64929, 64958, 64987, 65017, 65047, 65076, 65106, 65136, 65166, 65195,
        65225, 65254, 65283, 65313, 65342, 65371, 65401, 65431, 65460, 65490, 65520, 65549, 65579, 65608, 65638, 65667, 65697, 65726, 65755, 65785,
        65815, 65844, 65874, 65903, 65933, 65963, 65992, 66022, 66051, 66081, 66110, 66140, 66169, 66199, 66228, 66258, 66287, 66317, 66346, 66376,
        66405, 66435, 66465, 66494, 66524, 66553, 66583, 66612, 66641, 66671, 66700, 66730, 66760, 66789, 66819, 66849, 66878, 66908, 66937, 66967,
        66996, 67025, 67055, 67084, 67114, 67143, 67173, 67203, 67233, 67262, 67292, 67321, 67351, 67380, 67409, 67439, 67468, 67497, 67527, 67557,
        67587, 67617, 67646, 67676, 67705, 67735, 67764, 67793, 67823, 67852, 67882, 67911, 67941, 67971, 68000, 68030, 68060, 68089, 68119, 68148,
        68177, 68207, 68236, 68266, 68295, 68325, 68354, 68384, 68414, 68443, 68473, 68502, 68532, 68561, 68591, 68620, 68650, 68679, 68708, 68738,
        68768, 68797, 68827, 68857, 68886, 68916, 68946, 68975, 69004, 69034, 69063, 69092, 69122, 69152, 69181, 69211, 69240, 69270, 69300, 69330,
        69359, 69388, 69418, 69447, 69476, 69506, 69535, 69565, 69595, 69624, 69654, 69684, 69713, 69743, 69772, 69802, 69831, 69861, 69890, 69919,
        69949, 69978, 70008, 70038, 70067, 70097, 70126, 70156, 70186, 70215, 70245, 70274, 70303, 70333, 70362, 70392, 70421, 70451, 70481, 70510,
        70540, 70570, 70599, 70629, 70658, 70687, 70717, 70746, 70776, 70805, 70835, 70864, 70894, 70924, 70954, 70983, 71013, 71042, 71071, 71101,
        71130, 71159, 71189, 71218, 71248, 71278, 71308, 71337, 71367, 71397, 71426, 71455, 71485, 71514, 71543, 71573, 71602, 71632, 71662, 71691,
        71721, 71751, 71781, 71810, 71839, 71869, 71898, 71927, 71957, 71986, 72016, 72046, 72075, 72105, 72135, 72164, 72194, 72223, 72253, 72282,
        72311, 72341, 72370, 72400, 72429, 72459, 72489, 72518, 72548, 72577, 72607, 72637, 72666, 72695, 72725, 72754, 72784, 72813, 72843, 72872,
        72902, 72931, 72961, 72991, 73020, 73050, 73080, 73109, 73139, 73168, 73197, 73227, 73256, 73286, 73315, 73345, 73375, 73404, 73434, 73464,
        73493, 73523, 73552, 73581, 73611, 73640, 73669, 73699, 73729, 73758, 73788, 73818, 73848, 73877, 73907, 73936, 73965, 73995, 74024, 74053,
        74083, 74113, 74142, 74172, 74202, 74231, 74261, 74291, 74320, 74349, 74379, 74408, 74437, 74467, 74497, 74526, 74556, 74586, 74615, 74645,
        74675, 74704, 74733, 74763, 74792, 74822, 74851, 74881, 74910, 74940, 74969, 74999, 75029, 75058, 75088, 75117, 75147, 75176, 75206, 75235,
        75264, 75294, 75323, 75353, 75383, 75412, 75442, 75472, 75501, 75531, 75560, 75590, 75619, 75648, 75678, 75707, 75737, 75766, 75796, 75826,
        75856, 75885, 75915, 75944, 75974, 76003, 76032, 76062, 76091, 76121, 76150, 76180, 76210, 76239, 76269, 76299, 76328, 76358, 76387, 76416,
        76446, 76475, 76505, 76534, 76564, 76593, 76623, 76653, 76682, 76712, 76741, 76771, 76801, 76830, 76859, 76889, 76918, 76948, 76977, 77007,
        77036, 77066, 77096, 77125, 77155, 77185, 77214, 77243, 77273, 77302, 77332, 77361, 77390, 77420, 77450, 77479, 77509, 77539, 77569, 77598,
        77627, 77657, 77686, 77715, 77745, 77774, 77804, 77833, 77863, 77893, 77923, 77952, 77982, 78011, 78041, 78070, 78099, 78129, 78158, 78188,
        78217, 78247, 78277, 78307, 78336, 78366, 78395, 78425, 78454, 78483, 78513, 78542, 78572, 78601, 78631, 78661, 78690, 78720, 78750, 78779,
        78808, 78838, 78867, 78897, 78926, 78956, 78985, 79015, 79044, 79074, 79104, 79133, 79163, 79192, 79222, 79251, 79281, 79310, 79340, 79369,
        79399, 79428, 79458, 79487, 79517, 79546, 79576, 79606, 79635, 79665, 79695, 79724, 79753, 79783, 79812, 79841, 79871, 79900, 79930, 79960,
        79990];
    /* tslint:enable */
    function getHijriDate(gDate) {
        let day = gDate.getDate();
        let month = gDate.getMonth();
        let year = gDate.getFullYear();
        let tMonth = month + 1;
        let tYear = year;
        if (tMonth < 3) {
            tYear -= 1;
            tMonth += 12;
        }
        let yPrefix = Math.floor(tYear / 100.);
        let julilanOffset = yPrefix - Math.floor(yPrefix / 4.) - 2;
        let julianNumber = Math.floor(365.25 * (tYear + 4716)) + Math.floor(30.6001 * (tMonth + 1)) + day - julilanOffset - 1524;
        yPrefix = Math.floor((julianNumber - 1867216.25) / 36524.25);
        julilanOffset = yPrefix - Math.floor(yPrefix / 4.) + 1;
        let b = julianNumber + julilanOffset + 1524;
        let c = Math.floor((b - 122.1) / 365.25);
        let d = Math.floor(365.25 * c);
        let tempMonth = Math.floor((b - d) / 30.6001);
        day = (b - d) - Math.floor(30.6001 * tempMonth);
        month = Math.floor((b - d) / 20.6001);
        if (month > 13) {
            c += 1;
            month -= 12;
        }
        month -= 1;
        year = c - 4716;
        let modifiedJulianDate = julianNumber - 2400000;
        // date calculation for year after 2077
        let iyear = 10631. / 30.;
        let z = julianNumber - 1948084;
        let cyc = Math.floor(z / 10631.);
        z = z - 10631 * cyc;
        let j = Math.floor((z - 0.1335) / iyear);
        let iy = 30 * cyc + j;
        z = z - Math.floor(j * iyear + 0.1335);
        let im = Math.floor((z + 28.5001) / 29.5);
        /* istanbul ignore next */
        if (im === 13) {
            im = 12;
        }
        let tempDay = z - Math.floor(29.5001 * im - 29);
        let i = 0;
        for (; i < dateCorrection.length; i++) {
            if (dateCorrection[i] > modifiedJulianDate) {
                break;
            }
        }
        let iln = i + 16260;
        let ii = Math.floor((iln - 1) / 12);
        let hYear = ii + 1;
        let hmonth = iln - 12 * ii;
        let hDate = modifiedJulianDate - dateCorrection[i - 1] + 1;
        if ((hDate + '').length > 2) {
            hDate = tempDay;
            hmonth = im;
            hYear = iy;
        }
        return { year: hYear, month: hmonth, date: hDate };
    }
    HijriParser.getHijriDate = getHijriDate;
    function toGregorian(year, month, day) {
        let iy = year;
        let im = month;
        let id = day;
        let ii = iy - 1;
        let iln = (ii * 12) + 1 + (im - 1);
        let i = iln - 16260;
        let mcjdn = id + dateCorrection[i - 1] - 1;
        let julianDate = mcjdn + 2400000;
        let z = Math.floor(julianDate + 0.5);
        let a = Math.floor((z - 1867216.25) / 36524.25);
        a = z + 1 + a - Math.floor(a / 4);
        let b = a + 1524;
        let c = Math.floor((b - 122.1) / 365.25);
        let d = Math.floor(365.25 * c);
        let e = Math.floor((b - d) / 30.6001);
        let gDay = b - d - Math.floor(e * 30.6001);
        let gMonth = e - (e > 13.5 ? 13 : 1);
        let gYear = c - (gMonth > 2.5 ? 4716 : 4715);
        /* istanbul ignore next */
        if (gYear <= 0) {
            gMonth--;
        } // No year zero
        return new Date(gYear + '/' + (gMonth) + '/' + gDay);
    }
    HijriParser.toGregorian = toGregorian;
})(HijriParser || (HijriParser = {}));

const abbreviateRegexGlobal = /\/MMMMM|MMMM|MMM|a|LLL|EEEEE|EEEE|E|K|cccc|ccc|G+|z+/gi;
const standalone = 'stand-alone';
const weekdayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const timeSetter = {
    m: 'getMinutes',
    h: 'getHours',
    H: 'getHours',
    s: 'getSeconds',
    d: 'getDate',
    f: 'getMilliseconds'
};
const datePartMatcher = {
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
    'G': 'era',
    'f': 'milliseconds'
};
const timeSeparator = 'timeSeparator';
/* tslint:disable no-any */
/**
 * Date Format is a framework provides support for date formatting.
 * @private
 */
class DateFormat {
    /**
     * Returns the formatter function for given skeleton.
     * @param {string} -  Specifies the culture name to be which formatting.
     * @param {DateFormatOptions} - Specific the format in which date  will format.
     * @param {cldr} - Specifies the global cldr data collection.
     * @return Function.
     */
    static dateFormat(culture, option, cldr) {
        let dependable = IntlBase.getDependables(cldr, culture, option.calendar);
        let formatOptions = { isIslamic: IntlBase.islamicRegex.test(option.calendar) };
        if (isBlazor() && option.isServerRendered) {
            option = IntlBase.compareBlazorDateFormats(option, culture);
        }
        let resPattern = option.format || IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type);
        formatOptions.dateSeperator = IntlBase.getDateSeparator(dependable.dateObject);
        if (isUndefined(resPattern)) {
            throwError('Format options or type given must be invalid');
        }
        else {
            formatOptions.pattern = resPattern;
            formatOptions.numMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
            let patternMatch = resPattern.match(abbreviateRegexGlobal) || [];
            for (let str of patternMatch) {
                let len = str.length;
                let char = str[0];
                if (char === 'K') {
                    char = 'h';
                }
                /* tslint:disable no-any */
                switch (char) {
                    case 'E':
                    case 'c':
                        formatOptions.weekday = dependable.dateObject[IntlBase.days][standalone][IntlBase.monthIndex[len]];
                        break;
                    case 'M':
                    case 'L':
                        formatOptions.month = dependable.dateObject[IntlBase.month][standalone][IntlBase.monthIndex[len]];
                        break;
                    case 'a':
                        formatOptions.designator = getValue('dayPeriods.format.wide', dependable.dateObject);
                        break;
                    case 'G':
                        let eText = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                        formatOptions.era = getValue('eras.' + eText, dependable.dateObject);
                        break;
                    case 'z':
                        formatOptions.timeZone = getValue('dates.timeZoneNames', dependable.parserObject);
                        break;
                }
            }
        }
        return (value) => {
            if (isNaN(value.getDate())) {
                return null;
            }
            return this.intDateFormatter(value, formatOptions);
        };
    }
    /**
     * Returns formatted date string based on options passed.
     * @param {Date} value
     * @param {FormatOptions} options
     */
    // tslint:disable-next-line:max-func-body-length
    static intDateFormatter(value, options) {
        let pattern = options.pattern;
        let ret = '';
        let matches = pattern.match(IntlBase.dateParseRegex);
        let dObject = this.getCurrentDateValue(value, options.isIslamic);
        for (let match of matches) {
            let length = match.length;
            let char = match[0];
            if (char === 'K') {
                char = 'h';
            }
            let curval;
            let curvalstr = '';
            let isNumber;
            let processNumber;
            let curstr = '';
            switch (char) {
                case 'M':
                case 'L':
                    curval = dObject.month;
                    if (length > 2) {
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
                case 'f':
                    isNumber = true;
                    if (char === 'd') {
                        curval = dObject.date;
                    }
                    else if (char === 'f') {
                        isNumber = false;
                        processNumber = true;
                        curvalstr = value[timeSetter[char]]().toString();
                        curvalstr = curvalstr.substring(0, length);
                        let curlength = curvalstr.length;
                        if (length !== curlength) {
                            if (length > 3) {
                                continue;
                            }
                            for (let i = 0; i < length - curlength; i++) {
                                curvalstr = '0' + curvalstr.toString();
                            }
                        }
                        curstr += curvalstr;
                    }
                    else {
                        curval = value[timeSetter[char]]();
                    }
                    if (char === 'h') {
                        curval = curval % 12 || 12;
                    }
                    break;
                case 'y':
                    processNumber = true;
                    curstr += dObject.year;
                    if (length === 2) {
                        curstr = curstr.substr(curstr.length - 2);
                    }
                    break;
                case 'a':
                    let desig = value.getHours() < 12 ? 'am' : 'pm';
                    ret += options.designator[desig];
                    break;
                case 'G':
                    let dec = value.getFullYear() < 0 ? 0 : 1;
                    let retu = options.era[dec];
                    if (isNullOrUndefined(retu)) {
                        retu = options.era[dec ? 0 : 1];
                    }
                    ret += retu || '';
                    break;
                case '\'':
                    ret += (match === '\'\'') ? '\'' : match.replace(/\'/g, '');
                    break;
                case 'z':
                    let timezone = value.getTimezoneOffset();
                    let pattern = (length < 4) ? '+H;-H' : options.timeZone.hourFormat;
                    pattern = pattern.replace(/:/g, options.numMapper.timeSeparator);
                    if (timezone === 0) {
                        ret += options.timeZone.gmtZeroFormat;
                    }
                    else {
                        processNumber = true;
                        curstr = this.getTimeZoneValue(timezone, pattern);
                    }
                    curstr = options.timeZone.gmtFormat.replace(/\{0\}/, curstr);
                    break;
                case ':':
                    ret += options.numMapper.numberSymbols[timeSeparator];
                    /* tslint:enable no-any */
                    break;
                case '/':
                    ret += options.dateSeperator;
                    break;
                default:
                    ret += match;
            }
            if (isNumber) {
                processNumber = true;
                curstr = this.checkTwodigitNumber(curval, length);
            }
            if (processNumber) {
                ret += ParserBase.convertValueParts(curstr, IntlBase.latnParseRegex, options.numMapper.mapper);
            }
        }
        return ret;
    }
    static getCurrentDateValue(value, isIslamic) {
        if (isIslamic) {
            return HijriParser.getHijriDate(value);
        }
        return { year: value.getFullYear(), month: value.getMonth() + 1, date: value.getDate() };
    }
    /**
     * Returns two digit numbers for given value and length
     */
    static checkTwodigitNumber(val, len) {
        let ret = val + '';
        if (len === 2 && ret.length !== 2) {
            return '0' + ret;
        }
        return ret;
    }
    /**
     * Returns the value of the Time Zone.
     * @param {number} tVal
     * @param {string} pattern
     * @private
     */
    static getTimeZoneValue(tVal, pattern) {
        let splt = pattern.split(';');
        let curPattern = splt[tVal > 0 ? 1 : 0];
        let no = Math.abs(tVal);
        return curPattern = curPattern.replace(/HH?|mm/g, (str) => {
            let len = str.length;
            let ishour = str.indexOf('H') !== -1;
            return this.checkTwodigitNumber(Math.floor(ishour ? (no / 60) : (no % 60)), len);
        });
    }
}

const errorText = {
    'ms': 'minimumSignificantDigits',
    'ls': 'maximumSignificantDigits',
    'mf': 'minimumFractionDigits',
    'lf': 'maximumFractionDigits',
};
const percentSign = 'percentSign';
const minusSign = 'minusSign';
const mapper$1 = ['infinity', 'nan', 'group', 'decimal', 'exponential'];
/**
 * Module for number formatting.
 * @private
 */
class NumberFormat {
    /**
     * Returns the formatter function for given skeleton.
     * @param {string} culture -  Specifies the culture name to be which formatting.
     * @param {NumberFormatOptions} option - Specific the format in which number  will format.
     * @param {Object} object- Specifies the global cldr data collection.
     * @return Function.
     */
    static numberFormatter(culture, option, cldr) {
        let fOptions = extend({}, option);
        let cOptions = {};
        let dOptions = {};
        let symbolPattern;
        let dependable = IntlBase.getDependables(cldr, culture, '', true);
        dOptions.numberMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true);
        dOptions.currencySymbol = IntlBase.getCurrencySymbol(dependable.numericObject, fOptions.currency || defaultCurrencyCode, option.altSymbol);
        /* tslint:disable no-any */
        dOptions.percentSymbol = dOptions.numberMapper.numberSymbols[percentSign];
        dOptions.minusSymbol = dOptions.numberMapper.numberSymbols[minusSign];
        let symbols = dOptions.numberMapper.numberSymbols;
        if ((option.format) && !(IntlBase.formatRegex.test(option.format))) {
            cOptions = IntlBase.customFormat(option.format, dOptions, dependable.numericObject);
        }
        else {
            extend(fOptions, IntlBase.getProperNumericSkeleton(option.format || 'N'));
            fOptions.isCurrency = fOptions.type === 'currency';
            fOptions.isPercent = fOptions.type === 'percent';
            symbolPattern = IntlBase.getSymbolPattern(fOptions.type, dOptions.numberMapper.numberSystem, dependable.numericObject, fOptions.isAccount);
            fOptions.groupOne = this.checkValueRange(fOptions.maximumSignificantDigits, fOptions.minimumSignificantDigits, true);
            this.checkValueRange(fOptions.maximumFractionDigits, fOptions.minimumFractionDigits, false, true);
            if (!isUndefined(fOptions.fractionDigits)) {
                fOptions.minimumFractionDigits = fOptions.maximumFractionDigits = fOptions.fractionDigits;
            }
            if (isUndefined(fOptions.useGrouping)) {
                fOptions.useGrouping = true;
            }
            if (fOptions.isCurrency) {
                symbolPattern = symbolPattern.replace(/\u00A4/g, IntlBase.defaultCurrency);
            }
            let split = symbolPattern.split(';');
            cOptions.nData = IntlBase.getFormatData(split[1] || '-' + split[0], true, dOptions.currencySymbol);
            cOptions.pData = IntlBase.getFormatData(split[0], false, dOptions.currencySymbol);
            if (fOptions.useGrouping) {
                fOptions.groupSeparator = symbols[mapper$1[2]];
                fOptions.groupData = this.getGroupingDetails(split[0]);
            }
            let minFrac = isUndefined(fOptions.minimumFractionDigits);
            if (minFrac) {
                fOptions.minimumFractionDigits = cOptions.nData.minimumFraction;
            }
            if (isUndefined(fOptions.maximumFractionDigits)) {
                let mval = cOptions.nData.maximumFraction;
                fOptions.maximumFractionDigits = isUndefined(mval) && fOptions.isPercent ? 0 : mval;
            }
            let mfrac = fOptions.minimumFractionDigits;
            let lfrac = fOptions.maximumFractionDigits;
            if (!isUndefined(mfrac) && !isUndefined(lfrac)) {
                if (mfrac > lfrac) {
                    fOptions.maximumFractionDigits = mfrac;
                }
            }
        }
        extend(cOptions.nData, fOptions);
        extend(cOptions.pData, fOptions);
        return (value) => {
            if (isNaN(value)) {
                return symbols[mapper$1[1]];
            }
            else if (!isFinite(value)) {
                return symbols[mapper$1[0]];
            }
            return this.intNumberFormatter(value, cOptions, dOptions);
        };
    }
    /**
     * Returns grouping details for the pattern provided
     * @param {string} pattern
     * @returns {GroupDetails}
     */
    static getGroupingDetails(pattern) {
        let ret = {};
        let match = pattern.match(IntlBase.negativeDataRegex);
        if (match && match[4]) {
            let pattern = match[4];
            let p = pattern.lastIndexOf(',');
            if (p !== -1) {
                let temp = pattern.split('.')[0];
                ret.primary = (temp.length - p) - 1;
                let s = pattern.lastIndexOf(',', p - 1);
                if (s !== -1) {
                    ret.secondary = p - 1 - s;
                }
            }
        }
        return ret;
    }
    /**
     * Returns if the provided integer range is valid.
     * @param {number} val1
     * @param {number} val2
     * @param {boolean} checkbothExist
     * @param {boolean} isFraction
     * @returns {boolean}
     */
    static checkValueRange(val1, val2, checkbothExist, isFraction) {
        let decide = isFraction ? 'f' : 's';
        let dint = 0;
        let str1 = errorText['l' + decide];
        let str2 = errorText['m' + decide];
        if (!isUndefined(val1)) {
            this.checkRange(val1, str1, isFraction);
            dint++;
        }
        if (!isUndefined(val2)) {
            this.checkRange(val2, str2, isFraction);
            dint++;
        }
        if (dint === 2) {
            if (val1 < val2) {
                throwError(str2 + 'specified must be less than the' + str1);
            }
            else {
                return true;
            }
        }
        else if (checkbothExist && dint === 1) {
            throwError('Both' + str2 + 'and' + str2 + 'must be present');
        }
        return false;
    }
    /**
     * Check if the provided fraction range is valid
     * @param {number} val
     * @param {string} text
     * @param {boolean} isFraction
     * @returns {void}
     */
    static checkRange(val, text, isFraction) {
        let range = isFraction ? [0, 20] : [1, 21];
        if (val < range[0] || val > range[1]) {
            throwError(text + 'value must be within the range' + range[0] + 'to' + range[1]);
        }
    }
    /**
     * Returns formatted numeric string for provided formatting options
     * @param {number} value
     * @param {base.GenericFormatOptions} fOptions
     * @param {CommonOptions} dOptions
     * @returns {string}
     */
    static intNumberFormatter(value, fOptions, dOptions) {
        let curData;
        if (isUndefined(fOptions.nData.type)) {
            return undefined;
        }
        else {
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
            let fValue = '';
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
            if (curData.type === 'scientific') {
                fValue = value.toExponential(curData.maximumFractionDigits);
                fValue = fValue.replace('e', dOptions.numberMapper.numberSymbols[mapper$1[4]]);
            }
            fValue = fValue.replace('.', dOptions.numberMapper.numberSymbols[mapper$1[3]]);
            if (curData.useGrouping) {
                fValue = this.groupNumbers(fValue, curData.groupData.primary, curData.groupSeparator || ',', dOptions.numberMapper.numberSymbols[mapper$1[3]] || '.', curData.groupData.secondary);
            }
            fValue = ParserBase.convertValueParts(fValue, IntlBase.latnParseRegex, dOptions.numberMapper.mapper);
            if (curData.nlead === 'N/A') {
                return curData.nlead;
            }
            else {
                return curData.nlead + fValue + curData.nend;
            }
        }
    }
    /**
     * Returns significant digits processed numeric string
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {string}
     */
    static processSignificantDigits(value, min, max) {
        let temp = value + '';
        let tn;
        let length = temp.length;
        if (length < min) {
            return value.toPrecision(min);
        }
        else {
            temp = value.toPrecision(max);
            tn = +temp;
            return tn + '';
        }
    }
    /**
     * Returns grouped numeric string
     * @param {string} val
     * @param {number} level1
     * @param {string} sep
     * @param {string} decimalSymbol
     * @param {number} level2
     * @returns {string}
     */
    static groupNumbers(val, level1, sep, decimalSymbol, level2) {
        let flag = !isNullOrUndefined(level2) && level2 !== 0;
        let split = val.split(decimalSymbol);
        let prefix = split[0];
        let length = prefix.length;
        let str = '';
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
    }
    /**
     * Returns fraction processed numeric string
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {string}
     */
    static processFraction(value, min, max) {
        let temp = (value + '').split('.')[1];
        let length = temp ? temp.length : 0;
        if (min && length < min) {
            let ret = '';
            if (length === 0) {
                ret = value.toFixed(min);
            }
            else {
                ret += value;
                for (let j = 0; j < min - length; j++) {
                    ret += '0';
                }
                return ret;
            }
            return value.toFixed(min);
        }
        else if (!isNullOrUndefined(max) && (length > max || max === 0)) {
            return value.toFixed(max);
        }
        return value + '';
    }
    /**
     * Returns integer processed numeric string
     * @param {string} value
     * @param {number} min
     * @returns {string}
     */
    static processMinimumIntegers(value, min) {
        let temp = value.split('.');
        let lead = temp[0];
        let len = lead.length;
        if (len < min) {
            for (let i = 0; i < min - len; i++) {
                lead = '0' + lead;
            }
            temp[0] = lead;
        }
        return temp.join('.');
    }
}

const standalone$1 = 'stand-alone';
const latnRegex$1 = /^[0-9]*$/;
const timeSetter$1 = {
    minute: 'setMinutes',
    hour: 'setHours',
    second: 'setSeconds',
    day: 'setDate',
    month: 'setMonth',
    milliseconds: 'setMilliseconds'
};
const month = 'months';
/* tslint:disable no-any */
/**
 * Date Parser.
 * @private
 */
class DateParser {
    /**
     * Returns the parser function for given skeleton.
     * @param {string} -  Specifies the culture name to be which formatting.
     * @param {DateFormatOptions} - Specific the format in which string date  will be parsed.
     * @param {cldr} - Specifies the global cldr data collection.
     *  @return Function.
     */
    // tslint:disable-next-line:max-func-body-length
    static dateParser(culture, option, cldr) {
        let dependable = IntlBase.getDependables(cldr, culture, option.calendar);
        let numOptions = ParserBase.getCurrentNumericOptions(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
        let parseOptions = {};
        if (isBlazor() && option.isServerRendered) {
            option = IntlBase.compareBlazorDateFormats(option, culture);
        }
        let resPattern = option.format || IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type);
        let regexString = '';
        let hourOnly;
        if (isUndefined(resPattern)) {
            throwError('Format options or type given must be invalid');
        }
        else {
            parseOptions = { isIslamic: IntlBase.islamicRegex.test(option.calendar), pattern: resPattern, evalposition: {} };
            let patternMatch = resPattern.match(IntlBase.dateParseRegex) || [];
            let length = patternMatch.length;
            let gmtCorrection = 0;
            let zCorrectTemp = 0;
            let isgmtTraversed = false;
            let nRegx = numOptions.numericRegex;
            let numMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
            for (let i = 0; i < length; i++) {
                let str = patternMatch[i];
                let len = str.length;
                let char = (str[0] === 'K') ? 'h' : str[0];
                let isNumber;
                let canUpdate;
                let charKey = datePartMatcher[char];
                let optional = (len === 2) ? '' : '?';
                if (isgmtTraversed) {
                    gmtCorrection = zCorrectTemp;
                    isgmtTraversed = false;
                }
                switch (char) {
                    case 'E':
                    case 'c':
                        // tslint:disable-next-line
                        let weekObject = ParserBase.reverseObject(dependable.dateObject[IntlBase.days][standalone$1][IntlBase.monthIndex[len]]);
                        regexString += '(' + Object.keys(weekObject).join('|') + ')';
                        break;
                    case 'M':
                    case 'L':
                    case 'd':
                    case 'm':
                    case 's':
                    case 'h':
                    case 'H':
                    case 'f':
                        canUpdate = true;
                        if ((char === 'M' || char === 'L') && len > 2) {
                            // tslint:disable-next-line
                            parseOptions[charKey] = ParserBase.reverseObject(dependable.dateObject[month][standalone$1][IntlBase.monthIndex[len]]);
                            /* tslint:disable no-any */
                            regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + ')';
                        }
                        else if (char === 'f') {
                            if (len > 3) {
                                continue;
                            }
                            isNumber = true;
                            regexString += '(' + nRegx + nRegx + '?' + nRegx + '?' + ')';
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
                            regexString += '(' + nRegx + '{' + len + ',})';
                        }
                        break;
                    case 'a':
                        canUpdate = true;
                        parseOptions[charKey] = ParserBase.reverseObject(getValue('dayPeriods.format.wide', dependable.dateObject));
                        regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + ')';
                        break;
                    case 'G':
                        canUpdate = true;
                        let eText = (len <= 3) ? 'eraAbbr' : (len === 4) ? 'eraNames' : 'eraNarrow';
                        parseOptions[charKey] = ParserBase.reverseObject(getValue('eras.' + eText, dependable.dateObject));
                        regexString += '(' + Object.keys(parseOptions[charKey]).join('|') + '?)';
                        break;
                    case 'z':
                        let tval = new Date().getTimezoneOffset();
                        canUpdate = (tval !== 0);
                        parseOptions[charKey] = getValue('dates.timeZoneNames', dependable.parserObject);
                        let tzone = parseOptions[charKey];
                        hourOnly = (len < 4);
                        let hpattern = hourOnly ? '+H;-H' : tzone.hourFormat;
                        hpattern = hpattern.replace(/:/g, numMapper.timeSeparator);
                        regexString += '(' + this.parseTimeZoneRegx(hpattern, tzone, nRegx) + ')?';
                        isgmtTraversed = true;
                        zCorrectTemp = hourOnly ? 6 : 12;
                        break;
                    case '\'':
                        let iString = str.replace(/\'/g, '');
                        regexString += '(' + iString + ')?';
                        break;
                    default:
                        regexString += '([\\D])';
                        break;
                }
                if (canUpdate) {
                    parseOptions.evalposition[charKey] = { isNumber: isNumber, pos: i + 1 + gmtCorrection, hourOnly: hourOnly };
                }
                if (i === length - 1 && !isNullOrUndefined(regexString)) {
                    parseOptions.parserRegex = new RegExp('^' + regexString + '$', 'i');
                }
            }
        }
        return (value) => {
            let parsedDateParts = this.internalDateParse(value, parseOptions, numOptions);
            if (isNullOrUndefined(parsedDateParts) || !Object.keys(parsedDateParts).length) {
                return null;
            }
            if (parseOptions.isIslamic) {
                let dobj = {};
                let tYear = parsedDateParts.year;
                let tDate = parsedDateParts.day;
                let tMonth = parsedDateParts.month;
                let ystrig = tYear ? (tYear + '') : '';
                let is2DigitYear = (ystrig.length === 2);
                if (!tYear || !tMonth || !tDate || is2DigitYear) {
                    dobj = HijriParser.getHijriDate(new Date());
                }
                if (is2DigitYear) {
                    tYear = parseInt((dobj.year + '').slice(0, 2) + ystrig, 10);
                }
                // tslint:disable-next-line
                let dateObject = HijriParser.toGregorian(tYear || dobj.year, tMonth || dobj.month, tDate || dobj.date);
                parsedDateParts.year = dateObject.getFullYear();
                parsedDateParts.month = dateObject.getMonth() + 1;
                parsedDateParts.day = dateObject.getDate();
            }
            return this.getDateObject(parsedDateParts);
        };
    }
    /* tslint:disable */
    /**
     * Returns date object for provided date options
     * @param {DateParts} options
     * @param {Date} value
     * @returns {Date}
     */
    static getDateObject(options, value) {
        let res = value || new Date();
        res.setMilliseconds(0);
        let tKeys = ['hour', 'minute', 'second', 'milliseconds', 'month', 'day'];
        let y = options.year;
        let desig = options.designator;
        let tzone = options.timeZone;
        if (!isUndefined(y)) {
            let len = (y + '').length;
            if (len <= 2) {
                let century = Math.floor(res.getFullYear() / 100) * 100;
                y += century;
            }
            res.setFullYear(y);
        }
        for (let key of tKeys) {
            let tValue = options[key];
            if (isUndefined(tValue) && key === "day") {
                res.setDate(1);
            }
            if (!isUndefined(tValue)) {
                if (key === 'month') {
                    tValue -= 1;
                    if (tValue < 0 || tValue > 11) {
                        return new Date('invalid');
                    }
                    let pDate = res.getDate();
                    res.setDate(1);
                    res[timeSetter$1[key]](tValue);
                    let lDate = new Date(res.getFullYear(), tValue + 1, 0).getDate();
                    res.setDate(pDate < lDate ? pDate : lDate);
                }
                else {
                    if (key === 'day') {
                        let lastDay = new Date(res.getFullYear(), res.getMonth() + 1, 0).getDate();
                        if ((tValue < 1 || tValue > lastDay)) {
                            return null;
                        }
                    }
                    res[timeSetter$1[key]](tValue);
                }
            }
        }
        if (!isUndefined(desig)) {
            let hour = res.getHours();
            if (desig === 'pm') {
                res.setHours(hour + (hour === 12 ? 0 : 12));
            }
            else if (hour === 12) {
                res.setHours(0);
            }
        }
        if (!isUndefined(tzone)) {
            let tzValue = tzone - res.getTimezoneOffset();
            if (tzValue !== 0) {
                res.setMinutes(res.getMinutes() + tzValue);
            }
        }
        return res;
    }
    /**
     * Returns date parsing options for provided value along with parse and numeric options
     * @param {string} value
     * @param {ParseOptions} parseOptions
     * @param {NumericOptions} num
     * @returns {DateParts}
     */
    static internalDateParse(value, parseOptions, num) {
        let matches = value.match(parseOptions.parserRegex);
        let retOptions = { 'hour': 0, 'minute': 0, 'second': 0 };
        let nRegx = num.numericRegex;
        if (isNullOrUndefined(matches)) {
            return null;
        }
        else {
            let props = Object.keys(parseOptions.evalposition);
            for (let prop of props) {
                let curObject = parseOptions.evalposition[prop];
                let matchString = matches[curObject.pos];
                if (curObject.isNumber) {
                    retOptions[prop] = this.internalNumberParser(matchString, num);
                }
                else {
                    if (prop === 'timeZone' && !isUndefined(matchString)) {
                        let pos = curObject.pos;
                        let val;
                        let tmatch = matches[pos + 1];
                        let flag = !isUndefined(tmatch);
                        if (curObject.hourOnly) {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 4], num) * 60;
                        }
                        else {
                            val = this.getZoneValue(flag, tmatch, matches[pos + 7], num) * 60;
                            val += this.getZoneValue(flag, matches[pos + 4], matches[pos + 10], num);
                        }
                        if (!isNullOrUndefined(val)) {
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
    }
    /**
     * Returns parsed number for provided Numeric string and Numeric Options
     * @param {string} value
     * @param {NumericOptions} option
     * @returns {number}
     */
    static internalNumberParser(value, option) {
        value = ParserBase.convertValueParts(value, option.numberParseRegex, option.numericPair);
        if (latnRegex$1.test(value)) {
            return +value;
        }
        return null;
    }
    /**
     * Returns parsed time zone RegExp for provided hour format and time zone
     * @param {string} hourFormat
     * @param {base.TimeZoneOptions} tZone
     * @param {string} nRegex
     * @returns {string}
     */
    static parseTimeZoneRegx(hourFormat, tZone, nRegex) {
        let pattern = tZone.gmtFormat;
        let ret;
        let cRegex = '(' + nRegex + ')' + '(' + nRegex + ')';
        let splitStr;
        ret = hourFormat.replace('+', '\\+');
        if (hourFormat.indexOf('HH') !== -1) {
            ret = ret.replace(/HH|mm/g, '(' + cRegex + ')');
        }
        else {
            ret = ret.replace(/H|m/g, '(' + cRegex + '?)');
        }
        splitStr = (ret.split(';').map((str) => {
            return pattern.replace('{0}', str);
        }));
        ret = splitStr.join('|') + '|' + tZone.gmtZeroFormat;
        return ret;
    }
    /**
     * Returns zone based value.
     * @param {boolean} flag
     * @param {string} val1
     * @param {string} val2
     * @param {NumericOptions} num
     * @returns {number}
     */
    static getZoneValue(flag, val1, val2, num) {
        let ival = flag ? val1 : val2;
        if (!ival) {
            return 0;
        }
        let value = this.internalNumberParser(ival, num);
        if (flag) {
            return -value;
        }
        return value;
    }
}
/* tslint:enable */

const parseRegex = /^([^0-9]*)(([0-9,]*[0-9]+)(\.[0-9]+)?)([Ee][+-]?[0-9]+)?([^0-9]*)$/;
const groupRegex = /,/g;
const keys = ['minusSign', 'infinity'];
/**
 * Module for Number Parser.
 * @private
 */
class NumberParser {
    /**
     * Returns the parser function for given skeleton.
     * @param {string} -  Specifies the culture name to be which formatting.
     * @param {NumberFormatOptions} - Specific the format in which number  will parsed.
     * @param {cldr} - Specifies the global cldr data collection.
     * @return Function.
     */
    static numberParser(culture, option, cldr) {
        let dependable = IntlBase.getDependables(cldr, culture, '', true);
        let parseOptions = { custom: true };
        let numOptions;
        if ((IntlBase.formatRegex.test(option.format)) || !(option.format)) {
            extend(parseOptions, IntlBase.getProperNumericSkeleton(option.format || 'N'));
            parseOptions.custom = false;
        }
        else {
            extend(parseOptions, IntlBase.customFormat(option.format, null, null));
        }
        numOptions = ParserBase.getCurrentNumericOptions(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true);
        parseOptions.symbolRegex = ParserBase.getSymbolRegex(Object.keys(numOptions.symbolMatch));
        // tslint:disable-next-line:no-any
        parseOptions.infinity = numOptions.symbolNumberSystem[keys[1]];
        let symbolpattern = IntlBase.getSymbolPattern(parseOptions.type, numOptions.numberSystem, dependable.numericObject, parseOptions.isAccount);
        if (symbolpattern) {
            symbolpattern = symbolpattern.replace(/\u00A4/g, IntlBase.defaultCurrency);
            let split = symbolpattern.split(';');
            parseOptions.nData = IntlBase.getFormatData(split[1] || '-' + split[0], true, '');
            parseOptions.pData = IntlBase.getFormatData(split[0], true, '');
        }
        return (value) => {
            return this.getParsedNumber(value, parseOptions, numOptions);
        };
    }
    /**
     * Returns parsed number for the provided formatting options
     * @param {string} value
     * @param {NumericParts} options
     * @param {NumericOptions} numOptions
     * @returns {number}
     */
    static getParsedNumber(value, options, numOptions) {
        let isNegative;
        let isPercent;
        let tempValue;
        let lead;
        let end;
        let ret;
        if (value.indexOf(options.infinity) !== -1) {
            return Infinity;
        }
        else {
            value = ParserBase.convertValueParts(value, options.symbolRegex, numOptions.symbolMatch);
            value = ParserBase.convertValueParts(value, numOptions.numberParseRegex, numOptions.numericPair);
            if (value.indexOf('.') === 0) {
                value = '0' + value;
            }
            let matches = value.match(parseRegex);
            if (isNullOrUndefined(matches)) {
                return NaN;
            }
            lead = matches[1];
            tempValue = matches[2];
            let exponent = matches[5];
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
    }
}

class Observer {
    constructor(context) {
        this.ranArray = [];
        this.boundedEvents = {};
        if (isNullOrUndefined(context)) {
            return;
        }
        this.context = context;
    }
    ;
    /**
     * To attach handler for given property in current context.
     * @param {string} property - specifies the name of the event.
     * @param {Function} handler - Specifies the handler function to be called while event notified.
     * @param {Object} context - Specifies the context binded to the handler.
     * @param {string} id - specifies the random generated id.
     * @return {void}
     */
    on(property, handler, context, id) {
        if (isNullOrUndefined(handler)) {
            return;
        }
        let cntxt = context || this.context;
        if (this.notExist(property)) {
            this.boundedEvents[property] = [{ handler: handler, context: cntxt }];
            return;
        }
        if (!isNullOrUndefined(id)) {
            if (this.ranArray.indexOf(id) === -1) {
                this.ranArray.push(id);
                this.boundedEvents[property].push({ handler: handler, context: cntxt, id: id });
            }
        }
        else if (!this.isHandlerPresent(this.boundedEvents[property], handler)) {
            this.boundedEvents[property].push({ handler: handler, context: cntxt });
        }
    }
    /**
     * To remove handlers from a event attached using on() function.
     * @param {string} eventName - specifies the name of the event.
     * @param {Function} handler - Optional argument specifies the handler function to be called while event notified.
     * @param {string} id - specifies the random generated id.
     * @return {void}
     */
    off(property, handler, id) {
        if (this.notExist(property)) {
            return;
        }
        let curObject = getValue(property, this.boundedEvents);
        if (handler) {
            for (let i = 0; i < curObject.length; i++) {
                if (id) {
                    if (curObject[i].id === id) {
                        curObject.splice(i, 1);
                        let indexLocation = this.ranArray.indexOf(id);
                        if (indexLocation !== -1) {
                            this.ranArray.splice(indexLocation, 1);
                        }
                        break;
                    }
                }
                else if (handler === curObject[i].handler) {
                    curObject.splice(i, 1);
                    break;
                }
            }
        }
        else {
            delete this.boundedEvents[property];
        }
    }
    /**
     * To notify the handlers in the specified event.
     * @param {string} property - Specifies the event to be notify.
     * @param {Object} args - Additional parameters to pass while calling the handler.
     * @param {Function} successHandler - this function will invoke after event successfully triggered
     * @param {Function} errorHandler - this function will invoke after event if it was failure to call.
     * @return {void}
     */
    notify(property, argument, successHandler, errorHandler) {
        if (this.notExist(property)) {
            if (successHandler) {
                successHandler.call(this, argument);
            }
            return;
        }
        if (argument) {
            argument.name = property;
        }
        let blazor = 'Blazor';
        let curObject = getValue(property, this.boundedEvents).slice(0);
        if (window[blazor]) {
            return this.blazorCallback(curObject, argument, successHandler, errorHandler, 0);
        }
        else {
            for (let cur of curObject) {
                cur.handler.call(cur.context, argument);
            }
            if (successHandler) {
                successHandler.call(this, argument);
            }
        }
    }
    blazorCallback(objs, argument, successHandler, errorHandler, index) {
        let isTrigger = index === objs.length - 1;
        if (index < objs.length) {
            let obj = objs[index];
            let promise = obj.handler.call(obj.context, argument);
            if (promise && typeof promise.then === 'function') {
                if (!successHandler) {
                    return promise;
                }
                promise.then((data) => {
                    data = typeof data === 'string' && this.isJson(data) ? JSON.parse(data) : data;
                    extend(argument, argument, data, true);
                    if (successHandler && isTrigger) {
                        successHandler.call(obj.context, argument);
                    }
                    else {
                        return this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
                    }
                }).catch((data) => {
                    if (errorHandler) {
                        errorHandler.call(obj.context, typeof data === 'string' && this.isJson(data) ? JSON.parse(data) : data);
                    }
                });
            }
            else if (successHandler && isTrigger) {
                successHandler.call(obj.context, argument);
            }
            else {
                return this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
            }
        }
    }
    isJson(value) {
        try {
            JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    /**
     * To destroy handlers in the event
     */
    destroy() {
        this.boundedEvents = this.context = undefined;
    }
    /**
     * Returns if the property exists.
     */
    notExist(prop) {
        return this.boundedEvents.hasOwnProperty(prop) === false || this.boundedEvents[prop].length <= 0;
    }
    /**
     * Returns if the handler is present.
     */
    isHandlerPresent(boundedEvents, handler) {
        for (let cur of boundedEvents) {
            if (cur.handler === handler) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Specifies the observer used for external change detection.
 */
let onIntlChange = new Observer();
/**
 * Specifies the default rtl status for EJ2 components.
 */
let rightToLeft = false;
/**
 * Specifies the CLDR data loaded for internationalization functionalities.
 * @private
 */
let cldrData = {};
/**
 * Specifies the default culture value to be considered.
 * @private
 */
let defaultCulture = 'en-US';
/**
 * Specifies default currency code to be considered
 * @private
 */
let defaultCurrencyCode = 'USD';
const mapper = ['numericObject', 'dateObject'];
/**
 * Internationalization class provides support to parse and format the number and date object to the desired format.
 * ```typescript
 * // To set the culture globally
 * setCulture('en-GB');
 *
 * // To set currency code globally
 * setCurrencyCode('EUR');
 *
 * //Load cldr data
 * loadCldr(gregorainData);
 * loadCldr(timeZoneData);
 * loadCldr(numbersData);
 * loadCldr(numberSystemData);
 *
 * // To use formatter in component side
 * let Intl:Internationalization = new Internationalization();
 *
 * // Date formatting
 * let dateFormatter: Function = Intl.getDateFormat({skeleton:'long',type:'dateTime'});
 * dateFormatter(new Date('11/2/2016'));
 * dateFormatter(new Date('25/2/2030'));
 * Intl.formatDate(new Date(),{skeleton:'E'});
 *
 * //Number formatting
 * let numberFormatter: Function = Intl.getNumberFormat({skeleton:'C5'})
 * numberFormatter(24563334);
 * Intl.formatNumber(123123,{skeleton:'p2'});
 *
 * // Date parser
 * let dateParser: Function = Intl.getDateParser({skeleton:'short',type:'time'});
 * dateParser('10:30 PM');
 * Intl.parseDate('10',{skeleton:'H'});
 * ```
 */
class Internationalization {
    constructor(cultureName) {
        if (cultureName) {
            this.culture = cultureName;
        }
    }
    /**
     * Returns the format function for given options.
     * @param {DateFormatOptions} options - Specifies the format options in which the format function will return.
     * @returns {Function}
     */
    getDateFormat(options) {
        return DateFormat.dateFormat(this.getCulture(), options || { type: 'date', skeleton: 'short' }, cldrData);
    }
    /**
     * Returns the format function for given options.
     * @param {NumberFormatOptions} options - Specifies the format options in which the format function will return.
     * @returns {Function}
     */
    getNumberFormat(options) {
        if (options && !options.currency) {
            options.currency = defaultCurrencyCode;
        }
        return NumberFormat.numberFormatter(this.getCulture(), options || {}, cldrData);
    }
    /**
     * Returns the parser function for given options.
     * @param {DateFormatOptions} options - Specifies the format options in which the parser function will return.
     * @returns {Function}
     */
    getDateParser(options) {
        return DateParser.dateParser(this.getCulture(), options || { skeleton: 'short', type: 'date' }, cldrData);
    }
    /**
     * Returns the parser function for given options.
     * @param {NumberFormatOptions} options - Specifies the format options in which the parser function will return.
     * @returns {Function}
     */
    getNumberParser(options) {
        return NumberParser.numberParser(this.getCulture(), options || { format: 'N' }, cldrData);
    }
    /**
     * Returns the formatted string based on format options.
     * @param {Number} value - Specifies the number to format.
     * @param {NumberFormatOptions} option - Specifies the format options in which the number will be formatted.
     * @returns {string}
     */
    formatNumber(value, option) {
        return this.getNumberFormat(option)(value);
    }
    /**
     * Returns the formatted date string based on format options.
     * @param {Number} value - Specifies the number to format.
     * @param {DateFormatOptions} option - Specifies the format options in which the number will be formatted.
     * @returns {string}
     */
    formatDate(value, option) {
        return this.getDateFormat(option)(value);
    }
    /**
     * Returns the date object for given date string and options.
     * @param {string} value - Specifies the string to parse.
     * @param {DateFormatOptions} option - Specifies the parse options in which the date string will be parsed.
     * @returns {Date}
     */
    parseDate(value, option) {
        return this.getDateParser(option)(value);
    }
    /**
     * Returns the number object from the given string value and options.
     * @param {string} value - Specifies the string to parse.
     * @param {NumberFormatOptions} option - Specifies the parse options in which the  string number  will be parsed.
     * @returns {number}
     */
    parseNumber(value, option) {
        return this.getNumberParser(option)(value);
    }
    /**
     * Returns Native Date Time Pattern
     * @param {DateFormatOptions} option - Specifies the parse options for resultant date time pattern.
     * @param {boolean} isExcelFormat - Specifies format value to be converted to excel pattern.
     * @returns {string}
     * @private
     */
    getDatePattern(option, isExcelFormat) {
        return IntlBase.getActualDateTimeFormat(this.getCulture(), option, cldrData, isExcelFormat);
    }
    /**
     * Returns Native Number Pattern
     * @param {NumberFormatOptions} option - Specifies the parse options for resultant number pattern.
     * @returns {string}
     * @private
     */
    getNumberPattern(option) {
        return IntlBase.getActualNumberFormat(this.getCulture(), option, cldrData);
    }
    /**
     * Returns the First Day of the Week
     * @returns {number}
     */
    getFirstDayOfWeek() {
        return IntlBase.getWeekData(this.getCulture(), cldrData);
    }
    getCulture() {
        return this.culture || defaultCulture;
    }
}
/**
 * Set the default culture to all EJ2 components
 * @param {string} cultureName - Specifies the culture name to be set as default culture.
 */
function setCulture(cultureName) {
    defaultCulture = cultureName;
    onIntlChange.notify('notifyExternalChange', { 'locale': defaultCulture });
}
/**
 * Set the default currency code to all EJ2 components
 * @param {string} currencyCode Specifies the culture name to be set as default culture.
 * @returns {void}
 */
function setCurrencyCode(currencyCode) {
    defaultCurrencyCode = currencyCode;
    onIntlChange.notify('notifyExternalChange', { 'currencyCode': defaultCurrencyCode });
}
/**
 * Load the CLDR data into context
 * @param {Object[]} obj Specifies the CLDR data's to be used for formatting and parser.
 * @returns {void}
 */
function loadCldr(...data) {
    for (let obj of data) {
        extend(cldrData, obj, {}, true);
    }
}
/**
 * To enable or disable RTL functionality for all components globally.
 * @param {boolean} status - Optional argument Specifies the status value to enable or disable rtl option.
 * @returns {void}
 */
function enableRtl(status = true) {
    rightToLeft = status;
    onIntlChange.notify('notifyExternalChange', { enableRtl: rightToLeft });
}
/**
 * To get the numeric CLDR object for given culture
 * @param {string} locale - Specifies the locale for which numericObject to be returned.
 * @ignore
 * @private
 */
function getNumericObject(locale, type) {
    /* tslint:disable no-any */
    let numObject = IntlBase.getDependables(cldrData, locale, '', true)[mapper[0]];
    let dateObject = IntlBase.getDependables(cldrData, locale, '')[mapper[1]];
    let numSystem = getValue('defaultNumberingSystem', numObject);
    let symbPattern = getValue('symbols-numberSystem-' + numSystem, numObject);
    let pattern = IntlBase.getSymbolPattern(type || 'decimal', numSystem, numObject, false);
    return extend(symbPattern, IntlBase.getFormatData(pattern, true, '', true), { 'dateSeparator': IntlBase.getDateSeparator(dateObject) });
}
/**
 * To get the numeric CLDR  number base object for given culture
 * @param {string} locale - Specifies the locale for which numericObject to be returned.
 * @param {string} currency - Specifies the currency for which numericObject to be returned.
 * @ignore
 * @private
 */
function getNumberDependable(locale, currency) {
    let numObject = IntlBase.getDependables(cldrData, locale, '', true);
    return IntlBase.getCurrencySymbol(numObject.numericObject, currency);
}
/**
 * To get the default date CLDR object.
 * @ignore
 * @private
 */
function getDefaultDateObject(mode) {
    return IntlBase.getDependables(cldrData, '', mode, false)[mapper[1]];
}

const blazorCultureFormats = {
    'en-US': {
        'd': 'M/d/y',
        'D': 'EEEE, MMMM d, y',
        'f': 'EEEE, MMMM d, y h:mm a',
        'F': 'EEEE, MMMM d, y h:mm:s a',
        'g': 'M/d/y h:mm a',
        't': 'h:mm a',
        'T': 'h:m:s a'
    }
};
/**
 * Date base common constants and function for date parser and formatter.
 */
var IntlBase;
(function (IntlBase) {
    // tslint:disable-next-line:max-line-length
    IntlBase.negativeDataRegex = /^(('[^']+'|''|[^*#@0,.E])*)(\*.)?((([#,]*[0,]*0+)(\.0*[0-9]*#*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    IntlBase.customRegex = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    IntlBase.latnParseRegex = /0|1|2|3|4|5|6|7|8|9/g;
    const fractionRegex = /[0-9]/g;
    IntlBase.defaultCurrency = '$';
    const mapper = ['infinity', 'nan', 'group', 'decimal'];
    const patternRegex = /G|M|L|H|c|'| a|yy|y|EEEE|E/g;
    const patternMatch = {
        'G': '',
        'M': 'm',
        'L': 'm',
        'H': 'h',
        'c': 'd',
        '\'': '"',
        ' a': ' AM/PM',
        'yy': 'yy',
        'y': 'yyyy',
        'EEEE': 'dddd',
        'E': 'ddd'
    };
    const defaultFirstDay = 'sun';
    IntlBase.islamicRegex = /^islamic/;
    const firstDayMapper = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    IntlBase.formatRegex = /(^[ncpae]{1})([0-1]?[0-9]|20)?$/i;
    IntlBase.currencyFormatRegex = /(^[ca]{1})([0-1]?[0-9]|20)?$/i;
    IntlBase.curWithoutNumberRegex = /(c|a)$/ig;
    const typeMapper = {
        '$': 'isCurrency',
        '%': 'isPercent',
        '-': 'isNegative',
        0: 'nlead',
        1: 'nend'
    };
    IntlBase.dateParseRegex = /([a-z])\1*|'([^']|'')+'|''|./gi;
    IntlBase.basicPatterns = ['short', 'medium', 'long', 'full'];
    /* tslint:disable:quotemark */
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
                },
                "islamic": {
                    "months": {
                        "stand-alone": {
                            "abbreviated": {
                                "1": "Muh.",
                                "2": "Saf.",
                                "3": "Rab. I",
                                "4": "Rab. II",
                                "5": "Jum. I",
                                "6": "Jum. II",
                                "7": "Raj.",
                                "8": "Sha.",
                                "9": "Ram.",
                                "10": "Shaw.",
                                "11": "Dhuʻl-Q.",
                                "12": "Dhuʻl-H."
                            },
                            "narrow": {
                                "1": "1",
                                "2": "2",
                                "3": "3",
                                "4": "4",
                                "5": "5",
                                "6": "6",
                                "7": "7",
                                "8": "8",
                                "9": "9",
                                "10": "10",
                                "11": "11",
                                "12": "12"
                            },
                            "wide": {
                                "1": "Muharram",
                                "2": "Safar",
                                "3": "Rabiʻ I",
                                "4": "Rabiʻ II",
                                "5": "Jumada I",
                                "6": "Jumada II",
                                "7": "Rajab",
                                "8": "Shaʻban",
                                "9": "Ramadan",
                                "10": "Shawwal",
                                "11": "Dhuʻl-Qiʻdah",
                                "12": "Dhuʻl-Hijjah"
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
                    "eras": {
                        "eraNames": {
                            "0": "AH"
                        },
                        "eraAbbr": {
                            "0": "AH"
                        },
                        "eraNarrow": {
                            "0": "AH"
                        }
                    },
                    "dateFormats": {
                        "full": "EEEE, MMMM d, y G",
                        "long": "MMMM d, y G",
                        "medium": "MMM d, y G",
                        "short": "M/d/y GGGGG"
                    },
                    "timeFormats": {
                        "full": "h:mm:ss a zzzz",
                        "long": "h:mm:ss a z",
                        "medium": "h:mm:ss a",
                        "short": "h:mm a"
                    },
                    "dateTimeFormats": {
                        "full": "{1} 'at' {0}",
                        "long": "{1} 'at' {0}",
                        "medium": "{1}, {0}",
                        "short": "{1}, {0}",
                        "availableFormats": {
                            "d": "d",
                            "E": "ccc",
                            "Ed": "d E",
                            "Ehm": "E h:mm a",
                            "EHm": "E HH:mm",
                            "Ehms": "E h:mm:ss a",
                            "EHms": "E HH:mm:ss",
                            "Gy": "y G",
                            "GyMMM": "MMM y G",
                            "GyMMMd": "MMM d, y G",
                            "GyMMMEd": "E, MMM d, y G",
                            "h": "h a",
                            "H": "HH",
                            "hm": "h:mm a",
                            "Hm": "HH:mm",
                            "hms": "h:mm:ss a",
                            "Hms": "HH:mm:ss",
                            "M": "L",
                            "Md": "M/d",
                            "MEd": "E, M/d",
                            "MMM": "LLL",
                            "MMMd": "MMM d",
                            "MMMEd": "E, MMM d",
                            "MMMMd": "MMMM d",
                            "ms": "mm:ss",
                            "y": "y G",
                            "yyyy": "y G",
                            "yyyyM": "M/y GGGGG",
                            "yyyyMd": "M/d/y GGGGG",
                            "yyyyMEd": "E, M/d/y GGGGG",
                            "yyyyMMM": "MMM y G",
                            "yyyyMMMd": "MMM d, y G",
                            "yyyyMMMEd": "E, MMM d, y G",
                            "yyyyMMMM": "MMMM y G",
                            "yyyyQQQ": "QQQ y G",
                            "yyyyQQQQ": "QQQQ y G"
                        }
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
            },
            'scientificFormats-numberSystem-latn': {
                'standard': '#E0'
            }
        }
    };
    /* tslint:enable:quotemark */
    IntlBase.monthIndex = {
        3: 'abbreviated',
        4: 'wide',
        5: 'narrow',
        1: 'abbreviated'
    };
    /**
     *
     */
    IntlBase.month = 'months';
    IntlBase.days = 'days';
    /**
     * Default numerber Object
     */
    IntlBase.patternMatcher = {
        C: 'currency',
        P: 'percent',
        N: 'decimal',
        A: 'currency',
        E: 'scientific'
    };
    /**
     * Returns the resultant pattern based on the skeleton, dateObject and the type provided
     * @private
     * @param {string} skeleton
     * @param {Object} dateObject
     * @param {string} type
     * @returns {string}
     */
    function getResultantPattern(skeleton, dateObject, type, isIslamic) {
        let resPattern;
        let iType = type || 'date';
        if (IntlBase.basicPatterns.indexOf(skeleton) !== -1) {
            resPattern = getValue(iType + 'Formats.' + skeleton, dateObject);
            if (iType === 'dateTime') {
                let dPattern = getValue('dateFormats.' + skeleton, dateObject);
                let tPattern = getValue('timeFormats.' + skeleton, dateObject);
                resPattern = resPattern.replace('{1}', dPattern).replace('{0}', tPattern);
            }
        }
        else {
            resPattern = getValue('dateTimeFormats.availableFormats.' + skeleton, dateObject);
        }
        if (isUndefined(resPattern) && skeleton === 'yMd') {
            resPattern = 'M/d/y';
        }
        return resPattern;
    }
    IntlBase.getResultantPattern = getResultantPattern;
    /**
     * Returns the dependable object for provided cldr data and culture
     * @private
     * @param {Object} cldr
     * @param {string} culture
     * @param {boolean} isNumber
     * @returns {Dependables}
     */
    function getDependables(cldr, culture, mode, isNumber) {
        let ret = {};
        let calendartype = mode || 'gregorian';
        ret.parserObject = ParserBase.getMainObject(cldr, culture) || IntlBase.defaultObject;
        if (isNumber) {
            ret.numericObject = getValue('numbers', ret.parserObject);
        }
        else {
            ret.dateObject = getValue('dates.calendars.' + calendartype, ret.parserObject);
        }
        return ret;
    }
    IntlBase.getDependables = getDependables;
    /**
     * Returns the symbol pattern for provided parameters
     * @private
     * @param {string} type
     * @param {string} numSystem
     * @param {Object} obj
     * @param {boolean} isAccount
     * @returns {string}
     */
    function getSymbolPattern(type, numSystem, obj, isAccount) {
        return getValue(type + 'Formats-numberSystem-' +
            numSystem + (isAccount ? '.accounting' : '.standard'), obj) || (isAccount ? getValue(type + 'Formats-numberSystem-' +
            numSystem + '.standard', obj) : '');
    }
    IntlBase.getSymbolPattern = getSymbolPattern;
    function compareBlazorDateFormats(formatOptions, culture) {
        let format = formatOptions.format || formatOptions.skeleton;
        let curFormatMapper = getValue((culture || 'en-US') + '.' + format, blazorCultureFormats);
        if (!curFormatMapper) {
            curFormatMapper = getValue('en-US.' + format, blazorCultureFormats);
        }
        if (curFormatMapper) {
            formatOptions.format = curFormatMapper.replace(/tt/, 'a');
        }
        return formatOptions;
    }
    IntlBase.compareBlazorDateFormats = compareBlazorDateFormats;
    /**
     * Returns proper numeric skeleton
     * @private
     * @param {string} skeleton
     * @returns {NumericSkeleton}
     */
    function getProperNumericSkeleton(skeleton) {
        let matches = skeleton.match(IntlBase.formatRegex);
        let ret = {};
        let pattern = matches[1].toUpperCase();
        ret.isAccount = (pattern === 'A');
        /* tslint:disable no-any */
        ret.type = IntlBase.patternMatcher[pattern];
        if (skeleton.length > 1) {
            ret.fractionDigits = parseInt(matches[2], 10);
        }
        return ret;
    }
    IntlBase.getProperNumericSkeleton = getProperNumericSkeleton;
    /**
     * Returns format data for number formatting like minimum fraction, maximum fraction, etc..,
     * @private
     * @param {string} pattern
     * @param {boolean} needFraction
     * @param {string} cSymbol
     * @param {boolean} fractionOnly
     * @returns {NegativeData}
     */
    function getFormatData(pattern, needFraction, cSymbol, fractionOnly) {
        let nData = fractionOnly ? {} : { nlead: '', nend: '' };
        let match = pattern.match(IntlBase.customRegex);
        if (match) {
            if (!fractionOnly) {
                nData.nlead = changeCurrencySymbol(match[1], cSymbol);
                nData.nend = changeCurrencySymbol(match[10], cSymbol);
                nData.groupPattern = match[4];
            }
            let fraction = match[7];
            if (fraction && needFraction) {
                let fmatch = fraction.match(fractionRegex);
                if (!isNullOrUndefined(fmatch)) {
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
    /**
     * Changes currency symbol
     * @private
     * @param {string} val
     * @param {string} sym
     * @returns {string}
     */
    function changeCurrencySymbol(val, sym) {
        if (val) {
            return val.replace(IntlBase.defaultCurrency, sym);
        }
        return '';
    }
    /**
     * Returns currency symbol based on currency code
     * @private
     * @param {Object} numericObject
     * @param {string} currencyCode
     * @returns {string}
     */
    function getCurrencySymbol(numericObject, currencyCode, altSymbol) {
        let symbol = altSymbol ? ('.' + altSymbol) : '.symbol';
        let getCurrency = getValue('currencies.' + currencyCode + symbol, numericObject) ||
            getValue('currencies.' + currencyCode + '.symbol-alt-narrow', numericObject) || '$';
        return getCurrency;
    }
    IntlBase.getCurrencySymbol = getCurrencySymbol;
    /**
     * Returns formatting options for custom number format
     * @private
     * @param {string} format
     * @param {CommonOptions} dOptions
     * @param {Dependables} obj
     * @returns {GenericFormatOptions}
     */
    function customFormat(format, dOptions, obj) {
        let options = {};
        let formatSplit = format.split(';');
        let data = ['pData', 'nData', 'zeroData'];
        for (let i = 0; i < formatSplit.length; i++) {
            options[data[i]] = customNumberFormat(formatSplit[i], dOptions, obj);
        }
        if (isNullOrUndefined(options.nData)) {
            options.nData = extend({}, options.pData);
            options.nData.nlead = isNullOrUndefined(dOptions) ? '-' + options.nData.nlead : dOptions.minusSymbol + options.nData.nlead;
        }
        return options;
    }
    IntlBase.customFormat = customFormat;
    /**
     * Returns custom formatting options
     * @private
     * @param {string} format
     * @param {CommonOptions} dOptions
     * @param {Object} numObject
     * @returns {NegativeData}
     */
    function customNumberFormat(format, dOptions, numObject) {
        let cOptions = { type: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
        let pattern = format.match(IntlBase.customRegex);
        if (isNullOrUndefined(pattern) || (pattern[5] === '' && format !== 'N/A')) {
            cOptions.type = undefined;
        }
        cOptions.nlead = pattern[1];
        cOptions.nend = pattern[10];
        let integerPart = pattern[6];
        cOptions.useGrouping = integerPart.indexOf(',') !== -1;
        integerPart = integerPart.replace(/,/g, '');
        let fractionPart = pattern[7];
        if (integerPart.indexOf('0') !== -1) {
            cOptions.minimumIntegerDigits = integerPart.length - integerPart.indexOf('0');
        }
        if (!isNullOrUndefined(fractionPart)) {
            cOptions.minimumFractionDigits = fractionPart.lastIndexOf('0');
            cOptions.maximumFractionDigits = fractionPart.lastIndexOf('#');
            if (cOptions.minimumFractionDigits === -1) {
                cOptions.minimumFractionDigits = 0;
            }
            if (cOptions.maximumFractionDigits === -1 || cOptions.maximumFractionDigits < cOptions.minimumFractionDigits) {
                cOptions.maximumFractionDigits = cOptions.minimumFractionDigits;
            }
        }
        if (!isNullOrUndefined(dOptions)) {
            extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '$', dOptions.currencySymbol));
            if (!cOptions.isCurrency) {
                extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', dOptions.percentSymbol));
            }
        }
        else {
            extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', '%'));
        }
        if (!isNullOrUndefined(numObject)) {
            let symbolPattern = getSymbolPattern(cOptions.type, dOptions.numberMapper.numberSystem, numObject, false);
            if (cOptions.useGrouping) {
                cOptions.groupSeparator = dOptions.numberMapper.numberSymbols[mapper[2]];
                cOptions.groupData = NumberFormat.getGroupingDetails(symbolPattern.split(';')[0]);
            }
            cOptions.nlead = cOptions.nlead.replace(/\'/g, '');
            cOptions.nend = cOptions.nend.replace(/\'/g, '');
        }
        return cOptions;
    }
    /**
     * Returns formatting options for currency or percent type
     * @private
     * @param {string[]} parts
     * @param {string} actual
     * @param {string} symbol
     * @returns {NegativeData}
     */
    function isCurrencyPercent(parts, actual, symbol) {
        let options = { nlead: parts[0], nend: parts[1] };
        for (let i = 0; i < 2; i++) {
            let part = parts[i];
            let loc = part.indexOf(actual);
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
    /**
     * Returns culture based date separator
     * @private
     * @param {Object} dateObj
     * @returns {string}
     */
    function getDateSeparator(dateObj) {
        let value = (getValue('dateFormats.short', dateObj) || '').match(/[d‏M‏]([^d‏M])[d‏M‏]/i);
        return value ? value[1] : '/';
    }
    IntlBase.getDateSeparator = getDateSeparator;
    /**
     * Returns Native Date Time pattern
     * @private
     * @param {string} culture
     * @param {DateFormatOptions} options
     * @param {Object} cldr
     * @returns {string}
     */
    function getActualDateTimeFormat(culture, options, cldr, isExcelFormat) {
        let dependable = getDependables(cldr, culture, options.calendar);
        if (isBlazor()) {
            options = compareBlazorDateFormats(options, culture);
        }
        let actualPattern = options.format || getResultantPattern(options.skeleton, dependable.dateObject, options.type);
        if (isExcelFormat) {
            actualPattern = actualPattern.replace(patternRegex, (pattern) => {
                return patternMatch[pattern];
            });
            if (actualPattern.indexOf('z') !== -1) {
                let tLength = actualPattern.match(/z/g).length;
                let timeZonePattern;
                let options = { 'timeZone': {} };
                options.numMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
                options.timeZone = getValue('dates.timeZoneNames', dependable.parserObject);
                let value = new Date();
                let timezone = value.getTimezoneOffset();
                let pattern = (tLength < 4) ? '+H;-H' : options.timeZone.hourFormat;
                pattern = pattern.replace(/:/g, options.numMapper.timeSeparator);
                if (timezone === 0) {
                    timeZonePattern = options.timeZone.gmtZeroFormat;
                }
                else {
                    timeZonePattern = DateFormat.getTimeZoneValue(timezone, pattern);
                    timeZonePattern = options.timeZone.gmtFormat.replace(/\{0\}/, timeZonePattern);
                }
                actualPattern = actualPattern.replace(/[z]+/, '"' + timeZonePattern + '"');
            }
            actualPattern = actualPattern.replace(/ $/, '');
        }
        return actualPattern;
    }
    IntlBase.getActualDateTimeFormat = getActualDateTimeFormat;
    /**
     * Returns Native Number pattern
     * @private
     * @param {string} culture
     * @param {NumberFormatOptions} options
     * @param {Object} cldr
     * @returns {string}
     */
    function getActualNumberFormat(culture, options, cldr) {
        let dependable = getDependables(cldr, culture, '', true);
        let parseOptions = { custom: true };
        let minFrac;
        let curObj = {};
        let curMatch = (options.format || '').match(IntlBase.currencyFormatRegex);
        if (curMatch) {
            let dOptions = {};
            dOptions.numberMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true);
            let curCode = getCurrencySymbol(dependable.numericObject, options.currency || defaultCurrencyCode, options.altSymbol);
            let symbolPattern = getSymbolPattern('currency', dOptions.numberMapper.numberSystem, dependable.numericObject, (/a/i).test(options.format));
            symbolPattern = symbolPattern.replace(/\u00A4/g, curCode);
            let split = symbolPattern.split(';');
            curObj.hasNegativePattern = (split.length > 1);
            curObj.nData = getFormatData(split[1] || '-' + split[0], true, curCode);
            curObj.pData = getFormatData(split[0], false, curCode);
            if (!curMatch[2] && !options.minimumFractionDigits && !options.maximumFractionDigits) {
                minFrac = getFormatData(symbolPattern.split(';')[0], true, '', true).minimumFraction;
            }
        }
        let actualPattern;
        if ((IntlBase.formatRegex.test(options.format)) || !(options.format)) {
            extend(parseOptions, getProperNumericSkeleton(options.format || 'N'));
            parseOptions.custom = false;
            actualPattern = '###0';
            if (parseOptions.fractionDigits || options.minimumFractionDigits || options.maximumFractionDigits || minFrac) {
                let defaultMinimum = 0;
                if (parseOptions.fractionDigits) {
                    options.minimumFractionDigits = options.maximumFractionDigits = parseOptions.fractionDigits;
                }
                actualPattern = fractionDigitsPattern(actualPattern, minFrac || parseOptions.fractionDigits ||
                    options.minimumFractionDigits || defaultMinimum, options.maximumFractionDigits || defaultMinimum);
            }
            if (options.minimumIntegerDigits) {
                actualPattern = minimumIntegerPattern(actualPattern, options.minimumIntegerDigits);
            }
            if (options.useGrouping) {
                actualPattern = groupingPattern(actualPattern);
            }
            if (parseOptions.type === 'currency') {
                let cPattern = actualPattern;
                actualPattern = curObj.pData.nlead + cPattern + curObj.pData.nend;
                if (curObj.hasNegativePattern) {
                    actualPattern += ';' + curObj.nData.nlead + cPattern + curObj.nData.nend;
                }
            }
            if (parseOptions.type === 'percent') {
                actualPattern += ' %';
            }
        }
        else {
            actualPattern = options.format.replace(/\'/g, '"');
        }
        return actualPattern;
    }
    IntlBase.getActualNumberFormat = getActualNumberFormat;
    function fractionDigitsPattern(pattern, minDigits, maxDigits) {
        pattern += '.';
        for (let a = 0; a < minDigits; a++) {
            pattern += '0';
        }
        if (minDigits < maxDigits) {
            let diff = maxDigits - minDigits;
            for (let b = 0; b < diff; b++) {
                pattern += '#';
            }
        }
        return pattern;
    }
    function minimumIntegerPattern(pattern, digits) {
        let temp = pattern.split('.');
        let integer = '';
        for (let x = 0; x < digits; x++) {
            integer += '0';
        }
        return temp[1] ? (integer + '.' + temp[1]) : integer;
    }
    function groupingPattern(pattern) {
        let temp = pattern.split('.');
        let integer = temp[0];
        let no = 3 - integer.length % 3;
        let hash = (no && no === 1) ? '#' : (no === 2 ? '##' : '');
        integer = hash + integer;
        pattern = '';
        for (let x = integer.length - 1; x > 0; x = x - 3) {
            pattern = ',' + integer[x - 2] + integer[x - 1] + integer[x] + pattern;
        }
        pattern = pattern.slice(1);
        return temp[1] ? (pattern + '.' + temp[1]) : pattern;
    }
    function getWeekData(culture, cldr) {
        let firstDay = defaultFirstDay;
        let mapper = getValue('supplemental.weekData.firstDay', cldr);
        let iCulture = culture;
        if ((/en-/).test(iCulture)) {
            iCulture = iCulture.slice(3);
        }
        iCulture = iCulture.slice(0, 2).toUpperCase() + iCulture.substr(2);
        if (mapper) {
            firstDay = mapper[iCulture] || defaultFirstDay;
        }
        return firstDayMapper[firstDay];
    }
    IntlBase.getWeekData = getWeekData;
})(IntlBase || (IntlBase = {}));

const headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/gm;
const defaultType = 'GET';
/**
 * Ajax class provides ability to make asynchronous HTTP request to the server
 * ```typescript
 *   var ajax = new Ajax("index.html", "GET", true);
 *   ajax.send().then(
 *               function (value) {
 *                   console.log(value);
 *               },
 *               function (reason) {
 *                   console.log(reason);
 *               });
 * ```
 */
class Ajax {
    /**
     * Constructor for Ajax class
     * @param  {string|Object} options?
     * @param  {string} type?
     * @param  {boolean} async?
     * @returns defaultType
     */
    constructor(options, type, async, contentType) {
        /**
         * A boolean value indicating whether the request should be sent asynchronous or not.
         * @default true
         */
        this.mode = true;
        /**
         * A boolean value indicating whether to ignore the promise reject.
         * @private
         * @default true
         */
        this.emitError = true;
        this.options = {};
        if (typeof options === 'string') {
            this.url = options;
            this.type = type ? type.toUpperCase() : defaultType;
            this.mode = !isNullOrUndefined(async) ? async : true;
        }
        else if (typeof options === 'object') {
            this.options = options;
            merge(this, this.options);
        }
        this.type = this.type ? this.type.toUpperCase() : defaultType;
        this.contentType = (this.contentType !== undefined) ? this.contentType : contentType;
    }
    /**
     * Send the request to server.
     * @param {any} data - To send the user data
     * @return {Promise}
     */
    send(data) {
        this.data = isNullOrUndefined(data) ? this.data : data;
        let eventArgs = {
            cancel: false,
            httpRequest: null
        };
        let promise = new Promise((resolve, reject) => {
            this.httpRequest = new XMLHttpRequest();
            this.httpRequest.onreadystatechange = () => { this.stateChange(resolve, reject); };
            if (!isNullOrUndefined(this.onLoad)) {
                this.httpRequest.onload = this.onLoad;
            }
            if (!isNullOrUndefined(this.onProgress)) {
                this.httpRequest.onprogress = this.onProgress;
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onAbort)) {
                this.httpRequest.onabort = this.onAbort;
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onError)) {
                this.httpRequest.onerror = this.onError;
            }
            //** Upload Events **/
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.onUploadProgress)) {
                this.httpRequest.upload.onprogress = this.onUploadProgress;
            }
            this.httpRequest.open(this.type, this.url, this.mode);
            // Set default headers
            if (!isNullOrUndefined(this.data) && this.contentType !== null) {
                this.httpRequest.setRequestHeader('Content-Type', this.contentType || 'application/json; charset=utf-8');
            }
            if (this.beforeSend) {
                eventArgs.httpRequest = this.httpRequest;
                this.beforeSend(eventArgs);
            }
            if (!eventArgs.cancel) {
                this.httpRequest.send(!isNullOrUndefined(this.data) ? this.data : null);
            }
        });
        return promise;
    }
    successHandler(data) {
        if (this.onSuccess) {
            this.onSuccess(data, this);
        }
        return data;
    }
    failureHandler(reason) {
        if (this.onFailure) {
            this.onFailure(this.httpRequest);
        }
        return reason;
    }
    stateChange(resolve, reject) {
        let data = this.httpRequest.responseText;
        if (this.dataType && this.dataType.toLowerCase() === 'json') {
            if (data === '') {
                data = undefined;
            }
            else {
                try {
                    data = JSON.parse(data);
                }
                catch (error) {
                    // no exception handle
                }
            }
        }
        if (this.httpRequest.readyState === 4) {
            //success range should be 200 to 299
            if ((this.httpRequest.status >= 200 && this.httpRequest.status <= 299) || this.httpRequest.status === 304) {
                resolve(this.successHandler(data));
            }
            else {
                if (this.emitError) {
                    reject(new Error(this.failureHandler(this.httpRequest.statusText)));
                }
                else {
                    resolve();
                }
            }
        }
    }
    /**
     * To get the response header from XMLHttpRequest
     * @param  {string} key Key to search in the response header
     * @returns {string}
     */
    getResponseHeader(key) {
        let responseHeaders;
        let header;
        responseHeaders = {};
        let headers = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
        while (headers) {
            responseHeaders[headers[1].toLowerCase()] = headers[2];
            headers = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
        }
        header = responseHeaders[key.toLowerCase()];
        return isNullOrUndefined(header) ? null : header;
    }
}

/**
 * EventHandler class provides option to add, remove, clear and trigger events to a HTML DOM element
 * @private
 * ```html
 * <div id="Eventdiv">  </div>
 * <script>
 *   let node: HTMLElement = document.querySelector("#Eventdiv");
 *   EventHandler.addEventListener(node, "click", function(){
 *       // click handler function code
 *   });
 *   EventHandler.addEventListener(node, "onmouseover", function(){
 *       // mouseover handler function code
 *   });
 *   EventHandler.removeEventListener(node, "click", function(){
 *       // click handler function code
 *   });
 *   eventObj.clearEvents();
 * </script>
 * ```
 */
class EventHandler {
    // to get the event data based on element
    static addOrGetEventData(element) {
        if ('__eventList' in element) {
            return element.__eventList.events;
        }
        else {
            element.__eventList = {};
            return element.__eventList.events = [];
        }
    }
    /**
     * Add an event to the specified DOM element.
     * @param {any} element - Target HTML DOM element
     * @param {string} eventName - A string that specifies the name of the event
     * @param {Function} listener - Specifies the function to run when the event occurs
     * @param {Object} bindTo - A object that binds 'this' variable in the event handler
     * @param {number} debounce - Specifies at what interval given event listener should be triggered.
     * @return {Function}
     */
    static add(element, eventName, listener, bindTo, intDebounce) {
        let eventData = EventHandler.addOrGetEventData(element);
        let debounceListener;
        if (intDebounce) {
            debounceListener = debounce(listener, intDebounce);
        }
        else {
            debounceListener = listener;
        }
        if (bindTo) {
            debounceListener = debounceListener.bind(bindTo);
        }
        let event = eventName.split(' ');
        for (let i = 0; i < event.length; i++) {
            eventData.push({
                name: event[i],
                listener: listener,
                debounce: debounceListener
            });
            element.addEventListener(event[i], debounceListener);
        }
        return debounceListener;
    }
    /**
     * Remove an event listener that has been attached before.
     * @param {any} element - Specifies the target html element to remove the event
     * @param {string} eventName - A string that specifies the name of the event to remove
     * @param {Function} listener - Specifies the function to remove
     * @return {void}
     */
    static remove(element, eventName, listener) {
        let eventData = EventHandler.addOrGetEventData(element);
        let event = eventName.split(' ');
        for (let j = 0; j < event.length; j++) {
            let index = -1;
            let debounceListener;
            if (eventData && eventData.length !== 0) {
                eventData.some((x, i) => {
                    return x.name === event[j] && x.listener === listener ?
                        (index = i, debounceListener = x.debounce, true) : false;
                });
            }
            if (index !== -1) {
                eventData.splice(index, 1);
            }
            if (debounceListener) {
                element.removeEventListener(event[j], debounceListener);
            }
        }
    }
    /**
     * Clear all the event listeners that has been previously attached to the element.
     * @param {any} element - Specifies the target html element to clear the events
     * @return {void}
     */
    static clearEvents(element) {
        let eventData;
        let copyData;
        eventData = EventHandler.addOrGetEventData(element);
        copyData = extend([], copyData, eventData);
        for (let i = 0; i < copyData.length; i++) {
            element.removeEventListener(copyData[i].name, copyData[i].debounce);
            eventData.shift();
        }
    }
    /**
     * Trigger particular event of the element.
     * @param {any} element - Specifies the target html element to trigger the events
     * @param {string} eventName - Specifies the event to trigger for the specified element.
     * Can be a custom event, or any of the standard events.
     * @param {any} eventProp - Additional parameters to pass on to the event properties
     * @return {void}
     */
    static trigger(element, eventName, eventProp) {
        let eventData = EventHandler.addOrGetEventData(element);
        for (let event of eventData) {
            if (event.name === eventName) {
                event.debounce.call(this, eventProp);
            }
        }
    }
}

/**
 * Functions related to dom operations.
 */
const SVG_REG = /^svg|^path|^g/;
/**
 * Function to create Html element.
 * @param tagName - Name of the tag, id and class names.
 * @param properties - Object to set properties in the element.
 * @param properties.id - To set the id to the created element.
 * @param properties.className - To add classes to the element.
 * @param properties.innerHTML - To set the innerHTML to element.
 * @param properties.styles - To set the some custom styles to element.
 * @param properties.attrs - To set the attributes to element.
 * @private
 */
function createElement(tagName, properties) {
    //tslint:disable-next-line
    let element = (SVG_REG.test(tagName) ? document.createElementNS('http://www.w3.org/2000/svg', tagName) : document.createElement(tagName));
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
/**
 * The function used to add the classes to array of elements
 * @param  {Element[]|NodeList} elements - An array of elements that need to add a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 * @private
 */
function addClass(elements, classes) {
    let classList = getClassList(classes);
    for (let ele of elements) {
        for (let className of classList) {
            if (!ele.classList.contains(className)) {
                ele.classList.add(className);
            }
        }
    }
    return elements;
}
/**
 * The function used to add the classes to array of elements
 * @param  {Element[]|NodeList} elements - An array of elements that need to remove a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 * @private
 */
function removeClass(elements, classes) {
    let classList = getClassList(classes);
    for (let ele of elements) {
        if (ele.className !== '') {
            for (let className of classList) {
                ele.classList.remove(className);
            }
        }
    }
    return elements;
}
function getClassList(classes) {
    let classList = [];
    if (typeof classes === 'string') {
        classList.push(classes);
    }
    else {
        classList = classes;
    }
    return classList;
}
/**
 * The function used to check element is visible or not.
 * @param  {Element|Node} element - An element the need to check visibility
 * @private
 */
function isVisible(element) {
    let ele = element;
    return (ele.style.visibility === '' && ele.offsetWidth > 0);
}
/**
 * The function used to insert an array of elements into a first of the element.
 * @param  {Element[]|NodeList} fromElements - An array of elements that need to prepend.
 * @param  {Element} toElement - An element that is going to prepend.
 * @private
 */
function prepend(fromElements, toElement, isEval) {
    let docFrag = document.createDocumentFragment();
    for (let ele of fromElements) {
        docFrag.appendChild(ele);
    }
    toElement.insertBefore(docFrag, toElement.firstElementChild);
    if (isEval) {
        executeScript(toElement);
    }
    return fromElements;
}
/**
 * The function used to insert an array of elements into last of the element.
 * @param  {Element[]|NodeList} fromElements - An array of elements that need to append.
 * @param  {Element} toElement - An element that is going to prepend.
 * @private
 */
function append(fromElements, toElement, isEval) {
    let docFrag = document.createDocumentFragment();
    for (let ele of fromElements) {
        docFrag.appendChild(ele);
    }
    toElement.appendChild(docFrag);
    if (isEval) {
        executeScript(toElement);
    }
    return fromElements;
}
/**
 * The function is used to evaluate script from Ajax request
 * @param ele - An element is going to evaluate the script
 */
function executeScript(ele) {
    let eleArray = ele.querySelectorAll('script');
    eleArray.forEach((element) => {
        let script = document.createElement('script');
        script.text = element.innerHTML;
        document.head.appendChild(script);
        detach(script);
    });
}
/**
 * The function used to remove the element from the
 * @param  {Element|Node|HTMLElement} element - An element that is going to detach from the Dom
 * @private
 */
function detach(element) {
    let parentNode = element.parentNode;
    return parentNode.removeChild(element);
}
/**
 * The function used to remove the element from Dom also clear the bounded events
 * @param  {Element|Node|HTMLElement} element - An element remove from the Dom
 * @private
 */
function remove(element) {
    let parentNode = element.parentNode;
    EventHandler.clearEvents(element);
    parentNode.removeChild(element);
}
/**
 * The function helps to set multiple attributes to an element
 * @param  {Element|Node} element - An element that need to set attributes.
 * @param  {{[key:string]:string}} attributes - JSON Object that is going to as attributes.
 * @private
 */
function attributes(element, attributes) {
    let keys = Object.keys(attributes);
    let ele = element;
    for (let key of keys) {
        ele.setAttribute(key, attributes[key]);
    }
    return ele;
}
/**
 * The function selects the element from giving context.
 * @param  {string} selector - Selector string need fetch element from the
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
function select(selector, context = document) {
    return context.querySelector(selector);
}
/**
 * The function selects an array of element from the given context.
 * @param  {string} selector - Selector string need fetch element from the
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
function selectAll(selector, context = document) {
    let nodeList = context.querySelectorAll(selector);
    return nodeList;
}
/**
 * Returns single closest parent element based on class selector.
 * @param  {Element} element - An element that need to find the closest element.
 * @param  {string} selector - A classSelector of closest element.
 * @private
 */
function closest(element, selector) {
    let el = element;
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
/**
 * Returns all sibling elements of the given element.
 * @param  {Element|Node} element - An element that need to get siblings.
 * @private
 */
function siblings(element) {
    let siblings = [];
    let childNodes = Array.prototype.slice.call(element.parentNode.childNodes);
    for (let curNode of childNodes) {
        if (curNode.nodeType === Node.ELEMENT_NODE && element !== curNode) {
            siblings.push(curNode);
        }
    }
    return siblings;
}
/**
 * set the value if not exist. Otherwise set the existing value
 * @param  {HTMLElement} element - An element to which we need to set value.
 * @param  {string} property - Property need to get or set.
 * @param  {string} value - value need to set.
 * @private
 */
function getAttributeOrDefault(element, property, value) {
    let attrVal = element.getAttribute(property);
    if (isNullOrUndefined(attrVal)) {
        element.setAttribute(property, value.toString());
        attrVal = value;
    }
    return attrVal;
}
/**
 * Set the style attributes to Html element.
 * @param {HTMLElement} element - Element which we want to set attributes
 * @param {any} attrs - Set the given attributes to element
 * @return {void}
 * @private
 */
function setStyleAttribute(element, attrs) {
    if (attrs !== undefined) {
        Object.keys(attrs).forEach((key) => {
            // tslint:disable-next-line:no-any
            element.style[key] = attrs[key];
        });
    }
}
/**
 * Method for add and remove classes to a dom element.
 * @param {Element} element - Element for add and remove classes
 * @param {string[]} addClasses - List of classes need to be add to the element
 * @param {string[]} removeClasses - List of classes need to be remove from the element
 * @return {void}
 * @private
 */
function classList(element, addClasses, removeClasses) {
    addClass([element], addClasses);
    removeClass([element], removeClasses);
}
/**
 * Method to check whether the element matches the given selector.
 * @param {Element} element - Element to compare with the selector.
 * @param {string} selector - String selector which element will satisfy.
 * @return {void}
 * @private
 */
function matches(element, selector) {
    let matches = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    if (matches) {
        return matches.call(element, selector);
    }
    else {
        return [].indexOf.call(document.querySelectorAll(selector), element) !== -1;
    }
}

const isColEName = new RegExp('\]');
/* tslint:enable:no-any */
/**
 * Base library module is common module for Framework modules like touch,keyboard and etc.,
 * @private
 */
class Base {
    /**
     * Base constructor accept options and element
     */
    constructor(options, element) {
        this.isRendered = false;
        this.isComplexArraySetter = false;
        this.isServerRendered = false;
        this.allowServerDataBinding = true;
        this.isProtectedOnChange = true;
        this.properties = {};
        this.changedProperties = {};
        this.oldProperties = {};
        this.bulkChanges = {};
        this.refreshing = false;
        this.ignoreCollectionWatch = false;
        // tslint:disable-next-line:no-empty
        this.finalUpdate = () => { };
        this.childChangedProperties = {};
        this.modelObserver = new Observer(this);
        if (!isUndefined(element)) {
            if ('string' === typeof (element)) {
                this.element = document.querySelector(element);
            }
            else {
                this.element = element;
            }
            if (!isNullOrUndefined(this.element)) {
                this.isProtectedOnChange = false;
                this.addInstance();
            }
        }
        if (!isUndefined(options)) {
            this.setProperties(options, true);
        }
        this.isDestroyed = false;
    }
    /** Property base section */
    /**
     * Function used to set bunch of property at a time.
     * @private
     * @param  {Object} prop - JSON object which holds components properties.
     * @param  {boolean} muteOnChange? - Specifies to true when we set properties.
     */
    setProperties(prop, muteOnChange) {
        let prevDetection = this.isProtectedOnChange;
        this.isProtectedOnChange = !!muteOnChange;
        merge(this, prop);
        if (muteOnChange !== true) {
            merge(this.changedProperties, prop);
            this.dataBind();
        }
        else if (isBlazor() && this.isRendered) {
            this.serverDataBind(prop);
        }
        this.finalUpdate();
        this.changedProperties = {};
        this.oldProperties = {};
        this.isProtectedOnChange = prevDetection;
    }
    ;
    /**
     * Calls for child element data bind
     * @param {Object} obj
     * @param {Object} parent
     * @returns {void}
     */
    // tslint:disable-next-line:no-any
    static callChildDataBind(obj, parent) {
        let keys = Object.keys(obj);
        for (let key of keys) {
            if (parent[key] instanceof Array) {
                for (let obj of parent[key]) {
                    if (obj.dataBind !== undefined) {
                        obj.dataBind();
                    }
                }
            }
            else {
                parent[key].dataBind();
            }
        }
    }
    clearChanges() {
        this.finalUpdate();
        this.changedProperties = {};
        this.oldProperties = {};
        this.childChangedProperties = {};
    }
    /**
     * Bind property changes immediately to components
     */
    dataBind() {
        Base.callChildDataBind(this.childChangedProperties, this);
        if (Object.getOwnPropertyNames(this.changedProperties).length) {
            let prevDetection = this.isProtectedOnChange;
            let newChanges = this.changedProperties;
            let oldChanges = this.oldProperties;
            this.clearChanges();
            this.isProtectedOnChange = true;
            this.onPropertyChanged(newChanges, oldChanges);
            this.isProtectedOnChange = prevDetection;
        }
    }
    ;
    /* tslint:disable:no-any */
    serverDataBind(newChanges) {
        if (!isBlazor()) {
            return;
        }
        newChanges = newChanges ? newChanges : {};
        extend(this.bulkChanges, {}, newChanges, true);
        if (this.allowServerDataBinding) {
            let ejsInterop = 'ejsInterop';
            window[ejsInterop].updateModel(this);
            this.bulkChanges = {};
        }
    }
    /* tslint:enable:no-any */
    saveChanges(key, newValue, oldValue) {
        if (isBlazor()) {
            // tslint:disable-next-line:no-any
            let newChanges = {};
            newChanges[key] = newValue;
            this.serverDataBind(newChanges);
        }
        if (this.isProtectedOnChange) {
            return;
        }
        this.oldProperties[key] = oldValue;
        this.changedProperties[key] = newValue;
        this.finalUpdate();
        this.finalUpdate = setImmediate(this.dataBind.bind(this));
    }
    ;
    /** Event Base Section */
    /**
     * Adds the handler to the given event listener.
     * @param {string} eventName - A String that specifies the name of the event
     * @param {Function} listener - Specifies the call to run when the event occurs.
     * @return {void}
     */
    addEventListener(eventName, handler) {
        this.modelObserver.on(eventName, handler);
    }
    /**
     * Removes the handler from the given event listener.
     * @param {string} eventName - A String that specifies the name of the event to remove
     * @param {Function} listener - Specifies the function to remove
     * @return {void}
     */
    removeEventListener(eventName, handler) {
        this.modelObserver.off(eventName, handler);
    }
    /**
     * Triggers the handlers in the specified event.
     * @private
     * @param {string} eventName - Specifies the event to trigger for the specified component properties.
     * Can be a custom event, or any of the standard events.
     * @param {Event} eventProp - Additional parameters to pass on to the event properties
     * @param {Function} successHandler - this function will invoke after event successfully triggered
     * @param {Function} errorHandler - this function will invoke after event if it failured to call.
     * @return {void}
     */
    trigger(eventName, eventProp, successHandler, errorHandler) {
        if (this.isDestroyed !== true) {
            let prevDetection = this.isProtectedOnChange;
            this.isProtectedOnChange = false;
            let data = this.modelObserver.notify(eventName, eventProp, successHandler, errorHandler);
            if (isColEName.test(eventName)) {
                let handler = getValue(eventName, this);
                if (handler) {
                    let blazor = 'Blazor';
                    if (window[blazor]) {
                        let promise = handler.call(this, eventProp);
                        if (promise && typeof promise.then === 'function') {
                            if (!successHandler) {
                                data = promise;
                            }
                            else {
                                promise.then((data) => {
                                    if (successHandler) {
                                        data = typeof data === 'string' && this.modelObserver.isJson(data) ?
                                            JSON.parse(data) : data;
                                        successHandler.call(this, data);
                                    }
                                }).catch((data) => {
                                    if (errorHandler) {
                                        data = typeof data === 'string' && this.modelObserver.isJson(data) ? JSON.parse(data) : data;
                                        errorHandler.call(this, data);
                                    }
                                });
                            }
                        }
                        else if (successHandler) {
                            successHandler.call(this, eventProp);
                        }
                    }
                    else {
                        handler.call(this, eventProp);
                        if (successHandler) {
                            successHandler.call(this, eventProp);
                        }
                    }
                }
                else if (successHandler) {
                    successHandler.call(this, eventProp);
                }
            }
            this.isProtectedOnChange = prevDetection;
            return data;
        }
    }
    /**
     * To maintain instance in base class
     */
    addInstance() {
        // Add module class to the root element
        let moduleClass = 'e-' + this.getModuleName().toLowerCase();
        addClass([this.element], ['e-lib', moduleClass]);
        if (!isNullOrUndefined(this.element.ej2_instances)) {
            this.element.ej2_instances.push(this);
        }
        else {
            setValue('ej2_instances', [this], this.element);
        }
    }
    /**
     * To remove the instance from the element
     */
    destroy() {
        this.element.ej2_instances =
            this.element.ej2_instances.filter((i) => { return i !== this; });
        removeClass([this.element], ['e-' + this.getModuleName()]);
        if (this.element.ej2_instances.length === 0) {
            // Remove module class from the root element
            removeClass([this.element], ['e-lib']);
        }
        this.clearChanges();
        this.modelObserver.destroy();
        this.isDestroyed = true;
    }
}
/**
 * Global function to get the component instance from the rendered element.
 * @param elem Specifies the HTMLElement or element id string.
 * @param comp Specifies the component module name or Component.
 */
// tslint:disable-next-line:no-any
function getComponent(elem, comp) {
    let instance;
    let i;
    let ele = typeof elem === 'string' ? document.getElementById(elem) : elem;
    for (i = 0; i < ele.ej2_instances.length; i++) {
        instance = ele.ej2_instances[i];
        if (typeof comp === 'string') {
            let compName = instance.getModuleName();
            if (comp === compName) {
                return instance;
            }
        }
        else {
            // tslint:disable-next-line:no-any
            if (instance instanceof comp) {
                return instance;
            }
        }
    }
    return undefined;
}
/**
 * Function to remove the child instances.
 * @return {void}
 * @private
 */
// tslint:disable-next-line:no-any
function removeChildInstance(element) {
    // tslint:disable-next-line:no-any
    let childEle = [].slice.call(element.getElementsByClassName('e-control'));
    for (let i = 0; i < childEle.length; i++) {
        let compName = childEle[i].classList[1].split('e-')[1];
        // tslint:disable-next-line:no-any
        let compInstance = getComponent(childEle[i], compName);
        if (!isUndefined(compInstance)) {
            compInstance.destroy();
        }
    }
}

const REGX_MOBILE = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
const REGX_IE = /msie|trident/i;
const REGX_IE11 = /Trident\/7\./;
const REGX_IOS = /(ipad|iphone|ipod touch)/i;
const REGX_IOS7 = /(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i;
const REGX_ANDROID = /android/i;
const REGX_WINDOWS = /trident|windows phone|edge/i;
const REGX_VERSION = /(version)[ \/]([\w.]+)/i;
const REGX_BROWSER = {
    OPERA: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i,
    EDGE: /(edge)(?:.*version|)[ \/]([\w.]+)/i,
    CHROME: /(chrome|crios)[ \/]([\w.]+)/i,
    PANTHOMEJS: /(phantomjs)[ \/]([\w.]+)/i,
    SAFARI: /(safari)[ \/]([\w.]+)/i,
    WEBKIT: /(webkit)[ \/]([\w.]+)/i,
    MSIE: /(msie|trident) ([\w.]+)/i,
    MOZILLA: /(mozilla)(?:.*? rv:([\w.]+)|)/i
};
/* istanbul ignore else  */
if (typeof window !== 'undefined') {
    window.browserDetails = window.browserDetails || {};
}
/**
 * Get configuration details for Browser
 * @private
 */
class Browser {
    static extractBrowserDetail() {
        let browserInfo = { culture: {} };
        let keys = Object.keys(REGX_BROWSER);
        let clientInfo = [];
        for (let key of keys) {
            clientInfo = Browser.userAgent.match(REGX_BROWSER[key]);
            if (clientInfo) {
                browserInfo.name = (clientInfo[1].toLowerCase() === 'opr' ? 'opera' : clientInfo[1].toLowerCase());
                browserInfo.name = (clientInfo[1].toLowerCase() === 'crios' ? 'chrome' : browserInfo.name);
                browserInfo.version = clientInfo[2];
                browserInfo.culture.name = browserInfo.culture.language = navigator.language;
                if (!!Browser.userAgent.match(REGX_IE11)) {
                    browserInfo.name = 'msie';
                    break;
                }
                let version = Browser.userAgent.match(REGX_VERSION);
                if (browserInfo.name === 'safari' && version) {
                    browserInfo.version = version[2];
                }
                break;
            }
        }
        return browserInfo;
    }
    /**
     * To get events from the browser
     * @param {string} event - type of event triggered.
     * @returns {Boolean}
     */
    static getEvent(event) {
        // tslint:disable-next-line:no-any
        let events = {
            start: {
                isPointer: 'pointerdown', isTouch: 'touchstart', isDevice: 'mousedown'
            },
            move: {
                isPointer: 'pointermove', isTouch: 'touchmove', isDevice: 'mousemove'
            },
            end: {
                isPointer: 'pointerup', isTouch: 'touchend', isDevice: 'mouseup'
            },
            cancel: {
                isPointer: 'pointercancel', isTouch: 'touchcancel', isDevice: 'mouseleave'
            }
        };
        return (Browser.isPointer ? events[event].isPointer :
            (Browser.isTouch ? events[event].isTouch + (!Browser.isDevice ? ' ' + events[event].isDevice : '')
                : events[event].isDevice));
    }
    /**
     * To get the Touch start event from browser
     * @returns {string}
     */
    static getTouchStartEvent() {
        return Browser.getEvent('start');
    }
    /**
     * To get the Touch end event from browser
     * @returns {string}
     */
    static getTouchEndEvent() {
        return Browser.getEvent('end');
    }
    /**
     * To get the Touch move event from browser
     * @returns {string}
     */
    static getTouchMoveEvent() {
        return Browser.getEvent('move');
    }
    /**
     * To cancel the touch event from browser
     * @returns {string}
     */
    static getTouchCancelEvent() {
        return Browser.getEvent('cancel');
    }
    /**
     * To get the value based on provided key and regX
     * @param {string} key
     * @param {RegExp} regX
     * @returns {Object}
     */
    static getValue(key, regX) {
        let browserDetails = window.browserDetails;
        if ('undefined' === typeof browserDetails[key]) {
            return browserDetails[key] = regX.test(Browser.userAgent);
        }
        return browserDetails[key];
    }
    //Properties 
    /**
     * Property specifies the userAgent of the browser. Default userAgent value is based on the browser.
     * Also we can set our own userAgent.
     */
    static set userAgent(uA) {
        Browser.uA = uA;
        window.browserDetails = {};
    }
    static get userAgent() {
        return Browser.uA;
    }
    //Read Only Properties
    /**
     * Property is to get the browser information like Name, Version and Language
     * @returns BrowserInfo
     */
    static get info() {
        if (isUndefined(window.browserDetails.info)) {
            return window.browserDetails.info = Browser.extractBrowserDetail();
        }
        return window.browserDetails.info;
    }
    /**
     * Property is to get whether the userAgent is based IE.
     */
    static get isIE() {
        return Browser.getValue('isIE', REGX_IE);
    }
    /**
     * Property is to get whether the browser has touch support.
     */
    static get isTouch() {
        if (isUndefined(window.browserDetails.isTouch)) {
            return window.browserDetails.isTouch = ('ontouchstart' in window);
        }
        return window.browserDetails.isTouch;
    }
    /**
     * Property is to get whether the browser has Pointer support.
     */
    static get isPointer() {
        if (isUndefined(window.browserDetails.isPointer)) {
            return window.browserDetails.isPointer = ('pointerEnabled' in window.navigator);
        }
        return window.browserDetails.isPointer;
    }
    /**
     * Property is to get whether the browser has MSPointer support.
     */
    static get isMSPointer() {
        if (isUndefined(window.browserDetails.isMSPointer)) {
            return window.browserDetails.isMSPointer = ('msPointerEnabled' in window.navigator);
        }
        return window.browserDetails.isMSPointer;
    }
    /**
     * Property is to get whether the userAgent is device based.
     */
    static get isDevice() {
        return Browser.getValue('isDevice', REGX_MOBILE);
    }
    /**
     * Property is to get whether the userAgent is IOS.
     */
    static get isIos() {
        return Browser.getValue('isIos', REGX_IOS);
    }
    /**
     * Property is to get whether the userAgent is Ios7.
     */
    static get isIos7() {
        return Browser.getValue('isIos7', REGX_IOS7);
    }
    /**
     * Property is to get whether the userAgent is Android.
     */
    static get isAndroid() {
        return Browser.getValue('isAndroid', REGX_ANDROID);
    }
    /**
     * Property is to identify whether application ran in web view.
     */
    static get isWebView() {
        if (isUndefined(window.browserDetails.isWebView)) {
            window.browserDetails.isWebView = !(isUndefined(window.cordova) && isUndefined(window.PhoneGap)
                && isUndefined(window.phonegap) && window.forge !== 'object');
            return window.browserDetails.isWebView;
        }
        return window.browserDetails.isWebView;
    }
    /**
     * Property is to get whether the userAgent is Windows.
     */
    static get isWindows() {
        return Browser.getValue('isWindows', REGX_WINDOWS);
    }
    /**
     * Property is to get the touch start event. It returns event name based on browser.
     */
    static get touchStartEvent() {
        if (isUndefined(window.browserDetails.touchStartEvent)) {
            return window.browserDetails.touchStartEvent = Browser.getTouchStartEvent();
        }
        return window.browserDetails.touchStartEvent;
    }
    /**
     * Property is to get the touch move event. It returns event name based on browser.
     */
    static get touchMoveEvent() {
        if (isUndefined(window.browserDetails.touchMoveEvent)) {
            return window.browserDetails.touchMoveEvent = Browser.getTouchMoveEvent();
        }
        return window.browserDetails.touchMoveEvent;
    }
    /**
     * Property is to get the touch end event. It returns event name based on browser.
     */
    static get touchEndEvent() {
        if (isUndefined(window.browserDetails.touchEndEvent)) {
            return window.browserDetails.touchEndEvent = Browser.getTouchEndEvent();
        }
        return window.browserDetails.touchEndEvent;
    }
    /**
     * Property is to cancel the touch end event.
     */
    static get touchCancelEvent() {
        if (isUndefined(window.browserDetails.touchCancelEvent)) {
            return window.browserDetails.touchCancelEvent = Browser.getTouchCancelEvent();
        }
        return window.browserDetails.touchCancelEvent;
    }
}
/* istanbul ignore next */
Browser.uA = typeof navigator !== 'undefined' ? navigator.userAgent : '';

/**
 * Returns the Class Object
 * @param {ClassObject} instance - instance of ClassObject
 * @param {string} curKey - key of the current instance
 * @param {Object} defaultValue - default Value
 * @param {Object[]} type
 */
function getObject(instance, curKey, defaultValue, type) {
    if (!instance.properties.hasOwnProperty(curKey) || !(instance.properties[curKey] instanceof type)) {
        instance.properties[curKey] = createInstance(type, [instance, curKey, defaultValue]);
    }
    return instance.properties[curKey];
}
/**
 * Returns object array
 * @param {ClassObject} instance
 * @param {string} curKey
 * @param {Object[]} defaultValue
 * @param type
 * @param {boolean} isSetter
 * @returns {Object[]}
 */
function getObjectArray(instance, curKey, defaultValue, type, isSetter, isFactory) {
    let result = [];
    let len = defaultValue ? defaultValue.length : 0;
    for (let i = 0; i < len; i++) {
        let curType = type;
        if (isFactory) {
            curType = type(defaultValue[i], instance);
        }
        if (isSetter) {
            let inst = createInstance(curType, [instance, curKey, {}, true]);
            inst.setProperties(defaultValue[i], true);
            result.push(inst);
        }
        else {
            result.push(createInstance(curType, [instance, curKey, defaultValue[i], false]));
        }
    }
    return result;
}
/**
 * Returns the properties of the object
 * @param {Object} defaultValue
 * @param {string} curKey
 */
function propertyGetter(defaultValue, curKey) {
    return function () {
        if (!this.properties.hasOwnProperty(curKey)) {
            this.properties[curKey] = defaultValue;
        }
        return this.properties[curKey];
    };
}
/**
 * Set the properties for the object
 * @param {Object} defaultValue
 * @param {string} curKey
 */
function propertySetter(defaultValue, curKey) {
    return function (newValue) {
        if (this.properties[curKey] !== newValue) {
            let oldVal = this.properties.hasOwnProperty(curKey) ? this.properties[curKey] : defaultValue;
            this.saveChanges(curKey, newValue, oldVal);
            this.properties[curKey] = newValue;
        }
    };
}
/**
 * Returns complex objects
 */
function complexGetter(defaultValue, curKey, type) {
    return function () {
        return getObject(this, curKey, defaultValue, type);
    };
}
/**
 * Sets complex objects
 */
function complexSetter(defaultValue, curKey, type) {
    return function (newValue) {
        getObject(this, curKey, defaultValue, type).setProperties(newValue);
    };
}
function complexFactoryGetter(defaultValue, curKey, type) {
    return function () {
        let curType = type({});
        if (this.properties.hasOwnProperty(curKey)) {
            return this.properties[curKey];
        }
        else {
            return getObject(this, curKey, defaultValue, curType);
        }
    };
}
function complexFactorySetter(defaultValue, curKey, type) {
    return function (newValue) {
        let curType = type(newValue, this);
        getObject(this, curKey, defaultValue, curType).setProperties(newValue);
    };
}
function complexArrayGetter(defaultValue, curKey, type) {
    return function () {
        if (!this.properties.hasOwnProperty(curKey)) {
            let defCollection = getObjectArray(this, curKey, defaultValue, type, false);
            this.properties[curKey] = defCollection;
        }
        let ignore = ((this.controlParent !== undefined && this.controlParent.ignoreCollectionWatch)
            || this.ignoreCollectionWatch);
        if (!this.properties[curKey].hasOwnProperty('push') && !ignore) {
            ['push', 'pop'].forEach((extendFunc) => {
                let descriptor = {
                    value: complexArrayDefinedCallback(extendFunc, curKey, type, this.properties[curKey]).bind(this),
                    configurable: true
                };
                Object.defineProperty(this.properties[curKey], extendFunc, descriptor);
            });
        }
        if (!this.properties[curKey].hasOwnProperty('isComplexArray')) {
            Object.defineProperty(this.properties[curKey], 'isComplexArray', { value: true });
        }
        return this.properties[curKey];
    };
}
function complexArraySetter(defaultValue, curKey, type) {
    return function (newValue) {
        this.isComplexArraySetter = true;
        let oldValueCollection = getObjectArray(this, curKey, defaultValue, type, false);
        let newValCollection = getObjectArray(this, curKey, newValue, type, true);
        this.isComplexArraySetter = false;
        this.saveChanges(curKey, newValCollection, oldValueCollection);
        this.properties[curKey] = newValCollection;
    };
}
function complexArrayFactorySetter(defaultValue, curKey, type) {
    return function (newValue) {
        let oldValueCollection = this.properties.hasOwnProperty(curKey) ? this.properties[curKey] : defaultValue;
        let newValCollection = getObjectArray(this, curKey, newValue, type, true, true);
        this.saveChanges(curKey, newValCollection, oldValueCollection);
        this.properties[curKey] = newValCollection;
    };
}
function complexArrayFactoryGetter(defaultValue, curKey, type) {
    return function () {
        let curType = type({});
        if (!this.properties.hasOwnProperty(curKey)) {
            let defCollection = getObjectArray(this, curKey, defaultValue, curType, false);
            this.properties[curKey] = defCollection;
        }
        return this.properties[curKey];
    };
}
function complexArrayDefinedCallback(dFunc, curKey, type, prop) {
    /* tslint:disable no-function-expression */
    return function (...newValue) {
        let keyString = this.propName ? this.getParentKey() + '.' + curKey + '-' : curKey + '-';
        switch (dFunc) {
            case 'push':
                for (let i = 0; i < newValue.length; i++) {
                    Array.prototype[dFunc].apply(prop, [newValue[i]]);
                    let model = getArrayModel(keyString + (prop.length - 1), newValue[i], !this.controlParent, dFunc);
                    this.serverDataBind(model, newValue[i], false, dFunc);
                }
                break;
            case 'pop':
                Array.prototype[dFunc].apply(prop);
                let model = getArrayModel(keyString + prop.length, null, !this.controlParent, dFunc);
                this.serverDataBind(model, { ejsAction: 'pop' }, false, dFunc);
                break;
        }
        return prop;
    };
    /* tslint:enable no-function-expression */
}
function getArrayModel(keyString, value, isControlParent, arrayFunction) {
    let modelObject = keyString;
    if (isControlParent) {
        modelObject = {};
        modelObject[keyString] = value;
        if (value && typeof value === 'object') {
            let action = 'ejsAction';
            modelObject[keyString][action] = arrayFunction;
        }
    }
    return modelObject;
}
/**
 * Method used to create property. General syntax below.
 * @param  {T} defaultValue? - Specifies the default value of property.
 * ```
 * @Property('TypeScript')
 * propertyName: Type;
 * ```
 * @private
 */
function Property(defaultValue) {
    return (target, key) => {
        let propertyDescriptor = {
            set: propertySetter(defaultValue, key),
            get: propertyGetter(defaultValue, key),
            enumerable: true,
            configurable: true
        };
        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(target, key, 'prop', defaultValue);
    };
}
/**
 * Method used to create complex property. General syntax below.
 * @param  {T} defaultValue - Specifies the default value of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Complex<Type>({},Type)
 * propertyName: Type;
 * ```
 * @private
 */
function Complex(defaultValue, type) {
    return (target, key) => {
        let propertyDescriptor = {
            set: complexSetter(defaultValue, key, type),
            get: complexGetter(defaultValue, key, type),
            enumerable: true,
            configurable: true
        };
        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(target, key, 'complexProp', defaultValue, type);
    };
}
/**
 * Method used to create complex Factory property. General syntax below.
 * @param  {Function} defaultType - Specifies the default value of property.
 * @param  {Function} type - Specifies the class factory type of complex object.
 * ```
 * @ComplexFactory(defaultType, factoryFunction)
 * propertyName: Type1 | Type2;
 * ```
 * @private
 */
function ComplexFactory(type) {
    return (target, key) => {
        let propertyDescriptor = {
            set: complexFactorySetter({}, key, type),
            get: complexFactoryGetter({}, key, type),
            enumerable: true,
            configurable: true
        };
        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(target, key, 'complexProp', {}, type);
    };
}
/**
 * Method used to create complex array property. General syntax below.
 * @param  {T[]} defaultValue - Specifies the default value of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Collection([], Type);
 * propertyName: Type;
 * ```
 * @private
 */
function Collection(defaultValue, type) {
    return (target, key) => {
        let propertyDescriptor = {
            set: complexArraySetter(defaultValue, key, type),
            get: complexArrayGetter(defaultValue, key, type),
            enumerable: true,
            configurable: true
        };
        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(target, key, 'colProp', defaultValue, type);
    };
}
/**
 * Method used to create complex factory array property. General syntax below.
 * @param  {T[]} defaultType - Specifies the default type of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Collection([], Type);
 * propertyName: Type;
 * ```
 * @private
 */
function CollectionFactory(type) {
    return (target, key) => {
        let propertyDescriptor = {
            set: complexArrayFactorySetter([], key, type),
            get: complexArrayFactoryGetter([], key, type),
            enumerable: true,
            configurable: true
        };
        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(target, key, 'colProp', {}, type);
    };
}
/**
 * Method used to create event property. General syntax below.
 * @param  {Function} defaultValue? - Specifies the default value of property.
 * @param  {boolean} isComplex? - Specifies the whether it is complex object.
 * ```
 * @Event(()=>{return true;})
 * ```
 * @private
 */
function Event$1() {
    return (target, key) => {
        let eventDescriptor = {
            set: function (newValue) {
                let oldValue = this.properties[key];
                if (oldValue !== newValue) {
                    let finalContext = getParentContext(this, key);
                    if (isUndefined(oldValue) === false) {
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
/**
 * NotifyPropertyChanges is triggers the call back when the property has been changed.
 *
 * ```
 *  @NotifyPropertyChanges
 * class DemoClass implements INotifyPropertyChanged {
 *
 *     @Property()
 *     property1: string;
 *
 *     dataBind: () => void;
 *
 *     constructor() { }
 *
 *     onPropertyChanged(newProp: any, oldProp: any) {
 *         // Called when property changed
 *     }
 * }
 * ```
 * @private
 */
function NotifyPropertyChanges(classConstructor) {
    /** Need to code */
}
/**
 * Method  used to create the builderObject for the target component.
 * @private
 */
function addPropertyCollection(target, key, propertyType, defaultValue, type) {
    if (isUndefined(target.propList)) {
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
    /* tslint:disable no-any */
    target.propList[propertyType + 's'].push({
        propertyName: key,
        defaultValue: defaultValue,
        type: type
    });
    target.propList[propertyType + 'Names'].push(key);
    /* tslint:enable no-any */
}
/**
 * Returns an object containing the builder properties
 * @param {Function} component
 * @private
 */
function getBuilderProperties(component) {
    if (isUndefined(component.prototype.builderObject)) {
        component.prototype.builderObject = {
            properties: {}, propCollections: [], add: function () {
                this.isPropertyArray = true;
                this.propCollections.push(extend({}, this.properties, {}));
            }
        };
        let rex = /complex/;
        for (let key of Object.keys(component.prototype.propList)) {
            for (let prop of component.prototype.propList[key]) {
                if (rex.test(key)) {
                    component.prototype.builderObject[prop.propertyName] = function (value) {
                        let childType = {};
                        merge(childType, getBuilderProperties(prop.type));
                        value(childType);
                        let tempValue;
                        if (!childType.isPropertyArray) {
                            tempValue = extend({}, childType.properties, {});
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
            }
        }
    }
    return component.prototype.builderObject;
}
/**
 * Method used to create builder for the components
 * @param {any} component -specifies the target component for which builder to be created.
 * @private
 */
function CreateBuilder(component) {
    let builderFunction = function (element) {
        this.element = element;
        return this;
    };
    let instanceFunction = (element) => {
        if (!builderFunction.prototype.hasOwnProperty('create')) {
            builderFunction.prototype = getBuilderProperties(component);
            builderFunction.prototype.create = function () {
                let temp = extend({}, {}, this.properties);
                this.properties = {};
                return new component(temp, this.element);
            };
        }
        return new builderFunction(element);
    };
    return instanceFunction;
}
/**
 * Returns parent options for the object
 * @param {Object} context
 * @param {string} prefix
 * @private
 */
function getParentContext(context, prefix) {
    if (context.hasOwnProperty('parentObj') === false) {
        return { context: context, prefix: prefix };
    }
    else {
        let curText = getValue('propName', context);
        if (curText) {
            prefix = curText + '-' + prefix;
        }
        return getParentContext(getValue('parentObj', context), prefix);
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Animation_1;
/**
 * The Animation framework provide options to animate the html DOM elements
 * ```typescript
 *   let animeObject = new Animation({
 *      name: 'SlideLeftIn',
 *      duration: 1000
 *   });
 *   animeObject.animate('#anime1');
 *   animeObject.animate('#anime2', { duration: 500 });
 * ```
 */
let Animation = Animation_1 = class Animation extends Base {
    constructor(options) {
        super(options, undefined);
        /**
         * @private
         */
        this.easing = {
            ease: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
            linear: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
            easeIn: 'cubic-bezier(0.420, 0.000, 1.000, 1.000)',
            easeOut: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)',
            easeInOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
            elasticInOut: 'cubic-bezier(0.5,-0.58,0.38,1.81)',
            elasticIn: 'cubic-bezier(0.17,0.67,0.59,1.81)',
            elasticOut: 'cubic-bezier(0.7,-0.75,0.99,1.01)'
        };
    }
    /**
     * Applies animation to the current element.
     * @param {string | HTMLElement} element - Element which needs to be animated.
     * @param {AnimationModel} options - Overriding default animation settings.
     * @return {void}
     */
    animate(element, options) {
        options = !options ? {} : options;
        let model = this.getModel(options);
        if (typeof element === 'string') {
            let elements = Array.prototype.slice.call(selectAll(element, document));
            for (let element of elements) {
                model.element = element;
                Animation_1.delayAnimation(model);
            }
        }
        else {
            model.element = element;
            Animation_1.delayAnimation(model);
        }
    }
    /**
     * Stop the animation effect on animated element.
     * @param {HTMLElement} element - Element which needs to be stop the animation.
     * @param {AnimationOptions} model - Handling the animation model at stop function.
     * @return {void}
     */
    static stop(element, model) {
        element.style.animation = '';
        element.removeAttribute('e-animate');
        let animationId = element.getAttribute('e-animation-id');
        if (animationId) {
            let frameId = parseInt(animationId, 10);
            cancelAnimationFrame(frameId);
            element.removeAttribute('e-animation-id');
        }
        if (model && model.end) {
            model.end.call(this, model);
        }
    }
    /**
     * Set delay to animation element
     * @param {AnimationModel} model
     * @returns {void}
     */
    static delayAnimation(model) {
        if (model.delay) {
            setTimeout(() => { Animation_1.applyAnimation(model); }, model.delay);
        }
        else {
            Animation_1.applyAnimation(model);
        }
    }
    /**
     * Triggers animation
     * @param {AnimationModel} model
     * @returns {void}
     */
    static applyAnimation(model) {
        model.timeStamp = 0;
        let step = 0;
        let timerId = 0;
        let startTime = 0;
        let prevTimeStamp = 0;
        let duration = model.duration;
        model.element.setAttribute('e-animate', 'true');
        let startAnimation = (timeStamp) => {
            try {
                if (timeStamp) {
                    // let step: number = model.timeStamp = timeStamp - startTime;
                    /** phantomjs workaround for timestamp fix */
                    prevTimeStamp = prevTimeStamp === 0 ? timeStamp : prevTimeStamp;
                    model.timeStamp = (timeStamp + model.timeStamp) - prevTimeStamp;
                    prevTimeStamp = timeStamp;
                    /** phantomjs workaround end */
                    // trigger animation begin event
                    if (!step && model.begin) {
                        model.begin.call(this, model);
                    }
                    step = step + 1;
                    let avg = model.timeStamp / step;
                    if (model.timeStamp < duration && model.timeStamp + avg < duration && model.element.getAttribute('e-animate')) {
                        // apply animation effect to the current element                
                        model.element.style.animation = model.name + ' ' + model.duration + 'ms ' + model.timingFunction;
                        if (model.progress) {
                            model.progress.call(this, model);
                        }
                        // repeat requestAnimationFrame 
                        requestAnimationFrame(startAnimation);
                    }
                    else {
                        // clear requestAnimationFrame
                        cancelAnimationFrame(timerId);
                        model.element.removeAttribute('e-animation-id');
                        model.element.removeAttribute('e-animate');
                        model.element.style.animation = '';
                        if (model.end) {
                            model.end.call(this, model);
                        }
                    }
                }
                else {
                    startTime = performance.now();
                    // set initial requestAnimationFrame
                    timerId = requestAnimationFrame(startAnimation);
                    model.element.setAttribute('e-animation-id', timerId.toString());
                }
            }
            catch (e) {
                cancelAnimationFrame(timerId);
                model.element.removeAttribute('e-animation-id');
                if (model.fail) {
                    model.fail.call(this, e);
                }
            }
        };
        startAnimation();
    }
    /**
     * Returns Animation Model
     * @param {AnimationModel} options
     * @returns {AnimationModel}
     */
    getModel(options) {
        return {
            name: options.name || this.name,
            delay: options.delay || this.delay,
            duration: (options.duration !== undefined ? options.duration : this.duration),
            begin: options.begin || this.begin,
            end: options.end || this.end,
            fail: options.fail || this.fail,
            progress: options.progress || this.progress,
            timingFunction: this.easing[options.timingFunction] ? this.easing[options.timingFunction] :
                (options.timingFunction || this.easing[this.timingFunction])
        };
    }
    /**
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        // no code needed
    }
    /**
     * Returns module name as animation
     * @private
     */
    getModuleName() {
        return 'animation';
    }
    /**
     * @private
     */
    destroy() {
        //Override base destroy;
    }
};
__decorate([
    Property('FadeIn')
], Animation.prototype, "name", void 0);
__decorate([
    Property(400)
], Animation.prototype, "duration", void 0);
__decorate([
    Property('ease')
], Animation.prototype, "timingFunction", void 0);
__decorate([
    Property(0)
], Animation.prototype, "delay", void 0);
__decorate([
    Event$1()
], Animation.prototype, "progress", void 0);
__decorate([
    Event$1()
], Animation.prototype, "begin", void 0);
__decorate([
    Event$1()
], Animation.prototype, "end", void 0);
__decorate([
    Event$1()
], Animation.prototype, "fail", void 0);
Animation = Animation_1 = __decorate([
    NotifyPropertyChanges
], Animation);
/**
 * Ripple provides material theme's wave effect when an element is clicked
 * ```html
 * <div id='ripple'></div>
 * <script>
 *   rippleEffect(document.getElementById('ripple'));
 * </script>
 * ```
 * @private
 * @param HTMLElement element - Target element
 * @param RippleOptions rippleOptions - Ripple options .
 */
function rippleEffect(element, rippleOptions, done) {
    let rippleModel = getRippleModel(rippleOptions);
    if (rippleModel.rippleFlag === false || (rippleModel.rippleFlag === undefined && !isRippleEnabled)) {
        return Function;
    }
    element.setAttribute('data-ripple', 'true');
    EventHandler.add(element, 'mousedown', rippleHandler, { parent: element, rippleOptions: rippleModel });
    EventHandler.add(element, 'mouseup', rippleUpHandler, { parent: element, rippleOptions: rippleModel, done: done });
    EventHandler.add(element, 'mouseleave', rippleLeaveHandler, { parent: element, rippleOptions: rippleModel });
    if (Browser.isPointer) {
        EventHandler.add(element, 'transitionend', rippleLeaveHandler, { parent: element, rippleOptions: rippleModel });
    }
    return (() => {
        element.removeAttribute('data-ripple');
        EventHandler.remove(element, 'mousedown', rippleHandler);
        EventHandler.remove(element, 'mouseup', rippleUpHandler);
        EventHandler.remove(element, 'mouseleave', rippleLeaveHandler);
        EventHandler.remove(element, 'transitionend', rippleLeaveHandler);
    });
}
function getRippleModel(rippleOptions) {
    let rippleModel = {
        selector: rippleOptions && rippleOptions.selector ? rippleOptions.selector : null,
        ignore: rippleOptions && rippleOptions.ignore ? rippleOptions.ignore : null,
        rippleFlag: rippleOptions && rippleOptions.rippleFlag,
        isCenterRipple: rippleOptions && rippleOptions.isCenterRipple,
        duration: rippleOptions && rippleOptions.duration ? rippleOptions.duration : 350
    };
    return rippleModel;
}
/**
 * Handler for ripple event
 * @param {MouseEvent} e
 * @returns {void}
 * @private
 */
function rippleHandler(e) {
    let target = (e.target);
    let selector = this.rippleOptions.selector;
    let element = selector ? closest(target, selector) : target;
    if (!element || (this.rippleOptions && closest(target, this.rippleOptions.ignore))) {
        return;
    }
    let offset = element.getBoundingClientRect();
    let offsetX = e.pageX - document.body.scrollLeft;
    let offsetY = e.pageY - ((!document.body.scrollTop && document.documentElement) ?
        document.documentElement.scrollTop : document.body.scrollTop);
    let pageX = Math.max(Math.abs(offsetX - offset.left), Math.abs(offsetX - offset.right));
    let pageY = Math.max(Math.abs(offsetY - offset.top), Math.abs(offsetY - offset.bottom));
    let radius = Math.sqrt(pageX * pageX + pageY * pageY);
    let diameter = radius * 2 + 'px';
    let x = offsetX - offset.left - radius;
    let y = offsetY - offset.top - radius;
    if (this.rippleOptions && this.rippleOptions.isCenterRipple) {
        x = 0;
        y = 0;
        diameter = '100%';
    }
    element.classList.add('e-ripple');
    let duration = this.rippleOptions.duration.toString();
    let styles = 'width: ' + diameter + ';height: ' + diameter + ';left: ' + x + 'px;top: ' + y + 'px;' +
        'transition-duration: ' + duration + 'ms;';
    let rippleElement = createElement('div', { className: 'e-ripple-element', styles: styles });
    element.appendChild(rippleElement);
    window.getComputedStyle(rippleElement).getPropertyValue('opacity');
    rippleElement.style.transform = 'scale(1)';
    if (element !== this.parent) {
        EventHandler.add(element, 'mouseleave', rippleLeaveHandler, { parent: this.parent, rippleOptions: this.rippleOptions });
    }
}
/**
 * Handler for ripple element mouse up event
 * @param {MouseEvent} e
 * @returns {void}
 * @private
 */
function rippleUpHandler(e) {
    removeRipple(e, this);
}
/**
 * Handler for ripple element mouse move event
 * @param {MouseEvent} e
 * @returns {void}
 * @private
 */
function rippleLeaveHandler(e) {
    removeRipple(e, this);
}
/**
 * Handler for removing ripple element
 * @param {MouseEvent} e
 * @param {rippleArgs} eventArgs
 * @returns {void}
 * @private
 */
function removeRipple(e, eventArgs) {
    let duration = eventArgs.rippleOptions.duration;
    let target = (e.target);
    let selector = eventArgs.rippleOptions.selector;
    let element = selector ? closest(target, selector) : target;
    if (!element || (element && element.className.indexOf('e-ripple') === -1)) {
        return;
    }
    let rippleElements = selectAll('.e-ripple-element', element);
    let rippleElement = rippleElements[rippleElements.length - 1];
    if (rippleElement) {
        rippleElement.style.opacity = '0.5';
    }
    if (eventArgs.parent !== element) {
        EventHandler.remove(element, 'mouseleave', rippleLeaveHandler);
    }
    /* tslint:disable:align */
    setTimeout(() => {
        if (rippleElement && rippleElement.parentNode) {
            rippleElement.parentNode.removeChild(rippleElement);
        }
        if (!element.getElementsByClassName('e-ripple-element').length) {
            element.classList.remove('e-ripple');
        }
        if (eventArgs.done) {
            eventArgs.done(e);
        }
    }, duration);
}
let isRippleEnabled = false;
/**
 * Animation Module provides support to enable ripple effect functionality to Essential JS 2 components.
 * @param {boolean} isRipple Specifies the boolean value to enable or disable ripple effect.
 * @returns {boolean}
 */
function enableRipple(isRipple) {
    isRippleEnabled = isRipple;
    return isRippleEnabled;
}

/**
 * Module loading operations
 */
const MODULE_SUFFIX = 'Module';
class ModuleLoader {
    constructor(parent) {
        this.loadedModules = [];
        this.parent = parent;
    }
    ;
    /**
     * Inject required modules in component library
     * @return {void}
     * @param {ModuleDeclaration[]} requiredModules - Array of modules to be required
     * @param {Function[]} moduleList - Array of modules to be injected from sample side
     */
    inject(requiredModules, moduleList) {
        let reqLength = requiredModules.length;
        if (reqLength === 0) {
            this.clean();
            return;
        }
        if (this.loadedModules.length) {
            this.clearUnusedModule(requiredModules);
        }
        for (let i = 0; i < reqLength; i++) {
            let modl = requiredModules[i];
            for (let module of moduleList) {
                let modName = modl.member;
                if (module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
                    let moduleObject = createInstance(module, modl.args);
                    let memberName = this.getMemberName(modName);
                    if (modl.isProperty) {
                        setValue(memberName, module, this.parent);
                    }
                    else {
                        setValue(memberName, moduleObject, this.parent);
                    }
                    let loadedModule = modl;
                    loadedModule.member = memberName;
                    this.loadedModules.push(loadedModule);
                }
            }
        }
    }
    /**
     * To remove the created object while destroying the control
     * @return {void}
     */
    clean() {
        for (let modules of this.loadedModules) {
            if (!modules.isProperty) {
                getValue(modules.member, this.parent).destroy();
            }
        }
        this.loadedModules = [];
    }
    /**
     * Removes all unused modules
     * @param {ModuleDeclaration[]} moduleList
     * @returns {void}
     */
    clearUnusedModule(moduleList) {
        let usedModules = moduleList.map((arg) => { return this.getMemberName(arg.member); });
        let removableModule = this.loadedModules.filter((module) => {
            return usedModules.indexOf(module.member) === -1;
        });
        for (let mod of removableModule) {
            if (!mod.isProperty) {
                getValue(mod.member, this.parent).destroy();
            }
            this.loadedModules.splice(this.loadedModules.indexOf(mod), 1);
            deleteObject(this.parent, mod.member);
        }
    }
    /**
     * To get the name of the member.
     * @param {string} name
     * @returns {string}
     */
    getMemberName(name) {
        return name[0].toLowerCase() + name.substring(1) + MODULE_SUFFIX;
    }
    /**
     * Returns boolean based on whether the module specified is loaded or not
     * @param {string} modName
     * @returns {boolean}
     */
    isModuleLoaded(modName) {
        for (let mod of this.loadedModules) {
            if (mod.member === this.getMemberName(modName)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * To detect the changes for inner properties.
 * @private
 */
class ChildProperty {
    constructor(parent, propName, defaultValue, isArray) {
        this.isComplexArraySetter = false;
        this.properties = {};
        this.changedProperties = {};
        this.childChangedProperties = {};
        this.oldProperties = {};
        // tslint:disable-next-line:no-empty
        this.finalUpdate = () => { };
        this.callChildDataBind = getValue('callChildDataBind', Base);
        this.parentObj = parent;
        this.controlParent = this.parentObj.controlParent || this.parentObj;
        this.propName = propName;
        this.isParentArray = isArray;
        this.setProperties(defaultValue, true);
    }
    /**
     * Updates the property changes
     * @param {boolean} val
     * @param {string} propName
     * @returns {void}
     */
    updateChange(val, propName) {
        if (val === true) {
            this.parentObj.childChangedProperties[propName] = val;
        }
        else {
            delete this.parentObj.childChangedProperties[propName];
        }
        if (this.parentObj.updateChange) {
            this.parentObj.updateChange(val, this.parentObj.propName);
        }
    }
    /**
     * Updates time out duration
     */
    updateTimeOut() {
        if (this.parentObj.updateTimeOut) {
            this.parentObj.finalUpdate();
            this.parentObj.updateTimeOut();
        }
        else {
            let changeTime = setTimeout(this.parentObj.dataBind.bind(this.parentObj));
            let clearUpdate = () => {
                clearTimeout(changeTime);
            };
            this.finalUpdate = clearUpdate;
        }
    }
    /**
     * Clears changed properties
     */
    clearChanges() {
        this.finalUpdate();
        this.updateChange(false, this.propName);
        this.oldProperties = {};
        this.changedProperties = {};
    }
    /**
     * Set property changes
     * @param {Object} prop
     * @param {boolean} muteOnChange
     * {void}
     */
    setProperties(prop, muteOnChange) {
        if (muteOnChange === true) {
            merge(this, prop);
            this.updateChange(false, this.propName);
            this.clearChanges();
        }
        else {
            merge(this, prop);
        }
    }
    /**
     * Binds data
     */
    dataBind() {
        this.callChildDataBind(this.childChangedProperties, this);
        if (this.isParentArray) {
            let curIndex = this.parentObj[this.propName].indexOf(this);
            if (Object.keys(this.changedProperties).length) {
                setValue(this.propName + '.' + curIndex, this.changedProperties, this.parentObj.changedProperties);
                setValue(this.propName + '.' + curIndex, this.oldProperties, this.parentObj.oldProperties);
            }
        }
        else {
            this.parentObj.changedProperties[this.propName] = this.changedProperties;
            this.parentObj.oldProperties[this.propName] = this.oldProperties;
        }
        this.clearChanges();
    }
    /**
     * Saves changes to newer values
     * @param {string} key
     * @param {Object} newValue
     * @param {Object} oldValue
     * @returns {void}
     */
    saveChanges(key, newValue, oldValue, restrictServerDataBind) {
        if (this.controlParent.isProtectedOnChange) {
            return;
        }
        if (!restrictServerDataBind) {
            this.serverDataBind(key, newValue, true);
        }
        this.oldProperties[key] = oldValue;
        this.changedProperties[key] = newValue;
        this.updateChange(true, this.propName);
        this.finalUpdate();
        this.updateTimeOut();
    }
    serverDataBind(key, value, isSaveChanges, action) {
        if (isBlazor() && !this.parentObj.isComplexArraySetter) {
            // tslint:disable-next-line:no-any
            let parent;
            let newChanges = {};
            let parentKey = isSaveChanges ? this.getParentKey(true) + '.' + key : key;
            /* istanbul ignore else  */
            if (parentKey.indexOf('.') !== -1) {
                let complexKeys = parentKey.split('.');
                parent = newChanges;
                for (let i = 0; i < complexKeys.length; i++) {
                    let isFinal = i === complexKeys.length - 1;
                    parent[complexKeys[i]] = isFinal ? value : {};
                    parent = isFinal ? parent : parent[complexKeys[i]];
                }
            }
            else {
                newChanges[parentKey] = {};
                parent = newChanges[parentKey];
                newChanges[parentKey][key] = value;
            }
            /* istanbul ignore next */
            if (this.isParentArray) {
                let actionProperty = 'ejsAction';
                parent[actionProperty] = action ? action : 'none';
            }
            this.controlParent.serverDataBind(newChanges);
        }
    }
    getParentKey(isSaveChanges) {
        // tslint:disable-next-line:no-any
        let index = '';
        let propName = this.propName;
        /* istanbul ignore next */
        if (this.isParentArray) {
            index = this.parentObj[this.propName].indexOf(this);
            let valueLength = this.parentObj[this.propName].length;
            valueLength = isSaveChanges ? valueLength : (valueLength > 0 ? valueLength - 1 : 0);
            index = index !== -1 ? '-' + index : '-' + valueLength;
            propName = propName + index;
        }
        if (this.controlParent !== this.parentObj) {
            propName = this.parentObj.getParentKey() + '.' + this.propName + index;
        }
        return propName;
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let componentCount = 0;
let lastPageID;
let lastHistoryLen = 0;
/**
 * Base class for all Essential JavaScript components
 */
let Component = class Component extends Base {
    /**
     * Initialize the constructor for component base
     */
    constructor(options, selector) {
        super(options, selector);
        this.randomId = uniqueID();
        /**
         * string template option for Blazor template rendering
         * @private
         */
        this.isStringTemplate = false;
        this.needsID = false;
        /**
         * This is a instance method to create an element.
         * @private
         */
        this.createElement = createElement;
        if (isNullOrUndefined(this.enableRtl)) {
            this.setProperties({ 'enableRtl': rightToLeft }, true);
        }
        if (isNullOrUndefined(this.locale)) {
            this.setProperties({ 'locale': defaultCulture }, true);
        }
        this.moduleLoader = new ModuleLoader(this);
        this.localObserver = new Observer(this);
        // tslint:disable-next-line:no-function-constructor-with-string-args
        onIntlChange.on('notifyExternalChange', this.detectFunction, this, this.randomId);
        if (!isUndefined(selector)) {
            this.appendTo();
        }
    }
    requiredModules() {
        return [];
    }
    ;
    /**
     * Destroys the sub modules while destroying the widget
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        if (this.enablePersistence) {
            this.setPersistData();
        }
        this.localObserver.destroy();
        if (this.refreshing) {
            return;
        }
        removeClass([this.element], ['e-control']);
        this.trigger('destroyed', { cancel: false });
        super.destroy();
        this.moduleLoader.clean();
        onIntlChange.off('notifyExternalChange', this.detectFunction, this.randomId);
    }
    /**
     * Applies all the pending property changes and render the component again.
     */
    refresh() {
        this.refreshing = true;
        this.moduleLoader.clean();
        this.destroy();
        this.clearChanges();
        this.localObserver = new Observer(this);
        this.preRender();
        this.injectModules();
        this.render();
        this.refreshing = false;
    }
    /**
     * Appends the control within the given HTML element
     * @param {string | HTMLElement} selector - Target element where control needs to be appended
     */
    appendTo(selector) {
        if (!isNullOrUndefined(selector) && typeof (selector) === 'string') {
            this.element = document.querySelector(selector);
        }
        else if (!isNullOrUndefined(selector)) {
            this.element = selector;
        }
        if (!isNullOrUndefined(this.element)) {
            let moduleClass = 'e-' + this.getModuleName().toLowerCase();
            addClass([this.element], ['e-control', moduleClass]);
            this.isProtectedOnChange = false;
            if (this.needsID && !this.element.id) {
                this.element.id = this.getUniqueID(this.getModuleName());
            }
            if (this.enablePersistence) {
                this.mergePersistData();
                window.addEventListener('unload', this.setPersistData.bind(this));
            }
            let inst = getValue('ej2_instances', this.element);
            if (!inst || inst.indexOf(this) === -1) {
                super.addInstance();
            }
            this.preRender();
            this.injectModules();
            this.render();
            this.trigger('created');
        }
    }
    /**
     * It is used to process the post rendering functionalities to a component.
     */
    renderComplete(wrapperElement) {
        if (isBlazor()) {
            let ejsInterop = 'ejsInterop';
            // tslint:disable-next-line:no-any
            window[ejsInterop].renderComplete(this.element, wrapperElement);
        }
        this.isRendered = true;
    }
    /**
     * When invoked, applies the pending property changes immediately to the component.
     */
    dataBind() {
        this.injectModules();
        super.dataBind();
    }
    ;
    /**
     * Attach one or more  event handler to the current component context.
     * It is used for internal handling event internally within the component only.
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the handler to run when the event occurs
     * @param {Object} context - optional parameter Specifies the context to be bind in the handler.
     * @return {void}
     * @private
     */
    on(event, handler, context) {
        if (typeof event === 'string') {
            this.localObserver.on(event, handler, context);
        }
        else {
            for (let arg of event) {
                this.localObserver.on(arg.event, arg.handler, arg.context);
            }
        }
    }
    /**
     * To remove one or more event handler that has been attached with the on() method.
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the function to run when the event occurs
     * @return {void}
     * @private
     */
    off(event, handler) {
        if (typeof event === 'string') {
            this.localObserver.off(event, handler);
        }
        else {
            for (let arg of event) {
                this.localObserver.off(arg.event, arg.handler);
            }
        }
    }
    /**
     * To notify the handlers in the specified event.
     * @param {string} property - Specifies the event to be notify.
     * @param {Object} argument - Additional parameters to pass while calling the handler.
     * @return {void}
     * @private
     */
    notify(property, argument) {
        if (this.isDestroyed !== true) {
            this.localObserver.notify(property, argument);
        }
    }
    /**
     * Get injected modules
     * @private
     */
    getInjectedModules() {
        return this.injectedModules;
    }
    ;
    /**
     * Dynamically injects the required modules to the component.
     */
    static Inject(...moduleList) {
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (let i = 0; i < moduleList.length; i++) {
            if (this.prototype.injectedModules.indexOf(moduleList[i]) === -1) {
                this.prototype.injectedModules.push(moduleList[i]);
            }
        }
    }
    injectModules() {
        if (this.injectedModules && this.injectedModules.length) {
            this.moduleLoader.inject(this.requiredModules(), this.injectedModules);
        }
    }
    detectFunction(args) {
        let prop = Object.keys(args);
        if (prop.length) {
            this[prop[0]] = args[prop[0]];
        }
    }
    mergePersistData() {
        let data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            this.setProperties(JSON.parse(data), true);
        }
    }
    setPersistData() {
        if (!this.isDestroyed) {
            window.localStorage.setItem(this.getModuleName() + this.element.id, this.getPersistData());
        }
    }
    //tslint:disable-next-line
    clearTemplate(templateName, index) {
        //No Code
    }
    getUniqueID(definedName) {
        if (this.isHistoryChanged()) {
            componentCount = 0;
        }
        lastPageID = this.pageID(location.href);
        lastHistoryLen = history.length;
        return definedName + '_' + lastPageID + '_' + componentCount++;
    }
    pageID(url) {
        let hash = 0;
        if (url.length === 0) {
            return hash;
        }
        for (let i = 0; i < url.length; i++) {
            let char = url.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    isHistoryChanged() {
        return lastPageID !== this.pageID(location.href) || lastHistoryLen !== history.length;
    }
    addOnPersist(options) {
        let persistObj = {};
        for (let key of options) {
            let objValue;
            objValue = getValue(key, this);
            if (!isUndefined(objValue)) {
                setValue(key, this.getActualProperties(objValue), persistObj);
            }
        }
        return JSON.stringify(persistObj, (key, value) => {
            return this.getActualProperties(value);
        });
    }
    getActualProperties(obj) {
        if (obj instanceof ChildProperty) {
            return getValue('properties', obj);
        }
        else {
            return obj;
        }
    }
    ignoreOnPersist(options) {
        return JSON.stringify(this.iterateJsonProperties(this.properties, options));
    }
    iterateJsonProperties(obj, ignoreList) {
        let newObj = {};
        for (let key of Object.keys(obj)) {
            if (ignoreList.indexOf(key) === -1) {
                // tslint:disable-next-line:no-any
                let value = obj[key];
                if (typeof value === 'object' && !(value instanceof Array)) {
                    let newList = ignoreList.filter((str) => {
                        return new RegExp(key + '.').test(str);
                    }).map((str) => {
                        return str.replace(key + '.', '');
                    });
                    newObj[key] = this.iterateJsonProperties(this.getActualProperties(value), newList);
                }
                else {
                    newObj[key] = value;
                }
            }
        }
        return newObj;
    }
};
__decorate$1([
    Property(false)
], Component.prototype, "enablePersistence", void 0);
__decorate$1([
    Property()
], Component.prototype, "enableRtl", void 0);
__decorate$1([
    Property()
], Component.prototype, "locale", void 0);
Component = __decorate$1([
    NotifyPropertyChanges
], Component);
//Function handling for page navigation detection 
/* istanbul ignore next */
(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('popstate', 
        /* istanbul ignore next */
        () => {
            componentCount = 0;
        });
    }
})();

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Draggable_1;
const defaultPosition = { left: 0, top: 0, bottom: 0, right: 0 };
const isDraggedObject = { isDragged: false };
/**
 * Specifies the position coordinates
 */
class Position extends ChildProperty {
}
__decorate$2([
    Property(0)
], Position.prototype, "left", void 0);
__decorate$2([
    Property(0)
], Position.prototype, "top", void 0);
/**
 * Draggable Module provides support to enable draggable functionality in Dom Elements.
 * ```html
 * <div id='drag'>Draggable</div>
 * <script>
 * var ele = document.getElementById('drag');
 * var drag:Draggable = new Draggable(ele,{
 *     clone:false,
 *     drag: function(e) {
 *      //drag handler code.
 *      },
 *     handle:'.class'
 * });
 * </script>
 * ```
 */
let Draggable = Draggable_1 = class Draggable extends Base {
    constructor(element, options) {
        super(options, element);
        this.dragLimit = Draggable_1.getDefaultPosition();
        this.borderWidth = Draggable_1.getDefaultPosition();
        this.padding = Draggable_1.getDefaultPosition();
        this.diffX = 0;
        this.prevLeft = 0;
        this.prevTop = 0;
        this.dragProcessStarted = false;
        /* tslint:disable no-any */
        this.tapHoldTimer = 0;
        this.externalInitialize = false;
        this.diffY = 0;
        this.parentScrollX = 0;
        this.parentScrollY = 0;
        this.droppables = {};
        this.bind();
    }
    bind() {
        this.toggleEvents();
        if (Browser.isIE) {
            addClass([this.element], 'e-block-touch');
        }
        this.droppables[this.scope] = {};
    }
    static getDefaultPosition() {
        return extend({}, defaultPosition);
    }
    toggleEvents(isUnWire) {
        let ele;
        if (!isUndefined(this.handle)) {
            ele = select(this.handle, this.element);
        }
        let handler = (this.enableTapHold && Browser.isDevice && Browser.isTouch) ? this.mobileInitialize : this.initialize;
        if (isUnWire) {
            EventHandler.remove(ele || this.element, Browser.touchStartEvent, handler);
        }
        else {
            EventHandler.add(ele || this.element, Browser.touchStartEvent, handler, this);
        }
    }
    /* istanbul ignore next */
    mobileInitialize(evt) {
        let target = evt.currentTarget;
        this.tapHoldTimer = setTimeout(() => {
            this.externalInitialize = true;
            this.removeTapholdTimer();
            this.initialize(evt, target);
        }, this.tapHoldThreshold);
        EventHandler.add(document, Browser.touchMoveEvent, this.removeTapholdTimer, this);
        EventHandler.add(document, Browser.touchEndEvent, this.removeTapholdTimer, this);
    }
    /* istanbul ignore next */
    removeTapholdTimer() {
        clearTimeout(this.tapHoldTimer);
        EventHandler.remove(document, Browser.touchMoveEvent, this.removeTapholdTimer);
        EventHandler.remove(document, Browser.touchEndEvent, this.removeTapholdTimer);
    }
    /* istanbul ignore next */
    getScrollableParent(element, axis) {
        let scroll = { 'vertical': 'scrollHeight', 'horizontal': 'scrollWidth' };
        let client = { 'vertical': 'clientHeight', 'horizontal': 'clientWidth' };
        if (isNullOrUndefined(element)) {
            return null;
        }
        if (element[scroll[axis]] > element[client[axis]]) {
            if (axis === 'vertical' ? element.scrollTop > 0 : element.scrollLeft > 0) {
                if (axis === 'vertical') {
                    this.parentScrollY = this.parentScrollY +
                        (this.parentScrollY === 0 ? element.scrollTop : element.scrollTop - this.parentScrollY);
                }
                else {
                    this.parentScrollX = this.parentScrollX +
                        (this.parentScrollX === 0 ? element.scrollLeft : element.scrollLeft - this.parentScrollX);
                }
                if (!isNullOrUndefined(element)) {
                    return this.getScrollableParent(element.parentNode, axis);
                }
                else {
                    return element;
                }
            }
            else {
                return this.getScrollableParent(element.parentNode, axis);
            }
        }
        else {
            return this.getScrollableParent(element.parentNode, axis);
        }
    }
    getScrollableValues() {
        this.parentScrollX = 0;
        this.parentScrollY = 0;
        let isModalDialog = this.element.classList.contains('e-dialog') && this.element.classList.contains('e-dlg-modal');
        let verticalScrollParent = this.getScrollableParent(this.element.parentNode, 'vertical');
        let horizontalScrollParent = this.getScrollableParent(this.element.parentNode, 'horizontal');
    }
    initialize(evt, curTarget) {
        this.currentStateTarget = evt.target;
        if (this.isDragStarted()) {
            return;
        }
        else {
            this.isDragStarted(true);
            this.externalInitialize = false;
        }
        this.target = (evt.currentTarget || curTarget);
        this.dragProcessStarted = false;
        if (this.abort) {
            /* tslint:disable no-any */
            let abortSelectors = this.abort;
            if (typeof abortSelectors === 'string') {
                abortSelectors = [abortSelectors];
            }
            for (let i = 0; i < abortSelectors.length; i++) {
                if (!isNullOrUndefined(closest(evt.target, abortSelectors[i]))) {
                    /* istanbul ignore next */
                    if (this.isDragStarted()) {
                        this.isDragStarted(true);
                    }
                    return;
                }
            }
        }
        if (this.preventDefault && !isUndefined(evt.changedTouches)) {
            evt.preventDefault();
        }
        this.element.setAttribute('aria-grabbed', 'true');
        let intCoord = this.getCoordinates(evt);
        this.initialPosition = { x: intCoord.pageX, y: intCoord.pageY };
        if (!this.clone) {
            let pos = this.element.getBoundingClientRect();
            this.getScrollableValues();
            if (evt.clientX === evt.pageX) {
                this.parentScrollX = 0;
            }
            if (evt.clientY === evt.pageY) {
                this.parentScrollY = 0;
            }
            this.relativeXPosition = intCoord.pageX - (pos.left + this.parentScrollX);
            this.relativeYPosition = intCoord.pageY - (pos.top + this.parentScrollY);
        }
        if (this.externalInitialize) {
            this.intDragStart(evt);
        }
        else {
            EventHandler.add(document, Browser.touchMoveEvent, this.intDragStart, this);
            EventHandler.add(document, Browser.touchEndEvent, this.intDestroy, this);
        }
        this.toggleEvents(true);
        document.body.classList.add('e-prevent-select');
        this.externalInitialize = false;
        EventHandler.trigger(document.documentElement, Browser.touchStartEvent, evt);
    }
    intDragStart(evt) {
        this.removeTapholdTimer();
        let isChangeTouch = !isUndefined(evt.changedTouches);
        if (isChangeTouch && (evt.changedTouches.length !== 1)) {
            return;
        }
        if (isChangeTouch) {
            evt.preventDefault();
        }
        let intCordinate = this.getCoordinates(evt);
        let pos;
        let styleProp = getComputedStyle(this.element);
        this.margin = {
            left: parseInt(styleProp.marginLeft, 10),
            top: parseInt(styleProp.marginTop, 10),
            right: parseInt(styleProp.marginRight, 10),
            bottom: parseInt(styleProp.marginBottom, 10),
        };
        let element = this.element;
        if (this.clone && this.dragTarget) {
            let intClosest = closest(evt.target, this.dragTarget);
            if (!isNullOrUndefined(intClosest)) {
                element = intClosest;
            }
        }
        this.offset = this.calculateParentPosition(element);
        this.position = this.getMousePosition(evt, this.isDragScroll);
        let x = this.initialPosition.x - intCordinate.pageX;
        let y = this.initialPosition.y - intCordinate.pageY;
        let distance = Math.sqrt((x * x) + (y * y));
        if ((distance >= this.distance || this.externalInitialize)) {
            let ele = this.getHelperElement(evt);
            if (!ele || isNullOrUndefined(ele)) {
                return;
            }
            let dragTargetElement = this.helperElement = ele;
            this.parentClientRect = this.calculateParentPosition(dragTargetElement.offsetParent);
            if (this.dragStart) {
                let curTarget = this.getProperTargetElement(evt);
                let args = {
                    event: evt,
                    element: element,
                    target: curTarget,
                    bindEvents: isBlazor() ? this.bindDragEvents.bind(this) : null,
                    dragElement: dragTargetElement
                };
                this.trigger('dragStart', args);
            }
            if (this.dragArea) {
                this.setDragArea();
            }
            else {
                this.dragLimit = { left: 0, right: 0, bottom: 0, top: 0 };
                this.borderWidth = { top: 0, left: 0 };
            }
            pos = { left: this.position.left - this.parentClientRect.left, top: this.position.top - this.parentClientRect.top };
            if (this.clone && !this.enableTailMode) {
                this.diffX = this.position.left - this.offset.left;
                this.diffY = this.position.top - this.offset.top;
            }
            this.getScrollableValues();
            let posValue = this.getProcessedPositionValue({
                top: (pos.top - this.diffY) + 'px',
                left: (pos.left - this.diffX) + 'px'
            });
            this.dragElePosition = { top: pos.top, left: pos.left };
            setStyleAttribute(dragTargetElement, this.getDragPosition({ position: 'absolute', left: posValue.left, top: posValue.top }));
            EventHandler.remove(document, Browser.touchMoveEvent, this.intDragStart);
            EventHandler.remove(document, Browser.touchEndEvent, this.intDestroy);
            if (!isBlazor()) {
                this.bindDragEvents(dragTargetElement);
            }
        }
    }
    bindDragEvents(dragTargetElement) {
        if (isVisible(dragTargetElement)) {
            EventHandler.add(document, Browser.touchMoveEvent, this.intDrag, this);
            EventHandler.add(document, Browser.touchEndEvent, this.intDragStop, this);
            this.setGlobalDroppables(false, this.element, dragTargetElement);
        }
        else {
            this.toggleEvents();
            document.body.classList.remove('e-prevent-select');
        }
    }
    elementInViewport(el) {
        this.top = el.offsetTop;
        this.left = el.offsetLeft;
        this.width = el.offsetWidth;
        this.height = el.offsetHeight;
        while (el.offsetParent) {
            el = el.offsetParent;
            this.top += el.offsetTop;
            this.left += el.offsetLeft;
        }
        return (this.top >= window.pageYOffset &&
            this.left >= window.pageXOffset &&
            (this.top + this.height) <= (window.pageYOffset + window.innerHeight) &&
            (this.left + this.width) <= (window.pageXOffset + window.innerWidth));
    }
    getProcessedPositionValue(value) {
        if (this.queryPositionInfo) {
            return this.queryPositionInfo(value);
        }
        return value;
    }
    calculateParentPosition(ele) {
        if (isNullOrUndefined(ele)) {
            return { left: 0, top: 0 };
        }
        let rect = ele.getBoundingClientRect();
        let style = getComputedStyle(ele);
        return {
            left: (rect.left + window.pageXOffset) - parseInt(style.marginLeft, 10),
            top: (rect.top + window.pageYOffset) - parseInt(style.marginTop, 10)
        };
    }
    // tslint:disable-next-line:max-func-body-length
    intDrag(evt) {
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        let left;
        let top;
        this.position = this.getMousePosition(evt, this.isDragScroll);
        let docHeight = this.getDocumentWidthHeight('Height');
        if (docHeight < this.position.top) {
            this.position.top = docHeight;
        }
        let docWidth = this.getDocumentWidthHeight('Width');
        if (docWidth < this.position.left) {
            this.position.left = docWidth;
        }
        if (this.drag) {
            let curTarget = this.getProperTargetElement(evt);
            this.trigger('drag', { event: evt, element: this.element, target: curTarget });
        }
        let eleObj = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            /* tslint:disable no-any */
            let flag = true;
            if (this.hoverObject) {
                if (this.hoverObject.instance !== eleObj.instance) {
                    this.triggerOutFunction(evt, eleObj);
                }
                else {
                    flag = false;
                }
            }
            if (flag) {
                eleObj.instance.dragData[this.scope] = this.droppables[this.scope];
                eleObj.instance.intOver(evt, eleObj.target);
                this.hoverObject = eleObj;
            }
        }
        else if (this.hoverObject) {
            this.triggerOutFunction(evt, eleObj);
        }
        let helperElement = this.droppables[this.scope].helper;
        this.parentClientRect = this.calculateParentPosition(this.helperElement.offsetParent);
        let tLeft = this.parentClientRect.left;
        let tTop = this.parentClientRect.top;
        let intCoord = this.getCoordinates(evt);
        let pagex = intCoord.pageX;
        let pagey = intCoord.pageY;
        let dLeft = this.position.left - this.diffX;
        let dTop = this.position.top - this.diffY;
        if (this.dragArea) {
            let styles = getComputedStyle(helperElement);
            if (this.pageX !== pagex || this.skipDistanceCheck) {
                let helperWidth = helperElement.offsetWidth + (parseFloat(styles.marginLeft)
                    + parseFloat(styles.marginRight));
                if (this.dragLimit.left > dLeft && dLeft > 0) {
                    left = this.dragLimit.left;
                }
                else if (this.dragLimit.right + window.pageXOffset < dLeft + helperWidth && dLeft > 0) {
                    left = dLeft - (dLeft - this.dragLimit.right) + window.pageXOffset - helperWidth;
                }
                else {
                    left = dLeft < 0 ? this.dragLimit.left : dLeft;
                }
            }
            if (this.pageY !== pagey || this.skipDistanceCheck) {
                let helperHeight = helperElement.offsetHeight + (parseFloat(styles.marginTop)
                    + parseFloat(styles.marginBottom));
                if (this.dragLimit.top > dTop && dTop > 0) {
                    top = this.dragLimit.top;
                }
                else if (this.dragLimit.bottom + window.pageYOffset < dTop + helperHeight && dTop > 0) {
                    top = dTop - (dTop - this.dragLimit.bottom) + window.pageYOffset - helperHeight;
                }
                else {
                    top = dTop < 0 ? this.dragLimit.top : dTop;
                }
            }
        }
        else {
            left = dLeft;
            top = dTop;
        }
        let iTop = tTop + this.borderWidth.top;
        let iLeft = tLeft + this.borderWidth.left;
        if (this.dragProcessStarted) {
            if (isNullOrUndefined(top)) {
                top = this.prevTop;
            }
            if (isNullOrUndefined(left)) {
                left = this.prevLeft;
            }
        }
        let draEleTop;
        let draEleLeft;
        if (this.dragArea) {
            draEleTop = (top - iTop) < 0 ? this.dragLimit.top : (top - iTop);
            draEleLeft = (left - iLeft) < 0 ? this.dragElePosition.left : (left - iLeft);
        }
        else {
            draEleTop = top - iTop;
            draEleLeft = left - iLeft;
        }
        let dragValue = this.getProcessedPositionValue({ top: draEleTop + 'px', left: draEleLeft + 'px' });
        setStyleAttribute(helperElement, this.getDragPosition(dragValue));
        if (!this.elementInViewport(helperElement) && this.enableAutoScroll) {
            this.helperElement.scrollIntoView();
        }
        this.dragProcessStarted = true;
        this.prevLeft = left;
        this.prevTop = top;
        this.position.left = left;
        this.position.top = top;
        this.pageX = pagex;
        this.pageY = pagey;
    }
    triggerOutFunction(evt, eleObj) {
        this.hoverObject.instance.intOut(evt, eleObj.target);
        this.hoverObject.instance.dragData[this.scope] = null;
        this.hoverObject = null;
    }
    getDragPosition(dragValue) {
        let temp = extend({}, dragValue);
        if (this.axis) {
            if (this.axis === 'x') {
                delete temp.top;
            }
            else if (this.axis === 'y') {
                delete temp.left;
            }
        }
        return temp;
    }
    getDocumentWidthHeight(str) {
        let docBody = document.body;
        let docEle = document.documentElement;
        let returnValue = Math.max(docBody['scroll' + str], docEle['scroll' + str], docBody['offset' + str], docEle['offset' + str], docEle['client' + str]);
        return returnValue;
    }
    intDragStop(evt) {
        this.dragProcessStarted = false;
        if (!isUndefined(evt.changedTouches) && (evt.changedTouches.length !== 1)) {
            return;
        }
        let type = ['touchend', 'pointerup', 'mouseup'];
        if (type.indexOf(evt.type) !== -1) {
            if (this.dragStop) {
                let curTarget = this.getProperTargetElement(evt);
                this.trigger('dragStop', { event: evt, element: this.element, target: curTarget, helper: this.helperElement });
            }
            this.intDestroy(evt);
        }
        else {
            this.element.setAttribute('aria-grabbed', 'false');
        }
        let eleObj = this.checkTargetElement(evt);
        if (eleObj.target && eleObj.instance) {
            eleObj.instance.dragStopCalled = true;
            eleObj.instance.dragData[this.scope] = this.droppables[this.scope];
            eleObj.instance.intDrop(evt, eleObj.target);
        }
        this.setGlobalDroppables(true);
        document.body.classList.remove('e-prevent-select');
    }
    /**
     * @private
     */
    intDestroy(evt) {
        this.dragProcessStarted = false;
        this.toggleEvents();
        document.body.classList.remove('e-prevent-select');
        this.element.setAttribute('aria-grabbed', 'false');
        EventHandler.remove(document, Browser.touchMoveEvent, this.intDragStart);
        EventHandler.remove(document, Browser.touchEndEvent, this.intDragStop);
        EventHandler.remove(document, Browser.touchEndEvent, this.intDestroy);
        EventHandler.remove(document, Browser.touchMoveEvent, this.intDrag);
        if (this.isDragStarted()) {
            this.isDragStarted(true);
        }
    }
    // triggers when property changed
    onPropertyChanged(newProp, oldProp) {
        //No Code to handle
    }
    getModuleName() {
        return 'draggable';
    }
    isDragStarted(change) {
        if (change) {
            isDraggedObject.isDragged = !isDraggedObject.isDragged;
        }
        return isDraggedObject.isDragged;
    }
    setDragArea() {
        let eleWidthBound;
        let eleHeightBound;
        let top = 0;
        let left = 0;
        let ele;
        let type = typeof this.dragArea;
        if (type === 'string') {
            ele = select(this.dragArea);
        }
        else {
            ele = this.dragArea;
        }
        if (ele) {
            let elementArea = ele.getBoundingClientRect();
            eleWidthBound = ele.scrollWidth ? ele.scrollWidth : elementArea.right - elementArea.left;
            eleHeightBound = ele.scrollHeight ? ele.scrollHeight : elementArea.bottom - elementArea.top;
            let keys = ['Top', 'Left', 'Bottom', 'Right'];
            let styles = getComputedStyle(ele);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let tborder = styles['border' + key + 'Width'];
                let tpadding = styles['padding' + key];
                let lowerKey = key.toLowerCase();
                this.borderWidth[lowerKey] = isNaN(parseFloat(tborder)) ? 0 : parseFloat(tborder);
                this.padding[lowerKey] = isNaN(parseFloat(tpadding)) ? 0 : parseFloat(tpadding);
            }
            top = elementArea.top;
            left = elementArea.left;
            this.dragLimit.left = left + this.borderWidth.left + this.padding.left;
            this.dragLimit.top = ele.offsetTop + this.borderWidth.top + this.padding.top;
            this.dragLimit.right = left + eleWidthBound - (this.borderWidth.right + this.padding.right);
            this.dragLimit.bottom = top + eleHeightBound - (this.borderWidth.bottom + this.padding.bottom);
        }
    }
    getProperTargetElement(evt) {
        let intCoord = this.getCoordinates(evt);
        let ele;
        let prevStyle = this.helperElement.style.pointerEvents || '';
        if (compareElementParent(evt.target, this.helperElement) || evt.type.indexOf('touch') !== -1) {
            this.helperElement.style.pointerEvents = 'none';
            ele = document.elementFromPoint(intCoord.clientX, intCoord.clientY);
            this.helperElement.style.pointerEvents = prevStyle;
        }
        else {
            ele = evt.target;
        }
        return ele;
    }
    getMousePosition(evt, isdragscroll) {
        /* tslint:disable no-any */
        let dragEle = evt.srcElement !== undefined ? evt.srcElement : evt.target;
        let intCoord = this.getCoordinates(evt);
        let pageX;
        let pageY;
        let isOffsetParent = isNullOrUndefined(dragEle.offsetParent);
        /* istanbul ignore next */
        if (isdragscroll) {
            pageX = this.clone ? intCoord.pageX :
                (intCoord.pageX + (isOffsetParent ? 0 : dragEle.offsetParent.scrollLeft)) - this.relativeXPosition;
            pageY = this.clone ? intCoord.pageY :
                (intCoord.pageY + (isOffsetParent ? 0 : dragEle.offsetParent.scrollTop)) - this.relativeYPosition;
        }
        else {
            pageX = this.clone ? intCoord.pageX : (intCoord.pageX + window.pageXOffset) - this.relativeXPosition;
            pageY = this.clone ? intCoord.pageY : (intCoord.pageY + window.pageYOffset) - this.relativeYPosition;
        }
        return {
            left: pageX - (this.margin.left + this.cursorAt.left),
            top: pageY - (this.margin.top + this.cursorAt.top)
        };
    }
    getCoordinates(evt) {
        if (evt.type.indexOf('touch') > -1) {
            return evt.changedTouches[0];
        }
        return evt;
    }
    getHelperElement(evt) {
        let element;
        if (this.clone) {
            if (this.helper) {
                element = this.helper({ sender: evt, element: this.target });
            }
            else {
                element = createElement('div', { className: 'e-drag-helper e-block-touch', innerHTML: 'Draggable' });
                document.body.appendChild(element);
            }
        }
        else {
            element = this.element;
        }
        return element;
    }
    setGlobalDroppables(reset, drag, helper) {
        this.droppables[this.scope] = reset ? null : {
            draggable: drag,
            helper: helper,
            draggedElement: this.element
        };
    }
    checkTargetElement(evt) {
        let target = this.getProperTargetElement(evt);
        let dropIns = this.getDropInstance(target);
        if (!dropIns && target && !isNullOrUndefined(target.parentNode)) {
            let parent = closest(target.parentNode, '.e-droppable') || target.parentElement;
            if (parent) {
                dropIns = this.getDropInstance(parent);
            }
        }
        return { target: target, instance: dropIns };
    }
    getDropInstance(ele) {
        let name = 'getModuleName';
        let drop;
        let eleInst = ele && ele.ej2_instances;
        if (eleInst) {
            for (let inst of eleInst) {
                if (inst[name]() === 'droppable') {
                    drop = inst;
                    break;
                }
            }
        }
        return drop;
    }
    destroy() {
        this.toggleEvents(true);
        super.destroy();
    }
};
__decorate$2([
    Complex({}, Position)
], Draggable.prototype, "cursorAt", void 0);
__decorate$2([
    Property(true)
], Draggable.prototype, "clone", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "dragArea", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "isDragScroll", void 0);
__decorate$2([
    Event$1()
], Draggable.prototype, "drag", void 0);
__decorate$2([
    Event$1()
], Draggable.prototype, "dragStart", void 0);
__decorate$2([
    Event$1()
], Draggable.prototype, "dragStop", void 0);
__decorate$2([
    Property(1)
], Draggable.prototype, "distance", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "handle", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "abort", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "helper", void 0);
__decorate$2([
    Property('default')
], Draggable.prototype, "scope", void 0);
__decorate$2([
    Property('')
], Draggable.prototype, "dragTarget", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "axis", void 0);
__decorate$2([
    Property()
], Draggable.prototype, "queryPositionInfo", void 0);
__decorate$2([
    Property(false)
], Draggable.prototype, "enableTailMode", void 0);
__decorate$2([
    Property(false)
], Draggable.prototype, "skipDistanceCheck", void 0);
__decorate$2([
    Property(true)
], Draggable.prototype, "preventDefault", void 0);
__decorate$2([
    Property(false)
], Draggable.prototype, "enableAutoScroll", void 0);
__decorate$2([
    Property(false)
], Draggable.prototype, "enableTapHold", void 0);
__decorate$2([
    Property(750)
], Draggable.prototype, "tapHoldThreshold", void 0);
Draggable = Draggable_1 = __decorate$2([
    NotifyPropertyChanges
], Draggable);

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Droppable Module provides support to enable droppable functionality in Dom Elements.
 * ```html
 * <div id='drop'>Droppable</div>
 * <script>
 * let ele:HTMLElement = document.getElementById('drop');
 * var drag:Droppable = new Droppable(ele,{
 *     accept:'.drop',
 *     drop: function(e) {
 *      //drop handler code.
 *     }
 * });
 * </script>
 * ```
 */
let Droppable = class Droppable extends Base {
    constructor(element, options) {
        super(options, element);
        this.mouseOver = false;
        this.dragData = {};
        this.dragStopCalled = false;
        this.bind();
    }
    bind() {
        this.wireEvents();
    }
    wireEvents() {
        EventHandler.add(this.element, Browser.touchEndEvent, this.intDrop, this);
    }
    // triggers when property changed
    onPropertyChanged(newProp, oldProp) {
        //No Code to handle
    }
    getModuleName() {
        return 'droppable';
    }
    intOver(event, element) {
        if (!this.mouseOver) {
            let drag = this.dragData[this.scope];
            this.trigger('over', { event: event, target: element, dragData: drag });
            this.mouseOver = true;
        }
    }
    intOut(event, element) {
        if (this.mouseOver) {
            this.trigger('out', { evt: event, target: element });
            this.mouseOver = false;
        }
    }
    intDrop(evt, element) {
        if (!this.dragStopCalled) {
            return;
        }
        else {
            this.dragStopCalled = false;
        }
        let accept = true;
        let drag = this.dragData[this.scope];
        let isDrag = drag ? (drag.helper && isVisible(drag.helper)) : false;
        let area;
        if (isDrag) {
            area = this.isDropArea(evt, drag.helper, element);
            if (this.accept) {
                accept = matches(drag.helper, this.accept);
            }
        }
        if (isDrag && this.drop && area.canDrop && accept) {
            this.trigger('drop', { event: evt, target: area.target, droppedElement: drag.helper, dragData: drag });
        }
        this.mouseOver = false;
    }
    isDropArea(evt, helper, element) {
        let area = { canDrop: true, target: element || evt.target };
        let isTouch = evt.type === 'touchend';
        if (isTouch || area.target === helper) {
            helper.style.display = 'none';
            let coord = isTouch ? (evt.changedTouches[0]) : evt;
            let ele = document.elementFromPoint(coord.clientX, coord.clientY);
            area.canDrop = false;
            area.canDrop = compareElementParent(ele, this.element);
            if (area.canDrop) {
                area.target = ele;
            }
            helper.style.display = '';
        }
        return area;
    }
    destroy() {
        EventHandler.remove(this.element, Browser.touchEndEvent, this.intDrop);
        super.destroy();
    }
};
__decorate$3([
    Property()
], Droppable.prototype, "accept", void 0);
__decorate$3([
    Property('default')
], Droppable.prototype, "scope", void 0);
__decorate$3([
    Event$1()
], Droppable.prototype, "drop", void 0);
__decorate$3([
    Event$1()
], Droppable.prototype, "over", void 0);
__decorate$3([
    Event$1()
], Droppable.prototype, "out", void 0);
Droppable = __decorate$3([
    NotifyPropertyChanges
], Droppable);

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var KeyboardEvents_1;
let keyCode = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'control': 17,
    'alt': 18,
    'pause': 19,
    'capslock': 20,
    'space': 32,
    'escape': 27,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'leftarrow': 37,
    'uparrow': 38,
    'rightarrow': 39,
    'downarrow': 40,
    'insert': 45,
    'delete': 46,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'semicolon': 186,
    'plus': 187,
    'comma': 188,
    'minus': 189,
    'dot': 190,
    'forwardslash': 191,
    'graveaccent': 192,
    'openbracket': 219,
    'backslash': 220,
    'closebracket': 221,
    'singlequote': 222
};
/**
 * KeyboardEvents class enables you to bind key action desired key combinations for ex., Ctrl+A, Delete, Alt+Space etc.
 * ```html
 * <div id='testEle'>  </div>;
 * <script>
 *   let node: HTMLElement = document.querySelector('#testEle');
 *   let kbInstance = new KeyboardEvents({
 *       element: node,
 *       keyConfigs:{ selectAll : 'ctrl+a' },
 *       keyAction: function (e:KeyboardEvent, action:string) {
 *           // handler function code
 *       }
 *   });
 * </script>
 * ```
 */
let KeyboardEvents = KeyboardEvents_1 = class KeyboardEvents extends Base {
    /**
     * Initializes the KeyboardEvents
     * @param {HTMLElement} element
     * @param {KeyboardEventsModel} options
     */
    constructor(element, options) {
        super(options, element);
        /**
         * To handle a key press event returns null
         */
        this.keyPressHandler = (e) => {
            let isAltKey = e.altKey;
            let isCtrlKey = e.ctrlKey;
            let isShiftKey = e.shiftKey;
            let curkeyCode = e.which;
            let keys = Object.keys(this.keyConfigs);
            for (let key of keys) {
                let configCollection = this.keyConfigs[key].split(',');
                for (let rconfig of configCollection) {
                    let rKeyObj = KeyboardEvents_1.getKeyConfigData(rconfig.trim());
                    if (isAltKey === rKeyObj.altKey && isCtrlKey === rKeyObj.ctrlKey &&
                        isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
                        e.action = key;
                        if (this.keyAction) {
                            this.keyAction(e);
                        }
                    }
                }
            }
        };
        this.bind();
    }
    /**
     * Unwire bound events and destroy the instance.
     * @return {void}
     */
    destroy() {
        this.unwireEvents();
        super.destroy();
    }
    /**
     * Function can be used to specify certain action if a property is changed
     * @param newProp
     * @param oldProp
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        // No code are needed
    }
    ;
    bind() {
        this.wireEvents();
    }
    /**
     * To get the module name, returns 'keyboard'.
     * @private
     */
    getModuleName() {
        return 'keyboard';
    }
    /**
     * Wiring event handlers to events
     */
    wireEvents() {
        this.element.addEventListener(this.eventName, this.keyPressHandler);
    }
    /**
     * Unwiring event handlers to events
     */
    unwireEvents() {
        this.element.removeEventListener(this.eventName, this.keyPressHandler);
    }
    /**
     * To get the key configuration data
     * @param {string} config - configuration data
     * returns {KeyData}
     */
    static getKeyConfigData(config) {
        if (config in this.configCache) {
            return this.configCache[config];
        }
        let keys = config.toLowerCase().split('+');
        let keyData = {
            altKey: (keys.indexOf('alt') !== -1 ? true : false),
            ctrlKey: (keys.indexOf('ctrl') !== -1 ? true : false),
            shiftKey: (keys.indexOf('shift') !== -1 ? true : false),
            keyCode: null
        };
        if (keys[keys.length - 1].length > 1 && !!Number(keys[keys.length - 1])) {
            keyData.keyCode = Number(keys[keys.length - 1]);
        }
        else {
            keyData.keyCode = KeyboardEvents_1.getKeyCode(keys[keys.length - 1]);
        }
        KeyboardEvents_1.configCache[config] = keyData;
        return keyData;
    }
    // Return the keycode value as string 
    static getKeyCode(keyVal) {
        return keyCode[keyVal] || keyVal.toUpperCase().charCodeAt(0);
    }
};
KeyboardEvents.configCache = {};
__decorate$4([
    Property({})
], KeyboardEvents.prototype, "keyConfigs", void 0);
__decorate$4([
    Property('keyup')
], KeyboardEvents.prototype, "eventName", void 0);
__decorate$4([
    Event$1()
], KeyboardEvents.prototype, "keyAction", void 0);
KeyboardEvents = KeyboardEvents_1 = __decorate$4([
    NotifyPropertyChanges
], KeyboardEvents);

/**
 * L10n modules provides localized text for different culture.
 * ```typescript
 * import {setCulture} from '@syncfusion/ts-base-library';
 * //load global locale object common for all components.
 * L10n.load({
 *    'fr-BE': {
 *       'button': {
 *            'check': 'vérifié'
 *        }
 *    }
 * });
 * //set globale default locale culture.
 * setCulture('fr-BE');
 * let instance: L10n = new L10n('button', {
 *    check: 'checked'
 * });
 * //Get locale text for current property.
 * instance.getConstant('check');
 * //Change locale culture in a component.
 * instance.setLocale('en-US');
 * ```
 */
class L10n {
    /**
     * Constructor
     */
    constructor(controlName, localeStrings, locale) {
        this.controlName = controlName;
        this.localeStrings = localeStrings;
        this.setLocale(locale || defaultCulture);
    }
    /**
     * Sets the locale text
     * @param {string} locale
     * @returns {void}
     */
    setLocale(locale) {
        let intLocale = this.intGetControlConstant(L10n.locale, locale);
        this.currentLocale = intLocale || this.localeStrings;
    }
    /**
     * Sets the global locale for all components.
     * @param {Object} localeObject - specifies the localeObject to be set as global locale.
     */
    static load(localeObject) {
        this.locale = extend(this.locale, localeObject, {}, true);
    }
    /**
     * Returns current locale text for the property based on the culture name and control name.
     * @param {string} propertyName - specifies the property for which localize text to be returned.
     * @return string
     */
    getConstant(prop) {
        // Removed conditional operator because this method does not return correct value when passing 0 as value in localization
        if (!isNullOrUndefined(this.currentLocale[prop])) {
            return this.currentLocale[prop];
        }
        else {
            return this.localeStrings[prop] || '';
        }
    }
    /**
     * Returns the control constant object for current object and the locale specified.
     * @param {Object} curObject
     * @param {string} locale
     * @returns {Object}
     */
    intGetControlConstant(curObject, locale) {
        if ((curObject)[locale]) {
            return (curObject)[locale][this.controlName];
        }
        return null;
    }
}
L10n.locale = {};

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * SwipeSettings is a framework module that provides support to handle swipe event like swipe up, swipe right, etc..,
 */
class SwipeSettings extends ChildProperty {
}
__decorate$5([
    Property(50)
], SwipeSettings.prototype, "swipeThresholdDistance", void 0);
const swipeRegex = /(Up|Down)/;
/**
 * Touch class provides support to handle the touch event like tap, double tap, tap hold, etc..,
 * ```typescript
 *    let node: HTMLElement;
 * let touchObj: Touch = new Touch({
 *    element: node,
 *    tap: function (e) {
 *        // tap handler function code
 *    }
 *    tapHold: function (e) {
 *        // tap hold handler function code
 *    }
 *    scroll: function (e) {
 *        // scroll handler function code
 *    }
 *    swipe: function (e) {
 *        // swipe handler function code
 *    }
 * });
 * ```
 */
let Touch = class Touch extends Base {
    /* End-Properties */
    constructor(element, options) {
        super(options, element);
        this.touchAction = true;
        this.tapCount = 0;
        this.startEvent = (evt) => {
            if (this.touchAction === true) {
                let point = (evt.changedTouches ? evt.changedTouches[0] : evt);
                if (evt.changedTouches !== undefined) {
                    this.touchAction = false;
                }
                this.isTouchMoved = false;
                this.movedDirection = '';
                this.startPoint = this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
                this.startEventData = point;
                this.hScrollLocked = this.vScrollLocked = false;
                this.tStampStart = Date.now();
                this.timeOutTapHold = setTimeout(() => { this.tapHoldEvent(evt); }, this.tapHoldThreshold);
                EventHandler.add(this.element, Browser.touchMoveEvent, this.moveEvent, this);
                EventHandler.add(this.element, Browser.touchEndEvent, this.endEvent, this);
                EventHandler.add(this.element, Browser.touchCancelEvent, this.cancelEvent, this);
            }
        };
        this.moveEvent = (evt) => {
            let point = evt.changedTouches ? evt.changedTouches[0] : evt;
            this.movedPoint = point;
            this.isTouchMoved = !(point.clientX === this.startPoint.clientX && point.clientY === this.startPoint.clientY);
            let eScrollArgs = {};
            if (this.isTouchMoved) {
                clearTimeout(this.timeOutTapHold);
                this.calcScrollPoints(evt);
                let scrollArg = {
                    startEvents: this.startEventData,
                    originalEvent: evt, startX: this.startPoint.clientX,
                    startY: this.startPoint.clientY, distanceX: this.distanceX,
                    distanceY: this.distanceY, scrollDirection: this.scrollDirection,
                    velocity: this.getVelocity(point)
                };
                eScrollArgs = extend(eScrollArgs, {}, scrollArg);
                this.trigger('scroll', eScrollArgs);
                this.lastMovedPoint = { clientX: point.clientX, clientY: point.clientY };
            }
        };
        this.cancelEvent = (evt) => {
            clearTimeout(this.timeOutTapHold);
            clearTimeout(this.timeOutTap);
            this.tapCount = 0;
            this.swipeFn(evt);
            EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
        };
        this.endEvent = (evt) => {
            this.swipeFn(evt);
            if (!this.isTouchMoved) {
                if (typeof this.tap === 'function') {
                    this.trigger('tap', { originalEvent: evt, tapCount: ++this.tapCount });
                    this.timeOutTap = setTimeout(() => {
                        this.tapCount = 0;
                    }, this.tapThreshold);
                }
            }
            this.modeclear();
        };
        this.swipeFn = (evt) => {
            clearTimeout(this.timeOutTapHold);
            clearTimeout(this.timeOutTap);
            let point = evt;
            if (evt.changedTouches) {
                point = evt.changedTouches[0];
            }
            let diffX = point.clientX - this.startPoint.clientX;
            let diffY = point.clientY - this.startPoint.clientY;
            diffX = Math.floor(diffX < 0 ? -1 * diffX : diffX);
            diffY = Math.floor(diffY < 0 ? -1 * diffY : diffX);
            this.isTouchMoved = diffX > 1 || diffY > 1;
            this.endPoint = point;
            this.calcPoints(evt);
            let swipeArgs = {
                originalEvent: evt,
                startEvents: this.startEventData,
                startX: this.startPoint.clientX,
                startY: this.startPoint.clientY,
                distanceX: this.distanceX, distanceY: this.distanceY, swipeDirection: this.movedDirection,
                velocity: this.getVelocity(point)
            };
            if (this.isTouchMoved) {
                let eSwipeArgs;
                let tDistance = this.swipeSettings.swipeThresholdDistance;
                eSwipeArgs = extend(eSwipeArgs, this.defaultArgs, swipeArgs);
                let canTrigger = false;
                let ele = this.element;
                let scrollBool = this.isScrollable(ele);
                let moved = swipeRegex.test(this.movedDirection);
                if ((tDistance < this.distanceX && !moved) || (tDistance < this.distanceY && moved)) {
                    if (!scrollBool) {
                        canTrigger = true;
                    }
                    else {
                        canTrigger = this.checkSwipe(ele, moved);
                    }
                }
                if (canTrigger) {
                    this.trigger('swipe', eSwipeArgs);
                }
            }
            this.modeclear();
        };
        this.modeclear = () => {
            this.modeClear = setTimeout(() => {
                this.touchAction = true;
            }, (typeof this.tap !== 'function' ? 0 : 20));
            this.lastTapTime = new Date().getTime();
            EventHandler.remove(this.element, Browser.touchMoveEvent, this.moveEvent);
            EventHandler.remove(this.element, Browser.touchEndEvent, this.endEvent);
            EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
        };
        this.bind();
    }
    // triggers when property changed 
    /**
     * @private
     * @param newProp
     * @param oldProp
     */
    onPropertyChanged(newProp, oldProp) {
        //No Code to handle
    }
    bind() {
        this.wireEvents();
        if (Browser.isIE) {
            this.element.classList.add('e-block-touch');
        }
    }
    /**
     * To destroy the touch instance.
     * @return {void}
     */
    destroy() {
        this.unwireEvents();
        super.destroy();
    }
    // Need to changes the event binding once we updated the event handler.
    wireEvents() {
        EventHandler.add(this.element, Browser.touchStartEvent, this.startEvent, this);
    }
    unwireEvents() {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.startEvent);
    }
    /**
     * Returns module name as touch
     * @returns {string}
     * @private
     */
    getModuleName() {
        return 'touch';
    }
    /**
     * Returns if the HTML element is Scrollable.
     * @param {HTMLElement} element - HTML Element to check if Scrollable.
     * @returns {boolean}
     */
    isScrollable(element) {
        let eleStyle = getComputedStyle(element);
        let style = eleStyle.overflow + eleStyle.overflowX + eleStyle.overflowY;
        if ((/(auto|scroll)/).test(style)) {
            return true;
        }
        return false;
    }
    tapHoldEvent(evt) {
        this.tapCount = 0;
        this.touchAction = true;
        let eTapArgs;
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.moveEvent);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.endEvent);
        eTapArgs = { originalEvent: evt };
        this.trigger('tapHold', eTapArgs);
        EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
    }
    calcPoints(evt) {
        let point = evt.changedTouches ? evt.changedTouches[0] : evt;
        this.defaultArgs = { originalEvent: evt };
        this.distanceX = Math.abs((Math.abs(point.clientX) - Math.abs(this.startPoint.clientX)));
        this.distanceY = Math.abs((Math.abs(point.clientY) - Math.abs(this.startPoint.clientY)));
        if (this.distanceX > this.distanceY) {
            this.movedDirection = (point.clientX > this.startPoint.clientX) ? 'Right' : 'Left';
        }
        else {
            this.movedDirection = (point.clientY < this.startPoint.clientY) ? 'Up' : 'Down';
        }
    }
    calcScrollPoints(evt) {
        let point = evt.changedTouches ? evt.changedTouches[0] : evt;
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
    }
    getVelocity(pnt) {
        let newX = pnt.clientX;
        let newY = pnt.clientY;
        let newT = Date.now();
        let xDist = newX - this.startPoint.clientX;
        let yDist = newY - this.startPoint.clientX;
        let interval = newT - this.tStampStart;
        return Math.sqrt(xDist * xDist + yDist * yDist) / interval;
    }
    // tslint:disable-next-line:no-any
    checkSwipe(ele, flag) {
        let keys = ['scroll', 'offset'];
        let temp = flag ? ['Height', 'Top'] : ['Width', 'Left'];
        if ((ele[keys[0] + temp[0]] <= ele[keys[1] + temp[0]])) {
            return true;
        }
        return (ele[keys[0] + temp[1]] === 0) ||
            (ele[keys[1] + temp[0]] + ele[keys[0] + temp[1]] >= ele[keys[0] + temp[0]]);
    }
};
__decorate$5([
    Event$1()
], Touch.prototype, "tap", void 0);
__decorate$5([
    Event$1()
], Touch.prototype, "tapHold", void 0);
__decorate$5([
    Event$1()
], Touch.prototype, "swipe", void 0);
__decorate$5([
    Event$1()
], Touch.prototype, "scroll", void 0);
__decorate$5([
    Property(350)
], Touch.prototype, "tapThreshold", void 0);
__decorate$5([
    Property(750)
], Touch.prototype, "tapHoldThreshold", void 0);
__decorate$5([
    Complex({}, SwipeSettings)
], Touch.prototype, "swipeSettings", void 0);
Touch = __decorate$5([
    NotifyPropertyChanges
], Touch);

/**
 * Template Engine
 */
const LINES = new RegExp('\\n|\\r|\\s\\s+', 'g');
const QUOTES = new RegExp(/'|"/g);
const IF_STMT = new RegExp('if ?\\(');
const ELSEIF_STMT = new RegExp('else if ?\\(');
const ELSE_STMT = new RegExp('else');
const FOR_STMT = new RegExp('for ?\\(');
const IF_OR_FOR = new RegExp('(\/if|\/for)');
const CALL_FUNCTION = new RegExp('\\((.*)\\)', '');
const NOT_NUMBER = new RegExp('^[0-9]+$', 'g');
const WORD = new RegExp('[\\w"\'.\\s+]+', 'g');
const DBL_QUOTED_STR = new RegExp('"(.*?)"', 'g');
const WORDIF = new RegExp('[\\w"\'@#$.\\s+]+', 'g');
let exp = new RegExp('\\${([^}]*)}', 'g');
// let cachedTemplate: Object = {};
let ARR_OBJ = /^\..*/gm;
let SINGLE_SLASH = /\\/gi;
let DOUBLE_SLASH = /\\\\/gi;
const WORDFUNC = new RegExp('[\\w"\'@#$.\\s+]+', 'g');
const WINDOWFUNC = /\window\./gm;
/**
 * The function to set regular expression for template expression string.
 * @param  {RegExp} value - Value expression.
 * @private
 */

// /**
//  * To render the template string from the given data.
//  * @param  {string} template - String Template.
//  * @param  {Object[]|JSON} data - DataSource for the template.
//  * @param  {Object} helper? - custom helper object.
//  */
// export function template(template: string, data: JSON, helper?: Object): string {
//     let hash: string = hashCode(template);
//     let tmpl: Function;
//     if (!cachedTemplate[hash]) {
//         tmpl = cachedTemplate[hash] = compile(template, helper);
//     } else {
//         tmpl = cachedTemplate[hash];
//     }
//     return tmpl(data);
// }
/**
 * Compile the template string into template function.
 * @param  {string} template - The template string which is going to convert.
 * @param  {Object} helper? - Helper functions as an object.
 * @private
 */
function compile$1(template, helper) {
    let argName = 'data';
    let evalExpResult = evalExp(template, argName, helper);
    let fnCode = `var str="${evalExpResult}"; return str;`;
    // tslint:disable-next-line:no-function-constructor-with-string-args
    let fn = new Function(argName, fnCode);
    return fn.bind(helper);
}
// function used to evaluate the function expression
function evalExp(str, nameSpace, helper) {
    let varCOunt = 0;
    /**
     * Variable containing Local Keys
     */
    let localKeys = [];
    let isClass = str.match(/class="([^\"]+|)\s{2}/g);
    let singleSpace = '';
    if (isClass) {
        isClass.forEach((value) => {
            singleSpace = value.replace(/\s\s+/g, ' ');
            str = str.replace(value, singleSpace);
        });
    }
    return str.replace(LINES, '').replace(DBL_QUOTED_STR, '\'$1\'').replace(exp, (match, cnt, offset, matchStr) => {
        const SPECIAL_CHAR = /\@|\#|\$/gm;
        let matches = cnt.match(CALL_FUNCTION);
        // matches to detect any function calls
        if (matches) {
            let rlStr = matches[1];
            if (ELSEIF_STMT.test(cnt)) {
                //handling else-if condition
                cnt = '";} ' + cnt.replace(matches[1], rlStr.replace(WORD, (str) => {
                    str = str.trim();
                    return addNameSpace(str, !(QUOTES.test(str)) && (localKeys.indexOf(str) === -1), nameSpace, localKeys);
                })) + '{ \n str = str + "';
            }
            else if (IF_STMT.test(cnt)) {
                //handling if condition
                cnt = '"; ' + cnt.replace(matches[1], rlStr.replace(WORDIF, (strs) => {
                    return HandleSpecialCharArrObj(strs, nameSpace, localKeys);
                })) + '{ \n str = str + "';
            }
            else if (FOR_STMT.test(cnt)) {
                //handling for condition
                let rlStr = matches[1].split(' of ');
                // replace for each into actual JavaScript
                cnt = '"; ' + cnt.replace(matches[1], (mtc) => {
                    localKeys.push(rlStr[0]);
                    localKeys.push(rlStr[0] + 'Index');
                    varCOunt = varCOunt + 1;
                    // tslint:disable-next-line
                    return 'var i' + varCOunt + '=0; i' + varCOunt + ' < ' + addNameSpace(rlStr[1], true, nameSpace, localKeys) + '.length; i' + varCOunt + '++';
                }) + '{ \n ' + rlStr[0] + '= ' + addNameSpace(rlStr[1], true, nameSpace, localKeys)
                    + '[i' + varCOunt + ']; \n var ' + rlStr[0] + 'Index=i' + varCOunt + '; \n str = str + "';
            }
            else {
                //helper function handling
                let fnStr = cnt.split('(');
                let fNameSpace = (helper && helper.hasOwnProperty(fnStr[0]) ? 'this.' : 'global');
                fNameSpace = (/\./.test(fnStr[0]) ? '' : fNameSpace);
                let ftArray = matches[1].split(',');
                if (matches[1].length !== 0 && !(/data/).test(ftArray[0]) && !(/window./).test(ftArray[0])) {
                    matches[1] = (fNameSpace === 'global' ? nameSpace + '.' + matches[1] : matches[1]);
                }
                let splRegexp = /\@|\$|\#/gm;
                let arrObj = /\]\./gm;
                if (WINDOWFUNC.test(cnt) && arrObj.test(cnt) || splRegexp.test(cnt)) {
                    let splArrRegexp = /\@|\$|\#|\]\./gm;
                    if (splArrRegexp.test(cnt)) {
                        // tslint:disable-next-line
                        cnt = '"+ ' + (fNameSpace === 'global' ? '' : fNameSpace) + cnt.replace(matches[1], rlStr.replace(WORDFUNC, (strs) => {
                            return HandleSpecialCharArrObj(strs, nameSpace, localKeys);
                        })) + '+ "';
                    }
                }
                else {
                    cnt = '" + ' + (fNameSpace === 'global' ? '' : fNameSpace) +
                        cnt.replace(rlStr, addNameSpace(matches[1].replace(/,( |)data.|,/gi, ',' + nameSpace + '.').replace(/,( |)data.window/gi, ',window'), (fNameSpace === 'global' ? false : true), nameSpace, localKeys)) +
                        '+"';
                }
            }
        }
        else if (ELSE_STMT.test(cnt)) {
            // handling else condition
            cnt = '"; ' + cnt.replace(ELSE_STMT, '} else { \n str = str + "');
        }
        else if (!!cnt.match(IF_OR_FOR)) {
            // close condition 
            cnt = cnt.replace(IF_OR_FOR, '"; \n } \n str = str + "');
        }
        else if (SPECIAL_CHAR.test(cnt)) {
            // template string with double slash with special character
            if (cnt.match(SINGLE_SLASH)) {
                cnt = SlashReplace(cnt);
            }
            cnt = '"+' + NameSpaceForspecialChar(cnt, (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '"]+"';
        }
        else {
            // template string with double slash
            if (cnt.match(SINGLE_SLASH)) {
                cnt = SlashReplace(cnt);
                cnt = '"+' + NameSpaceForspecialChar(cnt, (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '"]+"';
            }
            else {
                // evaluate normal expression
                cnt = '"+' + addNameSpace(cnt.replace(/\,/gi, '+' + nameSpace + '.'), (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '+"';
            }
        }
        return cnt;
    });
}
function addNameSpace(str, addNS, nameSpace, ignoreList) {
    return ((addNS && !(NOT_NUMBER.test(str)) && ignoreList.indexOf(str.split('.')[0]) === -1) ? nameSpace + '.' + str : str);
}
function NameSpaceArrObj(str, addNS, nameSpace, ignoreList) {
    let arrObjReg = /^\..*/gm;
    return ((addNS && !(NOT_NUMBER.test(str)) &&
        ignoreList.indexOf(str.split('.')[0]) === -1 && !(arrObjReg.test(str))) ? nameSpace + '.' + str : str);
}
// // Create hashCode for template string to storeCached function
// function hashCode(str: string): string {
//     return str.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0).toString();
// }
function NameSpaceForspecialChar(str, addNS, nameSpace, ignoreList) {
    return ((addNS && !(NOT_NUMBER.test(str)) && ignoreList.indexOf(str.split('.')[0]) === -1) ? nameSpace + '["' + str : str);
}
// tslint:disable-next-line
function SlashReplace(tempStr) {
    // tslint:disable-next-line
    let double = `\\\\`;
    if (tempStr.match(DOUBLE_SLASH)) {
        tempStr = tempStr;
    }
    else {
        tempStr = tempStr.replace(SINGLE_SLASH, double);
    }
    return tempStr;
}
function HandleSpecialCharArrObj(str, nameSpaceNew, keys) {
    str = str.trim();
    let windowFunc = /\window\./gm;
    if (!windowFunc.test(str)) {
        let quotes = /'|"/gm;
        let splRegexp = /\@|\$|\#/gm;
        if (splRegexp.test(str)) {
            str = NameSpaceForspecialChar(str, (keys.indexOf(str) === -1), nameSpaceNew, keys) + '"]';
        }
        if (ARR_OBJ.test(str)) {
            return NameSpaceArrObj(str, !(quotes.test(str)) && (keys.indexOf(str) === -1), nameSpaceNew, keys);
        }
        else {
            return addNameSpace(str, !(quotes.test(str)) && (keys.indexOf(str) === -1), nameSpaceNew, keys);
        }
    }
    else {
        return str;
    }
}

/**
 * Template Engine Bridge
 */
const HAS_ROW = /^[\n\r.]+\<tr|^\<tr/;
const HAS_SVG = /^[\n\r.]+\<svg|^\<path|^\<g/;
let blazorTemplates = {};
function getRandomId() {
    return '-' + Math.random().toString(36).substr(2, 5);
}
/**
 * Compile the template string into template function.
 * @param  {string} templateString - The template string which is going to convert.
 * @param  {Object} helper? - Helper functions as an object.
 * @private
 */
//tslint:disable-next-line
function compile$$1(templateString, helper) {
    let compiler = engineObj.compile(templateString, helper);
    //tslint:disable-next-line
    return (data, component, propName, templateId, isStringTemplate, index) => {
        let result = compiler(data, component, propName);
        let blazorTemplateId = 'BlazorTemplateId';
        if (isBlazor() && !isStringTemplate) {
            let randomId = getRandomId();
            let blazorId = templateId + randomId;
            if (!blazorTemplates[templateId]) {
                blazorTemplates[templateId] = [];
            }
            if (!isNullOrUndefined(index)) {
                let keys = Object.keys(blazorTemplates[templateId][index]);
                for (let key of keys) {
                    if (key !== blazorTemplateId && data[key]) {
                        blazorTemplates[templateId][index][key] = data[key];
                    }
                    if (key === blazorTemplateId) {
                        blazorId = blazorTemplates[templateId][index][key];
                    }
                }
            }
            else {
                data[blazorTemplateId] = blazorId;
                blazorTemplates[templateId].push(data);
            }
            // tslint:disable-next-line:no-any
            return propName === 'rowTemplate' ? [createElement('tr', { id: blazorId, className: 'e-blazor-template' })] :
                // tslint:disable-next-line:no-any
                [createElement('div', { id: blazorId, className: 'e-blazor-template' })];
        }
        if (typeof result === 'string') {
            if (HAS_SVG.test(result)) {
                let ele = createElement('svg', { innerHTML: result });
                return ele.childNodes;
            }
            else {
                let ele = createElement((HAS_ROW.test(result) ? 'table' : 'div'), { innerHTML: result });
                return ele.childNodes;
            }
        }
        else {
            return result;
        }
    };
}
function updateBlazorTemplate(templateId, templateName, comp, isEmpty, callBack) {
    if (isBlazor()) {
        let ejsIntrop = 'ejsInterop';
        window[ejsIntrop].updateTemplate(templateName, blazorTemplates[templateId], templateId, comp, callBack);
        if (isEmpty !== false) {
            blazorTemplates[templateId] = [];
        }
    }
}
function resetBlazorTemplate(templateId, templateName, index) {
    let templateDiv = document.getElementById(templateId);
    if (templateDiv) {
        // tslint:disable-next-line:no-any
        let innerTemplates = templateDiv.getElementsByClassName('blazor-inner-template');
        for (let i = 0; i < innerTemplates.length; i++) {
            let tempId = ' ';
            if (!isNullOrUndefined(index)) {
                tempId = innerTemplates[index].getAttribute('data-templateId');
            }
            else {
                tempId = innerTemplates[i].getAttribute('data-templateId');
            }
            let tempElement = document.getElementById(tempId);
            if (tempElement) {
                let length = tempElement.childNodes.length;
                for (let j = 0; j < length; j++) {
                    if (!isNullOrUndefined(index)) {
                        innerTemplates[index].appendChild(tempElement.childNodes[0]);
                        i = innerTemplates.length;
                    }
                    else {
                        innerTemplates[i].appendChild(tempElement.childNodes[0]);
                    }
                }
            }
        }
    }
}
/**
 * Set your custom template engine for template rendering.
 * @param  {ITemplateEngine} classObj - Class object for custom template.
 * @private
 */
function setTemplateEngine(classObj) {
    engineObj.compile = classObj.compile;
}
/**
 * Get current template engine for template rendering
 * @param  {ITemplateEngine} classObj - Class object for custom template.
 * @private
 */
function getTemplateEngine() {
    return engineObj.compile;
}
//Default Engine Class
class Engine {
    compile(templateString, helper = {}) {
        return compile$1(templateString, helper);
    }
}
let engineObj = { compile: new Engine().compile };

/**
 * SanitizeHtmlHelper for sanitize the value.
 */
const removeTags = [
    'script',
    'style',
    'iframe[src]',
    'link[href*="javascript:"]',
    'object[type="text/x-scriptlet"]',
    'object[data^="data:text/html;base64"]',
    'img[src^="data:text/html;base64"]',
    '[src^="javascript:"]',
    '[dynsrc^="javascript:"]',
    '[lowsrc^="javascript:"]',
    '[type^="application/x-shockwave-flash"]'
];
const removeAttrs = [
    { attribute: 'href', selector: '[href*="javascript:"]' },
    { attribute: 'background', selector: '[background^="javascript:"]' },
    { attribute: 'style', selector: '[style*="javascript:"]' },
    { attribute: 'style', selector: '[style*="expression("]' },
    { attribute: 'href', selector: 'a[href^="data:text/html;base64"]' }
];
const jsEvents = ['onchange',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onkeydown',
    'onload',
    'onerror',
    'onblur',
    'onfocus',
    'onbeforeload',
    'onbeforeunload',
    'onkeyup',
    'onsubmit',
    'onafterprint',
    'onbeforeonload',
    'onbeforeprint',
    'onblur',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
    'oncontextmenu',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onerror',
    'onerror',
    'onfocus',
    'onformchange',
    'onforminput',
    'onhaschange',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmessage',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onoffline',
    'onoine',
    'ononline',
    'onpagehide',
    'onpageshow',
    'onpause',
    'onplay',
    'onplaying',
    'onpopstate',
    'onprogress',
    'onratechange',
    'onreadystatechange',
    'onredo',
    'onresize',
    'onscroll',
    'onseeked',
    'onseeking',
    'onselect',
    'onstalled',
    'onstorage',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'onundo',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onmouseenter',
    'onmouseleave',
    'onmousewheel',
    'onstart',
    'onpropertychange'
];
class SanitizeHtmlHelper {
    static beforeSanitize() {
        return {
            selectors: {
                tags: removeTags,
                attributes: removeAttrs
            }
        };
    }
    ;
    static sanitize(value) {
        let item = this.beforeSanitize();
        let output = this.serializeValue(item, value);
        return output;
    }
    static serializeValue(item, value) {
        this.removeAttrs = item.selectors.attributes;
        this.removeTags = item.selectors.tags;
        this.wrapElement = document.createElement('div');
        this.wrapElement.innerHTML = value;
        this.removeXssTags();
        this.removeJsEvents();
        this.removeXssAttrs();
        return this.wrapElement.innerHTML;
    }
    static removeXssTags() {
        let elements = this.wrapElement.querySelectorAll(this.removeTags.join(','));
        if (elements.length > 0) {
            elements.forEach((element) => {
                detach(element);
            });
        }
        else {
            return;
        }
    }
    static removeJsEvents() {
        let elements = this.wrapElement.querySelectorAll('[' + jsEvents.join('],[') + ']');
        if (elements.length > 0) {
            elements.forEach((element) => {
                jsEvents.forEach((attr) => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
            });
        }
        else {
            return;
        }
    }
    static removeXssAttrs() {
        this.removeAttrs.forEach((item, index) => {
            let elements = this.wrapElement.querySelectorAll(item.selector);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    element.removeAttribute(item.attribute);
                });
            }
        });
    }
}

/**
 * Base modules
 */

export { blazorCultureFormats, IntlBase, Ajax, Animation, rippleEffect, isRippleEnabled, enableRipple, Base, getComponent, removeChildInstance, Browser, Component, ChildProperty, Position, Draggable, Droppable, EventHandler, onIntlChange, rightToLeft, cldrData, defaultCulture, defaultCurrencyCode, Internationalization, setCulture, setCurrencyCode, loadCldr, enableRtl, getNumericObject, getNumberDependable, getDefaultDateObject, KeyboardEvents, L10n, ModuleLoader, Property, Complex, ComplexFactory, Collection, CollectionFactory, Event$1 as Event, NotifyPropertyChanges, CreateBuilder, SwipeSettings, Touch, HijriParser, blazorTemplates, getRandomId, compile$$1 as compile, updateBlazorTemplate, resetBlazorTemplate, setTemplateEngine, getTemplateEngine, disableBlazorMode, createInstance, setImmediate, getValue, setValue, deleteObject, isObject, getEnumValue, merge, extend, isNullOrUndefined, isUndefined, getUniqueID, debounce, queryParams, isObjectArray, compareElementParent, throwError, print, formatUnit, enableBlazorMode, isBlazor, getElement, getInstance, addInstance, uniqueID, createElement, addClass, removeClass, isVisible, prepend, append, detach, remove, attributes, select, selectAll, closest, siblings, getAttributeOrDefault, setStyleAttribute, classList, matches, Observer, SanitizeHtmlHelper };
//# sourceMappingURL=ej2-base.es2015.js.map
