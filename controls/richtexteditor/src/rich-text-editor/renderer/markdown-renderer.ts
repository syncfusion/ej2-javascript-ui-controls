import { IRenderer, IRichTextEditor } from '../base/interface';

/**
 * Markdown module is used to render RichTextEditor as Markdown editor content
 * @hidden
 */
export class MarkdownRender implements IRenderer {
    private contentPanel: Element;
    protected parent: IRichTextEditor;
    protected editableElement: Element;
    private rteID: string;

    /**
     * Constructor for content renderer module
     */
    constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.rteID = this.parent.element.id;
    }

    /**
     * The function is used to render RichTextEditor content div    
     */
    public renderPanel(): void {
        let rteObj: IRichTextEditor = this.parent;
        let div: HTMLElement = this.parent.createElement('div', { id: this.rteID + '_view', className: 'e-rte-content' });
        this.editableElement = this.parent.createElement('textarea', {
            className: 'e-content',
            id: this.rteID + '_editable-content'
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
        return (this.getEditPanel() as HTMLTextAreaElement).value;
    }
    /**
     * Set the content div element of RichTextEditor
     * @param  {Element} panel   
     */
    public setPanel(panel: Element): void {
        this.contentPanel = panel;
    }
    /**
     * Get the document of RichTextEditor
     * @param  {Document}   
     */
    public getDocument(): Document {
        return this.getEditPanel().ownerDocument;
    }
}