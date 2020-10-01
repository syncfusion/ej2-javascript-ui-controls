window.sf = window.sf || {};
var sfautocomplete = (function (exports) {
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
/// <reference path='../combo-box/combo-box-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
sf.dropdowns.dropDownListClasses.root = 'e-autocomplete';
sf.dropdowns.dropDownListClasses.icon = 'e-input-group-icon e-ddl-icon e-search-icon';
/**
 * The AutoComplete component provides the matched suggestion list when type into the input,
 * from which the user can select one.
 * ```html
 * <input id="list" type="text"/>
 * ```
 * ```typescript
 *   let atcObj:AutoComplete = new AutoComplete();
 *   atcObj.appendTo("#list");
 * ```
 */
var AutoComplete = /** @class */ (function (_super) {
    __extends(AutoComplete, _super);
    /**
     * * Constructor for creating the widget
     */
    function AutoComplete(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isFiltered = false;
        return _this;
    }
    
    /**
     * Initialize the event handler
     * @private
     */
    AutoComplete.prototype.preRender = function () {
        _super.prototype.preRender.call(this);
    };
    AutoComplete.prototype.getLocaleName = function () {
        return 'auto-complete';
    };
    
    AutoComplete.prototype.getNgDirective = function () {
        return 'EJS-AUTOCOMPLETE';
    };
    AutoComplete.prototype.getQuery = function (query) {
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new sf.data.Query();
        var filterType = (this.queryString === '' && !sf.base.isNullOrUndefined(this.value)) ? 'equal' : this.filterType;
        var queryString = (this.queryString === '' && !sf.base.isNullOrUndefined(this.value)) ? this.value : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null && this.queryString !== '') {
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof sf.data.DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var mapping = !sf.base.isNullOrUndefined(this.fields.value) ? this.fields.value : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!sf.base.isNullOrUndefined(this.suggestionCount)) {
            // Since defualt value of suggestioncount is 20, checked the condition
            if (this.suggestionCount !== 20) {
                for (var queryElements = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements].fn === 'onTake') {
                        filterQuery.queries.splice(queryElements, 1);
                    }
                }
            }
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    };
    AutoComplete.prototype.searchLists = function (e) {
        var _this = this;
        this.isTyped = true;
        this.isDataFetched = this.isSelectCustom = false;
        if (this.isServerBlazor) {
            this.beforePopupOpen = (this.isFiltering() && !this.beforePopupOpen) ? !this.beforePopupOpen : this.beforePopupOpen;
            this.queryString = this.filterInput.value;
            if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerFilter', this.filterInput.value);
            }
            else {
                this.hidePopup();
            }
        }
        else {
            if (sf.base.isNullOrUndefined(this.list)) {
                _super.prototype.renderList.call(this, true);
            }
            this.queryString = this.filterInput.value;
            if (e.keyCode === 40 || e.keyCode === 38) {
                this.queryString = this.queryString === '' ? null : this.queryString;
                this.beforePopupOpen = true;
                this.resetList(this.dataSource, this.fields);
                return;
            }
            this.isSelected = false;
            this.activeIndex = null;
            var eventArgs_1 = {
                preventDefaultAction: false,
                text: this.filterInput.value,
                updateData: function (dataSource, query, fields) {
                    if (eventArgs_1.cancel) {
                        return;
                    }
                    _this.isFiltered = true;
                    _this.filterAction(dataSource, query, fields);
                },
                cancel: false
            };
            this.trigger('filtering', eventArgs_1, function (eventArgs) {
                if (!eventArgs.cancel && !_this.isFiltered && !eventArgs.preventDefaultAction) {
                    _this.filterAction(_this.dataSource, null, _this.fields);
                }
            });
        }
    };
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    AutoComplete.prototype.filter = function (dataSource, query, fields) {
        this.isFiltered = true;
        this.filterAction(dataSource, query, fields);
    };
    AutoComplete.prototype.filterAction = function (dataSource, query, fields) {
        this.beforePopupOpen = true;
        if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
            this.resetList(dataSource, fields, query);
        }
        else {
            this.hidePopup();
        }
        this.renderReactTemplates();
    };
    AutoComplete.prototype.clearAll = function (e, property) {
        if (sf.base.isNullOrUndefined(property) || (!sf.base.isNullOrUndefined(property) && sf.base.isNullOrUndefined(property.dataSource))) {
            _super.prototype.clearAll.call(this, e);
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    };
    AutoComplete.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        this.fixedHeaderElement = null;
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        var item = this.list.querySelector('.' + sf.dropdowns.dropDownListClasses.li);
        if (!sf.base.isNullOrUndefined(item)) {
            sf.base.removeClass([item], sf.dropdowns.dropDownListClasses.focus);
        }
        this.postBackAction();
    };
    AutoComplete.prototype.postBackAction = function () {
        if (this.autofill && !sf.base.isNullOrUndefined(this.liCollections[0])) {
            var items = [this.liCollections[0]];
            var searchItem = sf.dropdowns.Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase);
            if (!sf.base.isNullOrUndefined(searchItem.item)) {
                _super.prototype.setAutoFill.call(this, this.liCollections[0], true);
            }
        }
    };
    AutoComplete.prototype.setSelection = function (li, e) {
        if (!this.isValidLI(li)) {
            return;
        }
        if (!sf.base.isNullOrUndefined(e) && e.type === 'keydown' && e.action !== 'enter'
            && e.action !== 'tab' && this.isValidLI(li)) {
            var value = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            if (this.isServerBlazor) {
                this.removeHover();
            }
            this.setHoverList(li);
            this.selectedLI = li;
            this.setScrollPosition(e);
            if (this.autofill && this.isPopupOpen) {
                this.preventAutoFill = false;
                _super.prototype.setAutoFill.call(this, li);
            }
            sf.base.attributes(this.inputElement, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        }
        else {
            _super.prototype.setSelection.call(this, li, e);
        }
    };
    AutoComplete.prototype.listOption = function (dataSource, fieldsSettings) {
        var _this = this;
        var fields = _super.prototype.listOption.call(this, dataSource, fieldsSettings);
        if (sf.base.isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    if (_this.element.tagName === _this.getNgDirective() && _this.itemTemplate) {
                        setTimeout(function () { sf.dropdowns.highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType); }, 0);
                    }
                    else {
                        sf.dropdowns.highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                    }
                }
            };
        }
        else {
            var itemCreated_1 = fields.itemCreated;
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    sf.dropdowns.highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                }
                itemCreated_1.apply(_this, [e]);
            };
        }
        return fields;
    };
    
    AutoComplete.prototype.isFiltering = function () {
        return true;
    };
    AutoComplete.prototype.renderPopup = function () {
        this.list.scrollTop = 0;
        _super.prototype.renderPopup.call(this);
    };
    AutoComplete.prototype.isEditTextBox = function () {
        return true && this.inputElement.value.trim() !== '';
    };
    AutoComplete.prototype.isPopupButton = function () {
        return this.showPopupButton;
    };
    AutoComplete.prototype.isSelectFocusItem = function (element) {
        return false;
    };
    /**
     * Search the entered text and show it in the suggestion list if available.
     * @returns void.
     * @deprecated
     */
    AutoComplete.prototype.showPopup = function () {
        if (!this.enabled) {
            return;
        }
        if (this.beforePopupOpen && !this.isServerBlazor) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        this.preventAutoFill = true;
        if (sf.base.isNullOrUndefined(this.list) || this.isServerBlazor) {
            this.renderList();
        }
        else {
            this.resetList(this.dataSource, this.fields);
        }
    };
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     */
    AutoComplete.prototype.hidePopup = function () {
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        _super.prototype.hidePopup.call(this);
        this.activeIndex = -1;
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    AutoComplete.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'autocomplete') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'showPopupButton':
                    if (this.showPopupButton) {
                        if (!this.isServerBlazor) {
                            var button = sf.inputs.Input.appendSpan(sf.dropdowns.dropDownListClasses.icon, this.inputWrapper.container, this.createElement);
                            this.inputWrapper.buttons[0] = button;
                        }
                        else if (this.inputWrapper && this.inputWrapper.container) {
                            var button = this.inputWrapper.container.querySelector('.e-input-group-icon.e-ddl-icon');
                            this.inputWrapper.buttons[0] = button;
                        }
                        if (this.inputWrapper && this.inputWrapper.buttons && this.inputWrapper.buttons[0]) {
                            sf.base.EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                        }
                    }
                    else if (!this.isServerBlazor) {
                        sf.base.detach(this.inputWrapper.buttons[0]);
                        this.inputWrapper.buttons[0] = null;
                    }
                    break;
                default:
                    var atcProps = void 0;
                    atcProps = this.getPropObject(prop, newProp, oldProp);
                    _super.prototype.onPropertyChanged.call(this, atcProps.newProperty, atcProps.oldProperty);
                    break;
            }
        }
    };
    AutoComplete.prototype.renderHightSearch = function () {
        if (this.highlight) {
            for (var i = 0; i < this.liCollections.length; i++) {
                var isHighlight = this.ulElement.querySelector('.e-active');
                if (!isHighlight) {
                    sf.dropdowns.revertHighlightSearch(this.liCollections[i]);
                    sf.dropdowns.highlightSearch(this.liCollections[i], this.queryString, this.ignoreCase, this.filterType, this.isServerBlazor);
                }
            }
        }
    };
    /**
     * Return the module name of this component.
     * @private
     */
    AutoComplete.prototype.getModuleName = function () {
        return 'autocomplete';
    };
    /**
     * To initialize the control rendering
     * @private
     */
    AutoComplete.prototype.render = function () {
        _super.prototype.render.call(this);
    };
    
    __decorate([
        sf.base.Complex({ value: null, iconCss: null, groupBy: null }, sf.dropdowns.FieldSettings)
    ], AutoComplete.prototype, "fields", void 0);
    __decorate([
        sf.base.Property(true)
    ], AutoComplete.prototype, "ignoreCase", void 0);
    __decorate([
        sf.base.Property(false)
    ], AutoComplete.prototype, "showPopupButton", void 0);
    __decorate([
        sf.base.Property(false)
    ], AutoComplete.prototype, "highlight", void 0);
    __decorate([
        sf.base.Property(20)
    ], AutoComplete.prototype, "suggestionCount", void 0);
    __decorate([
        sf.base.Property({})
    ], AutoComplete.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(null)
    ], AutoComplete.prototype, "query", void 0);
    __decorate([
        sf.base.Property(1)
    ], AutoComplete.prototype, "minLength", void 0);
    __decorate([
        sf.base.Property('Contains')
    ], AutoComplete.prototype, "filterType", void 0);
    __decorate([
        sf.base.Event()
    ], AutoComplete.prototype, "filtering", void 0);
    __decorate([
        sf.base.Property(null)
    ], AutoComplete.prototype, "index", void 0);
    __decorate([
        sf.base.Property('Never')
    ], AutoComplete.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(null)
    ], AutoComplete.prototype, "valueTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], AutoComplete.prototype, "filterBarPlaceholder", void 0);
    __decorate([
        sf.base.Property(false)
    ], AutoComplete.prototype, "allowFiltering", void 0);
    __decorate([
        sf.base.Property(null)
    ], AutoComplete.prototype, "text", void 0);
    AutoComplete = __decorate([
        sf.base.NotifyPropertyChanges
    ], AutoComplete);
    return AutoComplete;
}(sf.dropdowns.ComboBox));

/**
 * export all modules from current location
 */

exports.AutoComplete = AutoComplete;

return exports;

});

    sf.dropdowns = sf.base.extend({}, sf.dropdowns, sfautocomplete({}));