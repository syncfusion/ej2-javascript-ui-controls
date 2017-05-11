this["ej"] = this["ej"] || {}; this["ej"]["gridModule"] =
webpackJsonpej__name_Module([0],[
/* 0 */
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
/* 1 */,
/* 2 */
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
/* 3 */
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
/* 4 */,
/* 5 */,
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, column_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function doesImplementInterface(target, checkFor) {
        return target.prototype && checkFor in target.prototype;
    }
    exports.doesImplementInterface = doesImplementInterface;
    function valueAccessor(field, data, column) {
        field = util_1.isNullOrUndefined(field) ? '' : field;
        return util_1.getValue(field, data);
    }
    exports.valueAccessor = valueAccessor;
    function getUpdateUsingRaf(updateFunction, callBack) {
        requestAnimationFrame(function () {
            try {
                callBack(null, updateFunction());
            }
            catch (e) {
                callBack(e);
            }
        });
    }
    exports.getUpdateUsingRaf = getUpdateUsingRaf;
    function iterateArrayOrObject(collection, predicate) {
        var result = [];
        for (var i = 0, len = collection.length; i < len; i++) {
            var pred = predicate(collection[i], i);
            if (!util_1.isNullOrUndefined(pred)) {
                result.push(pred);
            }
        }
        return result;
    }
    exports.iterateArrayOrObject = iterateArrayOrObject;
    function setStyleAndAttributes(node, customAttributes) {
        var copyAttr = {};
        var literals = ['style', 'class'];
        util_1.extend(copyAttr, customAttributes, {});
        if ('style' in copyAttr) {
            dom_1.setStyleAttribute(node, copyAttr[literals[0]]);
            delete copyAttr[literals[0]];
        }
        if ('class' in copyAttr) {
            dom_1.addClass([node], copyAttr[literals[1]]);
            delete copyAttr[literals[1]];
        }
        dom_1.attributes(node, copyAttr);
    }
    exports.setStyleAndAttributes = setStyleAndAttributes;
    function extend(copied, first, second, exclude) {
        var moved = util_1.extend(copied, first, second);
        Object.keys(moved).forEach(function (value, index) {
            if (exclude.indexOf(value) !== -1) {
                delete moved[value];
            }
        });
        return moved;
    }
    exports.extend = extend;
    function prepareColumns(columns) {
        for (var c = 0, len = columns.length; c < len; c++) {
            var column = void 0;
            if (typeof columns[c] === 'string') {
                column = new column_1.Column({ field: columns[c] });
            }
            else if (!(columns[c] instanceof column_1.Column)) {
                if (!columns[c].columns) {
                    column = new column_1.Column(columns[c]);
                }
                else {
                    column = new column_1.Column(columns[c]);
                    columns[c].columns = prepareColumns(columns[c].columns);
                }
            }
            else {
                column = columns[c];
            }
            column.headerText = util_1.isNullOrUndefined(column.headerText) ? column.field || '' : column.headerText;
            column.valueAccessor = column.valueAccessor || valueAccessor;
            if (util_1.isNullOrUndefined(column.visible)) {
                column.visible = true;
            }
            columns[c] = column;
        }
        return columns;
    }
    exports.prepareColumns = prepareColumns;
    function setCssInGridPopUp(popUp, e, className) {
        var popUpSpan = popUp.querySelector('span');
        var position = popUp.parentElement.getBoundingClientRect();
        var targetPosition = e.target.getBoundingClientRect();
        var isBottomTail;
        popUpSpan.className = className;
        popUp.style.display = '';
        isBottomTail = (util_1.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
            e.clientY) > popUp.offsetHeight + 10;
        popUp.style.top = targetPosition.top - position.top +
            (isBottomTail ? -(popUp.offsetHeight + 10) : popUp.offsetHeight + 10) + 'px';
        popUp.style.left = getPopupLeftPosition(popUp, e, targetPosition, position.left) + 'px';
        if (isBottomTail) {
            popUp.querySelector('.e-downtail').style.display = '';
            popUp.querySelector('.e-uptail').style.display = 'none';
        }
        else {
            popUp.querySelector('.e-downtail').style.display = 'none';
            popUp.querySelector('.e-uptail').style.display = '';
        }
    }
    exports.setCssInGridPopUp = setCssInGridPopUp;
    function getPopupLeftPosition(popup, e, targetPosition, left) {
        var width = popup.offsetWidth / 2;
        var x = getPosition(e).x;
        if (x - targetPosition.left < width) {
            return targetPosition.left - left;
        }
        else if (targetPosition.right - x < width) {
            return targetPosition.right - left - width * 2;
        }
        else {
            return x - left - width;
        }
    }
    function getActualProperties(obj) {
        if (obj instanceof ej2_base_1.ChildProperty) {
            return util_1.getValue('properties', obj);
        }
        else {
            return obj;
        }
    }
    exports.getActualProperties = getActualProperties;
    function parentsUntil(elem, selector, isID) {
        var parent = elem;
        while (parent) {
            if (isID ? parent.id === selector : parent.classList.contains(selector)) {
                break;
            }
            parent = parent.parentElement;
        }
        return parent;
    }
    exports.parentsUntil = parentsUntil;
    function getElementIndex(element, elements) {
        var index = -1;
        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].isEqualNode(element)) {
                index = i;
                break;
            }
        }
        return index;
    }
    exports.getElementIndex = getElementIndex;
    function inArray(value, collection) {
        for (var i = 0, len = collection.length; i < len; i++) {
            if (collection[i] === value) {
                return i;
            }
        }
        return -1;
    }
    exports.inArray = inArray;
    function getActualPropFromColl(collection) {
        var coll = [];
        for (var i = 0, len = collection.length; i < len; i++) {
            if (collection[i].hasOwnProperty('properties')) {
                coll.push(collection[i].properties);
            }
            else {
                coll.push(collection[i]);
            }
        }
        return coll;
    }
    exports.getActualPropFromColl = getActualPropFromColl;
    function removeElement(target, selector) {
        var elements = [].slice.call(target.querySelectorAll(selector));
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentElement.removeChild(elements[i]);
        }
    }
    exports.removeElement = removeElement;
    function getPosition(e) {
        var position = {};
        position.x = (util_1.isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
            e.clientX);
        position.y = (util_1.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
            e.clientY);
        return position;
    }
    exports.getPosition = getPosition;
    var uid = 0;
    function getUid(prefix) {
        return prefix + uid++;
    }
    exports.getUid = getUid;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Predicate; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(14);

var Query = (function () {
    function Query(from) {
        this.subQuery = null;
        this.isChild = false;
        this.queries = [];
        this.key = '';
        this.fKey = '';
        if (typeof from === 'string') {
            this.fromTable = from;
        }
        else if (from && from instanceof Array) {
            this.lookups = from;
        }
        this.expands = [];
        this.sortedColumns = [];
        this.groupedColumns = [];
        this.subQuery = null;
        this.isChild = false;
        this.params = [];
        return this;
    }
    Query.prototype.setKey = function (field) {
        this.key = field;
        return this;
    };
    Query.prototype.using = function (dataManager) {
        this.dataManager = dataManager;
        return this;
    };
    Query.prototype.execute = function (dataManager, done, fail, always) {
        dataManager = dataManager || this.dataManager;
        if (dataManager) {
            return dataManager.executeQuery(this, done, fail, always);
        }
        return __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].throwError('Query - execute() : dataManager needs to be is set using "using" function or should be passed as argument');
    };
    Query.prototype.executeLocal = function (dataManager) {
        dataManager = dataManager || this.dataManager;
        if (dataManager) {
            return dataManager.executeLocal(this);
        }
        return __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].throwError('Query - executeLocal() : dataManager needs to be is set using "using" function or should be passed as argument');
    };
    Query.prototype.clone = function () {
        var cloned = new Query();
        cloned.queries = this.queries.slice(0);
        cloned.key = this.key;
        cloned.isChild = this.isChild;
        cloned.dataManager = this.dataManager;
        cloned.fromTable = this.fromTable;
        cloned.params = this.params.slice(0);
        cloned.expands = this.expands.slice(0);
        cloned.sortedColumns = this.sortedColumns.slice(0);
        cloned.groupedColumns = this.groupedColumns.slice(0);
        cloned.subQuerySelector = this.subQuerySelector;
        cloned.subQuery = this.subQuery;
        cloned.fKey = this.fKey;
        cloned.requiresCounts = this.requiresCounts;
        return cloned;
    };
    Query.prototype.from = function (tableName) {
        this.fromTable = tableName;
        return this;
    };
    Query.prototype.addParams = function (key, value) {
        if (typeof value === 'function') {
            this.params.push({ key: key, fn: value });
        }
        else {
            this.params.push({ key: key, value: value });
        }
        return this;
    };
    Query.prototype.expand = function (tables) {
        if (typeof tables === 'string') {
            this.expands = [].slice.call([tables], 0);
        }
        else {
            this.expands = tables.slice(0);
        }
        return this;
    };
    Query.prototype.where = function (fieldName, operator, value, ignoreCase) {
        operator = operator ? (operator).toLowerCase() : null;
        var predicate = null;
        if (typeof fieldName === 'string') {
            predicate = new Predicate(fieldName, operator, value, ignoreCase);
        }
        else if (fieldName instanceof Predicate) {
            predicate = fieldName;
        }
        this.queries.push({
            fn: 'onWhere',
            e: predicate
        });
        return this;
    };
    Query.prototype.search = function (searchKey, fieldNames, operator, ignoreCase) {
        if (typeof fieldNames === 'string') {
            fieldNames = [fieldNames];
        }
        operator = operator || 'contains';
        var comparer = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].fnOperators[operator];
        this.queries.push({
            fn: 'onSearch',
            e: {
                fieldNames: fieldNames,
                operator: operator,
                searchKey: searchKey,
                ignoreCase: ignoreCase,
                comparer: comparer
            }
        });
        return this;
    };
    Query.prototype.sortBy = function (fieldName, comparer, isFromGroup) {
        var order = 'ascending';
        var sorts;
        var temp;
        if (typeof fieldName === 'string' && __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].endsWith(fieldName.toLowerCase(), ' desc')) {
            fieldName = fieldName.replace(/ desc$/i, '');
            comparer = 'descending';
        }
        if (!comparer || typeof comparer === 'string') {
            order = comparer ? comparer.toLowerCase() : 'ascending';
            comparer = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].fnSort(comparer);
        }
        if (isFromGroup) {
            sorts = Query.filterQueries(this.queries, 'onSortBy');
            for (var i = 0; i < sorts.length; i++) {
                temp = sorts[i].e.fieldName;
                if (typeof temp === 'string') {
                    if (temp === fieldName) {
                        return this;
                    }
                }
                else if (temp instanceof Array) {
                    for (var j = 0; j < temp.length; j++) {
                        if (temp[j] === fieldName || fieldName.toLowerCase() === temp[j] + ' desc') {
                            return this;
                        }
                    }
                }
            }
        }
        this.queries.push({
            fn: 'onSortBy',
            e: {
                fieldName: fieldName,
                comparer: comparer,
                direction: order
            }
        });
        return this;
    };
    Query.prototype.sortByDesc = function (fieldName) {
        return this.sortBy(fieldName, 'descending');
    };
    Query.prototype.group = function (fieldName) {
        this.sortBy(fieldName, null, true);
        this.queries.push({
            fn: 'onGroup',
            e: {
                fieldName: fieldName
            }
        });
        return this;
    };
    Query.prototype.page = function (pageIndex, pageSize) {
        this.queries.push({
            fn: 'onPage',
            e: {
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        });
        return this;
    };
    Query.prototype.range = function (start, end) {
        this.queries.push({
            fn: 'onRange',
            e: {
                start: start,
                end: end
            }
        });
        return this;
    };
    Query.prototype.take = function (nos) {
        this.queries.push({
            fn: 'onTake',
            e: {
                nos: nos
            }
        });
        return this;
    };
    Query.prototype.skip = function (nos) {
        this.queries.push({
            fn: 'onSkip',
            e: { nos: nos }
        });
        return this;
    };
    Query.prototype.select = function (fieldNames) {
        if (typeof fieldNames === 'string') {
            fieldNames = [].slice.call([fieldNames], 0);
        }
        this.queries.push({
            fn: 'onSelect',
            e: { fieldNames: fieldNames }
        });
        return this;
    };
    Query.prototype.hierarchy = function (query, selectorFn) {
        this.subQuerySelector = selectorFn;
        this.subQuery = query;
        return this;
    };
    Query.prototype.foreignKey = function (key) {
        this.fKey = key;
        return this;
    };
    Query.prototype.requiresCount = function () {
        this.requiresCounts = true;
        return this;
    };
    Query.prototype.aggregate = function (type, field) {
        this.queries.push({
            fn: 'onAggregates',
            e: { field: field, type: type }
        });
        return this;
    };
    Query.filterQueries = function (queries, name) {
        return queries.filter(function (q) {
            return q.fn === name;
        });
    };
    Query.filterQueryLists = function (queries, singles) {
        var filtered = queries.filter(function (q) {
            return singles.indexOf(q.fn) !== -1;
        });
        var res = {};
        for (var i = 0; i < filtered.length; i++) {
            if (!res[filtered[i].fn]) {
                res[filtered[i].fn] = filtered[i].e;
            }
        }
        return res;
    };
    return Query;
}());

var Predicate = (function () {
    function Predicate(field, operator, value, ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = false; }
        this.isComplex = false;
        if (typeof field === 'string') {
            this.field = field;
            this.operator = operator.toLowerCase();
            this.value = value;
            this.ignoreCase = ignoreCase;
            this.isComplex = false;
            this.comparer = __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].fnOperators.processOperator(this.operator);
        }
        else if (field instanceof Predicate && value instanceof Predicate || value instanceof Array) {
            this.isComplex = true;
            this.condition = operator.toLowerCase();
            this.predicates = [field];
            if (value instanceof Array) {
                [].push.apply(this.predicates, value);
            }
            else {
                this.predicates.push(value);
            }
        }
        return this;
    }
    Predicate.and = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Predicate.combinePredicates([].slice.call(args, 0), 'and');
    };
    Predicate.prototype.and = function (field, operator, value, ignoreCase) {
        return Predicate.combine(this, field, operator, value, 'and', ignoreCase);
    };
    Predicate.or = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Predicate.combinePredicates([].slice.call(args, 0), 'or');
    };
    Predicate.prototype.or = function (field, operator, value, ignoreCase) {
        return Predicate.combine(this, field, operator, value, 'or', ignoreCase);
    };
    Predicate.fromJson = function (json) {
        if (json instanceof Array) {
            var res = [];
            for (var i = 0, len = json.length; i < len; i++) {
                res.push(this.fromJSONData(json[i]));
            }
            return res;
        }
        var pred = json;
        return this.fromJSONData(pred);
    };
    Predicate.prototype.validate = function (record) {
        var predicate = this.predicates ? this.predicates : [];
        var isAnd;
        var ret;
        if (!this.isComplex && this.comparer) {
            return this.comparer.call(this, __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].getObject(this.field, record), this.value, this.ignoreCase);
        }
        isAnd = this.condition === 'and';
        for (var i = 0; i < predicate.length; i++) {
            ret = predicate[i].validate(record);
            if (isAnd) {
                if (!ret) {
                    return false;
                }
            }
            else {
                if (ret) {
                    return true;
                }
            }
        }
        return isAnd;
    };
    Predicate.prototype.toJson = function () {
        var predicates;
        var p;
        if (this.isComplex) {
            predicates = [];
            p = this.predicates;
            for (var i = 0; i < p.length; i++) {
                predicates.push(p[i].toJson());
            }
        }
        return {
            isComplex: this.isComplex,
            field: this.field,
            operator: this.operator,
            value: this.value,
            ignoreCase: this.ignoreCase,
            condition: this.condition,
            predicates: predicates
        };
    };
    Predicate.combinePredicates = function (predicates, operator) {
        if (predicates.length === 1) {
            if (!(predicates[0] instanceof Array)) {
                return predicates[0];
            }
            predicates = predicates[0];
        }
        return new Predicate(predicates[0], operator, predicates.slice(1));
    };
    Predicate.combine = function (pred, field, operator, value, condition, ignoreCase) {
        if (field instanceof Predicate) {
            return Predicate[condition](pred, field);
        }
        if (typeof field === 'string') {
            return Predicate[condition](pred, new Predicate(field, operator, value, ignoreCase));
        }
        return __WEBPACK_IMPORTED_MODULE_0__util__["a" /* DataUtil */].throwError('Predicate - ' + condition + ' : invalid arguments');
    };
    Predicate.fromJSONData = function (json) {
        var preds = json.predicates || [];
        var len = preds.length;
        var predicates = [];
        var result;
        for (var i = 0; i < len; i++) {
            predicates.push(this.fromJSONData(preds[i]));
        }
        if (!json.isComplex) {
            result = new Predicate(json.field, json.operator, json.value, json.ignoreCase);
        }
        else {
            result = new Predicate(predicates[0], json.condition, predicates.slice(1));
        }
        return result;
    };
    return Predicate;
}());



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataUtil; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__manager__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__query__ = __webpack_require__(13);



var consts = { GroupGuid: '{271bbba0-1ee7}' };
var DataUtil = (function () {
    function DataUtil() {
    }
    DataUtil.getValue = function (value, inst) {
        if (typeof value === 'function') {
            return value.call(inst || {});
        }
        return value;
    };
    DataUtil.endsWith = function (input, substr) {
        return input.slice(-substr.length) === substr;
    };
    DataUtil.startsWith = function (input, start) {
        return input.slice(0, start.length) === start;
    };
    DataUtil.fnSort = function (order) {
        order = order ? order.toLowerCase() : 'ascending';
        if (order === 'ascending') {
            return this.fnAscending;
        }
        return this.fnDescending;
    };
    DataUtil.fnAscending = function (x, y) {
        if (y === null || y === undefined) {
            return -1;
        }
        if (typeof x === 'string') {
            return x.localeCompare(y);
        }
        if (x === null || x === undefined) {
            return 1;
        }
        return x - y;
    };
    DataUtil.fnDescending = function (x, y) {
        if (y === null || y === undefined) {
            return 1;
        }
        if (typeof x === 'string') {
            return x.localeCompare(y) * -1;
        }
        if (x === null || x === undefined) {
            return -1;
        }
        return y - x;
    };
    DataUtil.extractFields = function (obj, fields) {
        var newObj = {};
        if (fields.length === 1) {
            return this.getObject(fields[0], obj);
        }
        for (var i = 0; i < fields.length; i++) {
            newObj[fields[i].replace('.', '_')] = this.getObject(fields[i], obj);
        }
        return newObj;
    };
    DataUtil.select = function (jsonArray, fields) {
        var newData = [];
        for (var i = 0; i < jsonArray.length; i++) {
            newData.push(this.extractFields(jsonArray[i], fields));
        }
        return newData;
    };
    DataUtil.group = function (jsonArray, field, aggregates, level, groupDs) {
        level = level || 1;
        var jsonData = jsonArray;
        var guid = 'GroupGuid';
        if (jsonData.GroupGuid === consts[guid]) {
            var _loop_1 = function (j) {
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(groupDs)) {
                    var indx = -1;
                    var temp = groupDs.filter(function (e) { return e.key === jsonData[j].key; });
                    indx = groupDs.indexOf(temp[0]);
                    jsonData[j].items = this_1.group(jsonData[j].items, field, aggregates, jsonData.level + 1, groupDs[indx].items);
                    jsonData[j].count = groupDs[indx].count;
                }
                else {
                    jsonData[j].items = this_1.group(jsonData[j].items, field, aggregates, jsonData.level + 1);
                    jsonData[j].count = jsonData[j].items.length;
                }
            };
            var this_1 = this;
            for (var j = 0; j < jsonData.length; j++) {
                _loop_1(j);
            }
            jsonData.childLevels += 1;
            return jsonData;
        }
        var grouped = {};
        var groupedArray = [];
        groupedArray.GroupGuid = consts[guid];
        groupedArray.level = level;
        groupedArray.childLevels = 0;
        groupedArray.records = jsonData;
        var _loop_2 = function (i) {
            var val = this_2.getVal(jsonData, i, field);
            if (!grouped[val]) {
                grouped[val] = {
                    key: val,
                    count: 0,
                    items: [],
                    aggregates: {},
                    field: field
                };
                groupedArray.push(grouped[val]);
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(groupDs)) {
                    var tempObj = groupDs.filter(function (e) { return e.key === grouped[val].key; });
                    grouped[val].count = tempObj[0].count;
                }
            }
            grouped[val].count = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(groupDs) ? grouped[val].count : grouped[val].count += 1;
            grouped[val].items.push(jsonData[i]);
        };
        var this_2 = this;
        for (var i = 0; i < jsonData.length; i++) {
            _loop_2(i);
        }
        if (aggregates && aggregates.length) {
            var _loop_3 = function (i) {
                var res = {};
                var fn = void 0;
                var aggs = aggregates;
                for (var j = 0; j < aggregates.length; j++) {
                    fn = DataUtil.aggregates[aggregates[j].type];
                    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(groupDs)) {
                        var temp = groupDs.filter(function (e) { return e.key === groupedArray[i].key; });
                        if (fn) {
                            res[aggs[j].field + ' - ' + aggs[j].type] = fn(temp[0].items, aggs[j].field);
                        }
                    }
                    else {
                        if (fn) {
                            res[aggs[j].field + ' - ' + aggs[j].type] = fn(groupedArray[i].items, aggs[j].field);
                        }
                    }
                }
                groupedArray[i].aggregates = res;
            };
            for (var i = 0; i < groupedArray.length; i++) {
                _loop_3(i);
            }
        }
        return groupedArray;
    };
    DataUtil.buildHierarchy = function (fKey, from, source, lookup, pKey) {
        var i;
        var grp = {};
        var temp;
        if (lookup.result) {
            lookup = lookup.result;
        }
        if (lookup.GroupGuid) {
            this.throwError('DataManager: Do not have support Grouping in hierarchy');
        }
        for (i = 0; i < lookup.length; i++) {
            var fKeyData = this.getObject(fKey, lookup[i]);
            temp = grp[fKeyData] || (grp[fKeyData] = []);
            temp.push(lookup[i]);
        }
        for (i = 0; i < source.length; i++) {
            var fKeyData = this.getObject(pKey || fKey, source[i]);
            source[i][from] = grp[fKeyData];
        }
    };
    DataUtil.getFieldList = function (obj, fields, prefix) {
        if (prefix === undefined) {
            prefix = '';
        }
        if (fields === undefined || fields === null) {
            return this.getFieldList(obj, [], prefix);
        }
        var copyObj = obj;
        var keys = Object.keys(obj);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var prop = keys_1[_i];
            if (typeof copyObj[prop] === 'object' && !(copyObj[prop] instanceof Array)) {
                this.getFieldList(copyObj[prop], fields, prefix + prop + '.');
            }
            else {
                fields.push(prefix + prop);
            }
        }
        return fields;
    };
    DataUtil.getObject = function (nameSpace, from) {
        if (!nameSpace) {
            return from;
        }
        if (nameSpace.indexOf('.') === -1) {
            return from[nameSpace];
        }
        var value = from;
        var splits = nameSpace.split('.');
        for (var i = 0; i < splits.length; i++) {
            if (value == null) {
                break;
            }
            value = value[splits[i]];
        }
        return value;
    };
    DataUtil.sort = function (ds, field, comparer) {
        if (ds.length <= 1) {
            return ds;
        }
        var middle = parseInt((ds.length / 2).toString(), 10);
        var left = ds.slice(0, middle);
        var right = ds.slice(middle);
        left = this.sort(left, field, comparer);
        right = this.sort(right, field, comparer);
        return this.merge(left, right, field, comparer);
    };
    DataUtil.merge = function (left, right, fieldName, comparer) {
        var result = [];
        var current;
        while (left.length > 0 || right.length > 0) {
            if (left.length > 0 && right.length > 0) {
                if (comparer) {
                    current = comparer(this.getVal(left, 0, fieldName), this.getVal(right, 0, fieldName)) <= 0 ? left : right;
                }
                else {
                    current = left[0][fieldName] < left[0][fieldName] ? left : right;
                }
            }
            else {
                current = left.length > 0 ? left : right;
            }
            result.push(current.shift());
        }
        return result;
    };
    DataUtil.getVal = function (array, index, field) {
        return field ? this.getObject(field, array[index]) : array[index];
    };
    DataUtil.toLowerCase = function (val) {
        return val ? typeof val === 'string' ? val.toLowerCase() : val.toString() : (val === 0 || val === false) ? val.toString() : '';
    };
    DataUtil.callAdaptorFunction = function (adaptor, fnName, param1, param2) {
        if (fnName in adaptor) {
            var res = adaptor[fnName](param1, param2);
            if (!this.fnOperators.isnull(res)) {
                param1 = res;
            }
        }
        return param1;
    };
    DataUtil.isPlainObject = function (obj) {
        return (!!obj) && (obj.constructor === Object);
    };
    DataUtil.isCors = function () {
        var xhr = null;
        var request = 'XMLHttpRequest';
        try {
            xhr = new window[request]();
        }
        catch (e) {
        }
        return !!xhr && ('withCredentials' in xhr);
    };
    DataUtil.getGuid = function (prefix) {
        var hexs = '0123456789abcdef';
        var rand;
        return (prefix || '') + '00000000-0000-4000-0000-000000000000'.replace(/0/g, function (val, i) {
            if ('crypto' in window && 'getRandomValues' in crypto) {
                var arr = new Uint8Array(1);
                window.crypto.getRandomValues(arr);
                rand = arr[0] % 16 | 0;
            }
            else {
                rand = Math.random() * 16 | 0;
            }
            return hexs[i === 19 ? rand & 0x3 | 0x8 : rand];
        });
    };
    DataUtil.isNull = function (val) {
        return val === undefined || val === null;
    };
    DataUtil.getItemFromComparer = function (array, field, comparer) {
        var keyVal;
        var current;
        var key;
        var i = 0;
        var castRequired = typeof DataUtil.getVal(array, 0, field) === 'string';
        if (array.length) {
            while (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(keyVal) && i < array.length) {
                keyVal = DataUtil.getVal(array, i, field);
                key = array[i++];
            }
        }
        for (; i < array.length; i++) {
            current = DataUtil.getVal(array, i, field);
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(current)) {
                continue;
            }
            if (castRequired) {
                keyVal = +keyVal;
                current = +current;
            }
            if (comparer(keyVal, current) > 0) {
                keyVal = current;
                key = array[i];
            }
        }
        return key;
    };
    return DataUtil;
}());

DataUtil.serverTimezoneOffset = 0;
DataUtil.throwError = function (error) {
    try {
        throw new Error(error);
    }
    catch (e) {
        throw e.message + '\n' + e.stack;
    }
};
DataUtil.aggregates = {
    sum: function (ds, field) {
        var result = 0;
        var val;
        var castRequired = typeof DataUtil.getVal(ds, 0, field) !== 'number';
        for (var i = 0; i < ds.length; i++) {
            val = DataUtil.getVal(ds, i, field);
            if (!isNaN(val) && val !== null) {
                if (castRequired) {
                    val = +val;
                }
                result += val;
            }
        }
        return result;
    },
    average: function (ds, field) {
        return DataUtil.aggregates.sum(ds, field) / ds.length;
    },
    min: function (ds, field) {
        var comparer;
        if (typeof field === 'function') {
            comparer = field;
            field = null;
        }
        return DataUtil.getObject(field, DataUtil.getItemFromComparer(ds, field, comparer || DataUtil.fnAscending));
    },
    max: function (ds, field) {
        var comparer;
        if (typeof field === 'function') {
            comparer = field;
            field = null;
        }
        return DataUtil.getObject(field, DataUtil.getItemFromComparer(ds, field, comparer || DataUtil.fnDescending));
    },
    truecount: function (ds, field) {
        return new __WEBPACK_IMPORTED_MODULE_1__manager__["a" /* DataManager */](ds).executeLocal(new __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */]().where(field, 'equal', true, true)).length;
    },
    falsecount: function (ds, field) {
        return new __WEBPACK_IMPORTED_MODULE_1__manager__["a" /* DataManager */](ds).executeLocal(new __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */]().where(field, 'equal', false, true)).length;
    },
    count: function (ds, field) {
        return ds.length;
    }
};
DataUtil.operatorSymbols = {
    '<': 'lessthan',
    '>': 'greaterthan',
    '<=': 'lessthanorequal',
    '>=': 'greaterthanorequal',
    '==': 'equal',
    '!=': 'notequal',
    '*=': 'contains',
    '$=': 'endswith',
    '^=': 'startswith'
};
DataUtil.odBiOperator = {
    '<': ' lt ',
    '>': ' gt ',
    '<=': ' le ',
    '>=': ' ge ',
    '==': ' eq ',
    '!=': ' ne ',
    'lessthan': ' lt ',
    'lessthanorequal': ' le ',
    'greaterthan': ' gt ',
    'greaterthanorequal': ' ge ',
    'equal': ' eq ',
    'notequal': ' ne '
};
DataUtil.odUniOperator = {
    '$=': 'endswith',
    '^=': 'startswith',
    '*=': 'substringof',
    'endswith': 'endswith',
    'startswith': 'startswith',
    'contains': 'substringof'
};
DataUtil.fnOperators = {
    equal: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return DataUtil.toLowerCase(actual) === DataUtil.toLowerCase(expected);
        }
        return actual === expected;
    },
    notequal: function (actual, expected, ignoreCase) {
        return !DataUtil.fnOperators.equal(actual, expected, ignoreCase);
    },
    lessthan: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return DataUtil.toLowerCase(actual) < DataUtil.toLowerCase(expected);
        }
        return actual < expected;
    },
    greaterthan: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return DataUtil.toLowerCase(actual) > DataUtil.toLowerCase(expected);
        }
        return actual > expected;
    },
    lessthanorequal: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return DataUtil.toLowerCase(actual) <= DataUtil.toLowerCase(expected);
        }
        return actual <= expected;
    },
    greaterthanorequal: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return DataUtil.toLowerCase(actual) >= DataUtil.toLowerCase(expected);
        }
        return actual >= expected;
    },
    contains: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(actual) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(expected) &&
                DataUtil.toLowerCase(actual).indexOf(DataUtil.toLowerCase(expected)) !== -1;
        }
        return !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(actual) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(expected) &&
            actual.toString().indexOf(expected) !== -1;
    },
    notnull: function (actual) {
        return actual !== null;
    },
    isnull: function (actual) {
        return actual === null;
    },
    startswith: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return actual && expected && DataUtil.startsWith(actual.toLowerCase(), expected.toLowerCase());
        }
        return actual && expected && DataUtil.startsWith(actual, expected);
    },
    endswith: function (actual, expected, ignoreCase) {
        if (ignoreCase) {
            return actual && expected && DataUtil.endsWith(actual.toLowerCase(), expected.toLowerCase());
        }
        return actual && expected && DataUtil.endsWith(actual, expected);
    },
    processSymbols: function (operator) {
        var fnName = DataUtil.operatorSymbols[operator];
        if (fnName) {
            var fn = DataUtil.fnOperators[fnName];
            return fn;
        }
        return DataUtil.throwError('Query - Process Operator : Invalid operator');
    },
    processOperator: function (operator) {
        var fn = DataUtil.fnOperators[operator];
        if (fn) {
            return fn;
        }
        return DataUtil.fnOperators.processSymbols(operator);
    }
};
DataUtil.parse = {
    parseJson: function (jsonText) {
        if (typeof jsonText === 'string') {
            jsonText = JSON.parse(jsonText, DataUtil.parse.jsonReviver);
        }
        else if (jsonText instanceof Array) {
            DataUtil.parse.iterateAndReviveArray(jsonText);
        }
        else if (typeof jsonText === 'object') {
            DataUtil.parse.iterateAndReviveJson(jsonText);
        }
        return jsonText;
    },
    iterateAndReviveArray: function (array) {
        for (var i = 0; i < array.length; i++) {
            if (typeof array[i] === 'object') {
                DataUtil.parse.iterateAndReviveJson(array[i]);
            }
            else if (typeof array[i] === 'string' && !/^[\s]*\[|^[\s]*\{|\"/g.test(array[i])) {
                array[i] = DataUtil.parse.jsonReviver('', array[i]);
            }
            else {
                array[i] = DataUtil.parse.parseJson(array[i]);
            }
        }
    },
    iterateAndReviveJson: function (json) {
        var value;
        var keys = Object.keys(json);
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var prop = keys_2[_i];
            if (DataUtil.startsWith(prop, '__')) {
                continue;
            }
            value = json[prop];
            if (typeof value === 'object') {
                if (value instanceof Array) {
                    DataUtil.parse.iterateAndReviveArray(value);
                }
                else if (value) {
                    DataUtil.parse.iterateAndReviveJson(value);
                }
            }
            else {
                json[prop] = DataUtil.parse.jsonReviver(json[prop], value);
            }
        }
    },
    jsonReviver: function (field, value) {
        var dupValue = value;
        if (typeof value === 'string') {
            var ms = /^\/Date\(([+-]?[0-9]+)([+-][0-9]{4})?\)\/$/.exec(value);
            if (ms) {
                return DataUtil.parse.jsonReplacer({ value: new Date(parseInt(ms[1], 10)) }, false).value;
            }
            else if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
                var arr = dupValue.split(/[^0-9]/);
                value = DataUtil.parse.jsonReplacer({ value: new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10), parseInt(arr[3], 10), parseInt(arr[4], 10), parseInt(arr[5], 10)) }, false).value;
            }
        }
        return value;
    },
    isJson: function (jsonData) {
        if (typeof jsonData[0] === 'string') {
            return jsonData;
        }
        return DataUtil.parse.parseJson(jsonData);
    },
    isGuid: function (value) {
        var regex = /[A-Fa-f0-9]{8}(?:-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12}/i;
        var match = regex.exec(value);
        return match != null;
    },
    replacer: function (value) {
        if (DataUtil.isPlainObject(value)) {
            return DataUtil.parse.jsonReplacer(value);
        }
        if (value instanceof Array) {
            return DataUtil.parse.arrayReplacer(value);
        }
        if (value instanceof Date) {
            return DataUtil.parse.jsonReplacer({ val: value }).val;
        }
        return value;
    },
    jsonReplacer: function (val, stringify) {
        if (stringify === void 0) { stringify = true; }
        var value;
        var keys = Object.keys(val);
        for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
            var prop = keys_3[_i];
            value = val[prop];
            if (!(value instanceof Date)) {
                continue;
            }
            var d = value;
            var unixstamp = +d - (d.getTimezoneOffset() * 60000);
            val[prop] = new Date(unixstamp - (DataUtil.serverTimezoneOffset * 3600000));
            if (stringify) {
                val[prop] = val[prop].toJSON();
            }
        }
        return val;
    },
    arrayReplacer: function (val) {
        for (var i = 0; i < val.length; i++) {
            if (DataUtil.isPlainObject(val[i])) {
                val[i] = DataUtil.parse.jsonReplacer(val[i]);
            }
            else if (val[i] instanceof Date) {
                val[i] = DataUtil.parse.jsonReplacer({ date: val[i] }).date;
            }
        }
        return val;
    }
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.created = 'create';
    exports.destroyed = 'destroy';
    exports.load = 'load';
    exports.rowDataBound = 'rowDataBound';
    exports.queryCellInfo = 'queryCellInfo';
    exports.actionBegin = 'actionBegin';
    exports.actionComplete = 'actionComplete';
    exports.actionFailure = 'actionFailure';
    exports.dataBound = 'dataBound';
    exports.rowSelecting = 'rowSelecting';
    exports.rowSelected = 'rowSelected';
    exports.rowDeselecting = 'rowDeselecting';
    exports.rowDeselected = 'rowDeselected';
    exports.cellSelecting = 'cellSelecting';
    exports.cellSelected = 'cellSelected';
    exports.cellDeselecting = 'cellDeselecting';
    exports.cellDeselected = 'cellDeselected';
    exports.columnDragStart = 'columnDragStart';
    exports.columnDrag = 'columnDrag';
    exports.columnDrop = 'columnDrop';
    exports.rowDragStart = 'rowDragStart';
    exports.rowDrag = 'rowDrag';
    exports.rowDrop = 'rowDrop';
    exports.beforePrint = 'beforePrint';
    exports.printComplete = 'printComplete';
    exports.initialLoad = 'initial-load';
    exports.initialEnd = 'initial-end';
    exports.dataReady = 'data-ready';
    exports.contentReady = 'content-ready';
    exports.uiUpdate = 'ui-update';
    exports.inBoundModelChanged = 'inbound-model-changed';
    exports.modelChanged = 'model-changed';
    exports.colGroupRefresh = 'colgroup-refresh';
    exports.headerRefreshed = 'header-refreshed';
    exports.pageBegin = 'paging-begin';
    exports.pageComplete = 'paging-complete';
    exports.sortBegin = 'sorting-begin';
    exports.sortComplete = 'sorting-complete';
    exports.filterBegin = 'filtering-begin';
    exports.filterComplete = 'filtering-complete';
    exports.searchBegin = 'searching-begin';
    exports.searchComplete = 'searching-complete';
    exports.reorderBegin = 'reorder-begin';
    exports.reorderComplete = 'reorder-complete';
    exports.rowDragAndDropBegin = 'rowdraganddrop-begin';
    exports.rowDragAndDropComplete = 'rowdraganddrop-complete';
    exports.groupBegin = 'grouping-begin';
    exports.groupComplete = 'grouping-complete';
    exports.ungroupBegin = 'ungrouping-begin';
    exports.ungroupComplete = 'ungrouping-complete';
    exports.rowSelectionBegin = 'rowselecting';
    exports.rowSelectionComplete = 'rowselected';
    exports.columnSelectionBegin = 'columnselecting';
    exports.columnSelectionComplete = 'columnselected';
    exports.cellSelectionBegin = 'cellselecting';
    exports.cellSelectionComplete = 'cellselected';
    exports.keyPressed = 'key-pressed';
    exports.click = 'click';
    exports.destroy = 'destroy';
    exports.columnVisibilityChanged = 'column-visible-changed';
    exports.scroll = 'scroll';
    exports.columnWidthChanged = 'column-width-changed';
    exports.columnPositionChanged = 'column-position-changed';
    exports.rowDragAndDrop = 'row-drag-and-drop';
    exports.rowsAdded = 'rows-added';
    exports.rowsRemoved = 'rows-removed';
    exports.columnDragStop = 'column-drag-stop';
    exports.headerDrop = 'header-drop';
    exports.dataSourceModified = 'datasource-modified';
    exports.refreshComplete = 'refresh-complete';
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 16 */,
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Adaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return JsonAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return UrlAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ODataAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ODataV4Adaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return WebApiAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return WebMethodAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return RemoteSaveAdaptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return CacheAdaptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__query__ = __webpack_require__(13);
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



