import { Animation, ChildProperty, Complex, Component, Event, EventHandler, NotifyPropertyChanges, Property, Touch, addClass, append, attributes, closest, compile, detach, extend, formatUnit, getValue, isNullOrUndefined, isVisible, merge, prepend, remove, removeClass, rippleEffect } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';

var cssClass = {
    li: 'e-list-item',
    ul: 'e-list-parent e-ul',
    group: 'e-list-group-item',
    icon: 'e-list-icon',
    text: 'e-list-text',
    check: 'e-list-check',
    checked: 'e-checked',
    selected: 'e-selected',
    expanded: 'e-expanded',
    textContent: 'e-text-content',
    hasChild: 'e-has-child',
    level: 'e-level',
    url: 'e-list-url',
    collapsible: 'e-icon-collapsible',
    disabled: 'e-disabled',
    image: 'e-list-img',
    iconWrapper: 'e-icon-wrapper'
};
/**
 * Base List Generator
 */
var ListBase;
(function (ListBase) {
    /**
     * Default mapped fields.
     */
    ListBase.defaultMappedFields = {
        id: 'id',
        text: 'text',
        url: 'url',
        value: 'value',
        isChecked: 'isChecked',
        enabled: 'enabled',
        expanded: 'expanded',
        selected: 'selected',
        iconCss: 'iconCss',
        child: 'child',
        isVisible: 'isVisible',
        hasChildren: 'hasChildren',
        tooltip: 'tooltip',
        htmlAttributes: 'htmlAttributes',
        urlAttributes: 'urlAttributes',
        imageAttributes: 'imageAttributes',
        imageUrl: 'imageUrl',
        groupBy: null
    };
    var defaultAriaAttributes = {
        level: 1,
        listRole: 'presentation',
        itemRole: 'presentation',
        groupItemRole: 'group',
        itemText: 'list-item',
        wrapperRole: 'presentation'
    };
    var defaultListBaseOptions = {
        showCheckBox: false,
        showIcon: false,
        expandCollapse: false,
        fields: ListBase.defaultMappedFields,
        ariaAttributes: defaultAriaAttributes,
        listClass: '',
        itemClass: '',
        processSubChild: false,
        sortOrder: 'None',
        template: null,
        groupTemplate: null,
        headerTemplate: null,
        expandIconClass: 'e-icon-collapsible',
        moduleName: 'list',
        expandIconPosition: 'Right'
    };
    /**
     * Function helps to created and return the UL Li element based on your data.
     * @param  {{[key:string]:Object}[]|string[]} dataSource - Specifies an array of JSON or String data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    function createList(createElement, dataSource, options, isSingleLevel) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var ariaAttributes = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var type = typeofData(dataSource).typeof;
        if (type === 'string' || type === 'number') {
            return createListFromArray(createElement, dataSource, isSingleLevel, options);
        }
        else {
            return createListFromJson(createElement, dataSource, options, ariaAttributes.level, isSingleLevel);
        }
    }
    ListBase.createList = createList;
    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    function createListFromArray(createElement, dataSource, isSingleLevel, options) {
        var subChild = createListItemFromArray(createElement, dataSource, isSingleLevel, options);
        return generateUL(createElement, subChild, null, options);
    }
    ListBase.createListFromArray = createListFromArray;
    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    function createListItemFromArray(createElement, dataSource, isSingleLevel, options) {
        var subChild = [];
        var curOpt = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        var id = generateId(); // generate id for drop-down-list option.
        for (var i = 0; i < dataSource.length; i++) {
            if (isNullOrUndefined(dataSource[i])) {
                continue;
            }
            var li = void 0;
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: dataSource[i],
                    options: curOpt
                };
                curOpt.itemCreating(curData);
            }
            if (isSingleLevel) {
                li = generateSingleLevelLI(createElement, dataSource[i], undefined, null, null, [], null, id, i, options);
            }
            else {
                li = generateLI(createElement, dataSource[i], undefined, null, null, options);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: dataSource[i],
                    item: li,
                    options: curOpt
                };
                curOpt.itemCreated(curData);
            }
            subChild.push(li);
        }
        return subChild;
    }
    ListBase.createListItemFromArray = createListItemFromArray;
    /**
     * Function helps to created an element list based on array of JSON input .
     * @param  {{[key:string]:Object}[]} dataSource - Specifies an array of JSON data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    // tslint:disable-next-line:max-func-body-length
    function createListItemFromJson(createElement, dataSource, options, level, isSingleLevel) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        var fields = extend({}, ListBase.defaultMappedFields, curOpt.fields);
        var ariaAttributes = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var id;
        if (level) {
            ariaAttributes.level = level;
        }
        var child = [];
        var li;
        if (dataSource && dataSource.length && !isNullOrUndefined(typeofData(dataSource).item) &&
            !typeofData(dataSource).item.hasOwnProperty(fields.id)) {
            id = generateId(); // generate id for drop-down-list option.
        }
        for (var i = 0; i < dataSource.length; i++) {
            var fieldData = getFieldValues(dataSource[i], fields);
            if (isNullOrUndefined(dataSource[i])) {
                continue;
            }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: fieldData[fields.text],
                    options: curOpt,
                    fields: fields
                };
                curOpt.itemCreating(curData);
            }
            var curItem = dataSource[i];
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = getFieldValues(dataSource[i], fields);
            }
            if (fieldData.hasOwnProperty(fields.id) && !isNullOrUndefined(fieldData[fields.id])) {
                id = fieldData.id;
            }
            var innerEle = [];
            if (curOpt.showCheckBox) {
                innerEle.push(createElement('input', { className: cssClass.check, attrs: { type: 'checkbox' } }));
            }
            if (isSingleLevel === true) {
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) && !isNullOrUndefined(fieldData[fields.iconCss])) {
                    innerEle.push(createElement('span', { className: cssClass.icon + ' ' + fieldData[fields.iconCss] }));
                }
                li = generateSingleLevelLI(createElement, curItem, fieldData, fields, curOpt.itemClass, innerEle, (curItem.hasOwnProperty('isHeader') &&
                    curItem.isHeader) ? true : false, id, i, options);
            }
            else {
                li = generateLI(createElement, curItem, fieldData, fields, curOpt.itemClass, options);
                li.classList.add(cssClass.level + '-' + ariaAttributes.level);
                li.setAttribute('aria-level', ariaAttributes.level.toString());
                if (fieldData.hasOwnProperty(fields.tooltip)) {
                    li.setAttribute('title', fieldData[fields.tooltip]);
                }
                if (fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                    setAttribute(li, fieldData[fields.htmlAttributes]);
                }
                if (fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled] === false) {
                    li.classList.add(cssClass.disabled);
                }
                if (fieldData.hasOwnProperty(fields.isVisible) && fieldData[fields.isVisible] === false) {
                    li.style.display = 'none';
                }
                if (fieldData.hasOwnProperty(fields.imageUrl) && !isNullOrUndefined(fieldData[fields.imageUrl])
                    && !curOpt.template) {
                    var attr = { src: fieldData[fields.imageUrl] };
                    merge(attr, fieldData[fields.imageAttributes]);
                    prepend([createElement('img', { className: cssClass.image, attrs: attr })], li.firstElementChild);
                }
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) &&
                    !isNullOrUndefined(fieldData[fields.iconCss]) && !curOpt.template) {
                    prepend([createElement('div', { className: cssClass.icon + ' ' + fieldData[fields.iconCss] })], li.firstElementChild);
                }
                if (innerEle.length) {
                    prepend(innerEle, li.firstElementChild);
                }
                processSubChild(createElement, fieldData, fields, dataSource, curOpt, li, ariaAttributes.level);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: fieldData[fields.text],
                    item: li,
                    options: curOpt,
                    fields: fields
                };
                curOpt.itemCreated(curData);
            }
            child.push(li);
        }
        return child;
    }
    ListBase.createListItemFromJson = createListItemFromJson;
    /**
     * Function helps to created an element list based on array of JSON input .
     * @param  {{[key:string]:Object}[]} dataSource - Specifies an array of JSON data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    function createListFromJson(createElement, dataSource, options, level, isSingleLevel) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var li = createListItemFromJson(createElement, dataSource, options, level, isSingleLevel);
        return generateUL(createElement, li, curOpt.listClass, options);
    }
    ListBase.createListFromJson = createListFromJson;
    /**
     * Return the next or previous visible element.
     * @param  {Element[]|NodeList} elementArray - An element array to find next or previous element.
     * @param  {Element} li - An element to find next or previous after this element.
     * @param  {boolean} isPrevious? - Specify when the need get previous element from array.
     */
    function getSiblingLI(elementArray, element, isPrevious) {
        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        if (!elementArray || !elementArray.length) {
            return void 0;
        }
        var siblingLI;
        var liIndex;
        var liCollections = Array.prototype.slice.call(elementArray);
        if (element) {
            liIndex = indexOf(element, liCollections);
        }
        else {
            liIndex = (isPrevious === true ? liCollections.length : -1);
        }
        siblingLI = liCollections[liIndex + (isPrevious === true ? -1 : 1)];
        while (siblingLI && (!isVisible(siblingLI) || siblingLI.classList.contains(cssClass.disabled))) {
            liIndex = liIndex + (isPrevious === true ? -1 : 1);
            siblingLI = liCollections[liIndex];
        }
        return siblingLI;
    }
    ListBase.getSiblingLI = getSiblingLI;
    /**
     * Return the index of the li element
     * @param  {Element} item - An element to find next or previous after this element.
     * @param  {Element[]|NodeList} elementArray - An element array to find index of given li.
     */
    function indexOf(item, elementArray) {
        if (!elementArray || !item) {
            return void 0;
        }
        else {
            var liCollections = elementArray;
            liCollections = Array.prototype.slice.call(elementArray);
            return liCollections.indexOf(item);
        }
    }
    ListBase.indexOf = indexOf;
    /**
     * Returns the grouped data from given dataSource.
     * @param  {{[key:string]:Object}[]} dataSource - The JSON data which is necessary to process.
     * @param  {FieldsMapping} fields - Fields that are mapped from the data source.
     * @param  {SortOrder='None'} sortOrder- Specifies final result sort order.
     */
    function groupDataSource(dataSource, fields, sortOrder) {
        if (sortOrder === void 0) { sortOrder = 'None'; }
        var curFields = extend({}, ListBase.defaultMappedFields, fields);
        var cusQuery = new Query().group(curFields.groupBy);
        // need to remove once sorting issues fixed in DataManager
        cusQuery = addSorting(sortOrder, 'key', cusQuery);
        var ds = getDataSource(dataSource, cusQuery);
        dataSource = [];
        for (var j = 0; j < ds.length; j++) {
            var itemObj = ds[j].items;
            var grpItem = {};
            var hdr = 'isHeader';
            grpItem[curFields.text] = ds[j].key;
            grpItem[hdr] = true;
            grpItem.id = 'group-list-item-' + (ds[j].key ?
                ds[j].key.toString().trim() : 'undefined');
            grpItem.items = itemObj;
            dataSource.push(grpItem);
            for (var k = 0; k < itemObj.length; k++) {
                dataSource.push(itemObj[k]);
            }
        }
        return dataSource;
    }
    ListBase.groupDataSource = groupDataSource;
    /**
     * Returns a sorted query object.
     * @param  {SortOrder} sortOrder - Specifies that sort order.
     * @param  {string} sortBy - Specifies sortBy fields.
     * @param  {Query=new Query()} query - Pass if any existing query.
     */
    function addSorting(sortOrder, sortBy, query) {
        if (query === void 0) { query = new Query(); }
        if (sortOrder === 'Ascending') {
            query.sortBy(sortBy, 'ascending', true);
        }
        else if (sortOrder === 'Descending') {
            query.sortBy(sortBy, 'descending', true);
        }
        else {
            for (var i = 0; i < query.queries.length; i++) {
                if (query.queries[i].fn === 'onSortBy') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    }
    ListBase.addSorting = addSorting;
    /**
     * Return an array of JSON Data that processed based on queries.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {Query} query - Specifies query that need to process.
     */
    function getDataSource(dataSource, query) {
        // tslint:disable-next-line
        return new DataManager(dataSource)
            .executeLocal(query);
    }
    ListBase.getDataSource = getDataSource;
    /**
     * Created JSON data based the UL and LI element
     * @param  {HTMLElement|Element} element - UL element that need to convert as a JSON
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    function createJsonFromElement(element, options) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var fields = extend({}, ListBase.defaultMappedFields, curOpt.fields);
        var curEle = element.cloneNode(true);
        var jsonAr = [];
        curEle.classList.add('json-parent');
        var childs = curEle.querySelectorAll('.json-parent>li');
        curEle.classList.remove('json-parent');
        for (var i = 0; i < childs.length; i++) {
            var li = childs[i];
            var anchor = li.querySelector('a');
            var ul = li.querySelector('ul');
            var json = {};
            var childNodes = anchor ? anchor.childNodes : li.childNodes;
            var keys = Object.keys(childNodes);
            for (var i_1 = 0; i_1 < childNodes.length; i_1++) {
                if (!(childNodes[Number(keys[i_1])]).hasChildNodes()) {
                    json[fields.text] = childNodes[Number(keys[i_1])].textContent;
                }
            }
            var attributes_1 = getAllAttributes(li);
            if (attributes_1.id) {
                json[fields.id] = attributes_1.id;
                delete attributes_1.id;
            }
            else {
                json[fields.id] = generateId();
            }
            if (Object.keys(attributes_1).length) {
                json[fields.htmlAttributes] = attributes_1;
            }
            if (anchor) {
                attributes_1 = getAllAttributes(anchor);
                if (Object.keys(attributes_1).length) {
                    json[fields.urlAttributes] = attributes_1;
                }
            }
            if (ul) {
                json[fields.child] = createJsonFromElement(ul, options);
            }
            jsonAr.push(json);
        }
        return jsonAr;
    }
    ListBase.createJsonFromElement = createJsonFromElement;
    function typeofData(data) {
        var match = { typeof: null, item: null };
        for (var i = 0; i < data.length; i++) {
            if (!isNullOrUndefined(data[i])) {
                return match = { typeof: typeof data[i], item: data[i] };
            }
        }
        return match;
    }
    function setAttribute(element, elementAttributes) {
        var attr = {};
        merge(attr, elementAttributes);
        if (attr.class) {
            addClass([element], attr.class.split(' '));
            delete attr.class;
        }
        attributes(element, attr);
    }
    function getAllAttributes(element) {
        var attributes$$1 = {};
        var attr = element.attributes;
        for (var index = 0; index < attr.length; index++) {
            attributes$$1[attr[index].nodeName] = attr[index].nodeValue;
        }
        return attributes$$1;
    }
    /**
     * Created UL element from content template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    function renderContentTemplate(createElement, template, dataSource, fields, options) {
        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        var ulElement = createElement('ul', { className: cssClass.ul, attrs: { role: 'presentation' } });
        var curOpt = extend({}, defaultListBaseOptions, options);
        var curFields = extend({}, ListBase.defaultMappedFields, fields);
        var compiledString = compile(template);
        var liCollection = [];
        var id = generateId(); // generate id for drop-down-list option.
        for (var i = 0; i < dataSource.length; i++) {
            var fieldData = getFieldValues(dataSource[i], curFields);
            var curItem = dataSource[i];
            var isHeader = curItem.isHeader;
            var value = fieldData[curFields.value];
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: curItem,
                    text: value,
                    options: curOpt,
                    fields: curFields
                };
                curOpt.itemCreating(curData);
            }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = getFieldValues(dataSource[i], curFields);
                value = fieldData[curFields.value];
            }
            var li = createElement('li', {
                id: id + '-' + i,
                className: isHeader ? cssClass.group : cssClass.li, attrs: { role: 'presentation' }
            });
            if (isHeader) {
                li.innerText = fieldData[curFields.text];
            }
            else {
                append(compiledString(curItem), li);
                li.setAttribute('data-value', value);
                li.setAttribute('role', 'option');
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                var curData = {
                    dataSource: dataSource,
                    curData: curItem,
                    text: value,
                    item: li,
                    options: curOpt,
                    fields: curFields
                };
                curOpt.itemCreated(curData);
            }
            liCollection.push(li);
        }
        append(liCollection, ulElement);
        return ulElement;
    }
    ListBase.renderContentTemplate = renderContentTemplate;
    /**
     * Created header items from group template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {FieldsMapping} fields - Specifies fields for mapping the dataSource.
     * @param  {Element[]} headerItems? - Specifies listbase header items.
     */
    function renderGroupTemplate(groupTemplate, groupDataSource, fields, headerItems) {
        var compiledString = compile(groupTemplate);
        var curFields = extend({}, ListBase.defaultMappedFields, fields);
        var category = curFields.groupBy;
        for (var _i = 0, headerItems_1 = headerItems; _i < headerItems_1.length; _i++) {
            var header = headerItems_1[_i];
            var headerData = {};
            headerData[category] = header.textContent;
            header.innerHTML = '';
            append(compiledString(headerData), header);
        }
        return headerItems;
    }
    ListBase.renderGroupTemplate = renderGroupTemplate;
    function generateId() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    ListBase.generateId = generateId;
    function processSubChild(createElement, fieldData, fields, ds, options, element, level) {
        // Get SubList
        var subDS = fieldData[fields.child] || [];
        var hasChildren = fieldData[fields.hasChildren];
        //Create Sub child
        if (subDS.length) {
            hasChildren = true;
            element.classList.add(cssClass.hasChild);
            if (options.processSubChild) {
                var subLi = createListFromJson(createElement, subDS, options, ++level);
                element.appendChild(subLi);
            }
        }
        // Create expand and collapse node
        if (!!options.expandCollapse && hasChildren && !options.template) {
            element.firstElementChild.classList.add(cssClass.iconWrapper);
            var expandElement = options.expandIconPosition === 'Left' ? prepend : append;
            expandElement([createElement('div', { className: 'e-icons ' + options.expandIconClass })], element.querySelector('.' + cssClass.textContent));
        }
    }
    function generateSingleLevelLI(createElement, item, fieldData, fields, className, innerElements, grpLI, id, index, options) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var ariaAttributes = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var text = item;
        var value = item;
        var dataSource;
        if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean') {
            dataSource = item;
            text = (typeof fieldData[fields.text] === 'boolean' || typeof fieldData[fields.text] === 'number') ?
                fieldData[fields.text] : (fieldData[fields.text] || '');
            value = fieldData[fields.value];
        }
        var elementID;
        if (!isNullOrUndefined(dataSource) && !isNullOrUndefined(fieldData[fields.id])
            && fieldData[fields.id] !== '') {
            elementID = id;
        }
        else {
            elementID = id + '-' + index;
        }
        var li = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            id: elementID, attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        if (dataSource && fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled].toString() === 'false') {
            li.classList.add(cssClass.disabled);
        }
        if (grpLI) {
            li.innerText = text;
        }
        else {
            if (!isNullOrUndefined(value)) {
                li.setAttribute('data-value', value);
            }
            li.setAttribute('role', 'option');
            if (dataSource && fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                setAttribute(li, fieldData[fields.htmlAttributes]);
            }
            if (innerElements.length) {
                append(innerElements, li);
            }
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                fieldData[fields.urlAttributes].href))) {
                li.appendChild(anchorTag(createElement, dataSource, fields, text));
            }
            else {
                li.appendChild(document.createTextNode(text));
            }
        }
        return li;
    }
    function getModuleClass(moduleName) {
        var moduleClass;
        return moduleClass = {
            li: "e-" + moduleName + "-item",
            ul: "e-" + moduleName + "-parent e-ul",
            group: "e-" + moduleName + "-group-item",
            icon: "e-" + moduleName + "-icon",
            text: "e-" + moduleName + "-text",
            check: "e-" + moduleName + "-check",
            checked: 'e-checked',
            selected: 'e-selected',
            expanded: 'e-expanded',
            textContent: 'e-text-content',
            hasChild: 'e-has-child',
            level: 'e-level',
            url: "e-" + moduleName + "-url",
            collapsible: 'e-icon-collapsible',
            disabled: 'e-disabled',
            image: "e-" + moduleName + "-img",
            iconWrapper: 'e-icon-wrapper'
        };
    }
    function anchorTag(createElement, dataSource, fields, text) {
        var fieldData = getFieldValues(dataSource, fields);
        var attr = { href: fieldData[fields.url] };
        if (fieldData.hasOwnProperty(fields.urlAttributes) && fieldData[fields.urlAttributes]) {
            merge(attr, fieldData[fields.urlAttributes]);
            attr.href = fieldData[fields.url] ? fieldData[fields.url] :
                fieldData[fields.urlAttributes].href;
        }
        var anchorTag = createElement('a', { className: cssClass.text + ' ' + cssClass.url, innerHTML: text });
        setAttribute(anchorTag, attr);
        return anchorTag;
    }
    /* tslint:disable:align */
    function generateLI(createElement, item, fieldData, fields, className, options) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var ariaAttributes = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var text = item;
        var uID;
        var grpLI;
        var dataSource;
        if (typeof item !== 'string' && typeof item !== 'number') {
            dataSource = item;
            text = fieldData[fields.text] || '';
            uID = fieldData[fields.id];
            grpLI = (item.hasOwnProperty('isHeader') && item.isHeader)
                ? true : false;
        }
        var li = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        !isNullOrUndefined(uID) ? li.setAttribute('data-uid', uID) : li.setAttribute('data-uid', generateId());
        if (grpLI && options && options.groupTemplate) {
            var compiledString = compile(options.groupTemplate);
            append(compiledString(item), li);
        }
        else if (!grpLI && options && options.template) {
            var compiledString = compile(options.template);
            append(compiledString(item), li);
        }
        else {
            var innerDiv = createElement('div', {
                className: cssClass.textContent,
                attrs: (ariaAttributes.wrapperRole !== '' ? { role: ariaAttributes.wrapperRole } : {})
            });
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                fieldData[fields.urlAttributes].href))) {
                innerDiv.appendChild(anchorTag(createElement, dataSource, fields, text));
            }
            else {
                innerDiv.appendChild(createElement('span', {
                    className: cssClass.text, innerHTML: text,
                    attrs: (ariaAttributes.itemText !== '' ? { role: ariaAttributes.itemText } : {})
                }));
            }
            li.appendChild(innerDiv);
        }
        return li;
    }
    /**
     * Returns UL element based on the given LI element.
     * @param  {HTMLElement[]} liElement - Specifies array of LI element.
     * @param  {string} className? - Specifies class name that need to be added in UL element.
     * @param  {ListBaseOptions} options? - Specifies ListBase options.
     */
    function generateUL(createElement, liElement, className, options) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        var ariaAttributes = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        cssClass = getModuleClass(curOpt.moduleName);
        var ulElement = createElement('ul', {
            className: cssClass.ul + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.listRole !== '' ? { role: ariaAttributes.listRole } : {})
        });
        append(liElement, ulElement);
        return ulElement;
    }
    ListBase.generateUL = generateUL;
    /**
     * Returns LI element with additional DIV tag based on the given LI element.
     * @param  {liElement} liElement - Specifies LI element.
     * @param  {string} className? - Specifies class name that need to be added in created DIV element.
     * @param  {ListBaseOptions} options? - Specifies ListBase options.
     */
    function generateIcon(createElement, liElement, className, options) {
        var curOpt = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        var expandElement = curOpt.expandIconPosition === 'Left' ? prepend : append;
        expandElement([createElement('div', {
                className: 'e-icons ' + curOpt.expandIconClass + ' ' +
                    (isNullOrUndefined(className) ? '' : className)
            })], liElement.querySelector('.' + cssClass.textContent));
        return liElement;
    }
    ListBase.generateIcon = generateIcon;
})(ListBase || (ListBase = {}));
/**
 * Used to get dataSource item from complex data using fields.
 * @param {{[key:string]:Object}|string[]|string} dataSource - Specifies an  JSON or String data.
 * @param {FieldsMapping} fields - Fields that are mapped from the dataSource.
 */
