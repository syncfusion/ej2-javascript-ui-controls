window.sf = window.sf || {};
var sfsortable = (function (exports) {
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
 * Sortable Module provides support to enable sortable functionality in Dom Elements.
 * ```html
 * <div id="sortable">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 *   <div>Item 5</div>
 * </div>
 * ```
 * ```typescript
 *   let ele: HTMLElement = document.getElementById('sortable');
 *   let sortObj: Sortable = new Sortable(ele, {});
 * ```
 */
var Sortable = /** @class */ (function (_super) {
    __extends(Sortable, _super);
    function Sortable(element, options) {
        var _this = _super.call(this, options, element) || this;
        _this.getHelper = function (e) {
            var target = _this.getSortableElement(e.sender.target);
            if (!_this.isValidTarget(target, _this)) {
                return false;
            }
            var element;
            if (_this.helper) {
                element = _this.helper({ sender: target, element: e.element });
            }
            else {
                element = target.cloneNode(true);
                element.style.width = target.offsetWidth + "px";
                element.style.height = target.offsetHeight + "px";
            }
            sf.base.addClass([element], ['e-sortableclone']);
            document.body.appendChild(element);
            return element;
        };
        _this.onDrag = function (e) {
            _this.trigger('drag', { event: e.event, element: _this.element, target: e.target });
            var newInst = _this.getSortableInstance(e.target);
            var target = _this.getSortableElement(e.target, newInst);
            if ((_this.isValidTarget(target, newInst) || e.target.className.indexOf('e-list-group-item') > -1) && (_this.curTarget !== target ||
                !sf.base.isNullOrUndefined(newInst.placeHolder)) && (newInst.placeHolderElement ? newInst.placeHolderElement !== e.target :
                true)) {
                if (e.target.className.indexOf('e-list-group-item') > -1) {
                    target = e.target;
                }
                _this.curTarget = target;
                if (_this.target === target) {
                    return;
                }
                var oldIdx = _this.getIndex(newInst.placeHolderElement, newInst);
                var placeHolder = _this.getPlaceHolder(target, newInst);
                var newIdx = void 0;
                if (placeHolder) {
                    oldIdx = sf.base.isNullOrUndefined(oldIdx) ? _this.getIndex(_this.target) : oldIdx;
                    newIdx = _this.getIndex(target, newInst, e.event);
                    var isPlaceHolderPresent = _this.isPlaceHolderPresent(newInst);
                    if (isPlaceHolderPresent && oldIdx === newIdx) {
                        return;
                    }
                    if (isPlaceHolderPresent) {
                        sf.base.remove(newInst.placeHolderElement);
                    }
                    newInst.placeHolderElement = placeHolder;
                    if (e.target.className.indexOf('e-list-group-item') > -1) {
                        newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[newIdx]);
                    }
                    else if (newInst.element !== _this.element && newIdx === newInst.element.childElementCount) {
                        newInst.element.appendChild(newInst.placeHolderElement);
                    }
                    else {
                        newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[newIdx]);
                    }
                    _this.refreshDisabled(oldIdx, newIdx, newInst);
                }
                else {
                    oldIdx = sf.base.isNullOrUndefined(oldIdx) ? _this.getIndex(_this.target) :
                        _this.getIndex(target, newInst) < oldIdx || !oldIdx ? oldIdx : oldIdx - 1;
                    newIdx = _this.getIndex(target, newInst);
                    var idx = newInst.element !== _this.element ? newIdx : oldIdx < newIdx ? newIdx + 1 : newIdx;
                    _this.updateItemClass(newInst);
                    newInst.element.insertBefore(_this.target, newInst.element.children[idx]);
                    _this.refreshDisabled(oldIdx, newIdx, newInst);
                    _this.curTarget = _this.target;
                    _this.trigger('drop', { droppedElement: _this.target, element: newInst.element, previousIndex: oldIdx, currentIndex: newIdx,
                        target: e.target, helper: document.getElementsByClassName('e-sortableclone')[0], event: e.event, scope: _this.scope });
                }
            }
            newInst = _this.getSortableInstance(_this.curTarget);
            if (sf.base.isNullOrUndefined(target) && e.target !== newInst.placeHolderElement) {
                if (_this.isPlaceHolderPresent(newInst)) {
                    _this.removePlaceHolder(newInst);
                }
            }
            else {
                var placeHolders = [].slice.call(document.getElementsByClassName('e-sortable-placeholder'));
                var inst_1;
                placeHolders.forEach(function (placeHolder) {
                    inst_1 = _this.getSortableInstance(placeHolder);
                    if (inst_1.element && inst_1 !== newInst) {
                        _this.removePlaceHolder(inst_1);
                    }
                });
            }
        };
        _this.onDragStart = function (e) {
            _this.target = _this.getSortableElement(e.target);
            var cancelDrag = false;
            _this.target.classList.add('e-grabbed');
            _this.curTarget = _this.target;
            e.helper = document.getElementsByClassName('e-sortableclone')[0];
            var args = { cancel: false, element: _this.element, target: _this.target };
            _this.trigger('beforeDragStart', args, function (observedArgs) {
                if (observedArgs.cancel) {
                    cancelDrag = observedArgs.cancel;
                    _this.onDragStop(e);
                }
            });
            if (cancelDrag) {
                return;
            }
            if (sf.base.isBlazor) {
                _this.trigger('dragStart', { event: e.event, element: _this.element, target: _this.target,
                    bindEvents: e.bindEvents, dragElement: e.dragElement });
            }
            else {
                _this.trigger('dragStart', { event: e.event, element: _this.element, target: _this.target });
            }
        };
        _this.onDragStop = function (e) {
            var dropInst = _this.getSortableInstance(_this.curTarget);
            var prevIdx;
            var curIdx;
            var handled;
            prevIdx = _this.getIndex(_this.target);
            var isPlaceHolderPresent = _this.isPlaceHolderPresent(dropInst);
            if (isPlaceHolderPresent) {
                var curIdx_1 = _this.getIndex(dropInst.placeHolderElement, dropInst);
                var args = { previousIndex: prevIdx, currentIndex: curIdx_1, target: e.target, droppedElement: _this.target,
                    helper: e.helper, cancel: false, handled: false };
                _this.trigger('beforeDrop', args, function (observedArgs) {
                    if (!observedArgs.cancel) {
                        handled = observedArgs.handled;
                        _this.updateItemClass(dropInst);
                        if (observedArgs.handled) {
                            var ele = _this.target.cloneNode(true);
                            _this.target.classList.remove('e-grabbed');
                            _this.target = ele;
                        }
                        dropInst.element.insertBefore(_this.target, dropInst.placeHolderElement);
                        var curIdx_2 = _this.getIndex(_this.target, dropInst);
                        prevIdx = _this === dropInst && (prevIdx - curIdx_2) > 1 ? prevIdx - 1 : prevIdx;
                        _this.trigger('drop', { event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: curIdx_2,
                            target: e.target, helper: e.helper, droppedElement: _this.target, scopeName: _this.scope, handled: handled });
                    }
                    sf.base.remove(dropInst.placeHolderElement);
                });
            }
            dropInst = _this.getSortableInstance(e.target);
            curIdx = dropInst.element.childElementCount;
            prevIdx = _this.getIndex(_this.target);
            if (dropInst.element === e.target || (!isPlaceHolderPresent && _this.curTarget === _this.target)) {
                var beforeDropArgs = { previousIndex: prevIdx, currentIndex: _this.curTarget === _this.target ? prevIdx : curIdx,
                    target: e.target, droppedElement: _this.target, helper: e.helper, cancel: false };
                _this.trigger('beforeDrop', beforeDropArgs, function (observedArgs) {
                    if (dropInst.element === e.target && !observedArgs.cancel) {
                        _this.updateItemClass(dropInst);
                        dropInst.element.appendChild(_this.target);
                        _this.trigger('drop', { event: e.event, element: dropInst.element, previousIndex: prevIdx, currentIndex: curIdx,
                            target: e.target, helper: e.helper, droppedElement: _this.target, scopeName: _this.scope });
                    }
                });
            }
            _this.target.classList.remove('e-grabbed');
            _this.target = null;
            _this.curTarget = null;
            sf.base.remove(e.helper);
            sf.base.getComponent(_this.element, sf.base.Draggable).intDestroy(e.event);
        };
        _this.bind();
        return _this;
    }
    Sortable_1 = Sortable;
    Sortable.prototype.bind = function () {
        if (!this.element.id) {
            this.element.id = sf.base.getUniqueID('sortable');
        }
        if (!this.itemClass) {
            this.itemClass = 'e-sort-item';
            this.dataBind();
        }
        this.initializeDraggable();
    };
    Sortable.prototype.initializeDraggable = function () {
        new sf.base.Draggable(this.element, {
            helper: this.getHelper,
            dragStart: this.onDragStart,
            drag: this.onDrag,
            dragStop: this.onDragStop,
            dragTarget: "." + this.itemClass,
            enableTapHold: true,
            tapHoldThreshold: 200,
            queryPositionInfo: this.queryPositionInfo,
            distance: 5
        });
    };
    Sortable.prototype.getPlaceHolder = function (target, instance) {
        if (instance.placeHolder) {
            var placeHolderElement = instance.placeHolder({ element: instance.element, grabbedElement: this.target, target: target });
            placeHolderElement.classList.add('e-sortable-placeholder');
            return placeHolderElement;
        }
        return null;
    };
    Sortable.prototype.isValidTarget = function (target, instance) {
        return target && sf.base.compareElementParent(target, instance.element) && target.classList.contains(instance.itemClass) &&
            !target.classList.contains('e-disabled');
    };
    Sortable.prototype.removePlaceHolder = function (instance) {
        sf.base.remove(instance.placeHolderElement);
        instance.placeHolderElement = null;
    };
    Sortable.prototype.updateItemClass = function (instance) {
        if (this !== instance) {
            this.target.classList.remove(this.itemClass);
            this.target.classList.add(instance.itemClass);
        }
    };
    Sortable.prototype.getSortableInstance = function (element) {
        element = sf.base.closest(element, ".e-" + this.getModuleName());
        if (element) {
            var inst = sf.base.getComponent(element, Sortable_1);
            return inst.scope && this.scope && inst.scope === this.scope ? inst : this;
        }
        else {
            return this;
        }
    };
    Sortable.prototype.refreshDisabled = function (oldIdx, newIdx, instance) {
        if (instance === this) {
            var element = void 0;
            var increased = oldIdx < newIdx;
            var disabledIdx = void 0;
            var start = increased ? oldIdx : newIdx;
            var end = increased ? newIdx : oldIdx;
            while (start <= end) {
                element = this.element.children[start];
                if (element.classList.contains('e-disabled')) {
                    disabledIdx = this.getIndex(element);
                    this.element.insertBefore(element, this.element.children[increased ? disabledIdx + 2 : disabledIdx - 1]);
                    start = increased ? disabledIdx + 2 : disabledIdx + 1;
                }
                else {
                    start++;
                }
            }
        }
    };
    Sortable.prototype.getIndex = function (target, instance, e) {
        if (instance === void 0) { instance = this; }
        var idx;
        var placeHolderPresent;
        [].slice.call(instance.element.children).forEach(function (element, index) {
            if (element.classList.contains('e-sortable-placeholder')) {
                placeHolderPresent = true;
            }
            if (element === target) {
                idx = index;
                if (!sf.base.isNullOrUndefined(e)) {
                    if (placeHolderPresent) {
                        idx -= 1;
                    }
                    var offset = target.getBoundingClientRect();
                    var clientY = offset.bottom - ((offset.bottom - offset.top) / 2);
                    idx = e.clientY <= clientY ? idx : idx + 1;
                }
                return;
            }
        });
        return idx;
    };
    Sortable.prototype.getSortableElement = function (element, instance) {
        if (instance === void 0) { instance = this; }
        return sf.base.closest(element, "." + instance.itemClass);
    };
    Sortable.prototype.queryPositionInfo = function (value) {
        value.left = pageXOffset ? parseFloat(value.left) - pageXOffset + "px" : value.left;
        value.top = pageYOffset ? parseFloat(value.top) - pageYOffset + "px" : value.top;
        return value;
    };
    Sortable.prototype.isPlaceHolderPresent = function (instance) {
        return instance.placeHolderElement && !!sf.base.closest(instance.placeHolderElement, "#" + instance.element.id);
    };
    /**
     * It is used to sort array of elements from source element to destination element.
     * @param destination - Defines the destination element to which the sortable elements needs to be appended.
     * If it is null, then the Sortable library element will be considered as destination.
     * @param targetIndexes - Specifies the sortable elements indexes which needs to be sorted.
     * @param insertBefore - Specifies the index before which the sortable elements needs to be appended.
     * If it is null, elements will be appended as last child.
     * @method moveTo
     * @return {void}
     */
    Sortable.prototype.moveTo = function (destination, targetIndexes, insertBefore) {
        moveTo(this.element, destination, targetIndexes, insertBefore);
    };
    /**
     * It is used to destroy the Sortable library.
     */
    Sortable.prototype.destroy = function () {
        if (this.itemClass === 'e-sort-item') {
            this.itemClass = null;
            this.dataBind();
        }
        sf.base.getComponent(this.element, sf.base.Draggable).destroy();
        _super.prototype.destroy.call(this);
    };
    Sortable.prototype.getModuleName = function () {
        return 'sortable';
    };
    Sortable.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'itemClass':
                    [].slice.call(this.element.children).forEach(function (element) {
                        if (element.classList.contains(oldProp.itemClass)) {
                            element.classList.remove(oldProp.itemClass);
                        }
                        if (newProp.itemClass) {
                            element.classList.add(newProp.itemClass);
                        }
                    });
                    break;
            }
        }
    };
    var Sortable_1;
    __decorate([
        sf.base.Property(false)
    ], Sortable.prototype, "enableAnimation", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sortable.prototype, "itemClass", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sortable.prototype, "scope", void 0);
    __decorate([
        sf.base.Property()
    ], Sortable.prototype, "helper", void 0);
    __decorate([
        sf.base.Property()
    ], Sortable.prototype, "placeHolder", void 0);
    __decorate([
        sf.base.Event()
    ], Sortable.prototype, "drag", void 0);
    __decorate([
        sf.base.Event()
    ], Sortable.prototype, "beforeDragStart", void 0);
    __decorate([
        sf.base.Event()
    ], Sortable.prototype, "dragStart", void 0);
    __decorate([
        sf.base.Event()
    ], Sortable.prototype, "beforeDrop", void 0);
    __decorate([
        sf.base.Event()
    ], Sortable.prototype, "drop", void 0);
    Sortable = Sortable_1 = __decorate([
        sf.base.NotifyPropertyChanges
    ], Sortable);
    return Sortable;
}(sf.base.Base));
/**
 * It is used to sort array of elements from source element to destination element.
 * @private
 */
function moveTo(from, to, targetIndexes, insertBefore) {
    var targetElements = [];
    if (!to) {
        to = from;
    }
    if (targetIndexes && targetIndexes.length) {
        targetIndexes.forEach(function (index) {
            targetElements.push(from.children[index]);
        });
    }
    else {
        targetElements = [].slice.call(from.children);
    }
    if (sf.base.isNullOrUndefined(insertBefore)) {
        targetElements.forEach(function (target) {
            to.appendChild(target);
        });
    }
    else {
        var insertElement_1 = to.children[insertBefore];
        targetElements.forEach(function (target) {
            to.insertBefore(target, insertElement_1);
        });
    }
}

/**
 * Sortable Module
 */

exports.Sortable = Sortable;
exports.moveTo = moveTo;

return exports;

});

    sf.lists = sf.base.extend({}, sf.lists, sfsortable({}));