import { MarkdownParser } from './../base/markdown-parser';
import { IMarkdownSubCommands, IMDFormats } from './../base/interface';
import { MarkdownSelection } from './markdown-selection';
import { extend } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import * as CONSTANT from './../../markdown-parser/base/constant';
/**
 * MDFormats internal plugin
 * @hidden
 */
export class MDFormats {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;
    public syntax: { [key: string]: string };
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(options: IMDFormats) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.FORMAT_TYPE, this.applyFormats, this);
    }

    private applyFormats(e: IMarkdownSubCommands): void {
        e.subCommand = e.subCommand.toLowerCase();
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        if (e.subCommand === 'p') {
            this.cleanFormat(textArea);
            this.restore(textArea, textArea.selectionStart, textArea.selectionEnd, e);
            return;
        } else {
            this.cleanFormat(textArea, e.subCommand);
        }
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let addedLength: number = 0;
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        if (e.subCommand === 'pre') {
            if (parents.length > 1) {
                this.applyCodeBlock(textArea, e, parents);
            } else {
                extend(e, e, { subCommand: 'InlineCode' }, true);
                this.parent.observer.notify(CONSTANT.selectionCommand, e);
            }
            return;
        }
        for (let i: number = 0; i < parents.length; i++) {
            if (parents[i].text !== '' && !this.selection.isStartWith(parents[i].text as string, '\\' + this.syntax[e.subCommand])) {
                parents[i].text = this.syntax[e.subCommand] + parents[i].text;
                textArea.value = textArea.value.substr(
                    0, parents[i].start as number) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end as number, textArea.value.length);
                start = i === 0 ? start + this.syntax[e.subCommand].length : start;
                addedLength += this.syntax[e.subCommand].length;
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ?
                            this.syntax[e.subCommand].length + (parents[j].start as number) : parents[j].start;
                        parents[j].end = this.syntax[e.subCommand].length + (parents[j].end as number);
                    }
                }
            } else if (parents[i].text === '' && i === 0) {
                this.selection.save(start, end);
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? 1 + (parents[j].start as number) : parents[j].start;
                        parents[j].end = 1 + (parents[j].end as number);
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, e);
    }
    private clearRegex(): string {
        let regex: string = '';
        let configKey: string[] = Object.keys(this.syntax);
        for (let j: number = 0; j < configKey.length && configKey[j] !== 'pre' && configKey[j] !== 'p'; j++) {
            regex += regex === '' ? '^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')' :
                '|^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j]].trim()) + ')';
        }
        return regex;
    }

    private cleanFormat(textArea: HTMLTextAreaElement, command?: string): void {
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let removeLength: number = 0;
        if (this.selection.isClear(parents, this.clearRegex())) {
            for (let i: number = 0; i < parents.length; i++) {
                let configKey: string[] = Object.keys(this.syntax);
                for (let j: number = 0; parents[i].text !== '' && j < configKey.length; j++) {
                    let removeText: string = this.syntax[configKey[j]];
                    if (configKey[j] === command) { continue; }
                    let regex: RegExp = new RegExp('^(' + this.selection.replaceSpecialChar(removeText) + ')', 'gim');
                    if (regex.test(parents[i].text as string)) {
                        parents[i].text = (parents[i].text as string).replace(regex, '');
                        textArea.value = textArea.value.substr(
                            0, parents[i].start as number) + parents[i].text + '\n' +
                            textArea.value.substr(parents[i].end as number, textArea.value.length);
                        start = i === 0 ? (start - (removeText.length)) > 0 ? start - (removeText.length) : 0 : start;
                        removeLength += removeText.length;
                        if (parents.length !== 1) {
                            for (let k: number = 0; k < parents.length; k++) {
                                parents[k].start = k !== 0 ?
                                    (parents[k].start as number) - removeText.length : parents[k].start;
                                parents[k].end = (parents[k].end as number) - removeText.length;
                            }
                        }
                        break;
                    }
                }
                if (parents[i].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j: number = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + (parents[j].start as number) : parents[j].start;
                            parents[j].end = 1 + (parents[j].end as number);
                        }
                    }
                }
            }
            this.restore(textArea, start, end - removeLength);
        }
    }

    private applyCodeBlock(
        textArea: HTMLTextAreaElement, event: IMarkdownSubCommands, parents: { [key: string]: string | number }[]): void {
        let command: string = event.subCommand;
        let start: number = parents[0].start as number;
        let end: number = parents[parents.length - 1].end as number;
        let parentLines: string[] = this.selection.getAllParents(textArea.value);
        let firstPrevText: string = parentLines[(parents[0].line as number) - 1];
        let lastNextText: string = parentLines[(parents.length + 1) + 1];
        let addedLength: number = 0;
        if (!this.selection.isStartWith(firstPrevText, this.syntax.pre.split('\n')[0]) &&
            !this.selection.isStartWith(lastNextText, this.syntax.pre.split('\n')[0])) {
            let lines: string[] = textArea.value.substring(start, end).split('\n');
            let lastLine: string = lines[lines.length - 1] === '' ? '' : '\n';
            textArea.value = textArea.value.substr(
                0, start as number) + this.syntax[command] + textArea.value.substring(start, end) +
                lastLine + this.syntax[command] +
                textArea.value.substr(end as number, textArea.value.length);
            start += this.syntax[command].length;
            end += this.syntax[command].length - 1;
        } else {
            start = textArea.selectionStart;
            end = textArea.selectionEnd;
        }
        this.restore(textArea, start, end, event);
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