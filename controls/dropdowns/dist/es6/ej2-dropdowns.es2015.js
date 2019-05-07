import { Animation, Browser, ChildProperty, Complex, Component, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getComponent, getUniqueID, getValue, isNullOrUndefined, isUndefined, prepend, remove, removeClass, rippleEffect, select, setStyleAttribute, setValue } from '@syncfusion/ej2-base';
import { DataManager, DataUtil, Predicate, Query } from '@syncfusion/ej2-data';
import { ListBase, Sortable, cssClass, moveTo } from '@syncfusion/ej2-lists';
import { Popup, createSpinner, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { Button, createCheckBox } from '@syncfusion/ej2-buttons';

/**
 * IncrementalSearch module file
 */
let queryString = '';
let prevString = '';
let matches = [];
let activeClass = 'e-active';
/**
 * Search and focus the list item based on key code matches with list text content
 * @param  { number } keyCode - Specifies the key code which pressed on keyboard events.
 * @param  { HTMLElement[]] } items - Specifies an array of HTMLElement, from which matches find has done.
 * @param { number } selectedIndex - Specifies the selected item in list item, so that search will happen
 * after selected item otherwise it will do from initial.
 * @param  { boolean } ignoreCase - Specifies the case consideration when search has done.
 */
function incrementalSearch(keyCode, items, selectedIndex, ignoreCase) {
    queryString += String.fromCharCode(keyCode);
    setTimeout(() => { queryString = ''; }, 1000);
    let index;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevString === queryString) {
        for (let i = 0; i < matches.length; i++) {
            if (matches[i].classList.contains(activeClass)) {
                index = i;
                break;
            }
        }
        index = index + 1;
        return matches[index];
    }
    else {
        let listItems = items;
        let strLength = queryString.length;
        let text;
        let item;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        let i = selectedIndex;
        matches = [];
        do {
            if (i === listItems.length) {
                i = -1;
            }
            i === -1 ? index = 0 : index = i;
            item = listItems[index];
            text = ignoreCase ? item.innerText.toLowerCase() : item.innerText;
            if (text.substr(0, strLength) === queryString) {
                matches.push(listItems[index]);
            }
            i++;
        } while (i !== selectedIndex);
        prevString = queryString;
        return matches[0];
    }
}
function Search(inputVal, items, searchType, ignoreCase) {
    let listItems = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    let itemData = { item: null, index: null };
    if (inputVal.length) {
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
function highlightSearch(element, query, ignoreCase, type) {
    if (query === '') {
        return;
    }
    else {
        let ignoreRegex = ignoreCase ? 'gim' : 'gm';
        query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        let replaceQuery = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
        findTextNode(element, new RegExp(replaceQuery, ignoreRegex));
    }
}
function findTextNode(element, pattern) {
    for (let index = 0; element.childNodes && (index < element.childNodes.length); index++) {
        if (element.childNodes[index].nodeType === 3) {
            element.innerHTML = element.innerHTML.replace(pattern, '<span class="e-highlight">$1</span>');
            break;
        }
        else {
            findTextNode(element.childNodes[index], pattern);
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
    li: cssClass.li,
    group: cssClass.group,
    disabled: cssClass.disabled,
    grouping: 'e-dd-group'
};
/**
 * DropDownBase component will generate the list items based on given data and act as base class to drop-down related components
 */
let DropDownBase = class DropDownBase extends Component {
    /**
     * * Constructor for DropDownBase class
     */
    constructor(options, element) {
        super(options, element);
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
                    if (this.checkIgnoreCase(getValue(fields.text, item).toString(), text)) {
                        value = getValue(fields.value, item);
                    }
                });
            }
            else {
                if (isTextByValue) {
                    dataSource.filter((item) => {
                        let itemValue = getValue(fields.value, item);
                        if (!isNullOrUndefined(itemValue) && itemValue.toString() === value.toString()) {
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
    l10nUpdate(actionFailure) {
        let ele = this.getModuleName() === 'listbox' ? this.ulElement : this.list;
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            let template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            let compiledString;
            ele.innerHTML = '';
            compiledString = compile(template);
            for (let item of compiledString({})) {
                ele.appendChild(item);
            }
        }
        else {
            let l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            let componentLocale = new L10n(this.getLocaleName(), {}, this.locale);
            if (componentLocale.getConstant('actionFailureTemplate') !== '') {
                this.l10n = componentLocale;
            }
            else {
                this.l10n = new L10n(this.getModuleName() === 'listbox' ? 'listbox' : 'dropdowns', l10nLocale, this.locale);
            }
            ele.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
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
            if (typeof getValue((this.fields.value ? this.fields.value : 'value'), item.item) === 'number'
                || item.typeof === 'number') {
                return parseInt(value, 10);
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
    }
    /**
     * Creates the list items of DropDownBase component.
     */
    setListData(dataSource, fields, query) {
        fields = fields ? fields : this.fields;
        let ulElement;
        this.isActive = true;
        let eventArgs = { cancel: false, data: dataSource, query: query };
        this.trigger('actionBegin', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.showSpinner();
        if (dataSource instanceof DataManager) {
            this.isRequested = true;
            if (this.isDataFetched) {
                this.emptyDataRequest(fields);
                return;
            }
            eventArgs.data.executeQuery(this.getQuery(eventArgs.query)).then((e) => {
                this.trigger('actionComplete', e);
                if (e.cancel) {
                    return;
                }
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
            this.trigger('actionComplete', localDataArgs);
            if (localDataArgs.cancel) {
                return;
            }
            ulElement = this.renderItems(localDataArgs.result, fields);
            this.onActionComplete(ulElement, localDataArgs.result);
            if (this.groupTemplate) {
                this.renderGroupTemplate(ulElement);
            }
            this.bindChildItems(localDataArgs.result, ulElement, fields);
        }
    }
    bindChildItems(listItems, ulElement, fields, e) {
        if (listItems.length >= 100 && this.getModuleName() === 'autocomplete') {
            setTimeout(() => {
                let childNode = this.remainingItems(this.sortedData, fields);
                append(childNode, ulElement);
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
        let listArr = [].slice.call(list.querySelectorAll(findNode));
        for (let index = 0; index < listArr.length; index++) {
            if (listArr[index].getAttribute(attribute) === (value + '')) {
                liElement = listArr[index];
                break;
            }
        }
        return liElement;
    }
    raiseDataBound(listItems, e) {
        this.hideSpinner();
        this.trigger('dataBound', { items: listItems, e: e });
    }
    remainingItems(dataSource, fields) {
        let spliceData = new DataManager(dataSource).executeLocal(new Query().skip(100));
        if (this.itemTemplate) {
            let listElements = this.templateListItem(spliceData, fields);
            return [].slice.call(listElements.childNodes);
        }
        let type = this.typeOfData(spliceData).typeof;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return ListBase.createListItemFromArray(this.createElement, spliceData, true, this.listOption(spliceData, fields));
        }
        return ListBase.createListItemFromJson(this.createElement, spliceData, this.listOption(spliceData, fields), 1, true);
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
        this.list.innerHTML = '';
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
            let headerItems = listEle.querySelectorAll('.' + dropDownBaseClasses.group);
            let tempHeaders = ListBase.renderGroupTemplate(this.groupTemplate, dataSource, this.fields.properties, headerItems);
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
        return ListBase.createList(this.createElement, (this.getModuleName() === 'autocomplete') ? spliceData : dataSource, options, true);
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
        let liCollections = this.ulElement.querySelectorAll('li');
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
        }
        else {
            ulElement = this.createListItems(listData, fields);
        }
        return ulElement;
    }
    ;
    templateListItem(dataSource, fields) {
        let option = this.listOption(dataSource, fields);
        return ListBase.renderContentTemplate(this.createElement, this.itemTemplate, dataSource, fields.properties, option);
    }
    typeOfData(items) {
        let item = { typeof: null, item: null };
        for (let i = 0; (!isNullOrUndefined(items) && i < items.length); i++) {
            if (!isNullOrUndefined(items[i])) {
                return item = { typeof: typeof items[i], item: items[i] };
            }
        }
        return item;
    }
    setFixedHeader() {
        this.list.parentElement.style.display = 'block';
        let liWidth = this.liCollections[0].offsetWidth;
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
            this.setListData(dataSource, fields, query);
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
        if (this.fields.groupBy || !isNullOrUndefined(group)) {
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
     */
    addItem(items, itemIndex) {
        if (!this.list || this.list.textContent === this.noRecordsTemplate) {
            this.renderList();
        }
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
                append(compiledString(item), li);
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
        }
        if (itemsCount === 0 && isNullOrUndefined(this.list.querySelector('ul'))) {
            this.list.innerHTML = '';
            this.list.classList.remove(dropDownBaseClasses.noData);
            this.list.appendChild(this.ulElement);
            append(liCollections, this.ulElement);
        }
        else {
            for (let i = 0; i < items.length; i++) {
                if (this.liCollections[index]) {
                    this.liCollections[index].parentNode.insertBefore(liCollections[i], this.liCollections[index]);
                }
                else {
                    this.ulElement.appendChild(liCollections[i]);
                }
                let tempLi = [].slice.call(this.liCollections);
                tempLi.splice(index, 0, liCollections[i]);
                this.liCollections = tempLi;
                index += 1;
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
    updateActionCompleteData(li, item) {
        // this is for ComboBox custom value
    }
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
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
], DropDownBase.prototype, "enableRtl", void 0);
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
    }
    ;
    /**
     * Initialize the event handler.
     * @private
     */
    preRender() {
        this.element.style.opacity = '0';
        this.initializeData();
        super.preRender();
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
        super.render(isEmptyData);
        this.wireListEvents();
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
        this.clear(e);
    }
    resetFocusElement() {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete') {
            let li = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if (li) {
                li.classList.add(dropDownListClasses.focus);
            }
        }
    }
    clear(e, properties) {
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
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true), this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
        }
        this.hiddenElement.innerHTML = '';
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
                    this.inputWrapper.container.classList.add(this.htmlAttributes[htmlAttr]);
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
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck'];
                    let validateAttr = ['name', 'required'];
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputElement) :
                            this.element.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
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
            this.focusOutAction();
            this.isTabKey = false;
        }
        if (this.isRequested && !this.isPopupOpen && !this.isPreventBlur) {
            this.isActive = false;
            this.beforePopupOpen = false;
        }
    }
    focusOutAction() {
        this.isInteracted = false;
        this.focusOut();
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
            if (this.inputElement.value !== '') {
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
                this.renderList();
            }
            this.searchKeyEvent = e;
            if (!this.isRequested && !isNullOrUndefined(this.list.querySelector('li')) && this.enabled) {
                this.incrementalSearch(e);
            }
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
        let hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, dropDownBaseClasses.hover);
        }
    }
    ;
    isValidLI(li) {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    }
    ;
    incrementalSearch(e) {
        if (this.liCollections.length > 0) {
            let li = incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true);
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
            if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
                isNavigation && this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if (isTabAction && this.isPopupOpen || e.action === 'escape') {
                e.preventDefault();
            }
            this.isSelected = e.action === 'escape' ? false : this.isSelected;
            this.isTyped = (isNavigation || e.action === 'escape') ? false : this.isTyped;
            switch (e.action) {
                case 'down':
                case 'up':
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
                        this.setSelection(nextItem, e);
                    }
                    e.preventDefault();
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
                    if (this.getModuleName() === 'dropdownlist') {
                        e.preventDefault();
                        if (this.activeIndex === 0) {
                            return;
                        }
                        this.setSelection(this.liCollections[0], e);
                    }
                    break;
                case 'end':
                    if (this.getModuleName() === 'dropdownlist') {
                        e.preventDefault();
                        let lastLi = this.getItems().length - 1;
                        if (this.activeIndex === lastLi) {
                            return;
                        }
                        this.setSelection(this.liCollections[lastLi], e);
                    }
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
                    this.hidePopup();
                    this.focusDropDown(e);
                    break;
                case 'enter':
                    this.selectCurrentItem(e);
                    break;
                case 'escape':
                case 'tab':
                case 'close':
                    if (this.isPopupOpen) {
                        this.hidePopup();
                        this.focusDropDown(e);
                    }
                    break;
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
    onDocumentClick(e) {
        let target = e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
            !this.inputWrapper.container.contains(e.target)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                let isActive = this.isRequested;
                this.isInteracted = false;
                this.hidePopup();
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
            if (!this.isSecondClick) {
                setTimeout(() => { proxy.cloneElements(); proxy.isSecondClick = true; }, 100);
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
    updateSelectedItem(li, e, preventSelect) {
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        let value = this.getFormattedValue(li.getAttribute('data-value'));
        let selectedData = this.getDataByValue(value);
        if (!this.initial && !preventSelect) {
            let items = this.detachChanges(selectedData);
            this.isSelected = true;
            let eventArgs = {
                e: e,
                item: li,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs);
            if (eventArgs.cancel) {
                li.classList.remove(dropDownBaseClasses.selected);
                return true;
            }
        }
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li;
        this.itemData = selectedData;
        let focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
        return false;
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
            Input.setValue(null, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (this.valueTemplate && this.itemData !== null) {
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
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.selected)) {
            let argsCancel = this.updateSelectedItem(li, e, false);
            if (argsCancel) {
                return;
            }
        }
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
            if (this.isFilterLayout()) {
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
    }
    setValueTemplate() {
        let compiledString;
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        this.valueTempElement.innerHTML = '';
        compiledString = compile(this.valueTemplate);
        for (let item of compiledString(this.itemData)) {
            this.valueTempElement.appendChild(item);
        }
    }
    removeSelection() {
        let selectedItems = this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
        if (selectedItems.length) {
            removeClass(selectedItems, dropDownBaseClasses.selected);
            selectedItems[0].removeAttribute('aria-selected');
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
        this.setProperties({ 'value': dataItem.value, 'index': index, 'text': dataItem.text }, true);
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
            this.trigger('change', eventArgs);
        }
    }
    setHiddenValue() {
        if (!isNullOrUndefined(this.value)) {
            this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
            let selectedElement = this.hiddenElement.querySelector('option');
            selectedElement.setAttribute('value', this.value.toString());
        }
        else {
            this.hiddenElement.innerHTML = '';
        }
    }
    /**
     * Filter bar implementation
     */
    onFilterUp(e) {
        if (this.isValidKey || e.keyCode === 40 || e.keyCode === 38) {
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
                    else if (this.typedString === '') {
                        this.resetFocusElement();
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
                if (this.isPopupOpen) {
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
    getSelectionPoints() {
        let input = this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    }
    searchLists(e) {
        this.isTyped = true;
        this.activeIndex = null;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            let clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
        this.isDataFetched = false;
        if (this.isFiltering()) {
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
            this.trigger('filtering', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
            if (!this.isCustomFilter && !eventArgs.preventDefaultAction) {
                let filterQuery = this.query ? this.query.clone() : new Query();
                let dataType = this.typeOfData(this.dataSource).typeof;
                if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                    filterQuery.where('', 'startswith', this.filterInput.value, true, this.ignoreAccent);
                }
                else {
                    let fields = this.fields;
                    filterQuery.where(!isNullOrUndefined(fields.text) ? fields.text : '', 'startswith', this.filterInput.value, true, this.ignoreAccent);
                }
                this.filteringAction(this.dataSource, filterQuery, this.fields);
            }
        }
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
                if ((this.element.tagName === 'SELECT' && this.element.options.length > 0)
                    || (this.element.tagName === 'UL' && this.element.childNodes.length > 0)) {
                    let data = dataSource instanceof Array ? (dataSource.length > 0)
                        : !isNullOrUndefined(dataSource);
                    if (!data && this.listData.length > 0) {
                        dataSource = this.listData;
                    }
                }
                query = (this.filterInput.value.trim() === '') ? null : query;
                this.resetList(dataSource, fields, query);
            }
        }
    }
    setSearchBox(popupElement) {
        if (this.isFiltering()) {
            let parentElement = this.createElement('span', {
                className: dropDownListClasses.filterParent
            });
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
            EventHandler.add(this.filterInput, 'input', this.onInput, this);
            EventHandler.add(this.filterInput, 'keyup', this.onFilterUp, this);
            EventHandler.add(this.filterInput, 'keydown', this.onFilterDown, this);
            EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            return this.filterInputObj;
        }
        else {
            return inputObject;
        }
    }
    ;
    onInput() {
        this.isValidKey = true;
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
    updateActionCompleteData(li, item) {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
            if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) > 0) {
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
        this.trigger('beforeOpen', args);
        if (args.cancel) {
            return;
        }
        let popupEle = this.createElement('div', {
            id: this.element.id + '_popup', className: 'e-ddl e-popup ' + (this.cssClass != null ? this.cssClass : '')
        });
        let searchBox = this.setSearchBox(popupEle);
        this.listHeight = formatUnit(this.popupHeight);
        if (this.headerTemplate) {
            this.setHeaderTemplate(popupEle);
        }
        append([this.list], popupEle);
        if (this.footerTemplate) {
            this.setFooterTemplate(popupEle);
        }
        document.body.appendChild(popupEle);
        popupEle.style.visibility = 'hidden';
        if (this.popupHeight !== 'auto') {
            this.searchBoxHeight = 0;
            if (!isNullOrUndefined(searchBox.container)) {
                this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                this.listHeight = (parseInt(this.listHeight, 10) - (this.searchBoxHeight)).toString() + 'px';
            }
            if (this.headerTemplate) {
                let height = Math.round(this.header.getBoundingClientRect().height);
                this.listHeight = (parseInt(this.listHeight, 10) - (height + this.searchBoxHeight)).toString() + 'px';
            }
            if (this.footerTemplate) {
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
        let eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('open', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        addClass([this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
        this.popupObj.show(new Animation(eventArgs.animation), (this.zIndex === 1000) ? this.element : null);
    }
    checkCollision(popupEle) {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            let collision = isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
        }
    }
    getOffsetValue(popupEle) {
        let popupStyles = getComputedStyle(popupEle);
        let borderTop = parseInt(popupStyles.borderTop, 10);
        let borderBottom = parseInt(popupStyles.borderBottom, 10);
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
                this.isNotSearchList = false;
                this.isDocumentClick = false;
                this.destroyPopup();
            },
            open: () => {
                EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
                this.isPopupOpen = true;
                if (this.isFilterLayout()) {
                    removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    this.isFilterFocus = true;
                    this.filterInput.focus();
                    if (this.inputWrapper.clearButton) {
                        addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                this.activeStateChange();
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
    scrollTop() {
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
        let eventArgs = { popup: this.popupObj, cancel: false, animation: animModel };
        this.trigger('close', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (this.getModuleName() === 'autocomplete') {
            this.rippleFun();
        }
        if (this.isPopupOpen) {
            this.popupObj.hide(new Animation(eventArgs.animation));
        }
        else {
            this.destroyPopup();
        }
    }
    destroyPopup() {
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
    render() {
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
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            buttons: this.isPopupButton() ? [dropDownListClasses.icon] : null,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.getModuleName() === 'dropdownlist' ? true : this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
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
        compiledString = compile(this.footerTemplate);
        for (let item of compiledString({})) {
            this.footer.appendChild(item);
        }
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
        compiledString = compile(this.headerTemplate);
        for (let item of compiledString({})) {
            this.header.appendChild(item);
        }
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
            addClass([this.popupObj.element], 'e-popup-close');
        }
    }
    checkDatasource(newProp) {
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
    }
    updateDataSource(props) {
        if (this.inputElement.value !== '' || (!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
            this.clear(null, props);
        }
        if (!(!isNullOrUndefined(props) && (isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof DataManager) && props.dataSource.length === 0)))) {
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
            this.checkDatasource(newProp);
            this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
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
                    setStyleAttribute(this.inputWrapper.container, { 'width': formatUnit(newProp.width) });
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
                    this.setCssClass(newProp, oldProp);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'text':
                    if (newProp.text === null) {
                        this.clear();
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
                            if (this.liCollections.length === 100 &&
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
                        this.clear();
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
                            if (this.liCollections.length === 100 &&
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
                        this.clear();
                        break;
                    }
                    if (!this.list) {
                        if (this.dataSource instanceof DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        let element = this.liCollections[newProp.index];
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections.length === 100 &&
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
    setCssClass(newProp, oldProp) {
        this.inputWrapper.container.classList.remove(oldProp.cssClass);
        Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.element.classList.remove(oldProp.cssClass);
            this.popupObj.element.classList.add(newProp.cssClass);
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
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        if (this.isFiltering() && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0] && !this.itemTemplate) {
            this.isActive = true;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        }
        else if (isNullOrUndefined(this.list) || !isUndefined(this.list) && this.list.classList.contains(dropDownBaseClasses.noData)) {
            this.renderList();
        }
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
    /**
     * Hides the popup if it is in an open state.
     * @returns void.
     */
    hidePopup() {
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.isEscapeKey = false;
            if (!isNullOrUndefined(this.index)) {
                this.selectedLI = this.liCollections[this.index];
                this.updateSelectedItem(this.selectedLI, null, true);
                if (this.valueTemplate && this.itemData !== null) {
                    this.setValueTemplate();
                }
            }
            else {
                this.resetSelection();
            }
        }
        this.closePopup();
        let dataItem = this.getItemData();
        if (this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            !isNullOrUndefined(this.selectedLI) && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clear();
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
    focusOut() {
        if (!this.enabled) {
            return;
        }
        this.isTyped = true;
        this.hidePopup();
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
        this.hidePopup();
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
        }
        if (this.element && !this.element.classList.contains('e-' + this.getModuleName())) {
            return;
        }
        let attrArray = ['readonly', 'aria-disabled', 'aria-placeholder',
            'placeholder', 'aria-owns', 'aria-labelledby', 'aria-haspopup', 'aria-expanded',
            'aria-activedescendant', 'autocomplete', 'aria-readonly', 'autocorrect',
            'autocapitalize', 'spellcheck', 'aria-autocomplete'];
        attrArray.forEach((value) => {
            this.inputElement.removeAttribute(value);
        });
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
            this.customValue();
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
            if (this.filterInput.value.trim() === '') {
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
        super.onActionComplete(ulElement, list, e);
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
            this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
        }
    }
    /**
     * Shows the spinner loader.
     * @returns void.
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
    clear(e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clear(e);
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
            this.removeFocus();
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
            this.clear(e);
        }
        else if (this.isTyped && !this.isSelected && isNullOrUndefined(li)) {
            this.customValue();
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
        this.onFocus();
    }
    dropDownClick(e) {
        e.preventDefault();
        if (Browser.isDevice && !this.allowFiltering) {
            this.preventFocus = true;
        }
        super.dropDownClick(e);
    }
    customValue() {
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
                let fields = this.fields;
                let eventArgs;
                eventArgs = { text: value, item: {} };
                if (!this.initial) {
                    this.trigger('customValueSpecifier', eventArgs);
                }
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
            }
            else {
                this.isSelectCustom = false;
                this.setProperties({ value: value });
            }
            if (previousValue !== this.value) {
                this.onChangeEvent(null);
            }
        }
        else if (this.allowCustom) {
            this.isSelectCustom = true;
        }
    }
    /**
     * Dynamically change the value of properties.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.getModuleName() === 'combobox') {
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
     * Hides the popup if it is in open state.
     * @returns void.
     */
    hidePopup() {
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
                    this.onChangeEvent(null);
                    this.isSelectCustom = false;
                }
                super.hidePopup();
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
                this.customValue();
            }
        }
        if (isNullOrUndefined(this.listData) && this.allowCustom && !isNullOrUndefined(inputValue) && inputValue !== this.value) {
            this.customValue();
        }
        super.hidePopup();
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
};
__decorate$2([
    Property(false)
], ComboBox.prototype, "autofill", void 0);
__decorate$2([
    Property(true)
], ComboBox.prototype, "allowCustom", void 0);
__decorate$2([
    Property({})
], ComboBox.prototype, "htmlAttributes", void 0);
__decorate$2([
    Property(false)
], ComboBox.prototype, "allowFiltering", void 0);
__decorate$2([
    Property(null)
], ComboBox.prototype, "query", void 0);
__decorate$2([
    Property(null)
], ComboBox.prototype, "index", void 0);
__decorate$2([
    Property(true)
], ComboBox.prototype, "showClearButton", void 0);
__decorate$2([
    Event()
], ComboBox.prototype, "customValueSpecifier", void 0);
__decorate$2([
    Event()
], ComboBox.prototype, "filtering", void 0);
__decorate$2([
    Property(null)
], ComboBox.prototype, "valueTemplate", void 0);
__decorate$2([
    Property('Never')
], ComboBox.prototype, "floatLabelType", void 0);
__decorate$2([
    Property(null)
], ComboBox.prototype, "filterBarPlaceholder", void 0);
ComboBox = __decorate$2([
    NotifyPropertyChanges
], ComboBox);

/**
 * export all modules from current location
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
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
        if (this.queryString !== null) {
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
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    }
    searchLists(e) {
        this.isTyped = true;
        this.isDataFetched = this.isSelectCustom = false;
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
        this.trigger('filtering', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (!this.isFiltered && !eventArgs.preventDefaultAction) {
            this.filterAction(this.dataSource, null, this.fields);
        }
    }
    filterAction(dataSource, query, fields) {
        this.beforePopupOpen = true;
        if (this.queryString !== '' && (this.queryString.length >= this.minLength)) {
            this.resetList(dataSource, fields, query);
        }
        else {
            this.hidePopup();
        }
    }
    clear(e, property) {
        if (isNullOrUndefined(property) || (!isNullOrUndefined(property) && isNullOrUndefined(property.dataSource))) {
            super.clear(e);
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
        if (!isNullOrUndefined(e) && e.type === 'keydown' && e.action !== 'enter' && this.isValidLI(li)) {
            let value = this.getFormattedValue(li.getAttribute('data-value'));
            this.activeIndex = this.getIndexByValue(value);
            this.setHoverList(li);
            this.selectedLI = li;
            this.setScrollPosition(e);
            if (this.autofill) {
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
                    highlightSearch(e.item, this.queryString, this.ignoreCase, this.filterType);
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
     */
    showPopup() {
        if (!this.enabled) {
            return;
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        this.preventAutoFill = true;
        if (isNullOrUndefined(this.list)) {
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
                        let button = Input.appendSpan(dropDownListClasses.icon, this.inputWrapper.container, this.createElement);
                        this.inputWrapper.buttons[0] = button;
                        EventHandler.add(this.inputWrapper.buttons[0], 'click', this.dropDownClick, this);
                    }
                    else {
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
__decorate$3([
    Complex({ value: null, iconCss: null, groupBy: null }, FieldSettings)
], AutoComplete.prototype, "fields", void 0);
__decorate$3([
    Property(true)
], AutoComplete.prototype, "ignoreCase", void 0);
__decorate$3([
    Property(false)
], AutoComplete.prototype, "showPopupButton", void 0);
__decorate$3([
    Property(false)
], AutoComplete.prototype, "highlight", void 0);
__decorate$3([
    Property(20)
], AutoComplete.prototype, "suggestionCount", void 0);
__decorate$3([
    Property({})
], AutoComplete.prototype, "htmlAttributes", void 0);
__decorate$3([
    Property(null)
], AutoComplete.prototype, "query", void 0);
__decorate$3([
    Property(1)
], AutoComplete.prototype, "minLength", void 0);
__decorate$3([
    Property('Contains')
], AutoComplete.prototype, "filterType", void 0);
__decorate$3([
    Event()
], AutoComplete.prototype, "filtering", void 0);
__decorate$3([
    Property(null)
], AutoComplete.prototype, "index", void 0);
__decorate$3([
    Property('Never')
], AutoComplete.prototype, "floatLabelType", void 0);
__decorate$3([
    Property(null)
], AutoComplete.prototype, "valueTemplate", void 0);
__decorate$3([
    Property(null)
], AutoComplete.prototype, "filterBarPlaceholder", void 0);
__decorate$3([
    Property(false)
], AutoComplete.prototype, "allowFiltering", void 0);
__decorate$3([
    Property(null)
], AutoComplete.prototype, "text", void 0);
AutoComplete = __decorate$3([
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

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
/* tslint:enable */
const FOCUS = 'e-input-focus';
const DISABLED = 'e-disabled';
const OVER_ALL_WRAPPER = 'e-multiselect e-input-group';
const ELEMENT_WRAPPER = 'e-multi-select-wrapper';
const ELEMENT_MOBILE_WRAPPER = 'e-mob-wrapper';
const HIDE_LIST = 'e-hide-listitem';
const DELIMITER_VIEW = 'e-delim-view';
const CHIP_WRAPPER = 'e-chips-collection';
const CHIP = 'e-chips';
const CHIP_CONTENT = 'e-chipcontent';
const CHIP_CLOSE = 'e-chips-close';
const CHIP_SELECTED = 'e-chip-selected';
const SEARCHBOX_WRAPPER = 'e-searcher';
const DELIMITER_VIEW_WRAPPER = 'e-delimiter';
const ZERO_SIZE = 'e-zero-size';
const REMAIN_WRAPPER = 'e-remain';
const CLOSEICON_CLASS = 'e-chips-close e-close-hooker';
const DELIMITER_WRAPPER = 'e-delim-values';
const POPUP_WRAPPER = 'e-ddl e-popup e-multi-select-list-wrapper';
const INPUT_ELEMENT = 'e-dropdownbase';
const RTL_CLASS = 'e-rtl';
const CLOSE_ICON_HIDE = 'e-close-icon-hide';
const MOBILE_CHIP = 'e-mob-chip';
const FOOTER = 'e-ddl-footer';
const HEADER = 'e-ddl-header';
const DISABLE_ICON = 'e-ddl-disable-icon';
const SPINNER_CLASS$1 = 'e-ms-spinner-icon';
const HIDDEN_ELEMENT = 'e-multi-hidden';
const destroy = 'destroy';
const dropdownIcon = 'e-input-group-icon e-ddl-icon';
const iconAnimation = 'e-icon-anim';
const TOTAL_COUNT_WRAPPER = 'e-delim-total';
const BOX_ELEMENT = 'e-multiselect-box';
const FILTERPARENT = 'e-filter-parent';
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
        this.isValidKey = false;
        this.selectAllEventData = [];
        this.selectAllEventEle = [];
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
                        this.overAllWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                        this.popupWrapper.classList.add(this.htmlAttributes[htmlAttr]);
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
        if (this.cssClass) {
            this.popupWrapper.classList.add(this.cssClass);
            this.overAllWrapper.classList.add(this.cssClass);
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
        this.trigger('open', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.focusAtFirstListItem();
        document.body.appendChild(this.popupObj.element);
        if (this.mode === 'CheckBox' || this.showDropDownIcon) {
            addClass([this.overAllWrapper], [iconAnimation]);
        }
        this.refreshPopup();
        this.popupObj.show(eventArgs.animation, (this.zIndex === 1000) ? this.element : null);
        attributes(this.inputElement, { 'aria-expanded': 'true' });
        if (this.isFirstClick) {
            this.loadTemplate();
        }
    }
    loadTemplate() {
        this.refreshListItems(null);
        if (this.mode === 'CheckBox') {
            this.removeFocus();
        }
        this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', e: this });
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
            'role': 'textbox',
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
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        let value = elements[elements.length - 1].getAttribute('data-value');
        if (!isNullOrUndefined(this.value)) {
            this.tempValues = this.value.slice();
        }
        this.removeValue(value, e);
        this.removeChipSelection();
        this.updateDelimeter(this.delimiterChar);
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
        let proxy = this;
        let valuecheck = [];
        if (!isNullOrUndefined(this.value) && !this.allowCustomValue) {
            for (let i = 0; i < this.value.length; i++) {
                let checkEle = this.findListElement(((this.allowFiltering && !isNullOrUndefined(this.mainList)) ? this.mainList : ulElement), 'li', 'data-value', proxy.value[i]);
                if (!checkEle) {
                    valuecheck.push(proxy.value[i]);
                }
            }
        }
        if (valuecheck.length > 0 && this.dataSource instanceof DataManager && !isNullOrUndefined(this.value)) {
            this.dataSource.executeQuery(this.getForQuery(valuecheck)).then((e) => {
                proxy.addItem(e.result, list.length);
                proxy.updateActionList(ulElement, list, e);
            });
        }
        else {
            this.updateActionList(ulElement, list, e);
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
            this.updateValueState(null, this.value, null);
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
        let searchCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        let searchActiveCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.selected).length;
        if ((searchCount === searchActiveCount) && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'check' });
        }
        if ((searchCount !== searchActiveCount) && (this.mode === 'CheckBox' && this.showSelectAll)) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
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
        if (this.isValidKey) {
            this.isValidKey = false;
            this.expandTextbox();
            this.showOverAllClear();
            switch (e.keyCode) {
                default:
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
                            this.trigger('filtering', eventArgs);
                            if (eventArgs.cancel) {
                                return;
                            }
                            if (!this.isFiltered && !eventArgs.preventDefaultAction) {
                                this.filterAction = true;
                                this.dataUpdater(this.dataSource, null, this.fields);
                            }
                        }
                        else if (this.allowCustomValue) {
                            let query = new Query();
                            query = (text !== '') ? query.where(this.fields.text, 'startswith', text, this.ignoreCase, this.ignoreAccent) : query;
                            this.dataUpdater(this.mainData, query, this.fields);
                            break;
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
        }
    }
    getQuery(query) {
        let filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        if (this.filterAction) {
            if (this.targetElement() !== null) {
                let dataType = this.typeOfData(this.dataSource).typeof;
                if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                    filterQuery.where('', 'startswith', this.targetElement(), this.ignoreCase, this.ignoreAccent);
                }
                else {
                    let fields = this.fields;
                    filterQuery.where(!isNullOrUndefined(fields.text) ? fields.text : '', 'startswith', this.targetElement(), this.ignoreCase, this.ignoreAccent);
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
            let customData = (!isNullOrUndefined(this.mainData) && this.mainData.length > 0) ?
                this.mainData[0] : this.mainData;
            if (typeof (customData) !== 'string') {
                let dataItem = {};
                setValue(fields.text, value, dataItem);
                setValue(fields.value, value, dataItem);
                let tempData = JSON.parse(JSON.stringify(this.listData));
                tempData.splice(0, 0, dataItem);
                this.resetList(tempData, fields ? fields : this.fields, query);
            }
            else {
                let tempData = [this.inputElement.value];
                this.resetList(tempData, fields ? fields : this.fields);
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
            if (e.target && e.target.classList.toString().indexOf(CHIP_CLOSE) !== -1) {
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
    }
    enable(state) {
        if (state) {
            this.overAllWrapper.classList.remove(DISABLED);
            this.inputElement.removeAttribute('disabled');
            attributes(this.inputElement, { 'aria-disabled': 'false' });
            this.ensureAriaDisabled('false');
        }
        else {
            this.overAllWrapper.classList.add(DISABLED);
            this.inputElement.setAttribute('disabled', 'true');
            attributes(this.inputElement, { 'aria-disabled': 'true' });
            this.ensureAriaDisabled('true');
        }
        if (this.enabled !== state) {
            this.enabled = state;
        }
        this.hidePopup();
    }
    onBlur(eve) {
        let target;
        if (!isNullOrUndefined(eve)) {
            target = eve.relatedTarget;
        }
        if (this.popupObj && document.body.contains(this.popupObj.element) && this.popupObj.element.contains(target)) {
            if (this.mode !== 'CheckBox') {
                this.inputElement.focus();
            }
            return;
        }
        if (this.mode === 'CheckBox' && Browser.isIE && !isNullOrUndefined(eve)) {
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
        if (this.mode !== 'Box' && this.mode !== 'CheckBox') {
            this.refreshListItems(null);
            this.updateDelimView();
        }
        this.updateValueState(eve, this.value, this.tempValues);
        this.dispatchEvent(this.hiddenElement, 'change');
        this.overAllClear.style.display = 'none';
        if (this.isPopupOpen()) {
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
    }
    setPlaceholderSize(downIconWidth) {
        if (isNullOrUndefined(this.value) || this.value.length === 0) {
            this.searchWrapper.style.width = ('calc(100% - ' + (downIconWidth + 10)) + 'px';
        }
        else if (!isNullOrUndefined(this.value)) {
            this.searchWrapper.removeAttribute('style');
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
            this.trigger('change', eventArgs);
            this.updateTempValue();
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
        return this.ulElement ? this.ulElement.querySelectorAll('.' + dropDownBaseClasses.li
            + ':not(.' + HIDE_LIST + ')') : null;
    }
    focusIn(e) {
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
                this.updateDelimeter(this.delimiterChar);
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
        boxRange = this.fields.groupBy && !isUndefined(this.fixedHeaderElement) ?
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
        if (li !== null) {
            if (li.classList.contains('e-active')) {
                limit = limit - 1;
            }
            if (this.isValidLI(li) && limit < this.maximumSelectionLength) {
                this.updateListSelection(li, e);
                this.addListFocus(li);
                if (this.mode === 'CheckBox') {
                    this.updateDelimView();
                    this.updateDelimeter(this.delimiterChar);
                    this.refreshInputHight();
                }
                else {
                    this.updateDelimeter(this.delimiterChar);
                }
                this.makeTextBoxEmpty();
                if (this.mode !== 'CheckBox') {
                    this.refreshListItems(li.textContent);
                }
                this.refreshPopup();
            }
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
            if (this.sortOrder === 'Descending' || this.sortOrder === 'Ascending') {
                list = this.ulElement.cloneNode ? this.ulElement.cloneNode(true) : this.ulElement;
            }
            else {
                list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
            }
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
                        this.scrollBottom(elements[temp], temp);
                    }
                }
                else {
                    if (temp > 0) {
                        this.removeFocus();
                        this.addListFocus(elements[--temp]);
                        this.scrollTop(elements[temp], temp);
                    }
                }
            }
        }
    }
    moveBy(position, e) {
        let elements;
        let selectedElem;
        let temp;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
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
            let elem = closest(e.target, '.' + CHIP);
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
            this.updateDelimeter(this.delimiterChar);
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
    removeValue(value, eve, length) {
        let index = this.value.indexOf(this.getFormattedValue(value));
        if (index === -1 && this.allowCustomValue && !isNullOrUndefined(value)) {
            index = this.value.indexOf(value.toString());
        }
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
            this.trigger('removing', eventArgs);
            if (eventArgs.cancel) {
                return true;
            }
            this.value.splice(index, 1);
            this.setProperties({ value: [].concat([], this.value) }, true);
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
                if ((this.value.length !== this.mainData.length) && (this.mode === 'CheckBox' && this.showSelectAll)) {
                    this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
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
                    isChecked: false
                };
                this.trigger('selectedAll', args);
                this.selectAllEventData = [];
                this.selectAllEventEle = [];
            }
        }
    }
    updateMainList(state, value) {
        if (this.allowFiltering) {
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
    updateChipStatus() {
        if (this.value.length) {
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
        this.setProperties({ value: [].concat([], this.value, [value]) }, true);
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
        if (this.initStatus && !isNotTrigger) {
            let val = this.getDataByValue(value);
            let eventArgs = {
                e: eve,
                item: element,
                itemData: val,
                isInteracted: eve ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs);
            if (eventArgs.cancel) {
                return true;
            }
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
        }
        return false;
    }
    addChip(text, value, e) {
        if (this.chipCollectionWrapper) {
            let item = this.getChip(text, value, e);
            if (item.cancel) {
                return;
            }
            this.chipCollectionWrapper.appendChild(item.element);
        }
    }
    removeChipFocus() {
        let elements;
        let closeElements;
        elements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP);
        closeElements = this.chipCollectionWrapper.querySelectorAll('span.' + CHIP_CLOSE.split(' ')[0]);
        removeClass(elements, CHIP_SELECTED);
        if (Browser.isDevice) {
            for (let index = 0; index < closeElements.length; index++) {
                closeElements[index].style.display = 'none';
            }
        }
    }
    onMobileChipInteraction(e) {
        let chipElem = closest(e.target, '.' + CHIP);
        let chipClose = chipElem.querySelector('span.' + CHIP_CLOSE.split(' ')[0]);
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
    getChip(data, value, e) {
        let itemData = { text: value, value: value };
        let chip = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': value, 'title': data }
        });
        let chipContent = this.createElement('span', { className: CHIP_CONTENT });
        let chipClose = this.createElement('span', { className: CHIP_CLOSE });
        if (this.mainData) {
            itemData = this.getDataByValue(value);
        }
        if (this.valueTemplate && !isNullOrUndefined(itemData)) {
            let compiledString = compile(this.valueTemplate);
            for (let item of compiledString(itemData)) {
                chipContent.appendChild(item);
            }
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
        this.trigger('tagging', eventArgs);
        if (eventArgs.cancel) {
            return { cancel: true, element: chip };
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
        return { cancel: false, element: chip };
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
        let fieldProperty = fields.properties;
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
            let args = { cancel: false };
            this.trigger('beforeOpen', args);
            if (args.cancel) {
                return;
            }
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
            else if (this.mode === 'CheckBox' && !this.showSelectAll && (!this.headerTemplate || !this.footerTemplate)) {
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
                enableRtl: this.enableRtl,
                zIndex: this.zIndex,
                close: () => {
                    if (this.popupObj.element.parentElement) {
                        this.popupObj.unwireScrollEvents();
                        detach(this.popupObj.element);
                    }
                },
                open: () => {
                    if (!this.isFirstClick) {
                        let ulElement = this.list.querySelector('ul');
                        if (ulElement) {
                            this.mainList = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                        }
                        this.isFirstClick = true;
                    }
                    this.popupObj.wireScrollEvents();
                    this.loadTemplate();
                    this.setScrollPosition();
                    if (this.allowFiltering) {
                        this.notify('inputFocus', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'focus' });
                    }
                }
            });
            this.popupObj.close();
            this.popupWrapper.style.visibility = '';
            if (this.mode === 'CheckBox' && Browser.isDevice && this.allowFiltering) {
                this.notify('deviceSearchBox', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox' });
            }
        }
    }
    setHeaderTemplate() {
        let compiledString;
        if (this.header) {
            this.header.remove();
        }
        this.header = this.createElement('div');
        addClass([this.header], HEADER);
        compiledString = compile(this.headerTemplate);
        let elements = compiledString({});
        for (let temp = 0; temp < elements.length; temp++) {
            this.header.appendChild(elements[temp]);
        }
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
        addClass([this.footer], FOOTER);
        compiledString = compile(this.footerTemplate);
        let elements = compiledString({});
        for (let temp = 0; temp < elements.length; temp++) {
            this.footer.appendChild(elements[temp]);
        }
        append([this.footer], this.popupWrapper);
        EventHandler.add(this.footer, 'mousedown', this.onListMouseDown, this);
    }
    ClearAll(e) {
        if (this.enabled && !this.readonly) {
            let temp;
            let tempValues = this.value ? this.value.slice() : [];
            if (this.value) {
                let i = 0;
                for (temp = this.value[i]; i < this.value.length; temp = this.value[i]) {
                    if (this.removeValue(temp, e)) {
                        i++;
                    }
                }
            }
            if (this.mainList && this.listData && this.allowFiltering) {
                let list = this.mainList.cloneNode ? this.mainList.cloneNode(true) : this.mainList;
                this.onActionComplete(list, this.mainData);
            }
            this.focusAtFirstListItem();
            this.updateDelimeter(this.delimiterChar);
            if (this.mode !== 'Box' && (!this.inputFocus || this.mode === 'CheckBox')) {
                this.updateDelimView();
            }
            this.makeTextBoxEmpty();
            this.checkPlaceholderSize();
            if (this.isPopupOpen()) {
                this.refreshPopup();
            }
            if (!this.inputFocus) {
                this.updateValueState(e, this.value, tempValues);
                if (this.mode !== 'CheckBox') {
                    this.inputElement.focus();
                }
            }
            if (this.mode === 'CheckBox') {
                this.refreshPlaceHolder();
                this.refreshInputHight();
            }
            e.preventDefault();
        }
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
        EventHandler.add(this.inputElement, 'focus', this.focusIn, this);
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
    }
    onInput() {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        }
        else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
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
    updateData(delimiterChar) {
        let data = '';
        let delim = this.mode === 'Delimiter' || this.mode === 'CheckBox';
        let text = [];
        let temp;
        let tempData = this.listData;
        this.listData = this.mainData;
        this.hiddenElement.innerHTML = '';
        if (!isNullOrUndefined(this.value)) {
            for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
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
        }
        this.listData = tempData;
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
        super.render(isEmptyData);
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
                this.updateValueState(null, this.value, this.tempValues);
                this.updateDelimeter(this.delimiterChar);
                this.refreshInputHight();
            }
            else {
                this.updateDelimeter(this.delimiterChar);
            }
            if (this.mode === 'CheckBox' && this.showSelectAll && (isNullOrUndefined(this.value) || !this.value.length)) {
                this.notify('checkSelectAll', { module: 'CheckBoxSelection', enable: this.mode === 'CheckBox', value: 'uncheck' });
            }
            if (!this.inputFocus) {
                if (this.mode === 'Box') {
                    this.chipCollectionWrapper.style.display = '';
                }
                else if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
                    this.showDelimWrapper();
                }
            }
        }
    }
    updateActionCompleteData(li, item) {
        if (this.value && this.value.indexOf(li.getAttribute('data-value')) > -1) {
            this.mainList = this.ulElement;
            addClass([li], HIDE_LIST);
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
            let argsCancel = this.dispatchSelect(value, e, li, (li.getAttribute('aria-selected') === 'true'), length);
            if (argsCancel) {
                return;
            }
            if ((this.allowCustomValue || this.allowFiltering) && !this.findListElement(this.mainList, 'li', 'data-value', value)) {
                let temp = li.cloneNode(true);
                let data = this.getDataByValue(value);
                append([temp], this.mainList);
                this.mainData.push(data);
                let eventArgs = {
                    newData: data,
                    cancel: false
                };
                this.trigger('customValueSelection', eventArgs);
                if (eventArgs.cancel) {
                    return;
                }
            }
            this.remoteCustomValue = false;
            this.addValue(value, text, e);
        }
        else {
            this.removeValue(value, e, length);
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
        if (this.list) {
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
    }
    ;
    addListFocus(element) {
        if (this.enabled && this.isValidLI(element)) {
            this.removeFocus();
            addClass([element], dropDownBaseClasses.focus);
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
    updateDelimeter(delimChar) {
        this.updateData(delimChar);
    }
    onMouseClick(e) {
        this.scrollFocusStatus = false;
        let target = e.target;
        let li = closest(target, '.' + dropDownBaseClasses.li);
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
                this.updateDelimeter(this.delimiterChar);
                this.refreshInputHight();
            }
            else {
                this.updateDelimeter(this.delimiterChar);
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
        }
        else {
            e.preventDefault();
        }
        if (this.mode !== 'CheckBox') {
            this.refreshListItems(isNullOrUndefined(li) ? null : li.textContent);
        }
        this.refreshPlaceHolder();
    }
    onMouseOver(e) {
        let currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
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
            if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id)) &&
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
        if (((this.value && this.value.length) || this.inputElement.value !== '') && this.showClearButton) {
            this.overAllClear.style.display = '';
        }
        else {
            this.overAllClear.style.display = 'none';
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
                this.spinnerElement = this.createElement('span', { className: CLOSEICON_CLASS + ' ' + SPINNER_CLASS$1 });
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
    updateDelimView() {
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
            let data = '';
            let temp;
            let tempData;
            let tempIndex = 1;
            let wrapperleng;
            let remaining;
            let downIconWidth = 0;
            let overAllContainer;
            this.viewWrapper.innerHTML = '';
            let l10nLocale = {
                noRecordsTemplate: 'No Records Found',
                actionFailureTemplate: 'The Request Failed',
                overflowCountTemplate: '+${count} more..',
                totalCountTemplate: '${count} selected'
            };
            let l10n = new L10n(this.getLocaleName(), {}, this.locale);
            if (l10n.getConstant('actionFailureTemplate') === '') {
                l10n = new L10n('dropdowns', l10nLocale, this.locale);
            }
            let remainContent = l10n.getConstant('overflowCountTemplate');
            let raminElement = this.createElement('span', {
                className: REMAIN_WRAPPER
            });
            let compiledString = compile(remainContent);
            let totalCompiledString = compile(l10n.getConstant('totalCountTemplate'));
            raminElement.appendChild(compiledString({ 'count': this.value.length })[0]);
            this.viewWrapper.appendChild(raminElement);
            let remainSize = raminElement.offsetWidth;
            remove(raminElement);
            if (this.showDropDownIcon) {
                downIconWidth = this.dropIcon.offsetWidth +
                    parseInt(window.getComputedStyle(this.dropIcon).marginRight, 10);
            }
            if (!isNullOrUndefined(this.value)) {
                for (let index = 0; !isNullOrUndefined(this.value[index]); index++) {
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
                            let textArr = this.viewWrapper.innerHTML.split(this.delimiterChar);
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
                let totalWidth = overAllContainer - downIconWidth;
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
    updateRemainWidth(viewWrapper, totalWidth) {
        if (viewWrapper.classList.contains(TOTAL_COUNT_WRAPPER) && totalWidth < (viewWrapper.offsetWidth +
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
        raminElement.appendChild((viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) ?
            compiledString({ 'count': remaining })[0] :
            totalCompiledString({ 'count': remaining })[0]);
        if (viewWrapper.firstChild && viewWrapper.firstChild.nodeType === 3) {
            viewWrapper.classList.remove(TOTAL_COUNT_WRAPPER);
        }
        else {
            viewWrapper.classList.add(TOTAL_COUNT_WRAPPER);
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
        EventHandler.remove(this.inputElement, 'focus', this.focusIn);
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
    }
    selectAllItem(state, event) {
        let li;
        li = this.list.querySelectorAll(state ?
            'li.e-list-item:not([aria-selected="true"]):not(.e-reorder-hide)' :
            'li[aria-selected="true"]:not(.e-reorder-hide)');
        let length = li.length;
        if (li && li.length) {
            let index = 0;
            while (index < length && index <= 50) {
                this.updateListSelection(li[index], event, length - index);
                index++;
            }
            if (length > 50) {
                setTimeout(() => {
                    while (index < length) {
                        this.updateListSelection(li[index], event, length - index);
                        index++;
                    }
                    this.textboxValueUpdate();
                }, 0);
            }
        }
        this.textboxValueUpdate();
        this.checkPlaceholderSize();
    }
    textboxValueUpdate() {
        if (this.mode !== 'Box' && !this.isPopupOpen()) {
            this.updateDelimView();
        }
        else {
            this.searchWrapper.classList.remove(ZERO_SIZE);
        }
        if (this.mode === 'CheckBox') {
            this.updateDelimView();
            this.updateDelimeter(this.delimiterChar);
            this.refreshInputHight();
        }
        else {
            this.updateDelimeter(this.delimiterChar);
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
        if (this.value && this.value.length) {
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
        if (newProp.dataSource && !isNullOrUndefined(Object.keys(newProp.dataSource))) {
            this.mainList = null;
            this.mainData = null;
            this.isFirstClick = false;
        }
        if (this.getModuleName() === 'multiselect') {
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
                    break;
                case 'width':
                    setStyleAttribute(this.overAllWrapper, { 'width': formatUnit(newProp.width) });
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
                    this.popupWrapper.classList.remove(oldProp.cssClass);
                    this.overAllWrapper.classList.remove(oldProp.cssClass);
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
        else if (!this.inputFocus) {
            if (prop === 'text') {
                this.initialTextUpdate();
                newProp = this.value;
            }
            this.initialValueUpdate();
            if (this.mode !== 'Box') {
                this.updateDelimView();
            }
            this.refreshInputHight();
            this.refreshPlaceHolder();
            this.updateValueState(null, newProp, oldProp);
            this.checkPlaceholderSize();
        }
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
            this.trigger('close', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
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
    }
    /**
     * Shows the popup, if the popup in a closed state.
     * @returns void
     */
    showPopup() {
        if (!this.enabled) {
            return;
        }
        if (!this.ulElement) {
            this.beforePopupOpen = true;
            super.render();
            return;
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
    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * parameter
     * `true`   - Selects entire list items.
     * `false`  - Un Selects entire list items.
     * @returns void
     */
    selectAll(state) {
        this.selectAllItems(state);
    }
    getModuleName() {
        return 'multiselect';
    }
    ;
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.setDynValue = this.initStatus = false;
        this.searchWrapper = this.createElement('span', { className: SEARCHBOX_WRAPPER + ' ' + ((this.mode === 'Box') ? BOX_ELEMENT : '') });
        this.viewWrapper = this.createElement('span', { className: DELIMITER_VIEW + ' ' + DELIMITER_WRAPPER, styles: 'display:none;' });
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS, styles: 'display:none;'
        });
        this.componentWrapper = this.createElement('div', { className: ELEMENT_WRAPPER });
        this.overAllWrapper = this.createElement('div', { className: OVER_ALL_WRAPPER });
        if (this.mode === 'CheckBox') {
            addClass([this.overAllWrapper], 'e-checkbox');
        }
        if (Browser.isDevice) {
            this.componentWrapper.classList.add(ELEMENT_MOBILE_WRAPPER);
        }
        this.overAllWrapper.style.width = formatUnit(this.width);
        this.overAllWrapper.appendChild(this.componentWrapper);
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: POPUP_WRAPPER });
        if (this.mode === 'Delimiter' || this.mode === 'CheckBox') {
            this.delimiterWrapper = this.createElement('span', { className: DELIMITER_WRAPPER, styles: 'display:none' });
            this.componentWrapper.appendChild(this.delimiterWrapper);
        }
        else {
            this.chipCollectionWrapper = this.createElement('span', {
                className: CHIP_WRAPPER,
                styles: 'display:none'
            });
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
__decorate$4([
    Property(null)
], MultiSelect.prototype, "cssClass", void 0);
__decorate$4([
    Property('100%')
], MultiSelect.prototype, "width", void 0);
__decorate$4([
    Property('300px')
], MultiSelect.prototype, "popupHeight", void 0);
__decorate$4([
    Property('100%')
], MultiSelect.prototype, "popupWidth", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "placeholder", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "filterBarPlaceholder", void 0);
__decorate$4([
    Property({})
], MultiSelect.prototype, "htmlAttributes", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "valueTemplate", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "headerTemplate", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "footerTemplate", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "itemTemplate", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "allowFiltering", void 0);
__decorate$4([
    Property(false)
], MultiSelect.prototype, "allowCustomValue", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "showClearButton", void 0);
__decorate$4([
    Property(1000)
], MultiSelect.prototype, "maximumSelectionLength", void 0);
__decorate$4([
    Property(false)
], MultiSelect.prototype, "readonly", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "text", void 0);
__decorate$4([
    Property(null)
], MultiSelect.prototype, "value", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "hideSelectedItem", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "closePopupOnSelect", void 0);
__decorate$4([
    Property('Default')
], MultiSelect.prototype, "mode", void 0);
__decorate$4([
    Property(',')
], MultiSelect.prototype, "delimiterChar", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "ignoreCase", void 0);
__decorate$4([
    Property(false)
], MultiSelect.prototype, "showDropDownIcon", void 0);
__decorate$4([
    Property('Never')
], MultiSelect.prototype, "floatLabelType", void 0);
__decorate$4([
    Property(false)
], MultiSelect.prototype, "showSelectAll", void 0);
__decorate$4([
    Property('Select All')
], MultiSelect.prototype, "selectAllText", void 0);
__decorate$4([
    Property('Unselect All')
], MultiSelect.prototype, "unSelectAllText", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "enableSelectionOrder", void 0);
__decorate$4([
    Property(true)
], MultiSelect.prototype, "openOnClick", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "change", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "removing", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "removed", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "selectedAll", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "beforeOpen", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "open", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "close", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "blur", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "focus", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "chipSelection", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "filtering", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "tagging", void 0);
__decorate$4([
    Event()
], MultiSelect.prototype, "customValueSelection", void 0);
MultiSelect = __decorate$4([
    NotifyPropertyChanges
], MultiSelect);

const ICON = 'e-icons';
const CHECKBOXFRAME = 'e-frame';
const CHECK = 'e-check';
const CHECKBOXWRAP = 'e-checkbox-wrapper';
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
        if (item.className !== 'e-list-group-item ' && item.className !== 'e-list-group-item') {
            let checkboxEle = createCheckBox(this.parent.createElement, true);
            let icon = select('div.' + ICON, item);
            let id = item.getAttribute('data-uid');
            item.insertBefore(checkboxEle, item.childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            select('.' + CHECKBOXFRAME, checkboxEle);
            let frame = select('.' + CHECKBOXFRAME, checkboxEle);
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
            if (this.parent.list.classList.contains('e-nodata')) {
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
        if (!isNullOrUndefined(args.e)) {
            target = !isNullOrUndefined(args.e.target) ?
                (args.e.target.classList.contains('e-frame')
                    && (!this.parent.showSelectAll
                        || (this.checkAllParent && !this.checkAllParent.contains(args.e.target)))) ?
                    args.e.target : args.li.querySelector('.e-checkbox-wrapper').childNodes[1]
                : args.li.querySelector('.e-checkbox-wrapper').childNodes[1];
        }
        else {
            target = args.li.lastElementChild.childNodes[1];
        }
        if (this.parent.itemTemplate) {
            target = args.li.firstElementChild.childNodes[1];
        }
        if (!isNullOrUndefined(target)) {
            this.checkWrapper = closest(target, '.' + CHECKBOXWRAP);
        }
        if (!isNullOrUndefined(this.checkWrapper)) {
            let checkElement = select('.' + CHECKBOXFRAME, this.checkWrapper);
            let selectAll = false;
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), args.li, args.e, selectAll);
        }
    }
    validateCheckNode(checkWrap, isCheck, li, e, selectAll) {
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true, selectAll);
    }
    clickHandler(e) {
        let target;
        if (e.currentTarget.classList.contains(this.checkAllParent.className)) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.currentTarget;
        }
        this.checkWrapper = closest(target, '.' + CHECKBOXWRAP);
        let selectAll = true;
        if (!isNullOrUndefined(this.checkWrapper)) {
            let checkElement = select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.validateCheckNode(this.checkWrapper, checkElement.classList.contains(CHECK), null, e, selectAll);
        }
        e.preventDefault();
    }
    changeState(wrapper, state, e, isPrevent, selectAll) {
        let ariaState;
        let frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
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
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            ariaState = 'false';
            if (selectAll) {
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
        attributes(this.parent.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
        addClass([document.body, this.parent.popupObj.element], popupFullScreen);
        this.setSearchBoxPosition();
        this.backIconElement = this.filterInputObj.container.querySelector('.e-back-icon');
        this.clearIconElement = this.filterInputObj.container.querySelector('.' + clearIcon);
        this.clearIconElement.style.visibility = 'hidden';
        EventHandler.add(this.backIconElement, 'click', this.clickOnBackIcon, this);
        EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
    }
    setSearchBoxPosition() {
        let searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.parent.popupObj.element.style.maxHeight = '100%';
        this.parent.popupObj.element.style.width = '100%';
        this.parent.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.parent.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        let clearElement = this.filterInput.parentElement.querySelector('.' + clearIcon);
        detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    }
    targetElement() {
        this.parent.targetInputElement = this.filterInput;
        this.clearIconElement.style.visibility = this.parent.targetInputElement.value === '' ? 'hidden' : 'visible';
        return this.parent.targetInputElement.value;
    }
    onBlur(e) {
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
        if (document.body.contains(this.parent.popupObj.element) && this.parent.popupObj.element.contains(target) && !Browser.isIE
            && this.filterInput) {
            this.filterInput.focus();
            return;
        }
        if (this.parent.scrollFocusStatus && this.filterInput) {
            e.preventDefault();
            this.filterInput.focus();
            this.parent.scrollFocusStatus = false;
            return;
        }
        if (document.body.contains(this.parent.popupObj.element) && !this.parent.popupObj.element.classList.contains('e-popup-close')) {
            this.parent.inputFocus = false;
            this.parent.updateValueState(e, this.parent.value, this.parent.tempValues);
            this.parent.dispatchEvent(this.parent.hiddenElement, 'change');
        }
        if (document.body.contains(this.parent.popupObj.element) &&
            !this.parent.popupObj.element.classList.contains('e-popup-close')) {
            this.parent.inputFocus = false;
            this.parent.overAllWrapper.classList.remove(FOCUS$1);
            this.parent.trigger('blur');
            this.parent.focused = true;
        }
        if (document.body.contains(this.parent.popupObj.element) &&
            !this.parent.popupObj.element.classList.contains('e-popup-close') && !Browser.isDevice) {
            this.parent.hidePopup();
        }
    }
    onDocumentClick(e) {
        let target = e.target;
        if (!isNullOrUndefined(this.parent.popupObj) && closest(target, '#' + this.parent.popupObj.element.id)) {
            e.preventDefault();
        }
        if (!(!isNullOrUndefined(this.parent.popupObj) && closest(target, '#' + this.parent.popupObj.element.id)) &&
            !this.parent.overAllWrapper.contains(e.target)) {
            if (this.parent.overAllWrapper.classList.contains(dropDownBaseClasses.focus) || this.parent.isPopupOpen()) {
                this.parent.inputFocus = false;
                this.parent.scrollFocusStatus = false;
                this.parent.hidePopup();
                this.parent.onBlur();
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
                this.parent.inputElement.blur();
            }
        }
        if (this.filterInput === target) {
            this.filterInput.focus();
        }
    }
    getFocus(e) {
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
    }
    setLocale(unSelect) {
        if (this.parent.selectAllText !== 'Select All' || this.parent.unSelectAllText !== 'Unselect All') {
            let template = unSelect ? this.parent.unSelectAllText : this.parent.selectAllText;
            let compiledString;
            this.selectAllSpan.textContent = '';
            compiledString = compile(template);
            for (let item of compiledString({})) {
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

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
class SelectionSettings extends ChildProperty {
}
__decorate$5([
    Property('Multiple')
], SelectionSettings.prototype, "mode", void 0);
__decorate$5([
    Property(false)
], SelectionSettings.prototype, "showCheckbox", void 0);
__decorate$5([
    Property(false)
], SelectionSettings.prototype, "showSelectAll", void 0);
class ToolbarSettings extends ChildProperty {
}
__decorate$5([
    Property([])
], ToolbarSettings.prototype, "items", void 0);
__decorate$5([
    Property('Right')
], ToolbarSettings.prototype, "position", void 0);
/**
 * The ListBox is a graphical user interface component used to display a list of items.
 * Users can select one or more items in the list using a checkbox or by keyboard selection.
 * It supports sorting, grouping, reordering, and drag and drop of items.
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
let ListBox = class ListBox extends DropDownBase {
    /**
     * Constructor for creating the ListBox component.
     */
    constructor(options, element) {
        super(options, element);
    }
    ;
    /**
     * Build and render the component
     * @private
     */
    render() {
        this.initLoad = true;
        this.initialSelectedOptions = this.value;
        super.render();
    }
    initWrapper() {
        let hiddenSelect = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        this.list.classList.add('e-listbox-wrapper');
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
        this.list.classList.add('e-listbox-wrapper');
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
        if (this.list.getElementsByClassName(cssClass.li)[0]) {
            this.list.getElementsByClassName(cssClass.li)[0].classList.remove(dropDownBaseClasses.focus);
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element, hiddenSelect);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            this.showSelectAll = true;
            this.selectAllText = 'Select All';
            this.unSelectAllText = 'Unselect All';
            this.popupWrapper = this.list;
            this.checkBoxSelectionModule.checkAllParent = null;
            this.notify('selectAll', {});
        }
    }
    initDraggable() {
        if (this.allowDragAndDrop) {
            new Sortable(this.ulElement, {
                scope: this.scope,
                itemClass: cssClass.li,
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e) => {
                    let ele = e.sender.cloneNode(true);
                    ele.style.width = this.getItems()[0].offsetWidth + 'px';
                    if (this.value.length > 1 && this.isSelected(ele)) {
                        ele.appendChild(this.createElement('span', {
                            className: 'e-list-badge', innerHTML: this.value.length + ''
                        }));
                    }
                    return ele;
                }
            });
        }
    }
    initToolbar() {
        let scope;
        let pos = this.toolbarSettings.position;
        if (this.toolbarSettings.items.length) {
            let toolElem = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            let wrapper = this.createElement('div', {
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
        if (scope) {
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
        }
    }
    showSpinner() {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper', styles: 'height:' + formatUnit(this.height) });
        }
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
    onActionComplete(ulElement, list, e) {
        super.onActionComplete(ulElement, list, e);
        this.initWrapper();
        this.setSelection();
        this.initDraggable();
        if (this.initLoad) {
            this.initToolbarAndStyles();
            this.wireEvents();
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
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', this.getDragArgs(args));
    }
    triggerDrag(args) {
        this.trigger('drag', this.getDragArgs(args));
        let listObj = this.getComponent(args.target);
        if (listObj && listObj.listData.length === 0) {
            listObj.ulElement.innerHTML = '';
        }
    }
    dragEnd(args) {
        let listData;
        let selectedOptions;
        let dropValue = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        let droppedData = this.getDataByValue(dropValue);
        let listObj = this.getComponent(args.droppedElement);
        let dragArgs = extend({}, this.getDragArgs({ target: args.droppedElement }, true), { target: args.target });
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            let ul = this.ulElement;
            selectedOptions = Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
            listData = [].slice.call(this.listData);
            let fromIdx = args.previousIndex;
            let toIdx = args.currentIndex;
            listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0]);
            if (fromIdx > toIdx) {
                toIdx += 1;
            }
            selectedOptions.forEach((value) => {
                if (value !== dropValue) {
                    listData.splice(toIdx, 0, listData.splice(this.getIndexByValue(value), 1)[0]);
                    ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                    if (fromIdx > toIdx) {
                        toIdx++;
                    }
                }
            });
            this.listData = listData;
            this.setProperties({ dataSource: listData }, true);
        }
        else {
            let li;
            let prevIdx = args.previousIndex;
            let currIdx = args.currentIndex;
            let ul = listObj.ulElement;
            listData = [].slice.call(listObj.listData);
            selectedOptions = Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
            selectedOptions.forEach((value) => {
                droppedData = this.getDataByValue(value);
                this.listData.splice(value === dropValue ? prevIdx : this.getIndexByValue(value), 1);
                listData.splice(value === dropValue ? args.currentIndex : currIdx, 0, droppedData);
                li = this.getItems()[this.getIndexByValue(value)];
                removeClass([value === dropValue ? args.droppedElement : li], cssClass.selected);
                ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                currIdx++;
                prevIdx--;
            });
            this.setProperties({ dataSource: this.listData }, true);
            listObj.listData = listData;
            listObj.setProperties({ dataSource: listObj.listData }, true);
            this.updateSelectedOptions();
            if (this.selectionSettings.showCheckbox) {
                listObj.updateSelectedOptions();
            }
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        this.trigger('drop', dragArgs);
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
     * @returns void
     */
    enableItems(items, enable = true) {
        let li;
        items.forEach((item) => {
            li = this.findListElement(this.list, 'li', 'data-value', this.getValueByText(item));
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
     * @returns void
     */
    selectItems(items, state = true) {
        this.setSelection(items, state, true);
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
     * @return {void}.
     */
    addItems(items, itemIndex) {
        super.addItem(items, itemIndex);
    }
    selectAllItems(state) {
        [].slice.call(this.getItems()).forEach((li) => {
            if (!li.classList.contains(cssClass.disabled)) {
                if (this.selectionSettings.showCheckbox) {
                    let ele = li.getElementsByClassName('e-check')[0];
                    if ((!ele && state) || (ele && !state)) {
                        this.notify('updatelist', { li: li });
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
        this.triggerSelectAndChange(this.getSelectedItems(), this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll ?
            this.isSelected(this.list.firstElementChild) : state);
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
        let searchCount = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        let len = this.value.length;
        if (this.showSelectAll) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', value: (searchCount === len) ? 'check' : 'uncheck' });
        }
    }
    selectHandler(e, isKey) {
        let isSelect = true;
        let currSelIdx;
        let li = closest(e.target, '.' + cssClass.li);
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
                    .filter((ele) => { return ele.classList.contains(cssClass.li); });
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
            if (!isKey) {
                this.notify('updatelist', { li: li, e: e });
            }
            this.updateSelectedOptions();
            this.triggerSelectAndChange(selectedLi, isSelect);
        }
    }
    triggerSelectAndChange(selectedLi, isSelect) {
        if (isSelect) {
            this.trigger('select', { elements: selectedLi, items: this.getDataByElems(selectedLi) });
        }
        this.trigger('change', { value: this.value });
    }
    getDataByElems(elems) {
        let data = [];
        elems.forEach((ele) => {
            data.push(this.getDataByValue(ele.getAttribute('data-value')));
        });
        return data;
    }
    toolbarClickHandler(e) {
        let btn = closest(e.target, 'button');
        if (btn) {
            switch (btn.getAttribute('data-value')) {
                case 'moveUp':
                    this.moveUpDown(true);
                    break;
                case 'moveDown':
                    this.moveUpDown();
                    break;
                case 'moveTo':
                    this.moveTo();
                    break;
                case 'moveFrom':
                    this.moveFrom();
                    break;
                case 'moveAllTo':
                    this.moveAllTo();
                    break;
                case 'moveAllFrom':
                    this.moveAllFrom();
                    break;
            }
        }
    }
    moveUpDown(isUp, isKey) {
        let elems = this.getSelectedItems();
        if ((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele) => {
            let idx = Array.prototype.indexOf.call(this.ulElement.children, ele);
            moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            this.changeData(idx, isUp ? idx - 1 : idx + 1);
        });
        elems[0].focus();
        if (!isKey && this.toolbarSettings.items.length) {
            this.getToolElem().querySelector('[data-value=' + (isUp ? 'moveUp' : 'moveDown') + ']').focus();
        }
        this.updateToolBarState();
    }
    moveTo() {
        this.moveData(this, this.getScopedListBox());
    }
    moveFrom() {
        this.moveData(this.getScopedListBox(), this);
    }
    moveData(fListBox, tListBox, isKey) {
        let idx = [];
        let listData = [].slice.call(fListBox.listData);
        let tListData = [].slice.call(tListBox.listData);
        let data = [];
        let elems = fListBox.getSelectedItems();
        if (elems.length) {
            if (!this.selectionSettings.showCheckbox) {
                removeClass(elems, cssClass.selected);
            }
            elems.forEach((ele) => {
                idx.push(Array.prototype.indexOf.call(fListBox.ulElement.children, ele));
            });
            if (tListBox.listData.length === 0) {
                tListBox.ulElement.innerHTML = '';
            }
            moveTo(fListBox.ulElement, tListBox.ulElement, idx);
            let childCnt = fListBox.ulElement.childElementCount;
            let ele;
            let liIdx;
            if (elems.length === 1 && childCnt) {
                liIdx = childCnt === idx[0] ? idx[0] - 1 : idx[0];
                ele = fListBox.ulElement.children[liIdx];
                fListBox.ulElement.children[fListBox.getValidIndex(ele, liIdx, childCnt === idx[0]
                    ? 38 : 40)].classList.add(cssClass.selected);
            }
            if (isKey) {
                this.list.focus();
            }
            for (let i = idx.length - 1; i >= 0; i--) {
                data.push(listData.splice(idx[i], 1)[0]);
            }
            fListBox.listData = listData;
            fListBox.setProperties({ dataSource: listData }, true);
            data.reverse().forEach((datum) => {
                tListData.push(datum);
            });
            tListBox.listData = tListData;
            tListBox.setProperties({ dataSource: tListData }, true);
            fListBox.updateSelectedOptions();
            if (this.selectionSettings.showCheckbox) {
                tListBox.updateSelectedOptions();
            }
            if (fListBox.listData.length === 0) {
                fListBox.l10nUpdate();
            }
        }
    }
    moveAllTo() {
        this.moveAllData(this, this.getScopedListBox());
    }
    moveAllFrom() {
        this.moveAllData(this.getScopedListBox(), this);
    }
    moveAllData(fListBox, tListBox, isKey) {
        let listData = [].slice.call(tListBox.listData);
        if (!this.selectionSettings.showCheckbox) {
            removeClass(this.getSelectedItems(), cssClass.selected);
        }
        if (tListBox.listData.length === 0) {
            tListBox.ulElement.innerHTML = '';
        }
        moveTo(fListBox.ulElement, tListBox.ulElement, Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number));
        if (isKey) {
            this.list.focus();
        }
        [].slice.call(fListBox.listData).forEach((data) => {
            listData.push(data);
        });
        tListBox.listData = listData;
        fListBox.listData = [];
        tListBox.setProperties({ dataSource: listData }, true);
        fListBox.setProperties({ dataSource: [] }, true);
        fListBox.updateSelectedOptions();
        if (this.selectionSettings.showCheckbox) {
            tListBox.updateSelectedOptions();
        }
        if (fListBox.listData.length === 0) {
            fListBox.l10nUpdate();
        }
    }
    changeData(fromIdx, toIdx) {
        let listData = [].slice.call(this.listData);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0]);
        this.listData = listData;
        this.setProperties({ dataSource: listData }, true);
    }
    getSelectedItems() {
        let ele = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach((cbox) => {
                ele.push(closest(cbox, '.' + cssClass.li));
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
            elems.pop();
            if (isDragEnd) {
                elems.push(args.target);
            }
        }
        else {
            elems = [args.target];
        }
        return { elements: elems, items: this.getDataByElems(elems) };
    }
    keyDownHandler(e) {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            if (e.keyCode === 32) {
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
    focusOutHandler() {
        let ele = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
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
        cli = cul.children[index];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    }
    updateSelectedOptions() {
        let selectedOptions = [];
        this.getSelectedItems().forEach((ele) => {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(this.getFormattedValue(ele.getAttribute('data-value')));
            }
        });
        this.setProperties({ value: selectedOptions }, true);
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
        values.forEach((value) => {
            li = this.list.querySelector('[data-value="' + (isText ? this.getValueByText(value) : value) + '"]');
            if (this.selectionSettings.showCheckbox) {
                liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
            }
            else {
                liselect = li.classList.contains('e-selected');
            }
            if (!isSelect && liselect || isSelect && !liselect && li) {
                if (this.selectionSettings.showCheckbox) {
                    this.notify('updatelist', { li: li });
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
        });
        this.updateSelectTag();
    }
    updateSelectTag() {
        let ele = this.getSelectTag();
        ele.innerHTML = '';
        Array.prototype.forEach.call(this.value, (value) => {
            ele.innerHTML += '<option selected value="' + value + '"></option>';
        });
        this.checkSelectAll();
    }
    updateToolBarState() {
        if (this.toolbarSettings.items.length) {
            let listObj = this.getScopedListBox();
            let wrap = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach((value) => {
                let btn = wrap.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = this.ulElement.childElementCount ? false : true;
                        break;
                    case 'moveAllFrom':
                        btn.disabled = listObj.ulElement.childElementCount ? false : true;
                        break;
                    case 'moveFrom':
                        btn.disabled = listObj.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = this.value.length
                            && !this.isSelected(this.ulElement.children[0]) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = this.value.length
                            && !this.isSelected(this.ulElement.children[this.ulElement.childElementCount - 1]) ? false : true;
                        break;
                    default:
                        btn.disabled = this.value.length ? false : true;
                        break;
                }
            });
        }
    }
    isSelected(ele) {
        return ele.classList.contains(cssClass.selected) || ele.querySelector('.e-check') !== null;
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
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        }
        else {
            this.element.style.display = 'inline-block';
            if (this.toolbarSettings.items.length) {
                this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                detach(this.list.nextElementSibling);
            }
            this.list.parentElement.insertBefore(this.element, this.list);
        }
        super.destroy();
    }
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
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
                    this.setSelection();
                    this.clearSelection(this.value);
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
                    if (!isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            this.checkBoxSelectionModule.checkAllParent = null;
                        }
                        this.notify('selectAll', {});
                        this.checkSelectAll();
                    }
                    break;
            }
        }
    }
};
__decorate$5([
    Property('')
], ListBox.prototype, "cssClass", void 0);
__decorate$5([
    Property([])
], ListBox.prototype, "value", void 0);
__decorate$5([
    Property('')
], ListBox.prototype, "height", void 0);
__decorate$5([
    Property(false)
], ListBox.prototype, "allowDragAndDrop", void 0);
__decorate$5([
    Property('')
], ListBox.prototype, "scope", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "beforeItemRender", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "select", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "dragStart", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "drag", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "drop", void 0);
__decorate$5([
    Event()
], ListBox.prototype, "dataBound", void 0);
__decorate$5([
    Property(null)
], ListBox.prototype, "groupTemplate", void 0);
__decorate$5([
    Property('No Records Found')
], ListBox.prototype, "noRecordsTemplate", void 0);
__decorate$5([
    Property('The Request Failed')
], ListBox.prototype, "actionFailureTemplate", void 0);
__decorate$5([
    Property(1000)
], ListBox.prototype, "zIndex", void 0);
__decorate$5([
    Property(false)
], ListBox.prototype, "ignoreAccent", void 0);
__decorate$5([
    Complex({}, ToolbarSettings)
], ListBox.prototype, "toolbarSettings", void 0);
__decorate$5([
    Complex({}, SelectionSettings)
], ListBox.prototype, "selectionSettings", void 0);
ListBox = __decorate$5([
    NotifyPropertyChanges
], ListBox);

/**
 * export all modules from current location
 */

/**
 * export all modules from current location
 */

export { incrementalSearch, Search, highlightSearch, revertHighlightSearch, FieldSettings, dropDownBaseClasses, DropDownBase, dropDownListClasses, DropDownList, ComboBox, AutoComplete, MultiSelect, CheckBoxSelection, SelectionSettings, ToolbarSettings, ListBox };
//# sourceMappingURL=ej2-dropdowns.es2015.js.map
