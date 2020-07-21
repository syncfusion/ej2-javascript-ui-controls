import { Search } from './search';
import { TextSearchResultInfo, ParagraphInfo } from '../editor/editor-helper';
import { TextSearchResult } from './text-search-result';
import { TextPosition } from '../selection/selection-helper';
/**
 * Search Result info
 */
export class SearchResults {
    private searchModule: Search;
    /**
     * Gets the length of search results.
     * @aspType int
     * @blazorType int
     */
    public get length(): number {
        return this.searchModule.textSearchResults.length;
    }
    /**
     * Gets the index of current search result.
     * @aspType int
     * @blazorType int
     */
    public get index(): number {
        return this.searchModule.textSearchResults.currentIndex;
    }
    /**
     * Set the index of current search result.
     * @aspType int
     * @blazorType int
     */
    public set index(value: number) {
        if (this.length === 0 || value < 0 || value > this.searchModule.textSearchResults.length - 1) {
            return;
        }
        this.searchModule.textSearchResults.currentIndex = value;
        this.navigate(value);
    }
    /**
     * @private
     */
    constructor(search: Search) {
        this.searchModule = search;
    }
    /**
     * Get start and end offset of searched text results.
     */
    public getTextSearchResultsOffset(): TextSearchResultInfo[] {
        let index: TextSearchResultInfo[] = [];
        let searchIndex: TextSearchResultInfo;
        for (let i: number = 0; i < this.searchModule.textSearchResults.innerList.length; i++) {
            searchIndex = this.getOffset(this.searchModule.textSearchResults.innerList[i]);
            index.push(searchIndex);
        }
        return index;
    }
    private getOffset(innerList: TextSearchResult): TextSearchResultInfo {
        let start: TextPosition = innerList.start;
        let end: TextPosition = innerList.end;
        let blockInfo: ParagraphInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(start);
        // tslint:disable-next-line:max-line-length
        let startIndex: string = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.searchModule.documentHelper.owner.selection.getParagraphInfo(end);
        // tslint:disable-next-line:max-line-length
        let endIndex: string = this.searchModule.documentHelper.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        return { 'startOffset': startIndex, 'endOffset': endIndex };
    }

    /**
     * Get the module name.
     */
    private getModuleName(): string {
        return 'SearchResults';
    }
    /**
     * Replace text in current search result.
     * @param textToReplace text to replace 
     * @private
     */
    public replace(textToReplace: string): void {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceInternal(textToReplace);
    }
    /**
     * Replace all the instance of search result.
     * @param textToReplace text to replace 
     */
    public replaceAll(textToReplace: string): void {
        if (this.index === -1) {
            return;
        }
        this.searchModule.replaceAllInternal(textToReplace);
    }
    /**
     * @private
     */
    public navigate(index: number): void {
        this.searchModule.navigate(this.searchModule.textSearchResults.currentSearchResult);
        this.searchModule.highlight(this.searchModule.textSearchResults);
    }
    /**
     * Clears all the instance of search result.
     */
    public clear(): void {
        this.searchModule.textSearchResults.clearResults();
        this.searchModule.clearSearchHighlight();
        this.searchModule.viewer.renderVisiblePages();
    }
}