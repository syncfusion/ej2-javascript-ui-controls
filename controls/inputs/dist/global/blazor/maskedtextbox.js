window.sf = window.sf || {};
var sfmaskedtextbox = (function (exports) {
'use strict';

/**
 * MaskedTextBox base module
 */
var ERROR = 'e-error';
var INPUTGROUP = 'e-input-group';
var FLOATINPUT = 'e-float-input';
var UTILMASK = 'e-utility-mask';
var TOPLABEL = 'e-label-top';
var BOTTOMLABEL = 'e-label-bottom';
/**
 * @hidden
 * Built-in masking elements collection.
 */
var regularExpressions = {
    '0': '[0-9]',
    '9': '[0-9 ]',
    '#': '[0-9 +-]',
    'L': '[A-Za-z]',
    '?': '[A-Za-z ]',
    '&': '[^\x7f ]+',
    'C': '[^\x7f]+',
    'A': '[A-Za-z0-9]',
    'a': '[A-Za-z0-9 ]',
};
/**
 * @hidden
 * Generate required masking elements to the MaskedTextBox from user mask input.
 */
function createMask() {
    sf.base.attributes(this.element, {
        'role': 'textbox', 'autocomplete': 'off', 'autocorrect': 'off', 'autocapitalize': 'off',
        'spellcheck': 'false', 'aria-live': 'assertive', 'aria-valuenow': ''
    });
    if (this.mask) {
        var splitMask = this.mask.split(']');
        for (var i = 0; i < splitMask.length; i++) {
            if (splitMask[i][splitMask[i].length - 1] === '\\') {
                splitMask[i] = splitMask[i] + ']';
                var splitInnerMask = splitMask[i].split('[');
                for (var j = 0; j < splitInnerMask.length; j++) {
                    if (splitInnerMask[j][splitInnerMask[j].length - 1] === '\\') {
                        splitInnerMask[j] = splitInnerMask[j] + '[';
                    }
                    pushIntoRegExpCollec.call(this, splitInnerMask[j]);
                }
            }
            else {
                var splitInnerMask = splitMask[i].split('[');
                if (splitInnerMask.length > 1) {
                    var chkSpace = false;
                    for (var j = 0; j < splitInnerMask.length; j++) {
                        if (splitInnerMask[j] === '\\') {
                            this.customRegExpCollec.push('[');
                            this.hiddenMask += splitInnerMask[j] + '[';
                        }
                        else if (splitInnerMask[j] === '') {
                            chkSpace = true;
                        }
                        else if ((splitInnerMask[j] !== '' && chkSpace) || j === splitInnerMask.length - 1) {
                            this.customRegExpCollec.push('[' + splitInnerMask[j] + ']');
                            this.hiddenMask += this.promptChar;
                            chkSpace = false;
                        }
                        else {
                            pushIntoRegExpCollec.call(this, splitInnerMask[j]);
                        }
                    }
                }
                else {
                    pushIntoRegExpCollec.call(this, splitInnerMask[0]);
                }
            }
        }
        this.escapeMaskValue = this.hiddenMask;
        this.promptMask = this.hiddenMask.replace(/[09?LCAa#&]/g, this.promptChar);
        if (!sf.base.isNullOrUndefined(this.customCharacters)) {
            for (var i = 0; i < this.promptMask.length; i++) {
                if (!sf.base.isNullOrUndefined(this.customCharacters[this.promptMask[i]])) {
                    this.promptMask = this.promptMask.replace(new RegExp(this.promptMask[i], 'g'), this.promptChar);
                }
            }
        }
        var escapeNumber = 0;
        if (this.hiddenMask.match(new RegExp(/\\/))) {
            for (var i = 0; i < this.hiddenMask.length; i++) {
                var j = 0;
                if (i >= 1) {
                    j = i;
                }
                escapeNumber = this.hiddenMask.length - this.promptMask.length;
                j = j - escapeNumber;
                if ((i > 0 && this.hiddenMask[i - 1] !== '\\') && (this.hiddenMask[i] === '>' ||
                    this.hiddenMask[i] === '<' || this.hiddenMask[i] === '|')) {
                    this.promptMask = this.promptMask.substring(0, j) +
                        this.promptMask.substring((i + 1) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) +
                        this.escapeMaskValue.substring((i + 1) - escapeNumber, this.escapeMaskValue.length);
                }
                if (this.hiddenMask[i] === '\\') {
                    this.promptMask = this.promptMask.substring(0, j) + this.hiddenMask[i + 1] +
                        this.promptMask.substring((i + 2) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) + this.escapeMaskValue[i + 1] +
                        this.escapeMaskValue.substring((i + 2) - escapeNumber, this.escapeMaskValue.length);
                }
            }
        }
        else {
            this.promptMask = this.promptMask.replace(/[>|<]/g, '');
            this.escapeMaskValue = this.hiddenMask.replace(/[>|<]/g, '');
        }
        sf.base.attributes(this.element, { 'aria-invalid': 'false' });
    }
}
/**
 * @hidden
 * Apply mask ability with masking elements to the MaskedTextBox.
 */
function applyMask() {
    setElementValue.call(this, this.promptMask);
    setMaskValue.call(this, this.value);
}
/**
 * @hidden
 * To wire required events to the MaskedTextBox.
 */
function wireEvents() {
    sf.base.EventHandler.add(this.element, 'keydown', maskInputKeyDownHandler, this);
    sf.base.EventHandler.add(this.element, 'keypress', maskInputKeyPressHandler, this);
    sf.base.EventHandler.add(this.element, 'keyup', maskInputKeyUpHandler, this);
    sf.base.EventHandler.add(this.element, 'input', maskInputHandler, this);
    sf.base.EventHandler.add(this.element, 'focus', maskInputFocusHandler, this);
    sf.base.EventHandler.add(this.element, 'blur', maskInputBlurHandler, this);
    sf.base.EventHandler.add(this.element, 'paste', maskInputPasteHandler, this);
    sf.base.EventHandler.add(this.element, 'cut', maskInputCutHandler, this);
    sf.base.EventHandler.add(this.element, 'drop', maskInputDropHandler, this);
    if (this.enabled) {
        bindClearEvent.call(this);
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', resetFormHandler, this);
        }
    }
}
/**
 * @hidden
 * To unwire events attached to the MaskedTextBox.
 */
function unwireEvents() {
    sf.base.EventHandler.remove(this.element, 'keydown', maskInputKeyDownHandler);
    sf.base.EventHandler.remove(this.element, 'keypress', maskInputKeyPressHandler);
    sf.base.EventHandler.remove(this.element, 'keyup', maskInputKeyUpHandler);
    sf.base.EventHandler.remove(this.element, 'input', maskInputHandler);
    sf.base.EventHandler.remove(this.element, 'focus', maskInputFocusHandler);
    sf.base.EventHandler.remove(this.element, 'blur', maskInputBlurHandler);
    sf.base.EventHandler.remove(this.element, 'paste', maskInputPasteHandler);
    sf.base.EventHandler.remove(this.element, 'cut', maskInputCutHandler);
    if (this.formElement) {
        sf.base.EventHandler.remove(this.formElement, 'reset', resetFormHandler);
    }
}
/**
 * @hidden
 * To bind required events to the MaskedTextBox clearButton.
 */
function bindClearEvent() {
    if (this.showClearButton) {
        sf.base.EventHandler.add(this.inputObj.clearButton, 'mousedown touchstart', resetHandler, this);
    }
}
function resetHandler(e) {
    e.preventDefault();
    if (!this.inputObj.clearButton.classList.contains('e-clear-icon-hide')) {
        clear.call(this, e);
        this.value = '';
    }
}
function clear(event) {
    var value = this.element.value;
    setElementValue.call(this, this.promptMask);
    this.redoCollec.unshift({
        value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
    });
    triggerMaskChangeEvent.call(this, event, value);
    this.element.setSelectionRange(0, 0);
}
function resetFormHandler() {
    if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
        setElementValue.call(this, this.promptMask);
    }
    else {
        this.value = this.initInputValue;
    }
}
/**
 * @hidden
 * To get masked value from the MaskedTextBox.
 */
function unstrippedValue(element) {
    return element.value;
}
/**
 * @hidden
 * To extract raw value from the MaskedTextBox.
 */
function strippedValue(element, maskValues) {
    var value = '';
    var k = 0;
    var checkMask = false;
    var maskValue = (!sf.base.isNullOrUndefined(maskValues)) ? maskValues : (!sf.base.isNullOrUndefined(element) &&
        !sf.base.isNullOrUndefined(this)) ? element.value : maskValues;
    if (maskValue !== this.promptMask) {
        for (var i = 0; i < this.customRegExpCollec.length; i++) {
            if (checkMask) {
                checkMask = false;
            }
            if (this.customRegExpCollec[k] === '>' || this.customRegExpCollec[k] === '<' ||
                this.customRegExpCollec[k] === '|' || this.customRegExpCollec[k] === '\\') {
                --i;
                checkMask = true;
            }
            if (!checkMask) {
                if ((maskValue[i] !== this.promptChar) && (!sf.base.isNullOrUndefined(this.customRegExpCollec[k]) &&
                    ((this._callPasteHandler || !sf.base.isNullOrUndefined(this.regExpCollec[this.customRegExpCollec[k]])) ||
                        (this.customRegExpCollec[k].length > 2 && this.customRegExpCollec[k][0] === '[' &&
                            this.customRegExpCollec[k][this.customRegExpCollec[k].length - 1] === ']') ||
                        (!sf.base.isNullOrUndefined(this.customCharacters) &&
                            (!sf.base.isNullOrUndefined(this.customCharacters[this.customRegExpCollec[k]]))))) && (maskValue !== '')) {
                    value += maskValue[i];
                }
            }
            ++k;
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        value = maskValue;
    }
    return value;
}
function pushIntoRegExpCollec(value) {
    for (var k = 0; k < value.length; k++) {
        this.hiddenMask += value[k];
        if (value[k] !== '\\') {
            this.customRegExpCollec.push(value[k]);
        }
    }
}
function maskInputFocusHandler(event) {
    var _this = this;
    var eventArgs = {
        selectionStart: 0,
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: this.inputObj.container,
        selectionEnd: (this.promptMask.length > 0) ? this.promptMask.length : this.element.value.length,
    };
    this.trigger('focus', eventArgs, function (eventArgs) {
        if (_this.mask) {
            _this.isFocus = true;
            if (_this.element.value === '') {
                setElementValue.call(_this, _this.promptMask);
            }
            else {
                setElementValue.call(_this, _this.element.value);
            }
            if (!sf.base.Browser.isDevice && sf.base.Browser.info.version === '11.0') {
                _this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
            }
            else {
                var delay = (sf.base.Browser.isDevice && sf.base.Browser.isIos) ? 450 : 0;
                setTimeout(function () {
                    _this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
                }, delay);
            }
        }
    });
}
function maskInputBlurHandler(event) {
    this.blurEventArgs = {
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: this.inputObj.container
    };
    this.trigger('blur', this.blurEventArgs);
    if (this.mask) {
        this.isFocus = false;
        if (this.placeholder && this.element.value === this.promptMask && this.floatLabelType !== 'Always') {
            setElementValue.call(this, '');
            var labelElement = this.element.parentNode.querySelector('.e-float-text');
            if (this.floatLabelType === 'Auto' && !sf.base.isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL)) {
                sf.base.removeClass([labelElement], TOPLABEL);
            }
        }
    }
}
function maskInputPasteHandler(event) {
    var _this = this;
    if (this.mask && !this.readonly) {
        var sIndex_1 = this.element.selectionStart;
        var eIndex_1 = this.element.selectionEnd;
        var oldValue_1 = this.element.value;
        setElementValue.call(this, '');
        this._callPasteHandler = true;
        setTimeout(function () {
            var value = _this.element.value.replace(/ /g, '');
            if (_this.redoCollec.length > 0 && _this.redoCollec[0].value === _this.element.value) {
                value = strippedValue.call(_this, _this.element);
            }
            setElementValue.call(_this, oldValue_1);
            _this.element.selectionStart = sIndex_1;
            _this.element.selectionEnd = eIndex_1;
            var i = 0;
            _this.maskKeyPress = true;
            do {
                validateValue.call(_this, value[i], false, null);
                ++i;
            } while (i < value.length);
            _this.maskKeyPress = false;
            _this._callPasteHandler = false;
            if (_this.element.value === oldValue_1) {
                var i_1 = 0;
                _this.maskKeyPress = true;
                do {
                    validateValue.call(_this, value[i_1], false, null);
                    ++i_1;
                } while (i_1 < value.length);
                _this.maskKeyPress = false;
            }
            else {
                triggerMaskChangeEvent.call(_this, event, oldValue_1);
            }
        }, 1);
    }
}
function maskInputCutHandler(event) {
    var _this = this;
    if (this.mask && !this.readonly) {
        var preValue_1 = this.element.value;
        var sIndex_2 = this.element.selectionStart;
        var eIndex = this.element.selectionEnd;
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd });
        var value_1 = this.element.value.substring(0, sIndex_2) + this.promptMask.substring(sIndex_2, eIndex) +
            this.element.value.substring(eIndex);
        setTimeout(function () {
            setElementValue.call(_this, value_1);
            _this.element.selectionStart = _this.element.selectionEnd = sIndex_2;
            if (_this.element.value !== preValue_1) {
                triggerMaskChangeEvent.call(_this, event, null);
            }
        }, 0);
    }
}
function maskInputDropHandler(event) {
    event.preventDefault();
}
function maskInputHandler(event) {
    if (sf.base.Browser.isIE === true && this.element.value === '' && this.floatLabelType === 'Never') {
        return;
    }
    var eventArgs = { ctrlKey: false, keyCode: 229 };
    // tslint:disable-next-line
    sf.base.extend(event, eventArgs);
    if (this.mask) {
        if (this.element.value === '') {
            this.redoCollec.unshift({
                value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
            });
        }
        if (this.element.value.length === 1) {
            this.element.value = this.element.value + this.promptMask;
            this.element.setSelectionRange(1, 1);
        }
        if (!this._callPasteHandler) {
            removeMaskInputValues.call(this, event);
        }
        if (this.element.value.length > this.promptMask.length) {
            var startIndex = this.element.selectionStart;
            var addedValues = this.element.value.length - this.promptMask.length;
            var value = this.element.value.substring(startIndex - addedValues, startIndex);
            this.maskKeyPress = false;
            var i = 0;
            do {
                validateValue.call(this, value[i], event.ctrlKey, event);
                ++i;
            } while (i < value.length);
            if (this.element.value !== this.preEleVal) {
                triggerMaskChangeEvent.call(this, event, null);
            }
        }
        var val = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (val === '') {
            setElementValue.call(this, this.promptMask);
            this.element.setSelectionRange(0, 0);
        }
    }
}
function maskInputKeyDownHandler(event) {
    if (this.mask && !this.readonly) {
        if (event.keyCode !== 229) {
            if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
                event.preventDefault();
            }
            removeMaskInputValues.call(this, event);
        }
        var startValue = this.element.value;
        if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
            var collec = void 0;
            if (event.keyCode === 90 && this.undoCollec.length > 0 && startValue !== this.undoCollec[this.undoCollec.length - 1].value) {
                collec = this.undoCollec[this.undoCollec.length - 1];
                this.redoCollec.unshift({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.undoCollec.splice(this.undoCollec.length - 1, 1);
            }
            else if (event.keyCode === 89 && this.redoCollec.length > 0 && startValue !== this.redoCollec[0].value) {
                collec = this.redoCollec[0];
                this.undoCollec.push({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.redoCollec.splice(0, 1);
            }
        }
    }
}
function mobileRemoveFunction() {
    var collec;
    var sIndex = this.element.selectionStart;
    var eIndex = this.element.selectionEnd;
    if (this.redoCollec.length > 0) {
        collec = this.redoCollec[0];
        setElementValue.call(this, collec.value);
        if ((collec.startIndex - sIndex) === 1) {
            this.element.selectionStart = collec.startIndex;
            this.element.selectionEnd = collec.endIndex;
        }
        else {
            this.element.selectionStart = sIndex + 1;
            this.element.selectionEnd = eIndex + 1;
        }
    }
    else {
        setElementValue.call(this, this.promptMask);
        this.element.selectionStart = this.element.selectionEnd = sIndex;
    }
}
function autoFillMaskInputValues(isRemove, oldEventVal, event) {
    if (event.type === 'input') {
        isRemove = false;
        oldEventVal = this.element.value;
        setElementValue.call(this, this.promptMask);
        setMaskValue.call(this, oldEventVal);
    }
    return isRemove;
}
function removeMaskInputValues(event) {
    var isRemove = false;
    var oldEventVal;
    var isDeleted = false;
    if (this.element.value.length < this.promptMask.length) {
        isRemove = true;
        oldEventVal = this.element.value;
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
        mobileRemoveFunction.call(this);
    }
    if (this.element.value.length >= this.promptMask.length && event.type === 'input') {
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
    }
    var initStartIndex = this.element.selectionStart;
    var initEndIndex = this.element.selectionEnd;
    var startIndex = this.element.selectionStart;
    var endIndex = this.element.selectionEnd;
    var maskValue = this.hiddenMask.replace(/[>|\\<]/g, '');
    var curMask = maskValue[startIndex - 1];
    var parentElement = this.element.parentNode;
    if (isRemove || event.keyCode === 8 || event.keyCode === 46) {
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: endIndex });
        var multipleDel = false;
        var preValue = this.element.value;
        if (startIndex > 0 || ((event.keyCode === 8 || event.keyCode === 46) && startIndex < this.element.value.length
            && ((this.element.selectionEnd - startIndex) !== this.element.value.length))) {
            var index = startIndex;
            if (startIndex !== endIndex) {
                startIndex = endIndex;
                if (event.keyCode === 46) {
                    multipleDel = true;
                }
            }
            else if (event.keyCode === 46) {
                ++index;
            }
            else {
                --index;
            }
            for (var k = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? k > index : k < index; (event.keyCode === 8 || isRemove || multipleDel) ? k-- : k++) {
                for (var i = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? i > 0 : i < this.element.value.length; (event.keyCode === 8 || isRemove || multipleDel) ? i-- : i++) {
                    var sIndex = void 0;
                    if (((event.keyCode === 8 || multipleDel) && ((initStartIndex !== initEndIndex && initStartIndex !== startIndex) ||
                        (initStartIndex === initEndIndex))) || isRemove) {
                        curMask = maskValue[i - 1];
                        sIndex = startIndex - 1;
                    }
                    else {
                        curMask = maskValue[i];
                        sIndex = startIndex;
                        ++startIndex;
                    }
                    var oldValue = this.element.value[sIndex];
                    if ((sf.base.isNullOrUndefined(this.regExpCollec[curMask]) && (!sf.base.isNullOrUndefined(this.customCharacters)
                        && sf.base.isNullOrUndefined(this.customCharacters[curMask]))
                        && ((this.hiddenMask[sIndex] !== this.promptChar && this.customRegExpCollec[sIndex][0] !== '['
                            && this.customRegExpCollec[sIndex][this.customRegExpCollec[sIndex].length - 1] !== ']')))
                        || (this.promptMask[sIndex] !== this.promptChar && sf.base.isNullOrUndefined(this.customCharacters))) {
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        event.preventDefault();
                        if (event.keyCode === 46 && !multipleDel) {
                            ++this.element.selectionStart;
                        }
                    }
                    else {
                        var value = this.element.value;
                        var prompt_1 = this.promptChar;
                        var elementValue = value.substring(0, sIndex) + prompt_1 + value.substring(startIndex, value.length);
                        setElementValue.call(this, elementValue);
                        event.preventDefault();
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        isDeleted = true;
                    }
                    startIndex = this.element.selectionStart;
                    if ((!isDeleted && event.keyCode === 8) || multipleDel || (!isDeleted && !(event.keyCode === 46))) {
                        sIndex = startIndex - 1;
                    }
                    else {
                        sIndex = startIndex;
                        isDeleted = false;
                    }
                    oldValue = this.element.value[sIndex];
                    if (((initStartIndex !== initEndIndex) && (this.element.selectionStart === initStartIndex))
                        || (this.promptMask[sIndex] === this.promptChar) || ((oldValue !== this.promptMask[sIndex]) &&
                        (this.promptMask[sIndex] !== this.promptChar) && !sf.base.isNullOrUndefined(this.customCharacters))) {
                        break;
                    }
                }
            }
        }
        if (this.element.selectionStart === 0 && (this.element.selectionEnd === this.element.value.length)) {
            setElementValue.call(this, this.promptMask);
            event.preventDefault();
            this.element.selectionStart = this.element.selectionEnd = startIndex;
        }
        this.redoCollec.unshift({
            value: this.element.value, startIndex: this.element.selectionStart,
            endIndex: this.element.selectionEnd
        });
        if (this.element.value !== preValue) {
            triggerMaskChangeEvent.call(this, event, oldEventVal);
        }
    }
}
function maskInputKeyPressHandler(event) {
    if (this.mask && !this.readonly) {
        var oldValue = this.element.value;
        if ((!event.ctrlKey) || (event.ctrlKey && event.code !== 'KeyA' && event.code !== 'KeyY'
            && event.code !== 'KeyZ' && event.code !== 'KeyX' && event.code !== 'KeyC' && event.code !== 'KeyV')) {
            this.maskKeyPress = true;
            var key = event.key;
            if (key === 'Spacebar') {
                key = String.fromCharCode(event.keyCode);
            }
            if (!key) {
                this.isIosInvalid = true;
                validateValue.call(this, String.fromCharCode(event.keyCode), event.ctrlKey, event);
                event.preventDefault();
                this.isIosInvalid = false;
            }
            else if (key && key.length === 1) {
                validateValue.call(this, key, event.ctrlKey, event);
                event.preventDefault();
            }
            if (event.keyCode === 32 && key === ' ' && this.promptChar === ' ') {
                this.element.selectionStart = this.element.selectionEnd = this.element.selectionStart - key.length;
            }
        }
        if (this.element.value !== oldValue) {
            triggerMaskChangeEvent.call(this, event, oldValue);
        }
    }
}
function triggerMaskChangeEvent(event, oldValue) {
    var prevOnChange = this.isProtectedOnChange;
    if (!sf.base.isNullOrUndefined(this.changeEventArgs) && !this.isInitial) {
        var eventArgs = {};
        this.changeEventArgs = { value: this.element.value, maskedValue: this.element.value, isInteraction: false, isInteracted: false };
        if (this.mask) {
            this.changeEventArgs.value = strippedValue.call(this, this.element);
        }
        if (!sf.base.isNullOrUndefined(event)) {
            this.changeEventArgs.isInteracted = true;
            this.changeEventArgs.isInteraction = true;
            this.changeEventArgs.event = event;
        }
        this.isProtectedOnChange = true;
        this.value = this.changeEventArgs.value;
        this.isProtectedOnChange = prevOnChange;
        sf.base.merge(eventArgs, this.changeEventArgs);
        this.trigger('change', eventArgs);
    }
    this.preEleVal = this.element.value;
    this.prevValue = strippedValue.call(this, this.element);
    sf.base.attributes(this.element, { 'aria-valuenow': this.element.value });
}
function maskInputKeyUpHandler(event) {
    if (this.mask && !this.readonly) {
        var collec = void 0;
        if (!this.maskKeyPress && event.keyCode === 229) {
            var oldEventVal = void 0;
            if (this.element.value.length === 1) {
                this.element.value = this.element.value + this.promptMask;
                this.element.setSelectionRange(1, 1);
            }
            if (this.element.value.length > this.promptMask.length) {
                var startIndex = this.element.selectionStart;
                var addedValues = this.element.value.length - this.promptMask.length;
                var val_1 = this.element.value.substring(startIndex - addedValues, startIndex);
                if (this.undoCollec.length > 0) {
                    collec = this.undoCollec[this.undoCollec.length - 1];
                    var startIndex_1 = this.element.selectionStart;
                    oldEventVal = collec.value;
                    var oldVal = collec.value.substring(startIndex_1 - addedValues, startIndex_1);
                    collec = this.redoCollec[0];
                    val_1 = val_1.trim();
                    var isSpace = sf.base.Browser.isAndroid && val_1 === '';
                    if (!isSpace && oldVal !== val_1 && collec.value.substring(startIndex_1 - addedValues, startIndex_1) !== val_1) {
                        validateValue.call(this, val_1, event.ctrlKey, event);
                    }
                    else if (isSpace) {
                        preventUnsupportedValues.call(this, event, startIndex_1 - 1, this.element.selectionEnd - 1, val_1, event.ctrlKey, false);
                    }
                }
                else {
                    oldEventVal = this.promptMask;
                    validateValue.call(this, val_1, event.ctrlKey, event);
                }
                this.maskKeyPress = false;
                triggerMaskChangeEvent.call(this, event, oldEventVal);
            }
        }
        else {
            removeMaskError.call(this);
        }
        var val = strippedValue.call(this, this.element);
        if (!((this.element.selectionStart === 0) && (this.promptMask === this.element.value) && val === '')
            || (val === '' && this.value !== val)) {
            this.prevValue = val;
            this.value = val;
        }
    }
    else {
        triggerMaskChangeEvent.call(this, event);
    }
    if (this.element.selectionStart === 0 && this.element.selectionEnd === 0) {
        // tslint:disable-next-line
        var temp_1 = this.element;
        setTimeout(function () {
            temp_1.setSelectionRange(0, 0);
        }, 0);
    }
}
function mobileSwipeCheck(key) {
    if (key.length > 1 && ((this.promptMask.length + key.length) < this.element.value.length)) {
        var elementValue = this.redoCollec[0].value.substring(0, this.redoCollec[0].startIndex) + key +
            this.redoCollec[0].value.substring(this.redoCollec[0].startIndex, this.redoCollec[0].value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = this.redoCollec[0].startIndex + key.length;
    }
    this.element.selectionStart = this.element.selectionStart - key.length;
    this.element.selectionEnd = this.element.selectionEnd - key.length;
}
function mobileValidation(key) {
    if (!this.maskKeyPress) {
        mobileSwipeCheck.call(this, key);
    }
}
function validateValue(key, isCtrlKey, event) {
    mobileValidation.call(this, key);
    if (sf.base.isNullOrUndefined(this) || sf.base.isNullOrUndefined(key)) {
        return;
    }
    var startIndex = this.element.selectionStart;
    var initStartIndex = startIndex;
    var endIndex = this.element.selectionEnd;
    var curMask;
    var allowText = false;
    var value = this.element.value;
    var eventOldVal;
    var prevSupport = false;
    var isEqualVal = false;
    for (var k = 0; k < key.length; k++) {
        var keyValue = key[k];
        startIndex = this.element.selectionStart;
        endIndex = this.element.selectionEnd;
        if (!this.maskKeyPress && initStartIndex === startIndex) {
            startIndex = startIndex + k;
        }
        if ((!this.maskKeyPress || startIndex < this.promptMask.length)) {
            for (var i = startIndex; i < this.promptMask.length; i++) {
                var maskValue = this.escapeMaskValue;
                curMask = maskValue[startIndex];
                if (this.hiddenMask[startIndex] === '\\' && this.hiddenMask[startIndex + 1] === key) {
                    isEqualVal = true;
                }
                if ((sf.base.isNullOrUndefined(this.regExpCollec[curMask]) && (sf.base.isNullOrUndefined(this.customCharacters)
                    || (!sf.base.isNullOrUndefined(this.customCharacters) && sf.base.isNullOrUndefined(this.customCharacters[curMask])))
                    && ((this.hiddenMask[startIndex] !== this.promptChar && this.customRegExpCollec[startIndex][0] !== '['
                        && this.customRegExpCollec[startIndex][this.customRegExpCollec[startIndex].length - 1] !== ']')))
                    || ((this.promptMask[startIndex] !== this.promptChar) && sf.base.isNullOrUndefined(this.customCharacters))
                    || (this.promptChar === curMask && this.escapeMaskValue === this.mask)) {
                    this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
                    startIndex = this.element.selectionStart;
                    curMask = this.hiddenMask[startIndex];
                }
            }
            if (!sf.base.isNullOrUndefined(this.customCharacters) && !sf.base.isNullOrUndefined(this.customCharacters[curMask])) {
                var customValStr = this.customCharacters[curMask];
                var customValArr = customValStr.split(',');
                for (var i = 0; i < customValArr.length; i++) {
                    if (keyValue.match(new RegExp('[' + customValArr[i] + ']'))) {
                        allowText = true;
                        break;
                    }
                }
            }
            else if (!sf.base.isNullOrUndefined(this.regExpCollec[curMask]) && keyValue.match(new RegExp(this.regExpCollec[curMask]))
                && this.promptMask[startIndex] === this.promptChar) {
                allowText = true;
            }
            else if (this.promptMask[startIndex] === this.promptChar && this.customRegExpCollec[startIndex][0] === '['
                && this.customRegExpCollec[startIndex][this.customRegExpCollec[startIndex].length - 1] === ']'
                && keyValue.match(new RegExp(this.customRegExpCollec[startIndex]))) {
                allowText = true;
            }
            if ((!this.maskKeyPress || startIndex < this.hiddenMask.length) && allowText) {
                if (k === 0) {
                    if (this.maskKeyPress) {
                        this.undoCollec.push({ value: value, startIndex: startIndex, endIndex: startIndex });
                    }
                    else {
                        var sIndex = this.element.selectionStart;
                        var eIndex = this.element.selectionEnd;
                        if (this.redoCollec.length > 0) {
                            eventOldVal = this.redoCollec[0].value;
                            setElementValue.call(this, eventOldVal);
                            this.undoCollec.push(this.redoCollec[0]);
                        }
                        else {
                            this.undoCollec.push({ value: this.promptMask, startIndex: startIndex, endIndex: startIndex });
                            eventOldVal = this.promptMask;
                            setElementValue.call(this, eventOldVal);
                        }
                        this.element.selectionStart = sIndex;
                        this.element.selectionEnd = eIndex;
                    }
                }
                startIndex = this.element.selectionStart;
                applySupportedValues.call(this, event, startIndex, keyValue, eventOldVal, isEqualVal);
                prevSupport = true;
                if (k === key.length - 1) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
                allowText = false;
            }
            else {
                startIndex = this.element.selectionStart;
                preventUnsupportedValues.call(this, event, startIndex, initStartIndex, key, isCtrlKey, prevSupport);
            }
            if (k === key.length - 1 && !allowText) {
                if (!sf.base.Browser.isAndroid || (sf.base.Browser.isAndroid && startIndex < this.promptMask.length)) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
            }
        }
        else {
            if (key.length === 1 && !isCtrlKey && !sf.base.isNullOrUndefined(event)) {
                addMaskErrorClass.call(this);
            }
        }
    }
}
function applySupportedValues(event, startIndex, keyValue, eventOldVal, isEqualVal) {
    if (this.hiddenMask.length > this.promptMask.length) {
        keyValue = changeToLowerUpperCase.call(this, keyValue, this.element.value);
    }
    if (!isEqualVal) {
        var value = this.element.value;
        var elementValue = value.substring(0, startIndex) + keyValue + value.substring(startIndex + 1, value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
    }
}
function preventUnsupportedValues(event, sIdx, idx, key, ctrl, chkSupport) {
    if (!this.maskKeyPress) {
        var eventOldVal = void 0;
        var value = this.element.value;
        if (sIdx >= this.promptMask.length) {
            setElementValue.call(this, value.substring(0, sIdx));
        }
        else {
            if (idx === sIdx) {
                setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx + 1, value.length));
            }
            else {
                if (this.promptMask.length === this.element.value.length) {
                    setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx, value.length));
                }
                else {
                    setElementValue.call(this, value.substring(0, idx) + value.substring(idx + 1, value.length));
                }
            }
            this.element.selectionStart = this.element.selectionEnd = (chkSupport ||
                this.element.value[idx] !== this.promptChar) ? sIdx : idx;
        }
        eventOldVal = this.element.value;
        addMaskErrorClass.call(this);
    }
    if (key.length === 1 && !ctrl && !sf.base.isNullOrUndefined(event)) {
        addMaskErrorClass.call(this);
    }
}
function addMaskErrorClass() {
    var _this = this;
    var parentElement = this.element.parentNode;
    var timer = 200;
    if (parentElement.classList.contains(INPUTGROUP) || parentElement.classList.contains(FLOATINPUT)) {
        sf.base.addClass([parentElement], ERROR);
    }
    else {
        sf.base.addClass([this.element], ERROR);
    }
    if (this.isIosInvalid === true) {
        timer = 400;
    }
    sf.base.attributes(this.element, { 'aria-invalid': 'true' });
    setTimeout(function () {
        if (!_this.maskKeyPress) {
            removeMaskError.call(_this);
        }
    }, timer);
}
function removeMaskError() {
    var parentElement = this.element.parentNode;
    if (!sf.base.isNullOrUndefined(parentElement)) {
        sf.base.removeClass([parentElement], ERROR);
    }
    sf.base.removeClass([this.element], ERROR);
    sf.base.attributes(this.element, { 'aria-invalid': 'false' });
}
/**
 * @hidden
 * Validates user input using masking elements '<' , '>' and '|'.
 */
