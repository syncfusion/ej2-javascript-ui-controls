/**
 * Common utility methods
 */
export interface IKeyValue extends CSSStyleDeclaration {
    // eslint-disable-next-line
    [key: string]: any;
}
const instances: string = 'ej2_instances';
declare let window: {
    msCrypto: Crypto;
} & Window;
let uid: number = 0;
let isBlazorPlatform: boolean = false;

/**
 * Function to check whether the platform is blazor or not.
 *
 * @returns {void} result
 * @private
 */
export function disableBlazorMode(): void {
    isBlazorPlatform = false;
}

/**
 * Create Instance from constructor function with desired parameters.
 *
 * @param {Function} classFunction - Class function to which need to create instance
 * @param {any[]} params - Parameters need to passed while creating instance
 * @returns {any} ?
 * @private
 */
// eslint-disable-next-line
export function createInstance(classFunction: Function, params: any[]): any {
    const arrayParam: Object[] = params;
    arrayParam.unshift(undefined);
    return new (Function.prototype.bind.apply(classFunction, arrayParam));
}

/**
 * To run a callback function immediately after the browser has completed other operations.
 *
 * @param {Function} handler - callback function to be triggered.
 * @returns {Function} ?
 * @private
 */
export function setImmediate(handler: Function): Function {
    let unbind: Function;
    // eslint-disable-next-line
    const num: any = new Uint16Array(5);
    const intCrypto: Crypto = window.msCrypto || window.crypto;
    intCrypto.getRandomValues(num);
    let secret: string = 'ej2' + combineArray(num);
    // eslint-disable-next-line
    let messageHandler: Function = (event: any): void => {
        if (event.source === window && typeof event.data === 'string' && event.data.length <= 32 && event.data === secret) {
            handler();
            unbind();
        }
    };
    window.addEventListener('message', <EventListener>messageHandler, false);
    window.postMessage(secret, '*');
    return unbind = () => {
        window.removeEventListener('message', <EventListener>messageHandler);
        handler = messageHandler = secret = undefined;
    };
}
/**
 * To get nameSpace value from the desired object.
 *
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} obj - Object to get the inner object value.
 * @returns {any} ?
 * @private
 */
// eslint-disable-next-line
export function getValue(nameSpace: string, obj: any): any {
    // eslint-disable-next-line
    let value: any = obj;
    const splits: string[] =  nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');

    for (let i: number = 0; i < splits.length && !isUndefined(value); i++) {
        value = value[splits[parseInt(i.toString(), 10)]];
    }
    return value;
}
/**
 * To set value for the nameSpace in desired object.
 *
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} value - Value that you need to set.
 * @param {any} obj - Object to get the inner object value.
 * @returns {any} ?
 * @private
 */
// eslint-disable-next-line
export function setValue(nameSpace: string, value: any, obj: any): any {
    const keys: string[] =  nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    // eslint-disable-next-line
    const start: any = obj || {};
    // eslint-disable-next-line
    let fromObj: any = start;
    let i: number;
    const length: number = keys.length;
    let key: string;

    for (i = 0; i < length; i++) {
        key = keys[parseInt(i.toString(), 10)];

        if (i + 1 === length) {
            fromObj[`${key}`] = value === undefined ? {} : value;
        } else if (isNullOrUndefined(fromObj[`${key}`])) {
            fromObj[`${key}`] = {};
        }

        fromObj = fromObj[`${key}`];
    }

    return start;
}
/**
 * Delete an item from Object
 *
 * @param {any} obj - Object in which we need to delete an item.
 * @param {string} key - String value to the get the inner object
 * @returns {void} ?
 * @private
 */
// eslint-disable-next-line
export function deleteObject(obj: any, key: string): void {
    delete obj[`${key}`];
}
/**
 *@private
 */
