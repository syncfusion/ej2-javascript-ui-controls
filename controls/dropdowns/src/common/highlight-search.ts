export type HightLightType = 'Contains' | 'StartsWith' | 'EndsWith';
/* eslint-disable jsdoc/require-param, valid-jsdoc */
/**
 * Function helps to find which highlightSearch is to call based on your data.
 *
 * @param  {HTMLElement} element - Specifies an li element.
 * @param  {string} query - Specifies the string to be highlighted.
 * @param  {boolean} ignoreCase - Specifies the ignoreCase option.
 * @param  {HightLightType} type - Specifies the type of highlight.
 * @returns {void}
 */
export function highlightSearch(element: HTMLElement, query: string, ignoreCase: boolean, type?: HightLightType, isBlazor?: boolean): void {
    if (query === '') {
        return;
    } else {
        const ignoreRegex: string = ignoreCase ? 'gim' : 'gm';
        // eslint-disable-next-line
        query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        const replaceQuery: string = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ?
            '(' + query + ')$' : '(' + query + ')';
        findTextNode(element, new RegExp(replaceQuery, ignoreRegex), isBlazor);
    }
}
/* eslint-enable jsdoc/require-param, valid-jsdoc */
/**
 *
 * @param {HTMLElement} element - Specifies the element.
 * @param {RegExp} pattern - Specifies the regex to match the searched text.
 * @param {boolean} isBlazor - Specifies the platform is Blazor or not.
 * @returns {void}
 */
function findTextNode(element: HTMLElement, pattern: RegExp, isBlazor?: boolean): void {
    for (let index: number = 0; element.childNodes && (index < element.childNodes.length); index++) {
        if (element.childNodes[index].nodeType === 3 && element.childNodes[index].textContent.trim() !== '') {
            element = (isBlazor && element.classList.contains('e-highlight')) ? element.parentElement : element;
            if (isBlazor && element.getAttribute('data-value')) {
                element.innerHTML = element.getAttribute('data-value').replace(pattern, '<span class="e-highlight">$1</span>');
            } else {
                const value: string = element.childNodes[index].nodeValue.trim().replace(pattern, '<span class="e-highlight">$1</span>');
                element.childNodes[index].nodeValue = '';
                element.innerHTML = element.innerHTML.trim() + value;
            }
            break;
        } else {
            findTextNode(element.childNodes[index] as HTMLElement, pattern, isBlazor);
        }
    }
}

/**
 * Function helps to remove highlighted element based on your data.
 *
 * @param  {HTMLElement} content - Specifies an content element.
 * @returns {void}
 */
export function revertHighlightSearch(content: HTMLElement): void {
    const contentElement: NodeListOf<Element> = content.querySelectorAll('.e-highlight');
    for (let i: number = contentElement.length - 1; i >= 0; i--) {
        const parent: Node = contentElement[i].parentNode;
        const text: Text = document.createTextNode(contentElement[i].textContent);
        parent.replaceChild(text, contentElement[i]);
    }
}
