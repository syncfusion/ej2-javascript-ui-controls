import * as events from '../base/constant';
import { IRichTextEditor, IToolbarItemModel, IRenderer, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { MarkdownFormatter } from '../formatter/markdown-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType } from '../base/enum';
import { MarkdownToolbarStatus } from './markdown-toolbar-status';
import { MarkdownRender } from '../renderer/markdown-renderer';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';

/**
 * `MarkdownEditor` module is used to markdown editor
 */
export class MarkdownEditor {
    private parent: IRichTextEditor;
    private locator: ServiceLocator;
    private contentRenderer: IRenderer;
    private renderFactory: RendererFactory;
    private toolbarUpdate: MarkdownToolbarStatus;
    private saveSelection: MarkdownSelection;
    private mdSelection: MarkdownSelection;

    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService<RendererFactory>('rendererFactory');
        this.addEventListener();
    }
    /**
     * Destroys the Markdown.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.saveSelection = new MarkdownSelection();
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        this.parent.on(events.markdownToolbarClick, this.onToolbarClick, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.selectAll, this.selectAll, this);
        this.parent.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.on(events.selectionRestore, this.onSelectionRestore, this);
    }
    private onSelectionSave(): void {
        let textArea: HTMLTextAreaElement = this.parent.contentModule.getEditPanel() as HTMLTextAreaElement;
        this.saveSelection.save(textArea.selectionStart, textArea.selectionEnd);
    }

    private onSelectionRestore(e: NotifyArgs): void {
        (this.contentRenderer.getEditPanel() as HTMLElement).focus();
        let textArea: HTMLTextAreaElement = this.parent.contentModule.getEditPanel() as HTMLTextAreaElement;
        this.saveSelection.restore(textArea);
    }

    private onToolbarClick(args: ClickEventArgs): void {
        let text: string;
        let startOffset: number;
        let endOffset: number;
        let item: IToolbarItemModel = args.item as IToolbarItemModel;
        if (this.parent.editorMode === 'Markdown') {
            let textArea: HTMLTextAreaElement = (this.parent.contentModule.getEditPanel() as HTMLTextAreaElement);
            textArea.focus();
            startOffset = textArea.selectionStart;
            endOffset = textArea.selectionEnd;
            text = textArea.value.substring(startOffset, endOffset);
        }
        switch (item.subCommand) {
            case 'Maximize':
                this.parent.notify(events.enableFullScreen, { args: args });
                break;
            case 'Minimize':
                this.parent.notify(events.disableFullScreen, { args: args });
                break;
            case 'CreateLink':
                this.parent.notify(events.insertLink, { member: 'link', args: args, text: text, module: 'Markdown' });
                break;
            case 'Image':
                this.parent.notify(events.insertImage, { member: 'image', args: args, text: text, module: 'Markdown' });
                break;
            default:
                this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                break;
        }
    }
    private instantiateRenderer(): void {
        this.renderFactory.addRenderer(RenderType.Content, new MarkdownRender(this.parent));
    }
    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.modelChanged, this.onPropertyChanged);
        this.parent.off(events.destroy, this.destroy);
        this.parent.off(events.markdownToolbarClick, this.onToolbarClick);
        this.parent.off(events.initialLoad, this.instantiateRenderer);
        this.parent.off(events.selectAll, this.selectAll);
        this.parent.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.off(events.selectionSave, this.onSelectionSave);
        this.parent.off(events.selectionRestore, this.onSelectionRestore);
    }

    private render(): void {
        this.contentRenderer = this.renderFactory.getRenderer(RenderType.Content);
        let editElement: HTMLTextAreaElement = this.contentRenderer.getEditPanel() as HTMLTextAreaElement;
        let option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.formatter)) {
            this.parent.formatter = new MarkdownFormatter({
                element: editElement,
                options: option
            });
        } else {
            this.parent.formatter.updateFormatter(editElement, this.contentRenderer.getDocument(), option);
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new MarkdownToolbarStatus(this.parent);
        }
        this.parent.notify(events.bindOnEnd, {});
    }

    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    protected onPropertyChanged(e: NotifyArgs): void {
        // On property code change here
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'markdownEditor';
    }

    /**
     * For selecting all content in RTE
     * @private
     */
    private selectAll(): void {
        this.parent.formatter.editorManager.markdownSelection.setSelection(
            this.parent.contentModule.getEditPanel() as HTMLTextAreaElement,
            0,
            (this.parent.contentModule.getEditPanel() as HTMLTextAreaElement).value.length);
    }
    /**
     * For get a selected text in RTE
     * @private
     */
    private getSelectedHtml(e: NotifyArgs): void {
        e.callBack(
            this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                this.parent.contentModule.getEditPanel() as HTMLTextAreaElement
            )
        );
    }
}