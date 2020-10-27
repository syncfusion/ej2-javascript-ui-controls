window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Dialog = (function () {
'use strict';

var TAB = 9;
var ENTER = 13;
var ESCAPE = 27;
var BTN = 'e-btn';
var FADE = 'e-fade';
var ICON = 'e-icons';
var POPUP = 'e-popup';
var DIALOG = 'e-dialog';
var DEVICE = 'e-device';
var PRIMARY = 'e-primary';
var DRAGGABLE = 'e-draggable';
var POPUP_OPEN = 'e-popup-open';
var DLG_TARGET = 'e-dlg-target';
var DLG_CONTENT = 'e-dlg-content';
var DLG_OVERLAY = 'e-dlg-overlay';
var DLG_RESIZABLE = 'e-dlg-resizable';
var DLG_FULLSCREEN = 'e-dlg-fullscreen';
var FOOTER_CONTENT = 'e-footer-content';
var SCROLL_DISABLED = 'e-scroll-disabled';
var DLG_REF_ELEMENT = 'e-dlg-ref-element';
var DLG_RESTRICT_LEFT = 'e-restrict-left';
var DLG_RESIZE_HANDLE = 'e-resize-handle';
var DLG_RESIZE_VIEWPORT = 'e-resize-viewport';
var DLG_CLOSE_ICON_BTN = 'e-dlg-closeicon-btn';
var DLG_HEADER_CONTENT = 'e-dlg-header-content';
var SfDialog = /** @class */ (function () {
    function SfDialog(element, options, dotnetRef) {
        this.hasFocusableNode = false;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        if (this.element) {
            this.element.blazor__instance = this;
        }
    }
    SfDialog.prototype.initialize = function () {
        this.dlgContainer = undefined;
        this.popupObj = null;
        this.calculatezIndex = (this.zIndex === 1000);
        this.render();
        this.dotNetRef.invokeMethodAsync('CreatedEvent', null);
        if (this.visible) {
            this.dotNetRef.invokeMethodAsync('ShowDialog', null);
        }
        else {
            if (this.isModal) {
                this.dlgOverlay.style.display = 'none';
            }
        }
        this.setWidth();
        this.setMinHeight();
        if (this.enableResize) {
            this.setResize();
            if (this.animationSettings.effect === 'None') {
                this.getMinHeight();
            }
        }
        this.bindEvent(this.element);
    };
    SfDialog.prototype.updateContext = function (dlgObj) {
        sf.base.extend(this, this, dlgObj);
    };
    SfDialog.prototype.setWidth = function () {
        if (this.width === '100%') {
            this.element.style.width = '';
        }
        else {
            sf.base.setStyleAttribute(this.element, { 'width': sf.base.formatUnit(this.width) });
        }
    };
    SfDialog.prototype.setHeight = function () {
        sf.base.setStyleAttribute(this.element, { 'height': sf.base.formatUnit(this.height) });
    };
    SfDialog.prototype.setMinHeight = function () {
        if (this.minHeight !== '') {
            sf.base.setStyleAttribute(this.element, { 'minHeight': sf.base.formatUnit(this.minHeight) });
        }
    };
    SfDialog.prototype.render = function () {
        var _this = this;
        this.checkPositionData();
        this.targetEle = this.getTargetEle(this.target);
        if (sf.base.Browser.isDevice) {
            sf.base.addClass([this.element], DEVICE);
        }
        if (sf.base.isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.element.querySelector('.' + DLG_HEADER_CONTENT);
        }
        if (sf.base.isNullOrUndefined(this.contentEle)) {
            this.contentEle = this.element.querySelector('.' + DLG_CONTENT);
        }
        this.setMaxHeight();
        if (this.zIndex === 1000) {
            this.setzIndex(this.element, false);
        }
        if (this.allowDragging && (!sf.base.isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        if (this.isModal && sf.base.isNullOrUndefined(this.dlgContainer)) {
            this.dlgContainer = this.element.parentElement;
            this.dlgOverlay = this.element.parentElement.getElementsByClassName(DLG_OVERLAY)[0];
        }
        if (!sf.base.isNullOrUndefined(this.element.parentElement)) {
            var parentEle = this.isModal ? this.dlgContainer.parentElement : this.element.parentElement;
            this.refElement = sf.base.createElement('div', { className: DLG_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, (this.isModal ? this.dlgContainer : this.element));
        }
        if (!sf.base.isNullOrUndefined(this.targetEle)) {
            this.isModal ? this.targetEle.appendChild(this.dlgContainer) : this.targetEle.appendChild(this.element);
        }
        this.popupObj = new sf.popups.Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.getTargetEle(this.target),
            actionOnScroll: 'none',
            enableRtl: this.enableRtl,
            open: function () {
                if (_this.enableResize) {
                    _this.resetResizeIcon();
                }
                _this.dotNetRef.invokeMethodAsync('OpenEvent', null);
            },
            close: function () {
                if (_this.isModal) {
                    sf.base.addClass([_this.dlgOverlay], FADE);
                    _this.dlgContainer.style.display = 'none';
                }
                _this.hasFocusableNode = false;
                _this.dotNetRef.invokeMethodAsync('CloseEvent', _this.element.classList.toString());
            }
        });
        this.positionChange();
        this.setEnableRTL();
    };
    SfDialog.prototype.checkPositionData = function () {
        if (!sf.base.isNullOrUndefined(this.position)) {
            if (!sf.base.isNullOrUndefined(this.position.X) && (typeof (this.position.X) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.X);
                if (isNumber) {
                    this.position.X = parseFloat(this.position.X);
                }
            }
            if (!sf.base.isNullOrUndefined(this.position.Y) && (typeof (this.position.Y) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.Y);
                if (isNumber) {
                    this.position.Y = parseFloat(this.position.Y);
                }
            }
        }
    };
    SfDialog.prototype.isNumberValue = function (value) {
        return /^[-+]?\d*\.?\d+$/.test(value);
    };
    SfDialog.prototype.getTargetEle = function (target) {
        var targetEle;
        if (!sf.base.isNullOrUndefined(target) && (typeof target) === 'string') {
            targetEle = document.querySelector(target);
        }
        return (sf.base.isNullOrUndefined(targetEle) ? document.body : targetEle);
    };
    SfDialog.prototype.setMaxHeight = function () {
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
    SfDialog.prototype.setzIndex = function (zIndexElement, setPopupZindex) {
        this.zIndex = sf.popups.getZindexPartial(zIndexElement);
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    };
    SfDialog.prototype.updatezIndex = function () {
        this.popupObj.zIndex = this.zIndex;
        if (this.isModal) {
            this.setOverlayZindex(this.zIndex);
        }
        this.calculatezIndex = (this.element.style.zIndex !== this.zIndex.toString()) ? false : true;
    };
    SfDialog.prototype.updateTarget = function () {
        this.targetEle = this.getTargetEle(this.target);
        this.popupObj.relateTo = this.targetEle;
        if (this.dragObj) {
            this.dragObj.dragArea = this.targetEle;
        }
        this.setMaxHeight();
        if (this.isModal) {
            this.targetEle.appendChild(this.dlgContainer);
        }
        if (this.enableResize) {
            this.setResize();
        }
    };
    SfDialog.prototype.resetResizeIcon = function () {
        var dialogConHeight = this.getMinHeight();
        if (this.targetEle.offsetHeight < dialogConHeight) {
            var resizeIcon = this.element.querySelector('.' + this.resizeIconDirection);
            if (!sf.base.isNullOrUndefined(resizeIcon)) {
                resizeIcon.style.bottom = '-' + dialogConHeight.toString() + 'px';
            }
        }
    };
    SfDialog.prototype.getMouseEvtArgs = function (e) {
        return {
            altKey: e.altKey, button: e.button, buttons: e.buttons, clientX: e.clientX, clientY: e.clientY, ctrlKey: e.ctrlKey,
            detail: e.detail, metaKey: e.metaKey, screenX: e.screenX, screenY: e.screenY, shiftKey: e.shiftKey, type: e.type
        };
    };
    SfDialog.prototype.setAllowDragging = function () {
        var proxy = this;
        this.dragObj = new sf.base.Draggable(this.element, {
            clone: false,
            abort: '.' + DLG_CLOSE_ICON_BTN,
            handle: '.' + DLG_HEADER_CONTENT,
            dragStart: function (e) {
                proxy.dotNetRef.invokeMethodAsync('DragStartEvent', {
                    target: { ID: e.target.id }, event: proxy.getMouseEvtArgs(e.event)
                });
                e.bindEvents(e.dragElement);
            },
            drag: function (e) {
                proxy.dotNetRef.invokeMethodAsync('DragEvent', {
                    target: { ID: e.target.id }, event: proxy.getMouseEvtArgs(e.event)
                });
            },
            dragStop: function (e) {
                if (proxy.isModal) {
                    if (!sf.base.isNullOrUndefined(proxy.position)) {
                        proxy.dlgContainer.classList.remove('e-dlg-' + proxy.position.X + '-' + proxy.position.Y);
                    }
                    proxy.element.style.position = 'relative';
                }
                proxy.dotNetRef.invokeMethodAsync('DragStopEvent', {
                    target: { ID: e.target.id }, event: proxy.getMouseEvtArgs(e.event)
                });
                proxy.element.classList.remove(DLG_RESTRICT_LEFT);
            }
        });
        if (!sf.base.isNullOrUndefined(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    };
    SfDialog.prototype.positionChange = function () {
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
    SfDialog.prototype.setPopupPosition = function () {
        this.popupObj.setProperties({ position: { X: this.position.X, Y: this.position.Y } });
    };
    SfDialog.prototype.setEnableRTL = function () {
        var resizeElement = this.element.querySelector('.' + DLG_RESIZE_HANDLE);
        if (!sf.base.isNullOrUndefined(resizeElement) && resizeElement.parentElement === this.element) {
            sf.popups.removeResize();
            this.setResize();
        }
    };
    SfDialog.prototype.setResize = function () {
        if (this.enableResize) {
            if (!sf.base.isNullOrUndefined(this.element.querySelector('.' + ICON + '.' + DLG_RESIZE_HANDLE))) {
                return;
            }
            var computedHeight = getComputedStyle(this.element).minHeight;
            var computedWidth = getComputedStyle(this.element).minWidth;
            if (this.isModal && this.enableRtl) {
                this.element.classList.add(DLG_RESTRICT_LEFT);
            }
            else if (this.isModal && (this.target === document.body || this.target === 'body')) {
                this.element.classList.add(DLG_RESIZE_VIEWPORT);
            }
            sf.popups.createResize({
                element: this.element,
                direction: this.resizeIconDirection,
                minHeight: parseInt(computedHeight.slice(0, computedWidth.indexOf('p')), 10),
                maxHeight: this.targetEle.clientHeight,
                minWidth: parseInt(computedWidth.slice(0, computedWidth.indexOf('p')), 10),
                maxWidth: this.targetEle.clientWidth,
                boundary: (this.target === 'body' || this.target === 'document.body') ? null : this.targetEle,
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
                this.element.classList.remove(DLG_RESTRICT_LEFT);
            }
            else {
                this.element.classList.remove(DLG_RESIZE_VIEWPORT);
            }
        }
    };
    SfDialog.prototype.getMinHeight = function () {
        var computedHeaderHeight = '0px';
        var computedFooterHeight = '0px';
        if (!sf.base.isNullOrUndefined(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        var footerEle = sf.base.select('.' + FOOTER_CONTENT, this.element);
        if (!sf.base.isNullOrUndefined(footerEle)) {
            computedFooterHeight = getComputedStyle(footerEle).height;
        }
        var headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        var footerHeight = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        sf.popups.setMinHeight(headerHeight + 30 + footerHeight);
        return (headerHeight + 30 + footerHeight);
    };
    SfDialog.prototype.changePosition = function (dlgObj) {
        if (this.isModal && this.dlgContainer.classList.contains('e-dlg-' + this.position.X + '-' + this.position.Y)) {
            this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
        }
        this.updateContext(dlgObj);
        this.checkPositionData();
        this.positionChange();
    };
    SfDialog.prototype.setOverlayZindex = function (zIndexValue) {
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
    SfDialog.prototype.focusContent = function (ele) {
        var element = this.getAutoFocusNode(ele);
        var node = !sf.base.isNullOrUndefined(element) ? element : ele;
        node.focus();
        this.hasFocusableNode = true;
    };
    SfDialog.prototype.getAutoFocusNode = function (container) {
        var node = container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        var value = '[autofocus]';
        var items = container.querySelectorAll(value);
        var validNode = this.getValidFocusNode(items);
        this.primaryButtonEle = this.element.getElementsByClassName(PRIMARY)[0];
        if (!sf.base.isNullOrUndefined(validNode)) {
            node = validNode;
        }
        else {
            validNode = this.focusableElements(this.contentEle);
            if (!sf.base.isNullOrUndefined(validNode)) {
                return node = validNode;
            }
            else if (!sf.base.isNullOrUndefined(this.primaryButtonEle)) {
                return this.element.querySelector('.' + PRIMARY);
            }
        }
        return node;
    };
    SfDialog.prototype.getValidFocusNode = function (items) {
        var node;
        for (var u = 0; u < items.length; u++) {
            node = items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !node.disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
        }
        return node;
    };
    SfDialog.prototype.disableElement = function (element, t) {
        var elementMatch = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    return element;
                }
            }
        }
        return null;
    };
    SfDialog.prototype.focusableElements = function (content) {
        if (!sf.base.isNullOrUndefined(content)) {
            var value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            var items = content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    };
    SfDialog.prototype.getMaxHeight = function (ele) {
        return ele.style.maxHeight;
    };
    SfDialog.prototype.OnPropertyChanged = function (dlgObj, props) {
        this.updateContext(dlgObj);
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var key = props_1[_i];
            switch (key) {
                case 'width':
                    this.setWidth();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'minHeight':
                    this.setMinHeight();
                    break;
                case 'target':
                    this.updateTarget();
                    break;
                case 'zIndex':
                    this.updatezIndex();
                    break;
                case 'allowDragging':
                    this.setAllowDragging();
                    break;
                case 'destroyDraggable':
                    this.destroyDraggable();
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
    SfDialog.prototype.fullScreen = function (enable) {
        if (enable) {
            sf.base.addClass([this.element], DLG_FULLSCREEN);
            var display = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!sf.base.isNullOrUndefined(this.target)) ? (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            sf.base.addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && !sf.base.isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
                this.dragObj = undefined;
            }
        }
        else {
            sf.base.removeClass([this.element], DLG_FULLSCREEN);
            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && (!sf.base.isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
    };
    SfDialog.prototype.show = function (isFullScreen, maxHeight, dlgObj) {
        this.updateContext(dlgObj);
        if (!this.element.classList.contains(POPUP_OPEN) || !sf.base.isNullOrUndefined(isFullScreen)) {
            if (!sf.base.isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            if (this.element.style.maxHeight !== maxHeight) {
                this.allowMaxHeight = false;
                this.element.style.maxHeight = maxHeight;
            }
            this.storeActiveElement = document.activeElement;
            this.element.tabIndex = -1;
            if (this.isModal && sf.base.isNullOrUndefined(this.dlgOverlay)) {
                this.dlgOverlay = this.element.parentElement.querySelector('.' + DLG_OVERLAY);
            }
            if (this.isModal && !sf.base.isNullOrUndefined(this.dlgOverlay)) {
                this.dlgOverlay.style.display = 'block';
                this.dlgContainer.style.display = 'flex';
                sf.base.removeClass([this.dlgOverlay], FADE);
                if (!sf.base.isNullOrUndefined(this.targetEle)) {
                    if (this.targetEle === document.body) {
                        this.dlgContainer.style.position = 'fixed';
                    }
                    else {
                        this.dlgContainer.style.position = 'absolute';
                    }
                    this.dlgOverlay.style.position = 'absolute';
                    this.element.style.position = 'relative';
                    sf.base.addClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
                }
                else {
                    sf.base.addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                }
            }
            var openAnimation = {
                name: this.animationSettings.effect + 'In',
                duration: this.animationSettings.duration,
                delay: this.animationSettings.delay
            };
            var zIndexElement = (this.isModal) ? this.element.parentElement : this.element;
            if (this.calculatezIndex) {
                this.setzIndex(zIndexElement, true);
                sf.base.setStyleAttribute(this.element, { 'zIndex': this.zIndex });
                if (this.isModal) {
                    this.setOverlayZindex(this.zIndex);
                }
            }
            this.animationSettings.effect === 'None' ? this.popupObj.show() : this.popupObj.show(openAnimation);
        }
    };
    SfDialog.prototype.hide = function () {
        if (this.isModal) {
            !sf.base.isNullOrUndefined(this.targetEle) ? sf.base.removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]) :
                sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        var closeAnimation = {
            name: this.animationSettings.effect + 'Out',
            duration: this.animationSettings.duration,
            delay: this.animationSettings.delay
        };
        this.animationSettings.effect === 'None' ? this.popupObj.hide() : this.popupObj.hide(closeAnimation);
    };
    SfDialog.prototype.refreshPosition = function () {
        this.popupObj.refreshPosition();
    };
    SfDialog.prototype.destroyDraggable = function () {
        if (!sf.base.isNullOrUndefined(this.dragObj)) {
            this.dragObj.destroy();
            this.dragObj = undefined;
        }
    };
    SfDialog.prototype.destroy = function (dlgObj) {
        this.updateContext(dlgObj);
        var attrs = ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-grabbed', 'tabindex', 'style'];
        if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            var classes = this.cssClass.split(' ');
            sf.base.removeClass([this.element], classes);
        }
        if (sf.base.Browser.isDevice) {
            sf.base.removeClass([this.element], DEVICE);
        }
        sf.base.removeClass([this.getTargetEle(this.target)], [DLG_TARGET, SCROLL_DISABLED]);
        this.unBindEvent(this.element);
        if (this.element.classList.contains(DLG_FULLSCREEN)) {
            sf.base.removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        if (this.isModal) {
            sf.base.removeClass([(!sf.base.isNullOrUndefined(this.targetEle) ? this.targetEle : document.body)], SCROLL_DISABLED);
        }
        if (this.element.classList.contains(DLG_RESIZABLE)) {
            this.element.classList.remove(DLG_RESIZABLE);
        }
        if (this.element.classList.contains(DRAGGABLE)) {
            this.dragObj.destroy();
            this.dragObj = undefined;
        }
        if (this.element.classList.contains(POPUP)) {
            this.popupObj.destroy();
            this.popupObj = undefined;
        }
        if (!sf.base.isNullOrUndefined(this.refElement) && !sf.base.isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore((this.isModal ? this.dlgContainer : this.element), this.refElement);
            sf.base.detach(this.refElement);
            this.refElement = undefined;
        }
        if (!sf.base.isNullOrUndefined(this.element.children)) {
            for (var i = 0; i <= this.element.children.length; i++) {
                i = i - i;
                sf.base.detach(this.element.children[i]);
            }
        }
        for (var i = 0; i < attrs.length; i++) {
            this.element.removeAttribute(attrs[i]);
        }
        if (this.isModal) {
            sf.base.detach(this.element.nextElementSibling);
            var parent_1 = this.element.parentElement;
            parent_1.removeAttribute('class');
            parent_1.removeAttribute('style');
        }
        this.element.classList.remove(DIALOG);
    };
    SfDialog.prototype.bindEvent = function (element) {
        sf.base.EventHandler.add(element, 'keydown', this.keyDown, this);
    };
    SfDialog.prototype.unBindEvent = function (element) {
        sf.base.EventHandler.remove(element, 'keydown', this.keyDown);
    };
    SfDialog.prototype.wireWindowResizeEvent = function () {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    };
    SfDialog.prototype.unWireWindowResizeEvent = function () {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    };
    /* Event handlers begin */
    SfDialog.prototype.popupCloseHandler = function () {
        var activeEle = document.activeElement;
        if (!sf.base.isNullOrUndefined(activeEle) && !sf.base.isNullOrUndefined(activeEle.blur)) {
            activeEle.blur();
        }
        if (!sf.base.isNullOrUndefined(this.storeActiveElement) && !sf.base.isNullOrUndefined(this.storeActiveElement.focus)) {
            this.storeActiveElement.focus();
        }
    };
    SfDialog.prototype.windowResizeHandler = function () {
        sf.popups.setMaxWidth(this.targetEle.clientWidth);
    };
    SfDialog.prototype.onResizeStart = function (args, dialogObj) {
        var evtArgs = this.getMouseEvtArgs(args);
        this.dotNetRef.invokeMethodAsync('ResizeStartEvent', evtArgs);
    };
    SfDialog.prototype.onResizing = function (args, dialogObj) {
        this.dotNetRef.invokeMethodAsync('ResizingEvent', this.getMouseEvtArgs(args));
    };
    SfDialog.prototype.onResizeComplete = function (args, dialogObj) {
        this.dotNetRef.invokeMethodAsync('ResizeStopEvent', this.getMouseEvtArgs(args));
    };
    SfDialog.prototype.keyDown = function (e) {
        var _this = this;
        if (e.keyCode === TAB && this.isModal) {
            var btn = void 0;
            var btns = void 0;
            var footer = this.element.querySelector('.' + FOOTER_CONTENT);
            if (!sf.base.isNullOrUndefined(footer)) {
                btns = footer.querySelectorAll('button');
                if (!sf.base.isNullOrUndefined(btn) && btns.length > 0) {
                    btn = btns[btns.length - 1];
                }
                if (sf.base.isNullOrUndefined(btn) && footer.childNodes.length > 0) {
                    var value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
                    var items = footer.querySelectorAll(value);
                    btn = items[items.length - 1];
                }
            }
            if (!sf.base.isNullOrUndefined(btn) && document.activeElement === btn && !e.shiftKey) {
                e.preventDefault();
                this.focusableElements(this.element).focus();
            }
            if (document.activeElement === this.focusableElements(this.element) && e.shiftKey) {
                e.preventDefault();
                if (!sf.base.isNullOrUndefined(btn)) {
                    btn.focus();
                }
            }
        }
        if (e.keyCode === ESCAPE && this.closeOnEscape) {
            this.dotNetRef.invokeMethodAsync('CloseDialog', {
                altKey: e.altKey, ctrlKey: e.ctrlKey, code: e.code, key: e.key, location: e.location,
                repeat: e.repeat, shiftKey: e.shiftKey, metaKey: e.metaKey, type: e.type
            });
        }
        if (this.hasFocusableNode) {
            var element = document.activeElement;
            var isTagName = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
            var isContentEdit = false;
            if (!isTagName) {
                isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
            }
            if ((e.keyCode === ENTER && !e.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
                isTagName && !sf.base.isNullOrUndefined(this.primaryButtonEle)) || (e.keyCode === ENTER && e.ctrlKey &&
                (element.tagName.toLowerCase() === 'textarea' || isContentEdit)) && !sf.base.isNullOrUndefined(this.primaryButtonEle)) {
                setTimeout(function () {
                    _this.element.querySelector('.' + FOOTER_CONTENT + ' button.' + BTN + '.' + PRIMARY).click();
                });
            }
        }
    };
    return SfDialog;
}());
// tslint:disable-next-line
var Dialog = {
    initialize: function (element, options, dotnetRef) {
        if (element) {
            new SfDialog(element, options, dotnetRef);
            element.blazor__instance.initialize();
        }
    },
    getClassList: function (element) {
        return element && element.classList.toString();
    },
    getMaxHeight: function (element) {
        return element ? element.blazor__instance.getMaxHeight(element) : null;
    },
    changePosition: function (dlgObj) {
        if (!sf.base.isNullOrUndefined(dlgObj.element)) {
            dlgObj.element.blazor__instance.changePosition(dlgObj);
        }
    },
    focusContent: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.focusContent(element);
        }
    },
    refreshPosition: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.refreshPosition();
        }
    },
    popupCloseHandler: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.popupCloseHandler();
        }
    },
    propertyChanged: function (dlgObj, changedProps) {
        if (!sf.base.isNullOrUndefined(dlgObj.element)) {
            dlgObj.element.blazor__instance.OnPropertyChanged(dlgObj, changedProps);
        }
    },
    show: function (isFullScreen, maxHeight, dlgObj) {
        if (dlgObj.element) {
            dlgObj.element.blazor__instance.show(isFullScreen, maxHeight, dlgObj);
        }
    },
    hide: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.hide();
        }
    },
    destroy: function (dlgObj) {
        if (!sf.base.isNullOrUndefined(dlgObj.element)) {
            dlgObj.element.blazor__instance.destroy(dlgObj);
        }
    }
};

return Dialog;

}());
