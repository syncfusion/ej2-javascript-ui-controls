window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.MultiSelect = (function () {
'use strict';

var POPUP_CONTENT = 'e-content';
var LIST_ITEM = 'e-list-item';
var CLOSE_POPUP = 'ClosePopup';
var ITEM_FOCUS = 'e-item-focus';
var SELECTED = 'e-active';
var HIDE = 'Hide';
var ICON_ANIM = 'e-icon-anim';
var DDL_DEVICE = 'e-ddl-device';
var MOBILE_FILTER = 'e-ddl-device-filter';
var POPUP_FULL_SCREEN = 'e-popup-full-page';
var FIXED_HEAD = 'e-fixed-head';
var GROUP = 'e-list-group-item';
var GROUP_CHECKBOX = 'e-multiselect-group';
var INPUT_FOCUS = 'e-input-focus';
var REMAIN_WRAPPER = 'e-remain';
var DROP_DOWN_ICON = 'e-input-group-icon e-ddl-icon';
var CLEAR_ICON = 'e-clear-icon';
var TOTAL_COUNT_WRAPPER = 'e-delim-total';
var DELIM_HIDE = 'e-delim-hide';
var VIRTUAL_HANDLER = 'VirtualScrollHandler';
var DDL_HEADER = 'e-ddl-header';
var DDL_FOOTER = 'e-ddl-footer';
var SELECT_ALL_PARENT = 'e-selectall-parent';
var INPUT = 'e-input';
var BLURHANDLER = 'InvokeBlur';
var BLUR = 'blur';
var SfMultiSelect = /** @class */ (function () {
    // tslint:disable
    function SfMultiSelect(containerElement, childContainerElement, element, dotnetRef, options) {
        this.containerElement = containerElement;
        this.childContainerElement = childContainerElement;
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.isDisposed = false;
    }
    SfMultiSelect.prototype.initialize = function () {
        sf.base.EventHandler.add(window, 'resize', this.windowResize, this);
        sf.base.EventHandler.add(this.element, BLUR, this.blurHandler, this);
    };
    SfMultiSelect.prototype.blurHandler = function () {
        if (!this.isDisposed) {
            this.dotNetRef.invokeMethodAsync(BLURHANDLER);
        }
    };
    SfMultiSelect.prototype.getPopupHeight = function (listHeight, searchBoxHeight, tempEle) {
        var height = Math.round(tempEle.getBoundingClientRect().height);
        return (parseInt(listHeight, 10) - (height + searchBoxHeight)).toString() + 'px';
    };
    // tslint:disable
    SfMultiSelect.prototype.renderPopup = function (popupElement, popupHolderEle, openEventArgs, options, dataItem) {
        this.options = options;
        this.popupHolder = popupHolderEle;
        this.list = popupHolderEle.querySelector('.' + POPUP_CONTENT) || sf.base.select('.' + POPUP_CONTENT);
        this.liCollections = this.getItems();
        var listHeight = sf.base.formatUnit(this.options.popupHeight);
        document.body.appendChild(popupElement);
        popupElement.style.visibility = 'hidden';
        var searchBoxContainer;
        if (this.options.allowFiltering && this.options.mode === 'CheckBox') {
            this.filterInput = popupElement.querySelector('input.' + INPUT);
            searchBoxContainer = this.filterInput.parentElement;
            sf.base.EventHandler.add(this.filterInput, 'keypress', this.filterKeydown, this);
        }
        else {
            this.filterInput = this.element;
        }
        if (this.options.popupHeight !== 'auto') {
            var searchBoxHeight = 0;
            if (!sf.base.isNullOrUndefined(searchBoxContainer)) {
                searchBoxHeight = searchBoxContainer.parentElement.getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - searchBoxHeight).toString() + 'px';
            }
            var selectAllHeight = 0;
            var selectAllElement = popupElement.querySelector('.' + SELECT_ALL_PARENT);
            if (selectAllElement) {
                selectAllHeight = selectAllElement.getBoundingClientRect().height;
                listHeight = (parseInt(listHeight, 10) - selectAllHeight).toString() + 'px';
            }
            if (popupElement.querySelector('.' + DDL_HEADER)) {
                var header = popupElement.querySelector('.' + DDL_HEADER);
                listHeight = this.getPopupHeight(listHeight, searchBoxHeight, header);
            }
            if (popupElement.querySelector('.' + DDL_FOOTER)) {
                var footer = popupElement.querySelector('.' + DDL_FOOTER);
                listHeight = this.getPopupHeight(listHeight, searchBoxHeight, footer);
            }
            this.list.style.maxHeight = (parseInt(listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
            popupElement.style.maxHeight = sf.base.formatUnit(this.options.popupHeight);
        }
        else {
            popupElement.style.height = 'auto';
        }
        this.popupCreation(popupElement);
        if (sf.base.Browser.isDevice && this.options.mode === 'CheckBox' && this.options.allowFiltering) {
            this.popupObj.element.classList.add(DDL_DEVICE);
            this.popupObj.element.classList.add(MOBILE_FILTER);
            this.popupObj.position = { X: 0, Y: 0 };
            this.popupObj.dataBind();
            sf.base.attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
            sf.base.addClass([document.body, this.popupObj.element], POPUP_FULL_SCREEN);
            this.setSearchBoxPosition();
        }
        popupElement.style.visibility = 'visible';
        sf.base.addClass([popupElement], 'e-popup-close');
        sf.base.attributes(this.element, {
            'aria-expanded': 'true'
        });
        if (this.options.enableVirtualization) {
            sf.base.EventHandler.add(this.list, 'scroll', this.virtualScroll, this);
        }
        var animModel = {
            name: 'FadeIn',
            duration: 100
        };
        this.popupObj.show(new sf.base.Animation(animModel), this.options.zIndex === 1000 ? this.element : null);
    };
    SfMultiSelect.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
    };
    SfMultiSelect.prototype.filterKeydown = function (e) {
        if (this.filterInput.value === "" && e.keyCode === 32 && this.list.querySelector('.' + ITEM_FOCUS)) {
            e.preventDefault();
        }
    };
    SfMultiSelect.prototype.setWidth = function () {
        var width = sf.base.formatUnit(this.options.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.containerElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    SfMultiSelect.prototype.popupCreation = function (popupElement) {
        var _this = this;
        this.popupContainer = popupElement;
        this.popupObj = new sf.popups.Popup(this.popupContainer, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.containerElement, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
            enableRtl: this.options.enableRtl, position: { X: 'left', Y: 'bottom' },
            zIndex: this.options.zIndex,
            close: function () {
                sf.base.EventHandler.remove(_this.list, 'scroll', _this.setFloatingHeader);
                sf.base.removeClass([_this.containerElement], ICON_ANIM);
                _this.fixedHeaderElement = null;
                _this.popupHolder.appendChild(_this.popupContainer);
                sf.base.EventHandler.remove(document, 'mousedown', _this.onDocumentClick);
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
                if (!sf.base.isNullOrUndefined(_this.isDisposed) && !_this.isDisposed) {
                    _this.dotNetRef.invokeMethodAsync(CLOSE_POPUP);
                }
                _this.popupObj = null;
            },
            open: function () {
                sf.base.EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                if (_this.options.allowFiltering && _this.filterInput) {
                    _this.filterInput.focus();
                }
                if (_this.list.querySelector('li') && _this.list.querySelector('li').classList.contains(GROUP) && !popupElement.classList.contains(GROUP_CHECKBOX)) {
                    sf.base.EventHandler.add(_this.list, 'scroll', _this.setFloatingHeader, _this);
                }
                _this.setScrollPosition();
            },
            targetExitViewport: function () {
                if (!sf.base.Browser.isDevice && !_this.isDisposed) {
                    _this.dotNetRef.invokeMethodAsync(HIDE);
                }
            }
        });
    };
    SfMultiSelect.prototype.virtualScroll = function () {
        if (this.popupObj && this.popupObj.element) {
            var borderWidth = parseInt(getComputedStyle(this.popupObj.element).borderWidth, 10);
            borderWidth = borderWidth == 0 ? 1 : borderWidth;
            var isPopupOpen = this.popupObj.element.classList.contains('e-popup-open');
            if (((this.list.scrollTop + this.list.offsetHeight) + borderWidth >= this.list.scrollHeight) && isPopupOpen && !this.isDisposed) {
                this.dotNetRef.invokeMethodAsync(VIRTUAL_HANDLER);
            }
        }
    };
    SfMultiSelect.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!(!sf.base.isNullOrUndefined(this.popupObj) && sf.base.closest(target, '#' + this.popupObj.element.id)) &&
            !this.containerElement.contains(e.target)) {
            if (!this.isDisposed && this.containerElement.classList.contains(INPUT_FOCUS) || this.isPopupOpen()) {
                this.dotNetRef.invokeMethodAsync(HIDE);
            }
        }
        else if (target !== this.element && !(this.options.allowFiltering && this.options.mode === 'CheckBox' && target === this.filterInput)
            && !(!this.options.allowFiltering && sf.base.Browser.isDevice && target === this.containerElement.querySelector('.e-ddl-icon'))) {
            e.preventDefault();
        }
    };
    SfMultiSelect.prototype.listScroll = function () {
        this.filterInput.blur();
    };
    SfMultiSelect.prototype.setFloatingHeader = function (e) {
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
    SfMultiSelect.prototype.isFilterLayout = function () {
        return this.options.mode === 'CheckBox' && this.options.allowFiltering;
    };
    SfMultiSelect.prototype.setFixedHeader = function () {
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
    SfMultiSelect.prototype.scrollStop = function (e) {
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
    SfMultiSelect.prototype.closePopup = function (closeEventArgs, options) {
        this.options = options;
        if (this.isPopupOpen() && !closeEventArgs.cancel && this.popupObj) {
            var animModel = {
                name: 'FadeOut',
                duration: 100,
                delay: 0
            };
            this.popupObj.hide(new sf.base.Animation(animModel));
        }
    };
    SfMultiSelect.prototype.setScrollPosition = function (action) {
        if (!sf.base.isNullOrUndefined(action) && action !== '') {
            switch (action) {
                case 'PageDown':
                case 'ArrowDown':
                case 'End':
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
    SfMultiSelect.prototype.scrollBottom = function (isInitial) {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            var selectedLI = this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED);
            var currentOffset = this.list.offsetHeight;
            var groupBy = this.list.querySelector('li').classList.contains(GROUP);
            var nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            var boxRange = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    };
    SfMultiSelect.prototype.scrollTop = function () {
        if (this.list && (this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED))) {
            var selectedLI = this.list.querySelector('.' + ITEM_FOCUS) || this.list.querySelector('.' + SELECTED);
            var nextOffset = selectedLI.offsetTop - this.list.scrollTop;
            var groupBy = this.list.querySelector('li').classList.contains(GROUP);
            nextOffset = groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            var boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
            if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = selectedLI.offsetTop - (groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    };
    SfMultiSelect.prototype.windowResize = function () {
        if (this.options.mode !== 'Box' && this.viewContainer) {
            this.updateDelimViews(this.viewContainer, this.options);
        }
    };
    SfMultiSelect.prototype.updateDelimViews = function (viewElement, options) {
        this.options = options;
        this.viewContainer = viewElement;
        if (this.viewContainer && this.viewContainer.previousElementSibling) {
            this.viewContainer.previousElementSibling.classList.add(DELIM_HIDE);
        }
        var delimValues = this.options.delimValue;
        if (!sf.base.isNullOrUndefined(delimValues) && delimValues.length > 0) {
            this.viewContainer.classList.remove(DELIM_HIDE);
        }
        else {
            this.viewContainer.innerHTML = '';
        }
        this.dropIconEle = this.containerElement.querySelector('.' + DROP_DOWN_ICON);
        this.clearIconEle = this.containerElement.querySelector('.' + CLEAR_ICON);
        this.viewContainer.classList.remove(TOTAL_COUNT_WRAPPER);
        if (delimValues && delimValues.length > 0) {
            var data = '';
            var temp = void 0;
            var tempData = void 0;
            var tempIndex = 1;
            var containerWidth = void 0;
            var remaining = void 0;
            var downIconWidth = 0;
            var clearIconWidth = 0;
            var overAllContainer = void 0;
            this.viewContainer.innerHTML = '';
            var raminElement = sf.base.createElement('span', {
                className: REMAIN_WRAPPER
            });
            raminElement.innerHTML = this.options.overFlowContent;
            this.viewContainer.appendChild(raminElement);
            var remainSize = raminElement.offsetWidth;
            sf.base.remove(raminElement);
            if (this.dropIconEle) {
                downIconWidth = this.dropIconEle.offsetWidth +
                    parseInt(window.getComputedStyle(this.dropIconEle).marginRight, 10);
            }
            if (this.clearIconEle) {
                clearIconWidth = this.clearIconEle.offsetWidth +
                    parseInt(window.getComputedStyle(this.clearIconEle).marginRight, 10);
            }
            if (!sf.base.isNullOrUndefined(delimValues)) {
                for (var index = 0; !sf.base.isNullOrUndefined(delimValues[index]); index++) {
                    data += (index === 0) ? '' : this.options.delimiterChar + ' ';
                    temp = delimValues[index];
                    data += temp;
                    temp = this.viewContainer.innerHTML;
                    this.viewContainer.innerHTML = data;
                    containerWidth = this.viewContainer.offsetWidth +
                        parseInt(window.getComputedStyle(this.viewContainer).paddingRight, 10);
                    overAllContainer = this.childContainerElement.offsetWidth -
                        parseInt(window.getComputedStyle(this.childContainerElement).paddingLeft, 10) -
                        parseInt(window.getComputedStyle(this.childContainerElement).paddingRight, 10);
                    if ((containerWidth + downIconWidth + clearIconWidth) > overAllContainer) {
                        if (!sf.base.isNullOrUndefined(tempData) && tempData !== '') {
                            temp = tempData;
                            index = tempIndex + 1;
                        }
                        this.viewContainer.innerHTML = temp;
                        remaining = delimValues.length - index;
                        containerWidth = this.viewContainer.offsetWidth;
                        while (((containerWidth + remainSize + downIconWidth) > overAllContainer) && containerWidth !== 0
                            && this.viewContainer.innerHTML !== '') {
                            var textArr = this.viewContainer.innerHTML.split(this.options.delimiterChar);
                            var totalLength = textArr.length;
                            textArr.pop();
                            var remainTxtLength = textArr.length;
                            this.viewContainer.innerHTML = textArr.join(this.options.delimiterChar);
                            if (remainTxtLength !== totalLength && remainTxtLength !== 0) {
                                remaining = remaining - remainTxtLength + totalLength;
                            }
                            if (this.viewContainer.innerHTML === '') {
                                remaining++;
                            }
                            containerWidth = this.viewContainer.offsetWidth;
                        }
                        break;
                    }
                    else if ((containerWidth + remainSize + downIconWidth + clearIconWidth) <= overAllContainer) {
                        tempData = data;
                        tempIndex = index;
                    }
                    else if (index === 0) {
                        tempData = '';
                        tempIndex = -1;
                    }
                }
                if (remaining > 0) {
                    var totalWidth = overAllContainer - downIconWidth - clearIconWidth;
                    var remainEle = this.updateRemainElement(raminElement, this.viewContainer, remaining, totalWidth);
                    this.viewContainer.appendChild(remainEle);
                    this.updateRemainWidth(this.viewContainer, totalWidth);
                }
            }
            else {
                this.viewContainer.innerHTML = '';
                this.viewContainer.style.display = 'none';
            }
        }
    };
    SfMultiSelect.prototype.updateRemainWidth = function (viewContainer, totalWidth) {
        if (viewContainer.classList.contains(TOTAL_COUNT_WRAPPER) && totalWidth < (viewContainer.offsetWidth +
            parseInt(window.getComputedStyle(viewContainer).paddingLeft, 10)
            + parseInt(window.getComputedStyle(viewContainer).paddingLeft, 10))) {
            viewContainer.style.width = totalWidth + 'px';
        }
    };
    SfMultiSelect.prototype.updateRemainElement = function (raminElement, viewContainer, remaining, totalWidth) {
        if (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3 && viewContainer.firstChild.nodeValue === '') {
            viewContainer.removeChild(viewContainer.firstChild);
        }
        raminElement.innerHTML = '';
        var remainTemp = this.options.overFlowContent.replace('${count}', remaining.toString());
        var totalTemp = this.options.totalCountContent.replace('${count}', remaining.toString());
        raminElement.innerHTML = (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3) ?
            remainTemp : totalTemp;
        if (viewContainer.firstChild && viewContainer.firstChild.nodeType === 3) {
            viewContainer.classList.remove(TOTAL_COUNT_WRAPPER);
        }
        else {
            viewContainer.classList.add(TOTAL_COUNT_WRAPPER);
            this.updateRemainWidth(viewContainer, totalWidth);
        }
        return raminElement;
    };
    SfMultiSelect.prototype.isPopupOpen = function () {
        return this.popupObj && document.body.contains(this.popupObj.element);
    };
    SfMultiSelect.prototype.getItems = function () {
        return this.list ? this.list.querySelectorAll('.' + LIST_ITEM) : [];
    };
    SfMultiSelect.prototype.refreshPopup = function () {
        if (this.isPopupOpen()) {
            this.popupObj.refreshPosition(this.containerElement);
        }
    };
    return SfMultiSelect;
}());
// tslint:disable
var MultiSelect = {
    initialize: function (containerElement, childContainerElement, element, dotnetRef, options) {
        if (element) {
            new SfMultiSelect(containerElement, childContainerElement, element, dotnetRef, options);
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
    closePopup: function (element, closeEventArgs, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    refreshPopup: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.refreshPopup();
        }
    },
    updateScrollPosition: function (element, action) {
        if (element && element.blazor__instance) {
            element.blazor__instance.setScrollPosition(action);
        }
    },
    getPageCount: function (popupEle) {
        var list = popupEle && popupEle.querySelector('.e-content');
        if (list) {
            var liHeight = list.classList.contains('e-nodata') ? null :
                getComputedStyle(list.querySelectorAll('.e-list-item:not(.e-hide-listitem)')[0], null).getPropertyValue('height');
            return Math.round(list.getBoundingClientRect().height / parseInt(liHeight, 10));
        }
        return 0;
    },
    updateDelimViews: function updateDelimViews(element, viewElement, options) {
        if (element && element.blazor__instance) {
            element.blazor__instance.updateDelimViews(viewElement, options);
        }
    },
    destroy: function (element, popupElement, popupHolderEle, closeEventArgs, options) {
        if (element && element.blazor__instance && popupElement && popupElement instanceof HTMLElement && popupHolderEle) {
            element.blazor__instance.isDisposed = true;
            element.blazor__instance.closePopup(closeEventArgs, options);
        }
    },
    focusIn: function (inputEle) {
        inputEle && inputEle.focus();
    },
    focusOut: function (inputEle) {
        inputEle && inputEle.blur();
    }
};

return MultiSelect;

}());
