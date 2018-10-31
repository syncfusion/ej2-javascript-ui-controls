import { extend, merge, isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { attributes, prepend, isVisible, append, addClass } from '@syncfusion/ej2-base';
import { compile } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';

export let cssClass: ClassList = {
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

export interface ClassList {
    li: string;
    ul: string;
    group: string;
    icon: string;
    text: string;
    check: string;
    checked: string;
    selected: string;
    expanded: string;
    textContent: string;
    hasChild: string;
    level: string;
    url: string;
    collapsible: string;
    disabled: string;
    image: string;
    iconWrapper: string;
}


/**
 * Sorting Order
 */
export type SortOrder = 'None' | 'Ascending' | 'Descending';

/**
 * Base List Generator
 */
export namespace ListBase {

    /**
     * Default mapped fields.
     */
    export let defaultMappedFields: FieldsMapping = {
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

    let defaultAriaAttributes: AriaAttributesMapping = {
        level: 1,
        listRole: 'presentation',
        itemRole: 'presentation',
        groupItemRole: 'group',
        itemText: 'list-item',
        wrapperRole: 'presentation'
    };

    let defaultListBaseOptions: ListBaseOptions = {
        showCheckBox: false,
        showIcon: false,
        expandCollapse: false,
        fields: defaultMappedFields,
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
    export function createList(
        createElement: createElementParams, dataSource: { [key: string]: Object }[] | string[] | number[],
        options?: ListBaseOptions, isSingleLevel?: boolean):
        HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let type: string = typeofData(dataSource).typeof as string;
        if (type === 'string' || type === 'number') {
            return createListFromArray(createElement, <string[] | number[]>dataSource, isSingleLevel, options);
        } else {
            return createListFromJson(createElement, <{ [key: string]: Object }[]>dataSource, options, ariaAttributes.level, isSingleLevel);
        }
    }

    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    export function createListFromArray(
        createElement: createElementParams, dataSource: string[] | number[],
        isSingleLevel?: boolean, options?: ListBaseOptions): HTMLElement {
        let subChild: HTMLElement[] = createListItemFromArray(createElement, dataSource, isSingleLevel, options);
        return generateUL(createElement, subChild, null, options);
    }

    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    export function createListItemFromArray(
        createElement: createElementParams, dataSource: string[] | number[],
        isSingleLevel?: boolean, options?: ListBaseOptions): HTMLElement[] {
        let subChild: HTMLElement[] = [];
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        let id: string = generateId(); // generate id for drop-down-list option.
        for (let i: number = 0; i < dataSource.length; i++) {
            if (isNullOrUndefined(dataSource[i])) {
                continue;
            }
            let li: HTMLElement;
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                let curData: object = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: dataSource[i],
                    options: curOpt
                };
                curOpt.itemCreating(curData);
            }

            if (isSingleLevel) {
                li = generateSingleLevelLI(createElement, dataSource[i], undefined, null, null, [], null, id, i, options);
            } else {
                li = generateLI(createElement, dataSource[i], undefined, null, null, options);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                let curData: Object = {
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

    /**
     * Function helps to created an element list based on array of JSON input .
     * @param  {{[key:string]:Object}[]} dataSource - Specifies an array of JSON data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    // tslint:disable-next-line:max-func-body-length
    export function createListItemFromJson(
        createElement: createElementParams, dataSource: { [key: string]: Object }[],
        options?: ListBaseOptions, level?: number, isSingleLevel?: boolean): HTMLElement[] {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        let fields: FieldsMapping = extend({}, defaultMappedFields, curOpt.fields);
        let ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let id: string;
        if (level) {
            ariaAttributes.level = level;
        }
        let child: HTMLElement[] = [];
        let li: HTMLElement;
        if (dataSource && dataSource.length && !isNullOrUndefined(typeofData(dataSource).item) &&
            !typeofData(dataSource).item.hasOwnProperty(fields.id)) {
            id = generateId(); // generate id for drop-down-list option.
        }
        for (let i: number = 0; i < dataSource.length; i++) {
            let fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource[i], fields);
            if (isNullOrUndefined(dataSource[i])) { continue; }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                let curData: { [key: string]: object | string } = {
                    dataSource: dataSource,
                    curData: dataSource[i],
                    text: fieldData[fields.text],
                    options: curOpt,
                    fields: fields
                };
                curOpt.itemCreating(curData);
            }
            let curItem: { [key: string]: Object } = dataSource[i];
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = <{ [key: string]: Object }>getFieldValues(dataSource[i], fields);
            }
            if (fieldData.hasOwnProperty(fields.id) && !isNullOrUndefined(fieldData[fields.id])) {
                id = <string>fieldData.id;
            }
            let innerEle: HTMLElement[] = [];
            if (curOpt.showCheckBox) {
                innerEle.push(createElement('input', { className: cssClass.check, attrs: { type: 'checkbox' } }));
            }
            if (isSingleLevel === true) {
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) && !isNullOrUndefined(fieldData[fields.iconCss])) {
                    innerEle.push(createElement('span', { className: cssClass.icon + ' ' + <string>fieldData[fields.iconCss] }));
                }
                li = generateSingleLevelLI(
                    createElement,
                    curItem,
                    fieldData,
                    fields,
                    curOpt.itemClass,
                    innerEle,
                    (curItem.hasOwnProperty('isHeader') &&
                        (curItem as { isHeader: Object } & { [key: string]: Object }).isHeader) ? true : false,
                    id,
                    i, options);
            } else {
                li = generateLI(createElement, curItem, fieldData, fields, curOpt.itemClass, options);
                li.classList.add(cssClass.level + '-' + ariaAttributes.level);
                li.setAttribute('aria-level', ariaAttributes.level.toString());
                if (fieldData.hasOwnProperty(fields.tooltip)) {
                    li.setAttribute('title', <string>fieldData[fields.tooltip]);
                }
                if (fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                    setAttribute(li, <{ [key: string]: string }>fieldData[fields.htmlAttributes]);
                }
                if (fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled] === false) {
                    li.classList.add(cssClass.disabled);
                }
                if (fieldData.hasOwnProperty(fields.isVisible) && fieldData[fields.isVisible] === false) {
                    li.style.display = 'none';
                }
                if (fieldData.hasOwnProperty(fields.imageUrl) && !isNullOrUndefined(fieldData[fields.imageUrl])
                    && !curOpt.template) {
                    let attr: { [key: string]: string } = { src: <string>fieldData[fields.imageUrl] };
                    merge(attr, fieldData[fields.imageAttributes]);
                    prepend([createElement('img', { className: cssClass.image, attrs: attr })], li.firstElementChild);
                }
                if (curOpt.showIcon && fieldData.hasOwnProperty(fields.iconCss) &&
                    !isNullOrUndefined(fieldData[fields.iconCss]) && !curOpt.template) {
                    prepend(
                        [createElement('div', { className: cssClass.icon + ' ' + <string>fieldData[fields.iconCss] })],
                        li.firstElementChild);
                }
                if (innerEle.length) {
                    prepend(innerEle, li.firstElementChild);
                }
                processSubChild(createElement, fieldData, fields, dataSource, curOpt, li, ariaAttributes.level);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                let curData: { [key: string]: object | string } = {
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

    /**
     * Function helps to created an element list based on array of JSON input .
     * @param  {{[key:string]:Object}[]} dataSource - Specifies an array of JSON data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    export function createListFromJson(
        createElement: createElementParams, dataSource: { [key: string]: Object }[],
        options?: ListBaseOptions, level?: number, isSingleLevel?: boolean): HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let li: HTMLElement[] = createListItemFromJson(createElement, dataSource, options, level, isSingleLevel);
        return generateUL(createElement, li, curOpt.listClass, options);
    }

    /**
     * Return the next or previous visible element.
     * @param  {Element[]|NodeList} elementArray - An element array to find next or previous element.
     * @param  {Element} li - An element to find next or previous after this element.
     * @param  {boolean} isPrevious? - Specify when the need get previous element from array.
     */
    export function getSiblingLI(elementArray: Element[] | NodeList, element: Element, isPrevious?: boolean): Element {

        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        if (!elementArray || !elementArray.length) { return void 0; }
        let siblingLI: Element;
        let liIndex: number;
        let liCollections: Element[] = Array.prototype.slice.call(elementArray);
        if (element) {
            liIndex = indexOf(element, liCollections);
        } else {
            liIndex = (isPrevious === true ? liCollections.length : -1);
        }
        siblingLI = liCollections[liIndex + (isPrevious === true ? -1 : 1)];
        while (siblingLI && (!isVisible(siblingLI) || siblingLI.classList.contains(cssClass.disabled))) {
            liIndex = liIndex + (isPrevious === true ? -1 : 1);
            siblingLI = liCollections[liIndex];
        }
        return siblingLI;
    }

    /**
     * Return the index of the li element
     * @param  {Element} item - An element to find next or previous after this element.
     * @param  {Element[]|NodeList} elementArray - An element array to find index of given li.
     */
    export function indexOf(item: Element, elementArray: Element[] | NodeList): number {
        if (!elementArray || !item) { return void 0; } else {
            let liCollections: Element[] = <Element[]>elementArray;
            liCollections = Array.prototype.slice.call(elementArray);
            return liCollections.indexOf(item);
        }
    }

    /**
     * Returns the grouped data from given dataSource.
     * @param  {{[key:string]:Object}[]} dataSource - The JSON data which is necessary to process.
     * @param  {FieldsMapping} fields - Fields that are mapped from the data source.
     * @param  {SortOrder='None'} sortOrder- Specifies final result sort order.
     */
    export function groupDataSource(
        dataSource: { [key: string]: Object }[],
        fields: FieldsMapping,
        sortOrder: SortOrder = 'None'): { [key: string]: Object }[] {
        let curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        let cusQuery: Query = new Query().group(curFields.groupBy);

        // need to remove once sorting issues fixed in DataManager
        cusQuery = addSorting(sortOrder, 'key', cusQuery);

        let ds: { [key: string]: Object }[] = getDataSource(dataSource, cusQuery);
        dataSource = [];

        for (let j: number = 0; j < ds.length; j++) {
            let itemObj: { [key: string]: Object }[] = (ds[j] as { items: { [key: string]: Object }[] } & { [key: string]: Object }).items;
            let grpItem: { [key: string]: Object } = {};
            let hdr: string = 'isHeader';
            grpItem[curFields.text] = (ds[j] as { key: string } & { [key: string]: Object }).key;
            grpItem[hdr] = true;
            grpItem.id = 'group-list-item-' + ((ds[j] as { [key: string]: Object }).key ?
                (ds[j] as { [key: string]: Object }).key.toString().trim() : 'undefined');
            grpItem.items = itemObj;
            dataSource.push(grpItem);
            for (let k: number = 0; k < itemObj.length; k++) {
                dataSource.push(itemObj[k]);
            }
        }
        return dataSource;
    }

    /**
     * Returns a sorted query object.
     * @param  {SortOrder} sortOrder - Specifies that sort order.
     * @param  {string} sortBy - Specifies sortBy fields.
     * @param  {Query=new Query()} query - Pass if any existing query.
     */
    export function addSorting(sortOrder: SortOrder, sortBy: string, query: Query = new Query()): Query {
        if (sortOrder === 'Ascending') {
            query.sortBy(sortBy, 'ascending', true);
        } else if (sortOrder === 'Descending') {
            query.sortBy(sortBy, 'descending', true);
        } else {
            for (let i: number = 0; i < query.queries.length; i++) {
                if (query.queries[i].fn === 'onSortBy') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    }


    /**
     * Return an array of JSON Data that processed based on queries.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {Query} query - Specifies query that need to process.
     */
    export function getDataSource(dataSource: { [key: string]: Object }[], query: Query): { [key: string]: Object }[] {
        // tslint:disable-next-line
        return <{ [key: string]: Object }[]>new DataManager(<any[]>dataSource)
            .executeLocal(query);
    }
    /**
     * Created JSON data based the UL and LI element
     * @param  {HTMLElement|Element} element - UL element that need to convert as a JSON
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    export function createJsonFromElement(
        element: HTMLElement | Element, options?: ListBaseOptions): { [key: string]: Object }[] {

        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let fields: FieldsMapping = extend({}, defaultMappedFields, curOpt.fields);
        let curEle: HTMLElement = <HTMLElement>element.cloneNode(true);
        let jsonAr: { [key: string]: {} }[] = [];

        curEle.classList.add('json-parent');
        let childs: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>curEle.querySelectorAll('.json-parent>li');
        curEle.classList.remove('json-parent');

        for (let i: number = 0; i < childs.length; i++) {
            let li: HTMLElement = childs[i];
            let anchor: HTMLElement = li.querySelector('a');
            let ul: Element = li.querySelector('ul');
            let json: { [key: string]: {} } = {};
            let childNodes: NodeList = anchor ? anchor.childNodes : li.childNodes;
            let keys: string[] = Object.keys(childNodes);
            for (let i: number = 0; i < childNodes.length; i++) {
                if (!(childNodes[Number(keys[i])]).hasChildNodes()) {
                    json[fields.text] = childNodes[Number(keys[i])].textContent;
                }
            }
            let attributes: { [key: string]: string } = getAllAttributes(li);
            if (attributes.id) {
                json[fields.id] = attributes.id;
                delete attributes.id;
            } else {
                json[fields.id] = generateId();
            }
            if (Object.keys(attributes).length) {
                json[fields.htmlAttributes] = attributes;
            }
            if (anchor) {
                attributes = getAllAttributes(anchor);
                if (Object.keys(attributes).length) {
                    json[fields.urlAttributes] = attributes;
                }
            }
            if (ul) {
                json[fields.child] = createJsonFromElement(ul, options);
            }
            jsonAr.push(json);
        }

        return jsonAr;

    }

    function typeofData(data: { [key: string]: Object }[] | string[] | number[]): { [key: string]: Object } {
        let match: { [key: string]: Object } = <{ [key: string]: Object }>{ typeof: null, item: null };
        for (let i: number = 0; i < data.length; i++) {
            if (!isNullOrUndefined(data[i])) {
                return match = { typeof: typeof data[i], item: data[i] };
            }
        }
        return match;
    }

    function setAttribute(element: HTMLElement, elementAttributes: { [key: string]: string }): void {
        let attr: { [key: string]: string } = {};
        merge(attr, elementAttributes);
        if (attr.class) {
            addClass([element], attr.class.split(' '));
            delete attr.class;
        }
        attributes(element, attr);
    }

    function getAllAttributes(element: HTMLElement): { [key: string]: string } {
        let attributes: { [key: string]: string } = {};
        let attr: NamedNodeMap = element.attributes;
        for (let index: number = 0; index < attr.length; index++) {
            attributes[attr[index].nodeName] = attr[index].nodeValue;
        }
        return attributes;
    }

    /**
     * Created UL element from content template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    export function renderContentTemplate(
        createElement: createElementParams, template: string, dataSource: { [key: string]: Object }[],
        fields?: FieldsMapping, options?: ListBaseOptions): HTMLElement {
        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        let ulElement: HTMLElement = createElement('ul', { className: cssClass.ul, attrs: { role: 'presentation' } });
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        let compiledString: Function = compile(template);
        let liCollection: HTMLElement[] = [];
        let id: string = generateId(); // generate id for drop-down-list option.
        for (let i: number = 0; i < dataSource.length; i++) {
            let fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource[i], curFields);
            let curItem: { [key: string]: Object } = dataSource[i];
            let isHeader: Object = (curItem as { isHeader: Object } & { [key: string]: Object }).isHeader;
            let value: string = fieldData[curFields.value] as string;
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                let curData: object = {
                    dataSource: dataSource,
                    curData: curItem,
                    text: value,
                    options: curOpt,
                    fields: curFields
                };
                curOpt.itemCreating(curData);
            }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = <{ [key: string]: Object }>getFieldValues(dataSource[i], curFields);
                value = fieldData[curFields.value] as string;
            }
            let li: HTMLElement = createElement('li', {
                id: id + '-' + i,
                className: isHeader ? cssClass.group : cssClass.li, attrs: { role: 'presentation' }
            });
            if (isHeader) {
                li.innerText = fieldData[curFields.text] as string;
            } else {
                append(compiledString(curItem), li);
                li.setAttribute('data-value', value);
                li.setAttribute('role', 'option');
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                let curData: Object = {
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
    /**
     * Created header items from group template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {FieldsMapping} fields - Specifies fields for mapping the dataSource.
     * @param  {Element[]} headerItems? - Specifies listbase header items.
     */
    export function renderGroupTemplate(
        groupTemplate: string, groupDataSource: { [key: string]: Object }[], fields: FieldsMapping, headerItems: Element[]):
        Element[] {
        let compiledString: Function = compile(groupTemplate);
        let curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        let category: string = curFields.groupBy;
        for (let header of headerItems) {
            let headerData: { [key: string]: string; } = {};
            headerData[category] = header.textContent;
            header.innerHTML = '';
            append(compiledString(headerData), header);
        }
        return headerItems;
    }

    export function generateId(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function processSubChild(
        createElement: createElementParams, fieldData: { [key: string]: Object }, fields: FieldsMapping, ds: { [key: string]: Object }[],
        options: ListBaseOptions, element: HTMLElement, level: number): void {
        // Get SubList
        let subDS: { [key: string]: Object }[] = <{ [key: string]: Object }[]>fieldData[fields.child] || [];
        let hasChildren: boolean = <boolean>fieldData[fields.hasChildren];
        //Create Sub child
        if (subDS.length) {
            hasChildren = true;
            element.classList.add(cssClass.hasChild);
            if (options.processSubChild) {
                let subLi: HTMLElement = <HTMLElement>createListFromJson(createElement, subDS, options, ++level);
                element.appendChild(subLi);
            }
        }

        // Create expand and collapse node
        if (!!options.expandCollapse && hasChildren && !options.template) {
            element.firstElementChild.classList.add(cssClass.iconWrapper);
            let expandElement: Function = options.expandIconPosition === 'Left' ? prepend : append;
            expandElement(
                [createElement('div', { className: 'e-icons ' + options.expandIconClass })],
                element.querySelector('.' + cssClass.textContent));
        }
    }

    function generateSingleLevelLI(
        createElement: createElementParams, item: string | { [key: string]: Object } | number,
        fieldData: { [key: string]: Object }, fields?: FieldsMapping, className?: string, innerElements?: HTMLElement[],
        grpLI?: boolean, id?: string, index?: number, options?: ListBaseOptions):
        HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let text: string = <string>item;
        let value: string = <string>item;
        let dataSource: { [key: string]: string } | { [key: string]: object };
        if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean') {
            dataSource = <{ [key: string]: Object }>item;
            text = (typeof fieldData[fields.text] === 'boolean' || typeof fieldData[fields.text] === 'number') ?
                <string>fieldData[fields.text] : (<string>fieldData[fields.text] || '');
            value = <string>fieldData[fields.value];
        }
        let elementID: string;
        if (!isNullOrUndefined(dataSource) && !isNullOrUndefined(fieldData[fields.id])
            && fieldData[fields.id] !== '') {
            elementID = id;
        } else {
            elementID = id + '-' + index;
        }
        let li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            id: elementID, attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        if (dataSource && fieldData.hasOwnProperty(fields.enabled) && fieldData[fields.enabled].toString() === 'false') {
            li.classList.add(cssClass.disabled);
        }
        if (grpLI) {
            li.innerText = text;
        } else {
            if (!isNullOrUndefined(value)) {
                li.setAttribute('data-value', value);
            }

            li.setAttribute('role', 'option');

            if (dataSource && fieldData.hasOwnProperty(fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                setAttribute(li, <{ [key: string]: string }>fieldData[fields.htmlAttributes]);
            }

            if (innerElements.length) { append(innerElements, li); }

            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                (fieldData[fields.urlAttributes] as { [key: string]: Object }).href))) {
                li.appendChild(anchorTag(createElement, dataSource, fields, text));
            } else {
                li.appendChild(document.createTextNode(text));
            }
        }
        return li;
    }

    function getModuleClass(moduleName: string): ClassList {
        let moduleClass: ClassList;
        return moduleClass = {
            li: `e-${moduleName}-item`,
            ul: `e-${moduleName}-parent e-ul`,
            group: `e-${moduleName}-group-item`,
            icon: `e-${moduleName}-icon`,
            text: `e-${moduleName}-text`,
            check: `e-${moduleName}-check`,
            checked: 'e-checked',
            selected: 'e-selected',
            expanded: 'e-expanded',
            textContent: 'e-text-content',
            hasChild: 'e-has-child',
            level: 'e-level',
            url: `e-${moduleName}-url`,
            collapsible: 'e-icon-collapsible',
            disabled: 'e-disabled',
            image: `e-${moduleName}-img`,
            iconWrapper: 'e-icon-wrapper'
        };
    }

    function anchorTag(
        createElement: createElementParams, dataSource: { [key: string]: object } | { [key: string]: string },
        fields: FieldsMapping, text: string): HTMLElement {
        let fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource, fields);
        let attr: { [key: string]: string } = { href: <string>fieldData[fields.url] };
        if (fieldData.hasOwnProperty(fields.urlAttributes) && fieldData[fields.urlAttributes]) {
            merge(attr, fieldData[fields.urlAttributes]);
            attr.href = <string>fieldData[fields.url] ? <string>fieldData[fields.url] :
             (fieldData[fields.urlAttributes] as { [key: string]: Object }).href as string;
        }
        let anchorTag: HTMLElement = createElement('a', { className: cssClass.text + ' ' + cssClass.url, innerHTML: text });
        setAttribute(anchorTag, attr);
        return anchorTag;
    }

    /* tslint:disable:align */
    function generateLI(
        createElement: createElementParams, item: string | { [key: string]: Object } | number, fieldData: { [key: string]: Object },
        fields: FieldsMapping, className?: string, options?: ListBaseOptions): HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let text: string = <string>item;
        let uID: string;
        let grpLI: boolean;
        let dataSource: { [key: string]: string } | { [key: string]: object };
        if (typeof item !== 'string' && typeof item !== 'number') {
            dataSource = <{ [key: string]: Object }>item;
            text = <string>fieldData[fields.text] || '';
            uID = <string>fieldData[fields.id];
            grpLI = (item.hasOwnProperty('isHeader') && (item as { isHeader: Object } & { [key: string]: Object }).isHeader)
                ? true : false;
        }

        let li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });

        !isNullOrUndefined(uID) ? li.setAttribute('data-uid', uID) : li.setAttribute('data-uid', generateId());

        if (grpLI && options && options.groupTemplate) {
            let compiledString: Function = compile(options.groupTemplate);
            append(compiledString(item), li);
        } else if (!grpLI && options && options.template) {
            let compiledString: Function = compile(options.template);
            append(compiledString(item), li);
        } else {
            let innerDiv: HTMLElement = createElement('div', {
                className: cssClass.textContent,
                attrs: (ariaAttributes.wrapperRole !== '' ? { role: ariaAttributes.wrapperRole } : {})
            });
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                (fieldData[fields.urlAttributes] as { [key: string]: Object }).href))) {
                innerDiv.appendChild(anchorTag(createElement, dataSource, fields, text));
            } else {
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
    export function generateUL(
        createElement: createElementParams, liElement: HTMLElement[], className?: string, options?: ListBaseOptions): HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        cssClass = getModuleClass(curOpt.moduleName);
        let ulElement: HTMLElement = createElement('ul', {
            className: cssClass.ul + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.listRole !== '' ? { role: ariaAttributes.listRole } : {})
        });

        append(liElement, ulElement);

        return ulElement;
    }

    /**
     * Returns LI element with additional DIV tag based on the given LI element.
     * @param  {liElement} liElement - Specifies LI element.
     * @param  {string} className? - Specifies class name that need to be added in created DIV element.
     * @param  {ListBaseOptions} options? - Specifies ListBase options.
     */
    export function generateIcon(
        createElement: createElementParams, liElement: HTMLElement, className?: string, options?: ListBaseOptions): HTMLElement {
        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        let expandElement: Function = curOpt.expandIconPosition === 'Left' ? prepend : append;
        expandElement(
            [createElement('div', {
                className: 'e-icons ' + curOpt.expandIconClass + ' ' +
                    (isNullOrUndefined(className) ? '' : className)
            })],
            liElement.querySelector('.' + cssClass.textContent));

        return liElement;
    }

}

