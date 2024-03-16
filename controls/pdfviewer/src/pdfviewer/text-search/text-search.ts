/* eslint-disable */
import { createElement, Browser, isNullOrUndefined, isBlazor, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { PdfViewer, PdfViewerBase, AjaxHandler, TileRenderingSettingsModel } from '../index';
import { DocumentTextCollectionSettingsModel, RectangleBoundsModel } from '../pdfviewer-model';
import { createSpinner, showSpinner, hideSpinner } from '../index';
let searchTextCollection: any = [];

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
    private searchIndex: number = 0;
    private currentSearchIndex: number = 0;
    private startIndex: number = null;
    private searchPageIndex: number = null;
    private searchString: string = null;
    private isMatchCase: boolean = false;
    private searchRequestHandler: AjaxHandler = null;
    // eslint-disable-next-line
    private textContents: Array<string[]> = new Array();
    // eslint-disable-next-line
    private searchMatches: Array<any[]> = new Array();
    // eslint-disable-next-line
    private searchCollection: Array<{ [key: string]: object }[]> = new Array();
    private searchedPages: number[] = [];
    private isPrevSearch: boolean = false;
    /**
     * @private
     */
    public searchTextDivzIndex: string = "-1";
    // eslint-disable-next-line
    private tempElementStorage: Array<{ [key: string]: string }> = new Array();
    /**
     * @private
     */
    public isMessagePopupOpened: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public documentTextCollection: DocumentTextCollectionSettingsModel[][];
    /**
     * @private
     */
    public isTextRetrieved: boolean = false;
    private isTextSearched: boolean = false;
    private isTextSearchEventTriggered: boolean = false;
    private isSearchText: boolean = false;
    /**
     * @param pdfViewer
     * @param pdfViewerBase
     * @param pdfViewer
     * @param pdfViewerBase
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
        // eslint-disable-next-line max-len
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-search-bar' });
        let toolbarElement: HTMLElement;
        if (isBlazor()) {
            toolbarElement = document.getElementById('toolbarContainer');
        } else {
            toolbarElement = this.pdfViewerBase.getElement('_toolbarContainer');
        }
        if (toolbarElement) {
            if (isBlazor()) {
                this.searchBox.style.top = toolbarElement.clientHeight + 'px';
            } else {
               this.searchBox.style.top = toolbarElement.clientHeight + 'px';
            }
        }
        const searchElementsContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-search-bar-elements' });
        // eslint-disable-next-line max-len
        const searchInputContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-search-input' });
        this.searchInput = createElement('input', { id: this.pdfViewer.element.id + '_search_input', className: 'e-input' });
        (this.searchInput as HTMLInputElement).type = 'text';
        if (isBlazor()) {
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Findindocument');
            promise.then((value: string) => {
                (this.searchInput as HTMLInputElement).placeholder  = value;
            });
        } else {
            (this.searchInput as HTMLInputElement).placeholder = this.pdfViewer.localeObj.getConstant('Find in document');
        }
        // eslint-disable-next-line max-len
        this.searchBtn = createElement('span', { id: this.pdfViewer.element.id + '_search_box-icon', className: 'e-input-group-icon e-input-search-group-icon e-pv-search-icon' });
        this.searchBtn.setAttribute('tabindex', '0');
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
        // eslint-disable-next-line max-len
        const matchCaseContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-match-case-container' });
        const matchCaseInput: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
        (matchCaseInput as HTMLInputElement).type = 'checkbox';
        if (isBlazor()) {
            matchCaseInput.style.height = '17px';
            matchCaseInput.style.width = '17px';
            matchCaseInput.addEventListener('change', this.checkBoxOnChange.bind(this));
        }
        matchCaseContainer.appendChild(matchCaseInput);
        this.searchBox.appendChild(searchElementsContainer);
        this.searchBox.appendChild(matchCaseContainer);
        this.pdfViewerBase.mainContainer.appendChild(this.searchBox);
        if (isBlazor()) {
            // eslint-disable-next-line max-len
            const matchCaseText: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_search_box_text', styles: 'position: absolute; padding-top: 3px; padding-left: 8px; padding-right: 8px; font-size: 13px' });
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Matchcase');
            promise.then((value: string) => {
                matchCaseText.textContent = value;
            });
            matchCaseContainer.appendChild(matchCaseText);
        } else {
            // eslint-disable-next-line max-len
            const checkBox: CheckBox = new CheckBox({ cssClass: 'e-pv-match-case', label: this.pdfViewer.localeObj.getConstant('Match case'),htmlAttributes:{'tabindex': '0'}, change: this.checkBoxOnChange.bind(this) });
            checkBox.appendTo(matchCaseInput);
        }
        matchCaseContainer.firstElementChild.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                (event.target as any).click();
                event.preventDefault();
                event.stopPropagation();
            }
        });
        const waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_textSearchLoadingIndicator' });
        searchInputContainer.appendChild(waitingPopup);
        waitingPopup.style.position = 'absolute';
        waitingPopup.style.top = '15px';
        waitingPopup.style.left = searchInputContainer.clientWidth - 46 + 'px';
        createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(waitingPopup);
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
        this.searchBtn.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                this.searchClickHandler(event);
                event.preventDefault();
                event.stopPropagation();
            }
        });
        this.nextSearchBtn.addEventListener('click', this.nextButtonOnClick.bind(this));
        this.prevSearchBtn.addEventListener('click', this.prevButtonOnClick.bind(this));
    }

    private setLoaderProperties(element: HTMLElement): void {
        const spinnerElement: HTMLElement = (element.firstChild.firstChild.firstChild as HTMLElement);
        if (spinnerElement) {
            spinnerElement.style.height = '18px';
            spinnerElement.style.width = '18px';
            spinnerElement.style.transformOrigin = '9px 9px 9px';
        }
    }

    private showLoadingIndicator(isShow: boolean): void {
        const waitingPopup: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_textSearchLoadingIndicator');
        if (waitingPopup) {
            if (isShow) {
                showSpinner(waitingPopup);
            } else {
                hideSpinner(waitingPopup);
            }
        }
    }

    /**
     * @private
     */
    public textSearchBoxOnResize(): void {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
            const secondaryToolbar: HTMLElement = this.pdfViewerBase.getElement('_toolbarContainer_popup');
            if (secondaryToolbar) {
                if (secondaryToolbar.contains(this.pdfViewerBase.getElement('_search').parentElement)) {
                    this.searchBox.style.right = '0px';
                }
            }
        } else {
            // eslint-disable-next-line max-len
            if (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft < this.searchBox.offsetLeft + this.searchBox.clientWidth) {
                this.searchBox.style.right = '0px';
                // eslint-disable-next-line
                this.searchBox.style.width = parseInt(this.searchBox.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
                // eslint-disable-next-line
                this.searchInput.style.width = parseInt(this.searchInput.style.width) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
            } else {
                this.searchBox.style.right = '88.3px';
                this.searchBox.style.width = '';
                this.searchInput.style.width = '';
            }
        }
    }

    /**
     * @param isShow
     * @private
     */
    public showSearchBox(isShow: boolean): void {
        if(!isNullOrUndefined(this.searchBox)){
            if (isShow) {
                this.searchBox.style.display = 'block';
            } else {
                this.searchBox.style.display = 'none';
                (this.searchInput as HTMLInputElement).value = '';
            }
            this.onTextSearchClose();
        }
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
        if (this.pdfViewer.enableHtmlSanitizer && typeof inputString === 'string') {
            inputString = SanitizeHtmlHelper.sanitize(inputString);
        }
        if (inputString && inputString.length > 0 && inputString[inputString.length - 1] === ' ') {
            inputString = inputString.slice(0, inputString.length - 1);
        }
        this.initiateSearch(inputString);
    }

    /**
     * @param inputString
     * @private
     */
    public initiateSearch(inputString: string): void {
        if (inputString !== this.searchString) {
            this.isTextSearch = false;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
        }
        this.clearAllOccurrences();
        if (inputString !== '') {
            // eslint-disable-next-line
            if (this.searchMatches[this.searchPageIndex] && inputString === this.searchString) {
                if (this.searchMatches[this.searchPageIndex].length === 0) {
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    this.nextSearch();
                }
            }
            else if (isNullOrUndefined(this.searchMatches[this.searchPageIndex]) && inputString === this.searchString) {
                this.initSearch(this.searchPageIndex, false);
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
            this.isSearchText = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.searchCount = 0;
            this.isTextSearchEventTriggered = false;
            this.showLoadingIndicator(true);
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
        this.isSearchText = false;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex + 1;
            if (this.searchMatches[this.searchPageIndex]) {
                if (this.searchIndex >= this.searchMatches[this.searchPageIndex].length) {
                    this.searchIndex = 0;
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                    if (this.pdfViewerBase.pageCount > 1) {
                        this.initSearch(this.searchPageIndex, false);
                    } else {
                        this.initSearch(this.searchPageIndex, true);
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                    }
                    this.showLoadingIndicator(true);
                } else {
                    this.highlightSearchedTexts(this.searchPageIndex, false, undefined);
                    this.showLoadingIndicator(false);
                }
                this.highlightOthers(true);
            } else if (!this.searchMatches[this.searchPageIndex]) {
                if (this.pdfViewerBase.pageCount > 1) {
                    this.initSearch(this.searchPageIndex, false);
                }
            } else {
                this.initiateTextSearch(this.searchInput);
            }
        } else {
            this.initiateTextSearch(this.searchInput);
        }
    }

    private prevSearch(): void {
        searchTextCollection.push(this.searchPageIndex);
        this.isPrevSearch = true;
        this.isTextSearch = true;
        this.isSearchText = false;
        if (this.searchString) {
            this.clearAllOccurrences();
            this.searchIndex = this.searchIndex - 1;
            if (this.searchIndex < 0) {
                this.searchPageIndex = this.findPreviousPageWithText();
                this.initSearch(this.searchPageIndex, false);
                this.showLoadingIndicator(true);
            } else {
                this.highlightSearchedTexts(this.searchPageIndex, false,undefined);
                this.showLoadingIndicator(false);
            }
            this.highlightOthers(true);
        } else {
            this.searchIndex = this.searchIndex - 1;
            this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
            const inputString: string = (this.searchInput as HTMLInputElement).value;
            this.textSearch(inputString);
        }
    }

    private findPreviousPageWithText() {
        let currentPageIndex: any = this.searchPageIndex;
        for (var i = 1; i < this.pdfViewerBase.pageCount; i++) {
            let prevPageIndex: any = (currentPageIndex - i + this.pdfViewerBase.pageCount) % this.pdfViewerBase.pageCount;
            if (this.searchMatches[prevPageIndex] && this.searchMatches[prevPageIndex].length > 0) {
                return prevPageIndex;
            }
        }
        return currentPageIndex;
    };

    private initSearch(pageIndex: number, isSinglePageSearch: boolean, isCount?: boolean ): void {
        // eslint-disable-next-line
        let storedData: any = this.pdfViewerBase.getStoredData(pageIndex, true);
        let pageText: string = null;
        let textContents: string[] = null;
        // eslint-disable-next-line
        let characterBounds: any[] = null;
        if (isCount) {
            if (this.documentTextCollection.length !== 0) {
                // eslint-disable-next-line
                let documentIndex: any = this.documentTextCollection[pageIndex][pageIndex];
                const pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                if (this.documentTextCollection[pageIndex] && documentIndex) {
                    // eslint-disable-next-line max-len
                    this.getSearchTextContent(pageIndex, this.searchString, pageTextData, textContents, isSinglePageSearch, this.documentTextCollection[pageIndex]);
                }
            }
        } else {
            if (storedData) {
            // eslint-disable-next-line
            pageText = storedData['pageText'];
                // eslint-disable-next-line
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
        if (this.pdfViewerBase.pageCount === (this.searchedPages && this.searchedPages.length)) {
            if (!this.isTextSearchEventTriggered) {
                this.isTextSearchEventTriggered = true;
                this.pdfViewer.fireTextSearchComplete(this.searchString, this.isMatchCase);
            }
        }
    }

    // eslint-disable-next-line
    private getPossibleMatches(pageIndex: number, searchString: string, pageString: string, textContents: string[], isSinglePageSearch: boolean, characterBounds: any[]): void {
        let arrayReturns:any;
        if (this.searchMatches && !this.searchMatches[pageIndex]) {
            let pageText: string = pageString;
            let searchText: string = searchString;
            let multiSearch:string =(pageText.replace((/(\s\r\n)/gm),' ')).replace((/(\r\n)/gm)," ")
            let Multiline:string =(pageString.replace((/(\s\r\n)/gm),'  ')).replace((/(\r\n)/gm)," ")
            let specialCharcterSearch =multiSearch.replace(/[^a-zA-z0-9" "]/g,"");
            const queryLength: number = searchString.length;
            if (!this.isMatchCase) {
                searchText = searchString.toLowerCase();
                pageText = pageString.toLowerCase();
                multiSearch =multiSearch.toLowerCase();
                Multiline =Multiline.toLowerCase();
                specialCharcterSearch =specialCharcterSearch.toLowerCase();
            }
            const matches: any[] = [];
            let matchedArray:number[]=[];
            let matchIndex: number = -queryLength;
            let newIndex: number = -queryLength;
            let multiSearchIndex:number =-queryLength;
            let MultilineIndex =-queryLength;
            let specialcharcterIndex =-queryLength;
            while (matchIndex !== 0 || matchIndex === 0) {
                if (searchText === '' || searchText === ' ' || !searchText) {
                    break;
                }
                matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
                if (searchText.indexOf(' ') !== -1) {
                    const newString: string = searchString.replace(' ', '\r\n');
                    newIndex = pageText.indexOf(newString, newIndex + queryLength);
                    newIndex =-1;
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
            if(matches.length ==0){
                multiSearchIndex = multiSearch.indexOf(searchText, multiSearchIndex + queryLength);
                MultilineIndex =Multiline.indexOf(searchText,MultilineIndex+queryLength)
                specialcharcterIndex =specialCharcterSearch.indexOf(searchText,specialcharcterIndex+queryLength)
                if(multiSearchIndex !==-1){
                   arrayReturns =this.correctLinetext(searchString,matchIndex,pageText)
                    matchIndex =-arrayReturns[0].length;
                    
                    for(var i=0;i<arrayReturns.length;i++){
                        matchIndex=pageText.indexOf(arrayReturns[i].trim(),matchIndex+(arrayReturns[i-1]===undefined||null?arrayReturns[0].length:arrayReturns[i-1].length)) 
                        matchedArray.push(matchIndex);
                        if(matchedArray.length>1 ){
                            if((matchedArray[1]-(matchedArray[0]+arrayReturns[0].length))<=3){
                                matches.push(matchedArray);
                                this.searchMatches[pageIndex] = matches;
                            }
                            else{
                                i =-1;
                                matchIndex =matchedArray[0]+arrayReturns[0].length;
                                matchedArray.splice(0,matchedArray.length);
                               
                            }
                        }
                    }
                }
                else if(specialcharcterIndex !==-1){
                    arrayReturns =this.correctLinetext(searchString,matchIndex,pageText)
                    matchIndex =-arrayReturns[0].length;
                    
                    for(var i=0;i<arrayReturns.length;i++){
                        matchIndex=pageText.indexOf(arrayReturns[i].trim(),matchIndex+(arrayReturns[i-1]===undefined||null?arrayReturns[0].length:arrayReturns[i-1].length)) 
                        matchedArray.push(matchIndex);
                        if(matchedArray.length>1 ){
                            if((matchedArray[1]-(matchedArray[0]+arrayReturns[0].length))<=3){
                                matches.push(matchedArray);
                                this.searchMatches[pageIndex] = matches;
                            }
                            else{
                                i =-1;
                                matchIndex =matchedArray[0]+arrayReturns[0].length;
                                matchedArray.splice(0,matchedArray.length);
                               
                            }
                        }
                    }
                }
                else if(MultilineIndex !==-1){
                   arrayReturns =this.correctLinetext(searchString,matchIndex,pageText)
                    matchIndex =-arrayReturns[0].length;
                    
                    for(var i=0;i<arrayReturns.length;i++){
                        matchIndex=pageText.indexOf(arrayReturns[i].trim(),matchIndex+(arrayReturns[i-1]===undefined||null?arrayReturns[0].length:arrayReturns[i-1].length)) 
                        matchedArray.push(matchIndex);
                        if(matchedArray.length>1){
                            if((matchedArray[1]-(matchedArray[0]+arrayReturns[0].length))<=3){
                                matches.push(matchedArray);
                                this.searchMatches[pageIndex] = matches;
                            }else{
                                i =-1;
                                matchIndex =matchedArray[0]+arrayReturns[0].length;
                                matchedArray.splice(0,matchedArray.length);
                                
                            }
                        }
                        
                    }
                   
                }
                if(matches.length>1){
                    matches.splice(1,matches.length);
                }
            }
            if (this.searchMatches && matches.length > 0) {
                this.searchMatches[pageIndex] = matches;
            }
        }
        if (!isSinglePageSearch) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                this.searchedPages.push(pageIndex);
                this.startIndex = this.searchedPages[0];
            }
            this.updateSearchInputIcon(false);
        }
        if (this.searchMatches && this.searchMatches[pageIndex] && this.searchMatches[pageIndex].length !== 0) {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchIndex = this.searchMatches[pageIndex].length - 1;
                }
                if ((this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
                    // eslint-disable-next-line max-len
                    if (this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (this.searchPageIndex) === this.currentSearchIndex) {
                        if (!this.isMessagePopupOpened && !this.isSearchText) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                        this.searchedPages = [this.searchPageIndex];
                    }
                    // eslint-disable-next-line max-len
                    else if (this.isPrevSearch && this.searchMatches && this.searchMatches.length > 0 && (this.searchMatches[this.searchPageIndex] && this.searchMatches[this.searchPageIndex].length > 0) && this.searchedPages.length === this.pdfViewerBase.pageCount && this.startIndex - 1 === this.searchPageIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchedPages = [this.startIndex];
                    }
                    else if (searchTextCollection[0] == this.searchPageIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                    }
                    this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                }
                else if (this.searchMatches && (this.searchMatches[this.searchPageIndex] && this.searchMatches[this.searchPageIndex].length > 0) && this.searchedPages.length === this.pdfViewerBase.pageCount && this.startIndex === this.searchPageIndex && this.pdfViewerBase.pageCount > 1) {
                    if (!this.isMessagePopupOpened) {
                        this.onMessageBoxOpen();
                    }
                    this.searchedPages = [this.startIndex];
                }
            }
            this.highlightSearchedTexts(pageIndex, isSinglePageSearch,arrayReturns);
        } else {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                } else {
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                }
                if (this.searchedPages.indexOf(this.searchPageIndex) === -1 && this.searchedPages.length !== this.pdfViewerBase.pageCount) {
                    this.showLoadingIndicator(true);
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    const searchPageIndex: number = this.getSearchPage(pageIndex);
                    // eslint-disable-next-line max-len
                    if (this.searchMatches && isNullOrUndefined(this.searchMatches[this.searchPageIndex]) && this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        // eslint-disable-next-line max-len
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.pdfViewerBase.updateScrollTop(this.startIndex);
                        // eslint-disable-next-line max-len
                    } else if (this.searchMatches && this.searchMatches.length > 0 && (this.searchIndex === 0 || this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
                            // eslint-disable-next-line max-len
                            if (!this.isMessagePopupOpened) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [searchPageIndex];
                            this.searchIndex = -1;
                        } else {
                            if (!this.isMessagePopupOpened && this.pdfViewerBase.currentPageNumber !== 0 && !this.isSearchText) {
                                this.onMessageBoxOpen();
                            }
                            this.searchPageIndex = searchPageIndex;
                            this.searchedPages = [searchPageIndex];
                            this.searchIndex = 0;
                        }
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch,undefined);
                    } else if (this.searchMatches && (this.searchMatches[this.searchPageIndex] && this.searchMatches[this.searchPageIndex].length > 0) && this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.startIndex;
                        this.searchedPages = [this.searchPageIndex];
                        this.searchIndex = 0;
                        this.pdfViewerBase.updateScrollTop(this.startIndex);
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch,undefined);
                    }
                }
            }
        }
    }

    private correctLinetext (searchString:string,matchIndex:number,pageText:string) 
    {
        let indiuvalLineArray:string[] = [];
        let searchArray:string[] = searchString.split(/[" "]+/);
        if (!this.isMatchCase) {
            searchArray = searchString.toLowerCase().split(/[" "]+/);
        }
        matchIndex = 0;
        let linestring:string = "";
        let mergedText: string = pageText.replace(/ \r\n/g, " ");
        mergedText = mergedText.replace(/\r\n/g, " ");
        mergedText = mergedText.replace(/[^a-zA-Z0-9 ]/g, '');
        searchString = searchString.replace(/[^a-zA-Z0-9 ]/g, '');
        let result:any = mergedText.match(searchString);
        if (!this.isMatchCase) {
            result = mergedText.match(searchString.toLowerCase());
        }
        if (isNullOrUndefined(result)) {
            return indiuvalLineArray;
        } else {
            result = pageText.slice(result.index, pageText.length);
        }
        let pageCheck= result;
        for (var i = 0; i < searchArray.length; i++) {
            let searchArrayText = linestring + searchArray[i];
            matchIndex = pageText.indexOf(searchArrayText, matchIndex);
            pageCheck =pageCheck?pageCheck.replace(searchArray[i-1] ,""): pageText.replace(searchArray[i-1] ,"");
            if((pageCheck[pageCheck.indexOf(searchArray[i])-1] === "\n" && (pageCheck[pageCheck.indexOf(searchArray[i+1])-1]) === "\n")|| (pageCheck[pageCheck.indexOf(searchArray[i])-1] === "\n" && isNullOrUndefined((pageCheck[pageCheck.indexOf(searchArray[i+1])-1])))){
                matchIndex =-1;
                if(linestring===""){
                    linestring = searchArray[i];
                    i=i+1;
                }
            }
            if (matchIndex !== -1) {
                linestring += searchArray[i] + " ";
                if (i == (searchArray.length - 1)) {
                    indiuvalLineArray.push(linestring);
                }
            }
            else {
                indiuvalLineArray.push(linestring);
                linestring = searchArray[i] + " ";
                if(pageCheck[pageCheck.indexOf(searchArray[i])-1] == "\n" && pageCheck[pageCheck.indexOf(searchArray[i+1])-1] == "\n"){
                    indiuvalLineArray.push(linestring);
                    linestring = searchArray[i+1] + " ";
                    pageCheck =pageCheck?pageCheck.replace(searchArray[i-1] ,""): pageText.replace(searchArray[i-1] ,"");
                    i =i+1;
                }
                if (i == (searchArray.length - 1)) {
                    indiuvalLineArray.push(linestring);
                }
            }
        }
       return indiuvalLineArray;
    }

    // eslint-disable-next-line
    private getSearchTextContent(pageIndex: number, searchString: string, pageString: string, textContents: string[], isSinglePageSearch: boolean, characterBounds: any[]): void {
        let pageText: string = pageString;
        let searchText: string = searchString;
        const queryLength: number = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
        }
        const matches: number[] = [];
        let matchIndex: number = -queryLength;
        let newIndex: number = -queryLength;
        while (matchIndex !== 0) {
            if (searchText === '' || searchText === ' ' || !searchText) {
                break;
            }
            matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
            if (searchText.indexOf(' ') !== -1) {
                const newString: string = searchString.replace(' ', '\r\n');
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

    private highlightSearchedTexts(pageIndex: number, isSinglePageSearch: boolean,ArrayReturns:any): void {
        // eslint-disable-next-line
        let matches: any[] = this.searchMatches[pageIndex];
        const prevEnd: { [key: string]: object } = null;
        // eslint-disable-next-line
        let scrollPoint: any = { y: -100, x: -100 };
        let startId: number;
        let className: string;
        let searchingText =this.searchString;
        // eslint-disable-next-line
        let characterBounds: any[] = this.pdfViewerBase.textLayer.characterBound[pageIndex];
        let isHighlight: boolean = false;
        if (isSinglePageSearch && (this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
            if (this.searchMatches.length > 0) {
                if (pageIndex === this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1)) {
                    isHighlight = true;
                }
            }
        }
        if (characterBounds && matches !== undefined) {
            for (let i: number = 0; i < matches.length; i++) {
                if(matches[i].length !==undefined && ArrayReturns !==undefined){
                    if(i === this.searchIndex && pageIndex === this.searchPageIndex){
                        for(var j =0;j<ArrayReturns.length;j++){
                            className = 'e-pv-search-text-highlight';
                            this.searchString=ArrayReturns[j].trim();
                            this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className,j);
                        }  
                    }else{
                        for(var j =0;j<ArrayReturns.length;j++){
                            className = 'e-pv-search-text-highlightother';
                            this.searchString=ArrayReturns[j].trim();
                            this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className,j);
                        } 
                    }

                }
               else if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                    className = 'e-pv-search-text-highlight';
                } else {
                    className = 'e-pv-search-text-highlightother';
                }
                if(matches[i].length ==undefined){
                    this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className,undefined);
                }
            }
            this.searchString=searchingText;
            if (pageIndex === this.searchPageIndex && !isSinglePageSearch) {
                const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                if (element) {
                    const targetScrollElement: HTMLElement = this.getScrollElement(element);
                    this.scrollToSearchStr(targetScrollElement, scrollPoint);
                } else {
                    this.pdfViewerBase.updateScrollTop(pageIndex);
                    const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                    if (element) {
                        const targetScrollElement: HTMLElement = this.getScrollElement(element);
                        this.scrollToSearchStr(targetScrollElement, scrollPoint);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line
    private addDivForSearch(index: number, pageIndex: number, characterBounds: any, queryLength: number, className: string,nestedIndex:any): void {
        const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
        if (isNullOrUndefined(textLayer) && className === 'e-pv-search-text-highlight') {
            if (this.pdfViewer.navigation) {
                this.pdfViewer.navigation.goToPage(pageIndex + 1);
            }
        }
        let count: number;
        if(this.searchMatches[pageIndex][index].length !==undefined){
            count =this.searchMatches[pageIndex][index][nestedIndex]
       }else{
            count = this.searchMatches[pageIndex][index];
       }
        const initial: number = count;
        let divCount: number = 0;
        while (count < initial + queryLength) {
            count = this.addDivElement(count, characterBounds, queryLength, className, index, pageIndex, initial, divCount,nestedIndex);
            divCount++;
        }
        if (className === 'e-pv-search-text-highlight') {
            this.showLoadingIndicator(false);
        }
    }

    // eslint-disable-next-line
    private addDivElement(count: number, characterBounds: any, queryLength: number, className: string, index: number, pageIndex: number, initial: number, divCount: number,nestedIndex:any): number {
        let height: number = 0;
        let width: number = 0;
        let top: number = 0;
        let left: number = 0;
        let isRTL: boolean = false;
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
                // eslint-disable-next-line
                let charBound: any = characterBounds[count];
                if (left > charBound.X + charBound.Width) {
                    isRTL = true;
                }
                top = (top < charBound.Y) ? top : charBound.Y;
                const topDifference: number = (top < charBound.Y) ? (charBound.Y - top) : (top - charBound.Y);
                height = (height > (topDifference + charBound.Height)) ? height : (topDifference + charBound.Height);
                count++;
            }
        }
        let isContinuation: boolean = false;
        if (!isRTL) {
            if (initial + queryLength !== count) {
                isContinuation = true;
                if (characterBounds[count - 1]) {
                    width = (characterBounds[count - 1].X - left);
                }
            } else {
                isContinuation = false;
                // eslint-disable-next-line
                let storedData: any = this.pdfViewerBase.clientSideRendering? this.pdfViewerBase.getLinkInformation(pageIndex, true) : this.pdfViewerBase.getStoredData(pageIndex, true);
                let pageText: string = null;
                if (storedData) {
                    pageText = storedData['pageText'];
                } else if (this.pdfViewer.isExtractText && this.documentTextCollection.length !== 0) {
                    // eslint-disable-next-line
                    let documentIndex: any = this.documentTextCollection[pageIndex][pageIndex];
                    pageText = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                }
                if (characterBounds[count]) {
                    if (pageText && (pageText[count] === '' || pageText[count] === ' ' || pageText[count] === '\r' || pageText[count] === '\n') && (characterBounds[count].Width) === 0) {
                        width = (characterBounds[count - 1].X - left) + characterBounds[count - 1].Width;
                    } else {
                        width = (characterBounds[count].X - left);
                    }
                } else {
                    if (characterBounds[count - 1]) {
                        width = (characterBounds[count - 1].X - left) + characterBounds[count - 1].Width;
                    }
                }
            }
        } else {
            let charBound: any = characterBounds[(initial + queryLength) - 1];
            left = charBound.X;
            width = characterBounds[initial].X - characterBounds[(initial + queryLength) - 1].X;
            top = (top < charBound.Y) ? top : charBound.Y;
            const topDifference: number = (top < charBound.Y) ? (charBound.Y - top) : (top - charBound.Y);
            height = (height > (topDifference + charBound.Height)) ? height : (topDifference + charBound.Height);
            //some RTL character calculated width is zero and width difference value calculated from Y possition difference in the same line.
            let widthDifference: number = characterBounds[initial - 1].Y - characterBounds[initial].Y
            for (let j = (initial + queryLength) - 1; j >= initial; j--) {
                charBound = characterBounds[j];
                if (charBound.Width === 0) {
                    widthDifference = charBound.Y - characterBounds[j - 1].Y;
                }
            }
            width = width + widthDifference;
        }
        this.createSearchTextDiv(index, pageIndex, height, width, top, left, className, isContinuation, divCount,nestedIndex);
        return count;
    }

    // eslint-disable-next-line
    private createSearchTextDiv(index: number, pageIndex: number, height: number, width: number, top: number, left: number, className: string, isContinuation: boolean, divCount: number,nestedIndex:any): void {
        let idString: string = '_searchtext_' + pageIndex + '_' + index;
        if (isContinuation) {
            idString += '_' + divCount;
        }
        if(nestedIndex !==undefined && this.pdfViewerBase.getElement(idString)){
            const textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString+"_"+nestedIndex });
            // eslint-disable-next-line
            let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
            this.calculateBounds(textDiv, height, width, top, left, pageDetails)
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                // eslint-disable-next-line max-len
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                const bounds: RectangleBoundsModel  = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            } else if (className === 'e-pv-search-text-highlightother') {
                // eslint-disable-next-line max-len
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchColor === '') ? '#8b4c12' : this.pdfViewer.textSearchColorSettings.searchColor;
            }
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
            textDiv.style.zIndex = this.searchTextDivzIndex;
            if (textLayer) {
                textLayer.appendChild(textDiv);
            }
        }
        if (!this.pdfViewerBase.getElement(idString)) {
            const textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString });
            // eslint-disable-next-line
            let pageDetails: any = this.pdfViewerBase.pageSize[pageIndex];
            this.calculateBounds(textDiv, height, width, top, left, pageDetails)
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                // eslint-disable-next-line max-len
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                const bounds: RectangleBoundsModel  = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            } else if (className === 'e-pv-search-text-highlightother') {
                // eslint-disable-next-line max-len
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchColor === '') ? '#8b4c12' : this.pdfViewer.textSearchColorSettings.searchColor;
            }
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
            textDiv.style.zIndex = this.searchTextDivzIndex;
            if (textLayer) {
                textLayer.appendChild(textDiv);
            }
        }
    }

    // eslint-disable-next-line
    private calculateBounds(textDiv: HTMLElement, height: number, width: number, top: number, left: number, pageDetails: any): void {
        if (pageDetails.rotation === 0 || pageDetails.rotation === 2) {
            textDiv.style.height = Math.ceil(height) * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
            if (pageDetails.rotation === 2) {
               textDiv.style.top = (pageDetails.height - top - height) * this.pdfViewerBase.getZoomFactor() + 'px';
               textDiv.style.left = Math.ceil(pageDetails.width - left - width) * this.pdfViewerBase.getZoomFactor() + 'px';
            }
            else {
               textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
               textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
            }
        } else if (pageDetails.rotation === 1) {
            textDiv.style.height = width * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.width = height * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.top = left * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.left = (pageDetails.height - top - height) * this.pdfViewerBase.getZoomFactor() + 'px';
        }
        else if (pageDetails.rotation === 3) {
            textDiv.style.height = width * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.width = height * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.left = ((pageDetails.width - pageDetails.height) + top) * this.pdfViewerBase.getZoomFactor() + 'px';
            textDiv.style.top = (pageDetails.height - left - width) * this.pdfViewerBase.getZoomFactor() + 'px';
        }
    }

    private isClassAvailable(): boolean {
        let isClass: boolean = false;
        for (let j: number = 0; j < this.tempElementStorage.length; j++) {
            if (this.tempElementStorage[j].classString) {
                // eslint-disable-next-line max-len
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

    // eslint-disable-next-line
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
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
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
     * @param pageIndex
     * @private
     */
    public resizeSearchElements(pageIndex: number): void {
        const searchDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_' + pageIndex + '"]');
        for (let i: number = 0; i < searchDivs.length; i++) {
            const textDiv: HTMLElement = searchDivs[i] as HTMLElement;
            let previousZoomFactor: number = 1;
            if (this.pdfViewer.magnificationModule) {
                previousZoomFactor = this.pdfViewer.magnificationModule.previousZoomFactor;
            }
            // eslint-disable-next-line max-len
            const outputdata: string = pageIndex + '_' + previousZoomFactor + '_' + this.pdfViewerBase.getZoomFactor();
            if (textDiv.getAttribute('name') !== outputdata) {
                // eslint-disable-next-line
                textDiv.style.width = (parseFloat(textDiv.style.width) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // eslint-disable-next-line
                textDiv.style.height = (parseFloat(textDiv.style.height) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // eslint-disable-next-line
                textDiv.style.top = (parseFloat(textDiv.style.top) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                // eslint-disable-next-line
                textDiv.style.left = (parseFloat(textDiv.style.left) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.setAttribute('name', outputdata);
            }
        }
    }

    /**
     * @param pageNumber
     * @private
     */
    public highlightOtherOccurrences(pageNumber: number): void {
        this.initSearch(pageNumber, true);
    }

    private highlightOthers(isSearched?: boolean): void {
        const indexes: { [key: string]: object } = this.getIndexes();
        const lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
        const higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            this.highlightOtherOccurrences(i);
        }
        if (isSearched) {
            this.showLoadingIndicator(false);
        }
    }

    /**
     * @private
     */
    public clearAllOccurrences(): void {
        const searchTextDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_"]');
        for (let i: number = 0; i < searchTextDivs.length; i++) {
            searchTextDivs[i].parentElement.removeChild(searchTextDivs[i]);
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public getIndexes(): any {
        let lowerPageValue: number = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        let higherPageValue: number = this.pdfViewerBase.currentPageNumber + 1;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        return { lowerPageValue: lowerPageValue, higherPageValue: higherPageValue };
    }

    private applyTextSelection(): void {
        if (this.pdfViewer.textSelectionModule && !this.pdfViewerBase.isTextSelectionDisabled) {
            const indexes: { [key: string]: object } = this.getIndexes();
            const lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
            const higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
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
        this.isSearchText = false;
        if (this.searchRequestHandler) {
            this.searchRequestHandler.clear();
        }
    }

    private onTextSearchClose(): void {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    }

    private createRequestForSearch(pageIndex: number): void {
        const proxy: TextSearch = this;
        const viewPortWidth: number = 816;
        const viewPortHeight: number = this.pdfViewer.element.clientHeight;
        const pageWidth: number = this.pdfViewerBase.pageSize[pageIndex].width;
        const pageHeight: number = this.pdfViewerBase.pageSize[pageIndex].height;
        const tileCount: number = this.pdfViewerBase.getTileCount(pageWidth, pageHeight);
        let noTileX: number = viewPortWidth >= pageWidth ? 1 : tileCount;
        let noTileY: number = viewPortWidth >= pageWidth ? 1 : tileCount;
        let isTileRendering: boolean = false;
        const tileSettings: TileRenderingSettingsModel = this.pdfViewer.tileRenderingSettings;
        if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
            noTileX = viewPortWidth >= pageWidth ? 1 : tileSettings.x;
            noTileY = viewPortWidth >= pageWidth ? 1 : tileSettings.y;
        }
        if (noTileX > 1 && noTileY > 1) {
            isTileRendering = true;
        }
        for (let x: number = 0; x < noTileX; x++) {
            for (let y: number = 0; y < noTileY; y++) {
                let jsonObject: object;
                // eslint-disable-next-line max-len
                jsonObject = { xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, zoomFactor: proxy.pdfViewerBase.getZoomFactor(), tilecount: tileCount, action: 'Search', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId
                    , tileXCount: noTileX, tileYCount: noTileY };
                if (this.pdfViewerBase.jsonDocumentId) {
                    // eslint-disable-next-line
                    (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
                }
                const zoomFactor: number = this.pdfViewerBase.retrieveCurrentZoomFactor();
                this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
                this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages;
                this.searchRequestHandler.responseType = 'json';
                if (!this.pdfViewerBase.clientSideRendering) {
                    this.searchRequestHandler.send(jsonObject);
                }
                // eslint-disable-next-line
                this.searchRequestHandler.onSuccess = function (result: any) {
                    // eslint-disable-next-line
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
                            proxy.searchRequestOnSuccess(data, proxy, viewPortWidth,pageWidth, isTileRendering, pageIndex, x, y, noTileX, noTileY )
                        }
                    }
                };
                // eslint-disable-next-line
                this.searchRequestHandler.onFailure = function (result: any) {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
                // eslint-disable-next-line
                this.searchRequestHandler.onError = function (result: any) {
                    proxy.pdfViewerBase.openNotificationPopup();
                    // eslint-disable-next-line max-len
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderPages);
                };
                if (this.pdfViewerBase.clientSideRendering) {
                    let textDetailsId: string = this.pdfViewerBase.documentId + '_' + pageIndex + '_textDetails';
                    let isTextNeed: boolean = this.pdfViewerBase.pageTextDetails ? this.pdfViewerBase.pageTextDetails[textDetailsId] ? false : true : true;
                    if (viewPortWidth >= pageWidth || !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        this.pdfViewerBase.pdfViewerRunner.postMessage({
                            pageIndex: pageIndex,
                            message: 'renderPageSearch',
                            zoomFactor: proxy.pdfViewer.magnificationModule.zoomFactor,
                            isTextNeed: isTextNeed,
                            textDetailsId: textDetailsId
                        });
                    } else {
                        this.pdfViewerBase.pdfViewerRunner.postMessage({
                            pageIndex: pageIndex,
                            message: 'renderImageAsTileSearch',
                            zoomFactor: zoomFactor,
                            tileX: x,
                            tileY: y,
                            tileXCount: noTileX,
                            tileYCount: noTileY,
                            isTextNeed: isTextNeed,
                            textDetailsId: textDetailsId
                        });
                    }
                    this.pdfViewerBase.pdfViewerRunner.onmessage = function (event: any) {
                        switch (event.data.message) {
                            case 'imageRenderedSearch':
                                if (event.data.message === 'imageRenderedSearch') {
                                    let canvas: HTMLCanvasElement = document.createElement('canvas');
                                    let { value, width, height, pageIndex } = event.data;
                                    canvas.width = width;
                                    canvas.height = height;
                                    const canvasContext = canvas.getContext('2d');
                                    const imageData = canvasContext.createImageData(width, height);
                                    imageData.data.set(value);
                                    canvasContext.putImageData(imageData, 0, 0);
                                    let imageUrl: string = canvas.toDataURL();
                                    const textBounds = event.data.textBounds;
                                    const textContent = event.data.textContent;
                                    const pageText = event.data.pageText;
                                    const rotation = event.data.rotation;
                                    const characterBounds = event.data.characterBounds;
                                    let hyperlinksDetails : any= proxy.pdfViewer.pdfRendererModule.getHyperlinks(pageIndex);
                                    let data: any = ({ image: imageUrl, pageNumber: pageIndex, uniqueId: proxy.pdfViewerBase.documentId, pageWidth: width, zoomFactor: event.data.zoomFactor, hyperlinks: hyperlinksDetails.hyperlinks, hyperlinkBounds: hyperlinksDetails.hyperlinkBounds,linkAnnotation:hyperlinksDetails.linkAnnotation , linkPage:hyperlinksDetails.linkPage, annotationLocation: hyperlinksDetails.annotationLocation, characterBounds: characterBounds });
                                    if (event.data.isTextNeed) {
                                        data.textBounds = textBounds;
                                        data.textContent = textContent;
                                        data.rotation = rotation;
                                        data.pageText = pageText;
                                        proxy.pdfViewerBase.storeTextDetails(pageIndex, textBounds, textContent, pageText, rotation, characterBounds);
                                    } else {
                                        let textDetails: any = JSON.parse(proxy.pdfViewerBase.pageTextDetails[`${event.data.textDetailsId}`]);
                                        data.textBounds = textDetails.textBounds;
                                        data.textContent = textDetails.textContent;
                                        data.rotation = textDetails.rotation;
                                        data.pageText = textDetails.pageText;
                                        data.characterBounds = textDetails.characterBounds;
                                    }
                                    if (data && data.image && data.uniqueId === proxy.pdfViewerBase.documentId) {
                                        let currentPageWidth: number = (data.pageWidth && data.pageWidth > 0) ? data.pageWidth : pageWidth;
                                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, data);
                                        const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                        let blobObj: string = proxy.pdfViewerBase.createBlobUrl(data.image.split('base64,')[1], 'image/png');
                                        let Url: any = URL || webkitURL;
                                        const blobUrl: string = Url.createObjectURL(blobObj);
                                        let storeObject: any = {
                                            // eslint-disable-next-line
                                            image: blobUrl, width: data.pageWidth, uniqueId: data.uniqueId, zoomFactor: data.zoomFactor
                                        };
                                        proxy.pdfViewerBase.storeImageData(pageNumber, storeObject);
                                        proxy.searchRequestOnSuccess(data, proxy, viewPortWidth, pageWidth, isTileRendering, pageIndex, x, y, noTileX, noTileY);
                                    }
                                }
                                break;
                            case 'renderTileImageSearch':
                                if (event.data.message === 'renderTileImageSearch') {
                                    let canvas: any = document.createElement('canvas');
                                    let { value, w, h, noTileX, noTileY, x, y, pageIndex } = event.data;
                                    canvas.setAttribute('height', h);
                                    canvas.setAttribute('width', w);
                                    canvas.width = w;
                                    canvas.height = h;
                                    const canvasContext = canvas.getContext('2d');
                                    const imageData = canvasContext.createImageData(w, h);
                                    imageData.data.set(value);
                                    canvasContext.putImageData(imageData, 0, 0);
                                    let imageUrl: string = canvas.toDataURL();
                                    let tileWidth: number = w;
                                    let tileHeight: number = h;
                                    const textBounds = event.data.textBounds;
                                    const textContent = event.data.textContent;
                                    const pageText = event.data.pageText;
                                    const rotation = event.data.rotation;
                                    const characterBounds = event.data.characterBounds;
                                    let tileData: any = {
                                        image: imageUrl,
                                        noTileX: noTileX,
                                        noTileY: noTileY,
                                        pageNumber: pageIndex,
                                        tileX: x,
                                        tileY: y,
                                        uniqueId: proxy.pdfViewerBase.documentId,
                                        pageWidth: pageWidth,
                                        width: tileWidth,
                                        transformationMatrix: {
                                            Values: [1, 0, 0, 1, tileWidth * x, tileHeight * y, 0, 0, 0]
                                        },
                                        zoomFactor: event.data.zoomFactor,
                                        characterBounds: characterBounds,
                                        isTextNeed: event.data.isTextNeed,
                                        textDetailsId: event.data.textDetailsId
                                    };
                                    if (tileData && tileData.image && tileData.uniqueId === proxy.pdfViewerBase.documentId) {
                                        let currentPageWidth: number = (tileData.pageWidth && tileData.pageWidth > 0) ? tileData.pageWidth : pageWidth;
                                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, tileData);
                                        const pageNumber: number = (tileData.pageNumber !== undefined) ? tileData.pageNumber : pageIndex;
                                        if (x == 0 && y == 0) {
                                            let blobObj: string = proxy.pdfViewerBase.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                            let Url: any = URL || webkitURL;
                                            const blobUrl: string = Url.createObjectURL(blobObj);
                                            let storeObject: any = {
                                                // eslint-disable-next-line
                                                image: blobUrl, width: tileData.pageWidth, uniqueId: tileData.uniqueId, tileX: tileData.tileX, tileY: tileData.tileY,
                                                zoomFactor: tileData.zoomFactor
                                            };
                                            if (tileData.isTextNeed) {
                                                tileData.textBounds = textBounds;
                                                tileData.textContent = textContent;
                                                tileData.rotation = rotation;
                                                tileData.pageText = pageText;
                                                proxy.pdfViewerBase.storeTextDetails(pageIndex, textBounds, textContent, pageText, rotation, characterBounds);
                                            } else {
                                                let textDetails: any = JSON.parse(proxy.pdfViewerBase.pageTextDetails[`${tileData.textDetailsId}`]);
                                                tileData.textBounds = textDetails.textBounds;
                                                tileData.textContent = textDetails.textContent;
                                                tileData.rotation = textDetails.rotation;
                                                tileData.pageText = textDetails.pageText;
                                                tileData.characterBounds = textDetails.characterBounds;
                                            }
                                            proxy.pdfViewerBase.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                        }
                                        else {
                                            let blobObj: string = proxy.pdfViewerBase.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                            let Url: any = URL || webkitURL;
                                            const blobUrl: string = Url.createObjectURL(blobObj);
                                            let storeObject: any = {
                                                // eslint-disable-next-line
                                                image: blobUrl, width: tileData.pageWidth, uniqueId: tileData.uniqueId, tileX: tileData.tileX, tileY: tileData.tileY, zoomFactor: tileData.zoomFactor
                                            };
                                            proxy.pdfViewerBase.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                        }
                                        proxy.searchRequestOnSuccess(tileData, proxy, viewPortWidth, pageWidth, isTileRendering, pageIndex, x, y, noTileX, noTileY);
                                    }
                                }
                                break;
                        }
                    };
                }
                
            }
        }
    }
    
    private searchRequestOnSuccess(data: any, proxy: TextSearch, viewPortWidth: number, pageWidth: number, isTileRendering: boolean, pageIndex: number, x: number, y: number, noTileX: number, noTileY: number): void{
        if (!isNullOrUndefined(data.pageText) && data.uniqueId === proxy.pdfViewerBase.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderPages, data);
            const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
            if (viewPortWidth >= pageWidth) {
                proxy.pdfViewerBase.storeWinData(data, pageNumber);
            } else {
                proxy.pdfViewerBase.storeWinData(data, pageNumber, data.tileX, data.tileY);
            }
            if (!isTileRendering) {
                proxy.initSearch(pageIndex, false);
            } else {
                if (x === (noTileX - 1) && y === (noTileY - 1)) {
                    proxy.initSearch(pageIndex, false);
                }
            }
        } else if (isTileRendering && data.uniqueId === proxy.pdfViewerBase.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderPages, data);
            const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
            proxy.pdfViewerBase.storeWinData(data, pageNumber, data.tileX, data.tileY);
            if (x === (noTileX - 1) && y === (noTileY - 1)) {
                proxy.initSearch(pageIndex, false);
            }
        }
    }

    /**
     * @private
     */
    public getPDFDocumentTexts(): void {
        const startIndex: number = 0;
        let endIndex: number = 50;
        const pageCount: number = this.pdfViewerBase.pageCount;
        if (endIndex >= pageCount) {
            endIndex = pageCount;
        }
        this.createRequestForGetPdfTexts(startIndex, endIndex);
    }

    /**
     * @param startIndex
     * @param endIndex
     * @private
     */
    public createRequestForGetPdfTexts(startIndex: number, endIndex: number): void {
        const proxy: TextSearch = this;
        let jsonObject: object;
        // eslint-disable-next-line max-len
        jsonObject = { pageStartIndex: startIndex, pageEndIndex: endIndex, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
        this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
        this.searchRequestHandler.responseType = 'json';
        if(!this.pdfViewerBase.clientSideRendering){
            this.searchRequestHandler.send(jsonObject);
        }
        // eslint-disable-next-line
        this.searchRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
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
                    proxy.pdfTextSearchRequestOnSuccess(data, proxy, startIndex, endIndex);
                }
            }
        };
        // eslint-disable-next-line
        this.searchRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        // eslint-disable-next-line
        this.searchRequestHandler.onError = function (result: any) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        if(this.pdfViewerBase.clientSideRendering){
            this.pdfViewer.pdfRendererModule.getDocumentText(jsonObject).then((data:any)=>{
                proxy.pdfTextSearchRequestOnSuccess(data, proxy, startIndex, endIndex);
            });
        }
    }

    private pdfTextSearchRequestOnSuccess(data: any, proxy: TextSearch, startIndex: number, endIndex: number){
        if (data.documentTextCollection && data.uniqueId === proxy.pdfViewerBase.documentId) {
            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderTexts, data);
            if (proxy.documentTextCollection.length > 0) {
                proxy.documentTextCollection = data.documentTextCollection.concat(proxy.documentTextCollection);
                proxy.documentTextCollection = proxy.orderPdfTextCollections(proxy.documentTextCollection);
            } else {
                proxy.documentTextCollection = data.documentTextCollection;
            }
            const pageCount: number = proxy.pdfViewerBase.pageCount;
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

    // eslint-disable-next-line
    private orderPdfTextCollections(oldCollection: any): any {
        // eslint-disable-next-line
        let annotationCollectionList: any = [];
        for (let i: number = 0; i < oldCollection.length; i++) {
            if (annotationCollectionList.length === 0) {
                annotationCollectionList.push(oldCollection[i]);
            } else {
                // eslint-disable-next-line
                if (parseInt(Object.keys(oldCollection[i])[0]) > parseInt(Object.keys(annotationCollectionList[annotationCollectionList.length - 1])[0])) {
                    annotationCollectionList.push(oldCollection[i]);
                } else {
                    for (let j: number = 0; j < annotationCollectionList.length; j++) {
                        // eslint-disable-next-line
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
        // eslint-disable-next-line max-len
        const button: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-search-btn ' + className });
        button.setAttribute('type', 'button');
        // eslint-disable-next-line max-len
        const iconSpan: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_' + id + 'Icon', className: 'e-pv-icon-search ' + className + '-icon' });
        (button as HTMLButtonElement).disabled = true;
        button.appendChild(iconSpan);
        return button;
    }

    private enablePrevButton(isEnable: boolean): void {
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            if (isEnable) {
                this.prevSearchBtn.removeAttribute('disabled');
            } else {
                if (this.prevSearchBtn as HTMLButtonElement) {
                    (this.prevSearchBtn as HTMLButtonElement).disabled = true;
                }
            }
        }
    }

    private enableNextButton(isEnable: boolean): void {
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (isEnable) {
                this.nextSearchBtn.removeAttribute('disabled');
            } else {
                if (this.nextSearchBtn as HTMLButtonElement) {
                    (this.nextSearchBtn as HTMLButtonElement).disabled = true;
                }
            }
        }
    }

    // eslint-disable-next-line
    private checkBoxOnChange = (event: any): void => {
        if (isBlazor()) {
            if (event.currentTarget && event.currentTarget.checked) {
                this.isMatchCase = true;
            } else {
                this.isMatchCase = false;
            }
        } else {
            if (event.checked) {
                this.isMatchCase = true;
            } else {
                this.isMatchCase = false;
            }
        }
        if (this.isTextSearch) {
            this.resetVariables();
            this.clearAllOccurrences();
            const inputString: string = (this.searchInput as HTMLInputElement).value;
            this.searchIndex = 0;
            this.textSearch(inputString);
        }
    };

    /**
     * @private
     */
    public resetVariables(): void {
        this.searchedPages = [];
        // eslint-disable-next-line
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
    };

    private searchClickHandler = (event: Event): void => {
        this.searchButtonClick(this.searchBtn, this.searchInput);
    };

    /**
     * @param element
     * @param inputElement
     * @private
     */
    public searchButtonClick(element: HTMLElement, inputElement: HTMLElement): void {
        this.isMessagePopupOpened = false;
        if (isBlazor() && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            const searchElement: HTMLElement = this.pdfViewerBase.getElement('_search_box-icon');
            element = searchElement.children[0].children[0] as HTMLElement;
            inputElement = this.pdfViewerBase.getElement('_search_input');
        }
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch(inputElement);
        } else if (element.classList.contains('e-pv-search-close')) {
            this.showLoadingIndicator(false);
            (inputElement as HTMLInputElement).value = '';
            this.resetTextSearch();
            inputElement.focus();
        }
    }

    private updateSearchInputIcon(isEnable: boolean): void {
        if (isBlazor()) {
            if (this.searchBtn && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
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
    };

    private prevButtonOnClick = (event: Event): void => {
        this.prevSearch();
    };

    private onMessageBoxOpen(): void {
        this.showLoadingIndicator(false);
        this.pdfViewerBase.getElement('_search_input').blur();
        this.isMessagePopupOpened = true;
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            if (isBlazor()) {
                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Nomatches');
                promise.then((value: string) => {
                    this.pdfViewerBase.textLayer.createNotificationPopup(value);
                });
            } else {
                this.pdfViewerBase.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No matches'));
            }
        } else {
            if (isBlazor()) {
                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_NoTextFound');
                promise.then((value: string) => {
                    this.pdfViewerBase.navigationPane.createTooltipMobile(value);
                });
            } else {
                this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No Text Found'));
            }
        }
    }

    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages
     *
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
     * @returns void
     */
    public searchText(searchText: string, isMatchCase: boolean): void {
        if (searchText && searchText.length > 0 && searchText[searchText.length - 1] === ' ') {
            searchText = searchText.slice(0, searchText.length - 1);
        }
        if(this.pdfViewer.enableHtmlSanitizer && searchText){
            searchText = SanitizeHtmlHelper.sanitize(searchText);
        }
        this.searchString = searchText;
        this.isMatchCase = isMatchCase;
        this.searchIndex = 0;
        this.textSearch(searchText);
    }

    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer.
     *
     * @returns void
     */
    public searchNext(): void {
        this.nextSearch();
    }

    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer.
     *
     * @returns void
     */
    public searchPrevious(): void {
        this.prevSearch();
    }

    /**
     * Cancels the text search of the PdfViewer.
     *
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