function getFieldValues(dataItem, fields) {
    var fieldData = {};
    if (isNullOrUndefined(dataItem) || typeof (dataItem) === 'string' || typeof (dataItem) === 'number'
        || !isNullOrUndefined(dataItem.isHeader)) {
        return dataItem;
    }
    else {
        for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
            var field = _a[_i];
            var dataField = fields[field];
            var value = !isNullOrUndefined(dataField) &&
                typeof (dataField) === 'string' ? getValue(dataField, dataItem) : undefined;
            if (!isNullOrUndefined(value)) {
                fieldData[dataField] = value;
            }
        }
    }
    return fieldData;
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
// Effect Configuration Effect[] =  [fromViewBackward,fromViewForward,toViewBackward,toviewForward];
var effectsConfig = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
var effectsRTLConfig = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};
// don't use space in classnames.
var classNames = {
    root: 'e-listview',
    hover: 'e-hover',
    selected: 'e-active',
    focused: 'e-focused',
    parentItem: 'e-list-parent',
    listItem: 'e-list-item',
    listIcon: 'e-list-icon',
    textContent: 'e-text-content',
    listItemText: 'e-list-text',
    groupListItem: 'e-list-group-item',
    hasChild: 'e-has-child',
    view: 'e-view',
    header: 'e-list-header',
    headerText: 'e-headertext',
    headerTemplateText: 'e-headertemplate-text',
    text: 'e-text',
    disable: 'e-disabled',
    content: 'e-content',
    icon: 'e-icons',
    backIcon: 'e-icon-back',
    checkboxWrapper: 'e-checkbox-wrapper',
    checkbox: 'e-checkbox',
    checked: 'e-check',
    checklist: 'e-checklist',
    checkboxIcon: 'e-frame',
    checkboxRight: 'e-checkbox-right',
    checkboxLeft: 'e-checkbox-left',
    listviewCheckbox: 'e-listview-checkbox',
    itemCheckList: 'e-checklist'
};
var FieldSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('id')
    ], FieldSettings.prototype, "id", void 0);
    __decorate([
        Property('text')
    ], FieldSettings.prototype, "text", void 0);
    __decorate([
        Property('isChecked')
    ], FieldSettings.prototype, "isChecked", void 0);
    __decorate([
        Property('isVisible')
    ], FieldSettings.prototype, "isVisible", void 0);
    __decorate([
        Property('enabled')
    ], FieldSettings.prototype, "enabled", void 0);
    __decorate([
        Property('iconCss')
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate([
        Property('child')
    ], FieldSettings.prototype, "child", void 0);
    __decorate([
        Property('tooltip')
    ], FieldSettings.prototype, "tooltip", void 0);
    __decorate([
        Property('groupBy')
    ], FieldSettings.prototype, "groupBy", void 0);
    __decorate([
        Property('text')
    ], FieldSettings.prototype, "sortBy", void 0);
    __decorate([
        Property('htmlAttributes')
    ], FieldSettings.prototype, "htmlAttributes", void 0);
    __decorate([
        Property('tableName')
    ], FieldSettings.prototype, "tableName", void 0);
    return FieldSettings;
}(ChildProperty));
/**
 * Represents the EJ2 ListView control.
 * ```html
 * <div id="listview">
 * <ul>
 * <li>Favourite</li>
 * <li>Documents</li>
 * <li>Downloads</li>
 * </ul>
 * </div>
 * ```
 * ```typescript
 *   var lvObj = new ListView({});
 *   lvObj.appendTo("#listview");
 * ```
 */
