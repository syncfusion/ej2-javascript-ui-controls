import { extend } from '../../../base'; /*externalscript*/
import { Formatter } from './formatter';
import { htmlKeyConfig } from '../../src/common/config';
import { EditorManager } from '../../src/editor-manager/base/editor-manager';
import { IEditorModel, IHtmlFormatterModel } from '../../src/common/interface';
import { FormatPainterSettingsModel } from '../../src/models';

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
            this.updateFormatter(this.element, this.currentDocument, options.options, options.formatPainterSettings);
        }
    }
    private initialize(): void {
        this.keyConfig = htmlKeyConfig;
    }
    public updateFormatter(editElement: Element, doc?: Document, options?: { [key: string]: number },
                           formatPainterSettings?: FormatPainterSettingsModel): void {
        if (editElement && doc) {
            this.editorManager = new EditorManager({
                document: doc,
                editableElement: editElement,
                options: options,
                formatPainterSettings: formatPainterSettings
            });
        }
    }
}
