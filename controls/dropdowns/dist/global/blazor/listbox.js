window.sf = window.sf || {};
var sflistbox = (function (exports) {
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
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
var ITEMTEMPLATE_PROPERTY = 'ItemTemplate';
/**
 * Defines the Selection settings of List Box.
 */
var SelectionSettings = /** @class */ (function (_super) {
    __extends(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('Multiple')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "showCheckbox", void 0);
    __decorate([
        sf.base.Property(false)
    ], SelectionSettings.prototype, "showSelectAll", void 0);
    __decorate([
        sf.base.Property('Left')
    ], SelectionSettings.prototype, "checkboxPosition", void 0);
    return SelectionSettings;
}(sf.base.ChildProperty));
/**
 * Defines the toolbar settings of List Box.
 */
var ToolbarSettings = /** @class */ (function (_super) {
    __extends(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property([])
    ], ToolbarSettings.prototype, "items", void 0);
    __decorate([
        sf.base.Property('Right')
    ], ToolbarSettings.prototype, "position", void 0);
    return ToolbarSettings;
}(sf.base.ChildProperty));
/**
 * The ListBox is a graphical user interface component used to display a list of items.
 * Users can select one or more items in the list using a checkbox or by keyboard selection.
 * It supports sorting, grouping, reordering and drag and drop of items.
 * ```html
 * <select id="listbox">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var listObj = new ListBox();
 *   listObj.appendTo("#listbox");
 * </script>
 * ```
 */
var ListBox = /** @class */ (function (_super) {
    __extends(ListBox, _super);
    /**
     * Constructor for creating the ListBox component.
     */
    function ListBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isValidKey = false;
        _this.keyDownStatus = false;
        return _this;
    }
    ListBox_1 = ListBox;
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @private
     */
    ListBox.prototype.addItem = function (items, itemIndex) {
        _super.prototype.addItem.call(this, items, itemIndex);
    };
    
    /**
     * Build and render the component
     * @private
     */
    ListBox.prototype.render = function () {
        this.inputString = '';
        this.initLoad = true;
        this.isCustomFiltering = false;
        this.initialSelectedOptions = this.value;
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.list = this.element.parentElement;
            this.liCollections = this.list.querySelectorAll('.' + sf.lists.cssClass.li);
            this.mainList = this.ulElement = this.list.querySelector('ul');
            this.setSelection(this.value);
            if (this.allowFiltering) {
                this.setFiltering();
            }
            this.initToolbarAndStyles();
            this.updateSelectionSettings();
            this.wireEvents();
            this.initDraggable();
            this.initLoad = false;
        }
        else {
            _super.prototype.render.call(this);
        }
        this.renderComplete();
    };
    ListBox.prototype.updateBlazorListData = function (data, isDataSource, select$$1) {
        if (isDataSource) {
            this.liCollections = this.list.querySelectorAll('.' + sf.lists.cssClass.li);
            this.mainList = this.ulElement = this.list.querySelector('ul');
            if (this.allowDragAndDrop && !this.ulElement.classList.contains('e-sortable')) {
                this.initDraggable();
            }
            if (select$$1) {
                this.selectItems(this.listData, false);
            }
        }
        if (!sf.base.isNullOrUndefined(data)) {
            this.sortedData = this.jsonData = this.listData = data;
        }
    };
    ListBox.prototype.initWrapper = function () {
        var hiddenSelect = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        this.list.classList.add('e-listbox-wrapper');
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
        this.list.classList.add('e-wrapper');
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.setAttribute('tabindex', '0');
            if (this.initLoad) {
                this.element.appendChild(this.list);
            }
        }
        else {
            if (this.initLoad) {
                this.element.parentElement.insertBefore(this.list, this.element);
            }
            this.list.insertBefore(this.element, this.list.firstChild);
            this.element.style.display = 'none';
        }
        this.list.insertBefore(hiddenSelect, this.list.firstChild);
        if (this.list.getElementsByClassName('e-list-item')[0]) {
            this.list.getElementsByClassName('e-list-item')[0].classList.remove(sf.dropdowns.dropDownBaseClasses.focus);
        }
        sf.base.removeClass([this.list], [sf.dropdowns.dropDownBaseClasses.content, sf.dropdowns.dropDownBaseClasses.root]);
        this.validationAttribute(this.element, hiddenSelect);
        this.list.setAttribute('role', 'listbox');
        sf.base.attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        this.updateSelectionSettings();
    };
    ListBox.prototype.updateSelectionSettings = function () {
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            var l10nSelect = new sf.base.L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
            this.showSelectAll = true;
            this.selectAllText = l10nSelect.getConstant('selectAllText');
            this.unSelectAllText = l10nSelect.getConstant('unSelectAllText');
            this.popupWrapper = this.list;
            this.checkBoxSelectionModule.checkAllParent = null;
            this.notify('selectAll', {});
        }
    };
    ListBox.prototype.initDraggable = function () {
        var _this = this;
        if (this.ulElement) {
            this.ulElement.id = this.element.id + '_parent';
        }
        if (this.allowDragAndDrop) {
            new sf.lists.Sortable(this.ulElement, {
                scope: this.scope,
                itemClass: 'e-list-item',
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                beforeDrop: this.beforeDragEnd.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: function () { return _this.createElement('span', { className: 'e-placeholder' }); },
                helper: function (e) {
                    var wrapper = _this.list.cloneNode();
                    var ele = e.sender.cloneNode(true);
                    wrapper.appendChild(ele);
                    var refEle = _this.getItems()[0];
                    wrapper.style.width = refEle.offsetWidth + 'px';
                    wrapper.style.height = refEle.offsetHeight + 'px';
                    if ((_this.value && _this.value.length) > 1 && _this.isSelected(ele)) {
                        ele.appendChild(_this.createElement('span', {
                            className: 'e-list-badge', innerHTML: _this.value.length + ''
                        }));
                    }
                    wrapper.style.zIndex = sf.popups.getZindexPartial(_this.element) + '';
                    return wrapper;
                }
            });
        }
    };
    ListBox.prototype.updateActionCompleteData = function (li, item) {
        this.jsonData.push(item);
    };
    ListBox.prototype.initToolbar = function () {
        var scope;
        var pos = this.toolbarSettings.position;
        var prevScope = this.element.getAttribute('data-value');
        if (this.toolbarSettings.items.length) {
            var toolElem = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            var wrapper = this.createElement('div', {
                className: 'e-listboxtool-wrapper e-' + pos.toLowerCase()
            });
            this.list.parentElement.insertBefore(wrapper, this.list);
            wrapper.appendChild(pos === 'Right' ? this.list : toolElem);
            wrapper.appendChild(pos === 'Right' ? toolElem : this.list);
            this.createButtons(toolElem);
            if (!this.element.id) {
                this.element.id = sf.base.getUniqueID('e-' + this.getModuleName());
            }
            if (this.scope) {
                document.querySelector(this.scope).setAttribute('data-value', this.element.id);
            }
            else {
                this.updateToolBarState();
            }
        }
        scope = this.element.getAttribute('data-value');
        if (prevScope && scope && (prevScope !== scope)) {
            this.tBListBox = sf.base.getComponent(document.getElementById(prevScope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
        else if (scope) {
            this.tBListBox = sf.base.getComponent(document.getElementById(scope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
    };
    ListBox.prototype.createButtons = function (toolElem) {
        var _this = this;
        var btn;
        var ele;
        var title;
        var l10n = new sf.base.L10n(this.getModuleName(), {
            moveUp: 'Move Up', moveDown: 'Move Down', moveTo: 'Move To',
            moveFrom: 'Move From', moveAllTo: 'Move All To', moveAllFrom: 'Move All From'
        }, this.locale);
        this.toolbarSettings.items.forEach(function (value) {
            title = l10n.getConstant(value);
            ele = _this.createElement('button', {
                attrs: {
                    'type': 'button',
                    'data-value': value,
                    'title': title,
                    'aria-label': title
                }
            });
            toolElem.appendChild(ele);
            btn = new sf.buttons.Button({ iconCss: 'e-icons e-' + value.toLowerCase() }, ele);
            btn.createElement = _this.createElement;
        });
    };
    ListBox.prototype.validationAttribute = function (input, hiddenSelect) {
        _super.prototype.validationAttribute.call(this, input, hiddenSelect);
        hiddenSelect.required = input.required;
        input.required = false;
    };
    ListBox.prototype.setHeight = function () {
        var ele = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        ele.style.height = sf.base.formatUnit(this.height);
        if (this.allowFiltering && this.height.toString().indexOf('%') < 0) {
            sf.base.addClass([this.list], 'e-filter-list');
        }
        else {
            sf.base.removeClass([this.list], 'e-filter-list');
        }
    };
    ListBox.prototype.setCssClass = function () {
        var wrap = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            sf.base.addClass([wrap], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            sf.base.addClass([wrap], 'e-rtl');
        }
    };
    ListBox.prototype.setEnable = function () {
        var ele = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            sf.base.removeClass([ele], sf.lists.cssClass.disabled);
        }
        else {
            sf.base.addClass([ele], sf.lists.cssClass.disabled);
            if (sf.base.isBlazor() && this.isServerRendered && this.toolbarSettings.items.length) {
                sf.base.removeClass([this.list], sf.lists.cssClass.disabled);
            }
        }
    };
    ListBox.prototype.showSpinner = function () {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper' });
        }
        this.spinner.style.height = sf.base.formatUnit(this.height);
        this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        sf.popups.createSpinner({ target: this.spinner }, this.createElement);
        sf.popups.showSpinner(this.spinner);
    };
    ListBox.prototype.hideSpinner = function () {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            sf.popups.hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            sf.base.detach(this.spinner);
        }
    };
    ListBox.prototype.onInput = function () {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        }
        else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
        this.refreshClearIcon();
    };
    ListBox.prototype.clearText = function () {
        this.filterInput.value = '';
        this.refreshClearIcon();
        var event = document.createEvent('KeyboardEvent');
        this.isValidKey = true;
        this.KeyUp(event);
    };
    ListBox.prototype.refreshClearIcon = function () {
        if (this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon)) {
            var clearElement = this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
    };
    ListBox.prototype.onActionComplete = function (ulElement, list, e) {
        var searchEle;
        if (this.allowFiltering && this.list.getElementsByClassName('e-filter-parent')[0]) {
            if (sf.base.isBlazor() && this.isServerRendered) {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0];
            }
            else {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0].cloneNode(true);
            }
        }
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        if (this.allowFiltering && !sf.base.isNullOrUndefined(searchEle)) {
            this.list.insertBefore(searchEle, this.list.firstElementChild);
            if (!sf.base.isBlazor() && !this.isServerRendered) {
                this.filterParent = this.list.getElementsByClassName('e-filter-parent')[0];
                this.filterWireEvents(searchEle);
            }
        }
        this.initWrapper();
        this.setSelection();
        this.initDraggable();
        this.mainList = this.ulElement;
        if (this.initLoad) {
            this.jsonData = [];
            sf.base.extend(this.jsonData, list, []);
            this.initToolbarAndStyles();
            this.wireEvents();
            if (this.showCheckbox) {
                this.setCheckboxPosition();
            }
            if (this.allowFiltering) {
                this.setFiltering();
            }
        }
        else {
            if (this.allowFiltering) {
                var filterElem = this.list.getElementsByClassName('e-input-filter')[0];
                var txtLength = this.filterInput.value.length;
                filterElem.selectionStart = txtLength;
                filterElem.selectionEnd = txtLength;
                filterElem.focus();
            }
        }
        this.initLoad = false;
    };
    ListBox.prototype.initToolbarAndStyles = function () {
        this.initToolbar();
        this.setCssClass();
        this.setEnable();
        this.setHeight();
    };
    ListBox.prototype.triggerDragStart = function (args) {
        var _this = this;
        var badge;
        args = sf.base.extend(this.getDragArgs(args), { dragSelected: true });
        if (sf.base.Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', args, function (dragEventArgs) {
            _this.allowDragAll = dragEventArgs.dragSelected;
            if (!_this.allowDragAll) {
                badge = _this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) {
                    sf.base.detach(badge);
                }
            }
            if (sf.base.isBlazor()) {
                args.bindEvents(args.dragElement);
            }
        });
    };
    ListBox.prototype.triggerDrag = function (args) {
        this.trigger('drag', this.getDragArgs(args));
        var listObj = this.getComponent(args.target);
        if (listObj && listObj.listData.length === 0) {
            var noRecElem = listObj.ulElement.getElementsByClassName('e-list-nrt')[0];
            if (noRecElem) {
                listObj.ulElement.removeChild(noRecElem);
            }
        }
    };
    ListBox.prototype.beforeDragEnd = function (args) {
        var dragValue = args.droppedElement.getAttribute('data-value');
        if (this.value.indexOf(dragValue) > -1) {
            args.items = this.getDataByValues(this.value);
        }
        else {
            args.items = this.getDataByValues([dragValue]);
        }
        this.trigger('beforeDrop', args);
    };
    // tslint:disable-next-line:max-func-body-length
    ListBox.prototype.dragEnd = function (args) {
        var _this = this;
        var listData;
        var liColl;
        var jsonData;
        var droppedData;
        var selectedOptions;
        var sortedData;
        var dropValue = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        var listObj = this.getComponent(args.droppedElement);
        var getArgs = this.getDragArgs({ target: args.droppedElement }, true);
        var sourceArgs = { previousData: this.dataSource };
        var destArgs = { previousData: listObj.dataSource };
        var dragArgs = sf.base.extend({}, getArgs, { target: args.target, source: { previousData: this.dataSource } });
        if (listObj !== this) {
            var sourceArgs1 = sf.base.extend(sourceArgs, { currentData: this.listData });
            dragArgs = sf.base.extend(dragArgs, { source: sourceArgs1, destination: destArgs });
        }
        if (sf.base.Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            var ul_1 = this.ulElement;
            listData = [].slice.call(this.listData);
            liColl = [].slice.call(this.liCollections);
            jsonData = [].slice.call(this.jsonData);
            sortedData = [].slice.call(this.sortedData);
            var toSortIdx_1 = args.currentIndex;
            var toIdx_1 = args.currentIndex = this.getCurIdx(this, args.currentIndex);
            var rIdx = listData.indexOf(this.getDataByValue(dropValue));
            var jsonIdx = jsonData.indexOf(this.getDataByValue(dropValue));
            var sIdx = sortedData.indexOf(this.getDataByValue(dropValue));
            listData.splice(toIdx_1, 0, listData.splice(rIdx, 1)[0]);
            sortedData.splice(toSortIdx_1, 0, sortedData.splice(sIdx, 1)[0]);
            jsonData.splice(toIdx_1, 0, jsonData.splice(jsonIdx, 1)[0]);
            if (!sf.base.isBlazor()) {
                liColl.splice(toIdx_1, 0, liColl.splice(rIdx, 1)[0]);
            }
            if (this.allowDragAll) {
                selectedOptions = this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
                selectedOptions.forEach(function (value) {
                    if (value !== dropValue) {
                        var idx = listData.indexOf(_this.getDataByValue(value));
                        var jsonIdx_1 = jsonData.indexOf(_this.getDataByValue(value));
                        var sIdx_1 = sortedData.indexOf(_this.getDataByValue(value));
                        if (idx > toIdx_1) {
                            toIdx_1++;
                        }
                        jsonData.splice(toIdx_1, 0, jsonData.splice(jsonIdx_1, 1)[0]);
                        listData.splice(toIdx_1, 0, listData.splice(idx, 1)[0]);
                        sortedData.splice(toSortIdx_1, 0, sortedData.splice(sIdx_1, 1)[0]);
                        if (!sf.base.isBlazor()) {
                            liColl.splice(toIdx_1, 0, liColl.splice(idx, 1)[0]);
                            ul_1.insertBefore(_this.getItems()[_this.getIndexByValue(value)], ul_1.getElementsByClassName('e-placeholder')[0]);
                        }
                    }
                    else if (sf.base.isBlazor()) {
                        var lists = [].slice.call(_this.ulElement.getElementsByClassName(sf.lists.cssClass.li));
                        var refChild = _this.ulElement.removeChild(lists[args.currentIndex]);
                        lists.splice(args.currentIndex, 1);
                        _this.ulElement.insertBefore(refChild, lists[args.previousIndex]);
                    }
                });
            }
            this.listData = listData;
            this.jsonData = jsonData;
            this.sortedData = sortedData;
            this.liCollections = liColl;
            if (sf.base.isBlazor()) {
                var value_1 = this.value;
                // tslint:disable-next-line:no-any
                this.interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then(function () {
                    _this.updateBlazorListData(null, true);
                    _this.selectItems(_this.listData, false);
                    _this.selectItems(value_1);
                });
            }
        }
        else {
            var li_1;
            var fLiColl_1 = [].slice.call(this.liCollections);
            var currIdx_1 = args.currentIndex = this.getCurIdx(listObj, args.currentIndex);
            var ul_2 = listObj.ulElement;
            listData = [].slice.call(listObj.listData);
            liColl = [].slice.call(listObj.liCollections);
            jsonData = [].slice.call(listObj.jsonData);
            sortedData = [].slice.call(listObj.sortedData);
            selectedOptions = (this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 && this.allowDragAll)
                ? this.value : [dropValue];
            var fListData_1 = [].slice.call(this.listData);
            var fSortData_1 = [].slice.call(this.sortedData);
            selectedOptions.forEach(function (value, index) {
                droppedData = _this.getDataByValue(value);
                var srcIdx = _this.listData.indexOf(droppedData);
                var jsonSrcIdx = _this.jsonData.indexOf(droppedData);
                var sortIdx = _this.sortedData.indexOf(droppedData);
                fListData_1.splice(srcIdx, 1);
                _this.jsonData.splice(jsonSrcIdx, 1);
                fSortData_1.splice(sortIdx, 1);
                _this.listData = fListData_1;
                _this.sortedData = fSortData_1;
                var destIdx = value === dropValue ? args.currentIndex : currIdx_1;
                listData.splice(destIdx, 0, droppedData);
                jsonData.splice(destIdx, 0, droppedData);
                sortedData.splice(destIdx, 0, droppedData);
                if (!sf.base.isBlazor()) {
                    liColl.splice(destIdx, 0, fLiColl_1.splice(srcIdx, 1)[0]);
                }
                if (!value) {
                    var liCollElem = _this.getItems();
                    for (var i = 0; i < liCollElem.length; i++) {
                        if (liCollElem[i].getAttribute('data-value') === null && liCollElem[i].classList.contains('e-list-item')) {
                            li_1 = liCollElem[i];
                            break;
                        }
                    }
                }
                else {
                    li_1 = _this.getItems()[_this.getIndexByValue(value)];
                }
                if (!li_1) {
                    li_1 = args.helper;
                }
                _this.removeSelected(_this, value === dropValue ? [args.droppedElement] : [li_1]);
                if (sf.base.isBlazor()) {
                    if (index === 0) {
                        _this.ulElement.insertBefore(ul_2.getElementsByClassName(sf.lists.cssClass.li)[args.currentIndex], _this.ulElement.getElementsByClassName(sf.lists.cssClass.li)[args.previousIndex]);
                    }
                }
                else {
                    ul_2.insertBefore(li_1, ul_2.getElementsByClassName('e-placeholder')[0]);
                }
                currIdx_1++;
            });
            if (sf.base.isBlazor()) {
                // tslint:disable
                this.interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then(function () {
                    _this.updateSelectedOptions();
                    if (_this.fields.groupBy) {
                        _this.setSelection();
                    }
                    _this.updateBlazorListData(null, true, _this.value == null || !_this.value.length);
                });
                listObj.interopAdaptor.invokeMethodAsync('UpdateListData', listData).then(function () {
                    if (listObj.sortOrder !== 'None' || _this.selectionSettings.showCheckbox
                        !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                        listObj.setSelection();
                    }
                    listObj.updateBlazorListData(null, true, listObj.value == null || !listObj.value.length);
                });
                // tslint:enable
            }
            else {
                if (this.fields.groupBy) {
                    this.ulElement.innerHTML = this.renderItems(this.listData, this.fields).innerHTML;
                    this.setSelection();
                }
                if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                    !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                    var sortabale = sf.base.getComponent(ul_2, 'sortable');
                    ul_2.innerHTML = listObj.renderItems(listData, listObj.fields).innerHTML;
                    if (sortabale.placeHolderElement) {
                        ul_2.appendChild(sortabale.placeHolderElement);
                    }
                    ul_2.appendChild(args.helper);
                    listObj.setSelection();
                }
                this.liCollections = fLiColl_1;
                listObj.liCollections = liColl;
            }
            listObj.jsonData = sf.base.extend([], [], jsonData, false);
            listObj.listData = sf.base.extend([], [], listData, false);
            listObj.sortedData = sf.base.extend([], [], sortedData, false);
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        if (this === listObj) {
            var sourceArgs1 = sf.base.extend(sourceArgs, { currentData: listData });
            dragArgs = sf.base.extend(dragArgs, { source: sourceArgs1 });
        }
        else {
            var dragArgs1 = sf.base.extend(destArgs, { currentData: listData });
            dragArgs = sf.base.extend(dragArgs, { destination: dragArgs1 });
        }
        this.trigger('drop', dragArgs);
    };
    ListBox.prototype.removeSelected = function (listObj, elems) {
        if (listObj.selectionSettings.showCheckbox) {
            elems.forEach(function (ele) { ele.getElementsByClassName('e-frame')[0].classList.remove('e-check'); });
        }
        else {
            sf.base.removeClass(elems, sf.lists.cssClass.selected);
        }
    };
    ListBox.prototype.getCurIdx = function (listObj, idx) {
        if (listObj.fields.groupBy) {
            idx -= [].slice.call(listObj.ulElement.children).slice(0, idx)
                .filter(function (ele) { return ele.classList.contains(sf.lists.cssClass.group); }).length;
        }
        return idx;
    };
    ListBox.prototype.getComponent = function (li) {
        var listObj;
        var ele = (this.element.tagName === 'EJS-LISTBOX' ? sf.base.closest(li, '.e-listbox')
            : sf.base.closest(li, '.e-listbox-wrapper') && sf.base.closest(li, '.e-listbox-wrapper').querySelector('.e-listbox'));
        if (ele) {
            listObj = sf.base.getComponent(ele, this.getModuleName());
        }
        return listObj;
    };
    ListBox.prototype.listOption = function (dataSource, fields) {
        this.listCurrentOptions = _super.prototype.listOption.call(this, dataSource, fields);
        this.listCurrentOptions = sf.base.extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
        this.notify('listoption', { module: 'CheckBoxSelection' });
        return this.listCurrentOptions;
    };
    ListBox.prototype.triggerBeforeItemRender = function (e) {
        e.item.setAttribute('tabindex', '-1');
        this.trigger('beforeItemRender', { element: e.item, item: e.curData });
    };
    ListBox.prototype.requiredModules = function () {
        var modules = [];
        if (this.selectionSettings.showCheckbox) {
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * This method is used to enable or disable the items in the ListBox based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    ListBox.prototype.enableItems = function (items, enable, isValue) {
        var _this = this;
        if (enable === void 0) { enable = true; }
        var li;
        items.forEach(function (item) {
            var text;
            if (sf.base.isBlazor() && typeof (item) === 'object') {
                text = sf.base.getValue(isValue ? _this.fields.value : _this.fields.text, item);
                if (sf.base.isNullOrUndefined(text)) {
                    return;
                }
            }
            else {
                text = item;
            }
            li = _this.findListElement(_this.list, 'li', 'data-value', isValue ? text : _this.getValueByText(text));
            if (!li) {
                return;
            }
            if (enable) {
                sf.base.removeClass([li], sf.lists.cssClass.disabled);
                li.removeAttribute('aria-disabled');
            }
            else {
                sf.base.addClass([li], sf.lists.cssClass.disabled);
                li.setAttribute('aria-disabled', 'true');
            }
        });
    };
    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     * @param items Array of text value of the item.
     * @param state Set `true`/`false` to select/un select the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    ListBox.prototype.selectItems = function (items, state, isValue) {
        if (state === void 0) { state = true; }
        this.setSelection(items, state, !isValue);
        this.updateSelectedOptions();
    };
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * @param state Set `true`/`false` to select/un select the entire list items.
     * @returns void
     */
    ListBox.prototype.selectAll = function (state) {
        if (state === void 0) { state = true; }
        this.selectAllItems(state);
    };
    /**
     * Adds a new item to the list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the list.
     * @returns {void}.
     */
    ListBox.prototype.addItems = function (items, itemIndex) {
        _super.prototype.addItem.call(this, items, itemIndex);
    };
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    ListBox.prototype.removeItems = function (items, itemIndex) {
        this.removeItem(items, itemIndex);
    };
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    ListBox.prototype.removeItem = function (items, itemIndex) {
        var liCollections = [];
        var liElement = this.list.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.li);
        if (items) {
            items = (items instanceof Array ? items : [items]);
            var fields = this.fields;
            var dataValue = void 0;
            var objValue = void 0;
            var dupData = [];
            var itemIdx = void 0;
            sf.base.extend(dupData, [], this.listData);
            var removeIdxes = [];
            var removeLiIdxes = [];
            for (var j = 0; j < items.length; j++) {
                if (items[j] instanceof Object) {
                    dataValue = sf.base.getValue(fields.value, items[j]);
                }
                else {
                    dataValue = items[j].toString();
                }
                for (var i = 0, len = dupData.length; i < len; i++) {
                    if (dupData[i] instanceof Object) {
                        objValue = sf.base.getValue(fields.value, dupData[i]);
                    }
                    else {
                        objValue = dupData[i].toString();
                    }
                    if (objValue === dataValue) {
                        itemIdx = this.getIndexByValue(dataValue);
                        liCollections.push(liElement[itemIdx]);
                        removeIdxes.push(i);
                        removeLiIdxes.push(itemIdx);
                    }
                }
            }
            for (var k = removeIdxes.length - 1; k > 0; k--) {
                this.listData.splice(removeIdxes[k], 1);
            }
            for (var k = removeLiIdxes.length - 1; k > 0; k--) {
                this.liCollections.splice(removeLiIdxes[k], 1);
            }
        }
        else {
            itemIndex = itemIndex ? itemIndex : 0;
            liCollections.push(liElement[itemIndex]);
            this.listData.splice(itemIndex, 1);
            this.updateLiCollection(itemIndex);
        }
        for (var i = 0; i < liCollections.length; i++) {
            this.ulElement.removeChild(liCollections[i]);
        }
        if (this.listData.length === 0) {
            this.l10nUpdate();
        }
    };
    /**
     * Gets the array of data Object that matches the given array of values.
     * @param  { string[] | number[] | boolean[] } value - Specifies the array value of the list item.
     * @returns object[].
     */
    ListBox.prototype.getDataByValues = function (value) {
        var data = [];
        for (var i = 0; i < value.length; i++) {
            data.push(this.getDataByValue(value[i]));
        }
        return data;
    };
    /**
     * Moves the given value(s) / selected value(s) upwards.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    ListBox.prototype.moveUp = function (value) {
        var elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(true, false, elem);
    };
    /**
     * Moves the given value(s) / selected value(s) downwards.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    ListBox.prototype.moveDown = function (value) {
        var elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(false, false, elem);
    };
    /**
     * Moves the given value(s) / selected value(s) to the given / default scoped ListBox.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value or array value of the list item.
     * @returns {void}
     */
    ListBox.prototype.moveTo = function (value, index, targetId) {
        var elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        var tlistbox = (targetId) ? sf.base.getComponent(targetId, ListBox_1) : this.getScopedListBox();
        this.moveData(this, tlistbox, false, elem, index);
    };
    /**
     * Moves all the values from one ListBox to the scoped ListBox.
     * @param  { string } targetId - Specifies the scoped ListBox ID.
     * @param  { string } index - Specifies the index to where the items moved.
     * @returns {void}
     */
    ListBox.prototype.moveAllTo = function (targetId, index) {
        var tlistbox = (targetId) ? sf.base.getComponent(targetId, ListBox_1) : this.getScopedListBox();
        this.moveAllData(this, tlistbox, false, index);
    };
    /**
     * Returns the updated dataSource in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    ListBox.prototype.getDataList = function () {
        return this.jsonData;
    };
    /**
     * Returns the sorted Data in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    ListBox.prototype.getSortedList = function () {
        var sortData;
        var tempData;
        sortData = tempData = this.sortedData;
        if (this.fields.groupBy) {
            sortData = [];
            for (var i = 0; i < tempData.length; i++) {
                if (tempData[i].isHeader) {
                    continue;
                }
                sortData.push(tempData[i]);
            }
        }
        return sortData;
    };
    ListBox.prototype.getElemByValue = function (value) {
        var elem = [];
        for (var i = 0; i < value.length; i++) {
            elem.push(this.ulElement.querySelector('[data-value ="' + value[i] + '"]'));
        }
        return elem;
    };
    ListBox.prototype.updateLiCollection = function (index) {
        var tempLi = [].slice.call(this.liCollections);
        tempLi.splice(index, 1);
        this.liCollections = tempLi;
    };
    ListBox.prototype.selectAllItems = function (state, event) {
        var _this = this;
        [].slice.call(this.getItems()).forEach(function (li) {
            if (!li.classList.contains(sf.lists.cssClass.disabled)) {
                if (_this.selectionSettings.showCheckbox) {
                    var ele = li.getElementsByClassName('e-check')[0];
                    if ((!ele && state) || (ele && !state)) {
                        _this.notify('updatelist', { li: li, module: 'listbox' });
                        if (_this.maximumSelectionLength >= _this.list.querySelectorAll('.e-list-item span.e-check').length) {
                            _this.checkMaxSelection();
                        }
                    }
                }
                else {
                    if (state) {
                        li.classList.add(sf.lists.cssClass.selected);
                    }
                    else {
                        li.classList.remove(sf.lists.cssClass.selected);
                    }
                }
            }
        });
        this.updateSelectedOptions();
        if (this.allowFiltering && this.selectionSettings.showCheckbox) {
            var liEle = this.list.getElementsByTagName('li');
            var index = 0;
            if (state) {
                var _loop_1 = function () {
                    var dataValue1 = this_1.getFormattedValue(liEle[index].getAttribute('data-value'));
                    if (!this_1.value.some(function (e) { return e === dataValue1; })) {
                        this_1.value.push(this_1.getFormattedValue(liEle[index].getAttribute('data-value')));
                    }
                };
                var this_1 = this;
                for (index = 0; index < liEle.length; index++) {
                    _loop_1();
                }
            }
            else {
                var _loop_2 = function () {
                    var dataValue2 = this_2.getFormattedValue(liEle[index].getAttribute('data-value'));
                    this_2.value = this_2.value.filter(function (e) { return e !== dataValue2; });
                };
                var this_2 = this;
                for (index = 0; index < liEle.length; index++) {
                    _loop_2();
                }
            }
            if (document.querySelectorAll('ul').length < 2) {
                this.updateMainList();
            }
        }
        this.triggerChange(this.getSelectedItems(), event);
    };
    ListBox.prototype.updateMainList = function () {
        var mainList = this.mainList.querySelectorAll('.e-list-item');
        var ulList = this.ulElement.querySelectorAll('.e-list-item');
        var mainCount = mainList.length;
        var ulEleCount = ulList.length;
        if (this.selectionSettings.showCheckbox || (document.querySelectorAll('ul').length > 1 || mainCount !== ulEleCount)) {
            var listindex = 0;
            var valueindex = 0;
            var count = 0;
            for (listindex; listindex < mainCount;) {
                if (this.value) {
                    for (valueindex; valueindex < this.value.length; valueindex++) {
                        if (mainList[listindex].getAttribute('data-value') === this.value[valueindex]) {
                            count++;
                        }
                    }
                }
                if (!count && this.selectionSettings.showCheckbox) {
                    mainList[listindex].getElementsByClassName('e-frame')[0].classList.remove('e-check');
                }
                if (document.querySelectorAll('ul').length > 1 && count && mainCount !== ulEleCount) {
                    this.mainList.removeChild(this.mainList.getElementsByTagName('li')[listindex]);
                    listindex = 0;
                }
                else {
                    listindex++;
                }
                count = 0;
                valueindex = 0;
            }
        }
    };
    ListBox.prototype.wireEvents = function () {
        var form = sf.base.closest(this.element, 'form');
        var wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        sf.base.EventHandler.add(this.list, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
        sf.base.EventHandler.add(wrapper, 'focusout', this.focusOutHandler, this);
        this.wireToolbarEvent();
        if (this.selectionSettings.showCheckbox) {
            sf.base.EventHandler.remove(document, 'mousedown', this.checkBoxSelectionModule.onDocumentClick);
        }
        if (this.fields.groupBy || this.element.querySelector('select>optgroup')) {
            sf.base.EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
        }
        if (form) {
            sf.base.EventHandler.add(form, 'reset', this.formResetHandler, this);
        }
    };
    ListBox.prototype.wireToolbarEvent = function () {
        if (this.toolbarSettings.items.length) {
            sf.base.EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
    };
    ListBox.prototype.unwireEvents = function () {
        var form = sf.base.closest(this.element, 'form');
        var wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        sf.base.EventHandler.remove(this.list, 'click', this.clickHandler);
        sf.base.EventHandler.remove(wrapper, 'keydown', this.keyDownHandler);
        sf.base.EventHandler.remove(wrapper, 'focusout', this.focusOutHandler);
        if (this.allowFiltering && this.clearFilterIconElem) {
            sf.base.EventHandler.remove(this.clearFilterIconElem, 'click', this.clearText);
        }
        if (this.toolbarSettings.items.length) {
            sf.base.EventHandler.remove(this.getToolElem(), 'click', this.toolbarClickHandler);
        }
        if (form) {
            sf.base.EventHandler.remove(form, 'reset', this.formResetHandler);
        }
    };
    ListBox.prototype.clickHandler = function (e) {
        this.selectHandler(e);
    };
    
    ListBox.prototype.checkSelectAll = function () {
        var searchCount = 0;
        var liItems = this.list.querySelectorAll('li.' + sf.dropdowns.dropDownBaseClasses.li);
        for (var i = 0; i < liItems.length; i++) {
            if (!liItems[i].classList.contains('e-disabled')) {
                searchCount++;
            }
        }
        var len = this.getSelectedItems().length;
        if (this.showSelectAll && searchCount) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                value: (searchCount === len) ? 'check' : (len === 0) ? 'uncheck' : 'indeterminate' });
        }
    };
    ListBox.prototype.getQuery = function (query) {
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new sf.data.Query();
        if (this.allowFiltering) {
            var filterType = this.inputString === '' ? 'contains' : this.filterType;
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof sf.data.DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new sf.data.Query();
        }
        return filterQuery;
    };
    ListBox.prototype.setFiltering = function () {
        var filterInputObj;
        if (sf.base.isNullOrUndefined(this.filterParent)) {
            if (sf.base.isBlazor() && this.isServerRendered) {
                this.filterParent = this.list.querySelector('.e-filter-parent');
                this.filterInput = this.list.querySelector('.e-input-filter');
            }
            else {
                this.filterParent = this.createElement('span', {
                    className: listBoxClasses.filterParent
                });
                this.filterInput = this.createElement('input', {
                    attrs: { type: 'text' },
                    className: listBoxClasses.filterInput
                });
                this.element.parentNode.insertBefore(this.filterInput, this.element);
                if (sf.base.Browser.isDevice) {
                    
                }
                filterInputObj = sf.inputs.Input.createInput({
                    element: this.filterInput,
                    buttons: [listBoxClasses.filterBarClearIcon],
                    properties: { placeholder: this.filterBarPlaceholder }
                }, this.createElement);
                sf.base.append([filterInputObj.container], this.filterParent);
                sf.base.prepend([this.filterParent], this.list);
                sf.base.attributes(this.filterInput, {
                    'aria-disabled': 'false',
                    'aria-owns': this.element.id + '_options',
                    'role': 'listbox',
                    'aria-activedescendant': null,
                    'autocomplete': 'off',
                    'autocorrect': 'off',
                    'autocapitalize': 'off',
                    'spellcheck': 'false'
                });
            }
            if (this.height.toString().indexOf('%') < 0) {
                sf.base.addClass([this.list], 'e-filter-list');
            }
            this.inputString = this.filterInput.value;
            this.filterWireEvents();
            return filterInputObj;
        }
    };
    ListBox.prototype.filterWireEvents = function (filterElem) {
        if (filterElem) {
            this.filterInput = filterElem.querySelector('.e-input-filter');
        }
        this.clearFilterIconElem = this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
        if (this.clearFilterIconElem) {
            sf.base.EventHandler.add(this.clearFilterIconElem, 'click', this.clearText, this);
            if (!filterElem) {
                this.clearFilterIconElem.style.visibility = 'hidden';
            }
        }
        sf.base.EventHandler.add(this.filterInput, 'input', this.onInput, this);
        sf.base.EventHandler.add(this.filterInput, 'keyup', this.KeyUp, this);
        sf.base.EventHandler.add(this.filterInput, 'keydown', this.onKeyDown, this);
    };
    ListBox.prototype.selectHandler = function (e, isKey) {
        var isSelect = true;
        var currSelIdx;
        var li = sf.base.closest(e.target, '.' + 'e-list-item');
        var selectedLi = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || sf.base.Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(sf.lists.cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                }
                else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || sf.base.Browser.isDevice))) {
                    this.getSelectedItems().forEach(function (ele) {
                        ele.removeAttribute('aria-selected');
                    });
                    sf.base.removeClass(this.getSelectedItems(), sf.lists.cssClass.selected);
                }
            }
            else {
                isSelect = !li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
            }
            if (e.shiftKey && !this.selectionSettings.showCheckbox && this.selectionSettings.mode !== 'Single') {
                selectedLi = [].slice.call(li.parentElement.children)
                    .slice(Math.min(currSelIdx, this.prevSelIdx), Math.max(currSelIdx, this.prevSelIdx) + 1)
                    .filter(function (ele) { return ele.classList.contains('e-list-item'); });
            }
            else {
                this.prevSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            }
            if (isSelect) {
                if (!this.selectionSettings.showCheckbox) {
                    sf.base.addClass(selectedLi, sf.lists.cssClass.selected);
                }
                selectedLi.forEach(function (ele) {
                    ele.setAttribute('aria-selected', 'true');
                });
                this.list.setAttribute('aria-activedescendant', li.id);
            }
            if (!isKey && (this.maximumSelectionLength > (this.value && this.value.length) || !isSelect) &&
                (this.maximumSelectionLength >= (this.value && this.value.length) || !isSelect) &&
                !(this.maximumSelectionLength < (this.value && this.value.length))) {
                this.notify('updatelist', { li: li, e: e, module: 'listbox' });
            }
            if (this.allowFiltering && !isKey) {
                var liDataValue_1 = this.getFormattedValue(li.getAttribute('data-value'));
                if (!isSelect) {
                    this.value = this.value.filter(function (value1) {
                        return value1 !== liDataValue_1;
                    });
                }
                else {
                    var values = [];
                    sf.base.extend(values, this.value);
                    values.push(liDataValue_1);
                    this.value = values;
                }
                if (document.querySelectorAll('ul').length < 2) {
                    this.updateMainList();
                }
            }
            this.updateSelectedOptions();
            this.triggerChange(this.getSelectedItems(), e);
            this.checkMaxSelection();
        }
    };
    ListBox.prototype.triggerChange = function (selectedLis, event) {
        this.trigger('change', { elements: selectedLis, items: this.getDataByElements(selectedLis), value: this.value, event: event });
    };
    ListBox.prototype.getDataByElems = function (elems) {
        var data = [];
        for (var i = 0, len = elems.length; i < len; i++) {
            data.push(this.getDataByValue(this.getFormattedValue(elems[i].getAttribute('data-value'))));
        }
        return data;
    };
    ListBox.prototype.getDataByElements = function (elems) {
        var data = [];
        var value;
        var sIdx = 0;
        if (!sf.base.isNullOrUndefined(this.listData)) {
            var type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    for (var i = sIdx, len = elems.length; i < len; i++) {
                        value = this.getFormattedValue(elems[i].getAttribute('data-value'));
                        if (!sf.base.isNullOrUndefined(item) && item === value) {
                            sIdx = i;
                            data.push(item);
                            break;
                        }
                    }
                    if (elems.length === data.length) {
                        break;
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.listData; _b < _c.length; _b++) {
                    var item = _c[_b];
                    for (var i = sIdx, len = elems.length; i < len; i++) {
                        value = this.getFormattedValue(elems[i].getAttribute('data-value'));
                        if (!sf.base.isNullOrUndefined(item) && sf.base.getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                            sIdx = i;
                            data.push(item);
                            break;
                        }
                    }
                    if (elems.length === data.length) {
                        break;
                    }
                }
            }
            return data;
        }
        return null;
    };
    ListBox.prototype.checkMaxSelection = function () {
        var limit = this.list.querySelectorAll('.e-list-item span.e-check').length;
        if (this.selectionSettings.showCheckbox) {
            var index = 0;
            var liCollElem = void 0;
            liCollElem = this.list.getElementsByClassName('e-list-item');
            for (index; index < liCollElem.length; index++) {
                if (!liCollElem[index].querySelector('.e-frame.e-check')) {
                    if (limit === this.maximumSelectionLength) {
                        liCollElem[index].classList.add('e-disable');
                    }
                    else if (liCollElem[index].classList.contains('e-disable')) {
                        liCollElem[index].classList.remove('e-disable');
                    }
                }
            }
        }
    };
    ListBox.prototype.toolbarClickHandler = function (e) {
        var btn = sf.base.closest(e.target, 'button');
        if (btn) {
            this.toolbarAction = btn.getAttribute('data-value');
            if (btn.disabled) {
                return;
            }
            switch (this.toolbarAction) {
                case 'moveUp':
                    this.moveUpDown(true);
                    break;
                case 'moveDown':
                    this.moveUpDown();
                    break;
                case 'moveTo':
                    this.moveItemTo();
                    break;
                case 'moveFrom':
                    this.moveItemFrom();
                    break;
                case 'moveAllTo':
                    this.moveAllItemTo();
                    break;
                case 'moveAllFrom':
                    this.moveAllItemFrom();
                    break;
            }
        }
    };
    ListBox.prototype.moveUpDown = function (isUp, isKey, value) {
        var _this = this;
        var elems = this.getSelectedItems();
        var tempItems;
        if (value) {
            elems = value;
        }
        if (((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) && !value) {
            return;
        }
        tempItems = this.getDataByElems(elems);
        var localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        this.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach(function (ele) {
            var jsonToIdx = Array.prototype.indexOf.call(_this.ulElement.querySelectorAll('.e-list-item'), ele);
            var idx = Array.prototype.indexOf.call(_this.ulElement.children, ele);
            sf.lists.moveTo(_this.ulElement, _this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            _this.changeData(idx, isUp ? idx - 1 : idx + 1, isUp ? jsonToIdx - 1 : jsonToIdx + 1, ele);
        });
        this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        elems[0].focus();
        if (!isKey && this.toolbarSettings.items.length) {
            this.getToolElem().querySelector('[data-value=' + (isUp ? 'moveUp' : 'moveDown') + ']').focus();
        }
        this.updateToolBarState();
    };
    ListBox.prototype.moveItemTo = function () {
        this.moveData(this, this.getScopedListBox());
    };
    ListBox.prototype.moveItemFrom = function () {
        this.moveData(this.getScopedListBox(), this);
    };
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    ListBox.prototype.moveData = function (fListBox, tListBox, isKey, value, index) {
        var _this = this;
        var idx = [];
        var dataIdx = [];
        var jsonIdx = [];
        var sortIdx = [];
        var listData = [].slice.call(fListBox.listData);
        var tListData = [].slice.call(tListBox.listData);
        var sortData = [].slice.call(fListBox.sortedData);
        var tSortData = [].slice.call(tListBox.sortedData);
        var fliCollections = [].slice.call(fListBox.liCollections);
        var dataLiIdx = [];
        var tliCollections = [].slice.call(tListBox.liCollections);
        var tempItems = [];
        var data = [];
        var elems = fListBox.getSelectedItems();
        if (value) {
            elems = value;
        }
        var isRefresh = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        fListBox.value = [];
        if (elems.length) {
            this.removeSelected(fListBox, elems);
            elems.forEach(function (ele, i) {
                idx.push(Array.prototype.indexOf.call(fListBox.ulElement.children, ele)); // update sortable elem
                // To update lb view data
                dataLiIdx.push(Array.prototype.indexOf.call(fListBox.ulElement.querySelectorAll('.e-list-item'), ele));
                // To update lb listdata data
                dataIdx.push(Array.prototype.indexOf.call(fListBox.listData, fListBox.getDataByElems([ele])[0]));
                // To update lb sorted data
                sortIdx.push(Array.prototype.indexOf.call(fListBox.sortedData, fListBox.getDataByElems([ele])[0]));
                // To update lb original data
                jsonIdx.push(Array.prototype.indexOf.call(fListBox.jsonData, fListBox.getDataByElems([ele])[0]));
            });
            if (this.sortOrder !== 'None') {
                sortIdx.forEach(function (i) {
                    tempItems.push(fListBox.sortedData[i]);
                });
            }
            else {
                jsonIdx.forEach(function (i) {
                    tempItems.push(fListBox.jsonData[i]);
                });
            }
            var localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
            fListBox.trigger('actionBegin', localDataArgs);
            if (localDataArgs.cancel) {
                return;
            }
            if (!sf.base.isBlazor()) {
                var rLiCollection_1 = [];
                dataLiIdx.sort(function (n1, n2) { return n1 - n2; }).reverse().forEach(function (i) {
                    rLiCollection_1.push(fliCollections.splice(i, 1)[0]);
                });
                fListBox.liCollections = fliCollections;
                if (index) {
                    var toColl = tliCollections.splice(0, index);
                    tListBox.liCollections = toColl.concat(rLiCollection_1.reverse()).concat(tliCollections);
                }
                else {
                    tListBox.liCollections = tliCollections.concat(rLiCollection_1.reverse());
                }
                if (tListBox.listData.length === 0) {
                    var noRecElem = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                    if (noRecElem) {
                        tListBox.ulElement.removeChild(noRecElem);
                    }
                }
            }
            dataIdx.sort(function (n1, n2) { return n2 - n1; }).forEach(function (i) {
                listData.splice(i, 1)[0];
            });
            sortIdx.sort(function (n1, n2) { return n2 - n1; }).forEach(function (i) {
                sortData.splice(i, 1)[0];
            });
            jsonIdx.slice().reverse().forEach(function (i) {
                data.push(fListBox.jsonData.splice(i, 1)[0]);
            });
            if (!sf.base.isBlazor()) {
                if (isRefresh) {
                    if (fListBox.fields.groupBy) {
                        fListBox.ulElement.innerHTML = fListBox.renderItems(listData, fListBox.fields).innerHTML;
                    }
                    else {
                        elems.forEach(function (ele) { sf.base.detach(ele); });
                    }
                }
                else {
                    sf.lists.moveTo(fListBox.ulElement, tListBox.ulElement, idx, index);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
                }
                if (tListBox.mainList.childElementCount !== tListBox.jsonData.length) {
                    tListBox.mainList = tListBox.ulElement;
                }
                fListBox.updateMainList();
            }
            var tJsonData = [].slice.call(tListBox.jsonData);
            tSortData = [].slice.call(tListBox.sortedData);
            if (!sf.base.isBlazor()) {
                this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
            }
            if (isKey) {
                this.list.focus();
            }
            fListBox.listData = listData;
            fListBox.sortedData = sortData;
            index = (index) ? index : tListData.length;
            for (var i = tempItems.length - 1; i >= 0; i--) {
                tListData.splice(index, 0, tempItems[i]);
                tJsonData.splice(index, 0, tempItems[i]);
                tSortData.splice(index, 0, tempItems[i]);
            }
            tListBox.listData = tListData;
            tListBox.jsonData = tJsonData;
            tListBox.sortedData = tSortData;
            if (sf.base.isBlazor()) {
                // tslint:disable
                fListBox.interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then(function () {
                    fListBox.updateBlazorListData(null, true);
                    _this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
                    fListBox.updateSelectedOptions();
                });
                tListBox.interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then(function () {
                    if (isRefresh) {
                        tListBox.setSelection();
                    }
                    tListBox.updateBlazorListData(null, true);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: _this.toolbarAction });
                });
                // tslint:enable
            }
            else {
                if (isRefresh) {
                    tListBox.ulElement.innerHTML = tListBox.renderItems(tListData, tListBox.fields).innerHTML;
                    tListBox.setSelection();
                }
                fListBox.updateSelectedOptions();
            }
            if (fListBox.listData.length === 0) {
                // tslint:disable-next-line
                fListBox.l10nUpdate();
            }
        }
        if (fListBox.value.length === 1 && fListBox.getSelectedItems().length) {
            fListBox.value[0] = fListBox.getFormattedValue(fListBox.getSelectedItems()[0].getAttribute('data-value'));
        }
    };
    ListBox.prototype.selectNextList = function (elems, dataLiIdx, dataIdx, inst) {
        var childCnt = inst.ulElement.querySelectorAll('.e-list-item').length;
        var ele;
        var liIdx;
        var validIdx = -1;
        if (elems.length === 1 && childCnt && !inst.selectionSettings.showCheckbox) {
            liIdx = childCnt <= dataLiIdx[0] ? childCnt - 1 : dataLiIdx[0];
            ele = inst.ulElement.querySelectorAll('.e-list-item')[liIdx];
            validIdx = inst.getValidIndex(ele, liIdx, childCnt === dataIdx[0] ? 38 : 40);
            if (validIdx > -1) {
                (inst.ulElement.querySelectorAll('.e-list-item')[validIdx].classList.add(sf.lists.cssClass.selected));
            }
        }
    };
    ListBox.prototype.moveAllItemTo = function () {
        this.moveAllData(this, this.getScopedListBox());
    };
    ListBox.prototype.moveAllItemFrom = function () {
        this.moveAllData(this.getScopedListBox(), this);
    };
    ListBox.prototype.moveAllData = function (fListBox, tListBox, isKey, index) {
        var _this = this;
        var listData = [].slice.call(tListBox.listData);
        var jsonData = [].slice.call(tListBox.jsonData);
        var isRefresh = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        this.removeSelected(fListBox, fListBox.getSelectedItems());
        var tempItems = [].slice.call(fListBox.jsonData);
        var localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        fListBox.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        if (!sf.base.isBlazor()) {
            if (tListBox.listData.length === 0) {
                var noRecElem = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    tListBox.ulElement.removeChild(noRecElem);
                }
            }
            if (isRefresh) {
                var noRecElem = fListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    fListBox.ulElement.removeChild(noRecElem);
                }
            }
            else {
                sf.lists.moveTo(fListBox.ulElement, tListBox.ulElement, Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number), index);
                this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            }
        }
        if (isKey) {
            this.list.focus();
        }
        index = (index) ? index : listData.length;
        for (var i = 0; i < fListBox.listData.length; i++) {
            listData.splice(index + i, 0, fListBox.listData[i]);
        }
        for (var i = 0; i < fListBox.jsonData.length; i++) {
            jsonData.splice(index + i, 0, fListBox.jsonData[i]);
        }
        if (!sf.base.isBlazor()) {
            var fliCollections = [].slice.call(fListBox.liCollections);
            var tliCollections = [].slice.call(tListBox.liCollections);
            fListBox.liCollections = [];
            if (index) {
                var toColl = tliCollections.splice(0, index);
                tListBox.liCollections = toColl.concat(fliCollections).concat(tliCollections);
            }
            else {
                tListBox.liCollections = tliCollections.concat(fliCollections);
            }
        }
        fListBox.value = [];
        listData = listData
            .filter(function (data) { return data.isHeader !== true; });
        tListBox.listData = listData;
        tListBox.jsonData = jsonData;
        fListBox.listData = fListBox.sortedData = fListBox.jsonData = [];
        if (sf.base.isBlazor()) {
            if (!isRefresh) {
                tListBox.sortedData = listData;
            }
            // tslint:disable
            fListBox.interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then(function () {
                fListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
            });
            tListBox.interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then(function () {
                tListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
                fListBox.trigger('actionComplete', { items: tempItems, eventName: _this.toolbarAction });
            });
            // tslint:enable
        }
        else {
            if (isRefresh) {
                tListBox.ulElement.innerHTML = tListBox.renderItems(listData, tListBox.fields).innerHTML;
                this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            }
            else {
                tListBox.sortedData = listData;
            }
            fListBox.updateSelectedOptions();
        }
        if (fListBox.listData.length === 0) {
            // tslint:disable-next-line
            fListBox.l10nUpdate();
        }
    };
    ListBox.prototype.changeData = function (fromIdx, toIdx, jsonToIdx, ele) {
        var listData = [].slice.call(this.listData);
        var jsonData = [].slice.call(this.jsonData);
        var sortData = [].slice.call(this.sortedData);
        var jsonIdx = Array.prototype.indexOf.call(this.jsonData, this.getDataByElems([ele])[0]);
        var sortIdx = Array.prototype.indexOf.call(this.sortedData, this.getDataByElems([ele])[0]);
        var liColl = [].slice.call(this.liCollections);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0]);
        jsonData.splice(jsonToIdx, 0, jsonData.splice(jsonIdx, 1)[0]);
        sortData.splice(toIdx, 0, sortData.splice(sortIdx, 1)[0]);
        liColl.splice(toIdx, 0, liColl.splice(fromIdx, 1)[0]);
        this.listData = listData;
        this.jsonData = jsonData;
        this.liCollections = liColl;
        this.sortedData = sortData;
    };
    ListBox.prototype.getSelectedItems = function () {
        var ele = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach(function (cbox) {
                ele.push(sf.base.closest(cbox, '.' + 'e-list-item'));
            });
        }
        else {
            ele = [].slice.call(this.ulElement.getElementsByClassName(sf.lists.cssClass.selected));
        }
        return ele;
    };
    ListBox.prototype.getScopedListBox = function () {
        var _this = this;
        var listObj;
        if (this.scope) {
            [].slice.call(document.querySelectorAll(this.scope)).forEach(function (ele) {
                if (sf.base.getComponent(ele, _this.getModuleName())) {
                    listObj = sf.base.getComponent(ele, _this.getModuleName());
                }
            });
        }
        return listObj;
    };
    ListBox.prototype.getDragArgs = function (args, isDragEnd) {
        var elems = this.getSelectedItems();
        if (elems.length) {
            elems.pop();
            if (isDragEnd) {
                elems.push(args.target);
            }
        }
        else {
            elems = [args.target];
        }
        if (sf.base.isBlazor()) {
            return { elements: elems, items: this.getDataByElems(elems), bindEvents: args.bindEvents,
                dragElement: args.dragElement };
        }
        else {
            return { elements: elems, items: this.getDataByElems(elems) };
        }
    };
    ListBox.prototype.onKeyDown = function (e) {
        this.keyDownHandler(e);
        event.stopPropagation();
    };
    ListBox.prototype.keyDownHandler = function (e) {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1 && !this.allowFiltering) {
            e.preventDefault();
            if (e.keyCode === 32 && this.ulElement.children.length) {
                this.selectHandler({
                    target: this.ulElement.getElementsByClassName('e-focused')[0],
                    ctrlKey: e.ctrlKey, shiftKey: e.shiftKey
                });
            }
            else if (e.keyCode === 65 && e.ctrlKey) {
                this.selectAll();
            }
            else if ((e.keyCode === 38 || e.keyCode === 40) && e.ctrlKey && e.shiftKey) {
                this.moveUpDown(e.keyCode === 38 ? true : false, true);
            }
            else if ((this.toolbarSettings.items.length || this.tBListBox) && (e.keyCode === 39 || e.keyCode === 37) && e.ctrlKey) {
                var listObj = this.tBListBox || this.getScopedListBox();
                if (e.keyCode === 39) {
                    e.shiftKey ? this.moveAllData(this, listObj, true) : this.moveData(this, listObj, true);
                }
                else {
                    e.shiftKey ? this.moveAllData(listObj, this, true) : this.moveData(listObj, this, true);
                }
            }
            else if (e.keyCode !== 37 && e.keyCode !== 39) {
                this.upDownKeyHandler(e);
            }
        }
        else if (this.allowFiltering) {
            if (e.keyCode === 40 || e.keyCode === 38) {
                this.upDownKeyHandler(e);
            }
        }
    };
    ListBox.prototype.upDownKeyHandler = function (e) {
        var ul = this.ulElement;
        var defaultIdx = (e.keyCode === 40 || e.keyCode === 36) ? 0 : ul.childElementCount - 1;
        var fliIdx = defaultIdx;
        var fli = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(sf.lists.cssClass.selected)[0];
        if (fli) {
            if (e.keyCode !== 35 && e.keyCode !== 36) {
                fliIdx = Array.prototype.indexOf.call(ul.children, fli);
                e.keyCode === 40 ? fliIdx++ : fliIdx--;
                if (fliIdx < 0 || fliIdx > ul.childElementCount - 1) {
                    return;
                }
            }
            sf.base.removeClass([fli], 'e-focused');
        }
        var cli = ul.children[fliIdx];
        if (cli) {
            fliIdx = this.getValidIndex(cli, fliIdx, e.keyCode);
            if (fliIdx === -1) {
                sf.base.addClass([fli], 'e-focused');
                return;
            }
            ul.children[fliIdx].focus();
            ul.children[fliIdx].classList.add('e-focused');
            if (!e.ctrlKey) {
                this.selectHandler({ target: ul.children[fliIdx], ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }, true);
            }
        }
    };
    ListBox.prototype.KeyUp = function (e) {
        var _this = this;
        var char = String.fromCharCode(e.keyCode);
        var isWordCharacter = char.match(/\w/);
        if (!sf.base.isNullOrUndefined(isWordCharacter)) {
            this.isValidKey = true;
        }
        this.isValidKey = (e.keyCode === 8) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            switch (e.keyCode) {
                default:
                    var text = this.targetElement();
                    var keyCode = e.keyCode;
                    if (this.allowFiltering) {
                        var eventArgsData_1 = {
                            preventDefaultAction: false,
                            text: this.targetElement(),
                            updateData: function (dataSource, query, fields) {
                                if (eventArgsData_1.cancel) {
                                    return;
                                }
                                _this.isFiltered = true;
                                _this.remoteFilterAction = true;
                                _this.dataUpdater(dataSource, query, fields);
                            },
                            event: e,
                            cancel: false
                        };
                        this.trigger('filtering', eventArgsData_1, function (args) {
                            _this.isDataFetched = false;
                            if (eventArgsData_1.cancel || (_this.filterInput.value !== '' && _this.isFiltered)) {
                                return;
                            }
                            if (!eventArgsData_1.cancel && !_this.isCustomFiltering && !eventArgsData_1.preventDefaultAction) {
                                _this.inputString = _this.filterInput.value;
                                _this.filteringAction(_this.jsonData, new sf.data.Query(), _this.fields);
                            }
                            if (!_this.isFiltered && !_this.isCustomFiltering && !eventArgsData_1.preventDefaultAction) {
                                _this.dataUpdater(_this.jsonData, new sf.data.Query(), _this.fields);
                            }
                        });
                    }
            }
        }
    };
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    ListBox.prototype.filter = function (dataSource, query, fields) {
        this.isCustomFiltering = true;
        this.filteringAction(dataSource, query, fields);
    };
    ListBox.prototype.filteringAction = function (dataSource, query, fields) {
        this.resetList(dataSource, fields, query);
    };
    ListBox.prototype.targetElement = function () {
        this.targetInputElement = this.list.getElementsByClassName('e-input-filter')[0];
        return this.targetInputElement.value;
    };
    ListBox.prototype.dataUpdater = function (dataSource, query, fields) {
        this.isDataFetched = false;
        var backCommand = true;
        if (this.targetElement().trim() === '') {
            var list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            if (backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.jsonData);
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.selectionSettings.showCheckbox, e: this });
            }
        }
        else {
            this.resetList(dataSource, fields, query);
        }
    };
    ListBox.prototype.focusOutHandler = function () {
        var ele = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
        }
        if (this.allowFiltering) {
            this.refreshClearIcon();
        }
    };
    ListBox.prototype.getValidIndex = function (cli, index, keyCode) {
        var cul = this.ulElement;
        if (cli.classList.contains('e-disabled') || cli.classList.contains(sf.lists.cssClass.group)) {
            (keyCode === 40 || keyCode === 36) ? index++ : index--;
        }
        if (index < 0 || index === cul.childElementCount) {
            return -1;
        }
        cli = cul.querySelectorAll('.e-list-item')[index];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(sf.lists.cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    };
    ListBox.prototype.updateSelectedOptions = function () {
        var _this = this;
        var selectedOptions = [];
        var values = [];
        sf.base.extend(values, this.value);
        this.getSelectedItems().forEach(function (ele) {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(_this.getFormattedValue(ele.getAttribute('data-value')));
            }
        });
        if (this.mainList.childElementCount === this.ulElement.childElementCount) {
            if (this.allowFiltering && this.selectionSettings.showCheckbox) {
                for (var i = 0; i < selectedOptions.length; i++) {
                    if (values.indexOf(selectedOptions[i]) > -1) {
                        continue;
                    }
                    else {
                        values.push(selectedOptions[i]);
                    }
                }
                this.setProperties({ value: values }, true);
            }
            else {
                this.setProperties({ value: selectedOptions }, true);
            }
        }
        this.updateSelectTag();
        this.updateToolBarState();
        if (this.tBListBox) {
            this.tBListBox.updateToolBarState();
        }
    };
    ListBox.prototype.clearSelection = function (values) {
        var _this = this;
        if (values === void 0) { values = this.value; }
        if (this.selectionSettings.showCheckbox) {
            var dvalue_1;
            this.getSelectedItems().forEach(function (li) {
                dvalue_1 = _this.getFormattedValue(li.getAttribute('data-value'));
                if (values.indexOf(dvalue_1) < 0) {
                    li.getElementsByClassName('e-check')[0].classList.remove('e-check');
                    li.getElementsByClassName('e-checkbox-wrapper')[0].removeAttribute('aria-checked');
                    li.removeAttribute('aria-selected');
                }
            });
        }
    };
    
    ListBox.prototype.setSelection = function (values, isSelect, isText) {
        var _this = this;
        if (values === void 0) { values = this.value; }
        if (isSelect === void 0) { isSelect = true; }
        if (isText === void 0) { isText = false; }
        var li;
        var liselect;
        if (values) {
            values.forEach(function (value) {
                var text;
                if (isText) {
                    if (sf.base.isBlazor() && typeof (value) === 'object') {
                        text = value[_this.fields.text || 'text'];
                        if (sf.base.isNullOrUndefined(text)) {
                            return;
                        }
                        text = _this.getValueByText(text);
                    }
                    else {
                        text = _this.getValueByText(value);
                    }
                }
                else {
                    text = value;
                }
                li = _this.list.querySelector('[data-value="' + text + '"]');
                if (li) {
                    if (_this.selectionSettings.showCheckbox) {
                        liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
                    }
                    else {
                        liselect = li.classList.contains('e-selected');
                    }
                    if (!isSelect && liselect || isSelect && !liselect && li) {
                        if (_this.selectionSettings.showCheckbox) {
                            _this.notify('updatelist', { li: li, module: 'listbox' });
                        }
                        else {
                            if (isSelect) {
                                li.classList.add(sf.lists.cssClass.selected);
                                li.setAttribute('aria-selected', 'true');
                            }
                            else {
                                li.classList.remove(sf.lists.cssClass.selected);
                                li.removeAttribute('aria-selected');
                            }
                        }
                    }
                }
            });
        }
        this.updateSelectTag();
    };
    ListBox.prototype.updateSelectTag = function () {
        var ele = this.getSelectTag();
        var innerHTML = '';
        ele.innerHTML = '';
        if (this.value) {
            for (var i = 0, len = this.value.length; i < len; i++) {
                innerHTML += '<option selected value="' + this.value[i] + '"></option>';
            }
            ele.innerHTML += innerHTML;
        }
        this.checkSelectAll();
    };
    ListBox.prototype.checkDisabledState = function (inst) {
        return (sf.base.isBlazor() ? inst.ulElement.querySelectorAll('.' + sf.lists.cssClass.li).length : inst.ulElement.childElementCount) === 0;
    };
    ListBox.prototype.updateToolBarState = function () {
        var _this = this;
        if (this.toolbarSettings.items.length) {
            var listObj_1 = this.getScopedListBox();
            var wrap_1 = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach(function (value) {
                var btn = wrap_1.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = _this.checkDisabledState(_this);
                        break;
                    case 'moveAllFrom':
                        btn.disabled = _this.checkDisabledState(listObj_1);
                        break;
                    case 'moveFrom':
                        btn.disabled = listObj_1.value && listObj_1.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = _this.value && _this.value.length
                            && !_this.isSelected(_this.ulElement.children[0]) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = _this.value && _this.value.length
                            && !_this.isSelected(_this.ulElement.children[_this.ulElement.childElementCount - 1]) ? false : true;
                        break;
                    default:
                        btn.disabled = _this.value && _this.value.length ? false : true;
                        break;
                }
            });
        }
    };
    ListBox.prototype.setCheckboxPosition = function () {
        var listWrap = this.list;
        if (!this.initLoad && this.selectionSettings.checkboxPosition === 'Left') {
            listWrap.classList.remove('e-right');
        }
        if (this.selectionSettings.checkboxPosition === 'Right') {
            listWrap.classList.add('e-right');
        }
    };
    ListBox.prototype.showCheckbox = function (showCheckbox) {
        var index = 0;
        var liColl = this.list.lastElementChild.querySelectorAll('li');
        var liCollLen = this.list.lastElementChild.getElementsByClassName('e-list-item').length;
        if (showCheckbox) {
            if (!sf.base.isBlazor()) {
                this.ulElement = this.renderItems(this.listData, this.fields);
                this.mainList = this.ulElement;
                this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
                this.list.appendChild(this.ulElement);
            }
            if (this.selectionSettings.showSelectAll && !this.list.getElementsByClassName('e-selectall-parent')[0]) {
                var l10nShow = new sf.base.L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                this.showSelectAll = true;
                this.selectAllText = l10nShow.getConstant('selectAllText');
                this.unSelectAllText = l10nShow.getConstant('unSelectAllText');
                this.popupWrapper = this.list;
                this.checkBoxSelectionModule.checkAllParent = null;
                this.notify('selectAll', {});
                this.checkSelectAll();
            }
        }
        else {
            if (this.list.getElementsByClassName('e-selectall-parent')[0]) {
                this.list.removeChild(this.list.getElementsByClassName('e-selectall-parent')[0]);
            }
            if (!sf.base.isBlazor()) {
                for (index; index < liCollLen; index++) {
                    if (liColl[index].classList.contains('e-list-item')) {
                        liColl[index].removeChild(liColl[index].getElementsByClassName('e-checkbox-wrapper')[0]);
                    }
                    if (liColl[index].hasAttribute('aria-selected')) {
                        liColl[index].removeAttribute('aria-selected');
                    }
                }
                this.mainList = this.ulElement;
            }
        }
        this.value = [];
    };
    ListBox.prototype.isSelected = function (ele) {
        if (!sf.base.isNullOrUndefined(ele)) {
            return ele.classList.contains(sf.lists.cssClass.selected) || ele.querySelector('.e-check') !== null;
        }
        else {
            return false;
        }
    };
    ListBox.prototype.getSelectTag = function () {
        return this.list.getElementsByClassName('e-hidden-select')[0];
    };
    ListBox.prototype.getToolElem = function () {
        return this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
    };
    ListBox.prototype.formResetHandler = function () {
        this.value = this.initialSelectedOptions;
    };
    /**
     * Return the module name.
     * @private
     */
    ListBox.prototype.getModuleName = function () {
        return 'listbox';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    ListBox.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    ListBox.prototype.getLocaleName = function () {
        return 'listbox';
    };
    
    ListBox.prototype.destroy = function () {
        if (this.itemTemplate) {
            sf.base.resetBlazorTemplate("" + this.element.id + ITEMTEMPLATE_PROPERTY, ITEMTEMPLATE_PROPERTY);
        }
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        }
        else {
            if (!sf.base.isBlazor() || (sf.base.isBlazor() && !this.isServerRendered)) {
                this.element.style.display = 'inline-block';
                if (this.toolbarSettings.items.length) {
                    this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                    sf.base.detach(this.list.nextElementSibling);
                }
                this.list.parentElement.insertBefore(this.element, this.list);
            }
        }
        if (!sf.base.isBlazor() || (sf.base.isBlazor() && !this.isServerRendered)) {
            _super.prototype.destroy.call(this);
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    ListBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        var wrap = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
        this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([wrap], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([wrap], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrap.classList.add('e-rtl');
                    }
                    else {
                        wrap.classList.remove('e-rtl');
                    }
                    break;
                case 'value':
                    sf.base.removeClass(this.list.querySelectorAll('.' + sf.lists.cssClass.selected), sf.lists.cssClass.selected);
                    this.clearSelection(this.value);
                    this.setSelection();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'allowDragAndDrop':
                    if (newProp.allowDragAndDrop) {
                        this.initDraggable();
                    }
                    else {
                        sf.base.getComponent(this.ulElement, 'sortable').destroy();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.setFiltering();
                    }
                    else {
                        this.list.removeChild(this.list.getElementsByClassName('e-filter-parent')[0]);
                        this.filterParent = null;
                        sf.base.removeClass([this.list], 'e-filter-list');
                    }
                    break;
                case 'filterBarPlaceholder':
                    if (this.allowFiltering) {
                        if (this.filterInput) {
                            sf.inputs.Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput);
                        }
                    }
                    break;
                case 'scope':
                    if (this.allowDragAndDrop) {
                        sf.base.getComponent(this.ulElement, 'sortable').scope = newProp.scope;
                    }
                    if (this.toolbarSettings.items.length) {
                        if (oldProp.scope) {
                            sf.base.getComponent(document.querySelector(oldProp.scope), this.getModuleName())
                                .tBListBox = null;
                        }
                        if (newProp.scope) {
                            sf.base.getComponent(document.querySelector(newProp.scope), this.getModuleName())
                                .tBListBox = this;
                        }
                    }
                    break;
                case 'toolbarSettings':
                    var ele = void 0;
                    var pos = newProp.toolbarSettings.position;
                    var toolElem = this.getToolElem();
                    if (pos) {
                        sf.base.removeClass([wrap], ['e-right', 'e-left']);
                        wrap.classList.add('e-' + pos.toLowerCase());
                        if (pos === 'Left') {
                            wrap.insertBefore(toolElem, this.list);
                        }
                        else {
                            wrap.appendChild(toolElem);
                        }
                    }
                    if (newProp.toolbarSettings.items) {
                        if (oldProp.toolbarSettings.items.length) {
                            ele = this.list.parentElement;
                            ele.parentElement.insertBefore(this.list, ele);
                            sf.base.detach(ele);
                        }
                        this.initToolbarAndStyles();
                        this.wireToolbarEvent();
                    }
                    break;
                case 'selectionSettings':
                    var showSelectAll = newProp.selectionSettings.showSelectAll;
                    var showCheckbox = newProp.selectionSettings.showCheckbox;
                    if (!sf.base.isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            var l10nSel = new sf.base.L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                            this.checkBoxSelectionModule.checkAllParent = null;
                            this.showSelectAll = true;
                            this.selectAllText = l10nSel.getConstant('selectAllText');
                            this.unSelectAllText = l10nSel.getConstant('selectAllText');
                            this.popupWrapper = this.list;
                        }
                        this.notify('selectAll', {});
                        this.checkSelectAll();
                    }
                    if (!sf.base.isNullOrUndefined(showCheckbox)) {
                        this.showCheckbox(showCheckbox);
                    }
                    if (this.selectionSettings.showCheckbox) {
                        this.setCheckboxPosition();
                    }
                    break;
                case 'dataSource':
                    this.jsonData = [].slice.call(this.dataSource);
                    break;
            }
        }
    };
    var ListBox_1;
    __decorate([
        sf.base.Property('')
    ], ListBox.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property([])
    ], ListBox.prototype, "value", void 0);
    __decorate([
        sf.base.Property('')
    ], ListBox.prototype, "height", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListBox.prototype, "allowDragAndDrop", void 0);
    __decorate([
        sf.base.Property(1000)
    ], ListBox.prototype, "maximumSelectionLength", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListBox.prototype, "allowFiltering", void 0);
    __decorate([
        sf.base.Property('')
    ], ListBox.prototype, "scope", void 0);
    __decorate([
        sf.base.Property(true)
    ], ListBox.prototype, "ignoreCase", void 0);
    __decorate([
        sf.base.Property(null)
    ], ListBox.prototype, "filterBarPlaceholder", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "beforeItemRender", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "filtering", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "beforeDrop", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "dragStart", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "drag", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "drop", void 0);
    __decorate([
        sf.base.Event()
    ], ListBox.prototype, "dataBound", void 0);
    __decorate([
        sf.base.Property(null)
    ], ListBox.prototype, "groupTemplate", void 0);
    __decorate([
        sf.base.Property('No records found')
    ], ListBox.prototype, "noRecordsTemplate", void 0);
    __decorate([
        sf.base.Property('Request failed')
    ], ListBox.prototype, "actionFailureTemplate", void 0);
    __decorate([
        sf.base.Property(1000)
    ], ListBox.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(false)
    ], ListBox.prototype, "ignoreAccent", void 0);
    __decorate([
        sf.base.Complex({}, ToolbarSettings)
    ], ListBox.prototype, "toolbarSettings", void 0);
    __decorate([
        sf.base.Complex({}, SelectionSettings)
    ], ListBox.prototype, "selectionSettings", void 0);
    ListBox = ListBox_1 = __decorate([
        sf.base.NotifyPropertyChanges
    ], ListBox);
    return ListBox;
}(sf.dropdowns.DropDownBase));
var listBoxClasses = {
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    clearIcon: 'e-clear-icon',
};

