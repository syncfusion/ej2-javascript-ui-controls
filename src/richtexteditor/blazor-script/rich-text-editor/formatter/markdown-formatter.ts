import { extend } from '../../../base'; /*externalscript*/
import { Formatter } from './formatter';
import { MarkdownParser } from '../../src/markdown-parser/base/markdown-parser';
import { IEditorModel, IMarkdownFormatterModel } from '../../src/common/interface';
import { markdownKeyConfig, markdownListsTags, markdownFormatTags, markdownSelectionTags } from '../../src/common/config';

/**
 * Markdown adapter
 */
export class MarkdownFormatter extends Formatter {
    private element: Element;
    public editorManager: IEditorModel;
    public keyConfig: { [key: string]: string };
    public listSyntax: { [key: string]: string };
    public formatSyntax: { [key: string]: string };
    public selectionSyntax: { [key: string]: string };

    constructor(options?: IMarkdownFormatterModel) {
        super();
        this.initialize();
        extend(this, this, options, true);
        if (options && this.element) {
            this.updateFormatter(this.element, document, options.options);
        }
    }
    private initialize(): void {
        this.keyConfig = markdownKeyConfig;
        this.formatSyntax = markdownFormatTags;
        this.listSyntax = markdownListsTags;
        this.selectionSyntax = markdownSelectionTags;
    }
    public updateFormatter(editElement: Element, doc?: Document, options?: { [key: string]: number }): void {
        if (editElement) {
            this.editorManager = new MarkdownParser({
                element: editElement as HTMLTextAreaElement,
                formatTags: this.formatSyntax,
                listTags: this.listSyntax,
                selectionTags: this.selectionSyntax,
                options: options
            });
        }
    }
}
