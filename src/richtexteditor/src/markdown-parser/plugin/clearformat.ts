import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownSubCommands } from './../base/interface';
/**
 * Link internal component
 * @hidden
 */
export class ClearFormat {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;

    /**
     * Constructor for creating the clear format plugin
     * @hidden
     */
    constructor(parent: MarkdownParser) {
        this.parent = parent;
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.CLEAR_COMMAND, this.clear, this);
    }

    private replaceRegex(data: string): string {
        return data.replace(/\*/ig, '\\*').replace(/\&/ig, '\\&')
        .replace(/\-/ig, '\\-').replace(/\^/ig, '\\^')
        .replace(/\$/ig, '\\$').replace(/\./ig, '\\.')
        .replace(/\|/ig, '\\|').replace(/\?/ig, '\\?')
        .replace(/\+/ig, '\\+').replace(/\-/ig, '\\-')
        .replace(/\&/ig, '\\&');
    }

    private clearSelectionTags(text: string): string {
        let data: { [key: string]: string } = this.parent.selectionTags;
        let keys: string[] = Object.keys(data);
        for (let num: number = 0; num < keys.length; num++ ) {
            let key: string = keys[num];
            if (data.hasOwnProperty(key) && data[key] !== '') {
                let expString: string = this.replaceRegex(data[key]);
                let regExp: RegExp;
                let startExp: number;
                let endExp: number;
                if (data[key] === '<sup>') {
                    regExp = new RegExp('<sup>(.*?)<\/sup>', 'ig');
                } else if (data[key] === '<sub>') {
                    regExp = new RegExp('<sub>(.*?)<\/sub>', 'ig');
                } else {
                    regExp = new RegExp(expString + '(.*?)' + expString, 'ig');
                }
                startExp = data[key].length;
                endExp = (data[key] === '<sup>' || data[key] === '<sub>') ? data[key].length + 1 : data[key].length;
                let val: RegExpMatchArray = text.match(regExp);
                for (let index: number = 0; val && index < val.length && val[index] !== ''; index++) {
                    text = text.replace(val[index], val[index].substr(startExp, val[index].length - endExp - startExp ));
                }
            }
        }
        return text;
    }

    private clearFormatTags(text: string): string {
        let lines: string[] = text.split('\n');
        let tags: { [key: string]: string }[] = [ this.parent.formatTags , this.parent.listTags ];
        let str: string = '';
        for (let len: number = 0; len < lines.length; len++) {
            for (let num: number = 0; num < tags.length; num++) {
                let data: { [key: string]: string } =  tags[num];
                let keys: string[] = Object.keys(data);
                for (let index: number = 0; index < keys.length; index++ ) {
                    let key: string = keys[index];
                    if (data.hasOwnProperty(key) && data[key] !== '') {
                        if (lines[len].indexOf(data[key]) === 0) {
                            lines[len] = lines[len].replace(data[key], '');
                        }
                    }
                }
            }
            str = str + lines[len] + ((len !== lines.length - 1) ? '\n' : '');
        }
        return str;
    }

    private clear(e: IMarkdownSubCommands): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        textArea.focus();
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let text: string = this.selection.getSelectedText(textArea);
        text = this.clearSelectionTags(text);
        text =  this.clearFormatTags(text);
        textArea.value = textArea.value.substr(0, start)
        + text + textArea.value.substr(end, textArea.value.length);
        this.parent.markdownSelection.setSelection(textArea, start, start + text.length);
        this.restore(textArea, start, start + text.length, e);
    }

    private restore(textArea: HTMLTextAreaElement, start: number, end: number, event?: IMarkdownSubCommands): void {
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