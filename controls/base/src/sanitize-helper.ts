/**
 * SanitizeHtmlHelper for sanitize the value.
 */
import { detach } from './dom';

interface BeforeSanitizeHtml {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean;
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
     *
     * @function
     * @param {string} value - Returns the value.
     * @returns {string}
     */
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     *  Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors;
}

interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[];
    /** Returns the attributes. */
    attributes?: SanitizeRemoveAttrs[];
}

interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize */
    attribute?: string;
    /** Defines the selector that sanitize the specified attributes within the selector */
    selector?: string;
}

const removeTags: string[] = [
    'script',
    'style',
    'iframe[src]',
    'link[href*="javascript:"]',
    'object[type="text/x-scriptlet"]',
    'object[data^="data:text/html;base64"]',
    'img[src^="data:text/html;base64"]',
    '[src^="javascript:"]',
    '[dynsrc^="javascript:"]',
    '[lowsrc^="javascript:"]',
    '[type^="application/x-shockwave-flash"]'
];

const removeAttrs: SanitizeRemoveAttrs[] = [
    { attribute: 'href', selector: '[href*="javascript:"]' },
    { attribute: 'background', selector: '[background^="javascript:"]' },
    { attribute: 'style', selector: '[style*="javascript:"]' },
    { attribute: 'style', selector: '[style*="expression("]' },
    { attribute: 'href', selector: 'a[href^="data:text/html;base64"]' }];

const jsEvents: string[] = ['onchange',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onkeydown',
    'onload',
    'onerror',
    'onblur',
    'onfocus',
    'onbeforeload',
    'onbeforeunload',
    'onkeyup',
    'onsubmit',
    'onafterprint',
    'onbeforeonload',
    'onbeforeprint',
    'oncanplay',
    'oncanplaythrough',
    'oncontextmenu',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onformchange',
    'onforminput',
    'onhaschange',
    'oninput',
    'oninvalid',
    'onkeypress',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmessage',
    'onmousedown',
    'onmousemove',
    'onmouseup',
    'onmousewheel',
    'onoffline',
    'onoine',
    'ononline',
    'onpagehide',
    'onpageshow',
    'onpause',
    'onplay',
    'onplaying',
    'onpopstate',
    'onprogress',
    'onratechange',
    'onreadystatechange',
    'onredo',
    'onresize',
    'onscroll',
    'onseeked',
    'onseeking',
    'onselect',
    'onstalled',
    'onstorage',
    'onsuspend',
    'ontimeupdate',
    'onundo',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onmouseenter',
    'onmouseleave',
    'onstart',
    'onpropertychange',
    'oncopy',
    'ontoggle',
    'onpointerout',
    'onpointermove',
    'onpointerleave',
    'onpointerenter',
    'onpointerrawupdate',
    'onpointerover',
    'onbeforecopy',
    'onbeforecut',
    'onbeforeinput'
];
export class SanitizeHtmlHelper {
    public static removeAttrs: SanitizeRemoveAttrs[];
    public static removeTags: string[];
    public static wrapElement: HTMLElement;
    public static beforeSanitize(): BeforeSanitizeHtml {
        return {
            selectors: {
                tags: removeTags,
                attributes: removeAttrs
            }
        };
    }
    public static sanitize(value: string): string {
        const item: BeforeSanitizeHtml = this.beforeSanitize();
        const output: string = this.serializeValue(item, value);
        return output;
    }

    public static serializeValue(item: BeforeSanitizeHtml, value: string): string {
        this.removeAttrs = item.selectors.attributes;
        this.removeTags = item.selectors.tags;
        this.wrapElement = document.createElement('div');
        this.wrapElement.innerHTML = value;
        this.removeXssTags();
        this.removeJsEvents();
        this.removeXssAttrs();
        const tempEleValue: string = this.wrapElement.innerHTML;
        this.removeElement();
         return tempEleValue.replace(/&amp;/g, '&');
    }

    private static removeElement(): void {
        // Removes an element's attibute to avoid html tag validation
        const nodes: HTMLCollection = this.wrapElement.children;
        for (let j: number = 0; j < nodes.length; j++) {
            const attribute: NamedNodeMap = nodes[parseInt(j.toString(), 10)].attributes;
            for (let i: number = 0; i < attribute.length; i++) {
                this.wrapElement.children[parseInt(j.toString(), 10)].removeAttribute(attribute[parseInt(i.toString(), 10)].localName);
            }
        }
    }

    private static removeXssTags(): void {
        const elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll(this.removeTags.join(','));
        if (elements.length > 0) {
            elements.forEach((element: Element) => {
                detach(element);
            });
        } else {
            return;
        }
    }

    private static removeJsEvents(): void {
        const elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll('[' + jsEvents.join('],[') + ']');
        if (elements.length > 0) {
            elements.forEach((element: Element) => {
                jsEvents.forEach((attr: string) => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
            });
        } else {
            return;
        }
    }

    private static removeXssAttrs(): void {
        // eslint-disable-next-line
        this.removeAttrs.forEach((item: { [key: string]: string }, index: number) => {
            const elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll(item.selector);
            if (elements.length > 0) {
                elements.forEach((element: Element) => {
                    element.removeAttribute(item.attribute);
                });
            }
        });
    }
}
