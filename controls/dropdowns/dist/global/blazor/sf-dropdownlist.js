window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DropDownList = (function () {
'use strict';

var POPUP_CONTENT = 'e-content';
var LIST_ITEM = 'e-list-item';
var CLOSE_POPUP = 'ClosePopup';
var ITEM_FOCUS = 'e-item-focus';
var DDL_DEVICE = 'e-ddl-device';
var MOBILE_FILTER = 'e-ddl-device-filter';
var POPUP_FULL_SCREEN = 'e-popup-full-page';
var INPUT_FOCUS = 'e-input-focus';
var FIXED_HEAD = 'e-fixed-head';
var GROUP = 'e-list-group-item';
var SELECTED = 'e-active';
var HOVER = 'e-hover';
var HIDE = 'Hide';
var ICON_ANIM = 'e-icon-anim';
var VIRTUAL_HANDLER = 'VirtualScrollHandler';
var SfDropDownList = /** @class */ (function () {
    // tslint:disable
    function SfDropDownList(containerElement, element, dotnetRef, options) {
        this.activeIndex = null;
        this.prevSelectPoints = {};
        this.containerElement = containerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
    }
    SfDropDownList.prototype.initialize = function () {
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
        if (!sf.base.Browser.isDevice) {
            new sf.base.KeyboardEvents(this.containerElement, {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        if (this.options.moduleName === 'SfComboBox') {
            sf.base.EventHandler.add(this.element, 'keydown', this.onFilterDown, this);
        }
    };
    SfDropDownList.prototype.setAutoFillSelection = function (currentValue) {
        if (!this.isAndroidAutoFill(currentValue)) {
            this.autoFillSelection(currentValue);
        }
    };
    SfDropDownList.prototype.onFilterDown = function (e) {
        if (!(e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 9)) {
            this.prevSelectPoints = this.getSelectionPoints();
        }
    };
    SfDropDownList.prototype.getSelectionPoints = function () {
        var input = this.element;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    };
    SfDropDownList.prototype.autoFillSelection = function (currentValue) {
        var selection = this.getSelectionPoints();
        var value = this.element.value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            var inputValue = value + currentValue.substr(value.length, currentValue.length);
            this.element.value = inputValue;
            this.element.setSelectionRange(selection.start, this.element.value.length);
        }
        else {
            this.element.value = currentValue;
            this.element.setSelectionRange(0, this.element.value.length);
        }
    };
    
    SfDropDownList.prototype.isAndroidAutoFill = function (value) {
        if (sf.base.Browser.isAndroid) {
            var currentPoints = this.getSelectionPoints();
            var prevEnd = this.prevSelectPoints.end;
            var curEnd = currentPoints.end;
            var prevStart = this.prevSelectPoints.start;
            var curStart = currentPoints.start;
            if (prevEnd !== 0 && ((prevEnd === value.length && prevStart === value.length) ||
                (prevStart > curStart && prevEnd > curEnd) || (prevEnd === curEnd && prevStart === curStart))) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    SfDropDownList.prototype.removeFillSelection = function () {
        var selection = this.getSelectionPoints();
        this.element.setSelectionRange(selection.end, selection.end);
    };
    SfDropDownList.prototype.keyActionHandler = function (e) {
        var keyEventsArgs = {
            Action: e.action,
            Key: e.key,
            Events: e,
            Type: e.type
        };
        if (e.action === 'tab' && this.isPopupOpen()) {
            e.preventDefault();
        }
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync('KeyActionHandler', keyEventsArgs);
        }
        if (e.action !== 'tab' && e.action !== 'close' && e.action !== 'space' && e.action !== 'enter' && e.action !== 'open'
            && (this.options.moduleName === 'SfDropDownList' || e.action !== 'home' && e.action !== 'end')) {
            e.preventDefault();
        }
    };
    SfDropDownList.prototype.getOffsetValue = function (popupEle) {
        var popupStyles = getComputedStyle(popupEle);
        var borderTop = parseInt(popupStyles.borderTopWidth, 10);
        var borderBottom = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    };
    SfDropDownList.prototype.setPopupPosition = function (border) {
        var offsetValue;
        var popupOffset = border;
        var selectedLI = this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED);
        var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
        var lastItem = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        var liHeight = firstItem.getBoundingClientRect().height;
        var listHeight = this.list.offsetHeight / 2;
        var height = sf.base.isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        var lastItemOffsetValue = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !sf.base.isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !sf.base.isNullOrUndefined(selectedLI)) {
            var count = this.list.offsetHeight / liHeight;
            var paddingBottom = parseInt(getComputedStyle(this.list).paddingBottom, 10);
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
            this.list.scrollTop = selectedLI.offsetTop;
        }
        else if (height > listHeight) {
            offsetValue = listHeight - liHeight / 2;
            this.list.scrollTop = height - listHeight + liHeight / 2;
        }
        else {
            offsetValue = height;
        }
        var inputHeight = this.containerElement.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    };
    SfDropDownList.prototype.getItems = function () {
        return this.list ? this.list.querySelectorAll('.' + LIST_ITEM) : [];
    };
    // tslint:disable
    SfDropDownList.prototype.renderPopup = function (popupElement, popupHolderEle, openEventArgs, options, dataItem) {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.list = popupHolderEle.querySelector('.' + POPUP_CONTENT) || sf.base.select('.' + POPUP_CONTENT);
        this.liCollections = this.getItems();
        var offsetValue = 0;
        var left;
        var listHeight = sf.base.formatUnit(this.options.popupHeight);
        var searchBoxContainer;
        this.wireListEvents();
        var oldPopupEle = document.body.querySelector('.e-ddl.e-popup.e-popup-open');
        if (oldPopupEle) {
            sf.base.remove(oldPopupEle);
        }
        document.body.appendChild(popupElement);
        popupElement.style.visibility = 'hidden';
        if (this.options.allowFiltering) {
            if (this.options.moduleName === 'SfDropDownList') {
                this.filterInput = popupElement.querySelector('input.e-input');
                searchBoxContainer = this.filterInput.parentElement;
                new sf.base.KeyboardEvents(this.filterInput, {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            else {
                this.filterInput = this.element;
            }
        }
        if (this.options.popupHeight !== 'auto') {
            var searchBoxHeight = 0;
            if (!sf.base.isNullOrUndefined(searchBoxContainer)) {
                searchBoxHeight = (searchBoxContainer.parentElement).getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - (searchBoxHeight)).toString() + 'px';
            }
            if (popupElement.querySelector('.e-ddl-header')) {
                var header = popupElement.querySelector('.e-ddl-header');
                var height = Math.round(header.getBoundingClientRect().height);
                listHeight = (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
            }
            if (popupElement.querySelector('.e-ddl-footer')) {
                var footer = popupElement.querySelector('.e-ddl-footer');
                var height = Math.round(footer.getBoundingClientRect().height);
                listHeight = (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
            }
            this.list.style.maxHeight = (parseInt(listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
            popupElement.style.maxHeight = sf.base.formatUnit(this.options.popupHeight);
        }
        else {
            popupElement.style.height = 'auto';
        }
        if (this.list && this.list.querySelector('.' + SELECTED)) {
            this.setScrollPosition();
        }
        if (sf.base.Browser.isDevice && (!this.options.allowFiltering && (this.options.moduleName === 'SfDropDownList' ||
            (this.options.moduleName === 'SfComboBox')))) {
            offsetValue = this.getOffsetValue(popupElement);
            var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.element).paddingLeft, 10) +
                parseInt(getComputedStyle(this.element.parentElement).borderLeftWidth, 10));
        }
        this.popupCreation(popupElement, offsetValue, left);
        this.checkCollision(popupElement);
        if (sf.base.Browser.isDevice) {
            this.popupObj.element.classList.add(DDL_DEVICE);
            if (this.options.moduleName === 'SfDropDownList' || (this.options.moduleName === 'SfComboBox'
                && !this.options.allowFiltering)) {
                this.popupObj.collision = { X: 'fit', Y: 'fit' };
            }
            if (this.options.allowFiltering && this.options.moduleName === 'SfDropDownList') {
                this.popupObj.element.classList.add(MOBILE_FILTER);
                this.popupObj.position = { X: 0, Y: 0 };
                this.popupObj.dataBind();
                sf.base.attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                sf.base.addClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
                this.setSearchBoxPosition();
            }
        }
        popupElement.style.visibility = 'visible';
        sf.base.addClass([popupElement], 'e-popup-close');
        if (sf.base.Browser.isDevice) {
            if ((this.options.moduleName === 'SfDropDownList' &&
                !this.options.allowFiltering) || (this.options.moduleName === 'SfComboBox' && !this.options.allowFiltering)) {
                var scrollParentElements = this.popupObj.getScrollableParent(this.containerElement);
                for (var _i = 0, scrollParentElements_1 = scrollParentElements; _i < scrollParentElements_1.length; _i++) {
                    var element = scrollParentElements_1[_i];
                    sf.base.EventHandler.add(element, 'scroll', this.scrollHandler, this);
                }
            }
            if (this.isFilterLayout()) {
                sf.base.EventHandler.add(this.list, 'scroll', this.listScroll, this);
            }
        }
        if (this.options.enableVirtualization) {
            sf.base.EventHandler.add(this.list, 'scroll', this.virtualScroll, this);
        }
        sf.base.attributes(this.containerElement, { 'aria-expanded': 'true' });
        var inputParent = this.options.allowFiltering ? this.filterInput.parentElement : this.containerElement;
        sf.base.addClass([inputParent], [INPUT_FOCUS]);
        var animModel = { name: 'FadeIn', duration: 100 };
        this.popupObj.show(new sf.base.Animation(animModel), (this.options.zIndex === 1000) ? this.element : null);
    };
    SfDropDownList.prototype.wireListEvents = function () {
        sf.base.EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        sf.base.EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    
    SfDropDownList.prototype.unWireListEvents = function () {
        sf.base.EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        sf.base.EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };
    
    SfDropDownList.prototype.onMouseOver = function (e) {
        var currentLi = sf.base.closest(e.target, '.' + LIST_ITEM);
        this.setHover(currentLi);
    };
    
    SfDropDownList.prototype.onMouseLeave = function (e) {
        this.removeHover();
    };
    
    SfDropDownList.prototype.listScroll = function () {
        this.filterInput.blur();
    };
    SfDropDownList.prototype.scrollHandler = function () {
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(HIDE);
        }
    };
    SfDropDownList.prototype.setFloatingHeader = function (e) {
        if (sf.base.isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = sf.base.createElement('div', { className: FIXED_HEAD });
            if (!this.list.querySelector('li').classList.contains(GROUP)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            sf.base.prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        this.scrollStop(e);
    };
    SfDropDownList.prototype.setFixedHeader = function () {
        this.list.parentElement.style.display = 'block';
        var borderWidth = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10);
        }
        var liWidth = this.liCollections[0].offsetWidth - borderWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        sf.base.setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        var firstLi = this.list.querySelector('.' + GROUP);
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    };
    SfDropDownList.prototype.scrollStop = function (e) {
        var target = e.target;
        var liHeight = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        var topIndex = Math.round(target.scrollTop / liHeight);
        var liCollections = this.list.querySelectorAll('li');
        for (var i = topIndex; i > -1; i--) {
            if (!sf.base.isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(GROUP)) {
                var currentLi = liCollections[i];
                this.fixedHeaderElement.innerHTML = currentLi.innerHTML;
                this.fixedHeaderElement.style.top = e.target.scrollTop + 'px';
                this.fixedHeaderElement.style.display = 'block';
                break;
            }
            else {
                this.fixedHeaderElement.style.display = 'none';
                this.fixedHeaderElement.style.top = 'none';
            }
        }
    };
    SfDropDownList.prototype.isFilterLayout = function () {
        return this.options.moduleName === 'SfDropDownList' && this.options.allowFiltering;
    };
    SfDropDownList.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
    };
    SfDropDownList.prototype.checkCollision = function (popupEle) {
        if (!sf.base.Browser.isDevice || (sf.base.Browser.isDevice && !(this.options.moduleName === 'SfDropDownList'))) {
            var collision = sf.popups.isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
        }
    };
    SfDropDownList.prototype.refreshPopup = function () {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition(this.containerElement);
        }
    };
    SfDropDownList.prototype.popupCreation = function (popupElement, offsetValue, left) {
        var _this = this;
        this.popupContainer = popupElement;
        this.popupObj = new sf.popups.Popup(this.popupContainer, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.containerElement, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.options.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.options.zIndex,
            close: function () {
                sf.base.EventHandler.remove(_this.list, 'scroll', _this.setFloatingHeader);
                sf.base.removeClass([_this.containerElement], ICON_ANIM);
                _this.fixedHeaderElement = null;
                _this.popupHolder.appendChild(_this.popupContainer);
                sf.base.EventHandler.remove(document, 'mousedown', _this.onDocumentClick);
                _this.unWireListEvents();
                var scrollableParentElements = _this.popupObj.getScrollableParent(_this.containerElement);
                for (var _i = 0, scrollableParentElements_1 = scrollableParentElements; _i < scrollableParentElements_1.length; _i++) {
                    var element = scrollableParentElements_1[_i];
                    sf.base.EventHandler.remove(element, 'scroll', _this.scrollHandler);
                }
                if (sf.base.Browser.isDevice && _this.isFilterLayout()) {
                    sf.base.removeClass([document.body, _this.popupObj.element], POPUP_FULL_SCREEN);
                    sf.base.EventHandler.remove(_this.list, 'scroll', _this.listScroll);
                }
                if (_this.options.enableVirtualization) {
                    sf.base.EventHandler.remove(_this.list, 'scroll', _this.virtualScroll);
                }
                if (_this.popupObj) {
                    _this.popupObj.destroy();
                }
                if (!_this.isDisposed && document.body.contains(_this.element)) {
                    _this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                _this.popupObj = null;
            },
            open: function () {
                sf.base.EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                if (_this.options.allowFiltering && _this.filterInput) {
                    _this.filterInput.focus();
                }
                if (_this.list.querySelector('li') && _this.list.querySelector('li').classList.contains(GROUP)) {
                    sf.base.EventHandler.add(_this.list, 'scroll', _this.setFloatingHeader, _this);
                }
            },
            targetExitViewport: function () {
                if (!sf.base.Browser.isDevice && !_this.isDisposed) {
                    _this.dotNetRef.invokeMethodAsync(HIDE);
                }
            }
        });
    };
    SfDropDownList.prototype.virtualScroll = function () {
        if (this.popupObj && this.popupObj.element) {
            var borderWidth = parseInt(getComputedStyle(this.popupObj.element).borderWidth, 10);
            borderWidth = borderWidth == 0 ? 1 : borderWidth;
            var isPopupOpen = this.popupObj.element.classList.contains('e-popup-open');
            if (((this.list.scrollTop + this.list.offsetHeight) + borderWidth >= this.list.scrollHeight) && isPopupOpen && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(VIRTUAL_HANDLER);
            }
        }
    };
    SfDropDownList.prototype.isEmptyList = function () {
        return !sf.base.isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    };
    SfDropDownList.prototype.setWidth = function () {
        var width = sf.base.formatUnit(this.options.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (sf.base.Browser.isDevice && (!this.options.allowFiltering)) {
            var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.element).paddingLeft, 10) +
                parseInt(getComputedStyle(this.element.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    };
    SfDropDownList.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!(!sf.base.isNullOrUndefined(this.popupObj) && sf.base.closest(target, '#' + this.popupObj.element.id)) &&
            !this.containerElement.contains(e.target)) {
            if (this.containerElement.classList.contains(INPUT_FOCUS) || this.isPopupOpen() && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(HIDE);
            }
        }
        else if (target !== this.element && !(this.options.allowFiltering && target === this.filterInput)
            && !(this.options.moduleName === 'SfComboBox' &&
                !this.options.allowFiltering && sf.base.Browser.isDevice && target === this.containerElement.querySelector('.e-ddl-icon'))) {
            e.preventDefault();
        }
    };
    SfDropDownList.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        if (this.isPopupOpen() && !closeEventArgs.cancel && this.popupObj) {
            var animModel = {
                name: 'FadeOut',
                duration: 20,
                delay: 0
            };
            this.popupObj.hide(new sf.base.Animation(animModel));
        }
    };
    SfDropDownList.prototype.setScrollPosition = function (e) {
        if (!sf.base.isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
                    this.scrollBottom();
                    break;
                default:
                    this.scrollTop();
                    break;
            }
        }
        else {
            this.scrollBottom(true);
        }
    };
    SfDropDownList.prototype.scrollBottom = function (isInitial) {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            var selectedLI = (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED));
            var currentOffset = this.list.offsetHeight;
            var groupBy = this.list.querySelector('li').classList.contains(GROUP);
            var nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            var boxRange = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    };
    SfDropDownList.prototype.scrollTop = function () {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            var selectedLI = (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED));
            var nextOffset = selectedLI.offsetTop - this.list.scrollTop;
            var groupBy = this.list.querySelector('li').classList.contains(GROUP);
            nextOffset = groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            var boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = selectedLI.offsetTop - (groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    };
    SfDropDownList.prototype.setHover = function (li) {
        if (li && !li.classList.contains(HOVER)) {
            this.removeHover();
            sf.base.addClass([li], HOVER);
        }
    };
    
    SfDropDownList.prototype.removeHover = function () {
        if (this.list) {
            var hoveredItem = this.list.querySelectorAll('.' + HOVER);
            if (hoveredItem && hoveredItem.length) {
                sf.base.removeClass(hoveredItem, HOVER);
            }
        }
    };
    SfDropDownList.prototype.isPopupOpen = function () {
        return this.popupObj && document.body.contains(this.popupObj.element);
    };
    return SfDropDownList;
}());
// tslint:disable
var DropDownList = {
    initialize: function (containerElement, element, dotnetRef, options) {
        if (element) {
            new SfDropDownList(containerElement, element, dotnetRef, options);
            if (element.blazor__instance) {
                element.blazor__instance.initialize();
            }
        }
    },
    renderPopup: function (element, popupElement, popupHolderEle, openEventArgs, options, dataItem) {
        if (element && element.blazor__instance && popupElement && popupHolderEle) {
            element.blazor__instance.renderPopup(popupElement, popupHolderEle, openEventArgs, options, dataItem);
        }
    },
    refreshPopup: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.refreshPopup();
        }
    },
    closePopup: function (element, closeEventArgs, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    updateScrollPosition: function (element, args) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setScrollPosition(args);
        }
    },
    getPageCount: function (popupEle) {
        var list = popupEle && popupEle.querySelector('.e-content');
        if (list) {
            var liHeight = list.classList.contains('e-nodata') ? null :
                getComputedStyle(list.querySelectorAll('.e-list-item')[0], null).getPropertyValue('height');
            return Math.round(list.getBoundingClientRect().height / parseInt(liHeight, 10));
        }
        return 0;
    },
    setAutoFillSelection: function (element, currentValue) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setAutoFillSelection(currentValue);
        }
    },
    removeFillSelection: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.removeFillSelection();
        }
    },
    focusIn: function (inputEle) {
        inputEle && inputEle.focus();
    },
    focusOut: function (inputEle) {
        inputEle && inputEle.blur();
    },
    destroy: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
};

return DropDownList;

}());
