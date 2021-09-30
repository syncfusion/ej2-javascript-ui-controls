/**
 * IncrementalSearch module file
 */

let queryString: string = '';
let prevString: string = '';
let matches: Element[] = [];
const activeClass: string = 'e-active';
let prevElementId: string = '';
export type SearchType = 'StartsWith' | 'Equal';
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
            if (matches[i].classList.contains(activeClass)) {
                index = i; break;
            }
        }
        index = index + 1;
        return matches[index] ? matches[index] : matches[0];
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
            item = listItems[index] as HTMLElement;
            text = ignoreCase ? item.innerText.toLowerCase() : item.innerText;
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
    inputVal: string, items: HTMLElement[], searchType: SearchType, ignoreCase?: boolean): { [key: string]: Element | number } {
    const listItems: Element[] = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    const itemData: { [key: string]: Element | number } = { item: null, index: null };
    if (inputVal && inputVal.length) {
        const strLength: number = inputVal.length;
        const queryStr: string = ignoreCase ? inputVal.toLocaleLowerCase() : inputVal;
        for (let i: number = 0, itemsData: Element[] = listItems; i < itemsData.length; i++) {
            const item: Element = itemsData[i];
            const text: string = (ignoreCase ? item.textContent.toLocaleLowerCase() : item.textContent).replace(/^\s+|\s+$/g, '');
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

export function resetIncrementalSearchValues(elementId: string) : void {
    if (prevElementId === elementId) {
        prevElementId = '';
        prevString = '';
        queryString = '';
        matches = [];
    }
}