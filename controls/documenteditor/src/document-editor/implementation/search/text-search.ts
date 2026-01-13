import { Dictionary } from '../../base/dictionary';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CONTROL_CHARACTERS, FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import {
    LineWidget, ElementBox, TextElementBox, ParagraphWidget,
    BlockWidget, ListTextElementBox, BodyWidget, FieldElementBox, Widget, HeaderFooterWidget,
    HeaderFooters, ShapeElementBox, TextFrame, FootnoteElementBox,
    BookmarkElementBox,
    CommentCharacterElementBox,
    ImageElementBox
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
    private documentHelper: DocumentHelper;

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.documentHelper = this.owner.documentHelper;
    }

    public find(pattern: string | RegExp, findOption?: FindOption): TextSearchResult {
        const result: TextSearchResult = this.findNext(pattern, findOption, '0;0;0');
        if (!isNullOrUndefined(result)) {
            const eventArgs: SearchResultsChangeEventArgs = { source: this.documentHelper.owner };
            this.documentHelper.owner.trigger(searchResultsChangeEvent, eventArgs);
        }
        return result;
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
            || textToFind.indexOf('^') > -1 || textToFind.indexOf('?') > -1 || textToFind.indexOf('+') > -1) {
            let text: string = '';
            for (let i: number = 0; i < textToFind.length; i++) {
                if (textToFind[parseInt(i.toString(), 10)] === '(' || textToFind[parseInt(i.toString(), 10)] === ')' || textToFind[parseInt(i.toString(), 10)] === '.' || textToFind[parseInt(i.toString(), 10)] === '['
                    || textToFind[parseInt(i.toString(), 10)] === ']' || textToFind[parseInt(i.toString(), 10)] === '$' || textToFind[parseInt(i.toString(), 10)] === '{' || textToFind[parseInt(i.toString(), 10)] === '}'
                    || textToFind[parseInt(i.toString(), 10)] === '*' || textToFind[parseInt(i.toString(), 10)] === '|' || textToFind[parseInt(i.toString(), 10)] === '^' || textToFind[parseInt(i.toString(), 10)] === '?'
                    || textToFind[parseInt(i.toString(), 10)] === '+') {
                    text += '\\' + textToFind[parseInt(i.toString(), 10)];
                } else {
                    text += textToFind[parseInt(i.toString(), 10)];
                }
            }
            textToFind = text;
        }
        if (option === 'WholeWord' || option === 'CaseSensitiveWholeWord') {
            textToFind = this.wordBefore + textToFind + this.wordAfter;
        }
        return RegExp(textToFind, (option === 'CaseSensitive' || option === 'CaseSensitiveWholeWord') ? 'g' : 'ig');
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

    public getElementInfo(inlineElement: ElementBox, indexInInline: number, includeNextLine?: boolean, pattern?: RegExp,
                          findOption?: FindOption, isFirstMatch?: boolean, results?: TextSearchResults, selectionEnd?: TextPosition,
                          isSpellCheck?: boolean): TextInLineInfo {
        const inlines: ElementBox = inlineElement;
        let stringBuilder: string = '';
        const spans: Dictionary<TextElementBox, number> = new Dictionary<TextElementBox, number>();
        // eslint-disable  no-constant-condition
        let previousElementCount: number = 0;
        do {
            if (inlineElement instanceof TextElementBox && (!isNullOrUndefined((inlineElement as TextElementBox).text) && (inlineElement as TextElementBox).text !== '')) {
                // Skip the empty spaces in spell check mode
                if (isSpellCheck && inlineElement.text.trim().length === 0) {
                    stringBuilder = stringBuilder + inlineElement.text;
                    previousElementCount = 0;
                    inlineElement = inlineElement.nextNode;
                    if (isNullOrUndefined(inlineElement)) {
                        break;
                    }
                    continue;
                }
                spans.add(inlineElement as TextElementBox,
                          isSpellCheck ? stringBuilder.length + previousElementCount : stringBuilder.length);
                previousElementCount = 0;
                // IndexInInline Handled specifically for simple find operation to start from starting point
                if (inlineElement === inlines) {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text.substring(indexInInline));
                } else {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text);
                }
            } else if (inlineElement instanceof FieldElementBox) {
                let fieldBegin: ElementBox = inlineElement as FieldElementBox;
                if (!isNullOrUndefined((fieldBegin as FieldElementBox).fieldEnd)) {
                    /* eslint-disable-next-line max-len */
                    if (isSpellCheck) {
                        // In MS Word for field text error will not be shown. So made the text as unique character. So that error will not be generated.
                        // Also in spell check based on the index only selection will be trigger. So need to consider and calculate the length for the field and concatenate unique character for the text.
                        while (!isNullOrUndefined(fieldBegin)) {
                            const nextElement: ElementBox = fieldBegin.nextElement;
                            if (fieldBegin === inlineElement.fieldEnd) {
                                stringBuilder += CONTROL_CHARACTERS.Marker_Start;
                                break;
                            }
                            if (nextElement instanceof TextElementBox) {
                                let text: string = nextElement.text;
                                text = text.split('').map(() => CONTROL_CHARACTERS.Marker_Start).join('');
                                stringBuilder += text;
                            } else {
                                stringBuilder += CONTROL_CHARACTERS.Marker_Start;
                            }
                            fieldBegin = nextElement;
                        }
                        inlineElement = inlineElement.fieldEnd;
                    } else {
                        inlineElement = isNullOrUndefined((fieldBegin as FieldElementBox).fieldSeparator)
                            ? (fieldBegin as FieldElementBox).fieldEnd : (fieldBegin as FieldElementBox).fieldSeparator;
                    }
                }
            } else if (inlineElement instanceof ShapeElementBox && !isNullOrUndefined(inlineElement.textFrame)
                && (inlineElement.textFrame as TextFrame).childWidgets.length > 0) {
                this.findInlineText(inlineElement.textFrame, pattern, findOption, isFirstMatch, results, selectionEnd);
            }
            if (!(inlineElement instanceof TextElementBox) && !(inlineElement instanceof ListTextElementBox)
                && !(isSpellCheck && inlineElement instanceof FieldElementBox)) {
                if (isSpellCheck) {
                    stringBuilder = stringBuilder + CONTROL_CHARACTERS.Marker_Start;
                }
                else if (!(isSpellCheck && inlineElement instanceof ImageElementBox)) {
                    previousElementCount += inlineElement.length;
                }
            }
            if (!isNullOrUndefined(inlineElement) && isNullOrUndefined(inlineElement.nextNode)) {
                const splittedParagraph: ParagraphWidget = inlineElement.paragraph.nextSplitWidget as ParagraphWidget;
                if (!isSpellCheck && !isNullOrUndefined(splittedParagraph) && splittedParagraph !== inlineElement.paragraph
                && splittedParagraph.childWidgets.length > 0 && splittedParagraph.childWidgets[0] instanceof LineWidget
                && (splittedParagraph.childWidgets[0] as LineWidget).children.length > 0) {
                    inlineElement = (splittedParagraph.childWidgets[0] as LineWidget).children[0] as ElementBox;
                    continue;
                } else {
                    break;
                }
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
            const match: RegExpExecArray = matches[parseInt(i.toString(), 10)];
            let isMatched: boolean;
            if (!(isNullOrUndefined(startPosition)) && match.index < startPosition) {
                continue;
            }
            const result: TextSearchResult = results.addResult();
            const spanKeys: TextElementBox[] = textInfo.keys;
            let isContainField: boolean = false;
            for (let j: number = 0; j < spanKeys.length; j++) {
                const span: TextElementBox = spanKeys[parseInt(j.toString(), 10)];
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
                    result.start.location = this.owner.selectionModule.getPhysicalPositionInternal(span.line, offset, true);
                    result.start.setPositionParagraph(span.line, offset);
                    result.startOffset = this.owner.selectionModule.getHierarchicalIndexByPosition(result.start);
                }
                if (match.index + match[0].length <= startIndex + spanLength) {
                    let index: number = (match.index + match[0].length) - startIndex;
                    // IndexInInline Handled specifically for simple find operation to start from starting point
                    if (span as ElementBox === inlines) {
                        index += indexInInline;
                    }
                    if (!(!isNullOrUndefined(this.owner.searchModule.textSearchResults) && this.owner.searchModule.textSearchResults.length !== 0) && span.text.charAt(span.text.length - 1) !== ' ' && !isNullOrUndefined(span.nextElement) && (span.nextElement instanceof BookmarkElementBox || span.nextElement instanceof CommentCharacterElementBox)) {
                        let element: ElementBox = span.nextElement;
                        while (element) {
                            element = element.nextElement;
                            if (element instanceof TextElementBox) {
                                break;
                            }
                        }
                        if (element && element instanceof TextElementBox && element.text.charAt(0) !== ' ' && element.text.charAt(0) !== '') {
                            isContainField = true;
                            continue;
                        }
                    }
                    if (!(!isNullOrUndefined(this.owner.searchModule.textSearchResults)
                        && this.owner.searchModule.textSearchResults.length !== 0) && span.previousElement
                        && (span.previousElement instanceof BookmarkElementBox
                            || span.previousElement instanceof CommentCharacterElementBox)) {
                        isContainField = true;
                    }
                    let offset: number = 0;
                    if (isContainField) {
                        offset = (span.line).getOffset(span, 0) + span.length;
                    } else {
                        offset = (span.line).getOffset(span, index);
                    }
                    result.end = this.getTextPosition(span.line, offset.toString());
                    result.end.location = this.owner.selectionModule.getPhysicalPositionInternal(span.line, offset, true);
                    result.end.setPositionParagraph(span.line, offset);
                    result.endOffset = this.owner.selectionModule.getHierarchicalIndexByPosition(result.end);
                    isMatched = true;
                    break;
                }
            }
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
            selectionEnd = this.owner.selectionModule.end;
        }
        if (hierachicalPosition !== undefined && isFirstMatch && selectionEnd !== undefined && selectionEnd.paragraph !== undefined) {
            if (selectionEnd.paragraph instanceof ParagraphWidget) {
                let indexInInline: number = 0;
                // IndexInInline Handled specifically for simple find operation to start from starting point
                /* eslint-disable-next-line max-len */
                const inlineElement: ElementInfo = (selectionEnd.currentWidget as LineWidget).getInline(this.owner.selectionModule.start.offset, indexInInline);
                inline = inlineElement.element as ElementBox;
                indexInInline = inlineElement.index;
                if (!isNullOrUndefined(inline)) {
                    let nextParagraphWidget: ParagraphWidget = undefined;
                    nextParagraphWidget = this.findInline(inline, pattern, findOption, indexInInline, isFirstMatch, results, selectionEnd);
                    while (results.length === 0 && !isNullOrUndefined(nextParagraphWidget)) {
                        while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.childWidgets.length === 0) {
                            /* eslint-disable-next-line max-len */
                            nextParagraphWidget = this.owner.selectionModule.getNextParagraph(nextParagraphWidget.containerWidget as BodyWidget) as ParagraphWidget;
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
        this.findInlineText(section, pattern, findOption, isFirstMatch, results, selectionEnd);

        const headerFootersColletion: HeaderFooters[] = this.documentHelper.headersFooters;
        for (let i: number = 0; i < headerFootersColletion.length; i++ ) {
            const headerFooters: HeaderFooters = headerFootersColletion[parseInt(i.toString(), 10)];
            if (headerFooters) {
                for (const index in headerFooters) {
                    if (Object.prototype.hasOwnProperty.call(headerFooters, index)){
                        const headerFooter: HeaderFooterWidget = headerFooters[parseInt(index.toString(), 10)];
                        if (!isNullOrUndefined(headerFooter) && !isNullOrUndefined(headerFooter.page)) {
                            this.findInlineText(headerFooter, pattern, findOption, isFirstMatch, results, selectionEnd);
                        }
                    }
                }
            }
        }
        // (EJ2-854069) - Added below code to add the search results of the endnote and footnote in the results.
        const endNoteCollection: FootnoteElementBox[] = this.documentHelper.endnoteCollection;
        for (let i: number = 0; i < endNoteCollection.length; i++ ) {
            const endNote: FootnoteElementBox = endNoteCollection[parseInt(i.toString(), 10)];
            if (endNote) {
                if (!isNullOrUndefined(endNote) && !isNullOrUndefined(endNote.bodyWidget.page)) {
                    this.findInlineText(endNote.bodyWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
                }
            }
        }
        const footNoteCollection: FootnoteElementBox[] = this.documentHelper.footnoteCollection;
        for (let i: number = 0; i < footNoteCollection.length; i++ ) {
            const footNote: FootnoteElementBox = footNoteCollection[parseInt(i.toString(), 10)];
            if (footNote) {
                if (!isNullOrUndefined(footNote) && !isNullOrUndefined(footNote.bodyWidget.page)) {
                    this.findInlineText(footNote.bodyWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
                }
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    /* eslint-disable-next-line max-len */
    private findInlineText(section: Widget, pattern: RegExp, findOption: FindOption, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): void {
        let paragraphWidget: ParagraphWidget = this.owner.documentHelper.getFirstParagraphBlock(section.childWidgets[0] as BlockWidget);
        /* eslint-disable-next-line max-len */
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length === 1 && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) {
            paragraphWidget = this.owner.selectionModule.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
        }
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length > 0) {
            const inlineElement: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
            const inlineEle: ElementBox = inlineElement.children[0] as ElementBox;
            if (isNullOrUndefined(inlineEle)) {
                break;
            }
            this.findInline(inlineEle, pattern, findOption, 0, isFirstMatch, results, selectionEnd);
            paragraphWidget = this.owner.selectionModule.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            /* eslint-disable-next-line max-len */
            while (!isNullOrUndefined(paragraphWidget) && (((paragraphWidget.childWidgets.length === 1) && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) || !isNullOrUndefined(paragraphWidget.previousSplitWidget))) {
                paragraphWidget = this.owner.selectionModule.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    /* eslint-disable-next-line max-len */
    private findInline(inlineElement: ElementBox, pattern: RegExp, option: FindOption, indexInInline: number, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): ParagraphWidget {
        const inlines: ElementBox = inlineElement;
        const textInfo: TextInLineInfo = this.getElementInfo(inlineElement, indexInInline, undefined,
                                                             pattern, option, isFirstMatch, results, selectionEnd);
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
        const paragraphWidget: ParagraphWidget = this.owner.selectionModule.getNextParagraphBlock(inlineElement.line.paragraph) as ParagraphWidget;
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
