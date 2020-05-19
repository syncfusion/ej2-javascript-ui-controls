import { Animation, Browser, ChildProperty, Complex, Component, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getComponent, getUniqueID, getValue, isBlazor, isNullOrUndefined, isUndefined, matches, prepend, remove, removeClass, resetBlazorTemplate, rippleEffect, select, selectAll, setStyleAttribute, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { DataManager, DataUtil, Predicate, Query } from '@syncfusion/ej2-data';
import { ListBase, Sortable, cssClass, moveTo } from '@syncfusion/ej2-lists';
import { Popup, createSpinner, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Input, TextBox } from '@syncfusion/ej2-inputs';
import { Button, createCheckBox } from '@syncfusion/ej2-buttons';
import { TreeView } from '@syncfusion/ej2-navigations';

/**
 * IncrementalSearch module file
 */
var queryString = '';
var prevString = '';
var matches$1 = [];
var activeClass = 'e-active';
/**
 * Search and focus the list item based on key code matches with list text content
 * @param  { number } keyCode - Specifies the key code which pressed on keyboard events.
 * @param  { HTMLElement[]] } items - Specifies an array of HTMLElement, from which matches find has done.
 * @param { number } selectedIndex - Specifies the selected item in list item, so that search will happen
 * after selected item otherwise it will do from initial.
 * @param  { boolean } ignoreCase - Specifies the case consideration when search has done.
 */
function incrementalSearch(keyCode, items, selectedIndex, ignoreCase, isBlazor$$1) {
    queryString += String.fromCharCode(keyCode);
    setTimeout(function () { queryString = ''; }, 1000);
    var index;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevString === queryString) {
        for (var i = 0; i < matches$1.length; i++) {
            if (matches$1[i].classList.contains(activeClass)) {
                index = i;
                break;
            }
        }
        index = index + 1;
        return matches$1[index];
    }
    else {
        var listItems = items;
        var strLength = queryString.length;
        var text = void 0;
        var item = void 0;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        var i = selectedIndex;
        matches$1 = [];
        do {
            if (i === listItems.length) {
                i = -1;
            }
            i === -1 ? index = 0 : index = i;
            item = listItems[index];
            if (isBlazor$$1) {
                text = ignoreCase ? item.textContent.trim().toLowerCase() : item.textContent.trim();
            }
            else {
                text = ignoreCase ? item.innerText.toLowerCase() : item.innerText;
            }
            if (text.substr(0, strLength) === queryString) {
                matches$1.push(listItems[index]);
            }
            i++;
        } while (i !== selectedIndex);
        prevString = queryString;
        return matches$1[0];
    }
}
function Search(inputVal, items, searchType, ignoreCase) {
    var listItems = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    var itemData = { item: null, index: null };
    if (inputVal && inputVal.length) {
        var strLength = inputVal.length;
        var queryStr = ignoreCase ? inputVal.toLocaleLowerCase() : inputVal;
        for (var i = 0, itemsData = listItems; i < itemsData.length; i++) {
            var item = itemsData[i];
            var text = (ignoreCase ? item.textContent.toLocaleLowerCase() : item.textContent).replace(/^\s+|\s+$/g, '');
            if ((searchType === 'Equal' && text === queryStr) || (searchType === 'StartsWith' && text.substr(0, strLength) === queryStr)) {
                itemData.item = item;
                itemData.index = i;
                return { item: item, index: i };
            }
        }
        return itemData;
    }
    return itemData;
}

/**
 * Function helps to find which highlightSearch is to call based on your data.
 * @param  {HTMLElement} element - Specifies an li element.
 * @param  {string} query - Specifies the string to be highlighted.
 * @param  {boolean} ignoreCase - Specifies the ignoreCase option.
 * @param  {HightLightType} type - Specifies the type of highlight.
 */
function highlightSearch(element, query, ignoreCase, type, isBlazor$$1) {
    if (query === '') {
        return;
    }
    else {
        var ignoreRegex = ignoreCase ? 'gim' : 'gm';
        query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        var replaceQuery = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
        findTextNode(element, new RegExp(replaceQuery, ignoreRegex), isBlazor$$1);
    }
}
function findTextNode(element, pattern, isBlazor$$1) {
    for (var index = 0; element.childNodes && (index < element.childNodes.length); index++) {
        if (element.childNodes[index].nodeType === 3) {
            element = (isBlazor$$1 && element.classList.contains('e-highlight')) ? element.parentElement : element;
            if (isBlazor$$1 && element.getAttribute('data-value')) {
                element.innerHTML = element.getAttribute('data-value').replace(pattern, '<span class="e-highlight">$1</span>');
            }
            else {
                element.innerHTML = element.innerHTML.replace(pattern, '<span class="e-highlight">$1</span>');
            }
            break;
        }
        else {
            findTextNode(element.childNodes[index], pattern, isBlazor$$1);
        }
    }
}
/**
 * Function helps to remove highlighted element based on your data.
 * @param  {HTMLElement} content - Specifies an content element.
 */
function revertHighlightSearch(content) {
    var contentElement = content.querySelectorAll('.e-highlight');
    for (var i = contentElement.length - 1; i >= 0; i--) {
        var parent_1 = contentElement[i].parentNode;
        var text = document.createTextNode(contentElement[i].textContent);
        parent_1.replaceChild(text, contentElement[i]);
    }
}

/**
 * Common source
 */

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
var FieldSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "value", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "groupBy", void 0);
    __decorate([
        Property()
    ], FieldSettings.prototype, "htmlAttributes", void 0);
    return FieldSettings;
}(ChildProperty));
var dropDownBaseClasses = {
    root: 'e-dropdownbase',
    rtl: 'e-rtl',
    content: 'e-content',
    selected: 'e-active',
    hover: 'e-hover',
    noData: 'e-nodata',
    fixedHead: 'e-fixed-head',
    focus: 'e-item-focus',
    li: 'e-list-item',
    group: 'e-list-group-item',
    disabled: 'e-disabled',
    grouping: 'e-dd-group'
};
var ITEMTEMPLATE_PROPERTY = 'ItemTemplate';
var VALUETEMPLATE_PROPERTY = 'ValueTemplate';
var GROUPTEMPLATE_PROPERTY = 'GroupTemplate';
var HEADERTEMPLATE_PROPERTY = 'HeaderTemplate';
var FOOTERTEMPLATE_PROPERTY = 'FooterTemplate';
var NORECORDSTEMPLATE_PROPERTY = 'NoRecordsTemplate';
var ACTIONFAILURETEMPLATE_PROPERTY = 'ActionFailureTemplate';
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
var DropDownBase = /** @__PURE__ @class */ (function (_super) {
    __extends(DropDownBase, _super);
    /**
     * * Constructor for DropDownBase class
     */
    function DropDownBase(options, element) {
        return _super.call(this, options, element) || this;
    }
    
    DropDownBase.prototype.getPropObject = function (prop, newProp, oldProp) {
        var newProperty = new Object();
        var oldProperty = new Object();
        // tslint:disable-next-line:no-function-constructor-with-string-args
        var propName = function (prop) {
            return prop;
        };
        newProperty[propName(prop)] = newProp[propName(prop)];
        oldProperty[propName(prop)] = oldProp[propName(prop)];
        var data = new Object();
        data.newProperty = newProperty;
        data.oldProperty = oldProperty;
        return data;
    };
    DropDownBase.prototype.getValueByText = function (text, ignoreCase, ignoreAccent) {
        var value = null;
        if (!isNullOrUndefined(this.listData)) {
            if (ignoreCase) {
                value = this.checkValueCase(text, true, ignoreAccent);
            }
            else {
                value = this.checkValueCase(text, false, ignoreAccent);
            }
        }
        return value;
    };
    
    DropDownBase.prototype.checkValueCase = function (text, ignoreCase, ignoreAccent, isTextByValue) {
        var _this = this;
        var value = null;
        if (isTextByValue) {
            value = text;
        }
        var dataSource = this.listData;
        var fields = this.fields;
        var type = this.typeOfData(dataSource).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
                var item = dataSource_1[_i];
                if (!isNullOrUndefined(item)) {
                    if (ignoreAccent) {
                        value = this.checkingAccent(String(item), text, ignoreCase);
                    }
                    else {
                        if (ignoreCase) {
                            if (this.checkIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase);
                            }
                        }
                        else {
                            if (this.checkNonIgnoreCase(String(item), text)) {
                                value = this.getItemValue(String(item), text, ignoreCase, isTextByValue);
                            }
                        }
                    }
                }
            }
        }
        else {
            if (ignoreCase) {
                dataSource.filter(function (item) {
                    var itemValue = getValue(fields.value, item);
                    if (!isNullOrUndefined(itemValue) && _this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = getValue(fields.value, item);
                    }
                });
            }
            else {
                if (isTextByValue) {
                    dataSource.filter(function (item) {
                        var itemValue = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && !isNullOrUndefined(value) && itemValue.toString() === value.toString()) {
                            value = getValue(fields.text, item);
                        }
                    });
                }
                else {
                    dataSource.filter(function (item) {
                        if (_this.checkNonIgnoreCase(getValue(fields.text, item), text)) {
                            value = getValue(fields.value, item);
                        }
                    });
                }
            }
        }
        return value;
    };
    DropDownBase.prototype.checkingAccent = function (item, text, ignoreCase) {
        var dataItem = DataUtil.ignoreDiacritics(String(item));
        var textItem = DataUtil.ignoreDiacritics(text.toString());
        var value = null;
        if (ignoreCase) {
            if (this.checkIgnoreCase(dataItem, textItem)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        }
        else {
            if (this.checkNonIgnoreCase(String(item), text)) {
                value = this.getItemValue(String(item), text, ignoreCase);
            }
        }
        return value;
    };
    DropDownBase.prototype.checkIgnoreCase = function (item, text) {
        return String(item).toLowerCase() === text.toString().toLowerCase() ? true : false;
    };
    DropDownBase.prototype.checkNonIgnoreCase = function (item, text) {
        return String(item) === text.toString() ? true : false;
    };
    DropDownBase.prototype.getItemValue = function (dataItem, typedText, ignoreCase, isTextByValue) {
        var value = null;
        var dataSource = this.listData;
        var type = this.typeOfData(dataSource).typeof;
        if (isTextByValue) {
            value = dataItem.toString();
        }
        else {
            if (ignoreCase) {
                value = type === 'string' ? String(dataItem) : this.getFormattedValue(String(dataItem));
            }
            else {
                value = type === 'string' ? typedText : this.getFormattedValue(typedText);
            }
        }
        return value;
    };
    DropDownBase.prototype.l10nUpdate = function (actionFailure) {
        var ele = this.getModuleName() === 'listbox' ? this.ulElement : this.list;
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            this.DropDownBaseresetBlazorTemplates(false, false, true, true);
            var template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            var compiledString = void 0;
            var templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            ele.innerHTML = '';
            compiledString = compile(template);
            for (var _i = 0, _a = compiledString({}, null, null, templateId, this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                ele.appendChild(item);
            }
            this.DropDownBaseupdateBlazorTemplates(false, false, !actionFailure, actionFailure, false, false, false, false);
        }
        else {
            var l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            var componentLocale = new L10n(this.getLocaleName(), {}, this.locale);
            if (componentLocale.getConstant('actionFailureTemplate') !== '') {
                this.l10n = componentLocale;
            }
            else {
                this.l10n = new L10n(this.getModuleName() === 'listbox' ? 'listbox' : 'dropdowns', l10nLocale, this.locale);
            }
            var content = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
            if (this.getModuleName() === 'listbox') {
                var liElem = this.createElement('li');
                liElem.textContent = content;
                ele.appendChild(liElem);
                liElem.classList.add('e-list-nrt');
            }
            else {
                ele.innerHTML = content;
            }
        }
    };
    DropDownBase.prototype.getLocaleName = function () {
        return 'drop-down-base';
    };
    
    DropDownBase.prototype.getTextByValue = function (value) {
        var text;
        text = this.checkValueCase(value, false, false, true);
        return text;
    };
    DropDownBase.prototype.getFormattedValue = function (value) {
        if (this.listData && this.listData.length) {
            var item = this.typeOfData(this.listData);
            if (isBlazor() && isNullOrUndefined(value) || value === 'null') {
                return null;
            }
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'number'
                || item.typeof === 'number') {
                return parseFloat(value);
            }
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'boolean'
                || item.typeof === 'boolean') {
                return (value === 'true');
            }
        }
        return value;
    };
    /**
     * Sets RTL to dropdownbase wrapper
     */
    DropDownBase.prototype.setEnableRtl = function () {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        this.enableRtl ? addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    };
    
    /**
     * Initialize the Component.
     */
    DropDownBase.prototype.initialize = function () {
        this.bindEvent = true;
        this.actionFailureTemplateId = "" + this.element.id + ACTIONFAILURETEMPLATE_PROPERTY;
        if (this.element.tagName === 'UL') {
            var jsonElement = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        }
        else if (this.element.tagName === 'SELECT') {
            var dataSource = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) {
                this.renderItemsBySelect();
            }
        }
        else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    };
    
    DropDownBase.prototype.DropDownBaseupdateBlazorTemplates = function (item, group, noRecord, action, value, header, footer, isEmpty) {
        if (!this.isStringTemplate) {
            if (this.itemTemplate && item) {
                updateBlazorTemplate(this.itemTemplateId, ITEMTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.groupTemplate && group) {
                updateBlazorTemplate(this.groupTemplateId, GROUPTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.noRecordsTemplate && noRecord) {
                updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY, this, isEmpty);
            }
            if (value) {
                updateBlazorTemplate(this.valueTemplateId, VALUETEMPLATE_PROPERTY, this, isEmpty);
            }
            if (header) {
                updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY, this);
            }
            if (footer) {
                updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY, this);
            }
        }
    };
    DropDownBase.prototype.DropDownBaseresetBlazorTemplates = function (item, group, noRecord, action, value, header, footer) {
        if (!this.isStringTemplate) {
            if (this.itemTemplate && item) {
                resetBlazorTemplate(this.itemTemplateId, ITEMTEMPLATE_PROPERTY);
            }
            if (this.groupTemplate && group) {
                resetBlazorTemplate(this.groupTemplateId, GROUPTEMPLATE_PROPERTY);
            }
            if (this.noRecordsTemplate && noRecord) {
                resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY);
            }
            if (this.actionFailureTemplate && action) {
                resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY);
            }
            if (value) {
                resetBlazorTemplate(this.valueTemplateId, VALUETEMPLATE_PROPERTY);
            }
            if (header) {
                resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY);
            }
            if (footer) {
                resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY);
            }
        }
    };
    /**
     * Get the properties to be maintained in persisted state.
     */
    DropDownBase.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    
    /**
     * Sets the enabled state to DropDownBase.
     */
    DropDownBase.prototype.setEnabled = function () {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
    };
    
    /**
     * Sets the enabled state to DropDownBase.
     */
    DropDownBase.prototype.updateDataAttribute = function (value) {
        var invalidAttr = ['class', 'style', 'id', 'type'];
        var attr = {};
        for (var a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(this.getModuleName() === 'dropdownlist' && this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    };
    DropDownBase.prototype.renderItemsBySelect = function () {
        var element = this.element;
        var fields = { value: 'value', text: 'text' };
        var jsonElement = [];
        var group = element.querySelectorAll('select>optgroup');
        var option = element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (var i = 0; i < group.length; i++) {
                var item = group[i];
                var optionGroup = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                var child = item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            var items = element.querySelectorAll('select>option');
        }
        this.fields.text = fields.text;
        this.fields.value = fields.value;
        this.resetList(jsonElement, fields);
    };
    DropDownBase.prototype.getJSONfromOption = function (items, options, fields) {
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var option = options_1[_i];
            var json = {};
            json[fields.text] = option.innerText;
            json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    };
    /**
     * Execute before render the list items
     * @private
     */
    DropDownBase.prototype.preRender = function () {
        // there is no event handler
        this.scrollTimer = -1;
        this.enableRtlElements = [];
        this.isRequested = false;
        this.isDataFetched = false;
        this.itemTemplateId = "" + this.element.id + ITEMTEMPLATE_PROPERTY;
        this.valueTemplateId = "" + this.element.id + VALUETEMPLATE_PROPERTY;
        this.groupTemplateId = "" + this.element.id + GROUPTEMPLATE_PROPERTY;
        this.headerTemplateId = "" + this.element.id + HEADERTEMPLATE_PROPERTY;
        this.footerTemplateId = "" + this.element.id + FOOTERTEMPLATE_PROPERTY;
        this.noRecordsTemplateId = "" + this.element.id + NORECORDSTEMPLATE_PROPERTY;
    };
    /**
     * Creates the list items of DropDownBase component.
     */
    DropDownBase.prototype.setListData = function (dataSource, fields, query) {
        var _this = this;
        fields = fields ? fields : this.fields;
        var ulElement;
        this.isActive = true;
        var eventArgs = { cancel: false, data: dataSource, query: query };
        this.trigger('actionBegin', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel) {
                _this.showSpinner();
                if (dataSource instanceof DataManager) {
                    _this.isRequested = true;
                    if (_this.isDataFetched) {
                        _this.emptyDataRequest(fields);
                        return;
                    }
                    eventArgs.data.executeQuery(_this.getQuery(eventArgs.query)).then(function (e) {
                        _this.trigger('actionComplete', e, function (e) {
                            if (!e.cancel) {
                                var listItems = e.result;
                                if (listItems.length === 0) {
                                    _this.isDataFetched = true;
                                }
                                ulElement = _this.renderItems(listItems, fields);
                                _this.onActionComplete(ulElement, listItems, e);
                                if (_this.groupTemplate) {
                                    _this.renderGroupTemplate(ulElement);
                                }
                                _this.isRequested = false;
                                _this.bindChildItems(listItems, ulElement, fields, e);
                            }
                        });
                    }).catch(function (e) {
                        _this.isRequested = false;
                        _this.onActionFailure(e);
                        _this.hideSpinner();
                    });
                }
                else {
                    var dataManager = new DataManager(eventArgs.data);
                    var listItems = (_this.getQuery(eventArgs.query)).executeLocal(dataManager);
                    var localDataArgs = { cancel: false, result: listItems };
                    _this.trigger('actionComplete', localDataArgs, function (localDataArgs) {
                        if (!localDataArgs.cancel) {
                            ulElement = _this.renderItems(localDataArgs.result, fields);
                            _this.onActionComplete(ulElement, localDataArgs.result);
                            if (_this.groupTemplate) {
                                _this.renderGroupTemplate(ulElement);
                            }
                            _this.bindChildItems(localDataArgs.result, ulElement, fields);
                        }
                    });
                }
            }
        });
    };
    DropDownBase.prototype.bindChildItems = function (listItems, ulElement, fields, e) {
        var _this = this;
        if (listItems.length >= 100 && this.getModuleName() === 'autocomplete') {
            setTimeout(function () {
                var childNode = _this.remainingItems(_this.sortedData, fields);
                append(childNode, ulElement);
                _this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
                _this.liCollections = _this.list.querySelectorAll('.' + dropDownBaseClasses.li);
                _this.updateListValues();
                _this.raiseDataBound(listItems, e);
            }, 0);
        }
        else {
            this.raiseDataBound(listItems, e);
        }
    };
    DropDownBase.prototype.updateListValues = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.findListElement = function (list, findNode, attribute, value) {
        var liElement = null;
        if (list) {
            var listArr = [].slice.call(list.querySelectorAll(findNode));
            for (var index = 0; index < listArr.length; index++) {
                if (listArr[index].getAttribute(attribute) === (value + '')) {
                    liElement = listArr[index];
                    break;
                }
            }
        }
        return liElement;
    };
    DropDownBase.prototype.raiseDataBound = function (listItems, e) {
        this.hideSpinner();
        var dataBoundEventArgs = {
            items: listItems,
            e: e
        };
        this.trigger('dataBound', dataBoundEventArgs);
    };
    DropDownBase.prototype.remainingItems = function (dataSource, fields) {
        var spliceData = new DataManager(dataSource).executeLocal(new Query().skip(100));
        if (this.itemTemplate) {
            var listElements = this.templateListItem(spliceData, fields);
            return [].slice.call(listElements.childNodes);
        }
        var type = this.typeOfData(spliceData).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return ListBase.createListItemFromArray(this.createElement, spliceData, true, this.listOption(spliceData, fields));
        }
        return ListBase.createListItemFromJson(this.createElement, spliceData, this.listOption(spliceData, fields), 1, true);
    };
    DropDownBase.prototype.emptyDataRequest = function (fields) {
        var listItems = [];
        this.onActionComplete(this.renderItems(listItems, fields), listItems);
        this.isRequested = false;
        this.hideSpinner();
    };
    DropDownBase.prototype.showSpinner = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.hideSpinner = function () {
        // Used this method in component side.
    };
    DropDownBase.prototype.onActionFailure = function (e) {
        this.liCollections = [];
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.list], dropDownBaseClasses.noData);
    };
    DropDownBase.prototype.onActionComplete = function (ulElement, list, e) {
        this.listData = list;
        if (isBlazor() && this.isServerRendered && this.getModuleName() === 'listbox') {
            remove(this.list.querySelector('.e-list-parent'));
            remove(this.list.querySelector('.e-hidden-select'));
        }
        else {
            this.list.innerHTML = '';
        }
        this.fixedHeaderElement = isNullOrUndefined(this.fixedHeaderElement) ? this.fixedHeaderElement : null;
        this.list.appendChild(ulElement);
        this.liCollections = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    };
    DropDownBase.prototype.postRender = function (listElement, list, bindEvent) {
        var focusItem = listElement.querySelector('.' + dropDownBaseClasses.li);
        var selectedItem = listElement.querySelector('.' + dropDownBaseClasses.selected);
        if (focusItem && !selectedItem) {
            focusItem.classList.add(dropDownBaseClasses.focus);
        }
        if (list.length <= 0) {
            this.l10nUpdate();
            addClass([listElement], dropDownBaseClasses.noData);
        }
        else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
    };
    /**
     * Get the query to do the data operation before list item generation.
     */
    DropDownBase.prototype.getQuery = function (query) {
        return query ? query : this.query ? this.query : new Query();
    };
    /**
     * To render the template content for group header element.
     */
    DropDownBase.prototype.renderGroupTemplate = function (listEle) {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            var dataSource = this.dataSource;
            var option = { groupTemplateID: this.groupTemplateId, isStringTemplate: this.isStringTemplate };
            var headerItems = listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            var tempHeaders = ListBase.renderGroupTemplate(this.groupTemplate, dataSource, this.fields.properties, headerItems, option);
            this.DropDownBaseupdateBlazorTemplates(false, true, false, false, false, false, false, false);
        }
    };
    /**
     * To create the ul li list items
     */
    DropDownBase.prototype.createListItems = function (dataSource, fields) {
        if (dataSource && fields.groupBy || this.element.querySelector('optgroup')) {
            if (fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            addClass([this.list], dropDownBaseClasses.grouping);
        }
        else {
            dataSource = this.getSortedDataSource(dataSource);
        }
        var options = this.listOption(dataSource, fields);
        var spliceData = (dataSource.length > 100) ?
            new DataManager(dataSource).executeLocal(new Query().take(100))
            : dataSource;
        this.sortedData = dataSource;
        return ListBase.createList(this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true);
    };
    
    DropDownBase.prototype.listOption = function (dataSource, fields) {
        var iconCss = isNullOrUndefined(fields.iconCss) ? false : true;
        var fieldValues = !isNullOrUndefined(fields.properties) ?
            fields.properties : fields;
        var options = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        return extend({}, options, fields, true);
    };
    
    DropDownBase.prototype.setFloatingHeader = function (e) {
        if (isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = this.createElement('div', { className: dropDownBaseClasses.fixedHead });
            if (!this.list.querySelector('li').classList.contains(dropDownBaseClasses.group)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        if (!isNullOrUndefined(this.fixedHeaderElement) && this.fixedHeaderElement.style.zIndex === '0') {
            this.setFixedHeader();
        }
        this.scrollStop(e);
    };
    DropDownBase.prototype.scrollStop = function (e) {
        var target = e.target;
        var liHeight = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        var topIndex = Math.round(target.scrollTop / liHeight);
        var liCollections = this.list.querySelectorAll('li');
        for (var i = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
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
    /**
     * To render the list items
     */
    DropDownBase.prototype.renderItems = function (listData, fields) {
        var ulElement;
        if (this.itemTemplate && listData) {
            var dataSource = listData;
            if (dataSource && fields.groupBy) {
                if (this.sortOrder !== 'None') {
                    dataSource = this.getSortedDataSource(dataSource);
                }
                dataSource = ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            else {
                dataSource = this.getSortedDataSource(dataSource);
            }
            this.sortedData = dataSource;
            var spliceData = (dataSource.length > 100) ?
                new DataManager(dataSource).executeLocal(new Query().take(100))
                : dataSource;
            ulElement = this.templateListItem((this.getModuleName() === 'autocomplete') ? spliceData : dataSource, fields);
            var isTempEmpty = (this.getModuleName() === 'listbox') ? true : false;
            this.DropDownBaseupdateBlazorTemplates(true, false, false, false, false, false, false, isTempEmpty);
        }
        else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    };
    
    DropDownBase.prototype.templateListItem = function (dataSource, fields) {
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        var option = this.listOption(dataSource, fields);
        option.templateID = this.itemTemplateId;
        option.isStringTemplate = this.isStringTemplate;
        return ListBase.renderContentTemplate(this.createElement, this.itemTemplate, dataSource, fields.properties, option);
    };
    DropDownBase.prototype.typeOfData = function (items) {
        var item = { typeof: null, item: null };
        for (var i = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                var listDataType = typeof (items[i]) === 'string' ||
                    typeof (items[i]) === 'number' || typeof (items[i]) === 'boolean';
                var isNullData = listDataType ? isNullOrUndefined(items[i]) :
                    isNullOrUndefined(getValue((this.fields.value ? this.fields.value : 'value'), items[i]));
                if (!isNullData) {
                    return item = { typeof: typeof items[i], item: items[i] };
                }
            }
        }
        return item;
    };
    DropDownBase.prototype.setFixedHeader = function () {
        this.list.parentElement.style.display = 'block';
        var borderWidth = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10);
        }
        var liWidth = this.liCollections[0].offsetWidth - borderWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        var firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    };
    DropDownBase.prototype.getSortedDataSource = function (dataSource) {
        if (dataSource && this.sortOrder !== 'None') {
            var textField = this.fields.text ? this.fields.text : 'text';
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    };
    /**
     * Return the index of item which matched with given value in data source
     */
    DropDownBase.prototype.getIndexByValue = function (value) {
        var index;
        var listItems = this.getItems();
        for (var i = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    };
    
    /**
     * To dispatch the event manually
     */
    DropDownBase.prototype.dispatchEvent = function (element, type) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    };
    /**
     * To set the current fields
     */
    DropDownBase.prototype.setFields = function () {
        if (this.fields.value && !this.fields.text) {
            this.fields.text = this.fields.value;
        }
        else if (!this.fields.value && this.fields.text) {
            this.fields.value = this.fields.text;
        }
        else if (!this.fields.value && !this.fields.text) {
            this.fields.value = this.fields.text = 'text';
        }
    };
    /**
     * reset the items list.
     */
    DropDownBase.prototype.resetList = function (dataSource, fields, query) {
        if (this.list) {
            if ((this.element.tagName === 'SELECT' && this.element.options.length > 0)
                || (this.element.tagName === 'UL' && this.element.childNodes.length > 0)) {
                var data = dataSource instanceof Array ? (dataSource.length > 0)
                    : !isNullOrUndefined(dataSource);
                if (!data && this.selectData && this.selectData.length > 0) {
                    dataSource = this.selectData;
                }
            }
            this.setListData(dataSource, fields, query);
        }
    };
    DropDownBase.prototype.updateSelectElementData = function (isFiltering) {
        if (isFiltering && isNullOrUndefined(this.selectData) && this.listData && this.listData.length > 0) {
            this.selectData = this.listData;
        }
    };
    DropDownBase.prototype.updateSelection = function () {
        // This is for after added the item, need to update the selected index values.
    };
    DropDownBase.prototype.renderList = function () {
        // This is for render the list items.
        this.render();
    };
    DropDownBase.prototype.updateDataSource = function (props) {
        this.resetList(this.dataSource);
    };
    DropDownBase.prototype.setUpdateInitial = function (props, newProp) {
        this.isDataFetched = false;
        var updateData = {};
        for (var j = 0; props.length > j; j++) {
            if (newProp[props[j]] && props[j] === 'fields') {
                this.setFields();
            }
            else if (newProp[props[j]]) {
                updateData[props[j]] = newProp[props[j]];
            }
        }
        if (Object.keys(updateData).length > 0) {
            if (Object.keys(updateData).indexOf('dataSource') === -1) {
                updateData.dataSource = this.dataSource;
            }
            this.updateDataSource(updateData);
        }
    };
    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     * @private
     */
    DropDownBase.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'dropdownbase') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        this.setUpdateInitial(['sortOrder', 'itemTemplate'], newProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'query':
                case 'sortOrder':
                case 'dataSource':
                case 'itemTemplate':
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'groupTemplate':
                    this.renderGroupTemplate(this.list);
                    if (this.ulElement && this.fixedHeaderElement) {
                        var firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
                        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
                    }
                    break;
                case 'locale':
                    if (this.list && (!isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) {
                        this.l10nUpdate();
                    }
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
            }
        }
    };
    
    /**
     * Build and render the component
     * @private
     */
    DropDownBase.prototype.render = function (isEmptyData) {
        this.list = this.createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        var rippleModel = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        var group = this.element.querySelector('select>optgroup');
        if ((this.fields.groupBy || !isNullOrUndefined(group)) && !this.isGroupChecking) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            var wrapperElement = this.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    };
    
    /**
     * Return the module name of this component.
     * @private
     */
    DropDownBase.prototype.getModuleName = function () {
        return 'dropdownbase';
    };
    
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    DropDownBase.prototype.getItems = function () {
        return this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    };
    
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @deprecated
     */
    DropDownBase.prototype.addItem = function (items, itemIndex) {
        if (!this.list || (this.list.textContent === this.noRecordsTemplate && this.getModuleName() !== 'listbox')) {
            this.renderList();
        }
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        var itemsCount = this.getItems().length;
        var selectedItemValue = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]);
        var index;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        var fields = this.fields;
        if (items && fields.groupBy) {
            items = ListBase.groupDataSource(items, fields.properties);
        }
        var liCollections = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isHeader = item.isHeader;
            var li = this.createElement('li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });
            var itemText = item instanceof Object ? getValue(fields.text, item) : item;
            if (isHeader) {
                li.innerText = itemText;
            }
            if (this.itemTemplate && !isHeader) {
                var compiledString = compile(this.itemTemplate);
                append(compiledString(item, null, null, this.itemTemplateId, this.isStringTemplate), li);
                this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
            }
            else if (!isHeader) {
                li.appendChild(document.createTextNode(itemText));
            }
            li.setAttribute('data-value', item instanceof Object ? getValue(fields.value, item) : item);
            li.setAttribute('role', 'option');
            this.notify('addItem', { module: 'CheckBoxSelection', item: li });
            liCollections.push(li);
            this.listData.push(item);
            this.updateActionCompleteData(li, item);
            //Listbox event
            this.trigger('beforeItemRender', { element: li, item: item });
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.classList.remove(dropDownBaseClasses.noData);
            this.list.appendChild(this.ulElement);
            this.liCollections = liCollections;
            append(liCollections, this.ulElement);
            this.updateAddItemList(this.list, itemsCount);
        }
        else {
            if (this.getModuleName() === 'listbox' && itemsCount === 0) {
                this.ulElement.innerHTML = '';
            }
            var attr = [];
            for (var i = 0; i < items.length; i++) {
                var listGroupItem = this.ulElement.querySelectorAll('.e-list-group-item');
                for (var j = 0; j < listGroupItem.length; j++) {
                    attr[j] = listGroupItem[j].innerText;
                }
                if (attr.indexOf(liCollections[i].innerText) > -1 && fields.groupBy) {
                    for (var j = 0; j < listGroupItem.length; j++) {
                        if (attr[j] === liCollections[i].innerText) {
                            this.ulElement.insertBefore(liCollections[i + 1], listGroupItem[j + 1]);
                            i = i + 1;
                            break;
                        }
                    }
                }
                else {
                    if (this.liCollections[index]) {
                        this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                    }
                    else {
                        this.ulElement.appendChild(liCollections[i]);
                    }
                }
                var tempLi = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
                if (this.getModuleName() === 'multiselect') {
                    this.updateDataList();
                }
            }
        }
        if (selectedItemValue || itemIndex === 0) {
            this.updateSelection();
        }
    };
    DropDownBase.prototype.validationAttribute = function (target, hidden) {
        var name = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        hidden.setAttribute('name', name);
        target.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            if (!target.getAttribute(attributes$$1[i])) {
                continue;
            }
            var attr = target.getAttribute(attributes$$1[i]);
            hidden.setAttribute(attributes$$1[i], attr);
            target.removeAttribute(attributes$$1[i]);
        }
    };
    DropDownBase.prototype.setZIndex = function () {
        // this is for component wise
    };
    DropDownBase.prototype.updateActionCompleteData = function (li, item) {
        // this is for ComboBox custom value
    };
    DropDownBase.prototype.updateAddItemList = function (list, itemCount) {
        // this is for multiselect add item
    };
    DropDownBase.prototype.updateDataList = function () {
        // this is for multiselect update list items
    };
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     */
    DropDownBase.prototype.getDataByValue = function (value) {
        if (!isNullOrUndefined(this.listData)) {
            var type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!isNullOrUndefined(item) && item === value) {
                        return item;
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.listData; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownBase.prototype.destroy = function () {
        if (document.body.contains(this.list)) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            detach(this.list);
        }
        _super.prototype.destroy.call(this);
    };
    
    __decorate([
        Complex({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], DropDownBase.prototype, "fields", void 0);
    __decorate([
        Property(false)
    ], DropDownBase.prototype, "enablePersistence", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "itemTemplate", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "groupTemplate", void 0);
    __decorate([
        Property('No Records Found')
    ], DropDownBase.prototype, "noRecordsTemplate", void 0);
    __decorate([
        Property('The Request Failed')
    ], DropDownBase.prototype, "actionFailureTemplate", void 0);
    __decorate([
        Property('None')
    ], DropDownBase.prototype, "sortOrder", void 0);
    __decorate([
        Property(true)
    ], DropDownBase.prototype, "enabled", void 0);
    __decorate([
        Property([])
    ], DropDownBase.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], DropDownBase.prototype, "query", void 0);
    __decorate([
        Property('StartsWith')
    ], DropDownBase.prototype, "filterType", void 0);
    __decorate([
        Property(true)
    ], DropDownBase.prototype, "ignoreCase", void 0);
    __decorate([
        Property(1000)
    ], DropDownBase.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], DropDownBase.prototype, "ignoreAccent", void 0);
    __decorate([
        Property()
    ], DropDownBase.prototype, "locale", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "select", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "dataBound", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "created", void 0);
    __decorate([
        Event()
    ], DropDownBase.prototype, "destroyed", void 0);
    DropDownBase = __decorate([
        NotifyPropertyChanges
    ], DropDownBase);
    return DropDownBase;
}(Component));

/**
 * export all modules from current location
 */

var __extends$1 = (undefined && undefined.__extends) || (function () {
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
// don't use space in classnames 
var dropDownListClasses = {
    root: 'e-dropdownlist',
    hover: dropDownBaseClasses.hover,
    selected: dropDownBaseClasses.selected,
    rtl: dropDownBaseClasses.rtl,
    li: dropDownBaseClasses.li,
    disable: dropDownBaseClasses.disabled,
    base: dropDownBaseClasses.root,
    focus: dropDownBaseClasses.focus,
    input: 'e-input-group',
    inputFocus: 'e-input-focus',
    icon: 'e-input-group-icon e-ddl-icon',
    iconAnimation: 'e-icon-anim',
    value: 'e-input-value',
    device: 'e-ddl-device',
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    mobileFilter: 'e-ddl-device-filter',
    footer: 'e-ddl-footer',
    header: 'e-ddl-header',
    clearIcon: 'e-clear-icon',
    clearIconHide: 'e-clear-icon-hide',
    popupFullScreen: 'e-popup-full-page',
    disableIcon: 'e-ddl-disable-icon',
    hiddenElement: 'e-ddl-hidden'
};
var inputObject = {
    container: null,
    buttons: []
};
/**
 * The DropDownList component contains a list of predefined values from which you can
 * choose a single value.
 * ```html
 * <input type="text" tabindex="1" id="list"> </input>
 * ```
 * ```typescript
 *   let dropDownListObj:DropDownList = new DropDownList();
 *   dropDownListObj.appendTo("#list");
 * ```
 */
var DropDownList = /** @__PURE__ @class */ (function (_super) {
    __extends$1(DropDownList, _super);
    /**
     * * Constructor for creating the DropDownList component.
     */
    function DropDownList(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousValue = null;
        return _this;
    }
    
    /**
     * Initialize the event handler.
     * @private
     */
    DropDownList.prototype.preRender = function () {
        var checkBlazor = isBlazor() && this.isServerRendered;
        this.isServerBlazor = (checkBlazor) ? true : false;
        if (this.isServerBlazor) {
            this.initializeData();
        }
        else {
            this.element.style.opacity = '0';
            this.initializeData();
            _super.prototype.preRender.call(this);
        }
        this.activeIndex = this.index;
        this.queryString = '';
    };
    DropDownList.prototype.initializeData = function () {
        this.isPopupOpen = false;
        this.isDocumentClick = false;
        this.isInteracted = false;
        this.isFilterFocus = false;
        this.beforePopupOpen = false;
        this.initial = true;
        this.initRemoteRender = false;
        this.isNotSearchList = false;
        this.isTyped = false;
        this.isSelected = false;
        this.preventFocus = false;
        this.preventAutoFill = false;
        this.isValidKey = false;
        this.typedString = '';
        this.isEscapeKey = false;
        this.isPreventBlur = false;
        this.isTabKey = false;
        this.actionCompleteData = { isUpdated: false };
        this.prevSelectPoints = {};
        this.isSelectCustom = false;
        this.isDropDownClick = false;
        this.preventAltUp = false;
        this.isCustomFilter = false;
        this.isSecondClick = false;
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
    };
    DropDownList.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    };
    DropDownList.prototype.renderList = function (isEmptyData) {
        if (!this.isServerBlazor) {
            _super.prototype.render.call(this, isEmptyData);
            this.wireListEvents();
        }
        else {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, false);
        }
    };
    DropDownList.prototype.floatLabelChange = function () {
        if (this.getModuleName() === 'dropdownlist' && this.floatLabelType === 'Auto') {
            var floatElement = this.inputWrapper.container.querySelector('.e-float-text');
            if (this.inputElement.value !== '' || this.isInteracted) {
                classList(floatElement, ['e-label-top'], ['e-label-bottom']);
            }
            else {
                classList(floatElement, ['e-label-bottom'], ['e-label-top']);
            }
        }
    };
    DropDownList.prototype.resetHandler = function (e) {
        e.preventDefault();
        this.clearAll(e);
    };
    DropDownList.prototype.resetFocusElement = function () {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete' && !isNullOrUndefined(this.ulElement)) {
            var li = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if (li) {
                li.classList.add(dropDownListClasses.focus);
            }
        }
    };
    DropDownList.prototype.clearAll = function (e, properties) {
        if (isNullOrUndefined(properties) || (!isNullOrUndefined(properties) &&
            (isNullOrUndefined(properties.dataSource) ||
                (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
            this.isActive = true;
            this.resetSelection(properties);
        }
        var dataItem = this.getItemData();
        if (this.previousValue === dataItem.value) {
            return;
        }
        this.onChangeEvent(e);
    };
    DropDownList.prototype.resetSelection = function (properties) {
        if (this.list) {
            if ((!isNullOrUndefined(properties) &&
                (isNullOrUndefined(properties.dataSource) ||
                    (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
                this.selectedLI = null;
                this.actionCompleteData.isUpdated = false;
                this.actionCompleteData.ulElement = null;
                this.actionCompleteData.list = null;
                this.resetList(properties.dataSource);
            }
            else {
                if (this.allowFiltering && this.getModuleName() !== 'autocomplete'
                    && !isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list)) {
                    var actionList = this.actionCompleteData.ulElement.querySelector('li');
                    var ulElement = this.ulElement && this.ulElement.querySelector('li');
                    if (this.element.tagName === 'EJS-COMBOBOX' && actionList && ulElement &&
                        actionList.childElementCount > 0 && ulElement.childElementCount > 0 &&
                        actionList.textContent !== ulElement.textContent && this.itemTemplate) {
                        this.cloneElements();
                    }
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true), this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
        }
        if (!this.isServerBlazor) {
            this.hiddenElement.innerHTML = '';
        }
        this.inputElement.value = '';
        this.value = null;
        this.itemData = null;
        this.text = null;
        this.index = null;
        this.activeIndex = null;
        this.item = null;
        this.queryString = '';
        if (this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
            this.valueTempElement = null;
        }
        this.setSelection(null, null);
        this.isSelectCustom = false;
        this.updateIconState();
        this.cloneElements();
    };
    DropDownList.prototype.setHTMLAttributes = function () {
        if (Object.keys(this.htmlAttributes).length) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var htmlAttr = _a[_i];
                if (htmlAttr === 'class') {
                    var updatedClassValue = (this.htmlAttributes[htmlAttr].replace(/\s+/g, ' ')).trim();
                    if (updatedClassValue !== '') {
                        addClass([this.inputWrapper.container], updatedClassValue.split(' '));
                    }
                }
                else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.enabled = false;
                    this.setEnable();
                }
                else if (htmlAttr === 'readonly' && !isNullOrUndefined(this.htmlAttributes[htmlAttr])) {
                    this.readonly = true;
                    this.dataBind();
                }
                else if (htmlAttr === 'style') {
                    this.inputWrapper.container.setAttribute('style', this.htmlAttributes[htmlAttr]);
                }
                else {
                    var defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    var validateAttr = ['name', 'required'];
                    if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
                        defaultAttr.push('tabindex');
                    }
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputElement) :
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else {
                        this.inputWrapper.container.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
        if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
            this.inputWrapper.container.removeAttribute('tabindex');
        }
    };
    DropDownList.prototype.getAriaAttributes = function () {
        return {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-live': 'polite',
            'aria-labelledby': this.hiddenElement.id
        };
    };
    DropDownList.prototype.setEnableRtl = function () {
        Input.setEnableRtl(this.enableRtl, [this.inputElement.parentElement]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    };
    DropDownList.prototype.setEnable = function () {
        Input.setEnabled(this.enabled, this.inputElement);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.targetElement().setAttribute('tabindex', this.tabIndex);
        }
        else {
            this.hidePopup();
            addClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.targetElement().tabIndex = -1;
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    DropDownList.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    
    DropDownList.prototype.getLocaleName = function () {
        return 'drop-down-list';
    };
    
    DropDownList.prototype.preventTabIndex = function (element) {
        if (this.getModuleName() === 'dropdownlist') {
            element.tabIndex = -1;
        }
    };
    DropDownList.prototype.targetElement = function () {
        return this.inputWrapper.container;
    };
    DropDownList.prototype.getNgDirective = function () {
        return 'EJS-DROPDOWNLIST';
    };
    DropDownList.prototype.getElementByText = function (text) {
        return this.getElementByValue(this.getValueByText(text));
    };
    DropDownList.prototype.getElementByValue = function (value) {
        var item;
        var listItems = this.getItems();
        for (var _i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
            var liItem = listItems_1[_i];
            if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                item = liItem;
                break;
            }
        }
        return item;
    };
    
    DropDownList.prototype.initValue = function () {
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        }
        else {
            this.updateValues();
        }
    };
    DropDownList.prototype.updateValues = function () {
        if (!isNullOrUndefined(this.value)) {
            this.setSelection(this.getElementByValue(this.value), null);
        }
        else if (this.text && isNullOrUndefined(this.value)) {
            var element = this.getElementByText(this.text);
            if (isNullOrUndefined(element)) {
                this.setProperties({ text: null });
                return;
            }
            else {
                this.setSelection(element, null);
            }
        }
        else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    DropDownList.prototype.onBlur = function (e) {
        if (!this.enabled) {
            return;
        }
        var target = e.relatedTarget;
        var currentTarget = e.target;
        var isPreventBlur = this.isPreventBlur;
        this.isPreventBlur = false;
        //IE 11 - issue
        if (isPreventBlur && !this.isDocumentClick && this.isPopupOpen && (!isNullOrUndefined(currentTarget) ||
            !this.isFilterLayout() && isNullOrUndefined(target))) {
            if (this.getModuleName() === 'dropdownlist' && this.allowFiltering && this.isPopupOpen) {
                this.filterInput.focus();
            }
            else {
                this.targetElement().focus();
            }
            return;
        }
        if (this.isDocumentClick || (!isNullOrUndefined(this.popupObj)
            && document.body.contains(this.popupObj.element) &&
            this.popupObj.element.classList.contains(dropDownListClasses.mobileFilter))) {
            if (!this.beforePopupOpen) {
                this.isDocumentClick = false;
            }
            return;
        }
        if (((this.getModuleName() === 'dropdownlist' && !this.isFilterFocus && target !== this.inputElement)
            && (document.activeElement !== target || (document.activeElement === target &&
                currentTarget.classList.contains(dropDownListClasses.inputFocus)))) ||
            (isNullOrUndefined(target) && this.getModuleName() === 'dropdownlist' && this.allowFiltering &&
                currentTarget !== this.inputWrapper.container) || this.getModuleName() !== 'dropdownlist' &&
            !this.inputWrapper.container.contains(target) || this.isTabKey) {
            this.isDocumentClick = this.isPopupOpen ? true : false;
            this.focusOutAction(e);
            this.isTabKey = false;
        }
        if (this.isRequested && !this.isPopupOpen && !this.isPreventBlur) {
            this.isActive = false;
            this.beforePopupOpen = false;
        }
    };
    DropDownList.prototype.focusOutAction = function (e) {
        this.isInteracted = false;
        this.focusOut(e);
        this.onFocusOut();
    };
    DropDownList.prototype.onFocusOut = function () {
        if (!this.enabled) {
            return;
        }
        if (this.isSelected) {
            this.isSelectCustom = false;
            this.onChangeEvent(null);
        }
        this.floatLabelChange();
        this.dispatchEvent(this.hiddenElement, 'change');
        if (this.getModuleName() === 'dropdownlist' && this.element.tagName !== 'INPUT') {
            this.dispatchEvent(this.inputElement, 'blur');
        }
        if (this.inputWrapper.clearButton) {
            addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
        }
        this.trigger('blur');
    };
    DropDownList.prototype.onFocus = function (e) {
        if (!this.isInteracted) {
            this.isInteracted = true;
            var args = { isInteracted: e ? true : false, event: e };
            this.trigger('focus', args);
        }
        this.updateIconState();
    };
    DropDownList.prototype.resetValueHandler = function (e) {
        var formElement = closest(this.inputElement, 'form');
        if (formElement && e.target === formElement) {
            var val = (this.element.tagName === this.getNgDirective()) ? null : this.inputElement.getAttribute('value');
            this.text = val;
        }
    };
    DropDownList.prototype.wireEvent = function () {
        EventHandler.add(this.inputWrapper.container, 'mousedown', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper.container, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper.container, 'keypress', this.onSearch, this);
        this.bindCommonEvent();
    };
    DropDownList.prototype.bindCommonEvent = function () {
        EventHandler.add(this.targetElement(), 'blur', this.onBlur, this);
        var formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        if (!Browser.isDevice) {
            this.keyboardModule = new KeyboardEvents(this.targetElement(), {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        else {
            this.keyboardModule = new KeyboardEvents(this.targetElement(), {
                keyAction: this.mobileKeyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        this.bindClearEvent();
    };
    DropDownList.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    };
    DropDownList.prototype.unBindCommonEvent = function () {
        EventHandler.remove(this.targetElement(), 'blur', this.onBlur);
        var formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
        if (this.showClearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown', this.resetHandler);
        }
    };
    DropDownList.prototype.updateIconState = function () {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
            else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    };
    /**
     * Event binding for list
     */
    DropDownList.prototype.wireListEvents = function () {
        EventHandler.add(this.list, 'click', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    
    DropDownList.prototype.onSearch = function (e) {
        if (e.charCode !== 32 && e.charCode !== 13) {
            if (this.list === undefined) {
                if (!this.isServerBlazor) {
                    this.renderList();
                }
                else {
                    this.isServerIncrementalSearch = true;
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
                }
            }
            this.searchKeyEvent = e;
            this.onServerIncrementalSearch(e);
        }
    };
    DropDownList.prototype.onServerIncrementalSearch = function (e) {
        if (!this.isRequested && !isNullOrUndefined(this.list) &&
            !isNullOrUndefined(this.list.querySelector('li')) && this.enabled && !this.readonly) {
            this.incrementalSearch(e);
        }
    };
    DropDownList.prototype.onMouseClick = function (e) {
        var target = e.target;
        var classList$$1 = target.classList;
        var li = closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        if (Browser.isDevice && this.isFilterLayout()) {
            history.back();
        }
        else {
            var delay = 100;
            this.closePopup(delay);
        }
    };
    DropDownList.prototype.onMouseOver = function (e) {
        var currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    };
    
    DropDownList.prototype.setHover = function (li) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    };
    
    DropDownList.prototype.onMouseLeave = function (e) {
        this.removeHover();
    };
    
    DropDownList.prototype.removeHover = function () {
        if (this.list) {
            var hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.hover);
            }
        }
    };
    
    DropDownList.prototype.isValidLI = function (li) {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    };
    
    DropDownList.prototype.incrementalSearch = function (e) {
        if (this.liCollections.length > 0) {
            var li = incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true, this.isServerBlazor);
            if (!isNullOrUndefined(li)) {
                this.setSelection(li, e);
                this.setScrollPosition();
            }
        }
    };
    
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    DropDownList.prototype.hideSpinner = function () {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            this.spinnerElement.innerHTML = '';
            this.spinnerElement = null;
        }
    };
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    DropDownList.prototype.showSpinner = function () {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = Browser.isDevice && !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[1] ||
                !isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[0] || this.inputWrapper.buttons[0];
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            createSpinner({
                target: this.spinnerElement,
                width: Browser.isDevice ? '16px' : '14px'
            }, this.createElement);
            showSpinner(this.spinnerElement);
        }
    };
    DropDownList.prototype.keyActionHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        var preventAction = e.action === 'pageUp' || e.action === 'pageDown';
        var preventHomeEnd = this.getModuleName() !== 'dropdownlist' && (e.action === 'home' || e.action === 'end');
        this.isEscapeKey = e.action === 'escape';
        this.isTabKey = !this.isPopupOpen && e.action === 'tab';
        var isNavAction = e.action === 'down' || e.action === 'up' || e.action === 'home' || e.action === 'end';
        var isNavigation = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        if ((this.isEditTextBox() || preventAction || preventHomeEnd) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            var isTabAction = e.action === 'tab' || e.action === 'close';
            if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape') {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (!(this.isServerBlazor && e.action === 'open') && isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                isNavigation && this.liCollections.length === 0) || this.isRequested) {
                if (!(this.isServerBlazor && isNavAction)) {
                    return;
                }
            }
            if ((isTabAction && this.getModuleName() !== 'autocomplete') && this.isPopupOpen
                || e.action === 'escape') {
                e.preventDefault();
            }
            this.isSelected = e.action === 'escape' ? false : this.isSelected;
            this.isTyped = (isNavigation || e.action === 'escape') ? false : this.isTyped;
            switch (e.action) {
                case 'down':
                case 'up':
                    this.updateUpDownAction(e);
                    break;
                case 'pageUp':
                    this.pageUpSelection(this.activeIndex - this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.pageDownSelection(this.activeIndex + this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'home':
                    this.updateHomeEndAction(e);
                    break;
                case 'end':
                    this.updateHomeEndAction(e);
                    break;
                case 'space':
                    if (this.getModuleName() === 'dropdownlist') {
                        if (!this.beforePopupOpen) {
                            this.showPopup();
                        }
                    }
                    break;
                case 'open':
                    this.showPopup();
                    break;
                case 'hide':
                    this.preventAltUp = this.isPopupOpen;
                    this.hidePopup(e);
                    this.focusDropDown(e);
                    break;
                case 'enter':
                    this.selectCurrentItem(e);
                    break;
                case 'tab':
                    this.selectCurrentValueOnTab(e);
                    break;
                case 'escape':
                case 'close':
                    if (this.isPopupOpen) {
                        this.hidePopup(e);
                        this.focusDropDown(e);
                    }
                    break;
            }
        }
    };
    DropDownList.prototype.updateUpDownAction = function (e) {
        if (this.isServerBlazor && isNullOrUndefined(this.list)) {
            this.isServerNavigation = true;
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
        }
        else {
            this.isServerNavigation = false;
            var focusEle = this.list.querySelector('.' + dropDownListClasses.focus);
            if (this.isSelectFocusItem(focusEle)) {
                this.setSelection(focusEle, e);
            }
            else {
                var nextItem = void 0;
                var index = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
                var startIndex = 0;
                if (this.getModuleName() === 'autocomplete') {
                    startIndex = e.action === 'down' && isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
                    index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
                }
                nextItem = isNullOrUndefined(this.activeIndex) ? this.liCollections[startIndex] : this.liCollections[index];
                if (!isNullOrUndefined(nextItem)) {
                    this.setSelection(nextItem, e);
                }
            }
            e.preventDefault();
        }
    };
    DropDownList.prototype.updateHomeEndAction = function (e) {
        if (this.getModuleName() === 'dropdownlist') {
            if (this.isServerBlazor && isNullOrUndefined(this.list)) {
                this.isServerNavigation = true;
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
            }
            else {
                this.isServerNavigation = false;
                var findLi = 0;
                if (e.action === 'home') {
                    findLi = 0;
                }
                else {
                    findLi = this.getItems().length - 1;
                }
                e.preventDefault();
                if (this.activeIndex === findLi) {
                    return;
                }
                this.setSelection(this.liCollections[findLi], e);
            }
        }
    };
    DropDownList.prototype.selectCurrentValueOnTab = function (e) {
        if (this.getModuleName() === 'autocomplete') {
            this.selectCurrentItem(e);
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup(e);
                this.focusDropDown(e);
            }
        }
    };
    DropDownList.prototype.mobileKeyActionHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        if ((this.isEditTextBox()) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            if (this.list === undefined && !this.isRequested) {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if (e.action === 'enter') {
                this.selectCurrentItem(e);
            }
        }
    };
    DropDownList.prototype.selectCurrentItem = function (e) {
        if (this.isPopupOpen) {
            var li = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
            this.hidePopup();
            this.focusDropDown(e);
        }
        else {
            this.showPopup();
        }
    };
    DropDownList.prototype.isSelectFocusItem = function (element) {
        return !isNullOrUndefined(element);
    };
    DropDownList.prototype.getPageCount = function () {
        var liHeight = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
    };
    DropDownList.prototype.pageUpSelection = function (steps, event) {
        var previousItem = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        this.setSelection(previousItem, event);
    };
    
    DropDownList.prototype.pageDownSelection = function (steps, event) {
        var list = this.getItems();
        var previousItem = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        this.setSelection(previousItem, event);
    };
    
    DropDownList.prototype.unWireEvent = function () {
        EventHandler.remove(this.inputWrapper.container, 'mousedown', this.dropDownClick);
        EventHandler.remove(this.inputWrapper.container, 'keypress', this.onSearch);
        EventHandler.remove(this.inputWrapper.container, 'focus', this.focusIn);
        this.unBindCommonEvent();
    };
    /**
     * Event un binding for list items.
     */
    DropDownList.prototype.unWireListEvents = function () {
        EventHandler.remove(this.list, 'click', this.onMouseClick);
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };
    
    DropDownList.prototype.checkSelector = function (id) {
        return '#' + id.replace(/(:|\.|\[|\]|,|=|@|\\|\/|#)/g, '\\$1');
    };
    DropDownList.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, this.checkSelector(this.popupObj.element.id))) &&
            !this.inputWrapper.container.contains(e.target)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                var isActive = this.isRequested;
                this.isInteracted = false;
                this.hidePopup(e);
                if (!isActive) {
                    this.onFocusOut();
                    this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
                }
            }
        }
        else if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput)
            && !(this.getModuleName() === 'combobox' &&
                !this.allowFiltering && Browser.isDevice && target === this.inputWrapper.buttons[0])) {
            this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.targetElement() ||
                document.activeElement === this.filterInput);
            e.preventDefault();
        }
    };
    DropDownList.prototype.activeStateChange = function () {
        if (this.isDocumentClick) {
            this.hidePopup();
            this.onFocusOut();
            this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
        }
    };
    DropDownList.prototype.focusDropDown = function (e) {
        if (!this.initial && this.isFilterLayout()) {
            this.focusIn(e);
        }
    };
    DropDownList.prototype.dropDownClick = function (e) {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable) || this.inputWrapper.clearButton === e.target) {
            return;
        }
        var target = e.target;
        if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput) && this.getModuleName() !== 'combobox') {
            e.preventDefault();
        }
        if (!this.readonly) {
            if (this.isPopupOpen) {
                this.hidePopup();
                if (this.isFilterLayout()) {
                    this.focusDropDown(e);
                }
            }
            else {
                this.focusIn(e);
                this.floatLabelChange();
                this.queryString = this.inputElement.value.trim() === '' ? null : this.inputElement.value;
                this.isDropDownClick = true;
                this.showPopup();
            }
            var proxy_1 = this;
            var duration = (isBlazor()) ? 1000 : 100;
            if (!this.isSecondClick) {
                setTimeout(function () { proxy_1.cloneElements(); proxy_1.isSecondClick = true; }, duration);
            }
        }
        else {
            this.focusIn(e);
        }
    };
    DropDownList.prototype.cloneElements = function () {
        if (this.list) {
            var ulElement = this.list.querySelector('ul');
            if (ulElement) {
                ulElement = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                this.actionCompleteData.ulElement = ulElement;
            }
        }
    };
    DropDownList.prototype.updateSelectedItem = function (li, e, preventSelect, isSelection) {
        var _this = this;
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        var value = this.getFormattedValue(li.getAttribute('data-value'));
        var selectedData = this.getDataByValue(value);
        if (!this.initial && !preventSelect && !isNullOrUndefined(e)) {
            var items = this.detachChanges(selectedData);
            this.isSelected = true;
            var eventArgs = {
                e: e,
                item: li,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    li.classList.remove(dropDownBaseClasses.selected);
                }
                else {
                    _this.selectEventCallback(li, e, preventSelect, selectedData, value);
                    if (_this.isServerBlazor) {
                        // tslint:disable-next-line
                        _this.interopAdaptor.invokeMethodAsync('OnServerItemData', _this.itemData);
                    }
                    if (isSelection) {
                        _this.setSelectOptions(li, e);
                    }
                }
            });
        }
        else {
            this.selectEventCallback(li, e, preventSelect, selectedData, value);
            if (this.isServerBlazor) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerItemData', this.itemData);
            }
            if (isSelection) {
                this.setSelectOptions(li, e);
            }
        }
    };
    DropDownList.prototype.selectEventCallback = function (li, e, preventSelect, selectedData, value) {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li;
        this.itemData = selectedData;
        var focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    };
    DropDownList.prototype.activeItem = function (li) {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.removeSelection();
            li.classList.add(dropDownBaseClasses.selected);
            this.removeHover();
            li.setAttribute('aria-selected', 'true');
        }
    };
    DropDownList.prototype.setValue = function (e) {
        var dataItem = this.getItemData();
        if (dataItem.value === null) {
            if (isBlazor() && dataItem.text !== null || dataItem.text !== '') {
                Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            else {
                Input.setValue(null, this.inputElement, this.floatLabelType, this.showClearButton);
            }
        }
        else {
            Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (this.isServerBlazor) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerValueTemplate', dataItem);
        }
        if (this.valueTemplate && this.itemData !== null && !this.isServerBlazor) {
            this.DropDownBaseresetBlazorTemplates(false, false, false, false, true);
            this.setValueTemplate();
        }
        else if (this.inputElement.previousSibling === this.valueTempElement) {
            detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
        }
        if (this.previousValue === dataItem.value) {
            this.isSelected = false;
            return true;
        }
        else {
            this.isSelected = !this.initial ? true : false;
            this.isSelectCustom = false;
            if (this.getModuleName() === 'dropdownlist') {
                this.updateIconState();
            }
            return false;
        }
    };
    DropDownList.prototype.setSelection = function (li, e) {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.updateSelectedItem(li, e, false, true);
        }
        else {
            this.setSelectOptions(li, e);
        }
    };
    DropDownList.prototype.setSelectOptions = function (li, e) {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li;
        if (this.setValue(e)) {
            return;
        }
        if (this.isPopupOpen) {
            attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            if (this.isFilterLayout() && this.filterInput) {
                attributes(this.filterInput, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            }
        }
        if ((!this.isPopupOpen && !isNullOrUndefined(li)) || (this.isPopupOpen && !isNullOrUndefined(e) &&
            (e.type !== 'keydown' || e.type === 'keydown' && e.action === 'enter'))) {
            this.isSelectCustom = false;
            this.onChangeEvent(e);
        }
        if (this.isPopupOpen && !isNullOrUndefined(this.selectedLI) && this.itemData !== null && (!e || e.type !== 'click')) {
            this.setScrollPosition(e);
        }
        if (Browser.info.name !== 'mozilla') {
            attributes(this.inputElement, { 'aria-label': this.inputElement.value });
            attributes(this.targetElement(), { 'aria-describedby': this.inputElement.id });
            this.targetElement().removeAttribute('aria-live');
        }
    };
    DropDownList.prototype.setValueTemplate = function () {
        var compiledString;
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        this.valueTempElement.innerHTML = '';
        var templateData = (isBlazor()) ? JSON.parse(JSON.stringify(this.itemData)) : this.itemData;
        compiledString = compile(this.valueTemplate);
        for (var _i = 0, _a = compiledString(templateData, null, null, this.valueTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.valueTempElement.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, true, true);
    };
    DropDownList.prototype.removeSelection = function () {
        if (this.list) {
            var selectedItems = this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
            if (selectedItems.length) {
                removeClass(selectedItems, dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    };
    
    DropDownList.prototype.getItemData = function () {
        var fields = this.fields;
        var dataItem = null;
        dataItem = this.itemData;
        var dataValue;
        var dataText;
        if (!isNullOrUndefined(dataItem)) {
            dataValue = getValue(fields.value, dataItem);
            dataText = getValue(fields.text, dataItem);
        }
        var value = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataValue : dataItem);
        var text = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    };
    /**
     * To trigger the change event for list.
     */
    DropDownList.prototype.onChangeEvent = function (eve) {
        var dataItem = this.getItemData();
        var index = this.isSelectCustom ? null : this.activeIndex;
        this.setProperties({ 'index': index, 'text': dataItem.text, 'value': dataItem.value }, true);
        this.detachChangeEvent(eve);
    };
    
    DropDownList.prototype.detachChanges = function (value) {
        var items;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        }
        else {
            items = value;
        }
        return items;
    };
    DropDownList.prototype.detachChangeEvent = function (eve) {
        this.isSelected = false;
        this.previousValue = this.value;
        this.activeIndex = this.index;
        this.typedString = !isNullOrUndefined(this.text) ? this.text : '';
        if (!this.initial) {
            var items = this.detachChanges(this.itemData);
            var preItems = void 0;
            if (typeof this.previousItemData === 'string' ||
                typeof this.previousItemData === 'boolean' ||
                typeof this.previousItemData === 'number') {
                preItems = Object.defineProperties({}, {
                    value: {
                        value: this.previousItemData,
                        enumerable: true
                    },
                    text: {
                        value: this.previousItemData,
                        enumerable: true
                    }
                });
            }
            else {
                preItems = this.previousItemData;
            }
            this.setHiddenValue();
            var eventArgs = {
                e: eve,
                item: this.item,
                itemData: items,
                previousItem: this.previousSelectedLI,
                previousItemData: preItems,
                isInteracted: eve ? true : false,
                value: this.value,
                element: this.element
            };
            this.trigger('change', eventArgs);
        }
        if ((isNullOrUndefined(this.value) || this.value === '') && this.floatLabelType !== 'Always') {
            removeClass([this.inputWrapper.container], 'e-valid-input');
        }
    };
    DropDownList.prototype.setHiddenValue = function () {
        if (!isNullOrUndefined(this.value)) {
            if (this.isServerBlazor && this.hiddenElement.querySelector('option')) {
                var selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.textContent = this.text;
                selectedElement.setAttribute('value', this.value.toString());
            }
            else if (!this.isServerBlazor) {
                this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
                var selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.setAttribute('value', this.value.toString());
            }
        }
        else if (!this.isServerBlazor) {
            this.hiddenElement.innerHTML = '';
        }
    };
    /**
     * Filter bar implementation
     */
    DropDownList.prototype.onFilterUp = function (e) {
        if (!(e.ctrlKey && e.keyCode === 86) && (this.isValidKey || e.keyCode === 40 || e.keyCode === 38)) {
            this.isValidKey = false;
            switch (e.keyCode) {
                case 38: //up arrow 
                case 40: //down arrow 
                    if (this.getModuleName() === 'autocomplete' && !this.isPopupOpen && !this.preventAltUp && !this.isRequested) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else {
                        this.preventAutoFill = false;
                    }
                    this.preventAltUp = false;
                    e.preventDefault();
                    break;
                case 46: //delete
                case 8: //backspace
                    this.typedString = this.filterInput.value;
                    if (!this.isPopupOpen && this.typedString !== '' || this.isPopupOpen && this.queryString.length > 0) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else if (this.typedString === '' && this.queryString === '' && this.getModuleName() !== 'autocomplete') {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else if (this.typedString === '') {
                        if (this.list) {
                            this.resetFocusElement();
                        }
                        this.activeIndex = null;
                        if (this.getModuleName() === 'autocomplete') {
                            this.hidePopup();
                        }
                    }
                    e.preventDefault();
                    break;
                default:
                    this.typedString = this.filterInput.value;
                    this.preventAutoFill = false;
                    this.searchLists(e);
                    break;
            }
        }
        else {
            this.isValidKey = false;
        }
    };
    DropDownList.prototype.onFilterDown = function (e) {
        switch (e.keyCode) {
            case 13: //enter
                break;
            case 40: //down arrow
            case 38: //up arrow 
                this.queryString = this.filterInput.value;
                e.preventDefault();
                break;
            case 9: //tab 
                if (this.isPopupOpen && this.getModuleName() !== 'autocomplete') {
                    e.preventDefault();
                }
                break;
            default:
                this.prevSelectPoints = this.getSelectionPoints();
                this.queryString = this.filterInput.value;
                break;
        }
    };
    DropDownList.prototype.removeFillSelection = function () {
        if (this.isInteracted) {
            var selection = this.getSelectionPoints();
            this.inputElement.setSelectionRange(selection.end, selection.end);
        }
    };
    DropDownList.prototype.getQuery = function (query) {
        var filterQuery;
        if (!this.isCustomFilter && this.allowFiltering && this.filterInput) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
            var filterType = this.typedString === '' ? 'contains' : this.filterType;
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    };
    DropDownList.prototype.getSelectionPoints = function () {
        var input = this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    };
    DropDownList.prototype.searchLists = function (e) {
        var _this = this;
        this.isTyped = true;
        this.activeIndex = null;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            var clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
        this.isDataFetched = false;
        if (this.isFiltering()) {
            if (this.isServerBlazor) {
                this.beforePopupOpen = (this.getModuleName() === 'combobox' && this.isFiltering() && !this.beforePopupOpen)
                    ? !this.beforePopupOpen : this.beforePopupOpen;
                if (this.filterInput.value === '' && this.getModuleName() !== 'dropdownlist') {
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, false);
                }
                else {
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerFilter', this.filterInput.value);
                }
            }
            else {
                var eventArgs_1 = {
                    preventDefaultAction: false,
                    text: this.filterInput.value,
                    updateData: function (dataSource, query, fields) {
                        if (eventArgs_1.cancel) {
                            return;
                        }
                        _this.isCustomFilter = true;
                        _this.filteringAction(dataSource, query, fields);
                    },
                    baseEventArgs: e,
                    cancel: false
                };
                this.trigger('filtering', eventArgs_1, function (eventArgs) {
                    if (!eventArgs.cancel && !_this.isCustomFilter && !eventArgs.preventDefaultAction) {
                        _this.filteringAction(_this.dataSource, null, _this.fields);
                    }
                });
            }
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
    DropDownList.prototype.filter = function (dataSource, query, fields) {
        this.isCustomFilter = true;
        this.filteringAction(dataSource, query, fields);
    };
    DropDownList.prototype.filteringAction = function (dataSource, query, fields) {
        if (!isNullOrUndefined(this.filterInput)) {
            this.beforePopupOpen = true;
            if (this.filterInput.value.trim() === '' && !this.itemTemplate) {
                this.actionCompleteData.isUpdated = false;
                this.isTyped = false;
                if (!isNullOrUndefined(this.actionCompleteData.ulElement) && !isNullOrUndefined(this.actionCompleteData.list)) {
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list);
                }
                this.isTyped = true;
                if (!isNullOrUndefined(this.itemData) && this.getModuleName() === 'dropdownlist') {
                    this.focusIndexItem();
                    this.setScrollPosition();
                }
                this.isNotSearchList = true;
            }
            else {
                this.isNotSearchList = false;
                query = (this.filterInput.value.trim() === '') ? null : query;
                this.resetList(dataSource, fields, query);
            }
        }
    };
    DropDownList.prototype.setSearchBox = function (popupElement) {
        if (this.isFiltering()) {
            var parentElement = popupElement.querySelector('.' + dropDownListClasses.filterParent) ?
                popupElement.querySelector('.' + dropDownListClasses.filterParent) : this.createElement('span', {
                className: dropDownListClasses.filterParent
            });
            if (this.isServerBlazor) {
                parentElement.innerHTML = '';
            }
            this.filterInput = this.createElement('input', {
                attrs: { type: 'text' },
                className: dropDownListClasses.filterInput
            });
            this.element.parentNode.insertBefore(this.filterInput, this.element);
            var backIcon = false;
            if (Browser.isDevice) {
                backIcon = true;
            }
            this.filterInputObj = Input.createInput({
                element: this.filterInput,
                buttons: backIcon ?
                    [dropDownListClasses.backIcon, dropDownListClasses.filterBarClearIcon] : [dropDownListClasses.filterBarClearIcon],
                properties: { placeholder: this.filterBarPlaceholder }
            }, this.createElement);
            append([this.filterInputObj.container], parentElement);
            prepend([parentElement], popupElement);
            attributes(this.filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            if (!Browser.isDevice && this.clearIconElement) {
                EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                this.clearIconElement.style.visibility = 'hidden';
            }
            if (!Browser.isDevice) {
                this.searchKeyModule = new KeyboardEvents(this.filterInput, {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            else {
                this.searchKeyModule = new KeyboardEvents(this.filterInput, {
                    keyAction: this.mobileKeyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            EventHandler.add(this.filterInput, 'input', this.onInput, this);
            EventHandler.add(this.filterInput, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.filterInput, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            EventHandler.add(this.filterInput, 'paste', this.pasteHandler, this);
            return this.filterInputObj;
        }
        else {
            return inputObject;
        }
    };
    
    DropDownList.prototype.onInput = function (e) {
        this.isValidKey = true;
        // For filtering works in mobile firefox.
        if (Browser.isDevice && Browser.info.name === 'mozilla') {
            this.typedString = this.filterInput.value;
            this.preventAutoFill = true;
            this.searchLists(e);
        }
    };
    DropDownList.prototype.pasteHandler = function (e) {
        var _this = this;
        setTimeout(function () {
            _this.typedString = _this.filterInput.value;
            _this.searchLists(e);
        });
    };
    DropDownList.prototype.onActionFailure = function (e) {
        _super.prototype.onActionFailure.call(this, e);
        if (this.beforePopupOpen) {
            this.renderPopup();
        }
    };
    DropDownList.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        var _this = this;
        if (this.isNotSearchList) {
            this.isNotSearchList = false;
            return;
        }
        if (this.isActive) {
            var selectedItem = this.selectedLI ? this.selectedLI.cloneNode(true) : null;
            _super.prototype.onActionComplete.call(this, ulElement, list, e);
            this.updateSelectElementData(this.allowFiltering);
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent) && this.searchKeyEvent.type === 'keydown') {
                this.isRequested = false;
                this.keyActionHandler(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            if (this.isRequested && !isNullOrUndefined(this.searchKeyEvent)) {
                this.incrementalSearch(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            this.list.scrollTop = 0;
            if (!isNullOrUndefined(ulElement)) {
                attributes(ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            if (this.initRemoteRender) {
                this.initial = true;
                this.activeIndex = this.index;
                this.updateValues();
                this.initRemoteRender = false;
                this.initial = false;
                if (this.value && this.dataSource instanceof DataManager) {
                    var checkField_1 = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                    var checkVal = list.some(function (x) { return x[checkField_1] === _this.value; });
                    if (!checkVal) {
                        this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField_1, 'equal', this.value)))
                            .then(function (e) {
                            if (e.result.length > 0) {
                                _this.addItem(e.result, list.length);
                                _this.updateValues();
                            }
                        });
                    }
                }
            }
            if (this.getModuleName() !== 'autocomplete' && this.isFiltering() && !this.isTyped) {
                if (!this.actionCompleteData.isUpdated || ((!this.isCustomFilter
                    && !this.isFilterFocus)
                    && ((this.dataSource instanceof DataManager)
                        || (!isNullOrUndefined(this.dataSource) && !isNullOrUndefined(this.dataSource.length) &&
                            this.dataSource.length !== 0)))) {
                    this.actionCompleteData = { ulElement: ulElement.cloneNode(true), list: list, isUpdated: true };
                }
                this.addNewItem(list, selectedItem);
                if (!isNullOrUndefined(this.itemData)) {
                    this.focusIndexItem();
                }
            }
            if (this.beforePopupOpen) {
                this.renderPopup();
            }
        }
    };
    DropDownList.prototype.addNewItem = function (listData, newElement) {
        var _this = this;
        if (!isNullOrUndefined(this.itemData) && !isNullOrUndefined(newElement)) {
            var value_1 = this.getItemData().value;
            var isExist = listData.some(function (data) {
                return (((typeof data === 'string' || typeof data === 'number') && data === value_1) ||
                    (getValue(_this.fields.value, data) === value_1));
            });
            if (!isExist) {
                this.addItem(this.itemData);
            }
        }
    };
    DropDownList.prototype.updateActionCompleteData = function (li, item) {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
            if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) < 0) {
                this.actionCompleteData.list.push(item);
            }
        }
    };
    DropDownList.prototype.focusIndexItem = function () {
        var value = this.getItemData().value;
        this.activeIndex = this.getIndexByValue(value);
        var element = this.findListElement(this.list, 'li', 'data-value', value);
        this.selectedLI = element;
        this.activeItem(element);
        this.removeFocus();
    };
    DropDownList.prototype.updateSelection = function () {
        var selectedItem = this.list.querySelector('.' + dropDownBaseClasses.selected);
        if (selectedItem) {
            this.setProperties({ 'index': this.getIndexByValue(selectedItem.getAttribute('data-value')) });
            this.activeIndex = this.index;
        }
        else {
            this.removeFocus();
            this.list.querySelector('.' + dropDownBaseClasses.li).classList.add(dropDownListClasses.focus);
        }
    };
    DropDownList.prototype.removeFocus = function () {
        var highlightedItem = this.list.querySelectorAll('.' + dropDownListClasses.focus);
        if (highlightedItem && highlightedItem.length) {
            removeClass(highlightedItem, dropDownListClasses.focus);
        }
    };
    
    DropDownList.prototype.renderPopup = function () {
        var _this = this;
        if (this.popupObj && document.body.contains(this.popupObj.element)) {
            this.refreshPopup();
            return;
        }
        var args = { cancel: false };
        this.trigger('beforeOpen', args, function (args) {
            if (!args.cancel) {
                var popupEle = (_this.serverPopupEle) ? _this.serverPopupEle : _this.createElement('div', {
                    id: _this.element.id + '_popup', className: 'e-ddl e-popup ' + (_this.cssClass != null ? _this.cssClass : '')
                });
                var searchBox = _this.setSearchBox(popupEle);
                _this.listHeight = formatUnit(_this.popupHeight);
                if (_this.headerTemplate && !_this.isServerBlazor) {
                    _this.setHeaderTemplate(popupEle);
                }
                append([_this.list], popupEle);
                if (_this.footerTemplate && !_this.isServerBlazor) {
                    _this.setFooterTemplate(popupEle);
                }
                if (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer')) {
                    popupEle.appendChild(popupEle.querySelector('.e-ddl-footer'));
                }
                document.body.appendChild(popupEle);
                _this.updateServerPopup(popupEle);
                popupEle.style.visibility = 'hidden';
                if (_this.popupHeight !== 'auto') {
                    _this.searchBoxHeight = 0;
                    if (!isNullOrUndefined(searchBox.container)) {
                        _this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (_this.searchBoxHeight)).toString() + 'px';
                    }
                    if (_this.headerTemplate || (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-header'))) {
                        _this.header = _this.header ? _this.header : popupEle.querySelector('.e-ddl-header');
                        var height = Math.round(_this.header.getBoundingClientRect().height);
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (height + _this.searchBoxHeight)).toString() + 'px';
                    }
                    if (_this.footerTemplate || (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer'))) {
                        _this.footer = _this.footer ? _this.footer : popupEle.querySelector('.e-ddl-footer');
                        var height = Math.round(_this.footer.getBoundingClientRect().height);
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (height + _this.searchBoxHeight)).toString() + 'px';
                    }
                    _this.list.style.maxHeight = (parseInt(_this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
                    popupEle.style.maxHeight = formatUnit(_this.popupHeight);
                }
                else {
                    popupEle.style.height = 'auto';
                }
                var offsetValue = 0;
                var left = void 0;
                if (!isNullOrUndefined(_this.selectedLI) && (!isNullOrUndefined(_this.activeIndex) && _this.activeIndex >= 0)) {
                    _this.setScrollPosition();
                }
                else {
                    _this.list.scrollTop = 0;
                }
                if (Browser.isDevice && (!_this.allowFiltering && (_this.getModuleName() === 'dropdownlist' ||
                    (_this.isDropDownClick && _this.getModuleName() === 'combobox')))) {
                    offsetValue = _this.getOffsetValue(popupEle);
                    var firstItem = _this.isEmptyList() ? _this.list : _this.liCollections[0];
                    left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                        parseInt(getComputedStyle(_this.inputElement).paddingLeft, 10) +
                        parseInt(getComputedStyle(_this.inputElement.parentElement).borderLeftWidth, 10));
                }
                _this.getFocusElement();
                _this.createPopup(popupEle, offsetValue, left);
                _this.checkCollision(popupEle);
                if (Browser.isDevice) {
                    _this.popupObj.element.classList.add(dropDownListClasses.device);
                    if (_this.getModuleName() === 'dropdownlist' || (_this.getModuleName() === 'combobox'
                        && !_this.allowFiltering && _this.isDropDownClick)) {
                        _this.popupObj.collision = { X: 'fit', Y: 'fit' };
                    }
                    if (_this.isFilterLayout()) {
                        _this.popupObj.element.classList.add(dropDownListClasses.mobileFilter);
                        _this.popupObj.position = { X: 0, Y: 0 };
                        _this.popupObj.dataBind();
                        attributes(_this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                        addClass([document.body, _this.popupObj.element], dropDownListClasses.popupFullScreen);
                        _this.setSearchBoxPosition();
                        _this.backIconElement = searchBox.container.querySelector('.e-back-icon');
                        _this.clearIconElement = searchBox.container.querySelector('.' + dropDownListClasses.clearIcon);
                        EventHandler.add(_this.backIconElement, 'click', _this.clickOnBackIcon, _this);
                        EventHandler.add(_this.clearIconElement, 'click', _this.clearText, _this);
                    }
                }
                popupEle.style.visibility = 'visible';
                addClass([popupEle], 'e-popup-close');
                var scrollParentElements = _this.popupObj.getScrollableParent(_this.inputWrapper.container);
                for (var _i = 0, scrollParentElements_1 = scrollParentElements; _i < scrollParentElements_1.length; _i++) {
                    var element = scrollParentElements_1[_i];
                    EventHandler.add(element, 'scroll', _this.scrollHandler, _this);
                }
                if (Browser.isDevice && _this.isFilterLayout()) {
                    EventHandler.add(_this.list, 'scroll', _this.listScroll, _this);
                }
                attributes(_this.targetElement(), { 'aria-expanded': 'true' });
                var inputParent = _this.isFiltering() ? _this.filterInput.parentElement : _this.inputWrapper.container;
                addClass([inputParent], [dropDownListClasses.inputFocus]);
                var animModel = { name: 'FadeIn', duration: 100 };
                _this.beforePopupOpen = true;
                var popupInstance = (isBlazor() && _this.isServerRendered) ? null : _this.popupObj;
                var eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
                _this.trigger('open', eventArgs, function (eventArgs) {
                    if (!eventArgs.cancel) {
                        _this.serverBlazorUpdateSelection();
                        _this.bindServerScrollEvent();
                        addClass([_this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
                        _this.popupObj.show(new Animation(eventArgs.animation), (_this.zIndex === 1000) ? _this.element : null);
                    }
                    else {
                        _this.beforePopupOpen = false;
                        _this.destroyPopup();
                    }
                });
            }
            else {
                _this.beforePopupOpen = false;
            }
        });
    };
    DropDownList.prototype.checkCollision = function (popupEle) {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            var collision = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
        }
    };
    DropDownList.prototype.serverBlazorUpdateSelection = function () {
        if (this.isServerBlazor && (this.value !== null || this.index !== null || this.text !== null) ||
            (this.getModuleName() !== 'dropdownlist' && !this.isTyped)) {
            if (this.getModuleName() === 'dropdownlist') {
                this.removeSelection();
                this.removeFocus();
                this.removeHover();
                this.updateValues();
            }
            if (this.getModuleName() === 'combobox' && this.ulElement &&
                this.findListElement(this.ulElement, 'li', 'data-value', this.value) && !this.isTyped) {
                this.updateValues();
            }
            if (this.isServerBlazor && this.getModuleName() !== 'dropdownlist' &&
                (this.text === '' || this.text === null) && this.ulElement) {
                if (!this.ulElement.querySelector('li').classList.contains(dropDownBaseClasses.hover)) {
                    addClass([this.ulElement.querySelector('li')], dropDownBaseClasses.hover);
                }
            }
        }
    };
    DropDownList.prototype.bindServerScrollEvent = function () {
        if (this.isServerBlazor && this.list) {
            if ((this.fields.groupBy) && !this.isGroupChecking) {
                EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
            }
        }
    };
    DropDownList.prototype.updateServerPopup = function (popupEle) {
        if (this.isServerBlazor) {
            if (popupEle && popupEle.querySelector('li')) {
                removeClass([this.list], ['e-nodata']);
            }
            this.initial = false;
            popupEle.removeAttribute('style');
        }
    };
    DropDownList.prototype.getOffsetValue = function (popupEle) {
        var popupStyles = getComputedStyle(popupEle);
        var borderTop = parseInt(popupStyles.borderTopWidth, 10);
        var borderBottom = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    };
    DropDownList.prototype.createPopup = function (element, offsetValue, left) {
        var _this = this;
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputWrapper.container, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.zIndex,
            close: function () {
                if (!_this.isDocumentClick) {
                    _this.focusDropDown();
                }
                var isResetItem = (_this.getModuleName() === 'autocomplete') ? true : false;
                _this.DropDownBaseresetBlazorTemplates(isResetItem, isResetItem, true, true, false, true, true);
                _this.isNotSearchList = false;
                _this.isDocumentClick = false;
                _this.destroyPopup();
                var formElement = closest(_this.inputElement, 'form');
                if (_this.isFiltering() && formElement && _this.actionCompleteData.list && _this.actionCompleteData.list[0]) {
                    _this.isActive = true;
                    _this.onActionComplete(_this.actionCompleteData.ulElement, _this.actionCompleteData.list, null, true);
                }
            },
            open: function () {
                EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                _this.isPopupOpen = true;
                var actionList = _this.actionCompleteData && _this.actionCompleteData.ulElement &&
                    _this.actionCompleteData.ulElement.querySelector('li');
                var ulElement = _this.list.querySelector('ul li');
                if (_this.isFiltering() && _this.itemTemplate && (_this.element.tagName === _this.getNgDirective()) &&
                    (actionList && ulElement && actionList.textContent !== ulElement.textContent)) {
                    _this.cloneElements();
                }
                if (_this.isFilterLayout()) {
                    removeClass([_this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    _this.isFilterFocus = true;
                    _this.filterInput.focus();
                    if (_this.inputWrapper.clearButton) {
                        addClass([_this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                _this.activeStateChange();
            },
            targetExitViewport: function () {
                if (!Browser.isDevice) {
                    _this.hidePopup();
                }
            }
        });
    };
    DropDownList.prototype.isEmptyList = function () {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    };
    DropDownList.prototype.getFocusElement = function () {
        // combo-box used this method
    };
    DropDownList.prototype.isFilterLayout = function () {
        return this.getModuleName() === 'dropdownlist' && this.allowFiltering;
    };
    DropDownList.prototype.scrollHandler = function () {
        if (Browser.isDevice && ((this.getModuleName() === 'dropdownlist' &&
            !this.isFilterLayout()) || (this.getModuleName() === 'combobox' && !this.allowFiltering && this.isDropDownClick))) {
            this.hidePopup();
        }
    };
    DropDownList.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        var clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    };
    DropDownList.prototype.setPopupPosition = function (border) {
        var offsetValue;
        var popupOffset = border;
        var selectedLI = this.list.querySelector('.' + dropDownListClasses.focus) || this.selectedLI;
        var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
        var lastItem = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        var liHeight = firstItem.getBoundingClientRect().height;
        var listHeight = this.list.offsetHeight / 2;
        var height = isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        var lastItemOffsetValue = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !isNullOrUndefined(selectedLI)) {
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
        var inputHeight = this.inputWrapper.container.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    };
    DropDownList.prototype.setWidth = function () {
        var width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
            (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
            var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    };
    DropDownList.prototype.scrollBottom = function (isInitial) {
        if (!isNullOrUndefined(this.selectedLI)) {
            var currentOffset = this.list.offsetHeight;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            var boxRange = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    };
    DropDownList.prototype.scrollTop = function () {
        if (!isNullOrUndefined(this.selectedLI)) {
            var nextOffset = this.selectedLI.offsetTop - this.list.scrollTop;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            nextOffset = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            var boxRange = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop - (this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    };
    DropDownList.prototype.isEditTextBox = function () {
        return false;
    };
    DropDownList.prototype.isFiltering = function () {
        return this.allowFiltering;
    };
    DropDownList.prototype.isPopupButton = function () {
        return true;
    };
    DropDownList.prototype.setScrollPosition = function (e) {
        if (!isNullOrUndefined(e)) {
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
    DropDownList.prototype.clearText = function () {
        this.filterInput.value = '';
        this.searchLists(null);
    };
    DropDownList.prototype.listScroll = function () {
        this.filterInput.blur();
    };
    DropDownList.prototype.setEleWidth = function (width) {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputWrapper.container.style.width = formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (width) : (formatUnit(width));
            }
        }
    };
    DropDownList.prototype.closePopup = function (delay) {
        var _this = this;
        this.isTyped = false;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.isActive = false;
        this.filterInputObj = null;
        this.isDropDownClick = false;
        this.preventAutoFill = false;
        var scrollableParentElements = this.popupObj.getScrollableParent(this.inputWrapper.container);
        for (var _i = 0, scrollableParentElements_1 = scrollableParentElements; _i < scrollableParentElements_1.length; _i++) {
            var element = scrollableParentElements_1[_i];
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (Browser.isDevice && this.isFilterLayout()) {
            removeClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
            EventHandler.remove(this.list, 'scroll', this.listScroll);
        }
        if (this.isFilterLayout()) {
            if (!Browser.isDevice) {
                this.searchKeyModule.destroy();
                if (this.clearIconElement) {
                    EventHandler.remove(this.clearIconElement, 'click', this.clearText);
                }
            }
            if (this.backIconElement) {
                EventHandler.remove(this.backIconElement, 'click', this.clickOnBackIcon);
                EventHandler.remove(this.clearIconElement, 'click', this.clearText);
            }
            EventHandler.remove(this.filterInput, 'input', this.onInput);
            EventHandler.remove(this.filterInput, 'keyup', this.onFilterUp);
            EventHandler.remove(this.filterInput, 'keydown', this.onFilterDown);
            EventHandler.remove(this.filterInput, 'blur', this.onBlur);
            EventHandler.remove(this.filterInput, 'paste', this.pasteHandler);
            this.filterInput = null;
        }
        attributes(this.targetElement(), { 'aria-expanded': 'false', 'aria-activedescendant': null });
        this.inputWrapper.container.classList.remove(dropDownListClasses.iconAnimation);
        if (this.isFiltering()) {
            this.actionCompleteData.isUpdated = false;
        }
        this.beforePopupOpen = false;
        var animModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        var popupInstance = (isBlazor() && this.isServerRendered) ? null : this.popupObj;
        var eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
        this.trigger('close', eventArgs, function (eventArgs) {
            if (!isNullOrUndefined(_this.popupObj) &&
                !isNullOrUndefined(_this.popupObj.element.querySelector('.e-fixed-head'))) {
                var fixedHeader = _this.popupObj.element.querySelector('.e-fixed-head');
                fixedHeader.parentNode.removeChild(fixedHeader);
                _this.fixedHeaderElement = null;
            }
            if (!eventArgs.cancel) {
                if (_this.getModuleName() === 'autocomplete' && !_this.isServerBlazor) {
                    _this.rippleFun();
                }
                if (_this.isPopupOpen) {
                    _this.popupObj.hide(new Animation(eventArgs.animation));
                }
                else {
                    _this.destroyPopup();
                }
            }
        });
    };
    DropDownList.prototype.destroyPopup = function () {
        var popupHolderEle = document.querySelector('#' + this.element.id + '_popup_holder');
        if (this.isServerBlazor && this.serverPopupEle && popupHolderEle) {
            popupHolderEle.appendChild(this.serverPopupEle);
        }
        if (this.isServerBlazor) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerClosePopup');
        }
        this.isPopupOpen = false;
        this.isFilterFocus = false;
        this.popupObj.destroy();
        detach(this.popupObj.element);
    };
    DropDownList.prototype.clickOnBackIcon = function () {
        this.hidePopup();
        this.focusIn();
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    // tslint:disable-next-line
    DropDownList.prototype.render = function () {
        if (this.isServerBlazor) {
            this.inputElement = this.element;
            this.inputWrapper = { container: this.element.parentElement };
            this.hiddenElement = this.inputWrapper.container.querySelector('select');
            this.inputWrapper.buttons = [this.inputWrapper.container.querySelector('.e-input-group-icon.e-ddl-icon')];
            if (this.showClearButton) {
                this.inputWrapper.clearButton = this.inputWrapper.container.querySelector('.e-clear-icon');
                Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
            if (this.floatLabelType === 'Auto') {
                Input.wireFloatingEvents(this.element);
            }
            Input.bindInitialEvent({
                element: this.element,
                buttons: null, customTag: null,
                floatLabelType: this.floatLabelType,
                properties: this.properties
            });
            this.setFields();
            this.wireEvent();
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            if (!this.enabled) {
                this.targetElement().tabIndex = -1;
            }
            if (this.element.hasAttribute('autofocus')) {
                this.focusIn();
            }
        }
        else {
            if (this.element.tagName === 'INPUT') {
                this.inputElement = this.element;
                if (isNullOrUndefined(this.inputElement.getAttribute('role'))) {
                    this.inputElement.setAttribute('role', 'textbox');
                }
                if (isNullOrUndefined(this.inputElement.getAttribute('type'))) {
                    this.inputElement.setAttribute('type', 'text');
                }
            }
            else {
                this.inputElement = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } });
                if (this.element.tagName !== this.getNgDirective()) {
                    this.element.style.display = 'none';
                }
                this.element.parentElement.insertBefore(this.inputElement, this.element);
                this.preventTabIndex(this.inputElement);
            }
            var updatedCssClassValues = this.cssClass;
            if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
                updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
            }
            this.inputWrapper = Input.createInput({
                element: this.inputElement,
                buttons: this.isPopupButton() ? [dropDownListClasses.icon] : null,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.getModuleName() === 'dropdownlist' ? true : this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValues,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
                },
            }, this.createElement);
            if (this.element.tagName === this.getNgDirective()) {
                this.element.appendChild(this.inputWrapper.container);
            }
            else {
                this.inputElement.parentElement.insertBefore(this.element, this.inputElement);
            }
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': dropDownListClasses.hiddenElement }
            });
            prepend([this.hiddenElement], this.inputWrapper.container);
            this.validationAttribute(this.element, this.hiddenElement);
            this.setFields();
            this.inputWrapper.container.style.width = formatUnit(this.width);
            this.inputWrapper.container.classList.add('e-ddl');
            this.wireEvent();
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.removeAttribute('tabindex');
            var id = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
            this.element.id = id;
            this.hiddenElement.id = id + '_hidden';
            this.targetElement().setAttribute('tabindex', this.tabIndex);
            attributes(this.targetElement(), this.getAriaAttributes());
            this.updateDataAttribute(this.htmlAttributes);
            this.setHTMLAttributes();
            if (this.value !== null || this.activeIndex !== null || this.text !== null) {
                this.initValue();
            }
            else if (this.element.tagName === 'SELECT' && this.element.options[0]) {
                var selectElement = this.element;
                this.value = selectElement.options[selectElement.selectedIndex].value;
                this.text = isNullOrUndefined(this.value) ? null : selectElement.options[selectElement.selectedIndex].textContent;
                this.initValue();
            }
            this.preventTabIndex(this.element);
            if (!this.enabled) {
                this.targetElement().tabIndex = -1;
            }
            this.initial = false;
            this.element.style.opacity = '';
            this.inputElement.onselect = function (e) { e.stopImmediatePropagation(); };
            this.inputElement.onchange = function (e) { e.stopImmediatePropagation(); };
            if (this.element.hasAttribute('autofocus')) {
                this.focusIn();
            }
            if (!isNullOrUndefined(this.text)) {
                this.inputElement.setAttribute('value', this.text);
            }
        }
        this.renderComplete();
    };
    
    DropDownList.prototype.setFooterTemplate = function (popupEle) {
        var compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            addClass([this.footer], dropDownListClasses.footer);
        }
        compiledString = compile(this.footerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.footer.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], popupEle);
    };
    DropDownList.prototype.setHeaderTemplate = function (popupEle) {
        var compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            addClass([this.header], dropDownListClasses.header);
        }
        compiledString = compile(this.headerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.header.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        var contentEle = popupEle.querySelector('div.e-content');
        popupEle.insertBefore(this.header, contentEle);
    };
    DropDownList.prototype.setOldText = function (text) {
        this.text = text;
    };
    DropDownList.prototype.setOldValue = function (value) {
        this.value = value;
    };
    DropDownList.prototype.refreshPopup = function () {
        if (!isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj.element) &&
            ((this.allowFiltering && !(Browser.isDevice && this.isFilterLayout())) || this.getModuleName() === 'autocomplete')) {
            removeClass([this.popupObj.element], 'e-popup-close');
            this.popupObj.refreshPosition(this.inputWrapper.container);
        }
    };
    DropDownList.prototype.checkDatasource = function (newProp) {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
        var isChangeValue = Object.keys(newProp).indexOf('value') !== -1 && isNullOrUndefined(newProp.value);
        var isChangeText = Object.keys(newProp).indexOf('text') !== -1 && isNullOrUndefined(newProp.text);
        if (this.getModuleName() !== 'autocomplete' && this.allowFiltering && (isChangeValue || isChangeText)) {
            this.itemData = null;
        }
    };
    DropDownList.prototype.updateDataSource = function (props) {
        if (this.inputElement.value !== '' || (!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.clearAll(null, props);
        }
        if (!(!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.resetList(this.dataSource);
        }
        if (!this.isCustomFilter && !this.isFilterFocus && document.activeElement !== this.filterInput) {
            this.checkCustomValue();
        }
    };
    DropDownList.prototype.checkCustomValue = function () {
        this.itemData = this.getDataByValue(this.value);
        var dataItem = this.getItemData();
        this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
    };
    DropDownList.prototype.updateInputFields = function () {
        if (this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    DropDownList.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'dropdownlist') {
            if (!this.isServerBlazor) {
                this.checkDatasource(newProp);
                this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
            }
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'query':
                case 'dataSource':
                    break;
                case 'htmlAttributes':
                    this.setHTMLAttributes();
                    break;
                case 'width':
                    this.setEleWidth(newProp.width);
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    break;
                case 'filterBarPlaceholder':
                    if (this.filterInput) {
                        Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput);
                    }
                    break;
                case 'readonly':
                    if (this.getModuleName() !== 'dropdownlist') {
                        Input.setReadonly(newProp.readonly, this.inputElement);
                    }
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'text':
                    if (newProp.text === null) {
                        this.clearAll();
                        break;
                    }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        var li = this.getElementByText(newProp.text);
                        if (!this.checkValidLi(li)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.text, oldProp.text, 'text');
                            }
                            else {
                                this.setOldText(oldProp.text);
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'value':
                    if (newProp.value === null) {
                        this.clearAll();
                        break;
                    }
                    this.notify('beforeValueChange', { newProp: newProp }); // gird component value type change
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        var item = this.getElementByValue(newProp.value);
                        if (!this.checkValidLi(item)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.value, oldProp.value, 'value');
                            }
                            else {
                                this.setOldValue(oldProp.value);
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'index':
                    if (newProp.index === null) {
                        this.clearAll();
                        break;
                    }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        var element = this.liCollections[newProp.index];
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.index, oldProp.index, 'index');
                            }
                            else {
                                this.index = oldProp.index;
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'footerTemplate':
                    if (this.popupObj) {
                        this.setFooterTemplate(this.popupObj.element);
                    }
                    break;
                case 'headerTemplate':
                    if (this.popupObj) {
                        this.setHeaderTemplate(this.popupObj.element);
                    }
                    break;
                case 'valueTemplate':
                    if (!isNullOrUndefined(this.itemData) && this.valueTemplate != null) {
                        this.setValueTemplate();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.actionCompleteData = { ulElement: this.ulElement,
                            list: this.listData, isUpdated: true };
                        this.updateSelectElementData(this.allowFiltering);
                    }
                    break;
                case 'floatLabelType':
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, newProp.floatLabelType, this.placeholder, this.createElement);
                    break;
                case 'showClearButton':
                    Input.setClearButton(newProp.showClearButton, this.inputElement, this.inputWrapper, null, this.createElement);
                    this.bindClearEvent();
                    break;
                default:
                    var ddlProps = void 0;
                    ddlProps = this.getPropObject(prop, newProp, oldProp);
                    _super.prototype.onPropertyChanged.call(this, ddlProps.newProperty, ddlProps.oldProperty);
                    break;
            }
        }
    };
    DropDownList.prototype.checkValidLi = function (element) {
        if (this.isValidLI(element)) {
            this.setSelection(element, null);
            return true;
        }
        return false;
    };
    DropDownList.prototype.setSelectionData = function (newProp, oldProp, prop) {
        var _this = this;
        var li;
        this.updateListValues = function () {
            if (prop === 'text') {
                li = _this.getElementByText(newProp);
                if (!_this.checkValidLi(li)) {
                    _this.setOldText(oldProp);
                }
            }
            else if (prop === 'value') {
                li = _this.getElementByValue(newProp);
                if (!_this.checkValidLi(li)) {
                    _this.setOldValue(oldProp);
                }
            }
            else if (prop === 'index') {
                li = _this.liCollections[newProp];
                if (!_this.checkValidLi(li)) {
                    _this.index = oldProp;
                }
            }
        };
    };
    DropDownList.prototype.setCssClass = function (newClass, oldClass) {
        if (!isNullOrUndefined(oldClass)) {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newClass)) {
            newClass = (newClass.replace(/\s+/g, ' ')).trim();
        }
        Input.setCssClass(newClass, [this.inputWrapper.container], oldClass);
        if (this.popupObj) {
            Input.setCssClass(newClass, [this.popupObj.element], oldClass);
        }
    };
    /**
     * Return the module name.
     * @private
     */
    DropDownList.prototype.getModuleName = function () {
        return 'dropdownlist';
    };
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     */
    DropDownList.prototype.showPopup = function () {
        if (!this.enabled) {
            return;
        }
        if (isBlazor() && this.itemTemplate) {
            this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        if (this.isFiltering() && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
            this.isActive = true;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        }
        else if (isNullOrUndefined(this.list) || !isUndefined(this.list) && this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderList();
        }
        else if (this.isFiltering() && this.isServerBlazor) {
            this.renderList();
        }
        if (!this.isServerBlazor) {
            this.invokeRenderPopup();
        }
        if (this.isServerBlazor && !isNullOrUndefined(this.list) && (this.getModuleName() === 'dropdownlist' || !this.isFiltering())) {
            this.invokeRenderPopup();
        }
    };
    DropDownList.prototype.invokeRenderPopup = function () {
        if (Browser.isDevice && this.isFilterLayout()) {
            var proxy_2 = this;
            window.onpopstate = function () {
                proxy_2.hidePopup();
            };
            history.pushState({}, '');
        }
        if (!isNullOrUndefined(this.list.children[0]) || this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderPopup();
        }
        attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
    };
    DropDownList.prototype.clientRenderPopup = function (data, popupEle) {
        if (popupEle) {
            this.serverPopupEle = popupEle;
            this.list = popupEle.querySelector('.e-dropdownbase.e-content') ?
                popupEle.querySelector('.e-dropdownbase.e-content') : this.list;
            this.ulElement = this.list.querySelector('ul');
            if (isNullOrUndefined(this.ulElement) && !this.list.classList.contains(dropDownBaseClasses.noData)) {
                addClass([this.list], [dropDownBaseClasses.noData]);
            }
            this.liCollections = this.ulElement ?
                this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li) : [];
            this.listData = data;
            if (this.getModuleName() === 'autocomplete' && this.liCollections.length > 0) {
                this.renderHightSearch();
            }
            this.initRemoteRender = false;
            this.serverBlazorUpdateSelection();
            this.wireListEvents();
            if (this.isServerIncrementalSearch && this.searchKeyEvent) {
                this.isServerIncrementalSearch = false;
                this.initial = false;
                this.onServerIncrementalSearch(this.searchKeyEvent);
            }
            if (this.isServerNavigation && this.searchKeyEvent) {
                if (this.searchKeyEvent.action === 'down' || this.searchKeyEvent.action === 'up') {
                    this.isServerNavigation = false;
                    this.updateUpDownAction(this.searchKeyEvent);
                }
                else if (this.searchKeyEvent.action === 'home' || this.searchKeyEvent.action === 'end') {
                    this.isServerNavigation = false;
                    this.updateHomeEndAction(this.searchKeyEvent);
                }
            }
            if (this.beforePopupOpen) {
                this.invokeRenderPopup();
            }
            if (this.getModuleName() !== 'dropdownlist') {
                this.onActionComplete(this.ulElement, this.listData);
            }
        }
        else if (data != null && this.listData !== data) {
            this.listData = data;
            this.initRemoteRender = false;
        }
    };
    DropDownList.prototype.renderHightSearch = function () {
        // update high light search 
    };
    DropDownList.prototype.updateclientItemData = function (data) {
        this.listData = data;
    };
    DropDownList.prototype.serverUpdateListElement = function (data, popupEle) {
        this.listData = data;
        if (this.ulElement) {
            this.liCollections = this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
        }
    };
    /**
     * Hides the popup if it is in an open state.
     * @returns void.
     */
    DropDownList.prototype.hidePopup = function (e) {
        var isHeader = (this.headerTemplate) ? true : false;
        var isFooter = (this.headerTemplate) ? true : false;
        this.DropDownBaseresetBlazorTemplates(false, false, false, false, false, isHeader, isFooter);
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.isEscapeKey = false;
            if (!isNullOrUndefined(this.index)) {
                var element = this.findListElement(this.ulElement, 'li', 'data-value', this.value);
                this.selectedLI = this.liCollections[this.index] || element;
                if (this.selectedLI) {
                    this.updateSelectedItem(this.selectedLI, null, true);
                    if (this.valueTemplate && this.itemData !== null) {
                        this.setValueTemplate();
                    }
                }
            }
            else {
                this.resetSelection();
            }
        }
        this.closePopup();
        var dataItem = this.getItemData();
        if (this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            !isNullOrUndefined(this.selectedLI) && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clearAll(e);
        }
    };
    /**
     * Sets the focus on the component for interaction.
     * @returns void.
     */
    DropDownList.prototype.focusIn = function (e) {
        if (!this.enabled) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable)) {
            return;
        }
        var isFocused = false;
        if (this.preventFocus && Browser.isDevice) {
            this.inputWrapper.container.tabIndex = 1;
            this.inputWrapper.container.focus();
            this.preventFocus = false;
            isFocused = true;
        }
        if (!isFocused) {
            this.targetElement().focus();
        }
        addClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
        this.onFocus(e);
    };
    /**
     * Moves the focus from the component if the component is already focused.
     * @returns void.
     */
    DropDownList.prototype.focusOut = function (e) {
        if (!this.enabled) {
            return;
        }
        this.isTyped = true;
        this.hidePopup(e);
        this.targetElement().blur();
        removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownList.prototype.destroy = function () {
        this.isActive = false;
        if (!this.isServerBlazor || (this.popupObj && document.body.contains(this.popupObj.element))) {
            this.hidePopup();
        }
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
            if (this.isServerBlazor) {
                if ((this.fields.groupBy) && !this.isGroupChecking) {
                    EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                }
            }
        }
        if (!this.isServerBlazor) {
            if (this.element && !this.element.classList.contains('e-' + this.getModuleName())) {
                return;
            }
            var attrArray = ['readonly', 'aria-disabled', 'aria-placeholder',
                'placeholder', 'aria-owns', 'aria-labelledby', 'aria-haspopup', 'aria-expanded',
                'aria-activedescendant', 'autocomplete', 'aria-readonly', 'autocorrect',
                'autocapitalize', 'spellcheck', 'aria-autocomplete', 'aria-live', 'aria-describedby', 'aria-label'];
            for (var i = 0; i < attrArray.length; i++) {
                this.inputElement.removeAttribute(attrArray[i]);
            }
            this.inputElement.setAttribute('tabindex', this.tabIndex);
            this.inputElement.classList.remove('e-input');
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            this.element.style.display = 'block';
            if (this.inputWrapper.container.parentElement.tagName === this.getNgDirective()) {
                detach(this.inputWrapper.container);
            }
            else {
                this.inputWrapper.container.parentElement.insertBefore(this.element, this.inputWrapper.container);
                detach(this.inputWrapper.container);
            }
            _super.prototype.destroy.call(this);
        }
    };
    
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    DropDownList.prototype.getItems = function () {
        if (!this.list) {
            if (this.dataSource instanceof DataManager) {
                this.initRemoteRender = true;
            }
            this.renderList();
        }
        return this.ulElement ? _super.prototype.getItems.call(this) : [];
    };
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     */
    DropDownList.prototype.getDataByValue = function (value) {
        return _super.prototype.getDataByValue.call(this, value);
    };
    /**
     * Allows you to clear the selected values from the component.
     * @returns void.
     */
    DropDownList.prototype.clear = function () {
        this.value = null;
    };
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "cssClass", void 0);
    __decorate$1([
        Property('100%')
    ], DropDownList.prototype, "width", void 0);
    __decorate$1([
        Property('300px')
    ], DropDownList.prototype, "popupHeight", void 0);
    __decorate$1([
        Property('100%')
    ], DropDownList.prototype, "popupWidth", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "placeholder", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "filterBarPlaceholder", void 0);
    __decorate$1([
        Property({})
    ], DropDownList.prototype, "htmlAttributes", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "query", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "valueTemplate", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "headerTemplate", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "footerTemplate", void 0);
    __decorate$1([
        Property(false)
    ], DropDownList.prototype, "allowFiltering", void 0);
    __decorate$1([
        Property(false)
    ], DropDownList.prototype, "readonly", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "text", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "value", void 0);
    __decorate$1([
        Property(null)
    ], DropDownList.prototype, "index", void 0);
    __decorate$1([
        Property('Never')
    ], DropDownList.prototype, "floatLabelType", void 0);
    __decorate$1([
        Property(false)
    ], DropDownList.prototype, "showClearButton", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "filtering", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "change", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "beforeOpen", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "open", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "close", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "blur", void 0);
    __decorate$1([
        Event()
    ], DropDownList.prototype, "focus", void 0);
    DropDownList = __decorate$1([
        NotifyPropertyChanges
    ], DropDownList);
    return DropDownList;
}(DropDownBase));

/**
 * export all modules from current location
 */

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RTL = 'e-rtl';
var DROPDOWNTREE = 'e-ddt';
var HIDDENELEMENT = 'e-ddt-hidden';
var DROPDOWNICON = 'e-input-group-icon e-ddt-icon e-icons';
var SHOW_CHIP = 'e-show-chip';
var SHOW_CLEAR = 'e-show-clear';
var SHOW_DD_ICON = 'e-show-dd-icon';
var CHIP_INPUT = 'e-chip-input';
var INPUTFOCUS = 'e-input-focus';
var INPUTGROUP = 'e-input-group';
var ICONANIMATION = 'e-icon-anim';
var CLOSEICON_CLASS = 'e-clear-icon e-icons';
var CHIP_WRAPPER = 'e-chips-wrapper';
var CHIP_COLLECTION = 'e-chips-collection';
var CHIP = 'e-chips';
var CHIP_CONTENT = 'e-chipcontent';
var CHIP_CLOSE = 'e-chips-close';
var HIDEICON = 'e-icon-hide';
var POPUP_CLASS = 'e-ddt e-popup';
var PARENTITEM = 'e-list-parent';
var CONTENT = 'e-popup-content';
var DROPDOWN = 'e-dropdown';
var DISABLED = 'e-disabled';
var ICONS = 'e-icons';
var CHECKALLPARENT = 'e-selectall-parent';
var CHECKALLHIDE = 'e-hide-selectall';
var BIGGER = 'e-bigger';
var SMALL = 'e-small';
var ALLTEXT = 'e-all-text';
var CHECKBOXFRAME = 'e-frame';
var CHECK = 'e-check';
var CHECKBOXWRAP = 'e-checkbox-wrapper';
var FILTERWRAP = 'e-filter-wrap';
var DDTICON = 'e-ddt-icon';
var FOOTER = 'e-ddt-footer';
var HEADER = 'e-ddt-header';
var NODATACONTAINER = 'e-ddt-nodata';
var NODATA = 'e-no-data';
var HEADERTEMPLATE = 'HeaderTemplate';
var FOOTERTEMPLATE = 'FooterTemplate';
var NORECORDSTEMPLATE = 'NoRecordsTemplate';
var ACTIONFAILURETEMPLATE = 'ActionFailureTemplate';
var Fields = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Fields, _super);
    function Fields() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property('child')
    ], Fields.prototype, "child", void 0);
    __decorate$2([
        Property([])
    ], Fields.prototype, "dataSource", void 0);
    __decorate$2([
        Property('expanded')
    ], Fields.prototype, "expanded", void 0);
    __decorate$2([
        Property('hasChildren')
    ], Fields.prototype, "hasChildren", void 0);
    __decorate$2([
        Property('htmlAttributes')
    ], Fields.prototype, "htmlAttributes", void 0);
    __decorate$2([
        Property('iconCss')
    ], Fields.prototype, "iconCss", void 0);
    __decorate$2([
        Property('imageUrl')
    ], Fields.prototype, "imageUrl", void 0);
    __decorate$2([
        Property('parentValue')
    ], Fields.prototype, "parentValue", void 0);
    __decorate$2([
        Property(null)
    ], Fields.prototype, "query", void 0);
    __decorate$2([
        Property('selected')
    ], Fields.prototype, "selected", void 0);
    __decorate$2([
        Property(null)
    ], Fields.prototype, "tableName", void 0);
    __decorate$2([
        Property('text')
    ], Fields.prototype, "text", void 0);
    __decorate$2([
        Property('tooltip')
    ], Fields.prototype, "tooltip", void 0);
    __decorate$2([
        Property('value')
    ], Fields.prototype, "value", void 0);
    return Fields;
}(ChildProperty));
var TreeSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(TreeSettings, _super);
    function TreeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(false)
    ], TreeSettings.prototype, "autoCheck", void 0);
    __decorate$2([
        Property('Auto')
    ], TreeSettings.prototype, "expandOn", void 0);
    __decorate$2([
        Property(false)
    ], TreeSettings.prototype, "loadOnDemand", void 0);
    return TreeSettings;
}(ChildProperty));
/**
 * The Dropdown Tree control allows you to select single or multiple values from hierarchical data in a tree-like structure.
 * It has several out-of-the-box features, such as data binding, check boxes, templates, filter,
 * UI customization, accessibility, and preselected values.
 * ```html
 *  <input type="text" id="tree"></input>
 * ```
 * ```typescript
 *  let ddtObj: DropDownTree = new DropDownTree();
 *  ddtObj.appendTo("#tree");
 * ```
 */
var DropDownTree = /** @__PURE__ @class */ (function (_super) {
    __extends$2(DropDownTree, _super);
    function DropDownTree(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.filterTimer = null;
        _this.isFilteredData = false;
        _this.isFilterRestore = false;
        _this.selectedData = [];
        _this.filterDelayTime = 300;
        return _this;
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    DropDownTree.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initialize the event handler.
     * @private
     */
    DropDownTree.prototype.preRender = function () {
        this.inputFocus = false;
        this.isPopupOpen = false;
        this.isFirstRender = true;
        this.isInitialized = false;
        this.currentText = null;
        this.currentValue = null;
        this.oldValue = null;
        this.removeValue = false;
        this.selectedText = [];
        this.treeItems = [];
        this.dataValue = null;
        this.isNodeSelected = false;
        this.isDynamicChange = false;
        this.isBlazorPlatForm = isBlazor();
        this.headerTemplateId = "" + this.element.id + HEADERTEMPLATE;
        this.footerTemplateId = "" + this.element.id + FOOTERTEMPLATE;
        this.actionFailureTemplateId = "" + this.element.id + ACTIONFAILURETEMPLATE;
        this.noRecordsTemplateId = "" + this.element.id + NORECORDSTEMPLATE;
        this.keyConfigs = {
            escape: 'escape',
            altUp: 'alt+uparrow',
            altDown: 'alt+downarrow',
            tab: 'tab',
            shiftTab: 'shift+tab',
            end: 'end',
            enter: 'enter',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
            ctrlA: 'ctrl+A'
        };
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    DropDownTree.prototype.render = function () {
        this.ensureAutoCheck();
        if (this.element.tagName === 'INPUT') {
            this.inputEle = this.element;
            if (isNullOrUndefined(this.inputEle.getAttribute('role'))) {
                this.inputEle.setAttribute('role', 'textbox');
            }
            if (isNullOrUndefined(this.inputEle.getAttribute('type'))) {
                this.inputEle.setAttribute('type', 'text');
            }
        }
        else {
            this.inputEle = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } });
            this.element.parentElement.insertBefore(this.inputEle, this.element);
        }
        this.inputObj = Input.createInput({
            element: this.inputEle,
            floatLabelType: this.floatLabelType,
            buttons: this.showDropDownIcon ? [DROPDOWNICON] : null,
            properties: {
                readonly: true,
                placeholder: this.placeholder,
                enabled: this.enabled,
                cssClass: this.cssClass,
                enableRtl: this.enableRtl,
            },
        }, this.createElement);
        this.inputWrapper = this.inputObj.container;
        if (!this.inputWrapper.classList.contains(INPUTGROUP)) {
            this.inputWrapper.classList.add(INPUTGROUP);
        }
        if (this.showDropDownIcon) {
            this.inputWrapper.classList.add(SHOW_DD_ICON);
        }
        if (this.element.tagName === this.getDirective()) {
            this.element.appendChild(this.inputWrapper);
        }
        this.createHiddenElement();
        this.createClearIcon();
        this.inputWrapper.classList.add(DROPDOWNTREE);
        this.setElementWidth(this.width);
        this.setAttributes();
        this.updateDataAttribute();
        this.setHTMLAttributes();
        this.popupDiv = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        this.popupDiv.classList.add(DROPDOWN);
        this.tree = this.createElement('div', { id: this.element.id + '_tree', });
        this.popupDiv.appendChild(this.tree);
        document.body.appendChild(this.popupDiv);
        this.wireTreeEvents();
        this.popupDiv.style.display = 'none';
        this.renderTree();
        this.isRemoteData = this.fields.dataSource instanceof DataManager;
        if (!this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            this.createChip();
        }
        this.wireEvents();
        this.oldValue = this.value;
        this.isInitialized = true;
        this.renderComplete();
    };
    DropDownTree.prototype.ensureAutoCheck = function () {
        if (this.allowFiltering && this.treeSettings.autoCheck) {
            this.setProperties({ treeSettings: { autoCheck: false } }, true);
        }
    };
    DropDownTree.prototype.hideCheckAll = function (flag) {
        var checkAllEle = !isNullOrUndefined(this.popupEle) ? this.popupEle.querySelector('.' + CHECKALLPARENT) : null;
        if (!isNullOrUndefined(checkAllEle)) {
            if (flag && !checkAllEle.classList.contains(CHECKALLHIDE)) {
                addClass([checkAllEle], CHECKALLHIDE);
            }
            else if (!flag && checkAllEle.classList.contains(CHECKALLHIDE)) {
                removeClass([checkAllEle], CHECKALLHIDE);
            }
        }
    };
    DropDownTree.prototype.renderFilter = function () {
        this.filterContainer = this.createElement('div', {
            id: this.element.id + '_filter_wrap',
            className: FILTERWRAP
        });
        var filterInput = this.createElement('input', {
            id: this.element.id + '_filter',
            attrs: { autocomplete: 'off', 'aria-label': this.filterBarPlaceholder }
        });
        this.filterContainer.appendChild(filterInput);
        prepend([this.filterContainer], this.popupEle);
        this.filterObj = new TextBox({
            value: '',
            showClearButton: true,
            placeholder: this.filterBarPlaceholder,
            input: this.filterChangeHandler.bind(this),
        });
        this.filterObj.appendTo('#' + this.element.id + '_filter');
    };
    DropDownTree.prototype.filterChangeHandler = function (args) {
        var _this = this;
        if (!isNullOrUndefined(args.value)) {
            window.clearTimeout(this.filterTimer);
            this.filterTimer = window.setTimeout(function () { _this.filterHandler(args.value, args.event); }, this.filterDelayTime);
        }
    };
    DropDownTree.prototype.filterHandler = function (value, event) {
        var _this = this;
        if (!this.isFilteredData) {
            this.treeData = this.treeObj.getTreeData();
        }
        var filterFields = this.cloneFields(this.fields);
        var args = {
            cancel: false,
            preventDefaultAction: false,
            event: event,
            text: value,
            fields: filterFields
        };
        this.trigger('filtering', args, function (args) {
            if (!args.cancel) {
                var flag = false;
                var fields = void 0;
                _this.isFilteredData = true;
                if (value === '') {
                    _this.isFilteredData = false;
                    _this.isFilterRestore = true;
                    fields = _this.cloneFields(_this.fields);
                }
                else if (args.preventDefaultAction) {
                    fields = args.fields;
                }
                else {
                    if (_this.treeDataType === 1) {
                        fields = _this.selfReferencefilter(value, args.fields);
                    }
                    else {
                        if (_this.fields.dataSource instanceof DataManager) {
                            flag = true;
                        }
                        else {
                            fields = _this.nestedFilter(value, args.fields);
                        }
                    }
                }
                _this.hideCheckAll(_this.isFilteredData);
                if (flag) {
                    return;
                }
                _this.treeObj.fields = _this.getTreeFields(fields);
                _this.treeObj.dataBind();
            }
        });
    };
    DropDownTree.prototype.nestedFilter = function (value, filteredFields) {
        var matchedDataSource = [];
        for (var i = 0; i < this.treeData.length; i++) {
            var filteredChild = this.nestedChildFilter(value, this.treeData[i]);
            if (!isNullOrUndefined(filteredChild)) {
                matchedDataSource.push(filteredChild);
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    };
    DropDownTree.prototype.nestedChildFilter = function (value, node) {
        var children = node[this.fields.child];
        if (isNullOrUndefined(children)) {
            return (this.isMatchedNode(value, node)) ? node : null;
        }
        else {
            var matchedChildren = [];
            for (var i = 0; i < children.length; i++) {
                var filteredChild = this.nestedChildFilter(value, children[i]);
                if (!isNullOrUndefined(filteredChild)) {
                    matchedChildren.push(filteredChild);
                }
            }
            if (matchedChildren.length !== 0) {
                node[this.fields.child] = matchedChildren;
                return node;
            }
            else {
                node[this.fields.child] = null;
                return (this.isMatchedNode(value, node)) ? node : null;
            }
        }
    };
    DropDownTree.prototype.selfReferencefilter = function (value, filteredFields) {
        var matchedData = [];
        var matchedDataSource = [];
        for (var i = 0; i < this.treeData.length; i++) {
            if (this.isMatchedNode(value, this.treeData[i])) {
                matchedData.push(this.treeData[i]);
            }
        }
        for (var i = 0; i < matchedData.length; i++) {
            if (matchedDataSource.indexOf(matchedData[i]) === -1) {
                matchedDataSource.push(matchedData[i]);
                var parentId = matchedData[i][this.fields.parentValue];
                while (!isNullOrUndefined(parentId)) {
                    var parent_1 = null;
                    for (var j = 0; j < this.treeData.length; j++) {
                        var value_1 = this.treeData[j][this.fields.value];
                        if (!isNullOrUndefined(value_1) && (value_1 === parentId)) {
                            parent_1 = this.treeData[j];
                            break;
                        }
                    }
                    if (!isNullOrUndefined(parent_1) && (matchedDataSource.indexOf(parent_1) === -1)) {
                        matchedDataSource.push(parent_1);
                        parentId = parent_1[this.fields.parentValue];
                    }
                    else {
                        break;
                    }
                }
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    };
    DropDownTree.prototype.isMatchedNode = function (value, node) {
        var checkValue = node[this.fields.text];
        if (this.ignoreCase) {
            checkValue = checkValue.toLowerCase();
            value = value.toLowerCase();
        }
        if (this.ignoreAccent) {
            checkValue = DataUtil.ignoreDiacritics(checkValue);
            value = DataUtil.ignoreDiacritics(value);
        }
        if (this.filterType === 'StartsWith') {
            return checkValue.slice(0, value.length) === value;
        }
        else if (this.filterType === 'EndsWith') {
            return checkValue.slice(-value.length) === value;
        }
        else {
            return checkValue.indexOf(value) !== -1;
        }
    };
    /* To wire events for the dropdown tree */
    DropDownTree.prototype.wireEvents = function () {
        EventHandler.add(this.inputWrapper, 'mouseup', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper, 'blur', this.focusOut, this);
        EventHandler.add(this.inputWrapper, 'mousemove', this.mouseIn, this);
        EventHandler.add(this.inputWrapper, 'mouseout', this.onMouseLeave, this);
        EventHandler.add(this.overAllClear, 'mousedown', this.clearAll, this);
        EventHandler.add(window, 'resize', this.windowResize, this);
        this.keyboardModule = new KeyboardEvents(this.inputWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    DropDownTree.prototype.wireTreeEvents = function () {
        this.keyboardModule = new KeyboardEvents(this.tree, {
            keyAction: this.treeAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    DropDownTree.prototype.wireCheckAllWrapperEvents = function () {
        this.keyboardModule = new KeyboardEvents(this.checkAllParent, {
            keyAction: this.checkAllAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    /* To unwire events for the dropdown tree */
    DropDownTree.prototype.unWireEvents = function () {
        EventHandler.remove(this.inputWrapper, 'mouseup', this.dropDownClick);
        EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        EventHandler.remove(this.inputWrapper, 'blur', this.focusOut);
        EventHandler.remove(this.inputWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.inputWrapper, 'mouseout', this.onMouseLeave);
        EventHandler.remove(this.overAllClear, 'mousedown', this.clearAll);
        EventHandler.remove(window, 'resize', this.windowResize);
    };
    /* Trigger when the dropdown is clicked */
    DropDownTree.prototype.dropDownClick = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
            return;
        }
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        else {
            this.focusIn(e);
            this.renderPopup();
        }
        this.showOverAllClear();
    };
    DropDownTree.prototype.mouseIn = function () {
        if (this.enabled || !this.readonly) {
            this.showOverAllClear();
        }
    };
    DropDownTree.prototype.onMouseLeave = function () {
        if (!this.inputFocus) {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
    };
    DropDownTree.prototype.getDirective = function () {
        return 'EJS-DROPDOWNTREE';
    };
    DropDownTree.prototype.focusOut = function (e) {
        if (!this.enabled || this.readonly || !this.inputFocus) {
            return;
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && (e.target === this.inputWrapper)) {
            return;
        }
        var target = e.relatedTarget;
        if ((target !== this.inputEle) && (isNullOrUndefined(target)) && (e.target !== this.inputWrapper || !this.isPopupOpen)) {
            this.onFocusOut(e);
        }
    };
    DropDownTree.prototype.onFocusOut = function (event) {
        this.inputFocus = false;
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
        }
        if (this.showClearButton) {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        removeClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            var isValue = this.value ? (this.value.length ? true : false) : false;
            if (this.chipWrapper && (this.mode === 'Default') || (this.mode === 'Box' && !isValue)) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
                removeClass([this.inputEle], CHIP_INPUT);
            }
        }
        if (this.changeOnBlur) {
            this.triggerChangeEvent(event);
        }
        this.removeValue = false;
        this.oldValue = this.value;
        this.trigger('blur');
    };
    DropDownTree.prototype.triggerChangeEvent = function (event) {
        var isEqual = this.compareValues(this.oldValue, this.value);
        if ((!isEqual || this.isChipDelete) && !this.removeValue) {
            var eventArgs = {
                e: event,
                oldValue: this.oldValue,
                value: this.value,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
        }
    };
    DropDownTree.prototype.compareValues = function (oldValue, newValue) {
        if (oldValue === null || oldValue.length === 0) {
            var isValid = oldValue === null ? ((newValue === oldValue) ? true : false) :
                (oldValue.length === 0 ? (newValue === oldValue) : false);
            return isValid;
        }
        else if (oldValue.length !== newValue.length) {
            return false;
        }
        for (var i = 0; i < oldValue.length; i++) {
            if (oldValue[i] !== newValue[i]) {
                return false;
            }
        }
        return true;
    };
    DropDownTree.prototype.focusIn = function (e) {
        if (!this.enabled || this.readonly || this.inputFocus) {
            return;
        }
        this.showOverAllClear();
        this.inputFocus = true;
        addClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode === 'Default' && this.inputFocus) {
            if (this.chipWrapper && (this.value && this.value.length !== 0)) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
                addClass([this.inputEle], CHIP_INPUT);
            }
            if (this.popupObj) {
                this.popupObj.refreshPosition();
            }
        }
        var args = { isInteracted: e ? true : false, event: e };
        this.trigger('focus', args);
    };
    DropDownTree.prototype.treeAction = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                        _this.inputWrapper.focus();
                        e.preventDefault();
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'tab':
                    case 'shiftTab':
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        if (!_this.showCheckBox) {
                            _this.isValueChange = true;
                            _this.keyEventArgs = e;
                        }
                        break;
                    case 'space':
                        _this.isValueChange = true;
                        _this.keyEventArgs = e;
                        break;
                    case 'ctrlA':
                        if (_this.allowMultiSelection) {
                            _this.selectAll(true);
                        }
                        break;
                    case 'moveRight':
                    case 'moveLeft':
                    case 'shiftDown':
                    case 'moveDown':
                    case 'ctrlDown':
                    case 'csDown':
                    case 'shiftUp':
                    case 'moveUp':
                    case 'ctrlUp':
                    case 'csUp':
                    case 'home':
                    case 'shiftHome':
                    case 'ctrlHome':
                    case 'csHome':
                    case 'end':
                    case 'shiftEnd':
                    case 'ctrlEnd':
                    case 'csEnd':
                }
            }
            else {
                e.stopImmediatePropagation();
            }
        });
    };
    DropDownTree.prototype.keyActionHandler = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                    case 'shiftTab':
                    case 'tab':
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'altDown':
                        if (!_this.isPopupOpen) {
                            _this.showPopup();
                            e.preventDefault();
                        }
                        break;
                    case 'moveDown':
                        if (_this.showSelectAll && _this.showCheckBox) {
                            _this.checkAllParent.focus();
                        }
                        break;
                }
            }
        });
    };
    DropDownTree.prototype.checkAllAction = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        _this.clickHandler(e);
                        break;
                    case 'moveDown':
                        _this.treeObj.element.focus();
                }
            }
        });
    };
    DropDownTree.prototype.windowResize = function () {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.setWidth() });
            this.popupObj.refreshPosition();
        }
    };
    DropDownTree.prototype.getAriaAttributes = function () {
        var disable = this.enabled ? 'false' : 'true';
        return {
            'aria-disabled': disable,
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-labelledby': this.hiddenElement.id
        };
    };
    DropDownTree.prototype.createHiddenElement = function () {
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': HIDDENELEMENT }
        });
        prepend([this.hiddenElement], this.inputWrapper);
        this.validationAttribute();
    };
    DropDownTree.prototype.createClearIcon = function () {
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS
        });
        addClass([this.overAllClear], HIDEICON);
        removeClass([this.inputWrapper], SHOW_CLEAR);
        if (this.showClearButton) {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    };
    DropDownTree.prototype.validationAttribute = function () {
        var name = this.inputEle.getAttribute('name') ? this.inputEle.getAttribute('name') : this.inputEle.getAttribute('id');
        this.hiddenElement.setAttribute('name', name);
        this.inputEle.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            var attr = this.inputEle.getAttribute(attributes$$1[i]);
            if (attr) {
                this.hiddenElement.setAttribute(attributes$$1[i], attr);
                this.inputEle.removeAttribute(attributes$$1[i]);
            }
        }
    };
    DropDownTree.prototype.createChip = function () {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.chipWrapper = this.createElement('span', {
                className: CHIP_WRAPPER,
            });
            this.chipCollection = this.createElement('span', {
                className: CHIP_COLLECTION
            });
            this.chipWrapper.appendChild(this.chipCollection);
            this.inputWrapper.insertBefore(this.chipWrapper, this.hiddenElement);
            addClass([this.inputWrapper], SHOW_CHIP);
            var isValid = this.getValidMode();
            if (isValid && this.value !== null) {
                addClass([this.inputEle], CHIP_INPUT);
            }
            else if (this.value === null) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    };
    DropDownTree.prototype.getValidMode = function () {
        if (this.allowMultiSelection || this.showCheckBox) {
            return this.mode === 'Box' ? true : (this.mode === 'Default' && this.inputFocus) ? true : false;
        }
        else {
            return false;
        }
    };
    DropDownTree.prototype.createSelectAllWrapper = function () {
        this.checkAllParent = this.createElement('div', {
            className: CHECKALLPARENT, attrs: { 'tabindex': '0' }
        });
        this.selectAllSpan = this.createElement('span', {
            className: ALLTEXT
        });
        this.selectAllSpan.textContent = '';
        var ele = closest(this.element, '.' + BIGGER);
        var touchClass = isNullOrUndefined(ele) ? '' : SMALL;
        this.checkBoxElement = createCheckBox(this.createElement, true, { cssClass: touchClass });
        this.checkBoxElement.setAttribute('role', 'checkbox');
        this.checkAllParent.appendChild(this.checkBoxElement);
        this.checkAllParent.appendChild(this.selectAllSpan);
        this.setLocale();
        EventHandler.add(this.checkAllParent, 'mouseup', this.clickHandler, this);
        this.wireCheckAllWrapperEvents();
    };
    DropDownTree.prototype.clickHandler = function (e) {
        var target;
        if ((e.currentTarget && e.currentTarget.classList.contains(CHECKALLPARENT))) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.target;
        }
        this.checkWrapper = closest(target, '.' + CHECKBOXWRAP);
        if (!isNullOrUndefined(this.checkWrapper)) {
            var checkElement = select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.changeState(this.checkWrapper, checkElement.classList.contains(CHECK) ? 'uncheck' : 'check', e);
        }
        e.preventDefault();
    };
    DropDownTree.prototype.changeState = function (wrapper, state, e) {
        var ariaState;
        var frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.add(CHECK);
            ariaState = 'true';
            if (!this.isReverseUpdate) {
                this.treeObj.checkAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(true);
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK))) {
            frameSpan.classList.remove(CHECK);
            ariaState = 'false';
            if (!this.isReverseUpdate) {
                this.treeObj.uncheckAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(false);
        }
        this.setMultiSelect();
        this.ensurePlaceHolder();
        ariaState = state === 'check' ? 'true' : 'false';
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    };
    DropDownTree.prototype.setLocale = function (unSelect) {
        if (!this.selectAllSpan) {
            return;
        }
        if (this.selectAllText !== 'Select All' || this.unSelectAllText !== 'Unselect All') {
            var template = unSelect ? this.unSelectAllText : this.selectAllText;
            var compiledString = void 0;
            this.selectAllSpan.textContent = '';
            compiledString = compile(template);
            for (var _i = 0, _a = compiledString({}, null, null, null, !this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            this.selectAllSpan.textContent = unSelect ? this.unSelectAllText : this.selectAllText;
        }
    };
    DropDownTree.prototype.setAttributes = function () {
        this.element.removeAttribute('tabindex');
        var id = this.element.getAttribute('id');
        this.hiddenElement.id = id + '_hidden';
        this.inputWrapper.setAttribute('tabindex', '0');
        attributes(this.inputWrapper, this.getAriaAttributes());
    };
    DropDownTree.prototype.setHTMLAttributes = function () {
        if (Object.keys(this.htmlAttributes).length) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var htmlAttr = _a[_i];
                if (htmlAttr === 'class') {
                    this.inputWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                }
                else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.setProperties({ enabled: false }, true);
                    this.setEnable();
                }
                else if (htmlAttr === 'readonly' && !isNullOrUndefined(this.htmlAttributes[htmlAttr])) {
                    this.setProperties({ readonly: true }, true);
                    this.dataBind();
                }
                else if (htmlAttr === 'style') {
                    this.inputWrapper.setAttribute('style', this.htmlAttributes[htmlAttr]);
                }
                else {
                    var defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    var validateAttr = ['name', 'required'];
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputEle) :
                            this.inputEle.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else {
                        this.inputWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
    };
    DropDownTree.prototype.updateDataAttribute = function () {
        var value = this.htmlAttributes;
        var invalidAttr = ['class', 'style', 'id', 'type'];
        var attr = {};
        for (var a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    };
    DropDownTree.prototype.showOverAllClear = function () {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.overAllClear) {
            var isValue = this.value ? (this.value.length ? true : false) : false;
            if (isValue && this.showClearButton) {
                removeClass([this.overAllClear], HIDEICON);
                addClass([this.inputWrapper], SHOW_CLEAR);
            }
            else {
                addClass([this.overAllClear], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
    };
    DropDownTree.prototype.setTreeValue = function () {
        if (this.value !== null && this.value.length !== 0) {
            var data = void 0;
            if (this.showCheckBox || this.allowMultiSelection) {
                for (var i = 0; i < this.value.length; i++) {
                    data = this.treeObj.getTreeData(this.value[i])[0];
                    if (isNullOrUndefined(data)) {
                        this.value.splice(this.value.indexOf(this.value[i]), 1);
                    }
                }
                if (this.value.length !== 0) {
                    this.setValidValue();
                }
            }
            else {
                data = this.treeObj.getTreeData(this.value[0])[0];
                if (!isNullOrUndefined(data)) {
                    this.setProperties({ text: data[this.fields.text] }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ value: this.currentValue }, true);
                }
            }
        }
    };
    DropDownTree.prototype.setTreeText = function () {
        if (this.value !== null && !this.isInitialized) {
            return;
        }
        if (this.text !== null) {
            var data = void 0;
            var valArr = [];
            if (this.showCheckBox || this.allowMultiSelection) {
                var textArr = this.text.split(this.delimiterChar);
                for (var i = 0; i < textArr.length; i++) {
                    data = this.getItems(textArr[i]);
                    if (!isNullOrUndefined(data)) {
                        valArr.push(data[this.fields.value].toString());
                    }
                }
                if (valArr.length !== 0) {
                    this.oldValue = this.value;
                    this.setProperties({ value: valArr }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ text: this.currentText }, true);
                }
            }
            else {
                data = this.getItems(this.text);
                if (!isNullOrUndefined(data)) {
                    this.oldValue = this.value;
                    this.setProperties({ value: [data[this.fields.value].toString()] }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ text: this.currentText }, true);
                }
            }
        }
    };
    DropDownTree.prototype.setSelectedValue = function () {
        if (this.value != null) {
            return;
        }
        if (!this.isInitialized) {
            this.oldValue = this.value;
            if (this.treeObj.selectedNodes.length > 0 && !this.showCheckBox) {
                this.setProperties({ value: this.treeObj.selectedNodes }, true);
                if (this.allowMultiSelection) {
                    this.updateMode();
                }
            }
            else if (this.showCheckBox && this.treeObj.checkedNodes) {
                if (this.treeObj.checkedNodes.length > 0) {
                    this.setProperties({ value: this.treeObj.checkedNodes }, true);
                    setValue('selectedNodes', [], this.treeObj);
                    this.treeObj.dataBind();
                    this.updateMode();
                }
            }
            this.updateSelectedValues();
            this.currentText = this.text;
            this.currentValue = this.value;
        }
    };
    DropDownTree.prototype.setValidValue = function () {
        if (!this.showCheckBox && !this.allowMultiSelection) {
            Input.setValue(this.text, this.inputEle, this.floatLabelType);
            var id = this.value[0].toString();
            if (this.treeObj.selectedNodes[0] !== id) {
                setValue('selectedNodes', [id], this.treeObj);
            }
        }
        else {
            if (this.showCheckBox) {
                this.treeObj.checkedNodes = this.value.slice();
                setValue('selectedNodes', [], this.treeObj);
                this.treeObj.dataBind();
                this.setMultiSelect();
            }
            else {
                this.treeObj.selectedNodes = this.value.slice();
                this.selectedText = [];
                this.updateSelectedValues();
            }
            this.treeObj.dataBind();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
        if (this.isInitialized) {
            this.triggerChangeEvent();
        }
    };
    DropDownTree.prototype.getItems = function (givenText) {
        var data;
        if (this.treeDataType === 1) {
            for (var i = 0; i < this.treeItems.length; i++) {
                var text = getValue(this.fields.text, this.treeItems[i]);
                if (!isNullOrUndefined(this.treeItems[i]) && !isNullOrUndefined(text) && text === givenText) {
                    data = this.treeItems[i];
                    break;
                }
            }
        }
        else {
            data = this.getNestedItems(this.treeItems, this.fields, givenText);
        }
        return data;
    };
    DropDownTree.prototype.getNestedItems = function (data, field, givenText) {
        var newData;
        for (var i = 0, objlen = data.length; i < objlen; i++) {
            var dataId = getValue(this.fields.text, data[i]);
            if (data[i] && dataId && dataId.toString() === givenText) {
                return data[i];
            }
            else if (typeof field.child === 'string' && !isNullOrUndefined(getValue(field.child, data[i]))) {
                var childData = getValue(field.child, data[i]);
                newData = this.getNestedItems(childData, this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', data[i]))) {
                var child = 'child';
                newData = this.getNestedItems(getValue(child, data[i]), this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
        }
        return newData;
    };
    DropDownTree.prototype.getChildType = function (mapper) {
        return (typeof mapper.child === 'string' || isNullOrUndefined(mapper.child)) ? mapper : mapper.child;
    };
    /* To render the treeview */
    DropDownTree.prototype.renderTree = function () {
        this.treeObj = new TreeView({
            fields: this.getTreeFields(this.fields),
            enableRtl: this.enableRtl,
            nodeSelected: this.onNodeSelected.bind(this),
            nodeChecked: this.onNodeChecked.bind(this),
            nodeChecking: this.beforeCheck.bind(this),
            actionFailure: this.onActionFailure.bind(this),
            nodeClicked: this.onNodeClicked.bind(this),
            dataBound: this.OnDataBound.bind(this),
            allowMultiSelection: this.allowMultiSelection,
            showCheckBox: this.showCheckBox,
            autoCheck: this.treeSettings.autoCheck,
            sortOrder: this.sortOrder,
            expandOn: this.treeSettings.expandOn,
            loadOnDemand: this.treeSettings.loadOnDemand,
            nodeSelecting: this.onBeforeSelect.bind(this),
            nodeTemplate: this.itemTemplate
        });
        this.treeObj.appendTo('#' + this.tree.id);
    };
    /* To render the popup element */
    DropDownTree.prototype.renderPopup = function () {
        var _this = this;
        if (this.isFilteredData) {
            this.filterObj.value = '';
            this.treeObj.fields = this.getTreeFields(this.fields);
            this.isFilterRestore = true;
            this.isFilteredData = false;
            this.hideCheckAll(false);
        }
        var isCancelled = false;
        var args = { cancel: false };
        this.trigger('beforeOpen', args, function (args) {
            if (!args.cancel) {
                addClass([_this.inputWrapper], [ICONANIMATION]);
                if (_this.isFirstRender) {
                    _this.popupEle = _this.createElement('div', {
                        id: _this.element.id + '_popup', className: POPUP_CLASS + ' ' + (_this.cssClass != null ? _this.cssClass : '')
                    });
                    document.body.appendChild(_this.popupEle);
                    _this.createPopup(_this.popupEle);
                }
                else {
                    _this.popupEle = _this.popupObj.element;
                }
            }
            else {
                isCancelled = true;
            }
            if (_this.isFirstRender && !isCancelled) {
                prepend([_this.popupDiv], _this.popupEle);
                _this.popupDiv.style.display = 'block';
                if (_this.allowFiltering) {
                    _this.renderFilter();
                }
                if (_this.showCheckBox && _this.showSelectAll && (!_this.popupDiv.classList.contains(NODATA))) {
                    _this.createSelectAllWrapper();
                    _this.popupEle.insertBefore(_this.checkAllParent, _this.popupDiv);
                }
                if (_this.headerTemplate) {
                    _this.setHeaderTemplate();
                }
                if (_this.footerTemplate) {
                    _this.setFooterTemplate();
                }
                _this.isFirstRender = false;
            }
            if (!isCancelled) {
                attributes(_this.inputWrapper, { 'aria-expanded': 'true' });
                _this.popupObj.show();
                _this.popupObj.refreshPosition();
                _this.popupEle.style.display = 'block';
                _this.updatePopupHeight();
                if (!(_this.showCheckBox && _this.showSelectAll) && (!_this.popupDiv.classList.contains(NODATA)
                    && _this.treeItems.length > 0)) {
                    _this.treeObj.element.focus();
                }
                if (_this.checkSelectAll && _this.checkBoxElement) {
                    var wrap = closest(_this.checkBoxElement, '.' + CHECKBOXWRAP);
                    _this.changeState(wrap, 'check');
                    _this.checkSelectAll = false;
                }
                var eventArgs = { popup: _this.popupObj };
                _this.trigger('open', eventArgs);
            }
        });
    };
    DropDownTree.prototype.updatePopupHeight = function () {
        if (this.isFirstRender) {
            return;
        }
        var popupHeight = this.getHeight();
        this.popupEle.style.maxHeight = popupHeight;
        if (this.allowFiltering) {
            var height = Math.round(this.filterContainer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.headerTemplate) {
            var height = Math.round(this.header.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.showCheckBox && this.showSelectAll) {
            var height = Math.round(this.checkAllParent.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.footerTemplate) {
            var height = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        var border = parseInt(window.getComputedStyle(this.popupEle).borderTopWidth, 10);
        border = border + parseInt(window.getComputedStyle(this.popupEle).borderBottomWidth, 10);
        popupHeight = formatUnit(parseInt(popupHeight, 10) - border + 'px');
        this.popupDiv.style.maxHeight = popupHeight;
    };
    DropDownTree.prototype.createPopup = function (element) {
        var _this = this;
        if (this.isFirstRender) {
            this.popupObj = new Popup(element, {
                width: this.setWidth(),
                targetType: 'relative',
                relateTo: this.inputWrapper,
                zIndex: this.zIndex,
                enableRtl: this.enableRtl,
                position: { X: 'left', Y: 'bottom' },
                close: function () {
                    _this.isPopupOpen = false;
                },
                open: function () {
                    EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                    _this.isPopupOpen = true;
                },
            });
        }
    };
    /* To calculate the width when change via set model */
    DropDownTree.prototype.setElementWidth = function (inputWidth) {
        var ddElement = this.inputWrapper;
        if (!isNullOrUndefined(inputWidth)) {
            if (typeof inputWidth === 'number') {
                ddElement.style.width = formatUnit(inputWidth);
            }
            else if (typeof inputWidth === 'string') {
                ddElement.style.width = (inputWidth.match(/px|%|em/)) ? (inputWidth) :
                    (formatUnit(inputWidth));
            }
        }
    };
    /* To calculate the width of the popup */
    DropDownTree.prototype.setWidth = function () {
        var width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.inputWrapper.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        else if (typeof this.popupWidth === 'string') {
            width = (this.popupWidth.match(/px|em/)) ? (this.popupWidth) : width;
        }
        return width;
    };
    /* To calculate the height of the popup */
    DropDownTree.prototype.getHeight = function () {
        var height = formatUnit(this.popupHeight);
        if (height.indexOf('%') > -1) {
            // Will set the height of the popup according to the view port height
            var viewPortHeight = document.documentElement.clientHeight * parseFloat(height) / 100;
            height = viewPortHeight.toString() + 'px';
        }
        else if (typeof this.popupHeight === 'string') {
            height = (this.popupHeight.match(/px|em/)) ? (this.popupHeight) : height;
        }
        return height;
    };
    DropDownTree.prototype.onDocumentClick = function (e) {
        var target = e.target;
        var isTree = closest(target, '.' + PARENTITEM);
        var isFilter = closest(target, '.' + FILTERWRAP);
        if ((this.isPopupOpen && (this.inputWrapper.contains(target) || isTree || isFilter)) ||
            ((this.allowMultiSelection || this.showCheckBox) && (this.isPopupOpen && target.classList.contains(CHIP_CLOSE) ||
                (this.isPopupOpen && (target.classList.contains(CHECKALLPARENT) || target.classList.contains(ALLTEXT)
                    || target.classList.contains(CHECKBOXFRAME)))))) {
            this.isDocumentClick = false;
        }
        else if (!this.inputWrapper.contains(target)) {
            var isScroller = target.classList.contains(DROPDOWN) ? true :
                (matches(target, '.e-ddt .e-popup') || matches(target, '.e-ddt .e-treeview'));
            if (!isScroller && this.inputFocus) {
                this.focusOut(e);
            }
        }
    };
    DropDownTree.prototype.onActionFailure = function (e) {
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.popupDiv], NODATA);
    };
    DropDownTree.prototype.OnDataBound = function (args) {
        this.treeItems = args.data;
        if (this.treeItems.length <= 0) {
            this.l10nUpdate();
            addClass([this.popupDiv], NODATA);
            this.hideCheckAll(true);
        }
        else if (this.popupDiv.classList.contains(NODATA) && this.treeItems.length >= 1) {
            removeClass([this.popupDiv], NODATA);
            this.hideCheckAll(false);
        }
        this.treeDataType = this.getTreeDataType(this.treeItems, this.fields);
        if (this.isFirstRender && this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
            this.treeObj.element.focus();
        }
        var eventArgs = { data: args.data };
        this.trigger('dataBound', eventArgs);
        if (this.isFilteredData) {
            this.treeObj.expandAll();
        }
        if (this.isFilterRestore) {
            this.restoreFilterSelection();
            this.isFilterRestore = false;
        }
    };
    DropDownTree.prototype.restoreFilterSelection = function () {
        if (this.showCheckBox) {
            this.treeObj.checkedNodes = this.value ? this.value : [];
        }
        else {
            this.treeObj.selectedNodes = this.value ? this.value : [];
        }
    };
    /* To set cssclass for the dropdowntree */
    DropDownTree.prototype.setCssClass = function (newClass, oldClass) {
        var elements = this.popupObj ? [this.inputWrapper, this.popupObj.element] : [this.inputWrapper];
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(newClass) && newClass !== '') {
            addClass(elements, newClass.split(' '));
        }
    };
    DropDownTree.prototype.setEnableRTL = function (state) {
        if (state) {
            this.inputWrapper.classList.add(RTL);
        }
        else {
            this.inputWrapper.classList.remove(RTL);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
        if (this.treeObj) {
            this.treeObj.enableRtl = state;
            this.treeObj.dataBind();
        }
    };
    /* To set enable property */
    DropDownTree.prototype.setEnable = function () {
        Input.setEnabled(this.enabled, this.inputEle);
        if (this.enabled) {
            removeClass([this.inputWrapper], DISABLED);
            this.inputEle.setAttribute('aria-disabled', 'false');
            this.inputWrapper.setAttribute('aria-disabled', 'false');
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            addClass([this.inputWrapper], DISABLED);
            if (this.inputWrapper && this.inputWrapper.classList.contains(INPUTFOCUS)) {
                removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.inputEle.setAttribute('aria-disabled', 'true');
            this.inputWrapper.setAttribute('aria-disabled', 'true');
        }
    };
    DropDownTree.prototype.cloneFields = function (fields) {
        var clonedField = {
            dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
            child: this.cloneChildField(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes, query: fields.query,
            selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
        };
        return clonedField;
    };
    DropDownTree.prototype.cloneChildField = function (fields) {
        if (typeof fields === 'string') {
            return fields;
        }
        else {
            var clonedField = {
                dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
                child: (fields.child ? this.cloneChildField(fields.child) : null), hasChildren: fields.hasChildren,
                expanded: fields.expanded, iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes,
                query: fields.query, selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
            };
            return clonedField;
        }
    };
    DropDownTree.prototype.getTreeFields = function (fields) {
        var treeFields = {
            dataSource: fields.dataSource, id: fields.value, text: fields.text, parentID: fields.parentValue,
            child: this.getTreeChildren(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, isChecked: fields.selected,
            htmlAttributes: fields.htmlAttributes, query: fields.query, selected: fields.selected,
            tableName: fields.tableName, tooltip: fields.tooltip
        };
        return treeFields;
    };
    DropDownTree.prototype.getTreeChildren = function (mapper) {
        if (typeof mapper === 'string') {
            return mapper;
        }
        else if (!isNullOrUndefined(mapper)) {
            var childFields = void 0;
            mapper = this.getActualProperties(mapper);
            childFields = mapper;
            if (mapper.value) {
                childFields.id = mapper.value;
            }
            if (mapper.parentValue) {
                childFields.parentID = mapper.parentValue;
            }
            if (mapper.child) {
                childFields.child = this.getTreeChildren(mapper.child);
            }
            if (mapper.selected && this.showCheckBox) {
                childFields.isChecked = mapper.selected;
            }
            return childFields;
        }
        return null;
    };
    DropDownTree.prototype.getTreeDataType = function (ds, field) {
        if (this.fields.dataSource instanceof DataManager) {
            for (var i = 0; i < ds.length; i++) {
                if ((typeof field.child === 'string') && isNullOrUndefined(getValue(field.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (var i = 0, len = ds.length; i < len; i++) {
            if ((typeof field.child === 'string') && !isNullOrUndefined(getValue(field.child, ds[i]))) {
                return 2;
            }
            if (!isNullOrUndefined(getValue(field.parentValue, ds[i])) || !isNullOrUndefined(getValue(field.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    };
    /* Triggers when the tree fields is changed dynamically */
    DropDownTree.prototype.setFields = function () {
        this.resetValue();
        this.treeObj.fields = this.getTreeFields(this.fields);
        this.treeObj.dataBind();
    };
    DropDownTree.prototype.getEventArgs = function (args) {
        var checkData = args.data;
        var selectData = args.nodeData;
        var state;
        if (this.showCheckBox) {
            if (args.action === 'check') {
                state = 'select';
            }
            else if (args.action === 'uncheck') {
                state = 'un-select';
            }
        }
        var eventArgs = {
            action: this.showCheckBox ? state : args.action,
            isInteracted: args.isInteracted,
            item: args.node,
            itemData: this.showCheckBox ? checkData[0] : selectData
        };
        return eventArgs;
    };
    DropDownTree.prototype.onBeforeSelect = function (args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
            if (this.value === null) {
                this.setProperties({ value: [] }, true);
            }
        }
    };
    DropDownTree.prototype.updateHiddenValue = function () {
        if (this.allowMultiSelection || this.showCheckBox) {
            return;
        }
        if (this.value && this.value.length) {
            this.hiddenElement.innerHTML = '<option selected value ="' + this.value[0] + '">' + this.text + '</option>';
        }
        else {
            this.hiddenElement.innerHTML = '';
        }
    };
    /* Triggers when the tree node is selected */
    DropDownTree.prototype.onNodeSelected = function (args) {
        if (this.showCheckBox) {
            return;
        }
        var selectedText;
        if (args.isInteracted) {
            var id = getValue('id', args.nodeData).toString();
            if (!this.allowMultiSelection) {
                this.hiddenElement.innerHTML = '';
                this.setProperties({ value: [id] }, true);
                if (this.itemTemplate) {
                    selectedText = getValue('text', this.treeObj.getNode(id));
                }
                else {
                    selectedText = getValue('text', args.nodeData).toString();
                }
                Input.setValue(selectedText, this.inputEle, this.floatLabelType);
                this.setProperties({ text: selectedText }, true);
                this.currentText = this.text;
                this.currentValue = this.value;
                attributes(this.inputWrapper, { 'aria-describedby': this.element.id });
                attributes(this.inputWrapper, { 'aria-activedescendant': id.toString() });
                this.updateHiddenValue();
                this.showOverAllClear();
                this.hidePopup();
                this.isNodeSelected = true;
            }
            else if (this.allowMultiSelection) {
                this.setMultiSelect();
            }
        }
        var eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isValueChange && !this.changeOnBlur) {
            this.triggerChangeEvent(this.keyEventArgs);
            this.isValueChange = false;
        }
    };
    DropDownTree.prototype.onNodeClicked = function (args) {
        if (!this.changeOnBlur && this.isNodeSelected) {
            this.triggerChangeEvent(args.event);
            this.isNodeSelected = false;
        }
        var target = args.event.target;
        if ((target.classList.contains('e-fullrow') || target.classList.contains('e-list-text')) && this.showCheckBox) {
            var getNodeDetails = this.treeObj.getNode(args.node);
            if (getNodeDetails.isChecked === 'true') {
                this.treeObj.uncheckAll([args.node]);
            }
            else {
                this.treeObj.checkAll([args.node]);
            }
            this.setMultiSelect();
            this.ensurePlaceHolder();
        }
        if (!this.changeOnBlur && (this.allowMultiSelection || this.showCheckBox)) {
            this.triggerChangeEvent(args.event);
        }
    };
    DropDownTree.prototype.onNodeChecked = function (args) {
        var eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isFilteredData && args.action === 'uncheck') {
            var id = getValue('id', args.data[0]).toString();
            this.removeSelectedData(id, true);
        }
        if (!this.isChipDelete && args.isInteracted) {
            this.setMultiSelect();
            this.ensurePlaceHolder();
        }
        if (this.showSelectAll && this.checkBoxElement) {
            var nodes = this.treeObj.element.querySelectorAll('li');
            var checkedNodes = this.treeObj.element.querySelectorAll('li .e-checkbox-wrapper[aria-checked=true]');
            var wrap = closest(this.checkBoxElement, '.' + CHECKBOXWRAP);
            if (wrap && args.action === 'uncheck') {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'uncheck');
                this.isReverseUpdate = false;
            }
            else if (wrap && args.action === 'check' && checkedNodes.length === nodes.length) {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'check');
                this.isReverseUpdate = false;
            }
        }
    };
    DropDownTree.prototype.beforeCheck = function (args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
        }
    };
    DropDownTree.prototype.updateClearButton = function (state) {
        if (state) {
            if (!this.inputWrapper.contains(this.overAllClear)) {
                this.inputEle.parentElement.insertBefore(this.overAllClear, this.inputEle.nextSibling);
            }
            else {
                removeClass([this.overAllClear], HIDEICON);
                addClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
        else {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            var chipClose = selectAll('.' + CHIP_CLOSE, this.chipWrapper);
            for (var i = 0; i < chipClose.length; i++) {
                if (!state) {
                    addClass([chipClose[i]], HIDEICON);
                }
                else {
                    removeClass([chipClose[i]], HIDEICON);
                }
            }
        }
    };
    DropDownTree.prototype.updateDropDownIconState = function (state) {
        var spinIcon = select('.' + DDTICON, this.inputWrapper);
        if (state) {
            if (!spinIcon) {
                Input.appendSpan(DROPDOWNICON, this.inputWrapper, this.createElement);
            }
            else {
                removeClass([spinIcon], HIDEICON);
            }
            addClass([this.inputWrapper], SHOW_DD_ICON);
        }
        else {
            addClass([spinIcon], HIDEICON);
            removeClass([this.inputWrapper], SHOW_DD_ICON);
        }
    };
    DropDownTree.prototype.updateMode = function () {
        if (this.mode !== 'Delimiter') {
            if (!this.inputWrapper.contains(this.chipWrapper)) {
                this.createChip();
            }
            var isValid = this.getValidMode();
            if (this.chipWrapper.classList.contains(HIDEICON) && isValid) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
            }
            else if (!isValid) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
            var isValue = this.value !== null ? (this.value.length !== 0 ? true : false) : false;
            if (isValid && isValue) {
                addClass([this.inputEle], CHIP_INPUT);
            }
            else {
                removeClass([this.inputEle], CHIP_INPUT);
            }
        }
        else if (this.inputEle.classList.contains(CHIP_INPUT)) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
    };
    DropDownTree.prototype.ensurePlaceHolder = function () {
        if (this.value && this.value.length === 0) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    };
    DropDownTree.prototype.ensureClearIconPosition = function (floatLabelType) {
        if (floatLabelType !== 'Never') {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    };
    DropDownTree.prototype.setMultiSelectValue = function (newValues) {
        if (!this.isFilteredData) {
            this.setProperties({ value: newValues }, true);
            if (newValues && newValues.length !== 0 && !this.showCheckBox) {
                this.treeObj.selectedNodes = this.value.slice();
                this.treeObj.dataBind();
            }
        }
        else {
            var selectedValues = isNullOrUndefined(this.value) ? [] : this.value;
            for (var i = 0; i < newValues.length; i++) {
                if (isNullOrUndefined(this.value) || this.value.indexOf(newValues[i]) === -1) {
                    selectedValues.push(newValues[i]);
                }
            }
            this.setProperties({ value: selectedValues }, true);
        }
    };
    DropDownTree.prototype.setMultiSelect = function () {
        if (this.showCheckBox && !this.isDynamicChange) {
            this.setMultiSelectValue(this.treeObj.checkedNodes);
        }
        else {
            var ddtValue = this.allowMultiSelection ? (this.showCheckBox ? this.treeObj.checkedNodes
                : this.treeObj.selectedNodes) : (this.value ? (this.showCheckBox ? this.value : [this.value[0]]) : null);
            this.setMultiSelectValue(ddtValue);
            if (this.showCheckBox && this.value !== null) {
                this.treeObj.checkedNodes = this.value;
                this.treeObj.dataBind();
            }
        }
        this.selectedText = [];
        var checkSelection = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (this.inputWrapper.contains(this.chipWrapper) && !checkSelection) {
            removeClass([this.inputEle], CHIP_INPUT);
            detach(this.chipWrapper);
        }
        var isValid = this.getValidMode();
        if (isValid && this.value !== null) {
            addClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                removeClass([this.chipWrapper], HIDEICON);
            }
        }
        var isValue = this.value ? (this.value.length ? true : false) : false;
        if (this.chipWrapper && (this.mode === 'Box' && !isValue)) {
            addClass([this.chipWrapper], HIDEICON);
            removeClass([this.inputEle], CHIP_INPUT);
        }
        this.updateSelectedValues();
    };
    DropDownTree.prototype.getSelectedData = function (value) {
        var data = null;
        if (this.isFilteredData) {
            for (var i = 0; i < this.selectedData.length; i++) {
                if (getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                    data = this.selectedData[i];
                    break;
                }
            }
        }
        if (isNullOrUndefined(data)) {
            if (this.treeSettings.loadOnDemand) {
                data = this.treeObj.getTreeData(value)[0];
            }
            else {
                data = this.treeObj.getNode(value);
            }
            if (!isNullOrUndefined(data)) {
                this.selectedData.push(data);
            }
        }
        return data;
    };
    DropDownTree.prototype.removeSelectedData = function (value, muteOnChange) {
        var selectedValues = isNullOrUndefined(this.value) ? [] : this.value.slice();
        selectedValues.splice(selectedValues.indexOf(value), 1);
        this.setProperties({ value: selectedValues }, muteOnChange);
        for (var i = 0; i < this.selectedData.length; i++) {
            if (getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                this.selectedData.splice(i, 1);
                break;
            }
        }
    };
    DropDownTree.prototype.updateSelectedValues = function () {
        this.dataValue = '';
        var temp;
        var text;
        var textValue = '';
        var selectedData;
        this.hiddenElement.innerHTML = '';
        if ((!this.isChipDelete || this.treeSettings.autoCheck) && (this.inputWrapper.contains(this.chipWrapper))) {
            this.chipCollection.innerHTML = '';
        }
        if (!this.isFilteredData) {
            this.selectedData = [];
        }
        if (!isNullOrUndefined(this.value)) {
            for (var i = 0, len = this.value.length; i < len; i++) {
                selectedData = this.getSelectedData(this.value[i]);
                text = getValue(this.treeSettings.loadOnDemand ? this.fields.text : 'text', selectedData);
                this.selectedText.push(text);
                temp = this.selectedText[this.selectedText.length - 1];
                if (this.selectedText.length > 1) {
                    this.dataValue += (this.delimiterChar + ' ' + temp);
                    textValue += (',' + temp);
                    this.setProperties({ text: textValue }, true);
                }
                else {
                    this.dataValue += temp;
                    textValue += temp;
                }
                if (this.mode !== 'Delimiter' && (!this.isChipDelete || this.treeSettings.autoCheck) &&
                    (this.allowMultiSelection || this.showCheckBox)) {
                    this.setChipValues(temp, this.value[i]);
                }
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[i] + '">' +
                    this.selectedText[this.selectedText.length - 1] + '</option>';
            }
        }
        var isValid = this.getValidMode();
        if (this.mode !== 'Box' && (this.allowMultiSelection || this.showCheckBox) && !isValid) {
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
        Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
        if (textValue === '') {
            this.setProperties({ text: null }, true);
        }
        else {
            this.setProperties({ text: textValue }, true);
        }
        if (this.showClearButton && this.inputFocus) {
            this.showOverAllClear();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
    };
    DropDownTree.prototype.setChipValues = function (text, value) {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.createChip();
        }
        var chip = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': value }
        });
        var chipContent = this.createElement('span', { className: CHIP_CONTENT });
        var chipClose = this.createElement('span', { className: CHIP_CLOSE + ' ' + ICONS });
        chipContent.innerHTML = text;
        chip.appendChild(chipContent);
        this.chipCollection.appendChild(chip);
        if (this.showClearButton) {
            chip.appendChild(chipClose);
            EventHandler.add(chipClose, 'mousedown', this.removeChip, this);
        }
    };
    DropDownTree.prototype.setSelectAllWrapper = function (state) {
        if (this.isFirstRender) {
            return;
        }
        if (state && !this.popupEle.contains(this.checkAllParent) && this.showCheckBox) {
            this.createSelectAllWrapper();
            this.popupEle.insertBefore(this.checkAllParent, this.popupDiv);
        }
        else if (this.popupEle.contains(this.checkAllParent)) {
            detach(this.checkAllParent);
            this.checkAllParent = null;
        }
    };
    DropDownTree.prototype.setHeaderTemplate = function () {
        var compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            addClass([this.header], HEADER);
        }
        compiledString = this.templateComplier(this.headerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.header.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, true, false);
        this.popupEle.insertBefore(this.header, this.checkAllParent ? this.checkAllParent : this.popupDiv);
    };
    DropDownTree.prototype.templateComplier = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (e) {
                return compile(template);
            }
        }
        return compile(template);
    };
    DropDownTree.prototype.setFooterTemplate = function () {
        var compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            addClass([this.footer], FOOTER);
        }
        compiledString = this.templateComplier(this.footerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.footer.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, false, true);
        append([this.footer], this.popupEle);
    };
    DropDownTree.prototype.clearAll = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        this.resetValue();
        this.showOverAllClear();
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if (e) {
            this.isClearButtonClick = true;
        }
        if (!this.changeOnBlur) {
            this.triggerChangeEvent(e);
        }
    };
    DropDownTree.prototype.removeChip = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var element = e.target.parentElement;
        var value = element.getAttribute('data-value');
        if (this.chipCollection) {
            if (element) {
                remove(element);
            }
        }
        this.isChipDelete = true;
        this.isClearButtonClick = true;
        this.removeSelectedData(value, true);
        this.selectedText = [];
        if (this.allowMultiSelection) {
            this.treeObj.selectedNodes = this.value.slice();
            this.updateSelectedValues();
        }
        if (this.showCheckBox) {
            this.treeObj.uncheckAll([value]);
            this.clearCheckAll();
            this.setMultiSelect();
        }
        this.triggerChangeEvent(e);
        this.isChipDelete = false;
        this.ensurePlaceHolder();
    };
    DropDownTree.prototype.resetValue = function (isDynamicChange) {
        Input.setValue(null, this.inputEle, this.floatLabelType);
        this.oldValue = this.value;
        this.dataValue = null;
        this.setProperties({ value: [] }, true);
        this.setProperties({ text: null }, true);
        this.selectedData = [];
        setValue('selectedNodes', [], this.treeObj);
        this.hiddenElement.innerHTML = '';
        if (this.showCheckBox) {
            this.treeObj.uncheckAll();
            this.setMultiSelect();
            this.clearCheckAll();
        }
        if (this.oldValue === null && !isDynamicChange) {
            this.removeValue = true;
        }
        else if (isDynamicChange) {
            this.triggerChangeEvent();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            this.chipCollection.innerHTML = '';
            this.ensurePlaceHolder();
        }
    };
    DropDownTree.prototype.clearCheckAll = function () {
        if (this.showSelectAll && this.value.length === 0) {
            this.setLocale(false);
        }
    };
    DropDownTree.prototype.selectAllItems = function (state) {
        if (this.showCheckBox) {
            state ? this.treeObj.checkAll() : this.treeObj.uncheckAll();
            this.checkSelectAll = true;
        }
        else if (this.allowMultiSelection) {
            if (!state) {
                this.treeObj.selectedNodes = [];
            }
            else {
                var li = selectAll('li', this.treeObj.element);
                var id = void 0;
                var arr = [];
                for (var i = 0; i < li.length; i++) {
                    id = li[i].getAttribute('data-uid').toString();
                    arr.push(id);
                }
                this.treeObj.selectedNodes = arr;
            }
        }
        this.updateMode();
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateTreeSettings = function (prop) {
        var value = Object.keys(prop.treeSettings)[0];
        if (value === 'autoCheck') {
            this.ensureAutoCheck();
            this.treeObj.autoCheck = this.treeSettings.autoCheck;
        }
        else if (value === 'loadOnDemand') {
            this.treeObj.loadOnDemand = this.treeSettings.loadOnDemand;
        }
        else if (value === 'expandOn') {
            this.treeObj.expandOn = this.treeSettings.expandOn;
            this.treeObj.dataBind();
            return;
        }
        this.treeObj.dataBind();
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateCheckBoxState = function (checkBox) {
        this.treeObj.showCheckBox = checkBox;
        this.treeObj.dataBind();
        this.isDynamicChange = true;
        this.setSelectAllWrapper(this.showSelectAll);
        if (this.showSelectAll) {
            this.setLocale();
        }
        if (this.showCheckBox) {
            this.updateMode();
        }
        this.setMultiSelect();
        this.isDynamicChange = false;
    };
    DropDownTree.prototype.updateTemplate = function () {
        if (this.popupObj) {
            this.popupObj.destroy();
            if (this.isPopupOpen) {
                this.hidePopup();
                this.isFirstRender = true;
                this.renderPopup();
            }
            else {
                this.isFirstRender = true;
            }
        }
    };
    DropDownTree.prototype.l10nUpdate = function (actionFailure) {
        if (this.noRecord) {
            this.noRecord.innerHTML = '';
        }
        else {
            this.noRecord = this.createElement('div');
            addClass([this.noRecord], NODATACONTAINER);
            prepend([this.noRecord], this.popupDiv);
        }
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            var template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            var compiledString = void 0;
            var templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            compiledString = this.templateComplier(template);
            for (var _i = 0, _a = compiledString({}, null, null, templateId, this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.noRecord.appendChild(item);
            }
            this.ddtupdateBlazorTemplates(!actionFailure, actionFailure);
        }
        else {
            var l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.noRecord.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    };
    DropDownTree.prototype.ddtupdateBlazorTemplates = function (noRecord, action, header, footer, isEmpty) {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE, this, isEmpty);
            }
            if (header) {
                updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE, this);
            }
            if (footer) {
                updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE, this);
            }
        }
    };
    DropDownTree.prototype.ddtresetBlazorTemplates = function (noRecord, action, header, footer) {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE);
            }
            if (this.actionFailureTemplate && action) {
                resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE);
            }
            if (header) {
                resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE);
            }
            if (footer) {
                resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE);
            }
        }
    };
    DropDownTree.prototype.updateRecordTemplate = function (action) {
        if (this.treeItems && this.treeItems.length <= 0) {
            this.l10nUpdate(action);
            this.updateTemplate();
        }
    };
    DropDownTree.prototype.updateMultiSelection = function (state) {
        this.treeObj.allowMultiSelection = state;
        this.treeObj.dataBind();
        if (this.allowMultiSelection) {
            this.updateMode();
        }
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateAllowFiltering = function (state) {
        if (!this.isFirstRender) {
            if (state) {
                this.renderFilter();
            }
            else {
                this.destroyFilter();
            }
        }
        this.ensureAutoCheck();
    };
    DropDownTree.prototype.updateFilterPlaceHolder = function () {
        if (this.filterObj) {
            this.filterObj.placeholder = this.filterBarPlaceholder;
            this.filterObj.element.setAttribute('aria-label', this.filterBarPlaceholder);
        }
    };
    DropDownTree.prototype.updateValue = function (value) {
        if (isNullOrUndefined(value) || value.length === 0) {
            this.resetValue(true);
        }
        else {
            this.setTreeValue();
        }
        this.updateHiddenValue();
    };
    DropDownTree.prototype.updateText = function (text) {
        if (isNullOrUndefined(text)) {
            this.resetValue();
        }
        else {
            this.setTreeText();
        }
        this.updateHiddenValue();
    };
    DropDownTree.prototype.updateModelMode = function () {
        var validMode = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (!validMode) {
            return;
        }
        this.updateMode();
        this.setMultiSelect();
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    DropDownTree.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.setElementWidth(newProp.width);
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputEle);
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRTL(this.enableRtl);
                    break;
                case 'fields':
                    this.setFields();
                    break;
                case 'readonly':
                    Input.setReadonly(newProp.readonly, this.inputEle);
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'floatLabelType':
                    Input.removeFloating(this.inputObj);
                    Input.addFloating(this.inputEle, newProp.floatLabelType, this.placeholder, this.createElement);
                    this.ensureClearIconPosition(newProp.floatLabelType);
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp.showClearButton);
                    break;
                case 'allowFiltering':
                    this.updateAllowFiltering(newProp.allowFiltering);
                    break;
                case 'filterBarPlaceholder':
                    this.updateFilterPlaceHolder();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    break;
                case 'text':
                    this.updateText(newProp.text);
                    break;
                case 'allowMultiSelection':
                    this.updateMultiSelection(newProp.allowMultiSelection);
                    break;
                case 'mode':
                    this.updateModelMode();
                    break;
                case 'delimiterChar':
                    if (this.mode === 'Box') {
                        return;
                    }
                    if (this.showCheckBox || this.allowMultiSelection) {
                        this.setMultiSelect();
                    }
                    break;
                case 'selectAllText':
                    if (this.showCheckBox && this.showSelectAll) {
                        this.setLocale();
                    }
                    break;
                case 'unSelectAllText':
                    if (this.showCheckBox && this.showSelectAll) {
                        this.setLocale(false);
                    }
                    break;
                case 'showSelectAll':
                    if (this.showCheckBox) {
                        this.setSelectAllWrapper(newProp.showSelectAll);
                        this.updatePopupHeight();
                    }
                    break;
                case 'showCheckBox':
                    this.updateCheckBoxState(newProp.showCheckBox);
                    this.updatePopupHeight();
                    break;
                case 'treeSettings':
                    this.updateTreeSettings(newProp);
                    break;
                case 'sortOrder':
                    this.treeObj.sortOrder = newProp.sortOrder;
                    this.treeObj.dataBind();
                    break;
                case 'showDropDownIcon':
                    this.updateDropDownIconState(newProp.showDropDownIcon);
                    break;
                case 'popupWidth':
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'popupHeight':
                    if (this.popupObj) {
                        this.updatePopupHeight();
                    }
                    break;
                case 'zIndex':
                    if (this.popupObj) {
                        this.popupObj.zIndex = newProp.zIndex;
                        this.popupObj.dataBind();
                    }
                    break;
                case 'headerTemplate':
                    this.updateTemplate();
                    break;
                case 'footerTemplate':
                    this.updateTemplate();
                    break;
                case 'itemTemplate':
                    this.treeObj.nodeTemplate = newProp.itemTemplate;
                    this.treeObj.dataBind();
                    break;
                case 'noRecordsTemplate':
                    this.updateRecordTemplate();
                    break;
                case 'actionFailureTemplate':
                    this.updateRecordTemplate(true);
                    break;
                case 'htmlAttributes':
                    this.setHTMLAttributes();
                    break;
            }
        }
    };
    /**
     * Allows you to clear the selected values from the Dropdown Tree component.
     * @method clear
     * @return {void}.
     */
    DropDownTree.prototype.clear = function () {
        this.clearAll();
        if (this.inputFocus) {
            this.onFocusOut();
        }
        else {
            if (this.changeOnBlur) {
                this.triggerChangeEvent();
            }
            this.removeValue = false;
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownTree.prototype.destroy = function () {
        this.ddtresetBlazorTemplates(true, true, true, true);
        this.unWireEvents();
        this.setCssClass(null, this.cssClass);
        this.resetValue();
        this.treeObj.destroy();
        this.destroyFilter();
        if (this.popupObj) {
            this.popupObj.destroy();
            detach(this.popupObj.element);
        }
        if (this.element.tagName !== this.getDirective()) {
            this.inputWrapper.parentElement.insertBefore(this.element, this.inputWrapper);
        }
        detach(this.inputWrapper);
        detach(this.popupDiv);
        this.element.classList.remove('e-input');
        _super.prototype.destroy.call(this);
    };
    DropDownTree.prototype.destroyFilter = function () {
        if (this.filterObj) {
            this.filterObj.destroy();
            detach(this.filterObj.element);
            detach(this.filterContainer);
            this.filterObj = null;
        }
    };
    /**
     * Ensures visibility of the Dropdown Tree item by using item value or item element.
     * If many Dropdown Tree items are present, and we are in need to find a particular item, then the `ensureVisible` property
     * helps you to bring the item to visibility by expanding the Dropdown Tree and scrolling to the specific item.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     */
    DropDownTree.prototype.ensureVisible = function (item) {
        this.treeObj.ensureVisible(item);
    };
    /**
     * To get the updated data of source of the Dropdown Tree.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     * @returns { { [key: string]: Object }[] }.
     */
    DropDownTree.prototype.getData = function (item) {
        return this.treeObj.getTreeData(item);
    };
    /**
     * Close the Dropdown tree pop-up.
     * @returns void.
     */
    DropDownTree.prototype.hidePopup = function () {
        var eventArgs = { popup: this.popupObj };
        this.inputWrapper.classList.remove(ICONANIMATION);
        if (this.popupEle) {
            this.popupEle.style.display = 'none';
        }
        attributes(this.inputWrapper, { 'aria-expanded': 'false' });
        if (this.popupObj && this.isPopupOpen) {
            this.popupObj.hide();
            if (this.inputFocus) {
                this.inputWrapper.focus();
            }
            this.trigger('close', eventArgs);
        }
    };
    /**
     * Based on the state parameter, entire list item will be selected or deselected.
     * parameter
     * `true`   - Selects entire Dropdown Tree items.
     * `false`  - Unselects entire Dropdown Tree items.
     * @returns void
     */
    DropDownTree.prototype.selectAll = function (state) {
        this.selectAllItems(state);
    };
    /**
     * Opens the popup that displays the Dropdown Tree items.
     * @returns void.
     */
    DropDownTree.prototype.showPopup = function () {
        if (!this.enabled || this.readonly || this.isPopupOpen) {
            return;
        }
        this.renderPopup();
        this.focusIn();
    };
    /**
     * Return the module name.
     * @private
     */
    DropDownTree.prototype.getModuleName = function () {
        return 'dropdowntree';
    };
    __decorate$2([
        Property('The Request Failed')
    ], DropDownTree.prototype, "actionFailureTemplate", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "allowFiltering", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "allowMultiSelection", void 0);
    __decorate$2([
        Property(true)
    ], DropDownTree.prototype, "changeOnBlur", void 0);
    __decorate$2([
        Property('')
    ], DropDownTree.prototype, "cssClass", void 0);
    __decorate$2([
        Property(',')
    ], DropDownTree.prototype, "delimiterChar", void 0);
    __decorate$2([
        Property(true)
    ], DropDownTree.prototype, "enabled", void 0);
    __decorate$2([
        Complex({}, Fields)
    ], DropDownTree.prototype, "fields", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "filterBarPlaceholder", void 0);
    __decorate$2([
        Property('StartsWith')
    ], DropDownTree.prototype, "filterType", void 0);
    __decorate$2([
        Property('Never')
    ], DropDownTree.prototype, "floatLabelType", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "footerTemplate", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "ignoreAccent", void 0);
    __decorate$2([
        Property(true)
    ], DropDownTree.prototype, "ignoreCase", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "headerTemplate", void 0);
    __decorate$2([
        Property({})
    ], DropDownTree.prototype, "htmlAttributes", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "itemTemplate", void 0);
    __decorate$2([
        Property('Default')
    ], DropDownTree.prototype, "mode", void 0);
    __decorate$2([
        Property('No Records Found')
    ], DropDownTree.prototype, "noRecordsTemplate", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "placeholder", void 0);
    __decorate$2([
        Property('300px')
    ], DropDownTree.prototype, "popupHeight", void 0);
    __decorate$2([
        Property('100%')
    ], DropDownTree.prototype, "popupWidth", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "readonly", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "showSelectAll", void 0);
    __decorate$2([
        Property('Select All')
    ], DropDownTree.prototype, "selectAllText", void 0);
    __decorate$2([
        Property(false)
    ], DropDownTree.prototype, "showCheckBox", void 0);
    __decorate$2([
        Property(true)
    ], DropDownTree.prototype, "showClearButton", void 0);
    __decorate$2([
        Property(true)
    ], DropDownTree.prototype, "showDropDownIcon", void 0);
    __decorate$2([
        Property('None')
    ], DropDownTree.prototype, "sortOrder", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "text", void 0);
    __decorate$2([
        Complex({}, TreeSettings)
    ], DropDownTree.prototype, "treeSettings", void 0);
    __decorate$2([
        Property('Unselect All')
    ], DropDownTree.prototype, "unSelectAllText", void 0);
    __decorate$2([
        Property(null)
    ], DropDownTree.prototype, "value", void 0);
    __decorate$2([
        Property('100%')
    ], DropDownTree.prototype, "width", void 0);
    __decorate$2([
        Property(1000)
    ], DropDownTree.prototype, "zIndex", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "actionFailure", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "beforeOpen", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "change", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "close", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "blur", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "created", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "dataBound", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "destroyed", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "filtering", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "focus", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "keyPress", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "open", void 0);
    __decorate$2([
        Event()
    ], DropDownTree.prototype, "select", void 0);
    DropDownTree = __decorate$2([
        NotifyPropertyChanges
    ], DropDownTree);
    return DropDownTree;
}(Component));

/**
 * export all modules from current location
 */

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-list/drop-down-list-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
var SPINNER_CLASS = 'e-atc-spinner-icon';
dropDownListClasses.root = 'e-combobox';
var inputObject$1 = {
    container: null,
    buttons: []
};
/**
 * The ComboBox component allows the user to type a value or choose an option from the list of predefined options.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 *   let games:ComboBox = new ComboBox();
 *   games.appendTo("#list");
 * ```
 */
var ComboBox = /** @__PURE__ @class */ (function (_super) {
    __extends$3(ComboBox, _super);
    /**
     * *Constructor for creating the component
     */
    function ComboBox(options, element) {
        return _super.call(this, options, element) || this;
    }
    
    /**
     * Initialize the event handler
     * @private
     */
    ComboBox.prototype.preRender = function () {
        _super.prototype.preRender.call(this);
    };
    ComboBox.prototype.getLocaleName = function () {
        return 'combo-box';
    };
    
    ComboBox.prototype.wireEvent = function () {
        if (this.getModuleName() === 'combobox') {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur, this);
            EventHandler.add(this.inputWrapper.container, 'blur', this.onBlur, this);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick, this);
        }
        EventHandler.add(this.inputElement, 'focus', this.targetFocus, this);
        if (!this.readonly) {
            EventHandler.add(this.inputElement, 'input', this.onInput, this);
            EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.inputElement, 'paste', this.pasteHandler, this);
        }
        this.bindCommonEvent();
    };
    ComboBox.prototype.preventBlur = function (e) {
        if ((!this.allowFiltering && document.activeElement !== this.inputElement &&
            !document.activeElement.classList.contains(dropDownListClasses.input) && Browser.isDevice || !Browser.isDevice)) {
            e.preventDefault();
        }
    };
    ComboBox.prototype.onBlur = function (e) {
        var inputValue = this.inputElement.value === '' ? null : this.inputElement.value;
        if (!isNullOrUndefined(this.listData) && !isNullOrUndefined(inputValue) && inputValue !== this.text) {
            this.customValue(e);
        }
        _super.prototype.onBlur.call(this, e);
    };
    ComboBox.prototype.targetElement = function () {
        return this.inputElement;
    };
    ComboBox.prototype.setOldText = function (text) {
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        this.customValue();
        this.removeSelection();
    };
    ComboBox.prototype.setOldValue = function (value) {
        if (this.allowCustom) {
            this.valueMuteChange(this.value);
        }
        else {
            this.valueMuteChange(null);
        }
        this.removeSelection();
        this.setHiddenValue();
    };
    ComboBox.prototype.valueMuteChange = function (value) {
        var inputValue = isNullOrUndefined(value) ? null : value.toString();
        Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
        this.setProperties({ value: value, text: value, index: null }, true);
        this.activeIndex = this.index;
        var fields = this.fields;
        var dataItem = {};
        dataItem[fields.text] = isNullOrUndefined(value) ? null : value.toString();
        dataItem[fields.value] = isNullOrUndefined(value) ? null : value.toString();
        this.itemData = dataItem;
        this.item = null;
        if (this.previousValue !== this.value) {
            this.detachChangeEvent(null);
        }
    };
    ComboBox.prototype.updateValues = function () {
        if (!isNullOrUndefined(this.value)) {
            var li = this.getElementByValue(this.value);
            if (li) {
                this.setSelection(li, null);
            }
            else if (this.allowCustom) {
                this.valueMuteChange(this.value);
            }
            else {
                this.valueMuteChange(null);
            }
        }
        else if (this.text && isNullOrUndefined(this.value)) {
            var li = this.getElementByText(this.text);
            if (li) {
                this.setSelection(li, null);
            }
            else {
                Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
                this.customValue();
            }
        }
        else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    ComboBox.prototype.updateIconState = function () {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
            else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    };
    ComboBox.prototype.getAriaAttributes = function () {
        var ariaAttributes = {
            'aria-owns': this.element.id + '_options',
            'role': 'combobox',
            'aria-autocomplete': 'both',
            'aria-labelledby': this.hiddenElement.id,
            'aria-hasPopup': 'true',
            'aria-expanded': 'false',
            'aria-readonly': this.readonly.toString(),
            'autocomplete': 'off',
            'autocorrect': 'off',
            'autocapitalize': 'off',
            'spellcheck': 'false'
        };
        return ariaAttributes;
    };
    ComboBox.prototype.searchLists = function (e) {
        this.isTyped = true;
        if (this.isFiltering()) {
            _super.prototype.searchLists.call(this, e);
            if (this.ulElement && this.filterInput.value.trim() === '') {
                this.setHoverList(this.ulElement.querySelector('.' + dropDownListClasses.li));
            }
        }
        else {
            if (this.ulElement && this.inputElement.value === '' && this.preventAutoFill) {
                this.setHoverList(this.ulElement.querySelector('.' + dropDownListClasses.li));
            }
            this.incrementalSearch(e);
        }
    };
    ComboBox.prototype.getNgDirective = function () {
        return 'EJS-COMBOBOX';
    };
    ComboBox.prototype.setSearchBox = function () {
        this.filterInput = this.inputElement;
        return (this.isFiltering() ? this.inputWrapper : inputObject$1);
    };
    ComboBox.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        if (!this.isServerBlazor) {
            _super.prototype.onActionComplete.call(this, ulElement, list, e);
        }
        if (this.isSelectCustom) {
            this.removeSelection();
        }
        if (!this.preventAutoFill && this.getModuleName() === 'combobox' && this.isTyped) {
            this.inlineSearch();
        }
    };
    ComboBox.prototype.getFocusElement = function () {
        var dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
        var selected = this.list.querySelector('.' + dropDownListClasses.selected);
        var isSelected = dataItem.text === this.inputElement.value && !isNullOrUndefined(selected);
        if (isSelected) {
            return selected;
        }
        if ((Browser.isDevice && !this.isDropDownClick || !Browser.isDevice) &&
            !isNullOrUndefined(this.liCollections) && this.liCollections.length > 0) {
            var inputValue = this.inputElement.value;
            var activeItem = Search(inputValue, this.liCollections, 'StartsWith', true);
            var activeElement = activeItem.item;
            if (!isNullOrUndefined(activeElement)) {
                var count = this.getIndexByValue(activeElement.getAttribute('data-value')) - 1;
                var height = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
                if (!isNaN(height) && this.getModuleName() !== 'autocomplete') {
                    this.removeFocus();
                    var fixedHead = this.fields.groupBy ? this.liCollections[0].offsetHeight : 0;
                    this.list.scrollTop = count * height + fixedHead;
                    addClass([activeElement], dropDownListClasses.focus);
                }
            }
            else {
                if (this.isSelectCustom && this.inputElement.value.trim() !== '') {
                    this.removeFocus();
                    this.list.scrollTop = 0;
                }
            }
            return activeElement;
        }
        else {
            return null;
        }
    };
    ComboBox.prototype.setValue = function (e) {
        if (e && e.type === 'keydown' && e.action === 'enter') {
            this.removeFillSelection();
        }
        if (this.autofill && this.getModuleName() === 'combobox' && e && e.type === 'keydown' && e.action !== 'enter') {
            this.preventAutoFill = false;
            this.inlineSearch(e);
            return false;
        }
        else {
            return _super.prototype.setValue.call(this, e);
        }
    };
    ComboBox.prototype.checkCustomValue = function () {
        this.itemData = this.getDataByValue(this.value);
        var dataItem = this.getItemData();
        if (!(this.allowCustom && isNullOrUndefined(dataItem.value) && isNullOrUndefined(dataItem.text))) {
            this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
        }
    };
    /**
     * Shows the spinner loader.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.showSpinner = function () {
        if (isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = (this.getModuleName() === 'autocomplete') ? (this.inputWrapper.buttons[0] ||
                this.inputWrapper.clearButton ||
                Input.appendSpan('e-input-group-icon ' + SPINNER_CLASS, this.inputWrapper.container, this.createElement)) :
                (this.inputWrapper.buttons[0] || this.inputWrapper.clearButton);
            addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            createSpinner({
                target: this.spinnerElement,
                width: Browser.isDevice ? '16px' : '14px'
            }, this.createElement);
            showSpinner(this.spinnerElement);
        }
    };
    /**
     * Hides the spinner loader.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.hideSpinner = function () {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS)) {
                detach(this.spinnerElement);
            }
            else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    };
    ComboBox.prototype.setAutoFill = function (activeElement, isHover) {
        if (!isHover) {
            this.setHoverList(activeElement);
        }
        if (this.autofill && !this.preventAutoFill) {
            var currentValue = this.getTextByValue(activeElement.getAttribute('data-value')).toString();
            var currentFillValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
            if (this.getModuleName() === 'combobox') {
                if (!this.isSelected && this.previousValue !== currentFillValue) {
                    this.updateSelectedItem(activeElement, null);
                    this.isSelected = true;
                    this.previousValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
                }
                else {
                    this.updateSelectedItem(activeElement, null, true);
                }
            }
            if (!this.isAndroidAutoFill(currentValue)) {
                this.setAutoFillSelection(currentValue);
            }
        }
    };
    ComboBox.prototype.isAndroidAutoFill = function (value) {
        if (Browser.isAndroid) {
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
    ComboBox.prototype.clearAll = function (e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            _super.prototype.clearAll.call(this, e);
            if (this.isServerBlazor && this.isFiltering() && this.isPopupOpen && e) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, true);
            }
        }
    };
    ComboBox.prototype.isSelectFocusItem = function (element) {
        return !isNullOrUndefined(element);
    };
    ComboBox.prototype.inlineSearch = function (e) {
        var isKeyNavigate = (e && (e.action === 'down' || e.action === 'up' ||
            e.action === 'home' || e.action === 'end' || e.action === 'pageUp' || e.action === 'pageDown'));
        var activeElement = isKeyNavigate ? this.liCollections[this.activeIndex] : this.getFocusElement();
        if (!isNullOrUndefined(activeElement)) {
            if (!isKeyNavigate) {
                var value = this.getFormattedValue(activeElement.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
                this.activeIndex = !isNullOrUndefined(this.activeIndex) ? this.activeIndex : null;
            }
            this.preventAutoFill = this.inputElement.value === '' ? false : this.preventAutoFill;
            this.setAutoFill(activeElement, isKeyNavigate);
        }
        else if (this.inputElement.value === '') {
            this.activeIndex = null;
            this.list.scrollTop = 0;
            var focusItem = this.list.querySelector('.' + dropDownListClasses.li);
            this.setHoverList(focusItem);
        }
        else {
            this.activeIndex = null;
            this.removeSelection();
            if (this.liCollections && this.liCollections.length < 0) {
                this.removeFocus();
            }
        }
    };
    ComboBox.prototype.incrementalSearch = function (e) {
        this.showPopup();
        if (!isNullOrUndefined(this.listData)) {
            this.inlineSearch(e);
            e.preventDefault();
        }
    };
    
    ComboBox.prototype.setAutoFillSelection = function (currentValue) {
        var selection = this.getSelectionPoints();
        var value = this.inputElement.value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            var inputValue = value + currentValue.substr(value.length, currentValue.length);
            Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(selection.start, this.inputElement.value.length);
        }
        else {
            Input.setValue(currentValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(0, this.inputElement.value.length);
        }
    };
    
    ComboBox.prototype.getValueByText = function (text) {
        return _super.prototype.getValueByText.call(this, text, true, this.ignoreAccent);
    };
    ComboBox.prototype.unWireEvent = function () {
        if (this.getModuleName() === 'combobox') {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.preventBlur);
            EventHandler.remove(this.inputWrapper.container, 'blur', this.onBlur);
        }
        if (!isNullOrUndefined(this.inputWrapper.buttons[0])) {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.dropDownClick);
        }
        EventHandler.remove(this.inputElement, 'focus', this.targetFocus);
        if (!this.readonly) {
            EventHandler.remove(this.inputElement, 'input', this.onInput);
            EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
            EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
            EventHandler.remove(this.inputElement, 'paste', this.pasteHandler);
        }
        this.unBindCommonEvent();
    };
    ComboBox.prototype.setSelection = function (li, e) {
        _super.prototype.setSelection.call(this, li, e);
        if (!isNullOrUndefined(li) && !this.autofill && !this.isDropDownClick) {
            this.removeFocus();
        }
    };
    ComboBox.prototype.selectCurrentItem = function (e) {
        var li;
        if (this.isPopupOpen) {
            li = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
        }
        if (e.action === 'enter' && this.inputElement.value.trim() === '') {
            this.clearAll(e);
        }
        else if (this.isTyped && !this.isSelected && isNullOrUndefined(li)) {
            this.customValue(e);
        }
        this.hidePopup();
    };
    ComboBox.prototype.setHoverList = function (li) {
        this.removeSelection();
        if (this.isValidLI(li) && !li.classList.contains(dropDownListClasses.selected)) {
            this.removeFocus();
            li.classList.add(dropDownListClasses.focus);
        }
    };
    
    ComboBox.prototype.targetFocus = function (e) {
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = false;
        }
        this.onFocus(e);
    };
    ComboBox.prototype.dropDownClick = function (e) {
        e.preventDefault();
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        _super.prototype.dropDownClick.call(this, e);
    };
    ComboBox.prototype.customValue = function (e) {
        var _this = this;
        var value = this.getValueByText(this.inputElement.value);
        if (!this.allowCustom && this.inputElement.value !== '') {
            var previousValue = this.previousValue;
            var currentValue = this.value;
            this.setProperties({ value: value });
            if (isNullOrUndefined(this.value)) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            }
            if (this.autofill && previousValue === this.value && currentValue !== this.value) {
                this.onChangeEvent(null);
            }
        }
        else if (this.inputElement.value.trim() !== '') {
            var previousValue_1 = this.value;
            if (isNullOrUndefined(value)) {
                var value_1 = this.inputElement.value === '' ? null : this.inputElement.value;
                var eventArgs = void 0;
                eventArgs = { text: value_1, item: {} };
                if (!this.initial) {
                    this.trigger('customValueSpecifier', eventArgs, function (eventArgs) {
                        _this.updateCustomValueCallback(value_1, eventArgs, previousValue_1, e);
                    });
                }
                else {
                    this.updateCustomValueCallback(value_1, eventArgs, previousValue_1);
                }
            }
            else {
                this.isSelectCustom = false;
                this.setProperties({ value: value });
                if (previousValue_1 !== this.value) {
                    this.onChangeEvent(e);
                }
            }
        }
        else if (this.allowCustom) {
            this.isSelectCustom = true;
        }
    };
    ComboBox.prototype.updateCustomValueCallback = function (value, eventArgs, previousValue, e) {
        var fields = this.fields;
        var item = eventArgs.item;
        var dataItem = {};
        if (item && getValue(fields.text, item) && getValue(fields.value, item)) {
            dataItem = item;
        }
        else {
            setValue(fields.text, value, dataItem);
            setValue(fields.value, value, dataItem);
        }
        this.itemData = dataItem;
        var changeData = {
            text: getValue(fields.text, this.itemData),
            value: getValue(fields.value, this.itemData),
            index: null
        };
        this.setProperties(changeData, true);
        this.setSelection(null, null);
        this.isSelectCustom = true;
        if (previousValue !== this.value) {
            this.onChangeEvent(e);
        }
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    ComboBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'combobox') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    if (this.readonly) {
                        EventHandler.remove(this.inputElement, 'input', this.onInput);
                        EventHandler.remove(this.inputElement, 'keyup', this.onFilterUp);
                        EventHandler.remove(this.inputElement, 'keydown', this.onFilterDown);
                    }
                    else {
                        EventHandler.add(this.inputElement, 'input', this.onInput, this);
                        EventHandler.add(this.inputElement, 'keyup', this.onFilterUp, this);
                        EventHandler.add(this.inputElement, 'keydown', this.onFilterDown, this);
                    }
                    break;
                case 'allowFiltering':
                    this.setSearchBox();
                    if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
                        _super.prototype.renderList.call(this);
                    }
                    break;
                case 'allowCustom':
                    break;
                default:
                    var comboProps = void 0;
                    comboProps = this.getPropObject(prop, newProp, oldProp);
                    _super.prototype.onPropertyChanged.call(this, comboProps.newProperty, comboProps.oldProperty);
                    break;
            }
        }
    };
    /**
     * To initialize the control rendering.
     * @private
     */
    ComboBox.prototype.render = function () {
        _super.prototype.render.call(this);
        this.setSearchBox();
        if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
            _super.prototype.renderList.call(this);
        }
        this.renderComplete();
    };
    
    /**
     * Return the module name of this component.
     * @private
     */
    ComboBox.prototype.getModuleName = function () {
        return 'combobox';
    };
    /**
     * Adds a new item to the combobox popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @deprecated
     */
    ComboBox.prototype.addItem = function (items, itemIndex) {
        _super.prototype.addItem.call(this, items, itemIndex);
    };
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    ComboBox.prototype.filter = function (dataSource, query, fields) {
        _super.prototype.filter.call(this, dataSource, query, fields);
    };
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.showPopup = function () {
        _super.prototype.showPopup.call(this);
    };
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.hidePopup = function (e) {
        var inputValue = this.inputElement.value === '' ? null : this.inputElement.value;
        if (!isNullOrUndefined(this.listData)) {
            var isEscape = this.isEscapeKey;
            if (this.isEscapeKey) {
                Input.setValue(this.typedString, this.inputElement, this.floatLabelType, this.showClearButton);
                this.isEscapeKey = false;
            }
            if (this.autofill) {
                this.removeFillSelection();
            }
            var dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
            var selected = this.list.querySelector('.' + dropDownListClasses.selected);
            if (dataItem.text === this.inputElement.value && !isNullOrUndefined(selected)) {
                if (this.isSelected) {
                    this.onChangeEvent(e);
                    this.isSelectCustom = false;
                }
                _super.prototype.hidePopup.call(this, e);
                return;
            }
            if (this.getModuleName() === 'combobox' && this.inputElement.value.trim() !== '') {
                var searchItem = Search(this.inputElement.value, this.liCollections, 'Equal', true);
                this.selectedLI = searchItem.item;
                if (isNullOrUndefined(searchItem.index)) {
                    searchItem.index = Search(this.inputElement.value, this.liCollections, 'StartsWith', true).index;
                }
                this.activeIndex = searchItem.index;
                if (!isNullOrUndefined(this.selectedLI)) {
                    this.updateSelectedItem(this.selectedLI, null, true);
                }
                else if (isEscape) {
                    this.isSelectCustom = true;
                    this.removeSelection();
                }
            }
            if (!this.isEscapeKey && this.isTyped && !this.isInteracted) {
                this.customValue(e);
            }
        }
        if (isNullOrUndefined(this.listData) && this.allowCustom && !isNullOrUndefined(inputValue) && inputValue !== this.value) {
            this.customValue();
        }
        _super.prototype.hidePopup.call(this, e);
    };
    /**
     * Sets the focus to the component for interaction.
     * @returns void.
     */
    ComboBox.prototype.focusIn = function () {
        if (!this.enabled) {
            return;
        }
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        _super.prototype.focusIn.call(this);
    };
    /**
     * Allows you to clear the selected values from the component.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.clear = function () {
        this.value = null;
    };
    /**
     * Moves the focus from the component if the component is already focused.
     * @returns void.
     * @deprecated
     */
    ComboBox.prototype.focusOut = function (e) {
        _super.prototype.focusOut.call(this, e);
    };
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     * @deprecated
     */
    ComboBox.prototype.getItems = function () {
        return _super.prototype.getItems.call(this);
    };
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     * @deprecated
     */
    ComboBox.prototype.getDataByValue = function (value) {
        return _super.prototype.getDataByValue.call(this, value);
    };
    ComboBox.prototype.renderHightSearch = function () {
        // update high light search 
    };
    __decorate$3([
        Property(false)
    ], ComboBox.prototype, "autofill", void 0);
    __decorate$3([
        Property(true)
    ], ComboBox.prototype, "allowCustom", void 0);
    __decorate$3([
        Property({})
    ], ComboBox.prototype, "htmlAttributes", void 0);
    __decorate$3([
        Property(false)
    ], ComboBox.prototype, "allowFiltering", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "query", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "index", void 0);
    __decorate$3([
        Property(true)
    ], ComboBox.prototype, "showClearButton", void 0);
    __decorate$3([
        Property(false)
    ], ComboBox.prototype, "enableRtl", void 0);
    __decorate$3([
        Event()
    ], ComboBox.prototype, "customValueSpecifier", void 0);
    __decorate$3([
        Event()
    ], ComboBox.prototype, "filtering", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "valueTemplate", void 0);
    __decorate$3([
        Property('Never')
    ], ComboBox.prototype, "floatLabelType", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "filterBarPlaceholder", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "cssClass", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "headerTemplate", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "footerTemplate", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "placeholder", void 0);
    __decorate$3([
        Property('100%')
    ], ComboBox.prototype, "width", void 0);
    __decorate$3([
        Property('300px')
    ], ComboBox.prototype, "popupHeight", void 0);
    __decorate$3([
        Property('100%')
    ], ComboBox.prototype, "popupWidth", void 0);
    __decorate$3([
        Property(false)
    ], ComboBox.prototype, "readonly", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "text", void 0);
    __decorate$3([
        Property(null)
    ], ComboBox.prototype, "value", void 0);
    ComboBox = __decorate$3([
        NotifyPropertyChanges
    ], ComboBox);
    return ComboBox;
}(DropDownList));

/**
 * export all modules from current location
 */

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../combo-box/combo-box-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
dropDownListClasses.root = 'e-autocomplete';
dropDownListClasses.icon = 'e-input-group-icon e-ddl-icon e-search-icon';
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
var AutoComplete = /** @__PURE__ @class */ (function (_super) {
    __extends$4(AutoComplete, _super);
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
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        var filterType = (this.queryString === '' && !isNullOrUndefined(this.value)) ? 'equal' : this.filterType;
        var queryString = (this.queryString === '' && !isNullOrUndefined(this.value)) ? this.value : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null) {
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var mapping = !isNullOrUndefined(this.fields.value) ? this.fields.value : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
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
            if (isNullOrUndefined(this.list)) {
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
    };
    AutoComplete.prototype.clearAll = function (e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            _super.prototype.clearAll.call(this, e);
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    };
    AutoComplete.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        this.fixedHeaderElement = null;
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        var item = this.list.querySelector('.' + dropDownListClasses.li);
        if (!isNullOrUndefined(item)) {
            removeClass([item], dropDownListClasses.focus);
        }
        this.postBackAction();
    };
    AutoComplete.prototype.postBackAction = function () {
        if (this.autofill && !isNullOrUndefined(this.liCollections[0])) {
            var items = [this.liCollections[0]];
            var searchItem = Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase);
            if (!isNullOrUndefined(searchItem.item)) {
                _super.prototype.setAutoFill.call(this, this.liCollections[0], true);
            }
        }
    };
    AutoComplete.prototype.setSelection = function (li, e) {
        if (!this.isValidLI(li)) {
            return;
        }
        if (!isNullOrUndefined(e) && e.type === 'keydown' && e.action !== 'enter'
            && e.action !== 'tab' && this.isValidLI(li)) {
            var value = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            if (this.isServerBlazor) {
                this.removeHover();
            }
            this.setHoverList(li);
            this.selectedLI = li;
            this.setScrollPosition(e);
            if (this.autofill) {
                this.preventAutoFill = false;
                _super.prototype.setAutoFill.call(this, li);
            }
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        }
        else {
            _super.prototype.setSelection.call(this, li, e);
        }
    };
    AutoComplete.prototype.listOption = function (dataSource, fieldsSettings) {
        var _this = this;
        var fields = _super.prototype.listOption.call(this, dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    if (_this.element.tagName === _this.getNgDirective() && _this.itemTemplate) {
                        setTimeout(function () { highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType); }, 0);
                    }
                    else {
                        highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                    }
                }
            };
        }
        else {
            var itemCreated_1 = fields.itemCreated;
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
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
        if (isNullOrUndefined(this.list) || this.isServerBlazor) {
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
                            var button = Input.appendSpan(dropDownListClasses.icon, this.inputWrapper.container, this.createElement);
                            this.inputWrapper.buttons[0] = button;
                        }
                        else if (this.inputWrapper && this.inputWrapper.container) {
                            var button = this.inputWrapper.container.querySelector('.e-input-group-icon.e-ddl-icon');
                            this.inputWrapper.buttons[0] = button;
                        }
                        if (this.inputWrapper && this.inputWrapper.buttons && this.inputWrapper.buttons[0]) {
                            EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                        }
                    }
                    else if (!this.isServerBlazor) {
                        detach(this.inputWrapper.buttons[0]);
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
                    highlightSearch(this.liCollections[i], this.queryString, this.ignoreCase, this.filterType, this.isServerBlazor);
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
    
    __decorate$4([
        Complex({ value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], AutoComplete.prototype, "fields", void 0);
    __decorate$4([
        Property(true)
    ], AutoComplete.prototype, "ignoreCase", void 0);
    __decorate$4([
        Property(false)
    ], AutoComplete.prototype, "showPopupButton", void 0);
    __decorate$4([
        Property(false)
    ], AutoComplete.prototype, "highlight", void 0);
    __decorate$4([
        Property(20)
    ], AutoComplete.prototype, "suggestionCount", void 0);
    __decorate$4([
        Property({})
    ], AutoComplete.prototype, "htmlAttributes", void 0);
    __decorate$4([
        Property(null)
    ], AutoComplete.prototype, "query", void 0);
    __decorate$4([
        Property(1)
    ], AutoComplete.prototype, "minLength", void 0);
    __decorate$4([
        Property('Contains')
    ], AutoComplete.prototype, "filterType", void 0);
    __decorate$4([
        Event()
    ], AutoComplete.prototype, "filtering", void 0);
    __decorate$4([
        Property(null)
    ], AutoComplete.prototype, "index", void 0);
    __decorate$4([
        Property('Never')
    ], AutoComplete.prototype, "floatLabelType", void 0);
    __decorate$4([
        Property(null)
    ], AutoComplete.prototype, "valueTemplate", void 0);
    __decorate$4([
        Property(null)
    ], AutoComplete.prototype, "filterBarPlaceholder", void 0);
    __decorate$4([
        Property(false)
    ], AutoComplete.prototype, "allowFiltering", void 0);
    __decorate$4([
        Property(null)
    ], AutoComplete.prototype, "text", void 0);
    AutoComplete = __decorate$4([
        NotifyPropertyChanges
    ], AutoComplete);
    return AutoComplete;
}(ComboBox));

/**
 * export all modules from current location
 */

/**
 * FloatLable Moduel
 * Specifies whether to display the floating label above the input element.
 */
var FLOATLINE = 'e-float-line';
var FLOATTEXT = 'e-float-text';
var LABELTOP = 'e-label-top';
var LABELBOTTOM = 'e-label-bottom';
/**
 * Function to create Float Label element.
 * @param overAllWrapper - overall wrapper of multiselect.
 * @param element - the given html element.
 * @param inputElement - specify the input wrapper.
 * @param value - Value of the MultiSelect.
 * @param floatLabelType - Specify the FloatLabel Type.
 * @param placeholder - Specify the PlaceHolder text.
 */
function createFloatLabel(overAllWrapper, searchWrapper, element, inputElement, value, floatLabelType, placeholder) {
    var floatLinelement;
    var floatLabelElement;
    floatLinelement = createElement('span', { className: FLOATLINE });
    floatLabelElement = createElement('label', { className: FLOATTEXT });
    if (!isNullOrUndefined(element.id) && element.id !== '') {
        floatLabelElement.id = 'label_' + element.id.replace(/ /g, '_');
        attributes(element, { 'aria-labelledby': floatLabelElement.id });
    }
    if (!isNullOrUndefined(inputElement.placeholder) && inputElement.placeholder !== '') {
        floatLabelElement.innerHTML = inputElement.placeholder;
        inputElement.removeAttribute('placeholder');
    }
    floatLabelElement.innerHTML = placeholder;
    searchWrapper.appendChild(floatLinelement);
    searchWrapper.appendChild(floatLabelElement);
    overAllWrapper.classList.add('e-float-input');
    updateFloatLabelState(value, floatLabelElement);
    if (floatLabelType === 'Always') {
        if (floatLabelElement.classList.contains(LABELBOTTOM)) {
            removeClass([floatLabelElement], LABELBOTTOM);
        }
        addClass([floatLabelElement], LABELTOP);
    }
}
/**
 * Function to update status of the Float Label element.
 * @param value - Value of the MultiSelect.
 * @param label - float label element.
 */
function updateFloatLabelState(value, label) {
    if (value && value.length > 0) {
        addClass([label], LABELTOP);
        removeClass([label], LABELBOTTOM);
    }
    else {
        removeClass([label], LABELTOP);
        addClass([label], LABELBOTTOM);
    }
}
/**
 * Function to remove Float Label element.
 * @param overAllWrapper - overall wrapper of multiselect.
 * @param componentWrapper - wrapper element of multiselect.
 * @param searchWrapper - search wrapper of multiselect.
 * @param inputElement - specify the input wrapper.
 * @param value - Value of the MultiSelect.
 * @param floatLabelType - Specify the FloatLabel Type.
 * @param placeholder - Specify the PlaceHolder text.
 */
function removeFloating(overAllWrapper, componentWrapper, searchWrapper, inputElement, value, floatLabelType, placeholder) {
    var placeholderElement = componentWrapper.querySelector('.' + FLOATTEXT);
    var floatLine = componentWrapper.querySelector('.' + FLOATLINE);
    var placeholderText;
    if (!isNullOrUndefined(placeholderElement)) {
        placeholderText = placeholderElement.innerText;
        detach(searchWrapper.querySelector('.' + FLOATTEXT));
        setPlaceHolder(value, inputElement, placeholderText);
        if (!isNullOrUndefined(floatLine)) {
            detach(searchWrapper.querySelector('.' + FLOATLINE));
        }
    }
    else {
        placeholderText = (placeholder !== null) ? placeholder : '';
        setPlaceHolder(value, inputElement, placeholderText);
    }
    overAllWrapper.classList.remove('e-float-input');
}
/**
 * Function to set the placeholder to the element.
 * @param value - Value of the MultiSelect.
 * @param inputElement - specify the input wrapper.
 * @param placeholder - Specify the PlaceHolder text.
 */
function setPlaceHolder(value, inputElement, placeholder) {
    if (value && value.length) {
        inputElement.placeholder = '';
    }
    else {
        inputElement.placeholder = placeholder;
    }
}
/**
 * Function for focusing the Float Element.
 * @param overAllWrapper - overall wrapper of multiselect.
 * @param componentWrapper - wrapper element of multiselect.
 */
function floatLabelFocus(overAllWrapper, componentWrapper) {
    overAllWrapper.classList.add('e-input-focus');
    var label = componentWrapper.querySelector('.' + FLOATTEXT);
    if (!isNullOrUndefined(label)) {
        addClass([label], LABELTOP);
        if (label.classList.contains(LABELBOTTOM)) {
            removeClass([label], LABELBOTTOM);
        }
    }
}
/**
 * Function to focus the Float Label element.
 * @param overAllWrapper - overall wrapper of multiselect.
 * @param componentWrapper - wrapper element of multiselect.
 * @param value - Value of the MultiSelect.
 * @param floatLabelType - Specify the FloatLabel Type.
 * @param placeholder - Specify the PlaceHolder text.
 */
function floatLabelBlur(overAllWrapper, componentWrapper, value, floatLabelType, placeholder) {
    overAllWrapper.classList.remove('e-input-focus');
    var label = componentWrapper.querySelector('.' + FLOATTEXT);
    if (value && value.length <= 0 && floatLabelType === 'Auto' && !isNullOrUndefined(label)) {
        if (label.classList.contains(LABELTOP)) {
            removeClass([label], LABELTOP);
        }
        addClass([label], LABELBOTTOM);
    }
}

var __extends$5 = (undefined && undefined.__extends) || (function () {
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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
var FOCUS = 'e-input-focus';
var DISABLED$1 = 'e-disabled';
var OVER_ALL_WRAPPER = 'e-multiselect e-input-group e-control-wrapper';
var ELEMENT_WRAPPER = 'e-multi-select-wrapper';
var ELEMENT_MOBILE_WRAPPER = 'e-mob-wrapper';
var HIDE_LIST = 'e-hide-listitem';
var DELIMITER_VIEW = 'e-delim-view';
var CHIP_WRAPPER$1 = 'e-chips-collection';
var CHIP$1 = 'e-chips';
var CHIP_CONTENT$1 = 'e-chipcontent';
var CHIP_CLOSE$1 = 'e-chips-close';
var CHIP_SELECTED = 'e-chip-selected';
var SEARCHBOX_WRAPPER = 'e-searcher';
var DELIMITER_VIEW_WRAPPER = 'e-delimiter';
var ZERO_SIZE = 'e-zero-size';
var REMAIN_WRAPPER = 'e-remain';
var CLOSEICON_CLASS$1 = 'e-chips-close e-close-hooker';
var DELIMITER_WRAPPER = 'e-delim-values';
var POPUP_WRAPPER = 'e-ddl e-popup e-multi-select-list-wrapper';
var INPUT_ELEMENT = 'e-dropdownbase';
var RTL_CLASS = 'e-rtl';
var CLOSE_ICON_HIDE = 'e-close-icon-hide';
var MOBILE_CHIP = 'e-mob-chip';
var FOOTER$1 = 'e-ddl-footer';
var HEADER$1 = 'e-ddl-header';
var DISABLE_ICON = 'e-ddl-disable-icon';
var SPINNER_CLASS$1 = 'e-ms-spinner-icon';
var HIDDEN_ELEMENT = 'e-multi-hidden';
var destroy = 'destroy';
var dropdownIcon = 'e-input-group-icon e-ddl-icon';
var iconAnimation = 'e-icon-anim';
var TOTAL_COUNT_WRAPPER = 'e-delim-total';
var BOX_ELEMENT = 'e-multiselect-box';
var FILTERPARENT = 'e-filter-parent';
var CUSTOM_WIDTH = 'e-search-custom-width';
/**
 * The Multiselect allows the user to pick a more than one value from list of predefined values.
 * ```html
 * <select id="list">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var multiselectObj = new Multiselect();
 *   multiselectObj.appendTo("#list");
 * </script>
 * ```
 */
var MultiSelect = /** @__PURE__ @class */ (function (_super) {
    __extends$5(MultiSelect, _super);
    /**
     * Constructor for creating the DropDownList widget.
     */
    function MultiSelect(option, element) {
        var _this = _super.call(this, option, element) || this;
        _this.isValidKey = false;
        _this.selectAllEventData = [];
        _this.selectAllEventEle = [];
        _this.isDynamicDataChange = false;
        _this.scrollFocusStatus = false;
        _this.keyDownStatus = false;
        return _this;
    }
    
    MultiSelect.prototype.enableRTL = function (state) {
        if (state) {
            this.overAllWrapper.classList.add(RTL_CLASS);
        }
        else {
            this.overAllWrapper.classList.remove(RTL_CLASS);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
    };
    MultiSelect.prototype.requiredModules = function () {
        var modules = [];
        if (this.mode === 'CheckBox') {
            this.isGroupChecking = this.enableGroupCheckBox;
            if (this.enableGroupCheckBox) {
                var prevOnChange = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                this.enableSelectionOrder = false;
                this.isProtectedOnChange = prevOnChange;
            }
            this.allowCustomValue = false;
            this.hideSelectedItem = false;
            this.closePopupOnSelect = false;
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    };
    MultiSelect.prototype.updateHTMLAttribute = function () {
        if (Object.keys(this.htmlAttributes).length) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var htmlAttr = _a[_i];
                switch (htmlAttr) {
                    case 'class':
                        var updatedClassValue = (this.htmlAttributes[htmlAttr].replace(/\s+/g, ' ')).trim();
                        if (updatedClassValue !== '') {
                            addClass([this.overAllWrapper], updatedClassValue.split(' '));
                            addClass([this.popupWrapper], updatedClassValue.split(' '));
                        }
                        break;
                    case 'disabled':
                        this.enable(false);
                        break;
                    case 'placeholder':
                        if (!this.placeholder) {
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                            this.setProperties({ placeholder: this.inputElement.placeholder }, true);
                            this.refreshPlaceHolder();
                        }
                        break;
                    default:
                        var defaultAttr = ['id'];
                        var validateAttr = ['name', 'required', 'aria-required', 'form'];
                        var containerAttr = ['title', 'role', 'style', 'class'];
                        if (defaultAttr.indexOf(htmlAttr) > -1) {
                            this.element.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        else if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                            this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        else if (containerAttr.indexOf(htmlAttr) > -1) {
                            this.overAllWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        else {
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                        }
                        break;
                }
            }
        }
    };
    MultiSelect.prototype.updateReadonly = function (state) {
        if (state || this.mode === 'CheckBox') {
            this.inputElement.setAttribute('readonly', 'true');
        }
        else {
            this.inputElement.removeAttribute('readonly');
        }
    };
    MultiSelect.prototype.updateClearButton = function (state) {
        if (state) {
            if (this.overAllClear.parentNode) {
                this.overAllClear.style.display = '';
            }
            else {
                this.componentWrapper.appendChild(this.overAllClear);
            }
            this.componentWrapper.classList.remove(CLOSE_ICON_HIDE);
        }
        else {
            this.overAllClear.style.display = 'none';
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
    };
    MultiSelect.prototype.updateCssClass = function () {
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            var updatedCssClassValues = this.cssClass;
            updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
            if (updatedCssClassValues !== '') {
                addClass([this.overAllWrapper], updatedCssClassValues.split(' '));
                addClass([this.popupWrapper], updatedCssClassValues.split(' '));
            }
        }
    };
    MultiSelect.prototype.updateOldPropCssClass = function (oldClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
            if (oldClass !== '') {
                removeClass([this.overAllWrapper], oldClass.split(' '));
                removeClass([this.popupWrapper], oldClass.split(' '));
            }
        }
    };
    MultiSelect.prototype.onPopupShown = function () {
        var _this = this;
        if (Browser.isDevice && (this.mode === 'CheckBox' && this.allowFiltering)) {
            var proxy_1 = this;
            window.onpopstate = function () {
                proxy_1.hidePopup();
                proxy_1.inputElement.focus();
            };
            history.pushState({}, '');
        }
        var animModel = { name: 'FadeIn', duration: 100 };
        var eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('open', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel) {
                _this.focusAtFirstListItem();
                document.body.appendChild(_this.popupObj.element);
                if (_this.mode === 'CheckBox' && _this.enableGroupCheckBox && !isNullOrUndefined(_this.fields.groupBy)) {
                    _this.updateListItems(_this.list.querySelectorAll('li.e-list-item'), _this.mainList.querySelectorAll('li.e-list-item'));
                }
                if (_this.mode === 'CheckBox' || _this.showDropDownIcon) {
                    addClass([_this.overAllWrapper], [iconAnimation]);
                }
                _this.refreshPopup();
                _this.popupObj.show(eventArgs.animation, (_this.zIndex === 1000) ? _this.element : null);
                attributes(_this.inputElement, { 'aria-expanded': 'true' });
                if (_this.isFirstClick) {
                    _this.loadTemplate();
                }
            }
        });
    };
    MultiSelect.prototype.updateListItems = function (listItems, mainListItems) {
        for (var i = 0; i < listItems.length; i++) {
            this.findGroupStart(listItems[i]);
            this.findGroupStart(mainListItems[i]);
        }
        this.deselectHeader();
    };
    MultiSelect.prototype.loadTemplate = function () {
        this.refreshListItems(null);
        if (this.mode === 'CheckBox') {
            this.removeFocus();
        }
        this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
    };
    MultiSelect.prototype.setScrollPosition = function () {
        if (((!this.hideSelectedItem && this.mode !== 'CheckBox') || (this.mode === 'CheckBox' && !this.enableSelectionOrder)) &&
            (!isNullOrUndefined(this.value) && (this.value.length > 0))) {
            var valueEle = this.findListElement((this.hideSelectedItem ? this.ulElement : this.list), 'li', 'data-value', this.value[this.value.length - 1]);
            if (!isNullOrUndefined(valueEle)) {
                this.scrollBottom(valueEle);
            }
        }
    };
    MultiSelect.prototype.focusAtFirstListItem = function () {
        if (this.ulElement && this.ulElement.querySelector('li.'
            + dropDownBaseClasses.li)) {
            var element = void 0;
            if (this.mode === 'CheckBox') {
                this.removeFocus();
                return;
            }
            else {
                element = this.ulElement.querySelector('li.'
                    + dropDownBaseClasses.li + ':not(.'
                    + HIDE_LIST + ')');
            }
            if (element !== null) {
                this.removeFocus();
                this.addListFocus(element);
            }
        }
    };
    MultiSelect.prototype.focusAtLastListItem = function (data) {
        var activeElement;
        if (data) {
            activeElement = Search(data, this.liCollections, 'StartsWith', this.ignoreCase);
        }
        else {
            if (this.value && this.value.length) {
                Search(this.value[this.value.length - 1], this.liCollections, 'StartsWith', this.ignoreCase);
            }
            else {
                activeElement = null;
            }
        }
        if (activeElement && activeElement.item !== null) {
            this.addListFocus(activeElement.item);
            this.scrollBottom(activeElement.item, activeElement.index);
        }
    };
    MultiSelect.prototype.getAriaAttributes = function () {
        var ariaAttributes = {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-multiselectable': 'true',
            'aria-activedescendant': 'null',
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
        };
        return ariaAttributes;
    };
    MultiSelect.prototype.updateListARIA = function () {
        attributes(this.ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
        var disableStatus = (this.inputElement.disabled) ? true : false;
        attributes(this.inputElement, this.getAriaAttributes());
        if (disableStatus) {
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
        this.ensureAriaDisabled((disableStatus) ? 'true' : 'false');
    };
    MultiSelect.prototype.ensureAriaDisabled = function (status) {
        if (this.htmlAttributes && this.htmlAttributes['aria-disabled']) {
            var attr = this.htmlAttributes;
            extend(attr, { 'aria-disabled': status }, attr);
            this.setProperties({ htmlAttributes: attr }, true);
        }
    };
    MultiSelect.prototype.removelastSelection = function (e) {
        var elements;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP$1);
        var value = elements[elements.length - 1].getAttribute('data-value');
        if (!isNullOrUndefined(this.value)) {
            this.tempValues = this.value.slice();
        }
        this.removeValue(value, e);
        this.removeChipSelection();
        this.updateDelimeter(this.delimiterChar, e);
        this.makeTextBoxEmpty();
        if (this.mainList && this.listData) {
            this.refreshSelection();
        }
        this.checkPlaceholderSize();
    };
    MultiSelect.prototype.onActionFailure = function (e) {
        _super.prototype.onActionFailure.call(this, e);
        this.renderPopup();
        this.onPopupShown();
    };
    MultiSelect.prototype.targetElement = function () {
        this.targetInputElement = this.inputElement;
        if (this.mode === 'CheckBox' && this.allowFiltering) {
            this.notify('targetElement', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
        }
        return this.targetInputElement.value;
    };
    MultiSelect.prototype.getForQuery = function (valuecheck) {
        var predicate;
        var field = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
        for (var i = 0; i < valuecheck.length; i++) {
            if (i === 0) {
                predicate = new Predicate(field, 'equal', valuecheck[i]);
            }
            else {
                predicate = predicate.or(field, 'equal', valuecheck[i]);
            }
        }
        return this.getQuery(this.query).where(predicate);
    };
    MultiSelect.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        this.updateSelectElementData(this.allowFiltering);
        var proxy = this;
        var valuecheck = [];
        if (isBlazor() && this.isServerRendered && this.isDynamicDataChange && this.value !== null && this.value.length > 0) {
            var items = [];
            for (var k = 0; k < this.value.length; k++) {
                var itemsData = this.getDataByValue(this.value[k]);
                if (itemsData) {
                    // tslint:disable-next-line
                    items.push(itemsData[this.fields.value]); // remove the condition for hybrid
                }
            }
            if (items.length === 0) {
                this.setProperties({ 'value': null });
            }
        }
        if (!isNullOrUndefined(this.value) && !this.allowCustomValue) {
            for (var i = 0; i < this.value.length; i++) {
                var checkEle = this.findListElement(((this.allowFiltering && !isNullOrUndefined(this.mainList)) ? this.mainList : ulElement), 'li', 'data-value', proxy.value[i]);
                if (!checkEle) {
                    valuecheck.push(proxy.value[i]);
                }
            }
        }
        if (valuecheck.length > 0 && this.dataSource instanceof DataManager && !isNullOrUndefined(this.value)) {
            this.dataSource.executeQuery(this.getForQuery(valuecheck)).then(function (e) {
                proxy.addItem(e.result, list.length);
                proxy.updateActionList(ulElement, list, e);
            });
        }
        else {
            this.updateActionList(ulElement, list, e);
        }
        if (isBlazor() && this.isServerRendered && this.isDynamicDataChange && this.value && this.value.length > 0) {
            this.updateVal(this.value, null, 'value');
            this.addValidInputClass();
            this.isDynamicDataChange = false;
        }
    };
    MultiSelect.prototype.updateActionList = function (ulElement, list, e, isUpdated) {
        if (this.mode === 'CheckBox' && this.showSelectAll) {
            this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
        }
        if (!this.mainList && !this.mainData) {
            this.mainList = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
            this.mainData = list;
            this.mainListCollection = this.liCollections;
        }
        else if (!isNullOrUndefined(this.mainData) && this.mainData.length === 0) {
            this.mainData = list;
        }
        if ((this.remoteCustomValue || list.length <= 0) && this.allowCustomValue && this.inputFocus && this.allowFiltering) {
            this.checkForCustomValue(this.tempQuery, this.fields);
            return;
        }
        if (this.value && this.value.length && ((this.mode !== 'CheckBox' && this.inputElement.value !== '') ||
            this.mode === 'CheckBox')) {
            this.refreshSelection();
        }
        this.updateListARIA();
        this.unwireListEvents();
        this.wireListEvents();
        if (!isNullOrUndefined(this.setInitialValue)) {
            this.setInitialValue();
        }
        if (!isNullOrUndefined(this.selectAllAction)) {
            this.selectAllAction();
        }
        if (this.setDynValue) {
            if (!isNullOrUndefined(this.text) && (isNullOrUndefined(this.value) || this.value.length === 0)) {
                this.initialTextUpdate();
            }
            this.initialValueUpdate();
            this.initialUpdate();
            this.refreshPlaceHolder();
            if (this.mode !== 'CheckBox' && this.changeOnBlur) {
                this.updateValueState(null, this.value, null);
            }
        }
        this.renderPopup();
        if (this.beforePopupOpen) {
            this.beforePopupOpen = false;
            this.onPopupShown();
        }
    };
    MultiSelect.prototype.refreshSelection = function () {
        var value;
        var element;
        var className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (!isNullOrUndefined(this.value)) {
            for (var index = 0; !isNullOrUndefined(this.value[index]); index++) {
                value = this.value[index];
                element = this.findListElement(this.list, 'li', 'data-value', value);
                if (element) {
                    addClass([element], className);
                    if (this.hideSelectedItem && element.previousSibling
                        && element.previousElementSibling.classList.contains(dropDownBaseClasses.group)
                        && (!element.nextElementSibling ||
                            element.nextElementSibling.classList.contains(dropDownBaseClasses.group))) {
                        addClass([element.previousElementSibling], className);
                    }
                    if (this.hideSelectedItem && this.fields.groupBy && !element.previousElementSibling.classList.contains(HIDE_LIST)) {
                        this.hideGroupItem(value);
                    }
                    if (this.hideSelectedItem && element.classList.contains(dropDownBaseClasses.focus)) {
                        removeClass([element], dropDownBaseClasses.focus);
                        var listEle = element.parentElement.querySelectorAll('.' +
                            dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')');
                        if (listEle.length > 0) {
                            addClass([listEle[0]], dropDownBaseClasses.focus);
                        }
                        else {
                            this.ulElement = this.ulElement.cloneNode ? this.ulElement.cloneNode(true) : this.ulElement;
                            this.l10nUpdate();
                            addClass([this.list], dropDownBaseClasses.noData);
                        }
                    }
                    element.setAttribute('aria-selected', 'true');
                    if (this.mode === 'CheckBox' && element.classList.contains('e-active')) {
                        var ariaValue = element.firstElementChild.getAttribute('aria-checked');
                        if (isNullOrUndefined(ariaValue) || ariaValue === 'false') {
                            var args = {
                                module: 'CheckBoxSelection',
                                enable: this.mode === 'CheckBox',
                                li: element,
                                e: null
                            };
                            this.notify('updatelist', args);
                        }
                    }
                }
            }
        }
        this.checkSelectAll();
        this.checkMaxSelection();
    };
    MultiSelect.prototype.hideGroupItem = function (value) {
        var element;
        var element1;
        var className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        element1 = element = this.findListElement(this.ulElement, 'li', 'data-value', value);
        var i = 0;
        var j = 0;
        var temp = true;
        var temp1 = true;
        do {
            if (element && element.previousElementSibling
                && (!element.previousElementSibling.classList.contains(HIDE_LIST) &&
                    element.previousElementSibling.classList.contains(dropDownBaseClasses.li))) {
                temp = false;
            }
            if (!temp || !element || (element.previousElementSibling
                && element.previousElementSibling.classList.contains(dropDownBaseClasses.group))) {
                i = 10;
            }
            else {
                element = element.previousElementSibling;
            }
            if (element1 && element1.nextElementSibling
                && (!element1.nextElementSibling.classList.contains(HIDE_LIST) &&
                    element1.nextElementSibling.classList.contains(dropDownBaseClasses.li))) {
                temp1 = false;
            }
            if (!temp1 || !element1 || (element1.nextElementSibling
                && element1.nextElementSibling.classList.contains(dropDownBaseClasses.group))) {
                j = 10;
            }
            else {
                element1 = element1.nextElementSibling;
            }
        } while (i < 10 || j < 10);
        if (temp && temp1 && !element.previousElementSibling.classList.contains(HIDE_LIST)) {
            addClass([element.previousElementSibling], className);
        }
        else if (temp && temp1 && element.previousElementSibling.classList.contains(HIDE_LIST)) {
            removeClass([element.previousElementSibling], className);
        }
    };
    MultiSelect.prototype.checkSelectAll = function () {
        var groupItemLength = this.list.querySelectorAll('li.e-list-group-item.e-active').length;
        var listItem = this.list.querySelectorAll('li.e-list-item');
        var searchCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        var searchActiveCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.selected).length;
        if (this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
            searchActiveCount = searchActiveCount - groupItemLength;
        }
        if ((searchCount === searchActiveCount || searchActiveCount === this.maximumSelectionLength)
            && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'check' });
        }
        else if ((searchCount !== searchActiveCount) && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
        }
        if (this.enableGroupCheckBox && this.fields.groupBy && !this.enableSelectionOrder) {
            for (var i = 0; i < listItem.length; i++) {
                this.findGroupStart(listItem[i]);
            }
            this.deselectHeader();
        }
    };
    MultiSelect.prototype.openClick = function (e) {
        if (!this.openOnClick && this.mode !== 'CheckBox') {
            if (this.targetElement() !== '') {
                this.showPopup();
            }
            else {
                this.hidePopup();
            }
        }
        else if (!this.openOnClick && this.mode === 'CheckBox' && !this.isPopupOpen()) {
            this.showPopup();
        }
    };
    MultiSelect.prototype.KeyUp = function (e) {
        if (this.mode === 'CheckBox' && !this.openOnClick) {
            var char = String.fromCharCode(e.keyCode);
            var isWordCharacter = char.match(/\w/);
            if (!isNullOrUndefined(isWordCharacter)) {
                this.isValidKey = true;
            }
        }
        this.isValidKey = (this.isPopupOpen() && e.keyCode === 8) || this.isValidKey;
        this.isValidKey = e.ctrlKey && e.keyCode === 86 ? false : this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            this.expandTextbox();
            this.showOverAllClear();
            switch (e.keyCode) {
                default:
                    // For filtering works in mobile firefox
                    this.search(e);
            }
        }
    };
    /**
     * To filter the multiselect data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    MultiSelect.prototype.filter = function (dataSource, query, fields) {
        this.isFiltered = true;
        this.remoteFilterAction = true;
        this.dataUpdater(dataSource, query, fields);
    };
    MultiSelect.prototype.getQuery = function (query) {
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.filterAction) {
            if (this.targetElement() !== null) {
                var dataType = this.typeOfData(this.dataSource).typeof;
                if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                    filterQuery.where('', this.filterType, this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
                else {
                    var fields = this.fields;
                    filterQuery.where(!isNullOrUndefined(fields.text) ? fields.text : '', this.filterType, this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
            }
            return filterQuery;
        }
        else {
            return query ? query : this.query ? this.query : new Query();
        }
    };
    MultiSelect.prototype.dataUpdater = function (dataSource, query, fields) {
        this.isDataFetched = false;
        if (this.targetElement().trim() === '') {
            var list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            if (this.backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.mainData);
                if (this.value && this.value.length) {
                    this.refreshSelection();
                }
                if (this.keyCode !== 8) {
                    this.focusAtFirstListItem();
                }
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
            }
        }
        else {
            this.resetList(dataSource, fields, query);
            if (this.allowCustomValue) {
                if (!(dataSource instanceof DataManager)) {
                    this.checkForCustomValue(query, fields);
                }
                else {
                    this.remoteCustomValue = true;
                    this.tempQuery = query;
                }
            }
        }
        this.refreshPopup();
        if (this.mode === 'CheckBox') {
            this.removeFocus();
        }
    };
    MultiSelect.prototype.checkForCustomValue = function (query, fields) {
        var dataChecks = !this.getValueByText(this.inputElement.value, this.ignoreCase);
        if (this.allowCustomValue && dataChecks) {
            var value = this.inputElement.value;
            var field = fields ? fields : this.fields;
            var customData = (!isNullOrUndefined(this.mainData) && this.mainData.length > 0) ?
                this.mainData[0] : this.mainData;
            if (typeof (customData) !== 'string') {
                var dataItem = {};
                setValue(field.text, value, dataItem);
                setValue(field.value, value, dataItem);
                var tempData = JSON.parse(JSON.stringify(this.listData));
                tempData.splice(0, 0, dataItem);
                this.resetList(tempData, field, query);
            }
            else {
                var tempData = [this.inputElement.value];
                this.resetList(tempData, field);
            }
        }
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
    };
    MultiSelect.prototype.getNgDirective = function () {
        return 'EJS-MULTISELECT';
    };
    MultiSelect.prototype.wrapperClick = function (e) {
        this.setDynValue = false;
        if (!this.enabled) {
            return;
        }
        if (e.target === this.overAllClear) {
            e.preventDefault();
            return;
        }
        if (!this.inputFocus) {
            this.inputElement.focus();
        }
        if (!this.readonly) {
            if (e.target && e.target.classList.toString().indexOf(CHIP_CLOSE$1) !== -1) {
                if (this.isPopupOpen()) {
                    this.refreshPopup();
                }
                return;
            }
            if (!this.isPopupOpen() &&
                (this.openOnClick || (this.showDropDownIcon && e.target && e.target.className === dropdownIcon))) {
                this.showPopup();
            }
            else {
                this.hidePopup();
                if (this.mode === 'CheckBox') {
                    this.showOverAllClear();
                    this.inputFocus = true;
                    if (!this.overAllWrapper.classList.contains(FOCUS)) {
                        this.overAllWrapper.classList.add(FOCUS);
                    }
                }
            }
        }
        e.preventDefault();
    };
    MultiSelect.prototype.enable = function (state) {
        if (state) {
            this.overAllWrapper.classList.remove(DISABLED$1);
            this.inputElement.removeAttribute('disabled');
            attributes(this.inputElement, { 'aria-disabled': 'false' });
            this.ensureAriaDisabled('false');
        }
        else {
            this.overAllWrapper.classList.add(DISABLED$1);
            this.inputElement.setAttribute('disabled', 'true');
            attributes(this.inputElement, { 'aria-disabled': 'true' });
            this.ensureAriaDisabled('true');
        }
        if (this.enabled !== state) {
            this.enabled = state;
        }
        this.hidePopup();
    };
    MultiSelect.prototype.onBlur = function (eve, isDocClickFromCheck) {
        var target;
        if (!isNullOrUndefined(eve)) {
            target = eve.relatedTarget;
        }
        if (this.popupObj && document.body.contains(this.popupObj.element) && this.popupObj.element.contains(target)) {
            if (this.mode !== 'CheckBox') {
                this.inputElement.focus();
            }
            return;
        }
        if (this.mode === 'CheckBox' && Browser.isIE && !isNullOrUndefined(eve) && !isDocClickFromCheck) {
            this.inputFocus = false;
            this.overAllWrapper.classList.remove(FOCUS);
            return;
        }
        if (this.scrollFocusStatus) {
            if (!isNullOrUndefined(eve)) {
                eve.preventDefault();
            }
            this.inputElement.focus();
            this.scrollFocusStatus = false;
            return;
        }
        this.inputFocus = false;
        this.overAllWrapper.classList.remove(FOCUS);
        this.refreshListItems(null);
        if (this.mode !== 'Box' && this.mode !== 'CheckBox') {
            this.updateDelimView();
        }
        if (this.changeOnBlur) {
            this.updateValueState(eve, this.value, this.tempValues);
            this.dispatchEvent(this.hiddenElement, 'change');
        }
        this.overAllClear.style.display = 'none';
        if (this.isPopupOpen()) {
            this.DropDownBaseresetBlazorTemplates(false, false, true, true, false, true, true);
            this.hidePopup();
        }
        this.makeTextBoxEmpty();
        this.trigger('blur');
        this.focused = true;
        if (Browser.isDevice && this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
            this.removeChipFocus();
        }
        this.removeChipSelection();
        this.refreshInputHight();
        floatLabelBlur(this.overAllWrapper, this.componentWrapper, this.value, this.floatLabelType, this.placeholder);
        this.refreshPlaceHolder();
        if ((this.allowFiltering || (this.enableSelectionOrder === true && this.mode === 'CheckBox'))
            && !isNullOrUndefined(this.mainList)) {
            this.ulElement = this.mainList;
        }
        this.checkPlaceholderSize();
    };
    MultiSelect.prototype.checkPlaceholderSize = function () {
        if (this.showDropDownIcon) {
            var downIconWidth = this.dropIcon.offsetWidth +
                parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            this.setPlaceholderSize(downIconWidth);
        }
    };
    MultiSelect.prototype.setPlaceholderSize = function (downIconWidth) {
        if (isNullOrUndefined(this.value) || this.value.length === 0) {
            if (this.dropIcon.offsetWidth !== 0) {
                this.searchWrapper.style.width = ('calc(100% - ' + (downIconWidth + 10)) + 'px';
            }
            else {
                addClass([this.searchWrapper], CUSTOM_WIDTH);
            }
        }
        else if (!isNullOrUndefined(this.value)) {
            this.searchWrapper.removeAttribute('style');
            removeClass([this.searchWrapper], CUSTOM_WIDTH);
        }
    };
    MultiSelect.prototype.refreshInputHight = function () {
        if ((!this.value || !this.value.length) && (isNullOrUndefined(this.text) || this.text === '')) {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        else {
            this.searchWrapper.classList.add(ZERO_SIZE);
        }
    };
    MultiSelect.prototype.validateValues = function (newValue, oldValue) {
        return JSON.stringify(newValue.slice().sort()) !== JSON.stringify(oldValue.slice().sort());
    };
    MultiSelect.prototype.updateValueState = function (event, newVal, oldVal) {
        var newValue = newVal ? newVal : [];
        var oldValue = oldVal ? oldVal : [];
        if (this.initStatus && this.validateValues(newValue, oldValue)) {
            var eventArgs = {
                e: event,
                oldValue: oldVal,
                value: newVal,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
            this.updateTempValue();
            if (!this.changeOnBlur) {
                this.dispatchEvent(this.hiddenElement, 'change');
            }
        }
    };
    MultiSelect.prototype.updateTempValue = function () {
        if (!this.value) {
            this.tempValues = this.value;
        }
        else {
            this.tempValues = this.value.slice();
        }
    };
    MultiSelect.prototype.getPagingCount = function () {
        var height = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.offsetHeight / parseInt(height, 10));
    };
    MultiSelect.prototype.pageUpSelection = function (steps) {
        var collection = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        var previousItem;
        previousItem = steps >= 0 ? collection[steps + 1] : collection[0];
        this.addListFocus(previousItem);
        this.scrollBottom(previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    };
    
    MultiSelect.prototype.pageDownSelection = function (steps) {
        var list = this.getItems();
        var collection = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        var previousItem;
        previousItem = steps <= collection.length ? collection[steps - 1] : collection[collection.length - 1];
        this.addListFocus(previousItem);
        this.scrollBottom(previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    };
    MultiSelect.prototype.getItems = function () {
        if (!this.list) {
            _super.prototype.render.call(this);
        }
        return this.ulElement && this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li).length > 0 ?
            this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')') : [];
    };
    MultiSelect.prototype.focusInHandler = function (e) {
        if (this.enabled) {
            this.showOverAllClear();
            this.inputFocus = true;
            if (this.value && this.value.length) {
                if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
                    this.chipCollectionWrapper.style.display = '';
                }
                else {
                    this.showDelimWrapper();
                }
                if (this.mode !== 'CheckBox') {
                    this.viewWrapper.style.display = 'none';
                }
            }
            if (this.mode !== 'CheckBox') {
                this.searchWrapper.classList.remove(ZERO_SIZE);
            }
            this.checkPlaceholderSize();
            if (this.focused) {
                var args = { isInteracted: e ? true : false, event: e };
                this.trigger('focus', args);
                this.focused = false;
            }
            if (!this.overAllWrapper.classList.contains(FOCUS)) {
                this.overAllWrapper.classList.add(FOCUS);
            }
            floatLabelFocus(this.overAllWrapper, this.componentWrapper);
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            return true;
        }
        else {
            return false;
        }
    };
    MultiSelect.prototype.showDelimWrapper = function () {
        if (this.mode === 'CheckBox') {
            this.viewWrapper.style.display = '';
        }
        else {
            this.delimiterWrapper.style.display = '';
        }
        this.componentWrapper.classList.add(DELIMITER_VIEW_WRAPPER);
    };
    MultiSelect.prototype.hideDelimWrapper = function () {
        this.delimiterWrapper.style.display = 'none';
        this.componentWrapper.classList.remove(DELIMITER_VIEW_WRAPPER);
    };
    MultiSelect.prototype.expandTextbox = function () {
        var size = 5;
        if (this.placeholder) {
            size = size > this.inputElement.placeholder.length ? size : this.inputElement.placeholder.length;
        }
        if (this.inputElement.value.length > size) {
            this.inputElement.size = this.inputElement.value.length;
        }
        else {
            this.inputElement.size = size;
        }
    };
    MultiSelect.prototype.isPopupOpen = function () {
        return ((this.popupWrapper !== null) && (this.popupWrapper.parentElement !== null));
    };
    MultiSelect.prototype.refreshPopup = function () {
        if (this.popupObj && this.mobFilter) {
            this.popupObj.setProperties({ width: this.calcPopupWidth() });
            this.popupObj.refreshPosition(this.overAllWrapper);
        }
    };
    MultiSelect.prototype.checkTextLength = function () {
        return this.targetElement().length < 1;
    };
    MultiSelect.prototype.popupKeyActions = function (e) {
        switch (e.keyCode) {
            case 38:
                this.hidePopup();
                if (this.mode === 'CheckBox') {
                    this.inputElement.focus();
                }
                e.preventDefault();
                break;
            case 40:
                if (!this.isPopupOpen()) {
                    this.showPopup();
                    e.preventDefault();
                }
                break;
        }
    };
    MultiSelect.prototype.updateAriaAttribute = function () {
        var focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(focusedItem)) {
            this.inputElement.setAttribute('aria-activedescendant', focusedItem.id);
        }
    };
    MultiSelect.prototype.homeNavigation = function (isHome) {
        this.removeFocus();
        var scrollEle = this.ulElement.querySelectorAll('li.' + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (scrollEle.length > 0) {
            var element = scrollEle[(isHome) ? 0 : (scrollEle.length - 1)];
            element.classList.add(dropDownBaseClasses.focus);
            this.scrollBottom(element);
        }
    };
    MultiSelect.prototype.onKeyDown = function (e) {
        if (this.readonly || !this.enabled && this.mode !== 'CheckBox') {
            return;
        }
        this.keyDownStatus = true;
        if (e.keyCode > 111 && e.keyCode < 124) {
            return;
        }
        if (e.altKey) {
            this.popupKeyActions(e);
            return;
        }
        else if (this.isPopupOpen()) {
            var focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
            var activeIndex = void 0;
            switch (e.keyCode) {
                case 36:
                case 35:
                    this.homeNavigation((e.keyCode === 36) ? true : false);
                    break;
                case 33:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageUpSelection(activeIndex - this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 34:
                    e.preventDefault();
                    if (focusedItem) {
                        this.getIndexByValue(focusedItem.getAttribute('data-value'));
                        this.pageDownSelection(activeIndex + this.getPagingCount());
                        this.updateAriaAttribute();
                    }
                    return;
                case 38:
                    this.arrowUp(e);
                    break;
                case 40:
                    this.arrowDown(e);
                    break;
                case 27:
                    e.preventDefault();
                    this.hidePopup();
                    if (this.mode === 'CheckBox') {
                        this.inputElement.focus();
                    }
                    return;
                case 13:
                    e.preventDefault();
                    if (this.mode !== 'CheckBox') {
                        this.selectByKey(e);
                    }
                    this.checkPlaceholderSize();
                    return;
                case 32:
                    this.spaceKeySelection(e);
                    return;
                case 9:
                    e.preventDefault();
                    this.hidePopup();
                    this.inputElement.focus();
                    this.overAllWrapper.classList.add(FOCUS);
            }
        }
        else {
            switch (e.keyCode) {
                case 13:
                case 9:
                case 16:
                case 17:
                case 20:
                    return;
                case 40:
                    if (this.openOnClick) {
                        this.showPopup();
                    }
                    break;
                case 27:
                    e.preventDefault();
                    this.escapeAction();
                    return;
            }
        }
        if (this.checkTextLength()) {
            this.keyNavigation(e);
        }
        if (this.mode === 'CheckBox' && this.enableSelectionOrder) {
            this.checkBackCommand(e);
        }
        this.expandTextbox();
        this.refreshPopup();
    };
    MultiSelect.prototype.arrowDown = function (e) {
        e.preventDefault();
        this.moveByList(1);
        this.keyAction = true;
        if (document.activeElement.classList.contains('e-input-filter')
            || (this.mode === 'CheckBox' && !this.allowFiltering && document.activeElement !== this.list)) {
            this.list.focus();
            EventHandler.add(this.list, 'keydown', this.onKeyDown, this);
        }
        this.updateAriaAttribute();
    };
    MultiSelect.prototype.arrowUp = function (e) {
        e.preventDefault();
        this.keyAction = true;
        var list = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            list = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        }
        var focuseElem = this.list.querySelector('li.' + dropDownBaseClasses.focus);
        var index = Array.prototype.slice.call(list).indexOf(focuseElem);
        if (index <= 0 && (this.mode === 'CheckBox' && this.allowFiltering)) {
            this.keyAction = false;
            this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus' });
        }
        else {
            this.list.focus();
        }
        this.moveByList(-1);
        this.updateAriaAttribute();
    };
    MultiSelect.prototype.spaceKeySelection = function (e) {
        if (this.mode === 'CheckBox') {
            if (!document.activeElement.classList.contains('e-input-filter')) {
                e.preventDefault();
                this.keyAction = true;
                this.list.focus();
            }
            this.selectByKey(e);
        }
        this.checkPlaceholderSize();
    };
    MultiSelect.prototype.checkBackCommand = function (e) {
        if (e.keyCode === 8 && this.targetElement() === '') {
            this.backCommand = false;
        }
        else {
            this.backCommand = true;
        }
    };
    MultiSelect.prototype.keyNavigation = function (e) {
        if ((this.mode !== 'Delimiter' && this.mode !== 'CheckBox') && this.value && this.value.length) {
            switch (e.keyCode) {
                case 37: //left arrow   
                    e.preventDefault();
                    this.moveBy(-1, e);
                    break;
                case 39: //right arrow  
                    e.preventDefault();
                    this.moveBy(1, e);
                    break;
                case 8:
                    this.removelastSelection(e);
                    break;
                case 46: //del
                    this.removeSelectedChip(e);
                    break;
            }
        }
        else if (e.keyCode === 8 && this.mode === 'Delimiter') {
            if (this.value && this.value.length) {
                e.preventDefault();
                var temp = this.value[this.value.length - 1];
                this.removeValue(temp, e);
                this.updateDelimeter(this.delimiterChar, e);
                this.focusAtLastListItem(temp);
            }
        }
    };
    MultiSelect.prototype.selectByKey = function (e) {
        this.removeChipSelection();
        this.selectListByKey(e);
        if (this.hideSelectedItem) {
            this.focusAtFirstListItem();
        }
    };
    MultiSelect.prototype.escapeAction = function () {
        var temp = this.tempValues ? this.tempValues.slice() : [];
        if (this.value && this.validateValues(this.value, temp)) {
            if (this.mode !== 'CheckBox') {
                this.value = temp;
                this.initialValueUpdate();
            }
            if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
                this.chipCollectionWrapper.style.display = '';
            }
            else {
                this.showDelimWrapper();
            }
            this.refreshPlaceHolder();
            if (this.value.length) {
                this.showOverAllClear();
            }
            else {
                this.hideOverAllClear();
            }
        }
        this.makeTextBoxEmpty();
    };
    MultiSelect.prototype.scrollBottom = function (selectedLI, activeIndex) {
        var currentOffset = this.list.offsetHeight;
        var nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
        var boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
        boxRange = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
            boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        }
        else if (nextBottom > currentOffset) {
            this.list.scrollTop = nextOffset;
        }
        else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
            this.list.scrollTop = nextOffset;
        }
    };
    MultiSelect.prototype.scrollTop = function (selectedLI, activeIndex) {
        var nextOffset = selectedLI.offsetTop - this.list.scrollTop;
        var nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        nextOffset = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
        var boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
        if (activeIndex === 0) {
            this.list.scrollTop = 0;
        }
        else if (nextOffset < 0) {
            this.list.scrollTop = this.list.scrollTop + nextOffset;
        }
        else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
            this.list.scrollTop = selectedLI.offsetTop - (this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
                this.fixedHeaderElement.offsetHeight : 0);
        }
    };
    MultiSelect.prototype.selectListByKey = function (e) {
        var li = this.list.querySelector('li.' + dropDownBaseClasses.focus);
        var limit = this.value && this.value.length ? this.value.length : 0;
        var target;
        if (li !== null) {
            if (li.classList.contains('e-active')) {
                limit = limit - 1;
            }
            if (this.isValidLI(li) && limit < this.maximumSelectionLength) {
                this.updateListSelection(li, e);
                this.addListFocus(li);
                if (this.mode === 'CheckBox') {
                    this.updateDelimView();
                    this.updateDelimeter(this.delimiterChar, e);
                    this.refreshInputHight();
                    this.checkPlaceholderSize();
                    if (this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                        target = li.firstElementChild.lastElementChild;
                        this.findGroupStart(target);
                        this.deselectHeader();
                    }
                }
                else {
                    this.updateDelimeter(this.delimiterChar, e);
                }
                this.makeTextBoxEmpty();
                if (this.mode !== 'CheckBox') {
                    this.refreshListItems(li.textContent);
                }
                if (!this.changeOnBlur) {
                    this.updateValueState(e, this.value, this.tempValues);
                }
                this.refreshPopup();
            }
            else {
                if (!this.isValidLI(li) && limit < this.maximumSelectionLength) {
                    target = li.firstElementChild.lastElementChild;
                    target.classList.contains('e-check') ? this.selectAllItem(false, e, li) : this.selectAllItem(true, e, li);
                }
            }
            this.refreshSelection();
            if (this.closePopupOnSelect) {
                this.hidePopup();
            }
        }
        this.refreshPlaceHolder();
    };
    MultiSelect.prototype.refreshListItems = function (data) {
        if ((this.allowFiltering || (this.mode === 'CheckBox' && this.enableSelectionOrder === true)
            || this.allowCustomValue) && this.mainList && this.listData) {
            var list = void 0;
            list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
            this.focusAtLastListItem(data);
            if (this.value && this.value.length) {
                this.refreshSelection();
            }
        }
    };
    MultiSelect.prototype.removeSelectedChip = function (e) {
        var selectedElem = this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        var temp;
        if (selectedElem !== null) {
            if (!isNullOrUndefined(this.value)) {
                this.tempValues = this.value.slice();
            }
            temp = selectedElem.nextElementSibling;
            if (temp !== null) {
                this.removeChipSelection();
                this.addChipSelection(temp, e);
            }
            this.removeValue(selectedElem.getAttribute('data-value'), e);
            this.makeTextBoxEmpty();
        }
        if (this.closePopupOnSelect) {
            this.hidePopup();
        }
        this.checkPlaceholderSize();
    };
    MultiSelect.prototype.moveByTop = function (state) {
        var elements = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        var index;
        if (elements.length > 1) {
            this.removeFocus();
            index = state ? 0 : (elements.length - 1);
            this.addListFocus(elements[index]);
            this.scrollBottom(elements[index], index);
        }
        this.updateAriaAttribute();
    };
    MultiSelect.prototype.moveByList = function (position) {
        if (this.list) {
            var elements = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                elements = this.list.querySelectorAll('li.'
                    + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
                    + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            }
            var selectedElem = this.list.querySelector('li.' + dropDownBaseClasses.focus);
            var temp = -1;
            if (elements.length) {
                for (var index = 0; index < elements.length; index++) {
                    if (elements[index] === selectedElem) {
                        temp = index;
                        break;
                    }
                }
                if (position > 0) {
                    if (temp < (elements.length - 1)) {
                        this.removeFocus();
                        this.addListFocus(elements[++temp]);
                        this.updateCheck(elements[temp]);
                        this.scrollBottom(elements[temp], temp);
                    }
                }
                else {
                    if (temp > 0) {
                        this.removeFocus();
                        this.addListFocus(elements[--temp]);
                        this.updateCheck(elements[temp]);
                        this.scrollTop(elements[temp], temp);
                    }
                }
            }
        }
    };
    MultiSelect.prototype.updateCheck = function (element) {
        if (this.mode === 'CheckBox' && this.enableGroupCheckBox &&
            !isNullOrUndefined(this.fields.groupBy)) {
            var checkElement = element.firstElementChild.lastElementChild;
            if (checkElement.classList.contains('e-check')) {
                element.classList.add('e-active');
            }
            else {
                element.classList.remove('e-active');
            }
        }
    };
    MultiSelect.prototype.moveBy = function (position, e) {
        var elements;
        var selectedElem;
        var temp;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP$1);
        selectedElem = this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        if (selectedElem === null) {
            if (position < 0) {
                this.addChipSelection(elements[elements.length - 1], e);
            }
        }
        else {
            if (position < 0) {
                temp = selectedElem.previousElementSibling;
                if (temp !== null) {
                    this.removeChipSelection();
                    this.addChipSelection(temp, e);
                }
            }
            else {
                temp = selectedElem.nextElementSibling;
                this.removeChipSelection();
                if (temp !== null) {
                    this.addChipSelection(temp, e);
                }
            }
        }
    };
    MultiSelect.prototype.chipClick = function (e) {
        if (this.enabled) {
            var elem = closest(e.target, '.' + CHIP$1);
            this.removeChipSelection();
            this.addChipSelection(elem, e);
        }
    };
    MultiSelect.prototype.removeChipSelection = function () {
        if (this.chipCollectionWrapper) {
            this.removeChipFocus();
        }
    };
    MultiSelect.prototype.addChipSelection = function (element, e) {
        addClass([element], CHIP_SELECTED);
        this.trigger('chipSelection', e);
    };
    MultiSelect.prototype.onChipRemove = function (e) {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        if (this.enabled && !this.readonly) {
            var element = e.target.parentElement;
            var customVal = element.getAttribute('data-value');
            var value = this.getFormattedValue(customVal);
            if (this.allowCustomValue && ((customVal !== 'false' && value === false) ||
                (!isNullOrUndefined(value) && value.toString() === 'NaN'))) {
                value = customVal;
            }
            if (this.isPopupOpen() && this.mode !== 'CheckBox') {
                this.hidePopup();
            }
            if (!this.inputFocus) {
                this.inputElement.focus();
            }
            this.removeValue(value, e);
            if (isNullOrUndefined(this.findListElement(this.list, 'li', 'data-value', value)) && this.mainList && this.listData) {
                var list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
                this.onActionComplete(list, this.mainData);
            }
            this.updateDelimeter(this.delimiterChar, e);
            if (this.placeholder && this.floatLabelType === 'Never') {
                this.makeTextBoxEmpty();
                this.checkPlaceholderSize();
            }
            else {
                this.inputElement.value = '';
            }
            e.preventDefault();
        }
    };
    MultiSelect.prototype.makeTextBoxEmpty = function () {
        this.inputElement.value = '';
        this.refreshPlaceHolder();
    };
    MultiSelect.prototype.refreshPlaceHolder = function () {
        if (this.placeholder && this.floatLabelType === 'Never') {
            if ((this.value && this.value.length) || (!isNullOrUndefined(this.text) && this.text !== '')) {
                this.inputElement.placeholder = '';
            }
            else {
                this.inputElement.placeholder = this.placeholder;
            }
        }
        else {
            this.setFloatLabelType();
        }
        this.expandTextbox();
    };
    MultiSelect.prototype.removeValue = function (value, eve, length, isClearAll) {
        var _this = this;
        var index = this.value.indexOf(this.getFormattedValue(value));
        if (index === -1 && this.allowCustomValue && !isNullOrUndefined(value)) {
            index = this.value.indexOf(value.toString());
        }
        var targetEle = eve && eve.target;
        isClearAll = (isClearAll || targetEle && targetEle.classList.contains('e-close-hooker')) ? true : null;
        var className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (index !== -1) {
            var element_1 = this.findListElement(this.list, 'li', 'data-value', value);
            var val_1 = this.getDataByValue(value);
            var eventArgs = {
                e: eve,
                item: element_1,
                itemData: val_1,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('removing', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    _this.removeIndex++;
                }
                else {
                    var removeVal = _this.value.slice(0);
                    removeVal.splice(index, 1);
                    if (isBlazor() && _this.isServerRendered) {
                        var removedValues = [].concat([], removeVal);
                        _this.setProperties({ value: removedValues.length === 0 ? null : removedValues }, true);
                    }
                    else {
                        _this.setProperties({ value: [].concat([], removeVal) }, true);
                    }
                    if (element_1 !== null) {
                        var hideElement = _this.findListElement(_this.mainList, 'li', 'data-value', value);
                        element_1.setAttribute('aria-selected', 'false');
                        removeClass([element_1], className);
                        if (hideElement) {
                            hideElement.setAttribute('aria-selected', 'false');
                            removeClass([element_1, hideElement], className);
                        }
                        _this.notify('activeList', {
                            module: 'CheckBoxSelection',
                            enable: _this.mode === 'CheckBox', li: element_1,
                            e: _this, index: index
                        });
                        _this.notify('updatelist', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox', li: element_1, e: eve });
                        attributes(_this.inputElement, { 'aria-activedescendant': element_1.id });
                        if ((_this.value && _this.value.length !== _this.mainData.length)
                            && (_this.mode === 'CheckBox' && _this.showSelectAll)) {
                            _this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                                enable: _this.mode === 'CheckBox',
                                value: 'uncheck' });
                        }
                    }
                    if (_this.hideSelectedItem && _this.fields.groupBy) {
                        _this.hideGroupItem(value);
                    }
                    _this.updateMainList(true, value);
                    _this.removeChip(value);
                    _this.updateChipStatus();
                    var limit = _this.value && _this.value.length ? _this.value.length : 0;
                    if (limit < _this.maximumSelectionLength) {
                        var collection = _this.list.querySelectorAll('li.'
                            + dropDownBaseClasses.li + ':not(.e-active)');
                        removeClass(collection, 'e-disable');
                    }
                    _this.trigger('removed', eventArgs);
                    var targetEle_1 = eve && eve.currentTarget;
                    var isSelectAll = (targetEle_1 && targetEle_1.classList.contains('e-selectall-parent')) ? true : null;
                    if (!_this.changeOnBlur && !isClearAll && (eve && length && !isSelectAll)) {
                        _this.updateValueState(eve, _this.value, _this.tempValues);
                    }
                    if (length) {
                        _this.selectAllEventData.push(val_1);
                        _this.selectAllEventEle.push(element_1);
                    }
                    if (length === 1) {
                        if (!_this.changeOnBlur) {
                            _this.updateValueState(eve, _this.value, _this.tempValues);
                        }
                        var args = {
                            event: eve,
                            items: _this.selectAllEventEle,
                            itemData: _this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: false
                        };
                        _this.trigger('selectedAll', args);
                        _this.selectAllEventData = [];
                        _this.selectAllEventEle = [];
                    }
                    if (isClearAll && (length === 1 || length === null)) {
                        _this.clearAllCallback(eve, isClearAll);
                    }
                    if (isBlazor() && _this.isServerRendered && (isNullOrUndefined(_this.value) || _this.value.length === 0)) {
                        _this.updatedataValueItems(eve);
                    }
                }
            });
        }
    };
    MultiSelect.prototype.updateMainList = function (state, value) {
        if (this.allowFiltering || this.mode === 'CheckBox') {
            var element2 = this.findListElement(this.mainList, 'li', 'data-value', value);
            if (element2) {
                if (state) {
                    element2.setAttribute('aria-selected', 'false');
                    removeClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                    if (this.mode === 'CheckBox') {
                        element2.firstElementChild.setAttribute('aria-checked', 'false');
                        removeClass([element2.firstElementChild.lastElementChild], 'e-check');
                    }
                }
                else {
                    element2.setAttribute('aria-selected', 'true');
                    addClass([element2], this.hideSelectedItem ?
                        HIDE_LIST :
                        dropDownBaseClasses.selected);
                    if (this.mode === 'CheckBox') {
                        element2.firstElementChild.setAttribute('aria-checked', 'true');
                        addClass([element2.firstElementChild.lastElementChild], 'e-check');
                    }
                }
            }
        }
    };
    MultiSelect.prototype.removeChip = function (value) {
        if (this.chipCollectionWrapper) {
            var element = this.findListElement(this.chipCollectionWrapper, 'span', 'data-value', value);
            if (element) {
                remove(element);
            }
        }
    };
    MultiSelect.prototype.setWidth = function (width) {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.overAllWrapper.style.width = formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.overAllWrapper.style.width = (width.match(/px|%|em/)) ? (width) : (formatUnit(width));
            }
        }
    };
    MultiSelect.prototype.updateChipStatus = function () {
        if (this.value && this.value.length) {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                (this.chipCollectionWrapper.style.display = '');
            }
            if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
                this.showDelimWrapper();
            }
            this.showOverAllClear();
        }
        else {
            if (!isNullOrUndefined(this.chipCollectionWrapper)) {
                this.chipCollectionWrapper.style.display = 'none';
            }
            if (!isNullOrUndefined(this.delimiterWrapper)) {
                (this.delimiterWrapper.style.display = 'none');
            }
            this.hideOverAllClear();
        }
    };
    MultiSelect.prototype.addValue = function (value, text, eve) {
        if (!this.value) {
            this.value = [];
        }
        if (this.value.indexOf(value) < 0) {
            this.setProperties({ value: [].concat([], this.value, [value]) }, true);
        }
        var element = this.findListElement(this.list, 'li', 'data-value', value);
        this.removeFocus();
        if (element) {
            this.addListFocus(element);
            this.addListSelection(element);
        }
        if (this.mode !== 'Delimiter' && this.mode !== 'CheckBox') {
            this.addChip(text, value, eve);
        }
        if (this.hideSelectedItem && this.fields.groupBy) {
            this.hideGroupItem(value);
        }
        this.updateChipStatus();
        this.checkMaxSelection();
    };
    MultiSelect.prototype.checkMaxSelection = function () {
        var limit = this.value && this.value.length ? this.value.length : 0;
        if (limit === this.maximumSelectionLength) {
            var collection = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ':not(.e-active)');
            addClass(collection, 'e-disable');
        }
    };
    MultiSelect.prototype.dispatchSelect = function (value, eve, element, isNotTrigger, length) {
        var _this = this;
        if (this.initStatus && !isNotTrigger) {
            var val_2 = this.getDataByValue(value);
            var eventArgs = {
                e: eve,
                item: element,
                itemData: val_2,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, function (eventArgs) {
                if (!eventArgs.cancel) {
                    if (length) {
                        _this.selectAllEventData.push(val_2);
                        _this.selectAllEventEle.push(element);
                    }
                    if (length === 1) {
                        var args = {
                            event: eve,
                            items: _this.selectAllEventEle,
                            itemData: _this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: true
                        };
                        _this.trigger('selectedAll', args);
                        _this.selectAllEventData = [];
                    }
                    _this.updateListSelectEventCallback(value, element, eve);
                }
            });
        }
    };
    MultiSelect.prototype.addChip = function (text, value, e) {
        if (this.chipCollectionWrapper) {
            this.getChip(text, value, e);
        }
    };
    MultiSelect.prototype.removeChipFocus = function () {
        var elements;
        var closeElements;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP$1);
        closeElements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP_CLOSE$1.split(' ')[0]);
        removeClass(elements, CHIP_SELECTED);
        if (Browser.isDevice) {
            for (var index = 0; index < closeElements.length; index++) {
                closeElements[index].style.display = 'none';
            }
        }
    };
    MultiSelect.prototype.onMobileChipInteraction = function (e) {
        var chipElem = closest(e.target, '.' + CHIP$1);
        var chipClose = chipElem.querySelector('span.' + CHIP_CLOSE$1.split(' ')[0]);
        if (this.enabled && !this.readonly) {
            if (!chipElem.classList.contains(CHIP_SELECTED)) {
                this.removeChipFocus();
                chipClose.style.display = '';
                chipElem.classList.add(CHIP_SELECTED);
            }
            this.refreshPopup();
            e.preventDefault();
        }
    };
    MultiSelect.prototype.getChip = function (data, value, e) {
        var _this = this;
        var itemData = { text: value, value: value };
        var chip = this.createElement('span', {
            className: CHIP$1,
            attrs: { 'data-value': value, 'title': data }
        });
        var chipContent = this.createElement('span', { className: CHIP_CONTENT$1 });
        var chipClose = this.createElement('span', { className: CHIP_CLOSE$1 });
        if (this.mainData) {
            itemData = (isBlazor() && this.isServerRendered) ? JSON.parse(JSON.stringify(this.getDataByValue(value)))
                : this.getDataByValue(value);
        }
        if (this.valueTemplate && !isNullOrUndefined(itemData)) {
            var compiledString = compile(this.valueTemplate);
            for (var _i = 0, _a = compiledString(itemData, null, null, this.valueTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                chipContent.appendChild(item);
            }
            this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, false, false, false);
        }
        else {
            chipContent.innerHTML = data;
        }
        chip.appendChild(chipContent);
        var eventArgs = {
            isInteracted: e ? true : false,
            itemData: itemData,
            e: e,
            setClass: function (classes) {
                addClass([chip], classes);
            },
            cancel: false
        };
        this.trigger('tagging', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel) {
                if (eventArgs.setClass && typeof eventArgs.setClass === 'string' && (isBlazor() && _this.isServerRendered)) {
                    addClass([chip], eventArgs.setClass);
                }
                if (Browser.isDevice) {
                    chip.classList.add(MOBILE_CHIP);
                    append([chipClose], chip);
                    chipClose.style.display = 'none';
                    EventHandler.add(chip, 'click', _this.onMobileChipInteraction, _this);
                }
                else {
                    EventHandler.add(chip, 'mousedown', _this.chipClick, _this);
                    if (_this.showClearButton) {
                        chip.appendChild(chipClose);
                    }
                }
                EventHandler.add(chipClose, 'mousedown', _this.onChipRemove, _this);
                _this.chipCollectionWrapper.appendChild(chip);
                if (!_this.changeOnBlur && e) {
                    _this.updateValueState(e, _this.value, _this.tempValues);
                }
            }
        });
    };
    MultiSelect.prototype.calcPopupWidth = function () {
        var width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = (this.componentWrapper.offsetWidth) * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    MultiSelect.prototype.mouseIn = function () {
        if (this.enabled && !this.readonly) {
            this.showOverAllClear();
        }
    };
    MultiSelect.prototype.mouseOut = function () {
        if (!this.inputFocus) {
            this.overAllClear.style.display = 'none';
        }
    };
    MultiSelect.prototype.listOption = function (dataSource, fields) {
        var iconCss = isNullOrUndefined(fields.iconCss) ? false : true;
        var fieldProperty = isNullOrUndefined(fields.properties) ? fields :
            fields.properties;
        this.listCurrentOptions = (fields.text !== null || fields.value !== null) ? {
            fields: fieldProperty, showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        extend(this.listCurrentOptions, this.listCurrentOptions, fields, true);
        if (this.mode === 'CheckBox') {
            this.notify('listoption', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', dataSource: dataSource, fieldProperty: fieldProperty });
        }
        return this.listCurrentOptions;
    };
    MultiSelect.prototype.renderPopup = function () {
        var _this = this;
        if (!this.list) {
            _super.prototype.render.call(this);
        }
        if (!this.popupObj) {
            var args = { cancel: false };
            this.trigger('beforeOpen', args, function (args) {
                if (!args.cancel) {
                    document.body.appendChild(_this.popupWrapper);
                    var checkboxFilter = _this.popupWrapper.querySelector('.' + FILTERPARENT);
                    if (_this.mode === 'CheckBox' && !_this.allowFiltering && checkboxFilter && _this.filterParent) {
                        checkboxFilter.remove();
                        _this.filterParent = null;
                    }
                    var overAllHeight = parseInt(_this.popupHeight, 10);
                    _this.popupWrapper.style.visibility = 'hidden';
                    if (_this.headerTemplate) {
                        _this.setHeaderTemplate();
                        overAllHeight -= _this.header.offsetHeight;
                    }
                    append([_this.list], _this.popupWrapper);
                    if (_this.footerTemplate) {
                        _this.setFooterTemplate();
                        overAllHeight -= _this.footer.offsetHeight;
                    }
                    if (_this.mode === 'CheckBox' && _this.showSelectAll) {
                        _this.notify('selectAll', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox' });
                        overAllHeight -= _this.selectAllHeight;
                    }
                    else if (_this.mode === 'CheckBox' && !_this.showSelectAll && (!_this.headerTemplate || !_this.footerTemplate)) {
                        _this.notify('selectAll', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox' });
                        overAllHeight = parseInt(_this.popupHeight, 10);
                    }
                    else if (_this.mode === 'CheckBox' && !_this.showSelectAll) {
                        _this.notify('selectAll', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox' });
                        overAllHeight = parseInt(_this.popupHeight, 10);
                        if (_this.headerTemplate && _this.header) {
                            overAllHeight -= _this.header.offsetHeight;
                        }
                        if (_this.footerTemplate && _this.footer) {
                            overAllHeight -= _this.footer.offsetHeight;
                        }
                    }
                    if (_this.mode === 'CheckBox') {
                        var args_1 = {
                            module: 'CheckBoxSelection',
                            enable: _this.mode === 'CheckBox',
                            popupElement: _this.popupWrapper
                        };
                        if (_this.allowFiltering) {
                            _this.notify('searchBox', args_1);
                            overAllHeight -= _this.searchBoxHeight;
                        }
                        addClass([_this.popupWrapper], 'e-checkbox');
                    }
                    if (_this.popupHeight !== 'auto') {
                        _this.list.style.maxHeight = formatUnit(overAllHeight);
                        _this.popupWrapper.style.maxHeight = formatUnit(_this.popupHeight);
                    }
                    else {
                        _this.list.style.maxHeight = formatUnit(_this.popupHeight);
                    }
                    _this.popupObj = new Popup(_this.popupWrapper, {
                        width: _this.calcPopupWidth(), targetType: 'relative', position: { X: 'left', Y: 'bottom' },
                        relateTo: _this.overAllWrapper, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
                        enableRtl: _this.enableRtl, zIndex: _this.zIndex,
                        close: function () {
                            if (_this.popupObj.element.parentElement) {
                                _this.popupObj.unwireScrollEvents();
                                detach(_this.popupObj.element);
                            }
                        },
                        open: function () {
                            if (!_this.isFirstClick) {
                                var ulElement = _this.list.querySelector('ul');
                                if (ulElement) {
                                    if (_this.itemTemplate && (isBlazor() && _this.isServerRendered)) {
                                        setTimeout(function () { _this.mainList = _this.ulElement; }, 0);
                                    }
                                    else {
                                        if (!(_this.mode !== 'CheckBox' && _this.allowFiltering && _this.targetElement().trim() !== '')) {
                                            _this.mainList = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                                        }
                                    }
                                }
                                _this.isFirstClick = true;
                            }
                            _this.popupObj.wireScrollEvents();
                            if (!(_this.mode !== 'CheckBox' && _this.allowFiltering && _this.targetElement().trim() !== '')) {
                                _this.loadTemplate();
                            }
                            _this.setScrollPosition();
                            if (_this.allowFiltering) {
                                _this.notify('inputFocus', {
                                    module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox', value: 'focus'
                                });
                            }
                        }, targetExitViewport: function () {
                            if (!Browser.isDevice) {
                                _this.hidePopup();
                            }
                        }
                    });
                    _this.popupObj.close();
                    _this.popupWrapper.style.visibility = '';
                    if (_this.mode === 'CheckBox' && Browser.isDevice && _this.allowFiltering) {
                        _this.notify('deviceSearchBox', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox' });
                    }
                }
            });
        }
    };
    MultiSelect.prototype.setHeaderTemplate = function () {
        var compiledString;
        if (this.header) {
            this.header.remove();
        }
        this.header = this.createElement('div');
        addClass([this.header], HEADER$1);
        compiledString = compile(this.headerTemplate);
        var elements = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate);
        for (var temp = 0; temp < elements.length; temp++) {
            this.header.appendChild(elements[temp]);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        if (this.mode === 'CheckBox' && this.showSelectAll) {
            prepend([this.header], this.popupWrapper);
        }
        else {
            append([this.header], this.popupWrapper);
        }
        EventHandler.add(this.header, 'mousedown', this.onListMouseDown, this);
    };
    MultiSelect.prototype.setFooterTemplate = function () {
        var compiledString;
        if (this.footer) {
            this.footer.remove();
        }
        this.footer = this.createElement('div');
        addClass([this.footer], FOOTER$1);
        compiledString = compile(this.footerTemplate);
        var elements = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate);
        for (var temp = 0; temp < elements.length; temp++) {
            this.footer.appendChild(elements[temp]);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], this.popupWrapper);
        EventHandler.add(this.footer, 'mousedown', this.onListMouseDown, this);
    };
    MultiSelect.prototype.ClearAll = function (e) {
        if (this.enabled && !this.readonly) {
            var temp = void 0;
            if (this.value && this.value.length > 0) {
                var liElement = this.list && this.list.querySelectorAll('li.e-list-item');
                if (liElement && liElement.length > 0) {
                    this.selectAllItems(false, e);
                }
                else {
                    this.removeIndex = 0;
                    for (temp = this.value[this.removeIndex]; this.removeIndex < this.value.length; temp = this.value[this.removeIndex]) {
                        this.removeValue(temp, e, null, true);
                    }
                }
            }
            else {
                this.clearAllCallback(e);
            }
        }
    };
    MultiSelect.prototype.clearAllCallback = function (e, isClearAll) {
        var tempValues = this.value ? this.value.slice() : [];
        if (this.mainList && this.listData && ((this.allowFiltering && this.mode !== 'CheckBox') || this.allowCustomValue)) {
            var list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
        }
        this.focusAtFirstListItem();
        this.updateDelimeter(this.delimiterChar, e);
        if (this.mode !== 'Box' && (!this.inputFocus || this.mode === 'CheckBox')) {
            this.updateDelimView();
        }
        this.makeTextBoxEmpty();
        this.checkPlaceholderSize();
        if (this.isPopupOpen()) {
            this.refreshPopup();
        }
        if (!this.inputFocus) {
            if (this.changeOnBlur) {
                this.updateValueState(e, this.value, tempValues);
            }
            if (this.mode !== 'CheckBox') {
                this.inputElement.focus();
            }
        }
        if (this.mode === 'CheckBox') {
            this.refreshPlaceHolder();
            this.refreshInputHight();
            if (this.changeOnBlur && isClearAll && (isNullOrUndefined(this.value) || this.value.length === 0)) {
                this.updateValueState(e, this.value, this.tempValues);
            }
        }
        if (!this.changeOnBlur && isClearAll && (isNullOrUndefined(this.value) || this.value.length === 0)) {
            this.updateValueState(e, this.value, this.tempValues);
        }
        if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
            this.updateListItems(this.list.querySelectorAll('li.e-list-item'), this.mainList.querySelectorAll('li.e-list-item'));
        }
        e.preventDefault();
    };
    MultiSelect.prototype.windowResize = function () {
        this.refreshPopup();
        if ((!this.inputFocus || this.mode === 'CheckBox') && this.viewWrapper && this.viewWrapper.parentElement) {
            this.updateDelimView();
        }
    };
    MultiSelect.prototype.resetValueHandler = function (e) {
        var formElement = closest(this.inputElement, 'form');
        if (formElement && e.target === formElement) {
            var textVal = (this.element.tagName === this.getNgDirective()) ? null : this.element.getAttribute('data-initial-value');
            this.text = textVal;
        }
    };
    MultiSelect.prototype.wireEvent = function () {
        EventHandler.add(this.componentWrapper, 'mousedown', this.wrapperClick, this);
        EventHandler.add(window, 'resize', this.windowResize, this);
        EventHandler.add(this.inputElement, 'focus', this.focusInHandler, this);
        EventHandler.add(this.inputElement, 'keydown', this.onKeyDown, this);
        EventHandler.add(this.inputElement, 'keyup', this.KeyUp, this);
        if (this.mode !== 'CheckBox') {
            EventHandler.add(this.inputElement, 'input', this.onInput, this);
        }
        EventHandler.add(this.inputElement, 'blur', this.onBlur, this);
        EventHandler.add(this.componentWrapper, 'mousemove', this.mouseIn, this);
        var formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        EventHandler.add(this.componentWrapper, 'mouseout', this.mouseOut, this);
        EventHandler.add(this.overAllClear, 'mouseup', this.ClearAll, this);
        EventHandler.add(this.inputElement, 'paste', this.pasteHandler, this);
    };
    MultiSelect.prototype.onInput = function (e) {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        }
        else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
        // For Filtering works in mobile firefox
        if (Browser.isDevice && Browser.info.name === 'mozilla') {
            this.search(e);
        }
    };
    MultiSelect.prototype.pasteHandler = function (event) {
        var _this = this;
        setTimeout(function () {
            _this.search(event);
        });
    };
    MultiSelect.prototype.search = function (e) {
        var _this = this;
        if (!this.isPopupOpen() && this.openOnClick) {
            this.showPopup();
        }
        this.openClick(e);
        if (this.checkTextLength() && !this.allowFiltering && (e.keyCode !== 8)) {
            this.focusAtFirstListItem();
        }
        else {
            var text = this.targetElement();
            this.keyCode = e.keyCode;
            if (this.allowFiltering) {
                var eventArgs_1 = {
                    preventDefaultAction: false,
                    text: this.targetElement(),
                    updateData: function (dataSource, query, fields) {
                        if (eventArgs_1.cancel) {
                            return;
                        }
                        _this.isFiltered = true;
                        _this.remoteFilterAction = true;
                        _this.dataUpdater(dataSource, query, fields);
                    },
                    event: e,
                    cancel: false
                };
                this.trigger('filtering', eventArgs_1, function (eventArgs) {
                    if (!eventArgs.cancel) {
                        if (!_this.isFiltered && !eventArgs.preventDefaultAction) {
                            _this.filterAction = true;
                            _this.dataUpdater(_this.dataSource, null, _this.fields);
                        }
                    }
                });
            }
            else if (this.allowCustomValue) {
                var query = new Query();
                query = (text !== '') ? query.where(this.fields.text, 'startswith', text, this.ignoreCase, this.ignoreAccent) : query;
                this.dataUpdater(this.mainData, query, this.fields);
            }
            else {
                var liCollections = void 0;
                liCollections = this.list.querySelectorAll('li.' + dropDownBaseClasses.li + ':not(.e-hide-listitem)');
                var activeElement = Search(this.targetElement(), liCollections, 'StartsWith', this.ignoreCase);
                if (activeElement && activeElement.item !== null) {
                    this.addListFocus(activeElement.item);
                    this.list.scrollTop =
                        activeElement.item.offsetHeight * activeElement.index;
                }
                else if (this.targetElement() !== '') {
                    this.removeFocus();
                }
                else {
                    this.focusAtFirstListItem();
                }
            }
        }
    };
    MultiSelect.prototype.preRender = function () {
        if (this.allowFiltering === null) {
            this.allowFiltering = (this.mode === 'CheckBox') ? true : false;
        }
        this.initializeData();
        this.updateDataAttribute(this.htmlAttributes);
        _super.prototype.preRender.call(this);
    };
    MultiSelect.prototype.getLocaleName = function () {
        return 'multi-select';
    };
    
    MultiSelect.prototype.initializeData = function () {
        this.mainListCollection = [];
        this.beforePopupOpen = false;
        this.filterAction = false;
        this.remoteFilterAction = false;
        this.isFirstClick = false;
        this.mobFilter = true;
        this.isFiltered = false;
        this.focused = true;
        this.initial = true;
        this.backCommand = true;
    };
    MultiSelect.prototype.updateData = function (delimiterChar, e) {
        var data = '';
        var delim = this.mode === 'Delimiter' || this.mode === 'CheckBox';
        var text = [];
        var temp;
        var tempData = this.listData;
        this.listData = this.mainData;
        this.hiddenElement.innerHTML = '';
        if (!isNullOrUndefined(this.value)) {
            for (var index = 0; !isNullOrUndefined(this.value[index]); index++) {
                if (this.listData) {
                    temp = this.getTextByValue(this.value[index]);
                }
                else {
                    temp = this.value[index];
                }
                data += temp + delimiterChar + ' ';
                text.push(temp);
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[index] + '">' + index + '</option>';
            }
        }
        this.setProperties({ text: text.toString() }, true);
        if (delim) {
            this.delimiterWrapper.innerHTML = data;
            this.delimiterWrapper.setAttribute('id', getUniqueID('delim_val'));
            this.inputElement.setAttribute('aria-describedby', this.delimiterWrapper.id);
        }
        var targetEle = e && e.target;
        var isClearAll = (targetEle && targetEle.classList.contains('e-close-hooker')) ? true : null;
        if (!this.changeOnBlur && ((e && !isClearAll)) || this.isSelectAll) {
            this.isSelectAll = false;
            this.updateValueState(e, this.value, this.tempValues);
        }
        this.listData = tempData;
        this.addValidInputClass();
    };
    MultiSelect.prototype.initialTextUpdate = function () {
        if (!isNullOrUndefined(this.text)) {
            var textArr = this.text.split(this.delimiterChar);
            var textVal = [];
            for (var index = 0; textArr.length > index; index++) {
                var val = this.getValueByText(textArr[index]);
                if (!isNullOrUndefined(val)) {
                    textVal.push(val);
                }
                else if (this.allowCustomValue) {
                    textVal.push(textArr[index]);
                }
            }
            if (textVal && textVal.length) {
                this.setProperties({ value: textVal }, true);
            }
        }
        else {
            this.setProperties({ value: null }, true);
        }
    };
    MultiSelect.prototype.renderList = function (isEmptyData) {
        if (!isEmptyData && this.allowCustomValue && this.list && (this.list.textContent === this.noRecordsTemplate
            || this.list.querySelector('.e-ul') && this.list.querySelector('.e-ul').childElementCount === 0)) {
            isEmptyData = true;
        }
        _super.prototype.render.call(this, isEmptyData);
        this.unwireListEvents();
        this.wireListEvents();
    };
    MultiSelect.prototype.initialValueUpdate = function () {
        if (this.list) {
            var text = void 0;
            var element = void 0;
            var value = void 0;
            if (this.chipCollectionWrapper) {
                this.chipCollectionWrapper.innerHTML = '';
            }
            this.removeListSelection();
            if (!isNullOrUndefined(this.value)) {
                for (var index = 0; !isNullOrUndefined(this.value[index]); index++) {
                    value = this.value[index];
                    element = this.findListElement(this.hideSelectedItem ? this.ulElement : this.list, 'li', 'data-value', value);
                    text = this.getTextByValue(value);
                    if ((element && (element.getAttribute('aria-selected') !== 'true')) ||
                        (element && (element.getAttribute('aria-selected') === 'true' && this.hideSelectedItem) &&
                            (this.mode === 'Box' || this.mode === 'Default'))) {
                        this.addChip(text, value);
                        this.addListSelection(element);
                    }
                    else if (value && this.allowCustomValue) {
                        var indexItem = this.listData.length;
                        var newValue = {};
                        setValue(this.fields.text, value, newValue);
                        setValue(this.fields.value, value, newValue);
                        var noDataEle = this.popupWrapper.querySelector('.' + dropDownBaseClasses.noData);
                        this.addItem(newValue, indexItem);
                        if (this.popupWrapper.contains(noDataEle)) {
                            this.list.setAttribute('style', noDataEle.getAttribute('style'));
                            this.popupWrapper.replaceChild(this.list, noDataEle);
                            this.wireListEvents();
                        }
                        this.addChip(text, value);
                        this.addListSelection(element);
                    }
                }
            }
            if (this.mode === 'CheckBox') {
                this.updateDelimView();
                if (this.changeOnBlur) {
                    this.updateValueState(null, this.value, this.tempValues);
                }
                this.updateDelimeter(this.delimiterChar);
                this.refreshInputHight();
            }
            else {
                this.updateDelimeter(this.delimiterChar);
            }
            if (this.mode === 'CheckBox' && this.showSelectAll && (isNullOrUndefined(this.value) || !this.value.length)) {
                this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
            }
            if (this.mode === 'Box') {
                this.chipCollectionWrapper.style.display = '';
            }
            else if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
                this.showDelimWrapper();
            }
        }
    };
    MultiSelect.prototype.updateActionCompleteData = function (li, item) {
        if (this.value && this.value.indexOf(li.getAttribute('data-value')) > -1) {
            this.mainList = this.ulElement;
            addClass([li], HIDE_LIST);
        }
    };
    MultiSelect.prototype.updateAddItemList = function (list, itemCount) {
        if (this.popupObj && this.popupObj.element && this.popupObj.element.querySelector('.' + dropDownBaseClasses.noData) && list) {
            this.list = list;
            this.mainList = this.ulElement = list.querySelector('ul');
            remove(this.popupWrapper.querySelector('.e-content'));
            this.popupObj = null;
            this.renderPopup();
        }
    };
    MultiSelect.prototype.updateDataList = function () {
        if (this.mainList && this.ulElement && this.mainList.childElementCount < this.ulElement.childElementCount) {
            this.mainList = this.ulElement.cloneNode ? this.ulElement.cloneNode(true) : this.ulElement;
        }
    };
    MultiSelect.prototype.isValidLI = function (li) {
        return (li && !li.classList.contains(dropDownBaseClasses.disabled) && !li.classList.contains(dropDownBaseClasses.group) &&
            li.classList.contains(dropDownBaseClasses.li));
    };
    
    MultiSelect.prototype.updateListSelection = function (li, e, length) {
        var customVal = li.getAttribute('data-value');
        var value = this.getFormattedValue(customVal);
        if (this.allowCustomValue && ((customVal !== 'false' && value === false) ||
            (!isNullOrUndefined(value) && value.toString() === 'NaN'))) {
            value = customVal;
        }
        var text = this.getTextByValue(value);
        this.removeHover();
        if (!this.value || this.value.indexOf(value) === -1) {
            this.dispatchSelect(value, e, li, (li.getAttribute('aria-selected') === 'true'), length);
        }
        else {
            this.removeValue(value, e, length);
        }
    };
    MultiSelect.prototype.updateListSelectEventCallback = function (value, li, e) {
        var _this = this;
        var text = this.getTextByValue(value);
        if ((this.allowCustomValue || this.allowFiltering) && !this.findListElement(this.mainList, 'li', 'data-value', value)) {
            var temp_1 = li.cloneNode(true);
            var data_1 = this.getDataByValue(value);
            var eventArgs = {
                newData: data_1,
                cancel: false
            };
            this.trigger('customValueSelection', eventArgs, function (eventArgs) {
                if (!eventArgs.cancel) {
                    append([temp_1], _this.mainList);
                    _this.mainData.push(data_1);
                    _this.remoteCustomValue = false;
                    _this.addValue(value, text, e);
                }
            });
        }
        else {
            this.remoteCustomValue = false;
            this.addValue(value, text, e);
        }
        if (isBlazor() && this.isServerRendered && this.value && this.list &&
            this.value.length === this.list.querySelectorAll('li.e-list-item').length ||
            this.value.length === this.maximumSelectionLength) {
            this.updatedataValueItems(e);
            this.checkPlaceholderSize();
        }
        if (isBlazor() && this.isServerRendered) {
            this.checkPlaceholderSize();
            this.makeTextBoxEmpty();
        }
    };
    MultiSelect.prototype.removeListSelection = function () {
        var className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        var selectedItems = this.list.querySelectorAll('.' + className);
        var temp = selectedItems.length;
        if (selectedItems && selectedItems.length) {
            removeClass(selectedItems, className);
            while (temp > 0) {
                selectedItems[temp - 1].setAttribute('aria-selected', 'false');
                temp--;
            }
        }
        if (!isNullOrUndefined(this.mainList)) {
            var selectItems = this.mainList.querySelectorAll('.' + className);
            var temp1 = selectItems.length;
            if (selectItems && selectItems.length) {
                removeClass(selectItems, className);
                while (temp1 > 0) {
                    selectItems[temp1 - 1].setAttribute('aria-selected', 'false');
                    if (this.mode === 'CheckBox') {
                        if (selectedItems && (selectedItems.length > (temp1 - 1))) {
                            selectedItems[temp1 - 1].firstElementChild.setAttribute('aria-checked', 'false');
                            removeClass([selectedItems[temp1 - 1].firstElementChild.lastElementChild], 'e-check');
                        }
                        selectItems[temp1 - 1].firstElementChild.setAttribute('aria-checked', 'false');
                        removeClass([selectItems[temp1 - 1].firstElementChild.lastElementChild], 'e-check');
                    }
                    temp1--;
                }
            }
        }
    };
    
    MultiSelect.prototype.removeHover = function () {
        var hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    };
    
    MultiSelect.prototype.removeFocus = function () {
        if (this.list && this.mainList) {
            var hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.focus);
            var mainlist = this.mainList.querySelectorAll('.' + dropDownBaseClasses.focus);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.focus);
                removeClass(mainlist, dropDownBaseClasses.focus);
            }
        }
    };
    
    MultiSelect.prototype.addListHover = function (li) {
        if (this.enabled && this.isValidLI(li)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
        else {
            if ((li !== null && li.classList.contains('e-list-group-item')) && this.enableGroupCheckBox && this.mode === 'CheckBox'
                && !isNullOrUndefined(this.fields.groupBy)) {
                this.removeHover();
                addClass([li], dropDownBaseClasses.hover);
            }
        }
    };
    
    MultiSelect.prototype.addListFocus = function (element) {
        if (this.enabled && this.isValidLI(element)) {
            this.removeFocus();
            addClass([element], dropDownBaseClasses.focus);
        }
        else {
            if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
                addClass([element], dropDownBaseClasses.focus);
            }
        }
    };
    MultiSelect.prototype.addListSelection = function (element) {
        var className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (this.isValidLI(element) && !element.classList.contains(dropDownBaseClasses.hover)) {
            addClass([element], className);
            this.updateMainList(false, element.getAttribute('data-value'));
            element.setAttribute('aria-selected', 'true');
            if (this.mode === 'CheckBox') {
                var ariaCheck = element.firstElementChild.getAttribute('aria-checked');
                if (ariaCheck === 'false' || isNullOrUndefined(ariaCheck)) {
                    this.notify('updatelist', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: this });
                }
            }
            this.notify('activeList', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: this });
            if (this.chipCollectionWrapper !== null) {
                this.removeChipSelection();
            }
            attributes(this.inputElement, { 'aria-activedescendant': element.id });
        }
    };
    MultiSelect.prototype.updateDelimeter = function (delimChar, e) {
        this.updateData(delimChar, e);
    };
    MultiSelect.prototype.onMouseClick = function (e) {
        this.scrollFocusStatus = false;
        var target = e.target;
        var li = closest(target, '.' + dropDownBaseClasses.li);
        var headerLi = closest(target, '.' + dropDownBaseClasses.group);
        if (headerLi && this.enableGroupCheckBox && this.mode === 'CheckBox' && this.fields.groupBy) {
            target = target.classList.contains('e-list-group-item') ? target.firstElementChild.lastElementChild
                : e.target;
            if (target.classList.contains('e-check')) {
                this.selectAllItem(false, e);
                target.classList.remove('e-check');
                target.classList.remove('e-stop');
                closest(target, '.' + 'e-list-group-item').classList.remove('e-active');
                target.setAttribute('aria-selected', 'false');
            }
            else {
                this.selectAllItem(true, e);
                target.classList.remove('e-stop');
                target.classList.add('e-check');
                closest(target, '.' + 'e-list-group-item').classList.add('e-active');
                target.setAttribute('aria-selected', 'true');
            }
            this.refreshSelection();
            this.checkSelectAll();
        }
        else {
            if (this.isValidLI(li)) {
                var limit = this.value && this.value.length ? this.value.length : 0;
                if (li.classList.contains('e-active')) {
                    limit = limit - 1;
                }
                if (limit < this.maximumSelectionLength) {
                    this.updateListSelection(li, e);
                    this.checkPlaceholderSize();
                    this.addListFocus(li);
                    if ((this.allowCustomValue || this.allowFiltering) && this.mainList && this.listData) {
                        if (this.mode !== 'CheckBox') {
                            this.focusAtLastListItem(li.getAttribute('data-value'));
                        }
                        this.refreshSelection();
                    }
                    else {
                        this.makeTextBoxEmpty();
                    }
                }
                if (this.mode === 'CheckBox') {
                    this.updateDelimView();
                    this.updateDelimeter(this.delimiterChar, e);
                    this.refreshInputHight();
                }
                else {
                    this.updateDelimeter(this.delimiterChar, e);
                }
                this.checkSelectAll();
                this.refreshPopup();
                if (this.hideSelectedItem) {
                    this.focusAtFirstListItem();
                }
                if (this.closePopupOnSelect) {
                    this.hidePopup();
                }
                else {
                    e.preventDefault();
                }
                this.makeTextBoxEmpty();
                this.findGroupStart(target);
            }
            else {
                e.preventDefault();
            }
            if (this.mode !== 'CheckBox') {
                this.refreshListItems(isNullOrUndefined(li) ? null : li.textContent);
            }
            this.refreshPlaceHolder();
            this.deselectHeader();
        }
    };
    MultiSelect.prototype.findGroupStart = function (target) {
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            var count = 0;
            var liChecked = 0;
            var liUnchecked = 0;
            var groupValues = void 0;
            if (this.itemTemplate && !target.getElementsByClassName('e-frame').length) {
                while (!target.getElementsByClassName('e-frame').length) {
                    target = target.parentElement;
                }
            }
            if (target.classList.contains('e-frame')) {
                target = target.parentElement.parentElement;
            }
            groupValues = this.findGroupAttrtibutes(target, liChecked, liUnchecked, count, 0);
            groupValues = this.findGroupAttrtibutes(target, groupValues[0], groupValues[1], groupValues[2], 1);
            while (!target.classList.contains('e-list-group-item')) {
                if (target.classList.contains('e-list-icon')) {
                    target = target.parentElement;
                }
                target = target.previousElementSibling;
                if (target == null) {
                    break;
                }
            }
            this.updateCheckBox(target, groupValues[0], groupValues[1], groupValues[2]);
        }
    };
    MultiSelect.prototype.findGroupAttrtibutes = function (listElement, checked, unChecked, count, position) {
        while (!listElement.classList.contains('e-list-group-item')) {
            if (listElement.classList.contains('e-list-icon')) {
                listElement = listElement.parentElement;
            }
            if (listElement.getElementsByClassName('e-frame')[0].classList.contains('e-check') &&
                listElement.classList.contains('e-list-item')) {
                checked++;
            }
            else if (listElement.classList.contains('e-list-item')) {
                unChecked++;
            }
            count++;
            listElement = position ? listElement.nextElementSibling : listElement.previousElementSibling;
            if (listElement == null) {
                break;
            }
        }
        return [checked, unChecked, count];
    };
    MultiSelect.prototype.updateCheckBox = function (groupHeader, checked, unChecked, count) {
        if (groupHeader === null) {
            return;
        }
        var checkBoxElement = groupHeader.getElementsByClassName('e-frame')[0];
        if (count === checked) {
            checkBoxElement.classList.remove('e-stop');
            checkBoxElement.classList.add('e-check');
            closest(checkBoxElement, '.' + 'e-list-group-item').classList.add('e-active');
            groupHeader.setAttribute('aria-selected', 'true');
        }
        else if (count === unChecked) {
            checkBoxElement.classList.remove('e-check');
            checkBoxElement.classList.remove('e-stop');
            closest(checkBoxElement, '.' + 'e-list-group-item').classList.remove('e-active');
            groupHeader.setAttribute('aria-selected', 'false');
        }
        else if (this.maximumSelectionLength === checked - 1) {
            checkBoxElement.classList.remove('e-stop');
            groupHeader.setAttribute('aria-selected', 'true');
            closest(checkBoxElement, '.' + 'e-list-group-item').classList.add('e-active');
            checkBoxElement.classList.add('e-check');
        }
        else {
            checkBoxElement.classList.remove('e-check');
            checkBoxElement.classList.add('e-stop');
            closest(checkBoxElement, '.' + 'e-list-group-item').classList.add('e-active');
            groupHeader.setAttribute('aria-selected', 'false');
        }
    };
    MultiSelect.prototype.deselectHeader = function () {
        var limit = this.value && this.value.length ? this.value.length : 0;
        var collection = this.list.querySelectorAll('li.e-list-group-item:not(.e-active)');
        if (limit < this.maximumSelectionLength) {
            removeClass(collection, 'e-disable');
        }
        if (limit === this.maximumSelectionLength) {
            addClass(collection, 'e-disable');
        }
    };
    MultiSelect.prototype.onMouseOver = function (e) {
        var currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
        if (currentLi === null && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)
            && this.enableGroupCheckBox) {
            currentLi = closest(e.target, '.' + dropDownBaseClasses.group);
        }
        this.addListHover(currentLi);
    };
    MultiSelect.prototype.onMouseLeave = function (e) {
        this.removeHover();
    };
    MultiSelect.prototype.onListMouseDown = function (e) {
        e.preventDefault();
        this.scrollFocusStatus = true;
    };
    MultiSelect.prototype.onDocumentClick = function (e) {
        if (this.mode !== 'CheckBox') {
            var target = e.target;
            if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
                !this.overAllWrapper.contains(e.target)) {
                this.scrollFocusStatus = false;
            }
            else {
                this.scrollFocusStatus = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
            }
        }
    };
    MultiSelect.prototype.wireListEvents = function () {
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        EventHandler.add(this.list, 'mousedown', this.onListMouseDown, this);
        EventHandler.add(this.list, 'mouseup', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    
    MultiSelect.prototype.unwireListEvents = function () {
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        if (this.list) {
            EventHandler.remove(this.list, 'mousedown', this.onListMouseDown);
            EventHandler.remove(this.list, 'mouseup', this.onMouseClick);
            EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
            EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
        }
    };
    
    MultiSelect.prototype.hideOverAllClear = function () {
        if (!this.value || !this.value.length || this.inputElement.value === '') {
            this.overAllClear.style.display = 'none';
        }
    };
    MultiSelect.prototype.showOverAllClear = function () {
        if (((this.value && this.value.length) || this.inputElement.value !== '') && this.showClearButton && this.readonly !== true) {
            this.overAllClear.style.display = '';
        }
        else {
            this.overAllClear.style.display = 'none';
        }
    };
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    MultiSelect.prototype.focusIn = function () {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
        }
    };
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    MultiSelect.prototype.focusOut = function () {
        if (document.activeElement === this.inputElement && this.enabled) {
            this.inputElement.blur();
        }
    };
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    MultiSelect.prototype.showSpinner = function () {
        if (isNullOrUndefined(this.spinnerElement)) {
            if (this.overAllClear.style.display !== 'none') {
                this.spinnerElement = this.overAllClear;
            }
            else {
                this.spinnerElement = this.createElement('span', { className: CLOSEICON_CLASS$1 + ' ' + SPINNER_CLASS$1 });
                this.componentWrapper.appendChild(this.spinnerElement);
            }
            createSpinner({ target: this.spinnerElement, width: Browser.isDevice ? '16px' : '14px' }, this.createElement);
            addClass([this.spinnerElement], DISABLE_ICON);
            showSpinner(this.spinnerElement);
        }
    };
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    MultiSelect.prototype.hideSpinner = function () {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], DISABLE_ICON);
            if (this.spinnerElement.classList.contains(SPINNER_CLASS$1)) {
                detach(this.spinnerElement);
            }
            else {
                this.spinnerElement.innerHTML = '';
            }
            this.spinnerElement = null;
        }
    };
    MultiSelect.prototype.updateDelimView = function () {
        if (this.delimiterWrapper) {
            this.hideDelimWrapper();
        }
        if (this.chipCollectionWrapper) {
            this.chipCollectionWrapper.style.display = 'none';
        }
        this.viewWrapper.style.display = '';
        this.viewWrapper.style.width = '';
        this.viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        if (this.value && this.value.length) {
            var data = '';
            var temp = void 0;
            var tempData = void 0;
            var tempIndex = 1;
            var wrapperleng = void 0;
            var remaining = void 0;
            var downIconWidth = 0;
            var overAllContainer = void 0;
            this.viewWrapper.innerHTML = '';
            var l10nLocale = {
                noRecordsTemplate: 'No Records Found',
                actionFailureTemplate: 'The Request Failed',
                overflowCountTemplate: '+${count} more..',
                totalCountTemplate: '${count} selected'
            };
            var l10n = new L10n(this.getLocaleName(), {}, this.locale);
            if (l10n.getConstant('actionFailureTemplate') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.locale);
            }
            var remainContent = l10n.getConstant('overflowCountTemplate');
            var raminElement = this.createElement('span', {
                className: REMAIN_WRAPPER
            });
            var compiledString = compile(remainContent);
            var totalCompiledString = compile(l10n.getConstant('totalCountTemplate'));
            raminElement.appendChild(compiledString({ 'count': this.value.length }, null, null, null, !this.isStringTemplate)[0]);
            this.viewWrapper.appendChild(raminElement);
            var remainSize = raminElement.offsetWidth;
            remove(raminElement);
            if (this.showDropDownIcon) {
                downIconWidth = this.dropIcon.offsetWidth +
                    parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            }
            if (!isNullOrUndefined(this.value)) {
                for (var index = 0; !isNullOrUndefined(this.value[index]); index++) {
                    data += (index === 0) ? '' : this.delimiterChar + ' ';
                    temp = this.getOverflowVal(index);
                    data += temp;
                    temp = this.viewWrapper.innerHTML;
                    this.viewWrapper.innerHTML = data;
                    wrapperleng = this.viewWrapper.offsetWidth +
                        parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
                    overAllContainer = this.componentWrapper.offsetWidth -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
                    if ((wrapperleng + downIconWidth) > overAllContainer) {
                        if (tempData !== undefined && tempData !== '') {
                            temp = tempData;
                            index = tempIndex + 1;
                        }
                        this.viewWrapper.innerHTML = temp;
                        remaining = this.value.length - index;
                        wrapperleng = this.viewWrapper.offsetWidth;
                        while (((wrapperleng + remainSize + downIconWidth) > overAllContainer) && wrapperleng !== 0
                            && this.viewWrapper.innerHTML !== '') {
                            var textArr = this.viewWrapper.innerHTML.split(this.delimiterChar);
                            textArr.pop();
                            this.viewWrapper.innerHTML = textArr.join(this.delimiterChar);
                            remaining++;
                            wrapperleng = this.viewWrapper.offsetWidth;
                        }
                        break;
                    }
                    else if ((wrapperleng + remainSize + downIconWidth) <= overAllContainer) {
                        tempData = data;
                        tempIndex = index;
                    }
                    else if (index === 0) {
                        tempData = '';
                        tempIndex = -1;
                    }
                }
            }
            if (remaining > 0) {
                var totalWidth = overAllContainer - downIconWidth;
                this.viewWrapper.appendChild(this.updateRemainTemplate(raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth));
                this.updateRemainWidth(this.viewWrapper, totalWidth);
                this.updateRemainingText(raminElement, downIconWidth, remaining, compiledString, totalCompiledString);
            }
        }
        else {
            this.viewWrapper.innerHTML = '';
            this.viewWrapper.style.display = 'none';
        }
    };
    MultiSelect.prototype.updateRemainWidth = function (viewWrapper, totalWidth) {
        if (viewWrapper.classList.contains(TOTAL_COUNT_WRAPPER) && totalWidth < (viewWrapper.offsetWidth +
            parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10)
            + parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10))) {
            viewWrapper.style.width = totalWidth + 'px';
        }
    };
    MultiSelect.prototype.updateRemainTemplate = function (raminElement, viewWrapper, remaining, compiledString, totalCompiledString, totalWidth) {
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3 && viewWrapper.firstChild.nodeValue === '') {
            viewWrapper.removeChild(viewWrapper.firstChild);
        }
        raminElement.innerHTML = '';
        raminElement.appendChild((viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) ?
            compiledString({ 'count': remaining }, null, null, null, !this.isStringTemplate)[0] :
            totalCompiledString({ 'count': remaining }, null, null, null, !this.isStringTemplate)[0]);
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) {
            viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        }
        else {
            viewWrapper.classList.add(TOTAL_COUNT_WRAPPER);
            this.updateRemainWidth(viewWrapper, totalWidth);
        }
        return raminElement;
    };
    MultiSelect.prototype.updateRemainingText = function (raminElement, downIconWidth, remaining, compiledString, totalCompiledString) {
        var overAllContainer = this.componentWrapper.offsetWidth -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
        var wrapperleng = this.viewWrapper.offsetWidth + parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
        if (((wrapperleng + downIconWidth) >= overAllContainer) && wrapperleng !== 0 && this.viewWrapper.firstChild &&
            this.viewWrapper.firstChild.nodeType === 3) {
            while (((wrapperleng + downIconWidth) > overAllContainer) && wrapperleng !== 0 && this.viewWrapper.firstChild &&
                this.viewWrapper.firstChild.nodeType === 3) {
                var textArr = this.viewWrapper.firstChild.nodeValue.split(this.delimiterChar);
                textArr.pop();
                this.viewWrapper.firstChild.nodeValue = textArr.join(this.delimiterChar);
                if (this.viewWrapper.firstChild.nodeValue === '') {
                    this.viewWrapper.removeChild(this.viewWrapper.firstChild);
                }
                remaining++;
                wrapperleng = this.viewWrapper.offsetWidth;
            }
            var totalWidth = overAllContainer - downIconWidth;
            this.updateRemainTemplate(raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth);
        }
    };
    MultiSelect.prototype.getOverflowVal = function (index) {
        var temp;
        if (this.mainData && this.mainData.length) {
            if (this.mode === 'CheckBox') {
                var newTemp = this.listData;
                this.listData = this.mainData;
                temp = this.getTextByValue(this.value[index]);
                this.listData = newTemp;
            }
            else {
                temp = this.getTextByValue(this.value[index]);
            }
        }
        else {
            temp = this.value[index];
        }
        return temp;
    };
    MultiSelect.prototype.unWireEvent = function () {
        EventHandler.remove(this.componentWrapper, 'mousedown', this.wrapperClick);
        EventHandler.remove(window, 'resize', this.windowResize);
        EventHandler.remove(this.inputElement, 'focus', this.focusInHandler);
        EventHandler.remove(this.inputElement, 'keydown', this.onKeyDown);
        if (this.mode !== 'CheckBox') {
            EventHandler.remove(this.inputElement, 'input', this.onInput);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.KeyUp);
        var formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        EventHandler.remove(this.inputElement, 'blur', this.onBlur);
        EventHandler.remove(this.componentWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.componentWrapper, 'mouseout', this.mouseOut);
        EventHandler.remove(this.overAllClear, 'mousedown', this.ClearAll);
        EventHandler.remove(this.inputElement, 'paste', this.pasteHandler);
    };
    MultiSelect.prototype.selectAllItem = function (state, event, list) {
        var li;
        li = this.list.querySelectorAll(state ?
            'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
            'li.e-list-item[aria-selected="true"]:not(.e-reorder-hide)');
        if (this.value && this.value.length && this.isPopupOpen() && event && event.target
            && closest(event.target, '.e-close-hooker')) {
            li = this.mainList.querySelectorAll(state ?
                'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
                'li.e-list-item[aria-selected="true"]:not(.e-reorder-hide)');
        }
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            var target = (event ? event.target : null);
            target = (event && event.keyCode === 32) ? list : target;
            target = (target && target.classList.contains('e-frame')) ? target.parentElement.parentElement : target;
            if (target && target.classList.contains('e-list-group-item')) {
                var listElement = target.nextElementSibling;
                if (isNullOrUndefined(listElement)) {
                    return;
                }
                while (listElement.classList.contains('e-list-item')) {
                    if (state) {
                        if (!listElement.firstElementChild.lastElementChild.classList.contains('e-check')) {
                            var selectionLimit = this.value && this.value.length ? this.value.length : 0;
                            if (listElement.classList.contains('e-active')) {
                                selectionLimit -= 1;
                            }
                            if (selectionLimit < this.maximumSelectionLength) {
                                this.updateListSelection(listElement, event);
                            }
                        }
                    }
                    else {
                        if (listElement.firstElementChild.lastElementChild.classList.contains('e-check')) {
                            this.updateListSelection(listElement, event);
                        }
                    }
                    listElement = listElement.nextElementSibling;
                    if (listElement == null) {
                        break;
                    }
                }
                if (target.classList.contains('e-list-group-item')) {
                    var focusedElement = this.list.getElementsByClassName('e-item-focus')[0];
                    if (focusedElement) {
                        focusedElement.classList.remove('e-item-focus');
                    }
                    state ? target.classList.add('e-active') : target.classList.remove('e-active');
                    target.classList.add('e-item-focus');
                }
                this.textboxValueUpdate();
                this.checkPlaceholderSize();
                if (!this.changeOnBlur && event) {
                    this.updateValueState(event, this.value, this.tempValues);
                }
            }
            else {
                this.updateValue(event, li, state);
            }
        }
        else {
            this.updateValue(event, li, state);
        }
    };
    MultiSelect.prototype.updateValue = function (event, li, state) {
        var _this = this;
        var length = li.length;
        if (li && li.length) {
            var index_1 = 0;
            var count_1 = 0;
            if (this.enableGroupCheckBox) {
                count_1 = state ? this.maximumSelectionLength - (this.value ? this.value.length : 0) : li.length;
            }
            else {
                count_1 = state ? this.maximumSelectionLength - (this.value ? this.value.length : 0) : this.maximumSelectionLength;
            }
            while (index_1 < length && index_1 <= 50 && index_1 < count_1) {
                this.updateListSelection(li[index_1], event, length - index_1);
                this.findGroupStart(li[index_1]);
                index_1++;
            }
            if (length > 50) {
                setTimeout(function () {
                    while (index_1 < length && index_1 < count_1) {
                        _this.updateListSelection(li[index_1], event, length - index_1);
                        _this.findGroupStart(li[index_1]);
                        index_1++;
                    }
                    if (!(isBlazor() && _this.isServerRendered)) {
                        _this.updatedataValueItems(event);
                    }
                }, 0);
            }
        }
        if (!(isBlazor() && this.isServerRendered)) {
            this.updatedataValueItems(event);
            this.checkPlaceholderSize();
        }
    };
    MultiSelect.prototype.updatedataValueItems = function (event) {
        this.deselectHeader();
        this.textboxValueUpdate(event);
    };
    MultiSelect.prototype.textboxValueUpdate = function (event) {
        if (this.mode !== 'Box' && !this.isPopupOpen()) {
            this.updateDelimView();
        }
        else {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        if (this.mode === 'CheckBox') {
            this.updateDelimView();
            this.updateDelimeter(this.delimiterChar, event);
            this.refreshInputHight();
        }
        else {
            this.updateDelimeter(this.delimiterChar, event);
        }
        this.refreshPlaceHolder();
    };
    MultiSelect.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    };
    MultiSelect.prototype.updateDataSource = function (prop) {
        if (isNullOrUndefined(this.list)) {
            this.renderPopup();
        }
        else {
            this.resetList(this.dataSource);
        }
        if (this.value && this.value.length && !(isBlazor() && this.isServerRendered)) {
            this.setProperties({ 'value': this.value });
            this.refreshSelection();
        }
    };
    MultiSelect.prototype.onLoadSelect = function () {
        this.setDynValue = true;
        this.renderPopup();
    };
    MultiSelect.prototype.selectAllItems = function (state, event) {
        var _this = this;
        if (isNullOrUndefined(this.list)) {
            this.selectAllAction = function () {
                if (_this.mode === 'CheckBox' && _this.showSelectAll) {
                    var args = {
                        module: 'CheckBoxSelection',
                        enable: _this.mode === 'CheckBox',
                        value: state ? 'check' : 'uncheck'
                    };
                    _this.notify('checkSelectAll', args);
                }
                _this.selectAllItem(state, event);
                _this.selectAllAction = null;
            };
            _super.prototype.render.call(this);
        }
        else {
            this.selectAllAction = null;
            if (this.mode === 'CheckBox' && this.showSelectAll) {
                var args = {
                    value: state ? 'check' : 'uncheck',
                    enable: this.mode === 'CheckBox',
                    module: 'CheckBoxSelection'
                };
                this.notify('checkSelectAll', args);
            }
            this.selectAllItem(state, event);
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    MultiSelect.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    
    /**
     * Dynamically change the value of properties.
     * @private
     */
    MultiSelect.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource))) {
            this.mainList = null;
            this.mainData = null;
            this.isFirstClick = false;
            this.isDynamicDataChange = true;
        }
        if (this.getModuleName() === 'multiselect') {
            this.filterAction = false;
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'query':
                case 'dataSource':
                    if (this.mode === 'CheckBox' && this.showSelectAll) {
                        if (!isNullOrUndefined(this.popupObj)) {
                            this.popupObj.destroy();
                            this.popupObj = null;
                        }
                        this.renderPopup();
                    }
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttribute();
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp.showClearButton);
                    break;
                case 'text':
                    this.updateVal(this.value, this.value, 'text');
                    break;
                case 'value':
                    this.updateVal(this.value, oldProp.value, 'value');
                    this.addValidInputClass();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    this.popupObj.setProperties({ width: this.calcPopupWidth() });
                    break;
                case 'placeholder':
                    this.refreshPlaceHolder();
                    break;
                case 'filterBarPlaceholder':
                    if (this.allowFiltering) {
                        this.notify('filterBarPlaceholder', { filterBarPlaceholder: newProp.filterBarPlaceholder });
                    }
                    break;
                case 'delimiterChar':
                    if (this.mode !== 'Box') {
                        this.updateDelimView();
                    }
                    this.updateData(newProp.delimiterChar);
                    break;
                case 'cssClass':
                    this.updateOldPropCssClass(oldProp.cssClass);
                    this.updateCssClass();
                    break;
                case 'enableRtl':
                    this.enableRTL(newProp.enableRtl);
                    _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
                    break;
                case 'readonly':
                    this.updateReadonly(newProp.readonly);
                    this.hidePopup();
                    break;
                case 'enabled':
                    this.hidePopup();
                    this.enable(newProp.enabled);
                    break;
                case 'showSelectAll':
                    if (this.popupObj) {
                        this.popupObj.destroy();
                        this.popupObj = null;
                    }
                    this.renderPopup();
                    break;
                case 'showDropDownIcon':
                    this.dropDownIcon();
                    break;
                case 'floatLabelType':
                    this.setFloatLabelType();
                    this.addValidInputClass();
                    break;
                case 'enableSelectionOrder':
                    break;
                case 'selectAllText':
                    this.notify('selectAllText', false);
                    break;
                case 'popupHeight':
                case 'headerTemplate':
                case 'footerTemplate':
                    this.reInitializePoup();
                    break;
                case 'allowFiltering':
                    if (this.mode === 'CheckBox' && this.popupObj) {
                        this.reInitializePoup();
                    }
                    this.updateSelectElementData(this.allowFiltering);
                    break;
                default:
                    var msProps = void 0;
                    msProps = this.getPropObject(prop, newProp, oldProp);
                    _super.prototype.onPropertyChanged.call(this, msProps.newProperty, msProps.oldProperty);
                    break;
            }
        }
    };
    MultiSelect.prototype.reInitializePoup = function () {
        if (this.popupObj) {
            this.popupObj.destroy();
            this.popupObj = null;
        }
        this.renderPopup();
    };
    MultiSelect.prototype.updateVal = function (newProp, oldProp, prop) {
        if (!this.list) {
            this.onLoadSelect();
        }
        else if (!this.inputFocus) {
            if (prop === 'text') {
                this.initialTextUpdate();
                newProp = this.value;
            }
            if (isNullOrUndefined(this.value) || this.value.length === 0) {
                this.tempValues = oldProp;
            }
            this.initialValueUpdate();
            if (this.mode !== 'Box') {
                this.updateDelimView();
            }
            this.refreshInputHight();
            this.refreshPlaceHolder();
            if (this.mode !== 'CheckBox' && this.changeOnBlur) {
                this.updateValueState(null, newProp, oldProp);
            }
            this.checkPlaceholderSize();
        }
        if (!this.changeOnBlur) {
            this.updateValueState(null, newProp, oldProp);
        }
    };
    /**
     * Adds a new item to the multiselect popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     */
    MultiSelect.prototype.addItem = function (items, itemIndex) {
        _super.prototype.addItem.call(this, items, itemIndex);
    };
    /**
     * Hides the popup, if the popup in a open state.
     * @returns void
     */
    MultiSelect.prototype.hidePopup = function () {
        var _this = this;
        var delay = 100;
        if (this.isPopupOpen()) {
            var animModel = {
                name: 'FadeOut',
                duration: 100,
                delay: delay ? delay : 0
            };
            var eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
            this.trigger('close', eventArgs, function (eventArgs) {
                if (!eventArgs.cancel) {
                    _this.beforePopupOpen = false;
                    _this.overAllWrapper.classList.remove(iconAnimation);
                    _this.popupObj.hide(new Animation(eventArgs.animation));
                    attributes(_this.inputElement, { 'aria-expanded': 'false' });
                    if (_this.allowFiltering) {
                        _this.notify('inputFocus', { module: 'CheckBoxSelection', enable: _this.mode === 'CheckBox', value: 'clear' });
                    }
                    _this.popupObj.hide();
                    removeClass([document.body, _this.popupObj.element], 'e-popup-full-page');
                    EventHandler.remove(_this.list, 'keydown', _this.onKeyDown);
                }
            });
        }
    };
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    MultiSelect.prototype.showPopup = function () {
        if (!this.enabled) {
            return;
        }
        if ((isBlazor() && this.isServerRendered) && this.itemTemplate) {
            this.DropDownBaseupdateBlazorTemplates(true, false, false, false, false, false, false, false);
            if (this.mode !== 'CheckBox' && this.list) {
                this.refreshSelection();
            }
        }
        if (!this.ulElement) {
            this.beforePopupOpen = true;
            _super.prototype.render.call(this);
            return;
        }
        var mainLiLength = this.ulElement.querySelectorAll('li.' + 'e-list-item').length;
        var liLength = this.ulElement.querySelectorAll('li.'
            + dropDownBaseClasses.li + '.' + HIDE_LIST).length;
        if (mainLiLength > 0 && (mainLiLength === liLength) && (liLength === this.mainData.length)) {
            this.beforePopupOpen = false;
            return;
        }
        this.onPopupShown();
    };
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    MultiSelect.prototype.selectAll = function (state) {
        this.isSelectAll = true;
        this.selectAllItems(state);
    };
    MultiSelect.prototype.getModuleName = function () {
        return 'multiselect';
    };
    
    /**
     * Allows you to clear the selected values from the Multiselect component.
     * @returns void
     */
    MultiSelect.prototype.clear = function () {
        this.selectAll(false);
        this.setProperties({ value: null }, true);
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    MultiSelect.prototype.render = function () {
        this.setDynValue = this.initStatus = false;
        this.isSelectAll = false;
        this.searchWrapper = this.createElement('span', { className: SEARCHBOX_WRAPPER + ' ' + ((this.mode === 'Box') ? BOX_ELEMENT : '') });
        this.viewWrapper = this.createElement('span', { className: DELIMITER_VIEW + ' ' + DELIMITER_WRAPPER, styles: 'display:none;' });
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS$1, styles: 'display:none;'
        });
        this.componentWrapper = this.createElement('div', { className: ELEMENT_WRAPPER });
        this.overAllWrapper = this.createElement('div', { className: OVER_ALL_WRAPPER });
        if (this.mode === 'CheckBox') {
            addClass([this.overAllWrapper], 'e-checkbox');
        }
        if (Browser.isDevice) {
            this.componentWrapper.classList.add(ELEMENT_MOBILE_WRAPPER);
        }
        this.setWidth(this.width);
        this.overAllWrapper.appendChild(this.componentWrapper);
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: POPUP_WRAPPER });
        if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
            this.delimiterWrapper = this.createElement('span', { className: DELIMITER_WRAPPER, styles: 'display:none' });
            this.componentWrapper.appendChild(this.delimiterWrapper);
        }
        else {
            this.chipCollectionWrapper = this.createElement('span', {
                className: CHIP_WRAPPER$1,
                styles: 'display:none'
            });
            if (this.mode === 'Default') {
                this.chipCollectionWrapper.setAttribute('id', getUniqueID('chip_default'));
            }
            else if (this.mode === 'Box') {
                this.chipCollectionWrapper.setAttribute('id', getUniqueID('chip_box'));
            }
            this.componentWrapper.appendChild(this.chipCollectionWrapper);
        }
        if (this.mode !== 'Box') {
            this.componentWrapper.appendChild(this.viewWrapper);
        }
        this.componentWrapper.appendChild(this.searchWrapper);
        if (this.showClearButton && !Browser.isDevice) {
            this.componentWrapper.appendChild(this.overAllClear);
        }
        else {
            this.componentWrapper.classList.add(CLOSE_ICON_HIDE);
        }
        this.dropDownIcon();
        this.inputElement = this.createElement('input', {
            className: INPUT_ELEMENT,
            attrs: {
                spellcheck: 'false',
                type: 'text',
                autocomplete: 'off',
                tabindex: '0'
            }
        });
        if (this.mode === 'Default' || this.mode === 'Box') {
            this.inputElement.setAttribute('aria-describedby', this.chipCollectionWrapper.id);
        }
        if (this.element.tagName !== this.getNgDirective()) {
            this.element.style.display = 'none';
        }
        if (this.element.tagName === this.getNgDirective()) {
            this.element.appendChild(this.overAllWrapper);
            this.searchWrapper.appendChild(this.inputElement);
        }
        else {
            this.element.parentElement.insertBefore(this.overAllWrapper, this.element);
            this.searchWrapper.appendChild(this.inputElement);
            this.searchWrapper.appendChild(this.element);
            this.element.removeAttribute('tabindex');
        }
        if (this.floatLabelType !== 'Never') {
            createFloatLabel(this.overAllWrapper, this.searchWrapper, this.element, this.inputElement, this.value, this.floatLabelType, this.placeholder);
        }
        else if (this.floatLabelType === 'Never') {
            this.refreshPlaceHolder();
        }
        this.addValidInputClass();
        this.element.style.opacity = '';
        var id = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
        this.element.id = id;
        this.hiddenElement = this.createElement('select', {
            attrs: { 'aria-hidden': 'true', 'class': HIDDEN_ELEMENT, 'tabindex': '-1', 'multiple': '' }
        });
        this.componentWrapper.appendChild(this.hiddenElement);
        this.validationAttribute(this.element, this.hiddenElement);
        if (this.mode !== 'CheckBox') {
            this.hideOverAllClear();
        }
        this.wireEvent();
        this.enable(this.enabled);
        this.enableRTL(this.enableRtl);
        this.checkInitialValue();
        this.renderComplete();
    };
    MultiSelect.prototype.checkInitialValue = function () {
        var _this = this;
        var isData = this.dataSource instanceof Array ? (this.dataSource.length > 0)
            : !isNullOrUndefined(this.dataSource);
        if (!(this.value && this.value.length) &&
            isNullOrUndefined(this.text) &&
            !isData &&
            this.element.tagName === 'SELECT' &&
            this.element.options.length > 0) {
            var optionsElement = this.element.options;
            var valueCol = [];
            var textCol = '';
            for (var index = 0, optionsLen = optionsElement.length; index < optionsLen; index++) {
                var opt = optionsElement[index];
                if (!isNullOrUndefined(opt.getAttribute('selected'))) {
                    (opt.getAttribute('value')) ? valueCol.push(opt.getAttribute('value')) : textCol += (opt.text + this.delimiterChar);
                }
            }
            if (valueCol.length > 0) {
                this.setProperties({ value: valueCol }, true);
            }
            else if (textCol !== '') {
                this.setProperties({ text: textCol }, true);
            }
            if (valueCol.length > 0 || textCol !== '') {
                this.refreshInputHight();
                this.refreshPlaceHolder();
            }
        }
        if ((this.value && this.value.length) || !isNullOrUndefined(this.text)) {
            this.renderPopup();
        }
        if (!isNullOrUndefined(this.text) && (isNullOrUndefined(this.value) || this.value.length === 0)) {
            this.initialTextUpdate();
        }
        if (this.value && this.value.length) {
            if (!(this.dataSource instanceof DataManager)) {
                this.initialValueUpdate();
                this.initialUpdate();
            }
            else {
                this.setInitialValue = function () {
                    _this.initStatus = false;
                    _this.initialValueUpdate();
                    _this.initialUpdate();
                    _this.setInitialValue = null;
                    _this.initStatus = true;
                };
            }
            this.updateTempValue();
        }
        else {
            this.initialUpdate();
        }
        this.initStatus = true;
        this.checkAutoFocus();
        if (!isNullOrUndefined(this.text)) {
            this.element.setAttribute('data-initial-value', this.text);
        }
    };
    MultiSelect.prototype.checkAutoFocus = function () {
        if (this.element.hasAttribute('autofocus')) {
            this.inputElement.focus();
        }
    };
    MultiSelect.prototype.setFloatLabelType = function () {
        removeFloating(this.overAllWrapper, this.componentWrapper, this.searchWrapper, this.inputElement, this.value, this.floatLabelType, this.placeholder);
        if (this.floatLabelType !== 'Never') {
            createFloatLabel(this.overAllWrapper, this.searchWrapper, this.element, this.inputElement, this.value, this.floatLabelType, this.placeholder);
        }
    };
    MultiSelect.prototype.addValidInputClass = function () {
        if ((!isNullOrUndefined(this.value) && this.value.length) || this.floatLabelType === 'Always') {
            addClass([this.overAllWrapper], 'e-valid-input');
        }
        else {
            removeClass([this.overAllWrapper], 'e-valid-input');
        }
    };
    MultiSelect.prototype.dropDownIcon = function () {
        if (this.showDropDownIcon) {
            this.dropIcon = this.createElement('span', { className: dropdownIcon });
            this.componentWrapper.appendChild(this.dropIcon);
            addClass([this.componentWrapper], ['e-down-icon']);
        }
        else {
            if (!isNullOrUndefined(this.dropIcon)) {
                this.dropIcon.parentElement.removeChild(this.dropIcon);
                removeClass([this.componentWrapper], ['e-down-icon']);
            }
        }
    };
    MultiSelect.prototype.initialUpdate = function () {
        if (this.mode !== 'Box') {
            this.updateDelimView();
        }
        this.updateCssClass();
        this.updateHTMLAttribute();
        this.updateReadonly(this.readonly);
        this.refreshInputHight();
        this.checkPlaceholderSize();
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    MultiSelect.prototype.destroy = function () {
        if (this.popupObj) {
            this.popupObj.hide();
        }
        this.notify(destroy, {});
        this.unwireListEvents();
        this.unWireEvent();
        this.list = null;
        this.popupObj = null;
        this.mainList = null;
        this.mainData = null;
        this.filterParent = null;
        this.ulElement = null;
        _super.prototype.destroy.call(this);
        var temp = ['readonly', 'aria-disabled', 'aria-placeholder', 'placeholder'];
        var length = temp.length;
        while (length > 0) {
            this.inputElement.removeAttribute(temp[length - 1]);
            length--;
        }
        this.element.removeAttribute('data-initial-value');
        this.element.style.display = 'block';
        if (this.overAllWrapper.parentElement) {
            if (this.overAllWrapper.parentElement.tagName === this.getNgDirective()) {
                remove(this.overAllWrapper);
            }
            else {
                this.overAllWrapper.parentElement.insertBefore(this.element, this.overAllWrapper);
                remove(this.overAllWrapper);
            }
        }
    };
    
    __decorate$5([
        Complex({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], MultiSelect.prototype, "fields", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "enablePersistence", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "groupTemplate", void 0);
    __decorate$5([
        Property('No Records Found')
    ], MultiSelect.prototype, "noRecordsTemplate", void 0);
    __decorate$5([
        Property('The Request Failed')
    ], MultiSelect.prototype, "actionFailureTemplate", void 0);
    __decorate$5([
        Property('None')
    ], MultiSelect.prototype, "sortOrder", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "enabled", void 0);
    __decorate$5([
        Property([])
    ], MultiSelect.prototype, "dataSource", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "query", void 0);
    __decorate$5([
        Property('StartsWith')
    ], MultiSelect.prototype, "filterType", void 0);
    __decorate$5([
        Property(1000)
    ], MultiSelect.prototype, "zIndex", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "ignoreAccent", void 0);
    __decorate$5([
        Property()
    ], MultiSelect.prototype, "locale", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "enableGroupCheckBox", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "cssClass", void 0);
    __decorate$5([
        Property('100%')
    ], MultiSelect.prototype, "width", void 0);
    __decorate$5([
        Property('300px')
    ], MultiSelect.prototype, "popupHeight", void 0);
    __decorate$5([
        Property('100%')
    ], MultiSelect.prototype, "popupWidth", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "placeholder", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "filterBarPlaceholder", void 0);
    __decorate$5([
        Property({})
    ], MultiSelect.prototype, "htmlAttributes", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "valueTemplate", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "headerTemplate", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "footerTemplate", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "itemTemplate", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "allowFiltering", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "changeOnBlur", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "allowCustomValue", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "showClearButton", void 0);
    __decorate$5([
        Property(1000)
    ], MultiSelect.prototype, "maximumSelectionLength", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "readonly", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "text", void 0);
    __decorate$5([
        Property(null)
    ], MultiSelect.prototype, "value", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "hideSelectedItem", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "closePopupOnSelect", void 0);
    __decorate$5([
        Property('Default')
    ], MultiSelect.prototype, "mode", void 0);
    __decorate$5([
        Property(',')
    ], MultiSelect.prototype, "delimiterChar", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "ignoreCase", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "showDropDownIcon", void 0);
    __decorate$5([
        Property('Never')
    ], MultiSelect.prototype, "floatLabelType", void 0);
    __decorate$5([
        Property(false)
    ], MultiSelect.prototype, "showSelectAll", void 0);
    __decorate$5([
        Property('Select All')
    ], MultiSelect.prototype, "selectAllText", void 0);
    __decorate$5([
        Property('Unselect All')
    ], MultiSelect.prototype, "unSelectAllText", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "enableSelectionOrder", void 0);
    __decorate$5([
        Property(true)
    ], MultiSelect.prototype, "openOnClick", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "change", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "removing", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "removed", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "selectedAll", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "beforeOpen", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "open", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "close", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "blur", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "focus", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "chipSelection", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "filtering", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "tagging", void 0);
    __decorate$5([
        Event()
    ], MultiSelect.prototype, "customValueSelection", void 0);
    MultiSelect = __decorate$5([
        NotifyPropertyChanges
    ], MultiSelect);
    return MultiSelect;
}(DropDownBase));

var ICON = 'e-icons';
var CHECKBOXFRAME$1 = 'e-frame';
var CHECK$1 = 'e-check';
var CHECKBOXWRAP$1 = 'e-checkbox-wrapper';
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
var FOCUS$1 = 'e-input-focus';
/**
 * The Multiselect enable CheckBoxSelection call this inject module.
 */
var CheckBoxSelection = /** @__PURE__ @class */ (function () {
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
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        this.parent.on('addItem', this.checboxCreate, this);
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
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
    };
    CheckBoxSelection.prototype.listOption = function (args) {
        var _this = this;
        if (isNullOrUndefined(this.parent.listCurrentOptions.itemCreated)) {
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
        Input.setPlaceholder(props.filterBarPlaceholder, this.filterInput);
    };
    CheckBoxSelection.prototype.checboxCreate = function (e) {
        var item;
        if (!isNullOrUndefined(e.item)) {
            item = e.item;
        }
        else {
            item = e;
        }
        if (this.parent.enableGroupCheckBox || (item.className !== 'e-list-group-item '
            && item.className !== 'e-list-group-item')) {
            var checkboxEle = createCheckBox(this.parent.createElement, true);
            var icon = select('div.' + ICON, item);
            var id = item.getAttribute('data-uid');
            item.insertBefore(checkboxEle, item.childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            select('.' + CHECKBOXFRAME$1, checkboxEle);
            var frame = select('.' + CHECKBOXFRAME$1, checkboxEle);
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
            if (isNullOrUndefined(this.checkAllParent)) {
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
                    if (!isNullOrUndefined(this.parent.filterParent)) {
                        append([this.checkAllParent], this.parent.filterParent);
                    }
                    else {
                        append([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                if (!this.parent.headerTemplate) {
                    if (!isNullOrUndefined(this.parent.filterParent)) {
                        this.parent.filterParent.parentNode.insertBefore(this.checkAllParent, this.parent.filterParent.nextSibling);
                    }
                    else {
                        prepend([this.checkAllParent], this.parent.popupWrapper);
                    }
                }
                EventHandler.add(this.checkAllParent, 'mousedown', this.clickHandler, this);
            }
            if (this.parent.list.classList.contains('e-nodata') || (this.parent.listData && this.parent.listData.length <= 1)) {
                this.checkAllParent.style.display = 'none';
            }
            else {
                this.checkAllParent.style.display = 'block';
            }
            this.parent.selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        }
        else if (!isNullOrUndefined(this.checkAllParent)) {
            this.checkAllParent.parentElement.removeChild(this.checkAllParent);
            this.checkAllParent = null;
        }
    };
    CheckBoxSelection.prototype.destroy = function () {
        this.removeEventListener();
    };
    CheckBoxSelection.prototype.listSelection = function (args) {
        var target;
        var isBlazorListbox = isBlazor() && (args.module && args.module === 'listbox');
        if (!isNullOrUndefined(args.e)) {
            var frameElm = args.li.querySelector('.e-checkbox-wrapper .e-frame');
            target = !isNullOrUndefined(args.e.target) ?
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
        if (!isNullOrUndefined(target)) {
            this.checkWrapper = closest(target, '.' + CHECKBOXWRAP$1);
        }
        if (!isNullOrUndefined(this.checkWrapper)) {
            var checkElement = select('.' + CHECKBOXFRAME$1, this.checkWrapper);
            var selectAll$$1 = false;
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK$1), args.li, args.e, selectAll$$1);
        }
    };
    CheckBoxSelection.prototype.validateCheckNode = function (checkWrap, isCheck, li, e, selectAll$$1) {
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true, selectAll$$1);
    };
    CheckBoxSelection.prototype.clickHandler = function (e) {
        var target;
        if (e.currentTarget.classList.contains(this.checkAllParent.className)) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.currentTarget;
        }
        this.checkWrapper = closest(target, '.' + CHECKBOXWRAP$1);
        var selectAll$$1 = true;
        if (!isNullOrUndefined(this.checkWrapper)) {
            var checkElement = select('.' + CHECKBOXFRAME$1, this.checkWrapper);
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK$1), null, e, selectAll$$1);
        }
        e.preventDefault();
    };
    CheckBoxSelection.prototype.changeState = function (wrapper, state, e, isPrevent, selectAll$$1) {
        var ariaState;
        var frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME$1)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK$1)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK$1);
            ariaState = 'true';
            if (selectAll$$1) {
                this.parent.selectAllItems(true, e);
                this.setLocale(true);
            }
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK$1) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK$1, INDETERMINATE]);
            ariaState = 'false';
            if (selectAll$$1) {
                this.parent.selectAllItems(false, e);
                this.setLocale();
            }
        }
        else if (state === 'indeterminate' && !(frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK$1]);
            frameSpan.classList.add(INDETERMINATE);
            ariaState = 'false';
            if (selectAll$$1) {
                this.parent.selectAllItems(false, e);
                this.setLocale();
            }
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    };
    CheckBoxSelection.prototype.setSearchBox = function (args) {
        if (isNullOrUndefined(this.parent.filterParent)) {
            this.parent.filterParent = this.parent.createElement('span', {
                className: filterParent
            });
            this.filterInput = this.parent.createElement('input', {
                attrs: { type: 'text' },
                className: filterInput
            });
            this.parent.element.parentNode.insertBefore(this.filterInput, this.parent.element);
            var backIcon = false;
            if (Browser.isDevice) {
                backIcon = true;
                this.parent.mobFilter = false;
            }
            this.filterInputObj = Input.createInput({
                element: this.filterInput,
                buttons: backIcon ? [searchBackIcon, filterBarClearIcon] : [filterBarClearIcon],
                properties: { placeholder: this.parent.filterBarPlaceholder }
            }, this.parent.createElement);
            append([this.filterInputObj.container], this.parent.filterParent);
            prepend([this.parent.filterParent], args.popupElement);
            attributes(this.filterInput, {
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
            if (!Browser.isDevice && this.clearIconElement) {
                EventHandler.add(this.clearIconElement, 'mousedown', this.clearText, this);
                this.clearIconElement.style.visibility = 'hidden';
            }
            EventHandler.add(this.filterInput, 'input', this.parent.onInput, this.parent);
            EventHandler.add(this.filterInput, 'keyup', this.parent.KeyUp, this.parent);
            EventHandler.add(this.filterInput, 'keydown', this.parent.onKeyDown, this.parent);
            EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            EventHandler.add(this.filterInput, 'paste', this.parent.pasteHandler, this.parent);
            this.parent.searchBoxHeight = (this.filterInputObj.container.parentElement).getBoundingClientRect().height;
            return this.filterInputObj;
        }
    };
    
    CheckBoxSelection.prototype.clickOnBackIcon = function (e) {
        this.parent.hidePopup();
        removeClass([document.body, this.parent.popupObj.element], popupFullScreen);
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
        attributes(this.parent.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
        addClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.setSearchBoxPosition();
        this.backIconElement = this.filterInputObj.container.querySelector('.e-back-icon');
        this.clearIconElement = this.filterInputObj.container.querySelector('.' + clearIcon);
        this.clearIconElement.style.visibility = 'hidden';
        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
    };
    CheckBoxSelection.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
        this.parent.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.parent.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        var clearElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    };
    CheckBoxSelection.prototype.targetElement = function () {
        if (!isNullOrUndefined(this.clearIconElement)) {
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
            if (Browser.isIE) {
                target = !isNullOrUndefined(e) && e.target;
            }
            if (!Browser.isIE) {
                target = !isNullOrUndefined(e) && e.relatedTarget;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) && this.parent.popupObj.element.contains(target)
                && !Browser.isIE && this.filterInput) {
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
                this.parent.overAllWrapper.classList.remove(FOCUS$1);
                this.parent.trigger('blur');
                this.parent.focused = true;
            }
            if (this.parent.popupObj && document.body.contains(this.parent.popupObj.element) &&
                !this.parent.popupObj.element.classList.contains('e-popup-close') && !Browser.isDevice) {
                this.parent.hidePopup();
            }
        }
    };
    CheckBoxSelection.prototype.onDocumentClick = function (e) {
        if (this.parent.getLocaleName() !== 'listbox') {
            var target = e.target;
            if (!isNullOrUndefined(this.parent.popupObj) && closest(target, '#' + this.parent.popupObj.element.id)) {
                e.preventDefault();
            }
            if (!(!isNullOrUndefined(this.parent.popupObj) && closest(target, '#' + this.parent.popupObj.element.id)) &&
                !this.parent.overAllWrapper.contains(e.target)) {
                if (this.parent.overAllWrapper.classList.contains(dropDownBaseClasses.focus) || this.parent.isPopupOpen()) {
                    this.parent.inputFocus = false;
                    this.parent.scrollFocusStatus = false;
                    this.parent.hidePopup();
                    this.parent.onBlur(e, true);
                    this.parent.focused = true;
                }
            }
            else {
                this.parent.scrollFocusStatus = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.filterInput);
            }
            if (!this.parent.overAllWrapper.contains(e.target) && this.parent.overAllWrapper.classList.contains('e-input-focus') &&
                !this.parent.isPopupOpen()) {
                if (Browser.isIE) {
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
        this.parent.overAllWrapper.classList.remove(FOCUS$1);
        if (this.parent.keyAction && e.value !== 'clear') {
            this.parent.keyAction = false;
            return;
        }
        if (e.value === 'focus') {
            this.filterInput.focus();
            this.parent.removeFocus();
            EventHandler.remove(this.parent.list, 'keydown', this.parent.onKeyDown);
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
            compiledString = compile(template);
            for (var _i = 0, _a = compiledString({}, null, null, null, !this.parent.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            var l10nLocale = { selectAllText: 'Select All', unSelectAllText: 'Unselect All' };
            var l10n = new L10n(this.parent.getLocaleName(), {}, this.parent.locale);
            if (l10n.getConstant('selectAllText') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.parent.locale);
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
        if (this.parent.enableSelectionOrder && !isNullOrUndefined(this.parent.value)) {
            var activeLiCount = this.parent.ulElement.querySelectorAll('li.e-active').length;
            var remLi = void 0;
            var ulEle = this.parent.createElement('ul', {
                className: 'e-list-parent e-ul e-reorder'
            });
            var removeEle = this.parent.createElement('div');
            if (activeLiCount > 0) {
                append(this.parent.ulElement.querySelectorAll('li.e-active'), ulEle);
                remLi = this.parent.ulElement.querySelectorAll('li.e-active');
                addClass(remLi, 'e-reorder-hide');
                prepend([ulEle], this.parent.list);
            }
            this.parent.focusAtFirstListItem();
        }
    };
    return CheckBoxSelection;
}());

/**
 * export all modules from current location
 */

var __extends$6 = (undefined && undefined.__extends) || (function () {
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
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
var ITEMTEMPLATE_PROPERTY$1 = 'ItemTemplate';
/**
 * Defines the Selection settings of List Box.
 */
var SelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property('Multiple')
    ], SelectionSettings.prototype, "mode", void 0);
    __decorate$6([
        Property(false)
    ], SelectionSettings.prototype, "showCheckbox", void 0);
    __decorate$6([
        Property(false)
    ], SelectionSettings.prototype, "showSelectAll", void 0);
    __decorate$6([
        Property('Left')
    ], SelectionSettings.prototype, "checkboxPosition", void 0);
    return SelectionSettings;
}(ChildProperty));
/**
 * Defines the toolbar settings of List Box.
 */
var ToolbarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(ToolbarSettings, _super);
    function ToolbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property([])
    ], ToolbarSettings.prototype, "items", void 0);
    __decorate$6([
        Property('Right')
    ], ToolbarSettings.prototype, "position", void 0);
    return ToolbarSettings;
}(ChildProperty));
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
var ListBox = /** @__PURE__ @class */ (function (_super) {
    __extends$6(ListBox, _super);
    /**
     * Constructor for creating the ListBox component.
     */
    function ListBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isValidKey = false;
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
        if (isBlazor() && this.isServerRendered) {
            this.list = this.element.parentElement;
            this.liCollections = this.list.querySelectorAll('.' + cssClass.li);
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
    ListBox.prototype.updateBlazorListData = function (data, isDataSource) {
        if (isDataSource) {
            this.mainList = this.ulElement = this.list.querySelector('ul');
        }
        else {
            this.sortedData = this.jsonData = this.listData = data;
        }
        this.initDraggable();
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
            this.list.getElementsByClassName('e-list-item')[0].classList.remove(dropDownBaseClasses.focus);
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element, hiddenSelect);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        this.updateSelectionSettings();
    };
    ListBox.prototype.updateSelectionSettings = function () {
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            var l10nSelect = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
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
            new Sortable(this.ulElement, {
                scope: this.scope,
                itemClass: 'e-list-item',
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                beforeDrop: this.beforeDragEnd.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: function () { return _this.createElement('span', { className: 'e-placeholder' }); },
                helper: function (e) {
                    var ele = e.sender.cloneNode(true);
                    ele.style.width = _this.getItems()[0].offsetWidth + 'px';
                    if ((_this.value && _this.value.length) > 1 && _this.isSelected(ele)) {
                        ele.appendChild(_this.createElement('span', {
                            className: 'e-list-badge', innerHTML: _this.value.length + ''
                        }));
                    }
                    return ele;
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
                this.element.id = getUniqueID('e-' + this.getModuleName());
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
            this.tBListBox = getComponent(document.getElementById(prevScope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
        else if (scope) {
            this.tBListBox = getComponent(document.getElementById(scope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
    };
    ListBox.prototype.createButtons = function (toolElem) {
        var _this = this;
        var btn;
        var ele;
        var title;
        var l10n = new L10n(this.getModuleName(), {
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
            btn = new Button({ iconCss: 'e-icons e-' + value.toLowerCase() }, ele);
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
        ele.style.height = formatUnit(this.height);
        if (this.allowFiltering && this.height.toString().indexOf('%') < 0) {
            addClass([this.list], 'e-filter-list');
        }
        else {
            removeClass([this.list], 'e-filter-list');
        }
    };
    ListBox.prototype.setCssClass = function () {
        var wrap = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            addClass([wrap], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            addClass([wrap], 'e-rtl');
        }
    };
    ListBox.prototype.setEnable = function () {
        var ele = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            removeClass([ele], cssClass.disabled);
        }
        else {
            addClass([ele], cssClass.disabled);
            if (isBlazor() && this.isServerRendered && this.toolbarSettings.items.length) {
                removeClass([this.list], cssClass.disabled);
            }
        }
    };
    ListBox.prototype.showSpinner = function () {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper' });
        }
        this.spinner.style.height = formatUnit(this.height);
        this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        createSpinner({ target: this.spinner }, this.createElement);
        showSpinner(this.spinner);
    };
    ListBox.prototype.hideSpinner = function () {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            detach(this.spinner);
        }
    };
    ListBox.prototype.onInput = function () {
        this.isValidKey = true;
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
            if (isBlazor() && this.isServerRendered) {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0];
            }
            else {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0].cloneNode(true);
            }
        }
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        if (this.allowFiltering && !isNullOrUndefined(searchEle)) {
            this.list.insertBefore(searchEle, this.list.firstElementChild);
            if (!isBlazor() && !this.isServerRendered) {
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
            extend(this.jsonData, list, []);
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
        args = extend(this.getDragArgs(args), { dragSelected: true });
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', args, function (dragEventArgs) {
            _this.allowDragAll = dragEventArgs.dragSelected;
            if (!_this.allowDragAll) {
                badge = _this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) {
                    detach(badge);
                }
            }
            if (isBlazor()) {
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
        var dragArgs = extend({}, getArgs, { target: args.target, source: { previousData: this.dataSource } });
        if (listObj !== this) {
            var sourceArgs1 = extend(sourceArgs, { currentData: this.listData });
            dragArgs = extend(dragArgs, { source: sourceArgs1, destination: destArgs });
        }
        if (Browser.isIos) {
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
            jsonData.splice(toIdx_1, 0, jsonData.splice(jsonIdx, 1)[0]);
            sortedData.splice(toSortIdx_1, 0, sortedData.splice(sIdx, 1)[0]);
            liColl.splice(toIdx_1, 0, liColl.splice(rIdx, 1)[0]);
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
                        listData.splice(toIdx_1, 0, listData.splice(idx, 1)[0]);
                        jsonData.splice(toIdx_1, 0, jsonData.splice(jsonIdx_1, 1)[0]);
                        sortedData.splice(toSortIdx_1, 0, sortedData.splice(sIdx_1, 1)[0]);
                        liColl.splice(toIdx_1, 0, liColl.splice(idx, 1)[0]);
                        ul_1.insertBefore(_this.getItems()[_this.getIndexByValue(value)], ul_1.getElementsByClassName('e-placeholder')[0]);
                    }
                });
            }
            this.listData = listData;
            this.jsonData = jsonData;
            this.sortedData = sortedData;
            this.liCollections = liColl;
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
            selectedOptions.forEach(function (value) {
                droppedData = _this.getDataByValue(value);
                var srcIdx = _this.listData.indexOf(droppedData);
                var jsonSrcIdx = _this.jsonData.indexOf(droppedData);
                var sortIdx = _this.sortedData.indexOf(droppedData);
                fListData_1.splice(srcIdx, 1);
                _this.jsonData.splice(jsonSrcIdx, 1);
                fSortData_1.splice(sortIdx, 1);
                _this.listData = fListData_1;
                _this.sortedData = fSortData_1;
                var rLi = fLiColl_1.splice(srcIdx, 1)[0];
                var destIdx = value === dropValue ? args.currentIndex : currIdx_1;
                listData.splice(destIdx, 0, droppedData);
                jsonData.splice(destIdx, 0, droppedData);
                liColl.splice(destIdx, 0, rLi);
                sortedData.splice(destIdx, 0, droppedData);
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
                _this.removeSelected(_this, value === dropValue ? [args.droppedElement] : [li_1]);
                ul_2.insertBefore(li_1, ul_2.getElementsByClassName('e-placeholder')[0]);
                currIdx_1++;
            });
            this.updateSelectedOptions();
            if (this.fields.groupBy) {
                this.ulElement.innerHTML = this.renderItems(this.listData, this.fields).innerHTML;
                this.setSelection();
            }
            if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                var sortabale = getComponent(ul_2, 'sortable');
                ul_2.innerHTML = listObj.renderItems(listData, listObj.fields).innerHTML;
                if (sortabale.placeHolderElement) {
                    ul_2.appendChild(sortabale.placeHolderElement);
                }
                ul_2.appendChild(args.helper);
                listObj.setSelection();
            }
            this.liCollections = fLiColl_1;
            listObj.liCollections = liColl;
            listObj.jsonData = extend([], [], jsonData, false);
            listObj.listData = extend([], [], listData, false);
            listObj.sortedData = extend([], [], sortedData, false);
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        if (this === listObj) {
            var sourceArgs1 = extend(sourceArgs, { currentData: listData });
            dragArgs = extend(dragArgs, { source: sourceArgs1 });
        }
        else {
            var dragArgs1 = extend(destArgs, { currentData: listData });
            dragArgs = extend(dragArgs, { destination: dragArgs1 });
        }
        this.trigger('drop', dragArgs);
    };
    ListBox.prototype.removeSelected = function (listObj, elems) {
        if (listObj.selectionSettings.showCheckbox) {
            elems.forEach(function (ele) { ele.getElementsByClassName('e-frame')[0].classList.remove('e-check'); });
        }
        else {
            removeClass(elems, cssClass.selected);
        }
    };
    ListBox.prototype.getCurIdx = function (listObj, idx) {
        if (listObj.fields.groupBy) {
            idx -= [].slice.call(listObj.ulElement.children).slice(0, idx)
                .filter(function (ele) { return ele.classList.contains(cssClass.group); }).length;
        }
        return idx;
    };
    ListBox.prototype.getComponent = function (li) {
        var listObj;
        var ele = (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
            : closest(li, '.e-listbox-wrapper') && closest(li, '.e-listbox-wrapper').querySelector('.e-listbox'));
        if (ele) {
            listObj = getComponent(ele, this.getModuleName());
        }
        return listObj;
    };
    ListBox.prototype.listOption = function (dataSource, fields) {
        this.listCurrentOptions = _super.prototype.listOption.call(this, dataSource, fields);
        this.listCurrentOptions = extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
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
     * @returns void
     */
    ListBox.prototype.enableItems = function (items, enable) {
        var _this = this;
        if (enable === void 0) { enable = true; }
        var li;
        items.forEach(function (item) {
            li = _this.findListElement(_this.list, 'li', 'data-value', _this.getValueByText(item));
            if (enable) {
                removeClass([li], cssClass.disabled);
                li.removeAttribute('aria-disabled');
            }
            else {
                addClass([li], cssClass.disabled);
                li.setAttribute('aria-disabled', 'true');
            }
        });
    };
    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     * @param items Array of text value of the item.
     * @param state Set `true`/`false` to select/un select the list items.
     * @returns void
     */
    ListBox.prototype.selectItems = function (items, state) {
        if (state === void 0) { state = true; }
        this.setSelection(items, state, true);
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
        var liElement = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        if (items) {
            items = (items instanceof Array ? items : [items]);
            var fields = this.fields;
            var dataValue = void 0;
            var objValue = void 0;
            var dupData = [];
            var itemIdx = void 0;
            extend(dupData, [], this.listData);
            for (var j = 0; j < items.length; j++) {
                if (items[j] instanceof Object) {
                    dataValue = getValue(fields.value, items[j]);
                }
                else {
                    dataValue = items[j].toString();
                }
                for (var i = 0, len = dupData.length; i < len; i++) {
                    if (dupData[i] instanceof Object) {
                        objValue = getValue(fields.value, dupData[i]);
                    }
                    else {
                        objValue = dupData[i].toString();
                    }
                    if (objValue === dataValue) {
                        itemIdx = this.getIndexByValue(dataValue);
                        liCollections.push(liElement[itemIdx]);
                        this.listData.splice(i, 1);
                        this.updateLiCollection(itemIdx);
                    }
                }
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
        var tlistbox = (targetId) ? getComponent(targetId, ListBox_1) : this.getScopedListBox();
        this.moveData(this, tlistbox, false, elem, index);
    };
    /**
     * Moves all the values from one ListBox to the scoped ListBox.
     * @param  { string } targetId - Specifies the scoped ListBox ID.
     * @param  { string } index - Specifies the index to where the items moved.
     * @returns {void}
     */
    ListBox.prototype.moveAllTo = function (targetId, index) {
        var tlistbox = (targetId) ? getComponent(targetId, ListBox_1) : this.getScopedListBox();
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
            if (!li.classList.contains(cssClass.disabled)) {
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
                        li.classList.add(cssClass.selected);
                    }
                    else {
                        li.classList.remove(cssClass.selected);
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
        var form = closest(this.element, 'form');
        var wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.add(this.list, 'click', this.clickHandler, this);
        EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusOutHandler, this);
        this.wireToolbarEvent();
        if (this.selectionSettings.showCheckbox) {
            EventHandler.remove(document, 'mousedown', this.checkBoxSelectionModule.onDocumentClick);
        }
        if (this.fields.groupBy || this.element.querySelector('select>optgroup')) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
        }
        if (form) {
            EventHandler.add(form, 'reset', this.formResetHandler, this);
        }
    };
    ListBox.prototype.wireToolbarEvent = function () {
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
    };
    ListBox.prototype.unwireEvents = function () {
        var form = closest(this.element, 'form');
        var wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.remove(this.list, 'click', this.clickHandler);
        EventHandler.remove(wrapper, 'keydown', this.keyDownHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusOutHandler);
        if (this.allowFiltering && this.clearFilterIconElem) {
            EventHandler.remove(this.clearFilterIconElem, 'click', this.clearText);
        }
        if (this.toolbarSettings.items.length) {
            EventHandler.remove(this.getToolElem(), 'click', this.toolbarClickHandler);
        }
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler);
        }
    };
    ListBox.prototype.clickHandler = function (e) {
        this.selectHandler(e);
    };
    
    ListBox.prototype.checkSelectAll = function () {
        var searchCount = 0;
        var liItems = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
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
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.allowFiltering) {
            var filterType = this.inputString === '' ? 'contains' : this.filterType;
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    };
    ListBox.prototype.setFiltering = function () {
        var filterInputObj;
        if (isNullOrUndefined(this.filterParent)) {
            if (isBlazor() && this.isServerRendered) {
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
                filterInputObj = Input.createInput({
                    element: this.filterInput,
                    buttons: [listBoxClasses.filterBarClearIcon],
                    properties: { placeholder: this.filterBarPlaceholder }
                }, this.createElement);
                append([filterInputObj.container], this.filterParent);
                prepend([this.filterParent], this.list);
                attributes(this.filterInput, {
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
                addClass([this.list], 'e-filter-list');
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
            EventHandler.add(this.clearFilterIconElem, 'click', this.clearText, this);
            if (!filterElem) {
                this.clearFilterIconElem.style.visibility = 'hidden';
            }
        }
        EventHandler.add(this.filterInput, 'input', this.onInput, this);
        EventHandler.add(this.filterInput, 'keyup', this.KeyUp, this);
        EventHandler.add(this.filterInput, 'keydown', this.onKeyDown, this);
    };
    ListBox.prototype.selectHandler = function (e, isKey) {
        var isSelect = true;
        var currSelIdx;
        var li = closest(e.target, '.' + 'e-list-item');
        var selectedLi = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                }
                else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || Browser.isDevice))) {
                    this.getSelectedItems().forEach(function (ele) {
                        ele.removeAttribute('aria-selected');
                    });
                    removeClass(this.getSelectedItems(), cssClass.selected);
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
                    addClass(selectedLi, cssClass.selected);
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
                    extend(values, this.value);
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
        if (!isNullOrUndefined(this.listData)) {
            var type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    for (var i = sIdx, len = elems.length; i < len; i++) {
                        value = this.getFormattedValue(elems[i].getAttribute('data-value'));
                        if (!isNullOrUndefined(item) && item === value) {
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
                        if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
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
        var btn = closest(e.target, 'button');
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
            moveTo(_this.ulElement, _this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
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
            dataIdx.sort(function (n1, n2) { return n2 - n1; }).forEach(function (i) {
                listData.splice(i, 1)[0];
            });
            sortIdx.sort(function (n1, n2) { return n2 - n1; }).forEach(function (i) {
                sortData.splice(i, 1)[0];
            });
            jsonIdx.slice().reverse().forEach(function (i) {
                data.push(fListBox.jsonData.splice(i, 1)[0]);
            });
            if (isRefresh) {
                if (fListBox.fields.groupBy) {
                    fListBox.ulElement.innerHTML = fListBox.renderItems(listData, fListBox.fields).innerHTML;
                }
                else {
                    elems.forEach(function (ele) { detach(ele); });
                }
            }
            else {
                moveTo(fListBox.ulElement, tListBox.ulElement, idx, index);
                this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
            }
            if (tListBox.mainList.childElementCount !== tListBox.jsonData.length) {
                tListBox.mainList = tListBox.ulElement;
            }
            fListBox.updateMainList();
            var childCnt = fListBox.ulElement.querySelectorAll('.e-list-item').length;
            var ele = void 0;
            var liIdx = void 0;
            var tJsonData = [].slice.call(tListBox.jsonData);
            tSortData = [].slice.call(tListBox.sortedData);
            if (elems.length === 1 && childCnt && !fListBox.selectionSettings.showCheckbox) {
                liIdx = childCnt <= dataLiIdx[0] ? childCnt - 1 : dataLiIdx[0];
                ele = fListBox.ulElement.querySelectorAll('.e-list-item')[liIdx];
                var validIdx = fListBox.getValidIndex(ele, liIdx, childCnt === dataIdx[0] ? 38 : 40);
                if (validIdx > -1) {
                    (fListBox.ulElement.querySelectorAll('.e-list-item')[validIdx].classList.add(cssClass.selected));
                }
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
            if (isRefresh) {
                tListBox.ulElement.innerHTML = tListBox.renderItems(tListData, tListBox.fields).innerHTML;
                tListBox.setSelection();
            }
            fListBox.updateSelectedOptions();
            if (fListBox.listData.length === 0) {
                // tslint:disable-next-line
                fListBox.l10nUpdate();
            }
        }
        if (fListBox.value.length === 1 && fListBox.getSelectedItems().length) {
            fListBox.value[0] = fListBox.getFormattedValue(fListBox.getSelectedItems()[0].getAttribute('data-value'));
        }
    };
    ListBox.prototype.moveAllItemTo = function () {
        this.moveAllData(this, this.getScopedListBox());
    };
    ListBox.prototype.moveAllItemFrom = function () {
        this.moveAllData(this.getScopedListBox(), this);
    };
    ListBox.prototype.moveAllData = function (fListBox, tListBox, isKey, index) {
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
            moveTo(fListBox.ulElement, tListBox.ulElement, Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number), index);
            this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
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
        var fliCollections = [].slice.call(fListBox.liCollections);
        var tliCollections = [].slice.call(tListBox.liCollections);
        fListBox.liCollections = [];
        fListBox.value = [];
        if (index) {
            var toColl = tliCollections.splice(0, index);
            tListBox.liCollections = toColl.concat(fliCollections).concat(tliCollections);
        }
        else {
            tListBox.liCollections = tliCollections.concat(fliCollections);
        }
        listData = listData
            .filter(function (data) { return data.isHeader !== true; });
        tListBox.listData = listData;
        tListBox.jsonData = jsonData;
        fListBox.listData = fListBox.sortedData = fListBox.jsonData = [];
        if (isRefresh) {
            tListBox.ulElement.innerHTML = tListBox.renderItems(listData, tListBox.fields).innerHTML;
            this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        }
        else {
            tListBox.sortedData = listData;
        }
        fListBox.updateSelectedOptions();
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
                ele.push(closest(cbox, '.' + 'e-list-item'));
            });
        }
        else {
            ele = [].slice.call(this.ulElement.getElementsByClassName(cssClass.selected));
        }
        return ele;
    };
    ListBox.prototype.getScopedListBox = function () {
        var _this = this;
        var listObj;
        if (this.scope) {
            [].slice.call(document.querySelectorAll(this.scope)).forEach(function (ele) {
                if (getComponent(ele, _this.getModuleName())) {
                    listObj = getComponent(ele, _this.getModuleName());
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
        if (isBlazor()) {
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
        var fli = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(cssClass.selected)[0];
        if (fli) {
            if (e.keyCode !== 35 && e.keyCode !== 36) {
                fliIdx = Array.prototype.indexOf.call(ul.children, fli);
                e.keyCode === 40 ? fliIdx++ : fliIdx--;
                if (fliIdx < 0 || fliIdx > ul.childElementCount - 1) {
                    return;
                }
            }
            removeClass([fli], 'e-focused');
        }
        var cli = ul.children[fliIdx];
        if (cli) {
            fliIdx = this.getValidIndex(cli, fliIdx, e.keyCode);
            if (fliIdx === -1) {
                addClass([fli], 'e-focused');
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
        if (!isNullOrUndefined(isWordCharacter)) {
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
                                _this.filteringAction(_this.jsonData, new Query(), _this.fields);
                            }
                            if (!_this.isFiltered && !_this.isCustomFiltering && !eventArgsData_1.preventDefaultAction) {
                                _this.dataUpdater(_this.jsonData, new Query(), _this.fields);
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
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            (keyCode === 40 || keyCode === 36) ? index++ : index--;
        }
        if (index < 0 || index === cul.childElementCount) {
            return -1;
        }
        cli = cul.querySelectorAll('.e-list-item')[index];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    };
    ListBox.prototype.updateSelectedOptions = function () {
        var _this = this;
        var selectedOptions = [];
        var values = [];
        extend(values, this.value);
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
                li = _this.list.querySelector('[data-value="' + (isText ? _this.getValueByText(value) : value) + '"]');
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
                                li.classList.add(cssClass.selected);
                                li.setAttribute('aria-selected', 'true');
                            }
                            else {
                                li.classList.remove(cssClass.selected);
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
    ListBox.prototype.updateToolBarState = function () {
        var _this = this;
        if (this.toolbarSettings.items.length) {
            var listObj_1 = this.getScopedListBox();
            var wrap_1 = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach(function (value) {
                var btn = wrap_1.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = _this.ulElement.childElementCount ? false : true;
                        break;
                    case 'moveAllFrom':
                        btn.disabled = listObj_1.ulElement.childElementCount ? false : true;
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
            this.ulElement = this.renderItems(this.listData, this.fields);
            this.mainList = this.ulElement;
            this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
            this.list.appendChild(this.ulElement);
            if (this.selectionSettings.showSelectAll && !this.list.getElementsByClassName('e-selectall-parent')[0]) {
                var l10nShow = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
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
        this.value = [];
    };
    ListBox.prototype.isSelected = function (ele) {
        if (!isNullOrUndefined(ele)) {
            return ele.classList.contains(cssClass.selected) || ele.querySelector('.e-check') !== null;
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
            resetBlazorTemplate("" + this.element.id + ITEMTEMPLATE_PROPERTY$1, ITEMTEMPLATE_PROPERTY$1);
        }
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        }
        else {
            if (!isBlazor() || (isBlazor() && !this.isServerRendered)) {
                this.element.style.display = 'inline-block';
                if (this.toolbarSettings.items.length) {
                    this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                    detach(this.list.nextElementSibling);
                }
                this.list.parentElement.insertBefore(this.element, this.list);
            }
        }
        if (!isBlazor() || (isBlazor() && !this.isServerRendered)) {
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
                        removeClass([wrap], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrap], newProp.cssClass.split(' '));
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
                    removeClass(this.list.querySelectorAll('.' + cssClass.selected), cssClass.selected);
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
                        getComponent(this.ulElement, 'sortable').destroy();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.setFiltering();
                    }
                    else {
                        this.list.removeChild(this.list.getElementsByClassName('e-filter-parent')[0]);
                        this.filterParent = null;
                        removeClass([this.list], 'e-filter-list');
                    }
                    break;
                case 'filterBarPlaceholder':
                    if (this.allowFiltering) {
                        if (this.filterInput) {
                            Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput);
                        }
                    }
                    break;
                case 'scope':
                    if (this.allowDragAndDrop) {
                        getComponent(this.ulElement, 'sortable').scope = newProp.scope;
                    }
                    if (this.toolbarSettings.items.length) {
                        if (oldProp.scope) {
                            getComponent(document.querySelector(oldProp.scope), this.getModuleName())
                                .tBListBox = null;
                        }
                        if (newProp.scope) {
                            getComponent(document.querySelector(newProp.scope), this.getModuleName())
                                .tBListBox = this;
                        }
                    }
                    break;
                case 'toolbarSettings':
                    var ele = void 0;
                    var pos = newProp.toolbarSettings.position;
                    var toolElem = this.getToolElem();
                    if (pos) {
                        removeClass([wrap], ['e-right', 'e-left']);
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
                            detach(ele);
                        }
                        this.initToolbarAndStyles();
                        this.wireToolbarEvent();
                    }
                    break;
                case 'selectionSettings':
                    var showSelectAll = newProp.selectionSettings.showSelectAll;
                    var showCheckbox = newProp.selectionSettings.showCheckbox;
                    if (!isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            var l10nSel = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                            this.checkBoxSelectionModule.checkAllParent = null;
                            this.showSelectAll = true;
                            this.selectAllText = l10nSel.getConstant('selectAllText');
                            this.unSelectAllText = l10nSel.getConstant('selectAllText');
                            this.popupWrapper = this.list;
                        }
                        this.notify('selectAll', {});
                        this.checkSelectAll();
                    }
                    if (!isNullOrUndefined(showCheckbox)) {
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
    __decorate$6([
        Property('')
    ], ListBox.prototype, "cssClass", void 0);
    __decorate$6([
        Property([])
    ], ListBox.prototype, "value", void 0);
    __decorate$6([
        Property('')
    ], ListBox.prototype, "height", void 0);
    __decorate$6([
        Property(false)
    ], ListBox.prototype, "allowDragAndDrop", void 0);
    __decorate$6([
        Property(1000)
    ], ListBox.prototype, "maximumSelectionLength", void 0);
    __decorate$6([
        Property(false)
    ], ListBox.prototype, "allowFiltering", void 0);
    __decorate$6([
        Property('')
    ], ListBox.prototype, "scope", void 0);
    __decorate$6([
        Property(true)
    ], ListBox.prototype, "ignoreCase", void 0);
    __decorate$6([
        Property(null)
    ], ListBox.prototype, "filterBarPlaceholder", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "beforeItemRender", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "filtering", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "select", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "change", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "beforeDrop", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "dragStart", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "drag", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "drop", void 0);
    __decorate$6([
        Event()
    ], ListBox.prototype, "dataBound", void 0);
    __decorate$6([
        Property(null)
    ], ListBox.prototype, "groupTemplate", void 0);
    __decorate$6([
        Property('No Records Found')
    ], ListBox.prototype, "noRecordsTemplate", void 0);
    __decorate$6([
        Property('The Request Failed')
    ], ListBox.prototype, "actionFailureTemplate", void 0);
    __decorate$6([
        Property(1000)
    ], ListBox.prototype, "zIndex", void 0);
    __decorate$6([
        Property(false)
    ], ListBox.prototype, "ignoreAccent", void 0);
    __decorate$6([
        Complex({}, ToolbarSettings)
    ], ListBox.prototype, "toolbarSettings", void 0);
    __decorate$6([
        Complex({}, SelectionSettings)
    ], ListBox.prototype, "selectionSettings", void 0);
    ListBox = ListBox_1 = __decorate$6([
        NotifyPropertyChanges
    ], ListBox);
    return ListBox;
}(DropDownBase));
var listBoxClasses = {
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    clearIcon: 'e-clear-icon',
};

/**
 * export all modules from current location
 */

/**
 * export all modules from current location
 */

export { incrementalSearch, Search, highlightSearch, revertHighlightSearch, FieldSettings, dropDownBaseClasses, DropDownBase, dropDownListClasses, DropDownList, Fields, TreeSettings, DropDownTree, ComboBox, AutoComplete, MultiSelect, CheckBoxSelection, SelectionSettings, ToolbarSettings, ListBox };
//# sourceMappingURL=ej2-dropdowns.es5.js.map
