import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownItem } from '../index';
/**
 * Link internal component
 * @hidden
 */
export class MDLink {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;

    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(parent: MarkdownParser) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.LINK_COMMAND, this.createLink, this);
    }

    private createLink(e: IMarkdownItem): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        textArea.focus();
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let text: string = (e.subCommand === 'Image') ? this.selection.getSelectedText(textArea) : e.item.text;
        let startOffset: number = (e.subCommand === 'Image') ? (start + 2) : (start + 1);
        let endOffset: number = (e.subCommand === 'Image') ? (end + 2) : (end + 1);
        text = (e.subCommand === 'Image') ? '![' + text + '](' + e.item.url + ')' : '[' + text + '](' + e.item.url + ')';
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
}