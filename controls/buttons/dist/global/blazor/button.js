window.sf = window.sf || {};
var sfbutton = (function (exports) {
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
var buttonObserver = new sf.base.Observer();
var cssClassName = {
    RTL: 'e-rtl',
    BUTTON: 'e-btn',
    PRIMARY: 'e-primary',
    ICONBTN: 'e-icon-btn'
};
/**
 * The Button is a graphical user interface element that triggers an event on its click action. It can contain a text, an image, or both.
 * ```html
 * <button id="button">Button</button>
 * ```
 * ```typescript
 * <script>
 * var btnObj = new Button();
 * btnObj.appendTo("#button");
 * </script>
 * ```
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    /**
     * Constructor for creating the widget
     * @param  {ButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    function Button(options, element) {
        return _super.call(this, options, element) || this;
    }
    Button.prototype.preRender = function () {
        // pre render code snippets
    };
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    Button.prototype.render = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.wireEvents();
            }
            buttonObserver.notify('component-rendered', { id: this.element.id, instance: this });
        }
        else {
            this.initialize();
        }
        this.removeRippleEffect = sf.base.rippleEffect(this.element, { selector: '.' + cssClassName.BUTTON });
        this.renderComplete();
    };
    Button.prototype.initialize = function () {
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' '));
        }
        if (this.isPrimary) {
            this.element.classList.add(cssClassName.PRIMARY);
        }
        if (!sf.base.isBlazor() || (sf.base.isBlazor() && this.getModuleName() !== 'progress-btn')) {
            if (this.content) {
                var tempContent = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(this.content) : this.content;
                this.element.innerHTML = tempContent;
            }
            this.setIconCss();
        }
        if (this.enableRtl) {
            this.element.classList.add(cssClassName.RTL);
        }
        if (this.disabled) {
            this.controlStatus(this.disabled);
        }
        else {
            this.wireEvents();
        }
    };
    Button.prototype.controlStatus = function (disabled) {
        this.element.disabled = disabled;
    };
    Button.prototype.setIconCss = function () {
        if (this.iconCss) {
            var span = this.createElement('span', { className: 'e-btn-icon ' + this.iconCss });
            if (!this.element.textContent.trim()) {
                this.element.classList.add(cssClassName.ICONBTN);
            }
            else {
                span.classList.add('e-icon-' + this.iconPosition.toLowerCase());
                if (this.iconPosition === 'Top' || this.iconPosition === 'Bottom') {
                    this.element.classList.add('e-' + this.iconPosition.toLowerCase() + '-icon-btn');
                }
            }
            var node = this.element.childNodes[0];
            if (node && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
                this.element.insertBefore(span, node);
            }
            else {
                this.element.appendChild(span);
            }
        }
    };
    Button.prototype.wireEvents = function () {
        if (this.isToggle) {
            sf.base.EventHandler.add(this.element, 'click', this.btnClickHandler, this);
        }
    };
    Button.prototype.unWireEvents = function () {
        if (this.isToggle) {
            sf.base.EventHandler.remove(this.element, 'click', this.btnClickHandler);
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
    /**
     * Destroys the widget.
     * @returns void
     */
    Button.prototype.destroy = function () {
        if (!(sf.base.isBlazor() && this.isServerRendered)) {
            var span = void 0;
            var classList = [cssClassName.PRIMARY, cssClassName.RTL, cssClassName.ICONBTN, 'e-success', 'e-info', 'e-danger',
                'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active', 'e-round',
                'e-top-icon-btn', 'e-bottom-icon-btn'];
            if (this.cssClass) {
                classList = classList.concat(this.cssClass.split(' '));
            }
            _super.prototype.destroy.call(this);
            sf.base.removeClass([this.element], classList);
            if (!this.element.getAttribute('class')) {
                this.element.removeAttribute('class');
            }
            if (this.disabled) {
                this.element.removeAttribute('disabled');
            }
            if (this.content) {
                this.element.innerHTML = this.element.innerHTML.replace(this.content, '');
            }
            span = this.element.querySelector('span.e-btn-icon');
            if (span) {
                sf.base.detach(span);
            }
        }
        this.unWireEvents();
        if (sf.base.isRippleEnabled) {
            this.removeRippleEffect();
        }
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    Button.prototype.getModuleName = function () {
        return 'btn';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @private
     */
    Button.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Dynamically injects the required modules to the component.
     * @private
     */
    Button.Inject = function () {
        // Inject code snippets
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {ButtonModel} newProp
     * @param  {ButtonModel} oldProp
     * @returns void
     * @private
     */
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
                    this.controlStatus(newProp.disabled);
                    break;
                case 'iconCss':
                    var span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        if (newProp.iconCss) {
                            span.className = 'e-btn-icon ' + newProp.iconCss;
                            if (this.element.textContent.trim()) {
                                if (this.iconPosition === 'Left') {
                                    span.classList.add('e-icon-left');
                                }
                                else {
                                    span.classList.add('e-icon-right');
                                }
                            }
                        }
                        else {
                            sf.base.detach(span);
                        }
                    }
                    else {
                        this.setIconCss();
                    }
                    break;
                case 'iconPosition':
                    sf.base.removeClass([this.element], ['e-top-icon-btn', 'e-bottom-icon-btn']);
                    span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        sf.base.detach(span);
                    }
                    this.setIconCss();
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([this.element], newProp.cssClass.split(' '));
                    }
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
                    var node = sf.buttons.getTextNode(this.element);
                    if (!node) {
                        this.element.classList.remove(cssClassName.ICONBTN);
                    }
                    if (!sf.base.isBlazor() || (sf.base.isBlazor() && !this.isServerRendered && this.getModuleName() !== 'progress-btn')) {
                        if (this.enableHtmlSanitizer) {
                            newProp.content = sf.base.SanitizeHtmlHelper.sanitize(newProp.content);
                        }
                        this.element.innerHTML = newProp.content;
                        this.setIconCss();
                    }
                    break;
                case 'isToggle':
                    if (newProp.isToggle) {
                        sf.base.EventHandler.add(this.element, 'click', this.btnClickHandler, this);
                    }
                    else {
                        sf.base.EventHandler.remove(this.element, 'click', this.btnClickHandler);
                        sf.base.removeClass([this.element], ['e-active']);
                    }
                    break;
            }
        }
    };
    /**
     * Click the button element
     * its native method
     * @public
     */
    Button.prototype.click = function () {
        this.element.click();
    };
    /**
     * Sets the focus to Button
     * its native method
     * @public
     */
    Button.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate([
        sf.base.Property('Left')
    ], Button.prototype, "iconPosition", void 0);
    __decorate([
        sf.base.Property('')
    ], Button.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property(false)
    ], Button.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], Button.prototype, "isPrimary", void 0);
    __decorate([
        sf.base.Property('')
    ], Button.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property('')
    ], Button.prototype, "content", void 0);
    __decorate([
        sf.base.Property(false)
    ], Button.prototype, "isToggle", void 0);
    __decorate([
        sf.base.Property()
    ], Button.prototype, "locale", void 0);
    __decorate([
        sf.base.Property(false)
    ], Button.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Event()
    ], Button.prototype, "created", void 0);
    Button = __decorate([
        sf.base.NotifyPropertyChanges
    ], Button);
    return Button;
}(sf.base.Component));

/**
 * Button modules
 */

exports.buttonObserver = buttonObserver;
exports.Button = Button;

return exports;

});
sfBlazor.modules["button"] = "buttons.Button";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.button, () => {
    sf.buttons = sf.base.extend({}, sf.buttons, sfbutton({}));
});