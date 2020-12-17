import { Animation, Browser, ChildProperty, Complex, Component, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getComponent, getUniqueID, getValue, isBlazor, isNullOrUndefined, isUndefined, matches, prepend, remove, removeClass, resetBlazorTemplate, rippleEffect, select, selectAll, setStyleAttribute, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { DataManager, DataUtil, Predicate, Query } from '@syncfusion/ej2-data';
import { ListBase, Sortable, cssClass, moveTo } from '@syncfusion/ej2-lists';
import { Popup, createSpinner, getZindexPartial, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Input, TextBox } from '@syncfusion/ej2-inputs';
import { Button, createCheckBox } from '@syncfusion/ej2-buttons';
import { TreeView } from '@syncfusion/ej2-navigations';

/**
 * IncrementalSearch module file
 */
let queryString = '';
let prevString = '';
let matches$1 = [];
let activeClass = 'e-active';
let prevElementId = '';
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
    setTimeout(() => { queryString = ''; }, 1000);
    let index;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevElementId === elementId && prevString === queryString) {
        for (let i = 0; i < matches$1.length; i++) {
            if (matches$1[i].classList.contains(activeClass)) {
                index = i;
                break;
            }
        }
        index = index + 1;
        return matches$1[index];
    }
    else {
        let listItems = items;
        let strLength = queryString.length;
        let text;
        let item;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        let i = selectedIndex;
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
        prevElementId = elementId;
        return matches$1[0];
    }
}
function Search(inputVal, items, searchType, ignoreCase) {
    let listItems = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    let itemData = { item: null, index: null };
    if (inputVal && inputVal.length) {
        let strLength = inputVal.length;
        let queryStr = ignoreCase ? inputVal.toLocaleLowerCase() : inputVal;
        for (let i = 0, itemsData = listItems; i < itemsData.length; i++) {
            let item = itemsData[i];
            let text = (ignoreCase ? item.textContent.toLocaleLowerCase() : item.textContent).replace(/^\s+|\s+$/g, '');
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
        let ignoreRegex = ignoreCase ? 'gim' : 'gm';
        query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        let replaceQuery = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
        findTextNode(element, new RegExp(replaceQuery, ignoreRegex), isBlazor$$1);
    }
}
function findTextNode(element, pattern, isBlazor$$1) {
    for (let index = 0; element.childNodes && (index < element.childNodes.length); index++) {
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
    let contentElement = content.querySelectorAll('.e-highlight');
    for (let i = contentElement.length - 1; i >= 0; i--) {
        let parent = contentElement[i].parentNode;
        let text = document.createTextNode(contentElement[i].textContent);
        parent.replaceChild(text, contentElement[i]);
    }
}

/**
 * Common source
 */

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class FieldSettings extends ChildProperty {
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
const dropDownBaseClasses = {
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
const ITEMTEMPLATE_PROPERTY = 'ItemTemplate';
const VALUETEMPLATE_PROPERTY = 'ValueTemplate';
const GROUPTEMPLATE_PROPERTY = 'GroupTemplate';
const HEADERTEMPLATE_PROPERTY = 'HeaderTemplate';
const FOOTERTEMPLATE_PROPERTY = 'FooterTemplate';
const NORECORDSTEMPLATE_PROPERTY = 'NoRecordsTemplate';
const ACTIONFAILURETEMPLATE_PROPERTY = 'ActionFailureTemplate';
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
let DropDownBase = class DropDownBase extends Component {
    /**
     * * Constructor for DropDownBase class
     */
    constructor(options, element) {
        super(options, element);
        this.preventChange = false;
        this.isAngular = false;
        this.isPreventChange = false;
    }
    ;
    getPropObject(prop, newProp, oldProp) {
        let newProperty = new Object();
        let oldProperty = new Object();
        // tslint:disable-next-line:no-function-constructor-with-string-args
        let propName = (prop) => {
            return prop;
        };
        newProperty[propName(prop)] = newProp[propName(prop)];
        oldProperty[propName(prop)] = oldProp[propName(prop)];
        let data = new Object();
        data.newProperty = newProperty;
        data.oldProperty = oldProperty;
        return data;
    }
    getValueByText(text, ignoreCase, ignoreAccent) {
        let value = null;
        if (!isNullOrUndefined(this.listData)) {
            if (ignoreCase) {
                value = this.checkValueCase(text, true, ignoreAccent);
            }
            else {
                value = this.checkValueCase(text, false, ignoreAccent);
            }
        }
        return value;
    }
    ;
    checkValueCase(text, ignoreCase, ignoreAccent, isTextByValue) {
        let value = null;
        if (isTextByValue) {
            value = text;
        }
        let dataSource = this.listData;
        let fields = this.fields;
        let type = this.typeOfData(dataSource).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            for (let item of dataSource) {
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
                dataSource.filter((item) => {
                    let itemValue = getValue(fields.value, item);
                    if (!isNullOrUndefined(itemValue) && this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = getValue(fields.value, item);
                    }
                });
            }
            else {
                if (isTextByValue) {
                    dataSource.filter((item) => {
                        let itemValue = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && !isNullOrUndefined(value) && itemValue.toString() === value.toString()) {
                            value = getValue(fields.text, item);
                        }
                    });
                }
                else {
                    dataSource.filter((item) => {
                        if (this.checkNonIgnoreCase(getValue(fields.text, item), text)) {
                            value = getValue(fields.value, item);
                        }
                    });
                }
            }
        }
        return value;
    }
    checkingAccent(item, text, ignoreCase) {
        let dataItem = DataUtil.ignoreDiacritics(String(item));
        let textItem = DataUtil.ignoreDiacritics(text.toString());
        let value = null;
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
    }
    checkIgnoreCase(item, text) {
        return String(item).toLowerCase() === text.toString().toLowerCase() ? true : false;
    }
    checkNonIgnoreCase(item, text) {
        return String(item) === text.toString() ? true : false;
    }
    getItemValue(dataItem, typedText, ignoreCase, isTextByValue) {
        let value = null;
        let dataSource = this.listData;
        let type = this.typeOfData(dataSource).typeof;
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
    }
    templateCompiler(baseTemplate) {
        let checkTemplate = false;
        if (baseTemplate) {
            try {
                checkTemplate = (select(baseTemplate, document).length) ? true : false;
            }
            catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    }
    l10nUpdate(actionFailure) {
        let ele = this.getModuleName() === 'listbox' ? this.ulElement : this.list;
        if (this.noRecordsTemplate !== 'No records found' || this.actionFailureTemplate !== 'Request failed') {
            this.DropDownBaseresetBlazorTemplates(false, false, true, true);
            let template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString;
            let templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            ele.innerHTML = '';
            let tempaltecheck = this.templateCompiler(template);
            if (tempaltecheck) {
                compiledString = compile(select(template, document).innerHTML.trim());
            }
            else {
                compiledString = compile(template);
            }
            let templateName = actionFailure ? 'actionFailureTemplate' : 'noRecordsTemplate';
            // tslint:disable-next-line
            let noDataCompTemp = compiledString({}, this, templateName, templateId, this.isStringTemplate, null, ele);
            if (noDataCompTemp && noDataCompTemp.length > 0) {
                for (let i = 0; i < noDataCompTemp.length; i++) {
                    ele.appendChild(noDataCompTemp[i]);
                }
            }
            this.DropDownBaseupdateBlazorTemplates(false, false, !actionFailure, actionFailure, false, false, false, false);
        }
        else {
            let l10nLocale = { noRecordsTemplate: 'No records found', actionFailureTemplate: 'Request failed' };
            let componentLocale = new L10n(this.getLocaleName(), {}, this.locale);
            if (componentLocale.getConstant('actionFailureTemplate') !== '') {
                this.l10n = componentLocale;
            }
            else {
                this.l10n = new L10n(this.getModuleName() === 'listbox' ? 'listbox' : 'dropdowns', l10nLocale, this.locale);
            }
            let content = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
            if (this.getModuleName() === 'listbox') {
                let liElem = this.createElement('li');
                liElem.textContent = content;
                ele.appendChild(liElem);
                liElem.classList.add('e-list-nrt');
            }
            else {
                ele.innerHTML = content;
            }
        }
    }
    getLocaleName() {
        return 'drop-down-base';
    }
    ;
    getTextByValue(value) {
        let text;
        text = this.checkValueCase(value, false, false, true);
        return text;
    }
    getFormattedValue(value) {
        if (this.listData && this.listData.length) {
            let item = this.typeOfData(this.listData);
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
    }
    /**
     * Sets RTL to dropdownbase wrapper
     */
    setEnableRtl() {
        if (this.list) {
            this.enableRtlElements.push(this.list);
        }
        this.enableRtl ? addClass(this.enableRtlElements, dropDownBaseClasses.rtl) :
            removeClass(this.enableRtlElements, dropDownBaseClasses.rtl);
    }
    ;
    /**
     * Initialize the Component.
     */
    initialize() {
        this.bindEvent = true;
        this.actionFailureTemplateId = `${this.element.id}${ACTIONFAILURETEMPLATE_PROPERTY}`;
        if (this.element.tagName === 'UL') {
            let jsonElement = ListBase.createJsonFromElement(this.element);
            this.setProperties({ fields: { text: 'text', value: 'text' } }, true);
            this.resetList(jsonElement, this.fields);
        }
        else if (this.element.tagName === 'SELECT') {
            let dataSource = this.dataSource instanceof Array ? (this.dataSource.length > 0 ? true : false)
                : !isNullOrUndefined(this.dataSource) ? true : false;
            if (!dataSource) {
                this.renderItemsBySelect();
            }
        }
        else {
            this.setListData(this.dataSource, this.fields, this.query);
        }
    }
    ;
    DropDownBaseupdateBlazorTemplates(item, group, noRecord, action, value, header, footer, isEmpty) {
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
    }
    DropDownBaseresetBlazorTemplates(item, group, noRecord, action, value, header, footer) {
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
    }
    /**
     * Get the properties to be maintained in persisted state.
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    ;
    /**
     * Sets the enabled state to DropDownBase.
     */
    setEnabled() {
        this.element.setAttribute('aria-disabled', (this.enabled) ? 'false' : 'true');
    }
    ;
    /**
     * Sets the enabled state to DropDownBase.
     */
    updateDataAttribute(value) {
        let invalidAttr = ['class', 'style', 'id', 'type'];
        let attr = {};
        for (let a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(this.getModuleName() === 'dropdownlist' && this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    }
    renderItemsBySelect() {
        let element = this.element;
        let fields = { value: 'value', text: 'text' };
        let jsonElement = [];
        let group = element.querySelectorAll('select>optgroup');
        let option = element.querySelectorAll('select>option');
        this.getJSONfromOption(jsonElement, option, fields);
        if (group.length) {
            for (let i = 0; i < group.length; i++) {
                let item = group[i];
                let optionGroup = {};
                optionGroup[fields.text] = item.label;
                optionGroup.isHeader = true;
                let child = item.querySelectorAll('option');
                jsonElement.push(optionGroup);
                this.getJSONfromOption(jsonElement, child, fields);
            }
            let items = element.querySelectorAll('select>option');
        }
        this.fields.text = fields.text;
        this.fields.value = fields.value;
        this.resetList(jsonElement, fields);
    }
    getJSONfromOption(items, options, fields) {
        for (let option of options) {
            let json = {};
            json[fields.text] = option.innerText;
            json[fields.value] = option.getAttribute(fields.value) ? option.getAttribute(fields.value) : option.innerText;
            items.push(json);
        }
    }
    /**
     * Execute before render the list items
     * @private
     */
    preRender() {
        // there is no event handler
        this.scrollTimer = -1;
        this.enableRtlElements = [];
        this.isRequested = false;
        this.isDataFetched = false;
        this.itemTemplateId = `${this.element.id}${ITEMTEMPLATE_PROPERTY}`;
        this.valueTemplateId = `${this.element.id}${VALUETEMPLATE_PROPERTY}`;
        this.groupTemplateId = `${this.element.id}${GROUPTEMPLATE_PROPERTY}`;
        this.headerTemplateId = `${this.element.id}${HEADERTEMPLATE_PROPERTY}`;
        this.footerTemplateId = `${this.element.id}${FOOTERTEMPLATE_PROPERTY}`;
        this.noRecordsTemplateId = `${this.element.id}${NORECORDSTEMPLATE_PROPERTY}`;
    }
    /**
     * Creates the list items of DropDownBase component.
     */
    setListData(dataSource, fields, query) {
        fields = fields ? fields : this.fields;
        let ulElement;
        this.isActive = true;
        let eventArgs = { cancel: false, data: dataSource, query: query };
        this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
        this.trigger('actionBegin', eventArgs, (eventArgs) => {
            if (!eventArgs.cancel) {
                this.showSpinner();
                if (dataSource instanceof DataManager) {
                    this.isRequested = true;
                    if (this.isDataFetched) {
                        this.emptyDataRequest(fields);
                        return;
                    }
                    eventArgs.data.executeQuery(this.getQuery(eventArgs.query)).then((e) => {
                        this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
                        this.trigger('actionComplete', e, (e) => {
                            if (!e.cancel) {
                                let listItems = e.result;
                                if (listItems.length === 0) {
                                    this.isDataFetched = true;
                                }
                                ulElement = this.renderItems(listItems, fields);
                                this.onActionComplete(ulElement, listItems, e);
                                if (this.groupTemplate) {
                                    this.renderGroupTemplate(ulElement);
                                }
                                this.isRequested = false;
                                this.bindChildItems(listItems, ulElement, fields, e);
                            }
                        });
                    }).catch((e) => {
                        this.isRequested = false;
                        this.onActionFailure(e);
                        this.hideSpinner();
                    });
                }
                else {
                    let dataManager = new DataManager(eventArgs.data);
                    let listItems = (this.getQuery(eventArgs.query)).executeLocal(dataManager);
                    let localDataArgs = { cancel: false, result: listItems };
                    this.isPreventChange = this.isAngular && this.preventChange ? true : this.isPreventChange;
                    this.trigger('actionComplete', localDataArgs, (localDataArgs) => {
                        if (!localDataArgs.cancel) {
                            ulElement = this.renderItems(localDataArgs.result, fields);
                            this.onActionComplete(ulElement, localDataArgs.result);
                            if (this.groupTemplate) {
                                this.renderGroupTemplate(ulElement);
                            }
                            this.bindChildItems(localDataArgs.result, ulElement, fields);
                        }
                    });
                }
            }
        });
    }
    bindChildItems(listItems, ulElement, fields, e) {
        if (listItems.length >= 100 && this.getModuleName() === 'autocomplete') {
            setTimeout(() => {
                let childNode = this.remainingItems(this.sortedData, fields);
                append(childNode, ulElement);
                this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
                this.liCollections = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
                this.updateListValues();
                this.raiseDataBound(listItems, e);
            }, 0);
        }
        else {
            this.raiseDataBound(listItems, e);
        }
    }
    updateListValues() {
        // Used this method in component side.
    }
    findListElement(list, findNode, attribute, value) {
        let liElement = null;
        if (list) {
            let listArr = [].slice.call(list.querySelectorAll(findNode));
            for (let index = 0; index < listArr.length; index++) {
                if (listArr[index].getAttribute(attribute) === (value + '')) {
                    liElement = listArr[index];
                    break;
                }
            }
        }
        return liElement;
    }
    raiseDataBound(listItems, e) {
        this.hideSpinner();
        let dataBoundEventArgs = {
            items: listItems,
            e: e
        };
        this.trigger('dataBound', dataBoundEventArgs);
    }
    remainingItems(dataSource, fields) {
        let spliceData = new DataManager(dataSource).executeLocal(new Query().skip(100));
        if (this.itemTemplate) {
            let listElements = this.templateListItem(spliceData, fields);
            return [].slice.call(listElements.childNodes);
        }
        let type = this.typeOfData(spliceData).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return ListBase.createListItemFromArray(this.createElement, spliceData, true, this.listOption(spliceData, fields), this);
        }
        return ListBase.createListItemFromJson(this.createElement, spliceData, this.listOption(spliceData, fields), 1, true, this);
    }
    emptyDataRequest(fields) {
        let listItems = [];
        this.onActionComplete(this.renderItems(listItems, fields), listItems);
        this.isRequested = false;
        this.hideSpinner();
    }
    showSpinner() {
        // Used this method in component side.
    }
    hideSpinner() {
        // Used this method in component side.
    }
    onActionFailure(e) {
        this.liCollections = [];
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.list], dropDownBaseClasses.noData);
    }
    onActionComplete(ulElement, list, e) {
        this.listData = list;
        if (isBlazor() && this.isServerRendered && this.getModuleName() === 'listbox') {
            remove(this.list.querySelector('.e-list-parent'));
            remove(this.list.querySelector('.e-hidden-select'));
        }
        else {
            // tslint:disable-next-line         
            if (this.isReact) {
                this.clearTemplate(['itemTemplate', 'groupTemplate', 'actionFailureTemplate', 'noRecordsTemplate']);
            }
            this.list.innerHTML = '';
        }
        this.fixedHeaderElement = isNullOrUndefined(this.fixedHeaderElement) ? this.fixedHeaderElement : null;
        this.list.appendChild(ulElement);
        this.liCollections = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        this.ulElement = this.list.querySelector('ul');
        this.postRender(this.list, list, this.bindEvent);
    }
    postRender(listElement, list, bindEvent) {
        let focusItem = listElement.querySelector('.' + dropDownBaseClasses.li);
        let selectedItem = listElement.querySelector('.' + dropDownBaseClasses.selected);
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
    }
    /**
     * Get the query to do the data operation before list item generation.
     */
    getQuery(query) {
        return query ? query : this.query ? this.query : new Query();
    }
    /**
     * To render the template content for group header element.
     */
    renderGroupTemplate(listEle) {
        if (this.fields.groupBy !== null && this.dataSource || this.element.querySelector('.' + dropDownBaseClasses.group)) {
            let dataSource = this.dataSource;
            let option = { groupTemplateID: this.groupTemplateId, isStringTemplate: this.isStringTemplate };
            let headerItems = listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            let groupcheck = this.templateCompiler(this.groupTemplate);
            if (groupcheck) {
                let groupValue = select(this.groupTemplate, document).innerHTML.trim();
                let tempHeaders = ListBase.renderGroupTemplate(groupValue, dataSource, this.fields.properties, headerItems, option, this);
            }
            else {
                let tempHeaders = ListBase.renderGroupTemplate(this.groupTemplate, dataSource, this.fields.properties, headerItems, option, this);
            }
            this.DropDownBaseupdateBlazorTemplates(false, true, false, false, false, false, false, false);
        }
    }
    /**
     * To create the ul li list items
     */
    createListItems(dataSource, fields) {
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
        let options = this.listOption(dataSource, fields);
        let spliceData = (dataSource.length > 100) ?
            new DataManager(dataSource).executeLocal(new Query().take(100))
            : dataSource;
        this.sortedData = dataSource;
        return ListBase.createList(this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true, this);
    }
    ;
    listOption(dataSource, fields) {
        let iconCss = isNullOrUndefined(fields.iconCss) ? false : true;
        let fieldValues = !isNullOrUndefined(fields.properties) ?
            fields.properties : fields;
        let options = (fields.text !== null || fields.value !== null) ? {
            fields: fieldValues,
            showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        return extend({}, options, fields, true);
    }
    ;
    setFloatingHeader(e) {
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
    }
    scrollStop(e) {
        let target = e.target;
        let liHeight = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
        let topIndex = Math.round(target.scrollTop / liHeight);
        let liCollections = this.list.querySelectorAll('li');
        for (let i = topIndex; i > -1; i--) {
            if (!isNullOrUndefined(liCollections[i]) && liCollections[i].classList.contains(dropDownBaseClasses.group)) {
                let currentLi = liCollections[i];
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
    }
    /**
     * To render the list items
     */
    renderItems(listData, fields) {
        let ulElement;
        if (this.itemTemplate && listData) {
            let dataSource = listData;
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
            let spliceData = (dataSource.length > 100) ?
                new DataManager(dataSource).executeLocal(new Query().take(100))
                : dataSource;
            ulElement = this.templateListItem((this.getModuleName() === 'autocomplete') ? spliceData : dataSource, fields);
            let isTempEmpty = (this.getModuleName() === 'listbox') ? true : false;
            this.DropDownBaseupdateBlazorTemplates(true, false, false, false, false, false, false, isTempEmpty);
        }
        else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    }
    ;
    templateListItem(dataSource, fields) {
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        let option = this.listOption(dataSource, fields);
        option.templateID = this.itemTemplateId;
        option.isStringTemplate = this.isStringTemplate;
        let itemcheck = this.templateCompiler(this.itemTemplate);
        if (itemcheck) {
            let itemValue = select(this.itemTemplate, document).innerHTML.trim();
            return ListBase.renderContentTemplate(this.createElement, itemValue, dataSource, fields.properties, option, this);
        }
        else {
            return ListBase.renderContentTemplate(this.createElement, this.itemTemplate, dataSource, fields.properties, option, this);
        }
    }
    ;
    typeOfData(items) {
        let item = { typeof: null, item: null };
        for (let i = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                let listDataType = typeof (items[i]) === 'string' ||
                    typeof (items[i]) === 'number' || typeof (items[i]) === 'boolean';
                let isNullData = listDataType ? isNullOrUndefined(items[i]) :
                    isNullOrUndefined(getValue((this.fields.value ? this.fields.value : 'value'), items[i]));
                if (!isNullData) {
                    return item = { typeof: typeof items[i], item: items[i] };
                }
            }
        }
        return item;
    }
    setFixedHeader() {
        this.list.parentElement.style.display = 'block';
        let borderWidth = 0;
        if (this.list && this.list.parentElement) {
            borderWidth = parseInt(document.defaultView.getComputedStyle(this.list.parentElement, null).getPropertyValue('border-width'), 10);
        }
        let liWidth = this.liCollections[0].offsetWidth - borderWidth;
        this.fixedHeaderElement.style.width = liWidth.toString() + 'px';
        setStyleAttribute(this.fixedHeaderElement, { zIndex: 10 });
        let firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
        this.fixedHeaderElement.innerHTML = firstLi.innerHTML;
    }
    getSortedDataSource(dataSource) {
        if (dataSource && this.sortOrder !== 'None') {
            let textField = this.fields.text ? this.fields.text : 'text';
            dataSource = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, textField));
        }
        return dataSource;
    }
    /**
     * Return the index of item which matched with given value in data source
     */
    getIndexByValue(value) {
        let index;
        let listItems = this.getItems();
        for (let i = 0; i < listItems.length; i++) {
            if (!isNullOrUndefined(value) && listItems[i].getAttribute('data-value') === value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    }
    ;
    /**
     * To dispatch the event manually
     */
    dispatchEvent(element, type) {
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
    }
    /**
     * To set the current fields
     */
    setFields() {
        if (this.fields.value && !this.fields.text) {
            this.fields.text = this.fields.value;
        }
        else if (!this.fields.value && this.fields.text) {
            this.fields.value = this.fields.text;
        }
        else if (!this.fields.value && !this.fields.text) {
            this.fields.value = this.fields.text = 'text';
        }
    }
    /**
     * reset the items list.
     */
    resetList(dataSource, fields, query) {
        if (this.list) {
            if ((this.element.tagName === 'SELECT' && this.element.options.length > 0)
                || (this.element.tagName === 'UL' && this.element.childNodes.length > 0)) {
                let data = dataSource instanceof Array ? (dataSource.length > 0)
                    : !isNullOrUndefined(dataSource);
                if (!data && this.selectData && this.selectData.length > 0) {
                    dataSource = this.selectData;
                }
            }
            this.setListData(dataSource, fields, query);
        }
    }
    updateSelectElementData(isFiltering) {
        if (isFiltering && isNullOrUndefined(this.selectData) && this.listData && this.listData.length > 0) {
            this.selectData = this.listData;
        }
    }
    updateSelection() {
        // This is for after added the item, need to update the selected index values.
    }
    renderList() {
        // This is for render the list items.
        this.render();
    }
    updateDataSource(props) {
        this.resetList(this.dataSource);
    }
    setUpdateInitial(props, newProp) {
        this.isDataFetched = false;
        let updateData = {};
        for (let j = 0; props.length > j; j++) {
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
    }
    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.getModuleName() === 'dropdownbase') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        this.setUpdateInitial(['sortOrder', 'itemTemplate'], newProp);
        for (let prop of Object.keys(newProp)) {
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
                        let firstLi = this.ulElement.querySelector('.' + dropDownBaseClasses.group);
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
    }
    ;
    /**
     * Build and render the component
     * @private
     */
    render(isEmptyData) {
        this.list = this.createElement('div', { className: dropDownBaseClasses.content, attrs: { 'tabindex': '0' } });
        this.list.classList.add(dropDownBaseClasses.root);
        this.setFields();
        let rippleModel = { duration: 300, selector: '.' + dropDownBaseClasses.li };
        this.rippleFun = rippleEffect(this.list, rippleModel);
        let group = this.element.querySelector('select>optgroup');
        if ((this.fields.groupBy || !isNullOrUndefined(group)) && !this.isGroupChecking) {
            EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
        }
        if (this.getModuleName() === 'dropdownbase') {
            if (this.element.getAttribute('tabindex')) {
                this.list.setAttribute('tabindex', this.element.getAttribute('tabindex'));
            }
            removeClass([this.element], dropDownBaseClasses.root);
            this.element.style.display = 'none';
            let wrapperElement = this.createElement('div');
            this.element.parentElement.insertBefore(wrapperElement, this.element);
            wrapperElement.appendChild(this.element);
            wrapperElement.appendChild(this.list);
        }
        this.setEnableRtl();
        this.setEnabled();
        if (!isEmptyData) {
            this.initialize();
        }
    }
    ;
    /**
     * Return the module name of this component.
     * @private
     */
    getModuleName() {
        return 'dropdownbase';
    }
    ;
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    getItems() {
        return this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
    }
    ;
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @deprecated
     */
    addItem(items, itemIndex) {
        if (!this.list || (this.list.textContent === this.noRecordsTemplate && this.getModuleName() !== 'listbox')) {
            this.renderList();
        }
        if (this.sortOrder !== 'None' && isNullOrUndefined(itemIndex)) {
            let newList = [].slice.call(this.listData);
            newList.push(items);
            newList = this.getSortedDataSource(newList);
            if (this.fields.groupBy) {
                newList = ListBase.groupDataSource(newList, this.fields.properties, this.sortOrder);
                itemIndex = newList.indexOf(items);
            }
            else {
                itemIndex = newList.indexOf(items);
            }
        }
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        let itemsCount = this.getItems().length;
        let selectedItemValue = this.list.querySelector('.' + dropDownBaseClasses.selected);
        items = (items instanceof Array ? items : [items]);
        let index;
        index = (isNullOrUndefined(itemIndex) || itemIndex < 0 || itemIndex > itemsCount - 1) ? itemsCount : itemIndex;
        let fields = this.fields;
        if (items && fields.groupBy) {
            items = ListBase.groupDataSource(items, fields.properties);
        }
        let liCollections = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let isHeader = item.isHeader;
            let li = this.createElement('li', { className: isHeader ? dropDownBaseClasses.group : dropDownBaseClasses.li, id: 'option-add-' + i });
            let itemText = item instanceof Object ? getValue(fields.text, item) : item;
            if (isHeader) {
                li.innerText = itemText;
            }
            if (this.itemTemplate && !isHeader) {
                let compiledString = compile(this.itemTemplate);
                // tslint:disable-next-line
                let addItemTemplate = compiledString(item, this, 'itemTemplate', this.itemTemplateId, this.isStringTemplate, null, li);
                if (addItemTemplate) {
                    append(addItemTemplate, li);
                }
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
            if (this.sortOrder === 'None' && isNullOrUndefined(itemIndex) && index === 0) {
                index = null;
            }
            this.updateActionCompleteData(li, item, index);
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
            let attr = [];
            for (let i = 0; i < items.length; i++) {
                let listGroupItem = this.ulElement.querySelectorAll('.e-list-group-item');
                for (let j = 0; j < listGroupItem.length; j++) {
                    attr[j] = listGroupItem[j].innerText;
                }
                if (attr.indexOf(liCollections[i].innerText) > -1 && fields.groupBy) {
                    for (let j = 0; j < listGroupItem.length; j++) {
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
                let tempLi = [].slice.call(this.liCollections);
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
    }
    validationAttribute(target, hidden) {
        let name = target.getAttribute('name') ? target.getAttribute('name') : target.getAttribute('id');
        hidden.setAttribute('name', name);
        target.removeAttribute('name');
        let attributes$$1 = ['required', 'aria-required', 'form'];
        for (let i = 0; i < attributes$$1.length; i++) {
            if (!target.getAttribute(attributes$$1[i])) {
                continue;
            }
            let attr = target.getAttribute(attributes$$1[i]);
            hidden.setAttribute(attributes$$1[i], attr);
            target.removeAttribute(attributes$$1[i]);
        }
    }
    setZIndex() {
        // this is for component wise
    }
    updateActionCompleteData(li, item, index) {
        // this is for ComboBox custom value
    }
    updateAddItemList(list, itemCount) {
        // this is for multiselect add item
    }
    updateDataList() {
        // this is for multiselect update list items
    }
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     */
    getDataByValue(value) {
        if (!isNullOrUndefined(this.listData)) {
            let type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (let item of this.listData) {
                    if (!isNullOrUndefined(item) && item === value) {
                        return item;
                    }
                }
            }
            else {
                for (let item of this.listData) {
                    if (!isNullOrUndefined(item) && getValue((this.fields.value ? this.fields.value : 'value'), item) === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    destroy() {
        if (document.body.contains(this.list)) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
            if (!isNullOrUndefined(this.rippleFun)) {
                this.rippleFun();
            }
            detach(this.list);
        }
        super.destroy();
    }
    ;
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
    Property('No records found')
], DropDownBase.prototype, "noRecordsTemplate", void 0);
__decorate([
    Property('Request failed')
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

/**
 * export all modules from current location
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
// don't use space in classnames 
const dropDownListClasses = {
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
let inputObject = {
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
let DropDownList = class DropDownList extends DropDownBase {
    /**
     * * Constructor for creating the DropDownList component.
     */
    constructor(options, element) {
        super(options, element);
        this.previousValue = null;
        this.isListSearched = false;
        this.preventChange = false;
        this.isAngular = false;
    }
    ;
    /**
     * Initialize the event handler.
     * @private
     */
    preRender() {
        let checkBlazor = isBlazor() && this.isServerRendered;
        this.isServerBlazor = (checkBlazor) ? true : false;
        if (this.isServerBlazor) {
            this.initializeData();
        }
        else {
            this.element.style.opacity = '0';
            this.initializeData();
            super.preRender();
        }
        this.activeIndex = this.index;
        this.queryString = '';
    }
    initializeData() {
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
    }
    setZIndex() {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    }
    renderList(isEmptyData) {
        if (!this.isServerBlazor) {
            super.render(isEmptyData);
            this.wireListEvents();
        }
        else {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, false);
        }
    }
    floatLabelChange() {
        if (this.getModuleName() === 'dropdownlist' && this.floatLabelType === 'Auto') {
            let floatElement = this.inputWrapper.container.querySelector('.e-float-text');
            if (this.inputElement.value !== '' || this.isInteracted) {
                classList(floatElement, ['e-label-top'], ['e-label-bottom']);
            }
            else {
                classList(floatElement, ['e-label-bottom'], ['e-label-top']);
            }
        }
    }
    resetHandler(e) {
        e.preventDefault();
        this.clearAll(e);
    }
    resetFocusElement() {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete' && !isNullOrUndefined(this.ulElement)) {
            let li = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if (li) {
                li.classList.add(dropDownListClasses.focus);
            }
        }
    }
    clearAll(e, properties) {
        if (isNullOrUndefined(properties) || (!isNullOrUndefined(properties) &&
            (isNullOrUndefined(properties.dataSource) ||
                (!(properties.dataSource instanceof DataManager) && properties.dataSource.length === 0)))) {
            this.isActive = true;
            this.resetSelection(properties);
        }
        let dataItem = this.getItemData();
        if (this.previousValue === dataItem.value) {
            return;
        }
        this.onChangeEvent(e);
    }
    resetSelection(properties) {
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
                    let actionList = this.actionCompleteData.ulElement.querySelector('li');
                    let ulElement = this.ulElement && this.ulElement.querySelector('li');
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
    }
    setHTMLAttributes() {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                if (htmlAttr === 'class') {
                    let updatedClassValue = (this.htmlAttributes[htmlAttr].replace(/\s+/g, ' ')).trim();
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
                    let defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    let validateAttr = ['name', 'required'];
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
    }
    getAriaAttributes() {
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
    }
    setEnableRtl() {
        Input.setEnableRtl(this.enableRtl, [this.inputElement.parentElement]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    }
    setEnable() {
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
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    ;
    getLocaleName() {
        return 'drop-down-list';
    }
    ;
    preventTabIndex(element) {
        if (this.getModuleName() === 'dropdownlist') {
            element.tabIndex = -1;
        }
    }
    targetElement() {
        return this.inputWrapper.container;
    }
    getNgDirective() {
        return 'EJS-DROPDOWNLIST';
    }
    getElementByText(text) {
        return this.getElementByValue(this.getValueByText(text));
    }
    getElementByValue(value) {
        let item;
        let listItems = this.getItems();
        for (let liItem of listItems) {
            if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                item = liItem;
                break;
            }
        }
        return item;
    }
    ;
    initValue() {
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        }
        else {
            this.updateValues();
        }
    }
    updateValues() {
        if (!isNullOrUndefined(this.value)) {
            this.setSelection(this.getElementByValue(this.value), null);
        }
        else if (this.text && isNullOrUndefined(this.value)) {
            let element = this.getElementByText(this.text);
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
    }
    onBlur(e) {
        if (!this.enabled) {
            return;
        }
        let target = e.relatedTarget;
        let currentTarget = e.target;
        let isPreventBlur = this.isPreventBlur;
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
    }
    focusOutAction(e) {
        this.isInteracted = false;
        this.focusOut(e);
        this.onFocusOut();
    }
    onFocusOut() {
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
    }
    onFocus(e) {
        if (!this.isInteracted) {
            this.isInteracted = true;
            let args = { isInteracted: e ? true : false, event: e };
            this.trigger('focus', args);
        }
        this.updateIconState();
    }
    resetValueHandler(e) {
        let formElement = closest(this.inputElement, 'form');
        if (formElement && e.target === formElement) {
            let val = (this.element.tagName === this.getNgDirective()) ? null : this.inputElement.getAttribute('value');
            this.text = val;
        }
    }
    wireEvent() {
        EventHandler.add(this.inputWrapper.container, 'mousedown', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper.container, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper.container, 'keypress', this.onSearch, this);
        this.bindCommonEvent();
    }
    bindCommonEvent() {
        EventHandler.add(this.targetElement(), 'blur', this.onBlur, this);
        let formElement = closest(this.inputElement, 'form');
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
    }
    bindClearEvent() {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    }
    unBindCommonEvent() {
        EventHandler.remove(this.targetElement(), 'blur', this.onBlur);
        let formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
        if (this.showClearButton) {
            EventHandler.remove(this.inputWrapper.clearButton, 'mousedown', this.resetHandler);
        }
    }
    updateIconState() {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
            else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }
    /**
     * Event binding for list
     */
    wireListEvents() {
        EventHandler.add(this.list, 'click', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    }
    ;
    onSearch(e) {
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
    }
    onServerIncrementalSearch(e) {
        if (!this.isRequested && !isNullOrUndefined(this.list) &&
            !isNullOrUndefined(this.list.querySelector('li')) && this.enabled && !this.readonly) {
            this.incrementalSearch(e);
        }
    }
    onMouseClick(e) {
        let target = e.target;
        let classList$$1 = target.classList;
        let li = closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        if (Browser.isDevice && this.isFilterLayout()) {
            history.back();
        }
        else {
            let delay = 100;
            this.closePopup(delay);
        }
    }
    onMouseOver(e) {
        let currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    }
    ;
    setHover(li) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    }
    ;
    onMouseLeave(e) {
        this.removeHover();
    }
    ;
    removeHover() {
        if (this.list) {
            let hoveredItem = (this.isServerBlazor && this.popupObj && this.popupObj.element) ?
                this.popupObj.element.querySelectorAll('.' + dropDownBaseClasses.hover) :
                this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.hover);
            }
        }
    }
    ;
    isValidLI(li) {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    }
    ;
    incrementalSearch(e) {
        if (this.liCollections.length > 0) {
            let li = incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true, this.element.id, this.isServerBlazor);
            if (!isNullOrUndefined(li)) {
                this.setSelection(li, e);
                this.setScrollPosition();
            }
        }
    }
    ;
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    hideSpinner() {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
            removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            this.spinnerElement.innerHTML = '';
            this.spinnerElement = null;
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    showSpinner() {
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
    }
    keyActionHandler(e) {
        if (!this.enabled) {
            return;
        }
        let preventAction = e.action === 'pageUp' || e.action === 'pageDown';
        let preventHomeEnd = this.getModuleName() !== 'dropdownlist' && (e.action === 'home' || e.action === 'end');
        this.isEscapeKey = e.action === 'escape';
        this.isTabKey = !this.isPopupOpen && e.action === 'tab';
        let isNavAction = e.action === 'down' || e.action === 'up' || e.action === 'home' || e.action === 'end';
        let isNavigation = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        if ((this.isEditTextBox() || preventAction || preventHomeEnd) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            let isTabAction = e.action === 'tab' || e.action === 'close';
            if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape') {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (!(this.isServerBlazor && (e.action === 'open' || e.action === 'space')) && isNullOrUndefined(this.list) ||
                (!isNullOrUndefined(this.liCollections) && isNavigation && this.liCollections.length === 0) || this.isRequested) {
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
    }
    updateUpDownAction(e) {
        if (this.isServerBlazor && isNullOrUndefined(this.list)) {
            this.isServerNavigation = true;
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
        }
        else {
            this.isServerNavigation = false;
            let focusEle = this.list.querySelector('.' + dropDownListClasses.focus);
            if (this.isSelectFocusItem(focusEle)) {
                this.setSelection(focusEle, e);
            }
            else {
                let nextItem;
                let index = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
                let startIndex = 0;
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
    }
    updateHomeEndAction(e) {
        if (this.getModuleName() === 'dropdownlist') {
            if (this.isServerBlazor && isNullOrUndefined(this.list)) {
                this.isServerNavigation = true;
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
            }
            else {
                this.isServerNavigation = false;
                let findLi = 0;
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
    }
    selectCurrentValueOnTab(e) {
        if (this.getModuleName() === 'autocomplete') {
            this.selectCurrentItem(e);
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup(e);
                this.focusDropDown(e);
            }
        }
    }
    mobileKeyActionHandler(e) {
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
    }
    selectCurrentItem(e) {
        if (this.isPopupOpen) {
            let li = this.list.querySelector('.' + dropDownListClasses.focus);
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
    }
    isSelectFocusItem(element) {
        return !isNullOrUndefined(element);
    }
    getPageCount() {
        let liHeight = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
    }
    pageUpSelection(steps, event) {
        let previousItem = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        this.setSelection(previousItem, event);
    }
    ;
    pageDownSelection(steps, event) {
        let list = this.getItems();
        let previousItem = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        this.setSelection(previousItem, event);
    }
    ;
    unWireEvent() {
        EventHandler.remove(this.inputWrapper.container, 'mousedown', this.dropDownClick);
        EventHandler.remove(this.inputWrapper.container, 'keypress', this.onSearch);
        EventHandler.remove(this.inputWrapper.container, 'focus', this.focusIn);
        this.unBindCommonEvent();
    }
    /**
     * Event un binding for list items.
     */
    unWireListEvents() {
        EventHandler.remove(this.list, 'click', this.onMouseClick);
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    }
    ;
    checkSelector(id) {
        return '[id="' + id.replace(/(:|\.|\[|\]|,|=|@|\\|\/|#)/g, '\\$1') + '"]';
    }
    onDocumentClick(e) {
        let target = e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, this.checkSelector(this.popupObj.element.id))) &&
            !this.inputWrapper.container.contains(e.target)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                let isActive = this.isRequested;
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
    }
    activeStateChange() {
        if (this.isDocumentClick) {
            this.hidePopup();
            this.onFocusOut();
            this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
        }
    }
    focusDropDown(e) {
        if (!this.initial && this.isFilterLayout()) {
            this.focusIn(e);
        }
    }
    dropDownClick(e) {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable) || this.inputWrapper.clearButton === e.target) {
            return;
        }
        let target = e.target;
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
            let proxy = this;
            let duration = (isBlazor()) ? 1000 : (this.element.tagName === this.getNgDirective() && this.itemTemplate) ? 500 : 100;
            if (!this.isSecondClick) {
                setTimeout(() => { proxy.cloneElements(); proxy.isSecondClick = true; }, duration);
            }
        }
        else {
            this.focusIn(e);
        }
    }
    cloneElements() {
        if (this.list) {
            let ulElement = this.list.querySelector('ul');
            if (ulElement) {
                ulElement = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                this.actionCompleteData.ulElement = ulElement;
            }
        }
    }
    updateSelectedItem(li, e, preventSelect, isSelection) {
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        let value = this.getFormattedValue(li.getAttribute('data-value'));
        let selectedData = this.getDataByValue(value);
        if (!this.initial && !preventSelect && !isNullOrUndefined(e)) {
            let items = this.detachChanges(selectedData);
            this.isSelected = true;
            let eventArgs = {
                e: e,
                item: li,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, (eventArgs) => {
                if (eventArgs.cancel) {
                    li.classList.remove(dropDownBaseClasses.selected);
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
    }
    selectEventCallback(li, e, preventSelect, selectedData, value) {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li;
        this.itemData = selectedData;
        let focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    }
    activeItem(li) {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            this.removeSelection();
            li.classList.add(dropDownBaseClasses.selected);
            this.removeHover();
            li.setAttribute('aria-selected', 'true');
        }
    }
    setValue(e) {
        let dataItem = this.getItemData();
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
    }
    setSelection(li, e) {
        if (this.isValidLI(li) && (!li.classList.contains(dropDownBaseClasses.selected) || (this.isPopupOpen && this.isSelected
            && li.classList.contains(dropDownBaseClasses.selected)))) {
            this.updateSelectedItem(li, e, false, true);
        }
        else {
            this.setSelectOptions(li, e);
        }
    }
    setSelectOptions(li, e) {
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
    }
    dropdownCompiler(dropdownTemplate) {
        let checkTemplate = false;
        if (dropdownTemplate) {
            try {
                checkTemplate = (document.querySelectorAll(dropdownTemplate).length) ? true : false;
            }
            catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    }
    setValueTemplate() {
        let compiledString;
        // tslint:disable-next-line
        if (this.isReact) {
            this.clearTemplate(['valueTemplate']);
        }
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        this.valueTempElement.innerHTML = '';
        let templateData = (isBlazor()) ? JSON.parse(JSON.stringify(this.itemData)) : this.itemData;
        let valuecheck = this.dropdownCompiler(this.valueTemplate);
        if (valuecheck) {
            compiledString = compile(document.querySelector(this.valueTemplate).innerHTML.trim());
        }
        else {
            compiledString = compile(this.valueTemplate);
        }
        // tslint:disable-next-line
        let valueCompTemp = compiledString(templateData, this, 'valueTemplate', this.valueTemplateId, this.isStringTemplate, null, this.valueTempElement);
        if (valueCompTemp && valueCompTemp.length > 0) {
            for (let i = 0; i < valueCompTemp.length; i++) {
                this.valueTempElement.appendChild(valueCompTemp[i]);
            }
        }
        this.renderReactTemplates();
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, true, true);
    }
    removeSelection() {
        if (this.list) {
            let selectedItems = this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
            if (selectedItems.length) {
                removeClass(selectedItems, dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    }
    ;
    getItemData() {
        let fields = this.fields;
        let dataItem = null;
        dataItem = this.itemData;
        let dataValue;
        let dataText;
        if (!isNullOrUndefined(dataItem)) {
            dataValue = getValue(fields.value, dataItem);
            dataText = getValue(fields.text, dataItem);
        }
        let value = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataValue : dataItem);
        let text = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    }
    /**
     * To trigger the change event for list.
     */
    onChangeEvent(eve) {
        let dataItem = this.getItemData();
        let index = this.isSelectCustom ? null : this.activeIndex;
        this.setProperties({ 'index': index, 'text': dataItem.text, 'value': dataItem.value }, true);
        this.detachChangeEvent(eve);
    }
    ;
    detachChanges(value) {
        let items;
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
    }
    detachChangeEvent(eve) {
        this.isSelected = false;
        this.previousValue = this.value;
        this.activeIndex = this.index;
        this.typedString = !isNullOrUndefined(this.text) ? this.text : '';
        if (!this.initial) {
            let items = this.detachChanges(this.itemData);
            let preItems;
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
            let eventArgs = {
                e: eve,
                item: this.item,
                itemData: items,
                previousItem: this.previousSelectedLI,
                previousItemData: preItems,
                isInteracted: eve ? true : false,
                value: this.value,
                element: this.element
            };
            if (this.isAngular && this.preventChange) {
                this.preventChange = false;
            }
            else {
                this.trigger('change', eventArgs);
            }
            if (this.isServerBlazor && this.enablePersistence) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('ServerChange');
            }
        }
        if ((isNullOrUndefined(this.value) || this.value === '') && this.floatLabelType !== 'Always') {
            removeClass([this.inputWrapper.container], 'e-valid-input');
        }
    }
    setHiddenValue() {
        if (!isNullOrUndefined(this.value)) {
            if (this.isServerBlazor && this.hiddenElement.querySelector('option')) {
                let selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.textContent = this.text;
                selectedElement.setAttribute('value', this.value.toString());
            }
            else if (!this.isServerBlazor) {
                this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
                let selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.setAttribute('value', this.value.toString());
            }
        }
        else if (!this.isServerBlazor) {
            this.hiddenElement.innerHTML = '';
        }
    }
    /**
     * Filter bar implementation
     */
    onFilterUp(e) {
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
    }
    onFilterDown(e) {
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
    }
    removeFillSelection() {
        if (this.isInteracted) {
            let selection = this.getSelectionPoints();
            this.inputElement.setSelectionRange(selection.end, selection.end);
        }
    }
    getQuery(query) {
        let filterQuery;
        if (!this.isCustomFilter && this.allowFiltering && this.filterInput) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
            let filterType = this.typedString === '' ? 'contains' : this.filterType;
            let dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                let fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    }
    getSelectionPoints() {
        let input = this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    }
    searchLists(e) {
        this.isTyped = true;
        this.activeIndex = null;
        this.isListSearched = true;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            let clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
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
                let eventArgs = {
                    preventDefaultAction: false,
                    text: this.filterInput.value,
                    updateData: (dataSource, query, fields) => {
                        if (eventArgs.cancel) {
                            return;
                        }
                        this.isCustomFilter = true;
                        this.filteringAction(dataSource, query, fields);
                    },
                    baseEventArgs: e,
                    cancel: false
                };
                this.trigger('filtering', eventArgs, (eventArgs) => {
                    if (!eventArgs.cancel && !this.isCustomFilter && !eventArgs.preventDefaultAction) {
                        this.filteringAction(this.dataSource, null, this.fields);
                    }
                });
            }
        }
    }
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    filter(dataSource, query, fields) {
        this.isCustomFilter = true;
        this.filteringAction(dataSource, query, fields);
    }
    filteringAction(dataSource, query, fields) {
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
            this.renderReactTemplates();
        }
    }
    setSearchBox(popupElement) {
        if (this.isFiltering()) {
            let parentElement = popupElement.querySelector('.' + dropDownListClasses.filterParent) ?
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
            let backIcon = false;
            if (Browser.isDevice) {
                backIcon = true;
            }
            this.filterInputObj = Input.createInput({
                element: this.filterInput,
                buttons: backIcon ?
                    [dropDownListClasses.backIcon, dropDownListClasses.filterBarClearIcon] : [dropDownListClasses.filterBarClearIcon],
                properties: { placeholder: this.filterBarPlaceholder }
            }, this.createElement);
            if (!isNullOrUndefined(this.cssClass)) {
                if (this.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    addClass([this.filterInputObj.container], 'e-outline');
                }
                else if (this.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    addClass([this.filterInputObj.container], 'e-filled');
                }
            }
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
    }
    ;
    onInput(e) {
        this.isValidKey = true;
        // For filtering works in mobile firefox.
        if (Browser.isDevice && Browser.info.name === 'mozilla') {
            this.typedString = this.filterInput.value;
            this.preventAutoFill = true;
            this.searchLists(e);
        }
    }
    pasteHandler(e) {
        setTimeout(() => {
            this.typedString = this.filterInput.value;
            this.searchLists(e);
        });
    }
    onActionFailure(e) {
        super.onActionFailure(e);
        if (this.beforePopupOpen) {
            this.renderPopup();
        }
    }
    onActionComplete(ulElement, list, e, isUpdated) {
        if (this.isNotSearchList) {
            this.isNotSearchList = false;
            return;
        }
        if (this.isActive) {
            let selectedItem = this.selectedLI ? this.selectedLI.cloneNode(true) : null;
            super.onActionComplete(ulElement, list, e);
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
                    let checkField = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                    let checkVal = list.some((x) => x[checkField] === this.value);
                    if (!checkVal) {
                        this.dataSource.executeQuery(this.getQuery(this.query).where(new Predicate(checkField, 'equal', this.value)))
                            .then((e) => {
                            if (e.result.length > 0) {
                                this.addItem(e.result, list.length);
                                this.updateValues();
                            }
                        });
                    }
                }
            }
            if (this.getModuleName() !== 'autocomplete' && this.isFiltering() && !this.isTyped) {
                if (!this.actionCompleteData.isUpdated || ((!this.isCustomFilter
                    && !this.isFilterFocus) || (isNullOrUndefined(this.itemData) && this.allowFiltering)
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
    }
    addNewItem(listData, newElement) {
        if (!isNullOrUndefined(this.itemData) && !isNullOrUndefined(newElement)) {
            let value = this.getItemData().value;
            let isExist = listData.some((data) => {
                return (((typeof data === 'string' || typeof data === 'number') && data === value) ||
                    (getValue(this.fields.value, data) === value));
            });
            if (!isExist) {
                this.addItem(this.itemData);
            }
        }
    }
    updateActionCompleteData(li, item, index) {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            if (index != null) {
                this.actionCompleteData.ulElement.insertBefore(li.cloneNode(true), this.actionCompleteData.ulElement.childNodes[index]);
            }
            else {
                this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
            }
            if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) < 0) {
                this.actionCompleteData.list.push(item);
            }
        }
    }
    focusIndexItem() {
        let value = this.getItemData().value;
        this.activeIndex = this.getIndexByValue(value);
        let element = this.findListElement(this.list, 'li', 'data-value', value);
        this.selectedLI = element;
        this.activeItem(element);
        this.removeFocus();
    }
    updateSelection() {
        let selectedItem = this.list.querySelector('.' + dropDownBaseClasses.selected);
        if (selectedItem) {
            this.setProperties({ 'index': this.getIndexByValue(selectedItem.getAttribute('data-value')) });
            this.activeIndex = this.index;
        }
        else {
            this.removeFocus();
            this.list.querySelector('.' + dropDownBaseClasses.li).classList.add(dropDownListClasses.focus);
        }
    }
    removeFocus() {
        let highlightedItem = this.list.querySelectorAll('.' + dropDownListClasses.focus);
        if (highlightedItem && highlightedItem.length) {
            removeClass(highlightedItem, dropDownListClasses.focus);
        }
    }
    ;
    renderPopup() {
        if (this.popupObj && document.body.contains(this.popupObj.element)) {
            this.refreshPopup();
            return;
        }
        let args = { cancel: false };
        this.trigger('beforeOpen', args, (args) => {
            if (!args.cancel) {
                let popupEle = (this.serverPopupEle) ? this.serverPopupEle : this.createElement('div', {
                    id: this.element.id + '_popup', className: 'e-ddl e-popup ' + (this.cssClass != null ? this.cssClass : '')
                });
                let searchBox = this.setSearchBox(popupEle);
                this.listHeight = formatUnit(this.popupHeight);
                if (this.headerTemplate && !this.isServerBlazor) {
                    this.setHeaderTemplate(popupEle);
                }
                append([this.list], popupEle);
                if (this.footerTemplate && !this.isServerBlazor) {
                    this.setFooterTemplate(popupEle);
                }
                if (this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer')) {
                    popupEle.appendChild(popupEle.querySelector('.e-ddl-footer'));
                }
                document.body.appendChild(popupEle);
                this.updateServerPopup(popupEle);
                popupEle.style.visibility = 'hidden';
                if (this.popupHeight !== 'auto') {
                    this.searchBoxHeight = 0;
                    if (!isNullOrUndefined(searchBox.container)) {
                        this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                        this.listHeight = (parseInt(this.listHeight, 10) - (this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.headerTemplate || (this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-header'))) {
                        this.header = this.header ? this.header : popupEle.querySelector('.e-ddl-header');
                        let height = Math.round(this.header.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    if (this.footerTemplate || (this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer'))) {
                        this.footer = this.footer ? this.footer : popupEle.querySelector('.e-ddl-footer');
                        let height = Math.round(this.footer.getBoundingClientRect().height);
                        this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
                    }
                    this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
                    popupEle.style.maxHeight = formatUnit(this.popupHeight);
                }
                else {
                    popupEle.style.height = 'auto';
                }
                let offsetValue = 0;
                let left;
                if (!isNullOrUndefined(this.selectedLI) && (!isNullOrUndefined(this.activeIndex) && this.activeIndex >= 0)) {
                    this.setScrollPosition();
                }
                else {
                    this.list.scrollTop = 0;
                }
                if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
                    (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
                    offsetValue = this.getOffsetValue(popupEle);
                    let firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
                    left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                        parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                        parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10));
                }
                this.getFocusElement();
                this.createPopup(popupEle, offsetValue, left);
                this.checkCollision(popupEle);
                if (Browser.isDevice) {
                    this.popupObj.element.classList.add(dropDownListClasses.device);
                    if (this.getModuleName() === 'dropdownlist' || (this.getModuleName() === 'combobox'
                        && !this.allowFiltering && this.isDropDownClick)) {
                        this.popupObj.collision = { X: 'fit', Y: 'fit' };
                    }
                    if (this.isFilterLayout()) {
                        this.popupObj.element.classList.add(dropDownListClasses.mobileFilter);
                        this.popupObj.position = { X: 0, Y: 0 };
                        this.popupObj.dataBind();
                        attributes(this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                        addClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
                        this.setSearchBoxPosition();
                        this.backIconElement = searchBox.container.querySelector('.e-back-icon');
                        this.clearIconElement = searchBox.container.querySelector('.' + dropDownListClasses.clearIcon);
                        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
                        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                    }
                }
                popupEle.style.visibility = 'visible';
                addClass([popupEle], 'e-popup-close');
                let scrollParentElements = this.popupObj.getScrollableParent(this.inputWrapper.container);
                for (let element of scrollParentElements) {
                    EventHandler.add(element, 'scroll', this.scrollHandler, this);
                }
                if (Browser.isDevice && this.isFilterLayout()) {
                    EventHandler.add(this.list, 'scroll', this.listScroll, this);
                }
                attributes(this.targetElement(), { 'aria-expanded': 'true' });
                let inputParent = this.isFiltering() ? this.filterInput.parentElement : this.inputWrapper.container;
                addClass([inputParent], [dropDownListClasses.inputFocus]);
                let animModel = { name: 'FadeIn', duration: 100 };
                this.beforePopupOpen = true;
                let popupInstance = (isBlazor() && this.isServerRendered) ? null : this.popupObj;
                let eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
                this.trigger('open', eventArgs, (eventArgs) => {
                    if (!eventArgs.cancel) {
                        this.serverBlazorUpdateSelection();
                        this.bindServerScrollEvent();
                        addClass([this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
                        this.renderReactTemplates();
                        this.popupObj.show(new Animation(eventArgs.animation), (this.zIndex === 1000) ? this.element : null);
                    }
                    else {
                        this.beforePopupOpen = false;
                        this.destroyPopup();
                    }
                });
            }
            else {
                this.beforePopupOpen = false;
            }
        });
    }
    checkCollision(popupEle) {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            let collision = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
            this.popupObj.resolveCollision();
        }
    }
    serverBlazorUpdateSelection() {
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
    }
    bindServerScrollEvent() {
        if (this.isServerBlazor && this.list) {
            if ((this.fields.groupBy) && !this.isGroupChecking) {
                EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
            }
        }
    }
    updateServerPopup(popupEle) {
        if (this.isServerBlazor) {
            if (popupEle && popupEle.querySelector('li')) {
                removeClass([popupEle.querySelector('.e-content')], ['e-nodata']);
            }
            this.initial = false;
            popupEle.removeAttribute('style');
        }
    }
    getOffsetValue(popupEle) {
        let popupStyles = getComputedStyle(popupEle);
        let borderTop = parseInt(popupStyles.borderTopWidth, 10);
        let borderBottom = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    }
    createPopup(element, offsetValue, left) {
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputWrapper.container, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.zIndex,
            close: () => {
                if (!this.isDocumentClick) {
                    this.focusDropDown();
                }
                // tslint:disable-next-line
                if (this.isReact) {
                    this.clearTemplate(['headerTemplate', 'footerTemplate']);
                }
                let isResetItem = (this.getModuleName() === 'autocomplete') ? true : false;
                this.DropDownBaseresetBlazorTemplates(isResetItem, isResetItem, true, true, false, true, true);
                this.isNotSearchList = false;
                this.isDocumentClick = false;
                this.destroyPopup();
                let formElement = closest(this.inputElement, 'form');
                if (this.isFiltering() && formElement && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
                    this.isActive = true;
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
                }
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                this.isPopupOpen = true;
                let actionList = this.actionCompleteData && this.actionCompleteData.ulElement &&
                    this.actionCompleteData.ulElement.querySelector('li');
                let ulElement = this.list.querySelector('ul li');
                if (this.isFiltering() && this.itemTemplate && (this.element.tagName === this.getNgDirective()) &&
                    (actionList && ulElement && actionList.textContent !== ulElement.textContent)) {
                    this.cloneElements();
                }
                if (this.isFilterLayout()) {
                    removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    this.isFilterFocus = true;
                    this.filterInput.focus();
                    if (this.inputWrapper.clearButton) {
                        addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                this.activeStateChange();
            },
            targetExitViewport: () => {
                if (!Browser.isDevice) {
                    this.hidePopup();
                }
            }
        });
    }
    isEmptyList() {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    }
    getFocusElement() {
        // combo-box used this method
    }
    isFilterLayout() {
        return this.getModuleName() === 'dropdownlist' && this.allowFiltering;
    }
    scrollHandler() {
        if (Browser.isDevice && ((this.getModuleName() === 'dropdownlist' &&
            !this.isFilterLayout()) || (this.getModuleName() === 'combobox' && !this.allowFiltering && this.isDropDownClick))) {
            this.hidePopup();
        }
    }
    setSearchBoxPosition() {
        let searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        let clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }
    setPopupPosition(border) {
        let offsetValue;
        let popupOffset = border;
        let selectedLI = this.list.querySelector('.' + dropDownListClasses.focus) || this.selectedLI;
        let firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
        let lastItem = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        let liHeight = firstItem.getBoundingClientRect().height;
        let listHeight = this.list.offsetHeight / 2;
        let height = isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        let lastItemOffsetValue = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !isNullOrUndefined(selectedLI)) {
            let count = this.list.offsetHeight / liHeight;
            let paddingBottom = parseInt(getComputedStyle(this.list).paddingBottom, 10);
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
        let inputHeight = this.inputWrapper.container.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    }
    setWidth() {
        let width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
            (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
            let firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }
    scrollBottom(isInitial) {
        if (!isNullOrUndefined(this.selectedLI)) {
            let currentOffset = this.list.offsetHeight;
            let nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            let nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            let boxRange = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    }
    scrollTop() {
        if (!isNullOrUndefined(this.selectedLI)) {
            let nextOffset = this.selectedLI.offsetTop - this.list.scrollTop;
            let nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            nextOffset = this.fields.groupBy && !isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            let boxRange = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
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
    }
    isEditTextBox() {
        return false;
    }
    isFiltering() {
        return this.allowFiltering;
    }
    isPopupButton() {
        return true;
    }
    setScrollPosition(e) {
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
    }
    clearText() {
        this.filterInput.value = '';
        this.searchLists(null);
    }
    listScroll() {
        this.filterInput.blur();
    }
    setEleWidth(width) {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputWrapper.container.style.width = formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (width) : (formatUnit(width));
            }
        }
    }
    closePopup(delay) {
        this.isTyped = false;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.isActive = false;
        this.filterInputObj = null;
        this.isDropDownClick = false;
        this.preventAutoFill = false;
        let scrollableParentElements = this.popupObj.getScrollableParent(this.inputWrapper.container);
        for (let element of scrollableParentElements) {
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
        let animModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        let popupInstance = (isBlazor() && this.isServerRendered) ? null : this.popupObj;
        let eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
        this.trigger('close', eventArgs, (eventArgs) => {
            if (!isNullOrUndefined(this.popupObj) &&
                !isNullOrUndefined(this.popupObj.element.querySelector('.e-fixed-head'))) {
                let fixedHeader = this.popupObj.element.querySelector('.e-fixed-head');
                fixedHeader.parentNode.removeChild(fixedHeader);
                this.fixedHeaderElement = null;
            }
            if (!eventArgs.cancel) {
                if (this.getModuleName() === 'autocomplete' && !this.isServerBlazor) {
                    this.rippleFun();
                }
                if (this.isPopupOpen) {
                    this.popupObj.hide(new Animation(eventArgs.animation));
                }
                else {
                    this.destroyPopup();
                }
            }
        });
    }
    destroyPopup() {
        let popupHolderEle = select('#' + this.element.id + '_popup_holder', document);
        if (this.isServerBlazor && this.serverPopupEle && popupHolderEle) {
            popupHolderEle.appendChild(this.serverPopupEle);
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerClosePopup');
        }
        this.isPopupOpen = false;
        this.isFilterFocus = false;
        this.popupObj.destroy();
        detach(this.popupObj.element);
    }
    clickOnBackIcon() {
        this.hidePopup();
        this.focusIn();
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    // tslint:disable-next-line
    render() {
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
            this.initial = false;
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
            let updatedCssClassValues = this.cssClass;
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
            let id = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
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
                let selectElement = this.element;
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
            this.inputElement.onselect = (e) => { e.stopImmediatePropagation(); };
            this.inputElement.onchange = (e) => { e.stopImmediatePropagation(); };
            if (this.element.hasAttribute('autofocus')) {
                this.focusIn();
            }
            if (!isNullOrUndefined(this.text)) {
                this.inputElement.setAttribute('value', this.text);
            }
        }
        if (this.element.hasAttribute('data-val')) {
            this.element.setAttribute('data-val', 'false');
        }
        this.renderComplete();
    }
    ;
    setFooterTemplate(popupEle) {
        let compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            addClass([this.footer], dropDownListClasses.footer);
        }
        let footercheck = this.dropdownCompiler(this.footerTemplate);
        if (footercheck) {
            compiledString = compile(select(this.footerTemplate, document).innerHTML.trim());
        }
        else {
            compiledString = compile(this.footerTemplate);
        }
        // tslint:disable-next-line
        let footerCompTemp = compiledString({}, this, 'footerTemplate', this.footerTemplateId, this.isStringTemplate, null, this.footer);
        if (footerCompTemp && footerCompTemp.length > 0) {
            for (let i = 0; i < footerCompTemp.length; i++) {
                this.footer.appendChild(footerCompTemp[i]);
            }
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], popupEle);
    }
    setHeaderTemplate(popupEle) {
        let compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            addClass([this.header], dropDownListClasses.header);
        }
        let headercheck = this.dropdownCompiler(this.headerTemplate);
        if (headercheck) {
            compiledString = compile(select(this.headerTemplate, document).innerHTML.trim());
        }
        else {
            compiledString = compile(this.headerTemplate);
        }
        // tslint:disable-next-line
        let headerCompTemp = compiledString({}, this, 'headerTemplate', this.headerTemplateId, this.isStringTemplate, null, this.header);
        if (headerCompTemp && headerCompTemp.length) {
            for (let i = 0; i < headerCompTemp.length; i++) {
                this.header.appendChild(headerCompTemp[i]);
            }
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        let contentEle = popupEle.querySelector('div.e-content');
        popupEle.insertBefore(this.header, contentEle);
    }
    setOldText(text) {
        this.text = text;
    }
    setOldValue(value) {
        this.value = value;
    }
    refreshPopup() {
        if (!isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj.element) &&
            ((this.allowFiltering && !(Browser.isDevice && this.isFilterLayout())) || this.getModuleName() === 'autocomplete')) {
            removeClass([this.popupObj.element], 'e-popup-close');
            this.popupObj.refreshPosition(this.inputWrapper.container);
            this.popupObj.resolveCollision();
        }
    }
    checkData(newProp) {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering &&
            !(this.isListSearched && (newProp.dataSource instanceof DataManager))) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
        this.isListSearched = false;
        let isChangeValue = Object.keys(newProp).indexOf('value') !== -1 && isNullOrUndefined(newProp.value);
        let isChangeText = Object.keys(newProp).indexOf('text') !== -1 && isNullOrUndefined(newProp.text);
        if (this.getModuleName() !== 'autocomplete' && this.allowFiltering && (isChangeValue || isChangeText)) {
            this.itemData = null;
        }
    }
    updateDataSource(props) {
        if (this.inputElement.value !== '' || (!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.clearAll(null, props);
        }
        if (!(!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0))) || !(props.dataSource === [])) {
            this.resetList(this.dataSource);
        }
        if (!this.isCustomFilter && !this.isFilterFocus && document.activeElement !== this.filterInput) {
            this.checkCustomValue();
        }
    }
    checkCustomValue() {
        this.itemData = this.getDataByValue(this.value);
        let dataItem = this.getItemData();
        this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
    }
    updateInputFields() {
        if (this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.getModuleName() === 'dropdownlist') {
            if (!this.isServerBlazor) {
                this.checkData(newProp);
                this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
            }
        }
        for (let prop of Object.keys(newProp)) {
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
                        let li = this.getElementByText(newProp.text);
                        if (!this.checkValidLi(li)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.text, oldProp.text, 'text');
                            }
                            else if (!this.isServerBlazor) {
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
                        let item = this.getElementByValue(newProp.value);
                        if (!this.checkValidLi(item)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.value, oldProp.value, 'value');
                            }
                            else if (!this.isServerBlazor) {
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
                    if (!this.initRemoteRender && this.liCollections) {
                        let element = this.liCollections[newProp.index];
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.index, oldProp.index, 'index');
                            }
                            else if (!this.isServerBlazor) {
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
                    let ddlProps;
                    ddlProps = this.getPropObject(prop, newProp, oldProp);
                    super.onPropertyChanged(ddlProps.newProperty, ddlProps.oldProperty);
                    break;
            }
        }
    }
    checkValidLi(element) {
        if (this.isValidLI(element)) {
            this.setSelection(element, null);
            return true;
        }
        return false;
    }
    setSelectionData(newProp, oldProp, prop) {
        let li;
        this.updateListValues = () => {
            if (prop === 'text') {
                li = this.getElementByText(newProp);
                if (!this.checkValidLi(li)) {
                    this.setOldText(oldProp);
                }
            }
            else if (prop === 'value') {
                li = this.getElementByValue(newProp);
                if (!this.checkValidLi(li)) {
                    this.setOldValue(oldProp);
                }
            }
            else if (prop === 'index') {
                li = this.liCollections[newProp];
                if (!this.checkValidLi(li)) {
                    this.index = oldProp;
                }
            }
        };
    }
    setCssClass(newClass, oldClass) {
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
    }
    /**
     * Return the module name.
     * @private
     */
    getModuleName() {
        return 'dropdownlist';
    }
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     */
    showPopup() {
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
        else if (isNullOrUndefined(this.list) || !isUndefined(this.list) && (this.list.classList.contains(dropDownBaseClasses.noData) ||
            this.list.querySelectorAll('.' + dropDownBaseClasses.li).length <= 0)) {
            this.renderList();
        }
        else if (this.isFiltering() && this.isServerBlazor) {
            this.renderList();
        }
        if (!this.isServerBlazor) {
            this.invokeRenderPopup();
        }
        let popupHolderEle = !this.isFiltering() || select('#' + this.element.id + '_popup_holder', document);
        let isDropdownComp = this.getModuleName() === 'dropdownlist' || !this.isFiltering();
        if (this.isServerBlazor && popupHolderEle && !isNullOrUndefined(this.list) && isDropdownComp) {
            this.invokeRenderPopup();
        }
    }
    invokeRenderPopup() {
        if (Browser.isDevice && this.isFilterLayout()) {
            let proxy = this;
            window.onpopstate = () => {
                proxy.hidePopup();
            };
            history.pushState({}, '');
        }
        if (!isNullOrUndefined(this.list.children[0]) || this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderPopup();
        }
        attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
    }
    clientRenderPopup(data, popupEle) {
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
            if (!this.isPopupOpen) {
                this.serverBlazorUpdateSelection();
            }
            this.unWireListEvents();
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
    }
    renderHightSearch() {
        // update high light search 
    }
    updateclientItemData(data) {
        this.listData = data;
    }
    initValueItemData(selectData) {
        this.itemData = selectData;
        this.previousValue = this.value;
        this.initial = false;
    }
    serverUpdateListElement(data, popupEle) {
        this.listData = data;
        if (this.ulElement) {
            this.liCollections = this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li);
        }
    }
    /**
     * Hides the popup if it is in an open state.
     * @returns void.
     */
    hidePopup(e) {
        let isHeader = (this.headerTemplate) ? true : false;
        let isFooter = (this.headerTemplate) ? true : false;
        this.DropDownBaseresetBlazorTemplates(false, false, false, false, false, isHeader, isFooter);
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.isEscapeKey = false;
            if (!isNullOrUndefined(this.index)) {
                let element = this.findListElement(this.ulElement, 'li', 'data-value', this.value);
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
        let dataItem = this.getItemData();
        let isSelectVal = this.isServerBlazor ? !isNullOrUndefined(this.value) : !isNullOrUndefined(this.selectedLI);
        if (this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            isSelectVal && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clearAll(e);
        }
    }
    /**
     * Sets the focus on the component for interaction.
     * @returns void.
     */
    focusIn(e) {
        if (!this.enabled) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable)) {
            return;
        }
        let isFocused = false;
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
    }
    /**
     * Moves the focus from the component if the component is already focused.
     * @returns void.
     */
    focusOut(e) {
        if (!this.enabled) {
            return;
        }
        this.isTyped = true;
        this.hidePopup(e);
        this.targetElement().blur();
        removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    destroy() {
        this.isActive = false;
        // tslint:disable-next-line
        if (this.isReact) {
            this.clearTemplate();
        }
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
            let attrArray = ['readonly', 'aria-disabled', 'aria-placeholder',
                'placeholder', 'aria-owns', 'aria-labelledby', 'aria-haspopup', 'aria-expanded',
                'aria-activedescendant', 'autocomplete', 'aria-readonly', 'autocorrect',
                'autocapitalize', 'spellcheck', 'aria-autocomplete', 'aria-live', 'aria-describedby', 'aria-label'];
            for (let i = 0; i < attrArray.length; i++) {
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
            super.destroy();
        }
    }
    ;
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    getItems() {
        if (!this.list) {
            if (this.dataSource instanceof DataManager) {
                this.initRemoteRender = true;
            }
            this.renderList();
        }
        return this.ulElement ? super.getItems() : [];
    }
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     */
    getDataByValue(value) {
        return super.getDataByValue(value);
    }
    /**
     * Allows you to clear the selected values from the component.
     * @returns void.
     */
    clear() {
        this.value = null;
    }
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

/**
 * export all modules from current location
 */

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const RTL = 'e-rtl';
const DROPDOWNTREE = 'e-ddt';
const HIDDENELEMENT = 'e-ddt-hidden';
const DROPDOWNICON = 'e-input-group-icon e-ddt-icon e-icons';
const SHOW_CHIP = 'e-show-chip';
const SHOW_CLEAR = 'e-show-clear';
const SHOW_DD_ICON = 'e-show-dd-icon';
const CHIP_INPUT = 'e-chip-input';
const INPUTFOCUS = 'e-input-focus';
const INPUTGROUP = 'e-input-group';
const ICONANIMATION = 'e-icon-anim';
const CLOSEICON_CLASS = 'e-clear-icon e-icons';
const CHIP_WRAPPER = 'e-chips-wrapper';
const CHIP_COLLECTION = 'e-chips-collection';
const CHIP = 'e-chips';
const CHIP_CONTENT = 'e-chipcontent';
const CHIP_CLOSE = 'e-chips-close';
const HIDEICON = 'e-icon-hide';
const POPUP_CLASS = 'e-ddt e-popup';
const PARENTITEM = 'e-list-parent';
const CONTENT = 'e-popup-content';
const DROPDOWN = 'e-dropdown';
const DISABLED = 'e-disabled';
const ICONS = 'e-icons';
const CHECKALLPARENT = 'e-selectall-parent';
const CHECKALLHIDE = 'e-hide-selectall';
const BIGGER = 'e-bigger';
const SMALL = 'e-small';
const ALLTEXT = 'e-all-text';
const CHECKBOXFRAME = 'e-frame';
const CHECK = 'e-check';
const CHECKBOXWRAP = 'e-checkbox-wrapper';
const FILTERWRAP = 'e-filter-wrap';
const DDTICON = 'e-ddt-icon';
const FOOTER = 'e-ddt-footer';
const HEADER = 'e-ddt-header';
const NODATACONTAINER = 'e-ddt-nodata';
const NODATA = 'e-no-data';
const HEADERTEMPLATE = 'HeaderTemplate';
const FOOTERTEMPLATE = 'FooterTemplate';
const NORECORDSTEMPLATE = 'NoRecordsTemplate';
const ACTIONFAILURETEMPLATE = 'ActionFailureTemplate';
const REMAIN_WRAPPER = 'e-remain';
const OVERFLOW_VIEW = 'e-overflow';
const SHOW_TEXT = 'e-show-text';
const TOTAL_COUNT_WRAPPER = 'e-total-count';
const REMAIN_COUNT = 'e-wrap-count';
class Fields extends ChildProperty {
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
class TreeSettings extends ChildProperty {
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
let DropDownTree = class DropDownTree extends Component {
    constructor(options, element) {
        super(options, element);
        this.filterTimer = null;
        this.isFilteredData = false;
        this.isFilterRestore = false;
        this.selectedData = [];
        this.filterDelayTime = 300;
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    getLocaleName() {
        return 'drop-down-tree';
    }
    /**
     * Initialize the event handler.
     * @private
     */
    preRender() {
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
        this.clearIconWidth = 0;
        this.isBlazorPlatForm = isBlazor();
        this.headerTemplateId = `${this.element.id}${HEADERTEMPLATE}`;
        this.footerTemplateId = `${this.element.id}${FOOTERTEMPLATE}`;
        this.actionFailureTemplateId = `${this.element.id}${ACTIONFAILURETEMPLATE}`;
        this.noRecordsTemplateId = `${this.element.id}${NORECORDSTEMPLATE}`;
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
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
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
        if (this.allowMultiSelection || this.showCheckBox) {
            if (this.mode !== 'Delimiter') {
                this.createChip();
            }
            if (!this.wrapText) {
                this.overFlowWrapper = this.createElement('span', { className: OVERFLOW_VIEW + ' ' + HIDEICON });
                this.inputWrapper.insertBefore(this.overFlowWrapper, this.hiddenElement);
                if (this.mode !== 'Box') {
                    addClass([this.overFlowWrapper], SHOW_TEXT);
                }
            }
        }
        if (!this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
            if (!this.wrapText) {
                this.updateView();
            }
        }
        this.wireEvents();
        let firstUl = select('.' + PARENTITEM, this.treeObj.element);
        if (firstUl && firstUl.getAttribute('aria-multiselectable')) {
            firstUl.removeAttribute('aria-multiselectable');
        }
        this.oldValue = this.value;
        this.isInitialized = true;
        this.hasTemplate = this.itemTemplate || this.headerTemplate || this.footerTemplate || this.actionFailureTemplate
            || this.noRecordsTemplate;
        this.renderComplete();
    }
    ensureAutoCheck() {
        if (this.allowFiltering && this.treeSettings.autoCheck) {
            this.setProperties({ treeSettings: { autoCheck: false } }, true);
        }
    }
    hideCheckAll(flag) {
        let checkAllEle = !isNullOrUndefined(this.popupEle) ? this.popupEle.querySelector('.' + CHECKALLPARENT) : null;
        if (!isNullOrUndefined(checkAllEle)) {
            if (flag && !checkAllEle.classList.contains(CHECKALLHIDE)) {
                addClass([checkAllEle], CHECKALLHIDE);
            }
            else if (!flag && checkAllEle.classList.contains(CHECKALLHIDE)) {
                removeClass([checkAllEle], CHECKALLHIDE);
            }
        }
    }
    renderFilter() {
        this.filterContainer = this.createElement('div', {
            id: this.element.id + '_filter_wrap',
            className: FILTERWRAP
        });
        let filterInput = this.createElement('input', {
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
    }
    filterChangeHandler(args) {
        if (!isNullOrUndefined(args.value)) {
            window.clearTimeout(this.filterTimer);
            this.filterTimer = window.setTimeout(() => { this.filterHandler(args.value, args.event); }, this.filterDelayTime);
        }
    }
    filterHandler(value, event) {
        if (!this.isFilteredData) {
            this.treeData = this.treeObj.getTreeData();
        }
        let filterFields = this.cloneFields(this.fields);
        let args = {
            cancel: false,
            preventDefaultAction: false,
            event: event,
            text: value,
            fields: filterFields
        };
        this.trigger('filtering', args, (args) => {
            if (!args.cancel) {
                let flag = false;
                let fields;
                this.isFilteredData = true;
                if (value === '') {
                    this.isFilteredData = false;
                    this.isFilterRestore = true;
                    fields = this.cloneFields(this.fields);
                }
                else if (args.preventDefaultAction) {
                    fields = args.fields;
                }
                else {
                    if (this.treeDataType === 1) {
                        fields = this.selfReferencefilter(value, args.fields);
                    }
                    else {
                        if (this.fields.dataSource instanceof DataManager) {
                            flag = true;
                        }
                        else {
                            fields = this.nestedFilter(value, args.fields);
                        }
                    }
                }
                this.hideCheckAll(this.isFilteredData);
                if (flag) {
                    return;
                }
                this.treeObj.fields = this.getTreeFields(fields);
                this.treeObj.dataBind();
            }
        });
    }
    nestedFilter(value, filteredFields) {
        let matchedDataSource = [];
        for (let i = 0; i < this.treeData.length; i++) {
            let filteredChild = this.nestedChildFilter(value, this.treeData[i]);
            if (!isNullOrUndefined(filteredChild)) {
                matchedDataSource.push(filteredChild);
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    }
    nestedChildFilter(value, node) {
        let children = node[this.fields.child];
        if (isNullOrUndefined(children)) {
            return (this.isMatchedNode(value, node)) ? node : null;
        }
        else {
            let matchedChildren = [];
            for (let i = 0; i < children.length; i++) {
                let filteredChild = this.nestedChildFilter(value, children[i]);
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
    }
    selfReferencefilter(value, filteredFields) {
        let matchedData = [];
        let matchedDataSource = [];
        for (let i = 0; i < this.treeData.length; i++) {
            if (this.isMatchedNode(value, this.treeData[i])) {
                matchedData.push(this.treeData[i]);
            }
        }
        for (let i = 0; i < matchedData.length; i++) {
            if (matchedDataSource.indexOf(matchedData[i]) === -1) {
                matchedDataSource.push(matchedData[i]);
                let parentId = matchedData[i][this.fields.parentValue];
                while (!isNullOrUndefined(parentId)) {
                    let parent = null;
                    for (let j = 0; j < this.treeData.length; j++) {
                        let value = this.treeData[j][this.fields.value];
                        if (!isNullOrUndefined(value) && (value === parentId)) {
                            parent = this.treeData[j];
                            break;
                        }
                    }
                    if (!isNullOrUndefined(parent) && (matchedDataSource.indexOf(parent) === -1)) {
                        matchedDataSource.push(parent);
                        parentId = parent[this.fields.parentValue];
                    }
                    else {
                        break;
                    }
                }
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    }
    isMatchedNode(value, node) {
        let checkValue = node[this.fields.text];
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
    }
    /* To wire events for the dropdown tree */
    wireEvents() {
        EventHandler.add(this.inputWrapper, 'mouseup', this.dropDownClick, this);
        EventHandler.add(this.inputWrapper, 'focus', this.focusIn, this);
        EventHandler.add(this.inputWrapper, 'blur', this.focusOut, this);
        EventHandler.add(this.inputWrapper, 'mousemove', this.mouseIn, this);
        EventHandler.add(this.inputWrapper, 'mouseout', this.onMouseLeave, this);
        EventHandler.add(this.overAllClear, 'mousedown', this.clearAll, this);
        EventHandler.add(window, 'resize', this.windowResize, this);
        let formElement = closest(this.inputWrapper, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        this.keyboardModule = new KeyboardEvents(this.inputWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    wireTreeEvents() {
        this.keyboardModule = new KeyboardEvents(this.tree, {
            keyAction: this.treeAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    wireCheckAllWrapperEvents() {
        this.keyboardModule = new KeyboardEvents(this.checkAllParent, {
            keyAction: this.checkAllAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    /* To unwire events for the dropdown tree */
    unWireEvents() {
        EventHandler.remove(this.inputWrapper, 'mouseup', this.dropDownClick);
        EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        EventHandler.remove(this.inputWrapper, 'blur', this.focusOut);
        EventHandler.remove(this.inputWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.inputWrapper, 'mouseout', this.onMouseLeave);
        EventHandler.remove(this.overAllClear, 'mousedown', this.clearAll);
        EventHandler.remove(window, 'resize', this.windowResize);
        let formElement = closest(this.inputWrapper, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
    }
    /* Trigger when the dropdown is clicked */
    dropDownClick(e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
            return;
        }
        if (!this.wrapText && e.target.classList.contains(CHIP_CLOSE)) {
            this.removeChip(e);
        }
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        else {
            this.focusIn(e);
            this.renderPopup();
        }
        this.showOverAllClear();
    }
    mouseIn() {
        if (this.enabled || !this.readonly) {
            this.showOverAllClear();
        }
    }
    onMouseLeave() {
        if (!this.inputFocus) {
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
    }
    getDirective() {
        return 'EJS-DROPDOWNTREE';
    }
    focusOut(e) {
        if (!this.enabled || this.readonly || !this.inputFocus) {
            return;
        }
        if ((Browser.isIE || Browser.info.name === 'edge') && (e.target === this.inputWrapper)) {
            return;
        }
        let target = e.relatedTarget;
        if ((target !== this.inputEle) && (isNullOrUndefined(target)) && (e.target !== this.inputWrapper || !this.isPopupOpen)) {
            this.onFocusOut(e);
        }
    }
    onFocusOut(event) {
        this.inputFocus = false;
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
        }
        if (this.showClearButton) {
            this.clearIconWidth = select('.e-clear-icon', this.inputWrapper).offsetWidth;
            addClass([this.overAllClear], HIDEICON);
            removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        removeClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox)) {
            let isValue = this.value ? (this.value.length ? true : false) : false;
            if (this.mode !== 'Delimiter') {
                if (this.chipWrapper && (this.mode === 'Default')) {
                    addClass([this.chipWrapper], HIDEICON);
                    removeClass([this.inputWrapper], SHOW_CHIP);
                    removeClass([this.inputEle], CHIP_INPUT);
                }
            }
            if (!this.wrapText && isValue) {
                this.updateView();
            }
        }
        if (this.changeOnBlur) {
            this.triggerChangeEvent(event);
        }
        this.removeValue = false;
        this.oldValue = this.value;
        this.trigger('blur');
    }
    updateView() {
        if (!this.showCheckBox && !this.allowMultiSelection) {
            return;
        }
        if (this.mode !== 'Box') {
            addClass([this.inputWrapper, this.overFlowWrapper], SHOW_TEXT);
        }
        else {
            addClass([this.inputWrapper], SHOW_CHIP);
        }
        if (this.value && this.value.length !== 0) {
            if (this.inputWrapper.contains(this.chipWrapper)) {
                addClass([this.chipWrapper], HIDEICON);
            }
            addClass([this.inputEle], CHIP_INPUT);
            this.updateOverFlowView();
            this.ensurePlaceHolder();
        }
    }
    triggerChangeEvent(event) {
        let isEqual = this.ddtCompareValues(this.oldValue, this.value);
        if ((!isEqual || this.isChipDelete) && !this.removeValue) {
            let eventArgs = {
                e: event,
                oldValue: this.oldValue,
                value: this.value,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
            this.oldValue = this.value;
        }
    }
    ddtCompareValues(oldValue, newValue) {
        if (oldValue === null || newValue === null) {
            let isValid = oldValue === null ? ((newValue === oldValue) ? true : false) :
                (oldValue.length === 0 ? (newValue === oldValue) : false);
            return isValid;
        }
        else if (oldValue.length !== newValue.length) {
            return false;
        }
        for (let i = 0; i < oldValue.length; i++) {
            if (oldValue[i] !== newValue[i]) {
                return false;
            }
        }
        return true;
    }
    focusIn(e) {
        if (!this.enabled || this.readonly || this.inputFocus) {
            return;
        }
        this.showOverAllClear();
        this.inputFocus = true;
        addClass([this.inputWrapper], [INPUTFOCUS]);
        if (this.allowMultiSelection || this.showCheckBox) {
            if (this.mode !== 'Delimiter' && this.inputFocus) {
                if (this.chipWrapper && (this.value && this.value.length !== 0)) {
                    removeClass([this.chipWrapper], HIDEICON);
                    addClass([this.inputEle], CHIP_INPUT);
                }
                addClass([this.inputWrapper], SHOW_CHIP);
                if (this.popupObj) {
                    this.popupObj.refreshPosition();
                }
            }
            if (!this.wrapText) {
                if (this.inputWrapper.contains(this.overFlowWrapper)) {
                    addClass([this.overFlowWrapper], HIDEICON);
                }
                if (this.mode === 'Delimiter') {
                    removeClass([this.inputWrapper], SHOW_CHIP);
                    removeClass([this.inputEle], CHIP_INPUT);
                }
                else {
                    addClass([this.inputWrapper], SHOW_CHIP);
                }
                removeClass([this.inputWrapper], SHOW_TEXT);
                this.ensurePlaceHolder();
            }
        }
        let args = { isInteracted: e ? true : false, event: e };
        this.trigger('focus', args);
    }
    treeAction(e) {
        let eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                        this.inputWrapper.focus();
                        e.preventDefault();
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'tab':
                    case 'shiftTab':
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        if (!this.showCheckBox) {
                            this.isValueChange = true;
                            this.keyEventArgs = e;
                        }
                        break;
                    case 'space':
                        this.isValueChange = true;
                        this.keyEventArgs = e;
                        break;
                    case 'ctrlA':
                        if (this.allowMultiSelection) {
                            this.selectAll(true);
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
    }
    keyActionHandler(e) {
        let eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                    case 'shiftTab':
                    case 'tab':
                        if (this.isPopupOpen) {
                            this.hidePopup();
                        }
                        break;
                    case 'altDown':
                        if (!this.isPopupOpen) {
                            this.showPopup();
                            e.preventDefault();
                        }
                        break;
                    case 'moveDown':
                        if (this.showSelectAll && this.showCheckBox) {
                            this.checkAllParent.focus();
                        }
                        break;
                }
            }
        });
    }
    checkAllAction(e) {
        let eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        this.clickHandler(e);
                        break;
                    case 'moveDown':
                        this.treeObj.element.focus();
                }
            }
        });
    }
    windowResize() {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.setWidth() });
            this.popupObj.refreshPosition();
        }
    }
    resetValueHandler(e) {
        let formElement = closest(this.inputWrapper, 'form');
        if (formElement && e.target === formElement) {
            this.isDynamicChange = true;
            this.setProperties({ value: null }, true);
            this.resetValue(true);
            this.isDynamicChange = false;
        }
    }
    getAriaAttributes() {
        let disable = this.enabled ? 'false' : 'true';
        return {
            'aria-disabled': disable,
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-labelledby': this.hiddenElement.id
        };
    }
    updateOverFlowView() {
        this.overFlowWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        removeClass([this.overFlowWrapper], HIDEICON);
        if (this.value && this.value.length) {
            let data = '';
            let overAllContainer;
            let temp;
            let tempData;
            let tempIndex = 1;
            let wrapperleng;
            let remaining;
            let downIconWidth = 0;
            this.overFlowWrapper.innerHTML = '';
            let l10nLocale = { overflowCountTemplate: '+${count} more..', totalCountTemplate: '${count} selected' };
            this.l10n = new L10n(this.getLocaleName(), l10nLocale, this.locale);
            let remainContent = this.l10n.getConstant('overflowCountTemplate');
            let remainElement = this.createElement('span', { className: REMAIN_WRAPPER });
            let compiledString = compile(remainContent);
            let totalCompiledString = compile(this.l10n.getConstant('totalCountTemplate'));
            remainElement.appendChild(compiledString({ 'count': this.value.length }, this, 'overflowCountTemplate', null, !this.isStringTemplate)[0]);
            this.overFlowWrapper.appendChild(remainElement);
            let remainSize = remainElement.offsetWidth;
            remove(remainElement);
            if (this.showDropDownIcon) {
                downIconWidth = select('.' + DDTICON, this.inputWrapper).offsetWidth;
            }
            if (!isNullOrUndefined(this.value)) {
                if (this.mode !== 'Box') {
                    for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
                        data += (index === 0) ? '' : this.delimiterChar + ' ';
                        temp = this.getOverflowVal(index);
                        data += temp;
                        temp = this.overFlowWrapper.innerHTML;
                        this.overFlowWrapper.innerHTML = data;
                        wrapperleng = this.overFlowWrapper.offsetWidth;
                        overAllContainer = this.inputWrapper.offsetWidth;
                        if ((wrapperleng + downIconWidth + this.clearIconWidth) > overAllContainer) {
                            if (tempData !== undefined && tempData !== '') {
                                temp = tempData;
                                index = tempIndex + 1;
                            }
                            this.overFlowWrapper.innerHTML = temp;
                            remaining = this.value.length - index;
                            wrapperleng = this.overFlowWrapper.offsetWidth;
                            while (((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) >= overAllContainer)
                                && wrapperleng !== 0 && this.overFlowWrapper.innerHTML !== '') {
                                let textArr = this.overFlowWrapper.innerHTML.split(this.delimiterChar);
                                textArr.pop();
                                this.overFlowWrapper.innerHTML = textArr.join(this.delimiterChar);
                                remaining++;
                                wrapperleng = this.overFlowWrapper.offsetWidth;
                            }
                            break;
                        }
                        else if ((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) <= overAllContainer) {
                            tempData = data;
                            tempIndex = index;
                        }
                        else if (index === 0) {
                            tempData = '';
                            tempIndex = -1;
                        }
                    }
                }
                else {
                    addClass([this.chipWrapper], HIDEICON);
                    let ele = this.chipWrapper.cloneNode(true);
                    let chips = selectAll('.' + CHIP, ele);
                    for (let i = 0; i < chips.length; i++) {
                        temp = this.overFlowWrapper.innerHTML;
                        this.overFlowWrapper.appendChild(chips[i]);
                        data = this.overFlowWrapper.innerHTML;
                        wrapperleng = this.overFlowWrapper.offsetWidth;
                        overAllContainer = this.inputWrapper.offsetWidth;
                        if ((wrapperleng + downIconWidth + this.clearIconWidth) > overAllContainer) {
                            if (tempData !== undefined && tempData !== '') {
                                temp = tempData;
                                i = tempIndex + 1;
                            }
                            this.overFlowWrapper.innerHTML = temp;
                            remaining = this.value.length - i;
                            wrapperleng = this.overFlowWrapper.offsetWidth;
                            while (((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) >= overAllContainer)
                                && wrapperleng !== 0 && this.overFlowWrapper.innerHTML !== '') {
                                this.overFlowWrapper.removeChild(this.overFlowWrapper.lastChild);
                                remaining++;
                                wrapperleng = this.overFlowWrapper.offsetWidth;
                            }
                            break;
                        }
                        else if ((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) <= overAllContainer) {
                            tempData = data;
                            tempIndex = i;
                        }
                        else if (i === 0) {
                            tempData = '';
                            tempIndex = -1;
                        }
                    }
                }
            }
            if (remaining > 0) {
                let totalWidth = overAllContainer - (downIconWidth + this.clearIconWidth);
                this.overFlowWrapper.appendChild(this.updateRemainTemplate(remainElement, remaining, compiledString, totalCompiledString, totalWidth));
            }
            if (this.mode === 'Box' && !this.overFlowWrapper.classList.contains(TOTAL_COUNT_WRAPPER)) {
                addClass([remainElement], REMAIN_COUNT);
            }
        }
        else {
            this.overFlowWrapper.innerHTML = '';
            addClass([this.overFlowWrapper], HIDEICON);
        }
        this.updateDelimMode();
    }
    updateRemainTemplate(remainElement, remaining, compiledString, totalCompiledString, totalWidth) {
        if (this.overFlowWrapper.firstChild && this.overFlowWrapper.firstChild.nodeType === 3 &&
            this.overFlowWrapper.firstChild.nodeValue === '') {
            this.overFlowWrapper.removeChild(this.overFlowWrapper.firstChild);
        }
        remainElement.innerHTML = '';
        remainElement.appendChild((this.overFlowWrapper.firstChild && (this.overFlowWrapper.firstChild.nodeType === 3 || this.mode === 'Box')) ?
            compiledString({ 'count': remaining }, this, 'overflowCountTemplate', null, !this.isStringTemplate)[0] :
            totalCompiledString({ 'count': remaining }, this, 'totalCountTemplate', null, !this.isStringTemplate)[0]);
        if (this.overFlowWrapper.firstChild && (this.overFlowWrapper.firstChild.nodeType === 3 || this.mode === 'Box')) {
            removeClass([this.overFlowWrapper], TOTAL_COUNT_WRAPPER);
        }
        else {
            addClass([this.overFlowWrapper], TOTAL_COUNT_WRAPPER);
            removeClass([this.overFlowWrapper], REMAIN_COUNT);
        }
        return remainElement;
    }
    getOverflowVal(index) {
        let temp;
        let selectedData = this.getSelectedData(this.value[index]);
        temp = getValue(this.treeSettings.loadOnDemand ? this.fields.text : 'text', selectedData);
        return temp;
    }
    updateDelimMode() {
        if (this.mode !== 'Box') {
            if (select('.' + REMAIN_WRAPPER, this.overFlowWrapper) && !this.overFlowWrapper.classList.contains(TOTAL_COUNT_WRAPPER)) {
                addClass([this.overFlowWrapper], REMAIN_COUNT);
                addClass([this.overFlowWrapper], SHOW_TEXT);
            }
            else {
                this.overFlowWrapper.classList.remove(REMAIN_COUNT);
                removeClass([this.overFlowWrapper], REMAIN_COUNT);
            }
        }
        else if (select('.' + REMAIN_WRAPPER, this.overFlowWrapper)) {
            this.overFlowWrapper.classList.remove(REMAIN_COUNT);
        }
    }
    createHiddenElement() {
        if (this.allowMultiSelection || this.showCheckBox) {
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'class': HIDDENELEMENT, 'tabindex': '-1', 'multiple': '' }
            });
        }
        else {
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': HIDDENELEMENT }
            });
        }
        prepend([this.hiddenElement], this.inputWrapper);
        this.validationAttribute();
    }
    createClearIcon() {
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS
        });
        addClass([this.overAllClear], HIDEICON);
        removeClass([this.inputWrapper], SHOW_CLEAR);
        if (this.showClearButton) {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    }
    validationAttribute() {
        let name = this.inputEle.getAttribute('name') ? this.inputEle.getAttribute('name') : this.inputEle.getAttribute('id');
        this.hiddenElement.setAttribute('name', name);
        this.inputEle.removeAttribute('name');
        let attributes$$1 = ['required', 'aria-required', 'form'];
        for (let i = 0; i < attributes$$1.length; i++) {
            let attr = this.inputEle.getAttribute(attributes$$1[i]);
            if (attr) {
                this.hiddenElement.setAttribute(attributes$$1[i], attr);
                this.inputEle.removeAttribute(attributes$$1[i]);
            }
        }
    }
    createChip() {
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
            let isValid = this.getValidMode();
            if (isValid && this.value !== null) {
                addClass([this.inputEle], CHIP_INPUT);
            }
            else if (this.value === null) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    }
    getValidMode() {
        if (this.allowMultiSelection || this.showCheckBox) {
            return this.mode === 'Box' ? true : (this.mode === 'Default' && this.inputFocus) ? true : false;
        }
        else {
            return false;
        }
    }
    createSelectAllWrapper() {
        this.checkAllParent = this.createElement('div', {
            className: CHECKALLPARENT, attrs: { 'tabindex': '0' }
        });
        this.selectAllSpan = this.createElement('span', {
            className: ALLTEXT
        });
        this.selectAllSpan.textContent = '';
        let ele = closest(this.element, '.' + BIGGER);
        let touchClass = isNullOrUndefined(ele) ? '' : SMALL;
        this.checkBoxElement = createCheckBox(this.createElement, true, { cssClass: touchClass });
        this.checkBoxElement.setAttribute('role', 'checkbox');
        this.checkAllParent.appendChild(this.checkBoxElement);
        this.checkAllParent.appendChild(this.selectAllSpan);
        this.setLocale();
        EventHandler.add(this.checkAllParent, 'mouseup', this.clickHandler, this);
        this.wireCheckAllWrapperEvents();
    }
    clickHandler(e) {
        let target;
        if ((e.currentTarget && e.currentTarget.classList.contains(CHECKALLPARENT))) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.target;
        }
        this.checkWrapper = closest(target, '.' + CHECKBOXWRAP);
        if (!isNullOrUndefined(this.checkWrapper)) {
            let checkElement = select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.changeState(this.checkWrapper, checkElement.classList.contains(CHECK) ? 'uncheck' : 'check', e);
        }
        e.preventDefault();
    }
    changeState(wrapper, state, e) {
        let ariaState;
        let frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
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
    }
    setLocale(unSelect) {
        if (!this.selectAllSpan) {
            return;
        }
        if (this.selectAllText !== 'Select All' || this.unSelectAllText !== 'Unselect All') {
            let template = unSelect ? this.unSelectAllText : this.selectAllText;
            let compiledString;
            this.selectAllSpan.textContent = '';
            compiledString = compile(template);
            let templateName = unSelect ? 'unSelectAllText' : 'selectAllText';
            for (let item of compiledString({}, this, templateName, null, !this.isStringTemplate)) {
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            this.selectAllSpan.textContent = unSelect ? this.unSelectAllText : this.selectAllText;
        }
    }
    setAttributes() {
        this.element.removeAttribute('tabindex');
        let id = this.element.getAttribute('id');
        this.hiddenElement.id = id + '_hidden';
        this.inputWrapper.setAttribute('tabindex', '0');
        attributes(this.inputWrapper, this.getAriaAttributes());
    }
    setHTMLAttributes() {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
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
                    let defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    let validateAttr = ['name', 'required'];
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
    }
    updateDataAttribute() {
        let value = this.htmlAttributes;
        let invalidAttr = ['class', 'style', 'id', 'type'];
        let attr = {};
        for (let a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    }
    showOverAllClear() {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.overAllClear) {
            let isValue = this.value ? (this.value.length ? true : false) : false;
            if (isValue && this.showClearButton) {
                removeClass([this.overAllClear], HIDEICON);
                addClass([this.inputWrapper], SHOW_CLEAR);
            }
            else {
                addClass([this.overAllClear], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
    }
    setTreeValue() {
        if (this.value !== null && this.value.length !== 0) {
            let data;
            if (this.showCheckBox || this.allowMultiSelection) {
                for (let i = 0; i < this.value.length; i++) {
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
    }
    setTreeText() {
        if (this.value !== null && !this.isInitialized) {
            return;
        }
        if (this.text !== null) {
            let data;
            let valArr = [];
            if (this.showCheckBox || this.allowMultiSelection) {
                let textArr = this.text.split(this.delimiterChar);
                for (let i = 0; i < textArr.length; i++) {
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
    }
    setSelectedValue() {
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
    }
    setValidValue() {
        if (!this.showCheckBox && !this.allowMultiSelection) {
            Input.setValue(this.text, this.inputEle, this.floatLabelType);
            let id = this.value[0].toString();
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
    }
    getItems(givenText) {
        let data;
        if (this.treeDataType === 1) {
            for (let i = 0; i < this.treeItems.length; i++) {
                let text = getValue(this.fields.text, this.treeItems[i]);
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
    }
    getNestedItems(data, field, givenText) {
        let newData;
        for (let i = 0, objlen = data.length; i < objlen; i++) {
            let dataId = getValue(this.fields.text, data[i]);
            if (data[i] && dataId && dataId.toString() === givenText) {
                return data[i];
            }
            else if (typeof field.child === 'string' && !isNullOrUndefined(getValue(field.child, data[i]))) {
                let childData = getValue(field.child, data[i]);
                newData = this.getNestedItems(childData, this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', data[i]))) {
                let child = 'child';
                newData = this.getNestedItems(getValue(child, data[i]), this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
        }
        return newData;
    }
    getChildType(mapper) {
        return (typeof mapper.child === 'string' || isNullOrUndefined(mapper.child)) ? mapper : mapper.child;
    }
    /* To render the treeview */
    renderTree() {
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
    }
    /* To render the popup element */
    renderPopup() {
        if (this.isFilteredData) {
            this.filterObj.value = '';
            this.treeObj.fields = this.getTreeFields(this.fields);
            this.isFilterRestore = true;
            this.isFilteredData = false;
            this.hideCheckAll(false);
        }
        let isCancelled = false;
        let args = { cancel: false };
        this.trigger('beforeOpen', args, (args) => {
            if (!args.cancel) {
                addClass([this.inputWrapper], [ICONANIMATION]);
                if (this.isFirstRender) {
                    this.popupEle = this.createElement('div', {
                        id: this.element.id + '_popup', className: POPUP_CLASS + ' ' + (this.cssClass != null ? this.cssClass : '')
                    });
                    document.body.appendChild(this.popupEle);
                    this.createPopup(this.popupEle);
                }
                else {
                    this.popupEle = this.popupObj.element;
                }
            }
            else {
                isCancelled = true;
            }
            if (this.isFirstRender && !isCancelled) {
                prepend([this.popupDiv], this.popupEle);
                this.popupDiv.style.display = 'block';
                if (this.allowFiltering) {
                    this.renderFilter();
                }
                if (this.showCheckBox && this.showSelectAll && (!this.popupDiv.classList.contains(NODATA))) {
                    this.createSelectAllWrapper();
                    this.popupEle.insertBefore(this.checkAllParent, this.popupDiv);
                }
                if (this.headerTemplate) {
                    this.setHeaderTemplate();
                }
                if (this.footerTemplate) {
                    this.setFooterTemplate();
                }
                this.isFirstRender = false;
                // tslint:disable
                if (this.hasTemplate && this.portals) {
                    // tslint:disable
                    this.portals = this.portals.concat(this.treeObj.portals);
                    this.renderReactTemplates();
                }
            }
            if (!isCancelled) {
                attributes(this.inputWrapper, { 'aria-expanded': 'true' });
                this.popupObj.show(null, (this.zIndex === 1000) ? this.inputEle : null);
                this.popupEle.style.display = 'block';
                this.updatePopupHeight();
                this.popupObj.refreshPosition();
                if (!(this.showCheckBox && this.showSelectAll) && (!this.popupDiv.classList.contains(NODATA)
                    && this.treeItems.length > 0)) {
                    this.treeObj.element.focus();
                }
                if (this.checkSelectAll && this.checkBoxElement) {
                    let wrap = closest(this.checkBoxElement, '.' + CHECKBOXWRAP);
                    this.changeState(wrap, 'check');
                    this.checkSelectAll = false;
                }
                if (this.allowFiltering) {
                    removeClass([this.inputWrapper], [INPUTFOCUS]);
                    this.filterObj.element.focus();
                }
                let eventArgs = { popup: this.popupObj };
                this.trigger('open', eventArgs);
            }
        });
    }
    updatePopupHeight() {
        if (this.isFirstRender) {
            return;
        }
        let popupHeight = this.getHeight();
        this.popupEle.style.maxHeight = popupHeight;
        if (this.allowFiltering) {
            let height = Math.round(this.filterContainer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.headerTemplate) {
            let height = Math.round(this.header.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.showCheckBox && this.showSelectAll) {
            let height = Math.round(this.checkAllParent.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.footerTemplate) {
            let height = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        let border = parseInt(window.getComputedStyle(this.popupEle).borderTopWidth, 10);
        border = border + parseInt(window.getComputedStyle(this.popupEle).borderBottomWidth, 10);
        popupHeight = formatUnit(parseInt(popupHeight, 10) - border + 'px');
        this.popupDiv.style.maxHeight = popupHeight;
    }
    createPopup(element) {
        if (this.isFirstRender) {
            this.popupObj = new Popup(element, {
                width: this.setWidth(),
                targetType: 'relative',
                collision: { X: 'flip', Y: 'flip' },
                relateTo: this.inputWrapper,
                zIndex: this.zIndex,
                enableRtl: this.enableRtl,
                position: { X: 'left', Y: 'bottom' },
                close: () => {
                    this.isPopupOpen = false;
                },
                open: () => {
                    EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                    this.isPopupOpen = true;
                },
                targetExitViewport: () => {
                    if (!Browser.isDevice) {
                        this.hidePopup();
                    }
                }
            });
        }
    }
    /* To calculate the width when change via set model */
    setElementWidth(inputWidth) {
        let ddElement = this.inputWrapper;
        if (!isNullOrUndefined(inputWidth)) {
            if (typeof inputWidth === 'number') {
                ddElement.style.width = formatUnit(inputWidth);
            }
            else if (typeof inputWidth === 'string') {
                ddElement.style.width = (inputWidth.match(/px|%|em/)) ? (inputWidth) :
                    (formatUnit(inputWidth));
            }
        }
    }
    /* To calculate the width of the popup */
    setWidth() {
        let width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth = this.inputWrapper.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        else if (typeof this.popupWidth === 'string') {
            width = (this.popupWidth.match(/px|em/)) ? (this.popupWidth) : width;
        }
        return width;
    }
    /* To calculate the height of the popup */
    getHeight() {
        let height = formatUnit(this.popupHeight);
        if (height.indexOf('%') > -1) {
            // Will set the height of the popup according to the view port height
            let viewPortHeight = document.documentElement.clientHeight * parseFloat(height) / 100;
            height = viewPortHeight.toString() + 'px';
        }
        else if (typeof this.popupHeight === 'string') {
            height = (this.popupHeight.match(/px|em/)) ? (this.popupHeight) : height;
        }
        return height;
    }
    onDocumentClick(e) {
        let target = e.target;
        let isTree = closest(target, '.' + PARENTITEM);
        let isFilter = closest(target, '.' + FILTERWRAP);
        let isScroller = target.classList.contains(DROPDOWN) ? true :
            (matches(target, '.e-ddt .e-popup') || matches(target, '.e-ddt .e-treeview'));
        if ((this.isPopupOpen && (this.inputWrapper.contains(target) || isTree || isFilter || isScroller)) ||
            ((this.allowMultiSelection || this.showCheckBox) && (this.isPopupOpen && target.classList.contains(CHIP_CLOSE) ||
                (this.isPopupOpen && (target.classList.contains(CHECKALLPARENT) || target.classList.contains(ALLTEXT)
                    || target.classList.contains(CHECKBOXFRAME)))))) {
            this.isDocumentClick = false;
            e.preventDefault();
        }
        else if (!this.inputWrapper.contains(target) && this.inputFocus) {
            this.focusOut(e);
        }
    }
    onActionFailure(e) {
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        addClass([this.popupDiv], NODATA);
    }
    OnDataBound(args) {
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
            if (!this.wrapText) {
                this.updateView();
            }
            this.treeObj.element.focus();
        }
        let eventArgs = { data: args.data };
        this.trigger('dataBound', eventArgs);
        if (this.isFilteredData) {
            this.treeObj.expandAll();
        }
        if (this.isFilterRestore) {
            this.restoreFilterSelection();
            this.isFilterRestore = false;
        }
    }
    restoreFilterSelection() {
        if (this.showCheckBox) {
            this.treeObj.checkedNodes = this.value ? this.value : [];
        }
        else {
            this.treeObj.selectedNodes = this.value ? this.value : [];
        }
    }
    /* To set cssclass for the dropdowntree */
    setCssClass(newClass, oldClass) {
        let elements = this.popupObj ? [this.inputWrapper, this.popupObj.element] : [this.inputWrapper];
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(newClass) && newClass !== '') {
            addClass(elements, newClass.split(' '));
        }
    }
    setEnableRTL(state) {
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
    }
    /* To set enable property */
    setEnable() {
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
    }
    cloneFields(fields) {
        let clonedField = {
            dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
            child: this.cloneChildField(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes, query: fields.query,
            selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
        };
        return clonedField;
    }
    cloneChildField(fields) {
        if (typeof fields === 'string') {
            return fields;
        }
        else {
            let clonedField = {
                dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
                child: (fields.child ? this.cloneChildField(fields.child) : null), hasChildren: fields.hasChildren,
                expanded: fields.expanded, iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes,
                query: fields.query, selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
            };
            return clonedField;
        }
    }
    getTreeFields(fields) {
        let treeFields = {
            dataSource: fields.dataSource, id: fields.value, text: fields.text, parentID: fields.parentValue,
            child: this.getTreeChildren(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, isChecked: fields.selected,
            htmlAttributes: fields.htmlAttributes, query: fields.query, selected: fields.selected,
            tableName: fields.tableName, tooltip: fields.tooltip
        };
        return treeFields;
    }
    getTreeChildren(mapper) {
        if (typeof mapper === 'string') {
            return mapper;
        }
        else if (!isNullOrUndefined(mapper)) {
            let childFields;
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
    }
    getTreeDataType(ds, field) {
        if (this.fields.dataSource instanceof DataManager) {
            for (let i = 0; i < ds.length; i++) {
                if ((typeof field.child === 'string') && isNullOrUndefined(getValue(field.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i = 0, len = ds.length; i < len; i++) {
            if ((typeof field.child === 'string') && !isNullOrUndefined(getValue(field.child, ds[i]))) {
                return 2;
            }
            if (!isNullOrUndefined(getValue(field.parentValue, ds[i])) || !isNullOrUndefined(getValue(field.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    }
    /* Triggers when the tree fields is changed dynamically */
    setFields() {
        this.resetValue();
        if (this.hasTemplate) {
            this.updateTemplate();
        }
        this.treeObj.fields = this.getTreeFields(this.fields);
        this.treeObj.dataBind();
    }
    getEventArgs(args) {
        let checkData = args.data;
        let selectData = args.nodeData;
        let state;
        if (this.showCheckBox) {
            if (args.action === 'check') {
                state = 'select';
            }
            else if (args.action === 'uncheck') {
                state = 'un-select';
            }
        }
        let eventArgs = {
            action: this.showCheckBox ? state : args.action,
            isInteracted: args.isInteracted,
            item: args.node,
            itemData: this.showCheckBox ? checkData[0] : selectData
        };
        return eventArgs;
    }
    onBeforeSelect(args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
            if (this.value === null) {
                this.setProperties({ value: [] }, true);
            }
        }
    }
    updateHiddenValue() {
        if (this.allowMultiSelection || this.showCheckBox) {
            return;
        }
        if (this.value && this.value.length) {
            this.hiddenElement.innerHTML = '<option selected value ="' + this.value[0] + '">' + this.text + '</option>';
        }
        else {
            this.hiddenElement.innerHTML = '';
        }
    }
    /* Triggers when the tree node is selected */
    onNodeSelected(args) {
        if (this.showCheckBox) {
            return;
        }
        let selectedText;
        if (args.isInteracted) {
            let id = getValue('id', args.nodeData).toString();
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
        let eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isValueChange && !this.changeOnBlur) {
            this.triggerChangeEvent(this.keyEventArgs);
            this.isValueChange = false;
        }
    }
    onNodeClicked(args) {
        if (!this.changeOnBlur && this.isNodeSelected) {
            this.triggerChangeEvent(args.event);
            this.isNodeSelected = false;
        }
        let target = args.event.target;
        if ((target.classList.contains('e-fullrow') || target.classList.contains('e-list-text')) && this.showCheckBox) {
            let getNodeDetails = this.treeObj.getNode(args.node);
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
    }
    onNodeChecked(args) {
        let eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isFilteredData && args.action === 'uncheck') {
            let id = getValue('id', args.data[0]).toString();
            this.removeSelectedData(id, true);
        }
        if (!this.isChipDelete && args.isInteracted) {
            this.setMultiSelect();
            this.ensurePlaceHolder();
        }
        if (this.showSelectAll && this.checkBoxElement) {
            let nodes = this.treeObj.element.querySelectorAll('li');
            let checkedNodes = this.treeObj.element.querySelectorAll('li .e-checkbox-wrapper[aria-checked=true]');
            let wrap = closest(this.checkBoxElement, '.' + CHECKBOXWRAP);
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
    }
    beforeCheck(args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
        }
    }
    updateClearButton(state) {
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
            let chipClose = selectAll('.' + CHIP_CLOSE, this.chipWrapper);
            for (let i = 0; i < chipClose.length; i++) {
                if (!state) {
                    addClass([chipClose[i]], HIDEICON);
                }
                else {
                    removeClass([chipClose[i]], HIDEICON);
                }
            }
        }
    }
    updateDropDownIconState(state) {
        let spinIcon = select('.' + DDTICON, this.inputWrapper);
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
    }
    updateMode() {
        if (this.mode !== 'Delimiter') {
            if (!this.inputWrapper.contains(this.chipWrapper)) {
                this.createChip();
            }
            let isValid = this.getValidMode();
            if (this.chipWrapper.classList.contains(HIDEICON) && isValid) {
                removeClass([this.chipWrapper], HIDEICON);
                addClass([this.inputWrapper], SHOW_CHIP);
            }
            else if (!isValid) {
                addClass([this.chipWrapper], HIDEICON);
                removeClass([this.inputWrapper], SHOW_CHIP);
            }
            let isValue = this.value !== null ? (this.value.length !== 0 ? true : false) : false;
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
    }
    ensurePlaceHolder() {
        if (this.value && this.value.length === 0) {
            removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                addClass([this.chipWrapper], HIDEICON);
            }
        }
    }
    ensureClearIconPosition(floatLabelType) {
        if (floatLabelType !== 'Never') {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    }
    setMultiSelectValue(newValues) {
        if (!this.isFilteredData) {
            this.setProperties({ value: newValues }, true);
            if (newValues && newValues.length !== 0 && !this.showCheckBox) {
                this.treeObj.selectedNodes = this.value.slice();
                this.treeObj.dataBind();
            }
        }
        else {
            let selectedValues = isNullOrUndefined(this.value) ? [] : this.value;
            for (let i = 0; i < newValues.length; i++) {
                if (isNullOrUndefined(this.value) || this.value.indexOf(newValues[i]) === -1) {
                    selectedValues.push(newValues[i]);
                }
            }
            this.setProperties({ value: selectedValues }, true);
        }
    }
    setMultiSelect() {
        if (this.showCheckBox && !this.isDynamicChange) {
            this.setMultiSelectValue(this.treeObj.checkedNodes.slice());
        }
        else {
            let ddtValue = this.allowMultiSelection ? (this.showCheckBox ? this.treeObj.checkedNodes
                : this.treeObj.selectedNodes) : (this.value ? (this.showCheckBox ? this.value : [this.value[0]]) : null);
            this.setMultiSelectValue(ddtValue);
            if (this.showCheckBox && this.value !== null) {
                this.treeObj.checkedNodes = this.value;
                this.treeObj.dataBind();
            }
        }
        this.selectedText = [];
        let checkSelection = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (this.inputWrapper.contains(this.chipWrapper) && !checkSelection) {
            removeClass([this.inputEle], CHIP_INPUT);
            detach(this.chipWrapper);
        }
        let isValid = this.getValidMode();
        if (isValid && this.value !== null) {
            addClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                removeClass([this.chipWrapper], HIDEICON);
            }
        }
        let isValue = this.value ? (this.value.length ? true : false) : false;
        if (this.chipWrapper && (this.mode === 'Box' && !isValue)) {
            addClass([this.chipWrapper], HIDEICON);
            removeClass([this.inputEle], CHIP_INPUT);
        }
        this.updateSelectedValues();
    }
    getSelectedData(value) {
        let data = null;
        if (this.isFilteredData) {
            for (let i = 0; i < this.selectedData.length; i++) {
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
    }
    removeSelectedData(value, muteOnChange) {
        let selectedValues = isNullOrUndefined(this.value) ? [] : this.value.slice();
        selectedValues.splice(selectedValues.indexOf(value), 1);
        this.setProperties({ value: selectedValues }, muteOnChange);
        for (let i = 0; i < this.selectedData.length; i++) {
            if (getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                this.selectedData.splice(i, 1);
                break;
            }
        }
    }
    updateSelectedValues() {
        this.dataValue = '';
        let temp;
        let text;
        let textValue = '';
        let selectedData;
        this.hiddenElement.innerHTML = '';
        if ((!this.isChipDelete || this.treeSettings.autoCheck) && (this.inputWrapper.contains(this.chipWrapper))) {
            this.chipCollection.innerHTML = '';
        }
        if (!this.isFilteredData) {
            this.selectedData = [];
        }
        if (!isNullOrUndefined(this.value)) {
            for (let i = 0, len = this.value.length; i < len; i++) {
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
        let isValid = this.getValidMode();
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
    }
    setChipValues(text, value) {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.createChip();
        }
        let chip = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': value }
        });
        let chipContent = this.createElement('span', { className: CHIP_CONTENT });
        let chipClose = this.createElement('span', { className: CHIP_CLOSE + ' ' + ICONS });
        chipContent.innerHTML = text;
        chip.appendChild(chipContent);
        this.chipCollection.appendChild(chip);
        if (this.showClearButton) {
            chip.appendChild(chipClose);
            EventHandler.add(chipClose, 'mousedown', this.removeChip, this);
        }
    }
    setSelectAllWrapper(state) {
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
    }
    setHeaderTemplate() {
        let compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            addClass([this.header], HEADER);
        }
        compiledString = this.templateComplier(this.headerTemplate);
        let tempArr = compiledString({}, this, 'headerTemplate', this.headerTemplateId, this.isStringTemplate, undefined, this.header);
        if (tempArr) {
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, this.header);
        }
        this.ddtupdateBlazorTemplates(false, false, true, false);
        this.popupEle.insertBefore(this.header, this.checkAllParent ? this.checkAllParent : this.popupDiv);
    }
    templateComplier(template) {
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
    }
    setFooterTemplate() {
        let compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            addClass([this.footer], FOOTER);
        }
        compiledString = this.templateComplier(this.footerTemplate);
        let tempArr = compiledString({}, this, 'footerTemplate', this.footerTemplateId, this.isStringTemplate, undefined, this.footer);
        if (tempArr) {
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, this.footer);
        }
        this.ddtupdateBlazorTemplates(false, false, false, true);
        append([this.footer], this.popupEle);
    }
    clearAll(e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        this.resetValue();
        this.showOverAllClear();
        if ((this.allowMultiSelection || this.showCheckBox)) {
            if (this.popupObj) {
                this.popupObj.refreshPosition();
            }
            if (!this.wrapText) {
                this.updateOverflowWrapper(true);
            }
        }
        if (e) {
            this.isClearButtonClick = true;
        }
        if (!this.changeOnBlur) {
            this.triggerChangeEvent(e);
        }
    }
    removeChip(e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        let element = e.target.parentElement;
        let value = element.getAttribute('data-value');
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
    }
    resetValue(isDynamicChange) {
        Input.setValue(null, this.inputEle, this.floatLabelType);
        if (!isDynamicChange) {
            this.oldValue = this.value;
            this.setProperties({ value: [] }, true);
        }
        this.dataValue = null;
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
            if (!this.wrapText) {
                this.updateOverflowWrapper(true);
            }
            this.ensurePlaceHolder();
        }
    }
    clearCheckAll() {
        if (this.showSelectAll && this.value && this.value.length === 0) {
            this.setLocale(false);
        }
    }
    selectAllItems(state) {
        if (this.showCheckBox) {
            state ? this.treeObj.checkAll() : this.treeObj.uncheckAll();
            this.checkSelectAll = true;
        }
        else if (this.allowMultiSelection) {
            if (!state) {
                this.treeObj.selectedNodes = [];
            }
            else {
                let li = selectAll('li', this.treeObj.element);
                let id;
                let arr = [];
                for (let i = 0; i < li.length; i++) {
                    id = li[i].getAttribute('data-uid').toString();
                    arr.push(id);
                }
                this.treeObj.selectedNodes = arr;
            }
        }
        this.updateMode();
        this.setMultiSelect();
        if (!this.wrapText) {
            state ? this.updateView() : this.updateOverflowWrapper(true);
        }
    }
    updateTreeSettings(prop) {
        let value = Object.keys(prop.treeSettings)[0];
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
    }
    updateCheckBoxState(checkBox) {
        if (this.hasTemplate) {
            this.updateTemplate();
        }
        if (!this.wrapText) {
            this.updateOverflowWrapper(false);
        }
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
    }
    updateTemplate() {
        if (this.popupObj) {
            this.clearTemplate();
            // tslint:disable
            this.portals = [];
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
    }
    l10nUpdate(actionFailure) {
        if (this.noRecord) {
            this.noRecord.innerHTML = '';
        }
        else {
            this.noRecord = this.createElement('div');
            addClass([this.noRecord], NODATACONTAINER);
            prepend([this.noRecord], this.popupDiv);
        }
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString;
            let templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            let templatestring = actionFailure ? 'actionFailureTemplate' : 'noRecordsTemplate';
            compiledString = this.templateComplier(template);
            let tempArr = compiledString({}, this, templatestring, templateId, this.isStringTemplate, undefined, this.noRecord);
            if (tempArr) {
                tempArr = Array.prototype.slice.call(tempArr);
                append(tempArr, this.noRecord);
            }
            this.ddtupdateBlazorTemplates(!actionFailure, actionFailure);
        }
        else {
            let l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new L10n(this.getLocaleName(), l10nLocale, this.locale);
            this.noRecord.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    }
    ddtupdateBlazorTemplates(noRecord, action, header, footer, isEmpty) {
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
    }
    ddtresetBlazorTemplates(noRecord, action, header, footer) {
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
    }
    updateRecordTemplate(action) {
        if (this.treeItems && this.treeItems.length <= 0) {
            this.l10nUpdate(action);
            if (this.hasTemplate) {
                this.updateTemplate();
            }
        }
    }
    updateOverflowWrapper(state) {
        if (!state) {
            if (!this.inputWrapper.contains(this.overFlowWrapper)) {
                this.overFlowWrapper = this.createElement('span', { className: OVERFLOW_VIEW + ' ' + HIDEICON });
                this.inputWrapper.insertBefore(this.overFlowWrapper, this.hiddenElement);
            }
        }
        else if (this.inputWrapper.contains(this.overFlowWrapper) && state) {
            this.overFlowWrapper.innerHTML = '';
        }
    }
    updateMultiSelection(state) {
        if (!this.wrapText) {
            this.updateOverflowWrapper(false);
        }
        this.treeObj.allowMultiSelection = state;
        this.treeObj.dataBind();
        this.updateOption();
        if (this.allowMultiSelection) {
            this.updateMode();
        }
        this.setMultiSelect();
    }
    updateAllowFiltering(state) {
        if (!this.isFirstRender) {
            if (state) {
                this.renderFilter();
            }
            else {
                this.destroyFilter();
            }
        }
        this.ensureAutoCheck();
    }
    updateFilterPlaceHolder() {
        if (this.filterObj) {
            this.filterObj.placeholder = this.filterBarPlaceholder;
            this.filterObj.element.setAttribute('aria-label', this.filterBarPlaceholder);
        }
    }
    updateValue(value) {
        this.isDynamicChange = true;
        if (isNullOrUndefined(value) || value.length === 0) {
            this.resetValue(true);
        }
        else {
            this.setTreeValue();
            if ((this.allowMultiSelection || this.showCheckBox) && !this.wrapText) {
                this.updateOverflowWrapper(false);
                this.updateView();
            }
        }
        this.updateHiddenValue();
        this.isDynamicChange = false;
    }
    updateText(text) {
        if (isNullOrUndefined(text)) {
            this.resetValue();
        }
        else {
            this.setTreeText();
            if ((this.allowMultiSelection || this.showCheckBox) && !this.wrapText) {
                this.updateOverflowWrapper(false);
                this.updateView();
            }
        }
        this.updateHiddenValue();
    }
    updateModelMode() {
        let validMode = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (!validMode) {
            return;
        }
        if (!this.wrapText) {
            let overFlow = select('.' + OVERFLOW_VIEW, this.inputWrapper);
            if (overFlow) {
                overFlow.innerHTML = '';
            }
        }
        this.updateMode();
        this.setMultiSelect();
        if (!this.wrapText && (this.value && this.value.length !== 0)) {
            this.updateOverFlowView();
            addClass([this.inputEle], CHIP_INPUT);
            if (this.mode === 'Box') {
                removeClass([this.overFlowWrapper, this.inputWrapper], SHOW_TEXT);
            }
            else {
                addClass([this.overFlowWrapper, this.inputWrapper], SHOW_TEXT);
            }
        }
    }
    updateOption() {
        if (!this.hiddenElement.hasAttribute('multiple') && (this.allowMultiSelection || this.showCheckBox)) {
            this.hiddenElement.setAttribute('multiple', '');
        }
        else if (this.hiddenElement.hasAttribute('multiple') && (!this.allowMultiSelection && !this.showCheckBox)) {
            this.hiddenElement.removeAttribute('multiple');
        }
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
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
                    this.oldValue = oldProp.value;
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
                    this.updateOption();
                    break;
                case 'treeSettings':
                    this.updateTreeSettings(newProp);
                    break;
                case 'sortOrder':
                    if (this.hasTemplate) {
                        this.updateTemplate();
                    }
                    this.treeObj.sortOrder = newProp.sortOrder;
                    this.updateValue(this.value);
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
                    this.updateTemplate();
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
                case 'wrapText':
                    this.updateOverflowWrapper(this.wrapText);
                    if ((this.allowMultiSelection || this.showCheckBox) && !this.wrapText) {
                        this.updateView();
                    }
                    else {
                        addClass([this.overFlowWrapper], HIDEICON);
                        if (this.chipWrapper && this.mode === 'Box') {
                            removeClass([this.chipWrapper], HIDEICON);
                        }
                        else {
                            removeClass([this.inputWrapper], SHOW_CHIP);
                            removeClass([this.inputEle], CHIP_INPUT);
                        }
                        this.ensurePlaceHolder();
                    }
                    break;
            }
        }
    }
    /**
     * Allows you to clear the selected values from the Dropdown Tree component.
     * @method clear
     * @return {void}.
     */
    clear() {
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
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    destroy() {
        this.ddtresetBlazorTemplates(true, true, true, true);
        this.clearTemplate();
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
        super.destroy();
    }
    destroyFilter() {
        if (this.filterObj) {
            this.filterObj.destroy();
            detach(this.filterObj.element);
            detach(this.filterContainer);
            this.filterObj = null;
        }
    }
    /**
     * Ensures visibility of the Dropdown Tree item by using item value or item element.
     * If many Dropdown Tree items are present, and we are in need to find a particular item, then the `ensureVisible` property
     * helps you to bring the item to visibility by expanding the Dropdown Tree and scrolling to the specific item.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     */
    ensureVisible(item) {
        this.treeObj.ensureVisible(item);
    }
    /**
     * To get the updated data of source of the Dropdown Tree.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     * @returns { { [key: string]: Object }[] }.
     */
    getData(item) {
        return this.treeObj.getTreeData(item);
    }
    /**
     * Close the Dropdown tree pop-up.
     * @returns void.
     */
    hidePopup() {
        let eventArgs = { popup: this.popupObj };
        this.inputWrapper.classList.remove(ICONANIMATION);
        if (this.popupEle) {
            this.popupEle.style.display = 'none';
        }
        attributes(this.inputWrapper, { 'aria-expanded': 'false' });
        if (this.popupObj && this.isPopupOpen) {
            this.popupObj.hide();
            if (this.inputFocus) {
                this.inputWrapper.focus();
                if (this.allowFiltering) {
                    addClass([this.inputWrapper], [INPUTFOCUS]);
                }
            }
            this.trigger('close', eventArgs);
        }
    }
    /**
     * Based on the state parameter, entire list item will be selected or deselected.
     * parameter
     * `true`   - Selects entire Dropdown Tree items.
     * `false`  - Unselects entire Dropdown Tree items.
     * @returns void
     */
    selectAll(state) {
        this.selectAllItems(state);
    }
    /**
     * Opens the popup that displays the Dropdown Tree items.
     * @returns void.
     */
    showPopup() {
        if (!this.enabled || this.readonly || this.isPopupOpen) {
            return;
        }
        this.renderPopup();
        this.focusIn();
    }
    /**
     * Return the module name.
     * @private
     */
    getModuleName() {
        return 'dropdowntree';
    }
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
    Property(false)
], DropDownTree.prototype, "wrapText", void 0);
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

/**
 * export all modules from current location
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-list/drop-down-list-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
const SPINNER_CLASS = 'e-atc-spinner-icon';
dropDownListClasses.root = 'e-combobox';
let inputObject$1 = {
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
let ComboBox = class ComboBox extends DropDownList {
    /**
     * *Constructor for creating the component
     */
    constructor(options, element) {
        super(options, element);
    }
    ;
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        super.preRender();
    }
    getLocaleName() {
        return 'combo-box';
    }
    ;
    wireEvent() {
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
    }
    preventBlur(e) {
        if ((!this.allowFiltering && document.activeElement !== this.inputElement &&
            !document.activeElement.classList.contains(dropDownListClasses.input) && Browser.isDevice || !Browser.isDevice)) {
            e.preventDefault();
        }
    }
    onBlur(e) {
        let inputValue = this.inputElement.value === '' ? null : this.inputElement.value;
        if (!isNullOrUndefined(this.listData) && !isNullOrUndefined(inputValue) && inputValue !== this.text) {
            this.customValue(e);
        }
        super.onBlur(e);
    }
    targetElement() {
        return this.inputElement;
    }
    setOldText(text) {
        Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        this.customValue();
        this.removeSelection();
    }
    setOldValue(value) {
        if (this.allowCustom) {
            this.valueMuteChange(this.value);
        }
        else {
            this.valueMuteChange(null);
        }
        this.removeSelection();
        this.setHiddenValue();
    }
    valueMuteChange(value) {
        let inputValue = isNullOrUndefined(value) ? null : value.toString();
        Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
        this.setProperties({ value: value, text: value, index: null }, true);
        this.activeIndex = this.index;
        let fields = this.fields;
        let dataItem = {};
        dataItem[fields.text] = isNullOrUndefined(value) ? null : value.toString();
        dataItem[fields.value] = isNullOrUndefined(value) ? null : value.toString();
        this.itemData = dataItem;
        this.item = null;
        if (this.previousValue !== this.value) {
            this.detachChangeEvent(null);
        }
    }
    updateValues() {
        if (!isNullOrUndefined(this.value)) {
            let li = this.getElementByValue(this.value);
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
            let li = this.getElementByText(this.text);
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
    }
    updateIconState() {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
            else {
                addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    }
    getAriaAttributes() {
        let ariaAttributes = {
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
    }
    searchLists(e) {
        this.isTyped = true;
        if (this.isFiltering()) {
            super.searchLists(e);
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
    }
    getNgDirective() {
        return 'EJS-COMBOBOX';
    }
    setSearchBox() {
        this.filterInput = this.inputElement;
        return (this.isFiltering() ? this.inputWrapper : inputObject$1);
    }
    onActionComplete(ulElement, list, e, isUpdated) {
        if (!this.isServerBlazor) {
            super.onActionComplete(ulElement, list, e);
        }
        if (this.isSelectCustom) {
            this.removeSelection();
        }
        if (!this.preventAutoFill && this.getModuleName() === 'combobox' && this.isTyped) {
            this.inlineSearch();
        }
    }
    getFocusElement() {
        let dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
        let selected = this.list.querySelector('.' + dropDownListClasses.selected);
        let isSelected = dataItem.text === this.inputElement.value && !isNullOrUndefined(selected);
        if (isSelected) {
            return selected;
        }
        if ((Browser.isDevice && !this.isDropDownClick || !Browser.isDevice) &&
            !isNullOrUndefined(this.liCollections) && this.liCollections.length > 0) {
            let inputValue = this.inputElement.value;
            let activeItem = Search(inputValue, this.liCollections, 'StartsWith', true);
            let activeElement = activeItem.item;
            if (!isNullOrUndefined(activeElement)) {
                let count = this.getIndexByValue(activeElement.getAttribute('data-value')) - 1;
                let height = parseInt(getComputedStyle(this.liCollections[0], null).getPropertyValue('height'), 10);
                if (!isNaN(height) && this.getModuleName() !== 'autocomplete') {
                    this.removeFocus();
                    let fixedHead = this.fields.groupBy ? this.liCollections[0].offsetHeight : 0;
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
    }
    setValue(e) {
        if (e && e.type === 'keydown' && e.action === 'enter') {
            this.removeFillSelection();
        }
        if (this.autofill && this.getModuleName() === 'combobox' && e && e.type === 'keydown' && e.action !== 'enter') {
            this.preventAutoFill = false;
            this.inlineSearch(e);
            return false;
        }
        else {
            return super.setValue(e);
        }
    }
    checkCustomValue() {
        this.itemData = this.getDataByValue(this.value);
        let dataItem = this.getItemData();
        if (!(this.allowCustom && isNullOrUndefined(dataItem.value) && isNullOrUndefined(dataItem.text))) {
            this.setProperties({ 'value': dataItem.value, 'text': dataItem.text }, !this.allowCustom);
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     * @deprecated
     */
    showSpinner() {
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
    }
    /**
     * Hides the spinner loader.
     * @returns void.
     * @deprecated
     */
    hideSpinner() {
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
    }
    setAutoFill(activeElement, isHover) {
        if (!isHover) {
            this.setHoverList(activeElement);
        }
        if (this.autofill && !this.preventAutoFill) {
            let currentValue = this.getTextByValue(activeElement.getAttribute('data-value')).toString();
            let currentFillValue = this.getFormattedValue(activeElement.getAttribute('data-value'));
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
    }
    isAndroidAutoFill(value) {
        if (Browser.isAndroid) {
            let currentPoints = this.getSelectionPoints();
            let prevEnd = this.prevSelectPoints.end;
            let curEnd = currentPoints.end;
            let prevStart = this.prevSelectPoints.start;
            let curStart = currentPoints.start;
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
    }
    clearAll(e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource)) ||
            (isNullOrUndefined(this.itemData) && this.allowFiltering)) {
            super.clearAll(e);
            if (this.isServerBlazor && this.isFiltering() && this.isPopupOpen && e) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, true);
            }
        }
    }
    isSelectFocusItem(element) {
        return !isNullOrUndefined(element);
    }
    inlineSearch(e) {
        let isKeyNavigate = (e && (e.action === 'down' || e.action === 'up' ||
            e.action === 'home' || e.action === 'end' || e.action === 'pageUp' || e.action === 'pageDown'));
        let activeElement = isKeyNavigate ? this.liCollections[this.activeIndex] : this.getFocusElement();
        if (!isNullOrUndefined(activeElement)) {
            if (!isKeyNavigate) {
                let value = this.getFormattedValue(activeElement.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
                this.activeIndex = !isNullOrUndefined(this.activeIndex) ? this.activeIndex : null;
            }
            this.preventAutoFill = this.inputElement.value === '' ? false : this.preventAutoFill;
            this.setAutoFill(activeElement, isKeyNavigate);
        }
        else if (this.inputElement.value === '') {
            this.activeIndex = null;
            this.list.scrollTop = 0;
            let focusItem = this.list.querySelector('.' + dropDownListClasses.li);
            this.setHoverList(focusItem);
        }
        else {
            this.activeIndex = null;
            this.removeSelection();
            if (this.liCollections && this.liCollections.length < 0) {
                this.removeFocus();
            }
        }
    }
    incrementalSearch(e) {
        this.showPopup();
        if (!isNullOrUndefined(this.listData)) {
            this.inlineSearch(e);
            e.preventDefault();
        }
    }
    ;
    setAutoFillSelection(currentValue) {
        let selection = this.getSelectionPoints();
        let value = this.inputElement.value.substr(0, selection.start);
        if (value && (value.toLowerCase() === currentValue.substr(0, selection.start).toLowerCase())) {
            let inputValue = value + currentValue.substr(value.length, currentValue.length);
            Input.setValue(inputValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(selection.start, this.inputElement.value.length);
        }
        else {
            Input.setValue(currentValue, this.inputElement, this.floatLabelType, this.showClearButton);
            this.inputElement.setSelectionRange(0, this.inputElement.value.length);
        }
    }
    ;
    getValueByText(text) {
        return super.getValueByText(text, true, this.ignoreAccent);
    }
    unWireEvent() {
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
    }
    setSelection(li, e) {
        super.setSelection(li, e);
        if (!isNullOrUndefined(li) && !this.autofill && !this.isDropDownClick) {
            this.removeFocus();
        }
    }
    selectCurrentItem(e) {
        let li;
        if (this.isPopupOpen) {
            if (this.isSelected) {
                li = this.list.querySelector('.' + dropDownListClasses.selected);
            }
            else {
                li = this.list.querySelector('.' + dropDownListClasses.focus);
            }
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
    }
    setHoverList(li) {
        this.removeSelection();
        if (this.isValidLI(li) && !li.classList.contains(dropDownListClasses.selected)) {
            this.removeFocus();
            li.classList.add(dropDownListClasses.focus);
        }
    }
    ;
    targetFocus(e) {
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = false;
        }
        this.onFocus(e);
    }
    dropDownClick(e) {
        e.preventDefault();
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        super.dropDownClick(e);
    }
    customValue(e) {
        let value = this.getValueByText(this.inputElement.value);
        if (!this.allowCustom && this.inputElement.value !== '') {
            let previousValue = this.previousValue;
            let currentValue = this.value;
            this.setProperties({ value: value });
            if (isNullOrUndefined(this.value)) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            }
            if (this.autofill && previousValue === this.value && currentValue !== this.value) {
                this.onChangeEvent(null);
            }
        }
        else if (this.inputElement.value.trim() !== '') {
            let previousValue = this.value;
            if (isNullOrUndefined(value)) {
                let value = this.inputElement.value === '' ? null : this.inputElement.value;
                let eventArgs;
                eventArgs = { text: value, item: {} };
                if (!this.initial) {
                    this.trigger('customValueSpecifier', eventArgs, (eventArgs) => {
                        this.updateCustomValueCallback(value, eventArgs, previousValue, e);
                    });
                }
                else {
                    this.updateCustomValueCallback(value, eventArgs, previousValue);
                }
            }
            else {
                this.isSelectCustom = false;
                this.setProperties({ value: value });
                if (previousValue !== this.value) {
                    this.onChangeEvent(e);
                }
            }
        }
        else if (this.allowCustom) {
            this.isSelectCustom = true;
        }
    }
    updateCustomValueCallback(value, eventArgs, previousValue, e) {
        let fields = this.fields;
        let item = eventArgs.item;
        let dataItem = {};
        if (item && getValue(fields.text, item) && getValue(fields.value, item)) {
            dataItem = item;
        }
        else {
            setValue(fields.text, value, dataItem);
            setValue(fields.value, value, dataItem);
        }
        this.itemData = dataItem;
        let changeData = {
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
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.getModuleName() === 'combobox') {
            this.checkData(newProp);
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (let prop of Object.keys(newProp)) {
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
                        super.renderList();
                    }
                    break;
                case 'allowCustom':
                    break;
                default:
                    let comboProps;
                    comboProps = this.getPropObject(prop, newProp, oldProp);
                    super.onPropertyChanged(comboProps.newProperty, comboProps.oldProperty);
                    break;
            }
        }
    }
    /**
     * To initialize the control rendering.
     * @private
     */
    render() {
        super.render();
        this.setSearchBox();
        if (this.isFiltering() && this.getModuleName() === 'combobox' && isNullOrUndefined(this.list)) {
            super.renderList();
        }
        this.renderComplete();
    }
    ;
    /**
     * Return the module name of this component.
     * @private
     */
    getModuleName() {
        return 'combobox';
    }
    /**
     * Adds a new item to the combobox popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @deprecated
     */
    addItem(items, itemIndex) {
        super.addItem(items, itemIndex);
    }
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    filter(dataSource, query, fields) {
        super.filter(dataSource, query, fields);
    }
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     * @deprecated
     */
    showPopup() {
        super.showPopup();
    }
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     * @deprecated
     */
    hidePopup(e) {
        let inputValue = this.inputElement.value === '' ? null : this.inputElement.value;
        if (!isNullOrUndefined(this.listData)) {
            let isEscape = this.isEscapeKey;
            if (this.isEscapeKey) {
                Input.setValue(this.typedString, this.inputElement, this.floatLabelType, this.showClearButton);
                this.isEscapeKey = false;
            }
            if (this.autofill) {
                this.removeFillSelection();
            }
            let dataItem = this.isSelectCustom ? { text: '' } : this.getItemData();
            let selected = this.list.querySelector('.' + dropDownListClasses.selected);
            if (dataItem.text === this.inputElement.value && !isNullOrUndefined(selected)) {
                if (this.isSelected) {
                    this.onChangeEvent(e);
                    this.isSelectCustom = false;
                }
                super.hidePopup(e);
                return;
            }
            if (this.getModuleName() === 'combobox' && this.inputElement.value.trim() !== '') {
                let searchItem = Search(this.inputElement.value, this.liCollections, 'Equal', true);
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
        super.hidePopup(e);
    }
    /**
     * Sets the focus to the component for interaction.
     * @returns void.
     */
    focusIn() {
        if (!this.enabled) {
            return;
        }
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        super.focusIn();
    }
    /**
     * Allows you to clear the selected values from the component.
     * @returns void.
     * @deprecated
     */
    clear() {
        this.value = null;
    }
    /**
     * Moves the focus from the component if the component is already focused.
     * @returns void.
     * @deprecated
     */
    focusOut(e) {
        super.focusOut(e);
    }
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     * @deprecated
     */
    getItems() {
        return super.getItems();
    }
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     * @deprecated
     */
    getDataByValue(value) {
        return super.getDataByValue(value);
    }
    renderHightSearch() {
        // update high light search 
    }
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

/**
 * export all modules from current location
 */

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
let AutoComplete = class AutoComplete extends ComboBox {
    /**
     * * Constructor for creating the widget
     */
    constructor(options, element) {
        super(options, element);
        this.isFiltered = false;
    }
    ;
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        super.preRender();
    }
    getLocaleName() {
        return 'auto-complete';
    }
    ;
    getNgDirective() {
        return 'EJS-AUTOCOMPLETE';
    }
    getQuery(query) {
        let filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        let filterType = (this.queryString === '' && !isNullOrUndefined(this.value)) ? 'equal' : this.filterType;
        let queryString = (this.queryString === '' && !isNullOrUndefined(this.value)) ? this.value : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null && this.queryString !== '') {
            let dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                let mapping = !isNullOrUndefined(this.fields.value) ? this.fields.value : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
            // Since defualt value of suggestioncount is 20, checked the condition
            if (this.suggestionCount !== 20) {
                for (let queryElements = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements].fn === 'onTake') {
                        filterQuery.queries.splice(queryElements, 1);
                    }
                }
            }
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    }
    searchLists(e) {
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
                super.renderList(true);
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
            let eventArgs = {
                preventDefaultAction: false,
                text: this.filterInput.value,
                updateData: (dataSource, query, fields) => {
                    if (eventArgs.cancel) {
                        return;
                    }
                    this.isFiltered = true;
                    this.filterAction(dataSource, query, fields);
                },
                cancel: false
            };
            this.trigger('filtering', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel && !this.isFiltered && !eventArgs.preventDefaultAction) {
                    this.filterAction(this.dataSource, null, this.fields);
                }
            });
        }
    }
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    filter(dataSource, query, fields) {
        this.isFiltered = true;
        this.filterAction(dataSource, query, fields);
    }
    filterAction(dataSource, query, fields) {
        this.beforePopupOpen = true;
        if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
            this.resetList(dataSource, fields, query);
        }
        else {
            this.hidePopup();
        }
        this.renderReactTemplates();
    }
    clearAll(e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clearAll(e);
        }
        if (this.beforePopupOpen) {
            this.hidePopup();
        }
    }
    onActionComplete(ulElement, list, e, isUpdated) {
        this.fixedHeaderElement = null;
        super.onActionComplete(ulElement, list, e);
        let item = this.list.querySelector('.' + dropDownListClasses.li);
        if (!isNullOrUndefined(item)) {
            removeClass([item], dropDownListClasses.focus);
        }
        this.postBackAction();
    }
    postBackAction() {
        if (this.autofill && !isNullOrUndefined(this.liCollections[0])) {
            let items = [this.liCollections[0]];
            let searchItem = Search(this.inputElement.value, items, 'StartsWith', this.ignoreCase);
            if (!isNullOrUndefined(searchItem.item)) {
                super.setAutoFill(this.liCollections[0], true);
            }
        }
    }
    setSelection(li, e) {
        if (!this.isValidLI(li)) {
            return;
        }
        if (!isNullOrUndefined(e) && e.type === 'keydown' && e.action !== 'enter'
            && e.action !== 'tab' && this.isValidLI(li)) {
            let value = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            if (this.isServerBlazor) {
                this.removeHover();
            }
            this.setHoverList(li);
            this.selectedLI = li;
            this.setScrollPosition(e);
            if (this.autofill && this.isPopupOpen) {
                this.preventAutoFill = false;
                super.setAutoFill(li);
            }
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
        }
        else {
            super.setSelection(li, e);
        }
    }
    listOption(dataSource, fieldsSettings) {
        let fields = super.listOption(dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = (e) => {
                if (this.highlight) {
                    if (this.element.tagName === this.getNgDirective() && this.itemTemplate) {
                        setTimeout(() => { highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType); }, 0);
                    }
                    else {
                        highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                    }
                }
            };
        }
        else {
            let itemCreated = fields.itemCreated;
            fields.itemCreated = (e) => {
                if (this.highlight) {
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
                }
                itemCreated.apply(this, [e]);
            };
        }
        return fields;
    }
    ;
    isFiltering() {
        return true;
    }
    renderPopup() {
        this.list.scrollTop = 0;
        super.renderPopup();
    }
    isEditTextBox() {
        return true && this.inputElement.value.trim() !== '';
    }
    isPopupButton() {
        return this.showPopupButton;
    }
    isSelectFocusItem(element) {
        return false;
    }
    /**
     * Search the entered text and show it in the suggestion list if available.
     * @returns void.
     * @deprecated
     */
    showPopup() {
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
    }
    /**
     * Hides the popup if it is in open state.
     * @returns void.
     */
    hidePopup() {
        this.DropDownBaseresetBlazorTemplates(true, false, false, false);
        super.hidePopup();
        this.activeIndex = -1;
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.getModuleName() === 'autocomplete') {
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showPopupButton':
                    if (this.showPopupButton) {
                        if (!this.isServerBlazor) {
                            let button = Input.appendSpan(dropDownListClasses.icon, this.inputWrapper.container, this.createElement);
                            this.inputWrapper.buttons[0] = button;
                        }
                        else if (this.inputWrapper && this.inputWrapper.container) {
                            let button = this.inputWrapper.container.querySelector('.e-input-group-icon.e-ddl-icon');
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
                    let atcProps;
                    atcProps = this.getPropObject(prop, newProp, oldProp);
                    super.onPropertyChanged(atcProps.newProperty, atcProps.oldProperty);
                    break;
            }
        }
    }
    renderHightSearch() {
        if (this.highlight) {
            for (let i = 0; i < this.liCollections.length; i++) {
                let isHighlight = this.ulElement.querySelector('.e-active');
                if (!isHighlight) {
                    revertHighlightSearch(this.liCollections[i]);
                    highlightSearch(this.liCollections[i], this.queryString, this.ignoreCase, this.filterType, this.isServerBlazor);
                }
            }
        }
    }
    /**
     * Return the module name of this component.
     * @private
     */
    getModuleName() {
        return 'autocomplete';
    }
    /**
     * To initialize the control rendering
     * @private
     */
    render() {
        super.render();
    }
    ;
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

/**
 * export all modules from current location
 */

/**
 * FloatLable Moduel
 * Specifies whether to display the floating label above the input element.
 */
const FLOATLINE = 'e-float-line';
const FLOATTEXT = 'e-float-text';
const LABELTOP = 'e-label-top';
const LABELBOTTOM = 'e-label-bottom';
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
    let floatLinelement;
    let floatLabelElement;
    floatLinelement = createElement('span', { className: FLOATLINE });
    floatLabelElement = createElement('label', { className: FLOATTEXT });
    if (!isNullOrUndefined(element.id) && element.id !== '') {
        floatLabelElement.id = 'label_' + element.id.replace(/ /g, '_');
        attributes(element, { 'aria-labelledby': floatLabelElement.id });
    }
    if (!isNullOrUndefined(inputElement.placeholder) && inputElement.placeholder !== '') {
        floatLabelElement.innerText = SanitizeHtmlHelper.sanitize(inputElement.placeholder);
        inputElement.removeAttribute('placeholder');
    }
    floatLabelElement.innerText = SanitizeHtmlHelper.sanitize(placeholder);
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
    let placeholderElement = componentWrapper.querySelector('.' + FLOATTEXT);
    let floatLine = componentWrapper.querySelector('.' + FLOATLINE);
    let placeholderText;
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
    let label = componentWrapper.querySelector('.' + FLOATTEXT);
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
    let label = componentWrapper.querySelector('.' + FLOATTEXT);
    if (value && value.length <= 0 && floatLabelType === 'Auto' && !isNullOrUndefined(label)) {
        if (label.classList.contains(LABELTOP)) {
            removeClass([label], LABELTOP);
        }
        addClass([label], LABELBOTTOM);
    }
}

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
const FOCUS = 'e-input-focus';
const DISABLED$1 = 'e-disabled';
const OVER_ALL_WRAPPER = 'e-multiselect e-input-group e-control-wrapper';
const ELEMENT_WRAPPER = 'e-multi-select-wrapper';
const ELEMENT_MOBILE_WRAPPER = 'e-mob-wrapper';
const HIDE_LIST = 'e-hide-listitem';
const DELIMITER_VIEW = 'e-delim-view';
const CHIP_WRAPPER$1 = 'e-chips-collection';
const CHIP$1 = 'e-chips';
const CHIP_CONTENT$1 = 'e-chipcontent';
const CHIP_CLOSE$1 = 'e-chips-close';
const CHIP_SELECTED = 'e-chip-selected';
const SEARCHBOX_WRAPPER = 'e-searcher';
const DELIMITER_VIEW_WRAPPER = 'e-delimiter';
const ZERO_SIZE = 'e-zero-size';
const REMAIN_WRAPPER$1 = 'e-remain';
const CLOSEICON_CLASS$1 = 'e-chips-close e-close-hooker';
const DELIMITER_WRAPPER = 'e-delim-values';
const POPUP_WRAPPER = 'e-ddl e-popup e-multi-select-list-wrapper';
const INPUT_ELEMENT = 'e-dropdownbase';
const RTL_CLASS = 'e-rtl';
const CLOSE_ICON_HIDE = 'e-close-icon-hide';
const MOBILE_CHIP = 'e-mob-chip';
const FOOTER$1 = 'e-ddl-footer';
const HEADER$1 = 'e-ddl-header';
const DISABLE_ICON = 'e-ddl-disable-icon';
const SPINNER_CLASS$1 = 'e-ms-spinner-icon';
const HIDDEN_ELEMENT = 'e-multi-hidden';
const destroy = 'destroy';
const dropdownIcon = 'e-input-group-icon e-ddl-icon';
const iconAnimation = 'e-icon-anim';
const TOTAL_COUNT_WRAPPER$1 = 'e-delim-total';
const BOX_ELEMENT = 'e-multiselect-box';
const FILTERPARENT = 'e-filter-parent';
const CUSTOM_WIDTH = 'e-search-custom-width';
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
let MultiSelect = class MultiSelect extends DropDownBase {
    /**
     * Constructor for creating the DropDownList widget.
     */
    constructor(option, element) {
        super(option, element);
        this.clearIconWidth = 0;
        this.isValidKey = false;
        this.selectAllEventData = [];
        this.selectAllEventEle = [];
        this.isDynamicDataChange = false;
        this.scrollFocusStatus = false;
        this.keyDownStatus = false;
    }
    ;
    enableRTL(state) {
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
    }
    requiredModules() {
        let modules = [];
        if (this.mode === 'CheckBox') {
            this.isGroupChecking = this.enableGroupCheckBox;
            if (this.enableGroupCheckBox) {
                let prevOnChange = this.isProtectedOnChange;
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
    }
    updateHTMLAttribute() {
        if (Object.keys(this.htmlAttributes).length) {
            for (let htmlAttr of Object.keys(this.htmlAttributes)) {
                switch (htmlAttr) {
                    case 'class':
                        let updatedClassValue = (this.htmlAttributes[htmlAttr].replace(/\s+/g, ' ')).trim();
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
                        let defaultAttr = ['id'];
                        let validateAttr = ['name', 'required', 'aria-required', 'form'];
                        let containerAttr = ['title', 'role', 'style', 'class'];
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
    }
    updateReadonly(state) {
        if (state || this.mode === 'CheckBox') {
            this.inputElement.setAttribute('readonly', 'true');
        }
        else {
            this.inputElement.removeAttribute('readonly');
        }
    }
    updateClearButton(state) {
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
    }
    updateCssClass() {
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            let updatedCssClassValues = this.cssClass;
            updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
            if (updatedCssClassValues !== '') {
                addClass([this.overAllWrapper], updatedCssClassValues.split(' '));
                addClass([this.popupWrapper], updatedCssClassValues.split(' '));
            }
        }
    }
    updateOldPropCssClass(oldClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
            if (oldClass !== '') {
                removeClass([this.overAllWrapper], oldClass.split(' '));
                removeClass([this.popupWrapper], oldClass.split(' '));
            }
        }
    }
    onPopupShown() {
        if (Browser.isDevice && (this.mode === 'CheckBox' && this.allowFiltering)) {
            let proxy = this;
            window.onpopstate = () => {
                proxy.hidePopup();
                proxy.inputElement.focus();
            };
            history.pushState({}, '');
        }
        let animModel = { name: 'FadeIn', duration: 100 };
        let eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('open', eventArgs, (eventArgs) => {
            if (!eventArgs.cancel) {
                this.focusAtFirstListItem();
                document.body.appendChild(this.popupObj.element);
                if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                    this.updateListItems(this.list.querySelectorAll('li.e-list-item'), this.mainList.querySelectorAll('li.e-list-item'));
                }
                if (this.mode === 'CheckBox' || this.showDropDownIcon) {
                    addClass([this.overAllWrapper], [iconAnimation]);
                }
                this.refreshPopup();
                this.renderReactTemplates();
                this.popupObj.show(eventArgs.animation, (this.zIndex === 1000) ? this.element : null);
                attributes(this.inputElement, { 'aria-expanded': 'true' });
                if (this.isFirstClick) {
                    this.loadTemplate();
                }
            }
        });
    }
    updateListItems(listItems, mainListItems) {
        for (let i = 0; i < listItems.length; i++) {
            this.findGroupStart(listItems[i]);
            this.findGroupStart(mainListItems[i]);
        }
        this.deselectHeader();
    }
    loadTemplate() {
        if (this.mode === 'CheckBox' && this.itemTemplate && (isBlazor() && this.isServerRendered) &&
            this.mainData && this.mainData.length > 0) {
            setTimeout(() => {
                this.refreshListItems(null);
                if (this.mode === 'CheckBox') {
                    this.removeFocus();
                }
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
            }, this.mainData.length < 100 ? 100 : this.mainData.length);
        }
        else {
            this.refreshListItems(null);
            if (this.mode === 'CheckBox') {
                this.removeFocus();
            }
            this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
        }
    }
    setScrollPosition() {
        if (((!this.hideSelectedItem && this.mode !== 'CheckBox') || (this.mode === 'CheckBox' && !this.enableSelectionOrder)) &&
            (!isNullOrUndefined(this.value) && (this.value.length > 0))) {
            let valueEle = this.findListElement((this.hideSelectedItem ? this.ulElement : this.list), 'li', 'data-value', this.value[this.value.length - 1]);
            if (!isNullOrUndefined(valueEle)) {
                this.scrollBottom(valueEle);
            }
        }
    }
    focusAtFirstListItem() {
        if (this.ulElement && this.ulElement.querySelector('li.'
            + dropDownBaseClasses.li)) {
            let element;
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
    }
    focusAtLastListItem(data) {
        let activeElement;
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
    }
    getAriaAttributes() {
        let ariaAttributes = {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-multiselectable': 'true',
            'aria-activedescendant': 'null',
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
        };
        return ariaAttributes;
    }
    updateListARIA() {
        attributes(this.ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
        let disableStatus = (this.inputElement.disabled) ? true : false;
        attributes(this.inputElement, this.getAriaAttributes());
        if (disableStatus) {
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
        this.ensureAriaDisabled((disableStatus) ? 'true' : 'false');
    }
    ensureAriaDisabled(status) {
        if (this.htmlAttributes && this.htmlAttributes['aria-disabled']) {
            let attr = this.htmlAttributes;
            extend(attr, { 'aria-disabled': status }, attr);
            this.setProperties({ htmlAttributes: attr }, true);
        }
    }
    removelastSelection(e) {
        let elements;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP$1);
        let value = elements[elements.length - 1].getAttribute('data-value');
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
    }
    onActionFailure(e) {
        super.onActionFailure(e);
        this.renderPopup();
        this.onPopupShown();
    }
    targetElement() {
        this.targetInputElement = this.inputElement;
        if (this.mode === 'CheckBox' && this.allowFiltering) {
            this.notify('targetElement', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
        }
        return this.targetInputElement.value;
    }
    getForQuery(valuecheck) {
        let predicate;
        let field = isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
        for (let i = 0; i < valuecheck.length; i++) {
            if (i === 0) {
                predicate = new Predicate(field, 'equal', valuecheck[i]);
            }
            else {
                predicate = predicate.or(field, 'equal', valuecheck[i]);
            }
        }
        return this.getQuery(this.query).where(predicate);
    }
    onActionComplete(ulElement, list, e, isUpdated) {
        super.onActionComplete(ulElement, list, e);
        this.updateSelectElementData(this.allowFiltering);
        let proxy = this;
        if (isBlazor() && this.isServerRendered && this.isDynamicDataChange && this.value !== null && this.value.length > 0) {
            let items = [];
            for (let k = 0; k < this.value.length; k++) {
                let itemsData = this.getDataByValue(this.value[k]);
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
            for (let i = 0; i < this.value.length; i++) {
                let checkEle = this.findListElement(((this.allowFiltering && !isNullOrUndefined(this.mainList)) ? this.mainList : ulElement), 'li', 'data-value', proxy.value[i]);
                if (!checkEle) {
                    this.value.splice(i, 1);
                    i -= 1;
                }
            }
        }
        this.updateActionList(ulElement, list, e);
        if (isBlazor() && this.isServerRendered && this.allowFiltering && this.mode === 'CheckBox') {
            this.removeFocus();
        }
        if (isBlazor() && this.isServerRendered && this.isDynamicDataChange && this.value && this.value.length > 0) {
            this.updateVal(this.value, null, 'value');
            this.addValidInputClass();
            this.isDynamicDataChange = false;
        }
        if (this.dataSource instanceof DataManager && this.mode === 'CheckBox' && this.allowFiltering &&
            !(isBlazor() && this.isServerRendered)) {
            this.removeFocus();
        }
    }
    updateActionList(ulElement, list, e, isUpdated) {
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
        if ((this.remoteCustomValue || list.length <= 0) && this.allowCustomValue && this.inputFocus && this.allowFiltering &&
            this.inputElement.value && this.inputElement.value !== '') {
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
    }
    refreshSelection() {
        let value;
        let element;
        let className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (!isNullOrUndefined(this.value)) {
            for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
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
                        let listEle = element.parentElement.querySelectorAll('.' +
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
                        let ariaValue = element.firstElementChild.getAttribute('aria-checked');
                        if (isNullOrUndefined(ariaValue) || ariaValue === 'false') {
                            let args = {
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
    }
    hideGroupItem(value) {
        let element;
        let element1;
        let className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        element1 = element = this.findListElement(this.ulElement, 'li', 'data-value', value);
        let i = 0;
        let j = 0;
        let temp = true;
        let temp1 = true;
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
    }
    checkSelectAll() {
        let groupItemLength = this.list.querySelectorAll('li.e-list-group-item.e-active').length;
        let listItem = this.list.querySelectorAll('li.e-list-item');
        let searchCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        let searchActiveCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.selected).length;
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
            for (let i = 0; i < listItem.length; i++) {
                this.findGroupStart(listItem[i]);
            }
            this.deselectHeader();
        }
    }
    openClick(e) {
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
    }
    KeyUp(e) {
        if (this.mode === 'CheckBox' && !this.openOnClick) {
            let char = String.fromCharCode(e.keyCode);
            let isWordCharacter = char.match(/\w/);
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
    }
    /**
     * To filter the multiselect data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    filter(dataSource, query, fields) {
        this.isFiltered = true;
        this.remoteFilterAction = true;
        this.dataUpdater(dataSource, query, fields);
    }
    getQuery(query) {
        let filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.filterAction) {
            if (this.targetElement() !== null) {
                let dataType = this.typeOfData(this.dataSource).typeof;
                if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                    filterQuery.where('', this.filterType, this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
                else {
                    let fields = this.fields;
                    filterQuery.where(!isNullOrUndefined(fields.text) ? fields.text : '', this.filterType, this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
            }
            return filterQuery;
        }
        else {
            return query ? query : this.query ? this.query : new Query();
        }
    }
    dataUpdater(dataSource, query, fields) {
        this.isDataFetched = false;
        if (this.targetElement().trim() === '') {
            let list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
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
    }
    checkForCustomValue(query, fields) {
        let dataChecks = !this.getValueByText(this.inputElement.value, this.ignoreCase);
        if (this.allowCustomValue && dataChecks) {
            let value = this.inputElement.value;
            let field = fields ? fields : this.fields;
            let customData = (!isNullOrUndefined(this.mainData) && this.mainData.length > 0) ?
                this.mainData[0] : this.mainData;
            if (typeof (customData) !== 'string') {
                let dataItem = {};
                setValue(field.text, value, dataItem);
                setValue(field.value, value, dataItem);
                let tempData = JSON.parse(JSON.stringify(this.listData));
                tempData.splice(0, 0, dataItem);
                this.resetList(tempData, field, query);
            }
            else {
                let tempData = [this.inputElement.value];
                this.resetList(tempData, field);
            }
        }
        if (this.value && this.value.length) {
            this.refreshSelection();
        }
    }
    getNgDirective() {
        return 'EJS-MULTISELECT';
    }
    wrapperClick(e) {
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
        if (!(this.targetElement() && this.targetElement() !== '')) {
            e.preventDefault();
        }
    }
    enable(state) {
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
    }
    onBlur(eve, isDocClickFromCheck) {
        let target;
        if (!isNullOrUndefined(eve)) {
            target = eve.relatedTarget;
        }
        if (this.popupObj && document.body.contains(this.popupObj.element) && this.popupObj.element.contains(target)) {
            if (this.mode !== 'CheckBox') {
                this.inputElement.focus();
            }
            else if ((this.floatLabelType === 'Auto' &&
                ((this.overAllWrapper.classList.contains('e-outline')) || (this.overAllWrapper.classList.contains('e-filled'))))) {
                addClass([this.overAllWrapper], 'e-valid-input');
            }
            return;
        }
        if (this.floatLabelType === 'Auto' && (this.overAllWrapper.classList.contains('e-outline')) && this.mode === 'CheckBox' &&
            ((isNullOrUndefined(this.value)) || this.value.length === 0)) {
            removeClass([this.overAllWrapper], 'e-valid-input');
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
    }
    checkPlaceholderSize() {
        if (this.showDropDownIcon) {
            let downIconWidth = this.dropIcon.offsetWidth +
                parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            this.setPlaceholderSize(downIconWidth);
        }
        else {
            if (!isNullOrUndefined(this.dropIcon)) {
                this.setPlaceholderSize(this.showDropDownIcon ? this.dropIcon.offsetWidth : 0);
            }
        }
    }
    setPlaceholderSize(downIconWidth) {
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
    }
    refreshInputHight() {
        if ((!this.value || !this.value.length) && (isNullOrUndefined(this.text) || this.text === '')) {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        else {
            this.searchWrapper.classList.add(ZERO_SIZE);
        }
    }
    validateValues(newValue, oldValue) {
        return JSON.stringify(newValue.slice().sort()) !== JSON.stringify(oldValue.slice().sort());
    }
    updateValueState(event, newVal, oldVal) {
        let newValue = newVal ? newVal : [];
        let oldValue = oldVal ? oldVal : [];
        if (this.initStatus && this.validateValues(newValue, oldValue)) {
            let eventArgs = {
                e: event,
                oldValue: oldVal,
                value: newVal,
                isInteracted: event ? true : false,
                element: this.element
            };
            if (this.isAngular && this.preventChange) {
                this.preventChange = false;
            }
            else {
                this.trigger('change', eventArgs);
            }
            this.updateTempValue();
            if (!this.changeOnBlur) {
                this.dispatchEvent(this.hiddenElement, 'change');
            }
        }
    }
    updateTempValue() {
        if (!this.value) {
            this.tempValues = this.value;
        }
        else {
            this.tempValues = this.value.slice();
        }
    }
    getPagingCount() {
        let height = this.list.classList.contains(dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.offsetHeight / parseInt(height, 10));
    }
    pageUpSelection(steps) {
        let collection = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        let previousItem;
        previousItem = steps >= 0 ? collection[steps + 1] : collection[0];
        this.addListFocus(previousItem);
        this.scrollBottom(previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    }
    ;
    pageDownSelection(steps) {
        let list = this.getItems();
        let collection = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        let previousItem;
        previousItem = steps <= collection.length ? collection[steps - 1] : collection[collection.length - 1];
        this.addListFocus(previousItem);
        this.scrollBottom(previousItem, this.getIndexByValue(previousItem.getAttribute('data-value')));
    }
    getItems() {
        if (!this.list) {
            super.render();
        }
        return this.ulElement && this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li).length > 0 ?
            this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')') : [];
    }
    focusInHandler(e) {
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
                let args = { isInteracted: e ? true : false, event: e };
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
    }
    showDelimWrapper() {
        if (this.mode === 'CheckBox') {
            this.viewWrapper.style.display = '';
        }
        else {
            this.delimiterWrapper.style.display = '';
        }
        this.componentWrapper.classList.add(DELIMITER_VIEW_WRAPPER);
    }
    hideDelimWrapper() {
        this.delimiterWrapper.style.display = 'none';
        this.componentWrapper.classList.remove(DELIMITER_VIEW_WRAPPER);
    }
    expandTextbox() {
        let size = 5;
        if (this.placeholder) {
            size = size > this.inputElement.placeholder.length ? size : this.inputElement.placeholder.length;
        }
        if (this.inputElement.value.length > size) {
            this.inputElement.size = this.inputElement.value.length;
        }
        else {
            this.inputElement.size = size;
        }
    }
    isPopupOpen() {
        return ((this.popupWrapper !== null) && (this.popupWrapper.parentElement !== null));
    }
    refreshPopup() {
        if (this.popupObj && this.mobFilter) {
            this.popupObj.setProperties({ width: this.calcPopupWidth() });
            this.popupObj.refreshPosition(this.overAllWrapper);
            this.popupObj.resolveCollision();
        }
    }
    checkTextLength() {
        return this.targetElement().length < 1;
    }
    popupKeyActions(e) {
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
    }
    updateAriaAttribute() {
        let focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(focusedItem)) {
            this.inputElement.setAttribute('aria-activedescendant', focusedItem.id);
        }
    }
    homeNavigation(isHome) {
        this.removeFocus();
        let scrollEle = this.ulElement.querySelectorAll('li.' + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (scrollEle.length > 0) {
            let element = scrollEle[(isHome) ? 0 : (scrollEle.length - 1)];
            element.classList.add(dropDownBaseClasses.focus);
            this.scrollBottom(element);
        }
    }
    onKeyDown(e) {
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
            let focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
            let activeIndex;
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
    }
    arrowDown(e) {
        e.preventDefault();
        this.moveByList(1);
        this.keyAction = true;
        if (document.activeElement.classList.contains('e-input-filter')
            || (this.mode === 'CheckBox' && !this.allowFiltering && document.activeElement !== this.list)) {
            this.list.focus();
            EventHandler.add(this.list, 'keydown', this.onKeyDown, this);
        }
        this.updateAriaAttribute();
    }
    arrowUp(e) {
        e.preventDefault();
        this.keyAction = true;
        let list = this.list.querySelectorAll('li.'
            + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            list = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
        }
        let focuseElem = this.list.querySelector('li.' + dropDownBaseClasses.focus);
        let index = Array.prototype.slice.call(list).indexOf(focuseElem);
        if (index <= 0 && (this.mode === 'CheckBox' && this.allowFiltering)) {
            this.keyAction = false;
            this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus' });
        }
        else {
            this.list.focus();
        }
        this.moveByList(-1);
        this.updateAriaAttribute();
    }
    spaceKeySelection(e) {
        if (this.mode === 'CheckBox') {
            if (!document.activeElement.classList.contains('e-input-filter')) {
                e.preventDefault();
                this.keyAction = true;
                this.list.focus();
            }
            this.selectByKey(e);
        }
        this.checkPlaceholderSize();
    }
    checkBackCommand(e) {
        if (e.keyCode === 8 && this.targetElement() === '') {
            this.backCommand = false;
        }
        else {
            this.backCommand = true;
        }
    }
    keyNavigation(e) {
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
                let temp = this.value[this.value.length - 1];
                this.removeValue(temp, e);
                this.updateDelimeter(this.delimiterChar, e);
                this.focusAtLastListItem(temp);
            }
        }
    }
    selectByKey(e) {
        this.removeChipSelection();
        this.selectListByKey(e);
        if (this.hideSelectedItem) {
            this.focusAtFirstListItem();
        }
    }
    escapeAction() {
        let temp = this.tempValues ? this.tempValues.slice() : [];
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
    }
    scrollBottom(selectedLI, activeIndex) {
        let currentOffset = this.list.offsetHeight;
        let nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        let nextOffset = this.list.scrollTop + nextBottom - currentOffset;
        let boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
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
    }
    scrollTop(selectedLI, activeIndex) {
        let nextOffset = selectedLI.offsetTop - this.list.scrollTop;
        let nextBottom = selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop;
        nextOffset = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
            nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
        let boxRange = (selectedLI.offsetTop + selectedLI.offsetHeight - this.list.scrollTop);
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
    }
    selectListByKey(e) {
        let li = this.list.querySelector('li.' + dropDownBaseClasses.focus);
        let limit = this.value && this.value.length ? this.value.length : 0;
        let target;
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
    }
    refreshListItems(data) {
        if ((this.allowFiltering || (this.mode === 'CheckBox' && this.enableSelectionOrder === true)
            || this.allowCustomValue) && this.mainList && this.listData) {
            let list;
            list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            this.onActionComplete(list, this.mainData);
            this.focusAtLastListItem(data);
            if (this.value && this.value.length) {
                this.refreshSelection();
            }
        }
    }
    removeSelectedChip(e) {
        let selectedElem = this.chipCollectionWrapper.querySelector('span.' + CHIP_SELECTED);
        let temp;
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
    }
    moveByTop(state) {
        let elements = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        let index;
        if (elements.length > 1) {
            this.removeFocus();
            index = state ? 0 : (elements.length - 1);
            this.addListFocus(elements[index]);
            this.scrollBottom(elements[index], index);
        }
        this.updateAriaAttribute();
    }
    moveByList(position) {
        if (this.list) {
            let elements = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li
                + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            if (this.mode === 'CheckBox' && this.enableGroupCheckBox && !isNullOrUndefined(this.fields.groupBy)) {
                elements = this.list.querySelectorAll('li.'
                    + dropDownBaseClasses.li + ',li.' + dropDownBaseClasses.group
                    + ':not(.' + HIDE_LIST + ')' + ':not(.e-reorder-hide)');
            }
            let selectedElem = this.list.querySelector('li.' + dropDownBaseClasses.focus);
            let temp = -1;
            if (elements.length) {
                for (let index = 0; index < elements.length; index++) {
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
    }
    updateCheck(element) {
        if (this.mode === 'CheckBox' && this.enableGroupCheckBox &&
            !isNullOrUndefined(this.fields.groupBy)) {
            let checkElement = element.firstElementChild.lastElementChild;
            if (checkElement.classList.contains('e-check')) {
                element.classList.add('e-active');
            }
            else {
                element.classList.remove('e-active');
            }
        }
    }
    moveBy(position, e) {
        let elements;
        let selectedElem;
        let temp;
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
    }
    chipClick(e) {
        if (this.enabled) {
            let elem = closest(e.target, '.' + CHIP$1);
            this.removeChipSelection();
            this.addChipSelection(elem, e);
        }
    }
    removeChipSelection() {
        if (this.chipCollectionWrapper) {
            this.removeChipFocus();
        }
    }
    addChipSelection(element, e) {
        addClass([element], CHIP_SELECTED);
        this.trigger('chipSelection', e);
    }
    onChipRemove(e) {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        if (this.enabled && !this.readonly) {
            let element = e.target.parentElement;
            let customVal = element.getAttribute('data-value');
            let value = this.getFormattedValue(customVal);
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
                let list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
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
    }
    makeTextBoxEmpty() {
        this.inputElement.value = '';
        this.refreshPlaceHolder();
    }
    refreshPlaceHolder() {
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
    }
    removeValue(value, eve, length, isClearAll) {
        let index = this.value.indexOf(this.getFormattedValue(value));
        if (index === -1 && this.allowCustomValue && !isNullOrUndefined(value)) {
            index = this.value.indexOf(value.toString());
        }
        let targetEle = eve && eve.target;
        isClearAll = (isClearAll || targetEle && targetEle.classList.contains('e-close-hooker')) ? true : null;
        let className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (index !== -1) {
            let element = this.findListElement(this.list, 'li', 'data-value', value);
            let val = this.getDataByValue(value);
            let eventArgs = {
                e: eve,
                item: element,
                itemData: val,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('removing', eventArgs, (eventArgs) => {
                if (eventArgs.cancel) {
                    this.removeIndex++;
                }
                else {
                    let removeVal = this.value.slice(0);
                    removeVal.splice(index, 1);
                    if (isBlazor() && this.isServerRendered) {
                        let removedValues = [].concat([], removeVal);
                        this.setProperties({ value: removedValues.length === 0 ? null : removedValues }, true);
                    }
                    else {
                        this.setProperties({ value: [].concat([], removeVal) }, true);
                    }
                    if (element !== null) {
                        let hideElement = this.findListElement(this.mainList, 'li', 'data-value', value);
                        element.setAttribute('aria-selected', 'false');
                        removeClass([element], className);
                        if (hideElement) {
                            hideElement.setAttribute('aria-selected', 'false');
                            removeClass([element, hideElement], className);
                        }
                        this.notify('activeList', {
                            module: 'CheckBoxSelection',
                            enable: this.mode === 'CheckBox', li: element,
                            e: this, index: index
                        });
                        this.notify('updatelist', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', li: element, e: eve });
                        attributes(this.inputElement, { 'aria-activedescendant': element.id });
                        if ((this.value && this.value.length !== this.mainData.length)
                            && (this.mode === 'CheckBox' && this.showSelectAll)) {
                            this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                                enable: this.mode === 'CheckBox',
                                value: 'uncheck' });
                        }
                    }
                    if (this.hideSelectedItem && this.fields.groupBy) {
                        this.hideGroupItem(value);
                    }
                    this.updateMainList(true, value);
                    this.removeChip(value);
                    this.updateChipStatus();
                    let limit = this.value && this.value.length ? this.value.length : 0;
                    if (limit < this.maximumSelectionLength) {
                        let collection = this.list.querySelectorAll('li.'
                            + dropDownBaseClasses.li + ':not(.e-active)');
                        removeClass(collection, 'e-disable');
                    }
                    this.trigger('removed', eventArgs);
                    let targetEle = eve && eve.currentTarget;
                    let isSelectAll = (targetEle && targetEle.classList.contains('e-selectall-parent')) ? true : null;
                    if (!this.changeOnBlur && !isClearAll && (eve && length && !isSelectAll)) {
                        this.updateValueState(eve, this.value, this.tempValues);
                    }
                    if (length) {
                        this.selectAllEventData.push(val);
                        this.selectAllEventEle.push(element);
                    }
                    if (length === 1) {
                        if (!this.changeOnBlur) {
                            this.updateValueState(eve, this.value, this.tempValues);
                        }
                        let args = {
                            event: eve,
                            items: this.selectAllEventEle,
                            itemData: this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: false
                        };
                        this.trigger('selectedAll', args);
                        this.selectAllEventData = [];
                        this.selectAllEventEle = [];
                    }
                    if (isClearAll && (length === 1 || length === null)) {
                        this.clearAllCallback(eve, isClearAll);
                    }
                    if (isBlazor() && this.isServerRendered && (isNullOrUndefined(this.value) || this.value.length === 0)) {
                        this.updatedataValueItems(eve);
                    }
                }
            });
        }
    }
    updateMainList(state, value) {
        if (this.allowFiltering || this.mode === 'CheckBox') {
            let element2 = this.findListElement(this.mainList, 'li', 'data-value', value);
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
    }
    removeChip(value) {
        if (this.chipCollectionWrapper) {
            let element = this.findListElement(this.chipCollectionWrapper, 'span', 'data-value', value);
            if (element) {
                remove(element);
            }
        }
    }
    setWidth(width) {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.overAllWrapper.style.width = formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.overAllWrapper.style.width = (width.match(/px|%|em/)) ? (width) : (formatUnit(width));
            }
        }
    }
    updateChipStatus() {
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
    }
    addValue(value, text, eve) {
        if (!this.value) {
            this.value = [];
        }
        if (this.value.indexOf(value) < 0) {
            this.setProperties({ value: [].concat([], this.value, [value]) }, true);
        }
        let element = this.findListElement(this.list, 'li', 'data-value', value);
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
    }
    checkMaxSelection() {
        let limit = this.value && this.value.length ? this.value.length : 0;
        if (limit === this.maximumSelectionLength) {
            let collection = this.list.querySelectorAll('li.'
                + dropDownBaseClasses.li + ':not(.e-active)');
            addClass(collection, 'e-disable');
        }
    }
    dispatchSelect(value, eve, element, isNotTrigger, length) {
        let list = this.listData;
        if (this.initStatus && !isNotTrigger) {
            let val = this.getDataByValue(value);
            let eventArgs = {
                e: eve,
                item: element,
                itemData: val,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel) {
                    if (length) {
                        this.selectAllEventData.push(val);
                        this.selectAllEventEle.push(element);
                    }
                    if (length === 1) {
                        let args = {
                            event: eve,
                            items: this.selectAllEventEle,
                            itemData: this.selectAllEventData,
                            isInteracted: eve ? true : false,
                            isChecked: true
                        };
                        this.trigger('selectedAll', args);
                        this.selectAllEventData = [];
                    }
                    if (this.allowCustomValue && this.isServerRendered && this.listData !== list) {
                        this.listData = list;
                    }
                    this.updateListSelectEventCallback(value, element, eve);
                }
            });
        }
    }
    addChip(text, value, e) {
        if (this.chipCollectionWrapper) {
            this.getChip(text, value, e);
        }
    }
    removeChipFocus() {
        let elements;
        let closeElements;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP$1);
        closeElements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP_CLOSE$1.split(' ')[0]);
        removeClass(elements, CHIP_SELECTED);
        if (Browser.isDevice) {
            for (let index = 0; index < closeElements.length; index++) {
                closeElements[index].style.display = 'none';
            }
        }
    }
    onMobileChipInteraction(e) {
        let chipElem = closest(e.target, '.' + CHIP$1);
        let chipClose = chipElem.querySelector('span.' + CHIP_CLOSE$1.split(' ')[0]);
        if (this.enabled && !this.readonly) {
            if (!chipElem.classList.contains(CHIP_SELECTED)) {
                this.removeChipFocus();
                chipClose.style.display = '';
                chipElem.classList.add(CHIP_SELECTED);
            }
            this.refreshPopup();
            e.preventDefault();
        }
    }
    multiCompiler(multiselectTemplate) {
        let checkTemplate = false;
        if (multiselectTemplate) {
            try {
                checkTemplate = (select(multiselectTemplate, document).length) ? true : false;
            }
            catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    }
    getChip(data, value, e) {
        let itemData = { text: value, value: value };
        let chip = this.createElement('span', {
            className: CHIP$1,
            attrs: { 'data-value': value, 'title': data }
        });
        let compiledString;
        let chipContent = this.createElement('span', { className: CHIP_CONTENT$1 });
        let chipClose = this.createElement('span', { className: CHIP_CLOSE$1 });
        if (this.mainData) {
            itemData = (isBlazor() && this.isServerRendered) ? JSON.parse(JSON.stringify(this.getDataByValue(value)))
                : this.getDataByValue(value);
        }
        if (this.valueTemplate && !isNullOrUndefined(itemData)) {
            let valuecheck = this.multiCompiler(this.valueTemplate);
            if (valuecheck) {
                compiledString = compile(select(this.valueTemplate, document).innerHTML.trim());
            }
            else {
                compiledString = compile(this.valueTemplate);
            }
            // tslint:disable-next-line
            let valueCompTemp = compiledString(itemData, this, 'valueTemplate', this.valueTemplateId, this.isStringTemplate, null, chipContent);
            if (valueCompTemp && valueCompTemp.length > 0) {
                for (let i = 0; i < valueCompTemp.length; i++) {
                    chipContent.appendChild(valueCompTemp[i]);
                }
            }
            this.renderReactTemplates();
            this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, false, false, false);
        }
        else if (this.enableHtmlSanitizer) {
            chipContent.innerText = data;
        }
        else {
            chipContent.innerHTML = data;
        }
        chip.appendChild(chipContent);
        let eventArgs = {
            isInteracted: e ? true : false,
            itemData: itemData,
            e: e,
            setClass: (classes) => {
                addClass([chip], classes);
            },
            cancel: false
        };
        this.trigger('tagging', eventArgs, (eventArgs) => {
            if (!eventArgs.cancel) {
                if (eventArgs.setClass && typeof eventArgs.setClass === 'string' && (isBlazor() && this.isServerRendered)) {
                    addClass([chip], eventArgs.setClass);
                }
                if (Browser.isDevice) {
                    chip.classList.add(MOBILE_CHIP);
                    append([chipClose], chip);
                    chipClose.style.display = 'none';
                    EventHandler.add(chip, 'click', this.onMobileChipInteraction, this);
                }
                else {
                    EventHandler.add(chip, 'mousedown', this.chipClick, this);
                    if (this.showClearButton) {
                        chip.appendChild(chipClose);
                    }
                }
                EventHandler.add(chipClose, 'mousedown', this.onChipRemove, this);
                this.chipCollectionWrapper.appendChild(chip);
                if (!this.changeOnBlur && e) {
                    this.updateValueState(e, this.value, this.tempValues);
                }
            }
        });
    }
    calcPopupWidth() {
        let width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            let inputWidth = (this.componentWrapper.offsetWidth) * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    mouseIn() {
        if (this.enabled && !this.readonly) {
            this.showOverAllClear();
        }
    }
    mouseOut() {
        if (!this.inputFocus) {
            this.overAllClear.style.display = 'none';
        }
    }
    listOption(dataSource, fields) {
        let iconCss = isNullOrUndefined(fields.iconCss) ? false : true;
        let fieldProperty = isNullOrUndefined(fields.properties) ? fields :
            fields.properties;
        this.listCurrentOptions = (fields.text !== null || fields.value !== null) ? {
            fields: fieldProperty, showIcon: iconCss, ariaAttributes: { groupItemRole: 'presentation' }
        } : { fields: { value: 'text' } };
        extend(this.listCurrentOptions, this.listCurrentOptions, fields, true);
        if (this.mode === 'CheckBox') {
            this.notify('listoption', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', dataSource, fieldProperty });
        }
        return this.listCurrentOptions;
    }
    renderPopup() {
        if (!this.list) {
            super.render();
        }
        if (!this.popupObj) {
            document.body.appendChild(this.popupWrapper);
            let checkboxFilter = this.popupWrapper.querySelector('.' + FILTERPARENT);
            if (this.mode === 'CheckBox' && !this.allowFiltering && checkboxFilter && this.filterParent) {
                checkboxFilter.remove();
                this.filterParent = null;
            }
            let overAllHeight = parseInt(this.popupHeight, 10);
            this.popupWrapper.style.visibility = 'hidden';
            if (this.headerTemplate) {
                this.setHeaderTemplate();
                overAllHeight -= this.header.offsetHeight;
            }
            append([this.list], this.popupWrapper);
            if (this.footerTemplate) {
                this.setFooterTemplate();
                overAllHeight -= this.footer.offsetHeight;
            }
            if (this.mode === 'CheckBox' && this.showSelectAll) {
                this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                overAllHeight -= this.selectAllHeight;
            }
            else if (this.mode === 'CheckBox' && !this.showSelectAll && (!this.headerTemplate && !this.footerTemplate)) {
                this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                overAllHeight = parseInt(this.popupHeight, 10);
            }
            else if (this.mode === 'CheckBox' && !this.showSelectAll) {
                this.notify('selectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                overAllHeight = parseInt(this.popupHeight, 10);
                if (this.headerTemplate && this.header) {
                    overAllHeight -= this.header.offsetHeight;
                }
                if (this.footerTemplate && this.footer) {
                    overAllHeight -= this.footer.offsetHeight;
                }
            }
            if (this.mode === 'CheckBox') {
                let args = {
                    module: 'CheckBoxSelection',
                    enable: this.mode === 'CheckBox',
                    popupElement: this.popupWrapper
                };
                if (this.allowFiltering) {
                    this.notify('searchBox', args);
                    overAllHeight -= this.searchBoxHeight;
                }
                addClass([this.popupWrapper], 'e-checkbox');
            }
            if (this.popupHeight !== 'auto') {
                this.list.style.maxHeight = formatUnit(overAllHeight);
                this.popupWrapper.style.maxHeight = formatUnit(this.popupHeight);
            }
            else {
                this.list.style.maxHeight = formatUnit(this.popupHeight);
            }
            this.popupObj = new Popup(this.popupWrapper, {
                width: this.calcPopupWidth(), targetType: 'relative', position: { X: 'left', Y: 'bottom' },
                relateTo: this.overAllWrapper, collision: { X: 'flip', Y: 'flip' }, offsetY: 1,
                enableRtl: this.enableRtl, zIndex: this.zIndex,
                close: () => {
                    if (this.popupObj.element.parentElement) {
                        this.popupObj.unwireScrollEvents();
                        detach(this.popupObj.element);
                    }
                },
                open: () => {
                    this.popupObj.resolveCollision();
                    if (!this.isFirstClick) {
                        let ulElement = this.list.querySelector('ul');
                        if (ulElement) {
                            if (this.itemTemplate && (isBlazor() && this.isServerRendered)) {
                                setTimeout(() => { this.mainList = this.ulElement; }, 0);
                            }
                            else if (!(this.mode !== 'CheckBox' && (this.allowFiltering || this.allowCustomValue) &&
                                this.targetElement().trim() !== '')) {
                                this.mainList = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                            }
                        }
                        this.isFirstClick = true;
                    }
                    this.popupObj.wireScrollEvents();
                    if (!(this.mode !== 'CheckBox' && (this.allowFiltering || this.allowCustomValue) &&
                        this.targetElement().trim() !== '')) {
                        this.loadTemplate();
                    }
                    this.setScrollPosition();
                    if (this.allowFiltering) {
                        this.notify('inputFocus', {
                            module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus'
                        });
                    }
                }, targetExitViewport: () => {
                    if (!Browser.isDevice) {
                        this.hidePopup();
                    }
                }
            });
            if (this.mode === 'CheckBox' && Browser.isDevice && this.allowFiltering) {
                this.notify('deviceSearchBox', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
            }
            this.popupObj.close();
            this.popupWrapper.style.visibility = '';
        }
    }
    setHeaderTemplate() {
        let compiledString;
        if (this.header) {
            this.header.remove();
        }
        this.header = this.createElement('div');
        addClass([this.header], HEADER$1);
        let headercheck = this.multiCompiler(this.headerTemplate);
        if (headercheck) {
            compiledString = compile(select(this.headerTemplate, document).innerHTML.trim());
        }
        else {
            compiledString = compile(this.headerTemplate);
        }
        // tslint:disable-next-line
        let elements = compiledString({}, this, 'headerTemplate', this.headerTemplateId, this.isStringTemplate, null, this.header);
        if (elements && elements.length > 0) {
            for (let temp = 0; temp < elements.length; temp++) {
                this.header.appendChild(elements[temp]);
            }
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        if (this.mode === 'CheckBox' && this.showSelectAll) {
            prepend([this.header], this.popupWrapper);
        }
        else {
            append([this.header], this.popupWrapper);
        }
        EventHandler.add(this.header, 'mousedown', this.onListMouseDown, this);
    }
    setFooterTemplate() {
        let compiledString;
        if (this.footer) {
            this.footer.remove();
        }
        this.footer = this.createElement('div');
        addClass([this.footer], FOOTER$1);
        let footercheck = this.multiCompiler(this.footerTemplate);
        if (footercheck) {
            compiledString = compile(select(this.footerTemplate, document).innerHTML.trim());
        }
        else {
            compiledString = compile(this.footerTemplate);
        }
        // tslint:disable-next-line
        let elements = compiledString({}, this, 'footerTemplate', this.footerTemplateId, this.isStringTemplate, null, this.footer);
        if (elements && elements.length > 0) {
            for (let temp = 0; temp < elements.length; temp++) {
                this.footer.appendChild(elements[temp]);
            }
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        append([this.footer], this.popupWrapper);
        EventHandler.add(this.footer, 'mousedown', this.onListMouseDown, this);
    }
    ClearAll(e) {
        if (this.enabled && !this.readonly) {
            let temp;
            if (this.value && this.value.length > 0) {
                let liElement = this.list && this.list.querySelectorAll('li.e-list-item');
                if (liElement && liElement.length > 0) {
                    this.selectAllItems(false, e);
                }
                else {
                    this.removeIndex = 0;
                    for (temp = this.value[this.removeIndex]; this.removeIndex < this.value.length; temp = this.value[this.removeIndex]) {
                        this.removeValue(temp, e, null, true);
                        if (this.value === null && isBlazor() && this.isServerRendered) {
                            break;
                        }
                    }
                }
            }
            else {
                this.clearAllCallback(e);
            }
        }
    }
    clearAllCallback(e, isClearAll) {
        let tempValues = this.value ? this.value.slice() : [];
        if (this.mainList && this.listData && ((this.allowFiltering && this.mode !== 'CheckBox') || this.allowCustomValue)) {
            let list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
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
    }
    windowResize() {
        this.refreshPopup();
        if ((!this.inputFocus || this.mode === 'CheckBox') && this.viewWrapper && this.viewWrapper.parentElement) {
            this.updateDelimView();
        }
    }
    resetValueHandler(e) {
        let formElement = closest(this.inputElement, 'form');
        if (formElement && e.target === formElement) {
            let textVal = (this.element.tagName === this.getNgDirective()) ? null : this.element.getAttribute('data-initial-value');
            this.text = textVal;
        }
    }
    wireEvent() {
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
        let formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        EventHandler.add(this.componentWrapper, 'mouseout', this.mouseOut, this);
        EventHandler.add(this.overAllClear, 'mouseup', this.ClearAll, this);
        EventHandler.add(this.inputElement, 'paste', this.pasteHandler, this);
    }
    onInput(e) {
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
    }
    pasteHandler(event) {
        setTimeout(() => {
            this.search(event);
        });
    }
    search(e) {
        if (!this.isPopupOpen() && this.openOnClick) {
            this.showPopup();
        }
        this.openClick(e);
        if (this.checkTextLength() && !this.allowFiltering && (e.keyCode !== 8)) {
            this.focusAtFirstListItem();
        }
        else {
            let text = this.targetElement();
            this.keyCode = e.keyCode;
            if (this.allowFiltering) {
                let eventArgs = {
                    preventDefaultAction: false,
                    text: this.targetElement(),
                    updateData: (dataSource, query, fields) => {
                        if (eventArgs.cancel) {
                            return;
                        }
                        this.isFiltered = true;
                        this.remoteFilterAction = true;
                        this.dataUpdater(dataSource, query, fields);
                    },
                    event: e,
                    cancel: false
                };
                this.trigger('filtering', eventArgs, (eventArgs) => {
                    if (!eventArgs.cancel) {
                        if (!this.isFiltered && !eventArgs.preventDefaultAction) {
                            this.filterAction = true;
                            this.dataUpdater(this.dataSource, null, this.fields);
                        }
                    }
                });
            }
            else if (this.allowCustomValue) {
                let query = new Query();
                query = (text !== '') ? query.where(this.fields.text, 'startswith', text, this.ignoreCase, this.ignoreAccent) : query;
                this.dataUpdater(this.mainData, query, this.fields);
            }
            else {
                let liCollections;
                liCollections = this.list.querySelectorAll('li.' + dropDownBaseClasses.li + ':not(.e-hide-listitem)');
                let activeElement = Search(this.targetElement(), liCollections, 'StartsWith', this.ignoreCase);
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
    }
    preRender() {
        if (this.allowFiltering === null) {
            this.allowFiltering = (this.mode === 'CheckBox') ? true : false;
        }
        this.initializeData();
        this.updateDataAttribute(this.htmlAttributes);
        super.preRender();
    }
    getLocaleName() {
        return 'multi-select';
    }
    ;
    initializeData() {
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
    }
    updateData(delimiterChar, e) {
        let data = '';
        let delim = this.mode === 'Delimiter' || this.mode === 'CheckBox';
        let text = [];
        let temp;
        let tempData = this.listData;
        this.listData = this.mainData;
        this.hiddenElement.innerHTML = '';
        if (!isNullOrUndefined(this.value)) {
            for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
                let listValue = this.findListElement(((!isNullOrUndefined(this.mainList)) ? this.mainList : this.ulElement), 'li', 'data-value', this.value[index]);
                if (!(isBlazor() && this.isServerRendered) && isNullOrUndefined(listValue) && !this.allowCustomValue) {
                    this.value.splice(index, 1);
                    index -= 1;
                }
                else {
                    if (this.listData) {
                        temp = this.getTextByValue(this.value[index]);
                    }
                    else {
                        temp = this.value[index];
                    }
                    data += temp + delimiterChar + ' ';
                    text.push(temp);
                }
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[index] + '">' + index + '</option>';
            }
        }
        this.setProperties({ text: text.toString() }, true);
        if (delim) {
            this.updateWrapperText(this.delimiterWrapper, data);
            this.delimiterWrapper.setAttribute('id', getUniqueID('delim_val'));
            this.inputElement.setAttribute('aria-describedby', this.delimiterWrapper.id);
        }
        let targetEle = e && e.target;
        let isClearAll = (targetEle && targetEle.classList.contains('e-close-hooker')) ? true : null;
        if (!this.changeOnBlur && ((e && !isClearAll)) || this.isSelectAll) {
            this.isSelectAll = false;
            this.updateValueState(e, this.value, this.tempValues);
        }
        this.listData = tempData;
        this.addValidInputClass();
    }
    initialTextUpdate() {
        if (!isNullOrUndefined(this.text)) {
            let textArr = this.text.split(this.delimiterChar);
            let textVal = [];
            for (let index = 0; textArr.length > index; index++) {
                let val = this.getValueByText(textArr[index]);
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
    }
    renderList(isEmptyData) {
        if (!isEmptyData && this.allowCustomValue && this.list && (this.list.textContent === this.noRecordsTemplate
            || this.list.querySelector('.e-ul') && this.list.querySelector('.e-ul').childElementCount === 0)) {
            isEmptyData = true;
        }
        super.render(isEmptyData);
        this.unwireListEvents();
        this.wireListEvents();
    }
    initialValueUpdate() {
        if (this.list) {
            let text;
            let element;
            let value;
            if (this.chipCollectionWrapper) {
                this.chipCollectionWrapper.innerHTML = '';
            }
            this.removeListSelection();
            if (!isNullOrUndefined(this.value)) {
                for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
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
                        let indexItem = this.listData.length;
                        let newValue = {};
                        setValue(this.fields.text, value, newValue);
                        setValue(this.fields.value, value, newValue);
                        let noDataEle = this.popupWrapper.querySelector('.' + dropDownBaseClasses.noData);
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
    }
    updateActionCompleteData(li, item) {
        if (this.value && this.value.indexOf(li.getAttribute('data-value')) > -1) {
            this.mainList = this.ulElement;
            addClass([li], HIDE_LIST);
        }
    }
    updateAddItemList(list, itemCount) {
        if (this.popupObj && this.popupObj.element && this.popupObj.element.querySelector('.' + dropDownBaseClasses.noData) && list) {
            this.list = list;
            this.mainList = this.ulElement = list.querySelector('ul');
            remove(this.popupWrapper.querySelector('.e-content'));
            this.popupObj = null;
            this.renderPopup();
        }
    }
    updateDataList() {
        if (this.mainList && this.ulElement && this.mainList.childElementCount < this.ulElement.childElementCount) {
            this.mainList = this.ulElement.cloneNode ? this.ulElement.cloneNode(true) : this.ulElement;
        }
    }
    isValidLI(li) {
        return (li && !li.classList.contains(dropDownBaseClasses.disabled) && !li.classList.contains(dropDownBaseClasses.group) &&
            li.classList.contains(dropDownBaseClasses.li));
    }
    ;
    updateListSelection(li, e, length) {
        let customVal = li.getAttribute('data-value');
        let value = this.getFormattedValue(customVal);
        if (this.allowCustomValue && ((customVal !== 'false' && value === false) ||
            (!isNullOrUndefined(value) && value.toString() === 'NaN'))) {
            value = customVal;
        }
        let text = this.getTextByValue(value);
        this.removeHover();
        if (!this.value || this.value.indexOf(value) === -1) {
            this.dispatchSelect(value, e, li, (li.getAttribute('aria-selected') === 'true'), length);
        }
        else {
            this.removeValue(value, e, length);
        }
    }
    updateListSelectEventCallback(value, li, e) {
        let text = this.getTextByValue(value);
        if ((this.allowCustomValue || this.allowFiltering) && !this.findListElement(this.mainList, 'li', 'data-value', value)) {
            let temp = li.cloneNode(true);
            let data = this.getDataByValue(value);
            let eventArgs = {
                newData: data,
                cancel: false
            };
            this.trigger('customValueSelection', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel) {
                    append([temp], this.mainList);
                    this.mainData.push(data);
                    this.remoteCustomValue = false;
                    this.addValue(value, text, e);
                    if (isBlazor() && this.isServerRendered) {
                        this.checkPlaceholderSize();
                        this.makeTextBoxEmpty();
                    }
                }
            });
        }
        else {
            this.remoteCustomValue = false;
            this.addValue(value, text, e);
        }
        if (isBlazor() && this.isServerRendered && this.value && this.list &&
            (this.value.length === this.list.querySelectorAll('li.e-list-item').length ||
                this.value.length === this.maximumSelectionLength)) {
            this.updatedataValueItems(e);
            this.checkPlaceholderSize();
        }
        if (isBlazor() && this.isServerRendered) {
            this.checkPlaceholderSize();
            this.makeTextBoxEmpty();
        }
    }
    removeListSelection() {
        let className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        let selectedItems = this.list.querySelectorAll('.' + className);
        let temp = selectedItems.length;
        if (selectedItems && selectedItems.length) {
            removeClass(selectedItems, className);
            while (temp > 0) {
                selectedItems[temp - 1].setAttribute('aria-selected', 'false');
                temp--;
            }
        }
        if (!isNullOrUndefined(this.mainList)) {
            let selectItems = this.mainList.querySelectorAll('.' + className);
            let temp1 = selectItems.length;
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
    }
    ;
    removeHover() {
        let hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    }
    ;
    removeFocus() {
        if (this.list && this.mainList) {
            let hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.focus);
            let mainlist = this.mainList.querySelectorAll('.' + dropDownBaseClasses.focus);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.focus);
                removeClass(mainlist, dropDownBaseClasses.focus);
            }
        }
    }
    ;
    addListHover(li) {
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
    }
    ;
    addListFocus(element) {
        if (this.enabled && this.isValidLI(element)) {
            this.removeFocus();
            addClass([element], dropDownBaseClasses.focus);
        }
        else {
            if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
                addClass([element], dropDownBaseClasses.focus);
            }
        }
    }
    addListSelection(element) {
        let className = this.hideSelectedItem ?
            HIDE_LIST :
            dropDownBaseClasses.selected;
        if (this.isValidLI(element) && !element.classList.contains(dropDownBaseClasses.hover)) {
            addClass([element], className);
            this.updateMainList(false, element.getAttribute('data-value'));
            element.setAttribute('aria-selected', 'true');
            if (this.mode === 'CheckBox') {
                let ariaCheck = element.firstElementChild.getAttribute('aria-checked');
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
    }
    updateDelimeter(delimChar, e) {
        this.updateData(delimChar, e);
    }
    onMouseClick(e) {
        this.scrollFocusStatus = false;
        let target = e.target;
        let li = closest(target, '.' + dropDownBaseClasses.li);
        let headerLi = closest(target, '.' + dropDownBaseClasses.group);
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
                let limit = this.value && this.value.length ? this.value.length : 0;
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
    }
    findGroupStart(target) {
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            let count = 0;
            let liChecked = 0;
            let liUnchecked = 0;
            let groupValues;
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
    }
    findGroupAttrtibutes(listElement, checked, unChecked, count, position) {
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
    }
    updateCheckBox(groupHeader, checked, unChecked, count) {
        if (groupHeader === null) {
            return;
        }
        let checkBoxElement = groupHeader.getElementsByClassName('e-frame')[0];
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
    }
    deselectHeader() {
        let limit = this.value && this.value.length ? this.value.length : 0;
        let collection = this.list.querySelectorAll('li.e-list-group-item:not(.e-active)');
        if (limit < this.maximumSelectionLength) {
            removeClass(collection, 'e-disable');
        }
        if (limit === this.maximumSelectionLength) {
            addClass(collection, 'e-disable');
        }
    }
    onMouseOver(e) {
        let currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
        if (currentLi === null && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)
            && this.enableGroupCheckBox) {
            currentLi = closest(e.target, '.' + dropDownBaseClasses.group);
        }
        this.addListHover(currentLi);
    }
    onMouseLeave(e) {
        this.removeHover();
    }
    onListMouseDown(e) {
        e.preventDefault();
        this.scrollFocusStatus = true;
    }
    onDocumentClick(e) {
        if (this.mode !== 'CheckBox') {
            let target = e.target;
            if (!(!isNullOrUndefined(this.popupObj) && closest(target, '[id="' + this.popupObj.element.id + '"]')) &&
                !this.overAllWrapper.contains(e.target)) {
                this.scrollFocusStatus = false;
            }
            else {
                this.scrollFocusStatus = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
            }
        }
    }
    wireListEvents() {
        EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        EventHandler.add(this.list, 'mousedown', this.onListMouseDown, this);
        EventHandler.add(this.list, 'mouseup', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    }
    ;
    unwireListEvents() {
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        if (this.list) {
            EventHandler.remove(this.list, 'mousedown', this.onListMouseDown);
            EventHandler.remove(this.list, 'mouseup', this.onMouseClick);
            EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
            EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
        }
    }
    ;
    hideOverAllClear() {
        if (!this.value || !this.value.length || this.inputElement.value === '') {
            this.overAllClear.style.display = 'none';
        }
    }
    showOverAllClear() {
        if (((this.value && this.value.length) || this.inputElement.value !== '') && this.showClearButton && this.readonly !== true) {
            this.overAllClear.style.display = '';
        }
        else {
            this.overAllClear.style.display = 'none';
        }
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.inputElement && this.enabled) {
            this.inputElement.blur();
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    showSpinner() {
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
    }
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    hideSpinner() {
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
    }
    updateWrapperText(wrapperType, wrapperData) {
        if (this.valueTemplate || !this.enableHtmlSanitizer) {
            wrapperType.innerHTML = wrapperData;
        }
        else {
            wrapperType.innerText = SanitizeHtmlHelper.sanitize(wrapperData);
        }
    }
    updateDelimView() {
        if (this.delimiterWrapper) {
            this.hideDelimWrapper();
        }
        if (this.chipCollectionWrapper) {
            this.chipCollectionWrapper.style.display = 'none';
        }
        this.viewWrapper.style.display = '';
        this.viewWrapper.style.width = '';
        this.viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER$1);
        if (this.value && this.value.length) {
            let data = '';
            let temp;
            let tempData;
            let tempIndex = 1;
            let wrapperleng;
            let remaining;
            let downIconWidth = 0;
            let overAllContainer;
            this.updateWrapperText(this.viewWrapper, data);
            let l10nLocale = {
                noRecordsTemplate: 'No records found',
                actionFailureTemplate: 'Request failed',
                overflowCountTemplate: '+${count} more..',
                totalCountTemplate: '${count} selected'
            };
            let l10n = new L10n(this.getLocaleName(), l10nLocale, this.locale);
            if (l10n.getConstant('actionFailureTemplate') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.locale);
            }
            if (l10n.getConstant('noRecordsTemplate') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.locale);
            }
            let remainContent = l10n.getConstant('overflowCountTemplate');
            let raminElement = this.createElement('span', {
                className: REMAIN_WRAPPER$1
            });
            let compiledString = compile(remainContent);
            let totalCompiledString = compile(l10n.getConstant('totalCountTemplate'));
            // tslint:disable-next-line
            let remainCompildTemp = compiledString({ 'count': this.value.length }, this, 'overflowCountTemplate', null, !this.isStringTemplate, null, raminElement);
            if (remainCompildTemp && remainCompildTemp.length > 0) {
                raminElement.appendChild(remainCompildTemp[0]);
            }
            this.viewWrapper.appendChild(raminElement);
            this.renderReactTemplates();
            let remainSize = raminElement.offsetWidth;
            remove(raminElement);
            if (this.showDropDownIcon) {
                downIconWidth = this.dropIcon.offsetWidth + parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            }
            this.checkClearIconWidth();
            if (!isNullOrUndefined(this.value)) {
                for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
                    data += (index === 0) ? '' : this.delimiterChar + ' ';
                    temp = this.getOverflowVal(index);
                    data += temp;
                    temp = this.viewWrapper.innerHTML;
                    this.updateWrapperText(this.viewWrapper, data);
                    wrapperleng = this.viewWrapper.offsetWidth +
                        parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
                    overAllContainer = this.componentWrapper.offsetWidth -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
                        parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
                    if ((wrapperleng + downIconWidth + this.clearIconWidth) > overAllContainer) {
                        if (tempData !== undefined && tempData !== '') {
                            temp = tempData;
                            index = tempIndex + 1;
                        }
                        this.updateWrapperText(this.viewWrapper, temp);
                        remaining = this.value.length - index;
                        wrapperleng = this.viewWrapper.offsetWidth +
                            parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
                        while (((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) > overAllContainer) && wrapperleng !== 0
                            && this.viewWrapper.innerHTML !== '') {
                            let textArr = this.viewWrapper.innerHTML.split(this.delimiterChar);
                            textArr.pop();
                            this.viewWrapper.innerHTML = textArr.join(this.delimiterChar);
                            remaining++;
                            wrapperleng = this.viewWrapper.offsetWidth +
                                parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
                        }
                        break;
                    }
                    else if ((wrapperleng + remainSize + downIconWidth + this.clearIconWidth) <= overAllContainer) {
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
                let totalWidth = overAllContainer - downIconWidth - this.clearIconWidth;
                this.viewWrapper.appendChild(this.updateRemainTemplate(raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth));
                this.updateRemainWidth(this.viewWrapper, totalWidth);
                this.updateRemainingText(raminElement, downIconWidth, remaining, compiledString, totalCompiledString);
            }
        }
        else {
            this.viewWrapper.innerHTML = '';
            this.viewWrapper.style.display = 'none';
        }
    }
    checkClearIconWidth() {
        if (this.showClearButton) {
            this.clearIconWidth = this.overAllClear.offsetWidth;
        }
    }
    updateRemainWidth(viewWrapper, totalWidth) {
        if (viewWrapper.classList.contains(TOTAL_COUNT_WRAPPER$1) && totalWidth < (viewWrapper.offsetWidth +
            parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10)
            + parseInt(window.getComputedStyle(viewWrapper).paddingLeft, 10))) {
            viewWrapper.style.width = totalWidth + 'px';
        }
    }
    updateRemainTemplate(raminElement, viewWrapper, remaining, compiledString, totalCompiledString, totalWidth) {
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3 && viewWrapper.firstChild.nodeValue === '') {
            viewWrapper.removeChild(viewWrapper.firstChild);
        }
        raminElement.innerHTML = '';
        // tslint:disable-next-line
        let remainTemp = compiledString({ 'count': remaining }, this, 'overflowCountTemplate', null, !this.isStringTemplate, null, raminElement);
        // tslint:disable-next-line
        let totalTemp = totalCompiledString({ 'count': remaining }, this, 'totalCountTemplate', null, !this.isStringTemplate, null, raminElement);
        raminElement.appendChild((viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) ?
            remainTemp && remainTemp[0] : totalTemp && totalTemp[0]);
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) {
            viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER$1);
        }
        else {
            viewWrapper.classList.add(TOTAL_COUNT_WRAPPER$1);
            this.updateRemainWidth(viewWrapper, totalWidth);
        }
        return raminElement;
    }
    updateRemainingText(raminElement, downIconWidth, remaining, compiledString, totalCompiledString) {
        let overAllContainer = this.componentWrapper.offsetWidth -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingLeft, 10) -
            parseInt(window.getComputedStyle(this.componentWrapper).paddingRight, 10);
        let wrapperleng = this.viewWrapper.offsetWidth + parseInt(window.getComputedStyle(this.viewWrapper).paddingRight, 10);
        if (((wrapperleng + downIconWidth) >= overAllContainer) && wrapperleng !== 0 && this.viewWrapper.firstChild &&
            this.viewWrapper.firstChild.nodeType === 3) {
            while (((wrapperleng + downIconWidth) > overAllContainer) && wrapperleng !== 0 && this.viewWrapper.firstChild &&
                this.viewWrapper.firstChild.nodeType === 3) {
                let textArr = this.viewWrapper.firstChild.nodeValue.split(this.delimiterChar);
                textArr.pop();
                this.viewWrapper.firstChild.nodeValue = textArr.join(this.delimiterChar);
                if (this.viewWrapper.firstChild.nodeValue === '') {
                    this.viewWrapper.removeChild(this.viewWrapper.firstChild);
                }
                remaining++;
                wrapperleng = this.viewWrapper.offsetWidth;
            }
            let totalWidth = overAllContainer - downIconWidth;
            this.updateRemainTemplate(raminElement, this.viewWrapper, remaining, compiledString, totalCompiledString, totalWidth);
        }
    }
    getOverflowVal(index) {
        let temp;
        if (this.mainData && this.mainData.length) {
            if (this.mode === 'CheckBox') {
                let newTemp = this.listData;
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
    }
    unWireEvent() {
        EventHandler.remove(this.componentWrapper, 'mousedown', this.wrapperClick);
        EventHandler.remove(window, 'resize', this.windowResize);
        EventHandler.remove(this.inputElement, 'focus', this.focusInHandler);
        EventHandler.remove(this.inputElement, 'keydown', this.onKeyDown);
        if (this.mode !== 'CheckBox') {
            EventHandler.remove(this.inputElement, 'input', this.onInput);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.KeyUp);
        let formElement = closest(this.inputElement, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        EventHandler.remove(this.inputElement, 'blur', this.onBlur);
        EventHandler.remove(this.componentWrapper, 'mousemove', this.mouseIn);
        EventHandler.remove(this.componentWrapper, 'mouseout', this.mouseOut);
        EventHandler.remove(this.overAllClear, 'mousedown', this.ClearAll);
        EventHandler.remove(this.inputElement, 'paste', this.pasteHandler);
    }
    selectAllItem(state, event, list) {
        let li;
        li = this.list.querySelectorAll(state ?
            'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
            'li.e-list-item[aria-selected="true"]:not(.e-reorder-hide)');
        if (this.value && this.value.length && this.isPopupOpen() && event && event.target
            && closest(event.target, '.e-close-hooker') && this.allowFiltering) {
            li = this.mainList.querySelectorAll(state ?
                'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
                'li.e-list-item[aria-selected="true"]:not(.e-reorder-hide)');
        }
        if (this.enableGroupCheckBox && this.mode === 'CheckBox' && !isNullOrUndefined(this.fields.groupBy)) {
            let target = (event ? event.target : null);
            target = (event && event.keyCode === 32) ? list : target;
            target = (target && target.classList.contains('e-frame')) ? target.parentElement.parentElement : target;
            if (target && target.classList.contains('e-list-group-item')) {
                let listElement = target.nextElementSibling;
                if (isNullOrUndefined(listElement)) {
                    return;
                }
                while (listElement.classList.contains('e-list-item')) {
                    if (state) {
                        if (!listElement.firstElementChild.lastElementChild.classList.contains('e-check')) {
                            let selectionLimit = this.value && this.value.length ? this.value.length : 0;
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
                    let focusedElement = this.list.getElementsByClassName('e-item-focus')[0];
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
    }
    updateValue(event, li, state) {
        let length = li.length;
        if (li && li.length) {
            let index = 0;
            let count = 0;
            if (this.enableGroupCheckBox) {
                count = state ? this.maximumSelectionLength - (this.value ? this.value.length : 0) : li.length;
            }
            else {
                count = state ? this.maximumSelectionLength - (this.value ? this.value.length : 0) : this.maximumSelectionLength;
            }
            while (index < length && index <= 50 && index < count) {
                this.updateListSelection(li[index], event, length - index);
                this.findGroupStart(li[index]);
                index++;
            }
            if (length > 50) {
                setTimeout(() => {
                    while (index < length && index < count) {
                        this.updateListSelection(li[index], event, length - index);
                        this.findGroupStart(li[index]);
                        index++;
                    }
                    if (!(isBlazor() && this.isServerRendered)) {
                        this.updatedataValueItems(event);
                    }
                }, 0);
            }
        }
        if (!(isBlazor() && this.isServerRendered)) {
            this.updatedataValueItems(event);
            this.checkPlaceholderSize();
        }
    }
    updatedataValueItems(event) {
        this.deselectHeader();
        this.textboxValueUpdate(event);
    }
    textboxValueUpdate(event) {
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
    }
    setZIndex() {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    }
    updateDataSource(prop) {
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
    }
    onLoadSelect() {
        this.setDynValue = true;
        this.renderPopup();
    }
    selectAllItems(state, event) {
        if (isNullOrUndefined(this.list)) {
            this.selectAllAction = () => {
                if (this.mode === 'CheckBox' && this.showSelectAll) {
                    let args = {
                        module: 'CheckBoxSelection',
                        enable: this.mode === 'CheckBox',
                        value: state ? 'check' : 'uncheck'
                    };
                    this.notify('checkSelectAll', args);
                }
                this.selectAllItem(state, event);
                this.selectAllAction = null;
            };
            super.render();
        }
        else {
            this.selectAllAction = null;
            if (this.mode === 'CheckBox' && this.showSelectAll) {
                let args = {
                    value: state ? 'check' : 'uncheck',
                    enable: this.mode === 'CheckBox',
                    module: 'CheckBoxSelection'
                };
                this.notify('checkSelectAll', args);
            }
            this.selectAllItem(state, event);
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    ;
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource))
            || newProp.query && !isNullOrUndefined(Object.keys(newProp.query))) {
            this.mainList = null;
            this.mainData = null;
            this.isFirstClick = false;
            this.isDynamicDataChange = true;
        }
        if (this.getModuleName() === 'multiselect') {
            this.filterAction = false;
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        }
        for (let prop of Object.keys(newProp)) {
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
                    super.onPropertyChanged(newProp, oldProp);
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
                    let msProps;
                    msProps = this.getPropObject(prop, newProp, oldProp);
                    super.onPropertyChanged(msProps.newProperty, msProps.oldProperty);
                    break;
            }
        }
    }
    reInitializePoup() {
        if (this.popupObj) {
            this.popupObj.destroy();
            this.popupObj = null;
        }
        this.renderPopup();
    }
    updateVal(newProp, oldProp, prop) {
        if (!this.list) {
            this.onLoadSelect();
        }
        else if ((this.dataSource instanceof DataManager) && (!this.listData || !(this.mainList && this.mainData))) {
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
    }
    /**
     * Adds a new item to the multiselect popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     */
    addItem(items, itemIndex) {
        super.addItem(items, itemIndex);
    }
    /**
     * Hides the popup, if the popup in a open state.
     * @returns void
     */
    hidePopup() {
        let delay = 100;
        if (this.isPopupOpen()) {
            let animModel = {
                name: 'FadeOut',
                duration: 100,
                delay: delay ? delay : 0
            };
            let eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
            this.trigger('close', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel) {
                    this.beforePopupOpen = false;
                    this.overAllWrapper.classList.remove(iconAnimation);
                    this.popupObj.hide(new Animation(eventArgs.animation));
                    attributes(this.inputElement, { 'aria-expanded': 'false' });
                    if (this.allowFiltering) {
                        this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'clear' });
                    }
                    this.popupObj.hide();
                    removeClass([document.body, this.popupObj.element], 'e-popup-full-page');
                    EventHandler.remove(this.list, 'keydown', this.onKeyDown);
                }
            });
        }
    }
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    showPopup() {
        if (!this.enabled) {
            return;
        }
        let args = { cancel: false };
        this.trigger('beforeOpen', args, (args) => {
            if (!args.cancel) {
                if ((isBlazor() && this.isServerRendered) && this.itemTemplate) {
                    this.DropDownBaseupdateBlazorTemplates(true, false, false, false, false, false, false, false);
                    if (this.mode !== 'CheckBox' && this.list) {
                        this.refreshSelection();
                    }
                }
                if (!this.ulElement) {
                    this.beforePopupOpen = true;
                    super.render();
                    if (this.mode === 'CheckBox' && Browser.isDevice && this.allowFiltering) {
                        this.notify('popupFullScreen', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                    }
                    return;
                }
                if (this.mode === 'CheckBox' && Browser.isDevice && this.allowFiltering) {
                    this.notify('popupFullScreen', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
                }
                let mainLiLength = this.ulElement.querySelectorAll('li.' + 'e-list-item').length;
                let liLength = this.ulElement.querySelectorAll('li.'
                    + dropDownBaseClasses.li + '.' + HIDE_LIST).length;
                if (mainLiLength > 0 && (mainLiLength === liLength) && (liLength === this.mainData.length)) {
                    this.beforePopupOpen = false;
                    return;
                }
                this.onPopupShown();
            }
        });
    }
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    selectAll(state) {
        this.isSelectAll = true;
        this.selectAllItems(state);
    }
    getModuleName() {
        return 'multiselect';
    }
    ;
    /**
     * Allows you to clear the selected values from the Multiselect component.
     * @returns void
     */
    clear() {
        this.selectAll(false);
        this.setProperties({ value: null }, true);
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
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
        let id = this.element.getAttribute('id') ? this.element.getAttribute('id') : getUniqueID('ej2_dropdownlist');
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
        if (this.element.hasAttribute('data-val')) {
            this.element.setAttribute('data-val', 'false');
        }
        this.renderComplete();
    }
    checkInitialValue() {
        let isData = this.dataSource instanceof Array ? (this.dataSource.length > 0)
            : !isNullOrUndefined(this.dataSource);
        if (!(this.value && this.value.length) &&
            isNullOrUndefined(this.text) &&
            !isData &&
            this.element.tagName === 'SELECT' &&
            this.element.options.length > 0) {
            let optionsElement = this.element.options;
            let valueCol = [];
            let textCol = '';
            for (let index = 0, optionsLen = optionsElement.length; index < optionsLen; index++) {
                let opt = optionsElement[index];
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
                this.setInitialValue = () => {
                    this.initStatus = false;
                    this.initialValueUpdate();
                    this.initialUpdate();
                    this.setInitialValue = null;
                    this.initStatus = true;
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
    }
    checkAutoFocus() {
        if (this.element.hasAttribute('autofocus')) {
            this.inputElement.focus();
        }
    }
    setFloatLabelType() {
        removeFloating(this.overAllWrapper, this.componentWrapper, this.searchWrapper, this.inputElement, this.value, this.floatLabelType, this.placeholder);
        if (this.floatLabelType !== 'Never') {
            createFloatLabel(this.overAllWrapper, this.searchWrapper, this.element, this.inputElement, this.value, this.floatLabelType, this.placeholder);
        }
    }
    addValidInputClass() {
        if ((!isNullOrUndefined(this.value) && this.value.length) || this.floatLabelType === 'Always') {
            addClass([this.overAllWrapper], 'e-valid-input');
        }
        else {
            removeClass([this.overAllWrapper], 'e-valid-input');
        }
    }
    dropDownIcon() {
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
    }
    initialUpdate() {
        if (this.mode !== 'Box') {
            this.updateDelimView();
        }
        this.updateCssClass();
        this.updateHTMLAttribute();
        this.updateReadonly(this.readonly);
        this.refreshInputHight();
        this.checkPlaceholderSize();
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}
     */
    destroy() {
        // tslint:disable-next-line
        if (this.isReact) {
            this.clearTemplate();
        }
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
        super.destroy();
        let temp = ['readonly', 'aria-disabled', 'aria-placeholder', 'placeholder'];
        let length = temp.length;
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
    }
    ;
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
    Property('No records found')
], MultiSelect.prototype, "noRecordsTemplate", void 0);
__decorate$5([
    Property('Request failed')
], MultiSelect.prototype, "actionFailureTemplate", void 0);
__decorate$5([
    Property('None')
], MultiSelect.prototype, "sortOrder", void 0);
__decorate$5([
    Property(true)
], MultiSelect.prototype, "enabled", void 0);
__decorate$5([
    Property(false)
], MultiSelect.prototype, "enableHtmlSanitizer", void 0);
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

const ICON = 'e-icons';
const CHECKBOXFRAME$1 = 'e-frame';
const CHECK$1 = 'e-check';
const CHECKBOXWRAP$1 = 'e-checkbox-wrapper';
const INDETERMINATE = 'e-stop';
const checkAllParent = 'e-selectall-parent';
const searchBackIcon = 'e-input-group-icon e-back-icon e-icons';
const filterBarClearIcon = 'e-input-group-icon e-clear-icon e-icons';
const filterInput = 'e-input-filter';
const filterParent = 'e-filter-parent';
const mobileFilter = 'e-ddl-device-filter';
const clearIcon = 'e-clear-icon';
const popupFullScreen = 'e-popup-full-page';
const device = 'e-ddl-device';
const FOCUS$1 = 'e-input-focus';
/**
 * The Multiselect enable CheckBoxSelection call this inject module.
 */
class CheckBoxSelection {
    constructor(parent) {
        this.activeLi = [];
        this.activeEle = [];
        this.parent = parent;
        this.removeEventListener();
        this.addEventListener();
    }
    getModuleName() {
        return 'CheckBoxSelection';
    }
    addEventListener() {
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
        this.parent.on('popupFullScreen', this.setPopupFullScreen, this);
    }
    removeEventListener() {
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
        this.parent.off('popupFullScreen', this.setPopupFullScreen);
    }
    listOption(args) {
        if (isNullOrUndefined(this.parent.listCurrentOptions.itemCreated)) {
            this.parent.listCurrentOptions.itemCreated = (e) => {
                this.checboxCreate(e);
            };
        }
        else {
            let itemCreated = this.parent.listCurrentOptions.itemCreated;
            this.parent.listCurrentOptions.itemCreated = (e) => {
                this.checboxCreate(e);
                itemCreated.apply(this, [e]);
            };
        }
    }
    ;
    setPlaceholder(props) {
        Input.setPlaceholder(props.filterBarPlaceholder, this.filterInput);
    }
    checboxCreate(e) {
        let item;
        if (!isNullOrUndefined(e.item)) {
            item = e.item;
        }
        else {
            item = e;
        }
        if (this.parent.enableGroupCheckBox || (item.className !== 'e-list-group-item '
            && item.className !== 'e-list-group-item')) {
            let checkboxEle = createCheckBox(this.parent.createElement, true);
            let icon = select('div.' + ICON, item);
            let id = item.getAttribute('data-uid');
            item.insertBefore(checkboxEle, item.childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            select('.' + CHECKBOXFRAME$1, checkboxEle);
            let frame = select('.' + CHECKBOXFRAME$1, checkboxEle);
            if (this.parent.enableGroupCheckBox) {
                this.parent.popupWrapper.classList.add('e-multiselect-group');
            }
            return item;
        }
        else {
            return item;
        }
    }
    setSelectAll() {
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
            if (this.parent.list.classList.contains('e-nodata') || (this.parent.listData && this.parent.listData.length <= 1 &&
                !(this.parent.isDynamicDataChange && isBlazor())) || (this.parent.isDynamicDataChange &&
                !isNullOrUndefined(this.parent.value) && this.parent.value.length <= 1 && isBlazor())) {
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
    }
    destroy() {
        this.removeEventListener();
    }
    listSelection(args) {
        let target;
        let isBlazorListbox = isBlazor() && (args.module && args.module === 'listbox');
        if (!isNullOrUndefined(args.e)) {
            let frameElm = args.li.querySelector('.e-checkbox-wrapper .e-frame');
            target = !isNullOrUndefined(args.e.target) ?
                (args.e.target.classList.contains('e-frame')
                    && (!this.parent.showSelectAll
                        || (this.checkAllParent && !this.checkAllParent.contains(args.e.target)))) ?
                    args.e.target : (isBlazorListbox ? frameElm : args.li.querySelector('.e-checkbox-wrapper').childNodes[1])
                : (isBlazorListbox ? frameElm : args.li.querySelector('.e-checkbox-wrapper').childNodes[1]);
        }
        else {
            let checkboxWrapper = args.li.querySelector('.e-checkbox-wrapper');
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
            let checkElement = select('.' + CHECKBOXFRAME$1, this.checkWrapper);
            let selectAll$$1 = false;
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK$1), args.li, args.e, selectAll$$1);
        }
    }
    validateCheckNode(checkWrap, isCheck, li, e, selectAll$$1) {
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true, selectAll$$1);
    }
    clickHandler(e) {
        let target;
        if (e.currentTarget.classList.contains(this.checkAllParent.className)) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.currentTarget;
        }
        this.checkWrapper = closest(target, '.' + CHECKBOXWRAP$1);
        let selectAll$$1 = true;
        if (!isNullOrUndefined(this.checkWrapper)) {
            let checkElement = select('.' + CHECKBOXFRAME$1, this.checkWrapper);
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK$1), null, e, selectAll$$1);
        }
        e.preventDefault();
    }
    changeState(wrapper, state, e, isPrevent, selectAll$$1) {
        let ariaState;
        let frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME$1)[0];
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
    }
    setSearchBox(args) {
        if (isNullOrUndefined(this.parent.filterParent)) {
            this.parent.filterParent = this.parent.createElement('span', {
                className: filterParent
            });
            this.filterInput = this.parent.createElement('input', {
                attrs: { type: 'text' },
                className: filterInput
            });
            this.parent.element.parentNode.insertBefore(this.filterInput, this.parent.element);
            let backIcon = false;
            if (Browser.isDevice) {
                backIcon = true;
                this.parent.mobFilter = false;
            }
            this.filterInputObj = Input.createInput({
                element: this.filterInput,
                buttons: backIcon ? [searchBackIcon, filterBarClearIcon] : [filterBarClearIcon],
                properties: { placeholder: this.parent.filterBarPlaceholder }
            }, this.parent.createElement);
            if (!isNullOrUndefined(this.parent.cssClass)) {
                if (this.parent.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    addClass([this.filterInputObj.container], 'e-outline');
                }
                else if (this.parent.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    addClass([this.filterInputObj.container], 'e-filled');
                }
            }
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
    }
    ;
    clickOnBackIcon(e) {
        this.parent.hidePopup();
        removeClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.inputElement.focus();
    }
    clearText(e) {
        this.parent.targetInputElement.value = '';
        this.parent.refreshPopup();
        this.parent.refreshListItems(null);
        this.clearIconElement.style.visibility = 'hidden';
        this.filterInput.focus();
        this.setReorder(e);
        e.preventDefault();
    }
    setDeviceSearchBox() {
        this.parent.popupObj.element.classList.add(device);
        this.parent.popupObj.element.classList.add(mobileFilter);
        this.parent.popupObj.position = { X: 0, Y: 0 };
        this.parent.popupObj.dataBind();
        this.setSearchBoxPosition();
        this.backIconElement = this.filterInputObj.container.querySelector('.e-back-icon');
        this.clearIconElement = this.filterInputObj.container.querySelector('.' + clearIcon);
        this.clearIconElement.style.visibility = 'hidden';
        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
    }
    setSearchBoxPosition() {
        let searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        let selectAllHeight = 0;
        if (this.checkAllParent) {
            selectAllHeight = this.checkAllParent.getBoundingClientRect().height;
        }
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
        this.parent.list.style.maxHeight = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        this.parent.list.style.height = (window.innerHeight - searchBoxHeight - selectAllHeight) + 'px';
        let clearElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }
    setPopupFullScreen() {
        attributes(this.parent.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
        addClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
    }
    targetElement() {
        if (!isNullOrUndefined(this.clearIconElement)) {
            this.parent.targetInputElement = this.filterInput;
            this.clearIconElement.style.visibility = this.parent.targetInputElement.value === '' ? 'hidden' : 'visible';
        }
        return this.parent.targetInputElement.value;
    }
    onBlur(e) {
        if (!this.parent.element.classList.contains('e-listbox')) {
            let target;
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
    }
    onDocumentClick(e) {
        if (this.parent.getLocaleName() !== 'listbox') {
            let target = e.target;
            if (!isNullOrUndefined(this.parent.popupObj) && closest(target, '[id="' + this.parent.popupObj.element.id + '"]')) {
                if (!(this.filterInput && this.filterInput.value !== '')) {
                    e.preventDefault();
                }
            }
            if (!(!isNullOrUndefined(this.parent.popupObj) && closest(target, '[id="' + this.parent.popupObj.element.id + '"]')) &&
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
    }
    getFocus(e) {
        this.parent.overAllWrapper.classList.remove(FOCUS$1);
        if (this.parent.keyAction && e.value !== 'clear' && e.value !== 'focus') {
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
    }
    checkSelectAll(e) {
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
    }
    setLocale(unSelect) {
        if (this.parent.selectAllText !== 'Select All' || this.parent.unSelectAllText !== 'Unselect All') {
            let template = unSelect ? this.parent.unSelectAllText : this.parent.selectAllText;
            let compiledString;
            this.selectAllSpan.textContent = '';
            compiledString = compile(template);
            let templateName = unSelect ? 'unSelectAllText' : 'selectAllText';
            for (let item of compiledString({}, this.parent, templateName, null, !this.parent.isStringTemplate)) {
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            let l10nLocale = { selectAllText: 'Select All', unSelectAllText: 'Unselect All' };
            let l10n = new L10n(this.parent.getLocaleName(), {}, this.parent.locale);
            if (l10n.getConstant('selectAllText') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.parent.locale);
            }
            this.selectAllSpan.textContent = unSelect ? l10n.getConstant('unSelectAllText') : l10n.getConstant('selectAllText');
        }
    }
    getActiveList(args) {
        if (args.li.classList.contains('e-active')) {
            this.activeLi.push(args.li.cloneNode(true));
        }
        else {
            this.activeLi.splice(args.index, 1);
        }
    }
    setReorder(args) {
        if (this.parent.enableSelectionOrder && !isNullOrUndefined(this.parent.value)) {
            let activeLiCount = this.parent.ulElement.querySelectorAll('li.e-active').length;
            let remLi;
            let ulEle = this.parent.createElement('ul', {
                className: 'e-list-parent e-ul e-reorder'
            });
            let removeEle = this.parent.createElement('div');
            if (activeLiCount > 0) {
                append(this.parent.ulElement.querySelectorAll('li.e-active'), ulEle);
                remLi = this.parent.ulElement.querySelectorAll('li.e-active');
                addClass(remLi, 'e-reorder-hide');
                prepend([ulEle], this.parent.list);
            }
            this.parent.focusAtFirstListItem();
        }
    }
}

/**
 * export all modules from current location
 */

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ListBox_1;
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
const ITEMTEMPLATE_PROPERTY$1 = 'ItemTemplate';
/**
 * Defines the Selection settings of List Box.
 */
class SelectionSettings extends ChildProperty {
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
/**
 * Defines the toolbar settings of List Box.
 */
class ToolbarSettings extends ChildProperty {
}
__decorate$6([
    Property([])
], ToolbarSettings.prototype, "items", void 0);
__decorate$6([
    Property('Right')
], ToolbarSettings.prototype, "position", void 0);
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
let ListBox = ListBox_1 = class ListBox extends DropDownBase {
    /**
     * Constructor for creating the ListBox component.
     */
    constructor(options, element) {
        super(options, element);
        this.isValidKey = false;
        this.keyDownStatus = false;
    }
    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @private
     */
    addItem(items, itemIndex) {
        super.addItem(items, itemIndex);
    }
    ;
    /**
     * Build and render the component
     * @private
     */
    render() {
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
            super.render();
        }
        this.renderComplete();
    }
    updateBlazorListData(data, isDataSource, select$$1) {
        if (isDataSource) {
            this.liCollections = this.list.querySelectorAll('.' + cssClass.li);
            this.mainList = this.ulElement = this.list.querySelector('ul');
            if (this.allowDragAndDrop && !this.ulElement.classList.contains('e-sortable')) {
                this.initDraggable();
            }
            if (select$$1) {
                this.selectItems(this.listData, false);
            }
        }
        if (!isNullOrUndefined(data)) {
            this.sortedData = this.jsonData = this.listData = data;
        }
    }
    initWrapper() {
        let hiddenSelect = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        this.list.classList.add('e-listbox-wrapper');
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
        this.list.classList.add('e-wrapper');
        this.list.classList.add('e-lib');
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
        if (this.itemTemplate) {
            this.renderReactTemplates();
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element, hiddenSelect);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        this.updateSelectionSettings();
    }
    updateSelectionSettings() {
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            let l10nSelect = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
            this.showSelectAll = true;
            this.selectAllText = l10nSelect.getConstant('selectAllText');
            this.unSelectAllText = l10nSelect.getConstant('unSelectAllText');
            this.popupWrapper = this.list;
            this.checkBoxSelectionModule.checkAllParent = null;
            this.notify('selectAll', {});
        }
    }
    initDraggable() {
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
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e) => {
                    let wrapper = this.list.cloneNode();
                    let ele = e.sender.cloneNode(true);
                    wrapper.appendChild(ele);
                    let refEle = this.getItems()[0];
                    wrapper.style.width = refEle.offsetWidth + 'px';
                    wrapper.style.height = refEle.offsetHeight + 'px';
                    if ((this.value && this.value.length) > 1 && this.isSelected(ele)) {
                        ele.appendChild(this.createElement('span', {
                            className: 'e-list-badge', innerHTML: this.value.length + ''
                        }));
                    }
                    wrapper.style.zIndex = getZindexPartial(this.element) + '';
                    return wrapper;
                }
            });
        }
    }
    updateActionCompleteData(li, item) {
        this.jsonData.push(item);
    }
    initToolbar() {
        let scope;
        let pos = this.toolbarSettings.position;
        let prevScope = this.element.getAttribute('data-value');
        if (this.toolbarSettings.items.length) {
            let toolElem = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            let wrapper = this.createElement('div', {
                className: 'e-listboxtool-wrapper e-lib e-' + pos.toLowerCase()
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
    }
    createButtons(toolElem) {
        let btn;
        let ele;
        let title;
        let l10n = new L10n(this.getModuleName(), {
            moveUp: 'Move Up', moveDown: 'Move Down', moveTo: 'Move To',
            moveFrom: 'Move From', moveAllTo: 'Move All To', moveAllFrom: 'Move All From'
        }, this.locale);
        this.toolbarSettings.items.forEach((value) => {
            title = l10n.getConstant(value);
            ele = this.createElement('button', {
                attrs: {
                    'type': 'button',
                    'data-value': value,
                    'title': title,
                    'aria-label': title
                }
            });
            toolElem.appendChild(ele);
            btn = new Button({ iconCss: 'e-icons e-' + value.toLowerCase() }, ele);
            btn.createElement = this.createElement;
        });
    }
    validationAttribute(input, hiddenSelect) {
        super.validationAttribute(input, hiddenSelect);
        hiddenSelect.required = input.required;
        input.required = false;
    }
    setHeight() {
        let ele = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        ele.style.height = formatUnit(this.height);
        if (this.allowFiltering && this.height.toString().indexOf('%') < 0) {
            addClass([this.list], 'e-filter-list');
        }
        else {
            removeClass([this.list], 'e-filter-list');
        }
    }
    setCssClass() {
        let wrap = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            addClass([wrap], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            addClass([wrap], 'e-rtl');
        }
    }
    setEnable() {
        let ele = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            removeClass([ele], cssClass.disabled);
        }
        else {
            addClass([ele], cssClass.disabled);
            if (isBlazor() && this.isServerRendered && this.toolbarSettings.items.length) {
                removeClass([this.list], cssClass.disabled);
            }
        }
    }
    showSpinner() {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper' });
        }
        this.spinner.style.height = formatUnit(this.height);
        this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        createSpinner({ target: this.spinner }, this.createElement);
        showSpinner(this.spinner);
    }
    hideSpinner() {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            detach(this.spinner);
        }
    }
    onInput() {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        }
        else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
        this.refreshClearIcon();
    }
    clearText() {
        this.filterInput.value = '';
        this.refreshClearIcon();
        let event = document.createEvent('KeyboardEvent');
        this.isValidKey = true;
        this.KeyUp(event);
    }
    refreshClearIcon() {
        if (this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon)) {
            let clearElement = this.filterInput.parentElement.querySelector('.' + listBoxClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
    }
    onActionComplete(ulElement, list, e) {
        let searchEle;
        if (this.allowFiltering && this.list.getElementsByClassName('e-filter-parent')[0]) {
            if (isBlazor() && this.isServerRendered) {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0];
            }
            else {
                searchEle = this.list.getElementsByClassName('e-filter-parent')[0].cloneNode(true);
            }
        }
        super.onActionComplete(ulElement, list, e);
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
                let filterElem = this.list.getElementsByClassName('e-input-filter')[0];
                let txtLength = this.filterInput.value.length;
                filterElem.selectionStart = txtLength;
                filterElem.selectionEnd = txtLength;
                filterElem.focus();
            }
        }
        this.initLoad = false;
    }
    initToolbarAndStyles() {
        this.initToolbar();
        this.setCssClass();
        this.setEnable();
        this.setHeight();
    }
    triggerDragStart(args) {
        let badge;
        args = extend(this.getDragArgs(args), { dragSelected: true });
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', args, (dragEventArgs) => {
            this.allowDragAll = dragEventArgs.dragSelected;
            if (!this.allowDragAll) {
                badge = this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) {
                    detach(badge);
                }
            }
            if (isBlazor()) {
                args.bindEvents(args.dragElement);
            }
        });
    }
    triggerDrag(args) {
        this.trigger('drag', this.getDragArgs(args));
        let listObj = this.getComponent(args.target);
        if (listObj && listObj.listData.length === 0) {
            let noRecElem = listObj.ulElement.getElementsByClassName('e-list-nrt')[0];
            if (noRecElem) {
                listObj.ulElement.removeChild(noRecElem);
            }
        }
    }
    beforeDragEnd(args) {
        let dragValue = args.droppedElement.getAttribute('data-value');
        if (this.value.indexOf(dragValue) > -1) {
            args.items = this.getDataByValues(this.value);
        }
        else {
            args.items = this.getDataByValues([dragValue]);
        }
        this.trigger('beforeDrop', args);
    }
    // tslint:disable-next-line:max-func-body-length
    dragEnd(args) {
        let listData;
        let liColl;
        let jsonData;
        let droppedData;
        let selectedOptions;
        let sortedData;
        let dropValue = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        let listObj = this.getComponent(args.droppedElement);
        let getArgs = this.getDragArgs({ target: args.droppedElement }, true);
        let sourceArgs = { previousData: this.dataSource };
        let destArgs = { previousData: listObj.dataSource };
        let dragArgs = extend({}, getArgs, { target: args.target, source: { previousData: this.dataSource } });
        if (listObj !== this) {
            let sourceArgs1 = extend(sourceArgs, { currentData: this.listData });
            dragArgs = extend(dragArgs, { source: sourceArgs1, destination: destArgs });
        }
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            let ul = this.ulElement;
            listData = [].slice.call(this.listData);
            liColl = [].slice.call(this.liCollections);
            jsonData = [].slice.call(this.jsonData);
            sortedData = [].slice.call(this.sortedData);
            let toSortIdx = args.currentIndex;
            let toIdx = args.currentIndex = this.getCurIdx(this, args.currentIndex);
            let rIdx = listData.indexOf(this.getDataByValue(dropValue));
            let jsonIdx = jsonData.indexOf(this.getDataByValue(dropValue));
            let sIdx = sortedData.indexOf(this.getDataByValue(dropValue));
            listData.splice(toIdx, 0, listData.splice(rIdx, 1)[0]);
            sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0]);
            jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0]);
            if (!isBlazor()) {
                liColl.splice(toIdx, 0, liColl.splice(rIdx, 1)[0]);
            }
            if (this.allowDragAll) {
                selectedOptions = this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
                selectedOptions.forEach((value) => {
                    if (value !== dropValue) {
                        let idx = listData.indexOf(this.getDataByValue(value));
                        let jsonIdx = jsonData.indexOf(this.getDataByValue(value));
                        let sIdx = sortedData.indexOf(this.getDataByValue(value));
                        if (idx > toIdx) {
                            toIdx++;
                        }
                        jsonData.splice(toIdx, 0, jsonData.splice(jsonIdx, 1)[0]);
                        listData.splice(toIdx, 0, listData.splice(idx, 1)[0]);
                        sortedData.splice(toSortIdx, 0, sortedData.splice(sIdx, 1)[0]);
                        if (!isBlazor()) {
                            liColl.splice(toIdx, 0, liColl.splice(idx, 1)[0]);
                            ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                        }
                    }
                    else if (isBlazor()) {
                        let lists = [].slice.call(this.ulElement.getElementsByClassName(cssClass.li));
                        let refChild = this.ulElement.removeChild(lists[args.currentIndex]);
                        lists.splice(args.currentIndex, 1);
                        this.ulElement.insertBefore(refChild, lists[args.previousIndex]);
                    }
                });
            }
            this.listData = listData;
            this.jsonData = jsonData;
            this.sortedData = sortedData;
            this.liCollections = liColl;
            if (isBlazor()) {
                let value = this.value;
                // tslint:disable-next-line:no-any
                this.interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then(() => {
                    this.updateBlazorListData(null, true);
                    this.selectItems(this.listData, false);
                    this.selectItems(value);
                });
            }
        }
        else {
            let li;
            let fLiColl = [].slice.call(this.liCollections);
            let currIdx = args.currentIndex = this.getCurIdx(listObj, args.currentIndex);
            let ul = listObj.ulElement;
            listData = [].slice.call(listObj.listData);
            liColl = [].slice.call(listObj.liCollections);
            jsonData = [].slice.call(listObj.jsonData);
            sortedData = [].slice.call(listObj.sortedData);
            selectedOptions = (this.value && Array.prototype.indexOf.call(this.value, dropValue) > -1 && this.allowDragAll)
                ? this.value : [dropValue];
            let fListData = [].slice.call(this.listData);
            let fSortData = [].slice.call(this.sortedData);
            selectedOptions.forEach((value, index) => {
                droppedData = this.getDataByValue(value);
                let srcIdx = this.listData.indexOf(droppedData);
                let jsonSrcIdx = this.jsonData.indexOf(droppedData);
                let sortIdx = this.sortedData.indexOf(droppedData);
                fListData.splice(srcIdx, 1);
                this.jsonData.splice(jsonSrcIdx, 1);
                fSortData.splice(sortIdx, 1);
                this.listData = fListData;
                this.sortedData = fSortData;
                let destIdx = value === dropValue ? args.currentIndex : currIdx;
                listData.splice(destIdx, 0, droppedData);
                jsonData.splice(destIdx, 0, droppedData);
                sortedData.splice(destIdx, 0, droppedData);
                if (!isBlazor()) {
                    liColl.splice(destIdx, 0, fLiColl.splice(srcIdx, 1)[0]);
                }
                if (!value) {
                    let liCollElem = this.getItems();
                    for (let i = 0; i < liCollElem.length; i++) {
                        if (liCollElem[i].getAttribute('data-value') === null && liCollElem[i].classList.contains('e-list-item')) {
                            li = liCollElem[i];
                            break;
                        }
                    }
                }
                else {
                    li = this.getItems()[this.getIndexByValue(value)];
                }
                if (!li) {
                    li = args.helper;
                }
                this.removeSelected(this, value === dropValue ? [args.droppedElement] : [li]);
                if (isBlazor()) {
                    if (index === 0) {
                        this.ulElement.insertBefore(ul.getElementsByClassName(cssClass.li)[args.currentIndex], this.ulElement.getElementsByClassName(cssClass.li)[args.previousIndex]);
                    }
                }
                else {
                    ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                }
                currIdx++;
            });
            if (isBlazor()) {
                // tslint:disable
                this.interopAdaptor.invokeMethodAsync('UpdateListData', this.listData).then(() => {
                    this.updateSelectedOptions();
                    if (this.fields.groupBy) {
                        this.setSelection();
                    }
                    this.updateBlazorListData(null, true, this.value == null || !this.value.length);
                });
                listObj.interopAdaptor.invokeMethodAsync('UpdateListData', listData).then(() => {
                    if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
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
                    !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy || listObj.itemTemplate || this.itemTemplate) {
                    let sortable = getComponent(ul, 'sortable');
                    ul.innerHTML = listObj.renderItems(listData, listObj.fields).innerHTML;
                    if (sortable.placeHolderElement) {
                        ul.appendChild(sortable.placeHolderElement);
                    }
                    ul.appendChild(args.helper);
                    listObj.setSelection();
                }
                this.liCollections = fLiColl;
                listObj.liCollections = liColl;
            }
            listObj.jsonData = extend([], [], jsonData, false);
            listObj.listData = extend([], [], listData, false);
            listObj.sortedData = extend([], [], sortedData, false);
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        if (this === listObj) {
            let sourceArgs1 = extend(sourceArgs, { currentData: listData });
            dragArgs = extend(dragArgs, { source: sourceArgs1 });
        }
        else {
            let dragArgs1 = extend(destArgs, { currentData: listData });
            dragArgs = extend(dragArgs, { destination: dragArgs1 });
        }
        this.trigger('drop', dragArgs);
    }
    removeSelected(listObj, elems) {
        if (listObj.selectionSettings.showCheckbox) {
            elems.forEach((ele) => { ele.getElementsByClassName('e-frame')[0].classList.remove('e-check'); });
        }
        else {
            removeClass(elems, cssClass.selected);
        }
    }
    getCurIdx(listObj, idx) {
        if (listObj.fields.groupBy) {
            idx -= [].slice.call(listObj.ulElement.children).slice(0, idx)
                .filter((ele) => ele.classList.contains(cssClass.group)).length;
        }
        return idx;
    }
    getComponent(li) {
        let listObj;
        let ele = (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
            : closest(li, '.e-listbox-wrapper') && closest(li, '.e-listbox-wrapper').querySelector('.e-listbox'));
        if (ele) {
            listObj = getComponent(ele, this.getModuleName());
        }
        return listObj;
    }
    listOption(dataSource, fields) {
        this.listCurrentOptions = super.listOption(dataSource, fields);
        this.listCurrentOptions = extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
        this.notify('listoption', { module: 'CheckBoxSelection' });
        return this.listCurrentOptions;
    }
    triggerBeforeItemRender(e) {
        e.item.setAttribute('tabindex', '-1');
        this.trigger('beforeItemRender', { element: e.item, item: e.curData });
    }
    requiredModules() {
        let modules = [];
        if (this.selectionSettings.showCheckbox) {
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * This method is used to enable or disable the items in the ListBox based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    enableItems(items, enable = true, isValue) {
        let li;
        items.forEach((item) => {
            let text;
            if (isBlazor() && typeof (item) === 'object') {
                text = getValue(isValue ? this.fields.value : this.fields.text, item);
                if (isNullOrUndefined(text)) {
                    return;
                }
            }
            else {
                text = item;
            }
            li = this.findListElement(this.list, 'li', 'data-value', isValue ? text : this.getValueByText(text));
            if (!li) {
                return;
            }
            if (enable) {
                removeClass([li], cssClass.disabled);
                li.removeAttribute('aria-disabled');
            }
            else {
                addClass([li], cssClass.disabled);
                li.setAttribute('aria-disabled', 'true');
            }
        });
    }
    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     * @param items Array of text value of the item.
     * @param state Set `true`/`false` to select/un select the list items.
     * @param isValue - Set `true` if `items` parameter is a array of unique values.
     * @returns void
     */
    selectItems(items, state = true, isValue) {
        this.setSelection(items, state, !isValue);
        this.updateSelectedOptions();
    }
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * @param state Set `true`/`false` to select/un select the entire list items.
     * @returns void
     */
    selectAll(state = true) {
        this.selectAllItems(state);
    }
    /**
     * Adds a new item to the list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the list.
     * @returns {void}.
     */
    addItems(items, itemIndex) {
        super.addItem(items, itemIndex);
    }
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    removeItems(items, itemIndex) {
        this.removeItem(items, itemIndex);
    }
    /**
     * Removes a item from the list. By default, removed the last item in the list,
     * but you can remove based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to remove the item from the list.
     * @returns {void}.
     */
    removeItem(items, itemIndex) {
        let liCollections = [];
        let liElement = this.list.querySelectorAll('.' + dropDownBaseClasses.li);
        if (items) {
            items = (items instanceof Array ? items : [items]);
            let fields = this.fields;
            let dataValue;
            let objValue;
            let dupData = [];
            let itemIdx;
            extend(dupData, [], this.listData);
            let removeIdxes = [];
            let removeLiIdxes = [];
            for (let j = 0; j < items.length; j++) {
                if (items[j] instanceof Object) {
                    dataValue = getValue(fields.value, items[j]);
                }
                else {
                    dataValue = items[j].toString();
                }
                for (let i = 0, len = dupData.length; i < len; i++) {
                    if (dupData[i] instanceof Object) {
                        objValue = getValue(fields.value, dupData[i]);
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
            for (let k = removeIdxes.length - 1; k >= 0; k--) {
                this.listData.splice(removeIdxes[k], 1);
            }
            for (let k = removeLiIdxes.length - 1; k >= 0; k--) {
                this.liCollections.splice(removeLiIdxes[k], 1);
            }
        }
        else {
            itemIndex = itemIndex ? itemIndex : 0;
            liCollections.push(liElement[itemIndex]);
            this.listData.splice(itemIndex, 1);
            this.updateLiCollection(itemIndex);
        }
        for (let i = 0; i < liCollections.length; i++) {
            this.ulElement.removeChild(liCollections[i]);
        }
        if (this.listData.length === 0) {
            this.l10nUpdate();
        }
    }
    /**
     * Gets the array of data Object that matches the given array of values.
     * @param  { string[] | number[] | boolean[] } value - Specifies the array value of the list item.
     * @returns object[].
     */
    getDataByValues(value) {
        let data = [];
        for (let i = 0; i < value.length; i++) {
            data.push(this.getDataByValue(value[i]));
        }
        return data;
    }
    /**
     * Moves the given value(s) / selected value(s) upwards.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    moveUp(value) {
        let elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(true, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) downwards.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value(s).
     * @returns {void}
     */
    moveDown(value) {
        let elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        this.moveUpDown(false, false, elem);
    }
    /**
     * Moves the given value(s) / selected value(s) to the given / default scoped ListBox.
     * @param  { string[] | number[] | boolean[] } value - Specifies the value or array value of the list item.
     * @returns {void}
     */
    moveTo(value, index, targetId) {
        let elem = (value) ? this.getElemByValue(value) : this.getSelectedItems();
        let tlistbox = (targetId) ? getComponent(targetId, ListBox_1) : this.getScopedListBox();
        this.moveData(this, tlistbox, false, elem, index);
    }
    /**
     * Moves all the values from one ListBox to the scoped ListBox.
     * @param  { string } targetId - Specifies the scoped ListBox ID.
     * @param  { string } index - Specifies the index to where the items moved.
     * @returns {void}
     */
    moveAllTo(targetId, index) {
        let tlistbox = (targetId) ? getComponent(targetId, ListBox_1) : this.getScopedListBox();
        this.moveAllData(this, tlistbox, false, index);
    }
    /**
     * Returns the updated dataSource in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    getDataList() {
        return this.jsonData;
    }
    /**
     * Returns the sorted Data in ListBox
     * @returns {{ [key: string]: Object }[] | string[] | boolean[] | number[]}
     */
    getSortedList() {
        let sortData;
        let tempData;
        sortData = tempData = this.sortedData;
        if (this.fields.groupBy) {
            sortData = [];
            for (let i = 0; i < tempData.length; i++) {
                if (tempData[i].isHeader) {
                    continue;
                }
                sortData.push(tempData[i]);
            }
        }
        return sortData;
    }
    getElemByValue(value) {
        let elem = [];
        for (let i = 0; i < value.length; i++) {
            elem.push(this.ulElement.querySelector('[data-value ="' + value[i] + '"]'));
        }
        return elem;
    }
    updateLiCollection(index) {
        let tempLi = [].slice.call(this.liCollections);
        tempLi.splice(index, 1);
        this.liCollections = tempLi;
    }
    selectAllItems(state, event) {
        [].slice.call(this.getItems()).forEach((li) => {
            if (!li.classList.contains(cssClass.disabled)) {
                if (this.selectionSettings.showCheckbox) {
                    let ele = li.getElementsByClassName('e-check')[0];
                    if ((!ele && state) || (ele && !state)) {
                        this.notify('updatelist', { li: li, module: 'listbox' });
                        if (this.maximumSelectionLength >= this.list.querySelectorAll('.e-list-item span.e-check').length) {
                            this.checkMaxSelection();
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
            let liEle = this.list.getElementsByTagName('li');
            let index = 0;
            if (state) {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue1 = this.getFormattedValue(liEle[index].getAttribute('data-value'));
                    if (!this.value.some((e) => e === dataValue1)) {
                        this.value.push(this.getFormattedValue(liEle[index].getAttribute('data-value')));
                    }
                }
            }
            else {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue2 = this.getFormattedValue(liEle[index].getAttribute('data-value'));
                    this.value = this.value.filter((e) => e !== dataValue2);
                }
            }
            if (document.querySelectorAll('ul').length < 2) {
                this.updateMainList();
            }
        }
        this.triggerChange(this.getSelectedItems(), event);
    }
    updateMainList() {
        let mainList = this.mainList.querySelectorAll('.e-list-item');
        let ulList = this.ulElement.querySelectorAll('.e-list-item');
        let mainCount = mainList.length;
        let ulEleCount = ulList.length;
        if (this.selectionSettings.showCheckbox || (document.querySelectorAll('ul').length > 1 || mainCount !== ulEleCount)) {
            let listindex = 0;
            let valueindex = 0;
            let count = 0;
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
    }
    wireEvents() {
        let form = closest(this.element, 'form');
        let wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
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
    }
    wireToolbarEvent() {
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
    }
    unwireEvents() {
        let form = closest(this.element, 'form');
        let wrapper = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
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
    }
    clickHandler(e) {
        this.selectHandler(e);
    }
    ;
    checkSelectAll() {
        let searchCount = 0;
        let liItems = this.list.querySelectorAll('li.' + dropDownBaseClasses.li);
        for (let i = 0; i < liItems.length; i++) {
            if (!liItems[i].classList.contains('e-disabled')) {
                searchCount++;
            }
        }
        let len = this.getSelectedItems().length;
        if (this.showSelectAll && searchCount) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection',
                value: (searchCount === len) ? 'check' : (len === 0) ? 'uncheck' : 'indeterminate' });
        }
    }
    getQuery(query) {
        let filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.allowFiltering) {
            let filterType = this.inputString === '' ? 'contains' : this.filterType;
            let dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                let fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.inputString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new Query();
        }
        return filterQuery;
    }
    setFiltering() {
        let filterInputObj;
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
                if (Browser.isDevice) {
                    
                }
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
    }
    filterWireEvents(filterElem) {
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
    }
    selectHandler(e, isKey) {
        let isSelect = true;
        let currSelIdx;
        let li = closest(e.target, '.' + 'e-list-item');
        let selectedLi = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                }
                else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || Browser.isDevice))) {
                    this.getSelectedItems().forEach((ele) => {
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
                    .filter((ele) => { return ele.classList.contains('e-list-item'); });
            }
            else {
                this.prevSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            }
            if (isSelect) {
                if (!this.selectionSettings.showCheckbox) {
                    addClass(selectedLi, cssClass.selected);
                }
                selectedLi.forEach((ele) => {
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
                let liDataValue = this.getFormattedValue(li.getAttribute('data-value'));
                if (!isSelect) {
                    this.value = this.value.filter((value1) => value1 !== liDataValue);
                }
                else {
                    let values = [];
                    extend(values, this.value);
                    values.push(liDataValue);
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
    }
    triggerChange(selectedLis, event) {
        this.trigger('change', { elements: selectedLis, items: this.getDataByElements(selectedLis), value: this.value, event: event });
    }
    getDataByElems(elems) {
        let data = [];
        for (let i = 0, len = elems.length; i < len; i++) {
            data.push(this.getDataByValue(this.getFormattedValue(elems[i].getAttribute('data-value'))));
        }
        return data;
    }
    getDataByElements(elems) {
        let data = [];
        let value;
        let sIdx = 0;
        if (!isNullOrUndefined(this.listData)) {
            let type = this.typeOfData(this.listData).typeof;
            if (type === 'string' || type === 'number' || type === 'boolean') {
                for (let item of this.listData) {
                    for (let i = sIdx, len = elems.length; i < len; i++) {
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
                for (let item of this.listData) {
                    for (let i = sIdx, len = elems.length; i < len; i++) {
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
    }
    checkMaxSelection() {
        let limit = this.list.querySelectorAll('.e-list-item span.e-check').length;
        if (this.selectionSettings.showCheckbox) {
            let index = 0;
            let liCollElem;
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
    }
    toolbarClickHandler(e) {
        let btn = closest(e.target, 'button');
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
    }
    moveUpDown(isUp, isKey, value) {
        let elems = this.getSelectedItems();
        let tempItems;
        if (value) {
            elems = value;
        }
        if (((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) && !value) {
            return;
        }
        tempItems = this.getDataByElems(elems);
        let localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        this.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele) => {
            let jsonToIdx = Array.prototype.indexOf.call(this.ulElement.querySelectorAll('.e-list-item'), ele);
            let idx = Array.prototype.indexOf.call(this.ulElement.children, ele);
            moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            this.changeData(idx, isUp ? idx - 1 : idx + 1, isUp ? jsonToIdx - 1 : jsonToIdx + 1, ele);
        });
        this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        elems[0].focus();
        if (!isKey && this.toolbarSettings.items.length) {
            this.getToolElem().querySelector('[data-value=' + (isUp ? 'moveUp' : 'moveDown') + ']').focus();
        }
        this.updateToolBarState();
    }
    moveItemTo() {
        this.moveData(this, this.getScopedListBox());
    }
    moveItemFrom() {
        this.moveData(this.getScopedListBox(), this);
    }
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    moveData(fListBox, tListBox, isKey, value, index) {
        let idx = [];
        let dataIdx = [];
        let jsonIdx = [];
        let sortIdx = [];
        let listData = [].slice.call(fListBox.listData);
        let tListData = [].slice.call(tListBox.listData);
        let sortData = [].slice.call(fListBox.sortedData);
        let tSortData = [].slice.call(tListBox.sortedData);
        let fliCollections = [].slice.call(fListBox.liCollections);
        let dataLiIdx = [];
        let tliCollections = [].slice.call(tListBox.liCollections);
        let tempItems = [];
        let data = [];
        let elems = fListBox.getSelectedItems();
        if (value) {
            elems = value;
        }
        let isRefresh = tListBox.sortOrder !== 'None' || (tListBox.selectionSettings.showCheckbox !==
            fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy || tListBox.itemTemplate || fListBox.itemTemplate;
        fListBox.value = [];
        if (elems.length) {
            this.removeSelected(fListBox, elems);
            elems.forEach((ele, i) => {
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
                sortIdx.forEach((i) => {
                    tempItems.push(fListBox.sortedData[i]);
                });
            }
            else {
                jsonIdx.forEach((i) => {
                    tempItems.push(fListBox.jsonData[i]);
                });
            }
            let localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
            fListBox.trigger('actionBegin', localDataArgs);
            if (localDataArgs.cancel) {
                return;
            }
            if (!isBlazor()) {
                let rLiCollection = [];
                dataLiIdx.sort((n1, n2) => n1 - n2).reverse().forEach((i) => {
                    rLiCollection.push(fliCollections.splice(i, 1)[0]);
                });
                fListBox.liCollections = fliCollections;
                if (index) {
                    let toColl = tliCollections.splice(0, index);
                    tListBox.liCollections = toColl.concat(rLiCollection.reverse()).concat(tliCollections);
                }
                else {
                    tListBox.liCollections = tliCollections.concat(rLiCollection.reverse());
                }
                if (tListBox.listData.length === 0) {
                    let noRecElem = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                    if (noRecElem) {
                        tListBox.ulElement.removeChild(noRecElem);
                    }
                }
            }
            dataIdx.sort((n1, n2) => n2 - n1).forEach((i) => {
                listData.splice(i, 1)[0];
            });
            sortIdx.sort((n1, n2) => n2 - n1).forEach((i) => {
                sortData.splice(i, 1)[0];
            });
            jsonIdx.slice().reverse().forEach((i) => {
                data.push(fListBox.jsonData.splice(i, 1)[0]);
            });
            if (!isBlazor()) {
                if (isRefresh) {
                    if (fListBox.fields.groupBy) {
                        fListBox.ulElement.innerHTML = fListBox.renderItems(listData, fListBox.fields).innerHTML;
                    }
                    else {
                        elems.forEach((ele) => { detach(ele); });
                    }
                }
                else {
                    moveTo(fListBox.ulElement, tListBox.ulElement, idx, index);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
                }
                if (tListBox.mainList.childElementCount !== tListBox.jsonData.length) {
                    tListBox.mainList = tListBox.ulElement;
                }
                fListBox.updateMainList();
            }
            let tJsonData = [].slice.call(tListBox.jsonData);
            tSortData = [].slice.call(tListBox.sortedData);
            if (!isBlazor()) {
                this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
            }
            if (isKey) {
                this.list.focus();
            }
            fListBox.listData = listData;
            fListBox.sortedData = sortData;
            index = (index) ? index : tListData.length;
            for (let i = tempItems.length - 1; i >= 0; i--) {
                tListData.splice(index, 0, tempItems[i]);
                tJsonData.splice(index, 0, tempItems[i]);
                tSortData.splice(index, 0, tempItems[i]);
            }
            tListBox.listData = tListData;
            tListBox.jsonData = tJsonData;
            tListBox.sortedData = tSortData;
            if (isBlazor()) {
                // tslint:disable
                fListBox.interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then(() => {
                    fListBox.updateBlazorListData(null, true);
                    this.selectNextList(elems, dataLiIdx, dataIdx, fListBox);
                    fListBox.updateSelectedOptions();
                });
                tListBox.interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then(() => {
                    if (isRefresh) {
                        tListBox.setSelection();
                    }
                    tListBox.updateBlazorListData(null, true);
                    fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
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
    }
    selectNextList(elems, dataLiIdx, dataIdx, inst) {
        let childCnt = inst.ulElement.querySelectorAll('.e-list-item').length;
        let ele;
        let liIdx;
        let validIdx = -1;
        if (elems.length === 1 && childCnt && !inst.selectionSettings.showCheckbox) {
            liIdx = childCnt <= dataLiIdx[0] ? childCnt - 1 : dataLiIdx[0];
            ele = inst.ulElement.querySelectorAll('.e-list-item')[liIdx];
            validIdx = inst.getValidIndex(ele, liIdx, childCnt === dataIdx[0] ? 38 : 40);
            if (validIdx > -1) {
                (inst.ulElement.querySelectorAll('.e-list-item')[validIdx].classList.add(cssClass.selected));
            }
        }
    }
    moveAllItemTo() {
        this.moveAllData(this, this.getScopedListBox());
    }
    moveAllItemFrom() {
        this.moveAllData(this.getScopedListBox(), this);
    }
    moveAllData(fListBox, tListBox, isKey, index) {
        let listData = [].slice.call(tListBox.listData);
        let jsonData = [].slice.call(tListBox.jsonData);
        let isRefresh = tListBox.sortOrder !== 'None' || (tListBox.selectionSettings.showCheckbox !==
            fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy || tListBox.itemTemplate || fListBox.itemTemplate;
        this.removeSelected(fListBox, fListBox.getSelectedItems());
        let tempItems = [].slice.call(fListBox.jsonData);
        let localDataArgs = { cancel: false, items: tempItems, eventName: this.toolbarAction };
        fListBox.trigger('actionBegin', localDataArgs);
        if (localDataArgs.cancel) {
            return;
        }
        if (!isBlazor()) {
            if (tListBox.listData.length === 0) {
                let noRecElem = tListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    tListBox.ulElement.removeChild(noRecElem);
                }
            }
            if (isRefresh) {
                let noRecElem = fListBox.ulElement.getElementsByClassName('e-list-nrt')[0];
                if (noRecElem) {
                    fListBox.ulElement.removeChild(noRecElem);
                }
            }
            moveTo(fListBox.ulElement, tListBox.ulElement, Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number), index);
            this.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
        }
        if (isKey) {
            this.list.focus();
        }
        index = (index) ? index : listData.length;
        for (let i = 0; i < fListBox.listData.length; i++) {
            listData.splice(index + i, 0, fListBox.listData[i]);
        }
        for (let i = 0; i < fListBox.jsonData.length; i++) {
            jsonData.splice(index + i, 0, fListBox.jsonData[i]);
        }
        if (!isBlazor()) {
            let fliCollections = [].slice.call(fListBox.liCollections);
            let tliCollections = [].slice.call(tListBox.liCollections);
            fListBox.liCollections = [];
            if (index) {
                let toColl = tliCollections.splice(0, index);
                tListBox.liCollections = toColl.concat(fliCollections).concat(tliCollections);
            }
            else {
                tListBox.liCollections = tliCollections.concat(fliCollections);
            }
        }
        fListBox.value = [];
        listData = listData
            .filter((data) => data.isHeader !== true);
        tListBox.listData = listData;
        tListBox.jsonData = jsonData;
        fListBox.listData = fListBox.sortedData = fListBox.jsonData = [];
        if (isBlazor()) {
            if (!isRefresh) {
                tListBox.sortedData = listData;
            }
            // tslint:disable
            fListBox.interopAdaptor.invokeMethodAsync('UpdateListData', fListBox.listData).then(() => {
                fListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
            });
            tListBox.interopAdaptor.invokeMethodAsync('UpdateListData', tListBox.listData).then(() => {
                tListBox.updateBlazorListData(null, true);
                fListBox.updateSelectedOptions();
                fListBox.trigger('actionComplete', { items: tempItems, eventName: this.toolbarAction });
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
    }
    changeData(fromIdx, toIdx, jsonToIdx, ele) {
        let listData = [].slice.call(this.listData);
        let jsonData = [].slice.call(this.jsonData);
        let sortData = [].slice.call(this.sortedData);
        let jsonIdx = Array.prototype.indexOf.call(this.jsonData, this.getDataByElems([ele])[0]);
        let sortIdx = Array.prototype.indexOf.call(this.sortedData, this.getDataByElems([ele])[0]);
        let liColl = [].slice.call(this.liCollections);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0]);
        jsonData.splice(jsonToIdx, 0, jsonData.splice(jsonIdx, 1)[0]);
        sortData.splice(toIdx, 0, sortData.splice(sortIdx, 1)[0]);
        liColl.splice(toIdx, 0, liColl.splice(fromIdx, 1)[0]);
        this.listData = listData;
        this.jsonData = jsonData;
        this.liCollections = liColl;
        this.sortedData = sortData;
    }
    getSelectedItems() {
        let ele = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach((cbox) => {
                ele.push(closest(cbox, '.' + 'e-list-item'));
            });
        }
        else {
            ele = [].slice.call(this.ulElement.getElementsByClassName(cssClass.selected));
        }
        return ele;
    }
    getScopedListBox() {
        let listObj;
        if (this.scope) {
            [].slice.call(document.querySelectorAll(this.scope)).forEach((ele) => {
                if (getComponent(ele, this.getModuleName())) {
                    listObj = getComponent(ele, this.getModuleName());
                }
            });
        }
        return listObj;
    }
    getDragArgs(args, isDragEnd) {
        let elems = this.getSelectedItems();
        if (elems.length) {
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
    }
    onKeyDown(e) {
        this.keyDownHandler(e);
        event.stopPropagation();
    }
    keyDownHandler(e) {
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
                let listObj = this.tBListBox || this.getScopedListBox();
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
    }
    upDownKeyHandler(e) {
        let ul = this.ulElement;
        let defaultIdx = (e.keyCode === 40 || e.keyCode === 36) ? 0 : ul.childElementCount - 1;
        let fliIdx = defaultIdx;
        let fli = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(cssClass.selected)[0];
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
        let cli = ul.children[fliIdx];
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
    }
    KeyUp(e) {
        let char = String.fromCharCode(e.keyCode);
        let isWordCharacter = char.match(/\w/);
        if (!isNullOrUndefined(isWordCharacter)) {
            this.isValidKey = true;
        }
        this.isValidKey = (e.keyCode === 8) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            switch (e.keyCode) {
                default:
                    let text = this.targetElement();
                    let keyCode = e.keyCode;
                    if (this.allowFiltering) {
                        let eventArgsData = {
                            preventDefaultAction: false,
                            text: this.targetElement(),
                            updateData: (dataSource, query, fields) => {
                                if (eventArgsData.cancel) {
                                    return;
                                }
                                this.isFiltered = true;
                                this.remoteFilterAction = true;
                                this.dataUpdater(dataSource, query, fields);
                            },
                            event: e,
                            cancel: false
                        };
                        this.trigger('filtering', eventArgsData, (args) => {
                            this.isDataFetched = false;
                            if (eventArgsData.cancel || (this.filterInput.value !== '' && this.isFiltered)) {
                                return;
                            }
                            if (!eventArgsData.cancel && !this.isCustomFiltering && !eventArgsData.preventDefaultAction) {
                                this.inputString = this.filterInput.value;
                                this.filteringAction(this.jsonData, new Query(), this.fields);
                            }
                            if (!this.isFiltered && !this.isCustomFiltering && !eventArgsData.preventDefaultAction) {
                                this.dataUpdater(this.jsonData, new Query(), this.fields);
                            }
                        });
                    }
            }
        }
    }
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     */
    filter(dataSource, query, fields) {
        this.isCustomFiltering = true;
        this.filteringAction(dataSource, query, fields);
    }
    filteringAction(dataSource, query, fields) {
        this.resetList(dataSource, fields, query);
    }
    targetElement() {
        this.targetInputElement = this.list.getElementsByClassName('e-input-filter')[0];
        return this.targetInputElement.value;
    }
    dataUpdater(dataSource, query, fields) {
        this.isDataFetched = false;
        let backCommand = true;
        if (this.targetElement().trim() === '') {
            let list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            if (backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.jsonData);
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.selectionSettings.showCheckbox, e: this });
            }
        }
        else {
            this.resetList(dataSource, fields, query);
        }
    }
    focusOutHandler() {
        let ele = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
        }
        if (this.allowFiltering) {
            this.refreshClearIcon();
        }
    }
    getValidIndex(cli, index, keyCode) {
        let cul = this.ulElement;
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
    }
    updateSelectedOptions() {
        let selectedOptions = [];
        let values = [];
        extend(values, this.value);
        this.getSelectedItems().forEach((ele) => {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(this.getFormattedValue(ele.getAttribute('data-value')));
            }
        });
        if (this.mainList.childElementCount === this.ulElement.childElementCount) {
            if (this.allowFiltering && this.selectionSettings.showCheckbox) {
                for (let i = 0; i < selectedOptions.length; i++) {
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
    }
    clearSelection(values = this.value) {
        if (this.selectionSettings.showCheckbox) {
            let dvalue;
            this.getSelectedItems().forEach((li) => {
                dvalue = this.getFormattedValue(li.getAttribute('data-value'));
                if (values.indexOf(dvalue) < 0) {
                    li.getElementsByClassName('e-check')[0].classList.remove('e-check');
                    li.getElementsByClassName('e-checkbox-wrapper')[0].removeAttribute('aria-checked');
                    li.removeAttribute('aria-selected');
                }
            });
        }
    }
    ;
    setSelection(values = this.value, isSelect = true, isText = false) {
        let li;
        let liselect;
        if (values) {
            values.forEach((value) => {
                let text;
                if (isText) {
                    if (isBlazor() && typeof (value) === 'object') {
                        text = value[this.fields.text || 'text'];
                        if (isNullOrUndefined(text)) {
                            return;
                        }
                        text = this.getValueByText(text);
                    }
                    else {
                        text = this.getValueByText(value);
                    }
                }
                else {
                    text = value;
                }
                li = this.list.querySelector('[data-value="' + text + '"]');
                if (li) {
                    if (this.selectionSettings.showCheckbox) {
                        liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
                    }
                    else {
                        liselect = li.classList.contains('e-selected');
                    }
                    if (!isSelect && liselect || isSelect && !liselect && li) {
                        if (this.selectionSettings.showCheckbox) {
                            this.notify('updatelist', { li: li, module: 'listbox' });
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
    }
    updateSelectTag() {
        let ele = this.getSelectTag();
        let innerHTML = '';
        ele.innerHTML = '';
        if (this.value) {
            for (let i = 0, len = this.value.length; i < len; i++) {
                innerHTML += '<option selected value="' + this.value[i] + '"></option>';
            }
            ele.innerHTML += innerHTML;
        }
        this.checkSelectAll();
    }
    checkDisabledState(inst) {
        return (isBlazor() ? inst.ulElement.querySelectorAll('.' + cssClass.li).length : inst.ulElement.childElementCount) === 0;
    }
    updateToolBarState() {
        if (this.toolbarSettings.items.length) {
            let listObj = this.getScopedListBox();
            let wrap = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach((value) => {
                let btn = wrap.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = this.checkDisabledState(this);
                        break;
                    case 'moveAllFrom':
                        btn.disabled = this.checkDisabledState(listObj);
                        break;
                    case 'moveFrom':
                        btn.disabled = listObj.value && listObj.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[0]) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[this.ulElement.childElementCount - 1]) ? false : true;
                        break;
                    default:
                        btn.disabled = this.value && this.value.length ? false : true;
                        break;
                }
            });
        }
    }
    setCheckboxPosition() {
        let listWrap = this.list;
        if (!this.initLoad && this.selectionSettings.checkboxPosition === 'Left') {
            listWrap.classList.remove('e-right');
        }
        if (this.selectionSettings.checkboxPosition === 'Right') {
            listWrap.classList.add('e-right');
        }
    }
    showCheckbox(showCheckbox) {
        let index = 0;
        let liColl = this.list.lastElementChild.querySelectorAll('li');
        let liCollLen = this.list.lastElementChild.getElementsByClassName('e-list-item').length;
        if (showCheckbox) {
            if (!isBlazor()) {
                this.ulElement = this.renderItems(this.listData, this.fields);
                this.mainList = this.ulElement;
                this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
                this.list.appendChild(this.ulElement);
            }
            if (this.selectionSettings.showSelectAll && !this.list.getElementsByClassName('e-selectall-parent')[0]) {
                let l10nShow = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
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
            if (!isBlazor()) {
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
    }
    isSelected(ele) {
        if (!isNullOrUndefined(ele)) {
            return ele.classList.contains(cssClass.selected) || ele.querySelector('.e-check') !== null;
        }
        else {
            return false;
        }
    }
    getSelectTag() {
        return this.list.getElementsByClassName('e-hidden-select')[0];
    }
    getToolElem() {
        return this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
    }
    formResetHandler() {
        this.value = this.initialSelectedOptions;
    }
    /**
     * Return the module name.
     * @private
     */
    getModuleName() {
        return 'listbox';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     */
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    getLocaleName() {
        return 'listbox';
    }
    ;
    destroy() {
        if (this.itemTemplate) {
            resetBlazorTemplate(`${this.element.id}${ITEMTEMPLATE_PROPERTY$1}`, ITEMTEMPLATE_PROPERTY$1);
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
            super.destroy();
        }
        if (this.itemTemplate) {
            this.clearTemplate();
        }
    }
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let wrap = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        super.onPropertyChanged(newProp, oldProp);
        this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
        for (let prop of Object.keys(newProp)) {
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
                    let ele;
                    let pos = newProp.toolbarSettings.position;
                    let toolElem = this.getToolElem();
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
                    let showSelectAll = newProp.selectionSettings.showSelectAll;
                    let showCheckbox = newProp.selectionSettings.showCheckbox;
                    if (!isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            let l10nSel = new L10n(this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
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
    }
};
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
    Property('No records found')
], ListBox.prototype, "noRecordsTemplate", void 0);
__decorate$6([
    Property('Request failed')
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
const listBoxClasses = {
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

export { incrementalSearch, Search, highlightSearch, revertHighlightSearch, FieldSettings, dropDownBaseClasses, DropDownBase, dropDownListClasses, DropDownList, Fields, TreeSettings, DropDownTree, ComboBox, AutoComplete, MultiSelect, CheckBoxSelection, createFloatLabel, updateFloatLabelState, removeFloating, setPlaceHolder, floatLabelFocus, floatLabelBlur, SelectionSettings, ToolbarSettings, ListBox };
//# sourceMappingURL=ej2-dropdowns.es2015.js.map
