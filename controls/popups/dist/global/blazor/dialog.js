window.sf = window.sf || {};
var sfdialog = (function (exports) {
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
var ButtonProps = /** @class */ (function (_super) {
    __extends(ButtonProps, _super);
    function ButtonProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property()
    ], ButtonProps.prototype, "buttonModel", void 0);
    __decorate([
        sf.base.Property('Button')
    ], ButtonProps.prototype, "type", void 0);
    __decorate([
        sf.base.Event()
    ], ButtonProps.prototype, "click", void 0);
    return ButtonProps;
}(sf.base.ChildProperty));
/**
 * Configures the animation properties for both open and close the dialog.
 */
var AnimationSettings = /** @class */ (function (_super) {
    __extends(AnimationSettings, _super);
    function AnimationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('Fade')
    ], AnimationSettings.prototype, "effect", void 0);
    __decorate([
        sf.base.Property(400)
    ], AnimationSettings.prototype, "duration", void 0);
    __decorate([
        sf.base.Property(0)
    ], AnimationSettings.prototype, "delay", void 0);
    return AnimationSettings;
}(sf.base.ChildProperty));
var ROOT = 'e-dialog';
var RTL = 'e-rtl';
var DLG_HEADER_CONTENT = 'e-dlg-header-content';
var DLG_HEADER = 'e-dlg-header';
var DLG_FOOTER_CONTENT = 'e-footer-content';
var MODAL_DLG = 'e-dlg-modal';
var DLG_CONTENT = 'e-dlg-content';
var DLG_CLOSE_ICON = 'e-icon-dlg-close';
var DLG_OVERLAY = 'e-dlg-overlay';
var DLG_TARGET = 'e-dlg-target';
var DLG_CONTAINER = 'e-dlg-container';
var SCROLL_DISABLED = 'e-scroll-disabled';
var DLG_PRIMARY_BUTTON = 'e-primary';
var ICON = 'e-icons';
var POPUP_ROOT = 'e-popup';
var DEVICE = 'e-device';
var FULLSCREEN = 'e-dlg-fullscreen';
var DLG_CLOSE_ICON_BTN = 'e-dlg-closeicon-btn';
var DLG_HIDE = 'e-popup-close';
var DLG_SHOW = 'e-popup-open';
var DLG_UTIL_DEFAULT_TITLE = 'Information';
var DLG_UTIL_ROOT = 'e-scroll-disabled';
var DLG_UTIL_ALERT = 'e-alert-dialog';
var DLG_UTIL_CONFIRM = 'e-confirm-dialog';
var DLG_RESIZABLE = 'e-dlg-resizable';
var DLG_RESTRICT_LEFT_VALUE = 'e-restrict-left';
var DLG_RESTRICT_WIDTH_VALUE = 'e-resize-viewport';
var DLG_REF_ELEMENT = 'e-dlg-ref-element';
/**
 * Represents the dialog component that displays the information and get input from the user.
 * Two types of dialog components are `Modal and Modeless (non-modal)` depending on its interaction with parent application.
 * ```html
 * <div id="dialog"></div>
 * ```
 * ```typescript
 * <script>
 *   var dialogObj = new Dialog({ header: 'Dialog' });
 *   dialogObj.appendTo("#dialog");
 * </script>
 * ```
 */
