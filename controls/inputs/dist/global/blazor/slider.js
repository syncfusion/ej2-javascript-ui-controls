window.sf = window.sf || {};
var sfslider = (function (exports) {
'use strict';

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
/**
 * Configures the ticks data of the Slider.
 */
var TicksData = /** @class */ (function (_super) {
    __extends(TicksData, _super);
    function TicksData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('None')
    ], TicksData.prototype, "placement", void 0);
    __decorate([
        sf.base.Property(10)
    ], TicksData.prototype, "largeStep", void 0);
    __decorate([
        sf.base.Property(1)
    ], TicksData.prototype, "smallStep", void 0);
    __decorate([
        sf.base.Property(false)
    ], TicksData.prototype, "showSmallTicks", void 0);
    __decorate([
        sf.base.Property(null)
    ], TicksData.prototype, "format", void 0);
    return TicksData;
}(sf.base.ChildProperty));
/**
 * It illustrates the color track data in slider.
 * {% codeBlock src='slider/colorrange/index.md' %}{% endcodeBlock %}
 */
var ColorRangeData = /** @class */ (function (_super) {
    __extends(ColorRangeData, _super);
    function ColorRangeData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "color", void 0);
    __decorate([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "start", void 0);
    __decorate([
        sf.base.Property(null)
    ], ColorRangeData.prototype, "end", void 0);
    return ColorRangeData;
}(sf.base.ChildProperty));
/**
 * It illustrates the limit data in slider.
 * {% codeBlock src='slider/limits/index.md' %}{% endcodeBlock %}
 */
var LimitData = /** @class */ (function (_super) {
    __extends(LimitData, _super);
    function LimitData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property(false)
    ], LimitData.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(null)
    ], LimitData.prototype, "minStart", void 0);
    __decorate([
        sf.base.Property(null)
    ], LimitData.prototype, "minEnd", void 0);
    __decorate([
        sf.base.Property(null)
    ], LimitData.prototype, "maxStart", void 0);
    __decorate([
        sf.base.Property(null)
    ], LimitData.prototype, "maxEnd", void 0);
    __decorate([
        sf.base.Property(false)
    ], LimitData.prototype, "startHandleFixed", void 0);
    __decorate([
        sf.base.Property(false)
    ], LimitData.prototype, "endHandleFixed", void 0);
    return LimitData;
}(sf.base.ChildProperty));
/**
 * It illustrates the tooltip data in slider.
 */
