window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.ListBox = (function () {
'use strict';

var CONTAINER = 'e-listbox-container';
var LIST = '.e-ul';
var LISTITEM = 'e-list-item';
var SELECTED = 'e-selected';
var DATAVALUE = 'data-value';
var DRAGEND = 'DragEnd';
var COMBINED = 'scopedListBox';
var HASH = '#';
var DOT = '.';
var PLACEHOLDER = 'e-placeholder';
var SPAN = 'span';
var BADGE = 'e-list-badge';
var PREVENT = 'e-drag-prevent';
var KEYDOWN = 'keydown';
var SORTABLE = 'sortable';
var UP = 38;
var DOWN = 40;
var KEYA = 65;
var SPACEKEY = 32;
/**
 * Client side scripts for SfListBox
 */
var SfListBox = /** @class */ (function () {
    function SfListBox(element, scopeElement, allowDragDrop, dotnetRef) {
        this.element = element;
        this.scopeElement = scopeElement;
        this.dotnetRef = dotnetRef;
        this.allowDragAndDrop = allowDragDrop;
        this.element.blazor__instance = this;
        sf.base.EventHandler.add(this.element, KEYDOWN, this.keyDownHandler, this);
        if (!sf.base.isNullOrUndefined(this.scopeElement.blazor__instance) && !this.scopeElement.blazor__instance.scope) {
            if (this.scopeElement !== this.element) {
                this.scope = sf.base.getUniqueID(COMBINED);
                this.scopeElement.blazor__instance.scope = this.scope;
                this.scopeElement.blazor__instance.initializeDraggable();
            }
            this.initializeDraggable();
        }
    }
    SfListBox.prototype.initializeDraggable = function () {
        var _this = this;
        if (!this.allowDragAndDrop) {
            return;
        }
        var ul = sf.base.select(LIST, this.element);
        new sf.lists.Sortable(ul, {
            scope: this.scope,
            itemClass: LISTITEM,
            beforeDragStart: this.triggerBeforeDragStart.bind(this),
            dragStart: this.triggerDragStart.bind(this),
            beforeDrop: this.dragEnd.bind(this),
            placeHolder: function () { return sf.base.createElement(SPAN, { className: PLACEHOLDER }); },
            helper: function (e) {
                var element = _this.element.cloneNode();
                var target = e.sender.cloneNode(true);
                element.appendChild(target);
                var refEle = sf.base.select(DOT + LISTITEM, _this.element);
                element.style.width = refEle.offsetWidth + 'px';
                element.style.height = refEle.offsetHeight + 'px';
                var selectedList = [].slice.call(sf.base.selectAll(DOT + LISTITEM + DOT + SELECTED, _this.element));
                if (selectedList.length && selectedList.length > 1 && selectedList.indexOf(e.sender) > -1) {
                    target.appendChild(sf.base.createElement(SPAN, { className: BADGE, innerHTML: selectedList.length.toString() }));
                }
                element.style.zIndex = sf.popups.getZindexPartial(_this.element).toString();
                return element;
            }
        });
    };
    SfListBox.prototype.triggerBeforeDragStart = function (args) {
        args.cancel = args.target.classList.contains(PREVENT);
    };
    SfListBox.prototype.triggerDragStart = function (args) {
        args.bindEvents(args.dragElement);
    };
    SfListBox.prototype.dragEnd = function (args) {
        var list;
        var scopedListBox = false;
        var sameListBox = false;
        if (this.element !== this.scopeElement) {
            list = sf.base.closest(args.target, HASH + this.scopeElement.id);
        }
        if (list) {
            scopedListBox = true;
        }
        else {
            list = sf.base.closest(args.target, HASH + this.element.id);
            if (list) {
                sameListBox = true;
            }
        }
        args.cancel = true;
        this.dotnetRef.invokeMethodAsync(DRAGEND, args.droppedElement.getAttribute(DATAVALUE), sameListBox, scopedListBox, args.previousIndex, args.currentIndex);
    };
    SfListBox.prototype.keyDownHandler = function (e) {
        var target = e.target;
        if (e.keyCode === UP || e.keyCode === DOWN) {
            e.preventDefault();
            if (target.classList.contains(CONTAINER)) {
                var listEle = sf.base.select(DOT + LISTITEM, this.element);
                if (listEle) {
                    listEle.focus();
                }
            }
            else {
                var list = [].slice.call(sf.base.selectAll(DOT + LISTITEM, this.element));
                var index = list.indexOf(target);
                if (index < 0) {
                    return;
                }
                index = e.keyCode === UP ? index - 1 : index + 1;
                if (index < 0 || index > list.length - 1) {
                    return;
                }
                list[index].focus();
            }
        }
        else if ((e.keyCode === KEYA && e.ctrlKey) || e.keyCode === SPACEKEY) {
            e.preventDefault();
        }
    };
    SfListBox.prototype.destroyDraggable = function () {
        var sortable = sf.base.getComponent(sf.base.select(LIST, this.element), SORTABLE);
        if (!sf.base.isNullOrUndefined(sortable)) {
            sortable.destroy();
        }
    };
    SfListBox.prototype.destroy = function () {
        this.destroyDraggable();
        sf.base.EventHandler.remove(this.element, KEYDOWN, this.keyDownHandler);
    };
    return SfListBox;
}());
// tslint:disable-next-line:variable-name
var ListBox = {
    initialize: function (element, scopeEle, allowDragDrop, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            new SfListBox(element, scopeEle, allowDragDrop, dotnetRef);
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    }
};

return ListBox;

}());
