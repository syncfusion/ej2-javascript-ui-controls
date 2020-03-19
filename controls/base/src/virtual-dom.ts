import { isObject, getValue, extend, isNullOrUndefined } from './util';
import { ElementProperties } from './dom';
import { getRandomId } from './template-engine';
const simpleRegex: RegExp = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
const multipleSplitRegex: RegExp = /(?:#([\w-]+)|(\w+)|\.([\w-]+))/g;
const idClassSelector: RegExp = /^(\.|#)/;
const selectMapper: { [key: string]: string } = {
    '.': 'className',
    '#': 'id'
};
const classRegexString: string = '(?=.*?\\b{value}\\b)';
const assigner: Object = { className: 'attributes.className', id: 'attributes.id', tagName: 'tagName' };
const emptyElements: string[] = ['area', 'base', 'basefont', 'br', 'col', 'frame', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'embed', 'command', 'keygen', 'source', 'track', 'wbr'];
const blockElements: string[] = ['a', 'address', 'article', 'applet', 'aside', 'audio', 'blockquote',
    'button', 'canvas', 'center', 'dd', 'del', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure',
    'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'iframe', 'ins',
    'isindex', 'li', 'map', 'menu', 'noframes', 'noscript', 'object', 'ol', 'output', 'p', 'pre', 'section',
    'script', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'video'];
const inlineElement: string[] = ['abbr', 'acronym', 'applet', 'b', 'basefont', 'bdo', 'big', 'br', 'button',
    'cite', 'code', 'del', 'dfn', 'em', 'font', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'map',
    'object', 'q', 's', 'samp', 'script', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'textarea',
    'tt', 'u', 'var'];
const selfClosingElements: string[] = ['colgroup', 'dd', 'dt', 'li', 'options', 'p', 'td', 'tfoot', 'th',
    'thead', 'tr'];
const fillAttrs: string[] = ['checked', 'compact', 'declare', 'defer', 'disabled', 'ismap', 'multiple',
    'nohref', 'noresize', 'noshade', 'nowrap', 'readonly', 'selected'];
const cspElement: string[] = ['Script', 'style'];
const nameMapper: Object = { 'tabindex': 'tabIndex' };
const startRegex: RegExp = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endRegex: RegExp = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attributeRegex: RegExp = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
export interface VirtualObject {
    children?: VirtualObject[];
    tagName?: string;
    attributes?: { style?: Object };
    parent?: VirtualObject;
}
/**
 * Namespace for VirtualDOM
 * @private
 */
export namespace VirtualDOM {
    //tslint:disable:no-any
    export function createElement(tagName: string, properties?: ElementProperties): VirtualObject {

        let children: VirtualObject[] = [];
        let extended: ElementProperties & { style: Object } = extend({}, {}, properties, true) as any;
        if (!isNullOrUndefined(properties)) {
            let keys: string[] = Object.keys(properties);
            if (keys.length) {
                if (extended.innerHTML) {
                    children = ConvertHTMLToJSon(extended.innerHTML);
                    delete extended.innerHTML;
                }
                if (extended.attrs) {
                    extend(extended, extended.attrs);
                    delete extended.attrs;
                }
                if (extended.styles) {
                    let valArr: string[] = extended.styles.split(';');
                    let vObj: { [key: string]: string } = {};
                    for (let i: number = 0, length: number = valArr.length; i < length; i++) {
                        let cVal: string = valArr[i];
                        let styleSplit: string[] = cVal.split(':');
                        vObj[styleSplit[0]] = styleSplit[1];
                    }
                    delete extended.styles;
                    (extended as any).style = vObj;
                }

            }
        }
        return {
            tagName: tagName,
            attributes: extended || {},
            children: children
        };
    }
    export function assignParent(childrens: VirtualObject[], parent: VirtualObject): void {
        if (parent && childrens) {
            childrens.forEach((child: VirtualObject) => {
                if (isObject(child)) {
                    if (child.parent) {
                        detach(child);
                    }
                    child.parent = parent;
                }
                return child;
            });
        }
    }

    export function append(fromElements: Object[], toElement: VirtualObject): void {
        assignParent(fromElements, toElement);
        if (toElement.children) {
            toElement.children = toElement.children.concat(fromElements);

        } else {
            toElement.children = [].concat(fromElements);
        }
    }

    export function prepend(child: Object[], toElement: { children: Object[] }): void {
        assignParent(child, toElement);
        if (!toElement.children || !toElement.children.length) {
            toElement.children = [];
            toElement.children.concat(child);
        } else {
            for (let i: number = child.length - 1; i >= 0; i--) {
                toElement.children.unshift(child[i]);
            }
        }
    }

    export function detach(element: VirtualObject): VirtualObject {

        let parent: VirtualObject = element.parent;
        if (parent) {
            let index: number = parent.children.indexOf(element);
            if (index !== -1) {
                parent.children.splice(index);
            }

        }
        return parent;
    }
    //tslint:disable-next-line
    export function vDomSelector({ ele, selector, selectAll, immediateParent }: { ele: VirtualObject & VirtualObject[]; selector: string; selectAll: boolean; immediateParent?: boolean; }): VirtualObject[] {
        let iSelector: string[] = selector.split(' ');
        let curColl: VirtualObject = ele;
        for (let i: number = 0, length: number = iSelector.length; i < length; i++) {
            let isDescendant: boolean = false;
            let parent: VirtualObject[] = curColl as VirtualObject[];
            let curSelector: string = iSelector[i];
            let simpleSelector: boolean = false;
            let mapper: Object[] = [];
            if (simpleRegex.test(curSelector)) {
                simpleSelector = true;
                processSelector(curSelector, mapper);
            } else if (curSelector.indexOf('>') === -1) {
                let splitSelector: string[] = curSelector.match(multipleSplitRegex);
                for (let curMap of splitSelector) {

                    processSelector(curMap, mapper);
                }
            } else if (curSelector.indexOf('>') !== -1) {
                isDescendant = true;
                let dSelector: string[] = curSelector.split('>');
                //tslint:disable-next-line
                let dParent: any = ele as VirtualObject[];
                let descendent: VirtualObject | VirtualObject[];
                let flag: number = 0;
                for (let sel of dSelector) {

                    if (!dParent) {
                        break;
                    }
                    if (dParent.length) {
                        let descendentChild: VirtualObject[] = [];
                        for (let child of dParent) {
                            descendentChild = descendentChild.concat(vDomSelector({
                                ele: child, selector: sel,
                                selectAll, immediateParent: !!flag
                            }));
                        }
                        descendent = descendentChild;
                    } else {

                        descendent = vDomSelector({ ele: dParent, selector: sel, selectAll, immediateParent: !!flag });
                    }
                    flag++;
                    dParent = descendent;
                }
                if (descendent) {
                    curColl = descendent as VirtualObject;
                }
            }
            if (!isDescendant) {
                if (parent.length) {
                    let iCurSelector: VirtualObject[] = [];
                    for (let curParent of parent) {
                        iCurSelector = iCurSelector.concat(accessElement(curParent, mapper, selectAll, immediateParent));
                    }
                    curColl = iCurSelector as VirtualObject;
                } else {
                    curColl = accessElement(parent as VirtualObject, mapper, selectAll, immediateParent) as VirtualObject;
                }
            }
        }
        if (selectAll) {
            return curColl as VirtualObject[];
        } else {
            return curColl[0] || null;
        }

    }

    function processSelector(selector: string, mapper: Object[]): void {
        let match: string[] = selector.match(idClassSelector);
        let obj: Object = {};
        if (match) {
            let curMapper: string = selectMapper[match[0]];
            if (curMapper === 'className') {
                let curObj: Object = mapper.filter((obj: Object): boolean => { return obj.hasOwnProperty('className'); })[0];
                let canPush: boolean = false;
                if (!curObj) {
                    canPush = true;
                    curObj = {};
                }
                let existValue: string = curObj[curMapper] || '';
                curObj[curMapper] = existValue + classRegexString.replace('{value}', selector.replace('.', ''));
                if (canPush) {
                    mapper.push(curObj);
                }
            } else {
                obj[curMapper] = selector.replace(match[0], '');
                mapper.push(obj);
            }
        } else {
            mapper.push({ tagName: selector });
        }
    }
    //tslint:disable-next-line
    export function accessElement(ele: VirtualObject, mapper: any, selectAll: boolean, immediateParent?: boolean): VirtualObject[] {
        if (ele.children) {
            //tslint:disable-next-line
            let temp: VirtualObject[] = ele.children.filter(function (child: VirtualObject): boolean {
                if (typeof (child) !== 'string') {
                    let matched: boolean = true;
                    for (let map of mapper) {
                        let key: string = Object.keys(map)[0];
                        let expected: string = map[key];
                        let actualValue: string = getValue(assigner[key], child);
                        if (key === 'className') {
                            if (!(new RegExp('^' + expected + '.*$').test(actualValue))) {
                                matched = false;
                                break;
                            }
                        } else if (actualValue !== expected) {
                            matched = false;
                            break;
                        }
                    }
                    return matched;
                } else {
                    return false;
                }
            }
            );
            if (!immediateParent && (!temp.length || selectAll)) {
                ele.children.forEach((child: VirtualObject) => {
                    if (isObject(child)) {
                        temp = temp.concat(accessElement(child, mapper, selectAll));
                    }
                });
            }
            return temp;
        } else {
            return [];
        }

    }



    export function ConvertHTMLToJSon(htmlString: string): VirtualObject[] {
        let results: VirtualObject[] = [];
        let isText: boolean;
        let tagArray: string[] = [];
        let backup: string = htmlString;
        let nodeArray: VirtualObject[] = [];
        while (htmlString) {
            isText = true;
            let lastVal: string = getLastValue(tagArray);
            if (!lastVal || !contains(cspElement, lastVal)) {
                if (htmlString.indexOf('</') === 0) {
                    let match: string[] = htmlString.match(endRegex);
                    if (match) {
                        htmlString = htmlString.substring(match[0].length);
                        //tslint:disable-next-line
                        match[0].replace(endRegex, iterateEndTag as any);
                    }
                    isText = false;
                } else if (htmlString.indexOf('<') === 0) {
                    let match: string[] = htmlString.match(startRegex);
                    if (match) {
                        htmlString = htmlString.substring(match[0].length);
                        //tslint:disable-next-line
                        match[0].replace(startRegex, iterateStartTag as any);
                    }
                    isText = false;
                }
                if (isText) {
                    let tagIndex: number = htmlString.indexOf('<');
                    let text: string = tagIndex < 0 ? htmlString : htmlString.substring(0, tagIndex);
                    htmlString = tagIndex < 0 ? '' : htmlString.substring(tagIndex);
                    iterateText(text);
                }
            } else {
                //tslint:disable-next-line
                htmlString = htmlString.replace(
                    new RegExp('([\\s\\S]*?)<\/' + getLastValue(nodeArray as VirtualObject) + '[^>]*>'),
                    (all: string, text: string): string => {
                        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
                        iterateText(text);
                        return '';
                    });
                iterateEndTag('', getLastValue(tagArray));
            }
            backup = htmlString;
        }
        function iterateStartTag(start: string, tagName: string, rest: string): void {
            tagName = tagName.toLowerCase();

            if (contains(blockElements, tagName)) {
                while (getLastValue(tagArray) && contains(inlineElement, getLastValue(tagArray))) {
                    iterateEndTag('', getLastValue(tagArray));
                }
            }
            if (contains(selfClosingElements, tagName) && getLastValue(tagArray)) {
                iterateEndTag('', tagName);
            }
            let isSelfTag: boolean = contains(emptyElements, tagName);
            if (!isSelfTag) {
                tagArray.push(tagName);
            }
            let attrs: Object = {};
            //tslint:disable-next-line
            rest.replace(attributeRegex, function (match: string, name: string, ...names: any[]) {
                //tslint:disable-next-line
                let val: any = names[2] ? names[2] :
                    names[3] ? names[3] :
                        names[4] ? names[4] :
                            contains(fillAttrs, name) ? name : '';

                if (name === 'style') {
                    let valArr: string[] = val.split(';');
                    let vObj: VirtualObject = {};
                    for (let i: number = 0, length: number = valArr.length; i < length; i++) {
                        let cVal: string = valArr[i];
                        let styleSplit: string[] = cVal.split(':');
                        vObj[styleSplit[0]] = styleSplit[1];
                    }
                    val = vObj;
                }
                name = nameMapper[name] || name;
                attrs[name] = val;
                //tslint:disable-next-line
            } as any);
            attrs['data-id'] = getRandomId();
            let tagObject: VirtualObject = {
                tagName: tagName,
                attributes: attrs as Object
            };
            if (isSelfTag) {
                let parent: VirtualObject = (nodeArray[0] || results as VirtualObject);
                if (parent.children === undefined) {
                    parent.children = [];
                }
                tagObject.parent = parent;
                parent.children.push(tagObject);
            } else {
                nodeArray.unshift(tagObject);
            }
        }

        function iterateEndTag(start: string, tagName: string): void {
            let pos: number;
            if (!tagName) {
                pos = 0;
            } else {
                for (pos = tagArray.length - 1; pos >= 0; pos--) {
                    if (tagArray[pos] === tagName) {
                        break;
                    }
                }
            }
            if (pos >= 0) {
                for (let j: number = nodeArray.length - 1; j >= pos; j--) {
                    //tslint:disable-next-line
                    let node: any = nodeArray.shift();
                    if (nodeArray.length === 0) {
                        results.push(node);
                    } else {
                        let parent: VirtualObject = nodeArray[0];
                        if (parent.children === undefined) {
                            parent.children = [];
                        }
                        node.parent = parent;
                        parent.children.push(node);

                    }
                }
                tagArray.length = pos;
            }
        }
        function iterateText(text: string & VirtualObject): void {
            if (nodeArray.length === 0) {
                results.push(text as VirtualObject);
            } else {
                let parent: VirtualObject = nodeArray[0];
                if (parent.children === undefined) {
                    parent.children = [];
                }
                parent.children.push(text);
            }
        }
        return results;
    }

    //tslint:disable-next-line 
    function getLastValue(arr: any): string {
        return arr[arr.length - 1];
    }
    function contains(arr: Object[], key: string): boolean {
        return arr.indexOf(key) !== -1;
    }
    //tslint:disable-next-line
    export function cloneNode(ele: VirtualObject | Element, deep: boolean): any {
        if (isObject(ele)) {
            if (deep) {
                return extend({}, {}, ele, true);
            } else {
                return { tagName: ele.tagName, attributes: ele.attributes };
            }
        } else {
            return (ele as Element).cloneNode(deep);
        }
    }

    export function setStyleAttribute(element: VirtualObject, attrs: Object): void {
        if (element.attributes.style) {
            (element.attributes).style = extend({}, attrs);
        } else {
            element.attributes.style = extend(element.attributes.style, attrs);
        }
    }
    //tslint:enable:no-any
}