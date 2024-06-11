import { IRenderer, IRichTextEditor } from '../base/interface';

/**
 * Markdown module is used to render Rich Text Editor as Markdown editor content
 *
 * @hidden
 * @deprecated
 */
export class MarkdownRender implements IRenderer {
    private contentPanel: Element;
    protected parent: IRichTextEditor;
    protected editableElement: Element;

    /**
     * Constructor for content renderer module
     *
     * @param {IRichTextEditor} parent - specifies the parent.
     */
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
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
        const div: HTMLElement = this.parent.createElement('div', { id: this.parent.getID() + '_view', className: 'e-rte-content' });
        this.editableElement = this.parent.createElement('textarea', {
            className: 'e-content',
            id: this.parent.getID() + '_editable-content',
            attrs: { 'aria-labelledby': this.parent.getID() + '_view' }
        });
        div.appendChild(this.editableElement);
        this.setPanel(div);
        rteObj.rootContainer.appendChild(div);
    }
    /**
     * Get the content div element of RichTextEditor
     *
     * @returns {Element} - specifies the element
     * @hidden
     * @deprecated
     */
    public getPanel(): Element {
        return this.contentPanel;
    }
    /**
     * Get the editable element of RichTextEditor
     *
     * @returns {Element} - specifies the element
     * @hidden
     * @deprecated
     */
    public getEditPanel(): Element {
        return this.editableElement;
    }
    /**
     * Returns the text content as string.
     *
     * @returns {string} - specifies the string values.
     */
    public getText(): string {
        return (this.getEditPanel() as HTMLTextAreaElement).value;
    }
    /**
     * Set the content div element of RichTextEditor
     *
     * @param  {Element} panel - specifies the element.
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
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
}
