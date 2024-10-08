import { IRichTextEditor, MetaTag } from '../base/interface';
import { ContentRender } from '../renderer/content-renderer';
import { isNullOrUndefined as isNOU} from '@syncfusion/ej2-base';
import { getEditValue } from '../base/util';
import { IFRAME_EDITOR_STYLES } from '../../common/editor-styles';

const IFRAMEHEADER: string = `
    <!DOCTYPE html> 
    <html>
         <head>
            <meta charset='utf-8' /> 
            <style>` +
                IFRAME_EDITOR_STYLES.replace(/[\n\t]/g, '') + `
            </style>
        </head>
`;

/**
 * Content module is used to render Rich Text Editor content
 *
 * @hidden
 * @deprecated
 */
export class IframeContentRender extends ContentRender {
    /**
     * The function is used to render Rich Text Editor iframe
     *
     * @hidden
     * @deprecated
     */

    public renderPanel(): void {
        const rteObj: IRichTextEditor = this.parent;
        const rteContent: string = getEditValue(rteObj.value, rteObj);
        const iFrameBodyContent: string = '<body contenteditable="true">' +
           rteContent + '</body></html>';
        let iFrameContent: string = IFRAMEHEADER + iFrameBodyContent;
        const iframe: HTMLIFrameElement = <HTMLIFrameElement>this.parent.createElement(
            'iframe',
            {
                id: this.parent.getID() + '_rte-view',
                className: 'e-rte-content',
                attrs: { 'srcdoc': iFrameContent }
            });
        iframe.setAttribute('role', 'none');
        this.setPanel(iframe);
        if (!isNOU(this.parent.iframeSettings.sandbox)) {
            let sandboxValues: string = this.parent.iframeSettings.sandbox
                .map((element: string) => element.toLocaleLowerCase().trim())
                .join(' ');
            if (!sandboxValues.includes('allow-same-origin')) {
                sandboxValues += ' allow-same-origin';
            }
            iframe.setAttribute('sandbox', sandboxValues.trim());
        }
        rteObj.rootContainer.appendChild(iframe);
        iframe.contentDocument.body.setAttribute('aria-owns', this.parent.getID());
        iframe.contentDocument.open();
        iFrameContent = this.setThemeColor(iFrameContent, { color: '#333' });
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
        const body: HTMLBodyElement = iframe.contentDocument.body as HTMLBodyElement;
        body.className = 'e-content';
        if (this.parent.height === 'auto') {
            body.style.overflowY = 'hidden';
        }
        if (!isNOU(this.parent.fontFamily.default)) {
            body.style.fontFamily = this.parent.fontFamily.default;
        }
        if (!isNOU(this.parent.fontSize.default)) {
            body.style.fontSize = this.parent.fontSize.default;
        }
        body.id = this.parent.getID() + '_rte-edit-view';
        if (rteObj.enableRtl) {
            (this.contentPanel as HTMLIFrameElement).contentDocument.body.setAttribute('class', 'e-rtl');
        }
        if (!isNOU(iframe.contentDocument.head) && this.parent.iframeSettings.metaTags.length > 0) {
            const head: HTMLHeadElement = iframe.contentDocument.head;
            const metaData: Array<MetaTag> = this.parent.iframeSettings.metaTags;
            metaData.forEach((tag: MetaTag) => {
                const meta: HTMLElement = document.createElement('meta');
                for (const key in tag) {
                    if (!isNOU(tag[key as keyof MetaTag])) {
                        meta.setAttribute((key === 'httpEquiv') ? 'http-equiv' : key, tag[key as keyof MetaTag] as string);
                    }
                }
                head.appendChild(meta);
            });
        }
    }
    private setThemeColor(content: string, styles: { [key: string]: string }): string {
        const fontColor: string = getComputedStyle(this.parent.element, '.e-richtexteditor').getPropertyValue('color');
        return content.replace(styles.color, fontColor);
    }
    /**
     * Get the editable element of RichTextEditor
     *
     * @returns {Element} - specifies the element.
     * @hidden
     * @deprecated
     */
    public getEditPanel(): Element {
        let editNode: HTMLElement;
        if (!isNOU((this.contentPanel as HTMLIFrameElement).contentDocument)) {
            editNode = (this.contentPanel as HTMLIFrameElement).contentDocument.body;
        } else {
            editNode = this.parent.inputElement;
        }
        return editNode;
    }
    /**
     * Get the document of RichTextEditor
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
}
