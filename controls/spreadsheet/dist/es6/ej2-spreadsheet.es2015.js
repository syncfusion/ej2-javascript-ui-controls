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
    let cellindexes;
    let indexes = [];
    range = range.indexOf(':') === -1 ? range + ':' + range : range;
    range.split(':').forEach((address) => {
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
    let colIdx = 0;
    text = text.split('').reverse().join('');
    for (let i = text.length - 1; i >= 0; i--) {
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
    let alphabet = 'Z';
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
    let clonedRange = range.slice();
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
    let tmp = range[x];
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
class WorkerHelper {
    /**
     * Constructor for WorkerHelper module in Workbook library.
     * @private
     */
    constructor(context, task, defaultListener, taskData, preventCallback) {
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
    terminate() {
        this.worker.terminate();
        URL.revokeObjectURL(this.workerUrl);
    }
    /**
     * To initiate the worker.
     * @private
     */
    initWorker() {
        let taskBlob = new Blob([this.getFnCode()], { type: 'text/javascript' });
        this.workerUrl = URL.createObjectURL(taskBlob);
        this.worker = new Worker(this.workerUrl);
        this.worker.onmessage = this.messageFromWorker.bind(this);
        this.worker.onerror = this.onError.bind(this);
        this.worker.postMessage(this.workerData);
    }
    /**
     * Method for getting response from worker.
     * @private
     */
    messageFromWorker(args) {
        this.terminate();
        this.defaultListener.apply(this.context, [args.data]);
    }
    /**
     * Method for getting error message from worker if failed.
     * @private
     */
    onError(args) {
        this.terminate();
        throw args.message || args;
    }
    /**
     * Construct function code for worker.
     * @private
     */
    getFnCode() {
        let workerCode = '';
        let i;
        let keys;
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
    }
    /**
     * Get default worker task with callback.
     * @private
     */
    getCallbackMessageFn(args) {
        postMessage(this.workerTask(...args.data));
    }
    /**
     * Get default worker task without callback.
     * @private
     */
    getMessageFn(args) {
        this.workerTask(...args.data);
    }
}

/**
 * Specifies Workbook internal events.
 */
/** @hidden */
const workbookDestroyed = 'workbookDestroyed';
/** @hidden */
const workbookOpen = 'workbookOpen';
/** @hidden */
const beginSave = 'beginSave';
/** @hidden */
const saveCompleted = 'saveCompleted';
/** @hidden */
const applyNumberFormatting = 'applyNumber';
/** @hidden */
const getFormattedCellObject = 'getFormattedCell';
/** @hidden */
const refreshCellElement = 'refreshCellElem';
/** @hidden */
const setCellFormat = 'setCellFormat';
/** @hidden */
const textDecorationUpdate = 'textDecorationUpdate';
/** @hidden */
const applyCellFormat = 'applyCellFormat';
/** @hidden */
const updateUsedRange = 'updateUsedRange';
/** @hidden */
const workbookFormulaOperation = 'workbookFormulaOperation';
/** @hidden */
const workbookEditOperation = 'workbookEditOperation';
/** @hidden */
const checkDateFormat = 'checkDateFormat';
/** @hidden */
const getFormattedBarText = 'getFormattedBarText';
/** @hidden */
const activeCellChanged = 'activeCellChanged';
/** @hidden */
const openSuccess = 'openSuccess';
/** @hidden */
const openFailure = 'openFailure';
/** @hidden */
const sheetCreated = 'sheetCreated';
/** @hidden */
const sheetsDestroyed = 'sheetsDestroyed';
/** @hidden */
const aggregateComputation = 'aggregateComputation';
/** @hidden */
const beforeSort = 'beforeSort';
/** @hidden */
const initiateSort = 'initiateSort';
/** @hidden */
const sortComplete = 'sortComplete';
/** @hidden */
const validateSortRange = 'validateSortRange';

/**
 * @hidden
 */
function toFraction(val) {
    let strVal = val.toString();
    if (val === parseInt(strVal, 10)) {
        return parseInt(strVal, 10) + '  ';
    }
    else {
        let top = strVal.indexOf('.') > -1 ? strVal.split('.')[1] : 0;
        let bottom = Math.pow(10, top.toString().replace('-', '').length);
        let abs = Math.abs(getGcd(top, bottom));
        return (top / abs) + '/' + (bottom / abs);
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
    let startDate = new Date('01/01/1900');
    let date = isDateTime(val) ? val : new Date(val);
    let timeDiff = (date.getTime() - startDate.getTime());
    let diffDays = (timeDiff / (1000 * 3600 * 24)) + 1;
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
    let defaultDateFormats = getDefaultDateObject();
    let availabelDateTimeFormat = defaultDateFormats.dateTimeFormats.availableFormats;
    let dObj = { dateObj: null, isCustom: false, type: '' };
    if (typeof text === 'string') {
        text = text.toUpperCase();
    }
    for (let key of Object.keys(defaultDateFormats.dateFormats)) {
        dObj.dateObj = intl.parseDate(text, { format: defaultDateFormats.dateFormats[key], skeleton: key });
        if (dObj.dateObj) {
            dObj.type = 'date';
            dObj.isCustom = false;
            break;
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (let key of Object.keys(availabelDateTimeFormat)) {
            dObj.dateObj = intl.parseDate(text, { format: availabelDateTimeFormat[key], skeleton: key });
            if (dObj.dateObj) {
                dObj.type = text.toString().indexOf(':') > -1 ? 'time' : 'datetime';
                dObj.isCustom = true;
                break;
            }
        }
    }
    if (isNullOrUndefined(dObj.dateObj)) {
        for (let key of Object.keys(defaultDateFormats.timeFormats)) {
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
class WorkbookNumberFormat {
    constructor(parent) {
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
    numberFormatting(args) {
        let activeSheetTab = this.parent.activeSheetTab;
        let sheet = this.parent.sheets[activeSheetTab - 1];
        let selectedRange = getRangeIndexes(args.range || sheet.selectedRange);
        let cell;
        for (let i = selectedRange[0]; i <= selectedRange[2]; i++) {
            for (let j = selectedRange[1]; j <= selectedRange[3]; j++) {
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
    }
    /**
     * @hidden
     */
    getFormattedCell(args) {
        let fResult = isNullOrUndefined(args.value) ? '' : args.value;
        let sheet = this.parent.getActiveSheet();
        let range = getRangeIndexes(sheet.activeCell);
        let cell = args.cell ? args.cell : getCell(range[0], range[1], sheet);
        let rightAlign = false;
        let currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        let eventArgs = {
            range: range, format: args.format, requestType: 'numberFormat', value: args.value
        };
        this.parent.trigger('beforeCellFormat', eventArgs);
        if (args.format === '' || args.format === 'General') {
            cell = cell ? cell : {};
            let dateEventArgs = {
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
        let result = this.processFormats(args, fResult, rightAlign, cell);
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
    }
    processFormats(args, fResult, isRightAlign, cell) {
        let intl = new Internationalization();
        let currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        let result;
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
    }
    autoDetectGeneralFormat(options) {
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
            let res = options.fResult.toString();
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
    }
    findSuffix(zeros, resultSuffix) {
        let len = zeros.length;
        let suffixLen = len - resultSuffix.length;
        return zeros.substr(0, suffixLen < 0 ? 0 : suffixLen) + resultSuffix;
    }
    applyNumberFormat(args, intl) {
        args.format = args.format === '' ? getFormatFromType('Number') : args.format;
        args.format = args.format.toString().split('_)').join(' ').split('_(').join(' ').split('[Red]').join('');
        let formatArr = args.format.toString().split(';');
        if (Number(args.value) >= 0) {
            args.format = formatArr[0];
        }
        else {
            args.format = !isNullOrUndefined(formatArr[1]) ? formatArr[1].split('*').join(' ') : formatArr[0];
        }
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    }
    currencyFormat(args, intl) {
        args.format = args.format === '' ? getFormatFromType('Currency') : args.format;
        args.format = args.format.toString().split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        let formatArr = args.format.toString().split(';');
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
    }
    percentageFormat(args, intl) {
        args.format = args.format === '' ? getFormatFromType('Percentage') : args.format;
        return intl.formatNumber(Number(args.value), {
            format: args.format
        });
    }
    accountingFormat(args, intl) {
        args.format = args.format === '' ? getFormatFromType('Accounting') : args.format;
        args.format = args.format.split('_(').join(' ').split('_)').join(' ').split('[Red]').join('');
        let currencySymbol = getNumberDependable(this.parent.locale, 'USD');
        let formatArr = args.format.split(';');
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
    }
    shortDateFormat(args, intl) {
        let shortDate = intToDate(args.value);
        let code = (args.format === '' || args.format === 'General') ? getFormatFromType('ShortDate')
            : args.format.toString();
        let dateObj;
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
    }
    longDateFormat(args, intl) {
        let longDate = intToDate(args.value);
        let code = (args.format === '' || args.format === 'General') ? getFormatFromType('LongDate')
            : args.format.toString();
        if (code === getFormatFromType('LongDate')) {
            code = 'EEEE, MMMM d, y';
        }
        return intl.formatDate(longDate, {
            type: 'date',
            format: code
        });
    }
    timeFormat(args, intl) {
        if (!isNullOrUndefined(args.value.toString().split(this.decimalSep)[1])) {
            args.value = parseFloat('1' + this.decimalSep + args.value.split(this.decimalSep)[1]) || args.value;
        }
        let time = intToDate(args.value);
        let code = (args.format === '' || args.format === 'General') ? getFormatFromType('Time')
            : args.format.toString();
        if (code === getFormatFromType('Time')) {
            code = 'h:mm:ss a';
        }
        return intl.formatDate(time, {
            type: 'time',
            skeleton: 'medium',
            format: code
        });
    }
    scientificFormat(args) {
        args.format = args.format === '' ? getFormatFromType('Scientific') : args.format;
        let zeros = args.format.split('+')[1];
        let prefix = this.findDecimalPlaces(args.format, 'Scientific');
        let fResult = Number(args.value).toExponential(prefix);
        if (fResult.indexOf('e+') > -1) {
            fResult = fResult.split('e+')[0] + 'E+' + this.findSuffix(zeros, fResult.split('e+')[1]);
        }
        else if (fResult.indexOf('e-') > -1) {
            fResult = fResult.split('e-')[0] + 'E-' + +this.findSuffix(zeros, fResult.split('e-')[1]);
        }
        return fResult;
    }
    fractionFormat(args) {
        args.format = args.format === '' ? getFormatFromType('Fraction') : args.format;
        let suffix = '';
        let fractionResult;
        if (args.value.toString().indexOf(this.decimalSep) > -1 && isNumber(args.value)) {
            suffix = args.value.toString().split(this.decimalSep)[0];
            fractionResult = toFraction(Number(args.value));
            return (Number(suffix) === 0) ? ' ' + fractionResult : suffix + ' ' + fractionResult;
        }
        return suffix;
    }
    findDecimalPlaces(code, type) {
        switch (type) {
            case 'Scientific':
                let eIndex = code.toUpperCase().indexOf('E');
                let decIndex = code.indexOf(this.decimalSep);
                if (eIndex > -1) {
                    return code.substring(decIndex + 1, eIndex).length;
                }
        }
        return 2;
    }
    checkDateFormat(args) {
        let dateObj;
        let intl = new Internationalization();
        let value = !isNullOrUndefined(args.value) ? args.value.toString() : '';
        let cell = getCell(args.rowIndex, args.colIndex, getSheet(this.parent, (args.sheetIndex || this.parent.activeSheetTab) - 1));
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
    }
    formattedBarText(args) {
        let type = getTypeFromFormat(args.cell ? args.cell.format : '');
        let intl = new Internationalization();
        let beforeText = args.value;
        let date = getFormatFromType('ShortDate');
        let time = getFormatFromType('Time');
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
    }
    /**
     * Adding event listener for number format.
     */
    addEventListener() {
        this.parent.on(applyNumberFormatting, this.numberFormatting, this);
        this.parent.on(getFormattedCellObject, this.getFormattedCell, this);
        this.parent.on(checkDateFormat, this.checkDateFormat, this);
        this.parent.on(getFormattedBarText, this.formattedBarText, this);
    }
    /**
     * Removing event listener for number format.
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyNumberFormatting, this.numberFormatting);
            this.parent.off(getFormattedCellObject, this.getFormattedCell);
            this.parent.off(checkDateFormat, this.checkDateFormat);
            this.parent.off(getFormattedBarText, this.formattedBarText);
        }
    }
    /**
     * To Remove the event listeners.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook number format module name.
     */
    getModuleName() {
        return 'workbookNumberFormat';
    }
}
/**
 * To Get the number built-in format code from the number format type.
 * @param {string} type - Specifies the type of the number formatting.
 */
function getFormatFromType(type) {
    let code = 'General';
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
    let code = 'General';
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
class DataBind {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on('updateSheetFromDataSource', this.updateSheetFromDataSourceHandler, this);
        this.parent.on('dataSourceChanged', this.dataSourceChangedHandler, this);
    }
    /**
     * Destroys the Data binding module.
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off('updateSheetFromDataSource', this.updateSheetFromDataSourceHandler);
            this.parent.off('dataSourceChanged', this.dataSourceChangedHandler);
        }
    }
    /**
     * Update given data source to sheet.
     */
    updateSheetFromDataSourceHandler(args) {
        let cell;
        let flds;
        let sCellIdx;
        let result;
        let remoteUrl;
        let isLocal;
        let dataManager;
        let requestedRange = [];
        let sRanges = [];
        let rowIdx;
        let deferred = new Deferred();
        let sRowIdx;
        let sColIdx;
        let loadedInfo;
        args.promise = deferred.promise;
        if (args.sheet && args.sheet.rangeSettings.length) {
            for (let k = args.sheet.rangeSettings.length - 1; k >= 0; k--) {
                let sRange = args.indexes[0];
                let eRange = args.indexes[2];
                let range = args.sheet.rangeSettings[k];
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
                let isEndReached = false;
                this.initRangeInfo(range);
                let count = this.getMaxCount(range);
                loadedInfo = this.getLoadedInfo(sRange, eRange, range);
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
                    let query = (range.query ? range.query : new Query()).clone();
                    dataManager.executeQuery(query.range(sRange, eRange >= count ? eRange : eRange + 1)
                        .requiresCount()).then((e) => {
                        if (!this.parent || this.parent.isDestroyed) {
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
                                flds.forEach((field, i) => {
                                    cell = getCell(sRowIdx + sRanges[k], sColIdx + i, args.sheet, true);
                                    if (!cell) {
                                        args.sheet.rows[sRowIdx + sRanges[k]].cells[sColIdx + i] = { value: field };
                                    }
                                    else if (!cell.value) {
                                        cell.value = field;
                                    }
                                });
                            }
                            result.forEach((item, i) => {
                                for (let j = 0; j < flds.length; j++) {
                                    rowIdx = sRowIdx + sRanges[k] + i + (range.showFieldAsHeader ? 1 : 0);
                                    cell = getCell(rowIdx, sColIdx + j, args.sheet, true);
                                    if (cell) {
                                        if (!cell.value) {
                                            setCell(rowIdx, sColIdx + j, args.sheet, this.getCellDataFromProp(item[flds[j]]), true);
                                        }
                                    }
                                    else {
                                        args.sheet.rows[rowIdx]
                                            .cells[sColIdx + j] = this.getCellDataFromProp(item[flds[j]]);
                                    }
                                    this.checkDataForFormat({
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
                                this.updateSheetFromDataSourceHandler({
                                    sheet: args.sheet, indexes: [0, 0, args.sheet.usedRange.rowIndex, args.sheet.usedRange.colIndex],
                                    promise: new Promise((resolve) => { resolve((() => { })()); })
                                });
                            }
                            deferred.resolve();
                        }
                    });
                }
                else if (k === 0 && requestedRange.indexOf(false) === -1) {
                    deferred.resolve();
                }
            }
        }
        else {
            deferred.resolve();
        }
    }
    getCellDataFromProp(prop) {
        let data = {};
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
    }
    checkDataForFormat(args) {
        if (args.value !== '') {
            let dateEventArgs = {
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
    }
    getLoadedInfo(sRange, eRange, range) {
        let isNotLoaded = true;
        range.info.loadedRange.forEach((range) => {
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
    }
    getMaxCount(range) {
        if (range.query) {
            let query = range.query.queries;
            for (let i = 0; i < query.length; i++) {
                if (query[i].fn === 'onTake') {
                    return Math.min(query[i].e.nos, range.info.count || query[i].e.nos);
                }
            }
        }
        return range.info.count;
    }
    initRangeInfo(range) {
        if (!range.info) {
            range.info = { loadedRange: [] };
        }
    }
    /**
     * Remove old data from sheet.
     */
    dataSourceChangedHandler(args) {
        let oldSheet = args.oldProp.sheets[args.sheetIdx];
        let row;
        let sheet = this.parent.sheets[args.sheetIdx];
        let oldRange = oldSheet && oldSheet.rangeSettings && oldSheet.rangeSettings[args.rangeIdx];
        if (oldRange) {
            let indexes = getRangeIndexes(oldRange.startCell);
            sheet.rangeSettings[args.rangeIdx].info.loadedRange = [];
            oldRange.info.loadedRange.forEach((range) => {
                for (let i = range[0]; i < range[1]; i++) {
                    row = sheet.rows[i + indexes[0]];
                    for (let j = indexes[1]; j < indexes[1] + oldRange.info.fldLen; j++) {
                        row.cells[j].value = '';
                    }
                }
            });
        }
        this.parent.notify('data-refresh', { sheetIdx: args.sheetIdx });
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'dataBind';
    }
}

/**
 * Open properties.
 */
class WorkbookOpen {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To open the excel file stream or excel url into the spreadsheet.
     * @param {OpenOptions} options - Options to open a excel file.
     */
    open(options) {
        if (!this.parent.allowOpen) {
            return;
        }
        let formData = new FormData();
        if (options.file) {
            formData.append('file', options.file);
        }
        else {
            this.parent.isOpen = false;
            return;
        }
        let eventArgs = {
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
            .then((response) => {
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
            .then((data) => this.fetchSuccess(data))
            .catch((error) => this.fetchFailure(error));
    }
    fetchFailure(error) {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    }
    fetchSuccess(data) {
        let openError = ['UnsupportedFile', 'InvalidUrl'];
        let workbookData = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* tslint:disable-next-line:no-any */
        let impData = workbookData.Workbook;
        if (openError.indexOf(impData) > -1) {
            this.parent.notify(openSuccess, {
                context: this, data: impData
            });
            return;
        }
        this.updateModel(impData);
        this.parent.notify(openSuccess, this);
        this.parent.isOpen = false;
    }
    updateModel(workbookModel) {
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
        this.parent.sheets.forEach((key) => {
            key.id = getMaxSheetId(this.parent.sheets);
        });
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet' });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
    }
    /**
     * Adding event listener for workbook open.
     */
    addEventListener() {
        this.parent.on(workbookOpen, this.open.bind(this));
    }
    /**
     * Removing event listener workbook open.
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
        }
    }
    /**
     * To Remove the event listeners
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook open module name.
     */
    getModuleName() {
        return 'workbookOpen';
    }
}

/**
 * @hidden
 * The `SaveWorker` module is used to perform save functionality with Web Worker.
 */
class SaveWorker {
    /**
     * Constructor for SaveWorker module in Workbook library.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Process sheet.
     * @hidden
     */
    processSheet(sheet, sheetIndex) {
        let parsedSheet = JSON.parse(sheet, (key, value) => {
            //Remove empty properties
            if ((Array.isArray(value) || typeof value === 'string') && !value.length) {
                return undefined;
            }
            return value;
        });
        return [sheetIndex, parsedSheet];
    }
    /**
     * Process save action.
     * @hidden
     */
    processSave(saveJSON, saveSettings, customParams) {
        let formData = new FormData();
        let i;
        let keys = Object.keys(saveSettings);
        formData.append('JSONData', JSON.stringify(saveJSON));
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], saveSettings[keys[i]]);
        }
        keys = Object.keys(customParams);
        for (i = 0; i < keys.length; i++) {
            formData.append(keys[i], customParams[keys[i]]);
        }
        fetch(saveSettings.url, { method: 'POST', body: formData })
            .then((response) => {
            if (response.ok) {
                return response.blob();
            }
            else {
                return Promise.reject({
                    message: response.statusText
                });
            }
        })
            .then((data) => {
            postMessage(data);
        })
            .catch((error) => {
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
    }
}

/**
 * @hidden
 * The `WorkbookSave` module is used to handle the save action in Workbook library.
 */
class WorkbookSave extends SaveWorker {
    /**
     * Constructor for WorkbookSave module in Workbook library.
     * @private
     */
    constructor(parent) {
        super(parent);
        this.isProcessCompleted = false;
        this.saveJSON = {};
        this.isFullPost = false;
        this.needBlobData = false;
        this.customParams = null;
        this.addEventListener();
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'workbookSave';
    }
    /**
     * To destroy the WorkbookSave module.
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(beginSave, this.initiateSave, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
        }
    }
    /**
     * Initiate save process.
     * @hidden
     */
    initiateSave(args) {
        let saveSettings = args.saveSettings;
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
    }
    /**
     * Update save JSON with basic settings.
     * @hidden
     */
    updateBasicSettings() {
        let jsonStr = this.getStringifyObject(this.parent, ['sheets', '_isScalar', 'observers', 'closed', 'isStopped', 'hasError',
            '__isAsync', 'beforeCellFormat', 'beforeCellRender', 'beforeDataBound', 'beforeOpen', 'beforeSave', 'beforeSelect',
            'cellEdit', 'cellEditing', 'cellSave', 'contextMenuItemSelect', 'contextMenuBeforeClose', 'contextMenuBeforeOpen', 'created',
            'dataBound', 'fileItemSelect', 'fileMenuBeforeClose', 'fileMenuBeforeOpen', 'openFailure', 'saveComplete', 'select']);
        let basicSettings = JSON.parse(jsonStr);
        let sheetCount = this.parent.sheets.length;
        if (sheetCount) {
            basicSettings.sheets = [];
        }
        this.saveJSON = basicSettings;
    }
    /**
     * Process sheets properties.
     * @hidden
     */
    processSheets() {
        let i = 0;
        let sheetCount = this.parent.sheets.length;
        while (i < sheetCount) {
            executeTaskAsync(this, this.processSheet, this.updateSheet, [this.getStringifyObject(this.parent.sheets[i]), i]);
            i++;
        }
    }
    /**
     * Update processed sheet data.
     * @hidden
     */
    updateSheet(data) {
        this.saveJSON.sheets[data[0]] = data[1];
        this.isProcessCompleted = this.getSheetLength(this.saveJSON.sheets) === this.parent.sheets.length;
        if (this.isProcessCompleted) {
            this.save(this.saveSettings);
        }
    }
    getSheetLength(sheets) {
        let len = 0;
        sheets.forEach((sheet) => {
            if (sheet) {
                len++;
            }
        });
        return len;
    }
    /**
     * Save process.
     * @hidden
     */
    save(saveSettings) {
        if (this.isFullPost) {
            this.initiateFullPostSave();
        }
        else {
            executeTaskAsync(this, { 'workerTask': this.processSave }, this.updateSaveResult, [this.saveJSON, saveSettings, this.customParams], true);
        }
        this.saveJSON = {};
    }
    /**
     * Update final save data.
     * @hidden
     */
    updateSaveResult(result) {
        let args = {
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
    }
    ClientFileDownload(blobData, fileName) {
        let anchor = this.parent.createElement('a', { attrs: { download: this.getFileNameWithExtension() } });
        let url = URL.createObjectURL(blobData);
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    }
    initiateFullPostSave() {
        let keys = Object.keys(this.saveSettings);
        let i;
        let formElem = this.parent.createElement('form', { attrs: { method: 'POST', action: this.saveSettings.url } });
        let inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: 'JSONData' } });
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
    }
    /**
     * Get stringified workbook object.
     * @hidden
     */
    getStringifyObject(value, skipProp = []) {
        return JSON.stringify(value, (key, value) => {
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
    }
    getFileNameWithExtension(filename) {
        if (!filename) {
            filename = this.saveSettings.fileName;
        }
        let fileExt = this.getFileExtension();
        let idx = filename.lastIndexOf('.');
        if (idx > -1) {
            filename = filename.substr(0, idx);
        }
        return (filename + fileExt);
    }
    getFileExtension() {
        return ('.' + this.saveSettings.saveType.toLowerCase());
    }
}

/**
 * Represent the common codes for calculate
 */
class CalculateCommon {
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'calc-common';
    }
}
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
    let modules = [];
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
const MODULE_SUFFIX = 'Module';
/**
 * To get nameSpace value from the desired object.
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} obj - Object to get the inner object value.
 * @return {any}
 * @private
 */
function getValue$1(nameSpace, obj) {
    /* tslint:disable no-any */
    let value = obj;
    let splits = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    for (let j = 0; j < splits.length && !isUndefined(value); j++) {
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
    let keyValues = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    let start = obj || {};
    let fromObj = start;
    let j;
    let length = keyValues.length;
    let key;
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
class ModuleLoader {
    constructor(parent) {
        this.loadedModules = [];
        this.parent = parent;
    }
    ;
    /**
     * Inject required modules in component library
     * @hidden
     */
    inject(requiredModules, moduleList) {
        let reqLengthVal = requiredModules.length;
        if (reqLengthVal === 0) {
            this.clean();
            return;
        }
        if (this.loadedModules.length) {
            this.clearUnusedModule(requiredModules);
        }
        for (let i = 0; i < reqLengthVal; i++) {
            let modl = requiredModules[i];
            for (let module of moduleList) {
                let modName = modl.member;
                if (module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
                    let moduleObject = this.createInstance(module, modl.args);
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
     * Create Instance from constructor function with desired parameters.
     * @param {Function} classFunction - Class function to which need to create instance
     * @param {any[]} params - Parameters need to passed while creating instance
     * @return {any}
     * @private
     */
    createInstance(classFunction, params) {
        let arrayParam = params;
        arrayParam.unshift(undefined);
        return new (Function.prototype.bind.apply(classFunction, arrayParam));
    }
    /**
     * To remove the created object while control is destroyed
     * @hidden
     */
    clean() {
        for (let modules of this.loadedModules) {
            if (!modules.isProperty) {
                getValue$1(modules.member, this.parent).destroy();
            }
        }
        this.loadedModules = [];
    }
    /**
     * Removes all unused modules
     * @param {ModuleDeclaration[]} moduleListName
     * @returns {void}
     */
    clearUnusedModule(moduleListName) {
        let usedModule = moduleListName.map((arg) => { return this.getMemberName(arg.member); });
        let removeModule = this.loadedModules.filter((module) => {
            return usedModule.indexOf(module.member) === -1;
        });
        for (let moduleName of removeModule) {
            if (!moduleName.isProperty) {
                getValue$1(moduleName.member, this.parent).destroy();
            }
            this.loadedModules.splice(this.loadedModules.indexOf(moduleName), 1);
            this.deleteObject(this.parent, moduleName.member);
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
     * Delete an item from Object
     * @param {any} obj - Object in which we need to delete an item.
     * @param {string} params - String value to the get the inner object
     * @return {void}
     * @private
     */
    deleteObject(obj, key) {
        delete obj[key];
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
class BasicFormulas {
    constructor(parent) {
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
    init() {
        let fn;
        for (let i = 0; i < this.formulas.length; i++) {
            fn = getValue('Compute' + this.formulas[i].formulaName, this).bind(this);
            this.addFormulaCollection(this.formulas[i].formulaName.toUpperCase(), fn, this.formulas[i].category, this.formulas[i].description);
        }
    }
    addFormulaCollection(formulaName, functionName, formulaCategory, description) {
        this.parent.libraryFormulas = {
            fName: formulaName, handler: functionName, category: formulaCategory,
            description: description
        };
    }
    /** @hidden */
    ComputeSUM(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let sum = 0;
        let val;
        let orgValue;
        if (!isNullOrUndefined(args)) {
            let argArr = args;
            for (let i = 0; i < argArr.length; i++) {
                let argValue = argArr[i].toString();
                if (argValue.indexOf(':') > -1 && this.parent.isCellReference(argValue)) {
                    let cellCollection = this.parent.getCellCollection(argValue.split(this.parent.tic).join(''));
                    for (let j = 0; j < cellCollection.length; j++) {
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
    }
    /** @hidden */
    ComputeCOUNT(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr = args;
        let argVal;
        let cellColl;
        let result = 0;
        let cellValue;
        for (let i = 0; i < argArr.length; i++) {
            argVal = argArr[i];
            if (argVal.indexOf(':') > -1 && this.parent.isCellReference(argVal)) {
                cellColl = this.parent.getCellCollection(argVal.split(this.parent.tic).join(''));
                for (let j = 0; j < cellColl.length; j++) {
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
    }
    /** @hidden */
    ComputeDATE(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr = args;
        if (argArr.length !== 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let i = 0; i < argArr.length; ++i) {
            argArr[i] = this.parent.getValueFromArg(argArr[i]);
        }
        /* tslint:disable */
        argArr[0] = (argArr[0].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[0].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[0];
        argArr[1] = (argArr[1].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[1].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[1];
        argArr[2] = (argArr[2].split(this.parent.tic).join('') === 'TRUE') ? '1' : (argArr[2].split(this.parent.tic).join('') === 'FALSE') ? '0' : argArr[2];
        /* tslint:enable */
        let year = this.parent.parseFloat(argArr[0].split(this.parent.tic).join(''));
        let month = this.parent.parseFloat(argArr[1].split(this.parent.tic).join(''));
        let day = this.parent.parseFloat(argArr[2].split(this.parent.tic).join(''));
        let days = 0;
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
        let date = this.parent.fromOADate(days);
        if (date.toString() !== 'Invalid Date') {
            /* tslint:disable-next-line */
            return date.getFullYear() + '/' + this.parent.calculateDate((date.getMonth() + 1).toString()) + '/' + this.parent.calculateDate(date.getDate().toString());
        }
        return days.toString();
    }
    /** @hidden */
    ComputeFLOOR(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr = args;
        let argCount = argArr.length;
        let splitArg = argArr[1].split(this.parent.tic).join('');
        let argValue = [];
        let fnum;
        let significance;
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
        for (let i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(this.parent.tic) > -1) {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        if (isNaN(fnum)) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        return Math.floor(fnum / significance) * significance;
    }
    /** @hidden */
    ComputeCEILING(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr = args;
        let orgValue = [];
        let argCount = argArr.length;
        let splitArg = argArr[1].split(this.parent.tic).join('');
        let cnum;
        let significance;
        if (argCount !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        orgValue.push(cnum = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join(''))));
        argArr[1] = (splitArg === this.parent.trueValue) ? '1' : (splitArg === this.parent.falseValue) ? '0' : argArr[1];
        orgValue.push(significance = this.parent.parseFloat(this.parent.getValueFromArg(argArr[1].split(this.parent.tic).join(''))));
        if (cnum > 0 && significance < 0) {
            return this.parent.getErrorStrings()[CommonErrors.num];
        }
        for (let i = 0; i < argArr.length; i++) {
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
    }
    /** @hidden */
    ComputeDAY(...serialNumber) {
        let date = serialNumber;
        let result;
        if (isNullOrUndefined(date) || (date.length === 1 && date[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (date.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let dateVal = this.parent.getValueFromArg(date[0].split(this.parent.tic).join(''));
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
    }
    /** @hidden */
    ComputeIF(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (this.parent.getErrorStrings().indexOf(args[0]) > 0) {
            return args[0];
        }
        let argArr = args;
        let condition;
        let result;
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
    }
    /** @hidden */
    ComputeIFERROR(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr = args;
        let condition;
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
    }
    /** @hidden */
    ComputePRODUCT(...range) {
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let product = 1;
        let val;
        let orgValue;
        let countNum = 0;
        if (!isNullOrUndefined(range)) {
            let argArr = range;
            for (let i = 0; i < argArr.length; i++) {
                let rangevalue = argArr[i];
                if (rangevalue.indexOf(':') > -1 && this.parent.isCellReference(rangevalue)) {
                    countNum = 0;
                    let cellCollection = this.parent.getCellCollection(rangevalue);
                    for (let j = 0; j < cellCollection.length; j++) {
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
    }
    /** @hidden */
    ComputeDAYS(...range) {
        let result;
        if (isNullOrUndefined(range) && (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (range.length !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsArr = range;
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.trueValue) {
            argsArr[0] = '1';
        }
        if (argsArr[0].split(this.parent.tic).join('') === this.parent.falseValue) {
            argsArr[0] = '0';
        }
        let endDate = this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join(''));
        let startDate = this.parent.getValueFromArg(argsArr[1].split(this.parent.tic).join(''));
        startDate = (startDate === '' || startDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : startDate;
        endDate = (endDate === '' || endDate == null) ? new Date(Date.parse('1899-12-31')).toDateString() : endDate;
        if (endDate[0] === '#') {
            return endDate;
        }
        if (startDate[0] === '#') {
            return startDate;
        }
        let d1 = this.parent.parseDate(endDate);
        let d2 = this.parent.parseDate(startDate);
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
    }
    /** @hidden */
    ComputeCHOOSE(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        if (args.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsArr = args;
        if (argsArr[0].indexOf(':') > -1 && this.parent.isCellReference(argsArr[0])) {
            let cellCollection = this.parent.getCellCollection(argsArr[0]);
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            }
            else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        let cond = this.parent.getValueFromArg(argsArr[0]);
        if (this.parent.getErrorStrings().indexOf(cond) > -1) {
            return cond;
        }
        let indexNum = this.parent.parseFloat(this.parent.getValueFromArg(argsArr[0].split(this.parent.tic).join('')));
        if (indexNum < 1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        indexNum = Math.floor(indexNum);
        let result;
        if (isNullOrUndefined(argsArr[indexNum])) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        result = argsArr[indexNum];
        if (result === '') {
            result = '0';
        }
        if (result.indexOf(':') > -1 && this.parent.isCellReference(result)) {
            let cellCollection = this.parent.getCellCollection(argsArr[0].split(this.parent.tic).join(''));
            if (cellCollection.length === 1) {
                argsArr[0] = cellCollection[0];
            }
            else {
                return this.parent.getErrorStrings()[CommonErrors.value];
            }
        }
        return this.parent.getValueFromArg(result).split(this.parent.tic).join('');
    }
    /** @hidden */
    ComputeSUMIF(...range) {
        let argArr = range;
        if (argArr[0].indexOf(':') < 0 && !this.parent.isCellReference(argArr[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        let result = this.parent.computeSumIfAndAvgIf(range);
        if (typeof result === 'string' && (this.parent.formulaErrorStrings.indexOf(result)
            || this.parent.getErrorStrings().indexOf(result))) {
            return result;
        }
        return result[0];
    }
    /** @hidden */
    ComputeABS(...absValue) {
        let argArr = absValue;
        let cellvalue = '';
        let absVal;
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
    }
    /** @hidden */
    ComputeAVERAGE(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argArr = args;
        for (let i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1) {
                if (argArr[i].indexOf(this.parent.tic) > -1) {
                    return this.parent.getErrorStrings()[CommonErrors.value];
                }
            }
        }
        return this.parent.calculateAvg(argArr);
    }
    /** @hidden */
    ComputeAVERAGEIF(...range) {
        let argList = range;
        if (argList[0].indexOf(':') < 0 && !this.parent.isCellReference(argList[0])) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.improper_formula];
        }
        let resultVal = this.parent.computeSumIfAndAvgIf(range);
        if (typeof resultVal === 'string' && (this.parent.formulaErrorStrings.indexOf(resultVal)
            || this.parent.getErrorStrings().indexOf(resultVal))) {
            return resultVal;
        }
        return this.parent.parseFloat(resultVal[0]) / this.parent.parseFloat(resultVal[1]);
    }
    /** @hidden */
    ComputeCONCATENATE(...range) {
        if (isNullOrUndefined(range) || (range.length === 1 && range[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.invalid_arguments];
        }
        let argsList = range;
        let result = '';
        let tempStr = '';
        for (let i = 0; i < argsList.length; i++) {
            if (argsList[i].indexOf(':') > -1 && this.parent.isCellReference(argsList[i])) {
                if (this.isConcat) {
                    let cells = this.parent.getCellCollection(argsList[i]);
                    for (let i = 0; i < cells.length; i++) {
                        tempStr = this.parent.getValueFromArg(cells[i]);
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
    }
    /** @hidden */
    ComputeCONCAT(...range) {
        this.isConcat = true;
        return this.ComputeCONCATENATE(...range);
    }
    /** @hidden */
    ComputeMAX(...args) {
        return this.parent.computeMinMax(args, 'max');
    }
    /** @hidden */
    ComputeMIN(...args) {
        return this.parent.computeMinMax(args, 'min');
    }
    /** @hidden */
    ComputeRAND(...args) {
        if (args.length === 1 && args[0] === '') {
            args.length = 0;
        }
        if (args.length > 0) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        return Math.random().toString();
    }
    /** @hidden */
    ComputeAND(...args) {
        return this.parent.computeAndOr(args, 'and');
    }
    /** @hidden */
    ComputeOR(...args) {
        return this.parent.computeAndOr(args, 'or');
    }
    /** @hidden */
    ComputeFIND(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argsList = args;
        if (argsList.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let findText = this.parent.removeTics(this.parent.getValueFromArg(argsList[0]));
        let withinText = this.parent.removeTics(this.parent.getValueFromArg(argsList[1]));
        if (this.parent.getErrorStrings().indexOf(findText) > -1 || this.parent.getErrorStrings().indexOf(withinText) > -1) {
            return this.parent.getErrorStrings()[CommonErrors.name];
        }
        let startNum = 1;
        let loc;
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
    }
    /** @hidden */
    ComputeINDEX(...range) {
        let argArr = range;
        let argCount = argArr.length;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argCount > 3) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        let rangeValue = '';
        let rangeArr = [];
        if (argCount > 2) {
            for (let i = 0; i < argCount; i++) {
                if (this.parent.isCellReference(argArr[i]) && argArr[i].indexOf(':') < 0) {
                    return this.parent.getErrorStrings()[CommonErrors.ref];
                }
                if (this.parent.isCellReference(argArr[i])) {
                    rangeArr[i] = argArr[i];
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
        let row = parseFloat(argArr[1]);
        row = !isNaN(row) ? row : -1;
        let col = parseFloat(argArr[2] ? argArr[2] : '1');
        col = !isNaN(col) ? col : -1;
        if (row === -1 || col === -1) {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        let i = argArr[0].indexOf(':');
        let startRow = this.parent.rowIndex(rangeValue.substring(0, i));
        let endRow = this.parent.rowIndex(rangeValue.substring(i + 1));
        let startCol = this.parent.colIndex(rangeValue.substring(0, i));
        let endCol = this.parent.colIndex(rangeValue.substring(i + 1));
        if (row > endRow - startRow + 1 || col > endCol - startCol + 1) {
            return this.parent.getErrorStrings()[CommonErrors.ref];
        }
        row = startRow + row - 1;
        col = startCol + col - 1;
        let cellRef = '' + this.parent.convertAlpha(col) + row;
        let result = this.parent.getValueFromArg(cellRef);
        if (result === '') {
            return 0;
        }
        return result;
    }
    /** @hidden */
    ComputeIFS(...range) {
        let argArr = range;
        if (isNullOrUndefined(range) || (argArr.length === 1 && argArr[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let condition = '';
        let result = '';
        for (let i = 0; i < argArr.length; i++) {
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
    }
    /** @hidden */
    ComputeCOUNTA(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr = args;
        let cellColl;
        let result = 0;
        let cellValue;
        for (let i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.parent.isCellReference(argArr[i])) {
                cellColl = this.parent.getCellCollection(argArr[i].split(this.parent.tic).join(''));
                for (let j = 0; j < cellColl.length; j++) {
                    cellValue = this.parent.getValueFromArg(cellColl[j]);
                    if (cellValue.length > 0) {
                        result++;
                    }
                }
            }
            else {
                let cellValue = this.parent.getValueFromArg(argArr[i].split(this.parent.tic).join(''));
                if (cellValue.length > 0) {
                    result++;
                }
            }
        }
        return result;
    }
    /** @hidden */
    ComputeAVERAGEA(...args) {
        if (isNullOrUndefined(args) || (args.length === 1 && args[0] === '')) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArrs = args;
        let cellCol;
        let result = 0;
        let cellVal;
        let length = 0;
        for (let k = 0; k < argArrs.length; k++) {
            if (argArrs[k].indexOf(':') > -1 && this.parent.isCellReference(argArrs[k])) {
                cellCol = this.parent.getCellCollection(argArrs[k].split(this.parent.tic).join(''));
                for (let j = 0; j < cellCol.length; j++) {
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
                let cellValue = this.parent.getValueFromArg(argArrs[k].split(this.parent.tic).join(''));
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
    }
    /** @hidden */
    ComputeCOUNTIF(...args) {
        let argArr = args;
        if (isNullOrUndefined(args) || args[0] === '' || argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellColl;
        let result = 0;
        let cellValue;
        let stack = [];
        let op = 'equal';
        let condition = argArr[1].split(this.parent.tic).join('');
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
            for (let j = 0; j < cellColl.length; j++) {
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
    }
    /** @hidden */
    ComputeSUMIFS(...range) {
        let sum;
        sum = this.parent.computeIfsFormulas(range, this.parent.falseValue);
        return sum;
    }
    /** @hidden */
    ComputeCOUNTIFS(...args) {
        let sum;
        sum = this.parent.computeIfsFormulas(args, this.parent.trueValue);
        return sum;
    }
    /** @hidden */
    ComputeAVERAGEIFS(...args) {
        let sum;
        sum = this.parent.computeIfsFormulas(args, this.parent.falseValue, this.parent.trueValue);
        return sum;
    }
    /** @hidden */
    ComputeMATCH(...args) {
        let argArr = args;
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellColl;
        let cellValue = [];
        let lookupVal = argArr[0].split(this.parent.tic).join('');
        argArr[2] = isNullOrUndefined(argArr[2]) ? '1' : argArr[2].split(this.parent.tic).join('');
        if (argArr[2].split(this.parent.tic).join('') === this.parent.trueValue) {
            argArr[2] = '1';
        }
        if (argArr[2].split(this.parent.tic).join('') === this.parent.falseValue) {
            argArr[2] = '0';
        }
        let matchType = parseFloat(argArr[2]);
        if (matchType !== -1 && matchType !== 0 && matchType !== 1) {
            return this.parent.getErrorStrings()[CommonErrors.na];
        }
        let index = 0;
        let indexVal = '';
        if (argArr[1].indexOf(':') > -1 || this.parent.isCellReference(argArr[1])) {
            cellColl = this.parent.getCellCollection(argArr[1].split(this.parent.tic).join(''));
            for (let j = 0; j < cellColl.length; j++) {
                cellValue[j] = this.parent.getValueFromArg(cellColl[j]).split(this.parent.tic).join('');
            }
            for (let i = 0; i < cellValue.length; i++) {
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
    }
    /** @hidden */
    ComputeLOOKUP(...range) {
        let argArr = range;
        let result = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 2 || argArr.length > 3) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeLookup(argArr);
        return result;
    }
    /** @hidden */
    ComputeVLOOKUP(...range) {
        let argArr = range;
        let result = '';
        if (isNullOrUndefined(argArr) || (argArr.length === 1 && argArr[0] === '') || argArr.length < 3 || argArr.length > 4) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        result = this.parent.computeVLookup(argArr);
        return result;
    }
    /** @hidden */
    ComputeSUBTOTAL(...range) {
        let argArr = range;
        let result = '';
        if (argArr.length < 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let formula = this.parent.parseFloat(this.parent.getValueFromArg(argArr[0].split(this.parent.tic).join('')));
        if (isNaN(formula)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        if ((formula < 1 || formula > 11) && (formula < 101 || formula > 111)) {
            this.parent.getErrorStrings()[CommonErrors.value];
        }
        let cellRef = argArr.slice(1, argArr.length);
        switch (formula) {
            case 1:
            case 101:
                result = this.ComputeAVERAGE(...cellRef);
                break;
            case 2:
            case 102:
                result = this.ComputeCOUNT(...cellRef);
                break;
            case 3:
            case 103:
                result = this.ComputeCOUNTA(...cellRef);
                break;
            case 4:
            case 104:
                result = this.ComputeMAX(...cellRef);
                break;
            case 5:
            case 105:
                result = this.ComputeMIN(...cellRef);
                break;
            case 6:
            case 106:
                result = this.ComputePRODUCT(...cellRef);
                break;
            case 7:
            case 107:
                result = this.ComputeDAY(...cellRef);
                break;
            case 8:
            case 108:
                result = this.ComputeCONCAT(...cellRef);
                break;
            case 9:
            case 109:
                result = this.ComputeSUM(...cellRef);
                break;
            case 10:
            case 110:
                result = this.ComputeAVERAGEA(...cellRef);
                break;
            case 11:
            case 111:
                result = this.ComputeABS(...cellRef);
                break;
            default:
                result = this.parent.getErrorStrings()[CommonErrors.value];
                break;
        }
        return result;
    }
    /** @hidden */
    ComputeRADIANS(...range) {
        let argArr = range;
        let result;
        if (argArr[0] === '' || argArr.length > 1) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        if (argArr[0].indexOf(':') > -1 || argArr[0].split(this.parent.tic).join('') === '') {
            return this.parent.getErrorStrings()[CommonErrors.value];
        }
        let val = argArr[0].split(this.parent.tic).join('');
        argArr[0] = isNaN(this.parent.parseFloat(val)) ? argArr[0] : val;
        let cellvalue = this.parent.getValueFromArg(argArr[0]);
        let radVal = this.parent.parseFloat(cellvalue);
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
    }
    /** @hidden */
    ComputeRANDBETWEEN(...range) {
        let argsLength = range.length;
        let min;
        let max;
        let argVal;
        if (argsLength !== 2) {
            return this.parent.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let i = 0; i < argsLength; i++) {
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
    }
    getModuleName() {
        return 'basic-formulas';
    }
}

/**
 * Export formula modules.
 */

class Parser {
    constructor(parent) {
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
    parse(text, fkey) {
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
        let formulaString = this.storeStrings(text);
        text = this.storedStringText;
        let i = 0;
        if (isNullOrUndefined(formulaString)) {
            text = text.split(' ').join('');
        }
        text = text.split('=>').join('>=');
        text = text.split('=<').join('<=');
        if (text[text.length - 1] !== this.parent.arithMarker || this.indexOfAny(text, this.tokens) !== (text.length - 2)) {
            text = text.toUpperCase();
        }
        if (text.indexOf(this.sheetToken) > -1) {
            let family = this.parent.getSheetFamilyItem(this.parent.grid);
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
                if (text[0] !== this.sheetToken.toString()) {
                    text = this.parent.setTokensForSheets(text);
                }
                let sheetToken = this.parent.getSheetToken(text.split(this.parent.tic).join(this.emptyStr));
                let scopedRange = this.checkScopedRange(text.split('"').join(this.emptyStr).split(this.sheetToken).join(''));
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
            let args = {
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
                let k = text.substring(0, i).lastIndexOf('(');
                if (k === -1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.mismatched_parentheses]);
                }
                if (k === i - 1) {
                    throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.empty_expression]);
                }
                let s = this.emptyStr;
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
                    let args = this.exceptionArgs(ex);
                    if (!this.isFailureTriggered) {
                        this.parent.trigger('onFailure', args);
                        this.isFailureTriggered = true;
                    }
                    let errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
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
    }
    /* tslint:disable-next-line:no-any */
    exceptionArgs(ex) {
        return {
            message: ex.message, exception: ex, isForceCalculable: ex.formulaCorrection,
            computeForceCalculate: false
        };
    }
    formulaAutoCorrection(formula, args) {
        let arithemeticArr = ['*', '+', '-', '/', '^', '&'];
        let logicalSym = ['>', '=', '<'];
        let i = 0;
        let form = '';
        let op = '';
        let firstOp = '';
        let secondprevOp = '';
        let secondnextOp = '';
        let firstDigit = '';
        let secondDigit = '';
        let countDigit = 0;
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
    }
    checkScopedRange(text) {
        let scopedRange = this.emptyStr;
        let b = 'NaN';
        let id = this.parent.getSheetID(this.parent.grid);
        let sheet = this.parent.getSheetFamilyItem(this.parent.grid);
        if (text[0] === this.sheetToken.toString()) {
            let i = text.indexOf(this.sheetToken, 1);
            let v = parseInt(text.substr(1, i - 1), 10);
            if (i > 1 && !this.parent.isNaN(v)) {
                text = text.substring(i + 1);
                id = v;
            }
        }
        let token = '!' + id.toString() + '!';
        if (sheet === null || sheet.sheetNameToToken == null) {
            return b;
        }
        sheet.sheetNameToToken.forEach((value, key) => {
            if (sheet.sheetNameToToken.get(key).toString() === token) {
                let s = this.emptyStr;
                this.parent.namedRanges.forEach((value, key) => {
                    /* tslint:disable-next-line:no-any */
                    if (!isNullOrUndefined(this.parent.parentObject)) {
                        /* tslint:disable-next-line:no-any */
                        s = (this.parent.parentObject.getActiveSheet().name + this.sheetToken + text).toUpperCase();
                    }
                    else {
                        s = sheet.sheetNameToToken.get(key).toUpperCase();
                    }
                    if (this.parent.getNamedRanges().has(s)) {
                        scopedRange = (this.parent.getNamedRanges().get(s)).toUpperCase();
                        b = scopedRange;
                    }
                });
            }
        });
        return b;
    }
    storeStrings(tempString) {
        let i = 0;
        let j = 0;
        let id = 0;
        let key = '';
        let storedString = null;
        let condition;
        let ticLoc = tempString.indexOf(this.parent.tic);
        let singleTicLoc = tempString.indexOf(this.parent.singleTic);
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
    }
    setStrings(text, formulaString) {
        for (let i = 0; i < formulaString.size; i++) {
            formulaString.forEach((value, key) => {
                text = text.split(key).join(value);
            });
        }
        return text;
    }
    /** @hidden */
    parseSimple(formulaText) {
        let needToContinue = true;
        let text = formulaText;
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
        let expTokenArray = [this.tokenEp, this.tokenEm];
        let mulTokenArray = [this.tokenMultiply, this.tokenDivide];
        let addTokenArray = [this.tokenAdd, this.tokenSubtract];
        let mulCharArray = [this.charMultiply, this.charDivide];
        let addCharArray = [this.charAdd, this.charSubtract];
        let compareTokenArray = [this.tokenLess, this.tokenGreater, this.tokenEqual, this.tokenLessEq,
            this.tokenGreaterEq, this.tokenNotEqual];
        let compareCharArray = [this.charLess, this.charGreater, this.charEqual, this.charLessEq,
            this.charGreaterEq, this.charNoEqual];
        let expCharArray = [this.charEp, this.charEm];
        let andTokenArray = [this.tokenAnd];
        let andCharArray = [this.charAnd];
        let orCharArray = [this.charOr];
        let orTokenArray = [this.tokenOr];
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
    }
    /** @hidden */
    // tslint:disable-next-line:max-func-body-length
    parseSimpleOperators(formulaText, markers, operators) {
        if (this.parent.getErrorStrings().indexOf(formulaText) > -1) {
            return formulaText;
        }
        let text = formulaText;
        let i = 0;
        let op = '';
        for (let c = 0; c < operators.length; c++) {
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
                    let left = '';
                    let right = '';
                    let leftIndex = 0;
                    let rightIndex = 0;
                    let isNotOperator = text[i] === this.charNOTop;
                    let j = 0;
                    if (!isNotOperator) {
                        j = i - 1;
                        if (text[j] === this.parent.arithMarker) {
                            let k = this.findLeftMarker(text.substring(0, j - 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, k + 1, j - k - 1);
                            leftIndex = k + 1;
                        }
                        else if (text[j] === this.parent.rightBracket) {
                            let bracketCount = 0;
                            let k = j - 1;
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
                            let l = text.substring(0, j - 1).lastIndexOf(this.parent.tic);
                            if (l < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            left = this.parent.substring(text, l, j - l + 1);
                            leftIndex = l;
                        }
                        else {
                            let period = false;
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
                        let uFound = text[j] === 'u'; // for 3*-2
                        if (uFound) {
                            j = j + 1;
                        }
                        if (text[j] === this.parent.tic[0]) {
                            let k = text.substring(j + 1).indexOf(this.parent.tic);
                            if (k < 0) {
                                throw this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse];
                            }
                            right = this.parent.substring(text, j, k + 2);
                            rightIndex = k + j + 2;
                        }
                        else if (text[j] === this.parent.arithMarker) {
                            let k = this.findRightMarker(text.substring(j + 1));
                            if (k < 0) {
                                throw new FormulaError(this.parent.formulaErrorStrings[FormulasErrorsStrings.cannot_parse]);
                            }
                            right = this.parent.substring(text, j + 1, k);
                            rightIndex = k + j + 2;
                        }
                        else if (text[j] === 'q') {
                            let bracketCount = 0;
                            let k = j + 1;
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
                            let period = (text[j] === this.parent.getParseDecimalSeparator());
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
                            let jTemp = 0;
                            let inbracket = false;
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
                            let noCellReference = (j === text.length) || !this.parent.isDigit(text[j]);
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
                    let p = op.indexOf(text[i]);
                    let s = this.parent.arithMarker + left + right + markers[p] + this.parent.arithMarker;
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
                    let isCharacter = true;
                    let checkLetter = true;
                    let oneTokenFound = false;
                    let textLen = text.length;
                    for (let k = 0; k < textLen; ++k) {
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
    }
    /** @hidden */
    indexOfAny(text, operators) {
        for (let i = 0; i < text.length; i++) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    }
    /** @hidden */
    findLeftMarker(text) {
        let ret = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            let bracketLevel = 0;
            for (let i = text.length - 1; i >= 0; --i) {
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
    }
    /** @hidden */
    findRightMarker(text) {
        let ret = -1;
        if (text.indexOf(this.parent.arithMarker) > -1) {
            let bracketLevel = 0;
            for (let j = 0; j < text.length; ++j) {
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
    }
    /** @hidden */
    parseFormula(formula, fKey) {
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
            let args = this.exceptionArgs(ex);
            if (!this.isFailureTriggered) {
                this.parent.trigger('onFailure', args);
                this.isFailureTriggered = true;
            }
            let errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
            formula = (isNullOrUndefined(this.parent.getErrorLine(ex)) ? '' : '#' + this.parent.getErrorLine(ex) + ': ') + errorMessage;
            this.isError = true;
        }
        return formula;
    }
    /** @hidden */
    markLibraryFormulas(formula) {
        let bracCount = 0;
        let rightParens = formula.indexOf(')');
        if (rightParens === -1) {
            formula = this.markNamedRanges(formula);
        }
        else {
            while (rightParens > -1) {
                let parenCount = 0;
                let leftParens = rightParens - 1;
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
                let i = leftParens - 1;
                while (i > -1 && (this.parent.isChar(formula[i]))) {
                    i--;
                }
                let len = leftParens - i - 1;
                let libFormula = this.parent.substring(formula, i + 1, len);
                if (len > 0 && !isNullOrUndefined(this.parent.getFunction(libFormula))) {
                    if (this.parent.substring(formula, i + 1, len) === 'AREAS') {
                        this.ignoreBracet = true;
                    }
                    else {
                        this.ignoreBracet = false;
                    }
                    let substr = this.parent.substring(formula, leftParens, rightParens - leftParens + 1);
                    try {
                        let args;
                        substr = substr.split('(').join('').split(')').join('');
                        substr = '(' + this.formulaAutoCorrection(substr, args) + ')';
                    }
                    catch (ex) {
                        let args = {
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
                    let id = substr.lastIndexOf(this.parent.getParseArgumentSeparator());
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
                    let s = this.emptyStr;
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
    }
    /** @hidden */
    swapInnerParens(fSubstr) {
        if (fSubstr.length > 2) {
            /* tslint:disable-next-line */
            fSubstr = fSubstr[0] + fSubstr.substr(1, fSubstr.length - 2).split('(').join('{').split(')').join('}') + fSubstr[fSubstr.length - 1];
        }
        return fSubstr;
    }
    /** @hidden */
    addParensToArgs(fSubstr) {
        if (fSubstr.length === 0) {
            return this.emptyStr;
        }
        let rightSides = [];
        rightSides.push(this.parent.getParseArgumentSeparator());
        rightSides.push(this.parent.rightBracket);
        let id = fSubstr.lastIndexOf(this.parent.getParseArgumentSeparator());
        let k = 0;
        if (id === -1) {
            if (fSubstr.length > 2 && fSubstr[0] === '(' && fSubstr[fSubstr.length - 1] === ')') {
                if (fSubstr[1] !== '{' && fSubstr[1] !== '(') {
                    fSubstr = fSubstr.substring(0, fSubstr.length - 1) + '}' + fSubstr.substring(fSubstr.length - 1);
                    fSubstr = fSubstr[0] + '{' + fSubstr.substring(1);
                }
                else {
                    let marker = ['+', '-', '*', '/'];
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
            let oneTimeOnly = true;
            while (id > -1) {
                let j = this.indexOfAny(fSubstr.substring(id + 1, fSubstr.length), rightSides);
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
    }
    /** @hidden */
    lastIndexOfAny(text, operators) {
        for (let i = text.length - 1; i > -1; i--) {
            if (operators.indexOf(text[i]) > -1) {
                return i;
            }
        }
        return -1;
    }
    /** @hidden */
    markNamedRanges(formula) {
        let markers = [')', this.parent.getParseArgumentSeparator(), '}', '+', '-', '*', '/', '<', '>', '=', '&'];
        let i = (formula.length > 0 && (formula[0] === '(' || formula[0] === '{')) ? 1 : 0;
        if (formula.indexOf('#N/A') > -1) {
            formula = formula.split('#N/A').join('#N~A');
        }
        if (formula.indexOf('#DIV/0!') > -1) {
            formula = formula.split('#DIV/0!').join('#DIV~0!');
        }
        let end = this.indexOfAny(formula.substring(i), markers);
        while (end > -1 && end + i < formula.length) {
            let scopedRange = this.emptyStr;
            let s = null;
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
                    let formulaStr = this.parent.substring(formula, i, end).indexOf(this.sheetToken, 1);
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
                        let val = formula.substring(i);
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
    }
    /** @hidden */
    checkForNamedRangeAndKeyValue(text) {
        let scopedRange = this.emptyStr;
        if (text.indexOf('[') > -1) {
            let namerangeValue = this.getTableRange(text);
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
                let sheet = this.parent.getSheetFamilyItem(this.parent.grid);
                /* tslint:disable-next-line */
                let value = text.split('"').join(this.emptyStr);
                value = value.substr(0, value.indexOf(this.sheetToken));
                if (sheet.sheetNameToToken.has(value.toUpperCase())) {
                    /* tslint:disable */
                    let sheetIndex = parseInt(sheet.sheetNameToToken.get(value.toUpperCase()).split(this.sheetToken).join(this.emptyStr));
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
    }
    getTableRange(text) {
        text = text.replace(' ', this.emptyStr).toUpperCase();
        let name = text.replace(']', this.emptyStr).replace('#DATA', this.emptyStr);
        let tableName = name;
        if (name.indexOf(this.parent.getParseArgumentSeparator()) > -1) {
            tableName = name.substring(0, name.indexOf(this.parent.getParseArgumentSeparator())).replace('[', this.emptyStr);
            name = name.replace('[', this.emptyStr).replace(this.parent.getParseArgumentSeparator(), '_');
        }
        let range = this.emptyStr;
        return name.toUpperCase();
    }
    findNextEndIndex(formula, loc) {
        let count = 0;
        let l = loc;
        let found = false;
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
    }
    ;
}

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Calculate_1;
/* tslint:disable-next-line:max-line-length */
/**
 * Represents the calculate library.
 */
let Calculate = Calculate_1 = class Calculate extends Base {
    /**
     * Base constructor for creating Calculate library.
     */
    constructor(parent) {
        super(null, null);
        this.lFormulas = new Map();
        /** @hidden */
        this.storedData = new Map();
        this.keyToRowsMap = new Map();
        this.rowsToKeyMap = new Map();
        /** @hidden */
        this.rightBracket = String.fromCharCode(161);
        /** @hidden */
        this.leftBracket = String.fromCharCode(162);
        /** @hidden */
        this.sheetToken = '!';
        this.emptyString = '';
        this.leftBrace = '{';
        this.rightBrace = '}';
        this.cell = this.emptyString;
        this.cellPrefix = '!0!A';
        this.treatEmptyStringAsZero = false;
        /** @hidden */
        this.tic = '\"';
        /** @hidden */
        this.singleTic = '\'';
        /** @hidden */
        this.trueValue = 'TRUE';
        /** @hidden */
        this.falseValue = 'FALSE';
        this.parseDecimalSeparator = '.';
        /** @hidden */
        this.arithMarker = String.fromCharCode(180);
        /** @hidden */
        this.arithMarker2 = this.arithMarker + this.arithMarker;
        this.dependentCells = null;
        this.dependentFormulaCells = null;
        this.minValue = Number.MIN_SAFE_INTEGER;
        this.maxValue = Number.MAX_SAFE_INTEGER;
        this.categoryCollection = ['All'];
        this.dependencyLevel = 0;
        this.refreshedCells = new Map();
        this.computedValues = null;
        /** @hidden */
        this.randomValues = new Map();
        /** @hidden */
        this.isRandomVal = false;
        /** @hidden */
        this.randCollection = [];
        /**
         * @hidden
         */
        this.formulaErrorStrings = [
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
        this.errorStrings = null;
        this.parseArgumentSeparator = ',';
        this.dateTime1900 = new Date(1900, 0, 1, 0, 0, 0);
        this.isParseDecimalSeparatorChanged = false;
        this.isArgumentSeparatorChanged = false;
        this.sheetFamilyID = 0;
        this.defaultFamilyItem = null;
        this.sheetFamiliesList = null;
        this.modelToSheetID = null;
        /** @hidden */
        this.tokenCount = 0;
        this.sortedSheetNames = null;
        this.tempSheetPlaceHolder = String.fromCharCode(133);
        /** @hidden */
        this.namedRanges = new Map();
        this.formulaInfoTable = null;
        this.oaDate = new Date(1899, 11, 30);
        this.millisecondsOfaDay = 24 * 60 * 60 * 1000;
        this.parseDateTimeSeparator = '/';
        let moduleLoader = new ModuleLoader(this);
        if (this.includeBasicFormulas) {
            Calculate_1.Inject(BasicFormulas);
        }
        if (this.injectedModules && this.injectedModules.length) {
            moduleLoader.inject(this.requiredModules(), this.injectedModules);
        }
        this.parentObject = isNullOrUndefined(parent) ? this : parent;
        this.grid = this.parentObject;
        this.parser = new Parser(this);
    }
    /* tslint:disable-next-line:no-any */
    get libraryFormulas() {
        return this.lFormulas;
    }
    /* tslint:disable-next-line:no-any */
    set libraryFormulas(formulaColl) {
        this.lFormulas.set(formulaColl.fName, { handler: formulaColl.handler, category: formulaColl.category, description: formulaColl.description });
    }
    /**
     * To get the argument separator to split the formula arguments.
     * @returns string
     */
    getParseArgumentSeparator() {
        let seperator = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    }
    /**
     * To set the argument separator to split the formula arguments.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    setParseArgumentSeparator(value) {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    }
    /**
     * To get the date separator to split the date value.
     * @returns string
     */
    getParseDateTimeSeparator() {
        return this.parseDateTimeSeparator;
    }
    /**
     * To set whether the empty string is treated as zero or not.
     * @param {boolean} value
     * @returns boolean
     */
    setTreatEmptyStringAsZero(value) {
        this.treatEmptyStringAsZero = value;
    }
    /**
     * To get whether the empty string is treated as zero or not.
     * @returns boolean
     */
    getTreatEmptyStringAsZero() {
        return this.treatEmptyStringAsZero;
    }
    /**
     * To set the date separator to split the date value.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    setParseDateTimeSeparator(value) {
        this.parseDateTimeSeparator = value;
    }
    /**
     * To provide the array of modules needed.
     * @hidden
     */
    requiredModules() {
        return getModules(this);
    }
    /**
     * Dynamically injects the required modules to the library.
     * @hidden
     */
    static Inject(...moduleList) {
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (let j = 0; j < moduleList.length; j++) {
            if (this.prototype.injectedModules.indexOf(moduleList[j]) === -1) {
                this.prototype.injectedModules.push(moduleList[j]);
            }
        }
    }
    /**
     * Get injected modules
     * @hidden
     */
    getInjectedModules() {
        return this.injectedModules;
    }
    onPropertyChanged(newProp, oldProp) {
        /** code snippets */
    }
    getModuleName() {
        return 'calculate';
    }
    /** @hidden */
    getFormulaCharacter() {
        return '=';
    }
    /** @hidden */
    isUpperChar(text) {
        let charCode = text.charCodeAt(0);
        return ((charCode > 64) && (charCode < 91));
    }
    resetKeys() {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    }
    /**
     * @hidden
     */
    updateDependentCell(cellRef) {
        let family = this.getSheetFamilyItem(this.grid);
        let cell = this.cell;
        if (family.sheetNameToParentObject !== null) {
            let token = family.parentObjectToToken.get(this.grid);
            if (cell.indexOf(this.sheetToken) === -1) {
                cell = token + cell;
            }
            if (cellRef.indexOf(this.sheetToken) === -1) {
                cellRef = token + cellRef;
            }
        }
        if (this.getDependentCells().has(cellRef)) {
            let formulaCells = this.getDependentCells().get(cellRef);
            if (formulaCells.indexOf(cell) < 0) {
                formulaCells.push(cell);
            }
        }
        else {
            this.getDependentCells().set(cellRef, [cell]);
        }
    }
    /**
     * @hidden
     */
    getDependentCells() {
        if (this.isSheetMember()) {
            let family = this.getSheetFamilyItem(this.grid);
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
    }
    /**
     * @hidden
     */
    getDependentFormulaCells() {
        if (this.isSheetMember()) {
            let family = this.getSheetFamilyItem(this.grid);
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
    }
    /**
     * To get library formulas collection.
     * @returns Map<string, Function>
     */
    getLibraryFormulas() {
        return this.lFormulas;
    }
    /**
     * To get library function.
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns Function
     */
    getFunction(libFormula) {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        }
        else {
            return null;
        }
    }
    getFormulaInfoTable() {
        if (this.isSheetMember()) {
            let family = this.getSheetFamilyItem(this.grid);
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
    }
    /**
     * To get the formula text.
     * @private
     */
    getFormula(key) {
        key = key.toUpperCase();
        if (this.storedData.has(key)) {
            return this.storedData.get(key).getFormulaText();
        }
        return '';
    }
    /**
     * To get the formula text.
     * @returns void
     */
    getParseDecimalSeparator() {
        let seperator = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    }
    /**
     * To get the formula text.
     * @param {string} value - Specifies the decimal separator value.
     * @returns void
     */
    setParseDecimalSeparator(value) {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    }
    /** @hidden */
    getSheetToken(cellRef) {
        let i = 0;
        let temp = this.emptyString;
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
    }
    /** @hidden */
    getSheetID(grd) {
        let family = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            let token = family.parentObjectToToken.get(grd);
            token = token.split(this.sheetToken).join(this.emptyString);
            let id = this.parseFloat(token);
            if (!this.isNaN(id)) {
                return id;
            }
        }
        return -1;
    }
    /** @hidden */
    parseFloat(value) {
        return Number(value);
    }
    /**
     * To get the row index of the given cell.
     * @param {string} cell - Cell address for getting row index.
     * @returns number
     */
    rowIndex(cell) {
        let i = 0;
        let result;
        let isLetter = false;
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
    }
    /**
     * To get the column index of the given cell.
     * @param {string} cell - Cell address for getting column index.
     * @returns number
     */
    colIndex(cell) {
        let j = 0;
        let k = 0;
        cell = cell.toUpperCase();
        if (j < cell.length && cell[j] === this.sheetToken) {
            j++;
            while (j < cell.length && cell[j] !== this.sheetToken) {
                j++;
            }
            j++;
        }
        while (j < cell.length && this.isChar(cell[j])) {
            let charCode = cell[j].charCodeAt(0);
            k = k * 26 + charCode - 64;
            j++;
        }
        if (k === 0) {
            return -1;
        }
        return k;
    }
    /**
     * To get the valid error strings.
     * @hidden
     */
    getErrorStrings() {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!'];
        }
        return this.errorStrings;
    }
    /** @hidden */
    substring(text, startIndex, length) {
        return text.substring(startIndex, length + startIndex);
    }
    /** @hidden */
    isChar(c) {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    }
    /** @hidden */
    getSheetFamilyItem(model) {
        if (this.sheetFamilyID === 0) {
            if (this.defaultFamilyItem == null) {
                this.defaultFamilyItem = new CalcSheetFamilyItem();
            }
            return this.defaultFamilyItem;
        }
        if (this.sheetFamiliesList == null) {
            this.sheetFamiliesList = new Map();
        }
        let i = this.modelToSheetID.get(model);
        if (!this.sheetFamiliesList.has(i)) {
            this.sheetFamiliesList.set(i, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(i);
    }
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns void
     */
    setKeyValue(key, value) {
        key = key.toUpperCase();
        let str = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf(this.leftBrace) === 0) {
            this.storedData.set(key, new FormulaInfo());
            this.keyToRowsMap.set(key, this.keyToRowsMap.size + 1);
            this.rowsToKeyMap.set(this.rowsToKeyMap.size + 1, key);
        }
        let fInfo = this.storedData.get(key);
        if (fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() !== str) {
            let s1 = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            let formulaDependent = this.getDependentFormulaCells().get(s1);
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
    }
    /**
     * @hidden
     */
    clearFormulaDependentCells(cell) {
        let dependentFormula = this.getDependentFormulaCells().get(cell);
        if (dependentFormula != null) {
            dependentFormula.forEach((value, key) => {
                let s = key;
                let dependent = this.getDependentCells().get(s);
                this.arrayRemove(dependent, cell);
                if (dependent.length === 0) {
                    this.getDependentCells().delete(s);
                }
            });
            this.getDependentFormulaCells().delete(cell);
        }
    }
    arrayRemove(array, value) {
        let index = null;
        while (index !== -1) {
            index = array.indexOf(value);
            array.splice(index, 1);
        }
        return array;
    }
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for getting the corresponding value.
     * @returns string | number
     */
    getKeyValue(key) {
        key = key.toUpperCase();
        if (this.storedData.has(key) !== null) {
            let fInfo = this.storedData.get(key);
            let fText = fInfo.getFormulaText();
            if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
                this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
                fText = fText.substring(1);
                try {
                    fInfo.setParsedFormula(this.parser.parseFormula(fText, key));
                }
                catch (ex) {
                    let args = {
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
                    let args = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    let errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
                }
            }
            return this.storedData.get(key).getFormulaValue();
        }
        else {
            return this.emptyString;
        }
    }
    getNamedRanges() {
        return this.namedRanges;
    }
    /**
     * Adds a named range to the NamedRanges collection.
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @param {number} sheetIndex - Defined scope for the specified name. Default - Workbook scope.
     * @returns boolean
     */
    addNamedRange(name, range) {
        let sheetScopeName = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            let family = this.getSheetFamilyItem(this.grid);
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
    }
    /**
     * Remove the specified named range form the named range collection.
     * @param {string} name - Name of the specified named range.
     * @returns boolean
     */
    removeNamedRange(name) {
        name = name.toUpperCase();
        if (this.namedRanges.get(name) != null) {
            this.namedRanges.delete(name);
            return true;
        }
        return false;
    }
    /** @hidden */
    convertAlpha(col) {
        let arrCol = [];
        let n = 0;
        let charText = 'A';
        while (col > 0) {
            col--;
            let aCharValue = charText.charCodeAt(0);
            arrCol[n] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        return arrCol.join('');
    }
    /** @hidden */
    getCellCollection(cellRange) {
        if (cellRange.indexOf(':') < 0 && !this.isCellReference(cellRange)) {
            return cellRange.split(this.getParseArgumentSeparator());
        }
        let i = cellRange.indexOf(':');
        let row1;
        let row2;
        let col1;
        let col2;
        if (i > 0 && this.isChar(cellRange[i - 1])) {
            let k = i - 2;
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
        let cells = [];
        let j;
        let c = 0;
        for (i = row1; i <= row2; i++) {
            for (j = col1; j <= col2; j++) {
                cells[c] = this.emptyString + this.convertAlpha(j) + i.toString();
                c++;
            }
        }
        return cells;
    }
    /**
     * Compute the given formula.
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns string | number
     */
    computeFormula(formulaText) {
        let parsedText;
        let lastIndexOfq;
        let formulatResult;
        let nestedFormula = false;
        let fNested;
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
                let i = lastIndexOfq + 1;
                while (i > -1) {
                    if (parsedText[i] !== this.rightBracket) {
                        i++;
                        continue;
                    }
                    let sFormula = parsedText.substring(lastIndexOfq, i + 1);
                    let libFormula = sFormula.split(this.leftBracket)[0].split('q').join(this.emptyString);
                    let args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                        .split(this.getParseArgumentSeparator());
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.name] :
                        this.getFunction(libFormula)(...args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        let q = this.findLastIndexOfq(fNested);
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
            let args = { message: ex.message, exception: ex, isForceCalculable: false, computeForceCalculate: false };
            this.trigger('onFailure', args);
            let errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
            formulatResult = (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
        }
        return formulatResult;
    }
    /** @hidden */
    computeSumIfAndAvgIf(range) {
        if (isNullOrUndefined(range) || range[0] === this.emptyString || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr = range;
        let argCount = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let rangevalue = argArr[0];
        let criteria = argCount > 2 ? argArr[2].trim() : argArr[1].trim();
        criteria = criteria.split(this.tic).join(this.emptyString);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        let opt = this.parser.tokenEqual;
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
        let checkCriteria = this.parseFloat(criteria);
        let criteriaRangeArray = argCount === 2 ? rangevalue : argArr[1];
        let sumRange = this.getCellCollection(argArr[0]);
        let criteriaRange = this.getCellCollection(criteriaRangeArray);
        let result = this.getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, opt);
        return [result[0], result[1]];
    }
    /** @hidden */
    computeLookup(range) {
        if (range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let checkCrte = [];
        let findMaxVal = [];
        let argArr = range;
        let argCount = argArr.length;
        let criterias = argArr[0].split(this.tic).join(this.emptyString);
        let rangevalue = argArr[1];
        let lookupRangeArray = argCount === 2 ? rangevalue : argArr[2];
        let criteriaRange = this.getCellCollection(argArr[1]);
        let lookupRange = this.getCellCollection(lookupRangeArray);
        for (let i = 0; i < criteriaRange.length; i++) {
            findMaxVal[i] = this.getValueFromArg(criteriaRange[i]).split(this.tic).join('');
        }
        let s = findMaxVal.toString().split(this.getParseArgumentSeparator());
        let maxVal = this.parseFloat(s[s.sort().length - 1]);
        let minVal = this.parseFloat(s[0]);
        for (let j = 0; j < criteriaRange.length; j++) {
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
                let index = findMaxVal.indexOf(maxVal.toString());
                return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
            }
        }
        if (findMaxVal.indexOf(criterias) < 0) {
            let temp = [];
            for (let n = 0; n < s.length; n++) {
                if (this.parseFloat(criterias) > this.parseFloat(s[n])) {
                    temp.push(s[n]);
                }
            }
            let index = findMaxVal.indexOf(temp[temp.length - 1]);
            return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
        }
        return this.getErrorStrings()[CommonErrors.na];
    }
    computeVLookup(range) {
        let argArr = range;
        let findMaxValue = [];
        let lookupValue = argArr[0].split(this.tic).join('');
        if (lookupValue.indexOf(':') > -1) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        if (this.isCellReference(lookupValue)) {
            lookupValue = this.getValueFromArg(lookupValue);
        }
        if (argArr[1].indexOf(':') < -1) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        let lookupRange = [];
        let firstCol = '';
        let secCol = '';
        if (this.isCellReference(argArr[1])) {
            lookupRange = this.getCellCollection(argArr[1]);
            if (argArr[1].indexOf(':') > -1) {
                let index = argArr[1].indexOf(':');
                for (let i = 0; i < index; i++) {
                    let tempCell = this.isChar(argArr[1][i]) ? argArr[1][i] : '';
                    firstCol = firstCol + tempCell;
                }
                for (let j = index; j < argArr[1].length; j++) {
                    let tempCell2 = this.isChar(argArr[1][j]) ? argArr[1][j] : '';
                    secCol = secCol + tempCell2;
                }
            }
        }
        let lookupCol = this.colIndex(firstCol) + this.parseFloat(argArr[2]);
        if (lookupCol > this.colIndex(secCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        if (lookupCol === this.colIndex(firstCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        let lookupCell = this.convertAlpha(lookupCol);
        argArr[3] = isNullOrUndefined(argArr[3]) ? this.trueValue : argArr[3].split(this.tic).join('');
        let cellValue = '';
        for (let i = 0; i < lookupRange.length; i++) {
            findMaxValue[i] = this.getValueFromArg(lookupRange[i]).split(this.tic).join('');
        }
        let s = findMaxValue.toString().split(this.getParseArgumentSeparator());
        let maxValue = this.parseFloat(s[s.sort().length - 1]);
        let minValue = this.parseFloat(s[0]);
        for (let j = 0; j < lookupRange.length; j++) {
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
                    let index = findMaxValue.indexOf(maxValue.toString());
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
    }
    findWildCardValue(lookVal, cellValue) {
        let finalText = '';
        if (lookVal.indexOf('?') > -1) {
            let index = lookVal.indexOf('?');
            let checStr1 = lookVal[index - 1];
            let checStr2 = lookVal[index + 1];
            if (cellValue.indexOf(checStr1) > -1 && cellValue.indexOf(checStr2) > -1) {
                let newIndex = cellValue.indexOf(checStr1);
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
            let index = lookVal.indexOf('*');
            let left = '';
            let right = '';
            let compRight = this.falseValue;
            let compLeft = this.falseValue;
            for (let i = index - 1; i >= 0; i--) {
                left = left + lookVal[i];
                compLeft = this.trueValue;
            }
            for (let i = index + 1; i < lookVal.length; i++) {
                right = right + lookVal[i];
                compRight = this.trueValue;
            }
            let leftVal = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            let rightVal = right === '' ? -1 : cellValue.indexOf(right);
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
    }
    /** @hidden */
    /* tslint:disable-next-line */
    getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, op) {
        let sum = 0;
        let count = 0;
        switch (op) {
            case this.parser.tokenEqual:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (value === criteria && val === checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLess:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (val < checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreater:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (val > checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLessEq:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (val <= checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreaterEq:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (val >= checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenNotEqual:
                {
                    for (let i = 0; i < criteriaRange.length; i++) {
                        let value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        let val = this.parseFloat(value);
                        if (value !== criteria && val !== checkCriteria) {
                            let value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            let val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
        }
        return [sum, count];
    }
    /** @hidden */
    computeAndOr(args, op) {
        let result = op === 'and' ? true : false;
        let value;
        let parseVal;
        if (args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let l = 0, len = args.length; l < len; l++) {
            if (args[l].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        let ranges = args;
        for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.value];
            }
            if (ranges[i].indexOf(':') > -1 && this.isCellReference(ranges[i])) {
                let cells = this.getCellCollection(ranges[i]);
                for (let j = 0; j < cells.length; j++) {
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
                let tempdate = Date.parse(value.split(this.tic).join(''));
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
    }
    /** @hidden */
    // To strip out the tic from the formula arguments.
    removeTics(text) {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    }
    /* tslint:disable-next-line:max-func-body-length */
    computeValue(pFormula) {
        try {
            let stack = [];
            let i = 0;
            let sheet = '';
            stack.length = 0;
            while (i < pFormula.length) {
                let uFound = pFormula[i] === 'u'; // for 3*-2
                if (pFormula[i] === this.arithMarker) {
                    i = i + 1;
                    continue;
                }
                else if (this.isDigit(pFormula[i])) {
                    let s = this.emptyString;
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
                    let s = this.emptyString;
                    let textName = '';
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
                    let leftIdx = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    let j = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
                    pFormula = this.substring(pFormula, i + leftIdx + 2, j - 1);
                }
                else if (pFormula[i] === this.tic[0]) {
                    let s = pFormula[i].toString();
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s.split(this.tic).join(this.emptyString));
                    i = i + 1;
                }
                else if (pFormula[i] === '%' && stack.length > 0) {
                    let stackValue = stack[0];
                    let value = this.parseFloat(stackValue);
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
                    let s = pFormula[i].toString();
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
                                let errIndex = 0;
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
                                let s = '';
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
                let s = this.emptyString;
                let countValue = stack.length;
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
    }
    getValArithmetic(stack, operator) {
        let num1 = stack.pop();
        num1 = num1 === this.emptyString ? '0' : num1;
        let num = parseInt(num1, 10);
        if (this.isNaN(num)) {
            throw this.getErrorStrings()[CommonErrors.value];
        }
        let num2 = stack.pop();
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
    }
    /** @hidden */
    processLogical(stack, operator) {
        let val1;
        let val2;
        let value1;
        let value2;
        if (operator !== 'and' && operator !== 'equal') {
            val1 = stack.pop();
            val2 = stack.pop();
            value1 = val1.indexOf(this.tic) > -1 ? val1 : this.parseFloat(val1);
            value2 = val2.indexOf(this.tic) > -1 ? val2 : this.parseFloat(val2);
        }
        let result;
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
    }
    /** @hidden */
    computeStoreCells(sCell) {
        let cellValue = sCell.cellValue;
        let cellRanges = sCell.cellRange;
        let criterias = sCell.criteria;
        let argArr = sCell.argArray;
        let isCriteria = sCell.isCriteria;
        let storeCell = sCell.storedCells;
        let isCountIfs = sCell.isCountIfS;
        let i = sCell.countVal;
        let rangeLength = isCriteria === this.trueValue ? storeCell : cellValue;
        let tempStoredCell = [];
        for (let j = 0; j < rangeLength.length; j++) {
            let stack = [];
            let cellVal = this.getValueFromArg(cellValue[j]);
            let criteria;
            let newCell = '';
            criteria = argArr[2].split(this.tic).join(this.emptyString);
            isCriteria = isCountIfs === this.trueValue ? this.trueValue : isCriteria;
            if (isCriteria === this.trueValue) {
                let cell = '';
                let count = 0;
                let newCount = 0;
                storeCell[j] = isCountIfs === this.trueValue && i === 0 ? cellValue[j] : storeCell[j];
                cell = storeCell[j];
                // convert the new cell ranges  for find in range with criteria.
                while (!this.isDigit(cell[count])) {
                    count = count + 1;
                }
                if (this.isCellReference(cellRanges[i]) && cellRanges[i].indexOf(':') > -1) {
                    let k = cellRanges[i].indexOf(':');
                    newCell = this.substring(cellRanges[i], k);
                    while (!this.isDigit(newCell[newCount])) {
                        newCount = newCount + 1;
                    }
                }
                let cellAlpha = this.substring(cell, count);
                let newCellAlpha = this.substring(newCell, newCount);
                newCell = storeCell[j].split(cellAlpha).join(newCellAlpha);
                cellVal = this.getValueFromArg(newCell);
                criteria = isCountIfs === this.trueValue ? criterias[i].split(this.tic).join(this.emptyString) :
                    criterias[i - 1].split(this.tic).join(this.emptyString);
            }
            let op = 'equal';
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
    }
    computeIfsFormulas(range, isCountIfs, isAvgIfs) {
        if (isNullOrUndefined(range) || range[0] === '' || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr = range;
        let argCount = argArr.length;
        if (argCount < 2 || argCount > 127) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellRanges = [];
        let criterias = [];
        let storedCell = [];
        let storedCellLength = 0;
        let sum = 0;
        for (let i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                cellRanges.push(argArr[i]);
            }
            else {
                criterias.push(argArr[i]);
            }
        }
        cellRanges = cellRanges.toString().split(',,').join(',');
        cellRanges = cellRanges.split(this.getParseArgumentSeparator());
        let cellvalue;
        let isCriteria;
        if (isCountIfs === this.falseValue) {
            isCriteria = this.falseValue;
            cellvalue = this.getCellCollection(cellRanges[1]);
            let sCell = {
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
        let startRange;
        startRange = isCountIfs === this.trueValue ? 0 : 2;
        for (let i = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i]);
            let sCell = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        for (let j = 0; j < storedCell.length; j++) {
            // convert the new cell ranges  for find sum in range 0(first range)
            let cell = '';
            let newCell = '';
            let count = 0;
            let newCount = 0;
            cell = storedCell[j];
            while (!this.isDigit(cell[count])) {
                count = count + 1;
            }
            if (this.isCellReference(cellRanges[0]) && cellRanges[0].indexOf(':') > -1) {
                let k = cellRanges[0].indexOf(':');
                newCell = this.substring(cellRanges[0], k);
                while (!this.isDigit(newCell[newCount])) {
                    newCount = newCount + 1;
                }
            }
            let cellAlpha = this.substring(cell, count);
            let newCellAlpha = this.substring(newCell, newCount);
            cellvalue = storedCell[j].split(cellAlpha).join(newCellAlpha);
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            }
            else {
                let argValue = this.getValueFromArg(cellvalue);
                sum = sum + parseFloat(argValue === '' ? '0' : argValue);
            }
        }
        if (isAvgIfs === this.trueValue) {
            sum = sum / cellvalue.length;
        }
        return sum;
    }
    processNestedFormula(pText, sFormula, fResult) {
        let lastIndexq = this.findLastIndexOfq(pText);
        let interiorCalcFString = pText.split(sFormula).join('n' + fResult);
        return interiorCalcFString;
    }
    /** @hidden */
    isNaN(value) {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    }
    /** @hidden */
    fromOADate(doubleNumber) {
        let result = new Date();
        result.setTime((doubleNumber * this.millisecondsOfaDay) + Date.parse(this.oaDate.toString()));
        return result;
    }
    /** @hidden */
    getSerialDateFromDate(year, month, day) {
        let days = 0;
        if (year < 1900) {
            year += 1900;
        }
        let isValidMonth = false;
        while (!isValidMonth) {
            while (month > 12) {
                year++;
                month -= 12;
            }
            isValidMonth = true;
            let tempDay = new Date(year, month, 1, -1).getDate();
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
        let dateTime = Date.parse(year.toString() + this.getParseDateTimeSeparator() + month.toString() +
            this.getParseDateTimeSeparator() + day.toString());
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    }
    /** @hidden */
    toOADate(dateTime) {
        let result = (dateTime.getTime() - Date.parse(this.oaDate.toString())) / this.millisecondsOfaDay;
        return result;
    }
    /** @hidden */
    calculateDate(date) {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    }
    /** @hidden */
    isTextEmpty(s) {
        return s === null || s === '';
    }
    /** @hidden */
    isDigit(text) {
        let charCode = text.charCodeAt(0);
        if ((charCode > 47) && (charCode < 58)) {
            return true;
        }
        return false;
    }
    findLastIndexOfq(fString) {
        return fString.lastIndexOf('q');
    }
    /**
     * To get the exact value from argument.
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns string
     */
    getValueFromArg(arg) {
        arg = arg.trim();
        let s = arg;
        let dateTime = this.dateTime1900;
        let pObjCVal = s;
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
        let symbolArray = ['+', '-', '/', '*', ')', ')', '{'];
        if ((this.parser.indexOfAny(s, symbolArray) === -1 && this.isUpperChar(s[0])) || s[0] === this.sheetToken) {
            if (s !== this.trueValue && s !== this.falseValue && this.isCellReference(s)) {
                let f = this.getSheetFamilyItem(this.grid);
                if (f.sheetNameToParentObject !== null && f.sheetNameToParentObject.size > 0 && s.indexOf(this.sheetToken) === -1) {
                    let token = f.parentObjectToToken.get(this.grid);
                    s = token + s;
                }
            }
            if (s === this.cell) {
                let dependent = this.getDependentCells().get(s);
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
    }
    /* tslint:disable-next-line */
    isDate(date) {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            let dateval = new Date(Date.parse(date));
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
    }
    isValidCellReference(text) {
        let start = 0;
        let end = 0;
        let j = 0;
        let numArr = [89, 71, 69];
        let cellTxt = this.emptyString;
        if (this.namedRanges.has(text)) {
            return false;
        }
        for (let i = 0; i < text.length; i++) {
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
            let cellNum = this.parseFloat(text.substring(end, text.length));
            if (cellNum < 1048576) { // Maximum number of rows in excel.
                return true;
            }
        }
        return false;
    }
    /** @hidden */
    /* tslint:disable-next-line */
    parseDate(date) {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            let d = parseInt(date, 10);
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
    }
    /** @hidden */
    isCellReference(args) {
        if (args === this.emptyString) {
            return false;
        }
        args = args.trim();
        args = this.setTokensForSheets(args);
        let sheetToken1 = this.getSheetToken(args);
        let containsBoth = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join(this.emptyString);
        }
        let isAlpha = false;
        let isNum = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        let charArray = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
        for (let c = 0; c < charArray.length; c++) {
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
    }
    /** @hidden */
    setTokensForSheets(text) {
        let family = this.getSheetFamilyItem(this.grid);
        let sortedSheetNamesCollection = this.getSortedSheetNames();
        if (sortedSheetNamesCollection != null) {
            for (let n = 0; n < sortedSheetNamesCollection.length; n++) {
                let token = family.sheetNameToToken.get(sortedSheetNamesCollection[n]);
                token = token.split(this.sheetToken).join(this.tempSheetPlaceHolder);
                let s = '"' + sortedSheetNamesCollection[n].toUpperCase() + '"' + this.sheetToken;
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
    }
    getParentObjectCellValue(val) {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        let i = val.lastIndexOf(this.sheetToken);
        let row = 0;
        let col = 0;
        let grid = this.grid;
        let family = this.getSheetFamilyItem(grid);
        if (i > -1 && family.tokenToParentObject !== null) {
            this.grid = family.tokenToParentObject.get(val.substring(0, i + 1));
            row = this.rowIndex(val);
            col = this.colIndex(val);
        }
        else if (i === -1) {
            let j = 0;
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
        let saveCell = (this.cell === '' || this.cell === null) ? '' : this.cell;
        this.cell = val;
        if (saveCell === this.cell) {
            throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference];
        }
        let cValue = this.getParentCellValue(row, col, this.grid);
        this.grid = grid;
        this.cell = saveCell;
        return cValue;
    }
    getParentCellValue(row, col, grd) {
        let cValue;
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
    }
    /**
     * Getting the formula result.
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns string
     */
    getValueRowCol(grid, row, col) {
        let key = this.rowsToKeyMap.get(row).toString();
        let result = this.getKeyValue(key).toString();
        if (result != null && result[result.length - 1] === ('%') && result.length > 1) {
            let d = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    }
    /**
     * To add custom library formula.
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns void
     */
    defineFunction(formulaName, functionName) {
        if (typeof functionName === 'string') {
            functionName = getValue(functionName, window);
        }
        formulaName = formulaName.toUpperCase();
        this.libraryFormulas.set(formulaName, { handler: functionName, isCustom: true });
    }
    /**
     * Specifies when changing the value.
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     */
    valueChanged(grid, changeArgs, isCalculate) {
        let pgrid = grid;
        this.grid = grid;
        let isComputedValueChanged = true;
        let isCompute = true;
        let calcFamily = this.getSheetFamilyItem(pgrid);
        let cellTxt = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            let token = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        let argVal = changeArgs.getValue().toUpperCase();
        if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > -1 ||
            argVal.indexOf('RANDBETWEEN(') > -1 || this.randomValues.has(cellTxt)) {
            let randStrVal = this.randCollection.toString();
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
            let formula;
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
                    let cValue = this.computeFormula(formula.getParsedFormula());
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
    }
    /** @hidden */
    getComputedValue() {
        if (this.computedValues === null) {
            this.computedValues = new Map();
        }
        return this.computedValues;
    }
    /**
     * @hidden
     */
    setValueRowCol(value, formulaValue, row, col) {
        /* No Implementation */
    }
    getSortedSheetNames() {
        let family = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            let arr = [];
            family.sheetNameToToken.forEach((value, key) => {
                arr.push(key);
                arr.sort();
            });
            this.sortedSheetNames = arr;
            this.sortedSheetNames.sort();
        }
        return this.sortedSheetNames;
    }
    /** @hidden */
    getErrorLine(error) {
        /* tslint:disable-next-line */
        let errorStack = error.stack ? error.stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    }
    /** @hidden */
    createSheetFamilyID() {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    }
    /** @hidden */
    computeMinMax(args, operation) {
        let result;
        let argVal;
        let countStrVal = 0;
        if (isNullOrUndefined(args) || args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let k = 0, len = args.length; k < len; k++) {
            if (args[k].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        result = (operation === 'max') ? this.minValue : this.maxValue;
        let argArr = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        for (let i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                let cellValue = this.getCellCollection(argArr[i]);
                for (let j = 0; j < cellValue.length; j++) {
                    argVal = this.getValueFromArg(cellValue[j]);
                    if (this.getErrorStrings().indexOf(argVal) > -1) {
                        return argVal;
                    }
                    let cellVal = this.parseFloat(argVal);
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
                let val;
                val = this.getValueFromArg(argArr[i]);
                if (this.getErrorStrings().indexOf(val) > -1) {
                    return val;
                }
                let cellVal = this.parseFloat(val);
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
    }
    /** @hidden */
    calculateAvg(args) {
        let sumCell = 0;
        let argArr = args;
        let cellVal = [];
        let avgVal = 0;
        let countNum = 0;
        let countNum1 = 0;
        for (let k = 0; k < argArr.length; k++) {
            if (argArr[k].indexOf(':') > -1 && this.isCellReference(argArr[k])) {
                countNum = 0;
                cellVal = this.getCellCollection(argArr[k]);
                avgVal = 0;
                for (let i = 0; i < cellVal.length; i++) {
                    let value = this.getValueFromArg(cellVal[i]);
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
                let value = this.getValueFromArg(argArr[k].split(this.tic).join(''));
                if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                    return this.getErrorStrings()[CommonErrors.name];
                }
                sumCell = sumCell + this.parseFloat(value);
            }
        }
        return (sumCell / (argArr.length - countNum1)).toString();
    }
    /**
     * @hidden
     */
    registerGridAsSheet(refName, model, sheetFamilyID) {
        if (isNullOrUndefined(this.modelToSheetID)) {
            this.modelToSheetID = new Map();
        }
        if (isNullOrUndefined(this.modelToSheetID.get(model))) {
            this.modelToSheetID.set(model, sheetFamilyID);
        }
        let family = this.getSheetFamilyItem(model);
        family.isSheetMember = true;
        let tempRef = refName.toUpperCase();
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
            let token = family.sheetNameToToken.get(tempRef);
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
        }
        else {
            let token = this.sheetToken + this.tokenCount.toString() + this.sheetToken;
            this.tokenCount++;
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
            family.sheetNameToToken.set(tempRef, token);
            family.sheetNameToParentObject.set(tempRef, model);
        }
        return refName;
    }
    /**
     * @hidden
     */
    unregisterGridAsSheet(refName, model) {
        let family = this.getSheetFamilyItem(model);
        let refName1 = refName.toUpperCase();
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.has(refName1)) {
            family.sheetNameToParentObject.delete(refName1);
            let token = family.sheetNameToToken.get(refName1);
            family.sheetNameToToken.delete(refName1);
            family.tokenToParentObject.delete(token);
            family.parentObjectToToken.delete(model);
        }
    }
    ;
    isSheetMember() {
        let family = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    }
    /**
     * To dispose the calculate engine.
     * @returns void
     */
    dispose() {
        this.resetKeys();
        // this.dependentCells.clear();
        // this.dependentFormulaCells.clear();
        this.namedRanges.clear();
        // this.sheetFamiliesList.clear();
        this.lFormulas.clear();
    }
    refreshRandValues(cellRef) {
        let rowIdx;
        let colIdx;
        let value;
        let tokenRef = '';
        let stringCollection = this.randCollection.toString();
        let family;
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
        for (let i = 0; i < this.randomValues.size; i++) {
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
    }
    refresh(cellRef) {
        if (this.dependencyLevel === 0) {
            this.refreshedCells.clear();
        }
        if (this.getDependentCells().has(cellRef) && this.getDependentCells().get(cellRef) !== null) {
            let family = this.getSheetFamilyItem(this.grid);
            this.dependencyLevel = this.dependencyLevel + 1;
            try {
                let dependentCells = this.getDependentCells().get(cellRef);
                let i;
                for (i = 0; i < dependentCells.length; i++) {
                    let dCell = dependentCells[i];
                    let token = this.getSheetToken(dCell);
                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                    }
                    try {
                        let rowIdx = this.rowIndex(dCell);
                        let colIdx = this.colIndex(dCell);
                        let formulaInfo = this.getFormulaInfoTable().get(dCell);
                        let result;
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
    }
};
__decorate$4([
    Property(true)
], Calculate.prototype, "includeBasicFormulas", void 0);
__decorate$4([
    Event$1()
], Calculate.prototype, "onFailure", void 0);
Calculate = Calculate_1 = __decorate$4([
    NotifyPropertyChanges
], Calculate);
/** @hidden */
class FormulaError {
    constructor(errorMessage, formulaAutoCorrection) {
        this.formulaCorrection = false;
        this.message = errorMessage;
        this.formulaCorrection = formulaAutoCorrection;
    }
}
/** @hidden */
class FormulaInfo {
    constructor() {
        /**
         * @hidden
         */
        this.calcID = Number.MIN_VALUE + 1;
        this.calcID1 = Number.MIN_VALUE + 1;
    }
    /**
     * @hidden
     */
    getFormulaText() {
        return this.formulaText;
    }
    /**
     * @hidden
     */
    setFormulaText(value) {
        this.formulaText = value;
    }
    /**
     * @hidden
     */
    getFormulaValue() {
        return this.formulaValue;
    }
    /**
     * @hidden
     */
    setFormulaValue(value) {
        this.formulaValue = value;
    }
    /**
     * @hidden
     */
    getParsedFormula() {
        return this.parsedFormula;
    }
    /**
     * @hidden
     */
    setParsedFormula(value) {
        this.parsedFormula = value;
    }
}
/** @hidden */
class CalcSheetFamilyItem {
    constructor() {
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
}
/**
 * @hidden
 */
function getAlphalabel(col) {
    let cols = [];
    let n = 0;
    let charText = 'A';
    while (col > 0 && n < 9) {
        col--;
        let aCharNo = charText.charCodeAt(0);
        cols[n] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    let chs = [];
    for (let i = 0; i < n; i++) {
        chs[n - i - 1] = cols[i];
    }
    return chs.join('');
}
class ValueChangedArgs {
    constructor(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.getRowIndex = () => {
            return row;
        };
        this.setRowIndex = (value) => {
            row = value;
        };
        this.getColIndex = () => {
            return col;
        };
        this.setColIndex = (value) => {
            col = value;
        };
        this.getValue = () => {
            return value;
        };
        this.setValue = (value) => {
            value = value;
        };
        return this;
    }
}

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
class WorkbookFormula {
    /**
     * Constructor for formula module in Workbook.
     * @private
     */
    constructor(workbook) {
        this.parent = workbook;
        this.init();
    }
    init() {
        this.addEventListener();
        this.initCalculate();
        this.registerSheet();
        this.initiateDefinedNames();
    }
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
        }
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'workbookFormula';
    }
    initCalculate() {
        this.calculateInstance = new Calculate(this.parent);
        this.calcID = this.calculateInstance.createSheetFamilyID();
        this.calculateInstance.setTreatEmptyStringAsZero(true);
        this.calculateInstance.grid = this.parent.getActiveSheet().id.toString();
    }
    performFormulaOperation(args) {
        let action = args.action;
        let formulas = this.calculateInstance.getLibraryFormulas();
        let formulaInfo = (Array.from(formulas.values()));
        switch (action) {
            case 'getLibraryFormulas':
                args.formulaCollection = Array.from(formulas.keys());
                break;
            case 'getFormulaCategory':
                let collection = ['All'];
                for (let i = 1; i < Array.from(formulas.values()).length; i++) {
                    if (collection.indexOf(formulaInfo[i].category) < 0) {
                        collection.push(formulaInfo[i].category);
                    }
                }
                args.categoryCollection = collection;
                break;
            case 'dropDownSelectFormulas':
                for (let i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectCategory === formulaInfo[i].category) {
                        args.formulaCollection[i] = Array.from(formulas.keys())[i];
                    }
                }
                break;
            case 'getFormulaDescription':
                for (let i = 0; i < Array.from(formulas.values()).length; i++) {
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
    }
    registerSheet(sheetIndex = 0, sheetCount = this.parent.sheets.length) {
        let id;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.registerGridAsSheet(id, id, this.calcID);
            sheetIndex++;
        }
    }
    unRegisterSheet(sheetIndex = 0, sheetCount = this.parent.sheets.length) {
        let id;
        this.calculateInstance.tokenCount = 0;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.unregisterGridAsSheet(id, id);
            sheetIndex++;
        }
    }
    refreshCalculate(rowIdx, colIdx, value, isFormula, sheetIdx) {
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetTab;
        }
        sheetIdx--;
        let sheetName = getSheet(this.parent, sheetIdx).id + '';
        if (isFormula) {
            let cellArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            let referenceCollection = this.calculateInstance.randCollection;
            if (this.calculateInstance.isRandomVal === true) {
                let rowId;
                let colId;
                let refValue = '';
                if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
                    referenceCollection.length) {
                    for (let i = 0; i < this.calculateInstance.randomValues.size; i++) {
                        rowId = this.calculateInstance.rowIndex(referenceCollection[i]);
                        colId = this.calculateInstance.colIndex(referenceCollection[i]);
                        refValue = this.calculateInstance.randomValues.get(referenceCollection[i]);
                        sheetName = (parseFloat(this.calculateInstance.getSheetToken(referenceCollection[i]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                        let tempArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        }
        else {
            let family = this.calculateInstance.getSheetFamilyItem(sheetName);
            let cellRef = getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
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
    }
    autoCorrectFormula(formula) {
        if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
            formula += ')';
        }
        return formula;
    }
    initiateDefinedNames() {
        let definedNames = this.parent.definedNames;
        let len = definedNames.length;
        let i = 0;
        while (i < len) {
            let definedname = definedNames[i];
            this.addDefinedName(definedname);
            i++;
        }
    }
    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    addDefinedName(definedName) {
        let isAdded = true;
        let sheetIdx = null;
        let name = definedName.name;
        let refersTo = definedName.refersTo;
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
    }
    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    removeDefinedName(name, scope) {
        let isRemoved = false;
        let index = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            let calcName = name;
            if (scope) {
                let sheetIdx = getSheetIndex(this.parent, scope);
                if (sheetIdx) {
                    calcName = getSheetName(this.parent, sheetIdx - 1) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            this.parent.definedNames.splice(index, 1);
            isRemoved = true;
        }
        return isRemoved;
    }
    checkIsNameExist(name, sheetName) {
        let isExist = this.parent.definedNames.some((key) => {
            return key.name === name && (sheetName ? key.scope === sheetName : key.scope === '');
        });
        return isExist;
    }
    getIndexFromNameColl(definedName, scope = '') {
        let index = -1;
        this.parent.definedNames.filter((name, idx) => {
            if (name.name === definedName && name.scope === scope) {
                index = idx;
            }
        });
        return index;
    }
    toFixed(value) {
        let num = Number(value);
        if (Math.round(num) !== num) {
            value = num.toFixed(2);
        }
        return value;
    }
    aggregateComputation(args) {
        let sheet = this.parent.getActiveSheet();
        let range = sheet.selectedRange;
        let indexes = getRangeIndexes(range.split(':')[1]);
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = `A1:${getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex)}`;
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count) {
            return;
        }
        args.Sum = this.toFixed(this.calculateInstance.getFunction('SUM')(range));
        args.Avg = this.toFixed(this.calculateInstance.getFunction('AVERAGE')(range));
        args.Min = this.toFixed(this.calculateInstance.getFunction('MIN')(range));
        args.Max = this.toFixed(this.calculateInstance.getFunction('MAX')(range));
    }
}

/**
 * The `WorkbookSort` module is used to handle sort action in Spreadsheet.
 */
class WorkbookSort {
    /**
     * Constructor for WorkbookSort module.
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(initiateSort, this.initiateSortHandler, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateSort, this.initiateSortHandler);
        }
    }
    /**
     * Sorts range of cells in the sheet.
     * @param args - arguments for sorting.
     */
    initiateSortHandler(args) {
        let validateArgs = {
            range: args.range,
            isValid: true
        };
        let isSingleCell = false;
        this.parent.notify(validateSortRange, validateArgs);
        if (!validateArgs.isValid) {
            return;
        }
        let sheet = this.parent.getActiveSheet();
        let address = args.range || sheet.selectedRange;
        let range = getSwapRange(getIndexesFromAddress(address));
        let sortOptions = args.sortOptions || { sortDescriptors: {}, containsHeader: true };
        let containsHeader = sortOptions.containsHeader;
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //if selected range is a single cell 
            range[0] = 0;
            range[1] = 0;
            range[2] = sheet.usedRange.rowIndex - 1;
            range[3] = sheet.usedRange.colIndex;
            isSingleCell = true;
            containsHeader = isNullOrUndefined(sortOptions.containsHeader) ? true : sortOptions.containsHeader;
        }
        let sRIdx = containsHeader ? range[0] + 1 : range[0];
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
        let sCIdx;
        let eCIdx;
        let cell = getCellIndexes(sheet.activeCell);
        let header = 'Column ' + getColumnHeaderText(cell[1] + 1);
        let sortDescriptors = sortOptions.sortDescriptors;
        this.getDataRange(range, sheet, containsHeader).then((jsonData) => {
            let dataManager = new DataManager(jsonData);
            let query = new Query();
            if (Array.isArray(sortDescriptors)) { //multi-column sorting.
                if (!sortDescriptors || sortDescriptors.length === 0) {
                    sortDescriptors = [{ field: header }];
                }
                for (let length = sortDescriptors.length, i = length - 1; i > -1; i--) {
                    if (!sortDescriptors[length - 1].field) {
                        sortDescriptors[length - 1].field = header;
                    }
                    if (!sortDescriptors[i].field) {
                        continue;
                    }
                    let comparerFn = sortDescriptors[i].sortComparer || this.sortComparer.bind(this, sortDescriptors[i]);
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
                let comparerFn = sortDescriptors.sortComparer || this.sortComparer.bind(this, sortDescriptors);
                query.sortBy(sortDescriptors.field, comparerFn);
            }
            dataManager.executeQuery(query).then((e) => {
                let colName;
                let cell = {};
                Array.prototype.forEach.call(e.result, (data) => {
                    sCIdx = range[1];
                    eCIdx = range[3];
                    for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                        colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                        cell = data[colName];
                        setCell(sRIdx, sCIdx, sheet, cell);
                    }
                    sRIdx++;
                });
                let eventArgs = {
                    range: getRangeAddress(range),
                    sortOptions: sortOptions
                };
                this.parent.trigger('sortComplete', eventArgs);
                this.parent.notify(sortComplete, eventArgs);
            });
        });
    }
    /**
     * Compares the two cells for sorting.
     * @param sortDescriptor - protocol for sorting.
     * @param x - first cell
     * @param y - second cell
     */
    sortComparer(sortDescriptor, x, y) {
        let direction = sortDescriptor.order || '';
        let comparer = DataUtil.fnSort(direction);
        return comparer(x ? x.value : x, y ? y.value : y);
    }
    ;
    /**
     * Converts the range of cells to json data.
     * @param range - range array
     * @param sheet - model of the sheet
     */
    getDataRange(range, sheet, containsHeader) {
        let jsonData = [];
        let sRIdx = containsHeader ? range[0] + 1 : range[0];
        let eRIdx = range[2];
        let sCIdx;
        let eCIdx;
        let rowNum = 0;
        let sheetEx = sheet;
        let option = {
            sheet: sheetEx, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise: new Promise((resolve, reject) => { resolve((() => { })()); })
        };
        if (sheetEx.isLocalData && (range[0] === 0 || range[0] === 1) && range[2] === (sheet.rowCount - 1)) {
            this.parent.notify('updateSheetFromDataSource', option);
        }
        return option.promise.then(() => {
            for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
                sCIdx = range[1];
                eCIdx = range[3];
                let cells = {};
                let colName = '';
                for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
                    colName = 'Column ' + getColumnHeaderText(sCIdx + 1);
                    cells[colName] = getCell(sRIdx, sCIdx, sheet);
                    jsonData[rowNum.toString()] = cells;
                }
                rowNum++;
            }
            return jsonData;
        });
    }
    /**
     * Gets the module name.
     * @returns string
     */
    getModuleName() {
        return 'workbookSort';
    }
}

/**
 * Export Spreadsheet library modules
 */

/**
 * Workbook Cell format.
 */
class WorkbookCellFormat {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    format(args) {
        let sheet = this.parent.getActiveSheet();
        if (args.range === undefined) {
            args.range = sheet.selectedRange;
        }
        let indexes = args.range.length === 4 ? args.range : getSwapRange(getRangeIndexes(args.range));
        for (let i = indexes[0]; i <= indexes[2]; i++) {
            for (let j = indexes[1]; j <= indexes[3]; j++) {
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
    }
    textDecorationActionUpdate(args) {
        let sheet = this.parent.getActiveSheet();
        let indexes = getSwapRange(getRangeIndexes(sheet.selectedRange));
        let value = args.style.textDecoration;
        let changedValue = value;
        let activeCellIndexes = getRangeIndexes(sheet.activeCell);
        let cellValue = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
        let changedStyle;
        let removeProp = false;
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
        for (let i = indexes[0]; i <= indexes[2]; i++) {
            for (let j = indexes[1]; j <= indexes[3]; j++) {
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
    }
    addEventListener() {
        this.parent.on(setCellFormat, this.format, this);
        this.parent.on(textDecorationUpdate, this.textDecorationActionUpdate, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCellFormat, this.format);
            this.parent.off(textDecorationUpdate, this.textDecorationActionUpdate);
        }
    }
    /**
     * To destroy workbook cell format.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook cell format module name.
     */
    getModuleName() {
        return 'workbookcellformat';
    }
}

/**
 * The `WorkbookEdit` module is used to handle the editing functionalities in Workbook.
 */
class WorkbookEdit {
    /**
     * Constructor for edit module in Workbook.
     * @private
     */
    constructor(workbook) {
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
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(workbookEditOperation, this.performEditOperation, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookEditOperation, this.performEditOperation);
        }
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'workbookEdit';
    }
    performEditOperation(args) {
        let action = args.action;
        switch (action) {
            case 'updateCellValue':
                this.updateCellValue(args.address, args.value, args.sheetIndex, args.isValueOnly);
                break;
        }
    }
    checkDecimalPoint(value) {
        if (Number(value)) {
            let decIndex = value.toString().indexOf(this.decimalSep) + 1;
            let checkDec = value.toString().substr(decIndex).length <= 6;
            value = checkDec ? decIndex < 7 ? value : (parseFloat(value)).toFixed(0) : decIndex > 7 ? (parseFloat(value)).toFixed(0) :
                (parseFloat(value)).toFixed(6 - decIndex + 2);
        }
        return value;
    }
    updateCellValue(address, value, sheetIdx, isValueOnly = false) {
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetTab;
        }
        let range;
        if (typeof address === 'string') {
            range = getRangeIndexes(address);
        }
        else {
            range = address;
        }
        let sheet = getSheet(this.parent, sheetIdx - 1);
        if (!sheet.rows[range[0]]) {
            sheet.rows[range[0]] = {};
            sheet.rows[range[0]].cells = [];
        }
        if (!sheet.rows[range[0]].cells[range[1]]) {
            sheet.rows[range[0]].cells[range[1]] = {};
        }
        let cell = getCell(range[0], range[1], sheet);
        if (!isValueOnly) {
            let isFormula = checkIsFormula(value);
            if (!isFormula) {
                cell.formula = '';
                cell.value = value;
            }
            let eventArgs = {
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
            let dateEventArgs = {
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
    }
}

/**
 * Export Workbook action modules
 */

/**
 * Workbook basic module.
 * @private
 */
class WorkbookBasicModule {
    /**
     * Constructor for Workbook basic module.
     * @private
     */
    constructor() {
        Workbook.Inject(DataBind, WorkbookSave, WorkbookOpen, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookSort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'workbookBasic';
    }
    /**
     * Destroys the Workbook basic module.
     * @return {void}
     */
    destroy() {
        /* code snippet */
    }
}

/**
 * Workbook all module.
 * @private
 */
class WorkbookAllModule {
    /**
     * Constructor for Workbook all module.
     * @private
     */
    constructor() {
        Workbook.Inject(DataBind, WorkbookSave, WorkbookNumberFormat, WorkbookCellFormat, WorkbookEdit, WorkbookFormula, WorkbookOpen, WorkbookSort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'workbook-all';
    }
    /**
     * Destroys the Workbook all module.
     * @return {void}
     */
    destroy() {
        /* code snippet */
    }
}

/**
 * To get Workbook required modules.
 * @hidden
 * @param {Workbook} context
 */
function getWorkbookRequiredModules(context, modules = []) {
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

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the cell style.
 */
class CellStyle extends ChildProperty {
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
/**
 * Represents the DefineName.
 */
class DefineName extends ChildProperty {
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

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the cell.
 */
class Cell extends ChildProperty {
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
/**
 * @hidden
 */
function getCell(rowIndex, colIndex, sheet, isInitRow) {
    let row = getRow(sheet, rowIndex);
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
    let i;
    let top = 0;
    let left = 0;
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
    let defaultProps = { fontFamily: 'Calibri', verticalAlign: 'bottom', textIndent: '0pt', backgroundColor: '#ffffff',
        color: '#000000', textAlign: 'left', fontSize: '11pt', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' };
    let changedProps = {};
    Object.keys(defaultKey ? defaultProps : style).forEach((propName) => {
        if (style[propName] !== defaultProps[propName]) {
            changedProps[propName] = style[propName];
        }
    });
    return changedProps;
}

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
class Row extends ChildProperty {
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
    Object.keys(row).forEach((key) => {
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
function getRowsHeight(sheet, startRow, endRow = startRow) {
    let height = 0;
    let swap;
    if (startRow > endRow) {
        swap = startRow;
        startRow = endRow;
        endRow = swap;
    }
    for (let i = startRow; i <= endRow; i++) {
        height += getRowHeight(sheet, i);
    }
    return height;
}

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Column behavior for the spreadsheet.
 */
class Column extends ChildProperty {
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
function getColumnsWidth(sheet, startCol, endCol = startCol) {
    let width = 0;
    if (startCol > endCol) {
        let swap = startCol;
        startCol = endCol;
        endCol = swap;
    }
    for (let i = startCol; i <= endCol; i++) {
        width += getColumnWidth(sheet, i);
    }
    return width;
}

/**
 * Update data source to Sheet and returns Sheet
 * @hidden
 */
function getData(context, address) {
    return new Promise((resolve, reject) => {
        resolve((() => {
            let i;
            let row;
            let data = new Map();
            let sheet = getSheet(context, getSheetIndex(context, getSheetNameFromAddress(address)));
            let indexes = getIndexesFromAddress(address);
            let sRow = indexes[0];
            let args = {
                sheet: sheet, indexes: indexes, promise: new Promise((resolve, reject) => { resolve((() => { })()); })
            };
            context.notify('updateSheetFromDataSource', args);
            return args.promise.then(() => {
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
    let diff;
    let j;
    let prevIdx;
    if (isUndefined(model[idx]) || !(model[idx] && model[idx].index === idx)) {
        for (let i = 0; i <= idx; i++) {
            if (model && model[i]) {
                diff = model[i].index - i;
                if (diff > 0) {
                    model.forEach((value, index) => {
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
    let j;
    let diff;
    let cnt;
    let len = model.length;
    for (let i = 0; i < len; i++) {
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
    let sheet = getSheet(context, sheetIdx - 1);
    let range = getIndexesFromAddress(address);
    let sRIdx = range[0];
    let eRIdx = range[2];
    let sCIdx;
    let eCIdx;
    for (sRIdx; sRIdx <= eRIdx; sRIdx++) {
        sCIdx = range[1];
        eCIdx = range[3];
        for (sCIdx; sCIdx <= eCIdx; sCIdx++) {
            let cell = getCell(sRIdx, sCIdx, sheet);
            if (!isNullOrUndefined(cell) && valueOnly) {
                delete cell.value;
                if (!isNullOrUndefined(cell.formula)) {
                    delete cell.formula;
                }
            }
        }
    }
}

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
class RangeSetting extends ChildProperty {
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
/**
 * Used range which contains end row index and end column index of the last used cell in sheet .
 */
class UsedRange extends ChildProperty {
}
__decorate$1([
    Property(0)
], UsedRange.prototype, "rowIndex", void 0);
__decorate$1([
    Property(0)
], UsedRange.prototype, "colIndex", void 0);
/**
 * Configures the sheet behavior for the spreadsheet.
 */
class Sheet extends ChildProperty {
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
/**
 * To get sheet index from address.
 * @hidden
 */
function getSheetIndex(context, name) {
    let idx;
    for (let i = 0; i < context.sheets.length; i++) {
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
    let idx;
    for (let i = 0; i < context.sheets.length; i++) {
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
function updateSelectedRange(context, range, sheet = {}) {
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
    let name = [];
    context.sheets.forEach((sheet) => {
        name.push(sheet.name.toLowerCase());
    });
    for (let i = 0; i < name.length; i++) {
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
    let cnt = 0;
    sheets.forEach((sheet) => {
        cnt = Math.max(sheet.id, cnt);
    });
    return cnt + 1;
}
/**
 * @hidden
 */
function initSheet(context) {
    context.sheets.forEach((sheet) => {
        processIdx(sheet.columns);
        initRow(sheet.rows);
    });
    processIdx(context.sheets, true, context);
}
function initRow(rows) {
    rows.forEach((row) => {
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
function getSheetName(context, idx = context.activeSheetTab) {
    return getSheet(context, idx - 1).name;
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the Workbook.
 */
let Workbook = class Workbook extends Component {
    /**
     * Constructor for initializing the library.
     * @param options - Configures Workbook model.
     */
    constructor(options) {
        super(options);
        /**
         * To generate sheet name based on sheet count.
         * @hidden
         */
        this.sheetNameCount = 1;
        this.commonCellStyle = {};
        if (options && options.cellStyle) {
            this.commonCellStyle = options.cellStyle;
        }
        if (this.getModuleName() === 'workbook') {
            this.dataBind();
            this.initEmptySheet();
        }
    }
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    preRender() {
        if (!Object.keys(this.commonCellStyle).length) {
            this.commonCellStyle = skipDefaultValue(this.cellStyle, true);
        }
        if (this.getModuleName() === 'spreadsheet') {
            this.initEmptySheet();
        }
    }
    /**
     * For internal use only.
     * @returns void
     * @hidden
     */
    render() {
        /** code snippets */
    }
    /**
     * To provide the array of modules needed for workbook.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        return getWorkbookRequiredModules(this);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Applies the style (font family, font weight, background color, etc...) to the specified range of cells.
     * @param {CellStyleModel} style - Specifies the cell style.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    cellFormat(style, range) {
        let sheet = this.getActiveSheet();
        range = range || sheet.selectedRange;
        this.notify(setCellFormat, { style: style, range: range, refreshRibbon: range.indexOf(sheet.activeCell) > -1 ? true : false });
    }
    /** @hidden */
    getCellStyleValue(cssProps, indexes) {
        let cell = getCell(indexes[0], indexes[1], this.getActiveSheet());
        let style = {};
        cssProps.forEach((cssProp) => {
            style[cssProp] = this.cellStyle[cssProp];
            if (cell && cell.style && cell.style[cssProp]) {
                style[cssProp] = cell.style[cssProp];
            }
        });
        return style;
    }
    /**
     * Applies the number format (number, currency, percentage, short date, etc...) to the specified range of cells.
     * @param {string} format - Specifies the number format code.
     * @param {string} range? - Specifies the address for the range of cells.
     */
    numberFormat(format, range) {
        this.notify(applyNumberFormatting, { format: format, range: range });
    }
    /**
     * Used to create new sheet.
     * @hidden
     */
    createSheet(index) {
        let sheet = new Sheet(this, 'sheets', { id: getMaxSheetId(this.sheets), name: 'Sheet' + getSheetNameCount(this) }, true);
        if (index > -1) {
            this.sheets.splice(index, 0, sheet);
        }
        else {
            this.sheets.push(sheet);
        }
        this.setProperties({ 'sheet': this.sheets }, true);
        this.notify(sheetCreated, { sheetIndex: index | 0 });
        this.notify(workbookFormulaOperation, { action: 'registerSheet', sheetIndex: this.sheets.length - 1 });
    }
    /**
     * Used to remove sheet.
     * @hidden
     */
    removeSheet(idx) {
        this.sheets.splice(idx, 1);
    }
    /**
     * Destroys the Workbook library.
     */
    destroy() {
        this.notify(workbookDestroyed, null);
        super.destroy();
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {WorkbookModel} newProp
     * @param  {WorkbookModel} oldProp
     * @returns void
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cellStyle':
                    merge(this.commonCellStyle, skipDefaultValue(newProp.cellStyle));
                    break;
            }
        }
    }
    /**
     * Not applicable for workbook.
     * @hidden
     */
    appendTo(selector) {
        super.appendTo(selector);
    }
    initEmptySheet() {
        let len = this.sheets.length;
        if (len) {
            initSheet(this);
        }
        else {
            this.createSheet();
        }
    }
    /** @hidden */
    getActiveSheet() {
        return this.sheets[this.activeSheetTab - 1];
    }
    /**
     * Used for setting the used range row and column index.
     * @hidden
     */
    setUsedRange(rowIdx, colIdx) {
        let sheet = this.getActiveSheet();
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
    }
    /** @hidden */
    getRangeData(cellIndexes, sheetIdx) {
        let sheet;
        if (sheetIdx) {
            sheet = getSheet(this, sheetIdx - 1);
        }
        else {
            sheet = this.getActiveSheet();
        }
        let row = cellIndexes[0];
        let col = cellIndexes[1];
        let values = '';
        if (sheet.rows[row] && sheet.rows[row].cells[col]) {
            values = sheet.rows[row].cells[col].value;
        }
        return values;
    }
    /**
     * Gets the range of data as JSON from the specified address.
     * @param {string} address - Specifies the address for range of cells.
     */
    getData(address) {
        return getData(this, address);
    }
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    getModuleName() {
        return 'workbook';
    }
    /** @hidden */
    getValueRowCol(sheetIndex, rowIndex, colIndex) {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        let sheet = getSheet(this, sheetIndex - 1);
        let cell = getCell(rowIndex - 1, colIndex - 1, sheet);
        return (cell && cell.value) || '';
    }
    /** @hidden */
    setValueRowCol(sheetIndex, value, rowIndex, colIndex) {
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(workbookEditOperation, {
            action: 'updateCellValue', address: [rowIndex - 1, colIndex - 1], value: value,
            sheetIndex: sheetIndex, isValueOnly: true
        });
    }
    /**
     * Opens the specified excel file or stream.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    open(options) {
        this.notify(workbookOpen, options);
    }
    /**
     * Saves the Spreadsheet data to Excel file.
     * @param {SaveOptions} saveOptions - Options for saving the excel file.
     */
    save(saveOptions = {}) {
        if (this.allowSave) {
            let defaultProps = {
                url: this.saveUrl,
                fileName: saveOptions.fileName || 'Sample',
                saveType: 'Xlsx'
            };
            let eventArgs = Object.assign({}, defaultProps, saveOptions, { customParams: {}, isFullPost: true, needBlobData: false, cancel: false });
            this.trigger('beforeSave', eventArgs);
            if (!eventArgs.cancel) {
                this.notify(beginSave, {
                    saveSettings: eventArgs, isFullPost: eventArgs.isFullPost,
                    needBlobData: eventArgs.needBlobData, customParams: eventArgs.customParams
                });
            }
        }
    }
    /**
     * Sorts the range of cells in the active Spreadsheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    sort(sortOptions, range) {
        if (!this.allowSorting) {
            return;
        }
        let eventArgs = {
            range: range,
            sortOptions: sortOptions,
            cancel: false
        };
        this.notify(initiateSort, eventArgs);
    }
    /**
     * Adds the defined name to the Spreadsheet.
     * @param {DefineNameModel} definedName - Specifies the name.
     * @return {boolean} - Return the added status of the defined name.
     */
    addDefinedName(definedName) {
        let eventArgs = {
            action: 'addDefinedName',
            isAdded: false,
            definedName: definedName
        };
        this.notify(workbookFormulaOperation, eventArgs);
        return eventArgs.isAdded;
    }
    /**
     * Removes the defined name from the Spreadsheet.
     * @param {string} definedName - Specifies the name.
     * @param {string} scope - Specifies the scope of the defined name.
     * @return {boolean} - Return the removed status of the defined name.
     */
    removeDefinedName(definedName, scope = '') {
        let eventArgs = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName,
            scope: scope
        };
        this.notify(workbookFormulaOperation, eventArgs);
        return eventArgs.isRemoved;
    }
    /** @hidden */
    clearRange(address, sheetIndex, valueOnly = true) {
        address = address ? address : this.getActiveSheet().selectedRange;
        sheetIndex = sheetIndex ? sheetIndex : this.activeSheetTab;
        clearRange(this, address, sheetIndex, valueOnly);
    }
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
    let modules = [];
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
const ribbon = 'ribbon';
/** @hidden */
const formulaBar = 'formulaBar';
/** @hidden */
const sheetTabs = 'sheetTabs';
/** @hidden */
const refreshSheetTabs = 'refreshSheetTabs';
/** @hidden */
const dataRefresh = 'dataRefresh';
/** @hidden */
const initialLoad = 'initialLoad';
/** @hidden */
const contentLoaded = 'contentLoaded';
/** @hidden */
const mouseDown = 'mouseDown';
/** @hidden */
const spreadsheetDestroyed = 'spreadsheetDestroyed';
/** @hidden */
const editOperation = 'editOperation';
/** @hidden */
const formulaOperation = 'formulaOperation';
/** @hidden */
const formulaBarOperation = 'formulaBarOperation';
/** @hidden */
const click = 'click';
/** @hidden */
const keyUp = 'keyUp';
/** @hidden */
const keyDown = 'keyDown';
/** @hidden */
const formulaKeyUp = 'formulaKeyUp';
/** @hidden */
const formulaBarUpdate = 'formulaBarUpdate';
/** @hidden */
const onVerticalScroll = 'verticalScroll';
/** @hidden */
const onHorizontalScroll = 'horizontalScroll';
/** @hidden */
const beforeContentLoaded = 'beforeContentLoaded';
/** @hidden */
const beforeVirtualContentLoaded = 'beforeVirtualContentLoaded';
/** @hidden */
const virtualContentLoaded = 'virtualContentLoaded';
/** @hidden */
const contextMenuOpen = 'contextMenuOpen';
/** @hidden */
const cellNavigate = 'cellNavigate';
/** @hidden */
const mouseUpAfterSelection = 'mouseUpAfterSelection';
/** @hidden */
const selectionComplete = 'selectionComplete';
/** @hidden */
const cMenuBeforeOpen = 'contextmenuBeforeOpen';
/** @hidden */
const addSheetTab = 'addSheetTab';
/** @hidden */
const removeSheetTab = 'removeSheetTab';
/** @hidden */
const renameSheetTab = 'renameSheetTab';
/** @hidden */
const ribbonClick = 'ribboClick';
/** @hidden */
const refreshRibbon = 'ribbonRefresh';
/** @hidden */
const enableRibbonItems = 'enableRibbonItems';
/** @hidden */
const tabSwitch = 'tabSwitch';
/** @hidden */
const selectRange = 'selectRange';
/** @hidden */
const cut = 'cut';
/** @hidden */
const copy = 'copy';
/** @hidden */
const paste = 'paste';
/** @hidden */
const clearCopy = 'clearCopy';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const beforeDataBound = 'beforeDataBound';
/** @hidden */
const addContextMenuItems = 'addContextMenuItems';
/** @hidden */
const removeContextMenuItems = 'removeContextMenuItems';
/** @hidden */
const enableContextMenuItems = 'enableContextMenuItems';
/** @hidden */
const beforeRibbonCreate = 'beforeRibbonCreate';
/** @hidden */
const rowHeightChanged = 'rowHeightChanged';
/** @hidden */
const colWidthChanged = 'colWidthChanged';
/** @hidden */
const beforeHeaderLoaded = 'beforeHeaderLoaded';
/** @hidden */
const onContentScroll = 'onContentScroll';
/** @hidden */
const deInitProperties = 'deInitProperties';
/** @hidden */
const activeSheetChanged = 'activeSheetChanged';
/** @hidden */
const renameSheet = 'renameSheet';
/** @hidden */
const enableToolbar = 'enableToolbar';
/** @hidden */
const initiateCustomSort = 'initiateCustomSort';

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
function getUpdateUsingRaf(fn) {
    requestAnimationFrame(() => {
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
    let width = 30;
    if (index.toString().length > 3) {
        width = index.toString().length * 10;
    }
    return width;
}
let scrollAreaWidth = null;
/** @hidden */
function getScrollBarWidth() {
    if (scrollAreaWidth !== null) {
        return scrollAreaWidth;
    }
    let htmlDivNode = document.createElement('div');
    let result = 0;
    htmlDivNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(htmlDivNode);
    result = (htmlDivNode.offsetWidth - htmlDivNode.clientWidth) | 0;
    document.body.removeChild(htmlDivNode);
    return scrollAreaWidth = result;
}
let classes = ['e-ribbon', 'e-formula-bar-panel', 'e-sheet-tab-panel', 'e-header-toolbar'];
/** @hidden */
function getSiblingsHeight(element, classList = classes) {
    let previous = getHeightFromDirection(element, 'previous', classList);
    let next = getHeightFromDirection(element, 'next', classList);
    return previous + next;
}
function getHeightFromDirection(element, direction, classList) {
    // tslint:disable-next-line:no-any
    let sibling = element[direction + 'ElementSibling'];
    let result = 0;
    while (sibling) {
        if (classList.some((value) => sibling.classList.contains(value))) {
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
        let topIdx = context.viewport.topIndex;
        let leftIdx = context.viewport.leftIndex;
        let bottomIdx = topIdx + context.viewport.rowCount + context.getThreshold('row') * 2;
        let rightIdx = leftIdx + context.viewport.colCount + context.getThreshold('col') * 2;
        let inView = topIdx <= range[0] && bottomIdx >= range[2] && leftIdx <= range[1] && rightIdx >= range[3];
        if (inView) {
            return true;
        }
        if (isModify) {
            if (range[0] < topIdx && range[2] < topIdx || range[0] > bottomIdx && range[2] > bottomIdx) {
                return false;
            }
            else {
                if (range[0] < topIdx && range[2] > topIdx) {
                    range[0] = topIdx;
                    inView = true;
                }
                if (range[2] > bottomIdx) {
                    range[2] = bottomIdx;
                    inView = true;
                }
            }
            if (range[1] < leftIdx && range[3] < leftIdx || range[1] > rightIdx && range[3] > rightIdx) {
                return false;
            }
            else {
                if (range[1] < leftIdx && range[3] > leftIdx) {
                    range[1] = leftIdx;
                    inView = true;
                }
                if (range[3] > rightIdx) {
                    range[3] = rightIdx;
                    inView = true;
                }
            }
        }
        return inView;
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
    let swapRange = getSwapRange(range);
    let cellPosition = getCellPosition(sheet, swapRange);
    let attrs = {
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
    requestAnimationFrame(() => {
        styles.forEach((style) => {
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
const config = {
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    busy: 'aria-busy',
    colcount: 'aria-colcount'
};
/** @hidden */
function setAriaOptions(target, options) {
    let props = Object.keys(options);
    props.forEach((name) => {
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
        let compObj = getComponent(element, component);
        if (compObj) {
            compObj.destroy();
        }
    }
}

/**
 * Represents clipboard support for Spreadsheet.
 */
class Clipboard {
    constructor(parent) {
        this.parent = parent;
        this.init();
        this.addEventListener();
    }
    init() {
        this.parent.element
            .appendChild(this.parent.createElement('input', { className: 'e-clipboard', attrs: { 'contenteditable': 'true' } }));
    }
    addEventListener() {
        let ele = this.getClipboardEle();
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
    }
    removeEventListener() {
        let ele = this.getClipboardEle();
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
    }
    ribbonClickHandler(args) {
        let parentId = this.parent.element.id;
        switch (args.item.id) {
            case parentId + '_cut':
                this.cut({ isClick: true });
                break;
            case parentId + '_copy':
                this.copy({ isClick: true });
                break;
        }
        this.parent.element.focus();
    }
    tabSwitchHandler(args) {
        if (args.idx === 1 && !this.copiedInfo) {
            this.hidePaste();
        }
    }
    cMenuBeforeOpenHandler(e) {
        if (e.target === 'Content' || e.target === 'Header') {
            let l10n = this.parent.serviceLocator.getService(locale);
            this.parent.enableContextMenuItems([l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial')], this.copiedInfo ? true : false);
        }
    }
    rowHeightChanged(args) {
        if (this.copiedInfo && this.copiedInfo.range[0] > args.rowIdx) {
            let ele = this.parent.element.getElementsByClassName('e-copy-indicator')[0];
            ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
        }
    }
    cut(args) {
        this.setCopiedInfo(args, true);
    }
    copy(args) {
        this.setCopiedInfo(args, false);
    }
    paste(args) {
        if (this.parent.isEdit) {
            if (args && args.type) {
                args.preventDefault();
                document.getElementById(this.parent.element.id + '_edit').focus();
                return;
            }
        }
        /* tslint:disable-next-line */
        let isExternal = !this.copiedInfo && ((args && args.clipboardData) || window['clipboardData']);
        let copiedIdx = this.getCopiedIdx();
        if (this.copiedInfo || isExternal) {
            let cell;
            let isExtend;
            let cSIdx = (args && args.sIdx > -1) ? args.sIdx : this.parent.activeSheetTab - 1;
            let curSheet = getSheet(this.parent, cSIdx);
            let prevSheet = getSheet(this.parent, isExternal ? cSIdx : copiedIdx);
            let selIdx = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            let rows = isExternal && this.getExternalCells(args);
            if (isExternal && !rows.length) { // If image pasted
                return;
            }
            let rowIdx = selIdx[0];
            let cIdx = isExternal
                ? [0, 0, rows.length - 1, rows[0].cells.length - 1] : getSwapRange(this.copiedInfo.range);
            let isRepeative = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0
                && (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
            let rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            for (let i = cIdx[0], l = 0; i <= cIdx[2]; i++, l++) {
                for (let j = cIdx[1], k = 0; j <= cIdx[3]; j++, k++) {
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
                        for (let x = selIdx[0]; x <= selIdx[2]; x += (cIdx[2] - cIdx[0]) + 1) {
                            for (let y = selIdx[1]; y <= selIdx[3]; y += (cIdx[3] - cIdx[1] + 1)) {
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
    }
    setCell(rIdx, cIdx, sheet, cell, isExtend, isCut) {
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
    }
    getEmptyStyle(cellStyle) {
        let style = {};
        Object.keys(cellStyle).forEach((key) => {
            style[key] = '';
        });
        return style;
    }
    getCopiedIdx() {
        if (this.copiedInfo) {
            for (let i = 0; i < this.parent.sheets.length; i++) {
                if (this.parent.sheets[i].id === this.copiedInfo.sId) {
                    return i;
                }
            }
            this.clearCopiedInfo();
        }
        return -1;
    }
    setCopiedInfo(args, isCut) {
        if (this.parent.isEdit) {
            return;
        }
        let sheet = this.parent.getActiveSheet();
        let range = (args && args.range) || getRangeIndexes(sheet.selectedRange);
        let option = {
            sheet: sheet, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise: new Promise((resolve, reject) => { resolve((() => { })()); })
        };
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1)) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
        option.promise.then(() => {
            if (!(args && args.clipboardData)) {
                if (this.copiedInfo) {
                    this.clearCopiedInfo();
                }
                this.copiedInfo = {
                    range: range, sId: (args && args.sId) ? args.sId : sheet.id, isCut: isCut
                };
                this.hidePaste(true);
                this.initCopyIndicator();
                if (!Browser.isIE) {
                    this.getClipboardEle().select();
                }
                if (args && args.isClick) {
                    document.execCommand(isCut ? 'cut' : 'copy');
                }
                this.parent.hideSpinner();
            }
            if (Browser.isIE) {
                this.setExternalCells(args);
            }
        });
        if (args && args.clipboardData) {
            this.setExternalCells(args);
            this.parent.element.focus();
        }
    }
    clearCopiedInfo() {
        if (this.copiedInfo) {
            if (this.parent.getActiveSheet().id === this.copiedInfo.sId) {
                detach(this.parent.getMainContent().getElementsByClassName('e-copy-indicator')[0]);
            }
            this.copiedInfo = null;
            this.hidePaste();
        }
    }
    initCopyIndicator() {
        if (this.copiedInfo && this.parent.getActiveSheet().id === this.copiedInfo.sId) {
            let copyIndicator = this.parent.createElement('div', { className: 'e-copy-indicator' });
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            locateElem(copyIndicator, this.copiedInfo.range, this.parent.getActiveSheet());
            this.parent.getMainContent().appendChild(copyIndicator);
        }
    }
    showDialog() {
        this.parent.serviceLocator.getService(dialog).show({
            header: 'Spreadsheet',
            target: this.parent.element,
            height: 205, width: 340, isModal: true, showCloseIcon: true,
            content: this.parent.serviceLocator.getService(locale).getConstant('PasteAlert')
        });
    }
    hidePaste(isShow) {
        this.parent.notify(enableRibbonItems, { id: this.parent.element.id + '_paste', isEnable: isShow || false });
    }
    setExternalCells(args) {
        let cell;
        let text = '';
        let range = this.copiedInfo.range;
        let sheet = this.parent.getActiveSheet();
        let data = '<html><body><table xmlns="http://www.w3.org/1999/xhtml"><tbody>';
        for (let i = range[0]; i <= range[2]; i++) {
            data += '<tr>';
            for (let j = range[1]; j <= range[3]; j++) {
                data += '<td style="white-space:nowrap;vertical-align:bottom;';
                cell = getCell(i, j, sheet);
                if (cell && cell.style) {
                    Object.keys(cell.style).forEach((style) => {
                        let regex = style.match(/[A-Z]/);
                        data += (style === 'backgroundColor' ? 'background' : (regex ? style.replace(regex[0], '-'
                            + regex[0].toLowerCase()) : style)) + ':' + ((style === 'backgroundColor' || style === 'color')
                            ? cell.style[style].slice(0, 7) : cell.style[style]) + ';';
                    });
                }
                data += '">';
                if (cell && cell.value) {
                    let eventArgs = {
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
    }
    getExternalCells(args) {
        let html;
        let text;
        let rows = [];
        let cells = [];
        let cellStyle;
        let ele = this.parent.createElement('span');
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
            ele.querySelectorAll('tr').forEach((tr) => {
                tr.querySelectorAll('td').forEach((td, j) => {
                    cells[j] = { value: td.textContent, style: this.getStyle(td, ele) };
                });
                rows.push({ cells: cells });
                cells = [];
            });
        }
        else if (text) {
            if (html) {
                [].slice.call(ele.children).forEach((child) => {
                    if (child.getAttribute('style')) {
                        cellStyle = this.getStyle(child, ele);
                    }
                });
            }
            text.trim().split('\n').forEach((row) => {
                row.split('\t').forEach((col, j) => {
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
        setTimeout(() => { this.getClipboardEle().innerHTML = ''; }, 0);
        return rows;
    }
    getStyle(td, ele) {
        let styles = [];
        let cellStyle = {};
        if (td.classList.length || td.getAttribute('style')) {
            if (td.classList.length) {
                styles.push(ele.querySelector('style').innerHTML.split(td.classList[0])[1].split('{')[1].split('}')[0]);
            }
            if (td.getAttribute('style')) {
                styles.push(td.getAttribute('style'));
            }
            styles.forEach((styles) => {
                styles.split(';').forEach((style) => {
                    let char = style.split(':')[0].trim();
                    if (['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'background', 'font-weight', 'font-style',
                        'font-size', 'text-decoration'].indexOf(char) > -1) {
                        char = char === 'background' ? 'backgroundColor' : char;
                        let regex = char.match(/-[a-z]/);
                        cellStyle[regex ? char.replace(regex[0], regex[0].charAt(1).toUpperCase()) : char] = style.split(':')[1];
                    }
                });
            });
        }
        return cellStyle;
    }
    getClipboardEle() {
        return this.parent.element.getElementsByClassName('e-clipboard')[0];
    }
    getModuleName() {
        return 'clipboard';
    }
    destroy() {
        this.removeEventListener();
        let ele = this.getClipboardEle();
        detach(ele);
        this.parent = null;
    }
}

/**
 * The `Edit` module is used to handle the editing functionalities in Spreadsheet.
 */
class Edit {
    /**
     * Constructor for edit module in Spreadsheet.
     * @private
     */
    constructor(parent) {
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
    init() {
        this.addEventListener();
    }
    /**
     * To destroy the edit module.
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    }
    addEventListener() {
        EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
    }
    removeEventListener() {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
        }
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'edit';
    }
    performEditOperation(args) {
        let action = args.action;
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
    }
    keyUpHandler(e) {
        if (this.isEdit) {
            if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
        }
    }
    keyDownHandler(e) {
        let trgtElem = e.target;
        let keyCode = e.keyCode;
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
                let isAlphabet = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                let isNumeric = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                let isNumpadKeys = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                let isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND);
                if (!isSymbolkeys) {
                    isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                }
                let isFirefoxExceptionkeys = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                    (keyCode === this.keyCodes.FIREFOXMINUS);
                let isF2Edit = (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2);
                let isBackSpace = keyCode === this.keyCodes.BACKSPACE;
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
    }
    renderEditor() {
        if (!this.editorElem || !this.parent.element.querySelector('#' + this.parent.element.id + '_edit')) {
            let editor;
            editor = this.parent.createElement('div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit' });
            editor.contentEditable = 'true';
            editor.spellcheck = false;
            this.editorElem = editor;
            this.parent.element.querySelector('.e-main-content').appendChild(this.editorElem);
        }
        this.parent.notify(formulaOperation, { action: 'renderAutoComplete' });
    }
    refreshEditor(value, refreshFormulaBar, refreshEditorElem, isAppend, trigEvent = true) {
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
    }
    startEdit(address, value, refreshCurPos = true) {
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbar, { enable: false });
    }
    setCursorPosition() {
        let elem = this.editorElem;
        let textLen = elem.textContent.length;
        if (textLen) {
            let selection = document.getSelection();
            let range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    }
    hasFormulaSuggSelected() {
        let suggDdlElem = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    }
    editingHandler(action) {
        switch (action) {
            case 'delete':
                let address = this.parent.getActiveSheet().selectedRange;
                let range = getIndexesFromAddress(address);
                this.parent.clearRange(address, null, true);
                this.parent.serviceLocator.getService('cell').refreshRange(range);
                this.parent.notify(selectionComplete, {});
                break;
        }
    }
    mouseDownHandler(e) {
        if (this.isEdit) {
            let trgtElem = e.target;
            this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
            if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active')) {
                this.endEdit();
            }
        }
    }
    dblClickHandler(e) {
        let trgtElem = e.target;
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
    }
    updateEditCellDetail(addr, value) {
        let sheetIdx;
        let sheet;
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
        let range = getRangeIndexes(addr);
        let rowIdx = range[0];
        let colIdx = range[1];
        let cellElem = this.parent.getCell(rowIdx, colIdx);
        let cellPosition = getCellPosition(sheet, range);
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
    }
    initiateEditor(refreshCurPos) {
        let data = this.parent.getData(this.editCellData.fullAddr);
        data.then((values) => {
            values.forEach((cell, key) => {
                let args = { cell: cell, value: cell ? cell.value : '' };
                this.parent.notify(getFormattedBarText, args);
                let value = cell ? args.value : '';
                if (cell && cell.formula) {
                    value = cell.formula;
                }
                this.editCellData.oldValue = value;
                if (this.editCellData.value) {
                    value = this.editCellData.value;
                }
                else {
                    this.editCellData.value = value;
                }
                if (this.isNewValueEdit) {
                    value = '';
                }
                else {
                    this.isNewValueEdit = true;
                }
                if (value) {
                    this.refreshEditor(value, false, true, false, false);
                }
                if (refreshCurPos) {
                    this.setCursorPosition();
                }
                if (this.triggerEvent('cellEdit')) {
                    this.cancelEdit(true, false);
                }
            });
        });
    }
    positionEditor() {
        let tdElem = this.editCellData.element;
        tdElem.classList.add('e-ss-edited');
        let left = this.editCellData.position.left + 1;
        let top = this.editCellData.position.top + 1;
        let minHeight = this.editCellData.element.offsetHeight - 3;
        let minWidth = this.editCellData.element.offsetWidth - 3;
        let mainContElement = this.parent.getMainContent();
        let editWidth = mainContElement.offsetWidth - left - 28;
        //let editHeight: number = mainContElement.offsetHeight - top - 28;
        let inlineStyles = 'display:block;top:' + top + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
            'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;height:' + minHeight + 'px;';
        inlineStyles += tdElem.style.cssText;
        this.editorElem.setAttribute('style', inlineStyles);
        if (tdElem.classList.contains('e-right-align')) {
            this.editorElem.classList.add('e-right-align');
        }
        else if (tdElem.classList.contains('e-center-align')) {
            this.editorElem.classList.add('e-center-align');
        }
    }
    updateEditedValue(tdRefresh = true) {
        let oldCellValue = this.editCellData.oldValue;
        let oldValue = oldCellValue.toString().toUpperCase();
        if (oldCellValue !== this.editCellData.value || oldValue.indexOf('=RAND()') > -1 || oldValue.indexOf('RAND()') > -1 ||
            oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) {
            let cellIndex = getRangeIndexes(this.parent.getActiveSheet().activeCell);
            this.parent.notify(workbookEditOperation, { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            let cell = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet(), true);
            let eventArgs = this.getRefreshNodeArgs(cell);
            this.editCellData.value = eventArgs.result;
            if (tdRefresh) {
                this.parent.refreshNode(this.editCellData.element, eventArgs);
            }
        }
    }
    refreshDependentCellValue(rowIdx, colIdx, sheetIdx) {
        if (rowIdx && colIdx) {
            rowIdx--;
            colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetTab === sheetIdx) {
                let td = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    let sheet = getSheet(this.parent, sheetIdx - 1);
                    let cell = getCell(rowIdx, colIdx, sheet);
                    let eventArgs = this.getRefreshNodeArgs(cell);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    }
    getRefreshNodeArgs(cell) {
        cell = cell ? cell : {};
        let fCode = (cell && cell.format) ? cell.format : '';
        let eventArgs = {
            value: cell.value, format: fCode, onLoad: true,
            formattedText: '', isRightAlign: false, type: 'General'
        };
        let args;
        this.parent.notify(getFormattedCellObject, eventArgs);
        args = {
            isRightAlign: eventArgs.isRightAlign,
            result: eventArgs.formattedText,
            type: eventArgs.type,
            value: eventArgs.value,
            curSymbol: eventArgs.curSymbol
        };
        return args;
    }
    endEdit(refreshFormulaBar = false) {
        if (refreshFormulaBar) {
            this.refreshEditor(this.editCellData.oldValue, false, true, false, false);
        }
        this.updateEditedValue();
        this.triggerEvent('cellSave');
        this.resetEditState();
        this.focusElement();
    }
    cancelEdit(refreshFormulaBar = true, trigEvent = true) {
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave');
        }
        this.resetEditState();
        this.focusElement();
    }
    focusElement() {
        this.parent.element.focus();
        this.parent.notify(enableToolbar, { enable: true });
    }
    triggerEvent(eventName) {
        let eventArgs = {
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
    }
    altEnter() {
        let text;
        let textBefore;
        let textAfter;
        let selection = window.getSelection();
        let node = selection.anchorNode;
        let offset;
        let range = document.createRange();
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
    }
    resetEditState(elemRefresh = true) {
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
    }
}

/**
 * Represents selection support for Spreadsheet.
 */
class Selection {
    /**
     * Constructor for the Spreadsheet selection module.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        this.mouseMoveEvt = this.mouseMoveHandler.bind(this);
    }
    addEventListener() {
        this.parent.on(contentLoaded, this.init, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(virtualContentLoaded, this.virtualContentLoadedHandler, this);
        this.parent.on(cellNavigate, this.cellNavigateHandler, this);
        this.parent.on(selectRange, this.selectRange, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.init);
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(virtualContentLoaded, this.virtualContentLoadedHandler);
            this.parent.off(cellNavigate, this.cellNavigateHandler);
            this.parent.off(selectRange, this.selectRange);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
            this.parent.off(colWidthChanged, this.colWidthChanged);
        }
    }
    rowHeightChanged(args) {
        getUpdateUsingRaf(() => {
            let ele = this.getActiveCell();
            let cellIndex = getCellIndexes(this.parent.getActiveSheet().activeCell)[0];
            if (cellIndex === args.rowIdx && ele) {
                ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
            }
            else if (cellIndex > args.rowIdx && ele) {
                ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
            }
            ele = this.getSelectionElement();
            if (ele) {
                let selectedRange = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                let sRange = getSwapRange(selectedRange);
                let rowStart = sRange[0];
                let rowEnd = sRange[2];
                if (rowStart <= args.rowIdx && rowEnd >= args.rowIdx && ele) {
                    ele.style.height = `${parseInt(ele.style.height, 10) + args.threshold}px`;
                }
                else if (rowStart > args.rowIdx && ele) {
                    ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
                }
            }
        });
    }
    colWidthChanged(args) {
        getUpdateUsingRaf(() => {
            let ele = this.getActiveCell();
            let cellIndex = getCellIndexes(this.parent.getActiveSheet().activeCell)[1];
            if (cellIndex === args.colIdx && ele) {
                ele.style.width = `${parseInt(ele.style.width, 10) + args.threshold}px`;
            }
            else if (cellIndex > args.colIdx && ele) {
                ele.style.left = `${parseInt(ele.style.left, 10) + args.threshold}px`;
            }
            ele = this.getSelectionElement();
            let selectedRange = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            let sRange = getSwapRange(selectedRange);
            let colStart = sRange[1];
            let colEnd = sRange[3];
            if (colStart <= args.colIdx && colEnd >= args.colIdx && ele) {
                ele.style.width = `${parseInt(ele.style.width, 10) + args.threshold}px`;
            }
            else if (colStart > args.colIdx && ele) {
                ele.style.left = `${parseInt(ele.style.left, 10) + args.threshold}px`;
            }
        });
    }
    selectRange(indexes) {
        this.selectRangeByIdx(this.parent.selectionSettings.mode === 'Single' ? indexes.slice(0, 2).concat(indexes.slice(0, 2)) : indexes);
    }
    init() {
        let range = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        let sRange = getSwapRange(range);
        let actRange = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let inRange = sRange[0] <= actRange[0] && sRange[2] >= actRange[0] && sRange[1] <= actRange[1]
            && sRange[3] >= actRange[1];
        this.createSelectionElement();
        this.selectRangeByIdx(range, null, null, inRange);
    }
    createSelectionElement() {
        let cont = this.parent.getMainContent();
        let ele = this.parent.createElement('div', { className: 'e-selection' });
        let activeCell = this.parent.createElement('div', { className: 'e-active-cell' });
        cont.appendChild(ele);
        cont.appendChild(activeCell);
    }
    mouseDownHandler(e) {
        if (!this.parent.isEdit) {
            if (this.getSheetElement().contains(e.target) && !e.target.classList.contains('e-colresize')
                && !e.target.classList.contains('e-rowresize')) {
                let sheet = this.parent.getActiveSheet();
                let mode = this.parent.selectionSettings.mode;
                let rowIdx = this.getRowIdxFromClientY(getClientY(e));
                let colIdx = this.getColIdxFromClientX(getClientX(e));
                let activeIdx = getCellIndexes(sheet.activeCell);
                let isRowSelected = sheet.showHeaders && this.parent.getRowHeaderContent().contains(e.target);
                let isColSelected = sheet.showHeaders && this.parent.getColumnHeaderContent().contains(e.target);
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
    }
    mouseMoveHandler(e) {
        if (isTouchMove(e)) {
            e.preventDefault();
        }
        let sheet = this.parent.getActiveSheet();
        let cont = this.getScrollContent();
        let clientRect = cont.getBoundingClientRect();
        let clientX = getClientX(e);
        let clientY = getClientY(e);
        // remove math.min or handle top and left auto scroll
        let colIdx = this.isRowSelected ? sheet.colCount - 1 : this.getColIdxFromClientX(Math.min(clientX, clientRect.right));
        let rowIdx = this.isColSelected ? sheet.rowCount - 1 : this.getRowIdxFromClientY(Math.min(clientY, clientRect.bottom));
        let isScrollDown = clientY > clientRect.bottom && rowIdx < sheet.rowCount;
        let isScrollUp = clientY < clientRect.top && rowIdx >= 0 && !this.isColSelected;
        let isScrollRight = clientX > clientRect.right && colIdx < sheet.colCount;
        let isScrollLeft = clientX < clientRect.left && colIdx >= 0 && !this.isRowSelected;
        this.clearInterval();
        if (isScrollDown || isScrollUp || isScrollRight || isScrollLeft) {
            this.scrollInterval = setInterval(() => {
                if ((isScrollDown || isScrollUp) && !this.isColSelected) {
                    rowIdx = this.getRowIdxFromClientY(isScrollDown ? clientRect.bottom : clientRect.top);
                    if (rowIdx >= sheet.rowCount) { // clear interval when scroll up
                        this.clearInterval();
                        return;
                    }
                    cont.scrollTop += (isScrollDown ? 1 : -1) * getRowHeight(sheet, rowIdx);
                }
                if ((isScrollRight || isScrollLeft) && !this.isRowSelected) {
                    colIdx = this.getColIdxFromClientX(isScrollRight ? clientRect.right : clientRect.left);
                    if (colIdx >= sheet.colCount) { // clear interval when scroll left
                        this.clearInterval();
                        return;
                    }
                    cont.scrollLeft += (isScrollRight ? 1 : -1) * getColumnWidth(sheet, colIdx);
                }
                this.selectRangeByIdx([].concat(this.startCell, [rowIdx, colIdx]), e);
                // tslint:disable-next-line
            }, 100);
        }
        else {
            this.selectRangeByIdx([].concat(this.startCell ? this.startCell : getCellIndexes(sheet.activeCell), [rowIdx, colIdx]), e);
        }
    }
    mouseUpHandler(e) {
        let rowIdx = this.getRowIdxFromClientY(getClientY(e));
        let colIdx = this.getColIdxFromClientX(getClientX(e));
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
    }
    isSelected(rowIdx, colIdx) {
        let indexes = getSwapRange(getRangeIndexes(this.parent.getActiveSheet().selectedRange));
        return indexes[0] <= rowIdx && rowIdx <= indexes[2] && indexes[1] <= colIdx && colIdx <= indexes[3];
    }
    virtualContentLoadedHandler() {
        let sheet = this.parent.getActiveSheet();
        let indexes = getRangeIndexes(sheet.selectedRange);
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
    }
    clearInterval() {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
    }
    getScrollContent() {
        return this.parent.getMainContent();
    }
    getScrollLeft() {
        return this.parent.scrollModule ? this.parent.scrollModule.prevScroll.scrollLeft : 0;
    }
    cellNavigateHandler(args) {
        this.selectRangeByIdx(args.range.concat(args.range));
    }
    getColIdxFromClientX(clientX) {
        let width = 0;
        let sheet = this.parent.getActiveSheet();
        let cliRect = this.parent.getMainContent().getBoundingClientRect();
        let left = (this.parent.enableRtl ? (cliRect.right - clientX) : (clientX - cliRect.left)) + this.getScrollLeft();
        for (let i = 0;; i++) {
            width += getColumnsWidth(sheet, i);
            if (left < width) {
                return i;
            }
        }
    }
    getRowIdxFromClientY(clientY) {
        let height = 0;
        let sheet = this.parent.getActiveSheet();
        let top = (clientY - this.parent.getMainContent().getBoundingClientRect().top)
            + this.parent.getMainContent().scrollTop;
        for (let i = 0;; i++) {
            height += getRowHeight(sheet, i);
            if (top < height) {
                return i;
            }
        }
    }
    selectRangeByIdx(range, e, isScrollRefresh, isActCellChanged) {
        let ele = this.getSelectionElement();
        let sheet = this.parent.getActiveSheet();
        let args = { range: getRangeAddress(range), cancel: false };
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
    }
    UpdateRowColSelected(indexes) {
        let sheet = this.parent.getActiveSheet();
        this.isRowSelected = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        this.isColSelected = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
    }
    updateActiveCell(range) {
        let sheet = this.parent.getActiveSheet();
        let topLeftIdx = getRangeIndexes(sheet.topLeftCell);
        let rowIdx = this.isColSelected ? topLeftIdx[0] : range[0];
        let colIdx = this.isRowSelected ? topLeftIdx[1] : range[1];
        sheet.activeCell = getCellAddress(rowIdx, colIdx);
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        locateElem(this.getActiveCell(), getRangeIndexes(sheet.activeCell), sheet, this.parent.enableRtl);
        this.parent.notify(activeCellChanged, [rowIdx, colIdx]);
    }
    getSelectionElement() {
        return this.parent.element.getElementsByClassName('e-selection')[0];
    }
    getActiveCell() {
        return this.parent.getMainContent().getElementsByClassName('e-active-cell')[0];
    }
    getSheetElement() {
        return document.getElementById(this.parent.element.id + '_sheet');
    }
    highlightHdr(range, isRowRefresh = true, isColRefresh = true) {
        if (this.parent.getActiveSheet().showHeaders) {
            let rowHdr = [];
            let colHdr = [];
            let swapRange = getSwapRange(range);
            swapRange = this.getHdrIndexes(swapRange);
            let selectAll = this.parent.element.getElementsByClassName('e-select-all-cell')[0];
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
                document.getElementById(`${this.parent.element.id}_select_all`).classList.add('e-highlight');
            }
            if (swapRange[0] === 0) {
                selectAll.classList.add('e-prev-highlight-bottom');
            }
            if (swapRange[1] === 0) {
                selectAll.classList.add('e-prev-highlight-right');
            }
        }
    }
    getHdrIndexes(range) {
        if (this.parent.scrollSettings.enableVirtualization) {
            let indexes = [];
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
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'selection';
    }
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
}

/**
 * The `Scroll` module is used to handle scrolling behavior.
 * @hidden
 */
class Scroll {
    /**
     * Constructor for the Spreadsheet scroll module.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        this.initProps();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'scroll';
    }
    onContentScroll(e) {
        let target = this.parent.getMainContent();
        let scrollLeft = e.scrollLeft || target.scrollLeft;
        let top = e.scrollTop || target.scrollTop;
        let left = this.parent.enableRtl ? this.initScrollValue - scrollLeft : scrollLeft;
        let scrollArgs;
        let prevSize;
        if (this.prevScroll.scrollLeft !== left) {
            let scrollRight = left > this.prevScroll.scrollLeft;
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
            let scrollDown = top > this.prevScroll.scrollTop;
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
    }
    updateNonVirtualRows() {
        let sheet = this.parent.getActiveSheet();
        let threshold = this.parent.getThreshold('row');
        if (this.offset.top.idx > sheet.rowCount - (this.parent.viewport.rowCount + threshold)) {
            this.parent.renderModule.refreshUI({ colIndex: 0, direction: 'first', refresh: 'RowPart' }, `${getCellAddress(sheet.rowCount, 0)}:${getCellAddress(sheet.rowCount + threshold - 1, sheet.colCount - 1)}`);
            sheet.rowCount += threshold;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    }
    updateNonVirtualCols() {
        let sheet = this.parent.getActiveSheet();
        let threshold = this.parent.getThreshold('col');
        if (this.offset.left.idx > sheet.colCount - (this.parent.viewport.colCount + threshold)) {
            this.parent.renderModule.refreshUI({ rowIndex: 0, colIndex: sheet.colCount, direction: 'first', refresh: 'ColumnPart' }, `${getCellAddress(0, sheet.colCount)}:${getCellAddress(sheet.rowCount - 1, sheet.colCount + threshold - 1)}`);
            sheet.colCount += threshold;
            this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
        }
    }
    updateTopLeftCell() {
        this.parent.getActiveSheet().topLeftCell = getCellAddress(this.offset.top.idx, this.offset.left.idx);
        this.parent.setProperties({ 'sheets': this.parent.sheets }, true);
    }
    getRowOffset(scrollTop, scrollDown) {
        let temp = this.offset.top.size;
        let sheet = this.parent.getActiveSheet();
        let i = scrollDown ? this.offset.top.idx + 1 : (this.offset.top.idx ? this.offset.top.idx - 1 : 0);
        let count;
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
    }
    getColOffset(scrollLeft, width, increase) {
        let temp = width;
        let sheet = this.parent.getActiveSheet();
        let i = increase ? this.offset.left.idx + 1 : this.offset.left.idx - 1;
        let count;
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
    }
    wireEvents() {
        this.onScroll = this.onContentScroll.bind(this);
        EventHandler.add(this.parent.getMainContent(), 'scroll', this.onScroll, this);
        if (this.parent.enableRtl) {
            this.initScrollValue = this.parent.getMainContent().scrollLeft;
        }
    }
    initProps() {
        this.topIndex = 0;
        this.leftIndex = 0;
        this.prevScroll = { scrollLeft: 0, scrollTop: 0 };
        this.offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    }
    getThreshold() {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        if (Browser.info.name === 'mozilla') {
            return 0.5;
        }
        return 1;
    }
    /**
     * @hidden
     */
    setPadding() {
        if (!this.parent.allowScrolling) {
            return;
        }
        let colHeader = this.parent.getColumnHeaderContent();
        let rowHeader = this.parent.getRowHeaderContent();
        let scrollWidth = getScrollBarWidth() - this.getThreshold();
        let cssProps = this.parent.enableRtl ? { padding: 'paddingLeft', border: 'borderLeftWidth' }
            : { padding: 'paddingRight', border: 'borderRightWidth' };
        if (scrollWidth > 0) {
            colHeader.parentElement.style[cssProps.padding] = scrollWidth + 'px';
            colHeader.style[cssProps.border] = '1px';
            rowHeader.style.marginBottom = scrollWidth + 'px';
        }
    }
    addEventListener() {
        this.parent.on(contentLoaded, this.wireEvents, this);
        this.parent.on(onContentScroll, this.onContentScroll, this);
        this.parent.on(deInitProperties, this.initProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    destroy() {
        EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
        this.removeEventListener();
        this.parent = null;
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
            this.parent.off(onContentScroll, this.onContentScroll);
            this.parent.off(deInitProperties, this.initProps);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    }
}

/**
 * VirtualScroll module
 * @hidden
 */
class VirtualScroll {
    constructor(parent) {
        this.scroll = [];
        this.parent = parent;
        this.addEventListener();
    }
    getModuleName() {
        return 'virtualscroll';
    }
    createVirtualElement(args) {
        let sheet = this.parent.getActiveSheet();
        let container = this.parent.getMainContent();
        this.content = this.parent.createElement('div', { className: 'e-virtualable' });
        this.content.appendChild(container.querySelector('.e-table'));
        container.appendChild(this.content);
        let vTrack = container.appendChild(this.parent.createElement('div', { className: 'e-virtualtrack' }));
        let colVTrack;
        let rowVTrack;
        let height;
        let width;
        if (this.parent.sheets.length > this.scroll.length) {
            this.initScroll();
        }
        let domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
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
        let size = getColumnsWidth(sheet, 0, domCount - 1);
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
            this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
            container = this.parent.getColumnHeaderContent();
            this.colHeader = this.content.cloneNode();
            this.colHeader.appendChild(container.querySelector('.e-table'));
            container.appendChild(this.colHeader);
            colVTrack = container.appendChild(vTrack.cloneNode());
            this.colHeader.style.width = `${size}px`;
            rowVTrack.style.height = `${height}px`;
            colVTrack.style.width = `${width}px`;
            this.colHeader.style.transform = `translate(${this.translateX}px, 0px)`;
        }
        this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
        this.content.style.width = `${size}px`;
        vTrack.style.height = `${height}px`;
        vTrack.style.width = `${width}px`;
    }
    initScroll() {
        let i = 0;
        while (i < this.parent.sheets.length) {
            if (!this.scroll[i]) {
                this.scroll.push({ rowCount: 0, colCount: 0 });
            }
            i++;
        }
    }
    setScrollCount(count, layout) {
        let activeSheetIdx = this.parent.activeSheetTab - 1;
        if (!this.scroll[activeSheetIdx][layout + 'Count']) {
            this.scroll[activeSheetIdx][layout + 'Count'] = count;
        }
    }
    getAddress(topIdx) {
        return `${getCellAddress(topIdx[0], this.parent.viewport.leftIndex)}:${getCellAddress(topIdx[1], this.parent.viewport.leftIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2))}`;
    }
    getColAddress(leftIdx) {
        return `${getCellAddress(this.parent.viewport.topIndex, leftIdx[0])}:${getCellAddress(this.parent.viewport.topIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2), leftIdx[1])}`;
    }
    updateScrollCount(idx, layout, threshold = idx) {
        let sheet = this.parent.getActiveSheet();
        let rowCount = idx + this.parent.viewport[layout + 'Count'] + 1 + threshold;
        let usedRangeCount = this.scroll[this.parent.activeSheetTab - 1][layout + 'Count'];
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
    }
    onVerticalScroll(args) {
        let idx = args.cur.idx;
        let height = args.cur.size;
        let prevIdx = args.prev.idx;
        let idxDiff = Math.abs(idx - prevIdx);
        let threshold = this.parent.getThreshold('row');
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
                            let lastIdx = this.parent.viewport.topIndex + this.parent.viewport.rowCount + (threshold * 2);
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
    }
    checkLastIdx(idx, layout) {
        if (this.parent.scrollSettings.isFinite) {
            let count = this.parent.getActiveSheet()[layout + 'Count'] - 1;
            if (idx > count) {
                idx = count;
            }
        }
        return idx;
    }
    onHorizontalScroll(args) {
        let idx = args.cur.idx;
        let width = args.cur.size;
        let prevIdx = args.prev.idx;
        let idxDiff = Math.abs(idx - prevIdx);
        let threshold = this.parent.getThreshold('col');
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
                            let lastIdx = this.parent.viewport.leftIndex + this.parent.viewport.colCount + (threshold * 2);
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
    }
    getThresholdHeight(idx, threshold) {
        let height = 0;
        let sheet = this.parent.getActiveSheet();
        for (let i = idx; i < idx + threshold; i++) {
            height += getRowHeight(sheet, i);
        }
        return height;
    }
    getThresholdWidth(idx, threshold) {
        let width = 0;
        let sheet = this.parent.getActiveSheet();
        for (let i = idx; i < idx + threshold; i++) {
            width += getColumnWidth(sheet, i);
        }
        return width;
    }
    translate(args) {
        let sheet = this.parent.getActiveSheet();
        if (args.refresh === 'Row' || args.refresh === 'RowPart') {
            this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
            if (sheet.showHeaders) {
                this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
            }
        }
        if (args.refresh === 'Column' || args.refresh === 'ColumnPart') {
            let translateX = this.parent.enableRtl ? -this.translateX : this.translateX;
            this.content.style.transform = `translate(${translateX}px, ${this.translateY}px)`;
            if (sheet.showHeaders) {
                this.colHeader.style.transform = `translate(${translateX}px, 0px)`;
            }
        }
    }
    updateColumnWidth(args) {
        if (args.refresh === 'Column') {
            this.content.style.width = '';
            let width = this.content.querySelector('tr').getBoundingClientRect().width;
            if (this.parent.getActiveSheet().showHeaders) {
                this.colHeader.style.width = width + 'px';
            }
            this.content.style.width = width + 'px';
        }
    }
    updateUsedRange(args) {
        if (!this.scroll.length) {
            return;
        }
        let sheet = this.parent.getActiveSheet();
        if (args.update === 'row') {
            if (args.index > this.scroll[this.parent.activeSheetTab - 1].rowCount) {
                let height = this.getVTrackHeight('height');
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
                let width = this.getVTrackHeight('width');
                width += getColumnsWidth(sheet, this.scroll[this.parent.activeSheetTab - 1].colCount, args.index);
                this.scroll[this.parent.activeSheetTab - 1].colCount = args.index + 1;
                this.updateVTrack(this.colHeader, width, 'width');
                if (this.scroll[this.parent.activeSheetTab - 1].colCount > sheet.colCount) {
                    sheet.colCount = this.scroll[this.parent.activeSheetTab - 1].colCount;
                }
            }
        }
    }
    createHeaderElement(args) {
        this.rowHeader = this.content.cloneNode();
        this.colHeader = this.rowHeader.cloneNode();
        this.rowHeader.style.width = '';
        this.rowHeader.style.transform = `translate(0px, ${this.translateY}px)`;
        this.colHeader.style.transform = `translate(${this.parent.enableRtl ? -this.translateX : this.translateX}px, 0px)`;
        this.rowHeader.appendChild(args.element.querySelector('table'));
        args.element.appendChild(this.rowHeader);
        let container = this.parent.getColumnHeaderContent();
        this.colHeader.appendChild(container.querySelector('table'));
        container.appendChild(this.colHeader);
        let rowVTrack = this.content.nextElementSibling.cloneNode();
        let colVTrack = rowVTrack.cloneNode();
        rowVTrack.style.width = '';
        colVTrack.style.height = '';
        args.element.appendChild(rowVTrack);
        container.appendChild(colVTrack);
    }
    getVTrackHeight(str) {
        return parseInt(this.content.nextElementSibling.style[str], 10);
    }
    updateVTrackHeight(args) {
        let domCount = this.parent.viewport.rowCount + 1 + (this.parent.getThreshold('row') * 2);
        if (args.rowIdx >= domCount && args.rowIdx < this.scroll[this.parent.activeSheetTab - 1].rowCount) {
            this.updateVTrack(this.rowHeader, this.getVTrackHeight('height') + args.threshold, 'height');
        }
    }
    updateVTrackWidth(args) {
        if (args.colIdx < this.parent.getActiveSheet().colCount) {
            let hdrVTrack = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualtrack')[0];
            hdrVTrack.style.width = parseInt(hdrVTrack.style.width, 10) + args.threshold + 'px';
            let cntVTrack = this.parent.getMainContent().getElementsByClassName('e-virtualtrack')[0];
            cntVTrack.style.width = parseInt(cntVTrack.style.width, 10) + args.threshold + 'px';
            let hdrColumn = this.parent.getColumnHeaderContent().getElementsByClassName('e-virtualable')[0];
            hdrColumn.style.width = parseInt(hdrColumn.style.width, 10) + args.threshold + 'px';
            let cntColumn = this.parent.getMainContent().getElementsByClassName('e-virtualable')[0];
            cntColumn.style.width = parseInt(cntColumn.style.width, 10) + args.threshold + 'px';
        }
    }
    updateVTrack(header, size, sizeStr) {
        if (this.parent.getActiveSheet().showHeaders) {
            header.nextElementSibling.style[sizeStr] = `${size}px`;
        }
        this.content.nextElementSibling.style[sizeStr] = `${size}px`;
    }
    deInitProps() {
        this.parent.viewport.leftIndex = null;
        this.parent.viewport.topIndex = null;
        this.translateX = null;
        this.translateY = null;
    }
    updateScrollProps(args = { sheetIndex: 0 }) {
        if (this.scroll.length === 0) {
            this.initScroll();
        }
        else {
            this.scroll.splice(args.sheetIndex, 0, { rowCount: 0, colCount: 0 });
        }
    }
    sliceScrollProps(args) {
        if (isNullOrUndefined(args.sheetIndex)) {
            this.scroll.length = 0;
        }
        else {
            this.scroll.splice(args.sheetIndex, 1);
        }
    }
    addEventListener() {
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
    }
    destroy() {
        this.removeEventListener();
        this.rowHeader = null;
        this.colHeader = null;
        this.content = null;
        this.parent = null;
        this.scroll.length = 0;
        this.translateX = null;
        this.translateY = null;
    }
    removeEventListener() {
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
    }
}

/**
 * Represents keyboard navigation support for Spreadsheet.
 */
class KeyboardNavigation {
    /**
     * Constructor for the Spreadsheet Keyboard Navigation module.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        /* code snippet */
    }
    addEventListener() {
        this.parent.on(keyDown, this.keyDownHandler, this);
        /* code snippet */
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
        /* code snippet */
    }
    keyDownHandler(e) {
        if (!this.parent.isEdit && (document.activeElement.classList.contains('e-spreadsheet') ||
            closest(document.activeElement, '.e-sheet'))) {
            let isNavigate;
            let scrollIdxes;
            let sheet = this.parent.getActiveSheet();
            let actIdxes = getCellIndexes(this.parent.getActiveSheet().activeCell);
            if ([9, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if ((!e.shiftKey && e.keyCode === 37) || (e.shiftKey && e.keyCode === 9)) { //left key
                if (actIdxes[1] > 0) {
                    actIdxes[1] -= 1;
                    isNavigate = true;
                }
                else {
                    let content = this.parent.getMainContent();
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
                    let content = this.parent.getMainContent();
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
        let target = e.target;
        if (target.classList.contains('e-sheet-rename')) {
            if (e.keyCode === 32) {
                e.stopPropagation();
            }
            else if (e.keyCode === 13 || e.keyCode === 27) {
                this.parent.notify(renameSheet, e);
            }
        }
    }
    scrollNavigation(actIdxes, isScroll) {
        let cont = this.parent.getMainContent();
        let sheet = this.parent.getActiveSheet();
        let prevActIdxes = getCellIndexes(sheet.activeCell);
        let topLeftIdxes = getCellIndexes(sheet.topLeftCell);
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
    }
    getBottomIdx(topLeftIdxes) {
        let hgt = 0;
        let sheet = this.parent.getActiveSheet();
        for (let i = topLeftIdxes[0];; i++) {
            hgt += getRowHeight(sheet, i);
            if (hgt >= this.parent.viewport.height - 17) {
                return i;
            }
        }
    }
    getRightIdx(topLeftIdxes) {
        let width = 0;
        let sheet = this.parent.getActiveSheet();
        let contWidth = this.parent.getMainContent().offsetWidth;
        for (let i = topLeftIdxes[1];; i++) {
            width += getColumnWidth(sheet, i);
            if (width >= contWidth - 17) {
                return i;
            }
        }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'keyboardNavigation';
    }
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
}

/**
 * Represents keyboard shortcut support for Spreadsheet.
 */
class KeyboardShortcut {
    /**
     * Constructor for the Spreadsheet Keyboard Shortcut module.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(keyDown, this.keyDownHandler, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
    }
    keyDownHandler(e) {
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
                let value = this.parent.getCellStyleValue(['fontWeight'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontWeight;
                value = value === 'bold' ? 'normal' : 'bold';
                this.parent.notify(setCellFormat, { style: { fontWeight: value }, onActionUpdate: true, refreshRibbon: true });
            }
            else if (e.keyCode === 73) {
                e.preventDefault();
                let value = this.parent.getCellStyleValue(['fontStyle'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontStyle;
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
    }
    getModuleName() {
        return 'keyboardShortcut';
    }
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
}

/**
 * CellFormat module allows to format the cell styles.
 */
class CellFormat {
    constructor(parent) {
        this.checkHeight = false;
        //Spreadsheet.Inject(WorkbookCellFormat);
        this.parent = parent;
        this.row = parent.createElement('tr', { className: 'e-row' });
        this.addEventListener();
    }
    applyCellFormat(args) {
        let keys = Object.keys(args.style);
        if (args.lastCell && !this.row.childElementCount && !keys.length) {
            return;
        }
        let cell = args.cell || this.parent.getCell(args.rowIdx, args.colIdx);
        if (cell) {
            Object.assign(cell.style, args.style);
            if (args.isHeightCheckNeeded) {
                if (!args.manualUpdate) {
                    if (this.isHeightCheckNeeded(args.style)) {
                        let clonedCell = cell.cloneNode(true);
                        if (!clonedCell.innerHTML) {
                            clonedCell.textContent = 'Test';
                        }
                        this.row.appendChild(clonedCell);
                    }
                    if (args.lastCell && this.row.childElementCount) {
                        let sheet = this.parent.getActiveSheet();
                        let row = this.parent.getRow(args.rowIdx) || args.row;
                        let prevHeight = getRowHeight(sheet, args.rowIdx);
                        let height = this.getRowHeightOnInit();
                        if (height > prevHeight) {
                            row.style.height = `${height}px`;
                            if (sheet.showHeaders) {
                                (this.parent.getRow(args.rowIdx, this.parent.getRowHeaderTable()) || args.hRow).style.height =
                                    `${height}px`;
                            }
                            setRowHeight(sheet, args.rowIdx, height);
                        }
                        this.row.innerHTML = '';
                    }
                }
                else {
                    let idx;
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
    }
    updateRowHeight(cell, rowIdx, isLastCell, onActionUpdate) {
        if (this.checkHeight && isLastCell) {
            this.checkHeight = false;
            let sheet = this.parent.getActiveSheet();
            let row = this.parent.getRow(rowIdx);
            if (!row) {
                return;
            }
            if (!cell) {
                cell = row.lastElementChild;
            }
            let test = false;
            row.style.height = '';
            if (!cell.innerHTML) {
                cell.textContent = 'test';
                test = true;
            }
            let height = Math.ceil(row.getBoundingClientRect().height);
            if (test) {
                cell.textContent = '';
            }
            height = height < 20 ? 20 : height;
            let prevHeight = getRowHeight(sheet, rowIdx);
            let heightChanged = onActionUpdate ? height !== prevHeight : height > prevHeight;
            if (heightChanged) {
                row.style.height = `${height}px`;
                if (sheet.showHeaders) {
                    this.parent.getRow(rowIdx, this.parent.getRowHeaderTable()).style.height = `${height}px`;
                }
                setRowHeight(sheet, rowIdx, height);
                this.parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHeight });
            }
            else {
                row.style.height = `${prevHeight}px`;
            }
        }
    }
    isHeightCheckNeeded(style, onActionUpdate) {
        let keys = Object.keys(style);
        return (onActionUpdate ? keys.indexOf('fontSize') > -1 : keys.indexOf('fontSize') > -1
            && Number(style.fontSize.split('pt')[0]) > 12) || keys.indexOf('fontFamily') > -1;
    }
    getRowHeightOnInit() {
        let table = this.parent.createElement('table', { className: 'e-table e-test-table' });
        let tBody = table.appendChild(this.parent.createElement('tbody'));
        tBody.appendChild(this.row);
        this.parent.element.appendChild(table);
        let height = Math.round(this.row.getBoundingClientRect().height);
        this.parent.element.removeChild(table);
        return height < 20 ? 20 : height;
    }
    addEventListener() {
        this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.on(applyCellFormat, this.applyCellFormat.bind(this));
        }
    }
    /**
     * Destroy cell format module.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
        this.row = null;
        this.checkHeight = null;
    }
    /**
     * Get the cell format module name.
     */
    getModuleName() {
        return 'cellformat';
    }
}

/**
 * The `Resize` module is used to handle the resizing functionalities in Spreadsheet.
 */
class Resize {
    /**
     * Constructor for resize module in Spreadsheet.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    addEventListener() {
        this.parent.on(contentLoaded, this.wireEvents, this);
    }
    wireEvents() {
        let rowHeader = this.parent.getRowHeaderContent();
        let colHeader = this.parent.getColumnHeaderContent();
        EventHandler.add(colHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(rowHeader, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler, this);
        this.wireResizeCursorEvent(rowHeader, colHeader);
    }
    wireResizeCursorEvent(rowHeader, colHeader) {
        EventHandler.add(rowHeader, 'mousemove', this.setTarget, this);
        EventHandler.add(colHeader, 'mousemove', this.setTarget, this);
    }
    unWireResizeCursorEvent() {
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousemove', this.setTarget);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousemove', this.setTarget);
    }
    unwireEvents() {
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.parent.getColumnHeaderContent(), 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.parent.getRowHeaderContent(), 'mousedown', this.mouseDownHandler);
        this.unWireResizeCursorEvent();
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.wireEvents);
        }
    }
    mouseMoveHandler(e) {
        let sheetPanel = this.parent.element.getElementsByClassName('e-sheet-panel')[0];
        let colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        let rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
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
    }
    mouseDownHandler(e) {
        this.event = e;
        this.trgtEle = e.target;
        this.updateTarget(e, this.trgtEle);
        let trgt = this.trgtEle;
        let className = trgt.classList.contains('e-colresize') ? 'e-colresize-handler' :
            trgt.classList.contains('e-rowresize') ? 'e-rowresize-handler' : '';
        this.createResizeHandler(trgt, className);
        this.unWireResizeCursorEvent();
        EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.mouseUpHandler, this);
    }
    mouseUpHandler(e) {
        let colResizeHandler = this.parent.element.getElementsByClassName('e-colresize-handler')[0];
        let rowResizeHandler = this.parent.element.getElementsByClassName('e-rowresize-handler')[0];
        this.resizeOn(e);
        let resizeHandler = colResizeHandler ? colResizeHandler : rowResizeHandler;
        if (resizeHandler) {
            this.parent.element.getElementsByClassName('e-sheet-panel')[0].removeChild(resizeHandler);
            this.updateCursor(e);
        }
        EventHandler.remove(document, 'mouseup', this.mouseUpHandler);
        EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        this.wireResizeCursorEvent(this.parent.getRowHeaderContent(), this.parent.getColumnHeaderContent());
    }
    dblClickHandler(e) {
        this.trgtEle = e.target;
        this.updateTarget(e, this.trgtEle);
        let trgt = this.trgtEle;
        if (trgt.classList.contains('e-colresize') || trgt.classList.contains('e-rowresize')) {
            let colIndx = parseInt(trgt.getAttribute('aria-colindex'), 10) - 1;
            let rowIndx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (trgt.classList.contains('e-colresize')) {
                this.setAutofit(colIndx, true);
            }
            else if (trgt.classList.contains('e-rowresize')) {
                this.setAutofit(rowIndx, false);
            }
        }
    }
    setTarget(e) {
        let trgt = e.target;
        let newTrgt;
        let tOffsetV;
        let eOffsetV;
        let tClass;
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
            let resEle = (tClass === 'e-colresize' ? trgt.parentElement.getElementsByClassName(tClass)
                : this.parent.getRowHeaderTable().getElementsByClassName(tClass));
            for (let index = 0; index < resEle.length; index++) {
                resEle[index].classList.remove(tClass);
            }
        }
    }
    updateTarget(e, trgt) {
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
    }
    setAutofit(idx, isCol) {
        let index;
        let oldIdx = idx;
        if (this.parent.scrollSettings.enableVirtualization) {
            idx = isCol ? idx - this.parent.viewport.leftIndex : idx - this.parent.viewport.topIndex;
        }
        let sheet = this.parent.getActiveSheet();
        let mainContent = this.parent.getMainContent();
        let oldValue = isCol ?
            mainContent.getElementsByTagName('col')[idx].style.width : mainContent.getElementsByTagName('tr')[idx].style.height;
        let headerTable = isCol ? this.parent.getColHeaderTable() : this.parent.getRowHeaderTable();
        let contentRow = mainContent.getElementsByClassName('e-row');
        let contentClone = [];
        let contentTable = mainContent.getElementsByClassName('e-content-table')[0];
        let headerRow = headerTable.getElementsByTagName('tr');
        let headerText;
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
        let headerFit = this.findMaxValue(headerTable, [headerText], isCol);
        let contentFit = this.findMaxValue(contentTable, contentClone, isCol);
        let autofitValue = headerFit < contentFit ? contentFit : headerFit;
        let threshold = parseInt(oldValue, 10) > autofitValue ?
            -(parseInt(oldValue, 10) - autofitValue) : autofitValue - parseInt(oldValue, 10);
        if (isCol) {
            getColumn(sheet, idx).width = autofitValue > 0 ? autofitValue : 0;
            this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        }
        else {
            setRowHeight(sheet, idx, autofitValue > 0 ? autofitValue : 0);
            this.parent.notify(rowHeightChanged, { threshold: threshold, rowIdx: oldIdx });
        }
        this.setResize(idx, autofitValue + 'px', isCol);
    }
    findMaxValue(table, text, isCol) {
        let myTableDiv = this.parent.createElement('div', { className: this.parent.element.className });
        let myTable = this.parent.createElement('table', {
            className: table.className + 'e-resizetable',
            styles: 'width: auto;height: auto'
        });
        let myTr = this.parent.createElement('tr');
        if (isCol) {
            text.forEach((element) => {
                let tr = myTr.cloneNode();
                tr.appendChild(element);
                myTable.appendChild(tr);
            });
        }
        else {
            text.forEach((element) => {
                myTr.appendChild(element.cloneNode(true));
            });
            myTable.appendChild(myTr);
        }
        myTableDiv.appendChild(myTable);
        document.body.appendChild(myTableDiv);
        let offsetWidthValue = myTable.getBoundingClientRect().width;
        let offsetHeightValue = myTable.getBoundingClientRect().height;
        document.body.removeChild(myTableDiv);
        if (isCol) {
            return Math.ceil(offsetWidthValue);
        }
        else {
            return Math.ceil(offsetHeightValue);
        }
    }
    createResizeHandler(trgt, className) {
        let editor = this.parent.createElement('div', { className: className });
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
    }
    setColWidth(index, width) {
        let sheet = this.parent.getActiveSheet();
        let eleWidth = parseInt(this.parent.getMainContent().getElementsByTagName('col')[index].style.width, 10);
        let colWidth = width;
        let threshold = parseInt(colWidth, 10) - eleWidth;
        if (threshold < 0 && eleWidth < -(threshold)) {
            threshold = -eleWidth;
        }
        let oldIdx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
        this.parent.notify(colWidthChanged, { threshold, colIdx: oldIdx });
        this.setResize(index, colWidth, true);
        getColumn(sheet, index).width = parseInt(colWidth, 10) > 0 ? parseInt(colWidth, 10) : 0;
        sheet.columns[index].customWidth = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }
    setRowHeight(index, height) {
        let eleHeight = parseInt(this.parent.getMainContent().getElementsByTagName('tr')[index].style.height, 10);
        let rowHeight = height;
        let threshold = parseInt(rowHeight, 10) - eleHeight;
        if (threshold < 0 && eleHeight < -(threshold)) {
            threshold = -eleHeight;
        }
        let oldIdx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
        this.parent.notify(rowHeightChanged, { threshold, rowIdx: oldIdx });
        this.setResize(index, rowHeight, false);
        setRowHeight(this.parent.getActiveSheet(), index, parseInt(rowHeight, 10) > 0 ? parseInt(rowHeight, 10) : 0);
        this.parent.getActiveSheet().rows[index].customHeight = true;
        this.parent.setProperties({ sheets: this.parent.sheets }, true);
    }
    resizeOn(e) {
        let idx;
        if (this.trgtEle.classList.contains('e-rowresize')) {
            idx = parseInt(this.trgtEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = idx - this.parent.viewport.topIndex;
            }
            let rowHeight = e.clientY - this.event.clientY +
                parseInt(this.parent.getMainContent().getElementsByClassName('e-row')[idx].style.height, 10) + 'px';
            this.setRowHeight(idx, rowHeight);
        }
        else if (this.trgtEle.classList.contains('e-colresize')) {
            idx = parseInt(this.trgtEle.getAttribute('aria-colindex'), 10) - 1;
            if (this.parent.scrollSettings.enableVirtualization) {
                idx = idx - this.parent.viewport.leftIndex;
            }
            let colWidth = e.clientX - this.event.clientX +
                parseInt(this.parent.getMainContent().getElementsByTagName('col')[idx].style.width, 10) + 'px';
            this.setColWidth(idx, colWidth);
        }
    }
    setWidthAndHeight(trgt, value, isCol) {
        if (isCol) {
            trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
        }
        else {
            trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
        }
    }
    // tslint:disable-next-line:max-func-body-length
    setResize(index, value, isCol) {
        let curEle;
        let curEleH;
        let curEleC;
        let preEle;
        let preEleH;
        let preEleC;
        let nxtEle;
        let nxtEleH;
        let nxtEleC;
        let sheet = this.parent.getActiveSheet();
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
            let hdrRow = this.parent.getRowHeaderContent().getElementsByClassName('e-row');
            let hdrClone = [];
            hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true);
            let hdrFntSize = this.findMaxValue(this.parent.getRowHeaderTable(), hdrClone, false) + 1;
            let contentRow = this.parent.getMainContent().getElementsByClassName('e-row');
            let contentClone = [];
            for (let idx = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
                contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true);
            }
            let cntFntSize = this.findMaxValue(this.parent.getContentTable(), contentClone, false) + 1;
            let fntSize = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
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
                                let nxtIndex;
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
                            let nxtIndex;
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
    }
    updateCursor(e) {
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
    }
    /**
     * To destroy the resize module.
     * @return {void}
     */
    destroy() {
        this.unwireEvents();
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the module name.
     * @returns string
     */
    getModuleName() {
        return 'resize';
    }
}

/**
 *
 */

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * An array of object that is used to configure the Tab.
 */
class RibbonItem extends ChildProperty {
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
/**
 * Represents Ribbon component.
 */
let Ribbon$1 = class Ribbon extends Component {
    /**
     * Constructor for creating the widget.
     * @param  {RibbonModel} options?
     * @param  {string|HTMLDivElement} element?
     */
    constructor(options, element) {
        super(options);
    }
    /**
     * For internal use only.
     * @returns void
     * @private
     */
    preRender() {
        /** */
    }
    /**
     * For internal use only.
     * @returns void
     * @private
     */
    render() {
        this.renderRibbon();
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.destroyComponent(this.element.querySelector('.e-file-menu'), Menu);
        let expandCollapseElem = this.tabObj.element.querySelector('.e-drop-icon');
        if (expandCollapseElem) {
            expandCollapseElem.removeEventListener('click', this.ribbonExpandCollapse.bind(this));
        }
        this.toolbarObj.destroy();
        this.tabObj.destroy();
        super.destroy();
    }
    getTabItems() {
        let tabItems = [];
        this.items.forEach((item) => {
            switch (item.type) {
                case 'Menu':
                    tabItems.push({
                        header: { text: this.initMenu(item.menuItems) },
                        content: this.toolbarObj.element
                    });
                    break;
                case 'Tab':
                    tabItems.push({
                        header: item.header,
                        content: this.toolbarObj.element
                    });
                    break;
            }
        });
        return tabItems;
    }
    initMenu(menuItems) {
        let menu = this.createElement('ul');
        this.element.appendChild(menu);
        let menuObj = new Menu({
            cssClass: 'e-file-menu',
            items: menuItems,
            showItemOnClick: true,
            beforeOpen: (args) => {
                if (args.parentItem.text === menuItems[0].text) {
                    menuObj.showItemOnClick = false;
                }
                this.trigger('beforeOpen', args);
            },
            select: (args) => {
                this.trigger('fileItemSelect', args);
            },
            beforeClose: (args) => {
                if (args.event.type === 'mouseover' && !closest(args.event.target, '.e-menu-popup')) {
                    args.cancel = true;
                    return;
                }
                this.trigger('beforeClose', args);
                if (!args.parentItem || args.parentItem.text === menuItems[0].text) {
                    requestAnimationFrame(() => menuObj.setProperties({ showItemOnClick: true }, true));
                }
            },
            beforeItemRender: (args) => {
                this.trigger('beforeFileItemRender', args);
            }
        });
        menuObj.createElement = this.createElement;
        menuObj.appendTo(menu);
        return menu.parentElement;
    }
    renderRibbon() {
        let tabElement = this.createElement('div');
        let tBarElement = this.createElement('div');
        this.toolbarObj = new Toolbar({
            clicked: (args) => {
                this.trigger('clicked', args);
            }
        });
        this.toolbarObj.createElement = this.createElement;
        this.toolbarObj.appendTo(tBarElement);
        this.tabObj = new Tab({
            selectedItem: 1,
            animation: { next: { duration: 0 }, previous: { duration: 0 } },
            items: this.getTabItems(),
            selecting: (args) => {
                if (this.items[args.selectingIndex].type === 'Menu') {
                    args.cancel = true;
                }
                else {
                    this.toolbarObj.items = this.items[args.selectingIndex].content;
                    this.toolbarObj.dataBind();
                    if (this.element.classList.contains('e-collapsed')) {
                        EventHandler.remove(args.selectedItem, 'click', this.ribbonExpandCollapse);
                    }
                }
                this.trigger('selecting', args);
            },
            selected: () => {
                if (this.element.classList.contains('e-collapsed')) {
                    this.element.classList.remove('e-collapsed');
                    this.trigger('expandCollapse', { element: this.toolbarObj.element, expanded: true });
                }
            },
            created: () => {
                let collapseBtn = this.createElement('span', { className: 'e-drop-icon e-icons' });
                collapseBtn.addEventListener('click', this.ribbonExpandCollapse.bind(this));
                this.tabObj.element.querySelector('.e-tab-header').appendChild(collapseBtn);
                this.toolbarObj.refreshOverflow();
            }
        });
        this.element.appendChild(tabElement);
        this.tabObj.createElement = this.createElement;
        this.tabObj.appendTo(tabElement);
    }
    ribbonExpandCollapse(e) {
        let eventArgs = { element: this.toolbarObj.element, expanded: true };
        let activeTab;
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
    }
    /**
     * Enables or disables the specified Ribbon items or all ribbon items.
     * @param  {boolean} enable  - Boolean value that determines whether the command should be enabled or disabled.
     * @param  {HTMLElement} items - DOM element or an array of items to be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns void.
     */
    enableItems(enable, items) {
        if (items) {
            this.toolbarObj.enableItems(items, enable);
        }
        else {
            this.toolbarObj.disable(!enable);
        }
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'ribbon';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @private
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {RibbonModel} newProp
     * @param  {RibbonModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        /** code snippets */
    }
    destroyComponent(element, component) {
        if (element) {
            let compObj = getComponent(element, component);
            if (compObj) {
                compObj.destroy();
            }
        }
    }
};
__decorate$7([
    Property('')
], Ribbon$1.prototype, "cssClass", void 0);
__decorate$7([
    Collection([], RibbonItem)
], Ribbon$1.prototype, "items", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "selecting", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "fileItemSelect", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "beforeFileItemRender", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "beforeOpen", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "beforeClose", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "selectFormat", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "clicked", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "created", void 0);
__decorate$7([
    Event$1()
], Ribbon$1.prototype, "expandCollapse", void 0);
Ribbon$1 = __decorate$7([
    NotifyPropertyChanges
], Ribbon$1);

/**
 * Export Ribbon modules
 */

/**
 * `Color Picker` module is used to handle ColorPicker functionality.
 * @hidden
 */
class ColorPicker$1 {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    render() {
        let id = this.parent.element.id;
        let input = this.parent.createElement('input', { attrs: { 'type': 'color' } });
        let fontColorPicker = new ColorPicker({
            value: '#000000ff',
            mode: 'Palette',
            showButtons: false,
            presetColors: fontColor,
            enableOpacity: false,
            beforeClose: (args) => this.beforeCloseHandler(fontColorPicker),
            open: this.openHandler.bind(this),
            beforeModeSwitch: (args) => this.beforeModeSwitch(fontColorPicker, args),
            change: (args) => {
                let color = fontColorPicker.getValue(args.currentValue.rgba);
                this.updateSelectedColor(color, fontColorPicker.element);
                this.parent.cellFormat({ color: color });
                this.parent.element.focus();
            },
            created: () => this.wireFocusEvent(fontColorPicker.element, '#000000')
        });
        fontColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        fontColorPicker.appendTo(input);
        input.parentElement.id = `${id}_font_color_picker`;
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-font-color']);
        input = this.parent.createElement('input', { attrs: { 'type': 'color' } });
        let filColorPicker = new ColorPicker({
            value: '#ffff00ff',
            mode: 'Palette',
            presetColors: fillColor,
            showButtons: false,
            enableOpacity: false,
            open: this.openHandler.bind(this),
            beforeClose: (args) => this.beforeCloseHandler(filColorPicker),
            beforeModeSwitch: (args) => this.beforeModeSwitch(filColorPicker, args),
            change: (args) => {
                let color = filColorPicker.getValue(args.currentValue.rgba);
                this.updateSelectedColor(color, filColorPicker.element);
                this.parent.cellFormat({ backgroundColor: color });
                this.parent.element.focus();
            },
            created: () => this.wireFocusEvent(filColorPicker.element, '#ffff00')
        });
        filColorPicker.createElement = this.parent.createElement;
        this.parent.element.appendChild(input);
        filColorPicker.appendTo(input);
        input.parentElement.id = `${id}_fill_color_picker`;
        addClass([input.nextElementSibling.getElementsByClassName('e-selected-color')[0]], ['e-icons', 'e-fill-color']);
    }
    updateSelectedColor(color, ele) {
        ele.nextElementSibling.querySelector('.e-selected-color').style.borderBottomColor = color;
    }
    wireFocusEvent(element, color) {
        this.updateSelectedColor(color, element);
        element = element.parentElement.querySelector('.e-split-colorpicker');
        element.addEventListener('focus', () => {
            this.parent.element.focus();
        });
    }
    openHandler(args) {
        args.element.querySelector('.e-mode-switch-btn').title =
            this.parent.serviceLocator.getService(locale).getConstant('MoreColors');
    }
    beforeCloseHandler(inst) {
        if (!inst.modeSwitcher) {
            inst.setProperties({ modeSwitcher: true }, true);
        }
        if (inst.showButtons) {
            inst.setProperties({ showButtons: false }, true);
        }
    }
    beforeModeSwitch(inst, args) {
        let l10n = this.parent.serviceLocator.getService(locale);
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
    }
    destroy() {
        this.removeEventListener();
        let id = this.parent.element.id;
        this.destroyColorPicker(`${id}_font_color_picker`);
        this.destroyColorPicker(`${id}_fill_color_picker`);
        this.parent = null;
    }
    destroyColorPicker(id) {
        let ele = document.getElementById(id);
        if (ele) {
            destroyComponent(ele.firstElementChild, ColorPicker);
        }
    }
    addEventListener() {
        this.parent.on(beforeRibbonCreate, this.render, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(beforeRibbonCreate, this.render);
            this.parent.off(spreadsheetDestroyed, this.destroy);
        }
    }
}

/**
 * Represents Ribbon for Spreadsheet.
 */
class Ribbon$$1 {
    constructor(parent) {
        this.fontNameIndex = 5;
        this.numPopupWidth = 0;
        this.activeTab = 1;
        this.parent = parent;
        this.addEventListener();
        new ColorPicker$1(parent);
    }
    getModuleName() {
        return 'ribbon';
    }
    initRibbon(args) {
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
    }
    getRibbonItems() {
        let id = this.parent.element.id;
        let l10n = this.parent.serviceLocator.getService(locale);
        let items = [
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
                    { prefixIcon: 'e-cut-icon', tooltipText: `${l10n.getConstant('Cut')} (Ctrl+X)`, id: id + '_cut' },
                    { prefixIcon: 'e-copy-icon', tooltipText: `${l10n.getConstant('Copy')} (Ctrl+C)`, id: id + '_copy' },
                    { tooltipText: `${l10n.getConstant('Paste')} (Ctrl+V)`, template: this.getPasteBtn(id) },
                    { type: 'Separator' },
                    { template: this.getNumFormatDDB(id), tooltipText: l10n.getConstant('NumberFormat') }, { type: 'Separator' },
                    { template: this.getFontNameDDB(id), tooltipText: l10n.getConstant('Font') }, { type: 'Separator' },
                    { template: this.getFontSizeDDB(id), tooltipText: l10n.getConstant('FontSize') }, { type: 'Separator' },
                    { template: this.getBtn(id, 'bold'), tooltipText: `${l10n.getConstant('Bold')} (Ctrl+B)` },
                    { template: this.getBtn(id, 'italic'), tooltipText: `${l10n.getConstant('Italic')} (Ctrl+I)` },
                    { template: this.getBtn(id, 'line-through'), tooltipText: `${l10n.getConstant('Strikethrough')} (Ctrl+5)` },
                    { template: this.getBtn(id, 'underline'), tooltipText: `${l10n.getConstant('Underline')} (Ctrl+U)` },
                    { template: document.getElementById(`${id}_font_color_picker`), tooltipText: l10n.getConstant('TextColor') },
                    { type: 'Separator' },
                    { template: document.getElementById(`${id}_fill_color_picker`), tooltipText: l10n.getConstant('FillColor') },
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
            items.find((x) => x.header && x.header.text === l10n.getConstant('Home')).content.push({ type: 'Separator' }, {
                template: this.getSortingDDB(id), tooltipText: l10n.getConstant('Sort')
            });
        }
        return items;
    }
    getPasteBtn(id) {
        let btn = this.parent.element.appendChild(this.parent.createElement('button', { id: id + '_paste' }));
        let l10n = this.parent.serviceLocator.getService(locale);
        let pasteSplitBtn = new SplitButton({
            iconCss: 'e-icons e-paste-icon',
            items: [
                { text: l10n.getConstant('All'), id: 'All' },
                { text: l10n.getConstant('Values'), id: 'Values' },
                { text: l10n.getConstant('Formats'), id: 'Formats' }
            ],
            select: (args) => {
                this.parent.notify(paste, { type: args.item.id });
            },
            click: () => {
                this.parent.notify(paste, null);
            },
            close: () => { this.parent.element.focus(); }
        });
        pasteSplitBtn.createElement = this.parent.createElement;
        pasteSplitBtn.appendTo(btn);
        return btn.parentElement;
    }
    getLocaleText(l10n, str, setClass) {
        let text;
        let sheet = this.parent.getActiveSheet();
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
    }
    createRibbon(args) {
        let ribbonElement = this.parent.createElement('div');
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
            let refEle = this.parent.element.querySelector('.e-formula-bar-panel') ||
                document.getElementById(this.parent.element.id + '_sheet_panel');
            this.parent.element.insertBefore(ribbonElement, refEle);
        }
        else {
            this.parent.element.appendChild(ribbonElement);
        }
        this.ribbon.appendTo(ribbonElement);
    }
    tabSelecting(args) {
        if (args.selectingIndex && args.selectingIndex !== this.activeTab) {
            this.activeTab = args.selectingIndex;
            this.refreshRibbonContent();
            this.parent.notify(tabSwitch, { idx: args.selectingIndex });
        }
    }
    beforeRenderHandler(args) {
        let l10n = this.parent.serviceLocator.getService(locale);
        if (args.item.text === l10n.getConstant('Open') && (!this.parent.openUrl || !this.parent.allowOpen)) {
            args.element.classList.add('e-disabled');
        }
        if (args.item.text === l10n.getConstant('SaveAs') && (!this.parent.saveUrl || !this.parent.allowSave)) {
            args.element.classList.add('e-disabled');
        }
    }
    getNumFormatDDB(id) {
        let numFormatBtn = this.parent.createElement('button', { id: id + '_number_format' });
        numFormatBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'General' }));
        this.numFormatDDB = new DropDownButton({
            items: this.getNumFormatDdbItems(id),
            content: '',
            select: (args) => this.numDDBSelect(args),
            open: (args) => this.numDDBOpen(args),
            beforeItemRender: (args) => this.previewNumFormat(args),
            close: () => this.parent.element.focus(),
            cssClass: 'e-flat e-numformat-ddb',
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.numFormatDDB.createElement = this.parent.createElement;
        this.numFormatDDB.appendTo(numFormatBtn);
        return numFormatBtn;
    }
    getFontSizeDDB(id) {
        this.fontSizeDdb = new DropDownButton({
            cssClass: 'e-font-size-ddb',
            content: '11',
            items: [{ text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '14' }, { text: '16' },
                { text: '18' }, { text: '20' }, { text: '22' }, { text: '24' }, { text: '26' }, { text: '28' }, { text: '36' },
                { text: '48' }, { text: '72' }],
            beforeOpen: (args) => {
                this.tBarDdbBeforeOpen(args);
                this.refreshSelected(this.fontSizeDdb, args.element, 'content', 'text');
            },
            select: (args) => {
                this.fontSizeDdb.content = args.item.text;
                this.fontSizeDdb.dataBind();
                this.parent.notify(setCellFormat, { style: { fontSize: `${args.item.text}pt` }, onActionUpdate: true });
            },
            close: () => this.parent.element.focus()
        });
        this.fontSizeDdb.createElement = this.parent.createElement;
        this.fontSizeDdb.appendTo(this.parent.createElement('button', { id: id + '_font_size' }));
        return this.fontSizeDdb.element;
    }
    getFontNameDDB(id) {
        let fontNameBtn = this.parent.createElement('button', { id: id + '_font_name' });
        fontNameBtn.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text', innerHTML: 'Calibri' }));
        this.fontNameDdb = new DropDownButton({
            cssClass: 'e-font-family',
            items: this.getFontFamilyItems(),
            select: (args) => {
                this.refreshFontNameSelection(args.item.text);
                this.parent.notify(setCellFormat, { style: { fontFamily: args.item.text }, onActionUpdate: true });
            },
            close: () => this.parent.element.focus(),
            beforeOpen: this.tBarDdbBeforeOpen.bind(this)
        });
        this.fontNameDdb.createElement = this.parent.createElement;
        this.fontNameDdb.appendTo(fontNameBtn);
        return fontNameBtn;
    }
    getBtn(id, name) {
        let btnObj = new Button({ iconCss: `e-icons e-${name}-icon`, isToggle: true });
        btnObj.createElement = this.parent.createElement;
        btnObj.appendTo(this.parent.createElement('button', { id: `${id}_${name}` }));
        btnObj.element.addEventListener('click', this.toggleBtnClicked.bind(this));
        return btnObj.element;
    }
    getTextAlignDDB(id) {
        this.textAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-left-icon',
            items: [{ iconCss: 'e-icons e-left-icon' }, { iconCss: 'e-icons e-center-icon' }, { iconCss: 'e-icons e-right-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args) => {
                this.refreshSelected(this.textAlignDdb, args.element, 'iconCss');
            },
            select: (args) => {
                this.textAlignDdb.iconCss = args.item.iconCss;
                this.textAlignDdb.dataBind();
                this.parent.notify(setCellFormat, {
                    style: { textAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] }, onActionUpdate: true
                });
            },
            close: () => this.parent.element.focus()
        });
        this.textAlignDdb.createElement = this.parent.createElement;
        this.textAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_text_align' }));
        return this.textAlignDdb.element;
    }
    getVerticalAlignDDB(id) {
        this.verticalAlignDdb = new DropDownButton({
            cssClass: 'e-align-ddb',
            iconCss: 'e-icons e-bottom-icon',
            items: [{ iconCss: 'e-icons e-top-icon' }, { iconCss: 'e-icons e-middle-icon' }, { iconCss: 'e-icons e-bottom-icon' }],
            beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args) => {
                this.refreshSelected(this.verticalAlignDdb, args.element, 'iconCss');
            },
            select: (args) => {
                this.verticalAlignDdb.iconCss = args.item.iconCss;
                this.verticalAlignDdb.dataBind();
                this.parent.notify(setCellFormat, {
                    style: { verticalAlign: args.item.iconCss.split(' e-')[1].split('-icon')[0] }, onActionUpdate: true
                });
            },
            close: () => this.parent.element.focus()
        });
        this.verticalAlignDdb.createElement = this.parent.createElement;
        this.verticalAlignDdb.appendTo(this.parent.createElement('button', { id: id + '_vertical_align' }));
        return this.verticalAlignDdb.element;
    }
    getSortingDDB(id) {
        let l10n = this.parent.serviceLocator.getService(locale);
        this.sortingDdb = new DropDownButton({
            cssClass: 'e-sort-ddb',
            iconCss: 'e-icons e-sort-icon',
            items: [
                { text: l10n.getConstant('SortAscending'), iconCss: 'e-icons e-sort-asc' },
                { text: l10n.getConstant('SortDescending'), iconCss: 'e-icons e-sort-desc' },
                { text: l10n.getConstant('CustomSort') + '...', iconCss: 'e-icons e-sort-custom' }
            ],
            // beforeItemRender: this.alignItemRender.bind(this),
            beforeOpen: (args) => {
                this.refreshSelected(this.sortingDdb, args.element, 'iconCss');
            },
            select: (args) => {
                if (args.item.text === l10n.getConstant('CustomSort') + '...') {
                    this.parent.notify(initiateCustomSort, null);
                }
                else {
                    let direction = args.item.text === l10n.getConstant('SortAscending') ? 'Ascending' : 'Descending';
                    this.sortingDdb.iconCss = args.item.iconCss;
                    this.sortingDdb.dataBind();
                    this.parent.sort({ sortDescriptors: { order: direction } });
                }
            },
            close: () => this.parent.element.focus()
        });
        this.sortingDdb.createElement = this.parent.createElement;
        this.sortingDdb.appendTo(this.parent.createElement('button', { id: id + '_sorting' }));
        return this.sortingDdb.element;
    }
    ribbonCreated() {
        if (this.parent.enableClipboard) {
            this.enableRibbonItems({ id: this.parent.element.id + '_paste', isEnable: false });
        }
        this.ribbon.element.querySelector('.e-drop-icon').title
            = this.parent.serviceLocator.getService(locale).getConstant('CollapseToolbar');
    }
    alignItemRender(args) {
        let text = args.item.iconCss.split(' e-')[1].split('-icon')[0];
        text = text[0].toUpperCase() + text.slice(1, text.length);
        args.element.title = this.parent.serviceLocator.getService(locale).getConstant('Align' + text);
    }
    toggleBtnClicked(e) {
        let target = closest(e.target, '.e-btn');
        let parentId = this.parent.element.id;
        let id = target.id;
        let property = setCellFormat;
        let defaultModel;
        let activeModel;
        switch (id) {
            case `${parentId}_bold`:
                defaultModel = { fontWeight: 'normal' };
                activeModel = { fontWeight: 'bold' };
                break;
            case `${parentId}_italic`:
                defaultModel = { fontStyle: 'normal' };
                activeModel = { fontStyle: 'italic' };
                break;
            case `${parentId}_line-through`:
                property = textDecorationUpdate;
                defaultModel = { textDecoration: 'line-through' };
                activeModel = defaultModel;
                break;
            case `${parentId}_underline`:
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
    }
    getCellStyleValue(cssProp, indexes) {
        let cell = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
        let value = this.parent.cellStyle[cssProp];
        if (cell && cell.style && cell.style[cssProp]) {
            value = cell.style[cssProp];
        }
        return value;
    }
    refreshSelected(inst, element, key, itemKey = key) {
        for (let i = 0; i < inst.items.length; i++) {
            if (inst.items[i][itemKey] === inst[key]) {
                element.children[i].classList.add('e-selected');
                break;
            }
        }
    }
    expandCollapseHandler(args) {
        let target = this.ribbon.element.querySelector('.e-drop-icon');
        let l10n = this.parent.serviceLocator.getService(locale);
        if (args.expanded) {
            target.title = l10n.getConstant('CollapseToolbar');
        }
        else {
            target.title = l10n.getConstant('ExpandToolbar');
        }
        this.parent.setPanelSize();
    }
    getNumFormatDdbItems(id) {
        let l10n = this.parent.serviceLocator.getService(locale);
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
    }
    getFontFamilyItems() {
        return [{ text: 'Arial' }, { text: 'Arial Black' }, { text: 'Axettac Demo' }, { text: 'Batang' }, { text: 'Book Antiqua' },
            { text: 'Calibri', iconCss: 'e-icons e-selected-icon' }, { text: 'Courier' }, { text: 'Courier New' },
            { text: 'Din Condensed' }, { text: 'Georgia' }, { text: 'Helvetica' }, { text: 'Helvetica New' }, { text: 'Roboto' },
            { text: 'Tahoma' }, { text: 'Times New Roman' }, { text: 'Verdana' }];
    }
    enableToolbar(args) {
        this.ribbon.enableItems(args.enable);
    }
    numDDBSelect(args) {
        this.parent.notify(applyNumberFormatting, {
            format: getFormatFromType(args.item.text),
            range: this.parent.getActiveSheet().selectedRange
        });
        this.parent.notify(selectionComplete, { type: 'mousedown' });
        this.refreshNumFormatSelection(args.item.text);
    }
    tBarDdbBeforeOpen(args) {
        let viewportHeight = this.parent.viewport.height;
        let actualHeight = (parseInt(getComputedStyle(args.element.firstElementChild).height, 10) * args.items.length) +
            (parseInt(getComputedStyle(args.element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            args.element.style.height = `${viewportHeight}px`;
            args.element.style.overflowY = 'auto';
        }
    }
    numDDBOpen(args) {
        this.numPopupWidth = 0;
        let elemList = args.element.querySelectorAll('span.e-numformat-preview-text');
        for (let i = 0, len = elemList.length; i < len; i++) {
            if (this.numPopupWidth < elemList[i].offsetWidth) {
                this.numPopupWidth = elemList[i].offsetWidth;
            }
        }
        let popWidth = this.numPopupWidth + 160;
        document.querySelector('.e-numformat-ddb.e-dropdown-popup').style.width = `${popWidth}px`;
    }
    previewNumFormat(args) {
        let cellIndex = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let cell = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet());
        let eventArgs = {
            type: args.item.text,
            formattedText: '',
            value: cell && cell.value ? cell.value : '',
            format: getFormatFromType(args.item.text),
            sheetIndex: this.parent.activeSheetTab,
            onLoad: true
        };
        let numElem = this.parent.createElement('div', {
            className: 'e-numformat-text',
            styles: 'width:100%',
            innerHTML: args.element.innerHTML
        });
        args.element.innerHTML = '';
        this.parent.notify(getFormattedCellObject, eventArgs);
        let previewElem = this.parent.createElement('span', {
            className: 'e-numformat-preview-text',
            styles: 'float:right;',
            innerHTML: eventArgs.formattedText.toString()
        });
        numElem.appendChild(previewElem);
        args.element.appendChild(numElem);
    }
    refreshRibbonContent() {
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
    }
    refreshFirstTabContent(indexes) {
        if (!isNullOrUndefined(document.getElementById(this.parent.element.id + '_number_format'))) {
            this.numFormatDDB = getComponent(document.getElementById(this.parent.element.id + '_number_format'), DropDownButton);
        }
        let actCell = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let l10n = this.parent.serviceLocator.getService(locale);
        let cell = getCell(actCell[0], actCell[1], this.parent.getActiveSheet(), true);
        cell = cell ? cell : {};
        let type = getTypeFromFormat(cell.format ? cell.format : 'General');
        if (this.numFormatDDB) {
            this.refreshNumFormatSelection(l10n.getConstant(type));
        }
        if (this.fontNameDdb) {
            this.refreshFontNameSelection(this.getCellStyleValue('fontFamily', indexes));
        }
        if (this.fontSizeDdb) {
            let value = this.getCellStyleValue('fontSize', indexes).split('pt')[0];
            if (value !== this.fontSizeDdb.content) {
                this.fontSizeDdb.content = value;
                this.fontSizeDdb.dataBind();
            }
        }
        if (this.textAlignDdb) {
            let value = `e-icons e-${this.getCellStyleValue('textAlign', indexes).toLowerCase()}-icon`;
            if (value !== this.textAlignDdb.iconCss) {
                this.textAlignDdb.iconCss = value;
                this.textAlignDdb.dataBind();
            }
        }
        if (this.verticalAlignDdb) {
            let value = `e-icons e-${this.getCellStyleValue('verticalAlign', indexes).toLowerCase()}-icon`;
            if (value !== this.verticalAlignDdb.iconCss) {
                this.verticalAlignDdb.iconCss = value;
                this.verticalAlignDdb.dataBind();
            }
        }
        let btn;
        let id = this.parent.element.id;
        let value;
        let fontProps = ['fontWeight', 'fontStyle', 'textDecoration', 'textDecoration'];
        ['bold', 'italic', 'line-through', 'underline'].forEach((name, index) => {
            btn = document.getElementById(`${id}_${name}`);
            if (btn) {
                value = this.getCellStyleValue(fontProps[index], indexes).toLowerCase();
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
    }
    refreshFontNameSelection(fontFamily) {
        if (fontFamily !== this.fontNameDdb.items[this.fontNameIndex].text) {
            this.fontNameDdb.element.firstElementChild.textContent = fontFamily;
            for (let i = 0; i < this.fontNameDdb.items.length; i++) {
                if (this.fontNameDdb.items[i].text === fontFamily) {
                    this.fontNameDdb.items[i].iconCss = 'e-icons e-selected-icon';
                    this.fontNameDdb.items[this.fontNameIndex].iconCss = '';
                    this.fontNameDdb.setProperties({ 'items': this.fontNameDdb.items }, true);
                    this.fontNameIndex = i;
                    break;
                }
            }
        }
    }
    refreshNumFormatSelection(type) {
        let l10n = this.parent.serviceLocator.getService(locale);
        for (let i = 0; i < this.numFormatDDB.items.length; i++) {
            if (this.numFormatDDB.items[i].iconCss !== '') {
                this.numFormatDDB.items[i].iconCss = '';
            }
            if (this.numFormatDDB.items[i].text === type) {
                this.numFormatDDB.items[i].iconCss = 'e-icons e-selected-icon';
            }
        }
        this.numFormatDDB.element.firstElementChild.textContent = type;
        this.numFormatDDB.setProperties({ 'items': this.numFormatDDB.items }, true);
    }
    fileItemSelect(args) {
        let selectArgs = extend({ cancel: false }, args);
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
                    let dialogInst = this.parent.serviceLocator.getService(dialog);
                    dialogInst.show({
                        height: 200, width: 400, isModal: true, showCloseIcon: true,
                        content: this.parent.serviceLocator.getService(locale).getConstant('DestroyAlert'),
                        beforeOpen: () => this.parent.element.focus(),
                        buttons: [{
                                buttonModel: {
                                    content: this.parent.serviceLocator.getService(locale).getConstant('Ok'), isPrimary: true
                                },
                                click: () => {
                                    this.parent.sheets.length = 0;
                                    this.parent.createSheet();
                                    dialogInst.hide();
                                    this.parent.activeSheetTab = this.parent.sheets.length;
                                    this.parent.setProperties({ 'activeSheetTab': this.parent.sheets.length }, true);
                                    this.parent.notify(refreshSheetTabs, {});
                                    this.parent.notify(sheetsDestroyed, {});
                                    this.parent.renderModule.refreshSheet();
                                }
                            }]
                    });
                    break;
            }
        }
    }
    toolbarClicked(args) {
        let parentId = this.parent.element.id;
        let text;
        let l10n = this.parent.serviceLocator.getService(locale);
        let sheet = this.parent.getActiveSheet();
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
    }
    updateToggleText(item, text) {
        getUpdateUsingRaf(() => {
            this.ribbon.element.querySelector(`#${this.parent.element.id}_${item} .e-tbar-btn-text`).textContent = text;
        });
    }
    refreshThirdTabContent() {
        let idx;
        let sheet = this.parent.getActiveSheet();
        let l10n = this.parent.serviceLocator.getService(locale);
        let itemPos = [0, 2];
        ['Headers', 'GridLines'].forEach((item, index) => {
            idx = itemPos[index];
            if (sheet['show' + item]) {
                if (this.ribbon.items[3].content[idx].text === l10n.getConstant('Show' + item)) {
                    this.updateShowHideBtn('Hide', item, idx);
                }
            }
            else {
                if (this.ribbon.items[3].content[idx].text === l10n.getConstant('Hide' + item)) {
                    this.updateShowHideBtn('Show', item, idx);
                }
            }
        });
    }
    updateShowHideBtn(showHideText, item, idx) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let text = l10n.getConstant(showHideText + item);
        this.ribbon.items[3].content[idx].text = text;
        this.ribbon.setProperties({ 'items': this.ribbon.items }, true);
        this.updateToggleText(item.toLowerCase(), text);
    }
    enableRibbonItems(args) {
        let ele = document.getElementById(args.id);
        if (ele) {
            this.ribbon.enableItems(args.isEnable, closest(ele, '.e-toolbar-item'));
        }
    }
    createMobileView() {
        let parentId = this.parent.element.id;
        let toobar = this.parent.createElement('div', { className: 'e-header-toolbar' });
        let menu = this.parent.createElement('ul');
        toobar.appendChild(menu);
        let toolbarObj = new Toolbar({
            items: [
                { prefixIcon: 'e-tick-icon', align: 'Left', id: parentId + 'focused_tick', cssClass: 'e-focused-tick' },
                { template: menu, align: 'Right', id: parentId + 'file_menu' },
            ],
            clicked: (args) => {
                switch (args.item.id) {
                    case parentId + 'focused_tick':
                        this.parent.element.classList.remove('e-mobile-focused');
                        this.parent.renderModule.setSheetPanelSize();
                        break;
                }
            },
            created: () => {
                let menuObj = new Menu({
                    cssClass: 'e-mobile e-file-menu',
                    enableRtl: true,
                    showItemOnClick: true,
                    items: this.ribbon.items[0].menuItems,
                    select: this.fileItemSelect.bind(this),
                    beforeOpen: (args) => {
                        args.element.parentElement.classList.remove('e-rtl');
                        this.fileMenuBeforeOpen(args);
                    },
                    beforeClose: this.fileMenuBeforeClose.bind(this)
                });
                menuObj.createElement = this.parent.createElement;
                menuObj.appendTo(menu);
            }
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toobar);
        this.parent.element.insertBefore(toobar, this.parent.element.firstElementChild);
        this.renderMobileToolbar();
    }
    renderMobileToolbar() {
        let toolbarPanel = this.parent.createElement('div', { className: 'e-toolbar-panel e-ribbon' });
        let toolbar = this.parent.createElement('div');
        let ddb = this.parent.createElement('button');
        toolbarPanel.appendChild(toolbar);
        toolbarPanel.appendChild(ddb);
        toolbarPanel.style.display = 'block';
        this.parent.element.appendChild(toolbarPanel);
        let ddbObj = new DropDownButton({
            cssClass: 'e-caret-hide',
            content: this.ribbon.items[1].header.text,
            items: [
                { text: this.ribbon.items[1].header.text },
                { text: this.ribbon.items[2].header.text },
                { text: this.ribbon.items[3].header.text }
            ],
            select: (args) => {
                if (args.item.text !== ddbObj.content) {
                    toolbarObj.element.style.display = 'none';
                    ddbObj.content = args.item.text;
                    ddbObj.dataBind();
                    toolbarObj.items = this.ribbon.items[ddbObj.items.indexOf(args.item) + 1].content;
                    toolbarObj.width = `calc(100% - ${ddb.getBoundingClientRect().width}px)`;
                    toolbarObj.element.style.display = '';
                    toolbarObj.dataBind();
                    toolbarObj.items[0].text = args.item.text;
                    toolbarObj.dataBind();
                }
            },
            open: (args) => {
                let element = args.element.parentElement;
                let clientRect = element.getBoundingClientRect();
                let offset = calculatePosition(ddbObj.element, 'right', 'bottom');
                element.style.left = `${offset.left - clientRect.width}px`;
                element.style.top = `${offset.top - clientRect.height}px`;
                for (let i = 0; i < ddbObj.items.length; i++) {
                    if (ddbObj.content === ddbObj.items[i].text) {
                        args.element.children[i].classList.add('e-selected');
                        break;
                    }
                }
            },
            close: () => this.parent.element.focus()
        });
        ddbObj.createElement = this.parent.createElement;
        ddbObj.appendTo(ddb);
        let toolbarObj = new Toolbar({
            width: `calc(100% - ${ddb.getBoundingClientRect().width}px)`,
            items: this.ribbon.items[1].content,
            clicked: this.toolbarClicked.bind(this)
        });
        toolbarObj.createElement = this.parent.createElement;
        toolbarObj.appendTo(toolbar);
        toolbarPanel.style.display = '';
    }
    fileMenuBeforeOpen(args) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let wrapper;
        let contents = ['.xlsx', '.xls', '.csv'];
        if (args.parentItem.text === l10n.getConstant('SaveAs')) {
            [].slice.call(args.element.children).forEach((li, index) => {
                wrapper = this.parent.createElement('div', { innerHTML: li.innerHTML });
                li.innerHTML = '';
                wrapper.appendChild(this.parent.createElement('span', { className: 'e-extension', innerHTML: contents[index] }));
                li.appendChild(wrapper);
            });
        }
        this.parent.trigger('fileMenuBeforeOpen', args);
    }
    fileMenuBeforeClose(args) {
        this.parent.trigger('fileMenuBeforeClose', args);
    }
    addEventListener() {
        this.parent.on(ribbon, this.initRibbon, this);
        this.parent.on(enableRibbonItems, this.enableRibbonItems, this);
        this.parent.on(activeCellChanged, this.refreshRibbonContent, this);
        this.parent.on(enableToolbar, this.enableToolbar, this);
    }
    destroy() {
        let parentElem = this.parent.element;
        let ribbonEle = this.ribbon.element;
        let id = parentElem.id;
        destroyComponent(parentElem.querySelector('#' + id + '_paste'), SplitButton);
        destroyComponent(parentElem.querySelector('#' + id + '_number_format'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_size'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_font_name'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_text_align'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_vertical_align'), DropDownButton);
        destroyComponent(parentElem.querySelector('#' + id + '_sorting'), DropDownButton);
        ['bold', 'italic', 'line-through', 'underline'].forEach((name) => {
            destroyComponent(parentElem.querySelector('#' + `${id}_${name}`), Button);
        });
        this.ribbon.destroy();
        if (ribbonEle) {
            detach(ribbonEle);
        }
        this.ribbon = null;
        this.removeEventListener();
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(ribbon, this.initRibbon);
            this.parent.off(enableRibbonItems, this.enableRibbonItems);
            this.parent.off(activeCellChanged, this.refreshRibbonContent);
            this.parent.on(enableToolbar, this.enableToolbar, this);
        }
    }
}

/**
 * Represents Formula bar for Spreadsheet.
 */
class FormulaBar {
    constructor(parent) {
        this.categoryCollection = [];
        this.formulaCollection = [];
        this.parent = parent;
        this.addEventListener();
    }
    getModuleName() {
        return 'formulaBar';
    }
    createFormulaBar(args) {
        if (!this.parent.showFormulaBar && this.insertFnRipple) {
            this.destroy();
            return;
        }
        let l10n = this.parent.serviceLocator.getService(locale);
        let id = this.parent.element.id;
        let fBarWrapper = this.parent.createElement('div', { className: 'e-formula-bar-panel' });
        if (!this.parent.isMobileView()) {
            let nameBox = this.parent.createElement('input', { id: id + '_name_box', attrs: { type: 'text' } });
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
                change: (args) => {
                    /** */
                }
            });
            this.comboBoxInstance.createElement = this.parent.createElement;
            this.comboBoxInstance.appendTo(nameBox);
            this.comboBoxInstance.element.parentElement.title = l10n.getConstant('NameBox');
        }
        let insertFnBtn = fBarWrapper.appendChild(this.parent.createElement('button', {
            className: 'e-btn e-css e-flat e-icon-btn e-insert-function', attrs: { 'title': l10n.getConstant('InsertFunction') }
        }));
        insertFnBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons' }));
        this.insertFnRipple = rippleEffect(fBarWrapper, { selector: '.e-insert-function' });
        fBarWrapper.appendChild(this.parent.createElement('div', { className: 'e-separator' }));
        let textarea = fBarWrapper.appendChild(this.parent.createElement('textarea', {
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
    }
    textAreaFocusIn(e) {
        let formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        let tickBtn = this.parent.createElement('button', { className: 'e-btn e-css e-flat e-icon-btn e-formula-submit' });
        tickBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-tick-icon' }));
        formulaPanel.classList.add('e-focused');
        formulaPanel.appendChild(tickBtn);
    }
    textAreaFocusOut(e) {
        let formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        formulaPanel.classList.remove('e-focused');
        detach(formulaPanel.querySelector('.e-formula-submit'));
    }
    keyDownHandler(e) {
        let trgtElem = e.target;
        if (this.parent.isEdit) {
            if (trgtElem.classList.contains('e-formula-bar')) {
                this.parent.notify(editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
            }
        }
    }
    keyUpHandler(e) {
        if (this.parent.isEdit) {
            let trgtElem = e.target;
            if (trgtElem.classList.contains('e-formula-bar')) {
                let eventArg = { action: 'getCurrentEditValue', editedValue: '' };
                this.parent.notify(editOperation, eventArg);
                if (eventArg.editedValue !== trgtElem.value) {
                    this.parent.notify(editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
                }
            }
        }
    }
    nameBoxBeforeOpen(args) {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            args.cancel = true;
        }
        else {
            this.comboBoxInstance.element.select();
        }
    }
    nameBoxBlur(args) {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            this.comboBoxInstance.element.classList.remove('e-name-editing');
            this.UpdateValueAfterMouseUp();
        }
    }
    nameBoxSelect(args) {
        if (args.isInteracted) {
            let refersTo = args.itemData.refersTo.substr(1);
            let sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(refersTo));
            let range = getRangeFromAddress(refersTo);
            let sheet = getSheet(this.parent, sheetIdx);
            if ((sheetIdx + 1) === this.parent.activeSheetTab) {
                this.parent.selectRange(range);
                this.parent.element.focus();
            }
            else {
                updateSelectedRange(this.parent, range, sheet);
                this.parent.activeSheetTab = sheetIdx + 1;
            }
        }
    }
    formulaBarUpdateHandler(e) {
        let range = this.parent.getActiveSheet().selectedRange.split(':');
        let address;
        let intl = new Internationalization();
        if (e.type === 'mousemove' || e.type === 'pointermove') {
            let indexes1 = getRangeIndexes(range[0]);
            let indexes2 = getRangeIndexes(range[1]);
            address = `${Math.abs(indexes1[0] - indexes2[0]) + 1}R x ${Math.abs(indexes1[1] - indexes2[1]) + 1}C`;
        }
        else {
            address = range[0];
            let data = this.parent.getData(`${getSheetName(this.parent)}!${address}`);
            data.then((values) => {
                let value = '';
                let intDate;
                values.forEach((cell, key) => {
                    let type = cell && cell.format ? getTypeFromFormat(cell.format) : 'General';
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
                    document.getElementById(this.parent.element.id + '_formula_input').value = value;
                });
            });
        }
        this.updateComboBoxValue(address);
    }
    UpdateValueAfterMouseUp() {
        this.updateComboBoxValue(this.parent.getActiveSheet().selectedRange.split(':')[0]);
    }
    updateComboBoxValue(value) {
        let sheet = this.parent.getActiveSheet();
        let range = getSheetName(this.parent) + '!' + sheet.selectedRange;
        let eventArgs = {
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
    }
    clickHandler(e) {
        let target = e.target;
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
                let eventArgs = { action: 'getNames', names: [] };
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
            let isOpen = !this.parent.isEdit;
            let args = { action: 'getCurrentEditValue', editedValue: '' };
            if (!isOpen) {
                let eventArgs = { action: 'isFormulaEditing', isFormulaEdit: false };
                this.parent.notify(formulaOperation, eventArgs);
                isOpen = eventArgs.isFormulaEdit;
                this.parent.notify(editOperation, args);
            }
            if (isOpen || args.editedValue === '') {
                if (args.editedValue === '') {
                    this.parent.notify(editOperation, { action: 'refreshEditor', value: '=' });
                }
                let l10n = this.parent.serviceLocator.getService(locale);
                let formulaDescription = this.parent.createElement('div', { className: 'e-formula-description', id: this.parent.element.id + '_description_content' });
                let categoryContent = this.parent.createElement('div', {
                    className: 'e-category-content', id: this.parent.element.id + '_category_content',
                    innerHTML: l10n.getConstant('PickACategory')
                });
                let dropDownElement = this.parent.createElement('input', { className: 'e-formula-category', id: this.parent.element.id + '_formula_category' });
                let listViewElement = this.parent.createElement('div', { className: 'e-formula-list', id: this.parent.element.id + '_formula_list' });
                let descriptionContent = this.parent.createElement('div', { className: 'e-description-content', innerHTML: l10n.getConstant('Description') });
                let headerContent = this.parent.createElement('div', { className: 'e-header-content', innerHTML: l10n.getConstant('InsertFunction') });
                let categoryArgs = {
                    action: 'getFormulaCategory', categoryCollection: []
                };
                this.parent.notify(workbookFormulaOperation, categoryArgs);
                this.categoryCollection = categoryArgs.categoryCollection;
                this.categoryList = new DropDownList({
                    dataSource: this.categoryCollection, index: 0, width: '285px', popupHeight: '210px',
                    select: this.dropDownSelect.bind(this)
                });
                let listArgs = {
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
                    beforeOpen: () => this.parent.element.focus(),
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
    }
    toggleFormulaBar(target) {
        let parent = target.parentElement;
        let l10n = this.parent.serviceLocator.getService(locale);
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
    }
    dialogOpen() {
        this.focusOkButton();
    }
    dialogClose() {
        let args = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, args);
        if (args.editedValue.toString().trim() === '=') {
            this.parent.notify(editOperation, { action: 'refreshEditor', value: '' });
        }
    }
    dialogBeforeClose() {
        EventHandler.remove(this.formulaList.element, 'dblclick', this.formulaClickHandler);
        let dialogContentEle = document.getElementById('_dialog-content');
        dialogContentEle.parentNode.removeChild(dialogContentEle);
        /* tslint:disable-next-line:no-any */
        this.dialog.dialogInstance.storeActiveElement = document.getElementById(this.parent.element.id + '_edit');
    }
    selectFormula(dialog, formulaBarObj) {
        let formulaText = formulaBarObj.formulaList.getSelectedItems().text;
        let sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
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
    }
    listSelected() {
        this.updateFormulaDescription();
    }
    updateFormulaList() {
        this.activeListFormula();
        this.updateFormulaDescription();
    }
    dropDownSelect(args) {
        this.formulaCollection = [];
        let listArgs = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        if (args.item.textContent === 'All') {
            this.parent.notify(workbookFormulaOperation, listArgs);
            this.formulaCollection = listArgs.formulaCollection;
        }
        else {
            let category = args.item.textContent;
            let selectArgs = {
                action: 'dropDownSelectFormulas',
                formulaCollection: [],
                selectCategory: category,
            };
            this.parent.notify(workbookFormulaOperation, selectArgs);
            this.formulaCollection = selectArgs.formulaCollection;
        }
        this.formulaList.dataSource = this.formulaCollection.sort();
    }
    focusOkButton() {
        let focusEle = document.getElementById('_dialog-content');
        (focusEle.nextElementSibling.firstElementChild).focus();
    }
    activeListFormula() {
        let acListEle = document.getElementById(this.parent.element.id + '_formula_list');
        let firstElement = acListEle.children[0].children[0].firstElementChild;
        this.formulaList.selectItem(firstElement);
    }
    updateFormulaDescription() {
        let descriptionArea;
        let selectedFormula = this.formulaList.getSelectedItems().text;
        let descriptionArgs = {
            action: 'getFormulaDescription',
            description: '',
            selectedList: selectedFormula,
        };
        this.parent.notify(workbookFormulaOperation, descriptionArgs);
        this.focusOkButton();
        descriptionArea = document.getElementById(this.parent.element.id + '_description_content');
        descriptionArea.innerHTML = this.parent.serviceLocator.getService(locale).getConstant(selectedFormula);
    }
    formulaClickHandler(args) {
        let trgtElem = args.target;
        let sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
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
    }
    addEventListener() {
        this.parent.on(formulaBar, this.createFormulaBar, this);
        this.parent.on(click, this.clickHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(selectionComplete, this.formulaBarUpdateHandler, this);
        this.parent.on(mouseUpAfterSelection, this.UpdateValueAfterMouseUp, this);
        this.parent.on(formulaBarOperation, this.editOperationHandler, this);
    }
    destroy() {
        this.removeEventListener();
        this.comboBoxInstance.destroy();
        this.comboBoxInstance = null;
        this.insertFnRipple();
        this.insertFnRipple = null;
        let formulaPanel = this.parent.element.querySelector('.e-formula-bar-panel');
        if (formulaPanel) {
            detach(formulaPanel);
        }
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaBar, this.createFormulaBar);
            this.parent.off(click, this.clickHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(selectionComplete, this.formulaBarUpdateHandler);
            this.parent.off(mouseUpAfterSelection, this.UpdateValueAfterMouseUp);
            this.parent.off(formulaBarOperation, this.editOperationHandler);
        }
    }
    editOperationHandler(args) {
        let action = args.action;
        switch (action) {
            case 'refreshFormulabar':
                this.getFormulaBar().value = args.value;
                break;
            case 'getPosition':
                args.position = this.getFormulaBar().getBoundingClientRect();
                break;
        }
    }
    getFormulaBar() {
        return this.parent.element.querySelector('#' + this.parent.element.id + '_formula_input');
    }
}

/**
 * @hidden
 * The `Formula` module is used to handle the formulas and its functionalities in Spreadsheet.
 */
class Formula {
    /**
     * Constructor for formula module in Spreadsheet.
     * @private
     */
    constructor(parent) {
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
    getModuleName() {
        return 'formula';
    }
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        if (this.autocompleteInstance) {
            this.autocompleteInstance.destroy();
        }
        this.autocompleteInstance = null;
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(formulaOperation, this.performFormulaOperation, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(click, this.clickHandler, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaOperation, this.performFormulaOperation);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(click, this.clickHandler);
        }
    }
    performFormulaOperation(args) {
        let action = args.action;
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
                let l10n = this.parent.serviceLocator.getService(locale);
                let dialogInst = this.parent.serviceLocator.getService(dialog);
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('CircularReference'),
                });
                args.argValue = '0';
                break;
        }
    }
    renderAutoComplete() {
        if (!this.parent.element.querySelector('#' + this.parent.element.id + '_ac')) {
            let acElem = this.parent.createElement('input', { id: this.parent.element.id + '_ac', className: 'e-ss-ac' });
            this.parent.element.appendChild(acElem);
            let eventArgs = {
                action: 'getLibraryFormulas',
                formulaCollection: []
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            let autoCompleteOptions = {
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
    }
    onSuggestionOpen(e) {
        this.isPopupOpened = true;
        let position = this.getPopupPosition();
        e.popup.offsetX = position.left;
        e.popup.offsetY = (position.top + position.height);
        e.popup.refreshPosition();
        e.popup.element.firstChild.style.maxHeight = '180px';
        new Promise((resolve, reject) => {
            setTimeout(() => { resolve(); }, 100);
        }).then(() => {
            this.triggerKeyDownEvent(this.keyCodes.DOWN);
        });
    }
    onSuggestionClose(e) {
        if (this.isPreventClose) {
            e.cancel = true;
        }
        else {
            this.isPopupOpened = false;
        }
    }
    onSelect(e) {
        let updatedFormulaValue = '=' + e.itemData.value + '(';
        if (this.isSubFormula) {
            let editValue = this.getEditingValue();
            let parseIndex = editValue.lastIndexOf(this.getArgumentSeparator());
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
    }
    onSuggestionComplete(args) {
        this.isPreventClose = args.result.length > 0;
        if (!this.isPreventClose) {
            args.cancel = true;
            this.hidePopUp();
        }
    }
    keyUpHandler(e) {
        if (this.parent.isEdit) {
            let editValue = this.getEditingValue();
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
    }
    keyDownHandler(e) {
        let keyCode = e.keyCode;
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
            let trgtElem = e.target;
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
    }
    clickHandler(e) {
        if (this.parent.isEdit) {
            let trgtElem = e.target;
            this.isFormulaBar = trgtElem.classList.contains('e-formula-bar');
        }
    }
    refreshFormulaSuggestion(e, formula) {
        if (formula.length > 0) {
            let autoCompleteElem = this.autocompleteInstance.element;
            let keyCode = e.keyCode;
            let isSuggestionAlreadyOpened = this.isPopupOpened;
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
    }
    endEdit() {
        this.isSubFormula = false;
        this.isPreventClose = false;
        this.isFormula = false;
        this.isFormulaBar = false;
        if (this.isPopupOpened) {
            this.hidePopUp();
            let suggPopupElem = document.querySelector('#' + this.parent.element.id + '_ac_popup');
            if (suggPopupElem) {
                detach(suggPopupElem);
            }
            this.isPopupOpened = false;
        }
    }
    hidePopUp() {
        this.autocompleteInstance.hidePopup();
    }
    getSuggestionKeyFromFormula(formula) {
        let suggestValue = '';
        formula = formula.substr(1); //remove = char.
        if (formula) {
            let bracketIndex = formula.lastIndexOf('(');
            formula = formula.substr(bracketIndex + 1);
            let fSplit = formula.split(this.getArgumentSeparator());
            if (fSplit.length === 1) {
                suggestValue = fSplit[0];
                this.isSubFormula = bracketIndex > -1;
            }
            else {
                suggestValue = fSplit[fSplit.length - 1];
                this.isSubFormula = true;
            }
            let isAlphaNumeric = suggestValue.match(/\w/);
            if (!isAlphaNumeric || (isAlphaNumeric && isAlphaNumeric.index !== 0)) {
                suggestValue = '';
            }
        }
        return suggestValue;
    }
    getPopupPosition() {
        let eventArgs = { position: null };
        if (this.isFormulaBar) {
            eventArgs.action = 'getPosition';
            this.parent.notify(formulaBarOperation, eventArgs);
        }
        else {
            eventArgs.action = 'getPosition';
            this.parent.notify(editOperation, eventArgs);
        }
        return eventArgs.position;
    }
    getEditingValue() {
        let eventArgs = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        return eventArgs.editedValue;
    }
    isNavigationKey(keyCode) {
        return (keyCode === this.keyCodes.UP) || (keyCode === this.keyCodes.DOWN) || (keyCode === this.keyCodes.LEFT)
            || (keyCode === this.keyCodes.RIGHT);
    }
    triggerKeyDownEvent(keyCode) {
        let autoCompleteElem = this.autocompleteInstance.element;
        autoCompleteElem.dispatchEvent(new Event('input'));
        let eventArg = new Event('keydown');
        // tslint:disable:no-string-literal
        eventArg['keyCode'] = keyCode;
        eventArg['which'] = keyCode;
        eventArg['altKey'] = false;
        eventArg['shiftKey'] = false;
        eventArg['ctrlKey'] = false;
        // tslint:enable:no-string-literal
        autoCompleteElem.dispatchEvent(eventArg);
    }
    getArgumentSeparator() {
        if (this.argumentSeparator) {
            return this.argumentSeparator;
        }
        else {
            let eventArgs = {
                action: 'getArgumentSeparator', argumentSeparator: ''
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
            this.argumentSeparator = eventArgs.argumentSeparator;
            return eventArgs.argumentSeparator;
        }
    }
    getNames(sheetName) {
        let names = this.parent.definedNames.filter((name) => name.scope === '' || name.scope === sheetName);
        return names;
    }
    getNameFromRange(range) {
        let singleRange = range.slice(0, range.indexOf(':'));
        let sRange = range.slice(range.indexOf('!') + 1).split(':');
        let isSingleCell = sRange.length > 1 && sRange[0] === sRange[1];
        let name = this.parent.definedNames.filter((name, index) => {
            if (isSingleCell && name.refersTo === '=' + singleRange) {
                return true;
            }
            return name.refersTo === '=' + range;
        });
        return name && name[0];
    }
    addDefinedName(definedName) {
        if (!definedName.refersTo) {
            let sheet = getSheet(this.parent, this.parent.activeSheetTab - 1);
            let selectRange$$1 = sheet.selectedRange;
            if (!isNullOrUndefined(selectRange$$1)) {
                let colIndex = selectRange$$1.indexOf(':');
                let left = selectRange$$1.substr(0, colIndex);
                let right = selectRange$$1.substr(colIndex + 1, selectRange$$1.length);
                selectRange$$1 = left === right ? left : selectRange$$1;
            }
            definedName.refersTo = getSheetName(this.parent) + '!' + selectRange$$1;
        }
        let eventArgs = {
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
    }
}

/**
 * Represents SheetTabs for Spreadsheet.
 */
class SheetTabs {
    constructor(parent) {
        this.aggregateContent = '';
        this.parent = parent;
        this.addEventListener();
    }
    getModuleName() {
        return 'sheetTabs';
    }
    createSheetTabs() {
        if (!this.parent.showSheetTabs && this.tabInstance) {
            this.destroy();
            return;
        }
        let l10n = this.parent.serviceLocator.getService(locale);
        let panel = this.parent.createElement('div', {
            className: 'e-sheet-tab-panel', id: this.parent.element.id + '_sheet_tab_panel'
        });
        let addBtn = this.parent.createElement('button', {
            className: 'e-add-sheet-tab e-btn e-css e-flat e-icon-btn', attrs: { 'title': l10n.getConstant('AddSheet') }
        });
        addBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-add-icon' }));
        addBtn.addEventListener('click', this.addSheetTab.bind(this));
        panel.appendChild(addBtn);
        this.addBtnRipple = rippleEffect(panel, { selector: '.e-add-sheet-tab' });
        let ddb = this.parent.createElement('button', { attrs: { 'title': l10n.getConstant('ListAllSheets') } });
        panel.appendChild(ddb);
        this.parent.element.appendChild(panel);
        let items = this.getSheetTabItems();
        this.dropDownInstance = new DropDownButton({
            iconCss: 'e-icons',
            items: items.ddbItems,
            select: (args) => this.updateSheetTab({ idx: this.dropDownInstance.items.indexOf(args.item) }),
            beforeOpen: (args) => this.beforeOpenHandler(this.dropDownInstance, args.element),
            open: (args) => this.openHandler(this.dropDownInstance, args.element, 'left'),
            cssClass: 'e-sheets-list e-flat e-caret-hide',
            close: () => this.parent.element.focus()
        });
        this.dropDownInstance.createElement = this.parent.createElement;
        this.dropDownInstance.appendTo(ddb);
        let sheetTab = this.parent.createElement('div', { className: 'e-sheet-tab' });
        this.tabInstance = new Tab({
            selectedItem: 0,
            overflowMode: 'Scrollable',
            items: items.tabItems,
            scrollStep: 250,
            selecting: (args) => {
                /** */
            },
            selected: (args) => {
                if (args.selectedIndex === args.previousIndex) {
                    return;
                }
                this.parent.activeSheetTab = args.selectedIndex + 1;
                this.parent.dataBind();
                this.updateDropDownItems(args.selectedIndex, args.previousIndex);
                this.parent.element.focus();
            },
            created: () => {
                let tBarItems = this.tabInstance.element.querySelector('.e-toolbar-items');
                tBarItems.classList.add('e-sheet-tabs-items');
                EventHandler.add(tBarItems, 'dblclick', this.renameSheetTab, this);
            },
        });
        panel.appendChild(sheetTab);
        this.tabInstance.createElement = this.parent.createElement;
        this.tabInstance.appendTo(sheetTab);
        // tslint:disable-next-line:no-any
        EventHandler.remove(this.tabInstance.element, 'keydown', this.tabInstance.spaceKeyDown);
    }
    updateDropDownItems(curIdx, prevIdx) {
        if (prevIdx > -1) {
            this.dropDownInstance.items[prevIdx].iconCss = '';
        }
        this.dropDownInstance.items[curIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
    }
    beforeOpenHandler(instance, element) {
        let viewportHeight = this.parent.viewport.height;
        let actualHeight = (parseInt(getComputedStyle(element.firstElementChild).height, 10) *
            instance.items.length) + (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            element.style.height = `${viewportHeight}px`;
            element.style.overflowY = 'auto';
        }
        element.parentElement.style.visibility = 'hidden';
    }
    openHandler(instance, element, positionX) {
        let wrapper = element.parentElement;
        let height;
        let collide = isCollide(wrapper);
        if (collide.indexOf('bottom') === -1) {
            height = element.style.overflowY === 'auto' ? this.parent.viewport.height : wrapper.getBoundingClientRect().height;
            let offset = calculatePosition(instance.element, positionX, 'top');
            if (positionX === 'right') {
                offset.left -= wrapper.getBoundingClientRect().width;
            }
            wrapper.style.left = `${offset.left}px`;
            wrapper.style.top = `${offset.top - height}px`;
        }
        wrapper.style.visibility = '';
    }
    getSheetTabItems() {
        let tabItems = [];
        let ddbItems = [];
        let sheetName;
        this.parent.sheets.forEach((sheet, index) => {
            sheetName = getSheetName(this.parent, index + 1);
            tabItems.push({ header: { 'text': sheetName } });
            ddbItems.push({ text: sheetName, iconCss: index + 1 === this.parent.activeSheetTab ? 'e-selected-icon e-icons' : '' });
        });
        return { tabItems: tabItems, ddbItems: ddbItems };
    }
    refreshSheetTab() {
        let items = this.getSheetTabItems();
        this.dropDownInstance.items = items.ddbItems;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.items = items.tabItems;
        this.tabInstance.selectedItem = this.parent.activeSheetTab - 1;
        this.tabInstance.dataBind();
    }
    addSheetTab(args) {
        let idx = args.text && args.text === 'Insert' ? this.parent.activeSheetTab - 1 : this.parent.activeSheetTab;
        this.parent.createSheet(idx);
        let sheetName = this.parent.sheets[idx].name;
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
    }
    updateSheetTab(args) {
        this.tabInstance.selectedItem = args.idx;
        this.tabInstance.dataBind();
    }
    switchSheetTab(args) {
        let target = closest(args.event.target, '.e-toolbar-item');
        if (!target) {
            return;
        }
        let text = target.querySelector('.e-tab-text').textContent;
        for (let i = 0, len = this.tabInstance.items.length; i < len; i++) {
            if (this.tabInstance.items[i].header.text === text) {
                if (this.parent.activeSheetTab - 1 !== i) {
                    this.updateSheetTab({ idx: i });
                }
                break;
            }
        }
    }
    renameSheetTab() {
        let target = this.tabInstance.element.querySelector('.e-toolbar-item.e-active');
        if (target) {
            target = target.querySelector('.e-text-wrap');
            let value = target.querySelector('.e-tab-text').textContent;
            let input = this.parent.createElement('input', {
                id: this.parent.element.id + '_rename_input',
                className: 'e-input e-sheet-rename', styles: `width: ${target.getBoundingClientRect().width}px`, attrs: {
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
    }
    updateWidth(e) {
        let target = e.target;
        let len = target.value.length;
        let value = target.value.split(' ');
        if (value.length) {
            let spaceLen = value.length - 1;
            len -= spaceLen;
            len += (spaceLen * 0.5);
        }
        target.style.width = `${len}ch`;
    }
    renameInputFocusOut(e) {
        let target = e.target;
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
        let value = target.value;
        let l10n = this.parent.serviceLocator.getService(locale);
        if (value) {
            let idx = this.tabInstance.selectedItem;
            if (!value.match(new RegExp('.*[\\[\\]\\*\\\\\/\\?].*'))) {
                if (this.tabInstance.items[idx].header.text !== value) {
                    for (let i = 0, len = this.parent.sheets.length; i < len; i++) {
                        if (i + 1 !== this.parent.activeSheetTab && this.parent.sheets[i].name.toLowerCase() === value.toLowerCase()) {
                            this.showRenameDialog(target, l10n.getConstant('SheetRenameAlreadyExistsAlert'));
                            return;
                        }
                    }
                }
                let items = this.removeRenameInput(target);
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
    }
    removeRenameInput(target) {
        let textEle = target.parentElement.querySelector('.e-tab-text');
        let sheetItems = closest(target, '.e-toolbar-items');
        EventHandler.add(sheetItems, 'dblclick', this.renameSheetTab, this);
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        EventHandler.remove(target, 'input', this.updateWidth);
        remove(target);
        textEle.style.display = '';
        return sheetItems;
    }
    showRenameDialog(target, content) {
        this.parent.serviceLocator.getService(dialog).show({
            target: document.getElementById(this.parent.element.id + '_sheet_panel'),
            height: 180, width: 400, isModal: true, showCloseIcon: true,
            content: content,
            beforeOpen: () => target.focus(),
            close: () => target.setSelectionRange(0, target.value.length)
        });
    }
    focusRenameInput() {
        let input = document.getElementById(this.parent.element.id + '_rename_input');
        if (input) {
            input.focus();
        }
    }
    removeSheetTab(args) {
        let l10n = this.parent.serviceLocator.getService(locale);
        if (this.parent.sheets.length > 1) {
            let sheet = this.parent.getActiveSheet();
            let isDataAvail = sheet.rows && sheet.rows.length ?
                (sheet.rows.length === 1 ? (sheet.rows[0].cells && sheet.rows[0].cells.length ? true : false) : true) : false;
            if (isDataAvail) {
                let dialogInst = this.parent.serviceLocator.getService(dialog);
                dialogInst.show({
                    height: 180, width: 400, isModal: true, showCloseIcon: true,
                    content: l10n.getConstant('DeleteSheetAlert'),
                    beforeOpen: () => this.parent.element.focus(),
                    buttons: [{
                            buttonModel: {
                                content: l10n.getConstant('Ok'), isPrimary: true
                            },
                            click: () => {
                                dialogInst.hide();
                                this.destroySheet();
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
                beforeOpen: () => this.parent.element.focus()
            });
        }
    }
    destroySheet() {
        let activeSheetIdx = this.parent.activeSheetTab - 1;
        this.parent.removeSheet(activeSheetIdx);
        this.parent.notify(sheetsDestroyed, { sheetIndex: activeSheetIdx });
        this.dropDownInstance.items.splice(activeSheetIdx, 1);
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.removeTab(activeSheetIdx);
        this.parent.setProperties({ 'activeSheetTab': this.tabInstance.selectedItem + 1 }, true);
        this.parent.renderModule.refreshSheet();
        this.updateDropDownItems(this.tabInstance.selectedItem);
        this.parent.element.focus();
    }
    showAggregate() {
        if (isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            return;
        }
        getUpdateUsingRaf(() => {
            let eventArgs = { Count: 0, Sum: '0', Avg: '0', Min: '0', Max: '0' };
            this.parent.notify(aggregateComputation, eventArgs);
            if (eventArgs.Count) {
                if (!this.aggregateContent) {
                    this.aggregateContent = eventArgs.Sum ? 'Sum' : 'Count';
                }
                let key = this.aggregateContent;
                let content = `${key}: ${eventArgs[key]}`;
                if (!this.aggregateDropDown) {
                    let aggregateEle = this.parent.createElement('button');
                    document.getElementById(`${this.parent.element.id}_sheet_tab_panel`).appendChild(aggregateEle);
                    this.aggregateDropDown = new DropDownButton({
                        content: content,
                        items: this.getAggregateItems(eventArgs),
                        select: (args) => this.updateAggregateContent(args.item.text, eventArgs),
                        beforeOpen: (args) => this.beforeOpenHandler(this.aggregateDropDown, args.element),
                        open: (args) => this.openHandler(this.aggregateDropDown, args.element, 'right'),
                        close: () => this.parent.element.focus(),
                        cssClass: 'e-aggregate-list e-flat'
                    });
                    this.aggregateDropDown.createElement = this.parent.createElement;
                    this.aggregateDropDown.appendTo(aggregateEle);
                }
                else {
                    this.updateAggregateContent(content, eventArgs);
                }
            }
        });
    }
    getAggregateItems(args) {
        let items = [];
        let text;
        let iconCss;
        Object.keys(args).forEach((key) => {
            if (args[key] !== aggregateComputation) {
                text = `${key}: ${args[key]}`;
                iconCss = key === this.aggregateContent ? 'e-selected-icon e-icons' : '';
                items.push({ text: text, iconCss: iconCss });
            }
        });
        return items;
    }
    updateAggregateContent(text, eventArgs) {
        this.aggregateContent = text.split(': ')[0];
        this.aggregateDropDown.content = text;
        this.aggregateDropDown.dataBind();
        this.aggregateDropDown.setProperties({ 'items': this.getAggregateItems(eventArgs) }, true);
    }
    removeAggregate() {
        if (this.aggregateDropDown && isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            this.aggregateDropDown.destroy();
            remove(this.aggregateDropDown.element);
            this.aggregateDropDown = null;
        }
    }
    addEventListener() {
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
    }
    destroy() {
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
        let ele = document.getElementById(this.parent.element.id + '_sheet_tab_panel');
        if (ele) {
            remove(ele);
        }
        this.parent = null;
    }
    removeEventListener() {
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
    }
}

class Open {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        this.renderFileUpload();
        //Spreadsheet.Inject(WorkbookOpen);
    }
    /**
     * Adding event listener for success and failure
     */
    addEventListener() {
        this.parent.on(openSuccess, this.openSuccess, this);
        this.parent.on(openFailure, this.openFailed, this);
    }
    /**
     * Removing event listener for success and failure
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(openSuccess, this.openSuccess);
            this.parent.off(openFailure, this.openFailed);
        }
    }
    /**
     * Rendering upload component for importing files.
     */
    renderFileUpload() {
        let uploadID = this.parent.element.id + '_fileUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.xls, .xlsx, .csv', name: 'fileUpload' }
        }));
        let uploadBox = document.getElementById(uploadID);
        uploadBox.onchange = this.fileSelect.bind(this);
        uploadBox.onerror = this.openFailed.bind(this);
        uploadBox.style.display = 'none';
    }
    /**
     * Process after select the excel and image file.
     * @param {Event} args - File select native event.
     */
    fileSelect(args) {
        /* tslint:disable-next-line:no-any */
        let filesData = args.target.files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        let impArgs = {
            file: filesData
        };
        this.parent.open(impArgs);
        document.getElementById(this.parent.element.id + '_fileUpload').value = '';
    }
    /**
     * File open success event declaration.
     * @param {string} response - File open success response text.
     */
    openSuccess(response) {
        let openError = ['UnsupportedFile', 'InvalidUrl'];
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
    }
    /**
     * File open failure event declaration.
     * @param {object} args - Open failure arguments.
     */
    openFailed(args) {
        this.parent.trigger('openFailure', args);
        this.parent.hideSpinner();
        /* Need to Implement */
    }
    /**
     * To Remove the event listeners.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the sheet open module name.
     */
    getModuleName() {
        return 'open';
    }
}

/**
 * `Save` module is used to handle the save action in Spreadsheet.
 */
class Save {
    /**
     * Constructor for Save module in Spreadsheet.
     * @private
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookSave);
    }
    /**
     * To destroy the Save module.
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(beginSave, this.initiateSave, this);
        this.parent.on(saveCompleted, this.saveCompleted, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
            this.parent.off(saveCompleted, this.saveCompleted);
        }
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'save';
    }
    /**
     * Initiate save process.
     * @hidden
     */
    initiateSave(args) {
        this.parent.showSpinner();
    }
    /**
     * Save action completed.
     * @hidden
     */
    saveCompleted(args) {
        this.parent.hideSpinner();
    }
}

/**
 * Represents context menu for Spreadsheet.
 */
class ContextMenu$1 {
    /**
     * Constructor for ContextMenu module.
     */
    constructor(parent) {
        this.parent = parent;
        this.init();
    }
    init() {
        this.initContextMenu();
        this.addEventListener();
    }
    initContextMenu() {
        let ul = document.createElement('ul');
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
    }
    /**
     * Before close event handler.
     */
    beforeCloseHandler(args) {
        this.parent.trigger('contextMenuBeforeClose', args);
    }
    /**
     * Select event handler.
     */
    selectHandler(args) {
        let selectArgs = extend({ cancel: false }, args);
        this.parent.trigger('contextMenuItemSelect', selectArgs);
        if (!selectArgs.cancel) {
            let l10n = this.parent.serviceLocator.getService(locale);
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
    }
    /**
     * Before open event handler.
     */
    beforeOpenHandler(args) {
        let target = this.getTarget(args.event.target);
        if (args.element.classList.contains('e-contextmenu')) {
            let items = this.getDataSource(target);
            this.contextMenuInstance.items = items;
            this.contextMenuInstance.dataBind();
        }
        this.parent.trigger('contextMenuBeforeOpen', args);
        this.parent.notify(cMenuBeforeOpen, extend(args, { target: target }));
    }
    /**
     * To get target area based on right click.
     */
    getTarget(target) {
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
    }
    /**
     * To populate context menu items based on target area.
     */
    getDataSource(target) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let items = [];
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
    }
    /**
     * Sets sorting related items to the context menu.
     */
    setSortItems(items) {
        let l10n = this.parent.serviceLocator.getService(locale);
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
    }
    setClipboardData(items, l10n) {
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
    }
    /**
     * To add event listener.
     */
    addEventListener() {
        this.parent.on(addContextMenuItems, this.addItemsHandler, this);
        this.parent.on(removeContextMenuItems, this.removeItemsHandler, this);
        this.parent.on(enableContextMenuItems, this.enableItemsHandler, this);
    }
    /**
     * To add context menu items before / after particular item.
     */
    addItemsHandler(args) {
        if (args.insertAfter) {
            this.contextMenuInstance.insertAfter(args.items, args.text, args.isUniqueId);
        }
        else {
            this.contextMenuInstance.insertBefore(args.items, args.text, args.isUniqueId);
        }
    }
    /**
     * To remove context menu items.
     */
    removeItemsHandler(args) {
        this.contextMenuInstance.removeItems(args.items, args.isUniqueId);
    }
    /**
     * To enable / disable context menu items.
     */
    enableItemsHandler(args) {
        this.contextMenuInstance.enableItems(args.items, args.enable, args.isUniqueId);
    }
    /**
     * To remove event listener.
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(addContextMenuItems, this.addItemsHandler);
            this.parent.off(removeContextMenuItems, this.removeItemsHandler);
            this.parent.off(enableContextMenuItems, this.enableItemsHandler);
        }
    }
    /**
     * To get module name.
     */
    getModuleName() {
        return 'contextMenu';
    }
    /**
     * Destroy method.
     */
    destroy() {
        this.removeEventListener();
        this.contextMenuInstance.destroy();
        let ele = document.getElementById(this.parent.element.id + '_contextmenu');
        if (ele) {
            detach(ele);
        }
        this.parent = null;
    }
}

/**
 * Specifies number format.
 */
class NumberFormat {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookNumberFormat);
    }
    refreshCellElement(args) {
        let cell = this.parent.getCell(args.rowIndex, args.colIndex);
        if (!isNullOrUndefined(cell)) {
            this.parent.refreshNode(cell, args);
        }
    }
    /**
     * Adding event listener for number format.
     * @hidden
     */
    addEventListener() {
        this.parent.on(refreshCellElement, this.refreshCellElement, this);
    }
    /**
     * Removing event listener for number format.
     * @hidden
     */
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(refreshCellElement, this.refreshCellElement);
        }
    }
    /**
     * To Remove the event listeners.
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the workbook import module name.
     */
    getModuleName() {
        return 'numberFormat';
    }
}

/**
 * `Sort` module is used to handle the sort action in Spreadsheet.
 */
class Sort {
    /**
     * Constructor for sort module.
     */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the sort module.
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(validateSortRange, this.validateSortRange, this);
        this.parent.on(beforeSort, this.beforeSortHandler, this);
        this.parent.on(sortComplete, this.sortComplete, this);
        this.parent.on(initiateCustomSort, this.initiateCustomSort, this);
    }
    removeEventListener() {
        if (!this.parent.isDestroyed) {
            this.parent.off(validateSortRange, this.validateSortRange);
            this.parent.off(beforeSort, this.beforeSortHandler);
            this.parent.off(sortComplete, this.sortComplete);
            this.parent.off(initiateCustomSort, this.initiateCustomSort);
        }
    }
    /**
     * Gets the module name.
     * @returns string
     */
    getModuleName() {
        return 'sort';
    }
    /**
     * Validates the range to be sorted.
     */
    validateSortRange(args) {
        args.isValid = this.showRangeAlert(args.range);
    }
    /**
     * Validates the range and shows the alert dialog and return true when invalid.
     * @param address - range address.
     */
    showRangeAlert(address) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let sheet = this.parent.getActiveSheet();
        let rangeStr = address || sheet.selectedRange;
        let range = getSwapRange(getIndexesFromAddress(rangeStr));
        if (range[0] > sheet.usedRange.rowIndex - 1 || range[1] > sheet.usedRange.colIndex) {
            this.parent.serviceLocator.getService(dialog).show({
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('SortOutOfRangeError')
            });
            this.parent.hideSpinner();
            return false;
        }
        return true;
    }
    /**
     * Initiates sort process.
     */
    beforeSortHandler(args) {
        this.parent.showSpinner();
    }
    /**
     * Invoked when the sort action is completed.
     */
    sortComplete(args) {
        let range = getIndexesFromAddress(args.range);
        this.parent.serviceLocator.getService('cell').refreshRange(range);
        this.parent.hideSpinner();
    }
    /**
     * Initiates the custom sort dialog.
     */
    initiateCustomSort() {
        let l10n = this.parent.serviceLocator.getService(locale);
        if (!this.showRangeAlert()) {
            return;
        }
        let dialogInst = this.parent.serviceLocator.getService(dialog);
        dialogInst.show({
            height: 400, width: 560, isModal: true, showCloseIcon: true, cssClass: 'e-customsort-dlg',
            header: l10n.getConstant('CustomSort'),
            beforeOpen: () => {
                dialogInst.dialogInstance.content = this.customSortContent();
                dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                    buttonModel: {
                        content: this.parent.serviceLocator.getService(locale).getConstant('Ok'), isPrimary: true
                    },
                    click: () => {
                        let element = dialogInst.dialogInstance.content;
                        let list = element.getElementsByClassName('e-list-sort e-listview e-lib')[0];
                        let listview = getComponent(list, 'listview');
                        let data = listview.dataSource;
                        this.clearError();
                        let errorElem = element.getElementsByClassName('e-sort-error')[0];
                        errorElem.style.display = 'block';
                        if (!this.validateError(data, element, errorElem)) {
                            dialogInst.hide();
                            let headercheck = element.getElementsByClassName('e-sort-checkheader')[0];
                            let headerCheckbox = getComponent(headercheck, 'checkbox');
                            let hasHeader = headerCheckbox.checked;
                            this.parent.sort({ sortDescriptors: data, containsHeader: hasHeader });
                        }
                    }
                }]
        });
    }
    /**
     * Validates the errors of the sort criteria and displays the error.
     * @param json - listview datasource.
     * @param dialogElem - dialog content element.
     * @param errorElem - element to display error.
     */
    validateError(json, dialogElem, errorElem) {
        //1. All sort criteria must have a column specified. Check the selected sort criteria and try again.
        //2. Column B is being sorted by values more than once. Delete the duplicate sort criteria and try again.
        let l10n = this.parent.serviceLocator.getService(locale);
        let hasEmpty = json.some((element) => element.field.toString() === '');
        if (hasEmpty) {
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown) => {
                let hasError = !getComponent(dropDown, 'dropdownlist').value;
                if (hasError) {
                    dropDown.parentElement.classList.add('e-error');
                }
                return hasError; //breaks the loop if only one error added.
            });
            errorElem.innerText = l10n.getConstant('SortEmptyFieldError');
            return true;
        }
        let temp = new Set();
        let duplicateField = '';
        let hasDuplicate = json.some((element) => {
            duplicateField = element.field.toString();
            return temp.size === temp.add(element.field).size;
        });
        let errorField = '';
        if (hasDuplicate) {
            let count = 0;
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown) => {
                let dropDownList = getComponent(dropDown, 'dropdownlist');
                if (dropDownList.value === duplicateField) {
                    dropDown.parentElement.classList.add('e-error');
                    errorField = dropDownList.text;
                    count++;
                }
                return count === 2; //breaks the loop when 2 errors added.
            });
            errorElem.innerHTML = '<strong>' + errorField + '</strong>' + l10n.getConstant('SortDuplicateFieldError');
            return true;
        }
        return false;
    }
    /**
     * Creates all the elements and generates the dialog content element.
     */
    customSortContent() {
        let dialogElem = this.parent.createElement('div', { className: 'e-sort-dialog' });
        let fields = this.getFields();
        let listId = getUniqueID('customSort');
        let listviewObj = this.getCustomListview(listId);
        this.setHeaderTab(dialogElem, listviewObj, fields);
        let contentElem = this.parent.createElement('div', {
            className: 'e-sort-listsection',
            styles: ''
        });
        dialogElem.appendChild(contentElem);
        let listview = this.parent.createElement('div', { className: 'e-list-sort', styles: '' });
        contentElem.appendChild(listview);
        listviewObj.createElement = this.parent.createElement;
        listviewObj.appendTo(listview);
        this.renderListItem(listId, listviewObj, true, fields);
        let errorElem = this.parent.createElement('div', { className: 'e-sort-error' });
        dialogElem.appendChild(errorElem);
        return dialogElem;
    }
    /**
     * Gets the fields data from the selected range.
     */
    getFields() {
        let sheet = this.parent.getActiveSheet();
        let range = getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //for entire range
            range[0] = 0;
            range[1] = 0;
            range[3] = sheet.usedRange.colIndex;
        }
        let fields = [];
        let fieldName;
        for (range[1]; range[1] <= range[3]; range[1]++) {
            let cell = getCell(range[0], range[1], sheet);
            if (cell && cell.value) {
                let eventArgs = {
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
    }
    /**
     * Creates the header tab for the custom sort dialog.
     * @param dialogElem - dialog content element.
     * @param listviewObj - listview instance.
     * @param fields - fields data.
     */
    setHeaderTab(dialogElem, listviewObj, fields) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let headerTabElement = this.parent.createElement('div', {
            className: 'e-sort-header',
            styles: '',
            innerHTML: ''
        });
        dialogElem.appendChild(headerTabElement);
        let addButton = this.parent.createElement('button', {
            className: 'e-btn e-sort-addbtn e-flat',
            innerHTML: l10n.getConstant('AddColumn')
        });
        let footer = this.parent.element.querySelector('.e-customsort-dlg .e-footer-content');
        footer.insertBefore(addButton, footer.firstElementChild);
        addButton.addEventListener('click', () => {
            if (listviewObj) {
                let listId = getUniqueID('customSort');
                listviewObj.addItem([{ id: listId, text: l10n.getConstant('ThenBy'), field: '', order: 'ascending' }]);
                this.renderListItem(listId, listviewObj, checkHeaderObj.checked, fields, true);
            }
        });
        let checkHeaderObj = new CheckBox({
            label: l10n.getConstant('ContainsHeader'),
            checked: true,
            change: (args) => {
                let fieldsMap = args.checked ? { text: 'text', value: 'value' } : { text: 'value' };
                Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-sort-field e-dropdownlist e-lib'), (dropDown) => {
                    let dropDownListObj = getComponent(dropDown, 'dropdownlist');
                    dropDownListObj.dataSource = null; //reset datasource.
                    dropDownListObj.dataSource = fields;
                    dropDownListObj.fields = fieldsMap;
                    dropDownListObj.dataBind();
                });
            },
            cssClass: 'e-sort-headercheckbox'
        });
        let headerCheckbox = this.parent.createElement('input', {
            className: 'e-sort-checkheader', attrs: { type: 'checkbox' }
        });
        headerTabElement.appendChild(headerCheckbox);
        checkHeaderObj.createElement = this.parent.createElement;
        checkHeaderObj.appendTo(headerCheckbox);
    }
    /**
     * Creates a listview instance.
     * @param listId - unique id of the list item.
     */
    getCustomListview(listId) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let data = [{ id: listId, text: l10n.getConstant('SortBy'), field: '', order: 'ascending' }];
        enableRipple(false);
        let listviewObj = new ListView({
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
    }
    /**
     * Triggers the click event for delete icon.
     * @param element - current list item element.
     * @param listviewObj - listview instance.
     */
    deleteHandler(element, listviewObj) {
        let iconEle = element.getElementsByClassName('e-sort-delete')[0];
        //Event handler to bind the click event for delete icon
        iconEle.addEventListener('click', () => {
            if (element) {
                listviewObj.removeItem(element);
            }
        });
    }
    /**
     * Renders the dropdown and radio button components inside list item.
     * @param id - unique id of the list item.
     * @param listviewObj - listview instance.
     * @param containsHeader - data contains header.
     * @param fields - fields data.
     */
    renderListItem(id, lvObj, containsHeader, fields, btn) {
        let l10n = this.parent.serviceLocator.getService(locale);
        let element = lvObj.element.querySelector('li[data-uid=' + id + ']');
        let fieldsMap = containsHeader ? { text: 'text', value: 'value' } : { text: 'value' };
        let dropDown = element.getElementsByClassName('e-sort-field')[0];
        let dropDownListObj = new DropDownList({
            dataSource: fields,
            width: 'auto',
            fields: fieldsMap,
            placeholder: l10n.getConstant('SelectAColumn'),
            change: (args) => {
                if (!args.value) {
                    return;
                }
                Array.prototype.some.call(lvObj.dataSource, (item) => {
                    if (item.id === id) {
                        item.field = args.value;
                    }
                    return item.id === id; //breaks the loop when proper id found
                });
                this.clearError();
            }
        });
        dropDownListObj.createElement = this.parent.createElement;
        dropDownListObj.appendTo(dropDown);
        if (!btn) {
            dropDownListObj.index = 0;
        }
        /* sort ascending radio button */
        let orderRadio = element.getElementsByClassName('e-sort-order')[0];
        let ordertxtElem = orderRadio.getElementsByClassName('e-sort-ordertxt')[0];
        let isAscending = ordertxtElem.innerText.toLocaleLowerCase() === 'ascending';
        let radiobutton = new RadioButton({
            label: l10n.getConstant('SortAscending'),
            name: 'sortAZ_' + id, value: 'ascending', checked: isAscending, cssClass: 'e-sort-radiobutton',
            change: (args) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        let radio = this.parent.createElement('input', {
            id: 'orderAsc_' + id, className: 'e-sort-radioasc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio);
        radiobutton.createElement = this.parent.createElement;
        radiobutton.appendTo(radio);
        /* sort descending radio button */
        let radiobutton2 = new RadioButton({
            label: l10n.getConstant('SortDescending'),
            name: 'sortAZ_' + id, value: 'descending', checked: !isAscending, cssClass: 'e-sort-radiobutton',
            change: (args) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        let radio2 = this.parent.createElement('input', {
            id: 'orderDesc_' + id, className: 'e-sort-radiodesc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio2);
        radiobutton2.createElement = this.parent.createElement;
        radiobutton2.appendTo(radio2);
        this.deleteHandler(element, lvObj);
    }
    /**
     * Sets the new value of the radio button.
     * @param listviewObj - listview instance.
     * @param id - unique id of the list item.
     * @param value - new value.
     */
    setRadioBtnValue(listviewObj, id, value) {
        if (!value) {
            return;
        }
        Array.prototype.some.call(listviewObj.dataSource, (item) => {
            if (item.id === id) {
                item.order = value;
            }
            return item.id === id; //breaks the loop when proper id found
        });
    }
    /**
     * Clears the error from the dialog.
     * @param dialogElem - dialog content element.
     */
    clearError() {
        let dialogElem = document.getElementsByClassName('e-sort-dialog')[0];
        let errorElem = dialogElem.getElementsByClassName('e-sort-error')[0];
        if (errorElem.style.display !== 'none' && errorElem.innerHTML !== '') {
            errorElem.style.display = 'none';
            Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-error'), (element) => {
                element.classList.remove('e-error');
            });
        }
    }
}

/**
 * Export Spreadsheet integration modules
 */

/**
 * Spreadsheet basic module.
 * @private
 */
class BasicModule {
    /**
     * Constructor for Spreadsheet basic module.
     * @private
     */
    constructor() {
        Spreadsheet.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, ContextMenu$1, Save, NumberFormat, CellFormat, Formula, Sort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'basic';
    }
    /**
     * Destroys the Spreadsheet basic module.
     * @return {void}
     */
    destroy() {
        /* code snippet */
    }
}

/**
 * Spreadsheet all module.
 * @private
 */
class AllModule {
    /**
     * Constructor for Spreadsheet all module.
     * @private
     */
    constructor() {
        Spreadsheet.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, Save, NumberFormat, CellFormat, Formula, Sort);
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'all';
    }
    /**
     * Destroys the Spreadsheet all module.
     * @return {void}
     */
    destroy() {
        /* code snippet */
    }
}

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the scroll settings.
 */
class ScrollSettings extends ChildProperty {
}
__decorate$8([
    Property(false)
], ScrollSettings.prototype, "isFinite", void 0);
__decorate$8([
    Property(true)
], ScrollSettings.prototype, "enableVirtualization", void 0);
/**
 * Represents the selection settings.
 */
class SelectionSettings extends ChildProperty {
}
__decorate$8([
    Property('Multiple')
], SelectionSettings.prototype, "mode", void 0);

/** @hidden */
const DISABLED = 'e-disabled';
/** @hidden */
const locale = 'spreadsheetLocale';
/** @hidden */
const dialog = 'dialog';
/** @hidden */
const fontColor = {
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
const fillColor = {
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
let defaultLocale = {
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
class SheetRender {
    constructor(parent) {
        this.freezePane = false;
        this.colGroupWidth = 30; //Row header and selectall table colgroup width
        this.parent = parent;
        this.col = parent.createElement('col');
        this.rowRenderer = parent.serviceLocator.getService('row');
        this.cellRenderer = parent.serviceLocator.getService('cell');
    }
    refreshSelectALLContent() {
        let cell;
        if (this.freezePane) {
            let tHead = this.getSelectAllTable().querySelector('thead');
            let row = this.rowRenderer.render();
            tHead.appendChild(row);
            cell = this.parent.createElement('th', { className: 'e-select-all-cell' });
            row.appendChild(cell);
        }
        else {
            cell = this.headerPanel.firstElementChild;
            cell.classList.add('e-select-all-cell');
        }
        cell.appendChild(this.parent.createElement('button', { className: 'e-selectall e-icons',
            id: `${this.parent.element.id}_select_all` }));
    }
    updateLeftColGroup(width, rowHdr) {
        if (width) {
            this.colGroupWidth = width;
        }
        if (!rowHdr) {
            rowHdr = this.getRowHeaderPanel();
        }
        let table = rowHdr.querySelector('table');
        this.detachColGroup(table);
        let colGrp = this.parent.createElement('colgroup');
        let colGrpWidth = `${this.colGroupWidth}px`;
        let col = this.col.cloneNode();
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
            this.getColHeaderPanel().style.width = `calc(100% - ${colGrpWidth})`;
            this.getContentPanel().style.width = `calc(100% - ${colGrpWidth})`;
        }
    }
    detachColGroup(table) {
        let colGrp = table.querySelector('colgroup');
        if (colGrp) {
            detach(colGrp);
        }
    }
    renderPanel() {
        this.contentPanel = this.parent.createElement('div', { className: 'e-main-panel' });
        let sheet = this.parent.getActiveSheet();
        let id = this.parent.element.id;
        if (sheet.showHeaders) {
            this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: `${id}_row_header` }));
            this.initHeaderPanel();
            this.parent.scrollModule.setPadding();
        }
        else {
            this.updateHideHeaders();
        }
        let content = this.contentPanel.appendChild(this.parent.createElement('div', { className: 'e-main-content', id: `${id}_main_content` }));
        if (!sheet.showGridLines) {
            content.classList.add('e-hide-gridlines');
        }
        if (!this.parent.allowScrolling) {
            content.style.overflow = 'hidden';
        }
    }
    initHeaderPanel() {
        let id = this.parent.element.id;
        this.headerPanel = this.parent.createElement('div', { className: 'e-header-panel' });
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-selectall-container', id: `${id}_selectall` }));
        this.headerPanel.appendChild(this.parent.createElement('div', { className: 'e-column-header', id: `${id}_col_header` }));
    }
    createTable() {
        if (this.parent.getActiveSheet().showHeaders) {
            this.createHeaderTable();
        }
        this.updateTable('tbody', 'content', this.contentPanel.lastElementChild);
    }
    createHeaderTable(rowHdrEle = this.contentPanel.querySelector('.e-row-header')) {
        if (this.freezePane) {
            this.updateTable('thead', 'selectall', this.headerPanel.querySelector('.e-selectall-container'));
        }
        this.updateTable('thead', 'colhdr', this.headerPanel.querySelector('.e-column-header'));
        this.updateTable('tbody', 'rowhdr', rowHdrEle);
        this.updateLeftColGroup(null, rowHdrEle);
    }
    updateTable(tagName, name, appendTo) {
        let table = this.parent.createElement('table', { className: 'e-table', attrs: { 'role': 'grid' } });
        table.classList.add(`e-${name}-table`);
        appendTo.appendChild(table);
        table.appendChild(this.parent.createElement(tagName));
    }
    /**
     * It is used to refresh the select all, row header, column header and content table contents.
     */
    renderTable(cells, rowIdx, colIdx, lastIdx, top, left) {
        let indexes;
        let row;
        let sheet = this.parent.getActiveSheet();
        let frag = document.createDocumentFragment();
        this.createTable();
        let colGrp = this.parent.createElement('colgroup');
        let cTBody = this.contentPanel.querySelector('.e-main-content tbody');
        let rHdrTBody;
        let cHdrTHead;
        let cHdrRow;
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
        let colCount = sheet.colCount.toString();
        let rowCount = sheet.colCount.toString();
        if (sheet.showHeaders) {
            this.parent.getColHeaderTable().setAttribute('aria-colcount', colCount);
            this.parent.getRowHeaderTable().setAttribute('aria-rowcount', rowCount);
        }
        attributes(this.parent.getContentTable(), { 'aria-rowcount': rowCount, 'aria-colcount': colCount });
        cells.forEach((value, key) => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIdx) {
                this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) {
                    cHdrRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                }
            }
            if (indexes[1] === colIdx) {
                if (sheet.showHeaders) {
                    row = this.rowRenderer.render(indexes[0], true);
                    rHdrTBody.appendChild(row);
                    row.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                }
                row = this.rowRenderer.render(indexes[0]);
                cTBody.appendChild(row);
            }
            row.appendChild(this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: key, lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: true }));
        });
        this.getContentTable().insertBefore(colGrp.cloneNode(true), cTBody);
        getUpdateUsingRaf(() => {
            let content = this.parent.getMainContent();
            document.getElementById(this.parent.element.id + '_sheet').appendChild(frag);
            if (top) {
                content.scrollTop = top;
                if (sheet.showHeaders) {
                    this.parent.getRowHeaderContent().scrollTop = top;
                }
            }
            if (left) {
                content.scrollLeft = left;
                if (sheet.showHeaders) {
                    this.parent.getColumnHeaderContent().scrollLeft = left;
                }
            }
            this.parent.notify(contentLoaded, null);
            this.parent.notify(editOperation, { action: 'renderEditor' });
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent(), { busy: false });
            this.parent.trigger(dataBound, {});
        });
    }
    refreshColumnContent(cells, rowIndex, colIndex, lastIdx) {
        let indexes;
        let row;
        let table;
        let count = 0;
        let sheet = this.parent.getActiveSheet();
        let frag = document.createDocumentFragment();
        let hFrag = document.createDocumentFragment();
        let tBody = this.parent.element.querySelector('.e-main-content tbody');
        tBody = frag.appendChild(tBody.cloneNode(true));
        let colGrp = this.parent.element.querySelector('.e-main-content colgroup');
        colGrp = colGrp.cloneNode();
        let hRow;
        let tHead;
        if (sheet.showHeaders) {
            hFrag.appendChild(colGrp);
            tHead = this.parent.element.querySelector('.e-column-header thead');
            tHead = hFrag.appendChild(tHead.cloneNode(true));
            hRow = tHead.querySelector('tr');
            hRow.innerHTML = '';
        }
        cells.forEach((value, key) => {
            indexes = getRangeIndexes(key);
            if (indexes[0] === rowIndex) {
                this.updateCol(indexes[1], colGrp, sheet);
                if (sheet.showHeaders) {
                    hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
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
            row.appendChild(this.cellRenderer.render({
                colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key
            }));
        });
        frag.insertBefore(colGrp.cloneNode(true), tBody);
        getUpdateUsingRaf(() => {
            if (sheet.showHeaders) {
                table = this.getColHeaderTable();
                removeAllChildren(table);
                table.appendChild(hFrag);
            }
            table = this.getContentTable();
            removeAllChildren(table);
            table.appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent(), { busy: false });
        });
    }
    refreshRowContent(cells, startIndex, lastIdx) {
        let indexes;
        let row;
        let hRow;
        let colGroupWidth = this.colGroupWidth;
        let sheet = this.parent.getActiveSheet();
        let hFrag;
        let hTBody;
        let frag = document.createDocumentFragment();
        let tBody = this.parent.createElement('tbody');
        if (sheet.showHeaders) {
            hFrag = document.createDocumentFragment();
            hTBody = tBody.cloneNode();
            hFrag.appendChild(hTBody);
        }
        frag.appendChild(tBody);
        cells.forEach((value, key) => {
            indexes = getRangeIndexes(key);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(indexes[0], true);
                    hTBody.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                }
                row = this.rowRenderer.render(indexes[0]);
                tBody.appendChild(row);
            }
            row.appendChild(this.cellRenderer.render({ rowIdx: indexes[0], colIdx: indexes[1], cell: value, address: key,
                lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: true }));
        });
        getUpdateUsingRaf(() => {
            if (this.parent.isDestroyed) {
                return;
            }
            if (this.colGroupWidth !== colGroupWidth) {
                this.updateLeftColGroup(colGroupWidth);
            }
            if (sheet.showHeaders) {
                detach(this.contentPanel.querySelector('.e-row-header tbody'));
                this.getRowHeaderTable().appendChild(hFrag);
            }
            detach(this.contentPanel.querySelector('.e-main-content tbody'));
            this.getContentTable().appendChild(frag);
            this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent(), { busy: false });
        });
    }
    updateCol(idx, appendTo, sheet) {
        let col = this.col.cloneNode();
        col.style.width = formatUnit(getColumnWidth(sheet, idx));
        appendTo.appendChild(col);
    }
    updateColContent(cells, rowIdx, colIdx, lastIdx, direction) {
        getUpdateUsingRaf(() => {
            let indexes;
            let row;
            let table;
            let refChild;
            let cell;
            let hRow;
            let rowCount = 0;
            let col;
            let hRefChild;
            let sheet = this.parent.getActiveSheet();
            if (sheet.showHeaders) {
                hRow = this.parent.element.querySelector('.e-column-header .e-header-row');
                hRefChild = hRow.firstElementChild;
            }
            let colGrp = this.parent.element.querySelector('.e-main-content colgroup');
            let colRefChild = colGrp.firstElementChild;
            let tBody = this.parent.element.querySelector('.e-main-content tbody');
            cells.forEach((value, key) => {
                indexes = getRangeIndexes(key);
                if (indexes[0] === rowIdx) {
                    if (direction === 'first') {
                        this.updateCol(indexes[1], colGrp, sheet);
                        if (sheet.showHeaders) {
                            hRow.appendChild(this.cellRenderer.renderColHeader(indexes[1]));
                        }
                    }
                    else {
                        col = this.col.cloneNode();
                        col.style.width = formatUnit(getColumnWidth(sheet, indexes[1]));
                        colGrp.insertBefore(col, colRefChild);
                        if (sheet.showHeaders) {
                            hRow.insertBefore(this.cellRenderer.renderColHeader(indexes[1]), hRefChild);
                        }
                    }
                    if (this.parent.scrollSettings.enableVirtualization) {
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
                cell = this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value, address: key,
                    lastCell: indexes[1] === lastIdx, isHeightCheckNeeded: direction === 'first' });
                if (direction === 'first') {
                    row.appendChild(cell);
                }
                else {
                    row.insertBefore(cell, refChild);
                }
                if (this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach(row[direction + 'ElementChild']);
                }
            });
            if (sheet.showHeaders) {
                table = this.getColHeaderTable();
                detach(table.querySelector('colgroup'));
                table.insertBefore(colGrp.cloneNode(true), table.querySelector('thead'));
            }
            if (this.parent.scrollSettings.enableVirtualization) {
                this.parent.notify(virtualContentLoaded, { refresh: 'Column' });
            }
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent(), { busy: false });
        });
    }
    updateRowContent(cells, startIndex, lastIdx, direction) {
        let colGroupWidth = this.colGroupWidth;
        let row;
        let hRow;
        let sheet = this.parent.getActiveSheet();
        let tBody = this.parent.getMainContent().querySelector('tbody');
        let rTBody;
        let rFrag;
        if (sheet.showHeaders) {
            rFrag = document.createDocumentFragment();
            rTBody = this.parent.getRowHeaderContent().querySelector('tbody');
        }
        let indexes;
        let frag = document.createDocumentFragment();
        this.parent.showSpinner();
        cells.forEach((value, cKey) => {
            indexes = getRangeIndexes(cKey);
            if (indexes[1] === startIndex) {
                if (sheet.showHeaders) {
                    hRow = this.rowRenderer.render(indexes[0], true);
                    rFrag.appendChild(hRow);
                    hRow.appendChild(this.cellRenderer.renderRowHeader(indexes[0]));
                    colGroupWidth = getColGroupWidth(indexes[0] + 1);
                    if (this.parent.scrollSettings.enableVirtualization) {
                        // tslint:disable-next-line:no-any
                        detach(rTBody[direction + 'ElementChild']);
                    }
                }
                row = this.rowRenderer.render(indexes[0]);
                frag.appendChild(row);
                if (this.parent.scrollSettings.enableVirtualization) {
                    // tslint:disable-next-line:no-any
                    detach(tBody[direction + 'ElementChild']);
                }
            }
            row.appendChild(this.cellRenderer.render({ colIdx: indexes[1], rowIdx: indexes[0], cell: value,
                address: cKey, lastCell: indexes[1] === lastIdx, row: row, hRow: hRow, isHeightCheckNeeded: direction === 'first' }));
        });
        getUpdateUsingRaf(() => {
            if (this.colGroupWidth !== colGroupWidth) {
                this.updateLeftColGroup(colGroupWidth);
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
            if (this.parent.scrollSettings.enableVirtualization) {
                this.parent.notify(virtualContentLoaded, { refresh: 'Row' });
            }
            if (!this.parent.isOpen) {
                this.parent.hideSpinner();
            }
            setAriaOptions(this.parent.getMainContent(), { busy: false });
        });
    }
    /**
     * Used to toggle row and column headers.
     */
    showHideHeaders() {
        let sheet = this.parent.getActiveSheet();
        if (sheet.showHeaders) {
            if (this.parent.scrollSettings.enableVirtualization) {
                let startIndex = [this.parent.viewport.topIndex, this.parent.viewport.leftIndex];
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
            getUpdateUsingRaf(() => {
                detach(this.headerPanel);
                detach(this.getRowHeaderPanel());
                this.getContentPanel().style.width = '';
                this.updateHideHeaders();
            });
        }
    }
    renderHeaders(rowIndexes, colIndexes) {
        this.initHeaderPanel();
        let cFrag = document.createDocumentFragment();
        let rFrag = document.createDocumentFragment();
        cFrag.appendChild(this.headerPanel);
        let rowHdrEle = rFrag.appendChild(this.parent.createElement('div', { className: 'e-row-header', id: `${this.parent.element.id}_row_header` }));
        this.createHeaderTable(rowHdrEle);
        this.parent.notify(beforeHeaderLoaded, { element: rowHdrEle });
        this.refreshSelectALLContent();
        let rTBody = rowHdrEle.querySelector('tbody');
        let cTHead = this.headerPanel.querySelector('.e-column-header thead');
        let cRow = this.rowRenderer.render();
        cTHead.appendChild(cRow);
        let row;
        for (let i = colIndexes[0]; i <= colIndexes[1]; i++) {
            cRow.appendChild(this.cellRenderer.renderColHeader(i));
        }
        let colGroupWidth = getColGroupWidth(rowIndexes[1]);
        if (this.colGroupWidth !== colGroupWidth) {
            this.updateLeftColGroup(colGroupWidth, rowHdrEle);
        }
        for (let i = rowIndexes[0]; i <= rowIndexes[1]; i++) {
            row = this.rowRenderer.render(i, true);
            row.appendChild(this.cellRenderer.renderRowHeader(i));
            rTBody.appendChild(row);
        }
        getUpdateUsingRaf(() => {
            this.getColHeaderTable().insertBefore(this.getContentTable().querySelector('colgroup').cloneNode(true), cTHead);
            let sheet = document.getElementById(this.parent.element.id + '_sheet');
            sheet.classList.remove('e-hide-headers');
            sheet.insertBefore(cFrag, this.contentPanel);
            let content = this.getContentPanel();
            this.contentPanel.insertBefore(rFrag, content);
            this.parent.scrollModule.setPadding();
            rowHdrEle.scrollTop = content.scrollTop;
            this.getColHeaderPanel().scrollLeft = content.scrollLeft;
        });
    }
    updateHideHeaders() {
        document.getElementById(this.parent.element.id + '_sheet').classList.add('e-hide-headers');
        this.headerPanel = null;
    }
    /**
     * Get the select all table element of spreadsheet
     * @return {HTMLElement}
     */
    getSelectAllContent() {
        return this.headerPanel.getElementsByClassName('e-selectall-container')[0];
    }
    /**
     * Get the select all table element of spreadsheet
     * @return {Element}
     */
    getSelectAllTable() {
        return this.headerPanel.getElementsByClassName('e-selectall-table')[0];
    }
    /**
     * Get the column header element of spreadsheet
     * @return {HTMLTableElement}
     */
    getColHeaderTable() {
        return this.headerPanel.getElementsByClassName('e-colhdr-table')[0];
    }
    /**
     * Get the row header table element of spreadsheet
     * @return {HTMLTableElement}
     */
    getRowHeaderTable() {
        return this.contentPanel.getElementsByClassName('e-rowhdr-table')[0];
    }
    /**
     * Get the main content table element of spreadsheet
     * @return {Element}
     */
    getContentTable() {
        return this.contentPanel.getElementsByClassName('e-content-table')[0];
    }
    /**
     * Get the row header div element of spreadsheet
     * @return {Element}
     */
    getRowHeaderPanel() {
        return this.contentPanel.getElementsByClassName('e-row-header')[0];
    }
    /**
     * Get the column header div element of spreadsheet
     * @return {Element}
     */
    getColHeaderPanel() {
        return this.headerPanel.getElementsByClassName('e-column-header')[0];
    }
    /**
     * Get the main content div element of spreadsheet
     * @return {Element}
     */
    getContentPanel() {
        return this.contentPanel.getElementsByClassName('e-main-content')[0];
    }
}

/**
 * Sheet module is used for creating row element
 * @hidden
 */
class RowRenderer {
    constructor(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('tr', { attrs: { 'role': 'row' } });
    }
    render(index, isRowHeader) {
        let row = this.element.cloneNode();
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        let sheet = this.parent.getActiveSheet();
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        row.style.height = `${getRowHeight(sheet, index)}px`;
        return row;
    }
}

/**
 * CellRenderer class which responsible for building cell content.
 * @hidden
 */
class CellRenderer {
    constructor(parent) {
        this.parent = parent;
        this.element = this.parent.createElement('td');
        this.th = this.parent.createElement('th', { className: 'e-header-cell' });
    }
    renderColHeader(index) {
        let headerCell = this.th.cloneNode();
        attributes(headerCell, { 'role': 'columnheader', 'aria-colindex': (index + 1).toString(), 'tabindex': '-1' });
        headerCell.innerHTML = getColumnHeaderText(index + 1);
        return headerCell;
    }
    renderRowHeader(index) {
        let headerCell = this.element.cloneNode();
        addClass([headerCell], 'e-header-cell');
        attributes(headerCell, { 'role': 'rowheader', 'tabindex': '-1' });
        headerCell.innerHTML = (index + 1).toString();
        return headerCell;
    }
    render(args) {
        let td = this.element.cloneNode();
        td.className = 'e-cell';
        attributes(td, { 'role': 'gridcell', 'aria-colindex': (args.colIdx + 1).toString(), 'tabindex': '-1' });
        let eventArgs = { cell: args.cell, element: td, address: args.address };
        this.parent.trigger('beforeCellRender', eventArgs);
        this.updateCell(args.rowIdx, args.colIdx, td, args.cell, eventArgs, args.lastCell, args.row, args.hRow, args.isHeightCheckNeeded);
        return eventArgs.element;
    }
    updateCell(rowIdx, colIdx, td, cell, eventArgs, lastCell, row, hRow, isHeightCheckNeeded, isRefresh) {
        if (!eventArgs) {
            eventArgs = { cell: cell, element: td };
        }
        if (cell && cell.formula && !cell.value) {
            let isFormula = checkIsFormula(cell.formula);
            let eventArgs = {
                action: 'refreshCalculate',
                value: cell.formula,
                rowIndex: rowIdx,
                colIndex: colIdx,
                isFormula: isFormula
            };
            this.parent.notify(workbookFormulaOperation, eventArgs);
        }
        let formatArgs = {
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
        let style = {};
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
    }
    removeStyle(element) {
        if (element.style.length) {
            element.removeAttribute('style');
        }
    }
    /** @hidden */
    refreshRange(range) {
        let sheet = this.parent.getActiveSheet();
        let cRange = range.slice();
        if (inView(this.parent, cRange, true)) {
            for (let i = cRange[0]; i <= cRange[2]; i++) {
                for (let j = cRange[1]; j <= cRange[3]; j++) {
                    this.updateCell(i, j, this.parent.getCell(i, j), getCell(i, j, sheet), null, false, null, null, true, true);
                }
            }
        }
    }
}

/**
 * Export Spreadsheet viewer
 */

/**
 * Render module is used to render the spreadsheet
 * @hidden
 */
class Render {
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    render() {
        if (!this.parent.isMobileView()) {
            this.parent.notify(ribbon, null);
            this.parent.notify(formulaBar, null);
        }
        let sheetPanel = this.parent.createElement('div', {
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
    }
    checkTopLeftCell() {
        let sheet = this.parent.getActiveSheet();
        if (!this.parent.scrollSettings.enableVirtualization || sheet.topLeftCell === 'A1') {
            this.refreshUI();
        }
        else {
            let indexes = getCellIndexes(sheet.topLeftCell);
            let top = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
            let left = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
            this.parent.notify(onContentScroll, { scrollLeft: left, scrollTop: top, preventScroll: true });
            let threshold = this.parent.getThreshold('row');
            let rowIndex = indexes[0] > threshold ? indexes[0] - threshold : 0;
            threshold = this.parent.getThreshold('col');
            let colIndex = indexes[1] > threshold ? indexes[1] - threshold : 0;
            this.refreshUI({ rowIndex: rowIndex, colIndex: colIndex, refresh: 'All', top: top, left: left });
        }
    }
    renderSheet(panel = document.getElementById(this.parent.element.id + '_sheet_panel')) {
        panel.appendChild(this.parent.createElement('div', { className: 'e-sheet', id: this.parent.element.id + '_sheet' }));
        this.parent.serviceLocator.getService('sheet').renderPanel();
    }
    refreshUI(args = { rowIndex: 0, colIndex: 0, refresh: 'All' }, address) {
        let sheetModule = this.parent.serviceLocator.getService('sheet');
        let sheet = this.parent.getActiveSheet();
        let sheetName = getSheetName(this.parent);
        this.parent.showSpinner();
        if (!address) {
            address = this.parent.scrollSettings.enableVirtualization ? this.getAddress(args.rowIndex, args.colIndex) :
                `A1:${getCellAddress(sheet.rowCount - 1, sheet.colCount - 1)}`;
        }
        if (args.refresh === 'All') {
            this.parent.trigger(beforeDataBound, {});
        }
        setAriaOptions(this.parent.getMainContent(), { busy: true });
        this.parent.getData(`${sheetName}!${address}`).then((values) => {
            let lastCellIdx = getCellIndexes(address.split(':')[1])[1];
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
    }
    removeSheet() {
        remove(document.getElementById(this.parent.element.id + '_sheet'));
    }
    /**
     * Refresh the active sheet
     */
    refreshSheet() {
        this.removeSheet();
        this.renderSheet();
        this.parent.notify(deInitProperties, {});
        this.checkTopLeftCell();
    }
    getAddress(rowIndex, colIndex) {
        let sheet = this.parent.getActiveSheet();
        let lastRowIdx = rowIndex + this.parent.viewport.rowCount + (this.parent.getThreshold('row') * 2);
        let count = sheet.rowCount - 1;
        if (this.parent.scrollSettings.isFinite && lastRowIdx > count) {
            lastRowIdx = count;
        }
        let lastColIdx = colIndex + this.parent.viewport.colCount + (this.parent.getThreshold('col') * 2);
        count = sheet.colCount - 1;
        if (this.parent.scrollSettings.isFinite && lastColIdx > count) {
            lastColIdx = count;
        }
        return `${getCellAddress(rowIndex, colIndex)}:${getCellAddress(lastRowIdx, lastColIdx)}`;
    }
    /**
     * Used to set sheet panel size.
     */
    setSheetPanelSize() {
        let panel = document.getElementById(this.parent.element.id + '_sheet_panel');
        let offset = this.parent.element.getBoundingClientRect();
        let height;
        if (this.parent.height === 'auto') {
            panel.style.height = '260px';
            height = 230;
        }
        else {
            height = offset.height - getSiblingsHeight(panel);
            panel.style.height = `${height}px`;
            height -= 30;
        }
        this.parent.viewport.height = height;
        this.parent.viewport.width = offset.width;
        this.parent.viewport.rowCount = this.roundValue(height, 20);
        this.parent.viewport.colCount = this.roundValue(offset.width, 64);
    }
    roundValue(size, threshold) {
        let value = size / threshold;
        let roundedValue = Math.round(value);
        return Math.abs(value - roundedValue) < 0.5 ? roundedValue : roundedValue - 1;
    }
    /**
     * Registing the renderer related services.
     */
    instantiateRenderer() {
        this.parent.serviceLocator.register('row', new RowRenderer(this.parent));
        this.parent.serviceLocator.register('cell', new CellRenderer(this.parent));
        this.parent.serviceLocator.register('sheet', new SheetRender(this.parent));
    }
    /**
     * Destroy the Render module.
     * @return {void}
     */
    destroy() {
        this.removeEventListener();
        this.parent = null;
    }
    addEventListener() {
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(dataRefresh, this.refreshSheet, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
    }
    removeEventListener() {
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(dataRefresh, this.refreshSheet);
        this.parent.off(spreadsheetDestroyed, this.destroy);
    }
}

/**
 * ServiceLocator
 * @hidden
 */
class ServiceLocator {
    constructor() {
        this.services = {};
    }
    getService(name) {
        if (isNullOrUndefined(this.services[name])) {
            throw `The service ${name} is not registered`;
        }
        return this.services[name];
    }
    register(name, type) {
        if (isNullOrUndefined(this.services[name])) {
            this.services[name] = type;
        }
    }
}

/**
 * Dialog Service.
 * @hidden
 */
class Dialog$1 {
    /**
     * Constructor for initializing dialog service.
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * To show dialog.
     */
    show(dialogModel) {
        let btnContent;
        let closeHandler = dialogModel.close || null;
        let model = {
            header: 'Spreadsheet',
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            buttons: []
        };
        dialogModel.close = () => {
            this.dialogInstance.destroy();
            remove(this.dialogInstance.element);
            this.dialogInstance = null;
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
        let div = this.parent.createElement('div');
        document.body.appendChild(div);
        this.dialogInstance = new Dialog(model);
        this.dialogInstance.createElement = this.parent.createElement;
        this.dialogInstance.appendTo(div);
    }
    /**
     * To hide dialog.
     */
    hide() {
        this.dialogInstance.hide();
    }
    /**
     * To clear private variables.
     */
    destroy() {
        this.parent = null;
    }
}

/**
 * Export Spreadsheet Services
 */

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Spreadsheet_1;
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
let Spreadsheet = Spreadsheet_1 = class Spreadsheet extends Workbook {
    /**
     * Constructor for creating the widget.
     * @param  {SpreadsheetModel} options? - Configures Spreadsheet options.
     * @param  {string|HTMLElement} element? - Element to render Spreadsheet.
     */
    constructor(options, element) {
        super(options);
        /** @hidden */
        this.isOpen = false;
        /** @hidden */
        this.isEdit = false;
        /** @hidden */
        this.viewport = { rowCount: 0, colCount: 0, height: 0, topIndex: 0, leftIndex: 0, width: 0 };
        this.needsID = true;
        Spreadsheet_1.Inject(Ribbon$$1, FormulaBar, SheetTabs, Selection, Edit, KeyboardNavigation, KeyboardShortcut, Clipboard, DataBind, Open, ContextMenu$1, Save, NumberFormat, CellFormat, Formula, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookNumberFormat, WorkbookFormula, Sort, WorkbookSort, Resize);
        if (element) {
            this.appendTo(element);
        }
    }
    /**
     * To get cell element.
     * @returns HTMLElement
     * @hidden
     */
    getCell(rowIndex, colIndex) {
        if (this.scrollSettings.enableVirtualization) {
            colIndex = colIndex - this.viewport.leftIndex;
        }
        let row = this.getRow(rowIndex);
        return row ? row.cells[colIndex] : row;
    }
    /**
     * Get cell element.
     * @returns HTMLTableRowElement
     * @hidden
     */
    getRow(rowIndex, table) {
        if (this.scrollSettings.enableVirtualization) {
            rowIndex = rowIndex - this.viewport.topIndex;
        }
        table = table || this.getContentTable();
        return table ? table.rows[rowIndex] : null;
    }
    /**
     * To initialize the services;
     * @returns void
     * @hidden
     */
    preRender() {
        super.preRender();
        this.serviceLocator = new ServiceLocator;
        this.initServices();
    }
    initServices() {
        this.serviceLocator.register(locale, new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register(dialog, new Dialog$1(this));
    }
    /**
     * To Initialize the component rendering.
     * @returns void
     * @hidden
     */
    render() {
        super.render();
        this.element.setAttribute('tabindex', '0');
        setAriaOptions(this.element, { role: 'grid' });
        this.renderModule = new Render(this);
        this.notify(initialLoad, null);
        this.renderSpreadsheet();
        this.wireEvents();
    }
    renderSpreadsheet() {
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
    }
    /**
     * By default, Spreadsheet shows the spinner for all its actions. To manually show spinner you this method at your needed time.
     * @return {void}
     */
    showSpinner() {
        showSpinner(this.element);
    }
    /**
     * To hide showed spinner manually.
     * @return {void}
     */
    hideSpinner() {
        hideSpinner(this.element);
    }
    /**
     * Selection will navigates to the specified cell address in active sheet.
     * @param {string} address - Specifies the cell address which needs to navigate.
     */
    goTo(address) {
        let indexes = getRangeIndexes(address);
        let content = this.getMainContent();
        let sheet = this.getActiveSheet();
        content.scrollTop = indexes[0] ? getRowsHeight(sheet, 0, indexes[0] - 1) : 0;
        content.scrollLeft = indexes[1] ? getColumnsWidth(sheet, 0, indexes[1] - 1) : 0;
    }
    /**
     * This method is used to resize the Spreadsheet component.
     */
    resize() {
        this.renderModule.setSheetPanelSize();
        if (this.scrollSettings.enableVirtualization) {
            this.renderModule.refreshSheet();
        }
    }
    /**
     * To cut the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address to cut.
     */
    cut(address) {
        this.notify(cut, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    }
    /**
     * To copy the specified cell or cells properties such as value, format, style etc...
     * @param {string} address - Specifies the range address.
     */
    copy(address) {
        this.notify(copy, address ? {
            range: getIndexesFromAddress(address),
            sId: this.sheets[getSheetIndex(this, getSheetNameFromAddress(address))].id
        } : null);
    }
    /**
     * This method is used to paste the cut or copied cells in to specified address.
     * @param {string} address - Specifies the cell or range address.
     * @param {PasteSpecialType} type - Specifies the type of paste.
     */
    paste(address, type) {
        this.notify(paste, {
            range: getIndexesFromAddress(address), sIdx: getSheetIndex(this, getSheetNameFromAddress(address)),
            type: type
        });
    }
    setHeight() {
        if (this.height.toString().indexOf('%') > -1) {
            this.element.style.minHeight = '400px';
        }
        this.element.style.height = formatUnit(this.height);
    }
    setWidth() {
        if (this.width.toString().indexOf('%') > -1 || this.width === 'auto') {
            this.element.style.minWidth = '300px';
        }
        this.element.style.width = formatUnit(this.width);
    }
    /** @hidden */
    setPanelSize() {
        if (this.height !== 'auto') {
            let panel = document.getElementById(this.element.id + '_sheet_panel');
            panel.style.height = `${this.element.getBoundingClientRect().height - getSiblingsHeight(panel)}px`;
        }
    }
    /**
     * Opens the Excel file.
     * @param {OpenOptions} options - Options for opening the excel file.
     */
    open(options) {
        this.isOpen = true;
        super.open(options);
        if (this.isOpen) {
            this.showSpinner();
        }
    }
    /**
     * Gets the row header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getRowHeaderContent() {
        return this.sheetModule.getRowHeaderPanel();
    }
    /**
     * Gets the column header div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getColumnHeaderContent() {
        return this.sheetModule.getColHeaderPanel();
    }
    /**
     * Gets the main content div of the Spreadsheet.
     * @return {Element}
     * @hidden
     */
    getMainContent() {
        return this.sheetModule.getContentPanel();
    }
    /**
     * Get the main content table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getContentTable() {
        return this.sheetModule.getContentTable();
    }
    /**
     * Get the row header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getRowHeaderTable() {
        return this.sheetModule.getRowHeaderTable();
    }
    /**
     * Get the column header table element of spreadsheet.
     * @return {HTMLTableElement}
     * @hidden
     */
    getColHeaderTable() {
        return this.sheetModule.getColHeaderTable();
    }
    /**
     * To get the backup element count for row and column virtualization.
     * @hidden
     */
    getThreshold(layout) {
        let threshold = Math.round((this.viewport[layout + 'Count'] + 1) / 2);
        return threshold < 15 ? 15 : threshold;
    }
    /** @hidden */
    isMobileView() {
        return ((this.cssClass.indexOf('e-mobile-view') > -1 || Browser.isDevice) && this.cssClass.indexOf('e-desktop-view') === -1)
            && false;
    }
    /** @hidden */
    getValueRowCol(sheetIndex, rowIndex, colIndex) {
        let val = super.getValueRowCol(sheetIndex, rowIndex, colIndex);
        return val;
    }
    /**
     * Sorts the range of cells in the active sheet.
     * @param sortOptions - options for sorting.
     * @param range - address of the data range.
     */
    sort(sortOptions, range) {
        if (!range) {
            range = this.getActiveSheet().selectedRange;
        }
        sortOptions = sortOptions || { sortDescriptors: {} };
        let args = { range: range, sortOptions: sortOptions, cancel: false };
        this.trigger(beforeSort, args);
        if (args.cancel) {
            return;
        }
        this.notify(beforeSort, args);
        super.sort(args.sortOptions, range);
    }
    /** @hidden */
    setValueRowCol(sheetIndex, value, rowIndex, colIndex) {
        if (value === 'circular reference: ') {
            let circularArgs = {
                action: 'isCircularReference', argValue: value
            };
            this.notify(formulaOperation, circularArgs);
            value = circularArgs.argValue;
        }
        super.setValueRowCol(sheetIndex, value, rowIndex, colIndex);
        sheetIndex = getSheetIndexFromId(this, sheetIndex);
        this.notify(editOperation, {
            action: 'refreshDependentCellValue', rowIdx: rowIndex, colIdx: colIndex,
            sheetIdx: sheetIndex
        });
    }
    /**
     * Get component name.
     * @returns string
     * @hidden
     */
    getModuleName() {
        return 'spreadsheet';
    }
    /** @hidden */
    setRowHeight(sheetIndex, rowIndex, height) {
        let actRowIdx = getCellIndexes(this.getActiveSheet().activeCell)[0];
        let contentElem = this.element.querySelector('.e-main-content .e-table');
        let rowHdrElem = this.element.querySelector('.e-row-header .e-table');
        contentElem.rows[rowIndex].style.height = height + 'px';
        rowHdrElem.rows[rowIndex].style.height = height + 'px';
        setRowHeight(this.sheets[sheetIndex - 1], rowIndex, height);
        if (actRowIdx === rowIndex) {
            setStyleAttribute$1([{ element: this.element.getElementsByClassName('e-selection')[0], attrs: { 'height': height + 'px' } }]);
        }
        else {
            let cellPosition = getCellPosition(this.getActiveSheet(), [actRowIdx, 0, actRowIdx, 0]);
            setStyleAttribute$1([{
                    element: this.element.getElementsByClassName('e-selection')[0],
                    attrs: { 'top': cellPosition.top + 'px' }
                }]);
        }
    }
    /** @hidden */
    refreshNode(td, args) {
        let value;
        let spanElem = td.querySelector('.' + this.element.id + '_currency');
        let alignClass = 'e-right-align';
        if (args) {
            args.result = isNullOrUndefined(args.result) ? '' : args.result.toString();
            if (args.type === 'Accounting' && isNumber(args.value)) {
                td.innerHTML = '';
                td.appendChild(this.createElement('span', {
                    className: this.element.id + '_currency',
                    innerHTML: ` ${args.curSymbol}`,
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
            let node = td.lastChild;
            if (node && (node.nodeType === 3 || (node.nodeType === 1))) {
                node.nodeValue = value;
            }
            else {
                td.appendChild(document.createTextNode(value));
            }
        }
    }
    mouseClickHandler(e) {
        this.notify(click, e);
    }
    mouseDownHandler(e) {
        this.notify(mouseDown, e);
    }
    keyUpHandler(e) {
        this.notify(keyUp, e);
    }
    keyDownHandler(e) {
        this.notify(keyDown, e);
    }
    /**
     * Binding events to the element while component creation.
     */
    wireEvents() {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, getStartEvent(), this.mouseDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'noderefresh', this.refreshNode, this);
    }
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     */
    destroy() {
        this.unwireEvents();
        this.notify(spreadsheetDestroyed, null);
        super.destroy();
        this.element.innerHTML = '';
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('role');
        this.element.style.removeProperty('height');
        this.element.style.removeProperty('width');
    }
    /**
     * Unbinding events from the element while component destroy.
     */
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, getStartEvent(), this.mouseDownHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'noderefresh', this.refreshNode);
    }
    /**
     * To add context menu items.
     * @param {MenuItemModel[]} items - Items that needs to be added.
     * @param {string} text - Item before / after that the element to be inserted.
     * @param {boolean} insertAfter - Set `false` if the `items` need to be inserted before the `text`.
     * By default, `items` are added after the `text`.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    addContextMenuItems(items, text, insertAfter = true, isUniqueId) {
        this.notify(addContextMenuItems, { items: items, text: text, insertAfter: insertAfter, isUniqueId: isUniqueId });
    }
    /**
     * To remove existing context menu items.
     * @param {string[]} items - Items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    removeContextMenuItems(items, isUniqueId) {
        this.notify(removeContextMenuItems, { items: items, isUniqueId: isUniqueId });
    }
    /**
     * To enable / disable context menu items.
     * @param {string[]} items - Items that needs to be enabled / disabled.
     * @param {boolean} enable - Set `true` / `false` to enable / disable the menu items.
     * @param {boolean} isUniqueId - Set `true` if the given `text` is a unique id.
     */
    enableContextMenuItems(items, enable = true, isUniqueId) {
        this.notify(enableContextMenuItems, { items: items, enable: enable, isUniqueId: isUniqueId });
    }
    /**
     * Selects the cell / range of cells with specified address.
     * @param {string} address - Specifies the range address.
     */
    selectRange(address) {
        this.notify(selectRange, getRangeIndexes(address));
    }
    /**
     * Start edit the active cell.
     * @return {void}
     */
    startEdit() {
        this.notify(editOperation, { action: 'startEdit', isNewValueEdit: false });
    }
    /**
     * Cancels the edited state, this will not update any value in the cell.
     * @return {void}
     */
    closeEdit() {
        this.notify(editOperation, { action: 'cancelEdit' });
    }
    /**
     * If Spreadsheet is in editable state, you can save the cell by invoking endEdit.
     * @return {void}
     */
    endEdit() {
        this.notify(editOperation, { action: 'endEdit' });
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {SpreadsheetModel} newProp
     * @param  {SpreadsheetModel} oldProp
     * @returns void
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        super.onPropertyChanged(newProp, oldProp);
        for (let prop of Object.keys(newProp)) {
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
    }
    /**
     * To provide the array of modules needed for component rendering.
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        return getRequiredModules(this);
    }
    /**
     * Appends the control within the given HTML Div element.
     * @param {string | HTMLElement} selector - Target element where control needs to be appended.
     */
    appendTo(selector) {
        super.appendTo(selector);
    }
};
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
//# sourceMappingURL=ej2-spreadsheet.es2015.js.map