var Dialog = /** @class */ (function (_super) {
    __extends(Dialog, _super);
    /**
     * Constructor for creating the widget
     * @hidden
     */
    function Dialog(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize the control rendering
     * @private
     */
    Dialog.prototype.render = function () {
        this.initialize();
        this.initRender();
        this.wireEvents();
        if (this.width === '100%') {
            this.element.style.width = '';
        }
        if (this.minHeight !== '') {
            this.element.style.minHeight = this.minHeight.toString();
        }
        if (this.enableResize) {
            this.setResize();
            if (this.animationSettings.effect === 'None') {
                this.getMinHeight();
            }
        }
        this.renderComplete();
    };
    /**
     * Initialize the event handler
     * @private
     */
    Dialog.prototype.preRender = function () {
        var _this = this;
        this.headerContent = null;
        this.allowMaxHeight = true;
        this.preventVisibility = true;
        this.clonedEle = this.element.cloneNode(true);
        this.closeIconClickEventHandler = function (event) {
            _this.hide(event);
        };
        this.dlgOverlayClickEventHandler = function (event) {
            _this.trigger('overlayClick', event);
            _this.focusContent();
        };
        var localeText = { close: 'Close' };
        this.l10n = new sf.base.L10n('dialog', localeText, this.locale);
        this.checkPositionData();
        if (sf.base.isNullOrUndefined(this.target)) {
            var prevOnChange = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.target = document.body;
            this.isProtectedOnChange = prevOnChange;
        }
    };
    
    Dialog.prototype.isNumberValue = function (value) {
        var isNumber = /^[-+]?\d*\.?\d+$/.test(value);
        return isNumber;
    };
    Dialog.prototype.checkPositionData = function () {
        if (!sf.base.isNullOrUndefined(this.position)) {
            if (!sf.base.isNullOrUndefined(this.position.X) && (typeof (this.position.X) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.X);
                if (isNumber) {
                    var prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.X = parseFloat(this.position.X);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
            if (!sf.base.isNullOrUndefined(this.position.Y) && (typeof (this.position.Y) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.Y);
                if (isNumber) {
                    var prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.Y = parseFloat(this.position.Y);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
        }
    };
    Dialog.prototype.getEle = function (list, selector) {
        var element = undefined;
        for (var i = 0; i < list.length; i++) {
            if (list[i].classList.contains(selector)) {
                element = list[i];
                break;
            }
        }
        return element;
    };
    /* istanbul ignore next */
    Dialog.prototype.getMinHeight = function () {
        var computedHeaderHeight = '0px';
        var computedFooterHeight = '0px';
        if (!sf.base.isNullOrUndefined(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        var footerEle = this.getEle(this.element.children, DLG_FOOTER_CONTENT);
        if (!sf.base.isNullOrUndefined(footerEle)) {
            computedFooterHeight = getComputedStyle(footerEle).height;
        }
        var headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        var footerHeight = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        sf.popups.setMinHeight(headerHeight + 30 + footerHeight);
        return (headerHeight + 30 + footerHeight);
    };
    Dialog.prototype.onResizeStart = function (args, dialogObj) {
        dialogObj.trigger('resizeStart', args);
        return args.cancel;
    };
    Dialog.prototype.onResizing = function (args, dialogObj) {
        dialogObj.trigger('resizing', args);
    };
    Dialog.prototype.onResizeComplete = function (args, dialogObj) {
        dialogObj.trigger('resizeStop', args);
    };
    Dialog.prototype.setResize = function () {
        if (this.enableResize) {
            if (this.isBlazorServerRender() && !sf.base.isNullOrUndefined(this.element.querySelector('.e-icons.e-resize-handle'))) {
                return;
            }
            this.element.classList.add(DLG_RESIZABLE);
            var computedHeight = getComputedStyle(this.element).minHeight;
            var computedWidth = getComputedStyle(this.element).minWidth;
            var direction = this.enableRtl ? 'south-west' : 'south-east';
            if (this.isModal && this.enableRtl) {
                this.element.classList.add(DLG_RESTRICT_LEFT_VALUE);
            }
            else if (this.isModal && this.target === document.body) {
                this.element.classList.add(DLG_RESTRICT_WIDTH_VALUE);
            }
            sf.popups.createResize({
                element: this.element,
                direction: direction,
                minHeight: parseInt(computedHeight.slice(0, computedWidth.indexOf('p')), 10),
                maxHeight: this.targetEle.clientHeight,
                minWidth: parseInt(computedWidth.slice(0, computedWidth.indexOf('p')), 10),
                maxWidth: this.targetEle.clientWidth,
                boundary: this.target === document.body ? null : this.targetEle,
                resizeBegin: this.onResizeStart.bind(this),
                resizeComplete: this.onResizeComplete.bind(this),
                resizing: this.onResizing.bind(this),
                proxy: this
            });
            this.wireWindowResizeEvent();
        }
        else {
            sf.popups.removeResize();
            this.unWireWindowResizeEvent();
            if (this.isModal) {
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            }
            else {
                this.element.classList.remove(DLG_RESTRICT_WIDTH_VALUE);
            }
            this.element.classList.remove(DLG_RESIZABLE);
        }
    };
    /* istanbul ignore next */
    Dialog.prototype.keyDown = function (event) {
        var _this = this;
        if (event.keyCode === 9) {
            if (this.isModal) {
                var buttonObj = void 0;
                if (!sf.base.isNullOrUndefined(this.btnObj)) {
                    buttonObj = this.btnObj[this.btnObj.length - 1];
                }
                if ((sf.base.isNullOrUndefined(this.btnObj)) && (!sf.base.isNullOrUndefined(this.ftrTemplateContent))) {
                    var value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
                    var items = this.ftrTemplateContent.querySelectorAll(value);
                    buttonObj = { element: items[items.length - 1] };
                }
                if (!sf.base.isNullOrUndefined(buttonObj) && document.activeElement === buttonObj.element && !event.shiftKey) {
                    event.preventDefault();
                    this.focusableElements(this.element).focus();
                }
                if (document.activeElement === this.focusableElements(this.element) && event.shiftKey) {
                    event.preventDefault();
                    if (!sf.base.isNullOrUndefined(buttonObj)) {
                        buttonObj.element.focus();
                    }
                }
            }
        }
        var element = document.activeElement;
        var isTagName = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        var isContentEdit = false;
        if (!isTagName) {
            isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
        }
        if (event.keyCode === 27 && this.closeOnEscape) {
            this.hide(event);
        }
        if ((event.keyCode === 13 && !event.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
            isTagName && !sf.base.isNullOrUndefined(this.primaryButtonEle)) ||
            (event.keyCode === 13 && event.ctrlKey && (element.tagName.toLowerCase() === 'textarea' ||
                isContentEdit)) && !sf.base.isNullOrUndefined(this.primaryButtonEle)) {
            var buttonIndex_1;
            var firstPrimary = this.buttons.some(function (data, index) {
                buttonIndex_1 = index;
                var buttonModel = data.buttonModel;
                return !sf.base.isNullOrUndefined(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex_1].click) === 'function') {
                setTimeout(function () {
                    _this.buttons[buttonIndex_1].click.call(_this, event);
                });
            }
        }
    };
    /**
     * Initialize the control rendering
     * @private
     */
    Dialog.prototype.initialize = function () {
        if (!sf.base.isNullOrUndefined(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                document.querySelector(this.target) : this.target;
        }
        if (!this.isBlazorServerRender()) {
            sf.base.addClass([this.element], ROOT);
        }
        if (sf.base.Browser.isDevice) {
            sf.base.addClass([this.element], DEVICE);
        }
        if (!this.isBlazorServerRender()) {
            this.setCSSClass();
        }
        this.setMaxHeight();
    };
    /**
     * Initialize the rendering
     * @private
     */
    Dialog.prototype.initRender = function () {
        var _this = this;
        this.initialRender = true;
        if (!this.isBlazorServerRender()) {
            sf.base.attributes(this.element, { role: 'dialog' });
        }
        if (this.zIndex === 1000) {
            this.setzIndex(this.element, false);
            this.calculatezIndex = true;
        }
        else {
            this.calculatezIndex = false;
        }
        if (this.isBlazorServerRender() && sf.base.isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.element.getElementsByClassName('e-dlg-header-content')[0];
        }
        if (this.isBlazorServerRender() && sf.base.isNullOrUndefined(this.contentEle)) {
            this.contentEle = this.element.querySelector('#' + this.element.id + '_dialog-content');
        }
        if (!this.isBlazorServerRender()) {
            this.setTargetContent();
            if (this.header !== '' && !sf.base.isNullOrUndefined(this.header)) {
                this.setHeader();
            }
            if (this.showCloseIcon) {
                this.renderCloseIcon();
            }
            this.setContent();
            if (this.footerTemplate !== '' && !sf.base.isNullOrUndefined(this.footerTemplate)) {
                this.setFooterTemplate();
            }
            else if (!sf.base.isNullOrUndefined(this.buttons[0].buttonModel)) {
                this.setButton();
            }
        }
        if (this.isBlazorServerRender()) {
            if (!sf.base.isNullOrUndefined(this.buttons[0].buttonModel) && this.footerTemplate === '') {
                this.setButton();
            }
        }
        if (this.allowDragging && (!sf.base.isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        if (!this.isBlazorServerRender()) {
            sf.base.attributes(this.element, { 'aria-modal': (this.isModal ? 'true' : 'false') });
            if (this.isModal) {
                this.setIsModal();
            }
        }
        if (this.isBlazorServerRender() && sf.base.isNullOrUndefined(this.dlgContainer)) {
            this.dlgContainer = this.element.parentElement;
            for (var i = 0, childNodes = this.dlgContainer.children; i < childNodes.length; i++) {
                if (childNodes[i].classList.contains('e-dlg-overlay')) {
                    this.dlgOverlay = childNodes[i];
                }
            }
        }
        if (this.element.classList.contains(DLG_UTIL_ALERT) !== true && this.element.classList.contains(DLG_UTIL_CONFIRM) !== true
            && !sf.base.isNullOrUndefined(this.element.parentElement)) {
            var parentEle = this.isModal ? this.dlgContainer.parentElement : this.element.parentElement;
            this.refElement = this.createElement('div', { className: DLG_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, (this.isModal ? this.dlgContainer : this.element));
        }
        if (!sf.base.isNullOrUndefined(this.targetEle)) {
            this.isModal ? this.targetEle.appendChild(this.dlgContainer) : this.targetEle.appendChild(this.element);
        }
        this.popupObj = new sf.popups.Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.target,
            actionOnScroll: 'none',
            enableRtl: this.enableRtl,
            open: function (event) {
                var eventArgs = {
                    container: _this.isModal ? _this.dlgContainer : _this.element,
                    element: _this.element,
                    target: _this.target,
                    preventFocus: false
                };
                if (_this.enableResize) {
                    _this.resetResizeIcon();
                }
                _this.trigger('open', eventArgs, function (openEventArgs) {
                    if (!openEventArgs.preventFocus) {
                        _this.focusContent();
                    }
                });
            },
            close: function (event) {
                if (_this.isModal) {
                    sf.base.addClass([_this.dlgOverlay], 'e-fade');
                }
                _this.unBindEvent(_this.element);
                if (_this.isModal) {
                    _this.dlgContainer.style.display = 'none';
                }
                _this.trigger('close', _this.closeArgs);
                var activeEle = document.activeElement;
                if (!sf.base.isNullOrUndefined(activeEle) && !sf.base.isNullOrUndefined((activeEle).blur)) {
                    activeEle.blur();
                }
                if (!sf.base.isNullOrUndefined(_this.storeActiveElement) && !sf.base.isNullOrUndefined(_this.storeActiveElement.focus)) {
                    _this.storeActiveElement.focus();
                }
            }
        });
        this.positionChange();
        this.setEnableRTL();
        if (!this.isBlazorServerRender()) {
            sf.base.addClass([this.element], DLG_HIDE);
            if (this.isModal) {
                this.setOverlayZindex();
            }
        }
        if (this.visible) {
            this.show();
        }
        else {
            if (this.isModal) {
                this.dlgOverlay.style.display = 'none';
            }
        }
        this.initialRender = false;
    };
    Dialog.prototype.resetResizeIcon = function () {
        var dialogConHeight = this.getMinHeight();
        if (this.targetEle.offsetHeight < dialogConHeight) {
            var className = this.enableRtl ? 'e-south-west' : 'e-south-east';
            var resizeIcon = this.element.querySelector('.' + className);
            if (!sf.base.isNullOrUndefined(resizeIcon)) {
                resizeIcon.style.bottom = '-' + dialogConHeight.toString() + 'px';
            }
        }
    };
    Dialog.prototype.setOverlayZindex = function (zIndexValue) {
        var zIndex;
        if (sf.base.isNullOrUndefined(zIndexValue)) {
            zIndex = parseInt(this.element.style.zIndex, 10) ? parseInt(this.element.style.zIndex, 10) : this.zIndex;
        }
        else {
            zIndex = zIndexValue;
        }
        this.dlgOverlay.style.zIndex = (zIndex - 1).toString();
        this.dlgContainer.style.zIndex = zIndex.toString();
    };
    Dialog.prototype.positionChange = function () {
        if (this.isModal) {
            if (!isNaN(parseFloat(this.position.X)) && !isNaN(parseFloat(this.position.Y))) {
                this.setPopupPosition();
            }
            else if ((!isNaN(parseFloat(this.position.X)) && isNaN(parseFloat(this.position.Y)))
                || (isNaN(parseFloat(this.position.X)) && !isNaN(parseFloat(this.position.Y)))) {
                this.setPopupPosition();
            }
            else {
                this.element.style.top = '0px';
                this.element.style.left = '0px';
                this.dlgContainer.classList.add('e-dlg-' + this.position.X + '-' + this.position.Y);
            }
        }
        else {
            this.setPopupPosition();
        }
    };
    Dialog.prototype.setPopupPosition = function () {
        this.popupObj.setProperties({
            position: {
                X: this.position.X, Y: this.position.Y
            }
        });
    };
    Dialog.prototype.setAllowDragging = function () {
        var _this = this;
        var handleContent = '.' + DLG_HEADER_CONTENT;
        this.dragObj = new sf.base.Draggable(this.element, {
            clone: false,
            isDragScroll: true,
            abort: '.e-dlg-closeicon-btn',
            handle: handleContent,
            dragStart: function (event) {
                _this.trigger('dragStart', event, function (dragEventArgs) {
                    if (sf.base.isBlazor()) {
                        dragEventArgs.bindEvents(event.dragElement);
                    }
                });
            },
            dragStop: function (event) {
                if (_this.isModal) {
                    if (!sf.base.isNullOrUndefined(_this.position)) {
                        _this.dlgContainer.classList.remove('e-dlg-' + _this.position.X + '-' + _this.position.Y);
                    }
                    // Reset the dialog position after drag completion.
                    _this.element.style.position = 'relative';
                }
                _this.trigger('dragStop', event);
                _this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            },
            drag: function (event) {
                _this.trigger('drag', event);
            }
        });
        if (!sf.base.isNullOrUndefined(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    };
    Dialog.prototype.setButton = function () {
        if (!this.isBlazorServerRender()) {
            this.buttonContent = [];
            this.btnObj = [];
            for (var i = 0; i < this.buttons.length; i++) {
                var buttonType = !sf.base.isNullOrUndefined(this.buttons[i].type) ? this.buttons[i].type.toLowerCase() : 'button';
                var btn = this.createElement('button', { attrs: { type: buttonType } });
                this.buttonContent.push(btn.outerHTML);
            }
            this.setFooterTemplate();
        }
        var footerBtn;
        for (var i = 0, childNodes = this.element.children; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains(DLG_FOOTER_CONTENT)) {
                footerBtn = childNodes[i].querySelectorAll('button');
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            if (!this.isBlazorServerRender()) {
                this.btnObj[i] = new sf.buttons.Button(this.buttons[i].buttonModel);
            }
            if (this.isBlazorServerRender()) {
                this.ftrTemplateContent = this.element.querySelector('.' + DLG_FOOTER_CONTENT);
            }
            if (!sf.base.isNullOrUndefined(this.ftrTemplateContent) && typeof (this.buttons[i].click) === 'function' && footerBtn.length > 0) {
                sf.base.EventHandler.add(footerBtn[i], 'click', this.buttons[i].click, this);
            }
            if (!this.isBlazorServerRender() && !sf.base.isNullOrUndefined(this.ftrTemplateContent)) {
                this.btnObj[i].appendTo(this.ftrTemplateContent.children[i]);
                this.btnObj[i].element.classList.add('e-flat');
                this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
            }
        }
    };
    Dialog.prototype.setContent = function () {
        sf.base.attributes(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        this.contentEle = this.createElement('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        if (this.innerContentElement) {
            this.contentEle.appendChild(this.innerContentElement);
        }
        else if (!sf.base.isNullOrUndefined(this.content) && this.content !== '' || !this.initialRender) {
            if (typeof (this.content) === 'string' && !sf.base.isBlazor()) {
                this.contentEle.innerHTML = this.sanitizeHelper(this.content);
            }
            else if (this.content instanceof HTMLElement) {
                this.contentEle.appendChild(this.content);
            }
            else {
                this.setTemplate(this.content, this.contentEle, 'content');
            }
        }
        if (!sf.base.isNullOrUndefined(this.headerContent)) {
            this.element.insertBefore(this.contentEle, this.element.children[1]);
        }
        else {
            this.element.insertBefore(this.contentEle, this.element.children[0]);
        }
        if (this.height === 'auto') {
            if (!this.isBlazorServerRender() && sf.base.Browser.isIE && this.element.style.width === '' && !sf.base.isNullOrUndefined(this.width)) {
                this.element.style.width = sf.base.formatUnit(this.width);
            }
            this.setMaxHeight();
        }
    };
    Dialog.prototype.setTemplate = function (template, toElement, prop) {
        var templateFn;
        var templateProps;
        if (toElement.classList.contains(DLG_HEADER)) {
            templateProps = this.element.id + 'header';
        }
        else if (toElement.classList.contains(DLG_FOOTER_CONTENT)) {
            templateProps = this.element.id + 'footerTemplate';
        }
        else {
            templateProps = this.element.id + 'content';
        }
        var templateValue;
        if (!sf.base.isNullOrUndefined(template.outerHTML)) {
            toElement.appendChild(template);
        }
        else if ((typeof template !== 'string') || (sf.base.isBlazor() && !this.isStringTemplate)) {
            templateFn = sf.base.compile(template);
            templateValue = template;
        }
        else {
            toElement.innerHTML = this.sanitizeHelper(template);
        }
        var fromElements = [];
        if (!sf.base.isNullOrUndefined(templateFn)) {
            var isString = (sf.base.isBlazor() &&
                !this.isStringTemplate && (templateValue).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            for (var _i = 0, _a = templateFn({}, this, prop, templateProps, isString); _i < _a.length; _i++) {
                var item = _a[_i];
                fromElements.push(item);
            }
            sf.base.append([].slice.call(fromElements), toElement);
        }
    };
    /**
     * @hidden
     */
    Dialog.prototype.sanitizeHelper = function (value) {
        if (this.enableHtmlSanitizer) {
            var dialogItem = sf.base.SanitizeHtmlHelper.beforeSanitize();
            var beforeEvent = {
                cancel: false,
                helper: null
            };
            sf.base.extend(dialogItem, dialogItem, beforeEvent);
            this.trigger('beforeSanitizeHtml', dialogItem);
            if (dialogItem.cancel && !sf.base.isNullOrUndefined(dialogItem.helper)) {
                value = dialogItem.helper(value);
            }
            else if (!dialogItem.cancel) {
                value = sf.base.SanitizeHtmlHelper.serializeValue(dialogItem, value);
            }
        }
        return value;
    };
    Dialog.prototype.setMaxHeight = function () {
        if (!this.allowMaxHeight) {
            return;
        }
        var display = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!sf.base.isNullOrUndefined(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
        if (sf.base.Browser.isIE && this.height === 'auto' && !sf.base.isNullOrUndefined(this.contentEle)
            && this.element.offsetHeight < this.contentEle.offsetHeight) {
            this.element.style.height = 'inherit';
        }
    };
    Dialog.prototype.setEnableRTL = function () {
        if (!this.isBlazorServerRender()) {
            this.enableRtl ? sf.base.addClass([this.element], RTL) : sf.base.removeClass([this.element], RTL);
        }
        if (!sf.base.isNullOrUndefined(this.element.querySelector('.e-resize-handle'))) {
            sf.popups.removeResize();
            this.setResize();
        }
    };
    Dialog.prototype.setTargetContent = function () {
        var _this = this;
        if (sf.base.isNullOrUndefined(this.content) || this.content === '') {
            var isContent = this.element.innerHTML.replace(/\s|<(\/?|\!?)(!--!--)>/g, '') !== '';
            if (this.element.children.length > 0 || isContent) {
                this.innerContentElement = document.createDocumentFragment();
                [].slice.call(this.element.childNodes).forEach(function (el) {
                    if (el.nodeType !== 8) {
                        _this.innerContentElement.appendChild(el);
                    }
                });
            }
        }
    };
    Dialog.prototype.setHeader = function () {
        if (this.headerEle) {
            this.headerEle.innerHTML = '';
        }
        else {
            this.headerEle = this.createElement('div', { id: this.element.id + '_title', className: DLG_HEADER });
        }
        this.createHeaderContent();
        this.headerContent.appendChild(this.headerEle);
        this.setTemplate(this.header, this.headerEle, 'header');
        sf.base.attributes(this.element, { 'aria-labelledby': this.element.id + '_title' });
        this.element.insertBefore(this.headerContent, this.element.children[0]);
    };
    Dialog.prototype.setFooterTemplate = function () {
        if (this.ftrTemplateContent) {
            this.ftrTemplateContent.innerHTML = '';
        }
        else {
            this.ftrTemplateContent = this.createElement('div', {
                className: DLG_FOOTER_CONTENT
            });
        }
        if (this.footerTemplate !== '' && !sf.base.isNullOrUndefined(this.footerTemplate)) {
            this.setTemplate(this.footerTemplate, this.ftrTemplateContent, 'footerTemplate');
        }
        else {
            this.ftrTemplateContent.innerHTML = this.buttonContent.join('');
        }
        this.element.appendChild(this.ftrTemplateContent);
    };
    Dialog.prototype.createHeaderContent = function () {
        if (sf.base.isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.createElement('div', { id: this.element.id + '_dialog-header', className: DLG_HEADER_CONTENT });
        }
    };
    Dialog.prototype.renderCloseIcon = function () {
        this.closeIcon = this.createElement('button', { className: DLG_CLOSE_ICON_BTN, attrs: { type: 'button' } });
        this.closeIconBtnObj = new sf.buttons.Button({ cssClass: 'e-flat', iconCss: DLG_CLOSE_ICON + ' ' + ICON });
        this.closeIconTitle();
        if (!sf.base.isNullOrUndefined(this.headerContent)) {
            sf.base.prepend([this.closeIcon], this.headerContent);
        }
        else {
            this.createHeaderContent();
            sf.base.prepend([this.closeIcon], this.headerContent);
            this.element.insertBefore(this.headerContent, this.element.children[0]);
        }
        this.closeIconBtnObj.appendTo(this.closeIcon);
    };
    Dialog.prototype.closeIconTitle = function () {
        this.l10n.setLocale(this.locale);
        var closeIconTitle = this.l10n.getConstant('close');
        this.closeIcon.setAttribute('title', closeIconTitle);
        this.closeIcon.setAttribute('aria-label', closeIconTitle);
    };
    Dialog.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            sf.base.removeClass([this.element], oldCSSClass.split(' '));
        }
    };
    Dialog.prototype.setIsModal = function () {
        this.dlgContainer = this.createElement('div', { className: DLG_CONTAINER });
        this.element.classList.remove(DLG_SHOW);
        this.element.parentNode.insertBefore(this.dlgContainer, this.element);
        this.dlgContainer.appendChild(this.element);
        sf.base.addClass([this.element], MODAL_DLG);
        this.dlgOverlay = this.createElement('div', { className: DLG_OVERLAY });
        this.dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
        this.dlgContainer.appendChild(this.dlgOverlay);
    };
    Dialog.prototype.getValidFocusNode = function (items) {
        var node;
        for (var u = 0; u < items.length; u++) {
            node = items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !node.disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
            else {
                node = null;
            }
        }
        return node;
    };
    Dialog.prototype.focusableElements = function (content) {
        if (!sf.base.isNullOrUndefined(content)) {
            var value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            var items = content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    };
    Dialog.prototype.getAutoFocusNode = function (container) {
        var node = container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        var value = '[autofocus]';
        var items = container.querySelectorAll(value);
        var validNode = this.getValidFocusNode(items);
        if (sf.base.isBlazor()) {
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
        }
        if (!sf.base.isNullOrUndefined(validNode)) {
            node = validNode;
        }
        else {
            validNode = this.focusableElements(this.contentEle);
            if (!sf.base.isNullOrUndefined(validNode)) {
                return node = validNode;
            }
            else if (!sf.base.isNullOrUndefined(this.primaryButtonEle)) {
                return this.element.querySelector('.' + DLG_PRIMARY_BUTTON);
            }
        }
        return node;
    };
    Dialog.prototype.disableElement = function (element, t) {
        var elementMatch = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    /* istanbul ignore next */
                    return element;
                }
            }
        }
        return null;
    };
    Dialog.prototype.focusContent = function () {
        var element = this.getAutoFocusNode(this.element);
        var node = !sf.base.isNullOrUndefined(element) ? element : this.element;
        node.focus();
        this.bindEvent(this.element);
    };
    Dialog.prototype.bindEvent = function (element) {
        sf.base.EventHandler.add(element, 'keydown', this.keyDown, this);
    };
    Dialog.prototype.unBindEvent = function (element) {
        sf.base.EventHandler.remove(element, 'keydown', this.keyDown);
    };
    Dialog.prototype.updateSanitizeContent = function () {
        if (!this.isBlazorServerRender()) {
            this.contentEle.innerHTML = this.sanitizeHelper(this.content);
        }
    };
    Dialog.prototype.isBlazorServerRender = function () {
        return sf.base.isBlazor() && this.isServerRendered;
    };
    /**
     * Module required function
     * @private
     */
    Dialog.prototype.getModuleName = function () {
        return 'dialog';
    };
    /**
     * Called internally if any of the property value changed
     * @private
     */
    Dialog.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'content':
                    if (!sf.base.isNullOrUndefined(this.content) && this.content !== '') {
                        if (this.isBlazorServerRender()) {
                            this.contentEle = this.element.querySelector('.e-dlg-content');
                        }
                        if (!sf.base.isNullOrUndefined(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                            if (!this.isBlazorServerRender()) {
                                this.contentEle.innerHTML = '';
                            }
                            typeof (this.content) === 'string' ? (this.isBlazorServerRender()
                                && (this.contentEle.innerText === '')) ?
                                this.contentEle.insertAdjacentHTML('beforeend', this.sanitizeHelper(this.content)) :
                                this.updateSanitizeContent() :
                                this.contentEle.appendChild(this.content);
                            this.setMaxHeight();
                        }
                        else {
                            if (!this.isBlazorServerRender() ||
                                sf.base.isNullOrUndefined(this.element.querySelector('.e-dlg-content'))) {
                                this.setContent();
                            }
                        }
                    }
                    else if (!sf.base.isNullOrUndefined(this.contentEle)) {
                        sf.base.detach(this.contentEle);
                        this.contentEle = null;
                    }
                    break;
                case 'header':
                    if (this.header === '' || sf.base.isNullOrUndefined(this.header)) {
                        if (this.headerEle) {
                            sf.base.detach(this.headerEle);
                            this.headerEle = null;
                        }
                    }
                    else {
                        if (!this.isBlazorServerRender() ||
                            sf.base.isNullOrUndefined(this.element.querySelector('.e-dlg-header-content'))) {
                            this.setHeader();
                        }
                    }
                    break;
                case 'footerTemplate':
                    if (this.footerTemplate === '' || sf.base.isNullOrUndefined(this.footerTemplate)) {
                        if (!this.ftrTemplateContent) {
                            return;
                        }
                        sf.base.detach(this.ftrTemplateContent);
                        this.ftrTemplateContent = null;
                        this.buttons = [{}];
                    }
                    else {
                        if (!this.isBlazorServerRender() ||
                            sf.base.isNullOrUndefined(this.element.querySelector('.e-footer-content'))) {
                            this.setFooterTemplate();
                        }
                        this.buttons = [{}];
                    }
                    break;
                case 'showCloseIcon':
                    if (this.element.getElementsByClassName(DLG_CLOSE_ICON).length > 0) {
                        if (!this.showCloseIcon && (this.header === '' || sf.base.isNullOrUndefined(this.header))) {
                            sf.base.detach(this.headerContent);
                            this.headerContent = null;
                        }
                        else if (!this.showCloseIcon) {
                            sf.base.detach(this.closeIcon);
                        }
                        else {
                            if (this.isBlazorServerRender()) {
                                this.wireEvents();
                            }
                        }
                    }
                    else {
                        if (!this.isBlazorServerRender()) {
                            this.renderCloseIcon();
                        }
                        this.wireEvents();
                    }
                    break;
                case 'locale':
                    if (this.showCloseIcon) {
                        this.closeIconTitle();
                    }
                    break;
                case 'visible':
                    this.visible ? this.show() : this.hide();
                    break;
                case 'isModal':
                    this.updateIsModal();
                    break;
                case 'height':
                    sf.base.setStyleAttribute(this.element, { 'height': sf.base.formatUnit(newProp.height) });
                    break;
                case 'width':
                    sf.base.setStyleAttribute(this.element, { 'width': sf.base.formatUnit(newProp.width) });
                    break;
                case 'zIndex':
                    this.popupObj.zIndex = this.zIndex;
                    if (this.isModal) {
                        this.setOverlayZindex(this.zIndex);
                    }
                    if (this.element.style.zIndex !== this.zIndex.toString()) {
                        this.calculatezIndex = false;
                    }
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'buttons':
                    var buttonCount = this.buttons.length;
                    if (!sf.base.isNullOrUndefined(this.ftrTemplateContent) && !this.isBlazorServerRender()) {
                        sf.base.detach(this.ftrTemplateContent);
                        this.ftrTemplateContent = null;
                    }
                    for (var i = 0; i < buttonCount; i++) {
                        if (!sf.base.isNullOrUndefined(this.buttons[i].buttonModel)) {
                            this.footerTemplate = '';
                            this.setButton();
                        }
                    }
                    break;
                case 'allowDragging':
                    if (this.allowDragging && (!sf.base.isNullOrUndefined(this.headerContent))) {
                        this.setAllowDragging();
                    }
                    else {
                        this.dragObj.destroy();
                    }
                    break;
                case 'target':
                    this.setTarget(newProp.target);
                    break;
                case 'position':
                    this.checkPositionData();
                    if (this.isModal) {
                        var positionX = sf.base.isNullOrUndefined(oldProp.position.X) ? this.position.X : oldProp.position.X;
                        var positionY = sf.base.isNullOrUndefined(oldProp.position.Y) ? this.position.Y : oldProp.position.Y;
                        if (this.dlgContainer.classList.contains('e-dlg-' + positionX + '-' + positionY)) {
                            this.dlgContainer.classList.remove('e-dlg-' + positionX + '-' + positionY);
                        }
                    }
                    this.positionChange();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'enableResize':
                    this.setResize();
                    break;
            }
        }
    };
    Dialog.prototype.setTarget = function (target) {
        this.popupObj.relateTo = target;
        this.target = target;
        this.targetEle = ((typeof this.target) === 'string') ?
            document.querySelector(this.target) : this.target;
        if (this.dragObj) {
            this.dragObj.dragArea = this.targetEle;
        }
        this.setMaxHeight();
        if (this.isModal) {
            this.updateIsModal();
        }
        if (this.enableResize) {
            this.setResize();
        }
    };
    Dialog.prototype.updateIsModal = function () {
        this.element.setAttribute('aria-modal', this.isModal ? 'true' : 'false');
        if (this.isModal) {
            this.setIsModal();
            this.element.style.top = '0px';
            this.element.style.left = '0px';
            if (!sf.base.isNullOrUndefined(this.targetEle)) {
                this.targetEle.appendChild(this.dlgContainer);
            }
        }
        else {
            sf.base.removeClass([this.element], MODAL_DLG);
            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            sf.base.detach(this.dlgOverlay);
            while (this.dlgContainer.firstChild) {
                this.dlgContainer.parentElement.insertBefore(this.dlgContainer.firstChild, this.dlgContainer);
            }
            this.dlgContainer.parentElement.removeChild(this.dlgContainer);
        }
        if (this.visible) {
            this.show();
        }
        this.positionChange();
        if (this.isModal && this.dlgOverlay) {
            sf.base.EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    };
    Dialog.prototype.setzIndex = function (zIndexElement, setPopupZindex) {
        var prevOnChange = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.zIndex = sf.popups.getZindexPartial(zIndexElement);
        this.isProtectedOnChange = prevOnChange;
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    };
    Dialog.prototype.windowResizeHandler = function () {
        sf.popups.setMaxWidth(this.targetEle.clientWidth);
        sf.popups.setMaxHeight(this.targetEle.clientHeight);
        this.setMaxHeight();
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Dialog.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @memberof dialog
     */
    Dialog.prototype.destroy = function () {
        if (this.isDestroyed) {
            return;
        }
        var classArray = [RTL, MODAL_DLG, DLG_RESIZABLE, DLG_RESTRICT_LEFT_VALUE, FULLSCREEN, DEVICE];
        var attrs = ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-grabbed', 'tabindex', 'style'];
        sf.base.removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
        if (this.element.classList.contains(FULLSCREEN)) {
            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        if (this.isModal) {
            sf.base.removeClass([(!sf.base.isNullOrUndefined(this.targetEle) ? this.targetEle : document.body)], SCROLL_DISABLED);
        }
        this.unWireEvents();
        if (!sf.base.isNullOrUndefined(this.btnObj)) {
            for (var i = 0; i < this.btnObj.length; i++) {
                this.btnObj[i].destroy();
            }
        }
        if (!sf.base.isNullOrUndefined(this.dragObj)) {
            this.dragObj.destroy();
        }
        if (this.popupObj.element.classList.contains(POPUP_ROOT)) {
            this.popupObj.destroy();
        }
        sf.base.removeClass([this.element], classArray);
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            sf.base.removeClass([this.element], this.cssClass.split(' '));
        }
        if (!sf.base.isNullOrUndefined(this.refElement) && !sf.base.isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore((this.isModal ? this.dlgContainer : this.element), this.refElement);
            sf.base.detach(this.refElement);
            this.refElement = undefined;
        }
        if (this.isModal && !this.isBlazorServerRender()) {
            sf.base.detach(this.dlgOverlay);
            this.dlgContainer.parentNode.insertBefore(this.element, this.dlgContainer);
            sf.base.detach(this.dlgContainer);
        }
        if (!this.isBlazorServerRender()) {
            this.element.innerHTML = this.clonedEle.innerHTML;
        }
        if (this.isBlazorServerRender()) {
            if (!sf.base.isNullOrUndefined(this.element.children)) {
                for (var i = 0; i <= this.element.children.length; i++) {
                    i = i - i;
                    sf.base.detach(this.element.children[i]);
                }
            }
        }
        for (var i = 0; i < attrs.length; i++) {
            this.element.removeAttribute(attrs[i]);
        }
        if (!this.isBlazorServerRender()) {
            _super.prototype.destroy.call(this);
        }
        else {
            this.isDestroyed = true;
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
    };
    Dialog.prototype.wireWindowResizeEvent = function () {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    };
    Dialog.prototype.unWireWindowResizeEvent = function () {
        window.removeEventListener('resize', this.windowResizeHandler.bind(this));
    };
    /**
     * Binding event to the element while widget creation
     * @hidden
     */
    Dialog.prototype.wireEvents = function () {
        if (this.isBlazorServerRender() && this.showCloseIcon) {
            this.closeIcon = this.element.getElementsByClassName('e-dlg-closeicon-btn')[0];
        }
        if (this.showCloseIcon) {
            sf.base.EventHandler.add(this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal && this.dlgOverlay) {
            sf.base.EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    };
    /**
     * Unbinding event to the element while widget destroy
     * @hidden
     */
    Dialog.prototype.unWireEvents = function () {
        if (this.showCloseIcon) {
            sf.base.EventHandler.remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            sf.base.EventHandler.remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }
        if (this.buttons.length > 0 && !sf.base.isNullOrUndefined(this.buttons[0].buttonModel) && this.footerTemplate === '') {
            for (var i = 0; i < this.buttons.length; i++) {
                if (typeof (this.buttons[i].click) === 'function') {
                    sf.base.EventHandler.remove(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click);
                }
            }
        }
    };
    /**
     * Refreshes the dialog's position when the user changes its header and footer height/width dynamically.
     * @return {void}
     */
    Dialog.prototype.refreshPosition = function () {
        this.popupObj.refreshPosition();
    };
    /**
     * Opens the dialog if it is in hidden state.
     * To open the dialog with full screen width, set the parameter to true.
     * @param { boolean } isFullScreen - Enable the fullScreen Dialog.
     * @return {void}
     */
    Dialog.prototype.show = function (isFullScreen) {
        var _this = this;
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (!this.element.classList.contains(DLG_SHOW) || (!sf.base.isNullOrUndefined(isFullScreen))) {
            if (!sf.base.isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            var eventArgs_1 = sf.base.isBlazor() ? {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                maxHeight: this.element.style.maxHeight
            } : {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                target: this.target,
                maxHeight: this.element.style.maxHeight
            };
            this.trigger('beforeOpen', eventArgs_1, function (beforeOpenArgs) {
                if (!beforeOpenArgs.cancel) {
                    if (_this.element.style.maxHeight !== eventArgs_1.maxHeight) {
                        _this.allowMaxHeight = false;
                        _this.element.style.maxHeight = eventArgs_1.maxHeight;
                    }
                    _this.storeActiveElement = document.activeElement;
                    _this.element.tabIndex = -1;
                    if (_this.isModal && (!sf.base.isNullOrUndefined(_this.dlgOverlay))) {
                        _this.dlgOverlay.style.display = 'block';
                        _this.dlgContainer.style.display = 'flex';
                        sf.base.removeClass([_this.dlgOverlay], 'e-fade');
                        if (!sf.base.isNullOrUndefined(_this.targetEle)) {
                            if (_this.targetEle === document.body) {
                                _this.dlgContainer.style.position = 'fixed';
                            }
                            else {
                                _this.dlgContainer.style.position = 'absolute';
                            }
                            _this.dlgOverlay.style.position = 'absolute';
                            _this.element.style.position = 'relative';
                            sf.base.addClass([_this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
                        }
                        else {
                            sf.base.addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                        }
                    }
                    var openAnimation = {
                        name: _this.animationSettings.effect + 'In',
                        duration: _this.animationSettings.duration,
                        delay: _this.animationSettings.delay
                    };
                    var zIndexElement = (_this.isModal) ? _this.element.parentElement : _this.element;
                    if (_this.calculatezIndex) {
                        _this.setzIndex(zIndexElement, true);
                        sf.base.setStyleAttribute(_this.element, { 'zIndex': _this.zIndex });
                        if (_this.isModal) {
                            _this.setOverlayZindex(_this.zIndex);
                        }
                    }
                    _this.animationSettings.effect === 'None' ? _this.popupObj.show() : _this.popupObj.show(openAnimation);
                    _this.dialogOpen = true;
                    var prevOnChange = _this.isProtectedOnChange;
                    _this.isProtectedOnChange = true;
                    _this.visible = true;
                    _this.preventVisibility = true;
                    _this.isProtectedOnChange = prevOnChange;
                }
            });
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    };
    /**
     * Closes the dialog if it is in visible state.
     * @return {void}
     */
    Dialog.prototype.hide = function (event) {
        var _this = this;
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (this.preventVisibility) {
            var eventArgs = sf.base.isBlazor() ? {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            } : {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                target: this.target,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            };
            this.closeArgs = eventArgs;
            this.trigger('beforeClose', eventArgs, function (beforeCloseArgs) {
                if (!beforeCloseArgs.cancel) {
                    if (_this.isModal) {
                        !sf.base.isNullOrUndefined(_this.targetEle) ? sf.base.removeClass([_this.targetEle], [DLG_TARGET, SCROLL_DISABLED]) :
                            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                    }
                    var closeAnimation = {
                        name: _this.animationSettings.effect + 'Out',
                        duration: _this.animationSettings.duration,
                        delay: _this.animationSettings.delay
                    };
                    _this.animationSettings.effect === 'None' ? _this.popupObj.hide() : _this.popupObj.hide(closeAnimation);
                    _this.dialogOpen = false;
                    var prevOnChange = _this.isProtectedOnChange;
                    _this.isProtectedOnChange = true;
                    _this.visible = false;
                    _this.preventVisibility = false;
                    _this.isProtectedOnChange = prevOnChange;
                }
            });
        }
    };
    /**
     * Specifies to view the Full screen Dialog.
     * @private
     */
    Dialog.prototype.fullScreen = function (args) {
        var top = this.element.offsetTop;
        var left = this.element.offsetLeft;
        if (args) {
            sf.base.addClass([this.element], FULLSCREEN);
            var display = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!sf.base.isNullOrUndefined(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            sf.base.addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && !sf.base.isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
            }
        }
        else {
            sf.base.removeClass([this.element], FULLSCREEN);
            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && (!sf.base.isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    };
    /**
     * Returns the dialog button instances.
     * Based on that, you can dynamically change the button states.
     * @param { number } index - Index of the button.
     * @return {Button}
     */
    Dialog.prototype.getButtons = function (index) {
        if (!sf.base.isNullOrUndefined(index)) {
            return this.btnObj[index];
        }
        return this.btnObj;
    };
    __decorate([
        sf.base.Property('')
    ], Dialog.prototype, "content", void 0);
    __decorate([
        sf.base.Property(true)
    ], Dialog.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Property(false)
    ], Dialog.prototype, "showCloseIcon", void 0);
    __decorate([
        sf.base.Property(false)
    ], Dialog.prototype, "isModal", void 0);
    __decorate([
        sf.base.Property('')
    ], Dialog.prototype, "header", void 0);
    __decorate([
        sf.base.Property(true)
    ], Dialog.prototype, "visible", void 0);
    __decorate([
        sf.base.Property(false)
    ], Dialog.prototype, "enableResize", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Dialog.prototype, "height", void 0);
    __decorate([
        sf.base.Property('')
    ], Dialog.prototype, "minHeight", void 0);
    __decorate([
        sf.base.Property('100%')
    ], Dialog.prototype, "width", void 0);
    __decorate([
        sf.base.Property('')
    ], Dialog.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(1000)
    ], Dialog.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(null)
    ], Dialog.prototype, "target", void 0);
    __decorate([
        sf.base.Property('')
    ], Dialog.prototype, "footerTemplate", void 0);
    __decorate([
        sf.base.Property(false)
    ], Dialog.prototype, "allowDragging", void 0);
    __decorate([
        sf.base.Collection([{}], ButtonProps)
    ], Dialog.prototype, "buttons", void 0);
    __decorate([
        sf.base.Property(true)
    ], Dialog.prototype, "closeOnEscape", void 0);
    __decorate([
        sf.base.Complex({}, AnimationSettings)
    ], Dialog.prototype, "animationSettings", void 0);
    __decorate([
        sf.base.Complex({ X: 'center', Y: 'center' }, sf.popups.PositionData)
    ], Dialog.prototype, "position", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "beforeSanitizeHtml", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "beforeClose", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "dragStart", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "dragStop", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "drag", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "overlayClick", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "resizeStart", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "resizing", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "resizeStop", void 0);
    __decorate([
        sf.base.Event()
    ], Dialog.prototype, "destroyed", void 0);
    Dialog = __decorate([
        sf.base.NotifyPropertyChanges
    ], Dialog);
    return Dialog;
}(sf.base.Component));
/**
 * Base for creating Alert and Confirmation Dialog through util method.
 */

(function (DialogUtility) {
    /**
     * An alert dialog box is used to display warning like messages to the users.
     * ```
     * Eg : DialogUtility.alert('Alert message');
     *
     * ```
     */
    /* istanbul ignore next */
    function alert(args) {
        var dialogElement = sf.base.createElement('div', { 'className': DLG_UTIL_ALERT });
        document.body.appendChild(dialogElement);
        var alertDialogObj;
        var okButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }];
        if (typeof (args) === 'string') {
            alertDialogObj = createDialog({ content: args,
                position: { X: 'center', Y: 'top' },
                isModal: true, header: DLG_UTIL_DEFAULT_TITLE,
                buttons: okButtonModel }, dialogElement);
        }
        else {
            alertDialogObj = createDialog(alertOptions(args), dialogElement);
        }
        alertDialogObj.close = function () {
            if (args && args.close) {
                args.close.apply(alertDialogObj);
            }
            alertDialogObj.destroy();
            if (alertDialogObj.element.classList.contains('e-dlg-modal')) {
                alertDialogObj.element.parentElement.remove();
                alertDialogObj.target.classList.remove(DLG_UTIL_ROOT);
            }
            else {
                alertDialogObj.element.remove();
            }
        };
        return alertDialogObj;
    }
    DialogUtility.alert = alert;
    /**
     * A confirm dialog displays a specified message along with ‘OK’ and ‘Cancel’ button.
     * ```
     * Eg : DialogUtility.confirm('Confirm dialog message');
     *
     * ```
     */
    /* istanbul ignore next */
    function confirm(args) {
        var dialogElement = sf.base.createElement('div', { 'className': DLG_UTIL_CONFIRM });
        document.body.appendChild(dialogElement);
        var confirmDialogObj;
        var okCancelButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }, {
                buttonModel: { content: 'Cancel' },
                click: function () {
                    this.hide();
                }
            }];
        if (typeof (args) === 'string') {
            confirmDialogObj = createDialog({ position: { X: 'center', Y: 'top' }, content: args, isModal: true,
                header: DLG_UTIL_DEFAULT_TITLE, buttons: okCancelButtonModel
            }, dialogElement);
        }
        else {
            confirmDialogObj = createDialog(confirmOptions(args), dialogElement);
        }
        confirmDialogObj.close = function () {
            if (args && args.close) {
                args.close.apply(confirmDialogObj);
            }
            confirmDialogObj.destroy();
            if (confirmDialogObj.element.classList.contains('e-dlg-modal')) {
                confirmDialogObj.element.parentElement.remove();
                confirmDialogObj.target.classList.remove(DLG_UTIL_ROOT);
            }
            else {
                confirmDialogObj.element.remove();
            }
        };
        return confirmDialogObj;
    }
    DialogUtility.confirm = confirm;
    function createDialog(options, element) {
        var dialogObject = new Dialog(options);
        dialogObject.appendTo(element);
        return dialogObject;
    }
    function alertOptions(option) {
        var options = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setAlertButtonModel(options, option);
        return options;
    }
    function confirmOptions(option) {
        var options = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setConfirmButtonModel(options, option);
        return options;
    }
    function formOptions(options, option) {
        options.header = !sf.base.isNullOrUndefined(option.title) ? option.title : DLG_UTIL_DEFAULT_TITLE;
        options.content = !sf.base.isNullOrUndefined(option.content) ? option.content : '';
        options.isModal = !sf.base.isNullOrUndefined(option.isModal) ? option.isModal : true;
        options.showCloseIcon = !sf.base.isNullOrUndefined(option.showCloseIcon) ? option.showCloseIcon : false;
        options.allowDragging = !sf.base.isNullOrUndefined(option.isDraggable) ? option.isDraggable : false;
        options.closeOnEscape = !sf.base.isNullOrUndefined(option.closeOnEscape) ? option.closeOnEscape : false;
        options.position = !sf.base.isNullOrUndefined(option.position) ? option.position : { X: 'center', Y: 'top' };
        options.animationSettings = !sf.base.isNullOrUndefined(option.animationSettings) ? option.animationSettings :
            { effect: 'Fade', duration: 400, delay: 0 };
        options.cssClass = !sf.base.isNullOrUndefined(option.cssClass) ? option.cssClass : '';
        options.zIndex = !sf.base.isNullOrUndefined(option.zIndex) ? option.zIndex : 1000;
        options.open = !sf.base.isNullOrUndefined(option.open) ? option.open : null;
        return options;
    }
    function setAlertButtonModel(options, option) {
        var alertButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }];
        if (!sf.base.isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, alertButtonModel[0]);
        }
        else {
            options.buttons = alertButtonModel;
        }
        return options;
    }
    function setConfirmButtonModel(options, option) {
        var okButtonModel = {
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function () {
                this.hide();
            }
        };
        var cancelButtonModel = {
            buttonModel: { content: 'Cancel' },
            click: function () {
                this.hide();
            }
        };
        if (!sf.base.isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, okButtonModel);
        }
        else {
            options.buttons[0] = okButtonModel;
        }
        if (!sf.base.isNullOrUndefined(option.cancelButton)) {
            options.buttons[1] = formButtonModel(options.buttons[1], option.cancelButton, cancelButtonModel);
        }
        else {
            options.buttons[1] = cancelButtonModel;
        }
        return options;
    }
    function formButtonModel(buttonModel, option, buttonPropModel) {
        var buttonProps = buttonPropModel;
        if (!sf.base.isNullOrUndefined(option.text)) {
            buttonProps.buttonModel.content = option.text;
        }
        if (!sf.base.isNullOrUndefined(option.icon)) {
            buttonProps.buttonModel.iconCss = option.icon;
        }
        if (!sf.base.isNullOrUndefined(option.cssClass)) {
            buttonProps.buttonModel.cssClass = option.cssClass;
        }
        if (!sf.base.isNullOrUndefined(option.click)) {
            buttonProps.click = option.click;
        }
        return buttonProps;
    }
})(exports.DialogUtility || (exports.DialogUtility = {}));

/**
 * Dialog Component
 */

exports.ButtonProps = ButtonProps;
exports.AnimationSettings = AnimationSettings;
exports.Dialog = Dialog;

return exports;

});

    sf.popups = sf.base.extend({}, sf.popups, sfdialog({}));