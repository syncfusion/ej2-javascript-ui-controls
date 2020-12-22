window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Slider = (function () {
'use strict';

var SLIDERTRACK = 'e-slider-track';
var SLIDERINPUT = 'e-slider-input';
var HANDLEFOCUSED = 'e-handle-focused';
var HANDLEACTIVE = 'e-handle-active';
var SLIDERTABHANDLE = 'e-tab-handle';
var HORIZONTAL = 'Horizontal';
var RANGE = 'e-range';
var DEFAULTSLIDER = 'Default';
var MINRANGESLIDER = 'MinRange';
var RANGESLIDER = 'Range';
var TICK = 'e-tick';
var LARGE = 'e-large';
var TICKVALUE = 'e-tick-value';
var FIRSTBUTTON = 'e-first-button';
var SECONDBUTTON = 'e-second-button';
var SLIDERLASTTICK = 'e-last-tick';
var VISIBILITY = 'visibility';
var SfSlider = /** @class */ (function () {
    // tslint:disable-next-line:no-any
    function SfSlider(element, dotnetRef, props) {
        this.activeHandle = 1;
        this.initialRendering = true;
        this.isClicked = false;
        this.isSliderMove = false;
        this.isDragRange = false;
        this.transition = {
            handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
                'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
            rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)',
            scaleTransform: 'transform .4s cubic-bezier(.25, .8, .25, 1)'
        };
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = props;
        this.initialRendering = true;
        if (this.options.Value === null) {
            this.options.Value = this.options.Type !== RANGESLIDER ?
                this.options.Min : [this.options.Min, this.options.Max];
        }
        if (this.options.CustomValues) {
            this.options.Min = 0;
            this.options.Max = props.CustomValues.length - 1;
        }
    }
    SfSlider.prototype.initialize = function () {
        this.sliderContainer = this.element.parentElement;
        this.sliderTrack = this.element.querySelector('.' + SLIDERTRACK);
        this.hiddenInput = this.element.parentElement.querySelector('.' + SLIDERINPUT);
        this.setElementWidth(this.options.Width);
        this.setHandler();
        this.setZindex();
        if (!sf.base.isNullOrUndefined(this.options.Limits)) {
            this.setLimitBarPosition();
        }
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material';
        if (sf.base.isNullOrUndefined(this.materialHandle) && this.isMaterial && this.options.Tooltip !== null &&
            this.options.Type !== RANGESLIDER) {
            this.materialHandle = document.createElement('div');
            this.materialHandle.className = 'e-handle e-material-handle';
            this.element.appendChild(this.materialHandle);
        }
        this.setValue(false);
        this.updateColorRangeBarPos();
        if (this.initialRendering && this.options.Enabled && !this.options.ReadOnly) {
            this.wireEvents();
        }
        return this.getTheme(this.sliderContainer);
    };
    SfSlider.prototype.rangeBarMousedown = function (event) {
        var _a, _b;
        event.preventDefault();
        this.changedEventValue = this.options.Value;
        if (this.options.Type === 'Range' && event.target === this.rangeBar) {
            var xPostion = void 0;
            var yPostion = void 0;
            if (event.type === 'mousedown') {
                _a = [event.clientX, event.clientY], xPostion = _a[0], yPostion = _a[1];
            }
            else if (event.type === 'touchstart') {
                _b = [event.changedTouches[0].clientX, event.changedTouches[0].clientY], xPostion = _b[0], yPostion = _b[1];
            }
            if (this.options.Orientation === 'Horizontal') {
                this.firstPartRemain = xPostion - this.rangeBar.getBoundingClientRect().left;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().right - xPostion;
            }
            else {
                this.firstPartRemain = yPostion - this.rangeBar.getBoundingClientRect().top;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().bottom - yPostion;
            }
            this.minDiff = this.handleVal2 - this.handleVal1;
            var focusedElement = this.element.querySelector('.' + SLIDERTABHANDLE);
            if (focusedElement) {
                focusedElement.classList.remove(SLIDERTABHANDLE);
            }
            sf.base.EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            sf.base.EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
    };
    SfSlider.prototype.dragRangeBarUp = function (event) {
        // tslint:disable-next-line:no-any
        if (this.options.Events !== null && this.options.Events.valueChange.hasDelegate &&
            this.options.Value[0] !== this.changedEventValue) {
            this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                PreviousValue: this.changedEventValue,
                Value: this.options.Value,
                isValueChanged: true
            });
        }
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
        this.isDragRange = true;
    };
    SfSlider.prototype.handleValueAdjust = function (handleValue, assignValue, handleNumber) {
        if (handleNumber === 1) {
            this.handleVal1 = assignValue;
            this.handleVal2 = this.handleVal1 + this.minDiff;
        }
        else if (handleNumber === 2) {
            this.handleVal2 = assignValue;
            this.handleVal1 = this.handleVal2 - this.minDiff;
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
    };
    SfSlider.prototype.getLimitValueAndPosition = function (currentValue, minValue, maxValue, limitBar) {
        if (sf.base.isNullOrUndefined(minValue)) {
            minValue = this.options.Min;
            if (sf.base.isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (sf.base.isNullOrUndefined(maxValue)) {
            maxValue = this.options.Max;
            if (sf.base.isNullOrUndefined(currentValue) && limitBar) {
                currentValue = maxValue;
            }
        }
        if (currentValue < minValue) {
            currentValue = minValue;
        }
        if (currentValue > maxValue) {
            currentValue = maxValue;
        }
        return [currentValue, this.checkHandlePosition(currentValue)];
    };
    SfSlider.prototype.dragRangeBarMove = function (event) {
        var _a, _b;
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        this.isDragRange = true;
        var pos;
        this.rangeBar.style.transition = 'none';
        this.firstHandle.style.transition = 'none';
        this.secondHandle.style.transition = 'none';
        var xPostion;
        var yPostion;
        if (event.type === 'mousemove') {
            _a = [event.clientX, event.clientY], xPostion = _a[0], yPostion = _a[1];
        }
        else {
            _b = [event.changedTouches[0].clientX, event.changedTouches[0].clientY], xPostion = _b[0], yPostion = _b[1];
        }
        if (event.type === 'mousemove') {
            pos = { x: event.clientX, y: event.clientY };
        }
        else if (event.type === 'touchmove' || event.type === 'touchstart') {
            pos = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
        }
        // tslint:disable-next-line:no-any
        var limits = this.options.Limits;
        if (sf.base.isNullOrUndefined(limits) || !(limits.enabled && limits.startHandleFixed) && !(limits.enabled && limits.endHandleFixed)) {
            if (!this.options.EnableRtl) {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion + this.secondPartRemain };
            }
            else {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion + this.secondPartRemain };
            }
            this.handlePos1 = this.xyToPosition(pos);
            this.handleVal1 = this.positionToValue(this.handlePos1);
            if (!this.options.EnableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            }
            else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            this.handlePos2 = this.xyToPosition(pos);
            this.handleVal2 = this.positionToValue(this.handlePos2);
            if (!sf.base.isNullOrUndefined(this.options.Limits) && this.options.Limits.enabled) {
                var value = this.getLimitValueAndPosition(this.handleVal1, limits.minStart, limits.minEnd);
                this.handleVal1 = value[0];
                this.handlePos1 = value[1];
                if (this.handleVal1 === limits.minEnd) {
                    this.handleValueAdjust(this.handleVal1, limits.minEnd, 1);
                }
                if (this.handleVal1 === limits.minStart) {
                    this.handleValueAdjust(this.handleVal1, limits.minStart, 1);
                }
                value = this.getLimitValueAndPosition(this.handleVal2, limits.maxStart, limits.maxEnd);
                this.handleVal2 = value[0];
                this.handlePos2 = value[1];
                if (this.handleVal2 === limits.maxStart) {
                    this.handleValueAdjust(this.handleVal2, limits.maxStart, 2);
                }
                if (this.handleVal2 === limits.maxEnd) {
                    this.handleValueAdjust(this.handleVal2, limits.maxEnd, 2);
                }
            }
            if (this.handleVal2 === this.options.Max) {
                this.handleValueAdjust(this.handleVal2, this.options.Max, 2);
            }
            if (this.handleVal1 === this.options.Min) {
                this.handleValueAdjust(this.handleVal1, this.options.Min, 1);
            }
        }
        var previousVal = this.options.IsImmediateValue ? this.previousHandleVal : (this.changedEventValue ?
            this.changedEventValue : this.previousHandleVal);
        this.setHandlePosition(event);
        this.updateValue();
        if (this.options.Type !== DEFAULTSLIDER) {
            this.setRangeBarPosition();
        }
        // tslint:disable-next-line:no-any
        if (this.options.Events !== null && this.options.Events.onChange.hasDelegate &&
            previousVal !== this.options.Value[0]) {
            this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                PreviousValue: previousVal,
                Value: this.options.Value,
                isValueChanged: false
            });
        }
    };
    SfSlider.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyDown, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusOut, this);
        if (this.options.Type === 'Range') {
            sf.base.EventHandler.add(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown, this);
        }
        this.onResize = this.reposition.bind(this);
        window.addEventListener('resize', this.onResize);
        this.wireFirstHandleEventArgs();
        if (this.options.Type === 'Range') {
            this.wireSecondHandleEventArgs();
        }
    };
    SfSlider.prototype.wireFirstHandleEventArgs = function () {
        sf.base.EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
    };
    
    SfSlider.prototype.wireSecondHandleEventArgs = function () {
        sf.base.EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
    };
    
    SfSlider.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyDown);
        window.removeEventListener('resize', this.onResize);
        this.unWireFirstHandleEventArgs();
        if (this.options.Type === 'Range') {
            this.unWireSecondHandleEventArgs();
        }
    };
    SfSlider.prototype.unWireFirstHandleEventArgs = function () {
        sf.base.EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
    };
    
    SfSlider.prototype.unWireSecondHandleEventArgs = function () {
        sf.base.EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
    };
    
    SfSlider.prototype.focusOut = function () {
        if (this.options.Tooltip !== null && this.options.Tooltip.isVisible) {
            if (this.options.Type !== RANGESLIDER) {
                this.materialHandle.style.transform = 'scale(1)';
            }
            this.dotNetRef.invokeMethodAsync('CloseTooltip');
        }
    };
    SfSlider.prototype.reposition = function () {
        this.initialRendering = false;
        this.initialize();
    };
    SfSlider.prototype.handleValueUpdate = function () {
        var hVal;
        if (this.options.Type === RANGESLIDER) {
            hVal = this.activeHandle === 1 ? this.handleVal1 : this.handleVal2;
        }
        else {
            hVal = this.handleVal1;
        }
        return hVal;
    };
    SfSlider.prototype.keyDown = function (event) {
        switch (event.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 36:
            case 35:
                event.preventDefault();
                this.buttonClick(event);
                break;
        }
    };
    SfSlider.prototype.buttonClick = function (args) {
        var value;
        var enabledRTL = this.options.EnableRtl && this.options.Orientation === HORIZONTAL;
        var hVal = this.handleValueUpdate();
        if ((args.keyCode === 40) || (args.keyCode === 37)
            || args.currentTarget.classList.contains(FIRSTBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.options.Step.toString()), false));
        }
        else if ((args.keyCode === 38) || (args.keyCode === 39) ||
            args.currentTarget.classList.contains(SECONDBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.options.Step.toString()), true));
        }
        else if ((args.keyCode === 33
            || args.currentTarget.classList.contains(FIRSTBUTTON))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), true));
        }
        else if ((args.keyCode === 34) ||
            args.currentTarget.classList.contains(SECONDBUTTON)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.options.Ticks.largeStep.toString()), false));
        }
        else if ((args.keyCode === 36)) {
            value = parseFloat(this.options.Min.toString());
        }
        else if ((args.keyCode === 35)) {
            value = parseFloat(this.options.Max.toString());
        }
        this.options.Value = this.options.Type !== RANGESLIDER ? value : this.activeHandle === 1 ?
            [value, this.options.Value[1]] : [this.options.Value[0], value];
        if (this.options.Type === RANGESLIDER) {
            if (this.options.Value[0] > this.options.Value[1] && this.activeHandle === 1) {
                this.options.Value[0] = this.options.Value[1];
            }
            else if (this.options.Value[1] < this.options.Value[0]) {
                this.options.Value[1] = this.options.Value[0];
            }
        }
        this.setValue();
    };
    SfSlider.prototype.handleFocusOut = function () {
        this.element.focus();
        if (this.firstHandle.classList.contains(HANDLEFOCUSED)) {
            this.firstHandle.classList.remove(HANDLEFOCUSED);
        }
        if (this.firstHandle.classList.contains(HANDLEACTIVE)) {
            this.firstHandle.classList.remove(HANDLEACTIVE);
        }
        if (this.options.Type === 'Range') {
            if (this.secondHandle.classList.contains(HANDLEFOCUSED)) {
                this.secondHandle.classList.remove(HANDLEFOCUSED);
            }
            if (this.secondHandle.classList.contains(HANDLEACTIVE)) {
                this.secondHandle.classList.remove(HANDLEACTIVE);
            }
        }
    };
    SfSlider.prototype.handleFocus = function (e) {
        this.getHandlePosition(e);
        this.changedEventValue = this.previousHandleVal;
        this.sliderBarClick();
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(HANDLEFOCUSED);
            this.firstHandle.classList.add(HANDLEACTIVE);
        }
        else {
            this.secondHandle.classList.add(HANDLEFOCUSED);
            this.secondHandle.classList.add(HANDLEACTIVE);
        }
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    };
    SfSlider.prototype.sliderBarMove = function (eventargs) {
        if (eventargs.type !== 'touchmove') {
            eventargs.preventDefault();
        }
        this.isSliderMove = true;
        var pos;
        if (eventargs.type === 'mousemove') {
            pos = { x: eventargs.clientX, y: eventargs.clientY };
        }
        else if (eventargs.type === 'touchmove' || eventargs.type === 'touchstart') {
            pos = { x: eventargs.changedTouches[0].clientX, y: eventargs.changedTouches[0].clientY };
        }
        this.handlePos = this.xyToPosition(pos);
        this.handleVal = this.positionToValue(this.handlePos);
        this.handlePos = this.checkHandlePosition(this.handleVal);
        this.firstHandle.style.transition = this.transition.scaleTransform;
        if (this.options.Type === RANGESLIDER) {
            this.secondHandle.style.transition = this.transition.scaleTransform;
        }
        if (this.rangeBar) {
            this.rangeBar.style.transition = 'none';
        }
        if (this.options.Type === RANGESLIDER) {
            if (this.previousHandleVal.indexOf(this.handleVal) === -1) {
                if (this.activeHandle === 1 && this.handleVal <= this.handleVal2 || this.activeHandle === 2 &&
                    this.handleVal >= this.handleVal1) {
                    // tslint:disable-next-line:no-any
                    if (this.options.Events != null && this.options.Events.onChange.hasDelegate &&
                        this.options.IsImmediateValue) {
                        this.callChangeEvent(false);
                    }
                    else {
                        this.sliderBarClick();
                    }
                }
            }
        }
        else if (this.previousHandleVal !== this.handleVal) {
            // tslint:disable-next-line:no-any
            if (this.options.Events !== null && this.options.Events.onChange.hasDelegate && this.options.IsImmediateValue) {
                this.callChangeEvent(false);
            }
            else {
                this.sliderBarClick();
            }
        }
    };
    SfSlider.prototype.callChangeEvent = function (isValueChanged) {
        var previousVal = this.options.IsImmediateValue ? this.previousHandleVal : (this.changedEventValue ?
            this.changedEventValue : this.previousHandleVal);
        this.sliderBarClick();
        this.dotNetRef.invokeMethodAsync('TriggerEvent', {
            PreviousValue: previousVal,
            Value: this.options.Value,
            isValueChanged: isValueChanged
        });
    };
    SfSlider.prototype.updateHandleAttributes = function (attributeName, value) {
        if (attributeName === 'aria-valuenow') {
            if (this.options.Type === RANGESLIDER) {
                this.firstHandle.setAttribute(attributeName, '[' + value[0] + ',' + value[1] + ']');
                this.secondHandle.setAttribute(attributeName, '[' + value[0] + ',' + value[1] + ']');
            }
            else {
                this.firstHandle.setAttribute(attributeName, value[0]);
            }
        }
        else {
            this.firstHandle.setAttribute(attributeName, value[0]);
            if (this.options.Type === RANGESLIDER) {
                this.secondHandle.setAttribute(attributeName, value[0]);
            }
        }
    };
    SfSlider.prototype.getTheme = function (container) {
        var theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    };
    SfSlider.prototype.setZindex = function () {
        var zIndex = 6;
        if (!sf.base.isNullOrUndefined(this.options.Ticks) && this.options.Ticks.placement !== 'None') {
            this.element.getElementsByTagName('ul')[0].style.zIndex = (zIndex + -7) + '';
            this.element.style.zIndex = (zIndex + 2) + '';
        }
        if (this.getTheme(this.sliderContainer) === 'material' &&
            !sf.base.isNullOrUndefined(this.options.Ticks) && this.options.Ticks.placement === 'Both') {
            this.element.style.zIndex = (zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (zIndex + 3) + '';
        if (this.options.Type === 'Range') {
            this.secondHandle.style.zIndex = (zIndex + 4) + '';
        }
    };
    
    SfSlider.prototype.sliderBarUp = function (event) {
        this.handleFocusOut();
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
        this.isSliderMove = false;
        this.transitionNode();
    };
    SfSlider.prototype.transitionNode = function () {
        this.firstHandle.style.transition = 'none';
        if (this.options.Type === RANGESLIDER) {
            this.secondHandle.style.transition = 'none';
        }
        if (this.rangeBar) {
            this.rangeBar.style.transition = 'none';
        }
    };
    SfSlider.prototype.clickHandler = function (eventargs) {
        if (this.isDragRange) {
            this.isDragRange = false;
            return;
        }
        eventargs.preventDefault();
        var changedEventVal = this.changedEventValue;
        this.getHandlePosition(eventargs);
        // tslint:disable-next-line:no-any
        if ((this.options.Events != null && this.options.Events.onChange.hasDelegate) ||
            // tslint:disable-next-line:no-any 
            this.options.Events != null && this.options.Events.valueChange.hasDelegate) {
            this.isClicked = true;
            this.sliderBarClick();
            // tslint:disable-next-line:no-any
            if (this.options.Events.onChange.hasDelegate) {
                this.callChangeEvent(false);
            }
            changedEventVal = this.isSliderMove ? this.previousHandleVal : (this.changedEventValue ?
                this.changedEventValue : this.previousHandleVal);
            // tslint:disable-next-line:no-any
            if (this.options.Events.valueChange.hasDelegate) {
                this.dotNetRef.invokeMethodAsync('TriggerEvent', {
                    PreviousValue: changedEventVal,
                    Value: this.options.Value,
                    isValueChanged: true
                });
            }
        }
        else {
            this.sliderBarClick();
        }
        if (this.isClicked) {
            this.previousHandleVal = this.options.Value;
        }
        this.changedEventValue = this.previousHandleVal;
        this.isClicked = false;
    };
    SfSlider.prototype.updateNewHandleValue = function (handleVal, handlePos, limitValue) {
        if (limitValue[0] || limitValue[1]) {
            if (handleVal < limitValue[0]) {
                handleVal = limitValue[0];
                handlePos = this.checkHandlePosition(handleVal);
            }
            else if (handleVal > limitValue[1]) {
                handleVal = limitValue[1];
                handlePos = this.checkHandlePosition(handleVal);
            }
        }
        return [handleVal, handlePos];
    };
    SfSlider.prototype.sliderBarClick = function () {
        if (this.options.Type !== RANGESLIDER || this.activeHandle === 1 &&
            this.handleVal1 <= this.handleVal2 || this.activeHandle === 2
            && this.handleVal1 <= this.handleVal2) {
            this.firstHandle.style.transition = this.transition.handle;
            if (this.options.Type === RANGESLIDER) {
                this.secondHandle.style.transition = this.transition.handle;
            }
            if (this.rangeBar) {
                this.rangeBar.style.transition = this.transition.rangeBar;
            }
            if (this.options.Limits) {
                var limitValue = void 0;
                if (this.activeHandle === 1 && !this.options.Limits.startHandleFixed) {
                    limitValue = [this.options.Limits.minStart, this.options.Limits.minEnd];
                    var valAndPos = this.updateNewHandleValue(this.handleVal, this.handlePos, limitValue);
                    this.updateHandleValue(this.firstHandle, valAndPos[0], valAndPos[1], true);
                    if (this.isMaterial && !sf.base.isNullOrUndefined(this.materialHandle) && this.options.Type !== RANGESLIDER) {
                        this.updateHandleValue(this.materialHandle, this.handleVal, this.handlePos, this.activeHandle === 1);
                    }
                }
                else if (this.activeHandle === 2 && !this.options.Limits.endHandleFixed) {
                    limitValue = [this.options.Limits.maxStart, this.options.Limits.maxEnd];
                    var valAndPos = this.updateNewHandleValue(this.handleVal, this.handlePos, limitValue);
                    this.updateHandleValue(this.secondHandle, valAndPos[0], valAndPos[1]);
                }
            }
            else {
                var currentActiveHandle = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
                this.updateHandleValue(currentActiveHandle, this.handleVal, this.handlePos, this.activeHandle === 1);
                if (this.isMaterial && !sf.base.isNullOrUndefined(this.materialHandle) && this.options.Type !== RANGESLIDER) {
                    this.updateHandleValue(this.materialHandle, this.handleVal, this.handlePos, this.activeHandle === 1);
                }
            }
            if (this.options.Type !== DEFAULTSLIDER) {
                this.setRangeBarPosition();
            }
            this.updateValue();
        }
    };
    SfSlider.prototype.updateHandleValue = function (handle, handleVal, handlePos, isFirstHandle) {
        if (isFirstHandle === void 0) { isFirstHandle = false; }
        this.applyHandlePosition(handle, handlePos);
        if (isFirstHandle) {
            this.handleVal1 = handleVal;
            this.handlePos1 = handlePos;
        }
        else {
            this.handleVal2 = handleVal;
            this.handlePos2 = handlePos;
        }
        this.updateAriaValue();
    };
    SfSlider.prototype.updateAriaValue = function () {
        if (this.options.Type !== RANGESLIDER) {
            if (this.options.CustomValues) {
                this.updateHandleAttributes('aria-valuenow', [this.options.CustomValues[this.handleVal1].toString()]);
            }
            else {
                this.updateHandleAttributes('aria-valuenow', [this.handleVal1.toString()]);
            }
        }
        else {
            if (this.options.CustomValues) {
                this.updateHandleAttributes('aria-valuenow', [this.options.CustomValues[this.handleVal1].toString(),
                    this.options.CustomValues[this.handleVal2].toString()]);
            }
            else {
                this.updateHandleAttributes('aria-valuenow', [this.handleVal1.toString(), this.handleVal2.toString()]);
            }
        }
    };
    SfSlider.prototype.positionToValue = function (pos) {
        var val;
        var diff = parseFloat(sf.base.formatUnit(this.options.Max)) - parseFloat(sf.base.formatUnit(this.options.Min));
        if (this.options.Orientation === HORIZONTAL) {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        }
        else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        var total = this.add(val, parseFloat(this.options.Min.toString()), true);
        return (total);
    };
    SfSlider.prototype.add = function (a, b, addition) {
        var precision;
        var x = Math.pow(10, precision || 3);
        var val;
        if (addition) {
            val = (Math.round(a * x) + Math.round(b * x)) / x;
        }
        else {
            val = (Math.round(a * x) - Math.round(b * x)) / x;
        }
        return val;
    };
    SfSlider.prototype.setElementWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.sliderContainer.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.sliderContainer.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    SfSlider.prototype.xyToPosition = function (position) {
        var pos;
        var elementAttr = this.element.getBoundingClientRect();
        if (this.options.Min === this.options.Max) {
            return 100;
        }
        if (this.options.Orientation === HORIZONTAL) {
            var left = position.x - elementAttr.left;
            var num = this.element.offsetWidth / 100;
            this.posvalue = (left / num);
        }
        else {
            var top_1 = position.y - elementAttr.top;
            var num = this.element.offsetHeight / 100;
            this.posvalue = 100 - (top_1 / num);
        }
        var val = this.stepValueCalculation(this.posvalue);
        if (val < 0) {
            val = 0;
        }
        else if (val > 100) {
            val = 100;
        }
        if (this.options.EnableRtl && this.options.Orientation === HORIZONTAL) {
            val = 100 - val;
        }
        if (this.options.Orientation === HORIZONTAL) {
            pos = elementAttr.width * (val / 100);
        }
        else {
            pos = elementAttr.height * (val / 100);
        }
        return pos;
    };
    SfSlider.prototype.stepValueCalculation = function (value) {
        if (this.options.Step === 0) {
            this.options.Step = 1;
        }
        var percentStep = (parseFloat(sf.base.formatUnit(this.options.Step))) /
            ((parseFloat(sf.base.formatUnit(this.options.Max)) - parseFloat(sf.base.formatUnit(this.options.Min))) / 100);
        var remain = value % Math.abs(percentStep);
        if (remain !== 0) {
            if ((percentStep / 2) > remain) {
                value -= remain;
            }
            else {
                value += Math.abs(percentStep) - remain;
            }
        }
        return value;
    };
    SfSlider.prototype.setLimitBarPosition = function () {
        var _a, _b;
        var attrVal;
        this.limitBar1 = this.element.querySelector('.e-limits');
        this.limitBar2 = this.element.querySelector('.e-limit-second');
        if (this.options.Limits.minStart !== null || this.options.Limits.minEnd !== null) {
            if (this.options.Orientation === HORIZONTAL) {
                if (!this.options.EnableRtl) {
                    this.limitBar1.style.left = this.checkHandlePosition(this.options.Limits.minStart) + 'px';
                }
                else {
                    this.limitBar1.style.left = this.checkHandlePosition(this.options.Max - this.options.Limits.minEnd) + 'px';
                }
                attrVal = 'width';
            }
            else {
                this.limitBar1.style.bottom = this.checkHandlePosition(this.options.Limits.minStart) + 'px';
                attrVal = 'height';
            }
            var minvalues = this.options.Limits.minEnd =
                this.options.Limits.minEnd != null ? this.options.Limits.minEnd : this.options.Max;
            sf.base.setStyleAttribute(this.limitBar1, (_a = {}, _a[attrVal] = this.checkHandlePosition(minvalues) - this.checkHandlePosition(this.options.Limits.minStart) + 'px', _a));
        }
        if (this.options.Type === RANGESLIDER) {
            if (this.options.Limits.maxStart !== null || this.options.Limits.maxEnd !== null) {
                if (this.options.Orientation === HORIZONTAL) {
                    this.limitBar2.style.left = this.checkHandlePosition(this.options.Limits.maxStart) + 'px';
                }
                else {
                    this.limitBar2.style.bottom = this.checkHandlePosition(this.options.Limits.maxStart) + 'px';
                }
                var maxvalues = this.options.Limits.maxEnd =
                    this.options.Limits.maxEnd != null ? this.options.Limits.maxEnd : this.options.Max;
                sf.base.setStyleAttribute(this.limitBar2, (_b = {}, _b[attrVal] = this.checkHandlePosition(maxvalues) - this.checkHandlePosition(this.options.Limits.maxStart) + 'px', _b));
            }
        }
    };
    
    SfSlider.prototype.setHandler = function () {
        if (this.options.Min > this.options.Max) {
            this.options.Min = this.options.Max;
        }
        this.createFirstHandle();
        this.createSecondHandle();
    };
    SfSlider.prototype.createSecondHandle = function () {
        this.secondHandle = this.element.querySelector('.e-handle-second');
    };
    SfSlider.prototype.createFirstHandle = function () {
        this.firstHandle = this.element.querySelector('.e-handle-first');
    };
    SfSlider.prototype.setValue = function (makeServerCall) {
        if (makeServerCall === void 0) { makeServerCall = true; }
        var firstHandleValue = this.options.Type !== RANGESLIDER ?
            this.options.Value : this.options.Value[0];
        this.handleVal1 = sf.base.isNullOrUndefined(this.options.Value) ? this.checkHandleValue(parseFloat(this.options.Min.toString())) :
            this.checkHandleValue(parseFloat(firstHandleValue.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.options.Limits != null) {
            var valAndPos = this.updateNewHandleValue(this.handleVal1, this.handlePos1, [this.options.Limits.minStart, this.options.Limits.minEnd]);
            this.handleVal1 = valAndPos[0];
            this.handlePos1 = valAndPos[1];
        }
        if (this.options.Type === RANGESLIDER) {
            this.handleVal2 = sf.base.isNullOrUndefined(this.options.Value) ?
                this.checkHandleValue(parseFloat(this.options.Max.toString())) :
                this.checkHandleValue(parseFloat(this.options.Value[1].toString()));
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
            if (this.options.Limits != null) {
                var valAndPos = this.updateNewHandleValue(this.handleVal2, this.handlePos2, [this.options.Limits.maxStart, this.options.Limits.maxEnd]);
                this.handleVal2 = valAndPos[0];
                this.handlePos2 = valAndPos[1];
            }
        }
        this.setHandlePosition(null);
        if (this.options.Type !== DEFAULTSLIDER) {
            this.setRangeBarPosition();
        }
        if (this.options.Ticks !== null && this.options.Ticks.placement !== 'None') {
            this.setTickValuePosition();
        }
        this.updateValue(makeServerCall);
    };
    SfSlider.prototype.updateColorRangeBarPos = function () {
        if (this.options.ColorRange != null) {
            var trackInfo = this.sliderTrack.children;
            for (var i = 0; i < this.options.ColorRange.length; i++) {
                if (this.options.Orientation === HORIZONTAL) {
                    if (!this.options.EnableRtl) {
                        trackInfo[i].style.left = !this.options.EnableRtl ?
                            this.checkHandlePosition(this.options.ColorRange[i].start) + 'px' :
                            this.checkHandlePosition(this.options.Max - this.options.ColorRange[i].end) + 'px';
                    }
                    trackInfo[i].style.width =
                        this.checkHandlePosition(this.options.ColorRange[i].end) -
                            this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                }
                else {
                    trackInfo[i].style.bottom =
                        this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                    trackInfo[i].style.height =
                        this.checkHandlePosition(this.options.ColorRange[i].end) -
                            this.checkHandlePosition(this.options.ColorRange[i].start) + 'px';
                }
                trackInfo[i].style.removeProperty('display');
            }
        }
    };
    SfSlider.prototype.setTickValuePosition = function () {
        this.firstChild = this.element.querySelector('ul').children[0];
        var firstElementDetails = this.firstChild.getBoundingClientRect();
        var firstChild;
        var otherChild;
        var smallStep = this.options.Ticks.smallStep;
        var count = Math.abs(parseFloat(sf.base.formatUnit(this.options.Max)) - parseFloat(sf.base.formatUnit(this.options.Min))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = this.firstChild.children[0].getBoundingClientRect();
        }
        var tickElements = [this.element.querySelectorAll('.' + TICK + '.' + LARGE + ' .' + TICKVALUE)];
        var other;
        if (this.options.Ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        }
        else {
            other = [].slice.call(tickElements[0], 1);
        }
        var tickWidth = this.options.Orientation !== HORIZONTAL ? firstElementDetails.height * 2 : firstElementDetails.width * 2;
        for (var i = 0; i < this.firstChild.children.length; i++) {
            if (this.options.Orientation === HORIZONTAL) {
                if (!this.options.EnableRtl) {
                    this.firstChild.children[i].style.left = -(firstChild.width / 2) + 'px';
                }
                else {
                    this.firstChild.children[i].style.left = (tickWidth -
                        this.firstChild.children[i].getBoundingClientRect().width) / 2 + 'px';
                }
            }
            else {
                this.firstChild.children[i].style.top = -(firstChild.width / 2) + 'px';
            }
        }
        for (var i = 0; i < other.length; i++) {
            otherChild = other[i].getBoundingClientRect();
            if (this.options.Orientation === HORIZONTAL) {
                sf.base.setStyleAttribute(other[i], { left: (tickWidth - otherChild.width) / 2 + 'px' });
                if (this.options.EnableRtl && other[i].parentElement.classList.contains('e-last-tick')) {
                    sf.base.setStyleAttribute(other[i], { left: -(otherChild.width / 2) + 'px' });
                }
            }
            else {
                sf.base.setStyleAttribute(other[i], { top: (tickWidth - otherChild.height) / 2 + 'px' });
            }
        }
        if (count === 0) {
            this.firstChild.classList.remove(SLIDERLASTTICK);
        }
        // tslint:disable-next-line:no-any
        var args;
        if (this.firstChild != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    firstTickPostion: this.firstChild.children[0].style.left
                };
            }
            else {
                args = {
                    firstTickPostion: -(firstChild.height / 2) + 'px'
                };
            }
        }
        if (other[0] != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    otherTicksPosition: other[0].style.left
                };
            }
            else {
                args = {
                    otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px'
                };
            }
        }
        if (this.firstChild != null && other[0] != null) {
            if (this.options.Orientation === HORIZONTAL) {
                args = {
                    firstTickPostion: this.firstChild.children[0].style.left,
                    otherTicksPosition: other[0].style.left
                };
            }
            else {
                args = {
                    firstTickPostion: -(firstChild.height / 2) + 'px',
                    otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px'
                };
            }
        }
        this.element.querySelector('ul').style.removeProperty(VISIBILITY);
    };
    
    SfSlider.prototype.setRangeBarPosition = function () {
        this.rangeBar = this.element.querySelector('.' + RANGE);
        if (this.options.Orientation === HORIZONTAL) {
            if (this.options.Type === MINRANGESLIDER) {
                this.options.EnableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.options.EnableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            if (this.options.Type === MINRANGESLIDER) {
                this.rangeBar.style.bottom = '0px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
    };
    SfSlider.prototype.setHandlePosition = function (event) {
        this.updateHandleAttributes('aria-valuemin', [this.options.Min.toString()]);
        this.updateHandleAttributes('aria-valuemax', [this.options.Max.toString()]);
        var pos = [this.handlePos1, this.handlePos2];
        this.updateHandlePosition(this.firstHandle, pos[0]);
        if (this.isMaterial && this.options.Type !== RANGESLIDER && !sf.base.isNullOrUndefined(this.materialHandle)) {
            this.updateHandlePosition(this.materialHandle, pos[0]);
        }
        if (this.options.Type === RANGESLIDER) {
            this.updateHandlePosition(this.secondHandle, pos[1]);
        }
        this.updateAriaValue();
    };
    SfSlider.prototype.getHandlePosition = function (eventargs) {
        eventargs.preventDefault();
        var pos;
        if (eventargs.type === 'mousedown' || eventargs.type === 'mouseup' || eventargs.type === 'click') {
            pos = { x: eventargs.clientX, y: eventargs.clientY };
        }
        else if (eventargs.type === 'touchend' || eventargs.type === 'touchstart') {
            pos = { x: eventargs.changedTouches[0].clientX, y: eventargs.changedTouches[0].clientY };
        }
        this.handlePos = this.xyToPosition(pos);
        this.handleVal = this.positionToValue(this.handlePos);
        if (this.handleVal2 < this.handleVal) {
            this.activeHandle = 2;
        }
        else if (this.handleVal1 > this.handleVal) {
            this.activeHandle = 1;
        }
        else {
            var diff1 = this.handleVal > this.handleVal1 ? this.handleVal - this.handleVal1 : this.handleVal1 - this.handleVal;
            var diff2 = this.handleVal > this.handleVal2 ? this.handleVal - this.handleVal2 : this.handleVal2 - this.handleVal;
            this.activeHandle = diff1 > diff2 ? 2 : 1;
        }
    };
    SfSlider.prototype.updateHandlePosition = function (handle, pos) {
        this.applyHandlePosition(handle, pos);
        handle.style.removeProperty(VISIBILITY);
    };
    
    SfSlider.prototype.applyHandlePosition = function (handle, pos) {
        if (this.options.Orientation === HORIZONTAL) {
            if (this.options.EnableRtl) {
                handle.style.right = pos + 'px';
            }
            else {
                handle.style.left = pos + 'px';
            }
        }
        else {
            handle.style.bottom = pos + 'px';
        }
        handle.style.transition = this.transition.handle;
    };
    SfSlider.prototype.checkHandleValue = function (value) {
        if (this.options.Min > this.options.Max) {
            this.options.Min = this.options.Max;
        }
        if (this.options.Min === this.options.Max) {
            return (parseFloat(sf.base.formatUnit(this.options.Max)));
        }
        var handle = this.handleStartEnd();
        if (value < handle.start) {
            value = handle.start;
        }
        else if (value > handle.end) {
            value = handle.end;
        }
        return value;
    };
    SfSlider.prototype.checkHandlePosition = function (value) {
        var pos;
        var elementAttr = this.element.getBoundingClientRect();
        value = (100 * (value - (parseFloat(sf.base.formatUnit(this.options.Min))))) /
            ((parseFloat(sf.base.formatUnit(this.options.Max))) - (parseFloat(sf.base.formatUnit(this.options.Min))));
        if (this.options.Orientation === HORIZONTAL) {
            pos = elementAttr.width * (value / 100);
        }
        else {
            pos = elementAttr.height * (value / 100);
        }
        if (((parseFloat(sf.base.formatUnit(this.options.Max))) === (parseFloat(sf.base.formatUnit(this.options.Min))))) {
            if (this.options.Orientation === HORIZONTAL) {
                pos = elementAttr.width;
            }
            else {
                pos = elementAttr.height;
            }
        }
        return pos;
    };
    SfSlider.prototype.handleStartEnd = function () {
        if (this.options.Min > this.options.Max) {
            return {
                start: this.options.Max,
                end: this.options.Min
            };
        }
        else {
            return {
                start: this.options.Min,
                end: this.options.Max
            };
        }
    };
    SfSlider.prototype.updateValue = function (makeServerCall) {
        var _this = this;
        if (makeServerCall === void 0) { makeServerCall = true; }
        if (this.options.Type === RANGESLIDER) {
            this.options.Value = [this.handleVal1, this.handleVal2];
        }
        else {
            this.options.Value = this.handleVal1;
        }
        if (!this.isClicked) {
            this.previousHandleVal = this.options.Value;
        }
        if (makeServerCall) {
            setTimeout(function () {
                if (_this.isMaterial && _this.options.Tooltip !== null && !sf.base.isNullOrUndefined(_this.materialHandle) &&
                    _this.options.Type !== RANGESLIDER) {
                    _this.materialHandle.style.transform = 'scale(0)';
                }
                _this.dotNetRef.invokeMethodAsync('UpdateValue', _this.options.Value, _this.activeHandle);
            }, 300);
        }
    };
    // tslint:disable-next-line:no-any
    SfSlider.prototype.updateLimitData = function (limits) {
        this.options.Limits = limits;
        this.setLimitBarPosition();
        this.setValue();
    };
    // tslint:disable-next-line:no-any
    SfSlider.prototype.updateTicksData = function (ticks) {
        this.options.Ticks = ticks;
        this.setTickValuePosition();
    };
    SfSlider.prototype.updateSliderValue = function (value) {
        this.options.Value = value;
        this.setValue();
    };
    SfSlider.prototype.updateStepValue = function (value) {
        this.options.Step = value;
    };
    SfSlider.prototype.destroy = function () {
        this.element.style.display = 'none';
        this.unWireEvents();
    };
    SfSlider.prototype.updateTooltipPosition = function (id) {
        var tooltipContent = document.getElementById(id);
        if (tooltipContent !== null && this.options.Type !== RANGESLIDER) {
            tooltipContent.style.transform = 'rotate(45deg)';
        }
    };
    // tslint:disable-next-line:no-any
    SfSlider.prototype.propertyChanges = function (properties) {
        if (properties.Enabled !== undefined) {
            this.options.Enabled = properties.Enabled;
        }
        if (properties.ReadOnly !== undefined) {
            this.options.ReadOnly = properties.ReadOnly;
        }
        if (properties.Value !== undefined) {
            this.options.Value = properties.Value;
            this.setValue();
        }
        if (properties.Max !== undefined) {
            this.options.Max = properties.Max;
        }
        if (properties.Step !== undefined) {
            this.options.Step = properties.Step;
        }
        if (properties.Min !== undefined) {
            this.options.Min = properties.Min;
        }
        if (properties.IsImmediateValue !== undefined) {
            this.options.IsImmediateValue = properties.IsImmediateValue;
        }
        if (this.options.Enabled && !this.options.ReadOnly) {
            this.wireEvents();
        }
        else {
            this.unWireEvents();
        }
    };
    return SfSlider;
}());
// tslint:disable
var Slider = {
    initialize: function (element, dotnetRef, props) {
        if (element) {
            new SfSlider(element, dotnetRef, props);
        }
        if (element && element.blazor__instance) {
            return element.blazor__instance.initialize();
        }
        else {
            return null;
        }
    },
    updateLimitData: function (element, limits) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateLimitData(limits);
        }
    },
    updateTicksData: function (element, ticks) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateTicksData(ticks);
        }
    },
    updateSliderValue: function (element, value) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateSliderValue(value);
        }
    },
    updateSTepValue: function (element, value) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateStepValue(value);
        }
    },
    updatedProperties: function (element, properties) {
        if (element && element.blazor__instance) {
            element.blazor__instance.propertyChanges(properties);
        }
    },
    destroy: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    },
    updateTooltipPosition: function (element, id) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateTooltipPosition(id);
        }
    }
};

return Slider;

}());
