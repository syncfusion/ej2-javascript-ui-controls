import { Search } from './search';
import { TextSearchResultInfo, ParagraphInfo } from '../editor/editor-helper';
import { TextSearchResult } from './text-search-result';
import { TextPosition } from '../selection/selection-helper';
import { TextSearchResults } from './text-search-results';
/**
 * Search Result info
 */
export class SearchResults {
    private searchModule: Search;
    /**
     * Gets the length of search results.
     *
     * @aspType int
     * @returns {number} - Returns search results length.
     */
    public get length(): number {
        return this.searchModule.textSearchResults.length;
    }
    /**
     * Gets the index of current search result.
     *
     * @aspType int
     * @returns {number} - Returns current search result index.
     */
    public get index(): number {
        return this.searchModule.textSearchResults.currentIndex;
    }
    /**
     * Set the index of current search result.
     *
     * @param {number} value - Specifies the search result index.
     * @aspType int
     */
    public set index(value: number) {
        if (this.length === 0 || value < 0 || value > this.searchModule.textSearchResults.length - 1) {
            return;
        }
        this.searchModule.textSearchResults.currentIndex = value;
        this.navigate();
    }

    public constructor(search: Search) {
        this.searchModule = search;
    }
    /**
     * Get start and end offset of searched text results.
     *
     * @returns {TextSearchResults[]} - Returns the text search results.
     */
    public getTextSearchResultsOffset(): TextSearchResultInfo[] {
        const index: TextSearchResultInfo[] = [];
        let searchIndex: TextSearchResultInfo;
        for (let i: number = 0; i < this.searchModule.textSearchResults.innerList.length; i++) {
            searchIndex = this.getOffset(this.searchModule.textSearchResults.innerList[i]);
            index.push(searchIndex);
        }
        return index;
    }
    private getOffset(innerList: TextSearchResult): TextSearchResultInfo {
        const start: TextPosition = innerList.start;
        const end: TextPosition = innerList.end;
        let blockInfo: ParagraphInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(start);
        /* eslint-disable-next-line max-len */
        const startIndex: string = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(end);
        /* eslint-disable-next-line max-len */
        const endIndex: string = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        return { 'startOffset': startIndex, 'endOffset': endIndex };
    }


    private getModuleName(): string {
        return 'SearchResults';
    }
    /**
     * Replace text in current search result.
     *
     * @private
     * @param {string} textToReplace - text to replace
     * @returns {void}
     */
    public replace(textToReplace: string): void {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceInternal(textToReplace);
    }
    /**
     * Replace all the instance of search result.
     *
     * @param {string} textToReplace text to replace
     * @returns {void}
     */
    public replaceAll(textToReplace: string): void {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceAllInternal(textToReplace);
    }
    /**
     * @private
     * @returns {void}
     */
    public navigate(): void {
        this.searchModule.navigate(this.searchModule.textSearchResults.currentSearchResult);
        this.searchModule.highlight(this.searchModule.textSearchResults);
    }
    /**
     * Clears all the instance of search result.
     *
     * @returns {void}
     */
    public clear(): void {
        this.searchModule.textSearchResults.clearResults();
        this.searchModule.clearSearchHighlight();
        this.searchModule.viewer.renderVisiblePages();
    }
}
