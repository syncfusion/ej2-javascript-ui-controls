import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownItem } from './../base/interface';
import * as EVENTS from './../../common/constant';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class MDInsertText {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;

    /**
     * Constructor for creating the insert text plugin
     *
     * @param {MarkdownParser} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: MarkdownParser) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.INSERT_TEXT_COMMAND, this.InsertTextExec, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.INSERT_TEXT_COMMAND, this.InsertTextExec);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private InsertTextExec(e: IMarkdownItem): void {
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        textArea.focus();
        const start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        const text: string = e.value.text;
        const startOffset: number =  start + text.length;
        const endOffset: number = end + text.length;
        textArea.value = textArea.value.substr(0, start)
        + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, startOffset, endOffset);
        this.restore(textArea, startOffset, endOffset, e);
    }
    private restore(textArea: HTMLTextAreaElement, start: number, end: number, event?: IMarkdownItem): void {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
    public destroy(): void {
        this.removeEventListener();
    }
}
