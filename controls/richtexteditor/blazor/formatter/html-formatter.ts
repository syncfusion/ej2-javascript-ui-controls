import { extend } from '@syncfusion/ej2-base';
import { Formatter } from './formatter';
import { htmlKeyConfig } from '../../src/common/config';
import { EditorManager } from '../../src/editor-manager/base/editor-manager';
import { IEditorModel, IHtmlFormatterModel } from '../../src/rich-text-editor/base/interface';

/**
 * HTML adapter
 */
export class HTMLFormatter extends Formatter {
    public element: Element;
    public currentDocument: Document;
    public editorManager: IEditorModel;
    public keyConfig: { [key: string]: string };

    constructor(options?: IHtmlFormatterModel) {
        super();
        this.initialize();
        extend(this, this, options, true);
        if (this.currentDocument && this.element) {
            this.updateFormatter(this.element, this.currentDocument, options.options);
        }
    }
    private initialize(): void {
        this.keyConfig = htmlKeyConfig;
    }
    public updateFormatter(editElement: Element, doc?: Document, options?: { [key: string]: number }): void {
        if (editElement && doc) {
            this.editorManager = new EditorManager({
                document: doc,
                editableElement: editElement,
                options: options
            });
        }
    }
}