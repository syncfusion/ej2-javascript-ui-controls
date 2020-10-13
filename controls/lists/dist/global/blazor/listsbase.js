window.sf = window.sf || {};
var listsbase = (function (exports) {
'use strict';

exports.cssClass = {
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
    iconWrapper: 'e-icon-wrapper',
    anchorWrap: 'e-anchor-wrap',
    navigable: 'e-navigable'
};
/**
 * Base List Generator
 */

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
        enableHtmlSanitizer: false,
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
        expandIconPosition: 'Right',
        itemNavigable: false
    };
    /**
     * Function helps to created and return the UL Li element based on your data.
     * @param  {{[key:string]:Object}[]|string[]} dataSource - Specifies an array of JSON or String data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    function createList(createElement, dataSource, 
    // tslint:disable-next-line
    options, isSingleLevel, componentInstance) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var ariaAttributes = sf.base.extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var type = typeofData(dataSource).typeof;
        if (type === 'string' || type === 'number') {
            return createListFromArray(createElement, dataSource, isSingleLevel, options, componentInstance);
        }
        else {
            // tslint:disable-next-line
            return createListFromJson(createElement, dataSource, options, 
            // tslint:disable-next-line
            ariaAttributes.level, isSingleLevel, componentInstance);
        }
    }
    ListBase.createList = createList;
    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    function createListFromArray(createElement, dataSource, 
    // tslint:disable-next-line
    isSingleLevel, options, componentInstance) {
        var subChild = createListItemFromArray(createElement, dataSource, isSingleLevel, options, componentInstance);
        return generateUL(createElement, subChild, null, options);
    }
    ListBase.createListFromArray = createListFromArray;
    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    function createListItemFromArray(createElement, dataSource, 
    // tslint:disable-next-line
    isSingleLevel, options, componentInstance) {
        var subChild = [];
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        exports.cssClass = getModuleClass(curOpt.moduleName);
        var id = generateId(); // generate id for drop-down-list option.
        for (var i = 0; i < dataSource.length; i++) {
            if (sf.base.isNullOrUndefined(dataSource[i])) {
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
                li = generateLI(createElement, dataSource[i], undefined, null, null, options, componentInstance);
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
    // tslint:disable-next-line
    function createListItemFromJson(createElement, dataSource, 
    // tslint:disable-next-line
    options, level, isSingleLevel, componentInstance) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        exports.cssClass = getModuleClass(curOpt.moduleName);
        var fields = sf.base.extend({}, ListBase.defaultMappedFields, curOpt.fields);
        var ariaAttributes = sf.base.extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var id;
        var checkboxElement = [];
        if (level) {
            ariaAttributes.level = level;
        }
        var child = [];
        var li;
        var anchorElement;
        if (dataSource && dataSource.length && !sf.base.isNullOrUndefined(typeofData(dataSource).item) &&
            !typeofData(dataSource).item.hasOwnProperty(fields.id)) {
            id = generateId(); // generate id for drop-down-list option.
        }
        for (var i = 0; i < dataSource.length; i++) {
            var fieldData = getFieldValues(dataSource[i], fields);
            if (sf.base.isNullOrUndefined(dataSource[i])) {
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
            if (fieldData.hasOwnProperty(fields.id) && !sf.base.isNullOrUndefined(fieldData[fields.id])) {
                id = fieldData[fields.id];
            }
            var innerEle = [];
            if (curOpt.showCheckBox) {
                if (curOpt.itemNavigable && (fieldData[fields.url] || fieldData[fields.urlAttributes])) {
                    checkboxElement.push(createElement('input', { className: exports.cssClass.check, attrs: { type: 'checkbox' } }));
                }
                else {
                    innerEle.push(createElement('input', { className: exports.cssClass.check, attrs: { type: 'checkbox' } }));
                }
            }
            if (isSingleLevel === true) {
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) && !sf.base.isNullOrUndefined(fieldData[fields.iconCss])) {
                    innerEle.push(createElement('span', { className: exports.cssClass.icon + ' ' + fieldData[fields.iconCss] }));
                }
                li = generateSingleLevelLI(createElement, curItem, fieldData, fields, curOpt.itemClass, innerEle, (curItem.hasOwnProperty('isHeader') &&
                    curItem.isHeader) ? true : false, id, i, options);
                anchorElement = li.querySelector('.' + exports.cssClass.anchorWrap);
                if (curOpt.itemNavigable && checkboxElement.length) {
                    sf.base.prepend(checkboxElement, li.firstElementChild);
                }
            }
            else {
                li = generateLI(createElement, curItem, fieldData, fields, curOpt.itemClass, options, componentInstance);
                li.classList.add(exports.cssClass.level + '-' + ariaAttributes.level);
                li.setAttribute('aria-level', ariaAttributes.level.toString());
                anchorElement = li.querySelector('.' + exports.cssClass.anchorWrap);
                if (fieldData.hasOwnProperty(fields.tooltip)) {
                    li.setAttribute('title', fieldData[fields.tooltip]);
                }
                if (fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                    setAttribute(li, fieldData[fields.htmlAttributes]);
                }
                if (fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled] === false) {
                    li.classList.add(exports.cssClass.disabled);
                }
                if (fieldData.hasOwnProperty(fields.isVisible) && fieldData[fields.isVisible] === false) {
                    li.style.display = 'none';
                }
                if (fieldData.hasOwnProperty(fields.imageUrl) && !sf.base.isNullOrUndefined(fieldData[fields.imageUrl])
                    && !curOpt.template) {
                    var attr = { src: fieldData[fields.imageUrl] };
                    sf.base.merge(attr, fieldData[fields.imageAttributes]);
                    var imageElemnt = createElement('img', { className: exports.cssClass.image, attrs: attr });
                    if (anchorElement) {
                        anchorElement.insertAdjacentElement('afterbegin', imageElemnt);
                    }
                    else {
                        sf.base.prepend([imageElemnt], li.firstElementChild);
                    }
                }
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) &&
                    !sf.base.isNullOrUndefined(fieldData[fields.iconCss]) && !curOpt.template) {
                    var iconElement = void 0;
                    iconElement = createElement('div', { className: exports.cssClass.icon + ' ' + fieldData[fields.iconCss] });
                    if (anchorElement) {
                        anchorElement.insertAdjacentElement('afterbegin', iconElement);
                    }
                    else {
                        sf.base.prepend([iconElement], li.firstElementChild);
                    }
                }
                if (innerEle.length) {
                    sf.base.prepend(innerEle, li.firstElementChild);
                }
                if (curOpt.itemNavigable && checkboxElement.length) {
                    sf.base.prepend(checkboxElement, li.firstElementChild);
                }
                processSubChild(createElement, fieldData, fields, dataSource, curOpt, li, ariaAttributes.level);
            }
            if (anchorElement) {
                sf.base.addClass([li], [exports.cssClass.navigable]);
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
            checkboxElement = [];
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
    function createListFromJson(createElement, dataSource, 
    // tslint:disable-next-line
    options, level, isSingleLevel, componentInstance) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var li = createListItemFromJson(createElement, dataSource, options, level, isSingleLevel, componentInstance);
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
        exports.cssClass = getModuleClass(defaultListBaseOptions.moduleName);
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
        while (siblingLI && (!sf.base.isVisible(siblingLI) || siblingLI.classList.contains(exports.cssClass.disabled))) {
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
        var curFields = sf.base.extend({}, ListBase.defaultMappedFields, fields);
        var cusQuery = new sf.data.Query().group(curFields.groupBy);
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
            var newtext = curFields.text;
            if (newtext === 'id') {
                newtext = 'text';
                grpItem[newtext] = ds[j].key;
            }
            grpItem._id = 'group-list-item-' + (ds[j].key ?
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
        if (query === void 0) { query = new sf.data.Query(); }
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
        return new sf.data.DataManager(dataSource)
            .executeLocal(query);
    }
    ListBase.getDataSource = getDataSource;
    /**
     * Created JSON data based the UL and LI element
     * @param  {HTMLElement|Element} element - UL element that need to convert as a JSON
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    function createJsonFromElement(element, options) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var fields = sf.base.extend({}, ListBase.defaultMappedFields, curOpt.fields);
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
            if (!sf.base.isNullOrUndefined(data[i])) {
                return match = { typeof: typeof data[i], item: data[i] };
            }
        }
        return match;
    }
    function setAttribute(element, elementAttributes) {
        var attr = {};
        sf.base.merge(attr, elementAttributes);
        if (attr.class) {
            sf.base.addClass([element], attr.class.split(' '));
            delete attr.class;
        }
        sf.base.attributes(element, attr);
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
    function renderContentTemplate(createElement, template, dataSource, 
    // tslint:disable-next-line
    fields, options, componentInstance) {
        exports.cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        var ulElement = createElement('ul', { className: exports.cssClass.ul, attrs: { role: 'presentation' } });
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var curFields = sf.base.extend({}, ListBase.defaultMappedFields, fields);
        var compiledString = sf.base.compile(template);
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
                className: isHeader ? exports.cssClass.group : exports.cssClass.li, attrs: { role: 'presentation' }
            });
            if (isHeader) {
                li.innerText = fieldData[curFields.text];
            }
            else {
                var currentID = isHeader ? curOpt.groupTemplateID : curOpt.templateID;
                if (isHeader) {
                    // tslint:disable-next-line
                    var compiledElement = compiledString(curItem, componentInstance, 'headerTemplate', currentID, !!curOpt.isStringTemplate, null, li);
                    if (compiledElement) {
                        sf.base.append(compiledElement, li);
                    }
                }
                else {
                    // tslint:disable-next-line
                    var compiledElement = compiledString(curItem, componentInstance, 'template', currentID, !!curOpt.isStringTemplate, null, li);
                    if (compiledElement) {
                        sf.base.append(compiledElement, li);
                    }
                }
                li.setAttribute('data-value', sf.base.isNullOrUndefined(value) ? 'null' : value);
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
        sf.base.append(liCollection, ulElement);
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
    // tslint:disable-next-line
    function renderGroupTemplate(groupTemplate, groupDataSource, fields, 
    // tslint:disable-next-line
    headerItems, options, componentInstance) {
        var compiledString = sf.base.compile(groupTemplate);
        var curFields = sf.base.extend({}, ListBase.defaultMappedFields, fields);
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var category = curFields.groupBy;
        for (var _i = 0, headerItems_1 = headerItems; _i < headerItems_1.length; _i++) {
            var header = headerItems_1[_i];
            var headerData = {};
            headerData[category] = header.textContent;
            header.innerHTML = '';
            // tslint:disable-next-line
            var compiledElement = compiledString(headerData, componentInstance, 'groupTemplate', curOpt.groupTemplateID, !!curOpt.isStringTemplate, null, header);
            if (compiledElement) {
                sf.base.append(compiledElement, header);
            }
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
    function processSubChild(createElement, fieldData, fields, ds, 
    // tslint:disable-next-line
    options, element, level) {
        // Get SubList
        var subDS = fieldData[fields.child] || [];
        var hasChildren = fieldData[fields.hasChildren];
        //Create Sub child
        if (subDS.length) {
            hasChildren = true;
            element.classList.add(exports.cssClass.hasChild);
            if (options.processSubChild) {
                var subLi = createListFromJson(createElement, subDS, options, ++level);
                element.appendChild(subLi);
            }
        }
        // Create expand and collapse node
        if (!!options.expandCollapse && hasChildren && !options.template) {
            element.firstElementChild.classList.add(exports.cssClass.iconWrapper);
            var expandElement = options.expandIconPosition === 'Left' ? sf.base.prepend : sf.base.append;
            expandElement([createElement('div', { className: 'e-icons ' + options.expandIconClass })], element.querySelector('.' + exports.cssClass.textContent));
        }
    }
    function generateSingleLevelLI(createElement, item, fieldData, fields, className, innerElements, grpLI, id, index, options) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var ariaAttributes = sf.base.extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
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
        if (!sf.base.isNullOrUndefined(dataSource) && !sf.base.isNullOrUndefined(fieldData[fields.id])
            && fieldData[fields.id] !== '') {
            elementID = id;
        }
        else {
            elementID = id + '-' + index;
        }
        var li = createElement('li', {
            className: (grpLI === true ? exports.cssClass.group : exports.cssClass.li) + ' ' + (sf.base.isNullOrUndefined(className) ? '' : className),
            id: elementID, attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        if (dataSource && fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled].toString() === 'false') {
            li.classList.add(exports.cssClass.disabled);
        }
        if (grpLI) {
            li.innerText = text;
        }
        else {
            li.setAttribute('data-value', sf.base.isNullOrUndefined(value) ? 'null' : value);
            li.setAttribute('role', 'option');
            if (dataSource && fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                setAttribute(li, fieldData[fields.htmlAttributes]);
            }
            if (innerElements.length && !curOpt.itemNavigable) {
                sf.base.append(innerElements, li);
            }
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                fieldData[fields.urlAttributes].href))) {
                li.appendChild(anchorTag(createElement, dataSource, fields, text, innerElements, curOpt.itemNavigable));
            }
            else {
                if (innerElements.length && curOpt.itemNavigable) {
                    sf.base.append(innerElements, li);
                }
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
            iconWrapper: 'e-icon-wrapper',
            anchorWrap: 'e-anchor-wrap',
            navigable: 'e-navigable',
        };
    }
    function anchorTag(createElement, dataSource, fields, text, innerElements, isFullNavigation) {
        var fieldData = getFieldValues(dataSource, fields);
        var attr = { href: fieldData[fields.url] };
        if (fieldData.hasOwnProperty(fields.urlAttributes) && fieldData[fields.urlAttributes]) {
            sf.base.merge(attr, fieldData[fields.urlAttributes]);
            attr.href = fieldData[fields.url] ? fieldData[fields.url] :
                fieldData[fields.urlAttributes].href;
        }
        var anchorTag;
        if (!isFullNavigation) {
            anchorTag = createElement('a', { className: exports.cssClass.text + ' ' + exports.cssClass.url, innerHTML: text });
        }
        else {
            anchorTag = createElement('a', { className: exports.cssClass.text + ' ' + exports.cssClass.url });
            var anchorWrapper = createElement('div', { className: exports.cssClass.anchorWrap });
            if (innerElements && innerElements.length) {
                sf.base.append(innerElements, anchorWrapper);
            }
            anchorWrapper.appendChild(document.createTextNode(text));
            sf.base.append([anchorWrapper], anchorTag);
        }
        setAttribute(anchorTag, attr);
        return anchorTag;
    }
    // tslint:disable-next-line
    /* tslint:disable:align */
    function generateLI(createElement, item, fieldData, 
    // tslint:disable-next-line
    fields, className, options, componentInstance) {
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var ariaAttributes = sf.base.extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        var text = item;
        var uID;
        var grpLI;
        var dataSource;
        if (typeof item !== 'string' && typeof item !== 'number') {
            dataSource = item;
            text = fieldData[fields.text] || '';
            // tslint:disable-next-line
            uID = (sf.base.isNullOrUndefined(fieldData['_id'])) ? fieldData[fields.id] : fieldData['_id'];
            grpLI = (item.hasOwnProperty('isHeader') && item.isHeader)
                ? true : false;
        }
        if (options && options.enableHtmlSanitizer) {
            text = text;
        }
        var li = createElement('li', {
            className: (grpLI === true ? exports.cssClass.group : exports.cssClass.li) + ' ' + (sf.base.isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        !sf.base.isNullOrUndefined(uID) ? li.setAttribute('data-uid', uID) : li.setAttribute('data-uid', generateId());
        var blazId = 'BlazId';
        if (options && !!options.removeBlazorID
            && typeof item === 'object'
            && item.hasOwnProperty(blazId)) {
            delete item[blazId];
        }
        if (grpLI && options && options.groupTemplate) {
            var compiledString = sf.base.compile(options.groupTemplate);
            // tslint:disable-next-line
            var compiledElement = compiledString(item, componentInstance, 'groupTemplate', curOpt.groupTemplateID, !!curOpt.isStringTemplate, null, li);
            if (compiledElement) {
                sf.base.append(compiledElement, li);
            }
        }
        else if (!grpLI && options && options.template) {
            var compiledString = sf.base.compile(options.template);
            // tslint:disable-next-line
            var compiledElement = compiledString(item, componentInstance, 'template', curOpt.templateID, !!curOpt.isStringTemplate, null, li);
            if (compiledElement) {
                sf.base.append(compiledElement, li);
            }
        }
        else {
            var innerDiv = createElement('div', {
                className: exports.cssClass.textContent,
                attrs: (ariaAttributes.wrapperRole !== '' ? { role: ariaAttributes.wrapperRole } : {})
            });
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                fieldData[fields.urlAttributes].href))) {
                innerDiv.appendChild(anchorTag(createElement, dataSource, fields, text, null, curOpt.itemNavigable));
            }
            else {
                var element = createElement('span', {
                    className: exports.cssClass.text,
                    attrs: (ariaAttributes.itemText !== '' ? { role: ariaAttributes.itemText } : {})
                });
                if (options && options.enableHtmlSanitizer) {
                    element.innerText = text;
                }
                else {
                    element.innerHTML = text;
                }
                innerDiv.appendChild(element);
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
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        var ariaAttributes = sf.base.extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        exports.cssClass = getModuleClass(curOpt.moduleName);
        var ulElement = createElement('ul', {
            className: exports.cssClass.ul + ' ' + (sf.base.isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.listRole !== '' ? { role: ariaAttributes.listRole } : {})
        });
        sf.base.append(liElement, ulElement);
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
        var curOpt = sf.base.extend({}, defaultListBaseOptions, options);
        exports.cssClass = getModuleClass(curOpt.moduleName);
        var expandElement = curOpt.expandIconPosition === 'Left' ? sf.base.prepend : sf.base.append;
        expandElement([createElement('div', {
                className: 'e-icons ' + curOpt.expandIconClass + ' ' +
                    (sf.base.isNullOrUndefined(className) ? '' : className)
            })], liElement.querySelector('.' + exports.cssClass.textContent));
        return liElement;
    }
    ListBase.generateIcon = generateIcon;
})(exports.ListBase || (exports.ListBase = {}));
/**
 * Used to get dataSource item from complex data using fields.
 * @param {{[key:string]:Object}|string[]|string} dataSource - Specifies an  JSON or String data.
 * @param {FieldsMapping} fields - Fields that are mapped from the dataSource.
 */
function getFieldValues(dataItem, fields) {
    var fieldData = {};
    if (sf.base.isNullOrUndefined(dataItem) || typeof (dataItem) === 'string' || typeof (dataItem) === 'number'
        || !sf.base.isNullOrUndefined(dataItem.isHeader)) {
        return dataItem;
    }
    else {
        for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
            var field = _a[_i];
            var dataField = fields[field];
            var value = !sf.base.isNullOrUndefined(dataField) &&
                typeof (dataField) === 'string' ? sf.base.getValue(dataField, dataItem) : undefined;
            if (!sf.base.isNullOrUndefined(value)) {
                fieldData[dataField] = value;
            }
        }
    }
    return fieldData;
}

