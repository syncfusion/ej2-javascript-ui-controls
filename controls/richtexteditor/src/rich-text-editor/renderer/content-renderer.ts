import { IRenderer, IRichTextEditor } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { getEditValue } from '../base/util';
/**
 * Content module is used to render Rich Text Editor content
 *
 * @hidden
 * @deprecated
 */
export class ContentRender implements IRenderer {
    //Internal variables
    protected contentPanel: Element;
    //Module declarations
    protected parent: IRichTextEditor;
    protected editableElement: Element;
    private serviceLocator: ServiceLocator;
    /**
     * Constructor for content renderer module
     *
     * @param {IRichTextEditor} parent - specifies the parent element.
     * @param {ServiceLocator} serviceLocator - specifies the service.
     * @returns {void}
     */
    public constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }

    /**
     * The function is used to render Rich Text Editor content div
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public renderPanel(): void {
        const rteObj: IRichTextEditor = this.parent;
        const div: HTMLElement = this.parent.createElement('div', { className: 'e-rte-content', id: this.parent.getID() + 'rte-view' });
        const rteContent: string = getEditValue(rteObj.value, rteObj);
        this.editableElement = this.parent.createElement('div', {
            className: 'e-content',
            id: this.parent.getID() + '_rte-edit-view',
            attrs: {
                'contenteditable': 'true'
            },
            innerHTML: rteContent
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.element.appendChild(div);
    }

    /**
     * Get the content div element of RichTextEditor
     *
     * @returns {Element} - specifies the element.
     * @hidden
     * @deprecated
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Get the editable element of RichTextEditor
     *
     * @returns {Element} - specifies the return element.
     * @hidden
     * @deprecated
     */
    public getEditPanel(): Element {
        return this.editableElement;
    }

    /**
     * Returns the text content as string.
     *
     * @returns {string} - specifies the string element.
     */
    public getText(): string {
        return (this.getEditPanel() as HTMLElement).innerText;
    }

    /**
     * Set the content div element of RichTextEditor
     *
     * @param {Element} panel - specifies the panel element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }

    /**
     * Get the document of RichTextEditor
     *
     * @returns {Document} - specifies the document.
     * @hidden
     * @deprecated
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
}
