window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.FileManager = (function () {
'use strict';

var TOOLBAR_ID = '_toolbar';
var ROW = 'e-row';
var BLUR = 'e-blur';
var HOVER = 'e-hover';
var ACTIVE = 'e-active';
var CLONE = 'e-fe-clone';
var FULLROW = 'e-fullrow';
var FOLDER = 'e-fe-folder';
var LARGE_ICON = 'e-large-icon';
var DROP_FILE = 'e-fe-drop-file';
var LARGE_ICONS = 'e-large-icons';
var DROP_FOLDER = 'e-fe-drop-folder';
var SfFileManager = /** @class */ (function () {
    function SfFileManager(element, ref, properties) {
        this.element = element;
        this.properties = properties;
        this.treeviewEle = element.querySelector('.e-navigation .e-treeview');
        this.dotnetRef = ref;
        if (!sf.base.isNullOrUndefined(this.element)) {
            this.ctrlId = this.element.id;
            this.element.blazor__instance = this;
        }
        this.bindKeyboardEvent();
        this.wireEvents();
    }
    SfFileManager.prototype.wireEvents = function () {
        var gridElem = this.element.querySelector('#' + this.properties.id + '_grid');
        if (gridElem) {
            sf.base.EventHandler.add(gridElem, 'dblclick', this.gridBlur, this);
        }
    };
    SfFileManager.prototype.unWireEvents = function () {
        var gridElem = this.element.querySelector('#' + this.properties.id + '_grid');
        if (gridElem) {
            sf.base.EventHandler.remove(gridElem, 'dblclick', this.gridBlur);
        }
    };
    SfFileManager.prototype.adjustHeight = function () {
        var toolbar = sf.base.select('#' + this.element.id + TOOLBAR_ID, this.element);
        var toolBarHeight = toolbar ? toolbar.offsetHeight : 0;
        var breadcrumbBarHeight = this.element.querySelector('.e-address').offsetHeight;
        var gridHeight = this.element.clientHeight - toolBarHeight - breadcrumbBarHeight;
        return sf.base.formatUnit(this.element.clientHeight - toolBarHeight) + ' ' + sf.base.formatUnit(gridHeight);
    };
    SfFileManager.prototype.createDragObj = function () {
        var _this = this;
        var dragEle;
        var dragTarget;
        if (this.properties.view === 'LargeIcons') {
            dragEle = this.element.querySelector('.e-large-icons ul');
            dragTarget = '.' + LARGE_ICON;
        }
        else {
            dragEle = this.element.querySelector('.e-grid.e-control');
            dragTarget = '.' + ROW;
        }
        if (this.properties.draggable) {
            if (this.dragObj) {
                this.dragObj.destroy();
            }
            this.dragObj = new sf.base.Draggable(dragEle, {
                cursorAt: { left: 44, top: 18 },
                enableTailMode: true,
                dragArea: this.element,
                dragTarget: '.' + FULLROW,
                drag: this.draggingHandler.bind(this),
                dragStart: function (args) {
                    _this.dragStartHandler(args);
                },
                dragStop: this.dragStopHandler.bind(this),
                enableAutoScroll: true,
                helper: this.dragHelper.bind(this)
            });
        }
        else if (!this.properties.draggable) {
            this.dragObj.destroy();
        }
        if (this.treeviewEle) {
            if (this.treeDragObj) {
                this.treeDragObj.destroy();
            }
            this.treeDragObj = new sf.base.Draggable(this.treeviewEle, {
                cursorAt: { left: 44, top: 18 },
                enableTailMode: true,
                dragArea: this.element,
                dragTarget: dragTarget,
                drag: this.draggingHandler.bind(this),
                dragStart: function (args) {
                    _this.dragStartHandler(args);
                },
                dragStop: this.dragStopHandler.bind(this),
                enableAutoScroll: true,
                helper: this.dragHelper.bind(this)
            });
        }
        else if (!this.properties.draggable) {
            this.treeDragObj.destroy();
        }
    };
    SfFileManager.prototype.dragHelper = function (args) {
        var dragTarget = args.sender.target;
        this.getModule(dragTarget);
        if (this.activeModule === 'largeiconsview' || this.activeModule === 'navigationpane') {
            this.dragLi = sf.base.closest(dragTarget, '.e-list-item');
        }
        else if (this.activeModule === 'detailsview') {
            this.dragLi = sf.base.closest(dragTarget, 'tr.e-row');
            this.dragLi.querySelector('.e-fe-checkbox .e-checkbox-wrapper').click();
        }
        if (!this.dragLi) {
            return null;
        }
        this.createVirtualDragElement();
        return this.virtualDragElement;
    };
    SfFileManager.prototype.createVirtualDragElement = function () {
        this.updateViewElement();
        this.updateDragValues();
        this.cloneIcon = sf.base.createElement('div', {
            className: 'e-fe-icon ' + this.dragType
        });
        this.cloneName = sf.base.createElement('div', {
            className: 'e-fe-name',
            innerHTML: this.dragName
        });
        var virtualEle = sf.base.createElement('div', {
            className: 'e-fe-content'
        });
        virtualEle.appendChild(this.cloneIcon);
        virtualEle.appendChild(this.cloneName);
        var ele = sf.base.createElement('div', {
            className: CLONE
        });
        ele.appendChild(virtualEle);
        if (this.dragCount > 1) {
            var badge = sf.base.createElement('span', {
                className: 'e-fe-count',
                innerHTML: (this.dragCount).toString(10)
            });
            ele.appendChild(badge);
        }
        this.virtualDragElement = ele;
        this.element.appendChild(this.virtualDragElement);
    };
    SfFileManager.prototype.getModule = function (element) {
        if (element) {
            if (sf.base.closest(element, '.' + ROW)) {
                this.activeModule = 'detailsview';
            }
            else if (sf.base.closest(element, '.' + LARGE_ICON)) {
                this.activeModule = 'largeiconsview';
            }
            else {
                this.activeModule = 'navigationpane';
            }
        }
    };
    SfFileManager.prototype.getXYValue = function (e, direction) {
        var touchList = e.changedTouches;
        var value;
        if (direction === 'X') {
            value = touchList ? touchList[0].clientX : e.clientX;
        }
        else {
            value = touchList ? touchList[0].clientY : e.clientY;
        }
        if (!value && e.type === 'focus' && e.target) {
            var rect = e.target.getBoundingClientRect();
            value = rect ? (direction === 'X' ? rect.left : rect.top) : null;
        }
        return Math.ceil(value);
    };
    SfFileManager.prototype.removeDestroyElement = function () {
        this.dragObj.intDestroy(this.dragStartArgs.event);
        this.dragCancel();
    };
    SfFileManager.prototype.TriggerDragEvent = function (cancel) {
        if (cancel) {
            this.removeDestroyElement();
        }
    };
    SfFileManager.prototype.TriggerDragStartEvent = function (cancel) {
        if (cancel) {
            this.removeDestroyElement();
        }
        else {
            this.dragStartArgs.bindEvents(this.dragStartArgs.dragElement);
            var dragArgs = this.dragStartArgs;
            dragArgs.cancel = false;
            this.getModule(this.dragStartArgs.target);
            var rootId = this.element.querySelector('.e-navigation .e-treeview ul li').getAttribute('data-uid');
            if (!this.properties.draggable || ((this.activeModule === 'navigationpane') &&
                (sf.base.closest(this.dragStartArgs.target, 'li').getAttribute('data-uid') === rootId))) {
                dragArgs.cancel = true;
            }
            this.removeBlur();
            if (dragArgs.cancel) {
                this.removeDestroyElement();
            }
            else if (!dragArgs.cancel) {
                this.updateViewElement();
                this.blurActive();
                this.updateDragValues();
            }
        }
    };
    SfFileManager.prototype.dragStartHandler = function (args) {
        this.dragStartArgs = args;
        this.UpdateXY(args);
        this.dotnetRef.invokeMethodAsync('DragStartCall', this.dragLeft, this.dragTop);
    };
    SfFileManager.prototype.blurActive = function () {
        var i = 0;
        var activeElements = this.viewElem.querySelectorAll('.' + ACTIVE);
        while (i < activeElements.length) {
            activeElements[i].classList.add(BLUR);
            i++;
        }
    };
    SfFileManager.prototype.updateViewElement = function () {
        if (this.properties.view === 'LargeIcons') {
            this.viewElem = this.element.querySelector('.' + LARGE_ICONS);
        }
        else {
            this.viewElem = this.element.querySelector('.e-gridcontent');
        }
    };
    SfFileManager.prototype.getIconClass = function (element) {
        var iconValue = '';
        iconValue = element.querySelector('.e-list-img') ? 'e-fe-image' : element.querySelector('.e-list-icon').classList[1];
        return iconValue;
    };
    SfFileManager.prototype.updateDragValues = function () {
        var activeElements;
        if (this.activeModule === 'largeiconsview') {
            activeElements = this.viewElem.querySelectorAll('.' + ACTIVE);
            this.dragName = activeElements.length > 0 ? activeElements[0].querySelector('.e-list-text').textContent : '';
            this.dragType = activeElements.length > 0 ? this.getIconClass(activeElements[0]) : '';
        }
        else if (this.activeModule === 'detailsview') {
            activeElements = this.viewElem.querySelectorAll('tr[aria-selected="true"]');
            if (activeElements != null && activeElements.length > 0) {
                this.dragName = activeElements.length > 0 ? activeElements[0].querySelector('.e-fe-text').textContent : '';
                this.dragType = activeElements.length > 0 ? activeElements[0].querySelector('.e-fe-icon').classList[1] : '';
            }
        }
        else if (this.activeModule === 'navigationpane') {
            this.dragName = this.dragLi.querySelector('.e-list-text').textContent;
            this.dragType = 'e-fe-folder';
        }
        if (activeElements != null) {
            this.dragCount = activeElements.length;
        }
    };
    SfFileManager.prototype.getTargetModule = function (element) {
        if (element) {
            if (sf.base.closest(element, '.e-gridcontent')) {
                this.targetModule = 'detailsview';
            }
            else if (sf.base.closest(element, '.' + LARGE_ICONS)) {
                this.targetModule = 'largeiconsview';
            }
            else if (element.classList.contains('e-fullrow') ||
                element.classList.contains('e-icon-expandable')) {
                this.targetModule = 'navigationpane';
            }
            else if (sf.base.closest(element, '.e-address-list-item')) {
                this.targetModule = 'breadcrumbbar';
            }
            else {
                this.targetModule = '';
            }
        }
    };
    SfFileManager.prototype.draggingHandler = function (args) {
        var canDrop = false;
        this.updateDragValues();
        this.cloneIcon.setAttribute('class', 'e-fe-icon ' + this.dragType);
        this.cloneName.innerHTML = this.dragName;
        var node = null;
        this.blurActive();
        this.getTargetModule(args.target);
        this.removeDropTarget();
        this.removeBlur('hover');
        if (this.targetModule === 'navigationpane') {
            node = sf.base.closest(args.target, 'li');
            node.classList.add(HOVER, DROP_FOLDER);
            canDrop = true;
        }
        else if (this.targetModule === 'detailsview') {
            node = sf.base.closest(args.target, 'tr');
            if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(DROP_FOLDER);
            }
            else if (node && !node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(DROP_FILE);
            }
            canDrop = true;
        }
        else if (this.targetModule === 'largeiconsview') {
            node = sf.base.closest(args.target, 'li');
            if (node && node.querySelector('.' + FOLDER) && !node.classList.contains(BLUR)) {
                node.classList.add(HOVER, DROP_FOLDER);
            }
            canDrop = true;
        }
        else if (this.targetModule === 'breadcrumbbar') {
            canDrop = true;
        }
        this.element.classList.remove('e-fe-drop', 'e-no-drop');
        this.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
        this.UpdateXY(args);
        this.dotnetRef.invokeMethodAsync('DraggingCall', this.dragLeft, this.dragTop);
    };
    SfFileManager.prototype.UpdateXY = function (args) {
        this.dragLeft = this.getXYValue(args.event, 'X');
        this.dragTop = this.getXYValue(args.event, 'Y');
    };
    SfFileManager.prototype.dragStopHandler = function (args) {
        var dragArgs = args;
        var isLayout = false;
        dragArgs.cancel = false;
        this.removeDropTarget();
        this.element.classList.remove('e-fe-drop', 'e-no-drop');
        this.dragCancel();
        this.getTargetModule(args.target);
        if (this.targetModule === '' && args.target.classList.contains('e-view-container')) {
            isLayout = true;
        }
        this.removeBlur('hover');
        var targetElement;
        var dataValue;
        if (this.targetModule === 'largeiconsview' || this.targetModule === 'navigationpane' || this.targetModule === 'breadcrumbbar') {
            targetElement = sf.base.closest(args.target, 'li');
            var attr = this.targetModule === 'breadcrumbbar' ? 'data-utext' : 'data-uid';
            dataValue = targetElement ? targetElement.getAttribute(attr) : null;
            if (dataValue == null) {
                isLayout = true;
            }
        }
        else if (this.targetModule === 'detailsview') {
            targetElement = sf.base.closest(args.target, 'tr');
            dataValue = targetElement ? targetElement.getAttribute('aria-rowindex') : null;
        }
        var treeid = this.treeviewEle ? this.dragLi.getAttribute('data-uid') : null;
        this.UpdateXY(args);
        // tslint:disable-next-line
        this.dotnetRef.invokeMethodAsync('DragStopCall', treeid, dataValue, this.targetModule, this.activeModule, isLayout, this.dragLeft, this.dragTop);
        this.dragCount = 0;
        this.dragName = '';
        this.dragType = '';
    };
    SfFileManager.prototype.dragCancel = function () {
        this.removeBlur();
        var virtualEle = sf.base.select('.' + CLONE, this.element);
        if (virtualEle) {
            sf.base.detach(virtualEle);
        }
    };
    SfFileManager.prototype.gridBlur = function (e) {
        var target = e.target;
        if (target.tagName === 'TD') {
            target.blur();
        }
    };
    SfFileManager.prototype.removeItemClass = function (value) {
        var ele = this.element.querySelectorAll('.' + value);
        for (var i = 0; i < ele.length; i++) {
            ele[i].classList.remove(value);
        }
    };
    SfFileManager.prototype.removeDropTarget = function () {
        this.removeItemClass(DROP_FOLDER);
        this.removeItemClass(DROP_FILE);
    };
    SfFileManager.prototype.removeBlur = function (hover) {
        var blurEle = (!hover) ? this.element.querySelectorAll('.' + BLUR) :
            this.element.querySelectorAll('.' + HOVER);
        var i = 0;
        while (i < blurEle.length) {
            (!hover) ? blurEle[i].classList.remove(BLUR) : blurEle[i].classList.remove(HOVER);
            i++;
        }
    };
    SfFileManager.prototype.bindKeyboardEvent = function () {
        if (this.properties.view === 'Details') {
            var keyConfigs = {
                altEnter: 'alt+enter',
                esc: 'escape',
                tab: 'tab',
                moveDown: 'downarrow',
                ctrlEnd: 'ctrl+end',
                ctrlHome: 'ctrl+home',
                ctrlDown: 'ctrl+downarrow',
                ctrlLeft: 'ctrl+leftarrow',
                ctrlRight: 'ctrl+rightarrow',
                shiftEnd: 'shift+end',
                shiftHome: 'shift+home',
                shiftDown: 'shift+downarrow',
                shiftUp: 'shift+uparrow',
                ctrlUp: 'ctrl+uparrow',
                csEnd: 'ctrl+shift+end',
                csHome: 'ctrl+shift+home',
                csDown: 'ctrl+shift+downarrow',
                csUp: 'ctrl+shift+uparrow',
                space: 'space',
                ctrlSpace: 'ctrl+space',
                shiftSpace: 'shift+space',
                csSpace: 'ctrl+shift+space',
                end: 'end',
                home: 'home',
                moveUp: 'uparrow',
                del: 'delete',
                ctrlX: 'ctrl+x',
                ctrlC: 'ctrl+c',
                ctrlV: 'ctrl+v',
                ctrlShiftN: 'ctrl+shift+n',
                shiftdel: 'shift+delete',
                ctrlD: 'ctrl+d',
                f2: 'f2',
                ctrlA: 'ctrl+a',
                enter: 'enter'
            };
            var gridElem = this.element.querySelector('#' + this.properties.id + '_grid');
            if (gridElem) {
                this.bindKeyboardEvents(keyConfigs, gridElem);
            }
        }
        else if (this.properties.view === 'LargeIcons') {
            var keyConfigs = {
                end: 'end',
                home: 'home',
                tab: 'tab',
                moveDown: 'downarrow',
                moveLeft: 'leftarrow',
                moveRight: 'rightarrow',
                moveUp: 'uparrow',
                ctrlEnd: 'ctrl+end',
                ctrlHome: 'ctrl+home',
                ctrlDown: 'ctrl+downarrow',
                ctrlLeft: 'ctrl+leftarrow',
                ctrlRight: 'ctrl+rightarrow',
                ctrlUp: 'ctrl+uparrow',
                shiftEnd: 'shift+end',
                shiftHome: 'shift+home',
                shiftDown: 'shift+downarrow',
                shiftLeft: 'shift+leftarrow',
                shiftRight: 'shift+rightarrow',
                shiftUp: 'shift+uparrow',
                csEnd: 'ctrl+shift+end',
                csHome: 'ctrl+shift+home',
                csDown: 'ctrl+shift+downarrow',
                csLeft: 'ctrl+shift+leftarrow',
                csRight: 'ctrl+shift+rightarrow',
                csUp: 'ctrl+shift+uparrow',
                space: 'space',
                ctrlSpace: 'ctrl+space',
                shiftSpace: 'shift+space',
                csSpace: 'ctrl+shift+space',
                ctrlA: 'ctrl+a',
                enter: 'enter',
                altEnter: 'alt+enter',
                esc: 'escape',
                del: 'delete',
                ctrlX: 'ctrl+x',
                ctrlC: 'ctrl+c',
                ctrlV: 'ctrl+v',
                f2: 'f2',
                shiftdel: 'shift+delete',
                back: 'backspace',
                ctrlD: 'ctrl+d'
            };
            var largeIcons = this.element.querySelector('#' + this.properties.id + '_largeicons');
            if (largeIcons) {
                this.bindKeyboardEvents(keyConfigs, this.element);
            }
        }
    };
    SfFileManager.prototype.bindKeyboardEvents = function (keyConfigs, element) {
        this.keyboardModule = new sf.base.KeyboardEvents(element, {
            keyAction: this.keyupHandler.bind(this),
            keyConfigs: keyConfigs,
            eventName: 'keyup',
        });
        this.keyboardDownModule = new sf.base.KeyboardEvents(element, {
            keyAction: this.keydownHandler.bind(this),
            keyConfigs: keyConfigs,
            eventName: 'keydown',
        });
    };
    SfFileManager.prototype.getRowValue = function () {
        var largeIconEle = this.element.querySelector('#' + this.element.id + '_largeicons');
        var itemList = largeIconEle.querySelectorAll('.e-list-item');
        var perRow = 1;
        if (itemList) {
            for (var i = 0, len = itemList.length - 1; i < len; i++) {
                if (itemList[i].getBoundingClientRect().top === itemList[i + 1].getBoundingClientRect().top) {
                    perRow++;
                }
                else {
                    break;
                }
            }
        }
        return perRow;
    };
    // tslint:disable-next-line:max-func-body-length
    SfFileManager.prototype.keyupHandler = function (e) {
        e.preventDefault();
        var perRow = 0;
        if (this.properties.view === 'LargeIcons') {
            perRow = this.getRowValue();
        }
        var action = e.action;
        var actionValue = null;
        switch (action) {
            case 'altEnter':
                actionValue = 'Details';
                break;
            case 'del':
            case 'shiftdel':
                actionValue = 'Delete';
                break;
            case 'enter':
                actionValue = 'Open';
                break;
            case 'ctrlC':
                actionValue = 'Copy';
                break;
            case 'ctrlV':
                actionValue = 'Paste';
                break;
            case 'ctrlX':
                actionValue = 'Cut';
                break;
            case 'ctrlD':
                actionValue = 'Download';
                break;
            case 'f2':
                actionValue = 'Rename';
                break;
            case 'ctrlA':
                actionValue = 'SelectAll';
                break;
            case 'home':
                actionValue = 'Home';
                break;
            case 'end':
                actionValue = 'End';
                break;
            case 'moveDown':
                actionValue = 'MoveDown_' + perRow.toString();
                break;
            case 'moveLeft':
                actionValue = 'MoveLeft';
                break;
            case 'moveRight':
                actionValue = 'MoveRight';
                break;
            case 'moveUp':
                actionValue = 'MoveUp_' + perRow.toString();
                break;
            case 'esc':
                actionValue = 'Esc';
                break;
            case 'ctrlLeft':
                actionValue = 'ControlLeft';
                break;
            case 'ctrlRight':
                actionValue = 'ControlRight';
                break;
            case 'ctrlEnd':
                actionValue = 'ControlEnd';
                break;
            case 'ctrlHome':
                actionValue = 'ControlHome';
                break;
            case 'shiftHome':
                actionValue = 'ShiftHome';
                break;
            case 'shiftEnd':
                actionValue = 'ShiftEnd';
                break;
            case 'shiftLeft':
                actionValue = 'ShiftLeft';
                break;
            case 'shiftRight':
                actionValue = 'ShiftRight';
                break;
            case 'csHome':
                actionValue = 'ControlShiftHome';
                break;
            case 'csEnd':
                actionValue = 'ControlShiftEnd';
                break;
            case 'csLeft':
                actionValue = 'ControlShiftLeft';
                break;
            case 'csRight':
                actionValue = 'ControlShiftRight';
                break;
            case 'ctrlUp':
                actionValue = 'ControlUp_' + perRow.toString();
                break;
            case 'shiftUp':
                actionValue = 'ShiftUp_' + perRow.toString();
                break;
            case 'csUp':
                actionValue = 'ControlShiftUp_' + perRow.toString();
                break;
            case 'ctrlDown':
                actionValue = 'ControlDown_' + perRow.toString();
                break;
            case 'shiftDown':
                actionValue = 'ShiftDown_' + perRow.toString();
                break;
            case 'csDown':
                actionValue = 'ControlShiftDown_' + perRow.toString();
                break;
            case 'space':
                actionValue = 'Space';
                break;
            case 'csSpace':
                actionValue = 'ControlShiftSpace';
                break;
            case 'shiftSpace':
                actionValue = 'ShiftSpace';
                break;
            case 'ctrlSpace':
                actionValue = 'ControlSpace';
                break;
        }
        if (actionValue) {
            this.dotnetRef.invokeMethodAsync('PerformKeyboardAction', actionValue);
        }
    };
    SfFileManager.prototype.keydownHandler = function (e) {
        if (this.element.querySelector('.e-dialog.e-popup-open') == null) {
            switch (e.action) {
                case 'end':
                case 'home':
                case 'space':
                case 'ctrlSpace':
                case 'shiftSpace':
                case 'csSpace':
                case 'ctrlA':
                case 'enter':
                case 'altEnter':
                case 'ctrlEnd':
                case 'shiftEnd':
                case 'csEnd':
                case 'ctrlHome':
                case 'shiftHome':
                case 'csHome':
                case 'ctrlDown':
                case 'shiftDown':
                case 'csDown':
                case 'ctrlLeft':
                case 'shiftLeft':
                case 'csLeft':
                case 'esc':
                case 'del':
                case 'shiftdel':
                case 'ctrlC':
                case 'ctrlV':
                case 'ctrlX':
                case 'f2':
                case 'moveDown':
                case 'moveUp':
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        }
    };
    return SfFileManager;
}());
// tslint:disable-next-line
var FileManager = {
    initialize: function (element, dotnetRef, properties) {
        new SfFileManager(element, dotnetRef, properties);
        if (properties.draggable) {
            element.blazor__instance.createDragObj();
        }
        return element.blazor__instance.adjustHeight();
    },
    dragStartActionContinue: function (element, cancel) {
        if (element) {
            element.blazor__instance.TriggerDragStartEvent(cancel);
        }
    },
    dragActionContinue: function (element, cancel) {
        if (element) {
            element.blazor__instance.TriggerDragEvent(cancel);
        }
    },
    updateProperties: function (element, properties) {
        element.blazor__instance.properties = properties;
        element.blazor__instance.unWireEvents();
        element.blazor__instance.wireEvents();
        return element.blazor__instance.adjustHeight();
    },
    uploadOpen: function (element, id) {
        var uploadElement = element.querySelector('#' + id);
        if (uploadElement) {
            uploadElement.click();
        }
    },
    updateView: function (element, view) {
        if (element) {
            element.blazor__instance.properties.view = view;
            element.blazor__instance.bindKeyboardEvent();
        }
    },
    updateGridRow: function (gridEle, index) {
        if (gridEle) {
            var selectedElements = gridEle.querySelectorAll('tr.e-row[tabindex="0"]');
            for (var i = 0; i < selectedElements.length; i++) {
                selectedElements[i].removeAttribute('tabindex');
            }
            var element1 = gridEle.querySelector('[aria-rowindex="' + index + '"]');
            if (element1) {
                element1.setAttribute('tabindex', '0');
                element1.focus();
            }
        }
    },
    // tslint:disable-next-line
    saveFile: function (filename, url, element) {
        // tslint:disable-next-line
        var data = { 'action': 'download', 'path': filename.path, 'names': filename.names, 'data': filename.data };
        var form = sf.base.createElement('form', {
            id: element.id + '_downloadForm',
            attrs: { action: url, method: 'post', name: 'downloadForm', 'download': '' }
        });
        var input = sf.base.createElement('input', {
            id: element.id + '_hiddenForm',
            attrs: { name: 'downloadInput', value: JSON.stringify(data), type: 'hidden' }
        });
        form.appendChild(input);
        document.body.appendChild(form);
        document.forms.namedItem('downloadForm').submit();
        document.body.removeChild(form);
    },
    getTargetElement: function (view, x, y) {
        var element = document.elementFromPoint(x, y);
        var targetElement;
        var menuModel;
        var treeElement = sf.base.closest(element, 'li[role="treeitem"]');
        if (!element) {
            menuModel = { IsFile: false, RowIndex: null, IsFolder: false, IsLayout: false, IsTree: false };
        }
        else {
            if ((element.classList.contains('e-yscroll') && element.classList.contains('e-content')) ||
                (element.classList.contains('e-list-parent') && element.classList.contains('e-ul')) ||
                element.classList.contains('e-view-container') || element.classList.contains('e-large-icons')
                || sf.base.closest(element, '.e-empty.e-view-container')) {
                menuModel = { IsFile: false, RowIndex: null, IsFolder: false, IsLayout: true, IsTree: false };
            }
            else if (treeElement) {
                var dataid = parseInt(treeElement.getAttribute('data-uid'), 10);
                menuModel = { IsFile: false, RowIndex: dataid, IsFolder: true, IsLayout: false, IsTree: true };
            }
            else {
                if (view === 'Details') {
                    targetElement = sf.base.closest(element, 'tr');
                    var isFile = !(targetElement.querySelector('.e-fe-grid-icon .e-fe-icon').classList.contains('e-fe-folder'));
                    var rowIndex = parseInt(targetElement.getAttribute('aria-rowindex'), 10);
                    menuModel = { IsFile: isFile, RowIndex: rowIndex, IsFolder: !isFile, IsLayout: false, IsTree: false };
                }
                else if (view === 'LargeIcons') {
                    targetElement = sf.base.closest(element, 'li');
                    var iconEle = targetElement.querySelector('.e-list-icon');
                    var isFile = iconEle ? !(iconEle.classList.contains('e-fe-folder')) : true;
                    var rowIndex = parseInt(targetElement.getAttribute('data-uid'), 10);
                    menuModel = { IsFile: isFile, RowIndex: rowIndex, IsFolder: !isFile, IsLayout: false, IsTree: false };
                }
            }
        }
        return menuModel;
    }
};

return FileManager;

}());
