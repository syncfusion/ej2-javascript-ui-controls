
/**
 * SanitizeHtmlHelper for sanitize the value.
 */
import { detach } from '@syncfusion/ej2-base';
import { BeforeSanitizeHtmlArgs, SanitizeRemoveAttrs, IRichTextEditor } from '../base/interface';

const removeTags: string[] = [
    'script',
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
    'onblur',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
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
    'onerror',
    'onerror',
    'onfocus',
    'onformchange',
    'onforminput',
    'onhaschange',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmessage',
    'onmousedown',
    'onmousemove',
    'onmouseout',
    'onmouseover',
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
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'onundo',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onmouseenter',
    'onmouseleave',
    'onmousewheel',
    'onstart',
    'onpropertychange'
];
export class SanitizeHtmlHelper {
    public removeAttrs: SanitizeRemoveAttrs[];
    public removeTags: string[];
    public wrapElement: HTMLElement;
    public initialize(value: string, parent?: IRichTextEditor): string {
        let item: BeforeSanitizeHtmlArgs = {
            selectors: {
                tags: removeTags,
                attributes: removeAttrs
            },
            helper: null
        };
        parent.trigger('beforeSanitizeHtml', item);
        if (item.helper) {
            value = item.helper(value);
        }
        if (!item.cancel) {
            value = this.serializeValue(item, value);
        }
        return value;
    }

    public serializeValue(item: BeforeSanitizeHtmlArgs, value: string): string {
        this.removeAttrs = item.selectors.attributes;
        this.removeTags = item.selectors.tags;
        this.wrapElement = document.createElement('div');
        this.wrapElement.innerHTML = value;
        this.removeXssTags();
        this.removeJsEvents();
        this.removeXssAttrs();
        return this.wrapElement.innerHTML;
    }

    private removeXssTags(): void {
        let elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll(this.removeTags.join(','));
        if (elements.length > 0) {
            elements.forEach((element: Element) => {
                detach(element);
            });
        }
    }

    private removeJsEvents(): void {
        let elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll('[' + jsEvents.join('],[') + ']');
        if (elements.length > 0) {
            elements.forEach((element: Element) => {
                jsEvents.forEach((attr: string) => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
            });
        }
    }

    private removeXssAttrs(): void {
        this.removeAttrs.forEach((item: { [key: string]: string }, index: number) => {
            let elements: NodeListOf<HTMLElement> = this.wrapElement.querySelectorAll(item.selector);
            if (elements.length > 0) {
                elements.forEach((element: Element) => {
                    element.removeAttribute(item.attribute);
                });
            }
        });
    }
}