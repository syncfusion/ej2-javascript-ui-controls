import { Search } from './search';
/**
 * Search Result info
 */
export class SearchResults {
    private searchModule: Search;
    /**
     * Gets the length of search results.
     */
    get length(): number {
        return this.searchModule.textSearchResults.length;
    }
    /**
     * Gets the index of current search result.
     */
    get index(): number {
        return this.searchModule.textSearchResults.currentIndex;
    }
    /**
     * Set the index of current search result.
     */
    set index(value: number) {
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