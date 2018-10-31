export type HightLightType = 'Contains' | 'StartsWith' | 'EndsWith';
/**
 * Function helps to find which highlightSearch is to call based on your data.
 * @param  {HTMLElement} element - Specifies an li element.
 * @param  {string} query - Specifies the string to be highlighted.
 * @param  {boolean} ignoreCase - Specifies the ignoreCase option.
 * @param  {HightLightType} type - Specifies the type of highlight.
 */
export function highlightSearch(element: HTMLElement, query: string, ignoreCase: boolean, type?: HightLightType): void {
  if (query === '') {
    return;
  } else {
    let ignoreRegex: string = ignoreCase ? 'gim' : 'gm';
    query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    let replaceQuery: string = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
    findTextNode(element, new RegExp(replaceQuery, ignoreRegex));
  }
}

function findTextNode(element: HTMLElement, pattern: RegExp): void {
  for (let index: number = 0; element.childNodes && (index < element.childNodes.length); index++) {
    if (element.childNodes[index].nodeType === 3) {
      element.innerHTML = element.innerHTML.replace(pattern, '<span class="e-highlight">$1</span>');
      break;
    } else {
      findTextNode(element.childNodes[index] as HTMLElement, pattern);
    }
  }
}

/**
 * Function helps to remove highlighted element based on your data.
 * @param  {HTMLElement} content - Specifies an content element.
 */
export function revertHighlightSearch(content: HTMLElement): void {
  let contentElement: NodeListOf<Element> = content.querySelectorAll('.e-highlight');
  for (let i: number = contentElement.length - 1; i >= 0; i--) {
    let parent: Node = contentElement[i].parentNode;
    let text: Text = document.createTextNode(contentElement[i].textContent);
    parent.replaceChild(text, contentElement[i]);
  }
}