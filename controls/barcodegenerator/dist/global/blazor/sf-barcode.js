window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Barcode = (function () {
'use strict';

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
/**
 * Barcode used to calculate the barcode, text size and export, print the give barcode - Blazor scripts
 */
var barcode = {
    getBarcodeSize: function (element) {
        var bounds = element.getBoundingClientRect();
        var size = {};
        var width = 'Width';
        var height = 'Height';
        size[width] = bounds.width;
        size[height] = bounds.height;
        return size;
    },
    createHtmlElement: function (elementType, attribute) {
        var element = sf.base.createElement(elementType);
        if (attribute) {
            this.setAttribute(element, attribute);
        }
        return element;
    },
    setAttribute: function (element, attributes) {
        var keys = Object.keys(attributes);
        for (var i = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], attributes[keys[i]]);
        }
    },
    createMeasureElements: function () {
        var measureElement = 'barcodeMeasureElement';
        if (!window[measureElement]) {
            var divElement = this.createHtmlElement('div', {
                id: 'barcodeMeasureElement', class: 'barcodeMeasureElement',
                style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
            });
            var text = this.createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
            divElement.appendChild(text);
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            divElement.appendChild(svg);
            var tSpan = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
            svg.appendChild(tSpan);
            window[measureElement] = divElement;
            window[measureElement].usageCount = 1;
            document.body.appendChild(divElement);
        }
        else {
            window[measureElement].usageCount += 1;
        }
    },
    measureText: function (value, size, fontStyle) {
        var measureElement = 'barcodeMeasureElement';
        window[measureElement].style.visibility = 'visible';
        var svg = window[measureElement].children[1];
        var text = this.getChildNode(svg)[0];
        text.textContent = value;
        text.setAttribute('style', 'font-size:' + size + 'px; font-family:' + fontStyle + ';');
        var bounds = text.getBBox();
        var bBox = {};
        var width = 'Width';
        var height = 'Height';
        bBox[width] = bounds.width;
        bBox[height] = bounds.height;
        window[measureElement].style.visibility = 'hidden';
        return bBox;
    },
    getChildNode: function (node) {
        var child;
        var collection = [];
        if (sf.base.Browser.info.name === 'msie' || sf.base.Browser.info.name === 'edge') {
            for (var i = 0; i < node.childNodes.length; i++) {
                child = node.childNodes[i];
                if (child.nodeType === 1) {
                    collection.push(child);
                }
            }
        }
        else {
            collection = node.children;
        }
        return collection;
    },
    checkOverlapTextPosition: function (value, stringSize, fontStyle, barcodeStartX, barcodeWidth, textStartX, marginRight, options) {
        var textSize = 'stringSize';
        var width = 'Width';
        options = options || {};
        options[textSize] = stringSize;
        var size = this.measureText(value, stringSize, fontStyle);
        var endValue = barcodeStartX + barcodeWidth;
        if ((endValue - (textStartX + size[width]) <= marginRight) && stringSize > 2) {
            options[textSize] -= .2;
            this.checkOverlapTextPosition(value, options[textSize], fontStyle, barcodeStartX, barcodeWidth, textStartX, marginRight, options);
        }
        return options[textSize];
    },
    triggerDownload: function (type, fileName, url) {
        var anchorElement = document.createElement('a');
        anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
        anchorElement.href = url;
        anchorElement.click();
    },
    exportAsImage: function (exportType, fileName, element, isReturnBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var returnValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imageExport(exportType, fileName, element, isReturnBase64)];
                    case 1:
                        returnValue = _a.sent();
                        if (returnValue instanceof Promise) {
                            returnValue.then(function (data) {
                                return data;
                            });
                            return [2 /*return*/, returnValue];
                        }
                        else {
                            return [2 /*return*/, returnValue];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    imageExport: function (type, fileName, element, isReturnBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, promise;
            return __generator(this, function (_a) {
                instance = this;
                promise = new Promise(function (resolve, reject) {
                    var svgData = '<svg xmlns=' + 'http://www.w3.org/2000/svg' + ' xmlns:xlink=' + 'http://www.w3.org/1999/xlink' + '>'
                        + element.children[0].outerHTML + '</svg>';
                    var serializer = 'XMLSerializer';
                    var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] : [new window[serializer]().serializeToString(element)], { type: 'image/svg+xml' }));
                    if (type === 'SVG') {
                        instance.triggerDownload(type, fileName, url);
                        resolve(null);
                    }
                    else {
                        var canvasElement_1 = document.createElement('canvas');
                        canvasElement_1.height = element.clientHeight;
                        canvasElement_1.width = element.clientWidth;
                        var context_1 = canvasElement_1.getContext('2d');
                        var image_1 = new Image();
                        image_1.onload = function () {
                            context_1.drawImage(image_1, 0, 0);
                            window.URL.revokeObjectURL(url);
                            if (!isReturnBase64) {
                                instance.triggerDownload(type, fileName, canvasElement_1.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                                resolve(null);
                            }
                            else {
                                var base64String = (type === 'JPEG') ? canvasElement_1.toDataURL('image/jpeg') :
                                    (type === 'PNG') ? canvasElement_1.toDataURL('image/png') : '';
                                resolve(base64String);
                            }
                        };
                        image_1.src = url;
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    }
};

return barcode;

}());
