window.sf = window.sf || {};
var sfswitch = (function (exports) {
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
var DISABLED = 'e-switch-disabled';
var RIPPLE = 'e-ripple-container';
var RIPPLE_CHECK = 'e-ripple-check';
var RTL = 'e-rtl';
var WRAPPER = 'e-switch-wrapper';
var ACTIVE = 'e-switch-active';
/**
 * The Switch is a graphical user interface element that allows you to toggle between checked and unchecked states.
 * ```html
 * <input type="checkbox" id="switch"/>
 * <script>
 * var switchObj = new Switch({});
 * switchObj.appendTo("#switch");
 * </script>
 * ```
 */
var Switch = /** @class */ (function (_super) {
    __extends(Switch, _super);
    /**
     * Constructor for creating the widget.
     * @private
     */
    function Switch(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isFocused = false;
        _this.isDrag = false;
        return _this;
    }
    Switch.prototype.changeState = function (state) {
        var ariaState;
        var rippleSpan;
        var wrapper = this.getWrapper();
        var bar = wrapper.querySelector('.e-switch-inner');
        var handle = wrapper.querySelector('.e-switch-handle');
        if (sf.base.isRippleEnabled) {
            rippleSpan = wrapper.getElementsByClassName(RIPPLE)[0];
        }
        if (state) {
            sf.base.addClass([bar, handle], ACTIVE);
            ariaState = 'true';
            this.element.checked = true;
            this.checked = true;
            if (rippleSpan) {
                sf.base.addClass([rippleSpan], [RIPPLE_CHECK]);
            }
        }
        else {
            sf.base.removeClass([bar, handle], ACTIVE);
            ariaState = 'false';
            this.element.checked = false;
            this.checked = false;
            if (rippleSpan) {
                sf.base.removeClass([rippleSpan], [RIPPLE_CHECK]);
            }
        }
        wrapper.setAttribute('aria-checked', ariaState);
    };
    Switch.prototype.clickHandler = function (evt) {
        this.isDrag = false;
        this.focusOutHandler();
        this.changeState(!this.checked);
        this.element.focus();
        var changeEventArgs = { checked: this.element.checked, event: evt };
        this.trigger('change', changeEventArgs);
    };
    /**
     * Destroys the Switch widget.
     * @returns void
     */
    Switch.prototype.destroy = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
        else {
            _super.prototype.destroy.call(this);
            if (!this.disabled) {
                this.unWireEvents();
            }
            sf.buttons.destroy(this, this.getWrapper(), this.tagName);
        }
    };
    Switch.prototype.focusHandler = function () {
        this.isFocused = true;
    };
    Switch.prototype.focusOutHandler = function () {
        this.getWrapper().classList.remove('e-focus');
    };
    /**
     * Gets the module name.
     * @private
     */
    Switch.prototype.getModuleName = function () {
        return 'switch';
    };
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    Switch.prototype.getPersistData = function () {
        return this.addOnPersist(['checked']);
    };
    Switch.prototype.getWrapper = function () {
        return this.element.parentElement;
    };
    Switch.prototype.initialize = function () {
        if (sf.base.isNullOrUndefined(this.initialSwitchCheckedValue)) {
            this.initialSwitchCheckedValue = this.checked;
        }
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.changeState(true);
        }
        if (this.disabled) {
            this.setDisabled();
        }
        if (this.onLabel || this.offLabel) {
            this.setLabel(this.onLabel, this.offLabel);
        }
    };
    Switch.prototype.initWrapper = function () {
        var wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER, attrs: { 'role': 'switch', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        var switchInner = this.createElement('span', { className: 'e-switch-inner' });
        var onLabel = this.createElement('span', { className: 'e-switch-on' });
        var offLabel = this.createElement('span', { className: 'e-switch-off' });
        var handle = this.createElement('span', { className: 'e-switch-handle' });
        wrapper.appendChild(this.element);
        sf.buttons.setHiddenInput(this, wrapper);
        switchInner.appendChild(onLabel);
        switchInner.appendChild(offLabel);
        wrapper.appendChild(switchInner);
        wrapper.appendChild(handle);
        if (sf.base.isRippleEnabled) {
            var rippleSpan = this.createElement('span', { className: RIPPLE });
            handle.appendChild(rippleSpan);
            sf.base.rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            sf.base.addClass([wrapper], this.cssClass.split(' '));
        }
    };
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    Switch.prototype.onPropertyChanged = function (newProp, oldProp) {
        var wrapper = this.getWrapper();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'checked':
                    this.changeState(newProp.checked);
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        wrapper.classList.remove(DISABLED);
                        wrapper.setAttribute('aria-disabled', 'false');
                        this.wireEvents();
                    }
                    break;
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'onLabel':
                case 'offLabel':
                    this.setLabel(newProp.onLabel, newProp.offLabel);
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrapper.classList.add(RTL);
                    }
                    else {
                        wrapper.classList.remove(RTL);
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([wrapper], newProp.cssClass.split(' '));
                    }
                    break;
            }
        }
    };
    /**
     * Initialize Angular, React and Unique ID support.
     * @private
     */
    Switch.prototype.preRender = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            return;
        }
        var element = this.element;
        this.formElement = sf.base.closest(this.element, 'form');
        this.tagName = this.element.tagName;
        sf.buttons.preRender(this, 'EJS-SWITCH', WRAPPER, element, this.getModuleName());
    };
    /**
     * Initialize control rendering.
     * @private
     */
    Switch.prototype.render = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            if (sf.base.isRippleEnabled) {
                sf.base.rippleEffect(this.element.parentElement, { duration: 400, isCenterRipple: true });
            }
        }
        else {
            this.initWrapper();
            this.initialize();
        }
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    };
    Switch.prototype.rippleHandler = function (e) {
        var rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        sf.buttons.rippleMouseHandler(e, rippleSpan);
        if (e.type === 'mousedown' && e.currentTarget.classList.contains('e-switch-wrapper') && e.which === 1) {
            this.isDrag = true;
            this.isFocused = false;
        }
    };
    Switch.prototype.rippleTouchHandler = function (eventType) {
        var rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            var event_1 = document.createEvent('MouseEvents');
            event_1.initEvent(eventType, false, true);
            rippleSpan.dispatchEvent(event_1);
        }
    };
    Switch.prototype.setDisabled = function () {
        var wrapper = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    };
    Switch.prototype.setLabel = function (onText, offText) {
        var wrapper = this.getWrapper();
        if (onText) {
            wrapper.querySelector('.e-switch-on').textContent = onText;
        }
        if (offText) {
            wrapper.querySelector('.e-switch-off').textContent = offText;
        }
    };
    Switch.prototype.switchFocusHandler = function () {
        if (this.isFocused) {
            this.getWrapper().classList.add('e-focus');
        }
    };
    Switch.prototype.switchMouseUp = function (e) {
        var target = e.target;
        var rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        if (e.type === 'touchstart') {
            this.isDrag = true;
            this.rippleTouchHandler('mousedown');
        }
        if (this.isDrag) {
            if ((e.type === 'mouseup' && target.className.indexOf('e-switch') < 0) || e.type === 'touchend') {
                this.clickHandler(e);
                this.rippleTouchHandler('mouseup');
                e.preventDefault();
            }
        }
    };
    Switch.prototype.formResetHandler = function () {
        this.checked = this.initialSwitchCheckedValue;
        this.element.checked = this.initialSwitchCheckedValue;
    };
    /**
     * Toggle the Switch component state into checked/unchecked.
     * @returns void
     */
    Switch.prototype.toggle = function () {
        this.clickHandler();
    };
    Switch.prototype.wireEvents = function () {
        var wrapper = this.getWrapper();
        var handle = wrapper.querySelector('.e-switch-handle');
        this.delegateMouseUpHandler = this.switchMouseUp.bind(this);
        this.delegateKeyUpHandler = this.switchFocusHandler.bind(this);
        sf.base.EventHandler.add(wrapper, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'focus', this.focusHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        sf.base.EventHandler.add(this.element, 'mouseup', this.delegateMouseUpHandler, this);
        sf.base.EventHandler.add(this.element, 'keyup', this.delegateKeyUpHandler, this);
        sf.base.EventHandler.add(wrapper, 'mousedown mouseup', this.rippleHandler, this);
        sf.base.EventHandler.add(wrapper, 'touchstart touchmove touchend', this.switchMouseUp, this);
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
    };
    Switch.prototype.unWireEvents = function () {
        var wrapper = this.getWrapper();
        var handle = wrapper.querySelector('.e-switch-handle');
        sf.base.EventHandler.remove(wrapper, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'focus', this.focusHandler);
        sf.base.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        sf.base.EventHandler.remove(this.element, 'mouseup', this.delegateMouseUpHandler);
        sf.base.EventHandler.remove(this.element, 'keyup', this.delegateKeyUpHandler);
        sf.base.EventHandler.remove(wrapper, 'mousedown mouseup', this.rippleHandler);
        sf.base.EventHandler.remove(wrapper, 'touchstart touchmove touchend', this.switchMouseUp);
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    };
    /**
     * Click the switch element
     * its native method
     * @public
     */
    Switch.prototype.click = function () {
        this.element.click();
    };
    /**
     * Sets the focus to Switch
     * its native method
     * @public
     */
    Switch.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate([
        sf.base.Event()
    ], Switch.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], Switch.prototype, "created", void 0);
    __decorate([
        sf.base.Property(false)
    ], Switch.prototype, "checked", void 0);
    __decorate([
        sf.base.Property('')
    ], Switch.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], Switch.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property('')
    ], Switch.prototype, "name", void 0);
    __decorate([
        sf.base.Property('')
    ], Switch.prototype, "onLabel", void 0);
    __decorate([
        sf.base.Property('')
    ], Switch.prototype, "offLabel", void 0);
    __decorate([
        sf.base.Property('')
    ], Switch.prototype, "value", void 0);
    Switch = __decorate([
        sf.base.NotifyPropertyChanges
    ], Switch);
    return Switch;
}(sf.base.Component));

/**
 * Switch modules
 */

exports.Switch = Switch;

return exports;

});
sfBlazor.modules["switch"] = "buttons.Switch";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.switch, () => {
    sf.buttons = sf.base.extend({}, sf.buttons, sfswitch({}));
});