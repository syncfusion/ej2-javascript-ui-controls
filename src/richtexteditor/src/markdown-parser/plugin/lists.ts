import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownSubCommands, IMDKeyboardEvent, IMDFormats } from './../base/interface';
import { extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';

/**
 * Lists internal component
 * @hidden
 */
export class MDLists {
    private parent: MarkdownParser;
    private startContainer: Element;
    private endContainer: Element;
    private selection: MarkdownSelection;
    private syntax: { [key: string]: string };
    private currentAction: string;
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     */
    constructor(options: IMDFormats) {
        extend(this, this, options, true);
        this.selection = this.parent.markdownSelection;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.LISTS_COMMAND, this.applyListsHandler, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler, this);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, this.keyUpHandler, this);
    }
    private keyDownHandler(event: IMDKeyboardEvent): void {
        switch (event.event.which) {
            case 9:
                this.tabKey(event);
                break;
        }
        switch ((event.event as KeyboardEventArgs).action) {
            case 'ordered-list':
                this.applyListsHandler({ subCommand: 'OL', callBack: event.callBack });
                event.event.preventDefault();
                break;
            case 'unordered-list':
                this.applyListsHandler({ subCommand: 'UL', callBack: event.callBack });
                event.event.preventDefault();
                break;
        }
    }
    private keyUpHandler(event: IMDKeyboardEvent): void {
        switch (event.event.which) {
            case 13:
                this.enterKey(event);
                break;
        }
    }
    private tabKey(event: IMDKeyboardEvent): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let addedLength: number = 0;
        let isNotFirst: boolean = this.isNotFirstLine(textArea, parents[0]);
        if (!isNotFirst && !event.event.shiftKey) {
            this.restore(textArea, start, end + addedLength, event);
            return;
        }
        let regex: RegExp = this.getListRegex();
        this.currentAction = this.getAction(parents[0].text as string);
        for (let i: number = 0; i < parents.length; i++) {
            let prevIndex: number = event.event.shiftKey ? (parents[i].line as number) : (parents[i].line as number) - 1;
            let prevLine: string = this.selection.getLine(textArea, prevIndex);
            if (prevLine && (!event.event.shiftKey && isNotFirst || (event.event.shiftKey && /^(\t)/.test(prevLine)))) {
                prevLine = prevLine.trim();
                if (regex.test(prevLine)) {
                    event.event.preventDefault();
                    let tabSpace: string = '\t';
                    let tabSpaceLength: number = event.event.shiftKey ? -tabSpace.length : tabSpace.length;
                    let splitTab: string[] = (parents[i].text as string).split('\t');
                    parents[i].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i].text;
                    textArea.value = textArea.value.substr(0, parents[i].start as number) + parents[i].text + '\n' +
                        textArea.value.substr(parents[i].end as number, textArea.value.length);
                    start = i === 0 ? start + tabSpaceLength : start;
                    addedLength += tabSpaceLength;
                    if (parents.length !== 1) {
                        for (let j: number = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? (parents[j].start as number) + tabSpaceLength : parents[j].start;
                            parents[j].end = (parents[j].end as number) + tabSpaceLength;
                        }
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, event);
    }
    private getTabSpace(line: string): string {
        let split: string[] = line.split('\t');
        let tabs: string = '';
        for (let i: number = 0; i < split.length; i++) {
            if (split[i] === '') {
                tabs += '\t';
            } else {
                break;
            }
        }
        return tabs;
    }

    private isNotFirstLine(textArea: HTMLTextAreaElement, points: { [key: string]: number | string }): boolean {
        let currentLine: string = points.text as string;
        let prevIndex: number = points.line as number - 1;
        let prevLine: string = this.selection.getLine(textArea, prevIndex);
        let regex: RegExp = this.getListRegex();
        let isNotFirst: boolean = false;
        if (prevLine && regex.test(prevLine.trim())) {
            let curTabSpace: string = this.getTabSpace(currentLine);
            let prevTabSpace: string = this.getTabSpace(prevLine);
            isNotFirst = curTabSpace === prevTabSpace ? true : isNotFirst;
            for (; prevTabSpace.length > curTabSpace.length; null) {
                prevIndex = prevIndex - 1;
                prevLine = this.selection.getLine(textArea, prevIndex);
                if (regex.test(prevLine.trim())) {
                    prevTabSpace = this.getTabSpace(prevLine);
                    if (prevTabSpace.length <= curTabSpace.length) {
                        isNotFirst = true;
                        break;
                    }
                }
            }
        }
        return isNotFirst;
    }
    private getAction(line: string): string {
        let ol: string = line.trim().split(new RegExp('^(' + this.selection.replaceSpecialChar(this.syntax.OL) + ')'))[1];
        let ul: string = line.trim().split(new RegExp('^(' + this.selection.replaceSpecialChar(this.syntax.UL) + ')'))[1];
        return (ol ? 'OL' : 'UL');
    }
    private enterKey(event: IMDKeyboardEvent): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let prevLine: string = this.selection.getLine(textArea, (parents[0].line as number) - 1);
        let regex: RegExp = this.getListRegex();
        if (regex.test(prevLine.trim()) && prevLine.trim().replace(regex, '') !== '') {
            let addedLength: number = 0;
            let tabSpace: string = this.getTabSpace(prevLine);
            this.currentAction = this.getAction(prevLine);
            let prefix: string = this.syntax[this.currentAction];
            parents[0].text = tabSpace + prefix + parents[0].text;
            textArea.value = textArea.value.substr(0, parents[0].start as number) + parents[0].text +
                textArea.value.substr(parents[0].end as number, textArea.value.length);
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
            this.restore(textArea, start, end + addedLength, event);
        }
    }

    private applyListsHandler(e: IMarkdownSubCommands): void {
        let textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        this.currentAction = e.subCommand;
        let start: number = textArea.selectionStart;
        let end: number = textArea.selectionEnd;
        let addedLength: number = 0;
        let parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let prefix: string = '';
        let regex: string = this.syntax[this.currentAction];
        for (let i: number = 0; i < parents.length; i++) {
            if (!this.selection.isStartWith(parents[i].text as string, regex)) {
                if (parents[i].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j: number = i; j < parents.length; j++) {
                            parents[j].start = j !== 0 ? 1 + (parents[j].start as number) : parents[j].start;
                            parents[j].end = 1 + (parents[j].end as number);
                        }
                    }
                }
                let replace: { [key: string]: number | string } = this.appliedLine(parents[i].text as string);
                prefix = replace.line ? prefix : this.syntax[this.currentAction];
                parents[i].text = replace.line ? replace.line : prefix + parents[i].text;
                replace.space = replace.space ? replace.space : 0;
                textArea.value = textArea.value.substr(0, parents[i].start as number) + parents[i].text + '\n' +
                    textArea.value.substr(parents[i].end as number, textArea.value.length);
                start = i === 0 ? (start + prefix.length + (replace.space as number)) > 0 ?
                    start + prefix.length + (replace.space as number) : 0 : start;
                addedLength += prefix.length + (replace.space as number);
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j].start = j !== 0 ? prefix.length +
                            (parents[j].start as number) + (replace.space as number) : parents[j].start;
                        parents[j].end = prefix.length + (parents[j].end as number) + (replace.space as number);
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, e);
    }
    private appliedLine(line: string): { [key: string]: number | string } {
        let points: { [key: string]: number | string } = {};
        let regex: RegExp = this.getListRegex();
        let isExist: boolean = regex.test(line.trim()) || line.trim() === this.syntax.OL.trim()
            || line.trim() === this.syntax.UL.trim();
        if (isExist) {
            let replace: string;
            let pattern: RegExp;
            let space: number = 0;
            if (this.selection.getRegex(this.syntax.OL).test(line.trim())) {
                pattern = this.selection.getRegex(this.syntax.OL);
                replace = this.syntax.UL;
                points.space = this.syntax.UL.length - this.syntax.OL.length;
            } else {
                pattern = this.selection.getRegex(this.syntax.UL);
                replace = this.syntax.OL;
                points.space = this.syntax.OL.length - this.syntax.UL.length;
            }
            points.line = this.getTabSpace(line) + line.trim().replace(pattern, replace);
        }
        return points;
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
    private getListRegex(): RegExp {
        let regex: string = '';
        let configKey: string[] = Object.keys(this.syntax);
        for (let j: number = 0; j < configKey.length; j++) {
            let syntax: string = this.selection.replaceSpecialChar(this.syntax[configKey[j]]);
            regex += regex === '' ? '^(' + syntax + ')|^(' + syntax.trim() + ')' :
                '|^(' + syntax + ')|^(' + syntax.trim() + ')';
        }
        return new RegExp(regex);
    }
}