var Adaptor = (function () {
    function Adaptor(ds) {
        this.options = {
            from: 'table',
            requestType: 'json',
            sortBy: 'sorted',
            select: 'select',
            skip: 'skip',
            group: 'group',
            take: 'take',
            search: 'search',
            count: 'requiresCounts',
            where: 'where',
            aggregates: 'aggregates'
        };
        this.type = Adaptor;
        this.dataSource = ds;
        this.pvt = {};
    }
    Adaptor.prototype.processResponse = function (data, ds, query, xhr) {
        return data;
    };
    return Adaptor;
}());

var JsonAdaptor = (function (_super) {
    __extends(JsonAdaptor, _super);
    function JsonAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonAdaptor.prototype.processQuery = function (dataManager, query) {
        var result = dataManager.dataSource.json.slice(0);
        var count = result.length;
        var countFlg = true;
        var ret;
        var key;
        var agg = {};
        for (var i = 0; i < query.queries.length; i++) {
            key = query.queries[i];
            ret = this[key.fn].call(this, result, key.e, query);
            if (key.fn === 'onAggregates') {
                agg[key.e.field + ' - ' + key.e.type] = ret;
            }
            else {
                result = ret !== undefined ? ret : result;
            }
            if (key.fn === 'onPage' || key.fn === 'onSkip' || key.fn === 'onTake' || key.fn === 'onRange') {
                countFlg = false;
            }
            if (countFlg) {
                count = result.length;
            }
        }
        if (query.requiresCounts) {
            result = {
                result: result,
                count: count,
                aggregates: agg
            };
        }
        return result;
    };
    JsonAdaptor.prototype.batchRequest = function (dm, changes, e) {
        var i;
        for (i = 0; i < changes.addedRecords.length; i++) {
            this.insert(dm, changes.addedRecords[i]);
        }
        for (i = 0; i < changes.changedRecords.length; i++) {
            this.update(dm, e.key, changes.changedRecords[i]);
        }
        for (i = 0; i < changes.deletedRecords.length; i++) {
            this.remove(dm, e.key, changes.deletedRecords[i]);
        }
        return changes;
    };
    JsonAdaptor.prototype.onWhere = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        return ds.filter(function (obj) {
            if (e) {
                return e.validate(obj);
            }
        });
    };
    JsonAdaptor.prototype.onAggregates = function (ds, e) {
        var fn = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].aggregates[e.type];
        if (!ds || !fn || ds.length === 0) {
            return null;
        }
        return fn(ds, e.field);
    };
    JsonAdaptor.prototype.onSearch = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        if (e.fieldNames.length === 0) {
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getFieldList(ds[0], e.fieldNames);
        }
        return ds.filter(function (obj) {
            for (var j = 0; j < e.fieldNames.length; j++) {
                if (e.comparer.call(obj, __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getObject(e.fieldNames[j], obj), e.searchKey, e.ignoreCase)) {
                    return true;
                }
            }
            return false;
        });
    };
    JsonAdaptor.prototype.onSortBy = function (ds, e, query) {
        if (!ds || !ds.length) {
            return ds;
        }
        var fnCompare;
        var field = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.fieldName, query);
        if (!field) {
            return ds.sort(e.comparer);
        }
        if (field instanceof Array) {
            field = field.slice(0);
            for (var i = field.length - 1; i >= 0; i--) {
                if (!field[i]) {
                    continue;
                }
                fnCompare = e.comparer;
                if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].endsWith(field[i], ' desc')) {
                    fnCompare = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].fnSort('descending');
                    field[i] = field[i].replace(' desc', '');
                }
                ds = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].sort(ds, field[i], fnCompare);
            }
            return ds;
        }
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].sort(ds, field, e.comparer);
    };
    JsonAdaptor.prototype.onGroup = function (ds, e, query) {
        if (!ds || !ds.length) {
            return ds;
        }
        var aggQuery = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onAggregates');
        var agg = [];
        if (aggQuery.length) {
            var tmp = void 0;
            for (var i = 0; i < aggQuery.length; i++) {
                tmp = aggQuery[i].e;
                agg.push({ type: tmp.type, field: __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(tmp.field, query) });
            }
        }
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].group(ds, __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.fieldName, query), agg);
    };
    JsonAdaptor.prototype.onPage = function (ds, e, query) {
        var size = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.pageSize, query);
        var start = (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.pageIndex, query) - 1) * size;
        var end = start + size;
        if (!ds || !ds.length) {
            return ds;
        }
        return ds.slice(start, end);
    };
    JsonAdaptor.prototype.onRange = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        return ds.slice(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.start), __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.end));
    };
    JsonAdaptor.prototype.onTake = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        return ds.slice(0, __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.nos));
    };
    JsonAdaptor.prototype.onSkip = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        return ds.slice(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.nos));
    };
    JsonAdaptor.prototype.onSelect = function (ds, e) {
        if (!ds || !ds.length) {
            return ds;
        }
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].select(ds, __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(e.fieldNames));
    };
    JsonAdaptor.prototype.insert = function (dm, data) {
        return dm.dataSource.json.push(data);
    };
    JsonAdaptor.prototype.remove = function (dm, keyField, value, tableName) {
        var ds = dm.dataSource.json;
        var i;
        if (typeof value === 'object') {
            value = value[keyField];
        }
        for (i = 0; i < ds.length; i++) {
            if (ds[i][keyField] === value) {
                break;
            }
        }
        return i !== ds.length ? ds.splice(i, 1) : null;
    };
    JsonAdaptor.prototype.update = function (dm, keyField, value, tableName) {
        var ds = dm.dataSource.json;
        var i;
        var key = value[keyField];
        for (i = 0; i < ds.length; i++) {
            if (ds[i][keyField] === key) {
                break;
            }
        }
        return i < ds.length ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["merge"])(ds[i], value) : null;
    };
    return JsonAdaptor;
}(Adaptor));

var UrlAdaptor = (function (_super) {
    __extends(UrlAdaptor, _super);
    function UrlAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UrlAdaptor.prototype.processQuery = function (dm, query, hierarchyFilters) {
        var queries = this.getQueryRequest(query);
        var singles = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueryLists(query.queries, ['onSelect', 'onPage', 'onSkip', 'onTake', 'onRange']);
        var params = query.params;
        var url = dm.dataSource.url;
        var temp;
        var skip;
        var take = null;
        var options = this.options;
        var request = { sorts: [], groups: [], filters: [], searches: [], aggregates: [] };
        if ('onPage' in singles) {
            temp = singles.onPage;
            skip = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(temp.pageIndex, query);
            take = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(temp.pageSize, query);
            skip = (skip - 1) * take;
        }
        else if ('onRange' in singles) {
            temp = singles.onRange;
            skip = temp.start;
            take = temp.end - temp.start;
        }
        for (var i = 0; i < queries.sorts.length; i++) {
            temp = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(queries.sorts[i].e.fieldName, query);
            request.sorts.push(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onEachSort', { name: temp, direction: queries.sorts[i].e.direction }, query));
        }
        if (hierarchyFilters) {
            temp = this.getFiltersFrom(hierarchyFilters, query);
            if (temp) {
                request.filters.push(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onEachWhere', temp.toJson(), query));
            }
        }
        for (var i = 0; i < queries.filters.length; i++) {
            request.filters.push(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onEachWhere', queries.filters[i].e.toJson(), query));
            var keys_1 = typeof request.filters[i] === 'object' ? Object.keys(request.filters[i]) : [];
            for (var _i = 0, keys_2 = keys_1; _i < keys_2.length; _i++) {
                var prop = keys_2[_i];
                if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull((request)[prop])) {
                    delete request[prop];
                }
            }
        }
        for (var i = 0; i < queries.searches.length; i++) {
            temp = queries.searches[i].e;
            request.searches.push(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onEachSearch', {
                fields: temp.fieldNames,
                operator: temp.operator,
                key: temp.searchKey,
                ignoreCase: temp.ignoreCase
            }, query));
        }
        for (var i = 0; i < queries.groups.length; i++) {
            request.groups.push(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(queries.groups[i].e.fieldName, query));
        }
        for (var i = 0; i < queries.aggregates.length; i++) {
            temp = queries.aggregates[i].e;
            request.aggregates.push({ type: temp.type, field: __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(temp.field, query) });
        }
        var req = {};
        this.getRequestQuery(options, query, singles, request, req);
        __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'addParams', { dm: dm, query: query, params: params, reqParams: req });
        var keys = Object.keys(req);
        for (var _a = 0, keys_3 = keys; _a < keys_3.length; _a++) {
            var prop = keys_3[_a];
            if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(req[prop]) || req[prop] === '' || req[prop].length === 0) {
                delete req[prop];
            }
        }
        if (!(options.skip in req && options.take in req) && take !== null) {
            req[options.skip] = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onSkip', skip, query);
            req[options.take] = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onTake', take, query);
        }
        var p = this.pvt;
        this.pvt = {};
        if (this.options.requestType === 'json') {
            return {
                data: JSON.stringify(req),
                url: url,
                pvtData: p,
                type: 'POST',
                contentType: 'application/json; charset=utf-8'
            };
        }
        temp = this.convertToQueryString(req, query, dm);
        temp = (dm.dataSource.url.indexOf('?') !== -1 ? '&' : '/') + temp;
        return {
            type: 'GET', url: temp.length ? url.replace(/\/*$/, temp) : url, pvtData: p
        };
    };
    UrlAdaptor.prototype.getRequestQuery = function (options, query, singles, request, request1) {
        var param = 'param';
        var req = request1;
        req[options.from] = query.fromTable;
        if (options.expand) {
            req[options.expand] = query.expands;
        }
        req[options.select] = 'onSelect' in singles ?
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onSelect', __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(singles.onSelect.fieldNames, query), query) : '';
        req[options.count] = query.requiresCounts ? __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onCount', query.requiresCounts, query) : '';
        req[options.search] = request.searches.length ? __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onSearch', request.searches, query) : '';
        req[options.skip] = 'onSkip' in singles ?
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onSkip', __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(singles.onSkip.nos, query), query) : '';
        req[options.take] = 'onTake' in singles ?
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onTake', __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getValue(singles.onTake.nos, query), query) : '';
        req[options.where] = request.filters.length || request.searches.length ?
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onWhere', request.filters, query) : '';
        req[options.sortBy] = request.sorts.length ? __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onSortBy', request.sorts, query) : '';
        req[options.group] = request.groups.length ? __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onGroup', request.groups, query) : '';
        req[options.aggregates] = request.aggregates.length ?
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].callAdaptorFunction(this, 'onAggregates', request.aggregates, query) : '';
        req[param] = [];
    };
    UrlAdaptor.prototype.convertToQueryString = function (request, query, dm) {
        return '';
    };
    UrlAdaptor.prototype.processResponse = function (data, ds, query, xhr, request, changes) {
        var requests = request;
        var pvt = requests.pvtData || {};
        var groupDs = data.groupDs;
        if (xhr && xhr.getResponseHeader('Content-Type') &&
            xhr.getResponseHeader('Content-Type').indexOf('xml') !== -1) {
            return query.requiresCounts ? { result: [], count: 0 } : [];
        }
        var d = JSON.parse(requests.data);
        if (d && d.action === 'batch' && data.addedRecords) {
            changes.addedRecords = data.addedRecords;
            return changes;
        }
        if (data.d) {
            data = data.d;
        }
        var args = {};
        if ('count' in data) {
            args.count = data.count;
        }
        args.result = data.result ? data.result : data;
        this.getAggregateResult(pvt, data, args, groupDs);
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(args.count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    };
    UrlAdaptor.prototype.onGroup = function (e) {
        this.pvt.groups = e;
    };
    UrlAdaptor.prototype.onAggregates = function (e) {
        this.pvt.aggregates = e;
    };
    UrlAdaptor.prototype.batchRequest = function (dm, changes, e) {
        var url;
        var key;
        return {
            type: 'POST',
            url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.removeUrl || dm.dataSource.url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                changed: changes.changedRecords,
                added: changes.addedRecords,
                deleted: changes.deletedRecords,
                action: 'batch',
                table: e[url],
                key: e[key]
            })
        };
    };
    UrlAdaptor.prototype.beforeSend = function (dm, request) {
    };
    UrlAdaptor.prototype.insert = function (dm, data, tableName) {
        return {
            url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify({
                value: data,
                table: tableName,
                action: 'insert'
            })
        };
    };
    UrlAdaptor.prototype.remove = function (dm, keyField, value, tableName) {
        return {
            type: 'POST',
            url: dm.dataSource.removeUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify({
                key: value,
                keyColumn: keyField,
                table: tableName,
                action: 'remove'
            })
        };
    };
    UrlAdaptor.prototype.update = function (dm, keyField, value, tableName) {
        return {
            type: 'POST',
            url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            data: JSON.stringify({
                value: value,
                action: 'update',
                keyColumn: keyField,
                key: value[keyField],
                table: tableName
            })
        };
    };
    UrlAdaptor.prototype.getFiltersFrom = function (data, query) {
        var key = query.fKey;
        var value;
        var prop = key;
        var pKey = query.key;
        var predicats = [];
        if (typeof data[0] !== 'object') {
            prop = null;
        }
        for (var i = 0; i < data.length; i++) {
            if (typeof data[0] === 'object') {
                value = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getObject(pKey || prop, data[i]);
            }
            else {
                value = data[i];
            }
            predicats.push(new __WEBPACK_IMPORTED_MODULE_2__query__["b" /* Predicate */](key, 'equal', value));
        }
        return __WEBPACK_IMPORTED_MODULE_2__query__["b" /* Predicate */].or(predicats);
    };
    UrlAdaptor.prototype.getAggregateResult = function (pvt, data, args, groupDs) {
        var pData = data;
        if (data && data.result) {
            pData = data.result;
        }
        if (pvt && pvt.aggregates && pvt.aggregates.length) {
            var agg = pvt.aggregates;
            var fn = void 0;
            var aggregateData = pData;
            var res = {};
            if (data.aggregate) {
                aggregateData = data.aggregate;
            }
            for (var i = 0; i < agg.length; i++) {
                fn = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].aggregates[agg[i].type];
                if (fn) {
                    res[agg[i].field + ' - ' + agg[i].type] = fn(aggregateData, agg[i].field);
                }
            }
            args.aggregates = res;
        }
        if (pvt && pvt.groups && pvt.groups.length) {
            var groups = pvt.groups;
            for (var i = 0; i < groups.length; i++) {
                var level = null;
                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(groupDs)) {
                    groupDs = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].group(groupDs, groups[i]);
                }
                pData = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].group(pData, groups[i], pvt.aggregates, level, groupDs);
            }
            args.result = pData;
        }
        return args;
    };
    UrlAdaptor.prototype.getQueryRequest = function (query) {
        var req = { sorts: [], groups: [], filters: [], searches: [], aggregates: [] };
        req.sorts = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onSortBy');
        req.groups = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onGroup');
        req.filters = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onWhere');
        req.searches = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onSearch');
        req.aggregates = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueries(query.queries, 'onAggregates');
        return req;
    };
    return UrlAdaptor;
}(Adaptor));

var ODataAdaptor = (function (_super) {
    __extends(ODataAdaptor, _super);
    function ODataAdaptor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["extend"])({}, _this.options, {
            requestType: 'get',
            accept: 'application/json;odata=light;q=1,application/json;odata=verbose;q=0.5',
            multipartAccept: 'multipart/mixed',
            sortBy: '$orderby',
            select: '$select',
            skip: '$skip',
            take: '$top',
            count: '$inlinecount',
            where: '$filter',
            expand: '$expand',
            batch: '$batch',
            changeSet: '--changeset_',
            batchPre: 'batch_',
            contentId: 'Content-Id: ',
            batchContent: 'Content-Type: multipart/mixed; boundary=',
            changeSetContent: 'Content-Type: application/http\nContent-Transfer-Encoding: binary ',
            batchChangeSetContentType: 'Content-Type: application/json; charset=utf-8 '
        });
        return _this;
    }
    ODataAdaptor.prototype.onPredicate = function (predicate, query, requiresCast) {
        var returnValue = '';
        var operator;
        var guid;
        var val = predicate.value;
        var type = typeof val;
        var field = predicate.field ? ODataAdaptor.getField(predicate.field) : null;
        if (val instanceof Date) {
            val = 'datetime\'' + __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.replacer(val) + '\'';
        }
        if (type === 'string') {
            val = '\'' + val + '\'';
            if (requiresCast) {
                field = 'cast(' + field + ', \'Edm.String\')';
            }
            if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.isGuid(val)) {
                guid = 'guid';
            }
            if (predicate.ignoreCase) {
                if (!guid) {
                    field = 'tolower(' + field + ')';
                }
                val = val.toLowerCase();
            }
        }
        operator = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].odBiOperator[predicate.operator];
        if (operator) {
            returnValue += field;
            returnValue += operator;
            if (guid) {
                returnValue += guid;
            }
            return returnValue + val;
        }
        operator = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].odUniOperator[predicate.operator];
        if (operator === 'substringof') {
            var temp = val;
            val = field;
            field = temp;
        }
        returnValue += operator + '(';
        returnValue += field + ',';
        if (guid) {
            returnValue += guid;
        }
        returnValue += val + ')';
        return returnValue;
    };
    ODataAdaptor.prototype.onComplexPredicate = function (predicate, query, requiresCast) {
        var res = [];
        for (var i = 0; i < predicate.predicates.length; i++) {
            res.push('(' + this.onEachWhere(predicate.predicates[i], query, requiresCast) + ')');
        }
        return res.join(' ' + predicate.condition + ' ');
    };
    ODataAdaptor.prototype.onEachWhere = function (filter, query, requiresCast) {
        return filter.isComplex ? this.onComplexPredicate(filter, query, requiresCast) : this.onPredicate(filter, query, requiresCast);
    };
    ODataAdaptor.prototype.onWhere = function (filters) {
        if (this.pvt.search) {
            filters.push(this.onEachWhere(this.pvt.search, null, true));
        }
        return filters.join(' and ');
    };
    ODataAdaptor.prototype.onEachSearch = function (e) {
        if (e.fields && e.fields.length === 0) {
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].throwError('Query() - Search : oData search requires list of field names to search');
        }
        var filter = this.pvt.search || [];
        for (var i = 0; i < e.fields.length; i++) {
            filter.push(new __WEBPACK_IMPORTED_MODULE_2__query__["b" /* Predicate */](e.fields[i], e.operator, e.key, e.ignoreCase));
        }
        this.pvt.search = filter;
    };
    ODataAdaptor.prototype.onSearch = function (e) {
        this.pvt.search = __WEBPACK_IMPORTED_MODULE_2__query__["b" /* Predicate */].or(this.pvt.search);
        return '';
    };
    ODataAdaptor.prototype.onEachSort = function (e) {
        var res = [];
        if (e.name instanceof Array) {
            for (var i = 0; i < e.name.length; i++) {
                res.push(ODataAdaptor.getField(e.name[i]) + (e.direction === 'descending' ? ' desc' : ''));
            }
        }
        else {
            res.push(ODataAdaptor.getField(e.name) + (e.direction === 'descending' ? ' desc' : ''));
        }
        return res.join(',');
    };
    ODataAdaptor.prototype.onSortBy = function (e) {
        return e.reverse().join(',');
    };
    ODataAdaptor.prototype.onGroup = function (e) {
        this.pvt.groups = e;
        return '';
    };
    ODataAdaptor.prototype.onSelect = function (e) {
        for (var i = 0; i < e.length; i++) {
            e[i] = ODataAdaptor.getField(e[i]);
        }
        return e.join(',');
    };
    ODataAdaptor.prototype.onAggregates = function (e) {
        this.pvt.aggregates = e;
        return '';
    };
    ODataAdaptor.prototype.onCount = function (e) {
        return e === true ? 'allpages' : '';
    };
    ODataAdaptor.prototype.beforeSend = function (dm, request, settings) {
        if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].endsWith(settings.url, this.options.batch) && settings.type.toLowerCase() === 'post') {
            request.setRequestHeader('Accept', this.options.multipartAccept);
            request.setRequestHeader('DataServiceVersion', '2.0');
            request.overrideMimeType('text/plain; charset=x-user-defined');
        }
        else {
            request.setRequestHeader('Accept', this.options.accept);
        }
        request.setRequestHeader('DataServiceVersion', '2.0');
        request.setRequestHeader('MaxDataServiceVersion', '2.0');
    };
    ODataAdaptor.prototype.processResponse = function (data, ds, query, xhr, request, changes) {
        var pvtData = 'pvtData';
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(data.d)) {
            var dataCopy = (query && query.requiresCounts) ? data.d.results : data.d;
            var metaData = '__metadata';
            if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(dataCopy)) {
                for (var i = 0; i < dataCopy.length; i++) {
                    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(dataCopy[i][metaData])) {
                        delete dataCopy[i][metaData];
                    }
                }
            }
        }
        var pvt = request && request[pvtData];
        var emptyAndBatch = this.processBatchResponse(data, query, xhr, request, changes);
        if (emptyAndBatch) {
            return emptyAndBatch;
        }
        var versionCheck = xhr && request.getResponseHeader('DataServiceVersion');
        var count = null;
        var version = (versionCheck && parseInt(versionCheck, 10)) || 2;
        if (query && query.requiresCounts) {
            var oDataCount = '__count';
            if (data[oDataCount] || data['odata.count']) {
                count = data[oDataCount] || data['odata.count'];
            }
            if (data.d) {
                data = data.d;
            }
            if (data[oDataCount] || data['odata.count']) {
                count = data[oDataCount] || data['odata.count'];
            }
        }
        if (version === 3 && data.value) {
            data = data.value;
        }
        if (data.d) {
            data = data.d;
        }
        if (version < 3 && data.results) {
            data = data.results;
        }
        var args = {};
        args.count = count;
        args.result = data;
        this.getAggregateResult(pvt, data, args);
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    };
    ODataAdaptor.prototype.convertToQueryString = function (request, query, dm) {
        var res = [];
        var table = 'table';
        var tableName = request[table] || '';
        var format = '$format';
        delete request[table];
        if (dm.dataSource.requiresFormat) {
            request[format] = 'json';
        }
        var keys = Object.keys(request);
        for (var _i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
            var prop = keys_4[_i];
            res.push(prop + '=' + request[prop]);
        }
        res = res.join('&');
        if (dm.dataSource.url && dm.dataSource.url.indexOf('?') !== -1 && !tableName) {
            return res;
        }
        return res.length ? tableName + '?' + res : tableName || '';
    };
    ODataAdaptor.prototype.insert = function (dm, data, tableName) {
        return {
            url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
            data: JSON.stringify(data)
        };
    };
    ODataAdaptor.prototype.remove = function (dm, keyField, value, tableName) {
        return {
            type: 'DELETE',
            url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value + ')'
        };
    };
    ODataAdaptor.prototype.update = function (dm, keyField, value, tableName) {
        return {
            type: 'PUT',
            url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value[keyField] + ')',
            data: JSON.stringify(value),
            accept: this.options.accept
        };
    };
    ODataAdaptor.prototype.batchRequest = function (dm, changes, e) {
        var initialGuid = e.guid = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getGuid(this.options.batchPre);
        var url = dm.dataSource.url.replace(/\/*$/, '/' + this.options.batch);
        var args = {
            url: e.url,
            key: e.key,
            cid: 1,
            cSet: __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getGuid(this.options.changeSet)
        };
        var req = '--' + initialGuid + '\n';
        req += 'Content-Type: multipart/mixed; boundary=' + args.cSet.replace('--', '') + '\n';
        this.pvt.changeSet = 0;
        req += this.generateInsertRequest(changes.addedRecords, args);
        req += this.generateUpdateRequest(changes.changedRecords, args);
        req += this.generateDeleteRequest(changes.deletedRecords, args);
        req += args.cSet + '--\n';
        req += '--' + initialGuid + '--';
        return {
            type: 'POST',
            url: url,
            dataType: 'json',
            contentType: 'multipart/mixed; charset=UTF-8;boundary=' + initialGuid,
            data: req
        };
    };
    ODataAdaptor.prototype.generateDeleteRequest = function (arr, e) {
        if (!arr) {
            return '';
        }
        var req = '';
        var stat = {
            'method': 'DELETE ',
            'url': function (data, i, key) { return '(' + data[i][key] + ')'; },
            'data': function (data, i) { return ''; }
        };
        req = this.generateBodyContent(arr, e, stat);
        return req + '\n';
    };
    ODataAdaptor.prototype.generateInsertRequest = function (arr, e) {
        if (!arr) {
            return '';
        }
        var req = '';
        var stat = {
            'method': 'POST ',
            'url': function (data, i, key) { return ''; },
            'data': function (data, i) { return JSON.stringify(data[i]) + '\n\n'; }
        };
        req = this.generateBodyContent(arr, e, stat);
        return req;
    };
    ODataAdaptor.prototype.generateUpdateRequest = function (arr, e) {
        if (!arr) {
            return '';
        }
        var req = '';
        var stat = {
            'method': 'PUT ',
            'url': function (data, i, key) { return '(' + data[i][key] + ')'; },
            'data': function (data, i) { return JSON.stringify(data[i]) + '\n\n'; }
        };
        req = this.generateBodyContent(arr, e, stat);
        return req;
    };
    ODataAdaptor.getField = function (prop) {
        return prop.replace(/\./g, '/');
    };
    ODataAdaptor.prototype.generateBodyContent = function (arr, e, stat) {
        var req = '';
        for (var i = 0; i < arr.length; i++) {
            req += '\n' + e.cSet + '\n';
            req += this.options.changeSetContent + '\n\n';
            req += stat.method;
            req += e.url + stat.url(arr, i, e.key) + ' HTTP/1.1\n';
            req += 'Accept: ' + this.options.accept + '\n';
            req += 'Content-Id: ' + this.pvt.changeSet++ + '\n';
            req += this.options.batchChangeSetContentType + '\n\n';
            req += stat.data(arr, i);
        }
        return req;
    };
    ODataAdaptor.prototype.processBatchResponse = function (data, query, xhr, request, changes) {
        if (xhr && xhr.getResponseHeader('Content-Type') && xhr.getResponseHeader('Content-Type').indexOf('xml') !== -1) {
            return query.requiresCounts ? { result: [], count: 0 } : [];
        }
        if (request && this.options.batch && __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].endsWith(request.url, this.options.batch) && request.type.toLowerCase() === 'post') {
            var guid = xhr.getResponseHeader('Content-Type');
            var cIdx = void 0;
            var jsonObj = void 0;
            guid = guid.substring(guid.indexOf('=batchresponse') + 1);
            data = data.split(guid);
            if (data.length < 2) {
                return {};
            }
            data = data[1];
            var exVal = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(data);
            if (exVal) {
                data.replace(exVal[0], '');
            }
            var changeGuid = exVal ? exVal[1] : '';
            data = data.split(changeGuid);
            for (var i = data.length; i > -1; i--) {
                if (!/\bContent-ID:/i.test(data[i]) || !/\bHTTP.+201/.test(data[i])) {
                    continue;
                }
                cIdx = parseInt(/\bContent-ID: (\d+)/i.exec(data[i])[1], 10);
                if (changes.addedRecords[cIdx]) {
                    jsonObj = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.parseJson(/^\{.+\}/m.exec(data[i])[0]);
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["extend"])({}, changes.addedRecords[cIdx], this.processResponse(jsonObj));
                }
            }
            return changes;
        }
        return null;
    };
    return ODataAdaptor;
}(UrlAdaptor));

var ODataV4Adaptor = (function (_super) {
    __extends(ODataV4Adaptor, _super);
    function ODataV4Adaptor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["extend"])({}, _this.options, {
            requestType: 'get',
            accept: 'application/json, text/javascript, */*; q=0.01',
            multipartAccept: 'multipart/mixed',
            sortBy: '$orderby',
            select: '$select',
            skip: '$skip',
            take: '$top',
            count: '$count',
            search: '$search',
            where: '$filter',
            expand: '$expand',
            batch: '$batch',
            changeSet: '--changeset_',
            batchPre: 'batch_',
            contentId: 'Content-Id: ',
            batchContent: 'Content-Type: multipart/mixed; boundary=',
            changeSetContent: 'Content-Type: application/http\nContent-Transfer-Encoding: binary ',
            batchChangeSetContentType: 'Content-Type: application/json; charset=utf-8 '
        });
        return _this;
    }
    ODataV4Adaptor.prototype.onCount = function (e) {
        return e === true ? 'true' : '';
    };
    ODataV4Adaptor.prototype.onPredicate = function (predicate, requiresCast) {
        var returnValue = '';
        var val = predicate.value;
        var isDate = val instanceof Date;
        returnValue = _super.prototype.onPredicate.call(this, predicate, requiresCast);
        if (isDate) {
            returnValue = returnValue.replace(/datetime'(.*)'$/, '$1');
        }
        return returnValue;
    };
    ODataV4Adaptor.prototype.onEachSearch = function (e) {
        var search = this.pvt.searches || [];
        search.push(e.key);
        this.pvt.searches = search;
    };
    ODataV4Adaptor.prototype.onSearch = function (e) {
        return this.pvt.searches.join(' OR ');
    };
    ODataV4Adaptor.prototype.beforeSend = function (dm, request, settings) {
        request.setRequestHeader('Accept', this.options.accept);
    };
    ODataV4Adaptor.prototype.processResponse = function (data, ds, query, xhr, request, changes) {
        var pvtData = 'pvtData';
        var pvt = request && request[pvtData];
        var emptyAndBatch = _super.prototype.processBatchResponse.call(this, data, query, xhr, request, changes);
        if (emptyAndBatch) {
            return emptyAndBatch;
        }
        var count = null;
        var dataCount = '@odata.count';
        if (query && query.requiresCounts) {
            if (dataCount in data) {
                count = data[dataCount];
            }
        }
        data = data.value;
        var args = {};
        args.count = count;
        args.result = data;
        this.getAggregateResult(pvt, data, args);
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(count) ? args.result : { result: args.result, count: count, aggregates: args.aggregates };
    };
    return ODataV4Adaptor;
}(ODataAdaptor));

var WebApiAdaptor = (function (_super) {
    __extends(WebApiAdaptor, _super);
    function WebApiAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebApiAdaptor.prototype.insert = function (dm, data, tableName) {
        return {
            type: 'POST',
            url: dm.dataSource.url,
            data: JSON.stringify(data)
        };
    };
    WebApiAdaptor.prototype.remove = function (dm, keyField, value, tableName) {
        return {
            type: 'DELETE',
            url: dm.dataSource.url + '/' + value,
            data: JSON.stringify(value)
        };
    };
    WebApiAdaptor.prototype.update = function (dm, keyField, value, tableName) {
        return {
            type: 'PUT',
            url: dm.dataSource.url,
            data: JSON.stringify(value)
        };
    };
    WebApiAdaptor.prototype.beforeSend = function (dm, request, settings) {
        request.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    };
    WebApiAdaptor.prototype.processResponse = function (data, ds, query, xhr, request, changes) {
        var pvtData = 'pvtData';
        var pvt = request && request[pvtData];
        var count = null;
        var args = {};
        if (request && request.type.toLowerCase() !== 'post') {
            var versionCheck = xhr && request.getResponseHeader('DataServiceVersion');
            var version = (versionCheck && parseInt(versionCheck, 10)) || 2;
            if (query && query.requiresCounts) {
                if (!__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(data.Count)) {
                    count = data.Count;
                }
            }
            if (version < 3 && data.Items) {
                data = data.Items;
            }
            args.count = count;
            args.result = data;
            this.getAggregateResult(pvt, data, args);
        }
        args.result = args.result || data;
        return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].isNull(count) ? args.result : { result: args.result, count: args.count, aggregates: args.aggregates };
    };
    return WebApiAdaptor;
}(ODataAdaptor));

var WebMethodAdaptor = (function (_super) {
    __extends(WebMethodAdaptor, _super);
    function WebMethodAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebMethodAdaptor.prototype.processQuery = function (dm, query, hierarchyFilters) {
        var obj = new UrlAdaptor().processQuery(dm, query, hierarchyFilters);
        var getData = 'data';
        var data = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.parseJson(obj[getData]);
        var result = {};
        var value = 'value';
        if (data.param) {
            for (var i = 0; i < data.param.length; i++) {
                var param = data.param[i];
                var key = Object.keys(param)[0];
                result[key] = param[key];
            }
        }
        result[value] = data;
        var pvtData = 'pvtData';
        var url = 'url';
        return {
            data: JSON.stringify(result),
            url: obj[url],
            pvtData: obj[pvtData],
            type: 'POST',
            contentType: 'application/json; charset=utf-8'
        };
    };
    return WebMethodAdaptor;
}(UrlAdaptor));

