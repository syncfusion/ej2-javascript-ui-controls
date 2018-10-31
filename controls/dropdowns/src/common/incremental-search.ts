
/**
 * IncrementalSearch module file
 */

let queryString: string = '';
let prevString: string = '';
let matches: Element[] = [];
let activeClass: string = 'e-active';
export type SearchType = 'StartsWith' | 'Equal';
/**
 * Search and focus the list item based on key code matches with list text content 
 * @param  { number } keyCode - Specifies the key code which pressed on keyboard events.
 * @param  { HTMLElement[]] } items - Specifies an array of HTMLElement, from which matches find has done.
 * @param { number } selectedIndex - Specifies the selected item in list item, so that search will happen
 * after selected item otherwise it will do from initial.
 * @param  { boolean } ignoreCase - Specifies the case consideration when search has done.
 */

export function incrementalSearch(keyCode: number, items: HTMLElement[], selectedIndex: number, ignoreCase: boolean): Element {
    queryString += String.fromCharCode(keyCode);
    setTimeout(() => { queryString = ''; }, 1000);
    let index: number;
    queryString = ignoreCase ? queryString.toLowerCase() : queryString;
    if (prevString === queryString) {
        for (let i: number = 0; i < matches.length; i++) {
            if (matches[i].classList.contains(activeClass)) { index = i; break; }
        }
        index = index + 1;
        return matches[index];
    } else {
        let listItems: Element[] = items;
        let strLength: number = queryString.length;
        let text: string;
        let item: HTMLElement;
        selectedIndex = selectedIndex ? selectedIndex + 1 : 0;
        let i: number = selectedIndex;
        matches = [];
        do {
            if (i === listItems.length) { i = -1; }
            i === -1 ? index = 0 : index = i;
            item = listItems[index] as HTMLElement;
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

export function Search(
    inputVal: string, items: HTMLElement[], searchType: SearchType, ignoreCase?: boolean): { [key: string]: Element | number } {
    let listItems: Element[] = items;
    ignoreCase = ignoreCase !== undefined && ignoreCase !== null ? ignoreCase : true;
    let itemData: { [key: string]: Element | number } = { item: null, index: null };
    if (inputVal.length) {
        let strLength: number = inputVal.length;
        let queryStr: string = ignoreCase ? inputVal.toLocaleLowerCase() : inputVal;
        for (let i: number = 0, itemsData: Element[] = listItems; i < itemsData.length; i++) {
            let item: Element = itemsData[i];
            let text: string = (ignoreCase ? item.textContent.toLocaleLowerCase() : item.textContent).replace(/^\s+|\s+$/g, '');
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