function changeToLowerUpperCase(key, value) {
    var promptMask;
    var i;
    var curVal = value;
    var caseCount = 0;
    for (i = 0; i < this.hiddenMask.length; i++) {
        if (this.hiddenMask[i] === '\\') {
            promptMask = curVal.substring(0, i) + '\\' + curVal.substring(i, curVal.length);
        }
        if (this.hiddenMask[i] === '>' || this.hiddenMask[i] === '<' || this.hiddenMask[i] === '|') {
            if (this.hiddenMask[i] !== curVal[i]) {
                promptMask = curVal.substring(0, i) + this.hiddenMask[i] + curVal.substring(i, curVal.length);
            }
            ++caseCount;
        }
        if (promptMask) {
            if (((promptMask[i] === this.promptChar) && (i > this.element.selectionStart)) ||
                (this.element.value.indexOf(this.promptChar) < 0 && (this.element.selectionStart + caseCount) === i)) {
                caseCount = 0;
                break;
            }
            curVal = promptMask;
        }
    }
    while (i >= 0 && promptMask) {
        if (i === 0 || promptMask[i - 1] !== '\\') {
            var val = this.element.value;
            if (promptMask[i] === '>') {
                key = key.toUpperCase();
                break;
            }
            else if (promptMask[i] === '<') {
                key = key.toLowerCase();
                break;
            }
            else if (promptMask[i] === '|') {
                break;
            }
        }
        --i;
    }
    return key;
}
/**
 * @hidden
 * To set updated values in the MaskedTextBox.
 */