var RemoteSaveAdaptor = (function (_super) {
    __extends(RemoteSaveAdaptor, _super);
    function RemoteSaveAdaptor() {
        var _this = _super.call(this) || this;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["setValue"])('beforeSend', UrlAdaptor.prototype.beforeSend, _this);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["setValue"])('insert', UrlAdaptor.prototype.insert, _this);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["setValue"])('update', UrlAdaptor.prototype.update, _this);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["setValue"])('remove', UrlAdaptor.prototype.remove, _this);
        return _this;
    }
    RemoteSaveAdaptor.prototype.batchRequest = function (dm, changes, e) {
        var i;
        for (i = 0; i < changes.addedRecords.length; i++) {
            JsonAdaptor.prototype.insert(dm, changes.addedRecords[i]);
        }
        for (i = 0; i < changes.changedRecords.length; i++) {
            JsonAdaptor.prototype.update(dm, e.key, changes.changedRecords[i]);
        }
        for (i = 0; i < changes.deletedRecords.length; i++) {
            JsonAdaptor.prototype.remove(dm, e.key, changes.deletedRecords[i]);
        }
        return {
            type: 'POST',
            url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                changed: changes.changedRecords,
                added: changes.addedRecords,
                deleted: changes.deletedRecords,
                action: 'batch',
                table: e.url,
                key: e.key
            })
        };
    };
    return RemoteSaveAdaptor;
}(JsonAdaptor));

var CacheAdaptor = (function (_super) {
    __extends(CacheAdaptor, _super);
    function CacheAdaptor(adaptor, timeStamp, pageSize) {
        var _this = _super.call(this) || this;
        _this.isCrudAction = false;
        _this.isInsertAction = false;
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(adaptor)) {
            _this.cacheAdaptor = adaptor;
        }
        _this.pageSize = pageSize;
        _this.guidId = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].getGuid('cacheAdaptor');
        var obj = { keys: [], results: [] };
        window.localStorage.setItem(_this.guidId, JSON.stringify(obj));
        var guid = _this.guidId;
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base_util__["isNullOrUndefined"])(timeStamp)) {
            setInterval(function () {
                var data;
                data = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.parseJson(window.localStorage.getItem(guid));
                var forDel = [];
                for (var i = 0; i < data.results.length; i++) {
                    var currentTime = +new Date();
                    var requestTime = +new Date(data.results[i].timeStamp);
                    data.results[i].timeStamp = currentTime - requestTime;
                    if (currentTime - requestTime > timeStamp) {
                        forDel.push(i);
                    }
                }
                for (var i = 0; i < forDel.length; i++) {
                    data.results.splice(forDel[i], 1);
                    data.keys.splice(forDel[i], 1);
                }
                window.localStorage.removeItem(guid);
                window.localStorage.setItem(guid, JSON.stringify(data));
            }, timeStamp);
        }
        return _this;
    }
    CacheAdaptor.prototype.generateKey = function (url, query) {
        var queries = this.getQueryRequest(query);
        var singles = __WEBPACK_IMPORTED_MODULE_2__query__["a" /* Query */].filterQueryLists(query.queries, ['onSelect', 'onPage', 'onSkip', 'onTake', 'onRange']);
        var key = url;
        var page = 'onPage';
        if (page in singles) {
            key += singles[page].pageIndex;
        }
        queries.sorts.forEach(function (obj) {
            key += obj.e.direction + obj.e.fieldName;
        });
        queries.groups.forEach(function (obj) {
            key += obj.e.fieldName;
        });
        queries.searches.forEach(function (obj) {
            key += obj.e.searchKey;
        });
        for (var filter = 0; filter < queries.filters.length; filter++) {
            var currentFilter = queries.filters[filter];
            if (currentFilter.e.isComplex) {
                var newQuery = query.clone();
                newQuery.queries = [];
                for (var i = 0; i < currentFilter.e.predicates.length; i++) {
                    newQuery.queries.push({ fn: 'onWhere', e: currentFilter.e.predicates[i], filter: query.queries.filter });
                }
                key += currentFilter.e.condition + this.generateKey(url, newQuery);
            }
            else {
                key += currentFilter.e.field + currentFilter.e.operator + currentFilter.e.value;
            }
        }
        return key;
    };
    CacheAdaptor.prototype.processQuery = function (dm, query, hierarchyFilters) {
        var key = this.generateKey(dm.dataSource.url, query);
        var cachedItems;
        cachedItems = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.parseJson(window.localStorage.getItem(this.guidId));
        var data = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(key)] : null;
        if (data != null && !this.isCrudAction && !this.isInsertAction) {
            return data;
        }
        this.isCrudAction = null;
        this.isInsertAction = null;
        return this.cacheAdaptor.processQuery.apply(this.cacheAdaptor, [].slice.call(arguments, 0));
    };
    CacheAdaptor.prototype.processResponse = function (data, ds, query, xhr, request, changes) {
        if (this.isInsertAction || (request && this.cacheAdaptor.options.batch &&
            __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].endsWith(request.url, this.cacheAdaptor.options.batch) && request.type.toLowerCase() === 'post')) {
            return this.cacheAdaptor.processResponse(data, ds, query, xhr, request, changes);
        }
        data = this.cacheAdaptor.processResponse.apply(this.cacheAdaptor, [].slice.call(arguments, 0));
        var key = query ? this.generateKey(ds.dataSource.url, query) : ds.dataSource.url;
        var obj = {};
        obj = __WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].parse.parseJson(window.localStorage.getItem(this.guidId));
        var index = obj.keys.indexOf(key);
        if (index !== -1) {
            obj.results.splice(index, 1);
            obj.keys.splice(index, 1);
        }
        obj.results[obj.keys.push(key) - 1] = { keys: key, result: data.result, timeStamp: new Date(), count: data.count };
        while (obj.results.length > this.pageSize) {
            obj.results.splice(0, 1);
            obj.keys.splice(0, 1);
        }
        window.localStorage.setItem(this.guidId, JSON.stringify(obj));
        return data;
    };
    CacheAdaptor.prototype.beforeSend = function (dm, request, settings) {
        if (__WEBPACK_IMPORTED_MODULE_1__util__["a" /* DataUtil */].endsWith(settings.url, this.cacheAdaptor.options.batch) && settings.type.toLowerCase() === 'post') {
            request.setRequestHeader('Accept', this.cacheAdaptor.options.multipartAccept);
        }
        if (!dm.dataSource.crossDomain) {
            request.setRequestHeader('Accept', this.cacheAdaptor.options.accept);
        }
    };
    CacheAdaptor.prototype.update = function (dm, keyField, value, tableName) {
        this.isCrudAction = true;
        return this.cacheAdaptor.update(dm, keyField, value, tableName);
    };
    CacheAdaptor.prototype.insert = function (dm, data, tableName) {
        this.isInsertAction = true;
        return this.cacheAdaptor.insert(dm, data, tableName);
    };
    CacheAdaptor.prototype.remove = function (dm, keyField, value, tableName) {
        this.isCrudAction = true;
        return this.cacheAdaptor.remove(dm, keyField, value, tableName);
    };
    CacheAdaptor.prototype.batchRequest = function (dm, changes, e) {
        return this.cacheAdaptor.batchRequest(dm, changes, e);
    };
    return CacheAdaptor;
}(UrlAdaptor));



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Deferred; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__query__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__adaptors__ = __webpack_require__(17);





var DataManager = (function () {
    function DataManager(dataSource, query, adaptor) {
        var _this = this;
        this.dateParse = true;
        this.requests = [];
        if (!dataSource && !this.dataSource) {
            dataSource = [];
        }
        adaptor = adaptor || dataSource.adaptor;
        var data;
        if (dataSource instanceof Array) {
            data = {
                json: dataSource,
                offline: true
            };
        }
        else if (typeof dataSource === 'object') {
            if (!dataSource.json) {
                dataSource.json = [];
            }
            data = {
                url: dataSource.url,
                insertUrl: dataSource.insertUrl,
                removeUrl: dataSource.removeUrl,
                updateUrl: dataSource.updateUrl,
                crudUrl: dataSource.crudUrl,
                batchUrl: dataSource.batchUrl,
                json: dataSource.json,
                headers: dataSource.headers,
                accept: dataSource.accept,
                data: dataSource.data,
                timeTillExpiration: dataSource.timeTillExpiration,
                cachingPageSize: dataSource.cachingPageSize,
                enableCaching: dataSource.enableCaching,
                requestType: dataSource.requestType,
                key: dataSource.key,
                crossDomain: dataSource.crossDomain,
                jsonp: dataSource.jsonp,
                dataType: dataSource.dataType,
                offline: dataSource.offline !== undefined ? dataSource.offline
                    : dataSource.adaptor instanceof __WEBPACK_IMPORTED_MODULE_4__adaptors__["h" /* RemoteSaveAdaptor */] ? false : dataSource.url ? false : true,
                requiresFormat: dataSource.requiresFormat
            };
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].throwError('DataManager: Invalid arguments');
        }
        if (data.requiresFormat === undefined && !__WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].isCors()) {
            data.requiresFormat = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["isNullOrUndefined"])(data.crossDomain) ? true : data.crossDomain;
        }
        if (data.dataType === undefined) {
            data.dataType = 'json';
        }
        this.dataSource = data;
        this.defaultQuery = query;
        if (data.url && data.offline && !data.json.length) {
            this.isDataAvailable = false;
            this.adaptor = adaptor || new __WEBPACK_IMPORTED_MODULE_4__adaptors__["d" /* ODataAdaptor */]();
            this.dataSource.offline = false;
            this.ready = this.executeQuery(query || new __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */]());
            this.ready.then(function (e) {
                _this.dataSource.offline = true;
                _this.isDataAvailable = true;
                data.json = e.result;
                _this.adaptor = new __WEBPACK_IMPORTED_MODULE_4__adaptors__["b" /* JsonAdaptor */]();
            });
        }
        else {
            this.adaptor = data.offline ? new __WEBPACK_IMPORTED_MODULE_4__adaptors__["b" /* JsonAdaptor */]() : new __WEBPACK_IMPORTED_MODULE_4__adaptors__["d" /* ODataAdaptor */]();
        }
        if (!data.jsonp && this.adaptor instanceof __WEBPACK_IMPORTED_MODULE_4__adaptors__["d" /* ODataAdaptor */]) {
            data.jsonp = 'callback';
        }
        this.adaptor = adaptor || this.adaptor;
        if (data.enableCaching) {
            this.adaptor = new __WEBPACK_IMPORTED_MODULE_4__adaptors__["i" /* CacheAdaptor */](this.adaptor, data.timeTillExpiration, data.cachingPageSize);
        }
        return this;
    }
    DataManager.prototype.setDefaultQuery = function (query) {
        this.defaultQuery = query;
        return this;
    };
    DataManager.prototype.executeLocal = function (query) {
        if (!this.defaultQuery && !(query instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */])) {
            __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].throwError('DataManager - executeLocal() : A query is required to execute');
        }
        if (!this.dataSource.json) {
            __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].throwError('DataManager - executeLocal() : Json data is required to execute');
        }
        query = query || this.defaultQuery;
        var result = this.adaptor.processQuery(this, query);
        if (query.subQuery) {
            var from = query.subQuery.fromTable;
            var lookup = query.subQuery.lookups;
            var res = query.requiresCounts ? result.result :
                result;
            if (lookup && lookup instanceof Array) {
                __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].buildHierarchy(query.subQuery.fKey, from, res, lookup, query.subQuery.key);
            }
            for (var j = 0; j < res.length; j++) {
                if (res[j][from] instanceof Array) {
                    res[j] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["extend"])({}, {}, res[j]);
                    res[j][from] = this.adaptor.processResponse(query.subQuery.using(new DataManager(res[j][from].slice(0))).executeLocal(), this, query);
                }
            }
        }
        return this.adaptor.processResponse(result, this, query);
    };
    DataManager.prototype.executeQuery = function (query, done, fail, always) {
        var _this = this;
        if (typeof query === 'function') {
            always = fail;
            fail = done;
            done = query;
            query = null;
        }
        if (!query) {
            query = this.defaultQuery;
        }
        if (!(query instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */])) {
            __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].throwError('DataManager - executeQuery() : A query is required to execute');
        }
        var deffered = new Deferred();
        var args = { query: query };
        if (!this.dataSource.offline && this.dataSource.url !== undefined) {
            var result = this.adaptor.processQuery(this, query);
            this.makeRequest(result, deffered, args, query);
        }
        else {
            DataManager.nextTick(function () {
                var res = _this.executeLocal(query);
                args = DataManager.getDeferedArgs(query, res, args);
                deffered.resolve(args);
            });
        }
        return deffered.promise;
    };
    DataManager.getDeferedArgs = function (query, result, args) {
        if (query.requiresCounts) {
            args.result = result.result;
            args.count = result.count;
        }
        else {
            args.result = result;
        }
        return args;
    };
    DataManager.nextTick = function (fn) {
        (window.setImmediate || window.setTimeout)(fn, 0);
    };
    DataManager.prototype.extendRequest = function (url, fnSuccess, fnFail) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["extend"])({}, {
            type: 'GET',
            dataType: this.dataSource.dataType,
            crossDomain: this.dataSource.crossDomain,
            jsonp: this.dataSource.jsonp,
            cache: true,
            processData: false,
            onSuccess: fnSuccess,
            onFailure: fnFail
        }, url);
    };
    DataManager.prototype.makeRequest = function (url, deffered, args, query) {
        var _this = this;
        var isSelector = !!query.subQuerySelector;
        var fnFail = function (e) {
            args.error = e;
            deffered.reject(args);
        };
        var process = function (data, count, xhr, request, actual, aggregates, virtualSelectRecords) {
            args.xhr = xhr;
            args.count = count ? parseInt(count.toString(), 10) : 0;
            args.result = data;
            args.request = request;
            args.aggregates = aggregates;
            args.actual = actual;
            args.virtualSelectRecords = virtualSelectRecords;
            deffered.resolve(args);
        };
        var fnQueryChild = function (data, selector) {
            var subDeffer = new Deferred();
            var childArgs = { parent: args };
            query.subQuery.isChild = true;
            var subUrl = _this.adaptor.processQuery(_this, query.subQuery, data ? _this.adaptor.processResponse(data) : selector);
            var childReq = _this.makeRequest(subUrl, subDeffer, childArgs, query.subQuery);
            if (!isSelector) {
                subDeffer.then(function (subData) {
                    if (data) {
                        __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].buildHierarchy(query.subQuery.fKey, query.subQuery.fromTable, data, subData, query.subQuery.key);
                        process(data, subData.count, subData.xhr);
                    }
                }, fnFail);
            }
            return childReq;
        };
        var fnSuccess = function (data, request) {
            if (request.httpRequest.getResponseHeader('Content-Type').indexOf('xml') === -1 && _this.dateParse) {
                data = __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].parse.parseJson(data);
            }
            var result = _this.adaptor.processResponse(data, _this, query, request.httpRequest, request);
            var count = 0;
            var aggregates = null;
            var virtualSelectRecords = 'virtualSelectRecords';
            var virtualRecords = data[virtualSelectRecords];
            if (query.requiresCounts) {
                count = result.count;
                aggregates = result.aggregates;
                result = result.result;
            }
            if (!query.subQuery) {
                process(result, count, request.httpRequest, request.type, data, aggregates, virtualRecords);
                return;
            }
            if (!isSelector) {
                fnQueryChild(result, request);
            }
        };
        var req = this.extendRequest(url, fnSuccess, fnFail);
        var ajax = new __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Ajax"](req);
        ajax.beforeSend = function () {
            _this.beforeSend(ajax.httpRequest, ajax);
        };
        req = ajax.send();
        this.requests.push(ajax);
        if (isSelector) {
            var promise = void 0;
            var res = query.subQuerySelector.call(this, { query: query.subQuery, parent: query });
            if (res && res.length) {
                promise = Promise.all([req, fnQueryChild(null, res)]);
                promise.then(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var result = args[0];
                    var pResult = _this.adaptor.processResponse(result[0], _this, query, _this.requests[0].httpRequest, _this.requests[0]);
                    var count = 0;
                    if (query.requiresCounts) {
                        count = pResult.count;
                        pResult = pResult.result;
                    }
                    var cResult = _this.adaptor.processResponse(result[1], _this, query.subQuery, _this.requests[1].httpRequest, _this.requests[1]);
                    count = 0;
                    if (query.subQuery.requiresCounts) {
                        count = cResult.count;
                        cResult = cResult.result;
                    }
                    __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].buildHierarchy(query.subQuery.fKey, query.subQuery.fromTable, pResult, cResult, query.subQuery.key);
                    isSelector = false;
                    process(pResult, count, _this.requests[0].httpRequest);
                });
            }
            else {
                isSelector = false;
            }
        }
        return req;
    };
    DataManager.prototype.beforeSend = function (request, settings) {
        this.adaptor.beforeSend(this, request, settings);
        var headers = this.dataSource.headers;
        var props;
        for (var i = 0; headers && i < headers.length; i++) {
            props = [];
            var keys = Object.keys(headers[i]);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var prop = keys_1[_i];
                props.push(prop);
                request.setRequestHeader(prop, headers[i][prop]);
            }
        }
    };
    DataManager.prototype.saveChanges = function (changes, key, tableName, query) {
        var _this = this;
        if (tableName instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */]) {
            query = tableName;
            tableName = null;
        }
        var args = {
            url: tableName,
            key: key || this.dataSource.key
        };
        var req = this.adaptor.batchRequest(this, changes, args, query);
        if (this.dataSource.offline) {
            return req;
        }
        var deff = new Deferred();
        var ajax = new __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Ajax"](req);
        ajax.beforeSend = function () {
            _this.beforeSend(ajax.httpRequest, ajax);
        };
        ajax.onSuccess = function (data, request) {
            deff.resolve(_this, [_this.adaptor.processResponse(data, _this, null, request.httpRequest, request, changes)]);
        };
        ajax.onFailure = function (e) {
            deff.reject([{ error: e }]);
        };
        ajax.send();
        return deff.promise;
    };
    DataManager.prototype.insert = function (data, tableName, query) {
        data = __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].parse.replacer(data);
        if (tableName instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */]) {
            query = tableName;
            tableName = null;
        }
        var req = this.adaptor.insert(this, data, tableName, query);
        if (this.dataSource.offline) {
            return req;
        }
        return this.doAjaxRequest(req);
    };
    DataManager.prototype.remove = function (keyField, value, tableName, query) {
        if (typeof value === 'object') {
            value = value[keyField];
        }
        if (tableName instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */]) {
            query = tableName;
            tableName = null;
        }
        var res = this.adaptor.remove(this, keyField, value, tableName, query);
        if (this.dataSource.offline) {
            return res;
        }
        return this.doAjaxRequest(res);
    };
    DataManager.prototype.update = function (keyField, value, tableName, query) {
        value = __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].parse.replacer(value);
        if (tableName instanceof __WEBPACK_IMPORTED_MODULE_3__query__["a" /* Query */]) {
            query = tableName;
            tableName = null;
        }
        var res = this.adaptor.update(this, keyField, value, tableName, query);
        if (this.dataSource.offline) {
            return res;
        }
        return this.doAjaxRequest(res);
    };
    DataManager.prototype.doAjaxRequest = function (res) {
        var _this = this;
        var defer = new Deferred();
        res = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__syncfusion_ej2_base_util__["extend"])({}, {
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            processData: false
        }, res);
        var ajax = new __WEBPACK_IMPORTED_MODULE_0__syncfusion_ej2_base__["Ajax"](res);
        ajax.beforeSend = function () {
            _this.beforeSend(ajax.httpRequest, ajax);
        };
        ajax.onSuccess = function (record, request) {
            try {
                __WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].parse.parseJson(record);
            }
            catch (e) {
                record = [];
            }
            record = _this.adaptor.processResponse(__WEBPACK_IMPORTED_MODULE_2__util__["a" /* DataUtil */].parse.parseJson(record), _this, null, request.httpRequest, request);
            defer.resolve(_this, [{ record: record, dataManager: _this }]);
        };
        ajax.onFailure = function (e) {
            defer.reject([{ error: e }]);
        };
        ajax.send();
        return defer.promise;
    };
    return DataManager;
}());