// eslint-disable-next-line
export const containerObject: any = typeof window !== 'undefined' ? window : {};
/**
 * Check weather the given argument is only object.
 *
 * @param {any} obj - Object which is need to check.
 * @returns {boolean} ?
 * @private
 */
// eslint-disable-next-line
export function isObject(obj: any): boolean {
    const objCon: {} = {};
    return (!isNullOrUndefined(obj) && obj.constructor === objCon.constructor);
}
/**
 * To get enum value by giving the string.
 *
 * @param {any} enumObject - Enum object.
 * @param {string} enumValue - Enum value to be searched
 * @returns {any} ?
 * @private
 */
// eslint-disable-next-line
export function getEnumValue(enumObject: any, enumValue: string | number): any {
    // eslint-disable-next-line
    return (<any>enumObject[enumValue]);
}
/**
 * Merge the source object into destination object.
 *
 * @param {any} source - source object which is going to merge with destination object
 * @param {any} destination - object need to be merged
 * @returns {void} ?
 * @private
 */
export function merge(source: Object, destination: Object): void {
    if (!isNullOrUndefined(destination)) {
        const temrObj: IKeyValue = source as IKeyValue;
        const tempProp: IKeyValue = destination as IKeyValue;
        const keys: string[] = Object.keys(destination);
        const deepmerge: string = 'deepMerge';
        for (const key of keys) {
            if (!isNullOrUndefined(temrObj[`${deepmerge}`]) && (temrObj[`${deepmerge}`].indexOf(key) !== -1) &&
                (isObject(tempProp[`${key}`]) || Array.isArray(tempProp[`${key}`]))) {
                extend(temrObj[`${key}`], temrObj[`${key}`], tempProp[`${key}`], true);
            } else {
                temrObj[`${key}`] = tempProp[`${key}`];
            }
        }
    }
}
/**
 * Extend the two object with newer one.
 *
 * @param {any} copied - Resultant object after merged
 * @param {Object} first - First object need to merge
 * @param {Object} second - Second object need to merge
 * @param {boolean} deep ?
 * @returns {Object} ?
 * @private
 */
export function extend(copied: Object, first: Object, second?: Object, deep?: boolean): Object {
    const result: IKeyValue = copied && typeof copied === 'object' ? copied as IKeyValue : {} as IKeyValue;
    let length: number = arguments.length;
    if (deep) {
        length = length - 1;
    }
    for (let i: number = 1; i < length; i++) {
        // eslint-disable-next-line
        if (!arguments[i]) {
            continue;
        }
        // eslint-disable-next-line
        let obj1: { [key: string]: Object } = arguments[i];
        Object.keys(obj1).forEach((key: string) => {
            const src: Object = result[`${key}`];
            const copy: Object = obj1[`${key}`];
            let clone: Object;
            const isArrayChanged: boolean = Array.isArray(copy) && Array.isArray(src) && (copy.length !== src.length);
            // eslint-disable-next-line
            const blazorEventExtend: any = isBlazor() ? (!(src instanceof Event) && !isArrayChanged) : true;
            if (deep && blazorEventExtend && (isObject(copy) || Array.isArray(copy))) {
                if (isObject(copy)) {
                    clone = src ? src : {};
                    // eslint-disable-next-line
                    if (Array.isArray(clone) && clone.hasOwnProperty('isComplexArray')) {
                        extend(clone, {}, copy, deep);
                    } else {
                        result[`${key}`] = extend(clone, {}, copy, deep);
                    }
                } else {
                    /* istanbul ignore next */
                    clone = isBlazor() ? src && Object.keys(copy).length : src ? src : [];
                    // eslint-disable-next-line
                    result[`${key}`] = extend([], clone, copy, (clone && (clone as any).length) || (copy && (copy as any).length));
                }
            } else {
                result[`${key}`] = copy;
            }
        });
    }
    return result;
}
/**
 * To check whether the object is null or undefined.
 *
 * @param {Object} value - To check the object is null or undefined
 * @returns {boolean} ?
 * @private
 */