function setMaskValue(val) {
    if (this.mask && val !== undefined && (this.prevValue === undefined || this.prevValue !== val)) {
        this.maskKeyPress = true;
        setElementValue.call(this, this.promptMask);
        if (val !== '' && !(val === null && this.floatLabelType === 'Never' && this.placeholder)) {
            this.element.selectionStart = 0;
            this.element.selectionEnd = 0;
        }
        if (val !== null) {
            for (var i = 0; i < val.length; i++) {
                validateValue.call(this, val[i], false, null);
            }
        }
        var newVal = strippedValue.call(this, this.element);
        this.prevValue = newVal;
        this.value = newVal;
        triggerMaskChangeEvent.call(this, null, null);
        this.maskKeyPress = false;
        var labelElement = this.element.parentNode.querySelector('.e-float-text');
        if (this.element.value === this.promptMask && this.floatLabelType === 'Auto' && this.placeholder &&
            !sf.base.isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL) && !this.isFocus) {
            sf.base.removeClass([labelElement], TOPLABEL);
            sf.base.addClass([labelElement], BOTTOMLABEL);
            setElementValue.call(this, '');
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        setElementValue.call(this, this.value);
    }
}
/**
 * @hidden
 * To set updated values in the input element.
 */
function setElementValue(val, element) {
    if (!this.isFocus && this.floatLabelType === 'Auto' && this.placeholder && sf.base.isNullOrUndefined(this.value)) {
        val = '';
    }
    var value = strippedValue.call(this, (element ? element : this.element), val);
    if (value === null || value === '') {
        sf.inputs.Input.setValue(val, (element ? element : this.element), this.floatLabelType, false);
        if (this.showClearButton) {
            this.inputObj.clearButton.classList.add('e-clear-icon-hide');
        }
    }
    else {
        sf.inputs.Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    }
}
/**
 * @hidden
 * Provide mask support to input textbox through utility method.
 */
