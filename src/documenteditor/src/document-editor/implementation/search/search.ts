import { Dictionary } from '../../base/dictionary';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import { DocumentEditor } from '../../document-editor';
import { LineWidget, ElementBox, TextElementBox, FieldElementBox, Page, HeaderFooterWidget } from '../viewer/page';
import { LayoutViewer } from '../index';
import { ElementInfo } from '../editor/editor-helper';
import { SearchWidgetInfo } from './text-search';
import { TextSearch } from '../search/text-search';
import { TextSearchResult } from '../search/text-search-result';
import { TextSearchResults } from '../search/text-search-results';
import { SearchResults } from './search-results';
import { ParagraphWidget } from '../viewer/page';
import { SearchResultsChangeEventArgs } from '../../base';
/**
 * Search module
 */
export class Search {
    private owner: DocumentEditor;
    /**
     * @private
     */
    public textSearch: TextSearch;
    /**
     * @private
     */
    public textSearchResults: TextSearchResults;
    /**
     * @private
     */
    public searchResultsInternal: SearchResults;
    /**
     * @private
     */
    public searchHighlighters: Dictionary<LineWidget, SearchWidgetInfo[]> = undefined;
    private isHandledOddPageHeader: boolean = undefined;
    private isHandledEvenPageHeader: boolean = undefined;
    private isHandledOddPageFooter: boolean = undefined;
    private isHandledEvenPageFooter: boolean = undefined;
    /**
     * @private
     */
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    /**
     * Gets the search results object.
     */
    get searchResults(): SearchResults {
        return this.searchResultsInternal;
    }
    /**
     * @private
     */
    constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.searchHighlighters = new Dictionary<LineWidget, SearchWidgetInfo[]>();
        this.textSearch = new TextSearch(this.owner);
        this.textSearchResults = new TextSearchResults(this.owner);
        this.searchResultsInternal = new SearchResults(this);
    }
    /**
     * Get the module name.
     */
    private getModuleName(): string {
        return 'Search';
    }

    //#region Find & Find All
    /**
     * Finds the immediate occurrence of specified text from cursor position in the document.
     * @param  {string} text
     * @param  {FindOption} findOption? - Default value of ‘findOptions’ parameter is 'None'.
     * @private
     */
    public find(text: string, findOptions?: FindOption): void {
        if (isNullOrUndefined(findOptions)) {
            findOptions = 'None';
        }
        let result: TextSearchResult = this.textSearch.find(text, findOptions);
        if (!isNullOrUndefined(result)) {
            this.navigate(result);
        }
    }

    /**
     * Finds all occurrence of specified text in the document.
     * @param  {string} text
     * @param  {FindOption} findOption? - Default value of ‘findOptions’ parameter is 'None'.
     */
    public findAll(text: string, findOptions?: FindOption): void {
        if (isNullOrUndefined(text || text === '')) {
            return;
        }
        if (isNullOrUndefined(findOptions)) {
            findOptions = 'None';
        }
        let results: TextSearchResults = this.textSearch.findAll(text, findOptions);
        if (!isNullOrUndefined(results) && results.length > 0) {
            this.navigate(results.innerList[results.currentIndex]);
            this.highlight(results);
        }
    }
    //#endregion

    //#region Replace and Replace All   
    /**
     * Replace the searched string with specified string
     * @param  {string} replaceText
     * @param  {TextSearchResult} result
     * @param  {TextSearchResults} results
     * @private
     */
    public replace(replaceText: string, result: TextSearchResult, results: TextSearchResults): number {
        if (isNullOrUndefined(this.viewer.owner) || this.viewer.owner.isReadOnlyMode || isNullOrUndefined(results)) {
            return 0;
        }
        if (!isNullOrUndefined(this.viewer)) {
            this.clearSearchHighlight();
        }
        this.navigate(result);
        let endPosition: TextPosition = this.viewer.selection.start;
        let index: number = results.indexOf(result);
        if (index < 0) {
            return 0;
        }
        this.owner.editorModule.insertText(replaceText, true);
        let endTextPosition: TextPosition = result.end;
        let startPosition: TextPosition = new TextPosition(this.viewer.owner);
        startPosition.setPositionParagraph(endTextPosition.currentWidget, endPosition.offset - replaceText.length);
        this.viewer.selection.selectRange(endPosition, startPosition);
        let eventArgs: SearchResultsChangeEventArgs = { source: this.viewer.owner };
        this.viewer.owner.trigger('searchResultsChange', eventArgs);
        return 1;
    }
    /**
     * Find the textToFind string in current document and replace the specified string.
     * @param  {string} textToFind
     * @param  {string} textToReplace
     * @param  {FindOption} findOptions? - Default value of ‘findOptions’ parameter is FindOption.None.
     * @private
     */
    public replaceInternal(textToReplace: string, findOptions?: FindOption): void {
        if ((textToReplace === '' || isNullOrUndefined(textToReplace))) {
            return;
        }
        if (isNullOrUndefined(findOptions)) {
            findOptions = 'None';
        }
        let textToFind: string = this.textSearchResults.currentSearchResult.text;
        let pattern: RegExp = this.viewer.owner.searchModule.textSearch.stringToRegex(textToFind, findOptions);
        let index: string = this.owner.selection.end.getHierarchicalIndexInternal();
        let result: TextSearchResult = this.viewer.owner.searchModule.textSearch.findNext(pattern, findOptions, index);
        if (!isNullOrUndefined(result)) {
            this.navigate(result);
            this.textSearchResults.addResult();
            this.textSearchResults.innerList[0] = result;
            this.replace(textToReplace, result, this.textSearchResults);
            index = this.owner.selection.end.getHierarchicalIndexInternal();
            result = this.textSearch.findNext(textToFind, findOptions, index);
            if (result) {
                this.textSearchResults.addResult();
                this.textSearchResults.innerList[0] = result;
                this.navigate(result);
            }
        }
    }
    /**
     * Replace all the searched string with specified string
     * @param  {string} replaceText
     * @param  {TextSearchResults} results
     * @private
     */
    public replaceAll(replaceText: string, results: TextSearchResults): number {
        if (isNullOrUndefined(this.viewer.owner) || this.viewer.owner.isReadOnlyMode || isNullOrUndefined(results)) {
            return 0;
        }
        if (this.owner.editorHistory) {
            this.owner.editorHistory.initComplexHistory(this.owner.selection, 'ReplaceAll');
        }
        let count: number = results.length;
        this.viewer.owner.isLayoutEnabled = false;
        for (let i: number = count - 1; i >= 0; i--) {
            let result: TextSearchResult = results.innerList[i];
            this.navigate(results.innerList[i]);
            this.owner.editorModule.insertText(replaceText, true);
            if (result.isHeader || result.isFooter) {
                this.viewer.layout.updateHeaderFooterToParent(this.viewer.selection.start.paragraph.bodyWidget as HeaderFooterWidget);
            }
            results.innerList[i].destroy();
        }
        if (this.owner.editorHistory && !isNullOrUndefined(this.owner.editorHistory.currentHistoryInfo)) {
            this.owner.editorHistory.updateComplexHistory();
        } else {
            this.owner.editorModule.updateComplexWithoutHistory(2);
        }
        this.searchResults.clear();
        return count;
    }
    /**
     * Find the textToFind string in current document and replace the specified string.
     * @param  {string} textToFind
     * @param  {string} textToReplace
     * @param  {FindOption} findOptions? - Default value of ‘findOptions’ parameter is FindOption.None.
     * @private
     */
    public replaceAllInternal(textToReplace: string, findOptions?: FindOption): void {
        if ((textToReplace === '' || isNullOrUndefined(textToReplace))) {
            return;
        }
        if (isNullOrUndefined(findOptions)) {
            findOptions = 'None';
        }
        if (this.textSearchResults.length > 0) {
            this.navigate(this.textSearchResults.innerList[this.textSearchResults.currentIndex]);
            this.highlight(this.textSearchResults);
            this.replaceAll(textToReplace, this.textSearchResults);
        }
    }

    //#endregion

    //#region Highlight Search Result
    /**
     * @private
     */
    public navigate(textSearchResult: TextSearchResult): void {
        if (textSearchResult) {
            let start: TextPosition = textSearchResult.start;
            let end: TextPosition = textSearchResult.end;
            if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.selection) && !isNullOrUndefined(start) &&
                !isNullOrUndefined(end) && !isNullOrUndefined(start.paragraph) && !isNullOrUndefined(end.paragraph)) {
                this.owner.selection.selectRange(start, end);
            }
        }
    }
    /**
     * @private
     */
    public highlight(textSearchResults: TextSearchResults): void {
        this.searchHighlighters = new Dictionary<LineWidget, SearchWidgetInfo[]>();
        for (let i: number = 0; i < textSearchResults.innerList.length; i++) {
            let result: TextSearchResult = textSearchResults.innerList[i];
            this.highlightResult(result);
        }
        this.viewer.renderVisiblePages();
    }
    /**
     * @private
     */
    public highlightResult(result: TextSearchResult): void {
        this.highlightSearchResult(result.start.paragraph, result.start, result.end);
    }
    /**
     * Highlight search result
     * @private
     */
    public highlightSearchResult(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void {
        let selectionStartIndex: number = 0;
        let selectionEndIndex: number = 0;
        let startElement: ElementBox = null;
        let endElement: ElementBox = null;
        // tslint:disable-next-line:max-line-length
        let lineWidget: ElementInfo = this.viewer.selection.getStartLineWidget(paragraph as ParagraphWidget, start, startElement, selectionStartIndex);
        selectionStartIndex = lineWidget.index;
        startElement = lineWidget.element;
        let startLineWidget: LineWidget = startElement ? startElement.line : paragraph.childWidgets[0] as LineWidget;
        let endLine: ElementInfo = this.viewer.selection.getEndLineWidget(end, endElement, selectionEndIndex);
        selectionEndIndex = endLine.index;
        endElement = endLine.element;
        let endLineWidget: LineWidget = endElement ? endElement.line :
            end.paragraph.childWidgets[end.paragraph.childWidgets.length - 1] as LineWidget;
        let top: number = this.viewer.selection.getTop(startLineWidget);
        let left: number = this.viewer.selection.getLeftInternal(startLineWidget, startElement, selectionStartIndex);

        if (!isNullOrUndefined(startLineWidget) && startLineWidget === endLineWidget) {
            //find result ends in current line.
            let right: number = this.viewer.selection.getLeftInternal(endLineWidget, endElement, selectionEndIndex);
            this.createHighlightBorder(startLineWidget, right - left, left, top);
        } else {
            if (!isNullOrUndefined(startLineWidget)) {
                if (paragraph !== startLineWidget.paragraph) {
                    paragraph = startLineWidget.paragraph;
                }
                // tslint:disable-next-line:max-line-length
                this.createHighlightBorder(startLineWidget, this.viewer.selection.getWidth(startLineWidget, true) - (left - startLineWidget.paragraph.x), left, top);
                let lineIndex: number = startLineWidget.paragraph.childWidgets.indexOf(startLineWidget);
                //Iterates to last item of paragraph or search result end.

                let startParagraphWidget: number;
                for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
                    if (paragraph === startLineWidget.paragraph) {
                        lineIndex += 1;
                    }
                    this.highlightSearchResultParaWidget(paragraph, lineIndex, endLineWidget, endElement, selectionEndIndex);
                    if (paragraph === endLineWidget.paragraph) {
                        return;
                    } else {
                        lineIndex = 0;
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public createHighlightBorder(lineWidget: LineWidget, width: number, left: number, top: number): void {
        let findHighLight: SearchWidgetInfo = this.addSearchHighlightBorder(lineWidget);
        let page: Page = this.viewer.owner.selection.getPage(lineWidget.paragraph);
        let pageTop: number = page.boundingRectangle.y;
        let pageLeft: number = page.boundingRectangle.x;
        findHighLight.left = Math.ceil(left);
        top = Math.ceil(top);
        findHighLight.width = Math.floor(width);
        let height: number = Math.floor(lineWidget.height);
        let context: CanvasRenderingContext2D = this.viewer.containerContext;
    }
    /**
     * Adds search highlight border.
     * @private
     */
    public addSearchHighlightBorder(lineWidget: LineWidget): SearchWidgetInfo {
        let highlighters: SearchWidgetInfo[] = undefined;
        if (this.searchHighlighters.containsKey(lineWidget)) {
            highlighters = this.searchHighlighters.get(lineWidget);
        } else {
            highlighters = [];
            this.searchHighlighters.add(lineWidget, highlighters);
        }
        let searchHighlight: SearchWidgetInfo = new SearchWidgetInfo(0, 0);
        highlighters.push(searchHighlight);
        return searchHighlight;
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public highlightSearchResultParaWidget(widget: ParagraphWidget, startIndex: number, endLine: LineWidget, endElement: ElementBox, endIndex: number): void {
        let top: number = 0;
        for (let j: number = startIndex; j < widget.childWidgets.length; j++) {
            let lineWidget: LineWidget = widget.childWidgets[j] as LineWidget;
            if (j === startIndex) {
                top = this.viewer.selection.getTop(lineWidget);
            }
            let left: number = this.viewer.selection.getLeft(lineWidget);
            if (lineWidget === endLine) {
                //Search result ends in current line.
                let right: number = this.viewer.selection.getLeftInternal(endLine, endElement, endIndex);
                this.createHighlightBorder(lineWidget, right - left, left, top);
                return;
            }
            this.createHighlightBorder(lineWidget, this.viewer.selection.getWidth(lineWidget, true) - (left - widget.x), left, top);
            top += lineWidget.height;
        }
    }

    //#endregion

    //#region Get find result view
    /**
     * @private
     */
    public addSearchResultItems(result: string): void {
        if (isNullOrUndefined(result) || result === '') {
            return;
        }
        if (isNullOrUndefined(this.owner.findResultsList)) {
            this.owner.findResultsList = [];
        }
        this.owner.findResultsList.push(result);
    }
    /**
     * @private
     */
    public addFindResultView(textSearchResults: TextSearchResults): void {
        for (let i: number = 0; i < textSearchResults.innerList.length; i++) {
            let result: TextSearchResult = textSearchResults.innerList[i];
            this.addFindResultViewForSearch(result);
        }
        this.isHandledOddPageHeader = true;
        this.isHandledOddPageFooter = true;
        this.isHandledEvenPageHeader = true;
        this.isHandledEvenPageFooter = true;
    }
    /**
     * @private
     */
    // tslint:disable:max-func-body-length
    public addFindResultViewForSearch(result: TextSearchResult): void {
        if (result.start != null && result.end != null && result.start.paragraph != null && result.end.paragraph != null) {
            let prefixText: string;
            let suffixtext: string;
            let currentText: string;
            let startIndex: number = 0;
            let inlineObj: ElementInfo = (result.start.currentWidget as LineWidget).getInline(result.start.offset, startIndex);
            let inline: ElementBox = inlineObj.element;
            startIndex = inlineObj.index;
            let prefix: string = '';
            let lastIndex: number = 0;
            if (inline instanceof FieldElementBox) {
                let elementInfo: ElementInfo = this.owner.selection.getRenderedInline(inline as FieldElementBox, startIndex);
                if (elementInfo.element.nextNode instanceof TextElementBox) {
                    inline = elementInfo.element.nextNode;
                    startIndex = elementInfo.index;
                } else {
                    inline = elementInfo.element;
                    startIndex = elementInfo.index;
                }
            }
            let boxObj: ElementInfo = this.owner.selection.getElementBoxInternal(inline, startIndex);
            let box: ElementBox = boxObj.element;
            startIndex = boxObj.index;
            if (box != null) {
                if (box instanceof TextElementBox && startIndex > 0) {
                    prefix = (box as TextElementBox).text.substring(0, startIndex);
                }
                let boxIndex: number = box.line.children.indexOf(box);
                // tslint:disable-next-line:max-line-length
                lastIndex = prefix.lastIndexOf(' ');
                while (lastIndex < 0 && boxIndex > 0 && box.line.children[boxIndex - 1] instanceof TextElementBox) {
                    prefix = (box.line.children[boxIndex - 1] as TextElementBox).text + prefix;
                    boxIndex--;
                    lastIndex = prefix.lastIndexOf(' ');
                }
            }
            let shiftIndex: number = prefix.lastIndexOf('\v');
            if (shiftIndex > 0) {
                prefix = prefix.substring(0, shiftIndex);
            } else {
                lastIndex = prefix.lastIndexOf(' ');
                prefixText = lastIndex < 0 ? prefix : prefix.substring(lastIndex + 1);
            }
            currentText = result.text;
            let endIndex: number = 0;
            let endInlineObj: ElementInfo = (result.end.currentWidget as LineWidget).getInline(result.end.offset, endIndex);
            let endInline: ElementBox = endInlineObj.element;
            endIndex = endInlineObj.index;
            suffixtext = '';
            //Checks prefix element box is empty
            if (boxObj != null) {
                // Gets the element box using endIndex of the text and set as suffix
                boxObj = this.owner.selection.getElementBoxInternal(endInline, endIndex);
                box = boxObj.element;
                endIndex = boxObj.index;
            }
            //Checks suffix element box is empty.
            if (box != null) {
                if (box instanceof TextElementBox && endIndex < (box as TextElementBox).length) {
                    suffixtext = (box as TextElementBox).text.substring(endIndex);
                }
                let boxIndex: number = box.line.children.indexOf(box);
                // tslint:disable-next-line:max-line-length
                while (boxIndex + 1 < box.line.children.length && (box.line.children[boxIndex + 1] instanceof TextElementBox) || (box.line.children[boxIndex + 1] instanceof FieldElementBox)) {
                    if (box.line.children[boxIndex + 1] instanceof FieldElementBox) {
                        boxIndex = boxIndex + 2;
                    } else {
                        suffixtext = suffixtext + (box.line.children[boxIndex + 1] as TextElementBox).text;
                        boxIndex = boxIndex + 1;
                    }
                }
            }
            lastIndex = suffixtext.lastIndexOf(' ');
            suffixtext = suffixtext === '\v' ? suffixtext = '' : suffixtext;
            let headerFooterString: string = '';
            if (result.isHeader) {
                headerFooterString = '<span class="e-de-header-footer-list">' + 'Header' + ': ' + '</span>';
            } else if (result.isFooter) {
                headerFooterString = '<span class="e-de-header-footer-list">' + 'Footer' + ': ' + '</span>';
            } else {
                headerFooterString = '';
                headerFooterString = '';
                this.isHandledOddPageHeader = true;
                this.isHandledEvenPageHeader = true;
                this.isHandledOddPageFooter = true;
                this.isHandledEvenPageFooter = true;
            }
            let listElement: string = '';
            let page: Page = result.viewer.selection.getPage(result.start.paragraph);
            if (isNullOrUndefined(this.isHandledEvenPageHeader) && isNullOrUndefined(this.isHandledEvenPageFooter)) {
                this.isHandledEvenPageHeader = true;
                this.isHandledEvenPageFooter = true;
            } else if (isNullOrUndefined(this.isHandledOddPageHeader) && isNullOrUndefined(this.isHandledOddPageFooter)) {
                this.isHandledOddPageHeader = true;
                this.isHandledOddPageFooter = true;
            }
            if (result.isHeader) {
                if (page.headerWidget.headerFooterType === 'FirstPageHeader' && page.bodyWidgets[0].sectionFormat.differentFirstPage) {
                    // tslint:disable-next-line:max-line-length
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                } else if (page.headerWidget.headerFooterType === 'EvenHeader' && this.isHandledEvenPageHeader) {
                    // tslint:disable-next-line:max-line-length
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                    this.isHandledEvenPageHeader = false;
                    // tslint:disable-next-line:max-line-length
                } else if (page.headerWidget.headerFooterType === 'OddHeader' && this.isHandledOddPageHeader) {
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                    this.isHandledOddPageHeader = false;
                }
            } else if (result.isFooter) {
                if (page.footerWidget.headerFooterType === 'FirstPageFooter' && page.bodyWidgets[0].sectionFormat.differentFirstPage) {
                    // tslint:disable-next-line:max-line-length
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                } else if (page.footerWidget.headerFooterType === 'EvenFooter' && this.isHandledEvenPageFooter) {
                    // tslint:disable-next-line:max-line-length
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                    this.isHandledEvenPageFooter = false;
                    // tslint:disable-next-line:max-line-length
                } else if (page.footerWidget.headerFooterType === 'OddFooter' && this.isHandledOddPageFooter) {
                    listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
                    this.isHandledOddPageFooter = false;
                }
                // tslint:disable-next-line:max-line-length
            } else if (!result.isHeader && !result.isFooter) {
                listElement = '<li tabindex=0 class="e-de-search-result-item e-de-op-search-txt">' + headerFooterString + prefix + '<span class="e-de-op-search-word" style="pointer-events:none">' + result.text + '</span>' + suffixtext + '</li>';
            }
            this.addSearchResultItems(listElement);
        }
    }
    //#endregion

    /**
     * Clears search highlight.
     * @private
     */
    public clearSearchHighlight(): void {
        if (!isNullOrUndefined(this.searchHighlighters)) {
            this.searchHighlighters.clear();
            this.searchHighlighters = undefined;
        }
        let eventArgs: SearchResultsChangeEventArgs = { source: this.viewer.owner };
        this.viewer.owner.trigger('searchResultsChange', eventArgs);
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.textSearchResults) {
            this.textSearchResults.destroy();
        }
    }
}