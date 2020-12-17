window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.ListView = (function () {
'use strict';

var effectsConfig = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
var effectsRTLConfig = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
var SWIPEVELOCITY = 0.5;
var DATASOURCEKEY = 'defaultData_Key';
var HOVER = 'e-hover';
var FOCUSED = 'e-focused';
var LISTITEM = 'e-list-item';
var GROUPLISTITEM = 'e-list-group-item';
var HASCHILD = 'e-has-child';
var HEADER = 'e-list-header';
var HEADERTEXT = 'e-headertext';
var DISABLE = 'e-disabled';
var BACKICON = 'e-icon-back';
var CHECKBOXWRAPPER = 'e-checkbox-wrapper';
var CHECKED = 'e-check';
var CHECKBOXICON = 'e-frame';
var NONE = 'none';
var VIRTUALULCONTAINER = 'e-list-virtualcontainer';
var SfListView = /** @class */ (function () {
    // tslint:disable
    function SfListView(element, dotnetRef, properties, enableSelectEvent) {
        this.dataSourceLevel = [DATASOURCEKEY];
        this.curDSKey = DATASOURCEKEY;
        this.isWindow = false;
        this.liDifference = 0;
        this.liHeight = 0;
        this.virtualListDifference = 0;
        // tslint:enable
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.showCheckBox = properties.ShowCheckBox;
        this.showHeader = properties.ShowHeader;
        this.enable = properties.Enabled;
        this.curUlElement = element.querySelector('ul');
        this.enableVirtualization = properties.EnableVirtualization;
        this.isWindow = properties.Height ? false : true;
        this.enableSelectEvent = enableSelectEvent;
        this.height = properties.Height;
        this.headerTitleInfo = [properties.HeaderTitle];
        this.selectedItems = { defaultData_Key: properties.SelectedElementIdInfo };
        this.enableRtl = properties.EnableRtl;
        this.animation = properties.Animation;
        this.isTemplate = properties.Template;
        this.element.blazor__instance = this;
    }
    SfListView.prototype.initialize = function () {
        if (this.enableVirtualization) {
            if (this.isWindow) {
                this.dotNetRef.invokeMethodAsync('GetComponenetHeight', window.innerHeight);
            }
            else if (this.height.indexOf('%') !== -1) {
                var parentContainerHeight = this.element.parentElement.getBoundingClientRect().height;
                this.dotNetRef.invokeMethodAsync('GetComponenetHeight', ((parentContainerHeight / 100) * parseFloat(this.height)));
            }
            this.updateLiElementHeight();
        }
        this.headerElement = this.element.querySelector('.' + HEADERTEXT);
        this.animationObject = new sf.base.Animation(this.animateOptions);
        this.wireEvents();
    };
    SfListView.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'keydown', this.keyActionHandler, this);
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.removeFocus, this);
        this.touchModule = new sf.base.Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
        if (this.enableVirtualization) {
            sf.base.EventHandler.add(this.element, 'scroll', this.scrollHandler, this);
            if (this.isWindow) {
                window.addEventListener('scroll', this.scrollHandler.bind(this));
            }
        }
        else {
            sf.base.EventHandler.add(this.element, 'mouseover', this.mouseHoverHandler, this);
            sf.base.EventHandler.add(this.element, 'mouseout', this.mouseOutHandler, this);
        }
    };
    SfListView.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyActionHandler);
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'focusout', this.removeFocus);
        if (this.enableVirtualization) {
            sf.base.EventHandler.remove(this.element, 'scroll', this.scrollHandler);
            if (this.isWindow) {
                window.removeEventListener('scroll', this.scrollHandler.bind(this));
            }
        }
        else {
            sf.base.EventHandler.remove(this.element, 'mouseover', this.mouseHoverHandler);
            sf.base.EventHandler.remove(this.element, 'mouseout', this.mouseOutHandler);
        }
        this.touchModule.destroy();
    };
    SfListView.prototype.swipeActionHandler = function (e) {
        if (e.swipeDirection === 'Right' && e.velocity > SWIPEVELOCITY && e.originalEvent.type === 'touchend') {
            if (this.showCheckBox && this.dataSourceLevel[this.dataSourceLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
    };
    SfListView.prototype.showHideItem = function (item, display) {
        var li = this.getLi(item);
        if (li) {
            li.style.display = display;
        }
    };
    SfListView.prototype.enableState = function (item, isEnable) {
        var li = this.getLi(item);
        if (li) {
            isEnable ? li.classList.remove('e-disabled') : li.classList.add('e-disabled');
        }
    };
    SfListView.prototype.getLi = function (item) {
        var li;
        if (this.element) {
            li = this.element.querySelector('[data-uid="' + item.id + '"]');
        }
        return li;
    };
    SfListView.prototype.scrollHandler = function (e) {
        var listDiff;
        // tslint:disable
        var scrollTop = this.isWindow ? e.target.documentElement.scrollTop : e.target.scrollTop;
        // tslint:enable
        if (!this.liHeight) {
            this.updateLiElementHeight();
        }
        listDiff = Math.round(scrollTop / this.liHeight);
        if (listDiff - this.liDifference >= this.virtualListDifference || listDiff - this.liDifference <= (-1)) {
            var focuseElement = this.curUlElement.querySelector('.' + FOCUSED);
            if (focuseElement) {
                this.focusedElementId = focuseElement.getAttribute('data-uid');
            }
            var virtualElementContainer = this.element.querySelector('.' + VIRTUALULCONTAINER);
            if (virtualElementContainer) {
                virtualElementContainer.style.top = (((listDiff - 1) * this.liHeight) < 0) ? '0px' : (listDiff - 2) * this.liHeight + 'px';
                this.liDifference = listDiff;
                this.dotNetRef.invokeMethodAsync('VirtualScrolling', (listDiff - 2));
            }
        }
    };
    SfListView.prototype.updateLiElementHeight = function () {
        var virtualElementContainer = this.element.querySelector('.' + VIRTUALULCONTAINER);
        if (virtualElementContainer) {
            if (!this.curUlElement) {
                this.curUlElement = this.element.querySelector('ul');
            }
            var liElement = virtualElementContainer.children[0];
            if (liElement) {
                this.liHeight = liElement.getBoundingClientRect().height;
                this.dotNetRef.invokeMethodAsync('UpdateLiElementHeight', this.liHeight);
            }
        }
    };
    SfListView.prototype.updateElementDifference = function (listDifference) {
        this.virtualListDifference = listDifference;
    };
    SfListView.prototype.selectItem = function (item) {
        var liItem = this.getLi(item);
        if (this.showCheckBox) {
            this.setChecked(liItem, liItem.querySelector('.' + CHECKBOXWRAPPER));
        }
        else {
            sf.base.isNullOrUndefined(liItem) ? this.removeFocus() : this.setSelectLI(liItem, null);
            this.selectedItems[this.curDSKey][0] = liItem.getAttribute('data-uid');
        }
    };
    SfListView.prototype.clickHandler = function (e) {
        if (this.curUlElement) {
            var target = e.target;
            var classList = target.classList;
            if (classList.contains(BACKICON) || classList.contains(HEADERTEXT)) {
                this.back();
            }
            else {
                var li = sf.base.closest(target.parentNode, '.' + LISTITEM);
                if (li === null) {
                    li = target;
                }
                if (!li.classList.contains(DISABLE) && this.enable) {
                    this.removeFocus();
                    if (!this.showCheckBox) {
                        if (this.curUlElement.querySelector('.' + FOCUSED)) {
                            this.curUlElement.querySelector('.' + FOCUSED).classList.remove(FOCUSED);
                        }
                        if (li.classList.contains(HASCHILD)) {
                            this.setSelectLI(li, e);
                        }
                        else {
                            li.classList.add(FOCUSED);
                            this.selectedItems[this.curDSKey][0] = li.getAttribute('data-uid');
                        }
                    }
                    else if (e.target.classList.contains(CHECKBOXICON)) {
                        this.checkUncheckItem(li);
                    }
                    else if (li.classList.contains(HASCHILD)) {
                        this.removeHover();
                        this.removeFocus();
                        this.setSelectLI(li, e);
                    }
                    else {
                        this.checkUncheckItem(li);
                    }
                    if (this.enableSelectEvent) {
                        this.getSelectEventData(li, e);
                    }
                }
            }
        }
    };
    SfListView.prototype.checkUncheckItem = function (item) {
        item.classList.add(FOCUSED);
        (!item.querySelector('.' + CHECKED)) ? this.setChecked(item, item.querySelector('.' + CHECKBOXWRAPPER)) : this.uncheckItem(item);
    };
    SfListView.prototype.back = function () {
        if (this.dataSourceLevel.length > 1) {
            var ulElement = this.element.querySelectorAll('ul');
            var headerElement = this.element.querySelector('.' + HEADER);
            for (var i = 0; i < ulElement.length; i++) {
                if (this.dataSourceLevel.length > 2) {
                    if (ulElement[i].getAttribute('pid') === this.dataSourceLevel[this.dataSourceLevel.length - 2]) {
                        this.switchView(this.curUlElement, ulElement[i], true);
                        this.curUlElement = ulElement[i];
                    }
                    else {
                        ulElement[i].style.display = NONE;
                    }
                }
                else if (ulElement[i].getAttribute('pid') === null) {
                    this.switchView(this.curUlElement, ulElement[i], true);
                    this.curUlElement = ulElement[i];
                }
                else {
                    ulElement[i].style.display = NONE;
                }
            }
            this.dataSourceLevel.pop();
            if (!this.isTemplate) {
                this.headerTitleInfo.pop();
                if (this.headerElement) {
                    this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1];
                }
            }
            this.curDSKey = this.dataSourceLevel[this.dataSourceLevel.length - 1];
            if (this.dataSourceLevel.length === 1 && headerElement) {
                headerElement.children[0].style.display = NONE;
            }
        }
    };
    SfListView.prototype.setHoverLI = function (li) {
        if (!this.element.classList.contains(DISABLE) && !li.classList.contains(DISABLE)) {
            li.classList.add(HOVER);
        }
    };
    SfListView.prototype.mouseHoverHandler = function (e) {
        var currentLiElemet = sf.base.closest(e.target.parentNode, '.' + LISTITEM);
        if (currentLiElemet) {
            this.setHoverLI(currentLiElemet);
        }
    };
    SfListView.prototype.mouseOutHandler = function (e) {
        this.removeHover();
    };
    SfListView.prototype.removeHover = function () {
        var hoverLI = this.element.querySelector('.' + HOVER);
        if (hoverLI) {
            hoverLI.classList.remove(HOVER);
        }
    };
    SfListView.prototype.removeFocus = function () {
        if (!this.curUlElement) {
            this.curUlElement = this.element.querySelector('ul');
        }
        var focusedLI = this.curUlElement.querySelectorAll('.' + FOCUSED);
        for (var _i = 0, focusedLI_1 = focusedLI; _i < focusedLI_1.length; _i++) {
            var element = focusedLI_1[_i];
            element.classList.remove(FOCUSED);
        }
    };
    SfListView.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(LISTITEM)
            && !li.classList.contains(GROUPLISTITEM)
            && !li.classList.contains(DISABLE));
    };
    SfListView.prototype.setSelectLI = function (li, e) {
        if (this.enable && this.isValidLI(li) && !li.classList.contains(FOCUSED)) {
            this.removeFocus();
            this.addAriaAttribute(true, li);
            this.removeHover();
            if (li.classList.contains(HASCHILD)) {
                this.renderSubList(li);
            }
            if (this.enableSelectEvent) {
                this.getSelectEventData(li, e);
            }
        }
    };
    SfListView.prototype.addAriaAttribute = function (isSelected, element) {
        if (isSelected) {
            element.classList.add(FOCUSED);
        }
        else if (!this.showCheckBox) {
            element.classList.remove(FOCUSED);
        }
        element.setAttribute('aria-selected', isSelected.toString());
    };
    SfListView.prototype.renderSubList = function (li) {
        var liElement = li;
        var uID = li.getAttribute('data-uid');
        var headerElement = this.element.querySelector('.' + HEADER);
        li.classList.remove(FOCUSED);
        li.classList.add(FOCUSED);
        if (this.showHeader && headerElement) {
            headerElement.children[0].style.display = null;
        }
        if (liElement.classList.contains(HASCHILD) && uID) {
            var ulElement = this.element.querySelector('[pid=\'' + uID + '\']');
            if (!ulElement) {
                var args = { ElementId: uID, Key: this.curDSKey };
                // tslint:disable
                this.dotNetRef.invokeMethodAsync('ListChildDataSource', args);
                // tslint:enable   
            }
            else {
                this.renderChildList(uID);
            }
            if (!this.isTemplate) {
                this.headerTitleInfo.push(liElement.innerText.trim());
                if (this.headerElement) {
                    this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1];
                }
            }
            this.dataSourceLevel.push(uID);
            this.curDSKey = uID;
        }
    };
    SfListView.prototype.renderChildList = function (id, selectedItems) {
        var ulElement = this.element.querySelectorAll('ul');
        if (!ulElement[ulElement.length - 1].getAttribute('pid')) {
            ulElement[ulElement.length - 1].setAttribute('pid', id);
        }
        for (var i = 0; i < ulElement.length; i++) {
            if (ulElement[i].getAttribute('pid') === id) {
                this.switchView(this.curUlElement, ulElement[i], false);
                this.curUlElement = ulElement[i];
                if (selectedItems) {
                    this.selectedItems[id] = selectedItems;
                }
            }
        }
    };
    SfListView.prototype.keyActionHandler = function (e) {
        switch (e.keyCode) {
            case 36:
                this.homeKeyHandler(e);
                break;
            case 35:
                this.homeKeyHandler(e, true);
                break;
            case 40:
                this.arrowKeyHandler(e);
                break;
            case 38:
                this.arrowKeyHandler(e, true);
                break;
            case 13:
                this.enterKeyHandler(e);
                break;
            case 8:
                if (this.showCheckBox && this.curDSKey) {
                    this.uncheckAllItems();
                }
                this.back();
                break;
            case 32:
                this.spaceKeyHandler(e);
                break;
        }
    };
    SfListView.prototype.homeKeyHandler = function (e, end) {
        var focusedElement = this.curUlElement.querySelector('.' + FOCUSED);
        if (focusedElement) {
            focusedElement.classList.remove(FOCUSED);
        }
        var index = !end ? 0 : this.curUlElement.children.length - 1;
        var liElement = this.curUlElement.children[index];
        this.addAriaAttribute(true, liElement);
        liElement.classList.add(FOCUSED);
        if (this.curUlElement.children[index]) {
            this.element.setAttribute('aria-activedescendant', this.curUlElement.children[index].id.toString());
        }
        else {
            this.element.removeAttribute('aria-activedescendant');
        }
        if (this.enableSelectEvent) {
            this.getSelectEventData(liElement, e);
        }
    };
    SfListView.prototype.onArrowKeyDown = function (e, previouse) {
        var siblingLI;
        var liElement;
        var hasChildElement = !sf.base.isNullOrUndefined(this.curUlElement.querySelector('.' + HASCHILD)) ? true : false;
        if (hasChildElement || this.showCheckBox) {
            liElement = this.curUlElement.querySelector('.' + FOCUSED) || this.curUlElement.querySelector('.' + FOCUSED);
            siblingLI = this.getSiblingLI(this.curUlElement.querySelectorAll('.' + LISTITEM), liElement, previouse);
            if (!sf.base.isNullOrUndefined(siblingLI)) {
                if (liElement) {
                    liElement.classList.remove(FOCUSED);
                    if (!this.showCheckBox) {
                        liElement.classList.remove(FOCUSED);
                    }
                }
                if (siblingLI.classList.contains(HASCHILD) || this.showCheckBox) {
                    siblingLI.classList.add(FOCUSED);
                }
                else {
                    this.setSelectLI(siblingLI, e);
                }
            }
        }
        else {
            liElement = this.curUlElement.querySelector('.' + FOCUSED);
            siblingLI = this.getSiblingLI(this.curUlElement.querySelectorAll('.' + LISTITEM), liElement, previouse);
            this.setSelectLI(siblingLI, e);
        }
        if (siblingLI) {
            this.element.setAttribute('aria-activedescendant', siblingLI.id.toString());
        }
        else {
            this.element.removeAttribute('aria-activedescendant');
        }
        return siblingLI;
    };
    SfListView.prototype.getSiblingLI = function (elementArray, element, isPrevious) {
        var licollection = Array.prototype.slice.call(elementArray);
        var curIndex = licollection.indexOf(element);
        return isPrevious ? licollection[curIndex - 1] : licollection[curIndex + 1];
    };
    SfListView.prototype.arrowKeyHandler = function (e, prev) {
        e.preventDefault();
        if (this.curUlElement) {
            var siblingLI = this.onArrowKeyDown(e, prev);
            var elementTop = this.element.getBoundingClientRect().top;
            var elementHeight = this.element.getBoundingClientRect().height;
            var heightDiff = void 0;
            if (siblingLI) {
                var siblingTop = siblingLI.getBoundingClientRect().top;
                var siblingHeight = siblingLI.getBoundingClientRect().height;
                if (!prev) {
                    var height = this.isWindow ? window.innerHeight : elementHeight;
                    heightDiff = this.isWindow ? (siblingTop + siblingHeight) :
                        ((siblingTop - elementTop) + siblingHeight);
                    if (heightDiff > height) {
                        this.isWindow ? window.scroll(0, pageYOffset + (heightDiff - height)) :
                            this.element.scrollTop = this.element.scrollTop + (heightDiff - height);
                    }
                }
                else {
                    heightDiff = this.isWindow ? siblingTop : (siblingTop - elementTop);
                    if (heightDiff < 0) {
                        this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                            this.element.scrollTop = this.element.scrollTop + heightDiff;
                    }
                }
            }
        }
    };
    SfListView.prototype.enterKeyHandler = function (e) {
        if (this.curUlElement) {
            var li = this.curUlElement.querySelector('.' + FOCUSED);
            if ((this.curUlElement.querySelector('.' + HASCHILD)) && li) {
                li.classList.remove(FOCUSED);
                if (this.showCheckBox) {
                    this.removeFocus();
                    this.removeHover();
                }
                this.setSelectLI(li, e);
            }
        }
    };
    SfListView.prototype.checkAllItems = function () {
        this.updateCheckBoxState(true);
    };
    SfListView.prototype.uncheckAllItems = function () {
        this.updateCheckBoxState(false);
    };
    SfListView.prototype.updateCheckBoxState = function (isChecked) {
        if (this.showCheckBox) {
            var liCollection = this.curUlElement.querySelectorAll('li');
            var liElementCount = !this.enableVirtualization ?
                this.curUlElement.childElementCount : this.curUlElement.querySelector('.' + VIRTUALULCONTAINER).childElementCount;
            for (var i = 0; i < liElementCount; i++) {
                var checkIcon = liCollection[i].querySelector('.' + CHECKBOXICON);
                if (checkIcon) {
                    if (isChecked && !checkIcon.classList.contains(CHECKED)) {
                        this.checkItem(liCollection[i]);
                    }
                    else if (checkIcon.classList.contains(CHECKED)) {
                        this.uncheckItem(liCollection[i]);
                    }
                }
            }
        }
    };
    SfListView.prototype.checkItem = function (item) {
        this.toggleCheckBox(item, true);
    };
    SfListView.prototype.getCheckData = function (item, isCheck) {
        var liItem = this.curUlElement.querySelector('[data-uid=\'' + item.id + '\']');
        isCheck ? this.checkItem(liItem) : this.uncheckItem(liItem);
    };
    SfListView.prototype.spaceKeyHandler = function (e) {
        if (this.enable && this.showCheckBox && this.curUlElement) {
            var li = this.curUlElement.querySelector('.' + FOCUSED);
            if (!sf.base.isNullOrUndefined(li) && sf.base.isNullOrUndefined(li.querySelector('.' + CHECKED))) {
                this.setChecked(li, li.querySelector('.' + CHECKBOXWRAPPER));
            }
            else {
                this.uncheckItem(li);
            }
            if (this.enableSelectEvent) {
                this.getSelectEventData(li, e);
            }
        }
    };
    SfListView.prototype.setChecked = function (item, checkboxElement) {
        this.removeFocus();
        item.classList.add(FOCUSED);
        this.addAriaAttribute(true, item);
        if (checkboxElement) {
            checkboxElement.querySelector('.' + CHECKBOXICON).classList.add(CHECKED);
            checkboxElement.setAttribute('aria-checked', 'true');
        }
        if (this.selectedItems[this.curDSKey] && this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')) === -1) {
            this.selectedItems[this.curDSKey].push(item.getAttribute('data-uid'));
        }
    };
    SfListView.prototype.toggleCheckBox = function (item, isChecked) {
        if (this.showCheckBox) {
            var liElement = item;
            if (!sf.base.isNullOrUndefined(liElement)) {
                var checkboxIconElement = liElement.querySelector('.' + CHECKBOXICON);
                this.addAriaAttribute(isChecked, liElement);
                if (!sf.base.isNullOrUndefined(checkboxIconElement)) {
                    isChecked ? checkboxIconElement.classList.add(CHECKED) : checkboxIconElement.classList.remove(CHECKED);
                    checkboxIconElement.parentElement.setAttribute('aria-checked', isChecked ? 'true' : 'false');
                }
            }
        }
    };
    SfListView.prototype.uncheckItem = function (item) {
        if (this.selectedItems[this.curDSKey] && this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')) !== -1) {
            this.selectedItems[this.curDSKey].splice(this.selectedItems[this.curDSKey].indexOf(item.getAttribute('data-uid')), 1);
        }
        this.toggleCheckBox(item, false);
    };
    SfListView.prototype.addCheckClass = function () {
        if (!this.curUlElement) {
            this.curUlElement = this.element.querySelector('ul');
        }
        var liCollection = this.enableVirtualization ?
            this.curUlElement.querySelector('.' + VIRTUALULCONTAINER).children : this.curUlElement.children;
        var selectedItemsId = this.selectedItems[this.curDSKey];
        for (var i = 0; i < liCollection.length; i++) {
            if (!this.showCheckBox) {
                if (selectedItemsId[0] === liCollection[i].getAttribute('data-uid')) {
                    liCollection[i].classList.add(FOCUSED);
                }
                else {
                    liCollection[i].classList.remove(FOCUSED);
                }
            }
            else {
                if (this.focusedElementId) {
                    this.focusedElementId === liCollection[i].getAttribute('data-uid') ?
                        liCollection[i].classList.add(FOCUSED) : liCollection[i].classList.remove(FOCUSED);
                }
                if (selectedItemsId.length > 0) {
                    if (selectedItemsId.indexOf(liCollection[i].getAttribute('data-uid')) !== -1) {
                        this.toggleCheckBox(liCollection[i], true);
                    }
                    else {
                        this.toggleCheckBox(liCollection[i], false);
                    }
                }
            }
        }
        for (var i = 0; i < liCollection.length; i++) {
            if (!this.showCheckBox) {
                if (selectedItemsId && selectedItemsId[0] === liCollection[i].getAttribute('data-uid')) {
                    liCollection[i].classList.add(FOCUSED);
                }
                else {
                    liCollection[i].classList.remove(FOCUSED);
                }
            }
            else {
                if (this.focusedElementId) {
                    this.focusedElementId === liCollection[i].getAttribute('data-uid') ?
                        liCollection[i].classList.add(FOCUSED) : liCollection[i].classList.remove(FOCUSED);
                }
                if (selectedItemsId.length > 0) {
                    if (selectedItemsId.indexOf(liCollection[i].getAttribute('data-uid')) !== -1) {
                        this.toggleCheckBox(liCollection[i], true);
                    }
                    else {
                        this.toggleCheckBox(liCollection[i], false);
                    }
                }
            }
        }
    };
    
    SfListView.prototype.getSelectedItems = function () {
        return { ElementId: this.selectedItems[this.curDSKey], Key: this.curDSKey };
    };
    
    SfListView.prototype.getSelectEventData = function (liElement, event) {
        var checked = (liElement).querySelector('.' + CHECKED) ? true : false;
        var clickEventArgs = {
            ElementId: liElement.getAttribute('data-uid'), IsChecked: checked,
            Key: liElement.classList.contains(HASCHILD) ? this.dataSourceLevel[this.dataSourceLevel.length - 2] :
                this.curDSKey, IsInteracted: event ? true : false
        };
        this.dotNetRef.invokeMethodAsync('TriggerClickEvent', clickEventArgs);
    };
    // Animation Related Functions
    SfListView.prototype.switchView = function (fromView, toView, reverse) {
        var _this = this;
        if (fromView && toView) {
            var fromViewPos_1 = fromView.style.position;
            var overflow_1 = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';
            var animationEffect = void 0;
            var duration = this.animation.duration;
            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            if (this.animation.effect) {
                animationEffect = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            }
            else {
                var slideLeft = 'SlideLeft';
                animationEffect = effectsConfig[slideLeft];
                reverse = this.enableRtl;
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.animationObject.animate(fromView, {
                name: (reverse ? animationEffect[0] : animationEffect[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function (model) {
                    fromView.style.display = NONE;
                    _this.element.style.overflow = overflow_1;
                    fromView.style.position = fromViewPos_1;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.animationObject.animate(toView, {
                name: (reverse ? animationEffect[2] : animationEffect[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function () {
                    _this.dotNetRef.invokeMethodAsync('TriggerActionComplete');
                }
            });
            this.curUlElement = toView;
        }
    };
    SfListView.prototype.setAnimation = function (animation) {
        this.animation = animation;
    };
    SfListView.prototype.setSelectedItems = function (selectedElementIdInfo) {
        var headerElement = this.element.querySelector('.' + HEADER);
        if (!sf.base.isNullOrUndefined(selectedElementIdInfo)) {
            this.selectedItems = { defaultData_Key: selectedElementIdInfo };
        }
        this.dataSourceLevel = [DATASOURCEKEY];
        this.curDSKey = DATASOURCEKEY;
        this.curUlElement = this.element.querySelector('ul');
        this.curUlElement.style.removeProperty('display');
        this.addCheckClass();
        if (this.showCheckBox) {
            this.removeFocus();
        }
        this.headerTitleInfo = this.headerTitleInfo.splice(0, 1);
        if (this.headerElement) {
            this.headerElement.innerText = this.headerTitleInfo[this.headerTitleInfo.length - 1];
        }
        if (this.dataSourceLevel.length === 1 && headerElement) {
            headerElement.children[0].style.display = NONE;
        }
    };
    SfListView.prototype.updateHeaderTitle = function (title) {
        this.headerTitleInfo[0] = title;
        if (this.headerElement) {
            this.headerElement.innerText = title;
        }
    };
    SfListView.prototype.destroy = function () {
        this.element.style.display = NONE;
        this.unWireEvents();
    };
    return SfListView;
}());
var listView = {
    // tslint:disable
    initialize: function (element, dotnetRef, properties, isSelect, liDiff) {
        // tslint:enable
        if (this.isValid(element)) {
            new SfListView(element, dotnetRef, properties, isSelect);
            element.blazor__instance.initialize();
            element.blazor__instance.updateElementDifference(liDiff);
        }
    },
    renderChildList: function (element, parentId, selectedItems) {
        if (this.isValid(element)) {
            element.blazor__instance.renderChildList(parentId, selectedItems);
        }
    },
    addActiveClass: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.addCheckClass();
        }
    },
    // tslint:disable
    showHideItem: function (element, item, display) {
        // tslint:enable
        if (this.isValid(element)) {
            element.blazor__instance.showHideItem(item, display);
        }
    },
    // tslint:disable
    enableState: function (element, item, isEnable) {
        // tslint:enable
        if (this.isValid(element)) {
            element.blazor__instance.enableState(item, isEnable);
        }
    },
    back: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.back();
        }
    },
    checkAllItems: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.checkAllItems();
        }
    },
    uncheckAllItems: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.uncheckAllItems();
        }
    },
    // tslint:disable
    getCheckData: function (element, item, isCheck) {
        // tslint:enable
        if (this.isValid(element) && item != null) {
            for (var i = 0; i < item.length; i++) {
                element.blazor__instance.getCheckData(item[i], isCheck);
            }
        }
    },
    // tslint:disable
    selectItem: function (element, item) {
        // tslint:enable
        if (element && item != null) {
            for (var i = 0; i < item.length; i++) {
                element.blazor__instance.selectItem(item[i]);
            }
        }
    },
    updateLiElementHeight: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.updateLiElementHeight();
        }
    },
    getCheckedItems: function getCheckedItems(element) {
        return this.isValid(element) ? element.blazor__instance.getSelectedItems() : {};
    },
    setAnimation: function setAnimation(element, animaton) {
        if (this.isValid(element)) {
            element.blazor__instance.setAnimation(animaton);
        }
    },
    setCheckedItems: function setCheckedItems(element, selectedElementIdInfo) {
        if (this.isValid(element)) {
            element.blazor__instance.setSelectedItems(selectedElementIdInfo);
        }
    },
    updateHeaderTitle: function updateHeaderTitle(element, title) {
        if (this.isValid(element)) {
            element.blazor__instance.updateHeaderTitle(title);
        }
    },
    destroy: function destroy(element) {
        if (this.isValid(element)) {
            element.blazor__instance.destroy();
        }
    },
    updateElementDifference: function updateElementDifference(element, listDiff) {
        if (this.isValid(element)) {
            element.blazor__instance.updateElementDifference(listDiff);
        }
    },
    isValid: function (element) {
        return (element) ? true : false;
    }
};

return listView;

}());