export function isNullOrUndefined(value: Object): boolean {
    return value === undefined || value === null;
}
/**
 * To check whether the object is undefined.
 *
 * @param {Object} value - To check the object is undefined
 * @returns {boolean} ?
 * @private
 */
export function isUndefined(value: Object): boolean {
    return ('undefined' === typeof value);
}
/**
 * To return the generated unique name
 *
 * @param {string} definedName - To concatenate the unique id to provided name
 * @returns {string} ?
 * @private
 */
export function getUniqueID(definedName?: string): string {
    return definedName + '_' + uid++;
}
/**
 * It limits the rate at which a function can fire. The function will fire only once every provided second instead of as quickly.
 *
 * @param {Function} eventFunction - Specifies the function to run when the event occurs
 * @param {number} delay - A number that specifies the milliseconds for function delay call option
 * @returns {Function} ?
 * @private
 */
export function debounce(eventFunction: Function, delay: number): Function {
    // eslint-disable-next-line
    let out: any;
    return function (): void {
        // eslint-disable-next-line
        const args: Object = arguments;
        const later: TimeoutHandler = () => {
            out = null;
            return eventFunction.apply(this, args);
        };
        clearTimeout(out);
        out = setTimeout(later, delay);
    };
}

/**
 * To convert the object to string for query url
 *
 * @param  {Object} data ?
 * @returns {string} ?
 * @private
 */
// eslint-disable-next-line
export function queryParams(data: any): string {
    const array: string[] = [];
    const keys: string[] = Object.keys(data);
    for (const key of keys) {
        array.push(encodeURIComponent(key) + '=' + encodeURIComponent('' + data[`${key}`]));
    }
    return array.join('&');
}
/**
 * To check whether the given array contains object.
 *
 * @param {any} value - Specifies the T type array to be checked.
 * @returns {boolean} ?
 * @private
 */
export function isObjectArray<T>(value: T[]): boolean {
    const parser: Function = Object.prototype.toString;
    if (parser.call(value) === '[object Array]') {
        if (parser.call(value[0]) === '[object Object]') {
            return true;
        }
    }
    return false;
}
/**
 * To check whether the  child element is descendant to parent element or parent and child are same element.
 *
 * @param {Element} child - Specifies the child element to compare with parent.
 * @param {Element} parent - Specifies the parent element.
 * @returns {boolean} ?
 * @private
 */
export function compareElementParent(child: Element, parent: Element): boolean {
    const node: Node = child;
    if (node === parent) {
        return true;
    } else if (node === document || !node) {
        return false;
    } else {
        return compareElementParent(<Element>node.parentNode, parent);
    }
}
/**
 * To throw custom error message.
 *
 * @param {string} message - Specifies the error message to be thrown.
 * @returns {void} ?
 * @private
 */
export function throwError(message: string): void {
    try {
        throw new Error(message);
    } catch (e) {
        // eslint-disable-next-line
        throw e.message + '\n' + e.stack;
    }
}
/**
 * This function is used to print given element
 *
 * @param {Element} element - Specifies the print content element.
 * @param {Window} printWindow - Specifies the print window.
 * @returns {Window} ?
 * @private
 */