var ListView = /** @__PURE__ @class */ (function (_super) {
    __extends(ListView, _super);
    /**
     * Constructor for creating the widget
     */
    function ListView(options, element) {
        return _super.call(this, options, element) || this;
    }
    ListView.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'htmlAttributes':
                    this.setHTMLAttribute();
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'enable':
                    this.setEnable();
                    break;
                case 'width':
                case 'height':
                    this.setSize();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'fields':
                    this.listBaseOption.fields = this.fields.properties;
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    }
                    else {
                        this.reRender();
                    }
                    break;
                case 'headerTitle':
                    if (!this.curDSLevel.length) {
                        this.header(this.headerTitle, false);
                    }
                    break;
                case 'showHeader':
                    this.header(this.headerTitle, false);
                    break;
                case 'enableVirtualization':
                    detach(this.contentContainer);
                    this.refresh();
                    break;
                case 'showCheckBox':
                case 'checkBoxPosition':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    }
                    else {
                        this.setCheckbox();
                    }
                    break;
                case 'dataSource':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    }
                    else {
                        this.reRender();
                    }
                    break;
                case 'sortOrder':
                case 'showIcon':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    }
                    else {
                        this.listBaseOption.showIcon = this.showIcon;
                        this.curViewDS = this.getSubDS();
                        this.resetCurrentList();
                    }
                    break;
                default:
                    break;
            }
        }
    };
    // Model Changes
    ListView.prototype.setHTMLAttribute = function () {
        if (Object.keys(this.htmlAttributes).length) {
            attributes(this.element, this.htmlAttributes);
        }
    };
    ListView.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' ').filter(function (css) { return css; }));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' ').filter(function (css) { return css; }));
        }
    };
    ListView.prototype.setSize = function () {
        this.element.style.height = formatUnit(this.height);
        this.element.style.width = formatUnit(this.width);
        this.isWindow = this.element.clientHeight ? false : true;
    };
    ListView.prototype.setEnable = function () {
        this.enableElement(this.element, this.enable);
    };
    ListView.prototype.setEnableRTL = function () {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
    };
    ListView.prototype.enableElement = function (element, isEnabled) {
        if (isEnabled) {
            element.classList.remove(classNames.disable);
        }
        else {
            element.classList.add(classNames.disable);
        }
    };
    //Suport Component Functions
    ListView.prototype.header = function (text, showBack) {
        if (this.headerEle === undefined && this.showHeader) {
            this.headerEle = this.createElement('div', { className: classNames.header });
            var innerHeaderEle = this.createElement('span', { className: classNames.headerText, innerHTML: this.headerTitle });
            var textEle = this.createElement('div', { className: classNames.text, innerHTML: innerHeaderEle.outerHTML });
            var hedBackButton = this.createElement('div', {
                className: classNames.icon + ' ' + classNames.backIcon + ' e-but-back',
                attrs: { style: 'display:none;' }
            });
            this.headerEle.appendChild(hedBackButton);
            this.headerEle.appendChild(textEle);
            if (this.headerTemplate) {
                var compiledString = compile(this.headerTemplate);
                var headerTemplateEle = this.createElement('div', { className: classNames.headerTemplateText });
                append(compiledString({}), headerTemplateEle);
                append([headerTemplateEle], this.headerEle);
            }
            if (this.headerTemplate && this.headerTitle) {
                textEle.classList.add('header');
            }
            this.element.classList.add('e-has-header');
            prepend([this.headerEle], this.element);
        }
        else if (this.headerEle) {
            if (this.showHeader) {
                this.headerEle.style.display = '';
                var textEle = this.headerEle.querySelector('.' + classNames.headerText);
                var hedBackButton = this.headerEle.querySelector('.' + classNames.backIcon);
                textEle.innerHTML = text;
                if (this.headerTemplate && showBack) {
                    textEle.parentElement.classList.remove('header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('nested-header');
                }
                if (this.headerTemplate && !showBack) {
                    textEle.parentElement.classList.add('header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.remove('nested-header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('header');
                }
                if (showBack === true) {
                    hedBackButton.style.display = '';
                }
                else {
                    hedBackButton.style.display = 'none';
                }
            }
            else {
                this.headerEle.style.display = 'none';
            }
        }
    };
    // Animation Related Functions
    ListView.prototype.switchView = function (fromView, toView, reverse) {
        var _this = this;
        if (fromView && toView) {
            var fPos_1 = fromView.style.position;
            var overflow_1 = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';
            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            var anim = void 0;
            var duration = this.animation.duration;
            if (this.animation.effect) {
                anim = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            }
            else {
                var slideLeft = 'SlideLeft';
                anim = effectsConfig[slideLeft];
                reverse = this.enableRtl;
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.aniObj.animate(fromView, {
                name: (reverse === true ? anim[0] : anim[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function (model) {
                    fromView.style.display = 'none';
                    _this.element.style.overflow = overflow_1;
                    fromView.style.position = fPos_1;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.aniObj.animate(toView, {
                name: (reverse === true ? anim[2] : anim[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: function () {
                    _this.trigger('actionComplete');
                }
            });
            this.curUL = toView;
        }
    };
    ListView.prototype.preRender = function () {
        this.listBaseOption = {
            template: this.template,
            headerTemplate: this.headerTemplate,
            groupTemplate: this.groupTemplate, expandCollapse: true, listClass: '',
            ariaAttributes: {
                itemRole: 'listitem', listRole: 'list', itemText: '',
                groupItemRole: 'group', wrapperRole: 'presentation'
            },
            fields: this.fields.properties, sortOrder: this.sortOrder, showIcon: this.showIcon,
            itemCreated: this.renderCheckbox.bind(this)
        };
        this.initialization();
    };
    ListView.prototype.initialization = function () {
        this.curDSLevel = [];
        this.animateOptions = {};
        this.curViewDS = [];
        this.currentLiElements = [];
        this.isNestedList = false;
        this.selectedData = [];
        this.selectedId = [];
        this.aniObj = new Animation(this.animateOptions);
    };
    ListView.prototype.renderCheckbox = function (args) {
        if (args.item.classList.contains(classNames.hasChild)) {
            this.isNestedList = true;
        }
        if (this.showCheckBox && this.isValidLI(args.item)) {
            var checkboxElement = void 0;
            var fieldData = void 0;
            checkboxElement = createCheckBox(this.createElement, false, {
                checked: false, enableRtl: this.enableRtl,
                cssClass: classNames.listviewCheckbox
            });
            checkboxElement.setAttribute('role', 'checkbox');
            var frameElement_1 = checkboxElement.querySelector('.' + classNames.checkboxIcon);
            args.item.classList.add(classNames.itemCheckList);
            args.item.firstElementChild.classList.add(classNames.checkbox);
            if (typeof this.dataSource[0] !== 'string' && typeof this.dataSource[0] !== 'number') {
                fieldData = getFieldValues(args.curData, this.listBaseOption.fields);
                if (fieldData[this.listBaseOption.fields.isChecked]) {
                    this.checkInternally(args, checkboxElement);
                }
            }
            else if (((typeof this.dataSource[0] === 'string' ||
                typeof this.dataSource[0] === 'number') && this.selectedData.indexOf(args.text) !== -1)) {
                this.checkInternally(args, checkboxElement);
            }
            checkboxElement.setAttribute('aria-checked', frameElement_1.classList.contains(classNames.checked) ? 'true' : 'false');
            if (this.checkBoxPosition === 'Left') {
                checkboxElement.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.insertBefore(checkboxElement, args.item.firstElementChild.childNodes[0]);
            }
            else {
                checkboxElement.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.appendChild(checkboxElement);
            }
            this.currentLiElements.push(args.item);
        }
    };
    ListView.prototype.checkInternally = function (args, checkboxElement) {
        args.item.classList.add(classNames.selected);
        args.item.setAttribute('aria-selected', 'true');
        checkboxElement.querySelector('.' + classNames.checkboxIcon).classList.add(classNames.checked);
        checkboxElement.setAttribute('aria-checked', 'true');
    };
    /**
     * It is used to check the checkbox of an item.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    ListView.prototype.checkItem = function (item) {
        this.toggleCheckBase(item, true);
    };
    ListView.prototype.toggleCheckBase = function (item, checked) {
        if (this.showCheckBox) {
            var liElement = item;
            if (item instanceof Object && item.constructor !== HTMLLIElement) {
                liElement = this.getLiFromObjOrElement(item);
            }
            if (!isNullOrUndefined(liElement)) {
                var checkboxIcon = liElement.querySelector('.' + classNames.checkboxIcon);
                checked ? liElement.classList.add(classNames.selected) : liElement.classList.remove(classNames.selected);
                liElement.setAttribute('aria-selected', checked ? 'true' : 'false');
                checked ? checkboxIcon.classList.add(classNames.checked) : checkboxIcon.classList.remove(classNames.checked);
                checkboxIcon.parentElement.setAttribute('aria-checked', checked ? 'true' : 'false');
            }
            this.setSelectedItemData(liElement);
        }
    };
    /**
     * It is used to uncheck the checkbox of an item.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    ListView.prototype.uncheckItem = function (item) {
        this.toggleCheckBase(item, false);
    };
    /**
     * It is used to check all the items in ListView.
     */
    ListView.prototype.checkAllItems = function () {
        this.toggleAllCheckBase(true);
    };
    /**
     * It is used to un-check all the items in ListView.
     */
    ListView.prototype.uncheckAllItems = function () {
        this.toggleAllCheckBase(false);
    };
    ListView.prototype.toggleAllCheckBase = function (checked) {
        if (this.showCheckBox) {
            for (var i = 0; i < this.liCollection.length; i++) {
                var checkIcon = this.liCollection[i].querySelector('.' + classNames.checkboxIcon);
                if (checkIcon) {
                    if (checked) {
                        if (!checkIcon.classList.contains(classNames.checked)) {
                            this.checkItem(this.liCollection[i]);
                        }
                    }
                    else {
                        if (checkIcon.classList.contains(classNames.checked)) {
                            this.uncheckItem(this.liCollection[i]);
                        }
                    }
                }
            }
            if (this.enableVirtualization) {
                this.virtualizationModule.checkedItem(checked);
            }
        }
    };
    ListView.prototype.setCheckbox = function () {
        var _this = this;
        if (this.showCheckBox) {
            var liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
            var args_1 = {
                item: undefined, curData: undefined, dataSource: undefined, fields: undefined,
                options: undefined, text: ''
            };
            liCollection.forEach(function (element) {
                args_1.item = element;
                args_1.curData = _this.getItemData(element);
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    _this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
                }
                _this.renderCheckbox(args_1);
                if (args_1.item.classList.contains(classNames.selected)) {
                    _this.checkInternally(args_1, args_1.item.querySelector('.' + classNames.checkboxWrapper));
                }
            });
        }
        else {
            var liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.itemCheckList));
            liCollection.forEach(function (element) {
                element.classList.remove(classNames.selected);
                element.firstElementChild.classList.remove(classNames.checkbox);
                _this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
            });
            if (this.selectedItems) {
                this.selectedItems.item.classList.add(classNames.selected);
            }
        }
    };
    /**
     * It is used to refresh the UI list item height
     */
    ListView.prototype.refreshItemHeight = function () {
        this.virtualizationModule.refreshItemHeight();
    };
    ListView.prototype.clickHandler = function (e) {
        var target = e.target;
        var classList = target.classList;
        if (classList.contains(classNames.backIcon) || classList.contains(classNames.headerText)) {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
        else {
            var li = closest(target.parentNode, '.' + classNames.listItem);
            if (li === null) {
                li = target;
            }
            this.removeFocus();
            if (this.enable && this.showCheckBox && this.isValidLI(li)) {
                if (e.target.classList.contains(classNames.checkboxIcon)) {
                    li.classList.add(classNames.focused);
                    if (isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                        var args = {
                            curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                            text: undefined, item: li
                        };
                        this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
                    }
                    else {
                        this.uncheckItem(li);
                        li.classList.add(classNames.focused);
                    }
                    if (e) {
                        var eventArgs = this.selectEventData(li, e);
                        var checkIcon = li.querySelector('.' + classNames.checkboxIcon);
                        merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
                        this.trigger('select', eventArgs);
                    }
                }
                else if (li.classList.contains(classNames.hasChild)) {
                    this.removeHover();
                    this.removeSelect();
                    this.removeSelect(li);
                    this.setSelectLI(li, e);
                    li.classList.remove(classNames.selected);
                }
                else {
                    this.setCheckboxLI(li, e);
                }
            }
            else {
                this.setSelectLI(li, e);
            }
        }
    };
    ListView.prototype.removeElement = function (element) {
        return element && element.parentNode && element.parentNode.removeChild(element);
    };
    ListView.prototype.hoverHandler = function (e) {
        var curLi = closest(e.target.parentNode, '.' + classNames.listItem);
        this.setHoverLI(curLi);
    };
    ListView.prototype.leaveHandler = function (e) {
        this.removeHover();
    };
    
    ListView.prototype.homeKeyHandler = function (e, end) {
        if (Object.keys(this.dataSource).length && this.curUL) {
            var li = this.curUL.querySelectorAll('.' + classNames.listItem);
            var focusedElement = this.curUL.querySelector('.' + classNames.focused) ||
                this.curUL.querySelector('.' + classNames.selected);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (!this.showCheckBox) {
                    focusedElement.classList.remove(classNames.selected);
                }
            }
            var index = !end ? 0 : li.length - 1;
            if (li[index].classList.contains(classNames.hasChild) || this.showCheckBox) {
                li[index].classList.add(classNames.focused);
            }
            else {
                this.setSelectLI(li[index], e);
            }
        }
    };
    ListView.prototype.onArrowKeyDown = function (e, prev) {
        var siblingLI;
        var li;
        var hasChild = !isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
        if (hasChild || this.showCheckBox) {
            li = this.curUL.querySelector('.' + classNames.focused) || this.curUL.querySelector('.' + classNames.selected);
            siblingLI = ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            if (!isNullOrUndefined(siblingLI)) {
                if (li) {
                    li.classList.remove(classNames.focused);
                    if (!this.showCheckBox) {
                        li.classList.remove(classNames.selected);
                    }
                }
                if (siblingLI.classList.contains(classNames.hasChild) || this.showCheckBox) {
                    siblingLI.classList.add(classNames.focused);
                }
                else {
                    this.setSelectLI(siblingLI, e);
                }
            }
        }
        else {
            li = this.curUL.querySelector('.' + classNames.selected);
            siblingLI = ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            this.setSelectLI(siblingLI, e);
        }
        return siblingLI;
    };
    ListView.prototype.arrowKeyHandler = function (e, prev) {
        var _this = this;
        if (Object.keys(this.dataSource).length && this.curUL) {
            var siblingLI = this.onArrowKeyDown(e, prev);
            var elementTop = this.element.getBoundingClientRect().top;
            var elementHeight = this.element.getBoundingClientRect().height;
            var firstItemBounds = this.curUL.querySelector('.' + classNames.listItem).getBoundingClientRect();
            var heightDiff = void 0;
            var groupItemBounds = void 0;
            if (this.fields.groupBy) {
                groupItemBounds = this.curUL.querySelector('.' + classNames.groupListItem).getBoundingClientRect();
            }
            if (siblingLI) {
                var siblingTop = siblingLI.getBoundingClientRect().top;
                var siblingHeight = siblingLI.getBoundingClientRect().height;
                if (!prev) {
                    var height = this.isWindow ? window.innerHeight : elementHeight;
                    heightDiff = this.isWindow ? (siblingTop + siblingHeight) :
                        ((siblingTop - elementTop) + siblingHeight);
                    if (heightDiff > height) {
                        this.isWindow ? window.scrollTo(0, pageYOffset + (heightDiff - height)) :
                            this.element.scrollTo(0, this.element.scrollTop + (heightDiff - height));
                    }
                }
                else {
                    heightDiff = this.isWindow ? siblingTop : (siblingTop - elementTop);
                    if (heightDiff < 0) {
                        this.isWindow ? window.scrollTo(0, pageYOffset + heightDiff) :
                            this.element.scrollTo(0, this.element.scrollTop + heightDiff);
                    }
                }
            }
            else if (this.enableVirtualization && prev && this.virtualizationModule.uiFirstIndex) {
                this.onUIScrolled = function () {
                    _this.onArrowKeyDown(e, prev);
                    _this.onUIScrolled = undefined;
                };
                heightDiff = this.virtualizationModule.listItemHeight;
                this.isWindow ? window.scrollTo(0, pageYOffset - heightDiff) :
                    this.element.scrollTo(0, this.element.scrollTop - heightDiff);
            }
            else if (prev) {
                if (this.showHeader && this.headerEle) {
                    var topHeight = groupItemBounds ? groupItemBounds.top : firstItemBounds.top;
                    var headerBounds = this.headerEle.getBoundingClientRect();
                    heightDiff = headerBounds.top < 0 ? (headerBounds.height - topHeight) : 0;
                    this.isWindow ? window.scrollTo(0, pageYOffset - heightDiff)
                        : this.element.scrollTo(0, 0);
                }
                else if (this.fields.groupBy) {
                    heightDiff = this.isWindow ? (groupItemBounds.top < 0 ? groupItemBounds.top : 0) :
                        (elementTop - firstItemBounds.top) + groupItemBounds.height;
                    this.isWindow ? window.scrollTo(0, pageYOffset + heightDiff) :
                        this.element.scrollTo(0, this.element.scrollTop - heightDiff);
                }
            }
        }
    };
    ListView.prototype.enterKeyHandler = function (e) {
        if (Object.keys(this.dataSource).length && this.curUL) {
            var hasChild = !isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
            var li = this.curUL.querySelector('.' + classNames.focused);
            if (hasChild && li) {
                li.classList.remove(classNames.focused);
                if (this.showCheckBox) {
                    this.removeSelect();
                    this.removeSelect(li);
                    this.removeHover();
                }
                this.setSelectLI(li, e);
            }
        }
    };
    ListView.prototype.spaceKeyHandler = function (e) {
        if (this.enable && this.showCheckBox && Object.keys(this.dataSource).length && this.curUL) {
            var li = this.curUL.querySelector('.' + classNames.focused);
            if (!isNullOrUndefined(li) && isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                var args = {
                    curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                    text: undefined, item: li
                };
                this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
            }
            else {
                this.uncheckItem(li);
            }
        }
    };
    ListView.prototype.keyActionHandler = function (e) {
        if (e.keyCode !== 9) {
            e.preventDefault();
        }
        switch (e.keyCode) {
            case 36:
                this.homeKeyHandler(e);
                break;
            case 35:
                this.homeKeyHandler(e, true);
                break;
            case 40:
                this.arrowKeyHandler(e);
                break;
            case 38:
                this.arrowKeyHandler(e, true);
                break;
            case 13:
                this.enterKeyHandler(e);
                break;
            case 8:
                if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                    this.uncheckAllItems();
                }
                this.back();
                break;
            case 9:
                this.tabFocus(e);
                break;
            case 32:
                this.spaceKeyHandler(e);
                break;
        }
    };
    ListView.prototype.swipeActionHandler = function (e) {
        if (e.swipeDirection === 'Right') {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
    };
    ListView.prototype.focusout = function () {
        if (Object.keys(this.dataSource).length && this.curUL) {
            var focusedElement = this.curUL.querySelector('.' + classNames.focused);
            var activeElement = this.curUL.querySelector('[aria-selected = true]');
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (activeElement && !this.showCheckBox) {
                    activeElement.classList.add(classNames.selected);
                }
            }
        }
    };
    ListView.prototype.wireEvents = function () {
        EventHandler.add(this.element, 'keydown', this.keyActionHandler, this);
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        if (!this.enableVirtualization) {
            EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
            EventHandler.add(this.element, 'mouseout', this.leaveHandler, this);
        }
        EventHandler.add(this.element, 'focusout', this.focusout, this);
        this.touchModule = new Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
    };
    ListView.prototype.unWireEvents = function () {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        if (!this.enableVirtualization) {
            EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
            EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        }
        EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        this.touchModule.destroy();
    };
    ListView.prototype.tabFocus = function (e) {
        if (this.curUL && ((!this.curUL.querySelector('.' + classNames.focused) && this.showCheckBox) ||
            (!this.curUL.querySelector('.' + classNames.selected) && !this.showCheckBox &&
                !this.curUL.querySelector('.' + classNames.hasChild)) ||
            (this.curUL.querySelector('.' + classNames.hasChild) &&
                !this.curUL.querySelector('.' + classNames.focused) &&
                !this.curUL.querySelector('.' + classNames.selected)))) {
            e.preventDefault();
        }
        if (Object.keys(this.dataSource).length && this.curUL) {
            var selectedList = this.curUL.querySelector('.' + classNames.selected);
            if ((!selectedList && this.curUL) || this.showCheckBox) {
                var li = selectedList || this.curUL.querySelector('.' + classNames.listItem);
                if (li.classList.contains(classNames.hasChild) || this.showCheckBox) {
                    var focusedElement = this.curUL.querySelector('.' + classNames.focused);
                    if (isNullOrUndefined(focusedElement)) {
                        li.classList.add(classNames.focused);
                    }
                }
                else {
                    this.setSelectLI(li, e);
                }
            }
        }
    };
    ListView.prototype.removeFocus = function () {
        var focusedLI = this.element.querySelectorAll('.' + classNames.focused);
        for (var _i = 0, focusedLI_1 = focusedLI; _i < focusedLI_1.length; _i++) {
            var ele = focusedLI_1[_i];
            ele.classList.remove(classNames.focused);
        }
    };
    ListView.prototype.removeHover = function () {
        var hoverLI = this.element.querySelector('.' + classNames.hover);
        if (hoverLI) {
            hoverLI.classList.remove(classNames.hover);
        }
    };
    ListView.prototype.removeSelect = function (li) {
        if (isNullOrUndefined(li)) {
            var selectedLI = this.element.querySelectorAll('.' + classNames.selected);
            for (var _i = 0, selectedLI_1 = selectedLI; _i < selectedLI_1.length; _i++) {
                var ele = selectedLI_1[_i];
                if (this.showCheckBox && ele.querySelector('.' + classNames.checked)) {
                    continue;
                }
                else {
                    ele.setAttribute('aria-selected', 'false');
                    ele.classList.remove(classNames.selected);
                }
            }
        }
        else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
    };
    ListView.prototype.isValidLI = function (li) {
        return (li && li.classList.contains(classNames.listItem)
            && !li.classList.contains(classNames.groupListItem)
            && !li.classList.contains(classNames.disable));
    };
    ListView.prototype.setCheckboxLI = function (li, e) {
        if (this.isValidLI(li) && this.enable && this.showCheckBox) {
            if (this.curUL.querySelector('.' + classNames.focused)) {
                this.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
            }
            li.classList.add(classNames.focused);
            var checkboxElement = li.querySelector('.' + classNames.checkboxWrapper);
            var checkIcon = checkboxElement.querySelector('.' + classNames.checkboxIcon + '.' + classNames.icon);
            this.removeHover();
            if (!checkIcon.classList.contains(classNames.checked)) {
                checkIcon.classList.add(classNames.checked);
                li.classList.add(classNames.selected);
                li.setAttribute('aria-selected', 'true');
            }
            else {
                checkIcon.classList.remove(classNames.checked);
                li.classList.remove(classNames.selected);
                li.setAttribute('aria-selected', 'false');
            }
            checkboxElement.setAttribute('aria-checked', checkIcon.classList.contains(classNames.checked) ?
                'true' : 'false');
            var eventArgs = this.selectEventData(li, e);
            merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
            if (this.enableVirtualization) {
                this.virtualizationModule.setCheckboxLI(li, e);
            }
            this.trigger('select', eventArgs);
            this.setSelectedItemData(li);
            this.renderSubList(li);
        }
    };
    ListView.prototype.selectEventData = function (li, e) {
        var data = this.getItemData(li);
        var fieldData = getFieldValues(data, this.listBaseOption.fields);
        var selectedItem;
        if (!isNullOrUndefined(data)
            && typeof this.dataSource[0] === 'string' || typeof this.dataSource[0] === 'number') {
            selectedItem = { item: li, text: li && li.innerText.trim(), data: this.dataSource };
        }
        else {
            selectedItem = { item: li, text: fieldData && fieldData[this.listBaseOption.fields.text], data: data };
        }
        var eventArgs = {};
        merge(eventArgs, selectedItem);
        if (e) {
            merge(eventArgs, { isInteracted: true, event: e, index: Array.prototype.indexOf.call(this.curUL.children, li) });
        }
        return eventArgs;
    };
    ListView.prototype.setSelectedItemData = function (li) {
        var data = this.getItemData(li);
        var fieldData = getFieldValues(data, this.listBaseOption.fields);
        if (!isNullOrUndefined(data) && ((typeof this.dataSource[0] === 'string') ||
            (typeof this.dataSource[0] === 'number'))) {
            this.selectedItems = {
                item: li,
                text: li && li.innerText.trim(),
                data: this.dataSource
            };
        }
        else {
            this.selectedItems = {
                item: li,
                text: fieldData && fieldData[this.listBaseOption.fields.text],
                data: data
            };
        }
    };
    ListView.prototype.setSelectLI = function (li, e) {
        if (this.isValidLI(li) && !li.classList.contains(classNames.selected) && this.enable) {
            if (!this.showCheckBox) {
                this.removeSelect();
            }
            li.classList.add(classNames.selected);
            li.setAttribute('aria-selected', 'true');
            this.removeHover();
            this.setSelectedItemData(li);
            if (this.enableVirtualization) {
                this.virtualizationModule.setSelectLI(li, e);
            }
            var eventArgs = this.selectEventData(li, e);
            this.trigger('select', eventArgs);
            this.selectedLI = li;
            this.renderSubList(li);
        }
    };
    ListView.prototype.setHoverLI = function (li) {
        if (this.isValidLI(li) && !li.classList.contains(classNames.hover) && this.enable) {
            var lastLi = this.element.querySelectorAll('.' + classNames.hover);
            if (lastLi && lastLi.length) {
                removeClass(lastLi, classNames.hover);
            }
            if (!li.classList.contains(classNames.selected) || this.showCheckBox) {
                li.classList.add(classNames.hover);
            }
        }
    };
    //Data Source Related Functions
    ListView.prototype.getSubDS = function () {
        var levelKeys = this.curDSLevel;
        if (levelKeys.length) {
            var ds = this.localData;
            for (var _i = 0, levelKeys_1 = levelKeys; _i < levelKeys_1.length; _i++) {
                var key = levelKeys_1[_i];
                var field = {};
                field[this.fields.id] = key;
                this.curDSJSON = this.findItemFromDS(ds, field);
                var fieldData = getFieldValues(this.curDSJSON, this.listBaseOption.fields);
                ds = this.curDSJSON ? fieldData[this.fields.child] : ds;
            }
            return ds;
        }
        return this.localData;
    };
    ListView.prototype.getItemData = function (li) {
        var dataSource = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        var fields = this.getElementUID(li);
        var curDS;
        if (isNullOrUndefined(this.element.querySelector('.' + classNames.hasChild)) && this.fields.groupBy) {
            curDS = this.curViewDS;
        }
        else {
            curDS = dataSource;
        }
        return this.findItemFromDS(curDS, fields);
    };
    ListView.prototype.findItemFromDS = function (dataSource, fields, parent) {
        var _this = this;
        var resultJSON;
        if (dataSource && dataSource.length && fields) {
            dataSource.some(function (data) {
                var fieldData = getFieldValues(data, _this.listBaseOption.fields);
                //(!(fid) || id === fid) && (!(ftext) || text === ftext) && (!!fid || !!ftext)
                if ((fields[_this.fields.id] || fields[_this.fields.text]) &&
                    (!fields[_this.fields.id] || (!isNullOrUndefined(fieldData[_this.fields.id]) &&
                        fieldData[_this.fields.id].toString()) === fields[_this.fields.id].toString()) &&
                    (!fields[_this.fields.text] || fieldData[_this.fields.text] === fields[_this.fields.text])) {
                    resultJSON = (parent ? dataSource : data);
                }
                else if (typeof data !== 'object' && dataSource.indexOf(data) !== -1) {
                    resultJSON = (parent ? dataSource : data);
                }
                else if (!isNullOrUndefined(fields[_this.fields.id]) && isNullOrUndefined(fieldData[_this.fields.id])) {
                    var li = _this.element.querySelector('[data-uid="'
                        + fields[_this.fields.id] + '"]');
                    if (li && li.innerText.trim() === fieldData[_this.fields.text]) {
                        resultJSON = data;
                    }
                }
                else if (fieldData.hasOwnProperty(_this.fields.child) && fieldData[_this.fields.child].length) {
                    resultJSON = _this.findItemFromDS(fieldData[_this.fields.child], fields, parent);
                }
                return !!resultJSON;
            });
        }
        else {
            resultJSON = dataSource;
        }
        return resultJSON;
    };
    ListView.prototype.getQuery = function () {
        var columns = [];
        var query = (this.query ? this.query : new Query());
        if (!this.query) {
            for (var _i = 0, _a = Object.keys(this.fields.properties); _i < _a.length; _i++) {
                var column = _a[_i];
                if (column !== 'tableName' && !!(this.fields[column]) &&
                    this.fields[column] !==
                        ListBase.defaultMappedFields[column]
                    && columns.indexOf(this.fields[column]) === -1) {
                    columns.push(this.fields[column]);
                }
            }
            query.select(columns);
            if (this.fields.properties.hasOwnProperty('tableName')) {
                query.from(this.fields.tableName);
            }
        }
        return query;
    };
    ListView.prototype.setViewDataSource = function (dataSource) {
        if (dataSource === void 0) { dataSource = this.localData; }
        if (dataSource && this.fields.groupBy) {
            if (this.sortOrder !== 'None') {
                this.curViewDS = ListBase.groupDataSource(ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, this.fields.sortBy)), this.listBaseOption.fields, this.sortOrder);
            }
            else {
                this.curViewDS = ListBase.groupDataSource(dataSource, this.listBaseOption.fields, this.sortOrder);
            }
        }
        else if (dataSource && this.sortOrder !== 'None') {
            this.curViewDS = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, this.fields.sortBy));
        }
        else {
            this.curViewDS = dataSource;
        }
    };
    ListView.prototype.isInAnimation = function () {
        return this.curUL.classList.contains('.e-animate');
    };
    ListView.prototype.setLocalData = function () {
        var _this = this;
        this.trigger('actionBegin');
        if (this.dataSource instanceof DataManager) {
            this.dataSource.executeQuery(this.getQuery()).then(function (e) {
                if (_this.isDestroyed) {
                    return;
                }
                _this.localData = e.result;
                _this.renderList();
                _this.trigger('actionComplete', e);
            }).catch(function (e) {
                if (_this.isDestroyed) {
                    return;
                }
                _this.trigger('actionFailure', e);
            });
        }
        else if (!this.dataSource || !this.dataSource.length) {
            var ul = this.element.querySelector('ul');
            if (ul) {
                remove(ul);
                this.setProperties({ dataSource: ListBase.createJsonFromElement(ul) }, true);
                this.localData = this.dataSource;
                this.renderList();
                this.trigger('actionComplete', { data: this.localData });
            }
        }
        else {
            this.localData = this.dataSource;
            this.renderList();
            this.trigger('actionComplete', { data: this.localData });
        }
    };
    ListView.prototype.reRender = function () {
        this.element.innerHTML = '';
        this.headerEle = this.ulElement = this.liCollection = undefined;
        this.setLocalData();
        this.header();
    };
    ListView.prototype.resetCurrentList = function () {
        this.setViewDataSource(this.curViewDS);
        this.contentContainer.innerHTML = '';
        this.createList();
        this.renderIntoDom(this.curUL);
    };
    ListView.prototype.createList = function () {
        this.currentLiElements = [];
        this.isNestedList = false;
        this.ulElement = this.curUL = ListBase.createList(this.createElement, this.curViewDS, this.listBaseOption);
        this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
    };
    ListView.prototype.renderSubList = function (li) {
        var uID = li.getAttribute('data-uid');
        if (li.classList.contains(classNames.hasChild) && uID) {
            var ul = closest(li.parentNode, '.' + classNames.parentItem);
            var ele = this.element.querySelector('[pid=\'' + uID + '\']');
            this.curDSLevel.push(uID);
            this.setViewDataSource(this.getSubDS());
            if (!ele) {
                var data = this.curViewDS;
                ele = ListBase.createListFromJson(this.createElement, data, this.listBaseOption, this.curDSLevel.length);
                ele.setAttribute('pID', uID);
                ele.style.display = 'none';
                this.renderIntoDom(ele);
            }
            this.switchView(ul, ele);
            this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
            if (this.selectedItems) {
                var fieldData = getFieldValues(this.selectedItems.data, this.listBaseOption.fields);
                this.header((fieldData[this.listBaseOption.fields.text]), true);
            }
            this.selectedLI = undefined;
        }
    };
    ListView.prototype.renderIntoDom = function (ele) {
        this.contentContainer.appendChild(ele);
    };
    ListView.prototype.renderList = function (data) {
        this.setViewDataSource(data);
        if (this.enableVirtualization && Object.keys(this.dataSource).length) {
            if ((this.template || this.groupTemplate) && !this.virtualizationModule.isNgTemplate()) {
                this.listBaseOption.template = null;
                this.listBaseOption.groupTemplate = null;
                this.listBaseOption.itemCreated = this.virtualizationModule.createUIItem.bind(this.virtualizationModule);
            }
            this.virtualizationModule.uiVirtualization();
        }
        else {
            this.createList();
            this.contentContainer = this.createElement('div', { className: classNames.content });
            this.element.appendChild(this.contentContainer);
            this.renderIntoDom(this.ulElement);
        }
    };
    ListView.prototype.getElementUID = function (obj) {
        var fields = {};
        if (obj instanceof Element) {
            fields[this.fields.id] = obj.getAttribute('data-uid');
        }
        else {
            fields = obj;
        }
        return fields;
    };
    /**
     * It is used to Initialize the control rendering.
     */
    ListView.prototype.render = function () {
        this.element.classList.add(classNames.root);
        attributes(this.element, { role: 'list', tabindex: '0' });
        this.setCSSClass();
        this.setEnableRTL();
        this.setEnable();
        this.setSize();
        this.wireEvents();
        this.header();
        this.setLocalData();
        this.setHTMLAttribute();
        this.rippleFn = rippleEffect(this.element, {
            selector: '.' + classNames.listItem
        });
    };
    /**
     * It is used to destroy the ListView component.
     */
    ListView.prototype.destroy = function () {
        this.unWireEvents();
        var classAr = [classNames.root, classNames.disable, 'e-rtl',
            'e-has-header', 'e-lib'].concat(this.cssClass.split(' ').filter(function (css) { return css; }));
        removeClass([this.element], classAr);
        this.rippleFn();
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.element.innerHTML = '';
        this.curUL = this.ulElement = this.liCollection = this.headerEle = undefined;
        _super.prototype.destroy.call(this);
    };
    /**
     * It helps to switch back from navigated sub list.
     */
    ListView.prototype.back = function () {
        var pID = this.curDSLevel[this.curDSLevel.length - 1];
        if (pID === undefined || this.isInAnimation()) {
            return;
        }
        this.curDSLevel.pop();
        this.setViewDataSource(this.getSubDS());
        var toUL = this.element.querySelector('[data-uid=\'' + pID + '\']');
        var fromUL = this.curUL;
        if (!toUL) {
            this.createList();
            this.renderIntoDom(this.ulElement);
            toUL = this.curUL;
        }
        else {
            toUL = toUL.parentElement;
        }
        var fieldData = getFieldValues(this.curDSJSON, this.listBaseOption.fields);
        var text = fieldData[this.fields.text];
        this.switchView(fromUL, toUL, true);
        this.removeFocus();
        var li = this.element.querySelector('[data-uid=\'' + pID + '\']');
        li.classList.add(classNames.focused);
        if (this.showCheckBox && li.querySelector('.' + classNames.checkboxIcon).classList.contains(classNames.checked)) {
            li.setAttribute('aria-selected', 'true');
        }
        else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
        this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
        this.header((this.curDSLevel.length ? text : this.headerTitle), (this.curDSLevel.length ? true : false));
    };
    /**
     * It is used to select the list item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.selectItem = function (obj) {
        if (this.enableVirtualization) {
            this.virtualizationModule.selectItem(obj);
        }
        else if (this.showCheckBox) {
            this.setCheckboxLI(this.getLiFromObjOrElement(obj));
        }
        else {
            isNullOrUndefined(obj) ? this.removeSelect() : this.setSelectLI(this.getLiFromObjOrElement(obj));
        }
    };
    ListView.prototype.getLiFromObjOrElement = function (obj) {
        var li;
        var dataSource = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        if (!isNullOrUndefined(obj)) {
            if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                if (obj instanceof Element) {
                    var uid = obj.getAttribute('data-uid').toString();
                    for (var i = 0; i < this.liCollection.length; i++) {
                        if (this.liCollection[i].getAttribute('data-uid').toString() === uid) {
                            li = this.liCollection[i];
                            break;
                        }
                    }
                }
                else {
                    Array.prototype.some.call(this.curUL.querySelectorAll('.' + classNames.listItem), function (item) {
                        if (item.innerText.trim() === obj.toString()) {
                            li = item;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                }
            }
            else {
                var resultJSON = this.getItemData(obj);
                var fieldData = getFieldValues(resultJSON, this.listBaseOption.fields);
                if (resultJSON) {
                    li = this.element.querySelector('[data-uid="'
                        + fieldData[this.fields.id] + '"]');
                    if (!this.enableVirtualization && isNullOrUndefined(li)) {
                        var curLi = this.element.querySelectorAll('.' + classNames.listItem);
                        for (var i = 0; i < curLi.length; i++) {
                            if (curLi[i].innerText.trim() === fieldData[this.fields.text]) {
                                li = curLi[i];
                            }
                        }
                    }
                }
            }
        }
        return li;
    };
    /**
     * It is used to select multiple list item from the ListView.
     * @param  {Fields[] | HTMLElement[] | Element[]} obj - We can pass array of elements or array of field Object with ID and Text fields.
     */
    ListView.prototype.selectMultipleItems = function (obj) {
        if (!isNullOrUndefined(obj)) {
            for (var i = 0; i < obj.length; i++) {
                if (!isNullOrUndefined(obj[i])) {
                    this.selectItem(obj[i]);
                }
            }
        }
    };
    ListView.prototype.getParentId = function () {
        var parentId = [];
        if (this.isNestedList) {
            for (var i = this.curDSLevel.length - 1; i >= 0; i--) {
                parentId.push(this.curDSLevel[i]);
            }
        }
        return parentId;
    };
    /**
     * It is used to get the currently [here](./api-selectedItem)
     *  item details from the list items.
     */
    ListView.prototype.getSelectedItems = function () {
        this.selectedId = [];
        var dataSource = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        if (this.enableVirtualization) {
            return this.virtualizationModule.getSelectedItems();
        }
        else if (this.showCheckBox) {
            var liCollection = this.curUL.getElementsByClassName(classNames.selected);
            var liTextCollection = [];
            var liDataCollection = [];
            this.selectedId = [];
            var dataParent = [];
            for (var i = 0; i < liCollection.length; i++) {
                if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                    liTextCollection.push(liCollection[i].innerText.trim());
                }
                else {
                    var tempData = this.getItemData(liCollection[i]);
                    var fieldData = getFieldValues(tempData, this.listBaseOption.fields);
                    if (this.isNestedList) {
                        dataParent.push({ data: tempData, parentId: this.getParentId() });
                    }
                    else {
                        liDataCollection.push(tempData);
                    }
                    if (fieldData) {
                        liTextCollection.push(fieldData[this.listBaseOption.fields.text]);
                        this.selectedId.push(fieldData[this.listBaseOption.fields.id]);
                    }
                    else {
                        liTextCollection.push(undefined);
                        this.selectedId.push(undefined);
                    }
                }
            }
            if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                return { item: liCollection, data: dataSource, text: liTextCollection };
            }
            if (this.isNestedList) {
                return { item: liCollection, data: dataParent, text: liTextCollection };
            }
            else {
                return { item: liCollection, data: liDataCollection, text: liTextCollection };
            }
        }
        else {
            var liElement = this.element.getElementsByClassName(classNames.selected)[0];
            var fieldData = getFieldValues(this.getItemData(liElement), this.listBaseOption.fields);
            if (typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number') {
                return (!isNullOrUndefined(liElement)) ? {
                    item: liElement, data: dataSource,
                    text: liElement.innerText.trim()
                } : undefined;
            }
            else {
                if (isNullOrUndefined(fieldData) || isNullOrUndefined(liElement)) {
                    return undefined;
                }
                else {
                    this.selectedId.push(fieldData[this.listBaseOption.fields.id]);
                    return {
                        text: fieldData[this.listBaseOption.fields.text], item: liElement,
                        data: this.getItemData(liElement)
                    };
                }
            }
        }
    };
    /**
     * It is used to find out an item details from the current list.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.findItem = function (obj) {
        return this.getItemData(obj);
    };
    /**
     * A function that used to enable the disabled list items based on passed element.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.enableItem = function (obj) {
        this.setItemState(obj, true);
        if (this.enableVirtualization) {
            this.virtualizationModule.enableItem(obj);
        }
    };
    /**
     * It is used to disable the list items based on passed element.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.disableItem = function (obj) {
        this.setItemState(obj, false);
        if (this.enableVirtualization) {
            this.virtualizationModule.disableItem(obj);
        }
    };
    //A function that used to set state of the list item like enable, disable.
    ListView.prototype.setItemState = function (obj, isEnable) {
        var resultJSON = this.getItemData(obj);
        var fieldData = getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            var li = this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (isEnable) {
                if (li) {
                    li.classList.remove(classNames.disable);
                }
                delete resultJSON[this.fields.enabled];
            }
            else if (!isEnable) {
                if (li) {
                    li.classList.add(classNames.disable);
                }
                resultJSON[this.fields.enabled] = false;
            }
        }
    };
    /**
     * It is used to show an list item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.showItem = function (obj) {
        this.showHideItem(obj, false, '');
        if (this.enableVirtualization) {
            this.virtualizationModule.showItem(obj);
        }
    };
    /**
     * It is used to hide an item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.hideItem = function (obj) {
        this.showHideItem(obj, true, 'none');
        if (this.enableVirtualization) {
            this.virtualizationModule.hideItem(obj);
        }
    };
    ListView.prototype.showHideItem = function (obj, isHide, display) {
        var resultJSON = this.getItemData(obj);
        var fieldData = getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            var li = this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (li) {
                li.style.display = display;
            }
            if (isHide) {
                resultJSON[this.fields.isVisible] = false;
            }
            else {
                delete resultJSON[this.fields.isVisible];
            }
        }
    };
    /**
     * It adds new item to current ListView.
     * To add a new item in the list view, we need to pass ‘data’ as array or object and ‘fields’ as object.
     * For example fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {{[key:string]:Object}[]} data - Array JSON Data that need to add.
     * @param  {Fields} fields - Fields as an Object with ID and Text fields.
     */
    ListView.prototype.addItem = function (data, fields) {
        var _this = this;
        if (fields === void 0) { fields = undefined; }
        if (!(this.dataSource instanceof DataManager)) {
            if (data instanceof Array) {
                if (this.enableVirtualization) {
                    this.virtualizationModule.addItem(data, fields);
                }
                else {
                    var ds = this.findItemFromDS(this.dataSource, fields);
                    var fieldData = getFieldValues(ds, this.listBaseOption.fields);
                    var child = fieldData[this.fields.child];
                    if (!child) {
                        child = [];
                    }
                    child = child.concat(data);
                    if (ds instanceof Array) {
                        data.forEach(function (dataSource) {
                            _this.dataSource.push(dataSource);
                            _this.setViewDataSource(_this.dataSource);
                            if (_this.ulElement) {
                                var index = _this.curViewDS.indexOf(dataSource);
                                _this.addListItem(dataSource, index);
                                var curViewDS = _this.curViewDS[index - 1];
                                if (curViewDS && curViewDS.isHeader && curViewDS.items.length === 1) {
                                    _this.addListItem(curViewDS, (index - 1));
                                }
                            }
                            else {
                                _this.reRender();
                            }
                        });
                        this.liCollection = this.curUL.querySelectorAll('.' + classNames.listItem);
                    }
                    else {
                        ds[this.fields.child] = child;
                        this.reRender();
                    }
                }
            }
        }
    };
    ListView.prototype.addListItem = function (dataSource, index) {
        var target = this.getLiFromObjOrElement(this.curViewDS[index + 1]) ||
            this.getLiFromObjOrElement(this.curViewDS[index + 2]) || null;
        var li = ListBase.createListItemFromJson(this.createElement, [dataSource], this.listBaseOption);
        this.ulElement.insertBefore(li[0], target);
    };
    /**
     * A function that removes the item from data source based on passed element like fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    ListView.prototype.removeItem = function (obj) {
        if (!(this.dataSource instanceof DataManager)) {
            if (this.enableVirtualization) {
                this.virtualizationModule.removeItem(obj);
            }
            else {
                this.removeItemFromList(obj);
            }
        }
    };
    ListView.prototype.removeItemFromList = function (obj) {
        var fields = obj instanceof Element ? this.getElementUID(obj) : obj;
        var dataSource;
        dataSource = this.findItemFromDS(this.dataSource, fields, true);
        if (dataSource) {
            var data = void 0;
            data = this.findItemFromDS(dataSource, fields);
            var index = this.curViewDS.indexOf(data);
            var li = this.getLiFromObjOrElement(obj);
            var groupLi = void 0;
            if (this.fields.groupBy && this.curViewDS[index - 1] &&
                this.curViewDS[index - 1].isHeader &&
                (this.curViewDS[index - 1])
                    .items.length === 1) {
                if (li && li.previousElementSibling.classList.contains(classNames.groupListItem) &&
                    (isNullOrUndefined(li.nextElementSibling) || (li.nextElementSibling &&
                        li.nextElementSibling.classList.contains(classNames.groupListItem)))) {
                    groupLi = li.previousElementSibling;
                }
            }
            if (li) {
                detach(li);
            }
            if (groupLi) {
                detach(groupLi);
            }
            var dsIndex = dataSource.indexOf(data);
            dataSource.splice(dsIndex, 1);
            this.setViewDataSource(this.dataSource);
            this.liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
        }
    };
    /**
     * A function that removes multiple item from list view based on given input.
     * @param  {Fields[] | HTMLElement[] | Element[]} obj - We can pass array of elements or array of field Object with ID and Text fields.
     */
    ListView.prototype.removeMultipleItems = function (obj) {
        if (!(this.dataSource instanceof DataManager)) {
            if (obj.length) {
                for (var i = 0; i < obj.length; i++) {
                    if (this.enableVirtualization) {
                        this.removeItem(obj[i]);
                    }
                    else {
                        this.removeItemFromList(obj[i]);
                    }
                }
            }
        }
    };
    // Module Required function
    ListView.prototype.getModuleName = function () {
        return 'listview';
    };
    ListView.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualization' });
        }
        return modules;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    ListView.prototype.getPersistData = function () {
        return this.addOnPersist(['cssClass', 'enableRtl', 'htmlAttributes',
            'enable', 'fields', 'animation', 'headerTitle',
            'sortOrder', 'showIcon', 'height', 'width', 'showCheckBox', 'checkBoxPosition']);
    };
    __decorate([
        Property('')
    ], ListView.prototype, "cssClass", void 0);
    __decorate([
        Property(false)
    ], ListView.prototype, "enableVirtualization", void 0);
    __decorate([
        Property({})
    ], ListView.prototype, "htmlAttributes", void 0);
    __decorate([
        Property(true)
    ], ListView.prototype, "enable", void 0);
    __decorate([
        Property([])
    ], ListView.prototype, "dataSource", void 0);
    __decorate([
        Property()
    ], ListView.prototype, "query", void 0);
    __decorate([
        Complex(ListBase.defaultMappedFields, FieldSettings)
    ], ListView.prototype, "fields", void 0);
    __decorate([
        Property({ effect: 'SlideLeft', duration: 400, easing: 'ease' })
    ], ListView.prototype, "animation", void 0);
    __decorate([
        Property('None')
    ], ListView.prototype, "sortOrder", void 0);
    __decorate([
        Property(false)
    ], ListView.prototype, "showIcon", void 0);
    __decorate([
        Property(false)
    ], ListView.prototype, "showCheckBox", void 0);
    __decorate([
        Property('Left')
    ], ListView.prototype, "checkBoxPosition", void 0);
    __decorate([
        Property('')
    ], ListView.prototype, "headerTitle", void 0);
    __decorate([
        Property(false)
    ], ListView.prototype, "showHeader", void 0);
    __decorate([
        Property('')
    ], ListView.prototype, "height", void 0);
    __decorate([
        Property('')
    ], ListView.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], ListView.prototype, "template", void 0);
    __decorate([
        Property(null)
    ], ListView.prototype, "headerTemplate", void 0);
    __decorate([
        Property(null)
    ], ListView.prototype, "groupTemplate", void 0);
    __decorate([
        Event()
    ], ListView.prototype, "select", void 0);
    __decorate([
        Event()
    ], ListView.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], ListView.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], ListView.prototype, "actionFailure", void 0);
    ListView = __decorate([
        NotifyPropertyChanges
    ], ListView);
    return ListView;
}(Component));