export type createElementParams = (
    tag: string,
    prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
) => HTMLElement;

export interface FieldsMapping {
    id?: string;
    text?: string;
    value?: string;
    isChecked?: string;
    isVisible?: string;
    url?: string;
    enabled?: string;
    groupBy?: string;
    expanded?: string;
    selected?: string;
    iconCss?: string;
    child?: string;
    tooltip?: string;
    hasChildren?: string;
    htmlAttributes?: string;
    urlAttributes?: string;
    imageUrl?: string;
    imageAttributes?: string;
}

export type Position = 'Right' | 'Left';

export interface AriaAttributesMapping {
    level?: number;
    listRole?: string;
    itemRole?: string;
    groupItemRole?: string;
    itemText?: string;
    wrapperRole?: string;
}

/**
 * Basic ListBase Options
 */
export interface ListBaseOptions {
    /**
     * Specifies that fields that mapped in dataSource
     */
    fields?: FieldsMapping;
    /**
     * Specifies the aria attributes
     */
    ariaAttributes?: AriaAttributesMapping;
    /**
     * Specifies to show checkBox
     */
    showCheckBox?: boolean;
    /**
     * Specifies to show icon
     */
    showIcon?: boolean;
    /**
     * Specifies to show collapsible icon
     */
    expandCollapse?: boolean;
    /**
     * Specifies when need to add additional UL list class
     */
    listClass?: string;
    /**
     * Specifies when need to add additional LI item class
     */
    itemClass?: string;
    /**
     * Enables when need process depth child processing.
     */
    processSubChild?: boolean;
    /**
     * Specifies the sort order
     */
    sortOrder?: SortOrder;
    /**
     * Specifies the item template
     */
    template?: string;
    /**
     * Specifies the group header template
     */
    groupTemplate?: string;
    /**
     * Specifies the ListView header template
     */
    headerTemplate?: string;
    /**
     * Specifies the callback function that triggered before each list creation
     */
    itemCreating?: Function;
    /**
     * Specifies the callback function that triggered after each list creation
     */
    itemCreated?: Function;
    /**
     * Specifies the customizable expand icon class
     */
    expandIconClass?: string;
    /**
     * Specifies the customized class name based on their module name
     */
    moduleName?: string;
    /**
     * Specifies the expand/collapse icon position
     */
    expandIconPosition?: Position;
}

/**
 * Used to get dataSource item from complex data using fields.
 * @param {{[key:string]:Object}|string[]|string} dataSource - Specifies an  JSON or String data.
 * @param {FieldsMapping} fields - Fields that are mapped from the dataSource.
 */
export function getFieldValues(dataItem: { [key: string]: Object } | string | number, fields: FieldsMapping)
    : { [key: string]: Object } | string | number {
    let fieldData: { [key: string]: Object } = {};
    if (isNullOrUndefined(dataItem) || typeof (dataItem) === 'string' || typeof (dataItem) === 'number'
        || !isNullOrUndefined((<{ [key: string]: Object }>dataItem).isHeader)) {
        return dataItem;
    } else {
        for (let field of Object.keys(fields)) {
            let dataField: string = (<{ [key: string]: Object }>fields)[field] as string;
            let value: { [key: string]: Object } = !isNullOrUndefined(dataField) &&
                typeof (dataField) === 'string' ? getValue(dataField, dataItem) : undefined;
            if (!isNullOrUndefined(value)) {
                fieldData[dataField] = value;
            }
        }
    }
    return fieldData;
}