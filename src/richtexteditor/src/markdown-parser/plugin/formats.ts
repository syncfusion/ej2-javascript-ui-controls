import { MarkdownParser } from './../base/markdown-parser';
import { IMarkdownSubCommands, IMDFormats } from './../base/interface';
import { MarkdownSelection } from './markdown-selection';
import { extend } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import * as CONSTANT from './../../markdown-parser/base/constant';
/**
 * MDFormats internal plugin
 *
 * @hidden
 * @private
 */
export class MDFormats {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;
    public syntax: { [key: string]: string };
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {IMDFormats} options - specifies the formats
     * @hidden
     * @private
     */
    public constructor(options: IMDFormats) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.FORMAT_TYPE, this.applyFormats, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.FORMAT_TYPE, this.applyFormats);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private applyFormats(e: IMarkdownSubCommands): void {
        e.subCommand = e.subCommand.toLowerCase();
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        if (this.isAppliedFormat(parents) === e.subCommand) {
            if (e.subCommand === 'pre') {
                if (parents.length > 1) {
                    this.applyCodeBlock(textArea, e, parents);
                } else {
                    return;
                }
            }
            this.cleanFormat(textArea);
            this.restore(textArea, textArea.selectionStart, textArea.selectionEnd, e);
            return;
        }
        if (e.subCommand === 'p') {
            this.cleanFormat(textArea);
            this.restore(textArea, textArea.selectionStart, textArea.selectionEnd, e);
            return;
        } else {
            if ((e.subCommand === 'pre' && parents.length !== 1) || e.subCommand !== 'pre') {
                this.cleanFormat(textArea, e.subCommand);
            }
        }
        let start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        let addedLength: number = 0;
        parents = this.selection.getSelectedParentPoints(textArea);
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
            if (parents[i as number].text !== '' && !this.selection.isStartWith(parents[i as number].text as string, '\\' + this.syntax[e.subCommand])) {
                parents[i as number].text = this.syntax[e.subCommand] + parents[i as number].text;
                textArea.value = textArea.value.substr(
                    0, parents[i as number].start as number) + parents[i as number].text + '\n' +
                    textArea.value.substr(parents[i as number].end as number, textArea.value.length);
                start = i === 0 ? start + this.syntax[e.subCommand].length : start;
                addedLength += this.syntax[e.subCommand].length;
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j as number].start = j !== 0 ?
                            this.syntax[e.subCommand].length + (parents[j as number].start as number) : parents[j as number].start;
                        parents[j as number].end = this.syntax[e.subCommand].length + (parents[j as number].end as number);
                    }
                }
            } else if (parents[i as number].text === '' && i === 0) {
                this.selection.save(start, end);
                if (this.selection.getSelectedText(textArea).length === 0) {
                    parents[i as number].text = this.syntax[e.subCommand];
                    textArea.value = textArea.value.substr(0, (parents[i as number].start as number)) + this.syntax[e.subCommand] +
                        textArea.value.substr((parents[i as number].end as number), textArea.value.length);
                    start = i === 0 ? start + this.syntax[e.subCommand].length : start;
                    addedLength += this.syntax[e.subCommand].length;
                }
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j as number].start = j !== 0 ? 1 + (parents[j as number].start as number) : parents[j as number].start;
                        parents[j as number].end = 1 + (parents[j as number].end as number);
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, e);
    }
    private clearRegex(): string {
        let regex: string = '';
        const configKey: string[] = Object.keys(this.syntax);
        for (let j: number = 0; j < configKey.length && configKey[j as number] !== 'pre' && configKey[j as number] !== 'p'; j++) {
            regex += regex === '' ? '^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j as number]].trim()) + ')' :
                '|^(' + this.selection.replaceSpecialChar(this.syntax[configKey[j as number]].trim()) + ')';
        }
        return regex;
    }

    private cleanFormat(textArea: HTMLTextAreaElement, command?: string): void {
        const parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        let removeLength: number = 0;
        if (this.selection.isClear(parents, this.clearRegex())) {
            for (let i: number = 0; i < parents.length; i++) {
                const configKey: string[] = Object.keys(this.syntax);
                for (let j: number = 0; parents[i as number].text !== '' && j < configKey.length; j++) {
                    const removeText: string = this.syntax[configKey[j as number]];
                    if (configKey[j as number] === command) {
                        continue;
                    }
                    // eslint-disable-next-line
                    const regex: RegExp = new RegExp('^(' + this.selection.replaceSpecialChar(removeText) + ')', 'gim');
                    if (regex.test(parents[i as number].text as string)) {
                        parents[i as number].text = (parents[i as number].text as string).replace(regex, '');
                        textArea.value = textArea.value.substr(
                            0, parents[i as number].start as number) + parents[i as number].text + '\n' +
                            textArea.value.substr(parents[i as number].end as number, textArea.value.length);
                        start = i === 0 ? (start - (removeText.length)) > 0 ? start - (removeText.length) : 0 : start;
                        removeLength += removeText.length;
                        if (parents.length !== 1) {
                            for (let k: number = 0; k < parents.length; k++) {
                                parents[k as number].start = k !== 0 ?
                                    (parents[k as number].start as number) - removeText.length : parents[k as number].start;
                                parents[k as number].end = (parents[k as number].end as number) - removeText.length;
                            }
                        }
                        break;
                    }
                }
                if (parents[i as number].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j: number = i; j < parents.length; j++) {
                            parents[j as number].start = j !== 0 ? 1 + (parents[j as number].start as number) : parents[j as number].start;
                            parents[j as number].end = 1 + (parents[j as number].end as number);
                        }
                    }
                }
            }
            this.restore(textArea, start, end - removeLength);
        }
    }

    private applyCodeBlock(
        textArea: HTMLTextAreaElement, event: IMarkdownSubCommands, parents: { [key: string]: string | number }[]): void {
        const command: string = event.subCommand;
        let start: number = parents[0].start as number;
        let end: number = parents[parents.length - 1].end as number;
        const parentLines: string[] = this.selection.getAllParents(textArea.value);
        const firstPrevText: string = parentLines[(parents[0].line as number) - 1];
        const lastNextText: string = parentLines[(parents.length + 1) + 1];
        // eslint-disable-next-line
        const addedLength: number = 0;
        if (!this.selection.isStartWith(firstPrevText, this.syntax.pre.split('\n')[0]) &&
            !this.selection.isStartWith(lastNextText, this.syntax.pre.split('\n')[0])) {
            const lines: string[] = textArea.value.substring(start, end).split('\n');
            const lastLine: string = lines[lines.length - 1] === '' ? '' : '\n';
            textArea.value = textArea.value.substr(
                0, start as number) + this.syntax[`${command}`] + textArea.value.substring(start, end) +
                lastLine + this.syntax[`${command}`] +
                textArea.value.substr(end as number, textArea.value.length);
            start = this.selection.selectionStart + this.syntax[`${command}`].length;
            end = this.selection.selectionEnd + this.syntax[`${command}`].length - 1;
        } else {
            const cmd: string = this.syntax[`${command}`];
            const selection: { [key: string]: string | number } = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
            const startNo: number = textArea.value.substr(0, textArea.selectionStart as number).lastIndexOf(cmd);
            let endNo: number = textArea.value.substr(textArea.selectionEnd as number, textArea.selectionEnd as number).indexOf(cmd);
            endNo = endNo + (selection.end as number);
            const repStartText: string = this.replaceAt(
                textArea.value.substr(0, selection.start as number), cmd, '', startNo, selection.start as number);
            const repEndText: string = this.replaceAt(
                textArea.value.substr(selection.end as number, textArea.value.length), cmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            start = this.selection.selectionStart - cmd.length;
            end = this.selection.selectionEnd - cmd.length;
        }
        this.restore(textArea, start, end, event);
    }
    private replaceAt(input: string, search: string, replace: string, start: number, end: number): string {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
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

    private isAppliedFormat(lines: { [key: string]: string | number }[], documentNode?: Node): string {
        let format: string = 'p';
        // eslint-disable-next-line
        const configKey: string[] = Object.keys(this.syntax);
        const keys: string[] = Object.keys(this.syntax);
        const direction: string = (this.parent.element as HTMLTextAreaElement).selectionDirection;
        const checkLine: string = direction === 'backward' ? lines[0].text as string : lines[lines.length - 1].text as string;
        for (let i: number = 0; !documentNode && i < keys.length; i++) {
            if (keys[i as number] !== 'pre' && this.selection.isStartWith(checkLine, this.syntax[keys[i as number]])) {
                format = keys[i as number];
                break;
            } else if (keys[i as number] === 'pre') {
                const parentLines: string[] = this.selection.getAllParents((this.parent.element as HTMLTextAreaElement).value);
                const firstPrevText: string = parentLines[(lines[0].line as number) - 1];
                const lastNextText: string = parentLines[lines.length + 1];
                if (this.selection.isStartWith(firstPrevText, this.syntax[keys[i as number]].split('\n')[0]) &&
                    this.selection.isStartWith(lastNextText, this.syntax[keys[i as number]].split('\n')[0])) {
                    format = keys[i as number];
                    break;
                }
            }
        }
        return format;
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
