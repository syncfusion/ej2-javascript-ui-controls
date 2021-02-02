window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.InPlaceEditor = (function () {
'use strict';

var ROOT = 'e-inplaceeditor';
var ROOT_TIP = 'e-inplaceeditor-tip';
var OPEN = 'e-editable-open';
var DISABLE = 'e-disable';
var RTL = 'e-rtl';
var EDITABLE_VALUE_ELEMENT = 'e-editable-value-element';
var CLEAR_ICON = 'e-clear-icon';
var EDITABLE_COMPONENT = 'e-editable-component';
var EDITABLE_ELEMENT = 'e-editable-elements';
var CREATED = 'Created';
var CANCEL_ACTION = 'CancelAction';
var SAVE_ACTION = 'SaveAction';
var RENDER_EDITOR = 'RenderEditor';
var INLINE = 'Inline';
var KEYDOWN = 'keydown';
var SCROLL = 'scroll';
var RESIZE = 'resize';
var MOUSEDOWN = 'mousedown';
var POPUP = 'Popup';
var SUBMIT = 'Submit';
var CANCEL = 'Cancel';
var BUTTON = 'BUTTON';
var IGNORE = 'Ignore';
var MOUSE_DOWN = 'mousedown';
var TAB_KEY = 'Tab';
var ENTER_KEY = 'Enter';
var SfInPlaceEditor = /** @class */ (function () {
    function SfInPlaceEditor(element, options, dotnetRef) {
        this.submitOnEnter = true;
        this.clearComponents = ['AutoComplete', 'Mask', 'Text'];
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }
    SfInPlaceEditor.prototype.updateContext = function (inPlaceObj) {
        sf.base.extend(this, this, inPlaceObj);
    };
    SfInPlaceEditor.prototype.initialize = function () {
        this.wireEvents();
        this.id = this.element.id;
        this.dotNetRef.invokeMethodAsync(CREATED, null);
    };
    SfInPlaceEditor.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, KEYDOWN, this.valueKeyDownHandler, this);
        sf.base.EventHandler.add(document, SCROLL, this.scrollResizeHandler, this);
        window.addEventListener(RESIZE, this.scrollResizeHandler.bind(this));
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            sf.base.EventHandler.add(this.element, MOUSEDOWN, this.mouseDownHandler, this);
        }
    };
    SfInPlaceEditor.prototype.scrollResizeHandler = function () {
        if (this.mode === POPUP
            && !(sf.base.Browser.isDevice)) {
            this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
        }
    };
    SfInPlaceEditor.prototype.valueKeyDownHandler = function (e) {
        if (e.code === TAB_KEY && e.shiftKey === true && e.target.tagName !== BUTTON) {
            if (this.actionOnBlur === SUBMIT) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            }
            else if (this.actionOnBlur === CANCEL) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
        if (e.code === ENTER_KEY && e.target.classList.contains(ROOT) &&
            !this.element.querySelector(EDITABLE_VALUE_ELEMENT).classList.contains(OPEN) && !this.element.classList.contains(DISABLE)) {
            e.preventDefault();
            this.dotNetRef.invokeMethodAsync(RENDER_EDITOR, null);
        }
    };
    SfInPlaceEditor.prototype.mouseDownHandler = function (e) {
        if (e.target.classList.contains(CLEAR_ICON)) {
            this.isClearTarget = true;
        }
    };
    SfInPlaceEditor.prototype.openEditor = function (options) {
        this.updateContext(options);
        if (this.mode === 'Popup') {
            this.popupConent = document.querySelector('#' + this.popupElement + '_content');
        }
        if (this.actionOnBlur !== IGNORE) {
            sf.base.EventHandler.add(document, MOUSE_DOWN, this.docClickHandler, this);
        }
        if (this.submitOnEnter) {
            var editorEle = this.mode === 'Popup' ? this.popupConent : this.element;
            sf.base.EventHandler.add(editorEle, 'keydown', this.enterKeyDownHandler, this);
        }
    };
    SfInPlaceEditor.prototype.enterKeyDownHandler = function (e) {
        if (!sf.base.closest(e.target, '.' + EDITABLE_COMPONENT + ' .e-richtexteditor')) {
            if ((e.keyCode === 13 && e.which === 13) && sf.base.closest(e.target, '.' + EDITABLE_COMPONENT)) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            }
            else if (e.keyCode === 27 && e.which === 27) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
    };
    SfInPlaceEditor.prototype.removeEditor = function (options) {
        this.updateContext(options);
        if (this.enablePersistence) {
            window.localStorage.setItem(this.id, this.value);
        }
        this.unWireEvents();
        sf.base.EventHandler.remove(document, MOUSE_DOWN, this.docClickHandler);
    };
    SfInPlaceEditor.prototype.Destroy = function (options) {
        var _this = this;
        this.updateContext(options);
        if (this.enablePersistence) {
            window.localStorage.setItem(this.id, this.value);
        }
        if (this.mode === POPUP) {
            this.destroyPopup();
        }
        var classList = [DISABLE, RTL];
        classList.forEach(function (val) {
            sf.base.removeClass([_this.element], [val]);
        });
        while (this.element.firstElementChild) {
            this.element.removeChild(this.element.firstElementChild);
        }
    };
    SfInPlaceEditor.prototype.destroyPopup = function () {
        var popEle = document.querySelector('#' + this.popupElement);
        if (popEle) {
            while (popEle.attributes.length > 0) {
                popEle.removeAttribute(popEle.attributes[0].name);
            }
            var splitNodes = popEle.children;
            for (var i = splitNodes.length - 1; i >= 0; i--) {
                sf.base.detach(splitNodes[i]);
            }
        }
    };
    SfInPlaceEditor.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(document, SCROLL, this.scrollResizeHandler);
        window.removeEventListener(RESIZE, this.scrollResizeHandler.bind(this));
        sf.base.EventHandler.remove(this.element, KEYDOWN, this.valueKeyDownHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            sf.base.EventHandler.remove(this.element, MOUSEDOWN, this.mouseDownHandler);
        }
    };
    SfInPlaceEditor.prototype.validate = function () {
        return this.element.querySelector('.validation-message') ? true : false;
    };
    SfInPlaceEditor.prototype.docClickHandler = function (e) {
        var relateRoot = sf.base.closest(e.target, '.' + ROOT);
        var relateTipRoot = sf.base.closest(e.target, '.' + ROOT_TIP);
        var relateElements = sf.base.closest(e.target, '.' + EDITABLE_ELEMENT);
        var relateRTEElements = sf.base.closest(e.target, '.' + '.e-rte-elements');
        if (this.isClearTarget || ((!sf.base.isNullOrUndefined(relateRoot) && relateRoot.isEqualNode(this.element)) ||
            (!sf.base.isNullOrUndefined(relateTipRoot) && this.popupConent && relateTipRoot.id.indexOf('tooltip') > -1)) ||
            !sf.base.isNullOrUndefined(relateElements) || !sf.base.isNullOrUndefined(relateRTEElements) ||
            e.target.classList.contains('e-chips-close')) {
            this.isClearTarget = false;
            return;
        }
        var ele = this.mode === INLINE ? this.element.querySelector('.' + EDITABLE_COMPONENT) : this.element;
        var btnEle = this.mode === INLINE ? this.element.querySelector('.e-editable-action-buttons') : this.componentParent;
        if (ele.contains(e.target) || (btnEle && btnEle.contains(e.target) ||
            sf.base.closest(e.target, '.e-dropdown-popup.e-control.e-rte-elements') ||
            sf.base.closest(e.target, '.e-dropdown-popup.e-control.e-colorpicker-popup') ||
            (this.popupConent && this.popupConent.contains(e.target)))) {
            return;
        }
        else {
            if (this.actionOnBlur === SUBMIT && !this.element.querySelector('.validation-message')) {
                this.dotNetRef.invokeMethodAsync(SAVE_ACTION, null);
            }
            else if (this.actionOnBlur === CANCEL) {
                this.dotNetRef.invokeMethodAsync(CANCEL_ACTION, null);
            }
        }
    };
    return SfInPlaceEditor;
}());
// tslint:disable-next-line
var InPlaceEditor = {
    initialize: function (element, options, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            new SfInPlaceEditor(element, options, dotnetRef);
            element.blazor__instance.initialize();
        }
    },
    openEditor: function (element, options) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.openEditor(options);
        }
    },
    closeEditor: function (element, options) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.removeEditor(options);
        }
    },
    destroy: function (element, options) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.Destroy(options);
        }
    },
    propertyChanged: function (element, options) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.updateContext(options);
        }
    },
    validate: function (element) {
        return element && element.blazor__instance.validate();
    }
};

return InPlaceEditor;

}());
