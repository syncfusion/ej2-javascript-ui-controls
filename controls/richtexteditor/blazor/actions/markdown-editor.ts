import { extend, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import * as events from '../constant';
import * as classes from '../classes';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { MarkdownToolbarStatus } from './markdown-toolbar-status';
import { MarkdownFormatter } from '../formatter/markdown-formatter';
import { IToolbarItemModel, NotifyArgs } from '../../src/rich-text-editor/base/interface';
import { MarkdownSelection } from '../../src/markdown-parser/plugin/markdown-selection';

/**
 * `MarkdownEditor` module is used to markdown editor
 */
export class MarkdownEditor {
    private parent: SfRichTextEditor;
    private saveSelection: MarkdownSelection;
    private toolbarUpdate: MarkdownToolbarStatus;

    constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.saveSelection = new MarkdownSelection();
        this.parent.observer.on(events.initialEnd, this.render, this);
        this.parent.observer.on(events.markdownToolbarClick, this.onToolbarClick, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
        this.parent.observer.on(events.selectAll, this.selectAll, this);
        this.parent.observer.on(events.getSelectedHtml, this.getSelectedHtml, this);
        this.parent.observer.on(events.selectionSave, this.onSelectionSave, this);
        this.parent.observer.on(events.selectionRestore, this.onSelectionRestore, this);
        this.parent.observer.on(events.readOnlyMode, this.updateReadOnly, this);
    }
    private updateReadOnly(): void {
        if (this.parent.readonly) {
            this.parent.getEditPanel().setAttribute('readonly', 'readonly');
            addClass([this.parent.element], classes.CLS_RTE_READONLY);
        } else {
            this.parent.getEditPanel().removeAttribute('readonly');
            removeClass([this.parent.element], classes.CLS_RTE_READONLY);
        }
    }
    private onSelectionSave(): void {
        let textArea: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
        this.saveSelection.save(textArea.selectionStart, textArea.selectionEnd);
    }
    private onSelectionRestore(e: NotifyArgs): void {
        (this.parent.getEditPanel() as HTMLElement).focus();
        let textArea: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
        this.saveSelection.restore(textArea);
    }
    private onToolbarClick(args: ClickEventArgs): void {
        let text: string;
        let startOffset: number;
        let endOffset: number;
        let item: IToolbarItemModel = args.item as IToolbarItemModel;
        let textArea: HTMLTextAreaElement = (this.parent.getEditPanel() as HTMLTextAreaElement);
        textArea.focus();
        startOffset = textArea.selectionStart;
        endOffset = textArea.selectionEnd;
        text = textArea.value.substring(startOffset, endOffset);
        switch (item.subCommand) {
            case 'Maximize':
                this.parent.observer.notify(events.enableFullScreen, { args: args });
                break;
            case 'Minimize':
                this.parent.observer.notify(events.disableFullScreen, { args: args });
                break;
            case 'CreateLink':
                this.parent.observer.notify(events.insertLink, { member: 'link', args: args, text: text, module: 'Markdown' });
                break;
            case 'Image':
                this.parent.observer.notify(events.insertImage, { member: 'image', args: args, text: text, module: 'Markdown' });
                break;
            case 'CreateTable':
                let tableConstant: {} = {
                    'headingText': this.parent.localeData.headingText,
                    'colText': this.parent.localeData.colText
                };
                this.parent.formatter.process(this.parent, args, args.originalEvent, tableConstant);
                break;
            default:
                this.parent.formatter.process(this.parent, args, args.originalEvent, null);
                break;
        }
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.initialEnd, this.render);
        this.parent.observer.off(events.destroy, this.destroy);
        this.parent.observer.off(events.markdownToolbarClick, this.onToolbarClick);
        this.parent.observer.off(events.selectAll, this.selectAll);
        this.parent.observer.off(events.getSelectedHtml, this.getSelectedHtml);
        this.parent.observer.off(events.selectionSave, this.onSelectionSave);
        this.parent.observer.off(events.selectionRestore, this.onSelectionRestore);
        this.parent.observer.off(events.readOnlyMode, this.updateReadOnly);
    }
    private render(): void {
        let editElement: HTMLTextAreaElement = this.parent.getEditPanel() as HTMLTextAreaElement;
        let option: { [key: string]: number } = { undoRedoSteps: this.parent.undoRedoSteps, undoRedoTimer: this.parent.undoRedoTimer };
        if (isNullOrUndefined(this.parent.adapter)) {
            this.parent.formatter = new MarkdownFormatter({
                element: editElement,
                options: option
            });
        } else {
            this.parent.formatter = new MarkdownFormatter(extend({}, this.parent.adapter, {
                element: editElement,
                options: option
            }));
        }
        if (this.parent.toolbarSettings.enable) {
            this.toolbarUpdate = new MarkdownToolbarStatus(this.parent);
        }
        this.parent.observer.notify(events.bindOnEnd, {});
    }

    private selectAll(): void {
        this.parent.formatter.editorManager.markdownSelection.setSelection(
            this.parent.getEditPanel() as HTMLTextAreaElement,
            0,
            (this.parent.getEditPanel() as HTMLTextAreaElement).value.length);
    }
    private getSelectedHtml(e: NotifyArgs): void {
        e.callBack(
            this.parent.formatter.editorManager.markdownSelection.getSelectedText(
                this.parent.getEditPanel() as HTMLTextAreaElement
            )
        );
    }
    public destroy(): void {
        this.removeEventListener();
    }
}