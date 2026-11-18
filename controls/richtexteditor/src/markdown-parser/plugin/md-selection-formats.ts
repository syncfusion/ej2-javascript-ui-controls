import { isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { MarkdownParser } from './../base/markdown-parser';
import * as CONSTANT from './../base/constant';
import { IMarkdownSubCommands, IMDKeyboardEvent, IMDFormats } from './../base/interface';
import { MarkdownSelection } from './markdown-selection';
import { extend } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
/**
 * SelectionCommands internal component
 *
 * @hidden
 * @private
 */
export class MDSelectionFormats {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;
    public syntax: { [key: string]: string };
    private currentAction: string;
    public constructor(parent: IMDFormats) {
        extend(this, this, parent, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.selectionCommand, this.applyCommands, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.selectionCommand, this.applyCommands);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private keyDownHandler(e: IMDKeyboardEvent): void {
        switch ((e.event as KeyboardEventArgs).action) {
        case 'bold':
            this.applyCommands({ subCommand: 'Bold', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'italic':
            this.applyCommands({ subCommand: 'Italic', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'strikethrough':
            this.applyCommands({ subCommand: 'StrikeThrough', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'uppercase':
            this.applyCommands({ subCommand: 'UpperCase', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'lowercase':
            this.applyCommands({ subCommand: 'LowerCase', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'superscript':
            this.applyCommands({ subCommand: 'SuperScript', callBack: e.callBack });
            e.event.preventDefault();
            break;
        case 'subscript':
            this.applyCommands({ subCommand: 'SubScript', callBack: e.callBack });
            e.event.preventDefault();
            break;
        }
    }
    private isBold(text: string, cmd: string): boolean {
        return text.search('\\' + cmd + '\\' + cmd + '') !== -1;
    }
    private isItalic(text: string, cmd: string): boolean {
        return text.search('\\' + cmd) !== -1;
    }
    private isMatch(text: string, cmd: string): string[] {
        let matchText: string[] = [''];
        switch (cmd) {
        case this.syntax.Italic:
            matchText = text.match(this.singleCharRegx(cmd));
            break;
        case this.syntax.InlineCode:
            matchText = text.match(this.singleCharRegx(cmd));
            break;
        case this.syntax.StrikeThrough:
            matchText = text.match(this.singleCharRegx(cmd));
            break;
        }
        return matchText;
    }
    private multiCharRegx(cmd: string): RegExp {
        const regExp: RegExpConstructor = RegExp;
        return new regExp('(\\' + cmd + '\\' + cmd + ')', 'g');
    }
    private singleCharRegx(cmd: string): RegExp {
        const regExp: RegExpConstructor = RegExp;
        return new regExp('(\\' + cmd + ')', 'g');
    }

    public isAppliedCommand(cmd?: string): | boolean {
        // eslint-disable-next-line
        const selectCmd: string = '';
        let isFormat: boolean = false;
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        const start: number = textArea.selectionStart;
        const splitAt: Function = (index: number) => (x: string) => [x.slice(0, index), x.slice(index)];
        const splitText: string[] = splitAt(start)(textArea.value);
        const cmdB: string = this.syntax.Bold.substr(0, 1);
        const cmdI: string = this.syntax.Italic;
        const selectedText: string = this.parent.markdownSelection.getSelectedText(textArea);
        if (selectedText !== '' && selectedText === selectedText.toLocaleUpperCase() && cmd === 'UpperCase') {
            return true;
        } else if (selectedText === '') {
            const beforeText: string = textArea.value.substr(splitText[0].length - 1, 1);
            const afterText: string = splitText[1].substr(0, 1);
            if ((beforeText !== '' && afterText !== '' && beforeText.match(/[a-z]/i)) &&
                beforeText === beforeText.toLocaleUpperCase() && afterText === afterText.toLocaleUpperCase() && cmd === 'UpperCase') {
                return true;
            }
        }
        if (!(this.isBold(splitText[0], cmdB)) && !(this.isItalic(splitText[0], cmdI)) && !(this.isBold(splitText[1], cmdB)) &&
            !(this.isItalic(splitText[1], cmdI))) {
            if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.StrikeThrough)) &&
                !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.StrikeThrough))) &&
                (this.isMatch(splitText[0], this.syntax.StrikeThrough).length % 2 === 1 &&
                    this.isMatch(splitText[1], this.syntax.StrikeThrough).length % 2 === 1) && cmd === 'StrikeThrough') {
                isFormat = true;
            }
            if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.InlineCode)) &&
                !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.InlineCode))) &&
                (this.isMatch(splitText[0], this.syntax.InlineCode).length % 2 === 1 &&
                    this.isMatch(splitText[1], this.syntax.InlineCode).length % 2 === 1) && cmd === 'InlineCode') {
                isFormat = true;
            }
            /* eslint-disable */
            if ((!isNullOrUndefined(splitText[0].match(/\<sub>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sub>/g))) &&
                (splitText[0].match(/\<sub>/g).length % 2 === 1 &&
                    splitText[1].match(/\<\/sub>/g).length % 2 === 1) && cmd === 'SubScript') {
                isFormat = true;
            }
            if ((!isNullOrUndefined(splitText[0].match(/\<sup>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sup>/g))) &&
                (splitText[0].match(/\<sup>/g).length % 2 === 1 && splitText[1].match(/\<\/sup>/g).length % 2 === 1) &&
                cmd === 'SuperScript') {
                isFormat = true;
            }
            /* eslint-enable */
        }
        if ((this.isBold(splitText[0], cmdB) && this.isBold(splitText[1], cmdB)) &&
            (splitText[0].match(this.multiCharRegx(cmdB)).length % 2 === 1 &&
                splitText[1].match(this.multiCharRegx(cmdB)).length % 2 === 1) && cmd === 'Bold') {
            isFormat = true;
        }
        splitText[0] = this.isBold(splitText[0], cmdB) ? splitText[0].replace(this.multiCharRegx(cmdB), '$%@') : splitText[0];
        splitText[1] = this.isBold(splitText[1], cmdB) ? splitText[1].replace(this.multiCharRegx(cmdB), '$%@') : splitText[1];
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.Italic)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.Italic))) &&
            (this.isMatch(splitText[0], this.syntax.Italic).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.Italic).length % 2 === 1) && cmd === 'Italic') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.StrikeThrough)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.StrikeThrough))) &&
            (this.isMatch(splitText[0], this.syntax.StrikeThrough).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.StrikeThrough).length % 2 === 1) && cmd === 'StrikeThrough') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(this.isMatch(splitText[0], this.syntax.InlineCode)) &&
            !isNullOrUndefined(this.isMatch(splitText[1], this.syntax.InlineCode))) &&
            (this.isMatch(splitText[0], this.syntax.InlineCode).length % 2 === 1 &&
                this.isMatch(splitText[1], this.syntax.InlineCode).length % 2 === 1) && cmd === 'InlineCode') {
            isFormat = true;
        }
        /* eslint-disable */
        if ((!isNullOrUndefined(splitText[0].match(/\<sub>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sub>/g))) &&
            (splitText[0].match(/\<sub>/g).length % 2 === 1 && splitText[1].match(/\<\/sub>/g).length % 2 === 1) && cmd === 'SubScript') {
            isFormat = true;
        }
        if ((!isNullOrUndefined(splitText[0].match(/\<sup>/g)) && !isNullOrUndefined(splitText[1].match(/\<\/sup>/g))) &&
            (splitText[0].match(/\<sup>/g).length % 2 === 1 && splitText[1].match(/\<\/sup>/g).length % 2 === 1) && cmd === 'SuperScript') {
            isFormat = true;
            /* eslint-enable */
        }
        return isFormat;
    }
    private applyCommands(e: IMarkdownSubCommands): void {
        this.currentAction = e.subCommand;
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        const start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        let addedLength: number = 0;
        const selection: { [key: string]: string | number } = this.parent.markdownSelection.getSelectedInlinePoints(textArea);
        if (this.isAppliedCommand(e.subCommand) && selection.text !== '') {
            const startCmd: string = this.syntax[e.subCommand];
            const endCmd: string = e.subCommand === 'SubScript' ? '</sub>' :
                e.subCommand === 'SuperScript' ? '</sup>' : this.syntax[e.subCommand];
            const startLength: number = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 : startCmd.length;
            const startNo: number = textArea.value.substr(0, selection.start as number).lastIndexOf(startCmd);
            let endNo: number = textArea.value.substr(selection.end as number, textArea.value.length).indexOf(endCmd);
            endNo = endNo + (selection.end as number);
            const repStartText: string = this.replaceAt(
                textArea.value.substr(0, selection.start as number), startCmd, '', startNo, selection.start as number);
            const repEndText: string = this.replaceAt(
                textArea.value.substr(selection.end as number, textArea.value.length), endCmd, '', 0, endNo);
            textArea.value = repStartText + selection.text + repEndText;
            this.restore(textArea, start - startLength, end - startLength, e);
            return;
        }
        if (selection.text !== '' && !this.isApplied(selection, e.subCommand)) {
            addedLength = (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') ? 0 :
                this.syntax[e.subCommand].length;
            const repStart: string = textArea.value.substr(
                selection.start as number - this.syntax[e.subCommand].length, this.syntax[e.subCommand].length);
            let repEnd: string;
            if ((repStart === e.subCommand) || ((selection.start as number - this.syntax[e.subCommand].length ===
                textArea.value.indexOf(this.syntax[e.subCommand])) && (selection.end as number === textArea.value.lastIndexOf(
                this.syntax[e.subCommand]) || selection.end as number === textArea.value.lastIndexOf(
                '</' + this.syntax[e.subCommand].substring(1, 5))))) {
                if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                    repEnd = textArea.value.substr(selection.end as number, this.syntax[e.subCommand].length + 1);
                } else {
                    repEnd = textArea.value.substr(selection.end as number, this.syntax[e.subCommand].length);
                }
                const repStartText: string = this.replaceAt(
                    textArea.value.substr(0, selection.start as number),
                    repStart, '', selection.start as number - this.syntax[e.subCommand].length, selection.start as number);
                const repEndText: string = this.replaceAt(
                    textArea.value.substr(selection.end as number, textArea.value.length), repEnd, '', 0, repEnd.length);
                textArea.value = repStartText + selection.text + repEndText;
                this.restore(textArea, start - addedLength, end - addedLength, e);
            } else {
                if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                    selection.text = this.syntax[e.subCommand] + selection.text
                        + '</' + this.syntax[e.subCommand].substring(1, 5);
                } else if (e.subCommand === 'UpperCase' || e.subCommand === 'LowerCase') {
                    selection.text = (e.subCommand === 'UpperCase') ? (selection.text as string).toUpperCase()
                        : (selection.text as string).toLowerCase();
                } else {
                    selection.text = this.syntax[e.subCommand] + selection.text + this.syntax[e.subCommand];
                }
                textArea.value = textArea.value.substr(0, selection.start as number) + selection.text +
                    textArea.value.substr(selection.end as number, textArea.value.length);
                this.restore(textArea, start + addedLength, end + addedLength, e);
            }
        } else if (e.subCommand !== 'UpperCase' && e.subCommand !== 'LowerCase') {
            if (e.subCommand === 'SubScript' || e.subCommand === 'SuperScript') {
                selection.text = this.textReplace(selection.text as string, e.subCommand);
                selection.text = this.syntax[e.subCommand] + selection.text
                    + '</' + this.syntax[e.subCommand].substring(1, 5);
            } else {
                selection.text = this.textReplace(selection.text as string, e.subCommand);
                selection.text = this.syntax[e.subCommand] + selection.text + this.syntax[e.subCommand];
            }
            textArea.value = textArea.value.substr(0, selection.start as number)
                + selection.text + textArea.value.substr(selection.end as number, textArea.value.length);
            addedLength = this.syntax[e.subCommand].length;
            if (selection.start === selection.end) {
                this.restore(textArea, start + addedLength, end + addedLength, e);
            } else {
                this.restore(textArea, start + addedLength, end - addedLength, e);
            }
        } else {
            this.restore(textArea, start, end, e);
        }
        this.parent.undoRedoManager.saveData();
    }
    private replaceAt(input: string, search: string, replace: string, start: number, end: number): string {
        return input.slice(0, start)
            + input.slice(start, end).replace(search, replace)
            + input.slice(end);
    }
    private restore(textArea: HTMLTextAreaElement, start: number, end: number, event?: IMarkdownSubCommands | IMDKeyboardEvent): void {
        this.selection.save(start, end);
        this.selection.restore(textArea);
        if (event && event.callBack) {
            event.callBack({
                requestType: this.currentAction,
                selectedText: this.selection.getSelectedText(textArea),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }

    private textReplace(text: string, command: string): string {
        let regx: RegExp = this.singleCharRegx(this.syntax[`${command}`]);
        switch (command) {
        case 'Bold':
            regx = this.multiCharRegx(this.syntax[`${command}`].substr(0, 1));
            text = text.replace(regx, '');
            break;
        case 'Italic':
            if (!this.isBold(text, this.syntax[`${command}`].substr(0, 1))) {
                text = text.replace(regx, '');
            } else {
                const regxB: RegExp = this.multiCharRegx(this.syntax[`${command}`].substr(0, 1));
                let repText: string = text;
                repText = repText.replace(regxB, '$%@').replace(regx, '');
                const regxTemp: RegExp = new RegExp('\\$%@', 'g');
                text = repText.replace(regxTemp, this.syntax[`${command}`].substr(0, 1) + this.syntax[`${command}`].substr(0, 1));
            }
            break;
        case 'StrikeThrough':
            text = text.replace(regx, '');
            break;
        case 'InlineCode':
            text = text.replace(regx, '');
            break;
        case 'SubScript':
            text = text.replace(/<sub>/g, '').replace(/<\/sub>/g, '');
            break;
        case 'SuperScript':
            text = text.replace(/<sup>/g, '').replace(/<\/sup>/g, '');
            break;
        }
        return text;
    }
    private isApplied(line: { [key: string]: string | number }, command: string): boolean | void {
        let regx: RegExp = this.singleCharRegx(this.syntax[`${command}`]);
        let regExp: RegExpConstructor;
        switch (command) {
        case 'SubScript':
        case 'SuperScript':
            regx = this.singleCharRegx(this.syntax[`${command}`]);
            return regx.test(line.text as string);
        case 'Bold':
        case 'StrikeThrough':
            regx = this.multiCharRegx(this.syntax[`${command}`].substr(0, 1));
            return regx.test(line.text as string);
        case 'UpperCase':
        case 'LowerCase':
            regExp = RegExp;
            regx = new regExp('^[' + this.syntax[`${command}`] + ']*$', 'g');
            return regx.test(line.text as string);
        case 'Italic': {
            let regTest: boolean;
            const regxB: RegExp = this.multiCharRegx(this.syntax[`${command}`].substr(0, 1));
            if (regxB.test(line.text as string)) {
                let repText: string = line.text as string;
                repText = repText.replace(regxB, '$%#');
                regTest = regx.test(repText);
            } else {
                regTest = regx.test(line.text as string);
            }
            return regTest; }
        case 'InlineCode':
            return regx.test(line.text as string);
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
