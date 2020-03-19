/**
 * Functions related to dom operations.
 */
import { EventHandler } from './event-handler';
import { isNullOrUndefined, getValue, setValue, isObject, extend } from './util';
import { VirtualObject, VirtualDOM } from './virtual-dom';

const SVG_REG: RegExp = /^svg|^path|^g/;

export interface ElementProperties {
    id?: string;
    className?: string;
    innerHTML?: string;
    styles?: string;
    attrs?: { [key: string]: string };
}
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
export function createElement(tagName: string, properties?: ElementProperties): HTMLElement {
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
            if (isObject(ele)) {
                let curClass: string = getValue('attributes.className', ele);
                if (isNullOrUndefined(curClass)) {
                    setValue('attributes.className', className, ele);
                } else if (!new RegExp('\\b' + className + '\\b', 'i').test(curClass)) {
                    setValue('attributes.className', curClass + ' ' + className, ele);
                }
            } else {
                if (!ele.classList.contains(className)) {
                    ele.classList.add(className);
                }
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
        let flag: boolean = isObject(ele);
        let canRemove: boolean = flag ? getValue('attributes.className', ele) : ele.className !== '';
        if (canRemove) {
            for (let className of classList) {
                if (flag) {
                    let classes: string = getValue('attributes.className', ele);
                    let classArr: string[] = classes.split(' ');
                    let index: number = classArr.indexOf(className);
                    if (index !== -1) {
                        classArr.splice(index, 1);
                    }
                    setValue('attributes.className', classArr.join(' '), ele);
                } else {
                    ele.classList.remove(className);
                }
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
export function prepend(fromElements: Element[] | NodeList, toElement: Element, isEval?: Boolean): Element[] | NodeList {
    //tslint:disable:no-any
    if (isObject(toElement)) {
        VirtualDOM.prepend(fromElements as any, toElement as any);
    } else {
        let docFrag: DocumentFragment = document.createDocumentFragment();
        for (let ele of (fromElements as Element[])) {
            docFrag.appendChild(ele);
        }
        toElement.insertBefore(docFrag, toElement.firstElementChild);
        if (isEval) {
            executeScript(toElement);
        }
    }
    return fromElements;
}

/**
 * The function used to insert an array of elements into last of the element.
 * @param  {Element[]|NodeList} fromElements - An array of elements that need to append.
 * @param  {Element} toElement - An element that is going to prepend.
 * @private
 */
export function append(fromElements: Element[] | NodeList, toElement: Element, isEval?: Boolean): Element[] | NodeList {
    if (isObject(toElement)) {
        VirtualDOM.append(fromElements as any, toElement as any);
    } else {
        let docFrag: DocumentFragment = document.createDocumentFragment();
        for (let ele of <Element[]>fromElements) {
            docFrag.appendChild(ele);
        }
        toElement.appendChild(docFrag);
        if (isEval) {
            executeScript(toElement);
        }
    }
    return fromElements;
}
//tslint: enable:no-any
/**
 * The function is used to evaluate script from Ajax request
 * @param ele - An element is going to evaluate the script
 */

function executeScript(ele: Element): void {
    let eleArray: NodeList = ele.querySelectorAll('script');
    eleArray.forEach((element: Element) => {
        let script: HTMLScriptElement = document.createElement('script');
        script.text = element.innerHTML;
        document.head.appendChild(script);
        detach(script);
    });
}

/**
 * The function used to remove the element from the 
 * @param  {Element|Node|HTMLElement} element - An element that is going to detach from the Dom
 * @private
 */
export function detach(element: Element | Node | HTMLElement): Element {
    if (isObject(element)) {
        return VirtualDOM.detach(element as any) as any;
    } else {
        let parentNode: Node = element.parentNode;
        return <Element>parentNode.removeChild(element);
    }

}
/**
 * The function used to remove the element from Dom also clear the bounded events
 * @param  {Element|Node|HTMLElement} element - An element remove from the Dom
 * @private
 */
export function remove(element: Element | Node | HTMLElement): void {
    if (isObject(element)) {
        VirtualDOM.detach(element as any) as any;
    } else {
        let parentNode: Node = element.parentNode;
        EventHandler.clearEvents(<Element>element);
        parentNode.removeChild(element);
    }
}

/**
 * The function helps to set multiple attributes to an element
 * @param  {Element|Node} element - An element that need to set attributes.
 * @param  {{[key:string]:string}} attributes - JSON Object that is going to as attributes.
 * @private
 */
export function attributes(element: Element | Node | any, attributes: { [key: string]: string }): Element {
    let keys: string[] = Object.keys(attributes);
    let ele: Element = <Element>element;
    for (let key of keys) {
        if (isObject(ele)) {
            let iKey: string = key;
            if (key === 'tabindex') {
                iKey = 'tabIndex';
            }
            ele.attributes[iKey] = attributes[key];
        } else {
            ele.setAttribute(key, attributes[key]);
        }
    }
    return ele;
}

/**
 * The function selects the element from giving context. 
 * @param  {string} selector - Selector string need fetch element from the 
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
//tslint:disable-next-line
export function select(selector: string, context: Document | Element = document, needsVDOM?: boolean): any {
    if (isObject(context) && needsVDOM) {
        //tslint:disable-next-line
        return VirtualDOM.vDomSelector({ ele: (context as any), selector, selectAll: false });
    } else {
        return context.querySelector(selector);
    }
}

/**
 * The function selects an array of element from the given context.
 * @param  {string} selector - Selector string need fetch element from the 
 * @param  {Document|Element=document} context - It is an optional type, That specifies a Dom context.
 * @private
 */
export function selectAll(selector: string, context: Document | Element = document, needsVDOM?: boolean): HTMLElement[] {
    if (isObject(context) && !needsVDOM) {
        //tslint:disable-next-line
        return VirtualDOM.vDomSelector({ ele: (context as any), selector, selectAll: true }) as any;
    } else {
        let nodeList: NodeList = context.querySelectorAll(selector);
        return <HTMLElement[] & NodeList>nodeList;
    }
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
    let attrVal: string;
    let isObj: boolean = isObject(element);
    if (isObj) {
        attrVal = getValue('attributes.' + property, element);
    } else {
        attrVal = element.getAttribute(property);
    }
    if (isNullOrUndefined(attrVal) && value) {
        if (!isObj) {
            element.setAttribute(property, value.toString());
        } else {
            element.attributes[property] = value;
        }
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
        if (isObject(element)) {
            // tslint:disable-next-line:no-any
            VirtualDOM.setStyleAttribute(element as any, attrs);
        } else {
            Object.keys(attrs).forEach((key: string) => {
                // tslint:disable-next-line:no-any
                (<any>element).style[key] = attrs[key];
            });
        }
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
    //tslint:disable-next-line
    let matches: Function = element.matches || (element as any).msMatchesSelector || element.webkitMatchesSelector;
    if (matches) {
        return matches.call(element, selector);
    } else {
        return [].indexOf.call(document.querySelectorAll(selector), element) !== -1;
    }
}

export function includeInnerHTML(ele: HTMLElement & VirtualObject, innerHTML: string): void {
    if (isObject(ele)) {
        if (innerHTML === '') {
            (ele as VirtualObject).children = [];
        } else {
            let res: VirtualObject[] = VirtualDOM.ConvertHTMLToJSon(innerHTML);
            if (res.length) {
                VirtualDOM.assignParent(res, ele);
                (ele as VirtualObject).children = res;
            }
        }
    } else {
        ele.innerHTML = innerHTML;
    }
}
//tslint:disable-next-line
export function containsClass(ele: HTMLElement & VirtualObject, className: string): any {
    if (isObject(ele)) {
        // tslint:disable-next-line:no-any
        return new RegExp('\\b' + className + '\\b', 'i').test((ele as any).attributes.className);
    } else {
        return ele.classList.contains(className);
    }
}
/**
 * Method to check whether the element matches the given selector.
 * @param {} element - Element to compare with the selector.
 * @param {string} selector - String selector which element will satisfy.
 * @return {Element | VirtualObject} 
 * @private
 */
//tslint:disable:no-any
export function cloneNode(element: Object, deep?: boolean): any {
    if (isObject(element)) {
        if (deep) {
            return extend({}, {}, element, true);
        } else {
            return { tagName: (element as VirtualObject).tagName, attributes: (element as VirtualObject).attributes };
        }
    } else {
        return (element as HTMLElement).cloneNode(deep);
    }
}