var Virtualization = /** @__PURE__ @class */ (function () {
    function Virtualization(instance) {
        this.listViewInstance = instance;
    }
    /**
     * For internal use only.
     * @private
     */
    Virtualization.prototype.isNgTemplate = function () {
        return !isNullOrUndefined(this.listViewInstance.templateRef) && typeof this.listViewInstance.templateRef !== 'string'
            && isNullOrUndefined(this.listViewInstance.fields.groupBy);
    };
    /**
     * For internal use only.
     * @private
     */
    Virtualization.prototype.uiVirtualization = function () {
        var curViewDS = this.listViewInstance.curViewDS;
        var firstDs = curViewDS.slice(0, 1);
        this.listViewInstance.ulElement = this.listViewInstance.curUL = ListBase.createList(this.listViewInstance.createElement, firstDs, this.listViewInstance.listBaseOption);
        this.listViewInstance.contentContainer = this.listViewInstance.createElement('div', { className: classNames.content });
        this.listViewInstance.element.appendChild(this.listViewInstance.contentContainer);
        this.listViewInstance.contentContainer.appendChild(this.listViewInstance.ulElement);
        this.listItemHeight = this.listViewInstance.ulElement.firstElementChild.getBoundingClientRect().height;
        this.expectedDomItemCount = this.ValidateItemCount(10000);
        this.domItemCount = this.ValidateItemCount(Object.keys(this.listViewInstance.curViewDS).length);
        this.uiFirstIndex = 0;
        this.uiLastIndex = this.domItemCount - 1;
        this.wireScrollEvent(false);
        var otherDs = curViewDS.slice(1, this.domItemCount);
        var listItems = ListBase.createListItemFromJson(this.listViewInstance.createElement, otherDs, this.listViewInstance.listBaseOption);
        append(listItems, this.listViewInstance.ulElement);
        this.listViewInstance.liCollection = this.listViewInstance.curUL.querySelectorAll('li');
        this.topElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.topElement, this.listViewInstance.ulElement.firstElementChild);
        this.bottomElement = this.listViewInstance.createElement('div');
        this.listViewInstance.ulElement.insertBefore(this.bottomElement, null);
        this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
        this.topElement.style.height = 0 + 'px';
        this.bottomElement.style.height = this.totalHeight + 'px';
        this.topElementHeight = 0;
        this.bottomElementHeight = this.totalHeight;
        this.listDiff = 0;
        this.uiIndicesInitialization();
    };
    Virtualization.prototype.wireScrollEvent = function (destroy) {
        if (!destroy) {
            if (this.listViewInstance.isWindow) {
                this.onVirtualScroll = this.onVirtualUiScroll.bind(this);
                window.addEventListener('scroll', this.onVirtualScroll);
            }
            else {
                EventHandler.add(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll, this);
            }
        }
        else {
            this.listViewInstance.isWindow ? window.removeEventListener('scroll', this.onVirtualScroll) :
                EventHandler.remove(this.listViewInstance.element, 'scroll', this.onVirtualUiScroll);
        }
    };
    Virtualization.prototype.ValidateItemCount = function (dataSourceLength) {
        var itemCount = this.listViewInstance.isWindow ? Math.round((window.innerHeight / this.listItemHeight) * 3) :
            Math.round((this.listViewInstance.height / this.listItemHeight) * 1.5);
        if (itemCount > dataSourceLength) {
            itemCount = dataSourceLength;
        }
        return itemCount;
    };
    Virtualization.prototype.uiIndicesInitialization = function () {
        var _this = this;
        this.uiIndices = { 'activeIndices': [], 'disabledItemIndices': [], 'hiddenItemIndices': [] };
        this.listViewInstance.curViewDS.forEach(function (ds, index) {
            if (_this.listViewInstance.showCheckBox && ds[_this.listViewInstance.fields.isChecked]) {
                _this.uiIndices.activeIndices.push(index);
            }
            if (!isNullOrUndefined(ds[_this.listViewInstance.fields.enabled]) && !ds[_this.listViewInstance.fields.enabled]) {
                _this.uiIndices.disabledItemIndices.push(index);
            }
        });
        if (this.isNgTemplate()) {
            Array.prototype.forEach.call(this.listViewInstance.element.querySelectorAll('.' + classNames.listItem), function (item, index) {
                item.context = _this.listViewInstance.viewContainerRef._embeddedViews[index].context;
            });
        }
    };
    Virtualization.prototype.refreshItemHeight = function () {
        if (this.listViewInstance.curViewDS.length) {
            var curViewDS = this.listViewInstance.curViewDS;
            this.listItemHeight = this.topElement.nextSibling.getBoundingClientRect().height;
            this.totalHeight = (Object.keys(curViewDS).length * this.listItemHeight) - (this.domItemCount * this.listItemHeight);
            this.bottomElementHeight = this.totalHeight;
            this.bottomElement.style.height = this.totalHeight + 'px';
        }
    };
    Virtualization.prototype.getscrollerHeight = function (startingHeight) {
        return this.listViewInstance.isWindow ? (((pageYOffset - startingHeight) <= 0) ? 0 :
            (pageYOffset - startingHeight)) : ((this.listViewInstance.element.scrollTop - startingHeight) <= 0) ? 0 :
            (this.listViewInstance.element.scrollTop - startingHeight);
    };
    Virtualization.prototype.onVirtualUiScroll = function () {
        var _a;
        var startingHeight;
        if (this.listViewInstance.isWindow) {
            startingHeight = this.listViewInstance.ulElement.getBoundingClientRect().top -
                document.documentElement.getBoundingClientRect().top;
        }
        else {
            startingHeight = this.listViewInstance.headerEle ? this.listViewInstance.headerEle.getBoundingClientRect().height : 0;
        }
        this.scrollPosition = isNullOrUndefined(this.scrollPosition) ? 0 : this.scrollPosition;
        var scroll = this.getscrollerHeight(startingHeight);
        this.topElementHeight = this.listItemHeight * Math.floor(scroll / this.listItemHeight);
        this.bottomElementHeight = this.totalHeight - this.topElementHeight;
        _a = scroll <= this.totalHeight ?
            [this.topElementHeight, this.bottomElementHeight] : [this.totalHeight, 0], this.topElementHeight = _a[0], this.bottomElementHeight = _a[1];
        if (this.topElementHeight !== parseFloat(this.topElement.style.height)) {
            this.topElement.style.height = this.topElementHeight + 'px';
            this.bottomElement.style.height = this.bottomElementHeight + 'px';
            if (scroll > this.scrollPosition) {
                var listDiff = ((this.topElementHeight / this.listItemHeight) - this.listDiff);
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, true);
                }
                else {
                    this.onNormalScroll(listDiff, true);
                }
            }
            else {
                var listDiff = (this.listDiff - (this.topElementHeight / this.listItemHeight));
                if (listDiff > (this.expectedDomItemCount + 5)) {
                    this.onLongScroll(listDiff, false);
                }
                else {
                    this.onNormalScroll(listDiff, false);
                }
            }
            this.listDiff = this.topElementHeight / this.listItemHeight;
            if (typeof this.listViewInstance.onUIScrolled === 'function') {
                this.listViewInstance.onUIScrolled();
            }
        }
        this.scrollPosition = scroll;
    };
    Virtualization.prototype.onLongScroll = function (listDiff, isScrollingDown) {
        var _this = this;
        var index = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
        Array.prototype.forEach.call(this.listViewInstance.ulElement.querySelectorAll('li'), function (element) {
            _this.updateUI(element, index);
            index++;
        });
        this.uiLastIndex = isScrollingDown ? (this.uiLastIndex + listDiff) : (this.uiLastIndex - listDiff);
        this.uiFirstIndex = isScrollingDown ? (this.uiFirstIndex + listDiff) : (this.uiFirstIndex - listDiff);
    };
    Virtualization.prototype.onNormalScroll = function (listDiff, isScrollingDown) {
        if (isScrollingDown) {
            for (var i = 0; i < listDiff; i++) {
                var index = ++this.uiLastIndex;
                this.updateUI(this.topElement.nextElementSibling, index, this.bottomElement);
                this.uiFirstIndex++;
            }
        }
        else {
            for (var i = 0; i < listDiff; i++) {
                var index = --this.uiFirstIndex;
                var target = this.topElement.nextSibling;
                this.updateUI(this.bottomElement.previousElementSibling, index, target);
                this.uiLastIndex--;
            }
        }
    };
    Virtualization.prototype.updateUiContent = function (element, index) {
        var curViewDs = this.listViewInstance.curViewDS;
        if (typeof this.listViewInstance.dataSource[0] === 'string' ||
            typeof this.listViewInstance.dataSource[0] === 'number') {
            element.dataset.uid = ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                this.listViewInstance.curViewDS[index].toString();
        }
        else {
            element.dataset.uid = curViewDs[index][this.listViewInstance.fields.id] ?
                curViewDs[index][this.listViewInstance.fields.id].toString() : ListBase.generateId();
            element.getElementsByClassName(classNames.listItemText)[0].innerHTML =
                curViewDs[index][this.listViewInstance.fields.text].toString();
        }
        if (this.listViewInstance.showIcon) {
            if (element.querySelector('.' + classNames.listIcon)) {
                detach(element.querySelector('.' + classNames.listIcon));
            }
            if (this.listViewInstance.curViewDS[index][this.listViewInstance.fields.iconCss]) {
                var textContent = element.querySelector('.' + classNames.textContent);
                var target = this.listViewInstance.createElement('div', {
                    className: classNames.listIcon + ' ' +
                        this.listViewInstance.curViewDS[index][this.listViewInstance.fields.iconCss]
                });
                textContent.insertBefore(target, element.querySelector('.' + classNames.listItemText));
            }
        }
        if (this.listViewInstance.showCheckBox && this.listViewInstance.fields.groupBy) {
            if (!this.checkListWrapper) {
                this.checkListWrapper = this.listViewInstance.curUL.querySelector('.' + classNames.checkboxWrapper).cloneNode(true);
            }
            var textContent = element.querySelector('.' + classNames.textContent);
            if (this.listViewInstance.curViewDS[index].isHeader) {
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.remove(classNames.checklist);
                    textContent.classList.remove(classNames.checkbox);
                    detach(element.querySelector('.' + classNames.checkboxWrapper));
                }
            }
            else {
                if (!element.querySelector('.' + classNames.checkboxWrapper)) {
                    element.classList.add(classNames.checklist);
                    textContent.classList.add(classNames.checkbox);
                    textContent.insertBefore(this.checkListWrapper.cloneNode(true), element.querySelector('.' + classNames.listItemText));
                }
            }
        }
    };
    Virtualization.prototype.changeElementAttributes = function (element, index) {
        element.classList.remove(classNames.disable);
        if (this.uiIndices.disabledItemIndices.length && this.uiIndices.disabledItemIndices.indexOf(index) !== -1) {
            element.classList.add(classNames.disable);
        }
        element.style.display = '';
        if (this.uiIndices.hiddenItemIndices.length && this.uiIndices.hiddenItemIndices.indexOf(index) !== -1) {
            element.style.display = 'none';
        }
        if (this.listViewInstance.showCheckBox) {
            var checklistElement = element.querySelector('.' + classNames.checkboxWrapper);
            element.classList.remove(classNames.selected);
            element.classList.remove(classNames.focused);
            if (checklistElement) {
                checklistElement.removeAttribute('aria-checked');
                checklistElement.firstElementChild.classList.remove(classNames.checked);
            }
            if (this.uiIndices.activeIndices.length && this.uiIndices.activeIndices.indexOf(index) !== -1 &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                checklistElement.firstElementChild.classList.add(classNames.checked);
                checklistElement.setAttribute('aria-checked', 'true');
                if (this.activeIndex === index) {
                    element.classList.add(classNames.focused);
                }
            }
        }
        else {
            element.classList.remove(classNames.selected);
            element.removeAttribute('aria-selected');
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex === index &&
                !this.listViewInstance.curUL.querySelector(classNames.selected)) {
                element.classList.add(classNames.selected);
                element.setAttribute('aria-selected', 'true');
            }
        }
        if (this.listViewInstance.fields.groupBy) {
            if (this.listViewInstance.curViewDS[index].isHeader) {
                if (element.classList.contains(classNames.listItem)) {
                    element.classList.remove(classNames.listItem);
                    element.setAttribute('role', 'group');
                    element.classList.add(classNames.groupListItem);
                }
            }
            else {
                if (element.classList.contains(classNames.groupListItem)) {
                    element.classList.remove(classNames.groupListItem);
                    element.setAttribute('role', 'listitem');
                    element.classList.add(classNames.listItem);
                }
            }
        }
    };
    Virtualization.prototype.findDSAndIndexFromId = function (ds, fields) {
        var _this = this;
        var resultJSON = {};
        fields = this.listViewInstance.getElementUID(fields);
        if (!isNullOrUndefined(fields)) {
            ds.some(function (data, index) {
                if ((fields[_this.listViewInstance.fields.id] &&
                    fields[_this.listViewInstance.fields.id].toString()
                        === (data[_this.listViewInstance.fields.id] && data[_this.listViewInstance.fields.id].toString())) || fields === data) {
                    resultJSON.index = index;
                    resultJSON.data = data;
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        return resultJSON;
    };
    Virtualization.prototype.getSelectedItems = function () {
        var _this = this;
        if (!isNullOrUndefined(this.activeIndex) || (this.listViewInstance.showCheckBox && this.uiIndices.activeIndices.length)) {
            var dataCollection_1 = [];
            var textCollection_1 = [];
            if (typeof this.listViewInstance.dataSource[0] === 'string' ||
                typeof this.listViewInstance.dataSource[0] === 'number') {
                var curViewDS_1 = this.listViewInstance.curViewDS;
                if (this.listViewInstance.showCheckBox) {
                    this.uiIndices.activeIndices.forEach(function (index) {
                        dataCollection_1.push(curViewDS_1[index]);
                    });
                    return {
                        text: dataCollection_1,
                        data: dataCollection_1,
                        index: this.uiIndices.activeIndices.map(function (index) {
                            return _this.listViewInstance.dataSource.indexOf(curViewDS_1[index]);
                        })
                    };
                }
                else {
                    return {
                        text: curViewDS_1[this.activeIndex],
                        data: curViewDS_1[this.activeIndex],
                        index: this.listViewInstance.dataSource.indexOf(curViewDS_1[this.activeIndex])
                    };
                }
            }
            else {
                var curViewDS_2 = this.listViewInstance.curViewDS;
                var text_1 = this.listViewInstance.fields.text;
                if (this.listViewInstance.showCheckBox) {
                    this.uiIndices.activeIndices.forEach(function (index) {
                        textCollection_1.push(curViewDS_2[index][text_1]);
                        dataCollection_1.push(curViewDS_2[index]);
                    });
                    return {
                        text: textCollection_1,
                        data: dataCollection_1,
                        index: this.uiIndices.activeIndices.map(function (index) {
                            return (_this.listViewInstance.dataSource).indexOf(curViewDS_2[index]);
                        })
                    };
                }
                else {
                    return {
                        text: curViewDS_2[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS_2[this.activeIndex],
                        index: this.listViewInstance.dataSource.indexOf(curViewDS_2[this.activeIndex])
                    };
                }
            }
        }
        else {
            return undefined;
        }
    };
    Virtualization.prototype.selectItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            var isSelected = this.activeIndex === resutJSON.index;
            var isChecked = void 0;
            this.activeIndex = resutJSON.index;
            if (this.listViewInstance.showCheckBox) {
                if (this.uiIndices.activeIndices.indexOf(resutJSON.index) === -1) {
                    isChecked = true;
                    this.uiIndices.activeIndices.push(resutJSON.index);
                }
                else {
                    isChecked = false;
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(resutJSON.index), 1);
                }
                if (this.listViewInstance.curUL.querySelector('.' + classNames.focused)) {
                    this.listViewInstance.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
                }
            }
            if (this.listViewInstance.getLiFromObjOrElement(obj)) {
                if (this.listViewInstance.showCheckBox) {
                    this.listViewInstance.setCheckboxLI(this.listViewInstance.getLiFromObjOrElement(obj));
                }
                else {
                    this.listViewInstance.setSelectLI(this.listViewInstance.getLiFromObjOrElement(obj));
                }
            }
            else {
                var eventArgs = void 0;
                if (typeof this.listViewInstance.dataSource[0] === 'string' ||
                    typeof this.listViewInstance.dataSource[0] === 'number') {
                    eventArgs = {
                        text: this.listViewInstance.curViewDS[this.activeIndex],
                        data: this.listViewInstance.curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                else {
                    var curViewDS = this.listViewInstance.curViewDS;
                    eventArgs = {
                        text: curViewDS[this.activeIndex][this.listViewInstance.fields.text],
                        data: curViewDS[this.activeIndex],
                        index: this.activeIndex
                    };
                }
                if (this.listViewInstance.showCheckBox) {
                    eventArgs.isChecked = isChecked;
                    this.listViewInstance.trigger('select', eventArgs);
                }
                else if (!isSelected) {
                    this.listViewInstance.removeSelect();
                    this.listViewInstance.trigger('select', eventArgs);
                }
            }
        }
        else if (isNullOrUndefined(obj) && !this.listViewInstance.showCheckBox) {
            this.listViewInstance.removeSelect();
            this.activeIndex = undefined;
        }
    };
    Virtualization.prototype.enableItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(resutJSON.index), 1);
        }
    };
    Virtualization.prototype.disableItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.disabledItemIndices.indexOf(resutJSON.index) === -1) {
            this.uiIndices.disabledItemIndices.push(resutJSON.index);
        }
    };
    Virtualization.prototype.showItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index), 1);
        }
    };
    Virtualization.prototype.hideItem = function (obj) {
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length && this.uiIndices.hiddenItemIndices.indexOf(resutJSON.index) === -1) {
            this.uiIndices.hiddenItemIndices.push(resutJSON.index);
        }
    };
    Virtualization.prototype.removeItem = function (obj) {
        var dataSource;
        var resutJSON = this.findDSAndIndexFromId(this.listViewInstance.curViewDS, obj);
        if (Object.keys(resutJSON).length) {
            dataSource = resutJSON.data;
            if (this.listViewInstance.curViewDS[resutJSON.index - 1] &&
                this.listViewInstance.curViewDS[resutJSON.index - 1].isHeader &&
                (this.listViewInstance.curViewDS[resutJSON.index - 1])
                    .items.length === 1) {
                this.removeUiItem(resutJSON.index - 1);
                this.removeUiItem(resutJSON.index - 1);
            }
            else {
                this.removeUiItem(resutJSON.index);
            }
        }
        var index = this.listViewInstance.dataSource.indexOf(dataSource);
        if (index !== -1) {
            this.listViewInstance.dataSource.splice(index, 1);
            this.listViewInstance.setViewDataSource(this.listViewInstance.dataSource);
        }
    };
    Virtualization.prototype.setCheckboxLI = function (li, e) {
        var index = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
        if (li.classList.contains(classNames.selected)) {
            if (this.uiIndices.activeIndices.indexOf(index) === -1) {
                this.uiIndices.activeIndices.push(index);
            }
        }
        else {
            this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
        }
    };
    Virtualization.prototype.setSelectLI = function (li, e) {
        this.activeIndex = Array.prototype.indexOf.call(this.listViewInstance.curUL.querySelectorAll('li'), li) + this.uiFirstIndex;
    };
    Virtualization.prototype.checkedItem = function (checked) {
        var _this = this;
        if (checked) {
            this.uiIndices.activeIndices = [];
            this.activeIndex = undefined;
            this.listViewInstance.curViewDS.forEach(function (ds, index) {
                if (!ds.isHeader) {
                    _this.uiIndices.activeIndices.push(index);
                }
            });
        }
        else {
            this.activeIndex = undefined;
            this.uiIndices.activeIndices = [];
        }
    };
    Virtualization.prototype.addUiItem = function (index) {
        var curViewDs = this.listViewInstance.curViewDS;
        this.changeUiIndices(index, true);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex++;
        }
        if (this.listViewInstance.showCheckBox &&
            curViewDs[index][this.listViewInstance.fields.isChecked]) {
            this.uiIndices.activeIndices.push(index);
        }
        if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
            this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
        }
        if (parseFloat(this.bottomElement.style.height)) {
            var liItem = this.listViewInstance.curUL.lastElementChild.previousSibling;
            var target = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            if (target) {
                this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) + this.listItemHeight + 'px';
                this.updateUI(liItem, index, target);
            }
        }
        else {
            var liItem = this.listViewInstance.curUL.firstElementChild.nextSibling;
            var target = void 0;
            if ((Object.keys(this.listViewInstance.curViewDS).length - 1) === index) {
                target = this.listViewInstance.curUL.lastElementChild;
            }
            else {
                target = this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 1]) ||
                    this.listViewInstance.getLiFromObjOrElement(curViewDs[index + 2]);
            }
            this.topElement.style.height = parseFloat(this.topElement.style.height) + this.listItemHeight + 'px';
            this.uiFirstIndex++;
            this.uiLastIndex++;
            if (target) {
                this.updateUI(liItem, index, target);
                this.listViewInstance.isWindow ? window.scrollTo(0, (pageYOffset + this.listItemHeight)) :
                    this.listViewInstance.element.scrollTop += this.listItemHeight;
            }
        }
        this.totalHeight += this.listItemHeight;
        this.listDiff = parseFloat(this.topElement.style.height) / this.listItemHeight;
    };
    Virtualization.prototype.removeUiItem = function (index) {
        this.totalHeight -= this.listItemHeight;
        var curViewDS = this.listViewInstance.curViewDS[index];
        var liItem = this.listViewInstance.getLiFromObjOrElement(curViewDS);
        this.listViewInstance.curViewDS.splice(index, 1);
        if (this.activeIndex && this.activeIndex >= index) {
            this.activeIndex--;
        }
        if (liItem) {
            if (this.domItemCount > Object.keys(this.listViewInstance.curViewDS).length) {
                detach(liItem);
                this.domItemCount--;
                this.uiLastIndex--;
                this.totalHeight = 0;
            }
            else {
                if (liItem.classList.contains(classNames.disable)) {
                    liItem.classList.remove(classNames.disable);
                    this.uiIndices.disabledItemIndices.splice(this.uiIndices.disabledItemIndices.indexOf(index), 1);
                }
                if (liItem.style.display === 'none') {
                    liItem.style.display = '';
                    this.uiIndices.hiddenItemIndices.splice(this.uiIndices.hiddenItemIndices.indexOf(index), 1);
                }
                if (this.listViewInstance.showCheckBox && liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.uiIndices.activeIndices.splice(this.uiIndices.activeIndices.indexOf(index), 1);
                    var checklistElement = liItem.querySelector('.' + classNames.checkboxWrapper);
                    checklistElement.removeAttribute('aria-checked');
                    checklistElement.firstElementChild.classList.remove(classNames.checked);
                    if (liItem.classList.contains(classNames.focused)) {
                        liItem.classList.remove(classNames.focused);
                        this.activeIndex = undefined;
                    }
                }
                else if (liItem.classList.contains(classNames.selected)) {
                    this.listViewInstance.removeSelect();
                    this.activeIndex = undefined;
                }
                if (!parseFloat(this.bottomElement.style.height) && !parseFloat(this.topElement.style.height)) {
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                }
                else if (parseFloat(this.bottomElement.style.height)) {
                    this.bottomElement.style.height = parseFloat(this.bottomElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, this.uiLastIndex, this.bottomElement);
                }
                else {
                    this.topElement.style.height = parseFloat(this.topElement.style.height) - this.listItemHeight + 'px';
                    this.updateUI(liItem, (this.uiFirstIndex - 1), this.topElement.nextSibling);
                    this.uiLastIndex--;
                    this.uiFirstIndex--;
                }
            }
        }
        this.changeUiIndices(index, false);
        this.listDiff = parseFloat(this.topElement.style.height) / this.listItemHeight;
    };
    Virtualization.prototype.changeUiIndices = function (index, increment) {
        var _this = this;
        Object.keys(this.uiIndices).forEach(function (key) {
            _this.uiIndices[key] = _this.uiIndices[key].map(function (i) {
                if (i >= index) {
                    return increment ? ++i : --i;
                }
                else {
                    return i;
                }
            });
        });
    };
    Virtualization.prototype.addItem = function (data, fields) {
        var _this = this;
        data.forEach(function (dataSource) {
            _this.listViewInstance.dataSource.push(dataSource);
            _this.listViewInstance.setViewDataSource(_this.listViewInstance.dataSource);
            if (!_this.domItemCount) {
                _this.uiVirtualization();
            }
            else if (_this.domItemCount < _this.expectedDomItemCount) {
                _this.wireScrollEvent(true);
                detach(_this.listViewInstance.contentContainer);
                _this.uiVirtualization();
            }
            else {
                var index = _this.listViewInstance.curViewDS.indexOf(dataSource);
                _this.addUiItem(index);
                var curViewDS = _this.listViewInstance.curViewDS[index - 1];
                if (curViewDS && curViewDS.isHeader && curViewDS.items.length === 1) {
                    _this.addUiItem(index - 1);
                }
            }
        });
    };
    Virtualization.prototype.createUIItem = function (args) {
        var template = this.listViewInstance.createElement('div');
        var commonTemplate = '<div class="e-text-content" role="presentation"> ' +
            '<span class="e-list-text"> ${' + this.listViewInstance.fields.text + '} </span></div>';
        template.innerHTML = this.listViewInstance.template || commonTemplate;
        var templateElements = template.getElementsByTagName('*');
        var groupTemplate = this.listViewInstance.createElement('div');
        if (this.listViewInstance.fields.groupBy) {
            groupTemplate.innerHTML = this.listViewInstance.groupTemplate || commonTemplate;
        }
        var groupTemplateElements = groupTemplate.getElementsByTagName('*');
        if (args.curData.isHeader) {
            this.headerData = args.curData;
        }
        this.templateData = args.curData.isHeader ? args.curData.items[0] :
            args.curData;
        args.item.innerHTML = '';
        args.item.context = { data: args.curData, nodes: { flatTemplateNodes: [], groupTemplateNodes: [] } };
        for (var i = 0; i < templateElements.length; i++) {
            this.compileTemplate(templateElements[i], args.item, false);
        }
        for (var i = 0; i < groupTemplateElements.length; i++) {
            this.compileTemplate(groupTemplateElements[i], args.item, true);
        }
        args.item.context.template = args.curData.isHeader ? template.firstElementChild :
            groupTemplate.firstElementChild;
        args.item.context.type = args.curData.isHeader ? 'flatList' : 'groupList';
        var element = args.curData.isHeader ? groupTemplate : template;
        args.item.insertBefore(element.firstElementChild, null);
    };
    Virtualization.prototype.compileTemplate = function (element, item, isHeader) {
        this.textProperty(element, item, isHeader);
        this.classProperty(element, item, isHeader);
        this.attributeProperty(element, item, isHeader);
    };
    Virtualization.prototype.onChange = function (newData, listElement) {
        listElement.context.data = newData;
        var groupTemplateNodes = listElement.context.nodes.groupTemplateNodes;
        var flatTemplateNodes = listElement.context.nodes.flatTemplateNodes;
        if (!isNullOrUndefined(newData.isHeader) && newData.isHeader && listElement.context.type === 'groupList') {
            var element = listElement.firstElementChild;
            detach(listElement.firstElementChild);
            listElement.insertBefore(listElement.context.template, null);
            listElement.context.template = element;
            listElement.context.type = 'flatList';
            groupTemplateNodes.forEach(function (node) { return node.onChange(newData); });
        }
        else if (!newData.isHeader && listElement.context.type === 'flatList') {
            var element = listElement.firstElementChild;
            detach(listElement.firstElementChild);
            listElement.insertBefore(listElement.context.template, null);
            listElement.context.template = element;
            listElement.context.type = 'groupList';
            flatTemplateNodes.forEach(function (node) { return node.onChange(newData); });
        }
        else if (!newData.isHeader) {
            flatTemplateNodes.forEach(function (node) { return node.onChange(newData); });
        }
        else {
            groupTemplateNodes.forEach(function (node) { return node.onChange(newData); });
        }
    };
    Virtualization.prototype.updateContextData = function (listElement, node, isHeader) {
        if (isHeader) {
            listElement.context.nodes.groupTemplateNodes.push(node);
        }
        else {
            listElement.context.nodes.flatTemplateNodes.push(node);
        }
    };
    Virtualization.prototype.classProperty = function (element, listElement, isHeader) {
        var _this = this;
        var regex = new RegExp('\\${([^}]*)}', 'g');
        var resultantOutput = [];
        var regexMatch;
        while (regexMatch !== null) {
            var match = regex.exec(element.className);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        if (resultantOutput && resultantOutput.length) {
            resultantOutput.forEach(function (classNameMatch) {
                var classFunction;
                if (classNameMatch[1].indexOf('?') !== -1 && classNameMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + classNameMatch[1].replace(/\$/g, 'data.'));
                }
                else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    classFunction = new Function('data', 'return ' + 'data.' + classNameMatch[1]);
                }
                var subNode = {};
                if (isHeader) {
                    subNode.bindedvalue = classFunction(_this.headerData);
                }
                else {
                    subNode.bindedvalue = classFunction(_this.templateData);
                }
                subNode.onChange = function (value) {
                    if (subNode.bindedvalue) {
                        removeClass([element], subNode.bindedvalue.split(' ').filter(function (css) { return css; }));
                    }
                    var newCss = classFunction(value);
                    if (newCss) {
                        addClass([element], (newCss).split(' ').filter(function (css) { return css; }));
                    }
                    subNode.bindedvalue = newCss;
                };
                classNameMatch[0].split(' ').forEach(function (className) {
                    element.classList.remove(className);
                });
                if (subNode.bindedvalue) {
                    addClass([element], subNode.bindedvalue.split(' ').filter(function (css) { return css; }));
                }
                _this.updateContextData(listElement, subNode, isHeader);
            });
        }
    };
    Virtualization.prototype.attributeProperty = function (element, listElement, isHeader) {
        var _this = this;
        var attributeNames = [];
        for (var i = 0; i < element.attributes.length; i++) {
            attributeNames.push(element.attributes[i].nodeName);
        }
        if (attributeNames.indexOf('class') !== -1) {
            attributeNames.splice(attributeNames.indexOf('class'), 1);
        }
        attributeNames.forEach(function (attributeName) {
            var attrNameMatch = new RegExp('\\${([^}]*)}', 'g').exec(attributeName) || [];
            var attrValueMatch = new RegExp('\\${([^}]*)}', 'g').exec(element.getAttribute(attributeName))
                || [];
            var attributeNameFunction;
            var attributeValueFunction;
            if (attrNameMatch.length || attrValueMatch.length) {
                if (attrNameMatch[1]) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    attributeNameFunction = new Function('data', 'return ' + 'data.' + attrNameMatch[1]);
                }
                if (attrValueMatch[1]) {
                    if (attrValueMatch[1].indexOf('?') !== -1 && attrValueMatch[1].indexOf(':') !== -1) {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + attrValueMatch[1].replace(/\$/g, 'data.'));
                    }
                    else {
                        // tslint:disable-next-line:no-function-constructor-with-string-args
                        attributeValueFunction = new Function('data', 'return ' + 'data.' + attrValueMatch[1]);
                    }
                }
                var subNode_1 = {};
                if (isHeader) {
                    subNode_1.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(_this.headerData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(_this.headerData)];
                }
                else {
                    subNode_1.bindedvalue = [attrNameMatch[1] === undefined ? undefined : attributeNameFunction(_this.templateData),
                        attrValueMatch[1] === undefined ? undefined : attributeValueFunction(_this.templateData)];
                }
                subNode_1.attrName = subNode_1.bindedvalue[0] === undefined ?
                    attributeName : subNode_1.bindedvalue[0];
                subNode_1.onChange = function (value) {
                    var bindedvalue = subNode_1.bindedvalue[1] === undefined ?
                        element.getAttribute(subNode_1.attrName) : attributeValueFunction(value);
                    element.removeAttribute(subNode_1.attrName);
                    subNode_1.attrName = subNode_1.bindedvalue[0] === undefined ? subNode_1.attrName : attributeNameFunction(value);
                    element.setAttribute(subNode_1.attrName, bindedvalue);
                    subNode_1.bindedvalue = [subNode_1.bindedvalue[0] === undefined ? undefined : attributeNameFunction(value),
                        subNode_1.bindedvalue[1] === undefined ? undefined : attributeValueFunction(value)];
                };
                var attributeValue = subNode_1.bindedvalue[1] === undefined ? element.getAttribute(attributeName) :
                    subNode_1.bindedvalue[1];
                element.removeAttribute(attributeName);
                element.setAttribute(subNode_1.attrName, attributeValue);
                _this.updateContextData(listElement, subNode_1, isHeader);
            }
        });
    };
    Virtualization.prototype.textProperty = function (element, listElement, isHeader) {
        var _this = this;
        var regex = new RegExp('\\${([^}]*)}', 'g');
        var resultantOutput = [];
        var regexMatch;
        while (regexMatch !== null) {
            var match = regex.exec(element.innerText);
            resultantOutput.push(match);
            regexMatch = match;
            if (regexMatch === null) {
                resultantOutput.pop();
            }
        }
        var isChildHasTextContent = Array.prototype.some.call(element.children, function (element) {
            if (new RegExp('\\${([^}]*)}', 'g').exec(element.innerText)) {
                return true;
            }
            else {
                return false;
            }
        });
        if (resultantOutput && resultantOutput.length && !isChildHasTextContent) {
            resultantOutput.forEach(function (textPropertyMatch) {
                var subNode = {};
                var textFunction;
                if (textPropertyMatch[1].indexOf('?') !== -1 && textPropertyMatch[1].indexOf(':') !== -1) {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + textPropertyMatch[1].replace(/\$/g, 'data.'));
                }
                else {
                    // tslint:disable-next-line:no-function-constructor-with-string-args
                    textFunction = new Function('data', 'return ' + 'data.' + textPropertyMatch[1]);
                }
                if (isHeader) {
                    subNode.bindedvalue = textFunction(_this.headerData);
                }
                else {
                    subNode.bindedvalue = textFunction(_this.templateData);
                }
                subNode.onChange = function (value) {
                    element.innerText = element.innerText.replace(subNode.bindedvalue, textFunction(value));
                    subNode.bindedvalue = textFunction(value);
                };
                element.innerText = element.innerText.replace(textPropertyMatch[0], subNode.bindedvalue);
                _this.updateContextData(listElement, subNode, isHeader);
            });
        }
    };
    Virtualization.prototype.reRenderUiVirtualization = function () {
        this.wireScrollEvent(true);
        if (this.listViewInstance.contentContainer) {
            detach(this.listViewInstance.contentContainer);
        }
        this.listViewInstance.preRender();
        this.listViewInstance.localData = this.listViewInstance.dataSource;
        this.listViewInstance.renderList();
    };
    Virtualization.prototype.updateUI = function (element, index, targetElement) {
        var onChange = this.isNgTemplate() ? this.onNgChange : this.onChange;
        if (this.listViewInstance.template || this.listViewInstance.groupTemplate) {
            var curViewDS = this.listViewInstance.curViewDS[index];
            element.dataset.uid = curViewDS[this.listViewInstance.fields.id] ?
                curViewDS[this.listViewInstance.fields.id].toString() : ListBase.generateId();
            onChange(curViewDS, element);
        }
        else {
            this.updateUiContent(element, index);
        }
        this.changeElementAttributes(element, index);
        if (targetElement) {
            this.listViewInstance.ulElement.insertBefore(element, targetElement);
        }
    };
    Virtualization.prototype.onNgChange = function (newData, listElement) {
        listElement.context.$implicit = newData;
    };
    Virtualization.prototype.getModuleName = function () {
        return 'virtualization';
    };
    Virtualization.prototype.destroy = function () {
        this.wireScrollEvent(true);
    };
    return Virtualization;
}());

/**
 * Listview Component
 */

/**
 * Listview Component
 */

/**
 * List Components
 */

export { classNames, FieldSettings, ListView, Virtualization, cssClass, ListBase, getFieldValues };
//# sourceMappingURL=ej2-lists.es5.js.map
