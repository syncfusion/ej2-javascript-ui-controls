import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { IToolbarStatus } from '../../src/common/interface';
import { MarkdownSelection } from '../../src/markdown-parser/plugin/markdown-selection';

/**
 * MarkdownToolbarStatus module for refresh the toolbar status
 */
export class MarkdownToolbarStatus {
    public selection: MarkdownSelection;
    public parent: SfRichTextEditor;
    public element: HTMLTextAreaElement;
    public toolbarStatus: IToolbarStatus;

    constructor(parent: SfRichTextEditor) {
        this.toolbarStatus = {
            bold: false,
            italic: false,
            subscript: false,
            superscript: false,
            strikethrough: false,
            orderedlist: false,
            uppercase: false,
            inlinecode: false,
            unorderedlist: false,
            underline: false,
            alignments: null,
            backgroundcolor: null,
            fontcolor: null,
            fontname: null,
            fontsize: null,
            formats: null
        };
        this.selection = new MarkdownSelection();
        this.parent = parent;
        this.element = this.parent.getEditPanel() as HTMLTextAreaElement;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.observer.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.observer.off(events.destroy, this.removeEventListener);
    }
    private onRefreshHandler(args: { [key: string]: Node | Object }): void {
        let parentsLines: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(this.element);
        this.toolbarStatus = {
            orderedlist: args.documentNode ? false : this.isListsApplied(parentsLines, 'OL'),
            unorderedlist: args.documentNode ? false : this.isListsApplied(parentsLines, 'UL'),
            formats: this.currentFormat(parentsLines, args.documentNode as Node),
            bold: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('Bold'),
            italic: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('Italic'),
            inlinecode: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('InlineCode'),
            strikethrough: args.documentNode ? false :
                this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('StrikeThrough'),
            subscript: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('SubScript'),
            superscript: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('SuperScript'),
            uppercase: args.documentNode ? false : this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('UpperCase')
        };
        if (this.parent.formatter.editorManager.mdSelectionFormats.isAppliedCommand('InlineCode')) {
            this.toolbarStatus.formats = 'pre';
        }
        this.parent.observer.notify(events.toolbarUpdated, this.toolbarStatus);
    }
    private isListsApplied(lines: { [key: string]: string | number }[], type: string): boolean {
        let isApply: boolean = true;
        if (type === 'OL') {
            for (let i: number = 0; i < lines.length; i++) {
                let lineSplit: string = (lines[i].text as string).trim().split(' ', 2)[0] + ' ';
                if (!/^[\d.]+[ ]+$/.test(lineSplit)) {
                    isApply = false;
                    break;
                }
            }
        } else {
            for (let i: number = 0; i < lines.length; i++) {
                if (!this.selection.isStartWith(lines[i].text as string, this.parent.formatter.listSyntax[type])) {
                    isApply = false;
                    break;
                }
            }
        }
        return isApply;
    }
    private currentFormat(lines: { [key: string]: string | number }[], documentNode: Node): string {
        let format: string = 'p';
        let keys: string[] = Object.keys(this.parent.formatter.formatSyntax);
        let direction: string = (this.element as HTMLTextAreaElement).selectionDirection;
        let checkLine: string = direction === 'backward' ? lines[0].text as string : lines[lines.length - 1].text as string;
        for (let i: number = 0; !documentNode && i < keys.length; i++) {
            if (keys[i] !== 'pre' && this.selection.isStartWith(checkLine, this.parent.formatter.formatSyntax[keys[i]])) {
                format = keys[i];
                break;
            } else if (keys[i] === 'pre') {
                if (this.codeFormat()) {
                    format = keys[i];
                    break;
                }
            }
        }
        return format;
    }
    private codeFormat(): boolean {
        let isFormat: boolean = false;
        let textArea: HTMLTextAreaElement = this.parent.inputElement as HTMLTextAreaElement;
        let start: number = textArea.selectionStart;
        let splitAt: Function = (index: number) => (x: string) => [x.slice(0, index), x.slice(index)];
        let splitText: string[] = splitAt(start)(textArea.value);
        let cmdPre: string = this.parent.formatter.formatSyntax.pre;
        let selectedText: string = this.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase()) {
            return true;
        } else if (selectedText === '') {
            let beforeText: string = textArea.value.substr(splitText[0].length - 1, 1);
            let afterText: string = splitText[1].substr(0, 1);
            if ((beforeText !== '' && afterText !== '' && beforeText.match(/[a-z]/i)) &&
                beforeText === beforeText.toLocaleUpperCase() && afterText === afterText.toLocaleUpperCase()) {
                return true;
            }
        }
        if ((this.isCode(splitText[0], cmdPre) && this.isCode(splitText[1], cmdPre)) &&
            (splitText[0].match(this.multiCharRegx(cmdPre)).length % 2 === 1 &&
                splitText[1].match(this.multiCharRegx(cmdPre)).length % 2 === 1)) {
            isFormat = true;
        }
        return isFormat;
    }
    private getSelectedText(textarea: HTMLTextAreaElement): string {
        return textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    }
    private isCode(text: string, cmd: string): boolean {
        return text.search('\\' + cmd + '') !== -1;
    }
    private multiCharRegx(cmd: string): RegExp {
        return new RegExp('(\\' + cmd + ')', 'g');
    }
}