/**
 * Listview Component
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
            if ((_this.isValidTarget(target, newInst) || e.target.className.indexOf('e-list-group-item') > -1) && _this.curTarget !== target &&
                (newInst.placeHolderElement ? newInst.placeHolderElement !== e.target : true)) {
                if (e.target.className.indexOf('e-list-group-item') > -1) {
                    target = e.target;
                }
                _this.curTarget = target;
                var oldIdx = _this.getIndex(newInst.placeHolderElement, newInst);
                oldIdx = sf.base.isNullOrUndefined(oldIdx) ? _this.getIndex(_this.target) :
                    _this.getIndex(target, newInst) < oldIdx || !oldIdx ? oldIdx : oldIdx - 1;
                newInst.placeHolderElement = _this.getPlaceHolder(target, newInst);
                var newIdx = _this.getIndex(target, newInst);
                var idx = newInst.element !== _this.element ? newIdx : oldIdx < newIdx ? newIdx + 1 : newIdx;
                if (newInst.placeHolderElement) {
                    if (e.target.className.indexOf('e-list-group-item') > -1) {
                        newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[newIdx]);
                    }
                    else if (newInst.element !== _this.element && idx === newInst.element.childElementCount - 1) {
                        newInst.element.appendChild(newInst.placeHolderElement);
                    }
                    else {
                        newInst.element.insertBefore(newInst.placeHolderElement, newInst.element.children[idx]);
                    }
                    _this.refreshDisabled(oldIdx, newIdx, newInst);
                }
                else {
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
            if (_this.isPlaceHolderPresent(dropInst)) {
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
            if (dropInst.element === e.target) {
                var beforeDropArgs = { previousIndex: prevIdx, currentIndex: curIdx, target: e.target,
                    droppedElement: _this.target, helper: e.helper, cancel: false };
                _this.trigger('beforeDrop', beforeDropArgs, function (observedArgs) {
                    if (!observedArgs.cancel) {
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
            if (this.isPlaceHolderPresent(instance)) {
                sf.base.remove(instance.placeHolderElement);
            }
            instance.placeHolderElement = instance.placeHolder({ element: instance.element, grabbedElement: this.target, target: target });
            instance.placeHolderElement.classList.add('e-sortable-placeholder');
            return instance.placeHolderElement;
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
    Sortable.prototype.getIndex = function (target, instance) {
        if (instance === void 0) { instance = this; }
        var idx;
        [].slice.call(instance.element.children).forEach(function (element, index) {
            if (element === target) {
                idx = index;
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

exports.getFieldValues = getFieldValues;
exports.Sortable = Sortable;
exports.moveTo = moveTo;

return exports;

});
window.sf.lists = window.sf.base.extend({}, window.sf.lists, listsbase({}));
