import { Dictionary } from '../../base/dictionary';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import {
    LineWidget, ElementBox, TextElementBox, ParagraphWidget,
    BlockWidget, ListTextElementBox, BodyWidget, FieldElementBox, Widget, HeaderFooterWidget
} from '../viewer/page';
import { ElementInfo, TextInLineInfo } from '../editor/editor-helper';
import { TextSearchResult } from './text-search-result';
import { TextSearchResults } from './text-search-results';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../index';
import { SearchResultsChangeEventArgs, searchResultsChangeEvent } from '../../base/index';
/**
 * @private
 */
export class TextSearch {
    private wordBefore: string = '\\b';
    private wordAfter: string = '\\b';
    private owner: DocumentEditor;
    private isHeader: boolean = false;
    private isFooter: boolean = false;
    private documentHelper: DocumentHelper;

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.documentHelper = this.owner.documentHelper;
    }

    public find(pattern: string | RegExp, findOption?: FindOption): TextSearchResult {
        return this.findNext(pattern, findOption, '0;0;0');
    }
    public findNext(pattern: string | RegExp, findOption?: FindOption, hierarchicalPosition?: string): TextSearchResult {
        if (typeof pattern === 'string') {
            pattern = this.stringToRegex(pattern, findOption);
        }
        if (hierarchicalPosition === undefined) {
            hierarchicalPosition = '0;0;0';
        }
        this.owner.searchModule.textSearchResults.clearResults();
        const results: TextSearchResults = this.owner.searchModule.textSearchResults;
        this.findDocument(results, pattern, true, findOption, hierarchicalPosition);
        return results.length > 0, results.currentSearchResult;
    }
    public stringToRegex(textToFind: string, option: FindOption): RegExp {
        if (textToFind.indexOf('\\') > -1) {
            textToFind = textToFind.split('\\').join('\\\\');
        }
        if (textToFind.indexOf('(') > -1 || textToFind.indexOf(')') > -1 || textToFind.indexOf('.') > -1 || textToFind.indexOf('[') > -1
            || textToFind.indexOf(']') > -1 || textToFind.indexOf('$') > -1 || textToFind.indexOf('{') > -1
            || textToFind.indexOf('}') > -1 || textToFind.indexOf('*') > -1 || textToFind.indexOf('|') > -1
            || textToFind.indexOf('^') > -1 || textToFind.indexOf('?') > -1) {
            let text: string = '';
            for (let i: number = 0; i < textToFind.length; i++) {
                if (textToFind[i] === '(' || textToFind[i] === ')' || textToFind[i] === '.' || textToFind[i] === '['
                    || textToFind[i] === ']' || textToFind[i] === '$' || textToFind[i] === '{' || textToFind[i] === '}'
                    || textToFind[i] === '*' || textToFind[i] === '|' || textToFind[i] === '^' || textToFind[i] === '?') {
                    text += '\\' + textToFind[i];
                } else {
                    text += textToFind[i];
                }
            }
            textToFind = text;
        }
        if (option === 'WholeWord' || option === 'CaseSensitiveWholeWord') {
            textToFind = this.wordBefore + textToFind + this.wordAfter;
        }
        return new RegExp(textToFind, (option === 'CaseSensitive' || option === 'CaseSensitiveWholeWord') ? 'g' : 'ig');
    }
    public isPatternEmpty(pattern: RegExp): boolean {
        const wordEmpty: string = this.wordBefore + this.wordAfter;
        const patternRegExp: string = pattern.toString();
        return (patternRegExp.length === 0 || patternRegExp === wordEmpty);
    }
    public findAll(pattern: string | RegExp, findOption?: FindOption, hierarchicalPosition?: string): TextSearchResults {
        if (typeof pattern === 'string') {
            pattern = this.stringToRegex(pattern, findOption);
        }
        if (hierarchicalPosition === undefined) {
            hierarchicalPosition = '0;0;0';
        }
        this.owner.searchModule.textSearchResults.clearResults();
        const results: TextSearchResults = this.owner.searchModule.textSearchResults;
        this.findDocument(results, pattern, false, findOption, hierarchicalPosition);
        if (results.length > 0 && results.currentIndex < 0) {
            results.currentIndex = 0;
        }
        if (!isNullOrUndefined(results.currentSearchResult)) {
            const eventArgs: SearchResultsChangeEventArgs = { source: this.documentHelper.owner };
            this.documentHelper.owner.trigger(searchResultsChangeEvent, eventArgs);
            return results;
        }
        return undefined;
    }

    public getElementInfo(inlineElement: ElementBox, indexInInline: number, includeNextLine?: boolean): TextInLineInfo {
        const inlines: ElementBox = inlineElement;
        let stringBuilder: string = '';
        const spans: Dictionary<TextElementBox, number> = new Dictionary<TextElementBox, number>();
        // eslint-disable  no-constant-condition
        do {
            if (inlineElement instanceof TextElementBox && (!isNullOrUndefined((inlineElement as TextElementBox).text) && (inlineElement as TextElementBox).text !== '')) {
                spans.add(inlineElement as TextElementBox, stringBuilder.length);
                // IndexInInline Handled specifically for simple find operation to start from starting point
                if (inlineElement === inlines) {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text.substring(indexInInline));
                } else {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text);
                }
            } else if (inlineElement instanceof FieldElementBox) {
                const fieldBegin: FieldElementBox = inlineElement as FieldElementBox;
                if (!isNullOrUndefined(fieldBegin.fieldEnd)) {
                    /* eslint-disable-next-line max-len */
                    inlineElement = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd as FieldElementBox : fieldBegin.fieldSeparator as FieldElementBox;
                }
            }
            if (!isNullOrUndefined(inlineElement) && isNullOrUndefined(inlineElement.nextNode)) {
                break;
            }
            if (!isNullOrUndefined(inlineElement)) {
                if ((!isNullOrUndefined(includeNextLine) && !includeNextLine)) {
                    const elementBoxes: ElementBox[] = inlineElement.line.children;
                    const length: number = inlineElement.line.children.length;
                    if (elementBoxes.indexOf(inlineElement) < length - 1) {
                        inlineElement = inlineElement.nextNode;
                    } else {
                        inlineElement = undefined;
                        break;
                    }
                } else {
                    inlineElement = inlineElement.nextNode;
                }
            }
        // eslint-disable-next-line no-constant-condition
        } while (true);

        const text: string = stringBuilder.toString();

        return { elementsWithOffset: spans, fullText: text };
    }
    /* eslint-disable-next-line max-len */
    public updateMatchedTextLocation(matches: RegExpExecArray[], results: TextSearchResults, textInfo: Dictionary<TextElementBox, number>, indexInInline: number, inlines: ElementBox, isFirstMatch: boolean, selectionEnd: TextPosition, startPosition?: number): void {
        for (let i: number = 0; i < matches.length; i++) {
            const match: RegExpExecArray = matches[i];
            let isMatched: boolean;
            if (!(isNullOrUndefined(startPosition)) && match.index < startPosition) {
                continue;
            }
            const result: TextSearchResult = results.addResult();
            const spanKeys: TextElementBox[] = textInfo.keys;
            for (let j: number = 0; j < spanKeys.length; j++) {
                const span: TextElementBox = spanKeys[j];
                const startIndex: number = textInfo.get(span);
                let spanLength: number = span.length;
                // IndexInInline Handled specifically for simple find operation to start from starting point
                if (span as ElementBox === inlines) {
                    spanLength -= indexInInline;
                }
                if (isNullOrUndefined(result.start) && match.index < startIndex + spanLength) {
                    let index: number = match.index - startIndex;
                    // IndexInInline Handled specifically for simple find operation to start from starting point
                    if (span as ElementBox === inlines) {
                        index += indexInInline;
                    }
                    const offset: number = (span.line).getOffset(span, index);
                    result.start = this.getTextPosition(span.line, offset.toString());
                    result.start.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
                    result.start.setPositionParagraph(span.line, offset);
                }
                if (match.index + match[0].length <= startIndex + spanLength) {
                    let index: number = (match.index + match[0].length) - startIndex;
                    // IndexInInline Handled specifically for simple find operation to start from starting point
                    if (span as ElementBox === inlines) {
                        index += indexInInline;
                    }
                    const offset: number = (span.line).getOffset(span, index);
                    result.end = this.getTextPosition(span.line, offset.toString());
                    result.end.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
                    result.end.setPositionParagraph(span.line, offset);
                    isMatched = true;
                    break;
                }
            }
            result.isHeader = this.isHeader;
            result.isFooter = this.isFooter;
            if (isFirstMatch) {
                results.currentIndex = 0;
                break;
            } else if (results.currentIndex < 0 && !isNullOrUndefined(selectionEnd) && (selectionEnd.isExistBefore(result.start) ||
                selectionEnd.isAtSamePosition(result.start))) {
                results.currentIndex = results.indexOf(result);
            }
            if (!isNullOrUndefined(startPosition) && isMatched) {
                break;
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private findDocument(results: TextSearchResults, pattern: RegExp, isFirstMatch: boolean, findOption?: FindOption, hierachicalPosition?: string): void {
        if (this.isPatternEmpty(pattern)) {
            return;
        }
        if (findOption === undefined) {
            findOption = 'None';
        }
        let inline: ElementBox = undefined;
        let selectionEnd: TextPosition = undefined;
        if (hierachicalPosition !== undefined) {
            selectionEnd = this.owner.selection.end;
        }
        if (hierachicalPosition !== undefined && isFirstMatch && selectionEnd !== undefined && selectionEnd.paragraph !== undefined) {
            if (selectionEnd.paragraph instanceof ParagraphWidget) {
                let indexInInline: number = 0;
                // IndexInInline Handled specifically for simple find operation to start from starting point
                /* eslint-disable-next-line max-len */
                const inlineElement: ElementInfo = (selectionEnd.currentWidget as LineWidget).getInline(this.owner.selection.start.offset, indexInInline);
                inline = inlineElement.element as ElementBox;
                indexInInline = inlineElement.index;
                if (!isNullOrUndefined(inline)) {
                    let nextParagraphWidget: ParagraphWidget = undefined;
                    nextParagraphWidget = this.findInline(inline, pattern, findOption, indexInInline, isFirstMatch, results, selectionEnd);
                    while (results.length === 0 && !isNullOrUndefined(nextParagraphWidget)) {
                        while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.childWidgets.length === 0) {
                            /* eslint-disable-next-line max-len */
                            nextParagraphWidget = this.owner.selection.getNextParagraph(nextParagraphWidget.containerWidget as BodyWidget) as ParagraphWidget;
                        }
                        if (isNullOrUndefined(nextParagraphWidget)) {
                            break;
                        }
                        const lineWidget: LineWidget = nextParagraphWidget.childWidgets[0] as LineWidget;
                        if (lineWidget.children[0] instanceof ListTextElementBox) {
                            inline = (lineWidget.children[2] instanceof TextElementBox) ? lineWidget.children[2] as ElementBox : undefined;
                        } else {
                            inline = lineWidget.children[0] as ElementBox;
                        }
                        if (isNullOrUndefined(inline)) {
                            break;
                        }
                        nextParagraphWidget = this.findInline(inline, pattern, findOption, 0, isFirstMatch, results, selectionEnd);
                    }
                    if (results.length > 0) {
                        return;
                    }
                }
            }
        }
        let section: BodyWidget;
        section = this.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
        while (!isNullOrUndefined(section) && section.childWidgets.length === 0) {
            section = section.nextWidget as BodyWidget;
        }
        if (isNullOrUndefined(section) || section.childWidgets.length === 0) {
            return;
        }
        this.isHeader = false; this.isFooter = false;
        this.findInlineText(section, pattern, findOption, isFirstMatch, results, selectionEnd);
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            const headerWidget: HeaderFooterWidget = this.documentHelper.pages[i].headerWidget as HeaderFooterWidget;
            if (!isNullOrUndefined(headerWidget)) {
                this.isHeader = true; this.isFooter = false;
                this.findInlineText(headerWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
            }
        }
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            const footerWidget: HeaderFooterWidget = this.documentHelper.pages[i].footerWidget as HeaderFooterWidget;
            if (!isNullOrUndefined(footerWidget)) {
                this.isHeader = false; this.isFooter = true;
                this.findInlineText(footerWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    /* eslint-disable-next-line max-len */
    private findInlineText(section: Widget, pattern: RegExp, findOption: FindOption, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): void {
        let paragraphWidget: ParagraphWidget = this.owner.selection.getFirstParagraphBlock(section.childWidgets[0] as BlockWidget);
        /* eslint-disable-next-line max-len */
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length === 1 && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) {
            paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
        }
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length > 0) {
            const inlineElement: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
            const inlineEle: ElementBox = inlineElement.children[0] as ElementBox;
            if (isNullOrUndefined(inlineEle)) {
                break;
            }
            this.findInline(inlineEle, pattern, findOption, 0, isFirstMatch, results, selectionEnd);
            paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            /* eslint-disable-next-line max-len */
            while (!isNullOrUndefined(paragraphWidget) && (paragraphWidget.childWidgets.length === 1) && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) {
                paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    /* eslint-disable-next-line max-len */
    private findInline(inlineElement: ElementBox, pattern: RegExp, option: FindOption, indexInInline: number, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): ParagraphWidget {
        const inlines: ElementBox = inlineElement;
        const textInfo: TextInLineInfo = this.getElementInfo(inlineElement, indexInInline);
        const text: string = textInfo.fullText;
        const matches: RegExpExecArray[] = [];
        const spans: Dictionary<TextElementBox, number> = textInfo.elementsWithOffset;
        let matchObject: RegExpExecArray;
        // eslint-disable-next-line no-cond-assign
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            matches.push(matchObject);
        }

        this.updateMatchedTextLocation(matches, results, spans, indexInInline, inlines, isFirstMatch, selectionEnd);
        if (isFirstMatch) {
            return undefined;
        }
        /* eslint-disable-next-line max-len */
        const paragraphWidget: ParagraphWidget = this.owner.selection.getNextParagraphBlock(inlineElement.line.paragraph) as ParagraphWidget;
        return paragraphWidget;
    }
    public getTextPosition(lineWidget: LineWidget, hierarchicalIndex: string): TextPosition {
        const textPosition: TextPosition = new TextPosition(this.owner);
        const index: string = textPosition.getHierarchicalIndex(lineWidget, hierarchicalIndex);
        textPosition.setPositionForCurrentIndex(index);
        return textPosition;
    }
}
/**
 * @private
 */
export class SearchWidgetInfo {
    private leftInternal: number = 0;
    private widthInternal: number = 0;

    public get left(): number {
        return this.leftInternal;
    }
    public set left(value: number) {
        this.leftInternal = value;
    }
    public get width(): number {
        return this.widthInternal;
    }
    public set width(value: number) {
        this.widthInternal = value;
    }

    public constructor(left: number, width: number) {
        this.leftInternal = left;
        this.widthInternal = width;
    }
}