var ICON = 'e-icons';
var CHECKBOXFRAME = 'e-frame';
var CHECK = 'e-check';
var CHECKBOXWRAP = 'e-checkbox-wrapper';
var INDETERMINATE = 'e-stop';
var checkAllParent = 'e-selectall-parent';
var searchBackIcon = 'e-input-group-icon e-back-icon e-icons';
var filterBarClearIcon = 'e-input-group-icon e-clear-icon e-icons';
var filterInput = 'e-input-filter';
var filterParent = 'e-filter-parent';
var mobileFilter = 'e-ddl-device-filter';
var clearIcon = 'e-clear-icon';
var popupFullScreen = 'e-popup-full-page';
var device = 'e-ddl-device';
var FOCUS = 'e-input-focus';
/**
 * The Multiselect enable CheckBoxSelection call this inject module.
 */
var CheckBoxSelection = /** @class */ (function () {
    function CheckBoxSelection(parent) {
        this.activeLi = [];
        this.activeEle = [];
        this.parent = parent;
        this.addEventListener();
    }
    CheckBoxSelection.prototype.getModuleName = function () {
        return 'CheckBoxSelection';
    };
    CheckBoxSelection.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on('updatelist', this.listSelection, this);
        this.parent.on('listoption', this.listOption, this);
        this.parent.on('selectAll', this.setSelectAll, this);
        this.parent.on('checkSelectAll', this.checkSelectAll, this);
        this.parent.on('searchBox', this.setSearchBox, this);
        this.parent.on('blur', this.onBlur, this);
        this.parent.on('targetElement', this.targetElement, this);
        this.parent.on('deviceSearchBox', this.setDeviceSearchBox, this);
        this.parent.on('inputFocus', this.getFocus, this);
        this.parent.on('reOrder', this.setReorder, this);
        this.parent.on('activeList', this.getActiveList, this);
        this.parent.on('selectAllText', this.setLocale, this);
        this.parent.on('filterBarPlaceholder', this.setPlaceholder, this);
        sf.base.EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        this.parent.on('addItem', this.checboxCreate, this);
        this.parent.on('popupFullScreen', this.setPopupFullScreen, this);
    };
    CheckBoxSelection.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('updatelist', this.listSelection);
        this.parent.off('listoption', this.listOption);
        this.parent.off('selectAll', this.setSelectAll);
        this.parent.off('checkSelectAll', this.checkSelectAll);
        this.parent.off('searchBox', this.setSearchBox);
        this.parent.off('blur', this.onBlur);
        this.parent.off('targetElement', this.targetElement);
        this.parent.off('deviceSearchBox', this.setDeviceSearchBox);
        this.parent.off('inputFocus', this.getFocus);
        this.parent.off('reOrder', this.setReorder);
        this.parent.off('activeList', this.getActiveList);
        this.parent.off('selectAllText', this.setLocale);
        this.parent.off('filterBarPlaceholder', this.setPlaceholder);
        this.parent.off('addItem', this.checboxCreate);
        sf.base.EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.parent.off('popupFullScreen', this.setPopupFullScreen);
    };
    CheckBoxSelection.prototype.listOption = function (args) {
        var _this = this;
        if (sf.base.isNullOrUndefined(this.parent.listCurrentOptions.itemCreated)) {
            this.parent.listCurrentOptions.itemCreated = function (e) {
                _this.checboxCreate(e);
            };
        }
        else {
            var itemCreated_1 = this.parent.listCurrentOptions.itemCreated;
            this.parent.listCurrentOptions.itemCreated = function (e) {
                _this.checboxCreate(e);
                itemCreated_1.apply(_this, [e]);
            };
        }
    };
    
    CheckBoxSelection.prototype.setPlaceholder = function (props) {
        sf.inputs.Input.setPlaceholder(props.filterBarPlaceholder, this.filterInput);
    };
    CheckBoxSelection.prototype.checboxCreate = function (e) {
        var item;
        if (!sf.base.isNullOrUndefined(e.item)) {
            item = e.item;
        }
        else {
            item = e;
        }
        if (this.parent.enableGroupCheckBox || (item.className !== 'e-list-group-item '
            && item.className !== 'e-list-group-item')) {
            var checkboxEle = sf.buttons.createCheckBox(this.parent.createElement, true);
            var icon = sf.base.select('div.' + ICON, item);
            var id = item.getAttribute('data-uid');
            item.insertBefore(checkboxEle, item.childNodes[sf.base.isNullOrUndefined(icon) ? 0 : 1]);
            sf.base.select('.' + CHECKBOXFRAME, checkboxEle);
            var frame = sf.base.select('.' + CHECKBOXFRAME, checkboxEle);
            if (this.parent.enableGroupCheckBox) {
                this.parent.popupWrapper.classList.add('e-multiselect-group');
            }
            return item;
        }
        else {
            return item;
        }
    };
    CheckBoxSelection.prototype.setSelectAll = function () {
        if (this.parent.showSelectAll) {
            if (sf.base.isNullOrUndefined(this.checkAllParent)) {
                this.checkAllParent = this.parent.createElement('div', {
                    className: checkAllParent
                });
                this.selectAllSpan = this.parent.createElement('span', {
                    className: 'e-all-text'
                });
                this.selectAllSpan.textContent = '';
                this.checkAllParent.appendChild(this.selectAllSpan);
                this.setLocale();
                this.checboxCreate(this.checkAllParent);
                if (this.parent.headerTemplate) {
                    if (!sf.base.isNullOrUndefined(this.parent.filterParent)) {
                        sf.base.append([this.checkAllParent], this.parent.filterParent);
                    }
                    else {
                        sf.base.append([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                if (!this.parent.headerTemplate) {
                    if (!sf.base.isNullOrUndefined(this.parent.filterParent)) {
                        this.parent.filterParent.parentNode.insertBefore(this.checkAllParent, this.parent.filterParent.nextSibling);
                    }
                    else {
                        sf.base.prepend([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                sf.base.EventHandler.add(this.checkAllParent, 'mousedown', this.clickHandler, this);
            }
            if (this.parent.list.classList.contains('e-nodata') || (this.parent.listData && this.parent.listData.length <= 1)) {
                this.checkAllParent.style.display = 'none';
            }
            else {
                this.checkAllParent.style.display = 'block';
            }
            this.parent.selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        }
        else if (!sf.base.isNullOrUndefined(this.checkAllParent)) {
            this.checkAllParent.parentElement.removeChild(this.checkAllParent);
            this.checkAllParent = null;
        }
    };
    CheckBoxSelection.prototype.destroy = function () {
        this.removeEventListener();
    };
    CheckBoxSelection.prototype.listSelection = function (args) {
        var target;
        var isBlazorListbox = sf.base.isBlazor() && (args.module && args.module === 'listbox');
        if (!sf.base.isNullOrUndefined(args.e)) {
            var frameElm = args.li.querySelector('.e-checkbox-wrapper .e-frame');
            target = !sf.base.isNullOrUndefined(args.e.target) ?
                (args.e.target.classList.contains('e-frame')
                    && (!this.parent.showSelectAll
                        || (this.checkAllParent && !this.checkAllParent.contains(args.e.target)))) ?
                    args.e.target : (isBlazorListbox ? frameElm : args.li.querySelector('.e-checkbox-wrapper').childNodes[1])
                : (isBlazorListbox ? frameElm : args.li.querySelector('.e-checkbox-wrapper').childNodes[1]);
        }
        else {
            var checkboxWrapper = args.li.querySelector('.e-checkbox-wrapper');
            target = checkboxWrapper ? (isBlazorListbox ?
                checkboxWrapper.querySelector('.e-frame') : checkboxWrapper.childNodes[1]) : args.li.lastElementChild.childNodes[1];
        }
        if (this.parent.itemTemplate || this.parent.enableGroupCheckBox) {
            target = args.li.firstElementChild.childNodes[1];
        }
        if (!sf.base.isNullOrUndefined(target)) {
            this.checkWrapper = sf.base.closest(target, '.' + CHECKBOXWRAP);
        }
        if (!sf.base.isNullOrUndefined(this.checkWrapper)) {
            var checkElement = sf.base.select('.' + CHECKBOXFRAME, this.checkWrapper);
            var selectAll = false;
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), args.li, args.e, selectAll);
        }
    };
    CheckBoxSelection.prototype.validateCheckNode = function (checkWrap, isCheck, li, e, selectAll) {
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true, selectAll);
    };
    CheckBoxSelection.prototype.clickHandler = function (e) {
        var target;
        if (e.currentTarget.classList.contains(this.checkAllParent.className)) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.currentTarget;
        }
        this.checkWrapper = sf.base.closest(target, '.' + CHECKBOXWRAP);
        var selectAll = true;
        if (!sf.base.isNullOrUndefined(this.checkWrapper)) {
            var checkElement = sf.base.select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), null, e, selectAll);
        }
        e.preventDefault();
    };
    CheckBoxSelection.prototype.changeState = function (wrapper, state, e, isPrevent, selectAll) {
        var ariaState;
        var frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            ariaState = 'true';
            if (selectAll) {
                this.parent.selectAllItems(true, e);
                this.setLocale(true);
            }
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            sf.base.removeClass([frameSpan], [CHECK, INDETERMINATE]);
            ariaState = 'false';
            if (selectAll) {
                this.parent.selectAllItems(false, e);
                this.setLocale();
            }
        }
        else if (state === 'indeterminate' && !(frameSpan.classList.contains(INDETERMINATE))) {
            sf.base.removeClass([frameSpan], [CHECK]);
            frameSpan.classList.add(INDETERMINATE);
            ariaState = 'false';
            if (selectAll) {
                this.parent.selectAllItems(false, e);
                this.setLocale();
            }
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!sf.base.isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    };
    CheckBoxSelection.prototype.setSearchBox = function (args) {
        if (sf.base.isNullOrUndefined(this.parent.filterParent)) {
            this.parent.filterParent = this.parent.createElement('span', {
                className: filterParent
            });
            this.filterInput = this.parent.createElement('input', {
                attrs: { type: 'text' },
                className: filterInput
            });
            this.parent.element.parentNode.insertBefore(this.filterInput, this.parent.element);
            var backIcon = false;
            if (sf.base.Browser.isDevice) {
                backIcon = true;
                this.parent.mobFilter = false;
            }
            this.filterInputObj = sf.inputs.Input.createInput({
                element: this.filterInput,
                buttons: backIcon ? [searchBackIcon, filterBarClearIcon] : [filterBarClearIcon],
                properties: { placeholder: this.parent.filterBarPlaceholder }
            }, this.parent.createElement);
            if (!sf.base.isNullOrUndefined(this.parent.cssClass)) {
                if (this.parent.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    sf.base.addClass([this.filterInputObj.container], 'e-outline');
                }
                else if (this.parent.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    sf.base.addClass([this.filterInputObj.container], 'e-filled');
                }
            }
            sf.base.append([this.filterInputObj.container], this.parent.filterParent);
            sf.base.prepend([this.parent.filterParent], args.popupElement);
            sf.base.attributes(this.filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.parent.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
            if (!sf.base.Browser.isDevice && this.clearIconElement) {
                sf.base.EventHandler.add(this.clearIconElement, 'mousedown', this.clearText, this);
                this.clearIconElement.style.visibility = 'hidden';
            }
            sf.base.EventHandler.add(this.filterInput, 'input', this.parent.onInput, this.parent);
            sf.base.EventHandler.add(this.filterInput, 'keyup', this.parent.KeyUp, this.parent);
            sf.base.EventHandler.add(this.filterInput, 'keydown', this.parent.onKeyDown, this.parent);
            sf.base.EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            sf.base.EventHandler.add(this.filterInput, 'paste', this.parent.pasteHandler, this.parent);
            this.parent.searchBoxHeight = (this.filterInputObj.container.parentElement).getBoundingClientRect().height;
            return this.filterInputObj;
        }
    };
    
    CheckBoxSelection.prototype.clickOnBackIcon = function (e) {
        this.parent.hidePopup();
        sf.base.removeClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.inputElement.focus();
    };
    CheckBoxSelection.prototype.clearText = function (e) {
        this.parent.targetInputElement.value = '';
        this.parent.refreshPopup();
        this.parent.refreshListItems(null);
        this.clearIconElement.style.visibility = 'hidden';
        this.filterInput.focus();
        this.setReorder(e);
        e.preventDefault();
    };
    CheckBoxSelection.prototype.setDeviceSearchBox = function () {
        this.parent.popupObj.element.classList.add(device);
        this.parent.popupObj.element.classList.add(mobileFilter);
        this.parent.popupObj.position = { X: 0, Y: 0 };
        this.parent.popupObj.dataBind();
        this.setSearchBoxPosition();
        this.backIconElement = this.filterInputObj.container.querySelector('.e-back-icon');
        this.clearIconElement = this.filterInputObj.container.querySelector('.' + clearIcon);
        this.clearIconElement.style.visibility = 'hidden';
        sf.base.EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
        sf.base.EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
    };
    CheckBoxSelection.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        var selectAllHeight = 0;
        if (this.checkAllParent) {
            selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        }
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
        this.parent.list.style.maxHeight = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        this.parent.list.style.height = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        var clearElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
        sf.base.detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    };
    CheckBoxSelection.prototype.setPopupFullScreen = function () {
        sf.base.attributes(this.parent.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
        sf.base.addClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
    };
    CheckBoxSelection.prototype.targetElement = function () {
        if (!sf.base.isNullOrUndefined(this.clearIconElement)) {
            this.parent.targetInputElement = this.filterInput;
            this.clearIconElement.style.visibility = this.parent.targetInputElement.value === '' ? 'hidden' : 'visible';
        }
        return this.parent.targetInputElement.value;
    };
    CheckBoxSelection.prototype.onBlur = function (e) {
        if (!this.parent.element.classList.contains('e-listbox')) {
            var target = void 0;
            if (this.parent.keyAction) {
                return;
            }
            if (sf.base.Browser.isIE) {
                target = !sf.base.isNullOrUndefined(e) && e.target;
            }
            if (!sf.base.Browser.isIE) {
                target = !sf.base.isNullOrUndefined(e) && e.relatedTarget;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) && this.parent.popupObj.element.contains(target)
                && !sf.base.Browser.isIE && this.filterInput) {
                this.filterInput.focus();
                return;
            }
            if (this.parent.scrollFocusStatus && this.filterInput) {
                e.preventDefault();
                this.filterInput.focus();
                this.parent.scrollFocusStatus = false;
                return;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element)
                && !this.parent.popupObj.element.classList.contains('e-popup-close')) {
                this.parent.inputFocus = false;
                this.parent.updateValueState(e, this.parent.value, this.parent.tempValues);
                this.parent.dispatchEvent(this.parent.hiddenElement, 'change');
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) &&
                !this.parent.popupObj.element.classList.contains('e-popup-close')) {
                this.parent.inputFocus = false;
                this.parent.overAllWrapper.classList.remove(FOCUS);
                this.parent.trigger('blur');
                this.parent.focused = true;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) &&
                !this.parent.popupObj.element.classList.contains('e-popup-close') && !sf.base.Browser.isDevice) {
                this.parent.hidePopup();
            }
        }
    };
    CheckBoxSelection.prototype.onDocumentClick = function (e) {
        if (this.parent.getLocaleName() !== 'listbox') {
            var target = e.target;
            if (!sf.base.isNullOrUndefined(this.parent.popupObj) && sf.base.closest(target, '#' + this.parent.popupObj.element.id)) {
                if (!(this.filterInput && this.filterInput.value !== '')) {
                    e.preventDefault();
                }
            }
            if (!(!sf.base.isNullOrUndefined(this.parent.popupObj) && sf.base.closest(target, '#' + this.parent.popupObj.element.id)) &&
                !this.parent.overAllWrapper.contains(e.target)) {
                if (this.parent.overAllWrapper.classList.contains(sf.dropdowns.dropDownBaseClasses.focus) || this.parent.isPopupOpen()) {
                    this.parent.inputFocus = false;
                    this.parent.scrollFocusStatus = false;
                    this.parent.hidePopup();
                    this.parent.onBlur(e, true);
                    this.parent.focused = true;
                }
            }
            else {
                this.parent.scrollFocusStatus = (sf.base.Browser.isIE || sf.base.Browser.info.name === 'edge') && (document.activeElement === this.filterInput);
            }
            if (!this.parent.overAllWrapper.contains(e.target) && this.parent.overAllWrapper.classList.contains('e-input-focus') &&
                !this.parent.isPopupOpen()) {
                if (sf.base.Browser.isIE) {
                    this.parent.onBlur();
                }
                else {
                    this.parent.onBlur(e);
                }
            }
            if (this.filterInput === target) {
                this.filterInput.focus();
            }
        }
    };
    CheckBoxSelection.prototype.getFocus = function (e) {
        this.parent.overAllWrapper.classList.remove(FOCUS);
        if (this.parent.keyAction && e.value !== 'clear') {
            this.parent.keyAction = false;
            return;
        }
        if (e.value === 'focus') {
            this.filterInput.focus();
            this.parent.removeFocus();
            sf.base.EventHandler.remove(this.parent.list, 'keydown', this.parent.onKeyDown);
        }
        if (e.value === 'clear') {
            this.filterInput.value = '';
            this.clearIconElement.style.visibility = 'hidden';
        }
    };
    CheckBoxSelection.prototype.checkSelectAll = function (e) {
        if (e.value === 'check' && this.checkAllParent.getAttribute('aria-checked') !== 'true') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale(true);
        }
        if (e.value === 'uncheck') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale();
        }
        if (e.value === 'indeterminate') {
            this.changeState(this.checkAllParent, e.value, null, null, false);
            this.setLocale();
        }
    };
    CheckBoxSelection.prototype.setLocale = function (unSelect) {
        if (this.parent.selectAllText !== 'Select All' || this.parent.unSelectAllText !== 'Unselect All') {
            var template = unSelect ? this.parent.unSelectAllText : this.parent.selectAllText;
            var compiledString = void 0;
            this.selectAllSpan.textContent = '';
            compiledString = sf.base.compile(template);
            for (var _i = 0, _a = compiledString({}, null, null, null, !this.parent.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            var l10nLocale = { selectAllText: 'Select All', unSelectAllText: 'Unselect All' };
            var l10n = new sf.base.L10n(this.parent.getLocaleName(), {}, this.parent.locale);
            if (l10n.getConstant('selectAllText') === '') {
                l10n = new sf.base.L10n('dropdowns', l10nLocale, this.parent.locale);
            }
            this.selectAllSpan.textContent = unSelect ? l10n.getConstant('unSelectAllText') : l10n.getConstant('selectAllText');
        }
    };
    CheckBoxSelection.prototype.getActiveList = function (args) {
        if (args.li.classList.contains('e-active')) {
            this.activeLi.push(args.li.cloneNode(true));
        }
        else {
            this.activeLi.splice(args.index, 1);
        }
    };
    CheckBoxSelection.prototype.setReorder = function (args) {
        if (this.parent.enableSelectionOrder && !sf.base.isNullOrUndefined(this.parent.value)) {
            var activeLiCount = this.parent.ulElement.querySelectorAll('li.e-active').length;
            var remLi = void 0;
            var ulEle = this.parent.createElement('ul', {
                className: 'e-list-parent e-ul e-reorder'
            });
            var removeEle = this.parent.createElement('div');
            if (activeLiCount > 0) {
                sf.base.append(this.parent.ulElement.querySelectorAll('li.e-active'), ulEle);
                remLi = this.parent.ulElement.querySelectorAll('li.e-active');
                sf.base.addClass(remLi, 'e-reorder-hide');
                sf.base.prepend([ulEle], this.parent.list);
            }
            this.parent.focusAtFirstListItem();
        }
    };
    return CheckBoxSelection;
}());

/**
 * export all modules from current location
 */

ListBox.Inject(CheckBoxSelection);

exports.SelectionSettings = SelectionSettings;
exports.ToolbarSettings = ToolbarSettings;
exports.ListBox = ListBox;
exports.CheckBoxSelection = CheckBoxSelection;

return exports;

});
sfBlazor.modules["listbox"] = "dropdowns.ListBox";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.listbox, () => {
    sf.dropdowns = sf.base.extend({}, sf.dropdowns, sflistbox({}));
});