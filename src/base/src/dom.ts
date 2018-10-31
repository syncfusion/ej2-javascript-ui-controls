/**
 * Functions related to dom operations.
 */
import { EventHandler } from './event-handler';
import { isNullOrUndefined } from './util';

const SVG_REG: RegExp = /^svg|^path|^g/;

/**
 * Function to create Html element.
 * @param tagName - Name of the tag, id and class names.
 * @param properties - Object to set properties in the element. 
 * @param properties.id - To set the id to the created element.
 * @param properties.className - To add classes to the element.
 * @param properties.innerHTML - To set the innerHTML to element.
 * @param properties.styles - To set the some custom styles to element.
 * @param properties.attrs - To set the attributes to element.
 * @private
 */
export function createElement(tagName: string, properties?:
    { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }): HTMLElement {
    //tslint:disable-next-line
    let element: Element = (SVG_REG.test(tagName) ? document.createElementNS('http://www.w3.org/2000/svg', tagName) : document.createElement(tagName));
    if (typeof (properties) === 'undefined') {
        return <HTMLElement>element;
    }
    element.innerHTML = (properties.innerHTML ? properties.innerHTML : '');

    if (properties.className !== undefined) {
        element.className = properties.className;
    }
    if (properties.id !== undefined) {
        element.id = properties.id;
    }
    if (properties.styles !== undefined) {
        element.setAttribute('style', properties.styles);
    }
    if (properties.attrs !== undefined) {
        attributes(element, properties.attrs);
    }
    return <HTMLElement>element;
}

/**
 * The function used to add the classes to array of elements
 * @param  {Element[]|NodeList} elements - An array of elements that need to add a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 * @private
 */
export function addClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
    let classList: string[] = getClassList(classes);
    for (let ele of (elements as Element[])) {
        for (let className of classList) {
            if (!ele.classList.contains(className)) {
                ele.classList.add(className);
            }
        }
    }
    return elements;
}

/**
 * The function used to add the classes to array of elements
 * @param  {Element[]|NodeList} elements - An array of elements that need to remove a list of classes
 * @param  {string|string[]} classes - String or array of string that need to add an individual element as a class
 * @private
 */
export function removeClass(elements: Element[] | NodeList, classes: string | string[]): Element[] | NodeList {
    let classList: string[] = getClassList(classes);
    for (let ele of (elements as Element[])) {
        if (ele.className !== '') {
            for (let className of classList) {
                ele.classList.remove(className);
            }
        }
    }
    return elements;
}

function getClassList(classes: string | string[]): string[] {
    let classList: string[] = [];
    if (typeof classes === 'string') {
        classList.push(classes);
    } else {
        classList = classes;
    }
    return classList;
}

/**
 * The function used to check element is visible or not.
 * @param  {Element|Node} element - An element the need to check visibility
 * @private
 */
export function isVisible(element: Element | Node): Boolean {
    let ele: HTMLElement = <HTMLElement>element;
    return (ele.style.visibility === '' && ele.offsetWidth > 0);
}

/**
 * The function used to insert an array of elements into a first of the element.
 * @param  {Element[]|NodeList} fromElements - An array of elements that need to prepend.
 * @param  {Element} toElement - An element that is going to prepend.
 * @private
 */
export function prepend(fromElements: Element[] | NodeList, toElement: Element): Element[] | NodeList {
    let docFrag: DocumentFragment = document.createDocumentFragment();
    for (let ele of (fromElements as Element[])) {
        docFrag.appendChild(ele);
    }
    toElement.insertBefore(docFrag, toElement.firstElementChild);
    return fromElements;
}

/**
 * The function used to insert an array of elements into last of the element.
 * @param  {Element[]|NodeList} fromElements - An array of elements that need to append.
 * @param  {Element} toElement - An element that is going to prepend.
 * @private
 */
export function append(fromElements: Element[] | NodeList, toElement: Element): Element[] | NodeList {
    let docFrag: DocumentFragment = document.createDocumentFragment();
    for (let ele of <Element[]>fromElements) {
        docFrag.appendChild(ele);
    }
    toElement.appendChild(docFrag);
    return fromElements;
}

/**
 * The function used to remove the element from the 
 * @param  {Element|Node|HTMLElement} element - An element that is going to detach from the Dom
 * @private
 */
export function detach(element: Element | Node | HTMLElement): Element {
    let parentNode: Node = element.parentNode;
    return <Element>parentNode.removeChild(element);
}