function maskInput(args) {
    var inputEle = getMaskInput(args);
    applyMask.call(inputEle);
    var val = strippedValue.call(this, this.element);
    this.prevValue = val;
    this.value = val;
    if (args.mask) {
        unwireEvents.call(inputEle);
        wireEvents.call(inputEle);
    }
}
function getMaskInput(args) {
    sf.base.addClass([args.element], UTILMASK);
    var inputEle = {
        element: args.element,
        mask: args.mask,
        promptMask: '',
        hiddenMask: '',
        escapeMaskValue: '',
        promptChar: args.promptChar ? (args.promptChar.length > 1) ? args.promptChar = args.promptChar[0]
            : args.promptChar : '_',
        value: args.value ? args.value : null,
        regExpCollec: regularExpressions,
        customRegExpCollec: [],
        customCharacters: args.customCharacters,
        undoCollec: [],
        redoCollec: [],
        maskKeyPress: false,
        prevValue: ''
    };
    createMask.call(inputEle);
    return inputEle;
}
/**
 * @hidden
 * Gets raw value of the textbox which has been masked through utility method.
 */
function getVal(args) {
    return strippedValue.call(getUtilMaskEle(args), args.element);
}
/**
 * @hidden
 * Gets masked value of the textbox which has been masked through utility method.
 */
