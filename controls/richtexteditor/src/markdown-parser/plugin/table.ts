import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownItem } from '../index';
import { IMDTable, MarkdownTableFormat } from './../base/interface';
import { extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
/**
 * Link internal component
 * @hidden
 */
export class MDTable {
    private parent: MarkdownParser;
    private selection: MarkdownSelection;
    private syntaxTag: { [key in MarkdownTableFormat]: { [key: string]: string } };
    private element: HTMLTextAreaElement;
    private locale: IMarkdownItem;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     */
    constructor(options: IMDTable) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.MD_TABLE, this.createTable, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
    }
    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.MD_TABLE, this.createTable);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown);
    }

    public destroy(): void {
        this.removeEventListener();
    }

    private onKeyDown(e: IMarkdownItem): void {
        if ((e.event as KeyboardEventArgs).action === 'insert-table') {
            e.item = e.value;
            this.createTable(e);
        }
    }

    private createTable(e: IMarkdownItem): void {
        this.element = this.parent.element as HTMLTextAreaElement;
        let start: number = this.element.selectionStart;
        let end: number = this.element.selectionEnd;
        let textAreaInitial: string;
        textAreaInitial = this.element.value;
        this.locale = e;
        this.selection.save(start, end);
        this.restore(this.element.selectionStart, this.element.selectionEnd, null);
        this.insertTable(start, end, textAreaInitial, e);
    }

    private getTable(): string {
        let table: string = '';
        table += this.textNonEmpty();
        table += this.tableHeader(this.locale);
        table += this.tableCell(this.locale);
        return table;
    }

    private tableHeader(e: IMarkdownItem): string {
        let text: string = '';
        for (let i: number = 1; i <= 2; i++) {
            text += '|';
            for (let j: number = 1; j <= 2; j++) {
                if (i === 1) {
                    text += e.item.headingText + ' ' + j + '|';
                } else {
                    text += '---------|';
                }
            }
            text += this.insertLine();
        }
        return text;
    }

    private tableCell(e: IMarkdownItem): string {
        let text: string = '';
        for (let i: number = 1; i <= 2; i++) {
            text += '|';
            for (let j: number = 1; j <= 2; j++) {
                text += e.item.colText + ' ' + this.convertToLetters(i) + j + '|';
            }
            text += this.insertLine();
        }
        text += this.insertLine();
        return text;
    }

    private insertLine(): string {
        let dummyElement: HTMLElement = document.createElement('div');
        dummyElement.innerHTML = '\n';
        return dummyElement.textContent;
    }

    private insertTable(start: number, end: number, textAreaInitial: string, e: IMarkdownItem): void {
        let parentText: { [key: string]: string | number; }[] = this.selection.getSelectedParentPoints(this.element);
        let lastLineSplit: string[] = (parentText[parentText.length - 1].text as string).split(' ', 2);
        let syntaxArr: string[] = this.getFormatTag();
        let syntaxCount: number = 0;
        if (lastLineSplit.length < 2) {
            this.element.value = this.updateValue(this.getTable());
            this.makeSelection(textAreaInitial, start, end);
        } else {
            if (this.ensureFormatApply(parentText[parentText.length - 1].text as string)) {
                this.checkValid(
                    start, end, this.getTable(), textAreaInitial, e,
                    lastLineSplit, parentText, syntaxArr);
            } else {
                this.element.value = this.updateValue(this.getTable());
                this.makeSelection(textAreaInitial, start, end);
            }
        }
        this.restore(this.element.selectionStart, this.element.selectionEnd, e);
    }

    private makeSelection(textAreaInitial: string, start: number, end: number): void {
        end = start + (textAreaInitial.length > 0 ? 12 : 10); //end is added 12 or 10 because to make the table heading selected
        start += textAreaInitial.length > 0 ? 3 : 1; // Start is added 3 or 1 because new lines are added when inserting table
        this.selection.setSelection(this.element, start, end);
    }
    private getFormatTag(): string[] {
        let syntaxFormatKey: string[] = Object.keys(this.syntaxTag.Formats);
        let syntaxListKey: string[] = Object.keys(this.syntaxTag.List);
        let syntaxArr: string[] = [];
        for (let i: number = 0; i < syntaxFormatKey.length; i++) {
            syntaxArr.push(this.syntaxTag.Formats[syntaxFormatKey[i]]);
        }
        for (let j: number = 0; j < syntaxListKey.length; j++) {
            syntaxArr.push(this.syntaxTag.List[syntaxListKey[j]]);
        }
        return syntaxArr;
    }

    private ensureFormatApply(line: string): boolean {
        let formatTags: string[] = this.getFormatTag();
        let formatSplitZero: string = line.trim().split(' ', 2)[0] + ' ';
        for (let i: number = 0; i < formatTags.length; i++) {
            if (formatSplitZero === formatTags[i] || /^[\d.]+[ ]+$/.test(formatSplitZero)) {
                return true;
            }
        }
        return false;
    }

    private ensureStartValid(firstLine: number, parentText: { [key: string]: string | number; }[]): boolean {
        let firstLineSplit: string[] = (parentText[0].text as string).split(' ', 2);
        for (let i: number = firstLine + 1; i <= firstLine + firstLineSplit[0].length + 1; i++) {
            if (this.element.selectionStart === i || this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    }

    private ensureEndValid(lastLine: number, formatSplitLength: number): boolean {
        for (let i: number = lastLine + 1; i <= lastLine + formatSplitLength + 1; i++) {
            if (this.element.selectionEnd === i) {
                return false;
            }
        }
        return true;
    }

    private updateValueWithFormat(formatSplit: string[], text: string): string {
        let textApplyFormat: string = this.element.value.substring(this.element.selectionEnd, this.element.value.length);
        text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
        return this.element.value.substr(0, this.element.selectionStart) + text;
    }

    private updateValue(text: string): string {
        return this.element.value.substr(0, this.element.selectionStart) + text +
            this.element.value.substr(this.element.selectionEnd, this.element.value.length);
    }

    private checkValid(
        start: number, end: number, text: string,
        textAreaInitial: string,
        e: IMarkdownItem, formatSplit: string[], parentText: { [key: string]: string | number; }[], syntaxArr: string[]): void {
        if (this.ensureStartValid(parentText[0].start as number, parentText) &&
            this.ensureEndValid(parentText[parentText.length - 1].start as number, formatSplit[0].length)) {
            if (start === parentText[0].start as number) {
                if (start !== end && end !== ((parentText[parentText.length - 1].end as number) - 1)) {
                    this.element.value = this.updateValueWithFormat(formatSplit, text);
                } else {
                    this.element.value = this.updateValue(text);
                }
            } else if (end === (parentText[parentText.length - 1].end as number) - 1) {
                this.element.value = this.updateValue(text);
            } else {
                this.element.value = this.updateValueWithFormat(formatSplit, text);
            }
            this.makeSelection(textAreaInitial, start, end);
        }
    }

    private convertToLetters(rowNumber: number): string {
        let baseChar: number = ('A').charCodeAt(0);
        let letters: string = '';
        do {
            rowNumber -= 1;
            letters = String.fromCharCode(baseChar + (rowNumber % 26)) + letters;
            rowNumber = (rowNumber / 26) >> 0;
        } while (rowNumber > 0);
        return letters;
    }

    private textNonEmpty(): string {
        let emptyText: string = '';
        if (this.isCursorBased() || this.isSelectionBased()) {
            if (this.element.value.length > 0) {
                emptyText += this.insertLine();
                emptyText += this.insertLine(); // to append two new line when textarea having content.               
            }
        }
        return emptyText;
    }

    private isCursorBased(): boolean {
        return this.element.selectionStart === this.element.selectionEnd;
    }

    private isSelectionBased(): boolean {
        return this.element.selectionStart !== this.element.selectionEnd;
    }

    private restore(start: number, end: number, event?: IMarkdownItem): void {
        this.selection.save(start, end);
        this.selection.restore(this.element);
        if (event && event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                selectedText: this.selection.getSelectedText(this.element),
                editorMode: 'Markdown',
                event: event.event
            });
        }
    }
}