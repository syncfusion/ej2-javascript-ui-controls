import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownItem } from '../index';
/**
 * Link internal component
 * @hidden
 */
export class MDTable {
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
        this.parent.observer.on(CONSTANT.MD_TABLE, this.createTable, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.MD_TABLE, this.createTable);
    }

    public destroy(): void {
        this.removeEventListener();
    }

    private createTable(e: IMarkdownItem): void {
        let dummy: Document = document;
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        textArea.focus();
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let end3: number;
        let text: string = this.selection.getSelectedText(textArea);
        let end1: number;
        let textEmpty: string;
        let textAreaInitial: string;
        if (start !== end) { // It will check start !== end and will clear the text selected.
            textEmpty = text.replace(text, '');
            end1 = end;
            end3 = start;
            text = textEmpty;
        } else {
            end3 = end;
        }
        text += this.textUnEmpty(start, end3, dummy, text, end1, textArea);
        for (let i: number = 1; i <= 2; i++) {
            text +=  '|';
            for (let j: number = 1; j <= 2; j++) {
                if (i === 1) {
                    text += e.item.headingText + ' ' + j + '|';
                } else {
                    text += '---------|';
                }
            }
            let dummyElement: HTMLElement = dummy.createElement('div');
            dummyElement.innerHTML = '\n';
            let text1: string = dummyElement.textContent;
            text += text1;
        }
        for (let i: number = 1; i <= 2; i++) {
            text += '|';
            for (let j: number = 1; j <= 2; j++) {
                text += e.item.colText + ' ' +  this.convertToLetters(i) + j + '|';
            }
            let dummyElement: HTMLElement = dummy.createElement('div');
            dummyElement.innerHTML = '\n';
            let text1: string = dummyElement.textContent;
            text += text1;
        }
        text = this.textUnEmpty(start, end3, dummy, text, end1, textArea);
        textAreaInitial = textArea.value;
        if (start !== end) {
            this.startNotEqualEnd(start, end, text, textArea, textAreaInitial, e);
        } else if (start === 0 && end === 0) {
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
            if (textAreaInitial.length) {
                this.restore(textArea, start + 3, end + 12, e);
            } else {
                this.restore(textArea, start + 1, end + 10, e);
            }
        } else {
            this.startEqualEnd(start, end, text, textArea, textAreaInitial, e);
        }
    }

    private startEqualEnd(
        start: number, end: number, text: string,
        textArea: HTMLTextAreaElement, textAreaInitial: string, e: IMarkdownItem): void {
        let parentText: { [key: string]: string | number; }[] = this.selection.getSelectedParentPoints(textArea);
        let selectedLine: number = parentText.length - 1;
        let formatSplit: string[];
        formatSplit = (parentText[selectedLine].text as string).split(' ', 2);
        let textApplyFormat: string;
        let parentTextLength: number;
        if (formatSplit.length > 1) {
            parentTextLength = formatSplit[0].length + formatSplit[1].length + 1;
        }
        textApplyFormat = textArea.value.substring(end, textArea.value.length);
        if (start === parentTextLength) {
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
            this.callRestore(textArea, start, end, e, textAreaInitial);
        } else if (textArea.value[start] === '2' && textArea.value[start + 1] === '.') {
            text = '';
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
        } else if (!(textArea.value[start] === '#' || textArea.value[start - 1] === '#' ||
        textArea.value[start - 2] === '#' || textArea.value[start] === '2.' ||
        textArea.value[start - 1] === '2.' || textArea.value[start - 2] === '2.' || (textArea.value[start - 1] === '2' &&
        textArea.value[start] === '.') || (textArea.value[start - 1] === '.' && textArea.value[start] === ' ') ||
        (textArea.value[start - 1] === ' ' &&
        textArea.value[start - 2] === '.' && textArea.value[start - 3] === '2') ||
        textArea.value[start] === '>' || textArea.value[start - 1] === '>' || textArea.value[start - 2] === '>' ||
        textArea.value[start] === '+' || textArea.value[start - 1] === '+' || textArea.value[start - 2] === '+')) {
            if (!((parentText[0].text as string).match('#') || (parentText[0].text as string).match('>') ||
            (parentText[0].text as string).match('2.'))) {
                formatSplit[0] = '';
            }
            text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
            textArea.value = textArea.value.substr(0, start)
                + text;
            this.callRestore(textArea, start, end, e, textAreaInitial);
        } else {
            text = '';
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
        }
    }

    private startNotEqualEnd(
        start: number, end: number, text: string, textArea: HTMLTextAreaElement,
        textAreaInitial: string, e: IMarkdownItem): void {
        let parentText: { [key: string]: string | number; }[] = this.selection.getSelectedParentPoints(textArea);
        let textApplyFormat: string;
        textApplyFormat = textArea.value.substring(end, textArea.value.length);

        if (parentText.length < 2) {
            this.singleLine(start, end, text, textArea, parentText, textApplyFormat, textAreaInitial, e);
        } else {
            this.multipleLines(start, end, text, textArea, parentText, textApplyFormat, textAreaInitial, e);
        }
    }
    private singleLine(
        start: number, end: number, text: string, textArea: HTMLTextAreaElement,
        parentText: { [key: string]: string | number; }[], textApplyFormat: string, textAreaInitial: string, e: IMarkdownItem): void {
        let formatSplit: string[];
        formatSplit = (parentText[0].text as string).split(' ', 2);
        let selectedText: string;
        selectedText = this.selection.getSelectedText(textArea);
        let selectedTextSplit: string[];
        selectedTextSplit = selectedText.split(' ', 2);
        if (selectedTextSplit.length === 2) {
            this.selectedSplitText(
                start, end, text, textArea, selectedText, parentText,
                formatSplit, textApplyFormat, e, textAreaInitial, selectedTextSplit);
        } else {
            if (textArea.value[start - 1] === ' ' && (textArea.value[start - 2] === '.' || textArea.value[start - 2] === '#' ||
            textArea.value[start - 2] === '>' || textArea.value[start - 2] === '+')) {
                text = '';
                start += selectedText.length;
                textArea.value = textArea.value.substr(0, start)
                    + text + textArea.value.substr(end, textArea.value.length);
            } else if (textArea.value[start] === '>' || textArea.value[start] === '+' || (textArea.value[start] === '2' &&
            textArea.value[start + 1] === '.') || (textArea.value[start] === '#' && textArea.value[start - 1] !== '#')) {
                if (textArea.value[end - 2] === '>' || textArea.value[end - 1] === '+' || textArea.value[end - 1] === '2' ||
                textArea.value[end - 1] === '#' || (textArea.value[end - 1] === '.' && textArea.value[end - 2] === '2') ||
                (textArea.value[end - 1] === ' ' && (textArea.value[end - 2] === '.' || textArea.value[end - 2] === '#' ||
                textArea.value[end - 2] === '>' || textArea.value[end - 2] === '+'))) {
                    text = '';
                    start += selectedText.length;
                    textArea.value = textArea.value.substr(0, start)
                        + text + textArea.value.substr(end, textArea.value.length);
                } else {
                    if (!((parentText[0].text as string).match('#') || (parentText[0].text as string).match('>') ||
                    (parentText[0].text as string).match('2.'))) {
                        formatSplit[0] = '';
                    }
                    text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
                    textArea.value = textArea.value.substr(0, start)
                        + text;
                    this.callRestore(textArea, start, end, e, textAreaInitial);
                }
            } else {
                if (end === formatSplit[0].length + formatSplit[1].length + 1) {
                    textArea.value = textArea.value.substr(0, start)
                        + text + textArea.value.substr(end, textArea.value.length);
                    this.callRestore(textArea, start, end, e, textAreaInitial);
                } else {
                    if (!((parentText[0].text as string).match('#') || (parentText[0].text as string).match('>') ||
                    (parentText[0].text as string).match('2.'))) {
                        formatSplit[0] = '';
                    }
                    text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
                    textArea.value = textArea.value.substr(0, start)
                        + text;
                    this.callRestore(textArea, start, end, e, textAreaInitial);
                }
            }
        }
    }
    private selectedSplitText(
        start: number, end: number, text: string, textArea: HTMLTextAreaElement,
        selectedText: string, parentText: { [key: string]: string | number; }[],
        formatSplit: string[], textApplyFormat: string, e: IMarkdownItem, textAreaInitial: string,
        selectedTextSplit: string[]): void {
        if (selectedTextSplit[0] === '') {
            if (textArea.value[start - 1] === '#' || textArea.value[start - 1] === '.' ||
            textArea.value[start - 1] === '>' || textArea.value[start - 1] === '+') {
                text = '';
                start += selectedText.length;
                textArea.value = textArea.value.substr(0, start)
                    + text + textArea.value.substr(end, textArea.value.length);
            } else {
                if (!((parentText[0].text as string).match('#') || (parentText[0].text as string).match('>') ||
                (parentText[0].text as string).match('2.'))) {
                    formatSplit[0] = '';
                }
                text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
                textArea.value = textArea.value.substr(0, start)
                    + text;
                this.callRestore(textArea, start, end, e, textAreaInitial);
            }
        } else {
            if (textArea.value[start] === '>' || textArea.value[start] === '+' || textArea.value[start] === '#' ||
            textArea.value[start] === '2' || (textArea.value[start] === '.' && textArea.value[start - 1] === '2')) {
                if (selectedText.length === (formatSplit[0].length + formatSplit[1].length + 1)) {
                    textArea.value = textArea.value.substr(0, start)
                        + text + textArea.value.substr(end, textArea.value.length);
                } else if (textArea.value[start] === '>' || textArea.value[start] === '+' || (textArea.value[start] === '2' &&
                textArea.value[start + 1] === '.') || (textArea.value[start] === '#' && textArea.value[start - 1] !== '#')) {
                    if (!(textArea.value[end - 2] === '>' || textArea.value[end - 1] === '+' || textArea.value[end - 1] === '#' ||
                    (textArea.value[end - 1] === '.' && textArea.value[end - 2] === '2') || (textArea.value[end - 1] === ' ' &&
                    (textArea.value[end - 2] === '.' || textArea.value[end - 2] === '#' || textArea.value[end - 2] === '>' ||
                    textArea.value[end - 2] === '+')))) {
                        if (!((parentText[0].text as string).match('#') || (parentText[0].text as string).match('>') ||
                        (parentText[0].text as string).match('2.'))) {
                            formatSplit[0] = '';
                        }
                        text += textApplyFormat.replace(textApplyFormat, (formatSplit[0] + ' ' + textApplyFormat));
                        textArea.value = textArea.value.substr(0, start)
                            + text;
                        this.callRestore(textArea, start, end, e, textAreaInitial);
                    } else {
                        text = '';
                        start += selectedText.length;
                        textArea.value = textArea.value.substr(0, start)
                            + text + textArea.value.substr(end, textArea.value.length);
                    }
                } else {
                    text = '';
                    start += selectedText.length;
                    textArea.value = textArea.value.substr(0, start)
                        + text + textArea.value.substr(end, textArea.value.length);
                }
            }
        }
    }
    private multipleLines(
        start: number, end: number, text: string,
        textArea: HTMLTextAreaElement, parentText: { [key: string]: string | number; }[],
        textApplyFormat: string, textAreaInitial: string, e: IMarkdownItem): void {
        let lastSelectedLineIndex: number = parentText.length - 1;
        let formatLastLine: string[];
        formatLastLine = (parentText[lastSelectedLineIndex].text as string).split(' ', 2);
        let formatFirstLine: string[];
        formatFirstLine = (parentText[0].text as string).split(' ', 2);
        let selectedText: string;
        selectedText = this.selection.getSelectedText(textArea);
        if (textArea.value[start - 1] === '#' || (textArea.value[start - 1] === '.' && textArea.value[start - 2] === '2') ||
        textArea.value[start - 1] === '>' || textArea.value[start - 1] === '+' ||
        textArea.value[start - 1] === '2' || (textArea.value[start - 1] === ' ' &&
        (textArea.value[start - 2] === '#' || textArea.value[start - 2] === '>' ||
        textArea.value[start - 2] === '+' || textArea.value[start - 2] === '.'))) {
            text = '';
            start += selectedText.length;
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
        } else if (textArea.value[end] === '#' || textArea.value[end] === '>' || textArea.value[end] === '+' ||
        textArea.value[end] === '2' || (textArea.value[end] === '.' && textArea.value[end - 1] === '2') ||
        (textArea.value[end - 1] === ' ' && (textArea.value[end - 2] === '.' || textArea.value[end - 2] === '#' ||
        textArea.value[end - 2] === '>' || textArea.value[end - 2] === '+')) || (textArea.value[end] === ' ' &&
        (textArea.value[end - 1] === '#' || textArea.value[end - 1] === '>' || textArea.value[end - 1] === '+' ||
        textArea.value[end - 1] === '.'))) {
            text = '';
            start += selectedText.length;
            textArea.value = textArea.value.substr(0, start)
                + text + textArea.value.substr(end, textArea.value.length);
        } else {
            if (!((parentText[lastSelectedLineIndex].text as string).match('#') ||
            (parentText[lastSelectedLineIndex].text as string).match('>') ||
            (parentText[lastSelectedLineIndex].text as string).match('2.'))) {
                formatLastLine[0] = '';
            }
            text += textApplyFormat.replace(textApplyFormat, (formatLastLine[0] + ' ' + textApplyFormat));
            textArea.value = textArea.value.substr(0, start)
                + text;
            this.callRestore(textArea, start, end, e, textAreaInitial);
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
    private textUnEmpty(start: number, end: number, dummy: Document, text: string, end1: number, textArea: HTMLTextAreaElement): string {
        if (start === end && ((start !== 0 && end !== 0) || end1 !== 0)) {
            let dummyElement: HTMLElement = dummy.createElement('div');
            if (!(text.length > 0)) {
                if (textArea.value.length > 0) {
                    dummyElement.innerHTML = '\n\n';
                } else {
                    dummyElement.innerHTML = '';
                }
            } else {
                dummyElement.innerHTML = '\n';
            }
            let text1: string = dummyElement.textContent;
            return text += text1;
        } else {
            return text;
        }
    }
    private callRestore(textArea: HTMLTextAreaElement, start: number, end: number, e: IMarkdownItem, textAreaInitial: string): void {
        if (textAreaInitial.length) {
            this.restore(textArea, start + 3, start + 12, e);
        } else {
            this.restore(textArea, start + 1, end + 10, e);
        }
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