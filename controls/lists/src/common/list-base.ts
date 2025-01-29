/* eslint-disable no-inner-declarations */
import { extend, merge, isNullOrUndefined, getValue, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
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
    iconWrapper: 'e-icon-wrapper',
    anchorWrap: 'e-anchor-wrap',
    navigable: 'e-navigable'
};

/**
 * An interface that holds item class list
 */
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
    anchorWrap: string;
    navigable: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Sorting Order
 */
export type SortOrder = 'None' | 'Ascending' | 'Descending';

/**
 * Base List Generator
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListBase {

    /**
     *
     * Default mapped fields.
     */
    export const defaultMappedFields: FieldsMapping = {
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
        groupBy: null,
        sortBy: null
    };

    const defaultAriaAttributes: AriaAttributesMapping = {
        level: 1,
        listRole: 'presentation',
        itemRole: 'presentation',
        groupItemRole: 'group',
        itemText: 'list-item',
        wrapperRole: 'presentation'
    };

    const defaultListBaseOptions: ListBaseOptions = {
        showCheckBox: false,
        showIcon: false,
        enableHtmlSanitizer: false,
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
        expandIconPosition: 'Right',
        itemNavigable: false
    };

    /**
     * Function helps to created and return the UL Li element based on your data.
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     *
     * @param  {{Object}[]} dataSource - Specifies an array of JSON data.
     *
     * @param  {ListBaseOptions} [options] - Specifies the list options that need to provide.
     *
     * @param  {boolean} [isSingleLevel] - Specifies the list options that need to provide.
     *
     * @param  {any} [componentInstance] - Specifies the list options that need to provide.
     *
     * @returns  {createElement} createListFromJson - Specifies the list options that need to provide.
     */
    export function createList(
        createElement: createElementParams, dataSource: { [key: string]: Object }[] | string[] | number[],
        options?: ListBaseOptions, isSingleLevel?: boolean, componentInstance?: any):
        HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        const type: string = typeofData(dataSource).typeof as string;
        if (type === 'string' || type === 'number') {
            return createListFromArray(createElement, <string[] | number[]>dataSource, isSingleLevel, options, componentInstance);
        } else {
            return createListFromJson(
                createElement,
                <{ [key: string]: Object }[]>dataSource,
                options,
                ariaAttributes.level,
                isSingleLevel,
                componentInstance
            );
        }
    }

    /**
     * Function helps to created an element list based on string array input .
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     *
     * @param  {{Object}[]} dataSource - Specifies an array of JSON data.
     *
     * @param  {boolean} [isSingleLevel] - Specifies the list options that need to provide.
     *
     * @param  {ListBaseOptions} [options] - Specifies the list options that need to provide.
     *
     * @param  {any} [componentInstance] - Specifies the list options that need to provide.
     *
     * @returns  {createElement} generateUL - returns the list options that need to provide.
     */
    export function createListFromArray(
        createElement: createElementParams, dataSource: string[] | number[],
        isSingleLevel?: boolean, options?: ListBaseOptions, componentInstance?: any): HTMLElement {
        const subChild: HTMLElement[] = createListItemFromArray(createElement, dataSource, isSingleLevel, options, componentInstance);
        return generateUL(createElement, subChild, null, options);
    }
    /**
     * Function helps to created an element list based on string array input .
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     *
     * @param  {{Object}[]} dataSource - Specifies an array of JSON data.
     *
     * @param  {boolean} [isSingleLevel] - Specifies the list options that need to provide.
     *
     * @param  {ListBaseOptions} [options] - Specifies the list options that need to provide.
     *
     * @param  {any} [componentInstance] - Specifies the list options that need to provide.
     *
     * @returns  {HTMLElement[]} subChild - returns the list options that need to provide.
     */
    export function createListItemFromArray(
        createElement: createElementParams, dataSource: string[] | number[],
        isSingleLevel?: boolean, options?: ListBaseOptions, componentInstance?: any): HTMLElement[] {
        const subChild: HTMLElement[] = [];
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        const id: string = generateId(); // generate id for drop-down-list option.
        for (let i: number = 0; i < dataSource.length; i++) {
            if (isNullOrUndefined(dataSource[i as number])) {
                continue;
            }
            let li: HTMLElement;
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                const curData: object = {
                    dataSource: dataSource,
                    curData: dataSource[i as number],
                    text: dataSource[i as number],
                    options: curOpt
                };
                curOpt.itemCreating(curData);
            }

            if (isSingleLevel) {
                li = generateSingleLevelLI(createElement, dataSource[i as number], undefined, null, null, [], null, id, i, options);
            } else {
                li = generateLI(createElement, dataSource[i as number], undefined, null, null, options, componentInstance);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                const curData: Object = {
                    dataSource: dataSource,
                    curData: dataSource[i as number],
                    text: dataSource[i as number],
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
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     *
     * @param  {{Object}[]} dataSource - Specifies an array of JSON data.
     *
     * @param  {ListBaseOptions} [options] - Specifies the list options that need to provide.
     *
     * @param  {number} [level] - Specifies the list options that need to provide.
     *
     * @param  {boolean} [isSingleLevel] - Specifies the list options that need to provide.
     *
     * @param  {any} [componentInstance] - Specifies the list options that need to provide.
     *
     * @returns  {HTMLElement[]} child - returns the list options that need to provide.
     */
    export function createListItemFromJson(
        createElement: createElementParams, dataSource: { [key: string]: Object }[],
        options?: ListBaseOptions, level?: number, isSingleLevel?: boolean, componentInstance?: any): HTMLElement[] {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        const fields: FieldsMapping = (componentInstance &&
            (componentInstance.getModuleName() === 'listview' || componentInstance.getModuleName() === 'multiselect'))
            ? curOpt.fields : extend({}, defaultMappedFields, curOpt.fields);
        const ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let id: string;
        let checkboxElement: HTMLElement[] = [];
        if (level) {
            ariaAttributes.level = level;
        }
        const child: HTMLElement[] = [];
        let li: HTMLElement;
        let anchorElement: HTMLElement;
        if (dataSource && dataSource.length && !isNullOrUndefined(typeofData(dataSource).item) &&
            !Object.prototype.hasOwnProperty.call(typeofData(dataSource).item, fields.id)) {
            id = generateId(); // generate id for drop-down-list option.
        }
        for (let i: number = 0; i < dataSource.length; i++) {
            let fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource[i as number], fields);
            if (isNullOrUndefined(dataSource[i as number])) { continue; }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                const curData: { [key: string]: object | string } = {
                    dataSource: dataSource,
                    curData: dataSource[i as number],
                    text: fieldData[fields.text],
                    options: curOpt,
                    fields: fields
                };
                curOpt.itemCreating(curData);
            }
            const curItem: { [key: string]: Object } = dataSource[i as number];
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = <{ [key: string]: Object }>getFieldValues(dataSource[i as number], fields);
            }
            if (Object.prototype.hasOwnProperty.call(fieldData, fields.id) && !isNullOrUndefined(fieldData[fields.id])) {
                id = <string>fieldData[fields.id];
            }
            const innerEle: HTMLElement[] = [];
            if (curOpt.showCheckBox) {
                if (curOpt.itemNavigable && (fieldData[fields.url] || fieldData[fields.urlAttributes])) {
                    checkboxElement.push(createElement('input', { className: cssClass.check, attrs: { type: 'checkbox' } }));
                } else {
                    innerEle.push(createElement('input', { className: cssClass.check, attrs: { type: 'checkbox' } }));
                }
            }
            if (isSingleLevel === true) {
                if (curOpt.showIcon && Object.prototype.hasOwnProperty.call(fieldData, fields.iconCss)
                    && !isNullOrUndefined(fieldData[fields.iconCss])) {
                    innerEle.push(createElement('span', { className: cssClass.icon + ' ' + <string>fieldData[fields.iconCss] }));
                }
                li = generateSingleLevelLI(
                    createElement,
                    curItem,
                    fieldData,
                    fields,
                    curOpt.itemClass,
                    innerEle,
                    (Object.prototype.hasOwnProperty.call(curItem, 'isHeader') &&
                        (curItem as { isHeader: Object } & { [key: string]: Object }).isHeader) ? true : false,
                    id,
                    i, options);
                anchorElement = li.querySelector('.' + cssClass.anchorWrap);
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.tooltip)) {
                    let tooltipText: string = <string>fieldData[fields.tooltip];
                    if (options && options.enableHtmlSanitizer) {
                        tooltipText = SanitizeHtmlHelper.sanitize(tooltipText);
                    } else {
                        let tooltipTextElement: HTMLElement = createElement('span', { innerHTML: tooltipText });
                        tooltipText = tooltipTextElement.innerText;
                        tooltipTextElement = null;
                    }
                    li.setAttribute('title', tooltipText);
                }
                if (curOpt.itemNavigable && checkboxElement.length) {
                    prepend(checkboxElement, li.firstElementChild);
                }
            } else {
                li = generateLI(createElement, curItem, fieldData, fields, curOpt.itemClass, options, componentInstance);
                li.classList.add(cssClass.level + '-' + ariaAttributes.level);
                li.setAttribute('aria-level', ariaAttributes.level.toString());
                if (ariaAttributes.groupItemRole === 'presentation' || ariaAttributes.itemRole === 'presentation') {
                    li.removeAttribute('aria-level');
                }
                anchorElement = li.querySelector('.' + cssClass.anchorWrap);
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.tooltip)) {
                    let tooltipText: string = <string>fieldData[fields.tooltip];
                    if (options && options.enableHtmlSanitizer) {
                        tooltipText = SanitizeHtmlHelper.sanitize(tooltipText);
                    } else {
                        let tooltipTextElement: HTMLElement = createElement('span', { innerHTML: tooltipText });
                        tooltipText = tooltipTextElement.innerText;
                        tooltipTextElement = null;
                    }
                    li.setAttribute('title', tooltipText);
                }
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                    const htmlAttributes: { [key: string]: string } = <{ [key: string]: string }>fieldData[fields.htmlAttributes];
                    // Check if 'class' attribute is present and not an empty string
                    if ('class' in htmlAttributes && typeof htmlAttributes['class'] === 'string' && htmlAttributes['class'].trim() === '') {
                        delete htmlAttributes['class'];
                    }
                    setAttribute(li, htmlAttributes);
                }
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.enabled) && fieldData[fields.enabled] === false) {
                    li.classList.add(cssClass.disabled);
                }
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.isVisible) && fieldData[fields.isVisible] === false) {
                    li.style.display = 'none';
                }
                if (Object.prototype.hasOwnProperty.call(fieldData, fields.imageUrl) && !isNullOrUndefined(fieldData[fields.imageUrl])
                    && !curOpt.template) {
                    const attr: { [key: string]: string } = { src: <string>fieldData[fields.imageUrl], alt: !isNullOrUndefined(<string>fieldData.name) ? ('Displaying ' + <string>fieldData.name + ' Image') : 'Displaying Image'};
                    merge(attr, fieldData[fields.imageAttributes]);
                    const imageElemnt: HTMLElement = createElement('img', { className: cssClass.image, attrs: attr });
                    if (anchorElement) {
                        anchorElement.insertAdjacentElement('afterbegin', imageElemnt);
                    } else {
                        prepend([imageElemnt], li.firstElementChild);
                    }
                }
                if (curOpt.showIcon && Object.prototype.hasOwnProperty.call(fieldData, fields.iconCss) &&
                    !isNullOrUndefined(fieldData[fields.iconCss]) && !curOpt.template) {
                    const iconElement: HTMLElement = createElement('div', { className: cssClass.icon + ' ' + <string>fieldData[fields.iconCss] });
                    if (anchorElement) {
                        anchorElement.insertAdjacentElement('afterbegin', iconElement);
                    } else {
                        prepend([iconElement], li.firstElementChild);
                    }
                }
                if (innerEle.length) {
                    prepend(innerEle, li.firstElementChild);
                }
                if (curOpt.itemNavigable && checkboxElement.length) {
                    prepend(checkboxElement, li.firstElementChild);
                }
                processSubChild(createElement, fieldData, fields, dataSource, curOpt, li, ariaAttributes.level);
            }
            if (anchorElement) {
                addClass([li], [cssClass.navigable]);
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                const curData: { [key: string]: object | string } = {
                    dataSource: dataSource,
                    curData: dataSource[i as number],
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

    /**
     * Function helps to created an element list based on array of JSON input .
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     *
     * @param  {{Object}[]} dataSource - Specifies an array of JSON data.
     *
     * @param  {ListBaseOptions} [options] - Specifies the list options that need to provide.
     *
     * @param  {number} [level] - Specifies the list options that need to provide.
     *
     * @param  {boolean} [isSingleLevel] - Specifies the list options that need to provide.
     *
     * @param  {any} [componentInstance] - Specifies the list options that need to provide.
     *
     * @returns  {createElement} generateUL - Specifies the list options that need to provide.
     */
    export function createListFromJson(
        createElement: createElementParams, dataSource: { [key: string]: Object }[],
        options?: ListBaseOptions, level?: number, isSingleLevel?: boolean, componentInstance?: any): HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const li: HTMLElement[] = createListItemFromJson(createElement, dataSource, options, level, isSingleLevel, componentInstance);
        return generateUL(createElement, li, curOpt.listClass, options);
    }


    /**
     * Return the next or previous visible element.
     *
     * @param  {Element[]|NodeList} elementArray - An element array to find next or previous element.
     * @param  {Element} element - An element to find next or previous after this element.
     * @param  {boolean} [isPrevious] - Specify when the need get previous element from array.
     * @returns {Element|undefined} The next or previous visible element, or undefined if the element array is empty.
     */
    export function getSiblingLI(elementArray: Element[] | NodeList, element: Element, isPrevious?: boolean): Element {

        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        if (!elementArray || !elementArray.length) { return void 0; }
        let siblingLI: Element;
        let liIndex: number;
        const liCollections: Element[] = Array.prototype.slice.call(elementArray);
        if (element) {
            liIndex = indexOf(element, liCollections);
        } else {
            liIndex = (isPrevious === true ? liCollections.length : -1);
        }
        siblingLI = liCollections[liIndex + (isPrevious === true ? -1 : 1)];
        while (siblingLI && (!isVisible(siblingLI) || siblingLI.classList.contains(cssClass.disabled))) {
            liIndex = liIndex + (isPrevious === true ? -1 : 1);
            siblingLI = liCollections[liIndex as number];
        }
        return siblingLI;
    }

    /**
     * Return the index of the li element
     *
     * @param  {Element} item - An element to find next or previous after this element.
     * @param  {Element[]} elementArray - An element array to find index of given li.
     * @returns {number} - The index of the item in the element array, or undefined if either parameter is false.
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
     *
     * @param  {{Object}[]} dataSource - The JSON data which is necessary to process.
     * @param  {FieldsMapping} fields - Fields that are mapped from the data source.
     * @param  {SortOrder} [sortOrder='None'] - Specifies final result sort order. Defaults to 'None'.
     * @returns {Object[]} - The grouped data.
     */
    export function groupDataSource(
        dataSource: { [key: string]: Object }[],
        fields: FieldsMapping,
        sortOrder: SortOrder = 'None'): { [key: string]: Object }[] {
        const curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        let cusQuery: Query = new Query().group(curFields.groupBy);

        // need to remove once sorting issues fixed in DataManager
        cusQuery = addSorting(sortOrder, 'key', cusQuery);

        const ds: { [key: string]: Object }[] = getDataSource(dataSource, cusQuery);
        dataSource = [];

        for (let j: number = 0; j < ds.length; j++) {
            const itemObj: { [key: string]: Object }[]
                = (ds[j as number] as { items: { [key: string]: Object }[] } & { [key: string]: Object }).items;
            const grpItem: { [key: string]: Object } = {};
            const hdr: string = 'isHeader';
            grpItem[curFields.text] = (ds[j as number] as { key: string } & { [key: string]: Object }).key;
            grpItem[`${hdr}`] = true;
            let newtext: string = curFields.text;
            if (newtext === 'id') {
                newtext = 'text';
                grpItem[`${newtext}`] = ds[j as number].key;
            }
            grpItem._id = 'group-list-item-' + ((ds[j as number] as { [key: string]: Object }).key ?
                (ds[j as number] as { [key: string]: Object }).key.toString().trim() : 'undefined');
            grpItem.items = itemObj;
            dataSource.push(grpItem);
            for (let k: number = 0; k < itemObj.length; k++) {
                dataSource.push(itemObj[k as number]);
            }
        }
        return dataSource;
    }

    /**
     * Returns a sorted query object.
     *
     * @param  {SortOrder} sortOrder - Specifies that sort order.
     * @param  {string} sortBy - Specifies sortBy fields.
     * @param  {Query} query - Pass if any existing query.
     * @returns {Query} - The updated query object with sorting applied.
     */
    export function addSorting(sortOrder: SortOrder, sortBy: string, query: Query = new Query()): Query {
        if (sortOrder === 'Ascending') {
            query.sortBy(sortBy, 'ascending', true);
        } else if (sortOrder === 'Descending') {
            query.sortBy(sortBy, 'descending', true);
        } else {
            for (let i: number = 0; i < query.queries.length; i++) {
                if (query.queries[i as number].fn === 'onSortBy') {
                    query.queries.splice(i, 1);
                }
            }
        }
        return query;
    }


    /**
     * Return an array of JSON Data that processed based on queries.
     *
     * @param  {{Object}[]} dataSource - Specifies local JSON data source.
     *
     * @param  {Query} query - Specifies query that need to process.
     *
     * @returns {Object[]} - An array of objects representing the retrieved data.
     */
    export function getDataSource(dataSource: { [key: string]: Object }[], query: Query): { [key: string]: Object }[] {
        return <{ [key: string]: Object }[]>new DataManager(<{ [key: string]: Object }[]>dataSource)
            .executeLocal(query);
    }
    /**
     * Created JSON data based the UL and LI element
     *
     * @param  {HTMLElement|Element} element - UL element that need to convert as a JSON
     * @param  {ListBaseOptions} [options] - Specifies ListBase option for fields.
     * @returns {Object[]} - An array of objects representing the JSON data.
     */
    export function createJsonFromElement(
        element: HTMLElement | Element, options?: ListBaseOptions): { [key: string]: Object }[] {

        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const fields: FieldsMapping = extend({}, defaultMappedFields, curOpt.fields);
        const curEle: HTMLElement = <HTMLElement>element.cloneNode(true);
        const jsonAr: { [key: string]: {} }[] = [];

        curEle.classList.add('json-parent');
        const childs: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>curEle.querySelectorAll('.json-parent>li');
        curEle.classList.remove('json-parent');

        for (let i: number = 0; i < childs.length; i++) {
            const li: HTMLElement = childs[i as number];
            const anchor: HTMLElement = li.querySelector('a');
            const ul: Element = li.querySelector('ul');
            const json: { [key: string]: {} } = {};
            const childNodes: NodeList = anchor ? anchor.childNodes : li.childNodes;
            const keys: string[] = Object.keys(childNodes);
            for (let i: number = 0; i < childNodes.length; i++) {
                if (!(childNodes[Number(keys[i as number])]).hasChildNodes()) {
                    json[fields.text] = childNodes[Number(keys[i as number])].textContent;
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
    /**
     * Determines the type of data in an array of objects, strings, or numbers.
     *
     * @param {Object[] | string[] | number[]} data - The array containing objects, strings, or numbers.
     * @returns {{typeof: (string | null), item: (Object | string | number)}} - An object containing the type of data and the corresponding item.
     */
    function typeofData(data: { [key: string]: Object }[] | string[] | number[]): { [key: string]: Object } {
        let match: { [key: string]: Object } = <{ [key: string]: Object }>{ typeof: null, item: null };
        for (let i: number = 0; i < data.length; i++) {
            if (!isNullOrUndefined(data[i as number])) {
                return match = { typeof: typeof data[i as number], item: data[i as number] };
            }
        }
        return match;
    }
    /**
     * Sets attributes on an HTML element.
     *
     * @param {HTMLElement} element - The HTML element to set attributes on.
     * @param {Object.<string, string>} elementAttributes - An object containing attribute names and their corresponding values.
     * @returns {void}
     */
    function setAttribute(element: HTMLElement, elementAttributes: { [key: string]: string }): void {
        const attr: { [key: string]: string } = {};
        merge(attr, elementAttributes);
        if (attr.class) {
            addClass([element], attr.class.split(' '));
            delete attr.class;
        }
        attributes(element, attr);
    }
    /**
     * Retrieves all attributes of an HTML element.
     *
     * @param {HTMLElement} element - The HTML element to retrieve attributes from.
     * @returns {Object.<string, string>} - An object containing attribute names as keys and their corresponding values as values.
     */
    function getAllAttributes(element: HTMLElement): { [key: string]: string } {
        const attributes: { [key: string]: string } = {};
        const attr: NamedNodeMap = element.attributes;
        for (let index: number = 0; index < attr.length; index++) {
            attributes[attr[index as number].nodeName] = attr[index as number].nodeValue;
        }
        return attributes;
    }


    /**
     * Created UL element from content template.
     *
     * @param  {createElementParams} createElement - Specifies an array of JSON data.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{Object}[]} dataSource - Specifies local JSON data source.
     * @param  {FieldsMapping} [fields] - Specifies fields for mapping the dataSource.
     * @param  {ListBaseOptions} [options] - Specifies ListBase option for fields.
     * @param  {any} [componentInstance] - Specifies component instance.
     * @returns {HTMLElement} - The generated LI element.
     */
    export function renderContentTemplate(
        createElement: createElementParams, template: string | Function, dataSource: { [key: string]: Object }[] | string[] | number[],
        fields?: FieldsMapping, options?: ListBaseOptions, componentInstance?: any): HTMLElement {
        cssClass = getModuleClass(defaultListBaseOptions.moduleName);
        const ulElement: HTMLElement = createElement('ul', { className: cssClass.ul, attrs: { role: 'presentation' } });
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        const compiledString: Function = compileTemplate(template);
        const liCollection: HTMLElement[] = [];
        let value: string;
        const id: string = generateId(); // generate id for drop-down-list option.
        for (let i: number = 0; i < dataSource.length; i++) {
            let fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource[i as number], curFields);
            const curItem: { [key: string]: Object } | string | number = dataSource[i as number];
            const isHeader: Object = (curItem as { isHeader: Object } & { [key: string]: Object }).isHeader;
            if (typeof dataSource[i as number] === 'string' || typeof dataSource[i as number] === 'number') {
                value = curItem as string;
            } else {
                value = fieldData[curFields.value] as string;
            }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                const curData: object = {
                    dataSource: dataSource,
                    curData: curItem,
                    text: value,
                    options: curOpt,
                    fields: curFields
                };
                curOpt.itemCreating(curData);
            }
            if (curOpt.itemCreating && typeof curOpt.itemCreating === 'function') {
                fieldData = <{ [key: string]: Object }>getFieldValues(dataSource[i as number], curFields);
                if (typeof dataSource[i as number] === 'string' || typeof dataSource[i as number] === 'number') {
                    value = curItem as string;
                } else {
                    value = fieldData[curFields.value] as string;
                }
            }
            const li: HTMLElement = createElement('li', {
                id: id + '-' + i,
                className: isHeader ? cssClass.group : cssClass.li, attrs: { role: 'presentation' }
            });
            if (isHeader) {
                if (typeof dataSource[i as number] === 'string' || typeof dataSource[i as number] === 'number') {
                    li.innerText = curItem as string;
                } else {
                    li.innerText = fieldData[curFields.text] as string;
                }
            } else {
                const currentID: string = isHeader ? curOpt.groupTemplateID : curOpt.templateID;
                if (isHeader) {
                    if (componentInstance && componentInstance.getModuleName() !== 'listview') {
                        const compiledElement: HTMLElement[] = compiledString(
                            curItem,
                            componentInstance,
                            'headerTemplate',
                            currentID,
                            !!curOpt.isStringTemplate,
                            null,
                            li);
                        if (compiledElement) {
                            append(compiledElement, li);
                        }
                    } else {
                        append(compiledString(curItem, componentInstance, 'headerTemplate', currentID, !!curOpt.isStringTemplate), li);
                    }
                } else {
                    if (componentInstance && componentInstance.getModuleName() !== 'listview') {
                        const compiledElement: HTMLElement[] = compiledString(
                            curItem,
                            componentInstance,
                            'template',
                            currentID,
                            !!curOpt.isStringTemplate,
                            null,
                            li);
                        if (compiledElement) {
                            append(compiledElement, li);
                        }
                    } else {
                        append(compiledString(curItem, componentInstance, 'template', currentID, !!curOpt.isStringTemplate), li);
                    }
                }
                li.setAttribute('data-value', isNullOrUndefined(value) ? 'null' : value);
                li.setAttribute('role', 'option');
            }
            if (curOpt.itemCreated && typeof curOpt.itemCreated === 'function') {
                const curData: Object = {
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
     *
     * @param  {string | Function} groupTemplate - that need to convert and generate li element.
     *
     * @param {{Object}[]} groupDataSource - Specifies local JSON data source.
     *
     * @param  {FieldsMapping} fields - Specifies fields for mapping the dataSource.
     *
     * @param  {Element[]} headerItems - Specifies ListBase header items.
     *
     * @param {ListBaseOptions} [options] - Optional ListBase options.
     *
     * @param {*} [componentInstance] - Optional component instance.
     *
     * @returns {Element[]} - An array of header elements with the rendered group template content.
     */
    export function renderGroupTemplate(
        groupTemplate: string | Function,
        // tslint:disable-next-line
        groupDataSource: { [key: string]: Object }[],
        fields: FieldsMapping,
        headerItems: Element[], options?: ListBaseOptions, componentInstance?: any): Element[] {
        const compiledString: Function = compileTemplate(groupTemplate);
        const curFields: FieldsMapping = extend({}, defaultMappedFields, fields);
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const category: string = curFields.groupBy;
        for (const header of headerItems) {
            const headerData: { [key: string]: string; } = {};
            headerData[`${category}`] = header.textContent;
            header.innerHTML = '';
            if (componentInstance && componentInstance.getModuleName() !== 'listview') {
                const compiledElement: HTMLElement[] = compiledString(
                    headerData,
                    componentInstance,
                    'groupTemplate',
                    curOpt.groupTemplateID,
                    !!curOpt.isStringTemplate, null, header);
                if (compiledElement) {
                    append(compiledElement, header);
                }
            } else {
                append(compiledString(headerData, componentInstance, 'groupTemplate', curOpt.groupTemplateID, !!curOpt.isStringTemplate), header);
            }
        }
        return headerItems;
    }
    /**
     * Generates a random hexadecimal ID string.
     *
     * @returns {string} - The generated ID string.
     */
    export function generateId(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    /**
     * Processes the sub-child elements and creates corresponding elements based on the provided field data and options.
     *
     * @param {Function} createElement - Function for creating elements.
     * @param {Object} fieldData - Field data containing sub-child information.
     * @param {FieldsMapping} fields - Field mappings.
     * @param {Object[]} ds - The data source array containing sub-child elements.
     * @param {ListBaseOptions} options - ListBase options.
     * @param {HTMLElement} element - The parent HTML element to append sub-child elements to.
     * @param {number} level - The level of the sub-child elements.
     * @returns {void}
     */
    function processSubChild(
        createElement: createElementParams, fieldData: { [key: string]: Object }, fields: FieldsMapping, ds: { [key: string]: Object }[],
        options: ListBaseOptions, element: HTMLElement, level: number): void {
        // Get SubList
        const subDS: { [key: string]: Object }[] = <{ [key: string]: Object }[]>fieldData[fields.child] || [];
        let hasChildren: boolean = <boolean>fieldData[fields.hasChildren];
        //Create Sub child
        if (subDS.length) {
            hasChildren = true;
            element.classList.add(cssClass.hasChild);
            if (options.processSubChild) {
                const subLi: HTMLElement = <HTMLElement>createListFromJson(createElement, subDS, options, ++level);
                element.appendChild(subLi);
            }
        }

        // Create expand and collapse node
        if (!!options.expandCollapse && hasChildren && !options.template) {
            element.firstElementChild.classList.add(cssClass.iconWrapper);
            const expandElement: Function = options.expandIconPosition === 'Left' ? prepend : append;
            expandElement(
                [createElement('div', { className: 'e-icons ' + options.expandIconClass })],
                element.querySelector('.' + cssClass.textContent));
        }
    }
    /**
     * Generates a single-level LI (list item) element based on the provided item and field data.
     *
     * @param {Function} createElement - Function for creating elements.
     * @param {string | Object | number} item - The item data.
     * @param {Object} fieldData - Field data mapped from the item.
     * @param {FieldsMapping} [fields] - Field mappings.
     * @param {string} [className] - Optional class name to add to the created LI element.
     * @param {HTMLElement[]} [innerElements] - Optional array of inner elements to append to the LI element.
     * @param {boolean} [grpLI] - Indicates if the LI element is a group item.
     * @param {string} [id] - The ID of the LI element.
     * @param {number} [index] - The index of the LI element.
     * @param {ListBaseOptions} [options] - Optional ListBase options.
     * @returns {HTMLElement} - The generated LI element.
     */
    function generateSingleLevelLI(
        createElement: createElementParams, item: string | { [key: string]: Object } | number,
        fieldData: { [key: string]: Object }, fields?: FieldsMapping, className?: string, innerElements?: HTMLElement[],
        grpLI?: boolean, id?: string, index?: number, options?: ListBaseOptions):
        HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
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
        const li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            id: elementID, attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });
        if (dataSource && Object.prototype.hasOwnProperty.call(fieldData, fields.enabled) && fieldData[fields.enabled].toString() === 'false') {
            li.classList.add(cssClass.disabled);
        }
        if (options && options.enableHtmlSanitizer) {
            text = SanitizeHtmlHelper.sanitize(text);
        }
        if (grpLI) {
            li.innerText = text;
        } else {
            li.setAttribute('data-value', isNullOrUndefined(value) ? 'null' : value);

            li.setAttribute('role', 'option');
            if (dataSource && Object.prototype.hasOwnProperty.call(fieldData, fields.htmlAttributes) && fieldData[fields.htmlAttributes]) {
                setAttribute(li, <{ [key: string]: string }>fieldData[fields.htmlAttributes]);
            }

            if (innerElements.length && !curOpt.itemNavigable) { append(innerElements, li); }

            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                (fieldData[fields.urlAttributes] as { [key: string]: Object }).href))) {
                li.appendChild(anchorTag(createElement, dataSource, fields, text, innerElements, curOpt.itemNavigable));
            } else {
                if (innerElements.length && curOpt.itemNavigable) { append(innerElements, li); }
                li.appendChild(document.createTextNode(text));
            }
        }
        return li;
    }
    /**
     * Returns a set of CSS class names based on the provided module name.
     *
     * @param {string} moduleName - The name of the module.
     * @returns {ClassList} - The CSS class names associated with the module.
     */
    function getModuleClass(moduleName: string): ClassList {
        let moduleClass: ClassList;
        // eslint-disable-next-line
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
            iconWrapper: 'e-icon-wrapper',
            anchorWrap: 'e-anchor-wrap',
            navigable: 'e-navigable'
        };
    }
    /**
     * Creates an anchor tag (<a>) element based on the provided data source, fields, and text.
     *
     * @param {Function} createElement - Function for creating elements.
     * @param {object} dataSource - The data source containing URL-related fields.
     * @param {FieldsMapping} fields - Field mappings for the data source.
     * @param {string} text - The text content of the anchor tag.
     * @param {HTMLElement[]} innerElements - Optional array of inner elements to append to the anchor tag.
     * @param {boolean} isFullNavigation - Indicates whether the anchor tag should be for full navigation.
     * @returns {HTMLElement} The created anchor tag element.
     */
    function anchorTag(
        createElement: createElementParams, dataSource: { [key: string]: object } | { [key: string]: string },
        fields: FieldsMapping, text: string, innerElements: HTMLElement[], isFullNavigation: boolean): HTMLElement {
        const fieldData: { [key: string]: Object } = <{ [key: string]: Object }>getFieldValues(dataSource, fields);
        const attr: { [key: string]: string } = { href: <string>fieldData[fields.url] };
        if (Object.prototype.hasOwnProperty.call(fieldData, fields.urlAttributes) && fieldData[fields.urlAttributes]) {
            merge(attr, fieldData[fields.urlAttributes]);
            attr.href = <string>fieldData[fields.url] ? <string>fieldData[fields.url] :
                (fieldData[fields.urlAttributes] as { [key: string]: Object }).href as string;
        }
        let anchorTag: HTMLElement;
        if (!isFullNavigation) {
            anchorTag = createElement('a', { className: cssClass.text + ' ' + cssClass.url, innerHTML: text });
        } else {
            anchorTag = createElement('a', { className: cssClass.text + ' ' + cssClass.url });
            const anchorWrapper: HTMLElement = createElement('div', { className: cssClass.anchorWrap });
            if (innerElements && innerElements.length) {
                append(innerElements, anchorWrapper);
            }
            anchorWrapper.appendChild(document.createTextNode(text));
            append([anchorWrapper], anchorTag);
        }
        setAttribute(anchorTag, attr);
        return anchorTag;
    }
    /**
     * Generates an LI element based on the provided item and field data.
     *
     * @param {Function} createElement - Function for creating elements.
     * @param {string | Object | number} item - The item data.
     * @param {Object} fieldData - Field data mapped from the item.
     * @param {FieldsMapping} fields - Field mappings.
     * @param {string} [className] - Optional class name to add to the created LI element.
     * @param {ListBaseOptions} [options] - Optional ListBase options.
     * @param {*} [componentInstance] - Optional component instance.
     * @returns {HTMLElement} - The generated LI element.
     */
    function generateLI(
        createElement: createElementParams, item: string | { [key: string]: Object } | number, fieldData: { [key: string]: Object },
        fields: FieldsMapping, className?: string, options?: ListBaseOptions, componentInstance?: any): HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        let text: string = <string>item;
        let uID: string;
        let grpLI: boolean;
        let dataSource: { [key: string]: string } | { [key: string]: object };
        if (typeof item !== 'string' && typeof item !== 'number') {
            dataSource = <{ [key: string]: Object }>item;
            text = <string>fieldData[fields.text] || '';
            uID = (isNullOrUndefined(<string>fieldData['_id'])) ? <string>fieldData[fields.id] : <string>fieldData['_id'];
            grpLI = (Object.prototype.hasOwnProperty.call(item, 'isHeader') && (item as { isHeader: Object } & { [key: string]: Object }).isHeader)
                ? true : false;
        }
        if (options && options.enableHtmlSanitizer) {
            text = SanitizeHtmlHelper.sanitize(text);
        }
        const li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.groupItemRole !== '' && ariaAttributes.itemRole !== '' ?
                { role: (grpLI === true ? ariaAttributes.groupItemRole : ariaAttributes.itemRole) } : {})
        });

        if (!isNullOrUndefined(uID) === true) {
            li.setAttribute('data-uid', uID);
        }
        else {
            li.setAttribute('data-uid', generateId());
        }
        if (grpLI && options && options.groupTemplate) {
            const compiledString: Function = compileTemplate(options.groupTemplate);
            if (componentInstance && componentInstance.getModuleName() !== 'listview') {
                const compiledElement: HTMLElement[] = compiledString(
                    item,
                    componentInstance,
                    'groupTemplate',
                    curOpt.groupTemplateID,
                    !!curOpt.isStringTemplate,
                    null,
                    li);
                if (compiledElement) {
                    append(compiledElement, li);
                }
            } else {
                append(compiledString(item, componentInstance, 'groupTemplate', curOpt.groupTemplateID, !!curOpt.isStringTemplate), li);
            }
        } else if (!grpLI && options && options.template) {
            const compiledString: Function = compileTemplate(options.template);
            if (componentInstance && componentInstance.getModuleName() !== 'listview') {
                const compiledElement: HTMLElement[] = compiledString(
                    item,
                    componentInstance,
                    'template',
                    curOpt.templateID,
                    !!curOpt.isStringTemplate,
                    null,
                    li);
                if (compiledElement) {
                    append(compiledElement, li);
                }
            } else {
                append(compiledString(item, componentInstance, 'template', curOpt.templateID, !!curOpt.isStringTemplate), li);
            }
        } else {
            const innerDiv: HTMLElement = createElement('div', {
                className: cssClass.textContent,
                attrs: (ariaAttributes.wrapperRole !== '' ? { role: ariaAttributes.wrapperRole } : {})
            });
            if (dataSource && (fieldData[fields.url] || (fieldData[fields.urlAttributes] &&
                (fieldData[fields.urlAttributes] as { [key: string]: Object }).href))) {
                innerDiv.appendChild(anchorTag(createElement, dataSource, fields, text, null, curOpt.itemNavigable));
            } else {
                const element: HTMLElement = createElement('span', {
                    className: cssClass.text,
                    attrs: (ariaAttributes.itemText !== '' ? { role: ariaAttributes.itemText } : {})
                });
                if (options && options.enableHtmlSanitizer) {
                    element.innerText = text;
                } else {
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
     *
     * @param {Function} createElement - Function for creating elements.
     *
     * @param  {HTMLElement[]} liElement - Specifies array of LI element.
     *
     * @param  {string} [className] - Specifies class name that need to be added in UL element.
     *
     * @param  {ListBaseOptions} [options] - Specifies ListBase options.
     *
     * @returns {HTMLElement} - The created UL element.
     */
    export function generateUL(
        createElement: createElementParams, liElement: HTMLElement[], className?: string, options?: ListBaseOptions): HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        const ariaAttributes: AriaAttributesMapping = extend({}, defaultAriaAttributes, curOpt.ariaAttributes);
        cssClass = getModuleClass(curOpt.moduleName);
        const ulElement: HTMLElement = createElement('ul', {
            className: cssClass.ul + ' ' + (isNullOrUndefined(className) ? '' : className),
            attrs: (ariaAttributes.listRole !== '' ? { role: ariaAttributes.listRole } : {})
        });

        append(liElement, ulElement);

        return ulElement;
    }

    /**
     * Returns LI element with additional DIV tag based on the given LI element.
     *
     * @param {Function} createElement - Function for creating elements.
     *
     * @param  {liElement} liElement - Specifies LI element.
     *
     * @param  {string} [className] - Specifies class name that need to be added in created DIV element.
     *
     * @param  {ListBaseOptions} [options] - Specifies ListBase options.
     *
     * @returns {HTMLElement} - The modified LI element.
     */
    export function generateIcon(
        createElement: createElementParams, liElement: HTMLElement, className?: string, options?: ListBaseOptions): HTMLElement {
        const curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        cssClass = getModuleClass(curOpt.moduleName);
        const expandElement: Function = curOpt.expandIconPosition === 'Left' ? prepend : append;
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

/**
 * An interface that holds the field mappings
 */
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
    sortBy?: string

}

/**
 * An enum type that denotes the Expand Icon Position. Available options are as follows Right, Left;
 */
export type Position = 'Right' | 'Left';

/**
 * An interface that holds item aria attributes mapping
 */
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
    template?: string | Function;
    /**
     * Specifies the group header template
     */
    groupTemplate?: string | Function;
    /**
     * Specifies the ListView header template
     */
    headerTemplate?: string | Function;
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
    /**
     * Specifies the template ID
     */
    templateID?: string;
    /**
     * Specifies the groupTemplate ID
     */
    groupTemplateID?: string;
    /**
     * Force template compiler to compile as string template
     */
    isStringTemplate?: string;
    /**
     * Defines whether to allow the cross scripting site or not.
     */
    enableHtmlSanitizer?: boolean;
    /**
     * If set true to this property then the entire list will be navigate-able instead of text element
     */
    itemNavigable?: boolean;
}

/**
 * Used to get dataSource item from complex data using fields.
 *
 * @param {Object} dataItem - Specifies an  JSON or String data.
 *
 * @param {FieldsMapping} fields - Fields that are mapped from the dataSource.
 * @returns {Object|string|number} - The retrieved field values.
 */
export function getFieldValues(dataItem: { [key: string]: Object } | string | number, fields: FieldsMapping)
    : { [key: string]: Object } | string | number {
    const fieldData: { [key: string]: Object } = {};
    if (isNullOrUndefined(dataItem) || typeof (dataItem) === 'string' || typeof (dataItem) === 'number'
        || !isNullOrUndefined((<{ [key: string]: Object }>dataItem).isHeader)) {
        return dataItem;
    } else {
        for (const field of Object.keys(fields)) {
            const dataField: string = (<{ [key: string]: Object }>fields)[`${field}`] as string;
            const value: { [key: string]: Object } = !isNullOrUndefined(dataField) &&
                typeof (dataField) === 'string' ? getValue(dataField, dataItem) : undefined;
            if (!isNullOrUndefined(value)) {
                fieldData[`${dataField}`] = value;
            }
        }
    }
    return fieldData;
}
/**
 * Compiles a template string or function into a compiled function.
 *
 * @param {string | Function} template - The template string or function to compile.
 * @returns {Function | undefined} - The compiled function, or undefined if the input is false.
 */
function compileTemplate(template: string | Function): Function {
    if (template) {
        try {
            if (typeof template !== 'function' && document.querySelector(template)) {
                return compile(document.querySelector(template).innerHTML.trim());
            } else {
                return compile(template);
            }
        } catch (e) {
            return compile(template);
        }
    }
    return undefined;
}