function getMaskedVal(args) {
    return unstrippedValue.call(getUtilMaskEle(args), args.element);
}
function getUtilMaskEle(args) {
    var inputEle;
    if (!sf.base.isNullOrUndefined(args) && args.element.classList.contains(UTILMASK)) {
        inputEle = getMaskInput(args);
    }
    return inputEle;
}
/**
 * @hidden
 * Arguments to perform undo and redo functionalities.
 */
var MaskUndo = /** @class */ (function () {
    function MaskUndo() {
    }
    return MaskUndo;
}());

/**
 * MaskedTextbox base modules
 */

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
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-control-wrapper e-mask';
var INPUT = 'e-input';
var COMPONENT = 'e-maskedtextbox';
var CONTROL = 'e-control';
var MASKINPUT_FOCUS = 'e-input-focus';
var wrapperAttr = ['title', 'style', 'class'];
/**
 * The MaskedTextBox allows the user to enter the valid input only based on the provided mask.
 * ```html
 * <input id="mask" type="text" />
 * ```
 * ```typescript
 * <script>
 * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999" });
 * maskObj.appendTo('#mask');
 * </script>
 * ```
 */
var MaskedTextBox = /** @class */ (function (_super) {
    __extends(MaskedTextBox, _super);
    function MaskedTextBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initInputValue = '';
        _this.maskOptions = options;
        return _this;
    }
    /**
     * Gets the component name
     * @private
     */
    MaskedTextBox.prototype.getModuleName = function () {
        return 'maskedtextbox';
    };
    /**
     * Initializes the event handler
     * @private
     */
    MaskedTextBox.prototype.preRender = function () {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.regExpCollec = regularExpressions;
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        this.changeEventArgs = {};
        this.focusEventArgs = {};
        this.blurEventArgs = {};
        this.maskKeyPress = false;
        this.isFocus = false;
        this.isInitial = false;
        this.isIosInvalid = false;
        var ejInstance = sf.base.getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        sf.base.removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formElement = sf.base.closest(this.element, 'form');
        if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
            this.angularTagName = this.element.tagName;
            var input = this.createElement('input');
            for (var i = 0; i < this.element.attributes.length; i++) {
                input.setAttribute(this.element.attributes[i].nodeName, this.element.attributes[i].nodeValue);
                input.innerHTML = this.element.innerHTML;
            }
            if (this.element.hasAttribute('id')) {
                this.element.removeAttribute('id');
            }
            this.element.classList.remove('e-control', 'e-maskedtextbox');
            this.element.classList.add('e-mask-container');
            this.element.appendChild(input);
            this.element = input;
            sf.base.setValue('ej2_instances', ejInstance, this.element);
        }
        this.updateHTMLAttrToElement();
        this.checkHtmlAttributes(false);
        if (this.formElement) {
            this.initInputValue = this.value;
        }
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    MaskedTextBox.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initializes the component rendering.
     * @private
     */
    MaskedTextBox.prototype.render = function () {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (this.floatLabelType === 'Never') {
                sf.base.addClass([this.element], INPUT);
            }
            this.createWrapper();
            this.updateHTMLAttrToWrapper();
            if (this.element.name === '') {
                this.element.setAttribute('name', this.element.id);
            }
            this.isInitial = true;
            this.resetMaskedTextBox();
            this.isInitial = false;
            this.setMaskPlaceholder(true, false);
            this.setWidth(this.width);
            this.preEleVal = this.element.value;
            if (!sf.base.Browser.isDevice && (sf.base.Browser.info.version === '11.0' || sf.base.Browser.info.name === 'edge')) {
                this.element.blur();
            }
            if (sf.base.Browser.isDevice && sf.base.Browser.isIos) {
                this.element.blur();
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
            }
            this.renderComplete();
        }
    };
    MaskedTextBox.prototype.updateHTMLAttrToElement = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) < 0) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    };
    MaskedTextBox.prototype.updateCssClass = function (newClass, oldClass) {
        sf.inputs.Input.setCssClass(this.getValidClassList(newClass), [this.inputObj.container], this.getValidClassList(oldClass));
    };
    MaskedTextBox.prototype.getValidClassList = function (maskClassName) {
        var result = maskClassName;
        if (!sf.base.isNullOrUndefined(maskClassName) && maskClassName !== '') {
            result = (maskClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    };
    MaskedTextBox.prototype.updateHTMLAttrToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (wrapperAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        var updatedClassValues = (this.htmlAttributes[key].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValues !== '') {
                            sf.base.addClass([this.inputObj.container], updatedClassValues.split(' '));
                        }
                    }
                    else if (key === 'style') {
                        var maskStyle = this.inputObj.container.getAttribute(key);
                        maskStyle = !sf.base.isNullOrUndefined(maskStyle) ? (maskStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.inputObj.container.setAttribute(key, maskStyle);
                    }
                    else {
                        this.inputObj.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    };
    MaskedTextBox.prototype.resetMaskedTextBox = function () {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        if (this.promptChar.length > 1) {
            this.promptChar = this.promptChar[0];
        }
        createMask.call(this);
        applyMask.call(this);
        if (this.mask === null || this.mask === '' && this.value !== undefined) {
            setElementValue.call(this, this.value);
        }
        var val = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (!this.isInitial) {
            unwireEvents.call(this);
        }
        wireEvents.call(this);
    };
    MaskedTextBox.prototype.setMaskPlaceholder = function (setVal, dynamicPlaceholder) {
        if (dynamicPlaceholder || this.placeholder) {
            sf.inputs.Input.setPlaceholder(this.placeholder, this.element);
            if (this.element.value === this.promptMask && setVal && this.floatLabelType !== 'Always') {
                setElementValue.call(this, '');
            }
            if (this.floatLabelType === 'Never') {
                maskInputBlurHandler.call(this);
            }
        }
    };
    MaskedTextBox.prototype.setWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputObj.container.style.width = sf.base.formatUnit(width);
                this.element.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                var elementWidth = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
                this.inputObj.container.style.width = elementWidth;
                this.element.style.width = elementWidth;
            }
        }
    };
    MaskedTextBox.prototype.checkHtmlAttributes = function (isDynamic) {
        var attributes$$1 = isDynamic ? sf.base.isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes)
            : ['placeholder', 'disabled', 'value', 'readonly'];
        for (var _i = 0, attributes_1 = attributes$$1; _i < attributes_1.length; _i++) {
            var key = attributes_1[_i];
            if (!sf.base.isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.maskOptions) || (this.maskOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.maskOptions) || (this.maskOptions['enabled'] === undefined)) || isDynamic) {
                            var enabled = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                                this.element.getAttribute(key) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.maskOptions) || (this.maskOptions['value'] === undefined)) || isDynamic) {
                            this.setProperties({ value: this.element.value }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((sf.base.isNullOrUndefined(this.maskOptions) || (this.maskOptions['readonly'] === undefined)) || isDynamic) {
                            var readonly = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                                || this.element.getAttribute(key) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                }
            }
        }
    };
    MaskedTextBox.prototype.createWrapper = function () {
        var updatedCssClassValues = this.cssClass;
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValues = this.getValidClassList(this.cssClass);
        }
        this.inputObj = sf.inputs.Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                enableRtl: this.enableRtl,
                cssClass: updatedCssClassValues,
                enabled: this.enabled,
                readonly: this.readonly,
                placeholder: this.placeholder,
                showClearButton: this.showClearButton
            }
        }, this.createElement);
        this.inputObj.container.setAttribute('class', ROOT + ' ' + this.inputObj.container.getAttribute('class'));
    };
    /**
     * Calls internally if any of the property value is changed.
     * @hidden
     */
    MaskedTextBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    setMaskValue.call(this, this.value);
                    if (this.placeholder) {
                        this.setMaskPlaceholder(false, false);
                    }
                    break;
                case 'placeholder':
                    this.setMaskPlaceholder(true, true);
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enabled':
                    sf.inputs.Input.setEnabled(newProp.enabled, this.element, this.floatLabelType, this.inputObj.container);
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(newProp.readonly, this.element);
                    break;
                case 'enableRtl':
                    sf.inputs.Input.setEnableRtl(newProp.enableRtl, [this.inputObj.container]);
                    break;
                case 'customCharacters':
                    this.customCharacters = newProp.customCharacters;
                    this.resetMaskedTextBox();
                    break;
                case 'showClearButton':
                    sf.inputs.Input.setClearButton(newProp.showClearButton, this.element, this.inputObj, undefined, this.createElement);
                    bindClearEvent.call(this);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    sf.inputs.Input.removeFloating(this.inputObj);
                    sf.inputs.Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkHtmlAttributes(true);
                    break;
                case 'mask':
                    var strippedValue_1 = this.value;
                    this.mask = newProp.mask;
                    this.updateValue(strippedValue_1);
                    break;
                case 'promptChar':
                    if (newProp.promptChar.length > 1) {
                        newProp.promptChar = newProp.promptChar[0];
                    }
                    if (newProp.promptChar) {
                        this.promptChar = newProp.promptChar;
                    }
                    else {
                        this.promptChar = '_';
                    }
                    var value = this.element.value.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    if (this.promptMask === this.element.value) {
                        value = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    }
                    this.promptMask = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    this.undoCollec = this.redoCollec = [];
                    setElementValue.call(this, value);
                    break;
            }
        }
    };
    MaskedTextBox.prototype.updateValue = function (strippedVal) {
        this.resetMaskedTextBox();
        setMaskValue.call(this, strippedVal);
    };
    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     * @return {string}
     */
    MaskedTextBox.prototype.getMaskedValue = function () {
        return unstrippedValue.call(this, this.element);
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    MaskedTextBox.prototype.focusIn = function () {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            sf.base.addClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    MaskedTextBox.prototype.focusOut = function () {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            sf.base.removeClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    MaskedTextBox.prototype.destroy = function () {
        unwireEvents.call(this);
        var attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete',
            'aria-live', 'aria-valuenow', 'aria-invalid'];
        for (var i = 0; i < attrArray.length; i++) {
            this.element.removeAttribute(attrArray[i]);
        }
        this.element.classList.remove('e-input');
        this.inputObj.container.insertAdjacentElement('afterend', this.element);
        sf.base.detach(this.inputObj.container);
        _super.prototype.destroy.call(this);
    };
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property('Never')
    ], MaskedTextBox.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property({})
    ], MaskedTextBox.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(true)
    ], MaskedTextBox.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], MaskedTextBox.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(false)
    ], MaskedTextBox.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(false)
    ], MaskedTextBox.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "mask", void 0);
    __decorate([
        sf.base.Property('_')
    ], MaskedTextBox.prototype, "promptChar", void 0);
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], MaskedTextBox.prototype, "customCharacters", void 0);
    __decorate([
        sf.base.Event()
    ], MaskedTextBox.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], MaskedTextBox.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], MaskedTextBox.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], MaskedTextBox.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], MaskedTextBox.prototype, "blur", void 0);
    MaskedTextBox = __decorate([
        sf.base.NotifyPropertyChanges
    ], MaskedTextBox);
    return MaskedTextBox;
}(sf.base.Component));

/**
 * MaskedTextbox modules
 */

/**
 * MaskedTextbox modules
 */

exports.regularExpressions = regularExpressions;
exports.createMask = createMask;
exports.applyMask = applyMask;
exports.wireEvents = wireEvents;
exports.unwireEvents = unwireEvents;
exports.bindClearEvent = bindClearEvent;
exports.unstrippedValue = unstrippedValue;
exports.strippedValue = strippedValue;
exports.maskInputFocusHandler = maskInputFocusHandler;
exports.maskInputBlurHandler = maskInputBlurHandler;
exports.maskInputDropHandler = maskInputDropHandler;
exports.mobileRemoveFunction = mobileRemoveFunction;
exports.setMaskValue = setMaskValue;
exports.setElementValue = setElementValue;
exports.maskInput = maskInput;
exports.getVal = getVal;
exports.getMaskedVal = getMaskedVal;
exports.MaskUndo = MaskUndo;
exports.MaskedTextBox = MaskedTextBox;

return exports;

});
sfBlazor.modules["maskedtextbox"] = "inputs.MaskedTextBox";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.maskedtextbox, () => {
    sf.inputs = sf.base.extend({}, sf.inputs, sfmaskedtextbox({}));
});