var Deferred = (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        this.then = this.promise.then.bind(this.promise);
        this.catch = this.promise.catch.bind(this.promise);
    }
    return Deferred;
}());



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellType;
    (function (CellType) {
        CellType[CellType["Data"] = 0] = "Data";
        CellType[CellType["Header"] = 1] = "Header";
        CellType[CellType["Summary"] = 2] = "Summary";
        CellType[CellType["Filter"] = 3] = "Filter";
        CellType[CellType["Indent"] = 4] = "Indent";
        CellType[CellType["GroupCaption"] = 5] = "GroupCaption";
        CellType[CellType["Expand"] = 6] = "Expand";
        CellType[CellType["HeaderIndent"] = 7] = "HeaderIndent";
        CellType[CellType["StackedHeader"] = 8] = "StackedHeader";
    })(CellType = exports.CellType || (exports.CellType = {}));
    var RenderType;
    (function (RenderType) {
        RenderType[RenderType["Header"] = 0] = "Header";
        RenderType[RenderType["Content"] = 1] = "Content";
        RenderType[RenderType["Summary"] = 2] = "Summary";
    })(RenderType = exports.RenderType || (exports.RenderType = {}));
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manager__ = __webpack_require__(18);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DataManager", function() { return __WEBPACK_IMPORTED_MODULE_0__manager__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Deferred", function() { return __WEBPACK_IMPORTED_MODULE_0__manager__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__query__ = __webpack_require__(13);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return __WEBPACK_IMPORTED_MODULE_1__query__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Predicate", function() { return __WEBPACK_IMPORTED_MODULE_1__query__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adaptors__ = __webpack_require__(17);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Adaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "JsonAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "UrlAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ODataAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ODataV4Adaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WebApiAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "WebMethodAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "RemoteSaveAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CacheAdaptor", function() { return __WEBPACK_IMPORTED_MODULE_2__adaptors__["i"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(14);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DataUtil", function() { return __WEBPACK_IMPORTED_MODULE_3__util__["a"]; });






/***/ }),
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellRenderer = (function () {
        function CellRenderer(locator) {
            this.element = dom_1.createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell' } });
            this.localizer = locator.getService('localization');
            this.formatter = locator.getService('valueFormatter');
        }
        CellRenderer.prototype.getGui = function () {
            return '';
        };
        CellRenderer.prototype.format = function (column, value, data) {
            if (!util_1.isNullOrUndefined(column.format)) {
                value = this.formatter.toView(value, column.getFormatter());
            }
            return util_1.isNullOrUndefined(value) ? '' : value.toString();
        };
        CellRenderer.prototype.invokeFormatter = function (column, value, data) {
            if (!util_1.isNullOrUndefined(column.formatter)) {
                if (util_2.doesImplementInterface(column.formatter, 'getValue')) {
                    var formatter = column.formatter;
                    value = new formatter().getValue(column, data);
                }
                else if (typeof column.formatter === 'function') {
                    value = column.formatter(column, data);
                }
                else {
                    value = column.formatter.getValue(column, data);
                }
            }
            return value;
        };
        CellRenderer.prototype.render = function (cell, data, attributes) {
            var node = this.element.cloneNode();
            var column = cell.column;
            var literals = ['index'];
            var innerHtml = this.getGui();
            var value = column.valueAccessor(column.field, data, column);
            value = this.format(column, value, data);
            innerHtml = value.toString();
            if (column.type === 'boolean') {
                var isNull = (value !== 'true' && value !== 'false');
                if (column.displayAsCheckBox) {
                    node.classList.add('e-checkbox');
                    innerHtml = isNull ? null : '<input type="checkbox" disabled ' + (value === 'true' ? 'checked' : '') + '/>';
                }
                else {
                    var localeStr = isNull ? null : value === 'true' ? 'True' : 'False';
                    innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
                }
            }
            var fromFormatter = this.invokeFormatter(column, value, data);
            if (!column.template) {
                innerHtml = !util_1.isNullOrUndefined(column.formatter) ? util_1.isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
                this.appendHtml(node, innerHtml, column.getDomSetter());
            }
            else {
                this.appendHtml(node, column.getColumnTemplate()(util_1.extend({ 'index': attributes[literals[0]] }, data)));
            }
            this.buildAttributeFromCell(node, cell);
            util_2.setStyleAndAttributes(node, attributes);
            if (column.customAttributes) {
                util_2.setStyleAndAttributes(node, column.customAttributes);
            }
            if (!util_1.isNullOrUndefined(column.textAlign)) {
                node.style.textAlign = column.textAlign;
            }
            return node;
        };
        CellRenderer.prototype.appendHtml = function (node, innerHtml, property) {
            if (property === void 0) { property = 'innerHTML'; }
            node[property] = innerHtml;
            return node;
        };
        CellRenderer.prototype.buildAttributeFromCell = function (node, cell) {
            var attr = {};
            var prop = { 'colindex': 'aria-colindex' };
            var classes = [];
            if (cell.colSpan) {
                attr.colSpan = cell.colSpan;
            }
            if (cell.rowSpan) {
                attr.rowSpan = cell.rowSpan;
            }
            if (cell.isTemplate) {
                classes.push('e-templatecell');
            }
            if (!util_1.isNullOrUndefined(cell.index)) {
                attr[prop.colindex] = cell.index;
            }
            if (!cell.visible) {
                classes.push('e-hide');
            }
            attr.class = classes;
            util_2.setStyleAndAttributes(node, attr);
        };
        return CellRenderer;
    }());
    exports.CellRenderer = CellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Row = (function () {
        function Row(options) {
            util_1.merge(this, options);
        }
        return Row;
    }());
    exports.Row = Row;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(15), __webpack_require__(12), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, constant_1, util_2, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowRenderer = (function () {
        function RowRenderer(serviceLocator, cellType, parent) {
            this.element = dom_1.createElement('tr', { attrs: { role: 'row' } });
            this.cellType = cellType;
            this.serviceLocator = serviceLocator;
            this.parent = parent;
        }
        RowRenderer.prototype.render = function (row, columns, attributes, rowTemplate) {
            var tr = this.element.cloneNode();
            var rowArgs = { data: row.data };
            var cellArgs = { data: row.data };
            var attrCopy = util_1.extend({}, attributes, {});
            this.buildAttributeFromRow(tr, row);
            dom_1.attributes(tr, attrCopy);
            var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
            for (var i = 0, len = row.cells.length; i < len; i++) {
                var cell = row.cells[i];
                var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || enum_1.CellType.Data);
                var td = cellRenderer.render(row.cells[i], row.data, { 'index': !util_1.isNullOrUndefined(row.index) ? row.index.toString() : '' });
                tr.appendChild(td);
                if (row.cells[i].cellType === enum_1.CellType.Data) {
                    this.parent.trigger(constant_1.queryCellInfo, util_1.extend(cellArgs, { cell: td, column: cell.column }));
                }
            }
            if (row.isDataRow) {
                this.parent.trigger(constant_1.rowDataBound, util_1.extend(rowArgs, { row: tr }));
            }
            return tr;
        };
        RowRenderer.prototype.buildAttributeFromRow = function (tr, row) {
            var attr = {};
            var prop = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid' };
            var classes = [];
            if (row.isDataRow) {
                classes.push('e-row');
            }
            if (row.isAltRow) {
                classes.push('e-altrow');
            }
            if (!util_1.isNullOrUndefined(row.index)) {
                attr[prop.rowindex] = row.index;
            }
            if (row.rowSpan) {
                attr.rowSpan = row.rowSpan;
            }
            if (row.uid) {
                attr[prop.dataUID] = row.uid;
            }
            attr.class = classes;
            util_2.setStyleAndAttributes(tr, attr);
        };
        return RowRenderer;
    }());
    exports.RowRenderer = RowRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AriaService = (function () {
        function AriaService() {
        }
        AriaService.prototype.setOptions = function (target, options) {
            var props = Object.keys(options);
            props.forEach(function (name) { return setStateAndProperties(target, config[name], options[name]); });
        };
        AriaService.prototype.setExpand = function (target, expand) {
            setStateAndProperties(target, config.expand, expand);
        };
        AriaService.prototype.setSort = function (target, direction) {
            setStateAndProperties(target, config.sort, direction, typeof direction === 'boolean');
        };
        AriaService.prototype.setBusy = function (target, isBusy) {
            setStateAndProperties(target, config.busy, isBusy);
            setStateAndProperties(target, config.invalid, null, true);
        };
        AriaService.prototype.setGrabbed = function (target, isGrabbed, remove) {
            setStateAndProperties(target, config.grabbed, isGrabbed, remove);
        };
        AriaService.prototype.setDropTarget = function (target, isTarget) {
            setStateAndProperties(target, config.dropeffect, 'copy', !isTarget);
        };
        return AriaService;
    }());
    exports.AriaService = AriaService;
    function setStateAndProperties(target, attribute, value, remove) {
        if (remove) {
            target.removeAttribute(attribute);
            return;
        }
        if (target) {
            target.setAttribute(attribute, value);
        }
    }
    var config = {
        expand: 'aria-expanded',
        role: 'role',
        selected: 'aria-selected',
        multiselectable: 'aria-multiselectable',
        sort: 'aria-sort',
        busy: 'aria-busy',
        invalid: 'aria-invalid',
        grabbed: 'aria-grabbed',
        dropeffect: 'aria-dropeffect',
        haspopup: 'aria-haspopup',
        level: 'aria-level',
        colcount: 'aria-colcount'
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 53 */
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
/* 54 */
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
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cell = (function () {
        function Cell(options) {
            util_1.merge(this, options);
        }
        return Cell;
    }());
    exports.Cell = Cell;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(93), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, ej2_base_1, value_formatter_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Column = (function () {
        function Column(options) {
            this.allowSorting = true;
            this.allowFiltering = true;
            this.allowGrouping = true;
            util_1.merge(this, options);
            this.uid = util_2.getUid('grid-column');
            var valueFormatter = new value_formatter_1.ValueFormatter();
            if (options.format && (options.format.skeleton || options.format.format)) {
                this.setFormatter(valueFormatter.getFormatFunction(options.format));
                this.setParser(valueFormatter.getParserFunction(options.format));
            }
            if (!this.field) {
                this.allowFiltering = false;
                this.allowGrouping = false;
                this.allowSorting = false;
            }
            if (this.template) {
                var e = void 0;
                try {
                    if (document.querySelectorAll(this.template).length) {
                        this.templateFn = ej2_base_1.compile(document.querySelector(this.template).innerHTML.trim());
                    }
                }
                catch (e) {
                    this.templateFn = ej2_base_1.compile(this.template);
                }
            }
        }
        Column.prototype.getFormatter = function () {
            return this.formatFn;
        };
        Column.prototype.setFormatter = function (value) {
            this.formatFn = value;
        };
        Column.prototype.getParser = function () {
            return this.parserFn;
        };
        Column.prototype.setParser = function (value) {
            this.parserFn = value;
        };
        Column.prototype.getColumnTemplate = function () {
            return this.templateFn;
        };
        Column.prototype.getDomSetter = function () {
            return this.disableHtmlEncode ? 'textContent' : 'innerHTML';
        };
        return Column;
    }());
    exports.Column = Column;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 61 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterCellRenderer = (function (_super) {
        __extends(FilterCellRenderer, _super);
        function FilterCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-filterbarcell' });
            return _this;
        }
        FilterCellRenderer.prototype.getGui = function () {
            return dom_1.createElement('div');
        };
        FilterCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            var innerDIV = this.getGui();
            var input;
            var column = cell.column;
            if ((util_1.isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !util_1.isNullOrUndefined(column.filterBarTemplate)) {
                node.classList.add('e-fltrtemp');
                dom_1.attributes(innerDIV, {
                    'class': 'e-fltrtempdiv'
                });
                if (util_1.isNullOrUndefined(column.filterBarTemplate.create)) {
                    input = dom_1.createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                        attrs: { type: 'search', title: column.headerText }
                    });
                    innerDIV.appendChild(input);
                }
                else {
                    var args = { column: column };
                    var temp = column.filterBarTemplate.create;
                    if (typeof temp === 'string') {
                        temp = util_1.getValue(temp, window);
                    }
                    input = temp(args);
                    dom_1.attributes(innerDIV, {
                        class: 'e-filterUi_input e-filtertext e-fltrTemp',
                        title: column.headerText,
                        id: column.field + '_filterBarcell',
                    });
                    innerDIV.appendChild(input);
                }
            }
            else {
                dom_1.attributes(innerDIV, {
                    'class': 'e-filterdiv e-fltrinputdiv'
                });
                input = dom_1.createElement('input', {
                    id: column.field + '_filterBarcell', className: 'e-filtertext',
                    attrs: {
                        type: 'search', title: column.headerText + cell.attributes.title,
                        value: data[cell.column.field] ? data[cell.column.field] : ''
                    }
                });
                innerDIV.appendChild(input);
                innerDIV.appendChild(dom_1.createElement('span', { className: 'e-cancel e-hide e-icons e-icon-hide', }));
            }
            if (column.allowFiltering === false || column.field === '' || util_1.isNullOrUndefined(column.field)) {
                input.setAttribute('disabled', 'true');
                input.classList.add('e-disable');
            }
            if (!column.visible) {
                node.classList.add('e-hide');
            }
            if ((util_1.isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !util_1.isNullOrUndefined(column.filterBarTemplate)) {
                var templateRead = column.filterBarTemplate.read;
                var templateWrite = column.filterBarTemplate.write;
                var args = { element: input, column: column };
                if (typeof templateRead === 'string') {
                    templateRead = args.column = util_1.getValue(templateRead, window);
                }
                if (typeof templateWrite === 'string') {
                    templateWrite = util_1.getValue(templateWrite, window);
                }
                templateWrite.call(this, args);
            }
            this.appendHtml(node, innerDIV);
            return node;
        };
        FilterCellRenderer.prototype.appendHtml = function (node, innerHtml) {
            node.appendChild(innerHtml);
            return node;
        };
        return FilterCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.FilterCellRenderer = FilterCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 62 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndentCellRenderer = (function (_super) {
        __extends(IndentCellRenderer, _super);
        function IndentCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TD', { className: 'e-indentcell' });
            return _this;
        }
        IndentCellRenderer.prototype.render = function (cell, data) {
            return this.element.cloneNode();
        };
        return IndentCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.IndentCellRenderer = IndentCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(50), __webpack_require__(19), __webpack_require__(59), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, row_1, enum_1, cell_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowModelGenerator = (function () {
        function RowModelGenerator(parent) {
            this.parent = parent;
        }
        RowModelGenerator.prototype.generateRows = function (data) {
            var rows = [];
            for (var i = 0, len = Object.keys(data).length; i < len; i++) {
                rows[i] = this.generateRow(data[i], i);
            }
            return rows;
        };
        RowModelGenerator.prototype.ensureColumns = function () {
            return this.parent.getColumns();
        };
        RowModelGenerator.prototype.generateRow = function (data, index) {
            var options = {};
            var tmp = [];
            options.uid = util_2.getUid('grid-row');
            options.data = data;
            options.index = index;
            options.isDataRow = true;
            options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
            var dummies = this.ensureColumns();
            for (var _i = 0, dummies_1 = dummies; _i < dummies_1.length; _i++) {
                var dummy = dummies_1[_i];
                tmp.push(this.generateCell(dummy, options.uid));
            }
            var row = new row_1.Row(options);
            row.cells = tmp;
            return row;
        };
        RowModelGenerator.prototype.generateCell = function (column, rowId, cellType, colSpan) {
            var opt = {
                'visible': column.visible,
                'isDataCell': !util_1.isNullOrUndefined(column.field || column.template),
                'isTemplate': !util_1.isNullOrUndefined(column.template),
                'rowID': rowId,
                'column': column,
                'cellType': !util_1.isNullOrUndefined(cellType) ? cellType : enum_1.CellType.Data,
                'colSpan': colSpan
            };
            if (opt.isDataCell) {
                opt.index = this.parent.getColumnIndexByField(column.field);
            }
            return new cell_1.Cell(opt);
        };
        return RowModelGenerator;
    }());
    exports.RowModelGenerator = RowModelGenerator;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 64 */
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
/* 65 */
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
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(20), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, ej2_data_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Data = (function () {
        function Data(parent) {
            this.parent = parent;
            this.initDataManager();
            this.parent.on(events.rowsAdded, this.addRows, this);
            this.parent.on(events.rowsRemoved, this.removeRows, this);
            this.parent.on(events.dataSourceModified, this.initDataManager, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
        Data.prototype.initDataManager = function () {
            var gObj = this.parent;
            this.dataManager = gObj.dataSource instanceof ej2_data_1.DataManager ? gObj.dataSource :
                (util_1.isNullOrUndefined(gObj.dataSource) ? new ej2_data_1.DataManager() : new ej2_data_1.DataManager(gObj.dataSource));
            this.query = gObj.query instanceof ej2_data_1.Query ? gObj.query : new ej2_data_1.Query();
        };
        Data.prototype.generateQuery = function () {
            var gObj = this.parent;
            var query = this.query.clone();
            if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
                var columns = gObj.filterSettings.columns;
                for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    var col = columns_1[_i];
                    var sType = gObj.getColumnByField(col.field).type;
                    if (sType !== 'date' && sType !== 'datetime') {
                        query.where(col.field, col.operator, col.value, !col.matchCase);
                    }
                    else {
                        query.where(this.getDatePredicate(col));
                    }
                }
            }
            if (gObj.searchSettings.key.length) {
                var sSettings = gObj.searchSettings;
                sSettings.fields = sSettings.fields.length ? sSettings.fields : gObj.getColumnFieldNames();
                query.search(sSettings.key, sSettings.fields, sSettings.operator, sSettings.ignoreCase);
            }
            if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
                var columns = gObj.sortSettings.columns;
                var sortGrp = [];
                for (var i = columns.length - 1; i > -1; i--) {
                    if (gObj.groupSettings.columns.indexOf(columns[i].field) === -1) {
                        query.sortBy(columns[i].field, columns[i].direction);
                    }
                    else {
                        sortGrp.push(columns[i]);
                    }
                }
                for (var i = 0, len = sortGrp.length; i < len; i++) {
                    query.sortBy(sortGrp[i].field, sortGrp[i].direction);
                }
            }
            if (gObj.allowPaging) {
                query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
            }
            if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
                var columns = gObj.groupSettings.columns;
                for (var i = 0, len = columns.length; i < len; i++) {
                    query.group(columns[i]);
                }
            }
            return query;
        };
        Data.prototype.getData = function (query) {
            return this.dataManager.executeQuery(query);
        };
        Data.prototype.getDatePredicate = function (filterObject) {
            var prevDate;
            var nextDate;
            var prevObj = util_1.extend({}, util_2.getActualProperties(filterObject));
            var nextObj = util_1.extend({}, util_2.getActualProperties(filterObject));
            var value = new Date(filterObject.value);
            prevDate = new Date(value.setDate(value.getDate() - 1));
            nextDate = new Date(value.setDate(value.getDate() + 2));
            prevObj.value = prevDate;
            nextObj.value = nextDate;
            if (filterObject.operator === 'equal') {
                prevObj.operator = 'greaterthan';
                nextObj.operator = 'lessthan';
            }
            else {
                prevObj.operator = 'lessthanorequal';
                nextObj.operator = 'greaterthanorequal';
            }
            var predicateSt = new ej2_data_1.Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
            var predicateEnd = new ej2_data_1.Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
            return filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
        };
        Data.prototype.addRows = function (e) {
            for (var i = e.records.length; i > 0; i--) {
                this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
            }
        };
        Data.prototype.removeRows = function (e) {
            var json = this.dataManager.dataSource.json;
            this.dataManager.dataSource.json = json.filter(function (value, index) { return e.indexes.indexOf(index) === -1; });
        };
        Data.prototype.destroy = function () {
            this.parent.off(events.rowsAdded, this.addRows);
            this.parent.off(events.rowsRemoved, this.removeRows);
            this.parent.off(events.dataSourceModified, this.initDataManager);
            this.parent.off(events.dataSourceModified, this.destroy);
        };
        return Data;
    }());
    exports.Data = Data;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(0), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, util_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Print = (function () {
        function Print(parent, scrollModule) {
            this.parent = parent;
            this.parent.on(events.contentReady, this.contentReady.bind(this));
            this.scrollModule = scrollModule;
        }
        Print.prototype.print = function () {
            var gObj = this.parent;
            this.isPrinting = true;
            this.element = gObj.element.cloneNode(true);
            this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
            this.printWindow.moveTo(0, 0);
            this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
            if (gObj.allowPaging) {
                if (gObj.printMode === 'currentpage') {
                    this.element.querySelector('.e-gridpager').style.display = 'none';
                    this.contentReady();
                }
                else {
                    this.isPagerDisabled = true;
                    gObj.allowPaging = false;
                    gObj.dataBind();
                }
            }
            else {
                this.contentReady();
            }
        };
        Print.prototype.contentReady = function () {
            var gObj = this.parent;
            if (!this.isPrinting) {
                return;
            }
            if (this.isPagerDisabled) {
                this.element = gObj.element.cloneNode(true);
                this.isPagerDisabled = false;
                gObj.allowPaging = true;
            }
            if (gObj.height !== 'auto') {
                var cssProps = this.scrollModule.getCssProperties();
                var contentDiv = this.element.querySelector('.e-content');
                var headerDiv = this.element.querySelector('.e-gridheader');
                contentDiv.style.height = 'auto';
                contentDiv.style.overflowY = 'auto';
                headerDiv.style[cssProps.padding] = '';
                headerDiv.firstElementChild.style[cssProps.border] = '';
            }
            if (gObj.allowGrouping) {
                if (!gObj.groupSettings.columns.length) {
                    this.element.querySelector('.e-groupdroparea').style.display = 'none';
                }
                else {
                    this.removeColGroup(gObj.groupSettings.columns.length);
                    util_2.removeElement(this.element, '.e-grouptopleftcell');
                    util_2.removeElement(this.element, '.e-recordpluscollapse');
                    util_2.removeElement(this.element, '.e-indentcell');
                    util_2.removeElement(this.element, '.e-recordplusexpand');
                }
            }
            if (gObj.allowFiltering && gObj.filterSettings.type === 'filterbar') {
                this.element.querySelector('.e-filterbar').style.display = 'none';
            }
            if (gObj.allowSelection) {
                dom_1.removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
                dom_1.removeClass(this.element.querySelectorAll('.e-cellselection1background'), 'e-cellselection1background');
            }
            var args = {
                requestType: 'print', element: this.element,
                selectedRows: gObj.getContentTable().querySelectorAll('tr[aria-selected="true"]')
            };
            gObj.trigger(events.beforePrint, args);
            util_1.print(this.element, this.printWindow);
            this.isPrinting = false;
            gObj.trigger(events.printComplete, args);
        };
        Print.prototype.removeColGroup = function (depth) {
            var groupCaption = this.element.querySelectorAll('.e-groupcaption');
            var colSpan = groupCaption[depth - 1].getAttribute('colspan');
            for (var i = 0; i < groupCaption.length; i++) {
                groupCaption[i].setAttribute('colspan', colSpan);
            }
            var colGroups = this.element.querySelectorAll('colgroup');
            for (var i = 0; i < colGroups.length; i++) {
                for (var j = 0; j < depth; j++) {
                    colGroups[i].childNodes[j].style.display = 'none';
                }
            }
        };
        Print.prototype.destroy = function () {
        };
        Print.prototype.getModuleName = function () {
            return 'print';
        };
        return Print;
    }());
    exports.Print = Print;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(15), __webpack_require__(94)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, dom_1, util_1, constant_1, width_controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scroll = (function () {
        function Scroll(parent) {
            this.lastScrollTop = 0;
            this.previousValues = { top: 0, left: 0 };
            this.oneTimeReady = true;
            this.parent = parent;
            this.widthService = new width_controller_1.ColumnWidthService(parent);
            this.addEventListener();
        }
        Scroll.prototype.getModuleName = function () {
            return 'scroll';
        };
        Scroll.prototype.setWidth = function () {
            this.parent.element.style.width = util_1.formatUnit(this.parent.width);
        };
        Scroll.prototype.setHeight = function () {
            var content = this.parent.getContent().firstChild;
            content.style.height = util_1.formatUnit(this.parent.height);
            this.ensureOverflow(content);
        };
        Scroll.prototype.setPadding = function () {
            var content = this.parent.getHeaderContent();
            var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
            var cssProps = this.getCssProperties();
            content.firstChild.style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
            content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        };
        Scroll.prototype.removePadding = function (rtl) {
            var cssProps = this.getCssProperties(rtl);
            this.parent.getHeaderContent().firstChild.style[cssProps.border] = '';
            this.parent.getHeaderContent().firstChild.parentElement.style[cssProps.padding] = '';
        };
        Scroll.prototype.refresh = function () {
            if (this.parent.height !== '100%') {
                return;
            }
            var content = this.parent.getContent();
            this.parent.element.style.height = '100%';
            var height = this.widthService.getSiblingsHeight(content);
            content.style.height = 'calc(100% - ' + height + 'px)';
        };
        Scroll.prototype.getThreshold = function () {
            var appName = ej2_base_1.Browser.info.name;
            if (appName === 'mozilla') {
                return 0.5;
            }
            return 1;
        };
        Scroll.prototype.addEventListener = function () {
            this.parent.on(constant_1.contentReady, this.wireEvents, this);
            this.parent.on(constant_1.uiUpdate, this.onPropertyChanged, this);
        };
        Scroll.prototype.removeEventListener = function () {
            this.parent.off(constant_1.contentReady, this.wireEvents);
            this.parent.off(constant_1.uiUpdate, this.onPropertyChanged);
        };
        Scroll.prototype.onContentScroll = function (scrollTarget) {
            var _this = this;
            var element = scrollTarget;
            var isHeader = element.classList.contains('e-headercontent');
            return function (e) {
                if (_this.content.querySelector('tbody') === null) {
                    return;
                }
                var target = e.target;
                var left = target.scrollLeft;
                var sLimit = target.scrollWidth;
                if (_this.previousValues.left === left) {
                    _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                    return;
                }
                element.scrollLeft = left;
                _this.previousValues.left = left;
            };
        };
        Scroll.prototype.wireEvents = function () {
            if (this.oneTimeReady) {
                this.content = this.parent.getContent().firstChild;
                this.header = this.parent.getHeaderContent().firstChild;
                ej2_base_1.EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                ej2_base_1.EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
                this.refresh();
                this.oneTimeReady = false;
            }
            var table = this.parent.getContentTable();
            if (table.scrollHeight < this.parent.getContent().clientHeight) {
                dom_1.addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
            }
            this.content.scrollTop = this.previousValues.top;
            this.content.scrollLeft = this.previousValues.left;
        };
        Scroll.prototype.getCssProperties = function (rtl) {
            var css = {};
            var enableRtl = util_1.isNullOrUndefined(rtl) ? this.parent.enableRtl : rtl;
            css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
            css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
            return css;
        };
        Scroll.prototype.ensureOverflow = function (content) {
            content.style.overflowY = this.parent.height === 'auto' ? 'auto' : 'scroll';
        };
        Scroll.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            this.setPadding();
            this.oneTimeReady = true;
            if (this.parent.height === 'auto') {
                this.removePadding();
            }
            this.wireEvents();
            this.setHeight();
            this.setWidth();
        };
        Scroll.prototype.destroy = function () {
            this.removeEventListener();
            this.removePadding();
            dom_1.removeClass([this.parent.getHeaderContent().firstChild], 'e-headercontent');
            dom_1.removeClass([this.parent.getContent().firstChild], 'e-content');
            this.parent.getContent().firstChild.style.height = '';
            this.parent.element.style.width = '';
            ej2_base_1.EventHandler.remove(this.parent.getContent().firstChild, 'scroll', this.onContentScroll);
        };
        Scroll.getScrollBarWidth = function () {
            var divNode = document.createElement('div');
            var value = 0;
            divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
            document.body.appendChild(divNode);
            value = (divNode.offsetWidth - divNode.clientWidth) | 0;
            document.body.removeChild(divNode);
            return value;
        };
        return Scroll;
    }());
    exports.Scroll = Scroll;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Search = (function () {
        function Search(parent) {
            this.parent = parent;
            this.addEventListener();
        }
        Search.prototype.search = function (searchString) {
            var gObj = this.parent;
            searchString = searchString.toLowerCase();
            if (searchString !== this.parent.searchSettings.key) {
                this.parent.searchSettings.key = searchString;
                this.parent.dataBind();
            }
        };
        Search.prototype.addEventListener = function () {
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.searchComplete, this.onActionComplete, this);
            this.parent.on(events.destroy, this.destroy, this);
        };
        Search.prototype.removeEventListener = function () {
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.searchComplete, this.onActionComplete);
            this.parent.off(events.destroy, this.destroy);
        };
        Search.prototype.destroy = function () {
            this.removeEventListener();
        };
        Search.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            if (!util_1.isNullOrUndefined(e.properties.key)) {
                this.parent.notify(events.modelChanged, {
                    requestType: 'searching', type: events.actionBegin, searchString: this.parent.searchSettings.key
                });
            }
            else {
                this.parent.notify(events.modelChanged, {
                    requestType: 'searching', type: events.actionBegin
                });
            }
        };
        Search.prototype.onActionComplete = function (e) {
            this.parent.trigger(events.actionComplete, util_1.extend(e, {
                searchString: this.parent.searchSettings.key, requestType: 'searching', type: events.actionComplete
            }));
        };
        Search.prototype.getModuleName = function () {
            return 'search';
        };
        return Search;
    }());
    exports.Search = Search;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 84 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroupCaptionCellRenderer = (function (_super) {
        __extends(GroupCaptionCellRenderer, _super);
        function GroupCaptionCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TD', { className: 'e-groupcaption' });
            return _this;
        }
        GroupCaptionCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            var value = this.format(cell.column, cell.column.valueAccessor('key', data, cell.column));
            node.innerHTML = data.field + ': ' + value + ' - ' + data.count + ' ' + (data.count < 2 ? 'item' : 'items');
            node.setAttribute('colspan', cell.colSpan.toString());
            return node;
        };
        return GroupCaptionCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.GroupCaptionCellRenderer = GroupCaptionCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(15), __webpack_require__(51), __webpack_require__(63), __webpack_require__(91)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, util_2, events, row_renderer_1, row_model_generator_1, group_model_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentRender = (function () {
        function ContentRender(parent, serviceLocator) {
            this.rows = [];
            this.parent = parent;
            this.serviceLocator = serviceLocator;
            this.ariaService = this.serviceLocator.getService('ariaService');
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
            this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
        }
        ContentRender.prototype.renderPanel = function () {
            var gObj = this.parent;
            var div = dom_1.createElement('div', { className: 'e-gridcontent' });
            var innerDiv = dom_1.createElement('div', {
                className: 'e-content'
            });
            if (!ej2_base_1.Browser.isDevice) {
                innerDiv.setAttribute('tabindex', '0');
            }
            this.ariaService.setOptions(innerDiv, { busy: false });
            div.appendChild(innerDiv);
            this.setPanel(div);
            gObj.element.appendChild(div);
        };
        ContentRender.prototype.renderTable = function () {
            var contentDiv = this.getPanel();
            contentDiv.appendChild(this.createContentTable());
            this.setTable(contentDiv.querySelector('.e-table'));
            this.ariaService.setOptions(this.getTable(), {
                multiselectable: this.parent.selectionSettings.type === 'multiple'
            });
            this.initializeContentDrop();
        };
        ContentRender.prototype.createContentTable = function () {
            var innerDiv = this.getPanel().firstChild;
            var table = dom_1.createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
            this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
            table.appendChild(this.getColGroup());
            table.appendChild(dom_1.createElement('tbody'));
            innerDiv.appendChild(table);
            return innerDiv;
        };
        ContentRender.prototype.refreshContentRows = function (args) {
            var _this = this;
            var gObj = this.parent;
            var dataSource = gObj.currentViewData;
            var frag = document.createDocumentFragment();
            var columns = gObj.getColumns();
            var tr;
            var row = new row_renderer_1.RowRenderer(this.serviceLocator, null, this.parent);
            this.rowElements = [];
            var model = gObj.allowGrouping && gObj.groupSettings.columns.length ?
                new group_model_generator_1.GroupModelGenerator(this.parent) : new row_model_generator_1.RowModelGenerator(this.parent);
            var modelData = model.generateRows(dataSource);
            var tbody = this.getTable().querySelector('tbody');
            for (var i = 0, len = modelData.length; i < len; i++) {
                if (!gObj.rowTemplate) {
                    tr = row.render(modelData[i], columns);
                }
                else {
                    var elem = dom_1.createElement('div', {
                        innerHTML: '<table><tbody>' + gObj.getRowTemplate()(util_1.extend({ index: i }, dataSource[i])) + '</tbody></table>'
                    });
                    tr = elem.querySelector('tbody').firstElementChild;
                }
                frag.appendChild(tr);
                this.rows.push(modelData[i]);
                this.rowElements.push(tr);
                this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
            }
            util_2.getUpdateUsingRaf(function () {
                dom_1.remove(tbody);
                tbody = dom_1.createElement('tbody');
                tbody.appendChild(frag);
                _this.getTable().appendChild(tbody);
            }, function () {
                _this.ariaService.setBusy(_this.getPanel().firstChild, false);
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.notify(events.contentReady, {});
                _this.parent.trigger(events.dataBound, {});
                if (args) {
                    var action = (args.requestType || '').toLowerCase() + '-complete';
                    _this.parent.notify(action, args);
                }
            });
        };
        ContentRender.prototype.getPanel = function () {
            return this.contentPanel;
        };
        ContentRender.prototype.setPanel = function (panel) {
            this.contentPanel = panel;
        };
        ContentRender.prototype.getTable = function () {
            return this.contentTable;
        };
        ContentRender.prototype.setTable = function (table) {
            this.contentTable = table;
        };
        ContentRender.prototype.getRows = function () {
            return this.rows;
        };
        ContentRender.prototype.getRowElements = function () {
            return this.rowElements;
        };
        ContentRender.prototype.getColGroup = function () {
            return this.colgroup;
        };
        ContentRender.prototype.setColGroup = function (colGroup) {
            return this.colgroup = colGroup;
        };
        ContentRender.prototype.setVisible = function (columns) {
            var rows = this.getRows();
            var element;
            var testRow;
            rows.some(function (r) { if (r.isDataRow) {
                testRow = r;
            } return r.isDataRow; });
            var tasks = [];
            for (var c = 0, clen = columns.length; c < clen; c++) {
                var column = columns[c];
                var idx = this.parent.getNormalizedColumnIndex(column.uid);
                if (this.canSkip(column, testRow, idx)) {
                    continue;
                }
                var displayVal = column.visible === true ? '' : 'none';
                dom_1.setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
            }
            this.refreshContentRows({ requestType: 'refresh' });
        };
        ContentRender.prototype.colGroupRefresh = function () {
            if (this.getColGroup()) {
                var colGroup = this.getColGroup();
                colGroup.innerHTML = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').innerHTML;
                this.setColGroup(colGroup);
            }
        };
        ContentRender.prototype.initializeContentDrop = function () {
            var gObj = this.parent;
            var drop = new ej2_base_1.Droppable(gObj.getContent(), {
                accept: '.e-dragclone',
                drop: function (e) {
                    gObj.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
                    dom_1.remove(e.droppedElement);
                }
            });
        };
        ContentRender.prototype.canSkip = function (column, row, index) {
            return util_1.isNullOrUndefined(row) ||
                util_1.isNullOrUndefined(column.visible) ||
                row.cells[index].visible === column.visible;
        };
        return ContentRender;
    }());
    exports.ContentRender = ContentRender;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 86 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(24), __webpack_require__(52)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, util_2, cell_renderer_1, aria_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderCellRenderer = (function (_super) {
        __extends(HeaderCellRenderer, _super);
        function HeaderCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-headercell', attrs: { role: 'columnheader' } });
            _this.ariaService = new aria_service_1.AriaService();
            return _this;
        }
        HeaderCellRenderer.prototype.getGui = function () {
            return dom_1.createElement('div');
        };
        HeaderCellRenderer.prototype.render = function (cell, data, attributes) {
            var node = this.element.cloneNode();
            return this.prepareHeader(cell, node);
        };
        HeaderCellRenderer.prototype.refresh = function (cell, node) {
            this.clean(node);
            return this.prepareHeader(cell, node);
        };
        HeaderCellRenderer.prototype.clean = function (node) {
            node.innerHTML = '';
        };
        HeaderCellRenderer.prototype.prepareHeader = function (cell, node) {
            var column = cell.column;
            var ariaAttr = {};
            var innerDIV = this.getGui();
            var value = column.headerText;
            var headerText = dom_1.createElement('span', { className: 'e-headertext' });
            headerText[column.getDomSetter()] = value;
            innerDIV.appendChild(headerText);
            dom_1.attributes(innerDIV, {
                'e-mappinguid': column.uid,
                'class': 'e-headercelldiv'
            });
            this.buildAttributeFromCell(node, cell);
            this.appendHtml(node, innerDIV);
            node.appendChild(dom_1.createElement('div', { className: 'e-sortfilterdiv e-icons' }));
            if (cell.className) {
                node.classList.add(cell.className);
            }
            if (column.customAttributes) {
                util_2.setStyleAndAttributes(node, column.customAttributes);
            }
            if (column.allowSorting) {
                ariaAttr.sort = 'none';
            }
            if (column.allowGrouping) {
                ariaAttr.grabbed = false;
            }
            this.ariaService.setOptions(node, ariaAttr);
            if (!util_1.isNullOrUndefined(column.headerTextAlign) || !util_1.isNullOrUndefined(column.textAlign)) {
                var alignment = column.headerTextAlign || column.textAlign;
                innerDIV.style.textAlign = alignment;
                if (alignment === 'right' || alignment === 'left') {
                    node.classList.add(alignment === 'right' ? 'e-rightalign' : 'e-leftalign');
                }
            }
            node.setAttribute('aria-rowspan', (!util_1.isNullOrUndefined(cell.rowSpan) ? cell.rowSpan : 1).toString());
            node.setAttribute('aria-colspan', '1');
            return node;
        };
        HeaderCellRenderer.prototype.appendHtml = function (node, innerHtml) {
            node.appendChild(innerHtml);
            return node;
        };
        return HeaderCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.HeaderCellRenderer = HeaderCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(2), __webpack_require__(19), __webpack_require__(51), __webpack_require__(59), __webpack_require__(50), __webpack_require__(15), __webpack_require__(1), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, dom_2, enum_1, row_renderer_1, cell_1, row_1, events, ej2_base_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderRender = (function () {
        function HeaderRender(parent, serviceLocator) {
            this.parent = parent;
            this.serviceLocator = serviceLocator;
            this.ariaService = this.serviceLocator.getService('ariaService');
            this.widthService = this.serviceLocator.getService('widthService');
            this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
            this.parent.on(events.columnPositionChanged, this.refreshUI, this);
        }
        HeaderRender.prototype.renderPanel = function () {
            var div = dom_1.createElement('div', { className: 'e-gridheader' });
            var innerDiv = dom_1.createElement('div', { className: 'e-headercontent' });
            div.appendChild(innerDiv);
            this.setPanel(div);
            this.parent.element.appendChild(div);
        };
        HeaderRender.prototype.renderTable = function () {
            var headerDiv = this.getPanel();
            headerDiv.appendChild(this.createHeaderTable());
            this.setTable(headerDiv.querySelector('.e-table'));
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
            this.parent.notify(events.headerRefreshed, {});
        };
        HeaderRender.prototype.getPanel = function () {
            return this.headerPanel;
        };
        HeaderRender.prototype.setPanel = function (panel) {
            this.headerPanel = panel;
        };
        HeaderRender.prototype.getTable = function () {
            return this.headerTable;
        };
        HeaderRender.prototype.setTable = function (table) {
            this.headerTable = table;
        };
        HeaderRender.prototype.getColGroup = function () {
            return this.colgroup;
        };
        HeaderRender.prototype.setColGroup = function (colGroup) {
            return this.colgroup = colGroup;
        };
        HeaderRender.prototype.getRows = function () {
            var table = this.getTable();
            return table.tHead.rows;
        };
        HeaderRender.prototype.createHeaderTable = function () {
            var gObj = this.parent;
            var columns = gObj.getColumns();
            var table = dom_1.createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
            var innerDiv = this.getPanel().firstChild;
            var thead = dom_1.createElement('thead');
            var tbody = dom_1.createElement('tbody', { className: 'e-hide' });
            var colHeader = dom_1.createElement('tr', { className: 'e-columnheader' });
            var colGroup = dom_1.createElement('colgroup');
            var rowBody = dom_1.createElement('tr');
            var bodyCell;
            var rowRenderer = new row_renderer_1.RowRenderer(this.serviceLocator, enum_1.CellType.Header);
            rowRenderer.element = colHeader;
            var rows = [];
            var headerRow;
            this.colDepth = this.getObjDepth();
            for (var i = 0, len = this.colDepth; i < len; i++) {
                rows[i] = this.generateRow(i);
                rows[i].cells = [];
            }
            rows = this.ensureColumns(rows);
            rows = this.getHeaderCells(rows);
            for (var i = 0, len = this.colDepth; i < len; i++) {
                headerRow = rowRenderer.render(rows[i], columns);
                thead.appendChild(headerRow);
            }
            for (var i = 0, len = rows.length; i < len; i++) {
                for (var j = 0, len_1 = rows[i].cells.length; j < len_1; j++) {
                    var cell = rows[i].cells[j];
                    bodyCell = dom_1.createElement('td');
                    rowBody.appendChild(bodyCell);
                }
            }
            if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
                table.classList.add('e-sortfilter');
            }
            this.updateColGroup(colGroup);
            tbody.appendChild(rowBody);
            table.appendChild(this.setColGroup(colGroup));
            table.appendChild(thead);
            table.appendChild(tbody);
            innerDiv.appendChild(table);
            this.ariaService.setOptions(table, { colcount: gObj.getColumns().length.toString() });
            return innerDiv;
        };
        HeaderRender.prototype.updateColGroup = function (colGroup) {
            var cols = this.parent.getColumns();
            var col;
            if (this.parent.allowGrouping) {
                for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                    col = dom_1.createElement('col');
                    colGroup.appendChild(col);
                }
            }
            for (var i = 0, len = cols.length; i < len; i++) {
                col = dom_1.createElement('col');
                if (cols[i].visible === false) {
                    dom_1.setStyleAttribute(col, { 'display': 'none' });
                }
                colGroup.appendChild(col);
            }
            return colGroup;
        };
        HeaderRender.prototype.ensureColumns = function (rows) {
            var gObj = this.parent;
            for (var i = 0, len = rows.length; i < len; i++) {
                if (this.parent.allowGrouping) {
                    for (var c = 0, len_2 = gObj.groupSettings.columns.length; c < len_2; c++) {
                        rows[i].cells.push(this.generateCell({}, enum_1.CellType.HeaderIndent));
                    }
                }
            }
            return rows;
        };
        HeaderRender.prototype.getHeaderCells = function (rows) {
            var cols = this.parent.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                rows = this.appendCells(cols[i], rows, 0, i === 0, false);
            }
            return rows;
        };
        HeaderRender.prototype.appendCells = function (cols, rows, index, isFirstObj, isFirstCol) {
            if (!cols.columns) {
                var col = this.parent.getColumnByField(cols.field);
                rows[index].cells.push(this.generateCell(col, enum_1.CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')), index, this.parent.getColumnIndexByUid(col.uid)));
            }
            else {
                var colSpan = this.getCellCnt(cols, 0);
                if (colSpan) {
                    rows[index].cells.push(new cell_1.Cell({
                        cellType: enum_1.CellType.StackedHeader, column: cols, colSpan: colSpan
                    }));
                }
                for (var i = 0, len = cols.columns.length; i < len; i++) {
                    rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, i === 0);
                }
            }
            return rows;
        };
        HeaderRender.prototype.generateRow = function (index) {
            return new row_1.Row({});
        };
        HeaderRender.prototype.generateCell = function (column, cellType, rowSpan, className, rowIndex, colIndex) {
            var opt = {
                'visible': column.visible,
                'isDataCell': false,
                'isTemplate': !util_1.isNullOrUndefined(column.headerTemplate),
                'rowID': '',
                'column': column,
                'cellType': cellType,
                'rowSpan': rowSpan,
                'className': className,
                'index': rowIndex,
                'colIndex': colIndex
            };
            if (!opt.rowSpan || opt.rowSpan < 2) {
                delete opt.rowSpan;
            }
            return new cell_1.Cell(opt);
        };
        HeaderRender.prototype.setVisible = function (columns) {
            var rows = [].slice.call(this.getRows());
            var displayVal = '';
            var idx;
            var className;
            var element;
            for (var c = 0, clen = columns.length; c < clen; c++) {
                var column = columns[c];
                idx = this.parent.getNormalizedColumnIndex(column.uid);
                if (column.visible === false) {
                    displayVal = 'none';
                }
                dom_1.setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
                this.refreshUI();
            }
        };
        HeaderRender.prototype.refreshUI = function () {
            var headerDiv = this.getPanel();
            headerDiv.firstElementChild.innerHTML = '';
            headerDiv.appendChild(this.createHeaderTable());
            this.setTable(headerDiv.querySelector('.e-table'));
            this.parent.notify(events.colGroupRefresh, {});
            this.widthService.setWidthToColumns();
            this.initializeHeaderDrag();
            this.parent.notify(events.headerRefreshed, {});
        };
        HeaderRender.prototype.getObjDepth = function () {
            var max = 0;
            var cols = this.parent.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                var depth = this.checkDepth(cols[i], 0);
                if (max < depth) {
                    max = depth;
                }
            }
            return max + 1;
        };
        HeaderRender.prototype.checkDepth = function (col, index) {
            if (col.columns) {
                index++;
                for (var i = 0, len = col.columns.length; i < len; i++) {
                    index = this.checkDepth(col.columns[i], index);
                }
            }
            return index;
        };
        HeaderRender.prototype.getCellCnt = function (col, cnt) {
            if (col.columns) {
                for (var i = 0, len = col.columns.length; i < len; i++) {
                    cnt = this.getCellCnt(col.columns[i], cnt);
                }
            }
            else {
                if (col.visible) {
                    cnt++;
                }
            }
            return cnt;
        };
        HeaderRender.prototype.initializeHeaderDrag = function () {
            var _this = this;
            var gObj = this.parent;
            var column;
            if (!(this.parent.allowReordering || this.parent.allowGrouping)) {
                return;
            }
            var headerRows = [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnheader'));
            for (var i = 0, len = headerRows.length; i < len; i++) {
                var drag = new ej2_base_1.Draggable(headerRows[i], {
                    dragTarget: '.e-headercell',
                    distance: 5,
                    helper: function (e) {
                        if (!(gObj.allowReordering || gObj.allowGrouping)) {
                            return false;
                        }
                        var visualElement = dom_1.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
                        var target = e.sender.target;
                        var element = target.classList.contains('e-headercell') ? target :
                            util_2.parentsUntil(target, 'e-headercell');
                        if (!element) {
                            return false;
                        }
                        var height = element.offsetHeight;
                        var headercelldiv = element.querySelector('.e-headercelldiv');
                        visualElement.textContent = headercelldiv ?
                            gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid')).headerText : element.innerHTML;
                        visualElement.style.width = element.offsetWidth + 'px';
                        visualElement.style.height = element.offsetHeight + 'px';
                        visualElement.style.lineHeight = (height - 6).toString() + 'px';
                        if (element.querySelector('.e-headercelldiv')) {
                            column = gObj.getColumnByUid(element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
                            visualElement.setAttribute('e-mappinguid', column.uid);
                        }
                        gObj.element.appendChild(visualElement);
                        return visualElement;
                    },
                    dragStart: function (e) {
                        gObj.element.querySelector('.e-gridpopup').style.display = 'none';
                        gObj.notify(events.columnDragStart, { target: e.target, column: column, event: e.event });
                    },
                    drag: function (e) {
                        var target = e.target;
                        if (target) {
                            var closest = dom_1.closest(target, '.e-grid');
                            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                            if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                                dom_2.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                                if (gObj.allowReordering) {
                                    gObj.element.querySelector('.e-reorderuparrow').style.display = 'none';
                                    gObj.element.querySelector('.e-reorderdownarrow').style.display = 'none';
                                }
                                return;
                            }
                            gObj.notify(events.columnDrag, { target: e.target, column: column, event: e.event });
                        }
                    },
                    dragStop: function (e) {
                        var cancel;
                        gObj.element.querySelector('.e-gridpopup').style.display = 'none';
                        if ((!util_2.parentsUntil(e.target, 'e-headercell') && !util_2.parentsUntil(e.target, 'e-groupdroparea')) ||
                            (!gObj.allowReordering && util_2.parentsUntil(e.target, 'e-headercell')) ||
                            (!e.helper.getAttribute('e-mappinguid') && util_2.parentsUntil(e.target, 'e-groupdroparea'))) {
                            dom_1.remove(e.helper);
                            cancel = true;
                        }
                        gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: column, cancel: cancel });
                    }
                });
            }
        };
        HeaderRender.prototype.initializeHeaderDrop = function () {
            var gObj = this.parent;
            var drop = new ej2_base_1.Droppable(gObj.getHeaderContent(), {
                accept: '.e-dragclone',
                drop: function (e) {
                    var uid = e.droppedElement.getAttribute('e-mappinguid');
                    var closest = dom_1.closest(e.target, '.e-grid');
                    dom_1.remove(e.droppedElement);
                    if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
                        !(gObj.allowReordering || gObj.allowGrouping)) {
                        return;
                    }
                    gObj.notify(events.headerDrop, { target: e.target, uid: uid });
                }
            });
        };
        return HeaderRender;
    }());
    exports.HeaderRender = HeaderRender;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(0), __webpack_require__(19), __webpack_require__(80), __webpack_require__(15), __webpack_require__(12), __webpack_require__(85), __webpack_require__(87), __webpack_require__(24), __webpack_require__(86), __webpack_require__(89), __webpack_require__(62), __webpack_require__(84), __webpack_require__(177), __webpack_require__(178)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, util_1, enum_1, data_1, events, util_2, content_renderer_1, header_renderer_1, cell_renderer_1, header_cell_renderer_1, stacked_cell_renderer_1, indent_cell_renderer_1, caption_cell_renderer_1, expand_cell_renderer_1, header_indent_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Render = (function () {
        function Render(parent, locator) {
            this.parent = parent;
            this.locator = locator;
            this.data = new data_1.Data(parent);
            this.l10n = locator.getService('localization');
            this.ariaService = this.locator.getService('ariaService');
            this.addEventListener();
        }
        Render.prototype.render = function () {
            var gObj = this.parent;
            this.headerRenderer.renderPanel();
            this.contentRenderer.renderPanel();
            if (gObj.getColumns().length) {
                this.headerRenderer.renderTable();
                this.contentRenderer.renderTable();
                this.emptyRow(false);
            }
            this.refreshDataManager();
        };
        Render.prototype.refresh = function (e) {
            if (e === void 0) { e = { requestType: 'refresh' }; }
            this.parent.trigger(events.actionBegin, e);
            this.refreshDataManager(e);
        };
        Render.prototype.refreshComplete = function (e) {
            this.parent.trigger(events.actionComplete, e);
        };
        Render.prototype.refreshDataManager = function (args) {
            var _this = this;
            this.ariaService.setBusy(this.parent.getContent().firstChild, true);
            var dataManager = this.data.getData(this.data.generateQuery().requiresCount());
            dataManager.then(function (e) { return _this.dataManagerSuccess(e, args); })
                .catch(function (e) { return _this.dataManagerFailure(e); });
        };
        Render.prototype.renderEmptyRow = function () {
            this.emptyRow(true);
        };
        Render.prototype.emptyRow = function (isTrigger) {
            var gObj = this.parent;
            var tbody = this.contentRenderer.getTable().querySelector('tbody');
            var tr;
            dom_1.remove(tbody);
            tbody = dom_1.createElement('tbody');
            tr = dom_1.createElement('tr', { className: 'e-emptyrow' });
            tr.appendChild(dom_1.createElement('td', {
                innerHTML: this.l10n.getConstant('EmptyRecord'),
                attrs: { colspan: gObj.getColumns().length.toString() }
            }));
            tbody.appendChild(tr);
            this.contentRenderer.getTable().appendChild(tbody);
            if (isTrigger) {
                this.parent.trigger(events.dataBound, {});
            }
        };
        Render.prototype.updateColumnType = function (record) {
            var columns = this.parent.getColumns();
            var value;
            var fmtr = this.locator.getService('valueFormatter');
            for (var i = 0, len = columns.length; i < len; i++) {
                value = util_1.getValue(columns[i].field || '', record);
                if (!util_1.isNullOrUndefined(value)) {
                    this.isColTypeDef = true;
                    if (!columns[i].type) {
                        columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                    }
                    if (typeof (columns[i].format) === 'string') {
                        switch (columns[i].type) {
                            case 'date':
                                columns[i].setFormatter(fmtr.getFormatFunction({ type: 'date', skeleton: columns[i].format }));
                                columns[i].setParser(fmtr.getParserFunction({ type: 'date', skeleton: columns[i].format }));
                                break;
                            case 'datetime':
                                columns[i].setFormatter(fmtr.getFormatFunction({ type: 'dateTime', skeleton: columns[i].format }));
                                columns[i].setParser(fmtr.getParserFunction({ type: 'dateTime', skeleton: columns[i].format }));
                                break;
                            case 'number':
                                columns[i].setFormatter(fmtr.getFormatFunction({ format: columns[i].format }));
                                columns[i].setParser(fmtr.getParserFunction({ format: columns[i].format }));
                                break;
                        }
                    }
                    else if (!columns[i].format && columns[i].type === 'number') {
                        columns[i].setParser(fmtr.getParserFunction({ format: 'n2' }));
                    }
                }
                else {
                    columns[i].type = columns[i].type || null;
                }
            }
        };
        Render.prototype.dataManagerSuccess = function (e, args) {
            var gObj = this.parent;
            var len = Object.keys(e.result).length;
            if (this.parent.isDestroyed) {
                return;
            }
            gObj.currentViewData = e.result;
            if (!len && e.count && gObj.allowPaging) {
                gObj.pageSettings.currentPage = Math.ceil(e.count / gObj.pageSettings.pageSize);
                gObj.dataBind();
                return;
            }
            if (!gObj.getColumns().length && len) {
                this.updatesOnInitialRender(e);
            }
            if (!this.isColTypeDef) {
                this.updateColumnType(e.result[0]);
            }
            this.parent.notify(events.dataReady, { count: e.count, result: e.result });
            if (gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping')) {
                this.headerRenderer.refreshUI();
            }
            if (len) {
                this.contentRenderer.refreshContentRows(args);
            }
            else {
                if (!gObj.getColumns().length) {
                    gObj.element.innerHTML = '';
                    alert(this.l10n.getConstant('EmptyDataSourceError'));
                    return;
                }
                this.renderEmptyRow();
                if (args) {
                    var action = (args.requestType || '').toLowerCase() + '-complete';
                    this.parent.notify(action, args);
                }
            }
        };
        Render.prototype.dataManagerFailure = function (e) {
            this.ariaService.setOptions(this.parent.getContent().firstChild, { busy: false, invalid: true });
            this.parent.trigger(events.actionFailure, { error: e });
            this.parent.currentViewData = [];
            this.renderEmptyRow();
        };
        Render.prototype.updatesOnInitialRender = function (e) {
            this.buildColumns(e.result[0]);
            util_2.prepareColumns(this.parent.columns);
            this.headerRenderer.renderTable();
            this.contentRenderer.renderTable();
        };
        Render.prototype.buildColumns = function (record) {
            var columns = Object.keys(record);
            var cols = [];
            for (var i = 0, len = columns.length; i < len; i++) {
                cols[i] = { 'field': columns[i] };
            }
            this.parent.columns = cols;
        };
        Render.prototype.instantiateRenderer = function () {
            var renderer = this.locator.getService('rendererFactory');
            renderer.addRenderer(enum_1.RenderType.Header, this.headerRenderer = new header_renderer_1.HeaderRender(this.parent, this.locator));
            renderer.addRenderer(enum_1.RenderType.Content, this.contentRenderer = new content_renderer_1.ContentRender(this.parent, this.locator));
            var cellrender = this.locator.getService('cellRendererFactory');
            cellrender.addCellRenderer(enum_1.CellType.Header, new header_cell_renderer_1.HeaderCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Data, new cell_renderer_1.CellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.StackedHeader, new stacked_cell_renderer_1.StackedHeaderCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Indent, new indent_cell_renderer_1.IndentCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.GroupCaption, new caption_cell_renderer_1.GroupCaptionCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Expand, new expand_cell_renderer_1.ExpandCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.HeaderIndent, new header_indent_renderer_1.HeaderIndentCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.StackedHeader, new stacked_cell_renderer_1.StackedHeaderCellRenderer(this.locator));
        };
        Render.prototype.addEventListener = function () {
            this.parent.on(events.initialLoad, this.instantiateRenderer, this);
            this.parent.on(events.modelChanged, this.refresh, this);
            this.parent.on(events.refreshComplete, this.refreshComplete, this);
        };
        return Render;
    }());
    exports.Render = Render;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 89 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(0), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, util_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StackedHeaderCellRenderer = (function (_super) {
        __extends(StackedHeaderCellRenderer, _super);
        function StackedHeaderCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-headercell e-stackedheadercell', attrs: { role: 'columnheader' } });
            return _this;
        }
        StackedHeaderCellRenderer.prototype.render = function (cell, data, attributes) {
            var node = this.element.cloneNode();
            node.innerHTML = cell.column.headerText;
            if (cell.column.toolTip) {
                node.setAttribute('title', cell.column.toolTip);
            }
            if (util_1.isNullOrUndefined(cell.column.textAlign)) {
                node.style.textAlign = cell.column.textAlign;
            }
            node.setAttribute('colspan', cell.colSpan.toString());
            node.setAttribute('aria-colspan', cell.colSpan.toString());
            node.setAttribute('aria-rowspan', '1');
            return node;
        };
        return StackedHeaderCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.StackedHeaderCellRenderer = StackedHeaderCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellRendererFactory = (function () {
        function CellRendererFactory() {
            this.cellRenderMap = {};
        }
        CellRendererFactory.prototype.addCellRenderer = function (name, type) {
            name = typeof name === 'string' ? name : util_1.getEnumValue(enum_1.CellType, name);
            if (util_1.isNullOrUndefined(this.cellRenderMap[name])) {
                this.cellRenderMap[name] = type;
            }
        };
        CellRendererFactory.prototype.getCellRenderer = function (name) {
            name = typeof name === 'string' ? name : util_1.getEnumValue(enum_1.CellType, name);
            if (util_1.isNullOrUndefined(this.cellRenderMap[name])) {
                throw "The cellRenderer " + name + " is not found";
            }
            else {
                return this.cellRenderMap[name];
            }
        };
        return CellRendererFactory;
    }());
    exports.CellRendererFactory = CellRendererFactory;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 91 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(50), __webpack_require__(0), __webpack_require__(19), __webpack_require__(63)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, row_1, util_1, enum_1, row_model_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroupModelGenerator = (function (_super) {
        __extends(GroupModelGenerator, _super);
        function GroupModelGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rows = [];
            _this.index = 0;
            return _this;
        }
        GroupModelGenerator.prototype.generateRows = function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.getGroupedRecords(0, data[i]);
            }
            this.index = 0;
            return this.rows;
        };
        GroupModelGenerator.prototype.getGroupedRecords = function (index, data) {
            if (util_1.isNullOrUndefined(data.items)) {
                if (util_1.isNullOrUndefined(data.GroupGuid)) {
                    this.rows = this.rows.concat(this.generateDataRows(data, index));
                }
                else {
                    for (var j = 0, len = data.length; j < len; j++) {
                        this.getGroupedRecords(index, data[j]);
                    }
                }
            }
            else {
                this.rows = this.rows.concat(this.generateCaptionRow(data, index));
                if (data.items && data.items.length) {
                    this.getGroupedRecords(index + 1, data.items);
                }
            }
        };
        GroupModelGenerator.prototype.getCaptionRowCells = function (field, indent) {
            var cells = [];
            for (var i = 0; i < indent; i++) {
                cells.push(this.generateIndentCell());
            }
            cells.push(this.generateCell({}, null, enum_1.CellType.Expand));
            cells.push(this.generateCell(this.parent.getColumnByField(field), null, enum_1.CellType.GroupCaption, this.parent.getVisibleColumns().length + this.parent.groupSettings.columns.length -
                indent + (this.parent.getVisibleColumns().length ? -1 : 0)));
            return cells;
        };
        GroupModelGenerator.prototype.generateCaptionRow = function (data, indent) {
            var options = {};
            var tmp = [];
            options.data = util_1.extend({}, data);
            options.data.field = this.parent.getColumnByField(data.field).headerText;
            options.isDataRow = false;
            var row = new row_1.Row(options);
            row.cells = this.getCaptionRowCells(data.field, indent);
            return row;
        };
        GroupModelGenerator.prototype.generateDataRows = function (data, indent) {
            var rows = [];
            for (var i = 0, len = data.length; i < len; i++) {
                rows[i] = this.generateRow(data[i], this.index);
                for (var j = 0; j < indent; j++) {
                    rows[i].cells.unshift(this.generateIndentCell());
                }
                this.index++;
            }
            return rows;
        };
        GroupModelGenerator.prototype.generateIndentCell = function () {
            return this.generateCell({}, null, enum_1.CellType.Indent);
        };
        return GroupModelGenerator;
    }(row_model_generator_1.RowModelGenerator));
    exports.GroupModelGenerator = GroupModelGenerator;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceLocator = (function () {
        function ServiceLocator() {
            this.services = {};
        }
        ServiceLocator.prototype.register = function (name, type) {
            if (util_1.isNullOrUndefined(this.services[name])) {
                this.services[name] = type;
            }
        };
        ServiceLocator.prototype.getService = function (name) {
            if (util_1.isNullOrUndefined(this.services[name])) {
                throw "The service " + name + " is not registered";
            }
            return this.services[name];
        };
        return ServiceLocator;
    }());
    exports.ServiceLocator = ServiceLocator;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValueFormatter = (function () {
        function ValueFormatter(cultureName) {
            this.intl = new ej2_base_1.Internationalization();
            if (!util_1.isNullOrUndefined(cultureName)) {
                this.intl.culture = cultureName;
            }
        }
        ValueFormatter.prototype.getFormatFunction = function (format) {
            if (format.type) {
                return this.intl.getDateFormat(format);
            }
            else {
                return this.intl.getNumberFormat(format);
            }
        };
        ValueFormatter.prototype.getParserFunction = function (format) {
            if (format.type) {
                return this.intl.getDateParser(format);
            }
            else {
                return this.intl.getNumberParser(format);
            }
        };
        ValueFormatter.prototype.fromView = function (value, format, type) {
            if (type === 'date' || type === 'datetime' || type === 'number') {
                return format(value);
            }
            else {
                return value;
            }
        };
        ValueFormatter.prototype.toView = function (value, format) {
            var result = value;
            if (!util_1.isNullOrUndefined(format) && !util_1.isNullOrUndefined(value)) {
                result = format(value);
            }
            return result;
        };
        ValueFormatter.prototype.setCulture = function (cultureName) {
            if (!util_1.isNullOrUndefined(cultureName)) {
                ej2_base_1.setCulture(cultureName);
            }
        };
        return ValueFormatter;
    }());
    exports.ValueFormatter = ValueFormatter;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(0), __webpack_require__(15), __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, util_2, constant_1, column_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColumnWidthService = (function () {
        function ColumnWidthService(parent) {
            this.parent = parent;
        }
        ColumnWidthService.prototype.setWidthToColumns = function () {
            var _this = this;
            if (this.parent.allowGrouping) {
                for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                    this.setColumnWidth(new column_1.Column({ width: '30px' }), i);
                }
            }
            this.parent.getColumns().forEach(function (column) {
                _this.setColumnWidth(column);
            });
        };
        ColumnWidthService.prototype.setColumnWidth = function (column, index) {
            var columnIndex = util_1.isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
            var cWidth = column.width;
            if (!util_1.isNullOrUndefined(cWidth)) {
                this.setWidth(cWidth, columnIndex);
                this.parent.notify(constant_1.columnWidthChanged, { index: columnIndex, width: cWidth, column: column });
            }
        };
        ColumnWidthService.prototype.setWidth = function (width, index) {
            var header = this.parent.getHeaderTable();
            var content = this.parent.getContentTable();
            var fWidth = util_2.formatUnit(width);
            header.querySelector('colgroup').children[index].style.width = fWidth;
            content.querySelector('colgroup').children[index].style.width = fWidth;
        };
        ColumnWidthService.prototype.getSiblingsHeight = function (element) {
            var previous = this.getHeightFromDirection(element, 'previous');
            var next = this.getHeightFromDirection(element, 'next');
            return previous + next;
        };
        ColumnWidthService.prototype.getHeightFromDirection = function (element, direction) {
            var sibling = element[direction + 'ElementSibling'];
            var result = 0;
            while (sibling) {
                result += sibling.offsetHeight;
                sibling = sibling[direction + 'ElementSibling'];
            }
            return result;
        };
        return ColumnWidthService;
    }());
    exports.ColumnWidthService = ColumnWidthService;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(173)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, grid_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(grid_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(98)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, grid_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(grid_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(80), __webpack_require__(170), __webpack_require__(165), __webpack_require__(168), __webpack_require__(163), __webpack_require__(83), __webpack_require__(82), __webpack_require__(166), __webpack_require__(167), __webpack_require__(164), __webpack_require__(81)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, data_1, sort_1, page_1, selection_1, filter_1, search_1, scroll_1, reorder_1, row_reorder_1, group_1, print_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(data_1);
    __export(sort_1);
    __export(page_1);
    __export(selection_1);
    __export(filter_1);
    __export(search_1);
    __export(scroll_1);
    __export(reorder_1);
    __export(row_reorder_1);
    __export(group_1);
    __export(print_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(12), __webpack_require__(2), __webpack_require__(20), __webpack_require__(15), __webpack_require__(19), __webpack_require__(51), __webpack_require__(59), __webpack_require__(50), __webpack_require__(61)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, util_2, dom_1, ej2_data_1, events, enum_1, row_renderer_1, cell_1, row_1, filter_cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Filter = (function () {
        function Filter(parent, filterSettings, serviceLocator) {
            this.predicate = 'and';
            this.contentRefresh = true;
            this.values = {};
            this.filterOperators = {
                contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
                lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
            };
            this.parent = parent;
            this.filterSettings = filterSettings;
            this.serviceLocator = serviceLocator;
            this.addEventListener();
        }
        Filter.prototype.render = function () {
            var gObj = this.parent;
            if (gObj.columns.length) {
                var rowRenderer = new row_renderer_1.RowRenderer(this.serviceLocator, enum_1.CellType.Filter);
                var row = void 0;
                var cellrender = this.serviceLocator.getService('cellRendererFactory');
                cellrender.addCellRenderer(enum_1.CellType.Filter, new filter_cell_renderer_1.FilterCellRenderer(this.serviceLocator));
                this.l10n = this.serviceLocator.getService('localization');
                this.valueFormatter = this.serviceLocator.getService('valueFormatter');
                rowRenderer.element = dom_1.createElement('tr', { className: 'e-filterbar' });
                row = this.generateRow();
                row.data = this.values;
                this.element = rowRenderer.render(row, gObj.getColumns());
                this.parent.getHeaderContent().querySelector('thead').appendChild(this.element);
                this.wireEvents();
            }
        };
        Filter.prototype.destroy = function () {
            this.filterSettings.columns = [];
            this.updateFilterMsg();
            this.removeEventListener();
            this.unWireEvents();
            dom_1.remove(this.element);
        };
        Filter.prototype.generateRow = function (index) {
            var options = {};
            var row = new row_1.Row(options);
            row.cells = this.generateCells();
            return row;
        };
        Filter.prototype.generateCells = function () {
            var cells = [];
            if (this.parent.allowGrouping) {
                for (var c = 0, len = this.parent.groupSettings.columns.length; c < len; c++) {
                    cells.push(this.generateCell({}, enum_1.CellType.HeaderIndent));
                }
            }
            for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
                var dummy = _a[_i];
                cells.push(this.generateCell(dummy));
            }
            return cells;
        };
        Filter.prototype.generateCell = function (column, cellType) {
            var opt = {
                'visible': column.visible,
                'isDataCell': false,
                'rowId': '',
                'column': column,
                'cellType': cellType ? cellType : enum_1.CellType.Filter,
                'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
            };
            return new cell_1.Cell(opt);
        };
        Filter.prototype.updateModel = function () {
            this.currentFilterObject = {
                field: this.fieldName, operator: this.operator, value: this.value, predicate: this.predicate,
                matchCase: this.matchCase, actualFilterValue: {}, actualOperator: {}
            };
            var index = this.getFilteredColsIndexByField(this.fieldName);
            if (index > -1) {
                this.filterSettings.columns[index] = this.currentFilterObject;
            }
            else {
                this.filterSettings.columns.push(this.currentFilterObject);
            }
            this.filterSettings.columns = this.filterSettings.columns;
            this.parent.dataBind();
        };
        Filter.prototype.getFilteredColsIndexByField = function (field) {
            var cols = this.filterSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    return i;
                }
            }
            return -1;
        };
        Filter.prototype.onActionComplete = function (e) {
            var args = !this.isRemove ? {
                currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column.field,
                columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
            } : {
                requestType: 'filtering', type: events.actionComplete
            };
            this.parent.trigger(events.actionComplete, util_1.extend(e, args));
            this.isRemove = false;
        };
        Filter.prototype.wireEvents = function () {
            ej2_base_1.EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass, this);
            ej2_base_1.EventHandler.add(this.parent.element, 'focusin', this.updateSpanClass, this);
            ej2_base_1.EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler, this);
        };
        Filter.prototype.unWireEvents = function () {
            ej2_base_1.EventHandler.remove(this.parent.element, 'focusin', this.updateSpanClass);
            ej2_base_1.EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass);
            ej2_base_1.EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler);
        };
        Filter.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.render();
            }
        };
        Filter.prototype.initialEnd = function () {
            this.parent.off(events.contentReady, this.initialEnd);
            if (this.parent.getColumns().length && this.filterSettings.columns.length) {
                var gObj = this.parent;
                this.contentRefresh = false;
                for (var _i = 0, _a = gObj.filterSettings.columns; _i < _a.length; _i++) {
                    var col = _a[_i];
                    this.filterByColumn(col.field, col.operator, col.value, col.predicate, col.matchCase, col.actualFilterValue, col.actualOperator);
                }
                this.updateFilterMsg();
                this.contentRefresh = true;
            }
        };
        Filter.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
            this.parent.on(events.filterComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.keyPressed, this.keyUpHandler, this);
            this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
            this.parent.on(events.headerRefreshed, this.render, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
        };
        Filter.prototype.removeEventListener = function () {
            this.parent.off(events.uiUpdate, this.enableAfterRender);
            this.parent.off(events.filterComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.keyPressed, this.keyUpHandler);
            this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
            this.parent.off(events.headerRefreshed, this.render);
        };
        Filter.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
            var gObj = this.parent;
            var filterCell;
            this.column = gObj.getColumnByField(fieldName);
            filterCell = this.element.querySelector('#' + this.column.field + '_filterBarcell');
            if (!util_1.isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
                return;
            }
            this.value = filterValue;
            this.matchCase = matchCase || false;
            this.fieldName = fieldName;
            this.predicate = predicate || 'and';
            this.operator = filterOperator;
            filterValue = filterValue.toString();
            this.values[this.column.field] = filterValue;
            gObj.getColumnHeaderByField(fieldName).setAttribute('aria-filtered', 'true');
            if (filterValue.length < 1 || this.checkForSkipInput(this.column, filterValue)) {
                this.filterStatusMsg = filterValue.length < 1 ? '' : this.l10n.getConstant('InvalidFilterMessage');
                this.updateFilterMsg();
                return;
            }
            if (filterCell.value !== filterValue) {
                filterCell.value = filterValue;
            }
            if (this.checkAlreadyColFiltered(this.column.field)) {
                return;
            }
            this.updateModel();
        };
        Filter.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'columns':
                        if (this.contentRefresh) {
                            this.parent.notify(events.modelChanged, {
                                currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                                    this.column.field : undefined,
                                columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionBegin
                            });
                            this.updateFilterMsg();
                        }
                        break;
                    case 'showFilterBarStatus':
                        if (e.properties[prop]) {
                            this.updateFilterMsg();
                        }
                        else if (this.parent.allowPaging) {
                            this.parent.updateExternalMessage('');
                        }
                        break;
                }
            }
        };
        Filter.prototype.clearFiltering = function () {
            var cols = util_2.getActualPropFromColl(this.filterSettings.columns);
            for (var i = 0, len = cols.length; i < len; i++) {
                this.removeFilteredColsByField(cols[i].field, true);
            }
            this.isRemove = true;
            this.filterStatusMsg = '';
            this.updateFilterMsg();
        };
        Filter.prototype.checkAlreadyColFiltered = function (field) {
            var columns = this.filterSettings.columns;
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var col = columns_1[_i];
                if (col.field === field && col.value === this.value &&
                    col.operator === this.operator && col.predicate === this.predicate) {
                    return true;
                }
            }
            return false;
        };
        Filter.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
            var cols = this.filterSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    if (!(isClearFilterBar === false)) {
                        this.element.querySelector('#' + cols[i].field + '_filterBarcell').value = '';
                    }
                    cols.splice(i, 1);
                    this.parent.getColumnHeaderByField(field).removeAttribute('aria-filtered');
                    this.isRemove = true;
                    this.parent.notify(events.modelChanged, {
                        requestType: 'filtering', type: events.actionBegin
                    });
                    break;
                }
            }
            this.updateFilterMsg();
        };
        Filter.prototype.getModuleName = function () {
            return 'filter';
        };
        Filter.prototype.keyUpHandler = function (e) {
            var gObj = this.parent;
            var target = e.target;
            if (dom_1.matches(target, '.e-filterbar input')) {
                this.column = gObj.getColumnByField(target.id.split('_')[0]);
                if (!this.column) {
                    return;
                }
                this.updateCrossIcon(target);
                if ((this.filterSettings.mode === 'immediate' || e.keyCode === 13) && e.keyCode !== 9) {
                    this.value = target.value.trim();
                    this.processFilter(e);
                }
            }
        };
        Filter.prototype.updateSpanClass = function (e) {
            var target = e.target;
            if (e.type === 'mousedown' && target.classList.contains('e-cancel')) {
                var targetText = target.previousElementSibling;
                targetText.value = '';
                target.classList.add('e-hide');
                targetText.focus();
                e.preventDefault();
            }
            if (e.type === 'focusin' && target.classList.contains('e-filtertext') && !target.disabled) {
                if (this.lastFilterElement) {
                    this.lastFilterElement.nextElementSibling.classList.add('e-hide');
                }
                this.updateCrossIcon(target);
                this.lastFilterElement = target;
            }
            if (e.type === 'focusin' && !target.classList.contains('e-filtertext') && this.lastFilterElement) {
                this.lastFilterElement.nextElementSibling.classList.add('e-hide');
            }
            return false;
        };
        Filter.prototype.updateCrossIcon = function (element) {
            if (element.value.length) {
                element.nextElementSibling.classList.remove('e-hide');
            }
        };
        Filter.prototype.updateFilterMsg = function () {
            var gObj = this.parent;
            var columns = this.filterSettings.columns;
            var column;
            if (!this.filterSettings.showFilterBarStatus) {
                return;
            }
            if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
                this.filterStatusMsg = '';
                for (var index = 0; index < columns.length; index++) {
                    column = gObj.getColumnByField(columns[index].field);
                    if (index) {
                        this.filterStatusMsg += ' && ';
                    }
                    this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
                }
            }
            if (gObj.allowPaging) {
                gObj.updateExternalMessage(this.filterStatusMsg);
            }
            this.filterStatusMsg = '';
        };
        Filter.prototype.checkForSkipInput = function (column, value) {
            var isSkip;
            var skipInput;
            if (column.type === 'number') {
                skipInput = ['=', ' ', '!'];
                if (ej2_data_1.DataUtil.operatorSymbols[value] || skipInput.indexOf(value) > -1) {
                    isSkip = true;
                }
            }
            else if (column.type === 'string') {
                skipInput = ['>', '<', '=', '!'];
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var val = value_1[_i];
                    if (skipInput.indexOf(val) > -1) {
                        isSkip = true;
                    }
                }
            }
            return isSkip;
        };
        Filter.prototype.processFilter = function (e) {
            this.stopTimer();
            this.startTimer(e);
        };
        Filter.prototype.startTimer = function (e) {
            var _this = this;
            this.timer = window.setInterval(function () { _this.onTimerTick(); }, e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
        };
        Filter.prototype.stopTimer = function () {
            window.clearInterval(this.timer);
        };
        Filter.prototype.onTimerTick = function () {
            var filterElement = this.element.querySelector('#' + this.column.field + '_filterBarcell');
            var filterValue = JSON.parse(JSON.stringify(filterElement.value));
            this.stopTimer();
            if (this.value === '') {
                this.removeFilteredColsByField(this.column.field);
                return;
            }
            this.validateFilterValue(this.value);
            this.filterByColumn(this.column.field, this.operator, this.value, this.predicate, this.matchCase);
            this.values[this.column.field] = filterValue;
            filterElement.value = filterValue;
            this.updateFilterMsg();
        };
        Filter.prototype.validateFilterValue = function (value) {
            var gObj = this.parent;
            var skipInput;
            var index;
            this.matchCase = true;
            switch (this.column.type) {
                case 'number':
                    this.operator = this.filterOperators.equal;
                    skipInput = ['>', '<', '=', '!'];
                    for (var i = 0; i < value.length; i++) {
                        if (skipInput.indexOf(value[i]) > -1) {
                            index = i;
                            break;
                        }
                    }
                    this.getOperator(value.substring(index));
                    if (index !== 0) {
                        this.value = value.substring(0, index);
                    }
                    if (this.value !== '' && value.length >= 1) {
                        this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                    }
                    if (isNaN(this.value)) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                    break;
                case 'date':
                case 'datetime':
                    this.operator = this.filterOperators.equal;
                    this.getOperator(value);
                    if (this.value !== '') {
                        this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                        if (util_1.isNullOrUndefined(this.value)) {
                            this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                        }
                    }
                    break;
                case 'string':
                    this.matchCase = false;
                    if (value.charAt(0) === '*') {
                        this.value = this.value.slice(1);
                        this.operator = this.filterOperators.startsWith;
                    }
                    else if (value.charAt(value.length - 1) === '%') {
                        this.value = this.value.slice(0, -1);
                        this.operator = this.filterOperators.startsWith;
                    }
                    else if (value.charAt(0) === '%') {
                        this.value = this.value.slice(1);
                        this.operator = this.filterOperators.endsWith;
                    }
                    else {
                        this.operator = this.filterOperators.startsWith;
                    }
                    break;
                case 'boolean':
                    if (value.toLowerCase() === 'true' || value === '1') {
                        this.value = true;
                    }
                    else if (value.toLowerCase() === 'false' || value === '0') {
                        this.value = false;
                    }
                    else if (value.length) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                    this.operator = this.filterOperators.equal;
                    break;
                default:
                    this.operator = this.filterOperators.equal;
            }
        };
        Filter.prototype.getOperator = function (value) {
            var singleOp = value.charAt(0);
            var multipleOp = value.slice(0, 2);
            var operators = util_1.extend({ '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, ej2_data_1.DataUtil.operatorSymbols);
            if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
                this.operator = operators[singleOp];
                this.value = value.substring(1);
                if (!this.operator) {
                    this.operator = operators[multipleOp];
                    this.value = value.substring(2);
                }
            }
            if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
                if (this.value.charAt(0) === '=') {
                    this.operator = this.operator + 'orequal';
                    this.value = this.value.substring(1);
                }
            }
        };
        Filter.prototype.columnPositionChanged = function (e) {
            var filterCells = [].slice.call(this.element.querySelectorAll('.e-filterbarcell'));
            filterCells.splice(e.toIndex, 0, filterCells.splice(e.fromIndex, 1)[0]);
            this.element.innerHTML = '';
            for (var _i = 0, filterCells_1 = filterCells; _i < filterCells_1.length; _i++) {
                var cell = filterCells_1[_i];
                this.element.appendChild(cell);
            }
        };
        return Filter;
    }());
    exports.Filter = Filter;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(12), __webpack_require__(15), __webpack_require__(52)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, dom_1, util_1, util_2, events, aria_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Group = (function () {
        function Group(parent, groupSettings, sortedColumns, serviceLocator) {
            this.contentRefresh = true;
            this.aria = new aria_service_1.AriaService();
            this.parent = parent;
            this.groupSettings = groupSettings;
            this.serviceLocator = serviceLocator;
            this.sortedColumns = sortedColumns;
            this.addEventListener();
        }
        Group.prototype.drag = function (e) {
            var gObj = this.parent;
            var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
            dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            if (!util_2.parentsUntil(e.target, 'e-groupdroparea') &&
                !(this.parent.allowReordering && util_2.parentsUntil(e.target, 'e-headercell'))) {
                dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
            e.target.classList.contains('e-groupdroparea') ? this.element.classList.add('e-hover') : this.element.classList.remove('e-hover');
        };
        Group.prototype.dragStart = function (e) {
            if (e.target.classList.contains('e-stackedheadercell')) {
                return;
            }
            var gObj = this.parent;
            var dropArea = this.parent.element.querySelector('.e-groupdroparea');
            this.aria.setDropTarget(dropArea, e.column.allowGrouping);
            var element = e.target.classList.contains('e-headercell') ? e.target : util_2.parentsUntil(e.target, 'e-headercell');
            this.aria.setGrabbed(element, true, !e.column.allowGrouping);
        };
        Group.prototype.columnDrop = function (e) {
            var gObj = this.parent;
            if (e.droppedElement.getAttribute('action') === 'grouping') {
                var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
                if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                    util_2.parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                        gObj.element.getAttribute('id')) {
                    return;
                }
                this.ungroupColumn(column.field);
            }
        };
        Group.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
            this.parent.on(events.groupComplete, this.onActionComplete, this);
            this.parent.on(events.ungroupComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.click, this.clickHandler, this);
            this.parent.on(events.columnDrag, this.drag, this);
            this.parent.on(events.columnDragStart, this.dragStart, this);
            this.parent.on(events.columnDrop, this.columnDrop, this);
            this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
            this.parent.on(events.sortComplete, this.refreshSortIcons, this);
            this.parent.on(events.keyPressed, this.keyPressHandler, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
            this.parent.on(events.initialEnd, this.render, this);
            this.parent.on(events.headerDrop, this.headerDrop, this);
        };
        Group.prototype.removeEventListener = function () {
            this.parent.off(events.initialEnd, this.render);
            this.parent.off(events.uiUpdate, this.enableAfterRender);
            this.parent.off(events.groupComplete, this.onActionComplete);
            this.parent.off(events.ungroupComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.click, this.clickHandler);
            this.parent.off(events.columnDrag, this.drag);
            this.parent.off(events.columnDragStart, this.dragStart);
            this.parent.off(events.columnDrop, this.columnDrop);
            this.parent.off(events.headerRefreshed, this.refreshSortIcons);
            this.parent.off(events.sortComplete, this.refreshSortIcons);
            this.parent.off(events.keyPressed, this.keyPressHandler);
            this.parent.off(events.headerDrop, this.headerDrop);
        };
        Group.prototype.initialEnd = function () {
            var gObj = this.parent;
            this.parent.off(events.contentReady, this.initialEnd);
            if (this.parent.getColumns().length && this.groupSettings.columns.length) {
                this.contentRefresh = false;
                for (var _i = 0, _a = gObj.groupSettings.columns; _i < _a.length; _i++) {
                    var col = _a[_i];
                    this.groupColumn(col);
                }
                this.contentRefresh = true;
            }
            this.recalcIndentWidth();
        };
        Group.prototype.keyPressHandler = function (e) {
            var gObj = this.parent;
            if (!this.groupSettings.columns.length) {
                return;
            }
            e.preventDefault();
            switch (e.action) {
                case 'altDownArrow':
                case 'altUpArrow':
                    var selected = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
                    if (selected.length) {
                        var selIndex = selected[selected.length - 1];
                        var rows = gObj.getRows();
                        var dataRow = gObj.getContent().querySelector('tr[aria-rowindex="' + selIndex + '"]');
                        var grpRow = void 0;
                        for (var i = dataRow.rowIndex; i >= 0; i--) {
                            if (!rows[i].classList.contains('e-row')) {
                                grpRow = rows[i];
                                break;
                            }
                        }
                        this.expandCollapseRows(grpRow.querySelector(e.action === 'altUpArrow' ?
                            '.e-recordplusexpand' : '.e-recordpluscollapse'));
                    }
                    break;
                case 'ctrlDownArrow':
                    this.expandAll();
                    break;
                case 'ctrlUpArrow':
                    this.collapseAll();
                    break;
            }
        };
        Group.prototype.clickHandler = function (e) {
            this.expandCollapseRows(e.target);
            this.applySortFromTarget(e.target);
            this.unGroupFromTarget(e.target);
            this.toogleGroupFromHeader(e.target);
        };
        Group.prototype.unGroupFromTarget = function (target) {
            if (target.classList.contains('e-ungroupbutton')) {
                this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
            }
        };
        Group.prototype.toogleGroupFromHeader = function (target) {
            if (this.groupSettings.showToggleButton) {
                if (target.classList.contains('e-grptogglebtn')) {
                    if (target.classList.contains('e-toggleungroup')) {
                        this.ungroupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                    }
                    else {
                        this.groupColumn(this.parent.getColumnByUid(target.parentElement.getAttribute('e-mappinguid')).field);
                    }
                }
                else {
                    if (target.classList.contains('e-toggleungroup')) {
                        this.ungroupColumn(target.parentElement.getAttribute('ej-mappingname'));
                    }
                }
            }
        };
        Group.prototype.applySortFromTarget = function (target) {
            var gObj = this.parent;
            var gHeader = dom_1.closest(target, '.e-groupheadercell');
            if (gObj.allowSorting && gHeader && !target.classList.contains('e-ungroupbutton') &&
                !target.classList.contains('e-toggleungroup')) {
                var field = gHeader.firstElementChild.getAttribute('ej-mappingname');
                if (gObj.getColumnHeaderByField(field).querySelectorAll('.e-ascending').length) {
                    gObj.sortColumn(field, 'descending', true);
                }
                else {
                    gObj.sortColumn(field, 'ascending', true);
                }
            }
        };
        Group.prototype.expandCollapseRows = function (target) {
            var trgt = util_2.parentsUntil(target, 'e-recordplusexpand') ||
                util_2.parentsUntil(target, 'e-recordpluscollapse');
            if (trgt) {
                var cellIdx = trgt.cellIndex;
                var rowIdx = trgt.parentElement.rowIndex;
                var rowNodes = this.parent.getContent().querySelectorAll('tr');
                var rows = [].slice.call(rowNodes).slice(rowIdx + 1, rowNodes.length);
                var isHide = void 0;
                var expandElem = void 0;
                var toExpand = [];
                var indent = trgt.parentElement.querySelectorAll('.e-indentcell').length;
                var expand = false;
                if (trgt.classList.contains('e-recordpluscollapse')) {
                    trgt.className = 'e-recordplusexpand';
                    trgt.firstElementChild.className = 'e-icons e-gdiagonaldown e-icon-gdownarrow';
                    expand = true;
                }
                else {
                    isHide = true;
                    trgt.className = 'e-recordpluscollapse';
                    trgt.firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                }
                this.aria.setExpand(trgt, expand);
                for (var i = 0, len = rows.length; i < len; i++) {
                    if (rows[i].querySelectorAll('td')[cellIdx] && rows[i].querySelectorAll('td')[cellIdx].classList.contains('e-indentcell')) {
                        if (isHide) {
                            rows[i].style.display = 'none';
                        }
                        else {
                            if (rows[i].querySelectorAll('.e-indentcell').length === indent + 1) {
                                rows[i].style.display = '';
                                expandElem = rows[i].querySelector('.e-recordplusexpand');
                                if (expandElem) {
                                    toExpand.push(expandElem);
                                }
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
                for (var i = 0, len = toExpand.length; i < len; i++) {
                    toExpand[i].className = 'e-recordpluscollapse';
                    toExpand[i].firstElementChild.className = 'e-icons e-gnextforward e-icon-grightarrow';
                    this.expandCollapseRows(toExpand[i]);
                }
            }
        };
        Group.prototype.expandCollapse = function (isExpand) {
            var rowNodes = this.parent.getContent().querySelectorAll('tr');
            var row;
            for (var i = 0, len = rowNodes.length; i < len; i++) {
                if (rowNodes[i].querySelectorAll('.e-recordplusexpand, .e-recordpluscollapse').length) {
                    row = rowNodes[i].querySelector(isExpand ? '.e-recordpluscollapse' : '.e-recordplusexpand');
                    if (row) {
                        row.className = isExpand ? 'e-recordplusexpand' : 'e-recordpluscollapse';
                        row.firstElementChild.className = isExpand ? 'e-icons e-gdiagonaldown e-icon-gdownarrow' :
                            'e-icons e-gnextforward e-icon-grightarrow';
                    }
                    if (!(rowNodes[i].firstElementChild.classList.contains('e-recordplusexpand') ||
                        rowNodes[i].firstElementChild.classList.contains('e-recordpluscollapse'))) {
                        rowNodes[i].style.display = isExpand ? '' : 'none';
                    }
                }
                else {
                    rowNodes[i].style.display = isExpand ? '' : 'none';
                }
            }
        };
        Group.prototype.expandAll = function () {
            this.expandCollapse(true);
        };
        Group.prototype.collapseAll = function () {
            this.expandCollapse(false);
        };
        Group.prototype.render = function () {
            this.l10n = this.serviceLocator.getService('localization');
            this.renderGroupDropArea();
            this.initDragAndDrop();
            this.refreshToggleBtn();
        };
        Group.prototype.renderGroupDropArea = function () {
            this.element = dom_1.createElement('div', { className: 'e-groupdroparea' });
            this.updateGroupDropArea();
            this.parent.element.insertBefore(this.element, this.parent.element.firstChild);
            if (!this.groupSettings.showDropArea) {
                this.element.style.display = 'none';
            }
        };
        Group.prototype.updateGroupDropArea = function () {
            if (this.groupSettings.showDropArea && !this.groupSettings.columns.length) {
                var dragLabel = this.l10n.getConstant('GroupDropArea');
                this.element.innerHTML = dragLabel;
                this.element.classList.remove('e-grouped');
            }
            else {
                if (this.element.innerHTML === this.l10n.getConstant('GroupDropArea') && this.groupSettings.columns.length === 1) {
                    this.element.innerHTML = '';
                }
                this.element.classList.add('e-grouped');
            }
        };
        Group.prototype.initDragAndDrop = function () {
            this.initializeGHeaderDrop();
            this.initializeGHeaderDrag();
        };
        Group.prototype.initializeGHeaderDrag = function () {
            var _this = this;
            var gObj = this.parent;
            var column;
            var visualElement = dom_1.createElement('div', {
                className: 'e-cloneproperties e-dragclone e-gdclone',
                styles: 'line-height:23px', attrs: { action: 'grouping' }
            });
            var drag = new ej2_base_1.Draggable(this.element, {
                dragTarget: '.e-groupheadercell',
                distance: 5,
                helper: function (e) {
                    var target = e.sender.target;
                    var element = target.classList.contains('e-groupheadercell') ? target :
                        util_2.parentsUntil(target, 'e-groupheadercell');
                    if (!element) {
                        return false;
                    }
                    column = gObj.getColumnByField(element.firstElementChild.getAttribute('ej-mappingname'));
                    visualElement.textContent = element.textContent;
                    visualElement.style.width = element.offsetWidth + 2 + 'px';
                    visualElement.style.height = element.offsetHeight + 2 + 'px';
                    visualElement.setAttribute('e-mappinguid', column.uid);
                    gObj.element.appendChild(visualElement);
                    return visualElement;
                },
                dragStart: function () {
                    gObj.element.classList.add('e-ungroupdrag');
                },
                drag: function (e) {
                    var target = e.target;
                    var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                    gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: column });
                    dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                    if (!(util_2.parentsUntil(target, 'e-gridcontent') || util_2.parentsUntil(target, 'e-headercell'))) {
                        dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    }
                },
                dragStop: function (e) {
                    gObj.element.classList.remove('e-ungroupdrag');
                    if (!(util_2.parentsUntil(e.target, 'e-gridcontent') || util_2.parentsUntil(e.target, 'e-gridheader'))) {
                        dom_1.remove(e.helper);
                        return;
                    }
                }
            });
        };
        Group.prototype.headerDrop = function (e) {
            if (!e.uid) {
                return;
            }
            var column = this.parent.getColumnByUid(e.uid);
            this.ungroupColumn(column.field);
        };
        Group.prototype.initializeGHeaderDrop = function () {
            var _this = this;
            var gObj = this.parent;
            var drop = new ej2_base_1.Droppable(this.element, {
                accept: '.e-dragclone',
                drop: function (e) {
                    var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
                    _this.element.classList.remove('e-hover');
                    dom_1.remove(e.droppedElement);
                    _this.aria.setDropTarget(_this.parent.element.querySelector('.e-groupdroparea'), false);
                    _this.aria.setGrabbed(_this.parent.getHeaderTable().querySelector('[aria-grabbed=true]'), false);
                    if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                        util_2.parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                            gObj.element.getAttribute('id')) {
                        return;
                    }
                    _this.groupColumn(column.field);
                }
            });
        };
        Group.prototype.groupColumn = function (columnName) {
            var gObj = this.parent;
            var column = gObj.getColumnByField(columnName);
            if (util_1.isNullOrUndefined(column) || column.allowGrouping === false ||
                (this.contentRefresh && this.groupSettings.columns.indexOf(columnName) > -1)) {
                return;
            }
            column.visible = gObj.groupSettings.showGroupedColumn;
            this.colName = columnName;
            if (this.contentRefresh) {
                this.updateModel();
            }
            else {
                this.addColToGroupDrop(columnName);
            }
            this.updateGroupDropArea();
        };
        Group.prototype.ungroupColumn = function (columnName) {
            var gObj = this.parent;
            var column = gObj.getColumnByField(columnName);
            if (util_1.isNullOrUndefined(column) || column.allowGrouping === false || this.groupSettings.columns.indexOf(columnName) < 0) {
                return;
            }
            column.visible = true;
            this.colName = column.field;
            var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
            columns.splice(columns.indexOf(this.colName), 1);
            if (this.sortedColumns.indexOf(columnName) < 0) {
                for (var i = 0, len = gObj.sortSettings.columns.length; i < len; i++) {
                    if (columnName === gObj.sortSettings.columns[i].field) {
                        gObj.sortSettings.columns.splice(i, 1);
                        break;
                    }
                }
            }
            this.groupSettings.columns = columns;
            if (gObj.allowGrouping) {
                this.parent.dataBind();
            }
        };
        Group.prototype.updateModel = function () {
            var gObj = this.parent;
            var i = 0;
            var columns = JSON.parse(JSON.stringify(this.groupSettings.columns));
            columns.push(this.colName);
            this.groupSettings.columns = columns;
            while (i < gObj.sortSettings.columns.length) {
                if (gObj.sortSettings.columns[i].field === this.colName) {
                    break;
                }
                i++;
            }
            if (gObj.sortSettings.columns.length === i) {
                gObj.sortSettings.columns.push({ field: this.colName, direction: 'ascending' });
            }
            else if (!gObj.allowSorting) {
                gObj.sortSettings.columns[i].direction = 'ascending';
            }
            this.parent.dataBind();
        };
        Group.prototype.onActionComplete = function (e) {
            var gObj = this.parent;
            if (e.requestType === 'grouping') {
                this.addColToGroupDrop(this.colName);
            }
            else {
                this.removeColFromGroupDrop(this.colName);
            }
            var args = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
                columnName: this.colName, requestType: 'grouping', type: events.actionComplete
            } : { requestType: 'ungrouping', type: events.actionComplete };
            this.parent.trigger(events.actionComplete, util_1.extend(e, args));
        };
        Group.prototype.recalcIndentWidth = function () {
            var gObj = this.parent;
            if (!gObj.groupSettings.columns.length || gObj.getHeaderTable().querySelector('.e-emptycell').getAttribute('indentRefreshed') ||
                !gObj.getContentTable()) {
                return;
            }
            var indentWidth = gObj.getHeaderTable().querySelector('.e-grouptopleftcell').offsetWidth;
            var headerCol = [].slice.call(gObj.getHeaderTable().querySelector('colgroup').childNodes);
            var contentCol = [].slice.call(gObj.getContentTable().querySelector('colgroup').childNodes);
            var perPixel = indentWidth / 30;
            if (perPixel >= 1) {
                indentWidth = (30 / perPixel);
            }
            for (var i = 0; i < this.groupSettings.columns.length; i++) {
                headerCol[i].style.width = indentWidth + 'px';
                contentCol[i].style.width = indentWidth + 'px';
            }
            gObj.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
        };
        Group.prototype.addColToGroupDrop = function (field) {
            var gObj = this.parent;
            var direction = 'ascending';
            var groupedColumn = dom_1.createElement('div', { className: 'e-grid-icon e-groupheadercell' });
            var childDiv = dom_1.createElement('div', { attrs: { 'ej-mappingname': field } });
            var column = this.parent.getColumnByField(field);
            var headerCell = gObj.getColumnHeaderByUid(column.uid);
            childDiv.appendChild(dom_1.createElement('span', { className: 'e-grouptext', innerHTML: column.headerText }));
            if (this.groupSettings.showToggleButton) {
                childDiv.appendChild(dom_1.createElement('span', { className: 'e-togglegroupbutton e-icons e-icon-ungroup e-toggleungroup', innerHTML: '&nbsp;' }));
            }
            if (headerCell.querySelectorAll('.e-ascending,.e-descending').length) {
                direction = headerCell.querySelector('.e-ascending') ? 'ascending' : 'descending';
            }
            childDiv.appendChild(dom_1.createElement('span', { className: 'e-groupsort e-icons ' + ('e-' + direction + ' e-icon-' + direction), innerHTML: '&nbsp;' }));
            childDiv.appendChild(dom_1.createElement('span', {
                className: 'e-ungroupbutton e-icons e-icon-hide',
                attrs: { title: this.l10n.getConstant('UnGroup'), innerHTML: '&nbsp;' },
                styles: this.groupSettings.showUngroupButton ? '' : 'display:none'
            }));
            groupedColumn.appendChild(childDiv);
            this.element.appendChild(groupedColumn);
        };
        Group.prototype.refreshToggleBtn = function (isRemove) {
            if (this.groupSettings.showToggleButton) {
                var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercelldiv'));
                for (var i = 0, len = headers.length; i < len; i++) {
                    if (!(headers[i].classList.contains('e-emptycell'))) {
                        var column = this.parent.getColumnByUid(headers[i].getAttribute('e-mappinguid'));
                        if (headers[i].querySelectorAll('.e-grptogglebtn').length) {
                            dom_1.remove(headers[i].querySelectorAll('.e-grptogglebtn')[0]);
                        }
                        if (!isRemove) {
                            headers[i].appendChild(dom_1.createElement('span', {
                                className: 'e-grptogglebtn e-icons ' +
                                    (this.groupSettings.columns.indexOf(column.field) > -1 ? 'e-toggleungroup e-icon-ungroup'
                                        : 'e-togglegroup e-icon-group')
                            }));
                        }
                    }
                }
            }
        };
        Group.prototype.removeColFromGroupDrop = function (field) {
            dom_1.remove(this.getGHeaderCell(field));
            this.updateGroupDropArea();
        };
        Group.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'columns':
                        if (this.contentRefresh) {
                            var args = this.groupSettings.columns.indexOf(this.colName) > -1 ? {
                                columnName: this.colName, requestType: 'grouping', type: events.actionBegin
                            } : { requestType: 'ungrouping', type: events.actionBegin };
                            this.parent.notify(events.modelChanged, args);
                        }
                        break;
                    case 'showDropArea':
                        this.groupSettings.showDropArea ? this.element.style.display = '' : this.element.style.display = 'none';
                        break;
                    case 'showGroupedColumn':
                        this.updateGroupedColumn(this.groupSettings.showGroupedColumn);
                        this.parent.notify(events.modelChanged, { requestType: 'refresh' });
                        break;
                    case 'showUngroupButton':
                        this.updateButtonVisibility(this.groupSettings.showUngroupButton, 'e-ungroupbutton');
                        break;
                    case 'showToggleButton':
                        this.updateButtonVisibility(this.groupSettings.showToggleButton, 'e-togglegroupbutton ');
                        this.parent.refreshHeader();
                        break;
                }
            }
        };
        Group.prototype.updateGroupedColumn = function (isVisible) {
            for (var i = 0; i < this.groupSettings.columns.length; i++) {
                this.parent.getColumnByField(this.groupSettings.columns[i]).visible = isVisible;
            }
        };
        Group.prototype.updateButtonVisibility = function (isVisible, className) {
            var gHeader = [].slice.call(this.element.querySelectorAll('.' + className));
            for (var i = 0; i < gHeader.length; i++) {
                gHeader[i].style.display = isVisible ? '' : 'none';
            }
        };
        Group.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.render();
            }
        };
        Group.prototype.destroy = function () {
            this.clearGrouping();
            this.removeEventListener();
            this.refreshToggleBtn(true);
            dom_1.remove(this.element);
        };
        Group.prototype.clearGrouping = function () {
            var cols = JSON.parse(JSON.stringify(this.groupSettings.columns));
            this.contentRefresh = false;
            for (var i = 0, len = cols.length; i < len; i++) {
                this.ungroupColumn(cols[i]);
            }
            this.contentRefresh = true;
        };
        Group.prototype.getModuleName = function () {
            return 'group';
        };
        Group.prototype.refreshSortIcons = function (e) {
            var gObj = this.parent;
            var header;
            var cols = gObj.sortSettings.columns;
            var gCols = gObj.groupSettings.columns;
            this.recalcIndentWidth();
            this.refreshToggleBtn();
            for (var i = 0, len = cols.length; i < len; i++) {
                header = gObj.getColumnHeaderByField(cols[i].field);
                if (!gObj.allowSorting && (this.sortedColumns.indexOf(cols[i].field) > -1 ||
                    this.groupSettings.columns.indexOf(cols[i].field) > -1)) {
                    dom_1.classList(header.querySelector('.e-sortfilterdiv'), ['e-ascending', 'e-icon-ascending'], []);
                    if (cols.length > 1) {
                        header.querySelector('.e-headercelldiv').appendChild(dom_1.createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }));
                    }
                }
                else if (this.getGHeaderCell(cols[i].field) && this.getGHeaderCell(cols[i].field).querySelectorAll('.e-groupsort').length) {
                    if (cols[i].direction === 'ascending') {
                        dom_1.classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-ascending', 'e-icon-ascending'], ['e-descending', 'e-icon-descending']);
                    }
                    else {
                        dom_1.classList(this.getGHeaderCell(cols[i].field).querySelector('.e-groupsort'), ['e-descending', 'e-icon-descending'], ['e-ascending', 'e-icon-ascending']);
                    }
                }
            }
            for (var i = 0, len = gCols.length; i < len; i++) {
                gObj.getColumnHeaderByField(gCols[i]).setAttribute('aria-grouped', 'true');
            }
        };
        Group.prototype.getGHeaderCell = function (field) {
            if (this.element && this.element.querySelector('[ej-mappingname=' + field + ']')) {
                return this.element.querySelector('[ej-mappingname=' + field + ']').parentElement;
            }
            return null;
        };
        return Group;
    }());
    exports.Group = Group;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(65), __webpack_require__(64), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, pager_1, external_message_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    pager_1.Pager.Inject(external_message_1.ExternalMessage);
    var Page = (function () {
        function Page(parent, pageSettings) {
            this.parent = parent;
            this.pageSettings = pageSettings;
            this.addEventListener();
        }
        Page.prototype.getModuleName = function () {
            return 'pager';
        };
        Page.prototype.render = function () {
            var gObj = this.parent;
            var pagerObj;
            this.element = dom_1.createElement('div', { className: 'e-gridpager' });
            pagerObj = util_2.extend({}, util_1.extend({}, util_2.getActualProperties(this.pageSettings)), {
                click: this.clickHandler.bind(this),
                enableRtl: gObj.enableRtl, locale: gObj.locale
            }, ['parentObj', 'propName']);
            this.pagerObj = new pager_1.Pager(pagerObj);
        };
        Page.prototype.dataReady = function (e) {
            this.updateModel(e);
        };
        Page.prototype.refresh = function () {
            this.pagerObj.refresh();
        };
        Page.prototype.goToPage = function (pageNo) {
            this.pagerObj.goToPage(pageNo);
        };
        Page.prototype.updateModel = function (e) {
            this.parent.pageSettings.totalRecordsCount = e.count;
            this.parent.dataBind();
        };
        Page.prototype.onActionComplete = function (e) {
            this.parent.trigger(events.actionComplete, util_1.extend(e, {
                currentPage: this.parent.pageSettings.currentPage, requestType: 'paging',
                type: events.actionComplete
            }));
        };
        Page.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            var newProp = e.properties;
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                this.pagerObj[prop] = newProp[prop];
            }
            this.pagerObj.dataBind();
        };
        Page.prototype.clickHandler = function (e) {
            var gObj = this.parent;
            var prevPage = this.pageSettings.currentPage;
            this.pageSettings.currentPage = e.currentPage;
            this.parent.notify(events.modelChanged, {
                requestType: 'paging',
                previousPage: prevPage,
                currentPage: e.currentPage,
                type: events.actionBegin
            });
        };
        Page.prototype.keyPressHandler = function (e) {
            if (this.canSkipAction(e.action)) {
                return;
            }
            if (e.action in keyActions) {
                e.preventDefault();
                this.element.querySelector(keyActions[e.action]).click();
            }
        };
        Page.prototype.canSkipAction = function (action) {
            var page = {
                pageUp: function (el) { return el.scrollTop !== 0; },
                pageDown: function (el) { return !(el.scrollTop >= el.scrollHeight - el.clientHeight); }
            };
            var activeElement = document.activeElement;
            if (activeElement.classList.contains('e-content') &&
                activeElement.isEqualNode(this.parent.getContent().firstElementChild) && ['pageUp', 'pageDown'].indexOf(action) !== -1) {
                return page[action](this.parent.getContent().firstChild);
            }
            return false;
        };
        Page.prototype.updateExternalMessage = function (message) {
            if (!this.pagerObj.enableExternalMessage) {
                this.pagerObj.enableExternalMessage = true;
                this.pagerObj.dataBind();
            }
            this.pagerObj.externalMessage = message;
            this.pagerObj.dataBind();
        };
        Page.prototype.appendToElement = function (e) {
            this.parent.element.appendChild(this.element);
            this.parent.setGridPager(this.element);
            this.pagerObj.appendTo(this.element);
        };
        Page.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.render();
                this.appendToElement();
            }
        };
        Page.prototype.addEventListener = function () {
            this.handlers = {
                load: this.render,
                end: this.appendToElement,
                ready: this.dataReady,
                complete: this.onActionComplete,
                updateLayout: this.enableAfterRender,
                inboundChange: this.onPropertyChanged,
                keyPress: this.keyPressHandler
            };
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.initialLoad, this.handlers.load, this);
            this.parent.on(events.initialEnd, this.handlers.end, this);
            this.parent.on(events.dataReady, this.handlers.ready, this);
            this.parent.on(events.pageComplete, this.handlers.complete, this);
            this.parent.on(events.uiUpdate, this.handlers.updateLayout, this);
            this.parent.on(events.inBoundModelChanged, this.handlers.inboundChange, this);
            this.parent.on(events.keyPressed, this.handlers.keyPress, this);
        };
        Page.prototype.removeEventListener = function () {
            this.parent.off(events.initialLoad, this.handlers.load);
            this.parent.off(events.initialEnd, this.handlers.end);
            this.parent.off(events.dataReady, this.handlers.ready);
            this.parent.off(events.pageComplete, this.handlers.complete);
            this.parent.off(events.uiUpdate, this.handlers.updateLayout);
            this.parent.off(events.inBoundModelChanged, this.handlers.inboundChange);
            this.parent.off(events.keyPressed, this.handlers.keyPress);
        };
        Page.prototype.destroy = function () {
            this.removeEventListener();
            this.pagerObj.destroy();
            dom_1.remove(this.element);
        };
        return Page;
    }());
    exports.Page = Page;
    var keyActions = {
        pageUp: '.e-prev',
        pageDown: '.e-next',
        ctrlAltPageDown: '.e-last',
        ctrlAltPageUp: '.e-first',
        altPageUp: '.e-pp',
        altPageDown: '.e-np'
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, dom_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Reorder = (function () {
        function Reorder(parent) {
            this.parent = parent;
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.headerDrop, this.headerDrop, this);
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
            this.parent.on(events.reorderComplete, this.onActionComplete, this);
            this.parent.on(events.columnDrag, this.drag, this);
            this.parent.on(events.columnDragStart, this.dragStart, this);
            this.parent.on(events.columnDragStop, this.dragStop, this);
            this.parent.on(events.headerDrop, this.headerDrop, this);
            this.parent.on(events.headerRefreshed, this.createReorderElement, this);
        }
        Reorder.prototype.chkDropPosition = function (srcElem, destElem) {
            return srcElem.parentElement.isEqualNode(destElem.parentElement) && this.targetParentContainerIndex(srcElem, destElem) > -1;
        };
        Reorder.prototype.chkDropAllCols = function (srcElem, destElem) {
            var isFound;
            var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
            var header;
            while (!isFound && headers.length > 0) {
                header = headers.pop();
                isFound = srcElem !== header && this.targetParentContainerIndex(srcElem, destElem) > -1;
            }
            return isFound;
        };
        Reorder.prototype.findColParent = function (col, cols, parent) {
            parent = parent;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (col === cols[i]) {
                    return true;
                }
                else if (cols[i].columns) {
                    var cnt = parent.length;
                    parent.push(cols[i]);
                    if (!this.findColParent(col, cols[i].columns, parent)) {
                        parent.splice(cnt, parent.length - cnt);
                    }
                    else {
                        return true;
                    }
                }
            }
            return false;
        };
        Reorder.prototype.getColumnsModel = function (cols) {
            var columnModel = [];
            var subCols = [];
            for (var i = 0, len = cols.length; i < len; i++) {
                columnModel.push(cols[i]);
                if (cols[i].columns) {
                    subCols = subCols.concat(cols[i].columns);
                }
            }
            if (subCols.length) {
                columnModel = columnModel.concat(this.getColumnsModel(subCols));
            }
            return columnModel;
        };
        Reorder.prototype.headerDrop = function (e) {
            var gObj = this.parent;
            if (!dom_1.closest(e.target, 'th')) {
                return;
            }
            var destElem = dom_1.closest(e.target, '.e-headercell');
            if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
                var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
                var oldIdx = util_2.getElementIndex(this.element, headers);
                var columns = this.getColumnsModel(this.parent.columns);
                var column = columns[oldIdx];
                var newIndex = this.targetParentContainerIndex(this.element, destElem);
                this.moveColumns(newIndex, column);
            }
        };
        Reorder.prototype.moveColumns = function (destIndex, column) {
            var gObj = this.parent;
            var parent = this.getColParent(column, this.parent.columns);
            var cols = parent ? parent.columns : this.parent.columns;
            var srcIdx = util_2.inArray(column, cols);
            if (!gObj.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
                return;
            }
            cols.splice(destIndex, 0, cols.splice(srcIdx, 1)[0]);
            gObj.getColumns(true);
            gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
            gObj.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'reorder'
            });
        };
        Reorder.prototype.targetParentContainerIndex = function (srcElem, destElem) {
            var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
            var cols = this.parent.columns;
            var flatColumns = this.getColumnsModel(cols);
            var parent = this.getColParent(flatColumns[util_2.getElementIndex(srcElem, headers)], cols);
            cols = parent ? parent.columns : cols;
            return util_2.inArray(flatColumns[util_2.getElementIndex(destElem, headers)], cols);
        };
        Reorder.prototype.getColParent = function (column, columns) {
            var parents = [];
            this.findColParent(column, columns, parents);
            return parents[parents.length - 1];
        };
        Reorder.prototype.reorderColumns = function (fromFName, toFName) {
            var column = this.getColumnByField(toFName);
            var parent = this.getColParent(column, this.parent.columns);
            var columns = parent ? parent.columns : this.parent.columns;
            var destIndex = util_2.inArray(column, columns);
            if (destIndex > -1) {
                this.moveColumns(destIndex, this.getColumnByField(fromFName));
            }
        };
        Reorder.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.createReorderElement();
            }
        };
        Reorder.prototype.createReorderElement = function () {
            var header = this.parent.element.querySelector('.e-headercontent');
            this.upArrow = header.appendChild(dom_1.createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow', attrs: { style: 'display:none' } }));
            this.downArrow = header.appendChild(dom_1.createElement('div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow', attrs: { style: 'display:none' } }));
        };
        Reorder.prototype.onActionComplete = function (e) {
            this.parent.trigger(events.actionComplete, util_1.extend(e, { type: events.actionComplete }));
        };
        Reorder.prototype.destroy = function () {
            dom_1.remove(this.upArrow);
            dom_1.remove(this.downArrow);
            this.parent.off(events.headerDrop, this.headerDrop);
            this.parent.off(events.uiUpdate, this.enableAfterRender);
            this.parent.off(events.reorderComplete, this.onActionComplete);
            this.parent.off(events.columnDrag, this.drag);
            this.parent.off(events.columnDragStart, this.dragStart);
            this.parent.off(events.columnDragStop, this.dragStop);
            this.parent.off(events.headerRefreshed, this.createReorderElement);
        };
        Reorder.prototype.drag = function (e) {
            var gObj = this.parent;
            var target = e.target;
            var closest = dom_1.closest(target, '.e-headercell:not(.e-stackedHeaderCell)');
            var cloneElement = gObj.element.querySelector('.e-cloneproperties');
            var isLeft = this.x > util_2.getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
            dom_1.removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
            this.upArrow.style.display = 'none';
            this.downArrow.style.display = 'none';
            this.stopTimer();
            dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            this.updateScrollPostion(e.event);
            if (closest && !closest.isEqualNode(this.element)) {
                target = closest;
                if (!(!this.chkDropPosition(this.element, target) || !this.chkDropAllCols(this.element, target))) {
                    this.updateArrowPosition(target, isLeft);
                    dom_1.classList(target, ['e-allowDrop', 'e-reorderindicate'], []);
                }
                else if (!(gObj.allowGrouping && util_2.parentsUntil(e.target, 'e-groupdroparea'))) {
                    dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
            }
            gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: e.column });
        };
        Reorder.prototype.updateScrollPostion = function (e) {
            var _this = this;
            var x = util_2.getPosition(e).x;
            var cliRectBase = this.parent.element.getBoundingClientRect();
            var scrollElem = this.parent.getContent().firstElementChild;
            if (x > cliRectBase.left && x < cliRectBase.left + 35) {
                this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, true); }, 50);
            }
            else if (x < cliRectBase.right && x > cliRectBase.right - 35) {
                this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, false); }, 50);
            }
        };
        Reorder.prototype.setScrollLeft = function (scrollElem, isLeft) {
            var scrollLeft = scrollElem.scrollLeft;
            scrollElem.scrollLeft = scrollElem.scrollLeft + (isLeft ? -5 : 5);
            if (scrollLeft !== scrollElem.scrollLeft) {
                this.upArrow.style.display = 'none';
                this.downArrow.style.display = 'none';
            }
        };
        Reorder.prototype.stopTimer = function () {
            window.clearInterval(this.timer);
        };
        Reorder.prototype.updateArrowPosition = function (target, isLeft) {
            var cliRect = target.getBoundingClientRect();
            var cliRectBase = this.parent.element.getBoundingClientRect();
            if ((isLeft && cliRect.left < cliRectBase.left) || (!isLeft && cliRect.right > cliRectBase.right)) {
                return;
            }
            this.upArrow.style.top = cliRect.top + cliRect.height - cliRectBase.top + 'px';
            this.downArrow.style.top = cliRect.top - cliRectBase.top - 4 + 'px';
            this.upArrow.style.left = this.downArrow.style.left = (isLeft ? cliRect.left : cliRect.right) - cliRectBase.left - 4 + 'px';
            this.upArrow.style.display = '';
            this.downArrow.style.display = '';
        };
        Reorder.prototype.dragStart = function (e) {
            var gObj = this.parent;
            var target = e.target;
            this.element = target.classList.contains('e-headercell') ? target :
                util_2.parentsUntil(target, 'e-headercell');
            this.x = util_2.getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
            gObj.trigger(events.columnDragStart, {
                target: target, draggableType: 'headercell', column: e.column
            });
        };
        Reorder.prototype.dragStop = function (e) {
            var gObj = this.parent;
            this.upArrow.style.display = 'none';
            this.downArrow.style.display = 'none';
            this.stopTimer();
            if (!e.cancel) {
                gObj.trigger(events.columnDrop, { target: e.target, draggableType: 'headercell', column: e.column });
            }
            dom_1.removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
        };
        Reorder.prototype.getModuleName = function () {
            return 'reorder';
        };
        Reorder.prototype.getColumnByField = function (field) {
            return util_2.iterateArrayOrObject(this.getColumnsModel(this.parent.columns), function (item, index) {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        };
        return Reorder;
    }());
    exports.Reorder = Reorder;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowDD = (function () {
        function RowDD(parent) {
            this.selectedRows = [];
            this.parent = parent;
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.initialEnd, this.initializeDrag, this);
            this.parent.on(events.columnDrop, this.columnDrop, this);
            this.parent.on(events.rowDragAndDropComplete, this.onActionComplete, this);
            this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        }
        RowDD.prototype.initializeDrag = function () {
            var _this = this;
            var gObj = this.parent;
            var column;
            var drag;
            drag = new ej2_base_1.Draggable(gObj.getContent(), {
                dragTarget: '.e-rowcell',
                distance: 5,
                helper: function (e) {
                    if (document.getElementsByClassName('e-griddragarea').length ||
                        !e.sender.target.classList.contains('e-selectionbackground')) {
                        return false;
                    }
                    var visualElement = dom_1.createElement('div', {
                        className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
                        styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
                    });
                    var table = dom_1.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
                    var tbody = dom_1.createElement('tbody');
                    var selectedRows = gObj.getSelectedRows();
                    for (var i = 0, len = selectedRows.length; i < len; i++) {
                        var selectedRow = selectedRows[i].cloneNode(true);
                        util_2.removeElement(selectedRow, '.e-indentcell');
                        tbody.appendChild(selectedRow);
                    }
                    table.appendChild(tbody);
                    visualElement.appendChild(table);
                    gObj.element.appendChild(visualElement);
                    return visualElement;
                },
                dragStart: function (e) {
                    if (document.getElementsByClassName('e-griddragarea').length) {
                        return;
                    }
                    gObj.trigger(events.rowDragStart, {
                        rows: gObj.getSelectedRecords(),
                        target: e.target, draggableType: 'rows', data: gObj.getSelectedRecords()
                    });
                    var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
                    if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                        dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
                    }
                    _this.dragStop = false;
                },
                drag: function (e) {
                    var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                    var target = _this.getElementFromPosition(cloneElement, e.event);
                    dom_1.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                    gObj.trigger(events.rowDrag, {
                        rows: gObj.getSelectedRecords(),
                        target: target, draggableType: 'rows', data: gObj.getSelectedRecords()
                    });
                    gObj.element.classList.add('e-rowdrag');
                    if (!util_2.parentsUntil(target, 'e-gridcontent') ||
                        util_2.parentsUntil(cloneElement.parentElement, 'e-grid').id === util_2.parentsUntil(target, 'e-grid').id) {
                        dom_1.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    }
                },
                dragStop: function (e) {
                    var target = _this.getElementFromPosition(e.helper, e.event);
                    gObj.element.classList.remove('e-rowdrag');
                    if (!util_2.parentsUntil(target, 'e-gridcontent')) {
                        dom_1.remove(e.helper);
                        return;
                    }
                    var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
                    if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                        dropElem.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
                    }
                    gObj.trigger(events.rowDrop, {
                        target: target, draggableType: 'rows',
                        rows: gObj.getSelectedRows(), data: gObj.getSelectedRecords()
                    });
                }
            });
        };
        RowDD.prototype.getElementFromPosition = function (element, event) {
            var target;
            var position = util_2.getPosition(event);
            element.style.display = 'none';
            target = document.elementFromPoint(position.x, position.y);
            element.style.display = '';
            return target;
        };
        RowDD.prototype.onActionComplete = function (e) {
            this.parent.trigger(events.actionComplete, util_1.extend(e, { type: events.actionComplete }));
        };
        RowDD.prototype.columnDrop = function (e) {
            var gObj = this.parent;
            if (e.droppedElement.getAttribute('action') !== 'grouping') {
                var targetRow = dom_1.closest(e.target, 'tr');
                var srcControl = void 0;
                var currentIndex = void 0;
                if (e.droppedElement.parentElement.id !== gObj.element.id) {
                    srcControl = e.droppedElement.parentElement.ej2_instances[0];
                }
                else {
                    return;
                }
                if (srcControl.element.id !== gObj.element.id && srcControl.rowDropSettings.targetID !== gObj.element.id) {
                    return;
                }
                var records = srcControl.getSelectedRecords();
                var targetIndex = currentIndex = targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
                var count = 0;
                if (isNaN(targetIndex)) {
                    targetIndex = currentIndex = 0;
                }
                if (gObj.allowPaging) {
                    targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
                }
                gObj.notify(events.rowsAdded, { toIndex: targetIndex, records: records });
                gObj.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
                var selectedRows = srcControl.getSelectedRowIndexes();
                var skip = srcControl.allowPaging ?
                    (srcControl.pageSettings.currentPage * srcControl.pageSettings.pageSize) - srcControl.pageSettings.pageSize : 0;
                this.selectedRows = [];
                for (var i = 0, len = records.length; i < len; i++) {
                    this.selectedRows.push(skip + selectedRows[i]);
                }
                srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows });
                srcControl.notify(events.modelChanged, {
                    type: events.actionBegin, requestType: 'rowdraganddrop'
                });
            }
        };
        RowDD.prototype.enableAfterRender = function (e) {
            if (e.module === this.getModuleName() && e.enable) {
                this.initializeDrag();
            }
        };
        RowDD.prototype.destroy = function () {
            this.parent.off(events.initialEnd, this.initializeDrag);
            this.parent.off(events.columnDrop, this.columnDrop);
            this.parent.off(events.rowDragAndDropComplete, this.onActionComplete);
            this.parent.off(events.uiUpdate, this.enableAfterRender);
        };
        RowDD.prototype.getModuleName = function () {
            return 'rowDragAndDrop';
        };
        return RowDD;
    }());
    exports.RowDD = RowDD;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Selection = (function () {
        function Selection(parent, selectionSettings) {
            this.selectedRowIndexes = [];
            this.selectedRowCellIndexes = [];
            this.selectedRecords = [];
            this.isMultiShiftRequest = false;
            this.isMultiCtrlRequest = false;
            this.enableSelectMultiTouch = false;
            this.parent = parent;
            this.selectionSettings = selectionSettings;
            this.addEventListener();
        }
        Selection.prototype.initializeSelection = function () {
            ej2_base_1.EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
        };
        Selection.prototype.onActionBegin = function (args, type) {
            this.parent.trigger(type, args);
        };
        Selection.prototype.onActionComplete = function (args, type) {
            this.parent.trigger(type, args);
        };
        Selection.prototype.getModuleName = function () {
            return 'selection';
        };
        Selection.prototype.destroy = function () {
            this.hidePopUp();
            this.clearSelection();
            this.removeEventListener();
            ej2_base_1.EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
        };
        Selection.prototype.selectRow = function (index) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(index);
            if (!this.isRowType() || !selectedRow) {
                return;
            }
            var isRowSelected = selectedRow.hasAttribute('aria-selected');
            this.clearRow();
            this.onActionBegin({
                data: gObj.currentViewData[index], rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelecting);
            if (!(index === this.prevRowIndex && isRowSelected)) {
                this.updateRowSelection(selectedRow, index);
            }
            this.updateRowProps(index);
            this.parent.selectedRowIndex = index;
            this.onActionComplete({
                data: gObj.currentViewData[index], rowIndex: index,
                row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelected);
        };
        Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
            this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
            this.parent.selectedRowIndex = endIndex;
        };
        Selection.prototype.selectRows = function (rowIndexes) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
            if (this.isSingleSel() || !this.isRowType()) {
                return;
            }
            this.clearRow();
            this.onActionBegin({
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
            }, events.rowSelecting);
            for (var _i = 0, rowIndexes_1 = rowIndexes; _i < rowIndexes_1.length; _i++) {
                var rowIndex = rowIndexes_1[_i];
                this.updateRowSelection(gObj.getRowByIndex(rowIndex), rowIndex);
            }
            this.updateRowProps(rowIndexes[0]);
            this.onActionComplete({
                rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
                prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
            }, events.rowSelected);
        };
        Selection.prototype.addRowsToSelection = function (rowIndexes) {
            var gObj = this.parent;
            var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
            if (this.isSingleSel() || !this.isRowType()) {
                return;
            }
            for (var _i = 0, rowIndexes_2 = rowIndexes; _i < rowIndexes_2.length; _i++) {
                var rowIndex = rowIndexes_2[_i];
                this.onActionBegin({
                    data: gObj.currentViewData[rowIndex], rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                    isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
                }, events.rowSelecting);
                gObj.selectedRowIndex = rowIndex;
                if (this.selectedRowIndexes.indexOf(rowIndex) > -1) {
                    this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
                    this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
                    selectedRow.removeAttribute('aria-selected');
                    this.addRemoveClassesForRow(selectedRow, false, 'e-selectionbackground', 'e-active');
                }
                else {
                    this.updateRowSelection(selectedRow, rowIndex);
                }
                this.updateRowProps(rowIndex);
                this.onActionComplete({
                    data: gObj.currentViewData[rowIndex], rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
                }, events.rowSelected);
            }
        };
        Selection.prototype.getCollectionFromIndexes = function (startIndex, endIndex) {
            var indexes = [];
            var _a = (startIndex < endIndex) ?
                { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
            for (; i <= max; i++) {
                indexes.push(i);
            }
            if (startIndex > endIndex) {
                indexes.reverse();
            }
            return indexes;
        };
        Selection.prototype.clearRow = function () {
            this.selectedRowIndexes = [];
            this.selectedRecords = [];
            this.clearRowSelection();
        };
        Selection.prototype.updateRowProps = function (startIndex) {
            this.prevRowIndex = startIndex;
            this.isRowSelected = this.selectedRowIndexes.length && true;
        };
        Selection.prototype.updateRowSelection = function (selectedRow, startIndex) {
            if (!selectedRow) {
                return;
            }
            this.selectedRowIndexes.push(startIndex);
            this.selectedRecords.push(selectedRow);
            selectedRow.setAttribute('aria-selected', 'true');
            this.addRemoveClassesForRow(selectedRow, true, 'e-selectionbackground', 'e-active');
        };
        Selection.prototype.clearSelection = function () {
            var span = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.enableSelectMultiTouch = false;
        };
        Selection.prototype.clearRowSelection = function () {
            if (this.isRowSelected) {
                var selectedRows = this.parent.getContentTable().querySelectorAll('tr[aria-selected="true"]');
                var data = [];
                var row = [];
                var rowIndex = [];
                for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                    data.push(this.parent.currentViewData[this.selectedRowIndexes[i]]);
                    row.push(this.parent.getRows()[this.selectedRowIndexes[i]]);
                    rowIndex.push(this.selectedRowIndexes[i]);
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.rowDeselecting, {
                        rowIndex: rowIndex, data: data, row: row
                    });
                }
                for (var i = 0, len = selectedRows.length; i < len; i++) {
                    selectedRows[i].removeAttribute('aria-selected');
                    this.addRemoveClassesForRow(selectedRows[i], false, 'e-selectionbackground', 'e-active');
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.rowDeselected, {
                        rowIndex: rowIndex, data: data, row: row
                    });
                }
                this.selectedRowIndexes = [];
                this.selectedRecords = [];
                this.isRowSelected = false;
                this.parent.selectedRowIndex = undefined;
            }
        };
        Selection.prototype.selectCell = function (cellIndex) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, cellIndex.cellIndex);
            if (!this.isCellType() || !selectedCell) {
                return;
            }
            var isCellSelected = selectedCell.classList.contains('e-cellselectionbackground');
            this.clearCell();
            this.onActionBegin({
                data: this.parent.getRows()[cellIndex.rowIndex], cellIndex: cellIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            if (!(!util_1.isUndefined(this.prevCIdxs) &&
                cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
                isCellSelected)) {
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            this.updateCellProps(cellIndex, cellIndex);
            this.onActionComplete({
                data: this.parent.getRows()[cellIndex.rowIndex], cellIndex: cellIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.selectCellsByRange = function (startIndex, endIndex) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
            var min;
            var max;
            var stIndex = startIndex;
            var edIndex = endIndex;
            var cellIndexes;
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            this.clearCell();
            this.onActionBegin({
                data: this.parent.getRows()[startIndex.rowIndex], cellIndex: startIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            if (startIndex.rowIndex > endIndex.rowIndex) {
                var temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (var i = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
                if (this.selectionSettings.cellSelectionMode !== 'box') {
                    min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                    max = i === endIndex.rowIndex ? (endIndex.cellIndex) : gObj.getColumns().length - 1;
                }
                else {
                    min = startIndex.cellIndex;
                    max = endIndex.cellIndex;
                }
                cellIndexes = [];
                for (var j = min < max ? min : max, len = min > max ? min : max; j <= len; j++) {
                    selectedCell = gObj.getCellFromIndex(i, j);
                    if (!selectedCell) {
                        continue;
                    }
                    cellIndexes.push(j);
                    selectedCell.classList.add('e-cellselectionbackground');
                }
                this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
            }
            this.updateCellProps(stIndex, edIndex);
            this.onActionComplete({
                data: this.parent.getRows()[startIndex.rowIndex], cellIndex: startIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.selectCells = function (rowCellIndexes) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            this.onActionBegin({
                data: this.parent.getRows()[rowCellIndexes[0].rowIndex], cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
            for (var i = 0, len = rowCellIndexes.length; i < len; i++) {
                for (var j = 0, cellLen = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                    selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                    if (!selectedCell) {
                        continue;
                    }
                    selectedCell.classList.add('e-cellselectionbackground');
                    this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
                }
            }
            this.updateCellProps({ rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] }, { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
            this.onActionComplete({
                data: this.parent.getRows()[rowCellIndexes[0].rowIndex], cellIndex: rowCellIndexes[0].cellIndexes[0],
                currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        };
        Selection.prototype.addCellsToSelection = function (cellIndexes) {
            var gObj = this.parent;
            var selectedCell = gObj.getCellFromIndex(cellIndexes[0].rowIndex, cellIndexes[0].cellIndex);
            var index;
            if (this.isSingleSel() || !this.isCellType()) {
                return;
            }
            for (var _i = 0, cellIndexes_1 = cellIndexes; _i < cellIndexes_1.length; _i++) {
                var cellIndex = cellIndexes_1[_i];
                this.onActionBegin({
                    data: this.parent.getRows()[cellIndexes[0].rowIndex], cellIndex: cellIndexes[0],
                    isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                    currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                    previousRowCell: this.prevECIdxs ?
                        gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
                }, events.cellSelecting);
                for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                    if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    var selectedCellIdx = this.selectedRowCellIndexes[index].cellIndexes;
                    if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                        selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                        selectedCell.classList.remove('e-cellselectionbackground');
                    }
                    else {
                        this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                        selectedCell.classList.add('e-cellselectionbackground');
                    }
                }
                else {
                    this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
                }
                this.updateCellProps(cellIndex, cellIndex);
                this.onActionComplete({
                    data: this.parent.getRows()[cellIndexes[0].rowIndex], cellIndex: cellIndexes[0], currentCell: selectedCell,
                    previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                        undefined, previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes
                }, events.cellSelected);
            }
        };
        Selection.prototype.clearCell = function () {
            this.selectedRowCellIndexes = [];
            this.clearCellSelection();
        };
        Selection.prototype.updateCellSelection = function (selectedCell, rowIndex, cellIndex) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
            selectedCell.classList.add('e-cellselectionbackground');
        };
        Selection.prototype.updateCellProps = function (startIndex, endIndex) {
            this.prevCIdxs = startIndex;
            this.prevECIdxs = endIndex;
            this.isCellSelected = this.selectedRowCellIndexes.length && true;
        };
        Selection.prototype.addRowCellIndex = function (rowCellIndex) {
            var isRowAvail;
            var index;
            for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                    isRowAvail = true;
                    index = i;
                    break;
                }
            }
            if (isRowAvail) {
                if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                    this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
                }
            }
            else {
                this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
            }
        };
        Selection.prototype.clearCellSelection = function () {
            if (this.isCellSelected) {
                var gObj = this.parent;
                var selectedCells = gObj.getContentTable().querySelectorAll('.e-cellselectionbackground');
                var rowCell = this.selectedRowCellIndexes;
                var data = [];
                var cells = [];
                for (var i = 0, len = rowCell.length; i < len; i++) {
                    data.push(this.parent.currentViewData[rowCell[i].rowIndex]);
                    for (var j = 0, cLen = rowCell.length; j < cLen; j++) {
                        cells.push(this.parent.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                    }
                }
                if (this.isTrigger) {
                    this.parent.trigger(events.cellDeselecting, {
                        cells: cells, data: data, cellIndexes: rowCell
                    });
                }
                for (var i = 0, len = selectedCells.length; i < len; i++) {
                    selectedCells[i].classList.remove('e-cellselectionbackground');
                }
                this.selectedRowCellIndexes = [];
                this.isCellSelected = false;
                if (this.isTrigger) {
                    this.parent.trigger(events.cellDeselected, {
                        cells: cells, data: data, cellIndexes: rowCell
                    });
                }
            }
        };
        Selection.prototype.mouseMoveHandler = function (e) {
            e.preventDefault();
            var gBRect = this.parent.element.getBoundingClientRect();
            var x1 = this.x;
            var y1 = this.y;
            var position = util_2.getPosition(e);
            var x2 = position.x - gBRect.left;
            var y2 = position.y - gBRect.top;
            var tmp;
            var target = dom_1.closest(e.target, 'tr');
            this.isDragged = true;
            if (!target) {
                target = dom_1.closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
            if (target && !e.ctrlKey && !e.shiftKey) {
                var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
                this.selectRowsByRange(this.startIndex, rowIndex);
            }
        };
        Selection.prototype.mouseUpHandler = function (e) {
            document.body.classList.remove('e-disableuserselect');
            dom_1.remove(this.element);
            ej2_base_1.EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
            ej2_base_1.EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
            this.isDragged = false;
        };
        Selection.prototype.mouseDownHandler = function (e) {
            var target = e.target;
            if (e.shiftKey || e.ctrlKey) {
                e.preventDefault();
            }
            if (this.parent.allowRowDragAndDrop && target.classList.contains('e-rowcell') && !e.shiftKey && !e.ctrlKey) {
                if (!this.isRowType() || this.isSingleSel() || dom_1.closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                document.body.classList.add('e-disableuserselect');
                var tr = dom_1.closest(e.target, 'tr');
                var gBRect = this.parent.element.getBoundingClientRect();
                var postion = util_2.getPosition(e);
                this.startIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
                this.x = postion.x - gBRect.left;
                this.y = postion.y - gBRect.top;
                this.element = dom_1.createElement('div', { className: 'e-griddragarea' });
                this.parent.getContent().appendChild(this.element);
                ej2_base_1.EventHandler.add(this.parent.getContent(), 'mousemove', this.mouseMoveHandler, this);
                ej2_base_1.EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
            }
        };
        Selection.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.initialEnd, this.initializeSelection, this);
            this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
            this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.click, this.clickHandler, this);
            this.parent.on(events.keyPressed, this.keyPressHandler, this);
            this.parent.on(events.dataReady, this.clearSelection, this);
            this.parent.on(events.columnPositionChanged, this.clearSelection, this);
            this.parent.on(events.contentReady, this.initialEnd, this);
        };
        Selection.prototype.removeEventListener = function () {
            this.parent.off(events.initialEnd, this.initializeSelection);
            this.parent.off(events.rowSelectionComplete, this.onActionComplete);
            this.parent.off(events.cellSelectionComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.click, this.clickHandler);
            this.parent.off(events.keyPressed, this.keyPressHandler);
            this.parent.off(events.dataReady, this.clearSelection);
            this.parent.off(events.columnPositionChanged, this.clearSelection);
        };
        Selection.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            var gObj = this.parent;
            if (!util_1.isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'single') {
                if (this.selectedRowCellIndexes.length > 1) {
                    this.clearCellSelection();
                }
                if (this.selectedRowIndexes.length > 1) {
                    this.clearRowSelection();
                }
                this.enableSelectMultiTouch = false;
                this.hidePopUp();
            }
            if (!util_1.isNullOrUndefined(e.properties.mode) ||
                !util_1.isNullOrUndefined(e.properties.cellSelectionMode)) {
                this.clearSelection();
            }
        };
        Selection.prototype.hidePopUp = function () {
            if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
        };
        Selection.prototype.initialEnd = function () {
            this.parent.off(events.contentReady, this.initialEnd);
            this.selectRow(this.parent.selectedRowIndex);
        };
        Selection.prototype.clickHandler = function (e) {
            var target = e.target;
            this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
            this.isMultiShiftRequest = e.shiftKey;
            this.popUpClickHandler(e);
            this.target = e.target;
            if (target.classList.contains('e-rowcell')) {
                this.rowCellSelectionHandler(parseInt(target.parentElement.getAttribute('aria-rowindex'), 10), parseInt(target.getAttribute('aria-colindex'), 10));
                if (ej2_base_1.Browser.isDevice && this.parent.selectionSettings.type === 'multiple') {
                    this.showPopup(e);
                }
            }
            this.target = undefined;
            this.isMultiCtrlRequest = false;
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.popUpClickHandler = function (e) {
            var target = e.target;
            if (dom_1.closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
                dom_1.closest(target, '.e-gridpopup')) {
                if (target.classList.contains('e-rowselect')) {
                    if (!target.classList.contains('e-spanclicked')) {
                        target.classList.add('e-spanclicked');
                        this.enableSelectMultiTouch = true;
                    }
                    else {
                        target.classList.remove('e-spanclicked');
                        this.enableSelectMultiTouch = false;
                        this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                    }
                }
            }
            else {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
        };
        Selection.prototype.showPopup = function (e) {
            util_2.setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
                (this.selectionSettings.type === 'multiple' &&
                    (this.selectedRecords.length > 1 || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
        };
        Selection.prototype.rowCellSelectionHandler = function (rowIndex, cellIndex) {
            if (!this.isMultiCtrlRequest && !this.isMultiShiftRequest) {
                if (!this.isDragged) {
                    this.selectRow(rowIndex);
                }
                this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex });
            }
            else if (this.isMultiShiftRequest) {
                this.selectRowsByRange(util_1.isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
                this.selectCellsByRange(util_1.isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
            }
            else {
                this.addRowsToSelection([rowIndex]);
                this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
            }
            this.isDragged = false;
        };
        Selection.prototype.keyPressHandler = function (e) {
            var checkScroll;
            var preventDefault;
            switch (e.action) {
                case 'downArrow':
                    checkScroll = true;
                    this.downArrowKey();
                    break;
                case 'upArrow':
                    checkScroll = true;
                    this.upArrowKey();
                    break;
                case 'rightArrow':
                    preventDefault = true;
                    this.rightArrowKey();
                    break;
                case 'leftArrow':
                    preventDefault = true;
                    this.leftArrowKey();
                    break;
                case 'home':
                    preventDefault = true;
                    this.homeKey();
                    break;
                case 'end':
                    preventDefault = true;
                    this.endKey();
                    break;
                case 'ctrlHome':
                    preventDefault = true;
                    this.ctrlHomeKey();
                    break;
                case 'ctrlEnd':
                    preventDefault = true;
                    this.ctrlEndKey();
                    break;
                case 'shiftDown':
                    this.shiftDownKey();
                    break;
                case 'shiftUp':
                    this.shiftUpKey();
                    break;
                case 'shiftRight':
                    this.shiftRightKey();
                    break;
                case 'shiftLeft':
                    this.shiftLeftKey();
                    break;
                case 'escape':
                    preventDefault = true;
                    this.clearSelection();
                    break;
                case 'ctrlPlusA':
                    preventDefault = true;
                    this.ctrlPlusA();
                    break;
            }
            if (checkScroll) {
                var scrollElem = this.parent.getContent().firstElementChild;
                if (this.selectedRecords.length || this.selectedRowCellIndexes.length) {
                    var row = this.selectedRecords.length ? this.selectedRecords[0] :
                        this.parent.getRowByIndex(this.selectedRowCellIndexes[0].rowIndex);
                    var height = row.offsetHeight;
                    var rowIndex = row.rowIndex;
                    scrollElem.scrollTop = scrollElem.scrollTop + (e.action === 'downArrow' ? height : height * -1);
                    if (this.checkVisible(row) && rowIndex !== 0 && this.parent.getContent().querySelectorAll('tr').length !== rowIndex + 1) {
                        e.preventDefault();
                    }
                }
            }
            if (preventDefault) {
                e.preventDefault();
            }
        };
        Selection.prototype.checkVisible = function (element) {
            var st = window.scrollY;
            var y = element.getBoundingClientRect().top + st;
            return y + 36 < (window.innerHeight + st) - this.getRowHeight(element) && y > (st - element.offsetHeight) +
                this.getRowHeight(element);
        };
        Selection.prototype.getRowHeight = function (element) {
            return element.getBoundingClientRect().height;
        };
        Selection.prototype.ctrlPlusA = function () {
            if (this.isRowType()) {
                this.selectRowsByRange(0, this.parent.getRows().length - 1);
            }
            if (this.isCellType()) {
                this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
            }
        };
        Selection.prototype.downArrowKey = function () {
            this.applyDownUpKey(1, !util_1.isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex + 1 < this.parent.getRows().length, !util_1.isUndefined(this.prevECIdxs) &&
                this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length);
        };
        Selection.prototype.upArrowKey = function () {
            this.applyDownUpKey(-1, !util_1.isUndefined(this.parent.selectedRowIndex) && this.parent.selectedRowIndex - 1 > -1, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.rowIndex - 1 > -1);
        };
        Selection.prototype.applyDownUpKey = function (key, cond1, cond2) {
            var gObj = this.parent;
            if (this.isRowType() && cond1) {
                this.selectRow(gObj.selectedRowIndex + key);
            }
            if (this.isCellType() && cond2) {
                this.selectCell({ rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: this.prevECIdxs.cellIndex });
            }
        };
        Selection.prototype.rightArrowKey = function () {
            this.applyRightLeftKey(1, 0, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
        };
        Selection.prototype.leftArrowKey = function () {
            this.applyRightLeftKey(-1, this.parent.getColumns().length - 1, !util_1.isUndefined(this.prevECIdxs) && this.prevECIdxs.cellIndex - 1 > -1);
        };
        Selection.prototype.applyRightLeftKey = function (key1, key2, cond) {
            var gObj = this.parent;
            if (this.isCellType()) {
                if (cond && this.prevECIdxs.cellIndex + key1 > -1 &&
                    this.prevECIdxs.cellIndex + key1 < this.parent.getColumns().length) {
                    this.selectCell({ rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key1 });
                }
                else if (this.prevECIdxs.rowIndex + key1 > -1 &&
                    this.prevECIdxs.rowIndex + key1 < this.parent.getRows().length) {
                    this.selectCell({ rowIndex: this.prevECIdxs.rowIndex + key1, cellIndex: key2 });
                }
                if (gObj.element.querySelector('.e-cellselectionbackground').classList.contains('e-hide')) {
                    this.applyRightLeftKey(key1, key2, cond);
                }
            }
        };
        Selection.prototype.homeKey = function () {
            this.applyHomeEndKey({ rowIndex: 0, cellIndex: 0 });
        };
        Selection.prototype.endKey = function () {
            this.applyHomeEndKey({ rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        };
        Selection.prototype.applyHomeEndKey = function (key) {
            if (this.isCellType()) {
                this.selectCell(key);
            }
        };
        Selection.prototype.shiftDownKey = function () {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isRowType()) {
                if (!util_1.isUndefined(this.prevRowIndex)) {
                    var endIndex = util_1.isUndefined(gObj.selectedRowIndex) ? this.prevRowIndex + 1 :
                        (gObj.selectedRowIndex + 1 < this.parent.getRows().length ?
                            gObj.selectedRowIndex + 1 : gObj.selectedRowIndex);
                    if (endIndex < this.parent.getRows().length) {
                        this.selectRowsByRange(this.prevRowIndex, endIndex);
                    }
                }
                else {
                    this.selectRow(0);
                }
            }
            if (this.isCellType()) {
                if (!util_1.isUndefined(this.prevCIdxs)) {
                    if (this.prevECIdxs.rowIndex + 1 < this.parent.getRows().length) {
                        this.selectCellsByRange(this.prevCIdxs, { rowIndex: this.prevECIdxs.rowIndex + 1, cellIndex: this.prevECIdxs.cellIndex });
                    }
                }
                else {
                    this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: 1, cellIndex: 0 });
                }
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.shiftUpKey = function () {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isRowType() && !util_1.isUndefined(this.prevRowIndex)) {
                var endIndex = util_1.isUndefined(gObj.selectedRowIndex) ? (this.prevRowIndex - 1 > -1 ? (this.prevRowIndex - 1) : 0) :
                    ((gObj.selectedRowIndex - 1) > -1 ? gObj.selectedRowIndex - 1 : gObj.selectedRowIndex);
                this.selectRowsByRange(this.prevRowIndex, endIndex);
            }
            if (this.isCellType() && !util_1.isUndefined(this.prevECIdxs) && (this.prevECIdxs.rowIndex - 1) > -1) {
                this.selectCellsByRange(this.prevCIdxs, { rowIndex: this.prevECIdxs.rowIndex - 1, cellIndex: this.prevECIdxs.cellIndex });
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.shiftLeftKey = function () {
            this.applyShiftLeftRightKey(-1, !util_1.isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex - 1 > -1);
        };
        Selection.prototype.shiftRightKey = function () {
            this.applyShiftLeftRightKey(1, !util_1.isUndefined(this.prevCIdxs) && this.prevECIdxs.cellIndex + 1 < this.parent.getColumns().length);
        };
        Selection.prototype.applyShiftLeftRightKey = function (key, cond) {
            var gObj = this.parent;
            this.isMultiShiftRequest = true;
            if (this.isCellType()) {
                if (cond) {
                    this.selectCellsByRange(this.prevCIdxs, {
                        rowIndex: this.prevECIdxs.rowIndex, cellIndex: this.prevECIdxs.cellIndex + key
                    });
                }
                else {
                    if (this.selectionSettings.cellSelectionMode === 'flow' &&
                        (key > 0 ? this.prevECIdxs.rowIndex + 1 < this.parent.pageSettings.pageSize : this.prevECIdxs.rowIndex - 1 > -1)) {
                        this.selectCellsByRange(this.prevCIdxs, {
                            rowIndex: this.prevECIdxs.rowIndex + key, cellIndex: key > 0 ? 0 : gObj.getColumns().length - 1
                        });
                    }
                }
            }
            this.isMultiShiftRequest = false;
        };
        Selection.prototype.ctrlHomeKey = function () {
            this.applyCtrlHomeEndKey(0, 0);
        };
        Selection.prototype.ctrlEndKey = function () {
            this.applyCtrlHomeEndKey(this.parent.getRows().length - 1, this.parent.getColumns().length - 1);
        };
        Selection.prototype.applyCtrlHomeEndKey = function (rowIndex, colIndex) {
            if (this.isRowType()) {
                this.selectRow(rowIndex);
            }
            if (this.isCellType()) {
                this.selectCell({ rowIndex: rowIndex, cellIndex: colIndex });
            }
        };
        Selection.prototype.addRemoveClassesForRow = function (row, isAdd) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var cells = row.querySelectorAll('.e-rowcell');
            for (var i = 0, len = cells.length; i < len; i++) {
                if (isAdd) {
                    dom_1.classList(cells[i], args.slice(), []);
                }
                else {
                    dom_1.classList(cells[i], [], args.slice());
                }
            }
        };
        Selection.prototype.isRowType = function () {
            return this.selectionSettings.mode === 'row' || this.selectionSettings.mode === 'both';
        };
        Selection.prototype.isCellType = function () {
            return this.selectionSettings.mode === 'cell' || this.selectionSettings.mode === 'both';
        };
        Selection.prototype.isSingleSel = function () {
            return this.selectionSettings.type === 'single';
        };
        return Selection;
    }());
    exports.Selection = Selection;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, util_2, events) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShowHide = (function () {
        function ShowHide(parent) {
            this.parent = parent;
        }
        ShowHide.prototype.show = function (columnName, showBy) {
            var keys = this.getToggleFields(columnName);
            var columns = this.getColumns(keys, showBy);
            columns.forEach(function (value) {
                value.visible = true;
            });
            this.setVisible(columns);
        };
        ShowHide.prototype.hide = function (columnName, hideBy) {
            var keys = this.getToggleFields(columnName);
            var columns = this.getColumns(keys, hideBy);
            columns.forEach(function (value) {
                value.visible = false;
            });
            this.setVisible(columns);
        };
        ShowHide.prototype.getToggleFields = function (key) {
            var finalized = [];
            if (typeof key === 'string') {
                finalized = [key];
            }
            else {
                finalized = key;
            }
            return finalized;
        };
        ShowHide.prototype.getColumns = function (keys, getKeyBy) {
            var _this = this;
            var columns = util_2.iterateArrayOrObject(keys, function (key, index) {
                return util_2.iterateArrayOrObject(_this.parent.getColumns(), function (item, index) {
                    if (item[getKeyBy] === key) {
                        return item;
                    }
                    return undefined;
                })[0];
            });
            return columns;
        };
        ShowHide.prototype.setVisible = function (columns) {
            columns = util_1.isNullOrUndefined(columns) ? this.parent.getColumns() : columns;
            this.parent.notify(events.columnVisibilityChanged, columns);
        };
        return ShowHide;
    }());
    exports.ShowHide = ShowHide;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(12), __webpack_require__(15), __webpack_require__(52)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, util_2, events, aria_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sort = (function () {
        function Sort(parent, sortSettings, sortedColumns) {
            this.contentRefresh = true;
            this.isModelChanged = true;
            this.aria = new aria_service_1.AriaService();
            this.parent = parent;
            this.sortSettings = sortSettings;
            this.sortedColumns = sortedColumns;
            this.addEventListener();
        }
        Sort.prototype.updateModel = function () {
            var sortedColumn = { field: this.columnName, direction: this.direction };
            var index;
            var gCols = this.parent.groupSettings.columns;
            var flag = false;
            if (!this.isMultiSort) {
                if (!gCols.length) {
                    this.sortSettings.columns = [sortedColumn];
                }
                else {
                    var sortedCols = [];
                    for (var i = 0, len = gCols.length; i < len; i++) {
                        index = this.getSortedColsIndexByField(gCols[i], sortedCols);
                        if (this.columnName === gCols[i]) {
                            flag = true;
                            sortedCols.push(sortedColumn);
                        }
                        else {
                            var sCol = this.getSortColumnFromField(gCols[i]);
                            sortedCols.push({ field: sCol.field, direction: sCol.direction });
                        }
                    }
                    if (!flag) {
                        sortedCols.push(sortedColumn);
                    }
                    this.sortSettings.columns = sortedCols;
                }
            }
            else {
                index = this.getSortedColsIndexByField(this.columnName);
                if (index > -1) {
                    this.sortSettings.columns[index] = sortedColumn;
                }
                else {
                    this.sortSettings.columns.push(sortedColumn);
                }
                this.sortSettings.columns = this.sortSettings.columns;
            }
            this.parent.dataBind();
            this.lastSortedCol = this.columnName;
        };
        Sort.prototype.onActionComplete = function (e) {
            var args = !this.isRemove ? {
                columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionComplete
            } : { requestType: 'sorting', type: events.actionComplete };
            this.isRemove = false;
            this.parent.trigger(events.actionComplete, util_1.extend(e, args));
        };
        Sort.prototype.sortColumn = function (columnName, direction, isMultiSort) {
            if (this.parent.getColumnByField(columnName).allowSorting === false) {
                return;
            }
            this.columnName = columnName;
            this.direction = direction;
            this.isMultiSort = isMultiSort;
            this.removeSortIcons();
            var column = this.parent.getColumnHeaderByField(columnName);
            this.updateSortedCols(columnName, isMultiSort);
            this.updateModel();
        };
        Sort.prototype.updateSortedCols = function (columnName, isMultiSort) {
            if (!isMultiSort) {
                if (this.parent.allowGrouping) {
                    for (var i = 0, len = this.sortedColumns.length; i < len; i++) {
                        if (this.parent.groupSettings.columns.indexOf(this.sortedColumns[i]) < 0) {
                            this.sortedColumns.splice(i, 1);
                            len--;
                            i--;
                        }
                    }
                }
                else {
                    this.sortedColumns.splice(0, this.sortedColumns.length);
                }
            }
            if (this.sortedColumns.indexOf(columnName) < 0) {
                this.sortedColumns.push(columnName);
            }
        };
        Sort.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName()) {
                return;
            }
            if (this.contentRefresh) {
                var args = this.sortSettings.columns.length ? {
                    columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionBegin
                } : { requestType: 'sorting', type: events.actionBegin };
                this.parent.notify(events.modelChanged, args);
            }
            this.removeSortIcons();
            this.addSortIcons();
        };
        Sort.prototype.clearSorting = function () {
            var cols = util_2.getActualPropFromColl(this.sortSettings.columns);
            for (var i = 0, len = cols.length; i < len; i++) {
                this.removeSortColumn(cols[i].field);
            }
        };
        Sort.prototype.removeSortColumn = function (field) {
            var gObj = this.parent;
            var cols = this.sortSettings.columns;
            this.removeSortIcons();
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                        continue;
                    }
                    this.sortedColumns.splice(this.sortedColumns.indexOf(cols[i].field), 1);
                    cols.splice(i, 1);
                    this.isRemove = true;
                    if (this.isModelChanged) {
                        this.parent.notify(events.modelChanged, {
                            requestType: 'sorting', type: events.actionBegin
                        });
                    }
                    break;
                }
            }
            this.addSortIcons();
        };
        Sort.prototype.getSortedColsIndexByField = function (field, sortedColumns) {
            var cols = sortedColumns ? sortedColumns : this.sortSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                if (cols[i].field === field) {
                    return i;
                }
            }
            return -1;
        };
        Sort.prototype.getModuleName = function () {
            return 'sort';
        };
        Sort.prototype.initialEnd = function () {
            this.parent.off(events.contentReady, this.initialEnd);
            if (this.parent.getColumns().length && this.sortSettings.columns.length) {
                var gObj = this.parent;
                this.contentRefresh = false;
                this.isMultiSort = this.sortSettings.columns.length > 1;
                for (var _i = 0, _a = gObj.sortSettings.columns; _i < _a.length; _i++) {
                    var col = _a[_i];
                    if (this.sortedColumns.indexOf(col.field) > -1) {
                        this.sortColumn(col.field, col.direction, true);
                    }
                }
                this.isMultiSort = false;
                this.contentRefresh = true;
            }
        };
        Sort.prototype.addEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.on(events.contentReady, this.initialEnd, this);
            this.parent.on(events.sortComplete, this.onActionComplete, this);
            this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
            this.parent.on(events.click, this.clickHandler, this);
            this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
        };
        Sort.prototype.removeEventListener = function () {
            this.parent.off(events.sortComplete, this.onActionComplete);
            this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
            this.parent.off(events.click, this.clickHandler);
            this.parent.off(events.headerRefreshed, this.refreshSortIcons);
        };
        Sort.prototype.destroy = function () {
            this.isModelChanged = false;
            if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-sortdirect').length) {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
            this.clearSorting();
            this.isModelChanged = true;
            this.removeEventListener();
        };
        Sort.prototype.clickHandler = function (e) {
            this.popUpClickHandler(e);
            var target = dom_1.closest(e.target, '.e-headercell');
            if (target && !e.target.classList.contains('e-grptogglebtn') &&
                !e.target.classList.contains('e-stackedheadercell')) {
                var gObj = this.parent;
                var field = gObj.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid')).field;
                var direction = !target.querySelectorAll('.e-ascending').length ? 'ascending' :
                    'descending';
                if (!e.shiftKey) {
                    this.sortColumn(field, direction, e.ctrlKey || this.enableSortMultiTouch);
                }
                else {
                    this.removeSortColumn(field);
                }
                if (ej2_base_1.Browser.isDevice) {
                    this.showPopUp(e);
                }
            }
        };
        Sort.prototype.showPopUp = function (e) {
            var target = dom_1.closest(e.target, '.e-headercell');
            if (!util_1.isNullOrUndefined(target)) {
                util_2.setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-sortdirect e-icons e-icon-sortdirect' + (this.sortedColumns.length > 1 ? ' e-spanclicked' : ''));
            }
        };
        Sort.prototype.popUpClickHandler = function (e) {
            var target = e.target;
            if (dom_1.closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
                dom_1.closest(target, '.e-gridpopup')) {
                if (target.classList.contains('e-sortdirect')) {
                    if (!target.classList.contains('e-spanclicked')) {
                        target.classList.add('e-spanclicked');
                        this.enableSortMultiTouch = true;
                    }
                    else {
                        target.classList.remove('e-spanclicked');
                        this.enableSortMultiTouch = false;
                        this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                    }
                }
            }
            else {
                this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
            }
        };
        Sort.prototype.addSortIcons = function () {
            var gObj = this.parent;
            var header;
            var filterElement;
            var cols = this.sortSettings.columns;
            for (var i = 0, len = cols.length; i < len; i++) {
                header = gObj.getColumnHeaderByField(cols[i].field);
                this.aria.setSort(header, cols[i].direction);
                if (this.isMultiSort && cols.length > 1) {
                    header.querySelector('.e-headercelldiv').insertBefore(dom_1.createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }), header.querySelector('.e-headertext'));
                }
                filterElement = header.querySelector('.e-sortfilterdiv');
                if (cols[i].direction === 'ascending') {
                    dom_1.classList(filterElement, ['e-ascending', 'e-icon-ascending'], []);
                }
                else {
                    dom_1.classList(filterElement, ['e-descending', 'e-icon-descending'], []);
                }
            }
        };
        Sort.prototype.removeSortIcons = function (position) {
            var gObj = this.parent;
            var header;
            var cols = this.sortSettings.columns;
            for (var i = position ? position : 0, len = !util_1.isNullOrUndefined(position) ? position + 1 : cols.length; i < len; i++) {
                if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                    continue;
                }
                header = gObj.getColumnHeaderByField(cols[i].field);
                this.aria.setSort(header, 'none');
                dom_1.classList(header.querySelector('.e-sortfilterdiv'), [], ['e-descending', 'e-icon-descending', 'e-ascending', 'e-icon-ascending']);
                if (header.querySelector('.e-sortnumber')) {
                    header.querySelector('.e-headercelldiv').removeChild(header.querySelector('.e-sortnumber'));
                }
            }
        };
        Sort.prototype.getSortColumnFromField = function (field) {
            for (var i = 0, len = this.sortSettings.columns.length; i < len; i++) {
                if (this.sortSettings.columns[i].field === field) {
                    return this.sortSettings.columns[i];
                }
            }
            return false;
        };
        Sort.prototype.updateAriaAttr = function () {
            for (var _i = 0, _a = this.sortedColumns; _i < _a.length; _i++) {
                var col = _a[_i];
                var header = this.parent.getColumnHeaderByField(col);
                this.aria.setSort(header, this.getSortColumnFromField(col).direction);
            }
        };
        Sort.prototype.refreshSortIcons = function () {
            this.removeSortIcons();
            this.isMultiSort = true;
            this.removeSortIcons();
            this.addSortIcons();
            this.isMultiSort = false;
            this.updateAriaAttr();
        };
        return Sort;
    }());
    exports.Sort = Sort;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 171 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(0), __webpack_require__(2), __webpack_require__(1), __webpack_require__(1), __webpack_require__(12), __webpack_require__(15), __webpack_require__(88), __webpack_require__(19), __webpack_require__(90), __webpack_require__(92), __webpack_require__(93), __webpack_require__(180), __webpack_require__(94), __webpack_require__(52), __webpack_require__(175), __webpack_require__(83), __webpack_require__(169), __webpack_require__(82), __webpack_require__(81)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1, util_1, dom_1, ej2_base_2, ej2_base_3, util_2, events, render_1, enum_1, cell_render_factory_1, service_locator_1, value_formatter_1, renderer_factory_1, width_controller_1, aria_service_1, page_settings_1, search_1, show_hide_1, scroll_1, print_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SortDescriptor = (function (_super) {
        __extends(SortDescriptor, _super);
        function SortDescriptor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SortDescriptor;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], SortDescriptor.prototype, "field", void 0);
    __decorate([
        ej2_base_2.Property()
    ], SortDescriptor.prototype, "direction", void 0);
    exports.SortDescriptor = SortDescriptor;
    var SortSettings = (function (_super) {
        __extends(SortSettings, _super);
        function SortSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SortSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Collection([], SortDescriptor)
    ], SortSettings.prototype, "columns", void 0);
    exports.SortSettings = SortSettings;
    var Predicate = (function (_super) {
        __extends(Predicate, _super);
        function Predicate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Predicate;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "field", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "operator", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "value", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "matchCase", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Predicate.prototype, "predicate", void 0);
    __decorate([
        ej2_base_2.Property({})
    ], Predicate.prototype, "actualFilterValue", void 0);
    __decorate([
        ej2_base_2.Property({})
    ], Predicate.prototype, "actualOperator", void 0);
    exports.Predicate = Predicate;
    var FilterSettings = (function (_super) {
        __extends(FilterSettings, _super);
        function FilterSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FilterSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Collection([], Predicate)
    ], FilterSettings.prototype, "columns", void 0);
    __decorate([
        ej2_base_2.Property('filterbar')
    ], FilterSettings.prototype, "type", void 0);
    __decorate([
        ej2_base_2.Property()
    ], FilterSettings.prototype, "mode", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], FilterSettings.prototype, "showFilterBarStatus", void 0);
    __decorate([
        ej2_base_2.Property(1500)
    ], FilterSettings.prototype, "immediateModeDelay", void 0);
    exports.FilterSettings = FilterSettings;
    var SelectionSettings = (function (_super) {
        __extends(SelectionSettings, _super);
        function SelectionSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SelectionSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property('row')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate([
        ej2_base_2.Property('flow')
    ], SelectionSettings.prototype, "cellSelectionMode", void 0);
    __decorate([
        ej2_base_2.Property('single')
    ], SelectionSettings.prototype, "type", void 0);
    exports.SelectionSettings = SelectionSettings;
    var SearchSettings = (function (_super) {
        __extends(SearchSettings, _super);
        function SearchSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SearchSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property([])
    ], SearchSettings.prototype, "fields", void 0);
    __decorate([
        ej2_base_2.Property('')
    ], SearchSettings.prototype, "key", void 0);
    __decorate([
        ej2_base_2.Property('contains')
    ], SearchSettings.prototype, "operator", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], SearchSettings.prototype, "ignoreCase", void 0);
    exports.SearchSettings = SearchSettings;
    var RowDropSettings = (function (_super) {
        __extends(RowDropSettings, _super);
        function RowDropSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RowDropSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property()
    ], RowDropSettings.prototype, "targetID", void 0);
    exports.RowDropSettings = RowDropSettings;
    var GroupSettings = (function (_super) {
        __extends(GroupSettings, _super);
        function GroupSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GroupSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_2.Property(true)
    ], GroupSettings.prototype, "showDropArea", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], GroupSettings.prototype, "showToggleButton", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], GroupSettings.prototype, "showGroupedColumn", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], GroupSettings.prototype, "showUngroupButton", void 0);
    __decorate([
        ej2_base_2.Property([])
    ], GroupSettings.prototype, "columns", void 0);
    exports.GroupSettings = GroupSettings;
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(options, element) {
            var _this = _super.call(this, options, element) || this;
            _this.isInitial = true;
            _this.sortedColumns = [];
            _this.filterOperators = {
                contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
                lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
            };
            _this.defaultLocale = {
                EmptyRecord: 'No records to display',
                True: 'true',
                False: 'false',
                InvalidFilterMessage: 'Invalid Filter Data',
                GroupDropArea: 'Drag a column header here to group its column',
                UnGroup: 'Click here to ungroup',
                GroupDisable: 'Grouping is disabled for this column',
                FilterbarTitle: '\'s filter bar cell',
                EmptyDataSourceError: 'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid'
            };
            _this.keyConfigs = {
                downArrow: 'downarrow',
                upArrow: 'uparrow',
                rightArrow: 'rightarrow',
                leftArrow: 'leftarrow',
                shiftDown: 'shift+downarrow',
                shiftUp: 'shift+uparrow',
                shiftRight: 'shift+rightarrow',
                shiftLeft: 'shift+leftarrow',
                home: 'home',
                end: 'end',
                escape: 'escape',
                ctrlHome: 'ctrl+home',
                ctrlEnd: 'ctrl+end',
                pageUp: 'pageup',
                pageDown: 'pagedown',
                ctrlAltPageUp: 'ctrl+alt+pageup',
                ctrlAltPageDown: 'ctrl+alt+pagedown',
                altPageUp: 'alt+pageup',
                altPageDown: 'alt+pagedown',
                altDownArrow: 'alt+downarrow',
                altUpArrow: 'alt+uparrow',
                ctrlDownArrow: 'ctrl+downarrow',
                ctrlUpArrow: 'ctrl+uparrow',
                ctrlPlusA: 'ctrl+A'
            };
            return _this;
        }
        Grid.prototype.getPersistData = function () {
            var keyEntity = ['allowPaging', 'pageSettings', 'allowSorting', 'sortSettings', 'allowSelection',
                'selectionSettings', 'allowFiltering', 'filterSettings', 'gridLines',
                'create', 'destroyed', 'load', 'actionBegin', 'actionComplete', 'actionFailure', 'rowSelecting', 'rowSelected',
                'columnSelecting', 'columnSelected', 'cellSelecting', 'cellSelected', 'dataBound'];
            return this.addOnPersist(keyEntity);
        };
        Grid.prototype.requiredModules = function () {
            var modules = [];
            if (this.allowFiltering) {
                modules.push({
                    member: 'filter',
                    args: [this, this.filterSettings, this.serviceLocator]
                });
            }
            if (this.allowSorting) {
                modules.push({
                    member: 'sort',
                    args: [this, this.sortSettings, this.sortedColumns]
                });
            }
            if (this.allowPaging) {
                modules.push({
                    member: 'pager',
                    args: [this, this.pageSettings]
                });
            }
            if (this.allowSelection) {
                modules.push({
                    member: 'selection',
                    args: [this, this.selectionSettings]
                });
            }
            if (this.allowReordering) {
                modules.push({
                    member: 'reorder',
                    args: [this]
                });
            }
            if (this.allowRowDragAndDrop) {
                modules.push({
                    member: 'rowDragAndDrop',
                    args: [this]
                });
            }
            if (this.allowGrouping) {
                modules.push({
                    member: 'group',
                    args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator]
                });
            }
            return modules;
        };
        Grid.prototype.preRender = function () {
            this.serviceLocator = new service_locator_1.ServiceLocator;
        };
        Grid.prototype.render = function () {
            this.initializeServices();
            this.ariaService.setOptions(this.element, { role: 'grid' });
            this.renderModule = new render_1.Render(this, this.serviceLocator);
            this.searchModule = new search_1.Search(this);
            this.scrollModule = new scroll_1.Scroll(this);
            this.notify(events.initialLoad, {});
            this.trigger(events.load);
            util_2.prepareColumns(this.columns);
            this.getColumns();
            this.processModel();
            this.gridRender();
            this.wireEvents();
            this.addListener();
            this.updateDefaultCursor();
            this.notify(events.initialEnd, {});
        };
        Grid.prototype.eventInitializer = function () {
        };
        Grid.prototype.destroy = function () {
            this.unwireEvents();
            this.removeListener();
            this.notify(events.destroy, {});
            this.destroyDependentModules();
            _super.prototype.destroy.call(this);
            this.element.innerHTML = '';
            dom_1.classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device']);
        };
        Grid.prototype.destroyDependentModules = function () {
            this.scrollModule.destroy();
            this.keyBoardModule.destroy();
        };
        Grid.prototype.getModuleName = function () {
            return 'grid';
        };
        Grid.prototype.onPropertyChanged = function (newProp, oldProp) {
            var requireRefresh = false;
            var checkCursor;
            var args = { requestType: 'refresh' };
            if (this.isDestroyed) {
                return;
            }
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                this.extendedPropertyChange(prop, newProp);
                switch (prop) {
                    case 'enableRtl':
                        this.updateRTL();
                        if (this.allowPaging) {
                            this.element.querySelector('.e-gridpager').ej2_instances[0].enableRtl = newProp.enableRtl;
                        }
                        if (this.height !== 'auto') {
                            this.scrollModule.removePadding(!newProp.enableRtl);
                            this.scrollModule.setPadding();
                        }
                        break;
                    case 'enableHover':
                        var action = newProp.enableHover ? dom_1.addClass : dom_1.removeClass;
                        action([this.element], 'e-gridhover');
                        break;
                    case 'dataSource':
                    case 'query':
                        this.notify(events.dataSourceModified, {});
                        this.renderModule.refresh();
                        break;
                    case 'allowPaging':
                        this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                        requireRefresh = true;
                        break;
                    case 'pageSettings':
                        this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                        if (util_1.isNullOrUndefined(newProp.pageSettings.currentPage) && util_1.isNullOrUndefined(newProp.pageSettings.totalRecordsCount)) {
                            requireRefresh = true;
                        }
                        break;
                    case 'allowTextWrap':
                        if (this.allowTextWrap) {
                            this.applyTextWrap();
                        }
                        else {
                            this.removeTextWrap();
                        }
                        break;
                    case 'locale':
                        this.localeObj.setLocale(newProp.locale);
                        this.valueFormatterService.setCulture(newProp.locale);
                        requireRefresh = true;
                        break;
                    case 'allowSorting':
                        this.notify(events.uiUpdate, { module: 'sort', enable: this.allowSorting });
                        requireRefresh = true;
                        checkCursor = true;
                        break;
                    case 'allowFiltering':
                        this.notify(events.uiUpdate, { module: 'filter', enable: this.allowFiltering });
                        requireRefresh = true;
                        break;
                    case 'height':
                    case 'width':
                        this.notify(events.uiUpdate, {
                            module: 'scroll',
                            properties: { width: newProp.width, height: newProp.height }
                        });
                        break;
                    case 'allowReordering':
                        this.notify(events.uiUpdate, { module: 'reorder', enable: this.allowReordering });
                        checkCursor = true;
                        break;
                    case 'allowRowDragAndDrop':
                        this.notify(events.uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                        break;
                    case 'rowTemplate':
                        this.updateRowTemplateFn();
                        requireRefresh = true;
                        break;
                    case 'allowGrouping':
                        this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                        this.headerModule.refreshUI();
                        requireRefresh = true;
                        checkCursor = true;
                        break;
                }
            }
            if (checkCursor) {
                this.updateDefaultCursor();
            }
            if (requireRefresh) {
                this.notify(events.modelChanged, args);
                requireRefresh = false;
            }
        };
        Grid.prototype.extendedPropertyChange = function (prop, newProp) {
            switch (prop) {
                case 'enableAltRow':
                    this.renderModule.refresh();
                    break;
                case 'gridLines':
                    this.updateGridLines();
                    break;
                case 'groupSettings':
                    this.notify(events.inBoundModelChanged, { module: 'group', properties: newProp.groupSettings });
                    break;
                case 'filterSettings':
                    this.notify(events.inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings });
                    break;
                case 'searchSettings':
                    this.notify(events.inBoundModelChanged, { module: 'search', properties: newProp.searchSettings });
                    break;
                case 'sortSettings':
                    this.notify(events.inBoundModelChanged, { module: 'sort' });
                    break;
                case 'selectionSettings':
                    this.notify(events.inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings });
                    break;
            }
        };
        Grid.prototype.updateDefaultCursor = function () {
            var headerRows = [].slice.call(this.element.querySelectorAll('.e-columnheader'));
            for (var _i = 0, headerRows_1 = headerRows; _i < headerRows_1.length; _i++) {
                var row = headerRows_1[_i];
                if (this.allowSorting || this.allowGrouping || this.allowReordering) {
                    row.classList.remove('e-defaultcursor');
                }
                else {
                    row.classList.add('e-defaultcursor');
                }
            }
        };
        Grid.prototype.updateColumnModel = function (columns) {
            for (var i = 0, len = columns.length; i < len; i++) {
                if (columns[i].columns) {
                    this.updateColumnModel(columns[i].columns);
                }
                else {
                    this.columnModel.push(columns[i]);
                }
            }
        };
        Grid.prototype.getColumns = function () {
            this.columnModel = [];
            this.updateColumnModel(this.columns);
            return this.columnModel;
        };
        Grid.prototype.getVisibleColumns = function () {
            var cols = [];
            for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
                var col = _a[_i];
                if (col.visible) {
                    cols.push(col);
                }
            }
            return cols;
        };
        Grid.prototype.getHeaderContent = function () {
            return this.headerModule.getPanel();
        };
        Grid.prototype.setGridHeaderContent = function (element) {
            this.headerModule.setPanel(element);
        };
        Grid.prototype.getContentTable = function () {
            return this.contentModule.getTable();
        };
        Grid.prototype.setGridContentTable = function (element) {
            this.contentModule.setTable(element);
        };
        Grid.prototype.getContent = function () {
            return this.contentModule.getPanel();
        };
        Grid.prototype.setGridContent = function (element) {
            this.contentModule.setPanel(element);
        };
        Grid.prototype.getHeaderTable = function () {
            return this.headerModule.getTable();
        };
        Grid.prototype.setGridHeaderTable = function (element) {
            this.headerModule.setTable(element);
        };
        Grid.prototype.getPager = function () {
            return this.gridPager;
        };
        Grid.prototype.setGridPager = function (element) {
            this.gridPager = element;
        };
        Grid.prototype.getRowByIndex = function (index) {
            return this.getContentTable().querySelectorAll('.e-row')[index];
        };
        Grid.prototype.getRows = function () {
            return this.contentModule.getRowElements();
        };
        Grid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
            return this.getContent().querySelectorAll('.e-row')[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
        };
        Grid.prototype.getColumnHeaderByIndex = function (index) {
            return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
        };
        Grid.prototype.getColumnHeaderByField = function (field) {
            return this.getColumnHeaderByUid(this.getColumnByField(field).uid);
        };
        Grid.prototype.getColumnHeaderByUid = function (uid) {
            return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
        };
        Grid.prototype.getColumnByField = function (field) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.field === field) {
                    return item;
                }
                return undefined;
            })[0];
        };
        Grid.prototype.getColumnIndexByField = function (field) {
            var index = util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.field === field) {
                    return index;
                }
                return undefined;
            })[0];
            return !util_1.isNullOrUndefined(index) ? index : -1;
        };
        Grid.prototype.getColumnByUid = function (uid) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
        };
        Grid.prototype.getColumnIndexByUid = function (uid) {
            var index = util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.uid === uid) {
                    return index;
                }
                return undefined;
            })[0];
            return !util_1.isNullOrUndefined(index) ? index : -1;
        };
        Grid.prototype.getUidByColumnField = function (field) {
            return util_2.iterateArrayOrObject(this.getColumns(), function (item, index) {
                if (item.field === field) {
                    return item.uid;
                }
                return undefined;
            })[0];
        };
        Grid.prototype.getNormalizedColumnIndex = function (uid) {
            var index = this.getColumnIndexByUid(uid);
            if (this.allowGrouping) {
                index += this.groupSettings.columns.length;
            }
            return index;
        };
        Grid.prototype.getColumnFieldNames = function () {
            var columnNames = [];
            var column;
            for (var i = 0, len = this.getColumns().length; i < len; i++) {
                column = this.getColumns()[i];
                if (column.visible) {
                    columnNames.push(column.field);
                }
            }
            return columnNames;
        };
        Grid.prototype.getRowTemplate = function () {
            return this.rowTemplateFn;
        };
        Grid.prototype.refresh = function () {
            this.headerModule.refreshUI();
            this.renderModule.refresh();
        };
        Grid.prototype.refreshHeader = function () {
            this.headerModule.refreshUI();
        };
        Grid.prototype.getSelectedRows = function () {
            return this.selectionModule.selectedRecords;
        };
        Grid.prototype.getSelectedRowIndexes = function () {
            return this.selectionModule.selectedRowIndexes;
        };
        Grid.prototype.getSelectedRowCellIndexes = function () {
            return this.selectionModule.selectedRowCellIndexes;
        };
        Grid.prototype.getSelectedRecords = function () {
            var records = [];
            var key = 'records';
            var currentViewData = this.allowGrouping && this.groupSettings.columns.length ?
                this.currentViewData[key] : this.currentViewData;
            for (var i = 0, len = this.selectionModule.selectedRowIndexes.length; i < len; i++) {
                records.push(currentViewData[this.selectionModule.selectedRowIndexes[i]]);
            }
            return records;
        };
        Grid.prototype.showColumns = function (keys, showBy) {
            showBy = showBy ? showBy : 'headerText';
            this.showHider.show(keys, showBy);
        };
        Grid.prototype.hideColumns = function (keys, hideBy) {
            hideBy = hideBy ? hideBy : 'headerText';
            this.showHider.hide(keys, hideBy);
        };
        Grid.prototype.goToPage = function (pageNo) {
            this.pagerModule.goToPage(pageNo);
        };
        Grid.prototype.updateExternalMessage = function (message) {
            this.pagerModule.updateExternalMessage(message);
        };
        Grid.prototype.sortColumn = function (columnName, direction, isMultiSort) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        };
        Grid.prototype.clearSorting = function () {
            this.sortModule.clearSorting();
        };
        Grid.prototype.removeSortColumn = function (field) {
            this.sortModule.removeSortColumn(field);
        };
        Grid.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
            this.filterModule.filterByColumn(fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator);
        };
        Grid.prototype.clearFiltering = function () {
            this.filterModule.clearFiltering();
        };
        Grid.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
            this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
        };
        Grid.prototype.selectRow = function (index) {
            this.selectionModule.selectRow(index);
        };
        Grid.prototype.selectRows = function (rowIndexes) {
            this.selectionModule.selectRows(rowIndexes);
        };
        Grid.prototype.clearSelection = function () {
            this.selectionModule.clearSelection();
        };
        Grid.prototype.selectCell = function (cellIndex) {
            this.selectionModule.selectCell(cellIndex);
        };
        Grid.prototype.search = function (searchString) {
            this.searchModule.search(searchString);
        };
        Grid.prototype.print = function () {
            this.printModule.print();
        };
        Grid.prototype.reorderColumns = function (fromFName, toFName) {
            this.reorderModule.reorderColumns(fromFName, toFName);
        };
        Grid.prototype.initializeServices = function () {
            this.serviceLocator.register('widthService', this.widthService = new width_controller_1.ColumnWidthService(this));
            this.serviceLocator.register('cellRendererFactory', new cell_render_factory_1.CellRendererFactory);
            this.serviceLocator.register('rendererFactory', new renderer_factory_1.RendererFactory);
            this.serviceLocator.register('localization', this.localeObj = new ej2_base_2.L10n(this.getModuleName(), this.defaultLocale, this.locale));
            this.serviceLocator.register('valueFormatter', this.valueFormatterService = new value_formatter_1.ValueFormatter(this.locale));
            this.serviceLocator.register('showHideService', this.showHider = new show_hide_1.ShowHide(this));
            this.serviceLocator.register('ariaService', this.ariaService = new aria_service_1.AriaService());
        };
        Grid.prototype.processModel = function () {
            var gCols = this.groupSettings.columns;
            var sCols = this.sortSettings.columns;
            var flag;
            var j;
            if (this.allowGrouping) {
                for (var i = 0, len = gCols.length; i < len; i++) {
                    j = 0;
                    for (var sLen = sCols.length; j < sLen; j++) {
                        if (sCols[j].field === gCols[i]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        sCols.push({ field: gCols[i], direction: 'ascending' });
                    }
                    else {
                        if (this.allowSorting) {
                            this.sortedColumns.push(sCols[j].field);
                        }
                        else {
                            sCols[j].direction = 'ascending';
                        }
                    }
                    if (!this.groupSettings.showGroupedColumn) {
                        this.getColumnByField(gCols[i]).visible = false;
                    }
                }
            }
            this.updateRowTemplateFn();
        };
        Grid.prototype.updateRowTemplateFn = function () {
            if (this.rowTemplate) {
                var e = void 0;
                try {
                    if (document.querySelectorAll(this.rowTemplate).length) {
                        this.rowTemplateFn = ej2_base_1.compile(document.querySelector(this.rowTemplate).innerHTML.trim());
                    }
                }
                catch (e) {
                    this.rowTemplateFn = ej2_base_1.compile(this.rowTemplate);
                }
            }
        };
        Grid.prototype.gridRender = function () {
            this.updateRTL();
            if (this.enableHover) {
                this.element.classList.add('e-gridhover');
            }
            if (ej2_base_1.Browser.isDevice) {
                this.element.classList.add('e-device');
            }
            dom_1.classList(this.element, ['e-responsive', 'e-default'], []);
            var rendererFactory = this.serviceLocator.getService('rendererFactory');
            this.headerModule = rendererFactory.getRenderer(enum_1.RenderType.Header);
            this.contentModule = rendererFactory.getRenderer(enum_1.RenderType.Content);
            this.printModule = new print_1.Print(this, this.scrollModule);
            this.renderModule.render();
            this.eventInitializer();
            this.createGridPopUpElement();
            this.widthService.setWidthToColumns();
            this.updateGridLines();
            this.applyTextWrap();
        };
        Grid.prototype.dataReady = function () {
            this.scrollModule.setWidth();
            this.scrollModule.setHeight();
            if (this.height !== 'auto') {
                this.scrollModule.setPadding();
            }
        };
        Grid.prototype.updateRTL = function () {
            if (this.enableRtl) {
                this.element.classList.add('e-rtl');
            }
            else {
                this.element.classList.remove('e-rtl');
            }
        };
        Grid.prototype.createGridPopUpElement = function () {
            var popup = dom_1.createElement('div', { className: 'e-gridpopup', styles: 'display:none;' });
            var content = dom_1.createElement('div', { className: 'e-content' });
            dom_1.append([content, dom_1.createElement('div', { className: 'e-uptail e-tail' })], popup);
            content.appendChild(dom_1.createElement('span'));
            dom_1.append([content, dom_1.createElement('div', { className: 'e-downtail e-tail' })], popup);
            this.element.appendChild(popup);
        };
        Grid.prototype.updateGridLines = function () {
            dom_1.classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
            switch (this.gridLines) {
                case 'horizontal':
                    this.element.classList.add('e-horizontallines');
                    break;
                case 'vertical':
                    this.element.classList.add('e-verticallines');
                    break;
                case 'none':
                    this.element.classList.add('e-hidelines');
                    break;
                case 'both':
                    this.element.classList.add('e-bothlines');
                    break;
            }
        };
        Grid.prototype.applyTextWrap = function () {
            if (this.allowTextWrap) {
                this.element.classList.add('e-wrap');
            }
        };
        Grid.prototype.removeTextWrap = function () {
            this.element.classList.remove('e-wrap');
        };
        Grid.prototype.wireEvents = function () {
            ej2_base_3.EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
            ej2_base_3.EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
            ej2_base_3.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
            if (this.allowKeyboard) {
                this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
            }
            this.keyBoardModule = new ej2_base_3.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        };
        Grid.prototype.unwireEvents = function () {
            ej2_base_3.EventHandler.remove(this.element, 'click', this.mouseClickHandler);
            ej2_base_3.EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
            ej2_base_3.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        };
        Grid.prototype.addListener = function () {
            if (this.isDestroyed) {
                return;
            }
            this.on(events.dataReady, this.dataReady, this);
        };
        Grid.prototype.removeListener = function () {
            this.off(events.dataReady, this.dataReady);
        };
        Grid.prototype.mouseClickHandler = function (e) {
            if ((util_2.parentsUntil(e.target, 'e-gridpopup') && e.touches) || this.element.querySelectorAll('.e-cloneproperties').length) {
                return;
            }
            if (((!this.allowRowDragAndDrop && util_2.parentsUntil(e.target, 'e-gridcontent')) ||
                (!(this.allowGrouping || this.allowReordering) && util_2.parentsUntil(e.target, 'e-gridheader'))) && e.touches) {
                return;
            }
            if (util_2.parentsUntil(e.target, 'e-gridheader') && this.allowRowDragAndDrop) {
                e.preventDefault();
            }
            this.notify(events.click, e);
        };
        Grid.prototype.focusOutHandler = function (e) {
            if (!util_2.parentsUntil(e.target, 'e-grid')) {
                this.element.querySelector('.e-gridpopup').style.display = 'none';
            }
            var filterClear = this.element.querySelector('.e-cancel:not(.e-hide)');
            if (filterClear) {
                filterClear.classList.add('e-hide');
            }
        };
        Grid.prototype.keyActionHandler = function (e) {
            if (this.allowKeyboard) {
                this.notify(events.keyPressed, e);
            }
        };
        return Grid;
    }(ej2_base_1.Component));
    __decorate([
        ej2_base_2.Property([])
    ], Grid.prototype, "columns", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "enableAltRow", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "enableHover", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "allowKeyboard", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowTextWrap", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowPaging", void 0);
    __decorate([
        ej2_base_2.Complex({}, page_settings_1.PageSettings)
    ], Grid.prototype, "pageSettings", void 0);
    __decorate([
        ej2_base_2.Complex({}, SearchSettings)
    ], Grid.prototype, "searchSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowSorting", void 0);
    __decorate([
        ej2_base_2.Complex({}, SortSettings)
    ], Grid.prototype, "sortSettings", void 0);
    __decorate([
        ej2_base_2.Property(true)
    ], Grid.prototype, "allowSelection", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "selectedRowIndex", void 0);
    __decorate([
        ej2_base_2.Complex({}, SelectionSettings)
    ], Grid.prototype, "selectionSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowFiltering", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowReordering", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowRowDragAndDrop", void 0);
    __decorate([
        ej2_base_2.Complex({}, RowDropSettings)
    ], Grid.prototype, "rowDropSettings", void 0);
    __decorate([
        ej2_base_2.Complex({}, FilterSettings)
    ], Grid.prototype, "filterSettings", void 0);
    __decorate([
        ej2_base_2.Property(false)
    ], Grid.prototype, "allowGrouping", void 0);
    __decorate([
        ej2_base_2.Complex({}, GroupSettings)
    ], Grid.prototype, "groupSettings", void 0);
    __decorate([
        ej2_base_2.Property('auto')
    ], Grid.prototype, "height", void 0);
    __decorate([
        ej2_base_2.Property('auto')
    ], Grid.prototype, "width", void 0);
    __decorate([
        ej2_base_2.Property('default')
    ], Grid.prototype, "gridLines", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "rowTemplate", void 0);
    __decorate([
        ej2_base_2.Property('allpages')
    ], Grid.prototype, "printMode", void 0);
    __decorate([
        ej2_base_2.Property([])
    ], Grid.prototype, "dataSource", void 0);
    __decorate([
        ej2_base_2.Property()
    ], Grid.prototype, "query", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "created", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "destroyed", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "load", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDataBound", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "queryCellInfo", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionBegin", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionComplete", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "actionFailure", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "dataBound", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowSelecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowSelected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDeselecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "rowDeselected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellSelecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellSelected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellDeselecting", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "cellDeselected", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDragStart", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDrag", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "columnDrop", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "printComplete", void 0);
    __decorate([
        ej2_base_2.Event()
    ], Grid.prototype, "beforePrint", void 0);
    Grid = __decorate([
        ej2_base_2.NotifyPropertyChanges
    ], Grid);
    exports.Grid = Grid;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(171), __webpack_require__(19), __webpack_require__(12), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, grid_1, enum_1, util_1, constant_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(grid_1);
    __export(enum_1);
    __export(util_1);
    __export(constant_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(172), __webpack_require__(162), __webpack_require__(174), __webpack_require__(176), __webpack_require__(179)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, common_1, actions_1, models_1, renderer_1, services_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(common_1);
    __export(actions_1);
    __export(models_1);
    __export(renderer_1);
    __export(services_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(60)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, column_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(column_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 175 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageSettings = (function (_super) {
        __extends(PageSettings, _super);
        function PageSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PageSettings;
    }(ej2_base_1.ChildProperty));
    __decorate([
        ej2_base_1.Property(12)
    ], PageSettings.prototype, "pageSize", void 0);
    __decorate([
        ej2_base_1.Property(8)
    ], PageSettings.prototype, "pageCount", void 0);
    __decorate([
        ej2_base_1.Property(1)
    ], PageSettings.prototype, "currentPage", void 0);
    __decorate([
        ej2_base_1.Property()
    ], PageSettings.prototype, "totalRecordsCount", void 0);
    __decorate([
        ej2_base_1.Property(false)
    ], PageSettings.prototype, "enableQueryString", void 0);
    exports.PageSettings = PageSettings;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(87), __webpack_require__(85), __webpack_require__(51), __webpack_require__(24), __webpack_require__(86), __webpack_require__(61), __webpack_require__(89), __webpack_require__(88), __webpack_require__(61), __webpack_require__(62), __webpack_require__(84)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, header_renderer_1, content_renderer_1, row_renderer_1, cell_renderer_1, header_cell_renderer_1, filter_cell_renderer_1, stacked_cell_renderer_1, render_1, filter_cell_renderer_2, indent_cell_renderer_1, caption_cell_renderer_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(header_renderer_1);
    __export(content_renderer_1);
    __export(row_renderer_1);
    __export(cell_renderer_1);
    __export(header_cell_renderer_1);
    __export(filter_cell_renderer_1);
    __export(stacked_cell_renderer_1);
    __export(render_1);
    __export(filter_cell_renderer_2);
    __export(indent_cell_renderer_1);
    __export(caption_cell_renderer_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 177 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(62)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, indent_cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExpandCellRenderer = (function (_super) {
        __extends(ExpandCellRenderer, _super);
        function ExpandCellRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExpandCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            node.className = 'e-recordplusexpand';
            node.setAttribute('ej-mappingname', data.field);
            node.setAttribute('ej-mappingvalue', data.key);
            node.setAttribute('aria-expanded', 'true');
            node.appendChild(dom_1.createElement('div', { className: 'e-icons e-gdiagonaldown e-icon-gdownarrow' }));
            return node;
        };
        return ExpandCellRenderer;
    }(indent_cell_renderer_1.IndentCellRenderer));
    exports.ExpandCellRenderer = ExpandCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 178 */
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
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderIndentCellRenderer = (function (_super) {
        __extends(HeaderIndentCellRenderer, _super);
        function HeaderIndentCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-grouptopleftcell' });
            return _this;
        }
        HeaderIndentCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            node.appendChild(dom_1.createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '&nbsp;' }));
            return node;
        };
        return HeaderIndentCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.HeaderIndentCellRenderer = HeaderIndentCellRenderer;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(90), __webpack_require__(92), __webpack_require__(63), __webpack_require__(91)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, cell_render_factory_1, service_locator_1, row_model_generator_1, group_model_generator_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(cell_render_factory_1);
    __export(service_locator_1);
    __export(row_model_generator_1);
    __export(group_model_generator_1);
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RendererFactory = (function () {
        function RendererFactory() {
            this.rendererMap = {};
        }
        RendererFactory.prototype.addRenderer = function (name, type) {
            var rName = util_1.getEnumValue(enum_1.RenderType, name);
            if (util_1.isNullOrUndefined(this.rendererMap[rName])) {
                this.rendererMap[rName] = type;
            }
        };
        RendererFactory.prototype.getRenderer = function (name) {
            var rName = util_1.getEnumValue(enum_1.RenderType, name);
            if (util_1.isNullOrUndefined(this.rendererMap[rName])) {
                throw "The renderer " + rName + " is not found";
            }
            else {
                return this.rendererMap[rName];
            }
        };
        return RendererFactory;
    }());
    exports.RendererFactory = RendererFactory;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
],[110]);