import { Dictionary } from '../../base/dictionary';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import {
    LineWidget, ElementBox, TextElementBox, ParagraphWidget,
    BlockWidget, ListTextElementBox, BodyWidget, FieldElementBox, Widget, HeaderFooterWidget
} from '../viewer/page';
import { ElementInfo } from '../editor/editor-helper';
import { TextSearchResult } from './text-search-result';
import { TextSearchResults } from './text-search-results';
import { DocumentEditor } from '../../document-editor';
import { LayoutViewer } from '../index';
import { SearchResultsChangeEventArgs } from '../../base';
/** 
 * @private
 */
export class TextSearch {
    private wordBefore: string = '\\b';
    private wordAfter: string = '\\b';
    private owner: DocumentEditor;
    private isHeader: boolean = false;
    private isFooter: boolean = false;
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    public find(pattern: string | RegExp, findOption?: FindOption): TextSearchResult {
        return this.findNext(pattern, findOption, '0;0;0');
    }
    // tslint:disable-next-line:max-line-length   
    public findNext(pattern: string | RegExp, findOption?: FindOption, hierarchicalPosition?: string): TextSearchResult {
        if (typeof pattern === 'string') {
            pattern = this.stringToRegex(pattern, findOption);
        }
        if (hierarchicalPosition === undefined) {
            hierarchicalPosition = '0;0;0';
        }
        this.owner.searchModule.textSearchResults.clearResults();
        let results: TextSearchResults = this.owner.searchModule.textSearchResults;
        this.findDocument(results, pattern, true, findOption, hierarchicalPosition);
        return results.length > 0, results.currentSearchResult;
    }
    public stringToRegex(textToFind: string, option: FindOption): RegExp {
        if (textToFind.indexOf('\\') > -1) {
            textToFind = textToFind.split('\\').join('\\\\');
        }
        if (textToFind.indexOf('.') > -1) {
            textToFind = '\\' + textToFind;
        }
        if (option === 'WholeWord' || option === 'CaseSensitiveWholeWord') {
            textToFind = this.wordBefore + textToFind + this.wordAfter;
        }
        return new RegExp(textToFind, (option === 'CaseSensitive' || option === 'CaseSensitiveWholeWord') ? 'g' : 'ig');
    }
    public isPatternEmpty(pattern: RegExp): boolean {
        let wordEmpty: string = this.wordBefore + this.wordAfter;
        let patternRegExp: string = pattern.toString();
        return (patternRegExp.length === 0 || patternRegExp === wordEmpty);
    }
    // tslint:disable-next-line:max-line-length     
    public findAll(pattern: string | RegExp, findOption?: FindOption, hierarchicalPosition?: string): TextSearchResults {
        if (typeof pattern === 'string') {
            pattern = this.stringToRegex(pattern, findOption);
        }
        if (hierarchicalPosition === undefined) {
            hierarchicalPosition = '0;0;0';
        }
        this.owner.searchModule.textSearchResults.clearResults();
        let results: TextSearchResults = this.owner.searchModule.textSearchResults;
        this.findDocument(results, pattern, false, findOption, hierarchicalPosition);
        if (results.length > 0 && results.currentIndex < 0) {
            results.currentIndex = 0;
        }
        if (!isNullOrUndefined(results.currentSearchResult)) {
            let eventArgs: SearchResultsChangeEventArgs = { source: this.viewer.owner };
            this.viewer.owner.trigger('searchResultsChange', eventArgs);
            return results;
        }
        return undefined;
    }
    // tslint:disable-next-line:max-line-length     
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
                // tslint:disable-next-line:max-line-length 
                // IndexInInline Handled specifically for simple find operation to start from starting point
                let inlineElement: ElementInfo = (selectionEnd.currentWidget as LineWidget).getInline(this.owner.selection.start.offset, indexInInline);
                inline = inlineElement.element as ElementBox;
                indexInInline = inlineElement.index;
                if (!isNullOrUndefined(inline)) {
                    let nextParagraphWidget: ParagraphWidget = undefined;
                    // tslint:disable-next-line:max-line-length  
                    nextParagraphWidget = this.findInline(inline, pattern, findOption, indexInInline, isFirstMatch, results, selectionEnd);
                    while (results.length === 0 && !isNullOrUndefined(nextParagraphWidget)) {
                        while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.childWidgets.length === 0) {
                            // tslint:disable-next-line:max-line-length 
                            nextParagraphWidget = this.owner.selection.getNextParagraph(nextParagraphWidget.containerWidget as BodyWidget) as ParagraphWidget;
                        }
                        if (isNullOrUndefined(nextParagraphWidget)) {
                            break;
                        }
                        let lineWidget: LineWidget = nextParagraphWidget.childWidgets[0] as LineWidget;
                        if (lineWidget.children[0] instanceof ListTextElementBox) {
                            inline = (lineWidget.children[2] instanceof TextElementBox) ? lineWidget.children[2] as ElementBox : undefined;
                        } else {
                            inline = lineWidget.children[0] as ElementBox;
                        }
                        if (isNullOrUndefined(inline)) {
                            break;
                        }
                        // tslint:disable-next-line:max-line-length  
                        nextParagraphWidget = this.findInline(inline, pattern, findOption, 0, isFirstMatch, results, selectionEnd);
                    }
                    if (results.length > 0) {
                        return;
                    }
                }
            }
        }
        let section: BodyWidget;
        section = this.viewer.pages[0].bodyWidgets[0] as BodyWidget;
        while (!isNullOrUndefined(section) && section.childWidgets.length === 0) {
            section = section.nextWidget as BodyWidget;
        }
        if (isNullOrUndefined(section) || section.childWidgets.length === 0) {
            return;
        }
        this.isHeader = false; this.isFooter = false;
        this.findInlineText(section, pattern, findOption, isFirstMatch, results, selectionEnd);
        for (let i: number = 0; i < this.viewer.pages.length; i++) {
            let headerWidget: HeaderFooterWidget = this.viewer.pages[i].headerWidget as HeaderFooterWidget;
            if (!isNullOrUndefined(headerWidget)) {
                this.isHeader = true; this.isFooter = false;
                this.findInlineText(headerWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
            }
        }
        for (let i: number = 0; i < this.viewer.pages.length; i++) {
            let footerWidget: HeaderFooterWidget = this.viewer.pages[i].footerWidget as HeaderFooterWidget;
            if (!isNullOrUndefined(footerWidget)) {
                this.isHeader = false; this.isFooter = true;
                this.findInlineText(footerWidget, pattern, findOption, isFirstMatch, results, selectionEnd);
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    // tslint:disable-next-line:max-line-length
    private findInlineText(section: Widget, pattern: RegExp, findOption: FindOption, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): void {
        let paragraphWidget: ParagraphWidget = this.owner.selection.getFirstParagraphBlock(section.childWidgets[0] as BlockWidget);
        // tslint:disable-next-line:max-line-length 
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length === 1 && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) {
            paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
        }
        while (!isNullOrUndefined(paragraphWidget) && paragraphWidget.childWidgets.length > 0) {
            let inlineElement: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
            let inlineEle: ElementBox = inlineElement.children[0] as ElementBox;
            if (isNullOrUndefined(inlineEle)) {
                break;
            }
            this.findInline(inlineEle, pattern, findOption, 0, isFirstMatch, results, selectionEnd);
            paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            // tslint:disable-next-line:max-line-length 
            while (!isNullOrUndefined(paragraphWidget) && (paragraphWidget.childWidgets.length === 1) && (paragraphWidget.childWidgets[0] as LineWidget).children.length === 0) {
                paragraphWidget = this.owner.selection.getNextParagraphBlock(paragraphWidget) as ParagraphWidget;
            }
        }
        if (isFirstMatch && !isNullOrUndefined(results) && results.length > 0) {
            return;
        }
    }
    // tslint:disable-next-line:max-line-length     
    private findInline(inlineElement: ElementBox, pattern: RegExp, option: FindOption, indexInInline: number, isFirstMatch: boolean, results: TextSearchResults, selectionEnd: TextPosition): ParagraphWidget {
        let inlines: ElementBox = inlineElement;
        let stringBuilder: string = '';
        let spans: Dictionary<TextElementBox, number> = new Dictionary<TextElementBox, number>();
        //tslint:disable no-constant-condition
        do {
            // tslint:disable-next-line:max-line-length 
            if (inlineElement instanceof TextElementBox && (!isNullOrUndefined((inlineElement as TextElementBox).text) && (inlineElement as TextElementBox).text !== '')) {
                spans.add(inlineElement as TextElementBox, stringBuilder.length);
                // IndexInInline Handled specifically for simple find operation to start from starting point
                if (inlineElement === inlines) {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text.substring(indexInInline));
                } else {
                    stringBuilder = stringBuilder + ((inlineElement as TextElementBox).text);
                }
            } else if (inlineElement instanceof FieldElementBox) {
                let fieldBegin: FieldElementBox = inlineElement as FieldElementBox;
                if (!isNullOrUndefined(fieldBegin.fieldEnd)) {
                    // tslint:disable-next-line:max-line-length 
                    inlineElement = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd as FieldElementBox : fieldBegin.fieldSeparator as FieldElementBox;
                }
            }
            if (!isNullOrUndefined(inlineElement) && isNullOrUndefined(inlineElement.nextNode)) {
                break;
            }
            if (!isNullOrUndefined(inlineElement)) {
                inlineElement = inlineElement.nextNode as ElementBox;
            }
        } while (true);
        let text: string = stringBuilder.toString();
        let matches: RegExpExecArray[] = [];
        let matchObject: RegExpExecArray;
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            matches.push(matchObject);
        }
        for (let i: number = 0; i < matches.length; i++) {
            let match: RegExpExecArray = matches[i];
            let result: TextSearchResult = results.addResult();
            let spanKeys: TextElementBox[] = spans.keys;
            for (let i: number = 0; i < spanKeys.length; i++) {
                let span: TextElementBox = spanKeys[i];
                let startIndex: number = spans.get(span);
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
                    let offset: number = (span.line).getOffset(span, index);
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
                    let offset: number = (span.line).getOffset(span, index);
                    result.end = this.getTextPosition(span.line, offset.toString());
                    result.end.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
                    result.end.setPositionParagraph(span.line, offset);
                    break;
                }
            }
            result.isHeader = this.isHeader;
            result.isFooter = this.isFooter;
            if (isFirstMatch) {
                results.currentIndex = 0;
                return undefined;
            } else if (results.currentIndex < 0 && selectionEnd.isExistBefore(result.start)) {
                results.currentIndex = results.indexOf(result);
            }
        }
        // tslint:disable-next-line:max-line-length
        let paragraphWidget: ParagraphWidget = this.owner.selection.getNextParagraphBlock(inlineElement.line.paragraph) as ParagraphWidget;
        return paragraphWidget;
    }
    private getTextPosition(lineWidget: LineWidget, hierarchicalIndex: string): TextPosition {
        let textPosition: TextPosition = new TextPosition(this.owner);
        let index: string = textPosition.getHierarchicalIndex(lineWidget, hierarchicalIndex);
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

    get left(): number {
        return this.leftInternal;
    }
    set left(value: number) {
        this.leftInternal = value;
    }
    get width(): number {
        return this.widthInternal;
    }
    set width(value: number) {
        this.widthInternal = value;
    }

    constructor(left: number, width: number) {
        this.leftInternal = left;
        this.widthInternal = width;
    }
}