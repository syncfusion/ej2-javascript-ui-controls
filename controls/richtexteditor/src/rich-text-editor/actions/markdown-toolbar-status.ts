import { MarkdownSelection } from '../../markdown-parser/plugin/markdown-selection';
import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { IToolbarStatus } from '../../common/interface';
/**
 * MarkdownToolbarStatus module for refresh the toolbar status
 */
export class MarkdownToolbarStatus {
    public selection: MarkdownSelection;
    public parent: IRichTextEditor;
    public element: HTMLTextAreaElement;
    public toolbarStatus: IToolbarStatus;
    public constructor(parent: IRichTextEditor) {
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
        this.element = this.parent.contentModule.getEditPanel() as HTMLTextAreaElement;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.toolbarRefresh, this.onRefreshHandler, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    }
    private removeEventListener(): void {
        this.parent.off(events.toolbarRefresh, this.onRefreshHandler);
        this.parent.off(events.destroy, this.removeEventListener);
    }
    // eslint-disable-next-line
    private onRefreshHandler(args: { [key: string]: Node | Object }): void {
        const parentsLines: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(this.element);
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
        this.parent.notify(events.toolbarUpdated, this.toolbarStatus);
    }
    private isListsApplied(lines: { [key: string]: string | number }[], type: string): boolean {
        let isApply: boolean = true;
        if (type === 'OL') {
            for (let i: number = 0; i < lines.length; i++) {
                const lineSplit: string = (lines[i].text as string).trim().split(' ', 2)[0] + ' ';
                if (!/^[\d.]+[ ]+$/.test(lineSplit)) {
                    isApply = false;
                    break;
                }
            }
        } else {
            for (let i: number = 0; i < lines.length; i++) {
                if (!this.selection.isStartWith(lines[i].text as string, this.parent.formatter.listTags[type])) {
                    isApply = false;
                    break;
                }
            }
        }
        return isApply;
    }
    private currentFormat(lines: { [key: string]: string | number }[], documentNode: Node): string {
        let format: string = 'p';
        const keys: string[] = Object.keys(this.parent.formatter.formatTags);
        const direction: string = (this.element as HTMLTextAreaElement).selectionDirection;
        const checkLine: string = direction === 'backward' ? lines[0].text as string : lines[lines.length - 1].text as string;
        for (let i: number = 0; !documentNode && i < keys.length; i++) {
            if (keys[i] !== 'pre' && this.selection.isStartWith(checkLine, this.parent.formatter.formatTags[keys[i]])) {
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
        const textArea: HTMLTextAreaElement = this.parent.inputElement as HTMLTextAreaElement;
        const start: number = textArea.selectionStart;
        // eslint-disable-next-line
        const splitAt: Function = (index: number) => (x: string) => [x.slice(0, index), x.slice(index)];
        const splitText: string[] = splitAt(start)(textArea.value);
        const cmdPre: string = this.parent.formatter.formatTags.pre;
        const selectedText: string = this.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase()) {
            return true;
        } else if (selectedText === '') {
            const beforeText: string = textArea.value.substr(splitText[0].length - 1, 1);
            const afterText: string = splitText[1].substr(0, 1);
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