export function print(element: Element, printWindow?: Window): Window {
    const div: Element = document.createElement('div');
    const links: HTMLElement[] = [].slice.call(document.getElementsByTagName('head')[0].querySelectorAll('base, link, style'));
    const blinks: HTMLElement[] = [].slice.call(document.getElementsByTagName('body')[0].querySelectorAll('link, style'));
    if (blinks.length) {
        for (let l: number = 0, len: number = blinks.length; l < len; l++) {
            links.push(blinks[parseInt(l.toString(), 10)]);
        }
    }
    let reference: string = '';
    if (isNullOrUndefined(printWindow)) {
        printWindow = window.open('', 'print', 'height=452,width=1024,tabbar=no');
    }
    div.appendChild(element.cloneNode(true) as Element);
    for (let i: number = 0, len: number = links.length; i < len; i++) {
        reference += links[parseInt(i.toString(), 10)].outerHTML;
    }
    printWindow.document.write('<!DOCTYPE html> <html><head>' + reference + '</head><body>' + div.innerHTML +
        '<script> (function() { window.ready = true; })(); </script>' + '</body></html>');
    printWindow.document.close();
    printWindow.focus();
    // eslint-disable-next-line
    const interval: any = setInterval(
        () => {
            if ((<{ ready: Function } & Window>printWindow).ready) {
                printWindow.print();
                printWindow.close();
                clearInterval(interval);
            }
        },
        500);
    return printWindow;
}

/**
 * Function to normalize the units applied to the element.
 *
 * @param {number|string} value ?
 * @returns {string} result
 * @private
 */
export function formatUnit(value: number | string): string {
    const result: string = <string>value + '';
    if (result.match(/auto|cm|mm|in|px|pt|pc|%|em|ex|ch|rem|vw|vh|vmin|vmax/)) {
        return result;
    }

    return result + 'px';
}

/**
 * Function to check whether the platform is blazor or not.
 *
 * @returns {void} result
 * @private
 */
export function enableBlazorMode(): void {
    isBlazorPlatform = true;
}

/**
 * Function to check whether the platform is blazor or not.
 *
 * @returns {boolean} result
 * @private
 */
export function isBlazor(): boolean {
    return isBlazorPlatform;
}

/**
 * Function to convert xPath to DOM element in blazor platform
 *
 * @returns {HTMLElement} result
 * @param {HTMLElement | object} element ?
 * @private
 */
export function getElement(element: object): HTMLElement {
    const xPath: string = 'xPath';
    if (!(element instanceof Node) && isBlazor() && !isNullOrUndefined(element[`${xPath}`])) {
        return document.evaluate(element[`${xPath}`], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
    }
    return element as HTMLElement;
}


/**
 * Function to fetch the Instances of a HTML element for the given component.
 *
 * @param {string | HTMLElement} element ?
 * @param {any} component ?
 * @returns {Object} ?
 * @private
 */
// eslint-disable-next-line
export function getInstance(element: string | HTMLElement, component: any): Object {
    // eslint-disable-next-line
    let elem: any = (typeof (element) === 'string') ? document.querySelector(element) : element;
    if (elem[`${instances}`]) {
        for (const inst of elem[`${instances}`]) {
            if (inst instanceof component) {
                return inst;
            }
        }
    }
    return null;
}

/**
 * Function to add instances for the given element.
 *
 * @param {string | HTMLElement} element ?
 * @param {Object} instance ?
 * @returns {void} ?
 * @private
 */
export function addInstance(element: string | HTMLElement, instance: Object): void {
    // eslint-disable-next-line
    let elem: any = (typeof (element) === 'string') ? document.querySelector(element) : element;
    if (elem[`${instances}`]) {
        elem[`${instances}`].push(instance);
    } else {
        elem[`${instances}`] = [instance];
    }
}

/**
 * Function to generate the unique id.
 *
 * @returns {any} ?
 * @private
 */
// eslint-disable-next-line
export function uniqueID(): any {
    if ((typeof window) === 'undefined') {
        return;
    }
    // eslint-disable-next-line
    let num: any = new Uint16Array(5);
    const intCrypto: Crypto = window.msCrypto || window.crypto;
    return intCrypto.getRandomValues(num);
}

interface TimeoutHandler {
    (): Function;
}

/**
 *
 * @param {Int16Array} num ?
 * @returns {string} ?
 */
function combineArray(num: Int16Array): string {
    let ret: string = '';
    for (let i: number = 0; i < 5; i++) {
        ret += (i ? ',' : '') + num[parseInt(i.toString(), 10)];
    }
    return ret;
}
