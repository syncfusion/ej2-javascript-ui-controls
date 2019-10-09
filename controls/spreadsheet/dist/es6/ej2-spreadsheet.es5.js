import { Base, Browser, ChildProperty, Collection, Complex, Component, Event as Event$1, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, addClass, attributes, closest, detach, enableRipple, extend, formatUnit, getComponent, getDefaultDateObject, getNumberDependable, getNumericObject, getUniqueID, getValue, isNullOrUndefined, isUndefined, merge, remove, removeClass, rippleEffect, setStyleAttribute } from '@syncfusion/ej2-base';
import { DataManager, DataUtil, Deferred, Query } from '@syncfusion/ej2-data';
import { ContextMenu, Header, Item, Menu, MenuItem, Tab, Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { Dialog, calculatePosition, createSpinner, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { AutoComplete, ComboBox, DropDownList } from '@syncfusion/ej2-dropdowns';
import { ListView } from '@syncfusion/ej2-lists';

/**
 * To get range indexes.
 */
function getRangeIndexes(range) {
    var cellindexes;
    var indexes = [];
    range = range.indexOf(':') === -1 ? range + ':' + range : range;
    range.split(':').forEach(function (address) {
        cellindexes = getCellIndexes(address);
        indexes.push(cellindexes[0]);
        indexes.push(cellindexes[1]);
    });
    return indexes;
}
/**
 * To get single cell indexes
 */
function getCellIndexes(address) {
    return [parseInt(address.match(/\d+/)[0], 10) - 1, getColIndex(address.match(/[A-Z]+/i)[0])];
}
/**
 * To get column index from text.
 */
function getColIndex(text) {
    var colIdx = 0;
    text = text.split('').reverse().join('');
    for (var i = text.length - 1; i >= 0; i--) {
        colIdx += (text[i].charCodeAt(0) - 64) * (Math.pow(26, i));
    }
    return colIdx - 1;
}
/**
 * To get cell address from given row and column index.
 */
function getCellAddress(sRow, sCol) {
    return getColumnHeaderText(sCol + 1) + (sRow + 1);
}
/**
 * To get range address from given range indexes.
 */
function getRangeAddress(range) {
    return getCellAddress(range[0], range[1]) + ':' + getCellAddress(range[2], range[3]);
}
/**
 * To get column header cell text
 */
function getColumnHeaderText(colIndex) {
    var alphabet = 'Z';
    if (colIndex / 26 > 1) {
        return getColumnHeaderText((colIndex % 26 === 0) ? (colIndex / 26 - 1) : Math.floor(colIndex / 26))
            + String.fromCharCode((colIndex % 26) === 0 ? alphabet.charCodeAt(0) : 64 + (colIndex % 26));
    }
    else {
        return String.fromCharCode(64 + (colIndex));
    }
}
/**
 * @hidden
 */
function getIndexesFromAddress(address) {
    return getRangeIndexes(getRangeFromAddress(address));
}
/**
 * @hidden
 */
function getRangeFromAddress(address) {
    return address.split('!')[1] || address;
}
/**
 * Given range will be swapped/arranged in increasing order.
 * @hidden
 */
function getSwapRange(range) {
    var clonedRange = range.slice();
    if (range[0] > range[2]) {
        swap(clonedRange, 0, 2);
    }
    if (range[1] > range[3]) {
        swap(clonedRange, 1, 3);
    }
    return clonedRange;
}
/**
 * Interchange values in an array
 */
function swap(range, x, y) {
    var tmp = range[x];
    range[x] = range[y];
    range[y] = tmp;
}
/**
 * @hidden
 */
function isSingleCell(range) {
    return range[0] === range[2] && range[1] === range[3];
}

/**
 * Worker task.
 */
function executeTaskAsync(context, taskFn, callbackFn, data, preventCallback) {
    return new WorkerHelper(context, taskFn, callbackFn, data, preventCallback);
}
/**
 * @hidden
 * The `WorkerHelper` module is used to perform multiple actions using Web Worker asynchronously.
 */
var WorkerHelper = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for WorkerHelper module in Workbook library.
     * @private
     */
    function WorkerHelper(context, task, defaultListener, taskData, preventCallback) {
        this.preventCallback = false;
        this.context = context;
        this.workerTask = task;
        this.defaultListener = defaultListener;
        this.workerData = taskData;
        if (preventCallback) {
            this.preventCallback = true;
        }
        this.initWorker();
    }
    /**
     * To terminate the worker task.
     * @private
     */
    WorkerHelper.prototype.terminate = function () {
        this.worker.terminate();
        URL.revokeObjectURL(this.workerUrl);
    };
    /**
     * To initiate the worker.
     * @private
     */
    WorkerHelper.prototype.initWorker = function () {
        var taskBlob = new Blob([this.getFnCode()], { type: 'text/javascript' });
        this.workerUrl = URL.createObjectURL(taskBlob);
        this.worker = new Worker(this.workerUrl);
        this.worker.onmessage = this.messageFromWorker.bind(this);
        this.worker.onerror = this.onError.bind(this);
        this.worker.postMessage(this.workerData);
    };
    /**
     * Method for getting response from worker.
     * @private
     */
    WorkerHelper.prototype.messageFromWorker = function (args) {
        this.terminate();
        this.defaultListener.apply(this.context, [args.data]);
    };
    /**
     * Method for getting error message from worker if failed.
     * @private
     */
    WorkerHelper.prototype.onError = function (args) {
        this.terminate();
        throw args.message || args;
    };
    /**
     * Construct function code for worker.
     * @private
     */
    WorkerHelper.prototype.getFnCode = function () {
        var workerCode = '';
        var i;
        var keys;
        if (typeof this.workerTask === 'function') {
            workerCode += ('self.workerTask = ' + this.workerTask.toString() + '; \n');
        }
        else {
            if (typeof this.workerTask === 'object') {
                keys = Object.keys(this.workerTask);
                for (i = 0; i < keys.length; i++) {
                    workerCode += ((i === 0 ? 'self.workerTask' : keys[i]) + '=' + this.workerTask[keys[i]].toString() + '; \n');
                }
            }
        }
        workerCode += 'self.onmessage = ' +
            (this.preventCallback ? this.getMessageFn.toString() : this.getCallbackMessageFn.toString()) + '; \n';
        return workerCode;
    };
    /**
     * Get default worker task with callback.
     * @private
     */
    WorkerHelper.prototype.getCallbackMessageFn = function (args) {
        postMessage(this.workerTask.apply(this, args.data));
    };
    /**
     * Get default worker task without callback.
     * @private
     */
    WorkerHelper.prototype.getMessageFn = function (args) {
        this.workerTask.apply(this, args.data);
    };
    return WorkerHelper;
}());

/**
 * Specifies Workbook internal events.
 */
/** @hidden */
var workbookDestroyed = 'workbookDestroyed';
/** @hidden */
var workbookOpen = 'workbookOpen';
/** @hidden */
var beginSave = 'beginSave';
/** @hidden */
var saveCompleted = 'saveCompleted';
/** @hidden */
var applyNumberFormatting = 'applyNumber';
/** @hidden */
var getFormattedCellObject = 'getFormattedCell';
/** @hidden */
var refreshCellElement = 'refreshCellElem';
/** @hidden */
var setCellFormat = 'setCellFormat';
/** @hidden */
var textDecorationUpdate = 'textDecorationUpdate';
/** @hidden */
var applyCellFormat = 'applyCellFormat';
/** @hidden */
var updateUsedRange = 'updateUsedRange';
/** @hidden */
var workbookFormulaOperation = 'workbookFormulaOperation';
/** @hidden */
var workbookEditOperation = 'workbookEditOperation';
/** @hidden */
var checkDateFormat = 'checkDateFormat';
/** @hidden */
var getFormattedBarText = 'getFormattedBarText';
/** @hidden */
var activeCellChanged = 'activeCellChanged';
/** @hidden */
var openSuccess = 'openSuccess';
/** @hidden */
var openFailure = 'openFailure';
/** @hidden */
var sheetCreated = 'sheetCreated';
/** @hidden */
var sheetsDestroyed = 'sheetsDestroyed';
/** @hidden */
var aggregateComputation = 'aggregateComputation';
/** @hidden */
var beforeSort = 'beforeSort';
/** @hidden */
var initiateSort = 'initiateSort';
/** @hidden */
var sortComplete = 'sortComplete';
/** @hidden */
var validateSortRange = 'validateSortRange';

/**
 * @hidden
 */
function toFraction(val) {
    var strVal = val.toString();
    if (val === parseInt(strVal, 10)) {
        return parseInt(strVal, 10) + '  ';
    }
    else {
        var top_1 = strVal.indexOf('.') > -1 ? strVal.split('.')[1] : 0;
        var bottom = Math.pow(10, top_1.toString().replace('-', '').length);
        var abs = Math.abs(getGcd(top_1, bottom));
        return (top_1 / abs) + '/' + (bottom / abs);
    }
}
/**
 * @hidden
 */
function getGcd(a, b) {
    a = Number(a);
    b = Number(b);
    return (b) ? getGcd(b, a % b) : a;
}
/**
 * @hidden
 */
function intToDate(val) {
    val = Number(val);
    val = (val > 0 && val < 1) ? (1 + val) : (val === 0) ? 1 : val;
    if (val > 60) {
        val -= 1; // Due to leap year issue of 1900 in MSExcel.
    }
    return new Date(((val - 1) * (1000 * 3600 * 24)) + new Date('01/01/1900').getTime());
}
/**
 * @hidden
 */
/* tslint:disable no-any */
function dateToInt(val, isTime) {
    var startDate = new Date('01/01/1900');
    var date = isDateTime(val) ? val : new Date(val);
    var timeDiff = (date.getTime() - startDate.getTime());
    var diffDays = (timeDiff / (1000 * 3600 * 24)) + 1;
    return isTime ? diffDays + 1 : parseInt(diffDays.toString(), 10) + 2;
}
/**
 * @hidden
 */
function isDateTime(date) {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.valueOf());
}
/**
 * @hidden
 */
function isNumber(val) {
    return val - parseFloat(val) >= 0;
}
/**
 * @hidden
 */
function toDate(text, intl) {
    var defaultDateFormats = getDefaultDateObject();
    var availabelDateTimeFormat = defaultDateFormats.dateTimeFormats.availableFormats;
    var dObj = { dateObj: null, isCustom: false, type: '' };
    if (typeof text === 'string') {
        text = text.toUpperCase();
    }
    for (var _i = 0, _a = Object.keys(defaultDateFormats.dateFormats); _i < _a.length; _i++) {
        var key = _a[_i];
        dObj.dateObj = intl.parseDate(text, { format: defaultDateFormats.dateFormats[key], skeleton: key });
        if (dObj.dateObj) {
            dObj.type = 'date';
            dObj.isCustom = false;
            break;
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (var _b = 0, _c = Object.keys(availabelDateTimeFormat); _b < _c.length; _b++) {
            var key = _c[_b];
            dObj.dateObj = intl.parseDate(text, { format: availabelDateTimeFormat[key], skeleton: key });
            if (dObj.dateObj) {
                dObj.type = text.toString().indexOf(':') > -1 ? 'time' : 'datetime';
                dObj.isCustom = true;
                break;
            }
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (var _d = 0, _e = Object.keys(defaultDateFormats.timeFormats); _d < _e.length; _d++) {
            var key = _e[_d];
            dObj.dateObj = intl.parseDate(text, { format: defaultDateFormats.timeFormats[key], skeleton: key });
            if (dObj.dateObj) {
                dObj.type = 'time';
                dObj.isCustom = false;
                break;
            }
        }
    }
    if (text !== '#DIV/0!' && !dObj.dateObj && new Date(text).toString() !== 'Invalid Date') {
        dObj.dateObj = new Date(text);
    }
    return dObj;
}

/**
 * Specifies number format.
 */
var WorkbookNumberFormat = /** @__PURE__ @class */ (function () {
    function WorkbookNumberFormat(parent) {
        this.parent = parent;
        this.localeObj = getNumericObject(this.parent.locale);
        /* tslint:disable:no-any */
        this.decimalSep = this.localeObj.decimal;
        this.groupSep = this.localeObj.group;
        this.addEventListener();
    }
    /**
     * @private
     */
    WorkbookNumberFormat.prototype.numberFormatting = function (args) {
        var activeSheetTab = this.parent.activeSheetTab;
        var sheet = this.parent.sheets[activeSheetTab - 1];
        var selectedRange = getRangeIndexes(args.range || sheet.selectedRange);
        var cell;
        for (var i = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (var j = selectedRange[1]; j <= selectedRange[3]; j++) {
                setCell(i, j, sheet, { format: args.format }, true);
                cell = getCell(i, j, sheet, true);
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                this.getFormattedCell({
                    type: getTypeFromFormat(cell.format), value: cell.value,
                    format: cell.format, rowIndex: i, colIndex: j, sheetIndex: activeSheetTab,
                    cell: cell
                });
            }
        }
    };
    /**
     * @hidden
     */
    WorkbookNumberFormat.prototype.getFormattedCell = function (args) {
        var fResult = isNullOrUndefined(args.value) ? '' : args.value;
        var sheet = this.parent.getActiveSheet();
        var range = getRangeIndexes(sheet.activeCell);
        var cell = args.cell ? args.cell : getCell(range[0], range[1], sheet);
        var rightAlign = false;
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        var eventArgs = {
            range: range, format: args.format, requestType: 'numberFormat', value: args.value
        };
        this.parent.trigger('beforeCellFormat', eventArgs);
        if (args.format === '' || args.format === 'General') {
            cell = cell ? cell : {};
            var dateEventArgs = {
                value: args.value, rowIndex: range[0], colIndex: range[1], sheetIndex: this.parent.activeSheetTab,
                updatedVal: args.value, isDate: false, isTime: false
            };
            this.checkDateFormat(dateEventArgs);
            if (dateEventArgs.isDate) {
                rightAlign = true;
                cell.value = args.value = dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('ShortDate');
            }
            else if (dateEventArgs.isTime) {
                rightAlign = true;
                cell.value = args.value = dateEventArgs.updatedVal;
                cell.format = args.format = getFormatFromType('Time');
            }
        }
        args.type = args.format ? getTypeFromFormat(args.format) : 'General';
        var result = this.processFormats(args, fResult, rightAlign, cell);
        if (!args.onLoad) {
            this.parent.notify(refreshCellElement, {
                isRightAlign: result.rightAlign, result: result.fResult || args.value,
                rowIndex: args.rowIndex, colIndex: args.colIndex, sheetIndex: args.sheetIndex,
                type: args.type, curSymbol: currencySymbol, value: args.value || ''
            });
        }
        if (!args.onLoad && (args.rowIndex > sheet.usedRange.rowIndex || args.colIndex > sheet.usedRange.colIndex)) {
            this.parent.setUsedRange(args.rowIndex, args.colIndex);
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
        args.formattedText = result.fResult || args.value;
        args.isRightAlign = result.rightAlign;
        args.curSymbol = currencySymbol;
        return args.formattedText;
    };
    WorkbookNumberFormat.prototype.processFormats = function (args, fResult, isRightAlign, cell) {
        var intl = new Internationalization();
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        var result;
        args.format = args.format ? args.format : 'General';
        if (fResult !== '') {
            switch (args.type) {
                case 'General':
                    result = this.autoDetectGeneralFormat({
                        args: args, currencySymbol: currencySymbol, fResult: fResult, intl: intl,
                        isRightAlign: isRightAlign, curCode: 'USD', cell: cell
                    });
                    fResult = result.fResult;
                    isRightAlign = result.isRightAlign;
                    break;
                case 'Number':
                    if (isNumber(fResult)) {
                        fResult = this.applyNumberFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Currency':
                    if (isNumber(fResult)) {
                        fResult = this.currencyFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Percentage':
                    if (isNumber(fResult)) {
                        fResult = this.percentageFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'Accounting':
                    if (isNumber(fResult)) {
                        fResult = this.accountingFormat(args, intl);
                        isRightAlign = true;
                    }
                    break;
                case 'ShortDate':
                    fResult = this.shortDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'LongDate':
                    fResult = this.longDateFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'Time':
                    fResult = this.timeFormat(args, intl);
                    isRightAlign = fResult ? true : false;
                    break;
                case 'Fraction':
                    if (isNumber(fResult)) {
                        fResult = this.fractionFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case 'Scientific':
                    if (isNumber(fResult)) {
                        fResult = this.scientificFormat(args);
                        isRightAlign = true;
                    }
                    break;
                case 'Text':
                    isRightAlign = false;
                    break;
            }
        }
        return { fResult: fResult, rightAlign: isRightAlign };
    };
    WorkbookNumberFormat.prototype.autoDetectGeneralFormat = function (options) {
        if (isNumber(options.fResult)) {
            if (options.args.format && options.args.format !== '') {
                if (options.args.format.toString().indexOf('%') > -1) {
                    options.fResult = this.percentageFormat(options.args, options.intl);
                }
                else if (options.args.format.toString().indexOf(options.currencySymbol) > -1) {
                    options.fResult = this.currencyFormat(options.args, options.intl);
                }
                else {
                    options.fResult = this.applyNumberFormat(options.args, options.intl);
                }
            }
            if (options.fResult && options.fResult.toString().split(this.decimalSep)[0].length > 11) {
                options.fResult = this.scientificFormat(options.args);
            }
            options.isRightAlign = true;
        }
        if (!isNullOrUndefined(options.fResult)) {
            var res = options.fResult.toString();
            if (res.indexOf('%') > -1 && res.split('%')[0] !== '' && res.split('%')[1].trim() === '' &&
                Number(res.split('%')[0].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split('%')[0].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType('Percentage');
                options.fResult = this.percentageFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                options.isRightAlign = true;
            }
            else if (res.indexOf(options.currencySymbol) > -1 && res.split(options.currencySymbol)[1] !== '' &&
                Number(res.split(options.currencySymbol)[1].split(this.groupSep).join('')).toString() !== 'NaN') {
                options.args.value = Number(res.split(options.currencySymbol)[1].split(this.groupSep).join(''));
                options.cell.format = options.args.format = getFormatFromType('Currency');
                options.fResult = this.currencyFormat(options.args, options.intl);
                options.cell.value = options.args.value.toString();
                options.isRightAlign = true;
            }
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
        return { isRightAlign: options.isRightAlign, fResult: options.fResult };
    };
    WorkbookNumberFormat.prototype.findSuffix = function (zeros, resultSuffix) {
        var len = zeros.length;
        var suffixLen = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    };
    WorkbookNumberFormat.prototype.applyNumberFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Number') : args.format;
        args.format = args.format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        var formatArr = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = !isNullOrUndefined(formatArr[1]) ? formatArr[1].split('*').join(' ') : formatArr[0];
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    };
    WorkbookNumberFormat.prototype.currencyFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Currency') : args.format;
        args.format = args.format.toString().split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        var formatArr = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = isNullOrUndefined(formatArr[1]) ? formatArr[0] : formatArr[1].split('*').join(' ');
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format,
            currency: 'USD'
        });
    };
    WorkbookNumberFormat.prototype.percentageFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    };
    WorkbookNumberFormat.prototype.accountingFormat = function (args, intl) {
        args.format = args.format === '' ? getFormatFromType('Accounting') : args.format;
        args.format = args.format.split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        var currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        var formatArr = args.format.split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = formatArr[1].split('*').join(' ');
        }
        if (Number(args.value) === 0) {
            return currencySymbol + '- ';
        }
        else {
            return intl.formatNumber(Number(args.value), {
                format: args.format,
                currency: 'USD'
            }).split('-').join('');
        }
    };
    WorkbookNumberFormat.prototype.shortDateFormat = function (args, intl) {
        var shortDate = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('ShortDate')
            : args.format.toString();
        var dateObj;
        if (code === getFormatFromType('ShortDate')) {
            code = 'M/d/yy';
            dateObj = {
                type: 'date',
                skeleton: 'yMd'
            };
        }
        else {
            dateObj = {
                type: 'date',
                format: code
            };
        }
        return intl.formatDate(shortDate, dateObj);
    };
    WorkbookNumberFormat.prototype.longDateFormat = function (args, intl) {
        var longDate = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    };
    WorkbookNumberFormat.prototype.timeFormat = function (args, intl) {
        if (!isNullOrUndefined(args.value.toString().split(this.decimalSep)[1])) {
            args.value = parseFloat('1' + this.decimalSep + args.value.split(this.decimalSep)[1]) || args.value;
        }
        var time = intToDate(args.value);
        var code = (args.format === '' || args.format === 'General') ? getFormatFromType('Time')
            : args.format.toString();
        if (code === getFormatFromType('Time')) {
            code = 'h:mm:ss a';
        }
        return intl.formatDate(time, {
            type: 'time',
            skeleton: 'medium',
            format: code
        });
    };
    WorkbookNumberFormat.prototype.scientificFormat = function (args) {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        var zeros = args.format.split('+')[1];
        var prefix = this.findDecimalPlaces(args.format, 'Scientific');
        var fResult = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        }
        else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + +this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    };
    WorkbookNumberFormat.prototype.fractionFormat = function (args) {
        args.format = args.format === '' ? getFormatFromType('Fraction') : args.format;
        var suffix = '';
        var fractionResult;
        if (args.value.toString().indexOf(this.decimalSep) > -1 && isNumber(args.value)) {
            suffix = args.value.toString().split(this.decimalSep)[0];
            fractionResult = toFraction(Number(args.value));
            return (Number(suffix) === 0) ? ' ' + fractionResult : suffix + ' ' + fractionResult;
        }
        return suffix;
    };
    WorkbookNumberFormat.prototype.findDecimalPlaces = function (code, type) {
        switch (type) {
            case 'Scientific':
                var eIndex = code.toUpperCase().indexOf('E');
                var decIndex = code.indexOf(this.decimalSep);
                if (eIndex > -1) {
                    return code.substring(decIndex + 1, eIndex).length;
                }
        }
        return 2;
    };
    WorkbookNumberFormat.prototype.checkDateFormat = function (args) {
        var dateObj;
        var intl = new Internationalization();
        var value = !isNullOrUndefined(args.value) ? args.value.toString() : '';
        var cell = getCell(args.rowIndex, args.colIndex, getSheet(this.parent, (args.sheetIndex || this.parent.activeSheetTab) - 1));
        if (value && value.indexOf('/') > -1 || value.indexOf('-') > -1 || value.indexOf(':') > -1) {
            dateObj = toDate(value, intl);
            if (!isNullOrUndefined(dateObj.dateObj) && dateObj.dateObj.toString() !== 'Invalid Date') {
                cell = cell ? cell : {};
                value = dateToInt(dateObj.dateObj, value.indexOf(':') > -1).toString();
                if (!cell.format || cell.format === '') {
                    if (dateObj.type === 'time') {
                        cell.format = getFormatFromType('Time');
                    }
                    else {
                        cell.format = getFormatFromType('ShortDate');
                    }
                }
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                args.isDate = dateObj.type === 'date' || dateObj.type === 'datetime';
                args.isTime = dateObj.type === 'time';
            }
        }
        args.updatedVal = value;
    };
    WorkbookNumberFormat.prototype.formattedBarText = function (args) {
        var type = getTypeFromFormat(args.cell ? args.cell.format : '');
        var intl = new Internationalization();
        var beforeText = args.value;
        var date = getFormatFromType('ShortDate');
        var time = getFormatFromType('Time');
        switch (type) {
            case 'ShortDate':
            case 'LongDate':
                args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl);
                break;
            case 'Time':
                args.value = this.shortDateFormat({ type: type, value: args.value, format: date }, intl) + ' ' +
                    this.timeFormat({ type: type, value: args.value, format: time }, intl);
                break;
        }
        if (!args.value || (args.value && args.value.toString().indexOf('null') > -1)) {
            args.value = beforeText;
        }
    };
    /**
     * Adding event listener for number format.
     */
    WorkbookNumberFormat.prototype.addEventListener = function () {
        this.parent.on(applyNumberFormatting, this.numberFormatting, this);
        this.parent.on(getFormattedCellObject, this.getFormattedCell, this);
        this.parent.on(checkDateFormat, this.checkDateFormat, this);
        this.parent.on(getFormattedBarText, this.formattedBarText, this);
    };
    /**
     * Removing event listener for number format.
     */
    WorkbookNumberFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyNumberFormatting, this.numberFormatting);
            this.parent.off(getFormattedCellObject, this.getFormattedCell);
            this.parent.off(checkDateFormat, this.checkDateFormat);
            this.parent.off(getFormattedBarText, this.formattedBarText);
        }
    };
    /**
     * To Remove the event listeners.
     */
    WorkbookNumberFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook number format module name.
     */
    WorkbookNumberFormat.prototype.getModuleName = function () {
        return 'workbookNumberFormat';
    };
    return WorkbookNumberFormat;
}());
/**
 * To Get the number built-in format code from the number format type.
 * @param {string} type - Specifies the type of the number formatting.
 */
function getFormatFromType(type) {
    var code = 'General';
    switch (type.split(' ').join('')) {
        case 'Number':
            code = '0.00';
            break;
        case 'Currency':
            code = '$#,##0.00';
            break;
        case 'Accounting':
            code = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            break;
        case 'ShortDate':
            code = 'mm-dd-yyyy';
            break;
        case 'LongDate':
            code = 'dddd, mmmm dd, yyyy';
            break;
        case 'Time':
            code = 'h:mm:ss AM/PM';
            break;
        case 'Percentage':
            code = '0.00%';
            break;
        case 'Fraction':
            code = '# ?/?';
            break;
        case 'Scientific':
            code = '0.00E+00';
            break;
        case 'Text':
            code = '@';
            break;
    }
    return code;
}
/**
 * @hidden
 */
function getTypeFromFormat(format) {
    var code = 'General';
    switch (format) {
        case '0.00':
            code = 'Number';
            break;
        case '$#,##0.00':
        case '$#,##0_);[Red]($#,##0)':
        case '$#,##0.00_);[Red]($#,##0.00)':
        case '$#,##0.00_);($#,##0.00)':
        case '$#,##0_);($#,##0)':
            code = 'Currency';
            break;
        case '_($*#,##0.00_);_($*(#,##0.00);_($*"-"??_);_(@_)':
        case '_($*#,##0.00_);_($* (#,##0.00);_($*"-"??_);_(@_)':
        case '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)':
            code = 'Accounting';
            break;
        case 'mm-dd-yyyy':
        case 'dd-mm-yyyy':
        case 'dd-mm-yy':
        case 'mm-dd-yy':
            code = 'ShortDate';
            break;
        case 'dddd, mmmm dd, yyyy':
            code = 'LongDate';
            break;
        case 'h:mm:ss AM/PM':
            code = 'Time';
            break;
        case '0.00%':
        case '0%':
            code = 'Percentage';
            break;
        case '# ?/?':
        case '# ??/??':
        case '# ???/???':
            code = 'Fraction';
            break;
        case '0.00E+00':
            code = 'Scientific';
            break;
        case '@':
            code = 'Text';
            break;
    }
    return code;
}

/**
 * Data binding module
 */
var DataBind = /** @__PURE__ @class */ (function () {
    function DataBind(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    DataBind.prototype.addEventListener = function () {
        this.parent.on('updateSheetFromDataSource', this.updateSheetFromDataSourceHandler, this);
        this.parent.on('dataSourceChanged', this.dataSourceChangedHandler, this);
    };
    /**
     * Destroys the Data binding module.
     * @return {void}
     */
    DataBind.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    DataBind.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off('updateSheetFromDataSource', this.updateSheetFromDataSourceHandler);
            this.parent.off('dataSourceChanged', this.dataSourceChangedHandler);
        }
    };
    /**
     * Update given data source to sheet.
     */
    DataBind.prototype.updateSheetFromDataSourceHandler = function (args) {
        var _this = this;
        var cell;
        var flds;
        var sCellIdx;
        var result;
        var remoteUrl;
        var isLocal;
        var dataManager;
        var requestedRange = [];
        var sRanges = [];
        var rowIdx;
        var deferred = new Deferred();
        var sRowIdx;
        var sColIdx;
        var loadedInfo;
        args.promise = deferred.promise;
        if (args.sheet && args.sheet.rangeSettings.length) {
            var _loop_1 = function (k) {
                var sRange = args.indexes[0];
                var eRange = args.indexes[2];
                var range = args.sheet.rangeSettings[k];
                sRowIdx = getRangeIndexes(range.startCell)[0];
                dataManager = range.dataSource instanceof DataManager ? range.dataSource
                    : range.dataSource ? new DataManager(range.dataSource) : new DataManager();
                remoteUrl = remoteUrl || dataManager.dataSource.url;
                args.sheet.isLocalData = isLocal || !dataManager.dataSource.url;
                if (sRowIdx <= sRange) {
                    sRange = sRange - sRowIdx;
                }
                else {
                    if (sRowIdx <= eRange) {
                        eRange = eRange - sRowIdx;
                        sRange = 0;
                    }
                    else {
                        sRange = -1;
                    }
                }
                if (range.showFieldAsHeader && sRange !== 0) {
                    sRange -= 1;
                }
                var isEndReached = false;
                this_1.initRangeInfo(range);
                var count = this_1.getMaxCount(range);
                loadedInfo = this_1.getLoadedInfo(sRange, eRange, range);
                sRange = loadedInfo.unloadedRange[0];
                eRange = loadedInfo.unloadedRange[1];
                if (sRange > count) {
                    isEndReached = true;
                }
                else if (eRange > count) {
                    eRange = count;
                }
                if (sRange >= 0 && loadedInfo.isNotLoaded && !isEndReached) {
                    sRanges[k] = sRange;
                    requestedRange.push(false);
                    var query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then(function (e) {
                        if (!_this.parent || _this.parent.isDestroyed) {
                            return;
                        }
                        result = (e.result && e.result.result ? e.result.result : e.result);
                        if (result.length) {
                            range.info.count = e.count;
                            flds = Object.keys(result[0]);
                            range.info.fldLen = flds.length;
                            sCellIdx = getRangeIndexes(range.startCell);
                            sRowIdx = sCellIdx[0];
                            sColIdx = sCellIdx[1];
                            if (sRanges[k] === 0 && range.showFieldAsHeader) {
                                flds.forEach(function (field, i) {
                                    cell = getCell(sRowIdx + sRanges[k], sColIdx + i, args.sheet, true);
                                    if (!cell) {
                                        args.sheet.rows[sRowIdx + sRanges[k]].cells[sColIdx + i] = { value: field };
                                    }
                                    else if (!cell.value) {
                                        cell.value = field;
                                    }
                                });
                            }
                            result.forEach(function (item, i) {
                                for (var j = 0; j < flds.length; j++) {
                                    rowIdx = sRowIdx + sRanges[k] + i + (range.showFieldAsHeader ? 1 : 0);
                                    cell = getCell(rowIdx, sColIdx + j, args.sheet, true);
                                    if (cell) {
                                        if (!cell.value) {
                                            setCell(rowIdx, sColIdx + j, args.sheet, _this.getCellDataFromProp(item[flds[j]]), true);
                                        }
                                    }
                                    else {
                                        args.sheet.rows[rowIdx]
                                            .cells[sColIdx + j] = _this.getCellDataFromProp(item[flds[j]]);
                                    }
                                    _this.checkDataForFormat({
                                        args: args, cell: cell, colIndex: sColIdx + j, rowIndex: rowIdx, i: i, j: j, k: k,
                                        range: range, sRanges: sRanges, value: item[flds[j]]
                                    });
                                }
                            });
                        }
                        args.sheet.usedRange.rowIndex =
                            Math.max(sRowIdx + (count || e.count) + (range.showFieldAsHeader ? 1 : 0), args.sheet.usedRange.rowIndex);
                        args.sheet.usedRange.colIndex = Math.max(sColIdx + flds.length - 1, args.sheet.usedRange.colIndex);
                        range.info.loadedRange.push([sRange, eRange]);
                        requestedRange[k] = true;
                        if (requestedRange.indexOf(false) === -1) {
                            if (remoteUrl) {
                                _this.updateSheetFromDataSourceHandler({
                                    sheet: args.sheet, indexes: [0, 0, args.sheet.usedRange.rowIndex, args.sheet.usedRange.colIndex],
                                    promise: new Promise(function (resolve) { resolve((function () { })()); })
                                });
                            }
                            deferred.resolve();
                        }
                    });
                }
                else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    deferred.resolve();
                }
            };
            var this_1 = this;
            for (var k = args.sheet.rangeSettings.length - 1; k >= 0; k--) {
                _loop_1(k);
            }
        }
        else {
            deferred.resolve();
        }
    };
    DataBind.prototype.getCellDataFromProp = function (prop) {
        var data = {};
        if (Object.prototype.toString.call(prop) === '[object Object]') {
            if (prop.formula) {
                data.formula = prop.formula;
            }
            else if (prop.value) {
                data.value = prop.value;
            }
        }
        else {
            if (checkIsFormula(prop)) {
                data.formula = prop;
            }
            else {
                data.value = prop;
            }
        }
        return data;
    };
    DataBind.prototype.checkDataForFormat = function (args) {
        if (args.value !== '') {
            var dateEventArgs = {
                value: args.value,
                rowIndex: args.rowIndex,
                colIndex: args.colIndex,
                isDate: false,
                updatedVal: args.value,
                isTime: false
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (dateEventArgs.isDate) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('ShortDate');
                    args.cell.value = dateEventArgs.updatedVal;
                }
                else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('ShortDate');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = dateEventArgs.updatedVal;
                }
            }
            else if (dateEventArgs.isTime) {
                if (args.cell) {
                    args.cell.format = getFormatFromType('Time');
                    args.cell.value = dateEventArgs.updatedVal;
                }
                else {
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].format = getFormatFromType('Time');
                    args.args.sheet.rows[args.rowIndex]
                        .cells[args.colIndex].value = dateEventArgs.updatedVal;
                }
            }
        }
    };
    DataBind.prototype.getLoadedInfo = function (sRange, eRange, range) {
        var isNotLoaded = true;
        range.info.loadedRange.forEach(function (range) {
            if (range[0] <= sRange && sRange <= range[1]) {
                if (range[0] <= eRange && eRange <= range[1]) {
                    isNotLoaded = false;
                }
                else {
                    sRange = range[1] + 1;
                }
            }
            else if (range[0] <= eRange && eRange <= range[1]) {
                eRange = range[0] - 1;
            }
        });
        return { isNotLoaded: isNotLoaded, unloadedRange: [sRange, eRange] };
    };
    DataBind.prototype.getMaxCount = function (range) {
        if (range.query) {
            var query = range.query.queries;
            for (var i = 0; i < query.length; i++) {
                if (query[i].fn === 'onTake') {
                    return Math.min(query[i].e.nos, range.info.count || query[i].e.nos);
                }
            }
        }
        return range.info.count;
    };
    DataBind.prototype.initRangeInfo = function (range) {
        if (!range.info) {
            range.info = { loadedRange: [] };
        }
    };
    /**
     * Remove old data from sheet.
     */
    DataBind.prototype.dataSourceChangedHandler = function (args) {
        var oldSheet = args.oldProp.sheets[args.sheetIdx];
        var row;
        var sheet = this.parent.sheets[args.sheetIdx];
        var oldRange = oldSheet && oldSheet.rangeSettings && oldSheet.rangeSettings[args.rangeIdx];
        if (oldRange) {
            var indexes_1 = getRangeIndexes(oldRange.startCell);
            sheet.rangeSettings[args.rangeIdx].info.loadedRange = [];
            oldRange.info.loadedRange.forEach(function (range) {
                for (var i = range[0]; i < range[1]; i++) {
                    row = sheet.rows[i + indexes_1[0]];
                    for (var j = indexes_1[1]; j < indexes_1[1] + oldRange.info.fldLen; j++) {
                        row.cells[j].value = '';
                    }
                }
            });
        }
        this.parent.notify('data-refresh', { sheetIdx: args.sheetIdx });
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    DataBind.prototype.getModuleName = function () {
        return 'dataBind';
    };
    return DataBind;
}());

/**
 * Open properties.
 */
var WorkbookOpen = /** @__PURE__ @class */ (function () {
    function WorkbookOpen(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To open the excel file stream or excel url into the spreadsheet.
     * @param {OpenOptions} options - Options to open a excel file.
     */
    WorkbookOpen.prototype.open = function (options) {
        var _this = this;
        if (!this.parent.allowOpen) {
            return;
        }
        var formData = new FormData();
        if (options.file) {
            formData.append('file', options.file);
        }
        else {
            this.parent.isOpen = false;
            return;
        }
        var eventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: {
                method: 'POST',
                body: formData
            }
        };
        this.parent.trigger('beforeOpen', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        fetch(this.parent.openUrl, eventArgs.requestData)
            .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
            }
        })
            .then(function (data) { return _this.fetchSuccess(data); })
            .catch(function (error) { return _this.fetchFailure(error); });
    };
    WorkbookOpen.prototype.fetchFailure = function (error) {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    };
    WorkbookOpen.prototype.fetchSuccess = function (data) {
        var openError = ['UnsupportedFile', 'InvalidUrl'];
        var workbookData = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* tslint:disable-next-line:no-any */
        var impData = workbookData.Workbook;
        if (openError.indexOf(impData) > -1) {
            this.parent.notify(openSuccess, {
                context: this, data: impData
            });
            return;
        }
        this.updateModel(impData);
        this.parent.notify(openSuccess, this);
        this.parent.isOpen = false;
    };
    WorkbookOpen.prototype.updateModel = function (workbookModel) {
        var _this = this;
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        workbookModel.activeSheetTab = workbookModel.activeSheetTab || 1;
        this.parent.setProperties({
            'sheets': workbookModel.sheets,
            'activeSheetTab': workbookModel.activeSheetTab,
            'definedNames': workbookModel.definedNames || []
        }, true);
        this.parent.notify(sheetCreated, null);
        this.parent.sheets.forEach(function (key) {
            key.id = getMaxSheetId(_this.parent.sheets);
        });
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet' });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
    };
    /**
     * Adding event listener for workbook open.
     */
    WorkbookOpen.prototype.addEventListener = function () {
        this.parent.on(workbookOpen, this.open.bind(this));
    };
    /**
     * Removing event listener workbook open.
     */
    WorkbookOpen.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
        }
    };
    /**
     * To Remove the event listeners
     */
    WorkbookOpen.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook open module name.
     */
    WorkbookOpen.prototype.getModuleName = function () {
        return 'workbookOpen';
    };
    return WorkbookOpen;
}());

/**
 * @hidden
 * The `SaveWorker` module is used to perform save functionality with Web Worker.
 */
var SaveWorker = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for SaveWorker module in Workbook library.
     * @private
     */
    function SaveWorker(parent) {
        this.parent = parent;
    }
    /**
     * Process sheet.
     * @hidden
     */
    SaveWorker.prototype.processSheet = function (sheet, sheetIndex) {
        var parsedSheet = JSON.parse(sheet, function (key, value) {
            //Remove empty properties
            if ((Array.isArray(value) || typeof value === 'string') && !value.length) {
                return undefined;
            }
            return value;
        });
        return [sheetIndex, parsedSheet];
    };
    /**
     * Process save action.
     * @hidden
     */
    SaveWorker.prototype.processSave = function (saveJSON, saveSettings, customParams) {
        var formData = new FormData();
        var i;
        var keys = Object.keys(saveSettings);
        formData.append('JSONData', JSON.stringify(saveJSON));
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], saveSettings[keys[i]]);
        }
        keys = Object.keys(customParams);
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], customParams[keys[i]]);
        }
        fetch(saveSettings.url, { method: 'POST', body: formData })
            .then(function (response) {
            if (response.ok) {
                return response.blob();
            }
            else {
                return Promise.reject({
                    message: response.statusText
                });
            }
        })
            .then(function (data) {
            postMessage(data);
        })
            .catch(function (error) {
            postMessage({ error: error.message });
        });
        // try {
        //     let httpRequest: XMLHttpRequest = new XMLHttpRequest();
        //     let formData: FormData = new FormData();
        //     let i: number;
        //     let keys: string[] = Object.keys(saveSettings);
        //     httpRequest.onreadystatechange = (event: Event) => {
        //         if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        //             (postMessage as Function)(httpRequest.response);
        //         }
        //     };
        //     httpRequest.onerror = (event: Event) => {
        //         (postMessage as Function)(event);
        //     };
        //     formData.append('JSONData', JSON.stringify(saveJSON));
        //     for (i = 0; i < keys.length; i++) {
        //         formData.append(keys[i], (<{ [key: string]: string }>saveSettings)[keys[i]]);
        //     }
        //     httpRequest.open('POST', saveSettings.saveUrl, false);
        //     httpRequest.send(formData);
        // } catch (e) {
        //     (postMessage as Function)({ error: e.message });
        // }
    };
    return SaveWorker;
}());

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
/**
 * @hidden
 * The `WorkbookSave` module is used to handle the save action in Workbook library.
 */
var WorkbookSave = /** @__PURE__ @class */ (function (_super) {
    __extends$4(WorkbookSave, _super);
    /**
     * Constructor for WorkbookSave module in Workbook library.
     * @private
     */
    function WorkbookSave(parent) {
        var _this = _super.call(this, parent) || this;
        _this.isProcessCompleted = false;
        _this.saveJSON = {};
        _this.isFullPost = false;
        _this.needBlobData = false;
        _this.customParams = null;
        _this.addEventListener();
        return _this;
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookSave.prototype.getModuleName = function () {
        return 'workbookSave';
    };
    /**
     * To destroy the WorkbookSave module.
     * @return {void}
     * @hidden
     */
    WorkbookSave.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * @hidden
     */
    WorkbookSave.prototype.addEventListener = function () {
        this.parent.on(beginSave, this.initiateSave, this);
    };
    /**
     * @hidden
     */
    WorkbookSave.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
        }
    };
    /**
     * Initiate save process.
     * @hidden
     */
    WorkbookSave.prototype.initiateSave = function (args) {
        var saveSettings = args.saveSettings;
        this.saveSettings = {
            saveType: saveSettings.saveType,
            url: saveSettings.url,
            fileName: saveSettings.fileName || 'Sample'
        };
        this.isFullPost = args.isFullPost;
        this.needBlobData = args.needBlobData;
        if (this.needBlobData) {
            this.isFullPost = false;
        }
        this.customParams = args.customParams;
        this.updateBasicSettings();
        this.processSheets();
    };
    /**
     * Update save JSON with basic settings.
     * @hidden
     */
    WorkbookSave.prototype.updateBasicSettings = function () {
        var jsonStr = this.getStringifyObject(this.parent, ['sheets', '_isScalar', 'observers', 'closed', 'isStopped', 'hasError',
            '__isAsync', 'beforeCellFormat', 'beforeCellRender', 'beforeDataBound', 'beforeOpen', 'beforeSave', 'beforeSelect',
            'cellEdit', 'cellEditing', 'cellSave', 'contextMenuItemSelect', 'contextMenuBeforeClose', 'contextMenuBeforeOpen', 'created',
            'dataBound', 'fileItemSelect', 'fileMenuBeforeClose', 'fileMenuBeforeOpen', 'openFailure', 'saveComplete', 'select']);
        var basicSettings = JSON.parse(jsonStr);
        var sheetCount = this.parent.sheets.length;
        if (sheetCount) {
            basicSettings.sheets = [];
        }
        this.saveJSON = basicSettings;
    };
    /**
     * Process sheets properties.
     * @hidden
     */
    WorkbookSave.prototype.processSheets = function () {
        var i = 0;
        var sheetCount = this.parent.sheets.length;
        while (i < sheetCount) {
            executeTaskAsync(this, this.processSheet, this.updateSheet, [this.getStringifyObject(this.parent.sheets[i]), i]);
            i++;
        }
    };
    /**
     * Update processed sheet data.
     * @hidden
     */
    WorkbookSave.prototype.updateSheet = function (data) {
        this.saveJSON.sheets[data[0]] = data[1];
        this.isProcessCompleted = this.getSheetLength(this.saveJSON.sheets) === this.parent.sheets.length;
        if (this.isProcessCompleted) {
            this.save(this.saveSettings);
        }
    };
    WorkbookSave.prototype.getSheetLength = function (sheets) {
        var len = 0;
        sheets.forEach(function (sheet) {
            if (sheet) {
                len++;
            }
        });
        return len;
    };
    /**
     * Save process.
     * @hidden
     */
    WorkbookSave.prototype.save = function (saveSettings) {
        if (this.isFullPost) {
            this.initiateFullPostSave();
        }
        else {
            executeTaskAsync(this, { 'workerTask': this.processSave }, this.updateSaveResult, [this.saveJSON, saveSettings, this.customParams], true);
        }
        this.saveJSON = {};
    };
    /**
     * Update final save data.
     * @hidden
     */
    WorkbookSave.prototype.updateSaveResult = function (result) {
        var args = {
            status: 'Success',
            message: '',
            url: this.saveSettings.url,
            fileName: this.saveSettings.fileName,
            saveType: this.saveSettings.saveType,
            blobData: null
        };
        if (typeof (result) === 'object' && result.error) {
            args.status = 'Failure';
            args.message = result.error.toString();
        }
        else {
            if (this.needBlobData) {
                args.blobData = result;
            }
            else {
                this.ClientFileDownload(result, this.saveSettings.fileName);
            }
        }
        this.parent.trigger('saveComplete', args);
        this.parent.notify(saveCompleted, args);
    };
    WorkbookSave.prototype.ClientFileDownload = function (blobData, fileName) {
        var anchor = this.parent.createElement('a', { attrs: { download: this.getFileNameWithExtension() } });
        var url = URL.createObjectURL(blobData);
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    };
    WorkbookSave.prototype.initiateFullPostSave = function () {
        var keys = Object.keys(this.saveSettings);
        var i;
        var formElem = this.parent.createElement('form', { attrs: { method: 'POST', action: this.saveSettings.url } });
        var inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: 'JSONData' } });
        inputElem.value = JSON.stringify(this.saveJSON);
        formElem.appendChild(inputElem);
        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: keys[i] } });
            inputElem.value = this.saveSettings[keys[i]];
            formElem.appendChild(inputElem);
        }
        keys = Object.keys(this.customParams);
        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: keys[i] } });
            inputElem.value = this.customParams[keys[i]];
            formElem.appendChild(inputElem);
        }
        document.body.appendChild(formElem);
        formElem.submit();
        detach(formElem);
        this.parent.notify(saveCompleted, {});
    };
    /**
     * Get stringified workbook object.
     * @hidden
     */
    WorkbookSave.prototype.getStringifyObject = function (value, skipProp) {
        if (skipProp === void 0) { skipProp = []; }
        return JSON.stringify(value, function (key, value) {
            if (skipProp.indexOf(key) > -1) {
                return undefined;
            }
            else {
                if (value && typeof value === 'object' && value.hasOwnProperty('properties')) {
                    return value.properties;
                }
                else if (value !== null) {
                    return value;
                }
                else {
                    return undefined;
                }
            }
        });
    };
    WorkbookSave.prototype.getFileNameWithExtension = function (filename) {
        if (!filename) {
            filename = this.saveSettings.fileName;
        }
        var fileExt = this.getFileExtension();
        var idx = filename.lastIndexOf('.');
        if (idx > -1) {
            filename = filename.substr(0, idx);
        }
        return (filename + fileExt);
    };
    WorkbookSave.prototype.getFileExtension = function () {
        return ('.' + this.saveSettings.saveType.toLowerCase());
    };
    return WorkbookSave;
}(SaveWorker));

/**
 * Represent the common codes for calculate
 */
var CalculateCommon = /** @__PURE__ @class */ (function () {
    function CalculateCommon(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    CalculateCommon.prototype.getModuleName = function () {
        return 'calc-common';
    };
    return CalculateCommon;
}());
/**
 * To check whether the object is undefined.
 * @param {Object} value - To check the object is undefined
 * @return {boolean}
 * @private
 */
function isUndefined$1(value) {
    return ('undefined' === typeof value);
}

/**
 * Represents the getModules function.
 * @param {Calculate} context
 */
function getModules(context) {
    var modules = [];
    if (context.includeBasicFormulas) {
        modules.push({
            member: 'basic-formulas',
            args: [context]
        });
    }
    return modules;
}

/**
 * Module loading operations
 */
var MODULE_SUFFIX = 'Module';
/**
 * To get nameSpace value from the desired object.
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} obj - Object to get the inner object value.
 * @return {any}
 * @private
 */
function getValue$1(nameSpace, obj) {
    /* tslint:disable no-any */
    var value = obj;
    var splits = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    for (var j = 0; j < splits.length && !isUndefined(value); j++) {
        value = value[splits[j]];
    }
    return value;
}
/**
 * To set value for the nameSpace in desired object.
 * @param {string} nameSpace - String value to get the inner object
 * @param {any} value - Value that you need to set.
 * @param {any} obj - Object to get the inner object value.
 * @return {void}
 * @private
 */
function setValue(nameSpace, value, obj) {
    var keyValues = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    var start = obj || {};
    var fromObj = start;
    var j;
    var length = keyValues.length;
    var key;
    for (j = 0; j < length; j++) {
        key = keyValues[j];
        if (j + 1 === length) {
            fromObj[key] = value === undefined ? {} : value;
        }
        else if (isNullOrUndefined(fromObj[key])) {
            fromObj[key] = {};
        }
        fromObj = fromObj[key];
    }
    return start;
}
var ModuleLoader = /** @__PURE__ @class */ (function () {
    function ModuleLoader(parent) {
        this.loadedModules = [];
        this.parent = parent;
    }
    
    /**
     * Inject required modules in component library
     * @hidden
     */
    ModuleLoader.prototype.inject = function (requiredModules, moduleList) {
        var reqLengthVal = requiredModules.length;
        if (reqLengthVal === 0) {
            this.clean();
            return;
        }
        if (this.loadedModules.length) {
            this.clearUnusedModule(requiredModules);
        }
        for (var i = 0; i < reqLengthVal; i++) {
            var modl = requiredModules[i];
            for (var _i = 0, moduleList_1 = moduleList; _i < moduleList_1.length; _i++) {
                var module = moduleList_1[_i];
                var modName = modl.member;
                if (module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
                    var moduleObject = this.createInstance(module, modl.args);
                    var memberName = this.getMemberName(modName);
                    if (modl.isProperty) {
                        setValue(memberName, module, this.parent);
                    }
                    else {
                        setValue(memberName, moduleObject, this.parent);
                    }
                    var loadedModule = modl;
                    loadedModule.member = memberName;
                    this.loadedModules.push(loadedModule);
                }
            }
        }
    };
    /**
     * Create Instance from constructor function with desired parameters.
     * @param {Function} classFunction - Class function to which need to create instance
     * @param {any[]} params - Parameters need to passed while creating instance
     * @return {any}
     * @private
     */
    ModuleLoader.prototype.createInstance = function (classFunction, params) {
        var arrayParam = params;
        arrayParam.unshift(undefined);
        return new (Function.prototype.bind.apply(classFunction, arrayParam));
    };
    /**
     * To remove the created object while control is destroyed
     * @hidden
     */
    ModuleLoader.prototype.clean = function () {
        for (var _i = 0, _a = this.loadedModules; _i < _a.length; _i++) {
            var modules = _a[_i];
            if (!modules.isProperty) {
                getValue$1(modules.member, this.parent).destroy();
            }
        }
        this.loadedModules = [];
    };
    /**
     * Removes all unused modules
     * @param {ModuleDeclaration[]} moduleListName
     * @returns {void}
     */
    ModuleLoader.prototype.clearUnusedModule = function (moduleListName) {
        var _this = this;
        var usedModule = moduleListName.map(function (arg) { return _this.getMemberName(arg.member); });
        var removeModule = this.loadedModules.filter(function (module) {
            return usedModule.indexOf(module.member) === -1;
        });
        for (var _i = 0, removeModule_1 = removeModule; _i < removeModule_1.length; _i++) {
            var moduleName = removeModule_1[_i];
            if (!moduleName.isProperty) {
                getValue$1(moduleName.member, this.parent).destroy();
            }
            this.loadedModules.splice(this.loadedModules.indexOf(moduleName), 1);
            this.deleteObject(this.parent, moduleName.member);
        }
    };
    /**
     * To get the name of the member.
     * @param {string} name
     * @returns {string}
     */
    ModuleLoader.prototype.getMemberName = function (name) {
        return name[0].toLowerCase() + name.substring(1) + MODULE_SUFFIX;
    };
    /**
     * Delete an item from Object
     * @param {any} obj - Object in which we need to delete an item.
     * @param {string} params - String value to the get the inner object
     * @return {void}
     * @private
     */
    ModuleLoader.prototype.deleteObject = function (obj, key) {
        delete obj[key];
    };
    /**
     * Returns boolean based on whether the module specified is loaded or not
     * @param {string} modName
     * @returns {boolean}
     */
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

/**
 * @hidden
 */
var CommonErrors;
(function (CommonErrors) {
    CommonErrors[CommonErrors["na"] = 0] = "na";
    CommonErrors[CommonErrors["value"] = 1] = "value";
    CommonErrors[CommonErrors["ref"] = 2] = "ref";
    CommonErrors[CommonErrors["divzero"] = 3] = "divzero";
    CommonErrors[CommonErrors["num"] = 4] = "num";
    CommonErrors[CommonErrors["name"] = 5] = "name";
    CommonErrors[CommonErrors["null"] = 6] = "null";
})(CommonErrors || (CommonErrors = {}));
/**
 * @hidden
 */
var FormulasErrorsStrings;
(function (FormulasErrorsStrings) {
    FormulasErrorsStrings[FormulasErrorsStrings["operators_cannot_start_with_expression"] = 0] = "operators_cannot_start_with_expression";
    FormulasErrorsStrings[FormulasErrorsStrings["reservedWord_And"] = 1] = "reservedWord_And";
    FormulasErrorsStrings[FormulasErrorsStrings["reservedWord_Xor"] = 2] = "reservedWord_Xor";
    FormulasErrorsStrings[FormulasErrorsStrings["reservedWord_If"] = 3] = "reservedWord_If";
    FormulasErrorsStrings[FormulasErrorsStrings["number_contains_2_decimal_points"] = 4] = "number_contains_2_decimal_points";
    FormulasErrorsStrings[FormulasErrorsStrings["reservedWord_Else"] = 5] = "reservedWord_Else";
    FormulasErrorsStrings[FormulasErrorsStrings["reservedWord_Not"] = 6] = "reservedWord_Not";
    FormulasErrorsStrings[FormulasErrorsStrings["invalid_char_in_number"] = 7] = "invalid_char_in_number";
    FormulasErrorsStrings[FormulasErrorsStrings["invalid_characters_following_with_operator"] = 6] = "invalid_characters_following_with_operator";
    FormulasErrorsStrings[FormulasErrorsStrings["mismatched_parentheses"] = 8] = "mismatched_parentheses";
    FormulasErrorsStrings[FormulasErrorsStrings["unknown_formula_name"] = 9] = "unknown_formula_name";
    FormulasErrorsStrings[FormulasErrorsStrings["requires_a_single_argument"] = 10] = "requires_a_single_argument";
    FormulasErrorsStrings[FormulasErrorsStrings["requires_3_args"] = 11] = "requires_3_args";
    FormulasErrorsStrings[FormulasErrorsStrings["invalid_Math_argument"] = 12] = "invalid_Math_argument";
    FormulasErrorsStrings[FormulasErrorsStrings["requires_2_args"] = 13] = "requires_2_args";
    FormulasErrorsStrings[FormulasErrorsStrings["bad_index"] = 14] = "bad_index";
    FormulasErrorsStrings[FormulasErrorsStrings["too_complex"] = 15] = "too_complex";
    FormulasErrorsStrings[FormulasErrorsStrings["circular_reference"] = 16] = "circular_reference";
    FormulasErrorsStrings[FormulasErrorsStrings["missing_formula"] = 17] = "missing_formula";
    FormulasErrorsStrings[FormulasErrorsStrings["improper_formula"] = 18] = "improper_formula";
    FormulasErrorsStrings[FormulasErrorsStrings["invalid_expression"] = 19] = "invalid_expression";
    FormulasErrorsStrings[FormulasErrorsStrings["cell_empty"] = 20] = "cell_empty";
    FormulasErrorsStrings[FormulasErrorsStrings["bad_formula"] = 21] = "bad_formula";
    FormulasErrorsStrings[FormulasErrorsStrings["empty_expression"] = 22] = "empty_expression";
    FormulasErrorsStrings[FormulasErrorsStrings["virtual_mode_required"] = 23] = "virtual_mode_required";
    FormulasErrorsStrings[FormulasErrorsStrings["mismatched_tics"] = 24] = "mismatched_tics";
    FormulasErrorsStrings[FormulasErrorsStrings["wrong_number_arguments"] = 25] = "wrong_number_arguments";
    FormulasErrorsStrings[FormulasErrorsStrings["invalid_arguments"] = 26] = "invalid_arguments";
    FormulasErrorsStrings[FormulasErrorsStrings["iterations_do_not_converge"] = 27] = "iterations_do_not_converge";
    FormulasErrorsStrings[FormulasErrorsStrings["calculation_overflow"] = 29] = "calculation_overflow";
    FormulasErrorsStrings[FormulasErrorsStrings["already_registered"] = 28] = "already_registered";
    FormulasErrorsStrings[FormulasErrorsStrings["missing_sheet"] = 30] = "missing_sheet";
    FormulasErrorsStrings[FormulasErrorsStrings["cannot_parse"] = 31] = "cannot_parse";
    FormulasErrorsStrings[FormulasErrorsStrings["expression_cannot_end_with_an_operator"] = 32] = "expression_cannot_end_with_an_operator";
})(FormulasErrorsStrings || (FormulasErrorsStrings = {}));

/**
 * Export Common modules for Calculate.
 */

/**
 * Represents the basic formulas module.
 */
var BasicFormulas = /** @__PURE__ @class */ (function () {
    function BasicFormulas(parent) {
        this.formulas = [
            { formulaName: 'SUM', category: 'Math & Trig', description: 'Sums individual values, cell references or ranges.' },
            {
                formulaName: 'SUMIFS', category: 'Math & Trig',
                description: 'Sums the cells specified by a given set of conditionsor criteria.'
            },
            { formulaName: 'ABS', category: 'Math & Trig', description: 'Returns the absolute value of a number.' },
            { formulaName: 'RAND', category: 'Math & Trig', description: 'Return a random number between 0 and 1.' },
            { formulaName: 'FLOOR', category: 'Math & Trig', description: 'Returns the round a number down to the nearest integer.' },
            { formulaName: 'CEILING', category: 'Math & Trig', description: 'Returns a number rounded up to a multiple of another number.' },
            {
                formulaName: 'SUMIF', category: 'Math & Trig',
                description: 'It will sum up cells that meet the given criteria.'
            },
            {
                formulaName: 'PRODUCT', category: 'Math & Trig',
                description: 'Multiplies all the numbers given as arguments and returns the product.'
            },
            {
                formulaName: 'AVERAGE', category: 'Statistical',
                description: 'The sum of the numbers divided by how many numbers are being averaged.'
            },
            {
                formulaName: 'AVERAGEIF', category: 'Statistical',
                description: 'Computes the average of the numbers in a range that meet the supplied criteria.'
            },
            {
                formulaName: 'COUNT', category: 'Statistical',
                description: 'Counts the numbers in the list of arguments, exclude text entries.'
            },
            { formulaName: 'COUNTA', category: 'Statistical', description: 'Counts the non-empty values in the list of arguments.' },
            {
                formulaName: 'COUNTIF', category: 'Statistical',
                description: 'Counts the number of cells in a range that meet a specified condition.'
            },
            {
                formulaName: 'COUNTIFS', category: 'Statistical',
                description: 'Counts the number of times each cells in all the ranges that meet the specific conditions.'
            },
            {
                formulaName: 'AVERAGEA', category: 'Statistical',
                description: 'Calculates the average of values in the list of arguments.Arguments can be numbers, names, arrays or references.'
            },
            {
                formulaName: 'AVERAGEIFS', category: 'Statistical',
                description: 'Conditionally returns the average of the contents of cells for the set of ranges.'
            },
            {
                formulaName: 'MIN', category: 'Statistical',
                description: 'Returns the smaller number in set of arguments.'
            },
            { formulaName: 'MAX', category: 'Statistical', description: 'Returns the largest number in set of arguments.' },
            { formulaName: 'DATE', category: 'Date', description: 'Returns the date, given the year, month and day of the month.' },
            { formulaName: 'DAY', category: 'Date', description: 'Returns the day of a given date.' },
            { formulaName: 'DAYS', category: 'Date', description: 'Returns the number of days between two dates.' },
            {
                formulaName: 'IF', category: 'Logical',
                description: 'Returns one value if a logical expression is TRUE and another if it is FALSE'
            },
            {
                formulaName: 'AND', category: 'Logical',
                description: 'Returns TRUE if all the arguments are considered TRUE, and FALSE otherwise.'
            },
            {
                formulaName: 'IFS', category: 'Logical',
                description: 'Checks multiple conditions and returns a value corresponding to the first TRUE result.'
            },
            {
                formulaName: 'IFERROR', category: 'Logical',
                description: 'Returns a value you specify if a formula evaluates to an error; otherwise, it returns the result of the formula.'
            },
            {
                formulaName: 'CHOOSE', category: 'Lookup & Reference',
                description: 'Returns a value from a list, given an index number.'
            },
            {
                formulaName: 'INDEX', category: 'Lookup & Reference',
                description: 'Returns a value from a table, given a row and column number.'
            },
            { formulaName: 'FIND', category: 'Text', description: 'Returns the position of a string of text within another string.' },
            { formulaName: 'CONCATENATE', category: 'Text', description: ' Used to join two or more strings together.' },
            { formulaName: 'CONCAT', category: 'Text', description: 'Concatenates a list or range of text strings.' },
            { formulaName: 'SUBTOTAL', category: 'Lookup & Reference', description: 'Returns a subtotal in a list or database.' },
            { formulaName: 'RADIANS', category: 'Math & Trig', description: 'Converts degrees to radians.' },
            {
                formulaName: 'OR', category: 'Logical',
                description: 'Returns TRUE if any arguments considered TRUE, and all the arguments are FALSE it will return FALSE.'
            },
            {
                formulaName: 'MATCH', category: 'Lookup & Reference',
                description: 'Returns the relative position of an checked item in range that matches a specified value in a specified order'
            },
            {
                formulaName: 'RANDBETWEEN', category: 'Math & Trig', description: 'Returns an integer random number in a specified range.'
            }
        ];
        this.isConcat = false;
        this.parent = parent;
        this.init();
    }
    BasicFormulas.prototype.init = function () {
        var fn;
        for (var i = 0; i < this.formulas.length; i++) {
            fn = getValue('Compute' + this.formulas[i].formulaName, this).bind(this);
            this.addFormulaCollection(this.formulas[i].formulaName.toUpperCase(), fn, this.formulas[i].category, this.formulas[i].description);
        }
    };
    BasicFormulas.prototype.addFormulaCollection = function (formulaName, functionName, formulaCategory, description) {
        this.parent.libraryFormulas = {
            fName: formulaName, handler: functionName, category: formulaCategory,
            description: description
        };
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeSUM = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var sum = 0;
        var val;
        var orgValue;
        if (!isNullOrUndefined(args)) {
            var argArr = args;
            for (var i = 0; i < argArr.length; i++) {
                var argValue = argArr[i].toString();
                if (argValue.indexOf(':') > -1 && this.parent.isCellReference(argValue)) {
                    var cellCollection = this.parent.getCellCollection(argValue.split(this.parent.tic).join(''));
                    for (var j = 0; j < cellCollection.length; j++) {
                        val = this.parent.getValueFromArg(cellCollection[j]);
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        if (isNullOrUndefined(val[0]) || isNaN(this.parent.parseFloat(val))) {
                            continue;
                        }
                        sum = sum + this.parent.parseFloat(val);
                    }
                }
                else {
                    if (argArr[i].split(this.parent.tic).join('') === this.parent.trueValue) {
                        argArr[i] = '1';
                    }
                    if (argArr[i].split(this.parent.tic).join('') === this.parent.falseValue) {
                        argArr[i] = '0';
                    }
                    orgValue = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    if (isNullOrUndefined(orgValue) || isNaN(this.parent.parseFloat(orgValue))) {
                        continue;
                    }
                    if (orgValue.length > 0) {
                        sum = sum + this.parent.parseFloat(orgValue + '');
                    }
                }
            }
        }
        return sum;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCOUNT = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = args;
        var argVal;
        var cellColl;
        var result = 0;
        var cellValue;
        for (var i = 0; i < argArr.length; i++) {
            argVal = argArr[i];
            if (argVal.indexOf(':') > -1 && this.parent.isCellReference(argVal)) {
                cellColl = this.parent.getCellCollection(argVal.split(this.parent.tic).join(''));
                for (var j = 0; j < cellColl.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellColl[j]);
                    if (!isNaN(this.parent.parseFloat(cellValue))) {
                        if (argVal.length > 0 && argVal !== '' && argVal !== ' ') {
                            result++;
                        }
                    }
                }
            }
            else {
                argVal = argVal.split(this.parent.tic).join('');
                if (!isNaN(this.parent.parseFloat(this.parent.getValueFromArg(argVal)))) {
                    if (argVal.length > 0 && argVal !== '' && argVal !== ' ') {
                        result++;
                    }
                }
            }
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeDATE = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = args;
        if (argArr.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var i = 0; i < argArr.length; ++i) {
            argArr[i] = this.parent.getValueFromArg(argArr[i]);
        }
        /* tslint:disable */
        argArr[0] = (argArr[0].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[0].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[0];
        argArr[1] = (argArr[1].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[1].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[1];
        argArr[2] = (argArr[2].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[2].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[2];
        /* tslint:enable */
        var year = this.parent.parseFloat(argArr[0].split(this.parent.tic).join(''));
        var month = this.parent.parseFloat(argArr[1].split(this.parent.tic).join(''));
        var day = this.parent.parseFloat(argArr[2].split(this.parent.tic).join(''));
        var days = 0;
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            if (year < 0) {
                return this.parent.getErrorStrings()[CommonErrors.num].toString();
            }
            while (month > 12) {
                month -= 12;
                year++;
            }
            days = this.parent.getSerialDateFromDate(year, month, day);
        }
        else {
            return this.parent.getErrorStrings()[CommonErrors.value].toString();
        }
        if (days === 0) {
            return this.parent.getErrorStrings()[CommonErrors.num].toString();
        }
        var date = this.parent.fromOADate(days);
        if (date.toString() !== 'Invalid Date') {
            /* tslint:disable-next-line */
            return date.getFullYear() + '/' + this.parent.calculateDate((date.getMonth() + 1).toString()) + '/' + this.parent.calculateDate(date.getDate().toString());
        }
        return days.toString();
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeFLOOR = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var argArr = args;
        var argCount = argArr.length;
        var splitArg = argArr[1].split(this.parent.tic).join('');
        var argValue = [];
        var fnum;
        var significance;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        argValue.push(fnum = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''))));
        argArr[1] = (splitArg === this.parent.trueValue) ? '1' : (splitArg === this.parent.falseValue) ? '0' : argArr[1];
        argValue.push(significance = this.parent.parseFloat(this.parent.getValueFromArg(argArr[1].split(this.parent.tic).join(''))));
        if (fnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        if (fnum > 0 && significance === 0) {
            return this.parent.getErrorStrings()[CommonErrors.divzero];
        }
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        if (isNaN(fnum)) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        return Math.floor(fnum / significance) * significance;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCEILING = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var argArr = args;
        var orgValue = [];
        var argCount = argArr.length;
        var splitArg = argArr[1].split(this.parent.tic).join('');
        var cnum;
        var significance;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        orgValue.push(cnum = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''))));
        argArr[1] = (splitArg === this.parent.trueValue) ? '1' : (splitArg === this.parent.falseValue) ? '0' : argArr[1];
        orgValue.push(significance = this.parent.parseFloat(this.parent.getValueFromArg(argArr[1].split(this.parent.tic).join(''))));
        if (cnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        if (isNaN(cnum)) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        if (significance === 0) {
            return 0;
        }
        return Math.ceil(cnum / significance) * significance;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeDAY = function () {
        var serialNumber = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            serialNumber[_i] = arguments[_i];
        }
        var date = serialNumber;
        var result;
        if (isNullOrUndefined(date) || (date.length === 1 && date[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (date.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var dateVal = this.parent.getValueFromArg(date[0].split(this.parent.tic).join(''));
        if (!isNaN(this.parent.parseFloat(dateVal))) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        else {
            dateVal = dateVal;
        }
        result = this.parent.parseDate(dateVal);
        if (Object.prototype.toString.call(result) === '[object Date]') {
            /* tslint:disable-next-line */
            result = result.getDate();
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeIF = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (this.parent.getErrorStrings().indexOf(args[0]) > 0) {
            return args[0];
        }
        var argArr = args;
        var condition;
        var result;
        if (argArr.length > 3 || argArr.length === 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        else if (argArr.length <= 3) {
            condition = this.parent.getValueFromArg(argArr[0]);
            if (this.parent.getErrorStrings().indexOf(condition) > -1) {
                return condition;
            }
            if (condition === this.parent.trueValue || this.parent.parseFloat(condition) > 0 || this.parent.parseFloat(condition) < 0) {
                result = this.parent.getValueFromArg(argArr[1]);
            }
            else if (condition === this.parent.falseValue || this.parent.parseFloat(condition) === 0) {
                if (isNullOrUndefined(argArr[2])) {
                    return this.parent.falseValue;
                }
                result = this.parent.getValueFromArg(argArr[2]);
            }
            else {
                return this.parent.formulaErrorStrings[FormulasErrorsStrings.requires_3_args];
            }
        }
        if (result.indexOf(this.parent.tic) > -1) {
            return result.split(this.parent.tic).join('');
        }
        else {
            return result;
        }
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeIFERROR = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var argArr = args;
        var condition;
        if (argArr.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        condition = this.parent.getValueFromArg(argArr[0]);
        if (condition === this.parent.trueValue || condition === this.parent.falseValue) {
            return condition;
        }
        if (condition[0] === this.parent.arithMarker) {
            condition = condition.replace(this.parent.arithMarker, ' ');
        }
        condition = this.parent.getValueFromArg(condition).toUpperCase().split(this.parent.tic).join('');
        if (condition[0] === '#' || condition.indexOf('Infinity') > -1 || this.parent.getErrorStrings().indexOf(condition) > -1) {
            return this.parent.getValueFromArg(argArr[1]).split(this.parent.tic).join('');
        }
        else {
            return condition;
        }
    };
    /** @hidden */
    BasicFormulas.prototype.ComputePRODUCT = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var product = 1;
        var val;
        var orgValue;
        var countNum = 0;
        if (!isNullOrUndefined(range)) {
            var argArr = range;
            for (var i = 0; i < argArr.length; i++) {
                var rangevalue = argArr[i];
                if (rangevalue.indexOf(':') > -1 && this.parent.isCellReference(rangevalue)) {
                    countNum = 0;
                    var cellCollection = this.parent.getCellCollection(rangevalue);
                    for (var j = 0; j < cellCollection.length; j++) {
                        val = this.parent.getValueFromArg(cellCollection[j].split(this.parent.tic).join(''));
                        if (this.parent.getErrorStrings().indexOf(val) > -1) {
                            return val;
                        }
                        /* tslint:disable-next-line */
                        val = (val.split(this.parent.tic).join('') === 'TRUE') ? '1' : (val.split(this.parent.tic).join('') === 'FALSE') ? '0' : val;
                        if (isNullOrUndefined(val) || isNaN(this.parent.parseFloat(val))) {
                            countNum = countNum + 1;
                            if (countNum === cellCollection.length) {
                                product = 0;
                            }
                            continue;
                        }
                        product = product * this.parent.parseFloat(val);
                    }
                }
                else {
                    orgValue = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    /* tslint:disable-next-line */
                    orgValue = (orgValue.split(this.parent.tic).join('') === 'TRUE') ? '1' : (orgValue.split(this.parent.tic).join('') === 'FALSE') ? '0' : orgValue;
                    if (isNullOrUndefined(orgValue) || isNaN(this.parent.parseFloat(orgValue))) {
                        countNum = countNum + 1;
                        if (countNum === argArr.length) {
                            product = 0;
                        }
                        continue;
                    }
                    if (this.parent.getErrorStrings().indexOf(orgValue) > -1) {
                        return orgValue;
                    }
                    if (orgValue.length > 0) {
                        product = product * this.parent.parseFloat(orgValue + '');
                    }
                }
            }
        }
        return product.toString();
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeDAYS = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var result;
        if (isNullOrUndefined(range) && (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (range.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argsArr = range;
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.trueValue) {
            argsArr[0] = '1';
        }
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.falseValue) {
            argsArr[0] = '0';
        }
        var endDate = this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join(''));
        var startDate = this.parent.getValueFromArg(argsArr[1].split(this.parent.tic).join(''));
        startDate = (startDate === '' || startDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : startDate;
        endDate = (endDate === '' || endDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : endDate;
        if (endDate[0] === '#') {
            return endDate;
        }
        if (startDate[0] === '#') {
            return startDate;
        }
        var d1 = this.parent.parseDate(endDate);
        var d2 = this.parent.parseDate(startDate);
        if (d1.toString()[0] === '#') {
            return d1.toString();
        }
        if (d2.toString()[0] === '#') {
            return d2.toString();
        }
        if (Object.prototype.toString.call(d1) === '[object Date]' && Object.prototype.toString.call(d2) === '[object Date]') {
            /* tslint:disable-next-line */
            result = Math.ceil(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
        }
        else {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        return Math.round(result);
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCHOOSE = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argsArr = args;
        if (argsArr[0].indexOf(':') > -1 && this.parent.isCellReference(argsArr[0])) {
            var cellCollection = this.parent.getCellCollection(argsArr[0]);
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            }
            else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        var cond = this.parent.getValueFromArg(argsArr[0]);
        if (this.parent.getErrorStrings().indexOf(cond) > -1) {
            return cond;
        }
        var indexNum = this.parent.parseFloat(this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join('')));
        if (indexNum < 1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        indexNum = Math.floor(indexNum);
        var result;
        if (isNullOrUndefined(argsArr[indexNum])) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        result = argsArr[indexNum];
        if (result === '') {
            result = '0';
        }
        if (result.indexOf(':') > -1 && this.parent.isCellReference(result)) {
            var cellCollection = this.parent.getCellCollection(argsArr[0].split(this.parent.tic).join(''));
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            }
            else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        return this.parent.getValueFromArg(result).split(this.parent.tic).join('');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeSUMIF = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        var result = this.parent.computeSumIfAndAvgIf(range);
        if (typeof result === 'string' && (this.parent.formulaErrorStrings.indexOf(result)
            || this.parent.getErrorStrings().indexOf(result))) {
            return result;
        }
        return result[0];
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeABS = function () {
        var absValue = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            absValue[_i] = arguments[_i];
        }
        var argArr = absValue;
        var cellvalue = '';
        var absVal;
        if (absValue.length === 0 || absValue.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argArr[0].toString().split(this.parent.tic).join('').trim() === '' || argArr[0].indexOf(this.parent.tic) > -1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        if (this.parent.isCellReference(argArr[0])) {
            cellvalue = this.parent.getValueFromArg(argArr[0]);
            if (cellvalue === '') {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
            absVal = this.parent.parseFloat(cellvalue);
            if (isNaN(absVal)) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        else {
            absVal = this.parent.parseFloat(argArr[0]);
            if (isNaN(absVal)) {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
        }
        return Math.abs(absVal);
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeAVERAGE = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var argArr = args;
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1) {
                if (argArr[i].indexOf(this.parent.tic) > -1) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
        }
        return this.parent.calculateAvg(argArr);
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeAVERAGEIF = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argList = range;
        if (argList[0].indexOf(':') < 0 && !this.parent.isCellReference(argList[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        var resultVal = this.parent.computeSumIfAndAvgIf(range);
        if (typeof resultVal === 'string' && (this.parent.formulaErrorStrings.indexOf(resultVal)
            || this.parent.getErrorStrings().indexOf(resultVal))) {
            return resultVal;
        }
        return this.parent.parseFloat(resultVal[0]) / this.parent.parseFloat(resultVal[1]);
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCONCATENATE = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        var argsList = range;
        var result = '';
        var tempStr = '';
        for (var i = 0; i < argsList.length; i++) {
            if (argsList[i].indexOf(':') > -1 && this.parent.isCellReference(argsList[i])) {
                if (this.isConcat) {
                    var cells = this.parent.getCellCollection(argsList[i]);
                    for (var i_1 = 0; i_1 < cells.length; i_1++) {
                        tempStr = this.parent.getValueFromArg(cells[i_1]);
                        result = result + tempStr;
                    }
                }
                else {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
            else {
                if (argsList.length === 1 && argsList[0].indexOf(this.parent.tic) < 0) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                }
                else {
                    tempStr = this.parent.getValueFromArg(argsList[i]);
                    result = result + tempStr;
                }
            }
            if (this.parent.getErrorStrings().indexOf(tempStr) > -1) {
                return tempStr;
            }
        }
        return result.split(this.parent.tic).join('');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCONCAT = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        this.isConcat = true;
        return this.ComputeCONCATENATE.apply(this, range);
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeMAX = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.parent.computeMinMax(args, 'max');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeMIN = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.parent.computeMinMax(args, 'min');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeRAND = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1 && args[0] === '') {
            args.length = 0;
        }
        if (args.length > 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        return Math.random().toString();
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeAND = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.parent.computeAndOr(args, 'and');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeOR = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.parent.computeAndOr(args, 'or');
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeFIND = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argsList = args;
        if (argsList.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var findText = this.parent.removeTics(this.parent.getValueFromArg(argsList[0]));
        var withinText = this.parent.removeTics(this.parent.getValueFromArg(argsList[1]));
        if (this.parent.getErrorStrings().indexOf(findText) > -1 || this.parent.getErrorStrings().indexOf(withinText) > -1) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        var startNum = 1;
        var loc;
        if (argsList.length === 3) {
            startNum = this.parent.removeTics(this.parent.getValueFromArg(argsList[2]));
            if (this.parent.getErrorStrings().indexOf(startNum) > -1) {
                return startNum;
            }
            startNum = this.parent.parseFloat(startNum);
            if (isNaN(startNum)) {
                startNum = 1;
            }
        }
        if (startNum <= 0 || startNum > withinText.length) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        loc = withinText.indexOf(findText, startNum - 1);
        if (loc < 0) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        return (Number(loc) + Number(1)).toString();
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeINDEX = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        var argCount = argArr.length;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argCount > 3) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        var rangeValue = '';
        var rangeArr = [];
        if (argCount > 2) {
            for (var i_2 = 0; i_2 < argCount; i_2++) {
                if (this.parent.isCellReference(argArr[i_2]) && argArr[i_2].indexOf(':') < 0) {
                    return this.parent.getErrorStrings()[CommonErrors.ref];
                }
                if (this.parent.isCellReference(argArr[i_2])) {
                    rangeArr[i_2] = argArr[i_2];
                }
            }
        }
        rangeValue = argArr[0];
        argArr[1] = argArr[1] === '' ? '1' : argArr[1];
        argArr[1] = this.parent.getValueFromArg(argArr[1]);
        if (this.parent.getErrorStrings().indexOf(argArr[1]) > -1) {
            return argArr[1];
        }
        if (!isNullOrUndefined(argArr[2])) {
            argArr[2] = argArr[2] === '' ? '1' : argArr[2];
            argArr[2] = this.parent.getValueFromArg(argArr[2]);
            if (this.parent.getErrorStrings().indexOf(argArr[2]) > -1) {
                return argArr[2];
            }
            if (argArr[2] === '0') {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        var row = parseFloat(argArr[1]);
        row = !isNaN(row) ? row : -1;
        var col = parseFloat(argArr[2] ? argArr[2] : '1');
        col = !isNaN(col) ? col : -1;
        if (row === -1 || col === -1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        var i = argArr[0].indexOf(':');
        var startRow = this.parent.rowIndex(rangeValue.substring(0, i));
        var endRow = this.parent.rowIndex(rangeValue.substring(i + 1));
        var startCol = this.parent.colIndex(rangeValue.substring(0, i));
        var endCol = this.parent.colIndex(rangeValue.substring(i + 1));
        if (row > endRow - startRow + 1 || col > endCol - startCol + 1) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        row = startRow + row - 1;
        col = startCol + col - 1;
        var cellRef = '' + this.parent.convertAlpha(col) + row;
        var result = this.parent.getValueFromArg(cellRef);
        if (result === '') {
            return 0;
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeIFS = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var condition = '';
        var result = '';
        for (var i = 0; i < argArr.length; i++) {
            condition = this.parent.getValueFromArg(argArr[i]);
            if (condition !== this.parent.trueValue && condition !== this.parent.falseValue) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
            if (condition === this.parent.trueValue) {
                if (argArr[i + 1].indexOf(this.parent.arithMarker) > -1) {
                    return this.parent.trueValue;
                }
                if (this.parent.isCellReference(argArr[i + 1].split(this.parent.tic).join(''))) {
                    result = this.parent.getValueFromArg(argArr[i + 1]);
                }
                else {
                    result = (argArr[i + 1].indexOf(this.parent.tic) > -1) ? argArr[i + 1].split(this.parent.tic).join('') :
                        this.parent.getErrorStrings()[CommonErrors.name];
                }
                i = i + 1;
                return result;
            }
            else if (condition === this.parent.falseValue) {
                i = i + 1;
            }
        }
        return this.parent.getErrorStrings()[CommonErrors.na];
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCOUNTA = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = args;
        var cellColl;
        var result = 0;
        var cellValue;
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.parent.isCellReference(argArr[i])) {
                cellColl = this.parent.getCellCollection(argArr[i].split(this.parent.tic).join(''));
                for (var j = 0; j < cellColl.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellColl[j]);
                    if (cellValue.length > 0) {
                        result++;
                    }
                }
            }
            else {
                var cellValue_1 = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                if (cellValue_1.length > 0) {
                    result++;
                }
            }
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeAVERAGEA = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArrs = args;
        var cellCol;
        var result = 0;
        var cellVal;
        var length = 0;
        for (var k = 0; k < argArrs.length; k++) {
            if (argArrs[k].indexOf(':') > -1 && this.parent.isCellReference(argArrs[k])) {
                cellCol = this.parent.getCellCollection(argArrs[k].split(this.parent.tic).join(''));
                for (var j = 0; j < cellCol.length; j++) {
                    cellVal = this.parent.getValueFromArg(cellCol[j]);
                    if (cellVal.toUpperCase() === this.parent.trueValue) {
                        cellVal = '1';
                    }
                    else if (cellVal.toUpperCase() === this.parent.falseValue || cellVal === '') {
                        cellVal = '0';
                    }
                    else if (isNaN(parseFloat(cellVal))) {
                        return this.parent.getErrorStrings()[CommonErrors.name];
                    }
                    if (cellVal.length > 0) {
                        result = result + parseFloat(cellVal);
                    }
                }
                length = cellCol.length;
            }
            else {
                if (argArrs[k] === this.parent.trueValue) {
                    argArrs[k] = '1';
                }
                if (argArrs[k] === this.parent.falseValue || argArrs[k] === '') {
                    argArrs[k] = '0';
                }
                var cellValue = this.parent.getValueFromArg(argArrs[k].split(this.parent.tic).join(''));
                if (argArrs[k].indexOf(this.parent.tic) > -1) {
                    if (isNaN(parseFloat(argArrs[k].split(this.parent.tic).join('')))) {
                        return this.parent.getErrorStrings()[CommonErrors.value];
                    }
                    if (isNaN(parseFloat(cellValue))) {
                        return this.parent.getErrorStrings()[CommonErrors.name];
                    }
                    if (cellValue.length > 0) {
                        result = result + parseFloat(cellValue);
                    }
                    length = length + 1;
                }
            }
        }
        return result / length;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCOUNTIF = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var argArr = args;
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var cellColl;
        var result = 0;
        var cellValue;
        var stack = [];
        var op = 'equal';
        var condition = argArr[1].split(this.parent.tic).join('');
        if (condition.startsWith('<=')) {
            op = 'lessEq';
            condition = condition.substring(2);
        }
        else if (condition.startsWith('>=')) {
            op = 'greaterEq';
            condition = condition.substring(2);
        }
        else if (condition.startsWith('<>')) {
            op = 'notEq';
            condition = condition.substring(2);
        }
        else if (condition.startsWith('<')) {
            op = 'less';
            condition = condition.substring(1);
        }
        else if (condition.startsWith('>')) {
            op = 'greater';
            condition = condition.substring(1);
        }
        else if (condition.startsWith('=')) {
            op = 'equal';
            condition = condition.substring(1);
        }
        if (argArr[0].indexOf(':') > -1 && this.parent.isCellReference(argArr[0])) {
            cellColl = this.parent.getCellCollection(argArr[0].split(this.parent.tic).join(''));
            for (var j = 0; j < cellColl.length; j++) {
                cellValue = this.parent.getValueFromArg(cellColl[j]);
                if (condition.indexOf('*') > -1 || condition.indexOf('?') > -1) {
                    cellValue = this.parent.findWildCardValue(condition, cellValue);
                }
                stack.push(cellValue);
                stack.push(condition);
                if (this.parent.processLogical(stack, op) === this.parent.trueValue) {
                    result++;
                }
            }
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeSUMIFS = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var sum;
        sum = this.parent.computeIfsFormulas(range, this.parent.falseValue);
        return sum;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeCOUNTIFS = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var sum;
        sum = this.parent.computeIfsFormulas(args, this.parent.trueValue);
        return sum;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeAVERAGEIFS = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var sum;
        sum = this.parent.computeIfsFormulas(args, this.parent.falseValue, this.parent.trueValue);
        return sum;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeMATCH = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var argArr = args;
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var cellColl;
        var cellValue = [];
        var lookupVal = argArr[0].split(this.parent.tic).join('');
        argArr[2] = isNullOrUndefined(argArr[2]) ? '1' : argArr[2].split(this.parent.tic).join('');
        if (argArr[2].split(this.parent.tic).join('') === this.parent.trueValue) {
            argArr[2] = '1';
        }
        if (argArr[2].split(this.parent.tic).join('') === this.parent.falseValue) {
            argArr[2] = '0';
        }
        var matchType = parseFloat(argArr[2]);
        if (matchType !== -1 && matchType !== 0 && matchType !== 1) {
            return this.parent.getErrorStrings()[CommonErrors.na];
        }
        var index = 0;
        var indexVal = '';
        if (argArr[1].indexOf(':') > -1 || this.parent.isCellReference(argArr[1])) {
            cellColl = this.parent.getCellCollection(argArr[1].split(this.parent.tic).join(''));
            for (var j = 0; j < cellColl.length; j++) {
                cellValue[j] = this.parent.getValueFromArg(cellColl[j]).split(this.parent.tic).join('');
            }
            for (var i = 0; i < cellValue.length; i++) {
                if (matchType === 1) {
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    }
                    else if (lookupVal > cellValue[i]) {
                        if (!indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                        else if (cellValue[i] > indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                    }
                }
                else if (matchType === 0) {
                    if (lookupVal.indexOf('*') > -1 || lookupVal.indexOf('?') > -1) {
                        cellValue[i] = this.parent.findWildCardValue(lookupVal, cellValue[i]);
                    }
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    }
                    if (this.parent.parseFloat(lookupVal) === this.parent.parseFloat(cellValue[i])) {
                        return i + 1;
                    }
                }
                else if (matchType === -1) {
                    if (lookupVal === cellValue[i]) {
                        return i + 1;
                    }
                    else if (lookupVal < cellValue[i]) {
                        if (!indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                        else if (cellValue[i] < indexVal) {
                            index = i + 1;
                            indexVal = cellValue[i];
                        }
                    }
                }
            }
        }
        return index ? index : this.parent.getErrorStrings()[CommonErrors.na];
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeLOOKUP = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        var result = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeLookup(argArr);
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeVLOOKUP = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        var result = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 3 || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeVLookup(argArr);
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeSUBTOTAL = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        var result = '';
        if (argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var formula = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join('')));
        if (isNaN(formula)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        if ((formula < 1 || formula > 11) && (formula < 101 || formula > 111)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        var cellRef = argArr.slice(1, argArr.length);
        switch (formula) {
            case 1:
            case 101:
                result = this.ComputeAVERAGE.apply(this, cellRef);
                break;
            case 2:
            case 102:
                result = this.ComputeCOUNT.apply(this, cellRef);
                break;
            case 3:
            case 103:
                result = this.ComputeCOUNTA.apply(this, cellRef);
                break;
            case 4:
            case 104:
                result = this.ComputeMAX.apply(this, cellRef);
                break;
            case 5:
            case 105:
                result = this.ComputeMIN.apply(this, cellRef);
                break;
            case 6:
            case 106:
                result = this.ComputePRODUCT.apply(this, cellRef);
                break;
            case 7:
            case 107:
                result = this.ComputeDAY.apply(this, cellRef);
                break;
            case 8:
            case 108:
                result = this.ComputeCONCAT.apply(this, cellRef);
                break;
            case 9:
            case 109:
                result = this.ComputeSUM.apply(this, cellRef);
                break;
            case 10:
            case 110:
                result = this.ComputeAVERAGEA.apply(this, cellRef);
                break;
            case 11:
            case 111:
                result = this.ComputeABS.apply(this, cellRef);
                break;
            default:
                result = this.parent.getErrorStrings()[CommonErrors.value];
                break;
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeRADIANS = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argArr = range;
        var result;
        if (argArr[0] === '' || argArr.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argArr[0].indexOf(':') > -1 || argArr[0].split(this.parent.tic).join('') === '') {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        var val = argArr[0].split(this.parent.tic).join('');
        argArr[0] = isNaN(this.parent.parseFloat(val)) ? argArr[0] : val;
        var cellvalue = this.parent.getValueFromArg(argArr[0]);
        var radVal = this.parent.parseFloat(cellvalue);
        if (!isNaN(radVal)) {
            result = Math.PI * (radVal) / 180;
        }
        else {
            if (cellvalue.indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
            else {
                return this.parent.getErrorStrings()[CommonErrors.name];
            }
        }
        return result;
    };
    /** @hidden */
    BasicFormulas.prototype.ComputeRANDBETWEEN = function () {
        var range = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            range[_i] = arguments[_i];
        }
        var argsLength = range.length;
        var min;
        var max;
        var argVal;
        if (argsLength !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var i = 0; i < argsLength; i++) {
            if (range[i] === '') {
                return this.parent.getErrorStrings()[CommonErrors.na];
            }
            if (range[i].indexOf(this.parent.tic) > -1) {
                if (isNaN(parseFloat(range[i].split(this.parent.tic).join('')))) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
                else {
                    range[i] = range[i].split(this.parent.tic).join('');
                }
            }
            argVal = parseFloat(this.parent.getValueFromArg(range[i]));
            if (!this.parent.isCellReference(range[i])) {
                if (isNaN(argVal)) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                }
                i === 0 ? min = argVal : max = argVal;
            }
            else {
                argVal = this.parent.getValueFromArg(range[i]) === '' ? 0 : argVal;
                i === 0 ? min = argVal : max = argVal;
                if (min === 0 && max === 0) {
                    return '0';
                }
                if (isNaN(argVal)) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
        }
        if (max < min) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        if (min === 0) {
            return Math.floor(Math.random() * (max - (min - 1))) + min;
        }
        else {
            return max - min === 1 ? Math.round((Math.random() * (max - min)) + min) : Math.floor(Math.random() * (max - (min - 1))) + min;
        }
    };
    BasicFormulas.prototype.getModuleName = function () {
        return 'basic-formulas';
    };
    return BasicFormulas;
}());

/**
 * Export formula modules.
 */

var Parser = /** @__PURE__ @class */ (function () {
    function Parser(parent) {
        this.emptyStr = '';
        this.storedStringText = this.emptyStr;
        this.sheetToken = '!';
        /** @hidden */
        this.tokenAdd = 'a';
        /** @hidden */
        this.tokenSubtract = 's';
        /** @hidden */
        this.tokenMultiply = 'm';
        /** @hidden */
        this.tokenDivide = 'd';
        /** @hidden */
        this.tokenLess = 'l';
        this.charEm = 'r';
        this.charEp = 'x';
        /** @hidden */
        this.tokenGreater = 'g';
        /** @hidden */
        this.tokenEqual = 'e';
        /** @hidden */
        this.tokenLessEq = 'k';
        /** @hidden */
        this.tokenGreaterEq = 'j';
        /** @hidden */
        this.tokenNotEqual = 'o';
        /** @hidden */
        this.tokenAnd = 'c';
        this.tokenEm = 'v';
        this.tokenEp = 't';
        /** @hidden */
        this.tokenOr = String.fromCharCode(126);
        this.charAnd = 'i';
        this.charLess = '<';
        this.charGreater = '>';
        this.charEqual = '=';
        this.charLessEq = 'f';
        this.charGreaterEq = 'h';
        this.charNoEqual = 'z';
        this.stringGreaterEq = '>=';
        this.stringLessEq = '<=';
        this.stringNoEqual = '<>';
        this.stringAnd = '&';
        this.stringOr = '^';
        this.charOr = 'w';
        this.charAdd = '+';
        this.charSubtract = '-';
        this.charMultiply = '*';
        this.charDivide = '/';
        this.fixedReference = '$';
        this.spaceString = ' ';
        this.ignoreBracet = false;
        /** @hidden */
        this.isError = false;
        /** @hidden */
        this.isFormulaParsed = false;
        this.findNamedRange = false;
        this.stringsColl = new Map();
        this.tokens = [
            this.tokenAdd, this.tokenSubtract, this.tokenMultiply, this.tokenDivide, this.tokenLess,
            this.tokenGreater, this.tokenEqual, this.tokenLessEq, this.tokenGreaterEq, this.tokenNotEqual, this.tokenAnd, this.tokenOr
        ];
        this.charNOTop = String.fromCharCode(167);
        this.specialSym = ['~', '@', '#', '?', '%'];
        this.isFailureTriggered = false;
        this.parent = parent;
    }
    /** @hidden */
    Parser.prototype.parse = function (text, fkey) {
        if (this.parent.isTextEmpty(text)) {
            return text;
        }
        if (this.parent.getFormulaCharacter() !== String.fromCharCode(0) && this.parent.getFormulaCharacter() === text[0]) {
            text = text.substring(1);
        }
        if (this.parent.namedRanges.size > 0 || this.parent.storedData.size > 0) {
            text = this.checkForNamedRangeAndKeyValue(text);
            this.findNamedRange = false;
        }
        text = text.split('-+').join('-');
        text = text.split('--').join('+');
        text = text.split('+-').join('-');
        text = text.split('-' + '(' + '-').join('(');
        var formulaString = this.storeStrings(text);
        text = this.storedStringText;
        var i = 0;
        if (isNullOrUndefined(formulaString)) {
            text = text.split(' ').join('');
        }
        text = text.split('=>').join('>=');
        text = text.split('=<').join('<=');
        if (text[text.length - 1] !== this.parent.arithMarker || this.indexOfAny(text, this.tokens) !== (text.length - 2)) {
            text = text.toUpperCase();
        }
        if (text.indexOf(this.sheetToken) > -1) {
            var family = this.parent.getSheetFamilyItem(this.parent.grid);
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
                if (text[0] !== this.sheetToken.toString()) {
                    text = this.parent.setTokensForSheets(text);
                }
                var sheetToken = this.parent.getSheetToken(text.split(this.parent.tic).join(this.emptyStr));
                var scopedRange = this.checkScopedRange(text.split('"').join(this.emptyStr).split(this.sheetToken).join(''));
                if (isNullOrUndefined(sheetToken) && sheetToken !== '' && this.parent.namedRanges.size > 0 && scopedRange !== '') {
                    text = scopedRange;
                }
            }
        }
        text = this.markLibraryFormulas(text);
        try {
            text = this.formulaAutoCorrection(text);
        }
        catch (ex) {
            var args = {
                message: ex.message, exception: ex, isForceCalculable: ex.formulaCorrection,
                computeForceCalculate: false
            };
            if (!args.isForceCalculable) {
                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression];
            }
            if (!this.isFailureTriggered) {
                this.parent.trigger('onFailure', args);
                this.isFailureTriggered = true;
            }
            if (args.isForceCalculable && args.computeForceCalculate) {
                text = this.formulaAutoCorrection(text, args);
                this.parent.storedData.get(fkey).formulaText = '=' + text;
            }
            else {
                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression];
            }
        }
        if (!this.ignoreBracet) {
            i = text.indexOf(')');
            while (i > -1) {
                var k = text.substring(0, i).lastIndexOf('(');
                if (k === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
                }
                if (k === i - 1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.empty_expression]);
                }
                var s = this.emptyStr;
                if (this.ignoreBracet) {
                    s = this.parent.substring(text, k, i - k + 1);
                }
                else {
                    s = this.parent.substring(text, k + 1, i - k - 1);
                }
                try {
                    text = text.substring(0, k) + this.parseSimple(s) + text.substring(i + 1);
                }
                catch (ex) {
                    var args = this.exceptionArgs(ex);
                    if (!this.isFailureTriggered) {
                        this.parent.trigger('onFailure', args);
                        this.isFailureTriggered = true;
                    }
                    var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (this.parent.getErrorLine(ex) ? '' : '#' + this.parent.getErrorLine(ex) + ': ') + errorMessage;
                }
                i = text.indexOf(')');
            }
        }
        if (!this.ignoreBracet && text.indexOf('(') > -1) {
            throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
        }
        text = this.parseSimple(text);
        if (formulaString !== null && formulaString.size > 0) {
            text = this.setStrings(text, formulaString);
        }
        return text;
    };
    /* tslint:disable-next-line:no-any */
    Parser.prototype.exceptionArgs = function (ex) {
        return {
            message: ex.message, exception: ex, isForceCalculable: ex.formulaCorrection,
            computeForceCalculate: false
        };
    };
    Parser.prototype.formulaAutoCorrection = function (formula, args) {
        var arithemeticArr = ['*', '+', '-', '/', '^', '&'];
        var logicalSym = ['>', '=', '<'];
        var i = 0;
        var form = '';
        var op = '';
        var firstOp = '';
        var secondprevOp = '';
        var secondnextOp = '';
        var firstDigit = '';
        var secondDigit = '';
        var countDigit = 0;
        if (this.parent.formulaErrorStrings.indexOf(formula) > -1) {
            return formula;
        }
        else {
            if (this.indexOfAny(formula, this.specialSym) > -1) {
                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression], false);
            }
            while (i < formula.length) {
                if ((formula.indexOf('&') > -1) || (this.parent.isDigit(formula[i]) && ((formula.length > i + 1)
                    && (this.indexOfAny(formula[i + 1], arithemeticArr) > -1)) && ((formula.length > i + 2)
                    && (!isNullOrUndefined(formula[i + 2]) && this.indexOfAny(formula[i + 2], arithemeticArr) > -1)))) {
                    if (isNullOrUndefined(args)) {
                        throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_expression], true);
                    }
                    if (args.computeForceCalculate) {
                        if (this.parent.isDigit(formula[i])) {
                            if (countDigit < 1) {
                                firstDigit = formula[i];
                                firstOp = formula[i + 1];
                                if (isNullOrUndefined(firstOp)) {
                                    firstOp = this.emptyStr;
                                }
                                firstOp = firstOp === '&' ? '' : firstOp;
                                countDigit = countDigit + 1;
                                form = form + firstDigit + firstOp;
                            }
                            else if (countDigit < 2) {
                                secondDigit = formula[i];
                                secondprevOp = formula[i - 1];
                                secondnextOp = formula[i + 1];
                                countDigit = 0;
                                if (secondprevOp === '-') {
                                    secondnextOp = isNullOrUndefined(secondnextOp) ? this.emptyStr : secondnextOp;
                                    secondnextOp = secondnextOp === '&' ? '' : secondnextOp;
                                    form = form + secondprevOp + secondDigit + secondnextOp;
                                }
                                else {
                                    secondnextOp = isNullOrUndefined(secondnextOp) ? this.emptyStr : secondnextOp;
                                    form = form + secondDigit + secondnextOp;
                                }
                            }
                            i = i + 2;
                        }
                        else {
                            form = (formula[i] === '-') ? form + formula[i] : form;
                            i = i + 1;
                        }
                    }
                    else {
                        throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                    }
                    /* tslint:disable-next-line */
                }
                else if ((this.parent.isDigit(formula[i]) || formula[i] === this.parent.rightBracket || this.parent.storedData.has(formula[i].toUpperCase())) && (isNullOrUndefined(formula[i + 1]) || this.indexOfAny(formula[i + 1], arithemeticArr)) > -1) {
                    op = isNullOrUndefined(formula[i + 1]) ? this.emptyStr : formula[i + 1];
                    op = op === '&' ? '' : op;
                    form = formula[i - 1] === '-' ? form + formula[i - 1] + formula[i] + op : form + formula[i] + op;
                    i = i + 2;
                    /* tslint:disable-next-line */
                }
                else if (this.indexOfAny(formula[i], logicalSym) > -1 && !isNullOrUndefined(formula[i - 1]) && !isNullOrUndefined(formula[i + 1])) {
                    form = form + formula[i];
                    i = i + 1;
                }
                else if (formula[i] === 'q') {
                    while (formula[i] !== this.parent.leftBracket) {
                        form = form + formula[i];
                        i = i + 1;
                    }
                    /* tslint:disable-next-line */
                }
                else if (formula[i] === this.parent.leftBracket || formula[i] === this.parent.rightBracket || formula[i] === '{' || formula[i] === '}' || formula[i] === '(' || formula[i] === ')') {
                    form = form + formula[i];
                    i = i + 1;
                    /* tslint:disable-next-line */
                }
                else if (this.parent.isUpperChar(formula[i]) || formula[i].indexOf(':') > -1 || formula[i] === this.parent.getParseArgumentSeparator() || ((formula[i] === '%') && (this.parent.isDigit(formula[i - 1])))) {
                    form = form + formula[i];
                    i = i + 1;
                }
                else if (formula[i] === this.parent.tic || formula[i] === ' ' || formula[i] === '.' || formula[i] === this.sheetToken ||
                    formula[i] === '$') {
                    form = form + formula[i];
                    i = i + 1;
                }
                else {
                    if (this.parent.isDigit(formula[i])) {
                        form = formula[i - 1] === '-' ? form + formula[i - 1] + formula[i] : form + formula[i];
                    }
                    if (formula[i] === '-') {
                        form = form + formula[i];
                        form = form.split('++').join('+').split('+-').join('-').split('-').join('-');
                    }
                    i = i + 1;
                }
            }
        }
        form = form === this.emptyStr ? formula : form;
        if (this.indexOfAny(form[form.length - 1], arithemeticArr) > -1) {
            form = form.substring(0, form.length - 1);
        }
        form = form.split('--').join('-').split('-+').join('-').split('+-').join('-');
        return form;
    };
    Parser.prototype.checkScopedRange = function (text) {
        var _this = this;
        var scopedRange = this.emptyStr;
        var b = 'NaN';
        var id = this.parent.getSheetID(this.parent.grid);
        var sheet = this.parent.getSheetFamilyItem(this.parent.grid);
        if (text[0] === this.sheetToken.toString()) {
            var i = text.indexOf(this.sheetToken, 1);
            var v = parseInt(text.substr(1, i - 1), 10);
            if (i > 1 && !this.parent.isNaN(v)) {
                text = text.substring(i + 1);
                id = v;
            }
        }
        var token = '!' + id.toString() + '!';
        if (sheet === null || sheet.sheetNameToToken == null) {
            return b;
        }
        sheet.sheetNameToToken.forEach(function (value, key) {
            if (sheet.sheetNameToToken.get(key).toString() === token) {
                var s_1 = _this.emptyStr;
                _this.parent.namedRanges.forEach(function (value, key) {
                    /* tslint:disable-next-line:no-any */
                    if (!isNullOrUndefined(_this.parent.parentObject)) {
                        /* tslint:disable-next-line:no-any */
                        s_1 = (_this.parent.parentObject.getActiveSheet().name + _this.sheetToken + text).toUpperCase();
                    }
                    else {
                        s_1 = sheet.sheetNameToToken.get(key).toUpperCase();
                    }
                    if (_this.parent.getNamedRanges().has(s_1)) {
                        scopedRange = (_this.parent.getNamedRanges().get(s_1)).toUpperCase();
                        b = scopedRange;
                    }
                });
            }
        });
        return b;
    };
    Parser.prototype.storeStrings = function (tempString) {
        var i = 0;
        var j = 0;
        var id = 0;
        var key = '';
        var storedString = null;
        var condition;
        var ticLoc = tempString.indexOf(this.parent.tic);
        var singleTicLoc = tempString.indexOf(this.parent.singleTic);
        if (ticLoc > -1 || singleTicLoc > -1) {
            tempString = tempString.split(this.parent.singleTic).join(this.parent.tic);
            i = tempString.indexOf(this.parent.tic);
            while (i > -1 && tempString.length > 0) {
                if (storedString === null) {
                    storedString = this.stringsColl;
                }
                j = i + 1 < tempString.length ? tempString.indexOf(this.parent.tic, i + 1) : -1;
                if (j === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_tics]);
                }
                condition = this.parent.substring(tempString, i, j - i + 1);
                key = this.parent.tic + this.spaceString + id.toString() + this.parent.tic;
                storedString = storedString.set(key, condition);
                tempString = tempString.substring(0, i) + key + tempString.substring(j + 1);
                i = i + key.length;
                if (i < tempString.length) {
                    i = tempString.indexOf(this.parent.tic, i);
                }
                id++;
            }
        }
        this.storedStringText = tempString;
        return storedString;
    };
    Parser.prototype.setStrings = function (text, formulaString) {
        for (var i = 0; i < formulaString.size; i++) {
            formulaString.forEach(function (value, key) {
                text = text.split(key).join(value);
            });
        }
        return text;
    };
    /** @hidden */
    Parser.prototype.parseSimple = function (formulaText) {
        var needToContinue = true;
        var text = formulaText;
        if (text.length > 0 && text[0] === '+') {
            text = text.substring(1);
        }
        if (text === '#DIV/0!') {
            return '#DIV/0!';
        }
        if (text === '#NAME?') {
            return '#NAME?';
        }
        if (text === '') {
            return text;
        }
        if (this.parent.formulaErrorStrings.indexOf(text) > -1) {
            return text;
        }
        text = text.split(this.stringLessEq).join(this.charLessEq);
        text = text.split(this.stringGreaterEq).join(this.charGreaterEq);
        text = text.split(this.stringNoEqual).join(this.charNoEqual);
        text = text.split(this.stringAnd).join(this.charAnd);
        text = text.split(this.stringOr).join(this.charOr);
        text = text.split(this.fixedReference).join(this.emptyStr);
        needToContinue = true;
        var expTokenArray = [this.tokenEp, this.tokenEm];
        var mulTokenArray = [this.tokenMultiply, this.tokenDivide];
        var addTokenArray = [this.tokenAdd, this.tokenSubtract];
        var mulCharArray = [this.charMultiply, this.charDivide];
        var addCharArray = [this.charAdd, this.charSubtract];
        var compareTokenArray = [this.tokenLess, this.tokenGreater, this.tokenEqual, this.tokenLessEq,
            this.tokenGreaterEq, this.tokenNotEqual];
        var compareCharArray = [this.charLess, this.charGreater, this.charEqual, this.charLessEq,
            this.charGreaterEq, this.charNoEqual];
        var expCharArray = [this.charEp, this.charEm];
        var andTokenArray = [this.tokenAnd];
        var andCharArray = [this.charAnd];
        var orCharArray = [this.charOr];
        var orTokenArray = [this.tokenOr];
        text = this.parseSimpleOperators(text, expTokenArray, expCharArray);
        text = this.parseSimpleOperators(text, orTokenArray, orCharArray);
        if (needToContinue) {
            text = this.parseSimpleOperators(text, mulTokenArray, mulCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, addTokenArray, addCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, compareTokenArray, compareCharArray);
        }
        if (needToContinue) {
            text = this.parseSimpleOperators(text, andTokenArray, andCharArray);
        }
        return text;
    };
    /** @hidden */
    // tslint:disable-next-line:max-func-body-length
    Parser.prototype.parseSimpleOperators = function (formulaText, markers, operators) {
        if (this.parent.getErrorStrings().indexOf(formulaText) > -1) {
            return formulaText;
        }
        var text = formulaText;
        var i = 0;
        var op = '';
        for (var c = 0; c < operators.length; c++) {
            op = op + operators[c];
        }
        /* tslint:disable */
        text = text.split("---").join("-").split("--").join("+").split(this.parent.getParseArgumentSeparator() + "-").join(this.parent.getParseArgumentSeparator() + "u").split(this.parent.leftBracket + "-").join(this.parent.leftBracket + "u").split("=-").join("=u");
        text = text.split(',+').join(',').split(this.parent.leftBracket + '+').join(this.parent.leftBracket).split('=+').join('=').split('>+').join('>').split('<+').join('<').split('/+').join('/').split('*+').join('*').split('++').join('+').split("*-").join("*u").toString();
        
        /* tslint:enable */
        if (text.length > 0 && text[0] === '-') {
            text = text.substring(1).split('-').join(this.tokenOr);
            text = '0-' + text;
            text = this.parseSimpleOperators(text, [this.tokenSubtract], [this.charSubtract]);
            text = text.split(this.tokenOr).join('-');
        }
        else if (text.length > 0 && text[0] === '+') {
            text = text.substring(1);
        }
        else if (text.length > 0 && text[text.length - 1] === '+') {
            text = text.substring(0, text.length - 1);
        }
        try {
            if (this.indexOfAny(text, operators) > -1) {
                i = this.indexOfAny(text, operators);
                while (i > -1) {
                    var left = '';
                    var right = '';
                    var leftIndex = 0;
                    var rightIndex = 0;
                    var isNotOperator = text[i] === this.charNOTop;
                    var j = 0;
                    if (!isNotOperator) {
                        j = i - 1;
                        if (text[j] === this.parent.arithMarker) {
                            var k = this.findLeftMarker(text.substring(0, j - 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, k + 1, j - k - 1);
                            leftIndex = k + 1;
                        }
                        else if (text[j] === this.parent.rightBracket) {
                            var bracketCount = 0;
                            var k = j - 1;
                            while (k > 0 && (text[k] !== 'q' || bracketCount !== 0)) {
                                if (text[k] === 'q') {
                                    bracketCount--;
                                }
                                else if (text[k] === this.parent.rightBracket) {
                                    bracketCount++;
                                }
                                k--;
                            }
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, k, j - k + 1);
                            leftIndex = k;
                        }
                        else if (text[j] === this.parent.tic[0]) {
                            var l = text.substring(0, j - 1).lastIndexOf(this.parent.tic);
                            if (l < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, l, j - l + 1);
                            leftIndex = l;
                        }
                        else {
                            var period = false;
                            while (j > -1 && (this.parent.isDigit(text[j]) ||
                                (!period && text[j] === this.parent.getParseDecimalSeparator()))) {
                                if (text[j] === this.parent.getParseDecimalSeparator()) {
                                    period = true;
                                }
                                j = j - 1;
                            }
                            if (j > -1 && period && text[j] === this.parent.getParseDecimalSeparator()) {
                                /* tslint:disable-next-line */
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.number_contains_2_decimal_points]);
                            }
                            j = j + 1;
                            if (j === 0 || (j > 0 && !this.parent.isUpperChar(text[j - 1]))) {
                                left = 'n' + this.parent.substring(text, j, i - j);
                                leftIndex = j;
                            }
                            else {
                                j = j - 1;
                                while (j > -1 && (this.parent.isUpperChar(text[j]) || this.parent.isDigit(text[j]))) {
                                    j = j - 1;
                                }
                                if (j > -1 && text[j] === this.sheetToken) {
                                    j = j - 1;
                                    while (j > -1 && text[j] !== this.sheetToken) {
                                        j = j - 1;
                                    }
                                    if (j > -1 && text[j] === this.sheetToken) {
                                        j = j - 1;
                                    }
                                }
                                j = j + 1;
                                left = this.parent.substring(text, j, i - j);
                                this.parent.updateDependentCell(left);
                                leftIndex = j;
                            }
                            if ((this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(left.toUpperCase())) ||
                                (this.parent.storedData.has(left.toUpperCase()))) {
                                left = 'n' + this.checkForNamedRangeAndKeyValue(left);
                            }
                        }
                    }
                    else {
                        leftIndex = i;
                    }
                    if (i === text.length - 1) {
                        /* tslint:disable-next-line */
                        throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.expression_cannot_end_with_an_operator]);
                    }
                    else {
                        j = i + 1;
                        var uFound = text[j] === 'u'; // for 3*-2
                        if (uFound) {
                            j = j + 1;
                        }
                        if (text[j] === this.parent.tic[0]) {
                            var k = text.substring(j + 1).indexOf(this.parent.tic);
                            if (k < 0) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse];
                            }
                            right = this.parent.substring(text, j, k + 2);
                            rightIndex = k + j + 2;
                        }
                        else if (text[j] === this.parent.arithMarker) {
                            var k = this.findRightMarker(text.substring(j + 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            right = this.parent.substring(text, j + 1, k);
                            rightIndex = k + j + 2;
                        }
                        else if (text[j] === 'q') {
                            var bracketCount = 0;
                            var k = j + 1;
                            while (k < text.length && (text[k] !== this.parent.rightBracket || bracketCount !== 0)) {
                                if (text[k] === this.parent.rightBracket) {
                                    bracketCount++;
                                }
                                else if (text[k] === 'q') {
                                    bracketCount--;
                                }
                                k++;
                            }
                            if (k === text.length) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse];
                            }
                            right = this.parent.substring(text, j, k - j + 1);
                            if (uFound) {
                                right = 'u' + right;
                            }
                            rightIndex = k + 1;
                            /* tslint:disable-next-line */
                        }
                        else if (this.parent.isDigit(text[j]) || text[j] === this.parent.getParseDecimalSeparator()) {
                            var period = (text[j] === this.parent.getParseDecimalSeparator());
                            j = j + 1;
                            /* tslint:disable-next-line */
                            while (j < text.length && (this.parent.isDigit(text[j]) || (!period && text[j] === this.parent.getParseDecimalSeparator()))) {
                                if (text[j] === this.parent.getParseDecimalSeparator()) {
                                    period = true;
                                }
                                j = j + 1;
                            }
                            if (j < text.length && text[j] === '%') {
                                j += 1;
                            }
                            if (period && j < text.length && text[j] === this.parent.getParseDecimalSeparator()) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.number_contains_2_decimal_points];
                            }
                            right = 'n' + this.parent.substring(text, i + 1, j - i - 1);
                            rightIndex = j;
                        }
                        else if (this.parent.isUpperChar(text[j]) || text[j] === this.sheetToken || text[j] === 'u') {
                            if (text[j] === this.sheetToken) {
                                j = j + 1;
                                while (j < text.length && text[j] !== this.sheetToken) {
                                    j = j + 1;
                                }
                            }
                            j = j + 1;
                            var jTemp = 0;
                            var inbracket = false;
                            while (j < text.length && (this.parent.isUpperChar(text[j]) || text[j] === '_'
                                || text[j] === '.' || text[j] === '[' || text[j] === ']' || text[j] === '#' || text[j] === ' '
                                || text[j] === '%' || text[j] === this.parent.getParseDecimalSeparator() && inbracket)) {
                                if (j !== text.length - 1 && text[j] === '[' && text[j + 1] === '[') {
                                    inbracket = true;
                                }
                                if (j !== text.length - 1 && text[j] === ']' && text[j + 1] === ']') {
                                    inbracket = false;
                                }
                                j++;
                                jTemp++;
                            }
                            var noCellReference = (j === text.length) || !this.parent.isDigit(text[j]);
                            if (jTemp > 1) {
                                while (j < text.length && (this.parent.isUpperChar(text[j]) || this.parent.isDigit(text[j])
                                    || text[j] === ' ' || text[j] === '_')) {
                                    j++;
                                }
                                noCellReference = true;
                            }
                            while (j < text.length && this.parent.isDigit(text[j])) {
                                j = j + 1;
                            }
                            if (j < text.length && text[j] === ':') {
                                j = j + 1;
                                if (j < text.length && text[j] === this.sheetToken) {
                                    j++;
                                    while (j < text.length && text[j] !== this.sheetToken) {
                                        j = j + 1;
                                    }
                                    if (j < text.length && text[j] === this.sheetToken) {
                                        j++;
                                    }
                                }
                                while (j < text.length && this.parent.isUpperChar(text[j])) {
                                    j = j + 1;
                                }
                                while (j < text.length && this.parent.isDigit(text[j])) {
                                    j = j + 1;
                                }
                                j = j - 1;
                                right = this.parent.substring(text, i + 1, j - i);
                            }
                            else {
                                j = j - 1;
                                right = this.parent.substring(text, i + 1, j - i);
                                uFound = text[j] === 'u';
                                if (uFound) {
                                    right = 'u' + right;
                                }
                            }
                            noCellReference = !this.parent.isCellReference(right);
                            if (!noCellReference) {
                                this.parent.updateDependentCell(right);
                            }
                            if ((this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(right.toUpperCase()))
                                || (this.parent.storedData.has(right.toUpperCase()))) {
                                right = 'n' + this.checkForNamedRangeAndKeyValue(right);
                            }
                            rightIndex = j + 1;
                        }
                    }
                    var p = op.indexOf(text[i]);
                    var s = this.parent.arithMarker + left + right + markers[p] + this.parent.arithMarker;
                    if (leftIndex > 0) {
                        s = text.substring(0, leftIndex) + s;
                    }
                    if (rightIndex < text.length) {
                        s = s + text.substring(rightIndex);
                    }
                    s = s.split(this.parent.arithMarker2).join(this.parent.arithMarker.toString());
                    text = s;
                    i = this.indexOfAny(text, operators);
                }
            }
            else {
                if (text.length > 0 && (this.parent.isUpperChar(text[0]) || text[0] === this.sheetToken)) {
                    var isCharacter = true;
                    var checkLetter = true;
                    var oneTokenFound = false;
                    var textLen = text.length;
                    for (var k = 0; k < textLen; ++k) {
                        if (text[k] === this.sheetToken) {
                            if (k > 0 && !oneTokenFound) {
                                throw this.parent.getErrorStrings()[CommonErrors.ref];
                            }
                            oneTokenFound = true;
                            k++;
                            while (k < textLen && this.parent.isDigit(text[k])) {
                                k++;
                            }
                            if (k === textLen || text[k] !== this.sheetToken) {
                                isCharacter = false;
                                break;
                            }
                        }
                        else {
                            if (!checkLetter && this.parent.isChar(text[k])) {
                                isCharacter = false;
                                break;
                            }
                            if (this.parent.isChar(text[k]) || this.parent.isDigit(text[k]) || text[k] === this.sheetToken) {
                                checkLetter = this.parent.isUpperChar(text[k]);
                            }
                            else {
                                isCharacter = false;
                                break;
                            }
                        }
                    }
                    if (isCharacter) {
                        this.parent.updateDependentCell(text);
                    }
                }
            }
            return text;
        }
        catch (ex) {
            return ex;
        }
    };
    /** @hidden */
    Parser.prototype.indexOfAny = function (text, operators) {
        for (var i = 0; i < text.length; i++) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    };
    /** @hidden */
    Parser.prototype.findLeftMarker = function (text) {
        var ret = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            var bracketLevel = 0;
            for (var i = text.length - 1; i >= 0; --i) {
                if (text[i] === this.parent.rightBracket) {
                    bracketLevel--;
                }
                else if (text[i] === this.parent.leftBracket) {
                    bracketLevel++;
                }
                else if (text[i] === this.parent.arithMarker && bracketLevel === 0) {
                    ret = i;
                    break;
                }
            }
        }
        return ret;
    };
    /** @hidden */
    Parser.prototype.findRightMarker = function (text) {
        var ret = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            var bracketLevel = 0;
            for (var j = 0; j < text.length; ++j) {
                if (text[j] === this.parent.rightBracket) {
                    bracketLevel--;
                }
                else if (text[j] === this.parent.leftBracket) {
                    bracketLevel++;
                }
                else if (text[j] === this.parent.arithMarker && bracketLevel === 0) {
                    ret = j;
                    break;
                }
            }
        }
        return ret;
    };
    /** @hidden */
    Parser.prototype.parseFormula = function (formula, fKey) {
        if (formula.length > 0 && formula[0] === this.parent.getFormulaCharacter()) {
            formula = formula.substring(1);
        }
        if (formula.length > 0 && formula[0] === '+') {
            formula = formula.substring(1);
        }
        try {
            this.isFailureTriggered = false;
            this.isError = false;
            formula = this.parse(formula.trim(), fKey);
            this.isFormulaParsed = true;
        }
        catch (ex) {
            var args = this.exceptionArgs(ex);
            if (!this.isFailureTriggered) {
                this.parent.trigger('onFailure', args);
                this.isFailureTriggered = true;
            }
            var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
            formula = (isNullOrUndefined(this.parent.getErrorLine(ex)) ? '' : '#' + this.parent.getErrorLine(ex) + ': ') + errorMessage;
            this.isError = true;
        }
        return formula;
    };
    /** @hidden */
    Parser.prototype.markLibraryFormulas = function (formula) {
        var bracCount = 0;
        var rightParens = formula.indexOf(')');
        if (rightParens === -1) {
            formula = this.markNamedRanges(formula);
        }
        else {
            while (rightParens > -1) {
                var parenCount = 0;
                var leftParens = rightParens - 1;
                while (leftParens > -1 && (formula[leftParens] !== '(' || parenCount !== 0)) {
                    if (formula[leftParens] === ')') {
                        parenCount++;
                    }
                    else if (formula[leftParens] === ')') {
                        parenCount--;
                    }
                    leftParens--;
                }
                if (leftParens === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
                }
                var i = leftParens - 1;
                while (i > -1 && (this.parent.isChar(formula[i]))) {
                    i--;
                }
                var len = leftParens - i - 1;
                var libFormula = this.parent.substring(formula, i + 1, len);
                if (len > 0 && !isNullOrUndefined(this.parent.getFunction(libFormula))) {
                    if (this.parent.substring(formula, i + 1, len) === 'AREAS') {
                        this.ignoreBracet = true;
                    }
                    else {
                        this.ignoreBracet = false;
                    }
                    var substr = this.parent.substring(formula, leftParens, rightParens - leftParens + 1);
                    try {
                        var args = void 0;
                        substr = substr.split('(').join('').split(')').join('');
                        substr = '(' + this.formulaAutoCorrection(substr, args) + ')';
                    }
                    catch (ex) {
                        var args = {
                            message: ex.message, exception: ex,
                            isForceCalculable: ex.formulaCorrection, computeForceCalculate: false
                        };
                        if (!args.isForceCalculable) {
                            throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                        }
                        if (!this.isFailureTriggered) {
                            this.parent.trigger('onFailure', args);
                            this.isFailureTriggered = true;
                            bracCount = bracCount + 1;
                        }
                        args.computeForceCalculate = bracCount > 0 ? true : args.computeForceCalculate;
                        if (args.isForceCalculable) {
                            if (args.computeForceCalculate) {
                                substr = substr.split('(').join('').split(')').join('');
                                substr = '(' + this.formulaAutoCorrection(substr, args) + ')';
                            }
                            else {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                            }
                        }
                        else {
                            throw this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
                        }
                    }
                    substr = this.markNamedRanges(substr);
                    substr = this.swapInnerParens(substr);
                    substr = this.addParensToArgs(substr);
                    var id = substr.lastIndexOf(this.parent.getParseArgumentSeparator());
                    if (id === -1) {
                        if (substr.length > 2 && substr[0] === '(' && substr[substr.length - 1] === ')') {
                            if (substr[1] !== '{' && substr[1] !== '(') {
                                substr = substr.substring(0, substr.length - 1) + '}' + substr.substring(substr.length - 1);
                                substr = substr[0] + '{' + substr.substring(1);
                            }
                        }
                    }
                    formula = formula.substring(0, i + 1) + 'q' + this.parent.substring(formula, i + 1, len) +
                        (substr.split('(').join(this.parent.leftBracket))
                            .split(')').join(this.parent.rightBracket) + formula.substring(rightParens + 1);
                }
                else if (len > 0) {
                    return this.parent.getErrorStrings()[CommonErrors.name];
                }
                else {
                    var s = this.emptyStr;
                    if (leftParens > 0) {
                        s = formula.substring(0, leftParens);
                    }
                    s = s + '{' + this.parent.substring(formula, leftParens + 1, rightParens - leftParens - 1) + '}';
                    if (rightParens < formula.length) {
                        s = s + formula.substring(rightParens + 1);
                    }
                    s = this.markNamedRanges(s);
                    formula = s;
                }
                rightParens = formula.indexOf(')');
            }
        }
        formula = (formula.split('{').join('(')).split('}').join(')');
        return formula;
    };
    /** @hidden */
    Parser.prototype.swapInnerParens = function (fSubstr) {
        if (fSubstr.length > 2) {
            /* tslint:disable-next-line */
            fSubstr = fSubstr[0] + fSubstr.substr(1, fSubstr.length - 2).split('(').join('{').split(')').join('}') + fSubstr[fSubstr.length - 1];
        }
        return fSubstr;
    };
    /** @hidden */
    Parser.prototype.addParensToArgs = function (fSubstr) {
        if (fSubstr.length === 0) {
            return this.emptyStr;
        }
        var rightSides = [];
        rightSides.push(this.parent.getParseArgumentSeparator());
        rightSides.push(this.parent.rightBracket);
        var id = fSubstr.lastIndexOf(this.parent.getParseArgumentSeparator());
        var k = 0;
        if (id === -1) {
            if (fSubstr.length > 2 && fSubstr[0] === '(' && fSubstr[fSubstr.length - 1] === ')') {
                if (fSubstr[1] !== '{' && fSubstr[1] !== '(') {
                    fSubstr = fSubstr.substring(0, fSubstr.length - 1) + '}' + fSubstr.substring(fSubstr.length - 1);
                    fSubstr = fSubstr[0] + '{' + fSubstr.substring(1);
                }
                else {
                    var marker = ['+', '-', '*', '/'];
                    id = this.lastIndexOfAny(fSubstr, marker);
                    if (k === 0 && fSubstr[fSubstr.length - 1] === ')') {
                        k = fSubstr.length - 1;
                    }
                    if (k > 0) {
                        if (fSubstr[id + 1] !== '{' && fSubstr[id - 1] === '}') {
                            fSubstr = fSubstr.substr(0, k) + '}' + fSubstr.substr(k);
                            fSubstr = fSubstr.substr(0, id + 1) + '{' + fSubstr.substr(id + 1);
                        }
                    }
                }
            }
        }
        else {
            var oneTimeOnly = true;
            while (id > -1) {
                var j = this.indexOfAny(fSubstr.substring(id + 1, fSubstr.length), rightSides);
                if (j >= 0) {
                    j = id + j + 1;
                }
                else if (j === -1 && fSubstr[fSubstr.length - 1] === ')') {
                    j = fSubstr.length - 1;
                }
                if (j > 0) {
                    if (fSubstr[id + 1] !== '{' && fSubstr[j - 1] !== '}') {
                        fSubstr = fSubstr.substr(0, j) + '}' + fSubstr.substr(j);
                        fSubstr = fSubstr.substr(0, id + 1) + '{' + fSubstr.substr(id + 1);
                    }
                }
                id = fSubstr.substr(0, id).lastIndexOf(this.parent.getParseArgumentSeparator());
                if (oneTimeOnly && id === -1 && fSubstr[0] === '(') {
                    id = 0;
                    oneTimeOnly = false;
                }
            }
        }
        fSubstr = fSubstr.split('{}').join(this.emptyStr);
        return fSubstr;
    };
    /** @hidden */
    Parser.prototype.lastIndexOfAny = function (text, operators) {
        for (var i = text.length - 1; i > -1; i--) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    };
    /** @hidden */
    Parser.prototype.markNamedRanges = function (formula) {
        var markers = [')', this.parent.getParseArgumentSeparator(), '}', '+', '-', '*', '/', '<', '>', '=', '&'];
        var i = (formula.length > 0 && (formula[0] === '(' || formula[0] === '{')) ? 1 : 0;
        if (formula.indexOf('#N/A') > -1) {
            formula = formula.split('#N/A').join('#N~A');
        }
        if (formula.indexOf('#DIV/0!') > -1) {
            formula = formula.split('#DIV/0!').join('#DIV~0!');
        }
        var end = this.indexOfAny(formula.substring(i), markers);
        while (end > -1 && end + i < formula.length) {
            var scopedRange = this.emptyStr;
            var s = null;
            if ((this.parent.substring(formula, i, end)).indexOf('[') > -1) {
                s = this.getTableRange(this.parent.substring(formula, i, end));
            }
            else if (this.parent.storedData.has(this.parent.substring(formula, i, end))) {
                s = this.checkForNamedRangeAndKeyValue(this.parent.substring(formula, i, end));
            }
            else if (this.parent.namedRanges.has(this.parent.substring(formula, i, end))) {
                s = this.checkForNamedRangeAndKeyValue(this.parent.substring(formula, i, end));
            }
            if (isNullOrUndefined(s)) {
                scopedRange = this.checkScopedRange(this.parent.substring(formula, i, end));
                if (scopedRange !== 'NaN') {
                    this.findNamedRange = true;
                    s = scopedRange;
                }
                else if (this.parent.substring(formula, i, end).startsWith(this.sheetToken.toString())) {
                    var formulaStr = this.parent.substring(formula, i, end).indexOf(this.sheetToken, 1);
                    // if (formulaStr > 1) {
                    //     s = this.parent.namedRanges.get(this.parent.substring
                    // (formula.substring(i), formulaStr + 1, end - formulaStr - 1));
                    // }
                }
                if (!isNullOrUndefined(s) && this.findNamedRange) {
                    if (s.indexOf(this.fixedReference) > -1) {
                        s = s.split(this.fixedReference).join(this.emptyStr);
                    }
                }
            }
            if (!isNullOrUndefined(s)) {
                s = s.toUpperCase();
                s = this.parent.setTokensForSheets(s);
                s = this.markLibraryFormulas(s);
            }
            if (!isNullOrUndefined(s) && s !== this.emptyStr) {
                formula = formula.substring(0, i) + s + formula.substring(i + end);
                i += s.length + 1;
            }
            else {
                i += end + 1;
                while (i < formula.length && !this.parent.isUpperChar(formula[i]) && formula[i] !== this.sheetToken) {
                    i++;
                }
            }
            end = i;
            if (i < formula.length - 1 && formula[i] === '{') {
                i = i + 1;
            }
            end = this.indexOfAny(formula.substring(i), markers);
            while (end === 0 && i < formula.length - 1) {
                i++;
                end = this.indexOfAny(formula.substring(i), markers);
            }
            if ((end === -1 || formula.substring(i).indexOf('[') > -1) && i < formula.length) {
                if (formula.substring(i).indexOf('[') > -1) {
                    s = this.getTableRange(formula.substring(i));
                }
                else {
                    if (this.parent.storedData.has(formula.substring(i))) {
                        s = this.parent.storedData.size > 0 ? this.checkForNamedRangeAndKeyValue(formula.substring(i)) : s;
                    }
                    else {
                        s = this.parent.namedRanges.size > 0 ? this.checkForNamedRangeAndKeyValue(formula.substring(i)) : s;
                    }
                }
                if (isNullOrUndefined(s)) {
                    scopedRange = this.checkScopedRange(formula.substring(i));
                    if (scopedRange !== 'NaN') {
                        s = scopedRange;
                    }
                }
                if (!isNullOrUndefined(s) && s !== this.emptyStr) {
                    s = s.toUpperCase();
                    s = this.parent.setTokensForSheets(s);
                    s = this.markLibraryFormulas(s);
                    if (s != null) {
                        var val = formula.substring(i);
                        if (val[val.length - 1] === ')') {
                            formula = formula.substring(0, i) + s + ')';
                        }
                        else {
                            formula = formula.substring(0, i) + s;
                        }
                        i += s.toString().length + 1;
                    }
                }
                end = (i < formula.length) ? this.indexOfAny(formula.substring(i), markers) : -1;
            }
        }
        if (formula.indexOf('#N~A') > -1) {
            formula = formula.split('#N~A').join('#N/A');
        }
        if (formula.indexOf('#DIV~0!') > -1) {
            formula = formula.split('#DIV~0!').join('#DIV/0!');
        }
        return formula;
    };
    /** @hidden */
    Parser.prototype.checkForNamedRangeAndKeyValue = function (text) {
        var scopedRange = this.emptyStr;
        if (text.indexOf('[') > -1) {
            var namerangeValue = this.getTableRange(text);
            if (!isNullOrUndefined(namerangeValue)) {
                this.findNamedRange = true;
                text = namerangeValue;
            }
        }
        scopedRange = this.checkScopedRange(text);
        if (scopedRange !== 'NaN') {
            this.findNamedRange = true;
            text = scopedRange;
        }
        else {
            if (text.indexOf(this.sheetToken) > -1) {
                var sheet = this.parent.getSheetFamilyItem(this.parent.grid);
                /* tslint:disable-next-line */
                var value = text.split('"').join(this.emptyStr);
                value = value.substr(0, value.indexOf(this.sheetToken));
                if (sheet.sheetNameToToken.has(value.toUpperCase())) {
                    /* tslint:disable */
                    var sheetIndex = parseInt(sheet.sheetNameToToken.get(value.toUpperCase()).split(this.sheetToken).join(this.emptyStr));
                    // if (!ej.isNullOrUndefined(this.parentObject) && this.parentObject.pluginName == "ejSpreadsheet") {
                    //     var name = text.replace(value, this.parentObject.model.sheets[(sheetIndex + 1)].sheetInfo.text.toUpperCase()).split("'").join(this._string_empty);
                    //     if (this.getNamedRanges().length > 0 && this.getNamedRanges().contains(name.toUpperCase())) {
                    //         text = name;
                    //     }
                    // }
                    /* tslint-enable */
                }
            }
            if (this.parent.storedData.size > 0 && this.parent.storedData.has(text)) {
                text = 'A' + this.parent.colIndex(text);
            }
            if (this.parent.namedRanges.size > 0 && this.parent.namedRanges.has(text.toUpperCase())) {
                /* tslint:disable-next-line:no-any */
                if (!isNullOrUndefined(this.parent.parentObject)) {
                    text = this.parse(this.parent.namedRanges.get(text.toUpperCase()));
                }
                else {
                    text = this.parse(this.parent.namedRanges.get(text.toUpperCase()));
                    text = this.parent.setTokensForSheets(text);
                    if (text.indexOf(this.fixedReference) > -1) {
                        text.split(this.fixedReference).join(this.emptyStr);
                    }
                    this.findNamedRange = true;
                }
            }
            if (this.findNamedRange) {
                if (text[0] !== '!' && text[0] !== 'q' && text[0] !== 'bq') {
                    text = this.parent.setTokensForSheets(text);
                    if (text.indexOf(this.fixedReference) > -1) {
                        text = text.split(this.fixedReference).join(this.emptyStr);
                    }
                }
            }
        }
        return text;
    };
    Parser.prototype.getTableRange = function (text) {
        text = text.replace(' ', this.emptyStr).toUpperCase();
        var name = text.replace(']', this.emptyStr).replace('#DATA', this.emptyStr);
        var tableName = name;
        if (name.indexOf(this.parent.getParseArgumentSeparator()) > -1) {
            tableName = name.substring(0, name.indexOf(this.parent.getParseArgumentSeparator())).replace('[', this.emptyStr);
            name = name.replace('[', this.emptyStr).replace(this.parent.getParseArgumentSeparator(), '_');
        }
        var range = this.emptyStr;
        return name.toUpperCase();
    };
    Parser.prototype.findNextEndIndex = function (formula, loc) {
        var count = 0;
        var l = loc;
        var found = false;
        while (!found && loc < formula.length) {
            if (formula[l] === '[') {
                count++;
            }
            else if (formula[l] === ']') {
                count--;
                if (count === 0) {
                    found = true;
                }
            }
            loc++;
        }
        loc = loc - l;
        return loc;
    };
    
    return Parser;
}());

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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* tslint:disable-next-line:max-line-length */
/**
 * Represents the calculate library.
 */
var Calculate = /** @__PURE__ @class */ (function (_super) {
    __extends$5(Calculate, _super);
    /**
     * Base constructor for creating Calculate library.
     */
    function Calculate(parent) {
        var _this = _super.call(this, null, null) || this;
        _this.lFormulas = new Map();
        /** @hidden */
        _this.storedData = new Map();
        _this.keyToRowsMap = new Map();
        _this.rowsToKeyMap = new Map();
        /** @hidden */
        _this.rightBracket = String.fromCharCode(161);
        /** @hidden */
        _this.leftBracket = String.fromCharCode(162);
        /** @hidden */
        _this.sheetToken = '!';
        _this.emptyString = '';
        _this.leftBrace = '{';
        _this.rightBrace = '}';
        _this.cell = _this.emptyString;
        _this.cellPrefix = '!0!A';
        _this.treatEmptyStringAsZero = false;
        /** @hidden */
        _this.tic = '\"';
        /** @hidden */
        _this.singleTic = '\'';
        /** @hidden */
        _this.trueValue = 'TRUE';
        /** @hidden */
        _this.falseValue = 'FALSE';
        _this.parseDecimalSeparator = '.';
        /** @hidden */
        _this.arithMarker = String.fromCharCode(180);
        /** @hidden */
        _this.arithMarker2 = _this.arithMarker + _this.arithMarker;
        _this.dependentCells = null;
        _this.dependentFormulaCells = null;
        _this.minValue = Number.MIN_SAFE_INTEGER;
        _this.maxValue = Number.MAX_SAFE_INTEGER;
        _this.categoryCollection = ['All'];
        _this.dependencyLevel = 0;
        _this.refreshedCells = new Map();
        _this.computedValues = null;
        /** @hidden */
        _this.randomValues = new Map();
        /** @hidden */
        _this.isRandomVal = false;
        /** @hidden */
        _this.randCollection = [];
        /**
         * @hidden
         */
        _this.formulaErrorStrings = [
            'binary operators cannot start an expression',
            'cannot parse',
            'bad library',
            'invalid char in front of',
            'number contains 2 decimal points',
            'expression cannot end with an operator',
            'invalid characters following an operator',
            'invalid character in number',
            'mismatched parentheses',
            'unknown formula name',
            'requires a single argument',
            'requires 3 arguments',
            'invalid Math argument',
            'requires 2 arguments',
            '#NAME?',
            'too complex',
            'circular reference: ',
            'missing formula',
            'improper formula',
            'invalid expression',
            'cell empty',
            'bad formula',
            'empty expression',
            '',
            'mismatched string quotes',
            'wrong number of arguments',
            'invalid arguments',
            'iterations do not converge',
            'Control is already registered',
            'Calculation overflow',
            'Missing sheet',
            'cannot_parse',
            'expression_cannot_end_with_an_operator'
        ];
        _this.errorStrings = null;
        _this.parseArgumentSeparator = ',';
        _this.dateTime1900 = new Date(1900, 0, 1, 0, 0, 0);
        _this.isParseDecimalSeparatorChanged = false;
        _this.isArgumentSeparatorChanged = false;
        _this.sheetFamilyID = 0;
        _this.defaultFamilyItem = null;
        _this.sheetFamiliesList = null;
        _this.modelToSheetID = null;
        /** @hidden */
        _this.tokenCount = 0;
        _this.sortedSheetNames = null;
        _this.tempSheetPlaceHolder = String.fromCharCode(133);
        /** @hidden */
        _this.namedRanges = new Map();
        _this.formulaInfoTable = null;
        _this.oaDate = new Date(1899, 11, 30);
        _this.millisecondsOfaDay = 24 * 60 * 60 * 1000;
        _this.parseDateTimeSeparator = '/';
        var moduleLoader = new ModuleLoader(_this);
        if (_this.includeBasicFormulas) {
            Calculate_1.Inject(BasicFormulas);
        }
        if (_this.injectedModules && _this.injectedModules.length) {
            moduleLoader.inject(_this.requiredModules(), _this.injectedModules);
        }
        _this.parentObject = isNullOrUndefined(parent) ? _this : parent;
        _this.grid = _this.parentObject;
        _this.parser = new Parser(_this);
        return _this;
    }
    Calculate_1 = Calculate;
    Object.defineProperty(Calculate.prototype, "libraryFormulas", {
        /* tslint:disable-next-line:no-any */
        get: function () {
            return this.lFormulas;
        },
        /* tslint:disable-next-line:no-any */
        set: function (formulaColl) {
            this.lFormulas.set(formulaColl.fName, { handler: formulaColl.handler, category: formulaColl.category, description: formulaColl.description });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To get the argument separator to split the formula arguments.
     * @returns string
     */
    Calculate.prototype.getParseArgumentSeparator = function () {
        var seperator = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    };
    /**
     * To set the argument separator to split the formula arguments.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    Calculate.prototype.setParseArgumentSeparator = function (value) {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    };
    /**
     * To get the date separator to split the date value.
     * @returns string
     */
    Calculate.prototype.getParseDateTimeSeparator = function () {
        return this.parseDateTimeSeparator;
    };
    /**
     * To set whether the empty string is treated as zero or not.
     * @param {boolean} value
     * @returns boolean
     */
    Calculate.prototype.setTreatEmptyStringAsZero = function (value) {
        this.treatEmptyStringAsZero = value;
    };
    /**
     * To get whether the empty string is treated as zero or not.
     * @returns boolean
     */
    Calculate.prototype.getTreatEmptyStringAsZero = function () {
        return this.treatEmptyStringAsZero;
    };
    /**
     * To set the date separator to split the date value.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    Calculate.prototype.setParseDateTimeSeparator = function (value) {
        this.parseDateTimeSeparator = value;
    };
    /**
     * To provide the array of modules needed.
     * @hidden
     */
    Calculate.prototype.requiredModules = function () {
        return getModules(this);
    };
    /**
     * Dynamically injects the required modules to the library.
     * @hidden
     */
    Calculate.Inject = function () {
        var moduleList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            moduleList[_i] = arguments[_i];
        }
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (var j = 0; j < moduleList.length; j++) {
            if (this.prototype.injectedModules.indexOf(moduleList[j]) === -1) {
                this.prototype.injectedModules.push(moduleList[j]);
            }
        }
    };
    /**
     * Get injected modules
     * @hidden
     */
    Calculate.prototype.getInjectedModules = function () {
        return this.injectedModules;
    };
    Calculate.prototype.onPropertyChanged = function (newProp, oldProp) {
        /** code snippets */
    };
    Calculate.prototype.getModuleName = function () {
        return 'calculate';
    };
    /** @hidden */
    Calculate.prototype.getFormulaCharacter = function () {
        return '=';
    };
    /** @hidden */
    Calculate.prototype.isUpperChar = function (text) {
        var charCode = text.charCodeAt(0);
        return ((charCode > 64) && (charCode < 91));
    };
    Calculate.prototype.resetKeys = function () {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    };
    /**
     * @hidden
     */
    Calculate.prototype.updateDependentCell = function (cellRef) {
        var family = this.getSheetFamilyItem(this.grid);
        var cell = this.cell;
        if (family.sheetNameToParentObject !== null) {
            var token = family.parentObjectToToken.get(this.grid);
            if (cell.indexOf(this.sheetToken) === -1) {
                cell = token + cell;
            }
            if (cellRef.indexOf(this.sheetToken) === -1) {
                cellRef = token + cellRef;
            }
        }
        if (this.getDependentCells().has(cellRef)) {
            var formulaCells = this.getDependentCells().get(cellRef);
            if (formulaCells.indexOf(cell) < 0) {
                formulaCells.push(cell);
            }
        }
        else {
            this.getDependentCells().set(cellRef, [cell]);
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.getDependentCells = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentCells == null) {
                family.sheetDependentCells = new Map();
            }
            return family.sheetDependentCells;
        }
        else {
            if (this.dependentCells == null) {
                this.dependentCells = new Map();
            }
            return this.dependentCells;
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.getDependentFormulaCells = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentFormulaCells == null) {
                family.sheetDependentFormulaCells = new Map();
            }
            return family.sheetDependentFormulaCells;
        }
        else {
            if (this.dependentFormulaCells == null) {
                this.dependentFormulaCells = new Map();
            }
            return this.dependentFormulaCells;
        }
    };
    /**
     * To get library formulas collection.
     * @returns Map<string, Function>
     */
    Calculate.prototype.getLibraryFormulas = function () {
        return this.lFormulas;
    };
    /**
     * To get library function.
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns Function
     */
    Calculate.prototype.getFunction = function (libFormula) {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        }
        else {
            return null;
        }
    };
    Calculate.prototype.getFormulaInfoTable = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetFormulaInfotable === null) {
                family.sheetFormulaInfotable = new Map();
            }
            return family.sheetFormulaInfotable;
        }
        else {
            if (this.formulaInfoTable === null) {
                this.formulaInfoTable = new Map();
            }
            return this.formulaInfoTable;
        }
    };
    /**
     * To get the formula text.
     * @private
     */
    Calculate.prototype.getFormula = function (key) {
        key = key.toUpperCase();
        if (this.storedData.has(key)) {
            return this.storedData.get(key).getFormulaText();
        }
        return '';
    };
    /**
     * To get the formula text.
     * @returns void
     */
    Calculate.prototype.getParseDecimalSeparator = function () {
        var seperator = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    };
    /**
     * To get the formula text.
     * @param {string} value - Specifies the decimal separator value.
     * @returns void
     */
    Calculate.prototype.setParseDecimalSeparator = function (value) {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    };
    /** @hidden */
    Calculate.prototype.getSheetToken = function (cellRef) {
        var i = 0;
        var temp = this.emptyString;
        if (i < cellRef.length && cellRef[i] === this.sheetToken) {
            i++;
            while (i < cellRef.length && cellRef[i] !== this.sheetToken) {
                i++;
            }
            temp = cellRef.substring(0, i + 1);
        }
        if (i < cellRef.length) {
            return temp;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    };
    /** @hidden */
    Calculate.prototype.getSheetID = function (grd) {
        var family = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            var token = family.parentObjectToToken.get(grd);
            token = token.split(this.sheetToken).join(this.emptyString);
            var id = this.parseFloat(token);
            if (!this.isNaN(id)) {
                return id;
            }
        }
        return -1;
    };
    /** @hidden */
    Calculate.prototype.parseFloat = function (value) {
        return Number(value);
    };
    /**
     * To get the row index of the given cell.
     * @param {string} cell - Cell address for getting row index.
     * @returns number
     */
    Calculate.prototype.rowIndex = function (cell) {
        var i = 0;
        var result;
        var isLetter = false;
        if (i < cell.length && cell[i] === this.sheetToken) {
            i++;
            while (i < cell.length && cell[i] !== this.sheetToken) {
                i++;
            }
            i++;
        }
        while (i < cell.length && this.isChar(cell[i])) {
            isLetter = true;
            i++;
        }
        result = parseInt(cell.substring(i), 10);
        if (i < cell.length && !this.isNaN(result)) {
            return result;
        }
        if (isLetter) {
            return -1;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    };
    /**
     * To get the column index of the given cell.
     * @param {string} cell - Cell address for getting column index.
     * @returns number
     */
    Calculate.prototype.colIndex = function (cell) {
        var j = 0;
        var k = 0;
        cell = cell.toUpperCase();
        if (j < cell.length && cell[j] === this.sheetToken) {
            j++;
            while (j < cell.length && cell[j] !== this.sheetToken) {
                j++;
            }
            j++;
        }
        while (j < cell.length && this.isChar(cell[j])) {
            var charCode = cell[j].charCodeAt(0);
            k = k * 26 + charCode - 64;
            j++;
        }
        if (k === 0) {
            return -1;
        }
        return k;
    };
    /**
     * To get the valid error strings.
     * @hidden
     */
    Calculate.prototype.getErrorStrings = function () {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!'];
        }
        return this.errorStrings;
    };
    /** @hidden */
    Calculate.prototype.substring = function (text, startIndex, length) {
        return text.substring(startIndex, length + startIndex);
    };
    /** @hidden */
    Calculate.prototype.isChar = function (c) {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.getSheetFamilyItem = function (model) {
        if (this.sheetFamilyID === 0) {
            if (this.defaultFamilyItem == null) {
                this.defaultFamilyItem = new CalcSheetFamilyItem();
            }
            return this.defaultFamilyItem;
        }
        if (this.sheetFamiliesList == null) {
            this.sheetFamiliesList = new Map();
        }
        var i = this.modelToSheetID.get(model);
        if (!this.sheetFamiliesList.has(i)) {
            this.sheetFamiliesList.set(i, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(i);
    };
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns void
     */
    Calculate.prototype.setKeyValue = function (key, value) {
        key = key.toUpperCase();
        var str = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf(this.leftBrace) === 0) {
            this.storedData.set(key, new FormulaInfo());
            this.keyToRowsMap.set(key, this.keyToRowsMap.size + 1);
            this.rowsToKeyMap.set(this.rowsToKeyMap.size + 1, key);
        }
        var fInfo = this.storedData.get(key);
        if (fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() !== str) {
            var s1 = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            var formulaDependent = this.getDependentFormulaCells().get(s1);
            if (formulaDependent != null) {
                this.clearFormulaDependentCells(s1);
            }
        }
        if (str.length > 0 && str[0] === this.getFormulaCharacter()) {
            fInfo.setFormulaText(str);
        }
        else if (fInfo.getFormulaValue() !== str) {
            fInfo.setFormulaText('');
            fInfo.setParsedFormula('');
            fInfo.setFormulaValue(str);
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.clearFormulaDependentCells = function (cell) {
        var _this = this;
        var dependentFormula = this.getDependentFormulaCells().get(cell);
        if (dependentFormula != null) {
            dependentFormula.forEach(function (value, key) {
                var s = key;
                var dependent = _this.getDependentCells().get(s);
                _this.arrayRemove(dependent, cell);
                if (dependent.length === 0) {
                    _this.getDependentCells().delete(s);
                }
            });
            this.getDependentFormulaCells().delete(cell);
        }
    };
    Calculate.prototype.arrayRemove = function (array, value) {
        var index = null;
        while (index !== -1) {
            index = array.indexOf(value);
            array.splice(index, 1);
        }
        return array;
    };
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for getting the corresponding value.
     * @returns string | number
     */
    Calculate.prototype.getKeyValue = function (key) {
        key = key.toUpperCase();
        if (this.storedData.has(key) !== null) {
            var fInfo = this.storedData.get(key);
            var fText = fInfo.getFormulaText();
            if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
                this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
                fText = fText.substring(1);
                try {
                    fInfo.setParsedFormula(this.parser.parseFormula(fText, key));
                }
                catch (ex) {
                    var args = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    fInfo.setFormulaValue(args.message);
                    return this.storedData.get(key).getFormulaValue();
                }
                try {
                    fInfo.setFormulaValue(this.computeFormula(fInfo.getParsedFormula()));
                }
                catch (ex) {
                    var args = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
                }
            }
            return this.storedData.get(key).getFormulaValue();
        }
        else {
            return this.emptyString;
        }
    };
    Calculate.prototype.getNamedRanges = function () {
        return this.namedRanges;
    };
    /**
     * Adds a named range to the NamedRanges collection.
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @param {number} sheetIndex - Defined scope for the specified name. Default - Workbook scope.
     * @returns boolean
     */
    Calculate.prototype.addNamedRange = function (name, range) {
        var sheetScopeName = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            var family = this.getSheetFamilyItem(this.grid);
            if (!family.parentObjectToToken.get(sheetScopeName[0])) {
                return false;
            }
            name = sheetScopeName[0] + this.sheetToken + sheetScopeName[1].toUpperCase();
        }
        else {
            name = name.toUpperCase();
        }
        this.namedRanges.set(name, range);
        return true;
    };
    /**
     * Remove the specified named range form the named range collection.
     * @param {string} name - Name of the specified named range.
     * @returns boolean
     */
    Calculate.prototype.removeNamedRange = function (name) {
        name = name.toUpperCase();
        if (this.namedRanges.get(name) != null) {
            this.namedRanges.delete(name);
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.convertAlpha = function (col) {
        var arrCol = [];
        var n = 0;
        var charText = 'A';
        while (col > 0) {
            col--;
            var aCharValue = charText.charCodeAt(0);
            arrCol[n] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        return arrCol.join('');
    };
    /** @hidden */
    Calculate.prototype.getCellCollection = function (cellRange) {
        if (cellRange.indexOf(':') < 0 && !this.isCellReference(cellRange)) {
            return cellRange.split(this.getParseArgumentSeparator());
        }
        var i = cellRange.indexOf(':');
        var row1;
        var row2;
        var col1;
        var col2;
        if (i > 0 && this.isChar(cellRange[i - 1])) {
            var k = i - 2;
            while (k >= 0 && this.isDigit(cellRange[k])) {
                k--;
            }
        }
        row1 = this.rowIndex(this.substring(cellRange, 0, i));
        row2 = this.rowIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        col1 = this.colIndex(this.substring(cellRange, 0, i));
        col2 = this.colIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        if (row1 > row2) {
            i = row2;
            row2 = row1;
            row1 = i;
        }
        if (col1 > col2) {
            i = col2;
            col2 = col1;
            col1 = i;
        }
        var cells = [];
        var j;
        var c = 0;
        for (i = row1; i <= row2; i++) {
            for (j = col1; j <= col2; j++) {
                cells[c] = this.emptyString + this.convertAlpha(j) + i.toString();
                c++;
            }
        }
        return cells;
    };
    /**
     * Compute the given formula.
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns string | number
     */
    Calculate.prototype.computeFormula = function (formulaText) {
        var parsedText;
        var lastIndexOfq;
        var formulatResult;
        var nestedFormula = false;
        var fNested;
        if (this.parser.isError) {
            return formulaText;
        }
        if (!this.parser.isFormulaParsed) {
            parsedText = this.parser.parseFormula(formulaText);
        }
        else {
            parsedText = formulaText;
        }
        this.parser.isFormulaParsed = false;
        try {
            lastIndexOfq = this.findLastIndexOfq(parsedText);
            if (lastIndexOfq > 0) {
                nestedFormula = true;
            }
            if (parsedText !== this.emptyString && lastIndexOfq > -1) {
                var i = lastIndexOfq + 1;
                while (i > -1) {
                    if (parsedText[i] !== this.rightBracket) {
                        i++;
                        continue;
                    }
                    var sFormula = parsedText.substring(lastIndexOfq, i + 1);
                    var libFormula = sFormula.split(this.leftBracket)[0].split('q').join(this.emptyString);
                    var args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                        .split(this.getParseArgumentSeparator());
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.name] : this.getFunction(libFormula).apply(void 0, args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        var q = this.findLastIndexOfq(fNested);
                        if (q === 0) {
                            nestedFormula = false;
                        }
                        if (q === -1) {
                            formulatResult = this.computeValue(fNested);
                        }
                        lastIndexOfq = i = q;
                        parsedText = fNested;
                        continue;
                    }
                    break;
                }
            }
            else if (this.formulaErrorStrings.indexOf(parsedText) > -1) {
                formulatResult = parsedText;
            }
            else if (parsedText !== this.emptyString && lastIndexOfq === -1) {
                formulatResult = this.computeValue(parsedText);
            }
        }
        catch (ex) {
            var args = { message: ex.message, exception: ex, isForceCalculable: false, computeForceCalculate: false };
            this.trigger('onFailure', args);
            var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
            formulatResult = (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
        }
        return formulatResult;
    };
    /** @hidden */
    Calculate.prototype.computeSumIfAndAvgIf = function (range) {
        if (isNullOrUndefined(range) || range[0] === this.emptyString || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = range;
        var argCount = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var rangevalue = argArr[0];
        var criteria = argCount > 2 ? argArr[2].trim() : argArr[1].trim();
        criteria = criteria.split(this.tic).join(this.emptyString);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        var opt = this.parser.tokenEqual;
        if (criteria.startsWith('<=')) {
            opt = this.parser.tokenLessEq;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('>=')) {
            opt = this.parser.tokenGreaterEq;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('<>')) {
            opt = this.parser.tokenNotEqual;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('<')) {
            opt = this.parser.tokenLess;
            criteria = criteria.substring(1);
        }
        else if (criteria.startsWith('>')) {
            opt = this.parser.tokenGreater;
            criteria = criteria.substring(1);
        }
        else if (criteria.startsWith('=')) {
            opt = this.parser.tokenEqual;
            criteria = criteria.substring(1);
        }
        var checkCriteria = this.parseFloat(criteria);
        var criteriaRangeArray = argCount === 2 ? rangevalue : argArr[1];
        var sumRange = this.getCellCollection(argArr[0]);
        var criteriaRange = this.getCellCollection(criteriaRangeArray);
        var result = this.getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, opt);
        return [result[0], result[1]];
    };
    /** @hidden */
    Calculate.prototype.computeLookup = function (range) {
        if (range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var checkCrte = [];
        var findMaxVal = [];
        var argArr = range;
        var argCount = argArr.length;
        var criterias = argArr[0].split(this.tic).join(this.emptyString);
        var rangevalue = argArr[1];
        var lookupRangeArray = argCount === 2 ? rangevalue : argArr[2];
        var criteriaRange = this.getCellCollection(argArr[1]);
        var lookupRange = this.getCellCollection(lookupRangeArray);
        for (var i = 0; i < criteriaRange.length; i++) {
            findMaxVal[i] = this.getValueFromArg(criteriaRange[i]).split(this.tic).join('');
        }
        var s = findMaxVal.toString().split(this.getParseArgumentSeparator());
        var maxVal = this.parseFloat(s[s.sort().length - 1]);
        var minVal = this.parseFloat(s[0]);
        for (var j = 0; j < criteriaRange.length; j++) {
            checkCrte[j] = this.getValueFromArg(criteriaRange[j]).split(this.tic).join('');
            if (criterias === checkCrte[j]) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            }
            else if (this.parseFloat(criterias) === this.parseFloat(checkCrte[j])) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            }
            else if (this.parseFloat(criterias) < minVal) {
                return this.getErrorStrings()[CommonErrors.na];
            }
            else if (this.parseFloat(criterias) > maxVal) {
                var index = findMaxVal.indexOf(maxVal.toString());
                return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
            }
        }
        if (findMaxVal.indexOf(criterias) < 0) {
            var temp = [];
            for (var n = 0; n < s.length; n++) {
                if (this.parseFloat(criterias) > this.parseFloat(s[n])) {
                    temp.push(s[n]);
                }
            }
            var index = findMaxVal.indexOf(temp[temp.length - 1]);
            return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
        }
        return this.getErrorStrings()[CommonErrors.na];
    };
    Calculate.prototype.computeVLookup = function (range) {
        var argArr = range;
        var findMaxValue = [];
        var lookupValue = argArr[0].split(this.tic).join('');
        if (lookupValue.indexOf(':') > -1) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        if (this.isCellReference(lookupValue)) {
            lookupValue = this.getValueFromArg(lookupValue);
        }
        if (argArr[1].indexOf(':') < -1) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        var lookupRange = [];
        var firstCol = '';
        var secCol = '';
        if (this.isCellReference(argArr[1])) {
            lookupRange = this.getCellCollection(argArr[1]);
            if (argArr[1].indexOf(':') > -1) {
                var index = argArr[1].indexOf(':');
                for (var i = 0; i < index; i++) {
                    var tempCell = this.isChar(argArr[1][i]) ? argArr[1][i] : '';
                    firstCol = firstCol + tempCell;
                }
                for (var j = index; j < argArr[1].length; j++) {
                    var tempCell2 = this.isChar(argArr[1][j]) ? argArr[1][j] : '';
                    secCol = secCol + tempCell2;
                }
            }
        }
        var lookupCol = this.colIndex(firstCol) + this.parseFloat(argArr[2]);
        if (lookupCol > this.colIndex(secCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        if (lookupCol === this.colIndex(firstCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        var lookupCell = this.convertAlpha(lookupCol);
        argArr[3] = isNullOrUndefined(argArr[3]) ? this.trueValue : argArr[3].split(this.tic).join('');
        var cellValue = '';
        for (var i = 0; i < lookupRange.length; i++) {
            findMaxValue[i] = this.getValueFromArg(lookupRange[i]).split(this.tic).join('');
        }
        var s = findMaxValue.toString().split(this.getParseArgumentSeparator());
        var maxValue = this.parseFloat(s[s.sort().length - 1]);
        var minValue = this.parseFloat(s[0]);
        for (var j = 0; j < lookupRange.length; j++) {
            cellValue = this.getValueFromArg(lookupRange[j]);
            if (argArr[3].toUpperCase() === this.trueValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                }
                else if (this.parseFloat(lookupValue) === this.parseFloat(cellValue)) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                }
                else if (this.parseFloat(lookupValue) < minValue) {
                    return this.getErrorStrings()[CommonErrors.na];
                }
                else if (this.parseFloat(lookupValue) > maxValue) {
                    var index = findMaxValue.indexOf(maxValue.toString());
                    return this.getValueFromArg(lookupCell + index).split(this.tic).join('');
                }
            }
            if (argArr[3] === this.falseValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j);
                }
            }
        }
        return this.getErrorStrings()[CommonErrors.na];
    };
    Calculate.prototype.findWildCardValue = function (lookVal, cellValue) {
        var finalText = '';
        if (lookVal.indexOf('?') > -1) {
            var index = lookVal.indexOf('?');
            var checStr1 = lookVal[index - 1];
            var checStr2 = lookVal[index + 1];
            if (cellValue.indexOf(checStr1) > -1 && cellValue.indexOf(checStr2) > -1) {
                var newIndex = cellValue.indexOf(checStr1);
                if (cellValue[newIndex] === checStr1 && cellValue[newIndex + 2] === checStr2) {
                    finalText = lookVal;
                }
                else {
                    finalText = cellValue;
                }
            }
            else {
                finalText = cellValue;
            }
        }
        else if (lookVal.indexOf('*') > -1) {
            var index = lookVal.indexOf('*');
            var left = '';
            var right = '';
            var compRight = this.falseValue;
            var compLeft = this.falseValue;
            for (var i = index - 1; i >= 0; i--) {
                left = left + lookVal[i];
                compLeft = this.trueValue;
            }
            for (var i = index + 1; i < lookVal.length; i++) {
                right = right + lookVal[i];
                compRight = this.trueValue;
            }
            var leftVal = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            var rightVal = right === '' ? -1 : cellValue.indexOf(right);
            if (leftVal > -1 || rightVal > -1) {
                if (compLeft === this.trueValue) {
                    finalText = (left.split('').reverse().join('') === cellValue.substr(0, left.length)) ? lookVal : cellValue;
                }
                else if (compRight === this.trueValue) {
                    finalText = (right === cellValue.substring(cellValue.length - right.length, cellValue.length)) ? lookVal : cellValue;
                }
            }
            else {
                finalText = cellValue;
            }
        }
        return finalText;
    };
    /** @hidden */
    /* tslint:disable-next-line */
    Calculate.prototype.getComputeSumIfValue = function (criteriaRange, sumRange, criteria, checkCriteria, op) {
        var sum = 0;
        var count = 0;
        switch (op) {
            case this.parser.tokenEqual:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (value === criteria && val === checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLess:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val < checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreater:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val > checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLessEq:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val <= checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreaterEq:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val >= checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenNotEqual:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (value !== criteria && val !== checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
        }
        return [sum, count];
    };
    /** @hidden */
    Calculate.prototype.computeAndOr = function (args, op) {
        var result = op === 'and' ? true : false;
        var value;
        var parseVal;
        if (args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var l = 0, len = args.length; l < len; l++) {
            if (args[l].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        var ranges = args;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.value];
            }
            if (ranges[i].indexOf(':') > -1 && this.isCellReference(ranges[i])) {
                var cells = this.getCellCollection(ranges[i]);
                for (var j = 0; j < cells.length; j++) {
                    if (this.getErrorStrings().indexOf(cells[j]) > -1) {
                        return cells[j];
                    }
                    else if (cells[j][0] === this.tic) {
                        return this.getErrorStrings()[CommonErrors.name];
                    }
                    value = this.getValueFromArg(cells[j]);
                    if (value === '') {
                        value = this.trueValue;
                    }
                    if (this.getErrorStrings().indexOf(value) > -1) {
                        return value;
                    }
                    parseVal = this.parseFloat(value);
                }
            }
            else {
                value = this.getValueFromArg(ranges[i]).split(this.tic).join('').toUpperCase();
                if (this.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                var tempdate = Date.parse(value.split(this.tic).join(''));
                if (!isNaN(tempdate)) {
                    result = true;
                }
                else if (!(value === this.trueValue || value === this.falseValue)) {
                    return this.getErrorStrings()[CommonErrors.value].toString();
                }
                parseVal = this.parseFloat(value);
            }
            result = op === 'and' ? (result && ((value === this.trueValue) || !(isNaN(parseVal)))) :
                (result || ((value === this.trueValue) || !(isNaN(parseVal))));
        }
        return result ? this.trueValue : this.falseValue;
    };
    /** @hidden */
    // To strip out the tic from the formula arguments.
    Calculate.prototype.removeTics = function (text) {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Calculate.prototype.computeValue = function (pFormula) {
        try {
            var stack = [];
            var i = 0;
            var sheet = '';
            stack.length = 0;
            while (i < pFormula.length) {
                var uFound = pFormula[i] === 'u'; // for 3*-2
                if (pFormula[i] === this.arithMarker) {
                    i = i + 1;
                    continue;
                }
                else if (this.isDigit(pFormula[i])) {
                    var s = this.emptyString;
                    while (i < pFormula.length && this.isDigit(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s);
                }
                if (pFormula[i] === this.sheetToken) {
                    sheet = pFormula[i];
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.sheetToken) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                    if (i < pFormula.length) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                }
                else if (this.isUpperChar(pFormula[i])) {
                    var s = this.emptyString;
                    var textName = '';
                    while (i < pFormula.length && this.isUpperChar(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    while (i < pFormula.length && this.isDigit(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    s = sheet + s;
                    textName = this.getParentObjectCellValue(s).toString();
                    if (typeof textName === 'string' && this.getErrorStrings().indexOf(textName) > -1) {
                        return textName;
                    }
                    stack.push(textName);
                }
                else if (pFormula[i] === 'q') {
                    var leftIdx = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    var j = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
                    pFormula = this.substring(pFormula, i + leftIdx + 2, j - 1);
                }
                else if (pFormula[i] === this.tic[0]) {
                    var s = pFormula[i].toString();
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s.split(this.tic).join(this.emptyString));
                    i = i + 1;
                }
                else if (pFormula[i] === '%' && stack.length > 0) {
                    var stackValue = stack[0];
                    var value = this.parseFloat(stackValue);
                    if (!this.isNaN(value)) {
                        stack.pop();
                        stack.push((value / 100).toString());
                    }
                    i = i + 1;
                }
                else if ((pFormula.substring(i)).indexOf(this.trueValue) === 0) {
                    stack.push(this.trueValue);
                    i += this.trueValue.length;
                }
                else if (pFormula.substring(i).indexOf(this.falseValue) === 0) {
                    stack.push(this.falseValue);
                    i += this.falseValue.length;
                }
                else if (pFormula[i] === this.tic[0] || pFormula[i] === '|') {
                    var s = pFormula[i].toString();
                    i++;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s + this.tic);
                    i += 1;
                }
                else {
                    switch (pFormula[i]) {
                        case '#':
                            {
                                var errIndex = 0;
                                if (this.getErrorStrings().indexOf(pFormula.substring(i)) > -1) {
                                    if (pFormula.indexOf('!') === -1 || pFormula.substring(i).indexOf('!') === -1) {
                                        errIndex = pFormula.indexOf('#N/A') > -1 ?
                                            (pFormula.indexOf('#N/A') + 4 + i) : pFormula.indexOf('?') + 1 + i;
                                    }
                                    else {
                                        errIndex = pFormula.indexOf('!') + 1 + i;
                                    }
                                    stack.push(this.substring(pFormula, i, errIndex - i));
                                }
                                else {
                                    errIndex = i + 1;
                                    stack.push(this.substring(pFormula, i, errIndex - i));
                                }
                                i = errIndex;
                            }
                            break;
                        case 'n':
                            {
                                i = i + 1;
                                var s = '';
                                if (pFormula.substring(i).indexOf('Infinity') === 0) {
                                    s = 'Infinity';
                                    i += s.length;
                                }
                                else {
                                    if (pFormula[i] === 'u' || uFound) {
                                        s = '-';
                                        if (!uFound) {
                                            i = i + 1;
                                        }
                                        else {
                                            uFound = false;
                                        }
                                    }
                                    while (i < pFormula.length && (this.isDigit(pFormula[i]))
                                        || pFormula[i] === this.getParseDecimalSeparator()) {
                                        s = s + pFormula[i];
                                        i = i + 1;
                                    }
                                }
                                stack.push(s);
                            }
                            break;
                        case this.parser.tokenAdd:
                            {
                                this.getValArithmetic(stack, 'add');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenSubtract:
                            {
                                this.getValArithmetic(stack, 'sub');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenMultiply:
                            {
                                this.getValArithmetic(stack, 'mul');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenDivide:
                            {
                                this.getValArithmetic(stack, 'div');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenLess:
                            {
                                this.processLogical(stack, 'less');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenGreater:
                            {
                                this.processLogical(stack, 'greater');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenGreaterEq:
                            {
                                this.processLogical(stack, 'greaterEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenLessEq:
                            {
                                this.processLogical(stack, 'lessEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenNotEqual:
                            {
                                this.processLogical(stack, 'notEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenOr:
                            {
                                this.processLogical(stack, 'or');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenAnd:
                            {
                                this.processLogical(stack, 'and');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenEqual:
                            {
                                this.processLogical(stack, 'equal');
                                i = i + 1;
                            }
                            break;
                        default: {
                            return this.getErrorStrings()[CommonErrors.value];
                        }
                    }
                }
            }
            if (stack.length === 0) {
                return this.emptyString;
            }
            else {
                var s = this.emptyString;
                var countValue = stack.length;
                while (countValue > 0) {
                    s = stack.pop() + s;
                    if (s === this.emptyString && this.isCellReference(pFormula) &&
                        this.getTreatEmptyStringAsZero()) {
                        return '0';
                    }
                    countValue--;
                }
                return s;
            }
        }
        catch (ex) {
            if (this.getErrorStrings().indexOf(ex) > -1 || this.formulaErrorStrings.indexOf(ex) > -1) {
                throw ex;
            }
            throw new FormulaError(this.formulaErrorStrings[FormulasErrorsStrings.invalid_expression]);
        }
    };
    Calculate.prototype.getValArithmetic = function (stack, operator) {
        var num1 = stack.pop();
        num1 = num1 === this.emptyString ? '0' : num1;
        var num = parseInt(num1, 10);
        if (this.isNaN(num)) {
            throw this.getErrorStrings()[CommonErrors.value];
        }
        var num2 = stack.pop();
        num2 = num2 === this.emptyString ? '0' : num2;
        num = parseInt(num2, 10);
        if (this.isNaN(num)) {
            throw this.getErrorStrings()[CommonErrors.value];
        }
        if (operator === 'add') {
            stack.push((Number(num2) + Number(num1)).toString());
        }
        if (operator === 'sub') {
            stack.push((Number(num2) - Number(num1)).toString());
        }
        if (operator === 'mul') {
            stack.push((Number(num2) * Number(num1)).toString());
        }
        if (operator === 'div') {
            if (this.isNaN(this.parseFloat(num1)) || this.isNaN(this.parseFloat(num2))) {
                stack.push(this.getErrorStrings()[CommonErrors.value]);
            }
            else if (this.parseFloat(num1) === 0) {
                stack.push(this.getErrorStrings()[CommonErrors.divzero]);
            }
            else {
                stack.push((Number(num2) / Number(num1)).toString());
            }
        }
    };
    /** @hidden */
    Calculate.prototype.processLogical = function (stack, operator) {
        var val1;
        var val2;
        var value1;
        var value2;
        if (operator !== 'and' && operator !== 'equal') {
            val1 = stack.pop();
            val2 = stack.pop();
            value1 = val1.indexOf(this.tic) > -1 ? val1 : this.parseFloat(val1);
            value2 = val2.indexOf(this.tic) > -1 ? val2 : this.parseFloat(val2);
        }
        var result;
        if (operator === 'less') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 < value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) < 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greater') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 > value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) > 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'lessEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 <= value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) <= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greaterEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 >= value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) >= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'notEq') {
            result = (val2 !== val1) ? this.trueValue : this.falseValue;
        }
        if (operator === 'and') {
            val1 = stack.pop().toString();
            val2 = '';
            if (stack.length > 0) {
                val2 = stack.pop().toString();
            }
            result = this.emptyString + val2 + val1 + this.emptyString;
            result = result.split(this.tic).join('');
        }
        if (operator === 'equal') {
            val1 = stack.pop().toString();
            val2 = stack.pop().toString();
            result = val1 === val2 ? this.trueValue : this.falseValue;
        }
        if (operator === 'or') {
            result = Math.pow(this.parseFloat(value2), this.parseFloat(value1)).toString();
        }
        stack.push(result);
        return result;
    };
    /** @hidden */
    Calculate.prototype.computeStoreCells = function (sCell) {
        var cellValue = sCell.cellValue;
        var cellRanges = sCell.cellRange;
        var criterias = sCell.criteria;
        var argArr = sCell.argArray;
        var isCriteria = sCell.isCriteria;
        var storeCell = sCell.storedCells;
        var isCountIfs = sCell.isCountIfS;
        var i = sCell.countVal;
        var rangeLength = isCriteria === this.trueValue ? storeCell : cellValue;
        var tempStoredCell = [];
        for (var j = 0; j < rangeLength.length; j++) {
            var stack = [];
            var cellVal = this.getValueFromArg(cellValue[j]);
            var criteria = void 0;
            var newCell = '';
            criteria = argArr[2].split(this.tic).join(this.emptyString);
            isCriteria = isCountIfs === this.trueValue ? this.trueValue : isCriteria;
            if (isCriteria === this.trueValue) {
                var cell = '';
                var count = 0;
                var newCount = 0;
                storeCell[j] = isCountIfs === this.trueValue && i === 0 ? cellValue[j] : storeCell[j];
                cell = storeCell[j];
                // convert the new cell ranges  for find in range with criteria.
                while (!this.isDigit(cell[count])) {
                    count = count + 1;
                }
                if (this.isCellReference(cellRanges[i]) && cellRanges[i].indexOf(':') > -1) {
                    var k = cellRanges[i].indexOf(':');
                    newCell = this.substring(cellRanges[i], k);
                    while (!this.isDigit(newCell[newCount])) {
                        newCount = newCount + 1;
                    }
                }
                var cellAlpha = this.substring(cell, count);
                var newCellAlpha = this.substring(newCell, newCount);
                newCell = storeCell[j].split(cellAlpha).join(newCellAlpha);
                cellVal = this.getValueFromArg(newCell);
                criteria = isCountIfs === this.trueValue ? criterias[i].split(this.tic).join(this.emptyString) :
                    criterias[i - 1].split(this.tic).join(this.emptyString);
            }
            var op = 'equal';
            if (criteria.startsWith('<=')) {
                op = 'lessEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('>=')) {
                op = 'greaterEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('<>')) {
                op = 'notEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('<')) {
                op = 'less';
                criteria = criteria.substring(1);
            }
            else if (criteria.startsWith('>')) {
                op = 'greater';
                criteria = criteria.substring(1);
            }
            else if (criteria.startsWith('=')) {
                op = 'equal';
                criteria = criteria.substring(1);
            }
            if (criteria.indexOf('*') > -1 || criteria.indexOf('?') > -1) {
                cellVal = this.findWildCardValue(criteria, cellVal);
            }
            stack.push(cellVal.toLowerCase());
            stack.push(criteria.toLowerCase());
            if (this.processLogical(stack, op) === this.trueValue) {
                if (isCriteria === this.falseValue) {
                    tempStoredCell.push(cellValue[j]);
                }
                else {
                    tempStoredCell.push(newCell);
                }
            }
        }
        storeCell = tempStoredCell;
        tempStoredCell = [];
        return storeCell;
    };
    Calculate.prototype.computeIfsFormulas = function (range, isCountIfs, isAvgIfs) {
        if (isNullOrUndefined(range) || range[0] === '' || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = range;
        var argCount = argArr.length;
        if (argCount < 2 || argCount > 127) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var cellRanges = [];
        var criterias = [];
        var storedCell = [];
        var storedCellLength = 0;
        var sum = 0;
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                cellRanges.push(argArr[i]);
            }
            else {
                criterias.push(argArr[i]);
            }
        }
        cellRanges = cellRanges.toString().split(',,').join(',');
        cellRanges = cellRanges.split(this.getParseArgumentSeparator());
        var cellvalue;
        var isCriteria;
        if (isCountIfs === this.falseValue) {
            isCriteria = this.falseValue;
            cellvalue = this.getCellCollection(cellRanges[1]);
            var sCell = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        // Compare criteria and convert the new cell ranges.
        var startRange;
        startRange = isCountIfs === this.trueValue ? 0 : 2;
        for (var i = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i]);
            var sCell = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        for (var j = 0; j < storedCell.length; j++) {
            // convert the new cell ranges  for find sum in range 0(first range)
            var cell = '';
            var newCell = '';
            var count = 0;
            var newCount = 0;
            cell = storedCell[j];
            while (!this.isDigit(cell[count])) {
                count = count + 1;
            }
            if (this.isCellReference(cellRanges[0]) && cellRanges[0].indexOf(':') > -1) {
                var k = cellRanges[0].indexOf(':');
                newCell = this.substring(cellRanges[0], k);
                while (!this.isDigit(newCell[newCount])) {
                    newCount = newCount + 1;
                }
            }
            var cellAlpha = this.substring(cell, count);
            var newCellAlpha = this.substring(newCell, newCount);
            cellvalue = storedCell[j].split(cellAlpha).join(newCellAlpha);
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            }
            else {
                var argValue = this.getValueFromArg(cellvalue);
                sum = sum + parseFloat(argValue === '' ? '0' : argValue);
            }
        }
        if (isAvgIfs === this.trueValue) {
            sum = sum / cellvalue.length;
        }
        return sum;
    };
    Calculate.prototype.processNestedFormula = function (pText, sFormula, fResult) {
        var lastIndexq = this.findLastIndexOfq(pText);
        var interiorCalcFString = pText.split(sFormula).join('n' + fResult);
        return interiorCalcFString;
    };
    /** @hidden */
    Calculate.prototype.isNaN = function (value) {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.fromOADate = function (doubleNumber) {
        var result = new Date();
        result.setTime((doubleNumber * this.millisecondsOfaDay) + Date.parse(this.oaDate.toString()));
        return result;
    };
    /** @hidden */
    Calculate.prototype.getSerialDateFromDate = function (year, month, day) {
        var days = 0;
        if (year < 1900) {
            year += 1900;
        }
        var isValidMonth = false;
        while (!isValidMonth) {
            while (month > 12) {
                year++;
                month -= 12;
            }
            isValidMonth = true;
            var tempDay = new Date(year, month, 1, -1).getDate();
            while (day > tempDay) {
                tempDay = new Date(year, month, 1, -1).getDate();
                month++;
                day -= tempDay;
                isValidMonth = false;
            }
            if (day < 1) {
                month--;
                tempDay = new Date(year, month, 1, -1).getDate();
                day = tempDay - day;
            }
        }
        var dateTime = Date.parse(year.toString() + this.getParseDateTimeSeparator() + month.toString() +
            this.getParseDateTimeSeparator() + day.toString());
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    };
    /** @hidden */
    Calculate.prototype.toOADate = function (dateTime) {
        var result = (dateTime.getTime() - Date.parse(this.oaDate.toString())) / this.millisecondsOfaDay;
        return result;
    };
    /** @hidden */
    Calculate.prototype.calculateDate = function (date) {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    };
    /** @hidden */
    Calculate.prototype.isTextEmpty = function (s) {
        return s === null || s === '';
    };
    /** @hidden */
    Calculate.prototype.isDigit = function (text) {
        var charCode = text.charCodeAt(0);
        if ((charCode > 47) && (charCode < 58)) {
            return true;
        }
        return false;
    };
    Calculate.prototype.findLastIndexOfq = function (fString) {
        return fString.lastIndexOf('q');
    };
    /**
     * To get the exact value from argument.
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns string
     */
    Calculate.prototype.getValueFromArg = function (arg) {
        arg = arg.trim();
        var s = arg;
        var dateTime = this.dateTime1900;
        var pObjCVal = s;
        if (isNullOrUndefined(s) || this.isTextEmpty(s)) {
            return s;
        }
        else if (arg[0] === this.tic || arg[0] === this.singleTic) {
            dateTime = this.isDate(arg.split(this.tic).join(''));
            if (this.isNaN(this.parseFloat(arg.split(this.tic).join(''))) && !isNullOrUndefined(dateTime) &&
                !this.isNaN(dateTime.getDate()) && this.dateTime1900 <= dateTime) {
                return this.toOADate(dateTime).toString();
            }
            return arg;
        }
        else {
            arg = arg.split('u').join('-');
            /* tslint:disable:max-line-length */
            if (!this.isUpperChar(s[0]) && (this.isDigit(s[0]) || s[0] === this.getParseDecimalSeparator() || s[0] === '-' || s[0] === 'n')) {
                if (s[0] === 'n') {
                    s = s.substring(1);
                }
                return s;
            }
        }
        var symbolArray = ['+', '-', '/', '*', ')', ')', '{'];
        if ((this.parser.indexOfAny(s, symbolArray) === -1 && this.isUpperChar(s[0])) || s[0] === this.sheetToken) {
            if (s !== this.trueValue && s !== this.falseValue && this.isCellReference(s)) {
                var f = this.getSheetFamilyItem(this.grid);
                if (f.sheetNameToParentObject !== null && f.sheetNameToParentObject.size > 0 && s.indexOf(this.sheetToken) === -1) {
                    var token = f.parentObjectToToken.get(this.grid);
                    s = token + s;
                }
            }
            if (s === this.cell) {
                var dependent = this.getDependentCells().get(s);
                if (dependent != null && dependent.indexOf(s) > -1) {
                    this.arrayRemove(dependent, s);
                }
                if (!this.getDependentFormulaCells().has(this.cell)) {
                    this.clearFormulaDependentCells(this.cell);
                }
                throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference] + s;
            }
            pObjCVal = this.getParentObjectCellValue(s);
            this.updateDependentCell(s);
            return pObjCVal.toString();
        }
        if (this.getErrorStrings().indexOf(arg) > -1) {
            return arg;
        }
        return this.computeValue(pObjCVal.toString());
    };
    /* tslint:disable-next-line */
    Calculate.prototype.isDate = function (date) {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            var dateval = new Date(Date.parse(date));
            if (dateval >= this.dateTime1900) {
                return dateval;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    Calculate.prototype.isValidCellReference = function (text) {
        var start = 0;
        var end = 0;
        var j = 0;
        var numArr = [89, 71, 69];
        var cellTxt = this.emptyString;
        if (this.namedRanges.has(text)) {
            return false;
        }
        for (var i = 0; i < text.length; i++) {
            if (this.isChar(text[i])) {
                end++;
            }
        }
        cellTxt = text.substring(start, end);
        if (cellTxt.length < 4) {
            while (j < cellTxt.length) {
                if (!isNullOrUndefined(cellTxt[j]) && cellTxt[j].charCodeAt(0) < numArr[j]) {
                    j++;
                    continue;
                }
                else if (isNullOrUndefined(cellTxt[j]) && j > 0) {
                    break;
                }
                else {
                    return false;
                }
            }
            var cellNum = this.parseFloat(text.substring(end, text.length));
            if (cellNum < 1048576) { // Maximum number of rows in excel.
                return true;
            }
        }
        return false;
    };
    /** @hidden */
    /* tslint:disable-next-line */
    Calculate.prototype.parseDate = function (date) {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            var d = parseInt(date, 10);
            if (d < 0) {
                return this.getErrorStrings()[CommonErrors.num];
            }
            if (d <= 60) {
                return new Date(this.dateTime1900.getTime() + (d - 1) * 86400000);
            }
            return new Date(this.dateTime1900.getTime() + (d - 2) * 86400000);
        }
        if (typeof date === 'string') {
            date = new Date(date);
            if (!this.isNaN(date)) {
                return date;
            }
        }
        return this.getErrorStrings()[CommonErrors.value];
    };
    /** @hidden */
    Calculate.prototype.isCellReference = function (args) {
        if (args === this.emptyString) {
            return false;
        }
        args = args.trim();
        args = this.setTokensForSheets(args);
        var sheetToken1 = this.getSheetToken(args);
        var containsBoth = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join(this.emptyString);
        }
        var isAlpha = false;
        var isNum = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        var charArray = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
        for (var c = 0; c < charArray.length; c++) {
            if (this.isChar(charArray[c])) {
                isAlpha = true;
            }
            else if (this.isDigit(charArray[c])) {
                isNum = true;
            }
            else if (charArray[c] === ':') {
                if (isAlpha && isNum) {
                    containsBoth = true;
                }
                isAlpha = false;
                isNum = false;
            }
            else {
                return false;
            }
        }
        if (args.indexOf(':') > -1 && args.indexOf(this.tic) === -1) {
            if (containsBoth && isAlpha && isNum) {
                return true;
            }
            else if (((isAlpha && !isNum) || (!isAlpha && isNum)) && !containsBoth) {
                return true;
            }
            else {
                return false;
            }
        }
        if (isAlpha && isNum && args.indexOf(this.tic) === -1) {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.setTokensForSheets = function (text) {
        var family = this.getSheetFamilyItem(this.grid);
        var sortedSheetNamesCollection = this.getSortedSheetNames();
        if (sortedSheetNamesCollection != null) {
            for (var n = 0; n < sortedSheetNamesCollection.length; n++) {
                var token = family.sheetNameToToken.get(sortedSheetNamesCollection[n]);
                token = token.split(this.sheetToken).join(this.tempSheetPlaceHolder);
                var s = '"' + sortedSheetNamesCollection[n].toUpperCase() + '"' + this.sheetToken;
                if (text.indexOf(s) === -1) {
                    s = sortedSheetNamesCollection[n].toUpperCase() + this.sheetToken;
                }
                text = text.split('SHEET' + s).join(token);
                s = sortedSheetNamesCollection[n].toUpperCase() + this.sheetToken;
                text = text.split(s).join(token);
            }
        }
        text = text.split(this.tempSheetPlaceHolder).join(this.sheetToken);
        return text;
    };
    Calculate.prototype.getParentObjectCellValue = function (val) {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        var i = val.lastIndexOf(this.sheetToken);
        var row = 0;
        var col = 0;
        var grid = this.grid;
        var family = this.getSheetFamilyItem(grid);
        if (i > -1 && family.tokenToParentObject !== null) {
            this.grid = family.tokenToParentObject.get(val.substring(0, i + 1));
            row = this.rowIndex(val);
            col = this.colIndex(val);
        }
        else if (i === -1) {
            var j = 0;
            while (j < val.length && this.isChar(val[j])) {
                j++;
            }
            if (j === val.length) {
                val = val.toLowerCase();
                return this.getErrorStrings()[CommonErrors.name];
            }
            else {
                row = this.rowIndex(val);
                col = this.colIndex(val);
                if (family.isSheetMember && family.parentObjectToToken != null) {
                    val = family.parentObjectToToken.get(this.grid) + val;
                }
            }
        }
        var saveCell = (this.cell === '' || this.cell === null) ? '' : this.cell;
        this.cell = val;
        if (saveCell === this.cell) {
            throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference];
        }
        var cValue = this.getParentCellValue(row, col, this.grid);
        this.grid = grid;
        this.cell = saveCell;
        return cValue;
    };
    Calculate.prototype.getParentCellValue = function (row, col, grd) {
        var cValue;
        /* tslint:disable-next-line */
        if (this.parentObject.getValueRowCol === undefined) {
            cValue = this.getValueRowCol(this.getSheetID(grd) + 1, row, col);
        }
        else {
            /* tslint:disable-next-line */
            cValue = this.parentObject.getValueRowCol(this.getSheetID(grd) + 1, row, col);
            return isNullOrUndefined(cValue) ? this.emptyString : cValue.toString();
        }
        if (cValue === '' || cValue === undefined) {
            cValue = '';
        }
        // if (cValue[cValue.length - 1] == ("%") && !this.isNaN(d)) {
        //     cValue = (Number(d) / 100).toString();
        // }
        return cValue;
    };
    /**
     * Getting the formula result.
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns string
     */
    Calculate.prototype.getValueRowCol = function (grid, row, col) {
        var key = this.rowsToKeyMap.get(row).toString();
        var result = this.getKeyValue(key).toString();
        if (result != null && result[result.length - 1] === ('%') && result.length > 1) {
            var d = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    };
    /**
     * To add custom library formula.
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns void
     */
    Calculate.prototype.defineFunction = function (formulaName, functionName) {
        if (typeof functionName === 'string') {
            functionName = getValue(functionName, window);
        }
        formulaName = formulaName.toUpperCase();
        this.libraryFormulas.set(formulaName, { handler: functionName, isCustom: true });
    };
    /**
     * Specifies when changing the value.
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     */
    Calculate.prototype.valueChanged = function (grid, changeArgs, isCalculate) {
        var pgrid = grid;
        this.grid = grid;
        var isComputedValueChanged = true;
        var isCompute = true;
        var calcFamily = this.getSheetFamilyItem(pgrid);
        var cellTxt = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            var token = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        var argVal = changeArgs.getValue().toUpperCase();
        if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > -1 ||
            argVal.indexOf('RANDBETWEEN(') > -1 || this.randomValues.has(cellTxt)) {
            var randStrVal = this.randCollection.toString();
            if (!this.randomValues.has(cellTxt)) {
                this.randomValues.set(cellTxt, changeArgs.getValue());
                this.randCollection.push(cellTxt);
                this.isRandomVal = true;
            }
            else if (this.randomValues.has(cellTxt)) {
                if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > -1 ||
                    argVal.indexOf('RANDBETWEEN(') > -1) {
                    this.randomValues.set(cellTxt, changeArgs.getValue());
                }
                else if (changeArgs.getValue().toUpperCase() !== this.randomValues.get(cellTxt.toUpperCase())) {
                    this.randomValues.delete(cellTxt);
                    randStrVal = randStrVal.split(cellTxt + this.parseArgumentSeparator).join('').split(this.parseArgumentSeparator + cellTxt).join('').split(cellTxt).join('');
                    this.randCollection = randStrVal.split(this.parseArgumentSeparator);
                }
                if (this.randomValues.size === 0 && this.randCollection.length) {
                    this.isRandomVal = false;
                    this.randomValues.clear();
                    this.randCollection = [];
                }
            }
        }
        if (changeArgs.getValue() && changeArgs.getValue()[0] === this.getFormulaCharacter()) {
            this.cell = cellTxt;
            var formula = void 0;
            if (!isNullOrUndefined(isCompute)) {
                isCompute = isCalculate;
            }
            if (this.getFormulaInfoTable().has(cellTxt)) {
                formula = this.getFormulaInfoTable().get(cellTxt);
                if (changeArgs.getValue() !== formula.getFormulaText() || formula.getParsedFormula() == null) {
                    formula.setFormulaText(changeArgs.getValue());
                    if (this.getDependentFormulaCells().has(this.cell)) {
                        this.clearFormulaDependentCells(this.cell);
                    }
                    try {
                        formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                    }
                    catch (ex) {
                        formula.setFormulaValue(ex);
                        isCompute = false;
                    }
                }
                if (isCompute) {
                    this.parser.isFormulaParsed = true;
                    var cValue = this.computeFormula(formula.getParsedFormula());
                    isComputedValueChanged = (cValue !== formula.getFormulaValue());
                    formula.setFormulaValue(cValue);
                }
            }
            else {
                formula = new FormulaInfo();
                formula.setFormulaText(changeArgs.getValue());
                if (!this.getDependentFormulaCells().has(cellTxt)) {
                    this.getDependentFormulaCells().set(cellTxt, new Map());
                }
                try {
                    formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                }
                catch (ex) {
                    formula.setFormulaValue(ex);
                    isCompute = false;
                }
                if (isCompute) {
                    formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                }
                if (this.getFormulaInfoTable().has(cellTxt)) {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                }
                else {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                }
            }
            if (isCompute) {
                /* tslint:disable */
                if (this.parentObject.setValueRowCol === undefined) {
                    this.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                }
                else {
                    this.parentObject.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                }
                /* tslint:enable */
            }
        }
        else if (this.getFormulaInfoTable().has(cellTxt)) {
            this.getFormulaInfoTable().delete(cellTxt);
            if (this.getDependentFormulaCells().has(cellTxt)) {
                this.clearFormulaDependentCells(cellTxt);
            }
        }
        if (isCompute && isComputedValueChanged && this.getDependentCells().has(cellTxt) &&
            this.getDependentCells().get(cellTxt).toString() !== cellTxt) {
            this.getComputedValue().clear();
            this.refresh(cellTxt);
        }
    };
    /** @hidden */
    Calculate.prototype.getComputedValue = function () {
        if (this.computedValues === null) {
            this.computedValues = new Map();
        }
        return this.computedValues;
    };
    /**
     * @hidden
     */
    Calculate.prototype.setValueRowCol = function (value, formulaValue, row, col) {
        /* No Implementation */
    };
    Calculate.prototype.getSortedSheetNames = function () {
        var family = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            var arr_1 = [];
            family.sheetNameToToken.forEach(function (value, key) {
                arr_1.push(key);
                arr_1.sort();
            });
            this.sortedSheetNames = arr_1;
            this.sortedSheetNames.sort();
        }
        return this.sortedSheetNames;
    };
    /** @hidden */
    Calculate.prototype.getErrorLine = function (error) {
        /* tslint:disable-next-line */
        var errorStack = error.stack ? error.stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    };
    /** @hidden */
    Calculate.prototype.createSheetFamilyID = function () {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    };
    /** @hidden */
    Calculate.prototype.computeMinMax = function (args, operation) {
        var result;
        var argVal;
        var countStrVal = 0;
        if (isNullOrUndefined(args) || args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var k = 0, len = args.length; k < len; k++) {
            if (args[k].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        result = (operation === 'max') ? this.minValue : this.maxValue;
        var argArr = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                var cellValue = this.getCellCollection(argArr[i]);
                for (var j = 0; j < cellValue.length; j++) {
                    argVal = this.getValueFromArg(cellValue[j]);
                    if (this.getErrorStrings().indexOf(argVal) > -1) {
                        return argVal;
                    }
                    var cellVal = this.parseFloat(argVal);
                    if (argVal === '' || this.isNaN(this.parseFloat(cellVal))) {
                        countStrVal = countStrVal + 1;
                        if (countStrVal === cellValue.length) {
                            result = 0;
                        }
                        continue;
                    }
                    else {
                        result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                    }
                }
            }
            else {
                var val = void 0;
                val = this.getValueFromArg(argArr[i]);
                if (this.getErrorStrings().indexOf(val) > -1) {
                    return val;
                }
                var cellVal = this.parseFloat(val);
                if (val === '' || this.isNaN(this.parseFloat(cellVal))) {
                    countStrVal = countStrVal + 1;
                    if (countStrVal === argVal.length) {
                        result = 0;
                    }
                    continue;
                }
                else {
                    result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                }
            }
        }
        return result.toString();
    };
    /** @hidden */
    Calculate.prototype.calculateAvg = function (args) {
        var sumCell = 0;
        var argArr = args;
        var cellVal = [];
        var avgVal = 0;
        var countNum = 0;
        var countNum1 = 0;
        for (var k = 0; k < argArr.length; k++) {
            if (argArr[k].indexOf(':') > -1 && this.isCellReference(argArr[k])) {
                countNum = 0;
                cellVal = this.getCellCollection(argArr[k]);
                avgVal = 0;
                for (var i = 0; i < cellVal.length; i++) {
                    var value = this.getValueFromArg(cellVal[i]);
                    if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                        continue;
                    }
                    avgVal = avgVal + this.parseFloat(value);
                    countNum = countNum + 1;
                }
                if (countNum === 0) {
                    return this.getErrorStrings()[CommonErrors.divzero];
                }
                avgVal = avgVal / countNum;
                sumCell = avgVal + sumCell;
            }
            else {
                if (argArr[k].indexOf(this.tic) > -1) {
                    if (isNaN(parseFloat(argArr[k].split(this.tic).join('')))) {
                        return this.getErrorStrings()[CommonErrors.value];
                    }
                }
                if (argArr[k].length === 0) {
                    argArr[k] = '1';
                }
                var value = this.getValueFromArg(argArr[k].split(this.tic).join(''));
                if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                    return this.getErrorStrings()[CommonErrors.name];
                }
                sumCell = sumCell + this.parseFloat(value);
            }
        }
        return (sumCell / (argArr.length - countNum1)).toString();
    };
    /**
     * @hidden
     */
    Calculate.prototype.registerGridAsSheet = function (refName, model, sheetFamilyID) {
        if (isNullOrUndefined(this.modelToSheetID)) {
            this.modelToSheetID = new Map();
        }
        if (isNullOrUndefined(this.modelToSheetID.get(model))) {
            this.modelToSheetID.set(model, sheetFamilyID);
        }
        var family = this.getSheetFamilyItem(model);
        family.isSheetMember = true;
        var tempRef = refName.toUpperCase();
        if (family.parentObjectToToken.size === 0) {
            family.parentObjectToToken = new Map();
        }
        if (family.sheetNameToParentObject.size === 0) {
            family.sheetNameToParentObject = new Map();
        }
        if (family.sheetNameToToken.size === 0) {
            family.sheetNameToToken = new Map();
        }
        if (family.tokenToParentObject.size === 0) {
            family.tokenToParentObject = new Map();
        }
        if (!isUndefined(family.sheetNameToParentObject.get(tempRef))) {
            var token = family.sheetNameToToken.get(tempRef);
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
        }
        else {
            var token = this.sheetToken + this.tokenCount.toString() + this.sheetToken;
            this.tokenCount++;
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
            family.sheetNameToToken.set(tempRef, token);
            family.sheetNameToParentObject.set(tempRef, model);
        }
        return refName;
    };
    /**
     * @hidden
     */
    Calculate.prototype.unregisterGridAsSheet = function (refName, model) {
        var family = this.getSheetFamilyItem(model);
        var refName1 = refName.toUpperCase();
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.has(refName1)) {
            family.sheetNameToParentObject.delete(refName1);
            var token = family.sheetNameToToken.get(refName1);
            family.sheetNameToToken.delete(refName1);
            family.tokenToParentObject.delete(token);
            family.parentObjectToToken.delete(model);
        }
    };
    
    Calculate.prototype.isSheetMember = function () {
        var family = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    };
    /**
     * To dispose the calculate engine.
     * @returns void
     */
    Calculate.prototype.dispose = function () {
        this.resetKeys();
        // this.dependentCells.clear();
        // this.dependentFormulaCells.clear();
        this.namedRanges.clear();
        // this.sheetFamiliesList.clear();
        this.lFormulas.clear();
    };
    Calculate.prototype.refreshRandValues = function (cellRef) {
        var rowIdx;
        var colIdx;
        var value;
        var tokenRef = '';
        var stringCollection = this.randCollection.toString();
        var family;
        if (this.randomValues.has(cellRef)) {
            this.randomValues.delete(cellRef);
            stringCollection = stringCollection.split(cellRef + this.parseArgumentSeparator).join('').split(this.parseArgumentSeparator + cellRef).join('').split(cellRef).join('');
            if (this.randomValues.size === 0 && stringCollection === '') {
                this.randomValues.clear();
                this.randCollection = [];
            }
            else {
                this.randCollection = stringCollection.split(this.parseArgumentSeparator);
            }
        }
        for (var i = 0; i < this.randomValues.size; i++) {
            rowIdx = this.rowIndex(this.randCollection[i]);
            colIdx = this.colIndex(this.randCollection[i]);
            tokenRef = (parseFloat(this.getSheetToken(this.randCollection[i]).split(this.sheetToken).join('')) + 1).toString();
            family = this.getSheetFamilyItem(tokenRef);
            this.grid = family.sheetNameToParentObject.get(tokenRef);
            value = this.randomValues.get(this.randCollection[i]);
            value = this.computeFormula(value);
            if (this.parentObject.setValueRowCol === undefined) {
                this.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            }
            else {
                this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            }
        }
    };
    Calculate.prototype.refresh = function (cellRef) {
        if (this.dependencyLevel === 0) {
            this.refreshedCells.clear();
        }
        if (this.getDependentCells().has(cellRef) && this.getDependentCells().get(cellRef) !== null) {
            var family = this.getSheetFamilyItem(this.grid);
            this.dependencyLevel = this.dependencyLevel + 1;
            try {
                var dependentCells = this.getDependentCells().get(cellRef);
                var i = void 0;
                for (i = 0; i < dependentCells.length; i++) {
                    var dCell = dependentCells[i];
                    var token = this.getSheetToken(dCell);
                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                    }
                    try {
                        var rowIdx = this.rowIndex(dCell);
                        var colIdx = this.colIndex(dCell);
                        var formulaInfo = this.getFormulaInfoTable().get(dCell);
                        var result = void 0;
                        if (formulaInfo) {
                            this.cell = dCell;
                            if (!this.getComputedValue().has(dCell)) {
                                result = this.computeFormula(formulaInfo.getFormulaText());
                                this.computedValues.set(dCell, result);
                            }
                            else {
                                result = this.getComputedValue().get(dCell);
                            }
                            formulaInfo.setFormulaValue(result);
                        }
                        if (this.parentObject.setValueRowCol === undefined) {
                            this.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        }
                        else {
                            this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        }
                        if (!this.refreshedCells.has(dCell)) {
                            this.refreshedCells.set(dCell, []);
                            this.refresh(dCell);
                        }
                    }
                    catch (ex) {
                        continue;
                    }
                }
            }
            finally {
                this.grid = family.tokenToParentObject.get(this.getSheetToken(cellRef));
                this.dependencyLevel--;
                if (this.dependencyLevel === 0) {
                    this.refreshedCells.clear();
                }
            }
        }
    };
    var Calculate_1;
    __decorate$4([
        Property(true)
    ], Calculate.prototype, "includeBasicFormulas", void 0);
    __decorate$4([
        Event$1()
    ], Calculate.prototype, "onFailure", void 0);
    Calculate = Calculate_1 = __decorate$4([
        NotifyPropertyChanges
    ], Calculate);
    return Calculate;
}(Base));
/** @hidden */
var FormulaError = /** @__PURE__ @class */ (function () {
    function FormulaError(errorMessage, formulaAutoCorrection) {
        this.formulaCorrection = false;
        this.message = errorMessage;
        this.formulaCorrection = formulaAutoCorrection;
    }
    return FormulaError;
}());
/** @hidden */
var FormulaInfo = /** @__PURE__ @class */ (function () {
    function FormulaInfo() {
        /**
         * @hidden
         */
        this.calcID = Number.MIN_VALUE + 1;
        this.calcID1 = Number.MIN_VALUE + 1;
    }
    /**
     * @hidden
     */
    FormulaInfo.prototype.getFormulaText = function () {
        return this.formulaText;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setFormulaText = function (value) {
        this.formulaText = value;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.getFormulaValue = function () {
        return this.formulaValue;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setFormulaValue = function (value) {
        this.formulaValue = value;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.getParsedFormula = function () {
        return this.parsedFormula;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setParsedFormula = function (value) {
        this.parsedFormula = value;
    };
    return FormulaInfo;
}());
/** @hidden */
var CalcSheetFamilyItem = /** @__PURE__ @class */ (function () {
    function CalcSheetFamilyItem() {
        /**
         * @hidden
         */
        this.isSheetMember = false;
        /**
         * @hidden
         */
        this.parentObjectToToken = new Map();
        /**
         * @hidden
         */
        this.sheetDependentCells = new Map();
        /**
         * @hidden
         */
        this.sheetDependentFormulaCells = new Map();
        /**
         * @hidden
         */
        this.sheetNameToParentObject = new Map();
        /**
         * @hidden
         */
        this.sheetNameToToken = new Map();
        /**
         * @hidden
         */
        this.tokenToParentObject = new Map();
        /**
         * @hidden
         */
        this.sheetFormulaInfotable = new Map();
    }
    return CalcSheetFamilyItem;
}());
/**
 * @hidden
 */
function getAlphalabel(col) {
    var cols = [];
    var n = 0;
    var charText = 'A';
    while (col > 0 && n < 9) {
        col--;
        var aCharNo = charText.charCodeAt(0);
        cols[n] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    var chs = [];
    for (var i = 0; i < n; i++) {
        chs[n - i - 1] = cols[i];
    }
    return chs.join('');
}
var ValueChangedArgs = /** @__PURE__ @class */ (function () {
    function ValueChangedArgs(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.getRowIndex = function () {
            return row;
        };
        this.setRowIndex = function (value) {
            row = value;
        };
        this.getColIndex = function () {
            return col;
        };
        this.setColIndex = function (value) {
            col = value;
        };
        this.getValue = function () {
            return value;
        };
        this.setValue = function (value) {
            value = value;
        };
        return this;
    }
    return ValueChangedArgs;
}());

/**
 * Export Calculate Modules.
 */

/**
 * Export calculate modules
 */

/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
var WorkbookFormula = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for formula module in Workbook.
     * @private
     */
    function WorkbookFormula(workbook) {
        this.parent = workbook;
        this.init();
    }
    WorkbookFormula.prototype.init = function () {
        this.addEventListener();
        this.initCalculate();
        this.registerSheet();
        this.initiateDefinedNames();
    };
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    WorkbookFormula.prototype.destroy = function () {
        this.removeEventListener();
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        this.parent = null;
    };
    WorkbookFormula.prototype.addEventListener = function () {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
    };
    WorkbookFormula.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookFormula.prototype.getModuleName = function () {
        return 'workbookFormula';
    };
    WorkbookFormula.prototype.initCalculate = function () {
        this.calculateInstance = new Calculate(this.parent);
        this.calcID = this.calculateInstance.createSheetFamilyID();
        this.calculateInstance.setTreatEmptyStringAsZero(true);
        this.calculateInstance.grid = this.parent.getActiveSheet().id.toString();
    };
    WorkbookFormula.prototype.performFormulaOperation = function (args) {
        var action = args.action;
        var formulas = this.calculateInstance.getLibraryFormulas();
        var formulaInfo = (Array.from(formulas.values()));
        switch (action) {
            case 'getLibraryFormulas':
                args.formulaCollection = Array.from(formulas.keys());
                break;
            case 'getFormulaCategory':
                var collection = ['All'];
                for (var i = 1; i < Array.from(formulas.values()).length; i++) {
                    if (collection.indexOf(formulaInfo[i].category) < 0) {
                        collection.push(formulaInfo[i].category);
                    }
                }
                args.categoryCollection = collection;
                break;
            case 'dropDownSelectFormulas':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectCategory === formulaInfo[i].category) {
                        args.formulaCollection[i] = Array.from(formulas.keys())[i];
                    }
                }
                break;
            case 'getFormulaDescription':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectedList === Array.from(formulas.keys())[i]) {
                        args.description = formulaInfo[i].description;
                    }
                }
                break;
            case 'registerSheet':
                this.registerSheet(args.sheetIndex, args.sheetCount);
                break;
            case 'unRegisterSheet':
                this.unRegisterSheet(args.sheetIndex, args.sheetCount);
                break;
            case 'refreshCalculate':
                args.value = this.autoCorrectFormula(args.value);
                this.refreshCalculate(args.rowIndex, args.colIndex, args.value, args.isFormula, args.sheetIndex);
                break;
            case 'getArgumentSeparator':
                args.argumentSeparator = this.calculateInstance.getParseArgumentSeparator();
                break;
            case 'addDefinedName':
                args.isAdded = this.addDefinedName(args.definedName);
                break;
            case 'removeDefinedName':
                args.isRemoved = this.removeDefinedName(args.definedName, args.scope);
                break;
            case 'initiateDefinedNames':
                this.initiateDefinedNames();
                break;
        }
    };
    WorkbookFormula.prototype.registerSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.registerGridAsSheet(id, id, this.calcID);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.unRegisterSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        this.calculateInstance.tokenCount = 0;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.unregisterGridAsSheet(id, id);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.refreshCalculate = function (rowIdx, colIdx, value, isFormula, sheetIdx) {
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetTab;
        }
        sheetIdx--;
        var sheetName = getSheet(this.parent, sheetIdx).id + '';
        if (isFormula) {
            var cellArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            var referenceCollection = this.calculateInstance.randCollection;
            if (this.calculateInstance.isRandomVal === true) {
                var rowId = void 0;
                var colId = void 0;
                var refValue = '';
                if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
                    referenceCollection.length) {
                    for (var i = 0; i < this.calculateInstance.randomValues.size; i++) {
                        rowId = this.calculateInstance.rowIndex(referenceCollection[i]);
                        colId = this.calculateInstance.colIndex(referenceCollection[i]);
                        refValue = this.calculateInstance.randomValues.get(referenceCollection[i]);
                        sheetName = (parseFloat(this.calculateInstance.getSheetToken(referenceCollection[i]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                        var tempArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        }
        else {
            var family = this.calculateInstance.getSheetFamilyItem(sheetName);
            var cellRef = getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
            if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                cellRef = family.parentObjectToToken.get(sheetName) + cellRef;
            }
            if (this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
                this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                if (this.calculateInstance.getDependentCells().has(cellRef)) {
                    this.calculateInstance.clearFormulaDependentCells(cellRef);
                }
            }
            this.calculateInstance.getComputedValue().clear();
            this.calculateInstance.refresh(cellRef);
            this.calculateInstance.refreshRandValues(cellRef);
        }
    };
    WorkbookFormula.prototype.autoCorrectFormula = function (formula) {
        if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
            formula += ')';
        }
        return formula;
    };
    WorkbookFormula.prototype.initiateDefinedNames = function () {
        var definedNames = this.parent.definedNames;
        var len = definedNames.length;
        var i = 0;
        while (i < len) {
            var definedname = definedNames[i];
            this.addDefinedName(definedname);
            i++;
        }
    };
    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    WorkbookFormula.prototype.addDefinedName = function (definedName) {
        var isAdded = true;
        var sheetIdx = null;
        var name = definedName.name;
        var refersTo = definedName.refersTo;
        if (definedName.scope) {
            sheetIdx = getSheetIndex(this.parent, definedName.scope);
            if (sheetIdx) {
                name = getSheetName(this.parent, sheetIdx - 1) + '!' + name;
            }
        }
        else {
            definedName.scope = '';
        }
        if (!definedName.comment) {
            definedName.comment = '';
        }
        //need to extend once internal sheet value changes done.
        if (this.checkIsNameExist(definedName.name, definedName.scope)) {
            isAdded = false;
        }
        else {
            this.calculateInstance.addNamedRange(name, refersTo[0] === '=' ? refersTo.substr(1) : refersTo);
            if (refersTo[0] !== '=') {
                definedName.refersTo = '=' + refersTo;
            }
            this.parent.definedNames.push(definedName);
        }
        return isAdded;
    };
    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    WorkbookFormula.prototype.removeDefinedName = function (name, scope) {
        var isRemoved = false;
        var index = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            var calcName = name;
            if (scope) {
                var sheetIdx = getSheetIndex(this.parent, scope);
                if (sheetIdx) {
                    calcName = getSheetName(this.parent, sheetIdx - 1) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            this.parent.definedNames.splice(index, 1);
            isRemoved = true;
        }
        return isRemoved;
    };
    WorkbookFormula.prototype.checkIsNameExist = function (name, sheetName) {
        var isExist = this.parent.definedNames.some(function (key) {
            return key.name === name && (sheetName ? key.scope === sheetName : key.scope === '');
        });
        return isExist;
    };
    WorkbookFormula.prototype.getIndexFromNameColl = function (definedName, scope) {
        if (scope === void 0) { scope = ''; }
        var index = -1;
        this.parent.definedNames.filter(function (name, idx) {
            if (name.name === definedName && name.scope === scope) {
                index = idx;
            }
        });
        return index;
    };
    WorkbookFormula.prototype.toFixed = function (value) {
        var num = Number(value);
        if (Math.round(num) !== num) {
            value = num.toFixed(2);
        }
        return value;
    };
    WorkbookFormula.prototype.aggregateComputation = function (args) {
        var sheet = this.parent.getActiveSheet();
        var range = sheet.selectedRange;
        var indexes = getRangeIndexes(range.split(':')[1]);
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = "A1:" + getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex);
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count) {
            return;
        }
        args.Sum = this.toFixed(this.calculateInstance.getFunction('SUM')(range));
        args.Avg = this.toFixed(this.calculateInstance.getFunction('AVERAGE')(range));
        args.Min = this.toFixed(this.calculateInstance.getFunction('MIN')(range));
        args.Max = this.toFixed(this.calculateInstance.getFunction('MAX')(range));
    };
    return WorkbookFormula;
}());

/**
 * The `WorkbookSort` module is used to handle sort action in Spreadsheet.
 */
var WorkbookSort = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for WorkbookSort module.
     */
    function WorkbookSort(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     */
    WorkbookSort.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookSort.prototype.addEventListener = function () {
        this.parent.on(initiateSort, this.initiateSortHandler, this);
    };
    WorkbookSort.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateSort, this.initiateSortHandler);
        }
    };
    /**
     * Sorts range of cells in the sheet.
     * @param args - arguments for sorting.
     */
    WorkbookSort.prototype.initiateSortHandler = function (args) {
        var _this = this;
        var validateArgs = {
            range: args.range,
            isValid: true
        };
        var isSingleCell = false;
        this.parent.notify(validateSortRange, validateArgs);
        if (!validateArgs.isValid) {
            return;
        }
        var sheet = this.parent.getActiveSheet();
        var address = args.range || sheet.selectedRange;
        var range = getSwapRange(getIndexesFromAddress(address));
        var sortOptions = args.sortOptions || { sortDescriptors: {}, containsHeader: true };
        var containsHeader = sortOptions.containsHeader;
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
            range[0] = 0;
            range[1] = 0;
            range[2] = sheet.usedRange.rowIndex - 1;
            range[3] = sheet.usedRange.colIndex;
            isSingleCell = true;
            containsHeader = isNullOrUndefined(sortOptions.containsHeader) ? true : sortOptions.containsHeader;
        }
        var sRIdx = containsHeader ? range[0] + 1 : range[0];
        if ((isNullOrUndefined(args.sortOptions) || isNullOrUndefined(args.sortOptions.containsHeader)) && !isSingleCell) {
            if (!isNullOrUndefined(getCell(range[0], range[1], sheet)) && !isNullOrUndefined(getCell(range[0] + 1, range[1], sheet))) {
                if (typeof getCell(range[0], range[1], sheet).value === typeof getCell(range[0] + 1, range[1], sheet).value) {
                    sRIdx = range[0];
                    containsHeader = false;
                }
                else {
                    sRIdx = range[0] + 1;
                    containsHeader = true;
                }
            }
        }
        var sCIdx;
        var eCIdx;
        var cell = getCellIndexes(sheet.activeCell);
        var header = 'Column ' + getColumnHeaderText(cell[1] + 1);
        var sortDescriptors = sortOptions.sortDescriptors;
        this.getDataRange(range, sheet, containsHeader).then(function (jsonData) {
            var dataManager = new DataManager(jsonData);
            var query = new Query();
            if (Array.isArray(sortDescriptors)) { //multi-column sorting.
                if (!sortDescriptors || sortDescriptors.length === 0) {
                    sortDescriptors = [{ field: header }];
                }
                for (var length_1 = sortDescriptors.length, i = length_1 - 1; i > -1; i--) {
                    if (!sortDescriptors[length_1 - 1].field) {
                        sortDescriptors[length_1 - 1].field = header;
                    }
                    if (!sortDescriptors[i].field) {
                        continue;
                    }
                    var comparerFn = sortDescriptors[i].sortComparer || _this.sortComparer.bind(_this, sortDescriptors[i]);
                    query.sortBy(sortDescriptors[i].field, comparerFn);
                }
            }
            else { //single column sorting.
                if (!sortDescriptors) {
                    sortDescriptors = { field: header };
                }
                if (!sortDescriptors.field) {
                    sortDescriptors.field = header;
                }
                var comparerFn = sortDescriptors.sortComparer || _this.sortComparer.bind(_this, sortDescriptors);
                query.sortBy(sortDescriptors.field, comparerFn);
            }
            dataManager.executeQuery(query).then(function (e) {
                var colName;
                var cell = {};
                Array.prototype.forEach.call(e.result, function (data) {
                    sCIdx = range[1];
                    eCIdx = range[3];
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                        cell = data[colName];
                        setCell(sRIdx, sCIdx, sheet, cell);
                    }
                    sRIdx++;
                });
                var eventArgs = {
                    range: getRangeAddress(range),
                    sortOptions: sortOptions
                };
                _this.parent.trigger('sortComplete', eventArgs);
                _this.parent.notify(sortComplete, eventArgs);
            });
        });
    };
    /**
     * Compares the two cells for sorting.
     * @param sortDescriptor - protocol for sorting.
     * @param x - first cell
     * @param y - second cell
     */
    WorkbookSort.prototype.sortComparer = function (sortDescriptor, x, y) {
        var direction = sortDescriptor.order || '';
        var comparer = DataUtil.fnSort(direction);
        return comparer(x ? x.value : x, y ? y.value : y);
    };
    
    /**
     * Converts the range of cells to json data.
     * @param range - range array
     * @param sheet - model of the sheet
     */
    WorkbookSort.prototype.getDataRange = function (range, sheet, containsHeader) {
        var jsonData = [];
        var sRIdx = containsHeader ? range[0] + 1 : range[0];
        var eRIdx = range[2];
        var sCIdx;
        var eCIdx;
        var rowNum = 0;
        var sheetEx = sheet;
        var option = {
            sheet: sheetEx, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise: new Promise(function (resolve, reject) { resolve((function () { })()); })
        };
        if (sheetEx.isLocalData && (range[0] === 0 || range[0] === 1) && range[2] === (sheet.rowCount - 1)) {
            this.parent.notify('updateSheetFromDataSource', option);
        }
        return option.promise.then(function () {
            for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                sCIdx = range[1];
                eCIdx = range[3];
                var cells = {};
                var colName = '';
                for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                    colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                    cells[colName] = getCell(sRIdx, sCIdx, sheet);
                    jsonData[rowNum.toString()] = cells;
                }
                rowNum++;
            }
            return jsonData;
        });
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookSort.prototype.getModuleName = function () {
        return 'workbookSort';
    };
    return WorkbookSort;
}());

/**
 * Export Spreadsheet library modules
 */

/**
 * Workbook Cell format.
 */
var WorkbookCellFormat = /** @__PURE__ @class */ (function () {
    function WorkbookCellFormat(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WorkbookCellFormat.prototype.format = function (args) {
        var sheet = this.parent.getActiveSheet();
        if (args.range === undefined) {
            args.range = sheet.selectedRange;
        }
        var indexes = args.range.length === 4 ? args.range : getSwapRange(getRangeIndexes(args.range));
        for (var i = indexes[0]; i <= indexes[2]; i++) {
            for (var j = indexes[1]; j <= indexes[3]; j++) {
                setCell(i, j, sheet, { style: args.style }, true);
                this.parent.notify(applyCellFormat, {
                    style: args.style, rowIdx: i, colIdx: j, lastCell: j === indexes[3], isHeightCheckNeeded: true, manualUpdate: true,
                    onActionUpdate: args.onActionUpdate
                });
            }
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (args.refreshRibbon) {
            this.parent.notify(activeCellChanged, getRangeIndexes(sheet.activeCell));
        }
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
    };
    WorkbookCellFormat.prototype.textDecorationActionUpdate = function (args) {
        var sheet = this.parent.getActiveSheet();
        var indexes = getSwapRange(getRangeIndexes(sheet.selectedRange));
        var value = args.style.textDecoration;
        var changedValue = value;
        var activeCellIndexes = getRangeIndexes(sheet.activeCell);
        var cellValue = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
        var changedStyle;
        var removeProp = false;
        if (cellValue === 'underline') {
            changedValue = value === 'underline' ? 'none' : 'underline line-through';
        }
        else if (cellValue === 'line-through') {
            changedValue = value === 'line-through' ? 'none' : 'underline line-through';
        }
        else if (cellValue === 'underline line-through') {
            changedValue = value === 'underline' ? 'line-through' : 'underline';
            removeProp = true;
        }
        if (changedValue === 'none') {
            removeProp = true;
        }
        this.format({ style: { textDecoration: changedValue }, range: activeCellIndexes, refreshRibbon: args.refreshRibbon,
            onActionUpdate: true });
        for (var i = indexes[0]; i <= indexes[2]; i++) {
            for (var j = indexes[1]; j <= indexes[3]; j++) {
                if (i === activeCellIndexes[0] && j === activeCellIndexes[1]) {
                    continue;
                }
                changedStyle = {};
                cellValue = this.parent.getCellStyleValue(['textDecoration'], [i, j]).textDecoration;
                if (cellValue === 'none') {
                    if (removeProp) {
                        continue;
                    }
                    changedStyle.textDecoration = value;
                }
                else if (cellValue === 'underline' || cellValue === 'line-through') {
                    if (removeProp) {
                        if (value === cellValue) {
                            changedStyle.textDecoration = 'none';
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        changedStyle.textDecoration = value !== cellValue ? 'underline line-through' : value;
                    }
                }
                else if (cellValue === 'underline line-through') {
                    if (removeProp) {
                        changedStyle.textDecoration = value === 'underline' ? 'line-through' : 'underline';
                    }
                    else {
                        continue;
                    }
                }
                this.format({ style: changedStyle, range: [i, j, i, j], refreshRibbon: args.refreshRibbon,
                    onActionUpdate: true });
            }
        }
    };
    WorkbookCellFormat.prototype.addEventListener = function () {
        this.parent.on(setCellFormat, this.format, this);
        this.parent.on(textDecorationUpdate, this.textDecorationActionUpdate, this);
    };
    WorkbookCellFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCellFormat, this.format);
            this.parent.off(textDecorationUpdate, this.textDecorationActionUpdate);
        }
    };
    /**
     * To destroy workbook cell format.
     */
    WorkbookCellFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook cell format module name.
     */
    WorkbookCellFormat.prototype.getModuleName = function () {
        return 'workbookcellformat';
    };
    return WorkbookCellFormat;
}());

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
var WorkbookEdit = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    function WorkbookEdit(workbook) {
        this.parent = workbook;
        this.localeObj = getNumericObject(this.parent.locale);
        /* tslint:disable:no-any */
        this.decimalSep = this.localeObj.decimal;
        this.addEventListener();
    }
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    WorkbookEdit.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookEdit.prototype.addEventListener = function () {
        this.parent.on(workbookEditOperation, this.performEditOperation, this);
    };
    WorkbookEdit.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookEditOperation, this.performEditOperation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookEdit.prototype.getModuleName = function () {
        return 'workbookEdit';
    };
    WorkbookEdit.prototype.performEditOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'updateCellValue':
                this.updateCellValue(args.address, args.value, args.sheetIndex, args.isValueOnly);
                break;
        }
    };
    WorkbookEdit.prototype.checkDecimalPoint = function (value) {
        if (Number(value)) {
            var decIndex = value.toString().indexOf(this.decimalSep) + 1;
            var checkDec = value.toString().substr(decIndex).length <= 6;
            value = checkDec ? decIndex < 7 ? value : (parseFloat(value)).toFixed(0) : decIndex > 7 ? (parseFloat(value)).toFixed(0) :
                (parseFloat(value)).toFixed(6 - decIndex + 2);
        }
        return value;
    };
    WorkbookEdit.prototype.updateCellValue = function (address, value, sheetIdx, isValueOnly) {
        if (isValueOnly === void 0) { isValueOnly = false; }
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetTab;
        }
        var range;
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        }
        else {
            range = address;
        }
        var sheet = getSheet(this.parent, sheetIdx - 1);
        if (!sheet.rows[range[0]]) {
            sheet.rows[range[0]] = {};
            sheet.rows[range[0]].cells = [];
        }
        if (!sheet.rows[range[0]].cells[range[1]]) {
            sheet.rows[range[0]].cells[range[1]] = {};
        }
        var cell = getCell(range[0], range[1], sheet);
        if (!isValueOnly) {
            var isFormula = checkIsFormula(value);
            if (!isFormula) {
                cell.formula = '';
                cell.value = value;
            }
            var eventArgs = {
                action: 'refreshCalculate',
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            if (isFormula) {
                cell.formula = eventArgs.value;
                value = cell.value;
            }
            var dateEventArgs = {
                value: value,
                rowIndex: range[0],
                colIndex: range[1],
                sheetIndex: sheetIdx,
                updatedVal: ''
            };
            this.parent.notify(checkDateFormat, dateEventArgs);
            if (!isNullOrUndefined(dateEventArgs.updatedVal)) {
                cell.value = dateEventArgs.updatedVal;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
            }
        }
        else {
            if (value.toString().indexOf(this.decimalSep) > -1) {
                value = this.checkDecimalPoint(value);
            }
            cell.value = value;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
        this.parent.setUsedRange(range[0], range[1]);
    };
    return WorkbookEdit;
}());

/**
 * Export Workbook action modules
 */

/**
 * Workbook basic module.
 * @private
 */
var WorkbookBasicModule = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Workbook basic module.
     * @private
     */
    function WorkbookBasicModule() {
        Workbook.Inject(DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookSort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    WorkbookBasicModule.prototype.getModuleName = function () {
        return 'workbookBasic';
    };
    /**
     * Destroys the Workbook basic module.
     * @return {void}
     */
    WorkbookBasicModule.prototype.destroy = function () {
        /* code snippet */
    };
    return WorkbookBasicModule;
}());

/**
 * Workbook all module.
 * @private
 */
var WorkbookAllModule = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Workbook all module.
     * @private
     */
    function WorkbookAllModule() {
        Workbook.Inject(DataBind, WorkbookSave, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookOpen, WorkbookSort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    WorkbookAllModule.prototype.getModuleName = function () {
        return 'workbook-all';
    };
    /**
     * Destroys the Workbook all module.
     * @return {void}
     */
    WorkbookAllModule.prototype.destroy = function () {
        /* code snippet */
    };
    return WorkbookAllModule;
}());

/**
 * To get Workbook required modules.
 * @hidden
 * @param {Workbook} context
 */
function getWorkbookRequiredModules(context, modules) {
    if (modules === void 0) { modules = []; }
    modules.push({ member: 'workbookBasic', args: [] });
    modules.push({ member: 'workbookAll', args: [] });
    modules.push({
        member: 'dataBind',
        args: [context]
    });
    if (context.allowSave) {
        modules.push({
            member: 'workbookSave',
            args: [context]
        });
    }
    if (context.allowOpen) {
        modules.push({
            member: 'workbookOpen',
            args: [context]
        });
    }
    if (context.allowEditing) {
        modules.push({
            member: 'workbookEdit',
            args: [context]
        });
        modules.push({
            member: 'workbookFormula',
            args: [context]
        });
    }
    if (context.allowNumberFormatting) {
        modules.push({
            member: 'workbookNumberFormat',
            args: [context]
        });
    }
    if (context.allowCellFormatting) {
        modules.push({
            member: 'workbookcellformat',
            args: [context]
        });
    }
    return modules;
}

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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the cell style.
 */
var CellStyle = /** @__PURE__ @class */ (function (_super) {
    __extends$6(CellStyle, _super);
    function CellStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property('Calibri')
    ], CellStyle.prototype, "fontFamily", void 0);
    __decorate$5([
        Property('bottom')
    ], CellStyle.prototype, "verticalAlign", void 0);
    __decorate$5([
        Property('left')
    ], CellStyle.prototype, "textAlign", void 0);
    __decorate$5([
        Property('0pt')
    ], CellStyle.prototype, "textIndent", void 0);
    __decorate$5([
        Property('#000000')
    ], CellStyle.prototype, "color", void 0);
    __decorate$5([
        Property('#ffffff')
    ], CellStyle.prototype, "backgroundColor", void 0);
    __decorate$5([
        Property('normal')
    ], CellStyle.prototype, "fontWeight", void 0);
    __decorate$5([
        Property('normal')
    ], CellStyle.prototype, "fontStyle", void 0);
    __decorate$5([
        Property('11pt')
    ], CellStyle.prototype, "fontSize", void 0);
    __decorate$5([
        Property('none')
    ], CellStyle.prototype, "textDecoration", void 0);
    return CellStyle;
}(ChildProperty));
/**
 * Represents the DefineName.
 */
var DefineName = /** @__PURE__ @class */ (function (_super) {
    __extends$6(DefineName, _super);
    function DefineName() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property('')
    ], DefineName.prototype, "name", void 0);
    __decorate$5([
        Property('')
    ], DefineName.prototype, "scope", void 0);
    __decorate$5([
        Property('')
    ], DefineName.prototype, "comment", void 0);
    __decorate$5([
        Property('')
    ], DefineName.prototype, "refersTo", void 0);
    return DefineName;
}(ChildProperty));

/**
 * Check whether the text is formula or not.
 * @param text
 */
function checkIsFormula(text) {
    return text && text[0] === '=' && text.length > 1;
}

/**
 * Common tasks.
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
 * Represents the cell.
 */
var Cell = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Cell, _super);
    function Cell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        Property('')
    ], Cell.prototype, "value", void 0);
    __decorate$3([
        Property('')
    ], Cell.prototype, "formula", void 0);
    __decorate$3([
        Property(0)
    ], Cell.prototype, "index", void 0);
    __decorate$3([
        Property('General')
    ], Cell.prototype, "format", void 0);
    __decorate$3([
        Complex({}, CellStyle)
    ], Cell.prototype, "style", void 0);
    return Cell;
}(ChildProperty));
/**
 * @hidden
 */
function getCell(rowIndex, colIndex, sheet, isInitRow) {
    var row = getRow(sheet, rowIndex);
    if (!row || !row.cells) {
        if (isInitRow) {
            if (!row) {
                sheet.rows[rowIndex] = { cells: [] };
            }
            else {
                sheet.rows[rowIndex].cells = [];
            }
        }
        else {
            return null;
        }
    }
    return sheet.rows[rowIndex].cells[colIndex];
}
/**
 * @hidden
 */
function setCell(rowIndex, colIndex, sheet, cell, isExtend) {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = { cells: [] };
    }
    else if (!sheet.rows[rowIndex].cells) {
        sheet.rows[rowIndex].cells = [];
    }
    if (isExtend && sheet.rows[rowIndex].cells[colIndex]) {
        extend(sheet.rows[rowIndex].cells[colIndex], cell, null, true);
    }
    else {
        sheet.rows[rowIndex].cells[colIndex] = cell;
    }
}
/**
 * @hidden
 */
function getCellPosition(sheet, indexes) {
    var i;
    var top = 0;
    var left = 0;
    for (i = 0; i < indexes[0]; i++) {
        top += getRowsHeight(sheet, i);
    }
    for (i = 0; i < indexes[1]; i++) {
        left += getColumnsWidth(sheet, i);
    }
    return { top: top, left: left };
}
/** @hidden */
function skipDefaultValue(style, defaultKey) {
    var defaultProps = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' };
    var changedProps = {};
    Object.keys(defaultKey ? defaultProps : style).forEach(function (propName) {
        if (style[propName] !== defaultProps[propName]) {
            changedProps[propName] = style[propName];
        }
    });
    return changedProps;
}

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
 * Configures the Row behavior for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                rows: [{
 *                        index: 30,
 *                        cells: [{ index: 4, value: 'Total Amount:' },
 *                               { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
var Row = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Row, _super);
    function Row() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Collection([], Cell)
    ], Row.prototype, "cells", void 0);
    __decorate$2([
        Property(0)
    ], Row.prototype, "index", void 0);
    __decorate$2([
        Property(20)
    ], Row.prototype, "height", void 0);
    __decorate$2([
        Property(false)
    ], Row.prototype, "customHeight", void 0);
    return Row;
}(ChildProperty));
/**
 * @hidden
 */
function getRow(sheet, rowIndex) {
    return sheet.rows[rowIndex];
}
/** @hidden */
function setRow(sheet, rowIndex, row) {
    if (!sheet.rows[rowIndex]) {
        sheet.rows[rowIndex] = {};
    }
    Object.keys(row).forEach(function (key) {
        sheet.rows[rowIndex][key] = row[key];
    });
}
/**
 * @hidden
 */
function getRowHeight(sheet, rowIndex) {
    if (sheet && sheet.rows && sheet.rows[rowIndex] && (sheet.rows[rowIndex].height || sheet.rows[rowIndex].customHeight)) {
        return sheet.rows[rowIndex].height;
    }
    else {
        return 20;
    }
}
/**
 * @hidden
 */
function setRowHeight(sheet, rowIndex, height) {
    if (sheet && sheet.rows) {
        if (!sheet.rows[rowIndex]) {
            sheet.rows[rowIndex] = {};
        }
        sheet.rows[rowIndex].height = height;
    }
}
/**
 * @hidden
 */
function getRowsHeight(sheet, startRow, endRow) {
    if (endRow === void 0) { endRow = startRow; }
    var height = 0;
    var swap;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (var i = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i);
    }
    return height;
}

var __extends$7 = (undefined && undefined.__extends) || (function () {
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
/**
 * Configures the Column behavior for the spreadsheet.
 */
var Column = /** @__PURE__ @class */ (function (_super) {
    __extends$7(Column, _super);
    function Column() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property(0)
    ], Column.prototype, "index", void 0);
    __decorate$6([
        Property(64)
    ], Column.prototype, "width", void 0);
    __decorate$6([
        Property(false)
    ], Column.prototype, "customWidth", void 0);
    return Column;
}(ChildProperty));
/**
 * @hidden
 */
function getColumn(sheet, colIndex) {
    if (sheet.columns) {
        if (!sheet.columns[colIndex]) {
            sheet.columns[colIndex] = {};
        }
    }
    else {
        sheet.columns = [];
        sheet.columns[colIndex] = {};
    }
    return sheet.columns[colIndex];
}
/**
 * @hidden
 */
function getColumnWidth(sheet, index) {
    if (sheet && sheet.columns && sheet.columns[index] && (sheet.columns[index].width || sheet.columns[index].customWidth)) {
        return sheet.columns[index].width;
    }
    else {
        return 64;
    }
}
/**
 * @hidden
 */
function getColumnsWidth(sheet, startCol, endCol) {
    if (endCol === void 0) { endCol = startCol; }
    var width = 0;
    if (startCol > endCol) {
        var swap = startCol;
        startCol = endCol;
        endCol = swap;
    }
    for (var i = startCol; i <= endCol; i++) {
        width += getColumnWidth(sheet, i);
    }
    return width;
}

/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
function getData(context, address) {
    return new Promise(function (resolve, reject) {
        resolve((function () {
            var i;
            var row;
            var data = new Map();
            var sheet = getSheet(context, getSheetIndex(context, getSheetNameFromAddress(address)));
            var indexes = getIndexesFromAddress(address);
            var sRow = indexes[0];
            var args = {
                sheet: sheet, indexes: indexes, promise: new Promise(function (resolve, reject) { resolve((function () { })()); })
            };
            context.notify('updateSheetFromDataSource', args);
            return args.promise.then(function () {
                while (sRow <= indexes[2]) {
                    row = getRow(sheet, sRow);
                    i = indexes[1];
                    while (i <= indexes[3]) {
                        data.set(getCellAddress(sRow, i), row ? getCell(sRow, i, sheet) : null);
                        i++;
                    }
                    sRow++;
                }
                return data;
            });
        })());
    });
}
/**
 * @hidden
 */
function getModel(model, idx) {
    var diff;
    var j;
    var prevIdx;
    if (isUndefined(model[idx]) || !(model[idx] && model[idx].index === idx)) {
        for (var i = 0; i <= idx; i++) {
            if (model && model[i]) {
                diff = model[i].index - i;
                if (diff > 0) {
                    model.forEach(function (value, index) {
                        if (value && value.index) {
                            prevIdx = value.index;
                            j = 1;
                        }
                        if (value && !value.index && index !== 0) {
                            value.index = prevIdx + j;
                        }
                        j++;
                    });
                    while (diff--) {
                        model.splice(i, 0, null);
                    }
                    i += diff;
                }
            }
            else if (model) {
                model[i] = null;
            }
            else {
                model = [];
            }
        }
    }
    return model[idx];
}
/**
 * @hidden
 */
function processIdx(model, isSheet, context) {
    var j;
    var diff;
    var cnt;
    var len = model.length;
    for (var i = 0; i < len; i++) {
        cnt = diff = model[i].index - i;
        model[i].index = null;
        if (diff > 0) {
            j = 0;
            while (diff--) {
                if (isSheet) {
                    context.createSheet(i + j);
                    j++;
                }
                else {
                    model.splice(i, 0, null);
                }
            }
            i += cnt;
            len += cnt;
        }
        if (isSheet) {
            model[i].id = getMaxSheetId(context.sheets);
            if (!model[i].name) {
                model[i].name = 'Sheet' + getSheetNameCount(context);
            }
        }
    }
    if (isSheet) {
        context.setProperties({ 'sheets': context.sheets }, true);
    }
}
/**
 * @hidden
 */
function clearRange(context, address, sheetIdx, valueOnly) {
    var sheet = getSheet(context, sheetIdx - 1);
    var range = getIndexesFromAddress(address);
    var sRIdx = range[0];
    var eRIdx = range[2];
    var sCIdx;
    var eCIdx;
    for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
        sCIdx = range[1];
        eCIdx = range[3];
        for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
            var cell = getCell(sRIdx, sCIdx, sheet);
            if (!isNullOrUndefined(cell) && valueOnly) {
                delete cell.value;
                if (!isNullOrUndefined(cell.formula)) {
                    delete cell.formula;
                }
            }
        }
    }
}

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
/**
 * Configures the Range settings for the spreadsheet.
 *  ```html
 * <div id='Spreadsheet'></div>
 * ```
 * ```typescript
 * let spreadsheet: Spreadsheet = new Spreadsheet({
 *      sheets: [{
 *                  name: 'First Sheet',
 *                  rangeSettings: [{ dataSource: defaultData }],
 *                  rows: [{
 *                          index: 30,
 *                          cells: [{ index: 4, value: 'Total Amount:' },
 *                                  { formula: '=SUM(F2:F30)', style: { fontWeight: 'bold' } }]
 *                  }]
 * ...
 * });
 * spreadsheet.appendTo('#Spreadsheet');
 * ```
 */
var RangeSetting = /** @__PURE__ @class */ (function (_super) {
    __extends$1(RangeSetting, _super);
    function RangeSetting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], RangeSetting.prototype, "dataSource", void 0);
    __decorate$1([
        Property('A1')
    ], RangeSetting.prototype, "startCell", void 0);
    __decorate$1([
        Property(null)
    ], RangeSetting.prototype, "query", void 0);
    __decorate$1([
        Property(true)
    ], RangeSetting.prototype, "showFieldAsHeader", void 0);
    return RangeSetting;
}(ChildProperty));
/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
var UsedRange = /** @__PURE__ @class */ (function (_super) {
    __extends$1(UsedRange, _super);
    function UsedRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(0)
    ], UsedRange.prototype, "rowIndex", void 0);
    __decorate$1([
        Property(0)
    ], UsedRange.prototype, "colIndex", void 0);
    return UsedRange;
}(ChildProperty));
/**
 * Configures the sheet behavior for the spreadsheet.
 */
var Sheet = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Sheet, _super);
    function Sheet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(0)
    ], Sheet.prototype, "id", void 0);
    __decorate$1([
        Collection([], Row)
    ], Sheet.prototype, "rows", void 0);
    __decorate$1([
        Collection([], Column)
    ], Sheet.prototype, "columns", void 0);
    __decorate$1([
        Collection([], RangeSetting)
    ], Sheet.prototype, "rangeSettings", void 0);
    __decorate$1([
        Property(0)
    ], Sheet.prototype, "index", void 0);
    __decorate$1([
        Property('')
    ], Sheet.prototype, "name", void 0);
    __decorate$1([
        Property(100)
    ], Sheet.prototype, "rowCount", void 0);
    __decorate$1([
        Property(100)
    ], Sheet.prototype, "colCount", void 0);
    __decorate$1([
        Property('A1')
    ], Sheet.prototype, "selectedRange", void 0);
    __decorate$1([
        Property('A1')
    ], Sheet.prototype, "activeCell", void 0);
    __decorate$1([
        Complex({}, UsedRange)
    ], Sheet.prototype, "usedRange", void 0);
    __decorate$1([
        Property('A1')
    ], Sheet.prototype, "topLeftCell", void 0);
    __decorate$1([
        Property(true)
    ], Sheet.prototype, "showHeaders", void 0);
    __decorate$1([
        Property(true)
    ], Sheet.prototype, "showGridLines", void 0);
    return Sheet;
}(ChildProperty));
/**
 * To get sheet index from address.
 * @hidden
 */
function getSheetIndex(context, name) {
    var idx;
    for (var i = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].name === name) {
            idx = i;
            break;
        }
    }
    return idx;
}
/**
 * To get sheet index from address.
 * @hidden
 */
function getSheetIndexFromId(context, id) {
    var idx;
    for (var i = 0; i < context.sheets.length; i++) {
        if (context.sheets[i].id === id) {
            idx = i;
            break;
        }
    }
    return idx + 1;
}
/**
 * To get sheet name from address.
 * @hidden
 */
function getSheetNameFromAddress(address) {
    return address.split('!')[0];
}
/**
 * update selected range
 * @hidden
 */
function updateSelectedRange(context, range, sheet) {
    if (sheet === void 0) { sheet = {}; }
    sheet.selectedRange = range;
    context.setProperties({ 'sheets': context.sheets }, true);
}
/**
 * get selected range
 * @hidden
 */
function getSelectedRange(sheet) {
    return sheet && sheet.selectedRange || 'A1';
}
/**
 * @hidden
 */
function getSheet(context, idx) {
    return context.sheets[idx];
}
/**
 * @hidden
 */
function getSheetNameCount(context) {
    var name = [];
    context.sheets.forEach(function (sheet) {
        name.push(sheet.name.toLowerCase());
    });
    for (var i = 0; i < name.length; i++) {
        if (name.indexOf('sheet' + context.sheetNameCount) > -1) {
            context.sheetNameCount++;
        }
        else {
            return context.sheetNameCount++;
        }
    }
    return context.sheetNameCount++;
}
/**
 * @hidden
 */
function getMaxSheetId(sheets) {
    var cnt = 0;
    sheets.forEach(function (sheet) {
        cnt = Math.max(sheet.id, cnt);
    });
    return cnt + 1;
}
/**
 * @hidden
 */
function initSheet(context) {
    context.sheets.forEach(function (sheet) {
        processIdx(sheet.columns);
        initRow(sheet.rows);
    });
    processIdx(context.sheets, true, context);
}
function initRow(rows) {
    rows.forEach(function (row) {
        if (row.cells) {
            processIdx(row.cells);
        }
    });
    processIdx(rows);
}
/**
 * get sheet name
 * @hidden
 */
function getSheetName(context, idx) {
    if (idx === void 0) { idx = context.activeSheetTab; }
    return getSheet(context, idx - 1).name;
}

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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Workbook.
 */
var Workbook = /** @__PURE__ @class */ (function (_super) {
    __extends(Workbook, _super);
    /**
     * Constructor for initializing the library.
     * @param options - Configures Workbook model.
     */
    function Workbook(options) {
        var _this = _super.call(this, options) || this;
        /**
         * To generate sheet name based on sheet count.
         * @hidden
         */
        _this.sheetNameCount = 1;
        _this.commonCellStyle = {};
        if (options && options.cellStyle) {
            _this.commonCellStyle = options.cellStyle;
        }
        if (_this.getModuleName() === 'workbook') {
            _this.dataBind();
            _this.initEmptySheet();
        }
        return _this;
    }
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    Workbook.prototype.preRender = function () {
        if (!Object.keys(this.commonCellStyle).length) {
            this.commonCellStyle = skipDefaultValue(this.cellStyle, true);
        }
        if (this.getModuleName() === 'spreadsheet') {
            this.initEmptySheet();
        }
    };
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    Workbook.prototype.render = function () {
        /** code snippets */
    };
    /**
     * To provide the array of modules needed for workbook.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Workbook.prototype.requiredModules = function () {
        return getWorkbookRequiredModules(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    Workbook.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    Workbook.prototype.cellFormat = function (style, range) {
        var sheet = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
    };
    /** @hidden */
    Workbook.prototype.getCellStyleValue = function (cssProps, indexes) {
        var _this = this;
        var cell = getCell(indexes[0], indexes[1], this.getActiveSheet());
        var style = {};
        cssProps.forEach(function (cssProp) {
            style[cssProp] = _this.cellStyle[cssProp];
            if (cell && cell.style && cell.style[cssProp]) {
                style[cssProp] = cell.style[cssProp];
            }
        });
        return style;
    };
    /**
     * Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     * @param {string} format - Specifies the number format code.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    Workbook.prototype.numberFormat = function (format, range) {
        this.notify(applyNumberFormatting, { format: format, range: range });
    };
    /**
     * Used to create new sheet.
     * @hidden
     */
    Workbook.prototype.createSheet = function (index) {
        var sheet = new Sheet(this, 'sheets', { id: getMaxSheetId(this.sheets), name: 'Sheet' + getSheetNameCount(this) }, true);
        if (index > -1) {
            this.sheets.splice(index, 0, sheet);
        }
        else {
            this.sheets.push(sheet);
        }
        this.setProperties({ 'sheet': this.sheets }, true);
        this.notify(sheetCreated, { sheetIndex: index | 0 });
        this.notify(workbookFormulaOperation, { action: 'registerSheet', sheetIndex: this.sheets.length - 1 });
    };
    /**
     * Used to remove sheet.
     * @hidden
     */
    Workbook.prototype.removeSheet = function (idx) {
        this.sheets.splice(idx, 1);
    };
    /**
     * Destroys the Workbook library.
     */
    Workbook.prototype.destroy = function () {
        this.notify(workbookDestroyed, null);
        _super.prototype.destroy.call(this);
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {WorkbookModel} newProp
     * @param  {WorkbookModel} oldProp
     * @returns void
     * @hidden
     */
    Workbook.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cellStyle':
                    merge(this.commonCellStyle, skipDefaultValue(newProp.cellStyle));
                    break;
            }
        }
    };
    /**
     * Not applicable for workbook.
     * @hidden
     */
    Workbook.prototype.appendTo = function (selector) {
        _super.prototype.appendTo.call(this, selector);
    };
    Workbook.prototype.initEmptySheet = function () {
        var len = this.sheets.length;
        if (len) {
            initSheet(this);
        }
        else {
            this.createSheet();
        }
    };
    /** @hidden */
    Workbook.prototype.getActiveSheet = function () {
        return this.sheets[this.activeSheetTab - 1];
    };
    /**
     * Used for setting the used range row and column index.
     * @hidden
     */
    Workbook.prototype.setUsedRange = function (rowIdx, colIdx) {
        var sheet = this.getActiveSheet();
        if (rowIdx > sheet.usedRange.rowIndex) {
            sheet.usedRange.rowIndex = rowIdx;
            this.setProperties({ 'sheets': this.sheets }, true);
            this.notify(updateUsedRange, { index: rowIdx, update: 'row' });
        }
        if (colIdx > sheet.usedRange.colIndex) {
            sheet.usedRange.colIndex = colIdx;
            this.setProperties({ 'sheets': this.sheets }, true);
            this.notify(updateUsedRange, { index: colIdx, update: 'col' });
        }
    };
    /** @hidden */
    Workbook.prototype.getRangeData = function (cellIndexes, sheetIdx) {
        var sheet;
        if (sheetIdx) {
            sheet = getSheet(this, sheetIdx - 1);
        }
        else {
            sheet = this.getActiveSheet();
        }
        var row = cellIndexes[0];
        var col = cellIndexes[1];
        var values = '';
        if (sheet.rows[row] && sheet.rows[row].cells[col]) {
            values = sheet.rows[row].cells[col].value;
        }
        return values;
    };
    /**
     * Gets the range of data as JSON from the specified address.
     * @param {string} address - Specifies the address for range of cells.
     */
    Workbook.prototype.getData = function (address) {
        return getData(this, address);
    };
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    Workbook.prototype.getModuleName = function () {
        return 'workbook';
    };
    /** @hidden */
    Workbook.prototype.getValueRowCol = function (sheetIndex, rowIndex, colIndex) {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        var sheet = getSheet(this, sheetIndex - 1);
        var cell = getCell(rowIndex - 1, colIndex - 1, sheet);
        return (cell && cell.value) || '';
    };
    /** @hidden */
    Workbook.prototype.setValueRowCol = function (sheetIndex, value, rowIndex, colIndex) {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(workbookEditOperation, {
            action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
            sheetIndex: sheetIndex, isValueOnly: true
        });
    };
    /**
     * Opens the specified excel file or stream.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    Workbook.prototype.open = function (options) {
        this.notify(workbookOpen, options);
    };
    /**
     * Saves the Spreadsheet data to Excel file.
     * @param {SaveOptions} saveOptions - Options for saving the excel file.
     */
    Workbook.prototype.save = function (saveOptions) {
        if (saveOptions === void 0) { saveOptions = {}; }
        if (this.allowSave) {
            var defaultProps = {
                url: this.saveUrl,
                fileName: saveOptions.fileName || 'Sample',
                saveType: 'Xlsx'
            };
            var eventArgs = __assign({}, defaultProps, saveOptions, { customParams: {}, isFullPost: true, needBlobData: false, cancel: false });
            this.trigger('beforeSave', eventArgs);
            if (!eventArgs.cancel) {
                this.notify(beginSave, {
                    saveSettings: eventArgs, isFullPost: eventArgs.isFullPost,
                    needBlobData: eventArgs.needBlobData, customParams: eventArgs.customParams
                });
            }
        }
    };
    /**
     * Sorts the range of cells in the active Spreadsheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    Workbook.prototype.sort = function (sortOptions, range) {
        if (!this.allowSorting) {
            return;
        }
        var eventArgs = {
            range: range,
            sortOptions: sortOptions,
            cancel: false
        };
        this.notify(initiateSort, eventArgs);
    };
    /**
     * Adds the defined name to the Spreadsheet.
     * @param {DefineNameModel} definedName - Specifies the name.
     * @return {boolean} - Return the added status of the defined name.
     */
    Workbook.prototype.addDefinedName = function (definedName) {
        var eventArgs = {
            action: 'addDefinedName',
            isAdded: false,
            definedName: definedName
        };
        this.notify(workbookFormulaOperation, eventArgs);
        return eventArgs.isAdded;
    };
    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    Workbook.prototype.removeDefinedName = function (definedName, scope) {
        if (scope === void 0) { scope = ''; }
        var eventArgs = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName,
            scope: scope
        };
        this.notify(workbookFormulaOperation, eventArgs);
        return eventArgs.isRemoved;
    };
    /** @hidden */
    Workbook.prototype.clearRange = function (address, sheetIndex, valueOnly) {
        if (valueOnly === void 0) { valueOnly = true; }
        address = address ? address : this.getActiveSheet().selectedRange;
        sheetIndex = sheetIndex ? sheetIndex : this.activeSheetTab;
        clearRange(this, address, sheetIndex, valueOnly);
    };
    __decorate([
        Collection([], Sheet)
    ], Workbook.prototype, "sheets", void 0);
    __decorate([
        Property(1)
    ], Workbook.prototype, "activeSheetTab", void 0);
    __decorate([
        Property('100%')
    ], Workbook.prototype, "height", void 0);
    __decorate([
        Property('100%')
    ], Workbook.prototype, "width", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showRibbon", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showFormulaBar", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "showSheetTabs", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowEditing", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowOpen", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowSave", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowSorting", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowNumberFormatting", void 0);
    __decorate([
        Property(true)
    ], Workbook.prototype, "allowCellFormatting", void 0);
    __decorate([
        Complex({}, CellStyle)
    ], Workbook.prototype, "cellStyle", void 0);
    __decorate([
        Property('')
    ], Workbook.prototype, "openUrl", void 0);
    __decorate([
        Property('')
    ], Workbook.prototype, "saveUrl", void 0);
    __decorate([
        Collection([], DefineName)
    ], Workbook.prototype, "definedNames", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "beforeOpen", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "openFailure", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "beforeSave", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "saveComplete", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "beforeSort", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "sortComplete", void 0);
    __decorate([
        Event$1()
    ], Workbook.prototype, "beforeCellFormat", void 0);
    Workbook = __decorate([
        NotifyPropertyChanges
    ], Workbook);
    return Workbook;
}(Component));

/**
 * Export Spreadsheet library base modules
 */

/**
 * Export Spreadsheet library modules
 */

/**
 * To get Spreadsheet required modules.
 * @hidden
 * @param {Spreadsheet} context
 */
function getRequiredModules(context) {
    var modules = [];
    pushBasicModules(context, modules);
    getWorkbookRequiredModules(context, modules);
    return modules;
}
// tslint:disable-next-line:max-func-body-length
function pushBasicModules(context, modules) {
    modules.push({ member: 'basic', args: [] });
    modules.push({ member: 'all', args: [] });
    if (context.showRibbon) {
        modules.push({
            member: 'ribbon',
            args: [context]
        });
    }
    if (context.showFormulaBar) {
        modules.push({
            member: 'formulaBar',
            args: [context]
        });
    }
    if (context.showSheetTabs) {
        modules.push({
            member: 'sheetTabs',
            args: [context]
        });
    }
    if (context.allowEditing) {
        modules.push({
            member: 'edit',
            args: [context]
        });
        modules.push({
            member: 'formula',
            args: [context]
        });
        modules.push({
            member: 'workbookFormula',
            args: [context]
        });
        modules.push({
            member: 'workbookEdit',
            args: [context]
        });
    }
    if (context.allowOpen) {
        modules.push({
            member: 'open',
            args: [context]
        });
    }
    if (context.allowSave) {
        modules.push({
            member: 'save',
            args: [context]
        });
    }
    if (context.enableContextMenu) {
        modules.push({
            member: 'contextMenu',
            args: [context]
        });
    }
    if (context.selectionSettings.mode !== 'None') {
        modules.push({
            member: 'selection',
            args: [context]
        });
    }
    if (context.enableKeyboardNavigation) {
        modules.push({
            member: 'keyboardNavigation',
            args: [context]
        });
    }
    if (context.allowNumberFormatting) {
        modules.push({
            member: 'numberFormat',
            args: [context]
        });
    }
    if (context.enableKeyboardShortcut) {
        modules.push({
            member: 'keyboardShortcut',
            args: [context]
        });
    }
    if (context.enableClipboard) {
        modules.push({
            member: 'clipboard',
            args: [context]
        });
    }
    if (context.allowCellFormatting) {
        modules.push({
            member: 'cellformat',
            args: [context]
        });
    }
    if (context.allowSorting) {
        modules.push({ member: 'sort', args: [context] });
        modules.push({ member: 'workbookSort', args: [context] });
    }
    if (context.allowResizing) {
        modules.push({
            member: 'resize',
            args: [context]
        });
    }
}

/**
 * Specifies spreadsheet internal events
 */
/** @hidden */
var ribbon = 'ribbon';
/** @hidden */
var formulaBar = 'formulaBar';
/** @hidden */
var sheetTabs = 'sheetTabs';
/** @hidden */
var refreshSheetTabs = 'refreshSheetTabs';
/** @hidden */
var dataRefresh = 'dataRefresh';
/** @hidden */
var initialLoad = 'initialLoad';
/** @hidden */
var contentLoaded = 'contentLoaded';
/** @hidden */
var mouseDown = 'mouseDown';
/** @hidden */
var spreadsheetDestroyed = 'spreadsheetDestroyed';
/** @hidden */
var editOperation = 'editOperation';
/** @hidden */
var formulaOperation = 'formulaOperation';
/** @hidden */
var formulaBarOperation = 'formulaBarOperation';
/** @hidden */
var click = 'click';
/** @hidden */
var keyUp = 'keyUp';
/** @hidden */
var keyDown = 'keyDown';
/** @hidden */
var formulaKeyUp = 'formulaKeyUp';
/** @hidden */
var formulaBarUpdate = 'formulaBarUpdate';
/** @hidden */
var onVerticalScroll = 'verticalScroll';
/** @hidden */
var onHorizontalScroll = 'horizontalScroll';
/** @hidden */
var beforeContentLoaded = 'beforeContentLoaded';
/** @hidden */
var beforeVirtualContentLoaded = 'beforeVirtualContentLoaded';
/** @hidden */
var virtualContentLoaded = 'virtualContentLoaded';
/** @hidden */
var contextMenuOpen = 'contextMenuOpen';
/** @hidden */
var cellNavigate = 'cellNavigate';
/** @hidden */
var mouseUpAfterSelection = 'mouseUpAfterSelection';
/** @hidden */
var selectionComplete = 'selectionComplete';
/** @hidden */
var cMenuBeforeOpen = 'contextmenuBeforeOpen';
/** @hidden */
var addSheetTab = 'addSheetTab';
/** @hidden */
var removeSheetTab = 'removeSheetTab';
/** @hidden */
var renameSheetTab = 'renameSheetTab';
/** @hidden */
var ribbonClick = 'ribboClick';
/** @hidden */
var refreshRibbon = 'ribbonRefresh';
/** @hidden */
var enableRibbonItems = 'enableRibbonItems';
/** @hidden */
var tabSwitch = 'tabSwitch';
/** @hidden */
var selectRange = 'selectRange';
/** @hidden */
var cut = 'cut';
/** @hidden */
var copy = 'copy';
/** @hidden */
var paste = 'paste';
/** @hidden */
var clearCopy = 'clearCopy';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var beforeDataBound = 'beforeDataBound';
/** @hidden */
var addContextMenuItems = 'addContextMenuItems';
/** @hidden */
var removeContextMenuItems = 'removeContextMenuItems';
/** @hidden */
var enableContextMenuItems = 'enableContextMenuItems';
/** @hidden */
var beforeRibbonCreate = 'beforeRibbonCreate';
/** @hidden */
var rowHeightChanged = 'rowHeightChanged';
/** @hidden */
var colWidthChanged = 'colWidthChanged';
/** @hidden */
var beforeHeaderLoaded = 'beforeHeaderLoaded';
/** @hidden */
var onContentScroll = 'onContentScroll';
/** @hidden */
var deInitProperties = 'deInitProperties';
/** @hidden */
var activeSheetChanged = 'activeSheetChanged';
/** @hidden */
var renameSheet = 'renameSheet';
/** @hidden */
var enableToolbar = 'enableToolbar';
/** @hidden */
var initiateCustomSort = 'initiateCustomSort';

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
function getUpdateUsingRaf(fn) {
    requestAnimationFrame(function () {
        fn();
    });
}
/**
 * The function used to remove the dom element children.
 * @param  parent -
 * @hidden
 */
function removeAllChildren(parent, index) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
/**
 * The function used to remove the dom element children.
 * @param  parent -
 * @hidden
 */
function getColGroupWidth(index) {
    var width = 30;
    if (index.toString().length > 3) {
        width = index.toString().length * 10;
    }
    return width;
}
var scrollAreaWidth = null;
/** @hidden */
function getScrollBarWidth() {
    if (scrollAreaWidth !== null) {
        return scrollAreaWidth;
    }
    var htmlDivNode = document.createElement('div');
    var result = 0;
    htmlDivNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(htmlDivNode);
    result = (htmlDivNode.offsetWidth - htmlDivNode.clientWidth) | 0;
    document.body.removeChild(htmlDivNode);
    return scrollAreaWidth = result;
}
var classes = ['e-ribbon', 'e-formula-bar-panel', 'e-sheet-tab-panel', 'e-header-toolbar'];
/** @hidden */
function getSiblingsHeight(element, classList) {
    if (classList === void 0) { classList = classes; }
    var previous = getHeightFromDirection(element, 'previous', classList);
    var next = getHeightFromDirection(element, 'next', classList);
    return previous + next;
}
function getHeightFromDirection(element, direction, classList) {
    // tslint:disable-next-line:no-any
    var sibling = element[direction + 'ElementSibling'];
    var result = 0;
    while (sibling) {
        if (classList.some(function (value) { return sibling.classList.contains(value); })) {
            result += sibling.offsetHeight;
        }
        // tslint:disable-next-line:no-any
        sibling = sibling[direction + 'ElementSibling'];
    }
    return result;
}
/**
 * @hidden
 */
function inView(context, range, isModify) {
    if (context.scrollSettings.enableVirtualization) {
        var topIdx = context.viewport.topIndex;
        var leftIdx = context.viewport.leftIndex;
        var bottomIdx = topIdx + context.viewport.rowCount + context.getThreshold('row') * 2;
        var rightIdx = leftIdx + context.viewport.colCount + context.getThreshold('col') * 2;
        var inView_1 = topIdx <= range[0] && bottomIdx >= range[2] && leftIdx <= range[1] && rightIdx >= range[3];
        if (inView_1) {
            return true;
        }
        if (isModify) {
            if (range[0] < topIdx && range[2] < topIdx || range[0] > bottomIdx && range[2] > bottomIdx) {
                return false;
            }
            else {
                if (range[0] < topIdx && range[2] > topIdx) {
                    range[0] = topIdx;
                    inView_1 = true;
                }
                if (range[2] > bottomIdx) {
                    range[2] = bottomIdx;
                    inView_1 = true;
                }
            }
            if (range[1] < leftIdx && range[3] < leftIdx || range[1] > rightIdx && range[3] > rightIdx) {
                return false;
            }
            else {
                if (range[1] < leftIdx && range[3] > leftIdx) {
                    range[1] = leftIdx;
                    inView_1 = true;
                }
                if (range[3] > rightIdx) {
                    range[3] = rightIdx;
                    inView_1 = true;
                }
            }
        }
        return inView_1;
    }
    else {
        return true;
    }
}
/**
 * Position element with given range
 * @hidden
 */
function locateElem(ele, range, sheet, isRtl) {
    var swapRange = getSwapRange(range);
    var cellPosition = getCellPosition(sheet, swapRange);
    var attrs = {
        'top': (swapRange[0] === 0 ? cellPosition.top : cellPosition.top - 1) + 'px',
        'height': getRowsHeight(sheet, range[0], range[2]) + (swapRange[0] === 0 ? 0 : 1) + 'px',
        'width': getColumnsWidth(sheet, range[1], range[3]) + (swapRange[1] === 0 ? 0 : 1) + 'px'
    };
    attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === 0 ? cellPosition.left : cellPosition.left - 1) + 'px';
    setStyleAttribute$1([{ element: ele, attrs: attrs }]);
}
/**
 * To update element styles using request animation frame
 * @hidden
 */
function setStyleAttribute$1(styles) {
    requestAnimationFrame(function () {
        styles.forEach(function (style) {
            setStyleAttribute(style.element, style.attrs);
        });
    });
}
/**
 * @hidden
 */
function getStartEvent() {
    return (Browser.isPointer ? 'pointerdown' : 'mousedown touchstart');
}
/**
 * @hidden
 */
function getMoveEvent() {
    return (Browser.isPointer ? 'pointermove' : 'mousemove touchmove');
}
/**
 * @hidden
 */
function getEndEvent() {
    return (Browser.isPointer ? 'pointerup' : 'mouseup touchend');
}
/**
 * @hidden
 */
function isTouchStart(e) {
    return e.type === 'touchstart' || (e.type === 'pointerdown' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
function isTouchMove(e) {
    return e.type === 'touchmove' || (e.type === 'pointermove' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
function isTouchEnd(e) {
    return e.type === 'touchend' || (e.type === 'pointerup' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
function getClientX(e) {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}
/**
 * @hidden
 */
function getClientY(e) {
    return e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
}
var config = {
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    busy: 'aria-busy',
    colcount: 'aria-colcount'
};
/** @hidden */
function setAriaOptions(target, options) {
    var props = Object.keys(options);
    props.forEach(function (name) {
        if (target) {
            target.setAttribute(config[name], options[name]);
        }
    });
}
/**
 * @hidden
 */
function destroyComponent(element, component) {
    if (element) {
        var compObj = getComponent(element, component);
        if (compObj) {
            compObj.destroy();
        }
    }
}

/**
 * Represents clipboard support for Spreadsheet.
 */
var Clipboard = /** @__PURE__ @class */ (function () {
    function Clipboard(parent) {
        this.parent = parent;
        this.init();
        this.addEventListener();
    }
    Clipboard.prototype.init = function () {
        this.parent.element
            .appendChild(this.parent.createElement('input', { className: 'e-clipboard', attrs: { 'contenteditable': 'true' } }));
    };
    Clipboard.prototype.addEventListener = function () {
        var ele = this.getClipboardEle();
        this.parent.on(cut, this.cut, this);
        this.parent.on(copy, this.copy, this);
        this.parent.on(paste, this.paste, this);
        this.parent.on(clearCopy, this.clearCopiedInfo, this);
        this.parent.on(tabSwitch, this.tabSwitchHandler, this);
        this.parent.on(cMenuBeforeOpen, this.cMenuBeforeOpenHandler, this);
        this.parent.on(ribbonClick, this.ribbonClickHandler, this);
        this.parent.on(contentLoaded, this.initCopyIndicator, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        EventHandler.add(ele, 'cut', this.cut, this);
        EventHandler.add(ele, 'copy', this.copy, this);
        EventHandler.add(ele, 'paste', this.paste, this);
    };
    Clipboard.prototype.removeEventListener = function () {
        var ele = this.getClipboardEle();
        if (!this.parent.isDestroyed) {
            this.parent.off(cut, this.cut);
            this.parent.off(copy, this.copy);
            this.parent.off(paste, this.paste);
            this.parent.off(clearCopy, this.clearCopiedInfo);
            this.parent.off(tabSwitch, this.tabSwitchHandler);
            this.parent.off(cMenuBeforeOpen, this.cMenuBeforeOpenHandler);
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(contentLoaded, this.initCopyIndicator);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
        }
        EventHandler.remove(ele, 'cut', this.cut);
        EventHandler.remove(ele, 'copy', this.copy);
        EventHandler.remove(ele, 'paste', this.paste);
    };
    Clipboard.prototype.ribbonClickHandler = function (args) {
        var parentId = this.parent.element.id;
        switch (args.item.id) {
            case parentId + '_cut':
                this.cut({ isClick: true });
                break;
            case parentId + '_copy':
                this.copy({ isClick: true });
                break;
        }
        this.parent.element.focus();
    };
    Clipboard.prototype.tabSwitchHandler = function (args) {
        if (args.idx === 1 && !this.copiedInfo) {
            this.hidePaste();
        }
    };
    Clipboard.prototype.cMenuBeforeOpenHandler = function (e) {
        if (e.target === 'Content' || e.target === 'Header') {
            var l10n = this.parent.serviceLocator.getService(locale);
            this.parent.enableContextMenuItems([l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial')], this.copiedInfo ? true : false);
        }
    };
    Clipboard.prototype.rowHeightChanged = function (args) {
        if (this.copiedInfo && this.copiedInfo.range[0] > args.rowIdx) {
            var ele = this.parent.element.getElementsByClassName('e-copy-indicator')[0];
            ele.style.top = parseInt(ele.style.top, 10) + args.threshold + "px";
        }
    };
    Clipboard.prototype.cut = function (args) {
        this.setCopiedInfo(args, true);
    };
    Clipboard.prototype.copy = function (args) {
        this.setCopiedInfo(args, false);
    };
    Clipboard.prototype.paste = function (args) {
        if (this.parent.isEdit) {
            if (args && args.type) {
                args.preventDefault();
                document.getElementById(this.parent.element.id + '_edit').focus();
                return;
            }
        }
        /* tslint:disable-next-line */
        var isExternal = !this.copiedInfo && ((args && args.clipboardData) || window['clipboardData']);
        var copiedIdx = this.getCopiedIdx();
        if (this.copiedInfo || isExternal) {
            var cell = void 0;
            var isExtend = void 0;
            var cSIdx = (args && args.sIdx > -1) ? args.sIdx : this.parent.activeSheetTab - 1;
            var curSheet = getSheet(this.parent, cSIdx);
            var prevSheet = getSheet(this.parent, isExternal ? cSIdx : copiedIdx);
            var selIdx = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            var rows = isExternal && this.getExternalCells(args);
            if (isExternal && !rows.length) { // If image pasted
                return;
            }
            var rowIdx = selIdx[0];
            var cIdx = isExternal
                ? [0, 0, rows.length - 1, rows[0].cells.length - 1] : getSwapRange(this.copiedInfo.range);
            var isRepeative = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0
                && (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
            var rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            for (var i = cIdx[0], l = 0; i <= cIdx[2]; i++, l++) {
                for (var j = cIdx[1], k = 0; j <= cIdx[3]; j++, k++) {
                    cell = isExternal ? rows[i].cells[j] : getCell(i, j, prevSheet);
                    if (cell && args && args.type) {
                        switch (args.type) {
                            case 'Formats':
                                cell = { format: cell.format, style: cell.style };
                                break;
                            case 'Values':
                                cell = { value: cell.value };
                                break;
                        }
                        isExtend = ['Formats', 'Values'].indexOf(args.type) > -1;
                    }
                    if ((!this.parent.scrollSettings.isFinite && (cIdx[2] - cIdx[0] > (1048575 - selIdx[0])
                        || cIdx[3] - cIdx[1] > (16383 - selIdx[1])))
                        || (this.parent.scrollSettings.isFinite && (cIdx[2] - cIdx[0] > (curSheet.rowCount - 1 - selIdx[0])
                            || cIdx[3] - cIdx[1] > (curSheet.colCount - 1 - selIdx[1])))) {
                        this.showDialog();
                        return;
                    }
                    if (isRepeative) {
                        for (var x = selIdx[0]; x <= selIdx[2]; x += (cIdx[2] - cIdx[0]) + 1) {
                            for (var y = selIdx[1]; y <= selIdx[3]; y += (cIdx[3] - cIdx[1] + 1)) {
                                this.setCell(x + l, y + k, curSheet, cell, isExtend);
                            }
                        }
                    }
                    else {
                        this.setCell(rowIdx, selIdx[1] + k, curSheet, cell, isExtend);
                    }
                    if (!isExternal && this.copiedInfo.isCut) {
                        this.setCell(i, j, prevSheet, getCell(i, j, prevSheet), false, true);
                    }
                }
                rowIdx++;
            }
            this.parent.setUsedRange(rfshRange[2], rfshRange[3]);
            if (cSIdx === this.parent.activeSheetTab - 1) {
                this.parent.serviceLocator.getService('cell').refreshRange(rfshRange);
                this.parent.notify(selectRange, rfshRange);
            }
            if (!isExternal && this.copiedInfo.isCut) {
                if (copiedIdx === this.parent.activeSheetTab - 1) {
                    this.parent.serviceLocator.getService('cell').refreshRange(cIdx);
                }
                this.clearCopiedInfo();
            }
            if (isExternal || (args && args.isClick)) {
                this.parent.element.focus();
            }
        }
        else {
            this.getClipboardEle().select();
        }
    };
    Clipboard.prototype.setCell = function (rIdx, cIdx, sheet, cell, isExtend, isCut) {
        setCell(rIdx, cIdx, sheet, isCut ? null : cell, isExtend);
        if (cell && cell.formula) {
            this.parent.notify(workbookFormulaOperation, {
                action: 'refreshCalculate', value: isCut ? '' : cell.formula, rowIndex: rIdx,
                colIndex: cIdx, sheetIndex: this.parent.activeSheetTab, isFormula: true
            });
        }
        if (isCut && cell && cell.style) {
            this.parent.notify(applyCellFormat, {
                style: extend({}, this.getEmptyStyle(cell.style), this.parent.commonCellStyle), rowIdx: rIdx, colIdx: cIdx, cell: null,
                lastCell: null, row: null, hRow: null, isHeightCheckNeeded: true, manualUpdate: false
            });
        }
    };
    Clipboard.prototype.getEmptyStyle = function (cellStyle) {
        var style = {};
        Object.keys(cellStyle).forEach(function (key) {
            style[key] = '';
        });
        return style;
    };
    Clipboard.prototype.getCopiedIdx = function () {
        if (this.copiedInfo) {
            for (var i = 0; i < this.parent.sheets.length; i++) {
                if (this.parent.sheets[i].id === this.copiedInfo.sId) {
                    return i;
                }
            }
            this.clearCopiedInfo();
        }
        return -1;
    };
    Clipboard.prototype.setCopiedInfo = function (args, isCut) {
        var _this = this;
        if (this.parent.isEdit) {
            return;
        }
        var sheet = this.parent.getActiveSheet();
        var range = (args && args.range) || getRangeIndexes(sheet.selectedRange);
        var option = {
            sheet: sheet, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise: new Promise(function (resolve, reject) { resolve((function () { })()); })
        };
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1)) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
        option.promise.then(function () {
            if (!(args && args.clipboardData)) {
                if (_this.copiedInfo) {
                    _this.clearCopiedInfo();
                }
                _this.copiedInfo = {
                    range: range, sId: (args && args.sId) ? args.sId : sheet.id, isCut: isCut
                };
                _this.hidePaste(true);
                _this.initCopyIndicator();
                if (!Browser.isIE) {
                    _this.getClipboardEle().select();
                }
                if (args && args.isClick) {
                    document.execCommand(isCut ? 'cut' : 'copy');
                }
                _this.parent.hideSpinner();
            }
            if (Browser.isIE) {
                _this.setExternalCells(args);
            }
        });
        if (args && args.clipboardData) {
            this.setExternalCells(args);
            this.parent.element.focus();
        }
    };
    Clipboard.prototype.clearCopiedInfo = function () {
        if (this.copiedInfo) {
            if (this.parent.getActiveSheet().id === this.copiedInfo.sId) {
                detach(this.parent.getMainContent().getElementsByClassName('e-copy-indicator')[0]);
            }
            this.copiedInfo = null;
            this.hidePaste();
        }
    };
    Clipboard.prototype.initCopyIndicator = function () {
        if (this.copiedInfo && this.parent.getActiveSheet().id === this.copiedInfo.sId) {
            var copyIndicator = this.parent.createElement('div', { className: 'e-copy-indicator' });
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            locateElem(copyIndicator, this.copiedInfo.range, this.parent.getActiveSheet());
            this.parent.getMainContent().appendChild(copyIndicator);
        }
    };
    Clipboard.prototype.showDialog = function () {
        this.parent.serviceLocator.getService(dialog).show({
            header: 'Spreadsheet',
            target: this.parent.element,
            height: 205, width: 340, isModal: true, showCloseIcon: true,
            content: this.parent.serviceLocator.getService(locale).getConstant('PasteAlert')
        });
    };
    Clipboard.prototype.hidePaste = function (isShow) {
        this.parent.notify(enableRibbonItems, { id: this.parent.element.id + '_paste', isEnable: isShow || false });
    };
    Clipboard.prototype.setExternalCells = function (args) {
        var cell;
        var text = '';
        var range = this.copiedInfo.range;
        var sheet = this.parent.getActiveSheet();
        var data = '<html><body><table xmlns="http://www.w3.org/1999/xhtml"><tbody>';
        for (var i = range[0]; i <= range[2]; i++) {
            data += '<tr>';
            for (var j = range[1]; j <= range[3]; j++) {
                data += '<td style="white-space:nowrap;vertical-align:bottom;';
                cell = getCell(i, j, sheet);
                if (cell && cell.style) {
                    Object.keys(cell.style).forEach(function (style) {
                        var regex = style.match(/[A-Z]/);
                        data += (style === 'backgroundColor' ? 'background' : (regex ? style.replace(regex[0], '-'
                            + regex[0].toLowerCase()) : style)) + ':' + ((style === 'backgroundColor' || style === 'color')
                            ? cell.style[style].slice(0, 7) : cell.style[style]) + ';';
                    });
                }
                data += '">';
                if (cell && cell.value) {
                    var eventArgs = {
                        formattedText: cell.value,
                        value: cell.value,
                        format: cell.format,
                        onLoad: true
                    };
                    if (cell.format) {
                        this.parent.notify(getFormattedCellObject, eventArgs);
                    }
                    data += eventArgs.formattedText;
                    text += eventArgs.formattedText;
                }
                data += '</td>';
                text += j === range[3] ? '' : '\t';
            }
            data += '</tr>';
            text += i === range[2] ? '' : '\n';
        }
        data += '</tbody></table></body></html>';
        if (Browser.isIE) {
            /* tslint:disable-next-line */
            window['clipboardData'].setData('text', text);
        }
        else {
            args.clipboardData.setData('text/html', data);
            args.clipboardData.setData('text/plain', text);
            args.preventDefault();
        }
    };
    Clipboard.prototype.getExternalCells = function (args) {
        var _this = this;
        var html;
        var text;
        var rows = [];
        var cells = [];
        var cellStyle;
        var ele = this.parent.createElement('span');
        if (Browser.isIE) {
            /* tslint:disable-next-line */
            text = window['clipboardData'].getData('text');
        }
        else {
            html = args.clipboardData.getData('text/html');
            text = args.clipboardData.getData('text/plain');
            ele.innerHTML = html;
        }
        if (ele.querySelector('table')) {
            ele.querySelectorAll('tr').forEach(function (tr) {
                tr.querySelectorAll('td').forEach(function (td, j) {
                    cells[j] = { value: td.textContent, style: _this.getStyle(td, ele) };
                });
                rows.push({ cells: cells });
                cells = [];
            });
        }
        else if (text) {
            if (html) {
                [].slice.call(ele.children).forEach(function (child) {
                    if (child.getAttribute('style')) {
                        cellStyle = _this.getStyle(child, ele);
                    }
                });
            }
            text.trim().split('\n').forEach(function (row) {
                row.split('\t').forEach(function (col, j) {
                    cells[j] = { style: cellStyle };
                    if (checkIsFormula(col)) {
                        cells[j].formula = col;
                    }
                    else {
                        cells[j].value = col;
                    }
                });
                rows.push({ cells: cells });
                cells = [];
            });
        }
        setTimeout(function () { _this.getClipboardEle().innerHTML = ''; }, 0);
        return rows;
    };
    Clipboard.prototype.getStyle = function (td, ele) {
        var styles = [];
        var cellStyle = {};
        if (td.classList.length || td.getAttribute('style')) {
            if (td.classList.length) {
                styles.push(ele.querySelector('style').innerHTML.split(td.classList[0])[1].split('{')[1].split('}')[0]);
            }
            if (td.getAttribute('style')) {
                styles.push(td.getAttribute('style'));
            }
            styles.forEach(function (styles) {
                styles.split(';').forEach(function (style) {
                    var char = style.split(':')[0].trim();
                    if (['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'background', 'font-weight', 'font-style',
                        'font-size', 'text-decoration'].indexOf(char) > -1) {
                        char = char === 'background' ? 'backgroundColor' : char;
                        var regex = char.match(/-[a-z]/);
                        cellStyle[regex ? char.replace(regex[0], regex[0].charAt(1).toUpperCase()) : char] = style.split(':')[1];
                    }
                });
            });
        }
        return cellStyle;
    };
    Clipboard.prototype.getClipboardEle = function () {
        return this.parent.element.getElementsByClassName('e-clipboard')[0];
    };
    Clipboard.prototype.getModuleName = function () {
        return 'clipboard';
    };
    Clipboard.prototype.destroy = function () {
        this.removeEventListener();
        var ele = this.getClipboardEle();
        detach(ele);
        this.parent = null;
    };
    return Clipboard;
}());

/**
 * The `Edit` module is used to handle the editing functionalities in Spreadsheet.
 */
var Edit = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for edit module in Spreadsheet.
     * @private
     */
    function Edit(parent) {
        this.editorElem = null;
        this.editCellData = {};
        this.isEdit = false;
        this.isCellEdit = true;
        this.isNewValueEdit = true;
        this.keyCodes = {
            BACKSPACE: 8,
            SPACE: 32,
            TAB: 9,
            DELETE: 46,
            ESC: 27,
            ENTER: 13,
            FIRSTALPHABET: 65,
            LASTALPHABET: 90,
            FIRSTNUMBER: 48,
            LASTNUMBER: 59,
            FIRSTNUMPAD: 96,
            LASTNUMPAD: 111,
            SYMBOLSETONESTART: 186,
            SYMBOLSETONEEND: 192,
            SYMBOLSETTWOSTART: 219,
            SYMBOLSETTWOEND: 222,
            FIREFOXEQUALPLUS: 61,
            FIREFOXMINUS: 173,
            F2: 113
        };
        this.parent = parent;
        this.init();
        //Spreadsheet.Inject(WorkbookEdit);
    }
    Edit.prototype.init = function () {
        this.addEventListener();
    };
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    Edit.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    };
    Edit.prototype.addEventListener = function () {
        EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
    };
    Edit.prototype.removeEventListener = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Edit.prototype.getModuleName = function () {
        return 'edit';
    };
    Edit.prototype.performEditOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'renderEditor':
                this.renderEditor();
                break;
            case 'refreshEditor':
                this.refreshEditor(args.value, args.refreshFormulaBar, args.refreshEditorElem, args.isAppend, args.trigEvent);
                if (args.refreshCurPos) {
                    this.setCursorPosition();
                }
                break;
            case 'startEdit':
                if (!this.isEdit) {
                    this.isNewValueEdit = args.isNewValueEdit;
                    this.startEdit(args.address, args.value, args.refreshCurPos);
                }
                break;
            case 'endEdit':
                if (this.isEdit) {
                    this.endEdit(args.refreshFormulaBar);
                }
                break;
            case 'cancelEdit':
                if (this.isEdit) {
                    this.cancelEdit(args.refreshFormulaBar);
                }
                break;
            case 'getCurrentEditValue':
                args.editedValue = this.editCellData.value;
                break;
            case 'refreshDependentCellValue':
                this.refreshDependentCellValue(args.rowIdx, args.colIdx, args.sheetIdx);
                break;
            case 'getPosition':
                args.position = this.editorElem.getBoundingClientRect();
                break;
            case 'focusEditorElem':
                this.editorElem.focus();
                break;
        }
    };
    Edit.prototype.keyUpHandler = function (e) {
        if (this.isEdit) {
            if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
        }
    };
    Edit.prototype.keyDownHandler = function (e) {
        var trgtElem = e.target;
        var keyCode = e.keyCode;
        if (this.isEdit) {
            if (this.isCellEdit) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
            switch (keyCode) {
                case this.keyCodes.ENTER:
                    if (Browser.isWindows) {
                        e.preventDefault();
                    }
                    this.endEdit();
                    break;
                case this.keyCodes.TAB:
                    if (!this.hasFormulaSuggSelected()) {
                        this.endEdit();
                    }
                    break;
                case this.keyCodes.ESC:
                    this.cancelEdit();
                    break;
            }
        }
        else {
            if (!this.isEdit && (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel'))) {
                var isAlphabet = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                var isNumeric = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                var isNumpadKeys = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                var isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND);
                if (!isSymbolkeys) {
                    isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                }
                var isFirefoxExceptionkeys = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                    (keyCode === this.keyCodes.FIREFOXMINUS);
                var isF2Edit = (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2);
                var isBackSpace = keyCode === this.keyCodes.BACKSPACE;
                if ((!e.ctrlKey && !e.altKey && ((!e.shiftKey && keyCode === this.keyCodes.SPACE) || isAlphabet || isNumeric ||
                    isNumpadKeys || isSymbolkeys || (Browser.info.name === 'mozilla' && isFirefoxExceptionkeys))) || isF2Edit || isBackSpace) {
                    if (isF2Edit) {
                        this.isNewValueEdit = false;
                    }
                    this.startEdit();
                }
                if (keyCode === this.keyCodes.DELETE) {
                    this.editingHandler('delete');
                }
            }
        }
    };
    Edit.prototype.renderEditor = function () {
        if (!this.editorElem || !this.parent.element.querySelector('#' + this.parent.element.id + '_edit')) {
            var editor = void 0;
            editor = this.parent.createElement('div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit' });
            editor.contentEditable = 'true';
            editor.spellcheck = false;
            this.editorElem = editor;
            this.parent.element.querySelector('.e-main-content').appendChild(this.editorElem);
        }
        this.parent.notify(formulaOperation, { action: 'renderAutoComplete' });
    };
    Edit.prototype.refreshEditor = function (value, refreshFormulaBar, refreshEditorElem, isAppend, trigEvent) {
        if (trigEvent === void 0) { trigEvent = true; }
        if (isAppend) {
            value = this.editCellData.value = this.editCellData.value + value;
        }
        else {
            this.editCellData.value = value;
        }
        if (refreshEditorElem) {
            this.editorElem.textContent = value;
        }
        if (refreshFormulaBar) {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: value });
        }
        if (trigEvent && this.editCellData.value === this.editorElem.textContent) {
            if (this.triggerEvent('cellEditing')) {
                this.cancelEdit();
            }
        }
        // if (this.editorElem.scrollHeight + 2 <= this.editCellData.element.offsetHeight) {
        //     this.editorElem.style.height = (this.editCellData.element.offsetHeight + 1) + 'px';
        // } else {
        //     this.editorElem.style.removeProperty('height');
        // }
    };
    Edit.prototype.startEdit = function (address, value, refreshCurPos) {
        if (refreshCurPos === void 0) { refreshCurPos = true; }
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbar, { enable: false });
    };
    Edit.prototype.setCursorPosition = function () {
        var elem = this.editorElem;
        var textLen = elem.textContent.length;
        if (textLen) {
            var selection = document.getSelection();
            var range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    };
    Edit.prototype.hasFormulaSuggSelected = function () {
        var suggDdlElem = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    };
    Edit.prototype.editingHandler = function (action) {
        switch (action) {
            case 'delete':
                var address = this.parent.getActiveSheet().selectedRange;
                var range = getIndexesFromAddress(address);
                this.parent.clearRange(address, null, true);
                this.parent.serviceLocator.getService('cell').refreshRange(range);
                this.parent.notify(selectionComplete, {});
                break;
        }
    };
    Edit.prototype.mouseDownHandler = function (e) {
        if (this.isEdit) {
            var trgtElem = e.target;
            this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
            if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active')) {
                this.endEdit();
            }
        }
    };
    Edit.prototype.dblClickHandler = function (e) {
        var trgtElem = e.target;
        if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
            || closest(trgtElem, '.e-main-content')) {
            if (this.isEdit) {
                this.endEdit();
            }
            else {
                this.isNewValueEdit = false;
                this.startEdit();
            }
        }
    };
    Edit.prototype.updateEditCellDetail = function (addr, value) {
        var sheetIdx;
        var sheet;
        if (!this.editCellData.sheetIndex) {
            if (addr && addr.split('!').length > 1) {
                sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(addr));
            }
            else {
                sheetIdx = this.parent.activeSheetTab;
            }
        }
        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent, sheetIdx - 1);
            if (addr) {
                addr = getRangeFromAddress(addr);
            }
            else {
                addr = sheet.activeCell;
            }
        }
        var range = getRangeIndexes(addr);
        var rowIdx = range[0];
        var colIdx = range[1];
        var cellElem = this.parent.getCell(rowIdx, colIdx);
        var cellPosition = getCellPosition(sheet, range);
        this.editCellData = {
            addr: addr,
            fullAddr: getSheetName(this.parent, sheetIdx) + '!' + addr,
            rowIndex: rowIdx,
            colIndex: colIdx,
            sheetIndex: sheetIdx,
            element: cellElem,
            value: value || '',
            position: cellPosition
        };
    };
    Edit.prototype.initiateEditor = function (refreshCurPos) {
        var _this = this;
        var data = this.parent.getData(this.editCellData.fullAddr);
        data.then(function (values) {
            values.forEach(function (cell, key) {
                var args = { cell: cell, value: cell ? cell.value : '' };
                _this.parent.notify(getFormattedBarText, args);
                var value = cell ? args.value : '';
                if (cell && cell.formula) {
                    value = cell.formula;
                }
                _this.editCellData.oldValue = value;
                if (_this.editCellData.value) {
                    value = _this.editCellData.value;
                }
                else {
                    _this.editCellData.value = value;
                }
                if (_this.isNewValueEdit) {
                    value = '';
                }
                else {
                    _this.isNewValueEdit = true;
                }
                if (value) {
                    _this.refreshEditor(value, false, true, false, false);
                }
                if (refreshCurPos) {
                    _this.setCursorPosition();
                }
                if (_this.triggerEvent('cellEdit')) {
                    _this.cancelEdit(true, false);
                }
            });
        });
    };
    Edit.prototype.positionEditor = function () {
        var tdElem = this.editCellData.element;
        tdElem.classList.add('e-ss-edited');
        var left = this.editCellData.position.left + 1;
        var top = this.editCellData.position.top + 1;
        var minHeight = this.editCellData.element.offsetHeight - 3;
        var minWidth = this.editCellData.element.offsetWidth - 3;
        var mainContElement = this.parent.getMainContent();
        var editWidth = mainContElement.offsetWidth - left - 28;
        //let editHeight: number = mainContElement.offsetHeight - top - 28;
        var inlineStyles = 'display:block;top:' + top + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
            'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;height:' + minHeight + 'px;';
        inlineStyles += tdElem.style.cssText;
        this.editorElem.setAttribute('style', inlineStyles);
        if (tdElem.classList.contains('e-right-align')) {
            this.editorElem.classList.add('e-right-align');
        }
        else if (tdElem.classList.contains('e-center-align')) {
            this.editorElem.classList.add('e-center-align');
        }
    };
    Edit.prototype.updateEditedValue = function (tdRefresh) {
        if (tdRefresh === void 0) { tdRefresh = true; }
        var oldCellValue = this.editCellData.oldValue;
        var oldValue = oldCellValue.toString().toUpperCase();
        if (oldCellValue !== this.editCellData.value || oldValue.indexOf('=RAND()') > -1 || oldValue.indexOf('RAND()') > -1 ||
            oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) {
            var cellIndex = getRangeIndexes(this.parent.getActiveSheet().activeCell);
            this.parent.notify(workbookEditOperation, { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            var cell = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet(), true);
            var eventArgs = this.getRefreshNodeArgs(cell);
            this.editCellData.value = eventArgs.result;
            if (tdRefresh) {
                this.parent.refreshNode(this.editCellData.element, eventArgs);
            }
        }
    };
    Edit.prototype.refreshDependentCellValue = function (rowIdx, colIdx, sheetIdx) {
        if (rowIdx && colIdx) {
            rowIdx--;
            colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetTab === sheetIdx) {
                var td = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    var sheet = getSheet(this.parent, sheetIdx - 1);
                    var cell = getCell(rowIdx, colIdx, sheet);
                    var eventArgs = this.getRefreshNodeArgs(cell);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    };
    Edit.prototype.getRefreshNodeArgs = function (cell) {
        cell = cell ? cell : {};
        var fCode = (cell && cell.format) ? cell.format : '';
        var eventArgs = {
            value: cell.value, format: fCode, onLoad: true,
            formattedText: '', isRightAlign: false, type: 'General'
        };
        var args;
        this.parent.notify(getFormattedCellObject, eventArgs);
        args = {
            isRightAlign: eventArgs.isRightAlign,
            result: eventArgs.formattedText,
            type: eventArgs.type,
            value: eventArgs.value,
            curSymbol: eventArgs.curSymbol
        };
        return args;
    };
    Edit.prototype.endEdit = function (refreshFormulaBar) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = false; }
        if (refreshFormulaBar) {
            this.refreshEditor(this.editCellData.oldValue, false, true, false, false);
        }
        this.updateEditedValue();
        this.triggerEvent('cellSave');
        this.resetEditState();
        this.focusElement();
    };
    Edit.prototype.cancelEdit = function (refreshFormulaBar, trigEvent) {
        if (refreshFormulaBar === void 0) { refreshFormulaBar = true; }
        if (trigEvent === void 0) { trigEvent = true; }
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave');
        }
        this.resetEditState();
        this.focusElement();
    };
    Edit.prototype.focusElement = function () {
        this.parent.element.focus();
        this.parent.notify(enableToolbar, { enable: true });
    };
    Edit.prototype.triggerEvent = function (eventName) {
        var eventArgs = {
            element: this.editCellData.element,
            value: this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr
        };
        if (eventName !== 'cellSave') {
            eventArgs.cancel = false;
        }
        this.parent.trigger(eventName, eventArgs);
        return eventArgs.cancel;
    };
    Edit.prototype.altEnter = function () {
        var text;
        var textBefore;
        var textAfter;
        var selection = window.getSelection();
        var node = selection.anchorNode;
        var offset;
        var range = document.createRange();
        offset = (node.nodeType === 3) ? selection.anchorOffset : node.textContent.length;
        text = node.textContent;
        textBefore = text.slice(0, offset);
        textAfter = text.slice(offset) || ' ';
        node.textContent = textBefore + '\n' + textAfter;
        range = document.createRange();
        if (node.nodeType === 3) {
            range.setStart(node, offset + 1);
            range.setEnd(node, offset + 1);
        }
        else if (node.nodeType === 1) {
            range.setStart(node.firstChild, offset + 1);
            range.setEnd(node.firstChild, offset + 1);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    };
    Edit.prototype.resetEditState = function (elemRefresh) {
        if (elemRefresh === void 0) { elemRefresh = true; }
        if (elemRefresh) {
            this.editCellData.element.classList.remove('e-ss-edited');
            this.editorElem.textContent = '';
            this.editorElem.removeAttribute('style');
            this.editorElem.classList.remove('e-right-align');
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
    };
    return Edit;
}());

/**
 * Represents selection support for Spreadsheet.
 */
var Selection = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the Spreadsheet selection module.
     * @private
     */
    function Selection(parent) {
        this.parent = parent;
        this.addEventListener();
        this.mouseMoveEvt = this.mouseMoveHandler.bind(this);
    }
    Selection.prototype.addEventListener = function () {
        this.parent.on(contentLoaded, this.init, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(virtualContentLoaded, this.virtualContentLoadedHandler, this);
        this.parent.on(cellNavigate, this.cellNavigateHandler, this);
        this.parent.on(selectRange, this.selectRange, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
    };
    Selection.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.init);
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(virtualContentLoaded, this.virtualContentLoadedHandler);
            this.parent.off(cellNavigate, this.cellNavigateHandler);
            this.parent.off(selectRange, this.selectRange);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
            this.parent.off(colWidthChanged, this.colWidthChanged);
        }
    };
    Selection.prototype.rowHeightChanged = function (args) {
        var _this = this;
        getUpdateUsingRaf(function () {
            var ele = _this.getActiveCell();
            var cellIndex = getCellIndexes(_this.parent.getActiveSheet().activeCell)[0];
            if (cellIndex === args.rowIdx && ele) {
                ele.style.height = parseInt(ele.style.height, 10) + args.threshold + "px";
            }
            else if (cellIndex > args.rowIdx && ele) {
                ele.style.top = parseInt(ele.style.top, 10) + args.threshold + "px";
            }
            ele = _this.getSelectionElement();
            if (ele) {
                var selectedRange = getRangeIndexes(_this.parent.getActiveSheet().selectedRange);
                var sRange = getSwapRange(selectedRange);
                var rowStart = sRange[0];
                var rowEnd = sRange[2];
                if (rowStart <= args.rowIdx && rowEnd >= args.rowIdx && ele) {
                    ele.style.height = parseInt(ele.style.height, 10) + args.threshold + "px";
                }
                else if (rowStart > args.rowIdx && ele) {
                    ele.style.top = parseInt(ele.style.top, 10) + args.threshold + "px";
                }
            }
        });
    };
    Selection.prototype.colWidthChanged = function (args) {
        var _this = this;
        getUpdateUsingRaf(function () {
            var ele = _this.getActiveCell();
            var cellIndex = getCellIndexes(_this.parent.getActiveSheet().activeCell)[1];
            if (cellIndex === args.colIdx && ele) {
                ele.style.width = parseInt(ele.style.width, 10) + args.threshold + "px";
            }
            else if (cellIndex > args.colIdx && ele) {
                ele.style.left = parseInt(ele.style.left, 10) + args.threshold + "px";
            }
            ele = _this.getSelectionElement();
            var selectedRange = getRangeIndexes(_this.parent.getActiveSheet().selectedRange);
            var sRange = getSwapRange(selectedRange);
            var colStart = sRange[1];
            var colEnd = sRange[3];
            if (colStart <= args.colIdx && colEnd >= args.colIdx && ele) {
                ele.style.width = parseInt(ele.style.width, 10) + args.threshold + "px";
            }
            else if (colStart > args.colIdx && ele) {
                ele.style.left = parseInt(ele.style.left, 10) + args.threshold + "px";
            }
        });
    };
    Selection.prototype.selectRange = function (indexes) {
        this.selectRangeByIdx(this.parent.selectionSettings.mode === 'Single' ? indexes.slice(0, 2).concat(indexes.slice(0, 2)) : indexes);
    };
    Selection.prototype.init = function () {
        var range = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        var sRange = getSwapRange(range);
        var actRange = getCellIndexes(this.parent.getActiveSheet().activeCell);
        var inRange = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.createSelectionElement();
        this.selectRangeByIdx(range, null, null, inRange);
    };
    Selection.prototype.createSelectionElement = function () {
        var cont = this.parent.getMainContent();
        var ele = this.parent.createElement('div', { className: 'e-selection' });
        var activeCell = this.parent.createElement('div', { className: 'e-active-cell' });
        cont.appendChild(ele);
        cont.appendChild(activeCell);
    };
    Selection.prototype.mouseDownHandler = function (e) {
        if (!this.parent.isEdit) {
            if (this.getSheetElement().contains(e.target) && !e.target.classList.contains('e-colresize')
                && !e.target.classList.contains('e-rowresize')) {
                var sheet = this.parent.getActiveSheet();
                var mode = this.parent.selectionSettings.mode;
                var rowIdx = this.getRowIdxFromClientY(getClientY(e));
                var colIdx = this.getColIdxFromClientX(getClientX(e));
                var activeIdx = getCellIndexes(sheet.activeCell);
                var isRowSelected = sheet.showHeaders && this.parent.getRowHeaderContent().contains(e.target);
                var isColSelected = sheet.showHeaders && this.parent.getColumnHeaderContent().contains(e.target);
                if (e.which === 3 && this.isSelected(rowIdx, colIdx)) {
                    return;
                }
                if (mode === 'Multiple' && (!isTouchEnd(e) && (!isTouchStart(e) ||
                    (isTouchStart(e) && activeIdx[0] === rowIdx && activeIdx[1] === colIdx)) || isColSelected || isRowSelected)) {
                    document.addEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
                    if (!Browser.isPointer) {
                        document.addEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt, { passive: false });
                    }
                }
                if (!isTouchEnd(e)) {
                    EventHandler.add(document, getEndEvent(), this.mouseUpHandler, this);
                }
                if (isTouchStart(e) && !(isColSelected || isRowSelected)) {
                    this.touchEvt = e;
                    return;
                }
                if (isRowSelected) {
                    this.isRowSelected = true;
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [rowIdx, 0];
                    }
                    this.selectRangeByIdx([this.startCell[0], 0, rowIdx, sheet.colCount - 1], e);
                }
                else if (isColSelected) {
                    this.isColSelected = true;
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [0, colIdx];
                    }
                    this.selectRangeByIdx([0, this.startCell[1], sheet.rowCount - 1, colIdx], e);
                }
                else if (e.target.classList.contains('e-selectall')) {
                    this.startCell = [0, 0];
                    this.selectRangeByIdx([].concat(this.startCell, [sheet.rowCount - 1, sheet.colCount - 1]), e);
                }
                else if (!e.target.classList.contains('e-main-content')) {
                    if (!e.shiftKey || mode === 'Single') {
                        this.startCell = [rowIdx, colIdx];
                    }
                    this.selectRangeByIdx([].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]), e);
                }
                if (this.parent.isMobileView()) {
                    this.parent.element.classList.add('e-mobile-focused');
                    this.parent.renderModule.setSheetPanelSize();
                }
            }
        }
    };
    Selection.prototype.mouseMoveHandler = function (e) {
        var _this = this;
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        var sheet = this.parent.getActiveSheet();
        var cont = this.getScrollContent();
        var clientRect = cont.getBoundingClientRect();
        var clientX = getClientX(e);
        var clientY = getClientY(e);
        // remove math.min or handle top and left auto scroll
        var colIdx = this.isRowSelected ? sheet.colCount - 1 : this.getColIdxFromClientX(Math.min(clientX, clientRect.right));
        var rowIdx = this.isColSelected ? sheet.rowCount - 1 : this.getRowIdxFromClientY(Math.min(clientY, clientRect.bottom));
        var isScrollDown = clientY > clientRect.bottom && rowIdx < sheet.rowCount;
        var isScrollUp = clientY < clientRect.top && rowIdx >= 0 && !this.isColSelected;
        var isScrollRight = clientX > clientRect.right && colIdx < sheet.colCount;
        var isScrollLeft = clientX < clientRect.left && colIdx >= 0 && !this.isRowSelected;
        this.clearInterval();
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            this.scrollInterval = setInterval(function () {
                if ((isScrollDown || isScrollUp) && !_this.isColSelected) {
                    rowIdx = _this.getRowIdxFromClientY(isScrollDown ? clientRect.bottom : clientRect.top);
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        _this.clearInterval();
                        return;
                    }
                    cont.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if ((isScrollRight || isScrollLeft) && !_this.isRowSelected) {
                    colIdx = _this.getColIdxFromClientX(isScrollRight ? clientRect.right : clientRect.left);
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        _this.clearInterval();
                        return;
                    }
                    cont.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                _this.selectRangeByIdx([].concat(_this.startCell, [rowIdx, colIdx]), e);
                // tslint:disable-next-line
            }, 100);
        }
        else {
            this.selectRangeByIdx([].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]), e);
        }
    };
    Selection.prototype.mouseUpHandler = function (e) {
        var rowIdx = this.getRowIdxFromClientY(getClientY(e));
        var colIdx = this.getColIdxFromClientX(getClientX(e));
        this.clearInterval();
        if (isTouchEnd(e) && !(this.isColSelected || this.isRowSelected) &&
            (this.getRowIdxFromClientY(getClientY(this.touchEvt)) === rowIdx &&
                this.getColIdxFromClientX(getClientX(this.touchEvt)) === colIdx)) {
            this.mouseDownHandler(e);
        }
        this.parent.trigger('select', { range: this.parent.getActiveSheet().selectedRange });
        document.removeEventListener(getMoveEvent().split(' ')[0], this.mouseMoveEvt);
        if (!Browser.isPointer) {
            document.removeEventListener(getMoveEvent().split(' ')[1], this.mouseMoveEvt);
        }
        EventHandler.remove(document, getEndEvent(), this.mouseUpHandler);
        this.parent.notify(mouseUpAfterSelection, e);
    };
    Selection.prototype.isSelected = function (rowIdx, colIdx) {
        var indexes = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
        return indexes[0] <= rowIdx && rowIdx <= indexes[2] && indexes[1] <= colIdx && colIdx <= indexes[3];
    };
    Selection.prototype.virtualContentLoadedHandler = function () {
        var sheet = this.parent.getActiveSheet();
        var indexes = getRangeIndexes(sheet.selectedRange);
        if (this.isColSelected && this.isRowSelected) {
            this.selectRangeByIdx([0, 0, sheet.rowCount - 1, sheet.colCount - 1], null, true);
        }
        else if (this.isColSelected) {
            this.selectRangeByIdx([0, indexes[1], sheet.rowCount - 1, indexes[3]], null, true);
        }
        else if (this.isRowSelected) {
            this.selectRangeByIdx([indexes[0], 0, indexes[2], sheet.colCount - 1], null, true);
        }
        else {
            this.highlightHdr(indexes, indexes[0] >= this.parent.viewport.topIndex || indexes[2] >= this.parent.viewport.topIndex, indexes[1] >= this.parent.viewport.leftIndex || indexes[3] >= this.parent.viewport.leftIndex);
        }
    };
    Selection.prototype.clearInterval = function () {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
    };
    Selection.prototype.getScrollContent = function () {
        return this.parent.getMainContent();
    };
    Selection.prototype.getScrollLeft = function () {
        return this.parent.scrollModule ? this.parent.scrollModule.prevScroll.scrollLeft : 0;
    };
    Selection.prototype.cellNavigateHandler = function (args) {
        this.selectRangeByIdx(args.range.concat(args.range));
    };
    Selection.prototype.getColIdxFromClientX = function (clientX) {
        var width = 0;
        var sheet = this.parent.getActiveSheet();
        var cliRect = this.parent.getMainContent().getBoundingClientRect();
        var left = (this.parent.enableRtl ? (cliRect.right - clientX) : (clientX - cliRect.left)) + this.getScrollLeft();
        for (var i = 0;; i++) {
            width += getColumnsWidth(sheet, i);
            if (left < width) {
                return i;
            }
        }
    };
    Selection.prototype.getRowIdxFromClientY = function (clientY) {
        var height = 0;
        var sheet = this.parent.getActiveSheet();
        var top = (clientY - this.parent.getMainContent().getBoundingClientRect().top)
            + this.parent.getMainContent().scrollTop;
        for (var i = 0;; i++) {
            height += getRowHeight(sheet, i);
            if (top < height) {
                return i;
            }
        }
    };
    Selection.prototype.selectRangeByIdx = function (range, e, isScrollRefresh, isActCellChanged) {
        var ele = this.getSelectionElement();
        var sheet = this.parent.getActiveSheet();
        var args = { range: getRangeAddress(range), cancel: false };
        this.parent.trigger('beforeSelect', args);
        if (args.cancel === true) {
            return;
        }
        if (isSingleCell(range)) {
            ele.classList.add('e-hide');
        }
        else {
            ele.classList.remove('e-hide');
            locateElem(ele, range, sheet, this.parent.enableRtl);
        }
        updateSelectedRange(this.parent, getRangeAddress(range), sheet);
        this.UpdateRowColSelected(range);
        this.highlightHdr(range);
        if (!isScrollRefresh && !(e && (e.type === 'mousemove' || isTouchMove(e)))) {
            this.updateActiveCell(isActCellChanged ? getCellIndexes(sheet.activeCell) : range);
        }
        if (isNullOrUndefined(e)) {
            e = { type: 'mousedown' };
        }
        this.parent.notify(selectionComplete, e);
    };
    Selection.prototype.UpdateRowColSelected = function (indexes) {
        var sheet = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    };
    Selection.prototype.updateActiveCell = function (range) {
        var sheet = this.parent.getActiveSheet();
        var topLeftIdx = getRangeIndexes(sheet.topLeftCell);
        var rowIdx = this.isColSelected ? topLeftIdx[0] : range[0];
        var colIdx = this.isRowSelected ? topLeftIdx[1] : range[1];
        sheet.activeCell = getCellAddress(rowIdx, colIdx);
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        locateElem(this.getActiveCell(), getRangeIndexes(sheet.activeCell), sheet, this.parent.enableRtl);
        this.parent.notify(activeCellChanged, [rowIdx, colIdx]);
    };
    Selection.prototype.getSelectionElement = function () {
        return this.parent.element.getElementsByClassName('e-selection')[0];
    };
    Selection.prototype.getActiveCell = function () {
        return this.parent.getMainContent().getElementsByClassName('e-active-cell')[0];
    };
    Selection.prototype.getSheetElement = function () {
        return document.getElementById(this.parent.element.id + '_sheet');
    };
    Selection.prototype.highlightHdr = function (range, isRowRefresh, isColRefresh) {
        if (isRowRefresh === void 0) { isRowRefresh = true; }
        if (isColRefresh === void 0) { isColRefresh = true; }
        if (this.parent.getActiveSheet().showHeaders) {
            var rowHdr = [];
            var colHdr = [];
            var swapRange = getSwapRange(range);
            swapRange = this.getHdrIndexes(swapRange);
            var selectAll = this.parent.element.getElementsByClassName('e-select-all-cell')[0];
            removeClass(this.getSheetElement().querySelectorAll('.e-highlight'), 'e-highlight');
            removeClass(this.getSheetElement().querySelectorAll('.e-prev-highlight'), 'e-prev-highlight');
            removeClass([selectAll], ['e-prev-highlight-right', 'e-prev-highlight-bottom']);
            if (isRowRefresh) {
                rowHdr = [].slice.call(this.parent.getRowHeaderContent().querySelectorAll('td')).slice(swapRange[0], swapRange[2] + 1);
            }
            if (isColRefresh) {
                colHdr = [].slice.call(this.parent.getColumnHeaderContent().querySelectorAll('th')).slice(swapRange[1], swapRange[3] + 1);
            }
            addClass([].concat(rowHdr, colHdr), 'e-highlight');
            if (rowHdr.length && rowHdr[0].parentElement.previousElementSibling) {
                rowHdr[0].parentElement.previousElementSibling.classList.add('e-prev-highlight');
            }
            if (colHdr.length && colHdr[0].previousElementSibling) {
                colHdr[0].previousElementSibling.classList.add('e-prev-highlight');
            }
            if (this.isRowSelected && this.isColSelected) {
                document.getElementById(this.parent.element.id + "_select_all").classList.add('e-highlight');
            }
            if (swapRange[0] === 0) {
                selectAll.classList.add('e-prev-highlight-bottom');
            }
            if (swapRange[1] === 0) {
                selectAll.classList.add('e-prev-highlight-right');
            }
        }
    };
    Selection.prototype.getHdrIndexes = function (range) {
        if (this.parent.scrollSettings.enableVirtualization) {
            var indexes = [];
            indexes[0] = this.isColSelected ? range[0] : (range[0] - this.parent.viewport.topIndex) < 0
                ? 0 : (range[0] - this.parent.viewport.topIndex);
            indexes[1] = this.isRowSelected ? range[1] : (range[1] - this.parent.viewport.leftIndex) < 0
                ? 0 : (range[1] - this.parent.viewport.leftIndex);
            indexes[2] = this.isColSelected ? this.parent.viewport.rowCount + this.parent.getThreshold('row') * 2 : indexes[0] === 0
                ? range[2] - this.parent.viewport.topIndex : range[2] - range[0] + indexes[0];
            indexes[3] = this.isRowSelected ? this.parent.viewport.colCount + this.parent.getThreshold('col') * 2 : indexes[1] === 0
                ? range[3] - this.parent.viewport.leftIndex : range[3] - range[1] + indexes[1];
            return indexes;
        }
        return range;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    Selection.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return Selection;
}());

/**
 * The `Scroll` module is used to handle scrolling behavior.
 * @hidden
 */
var Scroll = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the Spreadsheet scroll module.
     * @private
     */
    function Scroll(parent) {
        this.parent = parent;
        this.addEventListener();
        this.initProps();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    Scroll.prototype.onContentScroll = function (e) {
        var target = this.parent.getMainContent();
        var scrollLeft = e.scrollLeft || target.scrollLeft;
        var top = e.scrollTop || target.scrollTop;
        var left = this.parent.enableRtl ? this.initScrollValue - scrollLeft : scrollLeft;
        var scrollArgs;
        var prevSize;
        if (this.prevScroll.scrollLeft !== left) {
            var scrollRight = left > this.prevScroll.scrollLeft;
            prevSize = this.offset.left.size;
            this.offset.left = this.getColOffset(left, prevSize, scrollRight);
            if (this.parent.getActiveSheet().showHeaders) {
                this.parent.getColumnHeaderContent().scrollLeft = scrollLeft;
            }
            scrollArgs = {
                cur: this.offset.left, prev: { idx: this.leftIndex, size: prevSize }, increase: scrollRight, preventScroll: e.preventScroll
            };
            this.parent.notify(onHorizontalScroll, scrollArgs);
            this.updateTopLeftCell();
            if (!this.parent.scrollSettings.enableVirtualization && scrollRight && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualCols();
            }
            this.leftIndex = scrollArgs.prev.idx;
            this.prevScroll.scrollLeft = left;
        }
        if (this.prevScroll.scrollTop !== top) {
            var scrollDown = top > this.prevScroll.scrollTop;
            prevSize = this.offset.top.size;
            this.offset.top = this.getRowOffset(top, scrollDown);
            if (this.parent.getActiveSheet().showHeaders) {
                this.parent.getRowHeaderContent().scrollTop = top;
            }
            scrollArgs = {
                cur: this.offset.top, prev: { idx: this.topIndex, size: prevSize }, increase: scrollDown, preventScroll: e.preventScroll
            };
            this.parent.notify(onVerticalScroll, scrollArgs);
            this.updateTopLeftCell();
            if (!this.parent.scrollSettings.enableVirtualization && scrollDown && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualRows();
            }
            this.topIndex = scrollArgs.prev.idx;
            this.prevScroll.scrollTop = top;
        }
    };
    Scroll.prototype.updateNonVirtualRows = function () {
        var sheet = this.parent.getActiveSheet();
        var threshold = this.parent.getThreshold('row');
        if (this.offset.top.idx > sheet.rowCount - (this.parent.viewport.rowCount + threshold)) {
            this.parent.renderModule.refreshUI({ colIndex: 0, direction: 'first', refresh: 'RowPart' }, getCellAddress(sheet.rowCount, 0) + ":" + getCellAddress(sheet.rowCount + threshold - 1, sheet.colCount - 1));
            sheet.rowCount += threshold;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    };
    Scroll.prototype.updateNonVirtualCols = function () {
        var sheet = this.parent.getActiveSheet();
        var threshold = this.parent.getThreshold('col');
        if (this.offset.left.idx > sheet.colCount - (this.parent.viewport.colCount + threshold)) {
            this.parent.renderModule.refreshUI({ rowIndex: 0, colIndex: sheet.colCount, direction: 'first', refresh: 'ColumnPart' }, getCellAddress(0, sheet.colCount) + ":" + getCellAddress(sheet.rowCount - 1, sheet.colCount + threshold - 1));
            sheet.colCount += threshold;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    };
    Scroll.prototype.updateTopLeftCell = function () {
        this.parent.getActiveSheet().topLeftCell = getCellAddress(this.offset.top.idx, this.offset.left.idx);
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
    };
    Scroll.prototype.getRowOffset = function (scrollTop, scrollDown) {
        var temp = this.offset.top.size;
        var sheet = this.parent.getActiveSheet();
        var i = scrollDown ? this.offset.top.idx + 1 : (this.offset.top.idx ? this.offset.top.idx - 1 : 0);
        var count;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.rowCount;
            if (scrollDown && i + this.parent.viewport.rowCount + this.parent.getThreshold('row') >= count) {
                return { idx: this.offset.top.idx, size: this.offset.top.size };
            }
        }
        else {
            count = Infinity;
        }
        while (i < count) {
            if (scrollDown) {
                temp += getRowHeight(sheet, i - 1);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollTop) {
                    return { idx: i - 1, size: temp - getRowHeight(sheet, i - 1) };
                }
                i++;
            }
            else {
                if (temp === 0) {
                    return { idx: 0, size: 0 };
                }
                temp -= getRowHeight(sheet, i);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollTop) {
                    temp += getRowHeight(sheet, i);
                    if (temp > scrollTop) {
                        return { idx: i, size: temp - getRowHeight(sheet, i) };
                    }
                    else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.top.idx, size: this.offset.top.size };
    };
    Scroll.prototype.getColOffset = function (scrollLeft, width, increase) {
        var temp = width;
        var sheet = this.parent.getActiveSheet();
        var i = increase ? this.offset.left.idx + 1 : this.offset.left.idx - 1;
        var count;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.colCount;
            if (increase && i + this.parent.viewport.colCount + this.parent.getThreshold('col') >= count) {
                return { idx: this.offset.left.idx, size: this.offset.left.size };
            }
        }
        else {
            count = Infinity;
        }
        while (i < count) {
            if (increase) {
                temp += getColumnWidth(sheet, i - 1);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollLeft) {
                    return { idx: i - 1, size: temp - getColumnWidth(sheet, i - 1) };
                }
                i++;
            }
            else {
                if (temp === 0) {
                    return { idx: 0, size: 0 };
                }
                temp -= getColumnWidth(sheet, i);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollLeft) {
                    temp += getColumnWidth(sheet, i);
                    if (temp > scrollLeft) {
                        return { idx: i, size: temp - getColumnWidth(sheet, i) };
                    }
                    else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.left.idx, size: this.offset.left.size };
    };
    Scroll.prototype.wireEvents = function () {
        this.onScroll = this.onContentScroll.bind(this);
        EventHandler.add(this.parent.getMainContent(), 'scroll', this.onScroll, this);
        if (this.parent.enableRtl) {
            this.initScrollValue = this.parent.getMainContent().scrollLeft;
        }
    };
    Scroll.prototype.initProps = function () {
        this.topIndex = 0;
        this.leftIndex = 0;
        this.prevScroll = { scrollLeft: 0, scrollTop: 0 };
        this.offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    };
    Scroll.prototype.getThreshold = function () {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        if (Browser.info.name === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        if (!this.parent.allowScrolling) {
            return;
        }
        var colHeader = this.parent.getColumnHeaderContent();
        var rowHeader = this.parent.getRowHeaderContent();
        var scrollWidth = getScrollBarWidth() - this.getThreshold();
        var cssProps = this.parent.enableRtl ? { padding: 'paddingLeft', border: 'borderLeftWidth' }
            : { padding: 'paddingRight', border: 'borderRightWidth' };
        if (scrollWidth > 0) {
            colHeader.parentElement.style[cssProps.padding] = scrollWidth + 'px';
            colHeader.style[cssProps.border] = '1px';
            rowHeader.style.marginBottom = scrollWidth + 'px';
        }
    };
    Scroll.prototype.addEventListener = function () {
        this.parent.on(contentLoaded, this.wireEvents, this);
        this.parent.on(onContentScroll, this.onContentScroll, this);
        this.parent.on(deInitProperties, this.initProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    Scroll.prototype.destroy = function () {
        EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
        this.removeEventListener();
        this.parent = null;
    };
    Scroll.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(onContentScroll, this.onContentScroll);
            this.parent.off(deInitProperties, this.initProps);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    };
    return Scroll;
}());

/**
 * VirtualScroll module
 * @hidden
 */
var VirtualScroll = /** @__PURE__ @class */ (function () {
    function VirtualScroll(parent) {
        this.scroll = [];
        this.parent = parent;
        this.addEventListener();
    }
    VirtualScroll.prototype.getModuleName = function () {
        return 'virtualscroll';
    };
    VirtualScroll.prototype.createVirtualElement = function (args) {
        var sheet = this.parent.getActiveSheet();
        var container = this.parent.getMainContent();
        this.content = this.parent.createElement('div', { className: 'e-virtualable' });
        this.content.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.content);
        var vTrack = container.appendChild(this.parent.createElement('div', { className: 'e-virtualtrack' }));
        var colVTrack;
        var rowVTrack;
        var height;
        var width;
        if (this.parent.sheets.length > this.scroll.length) {
            this.initScroll();
        }
        var domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (sheet.rowCount > domCount || sheet.usedRange.rowIndex > domCount) {
            if (sheet.rowCount < sheet.usedRange.rowIndex) {
                sheet.rowCount = sheet.usedRange.rowIndex;
            }
            this.setScrollCount(sheet.rowCount, 'row');
            height = getRowsHeight(sheet, domCount, this.scroll[this.parent.activeSheetTab - 1].rowCount - 1);
        }
        else {
            this.scroll[this.parent.activeSheetTab - 1].rowCount = sheet.rowCount = domCount;
            height = 1;
        }
        domCount = this.parent.viewport.colCount + 1 + (this.parent.getThreshold('col') * 2);
        var size = getColumnsWidth(sheet, 0, domCount - 1);
        if (sheet.colCount > domCount) {
            if (sheet.colCount < sheet.usedRange.colIndex) {
                sheet.colCount = sheet.usedRange.colIndex;
            }
            this.setScrollCount(sheet.colCount, 'col');
            width = size + getColumnsWidth(sheet, domCount, this.scroll[this.parent.activeSheetTab - 1].colCount - 1);
        }
        else {
            sheet.colCount = domCount;
            width = size;
        }
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        if (args.startColIdx) {
            size = getColumnsWidth(sheet, args.startColIdx, args.startColIdx + domCount - 1);
        }
        if (isNullOrUndefined(this.translateX)) {
            this.parent.viewport.leftIndex = 0;
            this.translateX = 0;
        }
        if (isNullOrUndefined(this.translateY)) {
            this.parent.viewport.topIndex = 0;
            this.translateY = 0;
        }
        if (sheet.showHeaders) {
            container = this.parent.getRowHeaderContent();
            this.rowHeader = this.content.cloneNode();
            this.rowHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.rowHeader);
            rowVTrack = container.appendChild(vTrack.cloneNode());
            this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
            container = this.parent.getColumnHeaderContent();
            this.colHeader = this.content.cloneNode();
            this.colHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.colHeader);
            colVTrack = container.appendChild(vTrack.cloneNode());
            this.colHeader.style.width = size + "px";
            rowVTrack.style.height = height + "px";
            colVTrack.style.width = width + "px";
            this.colHeader.style.transform = "translate(" + this.translateX + "px, 0px)";
        }
        this.content.style.transform = "translate(" + this.translateX + "px, " + this.translateY + "px)";
        this.content.style.width = size + "px";
        vTrack.style.height = height + "px";
        vTrack.style.width = width + "px";
    };
    VirtualScroll.prototype.initScroll = function () {
        var i = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i]) {
                this.scroll.push({ rowCount: 0, colCount: 0 });
            }
            i++;
        }
    };
    VirtualScroll.prototype.setScrollCount = function (count, layout) {
        var activeSheetIdx = this.parent.activeSheetTab - 1;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) {
            this.scroll[activeSheetIdx][layout + 'Count'] = count;
        }
    };
    VirtualScroll.prototype.getAddress = function (topIdx) {
        return getCellAddress(topIdx[0], this.parent.viewport.leftIndex) + ":" + getCellAddress(topIdx[1], this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2));
    };
    VirtualScroll.prototype.getColAddress = function (leftIdx) {
        return getCellAddress(this.parent.viewport.topIndex, leftIdx[0]) + ":" + getCellAddress(this.parent.viewport.topIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2), leftIdx[1]);
    };
    VirtualScroll.prototype.updateScrollCount = function (idx, layout, threshold) {
        if (threshold === void 0) { threshold = idx; }
        var sheet = this.parent.getActiveSheet();
        var rowCount = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        var usedRangeCount = this.scroll[this.parent.activeSheetTab - 1][layout + 'Count'];
        if (rowCount < usedRangeCount) {
            if (sheet[layout + 'Count'] === usedRangeCount) {
                return;
            }
            rowCount = usedRangeCount;
        }
        if (!this.parent.scrollSettings.isFinite) {
            sheet[layout + 'Count'] = rowCount;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    };
    VirtualScroll.prototype.onVerticalScroll = function (args) {
        var idx = args.cur.idx;
        var height = args.cur.size;
        var prevIdx = args.prev.idx;
        var idxDiff = Math.abs(idx - prevIdx);
        var threshold = this.parent.getThreshold('row');
        if (idxDiff > Math.round(threshold / 2)) {
            if (idx <= threshold) {
                if (!args.increase) {
                    this.updateScrollCount(threshold, 'row');
                    if (this.translateY && prevIdx > threshold) {
                        this.translateY = 0;
                        this.parent.viewport.topIndex = prevIdx - threshold;
                        if (!args.preventScroll) {
                            if (idxDiff < this.parent.viewport.rowCount + threshold) {
                                this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, direction: 'last', refresh: 'RowPart' }, this.getAddress([0, this.parent.viewport.topIndex - 1]));
                            }
                            else {
                                this.parent.renderModule.refreshUI({ rowIndex: 0, colIndex: this.parent.viewport.leftIndex, refresh: 'Row' });
                            }
                        }
                        this.parent.viewport.topIndex = 0;
                    }
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                this.updateScrollCount(args.cur.idx, 'row', threshold);
                this.parent.viewport.topIndex = idx - threshold;
                this.translateY = height - this.getThresholdHeight(this.parent.viewport.topIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.rowCount + threshold) {
                        if (args.increase) {
                            var lastIdx = this.parent.viewport.topIndex + this.parent.viewport.rowCount + (threshold * 2);
                            this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, direction: 'first', refresh: 'RowPart' }, this.getAddress([lastIdx - idxDiff + 1, this.checkLastIdx(lastIdx, 'row')]));
                        }
                        else {
                            this.parent.renderModule.refreshUI({ colIndex: this.parent.viewport.leftIndex, direction: 'last', refresh: 'RowPart' }, this.getAddress([this.parent.viewport.topIndex, this.parent.viewport.topIndex + idxDiff - 1]));
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex,
                            colIndex: this.parent.viewport.leftIndex, refresh: 'Row'
                        });
                    }
                }
            }
            args.prev.idx = idx;
        }
    };
    VirtualScroll.prototype.checkLastIdx = function (idx, layout) {
        if (this.parent.scrollSettings.isFinite) {
            var count = this.parent.getActiveSheet()[layout + 'Count'] - 1;
            if (idx > count) {
                idx = count;
            }
        }
        return idx;
    };
    VirtualScroll.prototype.onHorizontalScroll = function (args) {
        var idx = args.cur.idx;
        var width = args.cur.size;
        var prevIdx = args.prev.idx;
        var idxDiff = Math.abs(idx - prevIdx);
        var threshold = this.parent.getThreshold('col');
        if (idxDiff > Math.round(threshold / 2)) {
            if (idx <= threshold) {
                if (!args.increase) {
                    this.updateScrollCount(threshold, 'col');
                    if (this.translateX && prevIdx > threshold) {
                        this.translateX = 0;
                        this.parent.viewport.leftIndex = prevIdx - threshold;
                        if (idxDiff < this.parent.viewport.rowCount + threshold) {
                            this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: 0, direction: 'last', refresh: 'ColumnPart' }, this.getColAddress([0, this.parent.viewport.leftIndex - 1]));
                        }
                        else {
                            this.parent.renderModule.refreshUI({ rowIndex: this.parent.viewport.topIndex, colIndex: 0, refresh: 'Column' });
                        }
                        this.parent.viewport.leftIndex = 0;
                    }
                }
            }
            if (prevIdx < threshold) {
                idxDiff = Math.abs(idx - threshold);
            }
            if (idx > threshold) {
                this.updateScrollCount(args.cur.idx, 'col', threshold);
                this.parent.viewport.leftIndex = idx - threshold;
                this.translateX = width - this.getThresholdWidth(this.parent.viewport.leftIndex, threshold);
                if (!args.preventScroll) {
                    if (idxDiff < this.parent.viewport.colCount + threshold) {
                        if (args.increase) {
                            var lastIdx = this.parent.viewport.leftIndex + this.parent.viewport.colCount + (threshold * 2);
                            this.parent.renderModule.refreshUI({
                                rowIndex: this.parent.viewport.topIndex, colIndex: lastIdx - idxDiff + 1,
                                direction: 'first', refresh: 'ColumnPart'
                            }, this.getColAddress([lastIdx - idxDiff + 1, this.checkLastIdx(lastIdx, 'col')]));
                        }
                        else {
                            this.parent.renderModule.refreshUI({
                                rowIndex: this.parent.viewport.topIndex, colIndex: this.parent.viewport.leftIndex,
                                direction: 'last', refresh: 'ColumnPart'
                            }, this.getColAddress([this.parent.viewport.leftIndex, this.parent.viewport.leftIndex + idxDiff - 1]));
                        }
                    }
                    else {
                        this.parent.renderModule.refreshUI({
                            rowIndex: this.parent.viewport.topIndex,
                            colIndex: this.parent.viewport.leftIndex, refresh: 'Column'
                        });
                    }
                }
            }
            args.prev.idx = idx;
        }
    };
    VirtualScroll.prototype.getThresholdHeight = function (idx, threshold) {
        var height = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = idx; i < idx + threshold; i++) {
            height += getRowHeight(sheet, i);
        }
        return height;
    };
    VirtualScroll.prototype.getThresholdWidth = function (idx, threshold) {
        var width = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = idx; i < idx + threshold; i++) {
            width += getColumnWidth(sheet, i);
        }
        return width;
    };
    VirtualScroll.prototype.translate = function (args) {
        var sheet = this.parent.getActiveSheet();
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = "translate(" + this.translateX + "px, " + this.translateY + "px)";
            if (sheet.showHeaders) {
                this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
            }
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            var translateX = this.parent.enableRtl ? -this.translateX : this.translateX;
            this.content.style.transform = "translate(" + translateX + "px, " + this.translateY + "px)";
            if (sheet.showHeaders) {
                this.colHeader.style.transform = "translate(" + translateX + "px, 0px)";
            }
        }
    };
    VirtualScroll.prototype.updateColumnWidth = function (args) {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            var width = this.content.querySelector('tr').getBoundingClientRect().width;
            if (this.parent.getActiveSheet().showHeaders) {
                this.colHeader.style.width = width + 'px';
            }
            this.content.style.width = width + 'px';
        }
    };
    VirtualScroll.prototype.updateUsedRange = function (args) {
        if (!this.scroll.length) {
            return;
        }
        var sheet = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index > this.scroll[this.parent.activeSheetTab - 1].rowCount) {
                var height = this.getVTrackHeight('height');
                height += getRowsHeight(sheet, this.scroll[this.parent.activeSheetTab - 1].rowCount, args.index);
                this.scroll[this.parent.activeSheetTab - 1].rowCount = args.index + 1;
                this.updateVTrack(this.rowHeader, height, 'height');
                if (this.scroll[this.parent.activeSheetTab - 1].rowCount > sheet.rowCount) {
                    sheet.rowCount = this.scroll[this.parent.activeSheetTab - 1].rowCount;
                }
            }
        }
        else {
            if (args.index > this.scroll[this.parent.activeSheetTab - 1].colCount) {
                var width = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetTab - 1].colCount, args.index);
                this.scroll[this.parent.activeSheetTab - 1].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetTab - 1].colCount > sheet.colCount) {
                    sheet.colCount = this.scroll[this.parent.activeSheetTab - 1].colCount;
                }
            }
        }
    };
    VirtualScroll.prototype.createHeaderElement = function (args) {
        this.rowHeader = this.content.cloneNode();
        this.colHeader = this.rowHeader.cloneNode();
        this.rowHeader.style.width = '';
        this.rowHeader.style.transform = "translate(0px, " + this.translateY + "px)";
        this.colHeader.style.transform = "translate(" + (this.parent.enableRtl ? -this.translateX : this.translateX) + "px, 0px)";
        this.rowHeader.appendChild(args.element.querySelector('table'));
        args.element.appendChild(this.rowHeader);
        var container = this.parent.getColumnHeaderContent();
        this.colHeader.appendChild(container.querySelector('table'));
        container.appendChild(this.colHeader);
        var rowVTrack = this.content.nextElementSibling.cloneNode();
        var colVTrack = rowVTrack.cloneNode();
        rowVTrack.style.width = '';
        colVTrack.style.height = '';
        args.element.appendChild(rowVTrack);
        container.appendChild(colVTrack);
    };
    VirtualScroll.prototype.getVTrackHeight = function (str) {
        return parseInt(this.content.nextElementSibling.style[str], 10);
    };
    VirtualScroll.prototype.updateVTrackHeight = function (args) {
        var domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetTab - 1].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    };
    VirtualScroll.prototype.updateVTrackWidth = function (args) {
        if (args.colIdx < this.parent.getActiveSheet().colCount) {
            var hdrVTrack = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0];
            hdrVTrack.style.width = parseInt(hdrVTrack.style.width, 10) + args.threshold + 'px';
            var cntVTrack = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0];
            cntVTrack.style.width = parseInt(cntVTrack.style.width, 10) + args.threshold + 'px';
            var hdrColumn = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0];
            hdrColumn.style.width = parseInt(hdrColumn.style.width, 10) + args.threshold + 'px';
            var cntColumn = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0];
            cntColumn.style.width = parseInt(cntColumn.style.width, 10) + args.threshold + 'px';
        }
    };
    VirtualScroll.prototype.updateVTrack = function (header, size, sizeStr) {
        if (this.parent.getActiveSheet().showHeaders) {
            header.nextElementSibling.style[sizeStr] = size + "px";
        }
        this.content.nextElementSibling.style[sizeStr] = size + "px";
    };
    VirtualScroll.prototype.deInitProps = function () {
        this.parent.viewport.leftIndex = null;
        this.parent.viewport.topIndex = null;
        this.translateX = null;
        this.translateY = null;
    };
    VirtualScroll.prototype.updateScrollProps = function (args) {
        if (args === void 0) { args = { sheetIndex: 0 }; }
        if (this.scroll.length === 0) {
            this.initScroll();
        }
        else {
            this.scroll.splice(args.sheetIndex, 0, { rowCount: 0, colCount: 0 });
        }
    };
    VirtualScroll.prototype.sliceScrollProps = function (args) {
        if (isNullOrUndefined(args.sheetIndex)) {
            this.scroll.length = 0;
        }
        else {
            this.scroll.splice(args.sheetIndex, 1);
        }
    };
    VirtualScroll.prototype.addEventListener = function () {
        this.parent.on(beforeContentLoaded, this.createVirtualElement, this);
        this.parent.on(beforeVirtualContentLoaded, this.translate, this);
        this.parent.on(virtualContentLoaded, this.updateColumnWidth, this);
        this.parent.on(onVerticalScroll, this.onVerticalScroll, this);
        this.parent.on(onHorizontalScroll, this.onHorizontalScroll, this);
        this.parent.on(updateUsedRange, this.updateUsedRange, this);
        this.parent.on(rowHeightChanged, this.updateVTrackHeight, this);
        this.parent.on(colWidthChanged, this.updateVTrackWidth, this);
        this.parent.on(beforeHeaderLoaded, this.createHeaderElement, this);
        this.parent.on(deInitProperties, this.deInitProps, this);
        this.parent.on(sheetsDestroyed, this.sliceScrollProps, this);
        this.parent.on(sheetCreated, this.updateScrollProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    VirtualScroll.prototype.destroy = function () {
        this.removeEventListener();
        this.rowHeader = null;
        this.colHeader = null;
        this.content = null;
        this.parent = null;
        this.scroll.length = 0;
        this.translateX = null;
        this.translateY = null;
    };
    VirtualScroll.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(beforeContentLoaded, this.createVirtualElement);
            this.parent.off(beforeVirtualContentLoaded, this.translate);
            this.parent.off(virtualContentLoaded, this.updateColumnWidth);
            this.parent.off(onVerticalScroll, this.onVerticalScroll);
            this.parent.off(onHorizontalScroll, this.onHorizontalScroll);
            this.parent.off(updateUsedRange, this.updateUsedRange);
            this.parent.off(rowHeightChanged, this.updateVTrackHeight);
            this.parent.off(colWidthChanged, this.updateVTrackWidth);
            this.parent.off(beforeHeaderLoaded, this.createHeaderElement);
            this.parent.off(sheetsDestroyed, this.sliceScrollProps);
            this.parent.off(sheetCreated, this.updateScrollProps);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    };
    return VirtualScroll;
}());

/**
 * Represents keyboard navigation support for Spreadsheet.
 */
var KeyboardNavigation = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the Spreadsheet Keyboard Navigation module.
     * @private
     */
    function KeyboardNavigation(parent) {
        this.parent = parent;
        this.addEventListener();
        /* code snippet */
    }
    KeyboardNavigation.prototype.addEventListener = function () {
        this.parent.on(keyDown, this.keyDownHandler, this);
        /* code snippet */
    };
    KeyboardNavigation.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
        /* code snippet */
    };
    KeyboardNavigation.prototype.keyDownHandler = function (e) {
        if (!this.parent.isEdit && (document.activeElement.classList.contains('e-spreadsheet') ||
            closest(document.activeElement, '.e-sheet'))) {
            var isNavigate = void 0;
            var scrollIdxes = void 0;
            var sheet = this.parent.getActiveSheet();
            var actIdxes = getCellIndexes(this.parent.getActiveSheet().activeCell);
            if ([9, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if ((!e.shiftKey && e.keyCode === 37) || (e.shiftKey && e.keyCode === 9)) { //left key
                if (actIdxes[1] > 0) {
                    actIdxes[1] -= 1;
                    isNavigate = true;
                }
                else {
                    var content = this.parent.getMainContent();
                    if (actIdxes[1] === 0 && content.scrollLeft) {
                        content.scrollLeft = 0;
                    }
                }
            }
            else if ((!e.shiftKey && e.keyCode === 38) || (e.shiftKey && e.keyCode === 13)) { // Up key
                if (actIdxes[0] > 0) {
                    actIdxes[0] -= 1;
                    isNavigate = true;
                }
                else {
                    var content = this.parent.getMainContent();
                    if (actIdxes[0] === 0 && content.scrollTop) {
                        content.scrollTop = 0;
                    }
                }
            }
            else if ((!e.shiftKey && e.keyCode === 39) || e.keyCode === 9) { // Right key
                if (actIdxes[1] < sheet.colCount - 1) {
                    actIdxes[1] += 1;
                    isNavigate = true;
                }
            }
            else if ((!e.shiftKey && e.keyCode === 40) || e.keyCode === 13) { // Down Key
                if (actIdxes[0] < sheet.rowCount - 1) {
                    actIdxes[0] += 1;
                    isNavigate = true;
                }
            }
            /* else if (e.keyCode === 36) {
                actIdxes[1] = 0;
                if (e.ctrlKey) {
                    actIdxes[0] = 0;
                }
                isNavigate = true;
                e.preventDefault();
            } else if (e.keyCode === 35 && e.ctrlKey) {
                actIdxes = [sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
                scrollIdxes = [sheet.usedRange.rowIndex - this.parent.viewport.rowCount,
                    sheet.usedRange.colIndex - this.parent.viewport.colCount];
                isNavigate = true;
                e.preventDefault();
            } */
            if (isNavigate) {
                this.scrollNavigation(scrollIdxes || actIdxes, scrollIdxes ? true : false);
                sheet.activeCell = getRangeAddress(actIdxes);
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                this.parent.notify(cellNavigate, { range: actIdxes });
            }
        }
        var target = e.target;
        if (target.classList.contains('e-sheet-rename')) {
            if (e.keyCode === 32) {
                e.stopPropagation();
            }
            else if (e.keyCode === 13 || e.keyCode === 27) {
                this.parent.notify(renameSheet, e);
            }
        }
    };
    KeyboardNavigation.prototype.scrollNavigation = function (actIdxes, isScroll) {
        var cont = this.parent.getMainContent();
        var sheet = this.parent.getActiveSheet();
        var prevActIdxes = getCellIndexes(sheet.activeCell);
        var topLeftIdxes = getCellIndexes(sheet.topLeftCell);
        if (this.getBottomIdx(topLeftIdxes) <= actIdxes[0] || isScroll) {
            cont.scrollTop += getRowHeight(sheet, actIdxes[0]);
        }
        else if (topLeftIdxes[0] > actIdxes[0]) {
            cont.scrollTop -= getRowHeight(sheet, actIdxes[0]);
        }
        if (this.getRightIdx(topLeftIdxes) <= actIdxes[1] || isScroll) {
            cont.scrollLeft += getColumnWidth(sheet, actIdxes[1]);
        }
        else if (topLeftIdxes[1] > actIdxes[1]) {
            cont.scrollLeft -= getColumnWidth(sheet, actIdxes[1]);
        }
    };
    KeyboardNavigation.prototype.getBottomIdx = function (topLeftIdxes) {
        var hgt = 0;
        var sheet = this.parent.getActiveSheet();
        for (var i = topLeftIdxes[0];; i++) {
            hgt += getRowHeight(sheet, i);
            if (hgt >= this.parent.viewport.height - 17) {
                return i;
            }
        }
    };
    KeyboardNavigation.prototype.getRightIdx = function (topLeftIdxes) {
        var width = 0;
        var sheet = this.parent.getActiveSheet();
        var contWidth = this.parent.getMainContent().offsetWidth;
        for (var i = topLeftIdxes[1];; i++) {
            width += getColumnWidth(sheet, i);
            if (width >= contWidth - 17) {
                return i;
            }
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    KeyboardNavigation.prototype.getModuleName = function () {
        return 'keyboardNavigation';
    };
    KeyboardNavigation.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return KeyboardNavigation;
}());

/**
 * Represents keyboard shortcut support for Spreadsheet.
 */
var KeyboardShortcut = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the Spreadsheet Keyboard Shortcut module.
     * @private
     */
    function KeyboardShortcut(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    KeyboardShortcut.prototype.addEventListener = function () {
        this.parent.on(keyDown, this.keyDownHandler, this);
    };
    KeyboardShortcut.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
    };
    KeyboardShortcut.prototype.keyDownHandler = function (e) {
        if (e.ctrlKey) {
            if ([79, 83, 65].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if (e.keyCode === 79) {
                this.parent.element.querySelector('#' + this.parent.element.id + '_fileUpload').click();
            }
            else if (e.keyCode === 83) {
                this.parent.save();
            }
            else if (e.keyCode === 88) {
                this.parent.notify(cut, null);
            }
            else if (e.keyCode === 67) {
                this.parent.notify(copy, null);
            }
            else if (e.keyCode === 86) {
                this.parent.notify(paste, null);
            }
            else if (e.keyCode === 66) {
                e.preventDefault();
                var value = this.parent.getCellStyleValue(['fontWeight'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontWeight;
                value = value === 'bold' ? 'normal' : 'bold';
                this.parent.notify(setCellFormat, { style: { fontWeight: value }, onActionUpdate: true, refreshRibbon: true });
            }
            else if (e.keyCode === 73) {
                e.preventDefault();
                var value = this.parent.getCellStyleValue(['fontStyle'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontStyle;
                value = value === 'italic' ? 'normal' : 'italic';
                this.parent.notify(setCellFormat, { style: { fontStyle: value }, onActionUpdate: true, refreshRibbon: true });
            }
            else if (e.keyCode === 85) {
                e.preventDefault();
                this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'underline' }, refreshRibbon: true });
            }
            else if (e.keyCode === 53) {
                e.preventDefault();
                this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'line-through' }, refreshRibbon: true });
            }
        }
        if (e.keyCode === 27) {
            this.parent.notify(clearCopy, null);
        }
    };
    KeyboardShortcut.prototype.getModuleName = function () {
        return 'keyboardShortcut';
    };
    KeyboardShortcut.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return KeyboardShortcut;
}());

/**
 * CellFormat module allows to format the cell styles.
 */
var CellFormat = /** @__PURE__ @class */ (function () {
    function CellFormat(parent) {
        this.checkHeight = false;
        //Spreadsheet.Inject(WorkbookCellFormat);
        this.parent = parent;
        this.row = parent.createElement('tr', { className: 'e-row' });
        this.addEventListener();
    }
    CellFormat.prototype.applyCellFormat = function (args) {
        var keys = Object.keys(args.style);
        if (args.lastCell && !this.row.childElementCount && !keys.length) {
            return;
        }
        var cell = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            Object.assign(cell.style, args.style);
            if (args.isHeightCheckNeeded) {
                if (!args.manualUpdate) {
                    if (this.isHeightCheckNeeded(args.style)) {
                        var clonedCell = cell.cloneNode(true);
                        if (!clonedCell.innerHTML) {
                            clonedCell.textContent = 'Test';
                        }
                        this.row.appendChild(clonedCell);
                    }
                    if (args.lastCell && this.row.childElementCount) {
                        var sheet = this.parent.getActiveSheet();
                        var row = this.parent.getRow(args.rowIdx) || args.row;
                        var prevHeight = getRowHeight(sheet, args.rowIdx);
                        var height = this.getRowHeightOnInit();
                        if (height > prevHeight) {
                            row.style.height = height + "px";
                            if (sheet.showHeaders) {
                                (this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable()) || args.hRow).style.height =
                                    height + "px";
                            }
                            setRowHeight(sheet, args.rowIdx, height);
                        }
                        this.row.innerHTML = '';
                    }
                }
                else {
                    var idx = void 0;
                    if (this.parent.scrollSettings.enableVirtualization) {
                        idx = args.rowIdx - this.parent.viewport.topIndex;
                    }
                    if (!this.checkHeight) {
                        this.checkHeight = this.isHeightCheckNeeded(args.style, args.onActionUpdate);
                    }
                    if (isNullOrUndefined(this.parent.getActiveSheet().rows[idx]) ||
                        isNullOrUndefined(this.parent.getActiveSheet().rows[idx].customHeight)) {
                        this.updateRowHeight(cell, args.rowIdx, args.lastCell, args.onActionUpdate);
                    }
                    else {
                        cell.parentElement.style.lineHeight = parseInt(cell.parentElement.style.height, 10) - 1 + 'px';
                    }
                }
            }
        }
        else {
            this.updateRowHeight(cell, args.rowIdx, true, args.onActionUpdate);
        }
    };
    CellFormat.prototype.updateRowHeight = function (cell, rowIdx, isLastCell, onActionUpdate) {
        if (this.checkHeight && isLastCell) {
            this.checkHeight = false;
            var sheet = this.parent.getActiveSheet();
            var row = this.parent.getRow(rowIdx);
            if (!row) {
                return;
            }
            if (!cell) {
                cell = row.lastElementChild;
            }
            var test = false;
            row.style.height = '';
            if (!cell.innerHTML) {
                cell.textContent = 'test';
                test = true;
            }
            var height = Math.ceil(row.getBoundingClientRect().height);
            if (test) {
                cell.textContent = '';
            }
            height = height < 20 ? 20 : height;
            var prevHeight = getRowHeight(sheet, rowIdx);
            var heightChanged = onActionUpdate ? height !== prevHeight : height > prevHeight;
            if (heightChanged) {
                row.style.height = height + "px";
                if (sheet.showHeaders) {
                    this.parent.getRow(rowIdx, this.parent.getRowHeaderTable()).style.height = height + "px";
                }
                setRowHeight(sheet, rowIdx, height);
                this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHeight });
            }
            else {
                row.style.height = prevHeight + "px";
            }
        }
    };
    CellFormat.prototype.isHeightCheckNeeded = function (style, onActionUpdate) {
        var keys = Object.keys(style);
        return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
            && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1;
    };
    CellFormat.prototype.getRowHeightOnInit = function () {
        var table = this.parent.createElement('table', { className: 'e-table e-test-table' });
        var tBody = table.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.row);
        this.parent.element.appendChild(table);
        var height = Math.round(this.row.getBoundingClientRect().height);
        this.parent.element.removeChild(table);
        return height < 20 ? 20 : height;
    };
    CellFormat.prototype.addEventListener = function () {
        this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
    };
    CellFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
        }
    };
    /**
     * Destroy cell format module.
     */
    CellFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
        this.row = null;
        this.checkHeight = null;
    };
    /**
     * Get the cell format module name.
     */
    CellFormat.prototype.getModuleName = function () {
        return 'cellformat';
    };
    return CellFormat;
}());

/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
var Resize = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for resize module in Spreadsheet.
     * @private
     */
    function Resize(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Resize.prototype.addEventListener = function () {
        this.parent.on(contentLoaded, this.wireEvents, this);
    };
    Resize.prototype.wireEvents = function () {
        var rowHeader = this.parent.getRowHeaderContent();
        var colHeader = this.parent.getColumnHeaderContent();
        EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        this.wireResizeCursorEvent(rowHeader, colHeader);
    };
    Resize.prototype.wireResizeCursorEvent = function (rowHeader, colHeader) {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    };
    Resize.prototype.unWireResizeCursorEvent = function () {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousemove', this.setTarget);
    };
    Resize.prototype.unwireEvents = function () {
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
        this.unWireResizeCursorEvent();
    };
    Resize.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
        }
    };
    Resize.prototype.mouseMoveHandler = function (e) {
        var sheetPanel = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        var colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        var rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
        if (colResizeHandler || rowResizeHandler) {
            if (colResizeHandler) {
                if (e.x > this.trgtEle.parentElement.firstChild.getBoundingClientRect().left) {
                    colResizeHandler.style.left = e.clientX - this.parent.element.getBoundingClientRect().left + 'px';
                }
            }
            else if (rowResizeHandler) {
                if (e.y >= this.trgtEle.parentElement.parentElement.firstChild.getBoundingClientRect().top) {
                    rowResizeHandler.style.top = e.clientY - sheetPanel.getBoundingClientRect().top + 'px';
                }
            }
        }
    };
    Resize.prototype.mouseDownHandler = function (e) {
        this.event = e;
        this.trgtEle = e.target;
        this.updateTarget(e, this.trgtEle);
        var trgt = this.trgtEle;
        var className = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    };
    Resize.prototype.mouseUpHandler = function (e) {
        var colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        var rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
        this.resizeOn(e);
        var resizeHandler = colResizeHandler ? colResizeHandler : rowResizeHandler;
        if (resizeHandler) {
            this.parent.element.getElementsByClassName('e-sheet-panel')[0].removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.getColumnHeaderContent());
    };
    Resize.prototype.dblClickHandler = function (e) {
        this.trgtEle = e.target;
        this.updateTarget(e, this.trgtEle);
        var trgt = this.trgtEle;
        if (trgt.classList.contains('e-colresize') || trgt.classList.contains('e-rowresize')) {
            var colIndx = parseInt(trgt.getAttribute('aria-colindex'), 10) - 1;
            var rowIndx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (trgt.classList.contains('e-colresize')) {
                this.setAutofit(colIndx, true);
            }
            else if (trgt.classList.contains('e-rowresize')) {
                this.setAutofit(rowIndx, false);
            }
        }
    };
    Resize.prototype.setTarget = function (e) {
        var trgt = e.target;
        var newTrgt;
        var tOffsetV;
        var eOffsetV;
        var tClass;
        if (closest(trgt, '.e-header-row')) {
            eOffsetV = e.offsetX;
            tOffsetV = trgt.offsetWidth;
            tClass = 'e-colresize';
            if (!isNullOrUndefined(trgt.previousElementSibling)) {
                newTrgt = trgt.previousElementSibling;
            }
        }
        else if (closest(trgt, '.e-row')) {
            eOffsetV = e.offsetY;
            tOffsetV = trgt.offsetHeight;
            tClass = 'e-rowresize';
            if (!isNullOrUndefined(trgt.parentElement.previousElementSibling)) {
                newTrgt =
                    trgt.parentElement.previousElementSibling.firstElementChild;
            }
        }
        if (tOffsetV - 2 < 8 && eOffsetV !== Math.ceil((tOffsetV - 2) / 2)) {
            if (eOffsetV < Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
                newTrgt.classList.add(tClass);
            }
            else if (eOffsetV > Math.ceil((tOffsetV - 2) / 2)) {
                trgt.classList.add(tClass);
            }
        }
        else if (tOffsetV - 5 < eOffsetV && eOffsetV <= tOffsetV && tOffsetV >= 10) {
            trgt.classList.add(tClass);
        }
        else if (eOffsetV < 5 && newTrgt && tOffsetV >= 10) {
            trgt.classList.add(tClass);
            newTrgt.classList.add(tClass);
        }
        else {
            var resEle = (tClass === 'e-colresize' ? trgt.parentElement.getElementsByClassName(tClass)
                : this.parent.getRowHeaderTable().getElementsByClassName(tClass));
            for (var index = 0; index < resEle.length; index++) {
                resEle[index].classList.remove(tClass);
            }
        }
    };
    Resize.prototype.updateTarget = function (e, trgt) {
        if (closest(trgt, '.e-header-row')) {
            if ((trgt.offsetWidth < 10 && e.offsetX < Math.ceil((trgt.offsetWidth - 2) / 2)) || (e.offsetX < 5 &&
                trgt.offsetWidth >= 10) && trgt.classList.contains('e-colresize') && trgt.previousElementSibling) {
                this.trgtEle = trgt.previousElementSibling;
            }
        }
        else if (closest(trgt, '.e-row')) {
            if ((trgt.offsetHeight < 10 && e.offsetY < Math.ceil((trgt.offsetHeight - 2) / 2)) || (e.offsetY < 5 &&
                trgt.offsetHeight >= 10) && trgt.classList.contains('e-rowresize') && trgt.parentElement.previousElementSibling) {
                this.trgtEle = trgt.parentElement.previousElementSibling.getElementsByClassName('e-header-cell')[0];
            }
        }
    };
    Resize.prototype.setAutofit = function (idx, isCol) {
        var index;
        var oldIdx = idx;
        if (this.parent.scrollSettings.enableVirtualization) {
            idx = isCol ? idx - this.parent.viewport.leftIndex : idx - this.parent.viewport.topIndex;
        }
        var sheet = this.parent.getActiveSheet();
        var mainContent = this.parent.getMainContent();
        var oldValue = isCol ?
            mainContent.getElementsByTagName('col')[idx].style.width : mainContent.getElementsByTagName('tr')[idx].style.height;
        var headerTable = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
        var contentRow = mainContent.getElementsByClassName('e-row');
        var contentClone = [];
        var contentTable = mainContent.getElementsByClassName('e-content-table')[0];
        var headerRow = headerTable.getElementsByTagName('tr');
        var headerText;
        if (isCol) {
            headerText = headerRow[0].getElementsByClassName('e-header-cell')[idx].cloneNode(true);
            for (index = 0; index < contentRow.length; index++) {
                contentClone[index] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true);
            }
        }
        else {
            headerText = headerRow[idx].getElementsByClassName('e-header-cell')[0].cloneNode(true);
            for (index = 0; index < contentRow[idx].getElementsByTagName('td').length; index++) {
                contentClone[index] = contentRow[idx].getElementsByTagName('td')[index].cloneNode(true);
            }
        }
        var headerFit = this.findMaxValue(headerTable, [headerText], isCol);
        var contentFit = this.findMaxValue(contentTable, contentClone, isCol);
        var autofitValue = headerFit < contentFit ? contentFit : headerFit;
        var threshold = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
            this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: oldIdx });
        }
        else {
            setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
            this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: oldIdx });
        }
        this.setResize(idx, autofitValue + 'px', isCol);
    };
    Resize.prototype.findMaxValue = function (table, text, isCol) {
        var myTableDiv = this.parent.createElement('div', { className: this.parent.element.className });
        var myTable = this.parent.createElement('table', {
            className: table.className + 'e-resizetable',
            styles: 'width: auto;height: auto'
        });
        var myTr = this.parent.createElement('tr');
        if (isCol) {
            text.forEach(function (element) {
                var tr = myTr.cloneNode();
                tr.appendChild(element);
                myTable.appendChild(tr);
            });
        }
        else {
            text.forEach(function (element) {
                myTr.appendChild(element.cloneNode(true));
            });
            myTable.appendChild(myTr);
        }
        myTableDiv.appendChild(myTable);
        document.body.appendChild(myTableDiv);
        var offsetWidthValue = myTable.getBoundingClientRect().width;
        var offsetHeightValue = myTable.getBoundingClientRect().height;
        document.body.removeChild(myTableDiv);
        if (isCol) {
            return Math.ceil(offsetWidthValue);
        }
        else {
            return Math.ceil(offsetHeightValue);
        }
    };
    Resize.prototype.createResizeHandler = function (trgt, className) {
        var editor = this.parent.createElement('div', { className: className });
        if (trgt.classList.contains('e-colresize')) {
            editor.style.height = this.parent.getMainContent().clientHeight + trgt.offsetHeight + 'px';
            editor.style.left = this.event.clientX - this.parent.element.getBoundingClientRect().left + 'px';
            editor.style.top = '0px';
        }
        else if (trgt.classList.contains('e-rowresize')) {
            editor.style.width = this.parent.getMainContent().clientWidth + trgt.offsetWidth + 'px';
            editor.style.left = '0px';
            editor.style.top = this.event.clientY
                - this.parent.element.getElementsByClassName('e-sheet-panel')[0].getBoundingClientRect().top + 'px';
        }
        this.parent.element.getElementsByClassName('e-sheet-panel')[0].appendChild(editor);
        this.updateCursor(this.event);
    };
    Resize.prototype.setColWidth = function (index, width) {
        var sheet = this.parent.getActiveSheet();
        var eleWidth = parseInt(this.parent.getMainContent().getElementsByTagName('col')[index].style.width, 10);
        var colWidth = width;
        var threshold = parseInt(colWidth, 10) - eleWidth;
        if (threshold < 0 && eleWidth < -(threshold)) {
            threshold = -eleWidth;
        }
        var oldIdx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
        this.parent.notify(colWidthChanged, { threshold: threshold, colIdx: oldIdx });
        this.setResize(index, colWidth, true);
        getColumn(sheet, index).width = parseInt(colWidth, 10) > 0 ? parseInt(colWidth, 10) : 0;
        sheet.columns[index].customWidth = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    };
    Resize.prototype.setRowHeight = function (index, height) {
        var eleHeight = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[index].style.height, 10);
        var rowHeight = height;
        var threshold = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        var oldIdx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
        this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: oldIdx });
        this.setResize(index, rowHeight, false);
        setRowHeight(this.parent.getActiveSheet(), index, parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0);
        this.parent.getActiveSheet().rows[index].customHeight = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    };
    Resize.prototype.resizeOn = function (e) {
        var idx;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = idx - this.parent.viewport.topIndex;
            }
            var rowHeight = e.clientY - this.event.clientY +
                parseInt(this.parent.getMainContent().getElementsByClassName('e-row')[idx].style.height, 10) + 'px';
            this.setRowHeight(idx, rowHeight);
        }
        else if (this.trgtEle.classList.contains('e-colresize')) {
            idx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = idx - this.parent.viewport.leftIndex;
            }
            var colWidth = e.clientX - this.event.clientX +
                parseInt(this.parent.getMainContent().getElementsByTagName('col')[idx].style.width, 10) + 'px';
            this.setColWidth(idx, colWidth);
        }
    };
    Resize.prototype.setWidthAndHeight = function (trgt, value, isCol) {
        if (isCol) {
            trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
        }
        else {
            trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Resize.prototype.setResize = function (index, value, isCol) {
        var curEle;
        var curEleH;
        var curEleC;
        var preEle;
        var preEleH;
        var preEleC;
        var nxtEle;
        var nxtEleH;
        var nxtEleC;
        var sheet = this.parent.getActiveSheet();
        if (isCol) {
            curEle = this.parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('th')[index];
            curEleH = this.parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('col')[index];
            curEleC = this.parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('col')[index];
        }
        else {
            curEle = this.parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleH = this.parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
            curEleC = this.parent.element.getElementsByClassName('e-main-content')[0].getElementsByTagName('tr')[index];
            curEleH.style.height = parseInt(value, 10) > 0 ? value : '2px';
            curEleC.style.height = parseInt(value, 10) > 0 ? value : '0px';
            var hdrRow = this.parent.getRowHeaderContent().getElementsByClassName('e-row');
            var hdrClone = [];
            hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true);
            var hdrFntSize = this.findMaxValue(this.parent.getRowHeaderTable(), hdrClone, false) + 1;
            var contentRow = this.parent.getMainContent().getElementsByClassName('e-row');
            var contentClone = [];
            for (var idx = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
                contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true);
            }
            var cntFntSize = this.findMaxValue(this.parent.getContentTable(), contentClone, false) + 1;
            var fntSize = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
            if (parseInt(curEleC.style.height, 10) < fntSize ||
                (curEle.classList.contains('e-reach-fntsize') && parseInt(curEleC.style.height, 10) === fntSize)) {
                curEle.classList.add('e-reach-fntsize');
                curEleH.style.lineHeight = parseInt(value, 10) >= 4 ? ((parseInt(value, 10)) - 4) + 'px' :
                    parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
                curEleC.style.lineHeight = parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
            }
            else {
                curEleH.style.removeProperty('line-height');
                curEleC.style.removeProperty('line-height');
                if (curEle.classList.contains('e-reach-fntsize')) {
                    curEle.classList.remove('e-reach-fntsize');
                }
            }
        }
        preEle = curEle.previousElementSibling;
        nxtEle = curEle.nextElementSibling;
        if (preEle) {
            preEle = curEle.previousElementSibling;
            preEleH = curEleH.previousElementSibling;
            preEleC = curEleC.previousElementSibling;
        }
        if (nxtEle) {
            nxtEle = curEle.nextElementSibling;
            nxtEleH = curEleH.nextElementSibling;
            nxtEleC = curEleC.nextElementSibling;
        }
        if (parseInt(value, 10) <= 0 && !(curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start'))) {
            if (preEle && nxtEle) {
                if (isCol) {
                    curEleH.style.width = '2px';
                    curEleC.style.width = '0px';
                }
                else {
                    curEleH.style.height = '2px';
                    curEleC.style.height = '0px';
                }
                if (preEle.classList.contains('e-zero-start')) {
                    curEle.classList.add('e-zero-start');
                    curEleC.classList.add('e-zero-start');
                }
                else {
                    curEle.classList.add('e-zero');
                    curEleC.classList.add('e-zero');
                }
                if (!nxtEle.classList.contains('e-zero') && !nxtEle.classList.contains('e-zero-last')) {
                    curEle.classList.add('e-zero-last');
                    curEleC.classList.add('e-zero-last');
                }
                if (preEle.classList.contains('e-zero-last')) {
                    preEle.classList.remove('e-zero-last');
                    preEleC.classList.remove('e-zero-last');
                }
                if (preEle.classList.contains('e-zero')) {
                    if (curEle.classList.contains('e-zero-end')) {
                        this.setWidthAndHeight(preEleH, -2, isCol);
                    }
                    else {
                        this.setWidthAndHeight(preEleH, -2, isCol);
                    }
                }
                else {
                    this.setWidthAndHeight(preEleH, -1, isCol);
                }
                if (preEle.classList.contains('e-zero-start')) {
                    this.setWidthAndHeight(curEleH, -1, isCol);
                }
                if (nxtEle.classList.contains('e-zero')) {
                    if (curEle.classList.contains('e-zero-start')) {
                        while (nxtEle) {
                            if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol) ||
                                (parseInt(nxtEleH.style.width, 10) !== 0 && isCol)) {
                                if (isCol) {
                                    curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                                    nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                                }
                                else {
                                    curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                                    nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                                }
                                nxtEle.classList.remove('e-zero');
                                nxtEle.classList.add('e-zero-start');
                                break;
                            }
                            else {
                                var nxtIndex = void 0;
                                nxtEle.classList.remove('e-zero');
                                nxtEle.classList.add('e-zero-start');
                                if (isCol) {
                                    nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                                    nxtEle = this.parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                                    nxtEleH = this.parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                                }
                                else {
                                    nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                    nxtEle = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                    nxtEleH = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                }
                            }
                        }
                    }
                    else {
                        this.setWidthAndHeight(curEleH, -2, isCol);
                    }
                }
                else {
                    if (nxtEle.classList.contains('e-zero-end')) {
                        if (isCol) {
                            curEleH.style.width = '0px';
                        }
                        else {
                            curEleH.style.height = '0px';
                        }
                    }
                    else {
                        this.setWidthAndHeight(nxtEleH, -1, isCol);
                    }
                }
            }
            else if (preEle) {
                if (isCol) {
                    curEleH.style.width = '1px';
                    curEleC.style.width = '0px';
                }
                else {
                    curEleH.style.height = '1px';
                    curEleC.style.height = '0px';
                }
                curEle.classList.add('e-zero-end');
                curEleC.classList.add('e-zero-end');
                curEle.classList.add('e-zero-last');
                curEleC.classList.add('e-zero-last');
                if (preEle.classList.contains('e-zero')) {
                    this.setWidthAndHeight(preEleH, -2, isCol);
                }
                else {
                    this.setWidthAndHeight(preEleH, -1, isCol);
                }
            }
            else if (nxtEle) {
                curEle.classList.add('e-zero-start');
                curEleC.classList.add('e-zero-start');
                if (!nxtEle.classList.contains('e-zero')) {
                    curEle.classList.add('e-zero-last');
                    curEleC.classList.add('e-zero-last');
                }
                if (isCol) {
                    curEleH.style.width = '1px';
                    curEleC.style.width = '0px';
                }
                else {
                    curEleH.style.height = '1px';
                    curEleC.style.height = '0px';
                }
                if (nxtEle.classList.contains('e-zero')) {
                    while (nxtEle) {
                        if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.width, 10) !== 0
                            && isCol) || (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol)) {
                            if (isCol) {
                                nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                                curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                            }
                            else {
                                nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                                curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                            }
                            nxtEle.classList.add('e-zero-start');
                            nxtEle.classList.remove('e-zero');
                            break;
                        }
                        else {
                            var nxtIndex = void 0;
                            nxtEle.classList.add('e-zero-start');
                            nxtEle.classList.remove('e-zero');
                            if (isCol) {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                                nxtEleH = this.parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                                nxtEle = this.parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                            }
                            else {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                nxtEleH = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                nxtEle = this.parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            }
                        }
                    }
                }
                else {
                    this.setWidthAndHeight(nxtEleH, -1, isCol);
                }
            }
        }
        else if (parseInt(value, 10) > 0) {
            if (isCol) {
                curEleH.style.width = value;
                curEleC.style.width = value;
            }
            else {
                curEleH.style.height = value;
                curEleC.style.height = value;
            }
            if (preEle && nxtEle) {
                if (preEle.classList.contains('e-zero')) {
                    if (curEle.classList.contains('e-zero')) {
                        if (isCol) {
                            preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        }
                        else {
                            preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        }
                    }
                    else {
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                }
                else {
                    if (curEle.classList.contains('e-zero')) {
                        this.setWidthAndHeight(preEleH, 1, isCol);
                    }
                    else {
                        if (curEle.classList.contains('e-zero-start')) {
                            if (isCol) {
                                preEleH.style.width = parseInt(preEleH.style.width, 10) + 1 + 'px';
                                curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                            }
                            else {
                                preEleH.style.height = parseInt(preEleH.style.height, 10) + 1 + 'px';
                                curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                            }
                        }
                    }
                }
                if (nxtEle.classList.contains('e-zero')) {
                    this.setWidthAndHeight(curEleH, -1, isCol);
                }
                else {
                    if (curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start')) {
                        this.setWidthAndHeight(nxtEleH, 1, isCol);
                    }
                }
                if (curEle.classList.contains('e-zero')) {
                    curEle.classList.remove('e-zero');
                }
                if (curEle.classList.contains('e-zero-start')) {
                    curEle.classList.remove('e-zero-start');
                }
                if (curEleC.classList.contains('e-zero')) {
                    curEleC.classList.remove('e-zero');
                }
                if (curEleC.classList.contains('e-zero-start')) {
                    curEleC.classList.remove('e-zero-start');
                }
                if (curEle.classList.contains('e-zero-last')) {
                    curEle.classList.remove('e-zero-last');
                }
                if (curEleC.classList.contains('e-zero-last')) {
                    curEleC.classList.remove('e-zero-last');
                }
                if (preEle.classList.contains('e-zero') || preEle.classList.contains('e-zero-start')) {
                    preEle.classList.add('e-zero-last');
                    preEleC.classList.add('e-zero-last');
                }
            }
            else if (preEle) {
                if (preEle.classList.contains('e-zero')) {
                    if (curEle.classList.contains('e-zero')) {
                        if (isCol) {
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                            preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                        }
                        else {
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                            preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                        }
                    }
                    else {
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                }
                else {
                    if (curEle.classList.contains('e-zero')) {
                        this.setWidthAndHeight(preEleH, 1, isCol);
                    }
                    else {
                        this.setWidthAndHeight(curEleH, -1, isCol);
                    }
                }
                if (curEle.classList.contains('e-zero')) {
                    curEle.classList.remove('e-zero');
                }
                if (curEle.classList.contains('e-zero-end')) {
                    curEle.classList.remove('e-zero-end');
                }
                if (curEleC.classList.contains('e-zero')) {
                    curEleC.classList.remove('e-zero');
                }
                if (curEleC.classList.contains('e-zero-end')) {
                    curEleC.classList.remove('e-zero-end');
                }
            }
            else if (nxtEle) {
                if (nxtEle.classList.contains('e-zero')) {
                    this.setWidthAndHeight(curEleH, -1, isCol);
                }
                else if (curEle.classList.contains('e-zero-start')) {
                    this.setWidthAndHeight(nxtEleH, 1, isCol);
                    curEle.classList.remove('e-zero-start');
                }
                if (curEle.classList.contains('e-zero')) {
                    curEle.classList.remove('e-zero');
                }
                if (curEleC.classList.contains('e-zero')) {
                    curEleC.classList.remove('e-zero');
                }
                if (curEle.classList.contains('e-zero-start')) {
                    curEle.classList.remove('e-zero-start');
                }
                if (curEleC.classList.contains('e-zero-start')) {
                    curEleC.classList.remove('e-zero-start');
                }
            }
        }
    };
    Resize.prototype.updateCursor = function (e) {
        if (this.parent.element.getElementsByClassName('e-colresize-handler')[0]) {
            this.parent.element.classList.add('e-col-resizing');
        }
        else if (this.parent.element.classList.contains('e-col-resizing')) {
            this.parent.element.classList.remove('e-col-resizing');
        }
        if (this.parent.element.getElementsByClassName('e-rowresize-handler')[0]) {
            this.parent.element.classList.add('e-row-resizing');
        }
        else if (this.parent.element.classList.contains('e-row-resizing')) {
            this.parent.element.classList.remove('e-row-resizing');
        }
    };
    /**
     * To destroy the resize module.
     * @return {void}
     */
    Resize.prototype.destroy = function () {
        this.unwireEvents();
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the module name.
     * @returns string
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    return Resize;
}());

/**
 *
 */

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * An array of object that is used to configure the Tab.
 */
var RibbonItem = /** @__PURE__ @class */ (function (_super) {
    __extends$8(RibbonItem, _super);
    function RibbonItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        Complex({}, Header)
    ], RibbonItem.prototype, "header", void 0);
    __decorate$7([
        Collection([], Item)
    ], RibbonItem.prototype, "content", void 0);
    __decorate$7([
        Property({})
    ], RibbonItem.prototype, "cssClass", void 0);
    __decorate$7([
        Property(false)
    ], RibbonItem.prototype, "disabled", void 0);
    __decorate$7([
        Property('Tab')
    ], RibbonItem.prototype, "type", void 0);
    __decorate$7([
        Collection([], MenuItem)
    ], RibbonItem.prototype, "menuItems", void 0);
    return RibbonItem;
}(ChildProperty));
/**
 * Represents Ribbon component.
 */
var Ribbon$1 = /** @__PURE__ @class */ (function (_super) {
    __extends$8(Ribbon, _super);
    /**
     * Constructor for creating the widget.
     * @param  {RibbonModel} options?
     * @param  {string|HTMLDivElement} element?
     */
    function Ribbon(options, element) {
        return _super.call(this, options) || this;
    }
    /**
     * For internal use only.
     * @returns void
     * @private
     */
    Ribbon.prototype.preRender = function () {
        /** */
    };
    /**
     * For internal use only.
     * @returns void
     * @private
     */
    Ribbon.prototype.render = function () {
        this.renderRibbon();
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    Ribbon.prototype.destroy = function () {
        this.destroyComponent(this.element.querySelector('.e-file-menu'), Menu);
        var expandCollapseElem = this.tabObj.element.querySelector('.e-drop-icon');
        if (expandCollapseElem) {
            expandCollapseElem.removeEventListener('click', this.ribbonExpandCollapse.bind(this));
        }
        this.toolbarObj.destroy();
        this.tabObj.destroy();
        _super.prototype.destroy.call(this);
    };
    Ribbon.prototype.getTabItems = function () {
        var _this = this;
        var tabItems = [];
        this.items.forEach(function (item) {
            switch (item.type) {
                case 'Menu':
                    tabItems.push({
                        header: { text: _this.initMenu(item.menuItems) },
                        content: _this.toolbarObj.element
                    });
                    break;
                case 'Tab':
                    tabItems.push({
                        header: item.header,
                        content: _this.toolbarObj.element
                    });
                    break;
            }
        });
        return tabItems;
    };
    Ribbon.prototype.initMenu = function (menuItems) {
        var _this = this;
        var menu = this.createElement('ul');
        this.element.appendChild(menu);
        var menuObj = new Menu({
            cssClass: 'e-file-menu',
            items: menuItems,
            showItemOnClick: true,
            beforeOpen: function (args) {
                if (args.parentItem.text === menuItems[0].text) {
                    menuObj.showItemOnClick = false;
                }
                _this.trigger('beforeOpen', args);
            },
            select: function (args) {
                _this.trigger('fileItemSelect', args);
            },
            beforeClose: function (args) {
                if (args.event.type === 'mouseover' && !closest(args.event.target, '.e-menu-popup')) {
                    args.cancel = true;
                    return;
                }
                _this.trigger('beforeClose', args);
                if (!args.parentItem || args.parentItem.text === menuItems[0].text) {
                    requestAnimationFrame(function () { return menuObj.setProperties({ showItemOnClick: true }, true); });
                }
            },
            beforeItemRender: function (args) {
                _this.trigger('beforeFileItemRender', args);
            }
        });
        menuObj.createElement = this.createElement;
        menuObj.appendTo(menu);
        return menu.parentElement;
    };
    Ribbon.prototype.renderRibbon = function () {
        var _this = this;
        var tabElement = this.createElement('div');
        var tBarElement = this.createElement('div');
        this.toolbarObj = new Toolbar({
            clicked: function (args) {
                _this.trigger('clicked', args);
            }
        });
        this.toolbarObj.createElement = this.createElement;
        this.toolbarObj.appendTo(tBarElement);
        this.tabObj = new Tab({
            selectedItem: 1,
            animation: { next: { duration: 0 }, previous: { duration: 0 } },
            items: this.getTabItems(),
            selecting: function (args) {
                if (_this.items[args.selectingIndex].type === 'Menu') {
                    args.cancel = true;
                }
                else {
                    _this.toolbarObj.items = _this.items[args.selectingIndex].content;
                    _this.toolbarObj.dataBind();
                    if (_this.element.classList.contains('e-collapsed')) {
                        EventHandler.remove(args.selectedItem, 'click', _this.ribbonExpandCollapse);
                    }
                }
                _this.trigger('selecting', args);
            },
            selected: function () {
                if (_this.element.classList.contains('e-collapsed')) {
                    _this.element.classList.remove('e-collapsed');
                    _this.trigger('expandCollapse', { element: _this.toolbarObj.element, expanded: true });
                }
            },
            created: function () {
                var collapseBtn = _this.createElement('span', { className: 'e-drop-icon e-icons' });
                collapseBtn.addEventListener('click', _this.ribbonExpandCollapse.bind(_this));
                _this.tabObj.element.querySelector('.e-tab-header').appendChild(collapseBtn);
                _this.toolbarObj.refreshOverflow();
            }
        });
        this.element.appendChild(tabElement);
        this.tabObj.createElement = this.createElement;
        this.tabObj.appendTo(tabElement);
    };
    Ribbon.prototype.ribbonExpandCollapse = function (e) {
        var eventArgs = { element: this.toolbarObj.element, expanded: true };
        var activeTab;
        if (this.element.classList.contains('e-collapsed')) {
            activeTab = this.tabObj.element.querySelector('.e-tab-header').getElementsByClassName('e-toolbar-item')[this.tabObj.selectedItem];
            this.element.classList.remove('e-collapsed');
            activeTab.classList.add('e-active');
            EventHandler.remove(activeTab, 'click', this.ribbonExpandCollapse);
            this.trigger('expandCollapse', eventArgs);
        }
        else {
            activeTab = this.tabObj.element.querySelector('.e-tab-header .e-toolbar-item.e-active');
            this.element.classList.add('e-collapsed');
            eventArgs.expanded = false;
            activeTab.classList.remove('e-active');
            EventHandler.add(activeTab, 'click', this.ribbonExpandCollapse, this);
            this.trigger('expandCollapse', eventArgs);
        }
    };
    /**
     * Enables or disables the specified Ribbon items or all ribbon items.
     * @param  {boolean} enable  - Boolean value that determines whether the command should be enabled or disabled.
     * @param  {HTMLElement} items - DOM element or an array of items to be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns void.
     */
    Ribbon.prototype.enableItems = function (enable, items) {
        if (items) {
            this.toolbarObj.enableItems(items, enable);
        }
        else {
            this.toolbarObj.disable(!enable);
        }
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    Ribbon.prototype.getModuleName = function () {
        return 'ribbon';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @private
     */
    Ribbon.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {RibbonModel} newProp
     * @param  {RibbonModel} oldProp
     * @returns void
     * @private
     */
    Ribbon.prototype.onPropertyChanged = function (newProp, oldProp) {
        /** code snippets */
    };
    Ribbon.prototype.destroyComponent = function (element, component) {
        if (element) {
            var compObj = getComponent(element, component);
            if (compObj) {
                compObj.destroy();
            }
        }
    };
    __decorate$7([
        Property('')
    ], Ribbon.prototype, "cssClass", void 0);
    __decorate$7([
        Collection([], RibbonItem)
    ], Ribbon.prototype, "items", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "selecting", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "fileItemSelect", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "beforeFileItemRender", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "beforeOpen", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "beforeClose", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "selectFormat", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "clicked", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "created", void 0);
    __decorate$7([
        Event$1()
    ], Ribbon.prototype, "expandCollapse", void 0);
    Ribbon = __decorate$7([
        NotifyPropertyChanges
    ], Ribbon);
    return Ribbon;
}(Component));

/**
 * Export Ribbon modules
 */

/**
 * `Color Picker` module is used to handle ColorPicker functionality.
 * @hidden
 */
var ColorPicker$1 = /** @__PURE__ @class */ (function () {
    function ColorPicker$$1(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ColorPicker$$1.prototype.render = function () {
        var _this = this;
        var id = this.parent.element.id;
        var input = this.parent.createElement('input', { attrs: { 'type': 'color' } });
        var fontColorPicker = new ColorPicker({
            value: '#000000ff',
            mode: 'Palette',
            showButtons: false,
            presetColors: fontColor,
            enableOpacity: false,
            beforeClose: function (args) { return _this.beforeCloseHandler(fontColorPicker); },
            open: this.openHandler.bind(this),
            beforeModeSwitch: function (args) { return _this.beforeModeSwitch(fontColorPicker, args); },
            change: function (args) {
                var color = fontColorPicker.getValue(args.currentValue.rgba);
                _this.updateSelectedColor(color, fontColorPicker.element);
                _this.parent.cellFormat({ color: color });
                _this.parent.element.focus();
            },
            created: function () { return _this.wireFocusEvent(fontColorPicker.element, '#000000'); }
        });
        fontColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        fontColorPicker.appendTo(input);
        input.parentElement.id = id + "_font_color_picker";
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-font-color']);
        input = this.parent.createElement('input', { attrs: { 'type': 'color' } });
        var filColorPicker = new ColorPicker({
            value: '#ffff00ff',
            mode: 'Palette',
            presetColors: fillColor,
            showButtons: false,
            enableOpacity: false,
            open: this.openHandler.bind(this),
            beforeClose: function (args) { return _this.beforeCloseHandler(filColorPicker); },
            beforeModeSwitch: function (args) { return _this.beforeModeSwitch(filColorPicker, args); },
            change: function (args) {
                var color = filColorPicker.getValue(args.currentValue.rgba);
                _this.updateSelectedColor(color, filColorPicker.element);
                _this.parent.cellFormat({ backgroundColor: color });
                _this.parent.element.focus();
            },
            created: function () { return _this.wireFocusEvent(filColorPicker.element, '#ffff00'); }
        });
        filColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        filColorPicker.appendTo(input);
        input.parentElement.id = id + "_fill_color_picker";
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-fill-color']);
    };
    ColorPicker$$1.prototype.updateSelectedColor = function (color, ele) {
        ele.nextElementSibling.querySelector('.e-selected-color').style.borderBottomColor = color;
    };
    ColorPicker$$1.prototype.wireFocusEvent = function (element, color) {
        var _this = this;
        this.updateSelectedColor(color, element);
        element = element.parentElement.querySelector('.e-split-colorpicker');
        element.addEventListener('focus', function () {
            _this.parent.element.focus();
        });
    };
    ColorPicker$$1.prototype.openHandler = function (args) {
        args.element.querySelector('.e-mode-switch-btn').title =
            this.parent.serviceLocator.getService(locale).getConstant('MoreColors');
    };
    ColorPicker$$1.prototype.beforeCloseHandler = function (inst) {
        if (!inst.modeSwitcher) {
            inst.setProperties({ modeSwitcher: true }, true);
        }
        if (inst.showButtons) {
            inst.setProperties({ showButtons: false }, true);
        }
    };
    ColorPicker$$1.prototype.beforeModeSwitch = function (inst, args) {
        var l10n = this.parent.serviceLocator.getService(locale);
        if (args.mode === 'Picker') {
            inst.showButtons = true;
            inst.dataBind();
            args.element.querySelector('.e-apply').title = l10n.getConstant('Apply');
            args.element.querySelector('.e-cancel').title = l10n.getConstant('Cancel');
            args.element.querySelector('.e-mode-switch-btn').title = l10n.getConstant('StandardColors');
        }
        else {
            inst.showButtons = false;
            inst.dataBind();
            args.element.querySelector('.e-mode-switch-btn').title = l10n.getConstant('MoreColors');
        }
    };
    ColorPicker$$1.prototype.destroy = function () {
        this.removeEventListener();
        var id = this.parent.element.id;
        this.destroyColorPicker(id + "_font_color_picker");
        this.destroyColorPicker(id + "_fill_color_picker");
        this.parent = null;
    };
    ColorPicker$$1.prototype.destroyColorPicker = function (id) {
        var ele = document.getElementById(id);
        if (ele) {
            destroyComponent(ele.firstElementChild, ColorPicker);
        }
    };
    ColorPicker$$1.prototype.addEventListener = function () {
        this.parent.on(beforeRibbonCreate, this.render, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    ColorPicker$$1.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(beforeRibbonCreate, this.render);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    };
    return ColorPicker$$1;
}());

/**
 * Represents Ribbon for Spreadsheet.
 */
var Ribbon$$1 = /** @__PURE__ @class */ (function () {
    function Ribbon$$1(parent) {
        this.fontNameIndex = 5;
        this.numPopupWidth = 0;
        this.activeTab = 1;
        this.parent = parent;
        this.addEventListener();
        new ColorPicker$1(parent);
    }
    Ribbon$$1.prototype.getModuleName = function () {
        return 'ribbon';
    };
    Ribbon$$1.prototype.initRibbon = function (args) {
        if (!this.parent.showRibbon && this.ribbon) {
            this.destroy();
            return;
        }
        this.parent.notify(beforeRibbonCreate, {});
        if (this.parent.isMobileView()) {
            this.createMobileView();
        }
        else {
            this.createRibbon(args);
        }
    };
    Ribbon$$1.prototype.getRibbonItems = function () {
        var id = this.parent.element.id;
        var l10n = this.parent.serviceLocator.getService(locale);
        var items = [
            {
                type: 'Menu',
                menuItems: [
                    {
                        text: this.parent.isMobileView() ? '' : l10n.getConstant('File'),
                        iconCss: this.parent.isMobileView() ? 'e-icons e-file-menu-icon' : null,
                        items: [
                            { text: l10n.getConstant('New'), id: 'New', iconCss: 'e-new e-icons' },
                            { text: l10n.getConstant('Open'), id: 'Open', iconCss: 'e-open e-icons' },
                            {
                                text: l10n.getConstant('SaveAs'),
                                iconCss: 'e-save e-icons',
                                items: [
                                    { text: l10n.getConstant('ExcelXlsx'), id: 'Xlsx', iconCss: 'e-xlsx e-icons' },
                                    { text: l10n.getConstant('ExcelXls'), id: 'Xls', iconCss: 'e-xls e-icons' },
                                    { text: l10n.getConstant('CSV'), id: 'Csv', iconCss: 'e-csv e-icons' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                header: { text: l10n.getConstant('Home') },
                content: [
                    { prefixIcon: 'e-cut-icon', tooltipText: l10n.getConstant('Cut') + " (Ctrl+X)", id: id + '_cut' },
                    { prefixIcon: 'e-copy-icon', tooltipText: l10n.getConstant('Copy') + " (Ctrl+C)", id: id + '_copy' },
                    { tooltipText: l10n.getConstant('Paste') + " (Ctrl+V)", template: this.getPasteBtn(id) },
                    { type: 'Separator' },
                    { template: this.getNumFormatDDB(id), tooltipText: l10n.getConstant('NumberFormat') }, { type: 'Separator' },
                    { template: this.getFontNameDDB(id), tooltipText: l10n.getConstant('Font') }, { type: 'Separator' },
                    { template: this.getFontSizeDDB(id), tooltipText: l10n.getConstant('FontSize') }, { type: 'Separator' },
                    { template: this.getBtn(id, 'bold'), tooltipText: l10n.getConstant('Bold') + " (Ctrl+B)" },
                    { template: this.getBtn(id, 'italic'), tooltipText: l10n.getConstant('Italic') + " (Ctrl+I)" },
                    { template: this.getBtn(id, 'line-through'), tooltipText: l10n.getConstant('Strikethrough') + " (Ctrl+5)" },
                    { template: this.getBtn(id, 'underline'), tooltipText: l10n.getConstant('Underline') + " (Ctrl+U)" },
                    { template: document.getElementById(id + "_font_color_picker"), tooltipText: l10n.getConstant('TextColor') },
                    { type: 'Separator' },
                    { template: document.getElementById(id + "_fill_color_picker"), tooltipText: l10n.getConstant('FillColor') },
                    { type: 'Separator' }, { template: this.getTextAlignDDB(id), tooltipText: l10n.getConstant('HorizontalAlignment') },
                    { template: this.getVerticalAlignDDB(id), tooltipText: l10n.getConstant('VerticalAlignment') }
                ]
            },
            {
                header: { text: l10n.getConstant('Formulas') },
                content: [{ prefixIcon: 'e-insert-function', text: l10n.getConstant('InsertFunction'), id: id + '_insert_function' }]
            },
            {
                header: { text: 'View' },
                content: [
                    { prefixIcon: 'e-hide-headers', text: this.getLocaleText(l10n, 'Headers'), id: id + '_headers' }, { type: 'Separator' },
                    { prefixIcon: 'e-hide-gridlines', text: this.getLocaleText(l10n, 'GridLines'), id: id + '_gridlines' }
                ]
            }
        ];
        if (this.parent.allowSorting) {
            items.find(function (x) { return x.header && x.header.text === l10n.getConstant('Home'); }).content.push({ type: 'Separator' }, {
                template: this.getSortingDDB(id), tooltipText: l10n.getConstant('Sort')
            });
        }
        return items;
    };
    Ribbon$$1.prototype.getPasteBtn = function (id) {
        var _this = this;
        var btn = this.parent.element.appendChild(this.parent.createElement('button', { id: id + '_paste' }));
        var l10n = this.parent.serviceLocator.getService(locale);
        var pasteSplitBtn = new SplitButton({
            iconCss: 'e-icons e-paste-icon',
            items: [
                { text: l10n.getConstant('All'), id: 'All' },
                { text: l10n.getConstant('Values'), id: 'Values' },
                { text: l10n.getConstant('Formats'), id: 'Formats' }
            ],
            select: function (args) {
                _this.parent.notify(paste, { type: args.item.id });
            },
            click: function () {
                _this.parent.notify(paste, null);
            },
            close: function () { _this.parent.element.focus(); }
        });
        pasteSplitBtn.createElement = this.parent.createElement;
        pasteSplitBtn.appendTo(btn);
        return btn.parentElement;
    };
    Ribbon$$1.prototype.getLocaleText = function (l10n, str, setClass) {
        var text;
        var sheet = this.parent.getActiveSheet();
        if (sheet['show' + str]) {
            if (setClass) {
                this.parent.getMainContent().classList.remove('e-hide-' + str.toLowerCase());
            }
            text = l10n.getConstant('Hide' + str);
        }
        else {
            if (setClass) {
                this.parent.getMainContent().classList.add('e-hide-' + str.toLowerCase());
            }
            text = l10n.getConstant('Show' + str);
        }
        return text;
    };
    Ribbon$$1.prototype.createRibbon = function (args) {
        var ribbonElement = this.parent.createElement('div');
        this.ribbon = new Ribbon$1({
            items: this.getRibbonItems(),
            fileItemSelect: this.fileItemSelect.bind(this),
            beforeOpen: this.fileMenuBeforeOpen.bind(this),
            beforeClose: this.fileMenuBeforeClose.bind(this),
            clicked: this.toolbarClicked.bind(this),
            created: this.ribbonCreated.bind(this),
            selecting: this.tabSelecting.bind(this),
            expandCollapse: this.expandCollapseHandler.bind(this),
            beforeFileItemRender: this.beforeRenderHandler.bind(this)
        });
        this.ribbon.createElement = this.parent.createElement;
        if (args && args.uiUpdate) {
            var refEle = this.parent.element.querySelector('.e-formula-bar-panel') ||
                document.getElementById(this.parent.element.id + '_sheet_panel');
            this.parent.element.insertBefore(ribbonElement, refEle);
        }
        else {
            this.parent.element.appendChild(ribbonElement);
        }
        this.ribbon.appendTo(ribbonElement);
    };
    Ribbon$$1.prototype.tabSelecting = function (args) {
        if (args.selectingIndex && args.selectingIndex !== this.activeTab) {
            this.activeTab = args.selectingIndex;
            this.refreshRibbonContent();
            this.parent.notify(tabSwitch, { idx: args.selectingIndex });
        }
    };
    Ribbon$$1.prototype.beforeRenderHandler = function (args) {
        var l10n = this.parent.serviceLocator.getService(locale);
        if (args.item.text === l10n.getConstant('Open') && (!this.parent.openUrl || !this.parent.allowOpen)) {
            args.element.classList.add('e-disabled');
        }
        if (args.item.text === l10n.getConstant('SaveAs') && (!this.parent.saveUrl || !this.parent.allowSave)) {
            args.element.classList.add('e-disabled');
        }
    };
    Ribbon$$1.prototype.getNumFormatDDB = function (id) {
        var _this = this;
        var numFormatBtn = this.parent.createElement('button', { id: id + '_number_format' });
        numFormatBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'General' }));
        this.numFormatDDB = new DropDownButton({
            items: this.getNumFormatDdbItems(id),
            content: '',
            select: function (args) { return _this.numDDBSelect(args); },
            open: function (args) { return _this.numDDBOpen(args); },
            beforeItemRender: function (args) { return _this.previewNumFormat(args); },
            close: function () { return _this.parent.element.focus(); },
            cssClass: 'e-flat e-numformat-ddb',
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.numFormatDDB.createElement = this.parent.createElement;
        this.numFormatDDB.appendTo(numFormatBtn);
        return numFormatBtn;
    };
    Ribbon$$1.prototype.getFontSizeDDB = function (id) {
        var _this = this;
        this.fontSizeDdb = new DropDownButton({
            cssClass: 'e-font-size-ddb',
            content: '11',
            items: [{ text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '14' }, { text: '16' },
                { text: '18' }, { text: '20' }, { text: '22' }, { text: '24' }, { text: '26' }, { text: '28' }, { text: '36' },
                { text: '48' }, { text: '72' }],
            beforeOpen: function (args) {
                _this.tBarDdbBeforeOpen(args);
                _this.refreshSelected(_this.fontSizeDdb, args.element, 'content', 'text');
            },
            select: function (args) {
                _this.fontSizeDdb.content = args.item.text;
                _this.fontSizeDdb.dataBind();
                _this.parent.notify(setCellFormat, { style: { fontSize: args.item.text + "pt" }, onActionUpdate: true });
            },
            close: function () { return _this.parent.element.focus(); }
        });
        this.fontSizeDdb.createElement = this.parent.createElement;
        this.fontSizeDdb.appendTo(this.parent.createElement('button', { id: id + '_font_size' }));
        return this.fontSizeDdb.element;
    };
    Ribbon$$1.prototype.getFontNameDDB = function (id) {
        var _this = this;
        var fontNameBtn = this.parent.createElement('button', { id: id + '_font_name' });
        fontNameBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'Calibri' }));
        this.fontNameDdb = new DropDownButton({
            cssClass: 'e-font-family',
            items: this.getFontFamilyItems(),
            select: function (args) {
                _this.refreshFontNameSelection(args.item.text);
                _this.parent.notify(setCellFormat, { style: { fontFamily: args.item.text }, onActionUpdate: true });
            },
            close: function () { return _this.parent.element.focus(); },
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.fontNameDdb.createElement = this.parent.createElement;
        this.fontNameDdb.appendTo(fontNameBtn);
        return fontNameBtn;
    };
    Ribbon$$1.prototype.getBtn = function (id, name) {
        var btnObj = new Button({ iconCss: "e-icons e-" + name + "-icon", isToggle: true });
        btnObj.createElement = this.parent.createElement;
        btnObj.appendTo(this.parent.createElement('button', { id: id + "_" + name }));
        btnObj.element.addEventListener('click', this.toggleBtnClicked.bind(this));
        return btnObj.element;
    };
    Ribbon$$1.prototype.getTextAlignDDB = function (id) {
        var _this = this;
        this.textAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-left-icon',
            items: [{ iconCss: 'e-icons e-left-icon' }, { iconCss: 'e-icons e-center-icon' }, { iconCss: 'e-icons e-right-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: function (args) {
                _this.refreshSelected(_this.textAlignDdb, args.element, 'iconCss');
            },
            select: function (args) {
                _this.textAlignDdb.iconCss = args.item.iconCss;
                _this.textAlignDdb.dataBind();
                _this.parent.notify(setCellFormat, {
                    style: { textAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] }, onActionUpdate: true
                });
            },
            close: function () { return _this.parent.element.focus(); }
        });
        this.textAlignDdb.createElement = this.parent.createElement;
        this.textAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_text_align' }));
        return this.textAlignDdb.element;
    };
    Ribbon$$1.prototype.getVerticalAlignDDB = function (id) {
        var _this = this;
        this.verticalAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-bottom-icon',
            items: [{ iconCss: 'e-icons e-top-icon' }, { iconCss: 'e-icons e-middle-icon' }, { iconCss: 'e-icons e-bottom-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: function (args) {
                _this.refreshSelected(_this.verticalAlignDdb, args.element, 'iconCss');
            },
            select: function (args) {
                _this.verticalAlignDdb.iconCss = args.item.iconCss;
                _this.verticalAlignDdb.dataBind();
                _this.parent.notify(setCellFormat, {
                    style: { verticalAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] }, onActionUpdate: true
                });
            },
            close: function () { return _this.parent.element.focus(); }
        });
        this.verticalAlignDdb.createElement = this.parent.createElement;
        this.verticalAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_vertical_align' }));
        return this.verticalAlignDdb.element;
    };
    Ribbon$$1.prototype.getSortingDDB = function (id) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        this.sortingDdb = new DropDownButton({
            cssClass: 'e-sort-ddb',
            iconCss: 'e-icons e-sort-icon',
            items: [
                { text: l10n.getConstant('SortAscending'), iconCss: 'e-icons e-sort-asc' },
                { text: l10n.getConstant('SortDescending'), iconCss: 'e-icons e-sort-desc' },
                { text: l10n.getConstant('CustomSort') + '...', iconCss: 'e-icons e-sort-custom' }
            ],
            // beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: function (args) {
                _this.refreshSelected(_this.sortingDdb, args.element, 'iconCss');
            },
            select: function (args) {
                if (args.item.text === l10n.getConstant('CustomSort') + '...') {
                    _this.parent.notify(initiateCustomSort, null);
                }
                else {
                    var direction = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                    _this.sortingDdb.iconCss = args.item.iconCss;
                    _this.sortingDdb.dataBind();
                    _this.parent.sort({ sortDescriptors: { order: direction } });
                }
            },
            close: function () { return _this.parent.element.focus(); }
        });
        this.sortingDdb.createElement = this.parent.createElement;
        this.sortingDdb.appendTo(this.parent.createElement('button', { id: id + '_sorting' }));
        return this.sortingDdb.element;
    };
    Ribbon$$1.prototype.ribbonCreated = function () {
        if (this.parent.enableClipboard) {
            this.enableRibbonItems({ id: this.parent.element.id + '_paste', isEnable: false });
        }
        this.ribbon.element.querySelector('.e-drop-icon').title
            = this.parent.serviceLocator.getService(locale).getConstant('CollapseToolbar');
    };
    Ribbon$$1.prototype.alignItemRender = function (args) {
        var text = args.item.iconCss.split(' e-')[1].split('-icon')[0];
        text = text[0].toUpperCase() + text.slice(1, text.length);
        args.element.title = this.parent.serviceLocator.getService(locale).getConstant('Align' + text);
    };
    Ribbon$$1.prototype.toggleBtnClicked = function (e) {
        var target = closest(e.target, '.e-btn');
        var parentId = this.parent.element.id;
        var id = target.id;
        var property = setCellFormat;
        var defaultModel;
        var activeModel;
        switch (id) {
            case parentId + "_bold":
                defaultModel = { fontWeight: 'normal' };
                activeModel = { fontWeight: 'bold' };
                break;
            case parentId + "_italic":
                defaultModel = { fontStyle: 'normal' };
                activeModel = { fontStyle: 'italic' };
                break;
            case parentId + "_line-through":
                property = textDecorationUpdate;
                defaultModel = { textDecoration: 'line-through' };
                activeModel = defaultModel;
                break;
            case parentId + "_underline":
                property = textDecorationUpdate;
                defaultModel = { textDecoration: 'underline' };
                activeModel = defaultModel;
                break;
        }
        if (target.classList.contains('e-active')) {
            this.parent.notify(property, {
                style: activeModel, onActionUpdate: true
            });
        }
        else {
            this.parent.notify(property, {
                style: defaultModel, onActionUpdate: true
            });
        }
        this.parent.element.focus();
    };
    Ribbon$$1.prototype.getCellStyleValue = function (cssProp, indexes) {
        var cell = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
        var value = this.parent.cellStyle[cssProp];
        if (cell && cell.style && cell.style[cssProp]) {
            value = cell.style[cssProp];
        }
        return value;
    };
    Ribbon$$1.prototype.refreshSelected = function (inst, element, key, itemKey) {
        if (itemKey === void 0) { itemKey = key; }
        for (var i = 0; i < inst.items.length; i++) {
            if (inst.items[i][itemKey] === inst[key]) {
                element.children[i].classList.add('e-selected');
                break;
            }
        }
    };
    Ribbon$$1.prototype.expandCollapseHandler = function (args) {
        var target = this.ribbon.element.querySelector('.e-drop-icon');
        var l10n = this.parent.serviceLocator.getService(locale);
        if (args.expanded) {
            target.title = l10n.getConstant('CollapseToolbar');
        }
        else {
            target.title = l10n.getConstant('ExpandToolbar');
        }
        this.parent.setPanelSize();
    };
    Ribbon$$1.prototype.getNumFormatDdbItems = function (id) {
        var l10n = this.parent.serviceLocator.getService(locale);
        return [
            { id: id + 'item1', text: l10n.getConstant('General') },
            { id: id + 'item2', text: l10n.getConstant('Number') },
            { id: id + 'item3', text: l10n.getConstant('Currency') },
            { id: id + 'item4', text: l10n.getConstant('Accounting') },
            { id: id + 'item5', text: l10n.getConstant('ShortDate') },
            { id: id + 'item6', text: l10n.getConstant('LongDate') },
            { id: id + 'item7', text: l10n.getConstant('Time') },
            { id: id + 'item8', text: l10n.getConstant('Percentage') },
            { id: id + 'item9', text: l10n.getConstant('Fraction') },
            { id: id + 'item10', text: l10n.getConstant('Scientific') },
            { id: id + 'item11', text: l10n.getConstant('Text') }
        ];
    };
    Ribbon$$1.prototype.getFontFamilyItems = function () {
        return [{ text: 'Arial' }, { text: 'Arial Black' }, { text: 'Axettac Demo' }, { text: 'Batang' }, { text: 'Book Antiqua' },
            { text: 'Calibri', iconCss: 'e-icons e-selected-icon' }, { text: 'Courier' }, { text: 'Courier New' },
            { text: 'Din Condensed' }, { text: 'Georgia' }, { text: 'Helvetica' }, { text: 'Helvetica New' }, { text: 'Roboto' },
            { text: 'Tahoma' }, { text: 'Times New Roman' }, { text: 'Verdana' }];
    };
    Ribbon$$1.prototype.enableToolbar = function (args) {
        this.ribbon.enableItems(args.enable);
    };
    Ribbon$$1.prototype.numDDBSelect = function (args) {
        this.parent.notify(applyNumberFormatting, {
            format: getFormatFromType(args.item.text),
            range: this.parent.getActiveSheet().selectedRange
        });
        this.parent.notify(selectionComplete, { type: 'mousedown' });
        this.refreshNumFormatSelection(args.item.text);
    };
    Ribbon$$1.prototype.tBarDdbBeforeOpen = function (args) {
        var viewportHeight = this.parent.viewport.height;
        var actualHeight = (parseInt(getComputedStyle(args.element.firstElementChild).height, 10) * args.items.length) +
            (parseInt(getComputedStyle(args.element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            args.element.style.height = viewportHeight + "px";
            args.element.style.overflowY = 'auto';
        }
    };
    Ribbon$$1.prototype.numDDBOpen = function (args) {
        this.numPopupWidth = 0;
        var elemList = args.element.querySelectorAll('span.e-numformat-preview-text');
        for (var i = 0, len = elemList.length; i < len; i++) {
            if (this.numPopupWidth < elemList[i].offsetWidth) {
                this.numPopupWidth = elemList[i].offsetWidth;
            }
        }
        var popWidth = this.numPopupWidth + 160;
        document.querySelector('.e-numformat-ddb.e-dropdown-popup').style.width = popWidth + "px";
    };
    Ribbon$$1.prototype.previewNumFormat = function (args) {
        var cellIndex = getCellIndexes(this.parent.getActiveSheet().activeCell);
        var cell = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet());
        var eventArgs = {
            type: args.item.text,
            formattedText: '',
            value: cell && cell.value ? cell.value : '',
            format: getFormatFromType(args.item.text),
            sheetIndex: this.parent.activeSheetTab,
            onLoad: true
        };
        var numElem = this.parent.createElement('div', {
            className: 'e-numformat-text',
            styles: 'width:100%',
            innerHTML: args.element.innerHTML
        });
        args.element.innerHTML = '';
        this.parent.notify(getFormattedCellObject, eventArgs);
        var previewElem = this.parent.createElement('span', {
            className: 'e-numformat-preview-text',
            styles: 'float:right;',
            innerHTML: eventArgs.formattedText.toString()
        });
        numElem.appendChild(previewElem);
        args.element.appendChild(numElem);
    };
    Ribbon$$1.prototype.refreshRibbonContent = function () {
        switch (this.activeTab) {
            case 1:
                this.refreshFirstTabContent(getCellIndexes(this.parent.getActiveSheet().activeCell));
                break;
            case 2:
                // Second tab functionality comes here
                break;
            case 3:
                this.refreshThirdTabContent();
                break;
        }
    };
    Ribbon$$1.prototype.refreshFirstTabContent = function (indexes) {
        var _this = this;
        if (!isNullOrUndefined(document.getElementById(this.parent.element.id + '_number_format'))) {
            this.numFormatDDB = getComponent(document.getElementById(this.parent.element.id + '_number_format'), DropDownButton);
        }
        var actCell = getCellIndexes(this.parent.getActiveSheet().activeCell);
        var l10n = this.parent.serviceLocator.getService(locale);
        var cell = getCell(actCell[0], actCell[1], this.parent.getActiveSheet(), true);
        cell = cell ? cell : {};
        var type = getTypeFromFormat(cell.format ? cell.format : 'General');
        if (this.numFormatDDB) {
            this.refreshNumFormatSelection(l10n.getConstant(type));
        }
        if (this.fontNameDdb) {
            this.refreshFontNameSelection(this.getCellStyleValue('fontFamily', indexes));
        }
        if (this.fontSizeDdb) {
            var value_1 = this.getCellStyleValue('fontSize', indexes).split('pt')[0];
            if (value_1 !== this.fontSizeDdb.content) {
                this.fontSizeDdb.content = value_1;
                this.fontSizeDdb.dataBind();
            }
        }
        if (this.textAlignDdb) {
            var value_2 = "e-icons e-" + this.getCellStyleValue('textAlign', indexes).toLowerCase() + "-icon";
            if (value_2 !== this.textAlignDdb.iconCss) {
                this.textAlignDdb.iconCss = value_2;
                this.textAlignDdb.dataBind();
            }
        }
        if (this.verticalAlignDdb) {
            var value_3 = "e-icons e-" + this.getCellStyleValue('verticalAlign', indexes).toLowerCase() + "-icon";
            if (value_3 !== this.verticalAlignDdb.iconCss) {
                this.verticalAlignDdb.iconCss = value_3;
                this.verticalAlignDdb.dataBind();
            }
        }
        var btn;
        var id = this.parent.element.id;
        var value;
        var fontProps = ['fontWeight', 'fontStyle', 'textDecoration', 'textDecoration'];
        ['bold', 'italic', 'line-through', 'underline'].forEach(function (name, index) {
            btn = document.getElementById(id + "_" + name);
            if (btn) {
                value = _this.getCellStyleValue(fontProps[index], indexes).toLowerCase();
                if (value.indexOf(name) > -1) {
                    btn.classList.add('e-active');
                }
                else {
                    if (btn.classList.contains('e-active')) {
                        btn.classList.remove('e-active');
                    }
                }
            }
        });
    };
    Ribbon$$1.prototype.refreshFontNameSelection = function (fontFamily) {
        if (fontFamily !== this.fontNameDdb.items[this.fontNameIndex].text) {
            this.fontNameDdb.element.firstElementChild.textContent = fontFamily;
            for (var i = 0; i < this.fontNameDdb.items.length; i++) {
                if (this.fontNameDdb.items[i].text === fontFamily) {
                    this.fontNameDdb.items[i].iconCss = 'e-icons e-selected-icon';
                    this.fontNameDdb.items[this.fontNameIndex].iconCss = '';
                    this.fontNameDdb.setProperties({ 'items': this.fontNameDdb.items }, true);
                    this.fontNameIndex = i;
                    break;
                }
            }
        }
    };
    Ribbon$$1.prototype.refreshNumFormatSelection = function (type) {
        var l10n = this.parent.serviceLocator.getService(locale);
        for (var i = 0; i < this.numFormatDDB.items.length; i++) {
            if (this.numFormatDDB.items[i].iconCss !== '') {
                this.numFormatDDB.items[i].iconCss = '';
            }
            if (this.numFormatDDB.items[i].text === type) {
                this.numFormatDDB.items[i].iconCss = 'e-icons e-selected-icon';
            }
        }
        this.numFormatDDB.element.firstElementChild.textContent = type;
        this.numFormatDDB.setProperties({ 'items': this.numFormatDDB.items }, true);
    };
    Ribbon$$1.prototype.fileItemSelect = function (args) {
        var _this = this;
        var selectArgs = extend({ cancel: false }, args);
        this.parent.trigger('fileItemSelect', selectArgs);
        if (!selectArgs.cancel) {
            switch (args.item.id) {
                case 'Open':
                    this.parent.element.querySelector('#' + this.parent.element.id + '_fileUpload').click();
                    break;
                case 'Xlsx':
                case 'Xls':
                case 'Csv':
                    this.parent.save({ saveType: args.item.id });
                    break;
                case 'New':
                    var dialogInst_1 = this.parent.serviceLocator.getService(dialog);
                    dialogInst_1.show({
                        height: 200, width: 400, isModal: true, showCloseIcon: true,
                        content: this.parent.serviceLocator.getService(locale).getConstant('DestroyAlert'),
                        beforeOpen: function () { return _this.parent.element.focus(); },
                        buttons: [{
                                buttonModel: {
                                    content: this.parent.serviceLocator.getService(locale).getConstant('Ok'), isPrimary: true
                                },
                                click: function () {
                                    _this.parent.sheets.length = 0;
                                    _this.parent.createSheet();
                                    dialogInst_1.hide();
                                    _this.parent.activeSheetTab = _this.parent.sheets.length;
                                    _this.parent.setProperties({ 'activeSheetTab': _this.parent.sheets.length }, true);
                                    _this.parent.notify(refreshSheetTabs, {});
                                    _this.parent.notify(sheetsDestroyed, {});
                                    _this.parent.renderModule.refreshSheet();
                                }
                            }]
                    });
                    break;
            }
        }
    };
    Ribbon$$1.prototype.toolbarClicked = function (args) {
        var parentId = this.parent.element.id;
        var text;
        var l10n = this.parent.serviceLocator.getService(locale);
        var sheet = this.parent.getActiveSheet();
        switch (args.item.id) {
            case parentId + '_headers':
                sheet.showHeaders = !sheet.showHeaders;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                this.parent.serviceLocator.getService('sheet').showHideHeaders();
                text = this.getLocaleText(l10n, 'Headers', false);
                args.item.text = text;
                this.ribbon.items[3].content[0].text = text;
                this.updateToggleText('headers', text);
                this.parent.element.focus();
                break;
            case parentId + '_gridlines':
                sheet.showGridLines = !sheet.showGridLines;
                this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                text = this.getLocaleText(l10n, 'GridLines', true);
                args.item.text = text;
                this.ribbon.items[3].content[2].text = text;
                this.updateToggleText('gridlines', text);
                this.parent.element.focus();
                break;
        }
        this.parent.notify(ribbonClick, args);
    };
    Ribbon$$1.prototype.updateToggleText = function (item, text) {
        var _this = this;
        getUpdateUsingRaf(function () {
            _this.ribbon.element.querySelector("#" + _this.parent.element.id + "_" + item + " .e-tbar-btn-text").textContent = text;
        });
    };
    Ribbon$$1.prototype.refreshThirdTabContent = function () {
        var _this = this;
        var idx;
        var sheet = this.parent.getActiveSheet();
        var l10n = this.parent.serviceLocator.getService(locale);
        var itemPos = [0, 2];
        ['Headers', 'GridLines'].forEach(function (item, index) {
            idx = itemPos[index];
            if (sheet['show' + item]) {
                if (_this.ribbon.items[3].content[idx].text === l10n.getConstant('Show' + item)) {
                    _this.updateShowHideBtn('Hide', item, idx);
                }
            }
            else {
                if (_this.ribbon.items[3].content[idx].text === l10n.getConstant('Hide' + item)) {
                    _this.updateShowHideBtn('Show', item, idx);
                }
            }
        });
    };
    Ribbon$$1.prototype.updateShowHideBtn = function (showHideText, item, idx) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var text = l10n.getConstant(showHideText + item);
        this.ribbon.items[3].content[idx].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText(item.toLowerCase(), text);
    };
    Ribbon$$1.prototype.enableRibbonItems = function (args) {
        var ele = document.getElementById(args.id);
        if (ele) {
            this.ribbon.enableItems(args.isEnable, closest(ele, '.e-toolbar-item'));
        }
    };
    Ribbon$$1.prototype.createMobileView = function () {
        var _this = this;
        var parentId = this.parent.element.id;
        var toobar = this.parent.createElement('div', { className: 'e-header-toolbar' });
        var menu = this.parent.createElement('ul');
        toobar.appendChild(menu);
        var toolbarObj = new Toolbar({
            items: [
                { prefixIcon: 'e-tick-icon', align: 'Left', id: parentId + 'focused_tick', cssClass: 'e-focused-tick' },
                { template: menu, align: 'Right', id: parentId + 'file_menu' },
            ],
            clicked: function (args) {
                switch (args.item.id) {
                    case parentId + 'focused_tick':
                        _this.parent.element.classList.remove('e-mobile-focused');
                        _this.parent.renderModule.setSheetPanelSize();
                        break;
                }
            },
            created: function () {
                var menuObj = new Menu({
                    cssClass: 'e-mobile e-file-menu',
                    enableRtl: true,
                    showItemOnClick: true,
                    items: _this.ribbon.items[0].menuItems,
                    select: _this.fileItemSelect.bind(_this),
                    beforeOpen: function (args) {
                        args.element.parentElement.classList.remove('e-rtl');
                        _this.fileMenuBeforeOpen(args);
                    },
                    beforeClose: _this.fileMenuBeforeClose.bind(_this)
                });
                menuObj.createElement = _this.parent.createElement;
                menuObj.appendTo(menu);
            }
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toobar);
        this.parent.element.insertBefore(toobar, this.parent.element.firstElementChild);
        this.renderMobileToolbar();
    };
    Ribbon$$1.prototype.renderMobileToolbar = function () {
        var _this = this;
        var toolbarPanel = this.parent.createElement('div', { className: 'e-toolbar-panel e-ribbon' });
        var toolbar = this.parent.createElement('div');
        var ddb = this.parent.createElement('button');
        toolbarPanel.appendChild(toolbar);
        toolbarPanel.appendChild(ddb);
        toolbarPanel.style.display = 'block';
        this.parent.element.appendChild(toolbarPanel);
        var ddbObj = new DropDownButton({
            cssClass: 'e-caret-hide',
            content: this.ribbon.items[1].header.text,
            items: [
                { text: this.ribbon.items[1].header.text },
                { text: this.ribbon.items[2].header.text },
                { text: this.ribbon.items[3].header.text }
            ],
            select: function (args) {
                if (args.item.text !== ddbObj.content) {
                    toolbarObj.element.style.display = 'none';
                    ddbObj.content = args.item.text;
                    ddbObj.dataBind();
                    toolbarObj.items = _this.ribbon.items[ddbObj.items.indexOf(args.item) + 1].content;
                    toolbarObj.width = "calc(100% - " + ddb.getBoundingClientRect().width + "px)";
                    toolbarObj.element.style.display = '';
                    toolbarObj.dataBind();
                    toolbarObj.items[0].text = args.item.text;
                    toolbarObj.dataBind();
                }
            },
            open: function (args) {
                var element = args.element.parentElement;
                var clientRect = element.getBoundingClientRect();
                var offset = calculatePosition(ddbObj.element, 'right', 'bottom');
                element.style.left = offset.left - clientRect.width + "px";
                element.style.top = offset.top - clientRect.height + "px";
                for (var i = 0; i < ddbObj.items.length; i++) {
                    if (ddbObj.content === ddbObj.items[i].text) {
                        args.element.children[i].classList.add('e-selected');
                        break;
                    }
                }
            },
            close: function () { return _this.parent.element.focus(); }
        });
        ddbObj.createElement = this.parent.createElement;
        ddbObj.appendTo(ddb);
        var toolbarObj = new Toolbar({
            width: "calc(100% - " + ddb.getBoundingClientRect().width + "px)",
            items: this.ribbon.items[1].content,
            clicked: this.toolbarClicked.bind(this)
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toolbar);
        toolbarPanel.style.display = '';
    };
    Ribbon$$1.prototype.fileMenuBeforeOpen = function (args) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var wrapper;
        var contents = ['.xlsx', '.xls', '.csv'];
        if (args.parentItem.text === l10n.getConstant('SaveAs')) {
            [].slice.call(args.element.children).forEach(function (li, index) {
                wrapper = _this.parent.createElement('div', { innerHTML: li.innerHTML });
                li.innerHTML = '';
                wrapper.appendChild(_this.parent.createElement('span', { className: 'e-extension', innerHTML: contents[index] }));
                li.appendChild(wrapper);
            });
        }
        this.parent.trigger('fileMenuBeforeOpen', args);
    };
    Ribbon$$1.prototype.fileMenuBeforeClose = function (args) {
        this.parent.trigger('fileMenuBeforeClose', args);
    };
    Ribbon$$1.prototype.addEventListener = function () {
        this.parent.on(ribbon, this.initRibbon, this);
        this.parent.on(enableRibbonItems, this.enableRibbonItems, this);
        this.parent.on(activeCellChanged, this.refreshRibbonContent, this);
        this.parent.on(enableToolbar, this.enableToolbar, this);
    };
    Ribbon$$1.prototype.destroy = function () {
        var parentElem = this.parent.element;
        var ribbonEle = this.ribbon.element;
        var id = parentElem.id;
        destroyComponent(parentElem.querySelector('#' + id + '_paste'), SplitButton);
        destroyComponent(parentElem.querySelector('#' + id + '_number_format'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_size'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_name'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_text_align'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_vertical_align'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_sorting'), DropDownButton);
        ['bold', 'italic', 'line-through', 'underline'].forEach(function (name) {
            destroyComponent(parentElem.querySelector('#' + (id + "_" + name)), Button);
        });
        this.ribbon.destroy();
        if (ribbonEle) {
            detach(ribbonEle);
        }
        this.ribbon = null;
        this.removeEventListener();
    };
    Ribbon$$1.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbon, this.initRibbon);
            this.parent.off(enableRibbonItems, this.enableRibbonItems);
            this.parent.off(activeCellChanged, this.refreshRibbonContent);
            this.parent.on(enableToolbar, this.enableToolbar, this);
        }
    };
    return Ribbon$$1;
}());

/**
 * Represents Formula bar for Spreadsheet.
 */
var FormulaBar = /** @__PURE__ @class */ (function () {
    function FormulaBar(parent) {
        this.categoryCollection = [];
        this.formulaCollection = [];
        this.parent = parent;
        this.addEventListener();
    }
    FormulaBar.prototype.getModuleName = function () {
        return 'formulaBar';
    };
    FormulaBar.prototype.createFormulaBar = function (args) {
        if (!this.parent.showFormulaBar && this.insertFnRipple) {
            this.destroy();
            return;
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        var id = this.parent.element.id;
        var fBarWrapper = this.parent.createElement('div', { className: 'e-formula-bar-panel' });
        if (!this.parent.isMobileView()) {
            var nameBox = this.parent.createElement('input', { id: id + '_name_box', attrs: { type: 'text' } });
            fBarWrapper.appendChild(nameBox);
            this.comboBoxInstance = new ComboBox({
                value: 'A1',
                cssClass: 'e-name-box',
                width: '',
                noRecordsTemplate: '',
                fields: { text: 'name', value: 'refersTo' },
                beforeOpen: this.nameBoxBeforeOpen.bind(this),
                blur: this.nameBoxBlur.bind(this),
                select: this.nameBoxSelect.bind(this),
                change: function (args) {
                    /** */
                }
            });
            this.comboBoxInstance.createElement = this.parent.createElement;
            this.comboBoxInstance.appendTo(nameBox);
            this.comboBoxInstance.element.parentElement.title = l10n.getConstant('NameBox');
        }
        var insertFnBtn = fBarWrapper.appendChild(this.parent.createElement('button', {
            className: 'e-btn e-css e-flat e-icon-btn e-insert-function', attrs: { 'title': l10n.getConstant('InsertFunction') }
        }));
        insertFnBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons' }));
        this.insertFnRipple = rippleEffect(fBarWrapper, { selector: '.e-insert-function' });
        fBarWrapper.appendChild(this.parent.createElement('div', { className: 'e-separator' }));
        var textarea = fBarWrapper.appendChild(this.parent.createElement('textarea', {
            className: 'e-formula-bar e-css', id: id + '_formula_input',
            attrs: { 'title': l10n.getConstant('FormulaBar'), 'spellcheck': 'false' }
        }));
        textarea.rows = 1;
        if (this.parent.isMobileView()) {
            textarea.placeholder = l10n.getConstant('MobileFormulaBarPlaceHolder');
            EventHandler.add(textarea, 'focus', this.textAreaFocusIn, this);
            EventHandler.add(textarea, 'blur', this.textAreaFocusOut, this);
        }
        else {
            fBarWrapper.appendChild(this.parent.createElement('span', {
                className: 'e-drop-icon e-icons', attrs: { 'title': l10n.getConstant('ExpandFormulaBar') }
            }));
        }
        if (args && args.uiUpdate) {
            this.parent.element.insertBefore(fBarWrapper, document.getElementById(id + '_sheet_panel'));
        }
        else {
            this.parent.element.appendChild(fBarWrapper);
        }
    };
    FormulaBar.prototype.textAreaFocusIn = function (e) {
        var formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        var tickBtn = this.parent.createElement('button', { className: 'e-btn e-css e-flat e-icon-btn e-formula-submit' });
        tickBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-tick-icon' }));
        formulaPanel.classList.add('e-focused');
        formulaPanel.appendChild(tickBtn);
    };
    FormulaBar.prototype.textAreaFocusOut = function (e) {
        var formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        formulaPanel.classList.remove('e-focused');
        detach(formulaPanel.querySelector('.e-formula-submit'));
    };
    FormulaBar.prototype.keyDownHandler = function (e) {
        var trgtElem = e.target;
        if (this.parent.isEdit) {
            if (trgtElem.classList.contains('e-formula-bar')) {
                this.parent.notify(editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
            }
        }
    };
    FormulaBar.prototype.keyUpHandler = function (e) {
        if (this.parent.isEdit) {
            var trgtElem = e.target;
            if (trgtElem.classList.contains('e-formula-bar')) {
                var eventArg = { action: 'getCurrentEditValue', editedValue: '' };
                this.parent.notify(editOperation, eventArg);
                if (eventArg.editedValue !== trgtElem.value) {
                    this.parent.notify(editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
                }
            }
        }
    };
    FormulaBar.prototype.nameBoxBeforeOpen = function (args) {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            args.cancel = true;
        }
        else {
            this.comboBoxInstance.element.select();
        }
    };
    FormulaBar.prototype.nameBoxBlur = function (args) {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            this.comboBoxInstance.element.classList.remove('e-name-editing');
            this.UpdateValueAfterMouseUp();
        }
    };
    FormulaBar.prototype.nameBoxSelect = function (args) {
        if (args.isInteracted) {
            var refersTo = args.itemData.refersTo.substr(1);
            var sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(refersTo));
            var range = getRangeFromAddress(refersTo);
            var sheet = getSheet(this.parent, sheetIdx);
            if ((sheetIdx + 1) === this.parent.activeSheetTab) {
                this.parent.selectRange(range);
                this.parent.element.focus();
            }
            else {
                updateSelectedRange(this.parent, range, sheet);
                this.parent.activeSheetTab = sheetIdx + 1;
            }
        }
    };
    FormulaBar.prototype.formulaBarUpdateHandler = function (e) {
        var _this = this;
        var range = this.parent.getActiveSheet().selectedRange.split(':');
        var address;
        var intl = new Internationalization();
        if (e.type === 'mousemove' || e.type === 'pointermove') {
            var indexes1 = getRangeIndexes(range[0]);
            var indexes2 = getRangeIndexes(range[1]);
            address = Math.abs(indexes1[0] - indexes2[0]) + 1 + "R x " + (Math.abs(indexes1[1] - indexes2[1]) + 1) + "C";
        }
        else {
            address = range[0];
            var data = this.parent.getData(getSheetName(this.parent) + "!" + address);
            data.then(function (values) {
                var value = '';
                var intDate;
                values.forEach(function (cell, key) {
                    var type = cell && cell.format ? getTypeFromFormat(cell.format) : 'General';
                    if (cell) {
                        if (!isNullOrUndefined(cell.value)) {
                            intDate = intToDate(Number(cell.value));
                            if (intDate.toString() !== 'Invalid Date' && (type === 'ShortDate' || type === 'LongDate')) {
                                value = intl.formatDate(intDate, {
                                    type: 'date',
                                    skeleton: 'yMd'
                                });
                            }
                            else if (intDate.toString() !== 'Invalid Date' && type === 'Time') {
                                value = intl.formatDate(intDate, {
                                    type: 'dateTime',
                                    skeleton: 'yMd'
                                }) + ' ' + intl.formatDate(intDate, {
                                    type: 'dateTime',
                                    skeleton: 'hms'
                                });
                            }
                            else {
                                value = cell.value;
                            }
                        }
                        if (cell.formula) {
                            value = cell.formula;
                        }
                    }
                    document.getElementById(_this.parent.element.id + '_formula_input').value = value;
                });
            });
        }
        this.updateComboBoxValue(address);
    };
    FormulaBar.prototype.UpdateValueAfterMouseUp = function () {
        this.updateComboBoxValue(this.parent.getActiveSheet().selectedRange.split(':')[0]);
    };
    FormulaBar.prototype.updateComboBoxValue = function (value) {
        var sheet = this.parent.getActiveSheet();
        var range = getSheetName(this.parent) + '!' + sheet.selectedRange;
        var eventArgs = {
            action: 'getNameFromRange', range: range, definedName: null
        };
        this.parent.notify(formulaOperation, eventArgs);
        if (eventArgs.definedName) {
            value = eventArgs.definedName.name;
        }
        if (!this.parent.isMobileView()) {
            if (this.comboBoxInstance.text === value) {
                return;
            }
            this.comboBoxInstance.text = value;
            this.comboBoxInstance.dataBind();
        }
    };
    FormulaBar.prototype.clickHandler = function (e) {
        var _this = this;
        var target = e.target;
        if (target.classList.contains('e-drop-icon') && closest(target, '.e-formula-bar-panel')) {
            this.toggleFormulaBar(target);
        }
        else if (target.classList.contains('e-formula-bar')) {
            if (!this.parent.isEdit) {
                this.parent.notify(editOperation, { action: 'startEdit', refreshCurPos: false });
            }
        }
        else if (target.parentElement.classList.contains('e-name-box')) {
            if (target.classList.contains('e-ddl-icon')) {
                var eventArgs = { action: 'getNames', names: [] };
                this.parent.notify(formulaOperation, eventArgs);
                this.comboBoxInstance.dataSource = eventArgs.names;
            }
            else {
                this.comboBoxInstance.element.classList.add('e-name-editing');
                this.comboBoxInstance.element.select();
            }
        }
        if (!isNullOrUndefined(target.offsetParent) && ((target.offsetParent.classList.contains('e-insert-function')) ||
            (target.classList.contains('e-insert-function')) || (this.parent.element.id + '_insert_function' === target.offsetParent.id) ||
            (this.parent.element.id + '_insert_function' === target.id) || target.parentElement.classList.contains('e-insert-function') ||
            (this.parent.element.id + '_insert_function' === target.parentElement.id))) {
            var isOpen = !this.parent.isEdit;
            var args = { action: 'getCurrentEditValue', editedValue: '' };
            if (!isOpen) {
                var eventArgs = { action: 'isFormulaEditing', isFormulaEdit: false };
                this.parent.notify(formulaOperation, eventArgs);
                isOpen = eventArgs.isFormulaEdit;
                this.parent.notify(editOperation, args);
            }
            if (isOpen || args.editedValue === '') {
                if (args.editedValue === '') {
                    this.parent.notify(editOperation, { action: 'refreshEditor', value: '=' });
                }
                var l10n = this.parent.serviceLocator.getService(locale);
                var formulaDescription = this.parent.createElement('div', { className: 'e-formula-description', id: this.parent.element.id + '_description_content' });
                var categoryContent = this.parent.createElement('div', {
                    className: 'e-category-content', id: this.parent.element.id + '_category_content',
                    innerHTML: l10n.getConstant('PickACategory')
                });
                var dropDownElement = this.parent.createElement('input', { className: 'e-formula-category', id: this.parent.element.id + '_formula_category' });
                var listViewElement = this.parent.createElement('div', { className: 'e-formula-list', id: this.parent.element.id + '_formula_list' });
                var descriptionContent = this.parent.createElement('div', { className: 'e-description-content', innerHTML: l10n.getConstant('Description') });
                var headerContent = this.parent.createElement('div', { className: 'e-header-content', innerHTML: l10n.getConstant('InsertFunction') });
                var categoryArgs = {
                    action: 'getFormulaCategory', categoryCollection: []
                };
                this.parent.notify(workbookFormulaOperation, categoryArgs);
                this.categoryCollection = categoryArgs.categoryCollection;
                this.categoryList = new DropDownList({
                    dataSource: this.categoryCollection, index: 0, width: '285px', popupHeight: '210px',
                    select: this.dropDownSelect.bind(this)
                });
                var listArgs = {
                    action: 'getLibraryFormulas', formulaCollection: []
                };
                this.parent.notify(workbookFormulaOperation, listArgs);
                this.formulaCollection = listArgs.formulaCollection;
                this.formulaList = new ListView({
                    dataSource: this.formulaCollection.sort(),
                    actionComplete: this.updateFormulaList.bind(this),
                    select: this.listSelected.bind(this), width: '285px', height: '200px'
                });
                this.dialog = this.parent.serviceLocator.getService('dialog');
                this.dialog.show({
                    header: headerContent.outerHTML,
                    content: categoryContent.outerHTML + dropDownElement.outerHTML + listViewElement.outerHTML +
                        descriptionContent.outerHTML + formulaDescription.outerHTML,
                    width: '320px', height: '485px', cssClass: 'e-spreadsheet-function-dlg',
                    showCloseIcon: true, isModal: true,
                    beforeOpen: function () { return _this.parent.element.focus(); },
                    open: this.dialogOpen.bind(this),
                    beforeClose: this.dialogBeforeClose.bind(this),
                    close: this.dialogClose.bind(this),
                    buttons: [
                        {
                            click: (this.selectFormula.bind(this, this.dialog, this)), buttonModel: { content: 'OK', isPrimary: true }
                        }
                    ]
                });
                this.categoryList.appendTo('#' + this.parent.element.id + '_formula_category');
                this.formulaList.appendTo('#' + this.parent.element.id + '_formula_list');
                EventHandler.add(this.formulaList.element, 'dblclick', this.formulaClickHandler, this);
            }
        }
    };
    FormulaBar.prototype.toggleFormulaBar = function (target) {
        var parent = target.parentElement;
        var l10n = this.parent.serviceLocator.getService(locale);
        if (parent.classList.contains('e-expanded')) {
            parent.classList.remove('e-expanded');
            document.getElementById(this.parent.element.id + '_formula_input').rows = 1;
            target.title = l10n.getConstant('ExpandFormulaBar');
        }
        else {
            parent.classList.add('e-expanded');
            document.getElementById(this.parent.element.id + '_formula_input').rows = 3;
            target.title = l10n.getConstant('CollapseFormulaBar');
        }
        this.parent.setPanelSize();
    };
    FormulaBar.prototype.dialogOpen = function () {
        this.focusOkButton();
    };
    FormulaBar.prototype.dialogClose = function () {
        var args = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, args);
        if (args.editedValue.toString().trim() === '=') {
            this.parent.notify(editOperation, { action: 'refreshEditor', value: '' });
        }
    };
    FormulaBar.prototype.dialogBeforeClose = function () {
        EventHandler.remove(this.formulaList.element, 'dblclick', this.formulaClickHandler);
        var dialogContentEle = document.getElementById('_dialog-content');
        dialogContentEle.parentNode.removeChild(dialogContentEle);
        /* tslint:disable-next-line:no-any */
        this.dialog.dialogInstance.storeActiveElement = document.getElementById(this.parent.element.id + '_edit');
    };
    FormulaBar.prototype.selectFormula = function (dialog, formulaBarObj) {
        var formulaText = formulaBarObj.formulaList.getSelectedItems().text;
        var sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
        if (this.parent.isEdit) {
            this.parent.notify(editOperation, {
                action: 'refreshEditor', value: formulaText + '(', refreshFormulaBar: true,
                refreshEditorElem: true, isAppend: true
            });
        }
        else {
            this.parent.notify(editOperation, { action: 'startEdit', value: '=' + formulaText + '(', address: sheet.activeCell });
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: '=' + formulaText + '(' });
        }
        dialog.hide();
    };
    FormulaBar.prototype.listSelected = function () {
        this.updateFormulaDescription();
    };
    FormulaBar.prototype.updateFormulaList = function () {
        this.activeListFormula();
        this.updateFormulaDescription();
    };
    FormulaBar.prototype.dropDownSelect = function (args) {
        this.formulaCollection = [];
        var listArgs = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        if (args.item.textContent === 'All') {
            this.parent.notify(workbookFormulaOperation, listArgs);
            this.formulaCollection = listArgs.formulaCollection;
        }
        else {
            var category = args.item.textContent;
            var selectArgs = {
                action: 'dropDownSelectFormulas',
                formulaCollection: [],
                selectCategory: category,
            };
            this.parent.notify(workbookFormulaOperation, selectArgs);
            this.formulaCollection = selectArgs.formulaCollection;
        }
        this.formulaList.dataSource = this.formulaCollection.sort();
    };
    FormulaBar.prototype.focusOkButton = function () {
        var focusEle = document.getElementById('_dialog-content');
        (focusEle.nextElementSibling.firstElementChild).focus();
    };
    FormulaBar.prototype.activeListFormula = function () {
        var acListEle = document.getElementById(this.parent.element.id + '_formula_list');
        var firstElement = acListEle.children[0].children[0].firstElementChild;
        this.formulaList.selectItem(firstElement);
    };
    FormulaBar.prototype.updateFormulaDescription = function () {
        var descriptionArea;
        var selectedFormula = this.formulaList.getSelectedItems().text;
        var descriptionArgs = {
            action: 'getFormulaDescription',
            description: '',
            selectedList: selectedFormula,
        };
        this.parent.notify(workbookFormulaOperation, descriptionArgs);
        this.focusOkButton();
        descriptionArea = document.getElementById(this.parent.element.id + '_description_content');
        descriptionArea.innerHTML = this.parent.serviceLocator.getService(locale).getConstant(selectedFormula);
    };
    FormulaBar.prototype.formulaClickHandler = function (args) {
        var trgtElem = args.target;
        var sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
        if (trgtElem.offsetParent.classList.contains('e-text-content') || trgtElem.classList.contains('e-list-item')) {
            if (this.parent.isEdit) {
                this.parent.notify(editOperation, {
                    action: 'refreshEditor', value: trgtElem.innerText + '(', refreshFormulaBar: true,
                    refreshEditorElem: true, isAppend: true
                });
            }
            else {
                this.parent.notify(editOperation, { action: 'startEdit', value: '=' + trgtElem.innerText + '(', address: sheet.activeCell });
                this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: '=' + trgtElem.innerText + '(' });
            }
            this.dialog.hide();
        }
    };
    FormulaBar.prototype.addEventListener = function () {
        this.parent.on(formulaBar, this.createFormulaBar, this);
        this.parent.on(click, this.clickHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(selectionComplete, this.formulaBarUpdateHandler, this);
        this.parent.on(mouseUpAfterSelection, this.UpdateValueAfterMouseUp, this);
        this.parent.on(formulaBarOperation, this.editOperationHandler, this);
    };
    FormulaBar.prototype.destroy = function () {
        this.removeEventListener();
        this.comboBoxInstance.destroy();
        this.comboBoxInstance = null;
        this.insertFnRipple();
        this.insertFnRipple = null;
        var formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        if (formulaPanel) {
            detach(formulaPanel);
        }
    };
    FormulaBar.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaBar, this.createFormulaBar);
            this.parent.off(click, this.clickHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(selectionComplete, this.formulaBarUpdateHandler);
            this.parent.off(mouseUpAfterSelection, this.UpdateValueAfterMouseUp);
            this.parent.off(formulaBarOperation, this.editOperationHandler);
        }
    };
    FormulaBar.prototype.editOperationHandler = function (args) {
        var action = args.action;
        switch (action) {
            case 'refreshFormulabar':
                this.getFormulaBar().value = args.value;
                break;
            case 'getPosition':
                args.position = this.getFormulaBar().getBoundingClientRect();
                break;
        }
    };
    FormulaBar.prototype.getFormulaBar = function () {
        return this.parent.element.querySelector('#' + this.parent.element.id + '_formula_input');
    };
    return FormulaBar;
}());

/**
 * @hidden
 * The `Formula` module is used to handle the formulas and its functionalities in Spreadsheet.
 */
var Formula = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for formula module in Spreadsheet.
     * @private
     */
    function Formula(parent) {
        this.isFormulaBar = false;
        this.isFormula = false;
        this.isPopupOpened = false;
        this.isPreventClose = false;
        this.isSubFormula = false;
        this.keyCodes = {
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            FIRSTALPHABET: 65,
            LASTALPHABET: 90,
            SPACE: 32,
            BACKSPACE: 8,
            TAB: 9,
            DELETE: 46,
            ENTER: 13,
            ESC: 27
        };
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookFormula);
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Formula.prototype.getModuleName = function () {
        return 'formula';
    };
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    Formula.prototype.destroy = function () {
        this.removeEventListener();
        if (this.autocompleteInstance) {
            this.autocompleteInstance.destroy();
        }
        this.autocompleteInstance = null;
        this.parent = null;
    };
    Formula.prototype.addEventListener = function () {
        this.parent.on(formulaOperation, this.performFormulaOperation, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(click, this.clickHandler, this);
    };
    Formula.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaOperation, this.performFormulaOperation);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(click, this.clickHandler);
        }
    };
    Formula.prototype.performFormulaOperation = function (args) {
        var action = args.action;
        switch (action) {
            case 'renderAutoComplete':
                this.renderAutoComplete();
                break;
            case 'endEdit':
                this.endEdit();
                break;
            case 'addDefinedName':
                this.addDefinedName(args.definedName);
                break;
            case 'getNames':
                if (!args.sheetName) {
                    args.sheetName = getSheetName(this.parent);
                }
                args.names = this.getNames(args.sheetName);
                break;
            case 'getNameFromRange':
                args.definedName = this.getNameFromRange(args.range);
                break;
            case 'isFormulaEditing':
                args.isFormulaEdit = this.isFormula;
                break;
            case 'isCircularReference':
                var l10n = this.parent.serviceLocator.getService(locale);
                var dialogInst = this.parent.serviceLocator.getService(dialog);
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('CircularReference'),
                });
                args.argValue = '0';
                break;
        }
    };
    Formula.prototype.renderAutoComplete = function () {
        if (!this.parent.element.querySelector('#' + this.parent.element.id + '_ac')) {
            var acElem = this.parent.createElement('input', { id: this.parent.element.id + '_ac', className: 'e-ss-ac' });
            this.parent.element.appendChild(acElem);
            var eventArgs = {
                action: 'getLibraryFormulas',
                formulaCollection: []
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            var autoCompleteOptions = {
                dataSource: eventArgs.formulaCollection,
                cssClass: 'e-ss-atc',
                popupWidth: '130px',
                allowFiltering: true,
                filterType: 'StartsWith',
                sortOrder: 'Ascending',
                open: this.onSuggestionOpen.bind(this),
                close: this.onSuggestionClose.bind(this),
                select: this.onSelect.bind(this),
                actionComplete: this.onSuggestionComplete.bind(this)
            };
            this.autocompleteInstance = new AutoComplete(autoCompleteOptions, acElem);
            this.autocompleteInstance.createElement = this.parent.createElement;
        }
    };
    Formula.prototype.onSuggestionOpen = function (e) {
        var _this = this;
        this.isPopupOpened = true;
        var position = this.getPopupPosition();
        e.popup.offsetX = position.left;
        e.popup.offsetY = (position.top + position.height);
        e.popup.refreshPosition();
        e.popup.element.firstChild.style.maxHeight = '180px';
        new Promise(function (resolve, reject) {
            setTimeout(function () { resolve(); }, 100);
        }).then(function () {
            _this.triggerKeyDownEvent(_this.keyCodes.DOWN);
        });
    };
    Formula.prototype.onSuggestionClose = function (e) {
        if (this.isPreventClose) {
            e.cancel = true;
        }
        else {
            this.isPopupOpened = false;
        }
    };
    Formula.prototype.onSelect = function (e) {
        var updatedFormulaValue = '=' + e.itemData.value + '(';
        if (this.isSubFormula) {
            var editValue = this.getEditingValue();
            var parseIndex = editValue.lastIndexOf(this.getArgumentSeparator());
            if (parseIndex > -1) {
                updatedFormulaValue = editValue.slice(0, parseIndex + 1);
            }
            else {
                parseIndex = editValue.lastIndexOf('(');
                if (parseIndex > -1) {
                    updatedFormulaValue = editValue.slice(0, parseIndex + 1);
                }
            }
            updatedFormulaValue += e.itemData.value + '(';
        }
        this.parent.notify(editOperation, {
            action: 'refreshEditor', value: updatedFormulaValue,
            refreshFormulaBar: true, refreshEditorElem: true, refreshCurPos: !this.isFormulaBar
        });
    };
    Formula.prototype.onSuggestionComplete = function (args) {
        this.isPreventClose = args.result.length > 0;
        if (!this.isPreventClose) {
            args.cancel = true;
            this.hidePopUp();
        }
    };
    Formula.prototype.keyUpHandler = function (e) {
        if (this.parent.isEdit) {
            var editValue = this.getEditingValue();
            this.isFormula = checkIsFormula(editValue);
            if (this.isFormula || this.isPopupOpened) {
                if (e.keyCode !== this.keyCodes.TAB && this.isFormula) {
                    editValue = this.getSuggestionKeyFromFormula(editValue);
                }
                this.refreshFormulaSuggestion(e, editValue);
            }
        }
        else if (this.isPopupOpened) {
            this.hidePopUp();
        }
    };
    Formula.prototype.keyDownHandler = function (e) {
        var keyCode = e.keyCode;
        if (this.isFormula) {
            if (this.isPopupOpened) {
                switch (keyCode) {
                    case this.keyCodes.UP:
                    case this.keyCodes.DOWN:
                        e.preventDefault();
                        this.triggerKeyDownEvent(keyCode);
                        break;
                    case this.keyCodes.TAB:
                        e.preventDefault();
                        this.triggerKeyDownEvent(this.keyCodes.ENTER);
                        break;
                }
            }
        }
        else {
            var trgtElem = e.target;
            if (trgtElem.id === this.parent.element.id + '_name_box') {
                switch (keyCode) {
                    case this.keyCodes.ENTER:
                        this.addDefinedName({ name: trgtElem.value });
                        this.parent.element.focus();
                        break;
                    case this.keyCodes.ESC:
                        this.parent.element.focus();
                        break;
                }
            }
        }
    };
    Formula.prototype.clickHandler = function (e) {
        if (this.parent.isEdit) {
            var trgtElem = e.target;
            this.isFormulaBar = trgtElem.classList.contains('e-formula-bar');
        }
    };
    Formula.prototype.refreshFormulaSuggestion = function (e, formula) {
        if (formula.length > 0) {
            var autoCompleteElem = this.autocompleteInstance.element;
            var keyCode = e.keyCode;
            var isSuggestionAlreadyOpened = this.isPopupOpened;
            if (!this.isNavigationKey(keyCode)) {
                autoCompleteElem.value = formula;
                autoCompleteElem.dispatchEvent(new Event('input'));
                autoCompleteElem.dispatchEvent(new Event('keyup'));
                if (isSuggestionAlreadyOpened) {
                    this.triggerKeyDownEvent(this.keyCodes.DOWN);
                }
            }
        }
        else {
            if (this.isPopupOpened) {
                this.isPreventClose = false;
                this.hidePopUp();
            }
        }
    };
    Formula.prototype.endEdit = function () {
        this.isSubFormula = false;
        this.isPreventClose = false;
        this.isFormula = false;
        this.isFormulaBar = false;
        if (this.isPopupOpened) {
            this.hidePopUp();
            var suggPopupElem = document.querySelector('#' + this.parent.element.id + '_ac_popup');
            if (suggPopupElem) {
                detach(suggPopupElem);
            }
            this.isPopupOpened = false;
        }
    };
    Formula.prototype.hidePopUp = function () {
        this.autocompleteInstance.hidePopup();
    };
    Formula.prototype.getSuggestionKeyFromFormula = function (formula) {
        var suggestValue = '';
        formula = formula.substr(1); //remove = char.
        if (formula) {
            var bracketIndex = formula.lastIndexOf('(');
            formula = formula.substr(bracketIndex + 1);
            var fSplit = formula.split(this.getArgumentSeparator());
            if (fSplit.length === 1) {
                suggestValue = fSplit[0];
                this.isSubFormula = bracketIndex > -1;
            }
            else {
                suggestValue = fSplit[fSplit.length - 1];
                this.isSubFormula = true;
            }
            var isAlphaNumeric = suggestValue.match(/\w/);
            if (!isAlphaNumeric || (isAlphaNumeric && isAlphaNumeric.index !== 0)) {
                suggestValue = '';
            }
        }
        return suggestValue;
    };
    Formula.prototype.getPopupPosition = function () {
        var eventArgs = { position: null };
        if (this.isFormulaBar) {
            eventArgs.action = 'getPosition';
            this.parent.notify(formulaBarOperation, eventArgs);
        }
        else {
            eventArgs.action = 'getPosition';
            this.parent.notify(editOperation, eventArgs);
        }
        return eventArgs.position;
    };
    Formula.prototype.getEditingValue = function () {
        var eventArgs = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        return eventArgs.editedValue;
    };
    Formula.prototype.isNavigationKey = function (keyCode) {
        return (keyCode === this.keyCodes.UP) || (keyCode === this.keyCodes.DOWN) || (keyCode === this.keyCodes.LEFT)
            || (keyCode === this.keyCodes.RIGHT);
    };
    Formula.prototype.triggerKeyDownEvent = function (keyCode) {
        var autoCompleteElem = this.autocompleteInstance.element;
        autoCompleteElem.dispatchEvent(new Event('input'));
        var eventArg = new Event('keydown');
        // tslint:disable:no-string-literal
        eventArg['keyCode'] = keyCode;
        eventArg['which'] = keyCode;
        eventArg['altKey'] = false;
        eventArg['shiftKey'] = false;
        eventArg['ctrlKey'] = false;
        // tslint:enable:no-string-literal
        autoCompleteElem.dispatchEvent(eventArg);
    };
    Formula.prototype.getArgumentSeparator = function () {
        if (this.argumentSeparator) {
            return this.argumentSeparator;
        }
        else {
            var eventArgs = {
                action: 'getArgumentSeparator', argumentSeparator: ''
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            this.argumentSeparator = eventArgs.argumentSeparator;
            return eventArgs.argumentSeparator;
        }
    };
    Formula.prototype.getNames = function (sheetName) {
        var names = this.parent.definedNames.filter(function (name) { return name.scope === '' || name.scope === sheetName; });
        return names;
    };
    Formula.prototype.getNameFromRange = function (range) {
        var singleRange = range.slice(0, range.indexOf(':'));
        var sRange = range.slice(range.indexOf('!') + 1).split(':');
        var isSingleCell = sRange.length > 1 && sRange[0] === sRange[1];
        var name = this.parent.definedNames.filter(function (name, index) {
            if (isSingleCell && name.refersTo === '=' + singleRange) {
                return true;
            }
            return name.refersTo === '=' + range;
        });
        return name && name[0];
    };
    Formula.prototype.addDefinedName = function (definedName) {
        if (!definedName.refersTo) {
            var sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
            var selectRange$$1 = sheet.selectedRange;
            if (!isNullOrUndefined(selectRange$$1)) {
                var colIndex = selectRange$$1.indexOf(':');
                var left = selectRange$$1.substr(0, colIndex);
                var right = selectRange$$1.substr(colIndex + 1, selectRange$$1.length);
                selectRange$$1 = left === right ? left : selectRange$$1;
            }
            definedName.refersTo = getSheetName(this.parent) + '!' + selectRange$$1;
        }
        var eventArgs = {
            action: 'addDefinedName', definedName: definedName, isAdded: false
        };
        this.parent.notify(workbookFormulaOperation, eventArgs);
        if (!eventArgs.isAdded) {
            this.parent.serviceLocator.getService(dialog).show({
                content: this.parent.serviceLocator.getService(locale).getConstant('DefineNameExists'),
                width: '300'
            });
        }
        return true;
    };
    return Formula;
}());

/**
 * Represents SheetTabs for Spreadsheet.
 */
var SheetTabs = /** @__PURE__ @class */ (function () {
    function SheetTabs(parent) {
        this.aggregateContent = '';
        this.parent = parent;
        this.addEventListener();
    }
    SheetTabs.prototype.getModuleName = function () {
        return 'sheetTabs';
    };
    SheetTabs.prototype.createSheetTabs = function () {
        var _this = this;
        if (!this.parent.showSheetTabs && this.tabInstance) {
            this.destroy();
            return;
        }
        var l10n = this.parent.serviceLocator.getService(locale);
        var panel = this.parent.createElement('div', {
            className: 'e-sheet-tab-panel', id: this.parent.element.id + '_sheet_tab_panel'
        });
        var addBtn = this.parent.createElement('button', {
            className: 'e-add-sheet-tab e-btn e-css e-flat e-icon-btn', attrs: { 'title': l10n.getConstant('AddSheet') }
        });
        addBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-add-icon' }));
        addBtn.addEventListener('click', this.addSheetTab.bind(this));
        panel.appendChild(addBtn);
        this.addBtnRipple = rippleEffect(panel, { selector: '.e-add-sheet-tab' });
        var ddb = this.parent.createElement('button', { attrs: { 'title': l10n.getConstant('ListAllSheets') } });
        panel.appendChild(ddb);
        this.parent.element.appendChild(panel);
        var items = this.getSheetTabItems();
        this.dropDownInstance = new DropDownButton({
            iconCss: 'e-icons',
            items: items.ddbItems,
            select: function (args) { return _this.updateSheetTab({ idx: _this.dropDownInstance.items.indexOf(args.item) }); },
            beforeOpen: function (args) { return _this.beforeOpenHandler(_this.dropDownInstance, args.element); },
            open: function (args) { return _this.openHandler(_this.dropDownInstance, args.element, 'left'); },
            cssClass: 'e-sheets-list e-flat e-caret-hide',
            close: function () { return _this.parent.element.focus(); }
        });
        this.dropDownInstance.createElement = this.parent.createElement;
        this.dropDownInstance.appendTo(ddb);
        var sheetTab = this.parent.createElement('div', { className: 'e-sheet-tab' });
        this.tabInstance = new Tab({
            selectedItem: 0,
            overflowMode: 'Scrollable',
            items: items.tabItems,
            scrollStep: 250,
            selecting: function (args) {
                /** */
            },
            selected: function (args) {
                if (args.selectedIndex === args.previousIndex) {
                    return;
                }
                _this.parent.activeSheetTab = args.selectedIndex + 1;
                _this.parent.dataBind();
                _this.updateDropDownItems(args.selectedIndex, args.previousIndex);
                _this.parent.element.focus();
            },
            created: function () {
                var tBarItems = _this.tabInstance.element.querySelector('.e-toolbar-items');
                tBarItems.classList.add('e-sheet-tabs-items');
                EventHandler.add(tBarItems, 'dblclick', _this.renameSheetTab, _this);
            },
        });
        panel.appendChild(sheetTab);
        this.tabInstance.createElement = this.parent.createElement;
        this.tabInstance.appendTo(sheetTab);
        // tslint:disable-next-line:no-any
        EventHandler.remove(this.tabInstance.element, 'keydown', this.tabInstance.spaceKeyDown);
    };
    SheetTabs.prototype.updateDropDownItems = function (curIdx, prevIdx) {
        if (prevIdx > -1) {
            this.dropDownInstance.items[prevIdx].iconCss = '';
        }
        this.dropDownInstance.items[curIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
    };
    SheetTabs.prototype.beforeOpenHandler = function (instance, element) {
        var viewportHeight = this.parent.viewport.height;
        var actualHeight = (parseInt(getComputedStyle(element.firstElementChild).height, 10) *
            instance.items.length) + (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            element.style.height = viewportHeight + "px";
            element.style.overflowY = 'auto';
        }
        element.parentElement.style.visibility = 'hidden';
    };
    SheetTabs.prototype.openHandler = function (instance, element, positionX) {
        var wrapper = element.parentElement;
        var height;
        var collide = isCollide(wrapper);
        if (collide.indexOf('bottom') === -1) {
            height = element.style.overflowY === 'auto' ? this.parent.viewport.height : wrapper.getBoundingClientRect().height;
            var offset = calculatePosition(instance.element, positionX, 'top');
            if (positionX === 'right') {
                offset.left -= wrapper.getBoundingClientRect().width;
            }
            wrapper.style.left = offset.left + "px";
            wrapper.style.top = offset.top - height + "px";
        }
        wrapper.style.visibility = '';
    };
    SheetTabs.prototype.getSheetTabItems = function () {
        var _this = this;
        var tabItems = [];
        var ddbItems = [];
        var sheetName;
        this.parent.sheets.forEach(function (sheet, index) {
            sheetName = getSheetName(_this.parent, index + 1);
            tabItems.push({ header: { 'text': sheetName } });
            ddbItems.push({ text: sheetName, iconCss: index + 1 === _this.parent.activeSheetTab ? 'e-selected-icon e-icons' : '' });
        });
        return { tabItems: tabItems, ddbItems: ddbItems };
    };
    SheetTabs.prototype.refreshSheetTab = function () {
        var items = this.getSheetTabItems();
        this.dropDownInstance.items = items.ddbItems;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.items = items.tabItems;
        this.tabInstance.selectedItem = this.parent.activeSheetTab - 1;
        this.tabInstance.dataBind();
    };
    SheetTabs.prototype.addSheetTab = function (args) {
        var idx = args.text && args.text === 'Insert' ? this.parent.activeSheetTab - 1 : this.parent.activeSheetTab;
        this.parent.createSheet(idx);
        var sheetName = this.parent.sheets[idx].name;
        this.dropDownInstance.items.splice(idx, 0, { text: sheetName });
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.addTab([{ header: { text: sheetName }, content: '' }], idx);
        if (idx === this.parent.activeSheetTab - 1) {
            this.parent.renderModule.refreshSheet();
            this.updateDropDownItems(idx, idx + 1);
        }
        else {
            this.updateSheetTab({ idx: idx });
        }
        this.parent.element.focus();
    };
    SheetTabs.prototype.updateSheetTab = function (args) {
        this.tabInstance.selectedItem = args.idx;
        this.tabInstance.dataBind();
    };
    SheetTabs.prototype.switchSheetTab = function (args) {
        var target = closest(args.event.target, '.e-toolbar-item');
        if (!target) {
            return;
        }
        var text = target.querySelector('.e-tab-text').textContent;
        for (var i = 0, len = this.tabInstance.items.length; i < len; i++) {
            if (this.tabInstance.items[i].header.text === text) {
                if (this.parent.activeSheetTab - 1 !== i) {
                    this.updateSheetTab({ idx: i });
                }
                break;
            }
        }
    };
    SheetTabs.prototype.renameSheetTab = function () {
        var target = this.tabInstance.element.querySelector('.e-toolbar-item.e-active');
        if (target) {
            target = target.querySelector('.e-text-wrap');
            var value = target.querySelector('.e-tab-text').textContent;
            var input = this.parent.createElement('input', {
                id: this.parent.element.id + '_rename_input',
                className: 'e-input e-sheet-rename', styles: "width: " + target.getBoundingClientRect().width + "px", attrs: {
                    'type': 'text', 'name': 'Rename', 'required': '', 'value': value, 'spellcheck': 'false', 'maxlength': '31'
                }
            });
            target.firstElementChild.style.display = 'none';
            target.appendChild(input);
            EventHandler.add(document, 'mousedown touchstart', this.renameInputFocusOut, this);
            EventHandler.add(input, 'input', this.updateWidth, this);
            input.focus();
            input.setSelectionRange(0, value.length);
            EventHandler.remove(closest(target, '.e-toolbar-items'), 'dblclick', this.renameSheetTab);
        }
    };
    SheetTabs.prototype.updateWidth = function (e) {
        var target = e.target;
        var len = target.value.length;
        var value = target.value.split(' ');
        if (value.length) {
            var spaceLen = value.length - 1;
            len -= spaceLen;
            len += (spaceLen * 0.5);
        }
        target.style.width = len + "ch";
    };
    SheetTabs.prototype.renameInputFocusOut = function (e) {
        var target = e.target;
        if ((e.type === 'mousedown' || e.type === 'touchstart') && (target.classList.contains('e-sheet-rename') ||
            closest(target, '.e-dlg-container'))) {
            return;
        }
        target = document.getElementById(this.parent.element.id + '_rename_input');
        if (e.type === 'keydown' && e.keyCode === 27) {
            this.removeRenameInput(target);
            this.parent.element.focus();
            return;
        }
        var value = target.value;
        var l10n = this.parent.serviceLocator.getService(locale);
        if (value) {
            var idx = this.tabInstance.selectedItem;
            if (!value.match(new RegExp('.*[\\[\\]\\*\\\\\/\\?].*'))) {
                if (this.tabInstance.items[idx].header.text !== value) {
                    for (var i = 0, len = this.parent.sheets.length; i < len; i++) {
                        if (i + 1 !== this.parent.activeSheetTab && this.parent.sheets[i].name.toLowerCase() === value.toLowerCase()) {
                            this.showRenameDialog(target, l10n.getConstant('SheetRenameAlreadyExistsAlert'));
                            return;
                        }
                    }
                }
                var items = this.removeRenameInput(target);
                if (this.tabInstance.items[idx].header.text !== value) {
                    this.parent.sheets[idx].name = value;
                    this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
                    this.tabInstance.items[idx].header.text = value;
                    this.dropDownInstance.items[idx].text = value;
                    this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
                    if (value.indexOf('  ') > -1) {
                        this.tabInstance.setProperties({ 'items': this.tabInstance.items }, true);
                        items.querySelector('.e-toolbar-item.e-active .e-tab-text').innerHTML = value;
                    }
                    else {
                        this.tabInstance.items = this.tabInstance.items;
                        this.tabInstance.dataBind();
                    }
                }
                if (e.type === 'keydown' || (closest(e.target, '.e-spreadsheet'))) {
                    this.parent.element.focus();
                }
            }
            else {
                this.showRenameDialog(target, l10n.getConstant('SheetRenameInvalidAlert'));
            }
        }
        else {
            this.showRenameDialog(target, l10n.getConstant('SheetRenameEmptyAlert'));
        }
    };
    SheetTabs.prototype.removeRenameInput = function (target) {
        var textEle = target.parentElement.querySelector('.e-tab-text');
        var sheetItems = closest(target, '.e-toolbar-items');
        EventHandler.add(sheetItems, 'dblclick', this.renameSheetTab, this);
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        EventHandler.remove(target, 'input', this.updateWidth);
        remove(target);
        textEle.style.display = '';
        return sheetItems;
    };
    SheetTabs.prototype.showRenameDialog = function (target, content) {
        this.parent.serviceLocator.getService(dialog).show({
            target: document.getElementById(this.parent.element.id + '_sheet_panel'),
            height: 180, width: 400, isModal: true, showCloseIcon: true,
            content: content,
            beforeOpen: function () { return target.focus(); },
            close: function () { return target.setSelectionRange(0, target.value.length); }
        });
    };
    SheetTabs.prototype.focusRenameInput = function () {
        var input = document.getElementById(this.parent.element.id + '_rename_input');
        if (input) {
            input.focus();
        }
    };
    SheetTabs.prototype.removeSheetTab = function (args) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.sheets.length > 1) {
            var sheet = this.parent.getActiveSheet();
            var isDataAvail = sheet.rows && sheet.rows.length ?
                (sheet.rows.length === 1 ? (sheet.rows[0].cells && sheet.rows[0].cells.length ? true : false) : true) : false;
            if (isDataAvail) {
                var dialogInst_1 = this.parent.serviceLocator.getService(dialog);
                dialogInst_1.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('DeleteSheetAlert'),
                    beforeOpen: function () { return _this.parent.element.focus(); },
                    buttons: [{
                            buttonModel: {
                                content: l10n.getConstant('Ok'), isPrimary: true
                            },
                            click: function () {
                                dialogInst_1.hide();
                                _this.destroySheet();
                            }
                        }]
                });
            }
            else {
                this.destroySheet();
            }
        }
        else {
            this.parent.serviceLocator.getService(dialog).show({
                target: document.getElementById(this.parent.element.id + '_sheet_panel'),
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('DeleteSingleLastSheetAlert'),
                beforeOpen: function () { return _this.parent.element.focus(); }
            });
        }
    };
    SheetTabs.prototype.destroySheet = function () {
        var activeSheetIdx = this.parent.activeSheetTab - 1;
        this.parent.removeSheet(activeSheetIdx);
        this.parent.notify(sheetsDestroyed, { sheetIndex: activeSheetIdx });
        this.dropDownInstance.items.splice(activeSheetIdx, 1);
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.removeTab(activeSheetIdx);
        this.parent.setProperties({ 'activeSheetTab': this.tabInstance.selectedItem + 1 }, true);
        this.parent.renderModule.refreshSheet();
        this.updateDropDownItems(this.tabInstance.selectedItem);
        this.parent.element.focus();
    };
    SheetTabs.prototype.showAggregate = function () {
        var _this = this;
        if (isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            return;
        }
        getUpdateUsingRaf(function () {
            var eventArgs = { Count: 0, Sum: '0', Avg: '0', Min: '0', Max: '0' };
            _this.parent.notify(aggregateComputation, eventArgs);
            if (eventArgs.Count) {
                if (!_this.aggregateContent) {
                    _this.aggregateContent = eventArgs.Sum ? 'Sum' : 'Count';
                }
                var key = _this.aggregateContent;
                var content = key + ": " + eventArgs[key];
                if (!_this.aggregateDropDown) {
                    var aggregateEle = _this.parent.createElement('button');
                    document.getElementById(_this.parent.element.id + "_sheet_tab_panel").appendChild(aggregateEle);
                    _this.aggregateDropDown = new DropDownButton({
                        content: content,
                        items: _this.getAggregateItems(eventArgs),
                        select: function (args) { return _this.updateAggregateContent(args.item.text, eventArgs); },
                        beforeOpen: function (args) {
                            return _this.beforeOpenHandler(_this.aggregateDropDown, args.element);
                        },
                        open: function (args) { return _this.openHandler(_this.aggregateDropDown, args.element, 'right'); },
                        close: function () { return _this.parent.element.focus(); },
                        cssClass: 'e-aggregate-list e-flat'
                    });
                    _this.aggregateDropDown.createElement = _this.parent.createElement;
                    _this.aggregateDropDown.appendTo(aggregateEle);
                }
                else {
                    _this.updateAggregateContent(content, eventArgs);
                }
            }
        });
    };
    SheetTabs.prototype.getAggregateItems = function (args) {
        var _this = this;
        var items = [];
        var text;
        var iconCss;
        Object.keys(args).forEach(function (key) {
            if (args[key] !== aggregateComputation) {
                text = key + ": " + args[key];
                iconCss = key === _this.aggregateContent ? 'e-selected-icon e-icons' : '';
                items.push({ text: text, iconCss: iconCss });
            }
        });
        return items;
    };
    SheetTabs.prototype.updateAggregateContent = function (text, eventArgs) {
        this.aggregateContent = text.split(': ')[0];
        this.aggregateDropDown.content = text;
        this.aggregateDropDown.dataBind();
        this.aggregateDropDown.setProperties({ 'items': this.getAggregateItems(eventArgs) }, true);
    };
    SheetTabs.prototype.removeAggregate = function () {
        if (this.aggregateDropDown && isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            this.aggregateDropDown.destroy();
            remove(this.aggregateDropDown.element);
            this.aggregateDropDown = null;
        }
    };
    SheetTabs.prototype.addEventListener = function () {
        this.parent.on(sheetTabs, this.createSheetTabs, this);
        this.parent.on(refreshSheetTabs, this.refreshSheetTab, this);
        this.parent.on(addSheetTab, this.addSheetTab, this);
        this.parent.on(removeSheetTab, this.removeSheetTab, this);
        this.parent.on(renameSheetTab, this.renameSheetTab, this);
        this.parent.on(cMenuBeforeOpen, this.switchSheetTab, this);
        this.parent.on(activeSheetChanged, this.updateSheetTab, this);
        this.parent.on(renameSheet, this.renameInputFocusOut, this);
        this.parent.on(activeCellChanged, this.removeAggregate, this);
        this.parent.on(onVerticalScroll, this.focusRenameInput, this);
        this.parent.on(onHorizontalScroll, this.focusRenameInput, this);
    };
    SheetTabs.prototype.destroy = function () {
        this.removeEventListener();
        this.dropDownInstance.destroy();
        this.dropDownInstance = null;
        this.tabInstance.destroy();
        this.tabInstance = null;
        this.aggregateDropDown = null;
        this.aggregateContent = null;
        this.addBtnRipple();
        this.addBtnRipple = null;
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        var ele = document.getElementById(this.parent.element.id + '_sheet_tab_panel');
        if (ele) {
            remove(ele);
        }
        this.parent = null;
    };
    SheetTabs.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(sheetTabs, this.createSheetTabs);
            this.parent.off(refreshSheetTabs, this.refreshSheetTab);
            this.parent.off(addSheetTab, this.addSheetTab);
            this.parent.off(removeSheetTab, this.removeSheetTab);
            this.parent.off(renameSheetTab, this.renameSheetTab);
            this.parent.off(cMenuBeforeOpen, this.switchSheetTab);
            this.parent.off(activeSheetChanged, this.updateSheetTab);
            this.parent.off(renameSheet, this.renameInputFocusOut);
            this.parent.off(activeCellChanged, this.removeAggregate);
            this.parent.off(onVerticalScroll, this.focusRenameInput);
            this.parent.off(onHorizontalScroll, this.focusRenameInput);
        }
    };
    return SheetTabs;
}());

var Open = /** @__PURE__ @class */ (function () {
    function Open(parent) {
        this.parent = parent;
        this.addEventListener();
        this.renderFileUpload();
        //Spreadsheet.Inject(WorkbookOpen);
    }
    /**
     * Adding event listener for success and failure
     */
    Open.prototype.addEventListener = function () {
        this.parent.on(openSuccess, this.openSuccess, this);
        this.parent.on(openFailure, this.openFailed, this);
    };
    /**
     * Removing event listener for success and failure
     */
    Open.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(openSuccess, this.openSuccess);
            this.parent.off(openFailure, this.openFailed);
        }
    };
    /**
     * Rendering upload component for importing files.
     */
    Open.prototype.renderFileUpload = function () {
        var uploadID = this.parent.element.id + '_fileUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.xls, .xlsx, .csv', name: 'fileUpload' }
        }));
        var uploadBox = document.getElementById(uploadID);
        uploadBox.onchange = this.fileSelect.bind(this);
        uploadBox.onerror = this.openFailed.bind(this);
        uploadBox.style.display = 'none';
    };
    /**
     * Process after select the excel and image file.
     * @param {Event} args - File select native event.
     */
    Open.prototype.fileSelect = function (args) {
        /* tslint:disable-next-line:no-any */
        var filesData = args.target.files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        var impArgs = {
            file: filesData
        };
        this.parent.open(impArgs);
        document.getElementById(this.parent.element.id + '_fileUpload').value = '';
    };
    /**
     * File open success event declaration.
     * @param {string} response - File open success response text.
     */
    Open.prototype.openSuccess = function (response) {
        var openError = ['UnsupportedFile', 'InvalidUrl'];
        if (openError.indexOf(response.data) > -1) {
            this.parent.serviceLocator.getService(dialog).show({
                content: this.parent.serviceLocator.getService('spreadsheetLocale')
                    .getConstant(response.data),
                width: '300'
            });
            this.parent.hideSpinner();
            return;
        }
        if (!this.parent.element) {
            return;
        }
        this.parent.renderModule.refreshSheet();
        this.parent.notify(refreshSheetTabs, this);
        this.parent.hideSpinner();
    };
    /**
     * File open failure event declaration.
     * @param {object} args - Open failure arguments.
     */
    Open.prototype.openFailed = function (args) {
        this.parent.trigger('openFailure', args);
        this.parent.hideSpinner();
        /* Need to Implement */
    };
    /**
     * To Remove the event listeners.
     */
    Open.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the sheet open module name.
     */
    Open.prototype.getModuleName = function () {
        return 'open';
    };
    return Open;
}());

/**
 * `Save` module is used to handle the save action in Spreadsheet.
 */
var Save = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Save module in Spreadsheet.
     * @private
     */
    function Save(parent) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookSave);
    }
    /**
     * To destroy the Save module.
     * @return {void}
     * @hidden
     */
    Save.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    Save.prototype.addEventListener = function () {
        this.parent.on(beginSave, this.initiateSave, this);
        this.parent.on(saveCompleted, this.saveCompleted, this);
    };
    Save.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
            this.parent.off(saveCompleted, this.saveCompleted);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    Save.prototype.getModuleName = function () {
        return 'save';
    };
    /**
     * Initiate save process.
     * @hidden
     */
    Save.prototype.initiateSave = function (args) {
        this.parent.showSpinner();
    };
    /**
     * Save action completed.
     * @hidden
     */
    Save.prototype.saveCompleted = function (args) {
        this.parent.hideSpinner();
    };
    return Save;
}());

/**
 * Represents context menu for Spreadsheet.
 */
var ContextMenu$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for ContextMenu module.
     */
    function ContextMenu$$1(parent) {
        this.parent = parent;
        this.init();
    }
    ContextMenu$$1.prototype.init = function () {
        this.initContextMenu();
        this.addEventListener();
    };
    ContextMenu$$1.prototype.initContextMenu = function () {
        var ul = document.createElement('ul');
        ul.id = this.parent.element.id + '_contextmenu';
        this.parent.element.appendChild(ul);
        this.contextMenuInstance = new ContextMenu({
            cssClass: 'e-spreadsheet-contextmenu',
            target: '#' + this.parent.element.id,
            filter: 'e-numericcontainer e-active-cell e-selection e-row e-header-row e-select-all-cell e-sheet-tabs-items',
            select: this.selectHandler.bind(this),
            beforeOpen: this.beforeOpenHandler.bind(this),
            beforeClose: this.beforeCloseHandler.bind(this)
        }, ul);
    };
    /**
     * Before close event handler.
     */
    ContextMenu$$1.prototype.beforeCloseHandler = function (args) {
        this.parent.trigger('contextMenuBeforeClose', args);
    };
    /**
     * Select event handler.
     */
    ContextMenu$$1.prototype.selectHandler = function (args) {
        var selectArgs = extend({ cancel: false }, args);
        this.parent.trigger('contextMenuItemSelect', selectArgs);
        if (!selectArgs.cancel) {
            var l10n = this.parent.serviceLocator.getService(locale);
            switch (args.item.text) {
                case l10n.getConstant('Cut'):
                    this.parent.notify(cut, { isClick: true });
                    break;
                case l10n.getConstant('Copy'):
                    this.parent.notify(copy, { isClick: true });
                    break;
                case l10n.getConstant('Paste'):
                    this.parent.notify(paste, { isClick: true });
                    break;
                case l10n.getConstant('Values'):
                    this.parent.notify(paste, { type: 'Values' });
                    break;
                case l10n.getConstant('Formats'):
                    this.parent.notify(paste, { type: 'Formats' });
                    break;
                case l10n.getConstant('Rename'):
                    this.parent.notify(renameSheetTab, {});
                    break;
                case l10n.getConstant('Delete'):
                    this.parent.notify(removeSheetTab, {});
                    break;
                case l10n.getConstant('Insert'):
                    this.parent.notify(addSheetTab, { text: 'Insert' });
                    break;
                case l10n.getConstant('SortAscending'):
                    this.parent.sort();
                    break;
                case l10n.getConstant('SortDescending'):
                    this.parent.sort({ sortDescriptors: { order: 'Descending' } });
                    break;
                case l10n.getConstant('CustomSort') + '...':
                    this.parent.notify(initiateCustomSort, null);
                    break;
                default:
                // Rename functionality goes here
            }
        }
    };
    /**
     * Before open event handler.
     */
    ContextMenu$$1.prototype.beforeOpenHandler = function (args) {
        var target = this.getTarget(args.event.target);
        if (args.element.classList.contains('e-contextmenu')) {
            var items = this.getDataSource(target);
            this.contextMenuInstance.items = items;
            this.contextMenuInstance.dataBind();
        }
        this.parent.trigger('contextMenuBeforeOpen', args);
        this.parent.notify(cMenuBeforeOpen, extend(args, { target: target }));
    };
    /**
     * To get target area based on right click.
     */
    ContextMenu$$1.prototype.getTarget = function (target) {
        if (closest(target, '.e-main-content')) {
            return 'Content';
        }
        else if (closest(target, '.e-column-header')) {
            return 'ColumnHeader';
        }
        else if (closest(target, '.e-row-header')) {
            return 'RowHeader';
        }
        else if (closest(target, '.e-sheet-tabs-items')) {
            return 'Footer';
        }
        else if (closest(target, '.e-selectall-container')) {
            return 'SelectAll';
        }
        else {
            return '';
        }
    };
    /**
     * To populate context menu items based on target area.
     */
    ContextMenu$$1.prototype.getDataSource = function (target) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var items = [];
        if (target === 'Content') {
            this.setClipboardData(items, l10n);
            //push sort items here
            this.setSortItems(items);
        }
        else if (target === 'RowHeader') {
            this.setClipboardData(items, l10n);
        }
        else if (target === 'ColumnHeader') {
            this.setClipboardData(items, l10n);
        }
        else if (target === 'SelectAll') {
            this.setClipboardData(items, l10n);
            this.setSortItems(items);
        }
        else if (target === 'Footer') {
            items.push({
                text: l10n.getConstant('Insert')
            });
            items.push({
                text: l10n.getConstant('Delete'), iconCss: 'e-icons e-delete'
            });
            items.push({
                text: l10n.getConstant('Rename')
            });
        }
        return items;
    };
    /**
     * Sets sorting related items to the context menu.
     */
    ContextMenu$$1.prototype.setSortItems = function (items) {
        var l10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.allowSorting) {
            items.push({
                text: l10n.getConstant('Sort'),
                iconCss: 'e-icons e-sort-icon',
                items: [
                    { text: l10n.getConstant('SortAscending'), iconCss: 'e-icons e-sort-asc' },
                    { text: l10n.getConstant('SortDescending'), iconCss: 'e-icons e-sort-desc' },
                    { text: l10n.getConstant('CustomSort') + '...', iconCss: 'e-icons e-sort-custom' }
                ]
            });
        }
    };
    ContextMenu$$1.prototype.setClipboardData = function (items, l10n) {
        if (this.parent.enableClipboard) {
            items.push({
                text: l10n.getConstant('Cut'),
                iconCss: 'e-icons e-cut-icon'
            });
            items.push({
                text: l10n.getConstant('Copy'),
                iconCss: 'e-icons e-copy-icon'
            });
            items.push({
                text: l10n.getConstant('Paste'),
                iconCss: 'e-icons e-paste-icon'
            });
            items.push({
                text: l10n.getConstant('PasteSpecial'),
                items: [
                    { text: l10n.getConstant('Values') },
                    { text: l10n.getConstant('Formats') }
                ]
            });
        }
    };
    /**
     * To add event listener.
     */
    ContextMenu$$1.prototype.addEventListener = function () {
        this.parent.on(addContextMenuItems, this.addItemsHandler, this);
        this.parent.on(removeContextMenuItems, this.removeItemsHandler, this);
        this.parent.on(enableContextMenuItems, this.enableItemsHandler, this);
    };
    /**
     * To add context menu items before / after particular item.
     */
    ContextMenu$$1.prototype.addItemsHandler = function (args) {
        if (args.insertAfter) {
            this.contextMenuInstance.insertAfter(args.items, args.text, args.isUniqueId);
        }
        else {
            this.contextMenuInstance.insertBefore(args.items, args.text, args.isUniqueId);
        }
    };
    /**
     * To remove context menu items.
     */
    ContextMenu$$1.prototype.removeItemsHandler = function (args) {
        this.contextMenuInstance.removeItems(args.items, args.isUniqueId);
    };
    /**
     * To enable / disable context menu items.
     */
    ContextMenu$$1.prototype.enableItemsHandler = function (args) {
        this.contextMenuInstance.enableItems(args.items, args.enable, args.isUniqueId);
    };
    /**
     * To remove event listener.
     */
    ContextMenu$$1.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(addContextMenuItems, this.addItemsHandler);
            this.parent.off(removeContextMenuItems, this.removeItemsHandler);
            this.parent.off(enableContextMenuItems, this.enableItemsHandler);
        }
    };
    /**
     * To get module name.
     */
    ContextMenu$$1.prototype.getModuleName = function () {
        return 'contextMenu';
    };
    /**
     * Destroy method.
     */
    ContextMenu$$1.prototype.destroy = function () {
        this.removeEventListener();
        this.contextMenuInstance.destroy();
        var ele = document.getElementById(this.parent.element.id + '_contextmenu');
        if (ele) {
            detach(ele);
        }
        this.parent = null;
    };
    return ContextMenu$$1;
}());

/**
 * Specifies number format.
 */
var NumberFormat = /** @__PURE__ @class */ (function () {
    function NumberFormat(parent) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookNumberFormat);
    }
    NumberFormat.prototype.refreshCellElement = function (args) {
        var cell = this.parent.getCell(args.rowIndex, args.colIndex);
        if (!isNullOrUndefined(cell)) {
            this.parent.refreshNode(cell, args);
        }
    };
    /**
     * Adding event listener for number format.
     * @hidden
     */
    NumberFormat.prototype.addEventListener = function () {
        this.parent.on(refreshCellElement, this.refreshCellElement, this);
    };
    /**
     * Removing event listener for number format.
     * @hidden
     */
    NumberFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(refreshCellElement, this.refreshCellElement);
        }
    };
    /**
     * To Remove the event listeners.
     */
    NumberFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook import module name.
     */
    NumberFormat.prototype.getModuleName = function () {
        return 'numberFormat';
    };
    return NumberFormat;
}());

/**
 * `Sort` module is used to handle the sort action in Spreadsheet.
 */
var Sort = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for sort module.
     */
    function Sort(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     * @return {void}
     */
    Sort.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    Sort.prototype.addEventListener = function () {
        this.parent.on(validateSortRange, this.validateSortRange, this);
        this.parent.on(beforeSort, this.beforeSortHandler, this);
        this.parent.on(sortComplete, this.sortComplete, this);
        this.parent.on(initiateCustomSort, this.initiateCustomSort, this);
    };
    Sort.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(validateSortRange, this.validateSortRange);
            this.parent.off(beforeSort, this.beforeSortHandler);
            this.parent.off(sortComplete, this.sortComplete);
            this.parent.off(initiateCustomSort, this.initiateCustomSort);
        }
    };
    /**
     * Gets the module name.
     * @returns string
     */
    Sort.prototype.getModuleName = function () {
        return 'sort';
    };
    /**
     * Validates the range to be sorted.
     */
    Sort.prototype.validateSortRange = function (args) {
        args.isValid = this.showRangeAlert(args.range);
    };
    /**
     * Validates the range and shows the alert dialog and return true when invalid.
     * @param address - range address.
     */
    Sort.prototype.showRangeAlert = function (address) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var sheet = this.parent.getActiveSheet();
        var rangeStr = address || sheet.selectedRange;
        var range = getSwapRange(getIndexesFromAddress(rangeStr));
        if (range[0] > sheet.usedRange.rowIndex - 1 || range[1] > sheet.usedRange.colIndex) {
            this.parent.serviceLocator.getService(dialog).show({
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('SortOutOfRangeError')
            });
            this.parent.hideSpinner();
            return false;
        }
        return true;
    };
    /**
     * Initiates sort process.
     */
    Sort.prototype.beforeSortHandler = function (args) {
        this.parent.showSpinner();
    };
    /**
     * Invoked when the sort action is completed.
     */
    Sort.prototype.sortComplete = function (args) {
        var range = getIndexesFromAddress(args.range);
        this.parent.serviceLocator.getService('cell').refreshRange(range);
        this.parent.hideSpinner();
    };
    /**
     * Initiates the custom sort dialog.
     */
    Sort.prototype.initiateCustomSort = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        if (!this.showRangeAlert()) {
            return;
        }
        var dialogInst = this.parent.serviceLocator.getService(dialog);
        dialogInst.show({
            height: 400, width: 560, isModal: true, showCloseIcon: true, cssClass: 'e-customsort-dlg',
            header: l10n.getConstant('CustomSort'),
            beforeOpen: function () {
                dialogInst.dialogInstance.content = _this.customSortContent();
                dialogInst.dialogInstance.dataBind();
                _this.parent.element.focus();
            },
            buttons: [{
                    buttonModel: {
                        content: this.parent.serviceLocator.getService(locale).getConstant('Ok'), isPrimary: true
                    },
                    click: function () {
                        var element = dialogInst.dialogInstance.content;
                        var list = element.getElementsByClassName('e-list-sort e-listview e-lib')[0];
                        var listview = getComponent(list, 'listview');
                        var data = listview.dataSource;
                        _this.clearError();
                        var errorElem = element.getElementsByClassName('e-sort-error')[0];
                        errorElem.style.display = 'block';
                        if (!_this.validateError(data, element, errorElem)) {
                            dialogInst.hide();
                            var headercheck = element.getElementsByClassName('e-sort-checkheader')[0];
                            var headerCheckbox = getComponent(headercheck, 'checkbox');
                            var hasHeader = headerCheckbox.checked;
                            _this.parent.sort({ sortDescriptors: data, containsHeader: hasHeader });
                        }
                    }
                }]
        });
    };
    /**
     * Validates the errors of the sort criteria and displays the error.
     * @param json - listview datasource.
     * @param dialogElem - dialog content element.
     * @param errorElem - element to display error.
     */
    Sort.prototype.validateError = function (json, dialogElem, errorElem) {
        //1. All sort criteria must have a column specified. Check the selected sort criteria and try again.
        //2. Column B is being sorted by values more than once. Delete the duplicate sort criteria and try again.
        var l10n = this.parent.serviceLocator.getService(locale);
        var hasEmpty = json.some(function (element) { return element.field.toString() === ''; });
        if (hasEmpty) {
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), function (dropDown) {
                var hasError = !getComponent(dropDown, 'dropdownlist').value;
                if (hasError) {
                    dropDown.parentElement.classList.add('e-error');
                }
                return hasError; //breaks the loop if only one error added.
            });
            errorElem.innerText = l10n.getConstant('SortEmptyFieldError');
            return true;
        }
        var temp = new Set();
        var duplicateField = '';
        var hasDuplicate = json.some(function (element) {
            duplicateField = element.field.toString();
            return temp.size === temp.add(element.field).size;
        });
        var errorField = '';
        if (hasDuplicate) {
            var count_1 = 0;
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), function (dropDown) {
                var dropDownList = getComponent(dropDown, 'dropdownlist');
                if (dropDownList.value === duplicateField) {
                    dropDown.parentElement.classList.add('e-error');
                    errorField = dropDownList.text;
                    count_1++;
                }
                return count_1 === 2; //breaks the loop when 2 errors added.
            });
            errorElem.innerHTML = '<strong>' + errorField + '</strong>' + l10n.getConstant('SortDuplicateFieldError');
            return true;
        }
        return false;
    };
    /**
     * Creates all the elements and generates the dialog content element.
     */
    Sort.prototype.customSortContent = function () {
        var dialogElem = this.parent.createElement('div', { className: 'e-sort-dialog' });
        var fields = this.getFields();
        var listId = getUniqueID('customSort');
        var listviewObj = this.getCustomListview(listId);
        this.setHeaderTab(dialogElem, listviewObj, fields);
        var contentElem = this.parent.createElement('div', {
            className: 'e-sort-listsection',
            styles: ''
        });
        dialogElem.appendChild(contentElem);
        var listview = this.parent.createElement('div', { className: 'e-list-sort', styles: '' });
        contentElem.appendChild(listview);
        listviewObj.createElement = this.parent.createElement;
        listviewObj.appendTo(listview);
        this.renderListItem(listId, listviewObj, true, fields);
        var errorElem = this.parent.createElement('div', { className: 'e-sort-error' });
        dialogElem.appendChild(errorElem);
        return dialogElem;
    };
    /**
     * Gets the fields data from the selected range.
     */
    Sort.prototype.getFields = function () {
        var sheet = this.parent.getActiveSheet();
        var range = getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //for entire range
            range[0] = 0;
            range[1] = 0;
            range[3] = sheet.usedRange.colIndex;
        }
        var fields = [];
        var fieldName;
        for (range[1]; range[1] <= range[3]; range[1]++) {
            var cell = getCell(range[0], range[1], sheet);
            if (cell && cell.value) {
                var eventArgs = {
                    formattedText: cell.value,
                    value: cell.value,
                    format: cell.format,
                    onLoad: true
                };
                if (cell.format) {
                    this.parent.notify(getFormattedCellObject, eventArgs);
                }
                fieldName = eventArgs.formattedText;
            }
            else {
                fieldName = 'Column ' + getColumnHeaderText(range[1] + 1);
            }
            fields.push({ text: fieldName, value: 'Column ' + getColumnHeaderText(range[1] + 1) });
        }
        return fields;
    };
    /**
     * Creates the header tab for the custom sort dialog.
     * @param dialogElem - dialog content element.
     * @param listviewObj - listview instance.
     * @param fields - fields data.
     */
    Sort.prototype.setHeaderTab = function (dialogElem, listviewObj, fields) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var headerTabElement = this.parent.createElement('div', {
            className: 'e-sort-header',
            styles: '',
            innerHTML: ''
        });
        dialogElem.appendChild(headerTabElement);
        var addButton = this.parent.createElement('button', {
            className: 'e-btn e-sort-addbtn e-flat',
            innerHTML: l10n.getConstant('AddColumn')
        });
        var footer = this.parent.element.querySelector('.e-customsort-dlg .e-footer-content');
        footer.insertBefore(addButton, footer.firstElementChild);
        addButton.addEventListener('click', function () {
            if (listviewObj) {
                var listId = getUniqueID('customSort');
                listviewObj.addItem([{ id: listId, text: l10n.getConstant('ThenBy'), field: '', order: 'ascending' }]);
                _this.renderListItem(listId, listviewObj, checkHeaderObj.checked, fields, true);
            }
        });
        var checkHeaderObj = new CheckBox({
            label: l10n.getConstant('ContainsHeader'),
            checked: true,
            change: function (args) {
                var fieldsMap = args.checked ? { text: 'text', value: 'value' } : { text: 'value' };
                Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-sort-field e-dropdownlist e-lib'), function (dropDown) {
                    var dropDownListObj = getComponent(dropDown, 'dropdownlist');
                    dropDownListObj.dataSource = null; //reset datasource.
                    dropDownListObj.dataSource = fields;
                    dropDownListObj.fields = fieldsMap;
                    dropDownListObj.dataBind();
                });
            },
            cssClass: 'e-sort-headercheckbox'
        });
        var headerCheckbox = this.parent.createElement('input', {
            className: 'e-sort-checkheader', attrs: { type: 'checkbox' }
        });
        headerTabElement.appendChild(headerCheckbox);
        checkHeaderObj.createElement = this.parent.createElement;
        checkHeaderObj.appendTo(headerCheckbox);
    };
    /**
     * Creates a listview instance.
     * @param listId - unique id of the list item.
     */
    Sort.prototype.getCustomListview = function (listId) {
        var l10n = this.parent.serviceLocator.getService(locale);
        var data = [{ id: listId, text: l10n.getConstant('SortBy'), field: '', order: 'ascending' }];
        enableRipple(false);
        var listviewObj = new ListView({
            dataSource: data,
            fields: { id: 'id' },
            height: '100%',
            template: '<div class="e-sort-listwrapper">' +
                '<span class="text">${text}</span>' +
                '<div class="e-sort-row"><div class="e-sort-field"></div>' +
                '<div class="e-sort-order">' +
                '<span class="e-sort-ordertxt" style="display:none;">${order}</span></div>' +
                '<span class="e-icons e-sort-delete"></span></div>',
            cssClass: 'e-sort-template',
        });
        return listviewObj;
    };
    /**
     * Triggers the click event for delete icon.
     * @param element - current list item element.
     * @param listviewObj - listview instance.
     */
    Sort.prototype.deleteHandler = function (element, listviewObj) {
        var iconEle = element.getElementsByClassName('e-sort-delete')[0];
        //Event handler to bind the click event for delete icon
        iconEle.addEventListener('click', function () {
            if (element) {
                listviewObj.removeItem(element);
            }
        });
    };
    /**
     * Renders the dropdown and radio button components inside list item.
     * @param id - unique id of the list item.
     * @param listviewObj - listview instance.
     * @param containsHeader - data contains header.
     * @param fields - fields data.
     */
    Sort.prototype.renderListItem = function (id, lvObj, containsHeader, fields, btn) {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var element = lvObj.element.querySelector('li[data-uid=' + id + ']');
        var fieldsMap = containsHeader ? { text: 'text', value: 'value' } : { text: 'value' };
        var dropDown = element.getElementsByClassName('e-sort-field')[0];
        var dropDownListObj = new DropDownList({
            dataSource: fields,
            width: 'auto',
            fields: fieldsMap,
            placeholder: l10n.getConstant('SelectAColumn'),
            change: function (args) {
                if (!args.value) {
                    return;
                }
                Array.prototype.some.call(lvObj.dataSource, function (item) {
                    if (item.id === id) {
                        item.field = args.value;
                    }
                    return item.id === id; //breaks the loop when proper id found
                });
                _this.clearError();
            }
        });
        dropDownListObj.createElement = this.parent.createElement;
        dropDownListObj.appendTo(dropDown);
        if (!btn) {
            dropDownListObj.index = 0;
        }
        /* sort ascending radio button */
        var orderRadio = element.getElementsByClassName('e-sort-order')[0];
        var ordertxtElem = orderRadio.getElementsByClassName('e-sort-ordertxt')[0];
        var isAscending = ordertxtElem.innerText.toLocaleLowerCase() === 'ascending';
        var radiobutton = new RadioButton({
            label: l10n.getConstant('SortAscending'),
            name: 'sortAZ_' + id, value: 'ascending', checked: isAscending, cssClass: 'e-sort-radiobutton',
            change: function (args) { _this.setRadioBtnValue(lvObj, id, args.value); }
        });
        var radio = this.parent.createElement('input', {
            id: 'orderAsc_' + id, className: 'e-sort-radioasc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio);
        radiobutton.createElement = this.parent.createElement;
        radiobutton.appendTo(radio);
        /* sort descending radio button */
        var radiobutton2 = new RadioButton({
            label: l10n.getConstant('SortDescending'),
            name: 'sortAZ_' + id, value: 'descending', checked: !isAscending, cssClass: 'e-sort-radiobutton',
            change: function (args) { _this.setRadioBtnValue(lvObj, id, args.value); }
        });
        var radio2 = this.parent.createElement('input', {
            id: 'orderDesc_' + id, className: 'e-sort-radiodesc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio2);
        radiobutton2.createElement = this.parent.createElement;
        radiobutton2.appendTo(radio2);
        this.deleteHandler(element, lvObj);
    };
    /**
     * Sets the new value of the radio button.
     * @param listviewObj - listview instance.
     * @param id - unique id of the list item.
     * @param value - new value.
     */
    Sort.prototype.setRadioBtnValue = function (listviewObj, id, value) {
        if (!value) {
            return;
        }
        Array.prototype.some.call(listviewObj.dataSource, function (item) {
            if (item.id === id) {
                item.order = value;
            }
            return item.id === id; //breaks the loop when proper id found
        });
    };
    /**
     * Clears the error from the dialog.
     * @param dialogElem - dialog content element.
     */
    Sort.prototype.clearError = function () {
        var dialogElem = document.getElementsByClassName('e-sort-dialog')[0];
        var errorElem = dialogElem.getElementsByClassName('e-sort-error')[0];
        if (errorElem.style.display !== 'none' && errorElem.innerHTML !== '') {
            errorElem.style.display = 'none';
            Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-error'), function (element) {
                element.classList.remove('e-error');
            });
        }
    };
    return Sort;
}());

/**
 * Export Spreadsheet integration modules
 */

/**
 * Spreadsheet basic module.
 * @private
 */
var BasicModule = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Spreadsheet basic module.
     * @private
     */
    function BasicModule() {
        Spreadsheet.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, ContextMenu$1, Save, NumberFormat, CellFormat, Formula, Sort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    BasicModule.prototype.getModuleName = function () {
        return 'basic';
    };
    /**
     * Destroys the Spreadsheet basic module.
     * @return {void}
     */
    BasicModule.prototype.destroy = function () {
        /* code snippet */
    };
    return BasicModule;
}());

/**
 * Spreadsheet all module.
 * @private
 */
var AllModule = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Spreadsheet all module.
     * @private
     */
    function AllModule() {
        Spreadsheet.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, Save, NumberFormat, CellFormat, Formula, Sort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    AllModule.prototype.getModuleName = function () {
        return 'all';
    };
    /**
     * Destroys the Spreadsheet all module.
     * @return {void}
     */
    AllModule.prototype.destroy = function () {
        /* code snippet */
    };
    return AllModule;
}());

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the scroll settings.
 */
var ScrollSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$9(ScrollSettings, _super);
    function ScrollSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$8([
        Property(false)
    ], ScrollSettings.prototype, "isFinite", void 0);
    __decorate$8([
        Property(true)
    ], ScrollSettings.prototype, "enableVirtualization", void 0);
    return ScrollSettings;
}(ChildProperty));
/**
 * Represents the selection settings.
 */
var SelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$9(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$8([
        Property('Multiple')
    ], SelectionSettings.prototype, "mode", void 0);
    return SelectionSettings;
}(ChildProperty));

/** @hidden */
var DISABLED = 'e-disabled';
/** @hidden */
var locale = 'spreadsheetLocale';
/** @hidden */
var dialog = 'dialog';
/** @hidden */
var fontColor = {
    'Custom': [
        '#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
        '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
        '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
        '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
        '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
        '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000'
    ]
};
/** @hidden */
var fillColor = {
    'Custom': [
        '#ffffff', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633',
        '#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccff', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9',
        '#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080ff', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f',
        '#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53',
        '#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999', '#000099', '#b30000', '#000066', '#660066', '#86592d',
        '#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26',
    ]
};
/**
 * Default locale text
 * @hidden
 */
var defaultLocale = {
    Cut: 'Cut',
    Copy: 'Copy',
    Paste: 'Paste',
    PasteSpecial: 'Paste Special',
    All: 'All',
    Values: 'Values',
    Formats: 'Formats',
    Bold: 'Bold',
    Font: 'Font',
    FontSize: 'Font Size',
    Italic: 'Italic',
    Underline: 'Underline',
    Strikethrough: 'Strikethrough',
    TextColor: 'Text Color',
    FillColor: 'Fill Color',
    HorizontalAlignment: 'Horizontal Alignment',
    AlignLeft: 'Align Left',
    AlignCenter: 'Center',
    AlignRight: 'Align Right',
    VerticalAlignment: 'Vertical Alignment',
    AlignTop: 'Align Top',
    AlignMiddle: 'Align Middle',
    AlignBottom: 'Align Bottom',
    InsertFunction: 'Insert Function',
    Insert: 'Insert',
    Delete: 'Delete',
    Rename: 'Rename',
    Hide: 'Hide',
    Unhide: 'Unhide',
    NameBox: 'Name Box',
    ShowHeaders: 'Show Headers',
    HideHeaders: 'Hide Headers',
    ShowGridLines: 'Show Gridlines',
    HideGridLines: 'Hide Gridlines',
    AddSheet: 'Add Sheet',
    ListAllSheets: 'List All Sheets',
    FullScreen: 'Full Screen',
    CollapseToolbar: 'Collapse Toolbar',
    ExpandToolbar: 'Expand Toolbar',
    CollapseFormulaBar: 'Collapse Formula Bar',
    ExpandFormulaBar: 'Expand Formula Bar',
    File: 'File',
    Home: 'Home',
    Formulas: 'Formulas',
    View: 'View',
    New: 'New',
    Open: 'Open',
    SaveAs: 'Save As',
    ExcelXlsx: 'Microsoft Excel',
    ExcelXls: 'Microsoft Excel 97-2003',
    CSV: 'Comma-separated values',
    FormulaBar: 'Formula Bar',
    Sort: 'Sort',
    SortAscending: 'Ascending',
    SortDescending: 'Descending',
    CustomSort: 'Custom Sort',
    AddColumn: 'Add Column',
    ContainsHeader: 'Data contains header',
    CaseSensitive: 'Case sensitive',
    SortBy: 'Sort by',
    ThenBy: 'Then by',
    SelectAColumn: 'Select a column',
    SortEmptyFieldError: 'All sort criteria must have a column specified. Check the selected sort criteria and try again.',
    SortDuplicateFieldError: ' is being sorted by values more than once. Delete the duplicate sort criteria and try again.',
    SortOutOfRangeError: 'Select a cell or range inside the used range and try again.',
    Ok: 'Ok',
    Close: 'Close',
    Cancel: 'Cancel',
    Apply: 'Apply',
    MoreColors: 'More Colors',
    StandardColors: 'Standard Colors',
    General: 'General',
    Number: 'Number',
    Currency: 'Currency',
    Accounting: 'Accounting',
    ShortDate: 'Short Date',
    LongDate: 'Long Date',
    Time: 'Time',
    Percentage: 'Percentage',
    Fraction: 'Fraction',
    Scientific: 'Scientific',
    Text: 'Text',
    MobileFormulaBarPlaceHolder: 'Enter value or Formula',
    NumberFormat: 'Number Format',
    PasteAlert: 'You can\'t paste this here, because the copy area and paste area aren\'t in the same size. ' +
        'Please try pasting in a different range.',
    DestroyAlert: 'Are you sure you want to destroy the current workbook without saving and create a new workbook?',
    SheetRenameInvalidAlert: 'Sheet name contains invalid character.',
    SheetRenameEmptyAlert: 'Sheet name cannot be empty.',
    SheetRenameAlreadyExistsAlert: 'Sheet name already exists. Please enter another name.',
    DeleteSheetAlert: 'Are you sure you want to delete this sheet?',
    DeleteSingleLastSheetAlert: 'A Workbook must contain at least one visible worksheet.',
    PickACategory: 'Pick a category',
    Description: 'Description',
    UnsupportedFile: 'Unsupported File',
    InvalidUrl: 'Invalid URL',
    SUM: 'Adds a series of numbers and/or cells.',
    SUMIF: 'Adds the cells based on specified condition.',
    SUMIFS: 'Adds the cells based on specified conditions.',
    ABS: 'Returns the value of a number without its sign.',
    RAND: 'Returns a random number between 0 and 1.',
    RANDBETWEEN: 'Returns a random integer based on specified values.',
    FLOOR: 'Rounds a number down to the nearest multiple of a given factor.',
    CEILING: 'Rounds a number up to the nearest multiple of a given factor.',
    PRODUCT: 'Multiplies a series of numbers and/or cells.',
    AVERAGE: 'Calculates average for the series of numbers and/or cells excluding text.',
    AVERAGEIF: 'Calculates average for the cells based on specified criterion.',
    AVERAGEIFS: 'Calculates average for the cells based on specified conditions.',
    AVERAGEA: 'Calculates the average for the cells evaluating TRUE as 1, text and FALSE as 0.',
    COUNT: 'Counts the cells that contain numeric values in a range.',
    COUNTIF: 'Counts the cells based on specified condition.',
    COUNTIFS: 'Counts the cells based on specified conditions.',
    COUNTA: 'Counts the cells that contains values in a range.',
    MIN: 'Returns the smallest number of the given arguments.',
    MAX: 'Returns the largest number of the given arguments.',
    DATE: 'Returns the date based on given year, month, and day.',
    DAY: 'Returns the day from the given date.',
    DAYS: 'Returns the number of days between two dates.',
    IF: 'Returns value based on the given expression.',
    IFS: 'Returns value based on the given multiple expressions.',
    AND: 'Returns TRUE if all the arguments are TRUE, otherwise returns FALSE.',
    OR: 'Returns TRUE if any of the arguments are TRUE, otherwise returns FALSE.',
    IFERROR: 'Returns value if no error found else it will return specified value.',
    CHOOSE: 'Returns a value from list of values, based on index number.',
    INDEX: 'Returns a value of the cell in a given range based on row and column number.',
    FIND: 'Returns the position of a string within another string, which is case sensitive',
    CONCATENATE: 'Combines two or more strings together.',
    CONCAT: 'Concatenates a list or a range of text strings.',
    SUBTOTAL: 'Returns subtotal for a range using the given function number.',
    RADIANS: 'Converts degrees into radians.',
    MATCH: 'Returns the relative position of a specified value in given range.',
    DefineNameExists: 'This name already exists, try different name.',
    CircularReference: 'When a formula refers to one or more circular references, this may result in an incorrect calculation.'
};

/**
 * Export Spreadsheet viewer modules
 */

/**
 * Sheet module is used to render Sheet
 * @hidden
 */
var SheetRender = /** @__PURE__ @class */ (function () {
    function SheetRender(parent) {
        this.freezePane = false;
        this.colGroupWidth = 30; //Row header and selectall table colgroup width
        this.parent = parent;
        this.col = parent.createElement('col');
        this.rowRenderer = parent.serviceLocator.getService('row');
        this.cellRenderer = parent.serviceLocator.getService('cell');
    }
    SheetRender.prototype.refreshSelectALLContent = function () {
        var cell;
        if (this.freezePane) {
            var tHead = this.getSelectAllTable().querySelector('thead');
            var row = this.rowRenderer.render();
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        }
        else {
            cell = this.headerPanel.firstElementChild;
            cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: this.parent.element.id + "_select_all" }));
    };
    SheetRender.prototype.updateLeftColGroup = function (width, rowHdr) {
        if (width) {
            this.colGroupWidth = width;
        }
        if (!rowHdr) {
            rowHdr = this.getRowHeaderPanel();
        }
        var table = rowHdr.querySelector('table');
        this.detachColGroup(table);
        var colGrp = this.parent.createElement('colgroup');
        var colGrpWidth = this.colGroupWidth + "px";
        var col = this.col.cloneNode();
        col.style.width = colGrpWidth;
        colGrp.appendChild(col);
        table.insertBefore(colGrp, table.querySelector('tbody'));
        rowHdr.style.width = colGrpWidth;
        if (this.freezePane) {
            table = this.getSelectAllTable();
            this.detachColGroup(table);
            table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
        }
        else {
            this.getSelectAllContent().style.width = colGrpWidth;
        }
        if (this.parent.getActiveSheet().showHeaders) {
            this.getColHeaderPanel().style.width = "calc(100% - " + colGrpWidth + ")";
            this.getContentPanel().style.width = "calc(100% - " + colGrpWidth + ")";
        }
    };
    SheetRender.prototype.detachColGroup = function (table) {
        var colGrp = table.querySelector('colgroup');
        if (colGrp) {
            detach(colGrp);
        }
    };
    SheetRender.prototype.renderPanel = function () {
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel' });
        var sheet = this.parent.getActiveSheet();
        var id = this.parent.element.id;
        if (sheet.showHeaders) {
            this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: id + "_row_header" }));
            this.initHeaderPanel();
            this.parent.scrollModule.setPadding();
        }
        else {
            this.updateHideHeaders();
        }
        var content = this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-main-content', id: id + "_main_content" }));
        if (!sheet.showGridLines) {
            content.classList.add('e-hide-gridlines');
        }
        if (!this.parent.allowScrolling) {
            content.style.overflow = 'hidden';
        }
    };
    SheetRender.prototype.initHeaderPanel = function () {
        var id = this.parent.element.id;
        this.headerPanel = this.parent.createElement('div', { className: 'e-header-panel' });
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-selectall-container', id: id + "_selectall" }));
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-column-header', id: id + "_col_header" }));
    };
    SheetRender.prototype.createTable = function () {
        if (this.parent.getActiveSheet().showHeaders) {
            this.createHeaderTable();
        }
        this.updateTable('tbody', 'content', this.contentPanel.lastElementChild);
    };
    SheetRender.prototype.createHeaderTable = function (rowHdrEle) {
        if (rowHdrEle === void 0) { rowHdrEle = this.contentPanel.querySelector('.e-row-header'); }
        if (this.freezePane) {
            this.updateTable('thead', 'selectall', this.headerPanel.querySelector('.e-selectall-container'));
        }
        this.updateTable('thead', 'colhdr', this.headerPanel.querySelector('.e-column-header'));
        this.updateTable('tbody', 'rowhdr', rowHdrEle);
        this.updateLeftColGroup(null, rowHdrEle);
    };
    SheetRender.prototype.updateTable = function (tagName, name, appendTo) {
        var table = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add("e-" + name + "-table");
        appendTo.appendChild(table);
        table.appendChild(this.parent.createElement(tagName));
    };
    /**
     * It is used to refresh the select all, row header, column header and content table contents.
     */
    SheetRender.prototype.renderTable = function (cells, rowIdx, colIdx, lastIdx, top, left) {
        var _this = this;
        var indexes;
        var row;
        var sheet = this.parent.getActiveSheet();
        var frag = document.createDocumentFragment();
        this.createTable();
        var colGrp = this.parent.createElement('colgroup');
        var cTBody = this.contentPanel.querySelector('.e-main-content tbody');
        var rHdrTBody;
        var cHdrTHead;
        var cHdrRow;
        if (sheet.showHeaders) {
            frag.appendChild(this.headerPanel);
            this.refreshSelectALLContent();
            rHdrTBody = this.contentPanel.querySelector('.e-row-header tbody');
            cHdrTHead = this.headerPanel.querySelector('.e-column-header thead');
            this.getColHeaderTable().insertBefore(colGrp, cHdrTHead);
            cHdrRow = this.rowRenderer.render();
            cHdrTHead.appendChild(cHdrRow);
        }
        frag.appendChild(this.contentPanel);
        this.parent.notify(beforeContentLoaded, { startColIdx: colIdx });
        var colCount = sheet.colCount.toString();
        var rowCount = sheet.colCount.toString();
        if (sheet.showHeaders) {
            this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
            this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount);
        }
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIdx) {
                _this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) {
                    cHdrRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
            if (indexes[1] === colIdx) {
                if (sheet.showHeaders) {
                    row = _this.rowRenderer.render(indexes[0], true);
                    rHdrTBody.appendChild(row);
                    row.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                }
                row = _this.rowRenderer.render(indexes[0]);
                cTBody.appendChild(row);
            }
            row.appendChild(_this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: true }));
        });
        this.getContentTable().insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf(function () {
            var content = _this.parent.getMainContent();
            document.getElementById(_this.parent.element.id + '_sheet').appendChild(frag);
            if (top) {
                content.scrollTop = top;
                if (sheet.showHeaders) {
                    _this.parent.getRowHeaderContent().scrollTop = top;
                }
            }
            if (left) {
                content.scrollLeft = left;
                if (sheet.showHeaders) {
                    _this.parent.getColumnHeaderContent().scrollLeft = left;
                }
            }
            _this.parent.notify(contentLoaded, null);
            _this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
            _this.parent.trigger(dataBound, {});
        });
    };
    SheetRender.prototype.refreshColumnContent = function (cells, rowIndex, colIndex, lastIdx) {
        var _this = this;
        var indexes;
        var row;
        var table;
        var count = 0;
        var sheet = this.parent.getActiveSheet();
        var frag = document.createDocumentFragment();
        var hFrag = document.createDocumentFragment();
        var tBody = this.parent.element.querySelector('.e-main-content tbody');
        tBody = frag.appendChild(tBody.cloneNode(true));
        var colGrp = this.parent.element.querySelector('.e-main-content colgroup');
        colGrp = colGrp.cloneNode();
        var hRow;
        var tHead;
        if (sheet.showHeaders) {
            hFrag.appendChild(colGrp);
            tHead = this.parent.element.querySelector('.e-column-header thead');
            tHead = hFrag.appendChild(tHead.cloneNode(true));
            hRow = tHead.querySelector('tr');
            hRow.innerHTML = '';
        }
        cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIndex) {
                _this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) {
                    hRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
            if (indexes[1] === colIndex) {
                row = tBody.children[count];
                if (row) {
                    count++;
                    row.innerHTML = '';
                }
                else {
                    return;
                }
            }
            row.appendChild(_this.cellRenderer.render({
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key
            }));
        });
        frag.insertBefore(colGrp.cloneNode(true), tBody);
        getUpdateUsingRaf(function () {
            if (sheet.showHeaders) {
                table = _this.getColHeaderTable();
                removeAllChildren(table);
                table.appendChild(hFrag);
            }
            table = _this.getContentTable();
            removeAllChildren(table);
            table.appendChild(frag);
            _this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    SheetRender.prototype.refreshRowContent = function (cells, startIndex, lastIdx) {
        var _this = this;
        var indexes;
        var row;
        var hRow;
        var colGroupWidth = this.colGroupWidth;
        var sheet = this.parent.getActiveSheet();
        var hFrag;
        var hTBody;
        var frag = document.createDocumentFragment();
        var tBody = this.parent.createElement('tbody');
        if (sheet.showHeaders) {
            hFrag = document.createDocumentFragment();
            hTBody = tBody.cloneNode();
            hFrag.appendChild(hTBody);
        }
        frag.appendChild(tBody);
        cells.forEach(function (value, key) {
            indexes = getRangeIndexes(key);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = _this.rowRenderer.render(indexes[0], true);
                    hTBody.appendChild(hRow);
                    hRow.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
                row = _this.rowRenderer.render(indexes[0]);
                tBody.appendChild(row);
            }
            row.appendChild(_this.cellRenderer.render({ rowIdx: indexes[0], colIdx: indexes[1], cell: value, address: key,
                lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: true }));
        });
        getUpdateUsingRaf(function () {
            if (_this.parent.isDestroyed) {
                return;
            }
            if (_this.colGroupWidth !== colGroupWidth) {
                _this.updateLeftColGroup(colGroupWidth);
            }
            if (sheet.showHeaders) {
                detach(_this.contentPanel.querySelector('.e-row-header tbody'));
                _this.getRowHeaderTable().appendChild(hFrag);
            }
            detach(_this.contentPanel.querySelector('.e-main-content tbody'));
            _this.getContentTable().appendChild(frag);
            _this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    SheetRender.prototype.updateCol = function (idx, appendTo, sheet) {
        var col = this.col.cloneNode();
        col.style.width = formatUnit(getColumnWidth(sheet, idx));
        appendTo.appendChild(col);
    };
    SheetRender.prototype.updateColContent = function (cells, rowIdx, colIdx, lastIdx, direction) {
        var _this = this;
        getUpdateUsingRaf(function () {
            var indexes;
            var row;
            var table;
            var refChild;
            var cell;
            var hRow;
            var rowCount = 0;
            var col;
            var hRefChild;
            var sheet = _this.parent.getActiveSheet();
            if (sheet.showHeaders) {
                hRow = _this.parent.element.querySelector('.e-column-header .e-header-row');
                hRefChild = hRow.firstElementChild;
            }
            var colGrp = _this.parent.element.querySelector('.e-main-content colgroup');
            var colRefChild = colGrp.firstElementChild;
            var tBody = _this.parent.element.querySelector('.e-main-content tbody');
            cells.forEach(function (value, key) {
                indexes = getRangeIndexes(key);
                if (indexes[0] === rowIdx) {
                    if (direction === 'first') {
                        _this.updateCol(indexes[1], colGrp, sheet);
                        if (sheet.showHeaders) {
                            hRow.appendChild(_this.cellRenderer.renderColHeader(indexes[1]));
                        }
                    }
                    else {
                        col = _this.col.cloneNode();
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1]));
                        colGrp.insertBefore(col, colRefChild);
                        if (sheet.showHeaders) {
                            hRow.insertBefore(_this.cellRenderer.renderColHeader(indexes[1]), hRefChild);
                        }
                    }
                    if (_this.parent.scrollSettings.enableVirtualization) {
                        // tslint:disable
                        detach(colGrp[direction + 'ElementChild']);
                        if (sheet.showHeaders) {
                            detach(hRow[direction + 'ElementChild']);
                        }
                        // tslint:enable
                    }
                }
                if (indexes[1] === colIdx) {
                    row = tBody.children[rowCount];
                    rowCount++;
                    refChild = row.firstElementChild;
                }
                cell = _this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: direction === 'first' });
                if (direction === 'first') {
                    row.appendChild(cell);
                }
                else {
                    row.insertBefore(cell, refChild);
                }
                if (_this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach(row[direction + 'ElementChild']);
                }
            });
            if (sheet.showHeaders) {
                table = _this.getColHeaderTable();
                detach(table.querySelector('colgroup'));
                table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
            }
            if (_this.parent.scrollSettings.enableVirtualization) {
                _this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            }
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    SheetRender.prototype.updateRowContent = function (cells, startIndex, lastIdx, direction) {
        var _this = this;
        var colGroupWidth = this.colGroupWidth;
        var row;
        var hRow;
        var sheet = this.parent.getActiveSheet();
        var tBody = this.parent.getMainContent().querySelector('tbody');
        var rTBody;
        var rFrag;
        if (sheet.showHeaders) {
            rFrag = document.createDocumentFragment();
            rTBody = this.parent.getRowHeaderContent().querySelector('tbody');
        }
        var indexes;
        var frag = document.createDocumentFragment();
        this.parent.showSpinner();
        cells.forEach(function (value, cKey) {
            indexes = getRangeIndexes(cKey);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = _this.rowRenderer.render(indexes[0], true);
                    rFrag.appendChild(hRow);
                    hRow.appendChild(_this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (_this.parent.scrollSettings.enableVirtualization) {
                        // tslint:disable-next-line:no-any
                        detach(rTBody[direction + 'ElementChild']);
                    }
                }
                row = _this.rowRenderer.render(indexes[0]);
                frag.appendChild(row);
                if (_this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach(tBody[direction + 'ElementChild']);
                }
            }
            row.appendChild(_this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: cKey, lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: direction === 'first' }));
        });
        getUpdateUsingRaf(function () {
            if (_this.colGroupWidth !== colGroupWidth) {
                _this.updateLeftColGroup(colGroupWidth);
            }
            if (direction === 'first') {
                if (sheet.showHeaders) {
                    rTBody.appendChild(rFrag);
                }
                tBody.appendChild(frag);
            }
            else {
                if (sheet.showHeaders) {
                    rTBody.insertBefore(rFrag, rTBody.firstElementChild);
                }
                tBody.insertBefore(frag, tBody.firstElementChild);
            }
            if (_this.parent.scrollSettings.enableVirtualization) {
                _this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            }
            if (!_this.parent.isOpen) {
                _this.parent.hideSpinner();
            }
            setAriaOptions(_this.parent.getMainContent(), { busy: false });
        });
    };
    /**
     * Used to toggle row and column headers.
     */
    SheetRender.prototype.showHideHeaders = function () {
        var _this = this;
        var sheet = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (this.parent.scrollSettings.enableVirtualization) {
                var startIndex = [this.parent.viewport.topIndex, this.parent.viewport.leftIndex];
                this.renderHeaders([startIndex[0], startIndex[0] + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2)], [startIndex[1], startIndex[1] + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2)]);
            }
            else {
                this.renderHeaders([0, sheet.rowCount - 1], [0, sheet.colCount - 1]);
                if (sheet.topLeftCell !== 'A1') {
                    this.parent.goTo(sheet.topLeftCell);
                }
            }
        }
        else {
            getUpdateUsingRaf(function () {
                detach(_this.headerPanel);
                detach(_this.getRowHeaderPanel());
                _this.getContentPanel().style.width = '';
                _this.updateHideHeaders();
            });
        }
    };
    SheetRender.prototype.renderHeaders = function (rowIndexes, colIndexes) {
        var _this = this;
        this.initHeaderPanel();
        var cFrag = document.createDocumentFragment();
        var rFrag = document.createDocumentFragment();
        cFrag.appendChild(this.headerPanel);
        var rowHdrEle = rFrag.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: this.parent.element.id + "_row_header" }));
        this.createHeaderTable(rowHdrEle);
        this.parent.notify(beforeHeaderLoaded, { element: rowHdrEle });
        this.refreshSelectALLContent();
        var rTBody = rowHdrEle.querySelector('tbody');
        var cTHead = this.headerPanel.querySelector('.e-column-header thead');
        var cRow = this.rowRenderer.render();
        cTHead.appendChild(cRow);
        var row;
        for (var i = colIndexes[0]; i <= colIndexes[1]; i++) {
            cRow.appendChild(this.cellRenderer.renderColHeader(i));
        }
        var colGroupWidth = getColGroupWidth(rowIndexes[1]);
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth, rowHdrEle);
        }
        for (var i = rowIndexes[0]; i <= rowIndexes[1]; i++) {
            row = this.rowRenderer.render(i, true);
            row.appendChild(this.cellRenderer.renderRowHeader(i));
            rTBody.appendChild(row);
        }
        getUpdateUsingRaf(function () {
            _this.getColHeaderTable().insertBefore(_this.getContentTable().querySelector('colgroup').cloneNode(true), cTHead);
            var sheet = document.getElementById(_this.parent.element.id + '_sheet');
            sheet.classList.remove('e-hide-headers');
            sheet.insertBefore(cFrag, _this.contentPanel);
            var content = _this.getContentPanel();
            _this.contentPanel.insertBefore(rFrag, content);
            _this.parent.scrollModule.setPadding();
            rowHdrEle.scrollTop = content.scrollTop;
            _this.getColHeaderPanel().scrollLeft = content.scrollLeft;
        });
    };
    SheetRender.prototype.updateHideHeaders = function () {
        document.getElementById(this.parent.element.id + '_sheet').classList.add('e-hide-headers');
        this.headerPanel = null;
    };
    /**
     * Get the select all table element of spreadsheet
     * @return {HTMLElement}
     */
    SheetRender.prototype.getSelectAllContent = function () {
        return this.headerPanel.getElementsByClassName('e-selectall-container')[0];
    };
    /**
     * Get the select all table element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getSelectAllTable = function () {
        return this.headerPanel.getElementsByClassName('e-selectall-table')[0];
    };
    /**
     * Get the column header element of spreadsheet
     * @return {HTMLTableElement}
     */
    SheetRender.prototype.getColHeaderTable = function () {
        return this.headerPanel.getElementsByClassName('e-colhdr-table')[0];
    };
    /**
     * Get the row header table element of spreadsheet
     * @return {HTMLTableElement}
     */
    SheetRender.prototype.getRowHeaderTable = function () {
        return this.contentPanel.getElementsByClassName('e-rowhdr-table')[0];
    };
    /**
     * Get the main content table element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getContentTable = function () {
        return this.contentPanel.getElementsByClassName('e-content-table')[0];
    };
    /**
     * Get the row header div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getRowHeaderPanel = function () {
        return this.contentPanel.getElementsByClassName('e-row-header')[0];
    };
    /**
     * Get the column header div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getColHeaderPanel = function () {
        return this.headerPanel.getElementsByClassName('e-column-header')[0];
    };
    /**
     * Get the main content div element of spreadsheet
     * @return {Element}
     */
    SheetRender.prototype.getContentPanel = function () {
        return this.contentPanel.getElementsByClassName('e-main-content')[0];
    };
    return SheetRender;
}());

/**
 * Sheet module is used for creating row element
 * @hidden
 */
var RowRenderer = /** @__PURE__ @class */ (function () {
    function RowRenderer(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { 'role': 'row' } });
    }
    RowRenderer.prototype.render = function (index, isRowHeader) {
        var row = this.element.cloneNode();
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        var sheet = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        row.style.height = getRowHeight(sheet, index) + "px";
        return row;
    };
    return RowRenderer;
}());

/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
var CellRenderer = /** @__PURE__ @class */ (function () {
    function CellRenderer(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('td');
        this.th = this.parent.createElement('th', { className: 'e-header-cell' });
    }
    CellRenderer.prototype.renderColHeader = function (index) {
        var headerCell = this.th.cloneNode();
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        return headerCell;
    };
    CellRenderer.prototype.renderRowHeader = function (index) {
        var headerCell = this.element.cloneNode();
        addClass([headerCell], 'e-header-cell');
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    };
    CellRenderer.prototype.render = function (args) {
        var td = this.element.cloneNode();
        td.className = 'e-cell';
        attributes(td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        var eventArgs = { cell: args.cell, element: td, address: args.address };
        this.parent.trigger('beforeCellRender', eventArgs);
        this.updateCell(args.rowIdx, args.colIdx, td, args.cell, eventArgs, args.lastCell, args.row, args.hRow, args.isHeightCheckNeeded);
        return eventArgs.element;
    };
    CellRenderer.prototype.updateCell = function (rowIdx, colIdx, td, cell, eventArgs, lastCell, row, hRow, isHeightCheckNeeded, isRefresh) {
        if (!eventArgs) {
            eventArgs = { cell: cell, element: td };
        }
        if (cell && cell.formula && !cell.value) {
            var isFormula = checkIsFormula(cell.formula);
            var eventArgs_1 = {
                action: 'refreshCalculate',
                value: cell.formula,
                rowIndex: rowIdx,
                colIndex: colIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs_1);
        }
        var formatArgs = {
            type: cell && getTypeFromFormat(cell.format),
            value: cell && cell.value, format: cell && cell.format ? cell.format : 'General',
            formattedText: cell && cell.value, onLoad: true, isRightAlign: false, cell: cell
        };
        if (cell) {
            this.parent.notify(getFormattedCellObject, formatArgs);
        }
        td.textContent = eventArgs.cell ? formatArgs.formattedText : '';
        this.parent.refreshNode(td, {
            type: formatArgs.type,
            result: formatArgs.formattedText,
            curSymbol: getNumberDependable(this.parent.locale, 'USD'),
            isRightAlign: formatArgs.isRightAlign,
            value: formatArgs.value || ''
        });
        var style = {};
        if (eventArgs.cell && eventArgs.cell.style) {
            if (eventArgs.cell.style.properties) {
                style = skipDefaultValue(eventArgs.cell.style, true);
            }
            else {
                style = eventArgs.cell.style;
            }
        }
        if (Object.keys(style).length || Object.keys(this.parent.commonCellStyle).length || lastCell) {
            if (isRefresh) {
                this.removeStyle(eventArgs.element);
                this.parent.notify(setCellFormat, { style: style, range: getCellAddress(rowIdx, colIdx) });
            }
            else {
                this.parent.notify(applyCellFormat, {
                    style: extend({}, this.parent.commonCellStyle, style), rowIdx: rowIdx, colIdx: colIdx, cell: eventArgs.element,
                    lastCell: lastCell, row: row, hRow: hRow, isHeightCheckNeeded: isHeightCheckNeeded, manualUpdate: false
                });
            }
        }
        else {
            if (isRefresh) {
                this.removeStyle(eventArgs.element);
            }
        }
    };
    CellRenderer.prototype.removeStyle = function (element) {
        if (element.style.length) {
            element.removeAttribute('style');
        }
    };
    /** @hidden */
    CellRenderer.prototype.refreshRange = function (range) {
        var sheet = this.parent.getActiveSheet();
        var cRange = range.slice();
        if (inView(this.parent, cRange, true)) {
            for (var i = cRange[0]; i <= cRange[2]; i++) {
                for (var j = cRange[1]; j <= cRange[3]; j++) {
                    this.updateCell(i, j, this.parent.getCell(i, j), getCell(i, j, sheet), null, false, null, null, true, true);
                }
            }
        }
    };
    return CellRenderer;
}());

/**
 * Export Spreadsheet viewer
 */

/**
 * Render module is used to render the spreadsheet
 * @hidden
 */
var Render = /** @__PURE__ @class */ (function () {
    function Render(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    Render.prototype.render = function () {
        if (!this.parent.isMobileView()) {
            this.parent.notify(ribbon, null);
            this.parent.notify(formulaBar, null);
        }
        var sheetPanel = this.parent.createElement('div', {
            id: this.parent.element.id + '_sheet_panel', className: 'e-sheet-panel'
        });
        if (this.parent.enableRtl) {
            sheetPanel.classList.add('e-rtl');
        }
        this.parent.element.appendChild(sheetPanel);
        this.parent.notify(sheetTabs, null);
        if (this.parent.isMobileView()) {
            this.parent.notify(formulaBar, null);
            this.parent.notify(ribbon, null);
        }
        this.setSheetPanelSize();
        this.renderSheet(sheetPanel);
        this.checkTopLeftCell();
    };
    Render.prototype.checkTopLeftCell = function () {
        var sheet = this.parent.getActiveSheet();
        if (!this.parent.scrollSettings.enableVirtualization || sheet.topLeftCell === 'A1') {
            this.refreshUI();
        }
        else {
            var indexes = getCellIndexes(sheet.topLeftCell);
            var top_1 = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
            var left = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
            this.parent.notify(onContentScroll, { scrollLeft: left, scrollTop: top_1, preventScroll: true });
            var threshold = this.parent.getThreshold('row');
            var rowIndex = indexes[0] > threshold ? indexes[0] - threshold : 0;
            threshold = this.parent.getThreshold('col');
            var colIndex = indexes[1] > threshold ? indexes[1] - threshold : 0;
            this.refreshUI({ rowIndex: rowIndex, colIndex: colIndex, refresh: 'All', top: top_1, left: left });
        }
    };
    Render.prototype.renderSheet = function (panel) {
        if (panel === void 0) { panel = document.getElementById(this.parent.element.id + '_sheet_panel'); }
        panel.appendChild(this.parent.createElement('div', { className: 'e-sheet', id: this.parent.element.id + '_sheet' }));
        this.parent.serviceLocator.getService('sheet').renderPanel();
    };
    Render.prototype.refreshUI = function (args, address) {
        if (args === void 0) { args = { rowIndex: 0, colIndex: 0, refresh: 'All' }; }
        var sheetModule = this.parent.serviceLocator.getService('sheet');
        var sheet = this.parent.getActiveSheet();
        var sheetName = getSheetName(this.parent);
        this.parent.showSpinner();
        if (!address) {
            address = this.parent.scrollSettings.enableVirtualization ? this.getAddress(args.rowIndex, args.colIndex) :
                "A1:" + getCellAddress(sheet.rowCount - 1, sheet.colCount - 1);
        }
        if (args.refresh === 'All') {
            this.parent.trigger(beforeDataBound, {});
        }
        setAriaOptions(this.parent.getMainContent(), { busy: true });
        this.parent.getData(sheetName + "!" + address).then(function (values) {
            var lastCellIdx = getCellIndexes(address.split(':')[1])[1];
            switch (args.refresh) {
                case 'All':
                    sheetModule.renderTable(values, args.rowIndex, args.colIndex, lastCellIdx, args.top, args.left);
                    break;
                case 'Row':
                    sheetModule.refreshRowContent(values, args.colIndex, lastCellIdx);
                    break;
                case 'Column':
                    sheetModule.refreshColumnContent(values, args.rowIndex, args.colIndex, lastCellIdx);
                    break;
                case 'RowPart':
                    sheetModule.updateRowContent(values, args.colIndex, lastCellIdx, args.direction);
                    break;
                case 'ColumnPart':
                    sheetModule.updateColContent(values, args.rowIndex, args.colIndex, lastCellIdx, args.direction);
                    break;
            }
        });
        this.parent.notify(beforeVirtualContentLoaded, { refresh: args.refresh });
    };
    Render.prototype.removeSheet = function () {
        remove(document.getElementById(this.parent.element.id + '_sheet'));
    };
    /**
     * Refresh the active sheet
     */
    Render.prototype.refreshSheet = function () {
        this.removeSheet();
        this.renderSheet();
        this.parent.notify(deInitProperties, {});
        this.checkTopLeftCell();
    };
    Render.prototype.getAddress = function (rowIndex, colIndex) {
        var sheet = this.parent.getActiveSheet();
        var lastRowIdx = rowIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2);
        var count = sheet.rowCount - 1;
        if (this.parent.scrollSettings.isFinite && lastRowIdx > count) {
            lastRowIdx = count;
        }
        var lastColIdx = colIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
        count = sheet.colCount - 1;
        if (this.parent.scrollSettings.isFinite && lastColIdx > count) {
            lastColIdx = count;
        }
        return getCellAddress(rowIndex, colIndex) + ":" + getCellAddress(lastRowIdx, lastColIdx);
    };
    /**
     * Used to set sheet panel size.
     */
    Render.prototype.setSheetPanelSize = function () {
        var panel = document.getElementById(this.parent.element.id + '_sheet_panel');
        var offset = this.parent.element.getBoundingClientRect();
        var height;
        if (this.parent.height === 'auto') {
            panel.style.height = '260px';
            height = 230;
        }
        else {
            height = offset.height - getSiblingsHeight(panel);
            panel.style.height = height + "px";
            height -= 30;
        }
        this.parent.viewport.height = height;
        this.parent.viewport.width = offset.width;
        this.parent.viewport.rowCount = this.roundValue(height, 20);
        this.parent.viewport.colCount = this.roundValue(offset.width, 64);
    };
    Render.prototype.roundValue = function (size, threshold) {
        var value = size / threshold;
        var roundedValue = Math.round(value);
        return Math.abs(value - roundedValue) < 0.5 ? roundedValue : roundedValue - 1;
    };
    /**
     * Registing the renderer related services.
     */
    Render.prototype.instantiateRenderer = function () {
        this.parent.serviceLocator.register('row', new RowRenderer(this.parent));
        this.parent.serviceLocator.register('cell', new CellRenderer(this.parent));
        this.parent.serviceLocator.register('sheet', new SheetRender(this.parent));
    };
    /**
     * Destroy the Render module.
     * @return {void}
     */
    Render.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    Render.prototype.addEventListener = function () {
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(dataRefresh, this.refreshSheet, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    };
    Render.prototype.removeEventListener = function () {
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(dataRefresh, this.refreshSheet);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    };
    return Render;
}());

/**
 * ServiceLocator
 * @hidden
 */
var ServiceLocator = /** @__PURE__ @class */ (function () {
    function ServiceLocator() {
        this.services = {};
    }
    ServiceLocator.prototype.getService = function (name) {
        if (isNullOrUndefined(this.services[name])) {
            throw "The service " + name + " is not registered";
        }
        return this.services[name];
    };
    ServiceLocator.prototype.register = function (name, type) {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    };
    return ServiceLocator;
}());

/**
 * Dialog Service.
 * @hidden
 */
var Dialog$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for initializing dialog service.
     */
    function Dialog$$1(parent) {
        this.parent = parent;
    }
    /**
     * To show dialog.
     */
    Dialog$$1.prototype.show = function (dialogModel) {
        var _this = this;
        var btnContent;
        var closeHandler = dialogModel.close || null;
        var model = {
            header: 'Spreadsheet',
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            buttons: []
        };
        dialogModel.close = function () {
            _this.dialogInstance.destroy();
            remove(_this.dialogInstance.element);
            _this.dialogInstance = null;
            if (closeHandler) {
                closeHandler();
            }
        };
        extend(model, dialogModel);
        btnContent = this.parent.serviceLocator.getService(locale).getConstant(model.buttons.length ? 'Cancel' : 'Ok');
        model.buttons.push({
            buttonModel: { content: btnContent, isPrimary: model.buttons.length === 0 },
            click: this.hide.bind(this),
        });
        var div = this.parent.createElement('div');
        document.body.appendChild(div);
        this.dialogInstance = new Dialog(model);
        this.dialogInstance.createElement = this.parent.createElement;
        this.dialogInstance.appendTo(div);
    };
    /**
     * To hide dialog.
     */
    Dialog$$1.prototype.hide = function () {
        this.dialogInstance.hide();
    };
    /**
     * To clear private variables.
     */
    Dialog$$1.prototype.destroy = function () {
        this.parent = null;
    };
    return Dialog$$1;
}());

/**
 * Export Spreadsheet Services
 */

var __extends$10 = (undefined && undefined.__extends) || (function () {
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
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../../workbook/base/workbook-model.d.ts'/>
/**
 * Represents the Spreadsheet component.
 * ```html
 * <div id='spreadsheet'></div>
 * <script>
 *  var spreadsheetObj = new Spreadsheet();
 *  spreadsheetObj.appendTo('#spreadsheet');
 * </script>
 * ```
 */
var Spreadsheet = /** @__PURE__ @class */ (function (_super) {
    __extends$10(Spreadsheet, _super);
    /**
     * Constructor for creating the widget.
     * @param  {SpreadsheetModel} options? - Configures Spreadsheet options.
     * @param  {string|HTMLElement} element? - Element to render Spreadsheet.
     */
    function Spreadsheet(options, element) {
        var _this = _super.call(this, options) || this;
        /** @hidden */
        _this.isOpen = false;
        /** @hidden */
        _this.isEdit = false;
        /** @hidden */
        _this.viewport = { rowCount: 0, colCount: 0, height: 0, topIndex: 0, leftIndex: 0, width: 0 };
        _this.needsID = true;
        Spreadsheet_1.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, ContextMenu$1, Save, NumberFormat, CellFormat, Formula, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookNumberFormat, WorkbookFormula, Sort, WorkbookSort, Resize);
        if (element) {
            _this.appendTo(element);
        }
        return _this;
    }
    Spreadsheet_1 = Spreadsheet;
    /**
     * To get cell element.
     * @returns HTMLElement
     * @hidden
     */
    Spreadsheet.prototype.getCell = function (rowIndex, colIndex) {
        if (this.scrollSettings.enableVirtualization) {
            colIndex = colIndex - this.viewport.leftIndex;
        }
        var row = this.getRow(rowIndex);
        return row ? row.cells[colIndex] : row;
    };
    /**
     * Get cell element.
     * @returns HTMLTableRowElement
     * @hidden
     */
    Spreadsheet.prototype.getRow = function (rowIndex, table) {
        if (this.scrollSettings.enableVirtualization) {
            rowIndex = rowIndex - this.viewport.topIndex;
        }
        table = table || this.getContentTable();
        return table ? table.rows[rowIndex] : null;
    };
    /**
     * To initialize the services;
     * @returns void
     * @hidden
     */
    Spreadsheet.prototype.preRender = function () {
        _super.prototype.preRender.call(this);
        this.serviceLocator = new ServiceLocator;
        this.initServices();
    };
    Spreadsheet.prototype.initServices = function () {
        this.serviceLocator.register(locale, new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register(dialog, new Dialog$1(this));
    };
    /**
     * To Initialize the component rendering.
     * @returns void
     * @hidden
     */
    Spreadsheet.prototype.render = function () {
        _super.prototype.render.call(this);
        this.element.setAttribute('tabindex', '0');
        setAriaOptions(this.element, { role: 'grid' });
        this.renderModule = new Render(this);
        this.notify(initialLoad, null);
        this.renderSpreadsheet();
        this.wireEvents();
    };
    Spreadsheet.prototype.renderSpreadsheet = function () {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        this.setHeight();
        this.setWidth();
        createSpinner({ target: this.element }, this.createElement);
        if (this.isMobileView() && this.cssClass.indexOf('e-mobile-view') === -1) {
            this.element.classList.add('e-mobile-view');
        }
        this.sheetModule = this.serviceLocator.getService('sheet');
        if (this.allowScrolling) {
            this.scrollModule = new Scroll(this);
        }
        if (this.scrollSettings.enableVirtualization) {
            new VirtualScroll(this);
        }
        this.renderModule.render();
    };
    /**
     * By default, Spreadsheet shows the spinner for all its actions. To manually show spinner you this method at your needed time.
     * @return {void}
     */
    Spreadsheet.prototype.showSpinner = function () {
        showSpinner(this.element);
    };
    /**
     * To hide showed spinner manually.
     * @return {void}
     */
    Spreadsheet.prototype.hideSpinner = function () {
        hideSpinner(this.element);
    };
    /**
     * Selection will navigates to the specified cell address in active sheet.
     * @param {string} address - Specifies the cell address which needs to navigate.
     */
    Spreadsheet.prototype.goTo = function (address) {
        var indexes = getRangeIndexes(address);
        var content = this.getMainContent();
        var sheet = this.getActiveSheet();
        content.scrollTop = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
        content.scrollLeft = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
    };
    /**
     * This method is used to resize the Spreadsheet component.
     */
    Spreadsheet.prototype.resize = function () {
        this.renderModule.setSheetPanelSize();
        if (this.scrollSettings.enableVirtualization) {
            this.renderModule.refreshSheet();
        }
    };
    /**
     * To cut the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address to cut.
     */
    Spreadsheet.prototype.cut = function (address) {
        this.notify(cut, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    };
    /**
     * To copy the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address.
     */
    Spreadsheet.prototype.copy = function (address) {
        this.notify(copy, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    };
    /**
     * This method is used to paste the cut or copied cells in to specified address.
     * @param {string} address - Specifies the cell or range address.
     * @param {PasteSpecialType} type - Specifies the type of paste.
     */
    Spreadsheet.prototype.paste = function (address, type) {
        this.notify(paste, {
            range: getIndexesFromAddress(address), sIdx: getSheetIndex(this, getSheetNameFromAddress(address)),
            type: type
        });
    };
    Spreadsheet.prototype.setHeight = function () {
        if (this.height.toString().indexOf('%') > -1) {
            this.element.style.minHeight = '400px';
        }
        this.element.style.height = formatUnit(this.height);
    };
    Spreadsheet.prototype.setWidth = function () {
        if (this.width.toString().indexOf('%') > -1 || this.width === 'auto') {
            this.element.style.minWidth = '300px';
        }
        this.element.style.width = formatUnit(this.width);
    };
    /** @hidden */
    Spreadsheet.prototype.setPanelSize = function () {
        if (this.height !== 'auto') {
            var panel = document.getElementById(this.element.id + '_sheet_panel');
            panel.style.height = this.element.getBoundingClientRect().height - getSiblingsHeight(panel) + "px";
        }
    };
    /**
     * Opens the Excel file.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    Spreadsheet.prototype.open = function (options) {
        this.isOpen = true;
        _super.prototype.open.call(this, options);
        if (this.isOpen) {
            this.showSpinner();
        }
    };
    /**
     * Gets the row header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    Spreadsheet.prototype.getRowHeaderContent = function () {
        return this.sheetModule.getRowHeaderPanel();
    };
    /**
     * Gets the column header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    Spreadsheet.prototype.getColumnHeaderContent = function () {
        return this.sheetModule.getColHeaderPanel();
    };
    /**
     * Gets the main content div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    Spreadsheet.prototype.getMainContent = function () {
        return this.sheetModule.getContentPanel();
    };
    /**
     * Get the main content table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    Spreadsheet.prototype.getContentTable = function () {
        return this.sheetModule.getContentTable();
    };
    /**
     * Get the row header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    Spreadsheet.prototype.getRowHeaderTable = function () {
        return this.sheetModule.getRowHeaderTable();
    };
    /**
     * Get the column header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    Spreadsheet.prototype.getColHeaderTable = function () {
        return this.sheetModule.getColHeaderTable();
    };
    /**
     * To get the backup element count for row and column virtualization.
     * @hidden
     */
    Spreadsheet.prototype.getThreshold = function (layout) {
        var threshold = Math.round((this.viewport[layout + 'Count'] + 1) / 2);
        return threshold < 15 ? 15 : threshold;
    };
    /** @hidden */
    Spreadsheet.prototype.isMobileView = function () {
        return ((this.cssClass.indexOf('e-mobile-view') > -1 || Browser.isDevice) && this.cssClass.indexOf('e-desktop-view') === -1)
            && false;
    };
    /** @hidden */
    Spreadsheet.prototype.getValueRowCol = function (sheetIndex, rowIndex, colIndex) {
        var val = _super.prototype.getValueRowCol.call(this, sheetIndex, rowIndex, colIndex);
        return val;
    };
    /**
     * Sorts the range of cells in the active sheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    Spreadsheet.prototype.sort = function (sortOptions, range) {
        if (!range) {
            range = this.getActiveSheet().selectedRange;
        }
        sortOptions = sortOptions || { sortDescriptors: {} };
        var args = { range: range, sortOptions: sortOptions, cancel: false };
        this.trigger(beforeSort, args);
        if (args.cancel) {
            return;
        }
        this.notify(beforeSort, args);
        _super.prototype.sort.call(this, args.sortOptions, range);
    };
    /** @hidden */
    Spreadsheet.prototype.setValueRowCol = function (sheetIndex, value, rowIndex, colIndex) {
        if (value === 'circular reference: ') {
            var circularArgs = {
                action: 'isCircularReference', argValue: value
            };
            this.notify(formulaOperation, circularArgs);
            value = circularArgs.argValue;
        }
        _super.prototype.setValueRowCol.call(this, sheetIndex, value, rowIndex, colIndex);
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(editOperation, {
            action: 'refreshDependentCellValue', rowIdx: rowIndex, colIdx: colIndex,
            sheetIdx: sheetIndex
        });
    };
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    Spreadsheet.prototype.getModuleName = function () {
        return 'spreadsheet';
    };
    /** @hidden */
    Spreadsheet.prototype.setRowHeight = function (sheetIndex, rowIndex, height) {
        var actRowIdx = getCellIndexes(this.getActiveSheet().activeCell)[0];
        var contentElem = this.element.querySelector('.e-main-content .e-table');
        var rowHdrElem = this.element.querySelector('.e-row-header .e-table');
        contentElem.rows[rowIndex].style.height = height + 'px';
        rowHdrElem.rows[rowIndex].style.height = height + 'px';
        setRowHeight(this.sheets[sheetIndex - 1], rowIndex, height);
        if (actRowIdx === rowIndex) {
            setStyleAttribute$1([{ element: this.element.getElementsByClassName('e-selection')[0], attrs: { 'height': height + 'px' } }]);
        }
        else {
            var cellPosition = getCellPosition(this.getActiveSheet(), [actRowIdx, 0, actRowIdx, 0]);
            setStyleAttribute$1([{
                    element: this.element.getElementsByClassName('e-selection')[0],
                    attrs: { 'top': cellPosition.top + 'px' }
                }]);
        }
    };
    /** @hidden */
    Spreadsheet.prototype.refreshNode = function (td, args) {
        var value;
        var spanElem = td.querySelector('.' + this.element.id + '_currency');
        var alignClass = 'e-right-align';
        if (args) {
            args.result = isNullOrUndefined(args.result) ? '' : args.result.toString();
            if (args.type === 'Accounting' && isNumber(args.value)) {
                td.innerHTML = '';
                td.appendChild(this.createElement('span', {
                    className: this.element.id + '_currency',
                    innerHTML: " " + args.curSymbol,
                    styles: 'float: left'
                }));
                td.innerHTML += args.result.split(args.curSymbol).join('');
                td.classList.add(alignClass);
                return;
            }
            else {
                if (spanElem) {
                    detach(spanElem);
                }
                if (args.result && (args.result.toLowerCase() === 'true' || args.result.toLowerCase() === 'false')) {
                    args.result = args.result.toUpperCase();
                    alignClass = 'e-center-align';
                    args.isRightAlign = true; // Re-use this to center align the cell.
                }
                value = args.result;
            }
            args.isRightAlign ? td.classList.add(alignClass) : td.classList.remove(alignClass);
        }
        value = !isNullOrUndefined(value) ? value : '';
        if (!isNullOrUndefined(td)) {
            var node = td.lastChild;
            if (node && (node.nodeType === 3 || (node.nodeType === 1))) {
                node.nodeValue = value;
            }
            else {
                td.appendChild(document.createTextNode(value));
            }
        }
    };
    Spreadsheet.prototype.mouseClickHandler = function (e) {
        this.notify(click, e);
    };
    Spreadsheet.prototype.mouseDownHandler = function (e) {
        this.notify(mouseDown, e);
    };
    Spreadsheet.prototype.keyUpHandler = function (e) {
        this.notify(keyUp, e);
    };
    Spreadsheet.prototype.keyDownHandler = function (e) {
        this.notify(keyDown, e);
    };
    /**
     * Binding events to the element while component creation.
     */
    Spreadsheet.prototype.wireEvents = function () {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, getStartEvent(), this.mouseDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'noderefresh', this.refreshNode, this);
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     */
    Spreadsheet.prototype.destroy = function () {
        this.unwireEvents();
        this.notify(spreadsheetDestroyed, null);
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('role');
        this.element.style.removeProperty('height');
        this.element.style.removeProperty('width');
    };
    /**
     * Unbinding events from the element while component destroy.
     */
    Spreadsheet.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, getStartEvent(), this.mouseDownHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'noderefresh', this.refreshNode);
    };
    /**
     * To add context menu items.
     * @param {MenuItemModel[]} items - Items that needs to be added.
     * @param {string} text - Item before / after that the element to be inserted.
     * @param {boolean} insertAfter - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    Spreadsheet.prototype.addContextMenuItems = function (items, text, insertAfter, isUniqueId) {
        if (insertAfter === void 0) { insertAfter = true; }
        this.notify(addContextMenuItems, { items: items, text: text, insertAfter: insertAfter, isUniqueId: isUniqueId });
    };
    /**
     * To remove existing context menu items.
     * @param {string[]} items - Items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    Spreadsheet.prototype.removeContextMenuItems = function (items, isUniqueId) {
        this.notify(removeContextMenuItems, { items: items, isUniqueId: isUniqueId });
    };
    /**
     * To enable / disable context menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    Spreadsheet.prototype.enableContextMenuItems = function (items, enable, isUniqueId) {
        if (enable === void 0) { enable = true; }
        this.notify(enableContextMenuItems, { items: items, enable: enable, isUniqueId: isUniqueId });
    };
    /**
     * Selects the cell / range of cells with specified address.
     * @param {string} address - Specifies the range address.
     */
    Spreadsheet.prototype.selectRange = function (address) {
        this.notify(selectRange, getRangeIndexes(address));
    };
    /**
     * Start edit the active cell.
     * @return {void}
     */
    Spreadsheet.prototype.startEdit = function () {
        this.notify(editOperation, { action: 'startEdit', isNewValueEdit: false });
    };
    /**
     * Cancels the edited state, this will not update any value in the cell.
     * @return {void}
     */
    Spreadsheet.prototype.closeEdit = function () {
        this.notify(editOperation, { action: 'cancelEdit' });
    };
    /**
     * If Spreadsheet is in editable state, you can save the cell by invoking endEdit.
     * @return {void}
     */
    Spreadsheet.prototype.endEdit = function () {
        this.notify(editOperation, { action: 'endEdit' });
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {SpreadsheetModel} newProp
     * @param  {SpreadsheetModel} oldProp
     * @returns void
     * @hidden
     */
    Spreadsheet.prototype.onPropertyChanged = function (newProp, oldProp) {
        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'enableRtl':
                    newProp.enableRtl ? document.getElementById(this.element.id + '_sheet_panel').classList.add('e-rtl') :
                        document.getElementById(this.element.id + '_sheet_panel').classList.remove('e-rtl');
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'activeSheetTab':
                    this.renderModule.refreshSheet();
                    this.notify(activeSheetChanged, { idx: newProp.activeSheetTab - 1 });
                    break;
                case 'width':
                    this.setWidth();
                    this.resize();
                    break;
                case 'height':
                    this.setHeight();
                    this.resize();
                    break;
                case 'showRibbon':
                    this.notify(ribbon, { uiUpdate: true });
                    break;
                case 'showFormulaBar':
                    this.notify(formulaBar, { uiUpdate: true });
                    break;
                case 'showSheetTabs':
                    this.notify(sheetTabs, null);
                    break;
                case 'cellStyle':
                    this.renderModule.refreshSheet();
                    break;
            }
        }
    };
    /**
     * To provide the array of modules needed for component rendering.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    Spreadsheet.prototype.requiredModules = function () {
        return getRequiredModules(this);
    };
    /**
     * Appends the control within the given HTML Div element.
     * @param {string | HTMLElement} selector - Target element where control needs to be appended.
     */
    Spreadsheet.prototype.appendTo = function (selector) {
        _super.prototype.appendTo.call(this, selector);
    };
    var Spreadsheet_1;
    __decorate$9([
        Property('')
    ], Spreadsheet.prototype, "cssClass", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "allowScrolling", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "allowResizing", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "enableClipboard", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "enableContextMenu", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "enableKeyboardNavigation", void 0);
    __decorate$9([
        Property(true)
    ], Spreadsheet.prototype, "enableKeyboardShortcut", void 0);
    __decorate$9([
        Complex({}, SelectionSettings)
    ], Spreadsheet.prototype, "selectionSettings", void 0);
    __decorate$9([
        Complex({}, ScrollSettings)
    ], Spreadsheet.prototype, "scrollSettings", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "beforeCellRender", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "beforeSelect", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "select", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "contextMenuBeforeOpen", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "fileMenuBeforeOpen", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "contextMenuBeforeClose", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "fileMenuBeforeClose", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "contextMenuItemSelect", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "fileItemSelect", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "beforeDataBound", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "dataBound", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "cellEdit", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "cellEditing", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "cellSave", void 0);
    __decorate$9([
        Event$1()
    ], Spreadsheet.prototype, "created", void 0);
    Spreadsheet = Spreadsheet_1 = __decorate$9([
        NotifyPropertyChanges
    ], Spreadsheet);
    return Spreadsheet;
}(Workbook));

/**
 * Export Spreadsheet viewer
 */

/**
 * Export Spreadsheet viewer modules
 */

/**
 * Export Spreadsheet modules
 */

export { Workbook, RangeSetting, UsedRange, Sheet, getSheetIndex, getSheetIndexFromId, getSheetNameFromAddress, updateSelectedRange, getSelectedRange, getSheet, getSheetNameCount, getMaxSheetId, initSheet, getSheetName, Row, getRow, setRow, getRowHeight, setRowHeight, getRowsHeight, Column, getColumn, getColumnWidth, getColumnsWidth, Cell, getCell, setCell, getCellPosition, skipDefaultValue, getData, getModel, processIdx, clearRange, getRangeIndexes, getCellIndexes, getCellAddress, getRangeAddress, getColumnHeaderText, getIndexesFromAddress, getRangeFromAddress, getSwapRange, isSingleCell, executeTaskAsync, WorkbookBasicModule, WorkbookAllModule, getWorkbookRequiredModules, CellStyle, DefineName, workbookDestroyed, workbookOpen, beginSave, saveCompleted, applyNumberFormatting, getFormattedCellObject, refreshCellElement, setCellFormat, textDecorationUpdate, applyCellFormat, updateUsedRange, workbookFormulaOperation, workbookEditOperation, checkDateFormat, getFormattedBarText, activeCellChanged, openSuccess, openFailure, sheetCreated, sheetsDestroyed, aggregateComputation, beforeSort, initiateSort, sortComplete, validateSortRange, checkIsFormula, toFraction, getGcd, intToDate, dateToInt, isDateTime, isNumber, toDate, DataBind, WorkbookOpen, WorkbookSave, WorkbookFormula, WorkbookNumberFormat, getFormatFromType, getTypeFromFormat, WorkbookSort, WorkbookCellFormat, WorkbookEdit, getRequiredModules, ribbon, formulaBar, sheetTabs, refreshSheetTabs, dataRefresh, initialLoad, contentLoaded, mouseDown, spreadsheetDestroyed, editOperation, formulaOperation, formulaBarOperation, click, keyUp, keyDown, formulaKeyUp, formulaBarUpdate, onVerticalScroll, onHorizontalScroll, beforeContentLoaded, beforeVirtualContentLoaded, virtualContentLoaded, contextMenuOpen, cellNavigate, mouseUpAfterSelection, selectionComplete, cMenuBeforeOpen, addSheetTab, removeSheetTab, renameSheetTab, ribbonClick, refreshRibbon, enableRibbonItems, tabSwitch, selectRange, cut, copy, paste, clearCopy, dataBound, beforeDataBound, addContextMenuItems, removeContextMenuItems, enableContextMenuItems, beforeRibbonCreate, rowHeightChanged, colWidthChanged, beforeHeaderLoaded, onContentScroll, deInitProperties, activeSheetChanged, renameSheet, enableToolbar, initiateCustomSort, getUpdateUsingRaf, removeAllChildren, getColGroupWidth, getScrollBarWidth, getSiblingsHeight, inView, locateElem, setStyleAttribute$1 as setStyleAttribute, getStartEvent, getMoveEvent, getEndEvent, isTouchStart, isTouchMove, isTouchEnd, getClientX, getClientY, setAriaOptions, destroyComponent, BasicModule, AllModule, ScrollSettings, SelectionSettings, DISABLED, locale, dialog, fontColor, fillColor, defaultLocale, Spreadsheet, Clipboard, Edit, Selection, Scroll, VirtualScroll, KeyboardNavigation, KeyboardShortcut, CellFormat, Resize, Ribbon$$1 as Ribbon, FormulaBar, Formula, SheetTabs, Open, Save, ContextMenu$1 as ContextMenu, NumberFormat, Sort, Render, SheetRender, RowRenderer, CellRenderer, Calculate, FormulaError, FormulaInfo, CalcSheetFamilyItem, getAlphalabel, ValueChangedArgs, Parser, CalculateCommon, isUndefined$1 as isUndefined, getModules, getValue$1 as getValue, setValue, ModuleLoader, CommonErrors, FormulasErrorsStrings, BasicFormulas };
//# sourceMappingURL=ej2-spreadsheet.es5.js.map
