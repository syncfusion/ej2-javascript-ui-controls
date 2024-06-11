import { MarkdownParser } from './../base/markdown-parser';
import { MarkdownSelection } from './../plugin/markdown-selection';
import * as CONSTANT from './../base/constant';
import { IMarkdownSubCommands, IMDKeyboardEvent, IMDFormats } from './../base/interface';
import { extend, KeyboardEventArgs } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Lists internal component
 *
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
     *
     * @param {IMDFormats} options - specifies the options
     * @hidden
     */
    public constructor(options: IMDFormats) {
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
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        const parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let addedLength: number = 0;
        const isNotFirst: boolean = this.isNotFirstLine(textArea, parents[0]);
        if (!isNotFirst && !event.event.shiftKey) {
            this.restore(textArea, start, end + addedLength, event);
            return;
        }
        const listFormat: number = this.olListType();
        const regex: RegExp = this.getListRegex();
        this.currentAction = this.getAction(parents[0].text as string);
        for (let i: number = 0; i < parents.length; i++) {
            // eslint-disable-next-line max-len
            let prevIndex: number = event.event.shiftKey ? (parents[i as number].line as number) - 1 : (parents[i as number].line as number) - 1;
            let prevLine: string = this.selection.getLine(textArea, prevIndex);
            if (prevLine && (!event.event.shiftKey && isNotFirst || (event.event.shiftKey))) {
                const prevLineSplit: string[] = prevLine.split('. ');
                const tabSpace: string = '\t';
                const tabSpaceLength: number = event.event.shiftKey ? -tabSpace.length : tabSpace.length;
                const splitTab: string[] = (parents[i as number].text as string).split('\t');
                if (event.event.shiftKey && splitTab.length === 1) {
                    break;
                }
                if (this.currentAction === 'OL' && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat) {
                    event.event.preventDefault();
                    parents[i as number].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i as number].text;
                    const curTabSpace: string = this.getTabSpace(parents[i as number].text as string);
                    let prevTabSpace: string = this.getTabSpace(prevLine);
                    const splitText: string[] = (parents[i as number].text as string).split('. ');
                    if (curTabSpace === prevTabSpace) {
                        this.changeTextAreaValue(
                            splitText, this.nextOrderedListValue(prevLineSplit[0].trim()),
                            event, textArea, parents, i, end);
                    } else if (prevTabSpace < curTabSpace) {
                        this.changeTextAreaValue(splitText, '1. ', event, textArea, parents, i, end);
                    } else {
                        for (; prevTabSpace.length > curTabSpace.length; null) {
                            prevIndex = prevIndex - 1;
                            prevLine = this.selection.getLine(textArea, prevIndex);
                            const prevLineSplit: string[] = prevLine.trim().split('. ');
                            if (/^\d+$/.test(prevLineSplit[0])) {
                                prevTabSpace = this.getTabSpace(prevLine);
                                if (prevTabSpace.length <= curTabSpace.length) {
                                    this.changeTextAreaValue(
                                        splitText, this.nextOrderedListValue(prevLineSplit[0]),
                                        event, textArea, parents, i, end);
                                    break;
                                }
                            }
                        }
                    }
                } else if (this.currentAction === 'UL' && regex.test(prevLine.trim()) || !listFormat) {
                    event.event.preventDefault();
                    parents[i as number].text = event.event.shiftKey ? splitTab.splice(1, splitTab.length).join('\t') : tabSpace + parents[i as number].text;
                    textArea.value = textArea.value.substr(0, parents[i as number].start as number) + parents[i as number].text + '\n' +
                        textArea.value.substr(parents[i as number].end as number, textArea.value.length);
                }
                start = i === 0 ? start + tabSpaceLength : start;
                addedLength += tabSpaceLength;
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        // eslint-disable-next-line max-len
                        parents[j as number].start = j !== 0 ? (parents[j as number].start as number) + tabSpaceLength : parents[j as number].start;
                        parents[j as number].end = (parents[j as number].end as number) + tabSpaceLength;
                    }
                }
            }
        }
        this.restore(textArea, start, end + addedLength, event);
    }
    private changeTextAreaValue(
        splitText: string[], prefixValue: string, event: IMDKeyboardEvent,
        // eslint-disable-next-line
        textArea: HTMLTextAreaElement, parents: { [key: string]: string | number }[], k: number, end: number): void {
        const prefix: string = prefixValue;
        splitText.splice(0, 1);
        const textAreaLength: number = this.selection.getAllParents(textArea.value).length;
        let changedList: string = '';
        const curTabSpace: string = this.getTabSpace(parents[k as number].text as string);
        // eslint-disable-next-line
        let prefixNumber: number = parseInt(prefix.split('.')[0], null);
        let nestedTabSpace: string = this.getTabSpace(parents[k as number].text as string);
        let nestedlistorder: boolean = true;
        let nestedListStart: boolean = true;
        let curTabSpaceLength: number;
        let nextPrefixValue: number = -1;
        let traversIncreased: boolean = true;
        let nextLineLength: number = 0;
        let lineBreak: string = '';
        changedList = (this.selection.getLine(textArea, (parents[0].line as number) + 1 ) !== '') ?
            '' : changedList + textArea.value.substr(parents[0].end as number, textArea.value.length);
        for (let i: number = 1; i < textAreaLength &&
        !isNullOrUndefined(this.selection.getLine(textArea, (parents[0].line as number) + i))
        && this.selection.getLine(textArea, (parents[0].line as number) + i) !== ''; i++) {
            const nextLine: string = this.selection.getLine(textArea, (parents[0].line as number) + i);
            const nextTabSpace: string = this.getTabSpace(nextLine);
            const nextLineSplit: string[] = nextLine.split('. ');
            if (nextLineSplit.length === 1) {
                changedList += textArea.value.substr((parents[0].end as number) + nextLineLength, textArea.value.length);
                break;
            } else {
                nextLineLength += nextLine.length;
                let shiftTabTargetList: boolean = false;
                curTabSpaceLength = event.event.shiftKey ? curTabSpace.length + 1 : curTabSpace.length - 1;
                if (nextTabSpace.length > nestedTabSpace.length) {
                    traversIncreased = false;
                }
                if (curTabSpace.length !== nextTabSpace.length && nextTabSpace.length < nestedTabSpace.length) {
                    nestedListStart = true;
                    nestedlistorder = false;
                    shiftTabTargetList = event.event.shiftKey &&
                    curTabSpace.length === nextTabSpace.length ? (nestedListStart = false, true) : false;
                } else if (traversIncreased && event.event.shiftKey &&
                    curTabSpace.length === nextTabSpace.length && nextTabSpace.length === nestedTabSpace.length) {
                    nestedListStart = false;
                    shiftTabTargetList = true;
                }
                lineBreak = changedList === '' ? '' : '\n';
                if (curTabSpaceLength === nextTabSpace.length && nestedListStart) {
                    const nextPrefix: string = event.event.shiftKey ?
                        (nextPrefixValue++ , this.nextOrderedListValue(nextPrefixValue.toString()))
                        : this.previousOrderedListValue(nextLineSplit[0]);
                    nextLineSplit.splice(0, 1);
                    changedList = changedList + lineBreak + nextTabSpace + nextPrefix + nextLineSplit.join('. ');
                } else if (curTabSpace.length === nextTabSpace.length && nestedlistorder || shiftTabTargetList) {
                    const nextPrefix: string = this.nextOrderedListValue(prefixNumber.toString());
                    prefixNumber++;
                    nextLineSplit.splice(0, 1);
                    changedList = changedList + lineBreak + nextTabSpace + nextPrefix + nextLineSplit.join('. ');
                } else {
                    changedList = changedList + lineBreak + nextLine;
                    nestedListStart = false;
                }
                nestedTabSpace = this.getTabSpace(nextLine);
            }
        }
        parents[k as number].text = this.getTabSpace(parents[k as number].text as string) + prefix + splitText.join('. ') + '\n';
        textArea.value = textArea.value.substr(0, parents[k as number].start as number) + parents[k as number].text + changedList;
    }

    private getTabSpace(line: string): string {
        const split: string[] = line.split('\t');
        let tabs: string = '';
        for (let i: number = 0; i < split.length; i++) {
            if (split[i as number] === '') {
                tabs += '\t';
            } else {
                break;
            }
        }
        return tabs;
    }

    private isNotFirstLine(textArea: HTMLTextAreaElement, points: { [key: string]: number | string }): boolean {
        const currentLine: string = points.text as string;
        let prevIndex: number = points.line as number - 1;
        let prevLine: string = this.selection.getLine(textArea, prevIndex);
        const regex: RegExp = this.getListRegex();
        let isNotFirst: boolean = false;
        let regexFirstCondition: boolean;
        if (prevLine) {
            this.currentAction = this.getAction(prevLine);
            const prevLineSplit: string[] = prevLine.split('. ');
            regexFirstCondition = this.currentAction === 'OL' ? /^\d+$/.test(prevLineSplit[0].trim()) : regex.test(prevLine.trim());
        }
        if (prevLine && regexFirstCondition) {
            const curTabSpace: string = this.getTabSpace(currentLine);
            let prevTabSpace: string = this.getTabSpace(prevLine);
            isNotFirst = curTabSpace === prevTabSpace ? true : isNotFirst;
            for (; prevTabSpace.length > curTabSpace.length; null) {
                prevIndex = prevIndex - 1;
                prevLine = this.selection.getLine(textArea, prevIndex);
                const prevLineSplit: string[] = prevLine.trim().split('. ');
                const regexSecondCondition: boolean = this.currentAction === 'OL' ?
                    /^\d+$/.test(prevLineSplit[0]) : regex.test(prevLine.trim());
                if (regexSecondCondition) {
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
        const ol: string = line.split('. ')[0];
        // eslint-disable-next-line
        const currentState: Boolean = /^\d+$/.test(ol.trim());
        // eslint-disable-next-line
        const ul: string = line.trim().split(new RegExp('^(' + this.selection.replaceSpecialChar(this.syntax.UL).trim() + ')'))[1];
        return (currentState ? 'OL' : ul ? 'UL' : 'NOTLIST');
    }

    private nextOrderedListValue(previousLine: string): string {
        // eslint-disable-next-line
        const currentValue: number = parseInt(previousLine, null);
        const nextValue: number = currentValue + 1;
        return nextValue.toString() + '. ';
    }

    private previousOrderedListValue(previousLine: string): string {
        // eslint-disable-next-line
        const currentValue: number = parseInt(previousLine, null);
        const nextValue: number = currentValue - 1;
        return nextValue.toString() + '. ';
    }
    private enterKey(event: IMDKeyboardEvent): void {
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        let start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        const parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        const prevLine: string = this.selection.getLine(textArea, (parents[0].line as number) - 1);
        const listFormat: number = this.olListType();
        const regex: RegExp = this.getListRegex();
        let prevLineSplit: string[] = [];
        if (!isNullOrUndefined(prevLine)) {
            prevLineSplit = prevLine.split('. ');
            this.currentAction = this.getAction(prevLine);
        }
        let addedLength: number = 0;
        if (this.currentAction === 'OL' && prevLineSplit.length > 1 && /^\d+$/.test(prevLineSplit[0].trim()) && listFormat
        && prevLineSplit[1] !== '') {
            const tabSpace: string = this.getTabSpace(prevLine);
            this.currentAction = this.getAction(prevLine);
            const prefix: string = this.nextOrderedListValue(prevLineSplit[0]);
            parents[0].text = tabSpace + prefix + parents[0].text;
            const textAreaLength: number = this.selection.getAllParents(textArea.value).length;
            let changedList: string = '\n';
            const curTabSpace: string = this.getTabSpace(prevLine);
            let nestedTabSpace: string = this.getTabSpace(parents[0].text as string);
            let nestedListOrder: boolean = true;
            for (let i: number = 1; i < textAreaLength &&
            textArea.value.substr(parents[0].end as number, textArea.value.length) !== ''; i++) {
                const nextLine: string = this.selection.getLine(textArea, (parents[0].line as number) + i);
                if (isNullOrUndefined(nextLine)) {
                    changedList = changedList + '';
                } else {
                    const nextLineSplit: string[] = nextLine.split('. ');
                    const nextTabSpace: string = this.getTabSpace(nextLine);
                    if (nextTabSpace.length < nestedTabSpace.length) {
                        nestedListOrder = false;
                    }
                    if (nextLineSplit.length > 1 && /^\d+$/.test(nextLineSplit[0].trim()) &&
                        curTabSpace.length === nextTabSpace.length && nestedListOrder) {
                        const nextPrefix: string = this.nextOrderedListValue(nextLineSplit[0]);
                        nextLineSplit.splice(0, 1);
                        changedList = changedList + nextTabSpace + nextPrefix + nextLineSplit.join('. ') + '\n';
                    } else {
                        changedList = changedList + nextLine + '\n';
                        nestedTabSpace = this.getTabSpace(nextLine);
                    }
                }
            }
            textArea.value = textArea.value.substr(0, parents[0].start as number) + curTabSpace +
            prefix + this.selection.getLine(textArea, parents[0].line as number) + changedList;
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
        } else if (this.currentAction === 'UL' && (prevLine && regex.test(prevLine.trim())) &&
        prevLine.trim().replace(regex, '') !== '' ||  this.currentAction === 'OL' && !listFormat) {
            const tabSpace: string = this.getTabSpace(prevLine);
            const prefix: string = this.syntax[this.currentAction];
            parents[0].text = tabSpace + prefix + parents[0].text +
            ((parents[0].text as string).trim().length > 0 ? '\n' : '');
            textArea.value = textArea.value.substr(0, parents[0].start as number) + parents[0].text +
                textArea.value.substr(parents[0].end as number, textArea.value.length);
            start = start + prefix.length + tabSpace.length;
            addedLength += prefix.length + tabSpace.length;
        }
        this.restore(textArea, start, end + addedLength, event);
    }
    private olListType(): number {
        const olSyntaxList: string[] = this.syntax.OL.split('.,');
        const listType: number = olSyntaxList.length === 1 ? null :
            // eslint-disable-next-line
            parseInt(olSyntaxList[2].trim(), null) - parseInt(olSyntaxList[0].trim(), null);
        if (listType) {
            return 1;
        } else {
            return 0;
        }
    }
    private applyListsHandler(e: IMarkdownSubCommands): void {
        const textArea: HTMLTextAreaElement = this.parent.element as HTMLTextAreaElement;
        this.selection.save(textArea.selectionStart, textArea.selectionEnd);
        this.currentAction = e.subCommand;
        let start: number = textArea.selectionStart;
        const end: number = textArea.selectionEnd;
        let addedLength: number = 0;
        let startLength: number = 0;
        let endLength: number = 0;
        const parents: { [key: string]: string | number }[] = this.selection.getSelectedParentPoints(textArea);
        let prefix: string = '';
        const listFormat: number = this.olListType();
        let regex: string;
        const perfixObj: {[key: string]: number } = {};
        for (let i: number = 0; i < parents.length; i++) {
            if (listFormat) {
                regex = this.currentAction === 'OL' ? i + listFormat + '. ' : this.syntax[this.currentAction];
            } else {
                regex = this.currentAction === 'OL' ? this.syntax.OL : this.syntax[this.currentAction];
            }
            if (!this.selection.isStartWith(parents[i as number].text as string, regex)) {
                if (parents[i as number].text === '' && i === 0) {
                    this.selection.save(start, end);
                    if (parents.length !== 1) {
                        for (let j: number = i; j < parents.length; j++) {
                            parents[j as number].start = j !== 0 ? 1 + (parents[j as number].start as number) : parents[j as number].start;
                            parents[j as number].end = 1 + (parents[j as number].end as number);
                        }
                    }
                }
                const preLineTabSpaceLength: number = !isNullOrUndefined(parents[i - 1]) ?
                    this.getTabSpace(parents[i - 1].text as string).length : 0;
                const replace: { [key: string]: number | string } = this.appliedLine(
                    parents[i as number].text as string,
                    regex, perfixObj, preLineTabSpaceLength);
                prefix = replace.line ? prefix : regex;
                parents[i as number].text = replace.line ? replace.line : prefix + parents[i as number].text;
                replace.space = replace.space ? replace.space : 0;
                textArea.value = textArea.value.substr(0, parents[i as number].start as number + endLength) + parents[i as number].text + '\n' +
                    textArea.value.substr(parents[i as number].end as number, textArea.value.length);
                start = i === 0 ? (start + prefix.length + (replace.space as number)) > 0 ?
                    start + prefix.length + (replace.space as number) : 0 : start;
                addedLength += prefix.length + (replace.space as number);
                if (parents.length !== 1) {
                    for (let j: number = i; j < parents.length; j++) {
                        parents[j as number].start = j !== 0 ? prefix.length +
                            (parents[j as number].start as number) + (replace.space as number) : parents[j as number].start;
                        parents[j as number].end = prefix.length + (parents[j as number].end as number) + (replace.space as number);
                    }
                }
                this.restore(textArea, start, end + addedLength, null);
            } else {
                parents[i as number].text = (parents[i as number].text as string).replace(regex, '');
                textArea.value = textArea.value.substr(0, parents[i as number].start as number + endLength) + parents[i as number].text + '\n' +
                    textArea.value.substr(parents[i as number].end as number + endLength, textArea.value.length);
                endLength -= regex.length;
                startLength = regex.length;
                this.restore(textArea, start - startLength, end + endLength, null);
            }
        }
        this.restore(textArea, null, null, e);
    }
    private appliedLine(
        line: string, prefixPattern: string, perfixObj: {[key: string]: number },
        preTabSpaceLength: number): { [key: string]: number | string } {
        const points: { [key: string]: number | string } = {};
        // eslint-disable-next-line
        const regex: RegExp = new RegExp('^[' + this.syntax.UL.trim() + ']');
        const lineSplit: string[] = line.split('. ');
        const currentPrefix: string = lineSplit[0] + '. ';
        const isExist: boolean = regex.test(line.trim()) || line.trim() === this.syntax.OL.trim()
            || line.trim() === this.syntax.UL.trim() || /^\d+$/.test(lineSplit[0].trim());
        const listFormat: number = this.olListType();
        const curTabSpaceLength: number = this.getTabSpace(line).length;
        if (this.currentAction === 'OL' && listFormat) {
            perfixObj[curTabSpaceLength.toString()] = !isNullOrUndefined(perfixObj[curTabSpaceLength.toString()]) ?
                perfixObj[curTabSpaceLength.toString()].valueOf() + 1 : 1;
            prefixPattern = perfixObj[curTabSpaceLength.toString()].valueOf().toString() + '. ';
            if (!isNullOrUndefined(preTabSpaceLength) && preTabSpaceLength > curTabSpaceLength) {
                perfixObj[preTabSpaceLength.toString()] = 0;
            }
        }
        if (isExist) {
            let replace: string;
            let pattern: string;
            // eslint-disable-next-line
            const space: number = 0;
            if (regex.test(line.trim())) {
                pattern = this.syntax.UL;
                replace = prefixPattern;
                points.space = prefixPattern.trim().length - this.syntax.UL.trim().length;
            } else if (/^\d+$/.test(lineSplit[0].trim()) && listFormat) {
                pattern = lineSplit[0].trim() + '. ';
                replace = prefixPattern;
                points.space = this.syntax.UL.trim().length - currentPrefix.trim().length;
            } else if (/^\d+$/.test(lineSplit[0].trim())) {
                pattern = lineSplit[0].trim() + '. ';
                replace = this.syntax.UL;
                points.space = this.syntax.UL.trim().length - currentPrefix.trim().length;
            }
            points.line = line.replace(pattern, replace);
        }
        return points;
    }

    private restore(textArea: HTMLTextAreaElement, start: number, end: number, event?: IMarkdownSubCommands | IMDKeyboardEvent): void {
        if (!isNullOrUndefined(start) && !isNullOrUndefined(start)) {
            this.selection.save(start, end);
        }
        if (!isNullOrUndefined(event)) {
            this.selection.restore(textArea);
        }
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
        const configKey: string[] = Object.keys(this.syntax);
        const regExp: RegExpConstructor = RegExp;
        for (let j: number = 0; j < configKey.length; j++) {
            const syntax: string = this.selection.replaceSpecialChar(this.syntax[configKey[j as number]]);
            regex += regex === '' ? '^(' + syntax + ')|^(' + syntax.trim() + ')' :
                '|^(' + syntax + ')|^(' + syntax.trim() + ')';
        }
        return new regExp(regex);
    }
}
