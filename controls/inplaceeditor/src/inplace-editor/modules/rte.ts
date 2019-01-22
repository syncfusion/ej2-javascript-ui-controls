import { RichTextEditor, RichTextEditorModel, HtmlEditor } from '@syncfusion/ej2-richtexteditor';
import { MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table } from '@syncfusion/ej2-richtexteditor';
import { Base } from './base-module';
import { InPlaceEditor } from '../base/inplace-editor';
import { NotifyParams, IComponent } from '../base/interface';

RichTextEditor.Inject(HtmlEditor, MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table);

/**
 * The `RTE` module is used configure the properties of RTE type editor.
 */
export class Rte implements IComponent {
    private base: Base;
    protected parent: InPlaceEditor;
    public compObj: RichTextEditor = undefined;

    constructor(parent?: InPlaceEditor) {
        this.parent = parent;
        this.parent.rteModule = this;
        this.base = new Base(this.parent, this);
    }

    public render(e: NotifyParams): void {
        this.compObj = new RichTextEditor(this.parent.model as RichTextEditorModel, e.target);
    }

    public focus(): void {
        this.compObj.element.focus();
    }

    public updateValue(e: NotifyParams): void {
        if (this.compObj && e.type === 'RTE') {
            this.parent.setProperties({ value: this.compObj.value }, true);
        }
    }

    public refresh(): void {
        this.compObj.refresh();
    }

    /**
     * Destroys the rte module.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.base.destroy();
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'rte';
    }
}