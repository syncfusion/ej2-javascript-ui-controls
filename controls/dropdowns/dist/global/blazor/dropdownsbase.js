window.sf = window.sf || {};
var dropdownsbase = (function (exports) {
'use strict';

/**
 * IncrementalSearch module file
 */
var queryString = '';
var prevString = '';
var matches = [];
var activeClass = 'e-active';
var prevElementId = '';
/**
 * Search and focus the list item based on key code matches with list text content
 * @param  { number } keyCode - Specifies the key code which pressed on keyboard events.
 * @param  { HTMLElement[]] } items - Specifies an array of HTMLElement, from which matches find has done.
 * @param { number } selectedIndex - Specifies the selected item in list item, so that search will happen
 * after selected item otherwise it will do from initial.
 * @param  { boolean } ignoreCase - Specifies the case consideration when search has done.
 */
function incrementalSearch(keyCode, items, selectedIndex, ignoreCase, elementId, isBlazor$$1) {
    queryString += String.fromCharCode(keyCode);
    setTimeout(function () { queryString = ''; }, 1000);
    var index;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevElementId === elementId && prevString === queryString) {
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].classList.contains(activeClass)) {
                index = i;
                break;
            }
        }
        index = index + 1;
        return matches[index];
    }
    else {
        var listItems = items;
        var strLength = queryString.length;
        var text = void 0;
        var item = void 0;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        var i = selectedIndex;
        matches = [];
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
                matches.push(listItems[index]);
            }
            i++;
        } while (i !== selectedIndex);
        prevString = queryString;
        prevElementId = elementId;
        return matches[0];
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
        if (element.childNodes[index].nodeType === 3 && element.childNodes[index].textContent.trim() !== '') {
            element = (isBlazor$$1 && element.classList.contains('e-highlight')) ? element.parentElement : element;
            if (isBlazor$$1 && element.getAttribute('data-value')) {
                element.innerHTML = element.getAttribute('data-value').replace(pattern, '<span class="e-highlight">$1</span>');
            }
            else {
                element.innerHTML = (element.innerHTML).trim().replace(pattern, '<span class="e-highlight">$1</span>');
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
var FieldSettings = /** @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property()
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        sf.base.Property()
    ], FieldSettings.prototype, "value", void 0);
    __decorate([
        sf.base.Property()
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property()
    ], FieldSettings.prototype, "groupBy", void 0);
    __decorate([
        sf.base.Property()
    ], FieldSettings.prototype, "htmlAttributes", void 0);
    return FieldSettings;
}(sf.base.ChildProperty));
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
var DropDownBase = /** @class */ (function (_super) {
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
        if (!sf.base.isNullOrUndefined(this.listData)) {
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
                if (!sf.base.isNullOrUndefined(item)) {
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
                    var itemValue = sf.base.getValue(fields.value, item);
                    if (!sf.base.isNullOrUndefined(itemValue) && _this.checkIgnoreCase(sf.base.getValue(fields.text, item).toString(), text)) {
                        value = sf.base.getValue(fields.value, item);
                    }
                });
            }
            else {
                if (isTextByValue) {
                    dataSource.filter(function (item) {
                        var itemValue = sf.base.getValue(fields.value, item);
                        if (!sf.base.isNullOrUndefined(itemValue) && !sf.base.isNullOrUndefined(value) && itemValue.toString() === value.toString()) {
                            value = sf.base.getValue(fields.text, item);
                        }
                    });
                }
                else {
                    dataSource.filter(function (item) {
                        if (_this.checkNonIgnoreCase(sf.base.getValue(fields.text, item), text)) {
                            value = sf.base.getValue(fields.value, item);
                        }
                    });
                }
            }
        }
        return value;
    };
    DropDownBase.prototype.checkingAccent = function (item, text, ignoreCase) {
        var dataItem = sf.data.DataUtil.ignoreDiacritics(String(item));
        var textItem = sf.data.DataUtil.ignoreDiacritics(text.toString());
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
    DropDownBase.prototype.templateCompiler = function (baseTemplate) {
        var checkTemplate = false;
        if (baseTemplate) {
            try {
                checkTemplate = (sf.base.select(baseTemplate, document).length) ? true : false;
            }
            catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    };
    DropDownBase.prototype.l10nUpdate = function (actionFailure) {
        var ele = this.getModuleName() === 'listbox' ? this.ulElement : this.list;
        if (this.noRecordsTemplate !== 'No records found' || this.actionFailureTemplate !== 'Request failed') {
            this.DropDownBaseresetBlazorTemplates(false, false, true, true);
            var template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            var compiledString = void 0;
            var templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            ele.innerHTML = '';
            var tempaltecheck = this.templateCompiler(template);
            if (tempaltecheck) {
                compiledString = sf.base.compile(sf.base.select(template, document).innerHTML.trim());
            }
            else {
                compiledString = sf.base.compile(template);
            }
            var templateName = actionFailure ? 'actionFailureTemplate' : 'noRecordsTemplate';
            // tslint:disable-next-line
            var noDataCompTemp = compiledString({}, this, templateName, templateId, this.isStringTemplate, null, ele);
            if (noDataCompTemp && noDataCompTemp.length > 0) {
                for (var i = 0; i < noDataCompTemp.length; i++) {
                    ele.appendChild(noDataCompTemp[i]);
                }
            }
            this.DropDownBaseupdateBlazorTemplates(false, false, !actionFailure, actionFailure, false, false, false, false);
        }
        else {
            var l10nLocale = { noRecordsTemplate: 'No records found', actionFailureTemplate: 'Request failed' };
            var componentLocale = new sf.base.L10n(this.getLocaleName(), {}, this.locale);
            if (componentLocale.getConstant('actionFailureTemplate') !== '') {
                this.l10n = componentLocale;
            }
            else {
                this.l10n = new sf.base.L10n(this.getModuleName() === 'listbox' ? 'listbox' : 'dropdowns', l10nLocale, this.locale);
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
            if (sf.base.isBlazor() && sf.base.isNullOrUndefined(value) || value === 'null') {
                return null;
            }
            if (typeof sf.base.getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'number'
                || item.typeof === 'number') {
                return parseFloat(value);
            }
            if (typeof sf.base.getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'boolean'
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
        this.enableRtl ? sf.base.addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            sf.base.removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    };
    
    /**
     * Initialize the Component.
     */
    DropDownBase.prototype.initialize = function () {
        this.bindEvent = true;
        this.actionFailureTemplateId = "" + this.element.id + ACTIONFAILURETEMPLATE_PROPERTY;
        if (this.element.tagName === 'UL') {
            var jsonElement = sf.lists.ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        }
        else if (this.element.tagName === 'SELECT') {
            var dataSource = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !sf.base.isNullOrUndefined(this.dataSource) ? true : false;
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
                sf.base.updateBlazorTemplate(this.itemTemplateId, ITEMTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.groupTemplate && group) {
                sf.base.updateBlazorTemplate(this.groupTemplateId, GROUPTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.noRecordsTemplate && noRecord) {
                sf.base.updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                sf.base.updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY, this, isEmpty);
            }
            if (value) {
                sf.base.updateBlazorTemplate(this.valueTemplateId, VALUETEMPLATE_PROPERTY, this, isEmpty);
            }
            if (header) {
                sf.base.updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY, this);
            }
            if (footer) {
                sf.base.updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY, this);
            }
        }
    };
    DropDownBase.prototype.DropDownBaseresetBlazorTemplates = function (item, group, noRecord, action, value, header, footer) {
        if (!this.isStringTemplate) {
            if (this.itemTemplate && item) {
                sf.base.resetBlazorTemplate(this.itemTemplateId, ITEMTEMPLATE_PROPERTY);
            }
            if (this.groupTemplate && group) {
                sf.base.resetBlazorTemplate(this.groupTemplateId, GROUPTEMPLATE_PROPERTY);
            }
            if (this.noRecordsTemplate && noRecord) {
                sf.base.resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE_PROPERTY);
            }
            if (this.actionFailureTemplate && action) {
                sf.base.resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE_PROPERTY);
            }
            if (value) {
                sf.base.resetBlazorTemplate(this.valueTemplateId, VALUETEMPLATE_PROPERTY);
            }
            if (header) {
                sf.base.resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE_PROPERTY);
            }
            if (footer) {
                sf.base.resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE_PROPERTY);
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
        sf.base.extend(attr, value, attr);
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
                if (dataSource instanceof sf.data.DataManager) {
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
                    var dataManager = new sf.data.DataManager(eventArgs.data);
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
                sf.base.append(childNode, ulElement);
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
        var spliceData = new sf.data.DataManager(dataSource).executeLocal(new sf.data.Query().skip(100));
        if (this.itemTemplate) {
            var listElements = this.templateListItem(spliceData, fields);
            return [].slice.call(listElements.childNodes);
        }
        var type = this.typeOfData(spliceData).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return sf.lists.ListBase.createListItemFromArray(this.createElement, spliceData, true, this.listOption(spliceData, fields), this);
        }
        return sf.lists.ListBase.createListItemFromJson(this.createElement, spliceData, this.listOption(spliceData, fields), 1, true, this);
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
        sf.base.addClass([this.list], dropDownBaseClasses.noData);
    };
    DropDownBase.prototype.onActionComplete = function (ulElement, list, e) {
        this.listData = list;
        if (sf.base.isBlazor() && this.isServerRendered && this.getModuleName() === 'listbox') {
            sf.base.remove(this.list.querySelector('.e-list-parent'));
            sf.base.remove(this.list.querySelector('.e-hidden-select'));
        }
        else {
            // tslint:disable-next-line         
            if (this.isReact) {
                this.clearTemplate(['itemTemplate', 'groupTemplate', 'actionFailureTemplate', 'noRecordsTemplate']);
            }
            this.list.innerHTML = '';
        }
        this.fixedHeaderElement = sf.base.isNullOrUndefined(this.fixedHeaderElement) ? this.fixedHeaderElement : null;
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
            sf.base.addClass([listElement], dropDownBaseClasses.noData);
        }
        else {
            listElement.classList.remove(dropDownBaseClasses.noData);
        }
    };
    /**
     * Get the query to do the data operation before list item generation.
     */
    DropDownBase.prototype.getQuery = function (query) {
        return query ? query : this.query ? this.query : new sf.data.Query();
    };
    /**
     * To render the template content for group header element.
     */
    DropDownBase.prototype.renderGroupTemplate = function (listEle) {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            var dataSource = this.dataSource;
            var option = { groupTemplateID: this.groupTemplateId, isStringTemplate: this.isStringTemplate };
            var headerItems = listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            var groupcheck = this.templateCompiler(this.groupTemplate);
            if (groupcheck) {
                var groupValue = sf.base.select(this.groupTemplate, document).innerHTML.trim();
                var tempHeaders = sf.lists.ListBase.renderGroupTemplate(groupValue, dataSource, this.fields.properties, headerItems, option, this);
            }
            else {
                var tempHeaders = sf.lists.ListBase.renderGroupTemplate(this.groupTemplate, dataSource, this.fields.properties, headerItems, option, this);
            }
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
                dataSource = sf.lists.ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            sf.base.addClass([this.list], dropDownBaseClasses.grouping);
        }
        else {
            dataSource = this.getSortedDataSource(dataSource);
        }
        var options = this.listOption(dataSource, fields);
        var spliceData = (dataSource.length > 100) ?
            new sf.data.DataManager(dataSource).executeLocal(new sf.data.Query().take(100))
            : dataSource;
        this.sortedData = dataSource;
        return sf.lists.ListBase.createList(this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true, this);
    };
    
    DropDownBase.prototype.listOption = function (dataSource, fields) {
        var iconCss = sf.base.isNullOrUndefined(fields.iconCss) ? false : true;
        var fieldValues = !sf.base.isNullOrUndefined(fields.properties) ?
            fields.properties : fields;
        var options = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        return sf.base.extend({}, options, fields, true);
    };
    
    DropDownBase.prototype.setFloatingHeader = function (e) {
        if (sf.base.isNullOrUndefined(this.fixedHeaderElement)) {
            this.fixedHeaderElement = this.createElement('div', { className: dropDownBaseClasses.fixedHead });
            if (!this.list.querySelector('li').classList.contains(dropDownBaseClasses.group)) {
                this.fixedHeaderElement.style.display = 'none';
            }
            sf.base.prepend([this.fixedHeaderElement], this.list);
            this.setFixedHeader();
        }
        if (!sf.base.isNullOrUndefined(this.fixedHeaderElement) && this.fixedHeaderElement.style.zIndex === '0') {
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
            if (!sf.base.isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
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
                dataSource = sf.lists.ListBase.groupDataSource(dataSource, fields.properties, this.sortOrder);
            }
            else {
                dataSource = this.getSortedDataSource(dataSource);
            }
            this.sortedData = dataSource;
            var spliceData = (dataSource.length > 100) ?
                new sf.data.DataManager(dataSource).executeLocal(new sf.data.Query().take(100))
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
        var itemcheck = this.templateCompiler(this.itemTemplate);
        if (itemcheck) {
            var itemValue = sf.base.select(this.itemTemplate, document).innerHTML.trim();
            return sf.lists.ListBase.renderContentTemplate(this.createElement, itemValue, dataSource, fields.properties, option, this);
        }
        else {
            return sf.lists.ListBase.renderContentTemplate(this.createElement, this.itemTemplate, dataSource, fields.properties, option, this);
        }
    };
    
    DropDownBase.prototype.typeOfData = function (items) {
        var item = { typeof: null, item: null };
        for (var i = 0; (!sf.base.isNullOrUndefined(items) && i < items.length); i++) {
            if (!sf.base.isNullOrUndefined(items[i])) {
                var listDataType = typeof (items[i]) === 'string' ||
                    typeof (items[i]) === 'number' || typeof (items[i]) === 'boolean';
                var isNullData = listDataType ? sf.base.isNullOrUndefined(items[i]) :
                    sf.base.isNullOrUndefined(sf.base.getValue((this.fields.value ? this.fields.value : 'value'), items[i]));
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
        sf.base.setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        var firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    };
    DropDownBase.prototype.getSortedDataSource = function (dataSource) {
        if (dataSource && this.sortOrder !== 'None') {
            var textField = this.fields.text ? this.fields.text : 'text';
            dataSource = sf.lists.ListBase.getDataSource(dataSource, sf.lists.ListBase.addSorting(this.sortOrder, textField));
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
            if (!sf.base.isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
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
                    : !sf.base.isNullOrUndefined(dataSource);
                if (!data && this.selectData && this.selectData.length > 0) {
                    dataSource = this.selectData;
                }
            }
            this.setListData(dataSource, fields, query);
        }
    };
    DropDownBase.prototype.updateSelectElementData = function (isFiltering) {
        if (isFiltering && sf.base.isNullOrUndefined(this.selectData) && this.listData && this.listData.length > 0) {
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
                    if (this.list && (!sf.base.isNullOrUndefined(this.liCollections) && this.liCollections.length === 0)) {
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
        this.rippleFun = sf.base.rippleEffect(this.list, rippleModel);
        var group = this.element.querySelector('select>optgroup');
        if ((this.fields.groupBy || !sf.base.isNullOrUndefined(group)) && !this.isGroupChecking) {
            sf.base.EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            sf.base.removeClass([this.element], dropDownBaseClasses.root);
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
        if (this.sortOrder !== 'None' && sf.base.isNullOrUndefined(itemIndex)) {
            var newList = [].slice.call(this.listData);
            newList.push(items);
            newList = this.getSortedDataSource(newList);
            if (this.fields.groupBy) {
                newList = sf.lists.ListBase.groupDataSource(newList, this.fields.properties, this.sortOrder);
                itemIndex = newList.indexOf(items);
            }
            else {
                itemIndex = newList.indexOf(items);
            }
        }
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        var itemsCount = this.getItems().length;
        var selectedItemValue = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]);
        var index;
        index = (sf.base.isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        var fields = this.fields;
        if (items && fields.groupBy) {
            items = sf.lists.ListBase.groupDataSource(items, fields.properties);
        }
        var liCollections = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isHeader = item.isHeader;
            var li = this.createElement('li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });
            var itemText = item instanceof Object ? sf.base.getValue(fields.text, item) : item;
            if (isHeader) {
                li.innerText = itemText;
            }
            if (this.itemTemplate && !isHeader) {
                var compiledString = sf.base.compile(this.itemTemplate);
                // tslint:disable-next-line
                var addItemTemplate = compiledString(item, this, 'itemTemplate', this.itemTemplateId, this.isStringTemplate, null, li);
                if (addItemTemplate) {
                    sf.base.append(addItemTemplate, li);
                }
                this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
            }
            else if (!isHeader) {
                li.appendChild(document.createTextNode(itemText));
            }
            li.setAttribute('data-value', item instanceof Object ? sf.base.getValue(fields.value, item) : item);
            li.setAttribute('role', 'option');
            this.notify('addItem', { module: 'CheckBoxSelection', item: li });
            liCollections.push(li);
            this.listData.push(item);
            if (this.sortOrder === 'None' && sf.base.isNullOrUndefined(itemIndex) && index === 0) {
                index = null;
            }
            this.updateActionCompleteData(li, item, index);
            //Listbox event
            this.trigger('beforeItemRender', { element: li, item: item });
        }
        if (itemsCount === 0 && sf.base.isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.classList.remove(dropDownBaseClasses.noData);
            this.list.appendChild(this.ulElement);
            this.liCollections = liCollections;
            sf.base.append(liCollections, this.ulElement);
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
                            if (this.sortOrder === 'None') {
                                this.ulElement.insertBefore(liCollections[i + 1], listGroupItem[j + 1]);
                            }
                            else {
                                this.ulElement.insertBefore(liCollections[i + 1], this.ulElement.childNodes[itemIndex]);
                            }
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
        var attributes = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes.length; i++) {
            if (!target.getAttribute(attributes[i])) {
                continue;
            }
            var attr = target.getAttribute(attributes[i]);
            hidden.setAttribute(attributes[i], attr);
            target.removeAttribute(attributes[i]);
        }
    };
    DropDownBase.prototype.setZIndex = function () {
        // this is for component wise
    };
    DropDownBase.prototype.updateActionCompleteData = function (li, item, index) {
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
        if (!sf.base.isNullOrUndefined(this.listData)) {
            var type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (var _i = 0, _a = this.listData; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!sf.base.isNullOrUndefined(item) && item === value) {
                        return item;
                    }
                }
            }
            else {
                for (var _b = 0, _c = this.listData; _b < _c.length; _b++) {
                    var item = _c[_b];
                    if (!sf.base.isNullOrUndefined(item) && sf.base.getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
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
            sf.base.EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!sf.base.isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            sf.base.detach(this.list);
        }
        _super.prototype.destroy.call(this);
    };
    
    __decorate([
        sf.base.Complex({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], DropDownBase.prototype, "fields", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownBase.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownBase.prototype, "itemTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownBase.prototype, "groupTemplate", void 0);
    __decorate([
        sf.base.Property('No records found')
    ], DropDownBase.prototype, "noRecordsTemplate", void 0);
    __decorate([
        sf.base.Property('Request failed')
    ], DropDownBase.prototype, "actionFailureTemplate", void 0);
    __decorate([
        sf.base.Property('None')
    ], DropDownBase.prototype, "sortOrder", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownBase.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property([])
    ], DropDownBase.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownBase.prototype, "query", void 0);
    __decorate([
        sf.base.Property('StartsWith')
    ], DropDownBase.prototype, "filterType", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownBase.prototype, "ignoreCase", void 0);
    __decorate([
        sf.base.Property(1000)
    ], DropDownBase.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownBase.prototype, "ignoreAccent", void 0);
    __decorate([
        sf.base.Property()
    ], DropDownBase.prototype, "locale", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "actionBegin", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "actionComplete", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "actionFailure", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "dataBound", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownBase.prototype, "destroyed", void 0);
    DropDownBase = __decorate([
        sf.base.NotifyPropertyChanges
    ], DropDownBase);
    return DropDownBase;
}(sf.base.Component));

/**
 * export all modules from current location
 */

exports.incrementalSearch = incrementalSearch;
exports.Search = Search;
exports.highlightSearch = highlightSearch;
exports.revertHighlightSearch = revertHighlightSearch;
exports.FieldSettings = FieldSettings;
exports.dropDownBaseClasses = dropDownBaseClasses;
exports.DropDownBase = DropDownBase;

return exports;

});
window.sf.dropdowns = window.sf.base.extend({}, window.sf.dropdowns, dropdownsbase({}));