/**
 * The function used to remove the element from Dom also clear the bounded events
 * @param  {Element|Node|HTMLElement} element - An element remove from the Dom
 * @private
 */
export function remove(element: Element | Node | HTMLElement): void {
    let parentNode: Node = element.parentNode;
    EventHandler.clearEvents(<Element>element);
    parentNode.removeChild(element);
}

/**
 * The function helps to set multiple attributes to an element
 * @param  {Element|Node} element - An element that need to set attributes.
 * @param  {{[key:string]:string}} attributes - JSON Object that is going to as attributes.
 * @private
 */
export function attributes(element: Element | Node, attributes: { [key: string]: string }): Element {
    let keys: string[] = Object.keys(attributes);
    let ele: Element = <Element>element;
    for (let key of keys) {
        ele.setAttribute(key, attributes[key]);
    }
    return ele;
}

/**
 * The function selects the element from giving context. 
 * @param  {string} selector - Selector string need fetch element from the 
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
export function select(selector: string, context: Document | Element = document): Element {
    return context.querySelector(selector);
}

/**
 * The function selects an array of element from the given context.
 * @param  {string} selector - Selector string need fetch element from the 
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
export function selectAll(selector: string, context: Document | Element = document): HTMLElement[] {
    let nodeList: NodeList = context.querySelectorAll(selector);
    return <HTMLElement[] & NodeList>nodeList;
}

/**
 * Returns single closest parent element based on class selector.
 * @param  {Element} element - An element that need to find the closest element.
 * @param  {string} selector - A classSelector of closest element.
 * @private
 */
export function closest(element: Element | Node, selector: string): Element {
    let el: Element = <Element>element;
    if (typeof el.closest === 'function') {
        return el.closest(selector);
    }

    while (el && el.nodeType === 1) {
        if (matches(el, selector)) {
            return el;
        }

        el = <Element>el.parentNode;
    }

    return null;
}

/**
 * Returns all sibling elements of the given element.
 * @param  {Element|Node} element - An element that need to get siblings.
 * @private
 */
export function siblings(element: Element | Node): Element[] {
    let siblings: Element[] = [];
    let childNodes: Node[] = Array.prototype.slice.call(element.parentNode.childNodes);
    for (let curNode of childNodes) {
        if (curNode.nodeType === Node.ELEMENT_NODE && element !== curNode) {
            siblings.push(<Element>curNode);
        }
    }
    return <Element[]>siblings;
}

/**
 * set the value if not exist. Otherwise set the existing value
 * @param  {HTMLElement} element - An element to which we need to set value.
 * @param  {string} property - Property need to get or set.
 * @param  {string} value - value need to set.
 * @private
 */
export function getAttributeOrDefault(element: HTMLElement, property: string, value: string): string {
    let attrVal: string = element.getAttribute(property);
    if (isNullOrUndefined(attrVal)) {
        element.setAttribute(property, value.toString());
        attrVal = value;
    }
    return attrVal;
}

/**
 * Set the style attributes to Html element.
 * @param {HTMLElement} element - Element which we want to set attributes
 * @param {any} attrs - Set the given attributes to element
 * @return {void}
 * @private
 */
export function setStyleAttribute(element: HTMLElement, attrs: { [key: string]: Object }): void {
    if (attrs !== undefined) {
        Object.keys(attrs).forEach((key: string) => {
            // tslint:disable-next-line:no-any
            (<any>element).style[key] = attrs[key];
        });
    }
}

/**
 * Method for add and remove classes to a dom element.
 * @param {Element} element - Element for add and remove classes
 * @param {string[]} addClasses - List of classes need to be add to the element
 * @param {string[]} removeClasses - List of classes need to be remove from the element
 * @return {void}
 * @private
 */
export function classList(element: Element, addClasses: string[], removeClasses: string[]): void {
    addClass([element], addClasses);
    removeClass([element], removeClasses);
}
/**
 * Method to check whether the element matches the given selector.
 * @param {Element} element - Element to compare with the selector.
 * @param {string} selector - String selector which element will satisfy.
 * @return {void} 
 * @private
 */
export function matches(element: Element, selector: string): boolean {
    let matches: Function = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    if (matches) {
        return matches.call(element, selector);
    } else {
        return [].indexOf.call(document.querySelectorAll(selector), element) !== -1;
    }
}
