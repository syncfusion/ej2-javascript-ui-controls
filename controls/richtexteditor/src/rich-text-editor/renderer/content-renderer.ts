import { IRenderer, IRichTextEditor } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';

/**
 * Content module is used to render RichTextEditor content
 * @hidden
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
     */
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
    }

    /**
     * The function is used to render RichTextEditor content div
     */
    public renderPanel(): void {
        let rteObj: IRichTextEditor = this.parent;
        let div: HTMLElement = this.parent.createElement('div', { className: 'e-rte-content', id: this.parent.getID() + 'rte-view' });
        let rteContent: string = (rteObj.value !== null && rteObj.value !== '') ? rteObj.value : '<p><br/></p>';
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
     * @return {Element}
     */
    public getPanel(): Element {
        return this.contentPanel;
    }

    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     */
    public getEditPanel(): Element {
        return this.editableElement;
    }

    /**
     * Returns the text content as string.
     * @return {string} 
     */
    public getText(): string {
        return this.getEditPanel().textContent;
    }

    /**
     * Set the content div element of RichTextEditor
     * @param {Element} panel
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }

    /**
     * Get the document of RichTextEditor
     * @return {Document}
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
}