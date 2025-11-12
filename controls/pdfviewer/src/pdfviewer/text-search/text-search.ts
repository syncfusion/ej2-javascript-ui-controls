import { createElement, Browser, isNullOrUndefined, isBlazor, SanitizeHtmlHelper, ChildProperty, Property } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { PdfViewer, PdfViewerBase, AjaxHandler, TileRenderingSettingsModel, IPdfRectBounds, ExtractTextOption } from '../index';
import { DocumentTextCollectionSettingsModel, RectangleBoundsModel, SearchResultModel } from '../pdfviewer-model';
import { createSpinner, showSpinner, hideSpinner } from '../index';
import { Rect } from '@syncfusion/ej2-drawings';
import { PdfPage } from '@syncfusion/ej2-pdf';
import { AutoComplete } from '@syncfusion/ej2-dropdowns';
import { regex } from '@syncfusion/ej2-inputs';
import { PdfViewerUtils, TaskPriorityLevel } from '../base/pdfviewer-utlis';
const searchTextCollection: any = [];
/**
 * TextSearch module
 *
 * @param {Event} event - event
 * @returns {void}
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
    public searchCountEle: HTMLElement;
    /**
     * @private
     */
    public searchInputContainer: HTMLElement;
    /**
     * @private
     */
    public searchCount: number = 0;
    /**
     * @private
     */
    public currentOccurrence: number = 0;
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;
    private searchBox: HTMLElement;
    private nextSearchBtn: HTMLElement;
    private prevSearchBtn: HTMLElement;
    private searchIndex: number = 0;
    private currentSearchIndex: number = 0;
    private startIndex: number = null;
    /**
     * @private
     */
    public searchPageIndex: number = null;
    private startSearchPageIndex: number = null;
    private searchString: string = null;
    private isMatchCase: boolean = false;
    private isMultiSearch: boolean = false;
    private isSingleSearch: boolean = false;
    /**
     * @private
     */
    public findTextDocumentCollection: any[] = [];
    private searchAutocompleteObj: AutoComplete;
    private searchRequestHandler: AjaxHandler = null;
    private textSearchHandleRequest: AjaxHandler = null;
    /**
     * @private
     */
    public isTextSearchHandled: boolean = false;
    /**
     * @private
     */
    public textSearchOpen: boolean = false;
    /**
     * @private
     */
    public programaticalSearch: boolean = false;
    /**
     * @private
     */
    public isFiltering: boolean = false;
    private textContents: Array<string[]> = [];
    /**
     * @private
     */
    public searchMatches: Array<any[]> = [];
    private multiSearchCounts: { [Key: string]: number } = {};
    private getSearchTextDetails: {[key: number]: { Bounds: {[boundsKey: number] : {Bounds: any[]}}, PageOccurrence: number }} = {};
    private searchedPages: number[] = [];
    private isPrevSearch: boolean = false;
    private isExactMatch: boolean = false;
    private autompleteDataSource: any[] = [];
    private matchAnyWordCheckBox: CheckBox;
    private searchedOccurrences: number[] = [];
    private isSelectedFromPopup: boolean = false;
    /**
     * @private
     */
    public isDocumentTextCollectionReady: boolean = false;
    private intervalId: any = null;
    /**
     * @private
     */
    public searchTextDivzIndex: string = '-1';
    private tempElementStorage: Array<{ [key: string]: string }> = [];
    /**
     * @private
     */
    public isMessagePopupOpened: boolean = false;
    /**
     * @private
     */
    public documentTextCollection: DocumentTextCollectionSettingsModel[][];
    /**
     * @private
     */
    public isTextRetrieved: boolean = false;
    private isTextSearched: boolean = false;
    private isTextSearchEventTriggered: boolean = false;
    private isSearchText: boolean = false;
    private isLastOccurrenceCompleted: boolean = false;
    private isInitialSearch: boolean;
    /**
     * @param {PdfViewer} pdfViewer - It describes about the pdf viewer
     * @param {PdfViewerBase} pdfViewerBase - It describes about the pdfviewer base
     * @private
     * @returns {void}
     */
    constructor(pdfViewer: PdfViewer, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * @private
     * @returns {void}
     */
    public createTextSearchBox(): void {
        this.searchBox = createElement('div', { id: this.pdfViewer.element.id + '_search_box', className: 'e-pv-text-search-bar' });
        let toolbarElement: HTMLElement;
        let updatedTypedString: string;
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
        const searchElementsContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_search_box_elements', className: 'e-pv-text-search-bar-elements' });
        this.searchInputContainer = createElement('div', { id: this.pdfViewer.element.id + '_search_input_container', className: 'e-input-group e-pv-text-search-input' });
        this.searchInput = createElement('input', { id: this.pdfViewer.element.id + '_search_input', className: 'e-input e-pv-search-input-ele' });
        const tempData: any = {
            matches: [
                { 'SearchString': '', 'Count': '' }
            ]
        };
        const isFirst: boolean = false;
        this.searchAutocompleteObj = new AutoComplete({
            dataSource: tempData.matches,
            fields: { value: 'SearchString' },
            headerTemplate:
                `<div class="e-pv-automplete-header"><span class="e-pv-search-exact-matches">${this.pdfViewer.localeObj.getConstant('Exact Matches')}</span><span class="e-pv-total-exact-matches"></span></div>`,
            itemTemplate: '<div class="e-pv-autocomplete-item">' +
                '<span class="e-pv-autocomplete-word"> ${SearchString} </span><span class="e-pv-autocomplete-count">${Count}</span></div>',
            placeholder: this.pdfViewer.localeObj.getConstant('Find in document'),
            popupHeight: '200px',
            beforeOpen: (event: any) => {
                if (Array.isArray(this.autompleteDataSource) && (this.autompleteDataSource.length === 0)) {
                    event.cancel = true;
                }
            },
            select: (event: any) => {
                this.isSelectedFromPopup = true;
                this.isSingleSearch = true;
                this.isMultiSearch = false;
                this.isExactMatch = true;
                this.initiateSearch(event.itemData.SearchString);
            },
            blur: (event: any) => {
                if (updatedTypedString && this.searchAutocompleteObj.value === updatedTypedString.toLowerCase()) {
                    this.searchAutocompleteObj.value = updatedTypedString;
                    this.searchAutocompleteObj.dataBind();
                }
            },
            filtering: (event: any) => {
                updatedTypedString = event.text;
                if (!this.isDocumentTextCollectionReady) {
                    this.resetVariablesTextSearch();
                    this.clearAllOccurrences();
                }
                this.isSelectedFromPopup = false;
                if (this.searchCountEle) {
                    this.searchCountEle.innerHTML = '';
                    this.adjustInputContainerWidth();
                }
                this.isSingleSearch = false;
                this.isExactMatch = false;
                this.isMultiSearch = this.matchAnyWordCheckBox.checked;
                this.initiateTextSearch(event.text);
                if (event.text === '') {
                    clearInterval(this.intervalId);
                    this.showLoadingIndicator(false);
                }
                this.searchString = '';
                if (this.documentTextCollection.length === this.pdfViewerBase.pageCount) {
                    this.isDocumentTextCollectionReady = true;
                }
                const updateInterval: any = setInterval(() => {
                    if (this.documentTextCollection.length === this.pdfViewerBase.pageCount) {
                        event.updateData(this.autompleteDataSource, null);
                        if (Array.isArray(this.autompleteDataSource) && (this.autompleteDataSource.length !== 0)) {
                            const dataSourceInfo: any = this.autompleteDataSource;
                            const totalCount: any = dataSourceInfo.reduce((acc: number, obj: { Count: string }) =>
                                acc + parseInt(obj.Count, 10), 0);
                            document.querySelector('.e-pv-total-exact-matches').innerHTML = totalCount;
                            if (this.isMultiSearch) {
                                document.querySelector('.e-pv-search-exact-matches').innerHTML = this.pdfViewer.localeObj.getConstant('Total Matches');
                            }
                            else {
                                document.querySelector('.e-pv-search-exact-matches').innerHTML = this.pdfViewer.localeObj.getConstant('Exact Matches');
                            }
                        }
                        else if (this.autompleteDataSource.length === 0) {
                            const element: Element = document.querySelector('.e-pv-total-exact-matches');
                            if (!isNullOrUndefined(element)) {
                                element.innerHTML = '0';
                            }
                            this.searchAutocompleteObj.hidePopup();
                        }
                        clearInterval(updateInterval);
                        this.isDocumentTextCollectionReady = true;
                    }
                }, 1000);
            },
            created: (event: any) => {
                this.searchAutocompleteObj.element.addEventListener('keydown', (args: any) => {
                    if (args.key === 'Enter') {
                        this.isSingleSearch = true;
                        this.isExactMatch = this.isSelectedFromPopup;
                        this.isMultiSearch = false;
                        if (!this.isDocumentTextCollectionReady) {
                            if ((this.searchInput as HTMLInputElement).value !== '' && (this.searchInput as HTMLInputElement).value !== this.searchString) {
                                this.isTextSearchHandled = false;
                                this.searchCount = 0;
                                this.searchIndex = 0;
                                this.searchPageIndex = 0;
                                this.textSearchWhileLoading((this.searchInput as HTMLInputElement).value, this.isMatchCase);
                                this.searchString = (this.searchInput as HTMLInputElement).value;
                            }
                            if (this.isTextSearchHandled) {
                                this.nextSearch();
                            }
                        }
                        else {
                            this.initiateTextSearch((this.searchInput as HTMLInputElement).value);
                        }
                        if (this.searchCount === 0 && !this.isMessagePopupOpened &&
                            this.documentTextCollection.length === this.pdfViewerBase.pageCount) {
                            this.onMessageBoxOpen();
                        }
                    }
                });
                this.searchAutocompleteObj.element.parentElement.querySelector('.e-clear-icon').addEventListener('mousedown', (args: any) => {
                    this.showLoadingIndicator(false);
                    clearInterval(this.intervalId);
                    (this.searchInput as HTMLInputElement).value = '';
                    this.resetTextSearch();
                    if (this.searchCountEle) {
                        this.searchCountEle.innerHTML = '';
                        this.adjustInputContainerWidth();
                    }
                    this.searchInput.focus();
                    this.searchString = '';
                });
            }
        });
        this.searchBtn = createElement('span', { id: this.pdfViewer.element.id + '_search_box-icon', className: 'e-input-group-icon e-input-search-group-icon e-pv-search-icon' });
        this.searchBtn.setAttribute('tabindex', '0');
        this.searchInputContainer.appendChild(this.searchInput);
        this.searchAutocompleteObj.appendTo(this.searchInput);
        searchElementsContainer.appendChild(this.searchInputContainer);
        this.searchCountEle = createElement('span', { id: this.pdfViewer.element.id + '_search_count', className: 'e-pv-search-count', innerHTML: '' });
        searchElementsContainer.appendChild(this.searchCountEle);
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
        const matchCaseContainer: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_match_case_container', className: 'e-pv-textsearch-match-case-container' });
        const matchCaseInput: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_match_case' });
        (matchCaseInput as HTMLInputElement).type = 'checkbox';
        if (isBlazor()) {
            matchCaseInput.style.height = '17px';
            matchCaseInput.style.width = '17px';
            matchCaseInput.addEventListener('change', this.checkBoxOnChange.bind(this));
        }
        matchCaseContainer.appendChild(matchCaseInput);
        const matchAnyWordInput: HTMLElement = createElement('input', { id: this.pdfViewer.element.id + '_match_any_word' });
        (matchAnyWordInput as HTMLInputElement).type = 'checkbox';
        matchCaseContainer.appendChild(matchAnyWordInput);

        this.searchBox.appendChild(searchElementsContainer);
        this.searchBox.appendChild(matchCaseContainer);
        this.pdfViewerBase.mainContainer.appendChild(this.searchBox);
        if (isBlazor()) {
            const matchCaseText: HTMLElement = createElement('span', { id: this.pdfViewer.element.id + '_search_box_text', styles: 'position: absolute; padding-top: 3px; padding-left: 8px; padding-right: 8px; font-size: 13px' });
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Matchcase');
            promise.then((value: string) => {
                matchCaseText.textContent = value;
            });
            matchCaseContainer.appendChild(matchCaseText);
        } else {
            const checkBox: CheckBox = new CheckBox({ cssClass: 'e-pv-match-case', label: this.pdfViewer.localeObj.getConstant('Match case'), htmlAttributes: { 'tabindex': '0' }, change: this.checkBoxOnChange.bind(this) });
            checkBox.appendTo(matchCaseInput);
            this.matchAnyWordCheckBox = new CheckBox({
                cssClass: 'e-pv-match-any-word', label: this.pdfViewer.localeObj.getConstant('Match any word'), htmlAttributes: { 'tabindex': '0' }, change: () => {
                    this.isMultiSearch = this.matchAnyWordCheckBox.checked;
                }
            });
            this.matchAnyWordCheckBox.appendTo(matchAnyWordInput);
        }
        matchCaseContainer.firstElementChild.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                (event.target as any).click();
                event.preventDefault();
                event.stopPropagation();
            }
        });
        matchAnyWordInput.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                (event.target as any).click();
                event.preventDefault();
                event.stopPropagation();
            }
        });
        const waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_textSearchLoadingIndicator' });
        this.searchInputContainer.appendChild(waitingPopup);
        waitingPopup.style.position = 'absolute';
        waitingPopup.style.top = '15px';
        waitingPopup.style.left = this.searchInputContainer.clientWidth - 46 + 'px';
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
        this.searchBtn.addEventListener('click', this.searchClickHandler.bind(this));
        this.searchBtn.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
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

    private textSearchWhileLoading(searchWord: string, isMatchCase: boolean, startIndex?: number, endIndex?: number,
                                   isFirstResult?: boolean, isCompleted?: boolean): void {
        let endPage: number = endIndex ? endIndex : 100;
        let isPagesCompleted: boolean = isCompleted ? isCompleted : false;
        if (endPage >= this.pdfViewerBase.pageCount) {
            endPage = this.pdfViewerBase.pageCount;
            isPagesCompleted = true;
        }
        if (!this.pdfViewerBase.clientSideRendering) {
            // eslint-disable-next-line
            const proxy: TextSearch = this;
            const jsonObject: object = { text: searchWord, matchCase: isMatchCase, documentId: this.pdfViewerBase.getDocumentId(), hashId: this.pdfViewerBase.hashId, action: 'SearchTextPdf', elementId: this.pdfViewer.element.id, uniqueId: this.pdfViewerBase.documentId, startIndex: startIndex ? startIndex : 0, endIndex: endPage, isCompleted: isPagesCompleted, isRequestsend: !isNullOrUndefined(isFirstResult) ? isFirstResult : false };
            this.textSearchHandleRequest = new AjaxHandler(this.pdfViewer);
            this.textSearchHandleRequest.url = this.pdfViewer.serviceUrl + '/' + 'RenderPdfTexts';
            this.textSearchHandleRequest.responseType = 'json';
            this.textSearchHandleRequest.send(jsonObject);
            this.textSearchHandleRequest.onSuccess = function (result: any): void {
                let data: any = result.data;
                if (data) {
                    try {
                        proxy.searchTextAfteresult(data.resultPages, data.totalSearchCount, data.searchWord, data.matchCase, (data.isRequestsend.toLowerCase() === 'true'), (data.isCompleted.toLowerCase() === 'true'), data.endIndex);
                    }
                    catch (error) {
                        data = null;
                    }
                }
            };
        }
        if (this.pdfViewerBase.clientSideRendering) {
            this.pdfViewerBase.pdfViewerRunner.addTask({
                message: 'searchText',
                zoomFactor: this.pdfViewerBase.getZoomFactor(),
                searchWord: searchWord,
                matchCase: isMatchCase,
                startIndex: startIndex ? startIndex : 0,
                endIndex: endPage,
                isCompleted: isPagesCompleted,
                isRequestsend: !isNullOrUndefined(isFirstResult) ? isFirstResult : false
            }, TaskPriorityLevel.Medium);
        }
    }

    /**
     * @param {any} resultPages - Result of the text search word
     * @param {number} totalSearchCount - Search count of the word
     * @param {string} searchWord - Word that given for the text search
     * @param {boolean} matchCase - It gives about the match case
     * @param {boolean} isFirstResult - It gives first result from the request
     * @param {boolean} isCompleted - It gives the search complete indication
     * @param {number} endIndex - It describes end pageindex of the result
     * @private
     * @returns {void}
     */
    public searchTextAfteresult(resultPages: any, totalSearchCount: any, searchWord: string, matchCase: boolean, isFirstResult?: boolean,
                                isCompleted?: boolean, endIndex?: number): void {
        if (totalSearchCount === 0 && this.searchCount === 0) {
            if (isCompleted) {
                this.isTextSearchHandled = true;
                this.pdfViewerBase.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No Matches'));
                this.showLoadingIndicator(false);
            }
        }
        else {
            let searchString: string = this.searchString;
            if (/[’']/g.test(searchWord)) {
                searchWord = this.normalizeForSearch(searchWord);
                searchString = this.normalizeForSearch(this.searchString);
            }
            if (this.isSingleSearch && searchString === searchWord && this.isMatchCase === matchCase && (this.textSearchOpen ||
                this.programaticalSearch)) {
                this.isTextSearchHandled = true;
                const details: any = this.getSearchTextDetails;
                this.getSearchTextDetails = {...details, ...resultPages};
                this.hightlightSearchedTexts(this.searchPageIndex, isFirstResult);
                if (isCompleted) {
                    this.showLoadingIndicator(false);
                }
                else {
                    this.showLoadingIndicator(true);
                }
                this.searchCount = this.searchCount + totalSearchCount;
                if (!isFirstResult) {
                    this.currentOccurrence = 1;
                    this.searchedOccurrences.push(this.currentOccurrence);
                    if (this.searchedOccurrences.length === 1) {
                        this.pdfViewer.fireTextSearchStart(this.searchString, this.isMatchCase);
                    }
                }
                this.searchCountEle.style.display = 'inline-block';
                this.getSearchCountText();
                this.updateLoadingIndicator();
            }
        }
        if (!isCompleted && this.searchString === searchWord && (this.textSearchOpen || this.programaticalSearch)) {
            this.textSearchWhileLoading(searchWord, matchCase, endIndex, endIndex + 100, (this.searchCount !== 0) ? true : false,
                                        isCompleted);
        }
    }

    private updateLoadingIndicator(): void {
        const loadingIndicator: any = document.getElementById(this.pdfViewer.element.id + '_textSearchLoadingIndicator');
        loadingIndicator.style.left = this.searchInputContainer.clientWidth - 46 + 'px';
    }

    /**
     * @param {number} pageNumber - It decribes the search pageIndex value
     * @param {boolean} isPageChange - It describes the first result highlight
     * @param {boolean} isSearchCompleted - It describes the text search has been completed or not.
     * @private
     * @returns {void}
     */
    public hightlightSearchedTexts(pageNumber?: number, isPageChange?: boolean, isSearchCompleted?: boolean): void {
        this.clearAllOccurrences();
        let elementIdCount: number;
        const keys: number[] = [];
        for (const key in this.getSearchTextDetails) {
            if (Object.prototype.hasOwnProperty.call(this.getSearchTextDetails, key)) {
                keys.push(parseInt(key, 10));
            }
        }
        keys.sort((a: number, b: number) => a - b);
        if (!isNullOrUndefined(pageNumber)) {
            let previous: number = keys[keys.length - 1];
            let next: number = keys[0];
            for (let i: number = 0; i < keys.length; i++) {
                if (keys[parseInt(i.toString(), 10)] < pageNumber) {
                    previous = keys[parseInt(i.toString(), 10)];
                } else if (keys[parseInt(i.toString(), 10)] > pageNumber) {
                    next = keys[parseInt(i.toString(), 10)];
                    break;
                }
            }
            if (!this.getSearchTextDetails[parseInt(pageNumber.toString(), 10)]) {
                pageNumber = next;
            }
            if ((this.searchIndex + 1) > this.getSearchTextDetails[parseInt(pageNumber.toString(), 10)].PageOccurrence ||
                this.searchIndex < 0) {
                if ((this.searchIndex + 1) > this.getSearchTextDetails[parseInt(pageNumber.toString(), 10)].PageOccurrence) {
                    pageNumber = ((pageNumber + 1) === keys[keys.length - 1]) ? 0 : next;
                    this.searchIndex = 0;
                }
                if (this.searchIndex < 0) {
                    pageNumber = ((pageNumber - 1) === -1) ? keys[keys.length - 1] : previous;
                    this.searchIndex = (this.getSearchTextDetails[parseInt(pageNumber.toString(), 10)].PageOccurrence - 1);
                }
            }
        }
        for (const key in this.getSearchTextDetails) {
            if (Object.prototype.hasOwnProperty.call(this.getSearchTextDetails, key)) {
                const value: any = this.getSearchTextDetails[parseInt(key.toString(), 10)];
                let idSearchIndexCount: number = 0;
                // eslint-disable-next-line guard-for-in
                for (const boundsKey in value.Bounds) {
                    if (Object.prototype.hasOwnProperty.call(value.Bounds, boundsKey)) {
                        const bounds: any = value.Bounds[parseInt(boundsKey.toString(), 10)];
                        for (let i: number = 0; i < bounds.length; i++) {
                            const leftValue: number = bounds[parseInt(i.toString(), 10)].Left;
                            const topValue: number = bounds[parseInt(i.toString(), 10)].Top;
                            const heightValue: number = bounds[parseInt(i.toString(), 10)].Height;
                            const widthValue: number = bounds[parseInt(i.toString(), 10)].Width;
                            let pageIndex: number = null;
                            if (isNullOrUndefined(isSearchCompleted)) {
                                pageIndex = pageNumber ? pageNumber : keys[0];
                            }
                            else {
                                if (isSearchCompleted) {
                                    pageIndex = null;
                                }
                            }
                            if ((this.searchIndex === idSearchIndexCount) && pageIndex === Number(key)) {
                                elementIdCount = idSearchIndexCount;
                                if ((!isNullOrUndefined(isPageChange) && !isPageChange) || isNullOrUndefined(isPageChange)) {
                                    this.pdfViewerBase.updateScrollTop(Number(key));
                                }
                                const idString: string = '_searchtext_' + Number(key) + '_' + idSearchIndexCount;
                                let element: any;
                                if (bounds.length <= 1 || i === 0) {
                                    element = document.getElementById(this.pdfViewer.element.id + idString);
                                }
                                else {
                                    element = document.getElementById(this.pdfViewer.element.id + idString + '_' + i);
                                }
                                if (element) {
                                    element.parentElement.removeChild(element);
                                }
                                this.searchPageIndex = Number(key);
                                this.createSearchTextDiv(idSearchIndexCount, Number(key), heightValue, widthValue, topValue, leftValue, 'e-pv-search-text-highlight', false, 0, i);
                            }
                            else {
                                this.createSearchTextDiv(idSearchIndexCount, Number(key), heightValue, widthValue, topValue, leftValue, 'e-pv-search-text-highlightother', false, 0, i);
                            }
                        }
                    }
                    idSearchIndexCount++;
                }
            }
        }
        if ((!isNullOrUndefined(isPageChange) && !isPageChange) || isNullOrUndefined(isPageChange)) {
            const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + this.searchPageIndex + '_' + elementIdCount);
            const scrollPoint: any = { y: -100, x: -100 };
            this.scrollToSearchStr(element, scrollPoint);
        }
    }

    /**
     * @private
     * @returns {void}
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
            if (this.pdfViewerBase.viewerContainer.clientWidth + this.pdfViewerBase.viewerContainer.offsetLeft <
                this.searchBox.offsetLeft + this.searchBox.clientWidth) {
                this.searchBox.style.right = '0px';
                this.searchBox.style.width = parseInt(this.searchBox.style.width, 10) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
                this.searchInput.style.width = parseInt(this.searchInput.style.width, 10) - ((this.searchBox.offsetLeft + this.searchBox.clientWidth) - (this.pdfViewerBase.viewerContainer.clientWidth)) + 'px';
            } else {
                this.searchBox.style.right = '88.3px';
                this.searchBox.style.width = '';
                this.searchInput.style.width = '';
            }
        }
    }

    /**
     * @param {boolean} isShow - It describes about the isShow
     * @private
     * @returns {void}
     */
    public showSearchBox(isShow: boolean): void {
        if (!isNullOrUndefined(this.searchBox)) {
            if (isShow) {
                this.searchBox.style.display = 'block';
                this.textSearchOpen = true;
            } else {
                this.searchBox.style.display = 'none';
                (this.searchInput as HTMLInputElement).value = '';
                this.searchCountEle.style.display = 'none';
                if (this.pdfViewer.toolbarModule) {
                    this.pdfViewer.toolbarModule.isTextSearchBoxDisplayed = false;
                }
                this.textSearchOpen = false;
            }
            this.onTextSearchClose();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public searchAfterSelection(): void {
        if (this.currentOccurrence === 0) {
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.startSearchPageIndex = this.searchPageIndex;
        }
        if (this.isTextSearch) {
            if (this.currentOccurrence !== 0) {
                this.initSearch(this.searchPageIndex, true);
                this.highlightOthers();
            }
        }
    }

    private normalizeForSearch(s: string): string {
        if (isNullOrUndefined(s)) { return s; }
        return s
            .normalize('NFKC')
            // eslint-disable-next-line
            .replace(/[\u2018\u2019\u201B]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/\u00A0/g, ' ');
    }

    private calculateSearchCount(inputString: string, documentTextCollection: any): void {
        this.searchCount = 0;
        if (/[’']/g.test(inputString)) {
            inputString = this.normalizeForSearch(inputString);
        }
        if (!this.isTextSearchHandled) {
            this.currentOccurrence = 0;
            this.resetVariables();
            this.searchIndex = 0;
        }
        if (!inputString || inputString.trim() === '') {
            if (this.searchCountEle) {
                this.searchCountEle.innerHTML = '';
                this.adjustInputContainerWidth();
            }
            return;
        }
        if (this.isMultiSearch) {
            if (this.searchCountEle) {
                this.searchCountEle.innerHTML = '';
                this.adjustInputContainerWidth();
            }
            const wordsToSearch: string[] = inputString.split(' ');
            this.multiSearchCounts = {};
            for (let word of wordsToSearch) {
                word = word.trim();
                if (word === '') {
                    continue;
                }
                let wordCount: number = 0;
                for (let i: number = 0; i < documentTextCollection.length; i++) {
                    const pageIndex: number = parseInt(Object.keys(documentTextCollection[parseInt(i.toString(), 10)])[0], 10);
                    const documentIndex: any = documentTextCollection[parseInt(i.toString(), 10)][parseInt(pageIndex.toString(), 10)];
                    let pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                    if (/[’']/g.test(inputString)) {
                        pageTextData = this.normalizeForSearch(pageTextData);
                    }
                    if (!this.isMatchCase) {
                        pageTextData = pageTextData.toLowerCase();
                        word = word.toLowerCase();
                    }
                    let matchIndex: number = pageTextData.indexOf(word);
                    while (matchIndex !== -1) {
                        wordCount++;
                        matchIndex = pageTextData.indexOf(word, matchIndex + 1);
                    }
                }
                this.multiSearchCounts[`${word}`] = wordCount;
            }
            const transformedData: any = Object.keys(this.multiSearchCounts).map((key: string) => ({
                SearchString: key,
                Count: this.multiSearchCounts[`${key}`].toString()
            }));
            this.autompleteDataSource = transformedData;
            return;
        }
        const wordCounts: { [key: string]: number } = {};
        for (let i: number = 0; i < documentTextCollection.length; i++) {
            const pageIndex: number = parseInt(Object.keys(documentTextCollection[parseInt(i.toString(), 10)])[0], 10);
            const documentIndex: any = documentTextCollection[parseInt(i.toString(), 10)][parseInt(pageIndex.toString(), 10)];
            let pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
            if (/[’']/g.test(inputString)) {
                pageTextData = this.normalizeForSearch(pageTextData);
            }
            let multiSearch: string = (pageTextData.replace((/(\s\r\n)/gm), ' ')).replace((/(\r\n)/gm), ' ');
            let Multiline: string = (pageTextData.replace((/(\s\r\n)/gm), '  ')).replace((/(\r\n)/gm), ' ');
            let specialCharcterSearch: string = multiSearch.replace(/[^a-zA-Z0-9]+/g, ' ');
            let arrayReturns: any;
            const queryLength: number = inputString.length;
            const matches: any[] = [];
            const matchedArray: number[] = [];
            let matchIndex: number = -queryLength;
            let newIndex: number = -queryLength;
            let multiSearchIndex: number = -queryLength;
            let MultilineIndex: number = -queryLength;
            let specialcharcterIndex: number = -queryLength;
            if (!this.isMatchCase) {
                inputString = inputString.toLowerCase();
                pageTextData = pageTextData.toLowerCase();
                multiSearch = multiSearch.toLowerCase();
                Multiline = Multiline.toLowerCase();
                specialCharcterSearch = specialCharcterSearch.toLowerCase();
            }
            while (matchIndex !== 0 || (matchIndex === 0 && matches.length > 0 && matches[0] === 0)) {
                if (!inputString || inputString === ' ') {
                    break;
                }
                if (this.isExactMatch) {
                    let match: RegExpExecArray;
                    // eslint-disable-next-line
                    const escapedInputString: string = inputString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    // eslint-disable-next-line
                    const regex: RegExp = new RegExp(`(?<!\\w)${escapedInputString}(?!\\w)`, 'g');
                    match = regex.exec(pageTextData);
                    while (match !== null) {
                        matches.push(match.index);
                        match = regex.exec(pageTextData);
                    }
                    break;
                }
                matchIndex = pageTextData.indexOf(inputString, matchIndex + queryLength);
                if (inputString.indexOf(' ') !== -1) {
                    const newString: string = inputString.replace(' ', '\r\n');
                    newIndex = pageTextData.indexOf(newString, newIndex + queryLength);
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
            if (matches.length === 0) {
                multiSearchIndex = multiSearch.indexOf(inputString, multiSearchIndex + queryLength);
                MultilineIndex = Multiline.indexOf(inputString, MultilineIndex + queryLength);
                specialcharcterIndex = specialCharcterSearch.indexOf(inputString, specialcharcterIndex + queryLength);
                if (multiSearchIndex !== -1) {
                    arrayReturns = this.correctLinetext(inputString, matchIndex, pageTextData, multiSearchIndex);
                    matchIndex = -arrayReturns[0].length;
                    for (let i: number = 0; i < arrayReturns.length; i++) {
                        matchIndex = pageTextData.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(), multiSearchIndex);
                        matchedArray.push(matchIndex);
                        if (matchedArray.length > 1) {
                            if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                                matches.push(matchedArray);
                                this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                            }
                            else {
                                i = -1;
                                matchIndex = matchedArray[0] + arrayReturns[0].length;
                                matchedArray.splice(0, matchedArray.length);

                            }
                        }
                    }
                }
                else if (specialcharcterIndex !== -1) {
                    arrayReturns = this.correctLinetext(inputString, matchIndex, pageTextData);
                    if (arrayReturns.length > 0) {
                        matchIndex = -arrayReturns[0].length;
                        for (let i: number = 0; i < arrayReturns.length; i++) {
                            matchIndex = pageTextData.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(),
                                                              matchIndex + (arrayReturns[i - 1] === undefined ||
                                null ? arrayReturns[0].length : arrayReturns[i - 1].length));
                            matchedArray.push(matchIndex);
                            if (matchedArray.length > 1) {
                                if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                                    matches.push(matchedArray);
                                    this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                                }
                                else {
                                    i = -1;
                                    matchIndex = matchedArray[0] + arrayReturns[0].length;
                                    matchedArray.splice(0, matchedArray.length);

                                }
                            }
                        }
                    }
                }
                else if (MultilineIndex !== -1) {
                    arrayReturns = this.correctLinetext(inputString, matchIndex, pageTextData);
                    if (arrayReturns.length > 0) {
                        matchIndex = -arrayReturns[0].length;
                        for (let i: number = 0; i < arrayReturns.length; i++) {
                            matchIndex = pageTextData.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(),
                                                              matchIndex + (arrayReturns[i - 1] === undefined ||
                                null ? arrayReturns[0].length : arrayReturns[i - 1].length));
                            matchedArray.push(matchIndex);
                            if (matchedArray.length > 1) {
                                if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                                    matches.push(matchedArray);
                                    this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                                } else {
                                    i = -1;
                                    matchIndex = matchedArray[0] + arrayReturns[0].length;
                                    matchedArray.splice(0, matchedArray.length);
                                }
                            }
                        }
                    }
                }
                if (matches.length > 1) {
                    matches.splice(1, matches.length);
                }
            }
            const words: string[] = pageTextData.match(/[a-zA-Z]+|\d+/g);
            if (!isNullOrUndefined(words)) {
                words.forEach((word: string) => {
                    if (word.startsWith(inputString)) {
                        if (wordCounts[`${word}`]) {
                            wordCounts[`${word}`]++;
                        } else {
                            wordCounts[`${word}`] = 1;
                        }
                    }
                });
            }
            if (matches.length > 0) {
                this.searchCount = this.searchCount + matches.length;
                this.adjustInputContainerWidth();
            }
            if (this.searchMatches && matches.length > 0) {
                this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
            }
        }
        const transformedData: any = Object.keys(wordCounts).map((key: string) => ({
            SearchString: key,
            Count: wordCounts[`${key}`].toString()
        }));
        if (this.isSingleSearch) {
            if (this.searchCountEle) {
                if (this.searchedOccurrences.indexOf(this.currentOccurrence + 1) === -1) {
                    if (!this.isTextSearchHandled) {
                        this.searchedOccurrences.push(this.currentOccurrence + 1);
                    }
                }
                this.adjustInputContainerWidth();
            }
            if (this.searchedOccurrences.length === 1) {
                this.pdfViewer.fireTextSearchStart(this.searchString, this.isMatchCase);
            }
            if (!this.isTextSearchHandled) {
                this.currentOccurrence += 1;
            }
        } else {
            if (this.searchAutocompleteObj) {
                this.autompleteDataSource = transformedData;
            }
        }
    }

    private getSearchCountText(): void {
        if (this.searchCount === 0) {
            this.searchCountEle.innerHTML = `${0} ${this.pdfViewer.localeObj.getConstant('of')} ${0}`;
        } else {
            this.enableNextButton(true);
            this.enablePrevButton(true);
            if (this.pdfViewer.enableRtl) {
                this.searchCountEle.innerHTML = `${this.searchCount} ${this.pdfViewer.localeObj.getConstant('of')} ${this.currentOccurrence}`;
            } else {
                this.searchCountEle.innerHTML = `${this.currentOccurrence} ${this.pdfViewer.localeObj.getConstant('of')} ${this.searchCount}`;
            }
        }
    }

    private adjustInputContainerWidth(): void {
        const parentContainer: HTMLElement = this.searchCountEle.parentElement;
        if (this.searchCount > 0) {
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                if (parentContainer) {
                    parentContainer.style.display = 'block';
                }
            }
            this.searchCountEle.style.display = 'inline-block';
        } else {
            this.searchCountEle.style.display = 'none';
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                if (parentContainer) {
                    parentContainer.style.display = 'none';
                }
            }
        }
    }

    private initiateTextSearch(inputString: string, isMobileSearch?: boolean): void {
        if (!isNullOrUndefined(this.documentTextCollection) && this.documentTextCollection.length !== this.pdfViewerBase.pageCount) {
            this.enableNextButton(false);
            this.enablePrevButton(false);
        } else {
            this.enableNextButton(true);
            this.enablePrevButton(true);
        }
        this.autompleteDataSource = [];
        if (this.pdfViewer.enableHtmlSanitizer && typeof inputString === 'string') {
            const sanitizedString: string = SanitizeHtmlHelper.sanitize(inputString);
            if (sanitizedString === inputString) {
                inputString = sanitizedString;
            }
        }
        if (inputString && inputString.length > 0 && inputString[inputString.length - 1] === ' ') {
            inputString = inputString.slice(0, inputString.length - 1);
        }
        this.initiateSearch(inputString, isMobileSearch);
    }

    private handleSearchAfterTextCollectionReady(inputString: string, isMobileSearch?: boolean): void {
        if (isMobileSearch) {
            const searchCountElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_search_count');
            this.searchCountEle = searchCountElement;
        }
        this.isSingleSearch = isMobileSearch ? isMobileSearch : this.isSingleSearch;
        if (inputString !== this.searchString || this.isLastOccurrenceCompleted) {
            this.isTextSearchHandled = false;
            this.calculateSearchCount(inputString, this.documentTextCollection);
            this.isInitialSearch = true;
            this.isLastOccurrenceCompleted = false;
            if (this.currentOccurrence === 0) {
                this.startSearchPageIndex = this.searchPageIndex;
            }
        }
        if (inputString !== this.searchString || this.searchPageIndex === null || this.startSearchPageIndex === null) {
            this.isTextSearch = false;
            if (!this.isTextSearchHandled) {
                this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
                this.startSearchPageIndex = this.searchPageIndex;
            }
        }
        if (!this.isTextSearchHandled) {
            this.clearAllOccurrences();
        }
        if (inputString !== '' && !this.isMultiSearch && this.isSingleSearch && this.searchCount > 0) {
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
                this.textSearch(inputString);
            }
        }
        if (inputString === '') {
            this.searchString = '';
        }
    }

    /**
     * @param {string} inputString - It describes about the input string
     * @param {boolean} isMobileSearch - Indicates is mobile search or not
     * @private
     * @returns {void}
     */
    public initiateSearch(inputString: string, isMobileSearch?: boolean): void {
        const pageCount: number = this.pdfViewerBase.pageCount;
        if (!isNullOrUndefined(this.intervalId)) {
            clearInterval(this.intervalId);
        }
        const checkDocumentTextCollection: () => void = (): void => {
            if (!this.isTextSearchHandled) {
                this.showLoadingIndicator(true);
            }
            if (this.documentTextCollection.length === pageCount) {
                clearInterval(this.intervalId);
                this.isDocumentTextCollectionReady = true;
                this.calculateSearchCount((this.searchInput as HTMLInputElement).value, this.documentTextCollection);
                this.getSearchTextDetails = {};
                this.showLoadingIndicator(false);
                this.enableNextButton(true);
                this.enablePrevButton(true);
                this.intervalId = null;
                if (!this.isTextSearchHandled) {
                    this.handleSearchAfterTextCollectionReady(inputString, isMobileSearch);
                }
            }
            if (isMobileSearch) {
                if (this.pdfViewerBase.navigationPane) {
                    this.pdfViewerBase.navigationPane.setSearchInputWidth();
                }
            }
        };
        if (!this.isDocumentTextCollectionReady) {
            this.intervalId = setInterval(checkDocumentTextCollection, 1000);
        }
        else {
            this.handleSearchAfterTextCollectionReady(inputString, isMobileSearch);
        }
    }

    private textSearch(inputString: string): void {
        if (inputString !== '' || inputString) {
            this.searchString = inputString;
            this.isTextSearch = true;
            this.isSearchText = true;
            this.searchPageIndex = this.pdfViewerBase.currentPageNumber - 1;
            this.isTextSearchEventTriggered = false;
            if (!this.isTextSearchHandled) {
                this.showLoadingIndicator(true);
            }
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
            if (!this.isTextSearchHandled) {
                this.searchPageIndex = this.findNextPageWithText(this.searchPageIndex, true);
                this.initSearch(this.searchPageIndex, false);
                this.highlightOthers();
            }
        }
    }

    private nextSearch(): void {
        this.isPrevSearch = false;
        this.isTextSearch = true;
        this.isSearchText = false;
        let isCountIncreased: boolean = false;
        this.isSingleSearch = true;
        if (this.isDocumentTextCollectionReady) {
            if (this.searchString) {
                this.clearAllOccurrences();
                if (this.currentOccurrence !== 0) {
                    this.searchIndex = this.searchIndex + 1;
                    if (this.areAllOccurencesSearched() && !this.isMessagePopupOpened) {
                        this.onMessageBoxOpen();
                    }
                }
                else {
                    this.searchIndex = 0;
                    this.currentOccurrence += 1;
                    isCountIncreased = true;
                    this.getSearchCountText();
                    if (this.searchedOccurrences.indexOf(this.currentOccurrence) === -1) {
                        this.searchedOccurrences.push(this.currentOccurrence);
                    }
                    if (this.searchedOccurrences.length === 1) {
                        this.pdfViewer.fireTextSearchStart(this.searchString, this.isMatchCase);
                    }
                }
                if (this.searchMatches[this.searchPageIndex]) {
                    if (this.searchIndex >= this.searchMatches[this.searchPageIndex].length) {
                        this.searchIndex = 0;
                        this.searchPageIndex = this.findNextPageWithText(this.searchPageIndex);
                        if (this.pdfViewerBase.pageCount > 0) {
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
                        const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + this.searchPageIndex + '_' + this.searchIndex);
                        if (!isNullOrUndefined(element)) {
                            const isScroll: boolean = this.isScrollPages(element);
                            if (isScroll) {
                                this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
                            }
                        }
                        this.showLoadingIndicator(false);
                    }
                    this.highlightOthers(true);
                    if (this.currentOccurrence <= this.searchCount && !this.isMessagePopupOpened) {
                        if (this.currentOccurrence === this.searchCount) {
                            this.currentOccurrence = 1;
                        }
                        else {
                            if (!isCountIncreased) {
                                this.currentOccurrence = (this.currentOccurrence + 1);
                            }
                        }
                        if (this.searchCountEle && this.isSingleSearch) {
                            this.getSearchCountText();
                            if (this.searchedOccurrences.indexOf(this.currentOccurrence) === -1) {
                                this.searchedOccurrences.push(this.currentOccurrence);
                            }
                            this.adjustInputContainerWidth();
                        }
                    }
                } else if (!this.searchMatches[this.searchPageIndex] && !this.isMessagePopupOpened) {
                    if (this.pdfViewerBase.pageCount > 0) {
                        this.initSearch(this.searchPageIndex, false);
                    }
                } else {
                    if (!this.isMessagePopupOpened) {
                        this.initiateTextSearch((this.searchInput as HTMLInputElement).value);
                    }
                }
            } else {
                this.initiateTextSearch((this.searchInput as HTMLInputElement).value);
            }
            const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + this.searchPageIndex + '_' + this.searchIndex);
            if (!isNullOrUndefined(element)) {
                this.scrollToSearch(element);
            }
        }
        else {
            this.clearAllOccurrences();
            if (this.areAllOccurencesSearched()) {
                this.onMessageBoxOpen();
            }
            if (!this.isMessagePopupOpened) {
                if (this.currentOccurrence !== 0) {
                    this.searchIndex = this.searchIndex + 1;
                }
                if (this.currentOccurrence + 1 > this.searchCount) {
                    this.currentOccurrence = 1;
                }
                else {
                    this.currentOccurrence = this.currentOccurrence + 1;
                }
                if (this.searchedOccurrences.indexOf(this.currentOccurrence) === -1) {
                    this.searchedOccurrences.push(this.currentOccurrence);
                }
                this.getSearchCountText();
                this.hightlightSearchedTexts(this.searchPageIndex);
            }
        }
    }

    private findNextPageWithText(currentPageIndex: number, isInitialSearch?: boolean): number {
        if (isInitialSearch) {
            this.isInitialSearch = false;
            if (this.searchMatches[parseInt(currentPageIndex.toString(), 10)] &&
                this.searchMatches[parseInt(currentPageIndex.toString(), 10)].length > 0) {
                return currentPageIndex;
            }
        }
        for (let i: number = 1; i < this.pdfViewerBase.pageCount; i++) {
            let nextPageIndex: number = (currentPageIndex + i) % this.pdfViewerBase.pageCount;
            if (this.searchMatches[parseInt(nextPageIndex.toString(), 10)] &&
                this.searchMatches[parseInt(nextPageIndex.toString(), 10)].length > 0) {
                if (this.searchedOccurrences.length === this.searchCount && !isInitialSearch) {
                    nextPageIndex = this.startSearchPageIndex;
                    return nextPageIndex;
                }
                return nextPageIndex;
            }
        }
        return currentPageIndex;
    }

    private findFirstNonEmptyPage(): number {
        for (let j: number = 0; j < this.pdfViewerBase.pageCount; j++) {
            if (this.searchMatches[parseInt(j.toString(), 10)] && this.searchMatches[parseInt(j.toString(), 10)].length > 0) {
                return j;
            }
        }
        return null;
    }

    private prevSearch(): void {
        searchTextCollection.push(this.searchPageIndex);
        this.isPrevSearch = true;
        this.isTextSearch = true;
        this.isSearchText = false;
        if (this.isDocumentTextCollectionReady) {
            if (this.searchString) {
                this.clearAllOccurrences();
                this.searchIndex = this.searchIndex - 1;
                if (this.currentOccurrence === 0) {
                    this.currentOccurrence = this.searchCount + 1;
                }
                if (this.areAllOccurencesSearched() && !this.isMessagePopupOpened) {
                    this.onMessageBoxOpen();
                }
                if (!this.isMessagePopupOpened) {
                    if (this.searchIndex < 0) {
                        this.searchPageIndex = this.findPreviousPageWithText();
                        this.initSearch(this.searchPageIndex, false);
                        this.showLoadingIndicator(true);
                    } else {
                        this.highlightSearchedTexts(this.searchPageIndex, false, undefined);
                        this.showLoadingIndicator(false);
                    }
                    this.highlightOthers(true);
                }
                if (this.currentOccurrence - 1 >= 0 && !this.isMessagePopupOpened) {
                    if (this.currentOccurrence - 1 === 0) {
                        this.currentOccurrence = this.searchCount;
                    } else {
                        this.currentOccurrence = this.currentOccurrence - 1;
                    }
                    if (this.searchCountEle && this.isSingleSearch) {
                        this.getSearchCountText();
                        if (this.searchedOccurrences.indexOf(this.currentOccurrence) === -1) {
                            this.searchedOccurrences.push(this.currentOccurrence);
                        }
                        if (this.searchedOccurrences.length === 1) {
                            this.pdfViewer.fireTextSearchStart(this.searchString, this.isMatchCase);
                        }
                        this.adjustInputContainerWidth();
                    }
                }
            } else {
                this.searchIndex = this.searchIndex - 1;
                this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                const inputString: string = (this.searchInput as HTMLInputElement).value;
                this.textSearch(inputString);
            }
        }
        else {
            this.clearAllOccurrences();
            if (this.areAllOccurencesSearched()) {
                this.onMessageBoxOpen();
            }
            if (!this.isMessagePopupOpened) {
                if (this.currentOccurrence !== 0) {
                    this.searchIndex = this.searchIndex - 1;
                }
                if ((this.currentOccurrence - 1) <= 0) {
                    this.currentOccurrence = this.searchCount;
                    const pageNum: any = Object.keys(this.getSearchTextDetails).pop();
                    this.pdfViewerBase.updateScrollTop(Number(pageNum));
                }
                else {
                    this.currentOccurrence = this.currentOccurrence - 1;
                }
                if (this.searchedOccurrences.indexOf(this.currentOccurrence) === -1) {
                    this.searchedOccurrences.push(this.currentOccurrence);
                }
                this.getSearchCountText();
                this.hightlightSearchedTexts(this.searchPageIndex);
            }
        }
        const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + this.searchPageIndex + '_' + this.searchIndex);
        if (!isNullOrUndefined(element)) {
            this.scrollToSearch(element);
        }
    }

    private scrollToSearch(element: HTMLElement): void {
        const scrollPoint: any = { y: -100, x: -100 };
        const isScroll: boolean = this.isScrollPages(element);
        if (isScroll) {
            this.scrollToSearchStr(element, scrollPoint);
        }
    }

    private isScrollPages(childEle: HTMLElement): boolean {
        const parentRect: ClientRect = this.pdfViewer.element.getBoundingClientRect();
        const childRect: ClientRect = childEle.getBoundingClientRect();
        const toolbarHeight: number = (this.pdfViewer.enableToolbar && !isNullOrUndefined(this.pdfViewer.toolbarModule))
            ? this.pdfViewer.toolbar.toolbarElement.getBoundingClientRect().height : 0;
        const isScroll: boolean = childRect.top >= (parentRect.top + toolbarHeight) &&
        childRect.left >= parentRect.left && childRect.bottom <= parentRect.bottom &&
        (childRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) &&
        childRect.right <= parentRect.right;
        return !isScroll;
    }

    private findPreviousPageWithText(): any {
        const currentPageIndex: number = this.searchPageIndex;
        for (let i: number = 1; i < this.pdfViewerBase.pageCount; i++) {
            let prevPageIndex: any = (currentPageIndex - i + this.pdfViewerBase.pageCount) % this.pdfViewerBase.pageCount;
            if (this.searchMatches[parseInt(prevPageIndex.toString(), 10)] &&
                this.searchMatches[parseInt(prevPageIndex.toString(), 10)].length > 0) {
                if (this.searchedOccurrences.length === this.searchCount) {
                    prevPageIndex = 0;
                    return prevPageIndex;
                }
                return prevPageIndex;
            }
        }
        return currentPageIndex;
    }

    private initSearch(pageIndex: number, isSinglePageSearch: boolean, isCount?: boolean): void {
        const storedData: any = this.pdfViewerBase.getStoredData(pageIndex, true);
        let pageText: string = null;
        let textContents: string[] = null;
        let characterBounds: any[] = null;
        if (isCount) {
            if (this.documentTextCollection.length !== 0) {
                const documentIndex: any = this.
                    documentTextCollection[parseInt(pageIndex.toString(), 10)][parseInt(pageIndex.toString(), 10)];
                const pageTextData: string = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                if (this.documentTextCollection[parseInt(pageIndex.toString(), 10)] && documentIndex) {
                    this.getSearchTextContent(pageIndex, this.searchString, pageTextData, textContents,
                                              isSinglePageSearch, this.documentTextCollection[parseInt(pageIndex.toString(), 10)]);
                }
            }
        } else {
            if (storedData) {
                pageText = storedData['pageText'];
                textContents = storedData['textContent'];
                characterBounds = this.pdfViewerBase.textLayer.characterBound[parseInt(pageIndex.toString(), 10)];
                this.textContents[parseInt(pageIndex.toString(), 10)] = textContents;
                this.getPossibleMatches(pageIndex, this.searchString, pageText, textContents, isSinglePageSearch, characterBounds);
                this.getSearchCountText();
            } else {
                if (!isSinglePageSearch && !isNullOrUndefined(pageIndex)) {
                    this.createRequestForSearch(pageIndex);
                }
            }
        }
    }

    private getPossibleMatches(pageIndex: number, searchString: string, pageString: string, textContents: string[],
                               isSinglePageSearch: boolean, characterBounds: any[]): void {
        if (/[’']/g.test(searchString)) {
            pageString = this.normalizeForSearch(pageString);
            searchString = this.normalizeForSearch(searchString);
        }
        let arrayReturns: any;
        let pageText: string = pageString;
        let searchText: string = searchString;
        let multiSearch: string = (pageText.replace((/(\s\r\n)/gm), ' ')).replace((/(\r\n)/gm), ' ');
        let Multiline: string = (pageString.replace((/(\s\r\n)/gm), '  ')).replace((/(\r\n)/gm), ' ');
        let specialCharcterSearch: string = multiSearch.replace(/[^a-zA-Z0-9]+/g, ' ');
        const queryLength: number = searchString.length;
        if (!this.isMatchCase) {
            searchText = searchString.toLowerCase();
            pageText = pageString.toLowerCase();
            multiSearch = multiSearch.toLowerCase();
            Multiline = Multiline.toLowerCase();
            specialCharcterSearch = specialCharcterSearch.toLowerCase();
        }
        const matches: any[] = [];
        const matchedArray: number[] = [];
        let matchIndex: number = -queryLength;
        let newIndex: number = -queryLength;
        let multiSearchIndex: number = -queryLength;
        let MultilineIndex: number = -queryLength;
        let specialcharcterIndex: number = -queryLength;
        while (matchIndex !== 0 || matchIndex === 0) {
            if (searchText === '' || searchText === ' ' || !searchText) {
                break;
            }
            if (this.isExactMatch) {
                let match: RegExpExecArray;
                // eslint-disable-next-line
                const escapedInputString: string = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                // eslint-disable-next-line
                const regex: RegExp = new RegExp(`(?<!\\w)${escapedInputString}(?!\\w)`, 'g');
                match = regex.exec(pageText);
                while (match !== null) {
                    matches.push(match.index);
                    match = regex.exec(pageText);
                }
                break;
            }
            matchIndex = pageText.indexOf(searchText, matchIndex + queryLength);
            const textSearch: string = pageString.substring(0, matchIndex);
            let unicodeLength: number = 0;
            // eslint-disable-next-line
            if (!this.isMatchCase && (/[^\u0000-\u007F]/.test(pageString)) && matchIndex !== -1) {
                const textLength: number = pageText.substring(0, matchIndex + queryLength).length;
                const unicodeSplitLength: number = pageText.substring(0, matchIndex + queryLength).
                    replace(/[\u0300-\u036f]/g, '').length;
                unicodeLength = textLength - unicodeSplitLength;
                matchIndex = matchIndex - unicodeLength;
            }
            if (searchText.indexOf(' ') !== -1) {
                const newString: string = searchString.replace(' ', '\r\n');
                newIndex = pageText.indexOf(newString, newIndex + queryLength);
                newIndex = -1;
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
            if (unicodeLength > 0) {
                matchIndex = matchIndex + unicodeLength;
            }
        }
        if (matches.length === 0) {
            multiSearchIndex = multiSearch.indexOf(searchText, multiSearchIndex + queryLength);
            MultilineIndex = Multiline.indexOf(searchText, MultilineIndex + queryLength);
            specialcharcterIndex = specialCharcterSearch.indexOf(searchText, specialcharcterIndex + queryLength);
            if (multiSearchIndex !== -1) {
                arrayReturns = this.correctLinetext(searchString, matchIndex, pageText, multiSearchIndex);
                matchIndex = -arrayReturns[0].length;
                for (let i: number = 0; i < arrayReturns.length; i++) {
                    matchIndex = pageText.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(), multiSearchIndex);
                    matchedArray.push(matchIndex);
                    if (matchedArray.length > 1) {
                        if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                            matches.push(matchedArray);
                            this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                        }
                        else {
                            i = -1;
                            matchIndex = matchedArray[0] + arrayReturns[0].length;
                            matchedArray.splice(0, matchedArray.length);

                        }
                    }
                }
            }
            else if (specialcharcterIndex !== -1) {
                arrayReturns = this.correctLinetext(searchString, matchIndex, pageText);
                matchIndex = -arrayReturns[0].length;
                for (let i: number = 0; i < arrayReturns.length; i++) {
                    matchIndex = pageText.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(),
                                                  matchIndex + (arrayReturns[i - 1] === undefined ||
                            null ? arrayReturns[0].length : arrayReturns[i - 1].length));
                    matchedArray.push(matchIndex);
                    if (matchedArray.length > 1) {
                        if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                            matches.push(matchedArray);
                            this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                        }
                        else {
                            i = -1;
                            matchIndex = matchedArray[0] + arrayReturns[0].length;
                            matchedArray.splice(0, matchedArray.length);

                        }
                    }
                }
            }
            else if (MultilineIndex !== -1) {
                arrayReturns = this.correctLinetext(searchString, matchIndex, pageText);
                matchIndex = -arrayReturns[0].length;

                for (let i: number = 0; i < arrayReturns.length; i++) {
                    matchIndex = pageText.indexOf(arrayReturns[parseInt(i.toString(), 10)].trim(),
                                                  matchIndex + (arrayReturns[i - 1] === undefined ||
                            null ? arrayReturns[0].length : arrayReturns[i - 1].length));
                    matchedArray.push(matchIndex);
                    if (matchedArray.length > 1) {
                        if ((matchedArray[1] - (matchedArray[0] + arrayReturns[0].length)) <= 3) {
                            matches.push(matchedArray);
                            this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
                        } else {
                            i = -1;
                            matchIndex = matchedArray[0] + arrayReturns[0].length;
                            matchedArray.splice(0, matchedArray.length);

                        }
                    }

                }

            }
            if (matches.length > 1) {
                matches.splice(1, matches.length);
            }
        }
        if (this.searchMatches && matches.length > 0) {
            this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
        }
        if (!isSinglePageSearch) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                this.searchedPages.push(pageIndex);
                this.startIndex = this.searchedPages[0];
            }
            this.updateSearchInputIcon(false);
        }
        if (this.searchMatches && this.searchMatches[parseInt(pageIndex.toString(), 10)] &&
            this.searchMatches[parseInt(pageIndex.toString(), 10)].length !== 0) {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchIndex = this.searchMatches[parseInt(pageIndex.toString(), 10)].length - 1;
                }
                if ((this.pdfViewerBase.currentPageNumber - 1) !== this.searchPageIndex) {
                    if (this.searchMatches.length > 0 && (this.searchIndex === -1) &&
                        (this.searchPageIndex) === this.currentSearchIndex) {
                        if (!this.isMessagePopupOpened && !this.isSearchText) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.getSearchPage(this.pdfViewerBase.currentPageNumber - 1);
                        this.searchedPages = [this.searchPageIndex];
                    }
                    else if (this.isPrevSearch && this.searchMatches && this.searchMatches.length > 0 &&
                        (this.searchMatches[this.searchPageIndex] && this.searchMatches[this.searchPageIndex].length > 0) &&
                        this.searchedPages.length === this.pdfViewerBase.pageCount && this.startIndex - 1 === this.searchPageIndex) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchedPages = [this.startIndex];
                    }
                    else if (searchTextCollection[0] === this.searchPageIndex && this.areAllOccurencesSearched()) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                    }
                }
                else if (this.searchMatches && (this.searchMatches[this.searchPageIndex] &&
                    this.searchMatches[this.searchPageIndex].length > 0) &&
                    this.searchedPages.length === this.pdfViewerBase.pageCount &&
                    this.startIndex === this.searchPageIndex && this.pdfViewerBase.pageCount > 1) {
                    if (!this.isMessagePopupOpened) {
                        this.onMessageBoxOpen();
                    }
                    this.searchedPages = [this.startIndex];
                }
            }
            this.highlightSearchedTexts(pageIndex, isSinglePageSearch, arrayReturns);
        } else {
            if (!isSinglePageSearch) {
                if (this.isPrevSearch) {
                    this.searchPageIndex = ((this.searchPageIndex - 1) < 0) ? (this.pdfViewerBase.pageCount - 1) : this.searchPageIndex - 1;
                } else {
                    this.searchPageIndex = ((this.searchPageIndex + 1) < this.pdfViewerBase.pageCount) ? (this.searchPageIndex + 1) : 0;
                }
                if (this.searchedPages.indexOf(this.searchPageIndex) === -1 && this.searchedPages.length !== this.pdfViewerBase.pageCount) {
                    this.showLoadingIndicator(true);
                    this.searchPageIndex = this.findNextPageWithText(this.searchPageIndex, true);
                    this.initSearch(this.searchPageIndex, false);
                } else {
                    const searchPageIndex: number = this.getSearchPage(pageIndex);
                    if (this.searchMatches && isNullOrUndefined(this.searchMatches[this.searchPageIndex]) &&
                        this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.pdfViewerBase.updateScrollTop(this.startIndex);
                    } else if (this.searchMatches && this.searchMatches.length > 0 && (this.searchIndex === 0 ||
                        this.searchIndex === -1) && (searchPageIndex) === this.currentSearchIndex) {
                        if (this.isPrevSearch) {
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
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch, undefined);
                    } else if (this.searchMatches && (this.searchMatches[this.searchPageIndex] &&
                        this.searchMatches[this.searchPageIndex].length > 0) &&
                        this.searchedPages.length === this.pdfViewerBase.pageCount) {
                        if (!this.isMessagePopupOpened) {
                            this.onMessageBoxOpen();
                        }
                        this.searchPageIndex = this.startIndex;
                        this.searchedPages = [this.searchPageIndex];
                        this.searchIndex = 0;
                        this.pdfViewerBase.updateScrollTop(this.startIndex);
                        this.highlightSearchedTexts(this.searchPageIndex, isSinglePageSearch, undefined);
                    }
                }
            }
        }
    }

    private correctLinetext(searchString: string, matchIndex: number, pageText: string, multiSearchIndex?: number): string[] {
        const indiuvalLineArray: string[] = [];
        if (/[’']/g.test(searchString)) {
            pageText = this.normalizeForSearch(pageText);
            searchString = this.normalizeForSearch(searchString);
        }
        let searchArray: string[] = searchString.split(/[" "]+/);
        if (!this.isMatchCase) {
            searchArray = searchString.toLowerCase().split(/\s+/);
        }
        matchIndex = multiSearchIndex || 0;
        let linestring: string = '';
        let mergedText: string = pageText.replace(/ \r\n/g, ' ');
        mergedText = mergedText.replace(/\r\n/g, ' ');
        if (/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/.test(mergedText)) {
            mergedText = mergedText.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
        }
        mergedText = mergedText.replace(/[^a-zA-Z0-9 ]/g, '');
        searchString = searchString.replace(/[^a-zA-Z0-9 ]/g, '');
        let result: any = mergedText.match(searchString);
        if (!this.isMatchCase) {
            result = mergedText.match(searchString.toLowerCase());
        }
        if (isNullOrUndefined(result)) {
            return indiuvalLineArray;
        } else {
            result = pageText.slice(result.index, pageText.length);
        }
        let pageCheck: any = result;
        for (let i: number = 0; i < searchArray.length; i++) {
            const searchArrayText: string = linestring + searchArray[parseInt(i.toString(), 10)];
            matchIndex = pageText.indexOf(searchArrayText, matchIndex);
            pageCheck = pageCheck ? pageCheck.replace(searchArray[i - 1], '') : pageText.replace(searchArray[i - 1], '');
            if ((pageCheck[pageCheck.indexOf(searchArray[parseInt(i.toString(), 10)]) - 1] === '\n' && (pageCheck[pageCheck.indexOf(searchArray[i + 1]) - 1]) === '\n') || (pageCheck[pageCheck.indexOf(searchArray[parseInt(i.toString(), 10)]) - 1] === '\n' && isNullOrUndefined((pageCheck[pageCheck.indexOf(searchArray[i + 1]) - 1])))) {
                matchIndex = -1;
                if (linestring === '') {
                    linestring = searchArray[parseInt(i.toString(), 10)];
                    i = i + 1;
                }
            }
            if (matchIndex !== -1) {
                linestring += searchArray[parseInt(i.toString(), 10)] + ' ';
                if (i === (searchArray.length - 1)) {
                    indiuvalLineArray.push(linestring);
                }
            }
            else {
                indiuvalLineArray.push(linestring);
                linestring = searchArray[parseInt(i.toString(), 10)] + ' ';
                if (pageCheck[pageCheck.indexOf(searchArray[parseInt(i.toString(), 10)]) - 1] === '\n' && pageCheck[pageCheck.indexOf(searchArray[i + 1]) - 1] === '\n') {
                    indiuvalLineArray.push(linestring);
                    linestring = searchArray[i + 1] + ' ';
                    pageCheck = pageCheck ? pageCheck.replace(searchArray[i - 1], '') : pageText.replace(searchArray[i - 1], '');
                    i = i + 1;
                }
                if (i === (searchArray.length - 1)) {
                    indiuvalLineArray.push(linestring);
                }
            }
        }
        return indiuvalLineArray;
    }

    private getSearchTextContent(pageIndex: number, searchString: string, pageString: string, textContents: string[],
                                 isSinglePageSearch: boolean, characterBounds: any[]): void {
        let pageText: string = pageString;
        let searchText: string = searchString;
        if (/[’']/g.test(searchString)) {
            pageString = this.normalizeForSearch(pageString);
            searchString = this.normalizeForSearch(searchString);
        }
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
        if (this.searchMatches && matches.length > 0) {
            this.searchMatches[parseInt(pageIndex.toString(), 10)] = matches;
        }
    }

    private getSearchPage(pageIndex: number): number {
        let pageNumber: number = null;
        if (this.isPrevSearch) {
            for (let i: number = pageIndex; i >= 0; i--) {
                if (i !== pageIndex && this.searchMatches[parseInt(i.toString(), 10)]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                for (let j: number = this.pdfViewerBase.pageCount - 1; j > pageIndex; j--) {
                    if (this.searchMatches[parseInt(j.toString(), 10)]) {
                        pageNumber = j;
                        break;
                    }
                }
            }
        } else {
            for (let i: number = pageIndex; i < this.pdfViewerBase.pageCount; i++) {
                if (i !== pageIndex && this.searchMatches[parseInt(i.toString(), 10)]) {
                    pageNumber = i;
                    break;
                }
            }
            if (!pageNumber) {
                if (pageIndex === 0) {
                    pageNumber = pageIndex;
                } else {
                    for (let j: number = 0; j < pageIndex; j++) {
                        if (this.searchMatches[parseInt(j.toString(), 10)]) {
                            pageNumber = j;
                            break;
                        }
                    }
                }
            }
        }
        return pageNumber;
    }

    private areAllNonEmptyPagesSearched(): boolean {
        const nonEmptyPages: number[] = [];
        for (let i: number = 0; i < this.searchMatches.length; i++) {
            if (this.searchMatches[parseInt(i.toString(), 10)] && this.searchMatches[parseInt(i.toString(), 10)].length > 0) {
                nonEmptyPages.push(i);
            }
        }
        for (const pageIndex of nonEmptyPages) {
            if (this.searchedPages.indexOf(pageIndex) === -1) {
                return false;
            }
        }
        return true;
    }

    private areAllOccurencesSearched(): boolean {
        return this.searchedOccurrences.length === this.searchCount;
    }

    private highlightSearchedTexts(pageIndex: number, isSinglePageSearch: boolean, ArrayReturns: any): void {
        const matches: any[] = this.searchMatches[parseInt(pageIndex.toString(), 10)];
        const scrollPoint: any = { y: -100, x: -100 };
        let className: string;
        const searchingText: string = this.searchString;
        const characterBounds: any[] = this.pdfViewerBase.textLayer.characterBound[parseInt(pageIndex.toString(), 10)];
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
                if (matches[parseInt(i.toString(), 10)].length !== undefined && ArrayReturns !== undefined) {
                    if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                        for (let j: number = 0; j < ArrayReturns.length; j++) {
                            className = 'e-pv-search-text-highlight';
                            this.addDivForSearch(i, pageIndex, characterBounds, (ArrayReturns[parseInt(j.toString(), 10)].trim()).length,
                                                 className, j);
                        }
                    } else {
                        for (let j: number = 0; j < ArrayReturns.length; j++) {
                            className = 'e-pv-search-text-highlightother';
                            this.addDivForSearch(i, pageIndex, characterBounds, (ArrayReturns[parseInt(j.toString(), 10)].trim()).length,
                                                 className, j);
                        }
                    }
                }
                else if (i === this.searchIndex && pageIndex === this.searchPageIndex) {
                    className = 'e-pv-search-text-highlight';
                } else {
                    className = 'e-pv-search-text-highlightother';
                }
                if (isNullOrUndefined(matches[parseInt(i.toString(), 10)].length)) {
                    this.addDivForSearch(i, pageIndex, characterBounds, this.searchString.length, className, undefined);
                }
            }
            this.searchString = searchingText;
            if (pageIndex === this.searchPageIndex && !isSinglePageSearch) {
                const element: HTMLElement = this.pdfViewerBase.getElement('_searchtext_' + pageIndex + '_' + this.searchIndex);
                if (element) {
                    const targetScrollElement: HTMLElement = this.getScrollElement(element);
                    const isScroll: boolean = this.isScrollPages(targetScrollElement);
                    if (isScroll) {
                        this.scrollToSearchStr(element, scrollPoint);
                    }
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

    private addDivForSearch(index: number, pageIndex: number, characterBounds: any, queryLength: number,
                            className: string, nestedIndex: any): void {
        const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
        if (isNullOrUndefined(textLayer) && className === 'e-pv-search-text-highlight') {
            if (this.pdfViewer.navigation) {
                this.pdfViewer.navigation.goToPage(pageIndex + 1);
            }
        }
        let count: number;
        if (this.searchMatches[parseInt(pageIndex.toString(), 10)][parseInt(index.toString(), 10)].length !== undefined) {
            count = this.searchMatches[parseInt(pageIndex.toString(), 10)][parseInt(index.toString(), 10)][`${nestedIndex}`];
        } else {
            count = this.searchMatches[parseInt(pageIndex.toString(), 10)][parseInt(index.toString(), 10)];
        }
        const initial: number = count;
        let divCount: number = 0;
        while (count < initial + queryLength) {
            count = this.addDivElement(count, characterBounds, queryLength, className, index, pageIndex, initial, divCount, nestedIndex);
            divCount++;
        }
        if (className === 'e-pv-search-text-highlight') {
            this.showLoadingIndicator(false);
        }
    }

    private addDivElement(count: number, characterBounds: any, queryLength: number, className: string,
                          index: number, pageIndex: number, initial: number, divCount: number, nestedIndex: any): number {
        let height: number = 0;
        let width: number = 0;
        let top: number = 0;
        let left: number = 0;
        let isRTL: boolean = false;
        let charRotation: number = 0;
        if (characterBounds[parseInt(count.toString(), 10)]) {
            left = characterBounds[parseInt(count.toString(), 10)].X;
            top = characterBounds[parseInt(count.toString(), 10)].Y;
            charRotation = characterBounds[parseInt(count.toString(), 10)].Rotation;
        }
        let v: number = 0;
        if ((count - initial) !== 0) {
            v = count - initial;
            queryLength += 1;
        }
        // eslint-disable-next-line
        for (v = v; v < queryLength; v++) {
            if (characterBounds[parseInt(count.toString(), 10)]) {
                const charBound: any = characterBounds[parseInt(count.toString(), 10)];
                if (charBound.Width !== 0 && left > charBound.X + charBound.Width) {
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
                const storedData: any = this.pdfViewerBase.clientSideRendering ?
                    this.pdfViewerBase.getLinkInformation(pageIndex, true) : this.pdfViewerBase.getStoredData(pageIndex, true);
                let pageText: string = null;
                if (storedData) {
                    pageText = storedData['pageText'];
                } else if (this.pdfViewer.isExtractText && this.documentTextCollection.length !== 0) {
                    const documentIndex: any =
                        this.documentTextCollection[parseInt(pageIndex.toString(), 10)][parseInt(pageIndex.toString(), 10)];
                    pageText = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                }
                if (characterBounds[parseInt(count.toString(), 10)]) {
                    if (pageText && (pageText[parseInt(count.toString(), 10)] === '' || pageText[parseInt(count.toString(), 10)] === ' ' || pageText[parseInt(count.toString(), 10)] === '\r' || pageText[parseInt(count.toString(), 10)] === '\n') && (characterBounds[parseInt(count.toString(), 10)].Width) === 0) {
                        width = (characterBounds[count - 1].X - left) + characterBounds[count - 1].Width;
                    }
                    else if ((characterBounds[parseInt(count.toString(), 10)].Text === '' ||
                        characterBounds[parseInt(count.toString(), 10)].Text === ' ' ||
                        characterBounds[parseInt(count.toString(), 10)].Text === '\r' ||
                        characterBounds[parseInt(count.toString(), 10)].Text === '\n') &&
                        ((characterBounds[parseInt(count.toString(), 10)].Width) === 0)) {
                        width = (characterBounds[count - 1].X - left) + characterBounds[count - 1].Width;
                    }
                    else {
                        width = (characterBounds[parseInt(count.toString(), 10)].X - left);
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
            width = characterBounds[parseInt(initial.toString(), 10)].X - characterBounds[(initial + queryLength) - 1].X;
            top = (top < charBound.Y) ? top : charBound.Y;
            const topDifference: number = (top < charBound.Y) ? (charBound.Y - top) : (top - charBound.Y);
            height = (height > (topDifference + charBound.Height)) ? height : (topDifference + charBound.Height);
            //some RTL character calculated width is zero and width difference value calculated from Y possition difference in the same line.
            let widthDifference: number = initial > 0 ? characterBounds[initial - 1].Y
                - characterBounds[parseInt(initial.toString(), 10)].Y : 0;
            for (let j: number = (initial + queryLength) - 1; j >= initial; j--) {
                charBound = characterBounds[parseInt(j.toString(), 10)];
                if (charBound.Width === 0) {
                    widthDifference = charBound.Y - characterBounds[j - 1].Y;
                }
            }
            width = width + widthDifference;
        }
        this.createSearchTextDiv(index, pageIndex, height, width, top, left, className, isContinuation, divCount, nestedIndex,
                                 charRotation);
        return count;
    }

    private createSearchTextDiv(index: number, pageIndex: number, height: number, width: number,
                                top: number, left: number, className: string, isContinuation: boolean,
                                divCount: number, nestedIndex: any, charRotation?: number): void {
        let idString: string = '_searchtext_' + pageIndex + '_' + index;
        if (isContinuation) {
            idString += '_' + divCount;
        }
        const nestedElement: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-pv-search-text-highlight') as HTMLCollectionOf<HTMLElement>;
        if (nestedIndex !== undefined && this.pdfViewerBase.getElement(idString) && !nestedElement[parseInt(nestedIndex.toString(), 10)]) {
            const textDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + idString + '_' + nestedIndex });
            const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
            this.calculateBounds(textDiv, height, width, top, left, pageDetails, charRotation);
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                const bounds: RectangleBoundsModel = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            } else if (className === 'e-pv-search-text-highlightother') {
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
            const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
            this.calculateBounds(textDiv, height, width, top, left, pageDetails);
            textDiv.classList.add(className);
            if (className === 'e-pv-search-text-highlight') {
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchHighlightColor === '') ? '#fdd835' : this.pdfViewer.textSearchColorSettings.searchHighlightColor;
                const bounds: RectangleBoundsModel = { left: left, top: top, width: width, height: height };
                this.pdfViewer.fireTextSearchHighlight(this.searchString, this.isMatchCase, bounds, (pageIndex + 1));
            } else if (className === 'e-pv-search-text-highlightother') {
                textDiv.style.backgroundColor = (this.pdfViewer.textSearchColorSettings.searchColor === '') ? '#8b4c12' : this.pdfViewer.textSearchColorSettings.searchColor;
            }
            const textLayer: HTMLElement = this.pdfViewerBase.getElement('_textLayer_' + pageIndex);
            textDiv.style.zIndex = this.searchTextDivzIndex;
            if (textLayer) {
                textLayer.appendChild(textDiv);
            }
        }
    }

    private calculateBounds(textDiv: HTMLElement, height: number, width: number, top: number, left: number, pageDetails: any,
                            charRotation?: number): void {
        if (pageDetails.rotation === 0 || pageDetails.rotation === 4 || pageDetails.rotation === 2) {
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
            if (charRotation === 270) {
                textDiv.style.height = height * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.width = width * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.left = left * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.top = top * this.pdfViewerBase.getZoomFactor() + 'px';
            }
            else {
                textDiv.style.height = width * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.width = height * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.top = left * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.left = (pageDetails.height - top - height) * this.pdfViewerBase.getZoomFactor() + 'px';
            }
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
            if (this.tempElementStorage[parseInt(j.toString(), 10)].classString) {
                if (this.tempElementStorage[parseInt(j.toString(), 10)].classString === 'e-pv-search-text-highlight' || this.tempElementStorage[parseInt(j.toString(), 10)].classString === 'e-pv-search-text-highlightother') {
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
                if ((element.childNodes[parseInt(i.toString(), 10)] as HTMLElement).classList) {
                    if ((element.childNodes[parseInt(i.toString(), 10)] as HTMLElement).classList.contains('e-pv-search-text-highlight')) {
                        targetElement = element.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
                    }
                }
            }
        }
        return targetElement;
    }

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
     * @param {number} pageIndex - It describes about the page index
     * @private
     * @returns {void}
     */
    public resizeSearchElements(pageIndex: number): void {
        const searchDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_' + pageIndex + '"]');
        for (let i: number = 0; i < searchDivs.length; i++) {
            const textDiv: HTMLElement = searchDivs[parseInt(i.toString(), 10)] as HTMLElement;
            let previousZoomFactor: number = 1;
            if (this.pdfViewer.magnificationModule) {
                previousZoomFactor = this.pdfViewer.magnificationModule.previousZoomFactor;
            }
            const outputdata: string = pageIndex + '_' + previousZoomFactor + '_' + this.pdfViewerBase.getZoomFactor();
            if (textDiv.getAttribute('name') !== outputdata) {
                textDiv.style.width = (parseFloat(textDiv.style.width) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.height = (parseFloat(textDiv.style.height) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.top = (parseFloat(textDiv.style.top) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.style.left = (parseFloat(textDiv.style.left) / previousZoomFactor) * this.pdfViewerBase.getZoomFactor() + 'px';
                textDiv.setAttribute('name', outputdata);
            }
        }
    }

    /**
     * @param {number} pageNumber - It describes about the page number
     * @private
     * @returns {void}
     */
    public highlightOtherOccurrences(pageNumber: number): void {
        this.initSearch(pageNumber, true);
    }

    private highlightOthers(isSearched?: boolean): void {
        const indexes: { [key: string]: object } = this.getIndexes();
        const lowerPageValue: number = parseFloat(indexes.lowerPageValue.toString());
        const higherPageValue: number = parseFloat(indexes.higherPageValue.toString());
        for (let i: number = lowerPageValue; i <= higherPageValue; i++) {
            if (this.searchMatches[parseInt(i.toString(), 10)] &&
                this.searchMatches[parseInt(i.toString(), 10)].length > 0) {
                this.highlightOtherOccurrences(i);
            }
        }
        if (isSearched) {
            this.showLoadingIndicator(false);
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public clearAllOccurrences(): void {
        const searchTextDivs: NodeList = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_searchtext_"]');
        for (let i: number = 0; i < searchTextDivs.length; i++) {
            searchTextDivs[parseInt(i.toString(), 10)].parentElement.removeChild(searchTextDivs[parseInt(i.toString(), 10)]);
        }
    }

    /**
     * @private
     * @returns {any} - any
     */
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
     * @param {boolean} [cleardocumentCollection=false] - If true, clears the document text collection.
     * @returns {void}
     */
    public resetTextSearch(cleardocumentCollection: boolean = false): void {
        this.resetVariables();
        this.onTextSearchClose();
        this.searchPageIndex = null;
        this.searchIndex = 0;
        this.updateSearchInputIcon(true);
        this.enableNextButton(false);
        this.enablePrevButton(false);
        if (cleardocumentCollection) {
            this.documentTextCollection = [];
        }
        this.isTextRetrieved = false;
        this.isTextSearched = false;
        this.isSearchText = false;
        if (this.searchRequestHandler) {
            this.searchRequestHandler.clear();
        }
        this.searchCount = 0;
        this.searchString = '';
    }

    private onTextSearchClose(): void {
        this.isPrevSearch = false;
        this.isTextSearch = false;
        if (this.pdfViewerBase.pageCount > 0) {
            this.clearAllOccurrences();
        }
    }

    private createRequestForSearch(pageIndex: number): void {
        // eslint-disable-next-line
        const proxy: TextSearch = this;
        const viewPortWidth: number = 816;
        const viewPortHeight: number = this.pdfViewer.element.clientHeight;
        const pageWidth: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].width;
        const pageHeight: number = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)].height;
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
                const jsonObject: object = {
                    xCoordinate: x, yCoordinate: y, pageNumber: pageIndex, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, zoomFactor: proxy.pdfViewerBase.getZoomFactor(), tilecount: tileCount, action: 'Search', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId
                    , tileXCount: noTileX, tileYCount: noTileY
                };
                if (this.pdfViewerBase.jsonDocumentId) {
                    (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
                }
                const zoomFactor: number = this.pdfViewerBase.retrieveCurrentZoomFactor();
                this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
                this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderPages;
                this.searchRequestHandler.responseType = 'json';
                if (!this.pdfViewerBase.clientSideRendering) {
                    this.searchRequestHandler.send(jsonObject);
                }
                this.searchRequestHandler.onSuccess = function (result: any): void {
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
                            proxy.searchRequestOnSuccess(data, proxy, viewPortWidth, pageWidth,
                                                         isTileRendering, pageIndex, x, y, noTileX, noTileY);
                        }
                    }
                };
                this.searchRequestHandler.onFailure = function (result: any): void {
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                          this.pdfViewer.serverActionSettings.renderPages);
                };
                this.searchRequestHandler.onError = function (result: any): void {
                    proxy.pdfViewerBase.openNotificationPopup();
                    proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText,
                                                          this.pdfViewer.serverActionSettings.renderPages);
                };
                if (this.pdfViewerBase.clientSideRendering) {
                    const textDetailsId: string = this.pdfViewerBase.documentId + '_' + pageIndex + '_textDetails';
                    const isTextNeed: boolean = this.pdfViewerBase.pageTextDetails ? this.pdfViewerBase.pageTextDetails[`${textDetailsId}`] ? false : true : true;
                    const cropBoxRect: Rect = new Rect(0, 0, 0, 0);
                    const mediaBoxRect: Rect = new Rect(0, 0, 0, 0);
                    const currentPage: PdfPage = this.pdfViewer.pdfRenderer.loadedDocument.getPage(pageIndex);
                    if (currentPage && currentPage._pageDictionary && currentPage._pageDictionary._map &&
                        currentPage._pageDictionary._map.CropBox) {
                        [cropBoxRect.x, cropBoxRect.y, cropBoxRect.width, cropBoxRect.height] = currentPage._pageDictionary._map.CropBox;
                    }
                    if (currentPage && currentPage._pageDictionary && currentPage._pageDictionary._map &&
                        currentPage._pageDictionary._map.MediaBox) {
                        [mediaBoxRect.x, mediaBoxRect.y, mediaBoxRect.width, mediaBoxRect.height] =
                            currentPage._pageDictionary._map.MediaBox;
                    }
                    if (viewPortWidth >= pageWidth || !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        this.pdfViewerBase.pdfViewerRunner.addTask({
                            pageIndex: pageIndex,
                            message: 'renderPageSearch',
                            zoomFactor: proxy.pdfViewerBase.getZoomFactor(),
                            isTextNeed: isTextNeed,
                            textDetailsId: textDetailsId,
                            cropBoxRect: cropBoxRect,
                            mediaBoxRect: mediaBoxRect
                        }, TaskPriorityLevel.High);
                    } else {
                        this.pdfViewerBase.pdfViewerRunner.addTask({
                            pageIndex: pageIndex,
                            message: 'renderImageAsTileSearch',
                            zoomFactor: zoomFactor,
                            tileX: x,
                            tileY: y,
                            tileXCount: noTileX,
                            tileYCount: noTileY,
                            isTextNeed: isTextNeed,
                            textDetailsId: textDetailsId,
                            cropBoxRect: cropBoxRect,
                            mediaBoxRect: mediaBoxRect
                        }, TaskPriorityLevel.High);
                    }
                    this.pdfViewerBase.pdfViewerRunner.onMessage('imageRenderedSearch,renderTileImageSearch', function (event: any): void {
                        switch (event.data.message) {
                        case 'imageRenderedSearch':
                            if (event.data.message === 'imageRenderedSearch') {
                                const canvas: HTMLCanvasElement = document.createElement('canvas');
                                const { value, width, height, pageIndex } = event.data;
                                canvas.width = width;
                                canvas.height = height;
                                const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
                                const imageData: ImageData = canvasContext.createImageData(width, height);
                                imageData.data.set(value);
                                canvasContext.putImageData(imageData, 0, 0);
                                const imageUrl: string = canvas.toDataURL();
                                proxy.pdfViewerBase.releaseCanvas(canvas);
                                const textBounds: any = event.data.textBounds;
                                const textContent: any = event.data.textContent;
                                const pageText: any = event.data.pageText;
                                const rotation: any = event.data.rotation;
                                const characterBounds: any = event.data.characterBounds;
                                const hyperlinksDetails: any = proxy.pdfViewer.pdfRendererModule.getHyperlinks(pageIndex);
                                const data: any = ({
                                    image: imageUrl, pageNumber: pageIndex, uniqueId: proxy.pdfViewerBase.documentId,
                                    pageWidth: width, zoomFactor: event.data.zoomFactor, hyperlinks: hyperlinksDetails.hyperlinks,
                                    hyperlinkBounds: hyperlinksDetails.hyperlinkBounds,
                                    linkAnnotation: hyperlinksDetails.linkAnnotation, linkPage: hyperlinksDetails.linkPage,
                                    annotationLocation: hyperlinksDetails.annotationLocation, characterBounds: characterBounds
                                });
                                if (event.data.isTextNeed) {
                                    data.textBounds = textBounds;
                                    data.textContent = textContent;
                                    data.rotation = rotation;
                                    data.pageText = pageText;
                                    proxy.pdfViewerBase.storeTextDetails(pageIndex, textBounds, textContent, pageText,
                                                                         rotation, characterBounds);
                                } else {
                                    const textDetails: any = JSON.parse(proxy.pdfViewerBase.pageTextDetails[`${event.data.textDetailsId}`]);
                                    data.textBounds = textDetails.textBounds;
                                    data.textContent = textDetails.textContent;
                                    data.rotation = textDetails.rotation;
                                    data.pageText = textDetails.pageText;
                                    data.characterBounds = textDetails.characterBounds;
                                }
                                if (data && data.image && data.uniqueId === proxy.pdfViewerBase.documentId) {
                                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, data);
                                    const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                    const blobObj: string = proxy.pdfViewerBase.createBlobUrl(data.image.split('base64,')[1], 'image/png');
                                    const Url: any = URL || webkitURL;
                                    const blobUrl: string = Url.createObjectURL(blobObj);
                                    const storeObject: any = {
                                        image: blobUrl, width: data.pageWidth, uniqueId: data.uniqueId, zoomFactor: data.zoomFactor
                                    };
                                    proxy.pdfViewerBase.storeImageData(pageNumber, storeObject);
                                    proxy.searchRequestOnSuccess(data, proxy, viewPortWidth, pageWidth, isTileRendering,
                                                                 pageIndex, x, y, noTileX, noTileY);
                                }
                            }
                            break;
                        case 'renderTileImageSearch':
                            if (event.data.message === 'renderTileImageSearch') {
                                const canvas: HTMLCanvasElement = document.createElement('canvas');
                                const { value, w, h, noTileX, noTileY, x, y, pageIndex } = event.data;
                                canvas.setAttribute('height', h);
                                canvas.setAttribute('width', w);
                                canvas.width = w;
                                canvas.height = h;
                                const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d');
                                const imageData: any = canvasContext.createImageData(w, h);
                                imageData.data.set(value);
                                canvasContext.putImageData(imageData, 0, 0);
                                const imageUrl: string = canvas.toDataURL();
                                proxy.pdfViewerBase.releaseCanvas(canvas);
                                const tileWidth: number = w;
                                const tileHeight: number = h;
                                const textBounds: any = event.data.textBounds;
                                const textContent: any = event.data.textContent;
                                const pageText: any = event.data.pageText;
                                const rotation: any = event.data.rotation;
                                const characterBounds: any = event.data.characterBounds;
                                const tileData: any = {
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
                                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, tileData);
                                    const pageNumber: number = (tileData.pageNumber !== undefined) ? tileData.pageNumber : pageIndex;
                                    if (x === 0 && y === 0) {
                                        const blobObj: string = proxy.pdfViewerBase.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                        const Url: any = URL || webkitURL;
                                        const blobUrl: string = Url.createObjectURL(blobObj);
                                        const storeObject: any = {
                                            image: blobUrl, width: tileData.pageWidth, uniqueId: tileData.uniqueId,
                                            tileX: tileData.tileX, tileY: tileData.tileY,
                                            zoomFactor: tileData.zoomFactor,
                                            transformationMatrix: tileData.transformationMatrix
                                        };
                                        if (tileData.isTextNeed) {
                                            tileData.textBounds = textBounds;
                                            tileData.textContent = textContent;
                                            tileData.rotation = rotation;
                                            tileData.pageText = pageText;
                                            proxy.pdfViewerBase.storeTextDetails(pageIndex, textBounds, textContent, pageText,
                                                                                 rotation, characterBounds);
                                        } else {
                                            const textDetails: any = JSON.parse(proxy.pdfViewerBase.pageTextDetails[`${tileData.textDetailsId}`]);
                                            tileData.textBounds = textDetails.textBounds;
                                            tileData.textContent = textDetails.textContent;
                                            tileData.rotation = textDetails.rotation;
                                            tileData.pageText = textDetails.pageText;
                                            tileData.characterBounds = textDetails.characterBounds;
                                        }
                                        proxy.pdfViewerBase.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                    }
                                    else {
                                        const blobObj: string = proxy.pdfViewerBase.createBlobUrl(tileData.image.split('base64,')[1], 'image/png');
                                        const Url: any = URL || webkitURL;
                                        const blobUrl: string = Url.createObjectURL(blobObj);
                                        const storeObject: any = {
                                            image: blobUrl, width: tileData.width, uniqueId: tileData.uniqueId,
                                            tileX: tileData.tileX, tileY: tileData.tileY, zoomFactor: tileData.zoomFactor,
                                            transformationMatrix: tileData.transformationMatrix
                                        };
                                        proxy.pdfViewerBase.storeImageData(pageNumber, storeObject, tileData.tileX, tileData.tileY);
                                    }
                                    proxy.searchRequestOnSuccess(tileData, proxy, viewPortWidth, pageWidth,
                                                                 isTileRendering, pageIndex, x, y, noTileX, noTileY);
                                }
                            }
                            break;
                        }
                    });
                }

            }
        }
    }

    private searchRequestOnSuccess(data: any, proxy: TextSearch, viewPortWidth: number, pageWidth: number, isTileRendering: boolean,
                                   pageIndex: number, x: number, y: number, noTileX: number, noTileY: number): void {
        if (!isNullOrUndefined(data.pageText) && data.uniqueId === proxy.pdfViewerBase.documentId) {
            this.getSearchCountText();
            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderPages, data);
            const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
            if (viewPortWidth >= pageWidth) {
                proxy.pdfViewerBase.storeWinData(data, pageNumber);
            } else {
                proxy.pdfViewerBase.storeWinData(data, pageNumber, data.tileX, data.tileY);
            }
            if (!isTileRendering) {
                if (!this.isMessagePopupOpened) {
                    proxy.initSearch(pageIndex, false);
                }
            } else {
                if (x === (noTileX - 1) && y === (noTileY - 1)) {
                    if (!this.isMessagePopupOpened) {
                        proxy.initSearch(pageIndex, false);
                    }
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
     * @returns {void}
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
     * @param {number} startIndex - It describes about the start index
     * @param {number} endIndex - It describes about the end index
     * @private
     * @returns {void}
     */
    public createRequestForGetPdfTexts(startIndex: number, endIndex: number): void {
        // eslint-disable-next-line
        const proxy: TextSearch = this;
        const jsonObject: object = { pageStartIndex: startIndex, pageEndIndex: endIndex, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        this.searchRequestHandler = new AjaxHandler(this.pdfViewer);
        this.searchRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.renderTexts;
        this.searchRequestHandler.responseType = 'json';
        if (!this.pdfViewerBase.clientSideRendering) {
            this.searchRequestHandler.send(jsonObject);
        }
        this.searchRequestHandler.onSuccess = function (result: any): void {
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
        this.searchRequestHandler.onFailure = function (result: any): void {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        this.searchRequestHandler.onError = function (result: any): void {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, this.pdfViewer.serverActionSettings.renderTexts);
        };
        if (this.pdfViewerBase.clientSideRendering) {
            const requestType: string = 'pdfTextSearchRequest';
            this.pdfViewer.pdfRendererModule.getDocumentText(jsonObject, requestType);
        }
    }

    /**
     * @private
     * @param {any} data - It gets the data
     * @param {number} startIndex - It gets the starting index
     * @param {number} endIndex - It gets the ending index
     * @returns {void}
     */
    public pdfTextSearchRequestSuccess(data: any, startIndex: number, endIndex: number): void {
        this.pdfTextSearchRequestOnSuccess(data, this, startIndex, endIndex);
    }

    private pdfTextSearchRequestOnSuccess(data: any, proxy: TextSearch, startIndex: number, endIndex: number): void {
        if (data.documentTextCollection && data.uniqueId === proxy.pdfViewerBase.documentId) {
            if (!data.isNeedToRender) {
                proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.renderTexts, data);
                proxy.documentTextCollection = this.updateDocumentCollection(proxy.documentTextCollection, data.documentTextCollection);
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
                    proxy.pdfViewer.pdfRendererModule.documentTextCollection = [];
                    proxy.pdfViewer.fireTextExtractionCompleted(proxy.documentTextCollection);
                    if (proxy.isTextSearched && proxy.searchString.length > 0) {
                        proxy.textSearch(proxy.searchString);
                        proxy.isTextSearched = false;
                    }
                }
            }
        }
    }

    private updateDocumentCollection(textCollection: any, eventDataCollection: any): any {
        if (textCollection && textCollection.length > 0) {
            if (((this.pdfViewer as any).isVue) && !((this.pdfViewer as any).isVue3)) {
                textCollection = this.orderPdfTextCollections(JSON.parse(`[${JSON.stringify(textCollection).slice(1, -1)},${JSON.stringify(eventDataCollection).slice(1, -1)}]`));
            }
            else {
                textCollection = eventDataCollection.concat(textCollection);
                textCollection = this.orderPdfTextCollections(textCollection);
            }
        } else {
            if (((this.pdfViewer as any).isVue) && !((this.pdfViewer as any).isVue3)) {
                textCollection = JSON.parse(`[${JSON.stringify(eventDataCollection).slice(1, -1)}]`);
            }
            else {
                textCollection = eventDataCollection;
            }
        }
        return textCollection;
    }

    private orderPdfTextCollections(oldCollection: any): any {
        const annotationCollectionList: any = [];
        for (let i: number = 0; i < oldCollection.length; i++) {
            if (annotationCollectionList.length === 0) {
                annotationCollectionList.push(oldCollection[parseInt(i.toString(), 10)]);
            } else {
                if (parseInt(Object.keys(oldCollection[parseInt(i.toString(), 10)])[0], 10) >
                    parseInt(Object.keys(annotationCollectionList[annotationCollectionList.length - 1])[0], 10)) {
                    annotationCollectionList.push(oldCollection[parseInt(i.toString(), 10)]);
                } else {
                    for (let j: number = 0; j < annotationCollectionList.length; j++) {
                        if ((parseInt(Object.keys(oldCollection[parseInt(i.toString(), 10)])[0], 10) <
                            parseInt(Object.keys(annotationCollectionList[parseInt(j.toString(), 10)])[0], 10))) {
                            annotationCollectionList.splice(j, 0, oldCollection[parseInt(i.toString(), 10)]);
                            break;
                        }
                    }
                }
            }
        }
        return annotationCollectionList;
    }

    private createSearchBoxButtons(id: string, className: string): HTMLElement {
        const button: HTMLElement = createElement('button', { id: this.pdfViewer.element.id + '_' + id, className: 'e-btn e-icon-btn e-pv-text-search-btn ' + className });
        button.setAttribute('type', 'button');
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

    private checkBoxOnChange = (event: any): void => {
        if (event.checked) {
            this.isMatchCase = true;
            this.searchString = '';
            if ((this.searchInput as HTMLInputElement).value && (this.searchInput as HTMLInputElement).value !== '') {
                this.isTextSearch = true;
            }
        } else {
            this.isMatchCase = false;
            this.searchString = '';
            if ((this.searchInput as HTMLInputElement).value && (this.searchInput as HTMLInputElement).value !== '') {
                this.isTextSearch = true;
            }
        }
        if (this.isTextSearch && this.isDocumentTextCollectionReady) {
            this.resetVariables();
            this.clearAllOccurrences();
            const inputString: string = (this.searchInput as HTMLInputElement).value;
            this.searchIndex = 0;
            this.initiateTextSearch(inputString);
            if (this.searchCount === 0 && !this.isMessagePopupOpened) {
                this.onMessageBoxOpen();
            }
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public resetVariables(): void {
        this.searchedPages = [];
        this.searchMatches = [];
        this.searchedOccurrences = [];
    }

    public resetVariablesTextSearch(): void {
        this.getSearchTextDetails = {};
        this.isTextSearchHandled = false;
    }

    private searchKeypressHandler = (event: KeyboardEvent): void => {
        const char: string = String.fromCharCode(event.which || event.keyCode);
        const isAlphanumeric: boolean = /[a-zA-Z0-9]/.test(char);
        const isSpecialCharacter: (char: string) => boolean = (char: string): boolean => /[!@#$%^&*(),.?":{}|<>]/.test(char);
        if ((isAlphanumeric || isSpecialCharacter) && !(event.ctrlKey || event.altKey)) {
            this.initiateTextSearch((this.searchInput as HTMLInputElement).value);
            this.updateSearchInputIcon(false);
        } else {
            this.resetVariables();
        }
    };

    private searchClickHandler = (event: Event): void => {
        this.searchButtonClick(this.searchBtn, this.searchAutocompleteObj);
    };

    /**
     * @param {HTMLElement} element - It describes about the element
     * @param {HTMLElement} inputElement - It describes about the input element
     * @param {boolean} isMobileSearch - It indicates is mobile search or not
     * @private
     * @returns {void}
     */
    public searchButtonClick(element: HTMLElement, inputElement: AutoComplete | HTMLElement, isMobileSearch?: boolean): void {
        this.isMessagePopupOpened = false;
        if (element.classList.contains('e-pv-search-icon')) {
            this.initiateTextSearch((inputElement as HTMLInputElement).value as string, isMobileSearch);
        } else if (element.classList.contains('e-pv-search-close')) {
            this.showLoadingIndicator(false);
            (inputElement as HTMLInputElement).value = '';
            this.resetTextSearch();
            if (this.searchCountEle) {
                this.searchCountEle.innerHTML = '';
                this.adjustInputContainerWidth();
            }
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
        this.searchString = (this.searchInput as HTMLInputElement).value;
        this.nextSearch();
    };

    private prevButtonOnClick = (event: Event): void => {
        this.searchString = (this.searchInput as HTMLInputElement).value;
        this.prevSearch();
    };

    private onMessageBoxOpen(): void {
        this.pdfViewer.fireTextSearchComplete(this.searchString, this.isMatchCase);
        this.showLoadingIndicator(false);
        this.isMessagePopupOpened = true;
        if (this.pdfViewer.showNotificationDialog) {
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Nomatches');
                    promise.then((value: string) => {
                        this.pdfViewerBase.createNotificationPopup(value);
                    });
                } else {
                    if (this.searchMatches.length > 0) {
                        this.pdfViewerBase.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No More Matches'));
                    }
                    else {
                        this.pdfViewerBase.createNotificationPopup(this.pdfViewer.localeObj.getConstant('No Matches'));
                    }
                }
            } else {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_NoTextFound');
                    promise.then((value: string) => {
                        this.pdfViewerBase.navigationPane.createTooltipMobile(value);
                    });
                } else {
                    if (this.searchMatches.length > 0) {
                        this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No More Search Matches'));
                    }
                    else {
                        this.pdfViewerBase.navigationPane.createTooltipMobile(this.pdfViewer.localeObj.getConstant('No Search Matches'));
                    }
                }
            }
        }
        else {
            setTimeout(() => {
                this.isMessagePopupOpened = false;
            }, 100);
        }
        this.currentOccurrence = this.searchCount;
        this.isLastOccurrenceCompleted = true;
        if (this.currentOccurrence === this.searchCount) {
            this.currentOccurrence = 0;
        }
        if (this.searchCountEle && this.isSingleSearch) {
            this.getSearchCountText();
            this.adjustInputContainerWidth();
        }
        this.searchedPages = [];
        this.searchedOccurrences = [];
        this.searchIndex = 0;
        if (!this.programaticalSearch) {
            if (!this.isDocumentTextCollectionReady) {
                this.hightlightSearchedTexts(undefined, true, true);
            }
            else {
                this.highlightAfterComplete();
            }
        }
        this.searchString = '';
        this.searchPageIndex = this.startSearchPageIndex;
        if (isNullOrUndefined(this.searchPageIndex)) {
            this.pdfViewerBase.updateScrollTop(0);
        }
        else {
            this.pdfViewerBase.updateScrollTop(this.searchPageIndex);
        }
        this.showLoadingIndicator(false);
    }

    /**
     * @private
     * @returns {void}
     */
    public highlightAfterComplete(): void {
        for (let k: number = 0; k < this.searchMatches.length; k++) {
            if (this.searchMatches[parseInt(k.toString(), 10)] && this.searchMatches[parseInt(k.toString(), 10)].length > 0) {
                const matches: any = this.searchMatches[parseInt(k.toString(), 10)];
                const className: string = 'e-pv-search-text-highlightother';
                const characterBounds: any = this.pdfViewerBase.textLayer.characterBound[parseInt(k.toString(), 10)];
                if (characterBounds && matches !== undefined) {
                    for (let i: number = 0; i < matches.length; i++) {
                        if ((matches[parseInt(i.toString(), 10)].length)) {
                            const documentIndex: any = this.documentTextCollection[parseInt(k.toString(), 10)][parseInt(k.toString(), 10)];
                            let pageTextData: any = documentIndex.pageText ? documentIndex.pageText : documentIndex.PageText;
                            let searchString: string = (this.searchInput as HTMLInputElement).value;
                            if (!this.isMatchCase) {
                                searchString = searchString.toLowerCase();
                                pageTextData = pageTextData.toLowerCase();
                            }
                            const arrayReturns: any = this.correctLinetext(searchString, null, pageTextData);
                            for (let j: number = 0; j < arrayReturns.length; j++) {
                                let idString: string;
                                if (j === 0) {
                                    idString = '_searchtext_' + k + '_' + i;
                                }
                                else {
                                    idString = '_searchtext_' + k + '_' + i + '_' + j;
                                }
                                if (!this.pdfViewerBase.getElement(idString)) {
                                    this.addDivForSearch(i, k, characterBounds, (arrayReturns[parseInt(j.toString(), 10)].trim()).length,
                                                         className, j);
                                }
                            }
                        }
                        if (isNullOrUndefined(matches[parseInt(i.toString(), 10)].length)) {
                            this.addDivForSearch(i, k, characterBounds, (this.searchInput as HTMLInputElement).value.length, className,
                                                 undefined);
                        }
                    }
                }
            }
        }
    }

    /**
     * Searches the target text in the PDF document and highlights the occurrences in the pages.
     *
     * @param  {string} searchText - Specifies the searchText content
     * @param  {boolean} isMatchCase - If set true , its highlights the MatchCase content
     * @returns {void}
     */
    public searchText(searchText: string, isMatchCase: boolean): void {
        if (this.documentTextCollection.length === this.pdfViewerBase.pageCount) {
            this.isDocumentTextCollectionReady = true;
        }
        else {
            const updateInterval: any = setInterval(() => {
                if (this.documentTextCollection.length === this.pdfViewerBase.pageCount) {
                    clearInterval(updateInterval);
                    this.calculateSearchCount(searchText, this.documentTextCollection);
                    this.getSearchTextDetails = {};
                    this.isDocumentTextCollectionReady = true;
                }
            }, 1000);
        }
        if (this.isDocumentTextCollectionReady) {
            if (searchText && searchText.length > 0 && searchText[searchText.length - 1] === ' ') {
                searchText = searchText.slice(0, searchText.length - 1);
            }
            if (this.pdfViewer.enableHtmlSanitizer && searchText) {
                const sanitizedString: string = SanitizeHtmlHelper.sanitize(searchText);
                if (sanitizedString === searchText) {
                    searchText = sanitizedString;
                }
            }
            this.searchString = searchText;
            this.isMatchCase = isMatchCase;
            this.searchIndex = 0;
            this.programaticalSearch = true;
            this.isSingleSearch = true;
            this.isTextSearchHandled = false;
            this.calculateSearchCount(searchText, this.documentTextCollection);
            this.textSearch(searchText);
        }
        else {
            if (this.searchString !== searchText) {
                this.isSingleSearch = true;
                this.searchString = searchText;
                this.isMatchCase = isMatchCase;
                this.searchIndex = 0;
                this.searchCount = 0;
                this.searchPageIndex = 0;
                this.programaticalSearch = true;
                this.textSearchWhileLoading(searchText, isMatchCase);
            }
        }
    }

    /**
     * Searches the next occurrence of the searched text from the current occurrence of the PdfViewer.
     *
     * @returns {void}
     */
    public searchNext(): void {
        this.nextSearch();
    }

    /**
     * Searches the previous occurrence of the searched text from the current occurrence of the PdfViewer.
     *
     * @returns {void}
     */
    public searchPrevious(): void {
        this.prevSearch();
    }

    /**
     * Cancels the text search of the PdfViewer.
     *
     * @returns {void}
     */
    public cancelTextSearch(): void {
        this.resetTextSearch();
    }

    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.searchAutocompleteObj) {
            this.searchAutocompleteObj.destroy();
            this.searchAutocompleteObj = null;
        }
        if (this.matchAnyWordCheckBox) {
            this.matchAnyWordCheckBox.destroy();
            this.matchAnyWordCheckBox = null;
        }
        if (this.searchRequestHandler) {
            this.searchRequestHandler.clear();
            this.searchRequestHandler = null;
        }
        if (this.textSearchHandleRequest) {
            this.textSearchHandleRequest.clear();
            this.textSearchHandleRequest = null;
        }
        if (this.searchBox && this.searchBox.parentElement) {
            this.searchBox.parentElement.removeChild(this.searchBox);
        }
        this.searchBtn = null;
        this.searchInput = null;
        this.searchCountEle = null;
        this.searchInputContainer = null;
        this.searchBox = null;
        this.nextSearchBtn = null;
        this.prevSearchBtn = null;
        this.findTextDocumentCollection = null;
        this.textContents = null;
        this.multiSearchCounts = null;
        this.getSearchTextDetails = null;
        this.searchedPages = null;
        this.autompleteDataSource = null;
        this.searchedOccurrences = null;
        this.tempElementStorage = null;
        this.documentTextCollection = null;
        this.searchMatches = null;
    }

    /**
     * Searches for the specified text within the document and returns the bounding rectangles of the matched text. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for that page; otherwise, it returns the bounding rectangles for all pages in the document where the text was found.
     *
     * @param {string} searchText - The text string to search for.
     * @param {boolean} isMatchCase - If true, performs a case-sensitive search; otherwise, performs a case-insensitive search.
     * @param {number} [pageIndex] - Optional page index to limit the search to a specific page.
     * @returns {SearchResultModel[]} - An array of `SearchResult` objects, where each object contains the page index and an array of bounds representing the locations of the search text found on that page.
     */
    public findText(searchText: string, isMatchCase: boolean, pageIndex?: number): SearchResultModel[];
    /**
     * Searches for an array of strings within the document and returns the bounding rectangles for each occurrence. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for these search strings on that page; otherwise, it returns the bounding rectangles for all pages in the document where the strings were found.
     *
     * @param {string[]} searchText - An array of text strings to search for.
     * @param {boolean} isMatchCase - If true, performs a case-sensitive search; otherwise, performs a case-insensitive search.
     * @param {number} [pageIndex] - Optional page index to limit the search to a specific page.
     * @returns {Record<string, SearchResultModel[]>} - An object where each key is a search text string, and each value is an array of `SearchResult` objects. Each `SearchResult` object contains the page index and an array of bounds representing the locations of that search text on the corresponding page.
     */
    // eslint-disable-next-line max-len
    public findText(searchText: string[], isMatchCase: boolean, pageIndex?: number): Record<string, SearchResultModel[]>;
    /**
     * Searches for the specified text or an array of strings within the document and returns the bounding rectangles for each occurrence. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for these search strings on that page; otherwise, it returns the bounding rectangles for all pages in the document where the strings were found.
     *
     * @param  {string | string[]} searchText - Specifies the search text content. If an array is passed, it will search for multiple texts.
     * @param  {boolean} isMatchCase - If set to true, it will consider match case during the search.
     * @param  {number} [pageIndex] - Optional parameter to specify a particular page to search in the document.
     * @returns { Record<string, SearchResultModel[]> | SearchResultModel[]} - If `searchText` is a string, it returns an array of `SearchResult` objects, where each object contains the page index and an array of bounds representing the locations of the search text found on that page. If `searchText` is an array of strings, it returns an object where each key is a search text string, and each value is an array of `SearchResult` objects. Each `SearchResult` object contains the page index and an array of bounds representing the locations of that search text on the corresponding page.
     */
    public findText(searchText: string | string[], isMatchCase: boolean, pageIndex?: number
    ): Record<string, SearchResultModel[]> | SearchResultModel[] {
        this.isMatchCase = isMatchCase;
        const searchTerms: string[] = Array.isArray(searchText) ? searchText : [searchText];
        const searchResults: Record<string, SearchResultModel[]> = {};
        const startIndex: number = !isNullOrUndefined(pageIndex) ? pageIndex : 0;
        const endIndex: number = !isNullOrUndefined(pageIndex) ? pageIndex + 1 : this.documentTextCollection.length;
        const fetchTextCollection: any = (endIndex: number) =>
            this.documentTextCollection[parseInt(endIndex.toString(), 10)] ?
                this.documentTextCollection[parseInt(endIndex.toString(), 10)][parseInt(endIndex.toString(), 10)] : null;
        const documentTextCollection: any = fetchTextCollection(endIndex - 1);
        let findTextResult: any = [];
        if (documentTextCollection && documentTextCollection.TextData.length > 0 && !isNullOrUndefined(pageIndex)) {
            findTextResult = this.getSearchResults(searchText, searchTerms, searchResults, startIndex, endIndex,
                                                   this.documentTextCollection[parseInt(pageIndex.toString(), 10)]);
        } else if (documentTextCollection && documentTextCollection.TextData.length > 0) {
            findTextResult = this.getSearchResults(searchText, searchTerms, searchResults, startIndex, endIndex,
                                                   this.documentTextCollection);
        }
        return findTextResult;
    }

    /**
     * Searches for the specified text within the document and returns the bounding rectangles of the matched text. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for that page; otherwise, it returns the bounding rectangles for all pages in the document where the text was found.
     *
     * @param {string} searchText - The text string to search for.
     * @param {boolean} isMatchCase - If true, performs a case-sensitive search; otherwise, performs a case-insensitive search.
     * @param {number} [pageIndex] - Optional page index to limit the search to a specific page.
     * @returns {Promise<SearchResultModel[]>} -  A Promise that resolves to an array of `SearchResult` objects. Each object contains the page index and an array of bounds representing the locations of the search text found on that page.
     */
    public findTextAsync(searchText: string, isMatchCase: boolean, pageIndex?: number): Promise<SearchResultModel[]>;
    /**
     * Searches for an array of strings within the document and returns the bounding rectangles for each occurrence. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for these search strings on that page; otherwise, it returns the bounding rectangles for all pages in the document where the strings were found.
     *
     * @param {string[]} searchText - An array of text strings to search for.
     * @param {boolean} isMatchCase - If true, performs a case-sensitive search; otherwise, performs a case-insensitive search.
     * @param {number} [pageIndex] - Optional page index to limit the search to a specific page.
     * @returns {Promise<Record<string, SearchResultModel[]>>} -  A Promise that resolves to an object where each key is a search text string, and each value is an array of `SearchResult` objects. Each `SearchResult` object contains the page index and an array of bounds representing the locations of that search text on the corresponding page.
     */
    // eslint-disable-next-line max-len
    public findTextAsync(searchText: string[], isMatchCase: boolean, pageIndex?: number): Promise<Record<string, SearchResultModel[]>>;
    /**
     * Searches for the specified text or an array of strings within the document and returns the bounding rectangles for each occurrence. The search can be case-sensitive based on the provided parameters. If a specific page index is provided, it returns the bounding rectangles for these search strings on that page; otherwise, it returns the bounding rectangles for all pages in the document where the strings were found.
     *
     * @param  {string | string[]} searchText - Specifies the search text content. If an array is passed, it will search for multiple texts.
     * @param  {boolean} isMatchCase - If set to true, it will consider match case during the search.
     * @param  {number} [pageIndex] - Optional parameter to specify a particular page to search in the document.
     * @returns {Promise<SearchResultModel[] | Record<string, SearchResultModel[]>>} - If `searchText` is a string, the method returns a Promise that resolves to an array of `SearchResult` objects, where each object contains the page index and an array of bounds representing the locations of the search text found on that page. If `searchText` is an array of strings, it returns a Promise that resolves to an object, where each key is a search text string, and each value is an array of `SearchResult` objects. Each `SearchResult` object contains the page index and an array of bounds representing the locations of that search text on the corresponding page.
     */
    public findTextAsync(searchText: string | string[], isMatchCase: boolean, pageIndex?: number
    ): Promise<SearchResultModel[] | Record<string, SearchResultModel[]>> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const proxy: any = this;
        this.isMatchCase = isMatchCase;
        this.pdfViewer.pdfRenderer.searchResults = {};
        const searchTerms: string | string[] = Array.isArray(searchText) ? searchText : [searchText];
        const searchResults: any = {};
        const startIndex: number = pageIndex ? pageIndex : 0;
        const endIndex: number = !isNullOrUndefined(pageIndex) ? pageIndex + 1 : this.pdfViewerBase.pageCount;
        const jsonObject: object = { pageStartIndex: startIndex, pageEndIndex: endIndex, documentId: proxy.pdfViewerBase.getDocumentId(), hashId: proxy.pdfViewerBase.hashId, action: 'RenderPdfTexts', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            (jsonObject as any).documentId = this.pdfViewerBase.jsonDocumentId;
        }
        const requestType: string = 'pdfTextSearchRequest';
        if (this.pdfViewer.extractTextOption === ExtractTextOption.None ||
            this.pdfViewer.extractTextOption === ExtractTextOption.TextOnly ||
            isNullOrUndefined(this.documentTextCollection[endIndex as number])) {
            return new Promise((resolve: Function, reject: Function): void => {
                const processPage: any = (i: number, msg: string) => {
                    proxy.pdfViewerBase.pdfViewerRunner.addTask({
                        pageIndex: i,
                        message: msg,
                        zoomFactor: proxy.pdfViewer.magnificationModule.zoomFactor,
                        isTextNeed: true,
                        isLayout: true,
                        isSkipCharacterBounds: false,
                        isNeedToRender: true,
                        jsonObject: jsonObject,
                        isRenderText: true,
                        requestType: requestType
                    }, TaskPriorityLevel.Medium);
                    proxy.pdfViewerBase.pdfViewerRunner.onMessage(msg, (event: any) => {
                        if ((event.data.message.indexOf('extractText') !== -1)) {
                            proxy.pdfViewer.pdfRendererModule.textExtractionOnmessage(event, null, null);
                            if (event.data.pageIndex + 1 === endIndex) {
                                resolve(this.getSearchResults(searchText, searchTerms, searchResults, startIndex, endIndex,
                                                              proxy.findTextDocumentCollection));
                                proxy.findTextDocumentCollection = [];
                            }
                        }
                    });
                };
                const msg: string = 'extractText_' + PdfViewerUtils.createGUID();
                for (let i: number = startIndex; i < endIndex; i++) {
                    processPage(i, msg);
                }
            });
        } else {
            return Promise.resolve(this.getSearchResults(searchText, searchTerms, searchResults, startIndex, endIndex,
                                                         proxy.documentTextCollection));
        }
    }

    private getSearchResults(searchText: string | string[], searchTerms: string[], searchResults: Record<string, SearchResultModel[]>,
                             startIndex: number, endIndex: number, documentCollection: any):
        Record<string, SearchResultModel[]> | SearchResultModel[] {
        if (!Array.isArray(documentCollection)) {
            documentCollection = [documentCollection];
        }
        for (const term of searchTerms) {
            this.calculateSearchCount(term, documentCollection);
            searchResults[`${term}`] = [];
            for (let i: number = startIndex; i < endIndex; i++) {
                const matches: any = this.searchMatches[parseInt(i.toString(), 10)];
                if (!matches) { continue; }
                let pageIndex: number;
                let documentIndex: any;
                if (documentCollection.length === 1) {
                    pageIndex = parseInt(Object.keys(documentCollection[0])[0], 10);
                    documentIndex = documentCollection[0][parseInt(pageIndex.toString(), 10)];
                } else {
                    pageIndex = parseInt(Object.keys(documentCollection[parseInt(i.toString(), 10)])[0], 10);
                    documentIndex = documentCollection[parseInt(i.toString(), 10)][parseInt(pageIndex.toString(), 10)];
                }
                const characterBounds: any = documentIndex.textData ? documentIndex.textData : documentIndex.TextData;
                if (!characterBounds) { continue; }
                const pageResult: SearchResultModel = { pageIndex: i, bounds: [] };
                for (const matchIndex of matches) {
                    const textBoundsCollection: IPdfRectBounds[] =
                        this.calculateTextBounds(term, matchIndex, characterBounds, pageResult.pageIndex);
                    for (const rect of textBoundsCollection) {
                        pageResult.bounds.push(rect);
                    }
                }
                if (pageResult.bounds.length > 0) {
                    searchResults[`${term}`].push(pageResult);
                }
            }
        }
        return Array.isArray(searchText) ? searchResults : searchResults[searchText as string];
    }

    /**
     * Calculates the bounding rectangle for a given search text within the PDF based on character bounds.
     *
     * @param {string} searchText - The text string for which to calculate the bounding rectangle.
     * @param {any} matchIndex - The starting index of the match within the character bounds array.
     * @param {any} characterBounds - An array containing the bounds of each character on the page.
     * @param {any} pageIndex - Defines the page number
     * @private
     * @returns {IPdfRectBounds} - The calculated bounding rectangle, specifying the position and dimensions
     *                             (x, y, width, height) of the highlighted text area on the PDF page.
     */
    public calculateTextBounds(searchText: string, matchIndex: any, characterBounds: any, pageIndex: any): IPdfRectBounds[] {
        const textBoundscollection: IPdfRectBounds[] = [];
        let prevLength: number = 0;
        if (!Array.isArray(matchIndex)) {
            matchIndex = [matchIndex];
        }
        for (let i: number = 0; i < matchIndex.length; i++) {
            const startBound: any = characterBounds[parseInt(matchIndex[i as number].toString(), 10)].Bounds;
            let left: any = startBound.X;
            let top: any = startBound.Y;
            let width: number = 0;
            let height: any = startBound.Height;
            let lastRight: number = 0;
            let initialLength: number = searchText.length;
            let textLength: number = initialLength;
            if (matchIndex[0] === 0) {
                initialLength += 1;
            }
            if (matchIndex.length >= 1) {
                const start: number = matchIndex[i as number];
                let end: number;
                let textSlice: string;
                if (i === matchIndex.length - 1) {
                    textLength = initialLength - prevLength;
                    end = start + textLength;
                    textSlice = this.getTextSlice(start, end, characterBounds);
                    textLength = textSlice.length;
                } else {
                    end = matchIndex[i + 1];
                    textSlice = this.getTextSlice(start, end, characterBounds);
                    textLength = textSlice.length;
                    prevLength += textLength + 1;
                }
            }
            for (let k: number = 0; k < textLength; k++) {
                const index: number = matchIndex && !isNullOrUndefined(matchIndex.length) && matchIndex.length > 1 ?
                    matchIndex[i as number] : matchIndex[i as number];
                const currentBound: any = characterBounds[parseInt((index + k).toString(), 10)].Bounds;
                height = Math.max(height, currentBound.Height);
                if (k === textLength - 1) {
                    lastRight = currentBound.Right;
                    width = lastRight - left;
                    const pageDetails: any = this.pdfViewerBase.pageSize[parseInt(pageIndex.toString(), 10)];
                    const docHeight: any = this.pdfViewerBase.ConvertPixelToPoint(pageDetails.height);
                    const docWidth: any = this.pdfViewerBase.ConvertPixelToPoint(pageDetails.width);
                    switch (pageDetails.rotation) {
                    case 0:
                        left = startBound.X;
                        top = startBound.Y;
                        break;
                    case 1:
                        left = docHeight - startBound.Y - height;
                        top = startBound.X;
                        [width, height] = [height, width];
                        break;
                    case 2:
                        left = docWidth - lastRight;
                        top = docHeight - startBound.Y - height;
                        break;
                    case 3:
                        left = docWidth - docHeight + startBound.Top;
                        top = docHeight - startBound.X - width;
                        [width, height] = [height, width];
                        break;
                    }
                    const boundsObject: IPdfRectBounds  = {
                        x: left,
                        y: top,
                        width: width,
                        height: height
                    };
                    textBoundscollection.push(boundsObject);
                }
            }
        }
        return textBoundscollection;
    }

    private getTextSlice(start: number, end: number, characterBounds: any[]): string {
        let textSlice: string = '';
        for (let j: number = start; j < end; j++) {
            if (characterBounds[j as number] && characterBounds[j as number].Text) {
                textSlice += characterBounds[j as number].Text;
            }
        }
        return textSlice.replace(/[\s\r\n]+$/, '');
    }


    /**
     * @private
     * @returns {void}
     */
    public getModuleName(): string {
        return 'TextSearch';
    }
}
