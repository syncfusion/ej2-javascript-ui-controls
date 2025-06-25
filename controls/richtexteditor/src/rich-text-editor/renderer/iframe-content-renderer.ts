import { IRichTextEditor } from '../base/interface';
import { ContentRender } from '../renderer/content-renderer';
import { createElement, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { getEditValue } from '../base/util';
import { IFRAME_EDITOR_STYLES, IFRAME_EDITOR_LIGHT_THEME_STYLES, IFRAME_EDITOR_DARK_THEME_STYLES } from '../../common/editor-styles';
import { CLS_RTE_IFRAME_CONTENT } from '../base';
import { MetaTag } from '../../common/interface';


/**
 * Content module is used to render Rich Text Editor content
 *
 * @hidden
 * @deprecated
 */
export class IframeContentRender extends ContentRender {
    private styles: string = this.getEditorStyles();
    private IFRAMEHEADER: string = `
    <!DOCTYPE html> 
    <html>
         <head>
            <meta charset='utf-8' /> 
            <style>` +
        this.styles + `
            </style>
        </head>
    `;
    /* Gets editor styles with theme-specific styling */
    private getEditorStyles(): string {
        // Get base editor styles
        const baseStyles: string = IFRAME_EDITOR_STYLES.replace(/[\n\t]/g, '');
        // Detect theme
        const themeStyle: CSSStyleDeclaration = window.getComputedStyle(this.parent.element.querySelector('.e-rte-container'));
        const isDarkTheme: boolean = themeStyle.content.includes('dark-theme');
        // Select theme styles based on current theme
        const themeStyles: string = (isDarkTheme ?
            IFRAME_EDITOR_DARK_THEME_STYLES :
            IFRAME_EDITOR_LIGHT_THEME_STYLES).replace(/[\n\t]/g, '');
        // Return combined styles
        return baseStyles + themeStyles;
    }
    public renderPanel(): void {
        const rteObj: IRichTextEditor = this.parent;
        const rteContent: string = getEditValue(rteObj.value, rteObj);
        const iFrameBodyContent: string =
            '<body contenteditable="true" aria-label="Rich Text Editor" role="textbox" lang="' +
            this.parent.locale.slice(0, 2) +
            '" dir="' + (this.parent.enableRtl ? 'rtl' : 'ltr') +
            '">' + rteContent + '</body></html>';
        let iFrameContent: string = this.IFRAMEHEADER + iFrameBodyContent;
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
        const iframeWrapper: HTMLElement = createElement('div', { className: CLS_RTE_IFRAME_CONTENT });
        rteObj.rootContainer.appendChild(iframeWrapper);
        iframeWrapper.appendChild(iframe);
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