var TooltipData = /** @class */ (function (_super) {
    __extends(TooltipData, _super);
    function TooltipData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('')
    ], TooltipData.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property('Before')
    ], TooltipData.prototype, "placement", void 0);
    __decorate([
        sf.base.Property('Focus')
    ], TooltipData.prototype, "showOn", void 0);
    __decorate([
        sf.base.Property(false)
    ], TooltipData.prototype, "isVisible", void 0);
    __decorate([
        sf.base.Property(null)
    ], TooltipData.prototype, "format", void 0);
    return TooltipData;
}(sf.base.ChildProperty));
var bootstrapTooltipOffset = 6;
var bootstrap4TooltipOffset = 3;
var classNames = {
    root: 'e-slider',
    rtl: 'e-rtl',
    sliderHiddenInput: 'e-slider-input',
    controlWrapper: 'e-control-wrapper',
    sliderHandle: 'e-handle',
    rangeBar: 'e-range',
    sliderButton: 'e-slider-button',
    firstButton: 'e-first-button',
    secondButton: 'e-second-button',
    scale: 'e-scale',
    tick: 'e-tick',
    large: 'e-large',
    tickValue: 'e-tick-value',
    sliderTooltip: 'e-slider-tooltip',
    sliderHover: 'e-slider-hover',
    sliderFirstHandle: 'e-handle-first',
    sliderSecondHandle: 'e-handle-second',
    sliderDisabled: 'e-disabled',
    sliderContainer: 'e-slider-container',
    horizontalTooltipBefore: 'e-slider-horizontal-before',
    horizontalTooltipAfter: 'e-slider-horizontal-after',
    verticalTooltipBefore: 'e-slider-vertical-before',
    verticalTooltipAfter: 'e-slider-vertical-after',
    materialTooltip: 'e-material-tooltip',
    materialTooltipOpen: 'e-material-tooltip-open',
    materialTooltipActive: 'e-tooltip-active',
    materialSlider: 'e-material-slider',
    sliderTrack: 'e-slider-track',
    sliderHorizantalColor: 'e-slider-horizantal-color',
    sliderVerticalColor: 'e-slider-vertical-color',
    sliderHandleFocused: 'e-handle-focused',
    verticalSlider: 'e-vertical',
    horizontalSlider: 'e-horizontal',
    sliderHandleStart: 'e-handle-start',
    sliderTooltipStart: 'e-material-tooltip-start',
    sliderTabHandle: 'e-tab-handle',
    sliderButtonIcon: 'e-button-icon',
    sliderSmallSize: 'e-small-size',
    sliderTickPosition: 'e-tick-pos',
    sliderFirstTick: 'e-first-tick',
    sliderLastTick: 'e-last-tick',
    sliderButtonClass: 'e-slider-btn',
    sliderTooltipWrapper: 'e-tooltip-wrap',
    sliderTabTrack: 'e-tab-track',
    sliderTabRange: 'e-tab-range',
    sliderActiveHandle: 'e-handle-active',
    sliderMaterialHandle: 'e-material-handle',
    sliderMaterialRange: 'e-material-range',
    sliderMaterialDefault: 'e-material-default',
    materialTooltipShow: 'e-material-tooltip-show',
    materialTooltipHide: 'e-material-tooltip-hide',
    readonly: 'e-read-only',
    limits: 'e-limits',
    limitBarDefault: 'e-limit-bar',
    limitBarFirst: 'e-limit-first',
    limitBarSecond: 'e-limit-second',
    dragHorizontal: 'e-drag-horizontal',
    dragVertical: 'e-drag-vertical'
};
/**
 * The Slider component allows the user to select a value or range
 * of values in-between a min and max range, by dragging the handle over the slider bar.
 * ```html
 * <div id='slider'></div>
 * ```
 * ```typescript
 * <script>
 *   var sliderObj = new Slider({ value: 10 });
 *   sliderObj.appendTo('#slider');
 * </script>
 * ```
 */
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.horDir = 'left';
        _this.verDir = 'bottom';
        _this.transition = {
            handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
                'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
            rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)'
        };
        _this.transitionOnMaterialTooltip = {
            handle: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, top 1ms ease-out',
            rangeBar: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, width 1ms ease-out, height 1ms ease-out'
        };
        _this.scaleTransform = 'transform .4s cubic-bezier(.25, .8, .25, 1)';
        _this.customAriaText = null;
        _this.drag = true;
        _this.initialTooltip = true;
        return _this;
    }
    Slider.prototype.preRender = function () {
        var localeText = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
        this.l10n = new sf.base.L10n('slider', localeText, this.locale);
        this.isElementFocused = false;
        this.tickElementCollection = [];
        this.tooltipFormatInfo = {};
        this.ticksFormatInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.formChecker();
    };
    Slider.prototype.formChecker = function () {
        var formElement = sf.base.closest(this.element, 'form');
        if (formElement) {
            this.isForm = true;
            // this condition needs to be checked, if the slider is going to be refreshed by `refresh()`
            // then we need to revert the slider `value` back to `formResetValue` to preserve the initial value
            if (!sf.base.isNullOrUndefined(this.formResetValue)) {
                this.setProperties({ 'value': this.formResetValue }, true);
            }
            this.formResetValue = this.value;
            if (this.type === 'Range' &&
                (sf.base.isNullOrUndefined(this.formResetValue) || typeof (this.formResetValue) !== 'object')) {
                this.formResetValue = [parseFloat(sf.base.formatUnit(this.min)), parseFloat(sf.base.formatUnit(this.max))];
            }
            else if (sf.base.isNullOrUndefined(this.formResetValue)) {
                this.formResetValue = parseFloat(sf.base.formatUnit(this.min));
            }
            this.formElement = formElement;
        }
        else {
            this.isForm = false;
        }
    };
    Slider.prototype.initCultureFunc = function () {
        this.internationalization = new sf.base.Internationalization(this.locale);
    };
    Slider.prototype.initCultureInfo = function () {
        this.tooltipFormatInfo.format = (!sf.base.isNullOrUndefined(this.tooltip.format)) ? this.tooltip.format : null;
        this.ticksFormatInfo.format = (!sf.base.isNullOrUndefined(this.ticks.format)) ? this.ticks.format : null;
    };
    Slider.prototype.formatString = function (value, formatInfo) {
        var formatValue = null;
        var formatString = null;
        if ((value || value === 0)) {
            formatValue = this.formatNumber(value);
            var numberOfDecimals = this.numberOfDecimals(value);
            formatString = this.internationalization.getNumberFormat(formatInfo)(this.makeRoundNumber(value, numberOfDecimals));
        }
        return { elementVal: formatValue, formatString: formatString };
    };
    
    Slider.prototype.formatNumber = function (value) {
        var numberOfDecimals = this.numberOfDecimals(value);
        return this.internationalization.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(value);
    };
    
    Slider.prototype.numberOfDecimals = function (value) {
        var decimalPart = value.toString().split('.')[1];
        var numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        return numberOfDecimals;
    };
    Slider.prototype.makeRoundNumber = function (value, precision) {
        var decimals = precision || 0;
        return Number(value.toFixed(decimals));
    };
    
    Slider.prototype.fractionalToInteger = function (value) {
        value = (this.numberOfDecimals(value) === 0) ? Number(value).toFixed(this.noOfDecimals) : value;
        var tens = 1;
        for (var i = 0; i < this.noOfDecimals; i++) {
            tens *= 10;
        }
        value = Number((value * tens).toFixed(0));
        return value;
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Slider.prototype.render = function () {
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.initialize();
        }
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
    };
    Slider.prototype.initialize = function () {
        sf.base.addClass([this.element], classNames.root);
        this.setCSSClass();
    };
    Slider.prototype.setElementWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.sliderContainer.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.sliderContainer.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    Slider.prototype.setCSSClass = function (oldCSSClass) {
        if (oldCSSClass) {
            sf.base.removeClass([this.element], oldCSSClass.split(' '));
        }
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' '));
        }
    };
    Slider.prototype.setEnabled = function () {
        if (!this.enabled) {
            sf.base.addClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.add(classNames.sliderDisabled);
            }
            this.unwireEvents();
        }
        else {
            sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.remove(classNames.sliderDisabled);
            }
            this.wireEvents();
        }
    };
    Slider.prototype.getTheme = function (container) {
        var theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    };
    /**
     * Initialize the rendering
     * @private
     */
    Slider.prototype.initRender = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.sliderContainer = this.element.parentElement;
            this.sliderTrack = this.element.querySelector('.e-slider-track');
            this.hiddenInput = this.element.parentElement.querySelector('.e-slider-input');
        }
        else {
            this.sliderContainer = this.createElement('div', { className: classNames.sliderContainer + ' ' + classNames.controlWrapper });
            this.element.parentNode.insertBefore(this.sliderContainer, this.element);
            this.sliderContainer.appendChild(this.element);
            this.sliderTrack = this.createElement('div', { className: classNames.sliderTrack });
            this.element.appendChild(this.sliderTrack);
        }
        this.setElementWidth(this.width);
        this.element.tabIndex = -1;
        this.getThemeInitialization();
        this.setHandler();
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.setOrientClass();
            this.hiddenInput = (this.createElement('input', {
                attrs: {
                    type: 'hidden', value: (sf.base.isNullOrUndefined(this.value) ? this.min.toString() : this.value.toString()),
                    name: this.element.getAttribute('name') || this.element.getAttribute('id') ||
                        '_' + (Math.random() * 1000).toFixed(0) + 'slider', class: classNames.sliderHiddenInput
                }
            }));
            this.hiddenInput.tabIndex = -1;
            this.sliderContainer.appendChild(this.hiddenInput);
        }
        if (this.showButtons) {
            this.setButtons();
        }
        this.setEnableRTL();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        else {
            this.value = sf.base.isNullOrUndefined(this.value) ? parseFloat(sf.base.formatUnit(this.min.toString())) : this.value;
        }
        this.previousVal = this.type !== 'Range' ? this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value.toString()))) :
            [this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value[0].toString()))),
                this.checkHandleValue(parseFloat(sf.base.formatUnit(this.value[1].toString())))];
        this.previousChanged = this.previousVal;
        if (!sf.base.isNullOrUndefined(this.element.hasAttribute('name'))) {
            this.element.removeAttribute('name');
        }
        this.setValue();
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
        }
        if (this.tooltip.isVisible) {
            this.renderTooltip();
        }
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            if (!this.enabled) {
                sf.base.addClass([this.sliderContainer], [classNames.sliderDisabled]);
            }
            else {
                sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
            }
            if (this.readonly) {
                sf.base.addClass([this.sliderContainer], [classNames.readonly]);
            }
            else {
                sf.base.removeClass([this.sliderContainer], [classNames.readonly]);
            }
        }
    };
    Slider.prototype.getThemeInitialization = function () {
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material'
            || this.getTheme(this.sliderContainer) === 'material-dark';
        this.isBootstrap = this.getTheme(this.sliderContainer) === 'bootstrap'
            || this.getTheme(this.sliderContainer) === 'bootstrap-dark';
        this.isBootstrap4 = this.getTheme(this.sliderContainer) === 'bootstrap4';
        this.isMaterialTooltip = this.isMaterial && this.type !== 'Range' && this.tooltip.isVisible;
    };
    Slider.prototype.createRangeBar = function () {
        if (this.type !== 'Default') {
            this.rangeBar = (this.createElement('div', { attrs: { class: classNames.rangeBar } }));
            this.element.appendChild(this.rangeBar);
            if (this.drag && this.type === 'Range') {
                if (this.orientation === 'Horizontal') {
                    this.rangeBar.classList.add(classNames.dragHorizontal);
                }
                else {
                    this.rangeBar.classList.add(classNames.dragVertical);
                }
            }
        }
    };
    Slider.prototype.createLimitBar = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.limitBarFirst = this.element.querySelectorAll('.e-limits')[0];
            if (this.type === 'Range') {
                this.limitBarSecond = this.element.querySelectorAll('.e-limit-second')[0];
            }
        }
        else {
            var firstElementClassName = this.type !== 'Range' ? classNames.limitBarDefault :
                classNames.limitBarFirst;
            firstElementClassName += ' ' + classNames.limits;
            this.limitBarFirst = (this.createElement('div', {
                attrs: { class: firstElementClassName }
            }));
            this.element.appendChild(this.limitBarFirst);
            if (this.type === 'Range') {
                this.limitBarSecond = (this.createElement('div', {
                    attrs: {
                        class: classNames.limitBarSecond + ' ' + classNames.limits
                    }
                }));
                this.element.appendChild(this.limitBarSecond);
            }
        }
    };
    Slider.prototype.setOrientClass = function () {
        if (this.orientation !== 'Vertical') {
            this.sliderContainer.classList.remove(classNames.verticalSlider);
            this.sliderContainer.classList.add(classNames.horizontalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'horizontal');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'horizontal');
            }
        }
        else {
            this.sliderContainer.classList.remove(classNames.horizontalSlider);
            this.sliderContainer.classList.add(classNames.verticalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'vertical');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'vertical');
            }
        }
    };
    Slider.prototype.setAriaAttributes = function (element) {
        var _this = this;
        var min = this.min;
        var max = this.max;
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            min = this.customValues[0];
            max = this.customValues[this.customValues.length - 1];
        }
        if (this.type !== 'Range') {
            sf.base.attributes(element, {
                'aria-valuemin': min.toString(), 'aria-valuemax': max.toString()
            });
        }
        else {
            var range = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[min.toString(), (this.customValues[this.value[1]]).toString()],
                    [(this.customValues[this.value[0]]).toString(), max.toString()]] :
                [[min.toString(), this.value[1].toString()], [this.value[0].toString(), max.toString()]];
            range.forEach(function (range, index) {
                var element = index === 0 ? _this.firstHandle : _this.secondHandle;
                if (element) {
                    sf.base.attributes(element, {
                        'aria-valuemin': range[0], 'aria-valuemax': range[1]
                    });
                }
            });
        }
    };
    Slider.prototype.createSecondHandle = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.secondHandle = this.element.querySelector('.e-handle-second');
        }
        else {
            this.secondHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0'
                }
            });
            this.secondHandle.classList.add(classNames.sliderSecondHandle);
            this.element.appendChild(this.secondHandle);
        }
    };
    Slider.prototype.createFirstHandle = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.firstHandle = this.element.querySelector('.e-handle-first');
        }
        else {
            this.firstHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle, 'role': 'slider', tabIndex: '0'
                }
            });
            this.firstHandle.classList.add(classNames.sliderFirstHandle);
            this.element.appendChild(this.firstHandle);
        }
        if (this.isMaterialTooltip) {
            this.materialHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle + ' ' +
                        classNames.sliderMaterialHandle
                }
            });
            this.element.appendChild(this.materialHandle);
        }
    };
    Slider.prototype.wireFirstHandleEvt = function (destroy) {
        if (!destroy) {
            sf.base.EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
            sf.base.EventHandler.add(this.firstHandle, 'transitionend', this.transitionEnd, this);
            sf.base.EventHandler.add(this.firstHandle, 'mouseenter touchenter', this.handleOver, this);
            sf.base.EventHandler.add(this.firstHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            sf.base.EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
            sf.base.EventHandler.remove(this.firstHandle, 'transitionend', this.transitionEnd);
            sf.base.EventHandler.remove(this.firstHandle, 'mouseenter touchenter', this.handleOver);
            sf.base.EventHandler.remove(this.firstHandle, 'mouseleave touchend', this.handleLeave);
        }
    };
    Slider.prototype.wireSecondHandleEvt = function (destroy) {
        if (!destroy) {
            sf.base.EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
            sf.base.EventHandler.add(this.secondHandle, 'transitionend', this.transitionEnd, this);
            sf.base.EventHandler.add(this.secondHandle, 'mouseenter touchenter', this.handleOver, this);
            sf.base.EventHandler.add(this.secondHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            sf.base.EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
            sf.base.EventHandler.remove(this.secondHandle, 'transitionend', this.transitionEnd);
            sf.base.EventHandler.remove(this.secondHandle, 'mouseenter touchenter', this.handleOver);
            sf.base.EventHandler.remove(this.secondHandle, 'mouseleave touchend', this.handleLeave);
        }
    };
    Slider.prototype.handleStart = function () {
        if (this.type !== 'Range') {
            this.firstHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
            if (this.isMaterialTooltip) {
                this.materialHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
                if (this.tooltipElement) {
                    this.tooltipElement.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderTooltipStart);
                }
            }
        }
    };
    Slider.prototype.transitionEnd = function (e) {
        if (e.propertyName !== 'transform') {
            this.handleStart();
            this.getHandle().style.transition = 'none';
            if (this.type !== 'Default') {
                this.rangeBar.style.transition = 'none';
            }
            if (this.isMaterial && this.tooltip.isVisible && this.type === 'Default') {
                this.tooltipElement.style.transition = this.transition.handle;
            }
            this.tooltipToggle(this.getHandle());
            this.closeTooltip();
        }
    };
    Slider.prototype.handleFocusOut = function () {
        if (this.firstHandle.classList.contains(classNames.sliderHandleFocused)) {
            this.firstHandle.classList.remove(classNames.sliderHandleFocused);
        }
        if (this.type === 'Range') {
            if (this.secondHandle.classList.contains(classNames.sliderHandleFocused)) {
                this.secondHandle.classList.remove(classNames.sliderHandleFocused);
            }
        }
    };
    Slider.prototype.handleFocus = function (e) {
        this.focusSliderElement();
        this.sliderBarClick(e);
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
        }
        else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
        }
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    };
    Slider.prototype.handleOver = function (e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover') {
            this.tooltipToggle(e.currentTarget);
        }
    };
    Slider.prototype.handleLeave = function (e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover' &&
            !e.currentTarget.classList.contains(classNames.sliderHandleFocused) &&
            !e.currentTarget.classList.contains(classNames.sliderTabHandle)) {
            this.closeTooltip();
        }
    };
    Slider.prototype.setHandler = function () {
        if (this.min > this.max) {
            this.min = this.max;
        }
        this.createFirstHandle();
        if (this.type === 'Range') {
            this.createSecondHandle();
        }
    };
    Slider.prototype.setEnableRTL = function () {
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.enableRtl && this.orientation !== 'Vertical' ? sf.base.addClass([this.sliderContainer], classNames.rtl) :
                sf.base.removeClass([this.sliderContainer], classNames.rtl);
            var preDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
            if (this.enableRtl) {
                this.horDir = 'right';
                this.verDir = 'bottom';
            }
            else {
                this.horDir = 'left';
                this.verDir = 'bottom';
            }
            var currDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
            if (preDir !== currDir) {
                if (this.orientation === 'Horizontal') {
                    sf.base.setStyleAttribute(this.firstHandle, { 'right': '', 'left': 'auto' });
                    if (this.type === 'Range') {
                        sf.base.setStyleAttribute(this.secondHandle, { 'top': '', 'left': 'auto' });
                    }
                }
            }
        }
        this.setBarColor();
    };
    Slider.prototype.tooltipValue = function () {
        var _this = this;
        var text;
        var args = {
            value: this.value,
            text: ''
        };
        if (this.initialTooltip) {
            this.initialTooltip = false;
            if (sf.base.isBlazor() && this.isServerRendered) {
                args.text = this.formatContent(this.tooltipFormatInfo, false);
            }
            else {
                this.setTooltipContent();
                args.text = text = this.tooltipObj.content;
            }
            this.trigger('tooltipChange', args, function (observedArgs) {
                _this.addTooltipClass(observedArgs.text);
                if (text !== observedArgs.text) {
                    _this.customAriaText = observedArgs.text;
                    _this.tooltipObj.content = observedArgs.text;
                    _this.setAriaAttrValue(_this.firstHandle);
                    if (_this.type === 'Range') {
                        _this.setAriaAttrValue(_this.secondHandle);
                    }
                }
            });
            if (this.isMaterialTooltip) {
                this.setPreviousVal('change', this.value);
            }
        }
    };
    Slider.prototype.setTooltipContent = function () {
        var content;
        content = this.formatContent(this.tooltipFormatInfo, false);
        this.tooltipObj.content = content;
    };
    Slider.prototype.formatContent = function (formatInfo, ariaContent) {
        var content = '';
        var handle1 = this.handleVal1;
        var handle2 = this.handleVal2;
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            handle1 = this.customValues[this.handleVal1];
            handle2 = this.customValues[this.handleVal2];
        }
        if (!ariaContent) {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle2, formatInfo)
                        .formatString + ' - ' + this.formatString(handle1, formatInfo).formatString) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle1, formatInfo)
                        .formatString + ' - ' + this.formatString(handle2, formatInfo).formatString) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(handle1)) {
                    content = (!sf.base.isNullOrUndefined(formatInfo.format)) ?
                        this.formatString(handle1, formatInfo).formatString : handle1.toString();
                }
            }
            return content;
        }
        else {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle2, formatInfo).elementVal + ' - ' +
                            this.formatString(handle1, formatInfo).elementVal) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle1, formatInfo).elementVal + ' - ' +
                            this.formatString(handle2, formatInfo).elementVal) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(handle1)) {
                    content = (!sf.base.isNullOrUndefined(this.tooltip) && !sf.base.isNullOrUndefined(this.tooltip.format)) ?
                        this.formatString(handle1, formatInfo).elementVal : handle1.toString();
                }
            }
            return content;
        }
    };
    Slider.prototype.addTooltipClass = function (content) {
        if (this.isMaterialTooltip) {
            var count = content.toString().length;
            if (!this.tooltipElement) {
                var cssClass = count > 4 ? classNames.sliderMaterialRange : classNames.sliderMaterialDefault;
                this.tooltipObj.cssClass = classNames.sliderTooltip + ' ' + cssClass;
            }
            else {
                var cssClass = count > 4 ?
                    { oldCss: classNames.sliderMaterialDefault, newCss: classNames.sliderMaterialRange } :
                    { oldCss: classNames.sliderMaterialRange, newCss: classNames.sliderMaterialDefault };
                this.tooltipElement.classList.remove(cssClass.oldCss);
                if (!this.tooltipElement.classList.contains(cssClass.newCss)) {
                    this.tooltipElement.classList.add(cssClass.newCss);
                    this.tooltipElement.style.transform = count > 4 ? 'scale(1)' :
                        this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
        }
    };
    Slider.prototype.tooltipPlacement = function () {
        return this.orientation === 'Horizontal' ? (this.tooltip.placement === 'Before' ? 'TopCenter' : 'BottomCenter') :
            (this.tooltip.placement === 'Before' ? 'LeftCenter' : 'RightCenter');
    };
    Slider.prototype.tooltipBeforeOpen = function (args) {
        this.tooltipElement = args.element;
        if (this.tooltip.cssClass) {
            sf.base.addClass([this.tooltipElement], this.tooltip.cssClass.split(' ').filter(function (css) { return css; }));
        }
        args.target.removeAttribute('aria-describedby');
        if (this.isMaterialTooltip) {
            this.tooltipElement.firstElementChild.classList.add(classNames.materialTooltipHide);
            this.handleStart();
            this.setTooltipTransform();
        }
    };
    Slider.prototype.tooltipCollision = function (position) {
        if (this.isBootstrap || this.isBootstrap4 || (this.isMaterial && !this.isMaterialTooltip)) {
            var tooltipOffsetValue = this.isBootstrap4 ? bootstrap4TooltipOffset : bootstrapTooltipOffset;
            switch (position) {
                case 'TopCenter':
                    this.tooltipObj.setProperties({ 'offsetY': -(tooltipOffsetValue) }, false);
                    break;
                case 'BottomCenter':
                    this.tooltipObj.setProperties({ 'offsetY': tooltipOffsetValue }, false);
                    break;
                case 'LeftCenter':
                    this.tooltipObj.setProperties({ 'offsetX': -(tooltipOffsetValue) }, false);
                    break;
                case 'RightCenter':
                    this.tooltipObj.setProperties({ 'offsetX': tooltipOffsetValue }, false);
                    break;
            }
        }
    };
    Slider.prototype.materialTooltipEventCallBack = function (event) {
        this.sliderBarClick(event);
        sf.base.EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
        sf.base.EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
    };
    Slider.prototype.wireMaterialTooltipEvent = function (destroy) {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                sf.base.EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack, this);
            }
            else {
                sf.base.EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.materialTooltipEventCallBack);
            }
        }
    };
    Slider.prototype.tooltipPositionCalculation = function (position) {
        var cssClass;
        switch (position) {
            case 'TopCenter':
                cssClass = classNames.horizontalTooltipBefore;
                break;
            case 'BottomCenter':
                cssClass = classNames.horizontalTooltipAfter;
                break;
            case 'LeftCenter':
                cssClass = classNames.verticalTooltipBefore;
                break;
            case 'RightCenter':
                cssClass = classNames.verticalTooltipAfter;
                break;
        }
        return cssClass;
    };
    Slider.prototype.getTooltipTransformProperties = function (className) {
        var transformProperties;
        if (this.tooltipElement) {
            var position = this.orientation === 'Horizontal' ?
                ((this.tooltipElement.clientHeight + 14) - (this.tooltipElement.clientHeight / 2)) :
                ((this.tooltipElement.clientWidth + 14) - (this.tooltipElement.clientWidth / 2));
            transformProperties = this.orientation === 'Horizontal' ?
                (className === classNames.horizontalTooltipBefore ? { rotate: 'rotate(45deg)', translate: "translateY(" + position + "px)" } :
                    { rotate: 'rotate(225deg)', translate: "translateY(" + -(position) + "px)" }) :
                (className === classNames.verticalTooltipBefore ? { rotate: 'rotate(-45deg)', translate: "translateX(" + position + "px)" } :
                    { rotate: 'rotate(-225deg)', translate: "translateX(" + (-position) + "px)" });
        }
        return transformProperties;
    };
    Slider.prototype.openMaterialTooltip = function () {
        var _this = this;
        if (this.isMaterialTooltip) {
            this.refreshTooltip(this.firstHandle);
            var tooltipContentElement = this.tooltipElement.firstElementChild;
            tooltipContentElement.classList.remove(classNames.materialTooltipHide);
            tooltipContentElement.classList.add(classNames.materialTooltipShow);
            this.firstHandle.style.cursor = 'default';
            this.tooltipElement.style.transition = this.scaleTransform;
            this.tooltipElement.classList.add(classNames.materialTooltipOpen);
            this.materialHandle.style.transform = 'scale(0)';
            if (tooltipContentElement.innerText.length > 4) {
                this.tooltipElement.style.transform = 'scale(1)';
            }
            else {
                this.tooltipElement.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
            }
            if (this.type === 'Default') {
                setTimeout(function () { _this.tooltipElement.style.transition = _this.transition.handle; }, 2500);
            }
            else {
                setTimeout(function () { _this.tooltipElement.style.transition = 'none'; }, 2500);
            }
        }
    };
    Slider.prototype.closeMaterialTooltip = function () {
        var _this = this;
        if (this.isMaterialTooltip) {
            var tooltipContentElement = this.tooltipElement.firstElementChild;
            this.tooltipElement.style.transition = this.scaleTransform;
            tooltipContentElement.classList.remove(classNames.materialTooltipShow);
            tooltipContentElement.classList.add(classNames.materialTooltipHide);
            this.firstHandle.style.cursor = '-webkit-grab';
            this.firstHandle.style.cursor = 'grab';
            if (this.materialHandle) {
                this.materialHandle.style.transform = 'scale(1)';
            }
            this.tooltipElement.classList.remove(classNames.materialTooltipOpen);
            this.setTooltipTransform();
            this.tooltipTarget = undefined;
            setTimeout(function () { _this.tooltipElement.style.transition = 'none'; }, 2500);
        }
    };
    Slider.prototype.checkTooltipPosition = function (args) {
        var tooltipClass = this.tooltipPositionCalculation(args.collidedPosition);
        if (this.tooltipCollidedPosition === undefined ||
            this.tooltipCollidedPosition !== args.collidedPosition || !args.element.classList.contains(tooltipClass)) {
            if (this.isMaterialTooltip) {
                if (tooltipClass !== undefined) {
                    args.element.classList.remove(this.previousTooltipClass);
                    args.element.classList.add(tooltipClass);
                    this.previousTooltipClass = tooltipClass;
                }
                if (args.element.style.transform && args.element.classList.contains(classNames.materialTooltipOpen) &&
                    args.element.firstElementChild.innerText.length <= 4) {
                    args.element.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
            this.tooltipCollidedPosition = args.collidedPosition;
        }
        if (this.isMaterialTooltip && this.tooltipElement && this.tooltipElement.style.transform.indexOf('translate') !== -1) {
            this.setTooltipTransform();
        }
    };
    Slider.prototype.setTooltipTransform = function () {
        var transformProperties = this.getTooltipTransformProperties(this.previousTooltipClass);
        if (this.tooltipElement.firstElementChild.innerText.length > 4) {
            this.tooltipElement.style.transform = transformProperties.translate + " scale(0.01)";
        }
        else {
            this.tooltipElement.style.transform = transformProperties.translate + " " + transformProperties.rotate + " scale(0.01)";
        }
    };
    Slider.prototype.renderTooltip = function () {
        this.tooltipObj = new sf.popups.Tooltip({
            showTipPointer: this.isBootstrap || this.isMaterial || this.isBootstrap4,
            cssClass: classNames.sliderTooltip,
            height: this.isMaterial ? 30 : 'auto',
            animation: { open: { effect: 'None' }, close: { effect: 'FadeOut', duration: 500 } },
            opensOn: 'Custom',
            beforeOpen: this.tooltipBeforeOpen.bind(this),
            beforeCollision: this.checkTooltipPosition.bind(this),
            beforeClose: this.tooltipBeforeClose.bind(this),
            enableHtmlSanitizer: this.enableHtmlSanitizer
        });
        this.tooltipObj.appendTo(this.firstHandle);
        this.initializeTooltipProps();
    };
    Slider.prototype.initializeTooltipProps = function () {
        var tooltipShowOn = this.isMaterialTooltip ? 'Always' : (this.tooltip.showOn === 'Auto' ? 'Hover' : this.tooltip.showOn);
        this.setProperties({ tooltip: { showOn: tooltipShowOn } }, true);
        this.tooltipObj.position = this.tooltipPlacement();
        this.tooltipCollision(this.tooltipObj.position);
        [this.firstHandle, this.rangeBar, this.secondHandle].forEach(function (handle) {
            if (!sf.base.isNullOrUndefined(handle)) {
                handle.style.transition = 'none';
            }
        });
        if (this.isMaterialTooltip) {
            this.sliderContainer.classList.add(classNames.materialSlider);
            if (!sf.base.isBlazor()) {
                this.tooltipValue();
            }
            this.tooltipObj.animation.close.effect = 'None';
            this.tooltipObj.open(this.firstHandle);
        }
    };
    Slider.prototype.tooltipBeforeClose = function () {
        this.tooltipElement = undefined;
        this.tooltipCollidedPosition = undefined;
    };
    Slider.prototype.setButtons = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.firstBtn = this.element.parentElement.querySelector('.e-slider-button.e-first-button');
            this.secondBtn = this.element.parentElement.querySelector('.e-slider-button.e-second-button');
        }
        else {
            this.firstBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.firstButton });
            this.firstBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
            this.firstBtn.tabIndex = -1;
            this.secondBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.secondButton });
            this.secondBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
            this.secondBtn.tabIndex = -1;
            this.sliderContainer.classList.add(classNames.sliderButtonClass);
            this.sliderContainer.appendChild(this.firstBtn);
            this.sliderContainer.appendChild(this.secondBtn);
            this.sliderContainer.appendChild(this.element);
            this.buttonTitle();
        }
    };
    Slider.prototype.buttonTitle = function () {
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        var decrementTitle = this.l10n.getConstant('decrementTitle');
        var incrementTitle = this.l10n.getConstant('incrementTitle');
        sf.base.attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        sf.base.attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
    };
    Slider.prototype.buttonFocusOut = function () {
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
        }
    };
    Slider.prototype.repeatButton = function (args) {
        var hVal = this.handleValueUpdate();
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        var value;
        if (args.target.parentElement.classList.contains(classNames.firstButton)
            || args.target.classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        }
        else if (args.target.parentElement.classList.contains(classNames.secondButton)
            || (args.target.classList.contains(classNames.secondButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        if (value >= this.min && value <= this.max) {
            this.changeHandleValue(value);
            this.tooltipToggle(this.getHandle());
        }
    };
    Slider.prototype.repeatHandlerMouse = function (args) {
        args.preventDefault();
        if (args.type === ('mousedown') || args.type === ('touchstart')) {
            this.buttonClick(args);
            this.repeatInterval = setInterval(this.repeatButton.bind(this), 180, args);
        }
    };
    Slider.prototype.materialChange = function () {
        if (!this.getHandle().classList.contains('e-large-thumb-size')) {
            this.getHandle().classList.add('e-large-thumb-size');
        }
    };
    Slider.prototype.repeatHandlerUp = function (e) {
        this.changeEvent('changed', e);
        this.closeTooltip();
        clearInterval(this.repeatInterval);
        this.getHandle().focus();
    };
    Slider.prototype.customTickCounter = function (bigNum) {
        var tickCount = 4;
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            if (bigNum > 4) {
                tickCount = 3;
            }
            if (bigNum > 7) {
                tickCount = 2;
            }
            if (bigNum > 14) {
                tickCount = 1;
            }
            if (bigNum > 28) {
                tickCount = 0;
            }
        }
        return tickCount;
    };
    // tslint:disable-next-line:max-func-body-length
    Slider.prototype.renderScale = function () {
        var liElementPosition = 0;
        var orien = this.orientation === 'Vertical' ? 'v' : 'h';
        this.noOfDecimals = this.numberOfDecimals(this.step);
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.ul = this.element.querySelector('ul');
        }
        else {
            this.ul = this.createElement('ul', {
                className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
                attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
            });
        }
        this.ul.style.zIndex = '-1';
        if (sf.base.Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        var smallStep = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            this.ticks.largeStep > 0 ? (smallStep = this.ticks.largeStep) :
                (smallStep = (parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min))));
        }
        else if (smallStep <= 0) {
            smallStep = parseFloat(sf.base.formatUnit(this.step));
        }
        var min = this.fractionalToInteger(this.min);
        var max = this.fractionalToInteger(this.max);
        var steps = this.fractionalToInteger(smallStep);
        var bigNum = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        var customStep = this.customTickCounter(bigNum);
        var count = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            (bigNum * customStep) + bigNum : Math.abs((max - min) / steps);
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.element.appendChild(this.ul);
        }
        var li;
        var start = parseFloat(this.min.toString());
        if (orien === 'v') {
            start = parseFloat(this.max.toString());
        }
        var left = 0;
        var islargeTick;
        var tickWidth = 100 / count;
        if (tickWidth === Infinity) {
            tickWidth = 5;
        }
        for (var i = 0, y = !sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            this.customValues.length - 1 : 0, k = 0; i <= count; i++) {
            li = (this.createElement('li', {
                attrs: {
                    class: classNames.tick, role: 'presentation', tabIndex: '-1',
                    'aria-hidden': 'true'
                }
            }));
            if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
                islargeTick = i % (customStep + 1) === 0;
                if (islargeTick) {
                    if (orien === 'h') {
                        start = this.customValues[k];
                        k++;
                    }
                    else {
                        start = this.customValues[y];
                        y--;
                    }
                    li.setAttribute('title', start.toString());
                }
            }
            else {
                li.setAttribute('title', start.toString());
                if (this.numberOfDecimals(this.max) === 0 && this.numberOfDecimals(this.min) === 0 &&
                    this.numberOfDecimals(this.step) === 0) {
                    if (orien === 'h') {
                        islargeTick = ((start - parseFloat(this.min.toString())) % this.ticks.largeStep === 0) ? true : false;
                    }
                    else {
                        islargeTick = (Math.abs(start - parseFloat(this.max.toString())) % this.ticks.largeStep === 0) ? true : false;
                    }
                }
                else {
                    var largestep = this.fractionalToInteger(this.ticks.largeStep);
                    var startValue = this.fractionalToInteger(start);
                    if (orien === 'h') {
                        islargeTick = ((startValue - min) % largestep === 0) ? true : false;
                    }
                    else {
                        islargeTick = (Math.abs(startValue - parseFloat(max.toString())) % largestep === 0) ? true : false;
                    }
                }
            }
            if (islargeTick) {
                li.classList.add(classNames.large);
            }
            (orien === 'h') ? (li.style.width = tickWidth + '%') : (li.style.height = tickWidth + '%');
            var repeat = islargeTick ? (this.ticks.placement === 'Both' ? 2 : 1) : 0;
            if (islargeTick) {
                for (var j = 0; j < repeat; j++) {
                    this.createTick(li, start, tickWidth);
                }
                if (sf.base.isBlazor() && this.isServerRendered && sf.base.isNullOrUndefined(this.customValues)) {
                    this.updateTicksValues(start, this.ul.children[liElementPosition]);
                    liElementPosition++;
                }
            }
            else if (sf.base.isNullOrUndefined(this.customValues)) {
                this.formatTicksValue(li, start);
                if (sf.base.isBlazor() && this.isServerRendered && sf.base.isNullOrUndefined(this.customValues)) {
                    this.updateTicksValues(start, this.ul.children[liElementPosition]);
                    liElementPosition++;
                }
            }
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                this.ul.appendChild(li);
            }
            this.tickElementCollection.push(li);
            var decimalPoints = void 0;
            if (sf.base.isNullOrUndefined(this.customValues)) {
                if (this.numberOfDecimals(smallStep) > this.numberOfDecimals(start)) {
                    decimalPoints = this.numberOfDecimals(smallStep);
                }
                else {
                    decimalPoints = this.numberOfDecimals(start);
                }
                if (orien === 'h') {
                    start = this.makeRoundNumber(start + smallStep, decimalPoints);
                }
                else {
                    start = this.makeRoundNumber(start - smallStep, decimalPoints);
                }
                left = this.makeRoundNumber(left + smallStep, decimalPoints);
            }
        }
        this.ticksAlignment(orien, tickWidth);
    };
    Slider.prototype.updateTicksValues = function (start, liElement) {
        if (liElement.childElementCount > 0) {
            for (var i = 0; i < liElement.childElementCount; i++) {
                this.blazortTicksValue(liElement, start, liElement.children[i]);
            }
        }
        else {
            this.blazortTicksValue(liElement, start, null);
        }
    };
    Slider.prototype.blazortTicksValue = function (li, start, span) {
        var _this = this;
        var tickText = this.formatNumber(start);
        var text = !sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        var eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, function (observedArgs) {
            li.setAttribute('title', observedArgs.text.toString());
            if (span) {
                if (_this.enableHtmlSanitizer) {
                    span.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                }
                else {
                    span.innerHTML = observedArgs.text.toString();
                }
            }
        });
    };
    Slider.prototype.ticksAlignment = function (orien, tickWidth, triggerEvent) {
        if (triggerEvent === void 0) { triggerEvent = true; }
        this.firstChild = this.ul.firstElementChild;
        this.lastChild = this.ul.lastElementChild;
        this.firstChild.classList.add(classNames.sliderFirstTick);
        this.lastChild.classList.add(classNames.sliderLastTick);
        this.sliderContainer.classList.add(classNames.scale + '-' + this.ticks.placement.toLowerCase());
        if (orien === 'h') {
            this.firstChild.style.width = tickWidth / 2 + '%';
            this.lastChild.style.width = tickWidth / 2 + '%';
        }
        else {
            this.firstChild.style.height = tickWidth / 2 + '%';
            this.lastChild.style.height = tickWidth / 2 + '%';
        }
        var eventArgs = { ticksWrapper: this.ul, tickElements: this.tickElementCollection };
        if (triggerEvent) {
            this.trigger('renderedTicks', eventArgs);
        }
        this.scaleAlignment();
    };
    Slider.prototype.createTick = function (li, start, tickWidth) {
        var span = this.createElement('span', {
            className: classNames.tickValue + ' ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        li.appendChild(span);
        if (sf.base.isNullOrUndefined(this.customValues)) {
            this.formatTicksValue(li, start, span, tickWidth);
        }
        else {
            if (this.enableHtmlSanitizer) {
                span.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(start.toString());
            }
            else {
                span.innerHTML = start.toString();
            }
        }
    };
    Slider.prototype.formatTicksValue = function (li, start, spanElement, tickWidth) {
        var _this = this;
        var tickText = this.formatNumber(start);
        var text = !sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        var eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, function (observedArgs) {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                if (_this.enableHtmlSanitizer) {
                    spanElement.innerHTML = sf.base.SanitizeHtmlHelper.sanitize(observedArgs.text.toString());
                }
                else {
                    spanElement.innerHTML = observedArgs.text.toString();
                }
            }
            if (!sf.base.isNullOrUndefined(_this.renderingTicks) && sf.base.isBlazor()) {
                var orien = _this.orientation === 'Horizontal' ? 'h' : 'v';
                _this.ticksAlignment(orien, tickWidth, false);
            }
        });
    };
    Slider.prototype.scaleAlignment = function () {
        this.tickValuePosition();
        var orien = this.orientation === 'Vertical' ? 'v' : 'h';
        if (this.orientation === 'Vertical') {
            (this.element.getBoundingClientRect().width <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        }
        else {
            (this.element.getBoundingClientRect().height <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        }
    };
    Slider.prototype.tickValuePosition = function () {
        this.firstChild = this.element.querySelector('ul').children[0];
        var first = this.firstChild.getBoundingClientRect();
        var firstChild;
        var otherChild;
        var smallStep = this.ticks.smallStep;
        var count = Math.abs((parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min)))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = this.firstChild.children[0].getBoundingClientRect();
        }
        var tickElements = [this.sliderContainer.querySelectorAll('.' + classNames.tick + '.' +
                classNames.large + ' .' + classNames.tickValue)];
        var other;
        if (this.ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        }
        else {
            other = [].slice.call(tickElements[0], 1);
        }
        var tickWidth = this.orientation === 'Vertical' ?
            (first.height * 2) : (first.width * 2);
        for (var i = 0; i < this.firstChild.children.length; i++) {
            if (this.orientation === 'Vertical') {
                if (!sf.base.isBlazor() || !this.isServerRendered) {
                    this.firstChild.children[i].style.top = -(firstChild.height / 2) + 'px';
                }
            }
            else {
                if (!this.enableRtl) {
                    this.firstChild.children[i].style.left = -(firstChild.width / 2) + 'px';
                }
                else {
                    this.firstChild.children[i].style.left = (tickWidth -
                        this.firstChild.children[i].getBoundingClientRect().width) / 2 + 'px';
                }
            }
        }
        for (var i = 0; i < other.length; i++) {
            otherChild = other[i].getBoundingClientRect();
            if (this.orientation === 'Vertical') {
                if (!sf.base.isBlazor() || !this.isServerRendered) {
                    sf.base.setStyleAttribute(other[i], { top: (tickWidth - otherChild.height) / 2 + 'px' });
                }
            }
            else {
                sf.base.setStyleAttribute(other[i], { left: (tickWidth - otherChild.width) / 2 + 'px' });
            }
        }
        if (this.enableRtl && this.lastChild.children.length && count !== 0) {
            this.lastChild.children[0].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            if (this.ticks.placement === 'Both') {
                if (!sf.base.isBlazor()) {
                    this.lastChild.children[1].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
                }
            }
        }
        if (count === 0) {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    if (!sf.base.isBlazor()) {
                        this.firstChild.style.left = this.firstHandle.style.left;
                    }
                }
                else {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    this.firstChild.style.right = this.firstHandle.style.right;
                    if (!sf.base.isBlazor()) {
                        this.firstChild.children[0].style.left =
                            (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                        if (this.ticks.placement === 'Both') {
                            this.firstChild.children[1].style.left =
                                (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                        }
                    }
                }
            }
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                if (this.orientation === 'Vertical') {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                }
            }
        }
        if (sf.base.isBlazor() && this.isServerRendered) {
            var args = void 0;
            if (this.firstChild != null) {
                if (this.orientation === 'Horizontal') {
                    args = { firstTickPostion: this.firstChild.children[0].style.left };
                }
                else {
                    args = { firstTickPostion: -(firstChild.height / 2) + 'px' };
                }
            }
            if (other[0] != null) {
                if (this.orientation === 'Horizontal') {
                    args = { otherTicksPosition: other[0].style.left };
                }
                else {
                    args = { otherTicksPosition: (tickWidth - otherChild.height) / 2 + 'px' };
                }
            }
            if (this.firstChild != null && other[0] != null) {
                if (this.orientation === 'Horizontal') {
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
            // tslint:disable
            this.interopAdaptor.invokeMethodAsync('SliderTicksData', args);
            // tslint:enable
        }
    };
    Slider.prototype.setAriaAttrValue = function (element) {
        var ariaValueText;
        var isTickFormatted = ((!sf.base.isNullOrUndefined(this.ticks) && !sf.base.isNullOrUndefined(this.ticks.format))) ? true : false;
        var text = !isTickFormatted ?
            this.formatContent(this.ticksFormatInfo, false) : this.formatContent(this.tooltipFormatInfo, false);
        var valuenow = isTickFormatted ? this.formatContent(this.ticksFormatInfo, true) :
            this.formatContent(this.tooltipFormatInfo, true);
        text = (!this.customAriaText) ? (text) : (this.customAriaText);
        if (text.split(' - ').length === 2) {
            ariaValueText = text.split(' - ');
        }
        else {
            ariaValueText = [text, text];
        }
        this.setAriaAttributes(element);
        if (this.type !== 'Range') {
            sf.base.attributes(element, { 'aria-valuenow': valuenow, 'aria-valuetext': text });
        }
        else {
            (!this.enableRtl) ? ((element === this.firstHandle) ?
                sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }) :
                sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] })) :
                ((element === this.firstHandle) ?
                    sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] }) :
                    sf.base.attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }));
        }
    };
    Slider.prototype.handleValueUpdate = function () {
        var hVal;
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                hVal = this.handleVal1;
            }
            else {
                hVal = this.handleVal2;
            }
        }
        else {
            hVal = this.handleVal1;
        }
        return hVal;
    };
    Slider.prototype.getLimitCorrectedValues = function (value) {
        if (this.type === 'MinRange' || this.type === 'Default') {
            value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
        }
        else {
            if (this.activeHandle === 1) {
                value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
            }
            else {
                value = (this.getLimitValueAndPosition(value, this.limits.maxStart, this.limits.maxEnd))[0];
            }
        }
        return value;
    };
    Slider.prototype.focusSliderElement = function () {
        if (!this.isElementFocused) {
            this.element.focus();
            this.isElementFocused = true;
        }
    };
    Slider.prototype.buttonClick = function (args) {
        this.focusSliderElement();
        var value;
        var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        var hVal = this.handleValueUpdate();
        if ((args.keyCode === 40) || (args.keyCode === 37)
            || args.currentTarget.classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        }
        else if ((args.keyCode === 38) || (args.keyCode === 39) ||
            args.currentTarget.classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        }
        else if ((args.keyCode === 33
            || args.currentTarget.classList.contains(classNames.firstButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true));
        }
        else if ((args.keyCode === 34) ||
            args.currentTarget.classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false));
        }
        else if ((args.keyCode === 36)) {
            value = parseFloat(this.min.toString());
        }
        else if ((args.keyCode === 35)) {
            value = parseFloat(this.max.toString());
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        this.changeHandleValue(value);
        if (this.isMaterial && !this.tooltip.isVisible &&
            !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        this.getHandle().focus();
        if (args.currentTarget.classList.contains(classNames.firstButton)) {
            sf.base.EventHandler.add(this.firstBtn, 'mouseup touchend', this.buttonUp, this);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            sf.base.EventHandler.add(this.secondBtn, 'mouseup touchend', this.buttonUp, this);
        }
    };
    Slider.prototype.tooltipToggle = function (target) {
        if (this.isMaterialTooltip) {
            !this.tooltipElement.classList.contains(classNames.materialTooltipOpen) ?
                this.openMaterialTooltip() : this.refreshTooltip(this.firstHandle);
        }
        else {
            !this.tooltipElement ? this.openTooltip(target) : this.refreshTooltip(target);
        }
    };
    Slider.prototype.buttonUp = function (args) {
        if (args.currentTarget.classList.contains(classNames.firstButton)) {
            sf.base.EventHandler.remove(this.firstBtn, 'mouseup touchend', this.buttonUp);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            sf.base.EventHandler.remove(this.secondBtn, 'mouseup touchend', this.buttonUp);
        }
    };
    Slider.prototype.setRangeBar = function () {
        if (this.orientation === 'Horizontal') {
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
    };
    Slider.prototype.checkValidValueAndPos = function (value) {
        value = this.checkHandleValue(value);
        value = this.checkHandlePosition(value);
        return value;
    };
    Slider.prototype.setLimitBarPositions = function (fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion) {
        if (this.orientation === 'Horizontal') {
            if (!this.enableRtl) {
                this.limitBarFirst.style.left = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            }
            else {
                this.limitBarFirst.style.right = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            }
        }
        else {
            this.limitBarFirst.style.bottom = fromMinPostion + 'px';
            this.limitBarFirst.style.height = (fromMaxpostion - fromMinPostion) + 'px';
        }
        if (this.type === 'Range') {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.limitBarSecond.style.left = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                }
                else {
                    this.limitBarSecond.style.right = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                }
            }
            else {
                this.limitBarSecond.style.bottom = toMinPostion + 'px';
                this.limitBarSecond.style.height = (toMaxpostion - toMinPostion) + 'px';
            }
        }
    };
    Slider.prototype.setLimitBar = function () {
        if (this.type === 'Default' || this.type === 'MinRange') {
            var fromPosition = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromPosition = this.checkValidValueAndPos(fromPosition);
            var toPosition = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            toPosition = this.checkValidValueAndPos(toPosition);
            this.setLimitBarPositions(fromPosition, toPosition);
        }
        else if (this.type === 'Range') {
            var fromMinPostion = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMinPostion = this.checkValidValueAndPos(fromMinPostion);
            var fromMaxpostion = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMaxpostion = this.checkValidValueAndPos(fromMaxpostion);
            var toMinPostion = (this.getLimitValueAndPosition(this.limits.maxStart, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMinPostion = this.checkValidValueAndPos(toMinPostion);
            var toMaxpostion = (this.getLimitValueAndPosition(this.limits.maxEnd, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMaxpostion = this.checkValidValueAndPos(toMaxpostion);
            this.setLimitBarPositions(fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion);
        }
    };
    Slider.prototype.getLimitValueAndPosition = function (currentValue, minValue, maxValue, limitBar) {
        if (sf.base.isNullOrUndefined(minValue)) {
            minValue = this.min;
            if (sf.base.isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (sf.base.isNullOrUndefined(maxValue)) {
            maxValue = this.max;
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
    Slider.prototype.setValue = function () {
        if (!sf.base.isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            this.min = 0;
            this.max = this.customValues.length - 1;
            this.setBarColor();
        }
        this.setAriaAttributes(this.firstHandle);
        this.handleVal1 = sf.base.isNullOrUndefined(this.value) ? this.checkHandleValue(parseFloat(this.min.toString())) :
            this.checkHandleValue(parseFloat(this.value.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.preHandlePos1 = this.handlePos1;
        sf.base.isNullOrUndefined(this.activeHandle) ? (this.type === 'Range' ? this.activeHandle = 2 : this.activeHandle = 1) :
            this.activeHandle = this.activeHandle;
        if (this.type === 'Default' || this.type === 'MinRange') {
            if (this.limits.enabled) {
                var values = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = values[0];
                this.handlePos1 = values[1];
                this.preHandlePos1 = this.handlePos1;
            }
            this.setHandlePosition(null);
            this.handleStart();
            this.value = this.handleVal1;
            this.setAriaAttrValue(this.firstHandle);
            this.changeEvent('changed', null);
        }
        else {
            this.validateRangeValue();
        }
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
    };
    Slider.prototype.rangeValueUpdate = function () {
        if (this.value === null || typeof (this.value) !== 'object') {
            this.value = [parseFloat(sf.base.formatUnit(this.min)), parseFloat(sf.base.formatUnit(this.max))];
        }
    };
    Slider.prototype.validateRangeValue = function () {
        this.rangeValueUpdate();
        this.setRangeValue();
    };
    Slider.prototype.modifyZindex = function () {
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.style.zIndex = (this.zIndex + 4) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 3) + '';
            }
            else {
                this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
            }
        }
        else if (this.isMaterialTooltip && this.tooltipElement) {
            this.tooltipElement.style.zIndex = sf.popups.getZindexPartial(this.element) + '';
        }
    };
    Slider.prototype.setHandlePosition = function (event) {
        var _this = this;
        var handle;
        var pos = (this.activeHandle === 1) ? this.handlePos1 : this.handlePos2;
        if (this.isMaterialTooltip) {
            handle = [this.firstHandle, this.materialHandle];
        }
        else {
            handle = [this.getHandle()];
        }
        this.handleStart();
        handle.forEach(function (handle) {
            if (_this.orientation === 'Horizontal') {
                _this.enableRtl ? (handle.style.right =
                    pos + "px") : (handle.style.left = pos + "px");
            }
            else {
                handle.style.bottom = pos + "px";
            }
            if (sf.base.isBlazor() && _this.isServerRendered) {
                handle.style.removeProperty('visibility');
            }
        });
        this.changeEvent('change', event);
    };
    Slider.prototype.getHandle = function () {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    };
    Slider.prototype.setRangeValue = function () {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition(null);
        this.activeHandle = 2;
        this.setHandlePosition(null);
        this.activeHandle = 1;
    };
    Slider.prototype.changeEvent = function (eventName, e) {
        var previous = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value && (!this.isMaterialTooltip || !this.initialTooltip)) {
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        }
        else {
            var value = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if (previous.length === this.value.length
                && this.value[0] !== previous[0] || this.value[1] !== previous[1]) {
                this.initialTooltip = false;
                this.trigger(eventName, this.changeEventArgs(eventName, e));
                this.initialTooltip = true;
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    };
    Slider.prototype.changeEventArgs = function (eventName, e) {
        var eventArgs;
        if (this.tooltip.isVisible && this.tooltipObj && this.initialTooltip) {
            if (!sf.base.isBlazor() || !this.isServerRendered) {
                this.tooltipValue();
            }
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: this.tooltipObj.content, isInteracted: sf.base.isNullOrUndefined(e) ? false : true
            };
        }
        else {
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: sf.base.isNullOrUndefined(this.ticksFormatInfo.format) ? this.value.toString() :
                    (this.type !== 'Range' ? this.formatString(this.value, this.ticksFormatInfo).formatString :
                        (this.formatString(this.value[0], this.ticksFormatInfo).formatString + ' - ' +
                            this.formatString(this.value[1], this.ticksFormatInfo).formatString)),
                isInteracted: sf.base.isNullOrUndefined(e) ? false : true
            };
        }
        return eventArgs;
    };
    Slider.prototype.setPreviousVal = function (eventName, value) {
        if (eventName === 'change') {
            this.previousVal = value;
        }
        else {
            this.previousChanged = value;
        }
    };
    Slider.prototype.updateRangeValue = function () {
        var values = this.value.toString().split(',').map(Number);
        if ((this.enableRtl && this.orientation !== 'Vertical') || this.rtl) {
            this.value = [values[1], values[0]];
        }
        else {
            this.value = [values[0], values[1]];
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            this.handleVal1 = this.checkHandleValue(this.value[1]);
            this.handleVal2 = this.checkHandleValue(this.value[0]);
        }
        else {
            this.handleVal1 = this.checkHandleValue(this.value[0]);
            this.handleVal2 = this.checkHandleValue(this.value[1]);
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        if (this.handlePos1 > this.handlePos2) {
            this.handlePos1 = this.handlePos2;
            this.handleVal1 = this.handleVal2;
        }
        this.preHandlePos1 = this.handlePos1;
        this.preHandlePos2 = this.handlePos2;
        if (this.limits.enabled) {
            this.activeHandle = 1;
            var values_1 = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
            this.handleVal1 = values_1[0];
            this.handlePos1 = values_1[1];
            this.preHandlePos1 = this.handlePos1;
            this.activeHandle = 2;
            values_1 = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
            this.handleVal2 = values_1[0];
            this.handlePos2 = values_1[1];
            this.preHandlePos2 = this.handlePos2;
        }
    };
    Slider.prototype.checkHandlePosition = function (value) {
        var pos;
        value = (100 *
            (value - (parseFloat(sf.base.formatUnit(this.min))))) / ((parseFloat(sf.base.formatUnit(this.max))) - (parseFloat(sf.base.formatUnit(this.min))));
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (value / 100);
        }
        else {
            pos = this.element.getBoundingClientRect().height * (value / 100);
        }
        if (((parseFloat(sf.base.formatUnit(this.max))) === (parseFloat(sf.base.formatUnit(this.min))))) {
            if (this.orientation === 'Horizontal') {
                pos = this.element.getBoundingClientRect().width;
            }
            else {
                pos = this.element.getBoundingClientRect().height;
            }
        }
        return pos;
    };
    Slider.prototype.checkHandleValue = function (value) {
        if (this.min > this.max) {
            this.min = this.max;
        }
        if (this.min === this.max) {
            return (parseFloat(sf.base.formatUnit(this.max)));
        }
        var handle = this.tempStartEnd();
        if (value < handle.start) {
            value = handle.start;
        }
        else if (value > handle.end) {
            value = handle.end;
        }
        return value;
    };
    /**
     * It is used to reposition slider.
     * @returns void
     */
    Slider.prototype.reposition = function () {
        var _this = this;
        this.firstHandle.style.transition = 'none';
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        if (this.type === 'Range') {
            this.secondHandle.style.transition = 'none';
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.handleVal2) {
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        }
        if (this.orientation === 'Horizontal') {
            this.enableRtl ? this.firstHandle.style.right =
                this.handlePos1 + "px" : this.firstHandle.style.left = this.handlePos1 + "px";
            if (this.isMaterialTooltip) {
                this.enableRtl ? this.materialHandle.style.right =
                    this.handlePos1 + "px" : this.materialHandle.style.left = this.handlePos1 + "px";
            }
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.enableRtl ? this.secondHandle.style.right =
                    this.handlePos2 + "px" : this.secondHandle.style.left = this.handlePos2 + "px";
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                sf.base.setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            this.firstHandle.style.bottom = this.handlePos1 + "px";
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = this.handlePos1 + "px";
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': sf.base.isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.secondHandle.style.bottom = this.handlePos2 + "px";
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                sf.base.setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None' && this.ul) {
            if (!sf.base.isBlazor()) {
                this.removeElement(this.ul);
                this.ul = undefined;
            }
            this.renderScale();
            if (sf.base.isBlazor()) {
                this.tickValuePosition();
            }
        }
        this.handleStart();
        if (!this.tooltip.isVisible) {
            setTimeout(function () {
                _this.firstHandle.style.transition = _this.scaleTransform;
                if (_this.type === 'Range') {
                    _this.secondHandle.style.transition = _this.scaleTransform;
                }
            });
        }
        if (!sf.base.isBlazor() || !this.isServerRendered) {
            this.refreshTooltip(this.tooltipTarget);
        }
        this.setBarColor();
    };
    Slider.prototype.changeHandleValue = function (value) {
        var position = null;
        if (this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                this.handleVal1 = this.checkHandleValue(value);
                this.handlePos1 = this.checkHandlePosition(this.handleVal1);
                if (this.type === 'Range' && this.handlePos1 > this.handlePos2) {
                    this.handlePos1 = this.handlePos2;
                    this.handleVal1 = this.handleVal2;
                }
                if (this.handlePos1 !== this.preHandlePos1) {
                    position = this.preHandlePos1 = this.handlePos1;
                }
            }
            this.modifyZindex();
        }
        else {
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                this.handleVal2 = this.checkHandleValue(value);
                this.handlePos2 = this.checkHandlePosition(this.handleVal2);
                if (this.type === 'Range' && this.handlePos2 < this.handlePos1) {
                    this.handlePos2 = this.handlePos1;
                    this.handleVal2 = this.handleVal1;
                }
                if (this.handlePos2 !== this.preHandlePos2) {
                    position = this.preHandlePos2 = this.handlePos2;
                }
            }
            this.modifyZindex();
        }
        if (position !== null) {
            if (this.type !== 'Default') {
                this.setRangeBar();
            }
            this.setHandlePosition(null);
        }
    };
    Slider.prototype.tempStartEnd = function () {
        if (this.min > this.max) {
            return {
                start: this.max,
                end: this.min
            };
        }
        else {
            return {
                start: this.min,
                end: this.max
            };
        }
    };
    Slider.prototype.xyToPosition = function (position) {
        var pos;
        if (this.min === this.max) {
            return 100;
        }
        if (this.orientation === 'Horizontal') {
            var left = position.x - this.element.getBoundingClientRect().left;
            var num = this.element.offsetWidth / 100;
            this.val = (left / num);
        }
        else {
            var top_1 = position.y - this.element.getBoundingClientRect().top;
            var num = this.element.offsetHeight / 100;
            this.val = 100 - (top_1 / num);
        }
        var val = this.stepValueCalculation(this.val);
        if (val < 0) {
            val = 0;
        }
        else if (val > 100) {
            val = 100;
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            val = 100 - val;
        }
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (val / 100);
        }
        else {
            pos = this.element.getBoundingClientRect().height * (val / 100);
        }
        return pos;
    };
    Slider.prototype.stepValueCalculation = function (value) {
        if (this.step === 0) {
            this.step = 1;
        }
        var percentStep = (parseFloat(sf.base.formatUnit(this.step))) / ((parseFloat(sf.base.formatUnit(this.max)) - parseFloat(sf.base.formatUnit(this.min))) / 100);
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
    Slider.prototype.add = function (a, b, addition) {
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
    Slider.prototype.positionToValue = function (pos) {
        var val;
        var diff = parseFloat(sf.base.formatUnit(this.max)) - parseFloat(sf.base.formatUnit(this.min));
        if (this.orientation === 'Horizontal') {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        }
        else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        var total = this.add(val, parseFloat(this.min.toString()), true);
        return (total);
    };
    Slider.prototype.sliderBarClick = function (evt) {
        evt.preventDefault();
        var pos;
        if (evt.type === 'mousedown' || evt.type === 'mouseup' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else if (evt.type === 'touchend' || evt.type === 'touchstart') {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        var handlepos = this.xyToPosition(pos);
        var handleVal = this.positionToValue(handlepos);
        if (this.type === 'Range' && (this.handlePos2 - handlepos) < (handlepos - this.handlePos1)) {
            this.activeHandle = 2;
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                if (this.limits.enabled) {
                    var value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos2 = this.preHandlePos2 = handlepos;
                this.handleVal2 = handleVal;
            }
            this.modifyZindex();
            this.secondHandle.focus();
        }
        else {
            this.activeHandle = 1;
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    var value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos1 = this.preHandlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.modifyZindex();
            this.firstHandle.focus();
        }
        if (this.isMaterialTooltip) {
            this.tooltipElement.classList.add(classNames.materialTooltipActive);
        }
        var focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
        if (focusedElement && this.getHandle() !== focusedElement) {
            focusedElement.classList.remove(classNames.sliderTabHandle);
        }
        var handle = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
        if (evt.target === handle) {
            if (this.isMaterial && !this.tooltip.isVisible &&
                !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
                this.materialChange();
            }
            this.sliderBarUp(evt);
            this.tooltipToggle(this.getHandle());
            return;
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        var transition = this.isMaterial && this.tooltip.isVisible ?
            this.transitionOnMaterialTooltip : this.transition;
        this.getHandle().style.transition = transition.handle;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = transition.rangeBar;
        }
        this.setHandlePosition(evt);
        if (this.isMaterialTooltip) {
            this.initialTooltip = false;
        }
        this.changeEvent('changed', evt);
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    };
    Slider.prototype.handleValueAdjust = function (handleValue, assignValue, handleNumber) {
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
    Slider.prototype.dragRangeBarMove = function (event) {
        var _a, _b;
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        this.rangeBarDragged = true;
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
        if (!(this.limits.enabled && this.limits.startHandleFixed) && !(this.limits.enabled && this.limits.endHandleFixed)) {
            if (!this.enableRtl) {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion + this.secondPartRemain };
            }
            else {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion + this.secondPartRemain };
            }
            this.handlePos1 = this.xyToPosition(pos);
            this.handleVal1 = this.positionToValue(this.handlePos1);
            if (!this.enableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            }
            else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            this.handlePos2 = this.xyToPosition(pos);
            this.handleVal2 = this.positionToValue(this.handlePos2);
            if (this.limits.enabled) {
                var value = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = value[0];
                this.handlePos1 = value[1];
                if (this.handleVal1 === this.limits.minEnd) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minEnd, 1);
                }
                if (this.handleVal1 === this.limits.minStart) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minStart, 1);
                }
                value = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
                this.handleVal2 = value[0];
                this.handlePos2 = value[1];
                if (this.handleVal2 === this.limits.maxStart) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxStart, 2);
                }
                if (this.handleVal2 === this.limits.maxEnd) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxEnd, 2);
                }
            }
            if (this.handleVal2 === this.max) {
                this.handleValueAdjust(this.handleVal2, this.max, 2);
            }
            if (this.handleVal1 === this.min) {
                this.handleValueAdjust(this.handleVal1, this.min, 1);
            }
        }
        this.activeHandle = 1;
        this.setHandlePosition(event);
        this.activeHandle = 2;
        this.setHandlePosition(event);
        this.tooltipToggle(this.rangeBar);
        this.setRangeBar();
    };
    Slider.prototype.sliderBarUp = function (event) {
        this.changeEvent('changed', event);
        this.handleFocusOut();
        this.firstHandle.classList.remove(classNames.sliderActiveHandle);
        if (this.type === 'Range') {
            this.initialTooltip = false;
            this.secondHandle.classList.remove(classNames.sliderActiveHandle);
        }
        this.closeTooltip();
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
            if (this.isMaterialTooltip) {
                this.tooltipElement.classList.remove(classNames.materialTooltipActive);
            }
        }
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
    };
    Slider.prototype.sliderBarMove = function (evt) {
        if (evt.type !== 'touchmove') {
            evt.preventDefault();
        }
        var pos;
        if (evt.type === 'mousemove') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        var handlepos = this.xyToPosition(pos);
        var handleVal = this.positionToValue(handlepos);
        handlepos = Math.round(handlepos);
        if (this.type !== 'Range' && this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    var valueAndPostion = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handlepos = valueAndPostion[1];
                    handleVal = valueAndPostion[0];
                }
                this.handlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.firstHandle.classList.add(classNames.sliderActiveHandle);
        }
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                    if (handlepos > this.handlePos2) {
                        handlepos = this.handlePos2;
                        handleVal = this.handleVal2;
                    }
                    if (handlepos !== this.preHandlePos1) {
                        if (this.limits.enabled) {
                            var value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos1 = this.preHandlePos1 = handlepos;
                        this.handleVal1 = handleVal;
                        this.activeHandle = 1;
                    }
                }
            }
            else if (this.activeHandle === 2) {
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                    if (handlepos < this.handlePos1) {
                        handlepos = this.handlePos1;
                        handleVal = this.handleVal1;
                    }
                    if (handlepos !== this.preHandlePos2) {
                        if (this.limits.enabled) {
                            var value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos2 = this.preHandlePos2 = handlepos;
                        this.handleVal2 = handleVal;
                        this.activeHandle = 2;
                    }
                }
            }
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        this.getHandle().style.transition = this.scaleTransform;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        this.setHandlePosition(evt);
        if (this.isMaterial && !this.tooltip.isVisible &&
            !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    };
    Slider.prototype.dragRangeBarUp = function (event) {
        if (!this.rangeBarDragged) {
            this.focusSliderElement();
            this.sliderBarClick(event);
        }
        this.changeEvent('changed', event);
        this.closeTooltip();
        sf.base.EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        sf.base.EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
        this.rangeBarDragged = false;
    };
    Slider.prototype.checkRepeatedValue = function (currentValue) {
        if (this.type === 'Range') {
            var previousVal = this.enableRtl && this.orientation !== 'Vertical' ? (this.activeHandle === 1 ?
                this.previousVal[1] : this.previousVal[0]) :
                (this.activeHandle === 1 ? this.previousVal[0] : this.previousVal[1]);
            if (currentValue === previousVal) {
                return 0;
            }
        }
        else {
            if (currentValue === this.previousVal) {
                return 0;
            }
        }
        return 1;
    };
    Slider.prototype.refreshTooltip = function (target) {
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            if (target) {
                this.tooltipObj.refresh(target);
                this.tooltipTarget = target;
            }
        }
    };
    Slider.prototype.openTooltip = function (target) {
        if (this.tooltip.isVisible && this.tooltipObj && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.open(target);
            this.tooltipTarget = target;
        }
    };
    Slider.prototype.closeTooltip = function () {
        if (this.tooltip.isVisible && this.tooltipObj && this.tooltip.showOn !== 'Always' && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.close();
            this.tooltipTarget = undefined;
        }
    };
    Slider.prototype.keyDown = function (event) {
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
    Slider.prototype.wireButtonEvt = function (destroy) {
        if (!destroy) {
            sf.base.EventHandler.add(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            sf.base.EventHandler.add(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            sf.base.EventHandler.add(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            sf.base.EventHandler.add(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            sf.base.EventHandler.add(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            sf.base.EventHandler.add(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            sf.base.EventHandler.add(this.firstBtn, 'focusout', this.sliderFocusOut, this);
            sf.base.EventHandler.add(this.secondBtn, 'focusout', this.sliderFocusOut, this);
        }
        else {
            sf.base.EventHandler.remove(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut);
            sf.base.EventHandler.remove(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut);
            sf.base.EventHandler.remove(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            sf.base.EventHandler.remove(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            sf.base.EventHandler.remove(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            sf.base.EventHandler.remove(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            sf.base.EventHandler.remove(this.firstBtn, 'focusout', this.sliderFocusOut);
            sf.base.EventHandler.remove(this.secondBtn, 'focusout', this.sliderFocusOut);
        }
    };
    Slider.prototype.rangeBarMousedown = function (event) {
        var _a, _b;
        event.preventDefault();
        this.focusSliderElement();
        if (this.type === 'Range' && this.drag && event.target === this.rangeBar) {
            var xPostion = void 0;
            var yPostion = void 0;
            if (event.type === 'mousedown') {
                _a = [event.clientX, event.clientY], xPostion = _a[0], yPostion = _a[1];
            }
            else if (event.type === 'touchstart') {
                _b = [event.changedTouches[0].clientX, event.changedTouches[0].clientY], xPostion = _b[0], yPostion = _b[1];
            }
            if (this.orientation === 'Horizontal') {
                this.firstPartRemain = xPostion - this.rangeBar.getBoundingClientRect().left;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().right - xPostion;
            }
            else {
                this.firstPartRemain = yPostion - this.rangeBar.getBoundingClientRect().top;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().bottom - yPostion;
            }
            this.minDiff = this.handleVal2 - this.handleVal1;
            this.tooltipToggle(this.rangeBar);
            var focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.sliderTabHandle);
            }
            sf.base.EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            sf.base.EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
    };
    Slider.prototype.elementClick = function (event) {
        event.preventDefault();
        this.focusSliderElement();
        this.sliderBarClick(event);
    };
    Slider.prototype.wireEvents = function () {
        this.onresize = this.reposition.bind(this);
        window.addEventListener('resize', this.onresize);
        if (this.enabled && !this.readonly) {
            sf.base.EventHandler.add(this.element, 'click', this.elementClick, this);
            if (this.type === 'Range' && this.drag) {
                sf.base.EventHandler.add(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown, this);
            }
            sf.base.EventHandler.add(this.sliderContainer, 'keydown', this.keyDown, this);
            sf.base.EventHandler.add(this.sliderContainer, 'keyup', this.keyUp, this);
            sf.base.EventHandler.add(this.element, 'focusout', this.sliderFocusOut, this);
            sf.base.EventHandler.add(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover, this);
            this.wireFirstHandleEvt(false);
            if (this.type === 'Range') {
                this.wireSecondHandleEvt(false);
            }
            if (this.showButtons) {
                this.wireButtonEvt(false);
            }
            this.wireMaterialTooltipEvent(false);
            if (this.isForm) {
                sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
        }
    };
    Slider.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.elementClick);
        if (this.type === 'Range' && this.drag) {
            sf.base.EventHandler.remove(this.rangeBar, 'mousedown touchstart', this.rangeBarMousedown);
        }
        sf.base.EventHandler.remove(this.sliderContainer, 'keydown', this.keyDown);
        sf.base.EventHandler.remove(this.sliderContainer, 'keyup', this.keyUp);
        sf.base.EventHandler.remove(this.element, 'focusout', this.sliderFocusOut);
        sf.base.EventHandler.remove(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover);
        this.wireFirstHandleEvt(true);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(true);
        }
        if (this.showButtons) {
            this.wireButtonEvt(true);
        }
        this.wireMaterialTooltipEvent(true);
        sf.base.EventHandler.remove(this.element, 'reset', this.formResetHandler);
    };
    Slider.prototype.formResetHandler = function () {
        this.setProperties({ 'value': this.formResetValue }, true);
        this.setValue();
    };
    Slider.prototype.keyUp = function (event) {
        if (event.keyCode === 9 && event.target.classList.contains(classNames.sliderHandle)) {
            this.focusSliderElement();
            if (!event.target.classList.contains(classNames.sliderTabHandle)) {
                if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                    this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
                }
                event.target.classList.add(classNames.sliderTabHandle);
                var parentElement = event.target.parentElement;
                if (parentElement === this.element) {
                    parentElement.querySelector('.' + classNames.sliderTrack).classList.add(classNames.sliderTabTrack);
                    if (this.type === 'Range' || this.type === 'MinRange') {
                        parentElement.querySelector('.' + classNames.rangeBar).classList.add(classNames.sliderTabRange);
                    }
                }
                if (this.type === 'Range') {
                    (event.target.previousSibling).classList.contains(classNames.sliderHandle) ?
                        this.activeHandle = 2 : this.activeHandle = 1;
                }
                this.getHandle().focus();
                this.tooltipToggle(this.getHandle());
            }
        }
        this.closeTooltip();
        this.changeEvent('changed', event);
    };
    Slider.prototype.hover = function (event) {
        if (!sf.base.isNullOrUndefined(event)) {
            if (event.type === 'mouseover' || event.type === 'touchmove' || event.type === 'mousemove' ||
                event.type === 'pointermove' || event.type === 'touchstart') {
                this.sliderContainer.classList.add(classNames.sliderHover);
            }
            else {
                this.sliderContainer.classList.remove(classNames.sliderHover);
            }
        }
    };
    Slider.prototype.sliderFocusOut = function (event) {
        if (event.relatedTarget !== this.secondHandle && event.relatedTarget !== this.firstHandle &&
            event.relatedTarget !== this.element && event.relatedTarget !== this.firstBtn && event.relatedTarget !== this.secondBtn) {
            this.closeMaterialTooltip();
            if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
            }
            if (this.element.querySelector('.' + classNames.sliderTabTrack)) {
                this.element.querySelector('.' + classNames.sliderTabTrack).classList.remove(classNames.sliderTabTrack);
                if ((this.type === 'Range' || this.type === 'MinRange') &&
                    this.element.querySelector('.' + classNames.sliderTabRange)) {
                    this.element.querySelector('.' + classNames.sliderTabRange).classList.remove(classNames.sliderTabRange);
                }
            }
            this.hiddenInput.focus();
            this.hiddenInput.blur();
            this.isElementFocused = false;
        }
    };
    Slider.prototype.removeElement = function (element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };
    Slider.prototype.changeSliderType = function (type, args) {
        if (this.isMaterialTooltip && this.materialHandle) {
            this.sliderContainer.classList.remove(classNames.materialSlider);
            this.removeElement(this.materialHandle);
            this.materialHandle = undefined;
        }
        this.removeElement(this.firstHandle);
        this.firstHandle = undefined;
        if (type !== 'Default') {
            if (type === 'Range') {
                this.removeElement(this.secondHandle);
                this.secondHandle = undefined;
            }
            this.removeElement(this.rangeBar);
            this.rangeBar = undefined;
        }
        if (this.tooltip.isVisible && !sf.base.isNullOrUndefined(this.tooltipObj)) {
            this.tooltipObj.destroy();
            this.tooltipElement = undefined;
            this.tooltipCollidedPosition = undefined;
        }
        if (this.limits.enabled) {
            if (type === 'MinRange' || type === 'Default') {
                if (!sf.base.isNullOrUndefined(this.limitBarFirst)) {
                    this.removeElement(this.limitBarFirst);
                    this.limitBarFirst = undefined;
                }
            }
            else {
                if (!sf.base.isNullOrUndefined(this.limitBarSecond)) {
                    this.removeElement(this.limitBarSecond);
                    this.limitBarSecond = undefined;
                }
            }
        }
        this.activeHandle = 1;
        this.getThemeInitialization();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        this.setHandler();
        this.setOrientClass();
        this.wireFirstHandleEvt(false);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(false);
        }
        this.setValue();
        if (this.tooltip.isVisible) {
            this.renderTooltip();
            this.wireMaterialTooltipEvent(false);
        }
        this.setBarColor();
        if ((!sf.base.isBlazor() && !this.isServerRendered) || args !== 'tooltip') {
            this.updateConfig();
        }
    };
    Slider.prototype.changeRtl = function () {
        if (!this.enableRtl && this.type === 'Range') {
            this.value = [this.handleVal2, this.handleVal1];
        }
        this.updateConfig();
        if (this.tooltip.isVisible) {
            this.tooltipObj.refresh(this.firstHandle);
        }
        if (this.showButtons) {
            var enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
            sf.base.attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            sf.base.attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    };
    Slider.prototype.changeOrientation = function () {
        this.changeSliderType(this.type, 'null');
    };
    Slider.prototype.updateConfig = function () {
        this.setEnableRTL();
        this.setValue();
        if (this.tooltip.isVisible) {
            if (!sf.base.isBlazor()) {
                this.refreshTooltip(this.tooltipTarget);
            }
        }
        if (this.ticks.placement !== 'None') {
            if (this.ul) {
                this.removeElement(this.ul);
                this.ul = undefined;
                this.renderScale();
            }
        }
        this.limitsPropertyChange();
    };
    Slider.prototype.limitsPropertyChange = function () {
        if (this.limits.enabled) {
            if (sf.base.isNullOrUndefined(this.limitBarFirst) && this.type !== 'Range') {
                this.createLimitBar();
            }
            if (sf.base.isNullOrUndefined(this.limitBarFirst) && sf.base.isNullOrUndefined(this.limitBarSecond) && this.type === 'Range') {
                this.createLimitBar();
            }
            this.setLimitBar();
            this.setValue();
        }
        else {
            if (!sf.base.isNullOrUndefined(this.limitBarFirst)) {
                sf.base.detach(this.limitBarFirst);
            }
            if (!sf.base.isNullOrUndefined(this.limitBarSecond)) {
                sf.base.detach(this.limitBarSecond);
            }
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Slider.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    Slider.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.unwireEvents();
        window.removeEventListener('resize', this.onresize);
        sf.base.removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        this.firstHandle.removeAttribute('aria-orientation');
        if (this.type === 'Range') {
            this.secondHandle.removeAttribute('aria-orientation');
        }
        if (!sf.base.isBlazor() && !this.isServerRendered) {
            this.sliderContainer.parentNode.insertBefore(this.element, this.sliderContainer);
            sf.base.detach(this.sliderContainer);
        }
        if (this.tooltip.isVisible) {
            this.tooltipObj.destroy();
        }
        if (sf.base.isBlazor() && this.isMaterialTooltip && !sf.base.isNullOrUndefined(this.materialHandle)) {
            this.materialHandle.remove();
        }
        if (!sf.base.isBlazor() && !this.isServerRendered) {
            this.element.innerHTML = '';
        }
    };
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    // tslint:disable-next-line
    Slider.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'value':
                    if (newProp && oldProp) {
                        var value = sf.base.isNullOrUndefined(newProp.value) ?
                            (this.type === 'Range' ? [this.min, this.max] : this.min) : newProp.value;
                        this.setProperties({ 'value': value }, true);
                        if (!sf.base.isNullOrUndefined(oldProp.value) && oldProp.value.toString() !== value.toString()) {
                            this.setValue();
                            if (!sf.base.isBlazor() || !this.isServerRendered) {
                                this.refreshTooltip(this.tooltipTarget);
                            }
                            if (this.type === 'Range') {
                                if (sf.base.isNullOrUndefined(newProp.value) || oldProp.value[1] === value[1]) {
                                    this.activeHandle = 1;
                                }
                                else {
                                    this.activeHandle = 2;
                                }
                            }
                        }
                    }
                    break;
                case 'min':
                case 'step':
                case 'max':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.setMinMaxValue();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'tooltip':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    if (!sf.base.isNullOrUndefined(newProp.tooltip) && !sf.base.isNullOrUndefined(oldProp.tooltip)) {
                        this.setTooltip(prop);
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'type':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    if (!sf.base.isNullOrUndefined(oldProp) && Object.keys(oldProp).length
                        && !sf.base.isNullOrUndefined(oldProp.type)) {
                        this.changeSliderType(oldProp.type, prop);
                        this.setZindex();
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'enableRtl':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                        this.isServerRendered = false;
                    }
                    if (oldProp.enableRtl !== newProp.enableRtl && this.orientation !== 'Vertical') {
                        this.rtl = oldProp.enableRtl;
                        this.changeRtl();
                    }
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'limits':
                    this.limitsPropertyChange();
                    break;
                case 'orientation':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.changeOrientation();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'ticks':
                    if (!sf.base.isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
                        if (!sf.base.isBlazor() || !this.isServerRendered) {
                            sf.base.detach(this.ul);
                        }
                        Array.prototype.forEach.call(this.sliderContainer.classList, function (className) {
                            if (className.match(/e-scale-/)) {
                                _this.sliderContainer.classList.remove(className);
                            }
                        });
                    }
                    if (this.ticks.placement !== 'None') {
                        this.renderScale();
                        this.setZindex();
                    }
                    break;
                case 'locale':
                    if (this.showButtons) {
                        this.buttonTitle();
                    }
                    break;
                case 'showButtons':
                    if (newProp.showButtons) {
                        this.setButtons();
                        this.reposition();
                        if (this.enabled && !this.readonly) {
                            this.wireButtonEvt(false);
                        }
                    }
                    else {
                        if (!sf.base.isBlazor() || !this.isServerRendered) {
                            if (this.firstBtn && this.secondBtn) {
                                this.sliderContainer.removeChild(this.firstBtn);
                                this.sliderContainer.removeChild(this.secondBtn);
                                this.sliderContainer.classList.remove(classNames.sliderButtonClass);
                                this.firstBtn = undefined;
                                this.secondBtn = undefined;
                                this.reposition();
                            }
                        }
                    }
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'enabled':
                    this.setEnabled();
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'readonly':
                    this.setReadOnly();
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        if (this.isMaterialTooltip) {
                            this.sliderContainer.classList.add(classNames.materialSlider);
                        }
                    }
                    break;
                case 'customValues':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.setValue();
                    this.reposition();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'colorRange':
                    if (sf.base.isBlazor() && this.isServerRendered) {
                        this.isServerRendered = false;
                    }
                    this.reposition();
                    if (sf.base.isBlazor() && !this.isServerRendered) {
                        this.isServerRendered = true;
                    }
                    break;
                case 'width':
                    this.setElementWidth(newProp.width);
                    this.setMinMaxValue();
                    if (this.limits) {
                        this.limitsPropertyChange();
                    }
                    break;
            }
        }
    };
    Slider.prototype.setReadOnly = function () {
        if (this.readonly) {
            this.unwireEvents();
            this.sliderContainer.classList.add(classNames.readonly);
        }
        else {
            this.wireEvents();
            this.sliderContainer.classList.remove(classNames.readonly);
        }
    };
    Slider.prototype.setMinMaxValue = function () {
        var _this = this;
        this.setValue();
        if (!sf.base.isBlazor()) {
            this.refreshTooltip(this.tooltipTarget);
        }
        if (!sf.base.isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
            if (this.ul) {
                sf.base.detach(this.ul);
                Array.prototype.forEach.call(this.sliderContainer.classList, function (className) {
                    if (className.match(/e-scale-/)) {
                        _this.sliderContainer.classList.remove(className);
                    }
                });
            }
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
            this.setZindex();
        }
    };
    Slider.prototype.setZindex = function () {
        this.zIndex = 6;
        if (!sf.base.isNullOrUndefined(this.ticks) && this.ticks.placement !== 'None') {
            this.ul.style.zIndex = (this.zIndex + -7) + '';
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!this.isMaterial && !sf.base.isNullOrUndefined(this.ticks) && this.ticks.placement === 'Both') {
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
        if (this.type === 'Range') {
            this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
        }
    };
    Slider.prototype.setTooltip = function (args) {
        this.changeSliderType(this.type, args);
    };
    Slider.prototype.setBarColor = function () {
        var trackPosition;
        var trackClassName;
        var child = this.sliderTrack.lastElementChild;
        while (child) {
            this.sliderTrack.removeChild(child);
            child = this.sliderTrack.lastElementChild;
        }
        for (var i = 0; i < this.colorRange.length; i++) {
            if (!sf.base.isNullOrUndefined(this.colorRange[i].start) && !sf.base.isNullOrUndefined(this.colorRange[i].end)) {
                if (this.colorRange[i].end > this.colorRange[i].start) {
                    if (this.colorRange[i].start < this.min) {
                        this.colorRange[i].start = this.min;
                    }
                    if (this.colorRange[i].end > this.max) {
                        this.colorRange[i].end = this.max;
                    }
                    var startingPosition = this.checkHandlePosition(this.colorRange[i].start);
                    var endPosition = this.checkHandlePosition(this.colorRange[i].end);
                    var trackContainer = this.createElement('div');
                    trackContainer.style.backgroundColor = this.colorRange[i].color;
                    trackContainer.style.border = '1px solid ' + this.colorRange[i].color;
                    if (this.orientation === 'Horizontal') {
                        trackClassName = classNames.sliderHorizantalColor;
                        if (this.enableRtl) {
                            if (sf.base.isNullOrUndefined(this.customValues)) {
                                trackPosition = this.checkHandlePosition(this.max) - this.checkHandlePosition(this.colorRange[i].end);
                            }
                            else {
                                trackPosition = this.checkHandlePosition(this.customValues.length - this.colorRange[i].end - 1);
                            }
                        }
                        else {
                            trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        }
                        trackContainer.style.width = endPosition - startingPosition + 'px';
                        trackContainer.style.left = trackPosition + 'px';
                    }
                    else {
                        trackClassName = classNames.sliderVerticalColor;
                        trackPosition = this.checkHandlePosition(this.colorRange[i].start);
                        trackContainer.style.height = endPosition - startingPosition + 'px';
                        trackContainer.style.bottom = trackPosition + 'px';
                    }
                    trackContainer.classList.add(trackClassName);
                    this.sliderTrack.appendChild(trackContainer);
                }
            }
        }
    };
    /**
     * Gets the component name
     * @private
     */
    Slider.prototype.getModuleName = function () {
        return 'slider';
    };
    __decorate([
        sf.base.Property(null)
    ], Slider.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], Slider.prototype, "customValues", void 0);
    __decorate([
        sf.base.Property(1)
    ], Slider.prototype, "step", void 0);
    __decorate([
        sf.base.Property(null)
    ], Slider.prototype, "width", void 0);
    __decorate([
        sf.base.Property(0)
    ], Slider.prototype, "min", void 0);
    __decorate([
        sf.base.Property(100)
    ], Slider.prototype, "max", void 0);
    __decorate([
        sf.base.Property(false)
    ], Slider.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property('Default')
    ], Slider.prototype, "type", void 0);
    __decorate([
        sf.base.Collection([{}], ColorRangeData)
    ], Slider.prototype, "colorRange", void 0);
    __decorate([
        sf.base.Complex({}, TicksData)
    ], Slider.prototype, "ticks", void 0);
    __decorate([
        sf.base.Complex({}, LimitData)
    ], Slider.prototype, "limits", void 0);
    __decorate([
        sf.base.Property(true)
    ], Slider.prototype, "enabled", void 0);
    __decorate([
        sf.base.Complex({}, TooltipData)
    ], Slider.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Property(false)
    ], Slider.prototype, "showButtons", void 0);
    __decorate([
        sf.base.Property(true)
    ], Slider.prototype, "enableAnimation", void 0);
    __decorate([
        sf.base.Property('Horizontal')
    ], Slider.prototype, "orientation", void 0);
    __decorate([
        sf.base.Property('')
    ], Slider.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], Slider.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "changed", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "renderingTicks", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "renderedTicks", void 0);
    __decorate([
        sf.base.Event()
    ], Slider.prototype, "tooltipChange", void 0);
    Slider = __decorate([
        sf.base.NotifyPropertyChanges
    ], Slider);
    return Slider;
}(sf.base.Component));

/**
 * Slider modules
 */

exports.TicksData = TicksData;
exports.ColorRangeData = ColorRangeData;
exports.LimitData = LimitData;
exports.TooltipData = TooltipData;
exports.Slider = Slider;

return exports;

});

    sf.inputs = sf.base.extend({}, sf.inputs, sfslider({}));