window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Accordion = (function () {
'use strict';

var CLS_ACRDN_ROOT = 'e-acrdn-root';
var CLS_ROOT = 'e-accordion';
var CLS_ITEM = 'e-acrdn-item';
var CLS_ITEMFOCUS = 'e-item-focus';
var CLS_ITEMHIDE = 'e-hide';
var CLS_HEADER = 'e-acrdn-header';
var CLS_CONTENT = 'e-acrdn-panel';
var CLS_TOOGLEICN = 'e-toggle-icon';
var CLS_EXPANDICN = 'e-expand-icon';
var CLS_CTNHIDE = 'e-content-hide';
var CLS_SLCT = 'e-select';
var CLS_SLCTED = 'e-selected';
var CLS_ACTIVE = 'e-active';
var CLS_ANIMATE = 'e-animate';
var CLS_DISABLE = 'e-overlay';
var CLS_TOGANIMATE = 'e-toggle-animation';
var CLS_NEST = 'e-nested';
var CLS_EXPANDSTATE = 'e-expand-state';
var CLS_SCOPE = 'scope';
var CLS_RTL = 'e-rtl';
var SfAccordion = /** @class */ (function () {
    function SfAccordion(element, options, dotnetRef) {
        this.keyConfigs = {
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            enter: 'enter',
            space: 'space',
            home: 'home',
            end: 'end',
        };
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    SfAccordion.prototype.destroy = function () {
        var ele = this.element;
        this.unwireEvents();
        this.isDestroy = true;
        ele.classList.remove(CLS_ACRDN_ROOT);
        if (!this.isNested && sf.base.isRippleEnabled) {
            this.removeRippleEffect();
        }
    };
    SfAccordion.prototype.render = function () {
        var nested = sf.base.closest(this.element, '.' + CLS_CONTENT);
        this.isNested = false;
        if (!this.isDestroy) {
            this.isDestroy = false;
        }
        if (!sf.base.isNullOrUndefined(nested)) {
            nested.classList.add(CLS_NEST);
            this.isNested = true;
        }
        else {
            this.element.classList.add(CLS_ACRDN_ROOT);
        }
        this.wireFocusEvents();
        this.wireEvents();
    };
    SfAccordion.prototype.wireFocusEvents = function () {
        var acrdItem = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM));
        for (var _i = 0, acrdItem_1 = acrdItem; _i < acrdItem_1.length; _i++) {
            var item = acrdItem_1[_i];
            var headerEle = item.querySelector('.' + CLS_HEADER);
            if (item.childElementCount > 0 && headerEle) {
                sf.base.EventHandler.clearEvents(headerEle);
                sf.base.EventHandler.add(headerEle, 'focus', this.focusIn, this);
                sf.base.EventHandler.add(headerEle, 'blur', this.focusOut, this);
            }
        }
    };
    SfAccordion.prototype.unwireEvents = function () {
        if (!sf.base.isNullOrUndefined(this.keyModule)) {
            this.keyModule.destroy();
        }
    };
    SfAccordion.prototype.wireEvents = function () {
        if (!this.isNested && !this.isDestroy) {
            this.removeRippleEffect = sf.base.rippleEffect(this.element, { selector: '.' + CLS_HEADER });
        }
        if (!this.isNested) {
            this.keyModule = new sf.base.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        }
    };
    SfAccordion.prototype.focusIn = function (e) {
        e.target.parentElement.classList.add(CLS_ITEMFOCUS);
    };
    SfAccordion.prototype.focusOut = function (e) {
        e.target.parentElement.classList.remove(CLS_ITEMFOCUS);
    };
    /**
     * To perform expand and collapse action while clicking the item
     */
    SfAccordion.prototype.afterContentRender = function (targetEle) {
        var _this = this;
        var acrdActive = [];
        var acrdnItem = targetEle;
        var acrdnHdr = acrdnItem.children[0];
        var acrdnCtn = acrdnItem.children[1];
        var acrdnCtnItem;
        if (acrdnHdr) {
            acrdnCtnItem = sf.base.closest(acrdnHdr, '.' + CLS_ITEM);
        }
        else if (acrdnCtn) {
            acrdnCtnItem = sf.base.closest(acrdnCtn, '.' + CLS_ITEM);
        }
        var acrdnchild = this.element.children;
        [].slice.call(acrdnchild).forEach(function (el) {
            if (el.classList.contains(CLS_ACTIVE)) {
                acrdActive.push(el);
            }
        });
        var acrdAniEle = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM + ' [' + CLS_ANIMATE + ']'));
        if (acrdAniEle.length > 0) {
            for (var _i = 0, acrdAniEle_1 = acrdAniEle; _i < acrdAniEle_1.length; _i++) {
                var el = acrdAniEle_1[_i];
                acrdActive.push(el.parentElement);
            }
        }
        var sameContentCheck = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
        var sameHeader = false;
        if (!sf.base.isNullOrUndefined(acrdnItem) && !sf.base.isNullOrUndefined(acrdnHdr)) {
            var acrdnCtn_1 = sf.base.select('.' + CLS_CONTENT, acrdnItem);
            var acrdnRoot = sf.base.closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
            var expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
            if (sf.base.isNullOrUndefined(acrdnCtn_1)) {
                return;
            }
            sameHeader = (expandState === acrdnItem);
            if (sf.base.isVisible(acrdnCtn_1) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
                this.collapse(acrdnCtn_1);
            }
            else {
                if ((acrdActive.length > 0) && this.options.expandMode === 'Single' && !sameContentCheck) {
                    acrdActive.forEach(function (el) {
                        _this.collapse(sf.base.select('.' + CLS_CONTENT, el));
                        el.classList.remove(CLS_EXPANDSTATE);
                    });
                }
                this.expand(acrdnCtn_1);
            }
            if (!sf.base.isNullOrUndefined(expandState) && !sameHeader) {
                expandState.classList.remove(CLS_EXPANDSTATE);
            }
        }
    };
    SfAccordion.prototype.eleMoveFocus = function (action, root, trgt) {
        var clst;
        var clstItem = sf.base.closest(trgt, '.' + CLS_ITEM);
        if (trgt === root) {
            clst = ((action === 'moveUp' ? trgt.lastElementChild : trgt).querySelector('.' + CLS_HEADER));
        }
        else if (trgt.classList.contains(CLS_HEADER)) {
            clstItem = (action === 'moveUp' ? clstItem.previousElementSibling : clstItem.nextElementSibling);
            if (clstItem) {
                clst = sf.base.select('.' + CLS_HEADER, clstItem);
            }
        }
        if (clst) {
            clst.focus();
        }
    };
    SfAccordion.prototype.keyActionHandler = function (e) {
        var trgt = e.target;
        var header = sf.base.closest(e.target, CLS_HEADER);
        if (sf.base.isNullOrUndefined(header) && !trgt.classList.contains(CLS_ROOT) && !trgt.classList.contains(CLS_HEADER)) {
            return;
        }
        var clst;
        var root = this.element;
        var content;
        switch (e.action) {
            case 'moveUp' || 'moveDown':
                this.eleMoveFocus(e.action, root, trgt);
                break;
            case 'space':
            case 'enter':
                content = trgt.nextElementSibling;
                if (!sf.base.isNullOrUndefined(content) && content.classList.contains(CLS_CONTENT)) {
                    if (content.getAttribute('e-animate') !== 'true') {
                        trgt.click();
                    }
                }
                else {
                    trgt.click();
                }
                break;
            case 'home':
            case 'end':
                clst = e.action === 'home' ? root.firstElementChild.children[0] : root.lastElementChild.children[0];
                clst.focus();
                break;
        }
    };
    SfAccordion.prototype.expand = function (trgt) {
        var trgtItemEle = sf.base.closest(trgt, '.' + CLS_ITEM);
        if (sf.base.isNullOrUndefined(trgt) || (sf.base.isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true') || trgtItemEle.classList.contains(CLS_DISABLE)) {
            return;
        }
        this.dotNetRef.invokeMethodAsync('TriggerExpandingEvent', this.getIndexByItem(trgtItemEle));
    };
    SfAccordion.prototype.expandAnimation = function (ef, icn, trgt, trgtItemEle, animate, args) {
        var _this = this;
        var height;
        this.lastActiveItemId = trgtItemEle.id;
        if (ef === 'SlideDown') {
            animate.begin = function () {
                _this.expandProgress('begin', icn, trgt, trgtItemEle, args);
                trgt.style.position = 'absolute';
                height = trgtItemEle.offsetHeight;
                trgt.style.maxHeight = (trgt.offsetHeight) + 'px';
                trgtItemEle.style.maxHeight = '';
            };
            animate.progress = function () {
                trgtItemEle.style.minHeight = (height + trgt.offsetHeight) + 'px';
            };
            animate.end = function () {
                sf.base.setStyleAttribute(trgt, { 'position': '', 'maxHeight': '' });
                trgtItemEle.style.minHeight = '';
                _this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        else {
            animate.begin = function () {
                _this.expandProgress('begin', icn, trgt, trgtItemEle, args);
            };
            animate.end = function () {
                _this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        new sf.base.Animation(animate).animate(trgt);
    };
    SfAccordion.prototype.expandProgress = function (progress, icon, trgt, trgtItemEle, eventArgs) {
        sf.base.removeClass([trgt], CLS_CTNHIDE);
        sf.base.addClass([trgtItemEle], CLS_SLCTED);
        sf.base.addClass([icon], CLS_EXPANDICN);
        if (progress === 'end') {
            sf.base.addClass([trgtItemEle], CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'false');
            sf.base.attributes(trgtItemEle, { 'aria-expanded': 'true' });
            sf.base.attributes(trgt.previousElementSibling, { 'aria-selected': 'true' });
            icon.classList.remove(CLS_TOGANIMATE);
            this.dotNetRef.invokeMethodAsync('TriggerExpandedEvent', eventArgs);
        }
    };
    SfAccordion.prototype.expandedItemsPush = function (item) {
        var index = this.getIndexByItem(item);
        if (this.options.expandedIndices.indexOf(index) === -1) {
            var temp = [].slice.call(this.options.expandedIndices);
            temp.push(index);
            this.options.expandedIndices = temp;
        }
    };
    SfAccordion.prototype.getIndexByItem = function (item) {
        var itemEle = this.getItemElements();
        return [].slice.call(itemEle).indexOf(item);
    };
    SfAccordion.prototype.getItemElements = function () {
        var itemEle = [];
        var itemCollection = this.element.children;
        [].slice.call(itemCollection).forEach(function (el) {
            if (el.classList.contains(CLS_ITEM)) {
                itemEle.push(el);
            }
        });
        return itemEle;
    };
    SfAccordion.prototype.expandedItemsPop = function (item) {
        var index = this.getIndexByItem(item);
        var temp = [].slice.call(this.options.expandedIndices);
        temp.splice(temp.indexOf(index), 1);
        this.options.expandedIndices = temp;
    };
    SfAccordion.prototype.collapse = function (trgt) {
        var trgtItemEle = sf.base.closest(trgt, '.' + CLS_ITEM);
        if (sf.base.isNullOrUndefined(trgt) || !sf.base.isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE)) {
            return;
        }
        this.dotNetRef.invokeMethodAsync('TriggerCollapsingEvent', this.getIndexByItem(trgtItemEle));
    };
    SfAccordion.prototype.collapseAnimation = function (ef, trgt, trgtItEl, icn, animate, args) {
        var _this = this;
        var height;
        var trgtHeight;
        var itemHeight;
        var remain;
        this.lastActiveItemId = trgtItEl.id;
        if (ef === 'SlideUp') {
            animate.begin = function () {
                itemHeight = trgtItEl.offsetHeight;
                trgtItEl.style.minHeight = itemHeight + 'px';
                trgt.style.position = 'absolute';
                height = trgtItEl.offsetHeight;
                trgtHeight = trgt.offsetHeight;
                trgt.style.maxHeight = trgtHeight + 'px';
                _this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.progress = function () {
                remain = ((height - (trgtHeight - trgt.offsetHeight)));
                if (remain < itemHeight) {
                    trgtItEl.style.minHeight = remain + 'px';
                }
            };
            animate.end = function () {
                trgt.style.display = 'none';
                _this.collapseProgress('end', icn, trgt, trgtItEl, args);
                trgtItEl.style.minHeight = '';
                sf.base.setStyleAttribute(trgt, { 'position': '', 'maxHeight': '', 'display': '' });
            };
        }
        else {
            animate.begin = function () {
                _this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.end = function () {
                _this.collapseProgress('end', icn, trgt, trgtItEl, args);
            };
        }
        new sf.base.Animation(animate).animate(trgt);
    };
    SfAccordion.prototype.collapseProgress = function (progress, icon, trgt, trgtItemEle, eventArgs) {
        sf.base.removeClass([icon], CLS_EXPANDICN);
        sf.base.removeClass([trgtItemEle], CLS_SLCTED);
        if (progress === 'end') {
            sf.base.addClass([trgt], CLS_CTNHIDE);
            icon.classList.remove(CLS_TOGANIMATE);
            sf.base.removeClass([trgtItemEle], CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'true');
            sf.base.attributes(trgtItemEle, { 'aria-expanded': 'false' });
            sf.base.attributes(trgt.previousElementSibling, { 'aria-selected': 'false' });
            this.dotNetRef.invokeMethodAsync('TriggerCollapsedEvent', eventArgs);
        }
    };
    SfAccordion.prototype.expandingItem = function (expandArgs) {
        this.accItem = sf.base.selectAll(':' + CLS_SCOPE + ' > .' + CLS_ITEM, this.element);
        var trgtItemEle = this.getElementByIndex(expandArgs.index);
        var trgt = sf.base.select('.' + CLS_CONTENT, trgtItemEle);
        var acrdnRoot = sf.base.closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
        var icon = sf.base.select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        var expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
        var animation = {
            name: this.options.animation.expand.effect,
            duration: this.options.animation.expand.duration,
            timingFunction: this.options.animation.expand.easing
        };
        icon.classList.add(CLS_TOGANIMATE);
        this.expandedItemsPush(trgtItemEle);
        if (!sf.base.isNullOrUndefined(expandState)) {
            expandState.classList.remove(CLS_EXPANDSTATE);
        }
        trgtItemEle.classList.add(CLS_EXPANDSTATE);
        if ((animation.name === 'None')) {
            this.expandProgress('begin', icon, trgt, trgtItemEle, expandArgs);
            this.expandProgress('end', icon, trgt, trgtItemEle, expandArgs);
        }
        else {
            this.expandAnimation(animation.name, icon, trgt, trgtItemEle, animation, expandArgs);
        }
    };
    SfAccordion.prototype.getElementByIndex = function (index) {
        if (this.accItem[index]) {
            return this.accItem[index];
        }
        return null;
    };
    SfAccordion.prototype.collapsingItem = function (expandArgs) {
        this.accItem = sf.base.selectAll(':' + CLS_SCOPE + ' > .' + CLS_ITEM, this.element);
        var trgtItemEle = this.getElementByIndex(expandArgs.index);
        var trgt = sf.base.select('.' + CLS_CONTENT, trgtItemEle);
        var icon = sf.base.select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        var animation = {
            name: this.options.animation.collapse.effect,
            duration: this.options.animation.collapse.duration,
            timingFunction: this.options.animation.collapse.easing,
        };
        this.expandedItemsPop(trgtItemEle);
        trgtItemEle.classList.add(CLS_EXPANDSTATE);
        icon.classList.add(CLS_TOGANIMATE);
        if ((animation.name === 'None')) {
            this.collapseProgress('begin', icon, trgt, trgtItemEle, expandArgs);
            this.collapseProgress('end', icon, trgt, trgtItemEle, expandArgs);
        }
        else {
            this.collapseAnimation(animation.name, trgt, trgtItemEle, icon, animation, expandArgs);
        }
    };
    SfAccordion.prototype.select = function (index) {
        var itemEle = this.getItemElements();
        var ele = itemEle[index];
        if (sf.base.isNullOrUndefined(ele) || sf.base.isNullOrUndefined(sf.base.select('.' + CLS_HEADER, ele))) {
            return;
        }
        ele.children[0].focus();
    };
    SfAccordion.prototype.hideItem = function (index, isHidden) {
        var itemEle = this.getItemElements();
        var ele = itemEle[index];
        if (sf.base.isNullOrUndefined(ele)) {
            return;
        }
        if (sf.base.isNullOrUndefined(isHidden)) {
            isHidden = true;
        }
        isHidden ? sf.base.addClass([ele], CLS_ITEMHIDE) : sf.base.removeClass([ele], CLS_ITEMHIDE);
    };
    SfAccordion.prototype.enableItem = function (index, isEnable) {
        var itemEle = this.getItemElements();
        var ele = itemEle[index];
        if (sf.base.isNullOrUndefined(ele)) {
            return;
        }
        var eleHeader = ele.firstElementChild;
        if (isEnable) {
            sf.base.removeClass([ele], CLS_DISABLE);
            sf.base.attributes(eleHeader, { 'tabindex': '0', 'aria-disabled': 'false' });
            eleHeader.focus();
        }
        else {
            if (ele.classList.contains(CLS_ACTIVE)) {
                this.expandItem(false, index);
                this.eleMoveFocus('movedown', this.element, eleHeader);
            }
            sf.base.addClass([ele], CLS_DISABLE);
            eleHeader.setAttribute('aria-disabled', 'true');
            eleHeader.removeAttribute('tabindex');
        }
    };
    SfAccordion.prototype.expandItem = function (isExpand, index) {
        var _this = this;
        var itemEle = this.getItemElements();
        if (sf.base.isNullOrUndefined(index)) {
            if (this.options.expandMode === 'Single' && isExpand) {
                var ele = itemEle[itemEle.length - 1];
                this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
            }
            else {
                var item = sf.base.select('#' + this.lastActiveItemId, this.element);
                [].slice.call(itemEle).forEach(function (el) {
                    _this.itemExpand(isExpand, el, _this.getIndexByItem(el));
                    el.classList.remove(CLS_EXPANDSTATE);
                });
                var expandedItem = sf.base.select('.' + CLS_EXPANDSTATE, this.element);
                if (expandedItem) {
                    expandedItem.classList.remove(CLS_EXPANDSTATE);
                }
                if (item) {
                    item.classList.add(CLS_EXPANDSTATE);
                }
            }
        }
        else {
            var ele = itemEle[index];
            if (sf.base.isNullOrUndefined(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
                return;
            }
            else {
                if (this.options.expandMode === 'Single') {
                    this.expandItem(false);
                }
                this.itemExpand(isExpand, ele, index);
            }
        }
    };
    SfAccordion.prototype.itemExpand = function (isExpand, ele, index) {
        var _this = this;
        var ctn = ele.children[1];
        if (ele.classList.contains(CLS_DISABLE)) {
            return;
        }
        if (sf.base.isNullOrUndefined(ctn) && isExpand) {
            var id = ele.id;
            // tslint:disable-next-line:no-any
            this.dotNetRef.invokeMethodAsync('OnAccordionClick', index, id).then(function () {
                ctn = ele.children[1];
                _this.expand(ctn);
            });
        }
        else if (!sf.base.isNullOrUndefined(ctn)) {
            isExpand ? this.expand(ctn) : this.collapse(ctn);
        }
    };
    return SfAccordion;
}());
// tslint:disable
var Accordion = {
    initialize: function (element, options, dotnetRef) {
        if (element) {
            if (options.expandedIndices === null) {
                options.expandedIndices = [];
            }
            var instance = new SfAccordion(element, options, dotnetRef);
            instance.render();
            instance.dotNetRef.invokeMethodAsync('CreatedEvent', null);
        }
    },
    expandingItem: function (element, args) {
        if (element && element.blazor__instance) {
            element.blazor__instance.expandingItem(args);
        }
    },
    collapsingItem: function (element, args) {
        if (element && element.blazor__instance) {
            element.blazor__instance.collapsingItem(args);
        }
    },
    enableItem: function (element, index, isEnable) {
        if (element && element.blazor__instance) {
            element.blazor__instance.enableItem(index, isEnable);
        }
    },
    expandItem: function (element, isExpand, index) {
        if (element && element.blazor__instance) {
            element.blazor__instance.expandItem(isExpand, index);
        }
    },
    hideItem: function (element, index, isHidden) {
        if (element && element.blazor__instance) {
            element.blazor__instance.hideItem(index, isHidden);
        }
    },
    select: function (element, index) {
        if (element && element.blazor__instance) {
            element.blazor__instance.select(index);
        }
    },
    destroy: function (element, elementId, expandedIndices) {
        if (element && element.blazor__instance) {
            if (element.blazor__instance.options.enablePersistence) {
                window.localStorage.setItem(elementId, expandedIndices);
            }
            element.blazor__instance.destroy();
        }
    },
    setExpandModeAndRTL: function (element, enableRtl, expandMode, isRtlChanged, isExpandModeChanged) {
        if (element && element.blazor__instance) {
            if (isRtlChanged) {
                enableRtl ? sf.base.addClass([element], CLS_RTL) : sf.base.removeClass([element], CLS_RTL);
            }
            if (isExpandModeChanged) {
                element.blazor__instance.options.expandMode = expandMode;
                if (expandMode === 'Single') {
                    element.setAttribute('aria-multiselectable', 'false');
                    if (element.blazor__instance.options.expandedIndices.length > 1) {
                        element.blazor__instance.expandItem(false);
                    }
                }
                else {
                    element.setAttribute('aria-multiselectable', 'true');
                }
            }
        }
    },
    itemChanged: function (element) {
        if (element && element.blazor__instance) {
            element.blazor__instance.wireFocusEvents();
        }
    },
    refresh: function (element, options) {
        if (options.expandedIndices === null) {
            options.expandedIndices = [];
        }
        if (element && element.blazor__instance) {
            element.blazor__instance.options = options;
        }
    },
    afterContentRender: function (element, targetEle, animation) {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.animation = animation;
            element.blazor__instance.afterContentRender(targetEle);
        }
    }
};

return Accordion;

}());
