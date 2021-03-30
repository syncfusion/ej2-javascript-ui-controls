import { RichTextEditor, RichTextEditorModel, HtmlEditor } from '@syncfusion/ej2-richtexteditor';
import { MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table, FileManager } from '@syncfusion/ej2-richtexteditor';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `RTE` module is used configure the properties of RTE type editor.
 */
export class Rte implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: RichTextEditor = undefined;

    public constructor(parent?: InPlaceEditor) {
        RichTextEditor.Inject(HtmlEditor, MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table, FileManager);
        this.parent = parent;
        this.parent.rteModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new RichTextEditor(this.parent.model as RichTextEditorModel);
        this.compObj.appendTo(e.target);
    }

    public focus(): void {
        this.compObj.focusIn();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'RTE') {
            this.parent.setProperties({ value: this.getRteValue() }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }

    private getRteValue(): string {
        let rteVal: string;
        if (this.compObj.editorMode === 'Markdown') {
            rteVal = (this.compObj.contentModule.getEditPanel() as HTMLTextAreaElement).value;
            return (rteVal === '') ? '' : rteVal;
        } else {
            rteVal = this.compObj.contentModule.getEditPanel().innerHTML;
            return (rteVal === '<p><br></p>' || rteVal === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || rteVal === '') ? '' : rteVal;
        }
    }

    public refresh(): void {
        this.compObj.refresh();
    }

    /**
     * Destroys the rte module.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.base.destroy();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the string
     */
    private getModuleName(): string {
        return 'rte';
    }
}