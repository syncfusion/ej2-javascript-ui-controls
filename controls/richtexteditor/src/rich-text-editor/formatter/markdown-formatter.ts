import { Formatter } from './formatter';
import { MarkdownParser } from './../../markdown-parser/base/markdown-parser';
import { IEditorModel, IMarkdownFormatterModel } from './../../common/interface';
import { extend } from '@syncfusion/ej2-base';
import { markdownKeyConfig, markdownListsTags, markdownFormatTags, markdownSelectionTags } from './../../common/config';
/**
 * Markdown adapter
 *
 * @hidden
 * @deprecated
 */
export class MarkdownFormatter extends Formatter {
    public keyConfig: { [key: string]: string };
    public formatTags: { [key: string]: string };
    public listTags: { [key: string]: string };
    public selectionTags: { [key: string]: string };
    public editorManager: IEditorModel;
    private element: Element;

    public constructor(options?: IMarkdownFormatterModel) {
        super();
        this.initialize();
        extend(this, this, options, true);
        if (options && this.element) {
            this.updateFormatter(this.element, document, options.options);
        }
    }
    private initialize(): void {
        this.keyConfig = markdownKeyConfig;
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    }
    /**
     * Update the formatter of RichTextEditor
     *
     * @param  {Element} editElement - specifies the edit element.
     * @param  {Document} doc - specifies the document.
     * @param {number} options - specifies the options
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public updateFormatter(editElement: Element, doc?: Document, options?: { [key: string]: number }): void {
        if (editElement) {
            this.editorManager = new MarkdownParser({
                element: editElement as HTMLTextAreaElement,
                formatTags: this.formatTags,
                listTags: this.listTags,
                selectionTags: this.selectionTags,
                options: options
            });
        }
    }
}
