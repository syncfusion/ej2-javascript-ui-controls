import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';
import { PdfViewer, PdfViewerBase, AjaxHandler, TileRenderingSettingsModel } from '../index';
import { DocumentTextCollectionSettingsModel, RectangleBoundsModel } from '../pdfviewer-model';

/**
 * TextSearch module
 */
export class TextSearch {

    /**
     * @private
     */
    public isTextSearch: boolean = false;
    /**
     * @private
     */
    public searchBtn: HTMLElement;
    /**
     * @private
     */
    public searchInput: HTMLElement;
    /**
     * @private
     */
    public searchCount: number = 0;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private searchBox: HTMLElement;
    private nextSearchBtn: HTMLElement;
    private prevSearchBtn: HTMLElement;
    private checkBox: CheckBox;
    private searchIndex: number = 0;
    private currentSearchIndex: number = 0;
    private searchPageIndex: number = null;
    private searchString: string = null;
    private isMatchCase: boolean = false;
    private searchRequestHandler: AjaxHandler = null;
    // tslint:disable-next-line
    private textContents: Array<string[]> = new Array();
    // tslint:disable-next-line
    private searchMatches: Array<number[]> = new Array();
    // tslint:disable-next-line
    private searchCollection: Array<{ [key: string]: object }[]> = new Array();
    private searchedPages: number[] = [];
    private isPrevSearch: boolean = false;
    // tslint:disable-next-line
    private tempElementStorage: Array<{ [key: string]: string }> = new Array();
    /**
     * @private
     */
    public isMessagePopupOpened: boolean = false;
    /**
     * @private
     */
    // tslint:disable-next-line
    public documentTextCollection: DocumentTextCollectionSettingsModel[][];
    /**
     * @private
     */
    public isTextRetrieved: boolean = false;
    private isTextSearched: boolean = false;
    private isTextSearchEventTriggered: boolean = false;
    /**
     * @private
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     */
    public createTextSearchBox(): void {
        // tslint:disable-next-line:max-line-length
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-search-bar' });
        let searchElementsContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-search-bar-elements' });
        // tslint:disable-next-line:max-line-length
        let searchInputContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-search-input' });
        this.searchInput = createElement('input', { id: this.pdfViewer.element.id + '_search_input', className: 'e-input' });
        (this.searchInput as HTMLInputElement).type = 'text';
        (this.searchInput as HTMLInputElement).placeholder = this.pdfViewer.localeObj.getConstant('Find in document');
        // tslint:disable-next-line:max-line-length
        this.searchBtn = createElement('span', { id: this.pdfViewer.element.id + '_search_box-icon', className: 'e-input-group-icon e-input-search-group-icon e-pv-search-icon' });
        searchInputContainer.appendChild(this.searchInput);
        searchInputContainer.appendChild(this.searchBtn);
        searchElementsContainer.appendChild(searchInputContainer);
        if (this.pdfViewer.enableRtl) {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-next-search');
        } else {
            this.prevSearchBtn = this.createSearchBoxButtons('prev_occurrence', 'e-pv-prev-search');
        }
        this.prevSearchBtn.setAttribute('aria-label', 'Previous Search text');
        searchElementsContainer.appendChild(this.prevSearchBtn);
        if (this.pdfViewer.enableRtl) {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-prev-search');
        } else {
            this.nextSearchBtn = this.createSearchBoxButtons('next_occurrence', 'e-pv-next-search');
        }
        this.nextSearchBtn.setAttribute('aria-label', 'Next Search text');
        searchElementsContainer.appendChild(this.nextSearchBtn);
        // tslint:disable-next-line:max-line-length
        let matchCaseContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-match-case-container' });
        let matchCaseInput: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
        (matchCaseInput as HTMLInputElement).type = 'checkbox';
        matchCaseContainer.appendChild(matchCaseInput);
        this.searchBox.appendChild(searchElementsContainer);
        this.searchBox.appendChild(matchCaseContainer);
        this.pdfViewerBase.mainContainer.appendChild(this.searchBox);
        // tslint:disable-next-line:max-line-length
        this.checkBox = new CheckBox({ cssClass: 'e-pv-match-case', label: this.pdfViewer.localeObj.getConstant('Match case'), change: this.checkBoxOnChange.bind(this) });
        this.checkBox.appendTo(matchCaseInput);
        this.showSearchBox(false);
        if (this.pdfViewer.enableRtl) {
            this.searchBox.classList.add('e-rtl');
            this.searchBox.style.left = '88.3px';
        } else {
            this.searchBox.classList.remove('e-rtl');
            this.searchBox.style.right = '88.3px';
        }
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.parentElement.classList.add('e-input-focus');
        });
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.parentElement.classList.remove('e-input-focus');
        });
        this.searchInput.addEventListener('keydown', this.searchKeypressHandler.bind(this));
        this.searchBtn.addEventListener('click', this.searchClickHandler.bind(this));
        this.nextSearchBtn.addEventListener('click', this.nextButtonOnClick.bind(this));
        this.prevSearchBtn.addEventListener('click', this.prevButtonOnClick.bind(this));
    }

    /**
     * @private
     */
    public textSearchBoxOnResize(): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
            let secondaryToolbar: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer_popup');
            if (secondaryToolbar) {
                if (secondaryToolbar.contains(this.pdfViewerBase.getElement('_search').parentElement)) {
                    this.searchBox.style.right = '0px';
                }
            }
        } else {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft < this.searchBox.offsetLeft + this.searchBox.clientWidth) {
                this.searchBox.style.right = '0px';
                // tslint:disable-next-line
                this.searchBox.style.width = parseInt(this.searchBox.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
                // tslint:disable-next-line
                this.searchInput.style.width = parseInt(this.searchInput.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
            } else {
                this.searchBox.style.right = '88.3px';
                this.searchBox.style.width = '';
                this.searchInput.style.width = '';
            }
        }
    }

    /**
     * @private
     */
    public showSearchBox(isShow: boolean): void {
        if (isShow) {
            this.searchBox.style.display = 'block';
        } else {
            this.searchBox.style.display = 'none';
        }
        this.onTextSearchClose();
    }

    /**
     * @private
     */
    public searchAfterSelection(): void {
        if (this.isTextSearch) {
            this.initSearch(this.searchPageIndex, true);
            this.highlightOthers();
        }
    }

    private initiateTextSearch(searchElement: HTMLElement): void {
        let inputString: string = (searchElement as HTMLInputElement).value;
        this.initiateSearch(inputString);
    }

    /**
     * @private
     */
    public initiateSearch(inputString: string): void {
        if (inputString !== this.searchString) {
            this.isTextSearch = false;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
        }
        this.clearAllOccurrences();
        if (inputString !== '') {
            // tslint:disable-next-line
            if (this.searchMatches[this.searchPageIndex] && inputString === this.searchString) {
                if (this.searchMatches[this.searchPageIndex].length === 0) {
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    this.nextSearch();
                }
            } else {
                this.resetVariables();
                this.searchIndex = 0;
                this.textSearch(inputString);
            }
        }
    }

    private textSearch(inputString: string): void {
        if (inputString !== '' || inputString) {
            this.searchString = inputString;
            this.isTextSearch = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.searchCount = 0;
            this.isTextSearchEventTriggered = false;
            this.pdfViewer.fireTextSearchStart(inputString, this.isMatchCase);
            if (this.pdfViewer.isExtractText) {
                if (this.isTextRetrieved) {
                    for (let i: number = 0; i < this.pdfViewerBase.pageCount; i++) {
                        this.initSearch(i, false, true);
                    }
                } else {
                    this.isTextSearched = true;
                    for (let i: number = 0; i < this.documentTextCollection.length; i++) {
                        this.initSearch(i, false, true);
                    }
                }
            }
            this.initSearch(this.searchPageIndex, false);
            this.highlightOthers();
        }
    }

    private nextSearch(): void {
        this.isPrevSearch = false;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex + 1;
            if (this.searchMatches[this.searchPageIndex]) {
                // tslint:disable-next-line:max-line-length
                if (this.searchIndex >= this.searchMatches[this.searchPageIndex].length || this.searchPageIndex !== this.pdfViewerBase.currentPageNumber - 1) {
                    this.searchIndex = 0;
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    this.highlightSearchedTexts(this.searchPageIndex, false);
                }
                this.highlightOthers();
            } else {
                this.initiateTextSearch(this.searchInput);
            }
        } else {
            this.initiateTextSearch(this.searchInput);
        }
    }

    private prevSearch(): void {
        this.isPrevSearch = true;
        this.isTextSearch = true;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex - 1;
            if (this.searchIndex < 0) {
                this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                this.initSearch(this.searchPageIndex, false);
            } else {
                this.highlightSearchedTexts(this.searchPageIndex, false);
            }
            this.highlightOthers();
        } else {
            this.searchIndex = this.searchIndex - 1;
            this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
            let inputString: string = (this.searchInput as HTMLInputElement).value;
            this.textSearch(inputString);
        }
    }

    private initSearch(pageIndex: number, isSinglePageSearch: boolean, isCount?: boolean ): void {
        // tslint:disable-next-line
        let storedData: any = this.pdfViewerBase.getStoredData(pageIndex);
        let pageText: string = null;
        let textContents: string[] = null;
        // tslint:disable-next-line
        let characterBounds: any[] = null;
        if (isCount) {
            if (this.documentTextCollection.length !== 0) {
                // tslint:disable-next-line
                let documentIndex: any = this.documentTextCollection[pageIndex][pageIndex];
                let pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                if (this.documentTextCollection[pageIndex] && documentIndex) {
                    // tslint:disable-next-line:max-line-length
                    this.getSearchTextContent(pageIndex, this.searchString, pageTextData, textContents, isSinglePageSearch, this.documentTextCollection[pageIndex]);
                }
            }
        } else {
            if (storedData) {
            // tslint:disable-next-line
            pageText = storedData['pageText'];
            // tslint:disable-next-line
            textContents = storedData['textContent'];
            characterBounds = this.pdfViewerBase.textLayer.characterBound[pageIndex];
            this.textContents[pageIndex] = textContents;
            this.getPossibleMatches(pageIndex, this.searchString, pageText, textContents, isSinglePageSearch, characterBounds);
            } else {
                if (!isSinglePageSearch) {
                    this.createRequestForSearch(pageIndex);
                }
            }
        }
        if (this.pdfViewerBase.pageCount === (this.searchMatches && this.searchMatches.length)) {
            if (!this.isTextSearchEventTriggered) {
                this.isTextSearchEventTriggered = true;
                this.pdfViewer.fireTextSearchComplete(this.searchString, this.isMatchCase);
            }
        }
    }

    // tslint:disable-next-line
    private getPossibleMatches(pageIndex: number, searchString: string, pageString: string, textContents: string[], isSinglePageSearch: boolean, characterBounds: any[]): void {
        if (this.searchMatches && !this.searchMatches[pageIndex]) {
            let pageText: string = pageString;
            let searchText: string = searchString;
            let queryLength: number = searchString.length;
            if (!this.isMatchCase) {
                searchText = searchString.toLowerCase();
                pageText = pageString.toLowerCase();
            }
            let matches: number[] = [];
            let matchIndex: number = -queryLength;
            let newIndex: number = -queryLength;
            while (matchIndex !== 0) {
                if (searchText === '' || searchText === ' ' || !searchText) {
                    break;
                }
                matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
                if (searchText.indexOf(' ') !== -1) {
                    let newString: string = searchString.replace(' ', '\r\n');
                    newIndex = pageText.indexOf(newString, newIndex + queryLength);
                    if (!(newIndex <= -1)) {
                        if (newIndex < matchIndex) {
                            matches.push(newIndex);
                        }
                    }
                }
                if (matchIndex <= -1 && newIndex <= -1) {
                    break;
                }
                if (!(matchIndex <= -1)) {
                    matches.push(matchIndex);
                }
                if (newIndex > matchIndex && !(newIndex <= -1)) {
                    matches.push(newIndex);
                }
            }
            if (this.searchMatches) {
                this.searchMatches[pageIndex] = matches;
            }
        }
        if (!isSinglePageSearch) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                this.searchedPages.push(pageIndex);
            }
            this.updateSearchInputIcon(false);
        }
        if (this.searchMatches && this.searchMatches[pageIndex] && this.searchMatches[pageIndex].length !== 0) {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchIndex = this.searchMatches[pageIndex].length - 1;
                }
                if ((this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
                    // tslint:disable-next-line:max-line-length
                    if (this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (this.searchPageIndex) === this.currentSearchIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                        this.searchedPages = [];
                    }
                    this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                }
            }
            this.highlightSearchedTexts(pageIndex, isSinglePageSearch);
        } else {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                } else {
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                }
                if (this.searchedPages.indexOf(this.searchPageIndex) === -1 && this.searchedPages.length !== this.pdfViewerBase.pageCount) {
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    let searchPageIndex: number = this.getSearchPage(pageIndex);
                    // tslint:disable-next-line:max-line-length
                    if (this.searchMatches && !this.searchMatches[this.searchPageIndex] && this.searchMatches.length === 0 && this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        // tslint:disable-next-line:max-line-length
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        // tslint:disable-next-line:max-line-length
                    } else if (this.searchMatches && this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
                            // tslint:disable-next-line:max-line-length
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [];
                            this.searchIndex = -1;
                        } else {
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [];
                            this.searchIndex = 0;
                        }
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch);
                    }
                }
            }
        }
    }

    // tslint:disable-next-line
    private getSearchTextContent(pageIndex: number, searchString: string, pageString: string, textContents: string[], isSinglePageSearch: boolean, characterBounds: any[]): void {
        let pageText: string = pageString;
        let searchText: string = searchString;
        let queryLength: number = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
        }
        let matches: number[] = [];
        let matchIndex: number = -queryLength;
        let newIndex: number = -queryLength;
        while (matchIndex !== 0) {
            if (searchText === '' || searchText === ' ' || !searchText) {
                break;
            }
            matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
            if (searchText.indexOf(' ') !== -1) {
                let newString: string = searchString.replace(' ', '\r\n');
                newIndex = pageText.indexOf(newString, newIndex + queryLength);
                if (!(newIndex <= -1)) {
                    if (newIndex < matchIndex) {
                        matches.push(newIndex);
                    }
                }
            }
            if (matchIndex <= -1 && newIndex <= -1) {
                break;
            }
            if (!(matchIndex <= -1)) {
                matches.push(matchIndex);
            }
            if (newIndex > matchIndex && !(newIndex <= -1)) {
                matches.push(newIndex);
            }
        }
        if (matches.length !== 0) {
            this.searchCount = this.searchCount + matches.length;
        }
        this.searchMatches[pageIndex] = matches;
    }

    private getSearchPage(pageIndex: number): number {
        let pageNumber: number = null;
        if (this.isPrevSearch) {
            for (let i: number = pageIndex; i >= 0; i--) {
                if (i !== pageIndex && this.searchMatches[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (let j: number = this.pdfViewerBase.pageCount - 1; j > pageIndex; j--) {
                    if (this.searchMatches[j]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        } else {
            for (let i: number = pageIndex; i < this.pdfViewerBase.pageCount; i++) {
                if (i !== pageIndex && this.searchMatches[i]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                if (pageIndex === 0)  {
                    pageNumber = pageIndex;
                } else {
                    for (let j: number = 0; j < pageIndex; j++) {
                        if (this.searchMatches[j]) {
                            pageNumber = j;
                            break;
                        }
                    }
                }
            }
        }
        return pageNumber;
    }

    private highlightSearchedTexts(pageIndex: number, isSinglePageSearch: boolean): void {
        // tslint:disable-next-line
        let matches: any[] = this.searchMatches[pageIndex];
        let prevEnd: { [key: string]: object } = null;
        // tslint:disable-next-line
        let scrollPoint: any = { y: -100, x: -100 };
        let startId: number;
        let className: string;
        // tslint:disable-next-line
        let characterBounds: any[] = this.pdfViewerBase.textLayer.characterBound[pageIndex];
        if (characterBounds) {
            for (let i: number = 0; i < matches.length; i++) {
                if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                    className = 'e-pv-search-text-highlight';
                } else {
                    className = 'e-pv-search-text-highlightother';
                }
                this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className);
            }
            if (pageIndex === this.searchPageIndex && !isSinglePageSearch) {
                let element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                if (element) {
                    let targetScrollElement: HTMLElement = this.getScrollElement(element);
                    this.scrollToSearchStr(targetScrollElement, scrollPoint);
                } else {
                    this.pdfViewerBase.updateScrollTop(pageIndex);
                    let element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                    if (element) {
                        let targetScrollElement: HTMLElement = this.getScrollElement(element);
                        this.scrollToSearchStr(targetScrollElement, scrollPoint);
                    }
                }
            }
        }
    }

    // tslint:disable-next-line
    private addDivForSearch(index: number, pageIndex: number, characterBounds: any, queryLength: number, className: string): void {
        let textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
        if (isNullOrUndefined(textLayer) && className === 'e-pv-search-text-highlight') {
            if (this.pdfViewer.navigation) {
                this.pdfViewer.navigation.goToPage(pageIndex + 1);
            }
        }
        let count: number = this.searchMatches[pageIndex][index];
        let initial: number = count;
        let divCount: number = 0;
        while (count < initial + queryLength) {
            count = this.addDivElement(count, characterBounds, queryLength, className, index, pageIndex, initial, divCount);
            divCount++;
        }
    }

    // tslint:disable-next-line
    private addDivElement(count: number, characterBounds: any, queryLength: number, className: string, index: number, pageIndex: number, initial: number, divCount: number): number {
        let height: number = 0;
        let width: number = 0;
        let top: number = 0;
        let left: number = 0;
        if (characterBounds[count]) {
            left = characterBounds[count].X;
            top = characterBounds[count].Y;
        }
        let v: number = 0;
        if ((count - initial) !== 0) {
            v = count - initial;
            queryLength += 1;
        }
        for (v = v; v < queryLength; v++) {
            if (characterBounds[count]) {
                // tslint:disable-next-line
                let charBound: any = characterBounds[count];
                if (left > charBound.X) {
                    break;
                }
                top = (top < charBound.Y) ? top : charBound.Y;
                let topDifference: number = (top < charBound.Y) ? (charBound.Y - top) : (top - charBound.Y);
                height = (height > (topDifference + charBound.Height)) ? height : (topDifference + charBound.Height);
                count++;
            }
        }
        let isContinuation: boolean = false;
        if (initial + queryLength !== count) {
            isContinuation = true;
            if (characterBounds[count - 1]) {
                width = (characterBounds[count - 1].X - left);
            }
        } else {
            isContinuation = false;
            if (characterBounds[count]) {
                width = (characterBounds[count].X - left);
            } else {
                if (characterBounds[count - 1]) {
                    width = (characterBounds[count - 1].X - left);
                }
            }
        }
        this.createSearchTextDiv(index, pageIndex, height, width, top, left, className, isContinuation, divCount);
        return count;
    }

    // tslint:disable-next-line
    private createSearchTextDiv(index: number, pageIndex: number, height: number, width: number, top: number, left: number, className: string, isContinuation: boolean, divCount: number): void {
        let idString: string = '_searchtext_' + pageIndex + '_' + index;
        if (isContinuation) {
            idString += '_' + divCount;
        }
        if (!this.pdfViewerBase.getElement(idString)) {
            let textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString });
            textDiv.style.height = height * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                // tslint:disable-next-line:max-line-length
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                let bounds: RectangleBoundsModel  = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            } else if (className === 'e-pv-search-text-highlightother') {
                // tslint:disable-next-line:max-line-length
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchColor === '') ? '#8b4c12' : this.pdfViewer.textSearchColorSettings.searchColor;
            }
            let textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
            if (textLayer) {
                textLayer.appendChild(textDiv);
            }
        }
    }

    private isClassAvailable(): boolean {
        let isClass: boolean = false;
        for (let j: number = 0; j < this.tempElementStorage.length; j++) {
            if (this.tempElementStorage[j].classString) {
                // tslint:disable-next-line:max-line-length
                if (this.tempElementStorage[j].classString === 'e-pv-search-text-highlight' || this.tempElementStorage[j].classString === 'e-pv-search-text-highlightother') {
                    isClass = true;
                    break;
                }
            }
        }
        return isClass;
    }

    private getScrollElement(element: HTMLElement): HTMLElement {
        let targetElement: HTMLElement = element;
        if (element.childNodes.length > 0) {
            for (let i: number = 0; i < element.childNodes.length; i++) {
                if ((element.childNodes[i] as HTMLElement).classList) {
                    if ((element.childNodes[i] as HTMLElement).classList.contains('e-pv-search-text-highlight')) {
                        targetElement = element.childNodes[i] as HTMLElement;
                    }
                }
            }
        }
        return targetElement;
    }

    // tslint:disable-next-line
    private scrollToSearchStr(element: HTMLElement, scrollPoint: any): void {
        let parent: HTMLElement = element.offsetParent as HTMLElement;
        let offsetY: number = element.offsetTop + element.clientTop;
        let offsetX: number = element.offsetLeft + element.clientLeft;
        while (parent.id !== this.pdfViewerBase.viewerContainer.id) {
            offsetY += parent.offsetTop;
            offsetX += parent.offsetLeft;
            parent = parent.offsetParent as HTMLElement;
        }
        if (scrollPoint) {
            offsetY += scrollPoint.y;
            offsetX += scrollPoint.x;
            if (Browser.isDevice) {
                parent.scrollLeft = offsetX;
            } else {
                if (this.pdfViewerBase.getZoomFactor() > 1.5) {
                    parent.scrollLeft = offsetX;
                }
            }
        }
        parent.scrollTop = offsetY;
        this.pdfViewerBase.updateMobileScrollerPosition();
    }

    /**
     * @private
     */
    public resizeSearchElements(pageIndex: number): void {
        let searchDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_' + pageIndex + '"]');
        for (let i: number = 0; i < searchDivs.length; i++) {
            let textDiv: HTMLElement = searchDivs[i] as HTMLElement;
            let previousZoomFactor: number = 1;
            if (this.pdfViewer.magnificationModule) {
                previousZoomFactor = this.pdfViewer.magnificationModule.previousZoomFactor;
            }
            // tslint:disable-next-line:max-line-length
            let outputdata: string = pageIndex + '_' + previousZoomFactor + '_' + this.pdfViewerBase.getZoomFactor();
            if (textDiv.getAttribute('name') !== outputdata) {
                // tslint:disable-next-line
                textDiv.style.width = (parseFloat(textDiv.style.width) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.height = (parseFloat(textDiv.style.height) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.top = (parseFloat(textDiv.style.top) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // tslint:disable-next-line
                textDiv.style.left = (parseFloat(textDiv.style.left) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.setAttribute('name', outputdata);
            }
        }
    }

    /**
     * @private
     */
    public highlightOtherOccurrences(pageNumber: number): void {
        this.initSearch(pageNumber, true);
    }

    private highlightOthers(): void {
        let indexes: { [key: string]: object } = this.getIndexes();
        let lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
        let higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            this.highlightOtherOccurrences(i);
        }
    }

    /**
     * @private
     */
    public clearAllOccurrences(): void {
        let searchTextDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_"]');
        for (let i: number = 0; i < searchTextDivs.length; i++) {
            searchTextDivs[i].parentElement.removeChild(searchTextDivs[i]);
        }
    }

    /**
     * @private
     */
    // tslint:disable-next-line
    public getIndexes(): any {
        let lowerPageValue: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        return { lowerPageValue: lowerPageValue, higherPageValue: higherPageValue };
    }

    private applyTextSelection(): void {
        if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isTextSelectionDisabled) {
            let indexes: { [key: string]: object } = this.getIndexes();
            let lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
            let higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
            for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
                this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
            }
        }
    }

    /**
     * @private
     */
    public resetTextSearch(): void {
        this.resetVariables();
        this.onTextSearchClose();
        this.searchPageIndex = null;
        this.searchIndex = 0;
        this.updateSearchInputIcon(true);
        this.enableNextButton(false);
        this.enablePrevButton(false);
        this.documentTextCollection = [];
        this.isTextRetrieved = false;
        this.isTextSearched = false;
    }

    private onTextSearchClose(): void {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    }

    private createRequestForSearch(pageIndex: number): void {
        let proxy: TextSearch = this;
        let viewPortWidth: number = 816;
        let viewPortHeight: number = this.pdfViewer.element.clientHeight;
        let pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
        let pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
        let tileCount: number = this.pdfViewerBase.getTileCount(pageWidth);
        let noTileX: number = viewPortWidth >= pageWidth ? 1 : tileCount;
        let noTileY: number = viewPortWidth >= pageWidth ? 1 : tileCount;
        let tileSettings: TileRenderingSettingsModel = this.pdfViewer.tileRenderingSettings;
        if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
            noTileX = viewPortWidth >= pageWidth ? 1 : tileSettings.x;
            noTileY = viewPortWidth >= pageWidth ? 1 : tileSettings.y;
        }
        for (let x: number = 0; x < noTileX; x++) {
            for (let y: number = 0; y < noTileY; y++) {
                let jsonObject: object;
                // tslint:disable-next-line:max-line-length
                jsonObject = { xCoordinate: 0, yCoordinate: 0, pageNumber: pageIndex, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, zoomFactor: proxy.pdfViewerBase.getZoomFactor(), tilecount: tileCount, action: 'Search', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId
                , tileXCount: noTileX, tileYCount: noTileY };
                if (this.pdfViewerBase.jsonDocumentId) {
                    // tslint:disable-next-line
                    (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
                }
                this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
                this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages;
                this.searchRequestHandler.responseType = 'json';
                this.searchRequestHandler.send(jsonObject);
                // tslint:disable-next-line
                this.searchRequestHandler.onSuccess = function (result: any) {
                    // tslint:disable-next-line
                    let data: any = result.data;
                    if (data) {
                        if (typeof data !== 'object') {
                            try {
                                data = JSON.parse(data);
                            } catch (error) {
                                proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderPages);
                                data = null;
                            }
                        }
                        if (data) {
                            if (data.pageText && data.uniqueId === proxy.pdfViewerBase.documentId) {
                                let pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                if (viewPortWidth >= pageWidth) {
                                    proxy.pdfViewerBase.storeWinData(data, pageNumber);
                                } else {
                                    proxy.pdfViewerBase.storeWinData(data, pageNumber, data.tileX, data.tileY);
                                }
                                proxy.initSearch(pageIndex, false);
                            }
                        }
                    }
                };
                // tslint:disable-next-line
                this.searchRequestHandler.onFailure = function (result: any) {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
                // tslint:disable-next-line
                this.searchRequestHandler.onError = function (result: any) {
                    proxy.pdfViewerBase.openNotificationPopup();
                    // tslint:disable-next-line:max-line-length
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
            }
        }
    }

    /**
     * @private
     */
    public getPDFDocumentTexts(): void {
        let startIndex: number = 0;
        let endIndex: number = 50;
        let pageCount: number = this.pdfViewerBase.pageCount;
        if (endIndex >= pageCount) {
            endIndex = pageCount;
        }
        this.createRequestForGetPdfTexts(startIndex, endIndex);
    }

    /**
     * @private
     */
    public createRequestForGetPdfTexts(startIndex: number, endIndex: number): void {
        let proxy: TextSearch = this;
        let jsonObject: object;
        // tslint:disable-next-line:max-line-length
        jsonObject = { pageStartIndex: startIndex, pageEndIndex: endIndex, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
        this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
        this.searchRequestHandler.responseType = 'json';
        this.searchRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.searchRequestHandler.onSuccess = function (result: any) {
            // tslint:disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    } catch (error) {
                        proxy.pdfViewerBase.onControlError(500, data, this.pdfViewer.serverActionSettings.renderTexts);
                        data = null;
                    }
                }
                if (data) {
                    if (data.documentTextCollection && data.uniqueId === proxy.pdfViewerBase.documentId) {
                        if (proxy.documentTextCollection.length > 0) {
                            proxy.documentTextCollection = data.documentTextCollection.concat(proxy.documentTextCollection);
                            proxy.documentTextCollection = proxy.orderPdfTextCollections(proxy.documentTextCollection);
                        } else {
                            proxy.documentTextCollection = data.documentTextCollection;
                        }
                        let pageCount: number = proxy.pdfViewerBase.pageCount;
                        if (endIndex !== pageCount) {
                            startIndex = endIndex;
                            endIndex = endIndex + 50;
                            if (endIndex >= pageCount) {
                                endIndex = pageCount;
                            }
                            proxy.createRequestForGetPdfTexts(startIndex, endIndex);
                        } else {
                            proxy.isTextRetrieved = true;
                            proxy.pdfViewer.fireTextExtractionCompleted(proxy.documentTextCollection);
                            if (proxy.isTextSearched && proxy.searchString.length > 0) {
                                proxy.textSearch(proxy.searchString);
                                proxy.isTextSearched = false;
                            }
                        }
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.searchRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        // tslint:disable-next-line
        this.searchRequestHandler.onError = function (result: any) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
    }

    // tslint:disable-next-line
    private orderPdfTextCollections(oldCollection: any): any {
        // tslint:disable-next-line
        let annotationCollectionList: any = [];
        for (let i: number = 0; i < oldCollection.length; i++) {
            if (annotationCollectionList.length === 0) {
                annotationCollectionList.push(oldCollection[i]);
            } else {
                // tslint:disable-next-line
                if (parseInt(Object.keys(oldCollection[i])[0]) > parseInt(Object.keys(annotationCollectionList[annotationCollectionList.length - 1])[0])) {
                    annotationCollectionList.push(oldCollection[i]);
                } else {
                    for (let j: number = 0; j < annotationCollectionList.length; j++) {
                        // tslint:disable-next-line
                        if ((parseInt(Object.keys(oldCollection[i])[0]) < parseInt(Object.keys(annotationCollectionList[j])[0]))) {
                            annotationCollectionList.splice(j, 0, oldCollection[i]);
                            break;
                        }
                    }
                }
            }
        }
        return annotationCollectionList;
    }

    private createSearchBoxButtons(id: string, className: string): HTMLElement {
        // tslint:disable-next-line:max-line-length
        let button: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-search-btn ' + className });
        button.setAttribute('type', 'button');
        // tslint:disable-next-line:max-line-length
        let iconSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_' + id + 'Icon', className: 'e-pv-icon-search ' + className + '-icon' });
        (button as HTMLButtonElement).disabled = true;
        button.appendChild(iconSpan);
        return button;
    }

    private enablePrevButton(isEnable: boolean): void {
        if (!Browser.isDevice) {
            if (isEnable) {
                this.prevSearchBtn.removeAttribute('disabled');
            } else {
                (this.prevSearchBtn as HTMLButtonElement).disabled = true;
            }
        }
    }

    private enableNextButton(isEnable: boolean): void {
        if (!Browser.isDevice) {
            if (isEnable) {
                this.nextSearchBtn.removeAttribute('disabled');
            } else {
                (this.nextSearchBtn as HTMLButtonElement).disabled = true;
            }
        }
    }

    private checkBoxOnChange = (event: ChangeEventArgs): void => {
        if (event.checked) {
            this.isMatchCase = true;
        } else {
            this.isMatchCase = false;
        }
        if (this.isTextSearch) {
            this.resetVariables();
            this.clearAllOccurrences();
            let inputString: string = (this.searchInput as HTMLInputElement).value;
            this.searchIndex = 0;
            this.textSearch(inputString);
        }
    }

    /**
     * @private
     */
    public resetVariables(): void {
        this.searchedPages = [];
        // tslint:disable-next-line
        this.searchMatches = new Array();
    }

    private searchKeypressHandler = (event: KeyboardEvent): void => {
        this.enableNextButton(true);
        this.enablePrevButton(true);
        if (event.which === 13) {
            this.initiateTextSearch(this.searchInput);
            this.updateSearchInputIcon(false);
        } else {
            this.resetVariables();
        }
    }

    private searchClickHandler = (event: Event): void => {
        this.searchButtonClick(this.searchBtn, this.searchInput);
    }

    /**
     * @private
     */
    public searchButtonClick(element: HTMLElement, inputElement: HTMLElement): void {
        if (isBlazor() && Browser.isDevice) {
            let searchElement: HTMLElement = this.pdfViewerBase.getElement('_search_box-icon');
            element = searchElement.children[0].children[0] as HTMLElement;
            inputElement = this.pdfViewerBase.getElement('_search_input');
        }
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch(inputElement);
        } else if (element.classList.contains('e-pv-search-close')) {
            (inputElement as HTMLInputElement).value = '';
            this.resetTextSearch();
            inputElement.focus();
        }
    }

    private updateSearchInputIcon(isEnable: boolean): void {
        if (isBlazor()) {
            if (this.searchBtn && Browser.isDevice) {
                this.searchBtn = this.pdfViewerBase.getElement('_search_box-icon').children[0].children[0] as HTMLElement;
            }
        }
        if (this.searchBtn) {
            if (isEnable) {
                this.searchBtn.classList.remove('e-pv-search-close');
                this.searchBtn.classList.add('e-pv-search-icon');
            } else {
                this.searchBtn.classList.remove('e-pv-search-icon');
                this.searchBtn.classList.add('e-pv-search-close');
            }
        }
    }

    private nextButtonOnClick = (event: Event): void => {
        this.nextSearch();
    }

    private prevButtonOnClick = (event: Event): void => {
        this.prevSearch();
    }

    private onMessageBoxOpen(): void {
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
        if (!Browser.isDevice) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
        } else {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No Text Found'));
        }
    }

    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
     * @returns void
     */
    public searchText(searchText: string, isMatchCase: boolean): void {
        this.searchString = searchText;
        this.isMatchCase = isMatchCase;
        this.searchIndex = 0;
        this.textSearch(searchText);
    }

    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer. 
     * @returns void
     */
    public searchNext(): void {
        this.nextSearch();
    }

    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer. 
     * @returns void
     */
    public searchPrevious(): void {
        this.prevSearch();
    }

    /**
     * Cancels the text search of the PdfViewer. 
     * @returns void
     */
    public cancelTextSearch(): void {
        this.resetTextSearch();
    }

    /**
     * @private
     */
    public destroy(): void {
        this.searchMatches = undefined;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'TextSearch';
    }
}