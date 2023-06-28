/**
 * IncrementalSearch module file
 */

let queryString: string = '';
let prevString: string = '';
let matches: Element[] = [];
const activeClass: string = 'e-active';
let prevElementId: string = '';
export type SearchType = 'StartsWith' | 'Equal' | 'EndsWith' | 'Contains';
/**
 * Search and focus the list item based on key code matches with list text content
 *
 * @param  { number } keyCode - Specifies the key code which pressed on keyboard events.
 * @param  { HTMLElement[]} items - Specifies an array of HTMLElement, from which matches find has done.
 * @param { number } selectedIndex - Specifies the selected item in list item, so that search will happen
 * after selected item otherwise it will do from initial.
 * @param  { boolean } ignoreCase - Specifies the case consideration when search has done.
 * @param {string} elementId - Specifies the list element ID.
 * @returns {Element} Returns list item based on key code matches with list text content.
 */
export function incrementalSearch(
    keyCode: number, items: HTMLElement[], selectedIndex: number, ignoreCase: boolean, elementId: string): Element {
    queryString += String.fromCharCode(keyCode);
    setTimeout(() => {
        queryString = '';
    }, 1000);
    let index: number;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevElementId === elementId && prevString === queryString) {
        for (let i: number = 0; i < matches.length; i++) {
            if (matches[i as number].classList.contains(activeClass)) {
                index = i; break;
            }
        }
        index = index + 1;
        return matches[index as number] ? matches[index as number] : matches[0];
    } else {
        const listItems: Element[] = items;
        const strLength: number = queryString.length;
        let text: string;
        let item: HTMLElement;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        let i: number = selectedIndex;
        matches = [];
        do {
            if (i === listItems.length) {
                i = -1;
            }
            if (i === -1) {
                index = 0;
            } else {
                index = i;
            }
            item = listItems[index as number] as HTMLElement;
            text = ignoreCase ? item.innerText.toLowerCase() : item.innerText;
            if (text.substr(0, strLength) === queryString) {
                matches.push(listItems[index as number]);
            }
            i++;
        } while (i !== selectedIndex);
        prevString = queryString;
        prevElementId = elementId;
        return matches[0];
    }
}

/**
 * Search the list item based on given input value matches with search type.
 *
 * @param {string} inputVal - Specifies the given input value.
 * @param {HTMLElement[]} items - Specifies the list items.
 * @param {SearchType} searchType - Specifies the filter type.
 * @param {boolean} ignoreCase - Specifies the case sensitive option for search operation.
 * @returns {Element | number} Returns the search matched items.
 */
export function Search(
    inputVal: string, items: HTMLElement[], searchType: SearchType, ignoreCase?: boolean, dataSource?: string[] | number[] | boolean[] | {
        [key: string]: Object
    }[], fields?: any, type?: string): { [key: string]: Element | number } {
    const listItems: HTMLElement[] = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    const itemData: { [key: string]: Element | number } = { item: null, index: null };
    if (inputVal && inputVal.length) {
        const strLength: number = inputVal.length;
        let queryStr: string = ignoreCase ? inputVal.toLocaleLowerCase() : inputVal;
        queryStr = escapeCharRegExp(queryStr);
        for (let i: number = 0, itemsData: Element[] = listItems; i < itemsData.length; i++) {
            const item: Element = itemsData[i as number];
            let text: string;
            let filterValue: string;
            if (items && dataSource) {
                let checkField: Element = item;
                let fieldValue = fields.text.split('.');
                (dataSource as { [key: string]: Object }[]).filter(function (data: any) {
                    Array.prototype.slice.call(fieldValue).forEach(function (value: string | number) {
                        /* eslint-disable security/detect-object-injection */
                        if (type === 'object' && (!data.isHeader && checkField.textContent.toString().indexOf(data[value]) !== -1) && checkField.getAttribute('data-value') === data[fields.value].toString() || type === 'string' && checkField.textContent.toString().indexOf(data) !== -1) {
                            filterValue = type === 'object' ? data[value] : data;
                        }
                    });
                })
            }
            text = dataSource && filterValue ? (ignoreCase ? filterValue.toLocaleLowerCase() : filterValue).replace(/^\s+|\s+$/g, '') : (ignoreCase ? item.textContent.toLocaleLowerCase() : item.textContent).replace(/^\s+|\s+$/g, '');
            /* eslint-disable security/detect-non-literal-regexp */
            if ((searchType === 'Equal' && text === queryStr) || (searchType === 'StartsWith' && text.substr(0, strLength) === queryStr) || (searchType === 'EndsWith' && text.substr(text.length - queryStr.length) === queryStr) || (searchType === 'Contains' && new RegExp(queryStr, "g").test(text))) {
                itemData.item = item;
                itemData.index = i;
                return { item: item, index: i };
            }
        }
        return itemData;
        /* eslint-enable security/detect-non-literal-regexp */

    }
    return itemData;
}
/* eslint-enable security/detect-object-injection */

export function escapeCharRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function resetIncrementalSearchValues(elementId: string): void {
    if (prevElementId === elementId) {
        prevElementId = '';
        prevString = '';
        queryString = '';
        matches = [];
    }
}